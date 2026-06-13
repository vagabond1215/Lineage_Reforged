import { validateKnowledgeEvidence } from "./knowledge-evidence.mjs";
import { validateKnowledgeProgress } from "./knowledge-progress.mjs";

const INPUT_FIELDS = new Set([
  "relativePath",
  "targetProgressId",
  "currentProgressWrapper",
  "currentAcceptedEvidenceWrapper",
  "proposal",
  "progressSchema",
  "evidenceSchema",
  "snippetsWrapper",
  "domainRegistryWrapper",
  "regionsWrapper",
  "settlementsWrapper"
]);

const PROPOSAL_FIELDS = [
  "acceptedEvidenceIds",
  "rejectedEvidence",
  "proposedProgressRecord",
  "deltaTotal",
  "appliedDeltas",
  "issues",
  "safety"
];

const PROPOSAL_SAFETY_FIELDS = [
  "noMutation",
  "noPersistence",
  "noCompletion",
  "noTrialUnlock",
  "noUiOutput"
];

const PARITY_FIELDS = [
  "ownerScope",
  "ownerId",
  "snippetId",
  "domainId",
  "subjectType",
  "subjectId"
];

const SAFETY_FLAGS = Object.freeze({
  noMutation: true,
  noPersistence: true,
  noEvidenceAcceptance: true,
  noProgressInitialization: true,
  noCompletion: true,
  noTrialUnlock: true,
  noUiOutput: true,
  noRuntimeEffect: true,
  noGeneratedOutput: true
});

const FORBIDDEN_NOTE_CLAIMS = [
  /\b(?:progress|record|state)\s+(?:was\s+)?persisted\b/i,
  /\b(?:progress|snippet|domain)\s+(?:was\s+)?completed\b/i,
  /\btrial\s+(?:is\s+)?(?:ready|unlocked)\b/i,
  /\bui\s+(?:was\s+)?(?:revealed|updated)\b/i,
  /\breward\s+(?:was\s+)?(?:granted|awarded)\b/i,
  /\bevent\s+(?:was\s+)?(?:emitted|dispatched)\b/i,
  /\bruntime\s+(?:was\s+)?(?:mutated|updated)\b/i,
  /\bgenerated output\s+(?:was\s+)?(?:created|updated)\b/i
];

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

function sameValue(left, right) {
  return stableValueKey(left) === stableValueKey(right);
}

function result({
  decision = "rejected",
  appliedProgressRecord = null,
  rejectedApplication = null,
  consumedEvidenceIdsApplied = [],
  issues = []
} = {}) {
  return {
    decision,
    appliedProgressRecord,
    rejectedApplication,
    consumedEvidenceIdsApplied,
    issues,
    safety: { ...SAFETY_FLAGS }
  };
}

function issue(code, message) {
  return result({
    issues: [{ code, message }]
  });
}

function reject(targetProgressId, code, reason) {
  return result({
    rejectedApplication: {
      targetProgressId:
        typeof targetProgressId === "string" && targetProgressId.length > 0
          ? targetProgressId
          : null,
      code,
      reason
    }
  });
}

