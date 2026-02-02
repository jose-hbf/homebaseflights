-- Migration: Add published_deals table for SEO archive
-- Run this in Supabase SQL Editor

-- ============================================
-- PUBLISHED DEALS TABLE
-- Stores deals that have been published to the public archive
-- These are expired deals shown with a 48h+ delay
-- ============================================
CREATE TABLE IF NOT EXISTS published_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Link to original curated deal
  curated_deal_id UUID REFERENCES curated_deals(id) ON DELETE SET NULL,
  
  -- Origin info
  origin_city VARCHAR(100) NOT NULL,
  origin_city_slug VARCHAR(50) NOT NULL,
  origin_airport_code VARCHAR(3) NOT NULL,
  origin_country VARCHAR(100) NOT NULL,
  
  -- Destination info
  destination_city VARCHAR(255) NOT NULL,
  destination_city_slug VARCHAR(100) NOT NULL,
  destination_airport_code VARCHAR(3) NOT NULL,
  destination_country VARCHAR(100) NOT NULL,
  
  -- Pricing
  price INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  original_price INTEGER NOT NULL,
  savings_percent INTEGER NOT NULL,
  
  -- Flight details
  airline VARCHAR(100) NOT NULL,
  airline_code VARCHAR(5),
  stops INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  
  -- Travel dates (when the deal was valid for travel)
  travel_date_start DATE NOT NULL,
  travel_date_end DATE NOT NULL,
  
  -- Deal lifecycle timestamps
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_to_subscribers_at TIMESTAMP WITH TIME ZONE,
  expired_at TIMESTAMP WITH TIME ZONE NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- SEO fields
  slug VARCHAR(255) NOT NULL UNIQUE,
  meta_title VARCHAR(70),
  meta_description VARCHAR(160),
  
  -- Content (from AI curation)
  ai_description TEXT,
  deal_highlights TEXT[], -- Array of highlights like "Non-stop", "Summer dates"
  
  -- Stats for FOMO
  hours_active INTEGER, -- How long the deal lasted
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_published_deals_origin_city ON published_deals(origin_city_slug);
CREATE INDEX IF NOT EXISTS idx_published_deals_slug ON published_deals(slug);
CREATE INDEX IF NOT EXISTS idx_published_deals_published_at ON published_deals(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_deals_savings ON published_deals(savings_percent DESC);

-- Enable RLS
ALTER TABLE published_deals ENABLE ROW LEVEL SECURITY;

-- Published deals are publicly readable (for SEO)
CREATE POLICY "Published deals are publicly readable" ON published_deals
  FOR SELECT USING (true);

-- Only service role can manage published deals
CREATE POLICY "Service role can manage published deals" ON published_deals
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- DEAL ARCHIVE STATS TABLE
-- Aggregated stats for FOMO display
-- ============================================
CREATE TABLE IF NOT EXISTS deal_archive_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Stats period
  city_slug VARCHAR(50), -- NULL for global stats
  period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'all_time'
  
  -- Counts
  total_deals_found INTEGER DEFAULT 0,
  total_deals_published INTEGER DEFAULT 0,
  total_deals_sent INTEGER DEFAULT 0,
  
  -- Savings
  average_savings_percent INTEGER DEFAULT 0,
  total_savings_amount INTEGER DEFAULT 0,
  
  -- Engagement (for future)
  total_subscribers INTEGER DEFAULT 0,
  
  -- Timestamps
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique per city+period
  UNIQUE(city_slug, period)
);

-- Enable RLS
ALTER TABLE deal_archive_stats ENABLE ROW LEVEL SECURITY;

-- Stats are publicly readable
CREATE POLICY "Deal stats are publicly readable" ON deal_archive_stats
  FOR SELECT USING (true);

-- Only service role can manage stats
CREATE POLICY "Service role can manage deal stats" ON deal_archive_stats
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- UPDATE curated_deals to track expiration
-- ============================================
ALTER TABLE curated_deals 
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' 
    CHECK (status IN ('active', 'expired', 'published')),
  ADD COLUMN IF NOT EXISTS expired_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Index for finding expired deals ready to publish
CREATE INDEX IF NOT EXISTS idx_curated_deals_status ON curated_deals(status, expired_at);
