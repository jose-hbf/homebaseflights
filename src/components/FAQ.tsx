'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'How do you find such cheap flights?',
    answer: 'We use a combination of technology and expertise to monitor millions of flight prices 24/7. We catch mistake fares, flash sales, and price drops that airlines quickly fix. Our team verifies every deal before sending it to you.',
  },
  {
    question: 'How much does Homebase Flights cost?',
    answer: 'Homebase Flights costs just $5.99/month after a 7-day free trial. Most members save that amount on their very first booking - and often much more. We also offer an annual plan at $59/year for even more savings.',
  },
  {
    question: 'How much can I really save?',
    answer: 'Our members save an average of $500 per trip. We regularly find international flights at 40-90% off normal prices. Some of our best deals have saved members over $1,000 on a single booking.',
  },
  {
    question: 'How often will I receive deals?',
    answer: 'We send 15+ deals per week on average. You can customize your preferences to receive deals for specific destinations or travel dates. We never spam - every email contains genuine savings opportunities.',
  },
  {
    question: 'Do I book through you or directly with the airline?',
    answer: 'You always book directly with the airline or a trusted booking site. We simply find the deals and send them to you. This means you get all the benefits of booking direct, including frequent flyer miles and easier changes.',
  },
  {
    question: 'What if I don\'t find a deal I like?',
    answer: 'We offer a 100% money-back guarantee. If you don\'t find a single flight deal you love within your first year of membership, we\'ll refund your membership fee in full - no questions asked.',
  },
  {
    question: 'Can I choose deals from specific airports?',
    answer: 'Yes! When you sign up, you select your home airport(s) and we\'ll send you deals departing from there. You can add multiple airports if you\'re flexible about where you fly from.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">
              Got questions?
            </p>
            <h2 className="heading-display text-3xl md:text-5xl text-text-primary mb-4">
              Frequently Asked <span className="heading-accent">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-text-primary">
                    {faq.question}
                  </span>
                  <svg
                    className={cn(
                      'w-5 h-5 text-text-muted transition-transform duration-300 flex-shrink-0',
                      openIndex === index && 'rotate-180'
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
                    'overflow-hidden transition-all duration-300',
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <p className="px-6 pb-5 text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
