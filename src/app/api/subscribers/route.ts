import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { subscriberSchema, formatZodError } from '@/lib/validations'
import { getCityBySlug } from '@/data/cities'

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

    // Validate city exists
    const city = getCityBySlug(citySlug)
    if (!city) {
      return NextResponse.json(
        { error: 'Invalid city selected' },
        { status: 400 }
      )
    }

    // Calculate trial end date (7 days from now)
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Supabase not configured. Skipping database insert.')
      console.log(`Would create subscriber: ${email} for ${city.name}`)
      return NextResponse.json({
        success: true,
        message: 'Subscriber created (database not configured)',
        subscriber: { email, citySlug, cityName: city.name },
      })
    }

    // Check if subscriber already exists
    const { data: existing } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, status, home_city')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      // Update existing subscriber if they're resubscribing
      if (existing.status === 'cancelled' || existing.status === 'expired') {
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('subscribers')
          .update({
            status: 'trial',
            home_city: citySlug,
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
    const newSubscriber = {
      email: email.toLowerCase(),
      home_city: citySlug,
      status: 'trial' as const,
      email_frequency: 'instant' as const,
      trial_ends_at: trialEndsAt.toISOString(),
    }

    const { data, error } = await supabaseAdmin
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

    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .select('id, email, home_city, status, email_frequency, trial_ends_at, created_at')
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

    // Add city name for display
    const city = data.home_city ? getCityBySlug(data.home_city) : null
    
    return NextResponse.json({ 
      subscriber: {
        ...data,
        cityName: city?.name || null,
      }
    })
  } catch (error) {
    console.error('Error fetching subscriber:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
