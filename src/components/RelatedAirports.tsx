import Link from 'next/link'
import { getRelatedAirports, RelatedAirportsGroup, RelatedAirport } from '@/data/relatedAirports'
import { getCityByAirport } from '@/data/cities'

interface RelatedAirportsProps {
  currentCode: string
}

export function RelatedAirports({ currentCode }: RelatedAirportsProps) {
  const groups = getRelatedAirports(currentCode)

  if (!groups || groups.length === 0) {
    return null
  }

  // Filter groups to only include airports that have a corresponding city
  const filteredGroups = groups
    .map((group: RelatedAirportsGroup) => ({
      ...group,
      airports: group.airports.filter((airport: RelatedAirport) => getCityByAirport(airport.code)),
    }))
    .filter((group) => group.airports.length > 0)

  if (filteredGroups.length === 0) {
    return null
  }

  return (
    <section
      className="py-16 bg-white"
      aria-labelledby="related-airports-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h3
            id="related-airports-heading"
            className="heading-display text-2xl md:text-3xl text-text-primary text-center mb-10"
          >
            Other airports you might consider
          </h3>

          <div className="space-y-10">
            {filteredGroups.map((group) => {
              return (
                <div key={group.title}>
                  <h4 className="text-sm uppercase tracking-widest text-text-muted text-center mb-4">
                    {group.title}
                  </h4>
                  <nav aria-label={group.title}>
                    <ul className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                      {group.airports.map((airport) => {
                        const city = getCityByAirport(airport.code)
                        if (!city) return null

                        return (
                          <li key={airport.code}>
                            <Link
                              href={`/cheap-flights-from-${city.slug}`}
                              className="group block p-4 bg-surface rounded-xl border border-border-subtle hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              aria-label={`Find cheap flights from ${city.name} ${airport.code}`}
                            >
                              <span className="block text-sm font-medium text-text-primary group-hover:text-blue-700 transition-colors">
                                {city.name}
                              </span>
                              <span className="block text-xs text-text-muted group-hover:text-blue-600 transition-colors">
                                {airport.code}
                              </span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
