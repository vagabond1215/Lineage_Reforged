import type {
  NormalDefeatReceiptState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";
import { serializeSnapshot } from "../../../shared/persistence/src/index.js";
import {
  createAuthorityId,
  isTargetCampaignSnapshot
} from "./campaign-rules.js";
import {
  applyValidatedPendingNormalDefeatRecovery,
  hasPendingNormalDefeat,
  resolvePendingNormalDefeatRecoveryDestination,
  resolvePendingNormalDefeatRecoveryDestinationWithSource,
  resolveNormalDefeat,
  validateCompletedNormalDefeatRecoveryProvenance,
  validatePendingNormalDefeatRecoveryProvenance
} from "./normal-defeat.js";

export type CampaignSessionPosture =
  | "at_head"
  | "non_head_unmutated"
  | "forked_unpublished"
  | "head_unpublished";

export interface CampaignSessionControl {
  accountId: string;
  campaignId: string;
  loadedArtifactId: string;
  loadedPublicationId: string;
  loadedHeadRevision: number;
  loadedContinuityId: string;
  campaignHeadArtifactId: string;
  campaignHeadRevision: number;
  sessionRevision: number;
  posture: CampaignSessionPosture;
  pendingContinuityId: string | null;
  firstDivergentMutationId: string | null;
  lastAcceptedMutationId: string | null;
  acceptedMutationIds: string[];
  retainedMutationResults: RetainedCampaignMutationResult[];
  hasUnpublishedGameplayState: boolean;
}

export type CampaignMutationOwnerKind =
  | "engine_result"
  | "legacy_bridge"
  | "persisted_preference"
  | "recovery_repair";

export interface RetainedCampaignMutationResult {
  mutationId: string;
  submissionFingerprint: string;
  resultId: string | null;
  snapshot: SaveSnapshot;
  sessionRevision: number;
  posture: CampaignSessionPosture;
  pendingContinuityId: string | null;
  firstDivergentMutationId: string | null;
  lastAcceptedMutationId: string | null;
  acceptedMutationIds: string[];
  hasUnpublishedGameplayState: boolean;
}

export interface CampaignMutationSubmission {
  mutationId: string;
  sourceArtifactId: string;
  sourceRevision: number;
  ownerKind: CampaignMutationOwnerKind;
  accepted: boolean;
  sourceSnapshot: SaveSnapshot;
  proposedSnapshot: SaveSnapshot;
  resultId?: string;
  explicitRecoveryDestinationId?: string | null;
}

export type CampaignMutationAdmission = {
  accepted: boolean;
  duplicate: boolean;
  reason:
    | "accepted"
    | "rejected"
    | "no_change"
    | "duplicate"
    | "recovery_pending"
    | "stale_revision"
    | "wrong_artifact";
  snapshot: SaveSnapshot;
  control: CampaignSessionControl;
  resultId: string | null;
};

export type PlayerSurveyCampaignPreparation =
  | {
      accepted: false;
      reason:
        | "wrong_account"
        | "wrong_campaign"
        | "wrong_artifact"
        | "wrong_publication"
        | "stale_revision"
        | "wrong_continuity"
        | "recovery_pending"
        | "invalid_authority";
      sourceSnapshot: SaveSnapshot;
      control: CampaignSessionControl;
    }
  | {
      accepted: true;
      mutationId: string;
      sourceArtifactId: string;
      sourcePublicationId: string;
      sourceRevision: number;
      sourceContinuityId: string;
      acceptedContinuityId: string;
      candidateSnapshot: SaveSnapshot;
      posture: CampaignSessionPosture;
      pendingContinuityId: string | null;
      firstDivergentMutationId: string | null;
      controlRevision: number;
      controlPosture: CampaignSessionPosture;
      controlFingerprint: string;
      sourceSnapshotFingerprint: string;
    };

function buildMutationSubmissionFingerprint(
  submission: CampaignMutationSubmission
): string {
  return JSON.stringify({
    mutationId: submission.mutationId,
    sourceArtifactId: submission.sourceArtifactId,
    sourceRevision: submission.sourceRevision,
    ownerKind: submission.ownerKind,
    accepted: submission.accepted,
    resultId: submission.resultId ?? null,
    explicitRecoveryDestinationId:
      submission.explicitRecoveryDestinationId ?? null,
    sourceSnapshot: serializeSnapshot(submission.sourceSnapshot),
    proposedSnapshot: serializeSnapshot(submission.proposedSnapshot)
  });
}

function restoreRetainedControl(
  current: CampaignSessionControl,
  retained: RetainedCampaignMutationResult
): CampaignSessionControl {
  return {
    ...current,
    sessionRevision: retained.sessionRevision,
    posture: retained.posture,
    pendingContinuityId: retained.pendingContinuityId,
    firstDivergentMutationId: retained.firstDivergentMutationId,
    lastAcceptedMutationId: retained.lastAcceptedMutationId,
    acceptedMutationIds: retained.acceptedMutationIds,
    hasUnpublishedGameplayState:
      retained.hasUnpublishedGameplayState
  };
}

function isExactNonblankId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value
  );
}

