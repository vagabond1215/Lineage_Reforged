import { validateKnowledgeEvidence } from "./knowledge-evidence.mjs";

const INPUT_FIELDS = new Set([
  "relativePath",
  "ownerScope",
  "ownerId",
  "snippetId",
  "occurrenceId",
  "sourceId",
  "acquisitionContext",
  "acquiredSequence",
  "snippetsWrapper",
  "domainRegistryWrapper",
  "evidenceSchema",
  "evidenceAuthorities"
]);

const SOURCE_CONTEXT_TYPES = new Map([
  ["field_identification", "field_observation"],
  ["travel_observation", "travel_observation"]
]);

const OCCURRENCE_ID_PATTERN =
  /^knowledge_occurrence\.(field_observation|travel_observation)\.([a-z0-9]+(?:_[a-z0-9]+)*)$/;

const SAFETY_FLAGS = Object.freeze({
  candidateOnly: true,
  noMutation: true,
  noPersistence: true,
  noProgressMutation: true,
  noProgressProposal: true,
  noCompletion: true,
  noTrialUnlock: true,
  noEvents: true,
  noUiOutput: true,
  noGeneratedOutput: true
});

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function result(candidateEvidence = null, issues = []) {
  return {
    candidateEvidence,
    issues,
    safety: { ...SAFETY_FLAGS }
  };
}

