import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
test.after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createCampaignSessionControl, admitCampaignMutation } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { createNativeSelectedSession } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedSession.ts');
const { createNativeSelectedQuestCommand, applyNativeSelectedQuest,
  createNativeSelectedTravelCommand, applyNativeSelectedTravel,
  advanceNativeSelectedSurvey } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedGameplay.ts');
const { resolveNearbyExplorationPlan, createNearbyExplorationCommand,
  executeNearbyExplorationCommand } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-nearby-exploration.ts');
const { isNativeTargetCampaignSnapshot } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-campaign-rules.ts');
const { createNearbyEncounterAdmissionCommand, admitNearbyEncounter,
  createNearbyEncounterStepCommand, executeNearbyEncounterStep } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-nearby-encounter.ts');
const { listLegalPlayerCombatCommands } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/combat/index.ts');
const { advanceNativeSelectedExploration, createNativeSelectedEncounterAdmission,
  admitNativeSelectedEncounter, createNativeSelectedCombatStep,
  applyNativeSelectedCombatStep } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedCombat.ts');

function first(encounterStart = false) {
  const identity = getLineageIdentityCatalog('lineage.human');
  return createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Selected Survey Hunter',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.craftsmans_child',
    continentId: encounterStart ? 'region.kaelvar' : 'region.myridian_chain',
    regionId: encounterStart ? 'region.auric_marches' : 'region.starfall_isle',
    startingSettlementId: encounterStart ? 'settlement.stonevein' : 'settlement.starfall_port',
    startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.selected.gameplay');
}
function control(snapshot) {
  return createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.native.gameplay.1',
    publicationId: 'publication.native.gameplay.1', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.gameplay.1', headRevision: 1 });
}
function session(snapshot = first()) {
  return createNativeSelectedSession({ snapshot, control: control(snapshot),
    sourceSlotId: 'slot-1', accountRevision: 2 });
}

