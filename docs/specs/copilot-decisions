# Copilot v1: Model + Transcript Source Decisions

## Overview

This document captures pragmatic decisions for Copilot v1 implementation. The goal is to ship fast with sensible defaults, not build the perfect system.

**V1 Mantra:** *"Drafts for the advisor. Advisor decides."*

---

## Transcript Source (V1)

### Decision: Manual Paste/Upload First

| Input Method | V1 Support | Notes |
|--------------|------------|-------|
| Paste transcript text | Yes | Primary method |
| Upload .txt / .docx | Yes | Parse and extract |
| Upload PDF | Yes | Text extraction via parser |
| Paste meeting notes | Yes | Free-form text |
| Upload audio file | No (v1.1) | Requires transcription service |
| Zoom/Meet integration | No (v2+) | Complex OAuth + webhook setup |
| Live recording | No (v3+) | Real-time processing |

### Rationale

- Most advisors already have transcripts from Otter, Fireflies, or manual notes
- Avoids integration complexity at launch
- Reduces privacy/security surface area
- Faster time to value

### File Handling

```
1. User uploads file
2. Virus scan (async)
3. Store in S3/GCS
4. Extract text:
   - .txt: direct read
   - .docx: parse with library
   - PDF: text extraction (PyMuPDF, pdfplumber, etc.)
5. Normalize whitespace
6. Pass to LLM
```

---

## Model Strategy (V1)

### Decision: High-Quality LLM + Safety Checker

| Component | Model Type | Purpose |
|-----------|------------|---------|
| Primary generation | High-quality LLM | Summarization, drafting, action items |
| Safety checker | Smaller/faster LLM OR rule-based | Recommendation language detection |

### Primary Generation Model

**Requirements:**
- Strong summarization capabilities
- Good at structured output (JSON/markdown)
- Reliable instruction following
- Context window: 32K+ tokens (for long transcripts)

**Candidates:**
- Claude 3.5 Sonnet / Claude 3 Opus
- GPT-4 Turbo / GPT-4o
- Gemini 1.5 Pro

**V1 Default:** Use Claude or GPT-4 class model via API.

### Safety Checker

**Purpose:** Flag outputs that sound like recommendations/advice.

**V1 Approach:**
1. Rule-based first pass:
   - Regex patterns for "you should", "I recommend", "best option"
   - Entity detection for product names, suburb names
2. LLM second pass (optional):
   - Smaller model reviews flagged content
   - Classifies as safe/needs-review

**Decision:** Rule-based + optional LLM escalation.

### Error Handling

| Scenario | Action |
|----------|--------|
| Generation fails | Retry 1x, then show error |
| Safety check fails | Show warning, allow advisor to edit |
| Rate limit hit | Queue and retry with backoff |
| Timeout | Fail gracefully, show partial results if available |

---

## Latency Targets

| Operation | Target (p50) | Target (p95) |
|-----------|--------------|--------------|
| Single output (summary) | 3s | 8s |
| Full pack (5 outputs) | 8s | 20s |
| File upload + extraction | 2s | 5s |
| Safety check | 500ms | 1s |

### Achieving Latency Targets

1. **Parallelize outputs:** Generate summary, actions, follow-up concurrently
2. **Stream responses:** Show partial results as they arrive
3. **Cache templates:** Pre-load advisor's template preferences
4. **Edge processing:** Text extraction at upload time, not generation time

---

## Prompt Architecture

### System Prompt Structure

```
[Role Definition]
You are an assistant helping professional advisors document client meetings.
You do NOT provide advice to clients. You help advisors with workflow.

[Output Format]
Return structured JSON with the following fields...

[Safety Rules]
- Never generate recommendations for specific products
- Never suggest specific suburbs/properties
- Never say "you should invest in..." or similar
- If asked to recommend, respond with "I can help draft questions to discuss with your advisor"

[Advisor Context]
Advisor type: {financial_adviser|mortgage_broker|buyers_agent|property_adviser}
Meeting type: {discovery|review|strategy|pre-approval}
Tone preference: {formal|friendly}

[Template]
{advisor's custom template if any}
```

