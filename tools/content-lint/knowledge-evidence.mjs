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
  "minItems",
  "uniqueItems",
  "items",
  "oneOf"
]);

const SUPPORTED_SCHEMA_TYPES = new Set([
  "array",
  "integer",
  "null",
  "object",
  "string"
]);

const SOURCE_CONTEXT_TYPES = new Map([
  ["field_identification", "field_observation"],
  ["combat_observation", "field_observation"],
  ["travel_observation", "travel_observation"],
  ["resource_use", "resource_use"],
  ["crafting_use", "crafting_use"],
  ["book_study", "study"],
  ["scroll_study", "study"],
  ["tome_study", "study"],
  ["teacher_instruction", "instruction"],
  ["institutional_study", "instruction"],
  ["quest_event", "quest_event"],
  ["chronicle_record", "chronicle_record"]
]);

const LOCATION_CONTEXT_FIELDS = new Set([
  "continentId",
  "regionId",
  "settlementId",
  "biomeTags"
]);

const SPECIALIZED_CONTEXT_FIELDS = new Map([
  ["field_observation", new Set(["eventId", "actionId"])],
  ["travel_observation", new Set(["eventId", "actionId"])],
  ["resource_use", new Set(["eventId", "actionId", "itemInstanceId", "skillId"])],
  ["crafting_use", new Set(["eventId", "actionId", "itemInstanceId", "skillId"])],
  ["study", new Set(["eventId", "actionId", "documentId", "skillId", "spellId"])],
  [
    "instruction",
    new Set(["eventId", "actionId", "teacherId", "institutionId", "skillId", "spellId"])
  ],
  ["quest_event", new Set(["eventId", "questOutcomeId"])],
  ["chronicle_record", new Set(["eventId", "chronicleRecordId"])]
]);

const UNRESOLVED_CONTEXT_FIELDS = new Set([
  "eventId",
  "actionId",
  "itemInstanceId",
  "documentId",
  "teacherId",
  "institutionId",
  "questOutcomeId",
  "chronicleRecordId",
  "skillId",
  "spellId"
]);

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
  return `${typeof value}:${JSON.stringify(value)}`;
}

function displayValue(value) {
  return JSON.stringify(value);
}

function schemaFailure(schemaPath, message) {
  throw new Error(`knowledge evidence schema ${schemaPath} ${message}`);
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

  if (
    schema.minimum !== undefined &&
    (typeof schema.minimum !== "number" || !Number.isFinite(schema.minimum))
  ) {
    schemaFailure(`${schemaPath}.minimum`, "must be a finite number");
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
    case "integer":
      return Number.isInteger(value);
    case "null":
      return value === null;
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
      throw new Error(
        `${valuePath} value ${displayValue(value)} must be one of the schema enum values`
      );
    }
  }

  if (
    schema.pattern !== undefined &&
    (typeof value !== "string" || !new RegExp(schema.pattern).test(value))
  ) {
    throw new Error(
      `${valuePath} value ${displayValue(value)} must match pattern ${schema.pattern}`
    );
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
    throw new Error(
      `${valuePath} value ${displayValue(value)} must be at least ${schema.minimum}`
    );
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
          throw new Error(
            `${valuePath} has unsupported property '${propertyName}' with value ${displayValue(value[propertyName])}`
          );
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
          throw new Error(
            `${valuePath} must contain unique items; duplicate value ${displayValue(entry)}`
          );
        }
        seen.add(key);
      }
    }
  }
}

function authorityMap(wrapper, authorityName, relativePath) {
  if (!isObject(wrapper) || !Array.isArray(wrapper.records)) {
    throw new Error(`${relativePath} ${authorityName} authority must provide a records array`);
  }

  const recordsById = new Map();
  for (const [index, record] of wrapper.records.entries()) {
    if (!isObject(record) || typeof record.id !== "string") {
      throw new Error(
        `${relativePath} ${authorityName} authority record index ${index} must provide a string id`
      );
    }
    if (recordsById.has(record.id)) {
      throw new Error(
        `${relativePath} ${authorityName} authority has duplicate id '${record.id}'`
      );
    }
    recordsById.set(record.id, record);
  }
  return recordsById;
}

