-- Phase 6: Authentication + Tenancy + RLS expansion
-- Goal:
-- 1) Enable RLS on all public tables.
-- 2) Ensure every table has at least one policy.
-- 3) Enforce tenant boundaries for consumer/advisor/admin roles.

BEGIN;

-- ---------------------------------------------------------------------------
-- Grants: allow role access to hit RLS policies.
-- RLS still controls row visibility and write constraints.
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Public read grants for marketplace catalog/search surfaces.
GRANT SELECT ON TABLE public.location TO anon;
GRANT SELECT ON TABLE public.business TO anon;
GRANT SELECT ON TABLE public.listing TO anon;
GRANT SELECT ON TABLE public.listing_service_area TO anon;
GRANT SELECT ON TABLE public.advisor_profile TO anon;
GRANT SELECT ON TABLE public.specialty TO anon;
GRANT SELECT ON TABLE public.listing_specialty TO anon;
GRANT SELECT ON TABLE public.service_offering TO anon;
GRANT SELECT ON TABLE public.listing_service_offering TO anon;
GRANT SELECT ON TABLE public.advisor_availability TO anon;
GRANT SELECT ON TABLE public.qualification TO anon;
GRANT SELECT ON TABLE public.advisor_qualification TO anon;
GRANT SELECT ON TABLE public.review TO anon;
GRANT SELECT ON TABLE public.subscription_plan TO anon;

-- ---------------------------------------------------------------------------
-- Helper functions for policy checks
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.role
  FROM public.users u
  WHERE u.id = auth.uid()
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_user_role() = 'admin'::public.user_role, false)
$$;

CREATE OR REPLACE FUNCTION public.is_business_member(target_business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.advisor_business_role abr
    WHERE abr.business_id = target_business_id
      AND abr.user_id = auth.uid()
      AND abr.status = 'active'::public.business_role_status
  )
$$;

CREATE OR REPLACE FUNCTION public.is_business_admin(target_business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.advisor_business_role abr
    WHERE abr.business_id = target_business_id
      AND abr.user_id = auth.uid()
      AND abr.status = 'active'::public.business_role_status
      AND abr.role IN ('owner'::public.business_role, 'admin'::public.business_role)
  )
$$;

CREATE OR REPLACE FUNCTION public.is_listing_business_member(target_listing_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.listing l
    WHERE l.id = target_listing_id
      AND public.is_business_member(l.business_id)
  )
$$;

CREATE OR REPLACE FUNCTION public.is_conversation_participant(target_conversation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversation c
    WHERE c.id = target_conversation_id
      AND (
        c.consumer_user_id = auth.uid()
        OR public.is_business_member(c.business_id)
      )
  )
$$;

CREATE OR REPLACE FUNCTION public.is_message_participant(target_message_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.message m
    JOIN public.conversation c ON c.id = m.conversation_id
    WHERE m.id = target_message_id
      AND (
        c.consumer_user_id = auth.uid()
        OR public.is_business_member(c.business_id)
      )
  )
$$;

CREATE OR REPLACE FUNCTION public.is_client_record_participant(target_client_record_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.client_record cr
    WHERE cr.id = target_client_record_id
      AND (
        cr.consumer_user_id = auth.uid()
        OR public.is_business_member(cr.business_id)
      )
  )
$$;

