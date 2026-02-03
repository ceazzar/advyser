-- Migration: Add DELETE RLS policy for leads
-- Allows consumers to delete their own leads when status is 'new' (before advisor responds)

-- Add DELETE policy for consumers to cancel pending requests
DROP POLICY IF EXISTS "Consumers can delete own new leads" ON lead;
CREATE POLICY "Consumers can delete own new leads" ON lead
  FOR DELETE USING (
    auth.uid() = consumer_user_id
    AND status = 'new'
  );

-- Add comment explaining the policy
COMMENT ON POLICY "Consumers can delete own new leads" ON lead IS
  'Consumers can cancel/withdraw their request before the advisor responds (status = new only)';
