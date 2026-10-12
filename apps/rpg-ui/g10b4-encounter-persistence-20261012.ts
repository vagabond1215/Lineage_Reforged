import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';
import { listLegalPlayerCombatCommands } from '../../packages/engines/game-engine/src/combat/index.ts';
import { admitNearbyEncounter, createNearbyEncounterAdmissionCommand, createNearbyEncounterStepCommand, executeNearbyEncounterStep } from '../../packages/engines/game-engine/src/player-nearby-encounter.ts';
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
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'G10B4 retained encounter',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.kaelvar',
    regionId: 'region.auric_marches', startingSettlementId: 'settlement.stonevein' };
}
async function main() {
  const name = `lineage.epoch-g10b4.encounter.${crypto.randomUUID()}`;
  const accountId = `account.local.${crypto.randomUUID()}`;
  let abortNext = false;
  let didAbort = false;
  const beforeWrite = (tx: IDBTransaction) => {
    if (abortNext) { abortNext = false; didAbort = true; tx.abort(); }
  };
  let owner = await openCleanEpochAccountStore({ name, beforeWrite });
  try {
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'G10B4 retained encounter' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
    check(first.status === 'ready', 'ordinary creator first campaign');
    let current = first.value;
    let publications = 1;
    let actions = 0;
    let noMatches = 0;
    let defeats = 0;
    let maxAuthorityBytes = 0;
    let maxSnapshotBytes = 0;
    let maxPublicationGrowthBytes = 0;
    let priorGraphBytes = 2 * serializeSnapshot(current.loaded.snapshot).length;
    const historical = [{ artifactId: current.loaded.sessionControl.loadedArtifactId,
      snapshot: serializeSnapshot(current.loaded.snapshot) }];
    async function save(snapshot: typeof current.loaded.snapshot, control: typeof current.loaded.sessionControl) {
      const account = (await owner.read(accountId))!;
      const saved = await new CleanEpochDescendantAdapter(owner).save({ accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
        snapshot, control, expectedDestinationAddress: {
          artifactId: current.loaded.sessionControl.loadedArtifactId,
          publicationId: current.loaded.sessionControl.loadedPublicationId
        } });
      check(saved.status === 'ready', `publication ${publications + 1}`);
      const currentBytes = 2 * serializeSnapshot(saved.value.loaded.snapshot).length;
      maxPublicationGrowthBytes = Math.max(maxPublicationGrowthBytes, currentBytes - priorGraphBytes);
      priorGraphBytes = currentBytes;
      current = saved.value;
      publications++;
      historical.push({ artifactId: current.loaded.sessionControl.loadedArtifactId,
        snapshot: serializeSnapshot(current.loaded.snapshot) });
      maxSnapshotBytes = Math.max(maxSnapshotBytes, currentBytes);
    }
    while (defeats < 3 && actions < 72) {
      const exploration = advanceNearbyExplorationCaller(current.loaded.snapshot, current.loaded.sessionControl);
      check(exploration.acceptedState && exploration.outcome.accepted, `ordinary nearby action ${actions + 1}`);
      actions++;
      await save(exploration.acceptedState.snapshot, exploration.acceptedState.control);
      const candidate = current.loaded.snapshot.worldState.nearbyExplorationCandidate;
      if (!candidate) { noMatches++; continue; }
      const admissionCommand = createNearbyEncounterAdmissionCommand(current.loaded.snapshot, current.loaded.sessionControl)!;
      const admitted = admitNearbyEncounter(current.loaded.snapshot, current.loaded.sessionControl, admissionCommand);
      check(admitted.accepted && admitted.snapshot.gameState.activeEncounter, `encounter ${defeats + 1} admitted`);
      await save(admitted.snapshot, admitted.control);
      owner.close();
      owner = await openCleanEpochAccountStore({ name, beforeWrite });
      const active = await owner.readSlot(accountId, 'slot-1');
      check(active.status === 'ready' && active.loaded.snapshot.gameState.activeEncounter?.encounterId === admitted.snapshot.gameState.activeEncounter.encounterId,
        'active encounter retained through restart');
      check(admitNearbyEncounter(active.loaded.snapshot, active.loaded.sessionControl, admissionCommand).duplicate,
        'admission duplicate retained after restart');
      current = { ...current, loaded: active.loaded };
      const legal = listLegalPlayerCombatCommands(current.loaded.snapshot.gameState.activeEncounter!);
      check(legal.length > 0, 'legal selected basic command');
      let snapshot = current.loaded.snapshot;
      let control = current.loaded.sessionControl;
      let step = createNearbyEncounterStepCommand(snapshot, control, legal[0]!.actionType, legal[0]!.targetId)!;
      let result = executeNearbyEncounterStep(snapshot, control, step);
      check(result.accepted, 'legal attack accepted');
      ({ snapshot, control } = result);
      await save(snapshot, control);
      owner.close();
      owner = await openCleanEpochAccountStore({ name, beforeWrite });
      const stepped = await owner.readSlot(accountId, 'slot-1');
      check(stepped.status === 'ready' && stepped.loaded.snapshot.gameState.activeEncounter,
        'accepted combat step retained through restart');
      check(executeNearbyEncounterStep(stepped.loaded.snapshot, stepped.loaded.sessionControl, step).duplicate,
        'exact combat step duplicate retained after restart');
      current = { ...current, loaded: stepped.loaded };
      snapshot = stepped.loaded.snapshot;
      control = stepped.loaded.sessionControl;
      let beats = 1;
      while (snapshot.gameState.activeEncounter && beats < 160) {
        step = createNearbyEncounterStepCommand(snapshot, control, 'combat.advance', null)!;
        result = executeNearbyEncounterStep(snapshot, control, step);
        check(result.accepted, `combat beat ${beats}`);
        ({ snapshot, control } = result);
        beats++;
      }
      check(!snapshot.gameState.activeEncounter && snapshot.gameState.combatHistory.at(-1)?.result === 'enemies_victorious',
        'ordinary actual HP-zero outcome');
      check(snapshot.normalDefeatReceipts?.length === defeats + 1 &&
        snapshot.normalDefeatReceipts.at(-1)?.posture === 'playable', 'one verified recovery per encounter');
      check(snapshot.playerState.resources.hp.current > 0, 'post-recovery HP positive');
      maxAuthorityBytes = Math.max(maxAuthorityBytes, 2 * JSON.stringify(snapshot.authorityLedger?.nearbyEncounters).length);
      await save(snapshot, control);
      const readback = await owner.readSlot(accountId, 'slot-1');
      check(readback.status === 'ready' && serializeSnapshot(readback.loaded.snapshot) === serializeSnapshot(current.loaded.snapshot),
        'exact recovered descendant readback');
      defeats++;
      output.textContent = `RUNNING ${defeats}/3 ordinary encounters, ${assertions} assertions`;
    }
    check(defeats === 3, 'three natural encounters');
    const before = await owner.readSlot(accountId, 'slot-1');
    check(before.status === 'ready', 'prior head ready before fault');
    const beforeHead = serializeSnapshot(before.loaded.snapshot);
    const beforeAccount = JSON.stringify(await owner.read(accountId));
    const later = advanceNearbyExplorationCaller(before.loaded.snapshot, before.loaded.sessionControl);
    check(later.acceptedState && later.outcome.accepted, 'failure intent prepared');
    abortNext = true;
    const failed = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: (await owner.read(accountId))!.revision,
      snapshot: later.acceptedState.snapshot, control: later.acceptedState.control,
      expectedDestinationAddress: { artifactId: before.loaded.sessionControl.loadedArtifactId,
        publicationId: before.loaded.sessionControl.loadedPublicationId } });
    check(didAbort && failed.status === 'blocked', 'faulted publication blocked');
    owner.close();
    const finalOwner = await openCleanEpochAccountStore({ name });
    try {
      const after = await finalOwner.readSlot(accountId, 'slot-1');
      check(after.status === 'ready' && serializeSnapshot(after.loaded.snapshot) === beforeHead,
        'fault restart retained exact prior head');
      check(JSON.stringify(await finalOwner.read(accountId)) === beforeAccount,
        'fault restart retained account revision');
      for (const sample of [historical[0], historical[Math.floor(historical.length / 2)], historical[historical.length - 2]]) {
        const retained = await finalOwner.readHistoricalArtifact(accountId, 'slot-1', sample!.artifactId);
        check(serializeSnapshot(retained.snapshot) === sample!.snapshot,
          'historical artifact retained exactly without head rebinding');
      }
      const authority = after.loaded.snapshot.authorityLedger?.nearbyEncounters;
      check(authority?.admissions.length === 3 && authority.commands.length > 3,
        'all encounter receipts retained');
      output.textContent = `PASS ${assertions} assertions; BROWSER_ENCOUNTER_PERSISTENCE_READY\n` + JSON.stringify({
        name, accountId, publications, actions, noMatches, defeats,
        headRevision: after.loaded.sessionControl.campaignHeadRevision,
        history: after.loaded.snapshot.gameState.combatHistory.length,
        chronicle: after.loaded.snapshot.sessionState.chronicle.length,
        commandReceipts: authority.commands.length,
        maxAuthorityBytes, maxSnapshotBytes, maxPublicationGrowthBytes,
        estimatedUsage: (await navigator.storage.estimate()).usage,
        estimatedQuota: (await navigator.storage.estimate()).quota,
        sourceHead: '3045963ec2b2ac988ff2f19e3beea4d98b8535e5' });
    } finally { finalOwner.close(); }
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL ${assertions}: ${error instanceof Error ? error.stack : error}`);
