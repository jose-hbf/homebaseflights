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

export const FROM_EMAIL = 'Homebase Flights <deals@homebaseflights.com>'
