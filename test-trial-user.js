const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testTrialUser() {
  console.log('Testing trial user frag101@icloud.com...\n')

  // 1. Check if user exists
  const { data: user, error: userError } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', 'frag101@icloud.com')
    .single()

  if (userError) {
    console.error('Error fetching user:', userError)
    return
  }

  console.log('User found:', {
    email: user.email,
    status: user.status,
    plan: user.plan,
    home_city: user.home_city,
    home_airport: user.home_airport,
    trial_ends_at: user.trial_ends_at,
    created_at: user.created_at,
  })

  // 2. Calculate trial day
  const trialStartDate = new Date(user.created_at)
  const today = new Date()
  const daysSinceStart = Math.floor((today.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24))
  const trialDay = Math.min(daysSinceStart + 1, 7)

  console.log(`\nTrial Day: ${trialDay} (started ${daysSinceStart} days ago)`)

  // 3. Check for deals
  const airport = user.home_airport || 'NYC'
  console.log(`\nFetching deals from ${airport}...`)

  const { data: deals, error: dealsError } = await supabase
    .from('curated_deals')
    .select('id, destination, price, departure_date, return_date, origin, deal_quality')
    .eq('origin', airport)
    .gte('departure_date', new Date().toISOString().split('T')[0])
    .order('price', { ascending: true })
    .limit(5)

  if (dealsError) {
    console.error('Error fetching deals:', dealsError)
    return
  }

  console.log(`Found ${deals?.length || 0} deals:`)
  deals?.forEach(deal => {
    console.log(`  - ${deal.destination}: $${deal.price} (${deal.departure_date} to ${deal.return_date}) [${deal.deal_quality}]`)
  })
}

testTrialUser().catch(console.error)