import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Homebase Flights team. We\'re here to help with any questions about our flight deal alerts service.',
  openGraph: {
    title: 'Contact Homebase Flights',
    description: 'Get in touch with the Homebase Flights team. We\'re here to help with any questions about our flight deal alerts service.',
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero */}
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-display text-4xl md:text-5xl text-text-primary mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-12">
              Have a question, feedback, or need help with your subscription? 
              We&apos;d love to hear from you.
            </p>

            {/* Email Card */}
            <div className="bg-surface rounded-2xl p-8 md:p-12 mb-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">
                Send us an email
              </h2>
              <p className="text-text-secondary mb-6">
                For any inquiries, please reach out to us at:
              </p>
              <div className="bg-white rounded-xl p-4 border border-border inline-block">
                <span className="text-lg font-medium text-primary select-all">
                  support@homebaseflights.com
                </span>
              </div>
              <p className="text-sm text-text-muted mt-4">
                We typically respond within 24-48 hours.
              </p>
            </div>

            {/* FAQ Link */}
            <div className="text-text-secondary">
              <p>
                Looking for quick answers? Check out our{' '}
                <a href="/faq" className="text-primary hover:underline font-medium">
                  Frequently Asked Questions
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
