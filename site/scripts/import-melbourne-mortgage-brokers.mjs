#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

import {
  getDefaultEnvFiles,
  getMissingKeys,
  loadEnvFiles,
  parseModeArg,
} from "./env-utils.mjs";

const { Client } = pg;

const UUID_NAMESPACE = {
  root: "f8e515f5-995b-43be-bd7d-4e3cf3634a42",
  location: "8a2f3634-6a68-4c0f-9523-0a7f45a3df4e",
  business: "d5a2d96d-b38f-40f6-8c63-ef8b8fe41c4e",
  user: "6eddf6b3-64df-4b3b-8d6b-35f105102030",
  advisorProfile: "c3f59cf4-a51f-4ab4-b532-2ae18917a450",
  listing: "1ae6fbfa-5059-4644-9b08-73fa6bb80b38",
  credential: "79d5d988-d131-4c5f-b455-f0f1e1230123",
};

const scriptDir = dirname(fileURLToPath(import.meta.url));
const siteDir = resolve(scriptDir, "..");

function printHelp() {
  console.log(`
Usage:
  node ./scripts/import-melbourne-mortgage-brokers.mjs [options]

Options:
  --mode=<local|staging|production>  Environment mode (default: local)
  --input <path>                     Input CSV (default: output/data/mortgage-brokers/melbourne_mortgage_broker_candidates_keyword_filtered.csv)
  --limit <number>                   Only import the first N rows
  --dry-run                          Parse and validate only (no DB writes)
  --help, -h                         Show this help
`);
}

