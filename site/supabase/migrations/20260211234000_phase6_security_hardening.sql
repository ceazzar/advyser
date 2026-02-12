-- Phase 6 security hardening follow-up.
-- Purpose:
-- 1) Block self role escalation on public.users.
-- 2) Restrict public.users updates to safe profile fields for non-admin users.
-- 3) Keep advisor notes/revisions internal to advisor business members.

BEGIN;

-- ---------------------------------------------------------------------------
-- Users: restrict update surface and protect role mutations.
-- ---------------------------------------------------------------------------
REVOKE UPDATE ON TABLE public.users FROM authenticated;
GRANT UPDATE (first_name, last_name, display_name, avatar_url, phone, updated_at) ON TABLE public.users TO authenticated;
GRANT UPDATE (role) ON TABLE public.users TO authenticated;

DROP POLICY IF EXISTS users_self_update ON public.users;
DROP POLICY IF EXISTS users_self_profile_update ON public.users;
DROP POLICY IF EXISTS users_admin_role_manage ON public.users;

CREATE POLICY users_self_profile_update
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role = (
    SELECT u.role
    FROM public.users u
    WHERE u.id = auth.uid()
  )
);

CREATE POLICY users_admin_role_manage
ON public.users
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.enforce_users_role_update_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Direct SQL / service-role maintenance paths do not carry auth JWT context.
    IF auth.uid() IS NULL THEN
      RETURN NEW;
    END IF;

    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_role_update_guard ON public.users;
CREATE TRIGGER users_role_update_guard
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.enforce_users_role_update_guard();

-- ---------------------------------------------------------------------------
-- Advisor notes: advisor-business members only (no consumer participation).
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS advisor_note_participant_manage ON public.advisor_note;
DROP POLICY IF EXISTS advisor_note_business_member_read ON public.advisor_note;
DROP POLICY IF EXISTS advisor_note_business_member_insert ON public.advisor_note;
DROP POLICY IF EXISTS advisor_note_business_member_update ON public.advisor_note;
DROP POLICY IF EXISTS advisor_note_business_member_delete ON public.advisor_note;

CREATE POLICY advisor_note_business_member_read
ON public.advisor_note
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.client_record cr
    WHERE cr.id = client_record_id
      AND public.is_business_member(cr.business_id)
  )
);

CREATE POLICY advisor_note_business_member_insert
ON public.advisor_note
FOR INSERT
TO authenticated
WITH CHECK (
  author_user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.client_record cr
    WHERE cr.id = client_record_id
      AND public.is_business_member(cr.business_id)
  )
);

CREATE POLICY advisor_note_business_member_update
ON public.advisor_note
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.client_record cr
    WHERE cr.id = client_record_id
      AND public.is_business_member(cr.business_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.client_record cr
    WHERE cr.id = client_record_id
      AND public.is_business_member(cr.business_id)
  )
);

CREATE POLICY advisor_note_business_member_delete
ON public.advisor_note
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.client_record cr
    WHERE cr.id = client_record_id
      AND public.is_business_member(cr.business_id)
  )
);

DROP POLICY IF EXISTS advisor_note_revision_participant_manage ON public.advisor_note_revision;
DROP POLICY IF EXISTS advisor_note_revision_business_member_read ON public.advisor_note_revision;
DROP POLICY IF EXISTS advisor_note_revision_business_member_insert ON public.advisor_note_revision;
DROP POLICY IF EXISTS advisor_note_revision_business_member_update ON public.advisor_note_revision;
DROP POLICY IF EXISTS advisor_note_revision_business_member_delete ON public.advisor_note_revision;

CREATE POLICY advisor_note_revision_business_member_read
ON public.advisor_note_revision
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.advisor_note an
    JOIN public.client_record cr ON cr.id = an.client_record_id
    WHERE an.id = advisor_note_id
      AND public.is_business_member(cr.business_id)
  )
);

CREATE POLICY advisor_note_revision_business_member_insert
ON public.advisor_note_revision
FOR INSERT
TO authenticated
WITH CHECK (
  created_by_user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.advisor_note an
    JOIN public.client_record cr ON cr.id = an.client_record_id
    WHERE an.id = advisor_note_id
      AND public.is_business_member(cr.business_id)
  )
);

CREATE POLICY advisor_note_revision_business_member_update
ON public.advisor_note_revision
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.advisor_note an
    JOIN public.client_record cr ON cr.id = an.client_record_id
    WHERE an.id = advisor_note_id
      AND public.is_business_member(cr.business_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.advisor_note an
    JOIN public.client_record cr ON cr.id = an.client_record_id
    WHERE an.id = advisor_note_id
      AND public.is_business_member(cr.business_id)
  )
);

CREATE POLICY advisor_note_revision_business_member_delete
ON public.advisor_note_revision
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.advisor_note an
    JOIN public.client_record cr ON cr.id = an.client_record_id
    WHERE an.id = advisor_note_id
      AND public.is_business_member(cr.business_id)
  )
);

COMMIT;
