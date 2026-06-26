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

const SOURCE_ID_PATTERN = /^magic_study_source\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const ITEM_KEY_PATTERN = /^[a-z0-9]+(?:[._][a-z0-9]+)*$/;
const MAGIC_SERVICE_ID_PATTERN = /^magic_service\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SACRED_SITE_ID_PATTERN = /^sacred_site\.[a-z0-9]+(?:_[a-z0-9]+)*(?:\.[a-z0-9]+(?:_[a-z0-9]+)*)+$/;
const GUILD_ID_PATTERN = /^guild\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const PERSON_ID_PATTERN = /^person\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const NPC_ID_PATTERN = /^npc\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const INSTITUTION_ID_PATTERN = /^institution\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const RITUAL_ID_PATTERN = /^ritual\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const TRIAL_ID_PATTERN = /^trial\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const KNOWLEDGE_DOMAIN_ID_PATTERN = /^knowledge_domain\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SPELL_ID_PATTERN = /^spell\.[a-z0-9]+(?:_[a-z0-9]+)*(?:\.[a-z0-9]+(?:_[a-z0-9]+)*)+$/;

const COMPATIBLE_KINDS_BY_MODE = new Map([
  ["textual_study", new Set(["book", "scroll", "tome", "grimoire", "authored_document"])],
  ["instruction", new Set(["teacher_instruction"])],
  ["institutional_study", new Set(["institutional_curriculum"])],
  ["supervised_practice", new Set(["guided_exercise"])],
  ["observation", new Set(["field_observation", "combat_observation"])],
  ["ritual_context", new Set(["ritual_participation", "sacred_site_context"])],
  ["experimental_study", new Set(["controlled_experiment"])]
]);

const FORBIDDEN_FIELDS = [
  "accessPolicy",
  "acquisitionRoute",
  "acquisitionRoutes",
  "activeEffects",
  "attempt",
  "attemptHistory",
  "attemptLimit",
  "attemptLimits",
  "attempts",
  "attunementState",
  "availabilityState",
  "castingCosts",
  "checkpoints",
  "commandRefs",
  "completion",
  "completionState",
  "cooldown",
  "cooldowns",
  "costs",
  "craftingOutputs",
  "discoveryState",
  "durations",
  "emittedEffects",
  "eventRefs",
  "evidenceRequirements",
  "failureRules",
  "favorMutation",
  "gameplayEffects",
  "inventoryMutation",
  "itemConsumption",
  "knownSpellAcquisitionRoute",
  "knownSpellGrants",
  "loadoutMutation",
  "migration",
  "ownership",
  "policyRef",
  "preparationState",
  "prerequisites",
  "progress",
  "readiness",
  "recognitionMutation",
  "reputationMutation",
  "requiredRanks",
  "resolverOutput",
  "resultHistory",
  "rewards",
  "runtimeAvailability",
  "runtimeState",
  "saveState",
  "serviceAccessMutation",
  "spellbookMutation",
  "spellbookState",
  "standingMutation",
  "storageState",
  "studyPolicyId",
  "successRules",
  "timers",
  "trialExecution",
  "trialResults",
  "uiState",
  "unlockState",
  "unlocks"
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

function buildIdIndex(records, source, pattern, { activeOnly = false } = {}) {
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
    if (!activeOnly || record.status === "active") {
      index.set(record.id, record);
    }
  });
  return index;
}

function buildItemKeyIndex(records) {
  if (!Array.isArray(records)) {
    throw new Error("items.items records must be an array");
  }
  const index = new Map();
  records.forEach((record, recordIndex) => {
    if (!isObject(record) || typeof record.itemKey !== "string" || !ITEM_KEY_PATTERN.test(record.itemKey)) {
      throw new Error(`items.items records[${recordIndex}] must provide a canonical itemKey`);
    }
    if (index.has(record.itemKey)) {
      throw new Error(`items.items has duplicate itemKey '${record.itemKey}'`);
    }
    index.set(record.itemKey, record);
  });
  return index;
}

function buildSpellIndexes(records) {
  const spellsById = buildIdIndex(records, "player.spells", SPELL_ID_PATTERN);
  const spellFamilies = new Set();
  const spellSchools = new Set();
  for (const record of spellsById.values()) {
    if (typeof record.primaryFamily === "string" && SLUG_PATTERN.test(record.primaryFamily)) {
      spellFamilies.add(record.primaryFamily);
    }
    if (typeof record.school === "string" && SLUG_PATTERN.test(record.school)) {
      spellSchools.add(record.school);
    }
  }
  return { spellsById, spellFamilies, spellSchools };
}

