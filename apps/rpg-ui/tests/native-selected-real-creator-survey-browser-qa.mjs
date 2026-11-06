import assert from 'node:assert/strict';

// Local-only gate: a disposable account uses the real EpochApp creator controls.
// No character, quest, location, or survey state is preseeded.
const origin = process.env.NATIVE_QA_ORIGIN ?? 'http://127.0.0.1:5196';
const debuggerUrl = process.env.NATIVE_QA_DEBUGGER ?? 'http://127.0.0.1:9241';
const url = `${origin}/native-selected-session-qa.html?creator&candidate`;
const targets = await (await fetch(`${debuggerUrl}/json`)).json();
const target = targets.find(entry => entry.url?.startsWith(`${origin}/native-selected-session-qa.html`));
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
  await waitFor(`location.href === ${JSON.stringify(url)} && document.body.dataset.seeded === 'creator'`);
  const accountId = await evaluate('document.body.dataset.accountId');
  assert.ok(accountId);
  await waitFor(`[...document.querySelectorAll('[role="button"]')].some(row => row.textContent.startsWith('1Empty'))`);
  await evaluate(`[...document.querySelectorAll('[role="button"]')].find(row => row.textContent.startsWith('1Empty')).click()`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Randomize Character')`);
  for (let attempt = 0; attempt < 24; attempt++) {
    if (await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim().includes('Finalize') && !button.disabled)`)) break;
    await click('Randomize Character');
  }
  async function chooseStep(step, option) {
    assert.equal(await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(item => item.textContent.trim() === ${JSON.stringify(step)}); if (!button || button.disabled) return false; button.click(); return true; })()`), true, `creator step ${step}`);
    await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes(${JSON.stringify(option)}) && !button.disabled)`);
    assert.equal(await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(item => item.textContent.includes(${JSON.stringify(option)}) && !item.disabled); if (!button) return false; button.click(); return true; })()`), true, `creator choice ${option}`);
  }
  await chooseStep('3Continent', 'The Myridian Chain');
  await chooseStep('4Region', 'Starfall Isle');
  await chooseStep('5Settlement', 'Harbormast Quay');
  await chooseStep('6Backstory', 'Workshop-Raised');
  await chooseStep('7Starting Bundle', 'Hunter Bundle');
  assert.equal(await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === '8Finalize' && !button.disabled)`), true);
  await click('8Finalize');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Begin Journey')`);
  await click('Begin Journey');
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  const read = () => evaluate(`(async () => { const owner = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      const account = await owner.readSelected(${JSON.stringify(accountId)});
      return { status: slot.status, revision: account?.revision,
        publicationId: slot.status === 'ready' ? slot.loaded.publication.publicationId : null,
        surveyCount: slot.status === 'ready' ? slot.loaded.snapshot.nativeSurvey?.results.length ?? 0 : 0,
        activeQuests: slot.status === 'ready' ? slot.loaded.snapshot.playerState.activeQuestIds : [],
        location: slot.status === 'ready' ? slot.loaded.snapshot.playerState.location : null,
        inventory: slot.status === 'ready' ? slot.loaded.snapshot.playerState.inventory : null,
        gold: slot.status === 'ready' ? slot.loaded.snapshot.playerState.currency.gold : null,
        turnIn: slot.status === 'ready' ? slot.loaded.snapshot.nativeSoundingsTurnIn ?? null : null,
        quest: slot.status === 'ready' ? slot.loaded.snapshot.sessionState.questJournal.find(row => row.id === 'quest.ashen_reef_survey') ?? null : null,
        gear: slot.status === 'ready' ? slot.loaded.snapshot.playerState.gear : null }; }
    finally { owner.close(); } })()`);
  const initial = await read();
  assert.equal(initial.status, 'ready');
  assert.equal(initial.surveyCount, 0);
  assert.equal(initial.location.settlementId, 'settlement.harbormast_quay');
  assert.ok(initial.gear.instances.some(item => item.itemId === 'item.short_bow' && item.location.kind === 'worn'));
  const bow = initial.gear.instances.find(item => item.itemId === 'item.short_bow');
  const bowSlot = bow.location.slotId;
  assert.equal(await evaluate(`[...document.querySelectorAll('[data-slot-id]')].some(row => row.dataset.slotId === ${JSON.stringify(bowSlot)} && [...row.querySelectorAll('button')].some(button => button.textContent.trim() === 'Unequip' && !button.disabled))`), true);
  await evaluate(`[...document.querySelectorAll('[data-slot-id]')].find(row => row.dataset.slotId === ${JSON.stringify(bowSlot)}).querySelectorAll('button')[1].click()`);
  await waitFor(`document.body.innerText.includes('Unequip Short Bow completed.')`);
  await click('Inventory');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Equip Short Bow' && !button.disabled)`);
  await click('Equip Short Bow');
  await waitFor(`document.body.innerText.includes('Equip Short Bow completed.')`);
  assert.deepEqual((await read()).gear, initial.gear, 'unsaved owner action round trip did not alter retained gear');
  assert.equal(await evaluate(`[...document.querySelectorAll('button')].filter(button => button.textContent.trim().startsWith('Use ')).every(button => button.disabled)`), true,
    'starter stacks without authored effects are not presented as usable');
  await click('Save');
  for (let attempt = 0; attempt < 200; attempt++) {
    if ((await read()).revision > initial.revision) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const itemRoundTrip = await read();
  assert.ok(itemRoundTrip.revision > initial.revision);
  assert.deepEqual(itemRoundTrip.gear.instances, initial.gear.instances,
    'equip/unequip conserved physical identity, durability and location');
  assert.equal(itemRoundTrip.gear.revision, initial.gear.revision + 2, 'both movements were recorded once');
  assert.deepEqual(itemRoundTrip.inventory, initial.inventory, 'equip/unequip conserved stack quantities and locations');
  for (const width of [375, 768, 1440]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: width === 375 ? 667 : 900,
      deviceScaleFactor: 1, mobile: width === 375 });
    const layout = await evaluate(`({ width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
      resources:!!document.querySelector('[aria-label="Character resources"]'),
      save:[...document.querySelectorAll('button')].some(button => button.textContent.trim()==='Save' && !button.disabled) })`);
    assert.equal(layout.width, width);
    assert.ok(layout.scrollWidth <= width, `${width}px has no page horizontal overflow: ${layout.scrollWidth}`);
    assert.ok(layout.resources && layout.save, `${width}px retains resources and Save controls`);
  }
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert.equal(await evaluate(`document.activeElement?.tagName`), 'BUTTON', 'keyboard Tab reaches a control');
  await cdp('Emulation.clearDeviceMetricsOverride');
  await click('World');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Board passenger passage to Starfall Port' && !button.disabled)`);
  await click('Board passenger passage to Starfall Port');
  await waitFor(`document.body.innerText.includes("Current location: Starfall Harbormaster's Office")`);
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
    try { const slot = await o.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      return slot.status === 'ready' && slot.loaded.snapshot.playerState.location.siteLabel === 'Survey Anchorage'; }
    finally { o.close(); } })()`);
  const traveled = await read();
  assert.ok(traveled.revision > initial.revision);
  assert.deepEqual(traveled.gear, itemRoundTrip.gear, 'quest/travel preserved physical gear and movement receipts');
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
    assert.deepEqual(saved.gear, itemRoundTrip.gear, `stage ${stage} preserved physical gear`);
  }
  const retained = await read();
  const resume = `${origin}/native-selected-session-qa.html?resume&candidate`;
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  const restarted = await read();
  assert.equal(restarted.publicationId, retained.publicationId);
  assert.equal(restarted.surveyCount, 4);
  assert.deepEqual(restarted.gear, itemRoundTrip.gear);
  assert.deepEqual(restarted.inventory, initial.inventory);
  await click('World');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Travel to Starfall Port' && !button.disabled)`);
  await click('Travel to Starfall Port');
  await waitFor(`document.body.innerText.includes("Current location: Starfall Harbormaster's Office")`);
  assert.equal((await read()).location.siteLabel, 'Survey Anchorage',
    'return remains unpublished until Save');
  await click('Save');
  await waitFor(`(async () => { const o = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await o.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      return slot.status === 'ready' && slot.loaded.snapshot.playerState.location.settlementId === 'settlement.starfall_port'; }
    finally { o.close(); } })()`);
  for (let attempt = 0; attempt < 200; attempt++) {
    if ((await read()).revision > restarted.revision) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const returned = await read();
  assert.ok(returned.revision > restarted.revision);
  assert.equal(returned.surveyCount, 4);
  assert.deepEqual(returned.gear, itemRoundTrip.gear);
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  const returnedReload = await read();
  assert.equal(returnedReload.publicationId, returned.publicationId);
  assert.equal(returnedReload.location.settlementId, 'settlement.starfall_port');
  assert.equal(returnedReload.surveyCount, 4);
  await click('Quests');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Submit Soundings — 5 gold' && !button.disabled)`);
  await click('Submit Soundings — 5 gold');
  await waitFor(`document.body.innerText.includes('completed · Turned in')`);
  assert.equal((await read()).gold, returnedReload.gold, 'payment remains unpublished until Save');
  assert.equal(await evaluate(`(async () => {
    const { CleanEpochAccountStore } = await import('/src/game-shell/cleanEpochAccountStore.ts');
    const original = CleanEpochAccountStore.prototype.publishDescendant;
    CleanEpochAccountStore.prototype.publishDescendant = async function (...args) {
      CleanEpochAccountStore.prototype.publishDescendant = original;
      const prior = this.afterWrite;
      this.afterWrite = tx => tx.abort();
      try { return await original.apply(this, args); }
      finally { this.afterWrite = prior; document.body.dataset.soundingsFault = 'after-write'; }
    };
    return true;
  })()`), true);
  await click('Save');
  await waitFor(`document.body.dataset.soundingsFault === 'after-write'`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Retry campaign data')`);
  const rejectedPayment = await read();
  assert.equal(rejectedPayment.publicationId, returnedReload.publicationId);
  assert.equal(rejectedPayment.gold, returnedReload.gold);
  assert.equal(rejectedPayment.turnIn, null);
  await click('Retry campaign data');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  await click('Quests');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Submit Soundings — 5 gold' && !button.disabled)`);
  await click('Submit Soundings — 5 gold');
  await waitFor(`document.body.innerText.includes('completed · Turned in')`);
  await click('Save');
  await waitFor(`(async () => { const o = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await o.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      return slot.status === 'ready' && !!slot.loaded.snapshot.nativeSoundingsTurnIn; }
    finally { o.close(); } })()`);
  const paid = await read();
  assert.equal(paid.gold, returnedReload.gold + 5);
  assert.equal(paid.quest.category, 'completed');
  assert.deepEqual(paid.gear, returnedReload.gear);
  assert.equal(paid.surveyCount, 4);
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('Continue'))`);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Continue')).click()`);
  await waitFor(`!!document.querySelector('[data-native-candidate="true"]')`);
  const paidReload = await read();
  assert.equal(paidReload.publicationId, paid.publicationId);
  assert.equal(paidReload.gold, paid.gold);
  assert.deepEqual(paidReload.turnIn, paid.turnIn);
  assert.equal(paidReload.quest.category, 'completed');
  const durableRetry = await evaluate(`(async () => {
    const { openCleanEpochAccountStore } = await import('/src/game-shell/cleanEpochAccountStore.ts');
    const { createNativeSelectedSession } = await import('/src/game-shell/nativeSelectedSession.ts');
    const { advanceNativeSelectedSoundingsTurnIn } = await import('/src/game-shell/nativeSelectedGameplay.ts');
    const owner = await openCleanEpochAccountStore();
    try { const slot = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      const account = await owner.readSelected(${JSON.stringify(accountId)});
      const session = createNativeSelectedSession({ snapshot: slot.loaded.snapshot,
        control: slot.loaded.sessionControl, sourceSlotId: 'slot-1', accountRevision: account.revision });
      const result = await advanceNativeSelectedSoundingsTurnIn(owner, session,
        session.snapshot.nativeSoundingsTurnIn.requestId);
      const current = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      return { status: result.status, same: result.session === session,
        gold: current.loaded.snapshot.playerState.currency.gold,
        publicationId: current.loaded.publication.publicationId };
    } finally { owner.close(); }
  })()`);
  assert.equal(durableRetry.status, 'duplicate');
  assert.equal(durableRetry.same, true);
  assert.equal(durableRetry.gold, paid.gold);
  assert.equal(durableRetry.publicationId, paid.publicationId);
  await click('Quests');
  assert.equal(await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Submit Soundings — 5 gold')`), false);
  await click('Quick Save');
  await waitFor(`(async () => { const o = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { return (await o.readSlot(${JSON.stringify(accountId)}, 'quick-save')).status === 'ready'; }
    finally { o.close(); } })()`);
  const crossSlot = await evaluate(`(async () => { const o = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await o.readSlot(${JSON.stringify(accountId)}, 'quick-save');
      return { gold: slot.loaded.snapshot.playerState.currency.gold,
        turnIn: slot.loaded.snapshot.nativeSoundingsTurnIn,
        survey: slot.loaded.snapshot.nativeSurvey,
        gear: slot.loaded.snapshot.playerState.gear }; }
    finally { o.close(); } })()`);
  assert.equal(crossSlot.gold, paid.gold);
  assert.deepEqual(crossSlot.turnIn, paid.turnIn);
  assert.deepEqual(crossSlot.gear, paid.gear);
  assert.equal(crossSlot.survey.results.length, 4);
  console.log('PASS real EpochApp creator Harbormast/Hunter, passenger, selected four survey stages, Reef return, one Soundings payment, Save and same-account restart');
} finally { socket.close(); }
