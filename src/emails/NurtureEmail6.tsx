import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface NurtureEmail6Props {
  subscriberEmail: string
}

/**
 * Email 6 — Day 14: Last day of your free trial
 * Final reminder with value summary
 */
export function renderNurtureEmail6({
  subscriberEmail,
}: NurtureEmail6Props): string {
  const manageUrl = getManageSubscriptionUrl(subscriberEmail)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Last day of your free trial</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Today's your last day.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Tomorrow your subscription begins at $59/year. That's less than most airport meals.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Quick reminder of what you're getting:
    </p>

    <div style="margin: 0 0 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #374151;">
        ✓ Cheap flight deals from JFK, Newark & LaGuardia — every week
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #374151;">
        ✓ We track all 3 airports so you never miss a price drop
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #374151;">
        ✓ 100% money-back guarantee if you don't save at least $177 this year
      </p>
      <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #374151;">
        ✓ Cancel anytime, no hassle
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      If you want to cancel, no hard feelings — you can do it right here:
      <a href="${manageUrl}" style="color: #2563EB; text-decoration: underline;">Cancel subscription</a>
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      If you want to keep saving on flights: do nothing. We'll handle the rest.
    </p>

    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Here's to cheaper travel from New York.
    </p>

    <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; color: #374151;">
      — Homebase Flights
    </p>

  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
      Questions? Reply to this email — we're happy to help.
    </p>
    <p style="margin: 0; font-size: 12px;">
      <a href="${manageUrl}"
         style="color: #2563EB;">Manage subscription</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}
