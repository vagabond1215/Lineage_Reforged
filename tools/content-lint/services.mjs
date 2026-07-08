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
  "uniqueItems",
  "items"
]);

const SUPPORTED_SCHEMA_TYPES = new Set(["array", "object", "string"]);
const SERVICE_ID_PATTERN = /^service\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const LOWER_SNAKE_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

const FORBIDDEN_FIELD_KEYS = [
  "aliases",
  "providerRefs",
  "providerIds",
  "buildingIds",
  "siteIds",
  "npcIds",
  "personIds",
  "guildIds",
  "settlementIds",
  "currentProviders",
  "availableProviders",
  "openingHours",
  "schedule",
  "schedules",
  "queue",
  "queues",
  "staffing",
  "providerAvailability",
  "appointments",
  "appointmentState",
  "shifts",
  "capacityState",
  "accessChecks",
  "accessCheck",
  "playerEligibility",
  "membershipState",
  "permits",
  "reputationThresholds",
  "factionStanding",
  "legalStatus",
  "warrants",
  "bounties",
  "favorability",
  "courtOutcomes",
  "prices",
  "price",
  "fees",
  "fee",
  "discounts",
  "taxes",
  "tolls",
  "fines",
  "tariffs",
  "payment",
  "payments",
  "walletMutation",
  "credit",
  "debt",
  "ledgerChanges",
  "stock",
  "shopInventory",
  "vendorInventory",
  "vendorStock",
  "restockTiming",
  "itemInstances",
  "itemMovement",
  "ownership",
  "theft",
  "storageContents",
  "containerContents",
  "cargoContents",
  "cargoMovement",
  "trainingEffects",
  "healingEffects",
  "repairEffects",
  "spellEffects",
  "craftingEffects",
  "lodgingEffects",
  "restEffects",
  "bankingBehavior",
  "travelExecution",
  "courtExecution",
  "worshipEffects",
  "studyEffects",
  "trialEffects",
  "knowledgeEffects",
  "routeTraversal",
  "ferryExecution",
  "pathfinding",
  "transportState",
  "journeyState",
  "travelTime",
  "destinationEligibility",
  "uiMenus",
  "uiMenu",
  "markerVisibility",
  "commandHandlers",
  "commandRefs",
  "events",
  "eventRefs",
  "rewards",
  "rewardRefs",
  "chronicleOutput",
  "runtimeState",
  "saveState",
  "accountState",
  "historyMutation",
  "gameplayExecution",
  "gameplayEffects"
];

const FORBIDDEN_NORMALIZED_KEYS = new Set(FORBIDDEN_FIELD_KEYS.map(normalizeKey));
const FORBIDDEN_TAG_FRAGMENTS = [
  "price",
  "fee",
  "payment",
  "wallet",
  "stock",
  "inventory",
  "provider",
  "schedule",
  "queue",
  "access_check",
  "eligibility",
  "effect",
  "runtime",
  "ui",
  "save",
  "account",
  "command",
  "event",
  "reward"
];

function normalizeKey(value) {
  return String(value).replace(/[^a-z0-9]/gi, "").toLowerCase();
}

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
  for (const keyword of ["minLength", "minItems"]) {
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
  return wrapper.records;
}

function assertNoForbiddenKeys(value, relativePath, valuePath = "wrapper") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoForbiddenKeys(entry, relativePath, `${valuePath}[${index}]`));
    return;
  }
  if (!isObject(value)) {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_NORMALIZED_KEYS.has(normalizeKey(key))) {
      throw new Error(`${relativePath} ${valuePath} must not define forbidden field '${key}'`);
    }
    assertNoForbiddenKeys(child, relativePath, `${valuePath}.${key}`);
  }
}

function validateStructurally({ relativePath, wrapper, schema, schemaName }) {
  if (schema === undefined) {
    throw new Error(`${relativePath} requires a ${schemaName} schema`);
  }
  assertNoForbiddenKeys(wrapper, relativePath);
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

function assertSafeTags(record, relativePath) {
  for (const tag of record.tags) {
    if (!LOWER_SNAKE_PATTERN.test(tag)) {
      throw new Error(`${relativePath} record ${record.id} tag '${tag}' must be lower-snake descriptive vocabulary`);
    }
    if (FORBIDDEN_TAG_FRAGMENTS.some((fragment) => tag.includes(fragment))) {
      throw new Error(`${relativePath} record ${record.id} tag '${tag}' implies forbidden service state or execution intent`);
    }
  }
}

function buildObservedBuildingServiceFunctions({ buildings, buildingServiceFunctions, approvedBuildingServiceFunctions }) {
  const observed = new Set();
  for (const value of buildingServiceFunctions ?? []) {
    observed.add(value);
  }
  for (const value of approvedBuildingServiceFunctions ?? []) {
    observed.add(value);
  }
  for (const building of buildings ?? []) {
    for (const serviceFunction of building.serviceFunctions ?? []) {
      observed.add(serviceFunction);
    }
  }
  return observed;
}

function assertRelatedBuildingServiceFunctions(record, observedBuildingServiceFunctions, relativePath) {
  for (const serviceFunction of record.relatedBuildingServiceFunctions ?? []) {
    if (!observedBuildingServiceFunctions.has(serviceFunction)) {
      throw new Error(`${relativePath} record ${record.id} relatedBuildingServiceFunctions '${serviceFunction}' is not an observed building serviceFunctions value`);
    }
  }
}

export function validateServicesContent({
  relativePath = "packages/content/base/civilization/services.json",
  wrapper,
  schema,
  buildings,
  buildingServiceFunctions,
  approvedBuildingServiceFunctions
}) {
  const records = validateStructurally({
    relativePath,
    wrapper,
    schema,
    schemaName: "service"
  });

  assertUniqueField(records, "id", relativePath, "service id");
  assertUniqueField(records, "slug", relativePath, "service slug");
  assertUniqueField(records, "name", relativePath, "service name");

  const observedBuildingServiceFunctions = buildObservedBuildingServiceFunctions({
    buildings,
    buildingServiceFunctions,
    approvedBuildingServiceFunctions
  });

  for (const record of records) {
    const idMatch = SERVICE_ID_PATTERN.exec(record.id);
    if (!idMatch) {
      throw new Error(`${relativePath} record ${record.id ?? "<unknown>"} id must match service.<slug>`);
    }
    if (idMatch[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} slug must match id suffix '${idMatch[1]}'`);
    }
    assertSafeTags(record, relativePath);
    assertRelatedBuildingServiceFunctions(record, observedBuildingServiceFunctions, relativePath);
  }

  return {
    ok: true,
    serviceIds: records.map((record) => record.id).sort()
  };
}
