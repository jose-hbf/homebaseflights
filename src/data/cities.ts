export interface City {
  name: string
  slug: string
  airports: string[]
  country: string
  region: string
}

export const cities: City[] = [
  {
    name: 'London',
    slug: 'london',
    airports: ['LHR', 'LGW', 'STN', 'LTN'],
    country: 'UK',
    region: 'Europe',
  },
  {
    name: 'New York',
    slug: 'new-york',
    airports: ['JFK', 'EWR', 'LGA'],
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Los Angeles',
    slug: 'los-angeles',
    airports: ['LAX', 'BUR', 'SNA', 'ONT'],
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Chicago',
    slug: 'chicago',
    airports: ['ORD', 'MDW'],
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'San Francisco',
    slug: 'san-francisco',
    airports: ['SFO', 'OAK', 'SJC'],
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    airports: ['DXB'],
    country: 'UAE',
    region: 'Middle East',
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    airports: ['SIN'],
    country: 'Singapore',
    region: 'Asia',
  },
  {
    name: 'Hong Kong',
    slug: 'hong-kong',
    airports: ['HKG'],
    country: 'Hong Kong',
    region: 'Asia',
  },
  {
    name: 'Sydney',
    slug: 'sydney',
    airports: ['SYD'],
    country: 'Australia',
    region: 'Oceania',
  },
  {
    name: 'Atlanta',
    slug: 'atlanta',
    airports: ['ATL'],
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Dallas',
    slug: 'dallas',
    airports: ['DFW', 'DAL'],
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Denver',
    slug: 'denver',
    airports: ['DEN'],
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Boston',
    slug: 'boston',
    airports: ['BOS'],
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Seattle',
    slug: 'seattle',
    airports: ['SEA'],
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Miami',
    slug: 'miami',
    airports: ['MIA', 'FLL'],
    country: 'USA',
    region: 'North America',
  },
]

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug.toLowerCase())
}

export function getCityByAirport(code: string): City | undefined {
  return cities.find(c => c.airports.includes(code.toUpperCase()))
}

export function searchCities(query: string): City[] {
  const q = query.toLowerCase()
  return cities.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.airports.some(a => a.toLowerCase().includes(q))
  )
}
