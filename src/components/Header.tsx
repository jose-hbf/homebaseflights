'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  cityName?: string
  citySlug?: string
}

export function Header({ cityName }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isBlogPage = pathname?.startsWith('/blog')

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const target = document.querySelector(targetId)
    if (target) {
      // Scroll to section
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Add highlight effect after scroll completes
      setTimeout(() => {
        target.classList.add('section-highlight')
        // Remove the class after animation completes
        setTimeout(() => {
          target.classList.remove('section-highlight')
        }, 1200)
      }, 500)
    }
  }

  const navLinks = [
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#sample-deals', label: 'Sample Deals' },
    { href: '#guarantee', label: 'Guarantee' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-header.svg"
              alt="Homebase Flights"
              width={180}
              height={30}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          {isBlogPage ? (
            // Blog header: show CTA button
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Get Flight Deals
            </Link>
          ) : (
            // Default header: show section links + blog
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/blog"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Blog
              </Link>
            </nav>
          )}

          {/* Mobile Menu Button - only show on non-blog pages */}
          {!isBlogPage && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}

          {/* Mobile: Show CTA button on blog pages */}
          {isBlogPage && (
            <Link
              href="/"
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Get Deals
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation - only for non-blog pages */}
      {!isBlogPage && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-64 border-t border-border' : 'max-h-0'
          }`}
        >
          <nav className="container mx-auto px-4 py-4 bg-surface/95 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-base text-text-secondary hover:text-text-primary transition-colors cursor-pointer py-2"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base text-text-secondary hover:text-text-primary transition-colors py-2"
              >
                Blog
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
