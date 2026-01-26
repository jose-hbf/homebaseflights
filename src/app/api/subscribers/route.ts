import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, SubscriberInsert } from '@/lib/supabase'
import { subscriberSchema, formatZodError } from '@/lib/validations'

// POST - Create a new subscriber
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod
    const validation = subscriberSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: formatZodError(validation.error) },
        { status: 400 }
      )
    }

    const { email, citySlug, cityName } = validation.data

    // Calculate trial end date (7 days from now)
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase not configured. Skipping database insert.')
      console.log(`Would create subscriber: ${email} for ${cityName || 'no city'}`)
      return NextResponse.json({
        success: true,
        message: 'Subscriber created (database not configured)',
        subscriber: { email, citySlug, cityName },
      })
    }

    const supabase = getSupabase()

    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, email, status')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      // Update existing subscriber if they're resubscribing
      if (existing.status === 'cancelled' || existing.status === 'expired') {
        const { data: updated, error: updateError } = await supabase
          .from('subscribers')
          .update({
            status: 'trial',
            city_slug: citySlug || null,
            city_name: cityName || null,
            trial_ends_at: trialEndsAt.toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (updateError) {
          console.error('Supabase update error:', updateError)
          return NextResponse.json(
            { error: 'Failed to update subscriber' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          subscriber: updated,
          reactivated: true,
        })
      }

      // Already an active subscriber
      return NextResponse.json({
        success: true,
        subscriber: existing,
        alreadyExists: true,
      })
    }

    // Create new subscriber
    const newSubscriber: SubscriberInsert = {
      email: email.toLowerCase(),
      city_slug: citySlug || null,
      city_name: cityName || null,
      status: 'trial',
      stripe_customer_id: null,
      stripe_subscription_id: null,
      trial_ends_at: trialEndsAt.toISOString(),
    }

    const { data, error } = await supabase
      .from('subscribers')
      .insert(newSubscriber)
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)

      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to create subscriber' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriber: data,
    })
  } catch (error) {
    console.error('Error creating subscriber:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get subscriber by email (for checking status)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('subscribers')
      .select('id, email, city_name, status, trial_ends_at, created_at')
      .eq('email', email.toLowerCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Subscriber not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ subscriber: data })
  } catch (error) {
    console.error('Error fetching subscriber:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
