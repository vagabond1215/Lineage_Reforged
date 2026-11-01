import assert from 'node:assert/strict';

// Local-only browser gate. The seeded account is explicitly synthetic; its actions use
// the real selected EpochApp controls and retained account owner.
const url = 'http://127.0.0.1:5195/native-selected-session-qa.html?route=survey&candidate';
const targets = await (await fetch('http://127.0.0.1:9240/json')).json();
const target = targets.find(entry => entry.url?.startsWith('http://127.0.0.1:5195/native-selected-session-qa.html'));
assert.ok(target, 'local candidate browser tab is open');
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
        surveyCount: slot.status === 'ready' ? slot.loaded.snapshot.nativeSurvey?.results.length ?? 0 : 0,
        activeQuests: slot.status === 'ready' ? slot.loaded.snapshot.playerState.activeQuestIds : [],
        location: slot.status === 'ready' ? slot.loaded.snapshot.playerState.location : null,
        gear: slot.status === 'ready' ? slot.loaded.snapshot.playerState.gear : null }; }
    finally { owner.close(); } })()`);
  const initial = await read();
  assert.equal(initial.status, 'ready');
  assert.equal(initial.surveyCount, 0);
  await waitFor(`[...document.querySelectorAll('[role="button"]')].some(row => row.textContent.startsWith('1Native'))`);
  await evaluate(`[...document.querySelectorAll('[role="button"]')].find(row => row.textContent.startsWith('1Native')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  await click('Quests');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Accept quest')`);
  await click('Accept quest');
  await waitFor(`document.body.innerText.includes('active · Tracked')`);
  await click('World');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Travel to Ashen Reef')`);
  await click('Travel to Ashen Reef');
  await waitFor(`document.body.innerText.includes('Current location: Survey Anchorage')`);
  await click('Save');
  await waitFor(`(async () => { const o = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { return (await o.readSlot(${JSON.stringify(accountId)}, 'slot-1')).loaded.snapshot.playerState.location.siteLabel === 'Survey Anchorage'; }
    finally { o.close(); } })()`);
  const traveled = await read();
  assert.ok(traveled.revision > initial.revision);
  assert.deepEqual(traveled.gear, initial.gear, 'quest/travel preserved physical gear');
  for (let stage = 1; stage <= 4; stage++) {
    await click('Quests');
    await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Advance Ashen Reef survey shift' && !button.disabled)`);
    await click('Advance Ashen Reef survey shift');
    await waitFor(`(() => { const button = [...document.querySelectorAll('button')].find(item =>
      item.textContent.trim() === 'Advance Ashen Reef survey shift'); return ${stage} === 4 ? !button : !!button?.disabled; })()`);
    const beforeSave = await read();
    assert.equal(beforeSave.surveyCount, stage - 1, 'survey mutation did not publish before Save');
    await click('Save');
    for (let attempt = 0; attempt < 200; attempt++) {
      if ((await read()).surveyCount === stage) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const saved = await read();
    assert.equal(saved.surveyCount, stage, `stage ${stage} retained exactly once`);
    assert.deepEqual(saved.gear, initial.gear, `stage ${stage} preserved physical gear`);
  }
  const retained = await read();
  const resume = 'http://127.0.0.1:5195/native-selected-session-qa.html?resume&candidate';
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  const restarted = await read();
  assert.equal(restarted.publicationId, retained.publicationId);
  assert.equal(restarted.surveyCount, 4);
  assert.deepEqual(restarted.gear, initial.gear);
  console.log('PASS synthetic setup, real selected EpochApp quest/travel/four survey stages with Save and restart');
} finally { socket.close(); }