function requireAuthority(records, source, pattern, anchorType, enabledAnchorTypes) {
  if (!enabledAnchorTypes.has(anchorType)) {
    return new Map();
  }
  return buildIdIndex(records, source, pattern, { activeOnly: true });
}

function assertUniqueRefs(refs, relativePath, recordId, field) {
  const seen = new Set();
  for (const ref of refs) {
    const key = `${ref.type}:${ref.refId}`;
    if (seen.has(key)) {
      throw new Error(`${relativePath} record ${recordId} has duplicate ${field} '${key}'`);
    }
    seen.add(key);
  }
}

function validateSubjectRef(ref, record, relativePath, indexes) {
  if (ref.type === "spell") {
    if (!SPELL_ID_PATTERN.test(ref.refId) || !indexes.spellsById.has(ref.refId)) {
      throw new Error(`${relativePath} subjectRef spell '${ref.refId}' is missing from player.spells on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "spell_family") {
    if (!SLUG_PATTERN.test(ref.refId) || !indexes.spellFamilies.has(ref.refId)) {
      throw new Error(`${relativePath} subjectRef spell_family '${ref.refId}' is missing from player.spells primaryFamily values on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "spell_school") {
    if (!SLUG_PATTERN.test(ref.refId) || !indexes.spellSchools.has(ref.refId)) {
      throw new Error(`${relativePath} subjectRef spell_school '${ref.refId}' is missing from player.spells school values on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "knowledge_domain") {
    if (!KNOWLEDGE_DOMAIN_ID_PATTERN.test(ref.refId) || !indexes.knowledgeDomainsById.has(ref.refId)) {
      throw new Error(`${relativePath} subjectRef knowledge_domain '${ref.refId}' is missing or inactive in player.knowledge_domain_registry on record ${record.id}`);
    }
  }
}

function validateAnchorRef(ref, record, relativePath, indexes) {
  if (ref.type === "item") {
    if (!ITEM_KEY_PATTERN.test(ref.refId) || !indexes.itemsByKey.has(ref.refId)) {
      throw new Error(`${relativePath} sourceAnchorRef item '${ref.refId}' is missing from items.items itemKey values on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "magic_infrastructure") {
    if (!MAGIC_SERVICE_ID_PATTERN.test(ref.refId) || !indexes.magicInfrastructureById.has(ref.refId)) {
      throw new Error(`${relativePath} sourceAnchorRef magic_infrastructure '${ref.refId}' is missing from world.magic_infrastructure on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "sacred_site") {
    if (!SACRED_SITE_ID_PATTERN.test(ref.refId) || !indexes.sacredSitesById.has(ref.refId)) {
      throw new Error(`${relativePath} sourceAnchorRef sacred_site '${ref.refId}' is missing or inactive in world.sacred_sites on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "guild") {
    if (!GUILD_ID_PATTERN.test(ref.refId) || !indexes.guildsById.has(ref.refId)) {
      throw new Error(`${relativePath} sourceAnchorRef guild '${ref.refId}' is missing from civilization.guilds on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "person") {
    if (!PERSON_ID_PATTERN.test(ref.refId) || !indexes.peopleById.has(ref.refId)) {
      throw new Error(`${relativePath} sourceAnchorRef person '${ref.refId}' is missing or inactive in civilization.people on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "npc") {
    if (!NPC_ID_PATTERN.test(ref.refId) || !indexes.npcsById.has(ref.refId)) {
      throw new Error(`${relativePath} sourceAnchorRef npc '${ref.refId}' is missing or inactive in civilization.npcs on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "institution") {
    if (!indexes.enabledAnchorTypes.has("institution")) {
      throw new Error("institution anchors are not enabled by this validator contract");
    }
    if (!INSTITUTION_ID_PATTERN.test(ref.refId) || !indexes.institutionsById.has(ref.refId)) {
      throw new Error(`${relativePath} sourceAnchorRef institution '${ref.refId}' is missing or inactive in enabled institution authority on record ${record.id}`);
    }
    return;
  }
  if (ref.type === "ritual") {
    if (!indexes.enabledAnchorTypes.has("ritual")) {
      throw new Error("ritual anchors are not enabled by this validator contract");
    }
    if (!RITUAL_ID_PATTERN.test(ref.refId) || !indexes.ritualsById.has(ref.refId)) {
      throw new Error(`${relativePath} sourceAnchorRef ritual '${ref.refId}' is missing or inactive in enabled ritual authority on record ${record.id}`);
    }
    return;
  }
  if (!indexes.enabledAnchorTypes.has("trial")) {
    throw new Error("trial anchors are not enabled by this validator contract");
  }
  if (!TRIAL_ID_PATTERN.test(ref.refId) || !indexes.trialsById.has(ref.refId)) {
    throw new Error(`${relativePath} sourceAnchorRef trial '${ref.refId}' is missing or inactive in enabled trial authority on record ${record.id}`);
  }
}

export function validateMagicStudySources({
  relativePath = "packages/content/base/player/magic_study_sources.json",
  wrapper,
  schema,
  spells,
  knowledgeDomains,
  items,
  magicInfrastructure,
  sacredSites,
  guilds,
  people = [],
  npcs = [],
  institutions = [],
  rituals = [],
  trials = [],
  enabledAnchorTypes = []
}) {
  const records = validateStructurally({
    relativePath,
    wrapper,
    schema,
    schemaName: "magic study source"
  });
  if (!Array.isArray(spells)) {
    throw new Error(`${relativePath} requires supplied player.spells records`);
  }
  if (!Array.isArray(knowledgeDomains)) {
    throw new Error(`${relativePath} requires supplied player.knowledge_domain_registry records`);
  }
  if (!Array.isArray(items)) {
    throw new Error(`${relativePath} requires supplied items.items records`);
  }
  if (!Array.isArray(magicInfrastructure)) {
    throw new Error(`${relativePath} requires supplied world.magic_infrastructure records`);
  }
  if (!Array.isArray(sacredSites)) {
    throw new Error(`${relativePath} requires supplied world.sacred_sites records`);
  }
  if (!Array.isArray(guilds)) {
    throw new Error(`${relativePath} requires supplied civilization.guilds records`);
  }

  assertUniqueField(records, "id", relativePath, "magic study source id");
  assertUniqueField(records, "slug", relativePath, "magic study source slug");

  const enabled = new Set(enabledAnchorTypes);
  const spellIndexes = buildSpellIndexes(spells);
  const indexes = {
    ...spellIndexes,
    knowledgeDomainsById: buildIdIndex(knowledgeDomains, "player.knowledge_domain_registry", KNOWLEDGE_DOMAIN_ID_PATTERN, { activeOnly: true }),
    itemsByKey: buildItemKeyIndex(items),
    magicInfrastructureById: buildIdIndex(magicInfrastructure, "world.magic_infrastructure", MAGIC_SERVICE_ID_PATTERN),
    sacredSitesById: buildIdIndex(sacredSites, "world.sacred_sites", SACRED_SITE_ID_PATTERN, { activeOnly: true }),
    guildsById: buildIdIndex(guilds, "civilization.guilds", GUILD_ID_PATTERN),
    peopleById: buildIdIndex(people, "civilization.people", PERSON_ID_PATTERN, { activeOnly: true }),
    npcsById: buildIdIndex(npcs, "civilization.npcs", NPC_ID_PATTERN, { activeOnly: true }),
    institutionsById: requireAuthority(institutions, "civilization.institutions", INSTITUTION_ID_PATTERN, "institution", enabled),
    ritualsById: requireAuthority(rituals, "magic.rituals", RITUAL_ID_PATTERN, "ritual", enabled),
    trialsById: requireAuthority(trials, "player.trials", TRIAL_ID_PATTERN, "trial", enabled),
    enabledAnchorTypes: enabled
  };

  for (const record of records) {
    assertNoForbiddenFields(record, relativePath);
    const match = SOURCE_ID_PATTERN.exec(record.id);
    if (!match || match[1] !== record.slug) {
      throw new Error(`${relativePath} record ${record.id} id must equal magic_study_source.${record.slug}`);
    }
    if (!COMPATIBLE_KINDS_BY_MODE.get(record.sourceMode)?.has(record.sourceKind)) {
      throw new Error(`${relativePath} record ${record.id} sourceKind '${record.sourceKind}' is not compatible with sourceMode '${record.sourceMode}'`);
    }

    assertUniqueRefs(record.subjectRefs, relativePath, record.id, "subjectRef");
    assertUniqueRefs(record.sourceAnchorRefs, relativePath, record.id, "sourceAnchorRef");
    for (const ref of record.subjectRefs) {
      validateSubjectRef(ref, record, relativePath, indexes);
    }
    for (const ref of record.sourceAnchorRefs) {
      validateAnchorRef(ref, record, relativePath, indexes);
    }
  }

  return {
    ok: true,
    sourceIds: records.map((record) => record.id).sort()
  };
}
