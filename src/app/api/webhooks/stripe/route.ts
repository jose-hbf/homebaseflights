import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { renderWelcomeEmail } from '@/emails/WelcomeEmail'
import { getCityBySlug } from '@/data/cities'
import { trackPurchaseServer, trackStartTrialServer } from '@/lib/meta-capi'

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

      console.log(`[Stripe Webhook] New subscription: ${email} for ${cityName} (${citySlug})`)
      console.log(`[Stripe Webhook] Session ID: ${session.id}`)
      console.log(`[Stripe Webhook] Customer ID: ${customerId}`)
      console.log(`[Stripe Webhook] Subscription ID: ${subscriptionId}`)

      // Check if this user was previously saved (as pending_payment, free, or other)
      const { data: existingSubscriber } = await supabase
        .from('subscribers')
        .select('plan, status, meta_fbc, meta_fbp, home_city, home_airport')
        .eq('email', email)
        .single()

      const wasFreeTier = existingSubscriber?.plan === 'free'
      const wasPending = existingSubscriber?.status === 'pending_payment'

      // Extract city info from client_reference_id if available (format: citySlug_trial_uuid)
      let finalCitySlug = citySlug
      let finalAirport = primaryAirport

      if (session.client_reference_id && session.client_reference_id.includes('_trial_')) {
        const parts = session.client_reference_id.split('_trial_')
        if (parts[0]) {
          finalCitySlug = parts[0]
          const extractedCity = getCityBySlug(parts[0])
          if (extractedCity) {
            finalAirport = extractedCity.primaryAirport
            console.log(`[Stripe Webhook] Extracted city from client_reference_id: ${parts[0]}`)
          }
        }
      }

      // Use existing city data if we had it from pending_payment
      if (existingSubscriber?.home_city) {
        finalCitySlug = existingSubscriber.home_city
        finalAirport = existingSubscriber.home_airport || finalAirport
        console.log(`[Stripe Webhook] Using existing city data: ${finalCitySlug}`)
      }

      console.log(`[Stripe Webhook] Final city/airport: ${finalCitySlug}/${finalAirport} (wasPending: ${wasPending})`)

      // Get trial end date from Stripe subscription
      let trialEndsAt: string
      try {
        const stripe = getStripe()
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        if (subscription.trial_end) {
          trialEndsAt = new Date(subscription.trial_end * 1000).toISOString()
        } else {
          // Fallback to 7 days if no trial
          trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      } catch {
        // Fallback to 7 days on error
        trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }

      // Create or update subscriber in Supabase
      // Update from pending_payment/free to paid with trial status
      const { error: dbError } = await supabase
        .from('subscribers')
        .upsert({
          email,
          home_city: finalCitySlug,
          home_airport: finalAirport,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: 'trial',
          plan: 'paid', // Upgrade from pending/free to paid
          trial_ends_at: trialEndsAt,
        }, {
          onConflict: 'email',
        })

      if (dbError) {
        console.error('[Stripe Webhook] ERROR creating/updating subscriber:', dbError)
        console.error('[Stripe Webhook] Failed data:', { email, finalCitySlug, finalAirport, customerId, subscriptionId })
        // Don't fail the webhook - continue to send welcome email
      } else {
        console.log(`[Stripe Webhook] ✅ Successfully saved ${email} to database as paid/trial`)
      }

      // Track StartTrial event for Meta Pixel (especially important for free→paid conversions)
      // This is the key conversion event for the ads funnel
      const isLondon = finalCitySlug === 'london'
      const result = await trackStartTrialServer({
        email,
        currency: isLondon ? 'GBP' : 'USD',
        value: isLondon ? 47 : 59,
        city: finalCitySlug,
        fbc: existingSubscriber?.meta_fbc || undefined,
        fbp: existingSubscriber?.meta_fbp || undefined,
      })

      if (result.success) {
        console.log(`StartTrial event tracked for ${email} (wasFreeTier: ${wasFreeTier})`)
      } else {
        console.error(`Failed to track StartTrial for ${email}:`, result.error)
      }

      // Send welcome email with initial deals
      try {
        console.log(`[Stripe Webhook] Preparing welcome email for ${email}...`)

        // Get some initial deals to include in welcome email
        const { data: deals } = await supabase
          .from('flight_deals')
          .select('destination_city, price, departure_date, booking_url')
          .eq('city_slug', finalCitySlug)
          .order('price', { ascending: true })
          .limit(8)

        const resend = getResend()

        // Send welcome email with deals
        if (deals && deals.length > 0) {
          console.log(`[Stripe Webhook] Including ${deals.length} deals in welcome email`)

          const dealsHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
                .deal { border: 1px solid #e5e7eb; padding: 16px; margin: 12px 0; border-radius: 8px; background: white; }
                .price { color: #16a34a; font-size: 24px; font-weight: bold; }
                .cta { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Welcome to Your 7-Day Trial!</h1>
                  <p>Your flight deals from ${cityName} start now</p>
                </div>

                <h2 style="margin-top: 30px;">Today's Best Deals from ${cityName}</h2>
                ${deals.map(deal => `
                  <div class="deal">
                    <h3>✈️ ${cityName} → ${deal.destination_city || 'Amazing Destination'}</h3>
                    <p class="price">$${deal.price}</p>
                    <p>Departure: ${new Date(deal.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                `).join('')}

                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
                  <h3>🎁 Your Trial Benefits</h3>
                  <ul>
                    <li>Daily curated deals for 7 days</li>
                    <li>Mistake fares & error prices</li>
                    <li>Up to 90% off regular prices</li>
                    <li>After trial: only $5.99/month</li>
                    <li>Cancel anytime</li>
                  </ul>
                </div>

                <p style="text-align: center; margin-top: 30px;">
                  <a href="https://homebaseflights.com" class="cta">View All Deals →</a>
                </p>

                <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
                  Questions? Just reply to this email<br>
                  <a href="https://homebaseflights.com/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
                </p>
              </div>
            </body>
            </html>
          `

          const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `✈️ Welcome! ${deals.length} Flight Deals from ${cityName} Inside`,
            html: dealsHtml,
          })
          console.log(`[Stripe Webhook] ✅ Welcome email with deals sent to ${email}:`, result.data?.id)
        } else {
          // Send standard welcome without deals
          console.log(`[Stripe Webhook] No deals found, sending standard welcome`)
          const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Welcome to Homebase Flights Pro - ${cityName}`,
            html: renderWelcomeEmail({ cityName }),
          })
          console.log(`[Stripe Webhook] ✅ Standard welcome email sent to ${email}:`, result.data?.id)
        }
      } catch (emailError) {
        console.error('[Stripe Webhook] ERROR sending welcome email:', emailError)
        // Don't fail the webhook - best effort
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
