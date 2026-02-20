'use client'

import { useState } from 'react'

interface InteractiveEmailFormProps {
  cityName: string
  citySlug: string
  formId?: string
  defaultPlan?: 'trial' | 'free'
}

export function InteractiveEmailForm({
  cityName,
  citySlug,
  formId = 'email-form',
  defaultPlan = 'trial'
}: InteractiveEmailFormProps) {
  const [plan, setPlan] = useState(defaultPlan)

  const isTrialMode = plan === 'trial'
  const buttonText = isTrialMode ? 'Start Free 14-Day Trial' : 'Send me free deals'
  const noteText = isTrialMode
    ? 'Cancel anytime. $59/year after trial. Money-back guarantee.'
    : 'Free weekly alerts. No credit card needed.'

  return (
    <>
      <form
        id={formId}
        action="/api/ads-signup"
        method="POST"
        data-city-name={cityName}
        data-city-slug={citySlug}
        data-plan={plan}
        className="ads-form"
      >
        <input type="hidden" name="citySlug" value={citySlug} />
        <input type="hidden" name="cityName" value={cityName} />
        <input type="hidden" name="plan" value={plan} />

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            autoComplete="email"
            className="ads-input flex-1 px-5 py-4 border-2 border-gray-200 rounded-full text-base bg-white shadow-sm"
          />
          <button
            type="submit"
            className="ads-button px-8 py-4 bg-[#2563eb] text-white font-semibold text-base rounded-full shadow-lg whitespace-nowrap"
          >
            {buttonText}
          </button>
        </div>
        <p className="ads-error hidden text-red-500 text-sm mt-2 text-center"></p>
      </form>

      <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        {noteText}
      </p>

      {isTrialMode && (
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={(e) => {
              e.preventDefault()
              setPlan('free')
            }}
            style={{
              fontSize: '0.8125rem',
              color: '#6b7280',
              textDecoration: 'underline',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit'
            }}
          >
            Not ready? Get 2 free deals per week →
          </button>
        </p>
      )}
    </>
  )
}