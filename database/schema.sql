-- Advyser Database Schema
-- Version: 1.0.0
-- Generated: 2025-01-04
--
-- This schema supports:
-- - Two-sided marketplace (consumers + advisors)
-- - AU financial + property advisor verification
-- - Copilot AI workflow (supply-side)
-- - Search & ranking signals

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User roles
CREATE TYPE user_role AS ENUM ('consumer', 'advisor', 'admin');

-- Advisor types (AU-specific)
CREATE TYPE advisor_type AS ENUM (
    'financial_adviser',
    'mortgage_broker',
    'buyers_agent',
    'property_adviser'
);

-- Business claim status
CREATE TYPE claim_status AS ENUM ('unclaimed', 'pending', 'claimed');

-- Verification levels (for ranking)
CREATE TYPE verification_level AS ENUM ('none', 'basic', 'licence_verified', 'enhanced');

-- Credential types (AU regulatory)
CREATE TYPE credential_type AS ENUM (
    'afsl',                    -- Australian Financial Services Licence (business)
    'authorised_rep',          -- Authorised Representative under AFSL
    'far',                     -- Financial Advisers Register (individual)
    'acl',                     -- Australian Credit Licence (business)
    'credit_rep',              -- Credit Representative
    'real_estate_licence',     -- State-based real estate licence
    'buyers_agent_licence'     -- State-based buyer's agent
);

-- Credential verification status
CREATE TYPE credential_status AS ENUM ('unverified', 'pending', 'verified', 'rejected', 'expired');

-- Credential verification source
CREATE TYPE verification_source AS ENUM ('asic_far', 'asic_prs', 'state_register', 'document_only', 'manual');

-- Claim request status
CREATE TYPE claim_request_status AS ENUM ('pending', 'needs_more_info', 'approved', 'denied');

-- Advisor role in business
CREATE TYPE business_role AS ENUM ('owner', 'staff');
CREATE TYPE business_role_status AS ENUM ('active', 'invited', 'removed');

-- Lead status (pipeline)
CREATE TYPE lead_status AS ENUM (
    'new',
    'contacted',
    'booked',
    'converted',
    'declined',
    'closed'
);

-- Booking status
CREATE TYPE booking_status AS ENUM ('proposed', 'confirmed', 'cancelled', 'completed');

-- Meeting mode
CREATE TYPE meeting_mode AS ENUM ('online', 'in_person', 'both');

-- Review status
CREATE TYPE review_status AS ENUM ('pending', 'published', 'rejected');

-- Fee model
CREATE TYPE fee_model AS ENUM ('hourly', 'fixed', 'ongoing', 'percentage', 'unknown');

-- Note types (for Copilot)
CREATE TYPE note_type AS ENUM ('meeting_summary', 'action_items', 'file_note', 'follow_up', 'general');

-- Copilot output types
CREATE TYPE copilot_output_type AS ENUM ('summary', 'actions', 'followup', 'brief', 'flags');

-- Copilot run status
CREATE TYPE copilot_run_status AS ENUM ('pending', 'processing', 'success', 'failure');

-- Availability mode (for calendar/booking)
CREATE TYPE availability_mode AS ENUM ('unknown', 'manual', 'calendar_connected');

-- Task status
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Australian states
CREATE TYPE au_state AS ENUM ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT');

-- ============================================================================
-- CORE IDENTITY
-- ============================================================================

CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMPTZ,
    phone VARCHAR(20),
    phone_verified_at TIMESTAMPTZ,
    password_hash VARCHAR(255), -- nullable for OAuth-only users
    role user_role NOT NULL DEFAULT 'consumer',

    -- Profile basics (for consumers)
    display_name VARCHAR(100),
    avatar_url TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ -- soft delete
);

CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role ON "user"(role);
CREATE INDEX idx_user_deleted ON "user"(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- FILE UPLOADS (shared across system)
-- ============================================================================

CREATE TABLE file_upload (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploader_user_id UUID REFERENCES "user"(id),

    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    storage_uri TEXT NOT NULL, -- S3/GCS path

    -- Security
    virus_scanned_at TIMESTAMPTZ,
    virus_scan_result VARCHAR(50),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_file_upload_user ON file_upload(uploader_user_id);

-- ============================================================================
-- LOCATIONS (AU-focused)
-- ============================================================================

CREATE TABLE location (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    country VARCHAR(2) NOT NULL DEFAULT 'AU',
    state au_state NOT NULL,
    suburb VARCHAR(100) NOT NULL,
    postcode VARCHAR(10) NOT NULL,

    -- Geocoding
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),

    -- SA2 region (for analytics, optional)
    sa2_code VARCHAR(20),
    sa2_name VARCHAR(100),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_location_postcode ON location(postcode);
CREATE INDEX idx_location_state ON location(state);
CREATE INDEX idx_location_suburb ON location USING gin(suburb gin_trgm_ops);
CREATE INDEX idx_location_geo ON location(lat, lng);

-- ============================================================================
-- MARKETPLACE SUPPLY: BUSINESS
-- ============================================================================

CREATE TABLE business (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identity
    legal_name VARCHAR(255) NOT NULL,
    trading_name VARCHAR(255),
    abn VARCHAR(11), -- Australian Business Number (11 digits)
    acn VARCHAR(9),  -- Australian Company Number (9 digits)

    -- Contact
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),

    -- Primary address
    primary_location_id UUID REFERENCES location(id),
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),

    -- Claim status
    claimed_status claim_status NOT NULL DEFAULT 'unclaimed',
    claimed_by_user_id UUID REFERENCES "user"(id),
    claimed_at TIMESTAMPTZ,

    -- Source tracking
    created_source VARCHAR(50) DEFAULT 'manual', -- manual, import, scraped

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_business_abn ON business(abn);
CREATE INDEX idx_business_name ON business USING gin(trading_name gin_trgm_ops);
CREATE INDEX idx_business_claimed ON business(claimed_status);
CREATE INDEX idx_business_deleted ON business(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- MARKETPLACE SUPPLY: LISTING (public profile)
-- ============================================================================

CREATE TABLE listing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES business(id),

    -- Profile content
    headline VARCHAR(200),
    bio TEXT,
    what_i_help_with TEXT,
    who_i_dont_work_with TEXT,

    -- Classification
    advisor_type advisor_type NOT NULL,
    service_mode meeting_mode NOT NULL DEFAULT 'both',
    fee_model fee_model DEFAULT 'unknown',
    price_band VARCHAR(50), -- e.g., "$$$" or "150-300/hr"

    -- Availability
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_accepting_clients BOOLEAN NOT NULL DEFAULT true,
    availability_mode availability_mode NOT NULL DEFAULT 'unknown',
    time_to_first_slot_days INTEGER, -- cached from calendar
    last_availability_refresh_at TIMESTAMPTZ,

    -- Computed/cached ranking signals
    verification_level verification_level NOT NULL DEFAULT 'none',
    profile_completeness_score SMALLINT DEFAULT 0, -- 0-100
    response_time_hours DECIMAL(6,2), -- median response time
    rating_avg DECIMAL(3,2), -- cached from reviews
    review_count INTEGER DEFAULT 0,

    -- Admin controls
    search_boost DECIMAL(4,2) DEFAULT 1.0, -- multiplier for ranking
    is_featured BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_listing_business ON listing(business_id);
CREATE INDEX idx_listing_type ON listing(advisor_type);
CREATE INDEX idx_listing_active ON listing(is_active, is_accepting_clients) WHERE deleted_at IS NULL;
CREATE INDEX idx_listing_verification ON listing(verification_level);
CREATE INDEX idx_listing_deleted ON listing(deleted_at) WHERE deleted_at IS NULL;

-- Service areas for listing (many-to-many with location or custom radius)
CREATE TABLE listing_service_area (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,

    -- Option 1: Reference existing location
    location_id UUID REFERENCES location(id),

    -- Option 2: Custom area
    state au_state,
    postcode VARCHAR(10),
    radius_km INTEGER, -- if using center point + radius

    -- Option 3: Australia-wide (for online-only)
    is_nationwide BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listing_service_area_listing ON listing_service_area(listing_id);
CREATE INDEX idx_listing_service_area_postcode ON listing_service_area(postcode);
CREATE INDEX idx_listing_service_area_state ON listing_service_area(state);

-- ============================================================================
-- ADVISOR PROFILES (individual advisors)
-- ============================================================================

CREATE TABLE advisor_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id),
    business_id UUID REFERENCES business(id), -- nullable until claim approved

    -- Profile
    display_name VARCHAR(100) NOT NULL,
    position_title VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,

    -- Professional details
    years_experience SMALLINT,
    languages TEXT[], -- array of language codes

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_advisor_profile_user ON advisor_profile(user_id);
CREATE INDEX idx_advisor_profile_business ON advisor_profile(business_id);

-- Junction: advisor roles in businesses
CREATE TABLE advisor_business_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id),
    business_id UUID NOT NULL REFERENCES business(id),

    role business_role NOT NULL,
    status business_role_status NOT NULL DEFAULT 'active',

    invited_by_user_id UUID REFERENCES "user"(id),
    invited_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, business_id)
);