function normalizeRecoveryReceiptId(
  value: string | null | undefined
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!isExactNonblankId(value)) {
    throw new Error(
      "Normal defeat recovery completion receipt identity is malformed."
    );
  }
  return value;
}

function requireRecoveryControlAuthority(
  control: CampaignSessionControl,
  snapshot: SaveSnapshot,
  receipt: NormalDefeatReceiptState,
  mutationId: string,
  completed: boolean
): void {
  const identity = snapshot.campaignIdentity;
  const currentContinuityId = identity?.continuityId ?? null;
  const expectedCurrentContinuityId =
    control.pendingContinuityId ?? control.loadedContinuityId;
  const acceptedMatches = control.acceptedMutationIds.filter(
    (candidate) => candidate === mutationId
  );
  const retainedMatches = control.retainedMutationResults.filter(
    (candidate) => candidate.mutationId === mutationId
  );
  const loadedAtHead =
    control.loadedArtifactId === control.campaignHeadArtifactId &&
    control.loadedHeadRevision === control.campaignHeadRevision;
  const postureIsConsistent =
    control.posture === "at_head"
      ? loadedAtHead &&
        control.pendingContinuityId === null &&
        control.firstDivergentMutationId === null
      : control.posture === "non_head_unmutated"
        ? !loadedAtHead &&
          control.pendingContinuityId === null &&
          control.firstDivergentMutationId === null
        : control.posture === "head_unpublished"
          ? loadedAtHead &&
            control.pendingContinuityId === null &&
            control.firstDivergentMutationId === null
          : !loadedAtHead &&
            isExactNonblankId(control.pendingContinuityId) &&
            isExactNonblankId(control.firstDivergentMutationId) &&
            identity?.parentContinuityId === control.loadedContinuityId &&
            identity.forkedFromArtifactId === control.loadedArtifactId &&
            identity.forkedFromPublicationId ===
              control.loadedPublicationId &&
            identity.firstDivergentMutationId ===
              control.firstDivergentMutationId;
  const lastAcceptedMutationId =
    control.acceptedMutationIds[
      control.acceptedMutationIds.length - 1
    ] ?? null;

  if (
    !identity ||
    control.accountId !== snapshot.accountId ||
    control.campaignId !== identity.campaignId ||
    receipt.campaignId !== identity.campaignId ||
    receipt.characterId !== identity.characterId ||
    receipt.characterId !== snapshot.playerState.playerId ||
    !isExactNonblankId(control.loadedArtifactId) ||
    !isExactNonblankId(control.loadedPublicationId) ||
    !isExactNonblankId(control.loadedContinuityId) ||
    !isExactNonblankId(control.campaignHeadArtifactId) ||
    !Number.isInteger(control.loadedHeadRevision) ||
    control.loadedHeadRevision < 0 ||
    !Number.isInteger(control.campaignHeadRevision) ||
    control.campaignHeadRevision < 0 ||
    !Number.isInteger(control.sessionRevision) ||
    control.sessionRevision < control.loadedHeadRevision ||
    currentContinuityId !== expectedCurrentContinuityId ||
    !postureIsConsistent ||
    new Set(control.acceptedMutationIds).size !==
      control.acceptedMutationIds.length ||
    control.lastAcceptedMutationId !== lastAcceptedMutationId ||
    acceptedMatches.length > 1 ||
    retainedMatches.length > 1 ||
    (!completed &&
      (acceptedMatches.length !== 0 || retainedMatches.length !== 0)) ||
    (completed &&
      retainedMatches.length === 1 &&
      retainedMatches[0]!.resultId !==
        `result.recovery_repair.${receipt.receiptId}`)
  ) {
    throw new Error(
      "Normal defeat recovery campaign-control authority is missing, duplicated, or conflicting."
    );
  }
}

