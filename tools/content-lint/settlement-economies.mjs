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

const SETTLEMENT_ECONOMY_ID_PATTERN = /^settlement_economy\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const SETTLEMENT_ID_PATTERN = /^settlement\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const WORKPLACE_ID_PATTERN = /^workplace\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const PRODUCTION_CHAIN_ID_PATTERN = /^chain\.[a-z0-9]+(?:[._][a-z0-9]+)*$/;
const GUILD_ID_PATTERN = /^guild\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const ITEM_ID_PATTERN = /^item\.[a-z0-9]+(?:_[a-z0-9]+)*$/;

const TOPOLOGY_REF_PATTERN = /\b(?:route|road|river|lane|path|crossing|port|travel_network|distance|travel_mode|cargo|warehouse|logistics|pathfinding)\.[a-z0-9_./-]+/i;

const FORBIDDEN_FIELDS = [
  "settlementName",
  "settlementHierarchy",
  "regionId",
  "localityId",
  "hexId",
  "population",
  "geography",
  "infrastructureProfile",
  "marketTier",
  "economicModel",
  "tradeDependencyProfile",
  "domesticResourceProfile",
  "domesticTradeFlows",
  "guildPresence",
  "routeAccess",
  "routeIds",
  "roadIds",
  "riverIds",
  "laneIds",
  "pathIds",
  "crossingIds",
  "portIds",
  "travelNetworkIds",
  "distance",
  "travelMode",
  "pathfinding",
  "cargo",
  "caravans",
  "warehouseIds",
  "logisticsState",
  "transportState",
  "tradeState",
  "tradeOpportunityIds",
  "partnerSettlementIds",
  "importBias",
  "exportBias",
  "resourceIds",
  "commodityIds",
  "goods",
  "goodsCatalog",
  "marketProfileId",
  "baseValue",
  "basePrice",
  "buyPrice",
  "sellPrice",
  "priceFloors",
  "priceCeilings",
  "priceFormula",
  "currency",
  "volatility",
  "elasticity",
  "discounts",
  "stockCounts",
  "reserves",
  "currentInventory",
  "shopInventory",
  "merchantOffers",
  "supply",
  "demand",
  "pressureSources",
  "shortages",
  "surpluses",
  "workerAssignments",
  "laborState",
  "throughput",
  "productionRates",
  "productionTicks",
  "consumption",
  "outputs",
  "income",
  "expenses",
  "treasury",
  "recipeIds",
  "craftingEstimates",
  "professionIds",
  "institutionIds",
  "serviceIds",
  "vendorIds",
  "shopIds",
  "propertyIds",
  "estateIds",
  "ownership",
  "rent",
  "lawIds",
  "taxRates",
  "tariffRates",
  "tollRates",
  "customsRules",
  "restrictedGoods",
  "smuggling",
  "licenses",
  "favorability",
  "alignment",
  "access",
  "knowledgeDomainId",
  "knowledgeRefs",
  "questIds",
  "chronicleRefs",
  "playerState",
  "reputationState",
  "rewardRefs",
  "runtimeState",
  "saveState",
  "storageState",
  "uiState",
  "commandRefs",
  "eventRefs",
  "gameplayEffects"
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

function buildIdIndex(records, source, pattern) {
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
    index.set(record.id, record);
  });
  return index;
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

function buildItemIndex(items) {
  if (!Array.isArray(items)) {
    throw new Error("items.items records must be an array");
  }
  const index = new Map();
  items.forEach((record, recordIndex) => {
    if (!isObject(record) || typeof record.itemKey !== "string") {
      throw new Error(`items.items records[${recordIndex}] must provide itemKey`);
    }
    if (index.has(record.itemKey)) {
      throw new Error(`items.items has duplicate itemKey '${record.itemKey}'`);
    }
    index.set(record.itemKey, record);
  });
  return index;
}