test('real native creator reaches an authored nearby encounter without losing gear authority', () => {
  const created = session(first(true));
  const gear = structuredClone(created.snapshot.playerState.gear);
  const plan = resolveNearbyExplorationPlan(created.snapshot);
  assert.equal(plan.available, true, plan.reason);
  let current = created;
  for (let attempt = 0; attempt < 40 && !current.snapshot.worldState.nearbyExplorationCandidate; attempt++) {
    const exploration = advanceNativeSelectedExploration(current);
    assert.equal(exploration.status, 'accepted', exploration.reason);
    current = exploration.session;
    assert.deepEqual(current.snapshot.playerState.gear, gear);
  }
  assert.ok(current.snapshot.worldState.nearbyExplorationCandidate,
    'ordinary exploration must yield an authored candidate before combat admission');
  assert.ok(current.snapshot.playerState.resources.stamina.current <
    created.snapshot.playerState.resources.stamina.current);
  const admitCommand = createNativeSelectedEncounterAdmission(current);
  const unvalidated = admitNearbyEncounter(current.snapshot, current.control, admitCommand);
  assert.equal(unvalidated.accepted, false, 'native encounter requires explicit validator admission');
  assert.strictEqual(unvalidated.snapshot, current.snapshot);
  const admission = admitNativeSelectedEncounter(current, admitCommand);
  assert.equal(admission.status, 'accepted', admission.reason);
  assert.equal(isNativeTargetCampaignSnapshot(admission.session.snapshot), true);
  assert.deepEqual(admission.session.snapshot.playerState.gear, gear);
  const player = admission.session.snapshot.gameState.activeEncounter.combatants.find(item => item.kind === 'player');
  assert.equal(player.equipment.mainHandItemId, 'item.short_bow');
  assert.ok(player.hooks.itemIds.includes('item.short_bow'));
  assert.equal('equipment' in admission.session.snapshot.playerState, false);
  assert.equal(admission.session.snapshot.playerState.resources.hp.max,
    created.snapshot.playerState.resources.hp.max);
  const repeatAdmission = admitNativeSelectedEncounter(admission.session, admitCommand);
  assert.equal(repeatAdmission.status, 'duplicate');
  assert.strictEqual(repeatAdmission.session, admission.session);
  const blockedExploration = advanceNativeSelectedExploration(admission.session);
  assert.equal(blockedExploration.status, 'rejected');
  assert.strictEqual(blockedExploration.session, admission.session);
  const targetId = admission.session.snapshot.gameState.activeEncounter.enemyCombatantIds[0];
  const ranged = listLegalPlayerCombatCommands(admission.session.snapshot.gameState.activeEncounter)
    .find(item => item.actionType === 'combat.ranged.primary' && item.targetId === targetId);
  assert.ok(ranged, 'worn native Short Bow must offer the authored ranged command');
  const rangedCommand = createNativeSelectedCombatStep(admission.session,
    ranged.actionType, targetId, 'native.combat.ranged.1');
  const rangedResult = applyNativeSelectedCombatStep(admission.session, rangedCommand);
  assert.equal(rangedResult.status, 'accepted', rangedResult.reason);
  assert.deepEqual(rangedResult.session.snapshot.playerState.gear, gear);
  const action = rangedResult.session.snapshot.gameState.activeEncounter.actions.find(item =>
    item.actorCombatantId === player.id && item.manualOverride && item.actionType === 'combat.ranged.primary');
  assert.equal(action?.source.itemId, 'item.short_bow');
  assert.equal(action?.source.weaponSkillId, 'skill.combat.weapon.archery');
  assert.equal(action?.resourceCosts.stamina, 5);
  const stepCommand = createNativeSelectedCombatStep(admission.session,
    'combat.advance', null, 'native.combat.step.1');
  const unvalidatedStep = executeNearbyEncounterStep(admission.session.snapshot,
    admission.session.control, stepCommand);
  assert.equal(unvalidatedStep.accepted, false, 'native combat requires explicit validator admission');
  assert.strictEqual(unvalidatedStep.snapshot, admission.session.snapshot);
  const step = applyNativeSelectedCombatStep(admission.session, stepCommand);
  assert.equal(step.status, 'accepted', step.reason);
  assert.equal(isNativeTargetCampaignSnapshot(step.session.snapshot), true);
  assert.deepEqual(step.session.snapshot.playerState.gear, gear);
  assert.equal(step.session.control.sessionRevision, admission.session.control.sessionRevision + 1);
  const duplicate = applyNativeSelectedCombatStep(step.session, stepCommand);
  assert.equal(duplicate.status, 'duplicate');
  assert.strictEqual(duplicate.session, step.session);
  const stale = applyNativeSelectedCombatStep(step.session, {
    ...stepCommand, requestId: 'native.combat.stale.1' });
  assert.equal(stale.status, 'stale');
  assert.strictEqual(stale.session, step.session);
  const mixed = { ...step.session, snapshot: { ...step.session.snapshot,
    snapshotVersion: 'lineage.save_snapshot.v2' } };
  const mixedResult = applyNativeSelectedCombatStep(mixed, stepCommand);
  assert.equal(mixedResult.status, 'rejected');
  assert.strictEqual(mixedResult.session, mixed);
  const wrongSource = { ...step.session, sourceAddress: { ...step.session.sourceAddress,
    publicationId: 'publication.other' } };
  const wrongSourceResult = applyNativeSelectedCombatStep(wrongSource, stepCommand);
  assert.equal(wrongSourceResult.status, 'rejected');
  assert.strictEqual(wrongSourceResult.session, wrongSource);
  let combat = step.session;
  let lostHp = false;
  for (let beat = 2; beat < 300 && combat.snapshot.gameState.activeEncounter; beat++) {
    const command = createNativeSelectedCombatStep(combat, 'combat.advance', null,
      `native.combat.step.${beat}`);
    assert.ok(command, 'authentic encounter must offer a step until resolution');
    const next = applyNativeSelectedCombatStep(combat, command);
    assert.equal(next.status, 'accepted', next.reason);
    combat = next.session;
    lostHp ||= combat.snapshot.playerState.resources.hp.current <
      created.snapshot.playerState.resources.hp.current;
    assert.deepEqual(combat.snapshot.playerState.gear, gear);
  }
  assert.equal(combat.snapshot.gameState.combatHistory.at(-1)?.result, 'enemies_victorious');
  assert.equal(lostHp, true, 'authored enemy actions must change owner-backed HP');
  assert.equal(combat.snapshot.normalDefeatReceipts?.length, 1);
  assert.equal(combat.snapshot.normalDefeatReceipts[0].posture, 'playable');
  assert.equal(combat.snapshot.normalDefeatReceipts[0].destinationSource, 'current_settlement');
  assert.deepEqual(combat.snapshot.playerState.gear, gear);
});

