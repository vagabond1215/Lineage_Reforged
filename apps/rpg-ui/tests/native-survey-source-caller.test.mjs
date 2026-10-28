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
const { readNativeFreshSaveSnapshot, buildNativeGearArtifactPublication } = await vite.ssrLoadModule('/src/game-shell/saveManager.ts');
const { readRetainedNativeSurveyMaterial } = await vite.ssrLoadModule('/src/game-shell/nativeSurveyRetainedSource.ts');
const { executeNativeSurveyShiftCandidate } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-survey-shift-candidate.ts');
const { commitNativeSurveyFirstShift } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-survey-ledger.ts');
const { validateNativeSurveyRetainedSource } = await vite.ssrLoadModule('/src/game-shell/campaignIndexedDbStore.ts');

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

test('native survey material binds to the retained v3 head instead of caller-supplied source identity', async () => {
  const { snapshot } = reachSurvey('starting_bundle.hunter');
  const publication = await buildNativeGearArtifactPublication(snapshot, 'slot-1', {
    artifactId: 'artifact.native.survey.retained', generationId: 'generation.native.survey.retained',
    publicationId: 'publication.native.survey.retained', savedAt: '2026-10-28T00:00:00.000Z',
    expectedHead: null
  });
  const retained = { artifactRaw: publication.artifactRaw, slotRaw: publication.artifactRaw,
    control: publication.control, witness: null };
  const originalBytes = JSON.stringify(retained);
  const store = { read: async (accountId, campaignId, slotId) => {
    assert.deepEqual([accountId, campaignId, slotId],
      [snapshot.accountId, snapshot.campaignIdentity.campaignId, 'slot-1']);
    return retained;
  } };
  const result = await readRetainedNativeSurveyMaterial(store, snapshot.accountId,
    snapshot.campaignIdentity.campaignId, 'slot-1');
  assert.equal(result.sourceIdentity.artifactId, publication.control.headArtifactId);
  assert.equal(result.sourceIdentity.publicationId, publication.control.headPublicationId);
  assert.equal(result.witness.stage, 'sector_1');
  assert.equal(result.material.endClock.tick, snapshot.clock.tick + 2);
  assert.deepEqual(result.snapshot.playerState.gear, snapshot.playerState.gear);
  assert.equal(JSON.stringify(retained), originalBytes, 'read must not alter retained authority');
  await assert.rejects(readRetainedNativeSurveyMaterial({ read: async () => null },
    snapshot.accountId, snapshot.campaignIdentity.campaignId, 'slot-1'));
  await assert.rejects(readRetainedNativeSurveyMaterial({ read: async () => ({ ...retained,
    control: { ...retained.control, headArtifactId: 'artifact.stale' }
  }) }, snapshot.accountId, snapshot.campaignIdentity.campaignId, 'slot-1'));
  await assert.rejects(readRetainedNativeSurveyMaterial({ read: async () => ({ ...retained,
    control: { ...retained.control, closed: true }
  }) }, snapshot.accountId, snapshot.campaignIdentity.campaignId, 'slot-1'));
  await assert.rejects(readRetainedNativeSurveyMaterial({ read: async () => ({ ...retained,
    slotRaw: 'different-address'
  }) }, snapshot.accountId, snapshot.campaignIdentity.campaignId, 'slot-1'));
  await assert.rejects(readRetainedNativeSurveyMaterial({ read: async () => retained },
    'account.other', snapshot.campaignIdentity.campaignId, 'slot-1'));
});

