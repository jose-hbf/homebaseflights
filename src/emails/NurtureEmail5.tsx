import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface NurtureEmail5Props {
  subscriberEmail: string
}

/**
 * Email 5 — Day 12: Your trial ends in 2 days
 * Urgency email with what happens next
 */
export function renderNurtureEmail5({
  subscriberEmail,
}: NurtureEmail5Props): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your trial ends in 2 days</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Heads up — your free trial ends in 2 days.
    </p>

    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Here's what happens next:
    </p>

    <div style="margin: 0 0 24px 0; padding: 16px; background-color: #f0fdf4; border-radius: 8px; border-left: 3px solid #22c55e;">
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #374151;">
        → Day 15: Your subscription ($59/year) starts automatically
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #374151;">
        → You keep getting deals from JFK, Newark & LaGuardia every week
      </p>
      <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #374151;">
        → Our 100% money-back guarantee kicks in (save 3× or get a refund)
      </p>
    </div>

    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Here's what happens if you cancel:
    </p>

    <div style="margin: 0 0 24px 0; padding: 16px; background-color: #fef2f2; border-radius: 8px; border-left: 3px solid #ef4444;">
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #374151;">
        → No more deal alerts from New York
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #374151;">
        → You go back to searching manually (or seeing deals from cities you don't live in)
      </p>
      <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #374151;">
        → The next $273 Paris flight? You'll probably miss it.
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      No pressure. But if you've liked what you've seen so far, doing nothing is the right move. We'll keep finding the deals.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Questions? Just reply to this email.
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
