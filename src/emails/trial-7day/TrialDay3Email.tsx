import * as React from 'react'

interface TrialDay3EmailProps {
  cityName: string
  trialEndDate: string
  daysLeft: number
}

export function TrialDay3Email({ cityName, trialEndDate, daysLeft }: TrialDay3EmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ padding: '24px 24px 20px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style={{ display: 'block' }} />
      </div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 600, color: '#111827' }}>
          How we find flights 60% cheaper
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 24px 0' }}>
          Your trial is halfway through! Let me show you how we save members like you hundreds on every trip.
        </p>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 12px 0' }}>
            🔍 We catch pricing mistakes
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 16px 0' }}>
            Airlines make mistakes. A $1,200 flight to Tokyo accidentally priced at $400? We catch it instantly and alert you before it's fixed.
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 12px 0' }}>
            ⚡ Flash sales that last minutes
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 16px 0' }}>
            Some deals disappear in 30 minutes. Our system monitors 24/7 so you never miss them.
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 12px 0' }}>
            📍 Only from YOUR airport
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 16px 0' }}>
            No wasting time on deals from other cities. Every alert is bookable from {cityName}.
          </p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#111827' }}>
            Today's deal: NYC → Barcelona $293
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            Regular price: $780 • You save: $487<br />
            That's 81 months of membership paid back with one flight!
          </p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
            <strong>{daysLeft} days left in your trial</strong><br />
            Your trial ends {trialEndDate}<br />
            Continue for just $5.99/month (less than a coffee!)
          </p>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: 0 }}>
          Happy travels,<br />
          The Homebase Flights Team
        </p>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>
          <a href="https://homebaseflights.com/account" style={{ color: '#2563EB' }}>Manage subscription</a> •
          <a href="https://homebaseflights.com" style={{ color: '#2563EB', marginLeft: '8px' }}>homebaseflights.com</a>
        </p>
      </div>
    </div>
  )
}

export function renderTrialDay3Email(props: TrialDay3EmailProps): string {
  const { cityName, trialEndDate, daysLeft } = props

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Content -->
  <div style="padding: 24px;">
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827;">
      How we find flights 60% cheaper
    </h1>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
      Your trial is halfway through! Let me show you how we save members like you hundreds on every trip.
    </p>

    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">
        🔍 We catch pricing mistakes
      </h3>
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
        Airlines make mistakes. A $1,200 flight to Tokyo accidentally priced at $400? We catch it instantly and alert you before it's fixed.
      </p>

      <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">
        ⚡ Flash sales that last minutes
      </h3>
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
        Some deals disappear in 30 minutes. Our system monitors 24/7 so you never miss them.
      </p>

      <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">
        📍 Only from YOUR airport
      </h3>
      <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
        No wasting time on deals from other cities. Every alert is bookable from ${cityName}.
      </p>
    </div>

    <!-- Today's deal -->
    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">
        Today's deal: NYC → Barcelona $293
      </p>
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        Regular price: $780 • You save: $487<br />
        That's 81 months of membership paid back with one flight!
      </p>
    </div>

    <!-- Trial reminder -->
    <div style="padding: 16px; background-color: #fef3c7; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>${daysLeft} days left in your trial</strong><br />
        Your trial ends ${trialEndDate}<br />
        Continue for just $5.99/month (less than a coffee!)
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
      Happy travels,<br />
      The Homebase Flights Team
    </p>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">
      <a href="https://homebaseflights.com/account" style="color: #2563EB;">Manage subscription</a> •
      <a href="https://homebaseflights.com" style="color: #2563EB; margin-left: 8px;">homebaseflights.com</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}

export const trialDay3EmailSubject = '🔥 How we find flights 60% cheaper'