CREATE INDEX idx_advisor_business_role_user ON advisor_business_role(user_id);
CREATE INDEX idx_advisor_business_role_business ON advisor_business_role(business_id);

-- ============================================================================
-- VERIFICATION & TRUST: CREDENTIALS
-- ============================================================================

CREATE TABLE credential (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Owner (at least one must be set)
    advisor_profile_id UUID REFERENCES advisor_profile(id),
    business_id UUID REFERENCES business(id),

    -- Credential details
    credential_type credential_type NOT NULL,
    credential_number VARCHAR(50),
    name_on_register VARCHAR(255),
    issuing_body VARCHAR(100),
    state au_state, -- for state-based licences
    expires_at DATE,

    -- Verification
    verification_status credential_status NOT NULL DEFAULT 'unverified',
    verification_source verification_source,
    verified_at TIMESTAMPTZ,
    verified_by_admin_id UUID REFERENCES "user"(id),
    verification_notes TEXT,

    -- Evidence
    evidence_file_id UUID REFERENCES file_upload(id),
    register_url TEXT, -- link to public register entry

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraint: must belong to either advisor or business
    CONSTRAINT credential_owner_check CHECK (
        advisor_profile_id IS NOT NULL OR business_id IS NOT NULL
    )
);

CREATE INDEX idx_credential_advisor ON credential(advisor_profile_id);
CREATE INDEX idx_credential_business ON credential(business_id);
CREATE INDEX idx_credential_type ON credential(credential_type);
CREATE INDEX idx_credential_status ON credential(verification_status);
CREATE INDEX idx_credential_number ON credential(credential_number);

-- ============================================================================
-- VERIFICATION & TRUST: CLAIM REQUESTS
-- ============================================================================

