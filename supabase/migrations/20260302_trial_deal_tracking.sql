-- Create table to track deals sent to each user during trial
CREATE TABLE IF NOT EXISTS user_sent_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_email TEXT NOT NULL,
  deal_id UUID NOT NULL REFERENCES flight_deals(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  email_type TEXT NOT NULL, -- 'trial_day_1', 'trial_day_2', etc.
  destination_code TEXT NOT NULL, -- For quick filtering
  price DECIMAL(10, 2) NOT NULL, -- For analytics

  -- Prevent sending same deal twice to same user
  UNIQUE(subscriber_email, deal_id),

  -- Index for fast lookups
  INDEX idx_user_sent_deals_email (subscriber_email),
  INDEX idx_user_sent_deals_sent_at (sent_at),
  INDEX idx_user_sent_deals_destination (subscriber_email, destination_code)
);

-- Add column to subscribers table to track trial email progress
ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS trial_emails_sent JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS last_trial_email_day INTEGER DEFAULT 0;

-- Create view for international deals (non-US destinations)
CREATE OR REPLACE VIEW international_deals AS
SELECT
  fd.*,
  cd.tier,
  cd.description as ai_description,
  cd.curated_at,
  CASE
    WHEN fd.country IN ('Canada', 'Mexico') THEN 'north_america'
    WHEN fd.country IN ('United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Greece', 'Portugal', 'Ireland', 'Belgium', 'Austria', 'Czech Republic', 'Denmark', 'Sweden', 'Norway', 'Poland', 'Iceland', 'Croatia') THEN 'europe'
    WHEN fd.country IN ('Japan', 'South Korea', 'China', 'Thailand', 'Vietnam', 'Singapore', 'Indonesia', 'Philippines', 'India', 'Hong Kong', 'Taiwan', 'Malaysia') THEN 'asia'
    WHEN fd.country IN ('Australia', 'New Zealand', 'Fiji') THEN 'oceania'
    WHEN fd.country IN ('Brazil', 'Argentina', 'Colombia', 'Peru', 'Chile', 'Ecuador', 'Uruguay') THEN 'south_america'
    WHEN fd.country IN ('Morocco', 'Egypt', 'South Africa', 'Kenya', 'Tanzania', 'Ethiopia') THEN 'africa'
    WHEN fd.country IN ('Israel', 'United Arab Emirates', 'Jordan', 'Turkey', 'Lebanon') THEN 'middle_east'
    WHEN fd.country IN ('Costa Rica', 'Panama', 'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua') THEN 'central_america'
    WHEN fd.country IN ('Bahamas', 'Jamaica', 'Dominican Republic', 'Puerto Rico', 'Barbados', 'Trinidad and Tobago', 'Aruba', 'Curacao', 'Saint Lucia') THEN 'caribbean'
    ELSE 'other'
  END as region,
  CASE
    WHEN fd.price < 300 THEN 'budget'
    WHEN fd.price < 600 THEN 'mid_range'
    WHEN fd.price < 1000 THEN 'premium'
    ELSE 'luxury'
  END as price_category,
  EXTRACT(EPOCH FROM (fd.departure_date - CURRENT_DATE))/86400 as days_until_departure
FROM flight_deals fd
LEFT JOIN curated_deals cd ON fd.id = cd.deal_id
WHERE fd.country != 'United States'
  AND fd.fetched_at >= NOW() - INTERVAL '7 days'
  AND fd.departure_date >= CURRENT_DATE + INTERVAL '14 days' -- Give users time to plan
  AND fd.departure_date <= CURRENT_DATE + INTERVAL '180 days'; -- Not too far in future

-- Function to get best deals for trial users avoiding duplicates
CREATE OR REPLACE FUNCTION get_trial_deals_for_user(
  p_email TEXT,
  p_city_slug TEXT,
  p_limit INTEGER DEFAULT 5
) RETURNS TABLE (
  id UUID,
  destination TEXT,
  destination_code TEXT,
  country TEXT,
  price DECIMAL,
  departure_date DATE,
  return_date DATE,
  airline TEXT,
  tier TEXT,
  ai_description TEXT,
  region TEXT,
  price_category TEXT,
  days_until_departure NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH sent_deals AS (
    -- Get all deals already sent to this user
    SELECT deal_id
    FROM user_sent_deals
    WHERE subscriber_email = p_email
  ),
  sent_destinations AS (
    -- Get destinations already sent to avoid repetition
    SELECT DISTINCT destination_code
    FROM user_sent_deals
    WHERE subscriber_email = p_email
      AND sent_at >= NOW() - INTERVAL '3 days' -- Allow same destination after 3 days
  )
  SELECT
    id.id,
    id.destination,
    id.destination_code,
    id.country,
    id.price,
    id.departure_date,
    id.return_date,
    id.airline,
    id.tier,
    id.ai_description,
    id.region,
    id.price_category,
    id.days_until_departure
  FROM international_deals id
  WHERE id.city_slug = p_city_slug
    AND id.id NOT IN (SELECT deal_id FROM sent_deals) -- Never sent before
    AND id.destination_code NOT IN (SELECT destination_code FROM sent_destinations) -- Not recently sent destination
    AND id.departure_date BETWEEN CURRENT_DATE + INTERVAL '21 days' AND CURRENT_DATE + INTERVAL '90 days'
  ORDER BY
    CASE
      WHEN id.tier = 'exceptional' THEN 1
      WHEN id.tier = 'good' THEN 2
      WHEN id.tier = 'notable' THEN 3
      ELSE 4
    END,
    id.price ASC,
    id.days_until_departure ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to record deals sent to user
CREATE OR REPLACE FUNCTION record_trial_deals_sent(
  p_email TEXT,
  p_deal_ids UUID[],
  p_email_type TEXT
) RETURNS VOID AS $$
DECLARE
  deal_record RECORD;
BEGIN
  FOR deal_record IN
    SELECT id, destination_code, price
    FROM flight_deals
    WHERE id = ANY(p_deal_ids)
  LOOP
    INSERT INTO user_sent_deals (
      subscriber_email,
      deal_id,
      email_type,
      destination_code,
      price
    ) VALUES (
      p_email,
      deal_record.id,
      p_email_type,
      deal_record.destination_code,
      deal_record.price
    ) ON CONFLICT (subscriber_email, deal_id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Clean up old tracking data (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_sent_deals() RETURNS VOID AS $$
BEGIN
  DELETE FROM user_sent_deals
  WHERE sent_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;