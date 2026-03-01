-- Advyser Database Schema
-- Version: 1.4.0
-- Updated: 2026-02-03
--
-- Changelog (v1.4.0 — P2 Schema-Only Fixes):
--   - Added 6 new enums: content_source, business_source, copilot_artifact_type,
--     output_content_format, copilot_finalize_target, claim_verification_method
--   - Migrated 8 VARCHAR columns to enum types for type safety
--   - Added 4 new indexes: notification composite, note revision audit,
--     copilot output approval, copilot input file lookup
--   - Added ON DELETE SET NULL to 8 optional admin/metadata FKs
--   - Added ON DELETE CASCADE to notification.user_id (ephemeral data)
--   - Clarified open-ended VARCHAR columns with example-value comments
--
-- Changelog (v1.3.0 — P1 Constraints & Guardrails):
--   - Added CHECK constraints: listing.response_rate (0-100), profile_completeness_score (0-100), rating_avg (0-5)
--   - Added CHECK constraint: booking.mode != 'both' (a booking is a single meeting)
--   - Added UNIQUE partial index: credential(credential_type, credential_number) WHERE NOT NULL
--   - Added deleted_at to advisor_profile for soft-delete support
--   - Made fk_advisor_note_current_revision DEFERRABLE INITIALLY DEFERRED (circular FK)
--
-- Changelog (v1.2.1 — Pre-Deployment P0 Fixes):
--   - Fixed CONCAT trigger bug: CONCAT(NULL,' ',NULL) returned ' ', now uses NULLIF(TRIM(CONCAT_WS(...)))
--   - Made all seed data INSERTs idempotent with ON CONFLICT DO NOTHING
--
-- Changelog (v1.2.0 — Gap Analysis Fix):
--   NEW ENUMS:
--   - practice_type, accepting_status, notification_type
--   - subscription_tier, subscription_status, invoice_status
--   - payment_method_type, message_delivery_status, task_assignee
--   ENUM FIXES:
--   - copilot_output_type: aligned values with TS types
--   - business_role: expanded to owner/admin/advisor/support
--   - review_status: added 'flagged'
--   NEW COLUMNS ON EXISTING TABLES:
--   - users: first_name, last_name
--   - business: practice_type
--   - listing: accepting_status (replacing is_accepting_clients boolean),
--     minimum_investment, approach_to_advice, free_consultation,
--     response_rate, client_demographics, featured_review_id
--   - advisor_profile: linkedin_url
--   - message: status, edited_at
--   - conversation: subject
--   - review: flagged, flag_reason
--   NEW TABLES:
--   - subscription_plan, subscription, invoice, payment_method
--   - notification, user_shortlist
--   - advisor_availability
--   - qualification, advisor_qualification
--
-- Changelog (v1.1.0):
--   - Renamed "user" → users (avoid reserved keyword)
--   - Fixed credential_type: replaced 'far' with 'relevant_provider', added 'limited_afsl', 'qpia'
--   - Added UNIQUE constraints: client_record, location, conversation
--   - Added CHECK constraints: business ABN/ACN, listing_service_area, booking ownership
--   - Added business_id/advisor_user_id to booking table
--   - Added advisor_profile_id to listing table
--   - Replaced message.read_at with message_read_receipt table
--   - Fixed auto_create_client_record trigger (INSERT + UNIQUE support)
--   - Added lead.status_changed_at auto-update trigger
--   - Added missing composite indexes for search/dashboard queries
--   - Added deleted_at to credential and booking tables
--   - Added updated_at to conversation table
--   - Normalized listing_service_offering to composite PK
--   - Added copilot_run.cost_usd for billing tracking
--   - Added missing table COMMENTs
--
-- This schema supports:
-- - Two-sided marketplace (consumers + advisors)
-- - AU financial + property advisor verification
-- - Copilot AI workflow (supply-side)
-- - Search & ranking signals
-- - Billing & subscriptions
-- - Notifications & shortlists

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

-- Business practice type (how the practice is structured)
CREATE TYPE practice_type AS ENUM (
    'independent',  -- Self-licensed or own AFSL
    'licensee',     -- Operates under another entity's AFSL
    'bank',         -- Bank-aligned
    'accounting',   -- Accounting firm offering advice
    'boutique'      -- Boutique/niche firm
);

-- Verification levels (for ranking)
CREATE TYPE verification_level AS ENUM ('none', 'basic', 'licence_verified', 'enhanced');

-- Credential types (AU regulatory)
CREATE TYPE credential_type AS ENUM (
    'afsl',                    -- Australian Financial Services Licence (business)
    'limited_afsl',            -- Limited AFSL (business, restricted scope)
    'authorised_rep',          -- Authorised Representative under AFSL
    'relevant_provider',       -- Registered on Financial Advisers Register (individual)
    'acl',                     -- Australian Credit Licence (business)
    'credit_rep',              -- Credit Representative
    'real_estate_licence',     -- State-based real estate licence
    'buyers_agent_licence',    -- State-based buyer's agent (CPP41419 + state licence)
    'qpia'                     -- Qualified Property Investment Adviser (PIPA accreditation)
);

