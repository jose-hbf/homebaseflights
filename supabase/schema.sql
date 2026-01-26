-- Supabase Schema for Homebase Flights
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- FLIGHT DEALS TABLE
-- Stores current flight deals from SerpApi
-- ============================================
CREATE TABLE IF NOT EXISTS flight_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Origin airport
  departure_airport VARCHAR(3) NOT NULL,

  -- Destination info
  destination VARCHAR(255) NOT NULL,
  destination_code VARCHAR(3) NOT NULL,
  country VARCHAR(100) NOT NULL,

  -- Price and dates
  price INTEGER NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,

  -- Flight details
  airline VARCHAR(100) NOT NULL,
  airline_code VARCHAR(5) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  stops INTEGER NOT NULL DEFAULT 0,

  -- Booking
  booking_link TEXT NOT NULL,
  thumbnail TEXT,

  -- Metadata
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint to avoid duplicates
  UNIQUE(departure_airport, destination_code, departure_date, return_date, airline_code)
);

-- Index for fast queries by departure airport
CREATE INDEX IF NOT EXISTS idx_deals_departure ON flight_deals(departure_airport);

-- Index for fast queries by price
CREATE INDEX IF NOT EXISTS idx_deals_price ON flight_deals(price);

-- Index for fetched_at (to clean old deals)
CREATE INDEX IF NOT EXISTS idx_deals_fetched ON flight_deals(fetched_at);

-- ============================================
-- SUBSCRIBERS TABLE
-- Stores email subscribers with their preferences
-- ============================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact info
  email VARCHAR(255) NOT NULL UNIQUE,

  -- Preferences
  home_airport VARCHAR(3) NOT NULL,
  max_price INTEGER DEFAULT 200,
  direct_only BOOLEAN DEFAULT FALSE,

  -- Subscription status
  status VARCHAR(20) DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'cancelled', 'expired')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,

  -- Stripe integration (for future)
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),

  -- Email preferences
  email_frequency VARCHAR(20) DEFAULT 'daily' CHECK (email_frequency IN ('instant', 'daily', 'weekly')),
  last_email_sent_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast queries by airport
CREATE INDEX IF NOT EXISTS idx_subscribers_airport ON subscribers(home_airport);

-- Index for active subscribers
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);

-- ============================================
-- DEAL ALERTS TABLE
-- Tracks which deals were sent to which subscribers
-- ============================================
CREATE TABLE IF NOT EXISTS deal_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES flight_deals(id) ON DELETE CASCADE,

  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(subscriber_id, deal_id)
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to clean old deals (older than 7 days)
CREATE OR REPLACE FUNCTION clean_old_deals()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM flight_deals
  WHERE fetched_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update subscriber updated_at
CREATE OR REPLACE FUNCTION update_subscriber_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriber_updated
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriber_timestamp();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE flight_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_alerts ENABLE ROW LEVEL SECURITY;

-- Deals are readable by everyone (public API)
CREATE POLICY "Deals are publicly readable" ON flight_deals
  FOR SELECT USING (true);

-- Deals can only be inserted/updated by service role
CREATE POLICY "Deals are writable by service role" ON flight_deals
  FOR ALL USING (auth.role() = 'service_role');

-- Subscribers can only see their own data
CREATE POLICY "Users can view own subscriber data" ON subscribers
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Service role can manage all subscribers
CREATE POLICY "Service role can manage subscribers" ON subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Deal alerts follow subscriber rules
CREATE POLICY "Service role can manage deal alerts" ON deal_alerts
  FOR ALL USING (auth.role() = 'service_role');
