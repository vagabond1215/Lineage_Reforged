const SUPPORTED_SCHEMA_KEYWORDS = new Set([
  "$schema",
  "$defs",
  "$ref",
  "title",
  "description",
  "type",
  "required",
  "additionalProperties",
  "properties",
  "pattern",
  "enum",
  "minLength",
  "uniqueItems",
  "items"
]);

const SUPPORTED_SCHEMA_TYPES = new Set(["array", "object", "string"]);

const SETTLEMENT_DISTRICT_ID_PATTERN = /^settlement_district\.([a-z0-9]+(?:_[a-z0-9]+)*)\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const SETTLEMENT_ID_PATTERN = /^settlement\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;

const FORBIDDEN_FIELDS = [
  "coordinates",
  "coordinate",
  "x",
  "y",
  "latitude",
  "longitude",
  "lat",
  "long",
  "polygon",
  "polygons",
  "points",
  "point",
  "bounds",
  "boundingBox",
  "boundingBoxes",
  "bbox",
  "mapAssetRef",
  "mapAssetRefs",
  "mapAssetId",
  "uiMarkerState",
  "markerState",
  "routeIds",
  "routeId",
  "pathfindingCosts",
  "pathfindingCost",
  "travelEstimates",
  "travelEstimate",
  "buildingInventories",
  "buildingInventory",
  "workplaceInventories",
  "workplaceInventory",
  "serviceInventories",
  "serviceInventory",
  "vendorStock",
  "stock",
  "prices",
  "price",
  "inventory",
  "storageState",
  "npcIds",
  "npcId",
  "ownershipRecords",
  "ownership",
  "populationCounts",
  "population",
  "workforceCounts",
  "workforce",
  "lawRules",
  "lawIds",
  "taxRules",
  "taxRates",
  "controlRules",
  "polityIds",
  "claimIds",
  "borderIds",
  "jurisdictionIds",
  "questIds",
  "eventRefs",
  "commandRefs",
  "rewardRefs",
  "knowledgeUnlockState",
  "knowledgeDiscoveryState",
  "knowledgeProgressState",
  "discoveryState",
  "progressState",
  "sacredSiteOwnership",
  "sacredSiteId",
  "religiousHotspotOwnership",
  "religiousHotspotId",
  "runtimeState",
  "saveState",
  "gameplayEffects",
  "uiState",
  "serviceExecution",
  "economyExecution"
];

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stableValueKey(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableValueKey).join(",")}]`;
  }
  if (isObject(value)) {
    return `{${Object.keys(value).sort().map((key) => `${key}:${stableValueKey(value[key])}`).join(",")}}`;
  }
  return `${typeof value}:${JSON.stringify(value)}`;
}

function schemaFailure(schemaName, path, message) {
  throw new Error(`${schemaName} schema ${path} ${message}`);
}

function resolveLocalRef(rootSchema, reference, schemaName, path) {
  if (typeof reference !== "string" || !reference.startsWith("#/")) {
    schemaFailure(schemaName, path, `uses unsupported reference '${reference}'`);
  }
  let value = rootSchema;
  for (const segment of reference.slice(2).split("/")) {
    const decoded = segment.replaceAll("~1", "/").replaceAll("~0", "~");
    if (!isObject(value) || !Object.hasOwn(value, decoded)) {
      schemaFailure(schemaName, path, `references missing location '${reference}'`);
    }
    value = value[decoded];
  }
  return value;
}

function assertSupportedSchema(schema, rootSchema, schemaName, path = "$", seen = new Set()) {
  if (!isObject(schema)) {
    schemaFailure(schemaName, path, "must be an object");
  }
  if (seen.has(schema)) {
    return;
  }
  seen.add(schema);

  for (const keyword of Object.keys(schema)) {
    if (!SUPPORTED_SCHEMA_KEYWORDS.has(keyword)) {
      schemaFailure(schemaName, path, `uses unsupported keyword '${keyword}'`);
    }
  }
  if (schema.$ref !== undefined) {
    assertSupportedSchema(
      resolveLocalRef(rootSchema, schema.$ref, schemaName, `${path}.$ref`),
      rootSchema,
      schemaName,
      `${path}.$ref(${schema.$ref})`,
      seen
    );
  }
  if (schema.type !== undefined && !SUPPORTED_SCHEMA_TYPES.has(schema.type)) {
    schemaFailure(schemaName, `${path}.type`, `declares unsupported type '${schema.type}'`);
  }
  if (schema.additionalProperties !== undefined && schema.additionalProperties !== false) {
    schemaFailure(schemaName, `${path}.additionalProperties`, "must be false for this adapter");
  }
  if (schema.required !== undefined && (!Array.isArray(schema.required) || schema.required.some((entry) => typeof entry !== "string"))) {
    schemaFailure(schemaName, `${path}.required`, "must be an array of strings");
  }
  for (const [key, value] of Object.entries(schema.properties ?? {})) {
    assertSupportedSchema(value, rootSchema, schemaName, `${path}.properties.${key}`, seen);
  }
  for (const [key, value] of Object.entries(schema.$defs ?? {})) {
    assertSupportedSchema(value, rootSchema, schemaName, `${path}.$defs.${key}`, seen);
  }
  if (schema.items !== undefined) {
    assertSupportedSchema(schema.items, rootSchema, schemaName, `${path}.items`, seen);
  }
  if (schema.enum !== undefined && !Array.isArray(schema.enum)) {
    schemaFailure(schemaName, `${path}.enum`, "must be an array");
  }
  if (schema.minLength !== undefined && (!Number.isInteger(schema.minLength) || schema.minLength < 0)) {
    schemaFailure(schemaName, `${path}.minLength`, "must be a non-negative integer");
  }
  if (schema.uniqueItems !== undefined && schema.uniqueItems !== true) {
    schemaFailure(schemaName, `${path}.uniqueItems`, "must be true for this adapter");
  }
}

function matchesType(value, type) {
  if (type === "array") {
    return Array.isArray(value);
  }
  if (type === "object") {
    return isObject(value);
  }
  return typeof value === type;
}

function validateValue(value, schema, rootSchema, schemaName, valuePath, schemaPath = "$") {
  if (schema.$ref !== undefined) {
    validateValue(
      value,
      resolveLocalRef(rootSchema, schema.$ref, schemaName, `${schemaPath}.$ref`),
      rootSchema,
      schemaName,
      valuePath,
      `${schemaPath}.$ref(${schema.$ref})`
    );
    return;
  }
  if (schema.type !== undefined && !matchesType(value, schema.type)) {
    throw new Error(`${valuePath} must be type ${schema.type}`);
  }
  if (schema.enum !== undefined && !schema.enum.some((candidate) => stableValueKey(candidate) === stableValueKey(value))) {
    throw new Error(`${valuePath} must be one of the schema enum values`);
  }
  if (schema.pattern !== undefined && (typeof value !== "string" || !new RegExp(schema.pattern).test(value))) {
    throw new Error(`${valuePath} must match pattern ${schema.pattern}`);
  }
  if (schema.minLength !== undefined && (typeof value !== "string" || value.length < schema.minLength)) {
    throw new Error(`${valuePath} must have length at least ${schema.minLength}`);
  }
  if (schema.type === "object") {
    const properties = schema.properties ?? {};
    for (const propertyName of schema.required ?? []) {
      if (!Object.hasOwn(value, propertyName)) {
        throw new Error(`${valuePath} is missing required property '${propertyName}'`);
      }
    }
    if (schema.additionalProperties === false) {
      for (const propertyName of Object.keys(value)) {
        if (!Object.hasOwn(properties, propertyName)) {
          throw new Error(`${valuePath} has unsupported property '${propertyName}'`);
        }
      }
    }
    for (const [propertyName, propertySchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, propertyName)) {
        validateValue(value[propertyName], propertySchema, rootSchema, schemaName, `${valuePath}.${propertyName}`, `${schemaPath}.properties.${propertyName}`);
      }
    }
  }
  if (schema.type === "array") {
    if (schema.uniqueItems === true) {
      const seen = new Set();
      for (const entry of value) {
        const key = stableValueKey(entry);
        if (seen.has(key)) {
          throw new Error(`${valuePath} must contain unique items`);
        }
        seen.add(key);
      }
    }
    value.forEach((entry, index) => {
      if (schema.items !== undefined) {
        validateValue(entry, schema.items, rootSchema, schemaName, `${valuePath}[${index}]`, `${schemaPath}.items`);
      }
    });
  }
}

function requireRecordsWrapper(wrapper, relativePath) {
  if (!isObject(wrapper)) {
    throw new Error(`${relativePath} wrapper must be an object`);
  }
  const keys = Object.keys(wrapper);
  if (keys.length !== 1 || keys[0] !== "records") {
    throw new Error(`${relativePath} wrapper must contain exactly one top-level key: records`);
  }
  if (!Array.isArray(wrapper.records)) {
    throw new Error(`${relativePath} records must be an array`);
  }
  return wrapper.records;
}

function validateStructurally({ relativePath, wrapper, schema, schemaName }) {
  if (schema === undefined) {
    throw new Error(`${relativePath} requires a ${schemaName} schema`);
  }
  assertSupportedSchema(schema, schema, schemaName);
  const records = requireRecordsWrapper(wrapper, relativePath);
  try {
    validateValue(wrapper, schema, schema, schemaName, "wrapper");
  } catch (error) {
    throw new Error(`${relativePath} structural validation failed: ${error.message}`);
  }
  return records;
}

function buildCurrentSettlementIndex(settlements) {
  if (!Array.isArray(settlements)) {
    throw new Error("world.settlements records must be an array");
  }
  const index = new Map();
  settlements.forEach((record, recordIndex) => {
    if (!isObject(record) || typeof record.id !== "string" || !SETTLEMENT_ID_PATTERN.test(record.id)) {
      throw new Error(`world.settlements records[${recordIndex}] must provide a canonical id`);
    }
    if (index.has(record.id)) {
      throw new Error(`world.settlements has duplicate id '${record.id}'`);
    }
    if (record.status === undefined || record.status === "active") {
      index.set(record.id, record);
    }
  });
  return index;
}

function assertNoForbiddenFields(record, relativePath) {
  for (const field of FORBIDDEN_FIELDS) {
    if (Object.hasOwn(record, field)) {
      throw new Error(`${relativePath} record ${record.id ?? "<unknown>"} must not define ${field}`);
    }
  }
}

function assertUniqueIds(records, relativePath) {
  const ids = new Set();
  for (const record of records) {
    if (ids.has(record.id)) {
      throw new Error(`${relativePath} has duplicate settlement-district id '${record.id}'`);
    }
    ids.add(record.id);
  }
}

function assertUniqueSlugsByParent(records, relativePath) {
  const slugsByParent = new Map();
  for (const record of records) {
    const slugs = slugsByParent.get(record.parentSettlementId) ?? new Set();
    if (slugs.has(record.slug)) {
      throw new Error(`${relativePath} has duplicate settlement-district slug '${record.slug}' under parent '${record.parentSettlementId}'`);
    }
    slugs.add(record.slug);
    slugsByParent.set(record.parentSettlementId, slugs);
  }
}

export function validateSettlementDistricts({
  relativePath = "packages/content/base/world/settlement_districts.json",
  wrapper,
  schema,
  settlements
}) {
  const records = validateStructurally({
    relativePath,
    wrapper,
    schema,
    schemaName: "settlement district"
  });

  const settlementsById = buildCurrentSettlementIndex(settlements);

  assertUniqueIds(records, relativePath);
  assertUniqueSlugsByParent(records, relativePath);

  for (const record of records) {
    assertNoForbiddenFields(record, relativePath);

    const idMatch = SETTLEMENT_DISTRICT_ID_PATTERN.exec(record.id);
    if (!idMatch) {
      throw new Error(`${relativePath} record ${record.id} id must match settlement_district.<settlement_slug>.<district_slug>`);
    }
    const [, settlementSlug, districtSlug] = idMatch;
    if (districtSlug !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} slug must match final id segment '${districtSlug}'`);
    }

    const settlementMatch = SETTLEMENT_ID_PATTERN.exec(record.parentSettlementId);
    if (!settlementMatch) {
      throw new Error(`${relativePath} record ${record.id} parentSettlementId must match settlement.<settlement_slug>`);
    }
    if (settlementMatch[1] !== settlementSlug) {
      throw new Error(`${relativePath} record ${record.id} parent settlement slug must match parentSettlementId '${record.parentSettlementId}'`);
    }
    if (!settlementsById.has(record.parentSettlementId)) {
      throw new Error(`${relativePath} parentSettlementId '${record.parentSettlementId}' is missing or inactive in world.settlements on record ${record.id}`);
    }
  }

  return {
    ok: true,
    settlementDistrictIds: records.map((record) => record.id).sort()
  };
}
