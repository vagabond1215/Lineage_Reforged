import { evaluateAchievementProgress } from "../../../../packages/engines/game-engine/src/achievements.js";
import { createAuthorityId, isTargetCampaignSnapshot, TARGET_SNAPSHOT_FORMAT } from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import type { CampaignSessionControl } from "../../../../packages/engines/game-engine/src/campaign-session.js";
import { hasPendingNormalDefeat } from "../../../../packages/engines/game-engine/src/normal-defeat.js";
import { verifySoundingsAdmissionProvenance } from "../../../../packages/engines/game-engine/src/soundings-admission-witness.js";
import { serializeSnapshot } from "../../../../packages/shared/persistence/src/index.js";
import type { SaveSnapshot } from "../../../../packages/shared/types/src/index.js";
import { CampaignStoreError, type CampaignStoreFailureCode, type CampaignStorePublication } from "./campaignIndexedDbStore.js";
import { type CleanEpochAccountStore, type CleanEpochSlotRead } from "./cleanEpochAccountStore.js";
import { buildSaveMetadata, type CampaignPublicationConsumerPlan, type StoredSaveEnvelope } from "./saveManager.js";
import type { SaveSlotId } from "./state.js";

export type EpochDescendantResult =
  | { status: "ready"; value: CleanEpochSlotRead & { status: "ready" } }
  | { status: "blocked"; code: CampaignStoreFailureCode | "invalid_input";
      message: string; accountId: string; slotId: SaveSlotId };

function blocked(error: unknown, accountId: string, slotId: SaveSlotId): EpochDescendantResult {
  return { status: "blocked", code: error instanceof CampaignStoreError ? error.code : "invalid_input",
    message: error instanceof Error ? error.message : String(error), accountId, slotId };
}

function plans(snapshot: SaveSnapshot, slotId: SaveSlotId): CampaignPublicationConsumerPlan[] {
  const payloadFingerprint = JSON.stringify({ slotId, capturedAtTick: snapshot.capturedAtTick,
    characterAchievementIds: snapshot.playerState.achievements.unlocked.map(entry => entry.achievementId) });
  return (["active_history", "account_achievements", "legacy_rewards", "last_played"] as const)
    .map(kind => ({ kind, payloadFingerprint }));
}

/** Awaited ordinary descendant caller selected by the local App. Deployment activation remains separate. */
export class CleanEpochDescendantAdapter {
  constructor(private readonly owner: CleanEpochAccountStore) {}

