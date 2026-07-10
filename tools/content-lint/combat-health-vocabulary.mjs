const LOWER_SNAKE_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const ID_PATTERNS_BY_KIND = {
  status: /^combat_status\.([a-z0-9]+(?:_[a-z0-9]+)*)$/,
  condition: /^combat_condition\.([a-z0-9]+(?:_[a-z0-9]+)*)$/,
  injury: /^combat_injury\.([a-z0-9]+(?:_[a-z0-9]+)*)$/
};

const REQUIRED_RECORD_FIELDS = [
  "id",
  "slug",
  "name",
  "kind",
  "status",
  "family",
  "summary",
  "allowedOwnerTypes",
  "tags",
  "sourceAuthorityNotes",
  "notes"
];

const RECORD_FIELDS = new Set(REQUIRED_RECORD_FIELDS);

const FORBIDDEN_FIELD_KEYS = [
  "relatedAbilityIds",
  "relatedSpellIds",
  "relatedSkillEffectIds",
  "relatedItemKeys",
  "relatedMonsterIds",
  "relatedStatusIds",
  "relatedConditionIds",
  "relatedInjuryIds",
  "conditionClass",
  "injuryClass",
  "severityBand",
  "combatPhaseTags",
  "duration",
  "durationTurns",
  "tickRate",
  "tickInterval",
  "stackCount",
  "stacks",
  "maxStacks",
  "magnitude",
  "sourceActorId",
  "targetActorId",
  "startedAtTick",
  "expiresAtTick",
  "damage",
  "damageFormula",
  "damagePerTick",
  "healing",
  "healingFormula",
  "healingPerTick",
  "cure",
  "cureRule",
  "cureItem",
  "immunity",
  "resistance",
  "vulnerability",
  "modifier",
  "combatRollModifier",
  "hitChance",
  "critChance",
  "effect",
  "effects",
  "runtime",
  "runtimeState",
  "saveState",
  "accountState",
  "ui",
  "uiState",
  "command",
  "commands",
  "event",
  "events",
  "reward",
  "rewards",
  "migration",
  "gameplay",
  "gameplayEffects",
  "gameplayExecution"
];

const FORBIDDEN_NORMALIZED_KEYS = new Set(FORBIDDEN_FIELD_KEYS.map(normalizeKey));
const FORBIDDEN_TAGS = new Set([
  "runtime",
  "ui",
  "save",
  "damage_formula",
  "healing_formula",
  "duration_rule",
  "stack_rule",
  "gameplay"
]);

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

function enumSet(schema, defName, schemaName) {
  const values = schema?.$defs?.[defName]?.enum;
  if (!Array.isArray(values) || values.some((value) => typeof value !== "string")) {
    throw new Error(`${schemaName} schema $defs.${defName}.enum must be an array of strings`);
  }
  return new Set(values);
}