-- Credential verification status
CREATE TYPE credential_status AS ENUM ('unverified', 'pending', 'verified', 'rejected', 'expired');

-- Credential verification source
CREATE TYPE verification_source AS ENUM ('asic_far', 'asic_prs', 'state_register', 'document_only', 'manual');

-- Claim request status
CREATE TYPE claim_request_status AS ENUM ('pending', 'needs_more_info', 'approved', 'denied');

-- Advisor role in business (expanded for team page: admin, advisor, support)
CREATE TYPE business_role AS ENUM ('owner', 'admin', 'advisor', 'support');
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

-- Accepting status (replaces boolean is_accepting_clients)
CREATE TYPE accepting_status AS ENUM ('taking_clients', 'waitlist', 'not_accepting');

-- Review status (added 'flagged' for admin moderation)
CREATE TYPE review_status AS ENUM ('pending', 'published', 'rejected', 'flagged');

-- Fee model
CREATE TYPE fee_model AS ENUM ('hourly', 'fixed', 'ongoing', 'percentage', 'unknown');

-- Note types (for Copilot)
CREATE TYPE note_type AS ENUM ('meeting_summary', 'action_items', 'file_note', 'follow_up', 'general');

-- Copilot output types (aligned with TS OutputType)
CREATE TYPE copilot_output_type AS ENUM (
    'meeting_summary',
    'action_items',
    'followup_draft',
    'client_brief_update',
    'compliance_flags'
);

-- Copilot run status
CREATE TYPE copilot_run_status AS ENUM ('pending', 'processing', 'success', 'failure');

-- Availability mode (for calendar/booking)
CREATE TYPE availability_mode AS ENUM ('unknown', 'manual', 'calendar_connected');

-- Task status
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Task assignee type
CREATE TYPE task_assignee AS ENUM ('advisor', 'client');

-- Message delivery status (server-side states only; 'sending'/'read' are client-side)
CREATE TYPE message_delivery_status AS ENUM ('sent', 'delivered', 'failed');

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'lead_new',
    'lead_response',
    'message_received',
    'booking_proposed',
    'booking_confirmed',
    'booking_cancelled',
    'review_received',
    'credential_verified',
    'credential_expiring',
    'claim_approved',
    'claim_denied',
    'system'
);

-- Subscription tiers
CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise');

-- Subscription status
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing');

-- Invoice status
CREATE TYPE invoice_status AS ENUM ('draft', 'open', 'paid', 'void', 'uncollectible');

-- Payment method type
CREATE TYPE payment_method_type AS ENUM ('card', 'bank_account', 'bpay');

-- Australian states
CREATE TYPE au_state AS ENUM ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT');

-- Content authorship source (shared across notes, revisions, tasks)
CREATE TYPE content_source AS ENUM ('manual', 'copilot');

-- How a business record was created
CREATE TYPE business_source AS ENUM ('manual', 'import', 'scraped');

-- Input artifact types for Copilot
CREATE TYPE copilot_artifact_type AS ENUM ('transcript', 'notes', 'document', 'email');

-- Output content format (named to avoid collision with column name)
CREATE TYPE output_content_format AS ENUM ('markdown', 'json');

-- Where a Copilot output gets finalized to
CREATE TYPE copilot_finalize_target AS ENUM ('advisor_note', 'task', 'message_draft');

-- Claim verification method
CREATE TYPE claim_verification_method AS ENUM ('phone_otp', 'email_domain', 'website_code');

