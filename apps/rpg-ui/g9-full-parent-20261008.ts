import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { accountLifecycleGeneration, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochLegacyActionAdapter } from './src/game-shell/cleanEpochLegacyActionAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochNormalDefeatRecoveryAdapter } from './src/game-shell/cleanEpochNormalDefeatRecoveryAdapter.ts';
import { resolveNormalDefeat } from '../../packages/engines/game-engine/src/normal-defeat.ts';
import { evaluateAchievementProgress } from '../../packages/engines/game-engine/src/achievements.ts';
import { deserializeSnapshot, serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog,
  startingBundleOptions } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';
import type { CleanEpochAccountStore, CleanEpochAccountRecord } from './src/game-shell/cleanEpochAccountStore.ts';
import { grantLegacy } from '../../packages/engines/game-engine/src/legacy-account.ts';

const out = document.querySelector<HTMLPreElement>('#audit')!;
const databaseName = `lineage.g9.parent.20261008.${crypto.randomUUID()}`;
const password = 'synthetic-independent-password';
let assertions = 0;
const notes: string[] = [];
function assert(value: unknown, label: string): asserts value { assertions++; if (!value) throw new Error(label); }
function note(label: string) { notes.push(label); out.textContent = `RUNNING ${label} (${assertions} assertions)`; }
const accountId = () => `account.local.g9.parent.${crypto.randomUUID()}`;
const requestId = () => crypto.randomUUID();
const form = (name: string, slot: `slot-${number}` = 'slot-1') => {
  const defaults = createDefaultCharacterCreationFormState(slot);
  const colors = getLineageIdentityCatalog(defaults.lineageId)!;
  const continent = getWorldContinentOptions()[0]!;
  const region = getWorldRegionOptions(continent.id)[0]!;
  const settlement = getWorldSettlementOptions({ continentId: continent.id, regionId: region.id,
    backstoryId: '' })[0]!;
  const bundle = startingBundleOptions[0]!;
  return { ...defaults, playerName: name, hairColorId: colors.hairColorOptions[0]!.id,
    eyeColorId: colors.eyeColorOptions[0]!.id, skinToneId: colors.skinToneOptions[0]!.id,
    startingBundleId: bundle.id,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId: continent.id, regionId: region.id, startingSettlementId: settlement.id };
};
async function raw<T>(store: string, key: IDBValidKey, operation: 'get' | 'delete' | 'put', value?: T): Promise<T | undefined> {
  const opened = indexedDB.open(databaseName);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    opened.onsuccess = () => resolve(opened.result); opened.onerror = () => reject(opened.error);
  });
  try {
    const tx = db.transaction(store, operation === 'get' ? 'readonly' : 'readwrite');
    const request = operation === 'get' ? tx.objectStore(store).get(key) :
      operation === 'delete' ? tx.objectStore(store).delete(key) : tx.objectStore(store).put(value);
    return await new Promise<T | undefined>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}
async function register(owner: CleanEpochAccountStore, id = accountId()): Promise<CleanEpochAccountRecord> {
  const adapter = new CleanEpochAccountAdapter(owner);
  const result = await adapter.register({ accountId: id, displayName: `Synthetic ${id.slice(-6)}`,
    password, confirmPassword: password, stayLoggedIn: false });
  assert(result.status === 'ready', `register: ${JSON.stringify(result)}`);
  return result.value.account;
}
async function ready(owner: CleanEpochAccountStore, id: string, name: string, slot: `slot-${number}` = 'slot-1') {
  const result = await new CleanEpochFirstCampaignAdapter(owner).start(id, form(name, slot), false);
  assert(result.status === 'ready', `first campaign: ${JSON.stringify(result)}`);
  return result.value;
}
async function denied(action: () => Promise<unknown>, label: string) {
  let failed = false;
  try { const value = await action(); failed = !!value && typeof value === 'object' &&
    ('status' in value) && (value as { status: string }).status === 'blocked'; }
  catch { failed = true; }
  assert(failed, label);
}
const families = ['newCampaignAttempts', 'pendingPublicationRecoveries',
  'descendantPublicationRecoveries', 'terminalLifecycleRecoveries', 'campaignAttemptsV6',
  'firstPublicationRecoveriesV6', 'currentSlotGenerations', 'addressDeletionReceipts',
  'artifacts', 'controls', 'slots', 'witnesses'];
