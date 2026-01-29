-- Migration: Add city-based subscriptions and AI curation support
-- Run this against your existing Supabase database

-- ============================================
-- 1. UPDATE SUBSCRIBERS TABLE
-- ============================================

-- Add home_city column (if migrating from home_airport)
ALTER TABLE subscribers 
  ADD COLUMN IF NOT EXISTS home_city VARCHAR(50);

-- Migrate existing home_airport data to home_city
-- This maps airport codes to city slugs
UPDATE subscribers SET home_city = 
  CASE home_airport
    WHEN 'LHR' THEN 'london'
    WHEN 'LGW' THEN 'london'
    WHEN 'STN' THEN 'london'
    WHEN 'LTN' THEN 'london'
    WHEN 'JFK' THEN 'new-york'
    WHEN 'EWR' THEN 'new-york'
    WHEN 'LGA' THEN 'new-york'
    WHEN 'LAX' THEN 'los-angeles'
    WHEN 'BUR' THEN 'los-angeles'
    WHEN 'SNA' THEN 'los-angeles'
    WHEN 'ONT' THEN 'los-angeles'
    WHEN 'ORD' THEN 'chicago'
    WHEN 'MDW' THEN 'chicago'
    WHEN 'SFO' THEN 'san-francisco'
    WHEN 'OAK' THEN 'san-francisco'
    WHEN 'SJC' THEN 'san-francisco'
    WHEN 'DXB' THEN 'dubai'
    WHEN 'SIN' THEN 'singapore'
    WHEN 'HKG' THEN 'hong-kong'
    WHEN 'SYD' THEN 'sydney'
    WHEN 'ATL' THEN 'atlanta'
    WHEN 'DFW' THEN 'dallas'
    WHEN 'DAL' THEN 'dallas'
    WHEN 'DEN' THEN 'denver'
    WHEN 'BOS' THEN 'boston'
    WHEN 'SEA' THEN 'seattle'
    WHEN 'MIA' THEN 'miami'
    WHEN 'FLL' THEN 'miami'
    ELSE home_airport -- fallback to airport code if unknown
  END
WHERE home_city IS NULL AND home_airport IS NOT NULL;

-- Make home_city NOT NULL after migration
ALTER TABLE subscribers 
  ALTER COLUMN home_city SET NOT NULL;

-- Update max_price default to 500 (more reasonable)
ALTER TABLE subscribers 
  ALTER COLUMN max_price SET DEFAULT 500;

-- Update email_frequency constraint (remove 'weekly')
ALTER TABLE subscribers 
  DROP CONSTRAINT IF EXISTS subscribers_email_frequency_check;

ALTER TABLE subscribers 
  ADD CONSTRAINT subscribers_email_frequency_check 
  CHECK (email_frequency IN ('instant', 'daily'));

-- Update any existing 'weekly' to 'daily'
UPDATE subscribers SET email_frequency = 'daily' WHERE email_frequency = 'weekly';

-- Add last_digest_sent_at column
ALTER TABLE subscribers 
  ADD COLUMN IF NOT EXISTS last_digest_sent_at TIMESTAMP WITH TIME ZONE;

-- Create index for city-based queries
CREATE INDEX IF NOT EXISTS idx_subscribers_city ON subscribers(home_city);

-- Drop old airport index if exists
DROP INDEX IF EXISTS idx_subscribers_airport;

-- ============================================
-- 2. UPDATE FLIGHT_DEALS TABLE
-- ============================================

-- Add city_slug column
ALTER TABLE flight_deals 
  ADD COLUMN IF NOT EXISTS city_slug VARCHAR(50);

-- Migrate existing data - map departure_airport to city_slug
UPDATE flight_deals SET city_slug = 
  CASE departure_airport
    WHEN 'LHR' THEN 'london'
    WHEN 'LGW' THEN 'london'
    WHEN 'STN' THEN 'london'
    WHEN 'LTN' THEN 'london'
    WHEN 'JFK' THEN 'new-york'
    WHEN 'EWR' THEN 'new-york'
    WHEN 'LGA' THEN 'new-york'
    WHEN 'LAX' THEN 'los-angeles'
    WHEN 'BUR' THEN 'los-angeles'
    WHEN 'SNA' THEN 'los-angeles'
    WHEN 'ONT' THEN 'los-angeles'
    WHEN 'ORD' THEN 'chicago'
    WHEN 'MDW' THEN 'chicago'
    WHEN 'SFO' THEN 'san-francisco'
    WHEN 'OAK' THEN 'san-francisco'
    WHEN 'SJC' THEN 'san-francisco'
    WHEN 'DXB' THEN 'dubai'
    WHEN 'SIN' THEN 'singapore'
    WHEN 'HKG' THEN 'hong-kong'
    WHEN 'SYD' THEN 'sydney'
    WHEN 'ATL' THEN 'atlanta'
    WHEN 'DFW' THEN 'dallas'
    WHEN 'DAL' THEN 'dallas'
    WHEN 'DEN' THEN 'denver'
    WHEN 'BOS' THEN 'boston'
    WHEN 'SEA' THEN 'seattle'
    WHEN 'MIA' THEN 'miami'
    WHEN 'FLL' THEN 'miami'
    ELSE departure_airport
  END
