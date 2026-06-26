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
  "minItems",
  "minimum",
  "uniqueItems",
  "items"
]);

const SUPPORTED_SCHEMA_TYPES = new Set(["array", "integer", "object", "string"]);

const POLITY_ID_PATTERN = /^polity\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const REGION_ID_PATTERN = /^region\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const REGION_LOCALITY_ID_PATTERN = /^region_locality\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SETTLEMENT_ID_PATTERN = /^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/;

const FORBIDDEN_FIELDS = [
  "allies",
  "borderIds",
  "bountyState",
  "capitalGovernmentId",
  "caseState",
  "citizenshipRules",
  "claimIds",
  "claimedRegionIds",
  "claimedSettlementIds",
  "commandRefs",
  "conflictIds",
  "controlPercentages",
  "controlledRegionIds",
  "controlledSettlementIds",
  "customsRules",
  "cultureIds",
  "diplomacy",
  "disputedPlaceIds",
  "enemies",
  "enforcementRules",
  "eventRefs",
  "factionIds",
  "familyIds",
  "gameplayEffects",
  "garrisonIds",
  "generatedPoliticalSimulation",
  "governmentId",
  "governmentIds",
  "guardForces",
  "institutionIds",
  "jurisdictionIds",
  "languageIds",
  "lawCodeIds",
  "lawIds",
  "legalStatus",
  "localLawIds",
  "militaryForces",
  "militaryStrength",
  "mutationInstructions",
  "nobleHouseIds",
  "occupiedPlaceIds",
  "officeIds",
  "officialReligionId",
  "overlordId",
  "parentPolityId",
  "playerLegalState",
  "playerStanding",
  "recognitionMatrix",
  "rewardRefs",
  "rulerId",
  "rulerPersonId",
  "runtimeState",
  "saveState",
  "storageState",
  "subjectPolityIds",
  "subjectPopulations",
  "succession",
  "tariffRates",
  "taxRates",
  "territoryIds",
  "titleIds",
  "tollRates",
  "treasury",
  "uiState",
  "vassalOf",
  "wantedState",
  "warIds"
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
  for (const keyword of ["minLength", "minItems", "minimum"]) {
    if (schema[keyword] !== undefined && (!Number.isInteger(schema[keyword]) || schema[keyword] < 0)) {
      schemaFailure(schemaName, `${path}.${keyword}`, "must be a non-negative integer");
    }
  }
  if (schema.uniqueItems !== undefined && schema.uniqueItems !== true) {
    schemaFailure(schemaName, `${path}.uniqueItems`, "must be true for this adapter");
  }
}

