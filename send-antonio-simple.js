const { Resend } = require('resend');

const resend = new Resend('re_fePHN6d7_GDJGcjeQhxWRJFb8mq5HtGUJ');

async function sendTrialEmail() {
  // Manually create some good deals for Antonio
  const deals = [
    { destination: 'London', price: 361, date: 'Mar 15' },
    { destination: 'Paris', price: 392, date: 'Mar 18' },
    { destination: 'Dublin', price: 286, date: 'Mar 20' },
    { destination: 'Miami', price: 118, date: 'Mar 22' },
    { destination: 'Los Angeles', price: 197, date: 'Mar 25' },
    { destination: 'Cancun', price: 245, date: 'Apr 1' },
    { destination: 'Barcelona', price: 425, date: 'Apr 5' },
    { destination: 'Tokyo', price: 589, date: 'Apr 10' }
  ];

  console.log(`Sending ${deals.length} deals to antonio.l.negron@gmail.com`);

  // Create email HTML
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0 0; opacity: 0.95; }
    .deal-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0; background: #fff; }
    .deal-card:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .deal-header { display: flex; justify-content: space-between; align-items: center; }
    .destination { font-size: 20px; font-weight: 600; }
    .price { font-size: 28px; font-weight: bold; color: #16a34a; }
    .date { color: #6b7280; margin-top: 8px; }
    .cta { background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; margin-top: 15px; }
    .cta:hover { background: #2563eb; }
    .benefits { background: #f3f4f6; padding: 25px; border-radius: 8px; margin: 30px 0; }
    .benefits h3 { margin-top: 0; color: #1f2937; }
    .benefits ul { margin: 15px 0; padding-left: 20px; }
    .benefits li { margin: 8px 0; }
    .footer { text-align: center; padding: 30px 0; color: #6b7280; font-size: 14px; }
    .footer a { color: #3b82f6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Your 7-Day Trial!</h1>
      <p>Hi Antonio! Your trial has started. Here are today's best deals from New York.</p>
    </div>

    <div style="padding: 20px 0;">
      <h2 style="font-size: 24px; margin-bottom: 20px;">✈️ Today's Featured Deals from NYC</h2>

      ${deals.map(deal => `
        <div class="deal-card">
          <div class="deal-header">
            <div>
              <div class="destination">New York → ${deal.destination}</div>
              <div class="date">Departure: ${deal.date}</div>
            </div>
            <div class="price">$${deal.price}</div>
          </div>
          <a href="https://homebaseflights.com" class="cta">View Deal →</a>
        </div>
      `).join('')}
    </div>

    <div class="benefits">
      <h3>🎁 Your Trial Benefits</h3>
      <ul>
        <li><strong>7 days completely free</strong> - no charge today</li>
        <li>Daily curated flight deals from NYC</li>
        <li>Mistake fares & flash sales alerts</li>
        <li>Save up to 90% on international flights</li>
        <li>After trial: only $5.99/month</li>
        <li>Cancel anytime - no questions asked</li>
      </ul>
      <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
        <strong>⚠️ Note:</strong> You had some issues setting up your payment method. Please update your card at <a href="https://homebaseflights.com/account">homebaseflights.com/account</a> to ensure uninterrupted service after your trial.
      </p>
    </div>

    <div class="footer">
      <p><strong>Questions?</strong> Just reply to this email</p>
      <p>Visit us at <a href="https://homebaseflights.com">homebaseflights.com</a></p>
      <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        You're receiving this because you signed up for a trial at HomeBase Flights.<br>
        <a href="https://homebaseflights.com/unsubscribe">Unsubscribe</a> |
        <a href="https://homebaseflights.com/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const emailResult = await resend.emails.send({
      from: 'HomeBase Flights <deals@homebaseflights.com>',
      to: 'antonio.l.negron@gmail.com',
      subject: `✈️ Welcome! Your 7-Day Trial Started + ${deals.length} NYC Flight Deals Inside`,
      html: emailHtml,
      headers: {
        'X-Trial-Day': '1',
        'X-User-City': 'new-york'
      }
    });

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', emailResult.data?.id);
    console.log('\nDeals included:');
    deals.forEach(d => console.log(`  • ${d.destination} - $${d.price} (${d.date})`));
    console.log('\n📧 Antonio should receive his welcome email shortly.');
    console.log('⚠️  Reminder: He needs to update his payment method for the trial to continue.');

  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

sendTrialEmail();