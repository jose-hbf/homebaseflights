#!/usr/bin/env node

// Simple script to force fetch new deals using SerpAPI fallback
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mofcecngtooafabaldca.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs';
const SERPAPI_KEY = 'b047d02275c43ffcbf2d4876662092b5adc99b59a329ec442c3593ebaef1a5a5';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const fetchFlightDeals = async (airport) => {
  return new Promise((resolve, reject) => {
    const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=${airport}&outbound_date=2026-03-20&return_date=2026-03-27&currency=USD&hl=en&api_key=${SERPAPI_KEY}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const deals = [];

          if (json.best_flights) {
            json.best_flights.forEach(flight => {
              if (flight.price && flight.flights && flight.flights[0]) {
                const firstFlight = flight.flights[0];
                deals.push({
                  destination: firstFlight.arrival_airport?.name || 'Unknown',
                  destinationCode: firstFlight.arrival_airport?.id || 'XXX',
                  country: firstFlight.arrival_airport?.name || 'Unknown',
                  price: flight.price,
                  departureDate: flight.departure_token?.outbound_date || '2026-03-20',
                  returnDate: flight.departure_token?.return_date || '2026-03-27',
                  airline: firstFlight.airline || 'Unknown',
                  airlineCode: firstFlight.airline_logo || '',
                  durationMinutes: flight.total_duration || 0,
                  stops: flight.flights?.length - 1 || 0,
                  bookingLink: `https://www.google.com/travel/flights/search?${flight.departure_token || ''}`,
                  departureAirport: airport,
                  fetchedAt: new Date().toISOString()
                });
              }
            });
          }

          resolve(deals);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const main = async () => {
  console.log('🚀 Emergency fetch of NYC deals using SerpAPI...');

  const NYC_AIRPORTS = ['JFK', 'LGA', 'EWR'];
  const allDeals = [];

  for (const airport of NYC_AIRPORTS) {
    try {
      console.log(`📍 Fetching from ${airport}...`);
      const deals = await fetchFlightDeals(airport);
      allDeals.push(...deals);
      console.log(`✅ Found ${deals.length} deals from ${airport}`);

      // Rate limit
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`❌ Error fetching ${airport}:`, error.message);
    }
  }

  console.log(`📊 Total deals found: ${allDeals.length}`);

  if (allDeals.length === 0) {
    console.log('❌ No deals found');
    return;
  }

  // Filter international deals only
  const internationalDeals = allDeals.filter(deal =>
    deal.price <= 1000 &&
    deal.destination !== 'Unknown' &&
    !deal.destination.toLowerCase().includes('united states')
  );

  console.log(`🌍 International deals: ${internationalDeals.length}`);

  // Insert into database
  const dealsToInsert = internationalDeals.map(deal => ({
    destination: deal.destination,
    destination_code: deal.destinationCode,
    country: deal.country,
    price: parseInt(deal.price),
    departure_date: deal.departureDate,
    return_date: deal.returnDate,
    airline: deal.airline,
    airline_code: deal.airlineCode,
    duration_minutes: deal.durationMinutes,
    stops: deal.stops,
    booking_link: deal.bookingLink,
    departure_airport: deal.departureAirport,
    city_slug: 'new-york',
    fetched_at: deal.fetchedAt,
    created_at: new Date().toISOString()
  }));

  if (dealsToInsert.length > 0) {
    try {
      const { data, error } = await supabase
        .from('flight_deals')
        .insert(dealsToInsert);

      if (error) throw error;

      console.log(`✅ Successfully saved ${dealsToInsert.length} deals to database`);
      console.log('🎉 Fresh deals are now available for emails!');

      // Show sample deals
      console.log('\n📋 Sample deals:');
      dealsToInsert.slice(0, 5).forEach((deal, i) => {
        console.log(`  ${i + 1}. ${deal.destination}: $${deal.price}`);
      });

    } catch (error) {
      console.error('❌ Error saving deals:', error.message);
    }
  }
};

main().catch(console.error);