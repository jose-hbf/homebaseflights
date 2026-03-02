import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { getCityBySlug } from '@/data/cities'
import { renderTrialDailyEmail } from '@/emails/TrialDailyEmail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Homebase Flights <deals@homebaseflights.com>'
const CRON_SECRET = process.env.CRON_SECRET

interface TrialEmailResult {
  email: string
  dayNumber: number
  dealsFound: number
  dealsSent: number
  success: boolean
  error?: string
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[Trial Deals] Starting trial daily email job')

  const results: TrialEmailResult[] = []

  try {
    // Get all active trial users
    const { data: trialUsers, error: fetchError } = await supabase
      .from('subscribers')
      .select('email, home_city, created_at, last_trial_email_day, trial_ends_at')
      .eq('plan', 'paid')
      .eq('status', 'trial')
      .gte('trial_ends_at', new Date().toISOString())

    if (fetchError) {
      console.error('[Trial Deals] Error fetching trial users:', fetchError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch trial users',
        timestamp: new Date().toISOString(),
      }, { status: 500 })
    }

    if (!trialUsers || trialUsers.length === 0) {
      console.log('[Trial Deals] No active trial users found')
      return NextResponse.json({
        success: true,
        message: 'No active trial users',
        timestamp: new Date().toISOString(),
        results: [],
      })
    }

    console.log(`[Trial Deals] Found ${trialUsers.length} trial users`)

    // Process each trial user
    for (const user of trialUsers) {
      const result: TrialEmailResult = {
        email: user.email,
        dayNumber: 0,
        dealsFound: 0,
        dealsSent: 0,
        success: false,
      }

      try {
        // Calculate which day of trial they're on
        const trialStartDate = new Date(user.created_at)
        const today = new Date()
        const daysSinceStart = Math.floor((today.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24))
        const trialDay = Math.min(daysSinceStart + 1, 7) // Cap at day 7

        result.dayNumber = trialDay

        // Skip if we already sent today's email
        if (user.last_trial_email_day >= trialDay) {
          console.log(`[Trial Deals] Already sent day ${trialDay} email to ${user.email}`)
          result.success = true
          result.error = 'Already sent today'
          results.push(result)
          continue
        }

        // Get the city info
        const city = getCityBySlug(user.home_city || 'new-york')
        if (!city) {
          result.error = 'Invalid city'
          results.push(result)
          continue
        }

        // Call the database function to get personalized deals
        const { data: deals, error: dealsError } = await supabase.rpc(
          'get_trial_deals_for_user',
          {
            p_email: user.email,
            p_city_slug: user.home_city || 'new-york',
            p_limit: trialDay === 1 ? 7 : 5, // Send more deals on first day
          }
        )

        if (dealsError) {
          console.error(`[Trial Deals] Error getting deals for ${user.email}:`, dealsError)
          result.error = 'Failed to get deals'
          results.push(result)
          continue
        }

        result.dealsFound = deals?.length || 0

        // Skip if no deals found
        if (!deals || deals.length === 0) {
          console.log(`[Trial Deals] No new deals for ${user.email}`)
          result.error = 'No new deals available'
          results.push(result)
          continue
        }

        // Prepare email content based on trial day
        const emailSubjects = {
          1: `🌍 Your first international deals from ${city.name}`,
          2: `✈️ Today's top ${deals.length} deals from ${city.name}`,
          3: `🎯 Exclusive: ${deals[0].destination} from $${deals[0].price}`,
          4: `🔥 Weekend getaway deals from ${city.name}`,
          5: `⚡ Flash deals: ${deals.length} new routes from ${city.name}`,
          6: `🌟 Only 1 day left: Don't miss ${deals[0].destination}`,
          7: `⏰ Last day of trial: ${deals.length} amazing deals`,
        }

        const subject = emailSubjects[trialDay as keyof typeof emailSubjects] || `Today's deals from ${city.name}`

        // Group deals by region for better presentation
        const groupedDeals = deals.reduce((acc: any, deal: any) => {
          const region = deal.region || 'other'
          if (!acc[region]) acc[region] = []
          acc[region].push(deal)
          return acc
        }, {})

        // Prioritize regions with best deals
        const prioritizedRegions = Object.keys(groupedDeals).sort((a, b) => {
          const aMinPrice = Math.min(...groupedDeals[a].map((d: any) => d.price))
          const bMinPrice = Math.min(...groupedDeals[b].map((d: any) => d.price))
          return aMinPrice - bMinPrice
        })

        // Send email
        const { error: emailError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject,
          html: renderTrialDailyEmail({
            subscriberEmail: user.email,
            cityName: city.name,
            trialDay,
            trialEndsAt: user.trial_ends_at,
            deals: deals.map((deal: any) => ({
              ...deal,
              bookingLink: `https://www.google.com/travel/flights?hl=en&q=Flights+from+${city.primaryAirport}+to+${deal.destination_code}+on+${deal.departure_date}+through+${deal.return_date}`,
            })),
            groupedDeals,
            prioritizedRegions,
          }),
        })

        if (emailError) {
          console.error(`[Trial Deals] Error sending email to ${user.email}:`, emailError)
          result.error = 'Failed to send email'
          results.push(result)
          continue
        }

        // Record deals as sent
        const dealIds = deals.map((d: any) => d.id)
        await supabase.rpc('record_trial_deals_sent', {
          p_email: user.email,
          p_deal_ids: dealIds,
          p_email_type: `trial_day_${trialDay}`,
        })

        // Update user's last trial email day
        await supabase
          .from('subscribers')
          .update({
            last_trial_email_day: trialDay,
            trial_emails_sent: supabase.sql`
              COALESCE(trial_emails_sent, '[]'::jsonb) ||
              jsonb_build_object(
                'day', ${trialDay},
                'sent_at', to_jsonb(now()),
                'deals_count', ${deals.length}
              )::jsonb
            `,
          })
          .eq('email', user.email)

        result.dealsSent = deals.length
        result.success = true
        results.push(result)

        console.log(`[Trial Deals] Sent day ${trialDay} email to ${user.email} with ${deals.length} deals`)

        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (error) {
        console.error(`[Trial Deals] Error processing ${user.email}:`, error)
        result.error = `Processing error: ${error}`
        results.push(result)
      }
    }

    const duration = Date.now() - startTime
    const summary = {
      totalUsers: trialUsers.length,
      emailsSent: results.filter(r => r.success).length,
      emailsFailed: results.filter(r => !r.success).length,
      totalDealsSent: results.reduce((sum, r) => sum + r.dealsSent, 0),
    }

    console.log(`[Trial Deals] Job completed in ${duration}ms:`, summary)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      durationMs: duration,
      summary,
      results,
    })

  } catch (error) {
    console.error('[Trial Deals] Fatal error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

// Support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}