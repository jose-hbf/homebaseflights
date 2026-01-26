'use client'

import { useState } from 'react'
import { FAQ } from '@/types/blog'
import { cn } from '@/lib/utils'

interface PostFAQProps {
  faqs: FAQ[]
}

export function PostFAQ({ faqs }: PostFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  return (
    <section className="my-12 border-t border-border pt-12">
      <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-surface transition-colors"
            >
              <span className="font-medium text-text-primary">{faq.question}</span>
              <svg
                className={cn(
                  'w-5 h-5 text-text-muted transition-transform duration-200 flex-shrink-0',
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
                'overflow-hidden transition-all duration-200',
                openIndex === index ? 'max-h-96' : 'max-h-0'
              )}
            >
              <p className="px-6 pb-4 text-text-secondary leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
