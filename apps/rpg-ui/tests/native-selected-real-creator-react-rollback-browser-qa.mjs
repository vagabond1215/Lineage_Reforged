import assert from 'node:assert/strict';

// Disposable real creator; fault the actual React Save transaction before or after its writes.
const stage = process.env.NATIVE_QA_FAULT ?? 'before';
assert.ok(stage === 'before' || stage === 'after', 'choose before or after transaction write');
const origin = process.env.NATIVE_QA_ORIGIN ?? 'http://127.0.0.1:5200';
const debuggerUrl = process.env.NATIVE_QA_DEBUGGER ?? 'http://127.0.0.1:9245';
const url = `${origin}/native-selected-session-qa.html?creator&candidate`;
const targets = await (await fetch(`${debuggerUrl}/json`)).json();
const target = targets.find(entry => entry.url?.startsWith(`${origin}/native-selected-session-qa.html`));
assert.ok(target, 'disposable candidate browser tab is open');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  const next = pending.get(message.id);
  if (!next) return;
  pending.delete(message.id);
  message.error ? next.reject(new Error(message.error.message)) : next.resolve(message.result);
};
function cdp(method, params = {}) {
  const requestId = ++id;
  return new Promise((resolve, reject) => {
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const value = await evaluate(expression);
    if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out: ${expression}; page: ${await evaluate('document.body.innerText.slice(0, 700)')}`);
}
async function click(label) {
  assert.equal(await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(item =>
    item.textContent.trim() === ${JSON.stringify(label)} && !item.disabled);
    if (!button) return false; button.click(); return true; })()`), true, `enabled ${label} control`);
}
async function chooseStep(step, option) {
  await click(step);
  const selectedStart = await evaluate(`document.body.innerText.split('START\\n')[1]?.split('\\nSTR')[0] ?? ''`);
  if (selectedStart.includes(option)) return;
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes(${JSON.stringify(option)}) && !button.disabled)`);
  assert.equal(await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(item =>
    item.textContent.includes(${JSON.stringify(option)}) && !item.disabled);
    if (!button) return false; button.click(); return true; })()`), true, `creator choice ${option}`);
}

