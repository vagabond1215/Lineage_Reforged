import type { SaveSnapshot } from "../../../shared/types/src/index.js";
import { serializeSnapshot } from "../../../shared/persistence/src/index.js";
import { createAuthorityId } from "./campaign-rules.js";
import {
  hasPendingNormalDefeat,
  repairPendingNormalDefeat,
  resolvePendingNormalDefeatRecoveryDestination,
  resolveNormalDefeat
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
      version: 1,
      entries: [
        ...(nextSnapshot.authorityLedger?.entries ?? []),
        {
          entryId: createAuthorityId("continuity_fork"),
          kind: "continuity_fork",
          sourceId: submission.mutationId,
          acceptedAtTick: nextSnapshot.clock.tick
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

  if (submission.ownerKind === "recovery_repair") {
    nextSnapshot = repairPendingNormalDefeat(
      nextSnapshot,
      submission.explicitRecoveryDestinationId
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
  explicitDestinationId?: string | null
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
  const pending = pendingReceipts[0] ?? null;
  const latestReceipt = receipts[receipts.length - 1] ?? null;
  const receipt = pending ?? latestReceipt;
  if (!receipt) {
    throw new Error(
      "Normal defeat recovery completion requires a retained defeat receipt."
    );
  }

  const mutationId = `mutation.recovery_repair.${receipt.receiptId}`;
  const retained = control.retainedMutationResults.find(
    (entry) => entry.mutationId === mutationId
  );
  if (retained) {
    const retainedDestinationId = receipt.destinationId;
    if (!retainedDestinationId) {
      throw new Error(
        "Retained Normal defeat recovery result has no safe destination."
      );
    }
    const requestedDestinationId =
      explicitDestinationId === undefined
        ? retainedDestinationId
        : resolvePendingNormalDefeatRecoveryDestination(
            snapshot,
            explicitDestinationId
          );
    if (requestedDestinationId !== retainedDestinationId) {
      throw new Error(
        `Normal defeat recovery '${mutationId}' was reused with a conflicting destination.`
      );
    }
    return {
      accepted: false,
      duplicate: true,
      reason: "duplicate",
      snapshot,
      control,
      resultId: retained.resultId
    };
  }
  if (!pending) {
    throw new Error("Normal defeat recovery has already completed.");
  }

  const destinationId = resolvePendingNormalDefeatRecoveryDestination(
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
    explicitRecoveryDestinationId: destinationId
  });
}