  async save(input: { accountId: string; sourceSlotId: SaveSlotId; destinationSlotId: SaveSlotId;
    expectedAccountRevision: number; snapshot: SaveSnapshot; control: CampaignSessionControl;
    expectedDestinationAddress?: { artifactId: string; publicationId: string } | null }):
    Promise<EpochDescendantResult> {
    const { accountId, sourceSlotId, destinationSlotId, expectedAccountRevision, snapshot, control } = input;
    try {
      if (sourceSlotId !== destinationSlotId && input.expectedDestinationAddress === undefined)
        throw new CampaignStoreError("invalid_record", "Cross-slot save requires an expected destination address.");
      if (!isTargetCampaignSnapshot(snapshot) || hasPendingNormalDefeat(snapshot) || !snapshot.campaignIdentity ||
          snapshot.accountId !== accountId || control.accountId !== accountId ||
          control.campaignId !== snapshot.campaignIdentity.campaignId)
        throw new CampaignStoreError("invalid_record", "Ordinary descendant input requires an open target campaign.");
      const account = await this.owner.readSelected(accountId);
      if (!account) throw new CampaignStoreError("invalid_record", "Descendant account is missing.");
      if (account.revision !== expectedAccountRevision)
        throw new CampaignStoreError("stale_head", "Descendant account revision changed.");
      const current = await this.owner.readSlot(accountId, sourceSlotId);
      if (current.status !== "ready")
        throw new CampaignStoreError("conflict", `Slot is ${current.status}; recover its retained publication first.`);
      const headControl = current.loaded.sessionControl;
      if (headControl.campaignId !== control.campaignId ||
          headControl.campaignHeadArtifactId !== control.campaignHeadArtifactId ||
          headControl.campaignHeadRevision !== control.campaignHeadRevision)
        throw new CampaignStoreError("stale_head", "Campaign head changed after this session was loaded.");
      const destination = sourceSlotId === destinationSlotId ? current
        : await this.owner.readSlot(accountId, destinationSlotId);
      if (destination.status !== "ready" && destination.status !== "empty")
        throw new CampaignStoreError("conflict", `Destination is ${destination.status}.`);
      if (destination.status === "ready" && destination.loaded.sessionControl.campaignId !== control.campaignId)
        throw new CampaignStoreError("conflict", "Destination belongs to another campaign.");
      const observedAddress = destination.status === "ready" ? {
        artifactId: destination.loaded.sessionControl.loadedArtifactId,
        publicationId: destination.loaded.sessionControl.loadedPublicationId } : null;
      if (input.expectedDestinationAddress !== undefined && (
          (input.expectedDestinationAddress?.artifactId ?? null) !== (observedAddress?.artifactId ?? null) ||
          (input.expectedDestinationAddress?.publicationId ?? null) !== (observedAddress?.publicationId ?? null)))
        throw new CampaignStoreError("conflict", "Destination address changed before save.");
      const source = control.loadedArtifactId === headControl.loadedArtifactId
        ? current.loaded
        : await this.owner.readHistoricalArtifact(accountId, sourceSlotId, control.loadedArtifactId);
      if (source.sessionControl.loadedPublicationId !== control.loadedPublicationId ||
          source.sessionControl.loadedHeadRevision !== control.loadedHeadRevision ||
          source.sessionControl.loadedContinuityId !== control.loadedContinuityId)
        throw new CampaignStoreError("conflict", "Loaded source differs from retained campaign authority.");
      if (control.posture === "non_head_unmutated" && !control.hasUnpublishedGameplayState)
        throw new CampaignStoreError("conflict", "An unchanged non-head artifact cannot create a descendant.");
      const savedAt = new Date().toISOString();
      const prepared = evaluateAchievementProgress(snapshot, account.profile,
        { slotId: destinationSlotId, touchHistory: true, recordedAt: savedAt }).nextSnapshot;
      const provenance = verifySoundingsAdmissionProvenance(prepared, control);
      if (provenance !== "not_completed" && provenance !== "verified")
        throw new CampaignStoreError("invalid_record", `Soundings session provenance is ${provenance}.`);
      const firstCompletion = prepared.authorityLedger?.soundingsTurnIn?.version === 2 &&
        source.snapshot.authorityLedger?.soundingsTurnIn?.version !== 2;
      const sessionWitness = control.soundingsAdmissionWitness?.posture === "session"
        ? control.soundingsAdmissionWitness : undefined;
      if (firstCompletion && (!sessionWitness || provenance !== "verified"))
        throw new CampaignStoreError("invalid_record", "First Soundings completion lacks independent session evidence.");
      if (!firstCompletion && sessionWitness)
        throw new CampaignStoreError("invalid_record", "Session witness cannot introduce a second first completion.");
      const identity = prepared.campaignIdentity!;
      const head = await this.owner.readCampaignHead(accountId, identity.campaignId, sourceSlotId);
      if (head.artifactId !== headControl.campaignHeadArtifactId ||
          head.revision !== headControl.campaignHeadRevision)
        throw new CampaignStoreError("stale_head", "Campaign head changed during save preparation.");
      const artifactId = createAuthorityId("artifact");
      const generationId = createAuthorityId("generation");
      const publicationId = createAuthorityId("publication");
      const metadata = { ...buildSaveMetadata(destinationSlotId, prepared), lastSavedAt: savedAt,
        snapshotVersion: TARGET_SNAPSHOT_FORMAT };
      const envelope: StoredSaveEnvelope = { version: 7, accountId, slotId: destinationSlotId,
        savedAt, metadata, snapshotFormatId: TARGET_SNAPSHOT_FORMAT,
        campaignId: identity.campaignId, continuityId: identity.continuityId,
        characterId: prepared.playerState.playerId, artifactId, generationId, publicationId,
        headRevision: headControl.campaignHeadRevision + 1, terminal: false,
        snapshot: serializeSnapshot(prepared) };
      const publication: CampaignStorePublication = { accountId, campaignId: identity.campaignId,
        slotId: destinationSlotId,
        expectedSlotAddress: input.expectedDestinationAddress ?? observedAddress,
        expectedHead: head,
        artifactRaw: JSON.stringify(envelope),
        control: { version: 1, accountId, campaignId: identity.campaignId,
          headArtifactId: artifactId, headPublicationId: publicationId,
          headRevision: envelope.headRevision, previousHeadArtifactId: head.artifactId,
          previousHeadPublicationId: head.publicationId, closed: false, updatedAt: savedAt } };
      await this.owner.publishDescendant({ publication,
        ...(sessionWitness ? { sessionWitness } : {}), expectedAccountRevision,
        sourceSlotId, sourceArtifactId: source.sessionControl.loadedArtifactId,
        sourcePublicationId: source.sessionControl.loadedPublicationId,
        sourceSnapshotRaw: serializeSnapshot(source.snapshot), consumerPlans: plans(prepared, destinationSlotId) });
      await this.owner.completeDescendantConsumers(accountId, identity.campaignId, publicationId);
      const readback = await this.owner.readSlot(accountId, destinationSlotId);
      if (readback.status !== "ready" || readback.loaded.publication.publicationId !== publicationId)
        throw new CampaignStoreError("readback_failed", "Completed descendant did not read back as the exact ready head.");
      return { status: "ready", value: readback };
    } catch (error) { return blocked(error, accountId, destinationSlotId); }
  }

  /** Complete the current accepted descendant after rerender, restart or a lost caller. */
  async resumeCurrent(accountId: string, slotId: SaveSlotId): Promise<EpochDescendantResult> {
    try {
      const recovery = await this.owner.readCurrentDescendantRecovery(accountId, slotId);
      if (!recovery || recovery.status !== "accepted_pending_consumers")
        throw new CampaignStoreError("conflict", "No current pending descendant is available to resume.");
      await this.owner.completeDescendantConsumers(accountId, recovery.campaignId, recovery.publicationId);
      const readback = await this.owner.readSlot(accountId, slotId);
      if (readback.status !== "ready" || readback.loaded.publication.publicationId !== recovery.publicationId)
        throw new CampaignStoreError("readback_failed", "Resumed descendant did not read back as the exact ready head.");
      return { status: "ready", value: readback };
    } catch (error) { return blocked(error, accountId, slotId); }
  }
}
