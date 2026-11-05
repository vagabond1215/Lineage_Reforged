import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from
  '../src/game-shell/characterCreationCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
test.after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/newGameSnapshot.ts');
const { createCampaignSessionControl } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { createNativeSelectedSession } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedSession.ts');
const { createNativeSelectedTravelCommand, applyNativeSelectedTravel,
  createNativeSelectedQuestCommand, applyNativeSelectedQuest } = await
  vite.ssrLoadModule('/src/game-shell/nativeSelectedGameplay.ts');
const { getCurrentPlayerTravelLocationId, resolvePlayerTravelPlan } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-travel-rules.ts');
const { createPlayerTravelCommand, executePlayerTravelCommand } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-travel.ts');
const { serializeSnapshot, deserializeSnapshot } = await
  vite.ssrLoadModule('/../../packages/shared/persistence/src/index.ts');
const { readNativeFreshSaveSnapshot, buildNativeGearArtifactPublication } = await
  vite.ssrLoadModule('/src/game-shell/saveManager.ts');
const { isNativeTargetCampaignSnapshot } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-campaign-rules.ts');
const { NativeSelectedCandidatePanel } = await vite.ssrLoadModule('/src/game-shell/NativeSelectedCandidatePanel.tsx');
const { advanceClock } = await vite.ssrLoadModule('/../../packages/shared/time/src/index.ts');
const { advancePlayerBodyState, applyConsumableToBodyState } = await
  vite.ssrLoadModule('/../../packages/engines/player-engine/src/index.ts');
const { applyPassengerServiceAtTick } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-travel-rules.ts');

const STARFALL = 'settlement.starfall_port';
const HARBORMAST = 'settlement.harbormast_quay';
const QUEST = 'quest.ashen_reef_survey';

function form(settlementId = HARBORMAST) {
  const identity = getLineageIdentityCatalog('lineage.human');
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Passage Hunter',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.local',
    continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
    startingSettlementId: settlementId, startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter') };
}

function session(snapshot) {
  const control = createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.passage.1',
    publicationId: 'publication.passage.1', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.passage.1', headRevision: 1, sourceSnapshot: snapshot });
  return createNativeSelectedSession({ snapshot, control, sourceSlotId: 'slot-1', accountRevision: 2 });
}

