import { completePendingNormalDefeatRecovery, type CampaignSessionControl } from "../../../../packages/engines/game-engine/src/campaign-session.js";
import { resolvePendingNormalDefeatRecoveryDestination, validateCompletedNormalDefeatRecoveryProvenance,
  validatePendingNormalDefeatRecoveryProvenance } from "../../../../packages/engines/game-engine/src/normal-defeat.js";
import { deserializeSnapshot, serializeSnapshot } from "../../../../packages/shared/persistence/src/index.js";
import type { SaveSnapshot } from "../../../../packages/shared/types/src/index.js";
import { CampaignStoreError } from "./campaignIndexedDbStore.js";
import { type CleanEpochAccountStore, type CleanEpochDescendantRecovery } from "./cleanEpochAccountStore.js";
import { CleanEpochDescendantAdapter, type EpochDescendantResult } from "./cleanEpochDescendantAdapter.js";
import type { SaveSlotId } from "./state.js";

type Address = { artifactId: string; publicationId: string };

export type EpochNormalDefeatRecoveryRequest = {
  accountId: string;
  sourceSlotId: SaveSlotId;
  destinationSlotId: SaveSlotId;
  expectedDestinationAddress: Address | null;
  expectedAccountRevision: number;
  snapshot: SaveSnapshot;
  control: CampaignSessionControl;
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
        recovery.sourceSnapshotRaw !== serializeSnapshot(request.snapshot)) return false;
    try {
      const target = JSON.parse(recovery.envelopeRaw) as { snapshot?: string };
      if (typeof target.snapshot !== "string") return false;
      const snapshot = deserializeSnapshot(target.snapshot);
      const completed = validateCompletedNormalDefeatRecoveryProvenance(snapshot, request.receiptId);
      if (completed.destinationId !== destinationId) return false;
      return !(snapshot.normalDefeatReceipts ?? []).some(receipt => receipt.posture === "recovery_pending");
    } catch { return false; }
  }

  async recover(request: EpochNormalDefeatRecoveryRequest): Promise<EpochDescendantResult> {
    try {
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
          serializeSnapshot(source.snapshot) !== serializeSnapshot(request.snapshot))
        throw new CampaignStoreError("conflict", "Normal defeat source differs from retained campaign authority.");
      if (destination.status !== "ready" && destination.status !== "empty")
        throw new CampaignStoreError("conflict", `Destination is ${destination.status}.`);
      const observed = destination.status === "ready" ? {
        artifactId: destination.loaded.sessionControl.loadedArtifactId,
        publicationId: destination.loaded.sessionControl.loadedPublicationId } : null;
      if (!exactAddress(observed, request.expectedDestinationAddress))
        throw new CampaignStoreError("conflict", "Normal defeat destination address changed.");

      const repaired = completePendingNormalDefeatRecovery(request.control, request.snapshot,
        request.explicitDestinationId, request.receiptId);
      if (!repaired.accepted || repaired.duplicate ||
          (repaired.snapshot.normalDefeatReceipts ?? []).some(receipt => receipt.posture === "recovery_pending"))
        throw new CampaignStoreError("invalid_record", "Normal defeat did not produce a new playable snapshot.");
      validateCompletedNormalDefeatRecoveryProvenance(repaired.snapshot, request.receiptId);
      return this.descendants.save({ accountId: request.accountId, sourceSlotId: request.sourceSlotId,
        destinationSlotId: request.destinationSlotId, expectedDestinationAddress: request.expectedDestinationAddress,
        expectedAccountRevision: request.expectedAccountRevision,
        snapshot: repaired.snapshot, control: repaired.control });
    } catch (error) { return blocked(error, request); }
  }
}