-- ============================================================================
-- CORE IDENTITY
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMPTZ,
    phone VARCHAR(20),
    phone_verified_at TIMESTAMPTZ,
    password_hash VARCHAR(255), -- nullable for OAuth-only users
    role user_role NOT NULL DEFAULT 'consumer',

    -- Profile basics
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(100), -- computed or set; used for public display
    avatar_url TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ -- soft delete
);

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_user_deleted ON users(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- FILE UPLOADS (shared across system)
-- ============================================================================

CREATE TABLE file_upload (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploader_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

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

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate locations
    UNIQUE(state, suburb, postcode)
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

    -- Practice classification
    practice_type practice_type, -- independent, licensee, bank, accounting, boutique

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
    claimed_by_user_id UUID REFERENCES users(id),
    claimed_at TIMESTAMPTZ,

    -- Source tracking
    created_source business_source DEFAULT 'manual', -- uses business_source enum

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Format validation
    CONSTRAINT business_abn_format CHECK (abn IS NULL OR abn ~ '^\d{11}$'),
    CONSTRAINT business_acn_format CHECK (acn IS NULL OR acn ~ '^\d{9}$')
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
    advisor_profile_id UUID, -- FK added after advisor_profile table exists

    -- Profile content
    headline VARCHAR(200),
    bio TEXT,
    what_i_help_with TEXT,
    who_i_dont_work_with TEXT,
    approach_to_advice TEXT, -- advisory philosophy / how they work with clients

    -- Classification
    advisor_type advisor_type NOT NULL,
    service_mode meeting_mode NOT NULL DEFAULT 'both',
    fee_model fee_model DEFAULT 'unknown',
    price_band VARCHAR(50), -- e.g., "$$$" or "150-300/hr"
    minimum_investment DECIMAL(12,2), -- minimum investment/engagement threshold
    free_consultation BOOLEAN DEFAULT false, -- "Free initial consult" badge

    -- Client demographics (who they typically work with)
    client_demographics TEXT[], -- e.g., {"retirees", "first-home-buyers", "high-net-worth"}

    -- Availability
    is_active BOOLEAN NOT NULL DEFAULT true,
    accepting_status accepting_status NOT NULL DEFAULT 'taking_clients',
    availability_mode availability_mode NOT NULL DEFAULT 'unknown',
    time_to_first_slot_days INTEGER, -- cached from calendar
    last_availability_refresh_at TIMESTAMPTZ,

    -- Computed/cached ranking signals
    verification_level verification_level NOT NULL DEFAULT 'none',
    profile_completeness_score SMALLINT DEFAULT 0, -- 0-100
    response_time_hours DECIMAL(6,2), -- median response time
    response_rate DECIMAL(5,2), -- percentage of leads responded to (0-100)
    rating_avg DECIMAL(3,2), -- cached from reviews
    review_count INTEGER DEFAULT 0,
    featured_review_id UUID, -- FK added after review table exists

    -- Admin controls
    search_boost DECIMAL(4,2) DEFAULT 1.0, -- multiplier for ranking
    is_featured BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Data integrity constraints on cached ranking signals
    CONSTRAINT listing_response_rate_range CHECK (response_rate BETWEEN 0 AND 100),
    CONSTRAINT listing_completeness_range CHECK (profile_completeness_score BETWEEN 0 AND 100),
    CONSTRAINT listing_rating_range CHECK (rating_avg BETWEEN 0 AND 5)
);

CREATE INDEX idx_listing_business ON listing(business_id);
CREATE INDEX idx_listing_advisor ON listing(advisor_profile_id) WHERE advisor_profile_id IS NOT NULL;
CREATE INDEX idx_listing_type ON listing(advisor_type);
CREATE INDEX idx_listing_active ON listing(is_active, accepting_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_listing_verification ON listing(verification_level);
CREATE INDEX idx_listing_deleted ON listing(deleted_at) WHERE deleted_at IS NULL;
-- Composite index for search page queries (filter by type + active + sort by verification)
CREATE INDEX idx_listing_search ON listing(advisor_type, is_active, verification_level DESC) WHERE deleted_at IS NULL;

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

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent nationwide + specific location data
    CONSTRAINT service_area_type_check CHECK (
        NOT (is_nationwide = true AND (location_id IS NOT NULL OR state IS NOT NULL OR postcode IS NOT NULL))
    )
);

CREATE INDEX idx_listing_service_area_listing ON listing_service_area(listing_id);
CREATE INDEX idx_listing_service_area_postcode ON listing_service_area(postcode);
CREATE INDEX idx_listing_service_area_state ON listing_service_area(state);

-- ============================================================================
-- ADVISOR PROFILES (individual advisors)
-- ============================================================================

CREATE TABLE advisor_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    business_id UUID REFERENCES business(id), -- nullable until claim approved

    -- Profile
    display_name VARCHAR(100) NOT NULL,
    position_title VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,

    -- Social / contact
    linkedin_url VARCHAR(255),

    -- Professional details
    years_experience SMALLINT,
    languages TEXT[], -- array of language codes

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- soft delete for audit trail
);

CREATE INDEX idx_advisor_profile_user ON advisor_profile(user_id);
CREATE INDEX idx_advisor_profile_business ON advisor_profile(business_id);
CREATE INDEX idx_advisor_profile_deleted ON advisor_profile(deleted_at) WHERE deleted_at IS NULL;

-- Now add the deferred FK from listing to advisor_profile
ALTER TABLE listing
ADD CONSTRAINT fk_listing_advisor_profile
FOREIGN KEY (advisor_profile_id) REFERENCES advisor_profile(id);

