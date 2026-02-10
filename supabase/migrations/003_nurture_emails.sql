-- Migration: Add nurture email tracking
-- This tracks which nurturing emails have been sent to each subscriber during their trial

-- Add column to track nurturing emails sent (stores array of email numbers)
ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS nurture_emails_sent INTEGER[] DEFAULT '{}';

-- Add index for querying subscribers who need nurture emails
CREATE INDEX IF NOT EXISTS idx_subscribers_nurture
ON subscribers(status, created_at)
WHERE status = 'trial';

COMMENT ON COLUMN subscribers.nurture_emails_sent IS 'Array of nurture email numbers that have been sent (2-6)';