export function createCampaignSessionControl(params: {
  accountId: string;
  campaignId: string;
  artifactId: string;
  publicationId: string;
  artifactRevision: number;
  continuityId: string;
  headArtifactId: string;
  headRevision: number;
}): CampaignSessionControl {
  const atHead =
    params.artifactId === params.headArtifactId &&
    params.artifactRevision === params.headRevision;

  return {
    accountId: params.accountId,
    campaignId: params.campaignId,
    loadedArtifactId: params.artifactId,
    loadedPublicationId: params.publicationId,
    loadedHeadRevision: params.artifactRevision,
    loadedContinuityId: params.continuityId,
    campaignHeadArtifactId: params.headArtifactId,
    campaignHeadRevision: params.headRevision,
    sessionRevision: params.artifactRevision,
    posture: atHead ? "at_head" : "non_head_unmutated",
    pendingContinuityId: null,
    firstDivergentMutationId: null,
    lastAcceptedMutationId: null,
    acceptedMutationIds: [],
    retainedMutationResults: [],
    hasUnpublishedGameplayState: false
  };
}

function buildSurveyPreparationControlFingerprint(
  control: CampaignSessionControl
): string {
  return JSON.stringify({
    accountId: control.accountId,
    campaignId: control.campaignId,
    loadedArtifactId: control.loadedArtifactId,
    loadedPublicationId: control.loadedPublicationId,
    loadedHeadRevision: control.loadedHeadRevision,
    loadedContinuityId: control.loadedContinuityId,
    campaignHeadArtifactId: control.campaignHeadArtifactId,
    campaignHeadRevision: control.campaignHeadRevision,
    sessionRevision: control.sessionRevision,
    posture: control.posture,
    pendingContinuityId: control.pendingContinuityId,
    firstDivergentMutationId: control.firstDivergentMutationId,
    lastAcceptedMutationId: control.lastAcceptedMutationId,
    acceptedMutationIds: control.acceptedMutationIds,
    retainedMutationResults: control.retainedMutationResults.map((entry) => ({
      mutationId: entry.mutationId,
      submissionFingerprint: entry.submissionFingerprint,
      resultId: entry.resultId,
      snapshot: serializeSnapshot(entry.snapshot),
      sessionRevision: entry.sessionRevision,
      posture: entry.posture,
      pendingContinuityId: entry.pendingContinuityId,
      firstDivergentMutationId: entry.firstDivergentMutationId,
      lastAcceptedMutationId: entry.lastAcceptedMutationId,
      acceptedMutationIds: entry.acceptedMutationIds,
      hasUnpublishedGameplayState: entry.hasUnpublishedGameplayState
    })),
    hasUnpublishedGameplayState: control.hasUnpublishedGameplayState
  });
}

function isSurveyCampaignControlCoherent(
  control: CampaignSessionControl,
  snapshot: SaveSnapshot
): boolean {
  const identity = snapshot.campaignIdentity;
  if (!identity) return false;
  const loadedAtHead =
    control.loadedArtifactId === control.campaignHeadArtifactId &&
    control.loadedHeadRevision === control.campaignHeadRevision;
  const lastAcceptedMutationId =
    control.acceptedMutationIds[control.acceptedMutationIds.length - 1] ?? null;
  const retainedMutationIds = control.retainedMutationResults.map((entry) => entry.mutationId);
  const baseValid =
    isExactNonblankId(control.accountId) &&
    isExactNonblankId(control.campaignId) &&
    isExactNonblankId(control.loadedArtifactId) &&
    isExactNonblankId(control.loadedPublicationId) &&
    isExactNonblankId(control.loadedContinuityId) &&
    isExactNonblankId(control.campaignHeadArtifactId) &&
    Number.isInteger(control.loadedHeadRevision) &&
    control.loadedHeadRevision >= 0 &&
    Number.isInteger(control.campaignHeadRevision) &&
    control.campaignHeadRevision >= 0 &&
    Number.isInteger(control.sessionRevision) &&
    control.sessionRevision >= control.loadedHeadRevision &&
    new Set(control.acceptedMutationIds).size === control.acceptedMutationIds.length &&
    new Set(retainedMutationIds).size === retainedMutationIds.length &&
    retainedMutationIds.every((mutationId) => control.acceptedMutationIds.includes(mutationId)) &&
    control.lastAcceptedMutationId === lastAcceptedMutationId;
  if (!baseValid) return false;
  if (control.posture === "at_head" || control.posture === "head_unpublished") {
    return loadedAtHead &&
      control.pendingContinuityId === null &&
      control.firstDivergentMutationId === null &&
      identity.continuityId === control.loadedContinuityId;
  }
  if (control.posture === "non_head_unmutated") {
    return !loadedAtHead &&
      control.pendingContinuityId === null &&
      control.firstDivergentMutationId === null &&
      identity.continuityId === control.loadedContinuityId;
  }
  return !loadedAtHead &&
    isExactNonblankId(control.pendingContinuityId) &&
    isExactNonblankId(control.firstDivergentMutationId) &&
    identity.continuityId === control.pendingContinuityId &&
    identity.parentContinuityId === control.loadedContinuityId &&
    identity.forkedFromArtifactId === control.loadedArtifactId &&
    identity.forkedFromPublicationId === control.loadedPublicationId &&
    identity.firstDivergentMutationId === control.firstDivergentMutationId;
}

