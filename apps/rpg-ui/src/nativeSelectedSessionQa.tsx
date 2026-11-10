import React from 'react';
import { createRoot } from 'react-dom/client';
import { isNativeTargetCampaignSnapshot } from '../../../packages/engines/game-engine/src/native-campaign-rules.js';
import type { CampaignSessionControl } from '../../../packages/engines/game-engine/src/campaign-session.js';
import { EpochApp, recoverPendingInventory } from './EpochApp.js';
import { CleanEpochAccountAdapter } from './game-shell/cleanEpochAccountAdapter.js';
import { CleanEpochLegacyActionAdapter } from './game-shell/cleanEpochLegacyActionAdapter.js';
import { CLEAN_EPOCH_DATABASE_NAME, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
  openCleanEpochAccountStore } from './game-shell/cleanEpochAccountStore.js';
import { grantLegacy } from '../../../packages/engines/game-engine/src/legacy-account.js';
import { resolveLegacyPreparationSelection } from '../../../packages/engines/game-engine/src/legacy-unlocks.js';
import { CleanEpochFirstCampaignAdapter } from './game-shell/cleanEpochFirstCampaignAdapter.js';
import { CleanEpochDescendantAdapter } from './game-shell/cleanEpochDescendantAdapter.js';
import { CleanEpochTerminalAdapter } from './game-shell/cleanEpochTerminalAdapter.js';
import { CleanEpochLauncherRead } from './game-shell/cleanEpochLauncherRead.js';
import { createDefaultCharacterCreationFormState } from './game-shell/characterCreationForm.js';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './game-shell/characterCreationCatalog.js';
import { getDefaultWorldSelection } from './game-shell/worldSelectionCatalog.js';
import { applyNativeSelectedItem, createNativeSelectedSession,
  saveNativeSelectedSession } from './game-shell/nativeSelectedSession.js';
import { createNativeSelectedQuestCommand, applyNativeSelectedQuest,
  createNativeSelectedTravelCommand, applyNativeSelectedTravel,
  advanceNativeSelectedSurvey } from './game-shell/nativeSelectedGameplay.js';
import { advanceNativeSelectedExploration, createNativeSelectedEncounterAdmission,
  admitNativeSelectedEncounter, createNativeSelectedCombatStep,
  applyNativeSelectedCombatStep } from './game-shell/nativeSelectedCombat.js';
import { retireNativeSelectedSession, resumeNativeSelectedTerminal } from './game-shell/nativeSelectedTerminal.js';
import './index.css';

