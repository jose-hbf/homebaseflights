require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

const supabaseUrl = 'https://mofcecngtooafabaldca.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfc2VydmljZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs'

const supabase = createClient(supabaseUrl, supabaseKey)
const resend = new Resend(process.env.RESEND_API_KEY)

// Priority destinations worth featuring
const PRIORITY_DESTINATIONS = {
  international: [
    'London', 'Paris', 'Rome', 'Barcelona', 'Madrid', 'Amsterdam', 'Berlin',
    'Tokyo', 'Bangkok', 'Singapore', 'Dubai', 'Tel Aviv', 'Istanbul',
    'Mexico City', 'Cancun', 'Lima', 'Buenos Aires', 'São Paulo',
    'Reykjavik', 'Dublin', 'Athens', 'Lisbon', 'Vienna', 'Prague',
    'Mazatlán', 'San José del Cabo', 'Loreto', 'Puerto Vallarta'
  ],
  domestic_premium: [
    'Los Angeles', 'San Francisco', 'Seattle', 'Miami', 'Hawaii',
    'Las Vegas', 'Phoenix', 'Denver', 'Austin', 'Nashville', 'Boston'
  ]
}

async function sendTrialEmail(userEmail) {
  console.log(`\n📧 Sending quality trial email to ${userEmail}...`)

  try {
    // Get the best available deals
    const { data: allDeals, error } = await supabase
      .from('flight_deals')
      .select('*')
      .eq('city_slug', 'new-york')
      .gte('departure_date', new Date().toISOString().split('T')[0])
      .lte('price', 600)
      .order('price', { ascending: true })
      .limit(100)

    if (error) {
      console.error('Error fetching deals:', error)
      return
    }

    console.log(`Found ${allDeals.length} total deals`)

    // Filter for quality destinations
    const qualityDeals = allDeals.filter(deal => {
      const dest = deal.destination || ''

      // Check if it's a priority destination
      const allPriority = [...PRIORITY_DESTINATIONS.international, ...PRIORITY_DESTINATIONS.domestic_premium]
      return allPriority.some(priority => dest.includes(priority))
    })

    console.log(`Found ${qualityDeals.length} quality deals`)

    // Deduplicate by destination
    const uniqueDestinations = new Map()
    for (const deal of qualityDeals) {
      const dest = deal.destination
      if (!uniqueDestinations.has(dest) || uniqueDestinations.get(dest).price > deal.price) {
        uniqueDestinations.set(dest, deal)
      }
    }

    // Get the best unique deals
    const deals = Array.from(uniqueDestinations.values())
      .sort((a, b) => a.price - b.price)
      .slice(0, 10)

    if (deals.length === 0) {
      console.log('❌ No quality deals available')
      return
    }

    // Group by type
    const internationalDeals = deals.filter(d =>
      PRIORITY_DESTINATIONS.international.some(dest => d.destination.includes(dest))
    )
    const domesticDeals = deals.filter(d =>
      PRIORITY_DESTINATIONS.domestic_premium.some(dest => d.destination.includes(dest))
    )

    console.log(`Sending ${internationalDeals.length} international + ${domesticDeals.length} domestic deals`)

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Premium Flight Deals from New York</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✈️ Premium Deals from New York</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
            ${internationalDeals.length} international + ${domesticDeals.length} domestic deals curated for you
          </p>
        </div>

        ${internationalDeals.length > 0 ? `
          <div style="background-color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #667eea;">
            <h2 style="color: #667eea; margin: 0 0 15px; font-size: 20px;">🌍 International Deals</h2>
            ${internationalDeals.map(deal => `
              <div style="border-left: 3px solid #667eea; padding: 12px 0 12px 15px; margin-bottom: 15px; background: #f8f9ff;">
                <h3 style="color: #333; margin: 0; font-size: 18px;">
                  ${deal.destination} - <span style="color: #667eea; font-weight: bold;">$${deal.price}</span>
                  ${deal.price < 400 ? ' 🔥' : ''}
                </h3>
                <p style="margin: 5px 0; color: #666; font-size: 14px;">
                  ${new Date(deal.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -
                  ${new Date(deal.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  ${deal.airline ? ` • ${deal.airline}` : ''}
                  ${deal.is_nonstop ? ' • NONSTOP ✨' : ''}
                </p>
                <a href="${deal.booking_link || `https://www.google.com/travel/flights`}"
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 20px; text-decoration: none; border-radius: 20px; margin-top: 8px; font-size: 14px; font-weight: 500;">
                  Book Now →
                </a>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${domesticDeals.length > 0 ? `
          <div style="background-color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin: 0 0 15px; font-size: 18px;">🇺🇸 Domestic Deals</h2>
            ${domesticDeals.map(deal => `
              <div style="border-bottom: 1px solid #eee; padding: 12px 0;">
                <h3 style="color: #333; margin: 0; font-size: 16px;">
                  ${deal.destination} - <span style="color: #667eea; font-weight: bold;">$${deal.price}</span>
                </h3>
                <p style="margin: 5px 0; color: #666; font-size: 13px;">
                  ${new Date(deal.departure_date).toLocaleDateString()} - ${new Date(deal.return_date).toLocaleDateString()}
                  ${deal.airline ? ` • ${deal.airline}` : ''}
                </p>
                <a href="${deal.booking_link || `https://www.google.com/travel/flights`}"
                   style="display: inline-block; color: #667eea; text-decoration: none; font-size: 13px; font-weight: 500;">
                  View Deal →
                </a>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 8px;">
          <p style="margin: 0; font-weight: 500;">
            ⏰ These deals were recurated after removing low-quality destinations
          </p>
        </div>

        <div style="margin-top: 20px; text-align: center; color: #666; font-size: 13px;">
          <p>
            You're seeing our premium curated deals. Only the best destinations make the cut.
          </p>
          <p style="margin-top: 10px;">
            Questions? Visit
            <a href="https://homebaseflights.com" style="color: #667eea;">homebaseflights.com</a>
          </p>
        </div>
      </body>
      </html>
    `

    // Send email
    const { data, error: emailError } = await resend.emails.send({
      from: 'Homebase Flights <deals@homebaseflights.com>',
      to: userEmail,
      subject: internationalDeals.length > 0
        ? `🌍 ${internationalDeals[0].destination} from $${internationalDeals[0].price} + ${deals.length - 1} more deals`
        : `✈️ ${deals.length} Premium Flight Deals from New York`,
      html: emailHtml,
    })

    if (emailError) {
      console.error('❌ Error sending email:', emailError)
    } else {
      console.log(`✅ Email sent successfully!`)
      console.log(`   - ${internationalDeals.length} international deals`)
      console.log(`   - ${domesticDeals.length} domestic deals`)

      if (internationalDeals.length > 0) {
        console.log('\nInternational deals sent:')
        internationalDeals.forEach(d => console.log(`   • ${d.destination}: $${d.price}`))
      }

      if (domesticDeals.length > 0) {
        console.log('\nDomestic deals sent:')
        domesticDeals.forEach(d => console.log(`   • ${d.destination}: $${d.price}`))
      }
    }

  } catch (error) {
    console.error('Fatal error:', error)
  }
}

// Send to yourself
sendTrialEmail('jose@homebaseflights.com')