import Link from 'next/link'
import Image from 'next/image'

// Top cities for footer links (internal linking for SEO)
const popularCities = [
  { name: 'New York', slug: 'new-york' },
  { name: 'Los Angeles', slug: 'los-angeles' },
  { name: 'Chicago', slug: 'chicago' },
  { name: 'San Francisco', slug: 'san-francisco' },
  { name: 'Miami', slug: 'miami' },
  { name: 'Boston', slug: 'boston' },
  { name: 'Seattle', slug: 'seattle' },
  { name: 'Atlanta', slug: 'atlanta' },
  { name: 'Dallas', slug: 'dallas' },
  { name: 'Denver', slug: 'denver' },
  { name: 'Toronto', slug: 'toronto' },
  { name: 'London', slug: 'london' },
  { name: 'Dubai', slug: 'dubai' },
  { name: 'Singapore', slug: 'singapore' },
  { name: 'Hong Kong', slug: 'hong-kong' },
  { name: 'Sydney', slug: 'sydney' },
]

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

        {/* Popular Cities Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-white/80 text-sm uppercase tracking-widest text-center mb-4">
            Cheap Flights From
          </h3>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {popularCities.map((city) => (
              <Link
                key={city.slug}
                href={`/cheap-flights-from-${city.slug}`}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-white/30 mx-auto mb-12"></div>

        {/* Footer links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0 mb-12">
          {/* Left links - fixed width for centering */}
          <div className="flex flex-col items-center md:items-end gap-2 text-white/90 md:w-40">
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

          {/* Center logo - with consistent spacing */}
          <div className="md:mx-16">
            <Image
              src="/logo-footer.svg"
              alt="Homebase Flights"
              width={128}
              height={112}
              className="h-24 w-auto"
            />
          </div>

          {/* Right links - fixed width for centering */}
          <div className="flex flex-col items-center md:items-start gap-2 text-white/90 md:w-40">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
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
