# Homebase Flights

> Hyper-localized flight deal alerts. Cheap flights from YOUR city.

## Project Vision & Problem Statement

### The Problem
Scott's Cheap Flights (now "Going") became too generic. Users don't want "cheap flights from the US" - they want to know what deals are available TODAY from THEIR specific city.

### Our Solution
Homebase Flights delivers hyper-localized flight deal alerts. Users select their home city once, then receive AI-curated deals that depart specifically from their city's airports.

### Core Differentiator
**Personalization by home city.** Every user gets deals relevant to where they actually live.

### Why This Works
One international flight deal typically saves $300-800. The subscription pays for itself immediately.

---

## Technical Architecture

### Deal Discovery & Alert System

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEAL PIPELINE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. FETCH DEALS (Cron: 6am UTC daily)                               │
│     └── SerpAPI (Google Flights) → Raw flight deals                 │
│                                                                      │
│  2. PRE-FILTER & SCORE                                              │
│     ├── Hard filters (max price, duration, stops)                   │
│     └── Scoring algorithm (price, destination tier, seasonality)    │
│                                                                      │
│  3. AI CURATION (Claude 3 Haiku)                                    │
│     ├── Analyze top 30 pre-scored deals                             │
│     ├── Assign tier: exceptional | good | notable                   │
│     └── Generate compelling 1-sentence descriptions                 │
│                                                                      │
│  4. ALERT DISTRIBUTION                                              │
│     ├── INSTANT ALERTS: "exceptional" deals → immediate email       │
│     └── DAILY DIGEST: "good" + "notable" deals → 8am ET email       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### City-Based Subscription Model

Users subscribe to a **city** (e.g., "New York"), not individual airports. The system automatically fetches deals from all airports in that city:

| City | Primary Airport | Secondary Airports |
|------|-----------------|-------------------|
| New York | JFK | EWR, LGA |
| Los Angeles | LAX | BUR, SNA, ONT |
| Chicago | ORD | MDW |
| San Francisco | SFO | OAK, SJC |
| Miami | MIA | FLL |

### Deal Curation Tiers

| Tier | Criteria | Action |
|------|----------|--------|
| **Exceptional** | 50%+ savings, premium destinations, great timing | Instant email alert |
| **Good** | 35-50% savings, solid value | Daily digest |
| **Notable** | 25-35% savings, worth mentioning | Daily digest |

### User Flow
1. User signs up, selects home city (e.g., "New York")
2. System fetches deals from all NYC-area airports (JFK, EWR, LGA)
3. AI curates best deals and assigns tiers
4. User receives instant alerts for exceptional deals + daily digest
5. User books, saves hundreds

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Flight Data** | SerpAPI (Google Flights) |
| **AI Curation** | Anthropic Claude 3 Haiku |
| **Email** | Resend |
| **Payments** | Stripe |
| **Deployment** | Vercel |
| **Validation** | Zod |
| **Fonts** | Fraunces (headings) + IBM Plex Sans (body) |

---

## Database Schema

### Core Tables

```sql
-- Subscribers (city-based)
subscribers (
  id, email, home_city, stripe_customer_id, 
  subscription_status, email_frequency, 
  last_digest_sent_at, created_at
)

-- Raw flight deals from SerpAPI
flight_deals (
  id, departure_airport, destination, destination_code,
  country, price, departure_date, return_date,
  airline, duration_minutes, stops, booking_link,
  city_slug, fetched_at, created_at
)

-- AI-curated deals
curated_deals (
  id, deal_id, city_slug, ai_tier, ai_description,
  ai_model, ai_reasoning, instant_alert_sent,
  digest_sent, curated_at
)

-- Alert tracking (prevents duplicates)
deal_alerts (
  id, curated_deal_id, subscriber_id, alert_type,
  sent_at
)
```

---

## API Routes

### Public API
| Route | Method | Description |
|-------|--------|-------------|
| `/api/subscribers` | POST | Create new subscriber |
| `/api/subscribers` | GET | Get subscriber by email |
| `/api/deals/[airport]` | GET | Get deals for airport |
| `/api/cached-deals/[airport]` | GET | Get cached deals |

