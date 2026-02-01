/**
 * Script to add test subscribers for all cities
 * Run with: npx ts-node scripts/add-test-subscribers.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BASE_EMAIL = 'jose@homebaseflights.com'

const cities = [
  { slug: 'london', name: 'London', primaryAirport: 'LHR' },
  { slug: 'new-york', name: 'New York', primaryAirport: 'JFK' },
  { slug: 'los-angeles', name: 'Los Angeles', primaryAirport: 'LAX' },
  { slug: 'chicago', name: 'Chicago', primaryAirport: 'ORD' },
  { slug: 'san-francisco', name: 'San Francisco', primaryAirport: 'SFO' },
  { slug: 'dubai', name: 'Dubai', primaryAirport: 'DXB' },
  { slug: 'singapore', name: 'Singapore', primaryAirport: 'SIN' },
  { slug: 'hong-kong', name: 'Hong Kong', primaryAirport: 'HKG' },
  { slug: 'sydney', name: 'Sydney', primaryAirport: 'SYD' },
  { slug: 'atlanta', name: 'Atlanta', primaryAirport: 'ATL' },
  { slug: 'dallas', name: 'Dallas', primaryAirport: 'DFW' },
  { slug: 'denver', name: 'Denver', primaryAirport: 'DEN' },
  { slug: 'boston', name: 'Boston', primaryAirport: 'BOS' },
  { slug: 'seattle', name: 'Seattle', primaryAirport: 'SEA' },
  { slug: 'miami', name: 'Miami', primaryAirport: 'MIA' },
  { slug: 'toronto', name: 'Toronto', primaryAirport: 'YYZ' },
]

async function addTestSubscribers() {
  console.log('Adding test subscribers for all cities...\n')

  for (const city of cities) {
    // Create email alias: jose+london@homebaseflights.com
    const email = BASE_EMAIL.replace('@', `+${city.slug}@`)

    const { data, error } = await supabase
      .from('subscribers')
      .upsert({
        email,
        home_city: city.slug,
        home_airport: city.primaryAirport,
        status: 'active', // Active so they receive alerts
        max_price: 1000, // Higher limit to catch more deals
        direct_only: false,
        email_frequency: 'instant', // Get instant alerts + daily digest
      }, {
        onConflict: 'email',
      })
      .select()

    if (error) {
      console.error(`❌ ${city.name}: ${error.message}`)
    } else {
      console.log(`✅ ${city.name}: ${email}`)
    }
  }

  console.log('\n✨ Done! All test subscribers added.')
  console.log(`\nAll emails will arrive at: ${BASE_EMAIL}`)
  console.log('\nNote: Alerts will be sent when:')
  console.log('  - Instant alerts: When exceptional deals are found')
  console.log('  - Daily digest: Every day at 8am ET (1pm UTC)')
}

addTestSubscribers().catch(console.error)
