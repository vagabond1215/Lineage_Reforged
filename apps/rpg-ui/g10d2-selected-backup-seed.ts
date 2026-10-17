import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { admitCampaignMutation } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from '../../packages/engines/game-engine/src/player-quest-acceptance.ts';
import { createPlayerTravelCommand, executePlayerTravelCommand } from '../../packages/engines/game-engine/src/player-travel.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CLEAN_EPOCH_SESSION_STORAGE_KEY, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { advanceNearbyExplorationCaller } from './src/runtime/nearbyExplorationCaller.ts';
import { advanceAshenReefSurveyCaller } from './src/runtime/ashenReefSurveyCaller.ts';
import { submitSoundingsTurnInCaller } from './src/runtime/soundingsTurnInCaller.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const check = (value: unknown, label: string): asserts value => { if (!value) throw Error(label); };
const password = 'g10d2-synthetic-local-only';
function form(slotId: 'slot-1' | 'slot-2' | 'slot-3', sounding = false) {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState(slotId), playerName: `G10D2 ${slotId}`,
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child',
    ...(sounding ? { continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
      startingSettlementId: 'settlement.starfall_port' }
      : { continentId: 'region.kaelvar', regionId: 'region.auric_marches',
        startingSettlementId: 'settlement.stonevein' }) };
}
async function main() {
  const owner = await openCleanEpochAccountStore();
  const accountId = `account.local.${crypto.randomUUID()}`;
  try {
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'G10D2 Backup' }),
      await createCredentialRecord(accountId, password, new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form('slot-1'));
    check(first.status === 'ready', 'first backup run failed');
    let current = first.value;
    for (let i = 0; i < 2; i++) {
      const action = advanceNearbyExplorationCaller(current.loaded.snapshot, current.loaded.sessionControl);
      check(action.acceptedState && action.outcome.accepted, 'ordinary World mutation failed');
      const account = await owner.read(accountId);
      check(account, 'backup account missing');
      const saved = await new CleanEpochDescendantAdapter(owner).save({ accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
        expectedDestinationAddress: { artifactId: current.loaded.sessionControl.loadedArtifactId,
          publicationId: current.loaded.sessionControl.loadedPublicationId },
        snapshot: action.acceptedState.snapshot, control: action.acceptedState.control });
      check(saved.status === 'ready', 'ordinary World descendant failed');
      current = saved.value;
    }
    const historical = await owner.readHistoricalArtifact(accountId, 'slot-1',
      first.value.loaded.sessionControl.loadedArtifactId);
    const divergence = advanceNearbyExplorationCaller(historical.snapshot, historical.sessionControl);
    check(divergence.acceptedState && divergence.outcome.accepted, 'historical World mutation failed');
    const account = await owner.read(accountId);
    check(account, 'backup account missing before fork');
    const fork = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
      expectedAccountRevision: account.revision, expectedDestinationAddress: null,
      snapshot: divergence.acceptedState.snapshot, control: divergence.acceptedState.control });
    check(fork.status === 'ready' &&
      fork.value.loaded.snapshot.campaignIdentity?.forkedFromArtifactId === first.value.loaded.sessionControl.loadedArtifactId,
      'ordinary non-head fork failed');

    const sounding = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form('slot-2', true));
    check(sounding.status === 'ready', 'Soundings backup run failed');
    let state = { snapshot: sounding.value.loaded.snapshot, control: sounding.value.loaded.sessionControl };
    function admit(result: { accepted: boolean; snapshot: typeof state.snapshot }, mutationId: string) {
      check(result.accepted, 'Soundings mutation failed');
      const accepted = admitCampaignMutation(state.control, { mutationId,
        sourceArtifactId: state.control.loadedArtifactId, sourceRevision: state.control.sessionRevision,
        ownerKind: 'engine_result', accepted: true, sourceSnapshot: state.snapshot,
        proposedSnapshot: result.snapshot });
      check(accepted.accepted, 'Soundings mutation not admitted');
      state = { snapshot: accepted.snapshot, control: accepted.control };
    }
    const quest = createPlayerQuestAcceptanceCommand(state.snapshot, 'quest.ashen_reef_survey');
    admit(executePlayerQuestAcceptanceCommand(state.snapshot, quest), `mutation.${quest.commandId}`);
    const travel = createPlayerTravelCommand(state.snapshot, 'location.ashen_reef');
    admit(executePlayerTravelCommand(state.snapshot, travel), `mutation.${travel.commandId}`);
    const cache = new Map();
    for (let index = 1; index <= 4; index++) {
      const requestId = `survey_request.00000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
      const result = advanceAshenReefSurveyCaller(state.snapshot, state.control, requestId, cache);
      check(result.acceptedState && result.outcome.kind === 'accepted', `Soundings shift ${index}`);
      state = result.acceptedState;
    }
    const returnTrip = createPlayerTravelCommand(state.snapshot, 'settlement.starfall_port');
    admit(executePlayerTravelCommand(state.snapshot, returnTrip), `mutation.${returnTrip.commandId}`);
    const turnIn = submitSoundingsTurnInCaller(state.snapshot, state.control,
      `soundings_turn_in_request.${crypto.randomUUID()}`, new Map());
    check(turnIn.acceptedState && turnIn.outcome.kind === 'accepted', 'Soundings turn-in failed');
    state = turnIn.acceptedState;
    const soundingAccount = await owner.read(accountId);
    check(soundingAccount, 'Soundings account missing');
    const witnessed = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-2', destinationSlotId: 'slot-2', expectedAccountRevision: soundingAccount.revision,
      expectedDestinationAddress: { artifactId: sounding.value.loaded.sessionControl.loadedArtifactId,
        publicationId: sounding.value.loaded.sessionControl.loadedPublicationId },
      snapshot: state.snapshot, control: state.control });
    check(witnessed.status === 'ready', 'Soundings witness backup save failed');

    const third = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form('slot-3'));
    check(third.status === 'ready', 'third backup run failed');
    const final = await owner.read(accountId);
    check(final?.profile.history.runRecords.length === 3, 'three run histories missing');
    const archive = JSON.parse(await owner.exportArchive()) as { families: Array<{
      name: string; count: number; sha256: string }> };
    const witnessCount = archive.families.find(f => f.name === 'witnesses')?.count ?? 0;
    check(witnessCount >= 2, 'retained original and new Soundings witnesses missing');
    localStorage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY,
      JSON.stringify({ version: 1, accountId, issuedAt: new Date().toISOString() }));
    output.textContent = JSON.stringify({ status: 'PASS_SEEDED', accountId,
      accountRevision: final.revision, runCount: final.profile.history.runRecords.length,
      witnessCount, firstArtifactId: first.value.loaded.sessionControl.loadedArtifactId,
      forkArtifactId: fork.value.loaded.sessionControl.loadedArtifactId,
      soundingsArtifactId: witnessed.value.loaded.sessionControl.loadedArtifactId,
      thirdArtifactId: third.value.loaded.sessionControl.loadedArtifactId,
      families: archive.families.map(f => ({ name: f.name, count: f.count, sha256: f.sha256 })) }, null, 2);
  } finally { owner.close(); }
}
document.querySelector<HTMLButtonElement>('#seed')!.onclick = () => {
  document.querySelector<HTMLButtonElement>('#seed')!.disabled = true;
  void main().catch(error => { output.textContent = `FAIL: ${error instanceof Error ? error.message : String(error)}`; });
};