-- ---------------------------------------------------------------------------
-- Reset current policy set so this migration is idempotent.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        policyname LIKE '%\_admin\_all' ESCAPE '\'
        OR policyname = ANY (ARRAY[
          'users_self_select',
          'users_self_update',
          'users_self_profile_update',
          'users_admin_role_manage',
          'location_public_read',
          'business_public_read',
          'listing_public_read',
          'listing_service_area_public_read',
          'advisor_profile_public_read',
          'specialty_public_read',
          'service_offering_public_read',
          'listing_specialty_public_read',
          'listing_service_offering_public_read',
          'advisor_availability_public_read',
          'qualification_public_read',
          'advisor_qualification_public_read',
          'subscription_plan_public_read',
          'advisor_business_role_self_or_business_admin_read',
          'advisor_business_role_business_admin_manage',
          'business_member_read',
          'business_member_update',
          'listing_business_manage',
          'listing_service_area_business_manage',
          'listing_specialty_business_manage',
          'listing_service_offering_business_manage',
          'advisor_availability_business_manage',
          'advisor_profile_owner_or_business_manage',
          'advisor_qualification_owner_or_business_manage',
          'credential_owner_or_business_manage',
          'file_upload_owner_read',
          'file_upload_owner_insert',
          'file_upload_owner_update',
          'file_upload_owner_delete',
          'lead_consumer_read',
          'lead_consumer_insert',
          'lead_business_read',
          'lead_business_update',
          'client_record_consumer_read',
          'client_record_business_manage',
          'conversation_consumer_read',
          'conversation_consumer_update',
          'conversation_consumer_insert',
          'conversation_business_manage',
          'message_participant_read',
          'message_participant_insert',
          'message_sender_update',
          'message_sender_delete',
          'message_read_receipt_participant_read',
          'message_read_receipt_owner_insert',
          'message_read_receipt_owner_delete',
          'message_attachment_participant_read',
          'message_attachment_participant_insert',
          'message_attachment_participant_delete',
          'booking_consumer_read',
          'booking_business_manage',
          'review_public_published_read',
          'review_consumer_read',
          'review_consumer_insert',
          'review_consumer_update',
          'review_business_read',
          'user_shortlist_owner_read',
          'user_shortlist_owner_insert',
          'user_shortlist_owner_delete',
          'claim_request_requester_insert',
          'claim_request_requester_or_business_read',
          'claim_request_evidence_requester_or_business_read',
          'claim_request_evidence_requester_insert',
          'advisor_note_participant_manage',
          'advisor_note_revision_participant_manage',
          'advisor_note_business_member_read',
          'advisor_note_business_member_insert',
          'advisor_note_business_member_update',
          'advisor_note_business_member_delete',
          'advisor_note_revision_business_member_read',
          'advisor_note_revision_business_member_insert',
          'advisor_note_revision_business_member_update',
          'advisor_note_revision_business_member_delete',
          'task_owner_or_client_record_member_manage',
          'copilot_run_business_or_advisor_manage',
          'copilot_input_artifact_participant_manage',
          'copilot_output_participant_manage',
          'subscription_business_manage',
          'invoice_business_manage',
          'payment_method_business_manage',
          'notification_owner_manage',
          'audit_event_actor_read',
          'audit_event_actor_insert'
        ])
      )
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      r.policyname,
      r.schemaname,
      r.tablename
    );
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS on every public table.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- Baseline admin policy on every table.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
      t.tablename || '_admin_all',
      t.tablename
    );
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- Table-specific policies (non-admin paths)
-- ---------------------------------------------------------------------------

-- Users: self profile access.
CREATE POLICY users_self_select
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

REVOKE UPDATE ON TABLE public.users FROM authenticated;
GRANT UPDATE (first_name, last_name, display_name, avatar_url, phone, updated_at) ON TABLE public.users TO authenticated;
GRANT UPDATE (role) ON TABLE public.users TO authenticated;

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

-- Public marketplace catalog.
CREATE POLICY location_public_read
ON public.location
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY business_public_read
ON public.business
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL);

CREATE POLICY listing_public_read
ON public.listing
FOR SELECT
TO anon, authenticated
USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY listing_service_area_public_read
ON public.listing_service_area
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY advisor_profile_public_read
ON public.advisor_profile
FOR SELECT
TO anon, authenticated
USING (deleted_at IS NULL);