test('real Harbormast creator and selected World caller board the authored passage and receive one offer', async () => {
  const created = createNativeNewGameSnapshot(form(), 'account.passage');
  const start = session(created);
  const originalGear = structuredClone(created.playerState.gear);
  assert.equal(isNativeTargetCampaignSnapshot(created), true);
  assert.deepEqual(created.sessionState.questJournal, []);
  assert.equal(getCurrentPlayerTravelLocationId(created), HARBORMAST);
  const plan = resolvePlayerTravelPlan(created, STARFALL);
  assert.equal(plan.accepted, true, plan.reason);
  assert.equal(plan.facts.travelTicks, 120);
  assert.equal(plan.timeline.length, 120);
  for (const index of [22, 46, 70, 94, 118]) {
    const body = plan.timeline[index];
    assert.equal(body.dailyCaloriesConsumed, 100);
    assert.equal(body.dailyProteinConsumed, 18);
    assert.equal(body.dailyCarbsConsumed, 40);
    assert.equal(body.dailyFatConsumed, 20);
    assert.equal(body.dailyHydrationConsumed, 72);
  }
  assert.equal(plan.timeline[23].dailyCaloriesConsumed, 0);
  assert.equal(plan.timeline[24].dailyCaloriesConsumed, 25);
  assert.ok(plan.timeline[0].hydrationLevel < created.playerState.bodyState.hydrationLevel + 18);
  assert.ok(plan.timeline[1].hydrationLevel < plan.timeline[0].hydrationLevel);
  const fields = ['dailyCaloriesConsumed', 'dailyProteinConsumed', 'dailyCarbsConsumed',
    'dailyFatConsumed', 'dailyHydrationConsumed'];
  const totals = Object.fromEntries(fields.map(field => [field, 0]));
  let prior = created.playerState.bodyState;
  for (const current of plan.timeline) {
    for (const field of fields) {
      totals[field] += current[field] >= prior[field]
        ? current[field] - prior[field] : current[field];
    }
    prior = current;
  }
  assert.deepEqual(totals, {
    dailyCaloriesConsumed: 500, dailyProteinConsumed: 90,
    dailyCarbsConsumed: 200, dailyFatConsumed: 100, dailyHydrationConsumed: 360
  });
  assert.deepEqual([plan.facts.hpCost, plan.facts.mpCost, plan.facts.staminaCost], [0, 0, 0]);
  const html = renderToStaticMarkup(React.createElement(NativeSelectedCandidatePanel, {
    snapshot: created, mode: 'world', hasUnpublishedState: false, onAction: () => {} }));
  assert.match(html, /Board passenger passage to Starfall Port/);
  const command = createNativeSelectedTravelCommand(start, STARFALL);
  const traveled = applyNativeSelectedTravel(start, command);
  assert.equal(traveled.status, 'accepted', traveled.reason);
  const arrived = traveled.session.snapshot;
  assert.deepEqual(arrived.playerState.bodyState, plan.projectedBodyState);
  assert.equal(arrived.clock.tick, created.clock.tick + 120);
  assert.equal(arrived.playerState.location.settlementId, STARFALL);
  assert.equal(arrived.playerState.location.siteLabel, "Starfall Harbormaster's Office");
  assert.equal(getCurrentPlayerTravelLocationId(arrived), STARFALL);
  assert.equal(arrived.sessionState.knownLocations.filter(row => row.id === STARFALL && row.known).length, 1);
  assert.equal(arrived.sessionState.questJournal.filter(row => row.id === QUEST).length, 1);
  assert.equal(arrived.sessionState.questJournal.find(row => row.id === QUEST).category, 'contracts');
  assert.deepEqual(arrived.playerState.gear, originalGear);
  assert.deepEqual(arrived.playerState.currency, created.playerState.currency);
  assert.deepEqual(arrived.playerState.inventory, created.playerState.inventory);
  assert.equal(arrived.playerState.bodyState.fatigueDebt, created.playerState.bodyState.fatigueDebt);
  assert.equal(arrived.playerState.resources.hp.current, created.playerState.resources.hp.current);
  assert.equal(arrived.playerState.resources.mp.current, created.playerState.resources.mp.current);
  assert.equal(isNativeTargetCampaignSnapshot(arrived), true);
  assert.deepEqual(deserializeSnapshot(serializeSnapshot(arrived)), arrived);
  const restarted = await readNativeFreshSaveSnapshot(JSON.stringify(arrived));
  assert.equal(restarted.playerState.location.settlementId, STARFALL);
  assert.deepEqual(restarted.playerState.gear, originalGear);
  assert.equal(restarted.sessionState.questJournal.filter(row => row.id === QUEST).length, 1);
  const publication = await buildNativeGearArtifactPublication(arrived, 'slot-1', {
    artifactId: 'artifact.passage.arrived', generationId: 'generation.passage.arrived',
    publicationId: 'publication.passage.arrived', savedAt: '2026-11-04T00:00:00.000Z',
    expectedHead: null });
  const artifact = JSON.parse(publication.artifactRaw);
  assert.equal(artifact.snapshotFormatId, 'lineage.save_snapshot.v3');
  assert.deepEqual((await readNativeFreshSaveSnapshot(artifact.snapshot)).playerState.gear, originalGear);
  assert.ok(arrived.playerState.bodyState.hydrationLevel > 0);
  assert.notEqual(arrived.playerState.bodyState.resolved.hydrationBand, 'severely_dehydrated');
  assert.ok(arrived.playerState.resources.hp.current > 0);
  const accepted = applyNativeSelectedQuest(traveled.session,
    createNativeSelectedQuestCommand(traveled.session, QUEST));
  assert.equal(accepted.status, 'accepted', accepted.reason);
  assert.equal(accepted.session.snapshot.playerState.activeQuestIds.includes(QUEST), true);
  const reef = applyNativeSelectedTravel(accepted.session,
    createNativeSelectedTravelCommand(accepted.session, 'location.ashen_reef'));
  assert.equal(reef.status, 'accepted', reef.reason);
  assert.deepEqual(reef.session.snapshot.playerState.gear, originalGear);
  assert.equal(isNativeTargetCampaignSnapshot(reef.session.snapshot), true);
  const repeated = applyNativeSelectedTravel(traveled.session, command);
  assert.ok(['duplicate', 'stale'].includes(repeated.status));
  assert.strictEqual(repeated.session, traveled.session);
});

test('boarding is one atomic travel result; stale, malformed and conflicting sources remain unchanged', () => {
  const created = createNativeNewGameSnapshot(form(), 'account.passage.rejections');
  const before = structuredClone(created);
  const command = createPlayerTravelCommand(created, STARFALL, 1);
  const malformed = executePlayerTravelCommand(created, { ...command, commandId: 'wrong' });
  assert.equal(malformed.code, 'malformed_command');
  assert.strictEqual(malformed.snapshot, created);
  const stale = structuredClone(created);
  stale.clock.tick += 1;
  stale.capturedAtTick += 1;
  const staleBefore = structuredClone(stale);
  const staleResult = executePlayerTravelCommand(stale, command);
  assert.equal(staleResult.code, 'stale_snapshot');
  assert.strictEqual(staleResult.snapshot, stale);
  assert.deepEqual(stale, staleBefore);
  const conflict = structuredClone(created);
  conflict.sessionState.knownLocations.push({ ...conflict.sessionState.knownLocations[0],
    id: STARFALL, settlementId: STARFALL });
  const conflictBefore = structuredClone(conflict);
  const conflictResult = executePlayerTravelCommand(conflict,
    createPlayerTravelCommand(conflict, STARFALL, 2));
  assert.equal(conflictResult.code, 'incoherent_state');
  assert.strictEqual(conflictResult.snapshot, conflict);
  assert.deepEqual(conflict, conflictBefore);
  const traveled = executePlayerTravelCommand(created, command);
  assert.equal(traveled.accepted, true);
  assert.deepEqual(created, before);
  assert.equal(traveled.emittedEvents.length, 1);
  assert.equal(traveled.emittedEvents[0].payload.originLocationId, HARBORMAST);
  assert.equal(traveled.emittedEvents[0].payload.destinationId, STARFALL);
  const retry = executePlayerTravelCommand(traveled.snapshot, command);
  assert.equal(retry.accepted, false);
  assert.strictEqual(retry.snapshot, traveled.snapshot);
  assert.equal(traveled.snapshot.sessionState.questJournal.filter(row => row.id === QUEST).length, 1);
});