test('native quest and travel use authored commands and retain one physical gear graph', () => {
  const start = session();
  const gear = structuredClone(start.snapshot.playerState.gear);
  const quest = createNativeSelectedQuestCommand(start, 'quest.ashen_reef_survey');
  const acceptedQuest = applyNativeSelectedQuest(start, quest);
  assert.equal(acceptedQuest.status, 'accepted');
  assert.equal(acceptedQuest.session.control.hasUnpublishedGameplayState, true);
  assert.deepEqual(acceptedQuest.session.snapshot.playerState.gear, gear);
  const repeatedQuest = applyNativeSelectedQuest(acceptedQuest.session, quest);
  assert.ok(['stale', 'duplicate'].includes(repeatedQuest.status));
  assert.strictEqual(repeatedQuest.session, acceptedQuest.session);
  const travel = createNativeSelectedTravelCommand(acceptedQuest.session, 'location.ashen_reef');
  const acceptedTravel = applyNativeSelectedTravel(acceptedQuest.session, travel);
  assert.equal(acceptedTravel.status, 'accepted');
  assert.equal(acceptedTravel.session.snapshot.playerState.location.siteLabel, 'Survey Anchorage');
  assert.deepEqual(acceptedTravel.session.snapshot.playerState.gear, gear);
  assert.equal(acceptedTravel.session.control.sessionRevision,
    acceptedQuest.session.control.sessionRevision + 1);
  const repeatedTravel = applyNativeSelectedTravel(acceptedTravel.session, travel);
  assert.ok(['stale', 'duplicate'].includes(repeatedTravel.status));
  assert.strictEqual(repeatedTravel.session, acceptedTravel.session);
});

test('native survey requires exact retained head and account revision before one accepted shift', async () => {
  const start = session();
  const acceptedQuest = applyNativeSelectedQuest(start,
    createNativeSelectedQuestCommand(start, 'quest.ashen_reef_survey'));
  const acceptedTravel = applyNativeSelectedTravel(acceptedQuest.session,
    createNativeSelectedTravelCommand(acceptedQuest.session, 'location.ashen_reef'));
  const retained = session(acceptedTravel.session.snapshot);
  const fakeOwner = { readSelected: async () => ({ revision: 2 }),
    readSlot: async () => ({ status: 'ready', loaded: { snapshot: retained.snapshot,
      sessionControl: retained.control } }) };
  const requestId = 'survey_request.12345678-1234-4123-8123-123456789abc';
  const shift = await advanceNativeSelectedSurvey(fakeOwner, retained, requestId);
  assert.equal(shift.status, 'accepted');
  assert.equal(shift.stage, 'sector_1');
  assert.equal(shift.session.snapshot.nativeSurvey.results.length, 1);
  assert.equal(shift.session.control.hasUnpublishedGameplayState, true);
  assert.deepEqual(shift.session.snapshot.playerState.gear, retained.snapshot.playerState.gear);
  const duplicate = await advanceNativeSelectedSurvey(fakeOwner, shift.session, requestId);
  assert.equal(duplicate.status, 'duplicate');
  assert.strictEqual(duplicate.session, shift.session);
  const stale = await advanceNativeSelectedSurvey({ ...fakeOwner,
    readSelected: async () => ({ revision: 3 }) }, retained,
    'survey_request.12345678-1234-4123-8123-123456789abd');
  assert.equal(stale.status, 'stale');
  assert.strictEqual(stale.session, retained);
  const wrongHead = await advanceNativeSelectedSurvey({ ...fakeOwner,
    readSlot: async () => ({ status: 'ready', loaded: { snapshot: retained.snapshot,
      sessionControl: { ...retained.control, loadedPublicationId: 'publication.other' } } }) },
    retained, 'survey_request.32345678-1234-4123-8123-123456789abc');
  assert.equal(wrongHead.status, 'stale');
  assert.strictEqual(wrongHead.session, retained);
  const unavailable = await advanceNativeSelectedSurvey({ ...fakeOwner,
    readSlot: async () => ({ status: 'pending_consumers' }) },
    retained, 'survey_request.42345678-1234-4123-8123-123456789abc');
  assert.equal(unavailable.status, 'rejected');
  assert.strictEqual(unavailable.session, retained);
});

test('unsupported and mixed-format gameplay requests leave the native pair unchanged', () => {
  const start = session();
  const unsupported = applyNativeSelectedQuest(start,
    createNativeSelectedQuestCommand(start, 'quest.unsupported'));
  assert.equal(unsupported.status, 'rejected');
  assert.strictEqual(unsupported.session, start);
  const mixed = { ...start, snapshot: { ...start.snapshot,
    snapshotVersion: 'lineage.save_snapshot.v2' } };
  const command = createNativeSelectedQuestCommand(start, 'quest.ashen_reef_survey');
  const blocked = applyNativeSelectedQuest(mixed, command);
  assert.equal(blocked.status, 'rejected');
  assert.strictEqual(blocked.session, mixed);
  const wrongSource = { ...start, sourceAddress: { ...start.sourceAddress,
    publicationId: 'publication.other' } };
  const rejectedSource = applyNativeSelectedQuest(wrongSource, command);
  assert.equal(rejectedSource.status, 'rejected');
  assert.strictEqual(rejectedSource.session, wrongSource);
});