-- Junction: advisor roles in businesses
CREATE TABLE advisor_business_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    business_id UUID NOT NULL REFERENCES business(id),

    role business_role NOT NULL,
    status business_role_status NOT NULL DEFAULT 'active',

    invited_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
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
    state au_state, -- for state-based licences (NULL for federal credentials like AFSL)
    expires_at DATE,

    -- Verification
    verification_status credential_status NOT NULL DEFAULT 'unverified',
    verification_source verification_source,
    verified_at TIMESTAMPTZ,
    verified_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    verification_notes TEXT,

    -- Evidence
    evidence_file_id UUID REFERENCES file_upload(id) ON DELETE SET NULL,
    register_url TEXT, -- link to public register entry

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ, -- soft delete for audit trail

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
CREATE INDEX idx_credential_deleted ON credential(deleted_at) WHERE deleted_at IS NULL;
-- For expiry monitoring cron jobs
CREATE INDEX idx_credential_expiry ON credential(expires_at) WHERE verification_status = 'verified';
-- Prevent duplicate credential entries (same type + number)
CREATE UNIQUE INDEX idx_credential_type_number ON credential(credential_type, credential_number) WHERE credential_number IS NOT NULL AND deleted_at IS NULL;

-- ============================================================================
-- VERIFICATION & TRUST: QUALIFICATIONS (professional designations)
-- ============================================================================
-- Distinct from credentials: credentials are regulatory licences you must have.
-- Qualifications are professional designations you chose to earn (CFP, CPA, etc.).

CREATE TABLE qualification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    abbreviation VARCHAR(20), -- e.g., "CFP", "CPA", "CA"
    issuing_body VARCHAR(100),
    description TEXT,

    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_qualification_slug ON qualification(slug);

-- Junction: advisor qualifications
CREATE TABLE advisor_qualification (
    advisor_profile_id UUID NOT NULL REFERENCES advisor_profile(id) ON DELETE CASCADE,
    qualification_id UUID NOT NULL REFERENCES qualification(id) ON DELETE CASCADE,

    obtained_year SMALLINT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (advisor_profile_id, qualification_id)
);

CREATE INDEX idx_advisor_qualification_profile ON advisor_qualification(advisor_profile_id);

-- ============================================================================
-- VERIFICATION & TRUST: CLAIM REQUESTS
-- ============================================================================

