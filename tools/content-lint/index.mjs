import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SLUG_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const GEO_QUALIFIER_PATTERN = /\b(american|european|asian|african|oregon|texas|california|alaskan)\b/i;

const checks = [
  {
    file: "packages/content/base/world/biomes.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true
  },
  {
    file: "packages/content/base/world/habitats.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true
  },
  {
    file: "packages/content/base/world/flora.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true
  },
  {
    file: "packages/content/base/world/fauna.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true
  },
  {
    file: "packages/content/base/world/minerals.json",
    requiredTopLevel: ["records"],
    requireSlug: true,
    forbidGeoQualifierInName: true
  },
  {
    file: "packages/content/base/civilization/workplaces.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false
  },
  {
    file: "packages/content/base/player/equipment_slots.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false
  },
  {
    file: "packages/content/base/world/climate_profiles.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false
  }
];

function validateRecords(relativePath, parsed, check) {
  if (!Array.isArray(parsed.records)) {
    throw new Error(`${relativePath} has non-array records`);
  }

  const seenSlugs = new Set();

  for (const record of parsed.records) {
    if (check.requireSlug) {
      if (typeof record.slug !== "string" || !SLUG_PATTERN.test(record.slug)) {
        throw new Error(`${relativePath} has invalid slug on record ${record.id ?? "<unknown>"}`);
      }

      if (seenSlugs.has(record.slug)) {
        throw new Error(`${relativePath} has duplicate slug ${record.slug}`);
      }

      seenSlugs.add(record.slug);
    }

    if (check.forbidGeoQualifierInName && typeof record.name === "string" && GEO_QUALIFIER_PATTERN.test(record.name)) {
      throw new Error(`${relativePath} has geo-qualified name '${record.name}' on record ${record.id ?? "<unknown>"}`);
    }
  }
}

async function validateFile(check) {
  const fullPath = path.join(ROOT, check.file);
  const raw = await readFile(fullPath, "utf8");
  const parsed = JSON.parse(raw);

  for (const key of check.requiredTopLevel) {
    if (!(key in parsed)) {
      throw new Error(`${check.file} is missing top-level key: ${key}`);
    }
  }

  validateRecords(check.file, parsed, check);
  return true;
}

async function main() {
  for (const check of checks) {
    await validateFile(check);
  }

  console.log(`content-lint: ok (${checks.length} files checked)`);
}

main().catch((error) => {
  console.error("content-lint: failed", error.message);
  process.exitCode = 1;
});