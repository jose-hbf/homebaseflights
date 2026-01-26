# Homebase Flights

> Hyper-localized flight deal alerts. Cheap flights from YOUR airport.

## Project Vision & Problem Statement

### The Problem
Scott's Cheap Flights (now "Going") became too generic. Users don't want "cheap flights from the US" - they want to know what deals are available TODAY from THEIR specific city/airport.

### Our Solution
Homebase Flights delivers hyper-localized flight deal alerts. Users select their home airport once, then receive curated deals that depart specifically from their city.

### Core Differentiator
**Personalization by departure airport.** Every user gets deals relevant to where they actually live.

---

## Business Model

### Revenue
- **Annual subscription:** $72-80/year
- Single pricing tier (keep it simple)

### Value Guarantee
> "If you don't save at least 3x your subscription cost ($240+) in one year, we'll refund your money."

### Why This Works
One international flight deal typically saves $300-800. The subscription pays for itself immediately.

---

## Technical Architecture (The "Secret Sauce")

### Automated Deal Discovery
1. Set up Google Flights monitoring for specific routes (e.g., Madrid → Tokyo) using "Flexible dates" option
2. Price change alerts sent to dedicated Gmail account
3. AI (Claude/GPT) reads emails, extracts flight data
4. AI generates compelling newsletter copy
5. Auto-send to subscribers from that specific home airport

### User Flow
1. User signs up, selects home airport (e.g., "LAX")
2. System segments user into LAX subscriber list
3. Weekly newsletter with 5-8 deals FROM LAX
4. User books, saves hundreds

---

## Product Strategy

### MVP Scope (What We're Building Now)
- Landing pages (main + airport-specific)
- Email capture & airport selection
- Basic subscriber database
- Manual newsletter for first users (automate later)

### Phase 2 (Later)
- Automated email processing
- AI-powered newsletter generation
- Payment processing
- User dashboard
- Deal archive

### Phase 3 (Future)
- Mobile app
- Premium tier (more deals, premium destinations)
- Partner deals (hotels, car rentals)

---

## Brand & Messaging Guidelines

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
- "Cheap flights from YOUR airport"
- "One flight pays for this"
- "$80/year" (price transparency)
- Specific examples (NYC → Paris for $389)

---

## Target Audience

### Primary
- Millennials & Gen Z (25-45 years old)
- Urban professionals
- Travel 2-4 times per year internationally
- Price-conscious but not backpackers
- Comfortable with subscriptions (Netflix, Spotify generation)

### Secondary
- Frequent travelers looking to optimize costs
- Digital nomads
- People with flexible travel dates

---

## Competitive Landscape

### Direct Competitors
- Scott's Cheap Flights / Going (too generic now)
- Jack's Flight Club
- Dollar Flight Club
- Secret Flying

### Our Advantage
- **Airport-specific personalization** (they show all US deals)
- Simpler pricing (one tier)
- Better guarantee (3x savings or refund)
- SEO strategy (airport-specific landing pages)

---

## Marketing & Growth Strategy

### SEO (Primary Channel)
- Airport-specific landing pages: `/from-lax`, `/from-jfk`
- Target keywords: "cheap flights from [city]"
- One domain strategy (brand building, not traffic farming)

### Content Strategy
- Each airport page = SEO asset
- Real deal examples (social proof)
- City-specific content

### Launch Strategy
1. Build 10-15 airport pages (major cities)
2. Soft launch with friends/family
3. Manual newsletters to prove concept
4. Reddit, travel forums (organic)
5. Automate backend once validated

---

## Success Metrics (MVP)

### Landing Page
| Metric | Target |
|--------|--------|
| Load time | < 2 seconds |
| Conversion rate (visitor → email signup) | 3% |
| Airport selection completion | 60% |
| Value comprehension time | < 5 seconds |

### Product
| Metric | Target |
|--------|--------|
| Paying subscribers (first 3 months) | 100 |
| Refund rate | < 5% |
| Email open rate | 40% |
| Deals booked per subscriber/year | At least 1 |

---

## Technical Constraints & Preferences

### Tech Stack
- Modern, fast framework (Next.js preferred)
- Tailwind CSS for styling
- Keep it simple (no over-engineering)
- Fast deployment (Vercel, Netlify, etc.)
- Mobile-first design

