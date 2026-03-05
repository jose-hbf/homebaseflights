/**
 * Destination filtering and validation for flight deals
 * This ensures we only save and show high-value destinations
 */

// Priority destinations that people actually want to visit
export const HIGH_VALUE_DESTINATIONS = {
  // Europe - Major Cities & Tourist Destinations
  europe: [
    'London', 'Paris', 'Rome', 'Barcelona', 'Madrid', 'Amsterdam', 'Berlin',
    'Vienna', 'Prague', 'Budapest', 'Lisbon', 'Athens', 'Dublin', 'Edinburgh',
    'Copenhagen', 'Stockholm', 'Oslo', 'Zurich', 'Geneva', 'Milan', 'Venice',
    'Florence', 'Naples', 'Nice', 'Munich', 'Frankfurt', 'Brussels', 'Bruges',
    'Reykjavik', 'Porto', 'Seville', 'Valencia', 'Krakow', 'Warsaw',
    'Split', 'Dubrovnik', 'Santorini', 'Mykonos', 'Istanbul', 'Malta'
  ],

  // Asia & Pacific
  asia: [
    'Tokyo', 'Kyoto', 'Osaka', 'Seoul', 'Bangkok', 'Singapore', 'Hong Kong',
    'Shanghai', 'Beijing', 'Taipei', 'Bali', 'Jakarta', 'Manila', 'Kuala Lumpur',
    'Ho Chi Minh City', 'Hanoi', 'Delhi', 'Mumbai', 'Dubai', 'Tel Aviv',
    'Sydney', 'Melbourne', 'Auckland', 'Queenstown', 'Perth', 'Brisbane'
  ],

  // Americas
  americas: [
    'Mexico City', 'Cancun', 'Cabo San Lucas', 'Puerto Vallarta', 'Guadalajara',
    'Tulum', 'Playa del Carmen', 'Lima', 'Cusco', 'Buenos Aires', 'Rio de Janeiro',
    'São Paulo', 'Santiago', 'Bogota', 'Medellin', 'Cartagena', 'San Jose',
    'Panama City', 'Guatemala City', 'Havana', 'San Juan', 'Santo Domingo',
    'Montreal', 'Toronto', 'Vancouver', 'Calgary', 'Quebec City'
  ],

  // US Premium Destinations (for domestic)
  us_premium: [
    'Los Angeles', 'San Francisco', 'Seattle', 'Portland', 'San Diego',
    'Las Vegas', 'Phoenix', 'Denver', 'Austin', 'Dallas', 'Houston',
    'Miami', 'Orlando', 'Tampa', 'Fort Lauderdale', 'West Palm Beach',
    'New Orleans', 'Nashville', 'Chicago', 'Boston', 'Washington DC',
    'Honolulu', 'Maui', 'Kauai', 'Big Island', 'Anchorage', 'Jackson Hole',
    'Aspen', 'Park City', 'Charleston', 'Savannah', 'Asheville'
  ],

  // Caribbean & Islands
  caribbean: [
    'Nassau', 'Grand Cayman', 'Montego Bay', 'Aruba', 'Curacao', 'Barbados',
    'Saint Lucia', 'Turks and Caicos', 'US Virgin Islands', 'British Virgin Islands',
    'Antigua', 'Saint Martin', 'Bermuda', 'Bahamas', 'Jamaica', 'Dominican Republic'
  ],

  // Africa & Middle East
  africa_mideast: [
    'Cairo', 'Marrakech', 'Casablanca', 'Cape Town', 'Johannesburg', 'Nairobi',
    'Zanzibar', 'Seychelles', 'Mauritius', 'Amman', 'Beirut', 'Doha'
  ]
}

// Combine all destinations into a single set for quick lookup
export const ALL_VALUABLE_DESTINATIONS = new Set([
  ...HIGH_VALUE_DESTINATIONS.europe,
  ...HIGH_VALUE_DESTINATIONS.asia,
  ...HIGH_VALUE_DESTINATIONS.americas,
  ...HIGH_VALUE_DESTINATIONS.us_premium,
  ...HIGH_VALUE_DESTINATIONS.caribbean,
  ...HIGH_VALUE_DESTINATIONS.africa_mideast
])

// Blacklisted keywords that indicate non-destinations
export const BLACKLISTED_KEYWORDS = [
  'National Park', 'State Park', 'Wildlife', 'Reserve', 'Monument',
  'Forest', 'Canyon', 'Valley', 'Mountain', 'Lake', 'River',
  'Cave', 'Springs', 'Falls', 'Trail', 'Wilderness'
]

