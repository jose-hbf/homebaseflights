// Flight deal from SerpApi after transformation
export interface FlightDeal {
  destination: string
  destinationCode: string
  country: string
  price: number
  departureDate: string
  returnDate: string
  airline: string
  airlineCode: string
  durationMinutes: number
  stops: number
  bookingLink: string
  thumbnail?: string
}

// Raw response from SerpApi Google Travel Explore
export interface SerpApiDestination {
  name: string
  country: string
  destination_airport: {
    code: string
  }
  flight_price?: number
  start_date: string
  end_date: string
  airline: string
  airline_code: string
  flight_duration: number
  number_of_stops: number
  hotel_price?: number
  thumbnail?: string
  link: string
  serpapi_link?: string
}

export interface SerpApiResponse {
  search_metadata: {
    id: string
    status: string
    created_at: string
    processed_at: string
    total_time_taken: number
  }
  search_parameters: {
    engine: string
    departure_id: string
    currency: string
    hl: string
    gl: string
  }
  destinations?: SerpApiDestination[]
  error?: string
}

// Filter options for flight deals
export interface FlightFilterOptions {
  maxPrice?: number
  directOnly?: boolean
  limit?: number
  minDuration?: number
  maxDuration?: number
  excludeCountries?: string[]
  includeCountries?: string[]
}

// Supported airports - synced with cities.ts (15 cities, 28 airports)
export const SUPPORTED_AIRPORTS = [
  // London
  'LHR', 'LGW', 'STN', 'LTN',
  // New York
  'JFK', 'EWR', 'LGA',
  // Los Angeles
  'LAX', 'BUR', 'SNA', 'ONT',
  // Chicago
  'ORD', 'MDW',
  // San Francisco
  'SFO', 'OAK', 'SJC',
  // Dubai
  'DXB',
  // Singapore
  'SIN',
  // Hong Kong
  'HKG',
  // Sydney
  'SYD',
  // Atlanta
  'ATL',
  // Dallas
  'DFW', 'DAL',
  // Denver
  'DEN',
  // Boston
  'BOS',
  // Seattle
  'SEA',
  // Miami
  'MIA', 'FLL',
] as const

export type SupportedAirport = typeof SUPPORTED_AIRPORTS[number]

// Airport metadata for display
export interface AirportInfo {
  code: SupportedAirport
  name: string
  city: string
  country: string
}

export const AIRPORT_INFO: Record<SupportedAirport, AirportInfo> = {
  // London
  LHR: { code: 'LHR', name: 'Heathrow', city: 'London', country: 'United Kingdom' },
  LGW: { code: 'LGW', name: 'Gatwick', city: 'London', country: 'United Kingdom' },
  STN: { code: 'STN', name: 'Stansted', city: 'London', country: 'United Kingdom' },
  LTN: { code: 'LTN', name: 'Luton', city: 'London', country: 'United Kingdom' },
  // New York
  JFK: { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States' },
  EWR: { code: 'EWR', name: 'Newark Liberty International', city: 'New York', country: 'United States' },
  LGA: { code: 'LGA', name: 'LaGuardia', city: 'New York', country: 'United States' },
  // Los Angeles
  LAX: { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States' },
  BUR: { code: 'BUR', name: 'Hollywood Burbank', city: 'Los Angeles', country: 'United States' },
  SNA: { code: 'SNA', name: 'John Wayne (Orange County)', city: 'Los Angeles', country: 'United States' },
  ONT: { code: 'ONT', name: 'Ontario International', city: 'Los Angeles', country: 'United States' },
  // Chicago
  ORD: { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'United States' },
  MDW: { code: 'MDW', name: 'Midway International', city: 'Chicago', country: 'United States' },
  // San Francisco
  SFO: { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States' },
  OAK: { code: 'OAK', name: 'Oakland International', city: 'San Francisco', country: 'United States' },
  SJC: { code: 'SJC', name: 'San Jose International', city: 'San Francisco', country: 'United States' },
  // Dubai
  DXB: { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'United Arab Emirates' },
  // Singapore
  SIN: { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  // Hong Kong
  HKG: { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong' },
  // Sydney
  SYD: { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
  // Atlanta
  ATL: { code: 'ATL', name: 'Hartsfield-Jackson International', city: 'Atlanta', country: 'United States' },
  // Dallas
  DFW: { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'United States' },
  DAL: { code: 'DAL', name: 'Dallas Love Field', city: 'Dallas', country: 'United States' },
  // Denver
  DEN: { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'United States' },
  // Boston
  BOS: { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'United States' },
  // Seattle
  SEA: { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'United States' },
  // Miami
  MIA: { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States' },
  FLL: { code: 'FLL', name: 'Fort Lauderdale-Hollywood International', city: 'Miami', country: 'United States' },
}

// Helper to get all airports for a city
export function getAirportsForCity(cityName: string): SupportedAirport[] {
  return Object.values(AIRPORT_INFO)
    .filter(info => info.city.toLowerCase() === cityName.toLowerCase())
    .map(info => info.code)
}
