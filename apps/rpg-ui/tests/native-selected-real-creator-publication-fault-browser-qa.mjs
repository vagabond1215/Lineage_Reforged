import assert from 'node:assert/strict';

// Disposable account; character creation runs through the real EpochApp controls.
const origin = process.env.NATIVE_QA_ORIGIN ?? 'http://127.0.0.1:5197';
const debuggerUrl = process.env.NATIVE_QA_DEBUGGER ?? 'http://127.0.0.1:9242';
const url = `${origin}/native-selected-session-qa.html?creator&candidate`;
const targets = await (await fetch(`${debuggerUrl}/json`)).json();
const target = targets.find(entry => entry.url?.startsWith(`${origin}/native-selected-session-qa.html`));
assert.ok(target, 'disposable candidate browser tab is open');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let nextId = 0;
const pending = new Map();
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  const next = pending.get(message.id);
  if (!next) return;
  pending.delete(message.id);
  message.error ? next.reject(new Error(message.error.message)) : next.resolve(message.result);
};
function cdp(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const value = await evaluate(expression);
    if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out: ${expression}; page: ${await evaluate('document.body.innerText.slice(0, 500)')}`);
}
async function click(label) {
  assert.equal(await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(item =>
    item.textContent.trim() === ${JSON.stringify(label)} && !item.disabled);
    if (!button) return false; button.click(); return true; })()`), true, `enabled ${label} control`);
}
async function chooseStep(step, option) {
  await click(step);
  const selected = await evaluate(`document.body.innerText.split('START\\n')[1]?.split('\\nSTR')[0] ?? ''`);
  if (selected.includes(option)) return;
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
  await chooseStep('3Continent', 'The Myridian Chain');
  await chooseStep('4Region', 'Starfall Isle');
  await chooseStep('5Settlement', 'Starfall Port');
  await chooseStep('6Backstory', 'Workshop-Raised');
  await chooseStep('7Starting Bundle', 'Hunter Bundle');
  await click('8Finalize');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Begin Journey')`);
  await click('Begin Journey');
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);

  const report = await evaluate(`(async () => {
    const { openCleanEpochAccountStore } = await import('/src/game-shell/cleanEpochAccountStore.ts');
    const { createNativeSelectedSession, applyNativeSelectedItem, saveNativeSelectedSession } =
      await import('/src/game-shell/nativeSelectedSession.ts');
    const accountId = ${JSON.stringify(accountId)};
    let owner = await openCleanEpochAccountStore();
    const read = async () => {
      const slot = await owner.readSlot(accountId, 'slot-1');
      const account = await owner.readSelected(accountId);
      if (slot.status !== 'ready' || !account) throw new Error('Real creator publication is missing.');
      return { slot, account };
    };
    try {
      const first = await read();
      const source = createNativeSelectedSession({ snapshot: first.slot.loaded.snapshot,
        control: first.slot.loaded.sessionControl, sourceSlotId: 'slot-1', accountRevision: first.account.revision });
      const bow = source.snapshot.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
      if (!bow) throw new Error('Hunter starter bow is missing.');
      const request = { kind: 'gear', expectedRevision: source.snapshot.playerState.gear.revision,
        itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } };
      const moved = applyNativeSelectedItem(source, request, 'native.qa.fault.bow.move');
      if (moved.status !== 'accepted') throw new Error('Owner Unequip was not accepted.');
      const duplicate = applyNativeSelectedItem(moved.session, request, 'native.qa.fault.bow.move');
      const stale = applyNativeSelectedItem(moved.session, request, 'native.qa.fault.bow.stale');
      if (duplicate.status !== 'duplicate' || stale.status !== 'stale' ||
          duplicate.session !== moved.session || stale.session !== moved.session)
        throw new Error('Item duplicate or stale request mutated the selected pair.');
      const before = JSON.stringify(first.slot.loaded.snapshot.playerState.gear);
      const priorPublication = first.slot.loaded.publication.publicationId;
      const priorRevision = first.account.revision;
      owner.close();
      owner = await openCleanEpochAccountStore({ beforeWrite: tx => tx.abort() });
      const preWrite = await saveNativeSelectedSession(owner, moved.session, 'slot-1');
      if (preWrite.status !== 'blocked' || preWrite.session !== moved.session)
        throw new Error('Before-write interruption did not block the exact selected pair.');
      owner.close(); owner = await openCleanEpochAccountStore();
      let retained = await read();
      if (retained.slot.loaded.publication.publicationId !== priorPublication ||
          retained.account.revision !== priorRevision ||
          JSON.stringify(retained.slot.loaded.snapshot.playerState.gear) !== before ||
          await owner.readCurrentDescendantRecovery(accountId, 'slot-1'))
        throw new Error('Before-write rollback changed retained authority.');
      owner.close();
      owner = await openCleanEpochAccountStore({ afterWrite: tx => tx.abort() });
      const postWrite = await saveNativeSelectedSession(owner, moved.session, 'slot-1');
      if (postWrite.status !== 'blocked' || postWrite.session !== moved.session)
        throw new Error('After-write interruption did not block the exact selected pair.');
      owner.close(); owner = await openCleanEpochAccountStore();
      retained = await read();
      if (retained.slot.loaded.publication.publicationId !== priorPublication ||
          retained.account.revision !== priorRevision ||
          JSON.stringify(retained.slot.loaded.snapshot.playerState.gear) !== before ||
          await owner.readCurrentDescendantRecovery(accountId, 'slot-1'))
        throw new Error('After-write rollback changed retained authority.');
      const saved = await saveNativeSelectedSession(owner, moved.session, 'quick-save', null);
      if (saved.status !== 'ready') throw new Error('Exact retry to Quick Save failed: ' + saved.message);
      const quick = await owner.readSlot(accountId, 'quick-save');
      if (quick.status !== 'ready' || quick.loaded.publication.publicationId !== saved.publicationId ||
          quick.loaded.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId)?.location.kind !== 'bag')
        throw new Error('Cross-slot retry lost the physical bow or publication.');
      const wrongDestination = await saveNativeSelectedSession(owner, saved.session, 'slot-1', null);
      if (wrongDestination.status !== 'blocked') throw new Error('Changed destination address was accepted.');
      // Treat the successful return as a lost acknowledgement, then retry its exact old source.
      const lostAckRetry = await saveNativeSelectedSession(owner, moved.session, 'quick-save', null);
      if (lostAckRetry.status !== 'blocked') throw new Error('Lost-ack retry republished the old source.');
      const afterRetry = await owner.readSlot(accountId, 'quick-save');
      if (afterRetry.status !== 'ready' || afterRetry.loaded.publication.publicationId !== saved.publicationId)
        throw new Error('Lost-ack retry changed the retained publication.');
      let obsoleteRejected = false;
      try { createNativeSelectedSession({ snapshot: { ...first.slot.loaded.snapshot,
        snapshotVersion: 'lineage.save_snapshot.v2' }, control: first.slot.loaded.sessionControl,
        sourceSlotId: 'slot-1', accountRevision: priorRevision }); }
      catch (error) { obsoleteRejected = String(error).includes('incompatible with native v3'); }
      if (!obsoleteRejected) throw new Error('Obsolete development snapshot was admitted.');
      const oldSlot = await owner.readSlot(accountId, 'slot-1');
      if (oldSlot.status !== 'ready' || oldSlot.loaded.publication.publicationId !== priorPublication)
        throw new Error('Obsolete rejection changed the preserved source record.');
      owner.close(); owner = await openCleanEpochAccountStore();
      const restart = await owner.readSlot(accountId, 'quick-save');
      if (restart.status !== 'ready' || restart.loaded.publication.publicationId !== saved.publicationId ||
          JSON.stringify(restart.loaded.snapshot.playerState.gear) !==
            JSON.stringify(quick.loaded.snapshot.playerState.gear))
        throw new Error('Restart lost the exact retry publication or gear.');
      return { publicationId: saved.publicationId, bowInstanceId: bow.itemInstanceId,
        durability: bow.durability, beforeWriteRollback: true, afterWriteRollback: true,
        duplicateAndStale: true, changedDestinationRejected: true, lostAckRetry: true,
        obsoleteInputRejectedWithoutDeletion: true, restart: true };
    } finally { owner.close(); }
  })()`);
  assert.equal(report.beforeWriteRollback, true);
  assert.equal(report.afterWriteRollback, true);
  assert.equal(report.duplicateAndStale, true);
  assert.equal(report.changedDestinationRejected, true);
  assert.equal(report.lostAckRetry, true);
  assert.equal(report.obsoleteInputRejectedWithoutDeletion, true);
  assert.equal(report.restart, true);
  console.log('PASS real creator selected-session publication fault, rollback, retry, duplicate, destination and obsolete-input gates', report);
} finally { socket.close(); }
