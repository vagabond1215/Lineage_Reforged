import { createDefaultCharacterCreationFormState } from '../../apps/rpg-ui/src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts';
import { createNewGameSnapshot } from '../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts';
import { advanceNearbyExplorationCaller } from '../../apps/rpg-ui/src/runtime/nearbyExplorationCaller.ts';
import { createCampaignSessionControl } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { createEncounterFromSpawnCandidate } from '../../packages/engines/game-engine/src/combat/index.ts';
import { serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';

function check(value, label) { if (!value) throw Error(label); }
const identity = getLineageIdentityCatalog('lineage.human');
const bundle = 'starting_bundle.traveler';
const form = { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'G10B4 projection',
  hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
  skinToneId: identity.skinToneOptions[0].id, startingBundleId: bundle,
  startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
  backstoryId: 'backstory.craftsmans_child', continentId: 'region.kaelvar',
  regionId: 'region.auric_marches', startingSettlementId: 'settlement.stonevein' };
let snapshot = createNewGameSnapshot(form, 'account.g10b4.projection');
let control = createCampaignSessionControl({ accountId: snapshot.accountId,
  campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.projection',
  publicationId: 'publication.projection', artifactRevision: 1,
  continuityId: snapshot.campaignIdentity.continuityId,
  headArtifactId: 'artifact.projection', headRevision: 1 });
let candidateCount = 0;
let maxEncounterBytes = 0;
let maxDeltaBytes = 0;
let maxCombatantCount = 0;
for (let index = 0; index < 24; index++) {
  const transition = advanceNearbyExplorationCaller(snapshot, control);
  check(transition.acceptedState && transition.outcome.accepted, `ordinary action ${index + 1}`);
  ({ snapshot, control } = transition.acceptedState);
  const candidate = snapshot.worldState.nearbyExplorationCandidate;
  if (!candidate) continue;
  candidateCount++;
  const projection = structuredClone(snapshot);
  const beforeBytes = 2 * serializeSnapshot(projection).length;
  const encounter = createEncounterFromSpawnCandidate(projection.gameState, projection.playerState,
    candidate, projection.clock.tick);
  check(encounter, `natural candidate projection ${index + 1}`);
  projection.gameState.activeEncounter = encounter;
  projection.worldState.nearbyExplorationCandidate = null;
  const afterBytes = 2 * serializeSnapshot(projection).length;
  maxEncounterBytes = Math.max(maxEncounterBytes, 2 * JSON.stringify(encounter).length);
  maxDeltaBytes = Math.max(maxDeltaBytes, afterBytes - beforeBytes);
  maxCombatantCount = Math.max(maxCombatantCount, encounter.combatants.length);
}
check(candidateCount > 0, 'one naturally selected candidate in 24 actions');
const receiptAllowanceBytes = 4096;
const projected24Bytes = 24 * (Math.max(maxEncounterBytes, maxDeltaBytes) + receiptAllowanceBytes);
console.log(JSON.stringify({ sourceHead: '3045963ec2b2ac988ff2f19e3beea4d98b8535e5',
  actions: 24, candidateCount, maxEncounterBytes, maxSnapshotDeltaBytes: maxDeltaBytes,
  maxCombatantCount, receiptAllowanceBytes, projected24Bytes }));
