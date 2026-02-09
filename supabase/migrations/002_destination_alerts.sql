-- Migration: Add destination-based deduplication tracking
-- This prevents sending the same destination to a subscriber within a cooldown window

-- Table for tracking destinations sent to each subscriber
CREATE TABLE IF NOT EXISTS destination_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  destination_code VARCHAR(3) NOT NULL,  -- IATA code (e.g., 'CDG', 'NRT')
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate entries per subscriber+destination
  UNIQUE(subscriber_id, destination_code)
);

-- Index for efficient lookups by subscriber and time window
CREATE INDEX IF NOT EXISTS idx_destination_alerts_lookup
  ON destination_alerts(subscriber_id, sent_at);

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_destination_alerts_sent_at
  ON destination_alerts(sent_at);
