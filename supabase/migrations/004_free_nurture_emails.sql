-- Migration: Add free user nurture email tracking and plan column
-- This tracks which nurturing emails have been sent to free subscribers to convert them to Pro

-- Add plan column to differentiate free vs paid subscribers
ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS plan VARCHAR(10) DEFAULT 'paid';

-- Add column to track free nurturing emails sent (stores array of email numbers 1-7)
ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS free_nurture_emails_sent INTEGER[] DEFAULT '{}';

-- Add index for querying free subscribers who need nurture emails
CREATE INDEX IF NOT EXISTS idx_subscribers_free_nurture
ON subscribers(plan, status, created_at)
WHERE plan = 'free' AND status = 'active';

-- Update existing subscribers: set plan = 'paid' for those with stripe_subscription_id
UPDATE subscribers
SET plan = 'paid'
WHERE stripe_subscription_id IS NOT NULL AND plan IS NULL;

-- Set plan = 'paid' for trial users (they signed up for paid plan)
UPDATE subscribers
SET plan = 'paid'
WHERE status = 'trial' AND plan IS NULL;

COMMENT ON COLUMN subscribers.plan IS 'Subscription plan: free (email-only) or paid (Pro)';
COMMENT ON COLUMN subscribers.free_nurture_emails_sent IS 'Array of free nurture email numbers that have been sent (1-7)';