async function preAdmissionQa() {
  const owner = await openCleanEpochAccountStore();
  try {
  const accountId = `account.native.pre-admission.${crypto.randomUUID()}`;
  const identity = getLineageIdentityCatalog('lineage.human');
  if (!identity) throw new Error('Synthetic lineage identity is unavailable.');
  const world = getDefaultWorldSelection('backstory.local');
  const form = (slotId: 'slot-1' | 'slot-2' | 'slot-3') => ({
    ...createDefaultCharacterCreationFormState(slotId), playerName: `Recovery ${slotId}`,
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, backstoryId: 'backstory.local',
    continentId: world.continentId, regionId: world.regionId,
    startingSettlementId: world.settlementId, startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter') });
  const accounts = new CleanEpochAccountAdapter(owner);
  const register = await accounts.register({ accountId, displayName: 'Synthetic pre-admission QA',
    password: 'synthetic-only-password', confirmPassword: 'synthetic-only-password', stayLoggedIn: true });
  if (register.status !== 'ready') throw new Error(register.message);
  const native = new CleanEpochFirstCampaignAdapter(owner, 'native_v3');
  const legacy = new CleanEpochFirstCampaignAdapter(owner, 'v2');
  const started = await native.start(accountId, form('slot-1'));
  if (started.status !== 'ready') throw new Error(started.message);
  const preparedOld = await legacy.prepare(accountId, form('slot-2'));
  if (preparedOld.status !== 'ready') throw new Error(preparedOld.message);
  const complete = owner.completePreparedAttemptConsumers.bind(owner);
  owner.completePreparedAttemptConsumers = async () => { throw new Error('Synthetic lost consumer acknowledgement'); };
  try {
    const pending = await legacy.resume(accountId, 'slot-2');
    if (pending.status !== 'blocked') throw new Error('V2 pending fixture unexpectedly completed.');
  } finally { owner.completePreparedAttemptConsumers = complete; }
  const preparedOnly = await legacy.prepare(accountId, form('slot-3'));
  if (preparedOnly.status !== 'ready') throw new Error(preparedOnly.message);
  const nativeOldResume = await native.resume(accountId, 'slot-3');
  if (nativeOldResume.status !== 'blocked' || await owner.readRecovery(accountId, 'slot-3'))
    throw new Error('Native first resume published the prepared v2 source.');
  const oldBefore = await owner.readRecovery(accountId, 'slot-2');
  const neighborBefore = await owner.readSlot(accountId, 'slot-1');
  const accountBefore = await owner.readSelected(accountId);
  if (oldBefore?.status !== 'accepted_pending_consumers' || neighborBefore.status !== 'ready' || !accountBefore)
    throw new Error('Mixed-format fixture did not retain exact sources.');
  const services = { owner, accounts, launcher: new CleanEpochLauncherRead(owner, accounts),
    first: native, descendant: new CleanEpochDescendantAdapter(owner),
    terminal: new CleanEpochTerminalAdapter(owner) } as Parameters<typeof recoverPendingInventory>[0];
  const result = await recoverPendingInventory(services, accountId, true);
  await recoverPendingInventory(services, accountId, true);
  const neighborLoad = await services.launcher.load(accountId, result.account.revision, 'slot-1');
  if (neighborLoad.status !== 'ready' ||
      neighborLoad.value.slot.loaded.snapshot.snapshotVersion !== 'lineage.save_snapshot.v3')
    throw new Error('Independent v3 neighbor was not loadable.');
  const oldAfter = await owner.readRecovery(accountId, 'slot-2');
  const neighborAfter = await owner.readSlot(accountId, 'slot-1');
  const accountAfter = await owner.readSelected(accountId);
  if (result.slots.find(slot => slot.slotId === 'slot-1')?.status !== 'ready' ||
      result.slots.find(slot => slot.slotId === 'slot-2')?.status !== 'pending_consumers' ||
      JSON.stringify(oldAfter) !== JSON.stringify(oldBefore) ||
      JSON.stringify(neighborAfter) !== JSON.stringify(neighborBefore) ||
      JSON.stringify(accountAfter) !== JSON.stringify(accountBefore))
    throw new Error('Native inventory changed the retained v2 or neighboring v3 bytes.');
  const unavailableOwner = Object.create(owner) as typeof owner;
  unavailableOwner.readAttempt = async () => { throw new Error('Synthetic unavailable read'); };
  const unavailableServices = { ...services, owner: unavailableOwner };
  let failed = false;
  try { await recoverPendingInventory(unavailableServices, accountId, true); }
  catch (error) { failed = error instanceof Error && error.message.includes('Synthetic unavailable read'); }
  if (!failed || JSON.stringify(await owner.readRecovery(accountId, 'slot-2')) !== JSON.stringify(oldBefore) ||
      JSON.stringify(await owner.readSlot(accountId, 'slot-1')) !== JSON.stringify(neighborBefore))
    throw new Error('Unavailable source read changed retained bytes.');
  const pendingNativeAccountId = `account.native.pending-recovery.${crypto.randomUUID()}`;
  const pendingNativeRegistration = await accounts.register({ accountId: pendingNativeAccountId,
    displayName: 'Synthetic native pending QA', password: 'synthetic-only-password',
    confirmPassword: 'synthetic-only-password', stayLoggedIn: true });
  if (pendingNativeRegistration.status !== 'ready') throw new Error(pendingNativeRegistration.message);
  const pendingNative = await native.prepare(pendingNativeAccountId, form('slot-1'));
  if (pendingNative.status !== 'ready') throw new Error(pendingNative.message);
  owner.completePreparedAttemptConsumers = async () => { throw new Error('Synthetic native lost acknowledgement'); };
  try {
    const pending = await native.resume(pendingNativeAccountId, 'slot-1');
    if (pending.status !== 'blocked') throw new Error('Native pending fixture unexpectedly completed.');
  } finally { owner.completePreparedAttemptConsumers = complete; }
  const nativeRecoveryBefore = await owner.readRecovery(pendingNativeAccountId, 'slot-1');
  if (nativeRecoveryBefore?.status !== 'accepted_pending_consumers')
    throw new Error('Native pending fixture was not retained.');
  const nativeRecovered = await recoverPendingInventory(services, pendingNativeAccountId, true);
  if (nativeRecovered.slots.find(slot => slot.slotId === 'slot-1')?.status !== 'ready')
    throw new Error('Native pending recovery did not reach ready readback.');
  const recoveredSlot = await owner.readSlot(pendingNativeAccountId, 'slot-1');
  const recoveredAccount = await owner.readSelected(pendingNativeAccountId);
  const recoveredReceipt = await owner.readRecovery(pendingNativeAccountId, 'slot-1');
  if (recoveredSlot.status !== 'ready' || !recoveredAccount ||
      recoveredReceipt?.status !== 'consumers_completed' ||
      recoveredReceipt.envelopeRaw !== nativeRecoveryBefore.envelopeRaw)
    throw new Error('Native recovered source or receipt changed unexpectedly.');
  await recoverPendingInventory(services, pendingNativeAccountId, true);
  if (JSON.stringify(await owner.readSlot(pendingNativeAccountId, 'slot-1')) !== JSON.stringify(recoveredSlot) ||
      JSON.stringify(await owner.readSelected(pendingNativeAccountId)) !== JSON.stringify(recoveredAccount) ||
      JSON.stringify(await owner.readRecovery(pendingNativeAccountId, 'slot-1')) !== JSON.stringify(recoveredReceipt))
    throw new Error('Native retry duplicated publication or consumer receipts.');
  const terminal = new CleanEpochTerminalAdapter(owner);
  const retire = async (retireAccountId: string, slotId: 'slot-1' | 'slot-2') => {
    const slot = await owner.readSlot(retireAccountId, slotId);
    const account = await owner.readSelected(retireAccountId);
    if (slot.status !== 'ready' || !account) throw new Error('Terminal source is not ready.');
    return terminal.retire({ accountId: retireAccountId, sourceSlotId: slotId,
      expectedAccountRevision: account.revision, snapshot: slot.loaded.snapshot,
      control: slot.loaded.sessionControl, expectedSourceAddress: {
        artifactId: slot.loaded.sessionControl.loadedArtifactId,
        publicationId: slot.loaded.sessionControl.loadedPublicationId } });
  };
  const oldTerminalAccountId = `account.native.old-terminal.${crypto.randomUUID()}`;
  const oldTerminalRegistration = await accounts.register({ accountId: oldTerminalAccountId,
    displayName: 'Synthetic old terminal QA', password: 'synthetic-only-password',
    confirmPassword: 'synthetic-only-password', stayLoggedIn: true });
  if (oldTerminalRegistration.status !== 'ready') throw new Error(oldTerminalRegistration.message);
  const oldTerminalStart = await legacy.start(oldTerminalAccountId, form('slot-1'));
  const oldTerminalNeighbor = await native.start(oldTerminalAccountId, form('slot-2'));
  if (oldTerminalStart.status !== 'ready' || oldTerminalNeighbor.status !== 'ready')
    throw new Error('Mixed terminal source fixture failed.');
  const oldRetired = await retire(oldTerminalAccountId, 'slot-1');
  if (oldRetired.status !== 'completed' || oldRetired.recovery.addressClosure)
    throw new Error('V2 terminal fixture did not retain unclosed settlement.');
  const oldTerminalAccount = await owner.readSelected(oldTerminalAccountId);
  const oldTerminalNeighborBefore = await owner.readSlot(oldTerminalAccountId, 'slot-2');
  const oldTerminalInventory = await recoverPendingInventory(services, oldTerminalAccountId, true);
  if (oldTerminalInventory.slots.find(slot => slot.slotId === 'slot-2')?.status !== 'ready' ||
      JSON.stringify(await owner.readSelected(oldTerminalAccountId)) !== JSON.stringify(oldTerminalAccount) ||
      JSON.stringify(await owner.readSlot(oldTerminalAccountId, 'slot-2')) !== JSON.stringify(oldTerminalNeighborBefore) ||
      JSON.stringify(await owner.readTerminalRecovery(oldTerminalAccountId,
        oldRetired.recovery.campaignId, oldRetired.recovery.publicationId)) !== JSON.stringify(oldRetired.recovery))
    throw new Error('Native inventory closed or changed the v2 terminal settlement or v3 neighbor.');
  const nativeRetired = await retire(pendingNativeAccountId, 'slot-1');
  if (nativeRetired.status !== 'completed' || nativeRetired.recovery.addressClosure)
    throw new Error('V3 terminal fixture did not retain unclosed settlement.');
  const nativeTerminalRevision = nativeRetired.account.revision;
  await recoverPendingInventory(services, pendingNativeAccountId, true);
  const nativeClosed = await owner.readTerminalRecovery(pendingNativeAccountId,
    nativeRetired.recovery.campaignId, nativeRetired.recovery.publicationId);
  const nativeClosedAccount = await owner.readSelected(pendingNativeAccountId);
  if (!nativeClosed?.addressClosure || nativeClosed.addressClosure.receipts.length !== 1 ||
      nativeClosedAccount?.revision !== nativeTerminalRevision + 1 ||
      nativeClosedAccount.profile.history.runRecords.find(run =>
        run.characterId === nativeClosed.characterId)?.saveSlotIds.length !== 0)
    throw new Error('V3 terminal closure lost exact receipt or account revision.');
  for (const ref of nativeClosed.addressClosure.receipts) {
    const receipt = await owner.readAddressDeletionReceipt(pendingNativeAccountId,
      ref.slotId, ref.slotGenerationId);
    if (receipt?.reason !== 'terminal' || receipt.artifactId !== ref.artifactId ||
        receipt.publicationId !== ref.publicationId)
      throw new Error('V3 terminal closure receipt failed independent owner readback.');
  }
  await recoverPendingInventory(services, pendingNativeAccountId, true);
  if (JSON.stringify(await owner.readTerminalRecovery(pendingNativeAccountId,
        nativeClosed.campaignId, nativeClosed.publicationId)) !== JSON.stringify(nativeClosed) ||
      JSON.stringify(await owner.readSelected(pendingNativeAccountId)) !== JSON.stringify(nativeClosedAccount))
    throw new Error('V3 terminal closure retry changed retained archive bytes.');
  const reopened = await openCleanEpochAccountStore();
  try {
    if (JSON.stringify(await reopened.readTerminalRecovery(pendingNativeAccountId,
      nativeClosed.campaignId, nativeClosed.publicationId)) !== JSON.stringify(nativeClosed))
      throw new Error('V3 terminal closure did not survive independent owner readback.');
  } finally { reopened.close(); }
  const pendingTerminalAccountId = `account.native.old-pending-terminal.${crypto.randomUUID()}`;
  const pendingTerminalRegistration = await accounts.register({ accountId: pendingTerminalAccountId,
    displayName: 'Synthetic old pending terminal QA', password: 'synthetic-only-password',
    confirmPassword: 'synthetic-only-password', stayLoggedIn: true });
  if (pendingTerminalRegistration.status !== 'ready') throw new Error(pendingTerminalRegistration.message);
  if ((await legacy.start(pendingTerminalAccountId, form('slot-1'))).status !== 'ready' ||
      (await native.start(pendingTerminalAccountId, form('slot-2'))).status !== 'ready')
    throw new Error('Pending v2 terminal neighbor fixture failed.');
  const settle = owner.completeTerminalSettlement.bind(owner);
  owner.completeTerminalSettlement = async () => { throw new Error('Synthetic lost terminal settlement acknowledgement'); };
  try {
    if ((await retire(pendingTerminalAccountId, 'slot-1')).status !== 'blocked')
      throw new Error('V2 pending terminal fixture unexpectedly settled.');
  } finally { owner.completeTerminalSettlement = settle; }
  const pendingOldTerminal = await owner.readPendingTerminalForAccount(pendingTerminalAccountId);
  if (pendingOldTerminal?.status !== 'accepted_pending_settlement')
    throw new Error('V2 pending terminal source was not retained.');
  const pendingOldAccount = await owner.readSelected(pendingTerminalAccountId);
  const pendingOldNeighbor = await owner.readSlot(pendingTerminalAccountId, 'slot-2');
  await recoverPendingInventory(services, pendingTerminalAccountId, true);
  if (JSON.stringify(await owner.readSelected(pendingTerminalAccountId)) !== JSON.stringify(pendingOldAccount) ||
      JSON.stringify(await owner.readPendingTerminalForAccount(pendingTerminalAccountId)) !==
        JSON.stringify(pendingOldTerminal) ||
      JSON.stringify(await owner.readSlot(pendingTerminalAccountId, 'slot-2')) !== JSON.stringify(pendingOldNeighbor))
    throw new Error('Native inventory settled pending v2 terminal or changed v3 neighbor.');
  const pendingDescendantAccountId = `account.native.old-pending-descendant.${crypto.randomUUID()}`;
  const pendingDescendantRegistration = await accounts.register({ accountId: pendingDescendantAccountId,
    displayName: 'Synthetic old descendant QA', password: 'synthetic-only-password',
    confirmPassword: 'synthetic-only-password', stayLoggedIn: true });
  if (pendingDescendantRegistration.status !== 'ready') throw new Error(pendingDescendantRegistration.message);
  const oldDescendantFirst = await legacy.start(pendingDescendantAccountId, form('slot-1'));
  const descendantNeighbor = await native.start(pendingDescendantAccountId, form('slot-2'));
  const descendantAccount = await owner.readSelected(pendingDescendantAccountId);
  if (oldDescendantFirst.status !== 'ready' || descendantNeighbor.status !== 'ready' || !descendantAccount)
    throw new Error('V2 descendant mixed fixture failed.');
  const completeDescendant = owner.completeDescendantConsumers.bind(owner);
  owner.completeDescendantConsumers = async () => { throw new Error('Synthetic lost descendant acknowledgement'); };
  try {
    const pending = await new CleanEpochDescendantAdapter(owner).save({
      accountId: pendingDescendantAccountId, sourceSlotId: 'slot-1', destinationSlotId: 'slot-3',
      expectedAccountRevision: descendantAccount.revision, expectedDestinationAddress: null,
      snapshot: oldDescendantFirst.value.loaded.snapshot,
      control: oldDescendantFirst.value.loaded.sessionControl });
    if (pending.status !== 'blocked') throw new Error('V2 descendant fixture unexpectedly completed.');
  } finally { owner.completeDescendantConsumers = completeDescendant; }
  const oldDescendantPending = await owner.readCurrentDescendantRecovery(pendingDescendantAccountId, 'slot-3');
  const oldDescendantAccount = await owner.readSelected(pendingDescendantAccountId);
  const oldDescendantNeighbor = await owner.readSlot(pendingDescendantAccountId, 'slot-2');
  if (oldDescendantPending?.status !== 'accepted_pending_consumers' || oldDescendantNeighbor.status !== 'ready')
    throw new Error('V2 pending descendant was not retained beside v3.');
  const descendantInventory = await recoverPendingInventory(services, pendingDescendantAccountId, true);
  const descendantLoad = await services.launcher.load(pendingDescendantAccountId,
    descendantInventory.account.revision, 'slot-2');
  if (descendantLoad.status !== 'ready' ||
      descendantLoad.value.slot.loaded.snapshot.snapshotVersion !== 'lineage.save_snapshot.v3')
    throw new Error('V3 neighbor was not loadable beside v2 pending descendant.');
  if (JSON.stringify(await owner.readCurrentDescendantRecovery(pendingDescendantAccountId, 'slot-3')) !==
        JSON.stringify(oldDescendantPending) ||
      JSON.stringify(await owner.readSelected(pendingDescendantAccountId)) !== JSON.stringify(oldDescendantAccount) ||
      JSON.stringify(await owner.readSlot(pendingDescendantAccountId, 'slot-2')) !==
        JSON.stringify(oldDescendantNeighbor))
    throw new Error('Native inventory completed v2 descendant or changed v3 neighbor.');
  const damagedBefore = JSON.stringify(await owner.readSelected(pendingTerminalAccountId));
  const damagedNeighbor = JSON.stringify(await owner.readSlot(pendingTerminalAccountId, 'slot-2'));
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(CLEAN_EPOCH_DATABASE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, 'readwrite');
      const store = tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE);
      const request = store.get([pendingTerminalAccountId, pendingOldTerminal.campaignId,
        pendingOldTerminal.publicationId]);
      request.onsuccess = () => {
        if (!request.result) { tx.abort(); return; }
        store.put({ ...request.result, sourceSnapshotRaw: 'synthetic-corrupt-source' });
      };
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error ?? new Error('Synthetic corruption setup aborted.'));
      tx.onerror = () => reject(tx.error);
    });
  } finally { db.close(); }
  let malformedBlocked = false;
  try { await recoverPendingInventory(services, pendingTerminalAccountId, true); }
  catch { malformedBlocked = true; }
  if (!malformedBlocked || JSON.stringify(await owner.readSelected(pendingTerminalAccountId)) !== damagedBefore ||
      JSON.stringify(await owner.readSlot(pendingTerminalAccountId, 'slot-2')) !== damagedNeighbor)
    throw new Error('Malformed terminal source wrote account or neighboring v3 bytes.');
  document.body.dataset.preAdmission = 'pass';
  document.body.dataset.preAdmissionAccount = accountId;
  document.getElementById('root')!.textContent = 'PASS synthetic same-origin pre-admission recovery';
  } finally { owner.close(); }
}

