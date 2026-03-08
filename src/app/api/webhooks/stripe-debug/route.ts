import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Debug endpoint to check if Stripe webhooks are being received
export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')
    const stripeEvent = headersList.get('stripe-event')

    // Log everything for debugging
    console.log('[Stripe Debug Webhook] ==========================================')
    console.log('[Stripe Debug Webhook] Received webhook at:', new Date().toISOString())
    console.log('[Stripe Debug Webhook] Signature present:', !!signature)
    console.log('[Stripe Debug Webhook] Event type header:', stripeEvent)
    console.log('[Stripe Debug Webhook] Body length:', body.length)

    // Parse body to get event type
    try {
      const parsed = JSON.parse(body)
      console.log('[Stripe Debug Webhook] Event type:', parsed.type)
      console.log('[Stripe Debug Webhook] Event ID:', parsed.id)
      console.log('[Stripe Debug Webhook] Livemode:', parsed.livemode)

      if (parsed.data?.object) {
        const obj = parsed.data.object
        console.log('[Stripe Debug Webhook] Object type:', obj.object)

        if (obj.customer_email || obj.customer_details?.email) {
          console.log('[Stripe Debug Webhook] Customer email:', obj.customer_email || obj.customer_details?.email)
        }

        if (obj.customer) {
          console.log('[Stripe Debug Webhook] Customer ID:', obj.customer)
        }

        if (obj.subscription) {
          console.log('[Stripe Debug Webhook] Subscription ID:', obj.subscription)
        }

        if (obj.client_reference_id) {
          console.log('[Stripe Debug Webhook] Client reference ID:', obj.client_reference_id)
        }
      }
    } catch (e) {
      console.log('[Stripe Debug Webhook] Could not parse body as JSON')
    }

    console.log('[Stripe Debug Webhook] ==========================================')

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
      debug: true
    })
  } catch (error) {
    console.error('[Stripe Debug Webhook] Error:', error)
    return NextResponse.json({ error: 'Debug webhook error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Stripe debug webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}