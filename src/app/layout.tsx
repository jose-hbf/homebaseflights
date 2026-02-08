import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/schemas'
import MetaPixel from '@/components/MetaPixel'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex',
  display: 'swap',
})

const siteUrl = 'https://homebaseflights.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Homebase Flights — Cheap Flight Deals From Your Airport',
    template: '%s',
  },
  description:
    'Flight deal alerts from YOUR airport. Not random cities. Pick your home airport, we find the deals. Average savings: $500+ per trip.',
  keywords: ['cheap flights', 'flight deals', 'travel deals', 'mistake fares', 'cheap travel', 'discount flights', 'airfare deals'],
  authors: [{ name: 'Homebase Flights' }],
  creator: 'Homebase Flights',
  publisher: 'Homebase Flights',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Homebase Flights',
    title: 'Homebase Flights — Cheap Flight Deals From Your Airport',
    description:
      'Flight deal alerts from YOUR airport. Not random cities. Pick your home airport, we find the deals. Average savings: $500+ per trip.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Homebase Flights - Save up to 90% on flights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Homebase Flights — Cheap Flight Deals From Your Airport',
    description:
      'Flight deal alerts from YOUR airport. Not random cities. Pick your home airport, we find the deals. Average savings: $500+ per trip.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'mDRKmF5dGpSJ5wa69Qxw2d3j1E1ELL6F7t0eenJwZ0U',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()

  return (
    <html lang="en" className={`${fraunces.variable} ${ibmPlex.variable}`}>
      <head>
        <meta name="facebook-domain-verification" content="uyftui7qw0if27g5bvgpg6dpam2r8x" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans bg-surface text-text-primary antialiased">
        {/* Plausible Analytics */}
        <Script
          src="https://plausible.io/js/pa-aT-Nv_pDwY_085sXZU8GZ.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
        {/* Meta Pixel */}
        <MetaPixel />
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
