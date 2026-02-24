import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCityBySlug } from '@/data/cities'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, citySlug, cityName } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('[Confirm Trial] Processing trial confirmation for:', normalizedEmail)

    // Check if subscriber already exists
    const { data: existing, error: selectError } = await supabase
      .from('subscribers')
      .select('id, plan')
      .eq('email', normalizedEmail)
      .single()

    if (existing && existing.plan === 'trial') {
      // Already a trial subscriber, no need to update
      console.log('[Confirm Trial] User already has trial plan:', normalizedEmail)
      return NextResponse.json({ success: true, message: 'Already a trial subscriber' })
    }

    const city = getCityBySlug(citySlug || 'new-york')
    const homeAirport = city?.primaryAirport || 'JFK'
    const homeCitySlug = citySlug || 'new-york'

    if (existing) {
      // Update existing subscriber to trial plan
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          plan: 'trial',
          status: 'active',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          home_city: homeCitySlug,
          home_airport: homeAirport,
        })
        .eq('email', normalizedEmail)

      if (updateError) {
        console.error('[Confirm Trial] Failed to update subscriber:', updateError)
        return NextResponse.json({ error: 'Failed to update subscriber' }, { status: 500 })
      }

      console.log('[Confirm Trial] Updated existing subscriber to trial:', normalizedEmail)
    } else {
      // Insert new trial subscriber
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert({
          email: normalizedEmail,
          home_city: homeCitySlug,
          home_airport: homeAirport,
          status: 'active',
          plan: 'trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          created_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error('[Confirm Trial] Failed to insert subscriber:', insertError)
        return NextResponse.json({ error: 'Failed to create subscriber' }, { status: 500 })
      }

      console.log('[Confirm Trial] Created new trial subscriber:', normalizedEmail)
    }

    return NextResponse.json({
      success: true,
      message: 'Trial confirmed',
      email: normalizedEmail,
      citySlug: homeCitySlug
    })

  } catch (error) {
    console.error('[Confirm Trial] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}