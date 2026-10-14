import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
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
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'G10B5 pending ordinary source',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.kaelvar',
    regionId: 'region.auric_marches', startingSettlementId: 'settlement.stonevein' };
}
async function rawRows(name: string, store: string, accountId: string) {
  const req = indexedDB.open(name);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  });
  try {
    const get = db.transaction(store).objectStore(store).getAll();
    return (await new Promise<Array<Record<string, unknown>>>((resolve, reject) => {
      get.onsuccess = () => resolve(get.result); get.onerror = () => reject(get.error);
    })).filter(row => row.accountId === accountId);
  } finally { db.close(); }
}
async function main() {
  const name = `lineage.epoch-g10b5.pending.${crypto.randomUUID()}`;
  const accountId = `account.local.${crypto.randomUUID()}`;
  let abort = false;
  let owner = await openCleanEpochAccountStore({ name,
    beforeWrite: (tx) => { if (abort) { abort = false; tx.abort(); } } });
  try {
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'G10B5 pending owner' }),
      await createCredentialRecord(accountId, 'test-only-password', new Date().toISOString()));
    const before = JSON.stringify(await owner.read(accountId));
    abort = true;
    try { await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form()); } catch { /* blocked boundary */ }
    const prepublication = await owner.readSlot(accountId, 'slot-1');
    check(prepublication.status !== 'ready' && prepublication.status !== 'pending_consumers',
      'prepublication abort produced no pending publication');
    check((await owner.readRecovery(accountId, 'slot-1')) === null, 'prepublication abort produced no recovery');
    check((await rawRows(name, 'artifacts', accountId)).length === 0, 'prepublication abort produced no artifact');
    check(JSON.stringify(await owner.read(accountId)) === before, 'prepublication abort preserved account');
    const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
    check(first.status === 'ready', 'ordinary source first publication');
    const firstRecovery = (await owner.readRecovery(accountId, 'slot-1'))!;
    const firstAccount = (await owner.read(accountId))!;
    owner.close(); owner = await openCleanEpochAccountStore({ name });
    const firstRetry = await owner.completePreparedAttemptConsumers(accountId, 'slot-1',
      firstRecovery.attemptId, firstRecovery.publicationId);
    check(firstRetry.status === 'same_source_retry' && firstRetry.account.revision === firstAccount.revision,
      'first exact duplicate idempotent after reopen');
    const firstHead = await owner.readSlot(accountId, 'slot-1');
    check(firstHead.status === 'ready', 'first head ready');
    let current = first.value;
    const descendants = [];
    for (let i = 0; i < 2; i++) {
      const action = advanceNearbyExplorationCaller(current.loaded.snapshot, current.loaded.sessionControl);
      check(action.acceptedState && action.outcome.accepted, `ordinary descendant ${i + 1}`);
      const account = (await owner.read(accountId))!;
      const saved = await new CleanEpochDescendantAdapter(owner).save({ accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
        expectedDestinationAddress: { artifactId: current.loaded.sessionControl.loadedArtifactId,
          publicationId: current.loaded.sessionControl.loadedPublicationId },
        snapshot: action.acceptedState.snapshot, control: action.acceptedState.control });
      check(saved.status === 'ready', 'ordinary descendant durable');
      current = saved.value;
      descendants.push(current.loaded.sessionControl.loadedPublicationId);
    }
    const exactHead = serializeSnapshot(current.loaded.snapshot);
    const exactAccount = JSON.stringify(await owner.read(accountId));
    const priorRecovery = await owner.readDescendantRecovery(accountId,
      current.loaded.sessionControl.campaignId, descendants[0]!);
    check(priorRecovery?.status === 'consumers_completed', 'older descendant retained');
    let oldRejected = false;
    try { await owner.completeDescendantConsumers(accountId,
      current.loaded.sessionControl.campaignId, descendants[0]!); } catch { oldRejected = true; }
    check(oldRejected, 'old non-head completion rejected');
    const latestRetry = await owner.completeDescendantConsumers(accountId,
      current.loaded.sessionControl.campaignId, descendants[1]!);
    check(latestRetry.status === 'same_source_retry', 'current exact duplicate idempotent');
    let unknownRejected = false;
    try { await owner.completeDescendantConsumers(accountId,
      current.loaded.sessionControl.campaignId, 'publication.unknown'); } catch { unknownRejected = true; }
    check(unknownRejected, 'unknown competing completion rejected');
    check(JSON.stringify(await owner.read(accountId)) === exactAccount, 'competing attempts preserved account');
    const after = await owner.readSlot(accountId, 'slot-1');
    check(after.status === 'ready' && serializeSnapshot(after.loaded.snapshot) === exactHead,
      'competing attempts preserved exact head');
    check((await owner.readSlot(accountId, 'slot-2')).status === 'empty', 'other slot unchanged');
    const corruptName = `lineage.epoch-g10b5.partial.${crypto.randomUUID()}`;
    const corruptId = `account.local.${crypto.randomUUID()}`;
    const corrupt = await openCleanEpochAccountStore({ name: corruptName });
    try {
      await corrupt.register(createDefaultAccountProfileState({ accountId: corruptId, displayName: 'G10B5 partial owner' }),
        await createCredentialRecord(corruptId, 'test-only-password', new Date().toISOString()));
      const original = corrupt.completePreparedAttemptConsumers.bind(corrupt);
      corrupt.completePreparedAttemptConsumers = async () => { throw Error('one-shot postpublication interruption'); };
      try { await new CleanEpochFirstCampaignAdapter(corrupt).start(corruptId, form()); } catch { /* pending */ }
      corrupt.completePreparedAttemptConsumers = original;
      const pending = await corrupt.readRecovery(corruptId, 'slot-1');
      check(pending?.status === 'accepted_pending_consumers', 'distinct first pending retained');
      corrupt.close();
      const open = indexedDB.open(corruptName);
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error);
      });
      const tx = db.transaction('firstPublicationRecoveriesV6', 'readwrite');
      tx.objectStore('firstPublicationRecoveriesV6').put({ ...pending, completedConsumerKinds: ['partial_only'] });
      await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
      db.close();
      const reopened = await openCleanEpochAccountStore({ name: corruptName });
      try {
        let partialRejected = false;
        try { await reopened.completePreparedAttemptConsumers(corruptId, 'slot-1',
          pending.attemptId, pending.publicationId); } catch { partialRejected = true; }
        check(partialRejected, 'partial recovery fails closed');
        check((await rawRows(corruptName, 'artifacts', corruptId)).length === 1,
          'malformed recovery did not mint artifact');
      } finally { reopened.close(); }
    } finally { corrupt.close(); }
    output.textContent = `PASS ${assertions} fresh G10B.5 pending negative assertions\n` + JSON.stringify({
      name, accountId, firstPublication: firstRecovery.publicationId,
      descendantPublications: descendants, finalArtifactId: current.loaded.sessionControl.loadedArtifactId,
      finalAccountRevision: (await owner.read(accountId))!.revision, corruptName, corruptId }, null, 2);
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL ${assertions} ${error instanceof Error ? error.stack : error}`);
