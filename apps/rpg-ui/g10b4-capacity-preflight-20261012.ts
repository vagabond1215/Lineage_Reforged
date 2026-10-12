import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { resolveNearbyExplorationPlan } from '../../packages/engines/game-engine/src/player-nearby-exploration.ts';
import { serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';
import { advanceNearbyExplorationCaller } from './src/runtime/nearbyExplorationCaller.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
let assertions = 0;
function check(value: unknown, label: string): asserts value { assertions++; if (!value) throw Error(label); }
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'G10B4 Stonevein',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.kaelvar',
    regionId: 'region.auric_marches', startingSettlementId: 'settlement.stonevein' };
}
async function graph(name: string, accountId: string) {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const open = indexedDB.open(name); open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error);
  });
  try {
    const result: Record<string, { count: number; utf16Bytes: number }> = {};
    for (const family of [...db.objectStoreNames]) {
      const get = db.transaction(family, 'readonly').objectStore(family).getAll();
      const all = await new Promise<Array<{ accountId?: string }>>((resolve, reject) => {
        get.onsuccess = () => resolve(get.result); get.onerror = () => reject(get.error);
      });
      const own = all.filter(item => item.accountId === accountId);
      result[family] = { count: own.length, utf16Bytes: 2 * JSON.stringify(own).length };
    }
    return result;
  } finally { db.close(); }
}
async function main() {
  const name = `lineage.epoch-g10b4.capacity.${crypto.randomUUID()}`;
  const accountId = `account.local.${crypto.randomUUID()}`;
  let abortNext = false;
  let didAbort = false;
  const owner = await openCleanEpochAccountStore({ name, beforeWrite: tx => {
    if (abortNext) { abortNext = false; didAbort = true; tx.abort(); }
  } });
  try {
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'G10B4 capacity only' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
    check(first.status === 'ready', 'C1 ordinary Stonevein first campaign ready');
    const initial = first.value.loaded.snapshot;
    const plan = resolveNearbyExplorationPlan(initial);
    check(plan.available && plan.context.originSettlementId === 'settlement.stonevein' &&
      plan.context.habitatTags.includes('frontier_track'), 'C1 exact authored Stonevein plan');
    let current = first.value;
    let candidateCount = 0;
    let noMatchCount = 0;
    let maxCandidateBytes = 0;
    let sampleCandidate: unknown = null;
    let maxSnapshotBytes = 2 * serializeSnapshot(initial).length;
    const retainedArtifacts = [current.loaded.sessionControl.loadedArtifactId];
    for (let index = 0; index < 24; index++) {
      const transition = advanceNearbyExplorationCaller(current.loaded.snapshot, current.loaded.sessionControl);
      check(transition.acceptedState && transition.outcome.accepted, `C2 accepted ordinary action ${index + 1}`);
      const next = transition.acceptedState.snapshot;
      check(next.worldState.nearbyExplorationContext?.worldHexEdgeId ===
        'world_hex_edge.auric_marches_ore_ridges_auric_marches_caravan_marches' &&
        !next.gameState.activeEncounter, `C2 authored candidate-only context ${index + 1}`);
      const candidate = next.worldState.nearbyExplorationCandidate;
      if (candidate) {
        candidateCount++;
        sampleCandidate ??= candidate;
        maxCandidateBytes = Math.max(maxCandidateBytes, 2 * JSON.stringify(candidate).length);
      } else noMatchCount++;
      maxSnapshotBytes = Math.max(maxSnapshotBytes, 2 * serializeSnapshot(next).length);
      const account = (await owner.read(accountId))!;
      const saved = await new CleanEpochDescendantAdapter(owner).save({ accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
        snapshot: next, control: transition.acceptedState.control,
        expectedDestinationAddress: {
          artifactId: current.loaded.sessionControl.loadedArtifactId,
          publicationId: current.loaded.sessionControl.loadedPublicationId
        } });
      check(saved.status === 'ready', `C2 exact descendant publication ${index + 1}`);
      current = saved.value;
      retainedArtifacts.push(current.loaded.sessionControl.loadedArtifactId);
      check(current.loaded.snapshot.capturedAtTick === index + 1 &&
        current.loaded.sessionControl.campaignHeadRevision === index + 2,
        `C2 ready head and tick ${index + 1}`);
      output.textContent = `RUNNING ordinary action/save ${index + 1}/24 (${assertions})`;
    }
    check(candidateCount > 0 && candidateCount + noMatchCount === 24, 'C2 natural candidate and truthful no-match accounting');
    check(new Set(retainedArtifacts).size === 25, 'C2 all immutable publication IDs distinct');
    const beforeFault = await graph(name, accountId);
    check(beforeFault.artifacts.count === 25, 'C2 retained 25 artifact rows without pruning');
    const beforeAccount = JSON.stringify(await owner.read(accountId));
    const beforeControl = JSON.stringify(current.loaded.sessionControl);
    const transition = advanceNearbyExplorationCaller(current.loaded.snapshot, current.loaded.sessionControl);
    check(transition.acceptedState && transition.outcome.accepted, 'C4 next ordinary action prepared');
    abortNext = true;
    const failed = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
      expectedAccountRevision: (await owner.read(accountId))!.revision,
      snapshot: transition.acceptedState.snapshot, control: transition.acceptedState.control,
      expectedDestinationAddress: {
        artifactId: current.loaded.sessionControl.loadedArtifactId,
        publicationId: current.loaded.sessionControl.loadedPublicationId
      } });
    check(didAbort && failed.status === 'blocked', 'C4 injected transaction abort blocked publication');
    owner.close();
    const reopened = await openCleanEpochAccountStore({ name });
    try {
      const after = await reopened.readSlot(accountId, 'slot-1');
      check(after.status === 'ready' && JSON.stringify(after.loaded.sessionControl) === beforeControl,
        'C4 restart retained exact prior head and address');
      check(JSON.stringify(await reopened.read(accountId)) === beforeAccount,
        'C4 restart retained exact account revision');
      check(JSON.stringify(await graph(name, accountId)) === JSON.stringify(beforeFault),
        'C4 restart retained exact account graph after abort');
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage;
      const quota = estimate.quota;
      check(typeof usage === 'number' && typeof quota === 'number' && quota > 0,
        'C5 browser quota estimate available');
      const totalGraphBytes = Object.values(beforeFault).reduce((sum, row) => sum + row.utf16Bytes, 0);
      output.textContent = `PASS ${assertions} assertions; BROWSER_CAPACITY_DATA_READY\n` +
        JSON.stringify({ name, accountId, actions: 24, candidateCount, noMatchCount,
          artifactCount: beforeFault.artifacts.count, headRevision: after.loaded.sessionControl.campaignHeadRevision,
          maxSnapshotBytes, maxCandidateBytes, graphUtf16Bytes: totalGraphBytes,
          estimatedUsage: usage, estimatedQuota: quota, sampleCandidate,
          sourceHead: '3045963ec2b2ac988ff2f19e3beea4d98b8535e5' });
    } finally { reopened.close(); }
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL ${assertions}: ${error instanceof Error ? error.stack : error}`);
