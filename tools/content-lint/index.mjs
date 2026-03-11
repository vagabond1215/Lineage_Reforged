import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SLUG_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const ITEM_KEY_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const RESOURCE_ITEM_PREFIX_PATTERN = /^(flora|fauna|mineral)\./;
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
    file: "packages/content/base/items/items.json",
    requiredTopLevel: ["records"],
    requireSlug: false,
    forbidGeoQualifierInName: false,
    validateItemCatalog: true
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

  if (check.validateItemCatalog) {
    validateItemCatalog(relativePath, parsed.records);
  }
}

function validateItemCatalog(relativePath, records) {
  const seenIds = new Set();
  const seenKeys = new Set();

  for (const record of records) {
    if (typeof record.id !== "string" || record.id.trim().length === 0) {
      throw new Error(`${relativePath} has invalid id on item record`);
    }

    if (seenIds.has(record.id)) {
      throw new Error(`${relativePath} has duplicate item id ${record.id}`);
    }
    seenIds.add(record.id);

    if (typeof record.itemKey !== "string" || !ITEM_KEY_PATTERN.test(record.itemKey)) {
      throw new Error(`${relativePath} has invalid itemKey on record ${record.id}`);
    }

    if (RESOURCE_ITEM_PREFIX_PATTERN.test(record.itemKey)) {
      throw new Error(`${relativePath} itemKey ${record.itemKey} must not use resource prefixes`);
    }

    if (seenKeys.has(record.itemKey)) {
      throw new Error(`${relativePath} has duplicate itemKey ${record.itemKey}`);
    }
    seenKeys.add(record.itemKey);

    for (const key of ["name", "itemClass", "itemBranch", "itemSubBranch", "currencyId", "valueUnit"]) {
      if (typeof record[key] !== "string" || record[key].trim().length === 0) {
        throw new Error(`${relativePath} has invalid ${key} on record ${record.id}`);
      }
    }

    if (typeof record.baseValue !== "number" || Number.isNaN(record.baseValue) || record.baseValue < 0) {
      throw new Error(`${relativePath} has invalid baseValue on record ${record.id}`);
    }

    if (typeof record.marketable !== "boolean") {
      throw new Error(`${relativePath} has invalid marketable flag on record ${record.id}`);
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