### Output Schema (JSON)

```json
{
  "summary": {
    "purpose": "string",
    "key_topics": ["string"],
    "client_goals": ["string"],
    "constraints": ["string"],
    "decisions": ["string"],
    "open_questions": ["string"]
  },
  "action_items": {
    "advisor_tasks": [{"task": "string", "due": "string|null"}],
    "client_tasks": [{"task": "string", "due": "string|null"}]
  },
  "follow_up": {
    "subject": "string",
    "body": "string"
  },
  "client_brief": {
    "goals": "string",
    "situation": "string",
    "financial_snapshot": {},
    "preferences": {},
    "outstanding_info": ["string"],
    "next_objective": "string"
  },
  "compliance_flags": {
    "phrases_to_review": [{"phrase": "string", "reason": "string"}],
    "missing_disclosures": ["string"],
    "ambiguities": ["string"]
  }
}
```

---

## Prompt Versioning

### Storage

| Field | Location | Purpose |
|-------|----------|---------|
| `prompt_version` | `copilot_run` | Which prompt was used |
| `model_id` | `copilot_run` | Which model version |
| `schema_version` | `copilot_output` | Output schema version |

### Version Format

```
prompt_version: "v1.2.0"
  - v1 = major (breaking changes)
  - 2 = minor (new capabilities)
  - 0 = patch (bug fixes)
```

### Rollback Strategy

- Keep last 3 prompt versions deployable
- A/B test new prompts on 10% traffic
- Monitor output quality metrics before full rollout

---

## Sensitive Data Handling

### Default Behavior: Redact

Detect and redact common sensitive identifiers:

| Type | Pattern | Replacement |
|------|---------|-------------|
| TFN | 9 digits, specific format | `[TFN REDACTED]` |
| Medicare | 10-11 digits | `[MEDICARE REDACTED]` |
| Passport | Alphanumeric patterns | `[PASSPORT REDACTED]` |
| Bank account | 6-10 digits after BSB | `[ACCOUNT REDACTED]` |
| Credit card | 16 digits | `[CARD REDACTED]` |

### Advisor Override

- Advisor can opt-out of redaction for internal notes
- Setting stored per-advisor
- Default is redaction ON

### Implementation

```
1. Pre-process input text
2. Run regex patterns for sensitive data
3. Replace with placeholders
4. Generate outputs
5. (Optional) Post-process to re-insert if advisor opted out
```

---

## Future Upgrades (NOT V1)

| Feature | Version | Dependency |
|---------|---------|------------|
| Audio transcription | v1.1 | Whisper API / Deepgram |
| Zoom/Meet integration | v2.0 | OAuth + webhooks |
| Live meeting companion | v3.0 | WebSocket, real-time LLM |
| Embedding-based recall | v2.0 | Vector DB (pgvector) |
| Multi-language support | v2.0 | Translation pipeline |

---

## Success Metrics (V1)

| Metric | Target | Measurement |
|--------|--------|-------------|
| % meetings with Copilot run | > 50% of Pro advisors | Weekly active usage |
| Time from meeting → note saved | < 10 minutes (vs 30+ manual) | Timestamp delta |
| Follow-up drafts generated → sent | > 40% | Finalization rate |
| Advisor satisfaction | NPS > 50 | Survey |
| Safety flag false positive rate | < 10% | Manual review sample |

---

## Implementation Checklist

### Phase 1: Core Generation

- [ ] Set up LLM API integration
- [ ] Implement prompt templates
- [ ] Build JSON output parser
- [ ] Create file upload + text extraction
- [ ] Implement basic safety rules (regex)

### Phase 2: UX Integration

- [ ] Add Copilot tab to client workspace
- [ ] Build output editor UI
- [ ] Implement "Save to Notes" action
- [ ] Add "Create Tasks" action
- [ ] Build copy-to-clipboard / export

### Phase 3: Polish

- [ ] Add streaming responses
- [ ] Implement template customization
- [ ] Add regenerate/refine buttons
- [ ] Build usage analytics
- [ ] Implement rate limiting / usage tracking