function recordReference(record, index) {
  return typeof record?.evidenceId === "string"
    ? `record ${record.evidenceId}`
    : `record index ${index}`;
}

function fieldError(relativePath, recordRef, field, value, message) {
  throw new Error(
    `${relativePath} ${field} value ${displayValue(value)} ${message} on ${recordRef}`
  );
}

function assertLocationContext({
  context,
  regionsById,
  settlementsById,
  relativePath,
  recordRef
}) {
  const continentId = context.continentId;
  const regionId = context.regionId;
  const settlementId = context.settlementId;

  if (continentId !== undefined && continentId !== null) {
    const continent = regionsById.get(continentId);
    if (!continent) {
      fieldError(relativePath, recordRef, "acquisitionContext.continentId", continentId, "is unresolved");
    }
    if (continent.regionType !== "continent") {
      fieldError(
        relativePath,
        recordRef,
        "acquisitionContext.continentId",
        continentId,
        "must reference regionType 'continent'"
      );
    }
  }

  let region;
  if (regionId !== undefined && regionId !== null) {
    region = regionsById.get(regionId);
    if (!region) {
      fieldError(relativePath, recordRef, "acquisitionContext.regionId", regionId, "is unresolved");
    }
    if (region.regionType !== "subregion") {
      fieldError(
        relativePath,
        recordRef,
        "acquisitionContext.regionId",
        regionId,
        "must reference regionType 'subregion'"
      );
    }
  }

  let settlement;
  if (settlementId !== undefined && settlementId !== null) {
    settlement = settlementsById.get(settlementId);
    if (!settlement) {
      fieldError(
        relativePath,
        recordRef,
        "acquisitionContext.settlementId",
        settlementId,
        "is unresolved"
      );
    }
  }

  if (continentId !== undefined && continentId !== null && region) {
    const visited = new Set();
    let current = region;
    let matchingContinent = false;

    while (current) {
      if (visited.has(current.id)) {
        fieldError(
          relativePath,
          recordRef,
          "acquisitionContext.regionId",
          regionId,
          "has cyclic region ancestry"
        );
      }
      visited.add(current.id);

      if (current.id === continentId && current.regionType === "continent") {
        matchingContinent = true;
        break;
      }
      if (typeof current.parentRegionId !== "string") {
        break;
      }
      const parentRegionId = current.parentRegionId;
      current = regionsById.get(parentRegionId);
      if (!current) {
        fieldError(
          relativePath,
          recordRef,
          "acquisitionContext.regionId",
          regionId,
          `has unresolved ancestor ${displayValue(parentRegionId)}`
        );
      }
    }

    if (!matchingContinent) {
      fieldError(
        relativePath,
        recordRef,
        "acquisitionContext.regionId",
        regionId,
        `does not descend from continentId ${displayValue(continentId)}`
      );
    }
  }

  if (settlement && regionId !== undefined && regionId !== null && settlement.regionId !== regionId) {
    fieldError(
      relativePath,
      recordRef,
      "acquisitionContext.settlementId",
      settlementId,
      `has regionId ${displayValue(settlement.regionId)}, not ${displayValue(regionId)}`
    );
  }

  if (
    settlement &&
    continentId !== undefined &&
    continentId !== null &&
    settlement.macroRegionId !== continentId
  ) {
    fieldError(
      relativePath,
      recordRef,
      "acquisitionContext.settlementId",
      settlementId,
      `has macroRegionId ${displayValue(settlement.macroRegionId)}, not ${displayValue(continentId)}`
    );
  }
}

