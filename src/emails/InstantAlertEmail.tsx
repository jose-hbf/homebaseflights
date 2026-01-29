interface InstantAlertEmailProps {
  deal: {
    destination: string
    destinationCode: string
    country: string
    price: number
    departureDate: string
    returnDate: string
    airline: string
    stops: number
    durationMinutes: number
    bookingLink: string
  }
  aiDescription: string
  cityName: string
  departureAirport: string
  subscriberEmail: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function renderInstantAlertEmail({
  deal,
  aiDescription,
  cityName,
  departureAirport,
  subscriberEmail,
}: InstantAlertEmailProps): string {
  const tripDays = Math.ceil(
    (new Date(deal.returnDate).getTime() - new Date(deal.departureDate).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔥 Exceptional Deal: ${departureAirport} → ${deal.destination}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">

  <!-- Urgent Header -->
  <div style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 24px; text-align: center;">
    <p style="margin: 0 0 8px 0; font-size: 14px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1px;">
      🔥 Exceptional Deal Alert
    </p>
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
      ${departureAirport} → ${deal.destination}
    </h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 18px;">
      ${deal.country}
    </p>
  </div>

  <!-- Price Banner -->
  <div style="background-color: #ffffff; padding: 24px; text-align: center; border-bottom: 4px solid #16a34a;">
    <p style="margin: 0; font-size: 48px; font-weight: bold; color: #16a34a;">
      $${deal.price}
    </p>
    <p style="margin: 4px 0 0 0; font-size: 16px; color: #6b7280;">
      Round trip • All taxes included
    </p>
  </div>

  <!-- AI Description -->
  <div style="background-color: #fef3c7; padding: 20px 24px; border-left: 4px solid #f59e0b;">
    <p style="margin: 0; font-size: 18px; line-height: 1.5; color: #92400e; font-style: italic;">
      "${aiDescription}"
    </p>
  </div>

  <!-- Deal Details -->
  <div style="padding: 24px; background-color: #ffffff;">
    
    <!-- Flight Info -->
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #6b7280;">Airline</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
            ${deal.airline}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #6b7280;">Flight</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
            ${deal.stops === 0 ? '✈️ Nonstop' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`} • ${formatDuration(deal.durationMinutes)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #6b7280;">Depart</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
            ${formatDate(deal.departureDate)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #6b7280;">Return</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
            ${formatDate(deal.returnDate)}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">
            <span style="color: #6b7280;">Trip length</span>
          </td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">
            ${tripDays} days
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA Button -->
    <a href="${deal.bookingLink}"
       style="display: block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; text-align: center; padding: 18px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 18px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);">
      Book This Deal Now →
    </a>

    <!-- Urgency Note -->
    <div style="margin-top: 20px; padding: 16px; background-color: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
      <p style="margin: 0; font-size: 14px; color: #dc2626; text-align: center;">
        <strong>⚡ Act fast!</strong> Exceptional deals like this typically sell out within hours.
      </p>
    </div>
  </div>

  <!-- Why This Deal -->
  <div style="padding: 24px; background-color: #f0fdf4; border-top: 1px solid #bbf7d0;">
    <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #166534;">
      Why we're alerting you
    </h3>
    <p style="margin: 0; font-size: 14px; color: #15803d; line-height: 1.6;">
      This deal is significantly below typical prices for this route. Our AI flagged it as 
      exceptional based on price, destination appeal, and travel dates. Deals like this are rare.
    </p>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; background-color: #1f2937; text-align: center;">
    <p style="margin: 0 0 4px 0; font-size: 14px; color: white; font-weight: 600;">
      ✈️ Homebase Flights
    </p>
    <p style="margin: 0 0 16px 0; font-size: 12px; color: #9ca3af;">
      Flight deals from ${cityName}
    </p>
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">
      You're receiving this instant alert because you subscribed to deal alerts from ${cityName}.
    </p>
    <p style="margin: 0; font-size: 12px; color: #6b7280;">
      <a href="https://homebaseflights.com/unsubscribe?email=${encodeURIComponent(subscriberEmail)}"
         style="color: #60a5fa;">Unsubscribe</a>
      &nbsp;•&nbsp;
      <a href="https://homebaseflights.com/preferences?email=${encodeURIComponent(subscriberEmail)}"
         style="color: #60a5fa;">Manage preferences</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}
