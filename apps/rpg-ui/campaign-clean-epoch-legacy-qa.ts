import { createDefaultAccountProfileState, grantLegacy } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { purchaseLegacyUnlock } from '../../packages/engines/game-engine/src/legacy-unlocks.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, type CleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochLegacyActionAdapter, type EpochLegacyActionRequest } from './src/game-shell/cleanEpochLegacyActionAdapter.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const cases: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
const dbName = (label: string) => `lineage.epoch-legacy.qa.${label}.${crypto.randomUUID()}`;
async function test(label: string, run: () => Promise<void>) { await run(); cases.push(label); }
async function seed(owner: CleanEpochAccountStore, points = 100) {
  const accountId = `account.local.${crypto.randomUUID()}`;
  const base = createDefaultAccountProfileState({ accountId, displayName: 'Legacy QA' });
  const grant = grantLegacy(base, { amount: points, summary: 'Synthetic QA grant',
    sourceType: 'qa', sourceId: 'qa.legacy', recordedAt: new Date().toISOString() });
  if (!grant.ok) throw new Error('Synthetic grant failed.');
  await owner.register(grant.profile, await createCredentialRecord(accountId, 'qa-password', new Date().toISOString()));
  return accountId;
}
function purchase(account: NonNullable<Awaited<ReturnType<CleanEpochAccountStore['read']>>>,
  unlockId = 'legacy.unlock.account.starting_hp'): EpochLegacyActionRequest {
  return { accountId: account.accountId, expectedRevision: account.revision, expectedProfile: account.profile,
    action: { kind: 'purchase', unlockId, recordedAt: new Date().toISOString() } };
}
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const startingBundleId = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Legacy QA Heir',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
}
async function suite() {
  await test('purchase commits one accepted cost and exact duplicate reuses retained profile', async () => {
    const owner = await openCleanEpochAccountStore({ name: dbName('purchase') });
    const id = await seed(owner); const before = (await owner.read(id))!;
    const request = purchase(before); const resolver = purchaseLegacyUnlock(before.profile, request.action.unlockId,
      request.action.kind === 'purchase' ? request.action.recordedAt : '');
    check(resolver.ok, 'synthetic purchase ineligible');
    const adapter = new CleanEpochLegacyActionAdapter(owner);
    const first = await adapter.apply(request); const duplicate = await adapter.apply(request);
    check(first.status === 'ready' && first.writeStatus === 'committed' &&
      duplicate.status === 'ready' && duplicate.writeStatus === 'same_source_retry', 'exact replay spent twice or blocked');
    const retained = (await owner.read(id))!;
    check(retained.revision === 2 && resolver.ok && JSON.stringify(retained.profile) === JSON.stringify(resolver.profile) &&
      retained.profile.legacy.legacyTransactions.length === before.profile.legacy.legacyTransactions.length + 1,
      'purchase cost, ledger or exact profile diverged');
    owner.close();
  });
  await test('preparation purchase, selection, choice and removal use revisioned profile writes', async () => {
    const owner = await openCleanEpochAccountStore({ name: dbName('preparation') });
    const id = await seed(owner); const adapter = new CleanEpochLegacyActionAdapter(owner);
    for (const unlockId of ['legacy.unlock.lineage.prepared_lineage', 'legacy.unlock.lineage.prepared_lineage',
      'legacy.unlock.preparation.storehouse_keys',
      'legacy.unlock.preparation.martial_legacy']) {
      const account = (await owner.read(id))!; const result = await adapter.apply(purchase(account, unlockId));
      check(result.status === 'ready', `purchase ${unlockId} failed: ${JSON.stringify(result)}`);
    }
    let account = (await owner.read(id))!;
    const selected = await adapter.apply({ accountId: id, expectedRevision: account.revision,
      expectedProfile: account.profile, action: { kind: 'select', unlockId: 'legacy.unlock.preparation.storehouse_keys' } });
    check(selected.status === 'ready' && selected.account.profile.legacy.selectedPreparationUnlockIds.includes(
      'legacy.unlock.preparation.storehouse_keys'), 'preparation selection missing');
    account = (await owner.read(id))!;
    const choice = await adapter.apply({ accountId: id, expectedRevision: account.revision,
      expectedProfile: account.profile, action: { kind: 'choice',
        unlockId: 'legacy.unlock.preparation.martial_legacy', choiceId: 'STR' } });
    check(choice.status === 'ready' &&
      choice.account.profile.legacy.selectedPreparationChoicePayloads['legacy.unlock.preparation.martial_legacy'] === 'STR',
      'choice not retained');
    account = (await owner.read(id))!;
    const removed = await adapter.apply({ accountId: id, expectedRevision: account.revision,
      expectedProfile: account.profile, action: { kind: 'remove', unlockId: 'legacy.unlock.preparation.storehouse_keys' } });
    check(removed.status === 'ready' && !removed.account.profile.legacy.selectedPreparationUnlockIds.includes(
      'legacy.unlock.preparation.storehouse_keys'), 'removal not retained');
    const noOp = await adapter.apply({ accountId: id, expectedRevision: removed.account.revision,
      expectedProfile: removed.account.profile, action: { kind: 'remove', unlockId: 'legacy.unlock.preparation.storehouse_keys' } });
    check(noOp.status === 'rejected' && (await owner.read(id))!.revision === removed.account.revision,
      'repeated removal advanced revision');
    owner.close();
  });
  await test('stale profile and two owners cannot buy another rank from one captured action', async () => {
    const name = dbName('race'); const left = await openCleanEpochAccountStore({ name });
    const right = await openCleanEpochAccountStore({ name }); const id = await seed(left);
    const before = (await left.read(id))!; const first = purchase(before);
    const second = { ...purchase(before), action: { ...purchase(before).action,
      recordedAt: new Date(Date.now() + 1000).toISOString() } } as EpochLegacyActionRequest;
    const results = await Promise.all([new CleanEpochLegacyActionAdapter(left).apply(first),
      new CleanEpochLegacyActionAdapter(right).apply(second)]);
    check(results.filter(result => result.status === 'ready').length === 1 &&
      results.filter(result => result.status === 'blocked' && result.code === 'stale_head').length === 1,
      'two owners both spent or gave false success');
    const retained = (await left.read(id))!;
    check(retained.revision === before.revision + 1 && retained.profile.legacy.legacyTransactions.length ===
      before.profile.legacy.legacyTransactions.length + 1, 'race spent twice');
    const stale = await new CleanEpochLegacyActionAdapter(right).apply(second);
    check(stale.status === 'blocked' && stale.code === 'stale_head', 'stale action succeeded');
    left.close(); right.close();
  });
  await test('prepared publication fences Legacy and credential changes', async () => {
    const owner = await openCleanEpochAccountStore({ name: dbName('fence') }); const id = await seed(owner);
    const before = (await owner.read(id))!; const prepared = await new CleanEpochFirstCampaignAdapter(owner).prepare(id, form());
    check(prepared.status === 'ready', 'first publication was not prepared');
    const legacy = await new CleanEpochLegacyActionAdapter(owner).apply(purchase(before));
    const password = await new CleanEpochAccountAdapter(owner).changePassword({ accountId: id,
      expectedRevision: before.revision, currentPassword: 'qa-password',
      newPassword: 'new-qa-password', confirmPassword: 'new-qa-password' });
    check(legacy.status === 'blocked' && legacy.code === 'conflict' &&
      password.status === 'blocked' && password.code === 'conflict' &&
      JSON.stringify(await owner.read(id)) === JSON.stringify(before), 'prepared fence lost');
    owner.close();
  });
  await test('accepted campaign receipts and history survive an ordinary Legacy edit', async () => {
    const owner = await openCleanEpochAccountStore({ name: dbName('retention') }); const id = await seed(owner);
    const first = await new CleanEpochFirstCampaignAdapter(owner).start(id, form());
    check(first.status === 'ready', 'first campaign failed');
    const before = (await owner.read(id))!;
    check(before.profile.campaignPublicationReceipts.length > 0, 'first campaign has no receipts');
    const slotBefore = await owner.readSlot(id, 'slot-1');
    const result = await new CleanEpochLegacyActionAdapter(owner).apply(purchase(before));
    check(result.status === 'ready' &&
      JSON.stringify(result.account.profile.campaignPublicationReceipts) ===
        JSON.stringify(before.profile.campaignPublicationReceipts) &&
      JSON.stringify(result.account.profile.history) === JSON.stringify(before.profile.history) &&
      JSON.stringify(result.account.profile.achievements) === JSON.stringify(before.profile.achievements) &&
      JSON.stringify(result.account.profile.estate) === JSON.stringify(before.profile.estate) &&
      JSON.stringify(await owner.readSlot(id, 'slot-1')) === JSON.stringify(slotBefore),
      'Legacy edit changed campaign, history, or account consumers');
    owner.close();
  });
  await test('quota and abort leave exact account unchanged and restart retries once', async () => {
    for (const mode of ['quota', 'aborted'] as const) {
      const name = dbName(mode); let owner = await openCleanEpochAccountStore({ name });
      const id = await seed(owner); const before = (await owner.read(id))!; owner.close();
      owner = await openCleanEpochAccountStore({ name,
        beforeWrite: () => { if (mode === 'quota') throw new DOMException('quota', 'QuotaExceededError'); },
        afterWrite: tx => { if (mode === 'aborted') tx.abort(); } });
      const request = purchase(before); const failed = await new CleanEpochLegacyActionAdapter(owner).apply(request);
      check(failed.status === 'blocked' && failed.code === mode, `${mode} did not block`);
      owner.close(); owner = await openCleanEpochAccountStore({ name });
      check(JSON.stringify(await owner.read(id)) === JSON.stringify(before), `${mode} retained partial write`);
      const retry = await new CleanEpochLegacyActionAdapter(owner).apply(request);
      check(retry.status === 'ready' && retry.writeStatus === 'committed' &&
        (await owner.read(id))?.revision === before.revision + 1, `${mode} retry failed`);
      owner.close();
    }
  });
}
suite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join('\n')}`; })
  .catch(error => { output.textContent = `FAIL after ${cases.length}: ${error instanceof Error ? error.stack : String(error)}`; });
