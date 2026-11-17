import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { createDefaultAccountProfileState } from '../../../packages/engines/game-engine/src/legacy-account.ts';

/**
 * Disposable, real Chromium IndexedDB gate. Never points at an installed profile,
 * production/staging origin, a live Save, or the default account database name.
 * CI materializes exact v7 Store.ts at cleanEpochAccountStoreV7Qa.ts from the
 * immutable pre-v8 master commit; the file is NOT added to Git.
 * L3b browser World CREATE intentionally remains held: the civilization
 * economy bootstrap currently reads node:fs and is not a browser bundle.
 */
const ORIGIN = 'http://127.0.0.1:5199';
const PAGE = ORIGIN + '/chronicle-world-registry-qa.html';
const PASSWORD = 'browser-synthetic-account-password-only';
const timestamp = '2026-11-17T00:00:00.000Z';
const unique = label => 'l3b.chromium.' + label + '.' + randomUUID();
const makeProfile = accountId =>
  createDefaultAccountProfileState({ accountId, displayName: 'Disposable Chromium World', createdAt: timestamp });

let output = '';
const server = spawn('npm',
  ['--prefix', 'apps/rpg-ui', 'run', 'dev', '--', '--host', '127.0.0.1', '--port', '5199', '--strictPort'],
  { stdio: ['ignore', 'pipe', 'pipe'], detached: true });
