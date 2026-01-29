# Homebase Flights — Deployment Guide

Step-by-step guide to deploy the alert notification system.

---

## Phase 1: Database Setup (Supabase)

### Step 1.1: Open Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com) and log in
2. Select your Homebase Flights project
3. Click **SQL Editor** in the left sidebar

### Step 1.2: Run the Migration

1. Open the file: `supabase/migrations/001_add_city_and_curation.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Cmd+Enter)
5. Verify it completes without errors

### Step 1.3: Verify Tables

Run this query to verify the new table exists:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- `curated_deals` (new)
- `deal_alerts`
- `flight_deals`
- `subscribers`

### Step 1.4: Verify Column Changes

```sql
-- Check subscribers has home_city
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'subscribers';

-- Check flight_deals has city_slug
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'flight_deals';
```

---

## Phase 2: API Keys Setup

### Step 2.1: Anthropic API Key (for AI Curation)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **Settings** → **API Keys**
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-`)
6. Save it securely — you'll need it for Vercel

**Cost estimate:** ~$5/month for your usage

### Step 2.2: Verify SerpAPI Key

1. Go to [serpapi.com](https://serpapi.com)
2. Log in to your account
3. Go to **Manage API Key**
4. Verify you have the **Starter plan** ($25/mo, 1,000 searches)
5. Copy your API key if you don't have it saved

### Step 2.3: Verify Resend API Key

1. Go to [resend.com](https://resend.com)
2. Log in to your account
3. Go to **API Keys**
4. Copy your API key (starts with `re_`)

### Step 2.4: Generate CRON_SECRET

Generate a random string for protecting your cron endpoints:

```bash
# Run this in terminal
openssl rand -hex 32
```

Copy the output — this is your `CRON_SECRET`.

---

## Phase 3: Environment Variables (Vercel)

### Step 3.1: Go to Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Select your Homebase Flights project
3. Click **Settings** → **Environment Variables**

### Step 3.2: Add/Update Variables

Add these environment variables (for all environments: Production, Preview, Development):

| Variable | Value | Notes |
|----------|-------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxx...` | From Step 2.1 |
| `SERPAPI_API_KEY` | `xxx...` | From Step 2.2 |
| `RESEND_API_KEY` | `re_xxx...` | From Step 2.3 |
| `RESEND_FROM_EMAIL` | `Homebase Flights <onboarding@resend.dev>` | Use this for testing |
| `CRON_SECRET` | `xxx...` | From Step 2.4 |
| `NEXT_PUBLIC_SUPABASE_URL` | Already set | Verify it's there |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Already set | Verify it's there |
| `SUPABASE_SERVICE_ROLE_KEY` | Already set | Verify it's there |

### Step 3.3: Deploy

1. Push your code to GitHub (if not already):
   ```bash
   git add .
   git commit -m "Add AI-curated deal alerts system"
   git push
   ```

2. Vercel will automatically deploy

3. Wait for deployment to complete

---

## Phase 4: Verify Deployment

### Step 4.1: Check Build Logs

1. In Vercel, go to **Deployments**
2. Click on the latest deployment
3. Check **Build Logs** — should complete without errors

### Step 4.2: Verify Cron Routes Exist

Visit these URLs (they should return 401 Unauthorized, which is correct):

- `https://yoursite.com/api/cron/fetch-deals`
- `https://yoursite.com/api/cron/send-digest`

---

## Phase 5: Create Test Subscriber

### Step 5.1: Sign Up Through Your Site

1. Go to your live site
2. Enter your email
3. Select a city (e.g., New York)
4. Submit the form

### Step 5.2: Verify in Supabase

Run this query to see your subscriber:

```sql
SELECT * FROM subscribers ORDER BY created_at DESC LIMIT 5;
```

You should see your email with:
- `home_city` = 'new-york'
- `status` = 'trial'
- `email_frequency` = 'instant'

---

## Phase 6: Test the Cron Jobs

### Step 6.1: Test Fetch Deals (Manually)

Run this in your terminal:

```bash
# Replace with your actual values
CRON_SECRET="your-cron-secret"
SITE_URL="https://homebaseflights.com"

curl -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  "$SITE_URL/api/cron/fetch-deals"
```

**Expected response:**
```json
{
  "success": true,
  "timestamp": "2026-01-29T...",
  "summary": {
    "citiesProcessed": 1,
    "totalDealsFound": 20,
    "totalCurated": 3,
    "totalExceptional": 1,
    "totalInstantAlerts": 1
  }
}
```

### Step 6.2: Check Your Email

If there were exceptional deals, you should receive an instant alert email.

### Step 6.3: Verify Data in Supabase

```sql
-- Check fetched deals
SELECT * FROM flight_deals 
WHERE city_slug = 'new-york' 
ORDER BY fetched_at DESC LIMIT 10;

-- Check curated deals
SELECT * FROM curated_deals 
ORDER BY curated_at DESC LIMIT 10;
```

### Step 6.4: Test Daily Digest (Manually)

```bash
curl -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  "$SITE_URL/api/cron/send-digest"
```

**Expected response:**
```json
{
  "success": true,
  "summary": {
    "citiesProcessed": 1,
    "totalEmailsSent": 1
  }
}
```

Check your email for the digest.

---

## Phase 7: Verify Cron Schedules

### Step 7.1: Check Vercel Cron Settings

1. In Vercel dashboard, go to **Settings** → **Crons**
2. Verify you see:
   - `/api/cron/fetch-deals` — `0 */6 * * *` (every 6 hours)
   - `/api/cron/send-digest` — `0 13 * * *` (8am ET daily)

### Step 7.2: Wait for First Automatic Run

- **Fetch deals** will run at: 00:00, 06:00, 12:00, 18:00 UTC
- **Daily digest** will run at: 13:00 UTC (8am ET)

Check Vercel **Functions** logs after the scheduled time to verify they ran.

---

## Phase 8: Domain Verification (For Production Emails)

### Step 8.1: Add Domain to Resend

1. Go to [resend.com/domains](https://resend.com/domains)
2. Click **Add Domain**
3. Enter: `homebaseflights.com`
4. Follow the DNS verification steps

### Step 8.2: Add DNS Records

Resend will give you DNS records to add. In your domain registrar:

1. Add the **TXT record** for SPF
2. Add the **CNAME records** for DKIM
3. Wait for verification (can take up to 24 hours)

### Step 8.3: Update FROM_EMAIL

Once verified, update your Vercel environment variable:

```
RESEND_FROM_EMAIL=Homebase Flights <deals@homebaseflights.com>
```

Redeploy for changes to take effect.

---

## Phase 9: Monitoring & Maintenance

### Step 9.1: Set Up Monitoring

Check these regularly:

**Vercel Functions Logs:**
- Go to Vercel → **Functions** → **Logs**
- Filter by `/api/cron/fetch-deals` and `/api/cron/send-digest`
- Look for errors

**Supabase:**
- Monitor `curated_deals` table growth
- Check `deal_alerts` for sent emails
- Run `clean_old_deals()` occasionally (or it runs in cron)

### Step 9.2: Key Metrics to Track

| Metric | Where to Find | Target |
|--------|---------------|--------|
| Deals fetched/day | Vercel logs | 50-100 per city |
| Curated deals/day | `curated_deals` table | 3-5 per city |
| Emails sent/day | Resend dashboard | 1-2 per subscriber |
| Open rate | Resend dashboard | >40% |
| API usage | SerpAPI dashboard | <1,000/month |

### Step 9.3: Troubleshooting

**No deals being fetched:**
- Check SerpAPI key is valid
- Check SerpAPI quota not exceeded
- Look at Vercel function logs for errors

**No emails being sent:**
- Check Resend API key
- Check RESEND_FROM_EMAIL format
- Look at Vercel function logs

**AI curation failing:**
- Check Anthropic API key
- Check Anthropic account has credits
- Look at Vercel function logs

---

## Quick Reference: Important URLs

| Service | URL |
|---------|-----|
| Vercel Dashboard | https://vercel.com/your-username/hbf |
| Supabase Dashboard | https://supabase.com/dashboard/project/your-project |
| SerpAPI Dashboard | https://serpapi.com/dashboard |
| Resend Dashboard | https://resend.com/emails |
| Anthropic Console | https://console.anthropic.com |

---

## Summary Checklist

```
□ Phase 1: Database
  □ Run migration SQL
  □ Verify curated_deals table exists
  □ Verify home_city column in subscribers

□ Phase 2: API Keys
  □ Get Anthropic API key
  □ Verify SerpAPI key and plan
  □ Verify Resend API key
  □ Generate CRON_SECRET

□ Phase 3: Vercel Environment Variables
  □ Add ANTHROPIC_API_KEY
  □ Add RESEND_FROM_EMAIL
  □ Add CRON_SECRET
  □ Deploy

□ Phase 4: Verify Deployment
  □ Build succeeds
  □ Cron routes accessible (return 401)

□ Phase 5: Test Subscriber
  □ Sign up through site
  □ Verify in Supabase

□ Phase 6: Test Cron Jobs
  □ Manual fetch-deals test
  □ Check email received
  □ Manual send-digest test
  □ Verify data in Supabase

□ Phase 7: Verify Cron Schedules
  □ Check Vercel cron settings
  □ Wait for first automatic run

□ Phase 8: Domain Verification
  □ Add domain to Resend
  □ Add DNS records
  □ Update RESEND_FROM_EMAIL

□ Phase 9: Monitoring
  □ Check Vercel logs regularly
  □ Monitor Supabase tables
  □ Track email open rates
```

---

**Estimated time to complete:** 1-2 hours

**Questions?** Check the logs first, then review the code in:
- `src/app/api/cron/fetch-deals/route.ts`
- `src/app/api/cron/send-digest/route.ts`
- `src/lib/dealCuration.ts`
