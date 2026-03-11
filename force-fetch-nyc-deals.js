#!/usr/bin/env node

// Force fetch NYC deals script - emergency solution
const path = require('path');

// Mock the Next.js environment
const mockNextEnv = () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mofcecngtooafabaldca.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs';
  process.env.SERPAPI_API_KEY = 'b047d02275c43ffcbf2d4876662092b5adc99b59a329ec442c3593ebaef1a5a5';
};

const main = async () => {
  console.log('🔄 Force fetching fresh NYC deals...');

  mockNextEnv();

  try {
    // Dynamic imports to avoid Next.js issues
    const { getFlightDeals } = await import('./src/lib/amadeus.js');
    const {
      saveFlightDealsImproved,
      filterNYCDeals,
      logDealSync,
      cleanOldDeals,
      supabaseAdmin,
    } = await import('./src/lib/supabase-improved.js');
    const { isValuableDestination, getDestinationScore } = await import('./src/lib/destination-filters.js');

    const NYC_AIRPORTS = ['JFK', 'EWR', 'LGA'];
    const citySlug = 'new-york';

    console.log(`🏁 Starting fetch for airports: ${NYC_AIRPORTS.join(', ')}`);

    // Fetch deals from all NYC airports
    const allDeals = [];

    for (const airport of NYC_AIRPORTS) {
      try {
        console.log(`\n📍 Fetching deals from ${airport}...`);
        const deals = await getFlightDeals(airport);

        const dealsWithAirport = deals.map(d => ({
          ...d,
          departureAirport: airport
        }));

        allDeals.push(...dealsWithAirport);
        console.log(`✅ Found ${deals.length} deals from ${airport}`);

        // Rate limiting
        if (NYC_AIRPORTS.indexOf(airport) < NYC_AIRPORTS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ Failed to fetch from ${airport}:`, error.message);
      }
    }

    console.log(`\n📊 Total raw deals found: ${allDeals.length}`);

    if (allDeals.length === 0) {
      console.log('❌ No deals found, exiting');
      return;
    }

    // Filter by destination quality
    const qualityDeals = allDeals.filter(deal => {
      return isValuableDestination(deal.destination, deal.destinationCode, deal.country);
    });

    console.log(`🔍 After quality filter: ${qualityDeals.length} deals`);

    // Apply NYC-specific international filters
    const filterResult = filterNYCDeals(qualityDeals, {
      internationalOnly: true,
      maxPriceEurope: 900,
      maxPriceAsia: 1100,
      maxPriceLatam: 600,
      maxPriceCaribbean: 600,
      maxPriceDefault: 700,
      minFlightHours: 3,
      minDiscountPercent: 20
    });

    const internationalDeals = filterResult.deals;
    console.log(`🌍 After international filter: ${internationalDeals.length} deals`);

    if (internationalDeals.length === 0) {
      console.log('❌ No deals passed filters');
      return;
    }

    // Score and rank deals
    const scoredDeals = internationalDeals.map(deal => ({
      ...deal,
      destinationScore: getDestinationScore(deal.destination, deal.destinationCode, deal.country)
    })).sort((a, b) => {
      if (b.destinationScore !== a.destinationScore) {
        return b.destinationScore - a.destinationScore;
      }
      return a.price - b.price;
    });

    console.log('\n🏆 Top 10 destinations:');
    scoredDeals.slice(0, 10).forEach((d, i) => {
      console.log(`  ${i + 1}. ${d.destination}: $${d.price} (score: ${d.destinationScore})`);
    });

    // Save deals
    console.log('\n💾 Saving deals...');
    const saveResult = await saveFlightDealsImproved('NYC', citySlug, scoredDeals);

    console.log(`✅ Save results:`, {
      saved: saveResult.inserted,
      updated: saveResult.updated,
      failed: saveResult.errors,
      successRate: `${Math.round((saveResult.inserted / scoredDeals.length) * 100)}%`
    });

    // Log sync results
    await logDealSync({
      city: citySlug,
      timestamp: new Date().toISOString(),
      attempted: scoredDeals.length,
      saved: saveResult.inserted,
      failed: saveResult.errors,
      errors: saveResult.errorDetails.slice(0, 5).map(e => e.error),
      duration_ms: 0
    });

    // Clean old deals
    const deleted = await cleanOldDeals();
    console.log(`🧹 Cleaned ${deleted} old deals`);

    console.log('\n🎉 Fresh NYC deals fetched successfully!');
    console.log('✉️  Users will now receive updated deals in their next email');

  } catch (error) {
    console.error('❌ Critical error:', error);
    process.exit(1);
  }
};

main();