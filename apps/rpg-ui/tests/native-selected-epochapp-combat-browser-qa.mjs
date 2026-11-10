import assert from 'node:assert/strict';

// Disposable synthetic account setup; selected actions go through the real EpochApp.
const url = 'http://127.0.0.1:5195/native-selected-session-qa.html?route=combat&candidate';
const target = (await (await fetch('http://127.0.0.1:9240/json')).json())
  .find(entry => entry.url?.startsWith('http://127.0.0.1:5195/native-selected-session-qa.html'));
assert.ok(target);
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
socket.onmessage = event => { const message = JSON.parse(event.data);
  const next = pending.get(message.id); if (!next) return; pending.delete(message.id);
  message.error ? next.reject(new Error(message.error.message)) : next.resolve(message.result); };
function cdp(method, params = {}) { const requestId = ++id;
  return new Promise((resolve, reject) => { pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params })); }); }
async function evaluate(expression) { const result = await cdp('Runtime.evaluate',
  { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value; }
async function waitFor(expression) { for (let attempt = 0; attempt < 200; attempt++) {
  const value = await evaluate(expression); if (value) return value;
  await new Promise(resolve => setTimeout(resolve, 100)); }
  throw new Error(`Timed out: ${expression}`); }
async function click(label) { assert.equal(await evaluate(`(() => { const button =
  [...document.querySelectorAll('button')].find(item => item.textContent.trim() === ${JSON.stringify(label)} && !item.disabled);
  if (!button) return false; button.click(); return true; })()`), true, `enabled ${label} control`); }

try {
  await cdp('Page.navigate', { url });
  await waitFor(`location.href === ${JSON.stringify(url)} && document.body.dataset.seeded === 'true'`);
  const accountId = await evaluate('document.body.dataset.accountId');
  assert.ok(accountId);
  const read = () => evaluate(`(async () => { const owner = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      const account = await owner.readSelected(${JSON.stringify(accountId)});
      return { status: slot.status, revision: account?.revision,
        publicationId: slot.status === 'ready' ? slot.loaded.publication.publicationId : null,
        tick: slot.status === 'ready' ? slot.loaded.snapshot.clock.tick : null,
        encounterId: slot.status === 'ready' ? slot.loaded.snapshot.gameState.activeEncounter?.encounterId ?? null : null,
        gear: slot.status === 'ready' ? slot.loaded.snapshot.playerState.gear : null }; }
    finally { owner.close(); } })()`);
  const initial = await read();
  assert.equal(initial.status, 'ready');
  await waitFor(`[...document.querySelectorAll('[role="button"]')].some(row => row.textContent.startsWith('1Native'))`);
  await evaluate(`[...document.querySelectorAll('[role="button"]')].find(row => row.textContent.startsWith('1Native')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  await click('Activity');
  for (let attempt = 0; attempt < 24; attempt++) {
    if (await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Enter nearby encounter')`)) break;
    await click('Explore nearby');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Enter nearby encounter')`);
  await click('Enter nearby encounter');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim().startsWith('combat.ranged.primary'))`);
  const ranged = await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim().startsWith('combat.ranged.primary')).textContent.trim()`);
  await click(ranged);
  await waitFor(`document.body.innerText.includes('Advance combat')`);
  await click('Save');
  for (let attempt = 0; attempt < 200; attempt++) {
    if ((await read()).encounterId) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const saved = await read();
  assert.ok(saved.encounterId, 'encounter retained by selected Save');
  assert.ok(saved.tick > initial.tick);
  assert.ok(saved.revision > initial.revision);
  assert.deepEqual(saved.gear, initial.gear, 'combat preserved physical gear');
  const resume = 'http://127.0.0.1:5195/native-selected-session-qa.html?resume&candidate';
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  await click('Activity');
  await waitFor(`document.body.innerText.includes(${JSON.stringify(saved.encounterId)})`);
  const restarted = await read();
  assert.equal(restarted.publicationId, saved.publicationId);
  assert.deepEqual(restarted.gear, initial.gear);
  console.log('PASS synthetic setup, real selected EpochApp exploration, Short Bow combat, Save and restart');
} finally { socket.close(); }
