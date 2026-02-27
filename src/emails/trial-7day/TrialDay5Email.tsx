import * as React from 'react'

interface TrialDay5EmailProps {
  cityName: string
  trialEndDate: string
}

export function TrialDay5Email({ cityName, trialEndDate }: TrialDay5EmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ padding: '24px 24px 20px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style={{ display: 'block' }} />
      </div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 600, color: '#111827' }}>
          Your trial ends in 2 days
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 24px 0' }}>
          Here's what you've seen during your trial:
        </p>

        <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
            📊 Your trial recap:
          </h3>
          <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#374151', fontSize: '16px', lineHeight: '1.8' }}>
            <li>12 deals found from {cityName}</li>
            <li>Average savings: $420 per flight</li>
            <li>Best deal: NYC → Paris for $273 (68% off)</li>
            <li>Total potential savings: $5,040</li>
          </ul>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 12px 0' }}>
            ✅ If you stay with us:
          </h3>
          <ul style={{ margin: '0 0 16px 0', padding: '0 0 0 20px', color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>
            <li>Continue getting all deals instantly</li>
            <li>Just $5.99/month (cancel anytime)</li>
            <li>One deal pays for 70+ months</li>
          </ul>

          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 12px 0' }}>
            ❌ If you cancel:
          </h3>
          <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#374151', fontSize: '16px', lineHeight: '1.6' }}>
            <li>Miss out on mistake fares</li>
            <li>Pay full price for flights</li>
            <li>Spend hours searching yourself</li>
          </ul>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#166534' }}>
            🎁 Special offer: Stay and get your first month for $2.99
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#166534' }}>
            That's 50% off your first paid month. No action needed - discount applies automatically if you continue.
          </p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
            <strong>Your trial ends: {trialEndDate}</strong><br />
            You'll be charged $5.99/month (first month $2.99)<br />
            Cancel anytime at homebaseflights.com/account
          </p>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 16px 0' }}>
          Questions? Just reply to this email. We're here to help.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: 0 }}>
          Happy travels,<br />
          The Homebase Flights Team
        </p>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>
          <a href="https://homebaseflights.com/account" style={{ color: '#2563EB' }}>Manage subscription</a> •
          <a href="https://homebaseflights.com/cancel" style={{ color: '#2563EB', marginLeft: '8px' }}>Cancel trial</a> •
          <a href="https://homebaseflights.com" style={{ color: '#2563EB', marginLeft: '8px' }}>homebaseflights.com</a>
        </p>
      </div>
    </div>
  )
}

export function renderTrialDay5Email(props: TrialDay5EmailProps): string {
  const { cityName, trialEndDate } = props

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
      Your trial ends in 2 days
    </h1>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
      Here's what you've seen during your trial:
    </p>

    <!-- Trial recap -->
    <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 16px 0;">
        📊 Your trial recap:
      </h3>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; font-size: 16px; line-height: 1.8;">
        <li>12 deals found from ${cityName}</li>
        <li>Average savings: $420 per flight</li>
        <li>Best deal: NYC → Paris for $273 (68% off)</li>
        <li>Total potential savings: $5,040</li>
      </ul>
    </div>

    <!-- Stay vs Cancel -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">
        ✅ If you stay with us:
      </h3>
      <ul style="margin: 0 0 16px 0; padding: 0 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
        <li>Continue getting all deals instantly</li>
        <li>Just $5.99/month (cancel anytime)</li>
        <li>One deal pays for 70+ months</li>
      </ul>

      <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">
        ❌ If you cancel:
      </h3>
      <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
        <li>Miss out on mistake fares</li>
        <li>Pay full price for flights</li>
        <li>Spend hours searching yourself</li>
      </ul>
    </div>

    <!-- Special offer -->
    <div style="padding: 16px; background-color: #dcfce7; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #166534;">
        🎁 Special offer: Stay and get your first month for $2.99
      </p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #166534;">
        That's 50% off your first paid month. No action needed - discount applies automatically if you continue.
      </p>
    </div>

    <!-- Trial ending notice -->
    <div style="padding: 16px; background-color: #fef3c7; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>Your trial ends: ${trialEndDate}</strong><br />
        You'll be charged $5.99/month (first month $2.99)<br />
        Cancel anytime at homebaseflights.com/account
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
      Questions? Just reply to this email. We're here to help.
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
      Happy travels,<br />
      The Homebase Flights Team
    </p>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">
      <a href="https://homebaseflights.com/account" style="color: #2563EB;">Manage subscription</a> •
      <a href="https://homebaseflights.com/cancel" style="color: #2563EB; margin-left: 8px;">Cancel trial</a> •
      <a href="https://homebaseflights.com" style="color: #2563EB; margin-left: 8px;">homebaseflights.com</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}

export const trialDay5EmailSubject = '⏰ Your trial ends in 2 days'