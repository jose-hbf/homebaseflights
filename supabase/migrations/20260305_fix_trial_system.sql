-- Migration to fix trial email system
-- Date: 2026-03-05

-- 1. Add missing columns to subscribers table
ALTER TABLE public.subscribers
ADD COLUMN IF NOT EXISTS last_trial_email_day INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trial_emails_sent JSONB DEFAULT '[]'::jsonb;

-- 2. Create table to track deals sent to users
CREATE TABLE IF NOT EXISTS public.user_sent_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  deal_id UUID NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_type TEXT,
  FOREIGN KEY (deal_id) REFERENCES public.curated_deals(id) ON DELETE CASCADE
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_sent_deals_email ON public.user_sent_deals(user_email);
CREATE INDEX IF NOT EXISTS idx_user_sent_deals_sent_at ON public.user_sent_deals(sent_at DESC);

-- 3. Create function to get trial deals for a user
CREATE OR REPLACE FUNCTION public.get_trial_deals_for_user(
  p_email TEXT,
  p_city_slug TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  destination TEXT,
  destination_code TEXT,
  departure_date DATE,
  return_date DATE,
  price INTEGER,
  trip_type TEXT,
  airline TEXT,
  direct_flight BOOLEAN,
  deal_quality TEXT,
  region TEXT,
  country TEXT,
  deal_url TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH city_info AS (
    SELECT
      CASE
        WHEN p_city_slug = 'new-york' THEN 'NYC'
        WHEN p_city_slug = 'los-angeles' THEN 'LAX'
        WHEN p_city_slug = 'chicago' THEN 'ORD'
        WHEN p_city_slug = 'san-francisco' THEN 'SFO'
        WHEN p_city_slug = 'boston' THEN 'BOS'
        WHEN p_city_slug = 'washington-dc' THEN 'DCA'
        WHEN p_city_slug = 'miami' THEN 'MIA'
        WHEN p_city_slug = 'london' THEN 'LON'
        ELSE 'NYC'
      END as airport_code
  ),
  already_sent AS (
    SELECT DISTINCT deal_id
    FROM public.user_sent_deals
    WHERE user_email = p_email
  ),
  filtered_deals AS (
    SELECT
      cd.id,
      cd.destination,
      cd.destination_code,
      cd.departure_date,
      cd.return_date,
      cd.price,
      cd.trip_type,
      cd.airline,
      cd.direct_flight,
      cd.deal_quality,
      CASE
        WHEN cd.destination_code IN ('LHR', 'CDG', 'FCO', 'MAD', 'BCN', 'AMS', 'FRA', 'MUC', 'VIE', 'ZRH', 'CPH', 'OSL', 'STO', 'HEL', 'DUB', 'EDI', 'LIS', 'ATH', 'IST', 'PRG', 'BUD', 'WAW') THEN 'Europe'
        WHEN cd.destination_code IN ('NRT', 'HND', 'ICN', 'PVG', 'PEK', 'HKG', 'TPE', 'BKK', 'SIN', 'KUL', 'MNL', 'SGN', 'DEL', 'BOM', 'BLR', 'DXB', 'DOH', 'TLV', 'CAI', 'JNB', 'CPT', 'NBO', 'ADD', 'CMN', 'TUN', 'ALG') THEN 'Asia/Africa'
        WHEN cd.destination_code IN ('MEX', 'CUN', 'SJD', 'PVR', 'GDL', 'MTY', 'CZM', 'HUX', 'ZIH', 'MZT', 'GUA', 'SAL', 'MGA', 'SJO', 'PTY', 'BOG', 'MDE', 'CTG', 'UIO', 'GYE', 'LIM', 'CUZ', 'SCL', 'EZE', 'GIG', 'GRU', 'BSB', 'CCS', 'MVD', 'ASU') THEN 'Latin America'
        WHEN cd.destination_code IN ('SYD', 'MEL', 'BNE', 'PER', 'AKL', 'CHC', 'WLG', 'PPT', 'NAN', 'RAR') THEN 'Oceania'
        WHEN cd.destination_code IN ('YYZ', 'YVR', 'YUL', 'YYC', 'YEG', 'YOW', 'YHZ', 'YWG', 'YQB') THEN 'Canada'
        WHEN cd.destination_code IN ('HNL', 'OGG', 'KOA', 'LIH', 'ITO', 'SJU', 'STT', 'STX', 'MBJ', 'KIN', 'NAS', 'PLS', 'AUA', 'CUR', 'SXM', 'BGI', 'POS', 'GEO', 'BZE') THEN 'Caribbean/Hawaii'
        ELSE 'Other'
      END as region,
      cd.country,
      cd.deal_url
    FROM public.curated_deals cd
    CROSS JOIN city_info ci
    WHERE cd.origin = ci.airport_code
      AND cd.departure_date >= CURRENT_DATE
      AND cd.departure_date <= CURRENT_DATE + INTERVAL '6 months'
      AND cd.deal_quality IN ('exceptional', 'good')
      AND cd.id NOT IN (SELECT deal_id FROM already_sent)
  )
  SELECT
    fd.id,
    fd.destination,
    fd.destination_code,
    fd.departure_date,
    fd.return_date,
    fd.price,
    fd.trip_type,
    fd.airline,
    fd.direct_flight,
    fd.deal_quality,
    fd.region,
    fd.country,
    fd.deal_url
  FROM filtered_deals fd
  ORDER BY
    CASE fd.deal_quality
      WHEN 'exceptional' THEN 1
      WHEN 'good' THEN 2
      ELSE 3
    END,
    fd.price ASC
  LIMIT p_limit;
END;
$$;

-- 4. Create function to record deals as sent
CREATE OR REPLACE FUNCTION public.record_trial_deals_sent(
  p_email TEXT,
  p_deal_ids UUID[],
  p_email_type TEXT DEFAULT 'trial_daily'
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert records for each deal sent
  INSERT INTO public.user_sent_deals (user_email, deal_id, email_type)
  SELECT p_email, unnest(p_deal_ids), p_email_type;
END;
$$;

-- 5. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_trial_deals_for_user TO service_role;
GRANT EXECUTE ON FUNCTION public.record_trial_deals_sent TO service_role;
GRANT ALL ON TABLE public.user_sent_deals TO service_role;

-- 6. Update any existing trial users to have proper fields
UPDATE public.subscribers
SET
  last_trial_email_day = 0,
  trial_emails_sent = '[]'::jsonb
WHERE plan = 'paid'
  AND status = 'trial'
  AND last_trial_email_day IS NULL;

-- 7. Create a view for easy monitoring of trial users
CREATE OR REPLACE VIEW public.trial_users_status AS
SELECT
  email,
  home_city,
  created_at,
  trial_ends_at,
  last_trial_email_day,
  trial_emails_sent,
  EXTRACT(DAY FROM NOW() - created_at) as days_since_start,
  EXTRACT(DAY FROM trial_ends_at - NOW()) as days_remaining
FROM public.subscribers
WHERE plan = 'paid' AND status = 'trial';

GRANT SELECT ON public.trial_users_status TO service_role;