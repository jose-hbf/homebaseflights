import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkTrials() {
  const { data } = await supabase
    .from('subscribers')
    .select('email, status, trial_ends_at, created_at')
    .eq('status', 'trial')

  console.log('=== Trial Subscribers ===')
  
  if (!data || data.length === 0) {
    console.log('No trial subscribers found')
    return
  }

  const now = new Date()
  
  data.forEach(s => {
    const ends = new Date(s.trial_ends_at)
    const daysLeft = Math.ceil((ends.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    console.log(`  ${s.email}`)
    console.log(`    Status: ${s.status}`)
    console.log(`    Trial ends: ${s.trial_ends_at}`)
    console.log(`    Days left: ${daysLeft}`)
    console.log('')
  })
}

checkTrials().catch(console.error)
