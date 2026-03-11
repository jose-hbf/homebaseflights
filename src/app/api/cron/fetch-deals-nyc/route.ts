import { NextRequest, NextResponse } from 'next/server'
import { getFlightDeals } from '@/lib/amadeus' // Changed from serpapi to amadeus
import {
  saveFlightDealsImproved,
  filterNYCDeals,
  logDealSync,
  cleanOldDeals,
  getCitiesWithActiveSubscribers,
  saveCuratedDeals,
  supabaseAdmin,
} from '@/lib/supabase-improved'
import { getCityBySlug } from '@/data/cities'
import { curateDealsForCity, getExceptionalDeals } from '@/lib/dealCuration'
import { FlightDeal } from '@/types/flights'
import { isValuableDestination, getDestinationScore } from '@/lib/destination-filters'

// ============================================
// NYC-FOCUSED CONFIGURATION
// ============================================

const CRON_SECRET = process.env.CRON_SECRET

// ONLY NYC airports for now
const ACTIVE_CITIES = ['new-york'] // Restrict to NYC only
const NYC_AIRPORTS = ['JFK', 'EWR', 'LGA']

// NYC-specific priority destinations for international deals
const NYC_PRIORITY_DESTINATIONS = {
  europe: [
    'London', 'Paris', 'Rome', 'Barcelona', 'Madrid', 'Amsterdam',
    'Lisbon', 'Athens', 'Dublin', 'Copenhagen', 'Stockholm', 'Reykjavik'
  ],
  asia: [
    'Tokyo', 'Bangkok', 'Singapore', 'Hong Kong', 'Seoul', 'Bali',
    'Dubai', 'Tel Aviv', 'Delhi', 'Mumbai'
  ],
  latam: [
    'Mexico City', 'Cancun', 'Buenos Aires', 'Lima', 'Bogota',
    'Cartagena', 'São Paulo', 'Rio de Janeiro', 'Santiago'
  ],
  caribbean: [
    'Nassau', 'Montego Bay', 'Aruba', 'Turks and Caicos', 'Barbados'
  ]
}

interface FetchResult {
  citySlug: string
  airports: string[]
  dealsFound: number
  dealsFilteredQuality: number
  dealsFilteredInternational: number
  dealsSaved: number
  dealsUpdated: number
  dealsFailed: number
  curatedCount: number
  exceptionalCount: number
  topDestinations: Array<{
    destination: string
    price: number
    score: number
  }>
  errors: string[]
  processingTime: number
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('======================================')
  console.log('[NYC Fetch] Starting NYC-focused deal fetch')
  console.log(`[NYC Fetch] Processing airports: ${NYC_AIRPORTS.join(', ')}`)
  console.log('======================================')

  const results: FetchResult[] = []

