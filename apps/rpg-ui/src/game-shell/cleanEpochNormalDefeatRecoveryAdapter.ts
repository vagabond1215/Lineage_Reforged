import { completePendingNormalDefeatRecovery, type CampaignSessionControl } from "../../../../packages/engines/game-engine/src/campaign-session.js";
import { isTargetCampaignSnapshot } from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import { isNativeTargetCampaignSnapshot, type NativeFreshCampaignSnapshot } from "../../../../packages/engines/game-engine/src/native-campaign-rules.js";
import { resolvePendingNormalDefeatRecoveryDestination, validateCompletedNormalDefeatRecoveryProvenance,
  validatePendingNormalDefeatRecoveryProvenance } from "../../../../packages/engines/game-engine/src/normal-defeat.js";
import { deserializeSnapshot } from "../../../../packages/shared/persistence/src/index.js";
import type { SaveSnapshot } from "../../../../packages/shared/types/src/index.js";
import { CampaignStoreError } from "./campaignIndexedDbStore.js";
import { type CleanEpochAccountStore, type CleanEpochDescendantRecovery } from "./cleanEpochAccountStore.js";
import { CleanEpochDescendantAdapter, validatePendingDefeatPublication,
  type EpochDescendantResult } from "./cleanEpochDescendantAdapter.js";
import type { SaveSlotId } from "./state.js";

type Address = { artifactId: string; publicationId: string };

export type EpochNormalDefeatRecoveryRequest = {
  accountId: string;
  sourceSlotId: SaveSlotId;
  destinationSlotId: SaveSlotId;
  expectedDestinationAddress: Address | null;
  expectedAccountRevision: number;
  snapshot: SaveSnapshot | NativeFreshCampaignSnapshot;
  control: CampaignSessionControl<SaveSnapshot | NativeFreshCampaignSnapshot>;
  receiptId: string;
  explicitDestinationId?: string | null;
};

function blocked(error: unknown, request: EpochNormalDefeatRecoveryRequest): EpochDescendantResult {
  return { status: "blocked", code: error instanceof CampaignStoreError ? error.code : "invalid_input",
    message: error instanceof Error ? error.message : String(error), accountId: request.accountId,
    slotId: request.destinationSlotId };
}

function exactAddress(left: Address | null, right: Address | null): boolean {
  return left?.artifactId === right?.artifactId && left?.publicationId === right?.publicationId;
}

/** Retained Normal-defeat repair followed by the ordinary descendant publication owner. */
export class CleanEpochNormalDefeatRecoveryAdapter {
  private readonly descendants: CleanEpochDescendantAdapter;

  constructor(private readonly owner: CleanEpochAccountStore) {
    this.descendants = new CleanEpochDescendantAdapter(owner);
  }

  private matchesPendingPublication(request: EpochNormalDefeatRecoveryRequest,
    recovery: CleanEpochDescendantRecovery): boolean {
    const control = request.control;
    if (recovery.accountId !== request.accountId || recovery.sourceSlotId !== request.sourceSlotId ||
        recovery.slotId !== request.destinationSlotId ||
        recovery.pendingDefeatReceiptId !== request.receiptId ||
        recovery.expectedAccountRevision !== request.expectedAccountRevision ||
        !exactAddress(recovery.expectedSlotAddress, request.expectedDestinationAddress) ||
        recovery.sourceArtifactId !== control.loadedArtifactId ||
        recovery.sourcePublicationId !== control.loadedPublicationId ||
        recovery.expectedHead.artifactId !== control.campaignHeadArtifactId ||
        recovery.expectedHead.revision !== control.campaignHeadRevision) return false;
    try {
      const envelope = JSON.parse(recovery.envelopeRaw) as { snapshot?: string };
      if (typeof envelope.snapshot !== "string") return false;
      const accepted = deserializeSnapshot(envelope.snapshot) as SaveSnapshot | NativeFreshCampaignSnapshot;
      if (accepted.snapshotVersion !== request.snapshot.snapshotVersion ||
          (accepted.snapshotVersion === "lineage.save_snapshot.v3" &&
           !isNativeTargetCampaignSnapshot(accepted))) return false;
      const receipt = validatePendingNormalDefeatRecoveryProvenance(accepted, request.receiptId);
      const sameGear = accepted.snapshotVersion !== "lineage.save_snapshot.v3" ||
        (isNativeTargetCampaignSnapshot(accepted) && isNativeTargetCampaignSnapshot(request.snapshot) &&
         JSON.stringify(accepted.playerState.gear) === JSON.stringify(request.snapshot.playerState.gear));
      return receipt.sourceMutationId ===
        request.snapshot.normalDefeatReceipts?.find(row => row.receiptId === request.receiptId)?.sourceMutationId &&
        sameGear;
    } catch { return false; }
  }

