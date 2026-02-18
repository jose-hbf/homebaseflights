import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface FreeNurtureEmail2Props {
  subscriberEmail: string
}

function getUpgradeUrl(email: string, emailNumber: number): string {
  const url = new URL('https://homebaseflights.com/upgrade')
  url.searchParams.set('email', email)
  url.searchParams.set('utm_source', 'email')
  url.searchParams.set('utm_medium', 'nurturing')
  url.searchParams.set('utm_campaign', 'free_to_pro')
  url.searchParams.set('utm_content', `email_${emailNumber}`)
  return url.toString()
}

/**
 * Email 2 — Day 3: How we find flights 60% cheaper
 * Educational email explaining NYC-focused approach
 */
export function renderFreeNurtureEmail2({
  subscriberEmail,
}: FreeNurtureEmail2Props): string {
  const upgradeUrl = getUpgradeUrl(subscriberEmail, 2)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How we find flights 60% cheaper than Google</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Quick peek behind the curtain.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Most flight deal services blast the same deals to everyone. NYC, LA, Chicago — doesn't matter. You get the same email.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      We do the opposite.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      We only track flights from JFK, Newark & LaGuardia. When prices drop on routes from your airport, you're the first to know. Not someone in another city. You.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Here's a deal we found today:
    </p>

    <!-- Deal -->
    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #111827;">
        → NYC → Barcelona: $293 roundtrip
      </p>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        Normally $780 — <strong style="color: #15803d;">Save $487</strong>
      </p>
    </div>

    <!-- FOMO Line -->
    <div style="padding: 16px; background-color: #eff6ff; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #2563eb;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af; font-weight: 600;">
        This week we found 8 deals from New York. You're seeing 1.
      </p>
      <p style="margin: 0; font-size: 14px; color: #374151;">
        Our Pro members got all 8 — including a $198 mistake fare to Milan that lasted 6 hours.
      </p>
      <p style="margin: 8px 0 0 0; font-size: 14px;">
        <a href="${upgradeUrl}" style="color: #2563eb; font-weight: 600;">Upgrade to Pro →</a>
      </p>
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

export const freeNurtureEmail2Subject = 'How we find flights 60% cheaper than Google'
