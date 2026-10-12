import { createDefaultCharacterCreationFormState } from '../../apps/rpg-ui/src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts';
import { createNewGameSnapshot } from '../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts';
import { advanceNearbyExplorationCaller } from '../../apps/rpg-ui/src/runtime/nearbyExplorationCaller.ts';
import { resolveNearbyExplorationPlan } from '../../packages/engines/game-engine/src/player-nearby-exploration.ts';
import { createCampaignSessionControl, admitCampaignMutation } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { listLegalPlayerCombatCommands } from '../../packages/engines/game-engine/src/combat/index.ts';
import { admitNearbyEncounter, createNearbyEncounterAdmissionCommand, createNearbyEncounterStepCommand, executeNearbyEncounterStep } from '../../packages/engines/game-engine/src/player-nearby-encounter.ts';
import { serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';

let checks = 0;
function check(value, label) { checks++; if (!value) throw Error(label); }
const identity = getLineageIdentityCatalog('lineage.human');
const bundle = 'starting_bundle.traveler';
const form = { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Ordinary Stonevein',
  hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
  skinToneId: identity.skinToneOptions[0].id, startingBundleId: bundle,
  startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
  backstoryId: 'backstory.craftsmans_child', continentId: 'region.kaelvar',
  regionId: 'region.auric_marches', startingSettlementId: 'settlement.stonevein' };
const otherOrigin = createNewGameSnapshot({ ...form, startingSettlementId: 'settlement.coppergate' }, 'account.g10b4.other-origin');
check(!resolveNearbyExplorationPlan(otherOrigin).available && !otherOrigin.worldState.nearbyExplorationCandidate,
  'nonmatching ordinary origin has no authored nearby candidate');
let snapshot = createNewGameSnapshot(form, 'account.g10b4.ordinary');
let control = createCampaignSessionControl({ accountId: snapshot.accountId,
  campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.ordinary',
  publicationId: 'publication.ordinary', artifactRevision: 1,
  continuityId: snapshot.campaignIdentity.continuityId,
  headArtifactId: 'artifact.ordinary', headRevision: 1 });
let actions = 0;
let noMatch = 0;
while (!snapshot.worldState.nearbyExplorationCandidate && actions < 24) {
  const result = advanceNearbyExplorationCaller(snapshot, control);
  check(result.acceptedState?.snapshot && result.outcome.accepted, `nearby action ${actions + 1}`);
  ({ snapshot, control } = result.acceptedState);
  actions++;
  if (!snapshot.worldState.nearbyExplorationCandidate) noMatch++;
}
check(!!snapshot.worldState.nearbyExplorationCandidate, 'natural selected candidate');
const before = serializeSnapshot(snapshot);
const admissionCommand = createNearbyEncounterAdmissionCommand(snapshot, control);
check(admissionCommand?.candidate.sourceActionId === snapshot.worldState.nearbyExplorationContext.sourceActionId, 'source action bound');
const stale = admitNearbyEncounter(snapshot, control, { ...admissionCommand, sourceRevision: control.sessionRevision - 1 });
check(!stale.accepted && stale.code === 'stale_snapshot' && serializeSnapshot(snapshot) === before, 'stale admission unchanged');
const badCandidate = admitNearbyEncounter(snapshot, control, { ...admissionCommand, candidate: { ...admissionCommand.candidate, encounterTemplateId: 'unknown' } });
check(!badCandidate.accepted && badCandidate.code === 'invalid_candidate', 'candidate mismatch denied');
const entered = admitNearbyEncounter(snapshot, control, admissionCommand);
check(entered.accepted && entered.snapshot.gameState.activeEncounter, 'admitted active encounter');
({ snapshot, control } = entered);
check(snapshot.worldState.nearbyExplorationCandidate === null, 'candidate consumed');
const duplicate = admitNearbyEncounter(snapshot, control, admissionCommand);
check(duplicate.duplicate && !duplicate.accepted && serializeSnapshot(duplicate.snapshot) === serializeSnapshot(snapshot), 'admission duplicate stable');
const conflict = admitNearbyEncounter(snapshot, control, { ...admissionCommand, candidate: { ...admissionCommand.candidate, spawnWeight: 999 } });
check(!conflict.accepted && conflict.code === 'request_conflict', 'admission conflict fenced');
const forgedBridge = structuredClone(snapshot);
forgedBridge.authorityLedger.nearbyEncounters.admissions.push({ ...forgedBridge.authorityLedger.nearbyEncounters.admissions[0], requestId: 'encounter.admit.forged' });
check(!admitCampaignMutation(control, { mutationId: 'bridge.forged', sourceArtifactId: control.loadedArtifactId,
  sourceRevision: control.sessionRevision, ownerKind: 'legacy_bridge', accepted: true,
  sourceSnapshot: snapshot, proposedSnapshot: forgedBridge }).accepted, 'other mutation owner cannot forge encounter ledger');
const missingWitness = structuredClone(snapshot);
missingWitness.gameState.activeEncounter = null;
check(admitNearbyEncounter(missingWitness, control, admissionCommand).code === 'invalid_authority',
  'partial retained admission cannot claim duplicate');
const legal = listLegalPlayerCombatCommands(snapshot.gameState.activeEncounter);
check(legal.length > 0, 'actual granted attack available');
const selected = legal[0];
const badStep = createNearbyEncounterStepCommand(snapshot, control, 'combat.fake', selected.targetId, 'step.invalid');
check(executeNearbyEncounterStep(snapshot, control, badStep).code === 'illegal_command', 'unknown action rejected');
const wrongTarget = createNearbyEncounterStepCommand(snapshot, control, selected.actionType, 'foe.fake', 'step.wrong-target');
check(executeNearbyEncounterStep(snapshot, control, wrongTarget).code === 'illegal_command', 'wrong target rejected');
const wrongActor = createNearbyEncounterStepCommand(snapshot, control, selected.actionType, selected.targetId, 'step.wrong-actor');
check(executeNearbyEncounterStep(snapshot, control, { ...wrongActor, actorCombatantId: 'actor.fake' }).code === 'wrong_actor', 'wrong actor rejected');
const legalStep = createNearbyEncounterStepCommand(snapshot, control, selected.actionType, selected.targetId, 'step.legal');
const first = executeNearbyEncounterStep(snapshot, control, legalStep);
check(first.accepted, 'legal attack admitted');
({ snapshot, control } = first);
const duplicateStep = executeNearbyEncounterStep(snapshot, control, legalStep);
check(duplicateStep.duplicate && !duplicateStep.accepted, 'step duplicate stable');
check(executeNearbyEncounterStep(snapshot, control, { ...legalStep, actionType: 'combat.fake' }).code === 'request_conflict',
  'step request conflict fenced');
const staleStep = executeNearbyEncounterStep(snapshot, control, { ...legalStep, requestId: 'step.stale' });
check(!staleStep.accepted && staleStep.code === 'stale_snapshot', 'stale step fenced');
let combatBeats = 1;
while (snapshot.gameState.activeEncounter && combatBeats < 160) {
  const step = createNearbyEncounterStepCommand(snapshot, control, 'combat.advance', null, `step.advance.${combatBeats}`);
  const result = executeNearbyEncounterStep(snapshot, control, step);
  check(result.accepted, `combat beat ${combatBeats}: ${result.code}`);
  ({ snapshot, control } = result);
  combatBeats++;
}
check(!snapshot.gameState.activeEncounter, 'encounter resolved in bounded beats');
check(snapshot.gameState.combatHistory.at(-1)?.result === 'enemies_victorious', 'ordinary HP zero reached');
check(snapshot.normalDefeatReceipts?.length === 1, 'one normal defeat receipt');
check(snapshot.normalDefeatReceipts[0].posture === 'playable', 'verified recovery destination');
check(snapshot.playerState.resources.hp.current > 0 && snapshot.playerState.resources.stamina.current > 0, 'post recovery playable');
check(snapshot.authorityLedger.nearbyEncounters.admissions.length === 1, 'one durable admission');
check(snapshot.authorityLedger.nearbyEncounters.commands.length === combatBeats, 'durable commands');
check(executeNearbyEncounterStep(snapshot, control, legalStep).duplicate, 'post outcome duplicate stable');
console.log(JSON.stringify({ checks, actions, noMatch, combatBeats,
  candidateId: admissionCommand.candidate.id,
  encounterId: entered.snapshot.gameState.activeEncounter.encounterId,
  receiptId: snapshot.normalDefeatReceipts[0].receiptId,
  receiptPosture: snapshot.normalDefeatReceipts[0].posture,
  hp: snapshot.playerState.resources.hp.current,
  history: snapshot.gameState.combatHistory.length,
  authorityBytes: JSON.stringify(snapshot.authorityLedger.nearbyEncounters).length * 2 }));
