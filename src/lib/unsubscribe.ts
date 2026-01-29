/**
 * Generate a simple verification token for unsubscribe links
 * This provides basic protection against automated unsubscription
 */
export function generateUnsubscribeToken(email: string): string {
  return Buffer.from(email).toString('base64').slice(0, 16)
}

/**
 * Generate a complete unsubscribe URL with email and token
 */
export function getUnsubscribeUrl(email: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://homebaseflights.com'
  const token = generateUnsubscribeToken(email)
  return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&t=${token}`
}