function assertUniqueItemPostures(record, relativePath) {
  const seen = new Set();
  for (const posture of record.itemPostures) {
    const key = `${posture.itemKey}:${posture.role}`;
    if (seen.has(key)) {
      throw new Error(`${relativePath} record ${record.id} repeats item posture '${key}'`);
    }
    seen.add(key);
  }
}

function assertNoTopologyRefs(record, relativePath) {
  for (const note of record.routeDependenceNotes) {
    if (TOPOLOGY_REF_PATTERN.test(note)) {
      throw new Error(`${relativePath} record ${record.id} routeDependenceNotes must not contain topology reference '${note}'`);
    }
  }
  for (const note of record.tradePosture.notes) {
    if (TOPOLOGY_REF_PATTERN.test(note)) {
      throw new Error(`${relativePath} record ${record.id} tradePosture.notes must not contain topology reference '${note}'`);
    }
  }
}

export function validateSettlementEconomies({
  relativePath = "packages/content/base/world/settlement_economies.json",
  wrapper,
  schema,
  settlements,
  items,
  workplaces,
  productionChains,
  guilds
}) {
  const records = validateStructurally({
    relativePath,
    wrapper,
    schema,
    schemaName: "settlement economy"
  });

  const settlementsById = buildCurrentSettlementIndex(settlements);
  const itemsByKey = buildItemIndex(items);
  const workplacesById = buildIdIndex(workplaces, "civilization.workplaces", WORKPLACE_ID_PATTERN);
  const productionChainsById = buildIdIndex(productionChains, "civilization.production_chains", PRODUCTION_CHAIN_ID_PATTERN);
  const guildsById = buildIdIndex(guilds, "civilization.guilds", GUILD_ID_PATTERN);

  assertUniqueField(records, "id", relativePath, "settlement-economy id");
  assertUniqueField(records, "slug", relativePath, "settlement-economy slug");
  assertUniqueField(records, "settlementId", relativePath, "settlementId");

  for (const record of records) {
    assertNoForbiddenFields(record, relativePath);

    const idMatch = SETTLEMENT_ECONOMY_ID_PATTERN.exec(record.id);
    if (!idMatch || idMatch[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} id must equal settlement_economy.${record.slug}`);
    }

    const settlementMatch = SETTLEMENT_ID_PATTERN.exec(record.settlementId);
    if (!settlementMatch || settlementMatch[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} settlementId must equal settlement.${record.slug}`);
    }
    if (!settlementsById.has(record.settlementId)) {
      throw new Error(`${relativePath} settlementId '${record.settlementId}' is missing or inactive in world.settlements on record ${record.id}`);
    }

    assertUniqueItemPostures(record, relativePath);
    for (const posture of record.itemPostures) {
      if (ITEM_ID_PATTERN.test(posture.itemKey)) {
        throw new Error(`${relativePath} itemPostures.itemKey '${posture.itemKey}' must use canonical itemKey, not item.<key>, on record ${record.id}`);
      }
      if (!itemsByKey.has(posture.itemKey)) {
        throw new Error(`${relativePath} itemPostures.itemKey '${posture.itemKey}' is missing from items.items on record ${record.id}`);
      }
    }

    for (const workplaceRef of record.industryPosture.workplaceRefs) {
      if (!workplacesById.has(workplaceRef)) {
        throw new Error(`${relativePath} industryPosture.workplaceRefs '${workplaceRef}' is missing from civilization.workplaces on record ${record.id}`);
      }
    }
    for (const productionChainRef of record.industryPosture.productionChainRefs) {
      if (!productionChainsById.has(productionChainRef)) {
        throw new Error(`${relativePath} industryPosture.productionChainRefs '${productionChainRef}' is missing from civilization.production_chains on record ${record.id}`);
      }
    }
    for (const guildRef of record.guildRefs) {
      if (!guildsById.has(guildRef)) {
        throw new Error(`${relativePath} guildRefs '${guildRef}' is missing from civilization.guilds on record ${record.id}`);
      }
    }

    assertNoTopologyRefs(record, relativePath);
  }

  return {
    ok: true,
    settlementEconomyIds: records.map((record) => record.id).sort()
  };
}
