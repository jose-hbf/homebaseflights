'use client'

import { useState } from 'react'
import { ButtonOrange } from '@/components/orange/ButtonOrange'

interface EmailCaptureOrangeProps {
  buttonText?: string
  placeholder?: string
  className?: string
}

export function EmailCaptureOrange({
  buttonText = 'Get Flight Deals',
  placeholder = 'Enter your email',
  className = '',
}: EmailCaptureOrangeProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className={`bg-orange-100 text-orange-600 rounded-2xl p-6 text-center ${className}`}>
        <p className="font-serif text-xl font-semibold mb-1">Thanks! We&apos;ll be in touch.</p>
        <p className="text-sm">Check your inbox for amazing flight deals.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1 px-5 py-3.5 border border-border rounded-full bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all text-text-primary placeholder:text-text-muted"
      />
      <ButtonOrange type="submit" variant="primary">
        {buttonText}
      </ButtonOrange>
    </form>
  )
}
