'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { cities } from '@/data/cities'

interface RelatedCitiesProps {
  currentSlug: string
}

export function RelatedCities({ currentSlug }: RelatedCitiesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Get all cities except the current one
  const relatedCities = cities.filter(city => city.slug !== currentSlug)

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      )
    }
  }

  useEffect(() => {
    updateScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollButtons)
      window.addEventListener('resize', updateScrollButtons)
      return () => {
        container.removeEventListener('scroll', updateScrollButtons)
        window.removeEventListener('resize', updateScrollButtons)
      }
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = container.clientWidth * 0.8
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (relatedCities.length === 0) {
    return null
  }

  return (
    <section
      className="py-16 bg-white"
      aria-labelledby="related-cities-heading"
    >
      <div className="container mx-auto px-4">
        <h3
          id="related-cities-heading"
          className="heading-display text-2xl md:text-3xl text-text-primary text-center mb-10"
        >
          Other cities you might consider
        </h3>

        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-border-subtle flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? 'opacity-100 hover:bg-gray-50 hover:shadow-xl cursor-pointer'
                : 'opacity-0 cursor-default pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right scroll button */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-border-subtle flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? 'opacity-100 hover:bg-gray-50 hover:shadow-xl cursor-pointer'
                : 'opacity-0 cursor-default pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel container */}
          <nav aria-label="Related cities">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/cheap-flights-from-${city.slug}`}
                  className="group flex-shrink-0 w-40 p-4 bg-surface rounded-xl border border-border-subtle hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Find cheap flights from ${city.name}`}
                >
                  <span className="block text-sm font-medium text-text-primary group-hover:text-blue-700 transition-colors">
                    {city.name}
                  </span>
                  <span className="block text-xs text-text-muted group-hover:text-blue-600 transition-colors mt-1">
                    {city.airports.join(', ')}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </section>
  )
}
