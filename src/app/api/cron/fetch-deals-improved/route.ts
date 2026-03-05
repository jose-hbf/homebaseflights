import { NextRequest, NextResponse } from 'next/server'
import { getFlightDeals } from '@/lib/serpapi'
import {
  saveFlightDeals,
  cleanOldDeals,
  getCitiesWithActiveSubscribers,
  saveCuratedDeals,
  supabaseAdmin,
} from '@/lib/supabase'
import { getCityBySlug, isSecondaryFetchDay, getSecondaryAirports } from '@/data/cities'
import { curateDealsForCity, getExceptionalDeals } from '@/lib/dealCuration'
import { FlightDeal } from '@/types/flights'
import { isValuableDestination, filterDealsByDestinationValue, getDestinationScore } from '@/lib/destination-filters'

// Vercel Cron job protection
const CRON_SECRET = process.env.CRON_SECRET

interface FetchResult {
  citySlug: string
  airport: string
  dealsFound: number
  dealsFiltered: number
  dealsSaved: number
  curatedCount: number
  exceptionalCount: number
  instantAlertsSent: number
  topDestinations: string[]
  errors: string[]
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[Fetch Improved] Starting improved fetch-deals job')

  const results: FetchResult[] = []
  const isSecondaryDay = isSecondaryFetchDay()

  // Get cities with active subscribers
  const allActiveCities = await getCitiesWithActiveSubscribers()

  // For now, still focus on main cities but can be expanded
  const ENABLED_CITIES = ['new-york', 'los-angeles', 'chicago', 'san-francisco', 'miami', 'boston']
  const activeCities = allActiveCities.filter(city => ENABLED_CITIES.includes(city))

