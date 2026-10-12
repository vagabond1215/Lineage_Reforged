import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { accountLifecycleGeneration, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const password = 'synthetic-only-password';
const families = ['newCampaignAttempts', 'pendingPublicationRecoveries', 'descendantPublicationRecoveries',
  'terminalLifecycleRecoveries', 'campaignAttemptsV6', 'firstPublicationRecoveriesV6',
  'currentSlotGenerations', 'addressDeletionReceipts', 'artifacts', 'controls', 'slots', 'witnesses'];
let assertions = 0;
function check(value: unknown, label: string): asserts value {
  assertions++;
  if (!value) throw Error(label);
}
function storage(): Storage {
  const values = new Map<string, string>();
  return { get length() { return values.size; }, clear: () => values.clear(),
    getItem: key => values.get(key) ?? null, key: index => [...values.keys()][index] ?? null,
    removeItem: key => { values.delete(key); }, setItem: (key, value) => { values.set(key, value); } };
}
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Mara G10B3 Isolated',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
}
async function rows(name: string, accountId: string) {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(name);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    const result: Record<string, unknown[]> = {};
    for (const family of families) {
      const request = db.transaction(family, 'readonly').objectStore(family).getAll();
      const all = await new Promise<Array<{ accountId: string }>>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      result[family] = all.filter(row => row.accountId === accountId);
    }
    return result;
  } finally { db.close(); }
}
async function main() {
  // Unique database and synthetic IDs: no selected origin's account database or user data is touched.
  const name = `lineage.epoch-g10b3.generation.${crypto.randomUUID()}`;
  const targetId = `account.local.${crypto.randomUUID()}`;
  const otherId = `account.local.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name });
  try {
    for (const accountId of [targetId, otherId]) {
      await owner.register(createDefaultAccountProfileState({ accountId, displayName: accountId }),
        await createCredentialRecord(accountId, password, new Date().toISOString()));
      const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
      check(first.status === 'ready', 'synthetic first campaign ready');
    }
    const beforeAccount = (await owner.read(targetId))!;
    const beforeSlot = await owner.readSlot(targetId, 'slot-1');
    check(beforeSlot.status === 'ready', 'target first slot ready');
    const sessionAdapter = new CleanEpochAccountAdapter(owner, storage());
    const signed = await sessionAdapter.signIn({ accountId: targetId, password, stayLoggedIn: true });
    check(signed.status === 'ready', 'old-generation session issued');
    const oldSession = signed.value.session;
    const staleSave = { accountId: targetId, sourceSlotId: 'slot-1' as const,
      destinationSlotId: 'slot-1' as const, expectedAccountRevision: beforeAccount.revision,
      snapshot: beforeSlot.loaded.snapshot, control: beforeSlot.loaded.sessionControl,
      expectedDestinationAddress: { artifactId: beforeSlot.loaded.sessionControl.loadedArtifactId,
        publicationId: beforeSlot.loaded.sessionControl.loadedPublicationId } };
    const otherBefore = JSON.stringify({ account: await owner.read(otherId), rows: await rows(name, otherId) });
    output.textContent = `RUNNING isolated reset and stale request (${assertions})`;
    const reset = await owner.transitionAccount('reset', { accountId: targetId,
      expectedRevision: beforeAccount.revision,
      expectedGeneration: accountLifecycleGeneration(beforeAccount), currentPassword: password,
      requestId: crypto.randomUUID() });
    const afterAccount = (await owner.read(targetId))!;
    check(accountLifecycleGeneration(afterAccount) === accountLifecycleGeneration(beforeAccount) + 1,
      'reset increased lifecycle generation');
    check(afterAccount.revision > beforeAccount.revision, 'reset increased account revision');
    check((await owner.readSlot(targetId, 'slot-1')).status === 'empty', 'reset removed target slot');
    const afterResetRows = JSON.stringify(await rows(name, targetId));
    check(Object.values(JSON.parse(afterResetRows) as Record<string, unknown[]>).every(items => items.length === 0),
      'reset erased target account data families');
    let sessionCode = '';
    try { await sessionAdapter.validateSession(oldSession); }
    catch (error) { sessionCode = (error as { code?: string }).code ?? ''; }
    check(sessionCode === 'stale_head', 'old-generation runtime session fenced');
    const selection = await sessionAdapter.selectSession();
    check(selection.status === 'blocked' && selection.code === 'stale_head', 'old-generation stored hint fenced');
    const staleResult = await new CleanEpochDescendantAdapter(owner).save(staleSave);
    check(staleResult.status === 'blocked' && staleResult.code === 'stale_head',
      'stale account-revision Save fenced after generation advance');
    check(JSON.stringify(await rows(name, targetId)) === afterResetRows,
      'stale Save created no artifact, recovery, or slot row');
    check(JSON.stringify(await owner.read(targetId)) === JSON.stringify(afterAccount),
      'stale Save did not change target account revision or generation');
    check(JSON.stringify({ account: await owner.read(otherId), rows: await rows(name, otherId) }) === otherBefore,
      'unrelated account graph unchanged');
    output.textContent = `PASS ${assertions} assertions; isolated stale generation/revision fenced\n` +
      JSON.stringify({ database: name, targetId, otherId, oldRevision: beforeAccount.revision,
        newRevision: afterAccount.revision, oldGeneration: accountLifecycleGeneration(beforeAccount),
        newGeneration: accountLifecycleGeneration(afterAccount), resetKind: reset.kind,
        sessionCode, staleSaveCode: staleResult.code });
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL ${assertions}: ${error instanceof Error ? error.stack : error}`);
