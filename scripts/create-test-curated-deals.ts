/**
 * Create test curated deals for digest testing
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function createTestCuratedDeals() {
  console.log('=== Getting existing flight deals ===')
  
  // Get some real deals from the database
  const { data: deals, error: dealsError } = await supabase
    .from('flight_deals')
    .select('id, city_slug, destination, price, departure_airport')
    .order('fetched_at', { ascending: false })
    .limit(30)
  
  if (dealsError || !deals || deals.length === 0) {
    console.error('No deals found:', dealsError)
    return
  }

  console.log(`Found ${deals.length} deals`)

  // Group deals by city_slug
  const dealsByCity: Record<string, typeof deals> = {}
  for (const deal of deals) {
    if (!dealsByCity[deal.city_slug]) {
      dealsByCity[deal.city_slug] = []
    }
    dealsByCity[deal.city_slug].push(deal)
  }

  console.log('\n=== Creating curated deals for each city ===')

  for (const [citySlug, cityDeals] of Object.entries(dealsByCity)) {
    // Take up to 3 deals per city
    const toCreate = cityDeals.slice(0, 3)
    
    for (const deal of toCreate) {
      const curatedDeal = {
        deal_id: deal.id,
        city_slug: citySlug,
        ai_tier: 'good' as const,
        ai_description: `Great deal from ${deal.departure_airport} to ${deal.destination} at $${deal.price}. This is a test curated deal.`,
        ai_model: 'test-manual',
        ai_reasoning: 'Test deal for digest testing',
        instant_alert_sent: false,
        digest_sent: false,
        curated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('curated_deals')
        .upsert(curatedDeal, { onConflict: 'deal_id' })

      if (error) {
        console.error(`❌ ${citySlug}: ${error.message}`)
      } else {
        console.log(`✅ ${citySlug}: ${deal.departure_airport} → ${deal.destination} $${deal.price}`)
      }
    }
  }

  // Verify
  console.log('\n=== Verifying curated deals ===')
  const { data: curated } = await supabase
    .from('curated_deals')
    .select('city_slug, ai_tier, digest_sent')
    .order('curated_at', { ascending: false })
    .limit(20)

  console.log(`Total curated deals: ${curated?.length}`)
  curated?.forEach(d => console.log(`  - ${d.city_slug} | ${d.ai_tier} | digest_sent: ${d.digest_sent}`))
}

createTestCuratedDeals().catch(console.error)
