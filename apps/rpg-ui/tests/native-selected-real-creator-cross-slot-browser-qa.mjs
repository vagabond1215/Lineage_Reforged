import assert from 'node:assert/strict';

// Disposable account, real EpochApp creator and selected cross-slot Save controls.
const origin = process.env.NATIVE_QA_ORIGIN ?? 'http://127.0.0.1:5197';
const debuggerUrl = process.env.NATIVE_QA_DEBUGGER ?? 'http://127.0.0.1:9242';
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
      const quick = await owner.readSlot(${JSON.stringify(accountId)}, 'quick-save');
      const second = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-2');
      const account = await owner.readSelected(${JSON.stringify(accountId)});
      return { slotStatus: slot.status, quickStatus: quick.status, secondStatus: second.status,
        revision: account?.revision,
        version: slot.status === 'ready' ? slot.loaded.snapshot.snapshotVersion : null,
        quickVersion: quick.status === 'ready' ? quick.loaded.snapshot.snapshotVersion : null,
        secondVersion: second.status === 'ready' ? second.loaded.snapshot.snapshotVersion : null,
        secondPublicationId: second.status === 'ready' ? second.loaded.publication.publicationId : null,
        publicationId: slot.status === 'ready' ? slot.loaded.publication.publicationId : null,
        quickPublicationId: quick.status === 'ready' ? quick.loaded.publication.publicationId : null,
        campaignId: slot.status === 'ready' ? slot.loaded.snapshot.campaignIdentity.campaignId : null,
        quickCampaignId: quick.status === 'ready' ? quick.loaded.snapshot.campaignIdentity.campaignId : null,
        gear: slot.status === 'ready' ? slot.loaded.snapshot.playerState.gear : null,
        quickGear: quick.status === 'ready' ? quick.loaded.snapshot.playerState.gear : null };
    } finally { owner.close(); }
  })()`);
  const initial = await read();
  assert.equal(initial.slotStatus, 'ready');
  assert.ok(initial.gear.instances.some(item => item.itemId === 'item.short_bow'));
  assert.equal(initial.version, 'lineage.save_snapshot.v3');
  assert.equal(initial.quickStatus, 'empty');
  await click('Quick Save');
  for (let attempt = 0; attempt < 200; attempt++) {
    if ((await read()).quickStatus === 'ready') break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const crossSlot = await read();
  assert.equal(crossSlot.slotStatus, 'ready');
  assert.equal(crossSlot.quickStatus, 'ready');
  assert.equal(crossSlot.quickVersion, 'lineage.save_snapshot.v3');
  assert.equal(crossSlot.quickCampaignId, initial.campaignId);
  assert.notEqual(crossSlot.quickPublicationId, initial.publicationId);
  assert.deepEqual(crossSlot.quickGear, initial.gear);
  assert.deepEqual(crossSlot.gear, initial.gear);
  assert.ok(crossSlot.revision > initial.revision);
  const resume = `${origin}/native-selected-session-qa.html?resume&candidate`;
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  const restarted = await read();
  assert.equal(restarted.quickPublicationId, crossSlot.quickPublicationId);
  assert.equal(restarted.publicationId, initial.publicationId);
  assert.deepEqual(restarted.quickGear, initial.gear);
  const normal = `${origin}/native-selected-session-qa.html?resume`;
  await cdp('Page.navigate', { url: normal });
  await waitFor(`location.href === ${JSON.stringify(normal)} && document.body.dataset.seeded === 'resume'`);
  await waitFor(`[...document.querySelectorAll('[role="button"]')].some(row => row.textContent.startsWith('2Empty'))`);
  await evaluate(`[...document.querySelectorAll('[role="button"]')].find(row => row.textContent.startsWith('2Empty')).click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Randomize Character')`);
  for (let attempt = 0; attempt < 24; attempt++) {
    if (await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === '8Finalize' && !button.disabled)`)) break;
    await click('Randomize Character');
  }
  await click('8Finalize');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Begin Journey')`);
  await click('Begin Journey');
  for (let attempt = 0; attempt < 200; attempt++) {
    if ((await read()).secondStatus === 'ready') break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const mixed = await read();
  assert.equal(mixed.secondVersion, 'lineage.save_snapshot.v2', 'normal creator remains v2');
  assert.equal(mixed.version, 'lineage.save_snapshot.v3');
  assert.equal(mixed.quickVersion, 'lineage.save_snapshot.v3');
  assert.equal(mixed.publicationId, initial.publicationId);
  assert.equal(mixed.quickPublicationId, crossSlot.quickPublicationId);
  assert.deepEqual(mixed.gear, initial.gear);
  assert.deepEqual(mixed.quickGear, initial.gear);
  const obsolete = await evaluate(`(async () => {
    const { openCleanEpochAccountStore } = await import('/src/game-shell/cleanEpochAccountStore.ts');
    const { createNativeSelectedSession } = await import('/src/game-shell/nativeSelectedSession.ts');
    const owner = await openCleanEpochAccountStore();
    try {
      const slot = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-2');
      const account = await owner.readSelected(${JSON.stringify(accountId)});
      if (slot.status !== 'ready' || !account) throw new Error('Retained v2 slot is missing.');
      let rejected = false;
      try { createNativeSelectedSession({ snapshot: slot.loaded.snapshot,
        control: slot.loaded.sessionControl, sourceSlotId: 'slot-2', accountRevision: account.revision }); }
      catch (error) { rejected = String(error).includes('incompatible with native v3'); }
      const preserved = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-2');
      return { rejected, preserved: preserved.status === 'ready' &&
        preserved.loaded.publication.publicationId === slot.loaded.publication.publicationId &&
        preserved.loaded.snapshot.snapshotVersion === 'lineage.save_snapshot.v2' };
    } finally { owner.close(); }
  })()`);
  assert.equal(obsolete.rejected, true, 'retained v2 development save is refused by native v3');
  assert.equal(obsolete.preserved, true, 'obsolete rejection does not delete the v2 record');
  assert.equal((await read()).secondPublicationId, mixed.secondPublicationId);
  console.log('PASS real EpochApp native cross-slot Save and mixed v2/v3 slots in one retained account');
} finally { socket.close(); }