CREATE POLICY specialty_public_read
ON public.specialty
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY service_offering_public_read
ON public.service_offering
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY listing_specialty_public_read
ON public.listing_specialty
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY listing_service_offering_public_read
ON public.listing_service_offering
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY advisor_availability_public_read
ON public.advisor_availability
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY qualification_public_read
ON public.qualification
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY advisor_qualification_public_read
ON public.advisor_qualification
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY subscription_plan_public_read
ON public.subscription_plan
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Business role relationships.
CREATE POLICY advisor_business_role_self_or_business_admin_read
ON public.advisor_business_role
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_business_admin(business_id)
);

CREATE POLICY advisor_business_role_business_admin_manage
ON public.advisor_business_role
FOR ALL
TO authenticated
USING (public.is_business_admin(business_id))
WITH CHECK (public.is_business_admin(business_id));

-- Business/listing/profile management.
CREATE POLICY business_member_read
ON public.business
FOR SELECT
TO authenticated
USING (public.is_business_member(id));

CREATE POLICY business_member_update
ON public.business
FOR UPDATE
TO authenticated
USING (public.is_business_member(id))
WITH CHECK (public.is_business_member(id));

CREATE POLICY listing_business_manage
ON public.listing
FOR ALL
TO authenticated
USING (public.is_listing_business_member(id))
WITH CHECK (public.is_listing_business_member(id));

CREATE POLICY listing_service_area_business_manage
ON public.listing_service_area
FOR ALL
TO authenticated
USING (public.is_listing_business_member(listing_id))
WITH CHECK (public.is_listing_business_member(listing_id));

CREATE POLICY listing_specialty_business_manage
ON public.listing_specialty
FOR ALL
TO authenticated
USING (public.is_listing_business_member(listing_id))
WITH CHECK (public.is_listing_business_member(listing_id));

CREATE POLICY listing_service_offering_business_manage
ON public.listing_service_offering
FOR ALL
TO authenticated
USING (public.is_listing_business_member(listing_id))
WITH CHECK (public.is_listing_business_member(listing_id));

CREATE POLICY advisor_availability_business_manage
ON public.advisor_availability
FOR ALL
TO authenticated
USING (public.is_listing_business_member(listing_id))
WITH CHECK (public.is_listing_business_member(listing_id));

CREATE POLICY advisor_profile_owner_or_business_manage
ON public.advisor_profile
FOR ALL
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_business_member(business_id)
)
WITH CHECK (
  user_id = auth.uid()
  OR public.is_business_member(business_id)
);

CREATE POLICY advisor_qualification_owner_or_business_manage
ON public.advisor_qualification
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.advisor_profile ap
    WHERE ap.id = advisor_profile_id
      AND (ap.user_id = auth.uid() OR public.is_business_member(ap.business_id))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.advisor_profile ap
    WHERE ap.id = advisor_profile_id
      AND (ap.user_id = auth.uid() OR public.is_business_member(ap.business_id))
  )
);

CREATE POLICY credential_owner_or_business_manage
ON public.credential
FOR ALL
TO authenticated
USING (
  (advisor_profile_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.advisor_profile ap
    WHERE ap.id = advisor_profile_id
      AND (ap.user_id = auth.uid() OR public.is_business_member(ap.business_id))
  ))
  OR (business_id IS NOT NULL AND public.is_business_member(business_id))
)
WITH CHECK (
  (advisor_profile_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.advisor_profile ap
    WHERE ap.id = advisor_profile_id
      AND (ap.user_id = auth.uid() OR public.is_business_member(ap.business_id))
  ))
  OR (business_id IS NOT NULL AND public.is_business_member(business_id))
);

-- File uploads: owner access.
CREATE POLICY file_upload_owner_read
ON public.file_upload
FOR SELECT
TO authenticated
USING (uploader_user_id = auth.uid());

CREATE POLICY file_upload_owner_insert
ON public.file_upload
FOR INSERT
TO authenticated
WITH CHECK (uploader_user_id IS NULL OR uploader_user_id = auth.uid());

