-- Phase 7 fix:
-- listing trust audit trigger must not reference non-existent listing fields.

BEGIN;

CREATE OR REPLACE FUNCTION public.audit_listing_trust_state_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_id UUID := auth.uid();
BEGIN
  IF NEW.verification_level IS DISTINCT FROM OLD.verification_level THEN
    INSERT INTO public.audit_event (actor_user_id, action, entity_type, entity_id, metadata_json)
    VALUES (
      actor_id,
      'trust.listing_verification_level_changed',
      'listing',
      NEW.id,
      jsonb_build_object(
        'from', OLD.verification_level,
        'to', NEW.verification_level
      )
    );
  END IF;

  IF NEW.is_featured IS DISTINCT FROM OLD.is_featured THEN
    INSERT INTO public.audit_event (actor_user_id, action, entity_type, entity_id, metadata_json)
    VALUES (
      actor_id,
      'trust.listing_promotion_state_changed',
      'listing',
      NEW.id,
      jsonb_build_object(
        'from', OLD.is_featured,
        'to', NEW.is_featured
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

COMMIT;
