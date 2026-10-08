import { createRoot } from 'react-dom/client';
import { EpochApp } from './src/EpochApp.tsx';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, accountLifecycleGeneration } from './src/game-shell/cleanEpochAccountStore.ts';

const report = document.querySelector<HTMLPreElement>('#audit')!;
const target = document.querySelector<HTMLDivElement>('#app')!;
const password = 'synthetic-selected-audit-password';
let assertions = 0;
const steps: string[] = [];
function check(value: unknown, label: string): asserts value { assertions++; if (!value) throw Error(label); }
function step(label: string) { steps.push(label); report.textContent = `RUNNING ${label} (${assertions})`; }
async function until<T>(read: () => T | null, label: string): Promise<T> {
  for (let index = 0; index < 240; index++) {
    const value = read(); if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw Error(`Timed out: ${label}; ${target.innerText.slice(-500)}`);
}
function button(label: string): HTMLButtonElement | null {
  return Array.from(target.querySelectorAll('button')).find(item => item.textContent?.trim() === label) ?? null;
}
function fill(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
async function account(stayLoggedIn: boolean) {
  const owner = await openCleanEpochAccountStore();
  const id = `account.local.g9.completion.selected.${crypto.randomUUID()}`;
  const registered = await new CleanEpochAccountAdapter(owner).register({ accountId: id,
    displayName: `DEV12 selected ${id.slice(-8)}`, password, confirmPassword: password, stayLoggedIn });
  check(registered.status === 'ready', 'selected account registered');
  owner.close();
  return { id, displayName: registered.status === 'ready' ? registered.value.account.profile.displayName : '' };
}
async function readReceipt(id: string) {
  const owner = await openCleanEpochAccountStore();
  try { return await owner.readLifecycleReceipt(id); }
  finally { owner.close(); }
}
async function absentAccount(id: string) {
  const owner = await openCleanEpochAccountStore();
  try { return (await owner.read(id)) === null; }
  finally { owner.close(); }
}
async function mountSettings(displayName: string) {
  const root = createRoot(target);
  root.render(<EpochApp />);
  await until(() => button('Settings'), 'selected launcher Settings');
  check(target.innerText.includes(displayName), 'selected account mounted');
  button('Settings')!.click();
  await until(() => button('Delete Account'), 'selected Settings delete');
  button('Delete Account')!.click();
  const input = await until(() => target.querySelector<HTMLInputElement>('input[placeholder="Account password"]'), 'Settings password field');
  fill(input, password);
  await new Promise(resolve => setTimeout(resolve, 0));
  return root;
}
async function submit() {
  const matches = Array.from(target.querySelectorAll('button')).filter(item => item.textContent?.trim() === 'Delete Account');
  check(matches.length >= 2, 'Settings deletion action is open');
  matches.at(-1)!.click();
}
async function mountPicker(displayName: string) {
  const root = createRoot(target);
  root.render(<EpochApp />);
  const entry = await until(() => Array.from(target.querySelectorAll('button')).find(item =>
    item.textContent?.trim().startsWith(displayName)) ?? null, 'selected account picker');
  entry.click();
  const field = await until(() => target.querySelector<HTMLInputElement>('input[autocomplete="current-password"]'), 'picker password field');
  fill(field, password);
  await new Promise(resolve => setTimeout(resolve, 0));
  return root;
}
async function submitPicker() {
  const action = await until(() => button('Delete Account'), 'picker delete action');
  action.click();
}
async function main() {
  const original = CleanEpochAccountAdapter.prototype.deleteAccount;
  const observed: Array<{ accountId: string; requestId: string }> = [];
  let behavior: 'lost' | 'blocked' | 'actual' = 'actual';
  CleanEpochAccountAdapter.prototype.deleteAccount = async function(input) {
    observed.push({ accountId: input.accountId, requestId: input.requestId });
    if (behavior === 'blocked') return { status: 'blocked', code: 'unavailable', message: 'Synthetic precommit interruption' };
    const result = await original.call(this, input);
    if (behavior === 'lost' && result.status === 'ready') {
      behavior = 'actual';
      return { status: 'blocked', code: 'readback_failed', message: 'Synthetic lost post-commit acknowledgement' };
    }
    return result;
  };
  try {
    step('mounted selected Settings unchanged lost-acknowledgement retry');
    const first = await account(true);
    let root = await mountSettings(first.displayName);
    behavior = 'lost';
    await submit();
    await until(() => target.innerText.includes('Synthetic lost post-commit acknowledgement'), 'lost acknowledgement surfaced');
    const firstRequest = observed.at(-1)?.requestId;
    check(!!firstRequest && await absentAccount(first.id), 'first selected delete committed');
    await submit();
    await until(() => target.innerText.includes('Account Login'), 'selected exact retry returned picker');
    check(observed.at(-1)?.requestId === firstRequest, 'unchanged selected action retained exact request ID');
    root.unmount(); target.replaceChildren();

    step('mounted selected Settings changed intent and competing tombstone');
    const changed = await account(true);
    root = await mountSettings(changed.displayName);
    behavior = 'blocked';
    await submit();
    await until(() => target.innerText.includes('Synthetic precommit interruption'), 'first precommit refusal surfaced');
    const oldRequest = observed.at(-1)?.requestId;
    button('Cancel')!.click();
    button('Delete Account')!.click();
    fill(await until(() => target.querySelector<HTMLInputElement>('input[placeholder="Account password"]'), 'new Settings intent'), password);
    await new Promise(resolve => setTimeout(resolve, 0));
    await submit();
    await until(() => observed.length >= 4 ? true : null, 'changed intent submission');
    check(observed.at(-1)?.requestId !== oldRequest, 'abandoned Settings action minted new request ID');
    root.unmount(); target.replaceChildren();

    step('changed Settings action after committed lost acknowledgement cannot claim old tombstone');
    const changedAfterCommit = await account(true);
    root = await mountSettings(changedAfterCommit.displayName);
    behavior = 'lost';
    await submit();
    await until(() => target.innerText.includes('Synthetic lost post-commit acknowledgement'), 'changed Settings committed source');
    const committedSettingsId = observed.at(-1)?.requestId;
    button('Cancel')!.click(); button('Delete Account')!.click();
    fill(await until(() => target.querySelector<HTMLInputElement>('input[placeholder="Account password"]'), 'reopened Settings action'), password);
    await new Promise(resolve => setTimeout(resolve, 0));
    await submit();
    await until(() => target.innerText.includes('Account changed before deletion'), 'changed Settings tombstone refusal');
    check(observed.at(-1)?.requestId !== committedSettingsId, 'changed Settings request after commit differs');
    check((await readReceipt(changedAfterCommit.id))?.requestId === committedSettingsId,
      'Settings changed action preserved original tombstone');
    root.unmount(); target.replaceChildren();

    step('unsubmitted selected Settings action cannot claim competing owner tombstone');
    const contested = await account(true);
    root = await mountSettings(contested.displayName);
    const other = await openCleanEpochAccountStore();
    const source = await other.readSelected(contested.id);
    check(!!source, 'competing source exists');
    const competitorId = crypto.randomUUID();
    const winner = await original.call(new CleanEpochAccountAdapter(other), { accountId: contested.id,
      expectedRevision: source.revision, expectedGeneration: accountLifecycleGeneration(source), password,
      requestId: competitorId });
    check(winner.status === 'ready', `competing owner committed tombstone ${JSON.stringify(winner)}`);
    behavior = 'actual';
    await submit();
    await until(() => target.innerText.includes('Account changed before deletion'), 'unsubmitted selected action refused');
    check(observed.at(-1)?.requestId !== competitorId, 'selected action could not claim competitor identity');
    const receipt = await other.readLifecycleReceipt(contested.id);
    check(receipt?.kind === 'delete' && receipt.requestId === competitorId, 'competing tombstone unchanged');
    other.close(); root.unmount(); target.replaceChildren();

    step('mounted selected picker exact retry, changed intent and competing tombstone');
    const pickerRetry = await account(false);
    root = await mountPicker(pickerRetry.displayName);
    behavior = 'lost';
    await submitPicker();
    await until(() => target.innerText.includes('Synthetic lost post-commit acknowledgement'), 'picker lost acknowledgement');
    const pickerRequest = observed.at(-1)?.requestId;
    check(!!pickerRequest, 'picker retained request captured');
    await submitPicker();
    await until(() => !Array.from(target.querySelectorAll('button')).some(item =>
      item.textContent?.trim().startsWith(pickerRetry.displayName)) ? true : null, 'picker exact retry completion');
    check(observed.at(-1)?.requestId === pickerRequest, 'picker unchanged retry kept exact request ID');
    root.unmount(); target.replaceChildren();

    const pickerChanged = await account(false);
    root = await mountPicker(pickerChanged.displayName);
    behavior = 'blocked';
    await submitPicker();
    await until(() => target.innerText.includes('Synthetic precommit interruption'), 'picker precommit refusal');
    const pickerOld = observed.at(-1)?.requestId;
    const field = target.querySelector<HTMLInputElement>('input[autocomplete="current-password"]')!;
    fill(field, password + 'x');
    fill(field, password);
    await new Promise(resolve => setTimeout(resolve, 0));
    await submitPicker();
    await until(() => observed.at(-1)?.requestId !== pickerOld ? true : null, 'picker changed request');
    check(observed.at(-1)?.requestId !== pickerOld, 'picker material password edit minted new request ID');
    root.unmount(); target.replaceChildren();

    step('changed picker selection after committed lost acknowledgement cannot claim old tombstone');
    const pickerCommitted = await account(false);
    const pickerOther = await account(false);
    root = await mountPicker(pickerCommitted.displayName);
    behavior = 'lost';
    await submitPicker();
    await until(() => target.innerText.includes('Synthetic lost post-commit acknowledgement'), 'picker changed committed source');
    const committedPickerId = observed.at(-1)?.requestId;
    const otherEntry = Array.from(target.querySelectorAll('button')).find(item =>
      item.textContent?.trim().startsWith(pickerOther.displayName));
    check(!!otherEntry, 'picker second account visible');
    otherEntry.click();
    const returnEntry = await until(() => Array.from(target.querySelectorAll('button')).find(item =>
      item.textContent?.trim().startsWith(pickerCommitted.displayName)) ?? null, 'picker return entry');
    returnEntry.click();
    fill(await until(() => target.querySelector<HTMLInputElement>('input[autocomplete="current-password"]'), 'picker returned password'), password);
    await new Promise(resolve => setTimeout(resolve, 0));
    await submitPicker();
    await until(() => target.innerText.includes('Account changed before deletion'), 'changed picker tombstone refusal');
    check(observed.at(-1)?.requestId !== committedPickerId, 'changed picker request after commit differs');
    check((await readReceipt(pickerCommitted.id))?.requestId === committedPickerId,
      'picker changed action preserved original tombstone');
    root.unmount(); target.replaceChildren();

    const pickerContest = await account(false);
    root = await mountPicker(pickerContest.displayName);
    const pickerOwner = await openCleanEpochAccountStore();
    const pickerSource = await pickerOwner.readSelected(pickerContest.id);
    check(!!pickerSource, 'picker competing source exists');
    const pickerCompetitorId = crypto.randomUUID();
    const pickerWinner = await original.call(new CleanEpochAccountAdapter(pickerOwner), {
      accountId: pickerContest.id, expectedRevision: pickerSource.revision,
      expectedGeneration: accountLifecycleGeneration(pickerSource), password, requestId: pickerCompetitorId });
    check(pickerWinner.status === 'ready', 'picker competitor committed');
    behavior = 'actual';
    await submitPicker();
    await until(() => target.innerText.includes('Account changed before deletion'), 'unsubmitted picker refused competitor');
    check(observed.at(-1)?.requestId !== pickerCompetitorId, 'picker could not claim competitor identity');
    check((await pickerOwner.readLifecycleReceipt(pickerContest.id))?.requestId === pickerCompetitorId,
      'picker competing tombstone retained');
    pickerOwner.close(); root.unmount();
  } finally { CleanEpochAccountAdapter.prototype.deleteAccount = original; }
}
main().then(() => report.textContent = `PASS ${assertions} independent assertions\n${steps.join('\n')}`)
  .catch(error => report.textContent = `FAIL ${assertions} assertions: ${error instanceof Error ? error.stack : error}\n${steps.join('\n')}`);
