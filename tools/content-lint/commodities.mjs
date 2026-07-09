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
const COMMODITY_ID_PATTERN = /^commodity\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const LOWER_SNAKE_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

const FORBIDDEN_FIELD_KEYS = [
  "baseValue",
  "currencyId",
  "valueUnit",
  "valueProfile",
  "pricingProfile",
  "pricingMode",
  "price",
  "prices",
  "priceFloor",
  "priceCeiling",
  "fee",
  "fees",
  "payment",
  "payments",
  "wallet",
  "stock",
  "supply",
  "demand",
  "pressure",
  "inventory",
  "vendorInventory",
  "shopInventory",
  "restock",
  "cargo",
  "cargoContents",
  "cargoMovement",
  "storageContents",
  "itemInstance",
  "itemInstances",
  "owner",
  "ownership",
  "quantity",
  "currentQuantity",
  "node",
  "depletion",
  "respawn",
  "harvestRoll",
  "extractionRate",
  "gatheringCheck",
  "toolRequirement",
  "toolRequirements",
  "skillCheck",
  "skillChecks",
  "accessCheck",
  "accessChecks",
  "effect",
  "effects",
  "command",
  "commands",
  "event",
  "events",
  "reward",
  "rewards",
  "runtime",
  "runtimeState",
  "saveState",
  "accountState",
  "ui",
  "uiState",
  "gameplay",
  "gameplayEffects",
  "gameplayExecution"
];

const FORBIDDEN_NORMALIZED_KEYS = new Set(FORBIDDEN_FIELD_KEYS.map(normalizeKey));
const FORBIDDEN_TAG_FRAGMENTS = [
  "price",
  "fee",
  "payment",
  "wallet",
  "stock",
  "supply",
  "demand",
  "pressure",
  "inventory",
  "vendor_inventory",
  "shop_inventory",
  "restock",
  "cargo",
  "storage",
  "quantity",
  "node",
  "depletion",
  "respawn",
  "harvest_roll",
  "extraction_rate",
  "gathering_check",
  "tool_requirement",
  "skill_check",
  "access_check",
  "effect",
  "command",
  "event",
  "reward",
  "runtime",
  "ui",
  "save",
  "account",
  "gameplay"
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

function recordsFrom(value, source) {
  if (value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (isObject(value) && Array.isArray(value.records)) {
    return value.records;
  }
  throw new Error(`${source} records must be an array`);
}

function buildIdSet(records, source) {
  const normalized = recordsFrom(records, source);
  if (normalized === undefined) {
    return undefined;
  }
  const ids = new Set();
  normalized.forEach((record, index) => {
    if (!isObject(record) || typeof record.id !== "string") {
      throw new Error(`${source} records[${index}] must provide id`);
    }
    if (ids.has(record.id)) {
      throw new Error(`${source} has duplicate id '${record.id}'`);
    }
    ids.add(record.id);
  });
  return ids;
}

function buildItemKeySet(items) {
  const records = recordsFrom(items, "items.items");
  if (records === undefined) {
    return undefined;
  }
  const keys = new Set();
  records.forEach((record, index) => {
    if (!isObject(record) || typeof record.itemKey !== "string") {
      throw new Error(`items.items records[${index}] must provide itemKey`);
    }
    if (keys.has(record.itemKey)) {
      throw new Error(`items.items has duplicate itemKey '${record.itemKey}'`);
    }
    keys.add(record.itemKey);
  });
  return keys;
}

function buildMarketKeySet(marketItemValues) {
  const records = recordsFrom(marketItemValues, "civilization.market_item_values");
  if (records === undefined) {
    return undefined;
  }
  return new Set(records.map((record) => record.itemKey).filter((value) => typeof value === "string"));
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

function tagHasForbiddenFragment(tag) {
  const tokens = tag.split("_");
  return FORBIDDEN_TAG_FRAGMENTS.some((fragment) => {
    if (tag === fragment || tag.startsWith(`${fragment}_`) || tag.endsWith(`_${fragment}`) || tag.includes(`_${fragment}_`)) {
      return true;
    }
    return !fragment.includes("_") && tokens.includes(fragment);
  });
}

function assertSafeTags(record, relativePath) {
  for (const tag of record.tags) {
    if (!LOWER_SNAKE_PATTERN.test(tag)) {
      throw new Error(`${relativePath} record ${record.id} tag '${tag}' must be lower-snake descriptive vocabulary`);
    }
    if (["other", "misc", "custom"].includes(tag)) {
      throw new Error(`${relativePath} record ${record.id} tag '${tag}' must not use generic category vocabulary`);
    }
    if (tagHasForbiddenFragment(tag)) {
      throw new Error(`${relativePath} record ${record.id} tag '${tag}' implies forbidden commodity state or execution intent`);
    }
  }
}

function assertRelatedItemKeys(record, itemKeys, marketKeys, relativePath) {
  for (const itemKey of record.relatedItemKeys ?? []) {
    if (itemKeys === undefined) {
      throw new Error(`${relativePath} record ${record.id} relatedItemKeys requires items.items authority records`);
    }
    if (itemKeys.has(itemKey)) {
      continue;
    }
    if (marketKeys?.has(itemKey)) {
      throw new Error(`${relativePath} record ${record.id} relatedItemKeys '${itemKey}' is market-only and is not an items.items itemKey`);
    }
    throw new Error(`${relativePath} record ${record.id} relatedItemKeys '${itemKey}' is missing from items.items`);
  }
}

function assertIdRefs(record, field, ids, source, relativePath) {
  for (const id of record[field] ?? []) {
    if (ids === undefined) {
      throw new Error(`${relativePath} record ${record.id} ${field} requires ${source} authority records`);
    }
    if (!ids.has(id)) {
      throw new Error(`${relativePath} record ${record.id} ${field} '${id}' is missing from ${source}`);
    }
  }
}

export function validateCommoditiesContent({
  relativePath = "packages/content/base/world/commodities.json",
  wrapper,
  schema,
  items,
  resources,
  marketItemValues,
  productionChains,
  recipes
}) {
  const records = validateStructurally({
    relativePath,
    wrapper,
    schema,
    schemaName: "commodity"
  });

  assertUniqueField(records, "id", relativePath, "commodity id");
  assertUniqueField(records, "slug", relativePath, "commodity slug");
  assertUniqueField(records, "name", relativePath, "commodity name");

  const itemKeys = buildItemKeySet(items);
  const marketKeys = buildMarketKeySet(marketItemValues);
  const resourceIds = buildIdSet(resources, "world.resources");
  const productionChainIds = buildIdSet(productionChains, "civilization.production_chains");
  const recipeIds = buildIdSet(recipes, "crafting.recipes");

  for (const record of records) {
    const idMatch = COMMODITY_ID_PATTERN.exec(record.id);
    if (!idMatch) {
      throw new Error(`${relativePath} record ${record.id ?? "<unknown>"} id must match commodity.<slug>`);
    }
    if (idMatch[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} slug must match id suffix '${idMatch[1]}'`);
    }
    assertSafeTags(record, relativePath);
    assertRelatedItemKeys(record, itemKeys, marketKeys, relativePath);
    assertIdRefs(record, "relatedResourceIds", resourceIds, "world.resources", relativePath);
    assertIdRefs(record, "relatedProductionChainIds", productionChainIds, "civilization.production_chains", relativePath);
    assertIdRefs(record, "relatedRecipeIds", recipeIds, "crafting.recipes", relativePath);
  }

  return {
    ok: true,
    commodityIds: records.map((record) => record.id).sort()
  };
}
