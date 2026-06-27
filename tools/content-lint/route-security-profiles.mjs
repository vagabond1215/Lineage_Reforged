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

const ROUTE_SECURITY_ID_PATTERN = /^route_security\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const TRAVEL_ROUTE_ID_PATTERN = /^route\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const TRAVEL_LANE_ID_PATTERN = /^lane\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const WORLD_HEX_EDGE_ID_PATTERN = /^world_hex_edge\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const REGION_LOCALITY_ID_PATTERN = /^region_locality\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SETTLEMENT_ID_PATTERN = /^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const WORLD_HEX_ID_PATTERN = /^world_hex\.[a-z0-9]+(?:_[a-z0-9]+)*$/;

const CORRIDOR_TARGET_TYPES = new Set(["travel_route", "travel_lane", "world_hex_edge"]);
const LOCAL_PRIMARY_TARGET_TYPES = new Set(["region_locality", "settlement", "world_hex"]);
const LOCAL_PRIMARY_ROLES = new Set(["approach_zone", "local_context"]);

const FORBIDDEN_FIELDS = [
  "routeRecords",
  "interPortShipRoutes",
  "routeSegments",
  "routeSegmentIds",
  "crossingIds",
  "crossingId",
  "portIds",
  "portId",
  "tradeRouteIds",
  "tradeRouteId",
  "roadIds",
  "roadId",
  "bridgeIds",
  "bridgeId",
  "ferryIds",
  "ferryId",
  "checkpointIds",
  "checkpointId",
  "orderedHexIds",
  "orderedEdgeIds",
  "hexPath",
  "edgePath",
  "topology",
  "adjacency",
  "distance",
  "travelEstimate",
  "travelTime",
  "eta",
  "pathfindingCost",
  "routeQuality",
  "crossingDifficulty",
  "allowedModes",
  "availableModes",
  "barriers",
  "closureState",
  "routeClosure",
  "detours",
  "activeIncident",
  "currentAvailability",
  "currentCondition",
  "currentDanger",
  "currentWeather",
  "forecast",
  "weatherSimulation",
  "patrolUnits",
  "guardRoster",
  "guardIds",
  "forceIds",
  "forceId",
  "jurisdictionIds",
  "jurisdictionId",
  "polityIds",
  "polityId",
  "lawIds",
  "lawId",
  "courtIds",
  "taxRules",
  "tariffRules",
  "tollCollection",
  "customsChecks",
  "checkpointExecution",
  "lawEnforcement",
  "accessRules",
  "permissions",
  "wantedStatus",
  "legalState",
  "reputationState",
  "guildIds",
  "guildId",
  "marketLogistics",
  "cargo",
  "supply",
  "prices",
  "stock",
  "tradeSimulation",
  "logisticsMovement",
  "encounterTemplateIds",
  "spawnProfileIds",
  "spawnRate",
  "spawnDensity",
  "hostilityWeights",
  "encounterWeights",
  "encounterTable",
  "travelTick",
  "partyLocation",
  "vehicleState",
  "fatigue",
  "hunger",
  "thirst",
  "provisions",
  "damage",
  "conditionApplication",
  "discoveryState",
  "mapRevealState",
  "routeKnown",
  "hazardKnown",
  "securityKnown",
  "journeyHistory",
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
  "routeName",
  "crossingName",
  "portName",
  "roadName",
  "bridgeName",
  "ferryName",
  "checkpointName",
  "guildName",
  "polityName",
  "forceName",
  "lawName",
  "ownerName"
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

function addToIndex(index, id, source, pattern) {
  if (typeof id !== "string" || !pattern.test(id)) {
    throw new Error(`${source} contains non-canonical id '${id}'`);
  }
  if (index.has(id)) {
    throw new Error(`${source} has duplicate id '${id}'`);
  }
  index.set(id, true);
}

function buildIdIndex(records, source, pattern) {
  if (!Array.isArray(records)) {
    throw new Error(`${source} records must be an array`);
  }
  const index = new Map();
  records.forEach((record, recordIndex) => {
    if (!isObject(record) || typeof record.id !== "string") {
      throw new Error(`${source} records[${recordIndex}] must provide a canonical id`);
    }
    if (record.status === undefined || record.status === "active") {
      addToIndex(index, record.id, source, pattern);
    }
  });
  return index;
}

function buildTravelTargetIndexes(travelNetworks) {
  if (!Array.isArray(travelNetworks)) {
    throw new Error("world.travel_networks records must be an array");
  }
  const routeIds = new Map();
  const laneIds = new Map();

  travelNetworks.forEach((record, recordIndex) => {
    if (!isObject(record)) {
      throw new Error(`world.travel_networks records[${recordIndex}] must be an object`);
    }
    for (const route of record.routeRecords ?? []) {
      addToIndex(routeIds, route.id, "world.travel_networks routeRecords", TRAVEL_ROUTE_ID_PATTERN);
    }
    for (const lane of record.interPortShipRoutes ?? []) {
      addToIndex(laneIds, lane.id, "world.travel_networks interPortShipRoutes", TRAVEL_LANE_ID_PATTERN);
    }
  });

  return { routeIds, laneIds };
}

function targetKey(target) {
  return `${target.targetType}:${target.targetId}:${target.targetRole}`;
}

function assertPrimaryRoleCompatibility(record, relativePath) {
  const { targetType, targetRole } = record.primaryTarget;
  if (CORRIDOR_TARGET_TYPES.has(targetType) && targetRole !== "primary_corridor") {
    throw new Error(`${relativePath} record ${record.id} primaryTarget ${targetType} must use primary_corridor`);
  }
  if (LOCAL_PRIMARY_TARGET_TYPES.has(targetType) && !LOCAL_PRIMARY_ROLES.has(targetRole)) {
    throw new Error(`${relativePath} record ${record.id} primaryTarget ${targetType} must use approach_zone or local_context`);
  }
}

function validateTarget(target, record, relativePath, indexes) {
  const fail = () => {
    throw new Error(`${relativePath} target ${target.targetType}:${target.targetId} is missing from approved current authority on record ${record.id}`);
  };

  if (target.targetType === "travel_route") {
    if (!TRAVEL_ROUTE_ID_PATTERN.test(target.targetId) || !indexes.travelRouteIds.has(target.targetId)) {
      fail();
    }
    return;
  }
  if (target.targetType === "travel_lane") {
    if (!TRAVEL_LANE_ID_PATTERN.test(target.targetId) || !indexes.travelLaneIds.has(target.targetId)) {
      fail();
    }
    return;
  }
  if (target.targetType === "world_hex_edge") {
    if (!WORLD_HEX_EDGE_ID_PATTERN.test(target.targetId) || !indexes.worldHexEdgesById.has(target.targetId)) {
      fail();
    }
    return;
  }
  if (target.targetType === "region_locality") {
    if (!REGION_LOCALITY_ID_PATTERN.test(target.targetId) || !indexes.regionLocalitiesById.has(target.targetId)) {
      fail();
    }
    return;
  }
  if (target.targetType === "settlement") {
    if (!SETTLEMENT_ID_PATTERN.test(target.targetId) || !indexes.settlementsById.has(target.targetId)) {
      fail();
    }
    return;
  }
  if (!WORLD_HEX_ID_PATTERN.test(target.targetId) || !indexes.worldHexesById.has(target.targetId)) {
    fail();
  }
}

function assertUniqueTargets(record, relativePath) {
  const seen = new Set();
  for (const target of [record.primaryTarget, ...(record.relatedTargets ?? [])]) {
    const key = targetKey(target);
    if (seen.has(key)) {
      throw new Error(`${relativePath} record ${record.id} repeats target ref '${key}'`);
    }
    seen.add(key);
  }
}

function assertUniqueNonRetiredPrimaryTargets(records, relativePath) {
  const seen = new Map();
  for (const record of records) {
    if (record.status === "retired") {
      continue;
    }
    const key = `${record.primaryTarget.targetType}:${record.primaryTarget.targetId}`;
    const existing = seen.get(key);
    if (existing) {
      throw new Error(`${relativePath} records ${existing} and ${record.id} share non-retired primaryTarget '${key}'`);
    }
    seen.set(key, record.id);
  }
}

export function validateRouteSecurityProfiles({
  relativePath = "packages/content/base/world/route_security_profiles.json",
  wrapper,
  schema,
  travelNetworks,
  worldHexEdges,
  worldHexes,
  regionLocalities,
  settlements
}) {
  const records = validateStructurally({
    relativePath,
    wrapper,
    schema,
    schemaName: "route security profile"
  });

  const travelIndexes = buildTravelTargetIndexes(travelNetworks);
  const indexes = {
    travelRouteIds: travelIndexes.routeIds,
    travelLaneIds: travelIndexes.laneIds,
    worldHexEdgesById: buildIdIndex(worldHexEdges, "world.world_hex_edges", WORLD_HEX_EDGE_ID_PATTERN),
    worldHexesById: buildIdIndex(worldHexes, "world.world_hexes", WORLD_HEX_ID_PATTERN),
    regionLocalitiesById: buildIdIndex(regionLocalities, "world.region_localities", REGION_LOCALITY_ID_PATTERN),
    settlementsById: buildIdIndex(settlements, "world.settlements", SETTLEMENT_ID_PATTERN)
  };

  assertUniqueField(records, "id", relativePath, "route-security id");
  assertUniqueField(records, "slug", relativePath, "route-security slug");
  assertUniqueNonRetiredPrimaryTargets(records, relativePath);

  for (const record of records) {
    assertNoForbiddenFields(record, relativePath);

    const idMatch = ROUTE_SECURITY_ID_PATTERN.exec(record.id);
    if (!idMatch || idMatch[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} id must equal route_security.${record.slug}`);
    }

    assertPrimaryRoleCompatibility(record, relativePath);
    assertUniqueTargets(record, relativePath);

    validateTarget(record.primaryTarget, record, relativePath, indexes);
    for (const target of record.relatedTargets ?? []) {
      validateTarget(target, record, relativePath, indexes);
    }
  }

  return {
    ok: true,
    routeSecurityIds: records.map((record) => record.id).sort()
  };
}
