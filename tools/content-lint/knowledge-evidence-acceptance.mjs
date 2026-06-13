import { validateKnowledgeEvidence } from "./knowledge-evidence.mjs";

const INPUT_FIELDS = new Set([
  "relativePath",
  "candidateEvidence",
  "currentAcceptedEvidenceWrapper",
  "evidenceSchema",
  "snippetsWrapper",
  "domainRegistryWrapper",
  "regionsWrapper",
  "settlementsWrapper"
]);

const SAFETY_FLAGS = Object.freeze({
  noMutation: true,
  noPersistence: true,
  noProgressInitialization: true,
  noProgressProposal: true,
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

function result({
  decision = "rejected",
  acceptedEvidenceRecord = null,
  rejectedCandidate = null,
  acceptedEvidenceIds = [],
  issues = []
} = {}) {
  return {
    decision,
    acceptedEvidenceRecord,
    rejectedCandidate,
    acceptedEvidenceIds,
    issues,
    safety: { ...SAFETY_FLAGS }
  };
}

function issue(code, message) {
  return result({
    issues: [{ code, message }]
  });
}

export function proposeKnowledgeEvidenceAcceptance(input = {}) {
  if (!isObject(input)) {
    return issue(
      "invalid_invocation",
      "knowledge evidence acceptance input must be an object"
    );
  }

  const unsupportedFields = Object.keys(input)
    .filter((field) => !INPUT_FIELDS.has(field))
    .sort();
  if (unsupportedFields.length > 0) {
    return issue(
      "unsupported_input_fields",
      `knowledge evidence acceptance does not accept fields: ${unsupportedFields.join(", ")}`
    );
  }

  const {
    relativePath = "knowledge-evidence-acceptance-operation",
    candidateEvidence,
    currentAcceptedEvidenceWrapper,
    evidenceSchema,
    snippetsWrapper,
    domainRegistryWrapper,
    regionsWrapper,
    settlementsWrapper
  } = input;

  if (typeof relativePath !== "string" || relativePath.length === 0) {
    return issue("invalid_relative_path", "relativePath must be a non-empty string");
  }

  if (currentAcceptedEvidenceWrapper === undefined) {
    return issue(
      "missing_current_accepted_evidence",
      `${relativePath} currentAcceptedEvidenceWrapper is required`
    );
  }

  try {
    validateKnowledgeEvidence({
      relativePath: `${relativePath} current accepted evidence`,
      wrapper: currentAcceptedEvidenceWrapper,
      evidenceSchema,
      snippetsWrapper,
      domainRegistryWrapper,
      regionsWrapper,
      settlementsWrapper,
      allowEmptyRecords: true
    });
  } catch (error) {
    return issue(
      "invalid_current_accepted_evidence",
      error.message
    );
  }

  if (candidateEvidence === undefined) {
    return issue(
      "missing_candidate_evidence",
      `${relativePath} candidateEvidence is required`
    );
  }
  if (!isObject(candidateEvidence) || Array.isArray(candidateEvidence.records)) {
    return issue(
      "invalid_candidate_evidence",
      `${relativePath} candidateEvidence must be one plain evidence record, not a wrapper or array`
    );
  }

  try {
    validateKnowledgeEvidence({
      relativePath: `${relativePath} candidate evidence`,
      wrapper: {
        records: [candidateEvidence]
      },
      evidenceSchema,
      snippetsWrapper,
      domainRegistryWrapper,
      regionsWrapper,
      settlementsWrapper
    });
  } catch (error) {
    return issue(
      "invalid_candidate_evidence",
      error.message
    );
  }

  if (
    currentAcceptedEvidenceWrapper.records.some(
      (record) => record.evidenceId === candidateEvidence.evidenceId
    )
  ) {
    return result({
      rejectedCandidate: {
        evidenceId: candidateEvidence.evidenceId,
        code: "duplicate_evidence_id",
        reason: `evidenceId '${candidateEvidence.evidenceId}' is already present in current accepted evidence`
      }
    });
  }

  return result({
    decision: "accepted",
    acceptedEvidenceRecord: structuredClone(candidateEvidence),
    acceptedEvidenceIds: [candidateEvidence.evidenceId]
  });
}
