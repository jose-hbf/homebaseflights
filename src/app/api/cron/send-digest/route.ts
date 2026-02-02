import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  getCitiesWithActiveSubscribers,
  getActiveSubscribersForCity,
  getUnsentDigestDeals,
  markDealsAsDigestSent,
  recordAlertSent,
  updateSubscriberEmailTimestamp,
  wasAlertSentToSubscriber,
  supabaseAdmin,
} from '@/lib/supabase'
import { getCityBySlug } from '@/data/cities'
import { renderDigestEmail } from '@/emails/DigestEmail'
import { renderTrialReminderEmail } from '@/emails/TrialReminderEmail'
import { getPriceThreshold } from '@/utils/flightFilters'
import { processExpiredDeals } from '@/lib/deals/publisher'

// Vercel Cron job protection
const CRON_SECRET = process.env.CRON_SECRET

// Resend client
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Homebase Flights <deals@homebaseflights.com>'

// Minimum deals required to send a digest
const MIN_DEALS_FOR_DIGEST = 1

interface DigestResult {
  citySlug: string
  cityName: string
  subscribersCount: number
  dealsAvailable: number
  emailsSent: number
  emailsFailed: number
  skipped: boolean
  skipReason?: string
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[Digest] Starting daily digest job')

  const results: DigestResult[] = []

  // Get cities with active subscribers
  const activeCities = await getCitiesWithActiveSubscribers()

