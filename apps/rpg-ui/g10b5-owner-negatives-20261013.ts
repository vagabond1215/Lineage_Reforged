import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';
import { admitNearbyEncounter, createNearbyEncounterAdmissionCommand,
  createNearbyEncounterStepCommand, executeNearbyEncounterStep } from '../../packages/engines/game-engine/src/player-nearby-encounter.ts';
import { listLegalPlayerCombatCommands } from '../../packages/engines/game-engine/src/combat/index.ts';
import { advanceNearbyExplorationCaller } from './src/runtime/nearbyExplorationCaller.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
let assertions = 0;
function check(value: unknown, label: string): asserts value { assertions++; if (!value) throw Error(label); }
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'G10B5 owner ordinary source',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.kaelvar',
    regionId: 'region.auric_marches', startingSettlementId: 'settlement.stonevein' };
}
async function main() {
  const name = `lineage.epoch-g10b5.negatives.${crypto.randomUUID()}`;
  const accountId = `account.local.${crypto.randomUUID()}`;
  let fault: 'none' | 'abort' | 'quota' = 'none';
  const beforeWrite = (tx: IDBTransaction) => {
    if (fault === 'abort') { fault = 'none'; tx.abort(); }
    else if (fault === 'quota') { fault = 'none'; throw new DOMException('G10B5 quota', 'QuotaExceededError'); }
  };
  let owner = await openCleanEpochAccountStore({ name, beforeWrite });
  try {
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'G10B5 owner ordinary source' }),
      await createCredentialRecord(accountId, 'test-only-password', new Date().toISOString()));
    const started = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
    check(started.status === 'ready', 'ordinary creator source accepted');
    let current = started.value;
    let explorations = 0, noMatches = 0;
    let candidate: NonNullable<typeof current.loaded.snapshot.worldState.nearbyExplorationCandidate> | null = null;
    while (!candidate && explorations < 40) {
      const step = advanceNearbyExplorationCaller(current.loaded.snapshot, current.loaded.sessionControl);
      check(step.acceptedState && step.outcome.accepted, 'ordinary exploration accepted');
      explorations++;
      const account = (await owner.read(accountId))!;
      const saved = await new CleanEpochDescendantAdapter(owner).save({ accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
        expectedDestinationAddress: { artifactId: current.loaded.sessionControl.loadedArtifactId,
          publicationId: current.loaded.sessionControl.loadedPublicationId },
        snapshot: step.acceptedState.snapshot, control: step.acceptedState.control });
      check(saved.status === 'ready', 'exploration durable');
      current = saved.value;
      candidate = current.loaded.snapshot.worldState.nearbyExplorationCandidate ?? null;
      if (!candidate) noMatches++;
    }
    check(candidate, 'natural candidate reached');
    const source = current.loaded.snapshot, control = current.loaded.sessionControl;
    const command = createNearbyEncounterAdmissionCommand(source, control)!;
    check(!admitNearbyEncounter(source, control, null).accepted, 'malformed admission rejected');
    check(!admitNearbyEncounter(source, control, { ...command, sourceRevision: command.sourceRevision + 1 }).accepted,
      'stale admission rejected');
    check(admitNearbyEncounter(source, control, { ...command, candidate: { ...command.candidate, id: 'unknown' },
      requestId: 'encounter.admit.unknown' }).code === 'invalid_candidate', 'unknown candidate rejected');
    const wrongOrigin = structuredClone(source);
    wrongOrigin.playerState.location.settlementId = 'settlement.starfall_port';
    check(!admitNearbyEncounter(wrongOrigin, control, { ...command,
      sourceSnapshot: serializeSnapshot(wrongOrigin) }).accepted, 'nonmatching origin rejected');
    const admitted = admitNearbyEncounter(source, control, command);
    check(admitted.accepted && admitted.snapshot.gameState.activeEncounter, 'authored candidate admitted');
    check(admitNearbyEncounter(admitted.snapshot, admitted.control, command).duplicate, 'exact admission duplicate');
    check(admitNearbyEncounter(admitted.snapshot, admitted.control, { ...command,
      candidate: { ...command.candidate, selectedAtTick: command.candidate.selectedAtTick + 1 } }).code === 'request_conflict', 'admission conflict rejected');
    const account = (await owner.read(accountId))!;
    const saved = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
      expectedDestinationAddress: { artifactId: control.loadedArtifactId, publicationId: control.loadedPublicationId },
      snapshot: admitted.snapshot, control: admitted.control });
    check(saved.status === 'ready', 'admission durable');
    owner.close(); owner = await openCleanEpochAccountStore({ name, beforeWrite });
    const reopened = await owner.readSlot(accountId, 'slot-1');
    check(reopened.status === 'ready', 'reopen admitted source');
    check(admitNearbyEncounter(reopened.loaded.snapshot, reopened.loaded.sessionControl, command).duplicate,
      'reopen exact admission duplicate');
    const legal = listLegalPlayerCombatCommands(reopened.loaded.snapshot.gameState.activeEncounter!)[0]!;
    const combat = createNearbyEncounterStepCommand(reopened.loaded.snapshot, reopened.loaded.sessionControl,
      legal.actionType, legal.targetId)!;
    check(executeNearbyEncounterStep(reopened.loaded.snapshot, reopened.loaded.sessionControl,
      { ...combat, actorCombatantId: 'unknown' }).code === 'wrong_actor', 'wrong actor rejected');
    check(executeNearbyEncounterStep(reopened.loaded.snapshot, reopened.loaded.sessionControl,
      { ...combat, targetId: 'unknown' }).code === 'illegal_command', 'wrong target rejected');
    check(executeNearbyEncounterStep(reopened.loaded.snapshot, reopened.loaded.sessionControl,
      { ...combat, sourceRevision: combat.sourceRevision + 1 }).code === 'stale_snapshot', 'stale combat rejected');
    const executed = executeNearbyEncounterStep(reopened.loaded.snapshot, reopened.loaded.sessionControl, combat);
    check(executed.accepted, 'legal command accepted');
    check(executeNearbyEncounterStep(executed.snapshot, executed.control, combat).duplicate,
      'exact command duplicate');
    check(executeNearbyEncounterStep(executed.snapshot, executed.control,
      { ...combat, targetId: 'unknown' }).code === 'request_conflict', 'conflicting command rejected');
    const beforeAccount = JSON.stringify(await owner.read(accountId));
    const beforeSlot = await owner.readSlot(accountId, 'slot-1');
    check(beforeSlot.status === 'ready', 'prior head before abort');
    const beforeSnapshot = serializeSnapshot(beforeSlot.loaded.snapshot);
    const descendant = new CleanEpochDescendantAdapter(owner);
    fault = 'abort';
    const aborted = await descendant.save({ accountId, sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
      expectedAccountRevision: (await owner.read(accountId))!.revision,
      expectedDestinationAddress: { artifactId: beforeSlot.loaded.sessionControl.loadedArtifactId,
        publicationId: beforeSlot.loaded.sessionControl.loadedPublicationId },
      snapshot: executed.snapshot, control: executed.control });
    check(aborted.status === 'blocked', 'abort blocked descendant');
    owner.close(); owner = await openCleanEpochAccountStore({ name, beforeWrite });
    const afterAbort = await owner.readSlot(accountId, 'slot-1');
    check(afterAbort.status === 'ready' && serializeSnapshot(afterAbort.loaded.snapshot) === beforeSnapshot,
      'abort retained exact head');
    check(JSON.stringify(await owner.read(accountId)) === beforeAccount, 'abort retained account');
    fault = 'quota';
    const quota = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
      expectedAccountRevision: (await owner.read(accountId))!.revision,
      expectedDestinationAddress: { artifactId: beforeSlot.loaded.sessionControl.loadedArtifactId,
        publicationId: beforeSlot.loaded.sessionControl.loadedPublicationId },
      snapshot: executed.snapshot, control: executed.control });
    check(quota.status === 'blocked', 'quota blocked descendant');
    check(JSON.stringify(await owner.read(accountId)) === beforeAccount, 'quota retained account');
    const afterQuota = await owner.readSlot(accountId, 'slot-1');
    check(afterQuota.status === 'ready' && serializeSnapshot(afterQuota.loaded.snapshot) === beforeSnapshot,
      'quota retained exact head');
    output.textContent = `PASS ${assertions} fresh G10B.5 owner negative assertions\n` + JSON.stringify({
      name, accountId, explorations, noMatches, candidateId: candidate.id,
      admissionId: command.requestId, combatRequestId: combat.requestId,
      priorArtifactId: beforeSlot.loaded.sessionControl.loadedArtifactId,
      priorPublicationId: beforeSlot.loaded.sessionControl.loadedPublicationId,
      accountRevision: (await owner.read(accountId))!.revision }, null, 2);
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL ${assertions} ${error instanceof Error ? error.stack : error}`);
