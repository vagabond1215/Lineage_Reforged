import test, { after } from 'node:test';
import assert from 'node:assert/strict';
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

function form() {
  const identity = getLineageIdentityCatalog('lineage.human');
  const bundle = 'starting_bundle.traveler';
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

function reachSurvey() {
  const first = createNativeNewGameSnapshot(form(), 'account.native.survey');
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
