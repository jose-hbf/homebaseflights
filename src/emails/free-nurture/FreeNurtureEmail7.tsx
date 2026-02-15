import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface FreeNurtureEmail7Props {
  subscriberEmail: string
  dealsFound?: number
  dealsYouSaw?: number
  topDestination?: string
  topSavings?: number
}

const UPGRADE_URL = 'https://buy.stripe.com/4gM7sNgMyejzapagigaR201'

function getUpgradeUrl(email: string, emailNumber: number): string {
  const url = new URL(UPGRADE_URL)
  url.searchParams.set('prefilled_email', email)
  url.searchParams.set('utm_source', 'email')
  url.searchParams.set('utm_medium', 'nurturing')
  url.searchParams.set('utm_campaign', 'free_to_pro')
  url.searchParams.set('utm_content', `email_${emailNumber}`)
  return url.toString()
}

/**
 * Email 7 — Day 30+: Monthly recap (ongoing)
 * Sent monthly with stats on what they missed
 */
export function renderFreeNurtureEmail7({
  subscriberEmail,
  dealsFound = 32,
  dealsYouSaw = 8,
  topDestination = 'Tokyo',
  topSavings = 890,
}: FreeNurtureEmail7Props): string {
  const upgradeUrl = getUpgradeUrl(subscriberEmail, 7)
  const dealsMissed = dealsFound - dealsYouSaw

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your monthly flight deals recap</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Here's your monthly recap from Homebase Flights:
    </p>

    <!-- Stats Box -->
    <div style="padding: 24px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
        This Month from New York
      </p>

      <div style="display: flex; margin-bottom: 16px;">
        <div style="flex: 1; text-align: center; padding: 12px; background-color: #ffffff; border-radius: 6px; margin-right: 8px;">
          <p style="margin: 0 0 4px 0; font-size: 28px; font-weight: 700; color: #111827;">${dealsFound}</p>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">Deals Found</p>
        </div>
        <div style="flex: 1; text-align: center; padding: 12px; background-color: #ffffff; border-radius: 6px; margin-left: 8px;">
          <p style="margin: 0 0 4px 0; font-size: 28px; font-weight: 700; color: #10b981;">${dealsYouSaw}</p>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">You Saw</p>
        </div>
      </div>

      <div style="padding: 12px; background-color: #fef3c7; border-radius: 6px;">
        <p style="margin: 0; font-size: 14px; color: #92400e; text-align: center;">
          <strong>${dealsMissed} deals</strong> went to Pro members only
        </p>
      </div>
    </div>

    <!-- Top Deal -->
    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151; font-weight: 600;">
      Best deal this month:
    </p>

    <div style="padding: 16px; background-color: #ecfdf5; border-radius: 8px; margin-bottom: 24px; border: 1px solid #10b981;">
      <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #111827;">
        → NYC → ${topDestination}
      </p>
      <p style="margin: 0; font-size: 14px; color: #065f46;">
        <strong style="color: #047857;">Saved $${topSavings}</strong> — Pro members only
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      With Pro, you'd see every deal the moment we find it. No waiting for weekly summaries. No missing out on flash sales.
    </p>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${upgradeUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 9999px;">
        Upgrade to Pro — $59/year →
      </a>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
      That's $4.92/month. One deal pays for 7+ years of membership.
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

export const freeNurtureEmail7Subject = 'Your monthly flight deals recap'
