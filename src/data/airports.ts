export interface Airport {
  code: string
  city: string
  country: string
  region: string
}

export const airports: Airport[] = [
  // North America - USA
  { code: 'JFK', city: 'New York', country: 'USA', region: 'North America' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', region: 'North America' },
  { code: 'ORD', city: 'Chicago', country: 'USA', region: 'North America' },
  { code: 'DFW', city: 'Dallas', country: 'USA', region: 'North America' },
  { code: 'DEN', city: 'Denver', country: 'USA', region: 'North America' },
  { code: 'SFO', city: 'San Francisco', country: 'USA', region: 'North America' },
  { code: 'SEA', city: 'Seattle', country: 'USA', region: 'North America' },
  { code: 'ATL', city: 'Atlanta', country: 'USA', region: 'North America' },
  { code: 'MIA', city: 'Miami', country: 'USA', region: 'North America' },
  { code: 'BOS', city: 'Boston', country: 'USA', region: 'North America' },
  { code: 'PHX', city: 'Phoenix', country: 'USA', region: 'North America' },
  { code: 'IAH', city: 'Houston', country: 'USA', region: 'North America' },
  { code: 'MSP', city: 'Minneapolis', country: 'USA', region: 'North America' },
  { code: 'DTW', city: 'Detroit', country: 'USA', region: 'North America' },
  { code: 'PHL', city: 'Philadelphia', country: 'USA', region: 'North America' },
  { code: 'LGA', city: 'New York (LaGuardia)', country: 'USA', region: 'North America' },
  { code: 'EWR', city: 'Newark', country: 'USA', region: 'North America' },
  { code: 'SAN', city: 'San Diego', country: 'USA', region: 'North America' },
  { code: 'TPA', city: 'Tampa', country: 'USA', region: 'North America' },
  { code: 'PDX', city: 'Portland', country: 'USA', region: 'North America' },
  { code: 'SLC', city: 'Salt Lake City', country: 'USA', region: 'North America' },
  { code: 'DCA', city: 'Washington D.C.', country: 'USA', region: 'North America' },
  { code: 'IAD', city: 'Washington Dulles', country: 'USA', region: 'North America' },
  { code: 'BWI', city: 'Baltimore', country: 'USA', region: 'North America' },
  { code: 'AUS', city: 'Austin', country: 'USA', region: 'North America' },
  { code: 'RDU', city: 'Raleigh-Durham', country: 'USA', region: 'North America' },
  { code: 'CLT', city: 'Charlotte', country: 'USA', region: 'North America' },
  { code: 'MCO', city: 'Orlando', country: 'USA', region: 'North America' },
  { code: 'FLL', city: 'Fort Lauderdale', country: 'USA', region: 'North America' },
  { code: 'SJC', city: 'San Jose', country: 'USA', region: 'North America' },
  { code: 'OAK', city: 'Oakland', country: 'USA', region: 'North America' },
  { code: 'SMF', city: 'Sacramento', country: 'USA', region: 'North America' },
  { code: 'HNL', city: 'Honolulu', country: 'USA', region: 'North America' },
  { code: 'OGG', city: 'Maui', country: 'USA', region: 'North America' },
  { code: 'ANC', city: 'Anchorage', country: 'USA', region: 'North America' },
  { code: 'LAS', city: 'Las Vegas', country: 'USA', region: 'North America' },
  { code: 'MSY', city: 'New Orleans', country: 'USA', region: 'North America' },
  { code: 'STL', city: 'St. Louis', country: 'USA', region: 'North America' },
  { code: 'PIT', city: 'Pittsburgh', country: 'USA', region: 'North America' },
  { code: 'CLE', city: 'Cleveland', country: 'USA', region: 'North America' },
  { code: 'CMH', city: 'Columbus', country: 'USA', region: 'North America' },
  { code: 'IND', city: 'Indianapolis', country: 'USA', region: 'North America' },
  { code: 'MCI', city: 'Kansas City', country: 'USA', region: 'North America' },
  { code: 'BNA', city: 'Nashville', country: 'USA', region: 'North America' },
  { code: 'MKE', city: 'Milwaukee', country: 'USA', region: 'North America' },
  { code: 'CVG', city: 'Cincinnati', country: 'USA', region: 'North America' },
  { code: 'RSW', city: 'Fort Myers', country: 'USA', region: 'North America' },
  { code: 'JAX', city: 'Jacksonville', country: 'USA', region: 'North America' },
  { code: 'SAT', city: 'San Antonio', country: 'USA', region: 'North America' },
  { code: 'ABQ', city: 'Albuquerque', country: 'USA', region: 'North America' },

  // North America - Canada
  { code: 'YYZ', city: 'Toronto', country: 'Canada', region: 'North America' },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', region: 'North America' },
  { code: 'YUL', city: 'Montreal', country: 'Canada', region: 'North America' },
  { code: 'YYC', city: 'Calgary', country: 'Canada', region: 'North America' },
  { code: 'YEG', city: 'Edmonton', country: 'Canada', region: 'North America' },
  { code: 'YOW', city: 'Ottawa', country: 'Canada', region: 'North America' },

  // Europe
  { code: 'LHR', city: 'London', country: 'UK', region: 'Europe' },
  { code: 'LGW', city: 'London Gatwick', country: 'UK', region: 'Europe' },
  { code: 'CDG', city: 'Paris', country: 'France', region: 'Europe' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', region: 'Europe' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', region: 'Europe' },
  { code: 'MUC', city: 'Munich', country: 'Germany', region: 'Europe' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', region: 'Europe' },
  { code: 'MAD', city: 'Madrid', country: 'Spain', region: 'Europe' },
  { code: 'FCO', city: 'Rome', country: 'Italy', region: 'Europe' },
  { code: 'MXP', city: 'Milan', country: 'Italy', region: 'Europe' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', region: 'Europe' },
  { code: 'VIE', city: 'Vienna', country: 'Austria', region: 'Europe' },
  { code: 'CPH', city: 'Copenhagen', country: 'Denmark', region: 'Europe' },
  { code: 'OSL', city: 'Oslo', country: 'Norway', region: 'Europe' },
  { code: 'ARN', city: 'Stockholm', country: 'Sweden', region: 'Europe' },
  { code: 'HEL', city: 'Helsinki', country: 'Finland', region: 'Europe' },
  { code: 'DUB', city: 'Dublin', country: 'Ireland', region: 'Europe' },
  { code: 'LIS', city: 'Lisbon', country: 'Portugal', region: 'Europe' },
  { code: 'BRU', city: 'Brussels', country: 'Belgium', region: 'Europe' },
  { code: 'PRG', city: 'Prague', country: 'Czech Republic', region: 'Europe' },
  { code: 'WAW', city: 'Warsaw', country: 'Poland', region: 'Europe' },
  { code: 'BUD', city: 'Budapest', country: 'Hungary', region: 'Europe' },
  { code: 'ATH', city: 'Athens', country: 'Greece', region: 'Europe' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', region: 'Europe' },

  // Asia
  { code: 'NRT', city: 'Tokyo Narita', country: 'Japan', region: 'Asia' },
  { code: 'HND', city: 'Tokyo Haneda', country: 'Japan', region: 'Asia' },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', region: 'Asia' },
  { code: 'PEK', city: 'Beijing', country: 'China', region: 'Asia' },
  { code: 'PVG', city: 'Shanghai', country: 'China', region: 'Asia' },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', region: 'Asia' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', region: 'Asia' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', region: 'Asia' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia' },
  { code: 'DEL', city: 'New Delhi', country: 'India', region: 'Asia' },
  { code: 'BOM', city: 'Mumbai', country: 'India', region: 'Asia' },
  { code: 'MNL', city: 'Manila', country: 'Philippines', region: 'Asia' },
  { code: 'TPE', city: 'Taipei', country: 'Taiwan', region: 'Asia' },
  { code: 'SGN', city: 'Ho Chi Minh City', country: 'Vietnam', region: 'Asia' },
  { code: 'HAN', city: 'Hanoi', country: 'Vietnam', region: 'Asia' },
  { code: 'CGK', city: 'Jakarta', country: 'Indonesia', region: 'Asia' },
  { code: 'DPS', city: 'Bali', country: 'Indonesia', region: 'Asia' },

  // Oceania
  { code: 'SYD', city: 'Sydney', country: 'Australia', region: 'Oceania' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', region: 'Oceania' },
  { code: 'BNE', city: 'Brisbane', country: 'Australia', region: 'Oceania' },
  { code: 'AKL', city: 'Auckland', country: 'New Zealand', region: 'Oceania' },

  // Middle East
  { code: 'DXB', city: 'Dubai', country: 'UAE', region: 'Middle East' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', region: 'Middle East' },
  { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', region: 'Middle East' },
  { code: 'TLV', city: 'Tel Aviv', country: 'Israel', region: 'Middle East' },

  // Latin America
  { code: 'MEX', city: 'Mexico City', country: 'Mexico', region: 'Latin America' },
  { code: 'CUN', city: 'Cancun', country: 'Mexico', region: 'Latin America' },
  { code: 'GDL', city: 'Guadalajara', country: 'Mexico', region: 'Latin America' },
  { code: 'SJD', city: 'Los Cabos', country: 'Mexico', region: 'Latin America' },
  { code: 'PTY', city: 'Panama City', country: 'Panama', region: 'Latin America' },
  { code: 'BOG', city: 'Bogota', country: 'Colombia', region: 'Latin America' },
  { code: 'MDE', city: 'Medellin', country: 'Colombia', region: 'Latin America' },
  { code: 'LIM', city: 'Lima', country: 'Peru', region: 'Latin America' },
  { code: 'SCL', city: 'Santiago', country: 'Chile', region: 'Latin America' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', region: 'Latin America' },
  { code: 'GRU', city: 'Sao Paulo', country: 'Brazil', region: 'Latin America' },
  { code: 'GIG', city: 'Rio de Janeiro', country: 'Brazil', region: 'Latin America' },

  // Caribbean
  { code: 'SJU', city: 'San Juan', country: 'Puerto Rico', region: 'Caribbean' },
  { code: 'PUJ', city: 'Punta Cana', country: 'Dominican Republic', region: 'Caribbean' },
  { code: 'NAS', city: 'Nassau', country: 'Bahamas', region: 'Caribbean' },
  { code: 'MBJ', city: 'Montego Bay', country: 'Jamaica', region: 'Caribbean' },

  // Africa
  { code: 'JNB', city: 'Johannesburg', country: 'South Africa', region: 'Africa' },
  { code: 'CPT', city: 'Cape Town', country: 'South Africa', region: 'Africa' },
  { code: 'CAI', city: 'Cairo', country: 'Egypt', region: 'Africa' },
  { code: 'CMN', city: 'Casablanca', country: 'Morocco', region: 'Africa' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', region: 'Africa' },
]

export function getAirportByCode(code: string | undefined | null): Airport | undefined {
  if (!code) return undefined
  return airports.find(a => a.code.toLowerCase() === code.toLowerCase())
}

export function searchAirports(query: string): Airport[] {
  const q = query.toLowerCase()
  return airports.filter(
    a =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  )
}
