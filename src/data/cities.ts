export interface PopularRoute {
  destination: string
  code: string
  typicalDeal: number
}

export interface CityFAQ {
  question: string
  answer: string
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
  intro?: string
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
    intro: 'Heathrow, Gatwick, Stansted, Luton—four major airports with endless options. We track them all for deals to the Americas, Asia, and beyond.',
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
    intro: 'JFK, Newark, and LaGuardia serve 130+ million passengers yearly. We track deals from all three so you never miss a fare drop to Europe, the Caribbean, or Asia.',
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
    intro: 'LAX is the gateway to the Pacific. We monitor flights to Tokyo, Sydney, Bangkok, and 200+ destinations daily from all LA-area airports.',
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
    intro: "O'Hare is a major international hub with nonstops to 60+ countries. Midway adds budget options. We track both for the best deals.",
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
    metaDescription: 'SFO deals to Tokyo from $489, Hawaii from $199, Europe from $449. Get alerts when prices drop from San Francisco. No spam, just deals.',
    topDestinations: ['Tokyo', 'Seoul', 'Paris', 'Honolulu', 'London'],
    bestDealSeason: 'January-February and October-November',
    airlines: ['United', 'Alaska Airlines', 'Delta', 'Japan Airlines', 'ANA'],
    avgSavings: '$420',
    intro: 'San Francisco International (SFO) is the Bay Area\'s gateway to Asia and the Pacific. United operates SFO as a major hub, running nonstops to Tokyo, Seoul, Singapore, and a dozen other Asian cities—creating real competition with Asian carriers like Japan Airlines, ANA, and Korean Air. This competition is why transpacific deals from SFO are among the best in the country, with sub-$500 roundtrips to Japan appearing multiple times per year. Hawaii is another sweet spot: Southwest, Hawaiian, Alaska, and United all compete on the route, pushing prices below $200 regularly. We also monitor Oakland (OAK) and San Jose (SJC)—Southwest\'s presence at both airports means deals that don\'t show up on standard flight search engines. For Europe, SFO\'s nonstop options to London, Paris, and Dublin have expanded significantly, with Norwegian and budget-friendly options keeping legacy carriers honest.',
    popularRoutes: [
      { destination: 'Tokyo', code: 'NRT', typicalDeal: 489 },
      { destination: 'Seoul', code: 'ICN', typicalDeal: 519 },
      { destination: 'Honolulu', code: 'HNL', typicalDeal: 199 },
      { destination: 'Paris', code: 'CDG', typicalDeal: 449 },
      { destination: 'Cabo San Lucas', code: 'SJD', typicalDeal: 229 },
    ],
    faqs: [
      {
        question: 'Why does San Francisco have such good deals to Japan?',
        answer: 'SFO is a major United hub with extensive transpacific service. Japan Airlines, ANA, and United all operate nonstops to Tokyo—and Korean Air, Asiana, and others connect through Seoul. This competition keeps prices sharp. We regularly see SFO to Tokyo roundtrips under $500, and mistake fares occasionally drop to $300 range.',
      },
      {
        question: 'Should I fly from SFO, Oakland, or San Jose?',
        answer: 'It depends on the route. SFO dominates for international flights and has the most options. Oakland (OAK) is Southwest\'s Bay Area hub with strong domestic deals and less congestion. San Jose (SJC) is good for Southwest and Alaska routes. We track all three so you see the best price regardless of airport—sometimes OAK undercuts SFO by $100+ on the same route.',
      },
      {
        question: 'When\'s the cheapest time to fly from San Francisco to Hawaii?',
        answer: 'January through mid-March and mid-September through November offer the lowest fares. Four airlines compete on the route (Southwest, Hawaiian, Alaska, United), so sub-$200 roundtrips are common. Avoid spring break, summer, and December when Bay Area families flood the islands.',
      },
      {
        question: 'How competitive are SFO deals to Europe?',
        answer: 'Improving steadily. United, British Airways, Air France, and Aer Lingus all operate nonstops. French Bee (budget) runs Paris-SFO with fares starting around $400 roundtrip. London, Paris, and Dublin are the strongest routes. Deals under $500 roundtrip appear several times per year—less frequently than from JFK, but the gap is closing.',
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
    intro: 'Dubai International is the world\'s busiest airport for international passengers. Emirates, Flydubai, and Air Arabia mean deals to Europe, Asia, and Africa year-round.',
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
    intro: 'Singapore Changi (SIN) is consistently rated the world\'s best airport—and it\'s also one of the best for finding flight deals. The presence of Scoot (Singapore Airlines\' budget arm) and AirAsia creates fierce competition on regional routes, pushing Bangkok, Kuala Lumpur, and Bali fares below $100 roundtrip regularly. For longer routes, Singapore Airlines runs periodic sales that slash Tokyo and Sydney fares by 40%. Changi\'s position as a global connecting hub also means excellent positioning for Europe—the famous Singapore-London route sees sub-$600 deals several times per year. Japan has become particularly accessible, with both full-service and budget options keeping Tokyo and Osaka competitive. We track all carriers from SIN because deals here move fast—Scoot flash sales often sell out in hours.',
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
    intro: 'Hong Kong International is a gateway to Asia and beyond. Cathay Pacific\'s hub plus budget carriers like HK Express mean deals to Japan, Southeast Asia, and Europe.',
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
    intro: 'Sydney\'s Kingsford Smith is Australia\'s busiest airport. Qantas, Virgin Australia, and Jetstar connect you to Asia, the Pacific, and beyond.',
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
    intro: 'Hartsfield-Jackson is the world\'s busiest airport with nonstops to nearly every continent. Delta\'s mega-hub means excellent Europe and Caribbean deals.',
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
    intro: 'DFW is American Airlines\' largest hub with nonstops to 60+ countries. Love Field adds Southwest\'s domestic network. We track both for the best deals.',
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
    intro: 'Denver International is the third-busiest US airport and a hub for United and Frontier. Growing international service means more deal opportunities every year.',
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
    metaDescription: 'BOS deals to Dublin from $379, London from $429, Caribbean from $199. Get alerts when prices drop from Boston Logan. No spam, just deals.',
    topDestinations: ['Dublin', 'London', 'Reykjavik', 'Paris', 'Cancun'],
    bestDealSeason: 'January-March and October-November',
    airlines: ['JetBlue', 'Delta', 'American', 'United', 'Aer Lingus', 'Icelandair'],
    avgSavings: '$410',
    intro: 'Boston Logan International (BOS) punches above its weight for transatlantic deals. JetBlue treats Boston as a focus city, running competitive fares to London, Paris, and the Caribbean. Aer Lingus operates multiple daily nonstops to Dublin—making it consistently the cheapest European destination from Boston, often under $400 roundtrip. Icelandair\'s Reykjavik connection opens budget routes to 30+ European cities via quick layovers. For warm-weather escapes, JetBlue and Delta compete aggressively on Florida and Caribbean routes, with sub-$200 roundtrips to Fort Lauderdale and San Juan appearing regularly. The airport\'s compact size also means fewer delays than JFK or Newark. We monitor BOS around the clock because deals from Logan tend to disappear fast—New England travelers know a good fare when they see one.',
    popularRoutes: [
      { destination: 'Dublin', code: 'DUB', typicalDeal: 379 },
      { destination: 'London', code: 'LHR', typicalDeal: 429 },
      { destination: 'Reykjavik', code: 'KEF', typicalDeal: 299 },
      { destination: 'Cancun', code: 'CUN', typicalDeal: 279 },
      { destination: 'San Juan', code: 'SJU', typicalDeal: 179 },
    ],
    faqs: [
      {
        question: 'What\'s the cheapest time to fly from Boston to Europe?',
        answer: 'January through March offers the lowest transatlantic fares from BOS—often 30-40% cheaper than summer. October and early November are also strong. Avoid June through August when student travel and tourism drive prices up, and watch out for college move-in weekends in late August when domestic fares spike.',
      },
      {
        question: 'Why is Dublin so cheap from Boston?',
        answer: 'Aer Lingus operates multiple daily nonstops between BOS and Dublin, creating strong competition. Add in the large Irish-American population in Boston driving consistent demand year-round, and airlines price aggressively to fill seats. Dublin also serves as a budget gateway to the rest of Europe with short connections.',
      },
      {
        question: 'Does JetBlue have good deals from Boston?',
        answer: 'JetBlue treats Boston as a focus city (not quite a hub, but close). They run frequent sales on Caribbean routes (especially San Juan, Cancun, and Turks & Caicos) and have expanded transatlantic service to London Gatwick and Paris. Their Mint business class occasionally drops to $1,200 roundtrip to London—a fraction of competitors.',
      },
      {
        question: 'How far in advance should I book flights from Boston?',
        answer: 'For Europe, 2-4 months ahead works well. For Caribbean, 6-10 weeks. For domestic, 3-6 weeks. Mistake fares break all rules—we\'ve seen BOS to Dublin for under $250 with 48 hours\' notice. Setting up alerts means you catch these before they\'re fixed.',
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
    intro: 'Sea-Tac has strong Asia routes and Alaska Airlines\' hub means great Hawaii deals. Icelandair offers cheap Europe connections via Reykjavik.',
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
    intro: 'Miami and Fort Lauderdale are gateways to Latin America and the Caribbean. Spirit and budget carriers mean frequent sub-$200 deals.',
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
    intro: 'Pearson is Canada\'s busiest airport with Air Canada, WestJet, and Porter competing on routes to Europe, the Caribbean, and the US. Billy Bishop adds downtown convenience.',
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