  /** Publish the exact accepted pending mutation before attempting retained recovery. */
  async publishPending(request: EpochNormalDefeatRecoveryRequest): Promise<EpochDescendantResult> {
    try {
      const native = isNativeTargetCampaignSnapshot(request.snapshot);
      if (!native && !isTargetCampaignSnapshot(request.snapshot as SaveSnapshot))
        throw new CampaignStoreError("invalid_record", "Pending defeat source is not an admitted campaign format.");
      validatePendingDefeatPublication(request.snapshot, request.control, request.receiptId);
      const destination = await this.owner.readSlot(request.accountId, request.destinationSlotId);
      if (destination.status === "pending_consumers") {
        const retained = await this.owner.readCurrentDescendantRecovery(request.accountId, request.destinationSlotId);
        if (!retained || !this.matchesPendingPublication(request, retained))
          throw new CampaignStoreError("conflict", "Pending defeat differs from the accepted publication.");
        return this.descendants.resumeCurrent(request.accountId, request.destinationSlotId);
      }
      if (destination.status === "ready" &&
          (destination.loaded.snapshot.normalDefeatReceipts ?? []).some(row =>
            row.receiptId === request.receiptId && row.posture === "recovery_pending")) {
        const retained = await this.owner.readDescendantRecovery(request.accountId,
          request.control.campaignId, destination.loaded.publication.publicationId);
        if (!retained || !this.matchesPendingPublication(request, retained))
          throw new CampaignStoreError("conflict", "Retained pending defeat differs from this request.");
        return { status: "ready", value: destination };
      }
      return this.descendants.save({ ...request, pendingDefeatReceiptId: request.receiptId });
    } catch (error) { return blocked(error, request); }
  }

  private matchesAccepted(request: EpochNormalDefeatRecoveryRequest, destinationId: string,
    recovery: CleanEpochDescendantRecovery): boolean {
    const control = request.control;
    if (recovery.accountId !== request.accountId || recovery.sourceSlotId !== request.sourceSlotId ||
        recovery.slotId !== request.destinationSlotId || recovery.expectedAccountRevision !== request.expectedAccountRevision ||
        !exactAddress(recovery.expectedSlotAddress, request.expectedDestinationAddress) ||
        recovery.sourceArtifactId !== control.loadedArtifactId ||
        recovery.sourcePublicationId !== control.loadedPublicationId ||
        recovery.expectedHead.artifactId !== control.campaignHeadArtifactId ||
        recovery.expectedHead.revision !== control.campaignHeadRevision ||
        recovery.sourceSnapshotRaw !== JSON.stringify(request.snapshot)) return false;
    try {
      const target = JSON.parse(recovery.envelopeRaw) as { snapshot?: string };
      if (typeof target.snapshot !== "string") return false;
      const snapshot = deserializeSnapshot(target.snapshot);
      if (snapshot.snapshotVersion !== request.snapshot.snapshotVersion ||
          (snapshot.snapshotVersion === "lineage.save_snapshot.v3" && !isNativeTargetCampaignSnapshot(snapshot)))
        return false;
      const completed = validateCompletedNormalDefeatRecoveryProvenance(snapshot, request.receiptId);
      if (completed.destinationId !== destinationId) return false;
      return !(snapshot.normalDefeatReceipts ?? []).some(receipt => receipt.posture === "recovery_pending");
    } catch { return false; }
  }

