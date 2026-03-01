#!/usr/bin/env node

/**
 * Pull mortgage broker data from ASIC credit registers (data.gov.au)
 * Supports multiple cities with radius-based filtering.
 *
 * Usage:
 *   node ./scripts/pull-mortgage-brokers.mjs
 *   node ./scripts/pull-mortgage-brokers.mjs --cities melbourne,sydney
 *   node ./scripts/pull-mortgage-brokers.mjs --cities sydney --radius-km 60
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

// ── City configurations ────────────────────────────────────────────────

const CITIES = {
  melbourne: {
    label: "Melbourne",
    lat: -37.8136,
    lng: 144.9631,
    state: "VIC",
  },
  sydney: {
    label: "Sydney",
    lat: -33.8688,
    lng: 151.2093,
    state: "NSW",
  },
};

const DEFAULT_RADIUS_KM = 80;
const DEFAULT_CITIES = ["melbourne", "sydney"];

// ── ASIC CKAN dataset IDs ──────────────────────────────────────────────

const DATASETS = {
  creditLicensee: {
    packageId: "fa0b0d71-b8b8-4af8-bc59-0b000ce0d5e4",
  },
  creditRepresentative: {
    packageId: "a3b6d445-3a00-409a-8b49-53dc62b823bf",
  },
};

// ── CLI arg parsing ────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    outDir: path.resolve(process.cwd(), "output/data/mortgage-brokers"),
    radiusKm: DEFAULT_RADIUS_KM,
    cities: [...DEFAULT_CITIES],
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--out-dir") {
      args.outDir = path.resolve(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--radius-km") {
      args.radiusKm = Number(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--cities") {
      const value = String(argv[i + 1] || "").toLowerCase();
      args.cities = value.split(",").map((c) => c.trim()).filter(Boolean);
      i += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  if (!Number.isFinite(args.radiusKm) || args.radiusKm <= 0) {
    throw new Error("--radius-km must be a positive number");
  }

  for (const city of args.cities) {
    if (!CITIES[city]) {
      throw new Error(`Unknown city: ${city}. Available: ${Object.keys(CITIES).join(", ")}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Usage:
  node ./scripts/pull-mortgage-brokers.mjs [options]

Options:
  --out-dir <path>        Output directory (default: ./output/data/mortgage-brokers)
  --radius-km <number>    Radius from city centre in km (default: 80)
  --cities <list>         Comma-separated cities (default: melbourne,sydney)
                          Available: ${Object.keys(CITIES).join(", ")}
  --help, -h              Show this help text
`);
}

// ── Network helpers ────────────────────────────────────────────────────

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed GET ${url} (${response.status})`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed download ${url} (${response.status})`);
  }
  return response.text();
}

// ── CKAN helpers ───────────────────────────────────────────────────────

function pickLatestTsvResource(resources) {
  const tsvResources = resources
    .filter((resource) => {
      const format = String(resource.format || "").toUpperCase();
      const name = String(resource.name || "").toLowerCase();
      const description = String(resource.description || "").toLowerCase();
      const isHelpFile = name.includes("help file") || description.includes("help file");
      return format === "TSV" && !isHelpFile;
    })
    .sort((a, b) => {
      const aDate = new Date(a.last_modified || a.created || 0).getTime();
      const bDate = new Date(b.last_modified || b.created || 0).getTime();
      return bDate - aDate;
    });

  if (tsvResources.length === 0) {
    throw new Error("No TSV resources found");
  }

  return tsvResources[0];
}

async function getDatasetResource({ packageId }) {
  const apiUrl = `https://data.gov.au/data/api/3/action/package_show?id=${packageId}`;
  const payload = await fetchJson(apiUrl);

  if (!payload.success || !payload.result?.resources) {
    throw new Error(`Invalid CKAN payload for package: ${packageId}`);
  }

  const resource = pickLatestTsvResource(payload.result.resources);
  return { packageId, apiUrl, resource };
}

// ── TSV / CSV helpers ──────────────────────────────────────────────────

function parseTsv(tsvText) {
  const lines = tsvText.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const header = lines[0].replace(/^\uFEFF/, "").split("\t").map((v) => v.trim());
  const rows = [];

  for (let index = 1; index < lines.length; index += 1) {
    const values = lines[index].split("\t");
    if (values.length === 1 && values[0].trim() === "") continue;

    const row = {};
    for (let i = 0; i < header.length; i += 1) {
      row[header[i]] = (values[i] || "").trim();
    }
    rows.push(row);
  }

  return rows;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\n") || text.includes("\"")) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}

function toCsv(rows, columns) {
  const header = columns.join(",");
  const body = rows.map((row) => columns.map((col) => csvEscape(row[col])).join(",")).join("\n");
  return `${header}\n${body}\n`;
}

// ── Date / geo helpers ─────────────────────────────────────────────────

function parseDdMmYyyy(value) {
  if (!value) return null;
  const [dd, mm, yyyy] = value.split("/").map(Number);
  if (!dd || !mm || !yyyy) return null;
  const date = new Date(Date.UTC(yyyy, mm - 1, dd));
  return Number.isNaN(date.getTime()) ? null : date;
}

function isCurrent(endDateRaw) {
  const endDate = parseDdMmYyyy(endDateRaw);
  if (!endDate) return true;
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return endDate.getTime() >= todayUtc;
}

function asIsoDate(value) {
  const date = parseDdMmYyyy(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Normalisation and dedup ────────────────────────────────────────────

function normalizeName(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function isLikelyMortgageBrokerName(name) {
  const upper = String(name || "").toUpperCase();
  return /MORTGAGE|HOME LOAN|BROKER|BROKING|LENDING/.test(upper);
}

/**
 * Determines if an entity is a mortgage broker based on ASIC authorisations.
 *
 * Mortgage brokers are credit INTERMEDIARIES - they help consumers find
 * a loan but are NOT the lender. Their authorisation says they provide
 * "credit service where the licensee is not or will not be the credit provider".
 *
 * For representatives, the authorisations field often says "Same as Registrant",
 * "Different to Registrant", or contains a numeric licensee reference.
 * In those cases we check the linked licensee's authorisations instead.
 */