// Airport codes for major destinations (for validation)
export const MAJOR_AIRPORT_CODES = new Set([
  // Europe
  'LHR', 'LGW', 'CDG', 'ORY', 'FCO', 'CIA', 'BCN', 'MAD', 'AMS', 'BER',
  'TXL', 'VIE', 'PRG', 'BUD', 'LIS', 'OPO', 'ATH', 'DUB', 'EDI', 'CPH',
  'ARN', 'OSL', 'ZRH', 'GVA', 'MXP', 'LIN', 'VCE', 'NAP', 'NCE', 'MUC',
  'FRA', 'BRU', 'KEF', 'IST', 'MLA',

  // Asia
  'NRT', 'HND', 'KIX', 'ICN', 'BKK', 'SIN', 'HKG', 'PVG', 'PEK', 'TPE',
  'DPS', 'CGK', 'MNL', 'KUL', 'SGN', 'HAN', 'DEL', 'BOM', 'DXB', 'TLV',
  'SYD', 'MEL', 'AKL', 'CHC', 'PER', 'BNE',

  // Americas
  'MEX', 'CUN', 'SJD', 'PVR', 'GDL', 'LIM', 'CUZ', 'EZE', 'GIG', 'GRU',
  'SCL', 'BOG', 'MDE', 'CTG', 'SJO', 'PTY', 'GUA', 'HAV', 'SJU', 'SDQ',
  'YUL', 'YYZ', 'YVR', 'YYC', 'YQB',

  // US Premium
  'LAX', 'SFO', 'SEA', 'PDX', 'SAN', 'LAS', 'PHX', 'DEN', 'AUS', 'DFW',
  'IAH', 'MIA', 'FLL', 'MCO', 'TPA', 'PBI', 'MSY', 'BNA', 'ORD', 'BOS',
  'DCA', 'IAD', 'HNL', 'OGG', 'LIH', 'KOA', 'ANC', 'JAC', 'ASE', 'CHS', 'SAV',

  // Caribbean
  'NAS', 'GCM', 'MBJ', 'AUA', 'CUR', 'BGI', 'UVF', 'PLS', 'STT', 'SXM'
])

/**
 * Check if a destination is valuable enough to save
 */
export function isValuableDestination(
  destinationName: string,
  destinationCode?: string,
  country?: string
): boolean {
  // First check if it contains blacklisted keywords
  const lowerName = destinationName.toLowerCase()
  for (const keyword of BLACKLISTED_KEYWORDS) {
    if (lowerName.includes(keyword.toLowerCase())) {
      return false
    }
  }

  // Check if destination is in our valuable list
  if (ALL_VALUABLE_DESTINATIONS.has(destinationName)) {
    return true
  }

  // Check if the airport code is major
  if (destinationCode && MAJOR_AIRPORT_CODES.has(destinationCode)) {
    return true
  }

  // Check by country for some flexibility
  const valuableCountries = [
    'Japan', 'Italy', 'France', 'Greece', 'Spain', 'Thailand', 'Indonesia',
    'Portugal', 'United Kingdom', 'Iceland', 'Netherlands', 'Germany',
    'Switzerland', 'Croatia', 'Vietnam', 'South Korea', 'Singapore'
  ]

  if (country && valuableCountries.includes(country)) {
    // Even if city isn't in our list, these countries are generally good
    return true
  }

  return false
}

/**
 * Score a destination based on popularity (0-100)
 */
export function getDestinationScore(
  destinationName: string,
  destinationCode?: string,
  country?: string
): number {
  // Top tier destinations
  const topTier = [
    'Paris', 'London', 'Rome', 'Tokyo', 'Barcelona', 'Amsterdam', 'Bangkok',
    'Bali', 'Dubai', 'Singapore', 'Cancun', 'Honolulu', 'Lisbon', 'Athens'
  ]

  if (topTier.includes(destinationName)) {
    return 100
  }

  // Check if it's in high value lists
  if (HIGH_VALUE_DESTINATIONS.europe.includes(destinationName)) {
    return 90
  }
  if (HIGH_VALUE_DESTINATIONS.asia.includes(destinationName)) {
    return 85
  }
  if (HIGH_VALUE_DESTINATIONS.americas.includes(destinationName)) {
    return 80
  }
  if (HIGH_VALUE_DESTINATIONS.caribbean.includes(destinationName)) {
    return 75
  }
  if (HIGH_VALUE_DESTINATIONS.us_premium.includes(destinationName)) {
    return 70
  }

  // Check if airport code is major
  if (destinationCode && MAJOR_AIRPORT_CODES.has(destinationCode)) {
    return 60
  }

  // Unknown destination
  return 30
}

/**
 * Filter and rank deals based on destination value
 */
export function filterDealsByDestinationValue(deals: any[]): any[] {
  return deals
    .filter(deal => {
      const destination = deal.destination || deal.destination_city
      const code = deal.destinationCode || deal.destination_code
      const country = deal.country

      return isValuableDestination(destination, code, country)
    })
    .map(deal => {
      const destination = deal.destination || deal.destination_city
      const code = deal.destinationCode || deal.destination_code
      const country = deal.country

      return {
        ...deal,
        destinationScore: getDestinationScore(destination, code, country)
      }
    })
    .sort((a, b) => {
      // Sort by destination score, then by price
      if (b.destinationScore !== a.destinationScore) {
        return b.destinationScore - a.destinationScore
      }
      return a.price - b.price
    })
}