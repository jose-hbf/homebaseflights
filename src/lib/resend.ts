import { Resend } from 'resend'

let resendInstance: Resend | null = null

export function getResend(): Resend {
  if (resendInstance) {
    return resendInstance
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set. Please set it in your environment variables.')
  }

  resendInstance = new Resend(apiKey)
  return resendInstance
}

/**
 * Email sender address
 * 
 * IMPORTANT: Before going live, you must:
 * 1. Add and verify your domain in Resend (https://resend.com/domains)
 * 2. Set RESEND_FROM_EMAIL in your environment variables
 * 
 * For development/testing, use: onboarding@resend.dev
 * For production with verified domain: deals@homebaseflights.com
 */
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Homebase Flights <onboarding@resend.dev>'
export const FROM_NAME = 'Homebase Flights'