test('real native survey source produces one isolated first-shift owner mutation without publishing false authority', async () => {
  const { snapshot, gear } = reachSurvey('starting_bundle.hunter');
  const before = structuredClone(snapshot);
  const published = await buildNativeGearArtifactPublication(snapshot, 'slot-1', {
    artifactId: 'artifact.native.shift.1', generationId: 'generation.native.shift.1',
    publicationId: 'publication.native.shift.1', savedAt: '2026-10-28T00:00:00.000Z',
    expectedHead: null
  });
  const retained = { artifactRaw: published.artifactRaw, slotRaw: published.artifactRaw,
    control: published.control, witness: null };
  const bound = await readRetainedNativeSurveyMaterial({ read: async () => retained },
    snapshot.accountId, snapshot.campaignIdentity.campaignId, 'slot-1');
  const candidate = executeNativeSurveyShiftCandidate(bound,
    'survey_request.12345678-1234-4123-8123-123456789abc');
  assert.equal(candidate.version, 1);
  assert.equal(candidate.stage, 'sector_1');
  assert.equal(candidate.snapshot.clock.tick, snapshot.clock.tick + 2);
  assert.equal(candidate.snapshot.capturedAtTick, candidate.snapshot.clock.tick);
  assert.equal(candidate.snapshot.playerState.saveMeta.totalPlayTicks,
    snapshot.playerState.saveMeta.totalPlayTicks + 2);
  assert.deepEqual(candidate.snapshot.playerState.bodyState, bound.material.bodyAfter);
  assert.deepEqual(candidate.snapshot.playerState.resources, bound.material.resourcesAfter);
  assert.deepEqual(candidate.snapshot.playerState.resourceRuntime, bound.material.resourceRuntimeAfter);
  assert.deepEqual(candidate.snapshot.playerState.statGrowth, bound.material.statGrowthAfter);
  assert.deepEqual(candidate.snapshot.playerState.gear, gear);
  assert.equal(candidate.snapshot.sessionState.flags.includes('gameplay.quest.ashen_reef_survey.sector.1'), true);
  assert.equal(candidate.snapshot.sessionState.operations.find(row => row.id ===
    'operation.quest.ashen_reef_survey')?.progress, 25);
  assert.equal(candidate.snapshot.playerState.skills.find(row => row.id ===
    'skill.knowledge.general_lore')?.rank, bound.material.skill.rankAfter);
  const legacyPlan = resolvePlayerSurveyActivityAdvancementPlan(
    reachLegacySurvey('starting_bundle.hunter'));
  assert.equal(legacyPlan.accepted, true);
  assert.deepEqual(candidate.snapshot.playerState.bodyState, legacyPlan.projectedBodyState);
  assert.deepEqual(candidate.snapshot.playerState.resources, legacyPlan.projectedResources);
  assert.equal(bound.material.skill.appliedDelta, legacyPlan.skill.appliedDelta);
  assert.deepEqual(candidate.snapshot.sessionState.operations.find(row => row.id ===
    'operation.quest.ashen_reef_survey'), legacyPlan.operation);
  assert.equal(candidate.sourceArtifactId, published.control.headArtifactId);
  assert.equal(candidate.sourcePublicationId, published.control.headPublicationId);
  assert.deepEqual(snapshot, before, 'candidate must not mutate retained source');
  assert.deepEqual(executeNativeSurveyShiftCandidate(bound,
    'survey_request.12345678-1234-4123-8123-123456789abc'), candidate,
  'recomputing the same unpublished candidate must not charge or change state');
  assert.equal(isNativeTargetCampaignSnapshot(candidate.snapshot), false,
    'unwitnessed candidate must remain outside Save admission');
  const operationOnly = structuredClone(candidate.snapshot);
  operationOnly.sessionState.flags = operationOnly.sessionState.flags.filter(flag =>
    flag !== 'gameplay.quest.ashen_reef_survey.sector.1');
  assert.equal(isNativeTargetCampaignSnapshot(operationOnly), false,
    'operation progress alone cannot bypass the native witness gate');
  const discoveryOnly = structuredClone(snapshot);
  discoveryOnly.sessionState.flags.push('gameplay.discovery.stormglass_bloom');
  assert.equal(isNativeTargetCampaignSnapshot(discoveryOnly), false,
    'unwitnessed discovery cannot bypass the native witness gate');
  await assert.rejects(readNativeFreshSaveSnapshot(JSON.stringify(candidate.snapshot)),
    /incompatible or corrupt/i);
  await assert.rejects(buildNativeGearArtifactPublication(candidate.snapshot, 'slot-1', {
    artifactId: 'artifact.native.shift.2', generationId: 'generation.native.shift.2',
    publicationId: 'publication.native.shift.2', savedAt: '2026-10-28T00:01:00.000Z',
    expectedHead: { artifactId: published.control.headArtifactId,
      publicationId: published.control.headPublicationId, revision: 1 }
  }), /valid fresh v3 campaign/i);
  assert.throws(() => executeNativeSurveyShiftCandidate(bound, 'not-a-request'));
  const forged = structuredClone(bound);
  forged.witness.ownerInputs.worn[0].durability = -1;
  assert.throws(() => executeNativeSurveyShiftCandidate(forged,
    'survey_request.12345678-1234-4123-8123-123456789abc'));
});

