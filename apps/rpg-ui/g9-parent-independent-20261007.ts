import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { CampaignStoreError } from './src/game-shell/campaignIndexedDbStore.ts';
import { accountLifecycleGeneration, openCleanEpochAccountStore, CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE,
  CLEAN_EPOCH_DATABASE_VERSION, type CleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

// Synthetic isolated authority probes designed from G9A-F, not the repair QA.
const output = document.querySelector<HTMLPreElement>('#result')!;
const families = ['newCampaignAttempts', 'pendingPublicationRecoveries', 'descendantPublicationRecoveries',
  'terminalLifecycleRecoveries', 'campaignAttemptsV6', 'firstPublicationRecoveriesV6',
  'currentSlotGenerations', 'addressDeletionReceipts', 'artifacts', 'controls', 'slots', 'witnesses'];
const password = 'g9-parent-synthetic-password';
let count = 0;
const assert = (yes: unknown, why: string) => { if (!yes) throw new Error(why); count++; };
const selectedForm = () => {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Parent Audit',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
};
type Fixture = { name: string; id: string; other: string; owner: CleanEpochAccountStore;
  writes: { value: number } };
async function fixture(label: string): Promise<Fixture> {
  const name = `g9.parent.independent.${label}.${crypto.randomUUID()}`;
  const id = `account.local.${crypto.randomUUID()}`;
  const other = `account.local.${crypto.randomUUID()}`;
  const writes = { value: 0 };
  const owner = await openCleanEpochAccountStore({ name, beforeWrite: () => { writes.value++; } });
  for (const accountId of [id, other]) {
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: accountId }),
      await createCredentialRecord(accountId, password, new Date().toISOString()));
    const ready = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, selectedForm());
    assert(ready.status === 'ready', `${label}: first publication failed`);
  }
  writes.value = 0;
  return { name, id, other, owner, writes };
}
async function db(name: string): Promise<IDBDatabase> {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(name, CLEAN_EPOCH_DATABASE_VERSION);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function mutate(x: Fixture, family: string, transform: (row: any, store: IDBObjectStore, key: IDBValidKey) => void,
  filter: (row: any) => boolean = () => true) {
  const database = await db(x.name);
  await new Promise<void>((resolve, reject) => {
    const tx = database.transaction(family, 'readwrite');
    let found = false;
    const request = tx.objectStore(family).openCursor(['accounts', 'accountLifecycle'].includes(family) ? x.id :
      IDBKeyRange.bound([x.id], [x.id, []]));
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) { if (!found) tx.abort(); return; }
      if (filter(cursor.value)) { found = true; transform(cursor.value, tx.objectStore(family), cursor.primaryKey); }
      else cursor.continue();
    };
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(new Error(`Missing ${family} fixture row`));
  });
  database.close();
}
async function snapshot(x: Fixture, accountId: string) {
  const database = await db(x.name);
  const values: Record<string, unknown> = { account: await x.owner.read(accountId), lifecycle: await x.owner.readLifecycleReceipt(accountId) };
  for (const family of families) {
    const tx = database.transaction(family, 'readonly');
    values[family] = await new Promise((resolve, reject) => {
      const request = tx.objectStore(family).getAll(IDBKeyRange.bound([accountId], [accountId, []]));
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
  }
  database.close();
  return JSON.stringify(values);
}
async function transition(x: Fixture, kind: 'reset' | 'delete', requestId = crypto.randomUUID()) {
  const account = (await x.owner.read(x.id))!;
  return x.owner.transitionAccount(kind, { accountId: x.id, expectedRevision: account.revision,
    expectedGeneration: accountLifecycleGeneration(account), currentPassword: password, requestId });
}
async function fails(run: () => Promise<unknown>, codes: string[]) {
  try { await run(); throw new Error('Unexpected success'); }
  catch (error) { assert(error instanceof CampaignStoreError && codes.includes(error.code),
    `Expected ${codes}, got ${String(error)}`); }
}
async function blocked(x: Fixture, kind: 'reset' | 'delete') {
  const before = await snapshot(x, x.id);
  const other = await snapshot(x, x.other);
  x.writes.value = 0;
  await fails(() => transition(x, kind), ['invalid_record']);
  assert(x.writes.value === 0, `${kind}: destructive write preceded preflight`);
  assert(await snapshot(x, x.id) === before && await snapshot(x, x.other) === other,
    `${kind}: rejected graph changed target or other account`);
}
async function descendant(x: Fixture, from: 'slot-1' | 'quick-save', to: 'slot-1' | 'quick-save') {
  const source = await x.owner.readSlot(x.id, from);
  const destination = await x.owner.readSlot(x.id, to);
  assert(source.status === 'ready', 'descendant source absent');
  const account = (await x.owner.readSelected(x.id))!;
  const saved = await new CleanEpochDescendantAdapter(x.owner).save({ accountId: x.id,
    sourceSlotId: from, destinationSlotId: to, expectedAccountRevision: account.revision,
    snapshot: source.loaded.snapshot, control: source.loaded.sessionControl,
    expectedDestinationAddress: destination.status === 'ready' ? {
      artifactId: destination.loaded.sessionControl.loadedArtifactId,
      publicationId: destination.loaded.sessionControl.loadedPublicationId } : null });
  assert(saved.status === 'ready', 'descendant publication failed');
}
async function deletion(x: Fixture) {
  const account = (await x.owner.readSelected(x.id))!;
  const pointer = (await x.owner.readSlotGeneration(x.id, 'slot-1'))!;
  const slot = await x.owner.readSlot(x.id, 'slot-1');
  assert(slot.status === 'ready', 'address deletion source absent');
  const input = { accountId: x.id, slotId: 'slot-1' as const,
    expectedAccountRevision: account.revision, expectedSlotGenerationId: pointer.slotGenerationId,
    expectedAddress: { artifactId: slot.loaded.sessionControl.loadedArtifactId,
      publicationId: slot.loaded.sessionControl.loadedPublicationId }, deletedAt: new Date().toISOString() };
  assert((await x.owner.deleteSlotAddress(input)).status === 'committed', 'address deletion failed');
  return input;
}
async function audit() {
  for (const kind of ['reset', 'delete'] as const) {
    for (const family of ['artifacts', 'controls', 'firstPublicationRecoveriesV6',
      'currentSlotGenerations', 'slots', 'campaignAttemptsV6']) {
      output.textContent = `RUNNING ${kind} missing ${family}; checks ${count}`;
      const x = await fixture(`${kind}.${family}`);
      await mutate(x, family, (_row, store, key) => store.delete(key));
      await blocked(x, kind); x.owner.close();
    }
    for (const mode of ['ghost', 'deleted-live'] as const) {
      output.textContent = `RUNNING ${kind} ${mode}; checks ${count}`;
      const x = await fixture(`${kind}.${mode}`);
      await mutate(x, 'accounts', (row, store) => {
        const run = row.profile.history.runRecords[0];
        store.put({ ...row, profile: { ...row.profile, history: { ...row.profile.history,
          runRecords: [{ ...run, ...(mode === 'ghost' ? { saveSlotIds: ['slot-1', 'slot-2'] } : { outcome: 'deleted' }) }] } } });
      }, row => row.accountId === x.id);
      await blocked(x, kind); x.owner.close();
    }
    {
      const x = await fixture(`${kind}.deleted-pointer`);
      await deletion(x);
      await mutate(x, 'currentSlotGenerations', (_row, store, key) => store.delete(key));
      await blocked(x, kind); x.owner.close();
    }
    {
      const x = await fixture(`${kind}.prior-destination`);
      await descendant(x, 'slot-1', 'quick-save');
      await mutate(x, 'descendantPublicationRecoveries', (row, store) => store.put({ ...row,
        expectedSlotAddress: { artifactId: 'artifact.fabricated', publicationId: 'publication.fabricated' } }));
      await blocked(x, kind); x.owner.close();
    }
    {
      const x = await fixture(`${kind}.published-control`);
      const beforeOther = await snapshot(x, x.other);
      const result = await transition(x, kind);
      assert(result.status === 'committed', `${kind}: coherent published graph rejected`);
      assert(await snapshot(x, x.other) === beforeOther, `${kind}: other account changed`);
      for (const family of families) {
        const database = await db(x.name);
        const tx = database.transaction(family, 'readonly');
        const rows = await new Promise<any[]>((resolve, reject) => { const r = tx.objectStore(family)
          .getAll(IDBKeyRange.bound([x.id], [x.id, []])); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
        database.close(); assert(rows.length === 0, `${kind}: ${family} survived erasure`);
      }
      const receipt = await x.owner.readLifecycleReceipt(x.id);
      assert(receipt?.kind === kind && receipt.completedGeneration === 2,
        `${kind}: receipt or generation missing`);
      if (kind === 'reset') assert(!!(await x.owner.read(x.id)) &&
        accountLifecycleGeneration((await x.owner.read(x.id))!) === 2, 'reset lost identity');
      else assert(await x.owner.read(x.id) === null && receipt?.version === 2, 'delete retained identity');
      x.owner.close();
    }
    {
      const x = await fixture(`${kind}.historical-control`);
      await descendant(x, 'slot-1', 'quick-save');
      await deletion(x);
      await descendant(x, 'quick-save', 'slot-1');
      assert((await transition(x, kind)).status === 'committed', `${kind}: valid slot reoccupation rejected`);
      x.owner.close();
    }
    {
      const x = await fixture(`${kind}.terminal-control`);
      const source = await x.owner.readSlot(x.id, 'slot-1');
      assert(source.status === 'ready', 'terminal source absent');
      const account = (await x.owner.readSelected(x.id))!;
      const retired = await new CleanEpochTerminalAdapter(x.owner).retire({ accountId: x.id,
        sourceSlotId: 'slot-1', expectedAccountRevision: account.revision,
        snapshot: source.loaded.snapshot, control: source.loaded.sessionControl,
        expectedSourceAddress: { artifactId: source.loaded.sessionControl.loadedArtifactId,
          publicationId: source.loaded.sessionControl.loadedPublicationId } });
      assert(retired.status === 'completed', 'terminal settlement failed');
      assert((await transition(x, kind)).status === 'committed', `${kind}: settled terminal rejected`);
      x.owner.close();
    }
  }
  {
    const x = await fixture('F5.historical-retry');
    await descendant(x, 'slot-1', 'quick-save');
    const old = await deletion(x);
    const receipt = await x.owner.readAddressDeletionReceipt(x.id, 'slot-1', old.expectedSlotGenerationId);
    await descendant(x, 'quick-save', 'slot-1');
    const before = await snapshot(x, x.id);
    x.owner.close();
    const second = await openCleanEpochAccountStore({ name: x.name });
    assert((await second.deleteSlotAddress(old)).status === 'same_source_retry', 'F5 exact retry failed');
    assert(JSON.stringify(await second.readAddressDeletionReceipt(x.id, 'slot-1', old.expectedSlotGenerationId)) === JSON.stringify(receipt),
      'F5 historical receipt changed');
    await fails(() => second.deleteSlotAddress({ ...old, deletedAt: '2026-01-01T00:00:00.000Z' }), ['conflict']);
    assert(await snapshot({ ...x, owner: second }, x.id) === before, 'F5 retry changed newer occupant');
    second.close();
  }
  {
    const x = await fixture('F8.two-owner');
    const account = (await x.owner.read(x.id))!;
    const input = { accountId: x.id, expectedRevision: account.revision,
      expectedGeneration: accountLifecycleGeneration(account), currentPassword: password,
      requestId: crypto.randomUUID() };
    const second = await openCleanEpochAccountStore({ name: x.name });
    const winner = await second.transitionAccount('delete', input);
    assert(winner.status === 'committed', 'two-owner winner failed');
    const before = await snapshot(x, x.id); const other = await snapshot(x, x.other);
    const adapter = new CleanEpochAccountAdapter(x.owner, localStorage);
    const loser = await adapter.deleteAccount({ accountId: x.id, expectedRevision: input.expectedRevision,
      expectedGeneration: input.expectedGeneration, password, requestId: crypto.randomUUID() });
    assert(loser.status === 'blocked' && loser.code === 'stale_head', 'competing request claimed tombstone');
    await fails(() => x.owner.transitionAccount('delete', { ...input, requestId: crypto.randomUUID() }), ['conflict']);
    assert(await snapshot(x, x.id) === before && await snapshot(x, x.other) === other,
      'competing request changed authority');
    x.owner.close(); second.close();
    const restarted = await openCleanEpochAccountStore({ name: x.name });
    assert((await restarted.transitionAccount('delete', input)).status === 'same_source_retry',
      'exact request retry did not survive restart');
    restarted.close();
  }
  for (const shape of ['legacy', 'malformed', 'missing'] as const) {
    const x = await fixture(`F8.${shape}`);
    const priorAccount = (await x.owner.read(x.id))!;
    const oldRevision = priorAccount.revision;
    const oldGeneration = accountLifecycleGeneration(priorAccount);
    await transition(x, 'delete');
    await mutate(x, CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE, (row, store, key) => {
      if (shape === 'missing') store.delete(key);
      else { delete row.requestId; store.put(shape === 'legacy' ? { ...row, version: 1 } : row); }
    });
    const other = await snapshot(x, x.other);
    const database = await db(x.name);
    const rawAccount = await new Promise((resolve, reject) => { const tx = database.transaction('accounts', 'readonly');
      const request = tx.objectStore('accounts').get(x.id);
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    database.close();
    assert(rawAccount === undefined, `${shape}: deleted account returned`);
    if (shape === 'legacy') {
      assert((await x.owner.readLifecycleReceipt(x.id))?.version === 1, 'legacy tombstone unreadable');
      await fails(() => x.owner.transitionAccount('delete', { accountId: x.id,
        expectedRevision: oldRevision, expectedGeneration: oldGeneration, currentPassword: password,
        requestId: crypto.randomUUID() }), ['conflict']);
    } else {
      if (shape === 'malformed') await fails(() => x.owner.readLifecycleReceipt(x.id), ['invalid_record']);
      await fails(() => x.owner.transitionAccount('delete', { accountId: x.id,
        expectedRevision: oldRevision, expectedGeneration: oldGeneration, currentPassword: password,
        requestId: crypto.randomUUID() }), ['invalid_record']);
    }
    assert(await snapshot(x, x.other) === other,
      `${shape}: wrong authority changed`);
    x.owner.close();
  }
  for (const kind of ['reset', 'delete'] as const) {
    for (const fault of ['abort', 'quota'] as const) {
      const x = await fixture(`${kind}.${fault}`);
      const before = await snapshot(x, x.id), other = await snapshot(x, x.other);
      x.owner.close();
      let hit = false;
      x.owner = await openCleanEpochAccountStore({ name: x.name, beforeWrite: tx => {
        if (hit) return; hit = true;
        if (fault === 'abort') tx.abort();
        else throw new DOMException('Synthetic quota fault', 'QuotaExceededError');
      } });
      try { await transition(x, kind); throw new Error(`${kind} ${fault} unexpectedly committed`); }
      catch (error) { assert(hit && error instanceof Error, `${kind} ${fault} was not injected`); }
      assert(await snapshot(x, x.id) === before && await snapshot(x, x.other) === other,
        `${kind} ${fault} changed durable authority`);
      x.owner.close();
    }
  }
  {
    const x = await fixture('stale-generation');
    const account = (await x.owner.read(x.id))!;
    const stale = { accountId: x.id, expectedRevision: account.revision,
      expectedGeneration: accountLifecycleGeneration(account), currentPassword: password,
      requestId: crypto.randomUUID() };
    const second = await openCleanEpochAccountStore({ name: x.name });
    assert((await second.transitionAccount('reset', stale)).status === 'committed', 'second owner reset failed');
    const before = await snapshot(x, x.id);
    await fails(() => x.owner.transitionAccount('delete', stale), ['stale_head']);
    assert(await snapshot(x, x.id) === before, 'stale pre-reset delete changed new generation');
    x.owner.close(); second.close();
  }
  output.textContent = `PASS independent owner checks ${count}`;
}
audit().catch(error => { output.textContent = `FAIL after ${count}: ${error instanceof Error ? error.stack : String(error)}`; });
