/**
 * Reset curated deals and prepare for real test
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function resetAndPrepare() {
  console.log('=== Deleting test curated deals ===')
  
  const { error: deleteError } = await supabase
    .from('curated_deals')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
  
  if (deleteError) {
    console.error('Error deleting:', deleteError)
  } else {
    console.log(`Deleted curated deals`)
  }

  console.log('\n=== Deleting old flight deals ===')
  
  const { error: deleteDealsError } = await supabase
    .from('flight_deals')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
  
  if (deleteDealsError) {
    console.error('Error deleting flight deals:', deleteDealsError)
  } else {
    console.log('Deleted all flight deals')
  }

  console.log('\n=== Verifying clean state ===')
  
  const { data: curated } = await supabase
    .from('curated_deals')
    .select('id')
  console.log(`Curated deals remaining: ${curated?.length || 0}`)

  const { data: deals } = await supabase
    .from('flight_deals')
    .select('id')
  console.log(`Flight deals remaining: ${deals?.length || 0}`)

  const { data: subs } = await supabase
    .from('subscribers')
    .select('email, home_city, status')
    .in('status', ['active', 'trial'])
  console.log(`Active subscribers: ${subs?.length || 0}`)

  console.log('\n✅ Ready for real test!')
  console.log('Next: Run the fetch-deals cron to get real AI-curated deals')
}

resetAndPrepare().catch(console.error)
