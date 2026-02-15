/**
 * Static email form that works WITHOUT JavaScript
 * Progressive enhancement: JS enhances behavior but form works without it
 *
 * How it works:
 * 1. Without JS: Form submits to /api/ads-signup which saves subscriber and redirects to success page
 * 2. With JS: Client-side hydration adds analytics + instant redirect
 */

interface StaticEmailFormProps {
  cityName: string
  citySlug: string
  buttonText?: string
  formId?: string
}

export function StaticEmailForm({
  cityName,
  citySlug,
  buttonText = 'Get Free Deals',
  formId = 'email-form',
}: StaticEmailFormProps) {
  return (
    <form
      id={formId}
      action="/api/ads-signup"
      method="POST"
      data-city-name={cityName}
      data-city-slug={citySlug}
      className="ads-form"
    >
      {/* Hidden fields for server-side handling */}
      <input type="hidden" name="citySlug" value={citySlug} />
      <input type="hidden" name="cityName" value={cityName} />
      <input type="hidden" name="plan" value="free" />

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
  )
}
