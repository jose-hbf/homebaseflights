/**
 * Generate a simple verification token for subscription management links
 * This provides basic protection against unauthorized access
 */
export function generateManageToken(email: string): string {
  return Buffer.from(email).toString('base64').slice(0, 16)
}

/**
 * Generate a complete subscription management URL with email and token
 * This redirects to Stripe Customer Portal
 */
export function getManageSubscriptionUrl(email: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://homebaseflights.com'
  const token = generateManageToken(email)
  return `${baseUrl}/manage?email=${encodeURIComponent(email)}&t=${token}`
}
