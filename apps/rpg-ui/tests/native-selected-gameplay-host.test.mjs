import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
test.after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createCampaignSessionControl } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { createNativeSelectedSession } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedSession.ts');
const { createNativeSelectedQuestCommand, applyNativeSelectedQuest,
  createNativeSelectedTravelCommand, applyNativeSelectedTravel,
  advanceNativeSelectedSurvey } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedGameplay.ts');

function first() {
  const identity = getLineageIdentityCatalog('lineage.human');
  return createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Selected Survey Hunter',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.craftsmans_child',
    continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
    startingSettlementId: 'settlement.starfall_port', startingBundleId: 'starting_bundle.hunter',
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
