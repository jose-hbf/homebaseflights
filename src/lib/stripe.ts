import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (stripeInstance) {
    return stripeInstance
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  stripeInstance = new Stripe(secretKey, {
    apiVersion: '2026-01-28.clover',
  })

  return stripeInstance
}

/**
 * Create a Customer Portal session for subscription management
 */
export async function createPortalSession(customerId: string): Promise<string> {
  const stripe = getStripe()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://homebaseflights.com'

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/?portal=closed`,
  })

  return session.url
}
