import React from 'react';
import { createRoot } from 'react-dom/client';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { EpochApp } from './src/EpochApp.tsx';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_SESSION_STORAGE_KEY,
  CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
  openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import './src/index.css';

const marker = 'lineage.g9d.app.qa.account';
const status = document.querySelector<HTMLDivElement>('#qa-status')!;
const inspection = document.querySelector<HTMLPreElement>('#qa-inspection')!;
let armed: 'terminal_quota' | 'settlement_abort' | 'delete_quota' | 'delete_abort' | null = null;
const originalPut = IDBObjectStore.prototype.put;
IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
  if (armed && ((armed === 'terminal_quota' && this.name === CLEAN_EPOCH_TERMINAL_RECOVERY_STORE) ||
      (armed === 'settlement_abort' && this.name === CLEAN_EPOCH_ACCOUNT_STORE) ||
      ((armed === 'delete_quota' || armed === 'delete_abort') &&
        this.name === CLEAN_EPOCH_ADDRESS_DELETION_STORE))) {
    const fault = armed; armed = null;
    if (fault === 'terminal_quota' || fault === 'delete_quota')
      throw new DOMException('synthetic quota', 'QuotaExceededError');
    const result = key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
    queueMicrotask(() => { try { this.transaction.abort(); } catch { /* already settled */ } });
    return result;
  }
  return key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
};
document.querySelector<HTMLButtonElement>('#arm-terminal-quota')!.onclick = () => {
  armed = 'terminal_quota'; inspection.textContent = 'Terminal quota armed.';
};
document.querySelector<HTMLButtonElement>('#arm-settlement-abort')!.onclick = () => {
  armed = 'settlement_abort'; inspection.textContent = 'Settlement abort armed.';
};
document.querySelector<HTMLButtonElement>('#arm-delete-quota')!.onclick = () => {
  armed = 'delete_quota'; inspection.textContent = 'Delete quota armed.';
};
document.querySelector<HTMLButtonElement>('#arm-delete-abort')!.onclick = () => {
  armed = 'delete_abort'; inspection.textContent = 'Delete abort armed.';
};
window.confirm = () => true; // QA page only: exercise the production retirement callback without a modal.
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Mara Terminal App',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
}
async function start() {
  const owner = await openCleanEpochAccountStore();
  let accountId = sessionStorage.getItem(marker);
  try {
    if (!accountId) {
      accountId = `account.local.${crypto.randomUUID()}`;
      await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'G9D Browser QA' }),
        await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
      const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
      if (first.status !== 'ready') throw new Error(`Production first campaign owner failed: ${JSON.stringify(first)}`);
      sessionStorage.setItem(marker, accountId);
    }
    localStorage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY,
      JSON.stringify({ version: 1, accountId, issuedAt: new Date().toISOString() }));
    status.textContent = `QA ACCOUNT ${accountId}`;
    document.querySelector<HTMLButtonElement>('#inspect')!.onclick = () => { void (async () => {
      const selected = await openCleanEpochAccountStore();
      try {
        const account = await selected.readSelected(accountId!);
        const slots = await selected.listSlots(accountId!);
        const pending = await selected.readPendingTerminalForAccount(accountId!);
        inspection.textContent = JSON.stringify({ revision: account?.revision,
          run: account?.profile.history.runRecords[0],
          payoutTransactions: account?.profile.legacy.legacyTransactions.filter(tx =>
            tx.sourceType === 'run_lifecycle').length,
          estateDeposits: account?.profile.estate.deposits.length,
          terminalReceipts: account?.profile.campaignPublicationReceipts?.filter(receipt =>
            receipt.kind === 'retirement_settlement').length,
          slots: slots.map(slot => ({ id: slot.slotId, status: slot.status })),
          pending: pending && { publicationId: pending.publicationId, status: pending.status } }, null, 2);
      } finally { selected.close(); }
    })().catch(error => { inspection.textContent = String(error); }); };
    document.querySelector<HTMLButtonElement>('#replace-captured-slot')!.onclick = () => { void (async () => {
      const competing = await openCleanEpochAccountStore();
      try {
        const [account, pointer, slot] = await Promise.all([
          competing.readSelected(accountId!), competing.readSlotGeneration(accountId!, 'slot-1'),
          competing.readSlot(accountId!, 'slot-1')
        ]);
        if (!account || !pointer || slot.status !== 'ready')
          throw new Error('Replacement requires one ready captured slot.');
        const deletedAt = new Date().toISOString();
        await competing.deleteSlotAddress({ accountId: accountId!, slotId: 'slot-1',
          expectedAccountRevision: account.revision,
          expectedSlotGenerationId: pointer.slotGenerationId,
          expectedAddress: { artifactId: slot.loaded.sessionControl.loadedArtifactId,
            publicationId: slot.loaded.sessionControl.loadedPublicationId },
          deletedAt });
        const replacement = await new CleanEpochFirstCampaignAdapter(competing).start(accountId!,
          { ...form(), playerName: 'Mara Replacement App' });
        if (replacement.status !== 'ready') throw new Error(`Replacement failed: ${JSON.stringify(replacement)}`);
        // Keep the old App's next delete request byte-identical to the retained QA receipt.
        const NativeDate = Date;
        (globalThis as { Date: DateConstructor }).Date = class extends NativeDate {
          constructor(...args: any[]) { super(args.length === 0 ? deletedAt : args[0]); }
          static now() { return NativeDate.parse(deletedAt); }
        } as DateConstructor;
        inspection.textContent = `Replacement ready in Slot 1; old App deletion source remains captured.\n` +
          JSON.stringify({ accountRevision: (await competing.readSelected(accountId!))?.revision,
            currentSlotGenerationId: (await competing.readSlotGeneration(accountId!, 'slot-1'))?.slotGenerationId,
            oldSlotGenerationId: pointer.slotGenerationId }, null, 2);
      } finally { competing.close(); }
    })().catch(error => { inspection.textContent = String(error); }); };
  } finally { owner.close(); }
  createRoot(document.querySelector('#root')!).render(<EpochApp />);
}
start().catch(error => { status.textContent = `FAIL: ${error instanceof Error ? error.message : String(error)}`; });
