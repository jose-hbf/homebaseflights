/**
 * Quick script to check database state
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkDatabase() {
  console.log('=== Checking Subscribers ===')
  const { data: subs, error: subsError } = await supabase
    .from('subscribers')
    .select('email, home_city, status')
    .limit(20)
  
  if (subsError) {
    console.error('Error:', subsError)
  } else {
    console.log(`Found ${subs?.length} subscribers:`)
    subs?.forEach(s => console.log(`  - ${s.email} | ${s.home_city} | ${s.status}`))
  }

  console.log('\n=== Checking Curated Deals ===')
  const { data: curated, error: curatedError } = await supabase
    .from('curated_deals')
    .select('id, city_slug, ai_tier, digest_sent, curated_at')
    .order('curated_at', { ascending: false })
    .limit(10)
  
  if (curatedError) {
    console.error('Error:', curatedError)
  } else {
    console.log(`Found ${curated?.length} curated deals:`)
    curated?.forEach(d => console.log(`  - ${d.city_slug} | ${d.ai_tier} | digest_sent: ${d.digest_sent} | ${d.curated_at}`))
  }

  console.log('\n=== Checking Flight Deals ===')
  const { data: deals, error: dealsError } = await supabase
    .from('flight_deals')
    .select('id, departure_airport, city_slug, destination, price')
    .order('fetched_at', { ascending: false })
    .limit(5)
  
  if (dealsError) {
    console.error('Error:', dealsError)
  } else {
    console.log(`Found ${deals?.length} recent flight deals:`)
    deals?.forEach(d => console.log(`  - ${d.departure_airport} → ${d.destination} | $${d.price} | city: ${d.city_slug}`))
  }
}

checkDatabase().catch(console.error)