test('first native survey result is versioned, replay-admitted and survives JSON Save readback', async () => {
  const { snapshot } = reachSurvey('starting_bundle.hunter');
  const publication = await buildNativeGearArtifactPublication(snapshot, 'slot-1', {
    artifactId: 'artifact.native.ledger.1', generationId: 'generation.native.ledger.1',
    publicationId: 'publication.native.ledger.1', savedAt: '2026-10-28T00:00:00.000Z',
    expectedHead: null
  });
  const bound = await readRetainedNativeSurveyMaterial({ read: async () => ({
    artifactRaw: publication.artifactRaw, slotRaw: publication.artifactRaw,
    control: publication.control, witness: null
  }) }, snapshot.accountId, snapshot.campaignIdentity.campaignId, 'slot-1');
  const commandId = 'survey_request.12345678-1234-4123-8123-123456789abc';
  const accepted = commitNativeSurveyFirstShift(bound, commandId);
  assert.deepEqual(commitNativeSurveyFirstShift(bound, commandId), accepted,
    'same source and request replay cannot charge another shift');
  assert.equal(accepted.snapshot.nativeSurvey.version, 1);
  assert.equal(accepted.snapshot.nativeSurvey.results.length, 1);
  assert.equal(accepted.snapshot.nativeSurvey.results[0].requestId, commandId);
  assert.equal(isNativeTargetCampaignSnapshot(accepted.snapshot), true);
  assert.deepEqual((await readNativeFreshSaveSnapshot(JSON.stringify(accepted.snapshot))).nativeSurvey,
    accepted.snapshot.nativeSurvey);
  const forgedMaterial = structuredClone(accepted.snapshot);
  forgedMaterial.nativeSurvey.results[0].material.resourcesAfter.stamina.current += 1;
  assert.equal(isNativeTargetCampaignSnapshot(forgedMaterial), false);
  const forgedBody = structuredClone(accepted.snapshot);
  forgedBody.playerState.bodyState.fatigue += 1;
  assert.equal(isNativeTargetCampaignSnapshot(forgedBody), false);
  const forgedGear = structuredClone(accepted.snapshot);
  forgedGear.playerState.gear.instances.find(item => item.location.kind === 'worn').durability = 0.5;
  assert.equal(isNativeTargetCampaignSnapshot(forgedGear), false);
  const duplicated = structuredClone(accepted.snapshot);
  duplicated.nativeSurvey.results.push(structuredClone(duplicated.nativeSurvey.results[0]));
  assert.equal(isNativeTargetCampaignSnapshot(duplicated), false);
  const skippedStage = structuredClone(accepted.snapshot);
  skippedStage.sessionState.flags.push('gameplay.quest.ashen_reef_survey.sector.2');
  assert.equal(isNativeTargetCampaignSnapshot(skippedStage), false);
  const forgedSkill = structuredClone(accepted.snapshot);
  forgedSkill.playerState.skills.find(row => row.id === 'skill.knowledge.general_lore').rank += 1;
  assert.equal(isNativeTargetCampaignSnapshot(forgedSkill), false);
  const descendant = await buildNativeGearArtifactPublication(accepted.snapshot, 'slot-1', {
    artifactId: 'artifact.native.ledger.2', generationId: 'generation.native.ledger.2',
    publicationId: 'publication.native.ledger.2', savedAt: '2026-10-28T00:01:00.000Z',
    expectedHead: { artifactId: publication.control.headArtifactId,
      publicationId: publication.control.headPublicationId, revision: 1 }
  });
  assert.equal(JSON.parse(descendant.artifactRaw).version, 8);
  assert.equal(descendant.control.previousHeadArtifactId, publication.control.headArtifactId);
  const envelope = JSON.parse(descendant.artifactRaw);
  assert.doesNotThrow(() => validateNativeSurveyRetainedSource(envelope,
    JSON.parse(envelope.snapshot), publication.artifactRaw));
  assert.throws(() => validateNativeSurveyRetainedSource(envelope,
    JSON.parse(envelope.snapshot), null), /retained source/i);
  const changedSource = JSON.parse(publication.artifactRaw);
  const changedSourceSnapshot = JSON.parse(changedSource.snapshot);
  changedSourceSnapshot.playerState.resources.stamina.current -= 1;
  changedSource.snapshot = JSON.stringify(changedSourceSnapshot);
  assert.throws(() => validateNativeSurveyRetainedSource(envelope,
    JSON.parse(envelope.snapshot), JSON.stringify(changedSource)), /witness differs/i);
  const changedResult = JSON.parse(envelope.snapshot);
  changedResult.playerState.skills.find(row => row.id === 'skill.knowledge.general_lore').source = 'origin';
  assert.throws(() => validateNativeSurveyRetainedSource(envelope,
    changedResult, publication.artifactRaw), /replay/i);
});
