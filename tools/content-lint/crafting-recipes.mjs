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
const RECIPE_ID_PATTERN = /^recipe\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const WORKPLACE_ID_PATTERN = /^workplace\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SKILL_ID_PATTERN = /^skill\.[a-z0-9]+(?:[._][a-z0-9]+)*$/;
const PRODUCTION_CHAIN_ID_PATTERN = /^chain\.[a-z0-9]+(?:[._][a-z0-9]+)*$/;
const INVALID_WORKPLACE_ANCHOR_PATTERN = /^(?:extract|building|infrastructure|settlement|service|vendor|property|route)\./;

const PREREQUISITE_AUTHORITY_FIELDS = [
  ["guildIds", "guilds"],
  ["knowledgeDomainIds", "knowledgeDomains"],
  ["knowledgeSnippetIds", "knowledgeSnippets"],
  ["trialIds", "trials"]
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

function schemaFailure(path, message) {
  throw new Error(`crafting recipe schema ${path} ${message}`);
}

function resolveLocalRef(rootSchema, reference, path) {
  if (typeof reference !== "string" || !reference.startsWith("#/")) {
    schemaFailure(path, `uses unsupported reference '${reference}'`);
  }
  let value = rootSchema;
  for (const segment of reference.slice(2).split("/")) {
    const decoded = segment.replaceAll("~1", "/").replaceAll("~0", "~");
    if (!isObject(value) || !Object.hasOwn(value, decoded)) {
      schemaFailure(path, `references missing location '${reference}'`);
    }
    value = value[decoded];
  }
  return value;
}

function assertSupportedSchema(schema, rootSchema, path = "$", seen = new Set()) {
  if (!isObject(schema)) {
    schemaFailure(path, "must be an object");
  }
  if (seen.has(schema)) {
    return;
  }
  seen.add(schema);

  for (const keyword of Object.keys(schema)) {
    if (!SUPPORTED_SCHEMA_KEYWORDS.has(keyword)) {
      schemaFailure(path, `uses unsupported keyword '${keyword}'`);
    }
  }
  if (schema.$ref !== undefined) {
    assertSupportedSchema(resolveLocalRef(rootSchema, schema.$ref, `${path}.$ref`), rootSchema, `${path}.$ref(${schema.$ref})`, seen);
  }
  if (schema.type !== undefined && !SUPPORTED_SCHEMA_TYPES.has(schema.type)) {
    schemaFailure(`${path}.type`, `declares unsupported type '${schema.type}'`);
  }
  if (schema.additionalProperties !== undefined && schema.additionalProperties !== false) {
    schemaFailure(`${path}.additionalProperties`, "must be false for this adapter");
  }
  if (schema.required !== undefined && (!Array.isArray(schema.required) || schema.required.some((entry) => typeof entry !== "string"))) {
    schemaFailure(`${path}.required`, "must be an array of strings");
  }
  for (const [key, value] of Object.entries(schema.properties ?? {})) {
    assertSupportedSchema(value, rootSchema, `${path}.properties.${key}`, seen);
  }
  for (const [key, value] of Object.entries(schema.$defs ?? {})) {
    assertSupportedSchema(value, rootSchema, `${path}.$defs.${key}`, seen);
  }
  if (schema.items !== undefined) {
    assertSupportedSchema(schema.items, rootSchema, `${path}.items`, seen);
  }
  if (schema.enum !== undefined && !Array.isArray(schema.enum)) {
    schemaFailure(`${path}.enum`, "must be an array");
  }
  for (const keyword of ["minLength", "minItems", "minimum"]) {
    if (schema[keyword] !== undefined && (!Number.isInteger(schema[keyword]) || schema[keyword] < 0)) {
      schemaFailure(`${path}.${keyword}`, "must be a non-negative integer");
    }
  }
  if (schema.uniqueItems !== undefined && schema.uniqueItems !== true) {
    schemaFailure(`${path}.uniqueItems`, "must be true for this adapter");
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

function validateValue(value, schema, rootSchema, valuePath, schemaPath = "$") {
  if (schema.$ref !== undefined) {
    validateValue(value, resolveLocalRef(rootSchema, schema.$ref, `${schemaPath}.$ref`), rootSchema, valuePath, `${schemaPath}.$ref(${schema.$ref})`);
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
        validateValue(value[propertyName], propertySchema, rootSchema, `${valuePath}.${propertyName}`, `${schemaPath}.properties.${propertyName}`);
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
        validateValue(entry, schema.items, rootSchema, `${valuePath}[${index}]`, `${schemaPath}.items`);
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

function assertUniqueField(records, field, relativePath) {
  const seen = new Set();
  for (const record of records) {
    const value = record[field];
    if (seen.has(value)) {
      throw new Error(`${relativePath} has duplicate recipe ${field} '${value}'`);
    }
    seen.add(value);
  }
}

function assertUniqueItemRole(entries, fieldName, recipe, relativePath) {
  const seen = new Set();
  for (const entry of entries) {
    const key = `${entry.role}:${entry.itemKey}`;
    if (seen.has(key)) {
      throw new Error(`${relativePath} ${fieldName} repeats itemKey '${entry.itemKey}' with role '${entry.role}' on record ${recipe.id}`);
    }
    seen.add(key);
  }
}

function assertPrerequisiteRefs(record, authorities, relativePath) {
  if (record.prerequisiteRefs === undefined) {
    return;
  }
  for (const [fieldName, authorityName] of PREREQUISITE_AUTHORITY_FIELDS) {
    const ids = record.prerequisiteRefs[fieldName] ?? [];
    if (ids.length === 0) {
      continue;
    }
    const authorityRecords = authorities[authorityName];
    if (!Array.isArray(authorityRecords)) {
      throw new Error(`${relativePath} prerequisiteRefs.${fieldName} requires ${authorityName} authority records on record ${record.id}`);
    }
    const authorityIds = new Set(authorityRecords.map((authority) => authority.id));
    for (const id of ids) {
      if (!authorityIds.has(id)) {
        throw new Error(`${relativePath} prerequisiteRefs.${fieldName} '${id}' is missing from ${authorityName} on record ${record.id}`);
      }
    }
  }
}

export function validateCraftingRecipes({
  relativePath = "packages/content/base/crafting/recipes.json",
  wrapper,
  schema,
  items,
  workplaces,
  skills,
  productionChains,
  guilds,
  knowledgeDomains,
  knowledgeSnippets,
  trials
}) {
  if (schema === undefined) {
    throw new Error(`${relativePath} requires a crafting recipe schema`);
  }
  assertSupportedSchema(schema, schema);
  const records = requireRecordsWrapper(wrapper, relativePath);
  try {
    validateValue(wrapper, schema, schema, "wrapper");
  } catch (error) {
    throw new Error(`${relativePath} structural validation failed: ${error.message}`);
  }

  const itemsByKey = buildItemIndex(items);
  const workplacesById = buildIdIndex(workplaces, "civilization.workplaces", WORKPLACE_ID_PATTERN);
  const skillsById = buildIdIndex(skills, "player.skills", SKILL_ID_PATTERN);
  const productionChainsById = buildIdIndex(productionChains, "civilization.production_chains", PRODUCTION_CHAIN_ID_PATTERN);

  assertUniqueField(records, "id", relativePath);
  assertUniqueField(records, "slug", relativePath);

  for (const record of records) {
    const recipeIdMatch = RECIPE_ID_PATTERN.exec(record.id);
    if (!recipeIdMatch || recipeIdMatch[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} id must equal recipe.${record.slug}`);
    }

    for (const [fieldName, entries] of [["inputs", record.inputs], ["outputs", record.outputs]]) {
      assertUniqueItemRole(entries, fieldName, record, relativePath);
      for (const entry of entries) {
        if (!itemsByKey.has(entry.itemKey)) {
          throw new Error(`${relativePath} ${fieldName}.itemKey '${entry.itemKey}' is missing from items.items on record ${record.id}`);
        }
      }
    }

    const primaryOutputs = record.outputs.filter((output) => output.role === "primary");
    if (primaryOutputs.length !== 1) {
      throw new Error(`${relativePath} record ${record.id} must declare exactly one primary output`);
    }

    const inputKeys = new Set(record.inputs.map((input) => input.itemKey));
    for (const output of record.outputs) {
      if (inputKeys.has(output.itemKey)) {
        throw new Error(`${relativePath} record ${record.id} directly transforms itemKey '${output.itemKey}' into itself`);
      }
    }

    for (const workplaceId of record.requiredWorkplaceIds) {
      if (INVALID_WORKPLACE_ANCHOR_PATTERN.test(workplaceId)) {
        throw new Error(`${relativePath} requiredWorkplaceIds '${workplaceId}' is not an approved workplace anchor on record ${record.id}`);
      }
      if (!workplacesById.has(workplaceId)) {
        throw new Error(`${relativePath} requiredWorkplaceIds '${workplaceId}' is missing from civilization.workplaces on record ${record.id}`);
      }
    }

    for (const itemKey of record.requiredToolItemKeys) {
      const tool = itemsByKey.get(itemKey);
      if (!tool) {
        throw new Error(`${relativePath} requiredToolItemKeys '${itemKey}' is missing from items.items on record ${record.id}`);
      }
      if (tool.itemClass !== "tool") {
        throw new Error(`${relativePath} requiredToolItemKeys '${itemKey}' must reference a tool-class item on record ${record.id}`);
      }
    }

    const skillIds = new Set();
    for (const requirement of record.skillRequirements) {
      if (skillIds.has(requirement.skillId)) {
        throw new Error(`${relativePath} skillRequirements repeats skillId '${requirement.skillId}' on record ${record.id}`);
      }
      skillIds.add(requirement.skillId);
      if (!skillsById.has(requirement.skillId)) {
        throw new Error(`${relativePath} skillRequirements.skillId '${requirement.skillId}' is missing from player.skills on record ${record.id}`);
      }
    }

    if (record.relatedProductionChainId !== undefined && !productionChainsById.has(record.relatedProductionChainId)) {
      throw new Error(`${relativePath} relatedProductionChainId '${record.relatedProductionChainId}' is missing from civilization.production_chains on record ${record.id}`);
    }

    assertPrerequisiteRefs(record, { guilds, knowledgeDomains, knowledgeSnippets, trials }, relativePath);
  }

  return {
    ok: true,
    recipeIds: records.map((record) => record.id).sort()
  };
}
