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
  getRecentlySentDestinations,
  recordDestinationSent,
  cleanOldDestinationAlerts,
  getTrialSubscribersForNurtureEmails,
  recordNurtureEmailSent,
  supabaseAdmin,
} from '@/lib/supabase'
import { getCityBySlug } from '@/data/cities'
import { renderDigestEmail } from '@/emails/DigestEmail'
import { renderTrialReminderEmail } from '@/emails/TrialReminderEmail'
import { renderNurtureEmail2 } from '@/emails/NurtureEmail2'
import { renderNurtureEmail3 } from '@/emails/NurtureEmail3'
import { renderNurtureEmail4 } from '@/emails/NurtureEmail4'
import { renderNurtureEmail5 } from '@/emails/NurtureEmail5'
import { renderNurtureEmail6 } from '@/emails/NurtureEmail6'
import { getPriceThreshold } from '@/utils/flightFilters'
import { processExpiredDeals } from '@/lib/deals/publisher'

// Nurture email schedule: email number -> days since signup
const NURTURE_SCHEDULE: Record<number, number> = {
  2: 3,  // Email 2 on Day 3
  3: 7,  // Email 3 on Day 7
  4: 10, // Email 4 on Day 10
  5: 12, // Email 5 on Day 12
  6: 14, // Email 6 on Day 14
}

