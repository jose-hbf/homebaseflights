export interface City {
  name: string
  slug: string
  airports: string[]
  primaryAirport: string
  country: string
  region: string
}

export const cities: City[] = [
  {
    name: 'London',
    slug: 'london',
    airports: ['LHR', 'LGW', 'STN', 'LTN'],
    primaryAirport: 'LHR',
    country: 'UK',
    region: 'Europe',
  },
  {
    name: 'New York',
    slug: 'new-york',
    airports: ['JFK', 'EWR', 'LGA'],
    primaryAirport: 'JFK',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Los Angeles',
    slug: 'los-angeles',
    airports: ['LAX', 'BUR', 'SNA', 'ONT'],
    primaryAirport: 'LAX',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Chicago',
    slug: 'chicago',
    airports: ['ORD', 'MDW'],
    primaryAirport: 'ORD',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'San Francisco',
    slug: 'san-francisco',
    airports: ['SFO', 'OAK', 'SJC'],
    primaryAirport: 'SFO',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    airports: ['DXB'],
    primaryAirport: 'DXB',
    country: 'UAE',
    region: 'Middle East',
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    airports: ['SIN'],
    primaryAirport: 'SIN',
    country: 'Singapore',
    region: 'Asia',
  },
  {
    name: 'Hong Kong',
    slug: 'hong-kong',
    airports: ['HKG'],
    primaryAirport: 'HKG',
    country: 'Hong Kong',
    region: 'Asia',
  },
  {
    name: 'Sydney',
    slug: 'sydney',
    airports: ['SYD'],
    primaryAirport: 'SYD',
    country: 'Australia',
    region: 'Oceania',
  },
  {
    name: 'Atlanta',
    slug: 'atlanta',
    airports: ['ATL'],
    primaryAirport: 'ATL',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Dallas',
    slug: 'dallas',
    airports: ['DFW', 'DAL'],
    primaryAirport: 'DFW',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Denver',
    slug: 'denver',
    airports: ['DEN'],
    primaryAirport: 'DEN',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Boston',
    slug: 'boston',
    airports: ['BOS'],
    primaryAirport: 'BOS',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Seattle',
    slug: 'seattle',
    airports: ['SEA'],
    primaryAirport: 'SEA',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Miami',
    slug: 'miami',
    airports: ['MIA', 'FLL'],
    primaryAirport: 'MIA',
    country: 'USA',
    region: 'North America',
  },
  {
    name: 'Toronto',
    slug: 'toronto',
    airports: ['YYZ', 'YTZ'],
    primaryAirport: 'YYZ',
    country: 'Canada',
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

/**
 * Get secondary airports for a city (all except primary)
 */
export function getSecondaryAirports(city: City): string[] {
  return city.airports.filter(a => a !== city.primaryAirport)
}

/**
 * Get all cities that have secondary airports
 */
export function getCitiesWithSecondaryAirports(): City[] {
  return cities.filter(c => c.airports.length > 1)
}

/**
 * Get all primary airports
 */
export function getAllPrimaryAirports(): string[] {
  return cities.map(c => c.primaryAirport)
}

/**
 * Get all secondary airports across all cities
 */
export function getAllSecondaryAirports(): string[] {
  return cities.flatMap(c => getSecondaryAirports(c))
}

/**
 * Check if today is secondary fetch day (Sundays)
 */
export function isSecondaryFetchDay(): boolean {
  return new Date().getUTCDay() === 0 // Sunday
}
