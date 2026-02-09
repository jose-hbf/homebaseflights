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

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Extract city from client_reference_id
    let city = ''
    if (session.client_reference_id) {
      try {
        const referenceData = JSON.parse(session.client_reference_id)
        city = referenceData.city || ''
      } catch {
        // client_reference_id might be a plain string
        city = session.client_reference_id
      }
    }

    // Build success URL with city parameter
    const successUrl = new URL('/checkout/success', request.url)
    if (city) {
      successUrl.searchParams.set('city', city)
    }
    if (session.customer_email) {
      successUrl.searchParams.set('email', session.customer_email)
    }

    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error('[Checkout Callback] Error retrieving session:', error)
    // On error, redirect to success page without params
    return NextResponse.redirect(new URL('/checkout/success', request.url))
  }
}
