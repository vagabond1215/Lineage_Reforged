import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { CLEAN_EPOCH_DATABASE_NAME, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#audit')!;
const frameA = document.querySelector<HTMLIFrameElement>('#a')!;
const frameB = document.querySelector<HTMLIFrameElement>('#b')!;
let assertions = 0;
const steps: string[] = [];
const password = 'g10b-disposable-password';
function check(value: unknown, label: string): asserts value { assertions++; if (!value) throw Error(label); }
function step(label: string) { steps.push(label); output.textContent = `RUNNING ${label} (${assertions})`; }
async function until<T>(read: () => T | null, label: string): Promise<T> {
  for (let index = 0; index < 300; index++) {
    const value = read(); if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw Error(`Timed out: ${label}; A=${frameA.contentDocument?.body?.innerText.slice(0,180)}; B=${frameB.contentDocument?.body?.innerText.slice(0,180)}`);
}
function doc(frame: HTMLIFrameElement) { const value = frame.contentDocument; if (!value) throw Error('Frame unavailable'); return value; }
function button(frame: HTMLIFrameElement, label: string): HTMLElement | null {
  return [...doc(frame).querySelectorAll<HTMLElement>('button,[role="button"]')]
    .find(item => item.textContent?.trim() === label || item.getAttribute('aria-label') === label) ?? null;
}
function click(frame: HTMLIFrameElement, label: string) {
  const item = button(frame, label); if (!item) throw Error(`Missing ${label}`); item.click();
}
function fill(frame: HTMLIFrameElement, selector: string, value: string) {
  const target = doc(frame).querySelector<HTMLInputElement>(selector);
  if (!target) throw Error(`Missing ${selector}`);
  const child = frame.contentWindow as Window & typeof globalThis;
  Object.getOwnPropertyDescriptor(child.HTMLInputElement.prototype, 'value')!.set!.call(target, value);
  target.dispatchEvent(new child.Event('input', { bubbles: true }));
}
async function reload(frame: HTMLIFrameElement) {
  const loaded = new Promise<void>(resolve => frame.addEventListener('load', () => resolve(), { once: true }));
  frame.contentWindow!.location.reload(); await loaded;
}
async function accountRows(accountId: string) {
  const request = indexedDB.open(CLEAN_EPOCH_DATABASE_NAME);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
  try {
    const rows: unknown[] = [];
    for (const family of ['accounts', 'accountLifecycle', 'newCampaignAttempts',
      'pendingPublicationRecoveries', 'descendantPublicationRecoveries', 'terminalLifecycleRecoveries',
      'campaignAttemptsV6', 'firstPublicationRecoveriesV6', 'currentSlotGenerations',
      'addressDeletionReceipts', 'artifacts', 'controls', 'slots', 'witnesses']) {
      const request = db.transaction(family).objectStore(family).getAll();
      const values = await new Promise<Record<string, unknown>[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result as Record<string, unknown>[]);
        request.onerror = () => reject(request.error);
      });
      rows.push([family, values.filter(value => value.accountId === accountId)]);
    }
    return JSON.stringify(rows);
  } finally { db.close(); }
}
async function main() {
  step('two independent selected App frames on one disposable origin');
  await until(() => button(frameA, 'Create Account'), 'A account form');
  await until(() => button(frameB, 'Create Account'), 'B account form');
  check(frameA.contentWindow !== frameB.contentWindow &&
    frameA.contentWindow!.location.origin === frameB.contentWindow!.location.origin,
    'simultaneous distinct same-origin browser contexts');
  const displayName = `G10B ${crypto.randomUUID().slice(0, 8)}`;
  fill(frameA, 'input[autocomplete="nickname"]', displayName);
  const passwords = doc(frameA).querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]');
  check(passwords.length === 2, 'selected registration fields');
  const childA = frameA.contentWindow as Window & typeof globalThis;
  for (const field of passwords) {
    Object.getOwnPropertyDescriptor(childA.HTMLInputElement.prototype, 'value')!.set!.call(field, password);
    field.dispatchEvent(new childA.Event('input', { bubbles: true }));
  }
  doc(frameA).querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
  click(frameA, 'Create Account');
  await until(() => button(frameA, '1Empty'), 'A selected empty slot');
  check(doc(frameA).body.innerText.includes('Account Created'), 'selected registration read back to menu');
  await reload(frameB);
  await until(() => button(frameB, '1Empty'), 'B bootstrap same account');
  check(doc(frameB).body.innerText.includes(displayName), 'second context selected epoch account');

  step('ordinary creator, first save, stale second context, manual and quick save');
  click(frameA, '1Empty');
  await until(() => button(frameA, 'Randomize Character'), 'ordinary creator');
  for (let attempt = 0; attempt < 30; attempt++) {
    click(frameA, 'Randomize Character');
    await new Promise(resolve => setTimeout(resolve, 0));
    if ([...doc(frameA).querySelectorAll('button')].some(item => item.textContent?.includes('8Finalize'))) break;
  }
  await until(() => [...doc(frameA).querySelectorAll('button')].find(item => item.textContent?.includes('8Finalize')) ?? null,
    'randomized complete creator');
  [...doc(frameA).querySelectorAll('button')].find(item => item.textContent?.includes('8Finalize'))!.click();
  await until(() => button(frameA, 'Begin Journey'), 'ordinary finalize');
  click(frameA, 'Begin Journey');
  await until(() => doc(frameA).body.innerText.includes('Campaign Ready') ? true : null, 'first selected ready');
  check(!!button(frameB, '1Empty'), 'B retained stale menu projection');
  click(frameB, '1Empty');
  await until(() => doc(frameB).body.innerText.includes('Campaign Ready') ? true : null, 'B reread ready slot');
  click(frameA, 'Open settings');
  await until(() => button(frameA, 'Save'), 'A save control');
  click(frameA, 'Save');
  await until(() => doc(frameA).body.innerText.includes('Game Data Saved') ? true : null, 'A manual save readback');
  click(frameB, 'Open settings');
  await until(() => button(frameB, 'Save'), 'B stale save control');
  click(frameB, 'Save');
  await until(() => button(frameB, 'Retry campaign data'), 'B stale head blocked');
  check(doc(frameB).body.innerText.includes('account revision changed'), 'stale second context rejected visibly');
  click(frameA, 'Quick Save');
  await until(() => doc(frameA).body.innerText.includes('Saved to Quick Save'), 'quick cross-slot readback');
  click(frameB, 'Retry campaign data');
  await until(() => doc(frameB).body.innerText.includes('Quick Save') ? true : null, 'B current inventory after Retry');

  step('selected publication quota and aborted transaction retain last accepted head');
  const ownerBeforeFault = await openCleanEpochAccountStore();
  const accountId = (await ownerBeforeFault.list()).find(account => account.profile.displayName === displayName)?.accountId;
  const slotBeforeFault = accountId ? await ownerBeforeFault.readSlot(accountId, 'slot-1') : null;
  const quickBeforeFault = accountId ? await ownerBeforeFault.readSlot(accountId, 'quick-save') : null;
  ownerBeforeFault.close();
  check(!!accountId, 'ordinary account read back before fault');
  check(slotBeforeFault?.status === 'ready' && quickBeforeFault?.status === 'ready', 'both accepted addresses before faults');
  const retainedBefore = JSON.stringify([slotBeforeFault, quickBeforeFault]);
  async function acceptedAddresses() {
    const owner = await openCleanEpochAccountStore();
    try { return JSON.stringify([await owner.readSlot(accountId, 'slot-1'), await owner.readSlot(accountId, 'quick-save')]); }
    finally { owner.close(); }
  }
  const frameFactory = childA.IDBObjectStore.prototype;
  const originalPut = frameFactory.put;
  let fault: 'quota' | 'abort' | null = 'quota';
  frameFactory.put = function(value: unknown, key?: IDBValidKey) {
    if (fault && this.name === 'artifacts') {
      const selected = fault; fault = null;
      if (selected === 'quota') throw new DOMException('G10B synthetic quota', 'QuotaExceededError');
      const request = key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
      queueMicrotask(() => { try { this.transaction.abort(); } catch { /* already settled */ } });
      return request;
    }
    return key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
  };
  click(frameA, 'Save');
  await until(() => button(frameA, 'Retry campaign data'), 'quota blocked selected App');
  check(doc(frameA).body.innerText.includes('Campaign store quota exceeded') && await acceptedAddresses() === retainedBefore,
    'quota block visible and both accepted addresses unchanged');
  frameFactory.put = originalPut;
  click(frameA, 'Retry campaign data');
  await until(() => doc(frameA).body.innerText.includes('Quick Save') ? true : null, 'quota Retry current menu');
  const readyRow = doc(frameA).querySelector<HTMLElement>('.launcher-save-row');
  check(!!readyRow, 'accepted slot remains listed after quota');
  readyRow.click();
  await until(() => button(frameA, 'Open settings'), 'reloaded accepted head after quota');
  click(frameA, 'Open settings');
  await until(() => button(frameA, 'Save'), 'reloaded save control');
  fault = 'abort';
  frameFactory.put = function(value: unknown, key?: IDBValidKey) {
    if (fault && this.name === 'artifacts') {
      fault = null;
      const request = key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
      queueMicrotask(() => { try { this.transaction.abort(); } catch { /* already settled */ } });
      return request;
    }
    return key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
  };
  click(frameA, 'Save');
  await until(() => button(frameA, 'Retry campaign data'), 'abort blocked selected App');
  check(await acceptedAddresses() === retainedBefore, 'aborted write retained both exact last accepted addresses');
  frameFactory.put = originalPut;
  click(frameA, 'Retry campaign data');
  await until(() => doc(frameA).body.innerText.includes('Quick Save') ? true : null, 'abort Retry current menu');

  step('other account and old namespace writer cannot alter epoch rows');
  const owner = await openCleanEpochAccountStore();
  const otherId = `account.local.g10b.other.${crypto.randomUUID()}`;
  try {
    const isolatedHint = new Map<string, string>();
    const hintStorage = { getItem: (key: string) => isolatedHint.get(key) ?? null,
      setItem: (key: string, value: string) => { isolatedHint.set(key, value); },
      removeItem: (key: string) => { isolatedHint.delete(key); } } as Storage;
    const other = await new CleanEpochAccountAdapter(owner, hintStorage).register({ accountId: otherId,
      displayName: 'G10B stable other', password, confirmPassword: password, stayLoggedIn: false });
    check(other.status === 'ready', 'second epoch account registered');
    const before = await accountRows(otherId);
    const selectedId = accountId;
    const selectedBefore = await accountRows(selectedId);
    localStorage.setItem('cataclysm-rpg-ui.auth.v1', 'obsolete writer');
    localStorage.setItem('cataclysm-rpg-ui.accounts.v1', 'obsolete writer');
    localStorage.setItem('cataclysm-rpg-ui.saves.v7', 'obsolete writer');
    localStorage.setItem('cataclysm-rpg-ui.new-campaign-attempts.v1', 'obsolete writer');
    const oldOpen = indexedDB.open('lineage.campaigns', 3);
    oldOpen.onupgradeneeded = () => oldOpen.result.createObjectStore('legacyCopyRecords', { keyPath: 'id' });
    const oldDb = await new Promise<IDBDatabase>((resolve, reject) => {
      oldOpen.onsuccess = () => resolve(oldOpen.result); oldOpen.onerror = () => reject(oldOpen.error);
    });
    const oldWrite = oldDb.transaction('legacyCopyRecords', 'readwrite');
    oldWrite.objectStore('legacyCopyRecords').put({ id: `obsolete.${crypto.randomUUID()}`, accountId: selectedId });
    await new Promise<void>((resolve, reject) => {
      oldWrite.oncomplete = () => resolve(); oldWrite.onabort = () => reject(oldWrite.error);
    });
    oldDb.close();
    check(await accountRows(selectedId) === selectedBefore, 'old namespace writes left selected epoch graph bytes fixed');
    check(await accountRows(otherId) === before, 'old namespace writes left another account bytes fixed');
    await reload(frameB);
    await until(() => doc(frameB).body.innerText.includes(displayName) ? true : null, 'restart ignored old writer and selected epoch');
    check(await accountRows(otherId) === before, 'another account byte stable after selected restart');
  } finally { owner.close(); }
}
main().then(() => output.textContent = `PASS ${assertions} assertions\n${steps.join('\n')}`)
  .catch(error => output.textContent = `FAIL ${assertions}: ${error instanceof Error ? error.stack : error}\n${steps.join('\n')}`);
