import Script from 'next/script'
import { FormHydration } from '@/components/ads/FormHydration'

/**
 * INDEPENDENT ROOT LAYOUT for Ads pages
 *
 * This is a completely separate <html> document that:
 * - Does NOT load Google Fonts (uses system fonts)
 * - Does NOT load Tailwind/globals.css
 * - Has ALL CSS inlined
 * - Defers ALL JavaScript
 *
 * Target: LCP < 1.5s
 */

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

// Complete inline CSS - no external stylesheets
const fullCSS = `
  /* FORCE system fonts - override any inherited Google Fonts */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
  }

  /* Override CSS variables from parent */
  :root, html, body {
    --font-serif: Georgia, Cambria, "Times New Roman", Times, serif !important;
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    --font-fraunces: Georgia, Cambria, "Times New Roman", Times, serif !important;
    --font-ibm-plex: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
  }

  html {
    -webkit-text-size-adjust: 100%;
    line-height: 1.5;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    background: #fafaf9 !important;
    color: #111827 !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Override any Tailwind classes */
  .font-sans, .font-serif {
    font-family: inherit !important;
  }

  /* Hero section */
  .ads-hero {
    background: linear-gradient(to bottom, #eff6ff, #ffffff);
    padding: 3rem 1rem;
  }
  @media (min-width: 768px) {
    .ads-hero { padding: 5rem 1rem; }
  }

  .ads-container {
    max-width: 48rem;
    margin: 0 auto;
    text-align: center;
  }

  .ads-preheader {
    font-size: 0.875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .ads-h1 {
    font-family: var(--font-serif);
    font-size: 1.875rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }
  @media (min-width: 640px) {
    .ads-h1 { font-size: 2.25rem; }
  }
  @media (min-width: 768px) {
    .ads-h1 { font-size: 3rem; }
  }

  .ads-subtitle {
    font-size: 1.125rem;
    color: #4b5563;
    margin-bottom: 1rem;
    max-width: 36rem;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .ads-social-proof {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  /* Form */
  .ads-form {
    max-width: 32rem;
    margin: 0 auto;
  }

  .ads-form > div {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  @media (min-width: 640px) {
    .ads-form > div {
      flex-direction: row;
    }
  }

  .ads-input {
    flex: 1;
    padding: 1rem 1.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 9999px;
    font-size: 1rem;
    font-family: var(--font-sans);
    background: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .ads-input:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.2);
  }
  .ads-input::placeholder {
    color: #9ca3af;
  }

  .ads-button {
    padding: 1rem 2rem;
    background-color: #FF6B35;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    font-family: var(--font-sans);
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 10px 15px -3px rgba(255, 107, 53, 0.3);
    white-space: nowrap;
    transition: background-color 0.15s, box-shadow 0.15s, transform 0.1s;
  }
  .ads-button:hover {
    background-color: #e55a2b;
    box-shadow: 0 10px 25px -5px rgba(255, 107, 53, 0.4);
  }
  .ads-button:active {
    background-color: #d14f22;
    transform: scale(0.98);
  }
  .ads-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ads-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .ads-trust {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .ads-trust span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .ads-note {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.75rem;
  }

  /* Header */
  .ads-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(250, 250, 249, 0.95);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-bottom: 1px solid #e5e5e5;
  }

  .ads-header-inner {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
  }

  .ads-logo {
    height: 1.75rem;
    width: auto;
  }

  .ads-main {
    padding-top: 4rem;
  }

  /* Deal cards */
  .ads-deals-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 64rem;
    margin: 0 auto;
  }
  @media (min-width: 640px) {
    .ads-deals-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .ads-deals-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .ads-deal-card {
    background: white;
    border-radius: 1rem;
    border: 1px solid #f3f4f6;
    padding: 1rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .ads-deal-urgency {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .ads-deal-dot {
    width: 0.5rem;
    height: 0.5rem;
    background: #22c55e;
    border-radius: 9999px;
  }

  .ads-deal-destination {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  .ads-deal-country {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.75rem;
  }

  .ads-deal-price {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .ads-deal-price-current {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }

  .ads-deal-price-original {
    font-size: 0.875rem;
    color: #9ca3af;
    text-decoration: line-through;
  }

  .ads-deal-details {
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 0.75rem;
  }

  .ads-deal-details p {
    margin: 0;
  }

  .ads-deal-savings {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    background: #dcfce7;
    color: #15803d;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 0.5rem;
  }

  /* Section styles */
  .ads-section {
    padding: 3rem 1rem;
  }

  .ads-section-white {
    background: white;
  }

  .ads-section-gray {
    background: #f9fafb;
  }

  .ads-section-warm {
    background: #FFF8F5;
  }

  .ads-section-inner {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Testimonials */
  .ads-testimonial {
    background: #f9fafb;
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #f3f4f6;
  }

  .ads-stars {
    color: #FF6B35;
    margin-bottom: 0.75rem;
    font-size: 1.125rem;
  }

  /* Footer */
  .ads-footer {
    padding: 2rem 1rem;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    text-align: center;
  }

  .ads-footer p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .ads-footer a {
    color: #6b7280;
    text-decoration: none;
  }

  .ads-footer a:hover {
    color: #374151;
  }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Utility */
  .hidden { display: none; }
  .text-center { text-align: center; }

  /* Performance: Defer rendering of below-fold content */
  .ads-section {
    content-visibility: auto;
    contain-intrinsic-size: 0 500px;
  }

  /* Hero is above-fold, don't defer */
  .ads-hero {
    content-visibility: visible;
    contain-intrinsic-size: auto;
  }

  /* Prevent layout shift */
  .ads-form {
    min-height: 60px;
  }
`

export default function AdsRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Inline ALL CSS - zero external stylesheets */}
        <style dangerouslySetInnerHTML={{ __html: fullCSS }} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="facebook-domain-verification" content="uyftui7qw0if27g5bvgpg6dpam2r8x" />
      </head>
      <body>
        {children}

        {/* Form hydration - deferred with requestIdleCallback */}
        <FormHydration />

        {/* Plausible - lazyOnload */}
        <Script
          src="https://plausible.io/js/pa-aT-Nv_pDwY_085sXZU8GZ.js"
          strategy="lazyOnload"
        />
        <Script id="plausible-init" strategy="lazyOnload">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)}`}
        </Script>

        {/* Meta Pixel - deferred until interaction or 3s */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel-deferred" strategy="lazyOnload">
            {`
              var loadPixel=function(){if(window.fbqLoaded)return;window.fbqLoaded=true;
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${META_PIXEL_ID}');fbq('track','PageView')};
              var ev=['click','scroll','touchstart'];var ld=false;
              var once=function(){if(ld)return;ld=true;ev.forEach(function(e){document.removeEventListener(e,once)});loadPixel()};
              ev.forEach(function(e){document.addEventListener(e,once,{once:true,passive:true})});
              setTimeout(once,3000);
            `}
          </Script>
        )}
      </body>
    </html>
  )
}
