'use client'

import { useEffect, useState } from 'react'

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px (past hero)
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToForm = () => {
    const form = document.getElementById('email-form')
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!isVisible) return null

  return (
    <button onClick={scrollToForm} className="ads-sticky-cta">
      Try Free for 14 Days →
    </button>
  )
}