const NURTURE_SUBJECTS: Record<number, string> = {
  2: 'How we find flights 60% cheaper',
  3: 'Your first week: here\'s what we found from New York',
  4: 'One flight pays for 10 years of membership',
  5: 'Your trial ends in 2 days',
  6: 'Last day of your free trial',
}

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
  const allActiveCities = await getCitiesWithActiveSubscribers()

  // TEMPORARY: Only process NYC for ads campaign
  // To enable other cities, add them to this array
  const ENABLED_CITIES = ['new-york']
  const activeCities = allActiveCities.filter(city => ENABLED_CITIES.includes(city))

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
          // Get destinations recently sent to this subscriber (7-day cooldown)
          const recentDestinations = await getRecentlySentDestinations(subscriber.id, 7)

          // Filter out deals:
          // 1. Already sent to this subscriber (by curated_deal_id)
          // 2. Same destination sent within 7 days
          const dealsToSend = []
          for (const deal of unsentDeals) {
            // Check if exact deal was already sent
            const alreadySent = await wasAlertSentToSubscriber(subscriber.id, deal.id)
            if (alreadySent) continue

            // Check if destination was recently sent (7-day dedup)
            if (recentDestinations.includes(deal.deal.destination_code)) {
              console.log(`[Digest] Skipping ${deal.deal.destination_code} for ${subscriber.email} - sent within 7 days`)
              continue
            }

            dealsToSend.push(deal)
          }

          // Skip if no new deals for this subscriber
          if (dealsToSend.length === 0) {
            continue
          }

          // For trial subscribers: prioritize international deals
          // Sort so international deals come first
          if (subscriber.status === 'trial') {
            dealsToSend.sort((a, b) => {
              const aIntl = a.deal.country !== 'United States' ? 0 : 1
              const bIntl = b.deal.country !== 'United States' ? 0 : 1
              return aIntl - bIntl
            })
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
              // Also record destination for 7-day deduplication
              await recordDestinationSent(subscriber.id, deal.deal.destination_code)
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

  // === NURTURE EMAILS (Days 3, 7, 10, 12, 14) ===
  // Send nurture sequence emails to trial subscribers based on days since signup
  const nurtureEmailsSent: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  try {
    const trialSubscribers = await getTrialSubscribersForNurtureEmails()
    console.log(`[NurtureEmails] Found ${trialSubscribers.length} trial subscribers`)

    for (const subscriber of trialSubscribers) {
      const alreadySent = subscriber.nurture_emails_sent || []
      const daysSinceSignup = subscriber.days_since_signup

      // Check which email should be sent based on days since signup
      for (const [emailNumStr, targetDay] of Object.entries(NURTURE_SCHEDULE)) {
        const emailNum = parseInt(emailNumStr)

        // Skip if already sent this email
        if (alreadySent.includes(emailNum)) continue

        // Check if it's time to send this email (on or after target day)
        if (daysSinceSignup >= targetDay) {
          // Make sure we haven't already sent a later email (to avoid sending out of order)
          const laterEmailsSent = alreadySent.filter(n => n > emailNum)
          if (laterEmailsSent.length > 0) continue

          try {
            let html: string
            switch (emailNum) {
              case 2:
                html = renderNurtureEmail2({ subscriberEmail: subscriber.email })
                break
              case 3:
                html = renderNurtureEmail3({ subscriberEmail: subscriber.email })
                break
              case 4:
                html = renderNurtureEmail4({ subscriberEmail: subscriber.email })
                break
              case 5:
                html = renderNurtureEmail5({ subscriberEmail: subscriber.email })
                break
              case 6:
                html = renderNurtureEmail6({ subscriberEmail: subscriber.email })
                break
              default:
                continue
            }

            const { error } = await resend.emails.send({
              from: 'Homebase Flights <hello@homebaseflights.com>',
              to: subscriber.email,
              subject: NURTURE_SUBJECTS[emailNum],
              html,
            })

            if (!error) {
              await recordNurtureEmailSent(subscriber.id, emailNum)
              nurtureEmailsSent[emailNum]++
              console.log(`[NurtureEmails] Sent Email ${emailNum} to ${subscriber.email} (Day ${daysSinceSignup})`)
            } else {
              console.error(`[NurtureEmails] Failed to send Email ${emailNum} to ${subscriber.email}:`, error)
            }

            // Only send one nurture email per subscriber per day
            break
          } catch (emailError) {
            console.error(`[NurtureEmails] Error sending Email ${emailNum} to ${subscriber.email}:`, emailError)
          }
        }
      }

      // Small delay between subscribers
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    const totalNurtureSent = Object.values(nurtureEmailsSent).reduce((a, b) => a + b, 0)
    console.log(`[NurtureEmails] Total sent: ${totalNurtureSent}`, nurtureEmailsSent)
  } catch (error) {
    console.error('[NurtureEmails] Error:', error)
  }

  // === TRIAL REMINDERS (Legacy - Day 5 for 7-day trials) ===
  // Note: This is now largely replaced by nurture Email 5, kept for backwards compatibility
  let trialRemindersSent = 0
  try {
    const now = new Date()
    const targetDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    const minDate = new Date(targetDate.getTime() - 12 * 60 * 60 * 1000)
    const maxDate = new Date(targetDate.getTime() + 12 * 60 * 60 * 1000)

    const { data: trialSubscribers } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, home_city, trial_ends_at, created_at, nurture_emails_sent')
      .eq('status', 'trial')
      .gte('trial_ends_at', minDate.toISOString())
      .lte('trial_ends_at', maxDate.toISOString())

    if (trialSubscribers && trialSubscribers.length > 0) {
      console.log(`[TrialReminders] Found ${trialSubscribers.length} subscribers with trial ending in 2 days`)

      for (const subscriber of trialSubscribers) {
        // Skip if nurture Email 5 was already sent (which is the same content)
        const alreadySent = subscriber.nurture_emails_sent || []
        if (alreadySent.includes(5)) {
          console.log(`[TrialReminders] Skipping ${subscriber.email} - already received nurture Email 5`)
          continue
        }

        const city = getCityBySlug(subscriber.home_city)
        if (!city) continue

        const html = renderTrialReminderEmail({
          subscriberEmail: subscriber.email,
          cityName: city.name,
          daysLeft: 2,
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

  // === DESTINATION ALERTS CLEANUP ===
  // Clean old destination alerts to keep table size manageable
  let destinationAlertsCleared = 0
  try {
    destinationAlertsCleared = await cleanOldDestinationAlerts()
    if (destinationAlertsCleared > 0) {
      console.log(`[Cleanup] Cleared ${destinationAlertsCleared} old destination alerts`)
    }
  } catch (error) {
    console.error('[Cleanup] Error clearing destination alerts:', error)
  }

  const duration = Date.now() - startTime
  const summary = {
    citiesProcessed: results.length,
    citiesWithDigest: results.filter(r => !r.skipped).length,
    totalEmailsSent: results.reduce((sum, r) => sum + r.emailsSent, 0),
    totalEmailsFailed: results.reduce((sum, r) => sum + r.emailsFailed, 0),
    citiesSkipped: results.filter(r => r.skipped).length,
    nurtureEmailsSent,
    trialRemindersSent,
    dealsPublished,
    destinationAlertsCleared,
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
