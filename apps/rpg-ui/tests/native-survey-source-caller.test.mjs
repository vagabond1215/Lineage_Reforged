import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { isNativeTargetCampaignSnapshot } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-campaign-rules.ts');
const { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } =
  await vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-quest-acceptance.ts');
const { createPlayerTravelCommand, executePlayerTravelCommand } =
  await vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-travel.ts');
const { prepareNativeSurveySource } =
  await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-survey-source.ts');
const { resolveNativeSurveyMaterialEvidence } =
  await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-survey-material.ts');
const { resolvePlayerSurveyActivityAdvancementPlan } =
  await vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-survey-activity-advancement.ts');
const { createNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/newGameSnapshot.ts');
const { readNativeFreshSaveSnapshot } = await vite.ssrLoadModule('/src/game-shell/saveManager.ts');

function sourceIdentity(snapshot) {
  return {
    accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId,
    continuityId: snapshot.campaignIdentity.continuityId,
    artifactId: 'artifact.native.survey.1',
    publicationId: 'publication.native.survey.1',
    revision: 1
  };
}

function form(bundle = 'starting_bundle.traveler') {
  const identity = getLineageIdentityCatalog('lineage.human');
  return {
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Native Survey Caller',
    hairColorId: identity.hairColorOptions[0].id,
    eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id,
    startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child',
    continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle',
    startingSettlementId: 'settlement.starfall_port'
  };
}

function reachSurvey(bundle = 'starting_bundle.traveler') {
  const first = createNativeNewGameSnapshot(form(bundle), 'account.native.survey');
  assert.equal(isNativeTargetCampaignSnapshot(first), true);
  const gear = structuredClone(first.playerState.gear);
  assert.equal(first.sessionState.questJournal.find(quest => quest.id === 'quest.ashen_reef_survey').category, 'contracts');
  const acceptance = executePlayerQuestAcceptanceCommand(first,
    createPlayerQuestAcceptanceCommand(first, 'quest.ashen_reef_survey'));
  assert.equal(acceptance.accepted, true);
  assert.deepEqual(acceptance.snapshot.playerState.gear, gear);
  assert.equal(isNativeTargetCampaignSnapshot(acceptance.snapshot), true);
  const travel = executePlayerTravelCommand(acceptance.snapshot,
    createPlayerTravelCommand(acceptance.snapshot, 'location.ashen_reef'));
  assert.equal(travel.accepted, true);
  assert.deepEqual(travel.snapshot.playerState.gear, gear);
  assert.equal(isNativeTargetCampaignSnapshot(travel.snapshot), true);
  return { first, snapshot: travel.snapshot, gear };
}

function reachLegacySurvey(bundle) {
  const first = createNewGameSnapshot(form(bundle), 'account.native.survey');
  const acceptance = executePlayerQuestAcceptanceCommand(first,
    createPlayerQuestAcceptanceCommand(first, 'quest.ashen_reef_survey'));
  assert.equal(acceptance.accepted, true);
  const travel = executePlayerTravelCommand(acceptance.snapshot,
    createPlayerTravelCommand(acceptance.snapshot, 'location.ashen_reef'));
  assert.equal(travel.accepted, true);
  return travel.snapshot;
}

test('native creator, quest acceptance and travel reach a gear-backed survey source', async () => {
  const { snapshot, gear } = reachSurvey();
  const before = structuredClone(snapshot);
  const source = prepareNativeSurveySource(snapshot, sourceIdentity(snapshot));
  assert.equal(source.accepted, true);
  assert.equal(source.witness.snapshotFormat, 'lineage.save_snapshot.v3');
  assert.equal(source.witness.stage, 'sector_1');
  assert.equal('equipment' in source.witness.ownerInputs, false);
  assert.deepEqual(source.witness.ownerInputs.worn,
    gear.instances.filter(item => item.location.kind === 'worn'));
  assert.deepEqual(snapshot, before);
  const restored = await readNativeFreshSaveSnapshot(JSON.stringify(snapshot));
  assert.equal(isNativeTargetCampaignSnapshot(restored), true);
  assert.deepEqual(prepareNativeSurveySource(restored, sourceIdentity(restored)), source);
  source.witness.ownerInputs.worn[0].durability = 0;
  assert.deepEqual(snapshot, before, 'witness must not alias live gear');
});

test('native source capture refuses unaccepted quest, wrong place, stale identity and malformed gear', () => {
  const { first, snapshot } = reachSurvey();
  assert.deepEqual(prepareNativeSurveySource(first, sourceIdentity(first)),
    { accepted: false, code: 'quest_not_ready' });
  const wrongPlace = structuredClone(snapshot);
  wrongPlace.playerState.location.settlementId = 'settlement.starfall_port';
  wrongPlace.playerState.location.siteLabel = 'Starfall Port';
  assert.equal(prepareNativeSurveySource(wrongPlace, sourceIdentity(wrongPlace)).accepted, false);
  assert.deepEqual(prepareNativeSurveySource(snapshot, {
    ...sourceIdentity(snapshot), campaignId: 'campaign.stale'
  }), { accepted: false, code: 'invalid_source' });
  assert.deepEqual(prepareNativeSurveySource(snapshot, {
    ...sourceIdentity(snapshot), revision: 0
  }), { accepted: false, code: 'invalid_source' });
  const malformed = structuredClone(snapshot);
  malformed.playerState.gear.instances.push(structuredClone(malformed.playerState.gear.instances[0]));
  assert.deepEqual(prepareNativeSurveySource(malformed, sourceIdentity(malformed)),
    { accepted: false, code: 'invalid_source' });
});

test('native worn-instance survey material resolves the same first shift as the real v2 caller', async () => {
  const bundles = JSON.parse(readFileSync(new URL('../../../packages/content/base/player/starting_bundles.json', import.meta.url), 'utf8').replace(/^\uFEFF/, '')).records;
  assert.equal(bundles.length, 7);
  for (const { id: bundle } of bundles) {
    const { snapshot } = reachSurvey(bundle);
    const gearBefore = structuredClone(snapshot.playerState.gear);
    const captured = prepareNativeSurveySource(snapshot, sourceIdentity(snapshot));
    assert.equal(captured.accepted, true);
    const native = resolveNativeSurveyMaterialEvidence(snapshot, sourceIdentity(snapshot), captured.witness);
    const restored = await readNativeFreshSaveSnapshot(JSON.stringify(snapshot));
    assert.deepEqual(resolveNativeSurveyMaterialEvidence(restored, sourceIdentity(restored), captured.witness), native);
    const legacy = resolvePlayerSurveyActivityAdvancementPlan(reachLegacySurvey(bundle));
    assert.equal(legacy.accepted, true);
    assert.equal(native.endClock.tick, snapshot.clock.tick + 2);
    assert.deepEqual(native.profile, legacy.metabolicProfile);
    assert.deepEqual(native.bodyAfter, legacy.projectedBodyState);
    assert.deepEqual(native.bodyTimeline, legacy.timeline);
    assert.deepEqual(native.resourcesAfter, legacy.projectedResources);
    assert.equal(native.skill.appliedDelta, legacy.skill.appliedDelta);
    assert.deepEqual(snapshot.playerState.gear, gearBefore);
    const reordered = structuredClone(captured.witness);
    reordered.ownerInputs = Object.fromEntries(Object.entries(reordered.ownerInputs).reverse());
    assert.deepEqual(resolveNativeSurveyMaterialEvidence(snapshot, sourceIdentity(snapshot), reordered), native);
    const forged = structuredClone(captured.witness);
    forged.ownerInputs.worn[0].durability = -1;
    assert.throws(() => resolveNativeSurveyMaterialEvidence(snapshot, sourceIdentity(snapshot), forged));
    const staleGear = structuredClone(snapshot);
    staleGear.playerState.gear.instances.find(item => item.location.kind === 'worn').durability = 0.5;
    assert.throws(() => resolveNativeSurveyMaterialEvidence(staleGear, sourceIdentity(staleGear), captured.witness));
  }
});