function assertSchema(schema, schemaName) {
  if (!isObject(schema)) {
    throw new Error(`${schemaName} schema must be an object`);
  }
  if (schema.type !== "object") {
    throw new Error(`${schemaName} schema must describe an object wrapper`);
  }
  if (schema.additionalProperties !== false) {
    throw new Error(`${schemaName} schema wrapper additionalProperties must be false`);
  }
  if (!schema.properties?.records || schema.properties.records.type !== "array") {
    throw new Error(`${schemaName} schema must define records as an array`);
  }
  return {
    kinds: enumSet(schema, "kind", schemaName),
    statuses: enumSet(schema, "status", schemaName),
    families: enumSet(schema, "family", schemaName),
    allowedOwnerTypes: enumSet(schema, "allowedOwnerType", schemaName)
  };
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

function assertString(value, valuePath) {
  if (typeof value !== "string") {
    throw new Error(`${valuePath} must be type string`);
  }
}

function assertNonEmptyString(value, valuePath) {
  assertString(value, valuePath);
  if (value.length < 1) {
    throw new Error(`${valuePath} must have length at least 1`);
  }
}

function assertUniqueArray(value, valuePath) {
  if (!Array.isArray(value)) {
    throw new Error(`${valuePath} must be type array`);
  }
  const seen = new Set();
  for (const entry of value) {
    const key = stableValueKey(entry);
    if (seen.has(key)) {
      throw new Error(`${valuePath} must contain unique items`);
    }
    seen.add(key);
  }
}

function assertEnumValue(value, validValues, valuePath) {
  if (!validValues.has(value)) {
    throw new Error(`${valuePath} must be one of the schema enum values`);
  }
}

function assertLowerSnake(value, valuePath) {
  assertString(value, valuePath);
  if (!LOWER_SNAKE_PATTERN.test(value)) {
    throw new Error(`${valuePath} must match lower-snake pattern`);
  }
}

function validateRecordShape(record, index, relativePath, schemaEnums) {
  const valuePath = `wrapper.records[${index}]`;
  if (!isObject(record)) {
    throw new Error(`${relativePath} ${valuePath} must be an object`);
  }
  for (const field of REQUIRED_RECORD_FIELDS) {
    if (!Object.hasOwn(record, field)) {
      throw new Error(`${relativePath} structural validation failed: ${valuePath} is missing required property '${field}'`);
    }
  }
  for (const field of Object.keys(record)) {
    if (!RECORD_FIELDS.has(field)) {
      throw new Error(`${relativePath} structural validation failed: ${valuePath} has unsupported property '${field}'`);
    }
  }

  assertNonEmptyString(record.id, `${valuePath}.id`);
  assertLowerSnake(record.slug, `${valuePath}.slug`);
  assertNonEmptyString(record.name, `${valuePath}.name`);
  assertEnumValue(record.kind, schemaEnums.kinds, `${valuePath}.kind`);
  assertEnumValue(record.status, schemaEnums.statuses, `${valuePath}.status`);
  assertEnumValue(record.family, schemaEnums.families, `${valuePath}.family`);
  assertNonEmptyString(record.summary, `${valuePath}.summary`);
  assertNonEmptyString(record.sourceAuthorityNotes, `${valuePath}.sourceAuthorityNotes`);
  assertNonEmptyString(record.notes, `${valuePath}.notes`);

  assertUniqueArray(record.allowedOwnerTypes, `${valuePath}.allowedOwnerTypes`);
  if (record.allowedOwnerTypes.length < 1) {
    throw new Error(`${valuePath}.allowedOwnerTypes must contain at least 1 items`);
  }
  record.allowedOwnerTypes.forEach((ownerType, ownerIndex) => {
    assertString(ownerType, `${valuePath}.allowedOwnerTypes[${ownerIndex}]`);
    assertEnumValue(ownerType, schemaEnums.allowedOwnerTypes, `${valuePath}.allowedOwnerTypes[${ownerIndex}]`);
  });

  assertUniqueArray(record.tags, `${valuePath}.tags`);
  if (record.tags.length < 1) {
    throw new Error(`${valuePath}.tags must contain at least 1 items`);
  }
  record.tags.forEach((tag, tagIndex) => {
    assertLowerSnake(tag, `${valuePath}.tags[${tagIndex}]`);
    if (FORBIDDEN_TAGS.has(tag)) {
      throw new Error(`${relativePath} record ${record.id} tag '${tag}' implies forbidden status execution intent`);
    }
  });
}

function assertIdAndSlugCoherence(record, relativePath) {
  const pattern = ID_PATTERNS_BY_KIND[record.kind];
  if (!pattern) {
    return;
  }
  const idMatch = pattern.exec(record.id);
  if (!idMatch) {
    throw new Error(`${relativePath} record ${record.id ?? "<unknown>"} id must match ${record.kind === "status" ? "combat_status" : record.kind === "condition" ? "combat_condition" : "combat_injury"}.<slug>`);
  }
  if (idMatch[1] !== record.slug) {
    throw new Error(`${relativePath} record ${record.id} slug must match id suffix '${idMatch[1]}'`);
  }
}

export function validateCombatHealthVocabularyContent({
  relativePath = "packages/content/base/game/combat_health_vocabulary.json",
  wrapper,
  schema
}) {
  const schemaEnums = assertSchema(schema, "combat health vocabulary");
  assertNoForbiddenKeys(wrapper, relativePath);
  const records = requireRecordsWrapper(wrapper, relativePath);

  records.forEach((record, index) => {
    validateRecordShape(record, index, relativePath, schemaEnums);
  });

  assertUniqueField(records, "id", relativePath, "combat health vocabulary id");
  assertUniqueField(records, "slug", relativePath, "combat health vocabulary slug");
  assertUniqueField(records, "name", relativePath, "combat health vocabulary name");

  for (const record of records) {
    assertIdAndSlugCoherence(record, relativePath);
  }

  return {
    ok: true,
    recordIds: records.map((record) => record.id).sort()
  };
}
