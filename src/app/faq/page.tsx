'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AirportSelector } from '@/components/AirportSelector'
import { cn } from '@/lib/utils'

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'What is Homebase Flights?',
        answer: 'Homebase Flights is a flight deal alert service. We monitor millions of flight prices and send you notifications when we find exceptional deals from your home airport. Our members save an average of $500+ per trip.',
      },
      {
        question: 'How does it work?',
        answer: 'You tell us your home airport, and we monitor flight prices 24/7. When we find a deal significantly below normal prices—like mistake fares, flash sales, or pricing errors—we send you an alert so you can book before it disappears.',
      },
      {
        question: 'How much does it cost?',
        answer: 'Homebase Flights costs $59/year after a 7-day free trial. That\'s less than $5/month. Most members save that amount—and much more—on their very first booking.',
      },
      {
        question: 'Is there a free trial?',
        answer: 'Yes! You get a full 7-day free trial. You can cancel anytime during the trial and won\'t be charged.',
      },
    ],
  },
  {
    category: 'Flight Deals',
    questions: [
      {
        question: 'What kind of deals do you send?',
        answer: 'We send exceptional deals only—typically 40-90% off normal prices. This includes mistake fares (airline pricing errors), flash sales, and significant price drops. We don\'t spam you with mediocre deals.',
      },
      {
        question: 'How often will I receive deals?',
        answer: 'On average, we send 15+ deals per week. The frequency depends on your home airport—major hubs tend to have more deals. You can customize notification preferences in your account.',
      },
      {
        question: 'How long do deals last?',
        answer: 'Most deals last 24-48 hours, but mistake fares can disappear within hours. That\'s why we send alerts immediately when we find them—speed is essential.',
      },
      {
        question: 'Do you find deals to specific destinations?',
        answer: 'Our alerts cover deals from your home airport to destinations worldwide. We let the deals guide the destinations—this flexibility is how our members save the most. You can filter by region if you prefer.',
      },
    ],
  },
  {
    category: 'Booking',
    questions: [
      {
        question: 'Do I book through Homebase Flights?',
        answer: 'No. You always book directly with the airline or a trusted booking site. We simply find the deals and alert you. This means you get all the benefits of booking direct—frequent flyer miles, easier changes, direct customer service.',
      },
      {
        question: 'Are these deals on reputable airlines?',
        answer: 'Yes. We feature deals from major airlines including American, Delta, United, Southwest, British Airways, Lufthansa, and many others. We clearly indicate which airline is offering each deal.',
      },
      {
        question: 'Do airlines honor mistake fares?',
        answer: 'Most of the time, yes. Airlines typically honor mistake fares rather than cancel bookings. However, there\'s always a small risk they won\'t. We recommend waiting 24-48 hours before booking non-refundable hotels or activities.',
      },
    ],
  },
  {
    category: 'Account & Billing',
    questions: [
      {
        question: 'Can I cancel anytime?',
        answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to receive deals until the end of your current billing period.',
      },
      {
        question: 'What\'s your refund policy?',
        answer: 'We offer a money-back guarantee. If you don\'t find a single flight deal you love within your first year, we\'ll refund your membership in full. No questions asked.',
      },
      {
        question: 'Can I change my home airport?',
        answer: 'Yes, you can update your home airport anytime in your account settings. You can also add multiple airports if you\'re flexible about where you fly from.',
      },
      {
        question: 'How do I contact support?',
        answer: 'You can reach our support team at support@homebaseflights.com. We typically respond within 24 hours.',
      },
    ],
  },
]

// Generate FAQ schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((category) =>
    category.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    }))
  ),
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="heading-display text-4xl md:text-5xl text-text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Everything you need to know about Homebase Flights. Can&apos;t find what you&apos;re looking for?{' '}
              <a href="mailto:support@homebaseflights.com" className="text-primary hover:underline">
                Contact us
              </a>
              .
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="max-w-3xl mx-auto">
            {faqs.map((section, sectionIndex) => (
              <section key={sectionIndex} className="mb-12">
                <h2 className="font-serif text-xl font-semibold text-text-primary mb-6">
                  {section.category}
                </h2>
                <div className="space-y-3">
                  {section.questions.map((faq, faqIndex) => {
                    const itemId = `${sectionIndex}-${faqIndex}`
                    const isOpen = openItems[itemId]

                    return (
                      <div
                        key={faqIndex}
                        className="border border-border rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-surface transition-colors"
                        >
                          <span className="font-medium text-text-primary">
                            {faq.question}
                          </span>
                          <svg
                            className={cn(
                              'w-5 h-5 text-text-muted transition-transform duration-200 flex-shrink-0',
                              isOpen && 'rotate-180'
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <div
                          className={cn(
                            'overflow-hidden transition-all duration-200',
                            isOpen ? 'max-h-96' : 'max-h-0'
                          )}
                        >
                          <p className="px-6 pb-4 text-text-secondary leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* CTA */}
          <section className="max-w-xl mx-auto text-center mt-16 pt-12 border-t border-border">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-4">
              Ready to start saving?
            </h2>
            <p className="text-text-secondary mb-8">
              Join thousands of travelers who save hundreds on every trip.
            </p>
            <AirportSelector />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