WHERE city_slug IS NULL;

-- Make city_slug NOT NULL after migration
ALTER TABLE flight_deals 
  ALTER COLUMN city_slug SET NOT NULL;

-- Create index for city-based queries
CREATE INDEX IF NOT EXISTS idx_deals_city ON flight_deals(city_slug);

-- ============================================
-- 3. CREATE CURATED_DEALS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS curated_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to raw deal
  deal_id UUID REFERENCES flight_deals(id) ON DELETE CASCADE,
  city_slug VARCHAR(50) NOT NULL,

  -- AI curation results
  ai_tier VARCHAR(20) NOT NULL CHECK (ai_tier IN ('exceptional', 'good', 'notable')),
  ai_description TEXT NOT NULL,
  ai_model VARCHAR(50) DEFAULT 'claude-3-haiku-20240307',
  ai_reasoning TEXT,

  -- Tracking which alerts have been sent
  instant_alert_sent BOOLEAN DEFAULT FALSE,
  instant_alert_sent_at TIMESTAMP WITH TIME ZONE,
  digest_sent BOOLEAN DEFAULT FALSE,
  digest_sent_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  curated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate curation
  UNIQUE(deal_id)
);

-- Indexes for curated_deals
CREATE INDEX IF NOT EXISTS idx_curated_unsent_instant ON curated_deals(city_slug, ai_tier, instant_alert_sent) 
  WHERE ai_tier = 'exceptional' AND instant_alert_sent = FALSE;

CREATE INDEX IF NOT EXISTS idx_curated_unsent_digest ON curated_deals(city_slug, digest_sent) 
  WHERE digest_sent = FALSE;

CREATE INDEX IF NOT EXISTS idx_curated_at ON curated_deals(curated_at);

-- Enable RLS for curated_deals
ALTER TABLE curated_deals ENABLE ROW LEVEL SECURITY;

-- RLS policies for curated_deals
CREATE POLICY "Curated deals are publicly readable" ON curated_deals
  FOR SELECT USING (true);

CREATE POLICY "Curated deals are writable by service role" ON curated_deals
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 4. UPDATE DEAL_ALERTS TABLE
-- ============================================

-- Add curated_deal_id column if it doesn't exist
ALTER TABLE deal_alerts 
  ADD COLUMN IF NOT EXISTS curated_deal_id UUID REFERENCES curated_deals(id) ON DELETE CASCADE;

-- Add alert_type column
ALTER TABLE deal_alerts 
  ADD COLUMN IF NOT EXISTS alert_type VARCHAR(20) DEFAULT 'instant';

-- Add constraint for alert_type
ALTER TABLE deal_alerts 
  DROP CONSTRAINT IF EXISTS deal_alerts_alert_type_check;

ALTER TABLE deal_alerts 
  ADD CONSTRAINT deal_alerts_alert_type_check 
  CHECK (alert_type IN ('instant', 'digest'));

-- Create new unique constraint (drop old one first if exists)
ALTER TABLE deal_alerts 
  DROP CONSTRAINT IF EXISTS deal_alerts_subscriber_id_deal_id_key;

-- Note: We keep deal_id for backward compatibility but prefer curated_deal_id going forward
CREATE UNIQUE INDEX IF NOT EXISTS idx_deal_alerts_subscriber_curated 
  ON deal_alerts(subscriber_id, curated_deal_id) 
  WHERE curated_deal_id IS NOT NULL;

-- ============================================
-- 5. CLEANUP (Optional - run after verifying migration)
-- ============================================

-- Uncomment these after verifying everything works:
-- ALTER TABLE subscribers DROP COLUMN IF EXISTS home_airport;
-- ALTER TABLE deal_alerts DROP COLUMN IF EXISTS deal_id;
