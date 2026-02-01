import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { renderTrialReminderEmail } from '@/emails/TrialReminderEmail'
import { getCityBySlug } from '@/data/cities'
import { getPriceThreshold } from '@/utils/flightFilters'

// Vercel Cron job protection
const CRON_SECRET = process.env.CRON_SECRET

// Resend client
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Homebase Flights <deals@homebaseflights.com>'

// Send reminder X days before trial ends
const REMINDER_DAYS_BEFORE = 2

interface TrialReminderResult {
  email: string
  citySlug: string
  daysLeft: number
  dealsFound: number
  totalSavings: number
  sent: boolean
  error?: string
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[TrialReminders] Starting trial reminder job')

  const results: TrialReminderResult[] = []

  try {
    // Find trial subscribers whose trial ends in REMINDER_DAYS_BEFORE days
    // trial_ends_at should be between now + (REMINDER_DAYS_BEFORE - 0.5) days and now + (REMINDER_DAYS_BEFORE + 0.5) days
    const now = new Date()
    const targetDate = new Date(now.getTime() + REMINDER_DAYS_BEFORE * 24 * 60 * 60 * 1000)
    const minDate = new Date(targetDate.getTime() - 12 * 60 * 60 * 1000) // -12 hours
    const maxDate = new Date(targetDate.getTime() + 12 * 60 * 60 * 1000) // +12 hours

    const { data: trialSubscribers, error: fetchError } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, home_city, trial_ends_at, created_at')
      .eq('status', 'trial')
      .gte('trial_ends_at', minDate.toISOString())
      .lte('trial_ends_at', maxDate.toISOString())

    if (fetchError) {
      console.error('[TrialReminders] Error fetching subscribers:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    if (!trialSubscribers || trialSubscribers.length === 0) {
      console.log('[TrialReminders] No subscribers with trial ending in 2 days')
      return NextResponse.json({
        success: true,
        message: 'No trial reminders to send',
        subscribersChecked: 0,
        remindersSent: 0,
      })
    }

    console.log(`[TrialReminders] Found ${trialSubscribers.length} subscribers with trial ending soon`)

    // Process each subscriber
    for (const subscriber of trialSubscribers) {
      const result: TrialReminderResult = {
        email: subscriber.email,
        citySlug: subscriber.home_city,
        daysLeft: REMINDER_DAYS_BEFORE,
        dealsFound: 0,
        totalSavings: 0,
        sent: false,
      }

      try {
        const city = getCityBySlug(subscriber.home_city)
        if (!city) {
          result.error = 'City not found'
          results.push(result)
          continue
        }

        // Get deals sent to this subscriber during their trial
        const { data: alertsSent } = await supabaseAdmin
          .from('alerts_sent')
          .select(`
            curated_deal_id,
            curated_deals (
              deal_id,
              flight_deals (
                destination,
                country,
                price
              )
            )
          `)
          .eq('subscriber_id', subscriber.id)
          .gte('sent_at', subscriber.created_at)

        // Calculate stats
        const destinations = new Set<string>()
        let totalSavings = 0

        if (alertsSent) {
          for (const alert of alertsSent) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const curatedDeal = alert.curated_deals as any
            if (curatedDeal?.flight_deals) {
              const deal = curatedDeal.flight_deals
              destinations.add(deal.destination)
              
              // Calculate savings for this deal
              const threshold = getPriceThreshold(deal.country)
              if (deal.price < threshold) {
                totalSavings += threshold - deal.price
              }
            }
          }
        }

        result.dealsFound = alertsSent?.length || 0
        result.totalSavings = Math.round(totalSavings)

        // Render email
        const html = renderTrialReminderEmail({
          subscriberEmail: subscriber.email,
          cityName: city.name,
          daysLeft: REMINDER_DAYS_BEFORE,
          dealsFound: result.dealsFound,
          totalSavings: result.totalSavings,
          topDestinations: Array.from(destinations),
        })

        // Send email
        const { error: sendError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject: `⏰ Your free trial ends in ${REMINDER_DAYS_BEFORE} days`,
          html,
        })

        if (sendError) {
          result.error = sendError.message
          console.error(`[TrialReminders] Failed to send to ${subscriber.email}:`, sendError)
        } else {
          result.sent = true
          console.log(`[TrialReminders] Sent reminder to ${subscriber.email}`)
        }

      } catch (err) {
        result.error = err instanceof Error ? err.message : 'Unknown error'
        console.error(`[TrialReminders] Error processing ${subscriber.email}:`, err)
      }

      results.push(result)
    }

    const durationMs = Date.now() - startTime
    const sentCount = results.filter(r => r.sent).length

    console.log(`[TrialReminders] Job completed in ${durationMs}ms: ${sentCount}/${results.length} sent`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      durationMs,
      summary: {
        subscribersChecked: trialSubscribers.length,
        remindersSent: sentCount,
        remindersFailed: results.length - sentCount,
      },
      results,
    })

  } catch (error) {
    console.error('[TrialReminders] Job failed:', error)
    return NextResponse.json(
      { error: 'Trial reminder job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
