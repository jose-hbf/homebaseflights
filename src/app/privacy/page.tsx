import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Homebase Flights',
  description: 'Privacy Policy for Homebase Flights - How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto prose prose-gray">
            <h1 className="heading-display text-4xl text-text-primary mb-8">
              Privacy Policy
            </h1>

            <p className="text-text-muted text-sm mb-8">
              Last updated: January 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                1. Introduction
              </h2>
              <p className="text-text-secondary mb-4">
                Homebase Flights ("we," "our," or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our website and services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Personal Information
              </h3>
              <p className="text-text-secondary mb-4">
                When you subscribe to our service, we collect:
              </p>
              <ul className="list-disc pl-6 text-text-secondary mb-4">
                <li>Email address</li>
                <li>Preferred departure city/airport</li>
                <li>Payment information (processed securely by Stripe)</li>
              </ul>

              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Automatically Collected Information
              </h3>
              <p className="text-text-secondary mb-4">
                When you visit our website, we may automatically collect:
              </p>
              <ul className="list-disc pl-6 text-text-secondary mb-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-text-secondary mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-text-secondary mb-4">
                <li>Send you flight deal alerts from your selected airport</li>
                <li>Process your subscription payments</li>
                <li>Improve our services and user experience</li>
                <li>Communicate with you about your account</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                4. Data Sharing
              </h2>
              <p className="text-text-secondary mb-4">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc pl-6 text-text-secondary mb-4">
                <li><strong>Payment processors:</strong> Stripe, to process your payments securely</li>
                <li><strong>Email service providers:</strong> To deliver our deal alerts</li>
                <li><strong>Legal authorities:</strong> When required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                5. Data Security
              </h2>
              <p className="text-text-secondary mb-4">
                We implement appropriate security measures to protect your personal information,
                including encryption, secure servers, and regular security assessments. However,
                no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                6. Your Rights
              </h2>
              <p className="text-text-secondary mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-text-secondary mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Unsubscribe from our emails at any time</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                7. Cookies
              </h2>
              <p className="text-text-secondary mb-4">
                We use essential cookies to ensure our website functions properly. We may also
                use analytics cookies to understand how visitors interact with our site. You can
                control cookie settings through your browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                8. Changes to This Policy
              </h2>
              <p className="text-text-secondary mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any
                significant changes by email or by posting a notice on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                9. Contact Us
              </h2>
              <p className="text-text-secondary mb-4">
                If you have questions about this Privacy Policy or your personal data, contact us at:
              </p>
              <p className="text-text-secondary">
                <a href="mailto:hello@homebaseflights.com" className="text-blue-600 hover:underline">
                  hello@homebaseflights.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
