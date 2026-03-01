-- Phase 6 policy fix:
-- Ensure listing write checks evaluate tenant membership via row.business_id
-- so INSERT is valid for authorized business members.

BEGIN;

DROP POLICY IF EXISTS listing_business_manage ON public.listing;

CREATE POLICY listing_business_manage
ON public.listing
FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

COMMIT;