function candidateContainsPreparedSurveyEvidence(
  preparation: Extract<PlayerSurveyCampaignPreparation, { accepted: true }>,
  candidateSnapshot: SaveSnapshot,
  resultId: string
): boolean {
  const authority = candidateSnapshot.authorityLedger?.ashenReefSurvey;
  if (!authority) return false;
  if (preparation.mutationId.startsWith("survey_request.")) {
    const requests = authority.requests.filter(
      (entry) => entry.requestId === preparation.mutationId
    );
    const results = authority.results.filter(
      (entry) => entry.requestId === preparation.mutationId && entry.resultId === resultId
    );
    if (requests.length !== 1 || results.length !== 1) return false;
    const request = requests[0]!;
    const result = results[0]!;
    return request.acceptedContinuityId === preparation.acceptedContinuityId &&
      request.normalizedIntent.sourceContinuityId === preparation.sourceContinuityId &&
      request.normalizedIntent.sourceArtifactId === preparation.sourceArtifactId &&
      request.normalizedIntent.sourcePublicationId === preparation.sourcePublicationId &&
      request.normalizedIntent.sourceRevision === preparation.sourceRevision &&
      result.continuityId === preparation.acceptedContinuityId;
  }
  if (preparation.mutationId.startsWith("survey_projection_repair.")) {
    const suffix = preparation.mutationId.slice("survey_projection_repair.".length);
    return resultId === `survey_projection_repair_result.${suffix}` &&
      authority.projectionRepairs.filter(
        (entry) =>
          entry.repairId === preparation.mutationId &&
          entry.continuityId === preparation.acceptedContinuityId
      ).length === 1;
  }
  return false;
}

/**
 * The survey owner needs the accepted continuity before it authors immutable
 * occurrence/result/receipt evidence. This intentionally narrow preparation
 * seam leaves the generic already-mutated admission API unchanged.
 */
