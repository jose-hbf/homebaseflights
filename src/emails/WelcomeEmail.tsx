import * as React from 'react'

interface WelcomeEmailProps {
  cityName?: string
}

export function WelcomeEmail({ cityName }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#2563eb', padding: '32px', textAlign: 'center' as const }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '28px' }}>
          Welcome to Homebase Flights!
        </h1>
      </div>

      <div style={{ padding: '32px', backgroundColor: '#ffffff' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
          Hey there! 👋
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
          Thanks for starting your free trial. You're now part of a community of travelers
          who save hundreds on every flight.
        </p>

        {cityName && (
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
            We'll be sending you the best flight deals from <strong>{cityName}</strong>
            directly to your inbox — typically 2-3 times per week.
          </p>
        )}

        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '24px',
          borderRadius: '8px',
          margin: '24px 0'
        }}>
          <h2 style={{ fontSize: '18px', color: '#1f2937', marginTop: 0 }}>
            What to expect:
          </h2>
          <ul style={{ color: '#374151', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Deals that are 40-90% off normal prices</li>
            <li>Mistake fares and flash sales before they're gone</li>
            <li>Only the best deals — no spam, ever</li>
          </ul>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
          <strong>Pro tip:</strong> Add <span style={{ color: '#2563eb' }}>deals@homebaseflights.com</span> to
          your contacts so our emails don't end up in spam!
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
          Your 7-day free trial has started. We can't wait to help you save on your next adventure.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
          Happy travels! ✈️<br />
          The Homebase Flights Team
        </p>
      </div>

      <div style={{
        padding: '24px',
        backgroundColor: '#f9fafb',
        textAlign: 'center' as const,
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <p style={{ margin: '0 0 8px 0' }}>
          Homebase Flights
        </p>
        <p style={{ margin: 0 }}>
          <a href="https://homebaseflights.com" style={{ color: '#2563eb' }}>
            homebaseflights.com
          </a>
        </p>
      </div>
    </div>
  )
}

export function renderWelcomeEmail(props: WelcomeEmailProps): string {
  // Simple HTML string render for Resend
  const { cityName } = props

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
  <div style="background-color: #2563eb; padding: 32px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Homebase Flights!</h1>
  </div>

  <div style="padding: 32px; background-color: #ffffff;">
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">Hey there! 👋</p>

    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Thanks for starting your free trial. You're now part of a community of travelers
      who save hundreds on every flight.
    </p>

    ${cityName ? `
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      We'll be sending you the best flight deals from <strong>${cityName}</strong>
      directly to your inbox — typically 2-3 times per week.
    </p>
    ` : ''}

    <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; margin: 24px 0;">
      <h2 style="font-size: 18px; color: #1f2937; margin-top: 0;">What to expect:</h2>
      <ul style="color: #374151; line-height: 1.8; padding-left: 20px;">
        <li>Deals that are 40-90% off normal prices</li>
        <li>Mistake fares and flash sales before they're gone</li>
        <li>Only the best deals — no spam, ever</li>
      </ul>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      <strong>Pro tip:</strong> Add <span style="color: #2563eb;">deals@homebaseflights.com</span> to
      your contacts so our emails don't end up in spam!
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Your 7-day free trial has started. We can't wait to help you save on your next adventure.
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Happy travels! ✈️<br />
      The Homebase Flights Team
    </p>
  </div>

  <div style="padding: 24px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #6b7280;">
    <p style="margin: 0 0 8px 0;">Homebase Flights</p>
    <p style="margin: 0;">
      <a href="https://homebaseflights.com" style="color: #2563eb;">homebaseflights.com</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}