test('the passenger route does not grant a chartered Starfall start or other departures', () => {
  assert.throws(() => createNativeNewGameSnapshot(form(STARFALL), 'account.denied'));
  const created = createNativeNewGameSnapshot(form(), 'account.denied.travel');
  const altered = structuredClone(created);
  altered.playerState.location.settlementId = 'settlement.stonevein';
  assert.equal(resolvePlayerTravelPlan(altered, STARFALL).accepted, false);
  assert.deepEqual(created.sessionState.questJournal, []);
});

test('the bounded passage uses the same owner for a current v2 Harbormast campaign', () => {
  const created = createNewGameSnapshot(form(), 'account.passage.v2');
  assert.equal(created.snapshotVersion, 'lineage.save_snapshot.v2');
  const result = executePlayerTravelCommand(created,
    createPlayerTravelCommand(created, STARFALL));
  assert.equal(result.accepted, true);
  assert.equal(result.snapshot.snapshotVersion, created.snapshotVersion);
  assert.equal(result.snapshot.clock.tick, created.clock.tick + 120);
  assert.equal(result.snapshot.sessionState.questJournal.filter(row => row.id === QUEST).length, 1);
  assert.deepEqual(result.snapshot.playerState.bodyState, resolvePlayerTravelPlan(created, STARFALL).projectedBodyState);
  assert.deepEqual(deserializeSnapshot(serializeSnapshot(result.snapshot)), result.snapshot);
});

test('onboard service follows four global watches across partial first and final days', () => {
  const created = createNativeNewGameSnapshot(form(), 'account.passage.offset');
  const shifted = structuredClone(created);
  shifted.clock = advanceClock(shifted.clock, 5);
  shifted.capturedAtTick = shifted.clock.tick;
  shifted.playerState.saveMeta.totalPlayTicks += 5;
  shifted.playerState.bodyState = advancePlayerBodyState(shifted.playerState.bodyState, 5, {
    day: shifted.clock.day, tick: shifted.clock.tick,
    lineageId: shifted.playerState.coreData.lineageId,
    runDifficulty: shifted.gameState.runDifficulty
  });
  const plan = resolvePlayerTravelPlan(shifted, STARFALL);
  assert.equal(plan.accepted, true, plan.reason);
  assert.equal(plan.timeline[17].dailyCaloriesConsumed, 75); // tick 23, three services
  for (const index of [41, 65, 89, 113]) {
    assert.equal(plan.timeline[index].dailyCaloriesConsumed, 100);
    assert.equal(plan.timeline[index].dailyHydrationConsumed, 72);
  }
  assert.equal(plan.timeline[119].dailyCaloriesConsumed, 25); // tick 125, one service
  assert.equal(plan.timeline[119].dailyHydrationConsumed, 18);
  const result = executePlayerTravelCommand(shifted, createPlayerTravelCommand(shifted, STARFALL));
  assert.equal(result.accepted, true);
  assert.deepEqual(result.snapshot.playerState.bodyState, plan.projectedBodyState);
});

test('passenger service uses lineage intake math without rest or unrelated-route grants', () => {
  const created = createNativeNewGameSnapshot(form(), 'account.passage.source');
  const body = created.playerState.bodyState;
  const difficulty = created.gameState.runDifficulty;
  const profile = { calories: 25, protein: 4.5, carbs: 10, fat: 5, hydration: 18, intoxication: 0 };
  for (const lineageId of ['lineage.human', 'lineage.elf', 'lineage.halfling']) {
    const expected = applyConsumableToBodyState(body, profile, { tick: 1, day: 1,
      lineageId, runDifficulty: difficulty });
    assert.deepEqual(applyPassengerServiceAtTick(body, HARBORMAST, STARFALL, 1, 1,
      lineageId, difficulty), expected);
  }
  assert.ok(applyPassengerServiceAtTick(body, HARBORMAST, STARFALL, 1, 1,
    'lineage.elf', difficulty).dailyHydrationConsumed >
    applyPassengerServiceAtTick(body, HARBORMAST, STARFALL, 1, 1,
      'lineage.human', difficulty).dailyHydrationConsumed);
  assert.strictEqual(applyPassengerServiceAtTick(body, HARBORMAST, STARFALL, 2, 1,
    'lineage.human', difficulty), body);
  assert.strictEqual(applyPassengerServiceAtTick(body, 'location.ashen_reef', STARFALL, 1, 1,
    'lineage.human', difficulty), body);
  assert.strictEqual(applyPassengerServiceAtTick(body, HARBORMAST, 'location.ashen_reef', 1, 1,
    'lineage.human', difficulty), body);
});
