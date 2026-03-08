require('dotenv').config({ path: '.env.local' })
const fetch = require('node-fetch')

async function testFetch() {
  console.log('🚀 Testing fetch-deals-improved locally...\n')

  const response = await fetch('http://localhost:3000/api/cron/fetch-deals-improved', {
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET || 'test'}`
    }
  })

  const result = await response.json()

  console.log('Response:', JSON.stringify(result, null, 2))

  if (result.results && result.results.length > 0) {
    result.results.forEach(city => {
      console.log(`\n📍 ${city.citySlug}:`)
      console.log(`   - Deals found: ${city.dealsFound}`)
      console.log(`   - Filtered to: ${city.dealsFiltered} (removed ${city.dealsFound - city.dealsFiltered} bad destinations)`)
      console.log(`   - Saved: ${city.dealsSaved}`)

      if (city.topDestinations && city.topDestinations.length > 0) {
        console.log(`   - Top destinations:`)
        city.topDestinations.forEach(dest => {
          console.log(`      • ${dest}`)
        })
      }
    })
  }
}

testFetch().catch(console.error)