  async recover(request: EpochNormalDefeatRecoveryRequest): Promise<EpochDescendantResult> {
    try {
      const native = isNativeTargetCampaignSnapshot(request.snapshot);
      if (!native && !isTargetCampaignSnapshot(request.snapshot as SaveSnapshot))
        throw new CampaignStoreError("invalid_record", "Normal defeat source is not an admitted campaign format.");
      const pending = (request.snapshot.normalDefeatReceipts ?? []).filter(receipt => receipt.posture === "recovery_pending");
      if (pending.length !== 1 || pending[0]?.receiptId !== request.receiptId)
        throw new CampaignStoreError("invalid_record", "Normal defeat recovery requires one exact pending receipt.");
      validatePendingNormalDefeatRecoveryProvenance(request.snapshot, request.receiptId);
      const destinationId = resolvePendingNormalDefeatRecoveryDestination(request.snapshot,
        request.explicitDestinationId);
      if (request.control.accountId !== request.accountId ||
          request.control.campaignId !== request.snapshot.campaignIdentity?.campaignId)
        throw new CampaignStoreError("invalid_record", "Normal defeat campaign identity is inconsistent.");

      // An accepted publication owns retry even if the caller vanished before consumers completed.
      const destination = await this.owner.readSlot(request.accountId, request.destinationSlotId);
      if (destination.status === "pending_consumers") {
        const retained = await this.owner.readCurrentDescendantRecovery(request.accountId, request.destinationSlotId);
        if (!retained || !this.matchesAccepted(request, destinationId, retained))
          throw new CampaignStoreError("conflict", "Pending defeat recovery differs from the retained publication.");
        return this.descendants.resumeCurrent(request.accountId, request.destinationSlotId);
      }
      if (destination.status === "ready" &&
          (destination.loaded.snapshot.normalDefeatReceipts ?? []).some(receipt => receipt.receiptId === request.receiptId &&
            receipt.posture === "playable")) {
        const retained = await this.owner.readDescendantRecovery(request.accountId,
          request.control.campaignId, destination.loaded.publication.publicationId);
        if (!retained || !this.matchesAccepted(request, destinationId, retained))
          throw new CampaignStoreError("conflict", "Completed defeat recovery differs from the retained publication.");
        return { status: "ready", value: destination };
      }

      const account = await this.owner.readSelected(request.accountId);
      if (!account || account.revision !== request.expectedAccountRevision)
        throw new CampaignStoreError("stale_head", "Normal defeat account revision changed.");
      const current = await this.owner.readSlot(request.accountId, request.sourceSlotId);
      if (current.status !== "ready")
        throw new CampaignStoreError("conflict", `Source slot is ${current.status}.`);
      const currentControl = current.loaded.sessionControl;
      if (currentControl.campaignHeadArtifactId !== request.control.campaignHeadArtifactId ||
          currentControl.campaignHeadRevision !== request.control.campaignHeadRevision)
        throw new CampaignStoreError("stale_head", "Normal defeat campaign head changed.");
      const source = currentControl.loadedArtifactId === request.control.loadedArtifactId
        ? current.loaded
        : await this.owner.readHistoricalArtifact(request.accountId, request.sourceSlotId,
          request.control.loadedArtifactId);
      if (JSON.stringify(source.sessionControl) !== JSON.stringify(request.control) ||
          source.snapshot.snapshotVersion !== request.snapshot.snapshotVersion ||
          JSON.stringify(source.snapshot) !== JSON.stringify(request.snapshot))
        throw new CampaignStoreError("conflict", "Normal defeat source differs from retained campaign authority.");
      if (destination.status !== "ready" && destination.status !== "empty")
        throw new CampaignStoreError("conflict", `Destination is ${destination.status}.`);
      const observed = destination.status === "ready" ? {
        artifactId: destination.loaded.sessionControl.loadedArtifactId,
        publicationId: destination.loaded.sessionControl.loadedPublicationId } : null;
      if (!exactAddress(observed, request.expectedDestinationAddress))
        throw new CampaignStoreError("conflict", "Normal defeat destination address changed.");

      const repaired = completePendingNormalDefeatRecovery(request.control, request.snapshot,
        request.explicitDestinationId, request.receiptId,
        native ? isNativeTargetCampaignSnapshot : undefined);
      if (!repaired.accepted || repaired.duplicate ||
          (repaired.snapshot.normalDefeatReceipts ?? []).some(receipt => receipt.posture === "recovery_pending"))
        throw new CampaignStoreError("invalid_record", "Normal defeat did not produce a new playable snapshot.");
      if (native) {
        if (!isNativeTargetCampaignSnapshot(request.snapshot) ||
            !isNativeTargetCampaignSnapshot(repaired.snapshot) ||
            JSON.stringify(repaired.snapshot.playerState.gear) !== JSON.stringify(request.snapshot.playerState.gear))
          throw new CampaignStoreError("invalid_record", "Normal defeat recovery changed the native physical owner.");
      }
      validateCompletedNormalDefeatRecoveryProvenance(repaired.snapshot, request.receiptId);
      return this.descendants.save({ accountId: request.accountId, sourceSlotId: request.sourceSlotId,
        destinationSlotId: request.destinationSlotId, expectedDestinationAddress: request.expectedDestinationAddress,
        expectedAccountRevision: request.expectedAccountRevision,
        snapshot: repaired.snapshot, control: repaired.control });
    } catch (error) { return blocked(error, request); }
  }
}
