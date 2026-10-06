import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { evaluateAchievementProgress } from '../../packages/engines/game-engine/src/achievements.ts';
import { admitCampaignMutation, type CampaignSessionControl } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from '../../packages/engines/game-engine/src/player-quest-acceptance.ts';
import { createPlayerTravelCommand, executePlayerTravelCommand } from '../../packages/engines/game-engine/src/player-travel.ts';
import type { SaveSnapshot } from '../../packages/shared/types/src/index.ts';
import { serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';
import { advanceAshenReefSurveyCaller } from './src/runtime/ashenReefSurveyCaller.ts';
import { submitSoundingsTurnInCaller } from './src/runtime/soundingsTurnInCaller.ts';
import { CampaignStoreError, ensureCampaignPublicationStores,
  type CampaignStorePublication } from './src/game-shell/campaignIndexedDbStore.ts';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { buildSaveMetadata, type StoredSaveEnvelope } from './src/game-shell/saveManager.ts';
import { accountLifecycleGeneration, openCleanEpochAccountStore,
  CLEAN_EPOCH_DATABASE_VERSION, CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE,
  type CleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

// Synthetic, isolated browser fixtures. No ordinary player account is touched.
const output = document.querySelector<HTMLPreElement>('#result')!;
const cases: string[] = [];
const families = [
  ['newCampaignAttempts', 'slotId'], ['pendingPublicationRecoveries', 'slotId'],
  ['descendantPublicationRecoveries', 'campaignId', 'publicationId'],
  ['terminalLifecycleRecoveries', 'campaignId', 'publicationId'],
  ['campaignAttemptsV6', 'campaignId'], ['firstPublicationRecoveriesV6', 'campaignId'],
  ['currentSlotGenerations', 'slotId'],
  ['addressDeletionReceipts', 'slotId', 'slotGenerationId'],
  ['artifacts', 'artifactId'], ['controls', 'campaignId'], ['slots', 'slotId'],
  ['witnesses', 'campaignId', 'requestId']
] as const;
const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Mara G9F Pending',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
}
async function test(name: string, run: () => Promise<void>) {
  output.textContent = `RUNNING ${name} after ${cases.length}`;
  await run(); cases.push(name);
}
function storage(): Storage {
  const values = new Map<string, string>();
  return { get length() { return values.size; }, clear: () => values.clear(),
    getItem: key => values.get(key) ?? null,
    key: index => [...values.keys()][index] ?? null,
    removeItem: key => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); } };
}
async function raw(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, CLEAN_EPOCH_DATABASE_VERSION);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function changeFirstRow(name: string, accountId: string, family: string,
  change: (row: Record<string, any>, store: IDBObjectStore, key: IDBValidKey) => void) {
  const db = await raw(name);
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(family, 'readwrite');
    const store = tx.objectStore(family);
    const cursor = store.openCursor(IDBKeyRange.bound([accountId], [accountId, []]));
    cursor.onsuccess = () => {
      if (!cursor.result) { tx.abort(); reject(new Error(`Missing ${family} fixture row`)); return; }
      change(cursor.result.value, store, cursor.result.primaryKey);
    };
    cursor.onerror = () => reject(cursor.error);
    tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
  });
  db.close();
}
async function rows(name: string, accountId: string): Promise<Record<string, unknown[]>> {
  const db = await raw(name);
  const result: Record<string, unknown[]> = {};
  for (const family of families) {
    const tx = db.transaction(family[0], 'readonly');
    result[family[0]] = await new Promise<unknown[]>((resolve, reject) => {
      const request = tx.objectStore(family[0]).getAll(IDBKeyRange.bound([accountId], [accountId, []]));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  db.close();
  return result;
}
async function setup(label: string, beforeWrite?: (tx: IDBTransaction) => void) {
  const name = `lineage.epoch-g9f.qa.${label}.${crypto.randomUUID()}`;
  const accountId = `account.local.${crypto.randomUUID()}`;
  const otherId = `account.local.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name, beforeWrite });
  for (const id of [accountId, otherId])
    await owner.register(createDefaultAccountProfileState({ accountId: id, displayName: id }),
      await createCredentialRecord(id, 'synthetic-only-password', new Date().toISOString()));
  for (const id of [accountId, otherId]) {
    const first = await new CleanEpochFirstCampaignAdapter(owner).start(id, form());
    check(first.status === 'ready', `Coherent first campaign failed: ${JSON.stringify(first)}`);
  }
  const account = (await owner.read(accountId))!;
  return { name, accountId, otherId, owner,
    input: { accountId, expectedRevision: account.revision,
      expectedGeneration: accountLifecycleGeneration(account),
      currentPassword: 'synthetic-only-password' } };
}
async function rejected(run: () => Promise<unknown>, code: string) {
  try { await run(); throw new Error(`Expected ${code} rejection`); }
  catch (error) { check(error instanceof CampaignStoreError && error.code === code,
    `Expected ${code}, got ${String(error)}`); }
}
async function resetOrDelete(kind: 'reset' | 'delete', x: Awaited<ReturnType<typeof setup>>) {
  const account = (await x.owner.read(x.accountId))!;
  return x.owner.transitionAccount(kind, { accountId: x.accountId,
    expectedRevision: account.revision, expectedGeneration: accountLifecycleGeneration(account),
    currentPassword: 'synthetic-only-password' });
}
async function assertBlockedWithoutErasure(kind: 'reset' | 'delete',
  x: Awaited<ReturnType<typeof setup>>) {
  const accountBefore = JSON.stringify(await x.owner.read(x.accountId));
  const ownBefore = JSON.stringify(await rows(x.name, x.accountId));
  const otherBefore = JSON.stringify(await rows(x.name, x.otherId));
  await rejected(() => resetOrDelete(kind, x), 'invalid_record');
  check(JSON.stringify(await x.owner.read(x.accountId)) === accountBefore &&
    JSON.stringify(await rows(x.name, x.accountId)) === ownBefore &&
    JSON.stringify(await rows(x.name, x.otherId)) === otherBefore &&
    await x.owner.readLifecycleReceipt(x.accountId) === null,
  `${kind} changed authority after graph preflight rejection`);
}
async function deleteFirstSlot(x: Awaited<ReturnType<typeof setup>>) {
  const account = (await x.owner.readSelected(x.accountId))!;
  const pointer = (await x.owner.readSlotGeneration(x.accountId, 'slot-1'))!;
  const slot = await x.owner.readSlot(x.accountId, 'slot-1');
  check(slot.status === 'ready', 'address deletion source missing');
  const result = await x.owner.deleteSlotAddress({ accountId: x.accountId, slotId: 'slot-1',
    expectedAccountRevision: account.revision, expectedSlotGenerationId: pointer.slotGenerationId,
    expectedAddress: { artifactId: slot.loaded.sessionControl.loadedArtifactId,
      publicationId: slot.loaded.sessionControl.loadedPublicationId },
    deletedAt: new Date().toISOString() });
  check(result.status === 'committed', 'address deletion failed');
}
async function closeTerminalGraph(x: Awaited<ReturnType<typeof setup>>) {
  const source = await x.owner.readSlot(x.accountId, 'slot-1');
  check(source.status === 'ready', 'terminal cleanup source missing');
  const account = (await x.owner.readSelected(x.accountId))!;
  const retired = await new CleanEpochTerminalAdapter(x.owner).retire({
    accountId: x.accountId, sourceSlotId: 'slot-1', expectedAccountRevision: account.revision,
    snapshot: source.loaded.snapshot, control: source.loaded.sessionControl,
    expectedSourceAddress: { artifactId: source.loaded.sessionControl.loadedArtifactId,
      publicationId: source.loaded.sessionControl.loadedPublicationId } });
  check(retired.status === 'completed', `terminal cleanup retirement failed: ${JSON.stringify(retired)}`);
  const closed = await x.owner.closeTerminalAddresses(x.accountId,
    retired.recovery.campaignId, retired.recovery.publicationId,
    retired.account.revision, new Date().toISOString());
  check(closed.status === 'committed' &&
    (await x.owner.readSlot(x.accountId, 'slot-1')).status === 'empty' &&
    closed.recovery.addressClosure?.receipts.length === 1 &&
    closed.account.profile.history.runRecords[0]?.saveSlotIds.length === 0 &&
    (await rows(x.name, x.accountId)).addressDeletionReceipts.length === 1,
    'terminal cleanup did not retain closed history with zero live addresses');
}
async function publishWitness(x: Awaited<ReturnType<typeof setup>>) {
  const first = await x.owner.readSlot(x.accountId, 'slot-1');
  check(first.status === 'ready', 'Soundings fixture has no first campaign');
  let state: { snapshot: SaveSnapshot; control: CampaignSessionControl } = {
    snapshot: first.loaded.snapshot, control: first.loaded.sessionControl };
  const admit = (result: { accepted: boolean; snapshot: SaveSnapshot }, mutationId: string) => {
    check(result.accepted, `Soundings ${mutationId} rejected`);
    const accepted = admitCampaignMutation(state.control, { mutationId,
      sourceArtifactId: state.control.loadedArtifactId, sourceRevision: state.control.sessionRevision,
      ownerKind: 'engine_result', accepted: true, sourceSnapshot: state.snapshot,
      proposedSnapshot: result.snapshot });
    check(accepted.accepted, `Soundings session ${mutationId} rejected`);
    state = { snapshot: accepted.snapshot, control: accepted.control };
  };
  const travel = (destination: string) => {
    const command = createPlayerTravelCommand(state.snapshot, destination);
    admit(executePlayerTravelCommand(state.snapshot, command), `mutation.${command.commandId}`);
  };
  const quest = createPlayerQuestAcceptanceCommand(state.snapshot, 'quest.ashen_reef_survey');
  admit(executePlayerQuestAcceptanceCommand(state.snapshot, quest), `mutation.${quest.commandId}`);
  travel('location.ashen_reef');
  const cache = new Map();
  for (let index = 1; index <= 4; index++) {
    const requestId = `survey_request.00000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
    const result = advanceAshenReefSurveyCaller(state.snapshot, state.control, requestId, cache);
    check(result.outcome.kind === 'accepted' && result.acceptedState, 'survey fixture rejected');
    state = result.acceptedState!;
  }
  travel('settlement.starfall_port');
  const turnIn = submitSoundingsTurnInCaller(state.snapshot, state.control,
    `soundings_turn_in_request.${crypto.randomUUID()}`, new Map());
  check(turnIn.outcome.kind === 'accepted' && turnIn.acceptedState, 'Soundings turn-in rejected');
  state = turnIn.acceptedState!;
  const account = (await x.owner.readSelected(x.accountId))!;
  const saved = await new CleanEpochDescendantAdapter(x.owner).save({ accountId: x.accountId,
    sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
    snapshot: state.snapshot, control: state.control });
  check(saved.status === 'ready', `witness publication failed: ${JSON.stringify(saved)}`);
  check((await rows(x.name, x.accountId)).witnesses.length === 1,
    'Soundings fixture did not retain first witness');
}
async function publishPendingDescendant(x: Awaited<ReturnType<typeof setup>>) {
  const source = await x.owner.readSlot(x.accountId, 'slot-1');
  check(source.status === 'ready', 'pending descendant source missing');
  const account = (await x.owner.readSelected(x.accountId))!;
  const savedAt = new Date().toISOString();
  const snapshot = evaluateAchievementProgress(source.loaded.snapshot, account.profile,
    { slotId: 'slot-1', touchHistory: true, recordedAt: savedAt }).nextSnapshot;
  const control = source.loaded.sessionControl;
  const campaignId = snapshot.campaignIdentity!.campaignId;
  const artifactId = `artifact.${crypto.randomUUID()}`;
  const publicationId = `publication.${crypto.randomUUID()}`;
  const envelope: StoredSaveEnvelope = { version: 7, accountId: x.accountId,
    slotId: 'slot-1', savedAt,
    metadata: { ...buildSaveMetadata('slot-1', snapshot), lastSavedAt: savedAt,
      snapshotVersion: snapshot.snapshotVersion },
    snapshotFormatId: snapshot.snapshotVersion, campaignId,
    continuityId: snapshot.campaignIdentity!.continuityId,
    characterId: snapshot.playerState.playerId, artifactId,
    generationId: `generation.${crypto.randomUUID()}`, publicationId,
    headRevision: control.campaignHeadRevision + 1, terminal: false,
    snapshot: serializeSnapshot(snapshot) };
  const publication: CampaignStorePublication = { accountId: x.accountId, campaignId,
    slotId: 'slot-1', expectedSlotAddress: { artifactId: control.loadedArtifactId,
      publicationId: control.loadedPublicationId },
    expectedHead: { artifactId: control.campaignHeadArtifactId,
      publicationId: control.loadedPublicationId, revision: control.campaignHeadRevision },
    artifactRaw: JSON.stringify(envelope),
    control: { version: 1, accountId: x.accountId, campaignId,
      headArtifactId: artifactId, headPublicationId: publicationId,
      headRevision: envelope.headRevision,
      previousHeadArtifactId: control.campaignHeadArtifactId,
      previousHeadPublicationId: control.loadedPublicationId,
      closed: false, updatedAt: savedAt } };
  const payloadFingerprint = JSON.stringify({ slotId: 'slot-1',
    capturedAtTick: snapshot.capturedAtTick,
    characterAchievementIds: snapshot.playerState.achievements.unlocked.map(entry => entry.achievementId) });
  await x.owner.publishDescendant({ publication, expectedAccountRevision: account.revision,
    sourceSlotId: 'slot-1', sourceArtifactId: control.loadedArtifactId,
    sourcePublicationId: control.loadedPublicationId,
    sourceSnapshotRaw: serializeSnapshot(source.loaded.snapshot),
    consumerPlans: (['active_history', 'account_achievements', 'legacy_rewards', 'last_played'] as const)
      .map(kind => ({ kind, payloadFingerprint })) });
  const recovery = await x.owner.readCurrentDescendantRecovery(x.accountId, 'slot-1');
  check(recovery?.status === 'accepted_pending_consumers', 'pending descendant recovery missing');
}
async function suite() {
  // F1 regression: every corrupt fixture begins as a real published campaign.
  // Raw IndexedDB writes remove one required edge while other v1 rows remain.
  for (const kind of ['reset', 'delete'] as const) {
    for (const family of ['artifacts', 'controls', 'firstPublicationRecoveriesV6',
      'slots', 'currentSlotGenerations', 'campaignAttemptsV6'] as const) {
      await test(`${kind} rejects missing ${family} in a published campaign`, async () => {
        const x = await setup(`${kind}-missing-${family}`);
        await changeFirstRow(x.name, x.accountId, family, (_row, store, key) => store.delete(key));
        check((await rows(x.name, x.accountId)).campaignAttemptsV6.length === (family === 'campaignAttemptsV6' ? 0 : 1),
          'corrupt fixture did not retain expected campaign attempt state');
        await assertBlockedWithoutErasure(kind, x);
        x.owner.close();
      });
    }
    await test(`${kind} accepts a coherent published campaign`, async () => {
      const x = await setup(`${kind}-coherent-published`);
      const result = await resetOrDelete(kind, x);
      check(result.status === 'committed' && Object.values(await rows(x.name, x.accountId))
        .every(values => values.length === 0), `${kind} did not erase coherent graph`);
      x.owner.close();
    });
    await test(`${kind} accepts a second prepared first campaign`, async () => {
      const x = await setup(`${kind}-prepared-first`);
      const prepared = await new CleanEpochFirstCampaignAdapter(x.owner).prepare(x.accountId,
        { ...form(), saveSlotId: 'slot-2', playerName: 'Second prepared campaign' });
      check(prepared.status === 'ready' &&
        (await rows(x.name, x.accountId)).campaignAttemptsV6.length === 2,
        'prepared first-campaign fixture missing');
      check((await resetOrDelete(kind, x)).status === 'committed',
        `${kind} rejected valid prepared first campaign`);
      x.owner.close();
    });
    await test(`${kind} accepts pending first-campaign consumers`, async () => {
      const x = await setup(`${kind}-pending-first`);
      const creator = new CleanEpochFirstCampaignAdapter(x.owner);
      const prepared = await creator.prepare(x.accountId,
        { ...form(), saveSlotId: 'slot-2', playerName: 'Second pending campaign' });
      check(prepared.status === 'ready', 'pending first campaign did not prepare');
      x.owner.close();
      let writes = 0;
      const failing = await openCleanEpochAccountStore({ name: x.name,
        afterWrite: tx => { if (++writes === 6) tx.abort(); } });
      const interrupted = await new CleanEpochFirstCampaignAdapter(failing).resume(x.accountId, 'slot-2');
      check(interrupted.status === 'blocked', 'first-campaign consumer fixture did not interrupt');
      failing.close();
      const owner = await openCleanEpochAccountStore({ name: x.name });
      const pending = await owner.readRecovery(x.accountId, 'slot-2');
      check(pending?.status === 'accepted_pending_consumers', 'pending first recovery missing');
      check((await resetOrDelete(kind, { ...x, owner })).status === 'committed',
        `${kind} rejected valid pending first recovery`);
      owner.close();
    });
    await test(`${kind} accepts a completed descendant with retained first history`, async () => {
      const x = await setup(`${kind}-descendant`);
      const source = await x.owner.readSlot(x.accountId, 'slot-1');
      check(source.status === 'ready', 'descendant source missing');
      const account = (await x.owner.readSelected(x.accountId))!;
      const descendant = await new CleanEpochDescendantAdapter(x.owner).save({
        accountId: x.accountId, sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
        expectedAccountRevision: account.revision, snapshot: source.loaded.snapshot,
        control: source.loaded.sessionControl, expectedDestinationAddress: null });
      check(descendant.status === 'ready', `descendant fixture failed: ${JSON.stringify(descendant)}`);
      check((await resetOrDelete(kind, x)).status === 'committed', `${kind} rejected valid descendant`);
      x.owner.close();
    });
    await test(`${kind} accepts pending descendant consumers`, async () => {
      const x = await setup(`${kind}-pending-descendant`);
      await publishPendingDescendant(x);
      check((await resetOrDelete(kind, x)).status === 'committed',
        `${kind} rejected valid pending descendant recovery`);
      x.owner.close();
    });
    await test(`${kind} rejects missing pending descendant recovery`, async () => {
      const x = await setup(`${kind}-pending-descendant-missing`);
      await publishPendingDescendant(x);
      await changeFirstRow(x.name, x.accountId, 'descendantPublicationRecoveries',
        (_row, store, key) => store.delete(key));
      await assertBlockedWithoutErasure(kind, x);
      x.owner.close();
    });
    await test(`${kind} rejects missing descendant recovery`, async () => {
      const x = await setup(`${kind}-descendant-recovery-missing`);
      const source = await x.owner.readSlot(x.accountId, 'slot-1');
      check(source.status === 'ready', 'descendant source missing');
      const account = (await x.owner.readSelected(x.accountId))!;
      const saved = await new CleanEpochDescendantAdapter(x.owner).save({ accountId: x.accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
        expectedAccountRevision: account.revision, snapshot: source.loaded.snapshot,
        control: source.loaded.sessionControl, expectedDestinationAddress: null });
      check(saved.status === 'ready', 'descendant recovery fixture failed');
      await changeFirstRow(x.name, x.accountId, 'descendantPublicationRecoveries',
        (_row, store, key) => store.delete(key));
      await assertBlockedWithoutErasure(kind, x);
      x.owner.close();
    });
    await test(`${kind} accepts terminal settlement and closed head`, async () => {
      const x = await setup(`${kind}-terminal`);
      const source = await x.owner.readSlot(x.accountId, 'slot-1');
      check(source.status === 'ready', 'terminal source missing');
      const account = (await x.owner.readSelected(x.accountId))!;
      const retired = await new CleanEpochTerminalAdapter(x.owner).retire({
        accountId: x.accountId, sourceSlotId: 'slot-1', expectedAccountRevision: account.revision,
        snapshot: source.loaded.snapshot, control: source.loaded.sessionControl,
        expectedSourceAddress: { artifactId: source.loaded.sessionControl.loadedArtifactId,
          publicationId: source.loaded.sessionControl.loadedPublicationId } });
      check(retired.status === 'completed', `terminal fixture failed: ${JSON.stringify(retired)}`);
      check((await resetOrDelete(kind, x)).status === 'committed', `${kind} rejected settled terminal`);
      x.owner.close();
    });
    await test(`${kind} rejects missing terminal recovery`, async () => {
      const x = await setup(`${kind}-terminal-recovery-missing`);
      const source = await x.owner.readSlot(x.accountId, 'slot-1');
      check(source.status === 'ready', 'terminal source missing');
      const account = (await x.owner.readSelected(x.accountId))!;
      const retired = await new CleanEpochTerminalAdapter(x.owner).retire({
        accountId: x.accountId, sourceSlotId: 'slot-1', expectedAccountRevision: account.revision,
        snapshot: source.loaded.snapshot, control: source.loaded.sessionControl,
        expectedSourceAddress: { artifactId: source.loaded.sessionControl.loadedArtifactId,
          publicationId: source.loaded.sessionControl.loadedPublicationId } });
      check(retired.status === 'completed', 'terminal recovery fixture failed');
      await changeFirstRow(x.name, x.accountId, 'terminalLifecycleRecoveries',
        (_row, store, key) => store.delete(key));
      await assertBlockedWithoutErasure(kind, x);
      x.owner.close();
    });
    await test(`${kind} accepts pending terminal settlement`, async () => {
      const x = await setup(`${kind}-pending-terminal`);
      const source = await x.owner.readSlot(x.accountId, 'slot-1');
      check(source.status === 'ready', 'pending terminal source missing');
      const account = (await x.owner.readSelected(x.accountId))!;
      x.owner.close();
      let writes = 0;
      const failing = await openCleanEpochAccountStore({ name: x.name,
        afterWrite: tx => { if (++writes === 5) tx.abort(); } });
      const retired = await new CleanEpochTerminalAdapter(failing).retire({
        accountId: x.accountId, sourceSlotId: 'slot-1', expectedAccountRevision: account.revision,
        snapshot: source.loaded.snapshot, control: source.loaded.sessionControl,
        expectedSourceAddress: { artifactId: source.loaded.sessionControl.loadedArtifactId,
          publicationId: source.loaded.sessionControl.loadedPublicationId } });
      check(retired.status === 'blocked', 'terminal settlement fixture did not interrupt');
      failing.close();
      const owner = await openCleanEpochAccountStore({ name: x.name });
      check((await owner.readPendingTerminalForAccount(x.accountId))?.status === 'accepted_pending_settlement',
        'pending terminal recovery missing');
      check((await resetOrDelete(kind, { ...x, owner })).status === 'committed',
        `${kind} rejected valid pending terminal settlement`);
      owner.close();
    });
    await test(`${kind} accepts terminal cleanup with zero live addresses`, async () => {
      const x = await setup(`${kind}-terminal-cleanup`);
      await closeTerminalGraph(x);
      check((await resetOrDelete(kind, x)).status === 'committed',
        `${kind} rejected valid terminal cleanup`);
      x.owner.close();
    });
    await test(`${kind} rejects missing terminal closure receipt`, async () => {
      const x = await setup(`${kind}-terminal-closure-receipt-missing`);
      await closeTerminalGraph(x);
      await changeFirstRow(x.name, x.accountId, 'addressDeletionReceipts',
        (_row, store, key) => store.delete(key));
      await assertBlockedWithoutErasure(kind, x);
      x.owner.close();
    });
    await test(`${kind} rejects corrupt terminal closure binding`, async () => {
      const x = await setup(`${kind}-terminal-closure-binding-corrupt`);
      await closeTerminalGraph(x);
      await changeFirstRow(x.name, x.accountId, 'terminalLifecycleRecoveries', (row, store) =>
        store.put({ ...row, addressClosure: { ...row.addressClosure,
          receipts: [{ ...row.addressClosure.receipts[0], artifactId: 'artifact.wrong' }] } }));
      await assertBlockedWithoutErasure(kind, x);
      x.owner.close();
    });
    await test(`${kind} rejects corrupt terminal closure receipt time`, async () => {
      const x = await setup(`${kind}-terminal-closure-time-corrupt`);
      await closeTerminalGraph(x);
      await changeFirstRow(x.name, x.accountId, 'addressDeletionReceipts', (row, store) =>
        store.put({ ...row, deletedAt: '2026-01-01T00:00:00.000Z' }));
      await assertBlockedWithoutErasure(kind, x);
      x.owner.close();
    });
    await test(`${kind} accepts first witnessed Soundings publication`, async () => {
      const x = await setup(`${kind}-witnessed`);
      await publishWitness(x);
      check((await resetOrDelete(kind, x)).status === 'committed',
        `${kind} rejected valid witnessed publication`);
      x.owner.close();
    });
    await test(`${kind} rejects missing first Soundings witness`, async () => {
      const x = await setup(`${kind}-witness-missing`);
      await publishWitness(x);
      await changeFirstRow(x.name, x.accountId, 'witnesses', (_row, store, key) => store.delete(key));
      await assertBlockedWithoutErasure(kind, x);
      x.owner.close();
    });
    await test(`${kind} accepts G9E deleted address with retained history`, async () => {
      const x = await setup(`${kind}-address-deleted`);
      await deleteFirstSlot(x);
      check((await x.owner.readSlot(x.accountId, 'slot-1')).status === 'empty' &&
        (await rows(x.name, x.accountId)).addressDeletionReceipts.length === 1,
      'valid deleted-address fixture missing');
      check((await resetOrDelete(kind, x)).status === 'committed', `${kind} rejected valid deleted address`);
      x.owner.close();
    });
    await test(`${kind} accepts reused slot with prior-generation deletion receipt`, async () => {
      const x = await setup(`${kind}-reused-slot`);
      await deleteFirstSlot(x);
      const replacement = await new CleanEpochFirstCampaignAdapter(x.owner).start(x.accountId,
        { ...form(), playerName: 'Replacement after deletion' });
      check(replacement.status === 'ready' &&
        (await rows(x.name, x.accountId)).addressDeletionReceipts.length === 1,
        'historical reused-slot fixture failed');
      check((await resetOrDelete(kind, x)).status === 'committed',
        `${kind} rejected valid prior-generation history`);
      x.owner.close();
    });
    await test(`${kind} rejects missing prior-generation deletion receipt after reuse`, async () => {
      const x = await setup(`${kind}-reused-slot-receipt-missing`);
      await deleteFirstSlot(x);
      const replacement = await new CleanEpochFirstCampaignAdapter(x.owner).start(x.accountId,
        { ...form(), playerName: 'Replacement before corruption' });
      check(replacement.status === 'ready', 'historical reused-slot corruption fixture failed');
      await changeFirstRow(x.name, x.accountId, 'addressDeletionReceipts',
        (_row, store, key) => store.delete(key));
      await assertBlockedWithoutErasure(kind, x);
      x.owner.close();
    });
    await test(`${kind} rejects missing G9E deletion receipt`, async () => {
      const x = await setup(`${kind}-receipt-missing`);
      await deleteFirstSlot(x);
      await changeFirstRow(x.name, x.accountId, 'addressDeletionReceipts',
        (_row, store, key) => store.delete(key));
      await assertBlockedWithoutErasure(kind, x);
      x.owner.close();
    });
  }
  await test('v6 account upgrades additively and resets from generation one', async () => {
    const name = `lineage.epoch-g9f.qa.upgrade.${crypto.randomUUID()}`;
    const accountId = `account.local.${crypto.randomUUID()}`;
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(name, 6);
      request.onupgradeneeded = () => {
        const upgraded = request.result;
        ensureCampaignPublicationStores(upgraded);
        upgraded.createObjectStore('accounts', { keyPath: 'accountId' });
        for (const family of families.slice(0, 8))
          upgraded.createObjectStore(family[0], { keyPath: ['accountId', ...family.slice(1)] });
        const terminal = request.transaction!.objectStore('terminalLifecycleRecoveries');
        terminal.createIndex('bySourcePublication', ['accountId', 'campaignId', 'sourcePublicationId'],
          { unique: true });
        terminal.createIndex('byAccount', 'accountId', { unique: false });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const old = { version: 1, accountId, revision: 1,
      profile: createDefaultAccountProfileState({ accountId, displayName: 'v6 Account' }),
      credential: await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()) };
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('accounts', 'readwrite');
      tx.objectStore('accounts').put(old);
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
    });
    db.close();
    const owner = await openCleanEpochAccountStore({ name });
    check(accountLifecycleGeneration((await owner.readSelected(accountId))!) === 1,
      'v6 retained account lacked initial generation');
    const done = await owner.transitionAccount('reset', { accountId, expectedRevision: 1,
      expectedGeneration: 1, currentPassword: 'synthetic-only-password' });
    check(done.account?.revision === 2 && accountLifecycleGeneration(done.account) === 2,
      'v6 upgrade did not retain reset CAS');
    owner.close();
  });
  await test('prepared publication cannot resume or recreate after reset', async () => {
    const name = `lineage.epoch-g9f.qa.pending.${crypto.randomUUID()}`;
    const accountId = `account.local.${crypto.randomUUID()}`;
    const owner = await openCleanEpochAccountStore({ name });
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Pending QA' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = new CleanEpochFirstCampaignAdapter(owner);
    check((await first.prepare(accountId, form())).status === 'ready', 'creator was not prepared');
    await owner.transitionAccount('reset', { accountId, expectedRevision: 1,
      expectedGeneration: 1, currentPassword: 'synthetic-only-password' });
    const resumed = await first.resume(accountId, 'slot-1');
    check(resumed.status === 'blocked' && await owner.readAttempt(accountId, 'slot-1') === null &&
      (await owner.readSlot(accountId, 'slot-1')).status === 'empty',
      'old prepared publication resumed after reset');
    owner.close();
  });
  await test('reset erases all 12 account families, preserves credential and other account', async () => {
    const x = await setup('reset');
    await rejected(() => x.owner.transitionAccount('reset',
      { ...x.input, currentPassword: 'wrong-password' }), 'conflict');
    const legacyBefore = (await indexedDB.databases()).find(db => db.name === 'lineage.campaigns');
    const otherBefore = JSON.stringify(await rows(x.name, x.otherId));
    const credential = (await x.owner.read(x.accountId))!.credential;
    const result = await x.owner.transitionAccount('reset', x.input);
    check(result.status === 'committed' && result.account?.revision === x.input.expectedRevision + 1 &&
      accountLifecycleGeneration(result.account!) === 2 &&
      JSON.stringify(result.account?.credential) === JSON.stringify(credential) &&
      result.account?.profile.history.runRecords.length === 0,
      'reset account, generation, credential or profile mismatch');
    check(Object.values(await rows(x.name, x.accountId)).every(values => values.length === 0),
      'reset retained account data');
    check(JSON.stringify(await rows(x.name, x.otherId)) === otherBefore,
      'reset changed another account');
    check(JSON.stringify((await indexedDB.databases()).find(db => db.name === 'lineage.campaigns')) ===
      JSON.stringify(legacyBefore), 'reset changed legacy staging database');
    check((await x.owner.transitionAccount('reset', x.input)).status === 'same_source_retry',
      'exact reset retry did not reuse receipt');
    await rejected(() => x.owner.transitionAccount('delete', x.input), 'stale_head');
    x.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: x.name });
    check((await reopened.readLifecycleReceipt(x.accountId))?.kind === 'reset' &&
      (await reopened.readSlot(x.accountId, 'slot-1')).status === 'empty',
      'restart lost reset authority');
    reopened.close();
  });
  await test('delete tombstones identity and leaves another account intact', async () => {
    const x = await setup('delete');
    const otherBefore = JSON.stringify(await rows(x.name, x.otherId));
    const deleted = await x.owner.transitionAccount('delete', x.input);
    check(deleted.account === null && deleted.receipt.kind === 'delete' &&
      Object.values(await rows(x.name, x.accountId)).every(values => values.length === 0) &&
      JSON.stringify(await rows(x.name, x.otherId)) === otherBefore,
      'delete failed atomic account scope');
    check((await x.owner.transitionAccount('delete', x.input)).status === 'same_source_retry',
      'exact delete retry failed');
    const resurrectedCredential = await createCredentialRecord(x.accountId,
      'synthetic-only-password', new Date().toISOString());
    await rejected(() => x.owner.register(createDefaultAccountProfileState({ accountId: x.accountId,
      displayName: 'Resurrected' }), resurrectedCredential), 'conflict');
    x.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: x.name });
    check((await reopened.readLifecycleReceipt(x.accountId))?.kind === 'delete' &&
      await reopened.read(x.accountId) === null, 'restart lost deletion tombstone');
    reopened.close();
  });
  await test('old reset retry proves completion without selecting newer account data', async () => {
    const x = await setup('reset-newer-data');
    const reset = await x.owner.transitionAccount('reset', x.input);
    const current = reset.account!;
    await x.owner.updateProfile(x.accountId, current.revision,
      { ...current.profile, updatedAt: new Date().toISOString() });
    check((await new CleanEpochFirstCampaignAdapter(x.owner).start(x.accountId, form())).status === 'ready',
      'newer-generation campaign did not publish');
    const retry = await x.owner.transitionAccount('reset', x.input);
    check(retry.status === 'same_source_retry' && retry.account === null &&
      (await rows(x.name, x.accountId)).artifacts?.length === 1,
      'old reset retry exposed or erased newer-generation data');
    x.owner.close();
  });
  await test('two owners contend and stale requests lose', async () => {
    const x = await setup('contention');
    const second = await openCleanEpochAccountStore({ name: x.name });
    const outcomes = await Promise.allSettled([
      x.owner.transitionAccount('reset', x.input), second.transitionAccount('delete', x.input)
    ]);
    check(outcomes.filter(outcome => outcome.status === 'fulfilled').length === 1,
      'two owners both accepted one generation');
    try {
      await x.owner.updateProfile(x.accountId, x.input.expectedRevision,
        createDefaultAccountProfileState({ accountId: x.accountId, displayName: 'Stale' }));
      throw new Error('Stale account write unexpectedly succeeded');
    } catch (error) {
      check(error instanceof CampaignStoreError &&
        (error.code === 'stale_head' || error.code === 'invalid_record'),
        'stale owner did not block after contention');
    }
    x.owner.close(); second.close();
  });
  await test('stored hints and live sessions reject a reset generation', async () => {
    const x = await setup('sessions');
    const oldStorage = storage(); const newStorage = storage();
    const oldAdapter = new CleanEpochAccountAdapter(x.owner, oldStorage);
    const newAdapter = new CleanEpochAccountAdapter(x.owner, newStorage);
    const signed = await oldAdapter.signIn({ accountId: x.accountId,
      password: 'synthetic-only-password', stayLoggedIn: true });
    check(signed.status === 'ready', 'sign-in failed');
    const reset = await newAdapter.resetAccount({ ...x.input,
      password: 'synthetic-only-password', stayLoggedIn: true });
    check(reset.status === 'ready', 'password-confirmed reset failed');
    const oldSelection = await oldAdapter.selectSession();
    check(oldSelection.status === 'blocked' && oldSelection.code === 'stale_head',
      'old persisted hint selected reset generation');
    await rejected(() => oldAdapter.validateSession(signed.value.session), 'stale_head');
    check((await newAdapter.selectSession()).value.mode === 'signed_in',
      'new session failed exact generation readback');
    const staleRegistration = await oldAdapter.register({ accountId: x.accountId,
      displayName: x.accountId, password: 'synthetic-only-password',
      confirmPassword: 'synthetic-only-password', stayLoggedIn: true });
    check(staleRegistration.status === 'blocked' && staleRegistration.code === 'conflict',
      'old registration retry selected reset generation');
    x.owner.close();
  });
  await test('malformed source row and receipt fail closed without partial erasure', async () => {
    const x = await setup('malformed');
    await changeFirstRow(x.name, x.accountId, 'campaignAttemptsV6', (row, store) =>
      store.put({ ...row, version: 99 }));
    const prior = JSON.stringify(await rows(x.name, x.accountId));
    await rejected(() => x.owner.transitionAccount('reset', x.input), 'invalid_record');
    check(JSON.stringify(await rows(x.name, x.accountId)) === prior &&
      (await x.owner.read(x.accountId))?.revision === x.input.expectedRevision,
      'malformed row caused partial erasure');
    x.owner.close();
  });
  for (const kind of ['reset', 'delete'] as const) {
    const baseline = await setup(`${kind}-write-count`);
    let count = 0;
    baseline.owner.close();
    const counted = await openCleanEpochAccountStore({ name: baseline.name,
      beforeWrite: () => { count += 1; } });
    await counted.transitionAccount(kind, baseline.input);
    counted.close();
    for (const failure of ['aborted', 'quota'] as const)
      for (let at = 1; at <= count; at += 1) {
        const x = await setup(`${kind}-${failure}-${at}`);
        x.owner.close();
        let write = 0;
        const owner = await openCleanEpochAccountStore({ name: x.name,
          beforeWrite: tx => {
            if (++write !== at) return;
            if (failure === 'aborted') tx.abort();
            else throw new DOMException('Synthetic quota', 'QuotaExceededError');
          } });
        const before = JSON.stringify(await rows(x.name, x.accountId));
        await rejected(() => owner.transitionAccount(kind, x.input), failure);
        check(JSON.stringify(await rows(x.name, x.accountId)) === before &&
          (await owner.read(x.accountId))?.revision === x.input.expectedRevision &&
          await owner.readLifecycleReceipt(x.accountId) === null,
          `${kind} ${failure} at write ${at} changed prior authority`);
        owner.close();
      }
    cases.push(`${kind} abort/quota at all ${count} transactional writes`);
  }
  await test('lost post-commit readback resumes one exact reset and delete', async () => {
    for (const kind of ['reset', 'delete'] as const) {
      const x = await setup(`${kind}-lost-readback`);
      const original = x.owner.read.bind(x.owner);
      let reads = 0;
      x.owner.read = async accountId => {
        if (++reads === 2) throw new CampaignStoreError('readback_failed', 'Synthetic lost readback');
        return original(accountId);
      };
      await rejected(() => x.owner.transitionAccount(kind, x.input), 'readback_failed');
      x.owner.read = original;
      check((await x.owner.transitionAccount(kind, x.input)).status === 'same_source_retry',
        `${kind} lost readback did not resolve exact receipt`);
      x.owner.close();
    }
  });
  await test('corrupt retained receipt cannot masquerade as completed retry', async () => {
    const x = await setup('receipt-corrupt');
    await x.owner.transitionAccount('delete', x.input);
    const db = await raw(x.name);
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE, 'readwrite');
      tx.objectStore(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE).put({ version: 99,
        accountId: x.accountId, kind: 'delete' });
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
    });
    db.close();
    await rejected(() => x.owner.transitionAccount('delete', x.input), 'invalid_record');
    x.owner.close();
    const missing = await setup('receipt-missing');
    await missing.owner.transitionAccount('reset', missing.input);
    const damaged = await raw(missing.name);
    await new Promise<void>((resolve, reject) => {
      const tx = damaged.transaction(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE, 'readwrite');
      tx.objectStore(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE).delete(missing.accountId);
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
    });
    damaged.close();
    await rejected(() => missing.owner.readSelected(missing.accountId), 'invalid_record');
    missing.owner.close();
  });
}
suite().then(() => { output.textContent = `PASS ${cases.length}/${cases.length}\n${cases.join('\n')}`; })
  .catch(error => { output.textContent = `FAIL ${cases.length} cases\n${String(error)}\n${error?.stack ?? ''}`; });
