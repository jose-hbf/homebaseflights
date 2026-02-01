import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function check() {
  const { data } = await supabase
    .from('subscribers')
    .select('email, stripe_customer_id, status')
    .not('stripe_customer_id', 'is', null)

  console.log('=== Subscribers with Stripe Customer ID ===')
  if (data && data.length > 0) {
    data.forEach(s => console.log(`  ✅ ${s.email} | ${s.stripe_customer_id} | ${s.status}`))
  } else {
    console.log('  None found')
  }

  const { data: noStripe } = await supabase
    .from('subscribers')
    .select('email, status')
    .is('stripe_customer_id', null)
    .limit(5)

  console.log('\n=== Subscribers WITHOUT Stripe ID (first 5) ===')
  noStripe?.forEach(s => console.log(`  ❌ ${s.email} | ${s.status}`))
}

check().catch(console.error)
