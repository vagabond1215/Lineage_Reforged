import { CampaignStoreError, type CampaignStoreFailureCode } from "./campaignIndexedDbStore.js";
import { type CleanEpochAccountRecord, type CleanEpochAccountStore,
  type CleanEpochSlotRead, type CleanEpochSlotStatus, type CleanEpochSlotSummary } from "./cleanEpochAccountStore.js";
import { type EpochSessionSelection, CleanEpochAccountAdapter } from "./cleanEpochAccountAdapter.js";
import type { LauncherRuntimeSession } from "./launcherAuthManager.js";
import type { SaveSlotId } from "./state.js";

export type EpochLauncherReadResult<T> =
  | { status: "ready"; value: T }
  | { status: "blocked"; code: CampaignStoreFailureCode | "invalid_input" | "invalid_credentials";
      message: string; accountId?: string; slotId?: SaveSlotId; slotStatus?: CleanEpochSlotStatus };

export type EpochLauncherInventory = { account: CleanEpochAccountRecord; slots: CleanEpochSlotSummary[] };
export type EpochLauncherSelection =
  | Extract<EpochSessionSelection, { mode: "pick_account" }>
  | { mode: "signed_in"; session: LauncherRuntimeSession; inventory: EpochLauncherInventory };

function blocked(error: unknown, accountId?: string, slotId?: SaveSlotId): EpochLauncherReadResult<never> {
  const code = error instanceof CampaignStoreError ? error.code : "unavailable";
  return { status: "blocked", code, message: error instanceof Error ? error.message : String(error),
    ...(accountId ? { accountId } : {}), ...(slotId ? { slotId } : {}) };
}

/** Awaited App read boundary. No legacy account or save owner is consulted. */
export class CleanEpochLauncherRead {
  constructor(private readonly owner: CleanEpochAccountStore,
    private readonly accounts: CleanEpochAccountAdapter) {}

  async bootstrap(): Promise<EpochLauncherReadResult<EpochLauncherSelection>> {
    const selected = await this.accounts.selectSession();
    if (selected.status === "blocked") return selected;
    if (selected.value.mode === "pick_account") return { status: "ready", value: selected.value };
    const { account, session } = selected.value;
    const inventory = await this.inventory(account.accountId, account.revision);
    if (inventory.status === "blocked") return inventory;
    return { status: "ready", value: { mode: "signed_in", session, inventory: inventory.value } };
  }

  async inventory(accountId: string, expectedRevision?: number): Promise<EpochLauncherReadResult<EpochLauncherInventory>> {
    try {
      const before = await this.owner.readSelected(accountId);
      if (!before) throw new CampaignStoreError("invalid_record", "Selected epoch account is missing.");
      if (expectedRevision !== undefined && before.revision !== expectedRevision)
        throw new CampaignStoreError("stale_head", "Epoch account changed before slot inventory.");
      const slots = await this.owner.listSlots(accountId);
      const after = await this.owner.readSelected(accountId);
      if (!after || after.revision !== before.revision)
        throw new CampaignStoreError("stale_head", "Epoch account changed during slot inventory.");
      return { status: "ready", value: { account: after, slots } };
    } catch (error) { return blocked(error, accountId); }
  }

  async load(accountId: string, expectedRevision: number, slotId: SaveSlotId):
    Promise<EpochLauncherReadResult<{ account: CleanEpochAccountRecord; slot: CleanEpochSlotRead & { status: "ready" } }>> {
    try {
      const before = await this.owner.readSelected(accountId);
      if (!before) throw new CampaignStoreError("invalid_record", "Selected epoch account is missing.");
      if (before.revision !== expectedRevision)
        throw new CampaignStoreError("stale_head", "Epoch account changed before slot load.");
      const slot = await this.owner.readSlot(accountId, slotId);
      const after = await this.owner.readSelected(accountId);
      if (!after || after.revision !== before.revision)
        throw new CampaignStoreError("stale_head", "Epoch account changed during slot load.");
      if (slot.status !== "ready") return { status: "blocked", code: "conflict",
        message: `Slot is ${slot.status}; complete or resolve its retained authority before loading.`,
        accountId, slotId, slotStatus: slot.status };
      return { status: "ready", value: { account: after, slot } };
    } catch (error) { return blocked(error, accountId, slotId); }
  }
}
