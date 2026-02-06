import Link from 'next/link'

export function AdsHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-14">
          <Link href="/" className="flex items-center gap-2">
            {/* Inline SVG icon for instant load */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF6B35]">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="currentColor" opacity="0.2"/>
              <path d="M12 2L4 7L12 12L20 7L12 2Z" fill="currentColor"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
            <span className="font-serif text-lg font-semibold text-gray-900">
              Homebase Flights
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
