// Contract-stop evidence, not a repair regression or acceptance claim.
// Disposable ordinary campaign; no user browser data.
import assert from 'node:assert/strict';
import { createOrdinarySoundingsCampaign, withCampaignStorage, REQUEST_ID, publishAndRestart } from '../../../../tests/helpers/soundings-ordinary-campaign.mjs';
import { submitSoundingsTurnInCaller } from '../../../../apps/rpg-ui/src/runtime/soundingsTurnInCaller.ts';
import { fingerprintSoundingsState } from '../../../../packages/engines/game-engine/src/soundings-turn-in-authority.ts';
import { getCurrentPlayerTravelLocationId } from '../../../../packages/engines/game-engine/src/player-travel-rules.ts';

withCampaignStorage(storage => {
  const source = createOrdinarySoundingsCampaign();
  const original = structuredClone(source);
  const artifacts = () => Array.from({ length: storage.length }, (_, i) => storage.key(i))
    .filter(key => key.includes('.artifact.'))
    .map(key => JSON.parse(storage.getItem(key)));
  const base = artifacts().find(row => row.artifactId === source.control.loadedArtifactId);
  assert.ok(base);
  assert.equal(base.publicationId, source.control.loadedPublicationId);
  const baseSnapshot = JSON.parse(base.snapshot);
  assert.equal(getCurrentPlayerTravelLocationId(baseSnapshot), 'location.ashen_reef');
  assert.equal(getCurrentPlayerTravelLocationId(source.snapshot), 'settlement.starfall_port');
  assert.notEqual(baseSnapshot.clock.tick, source.snapshot.clock.tick);
  assert.notEqual(fingerprintSoundingsState(baseSnapshot), fingerprintSoundingsState(source.snapshot));
  assert.equal(artifacts().some(row => fingerprintSoundingsState(JSON.parse(row.snapshot)) === fingerprintSoundingsState(source.snapshot)), false);
  assert.ok(source.control.sessionRevision > source.control.loadedHeadRevision);
  console.log('UNPUBLISHED_SOURCE_GAP', JSON.stringify({
    artifactCount: artifacts().length,
    baseTick: baseSnapshot.clock.tick, sourceTick: source.snapshot.clock.tick,
    baseRevision: base.headRevision, sourceRevision: source.control.sessionRevision,
    baseLocation: getCurrentPlayerTravelLocationId(baseSnapshot),
    sourceLocation: getCurrentPlayerTravelLocationId(source.snapshot),
    exactSourceArtifactExists: false
  }));
  const submitted = submitSoundingsTurnInCaller(source.snapshot, source.control, REQUEST_ID, new Map());
  assert.ok(submitted.acceptedState);
  assert.deepEqual(source, original);
  const accepted = submitted.acceptedState;
  assert.ok(accepted.control.retainedMutationResults.some(row => row.mutationId === REQUEST_ID));
  assert.equal(artifacts().some(row => JSON.parse(row.snapshot).authorityLedger?.soundingsTurnIn?.requests.length), false);
  const restarted = publishAndRestart(accepted.snapshot, accepted.control);
  assert.deepEqual(restarted.control.retainedMutationResults, []);
  assert.deepEqual(restarted.control.acceptedMutationIds, []);
  assert.equal(artifacts().some(row => fingerprintSoundingsState(JSON.parse(row.snapshot)) === fingerprintSoundingsState(source.snapshot)), false);
  const duplicate = submitSoundingsTurnInCaller(restarted.snapshot, restarted.control, REQUEST_ID, new Map());
  assert.equal(duplicate.outcome.result.code, 'duplicate');
  console.log('RESTART_RETENTION_GAP', JSON.stringify({
    transientAcceptedResults: accepted.control.retainedMutationResults.length,
    restartedAcceptedResults: restarted.control.retainedMutationResults.length,
    restartedAcceptedIds: restarted.control.acceptedMutationIds.length,
    firstCompletionPublicationExists: true,
    exactSourceArtifactExists: false,
    validRetry: duplicate.outcome.result.code
  }));
}, 5 * 1024 * 1024);
