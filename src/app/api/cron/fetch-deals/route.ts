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

// Vercel Cron job protection
const CRON_SECRET = process.env.CRON_SECRET

interface FetchResult {
  citySlug: string
  airport: string
  dealsFound: number
  dealsSaved: number
  curatedCount: number
  exceptionalCount: number
  instantAlertsSent: number
  errors: string[]
}

export async function GET(request: NextRequest) {
  // Verify cron secret (optional but recommended)
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[Cron] Starting fetch-deals job')

  const results: FetchResult[] = []
  const isSecondaryDay = isSecondaryFetchDay()
  
  // Get cities with active subscribers (only fetch for cities that need it)
  const allActiveCities = await getCitiesWithActiveSubscribers()

  // TEMPORARY: Only process NYC for ads campaign
  // To enable other cities, add them to this array
  const ENABLED_CITIES = ['new-york']
  const activeCities = allActiveCities.filter(city => ENABLED_CITIES.includes(city))

  if (activeCities.length === 0) {
    console.log('[Cron] No cities with active subscribers, skipping fetch')
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'No cities with active subscribers',
      results: [],
    })
  }

  console.log(`[Cron] Found ${activeCities.length} cities with active subscribers: ${activeCities.join(', ')}`)

  // Process each city
  for (const citySlug of activeCities) {
    const city = getCityBySlug(citySlug)
    if (!city) {
      console.warn(`[Cron] Unknown city slug: ${citySlug}`)
      continue
    }

    const result: FetchResult = {
      citySlug,
      airport: city.primaryAirport,
      dealsFound: 0,
      dealsSaved: 0,
      curatedCount: 0,
      exceptionalCount: 0,
      instantAlertsSent: 0,
      errors: [],
    }

    try {
      // Determine which airports to fetch
      const airportsToFetch = [city.primaryAirport]
      
      // On Sundays, also fetch secondary airports
      if (isSecondaryDay) {
        const secondaries = getSecondaryAirports(city)
        airportsToFetch.push(...secondaries)
        console.log(`[Cron] Secondary fetch day - including ${secondaries.join(', ')} for ${city.name}`)
      }

      // Fetch deals from all airports for this city
      const allDeals: FlightDeal[] = []
      
      for (const airport of airportsToFetch) {
        try {
          console.log(`[Cron] Fetching deals from ${airport} for ${city.name}`)
          const deals = await getFlightDeals(airport)
          
          // Add departure airport info to each deal
          const dealsWithAirport = deals.map(d => ({ ...d, departureAirport: airport }))
          allDeals.push(...dealsWithAirport)
          
          // Save raw deals to database
          if (deals.length > 0) {
            const { inserted, errors } = await saveFlightDeals(airport, citySlug, deals)
            result.dealsSaved += inserted
            if (errors > 0) {
              result.errors.push(`${errors} deals failed to save from ${airport}`)
            }
          }
          
          // Small delay between airport fetches to avoid rate limiting
          if (airportsToFetch.indexOf(airport) < airportsToFetch.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        } catch (error) {
          console.error(`[Cron] Error fetching ${airport}:`, error)
          result.errors.push(`Failed to fetch ${airport}: ${error}`)
        }
      }

      result.dealsFound = allDeals.length
      console.log(`[Cron] Found ${allDeals.length} total deals for ${city.name}`)

      // Skip curation if no deals were saved
      if (result.dealsSaved === 0) {
        console.log(`[Cron] No deals saved for ${city.name}, skipping curation`)
        results.push(result)
        continue
      }

      // Fetch saved deals from database for curation (ensures we only curate deals we can track)
      const { data: savedDeals } = await supabaseAdmin
        .from('flight_deals')
        .select('*')
        .eq('city_slug', citySlug)
        .gte('fetched_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .order('price', { ascending: true })
        .limit(50)

      if (!savedDeals || savedDeals.length === 0) {
        console.log(`[Cron] No recent deals in DB for ${city.name}, skipping curation`)
        results.push(result)
        continue
      }

      // Convert DB deals to FlightDeal format for curation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // AI Curation on saved deals only
      console.log(`[Cron] Running AI curation for ${city.name} with ${dealsForCuration.length} saved deals`)
      const curationResult = await curateDealsForCity(city, dealsForCuration)
      
      result.curatedCount = curationResult.curatedDeals.length
      console.log(`[Cron] AI selected ${curationResult.curatedDeals.length} deals for ${city.name}`)
      console.log(`[Cron] AI reasoning: ${curationResult.reasoning}`)

      // Save curated deals to database
      if (curationResult.curatedDeals.length > 0) {
        // We need to map the curated deals back to their database IDs
        // For now, we'll fetch the IDs by matching deal attributes
        // Map curated deals - they now have IDs from the database
        const curatedToSave = curationResult.curatedDeals.map((deal) => ({
          dealId: (deal as FlightDeal & { id?: string }).id,
          tier: deal.tier,
          description: deal.aiDescription,
          model: curationResult.model,
          reasoning: curationResult.reasoning,
        }))
        
        console.log(`[Cron] ${curatedToSave.filter(d => d.dealId).length}/${curatedToSave.length} curated deals have IDs`)

        // Filter out deals where we couldn't find the ID
        const validCurated = curatedToSave.filter(d => d.dealId)
        
        if (validCurated.length > 0) {
          await saveCuratedDeals(citySlug, validCurated as Array<{
            dealId: string
            tier: 'exceptional' | 'good' | 'notable'
            description: string
            model: string
            reasoning?: string
          }>)
        }

        // Count exceptional deals for logging (instant alerts disabled)
        const exceptionalDeals = getExceptionalDeals(curationResult.curatedDeals)
        result.exceptionalCount = exceptionalDeals.length
      }

      results.push(result)

    } catch (error) {
      console.error(`[Cron] Error processing ${city.name}:`, error)
      result.errors.push(`Processing failed: ${error}`)
      results.push(result)
    }

    // Delay between cities to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  // Clean old deals
  const cleanedDeals = await cleanOldDeals()
  console.log(`[Cron] Cleaned ${cleanedDeals} old deals`)

  const duration = Date.now() - startTime
  const summary = {
    citiesProcessed: results.length,
    totalDealsFound: results.reduce((sum, r) => sum + r.dealsFound, 0),
    totalDealsSaved: results.reduce((sum, r) => sum + r.dealsSaved, 0),
    totalCurated: results.reduce((sum, r) => sum + r.curatedCount, 0),
    totalExceptional: results.reduce((sum, r) => sum + r.exceptionalCount, 0),
    totalInstantAlerts: results.reduce((sum, r) => sum + r.instantAlertsSent, 0),
    oldDealsCleaned: cleanedDeals,
    isSecondaryFetchDay: isSecondaryDay,
  }

  console.log(`[Cron] Job completed in ${duration}ms:`, summary)

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    durationMs: duration,
    summary,
    results,
  })
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
