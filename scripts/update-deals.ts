/**
 * Weekly Deals Update Script
 *
 * This script updates the flight deals with fresh dates and randomized prices.
 * Run weekly via cron job: 0 0 * * 0 (every Sunday at midnight)
 *
 * Usage:
 *   npx ts-node scripts/update-deals.ts
 *   or
 *   npm run update-deals
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface DealTemplate {
  origin: string
  destination: string
  destinationCity: string
  destinationCountry: string
  basePrice: number
  normalPrice: number
  airline: string
  stops: number
}

// Deal templates for each airport
const dealTemplates: Record<string, DealTemplate[]> = {
  JFK: [
    { origin: 'JFK', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 280, normalPrice: 850, airline: 'Multiple Airlines', stops: 0 },
    { origin: 'JFK', destination: 'BCN', destinationCity: 'Barcelona', destinationCountry: 'Spain', basePrice: 300, normalPrice: 780, airline: 'TAP Portugal', stops: 1 },
    { origin: 'JFK', destination: 'DUB', destinationCity: 'Dublin', destinationCountry: 'Ireland', basePrice: 240, normalPrice: 620, airline: 'Aer Lingus', stops: 0 },
    { origin: 'JFK', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 480, normalPrice: 1400, airline: 'ANA', stops: 0 },
    { origin: 'JFK', destination: 'LIS', destinationCity: 'Lisbon', destinationCountry: 'Portugal', basePrice: 270, normalPrice: 690, airline: 'TAP Portugal', stops: 0 },
  ],
  LAX: [
    { origin: 'LAX', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 420, normalPrice: 1200, airline: 'Japan Airlines', stops: 0 },
    { origin: 'LAX', destination: 'SYD', destinationCity: 'Sydney', destinationCountry: 'Australia', basePrice: 580, normalPrice: 1500, airline: 'Qantas', stops: 0 },
    { origin: 'LAX', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 380, normalPrice: 950, airline: 'Air France', stops: 0 },
    { origin: 'LAX', destination: 'FCO', destinationCity: 'Rome', destinationCountry: 'Italy', basePrice: 420, normalPrice: 1100, airline: 'ITA Airways', stops: 1 },
    { origin: 'LAX', destination: 'CUN', destinationCity: 'Cancun', destinationCountry: 'Mexico', basePrice: 180, normalPrice: 450, airline: 'American Airlines', stops: 0 },
  ],
  LHR: [
    { origin: 'LHR', destination: 'JFK', destinationCity: 'New York', destinationCountry: 'USA', basePrice: 320, normalPrice: 850, airline: 'British Airways', stops: 0 },
    { origin: 'LHR', destination: 'DXB', destinationCity: 'Dubai', destinationCountry: 'UAE', basePrice: 350, normalPrice: 800, airline: 'Emirates', stops: 0 },
    { origin: 'LHR', destination: 'BKK', destinationCity: 'Bangkok', destinationCountry: 'Thailand', basePrice: 420, normalPrice: 950, airline: 'Thai Airways', stops: 0 },
    { origin: 'LHR', destination: 'BCN', destinationCity: 'Barcelona', destinationCountry: 'Spain', basePrice: 45, normalPrice: 180, airline: 'Vueling', stops: 0 },
    { origin: 'LHR', destination: 'FCO', destinationCity: 'Rome', destinationCountry: 'Italy', basePrice: 55, normalPrice: 200, airline: 'British Airways', stops: 0 },
  ],
  DXB: [
    { origin: 'DXB', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 380, normalPrice: 900, airline: 'Emirates', stops: 0 },
    { origin: 'DXB', destination: 'BKK', destinationCity: 'Bangkok', destinationCountry: 'Thailand', basePrice: 280, normalPrice: 650, airline: 'Emirates', stops: 0 },
    { origin: 'DXB', destination: 'SIN', destinationCity: 'Singapore', destinationCountry: 'Singapore', basePrice: 320, normalPrice: 750, airline: 'Emirates', stops: 0 },
    { origin: 'DXB', destination: 'MLE', destinationCity: 'Maldives', destinationCountry: 'Maldives', basePrice: 250, normalPrice: 600, airline: 'Emirates', stops: 0 },
    { origin: 'DXB', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 350, normalPrice: 850, airline: 'Air France', stops: 0 },
  ],
  ORD: [
    { origin: 'ORD', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 380, normalPrice: 950, airline: 'United Airlines', stops: 0 },
    { origin: 'ORD', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 420, normalPrice: 1000, airline: 'American Airlines', stops: 0 },
    { origin: 'ORD', destination: 'CUN', destinationCity: 'Cancun', destinationCountry: 'Mexico', basePrice: 180, normalPrice: 450, airline: 'United Airlines', stops: 0 },
    { origin: 'ORD', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 520, normalPrice: 1300, airline: 'ANA', stops: 0 },
    { origin: 'ORD', destination: 'FCO', destinationCity: 'Rome', destinationCountry: 'Italy', basePrice: 450, normalPrice: 1100, airline: 'ITA Airways', stops: 0 },
  ],
  CDG: [
    { origin: 'CDG', destination: 'JFK', destinationCity: 'New York', destinationCountry: 'USA', basePrice: 320, normalPrice: 850, airline: 'Air France', stops: 0 },
    { origin: 'CDG', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 480, normalPrice: 1200, airline: 'Air France', stops: 0 },
    { origin: 'CDG', destination: 'MAD', destinationCity: 'Madrid', destinationCountry: 'Spain', basePrice: 50, normalPrice: 180, airline: 'Vueling', stops: 0 },
    { origin: 'CDG', destination: 'BCN', destinationCity: 'Barcelona', destinationCountry: 'Spain', basePrice: 45, normalPrice: 160, airline: 'Vueling', stops: 0 },
    { origin: 'CDG', destination: 'DXB', destinationCity: 'Dubai', destinationCountry: 'UAE', basePrice: 350, normalPrice: 800, airline: 'Emirates', stops: 0 },
  ],
  FRA: [
    { origin: 'FRA', destination: 'JFK', destinationCity: 'New York', destinationCountry: 'USA', basePrice: 350, normalPrice: 900, airline: 'Lufthansa', stops: 0 },
    { origin: 'FRA', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 480, normalPrice: 1150, airline: 'Lufthansa', stops: 0 },
    { origin: 'FRA', destination: 'BKK', destinationCity: 'Bangkok', destinationCountry: 'Thailand', basePrice: 420, normalPrice: 950, airline: 'Thai Airways', stops: 0 },
    { origin: 'FRA', destination: 'BCN', destinationCity: 'Barcelona', destinationCountry: 'Spain', basePrice: 55, normalPrice: 200, airline: 'Vueling', stops: 0 },
    { origin: 'FRA', destination: 'LIS', destinationCity: 'Lisbon', destinationCountry: 'Portugal', basePrice: 60, normalPrice: 220, airline: 'TAP Portugal', stops: 0 },
  ],
  SFO: [
    { origin: 'SFO', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 450, normalPrice: 1200, airline: 'United Airlines', stops: 0 },
    { origin: 'SFO', destination: 'SYD', destinationCity: 'Sydney', destinationCountry: 'Australia', basePrice: 620, normalPrice: 1600, airline: 'Qantas', stops: 0 },
    { origin: 'SFO', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 420, normalPrice: 1050, airline: 'Air France', stops: 0 },
    { origin: 'SFO', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 450, normalPrice: 1100, airline: 'British Airways', stops: 0 },
    { origin: 'SFO', destination: 'CUN', destinationCity: 'Cancun', destinationCountry: 'Mexico', basePrice: 220, normalPrice: 500, airline: 'United Airlines', stops: 1 },
  ],
  AMS: [
    { origin: 'AMS', destination: 'JFK', destinationCity: 'New York', destinationCountry: 'USA', basePrice: 340, normalPrice: 850, airline: 'KLM', stops: 0 },
    { origin: 'AMS', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 480, normalPrice: 1100, airline: 'KLM', stops: 0 },
    { origin: 'AMS', destination: 'BCN', destinationCity: 'Barcelona', destinationCountry: 'Spain', basePrice: 50, normalPrice: 180, airline: 'Vueling', stops: 0 },
    { origin: 'AMS', destination: 'LIS', destinationCity: 'Lisbon', destinationCountry: 'Portugal', basePrice: 55, normalPrice: 200, airline: 'TAP Portugal', stops: 0 },
    { origin: 'AMS', destination: 'DXB', destinationCity: 'Dubai', destinationCountry: 'UAE', basePrice: 380, normalPrice: 850, airline: 'Emirates', stops: 0 },
  ],
  MAD: [
    { origin: 'MAD', destination: 'JFK', destinationCity: 'New York', destinationCountry: 'USA', basePrice: 320, normalPrice: 850, airline: 'Iberia', stops: 0 },
    { origin: 'MAD', destination: 'MIA', destinationCity: 'Miami', destinationCountry: 'USA', basePrice: 350, normalPrice: 900, airline: 'Iberia', stops: 0 },
    { origin: 'MAD', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 55, normalPrice: 200, airline: 'British Airways', stops: 0 },
    { origin: 'MAD', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 50, normalPrice: 180, airline: 'Air France', stops: 0 },
    { origin: 'MAD', destination: 'FCO', destinationCity: 'Rome', destinationCountry: 'Italy', basePrice: 45, normalPrice: 170, airline: 'ITA Airways', stops: 0 },
  ],
  BCN: [
    { origin: 'BCN', destination: 'JFK', destinationCity: 'New York', destinationCountry: 'USA', basePrice: 340, normalPrice: 900, airline: 'LEVEL', stops: 0 },
    { origin: 'BCN', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 45, normalPrice: 180, airline: 'Vueling', stops: 0 },
    { origin: 'BCN', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 40, normalPrice: 150, airline: 'Vueling', stops: 0 },
    { origin: 'BCN', destination: 'AMS', destinationCity: 'Amsterdam', destinationCountry: 'Netherlands', basePrice: 50, normalPrice: 180, airline: 'KLM', stops: 0 },
    { origin: 'BCN', destination: 'FCO', destinationCity: 'Rome', destinationCountry: 'Italy', basePrice: 40, normalPrice: 160, airline: 'Vueling', stops: 0 },
  ],
  BOS: [
    { origin: 'BOS', destination: 'DUB', destinationCity: 'Dublin', destinationCountry: 'Ireland', basePrice: 280, normalPrice: 700, airline: 'Aer Lingus', stops: 0 },
    { origin: 'BOS', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 380, normalPrice: 950, airline: 'British Airways', stops: 0 },
    { origin: 'BOS', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 350, normalPrice: 900, airline: 'Air France', stops: 0 },
    { origin: 'BOS', destination: 'BCN', destinationCity: 'Barcelona', destinationCountry: 'Spain', basePrice: 320, normalPrice: 850, airline: 'TAP Portugal', stops: 1 },
    { origin: 'BOS', destination: 'LIS', destinationCity: 'Lisbon', destinationCountry: 'Portugal', basePrice: 290, normalPrice: 750, airline: 'TAP Portugal', stops: 0 },
  ],
  MIA: [
    { origin: 'MIA', destination: 'MAD', destinationCity: 'Madrid', destinationCountry: 'Spain', basePrice: 350, normalPrice: 900, airline: 'Iberia', stops: 0 },
    { origin: 'MIA', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 380, normalPrice: 950, airline: 'Air France', stops: 0 },
    { origin: 'MIA', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 420, normalPrice: 1000, airline: 'British Airways', stops: 0 },
    { origin: 'MIA', destination: 'CUN', destinationCity: 'Cancun', destinationCountry: 'Mexico', basePrice: 120, normalPrice: 350, airline: 'American Airlines', stops: 0 },
    { origin: 'MIA', destination: 'GRU', destinationCity: 'São Paulo', destinationCountry: 'Brazil', basePrice: 380, normalPrice: 950, airline: 'LATAM', stops: 0 },
  ],
  EWR: [
    { origin: 'EWR', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 290, normalPrice: 850, airline: 'United Airlines', stops: 0 },
    { origin: 'EWR', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 320, normalPrice: 900, airline: 'United Airlines', stops: 0 },
    { origin: 'EWR', destination: 'BCN', destinationCity: 'Barcelona', destinationCountry: 'Spain', basePrice: 310, normalPrice: 800, airline: 'TAP Portugal', stops: 1 },
    { origin: 'EWR', destination: 'LIS', destinationCity: 'Lisbon', destinationCountry: 'Portugal', basePrice: 280, normalPrice: 720, airline: 'TAP Portugal', stops: 0 },
    { origin: 'EWR', destination: 'DUB', destinationCity: 'Dublin', destinationCountry: 'Ireland', basePrice: 260, normalPrice: 650, airline: 'Aer Lingus', stops: 0 },
  ],
  ATL: [
    { origin: 'ATL', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 380, normalPrice: 950, airline: 'Delta', stops: 0 },
    { origin: 'ATL', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 420, normalPrice: 1000, airline: 'Delta', stops: 0 },
    { origin: 'ATL', destination: 'CUN', destinationCity: 'Cancun', destinationCountry: 'Mexico', basePrice: 180, normalPrice: 450, airline: 'Delta', stops: 0 },
    { origin: 'ATL', destination: 'FCO', destinationCity: 'Rome', destinationCountry: 'Italy', basePrice: 450, normalPrice: 1100, airline: 'Delta', stops: 0 },
    { origin: 'ATL', destination: 'AMS', destinationCity: 'Amsterdam', destinationCountry: 'Netherlands', basePrice: 400, normalPrice: 950, airline: 'KLM', stops: 0 },
  ],
  MUC: [
    { origin: 'MUC', destination: 'JFK', destinationCity: 'New York', destinationCountry: 'USA', basePrice: 380, normalPrice: 950, airline: 'Lufthansa', stops: 0 },
    { origin: 'MUC', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 520, normalPrice: 1200, airline: 'Lufthansa', stops: 0 },
    { origin: 'MUC', destination: 'BCN', destinationCity: 'Barcelona', destinationCountry: 'Spain', basePrice: 55, normalPrice: 200, airline: 'Vueling', stops: 0 },
    { origin: 'MUC', destination: 'LIS', destinationCity: 'Lisbon', destinationCountry: 'Portugal', basePrice: 65, normalPrice: 230, airline: 'TAP Portugal', stops: 0 },
    { origin: 'MUC', destination: 'DXB', destinationCity: 'Dubai', destinationCountry: 'UAE', basePrice: 380, normalPrice: 850, airline: 'Emirates', stops: 0 },
  ],
  SEA: [
    { origin: 'SEA', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 480, normalPrice: 1150, airline: 'Delta', stops: 0 },
    { origin: 'SEA', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 450, normalPrice: 1100, airline: 'Air France', stops: 0 },
    { origin: 'SEA', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 480, normalPrice: 1150, airline: 'British Airways', stops: 0 },
    { origin: 'SEA', destination: 'CUN', destinationCity: 'Cancun', destinationCountry: 'Mexico', basePrice: 280, normalPrice: 600, airline: 'Alaska Airlines', stops: 1 },
    { origin: 'SEA', destination: 'ICN', destinationCity: 'Seoul', destinationCountry: 'South Korea', basePrice: 520, normalPrice: 1200, airline: 'Korean Air', stops: 0 },
  ],
  DEN: [
    { origin: 'DEN', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 450, normalPrice: 1100, airline: 'British Airways', stops: 0 },
    { origin: 'DEN', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 420, normalPrice: 1050, airline: 'United Airlines', stops: 1 },
    { origin: 'DEN', destination: 'CUN', destinationCity: 'Cancun', destinationCountry: 'Mexico', basePrice: 220, normalPrice: 500, airline: 'United Airlines', stops: 0 },
    { origin: 'DEN', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 550, normalPrice: 1300, airline: 'United Airlines', stops: 0 },
    { origin: 'DEN', destination: 'FRA', destinationCity: 'Frankfurt', destinationCountry: 'Germany', basePrice: 420, normalPrice: 1000, airline: 'Lufthansa', stops: 0 },
  ],
  SYD: [
    { origin: 'SYD', destination: 'LAX', destinationCity: 'Los Angeles', destinationCountry: 'USA', basePrice: 620, normalPrice: 1500, airline: 'Qantas', stops: 0 },
    { origin: 'SYD', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 850, normalPrice: 2000, airline: 'Qantas', stops: 1 },
    { origin: 'SYD', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 480, normalPrice: 1100, airline: 'Japan Airlines', stops: 0 },
    { origin: 'SYD', destination: 'SIN', destinationCity: 'Singapore', destinationCountry: 'Singapore', basePrice: 320, normalPrice: 750, airline: 'Singapore Airlines', stops: 0 },
    { origin: 'SYD', destination: 'DXB', destinationCity: 'Dubai', destinationCountry: 'UAE', basePrice: 680, normalPrice: 1600, airline: 'Emirates', stops: 0 },
  ],
  YYZ: [
    { origin: 'YYZ', destination: 'LHR', destinationCity: 'London', destinationCountry: 'UK', basePrice: 420, normalPrice: 1000, airline: 'Air Canada', stops: 0 },
    { origin: 'YYZ', destination: 'CDG', destinationCity: 'Paris', destinationCountry: 'France', basePrice: 450, normalPrice: 1050, airline: 'Air France', stops: 0 },
    { origin: 'YYZ', destination: 'BCN', destinationCity: 'Barcelona', destinationCountry: 'Spain', basePrice: 420, normalPrice: 980, airline: 'Air Canada', stops: 0 },
    { origin: 'YYZ', destination: 'NRT', destinationCity: 'Tokyo', destinationCountry: 'Japan', basePrice: 680, normalPrice: 1500, airline: 'Air Canada', stops: 0 },
    { origin: 'YYZ', destination: 'DUB', destinationCity: 'Dublin', destinationCountry: 'Ireland', basePrice: 380, normalPrice: 900, airline: 'Aer Lingus', stops: 0 },
  ],
}

// Generate date ranges for the next 3-6 months
function generateDateRange(): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const startMonth = now.getMonth() + 1 + Math.floor(Math.random() * 2) // 1-2 months from now
  const endMonth = startMonth + 2 + Math.floor(Math.random() * 2) // 2-3 months duration

  const year = now.getFullYear()
  const startMonthIndex = startMonth % 12
  const endMonthIndex = endMonth % 12
  const endYear = endMonth >= 12 ? year + 1 : year

  return `${months[startMonthIndex]} - ${months[endMonthIndex]} ${endYear}`
}

// Add random variation to price (-15% to +10%)
function varyPrice(basePrice: number): number {
  const variation = 0.85 + Math.random() * 0.25 // 0.85 to 1.10
  return Math.round(basePrice * variation)
}

// Generate deals from templates
function generateDeals(): Record<string, any[]> {
  const deals: Record<string, any[]> = {}

  for (const [airport, templates] of Object.entries(dealTemplates)) {
    deals[airport] = templates.map((template, index) => {
      const price = varyPrice(template.basePrice)
      const savings = template.normalPrice - price

      return {
        id: `${template.origin.toLowerCase()}-${template.destination.toLowerCase()}-${index + 1}`,
        origin: template.origin,
        destination: template.destination,
        destinationCity: template.destinationCity,
        destinationCountry: template.destinationCountry,
        price,
        normalPrice: template.normalPrice,
        savings,
        airline: template.airline,
        stops: template.stops,
        dates: generateDateRange(),
      }
    })
  }

  return deals
}

// Generate the TypeScript file content
function generateFileContent(deals: Record<string, any[]>): string {
  const now = new Date()
  const timestamp = now.toISOString()
  const displayDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  let content = `// Auto-generated by update-deals.ts
// Last updated: ${timestamp}
// Run 'npm run update-deals' to refresh deals

export const lastUpdated = '${displayDate}'

export interface Deal {
  id: string
  origin: string
  destination: string
  destinationCity: string
  destinationCountry: string
  price: number
  normalPrice: number
  savings: number
  airline: string
  stops: number
  dates: string
  expiresAt?: string
}

export const dealsByAirport: Record<string, Deal[]> = ${JSON.stringify(deals, null, 2)}

export function getDealsForAirport(code: string): Deal[] {
  return dealsByAirport[code.toUpperCase()] || []
}

export function getDealsForCity(airports: string[]): Deal[] {
  const allDeals: Deal[] = []
  for (const code of airports) {
    const deals = getDealsForAirport(code)
    allDeals.push(...deals)
  }
  return allDeals
}

export function getFeaturedDeals(): Deal[] {
  // Return a mix of deals from different airports
  const featured: Deal[] = []
  const airportCodes = Object.keys(dealsByAirport)

  for (let i = 0; i < Math.min(8, airportCodes.length); i++) {
    const deals = dealsByAirport[airportCodes[i]]
    if (deals && deals.length > 0) {
      featured.push(deals[0])
    }
  }

  return featured
}
`

  return content
}

// Main execution
function main() {
  console.log('🛫 Updating flight deals...')

  const deals = generateDeals()
  const content = generateFileContent(deals)

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'deals.ts')
  fs.writeFileSync(outputPath, content, 'utf-8')

  console.log(`✅ Deals updated successfully!`)
  console.log(`📁 Output: ${outputPath}`)
  console.log(`📊 Airports: ${Object.keys(deals).length}`)
  console.log(`🎫 Total deals: ${Object.values(deals).reduce((sum, d) => sum + d.length, 0)}`)
}

main()
