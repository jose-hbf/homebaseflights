const { Resend } = require('resend');

const resend = new Resend('re_fePHN6d7_GDJGcjeQhxWRJFb8mq5HtGUJ');

async function sendTrialEmail() {
  // Get best deals for New York
  const dealsResponse = await fetch(
    'https://mofcecngtooafabaldca.supabase.co/rest/v1/flight_deals?city_slug=eq.new-york&order=price.asc&limit=15',
    {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmNlY25ndG9vYWZhYmFsZGNhIiwicm9sZSI6InNlcnZpY2Vfc2VydmljZSIsImlhdCI6MTc2OTQ0ODg3NiwiZXhwIjoyMDg1MDI0ODc2fQ.COjttKdRU8cbTMFJUbDvNLkrpvDxNAZqhPP3n7r61Bs'
      }
    }
  );

  const allDeals = await dealsResponse.json();

  // Check if we got valid data
  if (!Array.isArray(allDeals)) {
    console.error('No deals found or invalid response');
    return;
  }

  // Filter for valuable destinations and deduplicate
  const valuableDestinations = [
    'London', 'Paris', 'Rome', 'Barcelona', 'Amsterdam', 'Dublin', 'Madrid', 'Lisbon',
    'Tokyo', 'Bangkok', 'Singapore', 'Hong Kong', 'Seoul', 'Bali', 'Dubai',
    'Los Angeles', 'Miami', 'Las Vegas', 'Honolulu', 'San Francisco', 'Chicago',
    'Cancun', 'Mexico City', 'San José', 'Lima', 'Buenos Aires', 'São Paulo'
  ];

  const uniqueDeals = new Map();

  allDeals.forEach(deal => {
    const destCity = deal.destination_city || deal.destination || '';
    if (valuableDestinations.some(city => destCity.includes(city))) {
      if (!uniqueDeals.has(destCity) || deal.price < uniqueDeals.get(destCity).price) {
        uniqueDeals.set(destCity, deal);
      }
    }
  });

  const deals = Array.from(uniqueDeals.values()).slice(0, 10);

  console.log(`Sending ${deals.length} unique deals to antonio.l.negron@gmail.com`);

  // Format deals for email
  const formattedDeals = deals.map(deal => {
    const destination = deal.destination_city || deal.destination || 'Unknown';
    const price = deal.price || 0;
    const departureDate = new Date(deal.departure_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const bookingUrl = deal.booking_url || '#';

    return {
      destination,
      price,
      departureDate,
      bookingUrl
    };
  });

  // Create email HTML
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .deal-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 15px 0; }
    .price { font-size: 24px; font-weight: bold; color: #16a34a; }
    .cta { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Your 7-Day Trial!</h1>
      <p>Hi Antonio! Here are today's best flight deals from New York</p>
    </div>

    <div style="padding: 20px 0;">
      <h2>Today's Featured Deals</h2>
      ${formattedDeals.map(deal => `
        <div class="deal-card">
          <h3>✈️ New York → ${deal.destination}</h3>
          <p class="price">$${deal.price}</p>
          <p>Departure: ${deal.departureDate}</p>
          <a href="${deal.bookingUrl}" class="cta">View Deal</a>
        </div>
      `).join('')}
    </div>

    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <h3>🎁 Your Trial Benefits</h3>
      <ul>
        <li>Daily curated flight deals</li>
        <li>Mistake fares & flash sales</li>
        <li>Up to 90% off regular prices</li>
        <li>7 days free, then $5.99/month</li>
        <li>Cancel anytime</li>
      </ul>
    </div>

    <div style="text-align: center; padding: 30px 0; color: #6b7280;">
      <p>Questions? Reply to this email or visit <a href="https://homebaseflights.com">homebaseflights.com</a></p>
      <p style="font-size: 12px;">You're receiving this because you signed up for a trial. <a href="#">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const emailResult = await resend.emails.send({
      from: 'HomeBase Flights <deals@homebaseflights.com>',
      to: 'antonio.l.negron@gmail.com',
      subject: `✈️ Your Trial Started! ${deals.length} Flight Deals from NYC`,
      html: emailHtml,
      headers: {
        'X-Trial-Day': '1',
        'X-User-City': 'new-york'
      }
    });

    console.log('✅ Email sent successfully:', emailResult);
    console.log('Deals included:', formattedDeals.map(d => `${d.destination} - $${d.price}`));

  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

sendTrialEmail();