  if (activeCities.length === 0) {
    console.log('[Digest] No cities with active subscribers')
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'No cities with active subscribers',
      results: [],
    })
  }

  console.log(`[Digest] Processing ${activeCities.length} cities: ${activeCities.join(', ')}`)

  // Process each city
  for (const citySlug of activeCities) {
    const city = getCityBySlug(citySlug)
    if (!city) {
      console.warn(`[Digest] Unknown city slug: ${citySlug}`)
      continue
    }

    const result: DigestResult = {
      citySlug,
      cityName: city.name,
      subscribersCount: 0,
      dealsAvailable: 0,
      emailsSent: 0,
      emailsFailed: 0,
      skipped: false,
    }


    try {
      // Get unsent digest deals for this city
      const unsentDeals = await getUnsentDigestDeals(citySlug, { limit: 5 })
      result.dealsAvailable = unsentDeals.length

      // Skip if not enough deals
      if (unsentDeals.length < MIN_DEALS_FOR_DIGEST) {
        result.skipped = true
        result.skipReason = `Only ${unsentDeals.length} deals available (minimum: ${MIN_DEALS_FOR_DIGEST})`
        console.log(`[Digest] Skipping ${city.name}: ${result.skipReason}`)
        results.push(result)
        continue
      }

      // Get subscribers for this city
      const subscribers = await getActiveSubscribersForCity(citySlug)
      result.subscribersCount = subscribers.length

      if (subscribers.length === 0) {
        result.skipped = true
        result.skipReason = 'No active subscribers'
        results.push(result)
        continue
      }

      console.log(`[Digest] Sending digest to ${subscribers.length} subscribers in ${city.name} with ${unsentDeals.length} deals`)

      // Prepare deals for email
      const digestDeals = unsentDeals.map(curatedDeal => ({
        destination: curatedDeal.deal.destination,
        destinationCode: curatedDeal.deal.destination_code,
        country: curatedDeal.deal.country,
        price: curatedDeal.deal.price,
        departureDate: curatedDeal.deal.departure_date,
        returnDate: curatedDeal.deal.return_date,
        airline: curatedDeal.deal.airline,
        stops: curatedDeal.deal.stops,
        durationMinutes: curatedDeal.deal.duration_minutes,
        bookingLink: curatedDeal.deal.booking_link,
        aiDescription: curatedDeal.ai_description,
        tier: curatedDeal.ai_tier,
        departureAirport: curatedDeal.deal.departure_airport,
      }))

      // Send to each subscriber
      for (const subscriber of subscribers) {
        try {
          // Filter out deals already sent to this subscriber
          const dealsToSend = []
          for (const deal of unsentDeals) {
            const alreadySent = await wasAlertSentToSubscriber(subscriber.id, deal.id)
            if (!alreadySent) {
              dealsToSend.push(deal)
            }
          }

          // Skip if no new deals for this subscriber
          if (dealsToSend.length === 0) {
            continue
          }

          // Prepare deals for this subscriber's email
          const subscriberDeals = dealsToSend.map(curatedDeal => {
            const threshold = getPriceThreshold(curatedDeal.deal.country)
            const savingsPercent = curatedDeal.deal.price < threshold 
              ? Math.round((1 - curatedDeal.deal.price / threshold) * 100)
              : 0
            
            return {
              destination: curatedDeal.deal.destination,
              destinationCode: curatedDeal.deal.destination_code,
              country: curatedDeal.deal.country,
              price: curatedDeal.deal.price,
              departureDate: curatedDeal.deal.departure_date,
              returnDate: curatedDeal.deal.return_date,
              airline: curatedDeal.deal.airline,
              stops: curatedDeal.deal.stops,
              durationMinutes: curatedDeal.deal.duration_minutes,
              bookingLink: curatedDeal.deal.booking_link,
              aiDescription: curatedDeal.ai_description,
              tier: curatedDeal.ai_tier,
              departureAirport: curatedDeal.deal.departure_airport,
              savingsPercent,
            }
          })

          // Render email
          const html = renderDigestEmail({
            deals: subscriberDeals,
            cityName: city.name,
            subscriberEmail: subscriber.email,
          })

          // Build subject line
          const destinations = subscriberDeals.slice(0, 3).map(d => d.destination)
          const lowestPrice = Math.min(...subscriberDeals.map(d => d.price))
          const subject = `✈️ ${subscriberDeals.length} deal${subscriberDeals.length > 1 ? 's' : ''} from ${city.name} — ${destinations.join(', ')} from $${lowestPrice}`

          // Send email
          const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: subscriber.email,
            subject,
            html,
          })

          if (error) {
            console.error(`[Digest] Failed to send to ${subscriber.email}:`, error)
            result.emailsFailed++
          } else {
            result.emailsSent++

            // Record that these deals were sent to this subscriber
            for (const deal of dealsToSend) {
              await recordAlertSent(subscriber.id, deal.id, 'digest')
            }

            // Update subscriber's last email timestamp
            await updateSubscriberEmailTimestamp(subscriber.id, 'digest')
          }

          // Small delay between emails to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          console.error(`[Digest] Error sending to ${subscriber.email}:`, error)
          result.emailsFailed++
        }
      }

      // Mark deals as sent in digest (globally, not per subscriber)
      if (result.emailsSent > 0) {
        await markDealsAsDigestSent(unsentDeals.map(d => d.id))
      }

      results.push(result)

    } catch (error) {
      console.error(`[Digest] Error processing ${city.name}:`, error)
      result.skipped = true
      result.skipReason = `Error: ${error}`
      results.push(result)
    }

    // Delay between cities
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // === TRIAL REMINDERS (Day 5) ===
  // Check for subscribers whose trial ends in 2 days
  let trialRemindersSent = 0
  try {
    const now = new Date()
    const targetDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    const minDate = new Date(targetDate.getTime() - 12 * 60 * 60 * 1000)
    const maxDate = new Date(targetDate.getTime() + 12 * 60 * 60 * 1000)

    const { data: trialSubscribers } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, home_city, trial_ends_at, created_at')
      .eq('status', 'trial')
      .gte('trial_ends_at', minDate.toISOString())
      .lte('trial_ends_at', maxDate.toISOString())

    if (trialSubscribers && trialSubscribers.length > 0) {
      console.log(`[TrialReminders] Found ${trialSubscribers.length} subscribers with trial ending in 2 days`)

      for (const subscriber of trialSubscribers) {
        const city = getCityBySlug(subscriber.home_city)
        if (!city) continue

        // Get deals sent count
        const { count } = await supabaseAdmin
          .from('alerts_sent')
          .select('*', { count: 'exact', head: true })
          .eq('subscriber_id', subscriber.id)
          .gte('sent_at', subscriber.created_at)

        const dealsFound = count || 0

        const html = renderTrialReminderEmail({
          subscriberEmail: subscriber.email,
          cityName: city.name,
          daysLeft: 2,
          dealsFound,
          totalSavings: dealsFound * 150, // Estimate $150 avg savings per deal
          topDestinations: [],
        })

        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject: `⏰ Your free trial ends in 2 days`,
          html,
        })

        if (!error) {
          trialRemindersSent++
          console.log(`[TrialReminders] Sent to ${subscriber.email}`)
        }
      }
    }
  } catch (error) {
    console.error('[TrialReminders] Error:', error)
  }

  // === DEAL ARCHIVE PUBLISHING ===
  // Process expired deals and publish top ones to the archive (for SEO)
  let dealsPublished = 0
  try {
    console.log('[DealArchive] Processing expired deals for publishing...')
    const publishResult = await processExpiredDeals()
    dealsPublished = publishResult.published
    
    if (publishResult.errors.length > 0) {
      console.warn('[DealArchive] Errors during publishing:', publishResult.errors)
    }
    
    console.log(`[DealArchive] Marked ${publishResult.markedExpired} as expired, published ${publishResult.published} deals`)
  } catch (error) {
    console.error('[DealArchive] Error:', error)
  }

  const duration = Date.now() - startTime
  const summary = {
    citiesProcessed: results.length,
    citiesWithDigest: results.filter(r => !r.skipped).length,
    totalEmailsSent: results.reduce((sum, r) => sum + r.emailsSent, 0),
    totalEmailsFailed: results.reduce((sum, r) => sum + r.emailsFailed, 0),
    citiesSkipped: results.filter(r => r.skipped).length,
    trialRemindersSent,
    dealsPublished,
  }

  console.log(`[Digest] Job completed in ${duration}ms:`, summary)

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
