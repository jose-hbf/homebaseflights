import { NextRequest, NextResponse } from 'next/server'
import { getFlightDeals } from '@/lib/serpapi'
import { 
  saveFlightDeals, 
  cleanOldDeals,
  getCitiesWithActiveSubscribers,
  saveCuratedDeals,
  getUnsentExceptionalDeals,
  getActiveSubscribersForCity,
  markDealsAsInstantSent,
  recordAlertSent,
  updateSubscriberEmailTimestamp,
} from '@/lib/supabase'
import { getCityBySlug, isSecondaryFetchDay, getSecondaryAirports } from '@/data/cities'
import { curateDealsForCity, getExceptionalDeals } from '@/lib/dealCuration'
import { FlightDeal } from '@/types/flights'
import { Resend } from 'resend'
import { renderInstantAlertEmail } from '@/emails/InstantAlertEmail'

// Vercel Cron job protection
const CRON_SECRET = process.env.CRON_SECRET

// Resend for sending instant alerts
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'alerts@homebaseflights.com'
const FROM_NAME = 'Homebase Flights'

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
  const activeCities = await getCitiesWithActiveSubscribers()
  
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

      // Skip curation if no deals
      if (allDeals.length === 0) {
        results.push(result)
        continue
      }

      // AI Curation
      console.log(`[Cron] Running AI curation for ${city.name}`)
      const curationResult = await curateDealsForCity(city, allDeals)
      
      result.curatedCount = curationResult.curatedDeals.length
      console.log(`[Cron] AI selected ${curationResult.curatedDeals.length} deals for ${city.name}`)
      console.log(`[Cron] AI reasoning: ${curationResult.reasoning}`)

      // Save curated deals to database
      if (curationResult.curatedDeals.length > 0) {
        // We need to map the curated deals back to their database IDs
        // For now, we'll fetch the IDs by matching deal attributes
        const curatedToSave = await Promise.all(
          curationResult.curatedDeals.map(async (deal) => {
            // Find the deal ID in the database by matching key attributes
            const { data } = await import('@/lib/supabase').then(m => 
              m.supabaseAdmin
                .from('flight_deals')
                .select('id')
                .eq('city_slug', citySlug)
                .eq('destination_code', deal.destinationCode)
                .eq('departure_date', deal.departureDate)
                .eq('return_date', deal.returnDate)
                .eq('price', deal.price)
                .limit(1)
                .single()
            )
            
            return {
              dealId: data?.id,
              tier: deal.tier,
              description: deal.aiDescription,
              model: curationResult.model,
              reasoning: curationResult.reasoning,
            }
          })
        )

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

        // Check for exceptional deals and send instant alerts
        const exceptionalDeals = getExceptionalDeals(curationResult.curatedDeals)
        result.exceptionalCount = exceptionalDeals.length

        if (exceptionalDeals.length > 0) {
          console.log(`[Cron] Found ${exceptionalDeals.length} exceptional deals for ${city.name}, sending instant alerts`)
          
          // Get subscribers for this city
          const subscribers = await getActiveSubscribersForCity(citySlug)
          
          // Get the curated deal records from DB for tracking
          const unsentExceptional = await getUnsentExceptionalDeals(citySlug)
          
          for (const subscriber of subscribers) {
            // Only send instant alerts to subscribers who want them
            if (subscriber.email_frequency !== 'instant') {
              continue
            }

            try {
              // Send email for each exceptional deal (or batch them)
              const dealToSend = unsentExceptional[0] // Send one at a time
              if (!dealToSend) continue

              const html = renderInstantAlertEmail({
                deal: {
                  destination: dealToSend.deal.destination,
                  destinationCode: dealToSend.deal.destination_code,
                  country: dealToSend.deal.country,
                  price: dealToSend.deal.price,
                  departureDate: dealToSend.deal.departure_date,
                  returnDate: dealToSend.deal.return_date,
                  airline: dealToSend.deal.airline,
                  stops: dealToSend.deal.stops,
                  durationMinutes: dealToSend.deal.duration_minutes,
                  bookingLink: dealToSend.deal.booking_link,
                },
                aiDescription: dealToSend.ai_description,
                cityName: city.name,
                departureAirport: dealToSend.deal.departure_airport,
                subscriberEmail: subscriber.email,
              })

              const { error } = await resend.emails.send({
                from: `${FROM_NAME} <${FROM_EMAIL}>`,
                to: subscriber.email,
                subject: `🔥 ${dealToSend.deal.departure_airport} → ${dealToSend.deal.destination} $${dealToSend.deal.price} — Exceptional Deal`,
                html,
              })

              if (!error) {
                result.instantAlertsSent++
                await recordAlertSent(subscriber.id, dealToSend.id, 'instant')
                await updateSubscriberEmailTimestamp(subscriber.id, 'instant')
              } else {
                console.error(`[Cron] Failed to send instant alert to ${subscriber.email}:`, error)
              }
            } catch (error) {
              console.error(`[Cron] Error sending instant alert:`, error)
            }
          }

          // Mark exceptional deals as sent (even if some emails failed)
          if (unsentExceptional.length > 0) {
            await markDealsAsInstantSent(unsentExceptional.map(d => d.id))
          }
        }
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
