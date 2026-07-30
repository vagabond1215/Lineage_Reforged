import type { SaveSnapshot } from "../../../shared/types/src/index.js";
import { createAuthorityId } from "./campaign-rules.js";
import { resolveNormalDefeat } from "./normal-defeat.js";

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
  hasUnpublishedGameplayState: boolean;
}

export type CampaignMutationOwnerKind =
  | "engine_result"
  | "legacy_bridge"
  | "persisted_preference";

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
    | "stale_revision"
    | "wrong_artifact";
  snapshot: SaveSnapshot;
  control: CampaignSessionControl;
};

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
    hasUnpublishedGameplayState: false
  };
}

export function admitCampaignMutation(
  control: CampaignSessionControl,
  submission: CampaignMutationSubmission
): CampaignMutationAdmission {
  if (!submission.accepted) {
    return {
      accepted: false,
      duplicate: false,
      reason: "rejected",
      snapshot: submission.sourceSnapshot,
      control
    };
  }

  if (submission.proposedSnapshot === submission.sourceSnapshot) {
    return {
      accepted: false,
      duplicate: false,
      reason: "no_change",
      snapshot: submission.sourceSnapshot,
      control
    };
  }

  if (control.acceptedMutationIds.includes(submission.mutationId)) {
    return {
      accepted: false,
      duplicate: true,
      reason: "duplicate",
      snapshot: submission.sourceSnapshot,
      control
    };
  }

  if (submission.sourceArtifactId !== control.loadedArtifactId) {
    return {
      accepted: false,
      duplicate: false,
      reason: "wrong_artifact",
      snapshot: submission.sourceSnapshot,
      control
    };
  }

  if (submission.sourceRevision !== control.sessionRevision) {
    return {
      accepted: false,
      duplicate: false,
      reason: "stale_revision",
      snapshot: submission.sourceSnapshot,
      control
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

  if (nextSnapshot.playerState.resources.hp.current <= 0) {
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
  return {
    accepted: true,
    duplicate: false,
    reason: "accepted",
    snapshot: nextSnapshot,
    control: {
      ...control,
      sessionRevision: nextRevision,
      posture,
      pendingContinuityId,
      firstDivergentMutationId,
      lastAcceptedMutationId: submission.mutationId,
      acceptedMutationIds: [
        ...control.acceptedMutationIds,
        submission.mutationId
      ],
      hasUnpublishedGameplayState: true
    }
  };
}
