import { validateKnowledgeEvidence } from "./knowledge-evidence.mjs";
import { validateKnowledgeProgress } from "./knowledge-progress.mjs";

const SAFETY_FLAGS = Object.freeze({
  noMutation: true,
  noPersistence: true,
  noCompletion: true,
  noTrialUnlock: true,
  noUiOutput: true
});

const PARITY_FIELDS = [
  "ownerScope",
  "ownerId",
  "snippetId",
  "domainId",
  "subjectType",
  "subjectId"
];

function clone(value) {
  return structuredClone(value);
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

function baseEnvelope(proposedProgressRecord = null) {
  return {
    acceptedEvidenceIds: [],
    rejectedEvidence: [],
    proposedProgressRecord,
    deltaTotal: 0,
    appliedDeltas: [],
    issues: [],
    safety: { ...SAFETY_FLAGS }
  };
}

function issueEnvelope(code, message, proposedProgressRecord = null) {
  const envelope = baseEnvelope(proposedProgressRecord);
  envelope.issues.push({ code, message });
  return envelope;
}

function reject(evidenceId, code, reason) {
  return { evidenceId, code, reason };
}

function validateInputs({
  relativePath,
  progressWrapper,
  evidenceWrapper,
  progressAuthorities,
  evidenceAuthorities
}) {
  const progressSchema = progressAuthorities?.progressSchema;
  const evidenceSchema = evidenceAuthorities?.evidenceSchema;
  const snippetsWrapper = evidenceAuthorities?.snippetsWrapper;
  const domainRegistryWrapper = evidenceAuthorities?.domainRegistryWrapper;
  const regionsWrapper = evidenceAuthorities?.regionsWrapper;
  const settlementsWrapper = evidenceAuthorities?.settlementsWrapper;

  validateKnowledgeProgress({
    relativePath: `${relativePath} progress`,
    wrapper: progressWrapper,
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
}

function consumedByOtherProgress(progressWrapper, targetProgressId) {
  const consumers = new Map();

  for (const progressRecord of progressWrapper.records) {
    if (progressRecord.progressId === targetProgressId) {
      continue;
    }
    for (const evidenceId of progressRecord.consumedEvidenceIds) {
      consumers.set(evidenceId, progressRecord.progressId);
    }
  }

  return consumers;
}

function parityRejection(evidence, targetProgress) {
  if (evidence.ownerScope !== "character" || targetProgress.ownerScope !== "character") {
    return reject(
      evidence.evidenceId,
      "owner_scope_not_character",
      "evidence and target progress ownerScope must both be character"
    );
  }

  const mismatchedFields = PARITY_FIELDS.filter(
    (field) => evidence[field] !== targetProgress[field]
  );
  if (mismatchedFields.length > 0) {
    return {
      ...reject(
        evidence.evidenceId,
        "target_mismatch",
        `evidence does not match target progress fields: ${mismatchedFields.join(", ")}`
      ),
      mismatchedFields
    };
  }

  return null;
}

export function proposeKnowledgeProgressFromEvidence({
  relativePath = "knowledge-evidence-to-progress-operation",
  targetProgressId,
  candidateEvidenceIds,
  progressWrapper,
  evidenceWrapper,
  progressAuthorities,
  evidenceAuthorities
}) {
  try {
    validateInputs({
      relativePath,
      progressWrapper,
      evidenceWrapper,
      progressAuthorities,
      evidenceAuthorities
    });
  } catch (error) {
    return issueEnvelope("invalid_input", error.message);
  }

  if (typeof targetProgressId !== "string" || targetProgressId.length === 0) {
    return issueEnvelope(
      "invalid_target_progress_id",
      `${relativePath} targetProgressId must be a non-empty string`
    );
  }

  if (
    !Array.isArray(candidateEvidenceIds) ||
    candidateEvidenceIds.some(
      (evidenceId) => typeof evidenceId !== "string" || evidenceId.length === 0
    )
  ) {
    return issueEnvelope(
      "invalid_candidate_evidence_ids",
      `${relativePath} candidateEvidenceIds must be an array of non-empty strings`
    );
  }

  const targetProgressRecords = progressWrapper.records.filter(
    (record) => record.progressId === targetProgressId
  );
  if (targetProgressRecords.length !== 1) {
    return issueEnvelope(
      "target_progress_not_found",
      `${relativePath} targetProgressId "${targetProgressId}" must resolve to exactly one existing progress record`
    );
  }

  const targetProgress = targetProgressRecords[0];
  const envelope = baseEnvelope(clone(targetProgress));
  const evidenceById = new Map(
    evidenceWrapper.records.map((record) => [record.evidenceId, record])
  );
  const targetConsumedIds = new Set(targetProgress.consumedEvidenceIds);
  const otherConsumers = consumedByOtherProgress(progressWrapper, targetProgressId);
  const evaluatedCandidateIds = new Set();
  const acceptedEvidence = [];
  const sortedCandidateIds = [...candidateEvidenceIds].sort(compareIds);

  for (const evidenceId of sortedCandidateIds) {
    if (evaluatedCandidateIds.has(evidenceId)) {
      envelope.rejectedEvidence.push(
        reject(
          evidenceId,
          "duplicate_candidate",
          "evidenceId appears more than once in candidateEvidenceIds"
        )
      );
      continue;
    }
    evaluatedCandidateIds.add(evidenceId);

    const evidence = evidenceById.get(evidenceId);
    if (!evidence) {
      envelope.rejectedEvidence.push(
        reject(
          evidenceId,
          "unresolved_evidence",
          "evidenceId is not present in the validated evidence wrapper"
        )
      );
      continue;
    }

    if (targetConsumedIds.has(evidenceId)) {
      envelope.rejectedEvidence.push(
        reject(
          evidenceId,
          "already_consumed_by_target",
          "evidenceId is already present in the target progress record"
        )
      );
      continue;
    }

    const otherProgressId = otherConsumers.get(evidenceId);
    if (otherProgressId !== undefined) {
      envelope.rejectedEvidence.push(
        reject(
          evidenceId,
          "consumed_by_other_progress",
          `evidenceId is already consumed by progressId "${otherProgressId}"`
        )
      );
      continue;
    }

    const mismatch = parityRejection(evidence, targetProgress);
    if (mismatch) {
      envelope.rejectedEvidence.push(mismatch);
      continue;
    }

    envelope.acceptedEvidenceIds.push(evidenceId);
    envelope.appliedDeltas.push({
      evidenceId,
      targetProgressId,
      delta: 1
    });
    acceptedEvidence.push(evidence);
  }

  envelope.deltaTotal = acceptedEvidence.length;

  if (acceptedEvidence.length > 0) {
    const maximumSequence = Math.max(
      targetProgress.updatedSequence,
      ...acceptedEvidence.map((evidence) => evidence.acquiredSequence)
    );

    envelope.proposedProgressRecord = {
      ...clone(targetProgress),
      progressValue: targetProgress.progressValue + envelope.deltaTotal,
      consumedEvidenceIds: [
        ...targetProgress.consumedEvidenceIds,
        ...envelope.acceptedEvidenceIds
      ],
      updatedSequence: maximumSequence + 1
    };
  }

  return envelope;
}