function parseArgs(argv) {
  const mode = parseModeArg(argv.slice(2), process.env.APP_ENV || "local");
  const args = {
    mode,
    input: resolve(
      siteDir,
      "output/data/mortgage-brokers/melbourne_mortgage_broker_candidates_keyword_filtered.csv"
    ),
    limit: null,
    dryRun: false,
  };

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    if (arg === "--input") {
      args.input = resolve(process.cwd(), argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === "--limit") {
      args.limit = Number(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }
  }

  if (args.limit !== null && (!Number.isFinite(args.limit) || args.limit <= 0)) {
    throw new Error("--limit must be a positive number");
  }

  return args;
}

function uuidToBytes(uuid) {
  const hex = uuid.replace(/-/g, "");
  if (hex.length !== 32) throw new Error(`Invalid UUID: ${uuid}`);

  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToUuid(bytes) {
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidV5(name, namespaceUuid) {
  const namespaceBytes = uuidToBytes(namespaceUuid);
  const nameBytes = Buffer.from(name, "utf8");
  const content = Buffer.concat([Buffer.from(namespaceBytes), nameBytes]);
  const hash = createHash("sha1").update(content).digest();
  const bytes = Uint8Array.from(hash.subarray(0, 16));

  // RFC 4122 version 5
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  // RFC 4122 variant
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}

function parseCsv(csvText) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  const pushField = () => {
    row.push(current);
    current = "";
  };

  const pushRow = () => {
    if (row.length === 1 && row[0] === "") {
      row = [];
      return;
    }
    rows.push(row);
    row = [];
  };

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const next = csvText[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      pushField();
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      pushField();
      pushRow();
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    pushField();
    pushRow();
  }

  if (rows.length < 2) {
    return [];
  }

  const header = rows[0].map((value) => value.trim());
  const records = [];

  for (let i = 1; i < rows.length; i += 1) {
    const line = rows[i];
    const record = {};
    for (let j = 0; j < header.length; j += 1) {
      record[header[j]] = (line[j] || "").trim();
    }
    records.push(record);
  }

  return records;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeName(value) {
  return normalizeText(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function parseNumber(value) {
  if (!value) return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function parseIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function splitAbnAcn(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 11) {
    return { abn: digits, acn: null };
  }
  if (digits.length === 9) {
    return { abn: null, acn: digits };
  }
  return { abn: null, acn: null };
}

function toImportRow(rawRow) {
  const state = normalizeText(rawRow.state).toUpperCase();
  const locality = normalizeText(rawRow.locality);
  const postcode = normalizeText(rawRow.postcode);
  const name = normalizeText(rawRow.name);
  const dedupeKey = normalizeText(rawRow.dedupe_key);

  if (!name || !dedupeKey) return null;
  if (state !== "VIC") return null;
  if (!locality || !postcode) return null;

  const credentialType = normalizeText(rawRow.credential_type);
  if (credentialType !== "acl" && credentialType !== "credit_rep") return null;

  const credentialNumber = normalizeText(rawRow.credential_number);
  if (!credentialNumber) return null;

  const sourceUrl = normalizeText(rawRow.dataset_url);

  const { abn, acn } = splitAbnAcn(rawRow.abn_acn);
  const lat = parseNumber(rawRow.latitude);
  const lng = parseNumber(rawRow.longitude);

  const locationKey = `${state}|${locality.toUpperCase()}|${postcode}`;
  const businessKey = abn || acn || `name:${normalizeName(name)}|${locationKey}`;

  const businessId = uuidV5(`business:${businessKey}`, UUID_NAMESPACE.business);
  const locationId = uuidV5(`location:${locationKey}`, UUID_NAMESPACE.location);
  const userId = uuidV5(`user:${businessKey}`, UUID_NAMESPACE.user);
  const advisorProfileId = uuidV5(`advisor:${businessKey}`, UUID_NAMESPACE.advisorProfile);
  const listingId = uuidV5(`listing:${businessKey}`, UUID_NAMESPACE.listing);
  const credentialId = uuidV5(
    `credential:${credentialType}:${credentialNumber}`,
    UUID_NAMESPACE.credential
  );

  return {
    rowKey: dedupeKey,
    source: normalizeText(rawRow.source),
    entityType: normalizeText(rawRow.entity_type),
    name,
    state,
    locality,
    postcode,
    lat,
    lng,
    distanceKm: parseNumber(rawRow.distance_km),
    startDate: parseIsoDate(rawRow.start_date),
    endDate: parseIsoDate(rawRow.end_date),
    credentialType,
    credentialNumber,
    linkedLicenseeNumber: normalizeText(rawRow.linked_licensee_number),
    sourceUrl,
    abn,
    acn,
    businessId,
    locationId,
    userId,
    advisorProfileId,
    listingId,
    credentialId,
  };
}

function makeImportedEmail(userId) {
  return `imported+${userId.replace(/-/g, "")}@advyser.local`;
}

function toPgClientConnectionString(rawUrl) {
  const parsed = new URL(rawUrl);
  parsed.searchParams.delete("sslmode");
  parsed.searchParams.set("sslmode", "require");
  parsed.searchParams.set("uselibpqcompat", "true");
  return parsed.toString();
}

async function upsertLocation(client, row, stats) {
  const result = await client.query(
    `
    INSERT INTO public.location (
      id, country, state, suburb, postcode, lat, lng
    ) VALUES (
      $1, 'AU', $2::au_state, $3, $4, $5, $6
    )
    ON CONFLICT (state, suburb, postcode) DO UPDATE SET
      lat = COALESCE(public.location.lat, EXCLUDED.lat),
      lng = COALESCE(public.location.lng, EXCLUDED.lng)
    RETURNING id, xmax = 0 AS inserted
    `,
    [row.locationId, row.state, row.locality, row.postcode, row.lat, row.lng]
  );

  if (result.rowCount === 0) return null;

  if (result.rows[0].inserted) {
    stats.locationsInserted += 1;
  } else {
    stats.locationsUpdated += 1;
  }

  return result.rows[0].id;
}

async function upsertUser(client, row, stats) {
  const displayName = row.name.slice(0, 100);
  const email = makeImportedEmail(row.userId);

  const result = await client.query(
    `
    INSERT INTO public.users (
      id, email, role, display_name
    ) VALUES (
      $1, $2, 'advisor', $3
    )
    ON CONFLICT (id) DO UPDATE SET
      display_name = EXCLUDED.display_name
    RETURNING id, xmax = 0 AS inserted
    `,
    [row.userId, email, displayName]
  );

  if (result.rowCount === 0) return null;

  if (result.rows[0].inserted) {
    stats.usersInserted += 1;
  } else {
    stats.usersUpdated += 1;
  }

  return result.rows[0].id;
}

async function findExistingBusinessId(client, row) {
  if (row.abn) {
    const existing = await client.query(
      `
      SELECT id
      FROM public.business
      WHERE abn = $1
        AND deleted_at IS NULL
      LIMIT 1
      `,
      [row.abn]
    );
    if (existing.rowCount > 0) return existing.rows[0].id;
  }

  if (row.acn) {
    const existing = await client.query(
      `
      SELECT id
      FROM public.business
      WHERE acn = $1
        AND deleted_at IS NULL
      LIMIT 1
      `,
      [row.acn]
    );
    if (existing.rowCount > 0) return existing.rows[0].id;
  }

  return null;
}

async function upsertBusiness(client, row, locationId, stats) {
  const existingByRegId = await findExistingBusinessId(client, row);
  const businessId = existingByRegId || row.businessId;

  const result = await client.query(
    `
    INSERT INTO public.business (
      id,
      legal_name,
      trading_name,
      abn,
      acn,
      primary_location_id,
      claimed_status,
      created_source
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      'unclaimed',
      'import'
    )
    ON CONFLICT (id) DO UPDATE SET
      legal_name = EXCLUDED.legal_name,
      trading_name = EXCLUDED.trading_name,
      abn = COALESCE(public.business.abn, EXCLUDED.abn),
      acn = COALESCE(public.business.acn, EXCLUDED.acn),
      primary_location_id = COALESCE(public.business.primary_location_id, EXCLUDED.primary_location_id),
      created_source = 'import'
    RETURNING id, xmax = 0 AS inserted
    `,
    [
      businessId,
      row.name.slice(0, 255),
      row.name.slice(0, 255),
      row.abn,
      row.acn,
      locationId,
    ]
  );

  if (result.rowCount === 0) return null;

  if (result.rows[0].inserted) {
    stats.businessesInserted += 1;
  } else {
    stats.businessesUpdated += 1;
  }

  return result.rows[0].id;
}

async function upsertAdvisorProfile(client, row, userId, businessId, stats) {
  const result = await client.query(
    `
    INSERT INTO public.advisor_profile (
      id,
      user_id,
      business_id,
      display_name,
      position_title,
      bio
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      'Mortgage Broker',
      $5
    )
    ON CONFLICT (id) DO UPDATE SET
      business_id = EXCLUDED.business_id,
      display_name = EXCLUDED.display_name,
      position_title = EXCLUDED.position_title,
      bio = EXCLUDED.bio
    RETURNING id, xmax = 0 AS inserted
    `,
    [
      row.advisorProfileId,
      userId,
      businessId,
      row.name.slice(0, 100),
      `Imported from ASIC credit registers (${row.source}). Claim profile to add full details.`,
    ]
  );

  if (result.rowCount === 0) return null;

  if (result.rows[0].inserted) {
    stats.advisorProfilesInserted += 1;
  } else {
    stats.advisorProfilesUpdated += 1;
  }

  return result.rows[0].id;
}

async function upsertListing(client, row, businessId, advisorProfileId, stats) {
  const titleLocation = row.locality ? ` in ${row.locality}` : "";
  const result = await client.query(
    `
    INSERT INTO public.listing (
      id,
      business_id,
      advisor_profile_id,
      headline,
      bio,
      advisor_type,
      service_mode,
      fee_model,
      is_active,
      accepting_status,
      verification_level,
      profile_completeness_score,
      search_boost
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      'mortgage_broker',
      'both',
      'unknown',
      true,
      'waitlist',
      'none',
      35,
      0.65
    )
    ON CONFLICT (id) DO UPDATE SET
      business_id = EXCLUDED.business_id,
      advisor_profile_id = EXCLUDED.advisor_profile_id,
      headline = EXCLUDED.headline,
      bio = EXCLUDED.bio,
      advisor_type = EXCLUDED.advisor_type,
      service_mode = EXCLUDED.service_mode,
      fee_model = EXCLUDED.fee_model,
      is_active = EXCLUDED.is_active,
      accepting_status = EXCLUDED.accepting_status,
      verification_level = 'none',
      profile_completeness_score = EXCLUDED.profile_completeness_score,
      search_boost = EXCLUDED.search_boost,
      deleted_at = NULL
    RETURNING id, xmax = 0 AS inserted
    `,
    [
      row.listingId,
      businessId,
      advisorProfileId,
      `Mortgage Broker${titleLocation}`.slice(0, 200),
      `Verified credential imported from ASIC credit registers. Source credential: ${row.credentialType.toUpperCase()} ${row.credentialNumber}.`,
    ]
  );

  if (result.rowCount === 0) return null;

  if (result.rows[0].inserted) {
    stats.listingsInserted += 1;
  } else {
    stats.listingsUpdated += 1;
  }

  return result.rows[0].id;
}

async function upsertVerificationDisclosure(client, row, listingId, stats) {
  const disclosureId = uuidV5(
    `trust-disclosure:${listingId}:verification`,
    UUID_NAMESPACE.root
  );

  const result = await client.query(
    `
    INSERT INTO public.trust_disclosure (
      id,
      listing_id,
      disclosure_kind,
      headline,
      disclosure_text,
      display_order,
      is_active
    ) VALUES (
      $1,
      $2,
      'verification',
      'Verification source',
      $3,
      1,
      true
    )
    ON CONFLICT (listing_id, disclosure_kind) WHERE is_active = true DO UPDATE SET
      headline = EXCLUDED.headline,
      disclosure_text = EXCLUDED.disclosure_text,
      is_active = true
    RETURNING id, xmax = 0 AS inserted
    `,
    [
      disclosureId,
      listingId,
      `Credential verified from ASIC Professional Registers. Imported source: ${row.credentialType.toUpperCase()} ${row.credentialNumber}.`,
    ]
  );

  if (result.rowCount === 0) return;

  if (result.rows[0].inserted) {
    stats.trustDisclosuresInserted += 1;
  } else {
    stats.trustDisclosuresUpdated += 1;
  }
}

async function markListingVerified(client, listingId, stats) {
  const result = await client.query(
    `
    UPDATE public.listing
    SET verification_level = 'licence_verified'
    WHERE id = $1
      AND verification_level <> 'licence_verified'
    `,
    [listingId]
  );

  if (result.rowCount > 0) {
    stats.listingsVerificationPromoted += result.rowCount;
  }
}

async function upsertCredential(client, row, businessId, advisorProfileId, stats) {
  const existing = await client.query(
    `
    SELECT id
    FROM public.credential
    WHERE credential_type = $1::credential_type
      AND credential_number = $2
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [row.credentialType, row.credentialNumber]
  );

  const credentialId = existing.rowCount > 0 ? existing.rows[0].id : row.credentialId;

  const result = await client.query(
    `
    INSERT INTO public.credential (
      id,
      advisor_profile_id,
      business_id,
      credential_type,
      credential_number,
      name_on_register,
      issuing_body,
      state,
      expires_at,
      verification_status,
      verification_source,
      verified_at,
      verification_notes,
      register_url
    ) VALUES (
      $1,
      $2,
      $3,
      $4::credential_type,
      $5,
      $6,
      'ASIC',
      'VIC',
      $7,
      'verified',
      'asic_prs',
      NOW(),
      $8,
      $9
    )
    ON CONFLICT (id) DO UPDATE SET
      advisor_profile_id = EXCLUDED.advisor_profile_id,
      business_id = EXCLUDED.business_id,
      name_on_register = EXCLUDED.name_on_register,
      issuing_body = EXCLUDED.issuing_body,
      state = EXCLUDED.state,
      expires_at = EXCLUDED.expires_at,
      verification_status = EXCLUDED.verification_status,
      verification_source = EXCLUDED.verification_source,
      verified_at = EXCLUDED.verified_at,
      verification_notes = EXCLUDED.verification_notes,
      register_url = EXCLUDED.register_url,
      deleted_at = NULL
    RETURNING id, xmax = 0 AS inserted
    `,
    [
      credentialId,
      advisorProfileId,
      businessId,
      row.credentialType,
      row.credentialNumber,
      row.name,
      row.endDate,
      `Imported from ASIC dataset (${row.source}).`,
      row.sourceUrl || null,
    ]
  );

  if (result.rowCount === 0) return null;

  if (result.rows[0].inserted) {
    stats.credentialsInserted += 1;
  } else {
    stats.credentialsUpdated += 1;
  }

  return result.rows[0].id;
}

async function main() {
  const args = parseArgs(process.argv);

  loadEnvFiles(siteDir, getDefaultEnvFiles(args.mode));

  const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  const missing = getMissingKeys(dbUrl ? [] : ["POSTGRES_URL or POSTGRES_URL_NON_POOLING"]);

  if (missing.length > 0) {
    throw new Error(`Cannot import; missing keys: ${missing.join(", ")}`);
  }

  const csvText = await readFile(args.input, "utf8");
  const parsed = parseCsv(csvText)
    .map(toImportRow)
    .filter(Boolean);

  const rows = args.limit ? parsed.slice(0, args.limit) : parsed;

  if (rows.length === 0) {
    console.log("No valid rows found to import.");
    return;
  }

  const stats = {
    totalInputRows: rows.length,
    locationsInserted: 0,
    locationsUpdated: 0,
    usersInserted: 0,
    usersUpdated: 0,
    businessesInserted: 0,
    businessesUpdated: 0,
    advisorProfilesInserted: 0,
    advisorProfilesUpdated: 0,
    listingsInserted: 0,
    listingsUpdated: 0,
    listingsVerificationPromoted: 0,
    trustDisclosuresInserted: 0,
    trustDisclosuresUpdated: 0,
    credentialsInserted: 0,
    credentialsUpdated: 0,
    skipped: 0,
  };

  if (args.dryRun) {
    console.log(JSON.stringify({ mode: args.mode, input: args.input, ...stats }, null, 2));
    return;
  }

  const client = new Client({
    connectionString: toPgClientConnectionString(dbUrl),
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    await client.query("BEGIN");

    for (const row of rows) {
      const locationId = await upsertLocation(client, row, stats);
      if (!locationId) {
        stats.skipped += 1;
        continue;
      }

      const userId = await upsertUser(client, row, stats);
      if (!userId) {
        stats.skipped += 1;
        continue;
      }

      const businessId = await upsertBusiness(client, row, locationId, stats);
      if (!businessId) {
        stats.skipped += 1;
        continue;
      }

      const advisorProfileId = await upsertAdvisorProfile(client, row, userId, businessId, stats);
      if (!advisorProfileId) {
        stats.skipped += 1;
        continue;
      }

      const listingId = await upsertListing(client, row, businessId, advisorProfileId, stats);
      if (!listingId) {
        stats.skipped += 1;
        continue;
      }

      await upsertVerificationDisclosure(client, row, listingId, stats);
      await markListingVerified(client, listingId, stats);

      const credentialId = await upsertCredential(client, row, businessId, advisorProfileId, stats);
      if (!credentialId) {
        stats.skipped += 1;
        continue;
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }

  console.log(JSON.stringify({ mode: args.mode, input: args.input, ...stats }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
