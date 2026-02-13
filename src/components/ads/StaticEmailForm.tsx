/**
 * Static email form that works WITHOUT JavaScript
 * Progressive enhancement: JS enhances behavior but form works without it
 *
 * How it works:
 * 1. Without JS: Form submits to /api/ads-signup which redirects to Stripe
 * 2. With JS: Client-side hydration adds analytics + instant redirect
 */

interface StaticEmailFormProps {
  cityName: string
  citySlug: string
  buttonText?: string
  formId?: string
}

const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/4gM7sNgMyejzapagigaR201' // 14-day trial

export function StaticEmailForm({
  cityName,
  citySlug,
  buttonText = 'Try Free for 14 Days',
  formId = 'email-form',
}: StaticEmailFormProps) {
  // Build Stripe URL with city pre-filled
  const stripeUrl = `${STRIPE_CHECKOUT_URL}?client_reference_id=${citySlug}`

  return (
    <form
      id={formId}
      action="/api/ads-signup"
      method="POST"
      data-city-name={cityName}
      data-city-slug={citySlug}
      data-stripe-url={stripeUrl}
      className="ads-form"
    >
      {/* Hidden fields for server-side handling */}
      <input type="hidden" name="citySlug" value={citySlug} />
      <input type="hidden" name="cityName" value={cityName} />
      <input type="hidden" name="redirectUrl" value={stripeUrl} />

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
          className="ads-button px-8 py-4 bg-[#FF6B35] text-white font-semibold text-base rounded-full shadow-lg whitespace-nowrap"
        >
          {buttonText}
        </button>
      </div>
      <p className="ads-error hidden text-red-500 text-sm mt-2 text-center"></p>
    </form>
  )
}
