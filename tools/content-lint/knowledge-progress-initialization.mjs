const INPUT_FIELDS = new Set([
  "relativePath",
  "initializationMode",
  "ownerScope",
  "ownerId",
  "snippetId",
  "updatedSequence",
  "notes",
  "snippetsWrapper",
  "domainRegistryWrapper",
  "currentProgressWrapper",
  "progressSchema"
]);

const PROGRESS_FIELDS = [
  "progressId",
  "snippetId",
  "domainId",
  "subjectType",
  "subjectId",
  "ownerScope",
  "ownerId",
  "progressValue",
  "consumedEvidenceIds",
  "updatedSequence",
  "notes"
];

const SAFETY_FLAGS = Object.freeze({
  noMutation: true,
  noPersistence: true,
  noEvidenceCreation: true,
  noEvidenceConsumption: true,
  noProposal: true,
  noProgressApplication: true,
  noCompletion: true,
  noTrialUnlock: true,
  noUiOutput: true,
  noRuntimeEffect: true,
  noGeneratedOutput: true
});

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stableValueKey(value) {
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

function result(initializedProgressRecord = null, issues = []) {
  return {
    initializedProgressRecord,
    issues,
    safety: { ...SAFETY_FLAGS }
  };
}

function issue(code, message) {
  return result(null, [{ code, message }]);
}

function validateValue(value, schema, valuePath) {
  if (!isObject(schema)) {
    throw new Error(`${valuePath} schema must be an object`);
  }

  if (schema.type !== undefined) {
    const matchesType =
      (schema.type === "object" && isObject(value)) ||
      (schema.type === "array" && Array.isArray(value)) ||
      (schema.type === "string" && typeof value === "string") ||
      (schema.type === "integer" && Number.isInteger(value));
    if (!matchesType) {
      throw new Error(`${valuePath} must be type ${schema.type}`);
    }
  }

  if (schema.enum !== undefined) {
    const valueKey = stableValueKey(value);
    if (!schema.enum.some((candidate) => stableValueKey(candidate) === valueKey)) {
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
        validateValue(value[propertyName], propertySchema, `${valuePath}.${propertyName}`);
      }
    }
  }

  if (schema.type === "array") {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      throw new Error(`${valuePath} must contain at least ${schema.minItems} items`);
    }
    if (schema.items !== undefined) {
      value.forEach((entry, index) => {
        validateValue(entry, schema.items, `${valuePath}[${index}]`);
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

function validateProgressSchema(progressSchema) {
  if (
    !isObject(progressSchema) ||
    progressSchema.type !== "object" ||
    progressSchema.additionalProperties !== false ||
    !isObject(progressSchema.properties) ||
    !Array.isArray(progressSchema.required)
  ) {
    throw new Error(
      "progressSchema must provide the current strict progress record object contract"
    );
  }

  const propertyFields = Object.keys(progressSchema.properties);
  if (
    stableValueKey(propertyFields) !== stableValueKey(PROGRESS_FIELDS) ||
    stableValueKey(progressSchema.required) !== stableValueKey(PROGRESS_FIELDS)
  ) {
    throw new Error(
      `progressSchema fields must exactly match: ${PROGRESS_FIELDS.join(", ")}`
    );
  }
}

function authorityMap(wrapper, authorityName, duplicateCode, relativePath) {
  if (!isObject(wrapper) || !Array.isArray(wrapper.records)) {
    throw Object.assign(
      new Error(`${relativePath} ${authorityName} authority must provide a records array`),
      { code: "invalid_authority" }
    );
  }

  const recordsById = new Map();
  for (const [index, record] of wrapper.records.entries()) {
    if (!isObject(record) || typeof record.id !== "string" || record.id.length === 0) {
      throw Object.assign(
        new Error(
          `${relativePath} ${authorityName} authority record index ${index} must provide a non-empty string id`
        ),
        { code: "invalid_authority" }
      );
    }
    if (recordsById.has(record.id)) {
      throw Object.assign(
        new Error(`${relativePath} ${authorityName} authority has duplicate id '${record.id}'`),
        { code: duplicateCode }
      );
    }
    recordsById.set(record.id, record);
  }
  return recordsById;
}

function currentProgressRecords(currentProgressWrapper, progressSchema, relativePath) {
  if (
    !isObject(currentProgressWrapper) ||
    Object.keys(currentProgressWrapper).length !== 1 ||
    !Array.isArray(currentProgressWrapper.records)
  ) {
    throw Object.assign(
      new Error(
        `${relativePath} currentProgressWrapper must contain exactly one records array`
      ),
      { code: "invalid_current_progress" }
    );
  }

  for (const [index, record] of currentProgressWrapper.records.entries()) {
    try {
      validateValue(record, progressSchema, `currentProgressWrapper.records[${index}]`);
    } catch (error) {
      throw Object.assign(
        new Error(`${relativePath} current progress validation failed: ${error.message}`),
        { code: "invalid_current_progress" }
      );
    }
  }

  const recordsById = new Map();
  const recordsByTarget = new Map();
  for (const record of currentProgressWrapper.records) {
    if (recordsById.has(record.progressId)) {
      throw Object.assign(
        new Error(
          `${relativePath} current progress has duplicate progressId '${record.progressId}'`
        ),
        { code: "duplicate_current_progress_id" }
      );
    }
    recordsById.set(record.progressId, record);

    const targetKey = stableValueKey([
      record.ownerScope,
      record.ownerId,
      record.snippetId
    ]);
    if (recordsByTarget.has(targetKey)) {
      throw Object.assign(
        new Error(
          `${relativePath} current progress has duplicate owner/snippet target '${record.ownerScope}/${record.ownerId}/${record.snippetId}'`
        ),
        { code: "duplicate_current_progress_target" }
      );
    }
    recordsByTarget.set(targetKey, record);
  }

  return {
    recordsById,
    recordsByTarget
  };
}

function encodeComponents(components) {
  return components.map((component) => `${component.length}_${component}`).join("_");
}

function progressIdentity(snippet, ownerId, relativePath) {
  const snippetParts = snippet.id.split(".");
  const domainParts = snippet.domainId.split(".");
  if (
    snippetParts.length !== 4 ||
    snippetParts[0] !== "knowledge_snippet" ||
    domainParts.length !== 2 ||
    domainParts[0] !== "knowledge_domain" ||
    snippetParts[1] !== domainParts[1]
  ) {
    throw Object.assign(
      new Error(
        `${relativePath} snippet '${snippet.id}' and domain '${snippet.domainId}' cannot produce a progress identity`
      ),
      { code: "invalid_snippet_identity" }
    );
  }

  const snippetToken = encodeComponents([snippetParts[2], snippetParts[3]]);
  const ownerToken = encodeComponents(ownerId.split("."));
  return `knowledge_progress.${domainParts[1]}.${snippetToken}.${ownerToken}`;
}

export function proposeKnowledgeProgressInitialization(input = {}) {
  if (!isObject(input)) {
    return issue(
      "invalid_input",
      "knowledge progress initialization input must be an object"
    );
  }

  const unsupportedFields = Object.keys(input)
    .filter((field) => !INPUT_FIELDS.has(field))
    .sort();
  if (unsupportedFields.length > 0) {
    return issue(
      "unsupported_input_fields",
      `knowledge progress initialization does not accept fields: ${unsupportedFields.join(", ")}`
    );
  }

  const {
    relativePath = "knowledge-progress-initialization-operation",
    initializationMode,
    ownerScope,
    ownerId,
    snippetId,
    updatedSequence,
    notes,
    snippetsWrapper,
    domainRegistryWrapper,
    currentProgressWrapper,
    progressSchema
  } = input;

  if (typeof relativePath !== "string" || relativePath.length === 0) {
    return issue("invalid_relative_path", "relativePath must be a non-empty string");
  }
  if (initializationMode !== "zero_state") {
    return issue(
      "unsupported_initialization_mode",
      `${relativePath} initializationMode must be 'zero_state'`
    );
  }
  if (ownerScope !== "character") {
    return issue(
      "invalid_owner_scope",
      `${relativePath} ownerScope must be explicitly 'character'`
    );
  }
  if (typeof snippetId !== "string" || snippetId.length === 0) {
    return issue("invalid_snippet_id", `${relativePath} snippetId must be a non-empty string`);
  }
  if (!Number.isInteger(updatedSequence) || updatedSequence < 0) {
    return issue(
      "invalid_updated_sequence",
      `${relativePath} updatedSequence must be an explicit non-negative integer`
    );
  }

  try {
    validateProgressSchema(progressSchema);
  } catch (error) {
    return issue("invalid_progress_schema", `${relativePath} ${error.message}`);
  }

  try {
    validateValue(ownerId, progressSchema.properties.ownerId, "ownerId");
  } catch {
    return issue(
      "invalid_owner_id",
      `${relativePath} ownerId must be an explicit value compatible with the progress schema`
    );
  }

  try {
    validateValue(notes, progressSchema.properties.notes, "notes");
  } catch (error) {
    return issue("invalid_notes", `${relativePath} ${error.message}`);
  }

  try {
    const snippetsById = authorityMap(
      snippetsWrapper,
      "knowledge snippets",
      "duplicate_snippet_id",
      relativePath
    );
    const domainsById = authorityMap(
      domainRegistryWrapper,
      "knowledge domain registry",
      "duplicate_domain_id",
      relativePath
    );
    const currentProgress = currentProgressRecords(
      currentProgressWrapper,
      progressSchema,
      relativePath
    );

    const snippet = snippetsById.get(snippetId);
    if (!snippet) {
      return issue(
        "snippet_not_found",
        `${relativePath} snippetId '${snippetId}' must resolve to exactly one authored snippet`
      );
    }

    const domain = domainsById.get(snippet.domainId);
    if (!domain) {
      return issue(
        "domain_not_found",
        `${relativePath} domainId '${snippet.domainId}' must resolve to exactly one domain`
      );
    }
    if (domain.status !== "active") {
      return issue(
        "inactive_domain",
        `${relativePath} domainId '${snippet.domainId}' must reference status 'active', not '${domain.status}'`
      );
    }

    const progressId = progressIdentity(snippet, ownerId, relativePath);
    const targetKey = stableValueKey([ownerScope, ownerId, snippetId]);
    if (currentProgress.recordsById.has(progressId)) {
      return issue(
        "existing_progress_id",
        `${relativePath} progressId '${progressId}' is already initialized`
      );
    }
    if (currentProgress.recordsByTarget.has(targetKey)) {
      return issue(
        "existing_progress_target",
        `${relativePath} owner/snippet target '${ownerScope}/${ownerId}/${snippetId}' is already initialized`
      );
    }

    const initializedProgressRecord = {
      progressId,
      snippetId: snippet.id,
      domainId: snippet.domainId,
      subjectType: snippet.subjectType,
      subjectId: snippet.subjectId,
      ownerScope,
      ownerId,
      progressValue: 0,
      consumedEvidenceIds: [],
      updatedSequence,
      notes: structuredClone(notes)
    };

    validateValue(initializedProgressRecord, progressSchema, "initializedProgressRecord");
    if (
      stableValueKey(Object.keys(initializedProgressRecord)) !==
      stableValueKey(PROGRESS_FIELDS)
    ) {
      return issue(
        "invalid_initialized_record",
        `${relativePath} initialized progress record fields do not match the current schema`
      );
    }

    return result(initializedProgressRecord);
  } catch (error) {
    return issue(error.code ?? "invalid_initialization", error.message);
  }
}