export function preparePlayerSurveyCampaignMutation(
  control: CampaignSessionControl,
  submission: {
    mutationId: string;
    sourceArtifactId: string;
    sourcePublicationId: string;
    sourceRevision: number;
    sourceSnapshot: SaveSnapshot;
  }
): PlayerSurveyCampaignPreparation {
  const sourceSnapshot = submission.sourceSnapshot;
  const identity = sourceSnapshot.campaignIdentity;
  const reject = (
    reason: Extract<PlayerSurveyCampaignPreparation, { accepted: false }>["reason"]
  ): PlayerSurveyCampaignPreparation => ({
    accepted: false,
    reason,
    sourceSnapshot,
    control
  });

  if (control.accountId !== sourceSnapshot.accountId) return reject("wrong_account");
  if (!identity || control.campaignId !== identity.campaignId) return reject("wrong_campaign");
  if (!isTargetCampaignSnapshot(sourceSnapshot)) return reject("invalid_authority");
  if (!isSurveyCampaignControlCoherent(control, sourceSnapshot)) return reject("wrong_continuity");
  if (submission.sourceArtifactId !== control.loadedArtifactId) return reject("wrong_artifact");
  if (submission.sourcePublicationId !== control.loadedPublicationId) return reject("wrong_publication");
  if (submission.sourceRevision !== control.sessionRevision) return reject("stale_revision");
  if (hasPendingNormalDefeat(sourceSnapshot)) return reject("recovery_pending");
  if (
    control.acceptedMutationIds.includes(submission.mutationId) ||
    control.retainedMutationResults.some((entry) => entry.mutationId === submission.mutationId) ||
    sourceSnapshot.authorityLedger?.ashenReefSurvey?.requests.some(
      (entry) => entry.requestId === submission.mutationId
    ) ||
    sourceSnapshot.authorityLedger?.ashenReefSurvey?.projectionRepairs.some(
      (entry) => entry.repairId === submission.mutationId
    )
  ) return reject("invalid_authority");

  const expectedCurrentContinuityId =
    control.pendingContinuityId ?? control.loadedContinuityId;
  if (identity.continuityId !== expectedCurrentContinuityId) {
    return reject("wrong_continuity");
  }

  let candidateSnapshot: SaveSnapshot;
  let controlFingerprint: string;
  let sourceSnapshotFingerprint: string;
  try {
    candidateSnapshot = structuredClone(sourceSnapshot);
    controlFingerprint = buildSurveyPreparationControlFingerprint(control);
    sourceSnapshotFingerprint = serializeSnapshot(sourceSnapshot);
  } catch {
    return reject("invalid_authority");
  }
  let acceptedContinuityId = identity.continuityId;
  let pendingContinuityId = control.pendingContinuityId;
  let firstDivergentMutationId = control.firstDivergentMutationId;
  let posture: CampaignSessionPosture =
    control.posture === "non_head_unmutated"
      ? "forked_unpublished"
      : control.posture === "at_head"
        ? "head_unpublished"
        : control.posture;

  if (control.posture === "non_head_unmutated") {
    acceptedContinuityId = createAuthorityId("continuity");
    pendingContinuityId = acceptedContinuityId;
    firstDivergentMutationId = submission.mutationId;
    candidateSnapshot.campaignIdentity = {
      ...identity,
      parentContinuityId: control.loadedContinuityId,
      continuityId: acceptedContinuityId,
      forkedFromArtifactId: control.loadedArtifactId,
      forkedFromPublicationId: control.loadedPublicationId,
      firstDivergentMutationId
    };
    candidateSnapshot.authorityLedger = {
      ...candidateSnapshot.authorityLedger,
      version: 1,
      entries: [
        ...(candidateSnapshot.authorityLedger?.entries ?? []),
        {
          entryId: createAuthorityId("continuity_fork"),
          kind: "continuity_fork",
          sourceId: submission.mutationId,
          acceptedAtTick: candidateSnapshot.clock.tick,
          parentContinuityId: control.loadedContinuityId,
          childContinuityId: acceptedContinuityId,
          forkedFromArtifactId: control.loadedArtifactId,
          forkedFromPublicationId: control.loadedPublicationId
        }
      ]
    };
  }

  return {
    accepted: true,
    mutationId: submission.mutationId,
    sourceArtifactId: submission.sourceArtifactId,
    sourcePublicationId: submission.sourcePublicationId,
    sourceRevision: submission.sourceRevision,
    sourceContinuityId: identity.continuityId,
    acceptedContinuityId,
    candidateSnapshot,
    posture,
    pendingContinuityId,
    firstDivergentMutationId,
    controlRevision: control.sessionRevision,
    controlPosture: control.posture,
    controlFingerprint,
    sourceSnapshotFingerprint
  };
}

