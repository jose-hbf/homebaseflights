'use client'

import { useState, useEffect } from 'react'

interface StickyCTAProps {
  targetId?: string
  text?: string
}

export function StickyCTA({ targetId = 'final-cta', text = 'Start Free Trial →' }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isNearCTA, setIsNearCTA] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const shouldShow = scrollY > 300

      // Check if near the final CTA section
      const ctaSection = document.getElementById(targetId)
      if (ctaSection) {
        const rect = ctaSection.getBoundingClientRect()
        const isNear = rect.top < window.innerHeight && rect.bottom > 0
        setIsNearCTA(isNear)
      }

      setIsVisible(shouldShow && !isNearCTA)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [targetId, isNearCTA])

  const handleClick = () => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`
        md:hidden fixed bottom-0 left-0 right-0 z-[999]
        h-14 w-full
        bg-[#FF6B35] text-white font-semibold text-base
        shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
        pb-[env(safe-area-inset-bottom)]
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        active:bg-[#e55a2b]
      `}
      style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}
      aria-label="Start free trial"
    >
      {text}
    </button>
  )
}
