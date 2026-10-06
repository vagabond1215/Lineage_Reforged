import React from 'react';
import { createRoot } from 'react-dom/client';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { EpochApp } from './src/EpochApp.tsx';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { accountLifecycleGeneration, CLEAN_EPOCH_DATABASE_NAME, CLEAN_EPOCH_DATABASE_VERSION,
  CLEAN_EPOCH_SESSION_STORAGE_KEY,
  openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import './src/index.css';

// Synthetic account in the local browser QA origin only.
const marker = 'lineage.g9f.app.qa.account';
const status = document.querySelector<HTMLDivElement>('#qa-status')!;
const inspection = document.querySelector<HTMLPreElement>('#qa-inspection')!;
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Mara G9F QA',
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
      await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'G9F Browser QA' }),
        await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
      const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
      if (first.status !== 'ready') throw new Error(`Synthetic campaign failed: ${JSON.stringify(first)}`);
      sessionStorage.setItem(marker, accountId);
    }
    const account = await owner.readSelected(accountId);
    if (!account) throw new Error('Synthetic QA account is missing.');
    if (new URLSearchParams(location.search).has('picker'))
      localStorage.removeItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
    else
      localStorage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY, JSON.stringify({ version: 2,
        accountId, lifecycleGeneration: accountLifecycleGeneration(account), issuedAt: new Date().toISOString() }));
    status.textContent = `SYNTHETIC QA ACCOUNT ${accountId}`;
    document.querySelector<HTMLButtonElement>('#inspect')!.onclick = () => { void (async () => {
      const inspect = await openCleanEpochAccountStore();
      try {
        const current = await inspect.read(accountId!);
        const receipt = await inspect.readLifecycleReceipt(accountId!);
        const slots = current ? await inspect.listSlots(accountId!) : [];
        inspection.textContent = JSON.stringify({ accountId, revision: current?.revision ?? null,
          generation: current ? accountLifecycleGeneration(current) : null,
          credentialRetained: !!current?.credential, runCount: current?.profile.history.runRecords.length ?? null,
          receipt, slots: slots.map(slot => ({ id: slot.slotId, status: slot.status })) }, null, 2);
      } finally { inspect.close(); }
    })().catch(error => { inspection.textContent = String(error); }); };
    document.querySelector<HTMLButtonElement>('#corrupt-artifact')!.onclick = () => { void (async () => {
      const inspect = await openCleanEpochAccountStore();
      let artifactId: string;
      try {
        const slot = await inspect.readSlot(accountId!, 'slot-1');
        if (slot.status !== 'ready') throw new Error('Synthetic Slot 1 is not ready.');
        artifactId = slot.loaded.sessionControl.loadedArtifactId;
      } finally { inspect.close(); }
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(CLEAN_EPOCH_DATABASE_NAME, CLEAN_EPOCH_DATABASE_VERSION);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      try {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction('artifacts', 'readwrite');
          tx.objectStore('artifacts').delete([accountId!, artifactId]);
          tx.oncomplete = () => resolve();
          tx.onabort = () => reject(tx.error);
        });
      } finally { db.close(); }
      inspection.textContent = `SYNTHETIC CORRUPTION: removed required artifact ${artifactId}.\n` +
        'Use Settings reset/delete or picker delete and verify blocked presentation.';
    })().catch(error => { inspection.textContent = String(error); }); };
  } finally { owner.close(); }
  createRoot(document.querySelector('#root')!).render(<EpochApp />);
}
start().catch(error => { status.textContent = `FAIL: ${error instanceof Error ? error.message : String(error)}`; });