function compareIds(left, right) {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function exactObjectFields(value, expectedFields) {
  return (
    isObject(value) &&
    sameValue(Object.keys(value).sort(), [...expectedFields].sort())
  );
}

function validateProposalShape(proposal, relativePath) {
  if (!exactObjectFields(proposal, PROPOSAL_FIELDS)) {
    return issue(
      "invalid_proposal",
      `${relativePath} proposal must contain exactly: ${PROPOSAL_FIELDS.join(", ")}`
    );
  }

  if (
    !Array.isArray(proposal.acceptedEvidenceIds) ||
    proposal.acceptedEvidenceIds.some(
      (evidenceId) => typeof evidenceId !== "string" || evidenceId.length === 0
    )
  ) {
    return issue(
      "invalid_proposal",
      `${relativePath} proposal.acceptedEvidenceIds must be an array of non-empty strings`
    );
  }
  if (!Array.isArray(proposal.rejectedEvidence)) {
    return issue(
      "invalid_proposal",
      `${relativePath} proposal.rejectedEvidence must be an array`
    );
  }
  if (!isObject(proposal.proposedProgressRecord)) {
    return issue(
      "invalid_proposal",
      `${relativePath} proposal.proposedProgressRecord must be an object`
    );
  }
  if (!Array.isArray(proposal.appliedDeltas)) {
    return issue(
      "invalid_proposal",
      `${relativePath} proposal.appliedDeltas must be an array`
    );
  }
  if (!Array.isArray(proposal.issues)) {
    return issue(
      "invalid_proposal",
      `${relativePath} proposal.issues must be an array`
    );
  }
  if (!exactObjectFields(proposal.safety, PROPOSAL_SAFETY_FIELDS)) {
    return issue(
      "invalid_proposal",
      `${relativePath} proposal.safety must contain exactly: ${PROPOSAL_SAFETY_FIELDS.join(", ")}`
    );
  }
  if (
    PROPOSAL_SAFETY_FIELDS.some(
      (field) => typeof proposal.safety[field] !== "boolean"
    )
  ) {
    return issue(
      "invalid_proposal",
      `${relativePath} proposal safety flags must be booleans`
    );
  }

  return null;
}

function forbiddenNoteClaim(notes) {
  return notes.find((note) =>
    FORBIDDEN_NOTE_CLAIMS.some((pattern) => pattern.test(note))
  );
}

function validateProgressWrapper({
  relativePath,
  wrapper,
  progressSchema,
  evidenceSchema,
  snippetsWrapper,
  domainRegistryWrapper,
  evidenceWrapper,
  regionsWrapper,
  settlementsWrapper
}) {
  return validateKnowledgeProgress({
    relativePath,
    wrapper,
    progressSchema,
    evidenceSchema,
    snippetsWrapper,
    domainRegistryWrapper,
    evidenceWrapper,
    evidenceAuthorities: {
      regionsWrapper,
      settlementsWrapper
    },
    allowZeroStateRecords: true
  });
}

export function proposeKnowledgeProgressApplication(input = {}) {
  if (!isObject(input)) {
    return issue(
      "invalid_invocation",
      "knowledge progress application input must be an object"
    );
  }

  const unsupportedFields = Object.keys(input)
    .filter((field) => !INPUT_FIELDS.has(field))
    .sort();
  if (unsupportedFields.length > 0) {
    return issue(
      "unsupported_input_fields",
      `knowledge progress application does not accept fields: ${unsupportedFields.join(", ")}`
    );
  }

  const {
    relativePath = "knowledge-progress-application-operation",
    targetProgressId,
    currentProgressWrapper,
    currentAcceptedEvidenceWrapper,
    proposal,
    progressSchema,
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
  if (currentProgressWrapper === undefined) {
    return issue(
      "missing_current_progress",
      `${relativePath} currentProgressWrapper is required`
    );
  }
  if (typeof targetProgressId !== "string" || targetProgressId.length === 0) {
    return issue(
      "invalid_target_progress_id",
      `${relativePath} targetProgressId must be a non-empty string`
    );
  }
  if (proposal === undefined) {
    return issue("missing_proposal", `${relativePath} proposal is required`);
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
    return issue("invalid_current_accepted_evidence", error.message);
  }

  try {
    validateProgressWrapper({
      relativePath: `${relativePath} current progress`,
      wrapper: currentProgressWrapper,
      progressSchema,
      evidenceSchema,
      snippetsWrapper,
      domainRegistryWrapper,
      evidenceWrapper: currentAcceptedEvidenceWrapper,
      regionsWrapper,
      settlementsWrapper
    });
  } catch (error) {
    return issue("invalid_current_progress", error.message);
  }

  const proposalShapeIssue = validateProposalShape(proposal, relativePath);
  if (proposalShapeIssue) {
    return proposalShapeIssue;
  }

  const targetRecords = currentProgressWrapper.records.filter(
    (record) => record.progressId === targetProgressId
  );
  if (targetRecords.length !== 1) {
    return reject(
      targetProgressId,
      "target_progress_not_found",
      `${relativePath} targetProgressId '${targetProgressId}' must resolve to exactly one current progress record`
    );
  }
  const currentProgressRecord = targetRecords[0];

  if (proposal.issues.length > 0) {
    return reject(
      targetProgressId,
      "proposal_has_issues",
      `${relativePath} proposal.issues must be empty before application`
    );
  }

  if (PROPOSAL_SAFETY_FIELDS.some((field) => proposal.safety[field] !== true)) {
    return reject(
      targetProgressId,
      "proposal_safety_violation",
      `${relativePath} proposal must retain every inert safety flag as true`
    );
  }

  const acceptedEvidenceIds = proposal.acceptedEvidenceIds;
  if (acceptedEvidenceIds.length === 0) {
    return reject(
      targetProgressId,
      "empty_accepted_evidence_ids",
      `${relativePath} proposal must apply at least one accepted evidence id`
    );
  }

  if (new Set(acceptedEvidenceIds).size !== acceptedEvidenceIds.length) {
    return reject(
      targetProgressId,
      "duplicate_accepted_evidence_ids",
      `${relativePath} proposal.acceptedEvidenceIds must be unique`
    );
  }

  if (!sameValue(acceptedEvidenceIds, [...acceptedEvidenceIds].sort(compareIds))) {
    return reject(
      targetProgressId,
      "accepted_evidence_ids_not_sorted",
      `${relativePath} proposal.acceptedEvidenceIds must be in deterministic ascending order`
    );
  }

  if (!Number.isInteger(proposal.deltaTotal) || proposal.deltaTotal <= 0) {
    return reject(
      targetProgressId,
      "invalid_delta_total",
      `${relativePath} proposal.deltaTotal must be a positive integer`
    );
  }
  if (proposal.deltaTotal !== acceptedEvidenceIds.length) {
    return reject(
      targetProgressId,
      "delta_total_mismatch",
      `${relativePath} proposal.deltaTotal must equal acceptedEvidenceIds length`
    );
  }

  const expectedDeltas = acceptedEvidenceIds.map((evidenceId) => ({
    evidenceId,
    targetProgressId,
    delta: 1
  }));
  if (!sameValue(proposal.appliedDeltas, expectedDeltas)) {
    return reject(
      targetProgressId,
      "applied_deltas_mismatch",
      `${relativePath} proposal.appliedDeltas must contain exactly one +1 entry per accepted evidence id and target`
    );
  }

  const targetConsumedIds = new Set(currentProgressRecord.consumedEvidenceIds);
  const alreadyConsumedByTarget = acceptedEvidenceIds.find((evidenceId) =>
    targetConsumedIds.has(evidenceId)
  );
  if (alreadyConsumedByTarget !== undefined) {
    return reject(
      targetProgressId,
      "evidence_already_consumed_by_target",
      `${relativePath} evidenceId '${alreadyConsumedByTarget}' is already consumed by the target progress record`
    );
  }

  const otherConsumerByEvidenceId = new Map();
  for (const record of currentProgressWrapper.records) {
    if (record.progressId === targetProgressId) {
      continue;
    }
    for (const evidenceId of record.consumedEvidenceIds) {
      otherConsumerByEvidenceId.set(evidenceId, record.progressId);
    }
  }
  const consumedByOther = acceptedEvidenceIds.find((evidenceId) =>
    otherConsumerByEvidenceId.has(evidenceId)
  );
  if (consumedByOther !== undefined) {
    return reject(
      targetProgressId,
      "evidence_consumed_by_other_progress",
      `${relativePath} evidenceId '${consumedByOther}' is already consumed by progressId '${otherConsumerByEvidenceId.get(consumedByOther)}'`
    );
  }

  const acceptedEvidenceById = new Map(
    currentAcceptedEvidenceWrapper.records.map((record) => [
      record.evidenceId,
      record
    ])
  );
  const unresolvedAcceptedId = acceptedEvidenceIds.find(
    (evidenceId) => !acceptedEvidenceById.has(evidenceId)
  );
  if (unresolvedAcceptedId !== undefined) {
    return reject(
      targetProgressId,
      "accepted_evidence_not_found",
      `${relativePath} evidenceId '${unresolvedAcceptedId}' is not present in current accepted evidence`
    );
  }

  const proposedProgressRecord = proposal.proposedProgressRecord;
  if (proposedProgressRecord.progressId !== currentProgressRecord.progressId) {
    return reject(
      targetProgressId,
      "progress_id_mismatch",
      `${relativePath} proposed progressId must equal the current target progressId`
    );
  }

  const mismatchedProposalFields = PARITY_FIELDS.filter(
    (field) => proposedProgressRecord[field] !== currentProgressRecord[field]
  );
  if (mismatchedProposalFields.length > 0) {
    return reject(
      targetProgressId,
      "proposal_target_mismatch",
      `${relativePath} proposed progress target differs from current progress fields: ${mismatchedProposalFields.join(", ")}`
    );
  }

  for (const evidenceId of acceptedEvidenceIds) {
    const evidence = acceptedEvidenceById.get(evidenceId);
    const mismatchedEvidenceFields = PARITY_FIELDS.filter(
      (field) => evidence[field] !== currentProgressRecord[field]
    );
    if (mismatchedEvidenceFields.length > 0) {
      return reject(
        targetProgressId,
        "accepted_evidence_target_mismatch",
        `${relativePath} evidenceId '${evidenceId}' differs from current progress fields: ${mismatchedEvidenceFields.join(", ")}`
      );
    }
  }

  const expectedProgressValue =
    currentProgressRecord.progressValue + proposal.deltaTotal;
  if (proposedProgressRecord.progressValue !== expectedProgressValue) {
    return reject(
      targetProgressId,
      "progress_value_mismatch",
      `${relativePath} proposed progressValue must equal current progressValue plus deltaTotal`
    );
  }

  const expectedConsumedEvidenceIds = [
    ...currentProgressRecord.consumedEvidenceIds,
    ...acceptedEvidenceIds
  ];
  if (
    !sameValue(
      proposedProgressRecord.consumedEvidenceIds,
      expectedConsumedEvidenceIds
    )
  ) {
    return reject(
      targetProgressId,
      "consumed_evidence_ids_mismatch",
      `${relativePath} proposed consumedEvidenceIds must preserve current ids and append accepted ids exactly`
    );
  }

  if (
    !Number.isInteger(proposedProgressRecord.updatedSequence) ||
    proposedProgressRecord.updatedSequence < 0 ||
    proposedProgressRecord.updatedSequence <= currentProgressRecord.updatedSequence
  ) {
    return reject(
      targetProgressId,
      "updated_sequence_not_monotonic",
      `${relativePath} proposed updatedSequence must be a non-negative integer strictly greater than current updatedSequence`
    );
  }

  if (!sameValue(proposedProgressRecord.notes, currentProgressRecord.notes)) {
    return reject(
      targetProgressId,
      "notes_mismatch",
      `${relativePath} proposed notes must equal current progress notes exactly`
    );
  }
  const unsupportedNote = forbiddenNoteClaim(proposedProgressRecord.notes);
  if (unsupportedNote !== undefined) {
    return reject(
      targetProgressId,
      "unsupported_note_claim",
      `${relativePath} proposed notes contain an unsupported application claim: ${JSON.stringify(unsupportedNote)}`
    );
  }

  const appliedProgressRecord = structuredClone(proposedProgressRecord);
  const replacementWrapper = {
    records: currentProgressWrapper.records.map((record) =>
      record.progressId === targetProgressId
        ? structuredClone(appliedProgressRecord)
        : structuredClone(record)
    )
  };

  try {
    validateProgressWrapper({
      relativePath: `${relativePath} applied progress`,
      wrapper: replacementWrapper,
      progressSchema,
      evidenceSchema,
      snippetsWrapper,
      domainRegistryWrapper,
      evidenceWrapper: currentAcceptedEvidenceWrapper,
      regionsWrapper,
      settlementsWrapper
    });
  } catch (error) {
    return issue("invalid_applied_progress", error.message);
  }

  return result({
    decision: "applied",
    appliedProgressRecord,
    consumedEvidenceIdsApplied: structuredClone(acceptedEvidenceIds)
  });
}
