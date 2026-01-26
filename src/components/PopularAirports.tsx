import Link from 'next/link'
import { cities } from '@/data/cities'

export function PopularAirports() {
  return (
    <section className="py-16 bg-white" aria-labelledby="popular-airports-heading">
      <div className="container mx-auto px-4">
        <h2
          id="popular-airports-heading"
          className="heading-display text-2xl md:text-3xl text-text-primary text-center mb-10"
        >
          Find cheap flights from your city
        </h2>

        <nav aria-label="Popular cities">
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/cheap-flights-from-${city.slug}`}
                  className="group block p-4 bg-surface rounded-xl border border-border-subtle hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Find cheap flights from ${city.name}`}
                >
                  <span className="block text-sm font-medium text-text-primary group-hover:text-blue-700 transition-colors">
                    {city.name}
                  </span>
                  <span className="block text-xs text-text-muted group-hover:text-blue-600 transition-colors">
                    {city.airports.join(', ')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
