import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.redirect(new URL('/checkout/success', request.url))
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const city = session.client_reference_id || ''

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
    return NextResponse.redirect(new URL('/checkout/success', request.url))
  }
}
