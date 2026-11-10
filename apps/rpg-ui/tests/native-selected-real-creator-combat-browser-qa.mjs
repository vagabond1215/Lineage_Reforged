import assert from 'node:assert/strict';

// Disposable account, real EpochApp creator and authored Stonevein combat controls.
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
  await chooseStep('3Continent', 'Kaelvar');
  await chooseStep('4Region', 'The Auric Marches');
  await chooseStep('5Settlement', 'Stonevein');
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
      return { slotStatus: slot.status, revision: account?.revision,
        publicationId: slot.status === 'ready' ? slot.loaded.publication.publicationId : null,
        campaignId: slot.status === 'ready' ? slot.loaded.snapshot.campaignIdentity.campaignId : null,
        location: slot.status === 'ready' ? slot.loaded.snapshot.playerState.location.settlementId : null,
        tick: slot.status === 'ready' ? slot.loaded.snapshot.clock.tick : null,
        resources: slot.status === 'ready' ? slot.loaded.snapshot.playerState.resources : null,
        defeatReceipts: slot.status === 'ready' ? slot.loaded.snapshot.normalDefeatReceipts ?? [] : [],
        encounterId: slot.status === 'ready' ? slot.loaded.snapshot.gameState.activeEncounter?.encounterId ?? null : null,
        gear: slot.status === 'ready' ? slot.loaded.snapshot.playerState.gear : null };
    } finally { owner.close(); }
  })()`);
  const initial = await read();
  assert.equal(initial.slotStatus, 'ready');
  assert.equal(initial.location, 'settlement.stonevein');
  assert.ok(initial.gear.instances.some(item => item.itemId === 'item.short_bow'));
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
  assert.ok(saved.encounterId, 'authored encounter retained');
  assert.ok(saved.tick > initial.tick);
  assert.ok(saved.revision > initial.revision);
  assert.ok(saved.resources.stamina.current < initial.resources.stamina.current);
  assert.deepEqual(saved.gear, initial.gear);
  const resume = `${origin}/native-selected-session-qa.html?resume&candidate`;
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  const restarted = await read();
  assert.equal(restarted.publicationId, saved.publicationId);
  assert.equal(restarted.campaignId, initial.campaignId);
  assert.equal(restarted.encounterId, saved.encounterId);
  assert.deepEqual(restarted.resources, saved.resources);
  assert.deepEqual(restarted.gear, initial.gear);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  await click('Activity');
  let advances = 0;
  for (; advances < 80; advances++) {
    if (!await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Advance combat')`)) break;
    await click('Advance combat');
    await new Promise(resolve => setTimeout(resolve, 75));
  }
  assert.ok(advances > 0 && advances < 80, 'ordinary encounter resolved through selected combat controls');
  assert.equal(await evaluate(`document.body.innerText.includes('Encounter:')`), false,
    'authored combat reached a terminal encounter state');
  await click('Save');
  for (let attempt = 0; attempt < 200; attempt++) {
    if ((await read()).revision > saved.revision) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const resolved = await read();
  assert.equal(resolved.encounterId, null);
  assert.ok(resolved.revision > saved.revision);
  assert.equal(resolved.defeatReceipts.length, 1, 'one ordinary Normal-defeat receipt was retained');
  const defeat = resolved.defeatReceipts[0];
  assert.equal(defeat.posture, 'playable');
  assert.equal(defeat.destinationId, 'settlement.stonevein');
  assert.equal(resolved.resources.hp.current, defeat.hpRestoredTo);
  assert.deepEqual(resolved.gear, initial.gear, 'Normal defeat conserved physical gear');
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  const defeatRestarted = await read();
  assert.equal(defeatRestarted.publicationId, resolved.publicationId);
  assert.deepEqual(defeatRestarted.defeatReceipts, resolved.defeatReceipts);
  assert.deepEqual(defeatRestarted.resources, resolved.resources);
  assert.deepEqual(defeatRestarted.gear, initial.gear);
  console.log('PASS real EpochApp Stonevein creator, authored combat, Normal defeat and same-campaign Save/restart');
} finally { socket.close(); }
