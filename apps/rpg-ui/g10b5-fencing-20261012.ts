import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { accountLifecycleGeneration, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const families = ['newCampaignAttempts', 'pendingPublicationRecoveries', 'descendantPublicationRecoveries',
  'terminalLifecycleRecoveries', 'campaignAttemptsV6', 'firstPublicationRecoveriesV6',
  'currentSlotGenerations', 'addressDeletionReceipts', 'artifacts', 'controls', 'slots', 'witnesses'];
let checks = 0;
function check(value: unknown, label: string): asserts value { checks++; if (!value) throw Error(label); }
function hint(): Storage {
  const values = new Map<string, string>();
  return { get length() { return values.size; }, clear: () => values.clear(),
    key: index => [...values.keys()][index] ?? null, getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); }, removeItem: key => { values.delete(key); } };
}
function form(slotId: string) {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState(slotId), playerName: 'G10B5 Fencing',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
}
async function graph(database: string, accountId: string) {
  const opened = indexedDB.open(database);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    opened.onsuccess = () => resolve(opened.result); opened.onerror = () => reject(opened.error);
  });
  try {
    const result: Record<string, unknown[]> = {};
    for (const family of families) {
      const request = db.transaction(family).objectStore(family).getAll();
      result[family] = (await new Promise<Array<{ accountId: string }>>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      })).filter(item => item.accountId === accountId);
    }
    return JSON.stringify(result);
  } finally { db.close(); }
}
async function main() {
  const database = `lineage.epoch-g10b5.fence.${crypto.randomUUID()}`;
  const targetId = `account.local.${crypto.randomUUID()}`;
  const otherId = `account.local.${crypto.randomUUID()}`;
  const password = 'disposable-isolated-fence';
  let owner = await openCleanEpochAccountStore({ name: database });
  try {
    for (const id of [targetId, otherId]) {
      await owner.register(createDefaultAccountProfileState({ accountId: id, displayName: id }),
        await createCredentialRecord(id, password, new Date().toISOString()));
      const first = await new CleanEpochFirstCampaignAdapter(owner).start(id, form('slot-1'));
      check(first.status === 'ready', 'ordinary first owner publication ready');
    }
    const before = (await owner.read(targetId))!;
    const slot = await owner.readSlot(targetId, 'slot-1');
    check(slot.status === 'ready', 'target ready before lifecycle transition');
    const old = new CleanEpochAccountAdapter(owner, hint());
    const session = await old.signIn({ accountId: targetId, password, stayLoggedIn: true });
    check(session.status === 'ready', 'old runtime session captured');
    const otherGraph = await graph(database, otherId);
    const otherAccount = JSON.stringify(await owner.read(otherId));
    const request = { accountId: targetId, sourceSlotId: 'slot-1' as const, destinationSlotId: 'slot-1' as const,
      expectedAccountRevision: before.revision, snapshot: slot.loaded.snapshot, control: slot.loaded.sessionControl,
      expectedDestinationAddress: { artifactId: slot.loaded.sessionControl.loadedArtifactId,
        publicationId: slot.loaded.sessionControl.loadedPublicationId } };
    const reset = await owner.transitionAccount('reset', { accountId: targetId,
      expectedRevision: before.revision, expectedGeneration: accountLifecycleGeneration(before),
      currentPassword: password, requestId: crypto.randomUUID() });
    check(reset.status === 'committed' && reset.receipt.kind === 'reset', 'disposable owner reset accepted');
    owner.close(); owner = await openCleanEpochAccountStore({ name: database });
    const after = (await owner.read(targetId))!;
    check(after.revision === before.revision + 1 && accountLifecycleGeneration(after) === accountLifecycleGeneration(before) + 1,
      'revision and generation advanced exactly once');
    check((await owner.readSlot(targetId, 'slot-1')).status === 'empty', 'old target address absent');
    const empty = await graph(database, targetId);
    check(Object.values(JSON.parse(empty) as Record<string, unknown[]>).every(rows => rows.length === 0),
      'all target authority families empty');
    let runtimeCode = '';
    try { await new CleanEpochAccountAdapter(owner, hint()).validateSession(session.value.session); }
    catch (error) { runtimeCode = (error as { code?: string }).code ?? ''; }
    check(runtimeCode === 'stale_head', 'old runtime session fenced after reopen');
    const stale = await new CleanEpochDescendantAdapter(owner).save(request);
    check(stale.status === 'blocked' && stale.code === 'stale_head', 'old exact Save fenced');
    check(await graph(database, targetId) === empty && JSON.stringify(await owner.read(targetId)) === JSON.stringify(after),
      'stale request caused no target resurrection or account change');
    check(await graph(database, otherId) === otherGraph && JSON.stringify(await owner.read(otherId)) === otherAccount,
      'other account graph and revision unchanged');
    output.textContent = `PASS ${checks} fresh isolated fencing assertions\n` + JSON.stringify({ database, targetId, otherId,
      oldRevision: before.revision, newRevision: after.revision,
      oldGeneration: accountLifecycleGeneration(before), newGeneration: accountLifecycleGeneration(after),
      oldArtifactId: slot.loaded.sessionControl.loadedArtifactId,
      oldPublicationId: slot.loaded.sessionControl.loadedPublicationId, runtimeCode, staleCode: stale.code });
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL ${checks}: ${error instanceof Error ? error.stack : error}`);
