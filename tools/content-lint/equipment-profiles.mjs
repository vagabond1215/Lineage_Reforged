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
const WEAPON_PROFILE_ID_PATTERN = /^weapon_profile\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const ARMOR_PROFILE_ID_PATTERN = /^armor_profile\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const WEAPON_SLOT_IDS = new Set(["slot.weapon.left", "slot.weapon.right"]);
const ARMOR_BODY_SLOT_IDS = new Set([
  "slot.armor.head",
  "slot.armor.shoulder",
  "slot.armor.chest",
  "slot.armor.arm",
  "slot.armor.hand",
  "slot.armor.waist",
  "slot.armor.leg",
  "slot.armor.foot"
]);
const SHIELD_COVERAGE_IDS = new Set(["shield_hand"]);

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
  throw new Error(`equipment profile schema ${path} ${message}`);
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

function assertUniqueProfileIdentity(records, relativePath, idFieldLabel = "profile id") {
  const ids = new Set();
  const itemKeys = new Set();
  for (const record of records) {
    if (ids.has(record.id)) {
      throw new Error(`${relativePath} has duplicate ${idFieldLabel} '${record.id}'`);
    }
    ids.add(record.id);
    if (itemKeys.has(record.itemKey)) {
      throw new Error(`${relativePath} has duplicate itemKey '${record.itemKey}'`);
    }
    itemKeys.add(record.itemKey);
  }
}

function assertNoUseProfileMigration(record, relativePath) {
  for (const field of [
    "useProfiles",
    "actionType",
    "targetProfile",
    "activation",
    "effectChannels",
    "combatTags",
    "resolutionHooks",
    "grantTags",
    "damage",
    "mitigation",
    "durability",
    "condition",
    "quality",
    "rarity",
    "affixes",
    "enchantments",
    "ammo",
    "stack",
    "ownerId",
    "inventory",
    "equippedSlotId",
    "runtimeState",
    "uiState",
    "storageState",
    "rewardRefs"
  ]) {
    if (Object.hasOwn(record, field)) {
      throw new Error(`${relativePath} record ${record.id ?? "<unknown>"} must not define ${field}`);
    }
  }
}

function validateStructurally({ relativePath, wrapper, schema }) {
  if (schema === undefined) {
    throw new Error(`${relativePath} requires an equipment profile schema`);
  }
  assertSupportedSchema(schema, schema);
  const records = requireRecordsWrapper(wrapper, relativePath);
  try {
    validateValue(wrapper, schema, schema, "wrapper");
  } catch (error) {
    throw new Error(`${relativePath} structural validation failed: ${error.message}`);
  }
  return records;
}

export function validateWeaponProfiles({
  relativePath = "packages/content/base/items/weapon_profiles.json",
  wrapper,
  schema,
  items
}) {
  const records = validateStructurally({ relativePath, wrapper, schema });
  const itemsByKey = buildItemIndex(items);
  assertUniqueProfileIdentity(records, relativePath, "weapon profile id");

  for (const record of records) {
    assertNoUseProfileMigration(record, relativePath);

    const match = WEAPON_PROFILE_ID_PATTERN.exec(record.id);
    if (!match || match[1] !== record.itemKey) {
      throw new Error(`${relativePath} record ${record.id} id must equal weapon_profile.${record.itemKey}`);
    }

    const item = itemsByKey.get(record.itemKey);
    if (!item) {
      throw new Error(`${relativePath} itemKey '${record.itemKey}' is missing from items.items on record ${record.id}`);
    }
    if (item.itemClass !== "weapon") {
      throw new Error(`${relativePath} itemKey '${record.itemKey}' must reference a weapon-class item on record ${record.id}`);
    }

    for (const slotId of record.compatibleSlotIds) {
      if (!WEAPON_SLOT_IDS.has(slotId)) {
        throw new Error(`${relativePath} compatibleSlotIds '${slotId}' must be a canonical weapon slot on record ${record.id}`);
      }
    }
    if (record.handedness === "two_handed" && record.compatibleSlotIds.length !== WEAPON_SLOT_IDS.size) {
      throw new Error(`${relativePath} two_handed record ${record.id} must include both weapon slots`);
    }
    if (record.handedness !== "two_handed" && record.compatibleSlotIds.length === 0) {
      throw new Error(`${relativePath} record ${record.id} must include at least one compatible weapon slot`);
    }
  }

  return {
    ok: true,
    weaponProfileIds: records.map((record) => record.id).sort()
  };
}

export function validateArmorProfiles({
  relativePath = "packages/content/base/items/armor_profiles.json",
  wrapper,
  schema,
  items
}) {
  const records = validateStructurally({ relativePath, wrapper, schema });
  const itemsByKey = buildItemIndex(items);
  assertUniqueProfileIdentity(records, relativePath, "armor profile id");

  for (const record of records) {
    assertNoUseProfileMigration(record, relativePath);

    const match = ARMOR_PROFILE_ID_PATTERN.exec(record.id);
    if (!match || match[1] !== record.itemKey) {
      throw new Error(`${relativePath} record ${record.id} id must equal armor_profile.${record.itemKey}`);
    }

    const item = itemsByKey.get(record.itemKey);
    if (!item) {
      throw new Error(`${relativePath} itemKey '${record.itemKey}' is missing from items.items on record ${record.id}`);
    }
    if (item.itemClass !== "armor") {
      throw new Error(`${relativePath} itemKey '${record.itemKey}' must reference an armor-class item on record ${record.id}`);
    }

    const compatibleSlots = new Set(record.compatibleSlotIds);
    const coverageSlots = new Set(record.coverageSlotIds);
    if (record.armorKind === "shield") {
      if (record.armorFamily !== "shield") {
        throw new Error(`${relativePath} shield record ${record.id} must use armorFamily shield`);
      }
      if ([...compatibleSlots].some((slotId) => !WEAPON_SLOT_IDS.has(slotId))) {
        throw new Error(`${relativePath} shield record ${record.id} must use weapon-hand compatible slots only`);
      }
      if ([...coverageSlots].some((slotId) => !SHIELD_COVERAGE_IDS.has(slotId))) {
        throw new Error(`${relativePath} shield record ${record.id} must use shield_hand coverage only`);
      }
      continue;
    }

    if (record.armorFamily === "shield") {
      throw new Error(`${relativePath} body_armor record ${record.id} must not use armorFamily shield`);
    }
    if ([...compatibleSlots].some((slotId) => !ARMOR_BODY_SLOT_IDS.has(slotId))) {
      throw new Error(`${relativePath} body_armor record ${record.id} must use armor body slots only`);
    }
    if (coverageSlots.has("shield_hand")) {
      throw new Error(`${relativePath} body_armor record ${record.id} must not use shield_hand coverage`);
    }
  }

  return {
    ok: true,
    armorProfileIds: records.map((record) => record.id).sort()
  };
}
