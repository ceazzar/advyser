#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const MELBOURNE_CBD = {
  lat: -37.8136,
  lng: 144.9631,
};

const DEFAULT_RADIUS_KM = 80;

const DATASETS = {
  creditLicensee: {
    packageId: "fa0b0d71-b8b8-4af8-bc59-0b000ce0d5e4",
  },
  creditRepresentative: {
    packageId: "a3b6d445-3a00-409a-8b49-53dc62b823bf",
  },
};

function parseArgs(argv) {
  const args = {
    outDir: path.resolve(process.cwd(), "output/data/mortgage-brokers"),
    radiusKm: DEFAULT_RADIUS_KM,
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

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  if (!Number.isFinite(args.radiusKm) || args.radiusKm <= 0) {
    throw new Error("--radius-km must be a positive number");
  }

  return args;
}

function printHelp() {
  console.log(`
Usage:
  node ./scripts/pull-melbourne-mortgage-brokers.mjs [options]

Options:
  --out-dir <path>      Output directory (default: ./output/data/mortgage-brokers)
  --radius-km <number>  Melbourne radius in km (default: 80)
  --help, -h            Show this help text
`);
}

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

  return {
    packageId,
    apiUrl,
    resource,
  };
}

function parseTsv(tsvText) {
  const lines = tsvText.split(/\r?\n/).filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const header = lines[0].replace(/^\uFEFF/, "").split("\t").map((value) => value.trim());
  const rows = [];

  for (let index = 1; index < lines.length; index += 1) {
    const values = lines[index].split("\t");

    if (values.length === 1 && values[0].trim() === "") {
      continue;
    }

    const row = {};

    for (let i = 0; i < header.length; i += 1) {
      row[header[i]] = (values[i] || "").trim();
    }

    rows.push(row);
  }

  return rows;
}

function parseDdMmYyyy(value) {
  if (!value) {
    return null;
  }

  const [dd, mm, yyyy] = value.split("/").map((part) => Number(part));

  if (!dd || !mm || !yyyy) {
    return null;
  }

  const date = new Date(Date.UTC(yyyy, mm - 1, dd));
  return Number.isNaN(date.getTime()) ? null : date;
}

function isCurrent(endDateRaw) {
  const endDate = parseDdMmYyyy(endDateRaw);

  if (!endDate) {
    return true;
  }

  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return endDate.getTime() >= todayUtc;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function normalizeName(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
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
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")).join("\n");
  return `${header}\n${body}\n`;
}

function dedupeMelbourne(rows) {
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
      byKey.set(key, {
        ...row,
        dedupe_key: key,
      });
    }
  }

  return [...byKey.values()];
}

function isLikelyMortgageBrokerName(name) {
  const upper = String(name || "").toUpperCase();
  return /MORTGAGE|HOME LOAN|BROKER|BROKING|LENDING/.test(upper);
}