CREATE TABLE claim_request (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES business(id),
    requester_user_id UUID NOT NULL REFERENCES users(id),

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
    verification_method claim_verification_method, -- uses claim_verification_method enum
    verification_completed_at TIMESTAMPTZ,

    -- Review
    status claim_request_status NOT NULL DEFAULT 'pending',
    reviewed_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
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

-- Junction: listing service offerings (composite PK, consistent with listing_specialty)
CREATE TABLE listing_service_offering (
    listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
    service_offering_id UUID NOT NULL REFERENCES service_offering(id) ON DELETE CASCADE,

    -- Custom pricing per listing
    price_text VARCHAR(100), -- e.g., "$200/hr", "From $500"
    duration_minutes INTEGER,
    description TEXT,

    PRIMARY KEY (listing_id, service_offering_id)
);

CREATE INDEX idx_listing_service_listing ON listing_service_offering(listing_id);

-- ============================================================================
-- DEMAND & TRANSACTIONS: LEADS
-- ============================================================================

CREATE TABLE lead (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Parties
    consumer_user_id UUID NOT NULL REFERENCES users(id),
    business_id UUID NOT NULL REFERENCES business(id), -- canonical supply entity
    listing_id UUID REFERENCES listing(id), -- optional: attribution for analytics

    -- Assignment (if team)
    assigned_to_user_id UUID REFERENCES users(id),
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
-- Advisor dashboard: my leads filtered by status
CREATE INDEX idx_lead_business_status ON lead(business_id, status) WHERE deleted_at IS NULL;

-- ============================================================================
-- DEMAND & TRANSACTIONS: CLIENT RECORDS (long-term relationship)
-- ============================================================================

CREATE TABLE client_record (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    business_id UUID NOT NULL REFERENCES business(id),
    consumer_user_id UUID REFERENCES users(id), -- nullable for manually added clients
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
    deleted_at TIMESTAMPTZ,

    -- Prevent duplicate client records per business+consumer
    UNIQUE(business_id, consumer_user_id)
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
    consumer_user_id UUID NOT NULL REFERENCES users(id),
    business_id UUID NOT NULL REFERENCES business(id),

    -- Content
    subject VARCHAR(255), -- conversation title/topic

    -- State
    is_archived BOOLEAN DEFAULT false,
    last_message_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- One conversation per consumer-business pair
    UNIQUE(consumer_user_id, business_id)
);

CREATE INDEX idx_conversation_lead ON conversation(lead_id);
CREATE INDEX idx_conversation_consumer ON conversation(consumer_user_id);
CREATE INDEX idx_conversation_business ON conversation(business_id);
CREATE INDEX idx_conversation_last_message ON conversation(last_message_at DESC);

CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES users(id),

    body TEXT NOT NULL,

    -- Delivery tracking
    status message_delivery_status NOT NULL DEFAULT 'sent',

    -- Edit support
    edited_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_conversation ON message(conversation_id);
CREATE INDEX idx_message_sender ON message(sender_user_id);
CREATE INDEX idx_message_created ON message(created_at DESC);

-- Read receipts (supports team inboxes where multiple users read messages)
CREATE TABLE message_read_receipt (
    message_id UUID NOT NULL REFERENCES message(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (message_id, user_id)
);

CREATE INDEX idx_message_read_receipt_user ON message_read_receipt(user_id);

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

    -- Ownership (always know the business)
    business_id UUID NOT NULL REFERENCES business(id),
    advisor_user_id UUID REFERENCES users(id),

    -- Origin (at least one should be set for traceability)
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ, -- soft delete for audit trail

    -- A booking is a single meeting; 'both' is only valid for listing.service_mode
    CONSTRAINT booking_mode_not_both CHECK (mode != 'both'),

    -- Time validation
    CONSTRAINT booking_time_check CHECK (ends_at > starts_at)
);

CREATE INDEX idx_booking_business ON booking(business_id);
CREATE INDEX idx_booking_advisor ON booking(advisor_user_id);
CREATE INDEX idx_booking_lead ON booking(lead_id);
CREATE INDEX idx_booking_client ON booking(client_record_id);
CREATE INDEX idx_booking_starts ON booking(starts_at);
CREATE INDEX idx_booking_status ON booking(status);
CREATE INDEX idx_booking_deleted ON booking(deleted_at) WHERE deleted_at IS NULL;
-- Upcoming bookings query
CREATE INDEX idx_booking_upcoming ON booking(starts_at, status) WHERE deleted_at IS NULL;

-- ============================================================================
-- ADVISOR AVAILABILITY (weekly schedule slots)
-- ============================================================================

CREATE TABLE advisor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,

    day_of_week SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    mode meeting_mode NOT NULL DEFAULT 'both',
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT availability_time_check CHECK (end_time > start_time)
);

CREATE INDEX idx_advisor_availability_listing ON advisor_availability(listing_id);
CREATE INDEX idx_advisor_availability_day ON advisor_availability(listing_id, day_of_week) WHERE is_active = true;

-- ============================================================================
-- REVIEWS
-- ============================================================================

CREATE TABLE review (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Must be tied to a real engagement
    lead_id UUID NOT NULL REFERENCES lead(id),
    consumer_user_id UUID NOT NULL REFERENCES users(id),
    business_id UUID NOT NULL REFERENCES business(id),
    listing_id UUID NOT NULL REFERENCES listing(id),

    -- Content
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    body TEXT,

    -- Moderation
    status review_status NOT NULL DEFAULT 'pending',
    flagged BOOLEAN DEFAULT false,
    flag_reason TEXT, -- e.g., "Potential spam", "Inappropriate language"
    moderated_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    moderated_at TIMESTAMPTZ,
    moderation_notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_review_lead ON review(lead_id);
CREATE INDEX idx_review_consumer ON review(consumer_user_id);
CREATE INDEX idx_review_business ON review(business_id);
CREATE INDEX idx_review_listing ON review(listing_id);
CREATE INDEX idx_review_status ON review(status);
CREATE INDEX idx_review_rating ON review(rating);
CREATE INDEX idx_review_deleted ON review(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_review_flagged ON review(flagged) WHERE flagged = true;

-- Now add deferred FK from listing.featured_review_id
ALTER TABLE listing
ADD CONSTRAINT fk_listing_featured_review
FOREIGN KEY (featured_review_id) REFERENCES review(id) ON DELETE SET NULL;

-- ============================================================================
-- USER SHORTLIST (favorites)
-- ============================================================================

CREATE TABLE user_shortlist (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, listing_id)
);

CREATE INDEX idx_user_shortlist_user ON user_shortlist(user_id);
CREATE INDEX idx_user_shortlist_listing ON user_shortlist(listing_id);

-- ============================================================================
-- COPILOT: ADVISOR NOTES
-- ============================================================================

CREATE TABLE advisor_note (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    client_record_id UUID NOT NULL REFERENCES client_record(id),
    author_user_id UUID NOT NULL REFERENCES users(id),

    -- Content metadata (actual content lives in revisions)
    note_type note_type NOT NULL DEFAULT 'general',
    title VARCHAR(200),

    -- Source tracking
    source content_source NOT NULL DEFAULT 'manual', -- uses content_source enum
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
    created_by_user_id UUID REFERENCES users(id),
    source content_source NOT NULL DEFAULT 'manual', -- uses content_source enum
    source_ref_id UUID, -- copilot_output_id if AI-generated

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(advisor_note_id, revision_number)
);

CREATE INDEX idx_note_revision_note ON advisor_note_revision(advisor_note_id);
CREATE INDEX idx_note_revision_created ON advisor_note_revision(created_at DESC);
CREATE INDEX idx_note_revision_created_by ON advisor_note_revision(created_by_user_id);

-- ============================================================================
-- COPILOT: TASKS
-- ============================================================================

CREATE TABLE task (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    client_record_id UUID REFERENCES client_record(id),
    owner_user_id UUID NOT NULL REFERENCES users(id),

    -- Content
    description TEXT NOT NULL,
    assignee task_assignee, -- enum: 'advisor' or 'client'

    -- Status
    status task_status NOT NULL DEFAULT 'pending',
    due_date DATE,
    completed_at TIMESTAMPTZ,

    -- Source tracking
    source content_source DEFAULT 'manual', -- uses content_source enum
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
    advisor_user_id UUID NOT NULL REFERENCES users(id),
    client_record_id UUID REFERENCES client_record(id),
    lead_id UUID REFERENCES lead(id),

    -- Configuration
    meeting_type VARCHAR(50), -- open-ended; e.g., discovery, review, strategy
    output_pack VARCHAR(50), -- open-ended; e.g., discovery_call, review, docs, compliance
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

    -- Usage & cost
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost_usd DECIMAL(10,6), -- for billing/budget tracking

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
    artifact_type copilot_artifact_type NOT NULL, -- uses copilot_artifact_type enum

    -- Content
    file_id UUID REFERENCES file_upload(id) ON DELETE SET NULL,
    raw_text TEXT,
    extracted_text TEXT, -- after PDF/DOCX extraction

    -- Deduplication
    content_hash VARCHAR(64),

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_copilot_input_run ON copilot_input_artifact(copilot_run_id);
CREATE INDEX idx_copilot_input_hash ON copilot_input_artifact(content_hash);
CREATE INDEX idx_copilot_input_file ON copilot_input_artifact(file_id) WHERE file_id IS NOT NULL;

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
    content_format output_content_format DEFAULT 'markdown', -- uses output_content_format enum

    -- Approval workflow
    is_approved BOOLEAN DEFAULT false,
    approved_by_user_id UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,

    -- Finalization (when saved to notes/tasks)
    finalized_at TIMESTAMPTZ,
    finalized_to copilot_finalize_target, -- uses copilot_finalize_target enum
    finalized_ref_id UUID, -- ID of created note/task

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_copilot_output_run ON copilot_output(copilot_run_id);
CREATE INDEX idx_copilot_output_type ON copilot_output(output_type);
CREATE INDEX idx_copilot_output_approved_by ON copilot_output(approved_by_user_id) WHERE approved_by_user_id IS NOT NULL;

-- ============================================================================
-- BILLING: SUBSCRIPTION PLANS (reference data)
-- ============================================================================

CREATE TABLE subscription_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(50) NOT NULL,
    tier subscription_tier NOT NULL UNIQUE,

    -- Pricing (in cents to avoid floating-point)
    price_monthly_cents INTEGER NOT NULL,
    price_yearly_cents INTEGER, -- NULL = no annual option

    -- Limits (NULL = unlimited)
    max_leads_per_month INTEGER,
    max_clients INTEGER,
    max_team_members INTEGER,
    storage_gb INTEGER,

    -- Features (flexible JSON for plan comparison UI)
    features JSONB NOT NULL DEFAULT '[]'::jsonb,

    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- BILLING: SUBSCRIPTIONS
-- ============================================================================

CREATE TABLE subscription (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES business(id),
    plan_id UUID NOT NULL REFERENCES subscription_plan(id),

    status subscription_status NOT NULL DEFAULT 'trialing',

    -- Billing period
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMPTZ,

    -- External billing (Stripe)
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),

    -- Usage tracking (reset each period)
    leads_used_this_period INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscription_business ON subscription(business_id);
CREATE INDEX idx_subscription_status ON subscription(status);
CREATE INDEX idx_subscription_stripe ON subscription(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- ============================================================================
-- BILLING: INVOICES
-- ============================================================================

CREATE TABLE invoice (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES business(id),
    subscription_id UUID REFERENCES subscription(id),

    status invoice_status NOT NULL DEFAULT 'draft',

    -- Amounts (in cents)
    amount_cents INTEGER NOT NULL,
    tax_cents INTEGER DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'AUD',

    description TEXT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,

    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,

    -- External billing (Stripe)
    stripe_invoice_id VARCHAR(255),
    pdf_url TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoice_business ON invoice(business_id);
CREATE INDEX idx_invoice_subscription ON invoice(subscription_id);
CREATE INDEX idx_invoice_status ON invoice(status);
CREATE INDEX idx_invoice_stripe ON invoice(stripe_invoice_id) WHERE stripe_invoice_id IS NOT NULL;

-- ============================================================================
-- BILLING: PAYMENT METHODS
-- ============================================================================

CREATE TABLE payment_method (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES business(id),

    method_type payment_method_type NOT NULL,
    is_default BOOLEAN DEFAULT false,

    -- Card details (masked for display only — full details in Stripe)
    card_brand VARCHAR(20),
    card_last_four VARCHAR(4),
    card_exp_month SMALLINT,
    card_exp_year SMALLINT,

    -- Bank details (masked)
    bank_name VARCHAR(100),
    account_last_four VARCHAR(4),

    -- External (Stripe)
    stripe_payment_method_id VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_method_business ON payment_method(business_id);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    notification_type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT,

    -- Link to related entity (polymorphic)
    entity_type VARCHAR(50),
    entity_id UUID,

    -- Optional deep-link
    action_url VARCHAR(500),

    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notification_user ON notification(user_id);
CREATE INDEX idx_notification_unread ON notification(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notification_created ON notification(created_at DESC);
CREATE INDEX idx_notification_user_type ON notification(user_id, notification_type);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================

CREATE TABLE audit_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Who performed the action
    actor_user_id UUID REFERENCES users(id),

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
-- DEFERRABLE: circular FK (note → revision → note) requires deferred checking
-- so both can be inserted in one transaction
ALTER TABLE advisor_note
ADD CONSTRAINT fk_advisor_note_current_revision
FOREIGN KEY (current_revision_id) REFERENCES advisor_note_revision(id)
DEFERRABLE INITIALLY DEFERRED;

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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
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

CREATE TRIGGER update_conversation_updated_at BEFORE UPDATE ON conversation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plan_updated_at BEFORE UPDATE ON subscription_plan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON subscription
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_updated_at BEFORE UPDATE ON invoice
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_method_updated_at BEFORE UPDATE ON payment_method
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advisor_availability_updated_at BEFORE UPDATE ON advisor_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER: AUTO-UPDATE lead.status_changed_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_lead_status_changed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        NEW.status_changed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER lead_status_timestamp
    BEFORE UPDATE ON lead
    FOR EACH ROW EXECUTE FUNCTION update_lead_status_changed_at();

-- ============================================================================
-- TRIGGER: AUTO-CREATE client_record on lead conversion
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_create_client_record()
RETURNS TRIGGER AS $$
BEGIN
    -- When lead moves to 'booked' or 'converted', create client_record if not exists
    IF NEW.status IN ('booked', 'converted') AND
       (TG_OP = 'INSERT' OR OLD.status NOT IN ('booked', 'converted')) THEN

        INSERT INTO client_record (business_id, consumer_user_id, lead_id, display_name, email)
        SELECT
            NEW.business_id,
            NEW.consumer_user_id,
            NEW.id,
            COALESCE(u.display_name, NULLIF(TRIM(CONCAT_WS(' ', u.first_name, u.last_name)), ''), u.email),
            u.email
        FROM users u
        WHERE u.id = NEW.consumer_user_id
        ON CONFLICT (business_id, consumer_user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fire on both INSERT and UPDATE so direct creation with status='booked' works
CREATE TRIGGER lead_status_change_client_record
    AFTER INSERT OR UPDATE ON lead
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
('Suburb Research', 'suburb-research', 'property_adviser', 4)
ON CONFLICT (slug) DO NOTHING;

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
('Market Report', 'market-report', 'property_adviser', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED DATA: QUALIFICATIONS
-- ============================================================================

INSERT INTO qualification (name, slug, abbreviation, issuing_body, display_order) VALUES
('Certified Financial Planner', 'cfp', 'CFP', 'Financial Planning Association of Australia', 1),
('Certified Practising Accountant', 'cpa', 'CPA', 'CPA Australia', 2),
('Chartered Accountant', 'ca', 'CA', 'Chartered Accountants Australia and New Zealand', 3),
('Fellow Chartered Financial Practitioner', 'fcfp', 'FChFP', 'Financial Advice Association Australia', 4),
('Diploma of Financial Planning', 'dfp', 'DFP', 'Various RTOs', 5),
('Advanced Diploma of Financial Planning', 'adfp', 'ADFP', 'Various RTOs', 6),
('Master of Financial Planning', 'mfp', 'MFP', 'Various Universities', 7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED DATA: SUBSCRIPTION PLANS
-- ============================================================================

INSERT INTO subscription_plan (name, tier, price_monthly_cents, price_yearly_cents, max_leads_per_month, max_clients, max_team_members, storage_gb, features, display_order) VALUES
('Starter', 'starter', 0, 0, 10, 20, 1, 1,
 '[{"name": "Basic profile listing"}, {"name": "Up to 10 leads/month"}, {"name": "Messaging"}]'::jsonb, 1),
('Professional', 'professional', 7900, 79000, 50, 100, 5, 10,
 '[{"name": "Enhanced profile"}, {"name": "Up to 50 leads/month"}, {"name": "Copilot AI"}, {"name": "Team access"}, {"name": "Analytics dashboard"}]'::jsonb, 2),
('Enterprise', 'enterprise', 19900, 199000, NULL, NULL, NULL, 100,
 '[{"name": "Unlimited leads"}, {"name": "Unlimited clients"}, {"name": "Unlimited team"}, {"name": "Priority support"}, {"name": "Custom integrations"}, {"name": "SLA guarantee"}]'::jsonb, 3)
ON CONFLICT (tier) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'All platform users: consumers, advisors, and admins';
COMMENT ON TABLE business IS 'Real-world business entities (can exist before being claimed)';
COMMENT ON TABLE listing IS 'Public marketplace profiles shown in search results';
COMMENT ON TABLE lead IS 'Consumer requests/inquiries sent to businesses';
COMMENT ON TABLE client_record IS 'Long-term client relationships (auto-created on lead conversion)';
COMMENT ON TABLE copilot_run IS 'AI processing runs for advisor workflow support';
COMMENT ON TABLE credential IS 'Professional licences and registrations (AU regulatory)';
COMMENT ON TABLE qualification IS 'Professional designations (CFP, CPA, etc.) — distinct from regulatory credentials';
COMMENT ON TABLE advisor_qualification IS 'Junction: which qualifications an advisor holds';
COMMENT ON TABLE advisor_note IS 'Note metadata; actual content stored in advisor_note_revision';
COMMENT ON TABLE advisor_note_revision IS 'Immutable revision history for advisor notes';
COMMENT ON TABLE audit_event IS 'Audit trail for compliance-relevant actions';
COMMENT ON TABLE file_upload IS 'Shared file storage references (S3/GCS) with virus scanning';
COMMENT ON TABLE booking IS 'Scheduled meetings between advisors and consumers/clients';
COMMENT ON TABLE advisor_availability IS 'Weekly availability slots for booking calendar';
COMMENT ON TABLE conversation IS 'Messaging threads between consumers and businesses';
COMMENT ON TABLE message IS 'Individual messages within a conversation';
COMMENT ON TABLE message_read_receipt IS 'Per-user read tracking for team inbox support';
COMMENT ON TABLE task IS 'Action items for advisors/clients, created manually or by Copilot';
COMMENT ON TABLE subscription_plan IS 'Reference data: available billing tiers and their limits';
COMMENT ON TABLE subscription IS 'Active business subscriptions to a plan tier';
COMMENT ON TABLE invoice IS 'Billing invoices, synced with Stripe';
COMMENT ON TABLE payment_method IS 'Stored payment methods (masked details, full data in Stripe)';
COMMENT ON TABLE notification IS 'User notifications with read tracking and entity linking';
COMMENT ON TABLE user_shortlist IS 'Consumer favorites/shortlist for comparing advisors';
COMMENT ON TABLE review IS 'Consumer reviews of advisors, with moderation and flagging support';

COMMENT ON COLUMN listing.verification_level IS 'Computed from credential verifications; affects search ranking';
COMMENT ON COLUMN listing.accepting_status IS 'Tri-state capacity: taking_clients, waitlist, not_accepting';
COMMENT ON COLUMN listing.availability_mode IS 'How availability is determined: unknown, manual toggle, or calendar integration';
COMMENT ON COLUMN listing.advisor_profile_id IS 'Links listing to specific advisor when business has multiple advisors';
COMMENT ON COLUMN listing.minimum_investment IS 'Minimum investment/engagement threshold displayed on profile';
COMMENT ON COLUMN listing.approach_to_advice IS 'Advisory philosophy, distinct from bio — captured during onboarding';
COMMENT ON COLUMN listing.client_demographics IS 'Self-declared client segments, e.g., retirees, first-home-buyers';
COMMENT ON COLUMN listing.featured_review_id IS 'Advisor-selected review to feature on their card/profile';
COMMENT ON COLUMN listing.response_rate IS 'Cached % of leads responded to; updated by background job';
COMMENT ON COLUMN lead.business_id IS 'Canonical supply entity; required FK';
COMMENT ON COLUMN lead.listing_id IS 'Optional: specific listing for attribution/analytics';
COMMENT ON COLUMN advisor_note.current_revision_id IS 'Denormalized pointer to latest revision for fast access';
COMMENT ON COLUMN booking.business_id IS 'Direct business FK; always set for efficient queries without joins';
COMMENT ON COLUMN copilot_run.cost_usd IS 'Computed cost for billing dashboards and budget alerts';
COMMENT ON COLUMN message.status IS 'Server-side delivery status; client computes sending/read from context';
COMMENT ON COLUMN conversation.subject IS 'Optional topic/title for the conversation thread';
COMMENT ON COLUMN business.practice_type IS 'How the practice is structured (independent, licensee, bank, etc.)';

-- Note: listing.rating_avg and listing.review_count are cached values.
-- Update these in application code (not triggers) since the logic involves
-- filtering by review.status = 'published' and review.deleted_at IS NULL,
-- which is cleaner to maintain in the service layer.