CREATE POLICY file_upload_owner_update
ON public.file_upload
FOR UPDATE
TO authenticated
USING (uploader_user_id = auth.uid())
WITH CHECK (uploader_user_id = auth.uid());

CREATE POLICY file_upload_owner_delete
ON public.file_upload
FOR DELETE
TO authenticated
USING (uploader_user_id = auth.uid());

-- Lead + client lifecycle.
CREATE POLICY lead_consumer_read
ON public.lead
FOR SELECT
TO authenticated
USING (consumer_user_id = auth.uid());

CREATE POLICY lead_consumer_insert
ON public.lead
FOR INSERT
TO authenticated
WITH CHECK (consumer_user_id = auth.uid());

CREATE POLICY lead_business_read
ON public.lead
FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY lead_business_update
ON public.lead
FOR UPDATE
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

CREATE POLICY client_record_consumer_read
ON public.client_record
FOR SELECT
TO authenticated
USING (consumer_user_id = auth.uid());

CREATE POLICY client_record_business_manage
ON public.client_record
FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- Conversations/messages.
CREATE POLICY conversation_consumer_read
ON public.conversation
FOR SELECT
TO authenticated
USING (consumer_user_id = auth.uid());

CREATE POLICY conversation_consumer_update
ON public.conversation
FOR UPDATE
TO authenticated
USING (consumer_user_id = auth.uid())
WITH CHECK (consumer_user_id = auth.uid());

CREATE POLICY conversation_consumer_insert
ON public.conversation
FOR INSERT
TO authenticated
WITH CHECK (consumer_user_id = auth.uid());

CREATE POLICY conversation_business_manage
ON public.conversation
FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

CREATE POLICY message_participant_read
ON public.message
FOR SELECT
TO authenticated
USING (public.is_conversation_participant(conversation_id));

CREATE POLICY message_participant_insert
ON public.message
FOR INSERT
TO authenticated
WITH CHECK (
  sender_user_id = auth.uid()
  AND public.is_conversation_participant(conversation_id)
);

CREATE POLICY message_sender_update
ON public.message
FOR UPDATE
TO authenticated
USING (sender_user_id = auth.uid())
WITH CHECK (sender_user_id = auth.uid());

CREATE POLICY message_sender_delete
ON public.message
FOR DELETE
TO authenticated
USING (sender_user_id = auth.uid());

CREATE POLICY message_read_receipt_participant_read
ON public.message_read_receipt
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_message_participant(message_id)
);

CREATE POLICY message_read_receipt_owner_insert
ON public.message_read_receipt
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND public.is_message_participant(message_id)
);

CREATE POLICY message_read_receipt_owner_delete
ON public.message_read_receipt
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY message_attachment_participant_read
ON public.message_attachment
FOR SELECT
TO authenticated
USING (public.is_message_participant(message_id));

CREATE POLICY message_attachment_participant_insert
ON public.message_attachment
FOR INSERT
TO authenticated
WITH CHECK (public.is_message_participant(message_id));

CREATE POLICY message_attachment_participant_delete
ON public.message_attachment
FOR DELETE
TO authenticated
USING (public.is_message_participant(message_id));

-- Bookings.
CREATE POLICY booking_consumer_read
ON public.booking
FOR SELECT
TO authenticated
USING (
  (lead_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.lead l WHERE l.id = lead_id AND l.consumer_user_id = auth.uid()
  ))
  OR
  (client_record_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.client_record cr WHERE cr.id = client_record_id AND cr.consumer_user_id = auth.uid()
  ))
);

CREATE POLICY booking_business_manage
ON public.booking
FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- Reviews + shortlist.
CREATE POLICY review_public_published_read
ON public.review
FOR SELECT
TO anon, authenticated
USING (status = 'published'::public.review_status);

CREATE POLICY review_consumer_read
ON public.review
FOR SELECT
TO authenticated
USING (consumer_user_id = auth.uid());

