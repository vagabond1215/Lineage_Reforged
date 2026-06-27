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

const HAZARD_PROFILE_ID_PATTERN = /^hazard_profile\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;

const PLACE_SPECIFIC_SLUG_PATTERN =
  /(?:^|_)(?:region|region_locality|settlement|world_hex|hex|edge|route|lane|crossing|port|trade_route|map_feature|spawn|encounter|ecology|biome|climate|habitat|kaelvar|thalos|aurelis|vinecross|brineharbor|blueflow|stormfang|heart_basin|thorn_peninsula|first_world)(?:_|$)/;

const FORBIDDEN_FIELDS = [
  "targetRefs",
  "targets",
  "placeRefs",
  "placeId",
  "regionId",
  "regionLocalityId",
  "settlementId",
  "worldHexId",
  "worldHexEdgeId",
  "hexId",
  "edgeId",
  "routeId",
  "routeIds",
  "laneId",
  "laneIds",
  "travelRouteId",
  "travelLaneId",
  "crossingId",
  "portId",
  "tradeRouteId",
  "mapFeatureId",
  "spawnProfileId",
  "encounterTemplateId",
  "ecologyProfileId",
  "biomeId",
  "climateProfileId",
  "habitatId",
  "currentConditionId",
  "hazardOverlayId",
  "targetOverlayId",
  "damageFormula",
  "damage",
  "diseaseMechanics",
  "diseaseRoll",
  "weatherSimulation",
  "currentWeather",
  "forecast",
  "currentSeverity",
  "currentDanger",
  "activeIncident",
  "conditionApplication",
  "fatigue",
  "hunger",
  "thirst",
  "supplyBurn",
  "supplyConsumption",
  "resourceYield",
  "loot",
  "spawnRate",
  "spawnDensity",
  "hostility",
  "hostilityWeights",
  "movementModeFilter",
  "encounterWeights",
  "encounterTable",
  "pathfindingCost",
  "travelSpeed",
  "travelTime",
  "eta",
  "routeClosure",
  "closureState",
  "discoveryState",
  "mapRevealState",
  "hazardKnown",
  "routeKnown",
  "securityKnown",
  "playerJourneyState",
  "runtimeState",
  "saveState",
  "storageState",
  "uiState",
  "commandRefs",
  "eventRefs",
  "rewardRefs",
  "serviceIds",
  "access",
  "gameplayEffects",
  "patrolPresence",
  "maintenancePosture",
  "checkpointPosture",
  "tollPosture",
  "escortAvailability",
  "banditPressure",
  "piracyPressure",
  "conflictDisruption",
  "publicReliability"
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

function assertReusableSlug(record, relativePath) {
  if (PLACE_SPECIFIC_SLUG_PATTERN.test(record.slug)) {
    throw new Error(`${relativePath} record ${record.id} slug must describe reusable hazard vocabulary, not place-specific or target-specific authority`);
  }
}

export function validateHazardProfiles({
  relativePath = "packages/content/base/world/hazard_profiles.json",
  wrapper,
  schema
}) {
  const records = validateStructurally({
    relativePath,
    wrapper,
    schema,
    schemaName: "hazard profile"
  });

  assertUniqueField(records, "id", relativePath, "hazard-profile id");
  assertUniqueField(records, "slug", relativePath, "hazard-profile slug");

  for (const record of records) {
    assertNoForbiddenFields(record, relativePath);

    const idMatch = HAZARD_PROFILE_ID_PATTERN.exec(record.id);
    if (!idMatch || idMatch[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} id must equal hazard_profile.${record.slug}`);
    }

    assertReusableSlug(record, relativePath);
  }

  return {
    ok: true,
    hazardProfileIds: records.map((record) => record.id).sort()
  };
}
