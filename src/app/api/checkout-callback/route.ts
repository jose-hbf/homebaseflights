import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    // No session ID, redirect to success page without city
    return NextResponse.redirect(new URL('/checkout/success', request.url))
  }

  try {
    const stripe = getStripe()

    console.log('[Checkout Callback] Retrieving session:', sessionId)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log('[Checkout Callback] Session retrieved:', {
      id: session.id,
      client_reference_id: session.client_reference_id,
      customer_email: session.customer_email,
    })

    // Extract city from client_reference_id (now a simple string)
    const city = session.client_reference_id || ''
    console.log('[Checkout Callback] City from client_reference_id:', city)

    // Build success URL with city parameter
    const successUrl = new URL('/checkout/success', request.url)
    if (city) {
      successUrl.searchParams.set('city', city)
    }
    if (session.customer_email) {
      successUrl.searchParams.set('email', session.customer_email)
    }

    console.log('[Checkout Callback] Redirecting to:', successUrl.toString())

    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error('[Checkout Callback] Error retrieving session:', error)
    // On error, redirect to success page without params
    return NextResponse.redirect(new URL('/checkout/success', request.url))
  }
}
