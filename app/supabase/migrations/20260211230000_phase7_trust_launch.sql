-- Phase 7: Trust launch primitives
-- Gate coverage:
-- 1) Badge policy enforced: Verified != Promoted
-- 2) Consent and audit entries for trust-relevant state transitions
-- 3) Review integrity scaffolding: dispute + right-of-reply

BEGIN;

-- ---------------------------------------------------------------------------
-- Trust enums
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'trust_disclosure_kind'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.trust_disclosure_kind AS ENUM (
      'promotion',
      'verification',
      'fees',
      'affiliation',
      'general'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'trust_consent_type'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.trust_consent_type AS ENUM (
      'disclosure_acknowledged',
      'marketing_opt_in',
      'terms_update_ack'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'review_dispute_status'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.review_dispute_status AS ENUM (
      'open',
      'under_review',
      'resolved',
      'rejected'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'review_reply_status'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.review_reply_status AS ENUM (
      'published',
      'hidden',
      'removed'
    );
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Trust tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trust_disclosure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listing(id) ON DELETE CASCADE,
  disclosure_kind public.trust_disclosure_kind NOT NULL,
  headline VARCHAR(160) NOT NULL,
  disclosure_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_by_admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trust_disclosure_listing
  ON public.trust_disclosure(listing_id);
CREATE INDEX IF NOT EXISTS idx_trust_disclosure_kind
  ON public.trust_disclosure(disclosure_kind);
CREATE UNIQUE INDEX IF NOT EXISTS uq_trust_disclosure_active_kind
  ON public.trust_disclosure(listing_id, disclosure_kind)
  WHERE is_active = true;

CREATE TABLE IF NOT EXISTS public.trust_consent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listing(id) ON DELETE SET NULL,
  disclosure_id UUID REFERENCES public.trust_disclosure(id) ON DELETE SET NULL,
  consent_type public.trust_consent_type NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT true,
  consent_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trust_consent_user
  ON public.trust_consent(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_consent_listing
  ON public.trust_consent(listing_id);
CREATE INDEX IF NOT EXISTS idx_trust_consent_disclosure
  ON public.trust_consent(disclosure_id);
CREATE INDEX IF NOT EXISTS idx_trust_consent_type
  ON public.trust_consent(consent_type);

CREATE TABLE IF NOT EXISTS public.review_dispute (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.review(id) ON DELETE CASCADE,
  requester_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.business(id) ON DELETE CASCADE,
  status public.review_dispute_status NOT NULL DEFAULT 'open',
  reason_text TEXT NOT NULL,
  evidence_file_id UUID REFERENCES public.file_upload(id) ON DELETE SET NULL,
  resolved_by_admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_dispute_review
  ON public.review_dispute(review_id);
CREATE INDEX IF NOT EXISTS idx_review_dispute_business
  ON public.review_dispute(business_id);
CREATE INDEX IF NOT EXISTS idx_review_dispute_requester
  ON public.review_dispute(requester_user_id);
CREATE INDEX IF NOT EXISTS idx_review_dispute_status
  ON public.review_dispute(status);

CREATE TABLE IF NOT EXISTS public.review_reply (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.review(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.business(id) ON DELETE CASCADE,
  responder_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  status public.review_reply_status NOT NULL DEFAULT 'published',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_review_reply_review
  ON public.review_reply(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reply_business
  ON public.review_reply(business_id);
CREATE INDEX IF NOT EXISTS idx_review_reply_status
  ON public.review_reply(status);
CREATE UNIQUE INDEX IF NOT EXISTS uq_review_reply_active_business
  ON public.review_reply(review_id, business_id)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- Trust updated_at triggers
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS update_trust_disclosure_updated_at ON public.trust_disclosure;
CREATE TRIGGER update_trust_disclosure_updated_at
  BEFORE UPDATE ON public.trust_disclosure
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_review_dispute_updated_at ON public.review_dispute;
CREATE TRIGGER update_review_dispute_updated_at
  BEFORE UPDATE ON public.review_dispute
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_review_reply_updated_at ON public.review_reply;
CREATE TRIGGER update_review_reply_updated_at
  BEFORE UPDATE ON public.review_reply
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Badge policy enforcement: Verified badge and promoted badge require distinct
-- disclosure surfaces.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_listing_badge_policy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_featured = true THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.trust_disclosure td
      WHERE td.listing_id = NEW.id
        AND td.disclosure_kind = 'promotion'::public.trust_disclosure_kind
        AND td.is_active = true
    ) THEN
      RAISE EXCEPTION
        'Featured listings must include an active promotion disclosure (listing_id=%).',
        NEW.id
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  IF NEW.verification_level <> 'none'::public.verification_level THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.trust_disclosure td
      WHERE td.listing_id = NEW.id
        AND td.disclosure_kind = 'verification'::public.trust_disclosure_kind
        AND td.is_active = true
    ) THEN
      RAISE EXCEPTION
        'Verified listings must include an active verification disclosure (listing_id=%).',
        NEW.id
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_listing_badge_policy_trigger ON public.listing;
CREATE TRIGGER enforce_listing_badge_policy_trigger
  BEFORE INSERT OR UPDATE OF is_featured, verification_level
  ON public.listing
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_listing_badge_policy();

-- ---------------------------------------------------------------------------
-- Trust audit triggers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.audit_listing_trust_state_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_id UUID := COALESCE(auth.uid(), NEW.claimed_by_user_id, OLD.claimed_by_user_id);
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

DROP TRIGGER IF EXISTS audit_listing_trust_state_change_trigger ON public.listing;
CREATE TRIGGER audit_listing_trust_state_change_trigger
  AFTER UPDATE OF verification_level, is_featured
  ON public.listing
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_listing_trust_state_change();

CREATE OR REPLACE FUNCTION public.audit_trust_consent_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_event (actor_user_id, action, entity_type, entity_id, metadata_json)
  VALUES (
    COALESCE(auth.uid(), NEW.user_id),
    'trust.consent_recorded',
    'trust_consent',
    NEW.id,
    jsonb_build_object(
      'consent_type', NEW.consent_type,
      'granted', NEW.granted,
      'listing_id', NEW.listing_id,
      'disclosure_id', NEW.disclosure_id
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_trust_consent_insert_trigger ON public.trust_consent;
CREATE TRIGGER audit_trust_consent_insert_trigger
  AFTER INSERT ON public.trust_consent
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trust_consent_insert();

CREATE OR REPLACE FUNCTION public.audit_review_dispute_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_id UUID := COALESCE(auth.uid(), NEW.requester_user_id, OLD.requester_user_id);
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_event (actor_user_id, action, entity_type, entity_id, metadata_json)
    VALUES (
      actor_id,
      'trust.review_dispute_created',
      'review_dispute',
      NEW.id,
      jsonb_build_object(
        'review_id', NEW.review_id,
        'business_id', NEW.business_id,
        'status', NEW.status
      )
    );
  ELSE
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.audit_event (actor_user_id, action, entity_type, entity_id, metadata_json)
      VALUES (
        actor_id,
        'trust.review_dispute_status_changed',
        'review_dispute',
        NEW.id,
        jsonb_build_object(
          'from', OLD.status,
          'to', NEW.status
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_review_dispute_change_trigger ON public.review_dispute;
CREATE TRIGGER audit_review_dispute_change_trigger
  AFTER INSERT OR UPDATE
  ON public.review_dispute
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_review_dispute_change();

CREATE OR REPLACE FUNCTION public.audit_review_reply_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_id UUID := COALESCE(auth.uid(), NEW.responder_user_id, OLD.responder_user_id);
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_event (actor_user_id, action, entity_type, entity_id, metadata_json)
    VALUES (
      actor_id,
      'trust.review_reply_created',
      'review_reply',
      NEW.id,
      jsonb_build_object(
        'review_id', NEW.review_id,
        'business_id', NEW.business_id,
        'status', NEW.status
      )
    );
  ELSE
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.audit_event (actor_user_id, action, entity_type, entity_id, metadata_json)
      VALUES (
        actor_id,
        'trust.review_reply_status_changed',
        'review_reply',
        NEW.id,
        jsonb_build_object(
          'from', OLD.status,
          'to', NEW.status
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_review_reply_change_trigger ON public.review_reply;
CREATE TRIGGER audit_review_reply_change_trigger
  AFTER INSERT OR UPDATE
  ON public.review_reply
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_review_reply_change();

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trust_disclosure TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trust_consent TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_dispute TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_reply TO authenticated;

GRANT ALL ON public.trust_disclosure TO service_role;
GRANT ALL ON public.trust_consent TO service_role;
GRANT ALL ON public.review_dispute TO service_role;
GRANT ALL ON public.review_reply TO service_role;

GRANT SELECT ON public.trust_disclosure TO anon;
GRANT SELECT ON public.review_reply TO anon;

-- ---------------------------------------------------------------------------
-- RLS on new trust tables
-- ---------------------------------------------------------------------------
ALTER TABLE public.trust_disclosure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_dispute ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reply ENABLE ROW LEVEL SECURITY;

-- trust_disclosure
CREATE POLICY trust_disclosure_admin_all
ON public.trust_disclosure
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY trust_disclosure_public_read
ON public.trust_disclosure
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY trust_disclosure_business_manage
ON public.trust_disclosure
FOR ALL
TO authenticated
USING (public.is_listing_business_member(listing_id))
WITH CHECK (public.is_listing_business_member(listing_id));

-- trust_consent
CREATE POLICY trust_consent_admin_all
ON public.trust_consent
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY trust_consent_owner_insert
ON public.trust_consent
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY trust_consent_owner_read
ON public.trust_consent
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY trust_consent_listing_business_read
ON public.trust_consent
FOR SELECT
TO authenticated
USING (
  listing_id IS NOT NULL
  AND public.is_listing_business_member(listing_id)
);

-- review_dispute
CREATE POLICY review_dispute_admin_all
ON public.review_dispute
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY review_dispute_requester_or_business_read
ON public.review_dispute
FOR SELECT
TO authenticated
USING (
  requester_user_id = auth.uid()
  OR public.is_business_member(business_id)
);

CREATE POLICY review_dispute_requester_insert
ON public.review_dispute
FOR INSERT
TO authenticated
WITH CHECK (
  requester_user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.review r
    WHERE r.id = review_id
      AND r.business_id = business_id
      AND (
        r.consumer_user_id = auth.uid()
        OR public.is_business_member(r.business_id)
      )
  )
);

CREATE POLICY review_dispute_requester_update
ON public.review_dispute
FOR UPDATE
TO authenticated
USING (requester_user_id = auth.uid())
WITH CHECK (requester_user_id = auth.uid());

-- review_reply
CREATE POLICY review_reply_admin_all
ON public.review_reply
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY review_reply_public_read
ON public.review_reply
FOR SELECT
TO anon, authenticated
USING (
  status = 'published'::public.review_reply_status
  AND deleted_at IS NULL
);

CREATE POLICY review_reply_business_manage
ON public.review_reply
FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (
  public.is_business_member(business_id)
  AND EXISTS (
    SELECT 1 FROM public.review r
    WHERE r.id = review_id
      AND r.business_id = business_id
  )
);

COMMIT;
