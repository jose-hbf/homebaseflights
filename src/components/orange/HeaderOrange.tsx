'use client'

import Link from 'next/link'
import { ButtonOrange } from '@/components/orange/ButtonOrange'

export function HeaderOrange() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/orange" className="flex items-center gap-2">
            <span className="font-serif text-xl font-semibold text-text-primary">
              Homebase<span className="text-orange-500 italic">Flights</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#deals"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sample Deals
            </Link>
            <Link
              href="#guarantee"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Guarantee
            </Link>
          </nav>

          <ButtonOrange size="sm">Get Started</ButtonOrange>
        </div>
      </div>
    </header>
  )
}
