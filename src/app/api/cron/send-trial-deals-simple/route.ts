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

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Trial Deals Simple] Starting trial email job')

  try {
    // Get all active trial users
    const { data: trialUsers, error: fetchError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('plan', 'paid')
      .eq('status', 'trial')
      .gte('trial_ends_at', new Date().toISOString())

    if (fetchError) {
      console.error('[Trial Deals Simple] Error fetching trial users:', fetchError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch trial users',
        details: fetchError.message,
      }, { status: 500 })
    }

    if (!trialUsers || trialUsers.length === 0) {
      console.log('[Trial Deals Simple] No active trial users found')
      return NextResponse.json({
        success: true,
        message: 'No active trial users',
        timestamp: new Date().toISOString(),
      })
    }

    console.log(`[Trial Deals Simple] Found ${trialUsers.length} trial users`)

    const results = []

    // Process each trial user
    for (const user of trialUsers) {
      try {
        // Calculate which day of trial they're on
        const trialStartDate = new Date(user.created_at)
        const today = new Date()
        const daysSinceStart = Math.floor((today.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24))
        const trialDay = Math.min(daysSinceStart + 1, 7)

        console.log(`[Trial Deals Simple] Processing ${user.email} - Day ${trialDay} of trial`)

        // Get city info
        const city = getCityBySlug(user.home_city || 'new-york')
        if (!city) {
          console.log(`[Trial Deals Simple] Invalid city for ${user.email}`)
          continue
        }

        // Get flight deals from the database
        console.log(`[Trial Deals Simple] Fetching deals for ${city.slug}`)
        const { data: deals, error: dealsError } = await supabase
          .from('flight_deals')
          .select('*')
          .eq('city_slug', city.slug)
          .gte('departure_date', new Date().toISOString().split('T')[0])
          .lte('price', 1000)
          .order('price', { ascending: true })
          .limit(10)

        if (dealsError) {
          console.error(`[Trial Deals Simple] Error getting deals for ${user.email}:`, dealsError)
          continue
        }

        console.log(`[Trial Deals Simple] Found ${deals?.length || 0} deals for ${user.email} from ${city.name}`)

        if (!deals || deals.length === 0) {
          console.log(`[Trial Deals Simple] No deals found for ${user.email}`)
          results.push({
            email: user.email,
            success: false,
            error: 'No deals available',
            city: city.slug,
          })
          continue
        }

        // Prepare email HTML
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Daily Flight Deals - Day ${trialDay}</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="color: #0066cc; margin: 0;">🌍 Trial Day ${trialDay} - Your Flight Deals from ${city.name}</h1>
              <p style="margin: 10px 0 0;">We found ${deals.length} amazing deals for you today!</p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${deals.map(deal => `
                <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                  <h3 style="color: #0066cc; margin: 0;">
                    ${deal.destination || deal.destination_city} - $${deal.price}
                    ${deal.price < 200 ? '🔥' : '✈️'}
                  </h3>
                  <p style="margin: 5px 0; color: #666;">
                    ${new Date(deal.departure_date).toLocaleDateString()} to ${new Date(deal.return_date).toLocaleDateString()}
                    ${deal.airline ? `• ${deal.airline}` : ''}
                    ${deal.is_nonstop ? '• Nonstop' : ''}
                  </p>
                  <a href="${deal.booking_link || `https://www.google.com/travel/flights?hl=en`}"
                     style="display: inline-block; background-color: #0066cc; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-top: 8px;">
                    Book This Deal →
                  </a>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 8px;">
              <p style="margin: 0;">
                <strong>⏰ Trial Status:</strong> Day ${trialDay} of 7
                ${trialDay >= 5 ? '<br><strong>Your trial ends soon!</strong> Don\'t miss out on these exclusive deals.' : ''}
              </p>
            </div>

            <div style="margin-top: 20px; text-align: center; color: #666; font-size: 14px;">
              <p>
                Questions? Reply to this email or visit
                <a href="https://homebaseflights.com" style="color: #0066cc;">homebaseflights.com</a>
              </p>
              <p style="margin-top: 10px;">
                <a href="https://homebaseflights.com/unsubscribe?email=${encodeURIComponent(user.email)}"
                   style="color: #999; text-decoration: underline;">Unsubscribe</a>
              </p>
            </div>
          </body>
          </html>
        `

        // Send email
        const { error: emailError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: `🌍 Day ${trialDay}: ${deals.length} Flight Deals from ${city.name}`,
          html: emailHtml,
        })

        if (emailError) {
          console.error(`[Trial Deals Simple] Error sending email to ${user.email}:`, emailError)
          results.push({
            email: user.email,
            success: false,
            error: emailError.message,
          })
        } else {
          console.log(`[Trial Deals Simple] Successfully sent email to ${user.email} with ${deals.length} deals`)

          // Update last_email_sent_at
          await supabase
            .from('subscribers')
            .update({ last_email_sent_at: new Date().toISOString() })
            .eq('email', user.email)

          results.push({
            email: user.email,
            success: true,
            dealsSent: deals.length,
            trialDay,
          })
        }

      } catch (error) {
        console.error(`[Trial Deals Simple] Error processing ${user.email}:`, error)
        results.push({
          email: user.email,
          success: false,
          error: String(error),
        })
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalUsers: trialUsers.length,
      results,
    })

  } catch (error) {
    console.error('[Trial Deals Simple] Fatal error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

// Support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}