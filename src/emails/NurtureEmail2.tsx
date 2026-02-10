import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface NurtureEmail2Props {
  subscriberEmail: string
}

/**
 * Email 2 — Day 3: How we find flights 60% cheaper
 * Educational email explaining our NYC-focused approach
 */
export function renderNurtureEmail2({
  subscriberEmail,
}: NurtureEmail2Props): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How we find flights 60% cheaper</title>
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

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      That's why our members save an average of $420 per booked trip. The deals are relevant because they actually depart from where you live.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Your next deal from New York could arrive tomorrow. Stay tuned.
    </p>

    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
      — Homebase Flights
    </p>

  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
      Questions? Reply to this email — we're happy to help.
    </p>
    <p style="margin: 0; font-size: 12px;">
      <a href="${getManageSubscriptionUrl(subscriberEmail)}"
         style="color: #2563EB;">Manage subscription</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}