CREATE POLICY review_consumer_insert
ON public.review
FOR INSERT
TO authenticated
WITH CHECK (consumer_user_id = auth.uid());

CREATE POLICY review_consumer_update
ON public.review
FOR UPDATE
TO authenticated
USING (consumer_user_id = auth.uid())
WITH CHECK (consumer_user_id = auth.uid());

CREATE POLICY review_business_read
ON public.review
FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY user_shortlist_owner_read
ON public.user_shortlist
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY user_shortlist_owner_insert
ON public.user_shortlist
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY user_shortlist_owner_delete
ON public.user_shortlist
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Claims.
CREATE POLICY claim_request_requester_insert
ON public.claim_request
FOR INSERT
TO authenticated
WITH CHECK (requester_user_id = auth.uid());

CREATE POLICY claim_request_requester_or_business_read
ON public.claim_request
FOR SELECT
TO authenticated
USING (
  requester_user_id = auth.uid()
  OR public.is_business_member(business_id)
);

CREATE POLICY claim_request_evidence_requester_or_business_read
ON public.claim_request_evidence
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.claim_request cr
    WHERE cr.id = claim_request_id
      AND (cr.requester_user_id = auth.uid() OR public.is_business_member(cr.business_id))
  )
);

CREATE POLICY claim_request_evidence_requester_insert
ON public.claim_request_evidence
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.claim_request cr
    WHERE cr.id = claim_request_id
      AND cr.requester_user_id = auth.uid()
  )
);

-- Advisor workspace artifacts.
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

CREATE POLICY task_owner_or_client_record_member_manage
ON public.task
FOR ALL
TO authenticated
USING (
  owner_user_id = auth.uid()
  OR (client_record_id IS NOT NULL AND public.is_client_record_participant(client_record_id))
)
WITH CHECK (
  owner_user_id = auth.uid()
  OR (client_record_id IS NOT NULL AND public.is_client_record_participant(client_record_id))
);

CREATE POLICY copilot_run_business_or_advisor_manage
ON public.copilot_run
FOR ALL
TO authenticated
USING (
  advisor_user_id = auth.uid()
  OR public.is_business_member(business_id)
)
WITH CHECK (
  advisor_user_id = auth.uid()
  OR public.is_business_member(business_id)
);

CREATE POLICY copilot_input_artifact_participant_manage
ON public.copilot_input_artifact
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.copilot_run cr
    WHERE cr.id = copilot_run_id
      AND (cr.advisor_user_id = auth.uid() OR public.is_business_member(cr.business_id))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.copilot_run cr
    WHERE cr.id = copilot_run_id
      AND (cr.advisor_user_id = auth.uid() OR public.is_business_member(cr.business_id))
  )
);

CREATE POLICY copilot_output_participant_manage
ON public.copilot_output
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.copilot_run cr
    WHERE cr.id = copilot_run_id
      AND (cr.advisor_user_id = auth.uid() OR public.is_business_member(cr.business_id))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.copilot_run cr
    WHERE cr.id = copilot_run_id
      AND (cr.advisor_user_id = auth.uid() OR public.is_business_member(cr.business_id))
  )
);

-- Billing.
CREATE POLICY subscription_business_manage
ON public.subscription
FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

CREATE POLICY invoice_business_manage
ON public.invoice
FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

CREATE POLICY payment_method_business_manage
ON public.payment_method
FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- Notifications.
CREATE POLICY notification_owner_manage
ON public.notification
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Audit log: actors can write/read their own audit events.
CREATE POLICY audit_event_actor_read
ON public.audit_event
FOR SELECT
TO authenticated
USING (actor_user_id = auth.uid());

CREATE POLICY audit_event_actor_insert
ON public.audit_event
FOR INSERT
TO authenticated
WITH CHECK (actor_user_id IS NULL OR actor_user_id = auth.uid());

COMMIT;
