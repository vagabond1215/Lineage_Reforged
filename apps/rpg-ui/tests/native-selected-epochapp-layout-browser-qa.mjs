import assert from 'node:assert/strict';

const url = 'http://127.0.0.1:5195/native-selected-session-qa.html?route=survey&candidate';
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
try {
  await cdp('Page.navigate', { url });
  await waitFor(`location.href === ${JSON.stringify(url)} && document.body.dataset.seeded === 'true'`);
  await waitFor(`[...document.querySelectorAll('[role="button"]')].some(row => row.textContent.startsWith('1Native'))`);
  await evaluate(`[...document.querySelectorAll('[role="button"]')].find(row => row.textContent.startsWith('1Native')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  for (const width of [375, 768, 1440]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: width === 375 ? 667 : 900,
      deviceScaleFactor: 1, mobile: width === 375 });
    const layout = await evaluate(`({ width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
      resources:[...document.querySelectorAll('[aria-label="Character resources"]')].length,
      character:[...document.querySelectorAll('button')].some(button => button.textContent.trim()==='Character'),
      save:[...document.querySelectorAll('button')].some(button => button.textContent.trim()==='Save') })`);
    assert.equal(layout.width, width);
    assert.ok(layout.scrollWidth <= width, `${width}px layout has no page horizontal overflow: ${layout.scrollWidth}`);
    assert.equal(layout.resources, 1);
    assert.ok(layout.character && layout.save);
  }
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  const focused = await evaluate(`({ tag:document.activeElement?.tagName,
    text:document.activeElement?.textContent?.trim().slice(0,50) })`);
  assert.equal(focused.tag, 'BUTTON', 'keyboard Tab reaches a native candidate control');
  await cdp('Emulation.clearDeviceMetricsOverride');
  console.log('PASS local native candidate layout 375/768/1440 and keyboard focus');
} finally { socket.close(); }
