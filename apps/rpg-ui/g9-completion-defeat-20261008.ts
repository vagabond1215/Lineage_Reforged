import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, type CleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochNormalDefeatRecoveryAdapter } from './src/game-shell/cleanEpochNormalDefeatRecoveryAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, startingBundleOptions, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';
import { resolveNormalDefeat } from '../../packages/engines/game-engine/src/normal-defeat.ts';
import { completePendingNormalDefeatRecovery } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { evaluateAchievementProgress } from '../../packages/engines/game-engine/src/achievements.ts';
import { deserializeSnapshot, serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';

const display = document.querySelector<HTMLPreElement>('#audit')!;
const dbName = `lineage.g9.completion.defeat.${crypto.randomUUID()}`;
const password = 'synthetic-defeat-audit-password';
const familyNames = ['accounts', 'accountLifecycle', 'newCampaignAttempts', 'pendingPublicationRecoveries',
  'descendantPublicationRecoveries', 'terminalLifecycleRecoveries', 'campaignAttemptsV6',
  'firstPublicationRecoveriesV6', 'currentSlotGenerations', 'addressDeletionReceipts',
  'artifacts', 'controls', 'slots', 'witnesses'];
let assertions = 0;
const scenarios: string[] = [];
function check(value: unknown, label: string): asserts value { assertions++; if (!value) throw Error(label); }
function mark(label: string) { scenarios.push(label); display.textContent = `RUNNING ${label} (${assertions})`; }
function form() {
  const initial = createDefaultCharacterCreationFormState('slot-1');
  const identity = getLineageIdentityCatalog(initial.lineageId)!;
  const bundle = startingBundleOptions[0]!;
  const continent = getWorldContinentOptions()[0]!;
  const region = getWorldRegionOptions(continent.id)[0]!;
  const settlement = getWorldSettlementOptions({ continentId: continent.id, regionId: region.id,
    backstoryId: '' })[0]!;
  return { ...initial, playerName: `Defeat ${crypto.randomUUID().slice(0, 6)}`,
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle.id,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId: continent.id, regionId: region.id, startingSettlementId: settlement.id };
}
async function accountBytes(accountId: string) {
  const opening = indexedDB.open(dbName);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    opening.onsuccess = () => resolve(opening.result); opening.onerror = () => reject(opening.error);
  });
  try {
    const rows = [];
    for (const name of familyNames) {
      const request = db.transaction(name).objectStore(name).getAll();
      const found = await new Promise<Record<string, unknown>[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result as Record<string, unknown>[]);
        request.onerror = () => reject(request.error);
      });
      rows.push([name, found.filter(row => row.accountId === accountId)]);
    }
    return JSON.stringify(rows);
  } finally { db.close(); }
}
async function replacePrepared(attempt: Record<string, unknown>) {
  const opening = indexedDB.open(dbName);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    opening.onsuccess = () => resolve(opening.result); opening.onerror = () => reject(opening.error);
  });
  try {
    const request = db.transaction('campaignAttemptsV6', 'readwrite').objectStore('campaignAttemptsV6').put(attempt);
    await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}
