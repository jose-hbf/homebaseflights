import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { getCityBySlug } from '@/data/cities'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Homebase Flights <deals@homebaseflights.com>'
const CRON_SECRET = process.env.CRON_SECRET

// Only send evening emails on key days
const EVENING_EMAIL_DAYS = [1, 3, 5, 6, 7]

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[Trial Evening] Starting evening email job')

  try {
    // Get all active trial users
    const { data: trialUsers, error: fetchError } = await supabase
      .from('subscribers')
      .select('email, home_city, created_at, trial_ends_at')
      .eq('plan', 'paid')
      .eq('status', 'trial')
      .gte('trial_ends_at', new Date().toISOString())

    if (fetchError || !trialUsers || trialUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active trial users',
        timestamp: new Date().toISOString(),
      })
    }

    const results: any[] = []

    for (const user of trialUsers) {
      // Calculate trial day
      const trialStartDate = new Date(user.created_at)
      const today = new Date()
      const daysSinceStart = Math.floor((today.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24))
      const trialDay = Math.min(daysSinceStart + 1, 7)

      // Skip if not an evening email day
      if (!EVENING_EMAIL_DAYS.includes(trialDay)) {
        continue
      }

      // Check if we already sent evening email today
      const { data: sentToday } = await supabase
        .from('user_sent_deals')
        .select('id')
        .eq('subscriber_email', user.email)
        .eq('email_type', `trial_evening_${trialDay}`)
        .gte('sent_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
        .limit(1)

      if (sentToday && sentToday.length > 0) {
        continue
      }

      // Get 3-5 AMAZING deals for evening email
      const { data: deals } = await supabase.rpc(
        'get_trial_deals_for_user',
        {
          p_email: user.email,
          p_city_slug: user.home_city || 'new-york',
          p_limit: trialDay === 7 ? 5 : 3, // More on last day
        }
      )

      if (!deals || deals.length === 0) {
        continue
      }

      // Evening email subjects
      const subjects = {
        1: `🌙 Tonight only: ${deals[0].destination} from $${deals[0].price}`,
        3: `⚡ Flash: ${deals.length} new deals just added`,
        5: `🔥 Weekend special: Save up to ${Math.max(...deals.map((d: any) => d.savings_percent || 40))}%`,
        6: `⏰ 24 hours left: Don't miss these deals`,
        7: `🚨 FINAL HOURS: Your trial ends tonight`,
      }

      const subject = subjects[trialDay as keyof typeof subjects] || 'Evening deals update'

      // Simple evening email template
      const html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #1f2937;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">
              ${trialDay === 7 ? '⏰ Last chance!' : '🌙 Evening update'}
            </h2>
            <p style="color: #6b7280; margin: 0 0 20px 0;">
              We just found ${deals.length} incredible ${deals.length === 1 ? 'deal' : 'deals'} that won't last long:
            </p>
            ${deals.map((deal: any) => `
              <div style="border: 2px solid ${deal.deal_type === 'error_fare' ? '#dc2626' : '#e5e7eb'}; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <strong style="color: #1f2937; font-size: 16px;">${deal.destination}</strong>
                    <div style="color: #6b7280; font-size: 13px; margin-top: 4px;">
                      ${new Date(deal.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      ${deal.deal_type === 'error_fare' ? '<span style="color: #dc2626; font-weight: 600;"> • ERROR FARE</span>' : ''}
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="color: #dc2626; font-size: 20px; font-weight: 700;">$${deal.price}</div>
                    ${deal.savings_percent ? `<div style="color: #059669; font-size: 11px;">${deal.savings_percent}% off</div>` : ''}
                  </div>
                </div>
                <a href="${deal.bookingLink || '#'}" style="display: block; margin-top: 10px; background: #3b82f6; color: white; text-align: center; padding: 8px; border-radius: 6px; text-decoration: none; font-size: 14px;">
                  Book Now →
                </a>
              </div>
            `).join('')}
            ${trialDay >= 6 ? `
              <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="color: #92400e; margin: 0 0 10px 0; font-weight: 600;">
                  ${trialDay === 7 ? '⏰ Your trial ends in a few hours!' : '⏰ Only 1 day left in your trial'}
                </p>
                <a href="https://homebaseflights.com/checkout?plan=monthly" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #dc2626); color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
                  Continue for $5.99/month →
                </a>
              </div>
            ` : ''}
          </div>
        </body>
        </html>
      `

      // Send email
      const { error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject,
        html,
      })

      if (!emailError) {
        // Record as sent
        const dealIds = deals.map((d: any) => d.id)
        await supabase.rpc('record_trial_deals_sent', {
          p_email: user.email,
          p_deal_ids: dealIds,
          p_email_type: `trial_evening_${trialDay}`,
        })

        results.push({
          email: user.email,
          day: trialDay,
          deals: deals.length,
          success: true,
        })

        console.log(`[Trial Evening] Sent evening email to ${user.email} (day ${trialDay})`)
      }

      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    const duration = Date.now() - startTime
    console.log(`[Trial Evening] Job completed in ${duration}ms, sent ${results.length} emails`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      durationMs: duration,
      emailsSent: results.length,
      results,
    })

  } catch (error) {
    console.error('[Trial Evening] Fatal error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}