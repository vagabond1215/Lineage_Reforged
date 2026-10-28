import { createDefaultCharacterCreationFormState, validateCharacterCreationForm } from './src/game-shell/characterCreationForm.js';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.js';
import { getDefaultWorldSelection } from './src/game-shell/worldSelectionCatalog.js';
import { createNativeNewGameSnapshot } from './src/game-shell/nativeNewGameSnapshot.js';
import { buildNativeGearArtifactPublication, readNativeFreshSaveSnapshot } from './src/game-shell/saveManager.js';
import { readRetainedNativeSurveyMaterial } from './src/game-shell/nativeSurveyRetainedSource.js';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from '../../packages/engines/game-engine/src/player-quest-acceptance.js';
import { createPlayerTravelCommand, executePlayerTravelCommand } from '../../packages/engines/game-engine/src/player-travel.js';
import { openCampaignIndexedDbStore, CampaignStoreError } from './src/game-shell/campaignIndexedDbStore.js';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.js';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.js';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.js';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.js';
import type { SaveSnapshot } from '../../packages/shared/types/src/index.js';

const output = document.querySelector<HTMLPreElement>('#result')!;
const passed: string[] = [];
const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
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
