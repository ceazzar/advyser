# Schema Reconciliation

This document reconciles inconsistencies found across the overview documents and establishes the canonical data model for Advyser.

**Last updated:** After incorporating feedback from `xtemp` document.

---

## Inconsistencies Found & Resolutions

### 1. Lead references: `listing_id` vs `business_id`

**Source conflict:**
- `data-schema`: Uses `business_id (or listing_id)` on Lead
- `context-overview`: Uses `business_id`
- `xtemp` feedback: Recommends `business_id NOT NULL` + `listing_id NULL`

**Resolution:** Use BOTH: `business_id NOT NULL` (canonical) + `listing_id NULL` (attribution).

**Rationale:**
- `business_id` is the stable entity; listings can be created/archived
- `listing_id` is optional for analytics ("which listing converts best?")
- Simpler for MVP where listings may not exist for all businesses yet

---

### 2. Missing `capacity_status` field

**Source conflict:**
- `search-ranking`: References `capacity_status` toggle ("taking new clients")
- `data-schema`: Field not present in Listing model

**Resolution:** Add `is_accepting_clients` boolean to `listing` table.

**Rationale:**
- Critical for search ranking (exclude/demote advisors not taking clients)
- Simple boolean is sufficient for V1
- Can expand to capacity levels later (e.g., "limited availability")

---

### 3. `client_record_id` optionality

**Source conflict:**
- `copilot-v1`: Uses `client_record_id` as core reference for CopilotRun
- `data-schema`: Shows ClientRecord as "future hook" (optional)

**Resolution:** Make `client_record` table part of core schema, created automatically when Lead status → `booked` or `converted`.

**Rationale:**
- ClientRecord is the long-term relationship entity (vs Lead which is transactional)
- Copilot v1 needs it as anchor for notes/outputs
- Auto-creation reduces friction for advisors

---

### 4. Missing soft delete strategy

**Source conflict:**
- No document addresses data retention/deletion

**Resolution:** Add `deleted_at` timestamp to sensitive tables (soft delete pattern).

**Tables with soft delete:**
- `user`
- `business`
- `listing`
- `lead`
- `client_record`
- `advisor_note`
- `review`

**Rationale:**
- AU privacy law may require data deletion requests
- Compliance audits need historical records
- Soft delete allows recovery + audit trail

---

### 5. Missing AdvisorNote versioning

**Source conflict:**
- `copilot-v1`: Implies regeneration of notes possible
- `data-schema`: No versioning on AdvisorNote
- `xtemp` feedback: Recommends separate `advisor_note_revision` table

**Resolution:** Use separate `advisor_note_revision` table (immutable history).

**Rationale:**
- Cleaner separation: `advisor_note` is metadata, `advisor_note_revision` is content
- Immutable revisions are better for compliance audits
- `current_revision_id` on `advisor_note` provides fast access to latest
- Each revision tracks `source` (manual vs copilot) and `source_ref_id`

---

### 6. Missing fields from search-ranking

**Fields added to `listing`:**
- `is_accepting_clients` (boolean) — capacity toggle
- `availability_mode` (enum: unknown, manual, calendar_connected) — how availability is determined
- `time_to_first_slot_days` (integer) — cached from calendar integration
- `last_availability_refresh_at` (timestamp) — when availability was last updated
- `response_time_hours` (numeric) — computed/cached median response time
- `profile_completeness_score` (numeric 0-100) — computed
- `search_boost` (numeric) — admin override for ranking

---

### 7. Credential scope: advisor vs business

**Source conflict:**
- `data-schema`: `advisor_profile_id (or business_id)` on Credential
- Reality: Some licences are personal (FAR), some are business-level (AFSL, ACL)

**Resolution:** Support both via nullable foreign keys.

```
credential.advisor_profile_id — for personal licences (FAR, real estate agent)
credential.business_id — for business licences (AFSL holder, ACL holder)
```

**Constraint:** At least one must be set.

---

## Additions from Cross-Document Analysis

### From copilot-v1 (not in data-schema)

| Table | Status |
|-------|--------|
| `copilot_run` | Added |
| `copilot_input_artifact` | Added |
| `copilot_output` | Added |

### From search-ranking (not in data-schema)

| Field | Table | Status |
|-------|-------|--------|
| `is_accepting_clients` | listing | Added |
| `response_time_hours` | listing | Added |
| `profile_completeness_score` | listing | Added |

### From advisor-claim-and-verification

| Table/Field | Status |
|-------------|--------|
| `claim_request.evidence_files` | Added as `claim_request_evidence` junction |
| `credential.verification_source` | Added |
| `credential.evidence_file_id` | Added |

---

## Final Canonical Entity List

### Core Identity
- `user`

### Marketplace Supply
- `business`
- `listing`
- `listing_service_area`
- `advisor_profile`
- `advisor_business_role`

### Verification & Trust
- `credential`
- `claim_request`
- `claim_request_evidence`

### Demand & Transactions
- `lead`
- `client_record`
- `conversation`
- `message`
- `message_attachment`
- `booking`
- `review`

### Taxonomy
- `location`
- `specialty`
- `listing_specialty`
- `service_offering`
- `listing_service_offering`

### Copilot (AI Workflow)
- `advisor_note`
- `advisor_note_revision` ← NEW: immutable revision history
- `task`
- `copilot_run`
- `copilot_input_artifact`
- `copilot_output`

### Audit & Support
- `audit_event` ← NEW: compliance audit trail
- `file_upload`
