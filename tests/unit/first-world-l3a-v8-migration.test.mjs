import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { createCredentialRecord } from '../../apps/rpg-ui/src/game-shell/launcherAuthManager.ts';
import { openCleanEpochAccountStore, CLEAN_EPOCH_DATABASE_VERSION,
  CLEAN_EPOCH_WORLD_STORE, CLEAN_EPOCH_WORLD_CREATION_RECEIPT_STORE } from
  '../../apps/rpg-ui/src/game-shell/cleanEpochAccountStore.ts';

globalThis.indexedDB = indexedDB;
globalThis.IDBKeyRange = IDBKeyRange;
if (!globalThis.crypto) globalThis.crypto = webcrypto;
const names = [
  ['accounts', 'accountId'],
  ['accountLifecycle', 'accountId'],
  ['newCampaignAttempts', ['accountId','slotId']],
  ['pendingPublicationRecoveries', ['accountId','slotId']],
  ['campaignAttemptsV6', ['accountId','campaignId']],
  ['firstPublicationRecoveriesV6', ['accountId','campaignId']],
  ['descendantPublicationRecoveries', ['accountId','campaignId','publicationId']],
  ['terminalLifecycleRecoveries', ['accountId','campaignId','publicationId']],
  ['currentSlotGenerations', ['accountId','slotId']],
  ['addressDeletionReceipts', ['accountId','slotId','slotGenerationId']],
  ['artifacts', ['accountId','artifactId']],
  ['controls', ['accountId','campaignId']],
  ['slots', ['accountId','slotId']],
  ['witnesses', ['accountId','campaignId','requestId']]
];
function digest(str) { return createHash('sha256').update(str).digest('hex'); }
function unique(label) { return `l3a.synthetic.${label}.${crypto.randomUUID()}`; }
async function openRaw(name, version, upgrade) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onupgradeneeded = () => upgrade?.(request.result);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
function makeV7(db) {
  for (const [name, keyPath] of names) {
    const store = db.createObjectStore(name, { keyPath });
    if (['artifacts','controls','slots','witnesses','descendantPublicationRecoveries'].includes(name))
      store.createIndex('byAccountCampaign', ['accountId','campaignId'], { unique: false });
    if (name === 'terminalLifecycleRecoveries') {
      store.createIndex('bySourcePublication', ['accountId','campaignId','sourcePublicationId'], { unique: true });
      store.createIndex('byAccount', 'accountId', { unique: false });
    }
  }
}
function toV7Archive(v8) {
  const payload = {
    format: v8.format, archiveVersion: 1, databaseName: v8.databaseName,
    databaseVersion: 7, createdAt: v8.createdAt,
    families: v8.families.slice(0,14)
  };
  return JSON.stringify({ ...payload, sha256: digest(JSON.stringify(payload)) });
}
async function assertRejectsArchive(owner, input) {
  await assert.rejects(owner.restoreArchive(input), err => err?.code === 'invalid_record');
}
test('L3a additive schema is 8 with 16 exact families and no World rows', async () => {
  assert.equal(CLEAN_EPOCH_DATABASE_VERSION, 8);
  const name=unique('fresh');
  const owner=await openCleanEpochAccountStore({ name, factory:indexedDB });
  const exported=JSON.parse(await owner.exportArchive());
  assert.equal(exported.archiveVersion,2);
  assert.equal(exported.databaseVersion,8);
  assert.equal(exported.families.length,16);
  assert.equal(exported.families[14].name,CLEAN_EPOCH_WORLD_STORE);
  assert.deepEqual(exported.families[14].keyPath,['accountId','worldInstanceId']);
  assert.equal(exported.families[15].name,CLEAN_EPOCH_WORLD_CREATION_RECEIPT_STORE);
  assert.deepEqual(exported.families[15].keyPath,['accountId','creationIntentId']);
  assert.ok(exported.families.every(f=>f.count===0));
  owner.close();
  const raw=await openRaw(name,8);
  assert.equal(raw.objectStoreNames.length,16);
  const tx=raw.transaction([CLEAN_EPOCH_WORLD_STORE,CLEAN_EPOCH_WORLD_CREATION_RECEIPT_STORE]);
  assert.ok(tx.objectStore(CLEAN_EPOCH_WORLD_STORE).indexNames.contains('byAccount'));
  assert.ok(tx.objectStore(CLEAN_EPOCH_WORLD_CREATION_RECEIPT_STORE).indexNames.contains('byAccount'));
  raw.close();
});

test('L3a preexisting empty version-7 epoch upgrades without losing any old store', async () => {
  const name=unique('upgrade');
  const original=await openRaw(name,7,makeV7);
  assert.equal(original.objectStoreNames.length,14);
  original.close();
  const owner=await openCleanEpochAccountStore({ name, factory:indexedDB });
  const current=JSON.parse(await owner.exportArchive());
  assert.equal(current.databaseVersion,8);
  assert.deepEqual(current.families.slice(0,14).map(f=>f.name),names.map(x=>x[0]));
  assert.ok(current.families.every(f=>f.count===0));
  owner.close();
});