function matchesType(value, type) {
  if (type === "array") {
    return Array.isArray(value);
  }
  if (type === "integer") {
    return Number.isInteger(value);
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
  if (schema.minimum !== undefined && (typeof value !== "number" || value < schema.minimum)) {
    throw new Error(`${valuePath} must be at least ${schema.minimum}`);
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
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      throw new Error(`${valuePath} must contain at least ${schema.minItems} items`);
    }
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
  if (wrapper.records.length === 0) {
    throw new Error(`${relativePath} records must be non-empty`);
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

function assertUniqueField(records, field, relativePath, label) {
  const seen = new Set();
  for (const record of records) {
    const value = record[field];
    if (seen.has(value)) {
      throw new Error(`${relativePath} has duplicate ${label} '${value}'`);
    }
    seen.add(value);
  }
}

function assertNoForbiddenFields(record, relativePath) {
  for (const field of FORBIDDEN_FIELDS) {
    if (Object.hasOwn(record, field)) {
      throw new Error(`${relativePath} record ${record.id ?? "<unknown>"} must not define ${field}`);
    }
  }
}

function buildCurrentPlaceIndex(records, source, pattern) {
  if (!Array.isArray(records)) {
    throw new Error(`${source} records must be an array`);
  }
  const index = new Map();
  records.forEach((record, recordIndex) => {
    if (!isObject(record) || typeof record.id !== "string" || !pattern.test(record.id)) {
      throw new Error(`${source} records[${recordIndex}] must provide a canonical id`);
    }
    if (index.has(record.id)) {
      throw new Error(`${source} has duplicate id '${record.id}'`);
    }
    if (record.status === undefined || record.status === "active") {
      index.set(record.id, record);
    }
  });
  return index;
}

function assertUniquePlaceAnchors(record, relativePath) {
  const seen = new Set();
  for (const anchor of record.placeAnchors) {
    const key = `${anchor.placeType}:${anchor.placeId}:${anchor.anchorRole}`;
    if (seen.has(key)) {
      throw new Error(`${relativePath} record ${record.id} has duplicate placeAnchor '${key}'`);
    }
    seen.add(key);
  }
}

function validatePlaceAnchor(anchor, record, relativePath, indexes) {
  if (anchor.placeType === "region") {
    if (!REGION_ID_PATTERN.test(anchor.placeId) || !indexes.regionsById.has(anchor.placeId)) {
      throw new Error(`${relativePath} placeAnchor region '${anchor.placeId}' is missing or inactive in world.regions on record ${record.id}`);
    }
    return;
  }
  if (anchor.placeType === "region_locality") {
    if (!REGION_LOCALITY_ID_PATTERN.test(anchor.placeId) || !indexes.regionLocalitiesById.has(anchor.placeId)) {
      throw new Error(`${relativePath} placeAnchor region_locality '${anchor.placeId}' is missing or inactive in world.region_localities on record ${record.id}`);
    }
    return;
  }
  if (!SETTLEMENT_ID_PATTERN.test(anchor.placeId) || !indexes.settlementsById.has(anchor.placeId)) {
    throw new Error(`${relativePath} placeAnchor settlement '${anchor.placeId}' is missing or inactive in world.settlements on record ${record.id}`);
  }
}

export function validatePolities({
  relativePath = "packages/content/base/world/polities.json",
  wrapper,
  schema,
  regions,
  regionLocalities,
  settlements
}) {
  const records = validateStructurally({
    relativePath,
    wrapper,
    schema,
    schemaName: "polity"
  });
  if (!Array.isArray(regions)) {
    throw new Error(`${relativePath} requires supplied world.regions records`);
  }
  if (!Array.isArray(regionLocalities)) {
    throw new Error(`${relativePath} requires supplied world.region_localities records`);
  }
  if (!Array.isArray(settlements)) {
    throw new Error(`${relativePath} requires supplied world.settlements records`);
  }

  assertUniqueField(records, "id", relativePath, "polity id");
  assertUniqueField(records, "slug", relativePath, "polity slug");

  const indexes = {
    regionsById: buildCurrentPlaceIndex(regions, "world.regions", REGION_ID_PATTERN),
    regionLocalitiesById: buildCurrentPlaceIndex(regionLocalities, "world.region_localities", REGION_LOCALITY_ID_PATTERN),
    settlementsById: buildCurrentPlaceIndex(settlements, "world.settlements", SETTLEMENT_ID_PATTERN)
  };

  for (const record of records) {
    assertNoForbiddenFields(record, relativePath);
    const match = POLITY_ID_PATTERN.exec(record.id);
    if (!match || match[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} id must equal polity.${record.slug}`);
    }
    assertUniquePlaceAnchors(record, relativePath);

    let hasSettlementAnchor = false;
    for (const anchor of record.placeAnchors) {
      if (anchor.placeType === "settlement") {
        hasSettlementAnchor = true;
      }
      validatePlaceAnchor(anchor, record, relativePath, indexes);
    }
    if (record.polityForm === "autonomous_settlement" && !hasSettlementAnchor) {
      throw new Error(`${relativePath} autonomous_settlement record ${record.id} must include at least one settlement placeAnchor`);
    }
  }

  return {
    ok: true,
    polityIds: records.map((record) => record.id).sort()
  };
}
