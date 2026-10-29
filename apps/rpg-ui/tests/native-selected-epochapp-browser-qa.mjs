import assert from 'node:assert/strict';

const targets = await (await fetch('http://127.0.0.1:9234/json')).json();
const target = targets.find(entry => entry.url?.startsWith('http://127.0.0.1:5189/native-selected-session-qa.html'));
assert.ok(target, 'disposable selected EpochApp QA tab is open');
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
function cdp(method, params = {}) { const requestId = ++id;
  return new Promise((resolve, reject) => { pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params })); }); }
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 120; attempt++) {
    const value = await evaluate(expression);
    if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out: ${expression}`);
}
try {
  async function openSelected(url, seeded) {
    await cdp('Page.navigate', { url });
    await waitFor(`location.href === ${JSON.stringify(url)} && document.body.dataset.seeded === ${JSON.stringify(seeded)}`);
    await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
    await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
    await waitFor(`!!document.querySelector('[data-native-review="true"]')`);
  }
  const baseUrl = 'http://127.0.0.1:5189/native-selected-session-qa.html';
  await openSelected(baseUrl, 'true');
  const heldActions = await evaluate(`({
    unequip: [...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Unequip' && !button.disabled),
    save: [...document.querySelectorAll('button')].some(button => /^(Save|Quick Save)$/.test(button.textContent.trim()) && !button.disabled)
  })`);
  assert.deepEqual(heldActions, { unequip: false, save: false }, 'real EpochApp selected activation remains held');
  await openSelected(`${baseUrl}?host`, 'true');
  assert.equal(await evaluate(`document.body.dataset.host`), 'pass', 'host action and Save/restart passed');
  const instanceId = await evaluate(`document.body.dataset.bowInstanceId`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Inventory').click()`);
  await waitFor(`!!document.querySelector('[aria-label="Carried gear"]')`);
  assert.equal(await evaluate(`document.body.innerText.includes(${JSON.stringify(instanceId)})`), true,
    'real EpochApp reads saved native instance in Inventory');
  await openSelected(`${baseUrl}?resume`, 'resume');
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Inventory').click()`);
  await waitFor(`!!document.querySelector('[aria-label="Carried gear"]')`);
  assert.equal(await evaluate(`document.body.innerText.includes(${JSON.stringify(instanceId)})`), true,
    'real EpochApp reloads the same native instance after page restart');
  console.log('PASS synthetic real EpochApp: selected v3 remains read-only; native session item action, account Save/readback and page restart preserve exact physical instance');
} finally { socket.close(); }
