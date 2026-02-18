export interface PopularRoute {
  destination: string
  code: string
  typicalDeal: number
}

export interface CityFAQ {
  question: string
  answer: string
}

export interface CityStat {
  value: string
  label: string
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
  metaDescription?: string
  topDestinations?: string[]
  bestDealSeason?: string
  airlines?: string[]
  avgSavings?: string
  // Hero section
  stats?: CityStat[] // 3-4 compact stats for hero section
  shortIntro?: string // 1-2 line tagline for hero
  intro?: string // Detailed content for expandable section
  popularRoutes?: PopularRoute[]
  faqs?: CityFAQ[]
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
    metaDescription: 'LHR, LGW, STN & LTN flight deals to New York, Dubai, Bangkok and 100+ destinations. Price drop alerts from all London airports. Updated weekly.',
    topDestinations: ['New York', 'Dubai', 'Bangkok', 'Los Angeles', 'Tokyo'],
    bestDealSeason: 'January-March and November',
    airlines: ['British Airways', 'Virgin Atlantic', 'Norwegian', 'Ryanair'],
    avgSavings: '$380',
    stats: [
      { value: '80M+', label: 'passengers/year' },
      { value: '4', label: 'airports tracked' },
      { value: '200+', label: 'destinations' },
      { value: '$380', label: 'avg savings' },
    ],
    shortIntro: 'We track Heathrow, Gatwick, Stansted & Luton for deals to the Americas, Asia, and beyond.',
    intro: 'London\'s four major airports serve over 80 million passengers annually. Heathrow (LHR) is the UK\'s largest hub with British Airways and Virgin Atlantic. Gatwick (LGW) and Stansted (STN) are budget carrier strongholds with Ryanair and easyJet offering sub-£50 Europe flights. We monitor all four airports 24/7 so you never miss a price drop—whether it\'s a £299 New York deal from Heathrow or a £49 Barcelona fare from Stansted.',
    popularRoutes: [
      { destination: 'New York', code: 'JFK', typicalDeal: 329 },
      { destination: 'Barcelona', code: 'BCN', typicalDeal: 49 },
      { destination: 'Dubai', code: 'DXB', typicalDeal: 349 },
      { destination: 'Bangkok', code: 'BKK', typicalDeal: 449 },
    ],
    faqs: [
      {
        question: 'Which London airport has the cheapest flights?',
        answer: 'It depends on the route. Gatwick and Stansted dominate for budget European routes via Ryanair and easyJet. Heathrow is stronger for long-haul deals, especially to the US and Asia. We track all four airports so you see the best price regardless.',
      },
      {
        question: 'When is the cheapest time to fly from London?',
        answer: 'January through March offers the lowest fares from London, especially to the US and Asia. November is also strong for long-haul deals. Avoid school holidays (half-term, Easter, summer) when prices spike 30-50%.',
      },
      {
        question: 'How far in advance should I book flights from London?',
        answer: 'For European short-haul, 1-2 months ahead is usually fine. For US routes, 2-4 months. For Asia and Australia, 3-6 months. Mistake fares and flash sales break these rules — that\'s where alerts help.',
      },
      {
        question: 'Does Homebase Flights track all London airports?',
        answer: 'Yes — we monitor Heathrow (LHR), Gatwick (LGW), Stansted (STN), and Luton (LTN). You\'ll see the best deal regardless of which airport it departs from.',
      },
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
    metaDescription: 'JFK, EWR & LGA deals to London, Paris, Tokyo and 50+ destinations. Price drop alerts from all New York airports. Updated weekly.',
    topDestinations: ['London', 'Paris', 'Rome', 'Dublin', 'Reykjavik'],
    bestDealSeason: 'January-March and September-November',
    airlines: ['JetBlue', 'Delta', 'United', 'Norse Atlantic', 'Norwegian'],
    avgSavings: '$420',
    stats: [
      { value: '130M+', label: 'passengers/year' },
      { value: '3', label: 'airports tracked' },
      { value: '100+', label: 'destinations' },
      { value: '$420', label: 'avg savings' },
    ],
    shortIntro: 'We track JFK, Newark & LaGuardia for deals to Europe, Caribbean, and Asia.',
    intro: 'New York\'s three airports serve over 130 million passengers annually—the largest air market in the US. JFK handles most international flights with 90+ airlines. Newark (EWR) is United\'s hub with strong Europe and South America routes. LaGuardia focuses on domestic. We monitor all three 24/7 because the best deals often appear at Newark when everyone\'s watching JFK.',
    popularRoutes: [
      { destination: 'London', code: 'LHR', typicalDeal: 389 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 419 },
      { destination: 'Rome', code: 'FCO', typicalDeal: 449 },
      { destination: 'Dublin', code: 'DUB', typicalDeal: 359 },
    ],
    faqs: [
      {
        question: 'Which New York airport has the cheapest flights?',
        answer: 'JFK usually has the best international deals, especially to Europe. Newark (EWR) is strong for United routes to Asia and South America. LaGuardia (LGA) focuses on domestic. We monitor all three so you see every deal.',
      },
      {
        question: 'When is the cheapest time to fly from New York?',
        answer: 'January through March and September through November are the sweet spots. Avoid Thanksgiving week, Christmas, and summer (June-August) when transatlantic fares surge. Shoulder seasons offer the best balance of price and weather.',
      },
      {
        question: 'How far in advance should I book international flights from NYC?',
        answer: 'For Europe, 2-3 months ahead typically works well. For Asia, 3-5 months. Caribbean deals often pop up 1-2 months out. Error fares appear with no notice — set up alerts to catch them.',
      },
      {
        question: 'Does Homebase Flights cover all NYC airports?',
        answer: 'Yes — JFK, Newark (EWR), and LaGuardia (LGA). Many travelers don\'t realize Newark often has better deals to Europe than JFK. We show you deals from all three.',
      },
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
    metaDescription: 'LAX deals to Tokyo from $489, Hawaii from $149, Europe from $399. Get alerts when prices drop from Los Angeles. No spam, just deals.',
    topDestinations: ['Tokyo', 'Sydney', 'Paris', 'Cancun', 'Hawaii'],
    bestDealSeason: 'January-February and September-October',
    airlines: ['Delta', 'American', 'United', 'Southwest', 'Japan Airlines'],
    avgSavings: '$450',
    stats: [
      { value: '88M+', label: 'passengers/year' },
      { value: '4', label: 'airports tracked' },
      { value: '200+', label: 'destinations' },
      { value: '$450', label: 'avg savings' },
    ],
    shortIntro: 'Gateway to the Pacific. We track LAX, Burbank, Orange County & Ontario daily.',
    intro: 'Los Angeles International (LAX) is the #1 US gateway to Asia and the Pacific, serving 88+ million passengers annually. Delta, American, and United all have significant operations here, competing with Asian carriers like Japan Airlines, ANA, Korean Air, and Singapore Airlines. We also monitor Burbank (BUR), Orange County (SNA), and Ontario (ONT)—budget carriers at these airports sometimes undercut LAX by $50-100 on domestic routes.',
    popularRoutes: [
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 489 },
      { destination: 'Sydney', code: 'SYD', typicalDeal: 699 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 449 },
      { destination: 'Cancun', code: 'CUN', typicalDeal: 249 },
    ],
    faqs: [
      {
        question: 'When is the cheapest time to fly from LAX?',
        answer: 'January and February are consistently the cheapest months. September-October also offer good deals before holiday travel ramps up. Avoid flying during Thanksgiving, Christmas, and spring break.',
      },
      {
        question: 'What are the best deal routes from Los Angeles?',
        answer: 'Transpacific routes to Tokyo, Seoul, and Taipei see frequent deals. Hawaii is also excellent from LAX — sub-$200 roundtrips appear regularly. Europe deals are less common but appear several times per year under $450 roundtrip.',
      },
      {
        question: 'How far in advance should I book flights from LAX?',
        answer: 'For Hawaii, 1-2 months is usually enough. For Asia, 2-5 months. For Europe, 3-6 months for peak summer. Mistake fares break all rules — we\'ve seen LAX to Tokyo for under $300 with 24 hours\' notice.',
      },
      {
        question: 'Does Homebase Flights track all LA-area airports?',
        answer: 'Yes — LAX, Burbank (BUR), Orange County (SNA), and Ontario (ONT). Budget carriers at Burbank and Ontario sometimes undercut LAX by $50-100.',
      },
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
    metaDescription: 'ORD & MDW flight deals to Cancun, London, Tokyo and 80+ destinations. Price drop alerts from both Chicago airports. Updated weekly.',
    topDestinations: ['Dublin', 'London', 'Tokyo', 'Cancun', 'Rome'],
    bestDealSeason: 'January-March and October-November',
    airlines: ['United', 'American', 'Southwest', 'Spirit', 'Aer Lingus'],
    avgSavings: '$400',
    stats: [
      { value: '90M+', label: 'passengers/year' },
      { value: '2', label: 'airports tracked' },
      { value: '60+', label: 'countries nonstop' },
      { value: '$400', label: 'avg savings' },
    ],
    shortIntro: 'Major international hub. We track O\'Hare and Midway for the best deals.',
    intro: 'O\'Hare (ORD) is the 6th busiest airport globally, serving as a major United and American hub with nonstops to 60+ countries. Midway (MDW) is Southwest\'s stronghold with excellent domestic and Caribbean deals. We monitor both because Midway often beats O\'Hare by $50-100 on leisure routes like Cancun, while O\'Hare dominates for international.',
    popularRoutes: [
      { destination: 'Dublin', code: 'DUB', typicalDeal: 399 },
      { destination: 'London', code: 'LHR', typicalDeal: 429 },
      { destination: 'Cancun', code: 'CUN', typicalDeal: 259 },
      { destination: 'Rome', code: 'FCO', typicalDeal: 489 },
    ],
    faqs: [
      {
        question: 'Which Chicago airport is cheaper — O\'Hare or Midway?',
        answer: 'O\'Hare (ORD) dominates for international deals, especially to Europe and Asia. Midway (MDW) is Southwest\'s hub and often wins for domestic and Caribbean routes. We track both so you don\'t have to choose.',
      },
      {
        question: 'When is the cheapest time to fly from Chicago?',
        answer: 'January through March has the lowest fares, especially to Europe. October-November is also strong. Avoid June-August for transatlantic and Thanksgiving week for domestic.',
      },
      {
        question: 'What are the best international routes from Chicago?',
        answer: 'Dublin is consistently the cheapest European destination from ORD thanks to Aer Lingus nonstops. London, Rome, and Tokyo also see regular deals. Cancun leads for leisure getaways.',
      },
      {
        question: 'Does Homebase Flights cover both Chicago airports?',
        answer: 'Yes — O\'Hare (ORD) and Midway (MDW). We show you the cheapest option regardless of airport, so you never miss a deal from either terminal.',
      },
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
    metaDescription: 'Cheap flights from San Francisco (SFO): Tokyo $445, Hawaii $178, Paris $399, London $449. 50+ airlines, 120+ destinations. Deal alerts from all Bay Area airports.',
    topDestinations: ['Tokyo', 'Seoul', 'Taipei', 'Paris', 'Honolulu', 'London', 'Singapore'],
    bestDealSeason: 'January-February and October-November',
    airlines: ['United', 'Alaska Airlines', 'Delta', 'Japan Airlines', 'ANA', 'Korean Air', 'Singapore Airlines', 'French Bee', 'Southwest'],
    avgSavings: '$420',
    stats: [
      { value: '57M+', label: 'passengers/year' },
      { value: '3', label: 'airports tracked' },
      { value: '15+', label: 'daily Asia flights' },
      { value: '$420', label: 'avg savings' },
    ],
    shortIntro: '#2 US gateway to Asia. We track SFO, Oakland & San Jose for the best deals.',
    intro: 'San Francisco International (SFO) serves 57+ million passengers annually with 50+ airlines flying to 120+ destinations. United operates SFO as a major hub with 300+ daily departures to Asia, Europe, and beyond. Japan Airlines, ANA, Korean Air, and Singapore Airlines compete fiercely on transpacific routes—which is why SFO to Tokyo roundtrips regularly drop under $500. Hawaii is another sweet spot: Southwest, Hawaiian, Alaska, and United all compete, pushing prices below $200 (we\'ve seen $98 roundtrips). We also monitor Oakland (OAK) and San Jose (SJC)—Southwest\'s presence at both means deals that don\'t appear elsewhere. For Europe, French Bee offers budget Paris fares from $399.',
    popularRoutes: [
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 445 },
      { destination: 'Seoul', code: 'ICN', typicalDeal: 479 },
      { destination: 'Honolulu', code: 'HNL', typicalDeal: 178 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 399 },
      { destination: 'London', code: 'LHR', typicalDeal: 449 },
      { destination: 'Taipei', code: 'TPE', typicalDeal: 489 },
      { destination: 'Cabo San Lucas', code: 'SJD', typicalDeal: 198 },
      { destination: 'Singapore', code: 'SIN', typicalDeal: 599 },
    ],
    faqs: [
      {
        question: 'What is the cheapest flight from San Francisco right now?',
        answer: 'The cheapest international flights from San Francisco are typically to Hawaii ($178-$249 roundtrip), Mexico (Cabo, Puerto Vallarta from $198-$299), and Japan ($445-$549 to Tokyo). Domestic deals to Los Angeles, Seattle, and Phoenix often drop below $80 roundtrip. Prices change daily—we send alerts when fares drop significantly below normal.',
      },
      {
        question: 'When is the best time to fly from San Francisco?',
        answer: 'January and February consistently offer the lowest fares from SFO—often 25-35% cheaper than summer. October and early November are also excellent. Avoid Thanksgiving week, Christmas/New Year, and summer (June-August) when transpacific fares surge 40-60%. For Hawaii, mid-September through mid-November and January-March (excluding spring break) offer the best prices. Tuesday and Wednesday flights typically save 10-15% vs. weekend travel.',
      },
      {
        question: 'Why does San Francisco have such good deals to Japan?',
        answer: 'SFO is the #2 US gateway to Asia (after LAX). United operates its primary transpacific hub here with 15+ daily flights to Asia. Japan Airlines, ANA, and United all operate multiple daily nonstops to Tokyo—and Korean Air, Asiana, EVA Air, and China Airlines connect through their hubs. This intense competition keeps prices sharp. We regularly see SFO to Tokyo roundtrips under $500, and mistake fares occasionally drop to the $300 range.',
      },
      {
        question: 'Should I fly from SFO, Oakland, or San Jose?',
        answer: 'It depends on the route. SFO dominates for international flights with 50+ airlines and 120+ destinations. Oakland (OAK) is Southwest\'s Bay Area hub—excellent for domestic deals to Vegas, LA, Phoenix, Seattle with less congestion and cheaper parking. San Jose (SJC) serves Southwest, Alaska, and some international routes. We track all three airports because OAK and SJC sometimes undercut SFO by $100+ on identical routes.',
      },
      {
        question: 'How many airlines fly from San Francisco?',
        answer: 'San Francisco International hosts 50+ airlines serving 120+ destinations. Major domestic carriers include United (largest presence with 300+ daily flights), Alaska, Delta, American, Southwest, JetBlue, and Spirit. For Asia, you\'ll find Japan Airlines, ANA, Korean Air, Singapore Airlines, Cathay Pacific, EVA Air, and China Airlines. European service includes British Airways, Air France, Lufthansa, Aer Lingus, and budget carrier French Bee.',
      },
      {
        question: 'When is the cheapest time to fly from San Francisco to Hawaii?',
        answer: 'January through mid-March and mid-September through November offer the lowest fares. Four airlines compete heavily on Hawaii routes (Southwest, Hawaiian, Alaska, United), so sub-$200 roundtrips are common—we\'ve seen $98 roundtrip sales. Avoid spring break (March), summer, and December when Bay Area families flood the islands and prices jump 50-100%.',
      },
      {
        question: 'How competitive are SFO deals to Europe?',
        answer: 'Improving rapidly. French Bee (budget carrier) runs Paris-SFO with fares starting around $399 roundtrip—often $200+ cheaper than legacy carriers. United, British Airways, Air France, Lufthansa, and Aer Lingus all operate nonstops. London, Paris, Dublin, and Frankfurt are the strongest routes. Deals under $500 roundtrip appear several times per year. While still not as cheap as from JFK, the gap is closing fast.',
      },
      {
        question: 'What are the best destinations from San Francisco?',
        answer: 'For value, Hawaii (Honolulu, Maui, Kona) offers the best deals with 4-airline competition. Tokyo and Seoul provide excellent value for long-haul given the intense competition. Mexico beach destinations (Cabo, Puerto Vallarta, Cancun) see frequent sub-$300 deals. For Europe, Paris via French Bee is the standout. Domestically, Las Vegas, Los Angeles, Seattle, and Phoenix all see constant competition and sub-$100 fares.',
      },
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
    metaDescription: 'Cheap flights from Dubai that others miss. Deals to London, Bangkok, Maldives & more. We track DXB price drops so you don\'t have to.',
    topDestinations: ['London', 'Bangkok', 'Mumbai', 'Singapore', 'Maldives'],
    bestDealSeason: 'May-September (summer low season)',
    airlines: ['Emirates', 'Flydubai', 'Etihad', 'Air Arabia'],
    avgSavings: '$320',
    stats: [
      { value: '87M+', label: 'passengers/year' },
      { value: '#1', label: 'intl airport globally' },
      { value: '260+', label: 'destinations' },
      { value: '$320', label: 'avg savings' },
    ],
    shortIntro: 'World\'s busiest international airport. Emirates, Flydubai & Air Arabia deals daily.',
    intro: 'Dubai International (DXB) is the world\'s busiest airport for international passengers, serving 87+ million travelers annually to 260+ destinations. Emirates operates its global hub here with connections to every continent. Flydubai and Air Arabia add budget options to Southeast Asia, India, and Africa. Summer (May-September) is the best time for deals as tourist traffic drops—we see London fares under $400 and Bangkok under $350 regularly.',
    popularRoutes: [
      { destination: 'London', code: 'LHR', typicalDeal: 399 },
      { destination: 'Bangkok', code: 'BKK', typicalDeal: 349 },
      { destination: 'Mumbai', code: 'BOM', typicalDeal: 199 },
      { destination: 'Maldives', code: 'MLE', typicalDeal: 299 },
    ],
    faqs: [
      {
        question: 'When is the cheapest time to fly from Dubai?',
        answer: 'May through September (summer) is when long-haul fares from DXB drop significantly — fewer tourists mean lower prices to London, Bangkok, and the Maldives. Avoid December-January peak season.',
      },
      {
        question: 'What airlines offer the best deals from Dubai?',
        answer: 'Emirates runs periodic sales, but Flydubai and Air Arabia consistently offer lower base fares to Southeast Asia, India, and East Africa. We track all carriers operating from DXB.',
      },
      {
        question: 'How far in advance should I book flights from Dubai?',
        answer: 'For Southeast Asia and India, 1-2 months ahead works well. For Europe, 2-4 months. For Australia and the Americas, 3-5 months. Emirates flash sales appear several times per year.',
      },
      {
        question: 'Does Homebase Flights track all Dubai flights?',
        answer: 'We monitor Dubai International (DXB), which handles the vast majority of passenger flights. We cover all airlines including Emirates, Flydubai, and Air Arabia.',
      },
    ],
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    airports: ['SIN'],
    primaryAirport: 'SIN',
    country: 'Singapore',
    region: 'Asia',
    timezone: 'Asia/Singapore',
    metaDescription: 'SIN deals to Bali from $149, Tokyo from $299, Australia from $299. Get alerts when prices drop from Singapore Changi. No spam, just deals.',
    topDestinations: ['Bangkok', 'Bali', 'Tokyo', 'Melbourne', 'London'],
    bestDealSeason: 'January-February and September',
    airlines: ['Singapore Airlines', 'Scoot', 'AirAsia', 'Jetstar Asia'],
    avgSavings: '$350',
    stats: [
      { value: '68M+', label: 'passengers/year' },
      { value: '#1', label: 'rated airport' },
      { value: '<$100', label: 'Bali roundtrips' },
      { value: '$350', label: 'avg savings' },
    ],
    shortIntro: 'World\'s best airport. Scoot & AirAsia push regional fares below $100.',
    intro: 'Singapore Changi (SIN) is consistently rated the world\'s best airport and one of the best for finding deals. Scoot (Singapore Airlines\' budget arm) and AirAsia create fierce competition, pushing Bangkok, KL, and Bali fares below $100 roundtrip. Singapore Airlines runs 3-4 major sales yearly slashing Tokyo and Sydney fares by 40%. The famous Singapore-London route sees sub-$600 deals several times per year. We track all carriers because Scoot flash sales sell out in hours.',
    popularRoutes: [
      { destination: 'Bangkok', code: 'BKK', typicalDeal: 89 },
      { destination: 'Bali', code: 'DPS', typicalDeal: 149 },
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 299 },
      { destination: 'Melbourne', code: 'MEL', typicalDeal: 299 },
      { destination: 'London', code: 'LHR', typicalDeal: 549 },
    ],
    faqs: [
      {
        question: 'When should I avoid booking flights from Singapore?',
        answer: 'Chinese New Year is the most expensive period—fares spike 40-60% on Asian routes and regional flights sell out weeks in advance. December school holidays and June are also pricey. For the best deals, target January (post-New Year), February (after CNY), and September when demand drops.',
      },
      {
        question: 'Is Scoot worth it for budget flights from Singapore?',
        answer: 'Scoot offers genuine savings on regional and medium-haul routes—Bangkok, Bali, Perth, and Japan are particularly competitive. For short flights (2-4 hours), the no-frills experience is manageable. For longer routes like Australia, consider paying for ScootPlus if you value legroom. Scoot flash sales are the best time to book, often 30-50% below normal prices.',
      },
      {
        question: 'What\'s the cheapest way to fly from Singapore to Australia?',
        answer: 'Scoot and Jetstar run frequent sales on Perth, Melbourne, and Gold Coast routes—sub-$300 roundtrips appear several times per year. Perth is consistently the cheapest Australian destination from SIN (under 5 hours). For Sydney and Melbourne, watch for Singapore Airlines sales which offer better value at only $50-100 more than budget carriers.',
      },
      {
        question: 'How do I find Singapore Airlines deals?',
        answer: 'Singapore Airlines runs major sales 3-4 times per year (usually late January, April, and November). These aren\'t advertised loudly—that\'s where alerts help. We also track their lesser-known "spontaneous escapes" promotions that offer 15-25% off specific routes for 48-72 hours.',
      },
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
    metaDescription: 'Cheap flights from Hong Kong that others miss. Deals to Tokyo, Taipei, London & Bangkok. We track HKG price drops so you don\'t have to.',
    topDestinations: ['Tokyo', 'Bangkok', 'Singapore', 'Taipei', 'London'],
    bestDealSeason: 'March-April and September-November',
    airlines: ['Cathay Pacific', 'Hong Kong Airlines', 'HK Express', 'Singapore Airlines'],
    avgSavings: '$340',
    stats: [
      { value: '40M+', label: 'passengers/year' },
      { value: '<$200', label: 'Tokyo roundtrips' },
      { value: '120+', label: 'destinations' },
      { value: '$340', label: 'avg savings' },
    ],
    shortIntro: 'Gateway to Asia. Cathay Pacific hub plus HK Express budget deals.',
    intro: 'Hong Kong International (HKG) is a major Asia gateway serving 40+ million passengers. Cathay Pacific operates its global hub here with premium service worldwide. HK Express adds budget options to Japan, Korea, and Southeast Asia—Tokyo roundtrips often under $200. We track all carriers because deals from HKG move fast, especially Cathay\'s flash sales 2-3 times per year.',
    popularRoutes: [
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 189 },
      { destination: 'Taipei', code: 'TPE', typicalDeal: 149 },
      { destination: 'Bangkok', code: 'BKK', typicalDeal: 179 },
      { destination: 'London', code: 'LHR', typicalDeal: 549 },
    ],
    faqs: [
      {
        question: 'When is the cheapest time to fly from Hong Kong?',
        answer: 'March-April and September-November offer the best fares. Avoid Chinese New Year, Christmas, and summer (July-August) when family travel pushes prices up.',
      },
      {
        question: 'What are the best deal routes from Hong Kong?',
        answer: 'Tokyo and Taipei are consistently cheap (often under $200 roundtrip). Bangkok and Singapore also see frequent deals. Long-haul to London drops below $600 several times per year.',
      },
      {
        question: 'How far in advance should I book from Hong Kong?',
        answer: 'For regional Asia, 2-6 weeks. For Japan and Korea, 1-3 months. For Europe and the US, 3-5 months. Cathay Pacific runs flash sales 2-3 times per year.',
      },
      {
        question: 'Does Homebase Flights track all airlines from Hong Kong?',
        answer: 'Yes — Cathay Pacific, Hong Kong Airlines, HK Express, and all international carriers. HK Express (budget) often has deals that don\'t appear on aggregator sites.',
      },
    ],
  },
  {
    name: 'Sydney',
    slug: 'sydney',
    airports: ['SYD'],
    primaryAirport: 'SYD',
    country: 'Australia',
    region: 'Oceania',
    timezone: 'Australia/Sydney',
    metaDescription: 'SYD deals to Bali from $299, Tokyo from $499, LA from $699. Get alerts when prices drop from Sydney. No spam, just deals.',
    topDestinations: ['Bali', 'Tokyo', 'Auckland', 'Los Angeles', 'Singapore'],
    bestDealSeason: 'February-March and August-September',
    airlines: ['Qantas', 'Virgin Australia', 'Jetstar', 'United'],
    avgSavings: '$420',
    stats: [
      { value: '44M+', label: 'passengers/year' },
      { value: '<$300', label: 'Bali roundtrips' },
      { value: '100+', label: 'destinations' },
      { value: '$420', label: 'avg savings' },
    ],
    shortIntro: 'Australia\'s busiest airport. Qantas, Virgin & Jetstar deals daily.',
    intro: 'Sydney Kingsford Smith (SYD) is Australia\'s busiest airport serving 44+ million passengers. Qantas and Virgin Australia compete on most routes while Jetstar adds budget options. Bali is the standout deal destination—roundtrips under $300 appear regularly. For long-haul, we track Los Angeles and Tokyo deals which drop below $700 roundtrip several times per year.',
    popularRoutes: [
      { destination: 'Bali', code: 'DPS', typicalDeal: 299 },
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 499 },
      { destination: 'Auckland', code: 'AKL', typicalDeal: 249 },
      { destination: 'Los Angeles', code: 'LAX', typicalDeal: 699 },
    ],
    faqs: [
      {
        question: 'When is the cheapest time to fly from Sydney?',
        answer: 'February-March (after summer) and August-September (late winter) offer the lowest fares. Avoid December-January (Australian summer holidays) and school holiday periods.',
      },
      {
        question: 'What are the cheapest destinations from Sydney?',
        answer: 'Bali is the standout — roundtrips under $300 appear regularly. Auckland, Fiji, and Melbourne are also cheap. For long-haul, Los Angeles and Tokyo see periodic deals under $700 roundtrip.',
      },
      {
        question: 'How far in advance should I book from Sydney?',
        answer: 'For domestic and New Zealand, 1-2 months. For Southeast Asia, 2-3 months. For the US and Europe, 4-8 months, as long-haul from Australia books up early. Jetstar and Virgin sales drop with little notice.',
      },
      {
        question: 'Does Homebase Flights track budget airlines from Sydney?',
        answer: 'Yes — Jetstar, Virgin Australia, and all international carriers including Qantas. Budget carriers on the Bali and Southeast Asia routes account for many of the best deals from SYD.',
      },
    ],
  },
  {
    name: 'Atlanta',
    slug: 'atlanta',
    airports: ['ATL'],
    primaryAirport: 'ATL',
    country: 'USA',
    region: 'North America',
    timezone: 'America/New_York',
    metaDescription: 'Cheap flights from Hartsfield-Jackson that others miss. Deals to Cancun, London, Paris & the Caribbean. We track ATL so you don\'t have to.',
    topDestinations: ['London', 'Paris', 'Cancun', 'Amsterdam', 'Rome'],
    bestDealSeason: 'January-March and September-November',
    airlines: ['Delta', 'Southwest', 'Spirit', 'Frontier'],
    avgSavings: '$430',
    stats: [
      { value: '93M+', label: 'passengers/year' },
      { value: '#1', label: 'busiest US airport' },
      { value: '150+', label: 'destinations' },
      { value: '$430', label: 'avg savings' },
    ],
    shortIntro: 'World\'s busiest airport. Delta\'s mega-hub means excellent deals.',
    intro: 'Hartsfield-Jackson (ATL) is the world\'s busiest airport, serving 93+ million passengers annually. As Delta\'s largest hub, it offers nonstops to nearly every continent. Competition with Southwest, Spirit, and Frontier on leisure routes keeps prices sharp—Cancun deals under $230 and London under $450 appear regularly.',
    popularRoutes: [
      { destination: 'London', code: 'LHR', typicalDeal: 449 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 479 },
      { destination: 'Cancun', code: 'CUN', typicalDeal: 229 },
      { destination: 'Amsterdam', code: 'AMS', typicalDeal: 459 },
    ],
    faqs: [
      {
        question: 'Does Atlanta get good international flight deals?',
        answer: 'Yes — Hartsfield-Jackson is Delta\'s largest hub, which means competitive pricing to Europe, the Caribbean, and Latin America. Nonstop deals to London, Paris, and Amsterdam appear several times per year.',
      },
      {
        question: 'When is the cheapest time to fly from Atlanta?',
        answer: 'January through March for Europe and international. September-November also sees good deals. For Caribbean, September-October (shoulder season) offers the best prices despite hurricane risk.',
      },
      {
        question: 'What are the best deal routes from Atlanta?',
        answer: 'Cancun is consistently the cheapest international destination. Caribbean islands (Jamaica, Puerto Rico) are also strong. For Europe, Dublin and London lead. Delta\'s hub status means more direct routes and competition.',
      },
      {
        question: 'Does Homebase Flights monitor Atlanta flights?',
        answer: 'We monitor Hartsfield-Jackson (ATL), which handles virtually all commercial flights for the Atlanta metro. It\'s the world\'s busiest airport with direct service to 150+ destinations.',
      },
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
    metaDescription: 'DFW & DAL flight deals to Cancun, London, Tokyo and 70+ destinations. Price drop alerts from both Dallas airports. Updated weekly.',
    topDestinations: ['Cancun', 'London', 'Tokyo', 'Paris', 'Hawaii'],
    bestDealSeason: 'January-February and September-October',
    airlines: ['American', 'Southwest', 'Spirit', 'Frontier'],
    avgSavings: '$390',
    stats: [
      { value: '73M+', label: 'passengers/year' },
      { value: '2', label: 'airports tracked' },
      { value: '60+', label: 'countries nonstop' },
      { value: '$390', label: 'avg savings' },
    ],
    shortIntro: 'American\'s largest hub. We track DFW and Love Field for the best deals.',
    intro: 'DFW is American Airlines\' largest hub, serving 73+ million passengers with nonstops to 60+ countries. Love Field (DAL) is Southwest\'s stronghold for domestic routes. We monitor both airports because Love Field often beats DFW by $50+ on leisure routes while DFW dominates international.',
    popularRoutes: [
      { destination: 'Cancun', code: 'CUN', typicalDeal: 229 },
      { destination: 'London', code: 'LHR', typicalDeal: 449 },
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 549 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 479 },
    ],
    faqs: [
      {
        question: 'Which Dallas airport has cheaper flights — DFW or Love Field?',
        answer: 'DFW has more international options and competition from multiple airlines. Love Field (DAL) is Southwest\'s stronghold and often wins for domestic routes. We monitor both so you see every deal.',
      },
      {
        question: 'When is the cheapest time to fly from Dallas?',
        answer: 'January-February and September-October offer the lowest fares. Avoid spring break (March), Thanksgiving, and Christmas. DFW\'s hub status means deals appear more frequently than at smaller airports.',
      },
      {
        question: 'What are the best deal routes from Dallas?',
        answer: 'Cancun dominates for leisure travel (often under $250 roundtrip). London, Tokyo, and Paris see competitive pricing because American Airlines competes aggressively from its DFW hub.',
      },
      {
        question: 'Does Homebase Flights track both Dallas airports?',
        answer: 'Yes — DFW and Dallas Love Field (DAL). American\'s hub at DFW and Southwest\'s hub at Love Field mean double the deal opportunities.',
      },
    ],
  },
  {
    name: 'Denver',
    slug: 'denver',
    airports: ['DEN'],
    primaryAirport: 'DEN',
    country: 'USA',
    region: 'North America',
    timezone: 'America/Denver',
    metaDescription: 'DEN deals to Cancun from $199, Hawaii from $299, Europe from $449. Get alerts when prices drop from Denver. No spam, just deals.',
    topDestinations: ['Cancun', 'London', 'Tokyo', 'Iceland', 'Hawaii'],
    bestDealSeason: 'January-February and September-October',
    airlines: ['United', 'Southwest', 'Frontier', 'Spirit'],
    avgSavings: '$380',
    stats: [
      { value: '69M+', label: 'passengers/year' },
      { value: '#3', label: 'busiest US airport' },
      { value: '200+', label: 'destinations' },
      { value: '$380', label: 'avg savings' },
    ],
    shortIntro: 'Third-busiest US airport. United & Frontier hub with growing international service.',
    intro: 'Denver International (DEN) is the third-busiest US airport, serving 69+ million passengers. United and Frontier both hub here, creating competition that keeps prices sharp. International service is expanding rapidly—nonstops to London, Tokyo, and Reykjavik have added deal opportunities. Mexico and Hawaii routes see frequent sub-$300 deals.',
    popularRoutes: [
      { destination: 'Cancun', code: 'CUN', typicalDeal: 249 },
      { destination: 'London', code: 'LHR', typicalDeal: 479 },
      { destination: 'Honolulu', code: 'HNL', typicalDeal: 349 },
      { destination: 'Reykjavik', code: 'KEF', typicalDeal: 379 },
    ],
    faqs: [
      {
        question: 'When is the cheapest time to fly from Denver?',
        answer: 'January-February and September-October have the lowest fares. Ski season (December-March) drives up prices to mountain destinations but can mean cheaper flights to warm-weather spots.',
      },
      {
        question: 'What are the best deal routes from Denver?',
        answer: 'Cancun and Mexico beach towns are consistently cheap. Hawaii deals appear several times per year under $350 roundtrip. London and Iceland also see competitive fares thanks to Frontier and United.',
      },
      {
        question: 'How far in advance should I book from Denver?',
        answer: 'For domestic, 1-3 months works well. For international, 2-5 months. DEN is United and Frontier\'s hub, so competition keeps prices sharp. Frontier flash sales appear with just days\' notice.',
      },
      {
        question: 'Does Homebase Flights work for Denver?',
        answer: 'Yes — we monitor Denver International (DEN) across all airlines. DEN is the third-busiest US airport with growing international service, meaning more deal opportunities every year.',
      },
    ],
  },
  {
    name: 'Boston',
    slug: 'boston',
    airports: ['BOS'],
    primaryAirport: 'BOS',
    country: 'USA',
    region: 'North America',
    timezone: 'America/New_York',
    metaDescription: 'Cheap flights from Boston (BOS): Dublin $289, London $349, Paris $389, San Juan $149. 50+ airlines, 140+ destinations. Get deal alerts from Logan Airport.',
    topDestinations: ['Dublin', 'London', 'Reykjavik', 'Paris', 'Cancun', 'Lisbon', 'Rome'],
    bestDealSeason: 'January-March and October-November',
    airlines: ['JetBlue', 'Delta', 'American', 'United', 'Aer Lingus', 'Icelandair', 'TAP Portugal', 'British Airways', 'Virgin Atlantic'],
    avgSavings: '$410',
    stats: [
      { value: '45M+', label: 'passengers/year' },
      { value: '6+', label: 'daily Dublin flights' },
      { value: '140+', label: 'destinations' },
      { value: '$410', label: 'avg savings' },
    ],
    shortIntro: 'New England\'s largest airport. Excellent transatlantic deals via Aer Lingus & JetBlue.',
    intro: 'Boston Logan (BOS) serves 45+ million passengers with 50+ airlines to 140+ destinations. JetBlue treats Boston as a focus city with 100+ daily departures. Aer Lingus operates 6+ daily Dublin nonstops—making it consistently the cheapest European route (under $350 roundtrip). Icelandair connects to 30+ European cities via Reykjavik, often $200+ cheaper than direct flights. TAP Portugal adds Lisbon connections. JetBlue and Delta compete on Caribbean routes with sub-$150 roundtrips to San Juan appearing monthly.',
    popularRoutes: [
      { destination: 'Dublin', code: 'DUB', typicalDeal: 289 },
      { destination: 'London', code: 'LHR', typicalDeal: 349 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 389 },
      { destination: 'Reykjavik', code: 'KEF', typicalDeal: 249 },
      { destination: 'Lisbon', code: 'LIS', typicalDeal: 329 },
      { destination: 'San Juan', code: 'SJU', typicalDeal: 149 },
      { destination: 'Cancun', code: 'CUN', typicalDeal: 249 },
      { destination: 'Rome', code: 'FCO', typicalDeal: 419 },
    ],
    faqs: [
      {
        question: 'What is the cheapest flight from Boston right now?',
        answer: 'The cheapest international flights from Boston are typically to Dublin ($289-$379 roundtrip), Reykjavik ($249-$349), and Caribbean destinations like San Juan ($149-$199). Domestic deals to Florida often drop below $100 roundtrip. Prices change daily—we send alerts when fares drop significantly below normal.',
      },
      {
        question: 'When is the best time to fly from Boston?',
        answer: 'January through March offers the lowest fares from Boston—often 30-40% cheaper than summer. October and early November are also excellent. Avoid June through August when student travel and tourism drive prices up 40-60%, and watch out for college move-in weekends in late August when domestic fares spike. Tuesday and Wednesday departures are typically 10-15% cheaper than weekends.',
      },
      {
        question: 'Why is Dublin so cheap from Boston?',
        answer: 'Aer Lingus operates 6+ daily nonstops between BOS and Dublin, creating fierce competition with other carriers. The large Irish-American population in Boston (20% of the metro area claims Irish ancestry) drives consistent year-round demand, and airlines price aggressively to fill seats. Dublin also serves as a budget gateway to the rest of Europe—you can connect to 100+ cities on low-cost carriers after clearing US preclearance in Dublin.',
      },
      {
        question: 'Does JetBlue have good deals from Boston?',
        answer: 'Yes—JetBlue operates 100+ daily flights from Boston, treating it as a focus city. They run frequent sales on Caribbean routes (San Juan, Cancun, Turks & Caicos) and have expanded transatlantic service to London Gatwick, Paris, and Amsterdam. Their Mint business class occasionally drops to $1,200-$1,500 roundtrip to London—a fraction of competitors\' $4,000+ prices.',
      },
      {
        question: 'How many airlines fly from Boston Logan?',
        answer: 'Boston Logan hosts 50+ airlines serving 140+ destinations. Major carriers include JetBlue (largest presence), Delta, American, United, Southwest, and Spirit for domestic. For international, Aer Lingus, British Airways, Virgin Atlantic, Icelandair, TAP Portugal, Lufthansa, and many others offer nonstop service to Europe, the Caribbean, and beyond.',
      },
      {
        question: 'How far in advance should I book flights from Boston?',
        answer: 'For Europe, 2-4 months ahead works well. For Caribbean, 6-10 weeks. For domestic, 3-6 weeks. However, mistake fares and flash sales break these rules—we\'ve seen BOS to Dublin for under $250 roundtrip with 48 hours\' notice. Setting up alerts means you catch these deals before they\'re fixed or sell out.',
      },
      {
        question: 'What are the best destinations from Boston?',
        answer: 'For value, Dublin and Reykjavik consistently offer the cheapest European fares. Lisbon via TAP Portugal is excellent for Southern Europe. Caribbean islands (San Juan, Aruba, St. Maarten) are strong from Boston. For domestic, Florida (Fort Lauderdale, Tampa, Miami) sees constant competition and sub-$100 deals. Hawaii is possible with connections through JFK or Chicago.',
      },
      {
        question: 'Is Boston a good airport for cheap international flights?',
        answer: 'Yes—Boston consistently ranks among the top 10 US airports for transatlantic deals. The combination of JetBlue\'s European expansion, Aer Lingus\'s Dublin hub, Icelandair\'s connections, and TAP Portugal\'s Lisbon route creates more competition than most US cities outside NYC. Average savings on international flights from BOS: $410 per trip vs. booking without deal alerts.',
      },
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
    metaDescription: 'SEA deals to Alaska from $149, Tokyo from $499, Hawaii from $249. Get alerts when prices drop from Seattle. No spam, just deals.',
    topDestinations: ['Tokyo', 'London', 'Reykjavik', 'Hawaii', 'Alaska'],
    bestDealSeason: 'January-February and September-October',
    airlines: ['Alaska Airlines', 'Delta', 'United', 'Icelandair'],
    avgSavings: '$370',
    stats: [
      { value: '50M+', label: 'passengers/year' },
      { value: '<$200', label: 'Alaska roundtrips' },
      { value: '90+', label: 'destinations' },
      { value: '$370', label: 'avg savings' },
    ],
    shortIntro: 'Alaska Airlines hub. Strong Asia routes and cheap Hawaii & Alaska deals.',
    intro: 'Seattle-Tacoma (SEA) serves 50+ million passengers as Alaska Airlines\' hub. Strong transpacific service to Tokyo, Seoul, and Taipei competes with LAX and SFO. Alaska routes (Anchorage, Juneau) see sub-$200 roundtrips regularly. Hawaii is excellent via Alaska Airlines. Icelandair connects to 30+ European cities via Reykjavik at budget prices.',
    popularRoutes: [
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 499 },
      { destination: 'Honolulu', code: 'HNL', typicalDeal: 329 },
      { destination: 'Reykjavik', code: 'KEF', typicalDeal: 349 },
      { destination: 'London', code: 'LHR', typicalDeal: 479 },
    ],
    faqs: [
      {
        question: 'When is the cheapest time to fly from Seattle?',
        answer: 'January-February and September-October offer the lowest fares. Alaska routes are cheapest in shoulder seasons (May, September). Avoid summer and holiday periods.',
      },
      {
        question: 'What are the best deal routes from Seattle?',
        answer: 'Alaska (Anchorage, Juneau) is a standout at sub-$200 roundtrips. Hawaii is excellent via Alaska Airlines. Tokyo sees deals under $500. Reykjavik via Icelandair opens cheap European connections.',
      },
      {
        question: 'Does Seattle get good deals to Asia?',
        answer: 'Yes — Sea-Tac has strong transpacific service. Delta, Alaska Airlines, and Asian carriers fly nonstop to Tokyo, Seoul, Taipei, and Shanghai. Competition keeps fares competitive with LAX and SFO.',
      },
      {
        question: 'Does Homebase Flights track Sea-Tac?',
        answer: 'Yes — we monitor Seattle-Tacoma International (SEA) across all airlines. Alaska Airlines\' hub presence means frequent sales, especially to Hawaii and Alaska.',
      },
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
    metaDescription: 'MIA & FLL deals to Caribbean from $99, Europe from $349, South America from $249. Alerts when prices drop from Miami. No spam, just deals.',
    topDestinations: ['Cancun', 'Bogota', 'Madrid', 'London', 'Caribbean Islands'],
    bestDealSeason: 'September-November (hurricane shoulder season)',
    airlines: ['American', 'Spirit', 'JetBlue', 'LATAM', 'Avianca'],
    avgSavings: '$360',
    stats: [
      { value: '52M+', label: 'passengers/year' },
      { value: '2', label: 'airports tracked' },
      { value: '<$100', label: 'Caribbean deals' },
      { value: '$360', label: 'avg savings' },
    ],
    shortIntro: 'Gateway to Latin America & Caribbean. Spirit & JetBlue budget deals daily.',
    intro: 'Miami (MIA) and Fort Lauderdale (FLL) serve as gateways to Latin America and the Caribbean, handling 52+ million passengers combined. American operates a major hub at MIA while Spirit and JetBlue dominate FLL. Caribbean roundtrips under $100 appear regularly. South America via LATAM and Avianca, and Europe via Iberia/Level to Madrid, see frequent deals.',
    popularRoutes: [
      { destination: 'Cancun', code: 'CUN', typicalDeal: 179 },
      { destination: 'Bogota', code: 'BOG', typicalDeal: 249 },
      { destination: 'Madrid', code: 'MAD', typicalDeal: 399 },
      { destination: 'San Juan', code: 'SJU', typicalDeal: 149 },
    ],
    faqs: [
      {
        question: 'Which Miami-area airport has cheaper flights?',
        answer: 'MIA has more international options, especially to Latin America. Fort Lauderdale (FLL) is Spirit and JetBlue\'s stronghold with often lower base fares to the Caribbean and domestic routes. We track both.',
      },
      {
        question: 'When is the cheapest time to fly from Miami?',
        answer: 'September through November (hurricane shoulder season) has the lowest fares. January-March is peak tourist season with higher prices. For Caribbean, late summer offers deep discounts.',
      },
      {
        question: 'What are the cheapest destinations from Miami?',
        answer: 'Caribbean islands dominate — roundtrips under $100 to San Juan, Nassau, and Jamaica appear regularly. Colombia, Costa Rica, and Mexico are also cheap. Madrid is the best European deal route from MIA.',
      },
      {
        question: 'Does Homebase Flights cover both Miami airports?',
        answer: 'Yes — Miami International (MIA) and Fort Lauderdale (FLL). With Spirit, JetBlue, and LATAM airlines competing in South Florida, deals appear more frequently than at most US airports.',
      },
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
    metaDescription: 'YYZ & YTZ flight deals to London, Cancun, New York and 60+ destinations. Price drop alerts from both Toronto airports. Updated weekly.',
    topDestinations: ['London', 'Dublin', 'Paris', 'Cancun', 'Reykjavik'],
    bestDealSeason: 'January-March and October-November',
    airlines: ['Air Canada', 'WestJet', 'Porter', 'Flair'],
    avgSavings: '$400',
    stats: [
      { value: '50M+', label: 'passengers/year' },
      { value: '2', label: 'airports tracked' },
      { value: '180+', label: 'destinations' },
      { value: 'CA$400', label: 'avg savings' },
    ],
    shortIntro: 'Canada\'s busiest airport. Air Canada, WestJet & Porter deals daily.',
    intro: 'Toronto Pearson (YYZ) is Canada\'s busiest airport, serving 50+ million passengers to 180+ destinations. Air Canada, WestJet, Porter, and Flair compete on most routes. Billy Bishop (YTZ) downtown adds convenience for US and Canadian cities. London and Dublin see the best European deals. Caribbean destinations (Cancun, Cuba, Dominican Republic) are standouts for winter escapes.',
    popularRoutes: [
      { destination: 'London', code: 'LHR', typicalDeal: 449 },
      { destination: 'Cancun', code: 'CUN', typicalDeal: 329 },
      { destination: 'Reykjavik', code: 'KEF', typicalDeal: 349 },
      { destination: 'Dublin', code: 'DUB', typicalDeal: 399 },
    ],
    faqs: [
      {
        question: 'When is the cheapest time to fly from Toronto?',
        answer: 'January through March and October-November have the best fares. Avoid summer (June-August) and Christmas when snowbird travel and holiday demand push prices up.',
      },
      {
        question: 'What are the best deal routes from Toronto?',
        answer: 'London (via Air Canada and WestJet) is consistently the cheapest European route. Cancun, Cuba, and the Dominican Republic lead for Caribbean. Reykjavik via Icelandair offers budget European connections.',
      },
      {
        question: 'Does Toronto get competitive flight deals?',
        answer: 'Yes — YYZ is Canada\'s largest airport with strong competition between Air Canada, WestJet, Porter, and Flair. Porter at Billy Bishop (YTZ) adds budget options for US and Canadian cities.',
      },
      {
        question: 'Does Homebase Flights track both Toronto airports?',
        answer: 'Yes — Pearson (YYZ) and Billy Bishop (YTZ). Porter\'s growing route network at YTZ means more deal opportunities for downtown Toronto residents.',
      },
    ],
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
