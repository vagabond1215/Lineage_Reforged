import { CLEAN_EPOCH_DATABASE_NAME, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#audit')!;
const a = document.querySelector<HTMLIFrameElement>('#a')!;
const b = document.querySelector<HTMLIFrameElement>('#b')!;
const password = 'disposable-g10b5-only';
let assertions = 0;
const evidence: string[] = [];
function check(value: unknown, label: string): asserts value { assertions++; if (!value) throw Error(label); }
function stage(label: string) { output.textContent = `RUNNING ${label} (${assertions})`; }
async function until<T>(read: () => T | null, label: string): Promise<T> {
  for (let i = 0; i < 600; i++) {
    const found = read(); if (found) return found;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw Error(`Timed out ${label}; A=${a.contentDocument?.body?.innerText.slice(0, 180)}; B=${b.contentDocument?.body?.innerText.slice(0, 180)}`);
}
function doc(frame: HTMLIFrameElement) { if (!frame.contentDocument) throw Error('Frame unavailable'); return frame.contentDocument; }
function button(frame: HTMLIFrameElement, name: string) {
  return [...doc(frame).querySelectorAll<HTMLButtonElement>('button')]
    .find(item => item.textContent?.replace(/\s/g, '') === name.replace(/\s/g, '') || item.getAttribute('aria-label') === name) ?? null;
}
function click(frame: HTMLIFrameElement, name: string) {
  const item = button(frame, name); if (!item || item.disabled) throw Error(`Missing enabled ${name}`); item.click();
}
function fill(frame: HTMLIFrameElement, input: HTMLInputElement, value: string) {
  const realm = frame.contentWindow as Window & typeof globalThis;
  Object.getOwnPropertyDescriptor(realm.HTMLInputElement.prototype, 'value')!.set!.call(input, value);
  input.dispatchEvent(new realm.Event('input', { bubbles: true }));
}
function fault(frame: HTMLIFrameElement) {
  return (frame.contentWindow as Window & { g10b5: {
    faults: { firstConsumer: boolean; descendantConsumer: boolean; preSubmit: boolean; lostAck: boolean };
    events: Array<Record<string, unknown>>;
  } }).g10b5;
}
async function reload(frame: HTMLIFrameElement) {
  const done = new Promise<void>(resolve => frame.addEventListener('load', () => resolve(), { once: true }));
  frame.contentWindow!.location.reload(); await done;
}
async function artifactCount(accountId: string) {
  const request = indexedDB.open(CLEAN_EPOCH_DATABASE_NAME);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
  try {
    const all = db.transaction('artifacts').objectStore('artifacts').getAll();
    return (await new Promise<Array<{ accountId: string }>>((resolve, reject) => {
      all.onsuccess = () => resolve(all.result); all.onerror = () => reject(all.error);
    })).filter(row => row.accountId === accountId).length;
  } finally { db.close(); }
}
async function read(name: string) {
  const owner = await openCleanEpochAccountStore();
  try {
    const account = (await owner.list()).find(row => row.profile.displayName === name);
    if (!account) throw Error(`Missing disposable account ${name}`);
    const slot = await owner.readSlot(account.accountId, 'slot-1');
    const first = await owner.readRecovery(account.accountId, 'slot-1');
    const descendant = await owner.readCurrentDescendantRecovery(account.accountId, 'slot-1');
    const control = slot.status === 'ready' ? slot.loaded.sessionControl : null;
    return { accountId: account.accountId, accountRevision: account.revision,
      generation: account.lifecycleGeneration, slotStatus: slot.status,
      campaignId: slot.status === 'ready' ? slot.loaded.snapshot.campaignId : null,
      continuityId: slot.status === 'ready' ? slot.loaded.sessionControl.continuityId : null,
      artifactId: control?.loadedArtifactId ?? null, publicationId: control?.loadedPublicationId ?? null,
      headRevision: control?.campaignHeadRevision ?? null,
      tick: slot.status === 'ready' ? slot.loaded.snapshot.capturedAtTick : null,
      firstStatus: first?.status ?? null, firstPublication: first?.publicationId ?? null,
      descendantStatus: descendant?.status ?? null, descendantPublication: descendant?.publicationId ?? null,
      artifactCount: await artifactCount(account.accountId) };
  } finally { owner.close(); }
}
function sameHead(left: Awaited<ReturnType<typeof read>>, right: Awaited<ReturnType<typeof read>>) {
  return left.artifactId === right.artifactId && left.publicationId === right.publicationId &&
    left.headRevision === right.headRevision && left.accountRevision === right.accountRevision &&
    left.artifactCount === right.artifactCount;
}
async function menu(frame: HTMLIFrameElement) { await until(() => doc(frame).querySelector('.launcher-save-row'), 'launcher menu'); }
async function game(frame: HTMLIFrameElement) {
  await menu(frame); doc(frame).querySelector<HTMLElement>('.launcher-save-row')!.click();
  await until(() => button(frame, 'Open settings'), 'selected game'); click(frame, 'Open settings');
  await until(() => button(frame, 'Save'), 'selected Save');
}
async function newHead(name: string, oldId: string | null) {
  for (let i = 0; i < 600; i++) {
    const value = await read(name); if (value.artifactId && value.artifactId !== oldId) return value;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw Error('Timed out waiting for new publication');
}
async function main() {
  stage('P1 ordinary selected first publication with interrupted consumer');
  await until(() => button(a, 'Create Account') && button(b, 'Create Account') ? true : null, 'two selected account forms');
  check(a.contentWindow !== b.contentWindow && a.contentWindow!.location.origin === b.contentWindow!.location.origin,
    'two distinct same-origin selected realms');
  const name = `G10B5 matrix ${crypto.randomUUID().slice(0, 8)}`;
  fill(a, doc(a).querySelector<HTMLInputElement>('input[autocomplete="nickname"]')!, name);
  doc(a).querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]').forEach(input => fill(a, input, password));
  doc(a).querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
  click(a, 'Create Account');
  await menu(a); await reload(b); await menu(b);
  doc(a).querySelector<HTMLElement>('.launcher-save-row.is-empty')!.click();
  await until(() => button(a, 'Randomize Character'), 'creator');
  for (let i = 0; i < 40 && ![...doc(a).querySelectorAll('button')].some(item => item.textContent?.includes('8Finalize')); i++) {
    click(a, 'Randomize Character'); await new Promise(resolve => setTimeout(resolve, 0));
  }
  const finalize = await until(() => [...doc(a).querySelectorAll<HTMLButtonElement>('button')]
    .find(item => item.textContent?.includes('8Finalize')) ?? null, 'creator Finalize');
  finalize.click(); await until(() => button(a, 'Begin Journey'), 'journey');
  fault(a).faults.firstConsumer = true; click(a, 'Begin Journey');
  await until(() => button(a, 'Retry campaign data'), 'first pending selected block');
  check(fault(a).events.some(item => item.kind === 'first_consumer'), 'first interruption was postpublication');
  const firstPending = await read(name);
  check(firstPending.slotStatus === 'pending_consumers' && firstPending.firstStatus === 'accepted_pending_consumers' && firstPending.artifactCount === 1,
    'one first head and pending consumer retained');
  await reload(b); await menu(b);
  const firstReady = await read(name);
  check(firstReady.slotStatus === 'ready' && firstReady.firstStatus !== 'accepted_pending_consumers' &&
    firstReady.firstPublication === firstPending.firstPublication && firstReady.artifactCount === 1,
    'B restart completed exact first publication once');
  click(a, 'Retry campaign data'); await menu(a);
  check(sameHead(await read(name), firstReady), 'A selected Retry reads exact first head');
  evidence.push(`P1_PENDING ${JSON.stringify(firstPending)}`);
  evidence.push(`P1_READY ${JSON.stringify(firstReady)}`);

  stage('P2 descendant pending and two-context completion');
  await game(a); await game(b);
  fault(a).faults.descendantConsumer = true; click(a, 'Save');
  await until(() => button(a, 'Retry campaign data'), 'descendant pending selected block');
  check(fault(a).events.some(item => item.kind === 'descendant_consumer'), 'descendant interruption was postpublication');
  const pending = await read(name);
  check(pending.slotStatus === 'pending_consumers' && pending.descendantStatus === 'accepted_pending_consumers' &&
    pending.artifactCount === 2 && pending.descendantPublication !== firstReady.publicationId,
    'one descendant pending with distinct publication');
  click(b, 'Save'); await until(() => button(b, 'Retry campaign data'), 'pending contender blocked');
  check((await read(name)).descendantPublication === pending.descendantPublication, 'contender did not replace pending descendant');
  click(b, 'Retry campaign data'); await menu(b);
  const descendantReady = await read(name);
  check(descendantReady.slotStatus === 'ready' && descendantReady.publicationId === pending.descendantPublication &&
    descendantReady.artifactCount === 2 && descendantReady.headRevision === firstReady.headRevision! + 1,
    'B Retry completed exact pending descendant once');
  click(a, 'Retry campaign data'); await menu(a);
  check(sameHead(await read(name), descendantReady), 'A Retry reads exact completed descendant');
  evidence.push(`P2_PENDING ${JSON.stringify(pending)}`);
  evidence.push(`P2_READY ${JSON.stringify(descendantReady)}`);

  stage('L4 pre-submit failure then L1 genuine lost acknowledgement');
  await game(a); await game(b);
  fault(a).faults.preSubmit = true; click(a, 'Save');
  await until(() => button(a, 'Retry campaign data'), 'pre-submit selected block');
  check(fault(a).events.some(item => item.kind === 'pre_submit'), 'pre-submit interruption reached');
  check(sameHead(await read(name), descendantReady), 'pre-submit changed no durable head');
  click(a, 'Retry campaign data'); await menu(a); await reload(a); await menu(a);
  check(sameHead(await read(name), descendantReady), 'pre-submit Retry and restart publish nothing');
  await game(a); fault(a).faults.lostAck = true; click(a, 'Save');
  await until(() => button(a, 'Retry campaign data'), 'lost acknowledgement selected block');
  const event = fault(a).events.find(item => item.kind === 'lost_ack');
  const committed = await read(name);
  check(!!event && committed.artifactId === event.artifactId && committed.publicationId === event.publicationId &&
    committed.artifactCount === descendantReady.artifactCount + 1,
    'lost acknowledgement followed one complete owner publication');
  click(b, 'Save'); await until(() => button(b, 'Retry campaign data'), 'stale B block');
  check(sameHead(await read(name), committed), 'stale B cannot replace committed head');
  click(a, 'Retry campaign data'); await menu(a); click(b, 'Retry campaign data'); await menu(b);
  check(sameHead(await read(name), committed), 'two selected Retry calls mint no head');
  await reload(a); await menu(a);
  check(sameHead(await read(name), committed), 'restart reads one exact postcommit head');
  evidence.push(`L1_COMMITTED ${JSON.stringify(committed)}`);

  stage('L3 deliberate new Save intents');
  await game(a); check(doc(a).body.innerText.includes('All Changes Saved'), 'post-Retry game is saved');
  click(a, 'Save'); const sameContent = await newHead(name, committed.artifactId);
  check(sameContent.artifactCount === committed.artifactCount + 1 &&
    sameContent.headRevision === committed.headRevision! + 1 && sameContent.tick === committed.tick,
    'deliberate same-content Save is one new command');
  click(a, 'Activity'); await until(() => button(a, 'Set Current Activity'), 'selected Activity');
  if (button(a, 'Set Current Activity') && !button(a, 'Set Current Activity')!.disabled) click(a, 'Set Current Activity');
  await until(() => button(a, 'Advance Shift') && !button(a, 'Advance Shift')!.disabled ? true : null, 'shift');
  click(a, 'Advance Shift');
  await until(() => button(a, 'Confirm Advance Shift') || doc(a).body.innerText.includes('Shift Advanced') ? true : null,
    'shift confirmation or accepted immediate shift');
  if (button(a, 'Confirm Advance Shift')) click(a, 'Confirm Advance Shift');
  await until(() => doc(a).body.innerText.includes('Shift Advanced') ? true : null, 'accepted shift');
  click(a, 'Open settings'); await until(() => button(a, 'Save'), 'changed Save'); click(a, 'Save');
  const changed = await newHead(name, sameContent.artifactId);
  check(changed.artifactCount === sameContent.artifactCount + 1 && changed.headRevision === sameContent.headRevision! + 1 &&
    changed.tick! > sameContent.tick!, 'changed intent publishes one descendant');
  evidence.push(`L3_SAME_CONTENT_NEW_COMMAND ${JSON.stringify(sameContent)}`);
  evidence.push(`L3_CHANGED_INTENT_NEW_COMMAND ${JSON.stringify(changed)}`);
}
main().then(() => output.textContent = `PASS ${assertions} fresh G10B.5 selected assertions\n${evidence.join('\n')}`)
  .catch(error => output.textContent = `FAIL ${assertions}: ${error instanceof Error ? error.stack : error}\n${evidence.join('\n')}`);
