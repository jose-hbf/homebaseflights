'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { airports, searchAirports, Airport } from '@/data/airports'
import { getCityByAirport } from '@/data/cities'
import { cn } from '@/lib/utils'

interface AirportSelectorOrangeProps {
  className?: string
  placeholder?: string
}

export function AirportSelectorOrange({
  className,
  placeholder = 'Where do you fly from?',
}: AirportSelectorOrangeProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Filter airports to only show those with a corresponding city page
  const allFilteredAirports = query.length > 0 ? searchAirports(query) : airports.slice(0, 20)
  const filteredAirports = allFilteredAirports.filter(airport => getCityByAirport(airport.code))

  useEffect(() => {
    setHighlightedIndex(0)
  }, [query])

  const handleSelect = (airport: Airport) => {
    const city = getCityByAirport(airport.code)
    if (!city) return
    setQuery('')
    setIsOpen(false)
    router.push(`/cheap-flights-from-${city.slug}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(i => Math.min(i + 1, filteredAirports.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredAirports[highlightedIndex]) {
          handleSelect(filteredAirports[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-14 pr-6 py-5 text-lg border-2 border-border bg-white rounded-full shadow-lg shadow-orange-500/10 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:shadow-xl focus:shadow-orange-500/15 transition-all duration-200 text-text-primary placeholder:text-text-secondary hover:border-orange-400/40 hover:shadow-xl"
        />
      </div>

      {isOpen && filteredAirports.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-2 bg-white border border-border-subtle rounded-2xl shadow-lg max-h-80 overflow-auto"
        >
          {filteredAirports.map((airport, index) => (
            <li key={airport.code}>
              <button
                type="button"
                onClick={() => handleSelect(airport)}
                className={cn(
                  'w-full px-5 py-3 text-left hover:bg-orange-100 transition-colors flex items-center justify-between',
                  index === highlightedIndex && 'bg-orange-100',
                  index === 0 && 'rounded-t-2xl',
                  index === filteredAirports.length - 1 && 'rounded-b-2xl'
                )}
              >
                <div>
                  <span className="font-medium text-text-primary">
                    {airport.city}
                  </span>
                  <span className="text-text-muted ml-2">{airport.country}</span>
                </div>
                <span className="text-sm font-medium text-orange-500">
                  {airport.code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