test('L3a verified v7 archive restores only to an empty v8 target with original 14 digests', async () => {
  const source=await openCleanEpochAccountStore({ name:unique('source'), factory:indexedDB });
  const v8=JSON.parse(await source.exportArchive());
  source.close();
  const legacy=toV7Archive(v8);
  const owner=await openCleanEpochAccountStore({ name:unique('target'), factory:indexedDB });
  await owner.restoreArchive(legacy);
  const read=JSON.parse(await owner.exportArchive());
  assert.equal(read.families.length,16);
  assert.deepEqual(read.families.slice(0,14).map(f=>f.sha256),
    v8.families.slice(0,14).map(f=>f.sha256));
  assert.deepEqual(read.families.slice(14).map(f=>f.count),[0,0]);
  await assertRejectsArchive(owner,legacy.replace('"archiveVersion":1','"archiveVersion":99'));
  owner.close();
});

test('L3a rejects invalid and orphan World records rather than calling them durable', async () => {
  const name=unique('orphan');
  const owner=await openCleanEpochAccountStore({ name, factory:indexedDB });
  owner.close();
  const raw=await openRaw(name,8);
  const tx=raw.transaction(CLEAN_EPOCH_WORLD_STORE,'readwrite');
  tx.objectStore(CLEAN_EPOCH_WORLD_STORE).put({
    version:1,accountId:'account.synthetic.orphan',
    worldInstanceId:'world.instance.synthetic.orphan',creationIntentId:'world.create.synthetic.orphan'
  });
  await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});
  raw.close();
  const corrupt=await openCleanEpochAccountStore({ name, factory:indexedDB });
  await assert.rejects(corrupt.exportArchive(),err=>err?.code==='invalid_record');
  corrupt.close();
});

test('L3a nonempty v7 account survives upgrade, v7 archive restore, reset and delete', async () => {
  const name=unique('retained-account');
  const accountId='account.synthetic.retained';
  const password='synthetic-account-test-password';
  const at='2026-11-17T13:00:00.000Z';
  const profile=createDefaultAccountProfileState({accountId,displayName:'Retained Tester',createdAt:at});
  const credential=await createCredentialRecord(accountId,password,at);
  const v7=await openRaw(name,7,makeV7);
  const insert=v7.transaction('accounts','readwrite');
  insert.objectStore('accounts').put({
    version:1,accountId,revision:1,lifecycleGeneration:1,profile,credential
  });
  await new Promise((resolve,reject)=>{insert.oncomplete=resolve;insert.onabort=()=>reject(insert.error);});
  v7.close();

  const upgraded=await openCleanEpochAccountStore({name,factory:indexedDB});
  const read=await upgraded.readSelected(accountId);
  assert.equal(read?.revision,1);
  assert.deepEqual(read?.profile,profile);
  const afterUpgrade=JSON.parse(await upgraded.exportArchive());
  assert.equal(afterUpgrade.families[0].count,1);
  assert.equal(afterUpgrade.families[14].count,0);
  assert.equal(afterUpgrade.families[15].count,0);
  upgraded.close();

  const target=await openCleanEpochAccountStore({name:unique('retained-restore'),factory:indexedDB});
  const archived=toV7Archive(afterUpgrade);
  await target.restoreArchive(archived);
  const restored=await target.readSelected(accountId);
  assert.deepEqual(restored,read);
  const restoreArchive=JSON.parse(await target.exportArchive());
  assert.equal(restoreArchive.families[0].count,1);
  await assert.rejects(target.restoreArchive(archived),err=>err?.code==='invalid_record' || err?.code==='conflict');

  const reset=await target.transitionAccount('reset',{
    accountId,expectedRevision:1,expectedGeneration:1,currentPassword:password
  });
  assert.equal(reset.status,'committed');
  assert.equal(reset.account?.revision,2);
  assert.equal(reset.account?.lifecycleGeneration,2);
  const resetArchive=JSON.parse(await target.exportArchive());
  assert.equal(resetArchive.families[14].count,0);
  assert.equal(resetArchive.families[15].count,0);

  const deleted=await target.transitionAccount('delete',{
    accountId,expectedRevision:2,expectedGeneration:2,
    currentPassword:password,requestId:crypto.randomUUID()
  });
  assert.equal(deleted.status,'committed');
  assert.equal(await target.read(accountId),null);
  const deletedArchive=JSON.parse(await target.exportArchive());
  assert.equal(deletedArchive.families[0].count,0);
  assert.equal(deletedArchive.families[1].count,1);
  assert.equal(deletedArchive.families[14].count,0);
  assert.equal(deletedArchive.families[15].count,0);
  target.close();
});
