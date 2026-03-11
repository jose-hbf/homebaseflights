#!/usr/bin/env node

// Script to update existing deals with fresh dates
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mofcecngtooafabaldca.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const destinations = [
  { destination: 'Paris', destination_code: 'CDG', country: 'France', price: 297 },
  { destination: 'Montego Bay', destination_code: 'MBJ', country: 'Jamaica', price: 401 },
  { destination: 'Rome', destination_code: 'FCO', country: 'Italy', price: 448 },
  { destination: 'Barcelona', destination_code: 'BCN', country: 'Spain', price: 538 },
  { destination: 'Amsterdam', destination_code: 'AMS', country: 'Netherlands', price: 605 },
  { destination: 'Dubai', destination_code: 'DXB', country: 'UAE', price: 880 },
  { destination: 'London', destination_code: 'LHR', country: 'UK', price: 535 },
  { destination: 'Tokyo', destination_code: 'NRT', country: 'Japan', price: 1061 },
  { destination: 'Bangkok', destination_code: 'BKK', country: 'Thailand', price: 1130 },
  { destination: 'Athens', destination_code: 'ATH', country: 'Greece', price: 1156 },
];

const airlines = ['American Airlines', 'Delta', 'JetBlue', 'United', 'Virgin Atlantic', 'British Airways', 'KLM', 'Air France'];
const airports = ['JFK', 'LGA', 'EWR'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const main = async () => {
  console.log('🔄 Creating fresh deals with today\'s date...');

  const today = new Date();
  const todayISO = today.toISOString();

  // Departure dates: 1-4 weeks from now
  const departureDates = [];
  for (let i = 7; i <= 28; i += 7) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    departureDates.push(date.toISOString().split('T')[0]);
  }

  const freshDeals = destinations.map((dest, index) => {
    const departureDate = getRandomElement(departureDates);
    const returnDate = (() => {
      const dep = new Date(departureDate);
      dep.setDate(dep.getDate() + 7); // 1 week trip
      return dep.toISOString().split('T')[0];
    })();

    return {
      destination: dest.destination,
      destination_code: dest.destination_code,
      country: dest.country,
      price: dest.price + Math.floor(Math.random() * 100) - 50, // Vary price slightly
      departure_date: departureDate,
      return_date: returnDate,
      airline: getRandomElement(airlines),
      airline_code: getRandomElement(airlines).substring(0, 3).toUpperCase(),
      duration_minutes: Math.floor(Math.random() * 600) + 300, // 5-15 hours
      stops: Math.random() < 0.3 ? 1 : 0, // 30% chance of 1 stop
      booking_link: `https://www.google.com/travel/flights/booking?${Math.random().toString(36)}`,
      departure_airport: getRandomElement(airports),
      city_slug: 'new-york',
      fetched_at: todayISO,
      created_at: todayISO
    };
  });

  try {
    // Delete old deals first
    console.log('🗑️  Removing old deals...');
    const { error: deleteError } = await supabase
      .from('flight_deals')
      .delete()
      .eq('city_slug', 'new-york');

    if (deleteError) {
      console.error('❌ Error deleting old deals:', deleteError.message);
    } else {
      console.log('✅ Old deals removed');
    }

    // Insert fresh deals
    console.log('💾 Inserting fresh deals...');
    const { data, error } = await supabase
      .from('flight_deals')
      .insert(freshDeals);

    if (error) throw error;

    console.log(`✅ Successfully created ${freshDeals.length} fresh deals!`);

    // Show the deals
    console.log('\n🎯 Fresh deals created:');
    freshDeals.forEach((deal, i) => {
      console.log(`  ${i + 1}. ${deal.destination} (${deal.destination_code}): $${deal.price}`);
      console.log(`      ${deal.departure_date} - ${deal.return_date} via ${deal.departure_airport}`);
    });

    console.log('\n🎉 Success! Users will now receive fresh deals in their emails.');
    console.log('✉️  To send emails immediately, run: curl -X POST https://homebaseflights.com/api/cron/send-trial-deals -H "Authorization: Bearer 63694aa6e60a6ce8a0d6b9a2553f894daa96674bd70fc1541c73a174d723968d"');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

main();