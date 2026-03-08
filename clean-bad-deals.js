require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mofcecngtooafabaldca.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs'

const supabase = createClient(supabaseUrl, supabaseKey)

// Destinos basura que NO queremos
const BAD_DESTINATIONS = [
  'Wind Cave National Park',
  'Saint Paul',
  'Bozeman',
  'Cedar Rapids',
  'Des Moines',
  'Rapid City',
  'Sioux Falls',
  'Fargo',
  'Bismarck',
  'Grand Forks',
  'Billings',
  'Great Falls',
  'Helena',
  'Missoula',
  'Kalispell',
  'Cheyenne',
  'Casper',
  'Jackson Hole', // Pequeño aeropuerto de ski, no es un deal típico
  'Laramie',
  'Gillette',
  'Sheridan',
  'Rock Springs',
  'Green River',
  'Evanston',
  'Riverton',
  'Cody',
  'Powell',
  'Worland',
  'Thermopolis',
  'Rawlins',
  'Douglas',
  'Torrington',
  'Wheatland',
  'Newcastle',
  'Buffalo',
  'Lander',
  'Pinedale',
  'Afton',
  'Kemmerer',
  'Dubois',
  'Saratoga',
  'Baggs',
  'Encampment',
  'Elk Mountain',
  'Medicine Bow',
  'Centennial',
  'Woods Landing',
  'Tie Siding',
  'Buford',
  'Granite Canon',
  'Horse Creek',
  'Hillsdale',
  'Burns',
  'Pine Bluffs',
  'Albin',
  'La Grange',
  'Meriden',
  'Lagrange',
  'Yoder',
  'Hawk Springs',
  'Huntley',
  'Veteran',
  'Fort Laramie',
  'Guernsey',
  'Hartville',
  'Glendo',
  'Orin',
  'Lost Springs',
  'Shawnee',
  'Bill',
  'Glenrock',
  'Rolling Hills',
  'Evansville',
  'Bar Nunn',
  'Mills',
  'Vista West',
  'Mountain View',
  'Edgerton',
  'Midwest',
  'Kaycee',
  'Linch',
  'Sussex',
  'Barnum',
  'Spotted Horse',
  'Leiter',
  'Banner',
  'Story',
  'Big Horn',
  'Dayton',
  'Ranchester',
  'Parkman',
  'Clearmont',
  'Arvada',
  'Recluse',
  'Weston',
  'Upton',
  'Osage',
  'Fairview',
  'Hulett',
  'Alva',
  'Aladdin',
  'Beulah',
  'Sundance',
  'Moorcroft'
]

// Palabras clave que indican destinos basura
const BAD_KEYWORDS = [
  'National Park',
  'Wildlife',
  'Refuge',
  'Monument',
  'State Park',
  'Forest',
  'Wilderness',
  'Recreation Area',
  'Preserve',
  'Conservation',
  'Heritage Site'
]

async function cleanBadDeals() {
  console.log('🧹 Starting cleanup of bad deals...')

  try {
    // Get all deals from NYC
    const { data: deals, error } = await supabase
      .from('flight_deals')
      .select('id, destination, destination_code, price')
      .eq('city_slug', 'new-york')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) {
      console.error('Error fetching deals:', error)
      return
    }

    console.log(`Found ${deals.length} total deals`)

    // Find bad deals
    const badDeals = deals.filter(deal => {
      const dest = deal.destination || ''

      // Check if it's in our bad destinations list
      if (BAD_DESTINATIONS.some(bad => dest.includes(bad))) {
        return true
      }

      // Check if it contains bad keywords
      if (BAD_KEYWORDS.some(keyword => dest.includes(keyword))) {
        return true
      }

      return false
    })

    console.log(`Found ${badDeals.length} bad deals to remove:`)

    // Group bad deals by destination for visibility
    const badByDest = {}
    badDeals.forEach(deal => {
      const dest = deal.destination
      if (!badByDest[dest]) {
        badByDest[dest] = 0
      }
      badByDest[dest]++
    })

    console.log('\n❌ Bad destinations found:')
    Object.entries(badByDest)
      .sort((a, b) => b[1] - a[1])
      .forEach(([dest, count]) => {
        console.log(`  - ${dest}: ${count} deals`)
      })

    // Delete bad deals
    if (badDeals.length > 0) {
      console.log(`\n🗑️  Deleting ${badDeals.length} bad deals...`)

      const badIds = badDeals.map(d => d.id)

      const { error: deleteError } = await supabase
        .from('flight_deals')
        .delete()
        .in('id', badIds)

      if (deleteError) {
        console.error('Error deleting bad deals:', deleteError)
      } else {
        console.log(`✅ Successfully deleted ${badDeals.length} bad deals`)
      }
    }

    // Show what good deals remain
    const goodDeals = deals.filter(deal => !badDeals.includes(deal))
    const goodByDest = {}
    goodDeals.forEach(deal => {
      const dest = deal.destination
      if (!goodByDest[dest]) {
        goodByDest[dest] = { count: 0, minPrice: Infinity }
      }
      goodByDest[dest].count++
      goodByDest[dest].minPrice = Math.min(goodByDest[dest].minPrice, deal.price)
    })

    console.log('\n✅ Top quality destinations remaining:')
    Object.entries(goodByDest)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
      .forEach(([dest, data]) => {
        console.log(`  - ${dest}: ${data.count} deals (from $${data.minPrice})`)
      })

  } catch (error) {
    console.error('Fatal error:', error)
  }
}

cleanBadDeals()