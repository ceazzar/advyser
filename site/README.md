# Advyser Frontend

Next.js app for the Advyser advisor marketplace.

## Prerequisites

- Node.js 20+
- npm 10+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Access to a Supabase project (URL, anon key, service role key, Postgres URL)

## Environment Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in real credentials.
3. Validate env values:

```bash
npm run env:check
```

## Phase 5 Bootstrap Flow

Run from this directory (`site/`):

```bash
npm run setup
npm run db:migrate
npm run db:types
npm run db:seed
npm run db:verify-seed
npm run db:verify-phase6
npm run db:verify-phase7
npm run db:verify-phase8
npm run verify:ci
```

One-shot command:

```bash
npm run verify:phase5
```

## Daily Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Command Reference

- `npm run setup`: install dependencies with lockfile.
- `npm run env:check`: ensure required env vars exist.
- `npm run db:migrate`: align local migration history to the linked remote project and apply pending migrations.
- `npm run db:types`: generate TypeScript DB types at `src/types/database.generated.ts`.
- `npm run db:seed`: seed demo auth users and realistic marketplace flow records.
- `npm run db:verify-seed`: assert seeded auth/public users and core-flow records are present.
- `npm run db:verify-phase6`: verify table-wide RLS + cross-tenant access controls.
- `npm run db:verify-phase7`: verify trust badge policy, consent/audit writes, and review integrity scaffolding.
- `npm run db:verify-phase8`: verify phase-8 schema/data-layer coverage, generated types, and seeded flow assertions.
- `npm run db:verify-phase9`: verify phase-9 API route contracts, lifecycle transition coverage, and DB function presence.
- `npm run verify:phase10-ui`: verify phase-10 UI critical routes use live APIs and contain no blocked mock patterns.
- `npm run verify:ci`: lint + tests + build.
- `npm run verify:phase5`: env + migrate + typegen + seed + seed verification + CI baseline.
- `npm run verify:phase6`: env + migrate + seed + seed verification + RLS verification + CI baseline.
- `npm run verify:phase7`: env + migrate + seed + seed/RLS/trust verification + CI baseline.
- `npm run verify:phase8`: env + migrate + typegen + seed + seed/RLS/trust/phase8 verification + CI baseline.
- `npm run verify:phase9`: env + migrate + typegen + seed + phase6/7/8/9 verification + CI baseline.
- `npm run verify:phase10`: phase9 verification + phase10 UI integration verification.
