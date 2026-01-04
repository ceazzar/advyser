# Data Lifecycle: Soft Delete, Versioning, Audit

## Overview

This document defines how data is deleted, versioned, and audited across the Advyser platform. These policies support:

- AU privacy law compliance (data deletion requests)
- Regulatory audits (record retention)
- Copilot regeneration (note versioning)
- Incident investigation (audit trail)

---

## 1) Soft Delete Strategy

### Principle

User-generated content is **soft-deleted** by default. Hard deletion only for legal requests.

### Tables with Soft Delete

| Table | `deleted_at` | `deleted_by_user_id` |
|-------|--------------|----------------------|
| `user` | Yes | No (self-service) |
| `business` | Yes | Yes |
| `listing` | Yes | Yes |
| `lead` | Yes | Yes |
| `client_record` | Yes | Yes |
| `conversation` | Yes | No |
| `message` | Yes | No |
| `advisor_note` | Yes | Yes |
| `copilot_run` | Yes | No |
| `copilot_output` | Yes | No |
| `review` | Yes | Yes |
| `file_upload` | Yes | No |

### Soft Delete Rules

1. **Soft-deleted records do not appear in UI/search**
   - All queries should include `WHERE deleted_at IS NULL`
   - Partial indexes exist for performance

2. **Related records cascade soft-delete where appropriate**
   - Deleting a `client_record` soft-deletes its `advisor_note` records
   - Deleting a `business` soft-deletes its `listing` records

3. **Audit retains metadata**
   - `audit_event` records who deleted what and when
   - Soft-deleted records remain queryable by admins

4. **Hard deletion only for:**
   - Legal/privacy requests (GDPR-style, AU Privacy Act)
   - Explicit user account deletion requests
   - Retention period expiry (if policy defined)

---

## 2) AdvisorNote Versioning

### Architecture

```
advisor_note (metadata)
    │
    └── advisor_note_revision (immutable content history)
            ├── revision 1 (initial)
            ├── revision 2 (advisor edit)
            └── revision 3 (copilot regeneration)
```

### How It Works

1. **Creating a note:**
   - Insert into `advisor_note` (metadata only)
   - Insert into `advisor_note_revision` with `revision_number = 1`
   - Set `advisor_note.current_revision_id` to the new revision

2. **Editing a note:**
   - Insert new `advisor_note_revision` with incremented `revision_number`
   - Update `advisor_note.current_revision_id`
   - Original revision remains immutable

3. **Copilot regeneration:**
   - Same as editing, but `source = 'copilot'` and `source_ref_id = copilot_output.id`

### Revision Fields

| Field | Purpose |
|-------|---------|
| `revision_number` | Sequential version (1, 2, 3...) |
| `content` | Full note content (not a diff) |
| `created_by_user_id` | Who made this revision |
| `source` | 'manual' or 'copilot' |
| `source_ref_id` | Links to `copilot_output.id` if AI-generated |
| `created_at` | Immutable timestamp |

### Querying

```sql
-- Get current content
SELECT r.content
FROM advisor_note n
JOIN advisor_note_revision r ON r.id = n.current_revision_id
WHERE n.id = :note_id;

-- Get full history
SELECT * FROM advisor_note_revision
WHERE advisor_note_id = :note_id
ORDER BY revision_number DESC;
```

---

## 3) Copilot Output Edit History

### Storage Model

| Field | Purpose |
|-------|---------|
| `generated_content` | Original AI output (immutable) |
| `edited_content` | Advisor's modified version (nullable) |
| `is_approved` | Advisor explicitly approved |
| `finalized_at` | When saved to Notes/Tasks/Messages |
| `finalized_to` | Target: 'advisor_note', 'task', 'message_draft' |
| `finalized_ref_id` | ID of created entity |

### Workflow

1. **Generation:** AI creates output → stored in `generated_content`
2. **Editing:** Advisor modifies → stored in `edited_content`
3. **Approval:** Advisor clicks approve → `is_approved = true`
4. **Finalization:** Advisor saves to notes → `finalized_at` set, entity created

### Compliance Value

- Always know what AI generated vs what advisor sent
- Audit trail for "did AI create this?"

---

## 4) Audit Log

### What Gets Logged

| Category | Actions |
|----------|---------|
| Claims | `claim.submitted`, `claim.approved`, `claim.denied` |
| Verification | `credential.verified`, `credential.rejected`, `credential.expired` |
| Copilot | `copilot.run_started`, `copilot.run_completed`, `copilot.output_finalized` |
| Moderation | `review.published`, `review.rejected`, `listing.suspended` |
| Deletion | `user.deleted`, `business.deleted`, `note.deleted` |
| Access | `admin.viewed_pii` (optional, high-security) |

### Audit Event Schema

```sql
audit_event (
    id,
    actor_user_id,      -- who did it
    action,             -- what happened
    entity_type,        -- what type of thing
    entity_id,          -- which one
    metadata_json,      -- additional context
    ip_address,         -- request origin
    user_agent,         -- client info
    created_at          -- when
)
```

### Example Events

```json
{
  "action": "claim.approved",
  "entity_type": "claim_request",
  "entity_id": "uuid-123",
  "metadata_json": {
    "business_id": "uuid-456",
    "verification_level": "licence_verified"
  }
}
```

```json
{
  "action": "copilot.output_finalized",
  "entity_type": "copilot_output",
  "entity_id": "uuid-789",
  "metadata_json": {
    "output_type": "summary",
    "finalized_to": "advisor_note",
    "was_edited": true
  }
}
```

### Retention

- Audit events are **never deleted** (append-only)
- Consider archiving to cold storage after 2 years
- Index on `(entity_type, entity_id, created_at)` for entity timeline queries

---

## 5) Data Retention Policies (Future)

| Data Type | Retention | Notes |
|-----------|-----------|-------|
| Active user data | Indefinite | While account active |
| Soft-deleted records | 90 days | Then hard-delete eligible |
| Audit events | 7 years | Regulatory compliance |
| Copilot inputs | 30 days | Transcripts/uploads |
| Message attachments | 1 year | Storage cost management |

---

## Implementation Checklist

- [x] Add `deleted_at` to all relevant tables
- [x] Create `advisor_note_revision` table
- [x] Create `audit_event` table
- [ ] Add soft-delete cascade triggers
- [ ] Add audit logging in application layer
- [ ] Create admin UI for audit log viewing
- [ ] Define retention policy cron jobs