try {
  await cdp('Page.navigate', { url });
  await waitFor(`location.href === ${JSON.stringify(url)} && document.body.dataset.seeded === 'creator'`);
  const accountId = await evaluate('document.body.dataset.accountId');
  assert.ok(accountId);
  await waitFor(`[...document.querySelectorAll('[role="button"]')].some(row => row.textContent.startsWith('1Empty'))`);
  await evaluate(`[...document.querySelectorAll('[role="button"]')].find(row => row.textContent.startsWith('1Empty')).click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Randomize Character')`);
  for (let attempt = 0; attempt < 24; attempt++) {
    if (await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === '8Finalize' && !button.disabled)`)) break;
    await click('Randomize Character');
  }
  await chooseStep('3Continent', 'The Myridian Chain');
  await chooseStep('4Region', 'Starfall Isle');
  await chooseStep('5Settlement', 'Starfall Port');
  await chooseStep('6Backstory', 'Workshop-Raised');
  await chooseStep('7Starting Bundle', 'Hunter Bundle');
  await click('8Finalize');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Begin Journey')`);
  await click('Begin Journey');
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  const read = () => evaluate(`(async () => {
    const owner = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try {
      const slot = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      const account = await owner.readSelected(${JSON.stringify(accountId)});
      const recovery = await owner.readCurrentDescendantRecovery(${JSON.stringify(accountId)}, 'slot-1');
      return { slotStatus: slot.status, revision: account?.revision,
        publicationId: slot.status === 'ready' ? slot.loaded.publication.publicationId : null,
        sourceAddress: slot.status === 'ready' ? { artifactId: slot.loaded.sessionControl.loadedArtifactId,
          publicationId: slot.loaded.sessionControl.loadedPublicationId } : null,
        recovery: recovery?.status ?? null,
        history: account?.profile.history.runRecords.map(record => ({ reason: record.archiveReason,
          characterId: record.characterId, outcome: record.outcome })) ?? [],
        campaignId: slot.status === 'ready' ? slot.loaded.snapshot.campaignIdentity.campaignId : null,
        playerId: slot.status === 'ready' ? slot.loaded.snapshot.playerState.playerId : null,
        gear: slot.status === 'ready' ? slot.loaded.snapshot.playerState.gear : null };
    } finally { owner.close(); }
  })()`);
  const initial = await read();
  assert.equal(initial.slotStatus, 'ready');
  assert.ok(initial.gear.instances.some(item => item.itemId === 'item.short_bow'));
  const bow = initial.gear.instances.find(item => item.itemId === 'item.short_bow');
  await evaluate(`[...document.querySelectorAll('[data-slot-id]')].find(row =>
    row.dataset.slotId === ${JSON.stringify(bow.location.slotId)}).querySelectorAll('button')[1].click()`);
  await waitFor(`document.body.innerText.includes('Unequip Short Bow completed.')`);
  const armed = await evaluate(`(async () => {
    const { CleanEpochAccountStore } = await import('/src/game-shell/cleanEpochAccountStore.ts');
    const original = CleanEpochAccountStore.prototype.publishDescendant;
    const stage = ${JSON.stringify(stage)};
    CleanEpochAccountStore.prototype.publishDescendant = async function (...args) {
      CleanEpochAccountStore.prototype.publishDescendant = original;
      const hook = stage === 'before' ? 'beforeWrite' : 'afterWrite';
      const prior = this[hook];
      let callbacks = 0;
      this[hook] = tx => { callbacks += 1; tx.abort(); };
      try { return await original.apply(this, args); }
      finally { this[hook] = prior;
        document.body.dataset.reactRollbackFault = stage;
        document.body.dataset.reactRollbackCallbacks = String(callbacks); }
    };
    return true;
  })()`);
  assert.equal(armed, true);
  await click('Save');
  await waitFor(`document.body.dataset.reactRollbackFault === ${JSON.stringify(stage)}`);
  assert.equal(await evaluate('document.body.dataset.reactRollbackCallbacks'), '1');
  await waitFor(`document.body.innerText.includes('Campaign data is unavailable: Campaign store transaction aborted.') &&
    [...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Retry campaign data')`);
  const rejected = await read();
  assert.equal(rejected.slotStatus, 'ready');
  assert.equal(rejected.revision, initial.revision);
  assert.equal(rejected.publicationId, initial.publicationId);
  assert.deepEqual(rejected.sourceAddress, initial.sourceAddress);
  assert.deepEqual(rejected.gear, initial.gear);
  assert.equal(rejected.recovery, null);
  const resume = `${origin}/native-selected-session-qa.html?resume&candidate`;
  await click('Retry campaign data');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  const restarted = await read();
  assert.equal(restarted.revision, initial.revision);
  assert.equal(restarted.publicationId, initial.publicationId);
  assert.deepEqual(restarted.sourceAddress, initial.sourceAddress);
  assert.deepEqual(restarted.gear, initial.gear);
  assert.equal(restarted.recovery, null);
  assert.deepEqual(restarted.history, initial.history);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  await evaluate(`[...document.querySelectorAll('[data-slot-id]')].find(row =>
    row.dataset.slotId === ${JSON.stringify(bow.location.slotId)}).querySelectorAll('button')[1].click()`);
  await waitFor(`document.body.innerText.includes('Unequip Short Bow completed.')`);
  await click('Save');
  for (let attempt = 0; attempt < 200 && (await read()).revision === initial.revision; attempt++)
    await new Promise(resolve => setTimeout(resolve, 100));
  const retried = await read();
  assert.equal(retried.revision, initial.revision + 1, 'exactly one accepted account revision after rollback');
  assert.notEqual(retried.publicationId, initial.publicationId);
  assert.equal(retried.campaignId, initial.campaignId);
  assert.equal(retried.playerId, initial.playerId);
  assert.equal(retried.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId)?.location.kind, 'bag');
  assert.equal(retried.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId)?.durability, bow.durability);
  assert.equal(retried.recovery, null);
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  const retained = await read();
  assert.equal(retained.revision, retried.revision);
  assert.equal(retained.publicationId, retried.publicationId);
  assert.deepEqual(retained.gear, retried.gear);
  console.log(`PASS real creator selected ${stage}-write transaction abort rolled back React Save and reloaded retry published once`);
} finally { socket.close(); }