server.stdout.on('data', x => { output = (output + x.toString()).slice(-5000); });
server.stderr.on('data', x => { output = (output + x.toString()).slice(-5000); });
async function serverReady() {
  for (let i = 0; i < 180; i++) {
    if (server.exitCode !== null) throw new Error('Vite fixture exited: ' + output);
    try {
      const response = await fetch(PAGE);
      if (response.ok && (await response.text()).includes('data-chronicle-registry-qa')) return;
    } catch { /* server still booting */ }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  throw new Error('Vite fixture unavailable: ' + output);
}
async function inBrowser(page, action, data = {}) {
  return page.evaluate(async ({ action, data }) => {
    const v8 = await import('/src/game-shell/cleanEpochAccountStore.ts');
    const accountSource = await import('/src/game-shell/launcherAuthManager.ts');
    const open = async name => v8.openCleanEpochAccountStore({ name });
    const closeAnd = async (owner, functionToRun) => {
      try { return await functionToRun(owner); } finally { owner.close(); }
    };
    if (action === 'legacyV7') {
      const v7 = await import('/src/game-shell/cleanEpochAccountStoreV7Qa.ts');
      if (v7.CLEAN_EPOCH_DATABASE_VERSION !== 7 || v8.CLEAN_EPOCH_DATABASE_VERSION !== 8)
        throw Error('Exact v7/v8 source versions not present in disposable browser.');
      const owner = await v7.openCleanEpochAccountStore({ name: data.name });
      return closeAnd(owner, async store => {
        const credential = await accountSource.createCredentialRecord(data.accountId, data.password, data.timestamp);
        await store.register(data.profile, credential);
        const read = await store.readSelected(data.accountId);
        const archive = await store.exportArchive();
        return { account: read, archive,
          families: JSON.parse(archive).families.map(f => ({ name:f.name, count:f.count, sha256:f.sha256 })) };
      });
    }
    if (action === 'blockedUpgrade') {
      const raw = await new Promise((resolve, reject) => {
        const req = indexedDB.open(data.name, 7);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        req.onupgradeneeded = () => reject(Error('Missing v7 database, cannot prove upgrade blocked.'));
      });
      try {
        try {
          await v8.openCleanEpochAccountStore({ name:data.name });
          return { blocked:false };
        } catch (error) {
          return { blocked:error.code === 'blocked_upgrade', code:error.code ?? error.name };
        }
      } finally {
        raw.close();
      }
    }
    if (action === 'migrate') {
      const owner = await open(data.name);
      return closeAnd(owner, async store => {
        const read = await store.readSelected(data.accountId);
        const archive = await store.exportArchive();
        return { account:read, archive,
          families:JSON.parse(archive).families.map(f=>({name:f.name,count:f.count,sha256:f.sha256})) };
      });
    }
    if (action === 'restore') {
      const owner = await open(data.name);
      return closeAnd(owner, async store => {
        await store.restoreArchive(data.archive);
        const read = await store.readSelected(data.accountId);
        const worlds = await store.listChronicleWorlds(data.accountId);
        const exported = JSON.parse(await store.exportArchive());
        return {account:read,worlds:worlds.map(w=>w.worldInstanceId),
          families:exported.families.map(f=>({name:f.name,count:f.count,sha256:f.sha256}))};
      });
    }
    if (action === 'readEmpty') {
      const owner = await open(data.name);
      return closeAnd(owner, async store => {
        const list = await store.listChronicleWorlds(data.accountId);
        const archive = JSON.parse(await store.exportArchive());
        return { worldCount:list.length,
          familyCounts:archive.families.map(f=>f.count) };
      });
    }
    if (action === 'delete') {
      const owner = await open(data.name);
      return closeAnd(owner, async store => {
        const result = await store.transitionAccount('delete', {
          accountId:data.accountId,expectedRevision:1,expectedGeneration:1,
          currentPassword:data.password,requestId:crypto.randomUUID()
        });
        const archive = JSON.parse(await store.exportArchive());
        return {status:result.status,accountPresent:(await store.read(data.accountId))!==null,
          worldCount:archive.families[14].count,receiptCount:archive.families[15].count};
      });
    }
    if (action === 'injectOrphan') {
      const db = await new Promise((resolve, reject) => {
        const req = indexedDB.open(data.name,8);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        req.onupgradeneeded = () => reject(Error('Unexpected v8 fixture upgrade.'));
      });
      try {
        const tx = db.transaction(v8.CLEAN_EPOCH_WORLD_STORE,'readwrite');
        tx.objectStore(v8.CLEAN_EPOCH_WORLD_STORE).put({
          version:1,accountId:data.accountId,
          worldInstanceId:'world.instance.chromium.corrupt.orphan',
          creationIntentId:'world.create.chromium.corrupt.orphan'
        });
        await new Promise((resolve,reject) => {
          tx.oncomplete=resolve;
          tx.onabort=()=>reject(tx.error);
        });
      } finally { db.close(); }
      const owner = await open(data.name);
      return closeAnd(owner, async store => {
        let listError, archiveError;
        try { await store.listChronicleWorlds(data.accountId); }
        catch (error) { listError = error.code ?? error.name; }
        try { await store.exportArchive(); }
        catch (error) { archiveError = error.code ?? error.name; }
        const retained = await store.read(data.accountId);
        return {listError,archiveError,retainedAccount:!!retained};
      });
    }
    throw Error('Unsupported QA action: ' + action);
  }, { action, data });
}

let browser;
try {
  await serverReady();
  browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  const context = await browser.newContext();
  const first = await context.newPage();
  const second = await context.newPage();
  for (const page of [first, second]) {
    await page.goto(PAGE, {waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('[data-chronicle-registry-qa]').count(),1);
  }

  // Exact source v7 on the same origin as v8. This does not synthesize an
  // imaginary v7 store structure or modify an installed player profile.
  const legacyName = unique('v7-upgrade');
  const legacyId = 'account.chromium.legacy.' + randomUUID();
  const legacyProfile = makeProfile(legacyId);
  const old = await inBrowser(first,'legacyV7',{name:legacyName,accountId:legacyId,
    profile:legacyProfile,password:PASSWORD,timestamp});
  assert.equal(old.account.revision,1);
  assert.equal(old.families.length,14);
  assert.deepEqual(old.account.profile,legacyProfile);
  const blocked = await inBrowser(second,'blockedUpgrade',{name:legacyName});
  assert.deepEqual(blocked,{blocked:true,code:'blocked_upgrade'});
  const upgraded = await inBrowser(first,'migrate',{name:legacyName,accountId:legacyId});
  assert.equal(upgraded.families.length,16);
  assert.deepEqual(upgraded.families.slice(0,14),old.families);
  assert.deepEqual(upgraded.account,old.account);
  assert.deepEqual(upgraded.families.slice(14).map(f=>f.count),[0,0]);
  const restoreLegacyName = unique('restored-old');
  const restoredLegacy = await inBrowser(first,'restore',{name:restoreLegacyName,accountId:legacyId,archive:old.archive});
  assert.deepEqual(restoredLegacy.account,old.account);
  assert.deepEqual(restoredLegacy.families.slice(0,14),old.families);
  assert.deepEqual(restoredLegacy.families.slice(14).map(f=>f.count),[0,0]);
  console.log('PASS real Chromium: exact original v7 account, blocked upgrade, v8 preserved 14-family digests and v7 archive restore');

  // Real IndexedDB read-only World list and destructive account cleanup work
  // with the browser-safe registry validator. World creation remains held
  // because the civilization-engine bootstrap currently imports node:fs.
  const inventory = await inBrowser(first,'readEmpty',{name:legacyName,accountId:legacyId});
  assert.equal(inventory.worldCount,0);
  assert.deepEqual(inventory.familyCounts.slice(14),[0,0]);
  await first.reload({waitUntil:'domcontentloaded'});
  const reopened = await inBrowser(first,'migrate',{name:legacyName,accountId:legacyId});
  assert.deepEqual(reopened.account,old.account);

  const malformedName=unique('malformed-world');
  await inBrowser(second,'restore',{name:malformedName,accountId:legacyId,archive:old.archive});
  const invalid = await inBrowser(second,'injectOrphan',{name:malformedName,accountId:legacyId});
  assert.deepEqual(invalid,{listError:'invalid_record',
    archiveError:'invalid_record',retainedAccount:true});
  const deleted=await inBrowser(first,'delete',{name:legacyName,accountId:legacyId,password:PASSWORD});
  assert.deepEqual(deleted,{status:'committed',accountPresent:false,worldCount:0,receiptCount:0});
  console.log('PASS real Chromium: v8 empty World inventory, restart, invalid World graph rejection and clean account deletion');
  console.log('HOLD L3b browser World creation: Node-only civilization economy bootstrap requires approved browser-safe source');

  await context.close();
  console.log('PASS L3a Chromium migration QA and L3b read-only graph validation: no player data or production origin touched');
} finally {
  await browser?.close();
  try { process.kill(-server.pid,'SIGTERM'); } catch { server.kill('SIGTERM'); }
}