export function commitPreparedPlayerSurveyCampaignMutation(
  control: CampaignSessionControl,
  sourceSnapshot: SaveSnapshot,
  preparation: Extract<PlayerSurveyCampaignPreparation, { accepted: true }>,
  candidateSnapshot: SaveSnapshot,
  resultId: string
): CampaignMutationAdmission {
  let unchangedControl = false;
  try {
    unchangedControl =
      buildSurveyPreparationControlFingerprint(control) === preparation.controlFingerprint &&
      serializeSnapshot(sourceSnapshot) === preparation.sourceSnapshotFingerprint &&
      control.sessionRevision === preparation.controlRevision &&
      control.posture === preparation.controlPosture &&
      sourceSnapshot.campaignIdentity?.continuityId === preparation.sourceContinuityId &&
      isSurveyCampaignControlCoherent(control, sourceSnapshot);
  } catch {
    unchangedControl = false;
  }
  if (!unchangedControl) {
    return {
      accepted: false,
      duplicate: false,
      reason: "stale_revision",
      snapshot: sourceSnapshot,
      control,
      resultId: null
    };
  }
  if (
    candidateSnapshot === sourceSnapshot ||
    candidateSnapshot.campaignIdentity?.continuityId !== preparation.acceptedContinuityId ||
    candidateSnapshot.accountId !== sourceSnapshot.accountId ||
    candidateSnapshot.campaignIdentity?.campaignId !== sourceSnapshot.campaignIdentity?.campaignId ||
    !isTargetCampaignSnapshot(candidateSnapshot) ||
    !candidateContainsPreparedSurveyEvidence(preparation, candidateSnapshot, resultId)
  ) {
    return {
      accepted: false,
      duplicate: false,
      reason: "rejected",
      snapshot: sourceSnapshot,
      control,
      resultId: null
    };
  }

  let nextSnapshot = structuredClone(candidateSnapshot);
  if (nextSnapshot.playerState.resources.hp.current <= 0) {
    nextSnapshot = resolveNormalDefeat(nextSnapshot, {
      sourceMutationId: preparation.mutationId,
      sourceKind: "accepted_mutation"
    }).snapshot;
    if (!isTargetCampaignSnapshot(nextSnapshot)) {
      return {
        accepted: false,
        duplicate: false,
        reason: "rejected",
        snapshot: sourceSnapshot,
        control,
        resultId: null
      };
    }
  }

  const nextRevision = control.sessionRevision + 1;
  const acceptedMutationIds = [...control.acceptedMutationIds, preparation.mutationId];
  const retainedResult: RetainedCampaignMutationResult = {
    mutationId: preparation.mutationId,
    submissionFingerprint: JSON.stringify({
      ownerKind: "engine_result",
      mutationId: preparation.mutationId,
      resultId,
      sourceArtifactId: preparation.sourceArtifactId,
      sourcePublicationId: preparation.sourcePublicationId,
      sourceRevision: preparation.sourceRevision,
      acceptedContinuityId: preparation.acceptedContinuityId
    }),
    resultId,
    snapshot: nextSnapshot,
    sessionRevision: nextRevision,
    posture: preparation.posture,
    pendingContinuityId: preparation.pendingContinuityId,
    firstDivergentMutationId: preparation.firstDivergentMutationId,
    lastAcceptedMutationId: preparation.mutationId,
    acceptedMutationIds,
    hasUnpublishedGameplayState: true
  };
  return {
    accepted: true,
    duplicate: false,
    reason: "accepted",
    snapshot: nextSnapshot,
    resultId,
    control: {
      ...control,
      sessionRevision: nextRevision,
      posture: preparation.posture,
      pendingContinuityId: preparation.pendingContinuityId,
      firstDivergentMutationId: preparation.firstDivergentMutationId,
      lastAcceptedMutationId: preparation.mutationId,
      acceptedMutationIds,
      retainedMutationResults: [...control.retainedMutationResults, retainedResult],
      hasUnpublishedGameplayState: true
    }
  };
}