function issue(code, message) {
  return result(null, [{ code, message }]);
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

function matchesSchemaPattern(value, propertyName, evidenceSchema) {
  const pattern = evidenceSchema?.properties?.[propertyName]?.pattern;
  return typeof pattern === "string" && new RegExp(pattern).test(value);
}

function matchingSource(snippet, acquisitionContext, relativePath) {
  if (!Array.isArray(snippet.discoverySources)) {
    throw Object.assign(
      new Error(
        `${relativePath} snippet '${snippet.id}' must provide discoverySources`
      ),
      { code: "invalid_snippet_authority" }
    );
  }

  const matches = snippet.discoverySources.filter((source) => {
    const contextType = SOURCE_CONTEXT_TYPES.get(source?.sourceType);
    return (
      contextType !== undefined &&
      contextType === acquisitionContext.contextType &&
      (source.sourceId === undefined || source.sourceId === null)
    );
  });

  if (matches.length !== 1) {
    throw Object.assign(
      new Error(
        `${relativePath} snippet '${snippet.id}' must declare exactly one supported source for acquisitionContext.contextType '${acquisitionContext.contextType}'`
      ),
      { code: "unsupported_source_context" }
    );
  }

  return matches[0];
}

function assertLocationScope(source, acquisitionContext, relativePath, snippetId) {
  const locationScope = source.locationScope;
  if (!isObject(locationScope)) {
    return;
  }

  for (const field of ["continentId", "regionId", "settlementId"]) {
    const requiredValue = locationScope[field];
    if (
      requiredValue !== undefined &&
      requiredValue !== null &&
      acquisitionContext[field] !== requiredValue
    ) {
      throw Object.assign(
        new Error(
          `${relativePath} acquisitionContext.${field} must equal '${requiredValue}' for snippet '${snippetId}'`
        ),
        { code: "source_location_mismatch" }
      );
    }
  }

  if (Array.isArray(locationScope.biomeTags) && locationScope.biomeTags.length > 0) {
    const suppliedTags = new Set(acquisitionContext.biomeTags ?? []);
    const missingTags = locationScope.biomeTags.filter((tag) => !suppliedTags.has(tag));
    if (missingTags.length > 0) {
      throw Object.assign(
        new Error(
          `${relativePath} acquisitionContext.biomeTags is missing required tags: ${missingTags.join(", ")}`
        ),
        { code: "source_location_mismatch" }
      );
    }
  }
}

function evidenceIdFor(snippet, occurrenceMatch, relativePath) {
  const snippetParts = snippet.id.split(".");
  if (snippetParts.length !== 4 || snippetParts[0] !== "knowledge_snippet") {
    throw Object.assign(
      new Error(
        `${relativePath} snippet id '${snippet.id}' cannot produce a knowledge evidence identity`
      ),
      { code: "invalid_snippet_identity" }
    );
  }

  const [, domainToken, subjectToken, categoryToken] = snippetParts;
  const [, occurrenceKind, occurrenceToken] = occurrenceMatch;
  return `knowledge_evidence.${domainToken}.${subjectToken}.${categoryToken}_${occurrenceKind}_${occurrenceToken}`;
}

export function proposeKnowledgeObservationEvidence(input = {}) {
  if (!isObject(input)) {
    return issue(
      "invalid_input",
      "knowledge observation evidence producer input must be an object"
    );
  }

  const unsupportedFields = Object.keys(input)
    .filter((field) => !INPUT_FIELDS.has(field))
    .sort();
  if (unsupportedFields.length > 0) {
    return issue(
      "unsupported_input_fields",
      `knowledge observation evidence producer does not accept fields: ${unsupportedFields.join(", ")}`
    );
  }

  const {
    relativePath = "knowledge-observation-evidence-operation",
    ownerScope = "character",
    ownerId,
    snippetId,
    occurrenceId,
    sourceId = null,
    acquisitionContext,
    acquiredSequence,
    snippetsWrapper,
    domainRegistryWrapper,
    evidenceSchema,
    evidenceAuthorities
  } = input;

  if (typeof relativePath !== "string" || relativePath.length === 0) {
    return issue("invalid_relative_path", "relativePath must be a non-empty string");
  }
  if (ownerScope !== "character") {
    return issue(
      "invalid_owner_scope",
      `${relativePath} ownerScope must remain 'character'`
    );
  }
  if (
    typeof ownerId !== "string" ||
    ownerId.length === 0 ||
    !matchesSchemaPattern(ownerId, "ownerId", evidenceSchema)
  ) {
    return issue(
      "invalid_owner_id",
      `${relativePath} ownerId must be an explicit value compatible with the evidence schema`
    );
  }
  if (typeof snippetId !== "string" || snippetId.length === 0) {
    return issue("invalid_snippet_id", `${relativePath} snippetId must be a non-empty string`);
  }
  if (sourceId !== null) {
    return issue("invalid_source_id", `${relativePath} sourceId must remain null`);
  }
  if (!isObject(acquisitionContext)) {
    return issue(
      "invalid_acquisition_context",
      `${relativePath} acquisitionContext must be an object`
    );
  }
  if (!Number.isInteger(acquiredSequence) || acquiredSequence < 0) {
    return issue(
      "invalid_acquired_sequence",
      `${relativePath} acquiredSequence must be an explicit non-negative integer`
    );
  }

  const occurrenceMatch =
    typeof occurrenceId === "string" ? OCCURRENCE_ID_PATTERN.exec(occurrenceId) : null;
  if (!occurrenceMatch) {
    return issue(
      "invalid_occurrence_id",
      `${relativePath} occurrenceId must match knowledge_occurrence.(field_observation|travel_observation).<stable_token>`
    );
  }
  if (occurrenceMatch[1] !== acquisitionContext.contextType) {
    return issue(
      "occurrence_context_mismatch",
      `${relativePath} occurrenceId kind '${occurrenceMatch[1]}' must match acquisitionContext.contextType '${acquisitionContext.contextType}'`
    );
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

    const source = matchingSource(snippet, acquisitionContext, relativePath);
    assertLocationScope(source, acquisitionContext, relativePath, snippet.id);

    const candidateEvidence = {
      evidenceId: evidenceIdFor(snippet, occurrenceMatch, relativePath),
      snippetId: snippet.id,
      domainId: snippet.domainId,
      subjectType: snippet.subjectType,
      subjectId: snippet.subjectId,
      ownerScope: "character",
      ownerId,
      sourceType: source.sourceType,
      sourceId: null,
      acquisitionContext: structuredClone(acquisitionContext),
      acquiredSequence,
      notes: [
        `Proposed ${acquisitionContext.contextType} Knowledge evidence candidate.`
      ]
    };

    validateKnowledgeEvidence({
      relativePath: `${relativePath} candidate`,
      wrapper: {
        records: [candidateEvidence]
      },
      evidenceSchema,
      snippetsWrapper,
      domainRegistryWrapper,
      regionsWrapper: evidenceAuthorities?.regionsWrapper,
      settlementsWrapper: evidenceAuthorities?.settlementsWrapper
    });

    return result(candidateEvidence);
  } catch (error) {
    return issue(
      error.code ?? "invalid_candidate",
      error.message
    );
  }
}
