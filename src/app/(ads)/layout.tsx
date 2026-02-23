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
    text-align: center;
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
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
  }
  .ads-input::placeholder {
    color: #9ca3af;
  }

  .ads-button {
    padding: 1rem 2rem;
    background-color: #2563eb;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    font-family: var(--font-sans);
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
    white-space: nowrap;
    transition: background-color 0.15s, box-shadow 0.15s, transform 0.1s;
  }
  .ads-button:hover {
    background-color: #1d4ed8;
    box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
  }
  .ads-button:active {
    background-color: #1e40af;
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

  .ads-logo-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .ads-logo-icon {
    height: 1.75rem;
    width: auto;
  }

  .ads-logo-text {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
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
    color: #2563eb;
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

  /* Clickable Deal Cards */
  .ads-deal-card-clickable {
    display: block;
    background: white;
    border-radius: 1rem;
    border: 2px solid #e5e7eb;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 1.25rem;
    text-align: left;
  }

  .ads-deal-card-clickable:hover {
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
    border-color: #2563eb;
    transform: translateY(-2px);
  }

  .ads-deal-card-clickable:active {
    transform: translateY(0);
  }

  /* CSS-only Modal */
  .ads-modal-wrapper {
    position: relative;
  }

  .ads-modal-toggle {
    display: none;
  }

  .ads-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
  }

  .ads-modal-toggle:checked + .ads-modal-overlay {
    opacity: 1;
    visibility: visible;
  }

  .ads-modal-close-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
  }

  .ads-modal {
    position: relative;
    background: white;
    border-radius: 1rem;
    max-width: 480px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transform: scale(0.95) translateY(20px);
    transition: transform 0.2s;
  }

  .ads-modal-toggle:checked + .ads-modal-overlay .ads-modal {
    transform: scale(1) translateY(0);
  }

  .ads-modal-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.15s, color 0.15s;
    z-index: 10;
  }

  .ads-modal-close:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .ads-modal-content {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  .ads-modal-header {
    margin-bottom: 1rem;
  }

  .ads-modal-route {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  .ads-modal-country {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .ads-modal-price-section {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .ads-modal-price {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
  }

  .ads-modal-price-original {
    font-size: 1.125rem;
    color: #9ca3af;
    text-decoration: line-through;
  }

  .ads-modal-savings {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #dcfce7;
    color: #15803d;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .ads-modal-details {
    border-top: 1px solid #f3f4f6;
    padding-top: 1rem;
    margin-bottom: 1rem;
  }

  .ads-modal-detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f9fafb;
  }

  .ads-modal-detail-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .ads-modal-detail-value {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 500;
  }

  .ads-modal-note {
    font-size: 0.8125rem;
    color: #6b7280;
    font-style: italic;
    margin: 0;
  }

  .ads-modal-footer {
    padding: 1rem 1.5rem;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    border-radius: 0 0 1rem 1rem;
    text-align: center;
  }

  .ads-modal-footer-text {
    font-size: 0.875rem;
    color: #4b5563;
    margin: 0 0 0.75rem 0;
  }

  .ads-modal-cta {
    display: inline-block;
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: #2563eb;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 9999px;
    transition: background 0.15s;
  }

  .ads-modal-cta:hover {
    background: #1d4ed8;
  }

  .ads-modal-cta-wrapper {
    display: block;
    cursor: pointer;
  }

  /* Modal Form */
  .ads-modal-form {
    width: 100%;
  }

  .ads-modal-form-row {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .ads-modal-input {
    width: 100%;
    padding: 0.875rem 1.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 9999px;
    font-size: 1rem;
  }

  .ads-modal-input:focus {
    outline: none;
    border-color: #2563eb;
  }

  .ads-modal-input::placeholder {
    color: #9ca3af;
  }

  .ads-modal-submit {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: #2563eb;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .ads-modal-submit:hover {
    background: #1d4ed8;
  }

  /* Sticky Mobile CTA */
  .ads-sticky-cta {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: #2563eb;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    border: none;
    cursor: pointer;
    z-index: 90;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease-out;
  }

  .ads-sticky-cta:hover {
    background: #1d4ed8;
  }

  .ads-sticky-cta:active {
    background: #1e40af;
  }

  /* Hide on desktop */
  @media (min-width: 768px) {
    .ads-sticky-cta {
      display: none;
    }
  }

  /* Email Capture Banner */
  .ads-email-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 1.25rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    z-index: 100;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .ads-email-banner-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
  }

  .ads-email-banner-close:hover {
    color: #6b7280;
  }

  .ads-email-banner-headline {
    font-family: var(--font-serif);
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    text-align: center;
    padding-right: 2rem;
  }

  @media (min-width: 640px) {
    .ads-email-banner-headline {
      font-size: 1.125rem;
    }
  }

  .ads-email-banner-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 32rem;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    .ads-email-banner-form {
      flex-direction: row;
    }
  }

  .ads-email-banner-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 9999px;
    font-size: 1rem;
    background: white;
  }

  .ads-email-banner-input:focus {
    outline: none;
    border-color: #2563eb;
  }

  .ads-email-banner-button {
    padding: 0.75rem 1.5rem;
    background-color: #2563eb;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    white-space: nowrap;
  }

  .ads-email-banner-button:hover {
    background-color: #1d4ed8;
  }

  .ads-email-banner-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ads-email-banner-note {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
    margin: 0.75rem 0 0 0;
  }

  .ads-email-banner-error {
    color: #ef4444;
    font-size: 0.875rem;
    text-align: center;
    margin: 0.5rem 0 0 0;
  }

  .ads-email-banner-success {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    font-weight: 600;
    color: #15803d;
    padding: 0.5rem 0;
  }

  /* Pre-checkout Modal Styles */
  .precheckout-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .precheckout-modal {
    position: relative;
    background: white;
    border-radius: 1.5rem;
    max-width: 480px;
    width: 100%;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .precheckout-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    color: #9ca3af;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.15s;
    z-index: 10;
  }

  .precheckout-modal-close:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .precheckout-modal-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 2.5rem 2rem 1rem 2rem;
  }

  .precheckout-modal-content {
    text-align: center;
  }

  .precheckout-icon {
    width: 3rem;
    height: 3rem;
    margin: 0 auto 0.75rem auto;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.25);
  }

  .precheckout-title {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.75rem 0;
    line-height: 1.2;
  }

  .precheckout-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .precheckout-email {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #f3f4f6;
    border-radius: 9999px;
    color: #4b5563;
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
  }

  .precheckout-benefits {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
    text-align: left;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
  }

  .precheckout-benefits li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    color: #374151;
    font-size: 1rem;
    line-height: 1.5;
  }

  .precheckout-check {
    color: #22c55e;
    margin-right: 0.75rem;
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: -0.125rem;
  }

  .precheckout-benefits strong {
    font-weight: 600;
    color: #111827;
  }

  .precheckout-note {
    padding: 1rem;
    background: #fef3c7;
    border-radius: 0.75rem;
    color: #92400e;
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .precheckout-continue {
    width: 100%;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    font-size: 1.125rem;
    font-weight: 600;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.35);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .precheckout-continue:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    box-shadow: 0 15px 35px -5px rgba(37, 99, 235, 0.4);
    transform: translateY(-1px);
  }

  .precheckout-continue:active {
    transform: translateY(0);
  }

  .precheckout-security {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    color: #6b7280;
    font-size: 0.8125rem;
  }

  .precheckout-security svg {
    flex-shrink: 0;
  }

  /* New sections for enhanced modal */
  .precheckout-section {
    background: #f9fafb;
    border-radius: 1rem;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .precheckout-section-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem 0;
  }

  .precheckout-features {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .precheckout-features li {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .precheckout-features li:last-child {
    margin-bottom: 0;
  }

  .precheckout-feature-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .precheckout-features div {
    flex: 1;
  }

  .precheckout-features strong {
    display: block;
    color: #111827;
    font-size: 0.9375rem;
    margin-bottom: 0.25rem;
  }

  .precheckout-feature-desc {
    display: block;
    color: #6b7280;
    font-size: 0.8125rem;
    line-height: 1.4;
  }

  .precheckout-terms {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .precheckout-terms-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    margin-bottom: 1rem;
    text-align: left;
  }

  .precheckout-testimonial {
    background: linear-gradient(135deg, #fef3c7, #fef9c3);
    border-radius: 1rem;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .precheckout-stars {
    color: #f59e0b;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .precheckout-testimonial p {
    color: #451a03;
    font-size: 0.9375rem;
    line-height: 1.5;
    margin: 0 0 0.5rem 0;
    font-style: italic;
  }

  .precheckout-testimonial cite {
    color: #92400e;
    font-size: 0.8125rem;
    font-style: normal;
  }

  .precheckout-guarantee {
    background: #dcfce7;
    border: 1px solid #86efac;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    color: #14532d;
    font-size: 0.875rem;
    line-height: 1.5;
    text-align: left;
  }

  .precheckout-guarantee strong {
    color: #166534;
  }

  .precheckout-cancel-note {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 1rem;
    text-align: center;
  }

  /* Simplified compact styles */
  .precheckout-highlights {
    background: #f9fafb;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.25rem;
    text-align: left;
  }

  .precheckout-highlight {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.625rem;
    font-size: 0.9375rem;
    color: #374151;
  }

  .precheckout-highlight:last-child {
    margin-bottom: 0;
  }

  .precheckout-highlight-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .precheckout-highlight strong {
    color: #111827;
    font-weight: 600;
  }

  .precheckout-included {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.25rem;
  }

  .precheckout-included-title {
    font-size: 0.8125rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .precheckout-airports {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .precheckout-savings {
    font-size: 0.875rem;
    color: #059669;
  }

  .precheckout-savings strong {
    color: #047857;
    font-weight: 700;
  }

  .precheckout-proof {
    background: linear-gradient(135deg, #fef3c7, #fef9c3);
    border-radius: 0.75rem;
    padding: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .precheckout-proof .precheckout-stars {
    color: #f59e0b;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  .precheckout-proof p {
    color: #451a03;
    font-size: 0.875rem;
    margin: 0;
  }

  .precheckout-proof span {
    color: #92400e;
    font-size: 0.75rem;
  }

  /* Sticky footer */
  .precheckout-modal-footer {
    padding: 1.25rem 1.5rem;
    background: white;
    border-top: 2px solid #f3f4f6;
    border-radius: 0 0 1.5rem 1.5rem;
    text-align: center;
  }

  .precheckout-modal-footer .precheckout-continue {
    width: 100%;
    padding: 0.875rem 1.5rem;
    margin-bottom: 0.5rem;
  }

  .precheckout-modal-footer .precheckout-security {
    margin-top: 0.5rem;
  }
`

export default function AdsRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Inline ALL CSS - no external stylesheets */}
      <style dangerouslySetInnerHTML={{ __html: fullCSS }} />

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

      {/* Meta Pixel - fbq queue shim loads immediately, actual pixel deferred */}
      {META_PIXEL_ID && (
        <>
          {/* Queue shim - loads IMMEDIATELY so fbq() calls are queued */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!1;n.version='2.0';n.queue=[]}(window,document,'script');
              `,
            }}
          />
          {/* Actual pixel script - deferred until interaction or 3s */}
          <Script id="meta-pixel-deferred" strategy="lazyOnload">
            {`
              var loadPixel=function(){if(window.fbqLoaded)return;window.fbqLoaded=true;
              var t=document.createElement('script');t.async=!0;
              t.src='https://connect.facebook.net/en_US/fbevents.js';
              var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(t,s);
              fbq('init','${META_PIXEL_ID}');fbq('track','PageView')};
              var ev=['click','scroll','touchstart'];var ld=false;
              var once=function(){if(ld)return;ld=true;ev.forEach(function(e){document.removeEventListener(e,once)});loadPixel()};
              ev.forEach(function(e){document.addEventListener(e,once,{once:true,passive:true})});
              setTimeout(once,3000);
            `}
          </Script>
        </>
      )}
    </>
  )
}
