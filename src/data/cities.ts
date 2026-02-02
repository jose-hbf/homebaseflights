export interface PopularRoute {
  destination: string
  code: string
  typicalDeal: number
}

export interface City {
  name: string
  slug: string
  airports: string[]
  primaryAirport: string
  country: string
  region: string
  timezone: string // IANA timezone (e.g., 'America/New_York')
  // SEO content
  topDestinations?: string[]
  bestDealSeason?: string
  airlines?: string[]
  avgSavings?: string
  intro?: string
  popularRoutes?: PopularRoute[]
}

export const cities: City[] = [
  {
    name: 'London',
    slug: 'london',
    airports: ['LHR', 'LGW', 'STN', 'LTN'],
    primaryAirport: 'LHR',
    country: 'UK',
    region: 'Europe',
    timezone: 'Europe/London',
    topDestinations: ['New York', 'Dubai', 'Bangkok', 'Los Angeles', 'Tokyo'],
    bestDealSeason: 'January-March and November',
    airlines: ['British Airways', 'Virgin Atlantic', 'Norwegian', 'Ryanair'],
    avgSavings: '$380',
    intro: 'Heathrow, Gatwick, Stansted, Luton—four major airports with endless options. We track them all for deals to the Americas, Asia, and beyond.',
    popularRoutes: [
      { destination: 'New York', code: 'JFK', typicalDeal: 329 },
      { destination: 'Barcelona', code: 'BCN', typicalDeal: 49 },
      { destination: 'Dubai', code: 'DXB', typicalDeal: 349 },
      { destination: 'Bangkok', code: 'BKK', typicalDeal: 449 },
    ],
  },
  {
    name: 'New York',
    slug: 'new-york',
    airports: ['JFK', 'EWR', 'LGA'],
    primaryAirport: 'JFK',
    country: 'USA',
    region: 'North America',
    timezone: 'America/New_York',
    topDestinations: ['London', 'Paris', 'Rome', 'Dublin', 'Reykjavik'],
    bestDealSeason: 'January-March and September-November',
    airlines: ['JetBlue', 'Delta', 'United', 'Norse Atlantic', 'Norwegian'],
    avgSavings: '$420',
    intro: 'JFK, Newark, and LaGuardia serve 130+ million passengers yearly. We track deals from all three so you never miss a fare drop to Europe, the Caribbean, or Asia.',
    popularRoutes: [
      { destination: 'London', code: 'LHR', typicalDeal: 389 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 419 },
      { destination: 'Rome', code: 'FCO', typicalDeal: 449 },
      { destination: 'Dublin', code: 'DUB', typicalDeal: 359 },
    ],
  },
  {
    name: 'Los Angeles',
    slug: 'los-angeles',
    airports: ['LAX', 'BUR', 'SNA', 'ONT'],
    primaryAirport: 'LAX',
    country: 'USA',
    region: 'North America',
    timezone: 'America/Los_Angeles',
    topDestinations: ['Tokyo', 'Sydney', 'Paris', 'Cancun', 'Hawaii'],
    bestDealSeason: 'January-February and September-October',
    airlines: ['Delta', 'American', 'United', 'Southwest', 'Japan Airlines'],
    avgSavings: '$450',
    intro: 'LAX is the gateway to the Pacific. We monitor flights to Tokyo, Sydney, Bangkok, and 200+ destinations daily from all LA-area airports.',
    popularRoutes: [
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 489 },
      { destination: 'Sydney', code: 'SYD', typicalDeal: 699 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 449 },
      { destination: 'Cancun', code: 'CUN', typicalDeal: 249 },
    ],
  },
  {
    name: 'Chicago',
    slug: 'chicago',
    airports: ['ORD', 'MDW'],
    primaryAirport: 'ORD',
    country: 'USA',
    region: 'North America',
    timezone: 'America/Chicago',
    topDestinations: ['Dublin', 'London', 'Tokyo', 'Cancun', 'Rome'],
    bestDealSeason: 'January-March and October-November',
    airlines: ['United', 'American', 'Southwest', 'Spirit', 'Aer Lingus'],
    avgSavings: '$400',
    intro: "O'Hare is a major international hub with nonstops to 60+ countries. Midway adds budget options. We track both for the best deals.",
    popularRoutes: [
      { destination: 'Dublin', code: 'DUB', typicalDeal: 399 },
      { destination: 'London', code: 'LHR', typicalDeal: 429 },
      { destination: 'Cancun', code: 'CUN', typicalDeal: 259 },
      { destination: 'Rome', code: 'FCO', typicalDeal: 489 },
    ],
  },
  {
    name: 'San Francisco',
    slug: 'san-francisco',
    airports: ['SFO', 'OAK', 'SJC'],
    primaryAirport: 'SFO',
    country: 'USA',
    region: 'North America',
    timezone: 'America/Los_Angeles',
    topDestinations: ['Tokyo', 'Paris', 'London', 'Hawaii', 'Mexico City'],
    bestDealSeason: 'January-February and October-November',
    airlines: ['United', 'Alaska Airlines', 'Southwest', 'Japan Airlines'],
    avgSavings: '$380',
    intro: 'SFO, Oakland, and San Jose offer great competition for Bay Area travelers. We monitor all three for deals to Asia, Europe, and Hawaii.',
    popularRoutes: [
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 519 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 469 },
      { destination: 'Honolulu', code: 'HNL', typicalDeal: 299 },
      { destination: 'Mexico City', code: 'MEX', typicalDeal: 249 },
    ],
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    airports: ['DXB'],
    primaryAirport: 'DXB',
    country: 'UAE',
    region: 'Middle East',
    timezone: 'Asia/Dubai',
    topDestinations: ['London', 'Bangkok', 'Mumbai', 'Singapore', 'Maldives'],
    bestDealSeason: 'May-September (summer low season)',
    airlines: ['Emirates', 'Flydubai', 'Etihad', 'Air Arabia'],
    avgSavings: '$320',
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    airports: ['SIN'],
    primaryAirport: 'SIN',
    country: 'Singapore',
    region: 'Asia',
    timezone: 'Asia/Singapore',
    topDestinations: ['Bangkok', 'Bali', 'Tokyo', 'Sydney', 'London'],
    bestDealSeason: 'January-February and September',
    airlines: ['Singapore Airlines', 'Scoot', 'AirAsia', 'Jetstar'],
    avgSavings: '$350',
    intro: 'Changi Airport is Asia\'s best-connected hub. Budget carriers like Scoot and AirAsia mean frequent deals to Southeast Asia, Australia, and Europe.',
    popularRoutes: [
      { destination: 'Bangkok', code: 'BKK', typicalDeal: 89 },
      { destination: 'Bali', code: 'DPS', typicalDeal: 149 },
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 299 },
      { destination: 'London', code: 'LHR', typicalDeal: 549 },
    ],
  },
  {
    name: 'Hong Kong',
    slug: 'hong-kong',
    airports: ['HKG'],
    primaryAirport: 'HKG',
    country: 'Hong Kong',
    region: 'Asia',
    timezone: 'Asia/Hong_Kong',
    topDestinations: ['Tokyo', 'Bangkok', 'Singapore', 'Taipei', 'London'],
    bestDealSeason: 'March-April and September-November',
    airlines: ['Cathay Pacific', 'Hong Kong Airlines', 'HK Express', 'Singapore Airlines'],
    avgSavings: '$340',
  },
  {
    name: 'Sydney',
    slug: 'sydney',
    airports: ['SYD'],
    primaryAirport: 'SYD',
    country: 'Australia',
    region: 'Oceania',
    timezone: 'Australia/Sydney',
    topDestinations: ['Bali', 'Tokyo', 'Auckland', 'Los Angeles', 'Singapore'],
    bestDealSeason: 'February-March and August-September',
    airlines: ['Qantas', 'Virgin Australia', 'Jetstar', 'United'],
    avgSavings: '$420',
  },
  {
    name: 'Atlanta',
    slug: 'atlanta',
    airports: ['ATL'],
    primaryAirport: 'ATL',
    country: 'USA',
    region: 'North America',
    timezone: 'America/New_York',
    topDestinations: ['London', 'Paris', 'Cancun', 'Amsterdam', 'Rome'],
    bestDealSeason: 'January-March and September-November',
    airlines: ['Delta', 'Southwest', 'Spirit', 'Frontier'],
    avgSavings: '$430',
    intro: 'Hartsfield-Jackson is the world\'s busiest airport with nonstops to nearly every continent. Delta\'s mega-hub means excellent Europe and Caribbean deals.',
    popularRoutes: [
      { destination: 'London', code: 'LHR', typicalDeal: 449 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 479 },
      { destination: 'Cancun', code: 'CUN', typicalDeal: 229 },
      { destination: 'Amsterdam', code: 'AMS', typicalDeal: 459 },
    ],
  },
  {
    name: 'Dallas',
    slug: 'dallas',
    airports: ['DFW', 'DAL'],
    primaryAirport: 'DFW',
    country: 'USA',
    region: 'North America',
    timezone: 'America/Chicago',
    topDestinations: ['Cancun', 'London', 'Tokyo', 'Paris', 'Hawaii'],
    bestDealSeason: 'January-February and September-October',
    airlines: ['American', 'Southwest', 'Spirit', 'Frontier'],
    avgSavings: '$390',
  },
  {
    name: 'Denver',
    slug: 'denver',
    airports: ['DEN'],
    primaryAirport: 'DEN',
    country: 'USA',
    region: 'North America',
    timezone: 'America/Denver',
    topDestinations: ['Cancun', 'London', 'Tokyo', 'Iceland', 'Hawaii'],
    bestDealSeason: 'January-February and September-October',
    airlines: ['United', 'Southwest', 'Frontier', 'Spirit'],
    avgSavings: '$380',
  },
  {
    name: 'Boston',
    slug: 'boston',
    airports: ['BOS'],
    primaryAirport: 'BOS',
    country: 'USA',
    region: 'North America',
    timezone: 'America/New_York',
    topDestinations: ['Dublin', 'London', 'Reykjavik', 'Paris', 'Lisbon'],
    bestDealSeason: 'January-March and October-November',
    airlines: ['JetBlue', 'Delta', 'United', 'Aer Lingus', 'Icelandair'],
    avgSavings: '$410',
    intro: 'Logan Airport has great transatlantic options. Aer Lingus to Dublin, Icelandair via Reykjavik, and JetBlue\'s growing Europe network mean solid deals.',
    popularRoutes: [
      { destination: 'Dublin', code: 'DUB', typicalDeal: 379 },
      { destination: 'London', code: 'LHR', typicalDeal: 429 },
      { destination: 'Reykjavik', code: 'KEF', typicalDeal: 299 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 449 },
    ],
  },
  {
    name: 'Seattle',
    slug: 'seattle',
    airports: ['SEA'],
    primaryAirport: 'SEA',
    country: 'USA',
    region: 'North America',
    timezone: 'America/Los_Angeles',
    topDestinations: ['Tokyo', 'London', 'Reykjavik', 'Hawaii', 'Alaska'],
    bestDealSeason: 'January-February and September-October',
    airlines: ['Alaska Airlines', 'Delta', 'United', 'Icelandair'],
    avgSavings: '$370',
    intro: 'Sea-Tac has strong Asia routes and Alaska Airlines\' hub means great Hawaii deals. Icelandair offers cheap Europe connections via Reykjavik.',
    popularRoutes: [
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 499 },
      { destination: 'Honolulu', code: 'HNL', typicalDeal: 329 },
      { destination: 'Reykjavik', code: 'KEF', typicalDeal: 349 },
      { destination: 'London', code: 'LHR', typicalDeal: 479 },
    ],
  },
  {
    name: 'Miami',
    slug: 'miami',
    airports: ['MIA', 'FLL'],
    primaryAirport: 'MIA',
    country: 'USA',
    region: 'North America',
    timezone: 'America/New_York',
    topDestinations: ['Cancun', 'Bogota', 'Madrid', 'London', 'Caribbean Islands'],
    bestDealSeason: 'September-November (hurricane shoulder season)',
    airlines: ['American', 'Spirit', 'JetBlue', 'LATAM', 'Avianca'],
    avgSavings: '$360',
    intro: 'Miami and Fort Lauderdale are gateways to Latin America and the Caribbean. Spirit and budget carriers mean frequent sub-$200 deals.',
    popularRoutes: [
      { destination: 'Cancun', code: 'CUN', typicalDeal: 179 },
      { destination: 'Bogota', code: 'BOG', typicalDeal: 249 },
      { destination: 'Madrid', code: 'MAD', typicalDeal: 399 },
      { destination: 'San Juan', code: 'SJU', typicalDeal: 149 },
    ],
  },
  {
    name: 'Toronto',
    slug: 'toronto',
    airports: ['YYZ', 'YTZ'],
    primaryAirport: 'YYZ',
    country: 'Canada',
    region: 'North America',
    timezone: 'America/Toronto',
    topDestinations: ['London', 'Dublin', 'Paris', 'Cancun', 'Reykjavik'],
    bestDealSeason: 'January-March and October-November',
    airlines: ['Air Canada', 'WestJet', 'Porter', 'Flair'],
    avgSavings: '$400',
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

/**
 * Get the current hour in a city's timezone (0-23)
 */
export function getLocalHour(city: City): number {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: city.timezone,
    hour: 'numeric',
    hour12: false,
  })
  return parseInt(formatter.format(now), 10)
}

/**
 * Check if it's a good time to send digest emails for a city
 * Good time = 9 AM to 11 AM local time (morning inbox check)
 */
export function isDigestTimeForCity(city: City): boolean {
  const localHour = getLocalHour(city)
  return localHour >= 9 && localHour <= 11
}

/**
 * Get cities where it's currently digest time
 */
export function getCitiesInDigestWindow(): City[] {
  return cities.filter(isDigestTimeForCity)
}