CREATE TABLE claim_request (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES business(id),
    requester_user_id UUID NOT NULL REFERENCES "user"(id),

    -- Submitted data
    submitted_abn VARCHAR(11),
    submitted_role VARCHAR(50),
    submitted_email VARCHAR(255),
    submitted_phone VARCHAR(20),

    -- Licence info (if applicable)
    submitted_licence_type credential_type,
    submitted_licence_number VARCHAR(50),
    submitted_state au_state,

    -- Proof of control method used
    verification_method VARCHAR(50), -- phone_otp, email_domain, website_code
    verification_completed_at TIMESTAMPTZ,

    -- Review
    status claim_request_status NOT NULL DEFAULT 'pending',
    reviewed_by_admin_id UUID REFERENCES "user"(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    denial_reason TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_claim_request_business ON claim_request(business_id);
CREATE INDEX idx_claim_request_user ON claim_request(requester_user_id);
CREATE INDEX idx_claim_request_status ON claim_request(status);

-- Evidence files for claim requests
CREATE TABLE claim_request_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_request_id UUID NOT NULL REFERENCES claim_request(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES file_upload(id),

    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_claim_evidence_request ON claim_request_evidence(claim_request_id);

-- ============================================================================
-- TAXONOMY: SPECIALTIES & SERVICES
-- ============================================================================

CREATE TABLE specialty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    advisor_type advisor_type NOT NULL,
    description TEXT,

    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_specialty_type ON specialty(advisor_type);
CREATE INDEX idx_specialty_slug ON specialty(slug);

-- Junction: listing specialties
CREATE TABLE listing_specialty (
    listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES specialty(id) ON DELETE CASCADE,

    PRIMARY KEY (listing_id, specialty_id)
);

CREATE INDEX idx_listing_specialty_listing ON listing_specialty(listing_id);
CREATE INDEX idx_listing_specialty_specialty ON listing_specialty(specialty_id);

-- Service offerings
CREATE TABLE service_offering (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    advisor_type advisor_type NOT NULL,
    description TEXT,

    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_offering_type ON service_offering(advisor_type);

-- Junction: listing service offerings
CREATE TABLE listing_service_offering (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
    service_offering_id UUID NOT NULL REFERENCES service_offering(id) ON DELETE CASCADE,

    -- Custom pricing per listing
    price_text VARCHAR(100), -- e.g., "$200/hr", "From $500"
    duration_minutes INTEGER,
    description TEXT,

    UNIQUE(listing_id, service_offering_id)
);

CREATE INDEX idx_listing_service_listing ON listing_service_offering(listing_id);

-- ============================================================================
-- DEMAND & TRANSACTIONS: LEADS
-- ============================================================================

CREATE TABLE lead (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Parties
    consumer_user_id UUID NOT NULL REFERENCES "user"(id),
    business_id UUID NOT NULL REFERENCES business(id), -- canonical supply entity
    listing_id UUID REFERENCES listing(id), -- optional: attribution for analytics

    -- Assignment (if team)
    assigned_to_user_id UUID REFERENCES "user"(id),
    assigned_at TIMESTAMPTZ,

    -- Intake data
    problem_summary TEXT,
    goal_tags TEXT[], -- array of goal keywords
    timeline VARCHAR(100),
    budget_range VARCHAR(100),
    preferred_meeting_mode meeting_mode,
    preferred_times TEXT, -- free text for MVP

    -- Pipeline
    status lead_status NOT NULL DEFAULT 'new',
    status_changed_at TIMESTAMPTZ DEFAULT NOW(),

    -- Response tracking (for ranking)
    first_response_at TIMESTAMPTZ,
    response_time_minutes INTEGER, -- computed on first response

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_lead_consumer ON lead(consumer_user_id);
CREATE INDEX idx_lead_business ON lead(business_id);
CREATE INDEX idx_lead_listing ON lead(listing_id) WHERE listing_id IS NOT NULL;
CREATE INDEX idx_lead_status ON lead(status);
CREATE INDEX idx_lead_assigned ON lead(assigned_to_user_id);
CREATE INDEX idx_lead_created ON lead(created_at DESC);
CREATE INDEX idx_lead_deleted ON lead(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- DEMAND & TRANSACTIONS: CLIENT RECORDS (long-term relationship)
-- ============================================================================

CREATE TABLE client_record (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    business_id UUID NOT NULL REFERENCES business(id),
    consumer_user_id UUID REFERENCES "user"(id), -- nullable for manually added clients
    lead_id UUID REFERENCES lead(id), -- originating lead

    -- Display
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),

    -- Living brief (updated by Copilot)
    goals TEXT,
    situation_summary TEXT,
    financial_snapshot JSONB, -- flexible structure
    preferences JSONB,
    outstanding_info TEXT,
    next_appointment_objective TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_client_record_business ON client_record(business_id);
CREATE INDEX idx_client_record_consumer ON client_record(consumer_user_id);
CREATE INDEX idx_client_record_lead ON client_record(lead_id);
CREATE INDEX idx_client_record_deleted ON client_record(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- MESSAGING
-- ============================================================================

CREATE TABLE conversation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    lead_id UUID REFERENCES lead(id),
    consumer_user_id UUID NOT NULL REFERENCES "user"(id),
    business_id UUID NOT NULL REFERENCES business(id),

    -- State
    is_archived BOOLEAN DEFAULT false,
    last_message_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversation_lead ON conversation(lead_id);
CREATE INDEX idx_conversation_consumer ON conversation(consumer_user_id);
CREATE INDEX idx_conversation_business ON conversation(business_id);
CREATE INDEX idx_conversation_last_message ON conversation(last_message_at DESC);

CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES "user"(id),

    body TEXT NOT NULL,

    -- Read receipts
    read_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_conversation ON message(conversation_id);
CREATE INDEX idx_message_sender ON message(sender_user_id);
CREATE INDEX idx_message_created ON message(created_at DESC);

-- Message attachments
CREATE TABLE message_attachment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES message(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES file_upload(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_attachment_message ON message_attachment(message_id);

-- ============================================================================
-- BOOKINGS
-- ============================================================================

CREATE TABLE booking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    lead_id UUID REFERENCES lead(id),
    client_record_id UUID REFERENCES client_record(id),

    -- Scheduling
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(50) DEFAULT 'Australia/Sydney',

    -- Location
    mode meeting_mode NOT NULL,
    location_text VARCHAR(255),
    meeting_link TEXT,

    -- State
    status booking_status NOT NULL DEFAULT 'proposed',

    -- Calendar integration
    external_calendar_id VARCHAR(255),
    external_event_id VARCHAR(255),

    -- Notes
    advisor_notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_lead ON booking(lead_id);
CREATE INDEX idx_booking_client ON booking(client_record_id);
CREATE INDEX idx_booking_starts ON booking(starts_at);
CREATE INDEX idx_booking_status ON booking(status);

-- ============================================================================
-- REVIEWS
-- ============================================================================

CREATE TABLE review (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Must be tied to a real engagement
    lead_id UUID NOT NULL REFERENCES lead(id),
    consumer_user_id UUID NOT NULL REFERENCES "user"(id),
    business_id UUID NOT NULL REFERENCES business(id),
    listing_id UUID NOT NULL REFERENCES listing(id),

    -- Content
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    body TEXT,

    -- Moderation
    status review_status NOT NULL DEFAULT 'pending',
    moderated_by_admin_id UUID REFERENCES "user"(id),
    moderated_at TIMESTAMPTZ,
    moderation_notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_review_lead ON review(lead_id);
CREATE INDEX idx_review_business ON review(business_id);
CREATE INDEX idx_review_listing ON review(listing_id);
CREATE INDEX idx_review_status ON review(status);
CREATE INDEX idx_review_rating ON review(rating);
CREATE INDEX idx_review_deleted ON review(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- COPILOT: ADVISOR NOTES
-- ============================================================================

CREATE TABLE advisor_note (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    client_record_id UUID NOT NULL REFERENCES client_record(id),
    author_user_id UUID NOT NULL REFERENCES "user"(id),

    -- Content metadata (actual content lives in revisions)
    note_type note_type NOT NULL DEFAULT 'general',
    title VARCHAR(200),

    -- Source tracking
    source VARCHAR(20) NOT NULL DEFAULT 'manual', -- manual, copilot
    copilot_output_id UUID, -- references copilot_output if AI-generated

    -- Current revision pointer (denormalized for fast access)
    current_revision_id UUID, -- set after first revision created

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_advisor_note_client ON advisor_note(client_record_id);
CREATE INDEX idx_advisor_note_author ON advisor_note(author_user_id);
CREATE INDEX idx_advisor_note_type ON advisor_note(note_type);
CREATE INDEX idx_advisor_note_deleted ON advisor_note(deleted_at) WHERE deleted_at IS NULL;

-- Note revisions (immutable history)
CREATE TABLE advisor_note_revision (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisor_note_id UUID NOT NULL REFERENCES advisor_note(id) ON DELETE CASCADE,

    revision_number INTEGER NOT NULL,
    content TEXT NOT NULL,

    -- Who made this revision
    created_by_user_id UUID REFERENCES "user"(id),
    source VARCHAR(20) NOT NULL DEFAULT 'manual', -- manual, copilot
    source_ref_id UUID, -- copilot_output_id if AI-generated

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(advisor_note_id, revision_number)
);

CREATE INDEX idx_note_revision_note ON advisor_note_revision(advisor_note_id);
CREATE INDEX idx_note_revision_created ON advisor_note_revision(created_at DESC);

-- ============================================================================
-- COPILOT: TASKS
-- ============================================================================

CREATE TABLE task (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    client_record_id UUID REFERENCES client_record(id),
    owner_user_id UUID NOT NULL REFERENCES "user"(id),

    -- Content
    description TEXT NOT NULL,
    assignee VARCHAR(50), -- 'advisor' or 'client'

    -- Status
    status task_status NOT NULL DEFAULT 'pending',
    due_date DATE,
    completed_at TIMESTAMPTZ,

    -- Source tracking
    source VARCHAR(20) DEFAULT 'manual', -- manual, copilot
    copilot_output_id UUID,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_client ON task(client_record_id);
CREATE INDEX idx_task_owner ON task(owner_user_id);
CREATE INDEX idx_task_status ON task(status);
CREATE INDEX idx_task_due ON task(due_date);

-- ============================================================================
-- COPILOT: AI RUNS
-- ============================================================================

CREATE TABLE copilot_run (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    business_id UUID NOT NULL REFERENCES business(id),
    advisor_user_id UUID NOT NULL REFERENCES "user"(id),
    client_record_id UUID REFERENCES client_record(id),
    lead_id UUID REFERENCES lead(id),

    -- Configuration
    meeting_type VARCHAR(50), -- discovery, review, strategy, etc.
    output_pack VARCHAR(50), -- discovery_call, review, docs, compliance
    settings_json JSONB, -- tone, template preferences, etc.

    -- Execution
    status copilot_run_status NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,

    -- Model tracking (for audit)
    model_id VARCHAR(100),
    model_version VARCHAR(50),
    prompt_version VARCHAR(50),

    -- Usage
    input_tokens INTEGER,
    output_tokens INTEGER,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_copilot_run_business ON copilot_run(business_id);
CREATE INDEX idx_copilot_run_advisor ON copilot_run(advisor_user_id);
CREATE INDEX idx_copilot_run_client ON copilot_run(client_record_id);
CREATE INDEX idx_copilot_run_status ON copilot_run(status);
CREATE INDEX idx_copilot_run_created ON copilot_run(created_at DESC);

-- ============================================================================
-- COPILOT: INPUT ARTIFACTS
-- ============================================================================

CREATE TABLE copilot_input_artifact (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    copilot_run_id UUID NOT NULL REFERENCES copilot_run(id) ON DELETE CASCADE,

    -- Type
    artifact_type VARCHAR(50) NOT NULL, -- transcript, notes, document, email

    -- Content
    file_id UUID REFERENCES file_upload(id),
    raw_text TEXT,
    extracted_text TEXT, -- after PDF/DOCX extraction

    -- Deduplication
    content_hash VARCHAR(64),

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_copilot_input_run ON copilot_input_artifact(copilot_run_id);
CREATE INDEX idx_copilot_input_hash ON copilot_input_artifact(content_hash);

-- ============================================================================
-- COPILOT: OUTPUTS
-- ============================================================================

CREATE TABLE copilot_output (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    copilot_run_id UUID NOT NULL REFERENCES copilot_run(id) ON DELETE CASCADE,

    -- Type
    output_type copilot_output_type NOT NULL,

    -- Content (generated vs edited)
    generated_content TEXT NOT NULL,
    edited_content TEXT, -- if advisor modifies
    content_format VARCHAR(20) DEFAULT 'markdown', -- markdown, json

    -- Approval workflow
    is_approved BOOLEAN DEFAULT false,
    approved_by_user_id UUID REFERENCES "user"(id),
    approved_at TIMESTAMPTZ,

    -- Finalization (when saved to notes/tasks)
    finalized_at TIMESTAMPTZ,
    finalized_to VARCHAR(50), -- 'advisor_note', 'task', 'message_draft'
    finalized_ref_id UUID, -- ID of created note/task

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_copilot_output_run ON copilot_output(copilot_run_id);
CREATE INDEX idx_copilot_output_type ON copilot_output(output_type);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================

CREATE TABLE audit_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Who performed the action
    actor_user_id UUID REFERENCES "user"(id),

    -- What happened
    action VARCHAR(100) NOT NULL, -- e.g., 'claim.approved', 'credential.verified', 'copilot.generated'

    -- Target entity
    entity_type VARCHAR(50) NOT NULL, -- e.g., 'business', 'credential', 'copilot_run'
    entity_id UUID,

    -- Additional context
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Request context (optional)
    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for audit queries
CREATE INDEX idx_audit_actor ON audit_event(actor_user_id);
CREATE INDEX idx_audit_action ON audit_event(action);
CREATE INDEX idx_audit_entity ON audit_event(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_event(created_at DESC);

-- Composite index for "show me all actions on this entity"
CREATE INDEX idx_audit_entity_timeline ON audit_event(entity_type, entity_id, created_at DESC);

-- ============================================================================
-- ADD FOREIGN KEY BACK-REFERENCES
-- ============================================================================

-- Add FK from advisor_note to copilot_output (after copilot_output exists)
ALTER TABLE advisor_note
ADD CONSTRAINT fk_advisor_note_copilot_output
FOREIGN KEY (copilot_output_id) REFERENCES copilot_output(id);

ALTER TABLE task
ADD CONSTRAINT fk_task_copilot_output
FOREIGN KEY (copilot_output_id) REFERENCES copilot_output(id);

-- Add FK from advisor_note to current_revision (after revision table exists)
ALTER TABLE advisor_note
ADD CONSTRAINT fk_advisor_note_current_revision
FOREIGN KEY (current_revision_id) REFERENCES advisor_note_revision(id);

-- ============================================================================
-- TRIGGERS: AUTO-UPDATE updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_updated_at BEFORE UPDATE ON business
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listing_updated_at BEFORE UPDATE ON listing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advisor_profile_updated_at BEFORE UPDATE ON advisor_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credential_updated_at BEFORE UPDATE ON credential
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claim_request_updated_at BEFORE UPDATE ON claim_request
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_updated_at BEFORE UPDATE ON lead
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_record_updated_at BEFORE UPDATE ON client_record
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_updated_at BEFORE UPDATE ON booking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_updated_at BEFORE UPDATE ON review
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advisor_note_updated_at BEFORE UPDATE ON advisor_note
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_updated_at BEFORE UPDATE ON task
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_copilot_output_updated_at BEFORE UPDATE ON copilot_output
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advisor_business_role_updated_at BEFORE UPDATE ON advisor_business_role
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER: AUTO-CREATE client_record on lead conversion
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_create_client_record()
RETURNS TRIGGER AS $$
BEGIN
    -- When lead moves to 'booked' or 'converted', create client_record if not exists
    IF (NEW.status IN ('booked', 'converted')) AND
       (OLD.status IS NULL OR OLD.status NOT IN ('booked', 'converted')) THEN

        INSERT INTO client_record (business_id, consumer_user_id, lead_id, display_name, email)
        SELECT
            NEW.business_id, -- now directly on lead
            NEW.consumer_user_id,
            NEW.id,
            COALESCE(u.display_name, u.email),
            u.email
        FROM "user" u
        WHERE u.id = NEW.consumer_user_id
        ON CONFLICT DO NOTHING; -- Don't duplicate if already exists
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER lead_status_change_client_record
    AFTER UPDATE ON lead
    FOR EACH ROW EXECUTE FUNCTION auto_create_client_record();

-- ============================================================================
-- SEED DATA: SPECIALTIES
-- ============================================================================

INSERT INTO specialty (name, slug, advisor_type, display_order) VALUES
-- Financial Adviser
('Retirement Planning', 'retirement-planning', 'financial_adviser', 1),
('SMSF', 'smsf', 'financial_adviser', 2),
('Wealth Accumulation', 'wealth-accumulation', 'financial_adviser', 3),
('Estate Planning', 'estate-planning', 'financial_adviser', 4),
('Insurance', 'insurance', 'financial_adviser', 5),
('Centrelink Optimization', 'centrelink', 'financial_adviser', 6),

-- Mortgage Broker
('First Home Buyers', 'first-home-buyers', 'mortgage_broker', 1),
('Refinancing', 'refinancing', 'mortgage_broker', 2),
('Investment Loans', 'investment-loans', 'mortgage_broker', 3),
('Commercial Lending', 'commercial-lending', 'mortgage_broker', 4),
('Self-Employed', 'self-employed-lending', 'mortgage_broker', 5),
('Low Doc Loans', 'low-doc-loans', 'mortgage_broker', 6),

-- Buyer's Agent
('Residential', 'residential-buyers-agent', 'buyers_agent', 1),
('Investment Properties', 'investment-buyers-agent', 'buyers_agent', 2),
('Off-Market', 'off-market', 'buyers_agent', 3),
('Auction Bidding', 'auction-bidding', 'buyers_agent', 4),
('Relocation', 'relocation', 'buyers_agent', 5),

-- Property Adviser
('Property Strategy', 'property-strategy', 'property_adviser', 1),
('Portfolio Review', 'portfolio-review', 'property_adviser', 2),
('Development Feasibility', 'development-feasibility', 'property_adviser', 3),
('Suburb Research', 'suburb-research', 'property_adviser', 4);

-- ============================================================================
-- SEED DATA: SERVICE OFFERINGS
-- ============================================================================

INSERT INTO service_offering (name, slug, advisor_type, display_order) VALUES
-- Financial Adviser
('Initial Consultation', 'initial-consultation-fa', 'financial_adviser', 1),
('Statement of Advice (SOA)', 'soa', 'financial_adviser', 2),
('Ongoing Advice', 'ongoing-advice-fa', 'financial_adviser', 3),
('Annual Review', 'annual-review-fa', 'financial_adviser', 4),

-- Mortgage Broker
('Home Loan Comparison', 'home-loan-comparison', 'mortgage_broker', 1),
('Pre-Approval', 'pre-approval', 'mortgage_broker', 2),
('Full Application', 'full-application', 'mortgage_broker', 3),
('Refinance Assessment', 'refinance-assessment', 'mortgage_broker', 4),

-- Buyer's Agent
('Full Search Service', 'full-search-service', 'buyers_agent', 1),
('Appraisal Only', 'appraisal-only', 'buyers_agent', 2),
('Auction Representation', 'auction-representation', 'buyers_agent', 3),
('Negotiation Only', 'negotiation-only', 'buyers_agent', 4),

-- Property Adviser
('Strategy Session', 'strategy-session', 'property_adviser', 1),
('Portfolio Analysis', 'portfolio-analysis', 'property_adviser', 2),
('Market Report', 'market-report', 'property_adviser', 3);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE "user" IS 'All platform users: consumers, advisors, and admins';
COMMENT ON TABLE business IS 'Real-world business entities (can exist before being claimed)';
COMMENT ON TABLE listing IS 'Public marketplace profiles shown in search results';
COMMENT ON TABLE lead IS 'Consumer requests/inquiries sent to businesses';
COMMENT ON TABLE client_record IS 'Long-term client relationships (auto-created on lead conversion)';
COMMENT ON TABLE copilot_run IS 'AI processing runs for advisor workflow support';
COMMENT ON TABLE credential IS 'Professional licences and registrations (AU regulatory)';
COMMENT ON TABLE advisor_note IS 'Note metadata; actual content stored in advisor_note_revision';
COMMENT ON TABLE advisor_note_revision IS 'Immutable revision history for advisor notes';
COMMENT ON TABLE audit_event IS 'Audit trail for compliance-relevant actions';

COMMENT ON COLUMN listing.verification_level IS 'Computed from credential verifications; affects search ranking';
COMMENT ON COLUMN listing.is_accepting_clients IS 'Capacity toggle; affects search visibility';
COMMENT ON COLUMN listing.availability_mode IS 'How availability is determined: unknown, manual toggle, or calendar integration';
COMMENT ON COLUMN lead.business_id IS 'Canonical supply entity; required FK';
COMMENT ON COLUMN lead.listing_id IS 'Optional: specific listing for attribution/analytics';
COMMENT ON COLUMN advisor_note.current_revision_id IS 'Denormalized pointer to latest revision for fast access';
