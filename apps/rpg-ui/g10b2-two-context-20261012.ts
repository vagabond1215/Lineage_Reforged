import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#audit')!;
const a = document.querySelector<HTMLIFrameElement>('#a')!;
const b = document.querySelector<HTMLIFrameElement>('#b')!;
const password = 'g10b2-disposable-password';
let assertions = 0;
const steps: string[] = [];
function check(value: unknown, label: string): asserts value { assertions++; if (!value) throw Error(label); }
function step(label: string) { steps.push(label); output.textContent = `RUNNING ${label} (${assertions})`; }
async function until<T>(read: () => T | null, label: string): Promise<T> {
  for (let index = 0; index < 500; index++) {
    const value = read(); if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw Error(`Timed out: ${label}; A=${a.contentDocument?.body?.innerText.slice(0,160)}; B=${b.contentDocument?.body?.innerText.slice(0,160)}`);
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
function probe(frame: HTMLIFrameElement) {
  return (frame.contentWindow as Window & { g10b2: { faults: { first: boolean; descendant: boolean; lost: boolean };
    events: Array<Record<string, unknown>> } }).g10b2;
}
async function selected(accountName: string) {
  const owner = await openCleanEpochAccountStore();
  try {
    const account = (await owner.list()).find(item => item.profile.displayName === accountName);
    if (!account) throw Error('Test account absent');
    return { accountId: account.accountId, revision: account.revision,
      generation: account.lifecycleGeneration, slot: await owner.readSlot(account.accountId, 'slot-1'),
      first: await owner.readRecovery(account.accountId, 'slot-1'),
      descendant: await owner.readCurrentDescendantRecovery(account.accountId, 'slot-1') };
  } finally { owner.close(); }
}
function readyIdentity(read: Awaited<ReturnType<typeof selected>>) {
  if (read.slot.status !== 'ready') return null;
  const control = read.slot.loaded.sessionControl;
  return { artifactId: control.loadedArtifactId, publicationId: control.loadedPublicationId,
    headRevision: control.campaignHeadRevision };
}
async function loadReady(frame: HTMLIFrameElement) {
  const row = await until(() => doc(frame).querySelector<HTMLElement>('.launcher-save-row'), 'ready launcher row');
  row.click();
  await until(() => button(frame, 'Open settings'), 'selected in-game shell');
  click(frame, 'Open settings');
  await until(() => button(frame, 'Save'), 'selected save control');
}
async function main() {
  step('independent same-origin selected contexts and first pending publication');
  await until(() => button(a, 'Create Account') && button(b, 'Create Account') ? true : null, 'both selected account forms');
  check(a.contentWindow !== b.contentWindow && a.contentWindow!.location.origin === b.contentWindow!.location.origin,
    'two simultaneous distinct selected JavaScript realms');
  const name = `G10B2 pending ${crypto.randomUUID().slice(0, 8)}`;
  fill(a, 'input[autocomplete="nickname"]', name);
  for (const input of doc(a).querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]')) {
    const child = a.contentWindow as Window & typeof globalThis;
    Object.getOwnPropertyDescriptor(child.HTMLInputElement.prototype, 'value')!.set!.call(input, password);
    input.dispatchEvent(new child.Event('input', { bubbles: true }));
  }
  doc(a).querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
  click(a, 'Create Account');
  await until(() => button(a, '1Empty'), 'A account menu');
  await reload(b);
  await until(() => button(b, '1Empty'), 'B account menu');
  check(doc(b).body.innerText.includes(name), 'B selected same account');
  click(a, '1Empty');
  await until(() => button(a, 'Randomize Character'), 'A creator');
  for (let index = 0; index < 40; index++) {
    click(a, 'Randomize Character');
    await new Promise(resolve => setTimeout(resolve, 0));
    if ([...doc(a).querySelectorAll('button')].some(item => item.textContent?.includes('8Finalize'))) break;
  }
  const final = await until(() => [...doc(a).querySelectorAll<HTMLButtonElement>('button')]
    .find(item => item.textContent?.includes('8Finalize')) ?? null, 'complete ordinary creator');
  final.click();
  await until(() => button(a, 'Begin Journey'), 'A Finalize');
  probe(a).faults.first = true;
  click(a, 'Begin Journey');
  await until(() => button(a, 'Retry campaign data'), 'A first pending blocked');
  check(probe(a).events.some(item => item.kind === 'first_consumer_interrupt'), 'fault struck after selected first publication');
  const firstPending = await selected(name);
  check(firstPending.first?.status === 'accepted_pending_consumers', 'first accepted pending retained');
  check(firstPending.slot.status === 'pending_consumers', 'first slot pending before B completion');
  await reload(b);
  await until(() => doc(b).body.innerText.includes(name) && !!doc(b).querySelector('.launcher-save-row') ? true : null,
    'B independently completed pending first on restart');
  const firstReady = await selected(name);
  const firstId = readyIdentity(firstReady);
  check(!!firstId && firstReady.first?.status !== 'accepted_pending_consumers', 'first exact ready after B completion');
  click(a, 'Retry campaign data');
  await until(() => doc(a).querySelector('.launcher-save-row') ? true : null, 'A Retry reads same first address');
  check(JSON.stringify(readyIdentity(await selected(name))) === JSON.stringify(firstId), 'A Retry does not mint first head');

  step('descendant pending, competing context and exact recovery');
  await loadReady(a);
  await loadReady(b);
  probe(a).faults.descendant = true;
  click(a, 'Save');
  await until(() => button(a, 'Retry campaign data'), 'A descendant pending blocked');
  check(probe(a).events.some(item => item.kind === 'descendant_consumer_interrupt'), 'fault struck after selected descendant publication');
  const descendantPending = await selected(name);
  check(descendantPending.descendant?.status === 'accepted_pending_consumers', 'descendant accepted pending retained');
  check(descendantPending.slot.status === 'pending_consumers', 'descendant destination pending before completion');
  click(b, 'Save');
  await until(() => button(b, 'Retry campaign data'), 'B contender blocked by pending authority');
  check((await selected(name)).descendant?.publicationId === descendantPending.descendant?.publicationId,
    'contender left exact pending publication untouched');
  click(b, 'Retry campaign data');
  await until(() => doc(b).querySelector('.launcher-save-row') ? true : null, 'B Retry completed pending descendant');
  const descendantReady = await selected(name);
  const descendantId = readyIdentity(descendantReady);
  check(!!descendantId && descendantId.artifactId !== firstId!.artifactId &&
    descendantId.publicationId === descendantPending.descendant?.publicationId,
    'B Retry read exact pending descendant');
  click(a, 'Retry campaign data');
  await until(() => doc(a).querySelector('.launcher-save-row') ? true : null, 'A Retry reads completed descendant');
  check(JSON.stringify(readyIdentity(await selected(name))) === JSON.stringify(descendantId),
    'two-context Retry did not mint another descendant');

  step('post-commit lost save acknowledgement and retry identity');
  await loadReady(a);
  await loadReady(b);
  probe(a).faults.lost = true;
  click(a, 'Save');
  await until(() => button(a, 'Retry campaign data'), 'A lost post-commit acknowledgement blocked');
  const lostEvent = probe(a).events.find(item => item.kind === 'lost_post_commit_acknowledgement');
  check(!!lostEvent, 'selected adapter completed publication before acknowledgement was lost');
  const committed = await selected(name);
  const committedId = readyIdentity(committed);
  check(!!committedId && committedId.artifactId === lostEvent.artifactId &&
    committedId.publicationId === lostEvent.publicationId, 'exact committed head survived lost acknowledgement');
  click(b, 'Save');
  await until(() => button(b, 'Retry campaign data'), 'B stale contender blocked');
  check(JSON.stringify(readyIdentity(await selected(name))) === JSON.stringify(committedId),
    'stale B could not replace newer accepted head');
  click(a, 'Retry campaign data');
  await until(() => doc(a).querySelector('.launcher-save-row') ? true : null, 'A Retry rereads committed address');
  check(JSON.stringify(readyIdentity(await selected(name))) === JSON.stringify(committedId),
    'A Retry returned the exact post-commit head without another publication');
  await reload(a);
  await until(() => doc(a).querySelector('.launcher-save-row') ? true : null, 'A restart reads committed address');
  check(JSON.stringify(readyIdentity(await selected(name))) === JSON.stringify(committedId),
    'restart did not mint another head');
  await loadReady(a);
  click(a, 'Save');
  await until(() => doc(a).body.innerText.includes('Game Data Saved') ? true : null, 'second same-content Save completed');
  const second = readyIdentity(await selected(name));
  check(!!second, 'second Save has durable readback');
  steps.push(`LOST_ACK_HEAD ${JSON.stringify(committedId)} SECOND_CLICK_HEAD ${JSON.stringify(second)}`);
  const sameCommittedHead = JSON.stringify(second) === JSON.stringify(committedId);
  steps.push(sameCommittedHead
    ? 'L1 exact second submission retained committed head'
    : 'L1 BLOCKER: unchanged selected Save after restart minted a distinct artifact/publication/head');
  steps.push(`ACCOUNT ${name} ${committed.accountId} generation=${committed.generation} revision=${committed.revision}`);
  return sameCommittedHead;
}
main().then(sameCommittedHead => output.textContent = `${sameCommittedHead ? 'PASS' : 'L1 FAIL'} ${assertions} supporting assertions\n${steps.join('\n')}`)
  .catch(error => output.textContent = `FAIL ${assertions}: ${error instanceof Error ? error.stack : error}\n${steps.join('\n')}`);
