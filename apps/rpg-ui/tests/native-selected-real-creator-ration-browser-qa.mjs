import assert from 'node:assert/strict';

// Local-only Legacy eligibility gate. A disposable account uses real creator,
// travel, Save, retirement, and Legacy controls without seeding progression.
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
let confirmations = 0;
socket.onmessage = event => { const message = JSON.parse(event.data);
  if (message.method === 'Page.javascriptDialogOpening') {
    confirmations += 1;
    void cdp('Page.handleJavaScriptDialog', { accept: true });
    return;
  }
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
  if (!button) return false; button.click(); return true; })()`), true, `enabled ${label} control`);
  if (label === 'Save') await new Promise(resolve => setTimeout(resolve, 500)); }

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
    if (await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim().includes('Finalize') && !button.disabled)`)) break;
    await click('Randomize Character');
  }
  async function chooseStep(step, option) {
    const summary = await evaluate(`document.body.innerText.split('STR')[0]`);
    if (summary.includes(option)) return;
    assert.equal(await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(item => item.textContent.trim() === ${JSON.stringify(step)}); if (!button || button.disabled) return false; button.click(); return true; })()`), true, `creator step ${step}`);
    await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes(${JSON.stringify(option)}) && !button.disabled)`);
    assert.equal(await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(item => item.textContent.includes(${JSON.stringify(option)}) && !item.disabled); if (!button) return false; button.click(); return true; })()`), true, `creator choice ${option}`);
  }
  await chooseStep('3Continent', 'The Myridian Chain');
  await chooseStep('4Region', 'Starfall Isle');
  await chooseStep('5Settlement', 'Starfall Port');
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
        body: slot.status === 'ready' ? slot.loaded.snapshot.playerState.bodyState : null,
        resources: slot.status === 'ready' ? slot.loaded.snapshot.playerState.resources : null,
        useLedger: slot.status === 'ready' ? slot.loaded.snapshot.nativeInventoryUse : null,
        gear: slot.status === 'ready' ? slot.loaded.snapshot.playerState.gear : null,
        legacy: account?.profile.legacy,
        discoveryTotal: account?.profile.achievements.cumulativeMetrics['account.discovery.entries_total'],
        achievements: account?.profile.achievements.unlocked.map(entry => entry.achievementId) ?? [],
        travelEntries: slot.status === 'ready' ? slot.loaded.snapshot.sessionState.chronicle.filter(entry => entry.category === 'travel').length : 0 }; }
    finally { owner.close(); } })()`);
  const initial = await read();
  assert.equal(initial.status, 'ready');
  assert.equal(initial.surveyCount, 0);
  assert.equal(initial.location.settlementId, 'settlement.starfall_port');
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
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Save' && !button.disabled)`);
  await new Promise(resolve => setTimeout(resolve, 500));
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
  assert.deepEqual(traveled.gear, itemRoundTrip.gear, 'quest/travel preserved physical gear and movement receipts');
  assert.equal(traveled.travelEntries, 1);
  await click('World');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Travel to Starfall Port' && !button.disabled)`);
  await click('Travel to Starfall Port');
  await waitFor(`document.body.innerText.includes('Current location: Starfall Harbormaster')`);
  await click('Save');
  for (let attempt = 0; attempt < 200 && (await read()).travelEntries < 2; attempt++)
    await new Promise(resolve => setTimeout(resolve, 100));
  assert.equal((await read()).travelEntries, 2);
  await click('World');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Travel to Ashen Reef' && !button.disabled)`);
  await click('Travel to Ashen Reef');
  await waitFor(`document.body.innerText.includes('Current location: Survey Anchorage')`);
  await click('Save');
  for (let attempt = 0; attempt < 200 && (await read()).travelEntries < 3; attempt++)
    await new Promise(resolve => setTimeout(resolve, 100));
  const earned = await read();
  assert.equal(earned.travelEntries, 3);
  assert.ok(earned.achievements.includes('achievement.account.long_road'));
  assert.equal(earned.legacy.legacyPoints, 3, 'ordinary Long Road reward grants three Legacy points');
  await click('Retire Character');
  await waitFor(`(async () => { const o = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { return (await o.readSlot(${JSON.stringify(accountId)}, 'slot-1')).status === 'empty'; }
    finally { o.close(); } })()`);
  assert.equal(confirmations, 1);
  const retired = await read();
  assert.equal(retired.legacy.legacyPoints, 3, 'retiring this shallow run grants no unearned Legacy');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Legacy' && !button.disabled)`);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Legacy' && !button.disabled)`);
  await click('Legacy');
  await waitFor(`[...document.querySelectorAll('.creator-forged-card')].some(card => card.textContent.includes('Storehouse Keys'))`);
  const card = await evaluate(`(() => { const card = [...document.querySelectorAll('.creator-forged-card')].find(item => item.textContent.includes('Storehouse Keys'));
    return { text:card?.innerText.slice(0,350), buttons:[...(card?.querySelectorAll('button') ?? [])].map(button => ({text:button.textContent.trim(),disabled:button.disabled})) }; })()`);
  assert.ok(card.text.includes('Requires: Prepared Lineage Tier I'));
  assert.deepEqual(card.buttons, [], 'Storehouse Keys cannot be purchased without Prepared Lineage');
  async function startNextCharacter() {
    await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Characters' && !button.disabled)`);
    await click('Characters');
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
  }
  async function saveUntil(predicate) {
    await click('Save');
    for (let attempt = 0; attempt < 200; attempt++) {
      if (predicate(await read())) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(predicate(await read()), 'selected Save retained the expected progression');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  for (let run = 1; run <= 5; run++) {
    await startNextCharacter();
    await click('Quests');
    await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Accept quest')`);
    await click('Accept quest');
    await waitFor(`document.body.innerText.includes('active · Tracked')`);
    await click('World');
    await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Travel to Ashen Reef' && !button.disabled)`);
    await click('Travel to Ashen Reef');
    await waitFor(`document.body.innerText.includes('Current location: Survey Anchorage')`);
    await saveUntil(state => state.location?.siteLabel === 'Survey Anchorage');
    for (let stage = 1; stage <= 4; stage++) {
      await click('Quests');
      await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Advance Ashen Reef survey shift' && !button.disabled)`);
      await click('Advance Ashen Reef survey shift');
      await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Advance Ashen Reef survey shift' && button.disabled) || ![...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Advance Ashen Reef survey shift')`);
      await saveUntil(state => state.surveyCount === stage);
    }
    await click('Retire Character');
    await waitFor(`(async () => { const o = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
      try { return (await o.readSlot(${JSON.stringify(accountId)}, 'slot-1')).status === 'empty'; }
      finally { o.close(); } })()`);
    const afterRun = await read();
    assert.equal(afterRun.discoveryTotal, run);
    console.log('selected survey life', run, 'discoveries', afterRun.discoveryTotal, 'Legacy', afterRun.legacy.legacyPoints);
  }
  const unlocked = await read();
  assert.ok(unlocked.achievements.includes('achievement.account.finders_ledger'));
  assert.ok(unlocked.legacy.legacyPoints >= 7);
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Legacy' && !button.disabled)`);
  await click('Legacy');
  const legacyCard = title => `[...document.querySelectorAll('.creator-forged-card')].find(card => card.textContent.includes(${JSON.stringify(title)}))`;
  await waitFor(`${legacyCard('Prepared Lineage')}?.querySelector('button')?.textContent.trim() === 'Purchase Rank 1'`);
  await evaluate(`${legacyCard('Prepared Lineage')}.querySelector('button').click()`);
  await waitFor(`${legacyCard('Storehouse Keys')}?.querySelector('button')?.textContent.trim() === 'Purchase'`);
  assert.equal((await read()).legacy.legacyPoints, 3);
  await evaluate(`${legacyCard('Storehouse Keys')}.querySelector('button').click()`);
  await waitFor(`${legacyCard('Storehouse Keys')}?.querySelector('button')?.textContent.trim() === 'Select'`);
  assert.equal((await read()).legacy.legacyPoints, 1);
  await evaluate(`${legacyCard('Storehouse Keys')}.querySelector('button').click()`);
  await waitFor(`${legacyCard('Storehouse Keys')}?.innerText.includes('SELECTED')`);
  await startNextCharacter();
  await click('Inventory');
  const prepared = await read();
  const countRations = state => state.inventory.bags.flatMap(bag => bag.stacks)
    .concat(state.inventory.overflow).filter(stack => stack.itemId === 'item.traveler_ration')
    .reduce((sum, stack) => sum + stack.quantity, 0);
  assert.equal(countRations(prepared), 1, 'authored Storehouse Keys grants one physical Traveler Ration stack');
  assert.equal(prepared.useLedger.revision, 0);
  const rationTarget = await evaluate(`(async () => { const owner = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      const reader = await import('/src/game-shell/nativeSelectedCharacter.ts');
      const stack = reader.readNativeSelectedCharacter(slot.loaded.snapshot).fungibleStacks.find(row => row.itemId === 'item.traveler_ration');
      return { itemId: stack.itemId, itemKey: stack.itemKey, quantity: stack.quantity,
        location: stack.location, expectedRevision: stack.expectedRevision,
        expectedInventoryFingerprint: stack.expectedInventoryFingerprint }; }
    finally { owner.close(); } })()`);
  assert.equal(await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Use Traveler Ration' && !button.disabled)`), true);
  await click('Use Traveler Ration');
  await waitFor(`document.body.innerText.includes('Use Traveler Ration completed.')`);
  assert.equal(await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Use Traveler Ration' && !button.disabled)`), false,
    'used exact stack cannot be selected again');
  await saveUntil(state => state.useLedger.revision === 1);
  const used = await read();
  assert.equal(countRations(used), 0);
  assert.equal(used.useLedger.receipts.length, 1);
  const rejectedRetries = await evaluate(`(async () => { const owner = await (await import('/src/game-shell/cleanEpochAccountStore.ts')).openCleanEpochAccountStore();
    try { const slot = await owner.readSlot(${JSON.stringify(accountId)}, 'slot-1');
      const account = await owner.readSelected(${JSON.stringify(accountId)});
      const actions = await import('/src/game-shell/nativeSelectedSession.ts');
      const session = actions.createNativeSelectedSession({ snapshot:slot.loaded.snapshot,
        control:slot.loaded.sessionControl, sourceSlotId:'slot-1', accountRevision:account.revision });
      const command = { kind:'use', target:${JSON.stringify(rationTarget)} };
      const duplicate = actions.applyNativeSelectedItem(session, command,
        ${JSON.stringify(used.useLedger.receipts[0].requestId)});
      const stale = actions.applyNativeSelectedItem(session, command, 'qa.stale.ration.retry');
      return { duplicate:duplicate.status, stale:stale.status,
        duplicateUnchanged:duplicate.session === session, staleUnchanged:stale.session === session }; }
    finally { owner.close(); } })()`);
  assert.deepEqual(rejectedRetries, { duplicate:'duplicate', stale:'stale',
    duplicateUnchanged:true, staleUnchanged:true });
  for (const field of ['dailyCaloriesConsumed', 'dailyProteinConsumed', 'dailyCarbsConsumed',
    'dailyFatConsumed', 'dailyHydrationConsumed'])
    assert.ok(used.body[field] > prepared.body[field], `authored ${field} increased through lineage metabolism`);
  assert.ok(used.body.energyReserve.quick > prepared.body.energyReserve.quick);
  assert.ok(used.body.hydrationLevel > prepared.body.hydrationLevel);
  assert.deepEqual(used.gear, prepared.gear, 'Use conserved every gear instance and condition');
  const resume = `${origin}/native-selected-session-qa.html?resume&candidate`;
  await cdp('Page.navigate', { url: resume });
  await waitFor(`location.href === ${JSON.stringify(resume)} && document.body.dataset.seeded === 'resume'`);
  const restarted = await read();
  assert.equal(restarted.publicationId, used.publicationId);
  assert.equal(restarted.revision, used.revision);
  assert.deepEqual(restarted.inventory, used.inventory);
  assert.deepEqual(restarted.gear, used.gear);
  assert.deepEqual(restarted.body, used.body);
  assert.deepEqual(restarted.resources, used.resources);
  assert.deepEqual(restarted.useLedger, used.useLedger);
  console.log('PASS real creator, six ordinary lives, Legacy purchases, exact Traveler Ration Use and same-campaign Save/restart', {
    earnedLegacy: unlocked.legacy.legacyPoints, discoveries: unlocked.discoveryTotal,
    useReceipts: used.useLedger.receipts.length, publicationId: used.publicationId });
} finally { socket.close(); }
