import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface FreeNurtureEmail3Props {
  subscriberEmail: string
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
 * Email 3 — Day 7: Weekly Recap + FOMO on missed deals
 */
export function renderFreeNurtureEmail3({
  subscriberEmail,
}: FreeNurtureEmail3Props): string {
  const upgradeUrl = getUpgradeUrl(subscriberEmail, 3)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You saved $577 this week (if you booked)</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Here's your weekly recap from Homebase Flights:
    </p>

    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151; font-weight: 600;">
      This week's free deals from New York:
    </p>

    <!-- Deal 1 -->
    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
      <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #111827;">
        → NYC → Tokyo: $510 roundtrip
      </p>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        Normally $1,400 — <strong style="color: #15803d;">Save $890</strong>
      </p>
    </div>

    <!-- Deal 2 -->
    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #111827;">
        → NYC → London: $327 roundtrip
      </p>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        Normally $780 — <strong style="color: #15803d;">Save $453</strong>
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      If you booked just one of these, you would have saved more than most people spend on a year of streaming services. Combined.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151; font-weight: 600;">
      But here's what you missed:
    </p>

    <!-- FOMO Section -->
    <div style="padding: 20px; background-color: #fef3c7; border-radius: 8px; margin-bottom: 24px; border: 1px solid #fcd34d;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #92400e; font-weight: 600;">
        This week we found 8 deals from New York. You saw 2.
      </p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #92400e;">
        Our Pro members saw all 8, including:
      </p>
      <p style="margin: 0 0 4px 0; font-size: 14px; color: #78350f;">
        → NYC → Rome: $287 <span style="color: #b45309;">(Pro only)</span>
      </p>
      <p style="margin: 0 0 4px 0; font-size: 14px; color: #78350f;">
        → NYC → Lisbon: $242 <span style="color: #b45309;">(Pro only)</span>
      </p>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #78350f;">
        → NYC → Amsterdam: $312 <span style="color: #b45309;">(Pro only)</span>
      </p>
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        These Pro-only deals arrived in their inbox the moment we found them. Most sold out within 24 hours.
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${upgradeUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 9999px;">
        Get all deals, instantly →
      </a>
    </div>

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

export const freeNurtureEmail3Subject = 'You saved $577 this week (if you booked)'