  // Process only NYC
  for (const citySlug of ACTIVE_CITIES) {
    const cityStartTime = Date.now()

    const result: FetchResult = {
      citySlug,
      airports: NYC_AIRPORTS,
      dealsFound: 0,
      dealsFilteredQuality: 0,
      dealsFilteredInternational: 0,
      dealsSaved: 0,
      dealsUpdated: 0,
      dealsFailed: 0,
      curatedCount: 0,
      exceptionalCount: 0,
      topDestinations: [],
      errors: [],
      processingTime: 0
    }

    try {
      // Fetch deals from all NYC airports
      const allDeals: FlightDeal[] = []

      for (const airport of NYC_AIRPORTS) {
        try {
          console.log(`\n[NYC Fetch] Fetching deals from ${airport}...`)
          const deals = await getFlightDeals(airport)

          // Add airport info to each deal
          const dealsWithAirport = deals.map(d => ({
            ...d,
            departureAirport: airport
          }))

          allDeals.push(...dealsWithAirport)
          console.log(`[NYC Fetch] Found ${deals.length} deals from ${airport}`)

          // Rate limiting between airport fetches
          if (NYC_AIRPORTS.indexOf(airport) < NYC_AIRPORTS.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        } catch (error: any) {
          const errorMsg = `Failed to fetch ${airport}: ${error.message}`
          console.error(`[NYC Fetch] ${errorMsg}`)
          result.errors.push(errorMsg)
        }
      }

      result.dealsFound = allDeals.length
      console.log(`\n[NYC Fetch] Total raw deals found: ${allDeals.length}`)

      // STEP 1: Filter by destination quality
      const qualityDeals = allDeals.filter(deal => {
        return isValuableDestination(deal.destination, deal.destinationCode, deal.country)
      })

      result.dealsFilteredQuality = qualityDeals.length
      console.log(`[NYC Fetch] After quality filter: ${qualityDeals.length} deals`)

      // STEP 2: Apply NYC-specific international filters with detailed stats
      const filterResult = filterNYCDeals(qualityDeals, {
        internationalOnly: true,
        maxPriceEurope: 900,
        maxPriceAsia: 1100,
        maxPriceLatam: 600,
        maxPriceCaribbean: 600,
        maxPriceDefault: 700,
        minFlightHours: 3,
        minDiscountPercent: 20
      })

      const internationalDeals = filterResult.deals
      const filterStats = filterResult.stats

      result.dealsFilteredInternational = internationalDeals.length

      // Log detailed filter statistics
      console.log(`\n[NYC Fetch] FILTER BREAKDOWN:`)
      console.log(`  ├─ Total deals to filter: ${filterStats.totalDeals}`)
      console.log(`  ├─ Domestic filter: ${filterStats.failedDomestic} removed (${filterStats.passedDomestic} passed)`)
      console.log(`  ├─ Distance filter: ${filterStats.failedDistance} removed (${filterStats.passedDistance} passed)`)
      console.log(`  ├─ Price filter: ${filterStats.failedPrice} removed (${filterStats.passedPrice} passed)`)
      console.log(`  ├─ Discount filter: ${filterStats.failedDiscount} removed (${filterStats.passedDiscount} passed)`)
      console.log(`  └─ FINAL: ${internationalDeals.length} deals passed all filters\n`)

      // Skip if no deals pass filters
      if (internationalDeals.length === 0) {
        console.log('[NYC Fetch] No deals passed filters')
        results.push(result)
        continue
      }

      // Score and rank deals
      const scoredDeals = internationalDeals.map(deal => ({
        ...deal,
        destinationScore: getDestinationScore(deal.destination, deal.destinationCode, deal.country)
      }))
      .sort((a, b) => {
        // Sort by score first, then by price
        if (b.destinationScore !== a.destinationScore) {
          return b.destinationScore - a.destinationScore
        }
        return a.price - b.price
      })

      // Get top destinations for reporting
      result.topDestinations = scoredDeals.slice(0, 10).map(d => ({
        destination: d.destination,
        price: d.price,
        score: d.destinationScore
      }))

      console.log('\n[NYC Fetch] Top 10 destinations:')
      result.topDestinations.forEach((d, i) => {
        console.log(`  ${i + 1}. ${d.destination}: $${d.price} (score: ${d.score})`)
      })

      // STEP 3: Save deals with improved logic
      console.log('\n[NYC Fetch] Starting to save deals...')
      const saveResult = await saveFlightDealsImproved(
        'NYC', // Use NYC as the primary airport identifier
        citySlug,
        scoredDeals
      )

      result.dealsSaved = saveResult.inserted
      result.dealsUpdated = saveResult.updated
      result.dealsFailed = saveResult.errors

      console.log(`[NYC Fetch] Save results:`, {
        saved: saveResult.inserted,
        updated: saveResult.updated,
        failed: saveResult.errors,
        successRate: `${Math.round((saveResult.inserted / scoredDeals.length) * 100)}%`
      })

      // Log sync results
      await logDealSync({
        city: citySlug,
        timestamp: new Date().toISOString(),
        attempted: scoredDeals.length,
        saved: saveResult.inserted,
        failed: saveResult.errors,
        errors: saveResult.errorDetails.slice(0, 10).map(e => e.error),
        duration_ms: Date.now() - cityStartTime
      })

      // Skip curation if no deals were saved
      if (result.dealsSaved === 0) {
        console.log('[NYC Fetch] No deals saved, skipping curation')
        result.processingTime = Date.now() - cityStartTime
        results.push(result)
        continue
      }

      // STEP 4: Curate saved deals
      console.log('\n[NYC Fetch] Fetching saved deals for curation...')
      const { data: savedDeals } = await supabaseAdmin
        .from('flight_deals')
        .select('*')
        .eq('city_slug', citySlug)
        .gte('fetched_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
        .order('price', { ascending: true })
        .limit(30)

      if (savedDeals && savedDeals.length > 0) {
        console.log(`[NYC Fetch] Found ${savedDeals.length} recent deals for curation`)

        // Convert for curation
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

        // Run AI curation
        const city = getCityBySlug(citySlug)
        if (city) {
          const curationResult = await curateDealsForCity(city, dealsForCuration)
          result.curatedCount = curationResult.curatedDeals.length

          console.log(`[NYC Fetch] AI curated ${result.curatedCount} deals`)

          // Save curated deals
          if (curationResult.curatedDeals.length > 0) {
            const curatedToSave = curationResult.curatedDeals
              .filter(deal => (deal as any).id)
              .map((deal) => ({
                dealId: (deal as any).id,
                tier: deal.tier,
                description: deal.aiDescription,
                model: curationResult.model,
                reasoning: curationResult.reasoning,
              }))

            if (curatedToSave.length > 0) {
              await saveCuratedDeals(citySlug, curatedToSave as any)
              console.log(`[NYC Fetch] Saved ${curatedToSave.length} curated deals to DB`)
            }
          }

          // Check for exceptional deals
          const exceptionalDeals = getExceptionalDeals(curationResult.curatedDeals)
          result.exceptionalCount = exceptionalDeals.length

          if (exceptionalDeals.length > 0) {
            console.log(`[NYC Fetch] Found ${exceptionalDeals.length} exceptional deals!`)
          }
        }
      }

      result.processingTime = Date.now() - cityStartTime

    } catch (error: any) {
      console.error(`[NYC Fetch] Critical error:`, error)
      result.errors.push(`Critical error: ${error.message}`)
      result.processingTime = Date.now() - cityStartTime
    }

    results.push(result)
  }

  // Clean old deals (older than 7 days)
  try {
    const deleted = await cleanOldDeals()
    console.log(`\n[NYC Fetch] Cleaned ${deleted} old deals from database`)
  } catch (error) {
    console.error('[NYC Fetch] Error cleaning old deals:', error)
  }

  const totalDuration = Date.now() - startTime

  // Summary
  const summary = {
    timestamp: new Date().toISOString(),
    durationMs: totalDuration,
    citiesProcessed: results.length,
    totalDealsFound: results.reduce((sum, r) => sum + r.dealsFound, 0),
    totalDealsQualityFiltered: results.reduce((sum, r) => sum + r.dealsFilteredQuality, 0),
    totalDealsInternational: results.reduce((sum, r) => sum + r.dealsFilteredInternational, 0),
    totalDealsSaved: results.reduce((sum, r) => sum + r.dealsSaved, 0),
    totalDealsFailed: results.reduce((sum, r) => sum + r.dealsFailed, 0),
    totalCurated: results.reduce((sum, r) => sum + r.curatedCount, 0),
    totalExceptional: results.reduce((sum, r) => sum + r.exceptionalCount, 0),
    overallSuccessRate: results.length > 0
      ? Math.round((results[0].dealsSaved / (results[0].dealsSaved + results[0].dealsFailed)) * 100)
      : 0
  }

  console.log('\n======================================')
  console.log('[NYC Fetch] FINAL SUMMARY:')
  console.log(`  Total deals found: ${summary.totalDealsFound}`)
  console.log(`  After quality filter: ${summary.totalDealsQualityFiltered}`)
  console.log(`  After international filter: ${summary.totalDealsInternational}`)
  console.log(`  Successfully saved: ${summary.totalDealsSaved}`)
  console.log(`  Failed to save: ${summary.totalDealsFailed}`)
  console.log(`  Success rate: ${summary.overallSuccessRate}%`)
  console.log(`  Processing time: ${summary.durationMs}ms`)
  console.log('======================================\n')

  return NextResponse.json({
    success: true,
    summary,
    results,
  })
}

// Support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}