async function pendingSource(owner: CleanEpochAccountStore) {
  const accountId = `account.local.g9.defeat.${crypto.randomUUID()}`;
  const registered = await new CleanEpochAccountAdapter(owner).register({ accountId,
    displayName: 'Synthetic defeat account', password, confirmPassword: password, stayLoggedIn: false });
  check(registered.status === 'ready', 'defeat registration');
  const first = new CleanEpochFirstCampaignAdapter(owner);
  const prepared = await first.prepare(accountId, form(), false);
  check(prepared.status === 'ready', `prepared defeat source ${JSON.stringify(prepared)}`);
  const before = deserializeSnapshot(prepared.value.snapshotRaw);
  before.playerState.resources.hp.current = 0;
  before.playerState.location.settlementId = null;
  before.playerState.flags = before.playerState.flags.filter(flag => !flag.startsWith('player.start.'));
  const defeated = resolveNormalDefeat(before, { sourceMutationId: `qa.defeat.${crypto.randomUUID()}`,
    sourceKind: 'accepted_mutation' });
  check(defeated.receipt.posture === 'recovery_pending', 'gameplay defeat did not produce pending receipt');
  const projected = evaluateAchievementProgress(defeated.snapshot, registered.value.account.profile,
    { slotId: 'slot-1', touchHistory: true, recordedAt: prepared.value.createdAt,
      suppressLegacyRewards: true }).nextSnapshot;
  const projectionFingerprint = JSON.stringify({ slotId: 'slot-1', capturedAtTick: projected.capturedAtTick,
    characterAchievementIds: projected.playerState.achievements.unlocked.map(item => item.achievementId) });
  await replacePrepared({ ...prepared.value, snapshotRaw: serializeSnapshot(projected),
    consumerPlans: prepared.value.consumerPlans.map(plan =>
      ['active_history', 'account_achievements', 'legacy_rewards', 'last_played'].includes(plan.kind)
        ? { ...plan, payloadFingerprint: projectionFingerprint } : plan) });
  const published = await first.resume(accountId, 'slot-1');
  check(published.status === 'ready', `pending source publication ${JSON.stringify(published)}`);
  const control = published.value.loaded.sessionControl;
  const account = (await owner.read(accountId))!;
  return { accountId, account, receiptId: defeated.receipt.receiptId,
    request: { accountId, sourceSlotId: 'slot-1' as const, destinationSlotId: 'slot-1' as const,
      expectedDestinationAddress: { artifactId: control.loadedArtifactId,
        publicationId: control.loadedPublicationId }, expectedAccountRevision: account.revision,
      snapshot: published.value.loaded.snapshot, control, receiptId: defeated.receipt.receiptId } };
}
async function run() {
  const owner = await openCleanEpochAccountStore({ name: dbName });
  try {
    mark('baseline retained pending defeat and write count');
    const baseline = await pendingSource(owner);
    let total = 0;
    const counter = await openCleanEpochAccountStore({ name: dbName, beforeWrite: () => { total++; } });
    const recovered = await new CleanEpochNormalDefeatRecoveryAdapter(counter).recover(baseline.request);
    check(recovered.status === 'ready', `baseline recovery ${JSON.stringify(recovered)}`);
    check(total >= 4, `unexpected defeat write count ${total}`);
    const publicationId = recovered.value.loaded.publication.publicationId;
    const accountAfter = (await owner.read(baseline.accountId))!;
    const retry = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover(baseline.request);
    check(retry.status === 'ready' && retry.value.loaded.publication.publicationId === publicationId &&
      (await owner.read(baseline.accountId))!.revision === accountAfter.revision,
      'exact second owner duplicated defeat publication or consumers');
    counter.close();
    for (const fault of ['abort', 'quota'] as const)
      for (let position = 1; position <= total; position++) {
        mark(`defeat ${fault} write ${position}/${total}`);
        const source = await pendingSource(owner);
        const before = await accountBytes(source.accountId);
        let writes = 0;
        const failing = await openCleanEpochAccountStore({ name: dbName, beforeWrite: tx => {
          if (++writes !== position) return;
          if (fault === 'abort') tx.abort();
          else throw new DOMException('Synthetic quota', 'QuotaExceededError');
        } });
        const denied = await new CleanEpochNormalDefeatRecoveryAdapter(failing).recover(source.request);
        check(denied.status === 'blocked', `defeat ${fault} ${position} did not block`);
        failing.close();
        const slot = await owner.readSlot(source.accountId, 'slot-1');
        if (slot.status === 'pending_consumers') {
          check((await owner.read(source.accountId))!.revision === source.account.revision,
            'pending defeat consumer fault changed account');
        } else check(await accountBytes(source.accountId) === before,
          'defeat publication fault changed source');
        const reopened = await openCleanEpochAccountStore({ name: dbName });
        const repaired = await new CleanEpochNormalDefeatRecoveryAdapter(reopened).recover(source.request);
        check(repaired.status === 'ready', `defeat ${fault} ${position} restart failed ${JSON.stringify(repaired)}`);
        check((repaired.value.loaded.snapshot.normalDefeatReceipts ?? []).some(item =>
          item.receiptId === source.receiptId && item.posture === 'playable'),
          'defeat restart did not produce playable exact receipt');
        reopened.close();
      }
    mark('bad/multiple receipt, destination and stale account');
    const conflicting = await pendingSource(owner);
    const unchanged = await accountBytes(conflicting.accountId);
    const adapter = new CleanEpochNormalDefeatRecoveryAdapter(owner);
    const bad = await adapter.recover({ ...conflicting.request, receiptId: crypto.randomUUID() });
    check(bad.status === 'blocked', 'wrong receipt accepted');
    const multiple = await adapter.recover({ ...conflicting.request,
      snapshot: { ...conflicting.request.snapshot,
        normalDefeatReceipts: [...(conflicting.request.snapshot.normalDefeatReceipts ?? []),
          conflicting.request.snapshot.normalDefeatReceipts![0]!] } });
    check(multiple.status === 'blocked', 'multiple pending receipts accepted');
    const destination = await adapter.recover({ ...conflicting.request,
      explicitDestinationId: `settlement.unseen.${crypto.randomUUID()}` });
    check(destination.status === 'blocked', 'unseen destination accepted');
    const stale = await adapter.recover({ ...conflicting.request,
      expectedAccountRevision: conflicting.request.expectedAccountRevision + 1 });
    check(stale.status === 'blocked', 'stale account revision accepted');
    const staleAddress = await adapter.recover({ ...conflicting.request,
      expectedDestinationAddress: { artifactId: 'artifact.stale', publicationId: 'publication.stale' } });
    check(staleAddress.status === 'blocked', 'stale destination address accepted');
    const staleHead = await adapter.recover({ ...conflicting.request,
      control: { ...conflicting.request.control, campaignHeadArtifactId: 'artifact.stale' } });
    check(staleHead.status === 'blocked', 'stale campaign head accepted');
    check(await accountBytes(conflicting.accountId) === unchanged,
      'invalid defeat requests changed retained graph');
    mark('lost post-commit acknowledgement and later head');
    const lost = await pendingSource(owner);
    const unreliable = await openCleanEpochAccountStore({ name: dbName });
    const originalRead = unreliable.readSlot.bind(unreliable);
    let lostOnce = false;
    unreliable.readSlot = async (...args) => {
      const value = await originalRead(...args);
      if (!lostOnce && value.status === 'ready' &&
          (value.loaded.snapshot.normalDefeatReceipts ?? []).some(item =>
            item.receiptId === lost.receiptId && item.posture === 'playable')) {
        lostOnce = true; throw Error('Synthetic lost defeat readback');
      }
      return value;
    };
    const blocked = await new CleanEpochNormalDefeatRecoveryAdapter(unreliable).recover(lost.request);
    check(blocked.status === 'blocked' && lostOnce, 'lost defeat readback not exposed');
    const acceptedSlot = await owner.readSlot(lost.accountId, 'slot-1');
    check(acceptedSlot.status === 'ready', 'lost acknowledgement lacked ready retained descendant');
    const returned = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover(lost.request);
    check(returned.status === 'ready' && returned.value.loaded.publication.publicationId ===
      acceptedSlot.loaded.publication.publicationId, 'second owner exact retry replaced defeat publication');
    unreliable.close();
    const latestAccount = (await owner.read(lost.accountId))!;
    const later = await new CleanEpochDescendantAdapter(owner).save({ accountId: lost.accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
      expectedDestinationAddress: { artifactId: returned.value.loaded.sessionControl.loadedArtifactId,
        publicationId: returned.value.loaded.sessionControl.loadedPublicationId },
      expectedAccountRevision: latestAccount.revision, snapshot: returned.value.loaded.snapshot,
      control: returned.value.loaded.sessionControl });
    check(later.status === 'ready', `later descendant ${JSON.stringify(later)}`);
    const laterBytes = await accountBytes(lost.accountId);
    const oldRetry = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover(lost.request);
    check(oldRetry.status === 'blocked' && await accountBytes(lost.accountId) === laterBytes,
      'old defeat request replaced later campaign head');
    mark('non-head pending source forks without changing quick address');
    const fork = await pendingSource(owner);
    const healed = completePendingNormalDefeatRecovery(fork.request.control,
      fork.request.snapshot, undefined, fork.receiptId);
    check(healed.accepted, `independent gameplay healing ${healed.reason}`);
    const quick = await new CleanEpochDescendantAdapter(owner).save({ accountId: fork.accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'quick-save', expectedDestinationAddress: null,
      expectedAccountRevision: fork.account.revision, snapshot: healed.snapshot,
      control: healed.control });
    check(quick.status === 'ready', `quick-address head setup ${JSON.stringify(quick)}`);
    const historical = await owner.readSlot(fork.accountId, 'slot-1');
    check(historical.status === 'ready' && historical.loaded.sessionControl.posture === 'non_head_unmutated',
      'pending source did not become non-head');
    const beforeFork = (await owner.read(fork.accountId))!;
    const forked = await new CleanEpochNormalDefeatRecoveryAdapter(owner).recover({
      ...fork.request, expectedAccountRevision: beforeFork.revision,
      snapshot: historical.loaded.snapshot, control: historical.loaded.sessionControl });
    check(forked.status === 'ready', `non-head defeat fork ${JSON.stringify(forked)}`);
    check((await owner.readSlot(fork.accountId, 'quick-save')).status === 'ready',
      'non-head fork erased other quick address');
    scenarios.push(`defeat write count ${total}, abort and quota at each position`);
    display.textContent = `PASS ${assertions} independent assertions\n${scenarios.join('\n')}`;
  } finally { owner.close(); }
}
run().catch(error => { display.textContent = `FAIL ${assertions} after ${scenarios.at(-1)}: ${error instanceof Error ? error.stack : String(error)}`; });