### Must-Haves
- Lightning-fast performance
- Mobile responsive
- SEO optimized
- Accessible (WCAG basics)

### Nice-to-Haves (Later)
- Dark mode
- Multi-language
- Advanced analytics

---

## Brand Assets

### Domain
**homebaseflights.com**

### Color Palette
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Deep blue | `#1E40AF` | Trust, travel, sky |
| Accent | Bright orange/coral | `#F97316` | Energy, deals, urgency |
| Neutral | Clean grays & white | - | Backgrounds, text |
| Success | Green | - | Savings badges |

### Typography
- **Headers:** Bold, modern sans-serif (Inter, Poppins)
- **Body:** Readable sans-serif (Inter, System UI)

---

## 12. Initial Airport List

**Priority Markets (Build pages for these first):**

### United States (Major Hubs)

| Code | City |
|------|------|
| JFK | New York (John F. Kennedy) |
| LAX | Los Angeles |
| ORD | Chicago (O'Hare) |
| MIA | Miami |
| SFO | San Francisco |
| BOS | Boston |
| SEA | Seattle |
| ATL | Atlanta |
| EWR | Newark/New York |
| DFW | Dallas/Fort Worth |
| IAH | Houston |
| DEN | Denver |
| LAS | Las Vegas |
| PHX | Phoenix |
| MCO | Orlando |
| DTW | Detroit |
| MSP | Minneapolis |
| PHL | Philadelphia |
| CLT | Charlotte |
| SAN | San Diego |
| PDX | Portland |
| TPA | Tampa |
| AUS | Austin |
| BWI | Baltimore/Washington |
| IAD | Washington Dulles |
| DCA | Washington Reagan |

### Europe (Major Hubs)

| Code | City |
|------|------|
| LHR | London (Heathrow) |
| LGW | London (Gatwick) |
| AMS | Amsterdam |
| CDG | Paris (Charles de Gaulle) |
| MAD | Madrid |
| BCN | Barcelona |
| FCO | Rome (Fiumicino) |
| FRA | Frankfurt |
| MUC | Munich |
| DUB | Dublin |
| LIS | Lisbon |
| VIE | Vienna |
| ZRH | Zurich |
| CPH | Copenhagen |
| ARN | Stockholm |
| OSL | Oslo |
| BRU | Brussels |
| MXP | Milan (Malpensa) |
| ATH | Athens |
| PRG | Prague |
| WAW | Warsaw |
| BUD | Budapest |
| OTP | Bucharest |
| MAN | Manchester |
| EDI | Edinburgh |

### Latin America - Mexico

| Code | City |
|------|------|
| MEX | Mexico City |
| GDL | Guadalajara |
| MTY | Monterrey |
| CUN | Cancún |
| TIJ | Tijuana |
| BJX | León/Bajío |
| PVR | Puerto Vallarta |
| SJD | Los Cabos |

### Latin America - Central America & Caribbean

| Code | City |
|------|------|
| PTY | Panama City |
| SJO | San José (Costa Rica) |
| SAL | San Salvador |
| GUA | Guatemala City |
| SJU | San Juan (Puerto Rico) |
| SDQ | Santo Domingo |
| HAV | Havana |

### Latin America - South America

| Code | City |
|------|------|
| BOG | Bogotá |
| MDE | Medellín |
| CTG | Cartagena |
| LIM | Lima |
| CUZ | Cusco |
| SCL | Santiago de Chile |
| EZE | Buenos Aires (Ezeiza) |
| AEP | Buenos Aires (Aeroparque) |
| GRU | São Paulo (Guarulhos) |
| GIG | Rio de Janeiro |
| BSB | Brasília |
| FOR | Fortaleza |
| SSA | Salvador de Bahía |
| UIO | Quito |
| GYE | Guayaquil |
| MVD | Montevideo |
| ASU | Asunción |
| VVI | Santa Cruz (Bolivia) |
| CCS | Caracas |

### Canada

| Code | City |
|------|------|
| YYZ | Toronto |
| YVR | Vancouver |
| YUL | Montreal |
| YYC | Calgary |
| YOW | Ottawa |
| YEG | Edmonton |

### Asia-Pacific

| Code | City |
|------|------|
| NRT | Tokyo (Narita) |
| HND | Tokyo (Haneda) |
| ICN | Seoul |
| SIN | Singapore |
| HKG | Hong Kong |
| BKK | Bangkok |
| SYD | Sydney |
| MEL | Melbourne |
| AKL | Auckland |
| DEL | Delhi |
| BOM | Mumbai |
| DXB | Dubai |
| DOH | Doha |

### Middle East & Africa

| Code | City |
|------|------|
| TLV | Tel Aviv |
| CAI | Cairo |
| JNB | Johannesburg |
| CPT | Cape Town |
| NBO | Nairobi |
| ADD | Addis Ababa |
| IST | Istanbul |

---

**Total: ~120 airports**

### Launch Strategy by Phase

**Phase 1 (MVP - First 2 weeks):**
Top 20 airports by traffic:
- **US:** JFK, LAX, ORD, MIA, SFO, ATL, BOS, SEA, EWR, DFW
- **Europe:** LHR, AMS, CDG, MAD, BCN
- **LATAM:** MEX, BOG, GRU, SCL, LIM

**Phase 2 (Month 1):**
Add 30 more major hubs (all remaining US hubs + major European/LATAM cities)

**Phase 3 (Month 2-3):**
Complete remaining 70+ airports

**SEO Priority:**
Focus first on English-speaking markets + major Spanish-speaking cities (huge LATAM market, less SEO competition than English).

---

## Content Examples

### Sample Deal Card
```
Japan  LAX → Tokyo
$487 roundtrip
Usually $1,200
Save $713 (59%)
Dates: Feb - Apr 2025
```

### Sample Newsletter Subject
```
"$487 to Tokyo from LAX (59% off) + 6 more deals"
```

### Sample Testimonial
> "Saved $645 on a flight to Barcelona. Paid for 8 years of the subscription." - Sarah, LAX

---

## Open Questions (To Address Later)

- [ ] Exact payment processor (Stripe vs. Gumroad vs. Lemon Squeezy)
- [ ] Newsletter platform (ConvertKit vs. Loops vs. custom)
- [ ] How many deals per week? (propose: 1-2 premium picks)
- [ ] Weekday for newsletter send? (propose: Tuesday morning)

---

## Development Notes

### Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

### Environment Variables

Create a `.env.local` file with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# Stripe (when ready)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

### Project Structure

```
hbf/
├── public/
│   └── robots.txt           # SEO robots file
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   │   ├── send-welcome-email/
│   │   │   └── subscribers/
│   │   ├── checkout/        # Checkout flow
│   │   │   └── success/
│   │   ├── city/[city]/     # Dynamic city pages
│   │   ├── privacy/         # Privacy policy
│   │   ├── terms/           # Terms of service
│   │   ├── error.tsx        # Error boundary
│   │   ├── global-error.tsx # Global error boundary
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── sitemap.ts       # Dynamic sitemap
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   └── ...              # Feature components
│   ├── data/
│   │   ├── cities.ts        # Airport/city data
│   │   └── deals.ts         # Flight deals data
│   ├── emails/
│   │   └── WelcomeEmail.tsx # Email templates
│   ├── lib/
│   │   ├── resend.ts        # Email client
│   │   ├── supabase.ts      # Database client
│   │   ├── utils.ts         # Utility functions
│   │   └── validations.ts   # Zod schemas
│   └── scripts/
│       └── update-deals.ts  # Deal update script
├── supabase/
│   └── schema.sql           # Database schema
├── .env.example             # Environment template
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── PRODUCTION_CHECKLIST.md  # Deployment checklist
```

### Key Commands

```bash
# Development
npm run dev          # Start dev server
npm run lint         # Run ESLint
npm run build        # Production build

# Scripts
npx tsx src/scripts/update-deals.ts  # Update deals on all pages
```

### URL Structure

- `/` - Home page with airport selector
- `/cheap-flights-from-{city}` - City-specific deal pages (SEO-friendly URLs)
- `/checkout` - Subscription checkout
- `/checkout/success` - Post-checkout confirmation
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Fonts:** Fraunces (headings) + IBM Plex Sans (body)
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Payments:** Stripe (planned)
- **Validation:** Zod
- **Deployment:** Vercel (recommended)