async function bytes(id: string): Promise<string> {
  const opened = indexedDB.open(databaseName);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    opened.onsuccess = () => resolve(opened.result); opened.onerror = () => reject(opened.error);
  });
  try {
    const rows: unknown[] = [];
    for (const name of ['accounts', 'accountLifecycle', ...families]) {
      const tx = db.transaction(name, 'readonly');
      const request = tx.objectStore(name).getAll();
      const values = await new Promise<unknown[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
      rows.push([name, values.filter(value => !!value && typeof value === 'object' &&
        'accountId' in value && value.accountId === id)]);
    }
    return JSON.stringify(rows);
  } finally { db.close(); }
}
async function corruptPublished(owner: CleanEpochAccountStore, mutation: string,
  kind: 'reset' | 'delete') {
  const account = await register(owner);
  const loaded = await ready(owner, account.accountId, `Graph ${mutation} ${kind}`);
  const id = account.accountId;
  const ctrl = loaded.loaded.sessionControl;
  const accountKey = id;
  const pair: Record<string, [string, IDBValidKey]> = {
    artifact: ['artifacts', [id, ctrl.loadedArtifactId]],
    control: ['controls', [id, ctrl.campaignId]],
    recovery: ['firstPublicationRecoveriesV6', [id, ctrl.campaignId]],
    attempt: ['campaignAttemptsV6', [id, ctrl.campaignId]],
    pointer: ['currentSlotGenerations', [id, 'slot-1']],
    address: ['slots', [id, 'slot-1']]
  };
  if (mutation in pair) {
    const [store, key] = pair[mutation]!;
    await raw(store, key, 'delete');
  } else {
    const row = (await raw<CleanEpochAccountRecord>('accounts', accountKey, 'get'))!;
    const runs = row.profile.history.runRecords.map((run, index) => index !== 0 ? run :
      mutation === 'ghost-run' ? { ...run, saveSlotIds: [...run.saveSlotIds, 'slot-2'] } :
      { ...run, outcome: 'deleted' as const });
    await raw('accounts', accountKey, 'put', { ...row, profile: { ...row.profile,
      history: { ...row.profile.history, runRecords: runs } } });
  }
  const before = await bytes(id);
  let writes = 0;
  const inspector = await openCleanEpochAccountStore({ name: databaseName,
    beforeWrite: () => { writes++; } });
  const current = (await owner.read(id))!;
  await denied(() => inspector.transitionAccount(kind, { accountId: id,
    expectedRevision: current.revision, expectedGeneration: accountLifecycleGeneration(current),
    currentPassword: password, ...(kind === 'delete' ? { requestId: requestId() } : {}) }),
    `${mutation}/${kind} must fail closed`);
  assert(writes === 0, `${mutation}/${kind} wrote before rejecting graph`);
  assert(await bytes(id) === before, `${mutation}/${kind} changed retained bytes`);
  inspector.close();
}
async function run() {
  const owner = await openCleanEpochAccountStore({ name: databaseName });
  const second = await openCleanEpochAccountStore({ name: databaseName });
  try {
    note('A/B first publication and exact recovery');
    const a = await register(owner);
    const b = await register(owner);
    const first = await ready(owner, a.accountId, 'Audit One');
    const firstId = first.loaded.publication.publicationId;
    const repeated = await new CleanEpochFirstCampaignAdapter(second).start(a.accountId, form('Audit One'), false);
    assert(repeated.status === 'ready' && repeated.value.loaded.publication.publicationId === firstId,
      'same creator input must retain one publication after second-owner retry');
    assert((await owner.read(a.accountId))!.revision > a.revision, 'first consumers must advance account');

    note('B retained pending Normal defeat adapter');
    const defeated = await register(owner);
    const firstAdapter = new CleanEpochFirstCampaignAdapter(owner);
    const prepared = await firstAdapter.prepare(defeated.accountId, form('Pending Defeat'), false);
    assert(prepared.status === 'ready', 'prepare retained defeat source');
    const source = deserializeSnapshot(prepared.value.snapshotRaw);
    source.playerState.location.settlementId = null;
    source.playerState.flags = source.playerState.flags.filter(flag => !flag.startsWith('player.start.'));
    source.playerState.resources.hp.current = 0;
    const pending = resolveNormalDefeat(source, { sourceMutationId: `synthetic.mutation.${crypto.randomUUID()}`,
      sourceKind: 'accepted_mutation' });
    assert(pending.receipt.posture === 'recovery_pending', 'fixture must be production-derived pending defeat');
    const projectedPending = evaluateAchievementProgress(pending.snapshot,
      (await owner.read(defeated.accountId))!.profile, { slotId: 'slot-1', touchHistory: true,
        recordedAt: prepared.value.createdAt, suppressLegacyRewards: true }).nextSnapshot;
    const fingerprint = JSON.stringify({ slotId: 'slot-1',
      capturedAtTick: projectedPending.capturedAtTick,
      characterAchievementIds: projectedPending.playerState.achievements.unlocked.map(item => item.achievementId) });
    await raw('campaignAttemptsV6', [defeated.accountId, prepared.value.campaignId], 'put',
      { ...prepared.value, snapshotRaw: serializeSnapshot(projectedPending),
        consumerPlans: prepared.value.consumerPlans.map(plan =>
          ['active_history', 'account_achievements', 'legacy_rewards', 'last_played'].includes(plan.kind)
            ? { ...plan, payloadFingerprint: fingerprint } : plan) });
    const retainedPending = await firstAdapter.resume(defeated.accountId, 'slot-1');
    assert(retainedPending.status === 'ready', `publish retained pending source: ${JSON.stringify(retainedPending)}`);
    const pendingControl = retainedPending.value.loaded.sessionControl;
    const pendingAccount = (await owner.read(defeated.accountId))!;
    const defeatRequest = { accountId: defeated.accountId, sourceSlotId: 'slot-1' as const,
      destinationSlotId: 'slot-1' as const,
      expectedDestinationAddress: { artifactId: pendingControl.loadedArtifactId,
        publicationId: pendingControl.loadedPublicationId },
      expectedAccountRevision: pendingAccount.revision, snapshot: retainedPending.value.loaded.snapshot,
      control: pendingControl, receiptId: pending.receipt.receiptId };
    const recovered = await new CleanEpochNormalDefeatRecoveryAdapter(second).recover(defeatRequest);
    assert(recovered.status === 'ready', `recover pending defeat: ${JSON.stringify(recovered)}`);
    const repeatDefeat = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover(defeatRequest);
    assert(repeatDefeat.status === 'ready' && repeatDefeat.value.loaded.publication.publicationId ===
      recovered.value.loaded.publication.publicationId, 'exact pending receipt retry returns one descendant');
    const defeatBytes = await bytes(defeated.accountId);
    const badReceipt = await new CleanEpochNormalDefeatRecoveryAdapter(second).recover({ ...defeatRequest,
      receiptId: `unrelated.${crypto.randomUUID()}` });
    assert(badReceipt.status === 'blocked', 'different defeat receipt must reject');
    const badDestination = await new CleanEpochNormalDefeatRecoveryAdapter(second).recover({ ...defeatRequest,
      explicitDestinationId: `settlement.unseen.${crypto.randomUUID()}` });
    assert(badDestination.status === 'blocked', 'unseen recovery destination must reject');
    assert(await bytes(defeated.accountId) === defeatBytes, 'bad defeat requests cannot mutate retained campaign');

    note('C account credential and Legacy revision');
    const account = (await owner.read(a.accountId))!;
    const legacy = new CleanEpochLegacyActionAdapter(second);
    const award = grantLegacy(account.profile, { amount: 100, summary: 'Independent synthetic award',
      sourceType: 'qa', sourceId: `g9-parent-${crypto.randomUUID()}`,
      recordedAt: new Date().toISOString() });
    assert(award.ok, 'synthetic Legacy award');
    const granted = await owner.updateProfile(a.accountId, account.revision, award.profile);
    const capture = granted.readback;
    const purchase = { accountId: a.accountId, expectedRevision: capture.revision,
      expectedProfile: capture.profile, action: { kind: 'purchase' as const,
        unlockId: 'legacy.unlock.account.starting_hp', recordedAt: new Date().toISOString() } };
    const bought = await legacy.apply(purchase);
    assert(bought.status === 'ready' && bought.writeStatus === 'committed',
      `first Legacy purchase: ${JSON.stringify(bought)}`);
    const duplicate = await legacy.apply(purchase);
    assert(duplicate.status === 'ready' && duplicate.writeStatus === 'same_source_retry', 'same Legacy action retry');
    const competing = await legacy.apply({ ...purchase, action: { ...purchase.action,
      unlockId: 'legacy.unlock.account.starting_coin' } });
    assert(competing.status === 'blocked', 'same captured revision cannot buy a different unlock');
    assert((await owner.read(a.accountId))!.profile.legacy.legacyPoints === bought.account.profile.legacy.legacyPoints,
      'competing purchase cannot spend twice');
    const credentials = new CleanEpochAccountAdapter(owner);
    const stalePassword = await credentials.changePassword({ accountId: a.accountId,
      expectedRevision: capture.revision, currentPassword: password, newPassword: 'new-secret',
      confirmPassword: 'new-secret' });
    assert(stalePassword.status === 'blocked', 'stale credential edit must lose CAS');
    const current = (await owner.read(a.accountId))!;
    const changed = await credentials.changePassword({ accountId: a.accountId,
      expectedRevision: current.revision, currentPassword: password,
      newPassword: 'new-secret', confirmPassword: 'new-secret' });
    assert(changed.status === 'ready', 'current credential edit');
    const oldSignIn = await credentials.signIn({ accountId: a.accountId, password, stayLoggedIn: false });
    assert(oldSignIn.status === 'blocked', 'old credential cannot sign in');
    const pendingEdit = await register(owner);
    const pendingFirst = await new CleanEpochFirstCampaignAdapter(owner).prepare(pendingEdit.accountId,
      form('Prepared Fence'), false);
    assert(pendingFirst.status === 'ready', 'prepared first campaign');
    const pendingRecord = (await owner.read(pendingEdit.accountId))!;
    const fenced = await new CleanEpochAccountAdapter(second).updateProfile(pendingEdit.accountId,
      pendingRecord.revision, { ...pendingRecord.profile, updatedAt: new Date().toISOString() });
    assert(fenced.status === 'blocked', 'prepared publication must fence account edit');
    assert((await owner.read(pendingEdit.accountId))!.revision === pendingRecord.revision,
      'blocked prepared edit cannot advance revision');

    note('D retirement and settlement');
    const beforeRetire = (await owner.read(a.accountId))!;
    const terminal = new CleanEpochTerminalAdapter(second);
    const control = first.loaded.sessionControl;
    const retirement = { accountId: a.accountId, sourceSlotId: 'slot-1' as const,
      expectedAccountRevision: beforeRetire.revision, snapshot: first.loaded.snapshot, control,
      expectedSourceAddress: { artifactId: control.loadedArtifactId,
        publicationId: control.loadedPublicationId } };
    const retired = await terminal.retire(retirement);
    assert(retired.status === 'completed', `retirement: ${JSON.stringify(retired)}`);
    assert((await owner.readSlot(a.accountId, 'slot-1')).status === 'closed', 'terminal head closed');
    const sameTerminal = await new CleanEpochTerminalAdapter(owner).retire(retirement);
    assert(sameTerminal.status === 'completed' &&
      sameTerminal.recovery.publicationId === retired.recovery.publicationId,
      'exact terminal retry returns one settlement');
    const closed = await owner.closeTerminalAddresses(a.accountId,
      retired.recovery.campaignId, retired.recovery.publicationId,
      (await owner.read(a.accountId))!.revision, new Date().toISOString());
    assert(closed.status === 'committed' && (await owner.readSlot(a.accountId, 'slot-1')).status === 'empty',
      'terminal address closure follows settlement');
    assert((await owner.readTerminalRecovery(a.accountId, retired.recovery.campaignId,
      retired.recovery.publicationId))?.status === 'settlement_completed',
      'terminal closure keeps completed settlement');
    const terminalBytes = await bytes(a.accountId);
    const staleTerminal = await new CleanEpochTerminalAdapter(owner).retire({ ...retirement,
      expectedAccountRevision: retirement.expectedAccountRevision + 1 });
    assert(staleTerminal.status === 'blocked', 'changed terminal retry must conflict');
    assert(await bytes(a.accountId) === terminalBytes, 'changed terminal retry preserves settled bytes');
    const abortedAccount = await register(owner);
    const abortedSource = await ready(owner, abortedAccount.accountId, 'Abort Retirement');
    const abortBefore = (await owner.read(abortedAccount.accountId))!;
    const abortControl = abortedSource.loaded.sessionControl;
    const abortBytes = await bytes(abortedAccount.accountId);
    const rejectingOwner = await openCleanEpochAccountStore({ name: databaseName,
      beforeWrite: tx => { tx.abort(); } });
    const rejectedTerminal = await new CleanEpochTerminalAdapter(rejectingOwner).retire({
      accountId: abortedAccount.accountId, sourceSlotId: 'slot-1',
      expectedAccountRevision: abortBefore.revision, snapshot: abortedSource.loaded.snapshot,
      control: abortControl, expectedSourceAddress: { artifactId: abortControl.loadedArtifactId,
        publicationId: abortControl.loadedPublicationId } });
    assert(rejectedTerminal.status === 'blocked', 'terminal first-write abort must block');
    assert(await bytes(abortedAccount.accountId) === abortBytes, 'terminal abort must leave exact source bytes');
    rejectingOwner.close();

    note('E address deletion and historical reuse');
    const e = await register(owner);
    const eFirst = await ready(owner, e.accountId, 'Reusable');
    const eBefore = (await owner.read(e.accountId))!;
    const pointer = (await owner.readSlotGeneration(e.accountId, 'slot-1'))!;
    const eControl = eFirst.loaded.sessionControl;
    const addressRequest = { accountId: e.accountId, slotId: 'slot-1' as const,
      expectedAccountRevision: eBefore.revision, expectedSlotGenerationId: pointer.slotGenerationId,
      expectedAddress: { artifactId: eControl.loadedArtifactId,
        publicationId: eControl.loadedPublicationId }, deletedAt: new Date().toISOString() };
    const removed = await owner.deleteSlotAddress(addressRequest);
    assert(removed.status === 'committed' && (await owner.readSlot(e.accountId, 'slot-1')).status === 'empty',
      'address deletion empties physical slot');
    assert((await owner.readHistoricalFirstRecovery(e.accountId, eControl.campaignId)).status === 'consumers_completed',
      'deleted address keeps first publication history');
    const reused = await ready(owner, e.accountId, 'Replacement');
    const replacementId = reused.loaded.sessionControl.loadedArtifactId;
    const oldRetry = await second.deleteSlotAddress(addressRequest);
    assert(oldRetry.status === 'same_source_retry', 'historical address deletion exact retry');
    assert((await owner.readSlot(e.accountId, 'slot-1')).status === 'ready' &&
      (await owner.readSlot(e.accountId, 'slot-1')).loaded.sessionControl.loadedArtifactId === replacementId,
      'old retry cannot delete reoccupied slot');
    await denied(() => second.deleteSlotAddress({ ...addressRequest, deletedAt: new Date(Date.now() + 60000).toISOString() }),
      'changed historical address request must conflict');
    const twoAddress = await register(owner);
    const sourceAddress = await ready(owner, twoAddress.accountId, 'Two Addresses');
    const beforeCopy = (await owner.read(twoAddress.accountId))!;
    const copied = await new CleanEpochDescendantAdapter(second).save({ accountId: twoAddress.accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-2', expectedDestinationAddress: null,
      expectedAccountRevision: beforeCopy.revision, snapshot: sourceAddress.loaded.snapshot,
      control: sourceAddress.loaded.sessionControl });
    assert(copied.status === 'ready', `cross-slot descendant: ${JSON.stringify(copied)}`);
    const sourcePointer = (await owner.readSlotGeneration(twoAddress.accountId, 'slot-1'))!;
    const beforeOneDelete = (await owner.read(twoAddress.accountId))!;
    const oneDeleted = await owner.deleteSlotAddress({ accountId: twoAddress.accountId, slotId: 'slot-1',
      expectedAccountRevision: beforeOneDelete.revision, expectedSlotGenerationId: sourcePointer.slotGenerationId,
      expectedAddress: { artifactId: sourceAddress.loaded.sessionControl.loadedArtifactId,
        publicationId: sourceAddress.loaded.sessionControl.loadedPublicationId },
      deletedAt: new Date().toISOString() });
    assert(oneDeleted.status === 'committed' && (await owner.readSlot(twoAddress.accountId, 'slot-2')).status === 'ready',
      'one address deletion retains the other');
    assert((await owner.read(twoAddress.accountId))!.profile.history.runRecords.some(run =>
      run.saveSlotIds.includes('slot-2') && !run.saveSlotIds.includes('slot-1')),
      'run membership follows surviving address');
    const lineage = await register(owner);
    const lineageFirst = await ready(owner, lineage.accountId, 'Retired Source');
    const priorLineage = (await owner.read(lineage.accountId))!;
    const run = priorLineage.profile.history.runRecords[0]!;
    const retainedRetired = { ...run, outcome: 'retired' as const,
      archiveReason: 'retired' as const, endedAt: new Date().toISOString(),
      inheritanceUsesRemaining: 1 };
    const retiredLineage = await owner.updateProfile(lineage.accountId, priorLineage.revision,
      { ...priorLineage.profile, history: { ...priorLineage.profile.history,
        runRecords: [retainedRetired] } });
    const heir = form('Heir From Retired', 'slot-2');
    heir.sourceRunId = `${retainedRetired.characterId}::${retainedRetired.startedAt}`;
    const heirFirst = await new CleanEpochFirstCampaignAdapter(second).start(lineage.accountId, heir, false);
    assert(heirFirst.status === 'ready', `retired inheritance: ${JSON.stringify(heirFirst)}`);
    const afterHeir = (await owner.read(lineage.accountId))!;
    assert(afterHeir.profile.history.runRecords.find(item => item.characterId === retainedRetired.characterId)
      ?.inheritanceUsesRemaining === 0, 'retired inheritance consumed once');
    const duplicateHeir = await new CleanEpochFirstCampaignAdapter(owner).start(lineage.accountId, heir, false);
    assert(duplicateHeir.status === 'ready' &&
      (await owner.read(lineage.accountId))!.revision === afterHeir.revision,
      'heir exact retry cannot consume twice');

    note('F whole-account reset and delete');
    const f = await register(owner);
    await ready(owner, f.accountId, 'Resettable');
    const fCurrent = (await owner.read(f.accountId))!;
    const reset = await new CleanEpochAccountAdapter(second).resetAccount({ accountId: f.accountId,
      expectedRevision: fCurrent.revision, expectedGeneration: accountLifecycleGeneration(fCurrent),
      password, stayLoggedIn: false });
    assert(reset.status === 'ready', `reset: ${JSON.stringify(reset)}`);
    assert(accountLifecycleGeneration(reset.value.account) === 2 &&
      (await owner.readSlot(f.accountId, 'slot-1')).status === 'empty',
      'reset advances generation and clears campaign');
    const oldRegistration = await new CleanEpochAccountAdapter(owner).register({ accountId: f.accountId,
      displayName: f.profile.displayName, password, confirmPassword: password, stayLoggedIn: false });
    assert(oldRegistration.status === 'blocked', 'old registration retry cannot select reset generation');
    const beforeDelete = (await owner.read(f.accountId))!;
    const deleteInput = { accountId: f.accountId, expectedRevision: beforeDelete.revision,
      expectedGeneration: accountLifecycleGeneration(beforeDelete), password, requestId: requestId() };
    const deleted = await new CleanEpochAccountAdapter(second).deleteAccount(deleteInput);
    assert(deleted.status === 'ready' && await owner.read(f.accountId) === null, 'delete removes account');
    const receipt = await owner.readLifecycleReceipt(f.accountId);
    assert(receipt?.version === 2 && receipt.kind === 'delete' && receipt.requestId === deleteInput.requestId,
      'version-2 tombstone binds exact request');
    const exact = await new CleanEpochAccountAdapter(owner).deleteAccount(deleteInput);
    assert(exact.status === 'ready', 'second owner exact tombstone retry');
    const rival = await new CleanEpochAccountAdapter(owner).deleteAccount({ ...deleteInput, requestId: requestId() });
    assert(rival.status === 'blocked', 'competing request cannot claim tombstone');
    assert(JSON.stringify(await owner.read(b.accountId)) === JSON.stringify(b),
      'other account bytes unchanged by lifecycle scenarios');

    note('F1-F4 independent paired graph corruptions');
    for (const mutation of ['artifact', 'control', 'recovery', 'attempt', 'pointer',
      'address', 'ghost-run', 'deleted-live-run']) {
      await corruptPublished(owner, mutation, 'reset');
      await corruptPublished(owner, mutation, 'delete');
    }
    assert(JSON.stringify(await owner.read(b.accountId)) === JSON.stringify(b),
      'graph probes never touched the other account');

    note('F2/F3 historical graph and malformed tombstones');
    for (const kind of ['reset', 'delete'] as const) {
      const gonePointer = await register(owner);
      const goneFirst = await ready(owner, gonePointer.accountId, `Deleted Pointer ${kind}`);
      const old = (await owner.read(gonePointer.accountId))!;
      const oldPointer = (await owner.readSlotGeneration(gonePointer.accountId, 'slot-1'))!;
      const oldControl = goneFirst.loaded.sessionControl;
      await owner.deleteSlotAddress({ accountId: gonePointer.accountId, slotId: 'slot-1',
        expectedAccountRevision: old.revision, expectedSlotGenerationId: oldPointer.slotGenerationId,
        expectedAddress: { artifactId: oldControl.loadedArtifactId,
          publicationId: oldControl.loadedPublicationId }, deletedAt: new Date().toISOString() });
      await raw('currentSlotGenerations', [gonePointer.accountId, 'slot-1'], 'delete');
      const before = await bytes(gonePointer.accountId);
      let writes = 0;
      const inspector = await openCleanEpochAccountStore({ name: databaseName,
        beforeWrite: () => { writes++; } });
      const current = (await owner.read(gonePointer.accountId))!;
      await denied(() => inspector.transitionAccount(kind, { accountId: gonePointer.accountId,
        expectedRevision: current.revision, expectedGeneration: accountLifecycleGeneration(current),
        currentPassword: password, ...(kind === 'delete' ? { requestId: requestId() } : {}) }),
        `missing deleted pointer ${kind}`);
      assert(writes === 0 && await bytes(gonePointer.accountId) === before,
        `missing deleted pointer ${kind} must reject before mutation`);
      inspector.close();

      const forged = await register(owner);
      const forgedFirst = await ready(owner, forged.accountId, `Forged Prior ${kind}`);
      const beforeDescendant = (await owner.read(forged.accountId))!;
      const descendant = await new CleanEpochDescendantAdapter(owner).save({ accountId: forged.accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'slot-2', expectedDestinationAddress: null,
        expectedAccountRevision: beforeDescendant.revision, snapshot: forgedFirst.loaded.snapshot,
        control: forgedFirst.loaded.sessionControl });
      assert(descendant.status === 'ready', `forged setup ${kind}`);
      const pub = descendant.value.loaded.publication;
      const key = [forged.accountId, forgedFirst.loaded.sessionControl.campaignId, pub.publicationId];
      const recovery = (await raw<Record<string, unknown>>('descendantPublicationRecoveries', key, 'get'))!;
      await raw('descendantPublicationRecoveries', key, 'put', { ...recovery,
        expectedSlotAddress: { artifactId: 'artifact.nonexistent', publicationId: 'publication.nonexistent' } });
      const beforeForge = await bytes(forged.accountId);
      let forgeWrites = 0;
      const forgeOwner = await openCleanEpochAccountStore({ name: databaseName,
        beforeWrite: () => { forgeWrites++; } });
      const forgedCurrent = (await owner.read(forged.accountId))!;
      await denied(() => forgeOwner.transitionAccount(kind, { accountId: forged.accountId,
        expectedRevision: forgedCurrent.revision, expectedGeneration: accountLifecycleGeneration(forgedCurrent),
        currentPassword: password, ...(kind === 'delete' ? { requestId: requestId() } : {}) }),
        `forged descendant prior destination ${kind}`);
      assert(forgeWrites === 0 && await bytes(forged.accountId) === beforeForge,
        `forged descendant prior destination ${kind} changed bytes`);
      forgeOwner.close();
    }
    const malformed = await register(owner);
    const malformedInput = { accountId: malformed.accountId, expectedRevision: malformed.revision,
      expectedGeneration: 1, currentPassword: password, requestId: requestId() };
    await owner.transitionAccount('delete', malformedInput);
    const retained = (await raw<Record<string, unknown>>('accountLifecycle', malformed.accountId, 'get'))!;
    await raw('accountLifecycle', malformed.accountId, 'put', { ...retained, requestId: 'bad request' });
    await denied(() => second.readLifecycleReceipt(malformed.accountId), 'malformed v2 tombstone');
    const legacyTomb = await register(owner);
    const legacyInput = { accountId: legacyTomb.accountId, expectedRevision: legacyTomb.revision,
      expectedGeneration: 1, currentPassword: password, requestId: requestId() };
    await owner.transitionAccount('delete', legacyInput);
    const oldTombstone = (await raw<Record<string, unknown>>('accountLifecycle', legacyTomb.accountId, 'get'))!;
    const { requestId: _discard, ...legacyReceipt } = oldTombstone;
    await raw('accountLifecycle', legacyTomb.accountId, 'put', { ...legacyReceipt, version: 1 });
    assert((await second.readLifecycleReceipt(legacyTomb.accountId))?.version === 1,
      'legacy tombstone remains readable');
    await denied(() => new CleanEpochAccountAdapter(second).deleteAccount({ accountId: legacyTomb.accountId,
      expectedRevision: legacyTomb.revision, expectedGeneration: 1, password,
      requestId: legacyInput.requestId }), 'legacy tombstone cannot claim a new exact request');

    note('F4 all observed destructive writes under abort and quota');
    const counted = await register(owner);
    await ready(owner, counted.accountId, 'Write Count');
    const countedCurrent = (await owner.read(counted.accountId))!;
    let writeCount = 0;
    const counterOwner = await openCleanEpochAccountStore({ name: databaseName,
      beforeWrite: () => { writeCount++; } });
    await counterOwner.transitionAccount('reset', { accountId: counted.accountId,
      expectedRevision: countedCurrent.revision,
      expectedGeneration: accountLifecycleGeneration(countedCurrent), currentPassword: password });
    counterOwner.close();
    assert(writeCount >= 6, `destructive write count unexpectedly small: ${writeCount}`);
    for (const kind of ['reset', 'delete'] as const)
      for (const fault of ['abort', 'quota'] as const)
        for (let position = 1; position <= writeCount; position++) {
          const subject = await register(owner);
          await ready(owner, subject.accountId, `Fault ${kind} ${fault} ${position}`);
          const current = (await owner.read(subject.accountId))!;
          const prior = await bytes(subject.accountId);
          let writes = 0;
          const faultOwner = await openCleanEpochAccountStore({ name: databaseName,
            beforeWrite: tx => {
              if (++writes !== position) return;
              if (fault === 'abort') tx.abort();
              else throw new DOMException('Synthetic quota', 'QuotaExceededError');
            } });
          await denied(() => faultOwner.transitionAccount(kind, { accountId: subject.accountId,
            expectedRevision: current.revision, expectedGeneration: accountLifecycleGeneration(current),
            currentPassword: password, ...(kind === 'delete' ? { requestId: requestId() } : {}) }),
            `${kind} ${fault} write ${position} must fail`);
          assert(writes === position && await bytes(subject.accountId) === prior,
            `${kind} ${fault} write ${position} left partial bytes`);
          faultOwner.close();
        }
    notes.push(`fault positions: ${writeCount} per transition, abort and quota for reset and delete`);

    note('F4 lost post-commit acknowledgement and exact restarted retry');
    for (const kind of ['reset', 'delete'] as const) {
      const subject = await register(owner);
      await ready(owner, subject.accountId, `Lost Ack ${kind}`);
      const current = (await owner.read(subject.accountId))!;
      const input = { accountId: subject.accountId, expectedRevision: current.revision,
        expectedGeneration: accountLifecycleGeneration(current), currentPassword: password,
        ...(kind === 'delete' ? { requestId: requestId() } : {}) };
      const unreliable = await openCleanEpochAccountStore({ name: databaseName });
      const originalRead = unreliable.readLifecycleReceipt.bind(unreliable);
      let lost = true;
      unreliable.readLifecycleReceipt = async id => {
        if (id === subject.accountId && lost) { lost = false; throw new Error('Synthetic receipt readback loss'); }
        return originalRead(id);
      };
      await denied(() => unreliable.transitionAccount(kind, input), `${kind} lost readback must surface failure`);
      const accepted = await second.readLifecycleReceipt(subject.accountId);
      assert(accepted?.kind === kind, `${kind} committed before readback loss`);
      const retry = await second.transitionAccount(kind, input);
      assert(retry.status === 'same_source_retry' && retry.receipt.completedGeneration === accepted.completedGeneration,
        `${kind} exact restarted retry reuses durable receipt`);
      unreliable.close();
    }
    assert(JSON.stringify(await owner.read(b.accountId)) === JSON.stringify(b),
      'fault injection preserved independent other account');

    note('F3 coherent prepared, pending, descendant and terminal erasure');
    for (const kind of ['reset', 'delete'] as const)
      for (const state of ['prepared', 'pending-first', 'descendant', 'pending-descendant',
        'terminal', 'pending-terminal', 'deleted-address', 'reused-slot'] as const) {
        const subject = await register(owner);
        const first = new CleanEpochFirstCampaignAdapter(owner);
        let slot = null as Awaited<ReturnType<typeof ready>> | null;
        if (state === 'prepared' || state === 'pending-first') {
          const prepared = await first.prepare(subject.accountId, form(`Coherent ${state}`), false);
          assert(prepared.status === 'ready', `${state} prepare`);
          if (state === 'pending-first') {
            const original = owner.completePreparedAttemptConsumers.bind(owner);
            owner.completePreparedAttemptConsumers = async () => { throw new Error('Synthetic pending first'); };
            try {
              const interrupted = await first.resume(subject.accountId, 'slot-1');
              assert(interrupted.status === 'blocked', 'first publication interrupted after acceptance');
            } finally { owner.completePreparedAttemptConsumers = original; }
            assert((await owner.readRecovery(subject.accountId, 'slot-1'))?.status === 'accepted_pending_consumers',
              'pending first recovery retained');
          }
        } else {
          slot = await ready(owner, subject.accountId, `Coherent ${state}`);
          if (state === 'descendant' || state === 'pending-descendant') {
            const source = (await owner.read(subject.accountId))!;
            const adapter = new CleanEpochDescendantAdapter(owner);
            const original = owner.completeDescendantConsumers.bind(owner);
            if (state === 'pending-descendant')
              owner.completeDescendantConsumers = async () => { throw new Error('Synthetic pending descendant'); };
            try {
              const saved = await adapter.save({ accountId: subject.accountId,
                sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
                expectedAccountRevision: source.revision, snapshot: slot.loaded.snapshot,
                control: slot.loaded.sessionControl });
              assert(saved.status === (state === 'descendant' ? 'ready' : 'blocked'),
                `${state} setup: ${JSON.stringify(saved)}`);
            } finally { owner.completeDescendantConsumers = original; }
            if (state === 'pending-descendant')
              assert((await owner.readCurrentDescendantRecovery(subject.accountId, 'slot-1'))
                ?.status === 'accepted_pending_consumers', 'pending descendant recovery retained');
          } else if (state === 'terminal' || state === 'pending-terminal') {
            const source = (await owner.read(subject.accountId))!;
            const control = slot.loaded.sessionControl;
            const original = owner.completeTerminalSettlement.bind(owner);
            if (state === 'pending-terminal')
              owner.completeTerminalSettlement = async () => { throw new Error('Synthetic pending terminal'); };
            try {
              const terminal = await new CleanEpochTerminalAdapter(owner).retire({
                accountId: subject.accountId, sourceSlotId: 'slot-1',
                expectedAccountRevision: source.revision, snapshot: slot.loaded.snapshot,
                control, expectedSourceAddress: { artifactId: control.loadedArtifactId,
                  publicationId: control.loadedPublicationId } });
              assert(terminal.status === (state === 'terminal' ? 'completed' : 'blocked'),
                `${state} setup: ${JSON.stringify(terminal)}`);
            } finally { owner.completeTerminalSettlement = original; }
            if (state === 'pending-terminal')
              assert((await owner.readPendingTerminalForAccount(subject.accountId))?.status ===
                'accepted_pending_settlement', 'pending terminal recovery retained');
          } else if (state === 'deleted-address' || state === 'reused-slot') {
            const source = (await owner.read(subject.accountId))!;
            const pointer = (await owner.readSlotGeneration(subject.accountId, 'slot-1'))!;
            const control = slot.loaded.sessionControl;
            const deleted = await owner.deleteSlotAddress({ accountId: subject.accountId,
              slotId: 'slot-1', expectedAccountRevision: source.revision,
              expectedSlotGenerationId: pointer.slotGenerationId,
              expectedAddress: { artifactId: control.loadedArtifactId,
                publicationId: control.loadedPublicationId }, deletedAt: new Date().toISOString() });
            assert(deleted.status === 'committed', `${state} deletion setup`);
            if (state === 'reused-slot') await ready(owner, subject.accountId, 'Reoccupied Graph');
          }
        }
        const current = (await owner.read(subject.accountId))!;
        const result = await owner.transitionAccount(kind, { accountId: subject.accountId,
          expectedRevision: current.revision, expectedGeneration: accountLifecycleGeneration(current),
          currentPassword: password, ...(kind === 'delete' ? { requestId: requestId() } : {}) });
        assert(result.status === 'committed', `${kind} coherent ${state} should commit`);
        const after = JSON.parse(await bytes(subject.accountId)) as [string, unknown[]][];
        assert(after.slice(2).every(([, rows]) => rows.length === 0),
          `${kind} coherent ${state} left account data rows`);
      }
    assert(JSON.stringify(await owner.read(b.accountId)) === JSON.stringify(b),
      'coherent lifecycle matrix preserved other account');
    note('owner baseline complete');
    out.textContent = `PASS ${assertions} independent assertions\n${notes.join('\n')}`;
  } finally { owner.close(); second.close(); }
}
run().catch(error => { out.textContent = `FAIL ${assertions} after ${notes.at(-1)}: ${error instanceof Error ? error.stack : String(error)}`; });
