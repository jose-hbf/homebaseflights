import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-600 via-70% to-orange-300 pt-[28rem] pb-16">
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
            {/* Blog link hidden temporarily
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            */}
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </div>

          {/* Center logo */}
          <div>
            <Image
              src="/logo-footer.svg"
              alt="Homebase Flights"
              width={128}
              height={112}
              className="h-24 w-auto"
            />
          </div>

          {/* Right links */}
          <div className="flex flex-col items-center md:items-start gap-2 text-white/90">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
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
