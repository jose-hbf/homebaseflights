import * as React from 'react'

interface TrialDay7EmailProps {
  cityName: string
  trialEndDate: string
}

export function TrialDay7Email({ cityName, trialEndDate }: TrialDay7EmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ padding: '24px 24px 20px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style={{ display: 'block' }} />
      </div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 600, color: '#111827' }}>
          🔔 Last day of your free trial
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 24px 0' }}>
          Your free trial ends today at midnight. Here's what happens next:
        </p>

        <div style={{ padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px', marginBottom: '24px', border: '2px solid #fbbf24' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#92400e', margin: '0 0 12px 0' }}>
            ⏰ Trial ends: Tonight at 11:59 PM
          </h3>
          <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#92400e' }}>
            <strong>If you stay:</strong> $5.99/month starting tomorrow<br />
            <strong>If you cancel:</strong> Click below before midnight
          </p>
          <a href="https://homebaseflights.com/cancel" style={{ display: 'inline-block', marginTop: '12px', padding: '10px 20px', backgroundColor: '#ffffff', color: '#92400e', textDecoration: 'none', borderRadius: '6px', border: '1px solid #fbbf24', fontSize: '14px', fontWeight: 600 }}>
            Cancel trial (if you want to)
          </a>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
            Why members stay with us:
          </h3>

          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
              <strong>"Saved $513 on Rome. Paid for itself 10x over!"</strong><br />
              – Sarah M., Brooklyn
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
              <strong>"Found a $287 JFK to Madrid deal. Incredible!"</strong><br />
              – David K., Manhattan
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
              <strong>"The $5.99 is nothing compared to what I save."</strong><br />
              – Michelle T., Queens
            </p>
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#166534' }}>
            💰 $5.99/month. Less than a coffee.
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#166534' }}>
            Cancel anytime with one click. No questions asked.
          </p>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 16px 0' }}>
          <strong>Need help deciding?</strong> Just reply to this email. I personally read every message.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: 0 }}>
          Thanks for trying Homebase Flights,<br />
          Jose, Founder
        </p>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>
          <a href="https://homebaseflights.com/account" style={{ color: '#2563EB' }}>Manage subscription</a> •
          <a href="https://homebaseflights.com/cancel" style={{ color: '#dc2626', marginLeft: '8px', fontWeight: 600 }}>Cancel trial</a> •
          <a href="https://homebaseflights.com" style={{ color: '#2563EB', marginLeft: '8px' }}>homebaseflights.com</a>
        </p>
      </div>
    </div>
  )
}

export function renderTrialDay7Email(props: TrialDay7EmailProps): string {
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
      🔔 Last day of your free trial
    </h1>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
      Your free trial ends today at midnight. Here's what happens next:
    </p>

    <!-- Final warning box -->
    <div style="padding: 20px; background-color: #fef3c7; border-radius: 8px; margin-bottom: 24px; border: 2px solid #fbbf24;">
      <h3 style="font-size: 18px; font-weight: 600; color: #92400e; margin: 0 0 12px 0;">
        ⏰ Trial ends: Tonight at 11:59 PM
      </h3>
      <p style="margin: 0 0 8px 0; font-size: 16px; color: #92400e;">
        <strong>If you stay:</strong> $5.99/month starting tomorrow<br />
        <strong>If you cancel:</strong> Click below before midnight
      </p>
      <a href="https://homebaseflights.com/cancel" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #ffffff; color: #92400e; text-decoration: none; border-radius: 6px; border: 1px solid #fbbf24; font-size: 14px; font-weight: 600;">
        Cancel trial (if you want to)
      </a>
    </div>

    <!-- Testimonials -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 16px 0;">
        Why members stay with us:
      </h3>

      <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 14px; color: #374151;">
          <strong>"Saved $513 on Rome. Paid for itself 10x over!"</strong><br />
          – Sarah M., Brooklyn
        </p>
      </div>

      <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 14px; color: #374151;">
          <strong>"Found a $287 JFK to Madrid deal. Incredible!"</strong><br />
          – David K., Manhattan
        </p>
      </div>

      <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #374151;">
          <strong>"The $5.99 is nothing compared to what I save."</strong><br />
          – Michelle T., Queens
        </p>
      </div>
    </div>

    <!-- Final value prop -->
    <div style="padding: 16px; background-color: #dcfce7; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #166534;">
        💰 $5.99/month. Less than a coffee.
      </p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #166534;">
        Cancel anytime with one click. No questions asked.
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
      <strong>Need help deciding?</strong> Just reply to this email. I personally read every message.
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
      Thanks for trying Homebase Flights,<br />
      Jose, Founder
    </p>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">
      <a href="https://homebaseflights.com/account" style="color: #2563EB;">Manage subscription</a> •
      <a href="https://homebaseflights.com/cancel" style="color: #dc2626; margin-left: 8px; font-weight: 600;">Cancel trial</a> •
      <a href="https://homebaseflights.com" style="color: #2563EB; margin-left: 8px;">homebaseflights.com</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}

export const trialDay7EmailSubject = '🔔 Last day of your free trial'