# Trial User Troubleshooting Guide

## Common Issues & Solutions

### 1. User paid but doesn't appear in Supabase

**Symptoms:**
- User completed Stripe checkout
- User is not in Supabase database
- User doesn't receive welcome email

**Diagnosis:**
```bash
node scripts/diagnose-trial-user.js user@example.com
```

**Solution:**
```bash
# Add user manually with their Stripe customer ID
node scripts/add-trial-user.js user@example.com new-york cus_XXXXX
```

### 2. User exists but not receiving emails

**Check status:**
```bash
node scripts/diagnose-trial-user.js user@example.com
```

**Common causes:**
- Status is not "trial"
- Plan is not "paid"
- trial_ends_at is missing or expired

**Fix via SQL in Supabase Dashboard:**
```sql
UPDATE subscribers
SET
  status = 'trial',
  plan = 'paid',
  trial_ends_at = NOW() + INTERVAL '7 days'
WHERE email = 'user@example.com';
```

### 3. Webhook not firing

**Check webhook logs in Vercel:**
```bash
vercel logs --since 2h | grep "Stripe Webhook"
```

**Test webhook endpoint:**
```bash
curl https://homebaseflights.com/api/webhooks/stripe-debug
```

**Common issues:**
- Webhook secret mismatch
- Webhook endpoint not enabled in Stripe
- Network/firewall blocking Stripe IPs

### 4. Manual Trial Setup Process

When a user needs to be added manually:

1. **Get their Stripe Customer ID:**
```bash
stripe customers list --email user@example.com --live
```

2. **Add to database:**
```bash
node scripts/add-trial-user.js user@example.com new-york cus_XXXXX
```

3. **Verify setup:**
```bash
node scripts/diagnose-trial-user.js user@example.com
```

4. **Send test email (if needed):**
```bash
curl -X GET 'https://homebaseflights.com/api/cron/send-trial-deals-premium'
```

## Webhook Configuration

### Current Webhook Events
- `checkout.session.completed` ✅ (main event for trials)
- `customer.subscription.updated` ✅
- `customer.subscription.deleted` ✅
- `invoice.payment_succeeded` ✅

### Missing Events (should add)
- `setup_intent.succeeded` - For users who save payment method
- `checkout.session.async_payment_succeeded` - For delayed payments

## Database Schema Requirements

Required fields for trial users:
- `email` - User's email address
- `home_city` - City slug (e.g., "new-york")
- `home_airport` - Airport code (e.g., "NYC")
- `plan` - Must be "paid" for trials
- `status` - Must be "trial" during trial period
- `trial_ends_at` - ISO date when trial ends
- `stripe_customer_id` - Stripe customer ID
- `stripe_subscription_id` - Stripe subscription ID (optional during trial)

## Monitoring & Alerts

### Daily Checks
1. Count of new trials vs Stripe checkouts
2. Email delivery rate for trial users
3. Webhook success rate

### SQL Queries for Monitoring

**Find trials without emails sent:**
```sql
SELECT email, created_at
FROM subscribers
WHERE status = 'trial'
AND plan = 'paid'
AND email NOT IN (
  SELECT DISTINCT user_email FROM user_sent_deals
)
ORDER BY created_at DESC;
```

**Find expired trials:**
```sql
SELECT email, trial_ends_at
FROM subscribers
WHERE status = 'trial'
AND trial_ends_at < NOW()
ORDER BY trial_ends_at DESC;
```

## Emergency Scripts

### Send email to all trial users manually:
```javascript
// send-all-trials.js
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(url, key)

async function sendToAllTrials() {
  const { data: users } = await supabase
    .from('subscribers')
    .select('*')
    .eq('status', 'trial')
    .eq('plan', 'paid')

  for (const user of users) {
    // Send email logic here
    console.log(`Sending to ${user.email}`)
    // Add delay between emails
    await new Promise(r => setTimeout(r, 1000))
  }
}
```

## Contact for Issues

If webhook issues persist:
1. Check Stripe Dashboard > Developers > Webhooks
2. Verify webhook secret in Vercel environment variables
3. Check Vercel function logs for errors
4. Contact Stripe support if webhook shows as failing

## Automated Recovery

The system should automatically:
1. Log all webhook events for debugging
2. Send welcome email immediately on checkout completion
3. Include deals in welcome email when available
4. Continue daily emails via cron job

If automation fails, use manual scripts above to recover.