import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { createDefaultAccountProfileState } from '../../../packages/engines/game-engine/src/legacy-account.ts';

/**
 * Disposable, real Chromium IndexedDB gate. Never points at an installed profile,
 * production/staging origin, a live Save, or the default account database name.
 * CI materializes exact v7 Store.ts at cleanEpochAccountStoreV7Qa.ts from the
 * immutable pre-v8 master commit; the file is NOT added to Git.
 */
const ORIGIN = 'http://127.0.0.1:5199';
const PAGE = ORIGIN + '/chronicle-world-registry-qa.html';
const SOURCE = readFileSync('packages/content/base/world/templates/starfall_port_chronicle_v1.json', 'utf8');
const PASSWORD = 'browser-synthetic-account-password-only';
const timestamp = '2026-11-17T00:00:00.000Z';
const unique = label => 'l3b.chromium.' + label + '.' + randomUUID();
const makeInput = (accountId, suffix) => ({
  account: { accountId, revision: 1, lifecycleGeneration: 1 },
  expectedAccountRevision: 1,
  expectedAccountGeneration: 1,
  creationIntentId: 'world.create.chromium.' + suffix,
  proposedWorldInstanceId: 'world.instance.chromium.' + suffix,
  displayName: 'Chromium First World ' + suffix,
  createdAt: timestamp,
  sourceTemplateJson: SOURCE
});
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
    if (action === 'register') {
      const owner = await open(data.name);
      return closeAnd(owner, async store => {
        const credential = await accountSource.createCredentialRecord(data.accountId, data.password, data.timestamp);
        const registered = await store.register(data.profile, credential);
        return { accountId:registered.readback.accountId,
          revision:registered.readback.revision };
      });
    }
    if (action === 'create') {
      const owner = await open(data.name);
      return closeAnd(owner, async store => {
        try {
          const result = await store.createChronicleWorld(data.input);
          return {status:result.status,worldId:result.world.worldInstanceId,
            receiptState:result.receipt.state,source:result.world.sourceManifestFingerprint,
            economyTick:result.world.economyState.economyTick,
            marketCount:result.world.economyState.projection.marketStates.length,
            servicesEnabled:result.world.economyState.servicesEnabled,
            characters:result.world.characterAssociations.length};
        } catch (error) { return {errorCode:error.code ?? error.name}; }
      });
    }
    if (action === 'read') {
      const owner = await open(data.name);
      return closeAnd(owner, async store => {
        const worlds = await store.listChronicleWorlds(data.accountId);
        const archive = await store.exportArchive();
        return {worldIds:worlds.map(w=>w.worldInstanceId), archive,
          economyTicks:worlds.map(w=>w.economyState.economyTick),
          counts:JSON.parse(archive).families.map(f=>f.count)};
      });
    }
    if (action === 'abortWrite') {
      let writes = 0;
      const owner = await v8.openCleanEpochAccountStore({
        name:data.name, afterWrite:tx=>{ if (++writes === 1) tx.abort(); }
      });
      return closeAnd(owner, async store => {
        try { await store.createChronicleWorld(data.input); return {unexpectedCommit:true}; }
        catch (error) { return {code:error.code ?? error.name,writeAttempts:writes}; }
      });
    }
    if (action === 'quota') {
      const owner = await v8.openCleanEpochAccountStore({
        name:data.name, beforeWrite:()=>{throw new DOMException('synthetic quota','QuotaExceededError');}
      });
      return closeAnd(owner, async store => {
        try { await store.createChronicleWorld(data.input); return {unexpectedCommit:true}; }
        catch (error) { return {code:error.code ?? error.name}; }
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

  const liveName = unique('v8-world');
  const worldAccount = 'account.chromium.world.' + randomUUID();
  const profile = makeProfile(worldAccount);
  assert.equal((await inBrowser(first,'register',{name:liveName,accountId:worldAccount,
    profile,password:PASSWORD,timestamp})).revision,1);
  const input = makeInput(worldAccount,randomUUID());
  const [a,b] = await Promise.all([
    inBrowser(first,'create',{name:liveName,input}),
    inBrowser(second,'create',{name:liveName,input})
  ]);
  assert.deepEqual([a.status,b.status].sort(),['committed','same_source_retry']);
  assert.equal(a.worldId,input.proposedWorldInstanceId);
  assert.equal(a.source,b.source);
  assert.equal(a.economyTick,0);
  assert.ok(a.marketCount >= 5);
  assert.equal(a.servicesEnabled,false);
  assert.equal(a.characters,0);
  const conflict = await inBrowser(second,'create',{
    name:liveName,input:makeInput(worldAccount,randomUUID())});
  assert.equal(conflict.errorCode,'conflict');

  await first.reload({waitUntil:'domcontentloaded'});
  const retained = await inBrowser(first,'read',{name:liveName,accountId:worldAccount});
  assert.deepEqual(retained.worldIds,[input.proposedWorldInstanceId]);
  assert.deepEqual(retained.economyTicks,[0]);
  assert.deepEqual(retained.counts.slice(14),[1,1]);

  const restoreName = unique('restore-world');
  const restored = await inBrowser(second,'restore',{name:restoreName,accountId:worldAccount,
    archive:retained.archive});
  assert.deepEqual(restored.worlds,[input.proposedWorldInstanceId]);
  assert.deepEqual(restored.families.map(f=>f.count),retained.counts);
  const deleted = await inBrowser(first,'delete',{name:liveName,accountId:worldAccount,password:PASSWORD});
  assert.deepEqual(deleted,{status:'committed',accountPresent:false,worldCount:0,receiptCount:0});
  console.log('PASS real Chromium: two-tab exact intent, conflict, reload/readback, complete v8 archive restore and account-owned deletion');

  const failedName=unique('failed-writes');
  const failedId='account.chromium.fault.'+randomUUID();
  await inBrowser(first,'register',{name:failedName,accountId:failedId,
    profile:makeProfile(failedId),password:PASSWORD,timestamp});
  const failInput=makeInput(failedId,randomUUID());
  const interrupted=await inBrowser(first,'abortWrite',{name:failedName,input:failInput});
  assert.equal(interrupted.code,'aborted');
  assert.equal(interrupted.writeAttempts,1);
  const afterAbort=await inBrowser(second,'read',{name:failedName,accountId:failedId});
  assert.deepEqual(afterAbort.counts.slice(14),[0,0]);
  const quota=await inBrowser(first,'quota',{name:failedName,input:failInput});
  assert.equal(quota.code,'quota');
  const afterQuota=await inBrowser(second,'read',{name:failedName,accountId:failedId});
  assert.deepEqual(afterQuota.counts.slice(14),[0,0]);
  assert.equal((await inBrowser(first,'create',{name:failedName,input:failInput})).status,'committed');
  console.log('PASS real Chromium: injected post-write abort and quota-like failure preserve empty World/receipt pair and permit clean retry');

  await context.close();
  console.log('PASS L3b Chromium source-only QA: no default account DB, Save owners, UI route or production origin touched');
} finally {
  await browser?.close();
  try { process.kill(-server.pid,'SIGTERM'); } catch { server.kill('SIGTERM'); }
}
