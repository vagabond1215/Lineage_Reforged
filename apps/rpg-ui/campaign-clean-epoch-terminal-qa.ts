import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { CLEAN_EPOCH_DATABASE_VERSION, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
  openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { ensureCampaignPublicationStores } from './src/game-shell/campaignIndexedDbStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const cases: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
const name = (label: string) => `lineage.epoch-terminal.qa.${label}.${crypto.randomUUID()}`;
async function test(label: string, run: () => Promise<void>) { await run(); cases.push(label); }
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Mara Terminal',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
}
async function setup(label: string, options?: { beforeWrite?: (tx: IDBTransaction) => void;
  afterWrite?: (tx: IDBTransaction) => void }) {
  const databaseName = name(label);
  const accountId = `account.local.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name: databaseName, ...options });
  await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'Terminal QA' }),
    await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
  const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
  if (first.status !== 'ready') throw new Error(`First campaign failed: ${JSON.stringify(first)}`);
  const account = await owner.readSelected(accountId);
  check(account?.revision === 2, 'first campaign account revision is wrong');
  return { databaseName, accountId, owner, first: first.value, account: account! };
}
function request(context: Awaited<ReturnType<typeof setup>>) {
  const loaded = context.first.loaded;
  return { accountId: context.accountId, sourceSlotId: 'slot-1' as const,
    expectedAccountRevision: context.account.revision,
    snapshot: loaded.snapshot, control: loaded.sessionControl,
    expectedSourceAddress: { artifactId: loaded.sessionControl.loadedArtifactId,
      publicationId: loaded.sessionControl.loadedPublicationId } };
}
async function suite() {
  await test('retirement closes one retained head and settles once', async () => {
    const context = await setup('ordinary');
    const adapter = new CleanEpochTerminalAdapter(context.owner);
    const result = await adapter.retire(request(context));
    check(result.status === 'completed', `retirement did not complete: ${JSON.stringify(result)}`);
    const account = await context.owner.readSelected(context.accountId);
    const slot = await context.owner.readSlot(context.accountId, 'slot-1');
    const run = account?.profile.history.runRecords[0];
    check(slot.status === 'closed' && account?.revision === 3 &&
      run?.outcome === 'archived' && run.archiveReason === 'retired' &&
      run.saveSlotIds.includes('slot-1') && account.profile.estate.deposits.length === 1 &&
      account.profile.campaignPublicationReceipts?.filter(receipt =>
        receipt.publicationId === result.recovery.publicationId).length === 6,
      'retirement settlement, receipts or closed address are missing');
    const retry = await adapter.retire(request(context));
    check(retry.status === 'completed' && retry.recovery.publicationId === result.recovery.publicationId &&
      (await context.owner.readSelected(context.accountId))?.revision === 3,
      'exact retry minted another publication or settlement');
    context.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    check((await reopened.readSlot(context.accountId, 'slot-1')).status === 'closed' &&
      (await reopened.readTerminalForSource(context.accountId,
        result.recovery.campaignId, request(context).control.loadedPublicationId))?.status === 'settlement_completed',
      'closed terminal authority failed restart readback');
    reopened.close();
  });
  await test('cross-slot retirement preserves prior address and closes both slots', async () => {
    const context = await setup('cross-slot');
    const descendant = await new CleanEpochDescendantAdapter(context.owner).save({
      accountId: context.accountId, sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
      expectedAccountRevision: context.account.revision, snapshot: context.first.loaded.snapshot,
      control: context.first.loaded.sessionControl, expectedDestinationAddress: null
    });
    check(descendant.status === 'ready', `cross-slot descendant failed: ${JSON.stringify(descendant)}`);
    const prior = await context.owner.readSlot(context.accountId, 'slot-1');
    const current = await context.owner.readSelected(context.accountId);
    check(prior.status === 'ready' && current?.revision === 3,
      'cross-slot save lost its retained non-head address');
    const retired = await new CleanEpochTerminalAdapter(context.owner).retire({
      accountId: context.accountId, sourceSlotId: 'quick-save',
      expectedAccountRevision: current.revision, snapshot: descendant.value.loaded.snapshot,
      control: descendant.value.loaded.sessionControl,
      expectedSourceAddress: { artifactId: descendant.value.loaded.sessionControl.loadedArtifactId,
        publicationId: descendant.value.loaded.sessionControl.loadedPublicationId }
    });
    check(retired.status === 'completed' && retired.recovery.addressSlotIds.length === 2 &&
      (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'closed' &&
      (await context.owner.readSlot(context.accountId, 'quick-save')).status === 'closed',
      `cross-slot terminal did not close both retained addresses: ${JSON.stringify(retired)}`);
    const settled = await context.owner.readSelected(context.accountId);
    check(settled?.profile.history.runRecords[0]?.saveSlotIds.includes('slot-1') &&
      settled.profile.history.runRecords[0]?.saveSlotIds.includes('quick-save') &&
      settled.revision === 4, 'terminal settlement lost retained address membership');
    context.owner.close();
  });
  await test('earned progression grants one Legacy payout and transaction', async () => {
    const context = await setup('earned-payout');
    const baseline = context.first.loaded.snapshot;
    const snapshot = { ...baseline, playerState: { ...baseline.playerState,
      progression: { ...baseline.playerState.progression,
        level: baseline.playerState.progression.level + 3 },
      saveMeta: { ...baseline.playerState.saveMeta, totalPlayTicks: 200 } } };
    const retired = await new CleanEpochTerminalAdapter(context.owner).retire({
      ...request(context), snapshot
    });
    check(retired.status === 'completed', `earned retirement failed: ${JSON.stringify(retired)}`);
    const account = await context.owner.readSelected(context.accountId);
    const run = account?.profile.history.runRecords[0];
    check((run?.legacyGranted ?? 0) > 0 && run?.payoutEligible === true &&
      account?.profile.legacy.legacyTransactions.filter(tx => tx.id === run.legacyPayoutTransactionId).length === 1 &&
      retired.recovery.payoutTransactionId === run.legacyPayoutTransactionId,
      'earned retirement did not grant exactly one retained payout');
    const retry = await new CleanEpochTerminalAdapter(context.owner).retire({ ...request(context), snapshot });
    check(retry.status === 'completed' &&
      (await context.owner.readSelected(context.accountId))?.profile.legacy.legacyTransactions.length ===
      account.profile.legacy.legacyTransactions.length, 'earned retirement replay duplicated payout');
    context.owner.close();
  });
  await test('abort after terminal publication leaves one pending recovery for restart', async () => {
    let armed = false;
    let writes = 0;
    const context = await setup('settlement-abort', { afterWrite: tx => {
      if (!armed) return;
      writes++;
      if (writes === 5) tx.abort();
    } });
    armed = true;
    const result = await new CleanEpochTerminalAdapter(context.owner).retire(request(context));
    check(result.status === 'blocked', 'settlement abort unexpectedly succeeded');
    const pending = await context.owner.readPendingTerminalForAccount(context.accountId);
    check(pending?.status === 'accepted_pending_settlement' &&
      (await context.owner.readSelected(context.accountId))?.revision === 2 &&
      (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'closed',
      'settlement abort changed account or lost closed pending publication');
    let fenced = false;
    try { await context.owner.updateProfile(context.accountId, 2,
      { ...context.account.profile, displayName: 'Illicit pending edit' }); }
    catch { fenced = true; }
    check(fenced && (await context.owner.readSelected(context.accountId))?.revision === 2,
      'pending terminal did not fence ordinary account mutation');
    context.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    const resumed = await new CleanEpochTerminalAdapter(reopened).resumePending(context.accountId);
    check(resumed?.status === 'completed' && resumed.recovery.publicationId === pending.publicationId &&
      (await reopened.readSelected(context.accountId))?.revision === 3,
      `restart did not settle exact pending identity: ${JSON.stringify(resumed)}`);
    reopened.close();
  });
  await test('publication quota preserves ready source and no lifecycle row', async () => {
    let armed = false;
    const context = await setup('quota', { beforeWrite: () => {
      if (armed) { armed = false; throw new DOMException('synthetic quota', 'QuotaExceededError'); }
    } });
    armed = true;
    const result = await new CleanEpochTerminalAdapter(context.owner).retire(request(context));
    check(result.status === 'blocked' &&
      (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'ready' &&
      (await context.owner.readPendingTerminalForAccount(context.accountId)) === null &&
      (await context.owner.readSelected(context.accountId))?.revision === 2,
      'quota partially published retirement');
    context.owner.close();
  });
  await test('stale account revision and source address leave the open head unchanged', async () => {
    const context = await setup('stale-input');
    const adapter = new CleanEpochTerminalAdapter(context.owner);
    const staleRevision = await adapter.retire({ ...request(context),
      expectedAccountRevision: context.account.revision - 1 });
    const staleAddress = await adapter.retire({ ...request(context),
      expectedSourceAddress: { artifactId: 'artifact.stale',
        publicationId: request(context).expectedSourceAddress.publicationId } });
    check(staleRevision.status === 'blocked' && staleAddress.status === 'blocked' &&
      (await context.owner.readSlot(context.accountId, 'slot-1')).status === 'ready' &&
      (await context.owner.readSelected(context.accountId))?.revision === 2 &&
      (await context.owner.readPendingTerminalForAccount(context.accountId)) === null,
      'stale retirement input changed the retained head');
    context.owner.close();
  });
  await test('stale second owner cannot replace a settled terminal head', async () => {
    const context = await setup('two-tabs');
    const other = await openCleanEpochAccountStore({ name: context.databaseName });
    const winner = await new CleanEpochTerminalAdapter(context.owner).retire(request(context));
    check(winner.status === 'completed', 'winner retirement failed');
    const loser = await new CleanEpochTerminalAdapter(other).retire({ ...request(context),
      snapshot: { ...request(context).snapshot, capturedAtTick: request(context).snapshot.capturedAtTick + 1 } });
    check(loser.status === 'blocked' &&
      (await other.readSelected(context.accountId))?.revision === 3,
      'competing terminal intent replaced accepted retirement');
    other.close(); context.owner.close();
  });
  await test('new v5 store opens with unique source index', async () => {
    const context = await setup('schema');
    const opened = indexedDB.open(context.databaseName, CLEAN_EPOCH_DATABASE_VERSION);
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      opened.onsuccess = () => resolve(opened.result);
      opened.onerror = () => reject(opened.error);
    });
    check(database.objectStoreNames.contains(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE) &&
      database.transaction(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
        .objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
        .indexNames.contains('bySourcePublication'), 'v5 lifecycle source index is missing');
    database.close(); context.owner.close();
  });
  await test('v4 upgrade preserves account bytes and installs lifecycle store', async () => {
    const databaseName = name('upgrade');
    const accountId = `account.local.${crypto.randomUUID()}`;
    const profile = createDefaultAccountProfileState({ accountId, displayName: 'V4 retained' });
    const credential = await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString());
    const account = { version: 1, accountId, revision: 1, profile, credential };
    const opened = indexedDB.open(databaseName, 4);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      opened.onupgradeneeded = () => {
        const upgrade = opened.result;
        ensureCampaignPublicationStores(upgrade);
        upgrade.createObjectStore('accounts', { keyPath: 'accountId' });
        upgrade.createObjectStore('newCampaignAttempts', { keyPath: ['accountId', 'slotId'] });
        upgrade.createObjectStore('pendingPublicationRecoveries', { keyPath: ['accountId', 'slotId'] });
        const descendants = upgrade.createObjectStore('descendantPublicationRecoveries',
          { keyPath: ['accountId', 'campaignId', 'publicationId'] });
        descendants.createIndex('byAccountCampaign', ['accountId', 'campaignId']);
      };
      opened.onsuccess = () => resolve(opened.result);
      opened.onerror = () => reject(opened.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('accounts', 'readwrite');
      tx.objectStore('accounts').put(account);
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
    });
    db.close();
    const upgraded = await openCleanEpochAccountStore({ name: databaseName });
    check(JSON.stringify(await upgraded.readSelected(accountId)) === JSON.stringify(account) &&
      (await upgraded.listSlots(accountId)).every(slot => slot.status === 'empty'),
      'v4 account changed during v5 additive upgrade');
    upgraded.close();
  });
  await test('malformed completed lifecycle row cannot read as success', async () => {
    const context = await setup('malformed');
    const result = await new CleanEpochTerminalAdapter(context.owner).retire(request(context));
    check(result.status === 'completed', 'setup retirement failed');
    const open = indexedDB.open(context.databaseName, CLEAN_EPOCH_DATABASE_VERSION);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, 'readwrite');
      const store = tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE);
      const get = store.get([context.accountId, result.recovery.campaignId, result.recovery.publicationId]);
      get.onsuccess = () => store.put({ ...get.result, estateSourceRunId: 'forged.estate' });
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
    });
    db.close();
    let blocked = false;
    try { await context.owner.readTerminalRecovery(context.accountId,
      result.recovery.campaignId, result.recovery.publicationId); }
    catch { blocked = true; }
    check(blocked, 'forged lifecycle row was accepted');
    context.owner.close();
  });
  await test('abort at every terminal write has no partial account authority', async () => {
    for (let stage = 1; stage <= 6; stage++) {
      let armed = false;
      let writes = 0;
      const context = await setup(`abort-${stage}`, { afterWrite: tx => {
        if (!armed) return;
        if (++writes === stage) tx.abort();
      } });
      armed = true;
      const result = await new CleanEpochTerminalAdapter(context.owner).retire(request(context));
      check(result.status === 'blocked' &&
        (await context.owner.readSelected(context.accountId))?.revision === 2,
        `abort ${stage} leaked account settlement`);
      const slot = await context.owner.readSlot(context.accountId, 'slot-1');
      const pending = await context.owner.readPendingTerminalForAccount(context.accountId);
      check(stage <= 4 ? slot.status === 'ready' && pending === null
        : slot.status === 'closed' && pending?.status === 'accepted_pending_settlement',
        `abort ${stage} left unexpected publication posture`);
      context.owner.close();
    }
  });
  await test('lost post-commit readback resumes retained terminal identity', async () => {
    const context = await setup('readback-loss');
    const original = context.owner.readTerminalRecovery.bind(context.owner);
    let failOnce = true;
    context.owner.readTerminalRecovery = async (...args) => {
      if (failOnce) { failOnce = false; throw new Error('synthetic readback unavailable'); }
      return original(...args);
    };
    const result = await new CleanEpochTerminalAdapter(context.owner).retire(request(context));
    check(result.status === 'blocked', 'lost readback unexpectedly returned success');
    const pending = await context.owner.readPendingTerminalForAccount(context.accountId);
    check(pending?.status === 'accepted_pending_settlement', 'lost readback did not retain pending identity');
    context.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    const resumed = await new CleanEpochTerminalAdapter(reopened).resumePending(context.accountId);
    check(resumed?.status === 'completed' && resumed.recovery.publicationId === pending.publicationId,
      'lost readback minted another terminal identity');
    reopened.close();
  });
  output.textContent = `PASS ${cases.length}/${cases.length}\n${cases.join('\n')}`;
}
suite().catch(error => { output.textContent = `FAIL ${cases.length}/${cases.length + 1}\n${cases.join('\n')}\n${error instanceof Error ? error.stack : String(error)}`; });
