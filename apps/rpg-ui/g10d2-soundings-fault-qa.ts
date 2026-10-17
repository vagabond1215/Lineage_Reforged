import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { admitCampaignMutation } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from '../../packages/engines/game-engine/src/player-quest-acceptance.ts';
import { createPlayerTravelCommand, executePlayerTravelCommand } from '../../packages/engines/game-engine/src/player-travel.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { advanceAshenReefSurveyCaller } from './src/runtime/ashenReefSurveyCaller.ts';
import { submitSoundingsTurnInCaller } from './src/runtime/soundingsTurnInCaller.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const rows: unknown[] = [];
let candidateArchive = '';
let accountId = '';
let state: { snapshot: any; control: any };
type Archive = { families: Array<{ name: string; count: number; sha256: string; rows: unknown[] }> };
type Fault = { phase: 'publication' | 'consumer'; mode: 'quota' | 'abort'; ordinal: number };
const parsed = (text: string) => JSON.parse(text) as Archive;
const family = (a: Archive, name: string) => a.families.find(f => f.name === name)!;
const signature = (a: Archive) => a.families.map(f => ({ name: f.name, count: f.count, sha256: f.sha256 }));
const same = (a: Archive, b: Archive) => JSON.stringify(signature(a)) === JSON.stringify(signature(b));
function check(value: unknown, label: string): asserts value { if (!value) throw Error(label); }
function report(label: string, value: Record<string, unknown>) {
  rows.push({ label, ...value }); output.textContent = JSON.stringify({ status: 'RUNNING', rows }, null, 2);
}
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'D4 Soundings Candidate',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
}
async function prepare() {
  const source = await openCleanEpochAccountStore();
  let sourceText: string;
  try { sourceText = await source.exportArchive(); } finally { source.close(); }
  const name = `lineage.g10d2.soundings.candidate.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name });
  accountId = `account.local.${crypto.randomUUID()}`;
  try {
    await owner.restoreArchive(sourceText);
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'D4 Soundings Candidate' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
    check(first.status === 'ready', 'Soundings first campaign not ready');
    state = { snapshot: first.value.loaded.snapshot, control: first.value.loaded.sessionControl };
    function admit(result: { accepted: boolean; snapshot: typeof state.snapshot }, mutationId: string) {
      check(result.accepted, 'Soundings mutation rejected');
      const accepted = admitCampaignMutation(state.control, { mutationId,
        sourceArtifactId: state.control.loadedArtifactId,
        sourceRevision: state.control.sessionRevision, ownerKind: 'engine_result',
        accepted: true, sourceSnapshot: state.snapshot, proposedSnapshot: result.snapshot });
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
    const back = createPlayerTravelCommand(state.snapshot, 'settlement.starfall_port');
    admit(executePlayerTravelCommand(state.snapshot, back), `mutation.${back.commandId}`);
    const turnIn = submitSoundingsTurnInCaller(state.snapshot, state.control,
      `soundings_turn_in_request.${crypto.randomUUID()}`, new Map());
    check(turnIn.acceptedState && turnIn.outcome.kind === 'accepted', 'Soundings turn-in rejected');
    state = turnIn.acceptedState;
    check(state.control.soundingsAdmissionWitness?.posture === 'session',
      'ordinary Soundings session witness absent');
    candidateArchive = await owner.exportArchive();
    const base = parsed(candidateArchive);
    check(family(base, 'artifacts').count >= 120 && family(base, 'witnesses').count >= 1,
      'candidate graph lacks grown source or prior witness');
    report('candidate', { bytes: new TextEncoder().encode(candidateArchive).byteLength,
      families: signature(base), candidateAccountId: accountId,
      candidateCampaignId: state.control.campaignId, sessionWitness: 'ORDINARY_FOUR_SHIFTS_TURN_IN' });
  } finally { owner.close(); }
}
async function clone(label: string) {
  const name = `lineage.g10d2.soundings.${label}.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name });
  await owner.restoreArchive(candidateArchive); owner.close(); return name;
}
async function save(name: string, fault?: Fault) {
  let phase: Fault['phase'] = 'publication';
  const counts = { publication: 0, consumer: 0 };
  const owner = await openCleanEpochAccountStore({ name,
    beforeWrite: () => {
      const ordinal = ++counts[phase];
      if (fault?.phase === phase && fault.mode === 'quota' && ordinal === fault.ordinal)
        throw new DOMException('synthetic Soundings quota', 'QuotaExceededError');
    },
    afterWrite: tx => {
      if (fault?.phase === phase && fault.mode === 'abort' && counts[phase] === fault.ordinal)
        tx.abort();
    } });
  try {
    const before = parsed(await owner.exportArchive());
    const account = await owner.read(accountId);
    check(account, 'Soundings candidate account absent');
    const current = await owner.readSlot(accountId, 'slot-1');
    check(current.status === 'ready', 'Soundings candidate source absent');
    const original = owner.completeDescendantConsumers.bind(owner);
    owner.completeDescendantConsumers = (...args) => { phase = 'consumer'; return original(...args); };
    const result = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
      expectedDestinationAddress: { artifactId: current.loaded.sessionControl.loadedArtifactId,
        publicationId: current.loaded.sessionControl.loadedPublicationId },
      snapshot: state.snapshot, control: state.control });
    return { before, after: parsed(await owner.exportArchive()), result, counts,
      accountRevision: account.revision, sourceId: current.loaded.sessionControl.loadedArtifactId };
  } finally { owner.close(); }
}
async function faultRow(label: string, fault: Fault) {
  const name = await clone(label);
  const tested = await save(name, fault);
  check(tested.result.status === 'blocked', `${label}: faulted witness save succeeded`);
  const owner = await openCleanEpochAccountStore({ name });
  try {
    const durable = parsed(await owner.exportArchive());
    check(same(tested.after, durable), `${label}: restart drift`);
    if (fault.phase === 'publication') {
      check(same(tested.before, durable), `${label}: partial witness publication`);
      const prior = await owner.readSlot(accountId, 'slot-1');
      check(prior.status === 'ready' && prior.loaded.sessionControl.loadedArtifactId === tested.sourceId,
        `${label}: source head moved`);
    } else {
      check(family(durable, 'witnesses').count === family(tested.before, 'witnesses').count + 1,
        `${label}: accepted Soundings witness missing`);
      check((await owner.read(accountId))?.revision === tested.accountRevision,
        `${label}: account partially completed`);
      const pending = await owner.readCurrentDescendantRecovery(accountId, 'slot-1');
      check(pending?.status === 'accepted_pending_consumers', `${label}: witness pending absent`);
      const resumed = await new CleanEpochDescendantAdapter(owner).resumeCurrent(accountId, 'slot-1');
      check(resumed.status === 'ready' && resumed.value.loaded.publication.publicationId === pending.publicationId,
        `${label}: witness recovery failed`);
      const retry = await owner.completeDescendantConsumers(accountId, pending.campaignId, pending.publicationId);
      check(retry.status === 'same_source_retry', `${label}: duplicate witness consumer`);
    }
    report(label, { fault, blockedCode: tested.result.code, writeCounts: tested.counts,
      prior: signature(tested.before), after: signature(durable),
      result: fault.phase === 'publication' ? 'EXACT_PRIOR_WITNESS' : 'ONE_WITNESS_PENDING_EXACT_RETRY' });
  } finally { owner.close(); }
}
async function main() {
  await prepare();
  const trialName = await clone('calibration');
  const trial = await save(trialName);
  check(trial.result.status === 'ready' &&
    family(trial.after, 'witnesses').count === family(trial.before, 'witnesses').count + 1,
    'witness calibration failed');
  report('witness-calibration', { counts: trial.counts });
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of new Set([1, Math.ceil(trial.counts.publication / 2), trial.counts.publication]))
      await faultRow(`D4-W1-${mode}-${ordinal}`, { phase: 'publication', mode, ordinal });
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of new Set([1, trial.counts.consumer]))
      await faultRow(`D3-P4-witness-${mode}-${ordinal}`, { phase: 'consumer', mode, ordinal });
  output.textContent = JSON.stringify({ status: 'PASS_SOUNDINGS_FAULTS', rows }, null, 2);
}
document.querySelector<HTMLButtonElement>('#run')!.onclick = () => {
  document.querySelector<HTMLButtonElement>('#run')!.disabled = true;
  void main().catch(error => { output.textContent = JSON.stringify({ status: 'FAIL',
    error: error instanceof Error ? error.message : String(error), rows }, null, 2); });
};
