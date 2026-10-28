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