async function seed() {
  let owner = await openCleanEpochAccountStore();
  try {
    const gameplay = new URLSearchParams(location.search).has('gameplay');
    const combat = new URLSearchParams(location.search).has('combat');
    const route = new URLSearchParams(location.search).get('route');
    const terminal = new URLSearchParams(location.search).has('terminal');
    const accountId = `account.native.selected.qa.${crypto.randomUUID()}`;
    const registered = await new CleanEpochAccountAdapter(owner).register({ accountId,
      displayName: `Native Selected QA ${accountId.slice(-8)}`, password: 'synthetic-only-password',
      confirmPassword: 'synthetic-only-password', stayLoggedIn: true });
    if (registered.status !== 'ready') throw new Error(registered.message);
    document.body.dataset.accountId = accountId;
    if (new URLSearchParams(location.search).has('food-owner-bound') &&
        new URLSearchParams(location.search).has('creator')) {
      // This QA-only route supplies synthetic prerequisites, then exercises the
      // real account CAS, Legacy purchase/selection and native creator owners.
      const earned = grantLegacy(registered.value.account.profile, { amount: 6,
        summary: 'Synthetic local food acceptance prerequisite', sourceType: 'synthetic_audit',
        sourceId: 'native-selected-food-qa', recordedAt: new Date().toISOString() });
      if (!earned.ok) throw new Error('Synthetic Legacy prerequisite was rejected.');
      const granted = await new CleanEpochAccountAdapter(owner).updateProfile(accountId,
        registered.value.account.revision, earned.profile);
      if (granted.status !== 'ready') throw new Error(granted.message);
      const legacy = new CleanEpochLegacyActionAdapter(owner);
      const prepared = await legacy.apply({ accountId, expectedRevision: granted.value.revision,
        expectedProfile: granted.value.profile,
        action: { kind: 'purchase', unlockId: 'legacy.unlock.lineage.prepared_lineage',
          recordedAt: new Date().toISOString() } });
      if (prepared.status !== 'ready') throw new Error(prepared.message);
      const keys = await legacy.apply({ accountId, expectedRevision: prepared.account.revision,
        expectedProfile: prepared.account.profile,
        action: { kind: 'purchase', unlockId: 'legacy.unlock.preparation.storehouse_keys',
          recordedAt: new Date().toISOString() } });
      if (keys.status !== 'ready') throw new Error(keys.message);
      const selected = await legacy.apply({ accountId, expectedRevision: keys.account.revision,
        expectedProfile: keys.account.profile,
        action: { kind: 'select', unlockId: 'legacy.unlock.preparation.storehouse_keys' } });
      if (selected.status !== 'ready' || !resolveLegacyPreparationSelection(selected.account.profile)
        .selectedUnlockIds.includes('legacy.unlock.preparation.storehouse_keys'))
        throw new Error('Storehouse Keys preparation was not selected.');
      document.body.dataset.foodPrerequisite = 'synthetic-points-owner-purchase';
      const capture = document.createElement('button');
      capture.textContent = 'Capture food QA state';
      capture.style.cssText = 'position:fixed;right:0;bottom:0;z-index:10000';
      const evidence = document.createElement('pre');
      evidence.id = 'food-qa-evidence';
      evidence.style.cssText = 'position:fixed;right:0;bottom:2rem;z-index:10000;max-width:40vw;max-height:35vh;overflow:auto;background:#111;color:#fff';
      capture.onclick = async () => {
        const readOwner = await openCleanEpochAccountStore();
        try {
          const source = await readOwner.readSlot(accountId, 'slot-1');
          const account = await readOwner.readSelected(accountId);
          const candidate: unknown = source.status === 'ready' ? source.loaded.snapshot : null;
          if (source.status !== 'ready' || !account || !isNativeTargetCampaignSnapshot(candidate))
            throw new Error('Food QA selected native source is unavailable.');
          const snapshot = candidate;
          evidence.textContent = JSON.stringify({ accountId, accountRevision: account.revision,
            publicationId: source.loaded.publication.publicationId,
            loadedHeadRevision: source.loaded.sessionControl.loadedHeadRevision,
            inventory: snapshot.playerState.inventory, body: snapshot.playerState.bodyState,
            resources: snapshot.playerState.resources, useLedger: snapshot.nativeInventoryUse,
            gear: snapshot.playerState.gear, wallet: snapshot.playerState.currency,
            quests: snapshot.playerState.activeQuestIds, encounter: snapshot.gameState.activeEncounter,
            legacy: account.profile.legacy }, null, 2);
        } finally { readOwner.close(); }
      };
      document.body.append(capture, evidence);
    }
    if (new URLSearchParams(location.search).has('creator')) {
      document.body.dataset.seeded = 'creator';
      createRoot(document.getElementById('root')!).render(<EpochApp
        candidateNativeV3={new URLSearchParams(location.search).has('candidate')} />);
      return;
    }
    const identity = getLineageIdentityCatalog('lineage.human');
    const world = combat || route === 'combat' ? { continentId: 'region.kaelvar', regionId: 'region.auric_marches',
      settlementId: 'settlement.stonevein' } : gameplay || route === 'survey' ? {
      continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
      settlementId: 'settlement.starfall_port' } : getDefaultWorldSelection('backstory.local');
    if (!identity?.hairColorOptions[0] || !identity.eyeColorOptions[0] || !identity.skinToneOptions[0])
      throw new Error('Synthetic creator identity is incomplete.');
    const form = { ...createDefaultCharacterCreationFormState('slot-1'),
      playerName: 'Native EpochApp Hunter', hairColorId: identity.hairColorOptions[0].id,
      eyeColorId: identity.eyeColorOptions[0].id, skinToneId: identity.skinToneOptions[0].id,
      backstoryId: gameplay || combat || route ? 'backstory.craftsmans_child' : 'backstory.local', continentId: world.continentId,
      regionId: world.regionId, startingSettlementId: world.settlementId,
      startingBundleId: 'starting_bundle.hunter',
      startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter') };
    const started = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, form);
    if (started.status !== 'ready') throw new Error(started.message);
    if (terminal) Object.assign(window, { runNativeTerminalQa: async () => {
      let qaOwner = await openCleanEpochAccountStore();
      try {
        const source = await qaOwner.readSlot(accountId, 'slot-1');
        const account = await qaOwner.readSelected(accountId);
        if (source.status !== 'ready' || !account) throw new Error('Selected native source was not retained.');
        const first = createNativeSelectedSession({ snapshot: source.loaded.snapshot,
          control: source.loaded.sessionControl, sourceSlotId: 'slot-1',
          accountRevision: account.revision });
        const bow = first.snapshot.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
        if (!bow) throw new Error('Starter bow instance is missing.');
        const moved = applyNativeSelectedItem(first, { kind: 'gear',
          expectedRevision: first.snapshot.playerState.gear.revision,
          itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } },
        'native.terminal.qa.bow.1');
        if (moved.status !== 'accepted') throw new Error(`Terminal item move was ${moved.status}.`);
        const mismatchedRetirement = await new CleanEpochTerminalAdapter(qaOwner).retire({
          accountId, sourceSlotId: 'slot-1', expectedAccountRevision: account.revision,
          snapshot: first.snapshot, control: moved.session.control as unknown as CampaignSessionControl,
          expectedSourceAddress: first.sourceAddress });
        if (mismatchedRetirement.status !== 'blocked' ||
            (await qaOwner.readSelected(accountId))?.revision !== account.revision ||
            (await qaOwner.readSlot(accountId, 'slot-1')).status !== 'ready')
          throw new Error('Stale native retirement pair published or changed the account.');
        const saved = await saveNativeSelectedSession(qaOwner, moved.session, 'slot-1');
        if (saved.status !== 'ready') throw new Error(`Terminal source Save blocked: ${saved.message}`);
        const gear = JSON.stringify(saved.session.snapshot.playerState.gear);
        const stale = await retireNativeSelectedSession(qaOwner, first);
        if (stale.status !== 'blocked' || (await qaOwner.readSlot(accountId, 'slot-1')).status !== 'ready')
          throw new Error('Stale terminal source changed the retained campaign.');
        qaOwner.close();
        qaOwner = await openCleanEpochAccountStore();
        const restarted = await qaOwner.readSlot(accountId, 'slot-1');
        const restartedSnapshot: unknown = restarted.status === 'ready' ? restarted.loaded.snapshot : null;
        if (restarted.status !== 'ready' || !isNativeTargetCampaignSnapshot(restartedSnapshot) ||
            JSON.stringify(restartedSnapshot.playerState.gear) !== gear ||
            restarted.loaded.publication.publicationId !== saved.publicationId)
          throw new Error('Terminal source Save/restart changed physical gear or publication.');
        qaOwner.close();
        let writes = 0;
        qaOwner = await openCleanEpochAccountStore({ afterWrite: tx => { if (++writes === 5) tx.abort(); } });
        const interrupted = await retireNativeSelectedSession(qaOwner, saved.session);
        const pending = await qaOwner.readPendingTerminalForAccount(accountId);
        if (interrupted.status !== 'blocked' || !interrupted.requiresReload ||
            pending?.status !== 'accepted_pending_settlement' ||
            pending.sourcePublicationId !== saved.publicationId ||
            (await qaOwner.readSlot(accountId, 'slot-1')).status !== 'closed')
          throw new Error('Interrupted terminal publication lost the accepted pending source.');
        qaOwner.close();
        qaOwner = await openCleanEpochAccountStore();
        const completed = await resumeNativeSelectedTerminal(qaOwner, saved.session);
        if (completed.status !== 'completed' ||
            completed.recovery.publicationId !== pending.publicationId ||
            JSON.stringify(JSON.parse(JSON.parse(completed.recovery.envelopeRaw).snapshot).playerState.gear) !== gear ||
            completed.account.profile.history.runRecords[0]?.archiveReason !== 'retired')
          throw new Error('Terminal restart failed to settle the exact physical source.');
        const duplicate = await retireNativeSelectedSession(qaOwner, saved.session);
        const changed = await retireNativeSelectedSession(qaOwner,
          { ...saved.session, accountRevision: saved.session.accountRevision + 1 });
        if (duplicate.status !== 'completed' ||
            duplicate.recovery.publicationId !== completed.recovery.publicationId ||
            changed.status !== 'blocked')
          throw new Error('Terminal retry minted another publication or accepted a changed source.');
        qaOwner.close();
        qaOwner = await openCleanEpochAccountStore();
        const retained = await qaOwner.readTerminalForSource(accountId,
          saved.session.control.campaignId, saved.publicationId);
        if (retained?.status !== 'settlement_completed' ||
            retained.publicationId !== completed.recovery.publicationId ||
            (await qaOwner.readSlot(accountId, 'slot-1')).status !== 'closed' ||
            (await qaOwner.readSelected(accountId))?.profile.history.runRecords.length !== 1)
          throw new Error('Terminal account history or exact publication was lost after restart.');
        document.body.dataset.terminal = 'pass';
        document.body.dataset.terminalPublicationId = retained.publicationId;
        document.body.dataset.terminalBowId = bow.itemInstanceId;
      } finally { qaOwner.close(); }
    } });
    if (combat) {
      const account = await owner.readSelected(accountId);
      if (!account) throw new Error('Native combat account is missing.');
      let session = createNativeSelectedSession({ snapshot: started.value.loaded.snapshot,
        control: started.value.loaded.sessionControl, sourceSlotId: 'slot-1',
        accountRevision: account.revision });
      const originalGear = JSON.stringify(session.snapshot.playerState.gear);
      for (let attempt = 0; attempt < 40 && !session.snapshot.worldState.nearbyExplorationCandidate; attempt++) {
        const explored = advanceNativeSelectedExploration(session);
        if (explored.status !== 'accepted') throw new Error(`Native exploration was ${explored.status}: ${explored.reason}`);
        session = explored.session;
      }
      const command = createNativeSelectedEncounterAdmission(session);
      if (!command) throw new Error('Ordinary exploration did not produce an authored encounter.');
      const admitted = admitNativeSelectedEncounter(session, command);
      if (admitted.status !== 'accepted') throw new Error(`Native encounter was ${admitted.status}: ${admitted.reason}`);
      session = admitted.session;
      const player = session.snapshot.gameState.activeEncounter?.combatants.find(item => item.kind === 'player');
      if (!player?.hooks.itemIds.includes('item.short_bow') || player.equipment.mainHandItemId !== 'item.short_bow')
        throw new Error('Native combat missed the owner-backed worn Short Bow.');
      for (let beat = 1; beat < 300 && session.snapshot.gameState.activeEncounter; beat++) {
        const step = createNativeSelectedCombatStep(session, 'combat.advance', null, `native.qa.combat.${beat}`);
        if (!step) throw new Error('Active native encounter has no player step.');
        const advanced = applyNativeSelectedCombatStep(session, step);
        if (advanced.status !== 'accepted') throw new Error(`Native combat was ${advanced.status}: ${advanced.reason}`);
        session = advanced.session;
        if (JSON.stringify(session.snapshot.playerState.gear) !== originalGear)
          throw new Error('Native combat changed the physical gear graph.');
      }
      if (session.snapshot.gameState.combatHistory[session.snapshot.gameState.combatHistory.length - 1]?.result !== 'enemies_victorious' ||
          session.snapshot.normalDefeatReceipts?.length !== 1 ||
          session.snapshot.normalDefeatReceipts[0]?.posture !== 'playable')
        throw new Error('Ordinary combat did not produce the expected safe-settlement defeat.');
      const priorHead = started.value.loaded.publication.publicationId;
      owner.close(); let writes = 0;
      owner = await openCleanEpochAccountStore({ afterWrite: tx => { if (++writes === 1) tx.abort(); } });
      const interrupted = await saveNativeSelectedSession(owner, session, 'slot-1');
      if (interrupted.status !== 'blocked' || interrupted.session !== session)
        throw new Error('Interrupted combat Save changed the selected pair.');
      owner.close(); owner = await openCleanEpochAccountStore();
      const stillPrior = await owner.readSlot(accountId, 'slot-1');
      if (stillPrior.status !== 'ready' || stillPrior.loaded.publication.publicationId !== priorHead)
        throw new Error('Interrupted combat Save changed the retained account head.');
      const saved = await saveNativeSelectedSession(owner, session, 'slot-1');
      if (saved.status !== 'ready') throw new Error(`Native combat Save blocked: ${saved.message}`);
      owner.close(); owner = await openCleanEpochAccountStore();
      const restarted = await owner.readSlot(accountId, 'slot-1');
      const restartedSnapshot: unknown = restarted.status === 'ready' ? restarted.loaded.snapshot : null;
      if (restarted.status !== 'ready' || !isNativeTargetCampaignSnapshot(restartedSnapshot) ||
          restarted.loaded.publication.publicationId !== saved.publicationId ||
          JSON.stringify(restartedSnapshot.playerState.gear) !== originalGear ||
          restartedSnapshot.gameState.combatHistory[restartedSnapshot.gameState.combatHistory.length - 1]?.result !== 'enemies_victorious' ||
          restartedSnapshot.normalDefeatReceipts?.[0]?.posture !== 'playable')
        throw new Error('Native combat Save/restart lost gear, history or defeat receipt.');
      document.body.dataset.combat = 'pass';
      document.body.dataset.publicationId = saved.publicationId;
      document.body.dataset.gearIds = session.snapshot.playerState.gear.instances.map(item => item.itemInstanceId).join(',');
    }
    if (gameplay) {
      const selected = await owner.readSelected(accountId);
      if (!selected) throw new Error('Native selected account is missing.');
      let session = createNativeSelectedSession({ snapshot: started.value.loaded.snapshot,
        control: started.value.loaded.sessionControl, sourceSlotId: 'slot-1',
        accountRevision: selected.revision });
      const originalGear = JSON.stringify(session.snapshot.playerState.gear);
      const quest = applyNativeSelectedQuest(session,
        createNativeSelectedQuestCommand(session, 'quest.ashen_reef_survey'));
      if (quest.status !== 'accepted') throw new Error(`Native quest was ${quest.status}: ${quest.reason}`);
      session = quest.session;
      const travel = applyNativeSelectedTravel(session,
        createNativeSelectedTravelCommand(session, 'location.ashen_reef'));
      if (travel.status !== 'accepted') throw new Error(`Native travel was ${travel.status}: ${travel.reason}`);
      session = travel.session;
      if (JSON.stringify(session.snapshot.playerState.gear) !== originalGear)
        throw new Error('Quest or travel changed physical gear.');
      const reached = await saveNativeSelectedSession(owner, session, 'slot-1');
      if (reached.status !== 'ready') throw new Error(`Native travel Save blocked: ${reached.message}`);
      session = reached.session;
      const stages = ['sector_1', 'sector_2', 'sector_3', 'ruins_confirmation'];
      for (let index = 0; index < stages.length; index += 1) {
        const prior = session;
        const requestId = `survey_request.12345678-1234-4123-8123-123456789ab${index}`;
        const shift = await advanceNativeSelectedSurvey(owner, session, requestId);
        if (shift.status !== 'accepted' || shift.stage !== stages[index])
          throw new Error(`Native ${stages[index]} was ${shift.status}: ${shift.reason}`);
        const result = shift.session.snapshot.nativeSurvey?.results[index];
        const receipt = shift.session.snapshot.nativeSurvey?.receipts[index];
        if (!result || !receipt || result.stage !== stages[index] ||
            receipt.sourceArtifactId !== prior.sourceAddress.artifactId ||
            receipt.sourcePublicationId !== prior.sourceAddress.publicationId ||
            JSON.stringify(result.sourceWitness.ownerInputs.worn) !==
              JSON.stringify(prior.snapshot.playerState.gear.instances.filter(item => item.location.kind === 'worn')))
          throw new Error(`Native ${stages[index]} witness lost exact physical source provenance.`);
        const duplicate = await advanceNativeSelectedSurvey(owner, shift.session, requestId);
        if (duplicate.status !== 'duplicate' || duplicate.session !== shift.session)
          throw new Error('Native survey duplicate request changed the selected pair.');
        if (JSON.stringify(shift.session.snapshot.playerState.gear) !== originalGear)
          throw new Error(`Native ${stages[index]} changed physical gear.`);
        session = shift.session;
        if (index === 1) {
          owner.close();
          let writes = 0;
          owner = await openCleanEpochAccountStore({ afterWrite: tx => { if (++writes === 1) tx.abort(); } });
          const interrupted = await saveNativeSelectedSession(owner, session, 'slot-1');
          if (interrupted.status !== 'blocked' || interrupted.session !== session)
            throw new Error('Interrupted survey publication changed the caller pair.');
          owner.close(); owner = await openCleanEpochAccountStore();
          const retained = await owner.readSlot(accountId, 'slot-1');
          if (retained.status !== 'ready' ||
              retained.loaded.publication.publicationId !== prior.sourceAddress.publicationId ||
              (await owner.readSelected(accountId))?.revision !== prior.accountRevision)
            throw new Error('Interrupted survey publication changed the retained head.');
        }
        const saved = await saveNativeSelectedSession(owner, session, 'slot-1');
        if (saved.status !== 'ready') throw new Error(`Native ${stages[index]} Save blocked: ${saved.message}`);
        session = saved.session;
        const stale = await advanceNativeSelectedSurvey(owner, prior,
          `survey_request.22345678-1234-4123-8123-123456789ab${index}`);
        if (stale.status !== 'stale' || stale.session !== prior)
          throw new Error('Stale native survey request changed the selected pair.');
      }
      owner.close(); owner = await openCleanEpochAccountStore();
      const restarted = await owner.readSlot(accountId, 'slot-1');
      const restartedSnapshot: unknown = restarted.status === 'ready' ? restarted.loaded.snapshot : null;
      if (restarted.status !== 'ready' ||
          !isNativeTargetCampaignSnapshot(restartedSnapshot) ||
          restartedSnapshot.nativeSurvey?.results.length !== 4 ||
          JSON.stringify(restartedSnapshot.playerState.gear) !== originalGear ||
          restarted.loaded.publication.publicationId !== session.sourceAddress.publicationId)
        throw new Error('Native four-stage survey Save/restart changed retained evidence or gear.');
      const resumed = await new CleanEpochDescendantAdapter(owner).resumeCurrent(accountId, 'slot-1');
      if (resumed.status !== 'blocked') throw new Error('Completed native publication has a pending recovery.');
      document.body.dataset.gameplay = 'pass';
      document.body.dataset.surveyCount = '4';
      document.body.dataset.publicationId = session.sourceAddress.publicationId;
      document.body.dataset.gearIds = session.snapshot.playerState.gear.instances.map(item => item.itemInstanceId).join(',');
    }
    if (new URLSearchParams(location.search).has('host')) {
      const account = await owner.readSelected(accountId);
      if (!account) throw new Error('Synthetic account readback is missing.');
      const selected = createNativeSelectedSession({ snapshot: started.value.loaded.snapshot,
        control: started.value.loaded.sessionControl, sourceSlotId: 'slot-1',
        accountRevision: account.revision });
      const bow = selected.snapshot.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
      if (!bow) throw new Error('Synthetic native Hunter has no physical Short Bow.');
      const moved = applyNativeSelectedItem(selected, { kind: 'gear',
        expectedRevision: selected.snapshot.playerState.gear.revision,
        itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } },
        'native.selected.host.qa.bow');
      if (moved.status !== 'accepted') throw new Error(`Native host action was ${moved.status}.`);
      const duplicate = applyNativeSelectedItem(moved.session, { kind: 'gear',
        expectedRevision: selected.snapshot.playerState.gear.revision,
        itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } },
        'native.selected.host.qa.bow');
      const stale = applyNativeSelectedItem(moved.session, { kind: 'gear',
        expectedRevision: selected.snapshot.playerState.gear.revision,
        itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } },
        'native.selected.host.qa.stale');
      if (duplicate.status !== 'duplicate' || duplicate.session !== moved.session ||
          stale.status !== 'stale' || stale.session !== moved.session)
        throw new Error('Native host duplicate or stale request changed the selected pair.');
      const mismatched = { ...selected, control: moved.session.control };
      const directStaleSave = await new CleanEpochDescendantAdapter(owner).save({
        accountId, sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
        expectedAccountRevision: account.revision, expectedDestinationAddress: selected.sourceAddress,
        snapshot: mismatched.snapshot, control: mismatched.control
      });
      const hostStaleSave = await saveNativeSelectedSession(owner, mismatched, 'slot-1');
      if (directStaleSave.status !== 'blocked' || hostStaleSave.status !== 'blocked' ||
          !hostStaleSave.requiresReload ||
          (await owner.readSelected(accountId))?.revision !== account.revision ||
          (await owner.readSlot(accountId, 'slot-1')).status !== 'ready')
        throw new Error('Stale native snapshot/control pair published or changed the retained head.');
      const staleSave = await saveNativeSelectedSession(owner,
        { ...moved.session, accountRevision: account.revision - 1 }, 'slot-1');
      if (staleSave.status !== 'blocked' || staleSave.session.snapshot !== moved.session.snapshot ||
          (await owner.readSelected(accountId))?.revision !== account.revision)
        throw new Error('Stale account Save changed retained authority.');
      const saved = await saveNativeSelectedSession(owner, moved.session, 'slot-1');
      if (saved.status !== 'ready') throw new Error(`Native host Save was blocked: ${saved.message}`);
      const repeated = await saveNativeSelectedSession(owner, moved.session, 'slot-1');
      if (repeated.status !== 'blocked' || repeated.session !== moved.session ||
          (await owner.readSelected(accountId))?.revision !== saved.session.accountRevision)
        throw new Error('Duplicate native host Save republished or changed retained authority.');
      owner.close(); owner = await openCleanEpochAccountStore();
      const restarted = await owner.readSlot(accountId, 'slot-1');
      if (restarted.status !== 'ready') throw new Error('Native host Save did not restart.');
      const reopened = createNativeSelectedSession({ snapshot: restarted.loaded.snapshot,
        control: restarted.loaded.sessionControl, sourceSlotId: 'slot-1',
        accountRevision: (await owner.readSelected(accountId))!.revision });
      const retainedBow = reopened.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId);
      if (retainedBow?.location.kind !== 'bag' || retainedBow.durability !== bow.durability ||
          saved.publicationId !== reopened.sourceAddress.publicationId)
        throw new Error('Native host Save/restart changed bow identity, durability, location or publication.');
      document.body.dataset.host = 'pass';
      document.body.dataset.bowInstanceId = bow.itemInstanceId;
      document.body.dataset.publicationId = saved.publicationId;
    }
    document.body.dataset.seeded = 'true';
    createRoot(document.getElementById('root')!).render(<EpochApp
      candidateNativeV3={new URLSearchParams(location.search).has('candidate')} />);
  } finally { owner.close(); }
}

if (new URLSearchParams(location.search).has('pre-admission')) {
  preAdmissionQa().catch(error => {
    document.body.dataset.preAdmission = 'error';
    document.getElementById('root')!.textContent = error instanceof Error ? error.message : String(error);
  });
} else if (new URLSearchParams(location.search).has('resume')) {
  document.body.dataset.seeded = 'resume';
  createRoot(document.getElementById('root')!).render(<EpochApp
    candidateNativeV3={new URLSearchParams(location.search).has('candidate')} />);
} else seed().catch(error => {
  document.body.dataset.seeded = 'error';
  document.getElementById('root')!.textContent = error instanceof Error ? error.message : String(error);
});
