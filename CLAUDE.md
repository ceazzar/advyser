# CLAUDE.md - Advyser Development Guidelines

## Multi-Agent Orchestration (Always Use)

When executing complex tasks, **always use multi-agents with an orchestrator pattern**:

1. **Orchestrator Agent** - Plans work, identifies conflicts, coordinates parallel tasks
2. **Worker Agents** - Execute non-conflicting tasks in parallel

### Conflict Zones (Never Parallel)
- Same file edits
- Database migrations
- Git operations
- Package.json changes

### Safe to Parallelize
- Reading/exploring different areas
- Editing files in different directories
- Running independent tests
- Code review + documentation

### Mid-Task Requests
When user sends a new request while work is in progress:
- **Spin up parallel agents** for the new request instead of interrupting current work
- Document the request, spawn agent, continue main work
- Merge results when both complete

### Orchestration Prompt Template
```
Act as orchestrator. Break this task into:
1. Sequential tasks (have dependencies or conflicts)
2. Parallel tasks (independent, can run simultaneously)
Then coordinate execution, starting parallel tasks together.
```

---

## Project Context

**Stack:** Next.js 16 + TypeScript + Shadcn UI + Tailwind 4 + PostgreSQL

**Key Paths:**
- `app/src/app/` - Pages and layouts (App Router)
- `app/src/components/ui/` - Shadcn components
- `app/src/lib/` - Utilities and design tokens
- `database/schema.sql` - PostgreSQL schema
- `plans/BUILD_PLAN.md` - Development roadmap

**Design System:** Locked. Primary: Neutral Gray (#0A0A0A). Font: DM Sans. Radius: 6px.

---

## Development Rules

1. **Read before edit** - Always read files before modifying
2. **Design system locked** - No color/typography changes without explicit approval
3. **Shadcn patterns** - Use existing component composition, don't reinvent
4. **Path aliases** - Use `@/` for imports from `src/`
5. **AU compliance** - Maintain regulatory guardrails for AFSL/advice content

---

## Quick Commands

```bash
# Development
cd app && npm run dev

# Type checking
cd app && npx tsc --noEmit
```

---

## Documentation Format Standards

When creating visual documentation files (research, references, plans, etc.), **always use ASCII box-drawing tables**:

### Table Format
```
┌──────────┬─────────────────────────────────────┐
│  Column  │              Details                │
├──────────┼─────────────────────────────────────┤
│ Row 1    │ Content here                        │
├──────────┼─────────────────────────────────────┤
│ Row 2    │ More content                        │
└──────────┴─────────────────────────────────────┘
```

### Box-Drawing Characters
- Corners: `┌` `┐` `└` `┘`
- Intersections: `┼` `├` `┤` `┬` `┴`
- Lines: `─` (horizontal) `│` (vertical)

### Document Structure
1. **Section headers** with emoji icons (📊, 🎯, ✅, 🏅)
2. **Horizontal rules** (`---`) to separate major sections
3. **Consistent column widths** within each table
4. **Clean alignment** - pad content to fit columns evenly

### Example
```
🎯 Implementation Roadmap
┌──────────┬────────────────────────┬──────────────────┐
│ Priority │        Pattern         │   Source Site    │
├──────────┼────────────────────────┼──────────────────┤
│ P1       │ Trust badges           │ Supabase, Clerk  │
├──────────┼────────────────────────┼──────────────────┤
│ P2       │ Interactive calculator │ Wise             │
└──────────┴────────────────────────┴──────────────────┘
```

**Never use markdown tables** (`| col |`) for visual documentation files. ASCII box tables are more readable and look professional.

**File extension:** Do NOT use `.md` extension for visual documentation with ASCII tables. Use no extension (e.g., `research`, `website-references`) so the file renders as plain text without markdown parsing.

---

## Current Build: Public Header

**Status:** In Progress
**Reference:** Wise-style single-tier header

### High-Fidelity Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                         │
│  Advyser          Find Advisors   How It Works   Resources   For Advisors              │
│  ────────                                                                               │
│  (bold, 20px)     (14px, gray-600, hover:gray-900)                                      │
│                                                                                         │
│                                                              Log in    ┌──────────────┐│
│                                                              (gray)    │Find an Advisor││
│                                                                        │  (teal pill) ││
│                                                                        └──────────────┘│
│                                                                                         │
│  Height: 64px │ Background: white │ Border-bottom: gray-100 │ Sticky: top-0            │
└─────────────────────────────────────────────────────────────────────────────────────────┘

Mobile (< 1024px):
┌─────────────────────────────────────────┐
│  Advyser                           ☰   │
│                                         │
│  (hamburger opens right-side sheet)     │
└─────────────────────────────────────────┘
```

### Specifications

┌────────────────┬────────────────────────────────────────────────────┐
│    Element     │                   Specification                    │
├────────────────┼────────────────────────────────────────────────────┤
│ Logo           │ "Advyser" - text-xl font-bold text-gray-900       │
├────────────────┼────────────────────────────────────────────────────┤
│ Nav Links      │ Find Advisors → /search                           │
│                │ How It Works → /how-it-works                      │
│                │ Resources → /resources                            │
│                │ For Advisors → /for-advisors                      │
├────────────────┼────────────────────────────────────────────────────┤
│ Login          │ text-sm text-gray-600 → /login                    │
├────────────────┼────────────────────────────────────────────────────┤
│ CTA Button     │ "Find an Advisor" - rounded-full bg-primary px-6  │
│                │ Links to /search                                  │
├────────────────┼────────────────────────────────────────────────────┤
│ Mobile         │ Sheet component, slides from right                │
│                │ Breakpoint: lg (1024px)                           │
└────────────────┴────────────────────────────────────────────────────┘

### Design Decisions

1. **Single-tier** (not two-tier like Unbiased) - cleaner, matches Wise
2. **4 nav items** - Find Advisors, How It Works, Resources, For Advisors
3. **Pill CTA** - rounded-full like Wise's green button
4. **"Find an Advisor"** - action-oriented, matches core user intent

---

## Improvement Log

┌────────────┬───────────────────────────────────┬─────────────────────────────────────────────┐
│    Date    │              Change               │                   Reason                    │
├────────────┼───────────────────────────────────┼─────────────────────────────────────────────┤
│ 2026-02-01 │ Initial creation                  │ Multi-agent orchestration + project context │
├────────────┼───────────────────────────────────┼─────────────────────────────────────────────┤
│ 2026-02-01 │ Added documentation format rules  │ Enforce ASCII box tables for visual docs    │
├────────────┼───────────────────────────────────┼─────────────────────────────────────────────┤
│ 2026-02-02 │ Migrated frontend/ → site/ → app/  │ Cleaned up orphaned dirs, updated all refs  │
├────────────┼───────────────────────────────────┼─────────────────────────────────────────────┤
│ 2026-02-02 │ Fixed design system docs          │ Updated Primary color to Gray (was Teal)    │
└────────────┴───────────────────────────────────┴─────────────────────────────────────────────┘
