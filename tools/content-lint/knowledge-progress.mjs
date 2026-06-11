import { validateKnowledgeEvidence } from "./knowledge-evidence.mjs";

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
  "items"
]);

const SUPPORTED_SCHEMA_TYPES = new Set([
  "array",
  "integer",
  "object",
  "string"
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

function displayValue(value) {
  if (typeof value === "number" && !Number.isFinite(value)) {
    return String(value);
  }
  return JSON.stringify(value);
}

function schemaFailure(schemaPath, message) {
  throw new Error(`knowledge progress schema ${schemaPath} ${message}`);
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
    if (
      !Array.isArray(schema.required) ||
      schema.required.some((entry) => typeof entry !== "string")
    ) {
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
}

function matchesType(value, type, schemaPath) {
  switch (type) {
    case "array":
      return Array.isArray(value);
    case "integer":
      return Number.isInteger(value);
    case "object":
      return isObject(value);
    case "string":
      return typeof value === "string";
    default:
      schemaFailure(schemaPath, `declares unsupported type '${type}'`);
  }
}

function validateValue(value, schema, valuePath, schemaPath = "$") {
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

function authorityMap(wrapper, authorityName, idField, relativePath) {
  if (!isObject(wrapper) || !Array.isArray(wrapper.records)) {
    throw new Error(`${relativePath} ${authorityName} authority must provide a records array`);
  }

  const recordsById = new Map();
  for (const [index, record] of wrapper.records.entries()) {
    if (!isObject(record) || typeof record[idField] !== "string") {
      throw new Error(
        `${relativePath} ${authorityName} authority record index ${index} must provide a string ${idField}`
      );
    }
    if (recordsById.has(record[idField])) {
      throw new Error(
        `${relativePath} ${authorityName} authority has duplicate ${idField} '${record[idField]}'`
      );
    }
    recordsById.set(record[idField], record);
  }
  return recordsById;
}

function recordReference(record, index) {
  return typeof record?.progressId === "string"
    ? `record ${record.progressId}`
    : `record index ${index}`;
}

function fieldError(relativePath, recordRef, field, value, message) {
  throw new Error(
    `${relativePath} ${field} value ${displayValue(value)} ${message} on ${recordRef}`
  );
}

function validateEvidenceInput({
  relativePath,
  evidenceWrapper,
  evidenceSchema,
  snippetsWrapper,
  domainRegistryWrapper,
  evidenceAuthorities
}) {
  const regionsWrapper = evidenceAuthorities?.regionsWrapper;
  const settlementsWrapper = evidenceAuthorities?.settlementsWrapper;

  try {
    validateKnowledgeEvidence({
      relativePath: `${relativePath} evidence`,
      wrapper: evidenceWrapper,
      evidenceSchema,
      snippetsWrapper,
      domainRegistryWrapper,
      regionsWrapper,
      settlementsWrapper,
      allowEmptyRecords: true
    });
  } catch (error) {
    throw new Error(`${relativePath} consumed evidence validation failed: ${error.message}`);
  }
}

export function validateKnowledgeProgress({
  relativePath = "knowledge-progress-fixture.json",
  wrapper,
  progressSchema,
  evidenceSchema,
  snippetsWrapper,
  domainRegistryWrapper,
  evidenceWrapper,
  evidenceAuthorities,
  allowEmptyRecords = false,
  allowZeroStateRecords = false
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
    assertSupportedSchema(progressSchema);
  } catch (error) {
    throw new Error(`${relativePath} ${error.message}`);
  }

  wrapper.records.forEach((record, index) => {
    const recordRef = recordReference(record, index);
    try {
      validateValue(record, progressSchema, `records[${index}]`);
    } catch (error) {
      throw new Error(
        `${relativePath} structural validation failed for ${recordRef}: ${error.message}`
      );
    }
  });

  validateEvidenceInput({
    relativePath,
    evidenceWrapper,
    evidenceSchema,
    snippetsWrapper,
    domainRegistryWrapper,
    evidenceAuthorities
  });

  const snippetsById = authorityMap(
    snippetsWrapper,
    "knowledge snippets",
    "id",
    relativePath
  );
  const domainsById = authorityMap(
    domainRegistryWrapper,
    "knowledge domain registry",
    "id",
    relativePath
  );
  const evidenceById = authorityMap(
    evidenceWrapper,
    "knowledge evidence",
    "evidenceId",
    relativePath
  );

  const progressById = new Map();
  const progressByOwnerAndSnippet = new Map();
  const progressByConsumedEvidenceId = new Map();

  for (const [index, record] of wrapper.records.entries()) {
    const recordRef = recordReference(record, index);

    if (progressById.has(record.progressId)) {
      fieldError(
        relativePath,
        recordRef,
        "progressId",
        record.progressId,
        "is duplicated"
      );
    }
    progressById.set(record.progressId, record);

    const ownerAndSnippetKey = stableValueKey([
      record.ownerScope,
      record.ownerId,
      record.snippetId
    ]);
    if (progressByOwnerAndSnippet.has(ownerAndSnippetKey)) {
      fieldError(
        relativePath,
        recordRef,
        "ownerScope/ownerId/snippetId",
        [record.ownerScope, record.ownerId, record.snippetId],
        "duplicates a current progress identity"
      );
    }
    progressByOwnerAndSnippet.set(ownerAndSnippetKey, record);

    for (const evidenceId of record.consumedEvidenceIds) {
      const priorProgress = progressByConsumedEvidenceId.get(evidenceId);
      if (priorProgress) {
        fieldError(
          relativePath,
          recordRef,
          "consumedEvidenceIds",
          evidenceId,
          `is already consumed by progressId ${displayValue(priorProgress.progressId)}`
        );
      }
      progressByConsumedEvidenceId.set(evidenceId, record);
    }
  }

  for (const [index, record] of wrapper.records.entries()) {
    const recordRef = recordReference(record, index);
    const snippet = snippetsById.get(record.snippetId);
    if (!snippet) {
      fieldError(relativePath, recordRef, "snippetId", record.snippetId, "is unresolved");
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

    if (record.ownerScope !== "character") {
      fieldError(
        relativePath,
        recordRef,
        "ownerScope",
        record.ownerScope,
        "must remain 'character'"
      );
    }

    if (record.consumedEvidenceIds.length === 0) {
      if (record.progressValue !== 0) {
        fieldError(
          relativePath,
          recordRef,
          "progressValue",
          record.progressValue,
          "must be zero when consumedEvidenceIds is empty"
        );
      }
      if (!allowZeroStateRecords) {
        fieldError(
          relativePath,
          recordRef,
          "progressValue",
          record.progressValue,
          "requires allowZeroStateRecords to be explicitly true when consumedEvidenceIds is empty"
        );
      }
    } else if (record.progressValue === 0) {
      fieldError(
        relativePath,
        recordRef,
        "progressValue",
        record.progressValue,
        "must be positive when consumedEvidenceIds is non-empty"
      );
    }

    for (const [evidenceIndex, evidenceId] of record.consumedEvidenceIds.entries()) {
      const evidence = evidenceById.get(evidenceId);
      if (!evidence) {
        fieldError(
          relativePath,
          recordRef,
          `consumedEvidenceIds[${evidenceIndex}]`,
          evidenceId,
          "is unresolved"
        );
      }

      for (const field of [
        "ownerScope",
        "ownerId",
        "snippetId",
        "domainId",
        "subjectType",
        "subjectId"
      ]) {
        if (evidence[field] !== record[field]) {
          fieldError(
            relativePath,
            recordRef,
            field,
            record[field],
            `must equal consumed evidence ${displayValue(evidenceId)} value ${displayValue(evidence[field])}`
          );
        }
      }
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
  }

  return true;
}
