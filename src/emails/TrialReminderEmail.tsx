import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface TrialReminderEmailProps {
  subscriberEmail: string
  cityName: string
  daysLeft: number
}

export function renderTrialReminderEmail({
  subscriberEmail,
  cityName,
  daysLeft,
}: TrialReminderEmailProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your trial ends in ${daysLeft} days</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">
    
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827;">
      Your free trial ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}
    </h1>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Since you joined, we've been monitoring flights from ${cityName} around the clock.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      As a member, you'll continue receiving daily digests with the best prices from ${cityName}.
    </p>

    <p style="margin: 0 0 0 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Your subscription will automatically continue after the trial — no action needed. If you'd like to cancel, you can do so anytime.
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
