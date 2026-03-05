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

// Priority destinations for NYC travelers
const PRIORITY_DESTINATIONS = {
  international: [
    'London', 'Paris', 'Rome', 'Barcelona', 'Madrid', 'Amsterdam', 'Berlin',
    'Tokyo', 'Bangkok', 'Singapore', 'Dubai', 'Tel Aviv', 'Istanbul',
    'Mexico City', 'Cancun', 'Lima', 'Buenos Aires', 'São Paulo',
    'Reykjavik', 'Dublin', 'Athens', 'Lisbon', 'Vienna', 'Prague'
  ],
  domestic_premium: [
    'Los Angeles', 'San Francisco', 'Seattle', 'Miami', 'Hawaii',
    'Las Vegas', 'Phoenix', 'Denver', 'Austin', 'Nashville'
  ]
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Trial Deals Premium] Starting premium trial email job')

  try {
    // Get all active trial users
    const { data: trialUsers, error: fetchError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('plan', 'paid')
      .eq('status', 'trial')
      .gte('trial_ends_at', new Date().toISOString())

    if (fetchError) {
      console.error('[Trial Deals Premium] Error fetching trial users:', fetchError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch trial users',
        details: fetchError.message,
      }, { status: 500 })
    }

    if (!trialUsers || trialUsers.length === 0) {
      console.log('[Trial Deals Premium] No active trial users found')
      return NextResponse.json({
        success: true,
        message: 'No active trial users',
        timestamp: new Date().toISOString(),
      })
    }

    console.log(`[Trial Deals Premium] Found ${trialUsers.length} trial users`)

    const results = []

    // Process each trial user
    for (const user of trialUsers) {
      try {
        // Calculate which day of trial they're on
        const trialStartDate = new Date(user.created_at)
        const today = new Date()
        const daysSinceStart = Math.floor((today.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24))
        const trialDay = Math.min(daysSinceStart + 1, 7)

        console.log(`[Trial Deals Premium] Processing ${user.email} - Day ${trialDay} of trial`)

        // Get city info
        const city = getCityBySlug(user.home_city || 'new-york')
        if (!city) {
          console.log(`[Trial Deals Premium] Invalid city for ${user.email}`)
          continue
        }

        // Get QUALITY flight deals from the database
        console.log(`[Trial Deals Premium] Fetching premium deals for ${city.slug}`)

        // First, try to get international deals
        const { data: internationalDeals, error: intlError } = await supabase
          .from('flight_deals')
          .select('*')
          .eq('city_slug', city.slug)
          .gte('departure_date', new Date().toISOString().split('T')[0])
          .lte('price', 600) // Max $600 for international
          .in('destination_city', PRIORITY_DESTINATIONS.international)
          .order('price', { ascending: true })
          .limit(15)

        // Then get some premium domestic deals
        const { data: domesticDeals, error: domError } = await supabase
          .from('flight_deals')
          .select('*')
          .eq('city_slug', city.slug)
          .gte('departure_date', new Date().toISOString().split('T')[0])
          .lte('price', 300) // Max $300 for domestic
          .in('destination_city', PRIORITY_DESTINATIONS.domestic_premium)
          .order('price', { ascending: true })
          .limit(10)

        // If we don't have enough good deals, get any cheap deals
        const { data: cheapDeals, error: cheapError } = await supabase
          .from('flight_deals')
          .select('*')
          .eq('city_slug', city.slug)
          .gte('departure_date', new Date().toISOString().split('T')[0])
          .lte('price', 200) // Very cheap deals only
          .order('price', { ascending: true })
          .limit(10)

        // Combine and deduplicate deals
        const allDeals = [...(internationalDeals || []), ...(domesticDeals || []), ...(cheapDeals || [])]

        // Remove duplicates by destination
        const uniqueDestinations = new Map()
        for (const deal of allDeals) {
          const dest = deal.destination || deal.destination_city
          if (!uniqueDestinations.has(dest) || uniqueDestinations.get(dest).price > deal.price) {
            uniqueDestinations.set(dest, deal)
          }
        }

        // Get the best unique deals
        const deals = Array.from(uniqueDestinations.values())
          .sort((a, b) => {
            // Prioritize international deals
            const aIsIntl = PRIORITY_DESTINATIONS.international.includes(a.destination_city || a.destination)
            const bIsIntl = PRIORITY_DESTINATIONS.international.includes(b.destination_city || b.destination)
            if (aIsIntl && !bIsIntl) return -1
            if (!aIsIntl && bIsIntl) return 1
            return a.price - b.price
          })
          .slice(0, 10)

        console.log(`[Trial Deals Premium] Found ${deals.length} unique quality deals for ${user.email}`)

        if (!deals || deals.length === 0) {
          console.log(`[Trial Deals Premium] No quality deals found for ${user.email}`)
          results.push({
            email: user.email,
            success: false,
            error: 'No quality deals available',
            city: city.slug,
          })
          continue
        }

        // Group deals by type for better presentation
        const internationalDealsToShow = deals.filter(d =>
          PRIORITY_DESTINATIONS.international.includes(d.destination_city || d.destination)
        )
        const domesticDealsToShow = deals.filter(d =>
          !PRIORITY_DESTINATIONS.international.includes(d.destination_city || d.destination)
        )

        // Prepare premium email HTML
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Premium Flight Deals - Day ${trialDay}</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">✈️ Day ${trialDay}: Premium Deals from ${city.name}</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
                ${internationalDealsToShow.length} international + ${domesticDealsToShow.length} domestic deals curated for you
              </p>
            </div>

            ${internationalDealsToShow.length > 0 ? `
              <div style="background-color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #667eea;">
                <h2 style="color: #667eea; margin: 0 0 15px; font-size: 20px;">🌍 International Deals</h2>
                ${internationalDealsToShow.map(deal => `
                  <div style="border-left: 3px solid #667eea; padding: 12px 0 12px 15px; margin-bottom: 15px; background: #f8f9ff;">
                    <h3 style="color: #333; margin: 0; font-size: 18px;">
                      ${deal.destination || deal.destination_city} - <span style="color: #667eea; font-weight: bold;">$${deal.price}</span>
                      ${deal.price < 400 ? '🔥 AMAZING DEAL' : ''}
                    </h3>
                    <p style="margin: 5px 0; color: #666; font-size: 14px;">
                      ${new Date(deal.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -
                      ${new Date(deal.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      ${deal.airline ? ` • ${deal.airline}` : ''}
                      ${deal.is_nonstop ? ' • NONSTOP ✨' : ''}
                    </p>
                    <a href="${deal.booking_link || `https://www.google.com/travel/flights?hl=en`}"
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 20px; text-decoration: none; border-radius: 20px; margin-top: 8px; font-size: 14px; font-weight: 500;">
                      Book Now →
                    </a>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${domesticDealsToShow.length > 0 ? `
              <div style="background-color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e0e0e0;">
                <h2 style="color: #333; margin: 0 0 15px; font-size: 18px;">🇺🇸 Domestic Deals</h2>
                ${domesticDealsToShow.map(deal => `
                  <div style="border-bottom: 1px solid #eee; padding: 12px 0;">
                    <h3 style="color: #333; margin: 0; font-size: 16px;">
                      ${deal.destination || deal.destination_city} - <span style="color: #667eea; font-weight: bold;">$${deal.price}</span>
                    </h3>
                    <p style="margin: 5px 0; color: #666; font-size: 13px;">
                      ${new Date(deal.departure_date).toLocaleDateString()} - ${new Date(deal.return_date).toLocaleDateString()}
                      ${deal.airline ? ` • ${deal.airline}` : ''}
                    </p>
                    <a href="${deal.booking_link || `https://www.google.com/travel/flights?hl=en`}"
                       style="display: inline-block; color: #667eea; text-decoration: none; font-size: 13px; font-weight: 500;">
                      View Deal →
                    </a>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 8px;">
              <p style="margin: 0; font-weight: 500;">
                ⏰ Trial Status: Day ${trialDay} of 7
                ${trialDay >= 5 ? '<br><strong>Your trial ends soon! Lock in these deals now.</strong>' : ''}
              </p>
            </div>

            <div style="margin-top: 20px; text-align: center; color: #666; font-size: 13px;">
              <p>
                You're seeing our premium curated deals. We filter through thousands of flights to bring you only the best.
              </p>
              <p style="margin-top: 10px;">
                Questions? Reply to this email or visit
                <a href="https://homebaseflights.com" style="color: #667eea;">homebaseflights.com</a>
              </p>
            </div>
          </body>
          </html>
        `

        // Send email
        const { error: emailError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: internationalDealsToShow.length > 0
            ? `🌍 ${internationalDealsToShow[0].destination_city} from $${internationalDealsToShow[0].price} + ${deals.length - 1} more deals`
            : `✈️ ${deals.length} Premium Flight Deals from ${city.name}`,
          html: emailHtml,
        })

        if (emailError) {
          console.error(`[Trial Deals Premium] Error sending email to ${user.email}:`, emailError)
          results.push({
            email: user.email,
            success: false,
            error: emailError.message,
          })
        } else {
          console.log(`[Trial Deals Premium] Successfully sent email to ${user.email} with ${deals.length} quality deals`)

          // Update last_email_sent_at
          await supabase
            .from('subscribers')
            .update({ last_email_sent_at: new Date().toISOString() })
            .eq('email', user.email)

          results.push({
            email: user.email,
            success: true,
            dealsSent: deals.length,
            internationalDeals: internationalDealsToShow.length,
            domesticDeals: domesticDealsToShow.length,
            trialDay,
          })
        }

        // Add delay to avoid rate limits (2 requests per second max)
        await new Promise(resolve => setTimeout(resolve, 600))

      } catch (error) {
        console.error(`[Trial Deals Premium] Error processing ${user.email}:`, error)
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
    console.error('[Trial Deals Premium] Fatal error:', error)
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