### Cron Jobs (Vercel)
| Route | Schedule | Description |
|-------|----------|-------------|
| `/api/cron/fetch-deals` | 6am UTC daily | Fetch & curate deals |
| `/api/cron/send-digest` | 1pm UTC daily (8am ET) | Send daily digest emails |

### Internal API
| Route | Method | Description |
|-------|--------|-------------|
| `/api/send-welcome-email` | POST | Send welcome email |

---

## Project Structure

```
hbf/
├── public/
│   ├── logo-header.svg      # Brand logo (header)
│   ├── logo-footer.svg      # Brand logo (footer)
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── cached-deals/[airport]/
│   │   │   ├── cron/
│   │   │   │   ├── fetch-deals/    # Deal fetching + AI curation
│   │   │   │   └── send-digest/    # Daily digest emails
│   │   │   ├── deals/[airport]/
│   │   │   ├── send-welcome-email/
│   │   │   └── subscribers/
│   │   ├── about/
│   │   ├── blog/[slug]/         # Blog (currently hidden)
│   │   ├── checkout/
│   │   │   └── success/
│   │   ├── city/[city]/         # Dynamic city pages
│   │   ├── contact/             # Contact page
│   │   ├── faq/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Home page
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/                  # Base UI (Button, Card)
│   │   ├── blog/                # Blog components
│   │   ├── orange/              # Orange theme variant
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── DealCard.tsx
│   │   ├── EmailCapture.tsx
│   │   └── ...
│   ├── data/
│   │   ├── airports.ts          # Airport codes & names
│   │   ├── cities.ts            # City data with airports
│   │   ├── deals.ts             # Sample deals
│   │   └── relatedAirports.ts
│   ├── emails/
│   │   ├── WelcomeEmail.tsx
│   │   ├── InstantAlertEmail.tsx
│   │   └── DigestEmail.tsx
│   ├── lib/
│   │   ├── anthropic.ts         # Claude AI client
│   │   ├── dealCuration.ts      # AI curation logic
│   │   ├── dealScoring.ts       # Pre-filtering & scoring
│   │   ├── resend.ts            # Email client
│   │   ├── serpapi.ts           # Flight data fetching
│   │   ├── supabase.ts          # Database operations
│   │   ├── utils.ts
│   │   └── validations.ts       # Zod schemas
│   └── types/
│       ├── blog.ts
│       └── flights.ts
├── supabase/
│   ├── schema.sql               # Base schema
│   └── migrations/
│       └── 001_add_city_and_curation.sql
├── content/
│   └── posts/                   # MDX blog posts
├── .env.example
├── next.config.js
├── vercel.json                  # Cron configuration
├── tailwind.config.ts
├── DEPLOYMENT_GUIDE.md
└── PRODUCTION_CHECKLIST.md
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SerpAPI (Flight Data)
SERPAPI_KEY=your_serpapi_key

# Anthropic (AI Curation)
ANTHROPIC_API_KEY=your_anthropic_key

# Resend (Email)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=alerts@homebaseflights.com

# Stripe (Payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key

# Cron Security
CRON_SECRET=your_cron_secret
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- SerpAPI account (Starter plan: $50/month, 1000 searches)
- Anthropic API key
- Resend account
- Stripe account

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/homebaseflights.git
cd homebaseflights

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
# (Execute SQL in Supabase dashboard)

# Run development server
npm run dev
```

### Key Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run lint         # Run ESLint
npm run build        # Production build

# Type checking
npx tsc --noEmit     # Check TypeScript errors
```

---

## URL Structure

| URL | Description |
|-----|-------------|
| `/` | Home page with city selector |
| `/cheap-flights-from-[slug]` | City-specific deal pages (SEO-optimized URLs) |
| `/checkout` | Subscription checkout |
| `/checkout/success` | Post-checkout confirmation |
| `/about` | About page |
| `/faq` | FAQ page |
| `/contact` | Contact page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/blog` | Blog (redirects to home - temporarily hidden) |

