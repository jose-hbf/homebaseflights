import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Admin endpoint to fix subscriber data issues
 * Protected by CRON_SECRET
 *
 * Actions:
 * - reset-nurture: Reset free_nurture_emails_sent to [] for an email
 * - add-subscriber: Add a missing subscriber to Supabase
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: NextRequest) {
  // Verify auth
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, email, homeCity, homeAirport } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (action === 'reset-nurture') {
      // Reset free_nurture_emails_sent to [] so the cron job will resend
      const { data, error } = await supabase
        .from('subscribers')
        .update({ free_nurture_emails_sent: [] })
        .eq('email', normalizedEmail)
        .select()

      if (error) {
        console.error('[Admin] Error resetting nurture emails:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      if (!data || data.length === 0) {
        return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
      }

      console.log('[Admin] Reset free_nurture_emails_sent for:', normalizedEmail)
      return NextResponse.json({
        success: true,
        message: `Reset nurture emails for ${normalizedEmail}. Will receive welcome email on next cron run.`,
        subscriber: data[0],
      })
    }

    if (action === 'add-subscriber') {
      // Add a missing subscriber (e.g., one that's in Resend but not Supabase)
      const { data: existing } = await supabase
        .from('subscribers')
        .select('id')
        .eq('email', normalizedEmail)
        .single()

      if (existing) {
        return NextResponse.json({
          error: 'Subscriber already exists',
          id: existing.id,
        }, { status: 409 })
      }

      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          email: normalizedEmail,
          home_city: homeCity || 'new-york',
          home_airport: homeAirport || 'JFK',
          status: 'active',
          plan: 'free',
          free_nurture_emails_sent: [1], // Mark welcome email as already sent (they got it via Resend)
          created_at: new Date().toISOString(),
        })
        .select()

      if (error) {
        console.error('[Admin] Error adding subscriber:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('[Admin] Added missing subscriber:', normalizedEmail)
      return NextResponse.json({
        success: true,
        message: `Added subscriber ${normalizedEmail} with welcome email marked as sent.`,
        subscriber: data[0],
      })
    }

    return NextResponse.json({ error: 'Invalid action. Use "reset-nurture" or "add-subscriber"' }, { status: 400 })
  } catch (error) {
    console.error('[Admin] Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
