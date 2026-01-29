import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createPortalSession } from '@/lib/stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Missing email or token' },
        { status: 400 }
      )
    }

    // Verify token (same logic as unsubscribe)
    const expectedToken = Buffer.from(email).toString('base64').slice(0, 16)
    if (token !== expectedToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      )
    }

    // Get subscriber's Stripe customer ID
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('stripe_customer_id')
      .eq('email', email)
      .single()

    if (error || !subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      )
    }

    if (!subscriber.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found for this subscriber' },
        { status: 404 }
      )
    }

    // Create portal session
    const portalUrl = await createPortalSession(subscriber.stripe_customer_id)

    return NextResponse.json({ url: portalUrl })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
