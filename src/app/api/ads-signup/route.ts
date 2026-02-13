import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Server-side form handler for ads pages when JavaScript is disabled
 * Saves subscriber and redirects to Stripe checkout
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const email = formData.get('email') as string
    const citySlug = formData.get('citySlug') as string
    const cityName = formData.get('cityName') as string
    const redirectUrl = formData.get('redirectUrl') as string

    if (!email || !redirectUrl) {
      return NextResponse.redirect(new URL('/ads/cheap-flights-from-new-york?error=missing', request.url))
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.redirect(new URL('/ads/cheap-flights-from-new-york?error=invalid', request.url))
    }

    // Save subscriber to database (fire and forget style for speed)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Don't await - let it happen in background
    void supabase
      .from('subscribers')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          home_airport: citySlug?.toUpperCase() || 'JFK',
          source: 'meta_ads_nojs',
          status: 'pending',
          created_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .then(() => {})

    // Build Stripe URL with email prefilled
    const stripeCheckoutUrl = new URL(redirectUrl)
    stripeCheckoutUrl.searchParams.set('prefilled_email', email.trim())
    if (citySlug) {
      stripeCheckoutUrl.searchParams.set('client_reference_id', citySlug)
    }

    // Redirect to Stripe
    return NextResponse.redirect(stripeCheckoutUrl.toString())
  } catch {
    // Fallback redirect to Stripe without email
    return NextResponse.redirect('https://buy.stripe.com/4gM7sNgMyejzapagigaR201')
  }
}
