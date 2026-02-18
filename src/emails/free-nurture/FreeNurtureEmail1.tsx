import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface FreeNurtureEmail1Props {
  subscriberEmail: string
  cityName?: string
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
 * Email 1 — Immediate: Welcome + First Deals
 * Sent immediately when user signs up for free plan
 */
export function renderFreeNurtureEmail1({
  subscriberEmail,
  cityName = 'New York',
}: FreeNurtureEmail1Props): string {
  const upgradeUrl = getUpgradeUrl(subscriberEmail, 1)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your first deals from ${cityName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Welcome to Homebase Flights!
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Here are this week's best deals from JFK, Newark & LaGuardia:
    </p>

    <!-- Deal 1 -->
    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
      <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #111827;">
        → NYC → Paris: $273 roundtrip
      </p>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        Normally $850 — <strong style="color: #15803d;">Save $577</strong>
      </p>
    </div>

    <!-- Deal 2 -->
    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #111827;">
        → NYC → Dublin: $207 roundtrip
      </p>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        Normally $620 — <strong style="color: #15803d;">Save $413</strong>
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      These are real prices we found this week. They won't last long — most deals like this disappear within 48 hours.
    </p>

    <!-- FOMO Line -->
    <div style="padding: 16px; background-color: #eff6ff; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #2563eb;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af; font-weight: 600;">
        This week we found 8 deals from New York. You're seeing 2.
      </p>
      <p style="margin: 0; font-size: 14px;">
        <a href="${upgradeUrl}" style="color: #2563eb; font-weight: 600;">Want all 8, the moment we find them? →</a>
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      More deals coming soon. Keep an eye on your inbox.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      — Homebase Flights
    </p>

    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280; font-style: italic;">
      P.S. You're on our free plan. You'll get our 2 best deals every week. <a href="${upgradeUrl}" style="color: #2563eb;">Upgrade anytime</a> to get all deals instantly.
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

export const freeNurtureEmail1Subject = 'NYC → Paris $273 (found this week)'