export function admitCampaignMutation(
  control: CampaignSessionControl,
  submission: CampaignMutationSubmission
): CampaignMutationAdmission {
  const submissionFingerprint =
    buildMutationSubmissionFingerprint(submission);
  const retained = control.retainedMutationResults.find(
    (entry) => entry.mutationId === submission.mutationId
  );
  if (retained) {
    if (retained.submissionFingerprint !== submissionFingerprint) {
      throw new Error(
        `Campaign mutation '${submission.mutationId}' was reused with conflicting input.`
      );
    }
    return {
      accepted: false,
      duplicate: true,
      reason: "duplicate",
      snapshot: retained.snapshot,
      control: restoreRetainedControl(control, retained),
      resultId: retained.resultId
    };
  }

  if (!submission.accepted) {
    return {
      accepted: false,
      duplicate: false,
      reason: "rejected",
      snapshot: submission.sourceSnapshot,
      control,
      resultId: submission.resultId ?? null
    };
  }

  if (
    submission.ownerKind !== "recovery_repair" &&
    submission.proposedSnapshot === submission.sourceSnapshot
  ) {
    return {
      accepted: false,
      duplicate: false,
      reason: "no_change",
      snapshot: submission.sourceSnapshot,
      control,
      resultId: submission.resultId ?? null
    };
  }

  if (submission.sourceArtifactId !== control.loadedArtifactId) {
    return {
      accepted: false,
      duplicate: false,
      reason: "wrong_artifact",
      snapshot: submission.sourceSnapshot,
      control,
      resultId: submission.resultId ?? null
    };
  }

  if (submission.sourceRevision !== control.sessionRevision) {
    return {
      accepted: false,
      duplicate: false,
      reason: "stale_revision",
      snapshot: submission.sourceSnapshot,
      control,
      resultId: submission.resultId ?? null
    };
  }

  if (
    hasPendingNormalDefeat(submission.sourceSnapshot) &&
    submission.ownerKind !== "recovery_repair"
  ) {
    return {
      accepted: false,
      duplicate: false,
      reason: "recovery_pending",
      snapshot: submission.sourceSnapshot,
      control,
      resultId: submission.resultId ?? null
    };
  }

  let validatedPendingReceipt: NormalDefeatReceiptState | null = null;
  let validatedRecoveryDestination: ReturnType<
    typeof resolvePendingNormalDefeatRecoveryDestinationWithSource
  > | null = null;
  if (submission.ownerKind === "recovery_repair") {
    if (submission.proposedSnapshot !== submission.sourceSnapshot) {
      throw new Error(
        "Normal defeat recovery repair requires the untouched source snapshot."
      );
    }
    validatedPendingReceipt =
      validatePendingNormalDefeatRecoveryProvenance(
        submission.sourceSnapshot
      );
    requireRecoveryControlAuthority(
      control,
      submission.sourceSnapshot,
      validatedPendingReceipt,
      submission.mutationId,
      false
    );
    if (
      submission.mutationId !==
      `mutation.recovery_repair.${validatedPendingReceipt.receiptId}`
    ) {
      throw new Error(
        "Normal defeat recovery mutation identity is conflicting."
      );
    }
    validatedRecoveryDestination =
      resolvePendingNormalDefeatRecoveryDestinationWithSource(
        submission.sourceSnapshot,
        submission.explicitRecoveryDestinationId
      );
  }

  let nextSnapshot = structuredClone(submission.proposedSnapshot);
  let pendingContinuityId = control.pendingContinuityId;
  let firstDivergentMutationId = control.firstDivergentMutationId;
  let posture: CampaignSessionPosture =
    control.posture === "non_head_unmutated"
      ? "forked_unpublished"
      : control.posture === "at_head"
        ? "head_unpublished"
        : control.posture;

  if (control.posture === "non_head_unmutated") {
    pendingContinuityId = createAuthorityId("continuity");
    firstDivergentMutationId = submission.mutationId;
    if (!nextSnapshot.campaignIdentity) {
      throw new Error("Cannot fork a snapshot without campaign identity.");
    }

    nextSnapshot.campaignIdentity = {
      ...nextSnapshot.campaignIdentity,
      parentContinuityId: control.loadedContinuityId,
      continuityId: pendingContinuityId,
      forkedFromArtifactId: control.loadedArtifactId,
      forkedFromPublicationId: control.loadedPublicationId,
      firstDivergentMutationId
    };
    nextSnapshot.authorityLedger = {
      ...nextSnapshot.authorityLedger,
      version: 1,
      entries: [
        ...(nextSnapshot.authorityLedger?.entries ?? []),
        {
          entryId: createAuthorityId("continuity_fork"),
          kind: "continuity_fork",
          sourceId: submission.mutationId,
          acceptedAtTick: nextSnapshot.clock.tick,
          parentContinuityId: control.loadedContinuityId,
          childContinuityId: pendingContinuityId,
          forkedFromArtifactId: control.loadedArtifactId,
          forkedFromPublicationId: control.loadedPublicationId
        }
      ]
    };
  } else if (
    pendingContinuityId &&
    nextSnapshot.campaignIdentity?.continuityId !== pendingContinuityId
  ) {
    nextSnapshot.campaignIdentity = {
      ...nextSnapshot.campaignIdentity!,
      continuityId: pendingContinuityId
    };
  }

  if (
    submission.ownerKind === "recovery_repair" &&
    validatedPendingReceipt &&
    validatedRecoveryDestination
  ) {
    const completionContinuityId =
      nextSnapshot.campaignIdentity?.continuityId;
    if (!completionContinuityId) {
      throw new Error("Normal defeat recovery lost campaign continuity.");
    }
    nextSnapshot = applyValidatedPendingNormalDefeatRecovery(
      nextSnapshot,
      validatedPendingReceipt.receiptId,
      validatedRecoveryDestination,
      completionContinuityId
    ).snapshot;
  } else if (nextSnapshot.playerState.resources.hp.current <= 0) {
    nextSnapshot = resolveNormalDefeat(nextSnapshot, {
      sourceMutationId: submission.mutationId,
      sourceKind: "accepted_mutation",
      ...(submission.explicitRecoveryDestinationId !== undefined
        ? {
            explicitDestinationId:
              submission.explicitRecoveryDestinationId
          }
        : {})
    }).snapshot;
  }

  const nextRevision = control.sessionRevision + 1;
  const nextAcceptedMutationIds = [
    ...control.acceptedMutationIds,
    submission.mutationId
  ];
  const retainedResult: RetainedCampaignMutationResult = {
    mutationId: submission.mutationId,
    submissionFingerprint,
    resultId: submission.resultId ?? null,
    snapshot: nextSnapshot,
    sessionRevision: nextRevision,
    posture,
    pendingContinuityId,
    firstDivergentMutationId,
    lastAcceptedMutationId: submission.mutationId,
    acceptedMutationIds: nextAcceptedMutationIds,
    hasUnpublishedGameplayState: true
  };
  return {
    accepted: true,
    duplicate: false,
    reason: "accepted",
    snapshot: nextSnapshot,
    resultId: submission.resultId ?? null,
    control: {
      ...control,
      sessionRevision: nextRevision,
      posture,
      pendingContinuityId,
      firstDivergentMutationId,
      lastAcceptedMutationId: submission.mutationId,
      acceptedMutationIds: nextAcceptedMutationIds,
      retainedMutationResults: [
        ...control.retainedMutationResults,
        retainedResult
      ],
      hasUnpublishedGameplayState: true
    }
  };
}

