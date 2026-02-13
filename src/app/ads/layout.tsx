import Script from 'next/script'
import { FormHydration } from '@/components/ads/FormHydration'

/**
 * Ads pages layout - AGGRESSIVELY optimized for LCP < 1s
 *
 * Strategy:
 * 1. Inline critical CSS for hero section
 * 2. All JS deferred with lazyOnload
 * 3. Meta Pixel loaded ONLY after user interaction or 5s delay
 * 4. Form works without JS (progressive enhancement)
 */

// Critical CSS for hero section - inlined to avoid render blocking
const criticalCSS = `
  /* Reset and base */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* Hero section critical styles */
  .ads-hero {
    background: linear-gradient(to bottom, #eff6ff, #ffffff);
    padding: 3rem 1rem 3rem;
  }
  @media (min-width: 768px) {
    .ads-hero { padding: 5rem 1rem 5rem; }
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
    font-family: var(--font-fraunces), Georgia, serif;
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
  }

  .ads-social-proof {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  /* Form critical styles */
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
    background: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .ads-input:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.2);
  }

  .ads-button {
    padding: 1rem 2rem;
    background-color: #FF6B35;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 10px 15px -3px rgba(255, 107, 53, 0.3);
    white-space: nowrap;
  }
  .ads-button:hover {
    background-color: #e55a2b;
  }
  .ads-button:active {
    background-color: #d14f22;
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

  /* Header critical styles */
  .ads-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(250, 250, 249, 0.95);
    backdrop-filter: blur(4px);
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

  /* Main content offset for fixed header */
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
    font-family: var(--font-fraunces), Georgia, serif;
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

  /* Hide elements for progressive enhancement */
  .hidden { display: none; }
`

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export default function AdsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Inline critical CSS - no external stylesheet blocking */}
      <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

      {children}

      {/* Form hydration - deferred until after first paint */}
      <FormHydration />

      {/* Plausible Analytics - lazyOnload */}
      <Script
        src="https://plausible.io/js/pa-aT-Nv_pDwY_085sXZU8GZ.js"
        strategy="lazyOnload"
      />
      <Script id="plausible-init" strategy="lazyOnload">
        {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
      </Script>

      {/* Meta Pixel - lazyOnload with additional delay */}
      {META_PIXEL_ID && (
        <Script id="meta-pixel-deferred" strategy="lazyOnload">
          {`
            // Defer Meta Pixel even further - load after 3 seconds or user interaction
            var loadMetaPixel = function() {
              if (window.fbqLoaded) return;
              window.fbqLoaded = true;
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            };
            // Load on first interaction or after 3 seconds
            var events = ['click', 'scroll', 'touchstart', 'keydown'];
            var loaded = false;
            var loadOnce = function() {
              if (loaded) return;
              loaded = true;
              events.forEach(function(e) { document.removeEventListener(e, loadOnce); });
              loadMetaPixel();
            };
            events.forEach(function(e) { document.addEventListener(e, loadOnce, { once: true, passive: true }); });
            setTimeout(loadOnce, 3000);
          `}
        </Script>
      )}
    </>
  )
}