function isMortgageBrokerAuth(candidate, licenseeAuthByNumber) {
  const auth = String(candidate.authorisations || "");

  // Direct match: licensee with intermediary authorisation
  if (/credit service.*not or will not be/i.test(auth)) {
    return true;
  }

  // For reps: "Same as Registrant" or "Different to Registrant" or numeric reference
  // Resolve via linked licensee
  if (/same as registrant/i.test(auth) || /different to registrant/i.test(auth) || /^\d+$/.test(auth.trim())) {
    const licenseeAuth = licenseeAuthByNumber.get(candidate.linked_licensee_number) || "";
    return /credit service.*not or will not be/i.test(licenseeAuth);
  }

  // Rep authorisations that directly mention intermediary activity
  if (/intermediary/i.test(auth)) {
    return true;
  }

  return false;
}

function dedupeRows(rows) {
  const byKey = new Map();

  const priority = (row) => {
    if (row.entity_type === "representative") return 3;
    if (row.entity_type === "licensee") return 2;
    return 1;
  };

  for (const row of rows) {
    const abnAcn = String(row.abn_acn || "").trim();
    const key = abnAcn
      ? `abn:${abnAcn}`
      : `name:${normalizeName(row.name)}|postcode:${row.postcode || ""}|type:${row.entity_type}`;

    const existing = byKey.get(key);
    if (!existing || priority(row) > priority(existing)) {
      byKey.set(key, { ...row, dedupe_key: key });
    }
  }

  return [...byKey.values()];
}

// ── File I/O ───────────────────────────────────────────────────────────

