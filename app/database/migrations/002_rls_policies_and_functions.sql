-- Migration: RLS Policies & Transaction Functions
-- Phase 5: Backend APIs - Week 0 Security Foundation
-- Created: 2026-02-03
--
-- What this does:
-- 1. Enables RLS on all PII-containing tables
-- 2. Creates access policies for consumers, business members, and public
-- 3. Adds transaction functions for multi-table mutations
-- 4. Adds optimistic locking and idempotency support

-- ============================================================================
-- LISTING TABLE (Public Read, Business Write)
-- ============================================================================

ALTER TABLE listing ENABLE ROW LEVEL SECURITY;

-- Public can read active listings
DROP POLICY IF EXISTS "Public can read active listings" ON listing;
CREATE POLICY "Public can read active listings" ON listing
  FOR SELECT USING (is_active = true AND deleted_at IS NULL);

-- Business members can update their own listings
DROP POLICY IF EXISTS "Business members can update own listings" ON listing;
CREATE POLICY "Business members can update own listings" ON listing
  FOR UPDATE USING (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Business members can insert listings for their business
DROP POLICY IF EXISTS "Business members can create listings" ON listing;
CREATE POLICY "Business members can create listings" ON listing
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- ============================================================================
-- LEAD TABLE (Consumer sees own, Business sees assigned)
-- ============================================================================

ALTER TABLE lead ENABLE ROW LEVEL SECURITY;

-- Consumers can see their own leads
DROP POLICY IF EXISTS "Consumers see own leads" ON lead;
CREATE POLICY "Consumers see own leads" ON lead
  FOR SELECT USING (auth.uid() = consumer_user_id);

-- Business members can see leads for their business
DROP POLICY IF EXISTS "Business members see business leads" ON lead;
CREATE POLICY "Business members see business leads" ON lead
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Consumers can create leads (request intro)
DROP POLICY IF EXISTS "Consumers can create leads" ON lead;
CREATE POLICY "Consumers can create leads" ON lead
  FOR INSERT WITH CHECK (auth.uid() = consumer_user_id);

-- Business members can update leads (accept/decline)
DROP POLICY IF EXISTS "Business members can update leads" ON lead;
CREATE POLICY "Business members can update leads" ON lead
  FOR UPDATE USING (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- ============================================================================
-- CONVERSATION TABLE (Participants only)
-- ============================================================================

ALTER TABLE conversation ENABLE ROW LEVEL SECURITY;

-- Consumers can see their own conversations
DROP POLICY IF EXISTS "Consumers see own conversations" ON conversation;
CREATE POLICY "Consumers see own conversations" ON conversation
  FOR SELECT USING (auth.uid() = consumer_user_id);

-- Business members can see business conversations
DROP POLICY IF EXISTS "Business members see business conversations" ON conversation;
CREATE POLICY "Business members see business conversations" ON conversation
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Both parties can update conversation (archive, etc.)
DROP POLICY IF EXISTS "Participants can update conversations" ON conversation;
CREATE POLICY "Participants can update conversations" ON conversation
  FOR UPDATE USING (
    auth.uid() = consumer_user_id OR
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Conversations are created by system (via functions) - service role only
-- No INSERT policy for regular users

-- ============================================================================
-- MESSAGE TABLE (Conversation participants only)
-- ============================================================================

ALTER TABLE message ENABLE ROW LEVEL SECURITY;

-- Participants can read messages in their conversations
DROP POLICY IF EXISTS "Conversation participants see messages" ON message;
CREATE POLICY "Conversation participants see messages" ON message
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversation WHERE
        auth.uid() = consumer_user_id OR
        business_id IN (
          SELECT business_id FROM advisor_business_role
          WHERE user_id = auth.uid() AND status = 'active'
        )
    )
  );

-- Participants can send messages to their conversations
DROP POLICY IF EXISTS "Participants can send messages" ON message;
CREATE POLICY "Participants can send messages" ON message
  FOR INSERT WITH CHECK (
    auth.uid() = sender_user_id AND
    conversation_id IN (
      SELECT id FROM conversation WHERE
        auth.uid() = consumer_user_id OR
        business_id IN (
          SELECT business_id FROM advisor_business_role
          WHERE user_id = auth.uid() AND status = 'active'
        )
    )
  );

-- Sender can update own messages (edit)
DROP POLICY IF EXISTS "Sender can edit own messages" ON message;
CREATE POLICY "Sender can edit own messages" ON message
  FOR UPDATE USING (auth.uid() = sender_user_id);

-- ============================================================================
-- MESSAGE READ RECEIPT TABLE
-- ============================================================================

ALTER TABLE message_read_receipt ENABLE ROW LEVEL SECURITY;

-- Users can see read receipts for messages they can access
DROP POLICY IF EXISTS "Users see read receipts for accessible messages" ON message_read_receipt;
CREATE POLICY "Users see read receipts for accessible messages" ON message_read_receipt
  FOR SELECT USING (
    message_id IN (
      SELECT id FROM message WHERE conversation_id IN (
        SELECT id FROM conversation WHERE
          auth.uid() = consumer_user_id OR
          business_id IN (
            SELECT business_id FROM advisor_business_role
            WHERE user_id = auth.uid() AND status = 'active'
          )
      )
    )
  );

-- Users can mark messages as read
DROP POLICY IF EXISTS "Users can mark messages read" ON message_read_receipt;
CREATE POLICY "Users can mark messages read" ON message_read_receipt
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- BOOKING TABLE (Participants only)
-- ============================================================================

ALTER TABLE booking ENABLE ROW LEVEL SECURITY;

-- Consumers can see bookings from their leads
DROP POLICY IF EXISTS "Consumers see own bookings" ON booking;
CREATE POLICY "Consumers see own bookings" ON booking
  FOR SELECT USING (
    lead_id IN (SELECT id FROM lead WHERE consumer_user_id = auth.uid())
  );

-- Business members can see their business bookings
DROP POLICY IF EXISTS "Business members see business bookings" ON booking;
CREATE POLICY "Business members see business bookings" ON booking
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Business members can create bookings
DROP POLICY IF EXISTS "Business members can create bookings" ON booking;
CREATE POLICY "Business members can create bookings" ON booking
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Both parties can update bookings (confirm, cancel, reschedule)
DROP POLICY IF EXISTS "Participants can update bookings" ON booking;
CREATE POLICY "Participants can update bookings" ON booking
  FOR UPDATE USING (
    lead_id IN (SELECT id FROM lead WHERE consumer_user_id = auth.uid()) OR
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- ============================================================================
-- REVIEW TABLE (Public read, Consumer write own)
-- ============================================================================

ALTER TABLE review ENABLE ROW LEVEL SECURITY;

-- Public can read published reviews
DROP POLICY IF EXISTS "Public can read published reviews" ON review;
CREATE POLICY "Public can read published reviews" ON review
  FOR SELECT USING (status = 'published');

-- Consumers can see their own reviews (any status)
DROP POLICY IF EXISTS "Consumers see own reviews" ON review;
CREATE POLICY "Consumers see own reviews" ON review
  FOR SELECT USING (auth.uid() = consumer_user_id);

-- Business members can see reviews for their business
DROP POLICY IF EXISTS "Business members see business reviews" ON review;
CREATE POLICY "Business members see business reviews" ON review
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Consumers can create reviews for their leads
DROP POLICY IF EXISTS "Consumers can create reviews" ON review;
CREATE POLICY "Consumers can create reviews" ON review
  FOR INSERT WITH CHECK (
    auth.uid() = consumer_user_id AND
    lead_id IN (SELECT id FROM lead WHERE consumer_user_id = auth.uid())
  );

-- Consumers can update their pending reviews
DROP POLICY IF EXISTS "Consumers can update own pending reviews" ON review;
CREATE POLICY "Consumers can update own pending reviews" ON review
  FOR UPDATE USING (auth.uid() = consumer_user_id AND status = 'pending');

-- ============================================================================
-- USER SHORTLIST TABLE (User owns their shortlist)
-- ============================================================================

ALTER TABLE user_shortlist ENABLE ROW LEVEL SECURITY;

-- Users can see their own shortlist
DROP POLICY IF EXISTS "Users see own shortlist" ON user_shortlist;
CREATE POLICY "Users see own shortlist" ON user_shortlist
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add to their shortlist
DROP POLICY IF EXISTS "Users can add to shortlist" ON user_shortlist;
CREATE POLICY "Users can add to shortlist" ON user_shortlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove from their shortlist
DROP POLICY IF EXISTS "Users can remove from shortlist" ON user_shortlist;
CREATE POLICY "Users can remove from shortlist" ON user_shortlist
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- CLIENT RECORD TABLE (Business members only)
-- ============================================================================

ALTER TABLE client_record ENABLE ROW LEVEL SECURITY;

-- Business members can see their clients
DROP POLICY IF EXISTS "Business members see clients" ON client_record;
CREATE POLICY "Business members see clients" ON client_record
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Business members can create clients
DROP POLICY IF EXISTS "Business members can create clients" ON client_record;
CREATE POLICY "Business members can create clients" ON client_record
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Business members can update their clients
DROP POLICY IF EXISTS "Business members can update clients" ON client_record;
CREATE POLICY "Business members can update clients" ON client_record
  FOR UPDATE USING (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- ============================================================================
-- ADVISOR BUSINESS ROLE TABLE (Members see own roles)
-- ============================================================================

ALTER TABLE advisor_business_role ENABLE ROW LEVEL SECURITY;

-- Users can see their own roles
DROP POLICY IF EXISTS "Users see own business roles" ON advisor_business_role;
CREATE POLICY "Users see own business roles" ON advisor_business_role
  FOR SELECT USING (auth.uid() = user_id);

-- Business owners can see all roles in their business
DROP POLICY IF EXISTS "Owners see business roles" ON advisor_business_role;
CREATE POLICY "Owners see business roles" ON advisor_business_role
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM advisor_business_role
      WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
    )
  );

-- ============================================================================
-- SCHEMA ADDITIONS: Optimistic Locking & Idempotency
-- ============================================================================

-- Add version column for optimistic locking
ALTER TABLE lead ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE booking ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Add idempotency key columns
ALTER TABLE lead ADD COLUMN IF NOT EXISTS idempotency_key UUID;
ALTER TABLE message ADD COLUMN IF NOT EXISTS idempotency_key UUID;

-- Add decline_reason column to lead table
ALTER TABLE lead ADD COLUMN IF NOT EXISTS decline_reason TEXT;

-- Create unique indexes for idempotency (partial index - only where key is set)
CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_idempotency
  ON lead(idempotency_key) WHERE idempotency_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_message_idempotency
  ON message(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- ============================================================================
-- TRANSACTION FUNCTION: Accept Lead
-- ============================================================================
-- Atomically updates lead status and creates conversation

CREATE OR REPLACE FUNCTION public.accept_lead(
  p_lead_id UUID,
  p_user_id UUID
) RETURNS UUID AS $$
DECLARE
  v_lead RECORD;
  v_conversation_id UUID;
  v_business_id UUID;
BEGIN
  -- Verify user has access to this lead's business
  SELECT business_id INTO v_business_id
  FROM advisor_business_role
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;

  IF v_business_id IS NULL THEN
    RAISE EXCEPTION 'User is not an active member of any business';
  END IF;

  -- Get lead data and verify it belongs to the user's business
  SELECT * INTO v_lead FROM lead
  WHERE id = p_lead_id AND business_id = v_business_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead not found or access denied';
  END IF;

  IF v_lead.status NOT IN ('new') THEN
    RAISE EXCEPTION 'Lead cannot be accepted from status: %', v_lead.status;
  END IF;

  -- Update lead status (atomic with conversation creation)
  UPDATE lead SET
    status = 'contacted',
    first_response_at = COALESCE(first_response_at, NOW()),
    response_time_minutes = EXTRACT(EPOCH FROM (NOW() - created_at))/60,
    version = version + 1,
    updated_at = NOW()
  WHERE id = p_lead_id AND version = v_lead.version;

  -- Check optimistic lock
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead was modified by another user. Please refresh and try again.';
  END IF;

  -- Create or get conversation (upsert)
  INSERT INTO conversation (lead_id, consumer_user_id, business_id, subject)
  VALUES (p_lead_id, v_lead.consumer_user_id, v_lead.business_id, COALESCE(v_lead.problem_summary, 'New conversation'))
  ON CONFLICT (consumer_user_id, business_id) DO UPDATE SET
    lead_id = EXCLUDED.lead_id,
    updated_at = NOW()
  RETURNING id INTO v_conversation_id;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRANSACTION FUNCTION: Decline Lead
-- ============================================================================

CREATE OR REPLACE FUNCTION public.decline_lead(
  p_lead_id UUID,
  p_user_id UUID,
  p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_lead RECORD;
  v_business_id UUID;
BEGIN
  -- Verify user has access to this lead's business
  SELECT business_id INTO v_business_id
  FROM advisor_business_role
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;

  IF v_business_id IS NULL THEN
    RAISE EXCEPTION 'User is not an active member of any business';
  END IF;

  -- Get lead and verify access
  SELECT * INTO v_lead FROM lead
  WHERE id = p_lead_id AND business_id = v_business_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead not found or access denied';
  END IF;

  IF v_lead.status IN ('converted', 'declined') THEN
    RAISE EXCEPTION 'Lead is in terminal status: %', v_lead.status;
  END IF;

  -- Update lead status
  UPDATE lead SET
    status = 'declined',
    decline_reason = p_reason,
    version = version + 1,
    updated_at = NOW()
  WHERE id = p_lead_id AND version = v_lead.version;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead was modified by another user. Please refresh and try again.';
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- HELPER FUNCTION: Check business membership
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_business_member(
  p_user_id UUID,
  p_business_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM advisor_business_role
    WHERE user_id = p_user_id
      AND business_id = p_business_id
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.accept_lead TO authenticated;
GRANT EXECUTE ON FUNCTION public.decline_lead TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_business_member TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Run this migration in Supabase SQL Editor
-- Test by:
-- 1. Signing in as a consumer and attempting to read leads (should see own only)
-- 2. Signing in as an advisor and attempting to read leads (should see business leads)
-- 3. Attempting cross-user access (should be denied)
