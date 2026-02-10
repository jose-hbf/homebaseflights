import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface NurtureEmail3Props {
  subscriberEmail: string
}

/**
 * Email 3 — Day 7: Your first week recap
 * Value demonstration with sample deals found
 */
export function renderNurtureEmail3({
  subscriberEmail,
}: NurtureEmail3Props): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your first week: here's what we found from New York</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      You're one week into your trial. Here's a quick snapshot:
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      This week we tracked price drops on routes from JFK, Newark & LaGuardia to 40+ destinations. Some highlights:
    </p>

    <div style="margin: 0 0 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #374151;">
        → Fares to Europe dropped 15-30% this week
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #374151;">
        → Best deal spotted: NYC → Paris at $273 (68% below average)
      </p>
      <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #374151;">
        → Caribbean routes are heating up with spring deals
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      The best deals go fast — most last 24-48 hours before prices bounce back. That's why getting alerts matters.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      You've got 7 days left in your trial. Keep watching your inbox — the deals keep coming.
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