async function writeFile(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

// ── Build candidate rows ───────────────────────────────────────────────

function buildLicenseeCandidate(row, datasetUrl) {
  return {
    source: "asic_credit_licensee",
    entity_type: "licensee",
    credential_type: "acl",
    credential_number: row.CRED_LIC_NUM,
    linked_licensee_number: row.CRED_LIC_NUM,
    name: row.CRED_LIC_NAME,
    business_name: row.CRED_LIC_BN || "",
    abn_acn: row.CRED_LIC_ABN_ACN,
    afsl_number: row.CRED_LIC_AFSL_NUM || "",
    authorisations: row.CRED_LIC_AUTHORISATIONS || "",
    locality: row.CRED_LIC_LOCALITY,
    state: row.CRED_LIC_STATE,
    postcode: row.CRED_LIC_PCODE,
    start_date: asIsoDate(row.CRED_LIC_START_DT),
    end_date: asIsoDate(row.CRED_LIC_END_DT),
    status: row.CRED_LIC_STATUS,
    latitude: toNumber(row.CRED_LIC_LAT) ?? "",
    longitude: toNumber(row.CRED_LIC_LNG) ?? "",
    dataset_url: datasetUrl,
  };
}

function buildRepCandidate(row, licenseeByNumber, datasetUrl) {
  const linkedLicensee = licenseeByNumber.get(row.CRED_LIC_NUM);

  return {
    source: "asic_credit_representative",
    entity_type: "representative",
    credential_type: "credit_rep",
    credential_number: row.CRED_REP_NUM,
    linked_licensee_number: row.CRED_LIC_NUM,
    name: row.CRED_REP_NAME,
    business_name: linkedLicensee?.CRED_LIC_BN || "",
    abn_acn: row.CRED_REP_ABN_ACN,
    afsl_number: linkedLicensee?.CRED_LIC_AFSL_NUM || "",
    authorisations: row.CRED_REP_AUTHORISATIONS || "",
    locality: row.CRED_REP_LOCALITY,
    state: row.CRED_REP_STATE,
    postcode: row.CRED_REP_PCODE,
    start_date: asIsoDate(row.CRED_REP_START_DT),
    end_date: asIsoDate(row.CRED_REP_END_DT),
    status: linkedLicensee?.CRED_LIC_STATUS || "",
    latitude: linkedLicensee ? (toNumber(linkedLicensee.CRED_LIC_LAT) ?? "") : "",
    longitude: linkedLicensee ? (toNumber(linkedLicensee.CRED_LIC_LNG) ?? "") : "",
    dataset_url: datasetUrl,
  };
}

// ── Main ───────────────────────────────────────────────────────────────

async function run() {
  const args = parseArgs(process.argv);
  const startedAt = new Date().toISOString();

  console.log(`Cities: ${args.cities.map((c) => CITIES[c].label).join(", ")}`);
  console.log(`Radius: ${args.radiusKm} km`);
  console.log(`Output: ${args.outDir}\n`);

  // 1. Discover latest CKAN resources
  console.log("Fetching dataset metadata from data.gov.au...");
  const [licenseeDataset, repDataset] = await Promise.all([
    getDatasetResource(DATASETS.creditLicensee),
    getDatasetResource(DATASETS.creditRepresentative),
  ]);

  // 2. Download raw TSV files
  console.log("Downloading TSV files...");
  const [licenseeTsv, repTsv] = await Promise.all([
    fetchText(licenseeDataset.resource.url),
    fetchText(repDataset.resource.url),
  ]);

  // Save raw files
  const rawDir = path.join(args.outDir, "raw");
  await Promise.all([
    writeFile(path.join(rawDir, licenseeDataset.resource.name), licenseeTsv),
    writeFile(path.join(rawDir, repDataset.resource.name), repTsv),
  ]);

  // 3. Parse into rows
  const allLicensees = parseTsv(licenseeTsv);
  const allReps = parseTsv(repTsv);

  console.log(`Total licensees in dataset: ${allLicensees.length}`);
  console.log(`Total representatives in dataset: ${allReps.length}`);

  // Log all column headers (useful for debugging field names)
  if (allLicensees.length > 0) {
    console.log(`\nLicensee columns: ${Object.keys(allLicensees[0]).join(", ")}`);
  }
  if (allReps.length > 0) {
    console.log(`Representative columns: ${Object.keys(allReps[0]).join(", ")}`);
  }
  console.log("");

  // Collect the states we need
  const neededStates = new Set(args.cities.map((c) => CITIES[c].state));

  // 4. Filter active records for relevant states
  const activeLicensees = allLicensees.filter(
    (row) =>
      neededStates.has(row.CRED_LIC_STATE) &&
      row.CRED_LIC_STATUS === "APPR" &&
      isCurrent(row.CRED_LIC_END_DT)
  );

  const activeReps = allReps.filter(
    (row) =>
      neededStates.has(row.CRED_REP_STATE) &&
      isCurrent(row.CRED_REP_END_DT)
  );

  console.log(`Active licensees (${[...neededStates].join("+")}): ${activeLicensees.length}`);
  console.log(`Active representatives (${[...neededStates].join("+")}): ${activeReps.length}\n`);

  // Build licensee lookup for rep linking
  const licenseeByNumber = new Map(activeLicensees.map((row) => [row.CRED_LIC_NUM, row]));

  // Build licensee authorisations lookup (for resolving rep auth references)
  const licenseeAuthByNumber = new Map(
    activeLicensees.map((row) => [row.CRED_LIC_NUM, row.CRED_LIC_AUTHORISATIONS || ""])
  );

  // Build candidate rows with normalised fields
  const licenseeCandidates = activeLicensees.map((row) =>
    buildLicenseeCandidate(row, licenseeDataset.resource.url)
  );
  const repCandidates = activeReps.map((row) =>
    buildRepCandidate(row, licenseeByNumber, repDataset.resource.url)
  );

  // 5. Process each city
  const columns = [
    "source",
    "entity_type",
    "credential_type",
    "credential_number",
    "linked_licensee_number",
    "name",
    "business_name",
    "abn_acn",
    "afsl_number",
    "authorisations",
    "locality",
    "state",
    "postcode",
    "start_date",
    "end_date",
    "status",
    "latitude",
    "longitude",
    "distance_km",
    "city",
    "dataset_url",
  ];

  const dedupedColumns = [...columns, "dedupe_key"];
  const cityCounts = {};
  const allCityCandidates = [];

  for (const cityKey of args.cities) {
    const city = CITIES[cityKey];
    console.log(`Processing ${city.label} (${city.state}, ${args.radiusKm}km radius)...`);

    // Add distance and filter by radius
    const addDistance = (candidate) => {
      const lat = toNumber(candidate.latitude);
      const lng = toNumber(candidate.longitude);
      const distanceKm =
        lat !== null && lng !== null
          ? haversineDistanceKm(city.lat, city.lng, lat, lng)
          : null;
      return { ...candidate, distance_km: distanceKm === null ? "" : distanceKm.toFixed(2), city: cityKey };
    };

    const withinRadius = (candidate) => {
      const d = Number(candidate.distance_km);
      return Number.isFinite(d) && d <= args.radiusKm;
    };

    const cityLicensees = licenseeCandidates
      .filter((c) => c.state === city.state)
      .map(addDistance)
      .filter(withinRadius);

    const cityReps = repCandidates
      .filter((c) => c.state === city.state)
      .map(addDistance)
      .filter(withinRadius);

    const cityDeduped = dedupeRows([...cityReps, ...cityLicensees]);
    const cityKeywordFiltered = cityDeduped.filter((row) => isLikelyMortgageBrokerName(row.name));
    const cityBrokers = cityDeduped.filter((row) => isMortgageBrokerAuth(row, licenseeAuthByNumber));

    cityCounts[cityKey] = {
      licensees: cityLicensees.length,
      representatives: cityReps.length,
      deduped: cityDeduped.length,
      keyword_filtered: cityKeywordFiltered.length,
      confirmed_brokers: cityBrokers.length,
    };

    allCityCandidates.push(...cityDeduped);

    console.log(`  Licensees: ${cityLicensees.length}`);
    console.log(`  Representatives: ${cityReps.length}`);
    console.log(`  Deduped: ${cityDeduped.length}`);
    console.log(`  Keyword-filtered (mortgage/broker/lending): ${cityKeywordFiltered.length}`);
    console.log(`  Confirmed brokers (by authorisation): ${cityBrokers.length}`);

    // Write per-city files
    const cityDir = path.join(args.outDir, cityKey);
    await Promise.all([
      writeFile(path.join(cityDir, `${cityKey}_credit_licensees.csv`), toCsv(cityLicensees, columns)),
      writeFile(path.join(cityDir, `${cityKey}_credit_representatives.csv`), toCsv(cityReps, columns)),
      writeFile(path.join(cityDir, `${cityKey}_candidates_deduped.csv`), toCsv(cityDeduped, dedupedColumns)),
      writeFile(path.join(cityDir, `${cityKey}_candidates_keyword_filtered.csv`), toCsv(cityKeywordFiltered, dedupedColumns)),
      writeFile(path.join(cityDir, `${cityKey}_confirmed_brokers.csv`), toCsv(cityBrokers, dedupedColumns)),
    ]);
  }

  // 6. Combined output
  const combinedDeduped = dedupeRows(allCityCandidates);
  const combinedKeyword = combinedDeduped.filter((row) => isLikelyMortgageBrokerName(row.name));
  const combinedBrokers = combinedDeduped.filter((row) => isMortgageBrokerAuth(row, licenseeAuthByNumber));

  await Promise.all([
    writeFile(
      path.join(args.outDir, "all_candidates_deduped.csv"),
      toCsv(combinedDeduped, dedupedColumns)
    ),
    writeFile(
      path.join(args.outDir, "all_candidates_keyword_filtered.csv"),
      toCsv(combinedKeyword, dedupedColumns)
    ),
    writeFile(
      path.join(args.outDir, "all_confirmed_brokers.csv"),
      toCsv(combinedBrokers, dedupedColumns)
    ),
  ]);

  // 7. Metadata
  const metadata = {
    pulled_at: startedAt,
    radius_km: args.radiusKm,
    cities: Object.fromEntries(args.cities.map((c) => [c, { ...CITIES[c], ...cityCounts[c] }])),
    sources: {
      credit_licensee: {
        package_id: licenseeDataset.packageId,
        package_api_url: licenseeDataset.apiUrl,
        resource_id: licenseeDataset.resource.id,
        resource_name: licenseeDataset.resource.name,
        resource_url: licenseeDataset.resource.url,
        resource_last_modified: licenseeDataset.resource.last_modified,
      },
      credit_representative: {
        package_id: repDataset.packageId,
        package_api_url: repDataset.apiUrl,
        resource_id: repDataset.resource.id,
        resource_name: repDataset.resource.name,
        resource_url: repDataset.resource.url,
        resource_last_modified: repDataset.resource.last_modified,
      },
    },
    counts: {
      total_licensees_in_dataset: allLicensees.length,
      total_representatives_in_dataset: allReps.length,
      active_licensees_filtered: activeLicensees.length,
      active_representatives_filtered: activeReps.length,
      combined_deduped: combinedDeduped.length,
      combined_keyword_filtered: combinedKeyword.length,
      combined_confirmed_brokers: combinedBrokers.length,
      per_city: cityCounts,
    },
  };

  await writeFile(path.join(args.outDir, "metadata.json"), JSON.stringify(metadata, null, 2));

  // 8. Summary
  console.log("\n── Summary ──────────────────────────────────");
  console.log(`Combined deduped candidates: ${combinedDeduped.length}`);
  console.log(`Combined keyword-filtered: ${combinedKeyword.length}`);
  console.log(`Combined confirmed brokers: ${combinedBrokers.length}`);
  console.log(`Output directory: ${args.outDir}`);
  console.log("Done.");
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
