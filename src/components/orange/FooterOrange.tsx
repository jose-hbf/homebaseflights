import Link from 'next/link'

export function FooterOrange() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-orange-900 via-orange-500 via-70% to-amber-200 pt-[28rem] pb-16">
      {/* Cloud decorations at bottom */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Bottom left clouds */}
        <div className="absolute -left-20 bottom-0 w-80 h-48 bg-white/90 rounded-full blur-2xl"></div>
        <div className="absolute left-10 bottom-0 w-64 h-36 bg-white/95 rounded-full blur-xl"></div>
        <div className="absolute left-40 bottom-4 w-48 h-28 bg-white/85 rounded-full blur-xl"></div>

        {/* Bottom right clouds */}
        <div className="absolute -right-20 bottom-0 w-80 h-48 bg-white/90 rounded-full blur-2xl"></div>
        <div className="absolute right-10 bottom-0 w-64 h-36 bg-white/95 rounded-full blur-xl"></div>
        <div className="absolute right-40 bottom-4 w-48 h-28 bg-white/85 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main heading */}
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold text-white text-center mb-16 drop-shadow-lg">
          Have a safe flight.
        </h2>

        {/* Footer links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-12">
          {/* Left links */}
          <div className="flex flex-col items-center md:items-end gap-2 text-white/90">
            <Link href="/orange" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Center logo/icon */}
          <div className="text-white/90">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>

          {/* Right links */}
          <div className="flex flex-col items-center md:items-start gap-2 text-white/90">
            <Link href="#" className="hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Twitter
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Instagram
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-white/60 text-sm">
          &copy; {new Date().getFullYear()} HomebaseFlights.
        </p>
      </div>
    </footer>
  )
}
