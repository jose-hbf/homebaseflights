'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cities, searchCities, City } from '@/data/cities'
import { cn } from '@/lib/utils'
import { Analytics, getPageSource } from '@/lib/analytics'

interface AirportSelectorProps {
  className?: string
  placeholder?: string
}

export function AirportSelector({
  className,
  placeholder = 'Where do you fly from?',
}: AirportSelectorProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredCities = query.length > 0 ? searchCities(query) : cities

  useEffect(() => {
    setHighlightedIndex(0)
  }, [query])

  const handleSelect = (city: City) => {
    // Track airport selection
    Analytics.airportSelected({
      city: city.name,
      airport: city.primaryAirport,
      source: getPageSource(),
    })
    
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
        setHighlightedIndex(i => Math.min(i + 1, filteredCities.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCities[highlightedIndex]) {
          handleSelect(filteredCities[highlightedIndex])
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
          className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500"
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
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label="Search for your departure city"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-14 pr-6 py-5 text-lg border-2 border-border bg-white rounded-full shadow-lg shadow-primary/10 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-xl focus:shadow-primary/15 transition-all duration-200 text-text-primary placeholder:text-text-secondary hover:border-primary/40 hover:shadow-xl"
        />
      </div>

      {isOpen && filteredCities.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Select your departure city"
          className="absolute z-[100] w-full mt-2 bg-white border border-border-subtle rounded-2xl shadow-xl max-h-80 overflow-auto"
        >
          {filteredCities.map((city, index) => (
            <li
              key={city.slug}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <button
                type="button"
                onClick={() => handleSelect(city)}
                tabIndex={-1}
                className={cn(
                  'w-full px-5 py-3 text-left hover:bg-blue-100 transition-colors flex items-center justify-between',
                  index === highlightedIndex && 'bg-blue-100',
                  index === 0 && 'rounded-t-2xl',
                  index === filteredCities.length - 1 && 'rounded-b-2xl'
                )}
              >
                <div>
                  <span className="font-medium text-text-primary">
                    {city.name}
                  </span>
                  <span className="text-text-muted ml-2">{city.country}</span>
                </div>
                <span className="text-sm font-medium text-blue-600" aria-label={`Airports: ${city.airports.join(', ')}`}>
                  {city.airports.join(', ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
