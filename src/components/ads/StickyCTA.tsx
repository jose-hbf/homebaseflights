'use client'

import { useState, useEffect, useCallback } from 'react'

interface StickyCTAProps {
  targetId?: string
  text?: string
}

export function StickyCTA({ targetId = 'final-cta', text = 'Start Free Trial →' }: StickyCTAProps) {
  // Start hidden to avoid layout shift and not block LCP
  const [isVisible, setIsVisible] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const shouldShow = scrollY > 300

    // Check if near the final CTA section
    const ctaSection = document.getElementById(targetId)
    let isNear = false
    if (ctaSection) {
      const rect = ctaSection.getBoundingClientRect()
      isNear = rect.top < window.innerHeight && rect.bottom > 0
    }

    setIsVisible(shouldShow && !isNear)
  }, [targetId])

  useEffect(() => {
    // Defer scroll listener setup to after LCP using requestIdleCallback
    const setupScrollListener = () => {
      setIsHydrated(true)
      handleScroll() // Check initial state
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    // Use requestIdleCallback to defer non-critical work
    if ('requestIdleCallback' in window) {
      requestIdleCallback(setupScrollListener, { timeout: 2000 })
    } else {
      // Fallback: defer to next frame
      requestAnimationFrame(() => {
        setTimeout(setupScrollListener, 100)
      })
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleClick = () => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Don't render on server or before hydration to avoid layout shifts
  if (!isHydrated) {
    return null
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