export function completePendingNormalDefeatRecovery(
  control: CampaignSessionControl,
  snapshot: SaveSnapshot,
  explicitDestinationId?: string | null,
  targetReceiptId?: string | null
): CampaignMutationAdmission {
  const receipts = snapshot.normalDefeatReceipts ?? [];
  const pendingReceipts = receipts.filter(
    (receipt) => receipt.posture === "recovery_pending"
  );
  if (pendingReceipts.length > 1) {
    throw new Error(
      `Normal defeat recovery completion requires exactly one pending receipt; found ${pendingReceipts.length}.`
    );
  }
  const normalizedTargetReceiptId = normalizeRecoveryReceiptId(
    targetReceiptId
  );
  if (targetReceiptId !== undefined && !normalizedTargetReceiptId) {
    throw new Error(
      "Normal defeat recovery completion receipt identity is malformed."
    );
  }

  let receipt: NormalDefeatReceiptState | null = null;
  if (normalizedTargetReceiptId) {
    const targetMatches = receipts.filter(
      (candidate) => candidate.receiptId === normalizedTargetReceiptId
    );
    if (targetMatches.length !== 1) {
      throw new Error(
        `Normal defeat recovery completion requires exactly one receipt matching '${normalizedTargetReceiptId}'; found ${targetMatches.length}.`
      );
    }
    receipt = targetMatches[0]!;
  } else if (pendingReceipts.length === 1) {
    receipt = pendingReceipts[0]!;
  } else if (receipts.some((candidate) => candidate.posture === "playable")) {
    throw new Error(
      "Normal defeat recovery completed replay requires an exact receipt identity."
    );
  }
  if (!receipt) {
    throw new Error(
      "Normal defeat recovery completion requires a retained defeat receipt."
    );
  }

  const mutationId = `mutation.recovery_repair.${receipt.receiptId}`;
  if (receipt.posture === "playable") {
    const completed = validateCompletedNormalDefeatRecoveryProvenance(
      snapshot,
      receipt.receiptId
    );
    requireRecoveryControlAuthority(
      control,
      snapshot,
      completed,
      mutationId,
      true
    );
    if (explicitDestinationId !== undefined) {
      const requestedDestinationId =
        resolvePendingNormalDefeatRecoveryDestination(
          snapshot,
          explicitDestinationId
        );
      if (requestedDestinationId !== completed.destinationId) {
        throw new Error(
          `Normal defeat recovery '${mutationId}' was reused with a conflicting destination.`
        );
      }
    }
    return {
      accepted: false,
      duplicate: true,
      reason: "duplicate",
      snapshot,
      control,
      resultId: `result.recovery_repair.${receipt.receiptId}`
    };
  }
  if (
    receipt.posture !== "recovery_pending" ||
    pendingReceipts.length !== 1 ||
    pendingReceipts[0]!.receiptId !== receipt.receiptId
  ) {
    throw new Error(
      "Normal defeat recovery completion target is not the retained pending receipt."
    );
  }

  validatePendingNormalDefeatRecoveryProvenance(
    snapshot,
    receipt.receiptId
  );
  requireRecoveryControlAuthority(
    control,
    snapshot,
    receipt,
    mutationId,
    false
  );
  resolvePendingNormalDefeatRecoveryDestination(
    snapshot,
    explicitDestinationId
  );
  return admitCampaignMutation(control, {
    mutationId,
    sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision,
    ownerKind: "recovery_repair",
    accepted: true,
    sourceSnapshot: snapshot,
    proposedSnapshot: snapshot,
    resultId: `result.recovery_repair.${receipt.receiptId}`,
    ...(explicitDestinationId !== undefined
      ? { explicitRecoveryDestinationId: explicitDestinationId }
      : {})
  });
}
