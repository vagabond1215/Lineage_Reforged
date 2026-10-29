import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:5191/native-selected-session-qa.html';
const targets = await (await fetch('http://127.0.0.1:9236/json')).json();
const target = targets.find(entry => entry.url?.startsWith(base));
assert.ok(target, 'disposable native combat QA tab is open');
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
  for (let attempt = 0; attempt < 150; attempt++) {
    const value = await evaluate(expression);
    if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out: ${expression}`);
}
try {
  await cdp('Page.navigate', { url: `${base}?combat` });
  await waitFor(`location.search === '?combat' && !!document.body.dataset.seeded`);
  assert.equal(await evaluate('document.body.dataset.seeded'), 'true',
    await evaluate('document.body.innerText.slice(0, 400)'));
  assert.equal(await evaluate('document.body.dataset.combat'), 'pass');
  const publicationId = await evaluate('document.body.dataset.publicationId');
  const gearIds = await evaluate('document.body.dataset.gearIds');
  assert.ok(publicationId && gearIds);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-review="true"]')`);
  assert.equal(await evaluate(`document.body.innerText.includes('Native EpochApp Hunter')`), true);
  assert.equal(await evaluate(`[...document.querySelectorAll('button')].some(button =>
    /^(Save|Quick Save)$/.test(button.textContent.trim()) && !button.disabled)`), false);
  await cdp('Page.navigate', { url: `${base}?resume` });
  await waitFor(`location.search === '?resume' && document.body.dataset.seeded === 'resume'`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-review="true"]')`);
  assert.equal(await evaluate(`document.body.innerText.includes('Native EpochApp Hunter')`), true);
  console.log(`PASS synthetic native creator/authored combat/Normal defeat/interrupted Save/restart; selected EpochApp held (${publicationId}; gear ${gearIds})`);
} finally { socket.close(); }
