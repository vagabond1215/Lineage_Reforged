import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, accountLifecycleGeneration } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochLegacyActionAdapter } from './src/game-shell/cleanEpochLegacyActionAdapter.ts';
import { grantLegacy } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { resolveLegacyPreparationSelection } from '../../packages/engines/game-engine/src/legacy-unlocks.ts';

const out = document.querySelector<HTMLPreElement>('#audit')!;
let assertions = 0;
const steps: string[] = [];
function check(value: unknown, label: string): asserts value { assertions++; if (!value) throw Error(label); }
function step(label: string) { steps.push(label); out.textContent = `RUNNING ${label} (${assertions})`; }
const name = `lineage.g9.completion.account.${crypto.randomUUID()}`;
const id = `account.local.g9.completion.account.${crypto.randomUUID()}`;
const password = 'synthetic-account-audit-password';
const changedPassword = 'synthetic-account-audit-new-password';
async function main() {
  const owner = await openCleanEpochAccountStore({ name });
  try {
    const hint = new Map<string,string>();
    const storage = { getItem: (key: string) => hint.get(key) ?? null,
      setItem: (key: string, value: string) => { hint.set(key, value); },
      removeItem: (key: string) => { hint.delete(key); }, clear: () => hint.clear(),
      key: (index: number) => Array.from(hint.keys())[index] ?? null,
      get length() { return hint.size; } } as Storage;
    const accounts = new CleanEpochAccountAdapter(owner, storage);
    const otherId = `account.local.g9.completion.other.${crypto.randomUUID()}`;
    const other = await accounts.register({ accountId: otherId, displayName: 'Other synthetic account',
      password, confirmPassword: password, stayLoggedIn: false });
    check(other.status === 'ready', 'other account setup');
    const otherBefore = JSON.stringify(await owner.read(otherId));
    step('register, display profile CAS and credential readback');
    const registered = await accounts.register({ accountId: id, displayName: 'Synthetic account',
      password, confirmPassword: password, stayLoggedIn: true });
    check(registered.status === 'ready', 'registration');
    if (registered.status !== 'ready') return;
    const originalSession = registered.value.session;
    const first = registered.value.account;
    const display = { ...first.profile, displayName: 'Updated synthetic account', updatedAt: new Date().toISOString() };
    const profile = await accounts.updateProfile(id, first.revision, display);
    check(profile.status === 'ready' && profile.value.revision === first.revision + 1, 'profile CAS');
    check((await owner.readSelected(id))?.profile.displayName === display.displayName, 'profile readback');
    const staleProfile = await accounts.updateProfile(id, first.revision, first.profile);
    check(staleProfile.status === 'blocked' && staleProfile.code === 'stale_head', 'stale profile revision');
    if (profile.status !== 'ready') return;
    const changed = await accounts.changePassword({ accountId: id, expectedRevision: profile.value.revision,
      currentPassword: password, newPassword: changedPassword, confirmPassword: changedPassword });
    check(changed.status === 'ready', 'credential CAS');
    if (changed.status !== 'ready') return;
    check((await accounts.signIn({ accountId: id, password, stayLoggedIn: false })).status === 'blocked', 'old password blocked');
    check((await accounts.signIn({ accountId: id, password: changedPassword, stayLoggedIn: true })).status === 'ready', 'new password accepted');
    check((await accounts.validateSession(originalSession)).accountId === id, 'same-generation session valid after credential change');
    const staleCredential = await accounts.changePassword({ accountId: id, expectedRevision: profile.value.revision,
      currentPassword: password, newPassword: 'irrelevant', confirmPassword: 'irrelevant' });
    check(staleCredential.status === 'blocked' && staleCredential.code === 'stale_head', 'stale credential revision');
    step('Legacy grant, purchase, preparation and exact retry');
    const earned = grantLegacy(changed.value.profile, { amount: 12, summary: 'Synthetic Legacy grant',
      sourceType: 'synthetic_audit', sourceId: 'dev-0.7.1.12', recordedAt: new Date().toISOString() });
    check(earned.ok, 'production Legacy grant resolver');
    if (!earned.ok) return;
    const grant = await accounts.updateProfile(id, changed.value.revision, earned.profile);
    check(grant.status === 'ready', 'grant account CAS');
    if (grant.status !== 'ready') return;
    const legacy = new CleanEpochLegacyActionAdapter(owner);
    const buyPrepared = { accountId: id, expectedRevision: grant.value.revision, expectedProfile: grant.value.profile,
      action: { kind: 'purchase' as const, unlockId: 'legacy.unlock.lineage.prepared_lineage', recordedAt: new Date().toISOString() } };
    const purchased = await legacy.apply(buyPrepared);
    check(purchased.status === 'ready' && purchased.writeStatus === 'committed', 'prepared lineage purchase');
    if (purchased.status !== 'ready') return;
    check(purchased.account.profile.legacy.legacyPoints === grant.value.profile.legacy.legacyPoints - 4, 'single exact cost');
    const buyRetryOwner = await openCleanEpochAccountStore({ name });
    const buyRetry = await new CleanEpochLegacyActionAdapter(buyRetryOwner).apply(buyPrepared);
    buyRetryOwner.close();
    check(buyRetry.status === 'ready' && buyRetry.writeStatus === 'same_source_retry', 'restart purchase exact retry');
    const staleBuy = await legacy.apply({ ...buyPrepared, action: { ...buyPrepared.action, unlockId: 'legacy.unlock.account.starting_hp' } });
    check(staleBuy.status === 'blocked', 'changed two-owner stale purchase');
    const buyKeys = { accountId: id, expectedRevision: purchased.account.revision, expectedProfile: purchased.account.profile,
      action: { kind: 'purchase' as const, unlockId: 'legacy.unlock.preparation.storehouse_keys', recordedAt: new Date().toISOString() } };
    const keys = await legacy.apply(buyKeys);
    check(keys.status === 'ready', 'preparation purchase');
    if (keys.status !== 'ready') return;
    check(keys.account.profile.legacy.legacyPoints === purchased.account.profile.legacy.legacyPoints - 2, 'preparation one cost');
    const selection = { accountId: id, expectedRevision: keys.account.revision, expectedProfile: keys.account.profile,
      action: { kind: 'select' as const, unlockId: 'legacy.unlock.preparation.storehouse_keys' } };
    const selected = await legacy.apply(selection);
    check(selected.status === 'ready', 'preparation selection');
    if (selected.status !== 'ready') return;
    check(resolveLegacyPreparationSelection(selected.account.profile).selectedUnlockIds.includes(selection.action.unlockId),
      'selected preparation resolved');
    check(JSON.stringify((await owner.readSelected(id))?.profile) === JSON.stringify(selected.account.profile), 'Legacy durable readback');
    const selectionRetryOwner = await openCleanEpochAccountStore({ name });
    const retrySelection = await new CleanEpochLegacyActionAdapter(selectionRetryOwner).apply(selection);
    selectionRetryOwner.close();
    check(retrySelection.status === 'ready' && retrySelection.writeStatus === 'same_source_retry', 'selection restart exact retry');
    check(JSON.stringify(await owner.read(otherId)) === otherBefore, 'other account stable');
    step('reset generation, session and exact receipt fences');
    const prior = await owner.readSelected(id);
    check(!!prior, 'reset source selected');
    const generation = accountLifecycleGeneration(prior);
    const resetInput = { accountId: id, expectedRevision: prior.revision,
      expectedGeneration: generation, password: changedPassword, stayLoggedIn: true };
    const reset = await accounts.resetAccount(resetInput);
    check(reset.status === 'ready', 'account reset committed');
    if (reset.status !== 'ready') return;
    check(reset.value.account.revision === prior.revision + 1 &&
      accountLifecycleGeneration(reset.value.account) === generation + 1, 'reset readback revision/generation');
    let staleSession = false;
    try { await accounts.validateSession(originalSession); } catch { staleSession = true; }
    check(staleSession, 'old live session generation fenced');
    const oldIdentity = await accounts.register({ accountId: id, displayName: first.profile.displayName,
      password, confirmPassword: password, stayLoggedIn: false });
    check(oldIdentity.status === 'blocked', 'stale same-ID registration blocked after reset');
    const resetRetryOwner = await openCleanEpochAccountStore({ name });
    const resetRetry = await new CleanEpochAccountAdapter(resetRetryOwner, storage).resetAccount(resetInput);
    resetRetryOwner.close();
    check(resetRetry.status === 'ready' && resetRetry.value.account.revision === reset.value.account.revision,
      'reset exact restarted retry readback');
    step('delete version-2 request, changed request and stale reentry');
    const deletionId = crypto.randomUUID();
    const deleteInput = { accountId: id, expectedRevision: reset.value.account.revision,
      expectedGeneration: accountLifecycleGeneration(reset.value.account), password: changedPassword,
      requestId: deletionId };
    const deleted = await accounts.deleteAccount(deleteInput);
    check(deleted.status === 'ready' && await owner.read(id) === null, 'account deletion committed');
    const tombstone = await owner.readLifecycleReceipt(id);
    check(tombstone?.kind === 'delete' && tombstone.version === 2 && tombstone.requestId === deletionId,
      'exact version-2 tombstone readback');
    const deleteRetryOwner = await openCleanEpochAccountStore({ name });
    const deleteRetry = await new CleanEpochAccountAdapter(deleteRetryOwner, storage).deleteAccount(deleteInput);
    deleteRetryOwner.close();
    check(deleteRetry.status === 'ready', 'exact delete restarted two-owner retry');
    const changedDelete = await accounts.deleteAccount({ ...deleteInput, requestId: crypto.randomUUID() });
    check(changedDelete.status === 'blocked' && changedDelete.code === 'stale_head', 'changed delete request refused');
    const reentry = await accounts.register({ accountId: id, displayName: display.displayName,
      password: changedPassword, confirmPassword: changedPassword, stayLoggedIn: false });
    check(reentry.status === 'blocked', 'deleted same-ID reentry refused');
    check((await accounts.selectSession()).status === 'ready', 'deleted selected hint cleared');
    check(JSON.stringify(await owner.read(otherId)) === otherBefore, 'other account survived reset/delete');
  } finally { owner.close(); }
}
main().then(() => out.textContent = `PASS ${assertions} independent assertions\n${steps.join('\n')}`)
  .catch(error => out.textContent = `FAIL ${assertions} assertions: ${error instanceof Error ? error.stack : error}\n${steps.join('\n')}`);