function asIsoDate(value) {
  const date = parseDdMmYyyy(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

async function writeFile(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

async function run() {
  const args = parseArgs(process.argv);
  const startedAt = new Date().toISOString();

  const [licenseeDataset, repDataset] = await Promise.all([
    getDatasetResource(DATASETS.creditLicensee),
    getDatasetResource(DATASETS.creditRepresentative),
  ]);

  const rawDir = path.join(args.outDir, "raw");

  const [licenseeTsv, repTsv] = await Promise.all([
    fetchText(licenseeDataset.resource.url),
    fetchText(repDataset.resource.url),
  ]);

  const licenseeRawPath = path.join(rawDir, licenseeDataset.resource.name);
  const repRawPath = path.join(rawDir, repDataset.resource.name);

  await Promise.all([
    writeFile(licenseeRawPath, licenseeTsv),
    writeFile(repRawPath, repTsv),
  ]);

  const licenseeRows = parseTsv(licenseeTsv);
  const repRows = parseTsv(repTsv);

  const activeLicenseesVic = licenseeRows.filter(
    (row) => row.CRED_LIC_STATE === "VIC" && row.CRED_LIC_STATUS === "APPR" && isCurrent(row.CRED_LIC_END_DT)
  );

  const activeRepsVic = repRows.filter(
    (row) => row.CRED_REP_STATE === "VIC" && isCurrent(row.CRED_REP_END_DT)
  );

  const licenseeByNumber = new Map(activeLicenseesVic.map((row) => [row.CRED_LIC_NUM, row]));

  const licenseeCandidates = activeLicenseesVic.map((row) => {
    const lat = toNumber(row.CRED_LIC_LAT);
    const lng = toNumber(row.CRED_LIC_LNG);
    const distanceKm = lat !== null && lng !== null
      ? haversineDistanceKm(MELBOURNE_CBD.lat, MELBOURNE_CBD.lng, lat, lng)
      : null;

    return {
      source: "asic_credit_licensee",
      entity_type: "licensee",
      credential_type: "acl",
      credential_number: row.CRED_LIC_NUM,
      linked_licensee_number: row.CRED_LIC_NUM,
      name: row.CRED_LIC_NAME,
      abn_acn: row.CRED_LIC_ABN_ACN,
      locality: row.CRED_LIC_LOCALITY,
      state: row.CRED_LIC_STATE,
      postcode: row.CRED_LIC_PCODE,
      start_date: asIsoDate(row.CRED_LIC_START_DT),
      end_date: asIsoDate(row.CRED_LIC_END_DT),
      status: row.CRED_LIC_STATUS,
      latitude: lat ?? "",
      longitude: lng ?? "",
      distance_km: distanceKm === null ? "" : distanceKm.toFixed(2),
      dataset_url: licenseeDataset.resource.url,
    };
  });

  const repCandidates = activeRepsVic.map((row) => {
    const linkedLicensee = licenseeByNumber.get(row.CRED_LIC_NUM);
    const lat = linkedLicensee ? toNumber(linkedLicensee.CRED_LIC_LAT) : null;
    const lng = linkedLicensee ? toNumber(linkedLicensee.CRED_LIC_LNG) : null;
    const distanceKm = lat !== null && lng !== null
      ? haversineDistanceKm(MELBOURNE_CBD.lat, MELBOURNE_CBD.lng, lat, lng)
      : null;

    return {
      source: "asic_credit_representative",
      entity_type: "representative",
      credential_type: "credit_rep",
      credential_number: row.CRED_REP_NUM,
      linked_licensee_number: row.CRED_LIC_NUM,
      name: row.CRED_REP_NAME,
      abn_acn: row.CRED_REP_ABN_ACN,
      locality: row.CRED_REP_LOCALITY,
      state: row.CRED_REP_STATE,
      postcode: row.CRED_REP_PCODE,
      start_date: asIsoDate(row.CRED_REP_START_DT),
      end_date: asIsoDate(row.CRED_REP_END_DT),
      status: linkedLicensee?.CRED_LIC_STATUS || "",
      latitude: lat ?? "",
      longitude: lng ?? "",
      distance_km: distanceKm === null ? "" : distanceKm.toFixed(2),
      dataset_url: repDataset.resource.url,
    };
  });

  const melbourneLicensees = licenseeCandidates.filter((row) => {
    const distance = Number(row.distance_km);
    return Number.isFinite(distance) && distance <= args.radiusKm;
  });

  const melbourneReps = repCandidates.filter((row) => {
    const distance = Number(row.distance_km);
    return Number.isFinite(distance) && distance <= args.radiusKm;
  });

  const melbourneCombinedDeduped = dedupeMelbourne([...melbourneReps, ...melbourneLicensees]);
  const melbourneLikelyMortgage = melbourneCombinedDeduped.filter((row) =>
    isLikelyMortgageBrokerName(row.name)
  );

  const columns = [
    "source",
    "entity_type",
    "credential_type",
    "credential_number",
    "linked_licensee_number",
    "name",
    "abn_acn",
    "locality",
    "state",
    "postcode",
    "start_date",
    "end_date",
    "status",
    "latitude",
    "longitude",
    "distance_km",
    "dataset_url",
  ];

  const dedupedColumns = [...columns, "dedupe_key"];

  await Promise.all([
    writeFile(
      path.join(args.outDir, "credit_licensees_vic_active.csv"),
      toCsv(licenseeCandidates, columns)
    ),
    writeFile(
      path.join(args.outDir, "credit_representatives_vic_active.csv"),
      toCsv(repCandidates, columns)
    ),
    writeFile(
      path.join(args.outDir, "melbourne_credit_licensees.csv"),
      toCsv(melbourneLicensees, columns)
    ),
    writeFile(
      path.join(args.outDir, "melbourne_credit_representatives.csv"),
      toCsv(melbourneReps, columns)
    ),
    writeFile(
      path.join(args.outDir, "melbourne_mortgage_broker_candidates_deduped.csv"),
      toCsv(melbourneCombinedDeduped, dedupedColumns)
    ),
    writeFile(
      path.join(args.outDir, "melbourne_mortgage_broker_candidates_keyword_filtered.csv"),
      toCsv(melbourneLikelyMortgage, dedupedColumns)
    ),
    writeFile(
      path.join(args.outDir, "metadata.json"),
      JSON.stringify(
        {
          pulled_at: startedAt,
          radius_km: args.radiusKm,
          melbourne_center: MELBOURNE_CBD,
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
            licensees_vic_active: licenseeCandidates.length,
            representatives_vic_active: repCandidates.length,
            melbourne_licensees: melbourneLicensees.length,
            melbourne_representatives: melbourneReps.length,
            melbourne_deduped: melbourneCombinedDeduped.length,
            melbourne_keyword_filtered: melbourneLikelyMortgage.length,
          },
        },
        null,
        2
      )
    ),
  ]);

  console.log(`Wrote files to: ${args.outDir}`);
  console.log(`VIC active licensees: ${licenseeCandidates.length}`);
  console.log(`VIC active representatives: ${repCandidates.length}`);
  console.log(`Melbourne licensees (${args.radiusKm}km): ${melbourneLicensees.length}`);
  console.log(`Melbourne representatives (${args.radiusKm}km): ${melbourneReps.length}`);
  console.log(`Melbourne deduped candidates: ${melbourneCombinedDeduped.length}`);
  console.log(`Melbourne keyword-filtered candidates: ${melbourneLikelyMortgage.length}`);
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
