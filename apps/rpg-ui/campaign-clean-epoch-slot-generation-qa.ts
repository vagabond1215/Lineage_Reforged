import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { admitCampaignMutation } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from '../../packages/engines/game-engine/src/player-quest-acceptance.ts';
import { createPlayerTravelCommand, executePlayerTravelCommand } from '../../packages/engines/game-engine/src/player-travel.ts';
import { advanceAshenReefSurveyCaller } from './src/runtime/ashenReefSurveyCaller.ts';
import { submitSoundingsTurnInCaller } from './src/runtime/soundingsTurnInCaller.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { ensureCampaignPublicationStores } from './src/game-shell/campaignIndexedDbStore.ts';
import { openCleanEpochAccountStore, type CleanEpochAccountStore,
  CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_DATABASE_VERSION,
  CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ATTEMPT_STORE, CLEAN_EPOCH_RECOVERY_STORE,
  CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
  CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE, CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE,
  type CleanEpochAddressDeletionRequest } from './src/game-shell/cleanEpochAccountStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const cases: string[] = [];
const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
async function test(name: string, run: () => Promise<void>) { await run(); cases.push(name); }
function form(playerName: string) {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName,
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
}
async function setup(label: string, options?: { afterWrite?: (tx: IDBTransaction) => void;
  beforeWrite?: (tx: IDBTransaction) => void }) {
  const databaseName = `lineage.epoch-g9e.qa.${label}.${crypto.randomUUID()}`;
  const accountId = `account.local.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name: databaseName, ...options });
  await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'G9E QA' }),
    await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
  return { databaseName, accountId, owner };
}
async function start(owner: CleanEpochAccountStore, accountId: string, playerName: string) {
  const result = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form(playerName));
  if (result.status !== 'ready') throw new Error(`First campaign failed: ${JSON.stringify(result)}`);
  return result.value;
}
async function deletionRequest(owner: CleanEpochAccountStore, accountId: string,
  slotId: 'slot-1' | 'quick-save'): Promise<CleanEpochAddressDeletionRequest> {
  const [account, pointer, slot] = await Promise.all([
    owner.readSelected(accountId), owner.readSlotGeneration(accountId, slotId), owner.readSlot(accountId, slotId)
  ]);
  if (!account || !pointer || slot.status !== 'ready') throw new Error('Ready deletion source missing');
  return { accountId, slotId, expectedAccountRevision: account.revision,
    expectedSlotGenerationId: pointer.slotGenerationId,
    expectedAddress: { artifactId: slot.loaded.sessionControl.loadedArtifactId,
      publicationId: slot.loaded.sessionControl.loadedPublicationId },
    deletedAt: new Date().toISOString() };
}
async function rawDatabase(name: string): Promise<IDBDatabase> {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(name, CLEAN_EPOCH_DATABASE_VERSION);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function removeRawReceipt(database: IDBDatabase, key: IDBValidKey): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const tx = database.transaction(CLEAN_EPOCH_ADDRESS_DELETION_STORE, 'readwrite');
    tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE).delete(key);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
  });
}
async function suite() {
  await test('three campaigns reuse one slot without losing historical first recoveries', async () => {
    const context = await setup('three-generations');
    const first = await start(context.owner, context.accountId, 'Mara A');
    const firstPointer = await context.owner.readSlotGeneration(context.accountId, 'slot-1');
    const firstDelete = await deletionRequest(context.owner, context.accountId, 'slot-1');
    const deletedA = await context.owner.deleteSlotAddress(firstDelete);
    check(deletedA.status === 'committed' &&
      (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'empty' &&
      deletedA.account.profile.history.runRecords.find(run =>
        run.characterId === first.loaded.snapshot.playerState.playerId)?.outcome === 'deleted',
      'first deletion did not empty slot and mark active run deleted');
    const second = await start(context.owner, context.accountId, 'Mara B');
    const secondPointer = await context.owner.readSlotGeneration(context.accountId, 'slot-1');
    check(firstPointer?.slotGenerationId !== secondPointer?.slotGenerationId &&
      firstPointer?.slotGenerationId !== first.loaded.sessionControl.loadedArtifactId,
      'slot occupancy aliased publication/artifact identity');
    const secondDelete = await deletionRequest(context.owner, context.accountId, 'slot-1');
    const deletedB = await context.owner.deleteSlotAddress(secondDelete);
    check(deletedB.status === 'committed', 'second deletion failed');
    const third = await start(context.owner, context.accountId, 'Mara C');
    const thirdPointer = await context.owner.readSlotGeneration(context.accountId, 'slot-1');
    check(thirdPointer?.campaignId === third.loaded.sessionControl.campaignId &&
      new Set([firstPointer?.slotGenerationId, secondPointer?.slotGenerationId,
        thirdPointer?.slotGenerationId]).size === 3,
      'third campaign did not own a distinct current slot generation');
    check((await context.owner.readHistoricalFirstRecovery(context.accountId,
      first.loaded.sessionControl.campaignId)).status === 'consumers_completed' &&
      (await context.owner.readHistoricalFirstRecovery(context.accountId,
        second.loaded.sessionControl.campaignId)).status === 'consumers_completed' &&
      (await context.owner.readAddressDeletionReceipt(context.accountId, 'slot-1',
        firstPointer!.slotGenerationId))?.campaignId === first.loaded.sessionControl.campaignId &&
      (await context.owner.readAddressDeletionReceipt(context.accountId, 'slot-1',
        secondPointer!.slotGenerationId))?.campaignId === second.loaded.sessionControl.campaignId,
      'A or B historical recovery/deletion receipt was lost');
    const stale = await context.owner.deleteSlotAddress(firstDelete);
    check(stale.status === 'same_source_retry' &&
      (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'ready',
      'stale A deletion mutated C');
    context.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    check((await reopened.readSlot(context.accountId, 'slot-1')).status === 'ready' &&
      (await reopened.readHistoricalFirstRecovery(context.accountId,
        first.loaded.sessionControl.campaignId)).status === 'consumers_completed',
      'three-generation authority failed restart');
    reopened.close();
  });
  await test('one-address delete preserves the other address and singular head', async () => {
    const context = await setup('two-addresses');
    const first = await start(context.owner, context.accountId, 'Mara Two');
    const saved = await new CleanEpochDescendantAdapter(context.owner).save({
      accountId: context.accountId, sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
      expectedAccountRevision: (await context.owner.readSelected(context.accountId))!.revision,
      snapshot: first.loaded.snapshot, control: first.loaded.sessionControl,
      expectedDestinationAddress: null });
    check(saved.status === 'ready', `Cross-slot save failed: ${JSON.stringify(saved)}`);
    const source = await deletionRequest(context.owner, context.accountId, 'slot-1');
    await context.owner.deleteSlotAddress(source);
    const account = await context.owner.readSelected(context.accountId);
    const quick = await context.owner.readSlot(context.accountId, 'quick-save');
    check((await context.owner.readSlot(context.accountId, 'slot-1')).status === 'empty' &&
      quick.status === 'ready' && account?.profile.history.runRecords[0]?.outcome === 'active' &&
      account.profile.history.runRecords[0]?.saveSlotIds.length === 1 &&
      account.profile.history.runRecords[0]?.saveSlotIds[0] === 'quick-save',
      'one-address deletion changed other address or campaign history');
    context.owner.close();
  });
  await test('accepted save and recovery generation IDs cannot authorize slot deletion', async () => {
    const context = await setup('distinct-generations');
    const first = await start(context.owner, context.accountId, 'Mara Generations');
    const request = await deletionRequest(context.owner, context.accountId, 'slot-1');
    const recovery = await context.owner.readHistoricalFirstRecovery(context.accountId,
      first.loaded.sessionControl.campaignId);
    const db = await rawDatabase(context.databaseName);
    const envelope = await new Promise<{ generationId: string }>((resolve, reject) => {
      const tx = db.transaction('slots');
      const read = tx.objectStore('slots').get([context.accountId, 'slot-1']);
      read.onsuccess = () => {
        try { resolve(JSON.parse(read.result.raw) as { generationId: string }); }
        catch (error) { reject(error); }
      };
      read.onerror = () => reject(read.error);
    });
    check(typeof envelope.generationId === 'string' && envelope.generationId.length > 0 &&
      recovery?.status === 'consumers_completed' &&
      recovery.generationId === envelope.generationId &&
      envelope.generationId !== request.expectedSlotGenerationId,
      'accepted envelope/recovery generation aliased physical slot occupancy');
    let refused = false;
    try { await context.owner.deleteSlotAddress({ ...request,
      expectedSlotGenerationId: envelope.generationId }); } catch { refused = true; }
    check(refused && (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'ready' &&
      (await context.owner.readSelected(context.accountId))?.revision === request.expectedAccountRevision,
      'save/publication generation satisfied slot-generation CAS');
    db.close(); context.owner.close();
  });
  await test('terminal cleanup removes every address after settlement and keeps archived history', async () => {
    const context = await setup('terminal-cleanup');
    const first = await start(context.owner, context.accountId, 'Mara Terminal');
    const retired = await new CleanEpochTerminalAdapter(context.owner).retire({
      accountId: context.accountId, sourceSlotId: 'slot-1',
      expectedAccountRevision: (await context.owner.readSelected(context.accountId))!.revision,
      snapshot: first.loaded.snapshot, control: first.loaded.sessionControl,
      expectedSourceAddress: { artifactId: first.loaded.sessionControl.loadedArtifactId,
        publicationId: first.loaded.sessionControl.loadedPublicationId } });
    check(retired.status === 'completed', `Retirement failed: ${JSON.stringify(retired)}`);
    const revision = retired.account.revision;
    const closedAt = new Date().toISOString();
    const closed = await context.owner.closeTerminalAddresses(context.accountId,
      retired.recovery.campaignId, retired.recovery.publicationId, revision, closedAt);
    check(closed.status === 'committed' &&
      (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'empty' &&
      closed.account.profile.history.runRecords[0]?.outcome === 'archived' &&
      closed.account.profile.history.runRecords[0]?.saveSlotIds.length === 0,
      'terminal closure lost archived history or kept address');
    const retry = await context.owner.closeTerminalAddresses(context.accountId,
      retired.recovery.campaignId, retired.recovery.publicationId, revision, closedAt);
    check(retry.status === 'same_source_retry' && retry.account.revision === revision + 1,
      'terminal cleanup retry changed account');
    context.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    check((await reopened.readTerminalRecovery(context.accountId,
      retired.recovery.campaignId, retired.recovery.publicationId))?.addressClosure !== undefined &&
      (await reopened.readSlot(context.accountId, 'slot-1')).status === 'empty',
      'terminal cleanup failed restart readback');
    const archived = closed.account.profile.history.runRecords[0]!;
    const heir = await new CleanEpochFirstCampaignAdapter(reopened).prepare(context.accountId,
      { ...form('Mara Heir'), saveSlotId: 'slot-2',
        sourceRunId: `${archived.characterId}::${archived.startedAt}` });
    check(heir.status === 'blocked' &&
      (await reopened.readSelected(context.accountId))?.revision === closed.account.revision,
      'G9D archival retirement became an inheritance source');
    reopened.close();
  });
  await test('stale account, slot generation and changed retry cannot delete a newer campaign', async () => {
    const context = await setup('stale');
    await start(context.owner, context.accountId, 'Mara Stale A');
    const request = await deletionRequest(context.owner, context.accountId, 'slot-1');
    const staleRevision = { ...request, expectedAccountRevision: request.expectedAccountRevision - 1 };
    const staleGeneration = { ...request, expectedSlotGenerationId: `slot.stale.${crypto.randomUUID()}` };
    for (const candidate of [staleRevision, staleGeneration]) {
      let refused = false;
      try { await context.owner.deleteSlotAddress(candidate); } catch { refused = true; }
      check(refused && (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'ready',
        'stale deletion mutated first campaign');
    }
    await context.owner.deleteSlotAddress(request);
    await start(context.owner, context.accountId, 'Mara Stale B');
    let changed = false;
    try { await context.owner.deleteSlotAddress({ ...request, deletedAt: new Date(Date.now() + 1000).toISOString() }); }
    catch { changed = true; }
    check(changed && (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'ready',
      'changed old deletion retry mutated replacement');
    context.owner.close();
  });
  await test('player deletion abort and quota at every write retain the addressed campaign', async () => {
    for (const fault of ['abort', 'quota'] as const) for (let target = 1; target <= 4; target++) {
      let armed = false; let writes = 0;
      const context = await setup(`${fault}-${target}`, {
        afterWrite: tx => { if (armed && fault === 'abort' && ++writes === target) tx.abort(); },
        beforeWrite: () => { if (armed && fault === 'quota' && ++writes === target)
          throw new DOMException('synthetic quota', 'QuotaExceededError'); }
      });
      await start(context.owner, context.accountId, 'Mara Fault');
      const request = await deletionRequest(context.owner, context.accountId, 'slot-1');
      armed = true;
      let failed = false;
      try { await context.owner.deleteSlotAddress(request); } catch { failed = true; }
      armed = false;
      check(failed && (await context.owner.readSelected(context.accountId))?.revision === request.expectedAccountRevision &&
        (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'ready' &&
        (await context.owner.readAddressDeletionReceipt(context.accountId, 'slot-1',
          request.expectedSlotGenerationId)) === null,
        `${fault} at write ${target} partially deleted address`);
      context.owner.close();
    }
  });
  await test('missing deletion receipt cannot masquerade as an empty reusable slot', async () => {
    const context = await setup('missing-receipt');
    await start(context.owner, context.accountId, 'Mara Receipt');
    const request = await deletionRequest(context.owner, context.accountId, 'slot-1');
    await context.owner.deleteSlotAddress(request);
    const db = await rawDatabase(context.databaseName);
    await removeRawReceipt(db, [context.accountId, 'slot-1', request.expectedSlotGenerationId]);
    let refused = false;
    try { await context.owner.readSlot(context.accountId, 'slot-1'); } catch { refused = true; }
    check(refused, 'missing receipt became an empty slot');
    const attempted = await new CleanEpochFirstCampaignAdapter(context.owner)
      .prepare(context.accountId, form('Mara Replacement'));
    check(attempted.status === 'blocked', 'missing receipt permitted a replacement attempt');
    db.close(); context.owner.close();
  });
  await test('two-address terminal cleanup is atomic and restartable', async () => {
    const context = await setup('terminal-two-addresses');
    const first = await start(context.owner, context.accountId, 'Mara Two Terminal');
    const saved = await new CleanEpochDescendantAdapter(context.owner).save({
      accountId: context.accountId, sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
      expectedAccountRevision: (await context.owner.readSelected(context.accountId))!.revision,
      snapshot: first.loaded.snapshot, control: first.loaded.sessionControl,
      expectedDestinationAddress: null });
    if (saved.status !== 'ready') throw new Error(`Cross-slot save failed: ${JSON.stringify(saved)}`);
    const retired = await new CleanEpochTerminalAdapter(context.owner).retire({
      accountId: context.accountId, sourceSlotId: 'quick-save',
      expectedAccountRevision: (await context.owner.readSelected(context.accountId))!.revision,
      snapshot: saved.value.loaded.snapshot, control: saved.value.loaded.sessionControl,
      expectedSourceAddress: { artifactId: saved.value.loaded.sessionControl.loadedArtifactId,
        publicationId: saved.value.loaded.sessionControl.loadedPublicationId } });
    if (retired.status !== 'completed') throw new Error(`Retirement failed: ${JSON.stringify(retired)}`);
    check(retired.recovery.addressSlotIds.length === 2, 'terminal did not retain both address identities');
    const closed = await context.owner.closeTerminalAddresses(context.accountId,
      retired.recovery.campaignId, retired.recovery.publicationId,
      retired.account.revision, new Date().toISOString());
    check(closed.status === 'committed' &&
      (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'empty' &&
      (await context.owner.readSlot(context.accountId, 'quick-save')).status === 'empty' &&
      closed.recovery.addressClosure?.receipts.length === 2 &&
      (await context.owner.readHistoricalFirstRecovery(context.accountId,
        first.loaded.sessionControl.campaignId)).status === 'consumers_completed',
      'multi-address terminal cleanup lost history or kept a slot');
    context.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    check((await reopened.readTerminalRecovery(context.accountId,
      retired.recovery.campaignId, retired.recovery.publicationId))?.addressClosure?.receipts.length === 2,
      'multi-address terminal cleanup lost restart marker');
    reopened.close();
  });
  await test('two-address terminal cleanup abort and quota at all eight writes permit exact retry', async () => {
    for (const fault of ['abort', 'quota'] as const) for (let target = 1; target <= 8; target++) {
      let armed = false; let writes = 0;
      const context = await setup(`terminal-${fault}-${target}`, {
        afterWrite: tx => { if (armed && fault === 'abort' && ++writes === target) tx.abort(); },
        beforeWrite: () => { if (armed && fault === 'quota' && ++writes === target)
          throw new DOMException('synthetic quota', 'QuotaExceededError'); }
      });
      const first = await start(context.owner, context.accountId, 'Mara Terminal Fault');
      const saved = await new CleanEpochDescendantAdapter(context.owner).save({
        accountId: context.accountId, sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
        expectedAccountRevision: (await context.owner.readSelected(context.accountId))!.revision,
        snapshot: first.loaded.snapshot, control: first.loaded.sessionControl,
        expectedDestinationAddress: null });
      if (saved.status !== 'ready') throw new Error(`Cross-slot fault setup failed: ${JSON.stringify(saved)}`);
      const retired = await new CleanEpochTerminalAdapter(context.owner).retire({
        accountId: context.accountId, sourceSlotId: 'quick-save',
        expectedAccountRevision: (await context.owner.readSelected(context.accountId))!.revision,
        snapshot: saved.value.loaded.snapshot, control: saved.value.loaded.sessionControl,
        expectedSourceAddress: { artifactId: saved.value.loaded.sessionControl.loadedArtifactId,
          publicationId: saved.value.loaded.sessionControl.loadedPublicationId } });
      if (retired.status !== 'completed') throw new Error(`Retirement failed: ${JSON.stringify(retired)}`);
      check(retired.recovery.addressSlotIds.length === 2,
        'fault setup lost one terminal address');
      const pointers = await Promise.all(['slot-1', 'quick-save'].map(slotId =>
        context.owner.readSlotGeneration(context.accountId, slotId as 'slot-1' | 'quick-save')));
      const closedAt = new Date().toISOString();
      armed = true;
      let failed = false;
      try { await context.owner.closeTerminalAddresses(context.accountId,
        retired.recovery.campaignId, retired.recovery.publicationId,
        retired.account.revision, closedAt); } catch { failed = true; }
      armed = false;
      check(failed && (await context.owner.readSelected(context.accountId))?.revision === retired.account.revision &&
        (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'closed' &&
        (await context.owner.readSlot(context.accountId, 'quick-save')).status === 'closed' &&
        (await context.owner.readTerminalRecovery(context.accountId,
          retired.recovery.campaignId, retired.recovery.publicationId))?.addressClosure === undefined &&
        (await context.owner.readAddressDeletionReceipt(context.accountId, 'slot-1',
          pointers[0]!.slotGenerationId)) === null &&
        (await context.owner.readAddressDeletionReceipt(context.accountId, 'quick-save',
          pointers[1]!.slotGenerationId)) === null,
        `${fault} at terminal write ${target} partially removed one of two closed addresses`);
      context.owner.close();
      const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
      const retry = await reopened.closeTerminalAddresses(context.accountId,
        retired.recovery.campaignId, retired.recovery.publicationId,
        retired.account.revision, closedAt);
      check(retry.status === 'committed' &&
        retry.account.revision === retired.account.revision + 1 &&
        retry.recovery.addressClosure?.receipts.length === 2 &&
        (await reopened.readSlot(context.accountId, 'slot-1')).status === 'empty' &&
        (await reopened.readSlot(context.accountId, 'quick-save')).status === 'empty',
        `${fault} at terminal write ${target} did not recover`);
      reopened.close();
    }
  });
  await test('lost post-commit terminal closure readback retains exact two-address completion', async () => {
    const context = await setup('terminal-lost-closure-readback');
    const first = await start(context.owner, context.accountId, 'Mara Lost Closure');
    const saved = await new CleanEpochDescendantAdapter(context.owner).save({
      accountId: context.accountId, sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
      expectedAccountRevision: (await context.owner.readSelected(context.accountId))!.revision,
      snapshot: first.loaded.snapshot, control: first.loaded.sessionControl,
      expectedDestinationAddress: null });
    if (saved.status !== 'ready') throw new Error(`Cross-slot setup failed: ${JSON.stringify(saved)}`);
    const retired = await new CleanEpochTerminalAdapter(context.owner).retire({
      accountId: context.accountId, sourceSlotId: 'quick-save',
      expectedAccountRevision: (await context.owner.readSelected(context.accountId))!.revision,
      snapshot: saved.value.loaded.snapshot, control: saved.value.loaded.sessionControl,
      expectedSourceAddress: { artifactId: saved.value.loaded.sessionControl.loadedArtifactId,
        publicationId: saved.value.loaded.sessionControl.loadedPublicationId } });
    if (retired.status !== 'completed') throw new Error(`Retirement failed: ${JSON.stringify(retired)}`);
    const closedAt = new Date().toISOString();
    const originalRead = context.owner.read.bind(context.owner);
    let loseReadback = true;
    context.owner.read = async (...args) => {
      if (loseReadback) { loseReadback = false; throw new Error('synthetic lost closure readback'); }
      return originalRead(...args);
    };
    let lost = false;
    try { await context.owner.closeTerminalAddresses(context.accountId,
      retired.recovery.campaignId, retired.recovery.publicationId,
      retired.account.revision, closedAt); } catch { lost = true; }
    check(lost && !loseReadback, 'closure readback failure did not occur after commit');
    context.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    const completed = await reopened.readTerminalRecovery(context.accountId,
      retired.recovery.campaignId, retired.recovery.publicationId);
    const receipts = completed?.addressClosure?.receipts;
    check(receipts?.length === 2 &&
      (await reopened.readSelected(context.accountId))?.revision === retired.account.revision + 1,
      'closure commit did not survive lost readback');
    const retry = await reopened.closeTerminalAddresses(context.accountId,
      retired.recovery.campaignId, retired.recovery.publicationId,
      retired.account.revision, closedAt);
    check(retry.status === 'same_source_retry' &&
      retry.account.revision === retired.account.revision + 1 &&
      JSON.stringify(retry.recovery.addressClosure) === JSON.stringify(completed?.addressClosure) &&
      (await reopened.readSlot(context.accountId, 'slot-1')).status === 'empty' &&
      (await reopened.readSlot(context.accountId, 'quick-save')).status === 'empty',
      'lost closure readback retry duplicated mutation or changed receipts');
    for (const receipt of receipts!) check(
      (await reopened.readAddressDeletionReceipt(context.accountId, receipt.slotId,
        receipt.slotGenerationId))?.completedAccountRevision === retry.account.revision,
      'closure retry lost durable receipt');
    reopened.close();
  });
  await test('competing owners and lost readback retain an exact deletion retry', async () => {
    const context = await setup('competing-readback');
    await start(context.owner, context.accountId, 'Mara Competing');
    const other = await openCleanEpochAccountStore({ name: context.databaseName });
    const request = await deletionRequest(other, context.accountId, 'slot-1');
    const originalReadSlot = context.owner.readSlot.bind(context.owner);
    let loseReadback = true;
    context.owner.readSlot = async (...args) => {
      if (loseReadback) { loseReadback = false; throw new Error('synthetic lost readback'); }
      return originalReadSlot(...args);
    };
    let lost = false;
    try { await context.owner.deleteSlotAddress(request); } catch { lost = true; }
    context.owner.readSlot = originalReadSlot;
    check(lost && (await other.readSlot(context.accountId, 'slot-1')).status === 'empty' &&
      (await other.readAddressDeletionReceipt(context.accountId, 'slot-1',
        request.expectedSlotGenerationId)) !== null,
      'lost readback erased durable deletion or receipt');
    const retry = await other.deleteSlotAddress(request);
    check(retry.status === 'same_source_retry', 'second owner duplicated deletion after lost readback');
    let stale = false;
    try { await other.deleteSlotAddress({ ...request,
      expectedSlotGenerationId: `slot.other.${crypto.randomUUID()}` }); } catch { stale = true; }
    check(stale, 'second owner accepted a competing generation');
    other.close(); context.owner.close();
  });
  await test('v5 prepared attempt upgrades to v6 identity and malformed duplicate aborts', async () => {
    const source = await setup('v5-source');
    const prepared = await new CleanEpochFirstCampaignAdapter(source.owner)
      .prepare(source.accountId, form('Mara Upgrade'));
    if (prepared.status !== 'ready') throw new Error(`Prepared source failed: ${JSON.stringify(prepared)}`);
    const account = await source.owner.readSelected(source.accountId);
    if (!account) throw new Error('Prepared source account missing');
    async function seedV5(duplicate: boolean): Promise<string> {
      const name = `lineage.epoch-g9e.v5.${crypto.randomUUID()}`;
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(name, 5);
        request.onupgradeneeded = () => {
          const db = request.result;
          ensureCampaignPublicationStores(db);
          db.createObjectStore(CLEAN_EPOCH_ACCOUNT_STORE, { keyPath: 'accountId' });
          db.createObjectStore(CLEAN_EPOCH_ATTEMPT_STORE, { keyPath: ['accountId', 'slotId'] });
          db.createObjectStore(CLEAN_EPOCH_RECOVERY_STORE, { keyPath: ['accountId', 'slotId'] });
          const descendants = db.createObjectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
            { keyPath: ['accountId', 'campaignId', 'publicationId'] });
          descendants.createIndex('byAccountCampaign', ['accountId', 'campaignId']);
          const terminal = db.createObjectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
            { keyPath: ['accountId', 'campaignId', 'publicationId'] });
          terminal.createIndex('bySourcePublication',
            ['accountId', 'campaignId', 'sourcePublicationId'], { unique: true });
          terminal.createIndex('byAccount', 'accountId');
          const tx = request.transaction!;
          tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).put(account);
          tx.objectStore(CLEAN_EPOCH_ATTEMPT_STORE).put(prepared.value);
          if (duplicate) tx.objectStore(CLEAN_EPOCH_ATTEMPT_STORE)
            .put({ ...prepared.value, slotId: 'slot-2' });
        };
        request.onsuccess = () => { request.result.close(); resolve(); };
        request.onerror = () => reject(request.error);
      });
      return name;
    }
    const validName = await seedV5(false);
    const migrated = await openCleanEpochAccountStore({ name: validName });
    const pointer = await migrated.readSlotGeneration(source.accountId, 'slot-1');
    check((await migrated.readAttempt(source.accountId, 'slot-1'))?.attemptId ===
      prepared.value.attemptId && pointer?.status === 'prepared' &&
      pointer.slotGenerationId !== prepared.value.campaignId,
      'v5 prepared attempt lost independent v6 slot generation');
    migrated.close();
    const badName = await seedV5(true);
    let refused = false;
    try { const bad = await openCleanEpochAccountStore({ name: badName }); bad.close(); }
    catch { refused = true; }
    check(refused, 'duplicate v5 campaign migrated into ambiguous v6 authority');
    source.owner.close();
  });
  await test('published two-address v5 authority migrates to ready v6 and rejects disagreement', async () => {
    const source = await setup('v5-published-source');
    const first = await start(source.owner, source.accountId, 'Mara Published Upgrade');
    let state = { snapshot: first.loaded.snapshot, control: first.loaded.sessionControl };
    const accept = (result: { accepted: boolean; snapshot: typeof state.snapshot }, mutationId: string) => {
      check(result.accepted, `migration witness ${mutationId} was rejected`);
      const admitted = admitCampaignMutation(state.control, { mutationId,
        sourceArtifactId: state.control.loadedArtifactId, sourceRevision: state.control.sessionRevision,
        ownerKind: 'engine_result', accepted: true, sourceSnapshot: state.snapshot,
        proposedSnapshot: result.snapshot });
      check(admitted.accepted, `migration session ${mutationId} was rejected`);
      state = { snapshot: admitted.snapshot, control: admitted.control };
    };
    const travel = (destination: string) => {
      const command = createPlayerTravelCommand(state.snapshot, destination);
      accept(executePlayerTravelCommand(state.snapshot, command), `mutation.${command.commandId}`);
    };
    const quest = createPlayerQuestAcceptanceCommand(state.snapshot, 'quest.ashen_reef_survey');
    accept(executePlayerQuestAcceptanceCommand(state.snapshot, quest), `mutation.${quest.commandId}`);
    travel('location.ashen_reef');
    const surveyCache = new Map();
    for (let index = 1; index <= 4; index++) {
      const requestId = `survey_request.00000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
      const result = advanceAshenReefSurveyCaller(state.snapshot, state.control, requestId, surveyCache);
      check(result.outcome.kind === 'accepted' && result.acceptedState,
        `migration survey stage ${index} was rejected`);
      state = result.acceptedState!;
    }
    travel('settlement.starfall_port');
    const turnIn = submitSoundingsTurnInCaller(state.snapshot, state.control,
      `soundings_turn_in_request.${crypto.randomUUID()}`, new Map());
    check(turnIn.outcome.kind === 'accepted' && turnIn.acceptedState,
      'migration Soundings turn-in was rejected');
    state = turnIn.acceptedState!;
    check(state.control.soundingsAdmissionWitness?.posture === 'session',
      'migration source lacks a real accepted session witness');
    const saved = await new CleanEpochDescendantAdapter(source.owner).save({
      accountId: source.accountId, sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
      expectedAccountRevision: (await source.owner.readSelected(source.accountId))!.revision,
      snapshot: state.snapshot, control: state.control,
      expectedDestinationAddress: null });
    if (saved.status !== 'ready') throw new Error(`Published v5 setup failed: ${JSON.stringify(saved)}`);
    const families = [CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ATTEMPT_STORE,
      CLEAN_EPOCH_RECOVERY_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
      CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, 'artifacts', 'controls', 'slots', 'witnesses'];
    const sourceDb = await rawDatabase(source.databaseName);
    const rows = new Map<string, unknown[]>();
    for (const family of families) rows.set(family, await new Promise<unknown[]>((resolve, reject) => {
      const sourceFamily = family === CLEAN_EPOCH_ATTEMPT_STORE ? CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE :
        family === CLEAN_EPOCH_RECOVERY_STORE ? CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE : family;
      const read = sourceDb.transaction(sourceFamily).objectStore(sourceFamily).getAll();
      read.onsuccess = () => resolve(read.result);
      read.onerror = () => reject(read.error);
    }));
    sourceDb.close();
    check(rows.get(CLEAN_EPOCH_RECOVERY_STORE)?.length === 1 &&
      rows.get('slots')?.length === 2 && rows.get('controls')?.length === 1 &&
      (rows.get('artifacts')?.length ?? 0) >= 2 && rows.get('witnesses')?.length === 1,
      `published v5 seed lacks completed first authority or two addresses: ${JSON.stringify(
        Object.fromEntries(families.map(family => [family, rows.get(family)?.length])) )}`);
    async function seedPublishedV5(disagreeing: boolean): Promise<string> {
      const name = `lineage.epoch-g9e.v5-published.${crypto.randomUUID()}`;
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(name, 5);
        request.onupgradeneeded = () => {
          const db = request.result;
          ensureCampaignPublicationStores(db);
          db.createObjectStore(CLEAN_EPOCH_ACCOUNT_STORE, { keyPath: 'accountId' });
          db.createObjectStore(CLEAN_EPOCH_ATTEMPT_STORE, { keyPath: ['accountId', 'slotId'] });
          db.createObjectStore(CLEAN_EPOCH_RECOVERY_STORE, { keyPath: ['accountId', 'slotId'] });
          const descendants = db.createObjectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
            { keyPath: ['accountId', 'campaignId', 'publicationId'] });
          descendants.createIndex('byAccountCampaign', ['accountId', 'campaignId']);
          const terminal = db.createObjectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
            { keyPath: ['accountId', 'campaignId', 'publicationId'] });
          terminal.createIndex('bySourcePublication',
            ['accountId', 'campaignId', 'sourcePublicationId'], { unique: true });
          terminal.createIndex('byAccount', 'accountId');
          const tx = request.transaction!;
          for (const family of families) for (const raw of rows.get(family) ?? []) {
            const row = disagreeing && family === 'slots' &&
              (raw as { slotId?: string }).slotId === 'quick-save'
              ? { ...(raw as object), campaignId: `campaign.disagreeing.${crypto.randomUUID()}` }
              : raw;
            tx.objectStore(family).put(row);
          }
        };
        request.onsuccess = () => { request.result.close(); resolve(); };
        request.onerror = () => reject(request.error);
      });
      return name;
    }
    const validName = await seedPublishedV5(false);
    const migrated = await openCleanEpochAccountStore({ name: validName });
    const [account, firstSlot, quickSlot, firstRecovery, firstPointer, quickPointer] = await Promise.all([
      migrated.readSelected(source.accountId),
      migrated.readSlot(source.accountId, 'slot-1'),
      migrated.readSlot(source.accountId, 'quick-save'),
      migrated.readHistoricalFirstRecovery(source.accountId, first.loaded.sessionControl.campaignId),
      migrated.readSlotGeneration(source.accountId, 'slot-1'),
      migrated.readSlotGeneration(source.accountId, 'quick-save')
    ]);
    check(account?.revision === (await source.owner.readSelected(source.accountId))?.revision &&
      firstSlot.status === 'ready' && quickSlot.status === 'ready' &&
      firstRecovery?.status === 'consumers_completed' &&
      quickSlot.loaded.sessionControl.soundingsAdmissionWitness?.requestId ===
        (rows.get('witnesses')![0] as { requestId: string }).requestId &&
      firstRecovery.generationId === (rows.get(CLEAN_EPOCH_RECOVERY_STORE)![0] as { generationId: string }).generationId &&
      firstPointer?.campaignId === first.loaded.sessionControl.campaignId &&
      quickPointer?.campaignId === firstPointer.campaignId &&
      firstPointer.slotGenerationId !== quickPointer.slotGenerationId &&
      firstPointer.slotGenerationId !== firstRecovery.generationId &&
      (await migrated.readAttempt(source.accountId, 'slot-1'))?.attemptId === firstRecovery.attemptId &&
      (await migrated.readCampaignHead(source.accountId, firstPointer.campaignId, 'quick-save')).publicationId ===
        saved.value.loaded.sessionControl.loadedPublicationId,
      'published v5 migration lost account, first recovery, control or address authority');
    const migratedDb = await rawDatabase(validName);
    for (const family of [CLEAN_EPOCH_ATTEMPT_STORE, CLEAN_EPOCH_RECOVERY_STORE,
      'artifacts', 'controls', 'witnesses']) {
      const retained = await new Promise<unknown[]>((resolve, reject) => {
        const read = migratedDb.transaction(family).objectStore(family).getAll();
        read.onsuccess = () => resolve(read.result);
        read.onerror = () => reject(read.error);
      });
      check(JSON.stringify(retained) === JSON.stringify(rows.get(family)),
        `v5 ${family} evidence changed during v6 upgrade`);
    }
    migratedDb.close();
    migrated.close();
    const restarted = await openCleanEpochAccountStore({ name: validName });
    check((await restarted.readSlot(source.accountId, 'slot-1')).status === 'ready' &&
      (await restarted.readSlot(source.accountId, 'quick-save')).status === 'ready' &&
      (await restarted.readHistoricalFirstRecovery(source.accountId,
        first.loaded.sessionControl.campaignId)).status === 'consumers_completed',
      'published v5 migrated authority did not survive restart');
    restarted.close();
    const badName = await seedPublishedV5(true);
    let refused = false;
    try { const bad = await openCleanEpochAccountStore({ name: badName }); bad.close(); }
    catch { refused = true; }
    check(refused, 'disagreeing published v5 address upgraded into v6');
    source.owner.close();
  });
  output.textContent = `PASS ${cases.length}/${cases.length}\n${cases.join('\n')}`;
}
suite().catch(error => { output.textContent = `FAIL after ${cases.length}\n${String(error)}\n${error?.stack ?? ''}`; });
