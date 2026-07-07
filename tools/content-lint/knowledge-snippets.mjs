const SUPPORTED_SCHEMA_KEYWORDS = new Set([
  "$schema",
  "title",
  "description",
  "type",
  "required",
  "additionalProperties",
  "properties",
  "pattern",
  "enum",
  "minLength",
  "minimum",
  "maximum",
  "minItems",
  "uniqueItems",
  "items",
  "oneOf"
]);

const SUPPORTED_SCHEMA_TYPES = new Set([
  "array",
  "boolean",
  "integer",
  "null",
  "number",
  "object",
  "string"
]);

const BLOCKED_SUBJECT_TYPES = new Set([
  "spell",
  "item",
  "culture",
  "institution",
  "ruin",
  "historical_event",
  "custom"
]);

const ACTIVE_ONLY_SUBJECT_LABELS = new Map([
  ["religious_hotspot", "hotspot"],
  ["sacred_site", "sacred-site"],
  ["settlement_district", "settlement district"],
  ["settlement_site", "settlement site"]
]);

const SETTLEMENT_ID_PATTERN = /^settlement\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const SETTLEMENT_DISTRICT_ID_PATTERN = /^settlement_district\.([a-z0-9]+(?:_[a-z0-9]+)*)\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;
const SETTLEMENT_SITE_ID_PATTERN = /^settlement_site\.([a-z0-9]+(?:_[a-z0-9]+)*)\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stableValueKey(value) {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableValueKey).join(",")}]`;
  }
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableValueKey(value[key])}`)
      .join(",")}}`;
  }
  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      return "number:NaN";
    }
    if (value === Infinity) {
      return "number:Infinity";
    }
    if (value === -Infinity) {
      return "number:-Infinity";
    }
  }
  return `${typeof value}:${JSON.stringify(value)}`;
}

function schemaFailure(schemaPath, message) {
  throw new Error(`knowledge snippet schema ${schemaPath} ${message}`);
}

function assertFiniteSchemaNumber(value, schemaPath) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    schemaFailure(schemaPath, "must be a finite number");
  }
}

function assertSupportedSchema(schema, schemaPath = "$") {
  if (!isObject(schema)) {
    schemaFailure(schemaPath, "must be an object");
  }

  for (const keyword of Object.keys(schema)) {
    if (!SUPPORTED_SCHEMA_KEYWORDS.has(keyword)) {
      schemaFailure(schemaPath, `uses unsupported keyword '${keyword}'`);
    }
  }

  for (const keyword of ["$schema", "title", "description", "pattern"]) {
    if (schema[keyword] !== undefined && typeof schema[keyword] !== "string") {
      schemaFailure(`${schemaPath}.${keyword}`, "must be a string");
    }
  }

  if (schema.type !== undefined && typeof schema.type !== "string") {
    schemaFailure(`${schemaPath}.type`, "must be a string");
  }
  if (schema.type !== undefined && !SUPPORTED_SCHEMA_TYPES.has(schema.type)) {
    schemaFailure(`${schemaPath}.type`, `declares unsupported type '${schema.type}'`);
  }

  if (schema.required !== undefined) {
    if (!Array.isArray(schema.required) || schema.required.some((entry) => typeof entry !== "string")) {
      schemaFailure(`${schemaPath}.required`, "must be an array of strings");
    }
  }

  if (schema.additionalProperties !== undefined && schema.additionalProperties !== false) {
    schemaFailure(`${schemaPath}.additionalProperties`, "must be false for this adapter");
  }

  if (schema.properties !== undefined) {
    if (!isObject(schema.properties)) {
      schemaFailure(`${schemaPath}.properties`, "must be an object");
    }
    for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
      assertSupportedSchema(propertySchema, `${schemaPath}.properties.${propertyName}`);
    }
  }

  if (schema.enum !== undefined && !Array.isArray(schema.enum)) {
    schemaFailure(`${schemaPath}.enum`, "must be an array");
  }

  for (const keyword of ["minLength", "minItems"]) {
    if (
      schema[keyword] !== undefined &&
      (!Number.isInteger(schema[keyword]) || schema[keyword] < 0)
    ) {
      schemaFailure(`${schemaPath}.${keyword}`, "must be a non-negative integer");
    }
  }

  for (const keyword of ["minimum", "maximum"]) {
    if (schema[keyword] !== undefined) {
      assertFiniteSchemaNumber(schema[keyword], `${schemaPath}.${keyword}`);
    }
  }
  if (
    schema.minimum !== undefined &&
    schema.maximum !== undefined &&
    schema.minimum > schema.maximum
  ) {
    schemaFailure(schemaPath, "minimum must not exceed maximum");
  }

  if (schema.uniqueItems !== undefined && schema.uniqueItems !== true) {
    schemaFailure(`${schemaPath}.uniqueItems`, "must be true for this adapter");
  }

  if (schema.items !== undefined) {
    assertSupportedSchema(schema.items, `${schemaPath}.items`);
  }

  if (schema.oneOf !== undefined) {
    if (!Array.isArray(schema.oneOf) || schema.oneOf.length === 0) {
      schemaFailure(`${schemaPath}.oneOf`, "must be a non-empty array");
    }
    schema.oneOf.forEach((branch, index) => {
      assertSupportedSchema(branch, `${schemaPath}.oneOf[${index}]`);
    });
  }
}

function matchesType(value, type, schemaPath) {
  switch (type) {
    case "array":
      return Array.isArray(value);
    case "boolean":
      return typeof value === "boolean";
    case "integer":
      return Number.isInteger(value);
    case "null":
      return value === null;
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "object":
      return isObject(value);
    case "string":
      return typeof value === "string";
    default:
      schemaFailure(schemaPath, `declares unsupported type '${type}'`);
  }
}

function validateValue(value, schema, valuePath, schemaPath = "$") {
  if (schema.oneOf !== undefined) {
    let matchingBranches = 0;
    for (const [index, branch] of schema.oneOf.entries()) {
      try {
        validateValue(value, branch, valuePath, `${schemaPath}.oneOf[${index}]`);
        matchingBranches += 1;
      } catch {
        // Branch mismatches are expected while evaluating oneOf alternatives.
      }
    }
    if (matchingBranches !== 1) {
      throw new Error(`${valuePath} must match exactly one oneOf branch`);
    }
  }

  if (schema.type !== undefined && !matchesType(value, schema.type, `${schemaPath}.type`)) {
    throw new Error(`${valuePath} must be type ${schema.type}`);
  }

  if (schema.enum !== undefined) {
    const key = stableValueKey(value);
    if (!schema.enum.some((candidate) => stableValueKey(candidate) === key)) {
      throw new Error(`${valuePath} must be one of the schema enum values`);
    }
  }

  if (
    schema.pattern !== undefined &&
    (typeof value !== "string" || !new RegExp(schema.pattern).test(value))
  ) {
    throw new Error(`${valuePath} must match pattern ${schema.pattern}`);
  }

  if (
    schema.minLength !== undefined &&
    (typeof value !== "string" || value.length < schema.minLength)
  ) {
    throw new Error(`${valuePath} must have length at least ${schema.minLength}`);
  }

  if (
    schema.minimum !== undefined &&
    (typeof value !== "number" || !Number.isFinite(value) || value < schema.minimum)
  ) {
    throw new Error(`${valuePath} must be at least ${schema.minimum}`);
  }

  if (
    schema.maximum !== undefined &&
    (typeof value !== "number" || !Number.isFinite(value) || value > schema.maximum)
  ) {
    throw new Error(`${valuePath} must be at most ${schema.maximum}`);
  }

  if (schema.type === "object") {
    const properties = schema.properties ?? {};
    for (const propertyName of schema.required ?? []) {
      if (!(propertyName in value)) {
        throw new Error(`${valuePath} is missing required property '${propertyName}'`);
      }
    }

    if (schema.additionalProperties === false) {
      for (const propertyName of Object.keys(value)) {
        if (!(propertyName in properties)) {
          throw new Error(`${valuePath} has unsupported property '${propertyName}'`);
        }
      }
    }

    for (const [propertyName, propertySchema] of Object.entries(properties)) {
      if (propertyName in value) {
        validateValue(
          value[propertyName],
          propertySchema,
          `${valuePath}.${propertyName}`,
          `${schemaPath}.properties.${propertyName}`
        );
      }
    }
  }

  if (schema.type === "array") {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      throw new Error(`${valuePath} must contain at least ${schema.minItems} items`);
    }

    if (schema.items !== undefined) {
      value.forEach((entry, index) => {
        validateValue(entry, schema.items, `${valuePath}[${index}]`, `${schemaPath}.items`);
      });
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
  }
}

function requireRecordArray(value, source) {
  if (!Array.isArray(value)) {
    throw new Error(`${source} records must be an array`);
  }
  return value;
}

function recordMap(records, source) {
  return new Map(
    requireRecordArray(records, source)
      .filter((record) => isObject(record) && typeof record.id === "string")
      .map((record) => [record.id, record])
  );
}

function authorityRecordMap(records, source) {
  const map = new Map();

  requireRecordArray(records, source).forEach((record, index) => {
    if (!isObject(record) || typeof record.id !== "string" || record.id.length === 0) {
      throw new Error(`${source} records[${index}] must provide a canonical id`);
    }
    if (map.has(record.id)) {
      throw new Error(`${source} has duplicate id '${record.id}'`);
    }
    map.set(record.id, record);
  });

  return map;
}

function settlementSlugFromId(id, pattern) {
  const match = typeof id === "string" ? id.match(pattern) : null;
  return match ? match[1] : null;
}

function assertActiveSubject(subjectType, subjectId, subject, recordId, relativePath) {
  const authorityLabel = ACTIVE_ONLY_SUBJECT_LABELS.get(subjectType);
  if (authorityLabel === undefined || subject.status === "active") {
    return;
  }

  throw new Error(
    `${relativePath} ${subjectType} subjectId '${subjectId}' must reference an active ${authorityLabel} record on record ${recordId}`
  );
}

function assertSettlementSiteParentDistrict({
  subject,
  subjectAuthority,
  subjectId,
  recordId,
  relativePath
}) {
  if (subject.parentDistrictId === null || subject.parentDistrictId === undefined) {
    return;
  }

  if (
    typeof subject.parentDistrictId !== "string" ||
    !SETTLEMENT_DISTRICT_ID_PATTERN.test(subject.parentDistrictId)
  ) {
    throw new Error(
      `${relativePath} settlement_site subjectId '${subjectId}' parentDistrictId must be a settlement_district id on record ${recordId}`
    );
  }

  const parentDistrictAuthority = subjectAuthority.parentDistrictAuthority;
  if (!parentDistrictAuthority || !Array.isArray(parentDistrictAuthority.records)) {
    throw new Error(
      `${relativePath} settlement_site subjectId '${subjectId}' requires settlement_district authority for parentDistrictId '${subject.parentDistrictId}' on record ${recordId}`
    );
  }

  const parentDistrictsById = authorityRecordMap(
    parentDistrictAuthority.records,
    "settlement_site parent district authority"
  );
  const parentDistrict = parentDistrictsById.get(subject.parentDistrictId);
  if (!parentDistrict) {
    throw new Error(
      `${relativePath} settlement_site subjectId '${subjectId}' parentDistrictId '${subject.parentDistrictId}' is missing from world.settlement_districts on record ${recordId}`
    );
  }

  if (parentDistrict.status !== "active") {
    throw new Error(
      `${relativePath} settlement_site subjectId '${subjectId}' parentDistrictId '${subject.parentDistrictId}' must reference an active settlement district record on record ${recordId}`
    );
  }

  const siteSettlementSlug = settlementSlugFromId(subjectId, SETTLEMENT_SITE_ID_PATTERN);
  const parentSettlementSlug = settlementSlugFromId(
    subject.parentSettlementId,
    SETTLEMENT_ID_PATTERN
  );
  const districtSettlementSlug = settlementSlugFromId(
    subject.parentDistrictId,
    SETTLEMENT_DISTRICT_ID_PATTERN
  );

  if (
    parentSettlementSlug !== null &&
    siteSettlementSlug !== null &&
    parentSettlementSlug !== siteSettlementSlug
  ) {
    throw new Error(
      `${relativePath} settlement_site subjectId '${subjectId}' parentSettlementId '${subject.parentSettlementId}' must share settlement slug '${siteSettlementSlug}' on record ${recordId}`
    );
  }

  if (districtSettlementSlug !== siteSettlementSlug) {
    throw new Error(
      `${relativePath} settlement_site subjectId '${subjectId}' parentDistrictId '${subject.parentDistrictId}' must share settlement slug '${siteSettlementSlug}' on record ${recordId}`
    );
  }
}

function assertLocationScope(locationScope, locationAuthorities, recordId, relativePath) {
  if (locationScope === undefined) {
    return;
  }

  const regionsById = recordMap(locationAuthorities.regions, "world regions");
  const settlementsById = locationAuthorities.settlements
    ? recordMap(locationAuthorities.settlements, "world settlements")
    : null;

  if (locationScope.continentId !== undefined && locationScope.continentId !== null) {
    const continent = regionsById.get(locationScope.continentId);
    if (!continent) {
      throw new Error(
        `${relativePath} locationScope.continentId '${locationScope.continentId}' is missing on record ${recordId}`
      );
    }
    if (continent.regionType !== "continent") {
      throw new Error(
        `${relativePath} locationScope.continentId '${locationScope.continentId}' must reference regionType 'continent' on record ${recordId}`
      );
    }
  }

  if (locationScope.regionId !== undefined && locationScope.regionId !== null) {
    const region = regionsById.get(locationScope.regionId);
    if (!region) {
      throw new Error(
        `${relativePath} locationScope.regionId '${locationScope.regionId}' is missing on record ${recordId}`
      );
    }
    if (region.regionType !== "subregion") {
      throw new Error(
        `${relativePath} locationScope.regionId '${locationScope.regionId}' must reference regionType 'subregion' on record ${recordId}`
      );
    }
  }

  if (locationScope.settlementId !== undefined && locationScope.settlementId !== null) {
    if (!settlementsById) {
      throw new Error(
        `${relativePath} locationScope.settlementId authority is unavailable on record ${recordId}`
      );
    }
    if (!settlementsById.has(locationScope.settlementId)) {
      throw new Error(
        `${relativePath} locationScope.settlementId '${locationScope.settlementId}' is missing on record ${recordId}`
      );
    }
  }
}

function assertAcyclicPrerequisites(records, relativePath) {
  const graph = new Map(
    records.map((record) => [
      record.id,
      record.prerequisites?.requiredSnippetIds ?? []
    ])
  );
  const states = new Map();
  const stack = [];

  function visit(snippetId) {
    const state = states.get(snippetId);
    if (state === "done") {
      return;
    }
    if (state === "visiting") {
      const cycleStart = stack.indexOf(snippetId);
      const cycle = [...stack.slice(cycleStart), snippetId];
      throw new Error(`${relativePath} prerequisite cycle detected: ${cycle.join(" -> ")}`);
    }

    states.set(snippetId, "visiting");
    stack.push(snippetId);
    for (const prerequisiteId of graph.get(snippetId) ?? []) {
      visit(prerequisiteId);
    }
    stack.pop();
    states.set(snippetId, "done");
  }

  for (const record of records) {
    visit(record.id);
  }
}

export function validateKnowledgeSnippets({
  relativePath = "packages/content/base/player/knowledge_snippets.json",
  wrapper,
  snippetSchema,
  registryRecords,
  subjectAuthorities,
  locationAuthorities,
  skillRecords,
  availableContentCollectionIds
}) {
  if (!isObject(wrapper)) {
    throw new Error(`${relativePath} wrapper must be an object`);
  }

  const wrapperKeys = Object.keys(wrapper);
  if (wrapperKeys.length !== 1 || wrapperKeys[0] !== "records") {
    throw new Error(`${relativePath} wrapper must contain exactly one top-level key: records`);
  }
  if (!Array.isArray(wrapper.records)) {
    throw new Error(`${relativePath} records must be an array`);
  }
  if (wrapper.records.length === 0) {
    throw new Error(`${relativePath} records must be non-empty`);
  }

  assertSupportedSchema(snippetSchema);
  wrapper.records.forEach((record, index) => {
    try {
      validateValue(record, snippetSchema, `records[${index}]`);
    } catch (error) {
      throw new Error(`${relativePath} structural validation failed: ${error.message}`);
    }
  });

  const records = wrapper.records;
  const registryById = recordMap(registryRecords, "knowledge domain registry");
  const skillsById = recordMap(skillRecords, "player skills");
  const snippetById = new Map();

  for (const record of records) {
    if (snippetById.has(record.id)) {
      throw new Error(`${relativePath} has duplicate snippet id '${record.id}'`);
    }
    snippetById.set(record.id, record);
  }

  for (const record of records) {
    const recordId = record.id;
    const domain = registryById.get(record.domainId);
    if (!domain) {
      throw new Error(`${relativePath} domainId '${record.domainId}' is missing on record ${recordId}`);
    }
    if (domain.status !== "active") {
      throw new Error(
        `${relativePath} domainId '${record.domainId}' must reference status 'active' on record ${recordId}`
      );
    }

    if (record.subjectType === "custom" || BLOCKED_SUBJECT_TYPES.has(record.subjectType)) {
      throw new Error(
        `${relativePath} subjectType '${record.subjectType}' is blocked in the first validator on record ${recordId}`
      );
    }
    if (!domain.canonicalSubjectTypes.includes(record.subjectType)) {
      throw new Error(
        `${relativePath} subjectType '${record.subjectType}' is not supported by domain ${record.domainId} on record ${recordId}`
      );
    }
    if (record.category === "custom") {
      throw new Error(`${relativePath} category 'custom' is blocked on record ${recordId}`);
    }
    if (!domain.supportedSnippetCategories.includes(record.category)) {
      throw new Error(
        `${relativePath} category '${record.category}' is not supported by domain ${record.domainId} on record ${recordId}`
      );
    }

    const subjectAuthority = subjectAuthorities[record.subjectType];
    if (!subjectAuthority) {
      throw new Error(
        `${relativePath} subjectType '${record.subjectType}' has no authority on record ${recordId}`
      );
    }
    if (!record.subjectId.startsWith(subjectAuthority.idPrefix)) {
      throw new Error(
        `${relativePath} subjectId '${record.subjectId}' must use prefix '${subjectAuthority.idPrefix}' on record ${recordId}`
      );
    }
    if (
      subjectAuthority.idPattern !== undefined &&
      !subjectAuthority.idPattern.test(record.subjectId)
    ) {
      throw new Error(
        `${relativePath} subjectId '${record.subjectId}' is malformed for subjectType '${record.subjectType}' on record ${recordId}`
      );
    }
    const subjectsById = authorityRecordMap(
      subjectAuthority.records,
      `${record.subjectType} subject authority`
    );
    const subject = subjectsById.get(record.subjectId);
    if (!subject) {
      throw new Error(
        `${relativePath} subjectId '${record.subjectId}' is missing from ${subjectAuthority.collectionId} on record ${recordId}`
      );
    }
    assertActiveSubject(
      record.subjectType,
      record.subjectId,
      subject,
      recordId,
      relativePath
    );
    if (record.subjectType === "settlement_site") {
      assertSettlementSiteParentDistrict({
        subject,
        subjectAuthority,
        subjectId: record.subjectId,
        recordId,
        relativePath
      });
    }
    if (!domain.relatedContentCollections.includes(subjectAuthority.collectionId)) {
      throw new Error(
        `${relativePath} domain ${record.domainId} must include '${subjectAuthority.collectionId}' for subjectType '${record.subjectType}' on record ${recordId}`
      );
    }
    if (
      availableContentCollectionIds !== undefined &&
      !availableContentCollectionIds.has(subjectAuthority.collectionId)
    ) {
      throw new Error(
        `${relativePath} subject collection '${subjectAuthority.collectionId}' is not a current base content collection on record ${recordId}`
      );
    }

    const discoverySourceKeys = new Set();
    for (const [sourceIndex, source] of record.discoverySources.entries()) {
      if (source.sourceType === "custom") {
        throw new Error(
          `${relativePath} discoverySources[${sourceIndex}].sourceType 'custom' is blocked on record ${recordId}`
        );
      }
      if (!domain.supportedDiscoverySourceTypes.includes(source.sourceType)) {
        throw new Error(
          `${relativePath} discovery sourceType '${source.sourceType}' is not supported by domain ${record.domainId} on record ${recordId}`
        );
      }
      if (source.sourceId !== undefined && source.sourceId !== null) {
        throw new Error(
          `${relativePath} discoverySources[${sourceIndex}].sourceId must remain null on record ${recordId}`
        );
      }

      const sourceKey = stableValueKey(source);
      if (discoverySourceKeys.has(sourceKey)) {
        throw new Error(`${relativePath} has duplicate discovery source declarations on record ${recordId}`);
      }
      discoverySourceKeys.add(sourceKey);

      assertLocationScope(source.locationScope, locationAuthorities, recordId, relativePath);
    }

    for (const field of ["completionWeight", "trialUnlockWeight"]) {
      const value = record.progression[field];
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
        throw new Error(
          `${relativePath} progression.${field} must be a finite non-negative number on record ${recordId}`
        );
      }
    }

    if (
      record.visibility.lockedUntilDiscovered === true &&
      (typeof record.visibility.hiddenSummary !== "string" ||
        record.visibility.hiddenSummary.trim().length === 0)
    ) {
      throw new Error(
        `${relativePath} visibility.hiddenSummary is required when lockedUntilDiscovered is true on record ${recordId}`
      );
    }

    const prerequisites = record.prerequisites;
    if (prerequisites !== undefined) {
      if (Object.keys(prerequisites).length === 0) {
        throw new Error(`${relativePath} prerequisites must be omitted when empty on record ${recordId}`);
      }

      for (const prerequisiteId of prerequisites.requiredSnippetIds ?? []) {
        if (prerequisiteId === recordId) {
          throw new Error(`${relativePath} prerequisite snippet self-reference on record ${recordId}`);
        }
        if (!snippetById.has(prerequisiteId)) {
          throw new Error(
            `${relativePath} prerequisite snippet id '${prerequisiteId}' is missing on record ${recordId}`
          );
        }
      }

      const prerequisiteSkillIds = new Set();
      for (const skillRank of prerequisites.requiredSkillRanks ?? []) {
        if (prerequisiteSkillIds.has(skillRank.skillId)) {
          throw new Error(
            `${relativePath} has duplicate prerequisite skill id '${skillRank.skillId}' on record ${recordId}`
          );
        }
        prerequisiteSkillIds.add(skillRank.skillId);
        if (!skillsById.has(skillRank.skillId)) {
          throw new Error(
            `${relativePath} prerequisite skill id '${skillRank.skillId}' is missing on record ${recordId}`
          );
        }
      }
    }
  }

  assertAcyclicPrerequisites(records, relativePath);
  return true;
}