---

## Supported Cities (MVP)

| City | Airports | Primary |
|------|----------|---------|
| New York | JFK, EWR, LGA | JFK |
| Los Angeles | LAX, BUR, SNA, ONT | LAX |
| Chicago | ORD, MDW | ORD |
| San Francisco | SFO, OAK, SJC | SFO |
| Miami | MIA, FLL | MIA |
| Boston | BOS | BOS |
| Seattle | SEA | SEA |
| Dallas | DFW, DAL | DFW |
| Denver | DEN | DEN |
| Atlanta | ATL | ATL |
| Washington DC | IAD, DCA, BWI | IAD |
| Houston | IAH, HOU | IAH |
| Philadelphia | PHL | PHL |
| Phoenix | PHX | PHX |
| San Diego | SAN | SAN |

---

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Cron Jobs (Hobby Plan Limitations)

Vercel Hobby plan only allows **1 cron job per day**. Current configuration:

```json
{
  "crons": [
    { "path": "/api/cron/fetch-deals", "schedule": "0 6 * * *" },
    { "path": "/api/cron/send-digest", "schedule": "0 13 * * *" }
  ]
}
```

For more frequent fetching, upgrade to Vercel Pro ($20/month).

---

## Cost Structure

### Fixed Costs (Monthly)
| Service | Plan | Cost |
|---------|------|------|
| SerpAPI | Starter | $50 |
| Vercel | Hobby | $0 |
| Supabase | Free | $0 |
| Resend | Free (100/day) | $0 |
| Anthropic | Pay-as-you-go | ~$5 |
| **Total** | | **~$55/month** |

### Variable Costs (Per User)
| Service | Cost per 1000 users |
|---------|---------------------|
| Resend | $20/month (10k emails) |
| Stripe | 2.9% + $0.30 per transaction |

---

## Brand Guidelines

### Brand Personality
- Direct and honest (no marketing BS)
- Helpful, not salesy
- Excited about travel, but professional
- Trustworthy and transparent

### Voice & Tone
- American English
- Conversational but concise
- Benefit-focused (emphasize savings)
- No exclamation marks overload
- Credible, not gimmicky

### Key Messages
- "Cheap flights from YOUR city"
- "One flight pays for this"
- Specific examples (NYC → Paris for $389)

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Primary | Blue | `#2563EB` |
| Accent | Orange/Coral | `#F97316` |
| Neutral | Grays & White | - |
| Success | Green | - |

---

## Target Audience

### Primary
- Millennials & Gen Z (25-45 years old)
- Urban professionals
- Travel 2-4 times per year internationally
- Price-conscious but not backpackers
- Comfortable with subscriptions

### Secondary
- Frequent travelers looking to optimize costs
- Digital nomads
- People with flexible travel dates

---

## Competitive Advantage

| Us | Competitors (Going, Jack's Flight Club) |
|----|-----------------------------------------|
| City-specific personalization | Generic "US deals" |
| AI-curated quality deals | Volume over quality |
| Simple pricing ($80/year) | Multiple confusing tiers |
| 3x savings guarantee | No guarantee |
| SEO city pages | Generic landing pages |

---

## Roadmap

### Phase 1 (Current) ✅
- [x] Landing page & city pages
- [x] Email capture & Stripe checkout
- [x] SerpAPI integration
- [x] AI deal curation (Claude)
- [x] Email alerts (Resend)
- [x] Vercel deployment

### Phase 2 (Next)
- [ ] User dashboard (manage preferences)
- [ ] More cities (Europe, LATAM)
- [ ] Push notifications
- [ ] Mobile app

### Phase 3 (Future)
- [ ] Multi-language support
- [ ] Price prediction
- [ ] Trip planning features

---

## License

Proprietary - All rights reserved.

---

## Contact

- **Website:** [homebaseflights.com](https://homebaseflights.com)
- **Email:** support@homebaseflights.com
