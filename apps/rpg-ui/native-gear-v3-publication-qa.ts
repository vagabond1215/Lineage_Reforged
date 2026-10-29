import { createDefaultCharacterCreationFormState, validateCharacterCreationForm } from './src/game-shell/characterCreationForm.js';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.js';
import { getDefaultWorldSelection } from './src/game-shell/worldSelectionCatalog.js';
import { createNativeNewGameSnapshot } from './src/game-shell/nativeNewGameSnapshot.js';
import { buildNativeGearArtifactPublication, readNativeFreshSaveSnapshot } from './src/game-shell/saveManager.js';
import { readRetainedNativeSurveyMaterial } from './src/game-shell/nativeSurveyRetainedSource.js';
import { commitNativeSurveyFirstShift, commitNativeSurveyShift } from '../../packages/engines/game-engine/src/native-survey-ledger.js';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from '../../packages/engines/game-engine/src/player-quest-acceptance.js';
import { createPlayerTravelCommand, executePlayerTravelCommand } from '../../packages/engines/game-engine/src/player-travel.js';
import { openCampaignIndexedDbStore, CampaignIndexedDbStore, CampaignStoreError } from './src/game-shell/campaignIndexedDbStore.js';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.js';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.js';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.js';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.js';
import { CleanEpochNormalDefeatRecoveryAdapter } from './src/game-shell/cleanEpochNormalDefeatRecoveryAdapter.js';
import { resolveNormalDefeat } from '../../packages/engines/game-engine/src/normal-defeat.js';
import { admitCampaignMutation, completePendingNormalDefeatRecovery,
  createCampaignSessionControl } from '../../packages/engines/game-engine/src/campaign-session.js';
import type { CampaignSessionControl } from '../../packages/engines/game-engine/src/campaign-session.js';
import { prepareCharacterAchievementProgress } from '../../packages/engines/game-engine/src/achievements.js';
import { createAuthorityId } from '../../packages/engines/game-engine/src/campaign-rules.js';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.js';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.js';
import type { SaveSlotId } from './src/game-shell/state.js';
import { isNativeTargetCampaignSnapshot } from '../../packages/engines/game-engine/src/native-campaign-rules.js';
import type { SaveSnapshot } from '../../packages/shared/types/src/index.js';

