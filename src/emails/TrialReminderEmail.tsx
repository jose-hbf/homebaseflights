import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface TrialReminderEmailProps {
  subscriberEmail: string
  cityName: string
  daysLeft: number
  dealsFound: number
  totalSavings: number // Total potential savings in dollars
  topDestinations: string[] // e.g., ["Paris", "Tokyo", "Barcelona"]
}

export function renderTrialReminderEmail({
  subscriberEmail,
  cityName,
  daysLeft,
  dealsFound,
  totalSavings,
  topDestinations,
}: TrialReminderEmailProps): string {
  const destinationsList = topDestinations.length > 0 
    ? topDestinations.slice(0, 5).join(', ')
    : 'amazing destinations'

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

    <!-- Value Summary Box -->
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #166534;">
        What we found for you:
      </h2>
      
      <div style="margin-bottom: 12px;">
        <span style="font-size: 32px; font-weight: 700; color: #166534;">${dealsFound}</span>
        <span style="font-size: 16px; color: #166534; margin-left: 8px;">flight deals</span>
      </div>
      
      ${totalSavings > 0 ? `
      <div style="margin-bottom: 12px;">
        <span style="font-size: 32px; font-weight: 700; color: #166534;">$${totalSavings.toLocaleString()}</span>
        <span style="font-size: 16px; color: #166534; margin-left: 8px;">potential savings</span>
      </div>
      ` : ''}
      
      <p style="margin: 0; font-size: 14px; color: #166534;">
        Destinations: ${destinationsList}
      </p>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      As a member, you'll continue receiving instant alerts when we find exceptional deals, plus daily digests with the best prices from ${cityName}.
    </p>

    <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      Your subscription will automatically continue after the trial — no action needed. If you'd like to cancel, you can do so anytime.
    </p>

    <!-- CTA -->
    <a href="https://homebaseflights.com"
       style="display: inline-block; background-color: #2563EB; color: white; text-align: center; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 16px;">
      View latest deals
    </a>

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
