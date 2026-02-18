import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface FreeNurtureEmail4Props {
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
 * Email 4 — Day 10: The math behind $59/year
 * ROI-focused conversion email
 */
export function renderFreeNurtureEmail4({
  subscriberEmail,
}: FreeNurtureEmail4Props): string {
  const upgradeUrl = getUpgradeUrl(subscriberEmail, 4)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The math behind $59/year</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Let's do some quick math.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Homebase Flights Pro costs <strong>$59/year</strong>. That's <strong>$4.92/month</strong>.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      The average deal we find saves <strong>$420</strong> on a single flight.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      That means <strong>one booked deal pays for your membership for the next 7 years</strong>.
    </p>

    <!-- What Pro gets -->
    <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #111827;">
        Here's what Pro members get that you don't:
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #374151;">
        ✓ <strong>ALL deals</strong> from JFK, EWR & LaGuardia (not just 2/week)
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #374151;">
        ✓ Deals sent the <strong>MOMENT</strong> we find them (not in a weekly summary)
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #374151;">
        ✓ <strong>Mistake fares & flash sales</strong> (exclusive to Pro)
      </p>
      <p style="margin: 0; font-size: 15px; color: #374151;">
        ✓ <strong>100% money-back guarantee</strong> — don't save $177 in year 1? Full refund.
      </p>
    </div>

    <!-- FOMO Line -->
    <div style="padding: 16px; background-color: #eff6ff; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #2563eb;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af; font-weight: 600;">
        Right now you're seeing ~2 deals per week. Pro members see 8-10.
      </p>
      <p style="margin: 0; font-size: 14px; color: #374151;">
        One deal. That's all it takes to pay for itself.
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${upgradeUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 9999px;">
        Upgrade to Pro →
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

export const freeNurtureEmail4Subject = 'The math behind $59/year'
