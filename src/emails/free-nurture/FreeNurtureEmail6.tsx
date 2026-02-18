import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface FreeNurtureEmail6Props {
  subscriberEmail: string
}

function getDiscountUrl(email: string, emailNumber: number): string {
  const url = new URL('https://homebaseflights.com/upgrade')
  url.searchParams.set('email', email)
  url.searchParams.set('utm_source', 'email')
  url.searchParams.set('utm_medium', 'nurturing')
  url.searchParams.set('utm_campaign', 'free_to_pro')
  url.searchParams.set('utm_content', `email_${emailNumber}`)
  url.searchParams.set('discount', 'FREEUSER10')
  return url.toString()
}

/**
 * Email 6 — Day 21: Offer expires tomorrow
 * Final urgency push before discount expires
 */
export function renderFreeNurtureEmail6({
  subscriberEmail,
}: FreeNurtureEmail6Props): string {
  const discountUrl = getDiscountUrl(subscriberEmail, 6)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your $49 rate expires tomorrow</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <!-- Urgency Banner -->
    <div style="padding: 16px; background-color: #fef2f2; border-radius: 8px; margin-bottom: 24px; border: 1px solid #fecaca; text-align: center;">
      <p style="margin: 0; font-size: 14px; color: #b91c1c; font-weight: 600;">
        ⏰ Your $49/year offer expires tomorrow at midnight
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Quick reminder: the $10 discount I offered you last week expires tomorrow.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      After that, Pro goes back to $59/year.
    </p>

    <!-- What you're missing -->
    <div style="padding: 20px; background-color: #fef3c7; border-radius: 8px; margin-bottom: 24px; border: 1px solid #fcd34d;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #92400e; font-weight: 600;">
        In the 3 weeks since you joined, here's what Pro members got that you didn't:
      </p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #78350f;">
        → 18 additional deals from New York
      </p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #78350f;">
        → 2 mistake fares (gone in hours)
      </p>
      <p style="margin: 0; font-size: 14px; color: #78350f;">
        → Average savings per deal: $420
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      One booked deal = 8+ years of Pro membership paid for.
    </p>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${discountUrl}" style="display: inline-block; padding: 14px 28px; background-color: #dc2626; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 9999px;">
        Lock in $49/year →
      </a>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
      100% money-back guarantee. Don't save $177 in year 1? Full refund.
    </p>

    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
      — Homebase Flights
    </p>

  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
      Questions? Reply to this email — we read every message.
    </p>
    <p style="margin: 0; font-size: 12px;">
      <a href="${getManageSubscriptionUrl(subscriberEmail)}" style="color: #6b7280;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}

export const freeNurtureEmail6Subject = 'Your $49 rate expires tomorrow'
