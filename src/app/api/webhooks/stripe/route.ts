import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { renderWelcomeEmail } from '@/emails/WelcomeEmail'
import { getCityBySlug } from '@/data/cities'
import { trackPurchaseServer } from '@/lib/meta-capi'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      
      // Get customer email
      const email = session.customer_email || session.customer_details?.email
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string
      
      // Get city from client_reference_id (passed from Payment Link)
      // Format: city-slug (e.g., "new-york", "los-angeles")
      const citySlug = session.client_reference_id || 'new-york'
      
      // Get city data for name and primary airport
      const city = getCityBySlug(citySlug)
      const cityName = city?.name || citySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      const primaryAirport = city?.primaryAirport || 'JFK'

      if (!email) {
        console.error('No email in checkout session')
        break
      }

      console.log(`New subscription: ${email} for ${cityName} (${citySlug})`)

      // Create or update subscriber in Supabase
      const { error: dbError } = await supabase
        .from('subscribers')
        .upsert({
          email,
          home_city: citySlug,
          home_airport: primaryAirport,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: 'trial',
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        }, {
          onConflict: 'email',
        })

      if (dbError) {
        console.error('Error creating subscriber:', dbError)
      }

      // Send welcome email
      try {
        const resend = getResend()
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `Welcome to Homebase Flights - ${cityName}`,
          html: renderWelcomeEmail({ cityName }),
        })
        console.log(`Welcome email sent to ${email}`)
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError)
      }

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const customerId = subscription.customer as string
      const status = subscription.status

      // Map Stripe status to our status
      let ourStatus = 'active'
      if (status === 'trialing') ourStatus = 'trial'
      else if (status === 'canceled' || status === 'unpaid') ourStatus = 'cancelled'
      else if (status === 'past_due') ourStatus = 'expired'

      // Update subscriber status
      const { error } = await supabase
        .from('subscribers')
        .update({ status: ourStatus })
        .eq('stripe_customer_id', customerId)

      if (error) {
        console.error('Error updating subscriber:', error)
      }

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const customerId = subscription.customer as string

      // Mark subscriber as cancelled
      const { error } = await supabase
        .from('subscribers')
        .update({ status: 'cancelled' })
        .eq('stripe_customer_id', customerId)

      if (error) {
        console.error('Error cancelling subscriber:', error)
      }

      console.log(`Subscription cancelled for customer ${customerId}`)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as unknown as {
        customer: string
        amount_paid: number
        billing_reason: string | null
        id: string
      }
      const customerId = invoice.customer
      const amountPaid = invoice.amount_paid

      // Track Purchase if amount > 0
      // billing_reason 'subscription_update' = trial end, 'subscription_cycle' = recurring
      if (amountPaid <= 0) {
        break
      }

      // Get subscriber from Supabase
      const { data: subscriber, error: subscriberError } = await supabase
        .from('subscribers')
        .select('email, home_city, meta_fbc, meta_fbp')
        .eq('stripe_customer_id', customerId)
        .single()

      if (subscriberError || !subscriber) {
        console.error('Error fetching subscriber for Purchase event:', subscriberError)
        break
      }

      // Determine currency and value based on city
      const isLondon = subscriber.home_city === 'london'
      const currency = isLondon ? 'GBP' : 'USD'
      const value = isLondon ? 47 : 59

      // Track Purchase event via CAPI
      const result = await trackPurchaseServer({
        email: subscriber.email,
        currency,
        value,
        city: subscriber.home_city || undefined,
        eventSourceUrl: `https://homebaseflights.com/checkout/success?city=${subscriber.home_city || ''}`,
        clientIpAddress: '0.0.0.0', // Not available in webhook context
        clientUserAgent: 'Stripe Webhook', // Not available in webhook context
        fbc: subscriber.meta_fbc || undefined,
        fbp: subscriber.meta_fbp || undefined,
      })

      if (!result.success) {
        console.error(`Failed to track Purchase for ${subscriber.email}:`, result.error)
      }

      break
    }

    default:
      // Unhandled event type
  }

  return NextResponse.json({ received: true })
}