  if (activeCities.length === 0) {
    console.log('[Fetch Improved] No enabled cities with active subscribers')
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'No enabled cities with active subscribers',
      results: [],
    })
  }

  console.log(`[Fetch Improved] Processing ${activeCities.length} cities: ${activeCities.join(', ')}`)

  // Process each city
  for (const citySlug of activeCities) {
    const city = getCityBySlug(citySlug)
    if (!city) {
      console.warn(`[Fetch Improved] Unknown city slug: ${citySlug}`)
      continue
    }

    const result: FetchResult = {
      citySlug,
      airport: city.primaryAirport,
      dealsFound: 0,
      dealsFiltered: 0,
      dealsSaved: 0,
      curatedCount: 0,
      exceptionalCount: 0,
      instantAlertsSent: 0,
      topDestinations: [],
      errors: [],
    }

    try {
      // Determine which airports to fetch
      const airportsToFetch = [city.primaryAirport]

      // On Sundays, also fetch secondary airports
      if (isSecondaryDay) {
        const secondaries = getSecondaryAirports(city)
        airportsToFetch.push(...secondaries)
        console.log(`[Fetch Improved] Secondary day - including ${secondaries.join(', ')} for ${city.name}`)
      }

      // Fetch deals from all airports for this city
      const allDeals: FlightDeal[] = []

      for (const airport of airportsToFetch) {
        try {
          console.log(`[Fetch Improved] Fetching deals from ${airport}`)
          const deals = await getFlightDeals(airport)

          // Add departure airport info to each deal
          const dealsWithAirport = deals.map(d => ({ ...d, departureAirport: airport }))
          allDeals.push(...dealsWithAirport)

          // Small delay between airport fetches
          if (airportsToFetch.indexOf(airport) < airportsToFetch.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        } catch (error) {
          console.error(`[Fetch Improved] Error fetching ${airport}:`, error)
          result.errors.push(`Failed to fetch ${airport}: ${error}`)
        }
      }

      result.dealsFound = allDeals.length
      console.log(`[Fetch Improved] Found ${allDeals.length} raw deals for ${city.name}`)

      // CRITICAL: Filter deals by destination value
      const valuableDeals = allDeals.filter(deal => {
        return isValuableDestination(deal.destination, deal.destinationCode, deal.country)
      })

      result.dealsFiltered = valuableDeals.length
      console.log(`[Fetch Improved] Filtered to ${valuableDeals.length} valuable deals (removed ${allDeals.length - valuableDeals.length} low-value destinations)`)

      // Skip if no valuable deals
      if (valuableDeals.length === 0) {
        console.log(`[Fetch Improved] No valuable deals found for ${city.name}`)
        results.push(result)
        continue
      }

      // Score and sort deals
      const scoredDeals = valuableDeals.map(deal => ({
        ...deal,
        destinationScore: getDestinationScore(deal.destination, deal.destinationCode, deal.country)
      }))

      // Get top destinations for logging
      const topDeals = scoredDeals
        .sort((a, b) => b.destinationScore - a.destinationScore)
        .slice(0, 5)
      result.topDestinations = topDeals.map(d => `${d.destination} ($${d.price})`)

      console.log(`[Fetch Improved] Top destinations for ${city.name}: ${result.topDestinations.join(', ')}`)

      // Save only valuable deals to database
      const { inserted, errors } = await saveFlightDeals(city.primaryAirport, citySlug, valuableDeals)
      result.dealsSaved = inserted
      if (errors > 0) {
        result.errors.push(`${errors} deals failed to save`)
      }

      console.log(`[Fetch Improved] Saved ${inserted} valuable deals for ${city.name}`)

      // Skip curation if no deals were saved
      if (result.dealsSaved === 0) {
        console.log(`[Fetch Improved] No deals saved for ${city.name}, skipping curation`)
        results.push(result)
        continue
      }

      // Fetch saved deals for curation
      const { data: savedDeals } = await supabaseAdmin
        .from('flight_deals')
        .select('*')
        .eq('city_slug', citySlug)
        .gte('fetched_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('price', { ascending: true })
        .limit(50)

      if (!savedDeals || savedDeals.length === 0) {
        console.log(`[Fetch Improved] No recent deals in DB for ${city.name}`)
        results.push(result)
        continue
      }

      // Convert DB deals for curation
      const dealsForCuration: FlightDeal[] = savedDeals.map((d: any) => ({
        id: d.id,
        destination: d.destination,
        destinationCode: d.destination_code,
        country: d.country,
        price: d.price,
        departureDate: d.departure_date,
        returnDate: d.return_date,
        airline: d.airline,
        airlineCode: d.airline_code,
        durationMinutes: d.duration_minutes,
        stops: d.stops,
        bookingLink: d.booking_link,
        thumbnail: d.thumbnail,
        departureAirport: d.departure_airport,
      }))

      // AI Curation on saved deals
      console.log(`[Fetch Improved] Running AI curation for ${city.name}`)
      const curationResult = await curateDealsForCity(city, dealsForCuration)

      result.curatedCount = curationResult.curatedDeals.length
      console.log(`[Fetch Improved] AI selected ${curationResult.curatedDeals.length} deals for ${city.name}`)

      // Save curated deals
      if (curationResult.curatedDeals.length > 0) {
        const curatedToSave = curationResult.curatedDeals.map((deal) => ({
          dealId: (deal as FlightDeal & { id?: string }).id,
          tier: deal.tier,
          description: deal.aiDescription,
          model: curationResult.model,
          reasoning: curationResult.reasoning,
        }))

        const validCurated = curatedToSave.filter(d => d.dealId)

        if (validCurated.length > 0) {
          await saveCuratedDeals(citySlug, validCurated as Array<{
            dealId: string
            tier: 'exceptional' | 'good' | 'notable'
            description: string
            model: string
            reasoning?: string
          }>)
          console.log(`[Fetch Improved] Saved ${validCurated.length} curated deals`)
        }
      }

      // Check for exceptional deals for instant alerts
      const exceptionalDeals = getExceptionalDeals(curationResult.curatedDeals)
      result.exceptionalCount = exceptionalDeals.length

      if (exceptionalDeals.length > 0) {
        console.log(`[Fetch Improved] Found ${exceptionalDeals.length} exceptional deals for instant alerts`)
        // Instant alert logic would go here
      }

      results.push(result)

    } catch (error) {
      console.error(`[Fetch Improved] Error processing ${city.name}:`, error)
      result.errors.push(`Processing error: ${error}`)
      results.push(result)
    }
  }

  // Clean old deals (older than 7 days)
  try {
    const deleted = await cleanOldDeals(7)
    console.log(`[Fetch Improved] Cleaned ${deleted} old deals`)
  } catch (error) {
    console.error('[Fetch Improved] Error cleaning old deals:', error)
  }

  const duration = Date.now() - startTime
  const summary = {
    citiesProcessed: results.length,
    totalDealsFound: results.reduce((sum, r) => sum + r.dealsFound, 0),
    totalDealsFiltered: results.reduce((sum, r) => sum + r.dealsFiltered, 0),
    totalDealsSaved: results.reduce((sum, r) => sum + r.dealsSaved, 0),
    totalCurated: results.reduce((sum, r) => sum + r.curatedCount, 0),
    totalExceptional: results.reduce((sum, r) => sum + r.exceptionalCount, 0),
  }

  console.log(`[Fetch Improved] Job completed in ${duration}ms:`, summary)

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    durationMs: duration,
    summary,
    results,
  })
}

// Support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}