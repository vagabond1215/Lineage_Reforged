import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { CampaignStoreError, ensureCampaignPublicationStores } from './src/game-shell/campaignIndexedDbStore.ts';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
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
async function test(name: string, run: () => Promise<void>) { await run(); cases.push(name); }
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
async function seed(name: string, accountId: string, malformed = false) {
  const db = await raw(name);
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(families.map(family => family[0]), 'readwrite');
    families.forEach((family, index) => {
      const value: Record<string, unknown> = { version: malformed && index === 0 ? 99 : 1, accountId };
      for (const key of family.slice(1)) value[key] = `${key}.${index}`;
      tx.objectStore(family[0]).put(value);
    });
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
  await seed(name, accountId);
  await seed(name, otherId);
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
async function suite() {
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
    await seed(x.name, x.accountId);
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
    await seed(x.name, x.accountId, true);
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
