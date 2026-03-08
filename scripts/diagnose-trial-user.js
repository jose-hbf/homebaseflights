#!/usr/bin/env node

/**
 * Diagnostic tool for trial user issues
 * Usage: node scripts/diagnose-trial-user.js <email>
 */

const email = process.argv[2]

if (!email) {
  console.log('Usage: node scripts/diagnose-trial-user.js <email>')
  process.exit(1)
}

async function diagnose() {
  console.log(`\n🔍 Diagnosing trial user: ${email}\n`)
  console.log('=' .repeat(60))

  // 1. Check Supabase
  console.log('\n📊 CHECKING SUPABASE DATABASE:')
  console.log('-'.repeat(40))

  const supabaseUrl = 'https://mofcecngtooafabaldca.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs'

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/subscribers?email=eq.${email}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    )

    const data = await response.json()

    if (data && data.length > 0) {
      const user = data[0]
      console.log('✅ User found in database!')
      console.log('   Email:', user.email)
      console.log('   Plan:', user.plan)
      console.log('   Status:', user.status)
      console.log('   City:', user.home_city)
      console.log('   Created:', new Date(user.created_at).toLocaleString())
      console.log('   Trial ends:', user.trial_ends_at ? new Date(user.trial_ends_at).toLocaleString() : 'N/A')
      console.log('   Stripe Customer:', user.stripe_customer_id || 'Not set')
      console.log('   Stripe Subscription:', user.stripe_subscription_id || 'Not set')
    } else {
      console.log('❌ User NOT found in database')
      console.log('   This user needs to be added to Supabase')
    }
  } catch (error) {
    console.error('❌ Error checking Supabase:', error.message)
  }

  // 2. Check recent emails sent
  console.log('\n📧 CHECKING EMAILS SENT:')
  console.log('-'.repeat(40))

  try {
    const emailsResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_sent_deals?user_email=eq.${email}&order=sent_at.desc&limit=5`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    )

    const emails = await emailsResponse.json()

    if (emails && emails.length > 0) {
      console.log(`✅ Found ${emails.length} emails sent:`)
      emails.forEach(email => {
        console.log(`   - ${new Date(email.sent_at).toLocaleString()}: ${email.deal_count} deals`)
      })
    } else {
      console.log('❌ No emails found for this user')
      console.log('   User has not received any trial emails yet')
    }
  } catch (error) {
    console.error('❌ Error checking emails:', error.message)
  }

  // 3. Recommendations
  console.log('\n💡 RECOMMENDATIONS:')
  console.log('-'.repeat(40))

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/subscribers?email=eq.${email}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    )

    const data = await response.json()

    if (!data || data.length === 0) {
      console.log('1. User is NOT in database. Actions needed:')
      console.log('   a) Check if they completed Stripe checkout')
      console.log('   b) Manually add them to database if needed')
      console.log('   c) Send welcome email manually')
      console.log('')
      console.log('   To add manually, run:')
      console.log(`   node scripts/add-trial-user.js "${email}" "new-york"`)
    } else {
      const user = data[0]
      if (user.status !== 'trial' && user.plan !== 'paid') {
        console.log('1. User exists but is NOT in trial. Actions needed:')
        console.log('   a) Update their status to trial')
        console.log('   b) Set plan to paid')
        console.log('   c) Add trial_ends_at date')
      } else {
        console.log('✅ User is properly configured for trial!')
        console.log('   They should receive daily emails automatically')
      }
    }
  } catch (error) {
    console.error('Error generating recommendations:', error)
  }

  console.log('\n' + '='.repeat(60))
  console.log('Diagnosis complete!\n')
}

diagnose().catch(console.error)