const output = document.querySelector<HTMLPreElement>('#result')!;
const passed: string[] = [];
const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
const native = (snapshot: unknown) => {
  check(isNativeTargetCampaignSnapshot(snapshot), 'expected native v3 snapshot');
  if (!isNativeTargetCampaignSnapshot(snapshot)) throw new Error('Expected native v3 snapshot.');
  return snapshot;
};
const name = () => `lineage.native-v3.qa.${crypto.randomUUID()}`;
const id = (kind: string) => `${kind}.${crypto.randomUUID()}`;
const formFixture = () => {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const world = getDefaultWorldSelection('backstory.local');
  const form = {
    ...createDefaultCharacterCreationFormState('slot-1'),
    playerName: 'Native Publication QA',
    hairColorId: identity.hairColorOptions[0]!.id,
    eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id,
    backstoryId: 'backstory.local', continentId: world.continentId,
    regionId: world.regionId, startingSettlementId: world.settlementId,
    startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  };
  check(Object.keys(validateCharacterCreationForm(form).errors).length === 0, 'fixture form invalid');
  return form;
};
const fixture = (accountId: string) => createNativeNewGameSnapshot(formFixture(), accountId);
async function attempt(snapshot: ReturnType<typeof fixture>, expectedHead: { artifactId: string; publicationId: string; revision: number } | null) {
  return buildNativeGearArtifactPublication(snapshot, 'slot-1', {
    artifactId: id('artifact'), generationId: id('generation'),
    publicationId: id('publication'), savedAt: new Date().toISOString(), expectedHead,
    expectedSlotAddress: expectedHead && { artifactId: expectedHead.artifactId, publicationId: expectedHead.publicationId }
  });
}
async function test(label: string, run: () => Promise<void>) { await run(); passed.push(label); output.textContent = `PASS ${passed.length}\n${passed.join('\n')}`; }
async function rejectCode(run: () => Promise<unknown>, code: string) {
  try { await run(); } catch (error) {
    check(error instanceof CampaignStoreError && error.code === code, `expected ${code}: ${String(error)}`);
    return;
  }
  throw new Error(`expected ${code} rejection`);
}
async function suite() {
  await test('native creator HP-zero command retains pending defeat before recovery', async () => {
    const dbName = name(); const accountId = id('account'); const slotId: SaveSlotId = 'slot-1';
    let owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Pending Defeat QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(first.status === 'ready', 'real native creator did not publish');
    if (first.status !== 'ready') return;
    const firstSnapshot = native(first.value.loaded.snapshot);
    const withoutSafeSettlement = structuredClone(firstSnapshot);
    withoutSafeSettlement.playerState.location.settlementId = null;
    withoutSafeSettlement.playerState.flags = withoutSafeSettlement.playerState.flags.filter(flag =>
      !flag.startsWith('player.start.'));
    withoutSafeSettlement.sessionState.knownLocations = [{ id: 'location.recovery_haven',
      name: 'Recovery Haven', regionLabel: 'Test March', settlementId: 'settlement.recovery_haven',
      regionId: 'region.test_march', type: 'settlement', x: 1, y: 1,
      note: 'Synthetic recovery destination.', known: true }];
    const firstControl = first.value.loaded.sessionControl as CampaignSessionControl<typeof firstSnapshot>;
    const staged = admitCampaignMutation(firstControl, {
      mutationId: 'mutation.native.prepare_defeat.qa', sourceArtifactId: firstControl.loadedArtifactId,
      sourceRevision: firstControl.sessionRevision, ownerKind: 'engine_result', accepted: true,
      sourceSnapshot: firstSnapshot, proposedSnapshot: withoutSafeSettlement,
      validateNativeSnapshot: isNativeTargetCampaignSnapshot
    });
    check(staged.accepted, 'pre-defeat owner mutation was not admitted');
    const retained = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: slotId, destinationSlotId: slotId, expectedAccountRevision: 2,
      snapshot: staged.snapshot, control: staged.control });
    check(retained.status === 'ready', `pre-defeat descendant did not publish: ${JSON.stringify(retained)}`);
    if (retained.status !== 'ready') return;
    const current = native(retained.value.loaded.snapshot);
    const currentControl = retained.value.loaded.sessionControl as CampaignSessionControl<typeof current>;
    const lethal = structuredClone(current);
    lethal.playerState.resources.hp.current = 0;
    const defeated = admitCampaignMutation(currentControl, {
      mutationId: 'mutation.native.real_defeat.qa', sourceArtifactId: currentControl.loadedArtifactId,
      sourceRevision: currentControl.sessionRevision, ownerKind: 'engine_result', accepted: true,
      sourceSnapshot: current, proposedSnapshot: lethal,
      validateNativeSnapshot: isNativeTargetCampaignSnapshot
    });
    check(defeated.accepted, 'real native HP-zero command was not admitted');
    const receipt = defeated.snapshot.normalDefeatReceipts?.find(row => row.posture === 'recovery_pending');
    check(receipt, 'real native HP-zero command did not produce pending receipt');
    if (!receipt) return;
    const pendingRequest = {
      accountId, sourceSlotId: slotId, destinationSlotId: slotId,
      expectedAccountRevision: 3,
      expectedDestinationAddress: { artifactId: currentControl.loadedArtifactId,
        publicationId: currentControl.loadedPublicationId },
      snapshot: defeated.snapshot, control: defeated.control, receiptId: receipt.receiptId
    };
    const originalGear = JSON.stringify(current.playerState.gear);
    const stalePending = await new CleanEpochNormalDefeatRecoveryAdapter(owner).publishPending({
      ...pendingRequest, expectedAccountRevision: 2
    });
    check(stalePending.status === 'blocked' && stalePending.code === 'stale_head' &&
      (await owner.read(accountId))?.revision === 3,
      'stale pending request changed account authority');
    const mixedPending = await new CleanEpochNormalDefeatRecoveryAdapter(owner).publishPending({
      ...pendingRequest, snapshot: { ...defeated.snapshot,
        snapshotVersion: 'lineage.save_snapshot.v2' } as unknown as SaveSnapshot
    });
    check(mixedPending.status === 'blocked' && (await owner.read(accountId))?.revision === 3,
      'mixed-format pending request changed account authority');
    owner.close();
    let pendingWrites = 0;
    owner = await openCleanEpochAccountStore({ name: dbName,
      afterWrite: tx => { if (++pendingWrites === 5) tx.abort(); } });
    const interruptedPending = await new CleanEpochNormalDefeatRecoveryAdapter(owner)
      .publishPending(pendingRequest);
    check(interruptedPending.status === 'blocked' && interruptedPending.code === 'aborted',
      `pending publication did not interrupt at consumer write: ${JSON.stringify(interruptedPending)}`);
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    check((await owner.readCurrentDescendantRecovery(accountId, slotId))?.status ===
      'accepted_pending_consumers' && (await owner.read(accountId))?.revision === 3,
      'pending publication interruption lost accepted artifact');
    const result = await new CleanEpochNormalDefeatRecoveryAdapter(owner).publishPending(pendingRequest);
    check(result.status === 'ready', `real native pending defeat did not publish: ${JSON.stringify(result)}`);
    if (result.status !== 'ready') return;
    check(result.value.loaded.snapshot.normalDefeatReceipts?.some(row => row.receiptId ===
      receipt.receiptId && row.posture === 'recovery_pending') &&
      JSON.stringify(native(result.value.loaded.snapshot).playerState.gear) === originalGear &&
      (await owner.read(accountId))?.revision === 4,
      'real pending publication lost receipt, gear or account revision');
    const pendingPublicationId = result.value.loaded.publication.publicationId;
    const pendingReceipts = (await owner.read(accountId))?.profile.campaignPublicationReceipts
      ?.filter(row => row.publicationId === pendingPublicationId) ?? [];
    check(pendingReceipts.length === 4 &&
      new Set(pendingReceipts.map(row => row.kind)).size === 4 &&
      pendingReceipts.every(row => row.status === 'applied'),
      'pending defeat publication did not apply four exact account consumers');
    const duplicatePending = await new CleanEpochNormalDefeatRecoveryAdapter(owner).publishPending(pendingRequest);
    check(duplicatePending.status === 'ready' &&
      duplicatePending.value.loaded.publication.publicationId === pendingPublicationId &&
      (await owner.read(accountId))?.revision === 4,
      'duplicate pending publication minted another artifact or consumer revision');
    const changedPending = structuredClone(defeated.snapshot);
    changedPending.playerState.resources.mp.current = Math.max(0,
      changedPending.playerState.resources.mp.current - 1);
    const changedResult = await new CleanEpochNormalDefeatRecoveryAdapter(owner).publishPending({
      ...pendingRequest, snapshot: changedPending
    });
    check(changedResult.status === 'blocked' &&
      (await owner.read(accountId))?.revision === 4,
      'changed pending retry altered accepted publication');
    const recoveryRequest = { accountId, sourceSlotId: slotId, destinationSlotId: slotId,
      expectedAccountRevision: 4, expectedDestinationAddress: {
        artifactId: result.value.loaded.sessionControl.loadedArtifactId,
        publicationId: result.value.loaded.sessionControl.loadedPublicationId },
      snapshot: result.value.loaded.snapshot, control: result.value.loaded.sessionControl,
      receiptId: receipt.receiptId };
    owner.close();
    let writes = 0;
    owner = await openCleanEpochAccountStore({ name: dbName,
      afterWrite: tx => { if (++writes === 5) tx.abort(); } });
    const interrupted = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover(recoveryRequest);
    check(interrupted.status === 'blocked' && interrupted.code === 'aborted',
      `real recovery did not interrupt at consumer write: ${JSON.stringify(interrupted)}`);
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    check((await owner.readCurrentDescendantRecovery(accountId, slotId))?.status ===
      'accepted_pending_consumers' && (await owner.read(accountId))?.revision === 4,
      'interrupted real recovery lost its accepted artifact');
    const recovered = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover(recoveryRequest);
    check(recovered.status === 'ready', `real recovery did not resume: ${JSON.stringify(recovered)}`);
    if (recovered.status !== 'ready') return;
    const recoveredPublicationId = recovered.value.loaded.publication.publicationId;
    const recoveryReceipts = (await owner.read(accountId))?.profile.campaignPublicationReceipts
      ?.filter(row => row.publicationId === recoveredPublicationId) ?? [];
    check(recoveryReceipts.length === 4 &&
      new Set(recoveryReceipts.map(row => row.kind)).size === 4 &&
      recoveryReceipts.every(row => row.status === 'applied'),
      'playable recovery did not apply four exact account consumers');
    check(recovered.value.loaded.snapshot.normalDefeatReceipts?.some(row => row.receiptId ===
      receipt.receiptId && row.posture === 'playable') &&
      JSON.stringify(native(recovered.value.loaded.snapshot).playerState.gear) === originalGear &&
      (await owner.read(accountId))?.revision === 5,
      'real recovery lost playable receipt, gear or account completion');
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    const restarted = await owner.readSlot(accountId, slotId);
    check(restarted.status === 'ready' && restarted.loaded.publication.publicationId ===
      recoveredPublicationId && JSON.stringify(native(restarted.loaded.snapshot).playerState.gear) ===
      originalGear, 'real recovery restart lost physical owner or publication');
    const duplicateRecovery = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover(recoveryRequest);
    check(duplicateRecovery.status === 'ready' &&
      duplicateRecovery.value.loaded.publication.publicationId === recoveredPublicationId &&
      (await owner.read(accountId))?.revision === 5,
      'duplicate recovery after restart changed account authority');
    owner.close();
  });
  await test('missing retained native defeat source cannot publish pending artifact', async () => {
    const dbName = name(); const accountId = id('account'); const slotId: SaveSlotId = 'slot-1';
    const owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Lost Source QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(first.status === 'ready', 'source-loss creator did not publish');
    if (first.status !== 'ready') return;
    const source = native(first.value.loaded.snapshot);
    const control = first.value.loaded.sessionControl as CampaignSessionControl<typeof source>;
    const lethal = structuredClone(source);
    lethal.playerState.location.settlementId = null;
    lethal.playerState.flags = lethal.playerState.flags.filter(flag => !flag.startsWith('player.start.'));
    lethal.sessionState.knownLocations = [{ id: 'location.recovery_haven', name: 'Recovery Haven',
      regionLabel: 'Test March', settlementId: 'settlement.recovery_haven', regionId: 'region.test_march',
      type: 'settlement', x: 1, y: 1, note: 'Synthetic recovery destination.', known: true }];
    lethal.playerState.resources.hp.current = 0;
    const pending = admitCampaignMutation(control, { mutationId: 'mutation.native.lost_source.qa',
      sourceArtifactId: control.loadedArtifactId, sourceRevision: control.sessionRevision,
      ownerKind: 'engine_result', accepted: true, sourceSnapshot: source, proposedSnapshot: lethal,
      validateNativeSnapshot: isNativeTargetCampaignSnapshot });
    const receipt = pending.snapshot.normalDefeatReceipts?.find(row => row.posture === 'recovery_pending');
    check(pending.accepted && receipt, 'source-loss defeat did not create pending result');
    if (!receipt) return;
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('artifacts', 'readwrite');
      tx.objectStore('artifacts').delete([accountId, control.loadedArtifactId]);
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    const result = await new CleanEpochNormalDefeatRecoveryAdapter(owner).publishPending({
      accountId, sourceSlotId: slotId, destinationSlotId: slotId, expectedAccountRevision: 2,
      expectedDestinationAddress: { artifactId: control.loadedArtifactId,
        publicationId: control.loadedPublicationId },
      snapshot: pending.snapshot, control: pending.control, receiptId: receipt.receiptId });
    const artifactCount = await new Promise<number>((resolve, reject) => {
      const request = indexedDB.open(dbName);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const opened = request.result;
        const count = opened.transaction('artifacts', 'readonly').objectStore('artifacts').count();
        count.onsuccess = () => { resolve(count.result); opened.close(); };
        count.onerror = () => { reject(count.error); opened.close(); };
      };
    });
    check(result.status === 'blocked' && (await owner.read(accountId))?.revision === 2 &&
      artifactCount === 0,
      'lost source allowed pending artifact or consumer effects');
    owner.close();
  });
  await test('historical native source publishes pending defeat as a retained non-head fork', async () => {
    const dbName = name(); const accountId = id('account'); const slotId: SaveSlotId = 'slot-1';
    const owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Non-head Pending QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(first.status === 'ready', 'non-head pending creator failed');
    if (first.status !== 'ready') return;
    const start = native(first.value.loaded.snapshot);
    const startControl = first.value.loaded.sessionControl as CampaignSessionControl<typeof start>;
    const next = structuredClone(start);
    next.playerState.location.settlementId = null;
    next.playerState.flags = next.playerState.flags.filter(flag => !flag.startsWith('player.start.'));
    next.sessionState.knownLocations = [{ id: 'location.recovery_haven', name: 'Recovery Haven',
      regionLabel: 'Test March', settlementId: 'settlement.recovery_haven', regionId: 'region.test_march',
      type: 'settlement', x: 1, y: 1, note: 'Synthetic recovery destination.', known: true }];
    const staged = admitCampaignMutation(startControl, { mutationId: 'mutation.native.nonhead.stage.qa',
      sourceArtifactId: startControl.loadedArtifactId, sourceRevision: startControl.sessionRevision,
      ownerKind: 'engine_result', accepted: true, sourceSnapshot: start, proposedSnapshot: next,
      validateNativeSnapshot: isNativeTargetCampaignSnapshot });
    const head = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: slotId, destinationSlotId: slotId, expectedAccountRevision: 2,
      snapshot: staged.snapshot, control: staged.control });
    check(head.status === 'ready', 'non-head pending staging failed');
    if (head.status !== 'ready') return;
    const historical = await owner.readHistoricalArtifact(accountId, slotId, startControl.loadedArtifactId);
    const old = native(historical.snapshot);
    const historicalControl = historical.sessionControl as CampaignSessionControl<typeof old>;
    const lethal = structuredClone(old);
    lethal.playerState.location.settlementId = null;
    lethal.playerState.flags = lethal.playerState.flags.filter(flag => !flag.startsWith('player.start.'));
    lethal.sessionState.knownLocations = next.sessionState.knownLocations;
    lethal.playerState.resources.hp.current = 0;
    const defeated = admitCampaignMutation(historicalControl, {
      mutationId: 'mutation.native.nonhead.pending.qa',
      sourceArtifactId: historicalControl.loadedArtifactId,
      sourceRevision: historicalControl.sessionRevision, ownerKind: 'engine_result', accepted: true,
      sourceSnapshot: old, proposedSnapshot: lethal,
      validateNativeSnapshot: isNativeTargetCampaignSnapshot });
    check(defeated.accepted && defeated.control.posture === 'forked_unpublished',
      'historical HP-zero command did not retain non-head fork');
    const receipt = defeated.snapshot.normalDefeatReceipts?.find(row => row.posture === 'recovery_pending');
    check(receipt, 'historical HP-zero command has no pending receipt');
    if (!receipt) return;
    const currentHead = head.value.loaded.sessionControl;
    const published = await new CleanEpochNormalDefeatRecoveryAdapter(owner).publishPending({
      accountId, sourceSlotId: slotId, destinationSlotId: slotId, expectedAccountRevision: 3,
      expectedDestinationAddress: { artifactId: currentHead.loadedArtifactId,
        publicationId: currentHead.loadedPublicationId },
      snapshot: defeated.snapshot, control: defeated.control, receiptId: receipt.receiptId });
    check(published.status === 'ready', `non-head pending publication failed: ${JSON.stringify(published)}`);
    if (published.status !== 'ready') return;
    check(published.value.loaded.snapshot.campaignIdentity?.parentContinuityId ===
      old.campaignIdentity?.continuityId &&
      published.value.loaded.snapshot.normalDefeatReceipts?.some(row => row.receiptId ===
        receipt.receiptId && row.posture === 'recovery_pending') &&
      JSON.stringify(native(published.value.loaded.snapshot).playerState.gear) ===
      JSON.stringify(start.playerState.gear),
      'non-head pending fork lost continuity, receipt or physical gear');
    owner.close();
    const reopened = await openCleanEpochAccountStore({ name: dbName });
    const pendingRead = await reopened.readSlot(accountId, slotId);
    check(pendingRead.status === 'ready' && pendingRead.loaded.publication.publicationId ===
      published.value.loaded.publication.publicationId,
      'non-head pending publication did not restart on retained fork');
    const pendingControl = published.value.loaded.sessionControl;
    const recovered = await new CleanEpochNormalDefeatRecoveryAdapter(reopened).recover({
      accountId, sourceSlotId: slotId, destinationSlotId: slotId, expectedAccountRevision: 4,
      expectedDestinationAddress: { artifactId: pendingControl.loadedArtifactId,
        publicationId: pendingControl.loadedPublicationId },
      snapshot: published.value.loaded.snapshot, control: pendingControl,
      receiptId: receipt.receiptId });
    check(recovered.status === 'ready' && recovered.value.loaded.snapshot.normalDefeatReceipts
      ?.some(row => row.receiptId === receipt.receiptId && row.posture === 'playable') &&
      JSON.stringify(native(recovered.value.loaded.snapshot).playerState.gear) ===
      JSON.stringify(start.playerState.gear) && (await reopened.read(accountId))?.revision === 5,
      'non-head pending fork did not complete one playable recovery');
    reopened.close();
  });
  await test('native mutation admission rejects damaged physical gear without retaining a result', async () => {
    const source = fixture(id('account'));
    const control = createCampaignSessionControl({
      accountId: source.accountId, campaignId: source.campaignIdentity!.campaignId,
      artifactId: 'artifact.native.qa', publicationId: 'publication.native.qa',
      artifactRevision: 1, continuityId: source.campaignIdentity!.continuityId,
      headArtifactId: 'artifact.native.qa', headRevision: 1
    }) as CampaignSessionControl<typeof source>;
    const broken = structuredClone(source);
    broken.playerState.gear.instances[0]!.durability = -1;
    const unvalidated = admitCampaignMutation(control, {
      mutationId: 'mutation.native.no_validator.qa', sourceArtifactId: control.loadedArtifactId,
      sourceRevision: control.sessionRevision, ownerKind: 'engine_result', accepted: true,
      sourceSnapshot: source, proposedSnapshot: structuredClone(source)
    });
    check(!unvalidated.accepted && unvalidated.reason === 'rejected',
      'native mutation bypassed required physical admission');
    const result = admitCampaignMutation(control, {
      mutationId: 'mutation.native.invalid_gear.qa', sourceArtifactId: control.loadedArtifactId,
      sourceRevision: control.sessionRevision, ownerKind: 'engine_result', accepted: true,
      sourceSnapshot: source, proposedSnapshot: broken,
      validateNativeSnapshot: isNativeTargetCampaignSnapshot
    });
    check(!result.accepted && result.reason === 'rejected' && result.control === control &&
      result.snapshot === source && control.retainedMutationResults.length === 0,
      'native mutation admitted damaged gear or changed the control');
  });
  await test('native non-head HP-zero fork completes one recovery without changing gear', async () => {
    const accountId = id('account');
    const source = fixture(accountId);
    source.playerState.location.settlementId = null;
    source.playerState.flags = source.playerState.flags.filter(flag => !flag.startsWith('player.start.'));
    source.sessionState.knownLocations = [{ id: 'location.recovery_haven', name: 'Recovery Haven',
      regionLabel: 'Test March', settlementId: 'settlement.recovery_haven', regionId: 'region.test_march',
      type: 'settlement', x: 1, y: 1, note: 'Synthetic recovery destination.', known: true }];
    const control = createCampaignSessionControl({ accountId,
      campaignId: source.campaignIdentity!.campaignId, artifactId: 'artifact.native.prior.qa',
      publicationId: 'publication.native.prior.qa', artifactRevision: 1,
      continuityId: source.campaignIdentity!.continuityId,
      headArtifactId: 'artifact.native.head.qa', headRevision: 2
    }) as CampaignSessionControl<typeof source>;
    const defeated = structuredClone(source);
    defeated.playerState.resources.hp.current = 0;
    const pending = admitCampaignMutation(control, {
      mutationId: 'mutation.native.nonhead.defeat.qa', sourceArtifactId: control.loadedArtifactId,
      sourceRevision: control.sessionRevision, ownerKind: 'engine_result', accepted: true,
      sourceSnapshot: source, proposedSnapshot: defeated,
      validateNativeSnapshot: isNativeTargetCampaignSnapshot
    });
    check(pending.accepted && pending.control.posture === 'forked_unpublished' &&
      pending.snapshot.campaignIdentity?.parentContinuityId === source.campaignIdentity?.continuityId,
      'native non-head defeat did not preserve the fork');
    const receipt = pending.snapshot.normalDefeatReceipts?.find(row => row.posture === 'recovery_pending');
    check(receipt, 'native non-head defeat did not retain a pending receipt');
    if (!receipt) return;
    const recovered = completePendingNormalDefeatRecovery(pending.control, pending.snapshot,
      undefined, receipt.receiptId, isNativeTargetCampaignSnapshot);
    check(recovered.accepted && recovered.control.posture === 'forked_unpublished' &&
      recovered.snapshot.normalDefeatReceipts?.some(row => row.receiptId === receipt.receiptId &&
        row.posture === 'playable') &&
      JSON.stringify(native(recovered.snapshot).playerState.gear) ===
      JSON.stringify(native(source).playerState.gear),
      'native non-head recovery lost continuity, receipt or gear');
  });
  await test('native pending Normal defeat publishes one playable recovery through the account owner', async () => {
    const dbName = name(); const accountId = id('account');
    let owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Native Defeat QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const source = fixture(accountId);
    source.playerState.location.settlementId = null;
    source.playerState.flags = source.playerState.flags.filter(flag => !flag.startsWith('player.start.'));
    source.sessionState.knownLocations = [{ id: 'location.recovery_haven', name: 'Recovery Haven',
      regionLabel: 'Test March', settlementId: 'settlement.recovery_haven', regionId: 'region.test_march',
      type: 'settlement', x: 1, y: 1, note: 'Synthetic recovery destination.', known: true }];
    const defeated = structuredClone(source);
    defeated.playerState.resources.hp.current = 0;
    const sourceControl = createCampaignSessionControl({ accountId,
      campaignId: source.campaignIdentity!.campaignId, artifactId: 'artifact.native.source.qa',
      publicationId: 'publication.native.source.qa', artifactRevision: 1,
      continuityId: source.campaignIdentity!.continuityId,
      headArtifactId: 'artifact.native.source.qa', headRevision: 1
    }) as CampaignSessionControl<typeof source>;
    const defeatSubmission = {
      mutationId: 'mutation.native_defeat.qa', sourceArtifactId: sourceControl.loadedArtifactId,
      sourceRevision: sourceControl.sessionRevision, ownerKind: 'engine_result', accepted: true,
      sourceSnapshot: source, proposedSnapshot: defeated,
      validateNativeSnapshot: isNativeTargetCampaignSnapshot
    } as const;
    const admission = admitCampaignMutation(sourceControl, defeatSubmission);
    check(admission.accepted && !admission.duplicate, 'native HP-zero owner command was not admitted');
    const duplicate = admitCampaignMutation(admission.control, defeatSubmission);
    check(!duplicate.accepted && duplicate.duplicate && duplicate.snapshot ===
      admission.control.retainedMutationResults[0]?.snapshot && duplicate.control.sessionRevision ===
      admission.control.sessionRevision, 'native duplicate HP-zero command changed owner state');
    const staleAdmission = admitCampaignMutation(admission.control, {
      ...defeatSubmission, mutationId: 'mutation.native_defeat.stale.qa', sourceRevision: 0
    });
    check(!staleAdmission.accepted && staleAdmission.reason === 'stale_revision' &&
      staleAdmission.control === admission.control, 'stale native HP-zero command changed owner state');
    const pending = admission.snapshot;
    check(JSON.stringify(native(pending).playerState.gear) ===
      JSON.stringify(native(source).playerState.gear), 'native HP-zero command changed physical gear');
    check(isNativeTargetCampaignSnapshot(pending), 'native pending defeat lost v3 admission');
    const receipt = pending.normalDefeatReceipts?.find(row => row.posture === 'recovery_pending');
    check(receipt, 'native defeat did not produce a pending receipt');
    if (!receipt || !isNativeTargetCampaignSnapshot(pending)) return;
    const createdAt = new Date().toISOString(); const slotId: SaveSlotId = 'slot-1';
    const projected = prepareCharacterAchievementProgress(pending as unknown as SaveSnapshot, createdAt)
      .snapshot as unknown as typeof pending;
    check(isNativeTargetCampaignSnapshot(projected), 'native pending achievement projection lost gear');
    if (!isNativeTargetCampaignSnapshot(projected)) return;
    const account = (await owner.read(accountId))!;
    const core = JSON.stringify({ slotId, capturedAtTick: projected.capturedAtTick,
      characterAchievementIds: projected.playerState.achievements.unlocked.map(row => row.achievementId) });
    const preparation = JSON.stringify({ selectedPreparationUnlockIds: [],
      selectedPreparationChoicePayloads: {}, sourceRunId: null });
    const consumerPlans = [
      ...(['active_history', 'account_achievements', 'legacy_rewards', 'last_played'] as const)
        .map(kind => ({ kind, payloadFingerprint: core })),
      { kind: 'preparation_consumption' as const, payloadFingerprint: preparation }
    ];
    const attemptId = createAuthorityId('new_campaign_attempt');
    await owner.prepareAttempt({ version: 1, status: 'prepared', accountId, slotId,
      campaignId: projected.campaignIdentity!.campaignId, attemptId, expectedAccountRevision: account.revision,
      expectedHead: null, inputFingerprint: 'qa.native.retained.pending', snapshotRaw: JSON.stringify(projected),
      consumerPlans, createdAt });
    const publication = await buildNativeGearArtifactPublication(projected, slotId, {
      artifactId: id('artifact'), generationId: id('generation'), publicationId: id('publication'),
      savedAt: createdAt, expectedHead: null });
    await owner.publishPreparedAttempt(attemptId, publication);
    await owner.completePreparedAttemptConsumers(accountId, slotId, attemptId,
      publication.control.headPublicationId);
    const retained = await owner.readSlot(accountId, slotId);
    check(retained.status === 'ready', 'native pending source was not retained');
    if (retained.status !== 'ready') return;
    const recoveryRequest = { accountId,
      sourceSlotId: slotId, destinationSlotId: slotId, expectedAccountRevision: 2,
      expectedDestinationAddress: { artifactId: publication.control.headArtifactId,
        publicationId: publication.control.headPublicationId }, snapshot: retained.loaded.snapshot,
      control: retained.loaded.sessionControl, receiptId: receipt.receiptId };
    const originalGear = JSON.stringify(native(retained.loaded.snapshot).playerState.gear);
    const mixedFormat = { ...retained.loaded.snapshot,
      snapshotVersion: 'lineage.save_snapshot.v2' } as unknown as SaveSnapshot;
    const mixedResult = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover({
      ...recoveryRequest, snapshot: mixedFormat
    });
    check(mixedResult.status === 'blocked' && mixedResult.code === 'invalid_record' &&
      (await owner.read(accountId))?.revision === 2,
      'mixed-format defeat source was admitted or changed account authority');
    owner.close();
    let writes = 0;
    owner = await openCleanEpochAccountStore({ name: dbName,
      afterWrite: tx => { if (++writes === 5) tx.abort(); } });
    const interrupted = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover(recoveryRequest);
    check(interrupted.status === 'blocked' && interrupted.code === 'aborted',
      `native defeat consumer fault did not interrupt: ${JSON.stringify(interrupted)}`);
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    check((await owner.readCurrentDescendantRecovery(accountId, slotId))?.status ===
      'accepted_pending_consumers' && (await owner.read(accountId))?.revision === 2,
      'native defeat fault lost the retained accepted publication');
    const result = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover(recoveryRequest);
    check(result.status === 'ready', `native pending recovery failed: ${JSON.stringify(result)}`);
    if (result.status !== 'ready') return;
    check(result.value.loaded.snapshot.snapshotVersion === 'lineage.save_snapshot.v3' &&
      JSON.stringify(native(result.value.loaded.snapshot).playerState.gear) === originalGear &&
      result.value.loaded.snapshot.normalDefeatReceipts?.some(row => row.receiptId === receipt.receiptId &&
        row.posture === 'playable'), 'native recovery lost gear or playable provenance');
    const completedPublicationId = result.value.loaded.publication.publicationId;
    const completedAccount = await owner.read(accountId);
    const consumerReceipts = completedAccount?.profile.campaignPublicationReceipts?.filter(row =>
      row.publicationId === completedPublicationId) ?? [];
    check(completedAccount?.revision === 3 && consumerReceipts.length === 4 &&
      consumerReceipts.every(row => row.status === 'applied'),
      `native defeat recovery consumers: revision ${completedAccount?.revision}, receipts ${JSON.stringify(consumerReceipts)}`);
    owner.close();
    const reopened = await openCleanEpochAccountStore({ name: dbName });
    const restarted = await reopened.readSlot(accountId, slotId);
    check(restarted.status === 'ready' && restarted.loaded.publication.publicationId ===
      completedPublicationId && JSON.stringify(native(restarted.loaded.snapshot).playerState.gear) ===
      originalGear, 'native defeat recovery restart lost publication or physical gear');
    const retry = await new CleanEpochNormalDefeatRecoveryAdapter(reopened).recover(recoveryRequest);
    check(retry.status === 'ready' && retry.value.loaded.publication.publicationId === completedPublicationId &&
      (await reopened.read(accountId))?.revision === 3,
      `native defeat retry did not return the exact accepted publication: ${JSON.stringify(retry)}`);
    const stale = await new CleanEpochNormalDefeatRecoveryAdapter(reopened).recover({ ...recoveryRequest,
      expectedAccountRevision: 1 });
    check(stale.status === 'blocked' && stale.code === 'conflict' &&
      (await reopened.read(accountId))?.revision === 3,
      'stale native defeat retry changed account authority');
    reopened.close();
  });
  await test('native ordinary descendant refuses unpublished pending defeat', async () => {
    const dbName = name(); const accountId = id('account');
    const owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Missing Defeat QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(first.status === 'ready', 'native missing-source campaign did not publish');
    if (first.status !== 'ready') return;
    const defeated = structuredClone(native(first.value.loaded.snapshot));
    defeated.playerState.location.settlementId = null;
    defeated.playerState.flags = defeated.playerState.flags.filter(flag => !flag.startsWith('player.start.'));
    defeated.sessionState.knownLocations = [{ id: 'location.recovery_haven', name: 'Recovery Haven',
      regionLabel: 'Test March', settlementId: 'settlement.recovery_haven', regionId: 'region.test_march',
      type: 'settlement', x: 1, y: 1, note: 'Synthetic recovery destination.', known: true }];
    defeated.playerState.resources.hp.current = 0;
    const pending = resolveNormalDefeat(defeated, {
      sourceMutationId: 'mutation.native_missing_source.qa', sourceKind: 'accepted_mutation' }).snapshot;
    check(pending.normalDefeatReceipts?.some(row => row.posture === 'recovery_pending'),
      'missing-source setup did not create pending native defeat');
    const saved = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: 2,
      snapshot: pending, control: first.value.loaded.sessionControl });
    check(saved.status === 'blocked' && saved.code === 'invalid_record' &&
      (await owner.read(accountId))?.revision === 2 &&
      (await owner.readCurrentDescendantRecovery(accountId, 'slot-1')) === null,
      'ordinary native descendant unexpectedly retained pending defeat');
    const receipt = pending.normalDefeatReceipts?.find(row => row.posture === 'recovery_pending');
    check(receipt, 'native defeat setup lost its pending receipt');
    if (!receipt) return;
    const recovery = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: 2,
      expectedDestinationAddress: { artifactId: first.value.loaded.sessionControl.loadedArtifactId,
        publicationId: first.value.loaded.sessionControl.loadedPublicationId },
      snapshot: pending, control: first.value.loaded.sessionControl, receiptId: receipt.receiptId });
    check(recovery.status === 'blocked' && recovery.code === 'conflict' &&
      (await owner.read(accountId))?.revision === 2,
      'recovery accepted an unpublished pending source or changed the account');
    owner.close();
  });
  await test('clean-epoch first-campaign adapter publishes native v3, completes consumers and restarts', async () => {
    const dbName = name(); const accountId = id('account');
    let owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Native QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const adapter = new CleanEpochFirstCampaignAdapter(owner, 'native_v3');
    const prepared = await adapter.prepare(accountId, formFixture());
    check(prepared.status === 'ready' && JSON.parse(prepared.value.snapshotRaw).snapshotVersion ===
      'lineage.save_snapshot.v3', 'native attempt was not retained');
    if (prepared.status !== 'ready') throw new Error('Native attempt was not retained.');
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    const ready = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').resume(accountId, 'slot-1');
    check(ready.status === 'ready', `native first publication did not complete: ${JSON.stringify(ready)}`);
    if (ready.status !== 'ready') return;
    const original = JSON.parse(prepared.value.snapshotRaw);
    check(JSON.stringify((ready.value.loaded.snapshot as typeof original).playerState.gear) ===
      JSON.stringify(original.playerState.gear), 'first publication changed physical graph');
    check((ready.value.loaded.snapshot as typeof original).playerState.inventory.bags[0].slotCapacity ===
      original.playerState.inventory.bags[0].slotCapacity, 'bag capacity changed');
    const account = await owner.read(accountId);
    const receipts = account?.profile.campaignPublicationReceipts?.filter(
      receipt => receipt.publicationId === ready.value.loaded.publication.publicationId) ?? [];
    check(account?.revision === 2 && receipts.length === 5 &&
      receipts.every(receipt => receipt.status === 'applied') &&
      new Set(receipts.map(receipt => receipt.kind)).size === receipts.length,
      'first consumer receipt did not commit exactly once');
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    const restarted = await owner.readSlot(accountId, 'slot-1');
    check(restarted.status === 'ready' && restarted.loaded?.publication.publicationId ===
      ready.value.loaded.publication.publicationId, 'clean epoch restart lost native publication');
    const staleV2 = await new CleanEpochFirstCampaignAdapter(owner).prepare(accountId, formFixture());
    check(staleV2.status === 'blocked' && staleV2.code === 'conflict',
      'retained v3 slot admitted a stale v2 creator');
    const retry = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(retry.status === 'ready' && retry.value.loaded.publication.publicationId ===
      ready.value.loaded.publication.publicationId && (await owner.read(accountId))?.revision === 2,
      'native retry changed publication or charged consumers twice');
    owner.close();
  });
  await test('native account descendant saves authored quest travel through the selected account owner', async () => {
    const dbName = name(); const accountId = id('account');
    let owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Native Descendant QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const surveyForm = { ...formFixture(), backstoryId: 'backstory.craftsmans_child',
      continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
      startingSettlementId: 'settlement.starfall_port' };
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, surveyForm);
    check(first.status === 'ready', 'native first campaign did not publish');
    if (first.status !== 'ready') return;
    const accepted = executePlayerQuestAcceptanceCommand(first.value.loaded.snapshot,
      createPlayerQuestAcceptanceCommand(first.value.loaded.snapshot, 'quest.ashen_reef_survey'));
    check(accepted.accepted, 'native quest acceptance failed');
    if (!accepted.accepted) return;
    const traveled = executePlayerTravelCommand(accepted.snapshot,
      createPlayerTravelCommand(accepted.snapshot, 'location.ashen_reef'));
    check(traveled.accepted, 'native travel failed');
    if (!traveled.accepted) return;
    const account = await owner.read(accountId);
    const saved = await new CleanEpochDescendantAdapter(owner).save({
      accountId, sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
      expectedAccountRevision: account!.revision, snapshot: traveled.snapshot,
      control: first.value.loaded.sessionControl
    });
    check(saved.status === 'ready' && saved.value.loaded.snapshot.snapshotVersion ===
      'lineage.save_snapshot.v3', `native descendant did not publish: ${JSON.stringify(saved)}`);
    if (saved.status !== 'ready') return;
    const initialGear = JSON.stringify(native(first.value.loaded.snapshot).playerState.gear);
    for (const stage of ['sector_1', 'sector_2', 'sector_3', 'ruins_confirmation']) {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(dbName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      const campaignStore = new CampaignIndexedDbStore(db);
      const bound = await readRetainedNativeSurveyMaterial(campaignStore, accountId,
        saved.value.loaded.sessionControl.campaignId, 'slot-1');
      check(bound.witness.stage === stage, `native account source did not reach ${stage}`);
      campaignStore.close();
      const current = await owner.readSlot(accountId, 'slot-1');
      check(current.status === 'ready', 'native source slot is not ready');
      if (current.status !== 'ready') return;
      const revision = (await owner.read(accountId))!.revision;
      const command = commitNativeSurveyShift(bound, `survey_request.${crypto.randomUUID()}`);
      const result = await new CleanEpochDescendantAdapter(owner).save({ accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: revision,
        snapshot: command.snapshot, control: current.loaded.sessionControl });
      check(result.status === 'ready', `native account ${stage} did not publish: ${JSON.stringify(result)}`);
      owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    }
    const final = await owner.readSlot(accountId, 'slot-1');
    check(final.status === 'ready' && native(final.loaded.snapshot).nativeSurvey?.results.length === 4 &&
      JSON.stringify(native(final.loaded.snapshot).playerState.gear) === initialGear,
      'native account restart lost survey history or physical gear');
    if (final.status !== 'ready') return;
    const afterSurvey = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
      expectedAccountRevision: (await owner.read(accountId))!.revision,
      snapshot: final.loaded.snapshot, control: final.loaded.sessionControl });
    check(afterSurvey.status === 'ready',
      `ordinary Save after completed survey did not publish: ${JSON.stringify(afterSurvey)}`);
    if (afterSurvey.status !== 'ready') return;
    const beforeCross = await owner.read(accountId);
    const cross = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-2',
      expectedAccountRevision: beforeCross!.revision, expectedDestinationAddress: null,
      snapshot: afterSurvey.value.loaded.snapshot, control: afterSurvey.value.loaded.sessionControl });
    check(cross.status === 'ready', `native cross-slot descendant did not publish: ${JSON.stringify(cross)}`);
    if (cross.status !== 'ready') return;
    const crossPublication = cross.value.loaded.publication.publicationId;
    const crossGear = JSON.stringify(native(cross.value.loaded.snapshot).playerState.gear);
    const crossSurvey = JSON.stringify(native(cross.value.loaded.snapshot).nativeSurvey);
    const accountAfterCross = await owner.read(accountId);
    const receipts = accountAfterCross?.profile.campaignPublicationReceipts?.filter(
      receipt => receipt.publicationId === crossPublication) ?? [];
    const history = accountAfterCross?.profile.history.runRecords.filter(
      record => record.characterId === cross.value.loaded.snapshot.playerState.playerId) ?? [];
    check(crossGear === initialGear && crossSurvey === JSON.stringify(native(final.loaded.snapshot).nativeSurvey) &&
      receipts.length === 4 && receipts.every(receipt => receipt.status === 'applied') &&
      history.length === 1 && history[0]!.saveSlotIds.includes('slot-1') &&
      history[0]!.saveSlotIds.includes('slot-2') &&
      accountAfterCross?.revision === beforeCross!.revision + 1,
      'cross-slot changed gear, survey evidence, history or consumer receipts');
    const stale = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-2',
      expectedAccountRevision: beforeCross!.revision, expectedDestinationAddress: null,
      snapshot: afterSurvey.value.loaded.snapshot, control: afterSurvey.value.loaded.sessionControl });
    check(stale.status === 'blocked' && stale.code === 'stale_head',
      'stale account request changed cross-slot head');
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    const crossRestart = await owner.readSlot(accountId, 'slot-2');
    check(crossRestart.status === 'ready' && crossRestart.loaded.publication.publicationId === crossPublication &&
      JSON.stringify(native(crossRestart.loaded.snapshot).playerState.gear) === crossGear &&
      JSON.stringify(native(crossRestart.loaded.snapshot).nativeSurvey) === crossSurvey,
      'cross-slot restart lost accepted v3 state');
    owner.close();
  });
  await test('obsolete v2 slot is incompatible with native creator without deleting its records', async () => {
    const dbName = name(); const accountId = id('account');
    const owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Old QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const old = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, formFixture());
    check(old.status === 'ready' && old.value.loaded.snapshot.snapshotVersion === 'lineage.save_snapshot.v2',
      'old campaign was not published');
    const native = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').prepare(accountId, formFixture());
    check(native.status === 'blocked' && native.code === 'conflict', 'v2 slot admitted native replacement');
    const retained = await owner.readSlot(accountId, 'slot-1');
    check(retained.status === 'ready' && retained.loaded?.snapshot.snapshotVersion ===
      'lineage.save_snapshot.v2', 'incompatible old record was deleted or changed');
    owner.close();
  });
  await test('native terminal retirement closes one physical campaign and settles the account', async () => {
    const dbName = name(); const accountId = id('account');
    let owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Native Terminal QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(first.status === 'ready', 'native terminal first campaign did not publish');
    if (first.status !== 'ready') return;
    const source = first.value.loaded;
    const request = { accountId,
      sourceSlotId: 'slot-1', expectedAccountRevision: (await owner.read(accountId))!.revision,
      snapshot: source.snapshot, control: source.sessionControl,
      expectedSourceAddress: { artifactId: source.sessionControl.loadedArtifactId,
        publicationId: source.sessionControl.loadedPublicationId } } as const;
    const originalGear = JSON.stringify(native(source.snapshot).playerState.gear);
    const result = await new CleanEpochTerminalAdapter(owner).retire(request);
    check(result.status === 'completed', `native terminal did not settle: ${JSON.stringify(result)}`);
    if (result.status !== 'completed') return;
    const envelope = JSON.parse(result.recovery.envelopeRaw);
    const terminal = JSON.parse(envelope.snapshot);
    check(envelope.version === 8 && envelope.terminal === true &&
      envelope.snapshotFormatId === 'lineage.save_snapshot.v3' &&
      JSON.stringify(native(terminal).playerState.gear) === originalGear,
    'native terminal artifact lost physical gear or format');
    check((await owner.readSlot(accountId, 'slot-1')).status === 'closed' &&
      (await owner.read(accountId))?.revision === 3 &&
      result.account.profile.history.runRecords[0]?.archiveReason === 'retired' &&
      result.account.profile.estate.deposits.length === 1 &&
      result.account.profile.campaignPublicationReceipts?.filter(receipt =>
        receipt.publicationId === result.recovery.publicationId).length === 6,
    'native terminal did not close, archive, deposit or settle once');
    const retry = await new CleanEpochTerminalAdapter(owner).retire(request);
    check(retry.status === 'completed' && retry.recovery.publicationId === result.recovery.publicationId &&
      (await owner.read(accountId))?.revision === 3,
    'native terminal exact retry minted a duplicate');
    const changed = await new CleanEpochTerminalAdapter(owner).retire({ ...request,
      expectedAccountRevision: request.expectedAccountRevision + 1 });
    check(changed.status === 'blocked' && (await owner.read(accountId))?.revision === 3,
      'changed native terminal retry was admitted');
    owner.close();
    owner = await openCleanEpochAccountStore({ name: dbName });
    const retained = await owner.readTerminalForSource(accountId,
      result.recovery.campaignId, source.sessionControl.loadedPublicationId);
    check(retained?.status === 'settlement_completed' &&
      JSON.stringify(native(JSON.parse(JSON.parse(retained.envelopeRaw).snapshot)).playerState.gear) === originalGear &&
      (await owner.readSlot(accountId, 'slot-1')).status === 'closed',
    'native terminal restart lost settlement, closed state or gear');
    owner.close();
  });
  await test('native terminal abort retains one recoverable closed artifact after restart', async () => {
    const dbName = name(); const accountId = id('account');
    let armed = false; let writes = 0;
    let owner = await openCleanEpochAccountStore({ name: dbName,
      afterWrite: tx => { if (armed && ++writes === 5) tx.abort(); } });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Native Terminal Fault QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(first.status === 'ready', 'native terminal fault source did not publish');
    if (first.status !== 'ready') return;
    const source = first.value.loaded;
    const gear = JSON.stringify(native(source.snapshot).playerState.gear);
    armed = true;
    const result = await new CleanEpochTerminalAdapter(owner).retire({ accountId,
      sourceSlotId: 'slot-1', expectedAccountRevision: (await owner.read(accountId))!.revision,
      snapshot: source.snapshot, control: source.sessionControl,
      expectedSourceAddress: { artifactId: source.sessionControl.loadedArtifactId,
        publicationId: source.sessionControl.loadedPublicationId } });
    check(result.status === 'blocked', 'native terminal settlement abort unexpectedly completed');
    const pending = await owner.readPendingTerminalForAccount(accountId);
    check(pending?.status === 'accepted_pending_settlement' &&
      (await owner.readSlot(accountId, 'slot-1')).status === 'closed' &&
      (await owner.read(accountId))?.revision === 2,
    'native terminal abort lost the pending artifact or changed account authority');
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    const resumed = await new CleanEpochTerminalAdapter(owner).resumePending(accountId);
    check(resumed?.status === 'completed' && resumed.recovery.publicationId === pending?.publicationId &&
      JSON.stringify(native(JSON.parse(JSON.parse(resumed.recovery.envelopeRaw).snapshot)).playerState.gear) === gear &&
      (await owner.read(accountId))?.revision === 3 &&
      (await owner.readSlot(accountId, 'slot-1')).status === 'closed',
    `native terminal restart did not settle exact physical artifact: ${JSON.stringify(resumed)}`);
    owner.close();
  });
  await test('native cross-slot retirement closes every retained address once', async () => {
    const dbName = name(); const accountId = id('account');
    const owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Native Cross-slot QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(first.status === 'ready', 'native cross-slot first campaign did not publish');
    if (first.status !== 'ready') return;
    const originalGear = JSON.stringify(native(first.value.loaded.snapshot).playerState.gear);
    const descendant = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'quick-save', expectedDestinationAddress: null,
      expectedAccountRevision: (await owner.read(accountId))!.revision,
      snapshot: first.value.loaded.snapshot, control: first.value.loaded.sessionControl });
    check(descendant.status === 'ready', `native cross-slot descendant failed: ${JSON.stringify(descendant)}`);
    if (descendant.status !== 'ready') return;
    const loaded = descendant.value.loaded;
    const retired = await new CleanEpochTerminalAdapter(owner).retire({ accountId,
      sourceSlotId: 'quick-save', expectedAccountRevision: (await owner.read(accountId))!.revision,
      snapshot: loaded.snapshot, control: loaded.sessionControl,
      expectedSourceAddress: { artifactId: loaded.sessionControl.loadedArtifactId,
        publicationId: loaded.sessionControl.loadedPublicationId } });
    check(retired.status === 'completed' && retired.recovery.addressSlotIds.length === 2 &&
      retired.recovery.addressSlotIds.includes('slot-1') &&
      retired.recovery.addressSlotIds.includes('quick-save') &&
      JSON.stringify(native(JSON.parse(JSON.parse(retired.recovery.envelopeRaw).snapshot)).playerState.gear) === originalGear &&
      (await owner.readSlot(accountId, 'slot-1')).status === 'closed' &&
      (await owner.readSlot(accountId, 'quick-save')).status === 'closed',
    `native cross-slot terminal lost an address or gear: ${JSON.stringify(retired)}`);
    owner.close();
  });
  await test('missing native source artifact cannot mint a terminal settlement', async () => {
    const dbName = name(); const accountId = id('account');
    const owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Native Missing Source QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(first.status === 'ready', 'missing-source setup did not publish');
    if (first.status !== 'ready') return;
    const source = first.value.loaded;
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = indexedDB.open(dbName);
      open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('artifacts', 'readwrite');
      tx.objectStore('artifacts').delete([accountId, source.sessionControl.loadedArtifactId]);
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    const result = await new CleanEpochTerminalAdapter(owner).retire({ accountId,
      sourceSlotId: 'slot-1', expectedAccountRevision: (await owner.read(accountId))!.revision,
      snapshot: source.snapshot, control: source.sessionControl,
      expectedSourceAddress: { artifactId: source.sessionControl.loadedArtifactId,
        publicationId: source.sessionControl.loadedPublicationId } });
    check(result.status === 'blocked' &&
      (await owner.readTerminalForSource(accountId, source.sessionControl.campaignId,
        source.sessionControl.loadedPublicationId)) === null &&
      (await owner.read(accountId))?.revision === 2,
    'missing native source allowed a terminal artifact or account mutation');
    owner.close();
  });
  await test('native descendant consumer abort resumes one accepted artifact and receipts', async () => {
    const dbName = name(); const accountId = id('account');
    let owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Native Recovery QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, formFixture());
    check(first.status === 'ready', 'native recovery first campaign did not publish');
    if (first.status !== 'ready') return;
    const revision = (await owner.read(accountId))!.revision;
    const originalGear = JSON.stringify(native(first.value.loaded.snapshot).playerState.gear);
    owner.close();
    let writes = 0;
    owner = await openCleanEpochAccountStore({ name: dbName,
      afterWrite: tx => { if (++writes === 5) tx.abort(); } });
    const interrupted = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: revision,
      snapshot: first.value.loaded.snapshot, control: first.value.loaded.sessionControl });
    check(interrupted.status === 'blocked' && interrupted.code === 'aborted',
      `native descendant consumer fault did not interrupt: ${JSON.stringify(interrupted)}`);
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    const pending = await owner.readCurrentDescendantRecovery(accountId, 'slot-1');
    check(pending?.status === 'accepted_pending_consumers',
      'native descendant fault lost pending accepted artifact');
    if (!pending) return;
    const retryRequest = { publication: {
      accountId, campaignId: pending.campaignId, slotId: pending.slotId as SaveSlotId,
      expectedHead: pending.expectedHead, expectedSlotAddress: pending.expectedSlotAddress,
      artifactRaw: pending.envelopeRaw,
      control: { version: 1 as const, accountId, campaignId: pending.campaignId,
        headArtifactId: pending.artifactId, headPublicationId: pending.publicationId,
        headRevision: pending.headRevision,
        previousHeadArtifactId: pending.expectedHead.artifactId,
        previousHeadPublicationId: pending.expectedHead.publicationId,
        closed: false, updatedAt: pending.createdAt }
    }, expectedAccountRevision: pending.expectedAccountRevision,
      sourceSlotId: pending.sourceSlotId as SaveSlotId, sourceArtifactId: pending.sourceArtifactId,
      sourcePublicationId: pending.sourcePublicationId,
      sourceSnapshotRaw: pending.sourceSnapshotRaw, consumerPlans: pending.consumerPlans };
    const exactRetry = await owner.publishDescendant(retryRequest);
    check(exactRetry.publication.status === 'same_source_retry' &&
      exactRetry.recovery.publicationId === pending.publicationId &&
      (await owner.read(accountId))?.revision === revision,
      'lost-acknowledgement retry minted a second native descendant');
    const changedEnvelope = JSON.parse(pending.envelopeRaw);
    changedEnvelope.savedAt = new Date(Date.parse(changedEnvelope.savedAt) + 1000).toISOString();
    await rejectCode(() => owner.publishDescendant({ ...retryRequest, publication: {
      ...retryRequest.publication, artifactRaw: JSON.stringify(changedEnvelope) } }), 'conflict');
    check((await owner.read(accountId))?.revision === revision,
      'changed same-ID retry altered the pending native account');
    const resumed = await new CleanEpochDescendantAdapter(owner).resumeCurrent(accountId, 'slot-1');
    check(resumed.status === 'ready' && resumed.value.loaded.publication.publicationId === pending.publicationId &&
      JSON.stringify(native(resumed.value.loaded.snapshot).playerState.gear) === originalGear,
      'native descendant resume changed artifact or gear');
    const account = await owner.read(accountId);
    const receipts = account?.profile.campaignPublicationReceipts?.filter(
      receipt => receipt.publicationId === pending.publicationId) ?? [];
    check(account?.revision === revision + 1 && receipts.length === 4 &&
      receipts.every(receipt => receipt.status === 'applied'),
      'native descendant consumer completion did not commit exactly once');
    const second = await new CleanEpochDescendantAdapter(owner).resumeCurrent(accountId, 'slot-1');
    check(second.status === 'blocked' && (await owner.read(accountId))?.revision === revision + 1,
      'second resume repeated native account effects');
    owner.close();
  });
  await test('native first-publication consumer abort resumes exact accepted artifact after restart', async () => {
    const dbName = name(); const accountId = id('account');
    let owner = await openCleanEpochAccountStore({ name: dbName });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Recovery QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const prepared = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').prepare(accountId, formFixture());
    check(prepared.status === 'ready', 'native attempt not prepared'); owner.close();
    let writes = 0;
    owner = await openCleanEpochAccountStore({ name: dbName,
      afterWrite: tx => { if (++writes === 6) tx.abort(); } });
    const interrupted = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').resume(accountId, 'slot-1');
    check(interrupted.status === 'blocked' && interrupted.code === 'aborted', 'consumer abort did not block');
    owner.close(); owner = await openCleanEpochAccountStore({ name: dbName });
    const pending = await owner.readRecovery(accountId, 'slot-1');
    check(pending?.status === 'accepted_pending_consumers', 'abort lost pending native artifact');
    if (!pending) throw new Error('Pending native recovery is missing.');
    const resumed = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').resume(accountId, 'slot-1');
    check(resumed.status === 'ready' && resumed.value.loaded.publication.publicationId === pending.publicationId &&
      (await owner.read(accountId))?.revision === 2, 'restart republished or lost native consumer');
    owner.close();
  });
  await test('native creator artifact publishes, reads back, restarts and retries exactly', async () => {
    const dbName = name(); const snapshot = fixture(id('account'));
    const request = await attempt(snapshot, null); let store = await openCampaignIndexedDbStore({ name: dbName });
    const first = await store.publish(request);
    check(first.status === 'committed' && first.readback.artifactRaw === request.artifactRaw, 'first bytes changed');
    const envelope = JSON.parse(first.readback.artifactRaw);
    const readback = await readNativeFreshSaveSnapshot(envelope.snapshot);
    check(JSON.stringify(readback.playerState.gear) === JSON.stringify(snapshot.playerState.gear), 'gear changed');
    check(JSON.stringify(readback.playerState.inventory) === JSON.stringify(snapshot.playerState.inventory), 'bag changed');
    check(envelope.campaignId === snapshot.campaignIdentity!.campaignId && envelope.version === 8, 'identity/version changed');
    store.close(); store = await openCampaignIndexedDbStore({ name: dbName });
    const reopened = await store.read(request.accountId, request.campaignId, request.slotId);
    check(reopened?.artifactRaw === request.artifactRaw && reopened.slotRaw === request.artifactRaw, 'restart bytes changed');
    check((await store.publish(request)).status === 'same_source_retry', 'retry duplicated publication');
    store.close();
  });
  await test('native survey material reads the actual current retained v3 artifact after restart', async () => {
    const accountId = id('account');
    const identity = getLineageIdentityCatalog('lineage.human')!;
    const form = {
      ...formFixture(), backstoryId: 'backstory.craftsmans_child',
      continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
      startingSettlementId: 'settlement.starfall_port',
      hairColorId: identity.hairColorOptions[0]!.id
    };
    const first = createNativeNewGameSnapshot(form, accountId);
    const questInput = first as unknown as SaveSnapshot;
    const accepted = executePlayerQuestAcceptanceCommand(questInput,
      createPlayerQuestAcceptanceCommand(questInput, 'quest.ashen_reef_survey'));
    check(accepted.accepted, 'authored quest acceptance failed');
    if (!accepted.accepted) return;
    const traveled = executePlayerTravelCommand(accepted.snapshot,
      createPlayerTravelCommand(accepted.snapshot, 'location.ashen_reef'));
    check(traveled.accepted, 'authored survey travel failed');
    if (!traveled.accepted) return;
    const nativeTraveled = traveled.snapshot as unknown as ReturnType<typeof fixture>;
    const publication = await attempt(nativeTraveled, null);
    const dbName = name(); let store = await openCampaignIndexedDbStore({ name: dbName });
    await store.publish(publication);
    store.close(); store = await openCampaignIndexedDbStore({ name: dbName });
    const bound = await readRetainedNativeSurveyMaterial(store, accountId,
      nativeTraveled.campaignIdentity!.campaignId, 'slot-1');
    check(bound.sourceIdentity.artifactId === publication.control.headArtifactId &&
      bound.sourceIdentity.publicationId === publication.control.headPublicationId &&
      bound.witness.stage === 'sector_1' &&
      bound.material.endClock.tick === nativeTraveled.clock.tick + 2,
      'restarted material did not bind to the retained head');
    check(JSON.stringify(bound.snapshot.playerState.gear) ===
      JSON.stringify(nativeTraveled.playerState.gear), 'retained material changed native gear');
    store.close();
  });
  await test('first native survey result publishes from retained source and survives restart', async () => {
    const accountId = id('account');
    const identity = getLineageIdentityCatalog('lineage.human')!;
    const form = { ...formFixture(), backstoryId: 'backstory.craftsmans_child',
      continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
      startingSettlementId: 'settlement.starfall_port',
      hairColorId: identity.hairColorOptions[0]!.id };
    const first = createNativeNewGameSnapshot(form, accountId);
    const accepted = executePlayerQuestAcceptanceCommand(first as unknown as SaveSnapshot,
      createPlayerQuestAcceptanceCommand(first as unknown as SaveSnapshot, 'quest.ashen_reef_survey'));
    check(accepted.accepted, 'authored quest acceptance failed');
    if (!accepted.accepted) return;
    const traveled = executePlayerTravelCommand(accepted.snapshot,
      createPlayerTravelCommand(accepted.snapshot, 'location.ashen_reef'));
    check(traveled.accepted, 'authored travel failed');
    if (!traveled.accepted) return;
    const source = traveled.snapshot as unknown as ReturnType<typeof fixture>;
    const dbName = name(); let store = await openCampaignIndexedDbStore({ name: dbName });
    const firstPublication = await attempt(source, null);
    await store.publish(firstPublication);
    const bound = await readRetainedNativeSurveyMaterial(store, accountId,
      source.campaignIdentity!.campaignId, 'slot-1');
    const commandId = `survey_request.${crypto.randomUUID()}`;
    const committed = commitNativeSurveyFirstShift(bound, commandId);
    const expectedHead = { artifactId: firstPublication.control.headArtifactId,
      publicationId: firstPublication.control.headPublicationId, revision: 1 };
    const descendant = await attempt(committed.snapshot, expectedHead);
    check((await store.publish(descendant)).status === 'committed', 'native result was not published');
    store.close(); store = await openCampaignIndexedDbStore({ name: dbName });
    const retained = await store.read(accountId, source.campaignIdentity!.campaignId, 'slot-1');
    check(retained?.artifactRaw === descendant.artifactRaw, 'restarted native result changed bytes');
    const loaded = await readNativeFreshSaveSnapshot(JSON.parse(retained!.artifactRaw).snapshot);
    check(loaded.nativeSurvey?.results[0]?.requestId === commandId &&
      loaded.clock.tick === source.clock.tick + 2 &&
      JSON.stringify(loaded.playerState.gear) === JSON.stringify(source.playerState.gear),
      'restarted result lost command, time or native gear');
    check((await store.publish(descendant)).status === 'same_source_retry', 'exact retry repeated effect');
    const fork = await attempt(commitNativeSurveyFirstShift(bound,
      `survey_request.${crypto.randomUUID()}`).snapshot, expectedHead);
    await rejectCode(() => store.publish(fork), 'stale_head');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = indexedDB.open(dbName);
      open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('artifacts', 'readwrite');
      tx.objectStore('artifacts').delete([accountId, firstPublication.control.headArtifactId]);
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    await rejectCode(() => store.read(accountId, source.campaignIdentity!.campaignId, 'slot-1'), 'invalid_record');
    store.close();
  });
  await test('all four native survey stages publish and restart through their retained artifact chain', async () => {
    const accountId = id('account');
    const identity = getLineageIdentityCatalog('lineage.human')!;
    const form = { ...formFixture(), backstoryId: 'backstory.craftsmans_child',
      continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
      startingSettlementId: 'settlement.starfall_port',
      hairColorId: identity.hairColorOptions[0]!.id };
    const created = createNativeNewGameSnapshot(form, accountId);
    const accepted = executePlayerQuestAcceptanceCommand(created as unknown as SaveSnapshot,
      createPlayerQuestAcceptanceCommand(created as unknown as SaveSnapshot, 'quest.ashen_reef_survey'));
    check(accepted.accepted, 'authored quest acceptance failed');
    if (!accepted.accepted) return;
    const traveled = executePlayerTravelCommand(accepted.snapshot,
      createPlayerTravelCommand(accepted.snapshot, 'location.ashen_reef'));
    check(traveled.accepted, 'authored survey travel failed');
    if (!traveled.accepted) return;
    const source = traveled.snapshot as unknown as ReturnType<typeof fixture>;
    const dbName = name(); let store = await openCampaignIndexedDbStore({ name: dbName });
    let publication = await attempt(source, null);
    await store.publish(publication);
    const stages = ['sector_1', 'sector_2', 'sector_3', 'ruins_confirmation'];
    for (let index = 0; index < stages.length; index += 1) {
      const bound = await readRetainedNativeSurveyMaterial(store, accountId,
        source.campaignIdentity!.campaignId, 'slot-1');
      check(bound.witness.stage === stages[index], `wrong native stage ${index + 1}`);
      const commandId = `survey_request.${crypto.randomUUID()}`;
      const next = commitNativeSurveyShift(bound, commandId);
      const expected = { artifactId: publication.control.headArtifactId,
        publicationId: publication.control.headPublicationId,
        revision: publication.control.headRevision };
      const proposed = await attempt(next.snapshot, expected);
      if (index === 1) {
        store.close();
        const interrupted = await openCampaignIndexedDbStore({ name: dbName,
          afterWrite: (family, tx) => { if (family === 'artifacts') tx.abort(); } });
        await rejectCode(() => interrupted.publish(proposed), 'aborted');
        interrupted.close(); store = await openCampaignIndexedDbStore({ name: dbName });
        check((await store.read(accountId, source.campaignIdentity!.campaignId, 'slot-1'))?.artifactRaw ===
          publication.artifactRaw, 'interrupted second shift changed the retained head');
      }
      publication = proposed;
      check((await store.publish(publication)).status === 'committed', `stage ${index + 1} was not published`);
      store.close(); store = await openCampaignIndexedDbStore({ name: dbName });
      const retained = await store.read(accountId, source.campaignIdentity!.campaignId, 'slot-1');
      check(retained?.artifactRaw === publication.artifactRaw, `stage ${index + 1} restart changed bytes`);
      const loaded = await readNativeFreshSaveSnapshot(JSON.parse(retained!.artifactRaw).snapshot);
      check(loaded.nativeSurvey?.results.length === index + 1 &&
        loaded.nativeSurvey?.receipts.length === index + 1 &&
        loaded.nativeSurvey?.results[index]?.requestId === commandId &&
        JSON.stringify(loaded.playerState.gear) === JSON.stringify(source.playerState.gear),
        `stage ${index + 1} lost result, receipt or physical gear`);
      check((await store.publish(publication)).status === 'same_source_retry',
        `stage ${index + 1} exact retry repeated effects`);
    }
    const final = await store.read(accountId, source.campaignIdentity!.campaignId, 'slot-1');
    const loaded = await readNativeFreshSaveSnapshot(JSON.parse(final!.artifactRaw).snapshot);
    check(loaded.clock.tick === source.clock.tick + 8 &&
      loaded.sessionState.flags.includes('gameplay.quest.ashen_reef_survey.ruins_confirmed') &&
      loaded.sessionState.flags.includes('gameplay.discovery.stormglass_bloom') &&
      loaded.playerState.discoveryChronicle.entries.filter(row =>
        row.id === 'discovery.stormglass_bloom').length === 1 &&
      loaded.sessionState.currentActivity?.id === 'activity.return.survey_packet',
      'four-stage retained survey owner effects are incomplete');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = indexedDB.open(dbName);
      open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('artifacts', 'readwrite');
      tx.objectStore('artifacts').delete([accountId, loaded.nativeSurvey!.results[1]!.sourceWitness.sourceArtifactId]);
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    await rejectCode(() => store.read(accountId, source.campaignIdentity!.campaignId, 'slot-1'), 'invalid_record');
    store.close();
  });
  await test('stale head, fork and changed same-ID retry cannot replace accepted artifact', async () => {
    const snapshot = fixture(id('account')); const store = await openCampaignIndexedDbStore({ name: name() });
    const first = await attempt(snapshot, null); await store.publish(first);
    const expected = { artifactId: first.control.headArtifactId, publicationId: first.control.headPublicationId, revision: 1 };
    const winner = await attempt(snapshot, expected); await store.publish(winner);
    const fork = await attempt(snapshot, expected); await rejectCode(() => store.publish(fork), 'stale_head');
    const altered = { ...winner, artifactRaw: winner.artifactRaw.replace('Native Publication QA', 'Altered QA') };
    await rejectCode(() => store.publish(altered), 'conflict');
    check((await store.read(first.accountId, first.campaignId, first.slotId))?.artifactRaw === winner.artifactRaw, 'accepted head changed');
    store.close();
  });
  await test('interrupted artifact/head/address transaction leaves no partial publication', async () => {
    for (const family of ['artifacts', 'controls', 'slots']) {
      const dbName = name(); const snapshot = fixture(id('account')); const request = await attempt(snapshot, null);
      const failing = await openCampaignIndexedDbStore({ name: dbName, afterWrite: (written, tx) => {
        if (written === family) tx.abort();
      } });
      await rejectCode(() => failing.publish(request), 'aborted'); failing.close();
      const reopened = await openCampaignIndexedDbStore({ name: dbName });
      check(await reopened.read(request.accountId, request.campaignId, request.slotId) === null, `${family} abort left a head`);
      await reopened.publish(request); reopened.close();
    }
  });
  await test('malformed native payload is rejected before any durable write', async () => {
    const snapshot = fixture(id('account')); const request = await attempt(snapshot, null);
    const envelope = JSON.parse(request.artifactRaw); const broken = JSON.parse(envelope.snapshot);
    broken.playerState.gear.instances[0].itemInstanceId = broken.playerState.gear.instances[1].itemInstanceId;
    envelope.snapshot = JSON.stringify(broken);
    const store = await openCampaignIndexedDbStore({ name: name() });
    await rejectCode(() => store.publish({ ...request, artifactRaw: JSON.stringify(envelope) }), 'invalid_record');
    check(await store.read(request.accountId, request.campaignId, request.slotId) === null, 'corrupt payload wrote head');
    store.close();
  });
  await test('corrupted retained native artifact fails readback without substituting a parallel owner', async () => {
    const dbName = name(); const snapshot = fixture(id('account')); const request = await attempt(snapshot, null);
    let store = await openCampaignIndexedDbStore({ name: dbName });
    await store.publish(request); store.close();
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = indexedDB.open(dbName);
      open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('artifacts', 'readwrite');
      const table = tx.objectStore('artifacts');
      const get = table.get([request.accountId, request.control.headArtifactId]);
      get.onsuccess = () => {
        const row = get.result;
        const envelope = JSON.parse(row.raw); const broken = JSON.parse(envelope.snapshot);
        broken.playerState.gear.instances[0].durability = -1;
        envelope.snapshot = JSON.stringify(broken); row.raw = JSON.stringify(envelope);
        table.put(row);
      };
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
      tx.onerror = () => reject(tx.error);
    });
    db.close(); store = await openCampaignIndexedDbStore({ name: dbName });
    await rejectCode(() => store.read(request.accountId, request.campaignId, request.slotId), 'invalid_record');
    store.close();
  });
  output.textContent = `PASS ${passed.length}\n${passed.join('\n')}`;
}
suite().catch(error => { output.textContent = `FAIL after ${passed.length}\n${error instanceof Error ? error.stack : String(error)}`; });