export function validateKnowledgeEvidence({
  relativePath = "knowledge-evidence-fixture.json",
  wrapper,
  evidenceSchema,
  snippetsWrapper,
  domainRegistryWrapper,
  regionsWrapper,
  settlementsWrapper,
  allowEmptyRecords = false
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
  if (wrapper.records.length === 0 && !allowEmptyRecords) {
    throw new Error(
      `${relativePath} records must be non-empty unless allowEmptyRecords is explicitly true`
    );
  }

  try {
    assertSupportedSchema(evidenceSchema);
  } catch (error) {
    throw new Error(`${relativePath} ${error.message}`);
  }

  wrapper.records.forEach((record, index) => {
    const recordRef = recordReference(record, index);
    try {
      validateValue(record, evidenceSchema, `records[${index}]`);
    } catch (error) {
      throw new Error(
        `${relativePath} structural validation failed for ${recordRef}: ${error.message}`
      );
    }
  });

  const evidenceById = new Map();
  for (const [index, record] of wrapper.records.entries()) {
    const recordRef = recordReference(record, index);
    if (evidenceById.has(record.evidenceId)) {
      fieldError(
        relativePath,
        recordRef,
        "evidenceId",
        record.evidenceId,
        "is duplicated"
      );
    }
    evidenceById.set(record.evidenceId, record);
  }

  const snippetsById = authorityMap(snippetsWrapper, "knowledge snippets", relativePath);
  const domainsById = authorityMap(
    domainRegistryWrapper,
    "knowledge domain registry",
    relativePath
  );
  const regionsById = authorityMap(regionsWrapper, "world regions", relativePath);
  const settlementsById = authorityMap(
    settlementsWrapper,
    "world settlements",
    relativePath
  );

  for (const [index, record] of wrapper.records.entries()) {
    const recordRef = recordReference(record, index);
    const snippet = snippetsById.get(record.snippetId);
    if (!snippet) {
      fieldError(relativePath, recordRef, "snippetId", record.snippetId, "is unresolved");
    }

    for (const field of ["domainId", "subjectType", "subjectId"]) {
      if (record[field] !== snippet[field]) {
        fieldError(
          relativePath,
          recordRef,
          field,
          record[field],
          `must equal referenced snippet value ${displayValue(snippet[field])}`
        );
      }
    }

    const domain = domainsById.get(record.domainId);
    if (!domain) {
      fieldError(relativePath, recordRef, "domainId", record.domainId, "is unresolved");
    }
    if (domain.status !== "active") {
      fieldError(
        relativePath,
        recordRef,
        "domainId",
        record.domainId,
        `must reference status 'active', not ${displayValue(domain.status)}`
      );
    }

    if (record.sourceType === "custom") {
      fieldError(
        relativePath,
        recordRef,
        "sourceType",
        record.sourceType,
        "is blocked in the first validator"
      );
    }

    const declaredSourceTypes = new Set(
      (snippet.discoverySources ?? []).map((source) => source.sourceType)
    );
    if (!declaredSourceTypes.has(record.sourceType)) {
      fieldError(
        relativePath,
        recordRef,
        "sourceType",
        record.sourceType,
        `is not declared by snippet ${displayValue(record.snippetId)}`
      );
    }

    if (record.sourceId !== null) {
      fieldError(
        relativePath,
        recordRef,
        "sourceId",
        record.sourceId,
        "must remain null"
      );
    }
    if (record.ownerScope !== "character") {
      fieldError(
        relativePath,
        recordRef,
        "ownerScope",
        record.ownerScope,
        "must remain 'character'"
      );
    }

    const context = record.acquisitionContext;
    const expectedContextType = SOURCE_CONTEXT_TYPES.get(record.sourceType);
    if (context.contextType !== expectedContextType) {
      fieldError(
        relativePath,
        recordRef,
        "acquisitionContext.contextType",
        context.contextType,
        `must be ${displayValue(expectedContextType)} for sourceType ${displayValue(record.sourceType)}`
      );
    }

    const compatibleSpecializedFields = SPECIALIZED_CONTEXT_FIELDS.get(context.contextType);
    for (const field of Object.keys(context)) {
      if (field === "contextType" || LOCATION_CONTEXT_FIELDS.has(field)) {
        continue;
      }
      if (!compatibleSpecializedFields?.has(field)) {
        fieldError(
          relativePath,
          recordRef,
          `acquisitionContext.${field}`,
          context[field],
          `is incompatible with contextType ${displayValue(context.contextType)}`
        );
      }
    }

    for (const field of UNRESOLVED_CONTEXT_FIELDS) {
      if (field in context && context[field] !== null) {
        fieldError(
          relativePath,
          recordRef,
          `acquisitionContext.${field}`,
          context[field],
          "has no selected authority and must remain null or absent"
        );
      }
    }

    assertLocationContext({
      context,
      regionsById,
      settlementsById,
      relativePath,
      recordRef
    });
  }

  return true;
}
