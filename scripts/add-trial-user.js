#!/usr/bin/env node

/**
 * Manual trial user addition tool
 * Usage: node scripts/add-trial-user.js <email> <city-slug> [stripe-customer-id]
 */

const { Resend } = require('resend')

const email = process.argv[2]
const citySlug = process.argv[3] || 'new-york'
const stripeCustomerId = process.argv[4]

if (!email) {
  console.log('Usage: node scripts/add-trial-user.js <email> <city-slug> [stripe-customer-id]')
  console.log('Example: node scripts/add-trial-user.js user@example.com new-york cus_ABC123')
  process.exit(1)
}

async function addTrialUser() {
  console.log(`\n🚀 Adding trial user: ${email}\n`)
  console.log('=' .repeat(60))

  const supabaseUrl = 'https://mofcecngtooafabaldca.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs'

  // Map city slug to airport code
  const cityAirports = {
    'new-york': 'NYC',
    'los-angeles': 'LAX',
    'chicago': 'ORD',
    'san-francisco': 'SFO',
    'miami': 'MIA',
    'boston': 'BOS',
    'seattle': 'SEA',
    'london': 'LON',
    'sydney': 'SYD'
  }

  const homeAirport = cityAirports[citySlug] || 'NYC'
  const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  console.log('📝 User details:')
  console.log('   Email:', email)
  console.log('   City:', citySlug)
  console.log('   Airport:', homeAirport)
  console.log('   Trial ends:', new Date(trialEndsAt).toLocaleDateString())
  console.log('   Stripe ID:', stripeCustomerId || 'Not provided')
  console.log('')

  // 1. Add to database
  console.log('📊 Adding to Supabase...')

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/subscribers`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email,
          home_city: citySlug,
          home_airport: homeAirport,
          plan: 'paid',
          status: 'trial',
          trial_ends_at: trialEndsAt,
          stripe_customer_id: stripeCustomerId || null,
          source: 'manual_add'
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('✅ User added to database successfully!')
    } else {
      const error = await response.text()
      if (error.includes('duplicate key')) {
        console.log('⚠️  User already exists in database, updating...')

        // Update existing user
        const updateResponse = await fetch(
          `${supabaseUrl}/rest/v1/subscribers?email=eq.${email}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              home_city: citySlug,
              home_airport: homeAirport,
              plan: 'paid',
              status: 'trial',
              trial_ends_at: trialEndsAt,
              stripe_customer_id: stripeCustomerId || undefined
            })
          }
        )

        if (updateResponse.ok) {
          console.log('✅ User updated successfully!')
        } else {
          console.error('❌ Failed to update user:', await updateResponse.text())
        }
      } else {
        console.error('❌ Failed to add user:', error)
      }
    }
  } catch (error) {
    console.error('❌ Database error:', error.message)
  }

  // 2. Send welcome email with deals
  console.log('\n📧 Sending welcome email...')

  try {
    // Get deals for the user's city
    const dealsResponse = await fetch(
      `${supabaseUrl}/rest/v1/flight_deals?city_slug=eq.${citySlug}&order=price.asc&limit=8`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    )

    const deals = await dealsResponse.json()
    console.log(`   Found ${deals.length} deals for ${citySlug}`)

    const resend = new Resend('re_fePHN6d7_GDJGcjeQhxWRJFb8mq5HtGUJ')

    const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
          .deal { border: 1px solid #e5e7eb; padding: 16px; margin: 12px 0; border-radius: 8px; }
          .price { color: #16a34a; font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Your 7-Day Trial!</h1>
            <p>Your daily flight deals from ${cityName} start now</p>
          </div>

          ${deals.length > 0 ? `
            <h2 style="margin-top: 30px;">Today's Best Deals from ${cityName}</h2>
            ${deals.slice(0, 6).map(deal => `
              <div class="deal">
                <h3>✈️ ${cityName} → ${deal.destination_city || deal.destination || 'Unknown'}</h3>
                <p class="price">$${deal.price}</p>
                <p>Departure: ${new Date(deal.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            `).join('')}
          ` : `
            <p style="padding: 20px;">We're curating deals for you. You'll receive your first deals email soon!</p>
          `}

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <h3>🎁 Your Trial Benefits</h3>
            <ul>
              <li>Daily curated flight deals for 7 days</li>
              <li>Mistake fares & flash sales</li>
              <li>Save up to 90% off regular prices</li>
              <li>After trial: only $5.99/month</li>
              <li>Cancel anytime - no questions asked</li>
            </ul>
          </div>

          <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            Questions? Reply to this email<br>
            <a href="https://homebaseflights.com/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
          </p>
        </div>
      </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'HomeBase Flights <deals@homebaseflights.com>',
      to: email,
      subject: `✈️ Welcome! Your 7-Day Trial Has Started`,
      html: emailHtml
    })

    console.log('✅ Welcome email sent successfully!')
    console.log('   Email ID:', result.data?.id)
  } catch (error) {
    console.error('❌ Failed to send email:', error.message)
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ Trial user setup complete!')
  console.log(`   ${email} is now active and will receive daily deals\n`)
}

addTrialUser().catch(console.error)