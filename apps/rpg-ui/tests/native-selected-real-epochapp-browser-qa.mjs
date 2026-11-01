import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:5195/native-selected-session-qa.html?creator&candidate';
const targets = await (await fetch('http://127.0.0.1:9240/json')).json();
const target = targets.find(entry => entry.url?.startsWith('http://127.0.0.1:5195/native-selected-session-qa.html'));
assert.ok(target, 'disposable real EpochApp creator tab is open');
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
async function waitFor(expression) { for (let attempt = 0; attempt < 150; attempt++) {
  const value = await evaluate(expression); if (value) return value;
  await new Promise(resolve => setTimeout(resolve, 100)); }
  throw new Error(`Timed out: ${expression}`); }
try {
  await cdp('Page.navigate', { url: base });
  await waitFor(`location.href === ${JSON.stringify(base)} && document.body.dataset.seeded === 'creator'`);
  await waitFor(`[...document.querySelectorAll('[role="button"]')].some(row => row.textContent.startsWith('1Empty'))`);
  await evaluate(`[...document.querySelectorAll('[role="button"]')].find(row => row.textContent.startsWith('1Empty')).click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Randomize Character')`);
  for (let attempt = 0; attempt < 24; attempt++) {
    if (await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim().includes('Finalize') && !button.disabled)`)) break;
    await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Randomize Character').click()`);
    await new Promise(resolve => setTimeout(resolve, 75));
  }
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim().includes('Finalize') && !button.disabled)`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim().includes('Finalize')).click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Begin Journey')`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Begin Journey').click()`);
  await waitFor(`![...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Begin Journey') &&
    [...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Inventory')`);
  const record = await evaluate(`(async () => { const owner = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await owner.readSlot(document.body.dataset.accountId, 'slot-1');
      return { status: slot.status, version: slot.status === 'ready' ? slot.loaded.snapshot.snapshotVersion : null }; }
    finally { owner.close(); } })()`);
  assert.equal(record.status, 'ready', 'real EpochApp creator published a ready slot');
  assert.equal(record.version, 'lineage.save_snapshot.v3', 'real EpochApp creator must publish native v3');
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  const accountId = await evaluate(`document.body.dataset.accountId`);
  assert.ok(accountId);
  const read = async () => evaluate(`(async () => { const owner = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      const account = await owner.readSelected(${JSON.stringify(accountId)});
      return { status: slot.status, revision: account?.revision,
        publicationId: slot.status === 'ready' ? slot.loaded.publication.publicationId : null,
        gear: slot.status === 'ready' ? slot.loaded.snapshot.playerState.gear : null }; }
    finally { owner.close(); } })()`);
  const initial = await read();
  const wornSlot = await evaluate(`[...document.querySelectorAll('[data-slot-id]')].find(row =>
    [...row.querySelectorAll('button')].some(button => button.textContent.trim() === 'Unequip' && !button.disabled))?.dataset.slotId`);
  assert.ok(wornSlot, 'real Character panel has an enabled worn-item action');
  const worn = initial.gear.instances.find(item => item.location.kind === 'worn' && item.location.slotId === wornSlot);
  assert.ok(worn, 'selected UI slot has a retained physical instance');
  await evaluate(`[...document.querySelectorAll('[data-slot-id]')].find(row => row.dataset.slotId === ${JSON.stringify(wornSlot)})
    .querySelectorAll('button')[1].click()`);
  await waitFor(`document.body.innerText.includes('Unequip') && document.body.innerText.includes('completed.')`);
  const beforeSave = await read();
  assert.equal(beforeSave.revision, initial.revision, 'unsaved item action did not publish an account head');
  assert.deepEqual(beforeSave.gear, initial.gear, 'unsaved item action did not mutate retained gear');
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Save').click()`);
  for (let attempt = 0; attempt < 150; attempt++) {
    const current = await read();
    if (current.revision > initial.revision) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const saved = await read();
  assert.ok(saved.revision > initial.revision, 'real EpochApp Save published a descendant');
  assert.notEqual(saved.publicationId, initial.publicationId);
  assert.deepEqual(saved.gear.instances.map(item => [item.itemInstanceId, item.itemId, item.durability]).sort(),
    initial.gear.instances.map(item => [item.itemInstanceId, item.itemId, item.durability]).sort(),
    'Save conserved every physical gear identity and durability');
  assert.equal(saved.gear.instances.find(item => item.itemInstanceId === worn.itemInstanceId)?.location.kind,
    'bag', 'Save retained the item movement exactly once');
  const resume = 'http://127.0.0.1:5195/native-selected-session-qa.html?resume&candidate';
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Inventory').click()`);
  await waitFor(`!!document.querySelector('[aria-label="Carried gear"]')`);
  assert.equal(await evaluate(`document.body.innerText.includes(${JSON.stringify(worn.itemInstanceId)})`), true,
    'restarted selected Inventory shows the same physical instance');
  const restarted = await read();
  assert.equal(restarted.publicationId, saved.publicationId);
  assert.deepEqual(restarted.gear, saved.gear);
  const profileName = `Native Selected QA ${accountId.slice(-8)}`;
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Return to menu').click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === ${JSON.stringify(profileName)})`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === ${JSON.stringify(profileName)}).click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Log Out')`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Log Out').click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim().startsWith(${JSON.stringify(profileName)}))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim().startsWith(${JSON.stringify(profileName)})).click()`);
  await waitFor(`!!document.querySelector('input[type=password]')`);
  await evaluate(`document.querySelector('input[type=password]').focus()`);
  await cdp('Input.insertText', { text: 'synthetic-only-password' });
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Log In').click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  const signedIn = await read();
  assert.equal(signedIn.publicationId, saved.publicationId, 'signed-in account reopened the same campaign head');
  assert.deepEqual(signedIn.gear, saved.gear);
  const normalCreator = 'http://127.0.0.1:5195/native-selected-session-qa.html?creator';
  await cdp('Page.navigate', { url: normalCreator });
  await waitFor(`location.href === ${JSON.stringify(normalCreator)} && document.body.dataset.seeded === 'creator'`);
  await waitFor(`[...document.querySelectorAll('[role="button"]')].some(row => row.textContent.startsWith('1Empty'))`);
  await evaluate(`[...document.querySelectorAll('[role="button"]')].find(row => row.textContent.startsWith('1Empty')).click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Randomize Character')`);
  for (let attempt = 0; attempt < 24; attempt++) {
    if (await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim().includes('Finalize') && !button.disabled)`)) break;
    await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Randomize Character').click()`);
    await new Promise(resolve => setTimeout(resolve, 75));
  }
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim().includes('Finalize') && !button.disabled)`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim().includes('Finalize')).click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Begin Journey')`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Begin Journey').click()`);
  await waitFor(`!!document.querySelector('[data-game-shell]') ||
    [...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Inventory')`);
  const defaultRecord = await evaluate(`(async () => { const owner = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await owner.readSlot(document.body.dataset.accountId, 'slot-1');
      return slot.status === 'ready' ? slot.loaded.snapshot.snapshotVersion : null; }
    finally { owner.close(); } })()`);
  assert.equal(defaultRecord, 'lineage.save_snapshot.v2', 'normal EpochApp creator remains v2 while activation is held');
  console.log('PASS QA-only real EpochApp native creator/Character/Save/restart/sign-in and default v2 hold');
} finally { socket.close(); }
