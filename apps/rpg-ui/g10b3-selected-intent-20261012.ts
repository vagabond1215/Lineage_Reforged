import { CLEAN_EPOCH_DATABASE_NAME, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#audit')!;
const a = document.querySelector<HTMLIFrameElement>('#a')!;
const b = document.querySelector<HTMLIFrameElement>('#b')!;
const password = 'g10b3-disposable-password';
let assertions = 0;
const log: string[] = [];
function check(value: unknown, message: string): asserts value {
  assertions++;
  if (!value) throw Error(message);
}
function progress(message: string) {
  log.push(message);
  output.textContent = `RUNNING ${message} (${assertions})`;
}
async function until<T>(read: () => T | null, label: string): Promise<T> {
  for (let i = 0; i < 600; i++) {
    const value = read();
    if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw Error(`Timed out: ${label}; A=${a.contentDocument?.body?.innerText.slice(0, 140)}; B=${b.contentDocument?.body?.innerText.slice(0, 140)}`);
}
function doc(frame: HTMLIFrameElement): Document {
  if (!frame.contentDocument) throw Error('Selected frame unavailable');
  return frame.contentDocument;
}
function button(frame: HTMLIFrameElement, label: string): HTMLButtonElement | null {
  return [...doc(frame).querySelectorAll<HTMLButtonElement>('button')]
    .find(item => item.textContent?.replace(/\s/g, '') === label.replace(/\s/g, '') || item.getAttribute('aria-label') === label) ?? null;
}
function click(frame: HTMLIFrameElement, label: string) {
  const target = button(frame, label);
  if (!target || target.disabled) throw Error(`Selected ${label} control is unavailable`);
  target.click();
}
function fill(frame: HTMLIFrameElement, selector: string, value: string) {
  const target = doc(frame).querySelector<HTMLInputElement>(selector);
  if (!target) throw Error(`Missing ${selector}`);
  const realm = frame.contentWindow as Window & typeof globalThis;
  Object.getOwnPropertyDescriptor(realm.HTMLInputElement.prototype, 'value')!.set!.call(target, value);
  target.dispatchEvent(new realm.Event('input', { bubbles: true }));
}
async function reload(frame: HTMLIFrameElement) {
  const loaded = new Promise<void>(resolve => frame.addEventListener('load', () => resolve(), { once: true }));
  frame.contentWindow!.location.reload();
  await loaded;
}
function probe(frame: HTMLIFrameElement) {
  return (frame.contentWindow as Window & { g10b3: {
    faults: { preSubmit: boolean; lostAcknowledgement: boolean };
    events: Array<Record<string, unknown>>;
  } }).g10b3;
}
async function selected(name: string) {
  const owner = await openCleanEpochAccountStore();
  try {
    const account = (await owner.list()).find(item => item.profile.displayName === name);
    if (!account) throw Error('Disposable account missing');
    const slot = await owner.readSlot(account.accountId, 'slot-1');
    if (slot.status !== 'ready') throw Error(`Selected slot is ${slot.status}`);
    const control = slot.loaded.sessionControl;
    const open = indexedDB.open(CLEAN_EPOCH_DATABASE_NAME);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    try {
      const request = db.transaction('artifacts').objectStore('artifacts').getAll();
      const artifacts = await new Promise<Array<{ accountId: string }>>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      return { accountId: account.accountId, accountRevision: account.revision,
        lifecycleGeneration: account.lifecycleGeneration,
        artifactId: control.loadedArtifactId, publicationId: control.loadedPublicationId,
        headRevision: control.campaignHeadRevision, capturedAtTick: slot.loaded.snapshot.capturedAtTick,
        artifactCount: artifacts.filter(item => item.accountId === account.accountId).length };
    } finally { db.close(); }
  } finally { owner.close(); }
}
async function loadReady(frame: HTMLIFrameElement) {
  const row = await until(() => doc(frame).querySelector<HTMLElement>('.launcher-save-row'), 'ready launcher row');
  row.click();
  await until(() => button(frame, 'Open settings'), 'selected in-game shell');
  click(frame, 'Open settings');
  await until(() => button(frame, 'Save'), 'selected Save control');
}
function sameHead(left: Awaited<ReturnType<typeof selected>>, right: Awaited<ReturnType<typeof selected>>) {
  return left.artifactId === right.artifactId && left.publicationId === right.publicationId &&
    left.headRevision === right.headRevision && left.artifactCount === right.artifactCount &&
    left.accountRevision === right.accountRevision;
}
async function untilPublication(name: string, previousArtifactId: string) {
  for (let i = 0; i < 600; i++) {
    const current = await selected(name);
    if (current.artifactId !== previousArtifactId) return current;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw Error('Timed out waiting for a new deliberate Save publication');
}

async function main() {
  progress('fresh selected account and two contexts');
  await until(() => button(a, 'Create Account') && button(b, 'Create Account') ? true : null, 'two selected forms');
  check(a.contentWindow !== b.contentWindow && a.contentWindow!.location.origin === b.contentWindow!.location.origin,
    'distinct same-origin selected contexts');
  const name = `G10B3 intent ${crypto.randomUUID().slice(0, 8)}`;
  fill(a, 'input[autocomplete="nickname"]', name);
  for (const input of doc(a).querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]')) {
    const realm = a.contentWindow as Window & typeof globalThis;
    Object.getOwnPropertyDescriptor(realm.HTMLInputElement.prototype, 'value')!.set!.call(input, password);
    input.dispatchEvent(new realm.Event('input', { bubbles: true }));
  }
  doc(a).querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
  click(a, 'Create Account');
  const emptySlot = await until(() => doc(a).querySelector<HTMLElement>('.launcher-save-row.is-empty'), 'account slot');
  emptySlot.click();
  await until(() => button(a, 'Randomize Character'), 'creator');
  for (let i = 0; i < 40; i++) {
    click(a, 'Randomize Character');
    await new Promise(resolve => setTimeout(resolve, 0));
    if ([...doc(a).querySelectorAll('button')].some(item => item.textContent?.includes('8Finalize'))) break;
  }
  const finalize = await until(() => [...doc(a).querySelectorAll<HTMLButtonElement>('button')]
    .find(item => item.textContent?.includes('8Finalize')) ?? null, 'complete creator');
  finalize.click();
  await until(() => button(a, 'Begin Journey'), 'Finalize');
  click(a, 'Begin Journey');
  await until(() => button(a, 'Open settings'), 'first ready campaign');
  click(a, 'Open settings');
  await until(() => button(a, 'Save'), 'first selected Save');
  const first = await selected(name);

  progress('R5 pre-submit failure leaves owner fixed');
  probe(a).faults.preSubmit = true;
  click(a, 'Save');
  await until(() => button(a, 'Retry campaign data'), 'pre-submit blocked App');
  check(probe(a).events.some(item => item.kind === 'pre_submit_interruption'), 'pre-submit fault reached');
  check(sameHead(await selected(name), first), 'pre-submit left exact head and account revision fixed');
  click(a, 'Retry campaign data');
  await until(() => doc(a).querySelector('.launcher-save-row') ? true : null, 'pre-submit Retry menu');
  check(sameHead(await selected(name), first), 'pre-submit Retry did not publish');
  await reload(a);
  await until(() => doc(a).querySelector('.launcher-save-row') ? true : null, 'pre-submit restart menu');
  check(sameHead(await selected(name), first), 'pre-submit restart did not publish');

  progress('R1/R2 genuine post-commit loss and selected Retry');
  await loadReady(a);
  await reload(b);
  await until(() => doc(b).querySelector('.launcher-save-row') ? true : null, 'second context menu');
  await loadReady(b);
  probe(a).faults.lostAcknowledgement = true;
  click(a, 'Save');
  await until(() => button(a, 'Retry campaign data'), 'post-commit acknowledgement blocked App');
  const event = probe(a).events.find(item => item.kind === 'lost_post_commit_acknowledgement');
  check(!!event, 'fault occurred after adapter ready result');
  const committed = await selected(name);
  check(committed.artifactId === event.artifactId && committed.publicationId === event.publicationId &&
    committed.artifactCount === first.artifactCount + 1, 'one exact durable post-commit publication');
  click(b, 'Save');
  await until(() => button(b, 'Retry campaign data'), 'stale second context blocked');
  check(sameHead(await selected(name), committed), 'stale contender did not replace accepted head');
  click(a, 'Retry campaign data');
  await until(() => doc(a).querySelector('.launcher-save-row') ? true : null, 'selected Retry menu');
  check(sameHead(await selected(name), committed), 'selected Retry reread exact head without publication');
  click(b, 'Retry campaign data');
  await until(() => doc(b).querySelector('.launcher-save-row') ? true : null, 'contender Retry menu');
  check(sameHead(await selected(name), committed), 'second-context Retry reread exact head');
  await reload(a);
  await until(() => doc(a).querySelector('.launcher-save-row') ? true : null, 'post-commit restart menu');
  check(sameHead(await selected(name), committed), 'restart reread exact committed head');

  progress('R3 later deliberate same-content Save is a new command');
  await loadReady(a);
  check(doc(a).body.innerText.includes('All Changes Saved'), 'same-content Save begins with no unsaved changes');
  click(a, 'Save');
  await until(() => doc(a).body.innerText.includes('Game Data Saved') ? true : null, 'explicit same-content Save success');
  const sameContent = await selected(name);
  check(sameContent.artifactCount === committed.artifactCount + 1 &&
    sameContent.headRevision === committed.headRevision + 1 &&
    sameContent.capturedAtTick === committed.capturedAtTick,
  'deliberate same-content Save created one new descendant without gameplay change');

  progress('R4 accepted gameplay change then explicit Save');
  click(a, 'Activity');
  await until(() => button(a, 'Set Current Activity'), 'Activity controls');
  const setActivity = button(a, 'Set Current Activity');
  if (setActivity && !setActivity.disabled) click(a, 'Set Current Activity');
  await until(() => button(a, 'Advance Shift') && !button(a, 'Advance Shift')!.disabled ? true : null,
    'available selected work shift');
  click(a, 'Advance Shift');
  await until(() => button(a, 'Confirm Advance Shift'), 'risky shift confirmation');
  click(a, 'Confirm Advance Shift');
  await until(() => doc(a).body.innerText.includes('Shift Advanced') ? true : null, 'accepted changed-intent shift');
  check(sameHead(await selected(name), sameContent), 'in-memory gameplay change did not publish before Save');
  click(a, 'Open settings');
  await until(() => button(a, 'Save'), 'changed-intent Save');
  click(a, 'Save');
  const changed = await untilPublication(name, sameContent.artifactId);
  check(doc(a).body.innerText.includes('Game Data Saved'), 'changed-intent Save success');
  check(changed.artifactCount === sameContent.artifactCount + 1 &&
    changed.headRevision === sameContent.headRevision + 1 &&
    changed.capturedAtTick > sameContent.capturedAtTick, 'changed gameplay intent published one new descendant');
  log.push(`ACCOUNT ${name} ${committed.accountId} generation=${changed.lifecycleGeneration}`);
  log.push(`FIRST ${JSON.stringify(first)}`);
  log.push(`POST_COMMIT ${JSON.stringify(committed)}`);
  log.push(`SAME_CONTENT_NEW_COMMAND ${JSON.stringify(sameContent)}`);
  log.push(`CHANGED_INTENT_NEW_COMMAND ${JSON.stringify(changed)}`);
}
main().then(() => output.textContent = `PASS ${assertions} assertions; Retry is readback, later Save is a new command\n${log.join('\n')}`)
  .catch(error => output.textContent = `FAIL ${assertions}: ${error instanceof Error ? error.stack : error}\n${log.join('\n')}`);
