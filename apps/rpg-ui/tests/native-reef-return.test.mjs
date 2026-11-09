import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from
  '../src/game-shell/characterCreationCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
test.after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createNativeSelectedSession } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedSession.ts');
const { createCampaignSessionControl } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { createNativeSelectedTravelCommand, applyNativeSelectedTravel,
  createNativeSelectedQuestCommand, applyNativeSelectedQuest,
  advanceNativeSelectedSoundingsTurnIn } = await
  vite.ssrLoadModule('/src/game-shell/nativeSelectedGameplay.ts');
const { readRetainedNativeSurveyMaterial } = await
  vite.ssrLoadModule('/src/game-shell/nativeSurveyRetainedSource.ts');
const { commitNativeSurveyShift } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-survey-ledger.ts');
const { resolvePlayerTravelPlan } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-travel-rules.ts');
const { executePlayerTravelCommand } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/player-travel.ts');
const { isNativeTargetCampaignSnapshot } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-campaign-rules.ts');
const { buildNativeGearArtifactPublication, readNativeFreshSaveSnapshot } = await
  vite.ssrLoadModule('/src/game-shell/saveManager.ts');
const { validateNativeSoundingsRetainedSource } = await
  vite.ssrLoadModule('/src/game-shell/campaignIndexedDbStore.ts');
const { resolveNativeSoundingsTurnIn } = await
  vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-soundings-turn-in.ts');

function freshHarbormast() {
  const identity = getLineageIdentityCatalog('lineage.human');
  return createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Reef Return Hunter',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.local',
    continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
    startingSettlementId: 'settlement.harbormast_quay',
    startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.reef.return');
}

let latestPublication;
async function publish(snapshot, prior = null, sequence = 1) {
  const publication = await buildNativeGearArtifactPublication(snapshot, 'slot-1', {
    artifactId: `artifact.native.reef.${sequence}`,
    generationId: `generation.native.reef.${sequence}`,
    publicationId: `publication.native.reef.${sequence}`,
    savedAt: `2026-11-05T00:${String(sequence).padStart(2, '0')}:00.000Z`,
    expectedHead: prior && { artifactId: prior.sourceAddress.artifactId,
      publicationId: prior.sourceAddress.publicationId, revision: prior.control.campaignHeadRevision }
  });
  const retained = await readNativeFreshSaveSnapshot(JSON.parse(publication.artifactRaw).snapshot);
  latestPublication = publication;
  const control = createCampaignSessionControl({ accountId: retained.accountId,
    campaignId: retained.campaignIdentity.campaignId, artifactId: publication.control.headArtifactId,
    publicationId: publication.control.headPublicationId,
    artifactRevision: publication.control.headRevision,
    continuityId: retained.campaignIdentity.continuityId,
    headArtifactId: publication.control.headArtifactId,
    headRevision: publication.control.headRevision, sourceSnapshot: retained });
  return createNativeSelectedSession({ snapshot: retained, control,
    sourceSlotId: 'slot-1', accountRevision: sequence + 1 });
}

