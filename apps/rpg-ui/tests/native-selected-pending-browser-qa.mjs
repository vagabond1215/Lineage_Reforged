import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:5192/native-gear-v3-publication-qa.html';
const targets = await (await fetch('http://127.0.0.1:9237/json')).json();
const target = targets.find(entry => entry.url?.startsWith(base)) ??
  targets.find(entry => entry.url?.startsWith('http://127.0.0.1:5192/'));
assert.ok(target, 'disposable native pending publication QA tab is open');
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
async function waitForSuite(count) {
  let result = '';
  for (let attempt = 0; attempt < 600; attempt++) {
    result = await evaluate('document.querySelector("#result")?.textContent ?? ""');
    if (new RegExp(`^PASS ${count}\\b|^FAIL `, 'm').test(result)) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.match(result, new RegExp(`^PASS ${count}\\b`), result.slice(0, 600));
  return result;
}
try {
  await cdp('Page.navigate', { url: base });
  const result = await waitForSuite(10);
  assert.match(result, /native creator HP-zero command retains pending defeat before recovery/);
  await cdp('Page.navigate', { url: 'http://127.0.0.1:5192/campaign-clean-epoch-normal-defeat-qa.html' });
  await waitForSuite(8);
  await cdp('Page.navigate', { url: 'http://127.0.0.1:5192/campaign-clean-epoch-terminal-qa.html' });
  await waitForSuite(14);
  console.log('PASS controlled native pending 10/10, v2 Normal defeat 8/8, v2 terminal 14/14; no selected pending reachability claim');
  await cdp('Page.navigate', { url: 'http://127.0.0.1:5192/native-selected-session-qa.html' });
} finally { socket.close(); }
