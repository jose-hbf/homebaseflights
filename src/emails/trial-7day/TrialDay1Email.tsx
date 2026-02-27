import * as React from 'react'

interface TrialDay1EmailProps {
  cityName: string
  trialEndDate: string
}

export function TrialDay1Email({ cityName, trialEndDate }: TrialDay1EmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ padding: '24px 24px 20px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style={{ display: 'block' }} />
      </div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 600, color: '#111827' }}>
          NYC → Paris $273 (found this week)
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 16px 0' }}>
          Welcome to your 7-day free trial! 🎉
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 24px 0' }}>
          Here are 3 deals we found from {cityName} this week:
        </p>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
            <strong style={{ color: '#111827' }}>NYC → Paris</strong><br />
            <span style={{ fontSize: '24px', color: '#059669', fontWeight: 700 }}>$273</span>
            <span style={{ textDecoration: 'line-through', color: '#6b7280' }}>$850</span><br />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Nonstop • Feb-Apr 2026</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
            <strong style={{ color: '#111827' }}>NYC → Dublin</strong><br />
            <span style={{ fontSize: '24px', color: '#059669', fontWeight: 700 }}>$207</span>
            <span style={{ textDecoration: 'line-through', color: '#6b7280' }}>$620</span><br />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Nonstop • Mar-Jun 2026</span>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <strong style={{ color: '#111827' }}>NYC → Tokyo</strong><br />
            <span style={{ fontSize: '24px', color: '#059669', fontWeight: 700 }}>$510</span>
            <span style={{ textDecoration: 'line-through', color: '#6b7280' }}>$1,400</span><br />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Nonstop • Mar-May 2026</span>
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
            <strong>Your trial is active!</strong><br />
            Free access until {trialEndDate}<br />
            Then $5.99/month • Cancel anytime
          </p>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 16px 0' }}>
          During your trial, you'll get our best deals as soon as we find them.
        </p>

        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#6b7280', margin: 0 }}>
          <strong>Tip:</strong> Add deals@homebaseflights.com to your contacts so you don't miss any deals.
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

export function renderTrialDay1Email(props: TrialDay1EmailProps): string {
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
      NYC → Paris $273 (found this week)
    </h1>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
      Welcome to your 7-day free trial! 🎉
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
      Here are 3 deals we found from ${cityName} this week:
    </p>

    <!-- Deals -->
    <div style="margin-bottom: 24px;">
      <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
        <strong style="color: #111827;">NYC → Paris</strong><br />
        <span style="font-size: 24px; color: #059669; font-weight: 700;">$273</span>
        <span style="text-decoration: line-through; color: #6b7280;">$850</span><br />
        <span style="font-size: 14px; color: #6b7280;">Nonstop • Feb-Apr 2026</span>
      </div>

      <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
        <strong style="color: #111827;">NYC → Dublin</strong><br />
        <span style="font-size: 24px; color: #059669; font-weight: 700;">$207</span>
        <span style="text-decoration: line-through; color: #6b7280;">$620</span><br />
        <span style="font-size: 14px; color: #6b7280;">Nonstop • Mar-Jun 2026</span>
      </div>

      <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px;">
        <strong style="color: #111827;">NYC → Tokyo</strong><br />
        <span style="font-size: 24px; color: #059669; font-weight: 700;">$510</span>
        <span style="text-decoration: line-through; color: #6b7280;">$1,400</span><br />
        <span style="font-size: 14px; color: #6b7280;">Nonstop • Mar-May 2026</span>
      </div>
    </div>

    <!-- Trial info -->
    <div style="padding: 16px; background-color: #fef3c7; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>Your trial is active!</strong><br />
        Free access until ${trialEndDate}<br />
        Then $5.99/month • Cancel anytime
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
      During your trial, you'll get our best deals as soon as we find them.
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin: 0;">
      <strong>Tip:</strong> Add deals@homebaseflights.com to your contacts so you don't miss any deals.
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

export const trialDay1EmailSubject = '✈️ NYC → Paris $273 (your trial is active!)'