test('real native creator, passenger, four retained shifts and selected return reach Starfall', async () => {
  const first = freshHarbormast();
  const gear = structuredClone(first.playerState.gear);
  let selected = await publish(first);
  const travel = (destinationId) => {
    const result = applyNativeSelectedTravel(selected,
      createNativeSelectedTravelCommand(selected, destinationId));
    assert.equal(result.status, 'accepted', result.reason);
    selected = result.session;
  };
  travel('settlement.starfall_port');
  const accepted = applyNativeSelectedQuest(selected,
    createNativeSelectedQuestCommand(selected, 'quest.ashen_reef_survey'));
  assert.equal(accepted.status, 'accepted', accepted.reason);
  selected = accepted.session;
  travel('location.ashen_reef');
  selected = await publish(selected.snapshot, selected, 2);
  for (let stage = 1; stage <= 4; stage++) {
    const bound = await readRetainedNativeSurveyMaterial({ read: async () => ({
      artifactRaw: latestPublication.artifactRaw, slotRaw: latestPublication.artifactRaw,
      control: latestPublication.control, witness: null
    }) }, selected.snapshot.accountId, selected.snapshot.campaignIdentity.campaignId, 'slot-1');
    const committed = commitNativeSurveyShift(bound,
      `survey_request.12345678-1234-4123-8123-123456789ab${stage}`);
    assert.equal(committed.snapshot.nativeSurvey.results.length, stage);
    selected = await publish(committed.snapshot, selected, stage + 2);
  }
  const before = selected;
  const plan = resolvePlayerTravelPlan(before.snapshot, 'settlement.starfall_port');
  assert.equal(plan.accepted, true, plan.reason);
  const command = createNativeSelectedTravelCommand(before, 'settlement.starfall_port');
  const ownerResult = executePlayerTravelCommand(before.snapshot, command);
  assert.equal(ownerResult.accepted, true, ownerResult.code);
  assert.equal(isNativeTargetCampaignSnapshot(ownerResult.snapshot), true,
    'authorized return must remain a valid native descendant');
  const returned = applyNativeSelectedTravel(before, command);
  assert.equal(returned.status, 'accepted', returned.reason);
  assert.equal(returned.session.snapshot.playerState.location.siteLabel,
    "Starfall Harbormaster's Office");
  assert.deepEqual(returned.session.snapshot.playerState.gear, gear);
  assert.equal(returned.session.snapshot.nativeSurvey.results.length, 4);
  assert.deepEqual(returned.session.snapshot.playerState.resources, ownerResult.snapshot.playerState.resources);
  assert.deepEqual(returned.session.snapshot.playerState.bodyState, ownerResult.snapshot.playerState.bodyState);
  assert.equal(returned.session.snapshot.campaignIdentity.campaignId,
    first.campaignIdentity.campaignId);
  const stale = applyNativeSelectedTravel(returned.session, command);
  assert.equal(stale.status, 'stale');
  assert.strictEqual(stale.session, returned.session);
  const savedReturn = await publish(returned.session.snapshot, before, 7);
  assert.equal(resolveNativeSoundingsTurnIn(before.snapshot).accepted, false,
    'Reef survey cannot pay before authorized Starfall return');
  assert.equal(savedReturn.snapshot.playerState.location.settlementId, 'settlement.starfall_port');
  assert.deepEqual(savedReturn.snapshot.playerState.gear, gear);
  assert.deepEqual(savedReturn.snapshot.nativeSurvey, before.snapshot.nativeSurvey);
  const forgedHistory = structuredClone(savedReturn.snapshot);
  forgedHistory.nativeSurvey.results[3].material.resourcesAfter.stamina.current += 1;
  assert.equal(isNativeTargetCampaignSnapshot(forgedHistory), false);
  const wrongClock = structuredClone(savedReturn.snapshot);
  wrongClock.clock.tick = before.snapshot.clock.tick - 1;
  assert.equal(isNativeTargetCampaignSnapshot(wrongClock), false);

  const goldBefore = savedReturn.snapshot.playerState.currency.gold;
  const owner = { readSelected: async () => ({ revision: savedReturn.accountRevision }),
    readSlot: async () => ({ status: 'ready', loaded: {
      snapshot: savedReturn.snapshot, sessionControl: savedReturn.control } }) };
  const requestId = 'soundings_turn_in_request.12345678-1234-4123-8123-123456789abc';
  const turnIn = await advanceNativeSelectedSoundingsTurnIn(owner, savedReturn, requestId);
  assert.equal(turnIn.status, 'accepted', turnIn.reason);
  assert.equal(turnIn.session.snapshot.playerState.currency.gold, goldBefore + 5);
  assert.equal(turnIn.session.snapshot.sessionState.questJournal.find(row =>
    row.id === 'quest.ashen_reef_survey').category, 'completed');
  assert.equal(turnIn.session.snapshot.sessionState.trackedQuestId, null);
  assert.equal(turnIn.session.snapshot.sessionState.operations.some(row =>
    row.id === 'operation.quest.ashen_reef_survey'), false);
  assert.equal(turnIn.session.snapshot.sessionState.currentActivity.id, 'activity.soundings.submitted');
  const result = turnIn.session.snapshot.nativeSoundingsTurnIn;
  assert.equal(turnIn.session.snapshot.sessionState.chronicle.filter(row =>
    row.id === result.chronicleId).length, 1);
  assert.equal(turnIn.session.snapshot.sessionState.notifications.filter(row =>
    row.id === result.notificationId).length, 1);
  assert.deepEqual(turnIn.session.snapshot.playerState.resources, savedReturn.snapshot.playerState.resources);
  assert.deepEqual(turnIn.session.snapshot.playerState.bodyState, savedReturn.snapshot.playerState.bodyState);
  assert.deepEqual(turnIn.session.snapshot.playerState.skills, savedReturn.snapshot.playerState.skills);
  assert.deepEqual(turnIn.session.snapshot.playerState.inventory, savedReturn.snapshot.playerState.inventory);
  assert.deepEqual(turnIn.session.snapshot.playerState.reputation, savedReturn.snapshot.playerState.reputation);
  assert.deepEqual(turnIn.session.snapshot.playerState.gear, gear);
  assert.deepEqual(turnIn.session.snapshot.nativeSurvey, savedReturn.snapshot.nativeSurvey);
  const retry = await advanceNativeSelectedSoundingsTurnIn(owner, turnIn.session, requestId);
  assert.equal(retry.status, 'duplicate');
  assert.strictEqual(retry.session, turnIn.session);
  const conflictingRetry = await advanceNativeSelectedSoundingsTurnIn(owner, turnIn.session,
    'soundings_turn_in_request.12345678-1234-4123-8123-123456789abd');
  assert.equal(conflictingRetry.status, 'rejected');
  assert.strictEqual(conflictingRetry.session, turnIn.session);
  const staleAccount = await advanceNativeSelectedSoundingsTurnIn({ ...owner,
    readSelected: async () => ({ revision: savedReturn.accountRevision + 1 }) },
  savedReturn, 'soundings_turn_in_request.12345678-1234-4123-8123-123456789abe');
  assert.equal(staleAccount.status, 'stale');
  assert.strictEqual(staleAccount.session, savedReturn);
  const returnArtifactRaw = latestPublication.artifactRaw;
  const publishedTurnIn = await publish(turnIn.session.snapshot, savedReturn, 8);
  assert.equal(publishedTurnIn.snapshot.playerState.currency.gold, goldBefore + 5);
  assert.equal(publishedTurnIn.snapshot.nativeSoundingsTurnIn.requestId, requestId);
  assert.doesNotThrow(() => validateNativeSoundingsRetainedSource(
    JSON.parse(latestPublication.artifactRaw), publishedTurnIn.snapshot,
    returnArtifactRaw));
  const forged = structuredClone(publishedTurnIn.snapshot);
  forged.playerState.currency.gold += 5;
  assert.throws(() => validateNativeSoundingsRetainedSource(
    JSON.parse(latestPublication.artifactRaw), forged, returnArtifactRaw), /replay/);
  const duplicatePayment = structuredClone(publishedTurnIn.snapshot);
  duplicatePayment.nativeSoundingsTurnIn.goldBefore += 5;
  assert.throws(() => validateNativeSoundingsRetainedSource(
    JSON.parse(latestPublication.artifactRaw), duplicatePayment, returnArtifactRaw), /replay/);
  const wrongSource = structuredClone(publishedTurnIn.snapshot);
  wrongSource.nativeSoundingsTurnIn.source.artifactId = 'artifact.elsewhere';
  assert.throws(() => validateNativeSoundingsRetainedSource(
    JSON.parse(latestPublication.artifactRaw), wrongSource, returnArtifactRaw), /source identity/);
  const incomplete = structuredClone(savedReturn.snapshot);
  incomplete.nativeSurvey.results.pop();
  incomplete.nativeSurvey.receipts.pop();
  assert.equal(resolveNativeSoundingsTurnIn(incomplete).accepted, false);
  const malformed = await advanceNativeSelectedSoundingsTurnIn(owner, savedReturn, 'bad-request');
  assert.equal(malformed.status, 'rejected');
  assert.strictEqual(malformed.session, savedReturn);
  assert.throws(() => validateNativeSoundingsRetainedSource(
    JSON.parse(latestPublication.artifactRaw), publishedTurnIn.snapshot, null), /retained source/);
});
