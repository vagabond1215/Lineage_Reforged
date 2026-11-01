import assert from 'node:assert/strict';

// Disposable account, real EpochApp creator and selected retirement control.
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
let confirmations = 0;
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Page.javascriptDialogOpening') {
    confirmations += 1;
    void cdp('Page.handleJavaScriptDialog', { accept: true });
    return;
  }
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
  await cdp('Page.enable');
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
      return { slotStatus: slot.status, revision: account?.revision,
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
  for (const width of [375, 768, 1440]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: width === 375 ? 667 : 900,
      deviceScaleFactor: 1, mobile: width === 375 });
    const layout = await evaluate(`(() => { const button = [...document.querySelectorAll('button')]
      .find(item => item.textContent.trim() === 'Retire Character');
      return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        button: button ? button.getBoundingClientRect().toJSON() : null }; })()`);
    assert.equal(layout.width, width);
    assert.ok(layout.scrollWidth <= width, `${width}px has no page horizontal overflow`);
    assert.ok(layout.button && layout.button.left >= 0 && layout.button.right <= width,
      `${width}px retains the retirement control`);
  }
  await cdp('Emulation.clearDeviceMetricsOverride');
  assert.equal(await evaluate(`(() => { const button = [...document.querySelectorAll('button')]
    .find(item => item.textContent.trim() === 'Retire Character');
    if (!button || button.disabled) return false; button.focus(); return document.activeElement === button; })()`), true);
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitFor(`(async () => { const owner = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      return slot.status === 'empty'; }
    finally { owner.close(); } })()`);
  const retired = await read();
  assert.equal(confirmations, 1, 'retirement required one actual confirmation');
  assert.ok(retired.revision > initial.revision);
  assert.equal(retired.slotStatus, 'empty');
  assert.equal(retired.history.length, initial.history.length, 'one active run became one archived run');
  assert.equal(retired.history.at(-1).reason, 'retired');
  assert.equal(retired.history.at(-1).characterId, initial.playerId);
  assert.equal(retired.history.at(-1).outcome, 'archived');
  const resume = `${origin}/native-selected-session-qa.html?resume&candidate`;
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  const restarted = await read();
  assert.equal(restarted.slotStatus, 'empty', 'restart retained closed slot');
  assert.deepEqual(restarted.history, retired.history, 'restart retained the same archived run');
  console.log('PASS real EpochApp creator selected native retirement and retained history');
} finally { socket.close(); }
