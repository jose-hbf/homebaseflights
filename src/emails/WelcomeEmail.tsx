import * as React from 'react'

interface WelcomeEmailProps {
  cityName?: string
}

export function WelcomeEmail({ cityName }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ padding: '24px 24px 20px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style={{ display: 'block' }} />
      </div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 600, color: '#111827' }}>
          Welcome to Homebase Flights
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 16px 0' }}>
          Thanks for signing up. You'll receive flight deals from {cityName || 'your home airport'} 
          directly in your inbox.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 24px 0' }}>
          We send deals when we find them — typically a few times per week. 
          Only deals worth your time, no spam.
        </p>

        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            <strong style={{ color: '#374151' }}>Tip:</strong> Add deals@homebaseflights.com to your contacts 
            so emails don't end up in spam.
          </p>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: 0 }}>
          Happy travels,<br />
          Homebase Flights
        </p>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ margin: 0, fontSize: '12px' }}>
          <a href="https://homebaseflights.com" style={{ color: '#2563EB' }}>homebaseflights.com</a>
        </p>
      </div>
    </div>
  )
}

export function renderWelcomeEmail(props: WelcomeEmailProps): string {
  const { cityName } = props

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
      Welcome to Homebase Flights
    </h1>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
      Thanks for signing up. You'll receive flight deals from ${cityName || 'your home airport'} 
      directly in your inbox.
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
      We send deals when we find them — typically a few times per week. 
      Only deals worth your time, no spam.
    </p>

    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        <strong style="color: #374151;">Tip:</strong> Add deals@homebaseflights.com to your contacts 
        so emails don't end up in spam.
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
      Happy travels,<br>
      Homebase Flights
    </p>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0; font-size: 12px;">
      <a href="https://homebaseflights.com" style="color: #2563EB;">homebaseflights.com</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}
