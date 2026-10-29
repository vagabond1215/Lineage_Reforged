import assert from 'node:assert/strict';

const targets = await (await fetch('http://127.0.0.1:9233/json')).json();
const target = targets.find(entry => entry.url?.startsWith('http://127.0.0.1:5188/native-character-panel-qa.html'));
assert.ok(target, 'isolated native Character QA page is open');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let sequence = 0;
const pending = new Map();
socket.onmessage = event => {
  const response = JSON.parse(event.data);
  const awaiting = pending.get(response.id);
  if (!awaiting) return;
  pending.delete(response.id);
  response.error ? awaiting.reject(new Error(response.error.message)) : awaiting.resolve(response.result);
};
function cdp(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function state() {
  return evaluate(`(() => {
    const output = document.querySelector('#native-qa-state');
    return output && {
      gearRevision: Number(output.dataset.gearRevision),
      bowLocation: output.dataset.bowLocation,
      breadQuantity: Number(output.dataset.breadQuantity),
      retainedMutations: Number(output.dataset.retainedMutations),
      slotCount: document.querySelectorAll('[data-slot-id]').length,
      focused: document.activeElement?.textContent?.trim(),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  })()`);
}
async function until(predicate) {
  for (let i = 0; i < 60; i++) {
    const current = await state();
    if (current && predicate(current)) return current;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for owner state: ${JSON.stringify(await state())}`);
}
async function click(text) {
  const found = await evaluate(`(() => {
    const button = [...document.querySelectorAll('button')].find(item => item.textContent.trim() === ${JSON.stringify(text)});
    if (!button || button.disabled) return false;
    button.click(); return true;
  })()`);
  assert.equal(found, true, `enabled ${text} button exists`);
}
try {
  await cdp('Page.navigate', { url: 'http://127.0.0.1:5188/native-character-panel-qa.html' });
  for (const width of [1440, 768, 375]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: width === 375 ? 667 : 900, deviceScaleFactor: 1, mobile: width === 375 });
    const current = await until(item => item.slotCount === 38);
    assert.equal(current.horizontalOverflow, false, `${width}px viewport has no document overflow`);
  }
  let current = await state();
  const initialRevision = current.gearRevision;
  assert.deepEqual([current.bowLocation, current.breadQuantity, current.retainedMutations], ['worn', 2, 0]);
  await cdp('Page.bringToFront');
  await evaluate(`document.querySelector('button[aria-label="Inspect Short Bow in Weapon Right"]').focus()`);
  assert.match((await state()).focused, /Short Bow/);
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  let inspected = false;
  for (let i = 0; i < 20; i++) {
    inspected = await evaluate(`!!document.querySelector('[aria-label="Selected gear details"]')`);
    if (inspected) break;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.equal(inspected, true, 'keyboard Enter inspects gear');
  await click('Unequip');
  current = await until(item => item.bowLocation === 'bag');
  assert.deepEqual([current.gearRevision, current.retainedMutations], [initialRevision + 1, 1]);
  await click('Inventory');
  await click('Equip Short Bow');
  current = await until(item => item.bowLocation === 'worn');
  assert.deepEqual([current.gearRevision, current.retainedMutations], [initialRevision + 2, 2]);
  await click('Use Bread Loaf');
  current = await until(item => item.breadQuantity === 1);
  assert.deepEqual([current.gearRevision, current.retainedMutations], [initialRevision + 2, 3]);
  await cdp('Page.navigate', { url: 'http://127.0.0.1:5188/native-character-panel-qa.html?selected' });
  let selected = false;
  for (let i = 0; i < 60; i++) {
    selected = await evaluate(`!!document.querySelector('[data-native-review="true"]')`);
    if (selected) break;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.equal(selected, true, 'actual InGameShell native review branch renders');
  for (const width of [1440, 768, 375]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: width === 375 ? 667 : 900, deviceScaleFactor: 1, mobile: width === 375 });
    assert.equal(await evaluate(`document.querySelectorAll('[data-slot-id]').length`), 38);
    assert.equal(await evaluate(`document.documentElement.scrollWidth > document.documentElement.clientWidth`), false,
      `selected shell fits ${width}px`);
  }
  assert.equal(await evaluate(`(() => { const actions = [...document.querySelectorAll('button')].filter(button => button.textContent.trim() === 'Unequip'); return actions.length > 0 && actions.every(button => button.disabled); })()`), true);
  assert.equal(await evaluate(`[...document.querySelectorAll('button')].some(button => /^(Save|Quick Save|World)$/.test(button.textContent.trim()))`), false);
  await evaluate(`document.querySelectorAll('nav[aria-label="Gameplay destinations"] button')[1].focus()`);
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  assert.equal(await evaluate(`!!document.querySelector('[aria-label="Stack inventory"]')`), true);
  assert.equal(await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Use Bread Loaf')?.disabled`), true);
  await click('Return to menu');
  assert.equal(await evaluate(`document.querySelector('[data-returned]')?.dataset.returned`), 'true');
  console.log('PASS synthetic browser: 38 native slots, 1440/768/375 no document overflow, keyboard inspection, Equip/Unequip/Use atomic snapshot/control, selected InGameShell read-only navigation and return');
} finally {
  socket.close();
}
