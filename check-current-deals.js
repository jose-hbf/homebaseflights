require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mofcecngtooafabaldca.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCurrentDeals() {
  console.log('📊 Checking current deals in database...\n')

  // Get deals from NYC
  const { data: deals, error } = await supabase
    .from('flight_deals')
    .select('destination, destination_code, price, created_at, fetched_at')
    .eq('city_slug', 'new-york')
    .order('fetched_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching deals:', error)
    return
  }

  console.log(`Found ${deals.length} recent deals from NYC\n`)

  // Group by destination
  const byDestination = {}
  deals.forEach(deal => {
    const dest = deal.destination
    if (!byDestination[dest]) {
      byDestination[dest] = {
        count: 0,
        minPrice: Infinity,
        lastFetch: deal.fetched_at || deal.created_at
      }
    }
    byDestination[dest].count++
    byDestination[dest].minPrice = Math.min(byDestination[dest].minPrice, deal.price)
  })

  // Sort by count
  const sorted = Object.entries(byDestination)
    .sort((a, b) => b[1].count - a[1].count)

  console.log('Current destinations in DB:')
  console.log('============================')
  sorted.forEach(([dest, data]) => {
    const lastFetch = new Date(data.lastFetch)
    const hoursAgo = Math.round((Date.now() - lastFetch.getTime()) / (1000 * 60 * 60))
    console.log(`${dest.padEnd(30)} | ${data.count} deals | From $${data.minPrice} | ${hoursAgo}h ago`)
  })

  // Check for bad destinations still in DB
  const BAD_KEYWORDS = ['National Park', 'State Park', 'Wildlife', 'Cave', 'Saint Paul', 'Bozeman']
  const badDeals = deals.filter(deal => {
    return BAD_KEYWORDS.some(keyword => deal.destination.includes(keyword))
  })

  if (badDeals.length > 0) {
    console.log('\n⚠️  WARNING: Still have bad destinations:')
    badDeals.forEach(deal => {
      console.log(`   - ${deal.destination} ($${deal.price})`)
    })
  } else {
    console.log('\n✅ No bad destinations found!')
  }

  // Check when was last fetch
  if (deals.length > 0) {
    const lastFetch = new Date(deals[0].fetched_at || deals[0].created_at)
    console.log(`\n⏰ Last fetch: ${lastFetch.toLocaleString()} (${Math.round((Date.now() - lastFetch.getTime()) / (1000 * 60 * 60))} hours ago)`)
  }
}

checkCurrentDeals()