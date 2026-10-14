import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { advanceNearbyExplorationCaller } from './src/runtime/nearbyExplorationCaller.ts';
import { advanceAshenReefSurveyCaller } from './src/runtime/ashenReefSurveyCaller.ts';
import { submitSoundingsTurnInCaller } from './src/runtime/soundingsTurnInCaller.ts';
import { admitCampaignMutation } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from '../../packages/engines/game-engine/src/player-quest-acceptance.ts';
import { createPlayerTravelCommand, executePlayerTravelCommand } from '../../packages/engines/game-engine/src/player-travel.ts';
import { verifySoundingsAdmissionProvenance } from '../../packages/engines/game-engine/src/soundings-admission-witness.ts';
import { listLegalPlayerCombatCommands } from '../../packages/engines/game-engine/src/combat/index.ts';
import { admitNearbyEncounter, createNearbyEncounterAdmissionCommand,
  createNearbyEncounterStepCommand, executeNearbyEncounterStep } from '../../packages/engines/game-engine/src/player-nearby-encounter.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
let checks = 0;
function check(value: unknown, label: string): asserts value { checks++; if (!value) throw Error(label); }
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Archive Test',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.kaelvar',
    regionId: 'region.auric_marches', startingSettlementId: 'settlement.stonevein' };
}
function soundingsForm() {
  return { ...form(), continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
    startingSettlementId: 'settlement.starfall_port' };
}
async function digest(value: string) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))]
    .map(byte => byte.toString(16).padStart(2, '0')).join('');
}
type Archive = { archiveVersion: number; families: Array<{ name: string; keyPath: string | string[];
  count: number; sha256: string; rows: unknown[] }>;
  sha256: string; [key: string]: unknown };
async function repack(value: Archive) {
  for (const family of value.families) {
    family.count = family.rows.length;
    family.sha256 = await digest(JSON.stringify(family.rows));
  }
  const { sha256, ...payload } = value;
  value.sha256 = await digest(JSON.stringify(payload));
  return JSON.stringify(value);
}
async function mergeArchives(...texts: string[]) {
  const merged = JSON.parse(texts[0]!) as Archive;
  for (const text of texts.slice(1)) {
    const next = JSON.parse(text) as Archive;
    for (let index = 0; index < merged.families.length; index++)
      merged.families[index]!.rows.push(...next.families[index]!.rows);
  }
  for (const family of merged.families) {
    const path = typeof family.keyPath === 'string' ? [family.keyPath] : family.keyPath;
    family.rows.sort((left, right) => indexedDB.cmp(
      path.map(field => (left as Record<string, string>)[field]!),
      path.map(field => (right as Record<string, string>)[field]!)));
  }
  return repack(merged);
}
async function rejection(text: string, label: string) {
  const name = `lineage.g10c.reject.${crypto.randomUUID()}`;
  const target = await openCleanEpochAccountStore({ name });
  try {
    let rejected = false;
    try { await target.restoreArchive(text); } catch { rejected = true; }
    check(rejected, label);
    const empty = JSON.parse(await target.exportArchive()) as Archive;
    check(empty.families.every(family => family.count === 0), `${label}: target remains empty`);
  } finally { target.close(); }
}
async function main() {
  const sourceName = `lineage.g10c.source.${crypto.randomUUID()}`;
  const accountId = `account.local.${crypto.randomUUID()}`;
  const password = 'disposable-g10c-only';
  let source = await openCleanEpochAccountStore({ name: sourceName });
  let archive: string;
  let firstArtifactId = '';
  let terminalId = '';
  let grownArchive = '';
  try {
    await source.register(createDefaultAccountProfileState({ accountId, displayName: 'Archive Test' }),
      await createCredentialRecord(accountId, password, new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(source).start(accountId, form());
    check(first.status === 'ready', 'ordinary first campaign ready');
    firstArtifactId = first.value.loaded.sessionControl.loadedArtifactId;
    let current = first.value;
    for (let i = 0; i < 2; i++) {
      const action = advanceNearbyExplorationCaller(current.loaded.snapshot, current.loaded.sessionControl);
      check(action.acceptedState && action.outcome.accepted, `ordinary history mutation ${i + 1}`);
      const account = (await source.read(accountId))!;
      const saved = await new CleanEpochDescendantAdapter(source).save({ accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
        expectedDestinationAddress: { artifactId: current.loaded.sessionControl.loadedArtifactId,
          publicationId: current.loaded.sessionControl.loadedPublicationId },
        snapshot: action.acceptedState.snapshot, control: action.acceptedState.control });
      check(saved.status === 'ready', `ordinary descendant ${i + 1} durable`);
      current = saved.value;
    }
    terminalId = `account.local.${crypto.randomUUID()}`;
    await source.register(createDefaultAccountProfileState({ accountId: terminalId,
      displayName: 'Archive Terminal' }),
    await createCredentialRecord(terminalId, password, new Date().toISOString()));
    const terminalFirst = await new CleanEpochFirstCampaignAdapter(source).start(terminalId, form());
    check(terminalFirst.status === 'ready', 'ordinary terminal source campaign');
    const terminalAccount = (await source.read(terminalId))!;
    const retirement = await new CleanEpochTerminalAdapter(source).retire({ accountId: terminalId,
      sourceSlotId: 'slot-1', expectedAccountRevision: terminalAccount.revision,
      snapshot: terminalFirst.value.loaded.snapshot,
      control: terminalFirst.value.loaded.sessionControl,
      expectedSourceAddress: { artifactId: terminalFirst.value.loaded.sessionControl.loadedArtifactId,
        publicationId: terminalFirst.value.loaded.sessionControl.loadedPublicationId } });
    check(retirement.status === 'completed', 'ordinary terminal settlement and address closure');
    check(await source.closePendingTerminalAddressesForAccount(terminalId) === 1,
      'ordinary settled terminal closes its retained address with deletion receipt');
    const resetId = `account.local.${crypto.randomUUID()}`;
    const deleteId = `account.local.${crypto.randomUUID()}`;
    for (const id of [resetId, deleteId])
      await source.register(createDefaultAccountProfileState({ accountId: id, displayName: 'Disposable Lifecycle' }),
        await createCredentialRecord(id, password, new Date().toISOString()));
    await source.transitionAccount('reset', { accountId: resetId, expectedRevision: 1,
      expectedGeneration: 1, currentPassword: password });
    await source.transitionAccount('delete', { accountId: deleteId, expectedRevision: 1,
      expectedGeneration: 1, currentPassword: password, requestId: crypto.randomUUID() });
    archive = await source.exportArchive();
    const parsed = JSON.parse(archive) as Archive;
    check(parsed.families.length === 14 && parsed.families.some(f => f.name === 'accounts' && f.count === 3) &&
      parsed.families.some(f => f.name === 'accountLifecycle' && f.count === 2),
      'all epoch families, credential accounts, reset and deleted tombstone included');
    check(parsed.families.some(f => f.name === 'artifacts' && f.count === 5) &&
      parsed.families.some(f => f.name === 'firstPublicationRecoveriesV6' && f.count === 2) &&
      parsed.families.some(f => f.name === 'terminalLifecycleRecoveries' && f.count === 1) &&
      parsed.families.some(f => f.name === 'addressDeletionReceipts' && f.count === 1),
      'first, descendant and terminal publications, deletion receipts and immutable history included');
  } finally { source.close(); }

  const targetName = `lineage.g10c.target.${crypto.randomUUID()}`;
  let target = await openCleanEpochAccountStore({ name: targetName });
  try {
    await target.restoreArchive(archive);
    const restored = JSON.parse(await target.exportArchive()) as Archive;
    const original = JSON.parse(archive) as Archive;
    check(restored.families.every((family, index) => family.sha256 === original.families[index]!.sha256),
      'every family digest survives restore');
    target.close(); target = await openCleanEpochAccountStore({ name: targetName });
    const read = await target.readSlot(accountId, 'slot-1');
    check(read.status === 'ready', `ready campaign loads after owner restart: ${read.status}`);
    const historical = await target.readHistoricalArtifact(accountId, 'slot-1', firstArtifactId);
    check(historical.sessionControl.loadedArtifactId === firstArtifactId &&
      historical.snapshot.capturedAtTick < read.loaded.snapshot.capturedAtTick,
      'non-head first artifact loads with exact historical source after restore');
    const account = await target.read(accountId);
    check(account?.credential.accountId === accountId, 'credential verifier restored');
    check((await target.list()).length === 3, 'reset and terminal accounts remain and deleted identity remains tombstoned');
    let occupied = false;
    try { await target.restoreArchive(archive); } catch { occupied = true; }
    check(occupied, 'second import into occupied target rejects');
    check((await target.readSlot(accountId, 'slot-1')).status === 'ready', 'occupied rejection preserves ready slot');
    await target.updateProfile(accountId, account!.revision,
      { ...account!.profile, displayName: 'Archive Test Grown', updatedAt: new Date().toISOString() });
    const divergence = advanceNearbyExplorationCaller(historical.snapshot, historical.sessionControl);
    check(divergence.acceptedState && divergence.outcome.accepted,
      'historical non-head source accepts divergent ordinary action');
    const grown = (await target.read(accountId))!;
    const fork = await new CleanEpochDescendantAdapter(target).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'quick-save',
      expectedAccountRevision: grown.revision, expectedDestinationAddress: null,
      snapshot: divergence.acceptedState.snapshot, control: divergence.acceptedState.control });
    check(fork.status === 'ready' &&
      fork.value.loaded.snapshot.campaignIdentity?.forkedFromArtifactId === firstArtifactId,
      'historical non-head source publishes an explicit fork');
    grownArchive = await target.exportArchive();
    const growth = JSON.parse(grownArchive) as Archive;
    check(growth.families[0]!.sha256 !== original.families[0]!.sha256,
      'second backup captures legitimate restored account growth');
    const forkTarget = await openCleanEpochAccountStore({
      name: `lineage.g10c.fork-target.${crypto.randomUUID()}` });
    try {
      await forkTarget.restoreArchive(grownArchive);
      const forkRead = await forkTarget.readSlot(accountId, 'quick-save');
      check(forkRead.status === 'ready' &&
        forkRead.loaded.snapshot.campaignIdentity?.forkedFromArtifactId === firstArtifactId,
        'second backup restores explicit non-head fork and its address');
      check((await forkTarget.readHistoricalArtifact(accountId, 'slot-1', firstArtifactId))
        .sessionControl.loadedArtifactId === firstArtifactId,
        'second backup retains fork source history');
    } finally { forkTarget.close(); }
  } finally { target.close(); }

  const pendingName = `lineage.g10c.pending.${crypto.randomUUID()}`;
  const pendingId = `account.local.${crypto.randomUUID()}`;
  const pendingOwner = await openCleanEpochAccountStore({ name: pendingName });
  let pendingArchive = '';
  try {
    await pendingOwner.register(createDefaultAccountProfileState({ accountId: pendingId,
      displayName: 'Archive Pending' }),
    await createCredentialRecord(pendingId, password, new Date().toISOString()));
    const originalCompletion = pendingOwner.completePreparedAttemptConsumers.bind(pendingOwner);
    pendingOwner.completePreparedAttemptConsumers = async () => {
      throw Error('synthetic interruption after publication');
    };
    try { await new CleanEpochFirstCampaignAdapter(pendingOwner).start(pendingId, form()); }
    catch { /* the publication is durable and its consumers remain pending */ }
    pendingOwner.completePreparedAttemptConsumers = originalCompletion;
    const pending = await pendingOwner.readRecovery(pendingId, 'slot-1');
    check(pending?.status === 'accepted_pending_consumers', 'ordinary first publication pending before backup');
    pendingArchive = await pendingOwner.exportArchive();
  } finally { pendingOwner.close(); }
  const restoredPendingName = `lineage.g10c.restored-pending.${crypto.randomUUID()}`;
  let restoredPending = await openCleanEpochAccountStore({ name: restoredPendingName });
  try {
    await restoredPending.restoreArchive(pendingArchive);
    restoredPending.close();
    restoredPending = await openCleanEpochAccountStore({ name: restoredPendingName });
    const pending = (await restoredPending.readRecovery(pendingId, 'slot-1'))!;
    check(pending.status === 'accepted_pending_consumers', 'pending first publication survives restore and restart');
    const completed = await restoredPending.completePreparedAttemptConsumers(pendingId, 'slot-1',
      pending.attemptId, pending.publicationId);
    check(completed.status === 'committed', 'exact pending consumers complete after restore');
    const duplicate = await restoredPending.completePreparedAttemptConsumers(pendingId, 'slot-1',
      pending.attemptId, pending.publicationId);
    check(duplicate.status === 'same_source_retry', 'exact completion retry after restore');
    check((await restoredPending.readSlot(pendingId, 'slot-1')).status === 'ready',
      'completed restored first campaign loads');
  } finally { restoredPending.close(); }

  const soundingName = `lineage.g10c.soundings.${crypto.randomUUID()}`;
  const soundingId = `account.local.${crypto.randomUUID()}`;
  const soundingOwner = await openCleanEpochAccountStore({ name: soundingName });
  let soundingArchive = '';
  let soundingCampaignId = '';
  try {
    await soundingOwner.register(createDefaultAccountProfileState({ accountId: soundingId,
      displayName: 'Archive Soundings' }),
    await createCredentialRecord(soundingId, password, new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(soundingOwner).start(soundingId, soundingsForm());
    check(first.status === 'ready', 'ordinary Soundings first campaign');
    let state = { snapshot: first.value.loaded.snapshot, control: first.value.loaded.sessionControl };
    soundingCampaignId = state.control.campaignId;
    function admit(result: { accepted: boolean; snapshot: typeof state.snapshot }, mutationId: string) {
      check(result.accepted, 'ordinary Soundings mutation accepted');
      const admitted = admitCampaignMutation(state.control, { mutationId,
        sourceArtifactId: state.control.loadedArtifactId, sourceRevision: state.control.sessionRevision,
        ownerKind: 'engine_result', accepted: true, sourceSnapshot: state.snapshot,
        proposedSnapshot: result.snapshot });
      check(admitted.accepted, 'Soundings session mutation admitted');
      state = { snapshot: admitted.snapshot, control: admitted.control };
    }
    const quest = createPlayerQuestAcceptanceCommand(state.snapshot, 'quest.ashen_reef_survey');
    admit(executePlayerQuestAcceptanceCommand(state.snapshot, quest), `mutation.${quest.commandId}`);
    const outward = createPlayerTravelCommand(state.snapshot, 'location.ashen_reef');
    admit(executePlayerTravelCommand(state.snapshot, outward), `mutation.${outward.commandId}`);
    const cache = new Map();
    for (let index = 1; index <= 4; index++) {
      const requestId = `survey_request.00000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
      const result = advanceAshenReefSurveyCaller(state.snapshot, state.control, requestId, cache);
      check(result.acceptedState && result.outcome.kind === 'accepted', 'ordinary Soundings survey stage');
      state = result.acceptedState;
    }
    const returnTrip = createPlayerTravelCommand(state.snapshot, 'settlement.starfall_port');
    admit(executePlayerTravelCommand(state.snapshot, returnTrip), `mutation.${returnTrip.commandId}`);
    const turnIn = submitSoundingsTurnInCaller(state.snapshot, state.control,
      `soundings_turn_in_request.${crypto.randomUUID()}`, new Map());
    check(turnIn.acceptedState && turnIn.outcome.kind === 'accepted', 'ordinary Soundings turn-in');
    state = turnIn.acceptedState;
    const account = (await soundingOwner.read(soundingId))!;
    const saved = await new CleanEpochDescendantAdapter(soundingOwner).save({ accountId: soundingId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
      expectedDestinationAddress: { artifactId: first.value.loaded.sessionControl.loadedArtifactId,
        publicationId: first.value.loaded.sessionControl.loadedPublicationId },
      snapshot: state.snapshot, control: state.control });
    check(saved.status === 'ready', 'witnessed descendant durable before backup');
    soundingArchive = await soundingOwner.exportArchive();
    check((JSON.parse(soundingArchive) as Archive).families.find(f => f.name === 'witnesses')!.count === 1,
      'independent Soundings witness archived');
  } finally { soundingOwner.close(); }
  const restoredSounding = await openCleanEpochAccountStore({
    name: `lineage.g10c.restored-soundings.${crypto.randomUUID()}` });
  try {
    await restoredSounding.restoreArchive(soundingArchive);
    const read = await restoredSounding.readSlot(soundingId, 'slot-1');
    check(read.status === 'ready' && read.loaded.sessionControl.campaignId === soundingCampaignId &&
      verifySoundingsAdmissionProvenance(read.loaded.snapshot, read.loaded.sessionControl) === 'verified',
      'restored Soundings head retains verified independent witness');
  } finally { restoredSounding.close(); }
  const combinedArchive = await mergeArchives(archive, soundingArchive);
  const combined = JSON.parse(combinedArchive) as Archive;
  const combinedTarget = await openCleanEpochAccountStore({
    name: `lineage.g10c.combined.${crypto.randomUUID()}` });
  try {
    await combinedTarget.restoreArchive(combinedArchive);
    const combinedRead = JSON.parse(await combinedTarget.exportArchive()) as Archive;
    check(combinedRead.families.every((family, index) => family.sha256 === combined.families[index]!.sha256),
      'one combined complete epoch preserves every family digest');
    check(combinedRead.families.find(f => f.name === 'witnesses')?.count === 1 &&
      combinedRead.families.find(f => f.name === 'terminalLifecycleRecoveries')?.count === 1 &&
      combinedRead.families.find(f => f.name === 'addressDeletionReceipts')?.count === 1 &&
      combinedRead.families.find(f => f.name === 'accountLifecycle')?.count === 2,
      'combined epoch holds witness, terminal, deletion and lifecycle authority');
    check((await combinedTarget.readSlot(soundingId, 'slot-1')).status === 'ready' &&
      (await combinedTarget.readSlot(terminalId, 'slot-1')).status === 'empty',
      'combined epoch keeps witnessed head and closed terminal address');
  } finally { combinedTarget.close(); }
  const forgedWitness = JSON.parse(soundingArchive) as Archive;
  const witness = forgedWitness.families.find(f => f.name === 'witnesses')!.rows[0] as
    { value: { sourceArtifactId: string } };
  witness.value.sourceArtifactId = 'artifact.forged-soundings-source';
  await rejection(await repack(forgedWitness), 'forged Soundings provenance with recomputed digests');
  const unsorted = JSON.parse(archive) as Archive;
  unsorted.families.find(f => f.name === 'accounts')!.rows.reverse();
  await rejection(await repack(unsorted), 'valid rows in noncanonical key order');

  const normalName = `lineage.g10c.normal.${crypto.randomUUID()}`;
  const normalId = `account.local.${crypto.randomUUID()}`;
  const normalOwner = await openCleanEpochAccountStore({ name: normalName });
  let normalArchive = '';
  try {
    await normalOwner.register(createDefaultAccountProfileState({ accountId: normalId,
      displayName: 'Archive Normal' }),
    await createCredentialRecord(normalId, password, new Date().toISOString()));
    const first = await new CleanEpochFirstCampaignAdapter(normalOwner).start(normalId, form());
    check(first.status === 'ready', 'ordinary Normal-Stakes first campaign');
    let current = first.value;
    async function save(snapshot: typeof current.loaded.snapshot, control: typeof current.loaded.sessionControl) {
      const account = (await normalOwner.read(normalId))!;
      const saved = await new CleanEpochDescendantAdapter(normalOwner).save({ accountId: normalId,
        sourceSlotId: 'slot-1', destinationSlotId: 'slot-1', expectedAccountRevision: account.revision,
        expectedDestinationAddress: { artifactId: current.loaded.sessionControl.loadedArtifactId,
          publicationId: current.loaded.sessionControl.loadedPublicationId }, snapshot, control });
      check(saved.status === 'ready', 'ordinary Normal-Stakes descendant durable');
      current = saved.value;
    }
    let recovered = false;
    for (let action = 0; action < 72 && !recovered; action++) {
      const exploration = advanceNearbyExplorationCaller(current.loaded.snapshot,
        current.loaded.sessionControl);
      check(exploration.acceptedState && exploration.outcome.accepted, 'ordinary nearby exploration');
      await save(exploration.acceptedState.snapshot, exploration.acceptedState.control);
      if (!current.loaded.snapshot.worldState.nearbyExplorationCandidate) continue;
      const admission = createNearbyEncounterAdmissionCommand(current.loaded.snapshot,
        current.loaded.sessionControl)!;
      const admitted = admitNearbyEncounter(current.loaded.snapshot,
        current.loaded.sessionControl, admission);
      check(admitted.accepted && admitted.snapshot.gameState.activeEncounter,
        'ordinary Normal-Stakes encounter admitted');
      await save(admitted.snapshot, admitted.control);
      const legal = listLegalPlayerCombatCommands(current.loaded.snapshot.gameState.activeEncounter!);
      check(legal.length > 0, 'ordinary combat command available');
      let snapshot = current.loaded.snapshot;
      let control = current.loaded.sessionControl;
      let step = createNearbyEncounterStepCommand(snapshot, control,
        legal[0]!.actionType, legal[0]!.targetId)!;
      let outcome = executeNearbyEncounterStep(snapshot, control, step);
      check(outcome.accepted, 'ordinary first combat command accepted');
      ({ snapshot, control } = outcome);
      let beats = 0;
      while (snapshot.gameState.activeEncounter && beats++ < 160) {
        step = createNearbyEncounterStepCommand(snapshot, control, 'combat.advance', null)!;
        outcome = executeNearbyEncounterStep(snapshot, control, step);
        check(outcome.accepted, 'ordinary combat beat accepted');
        ({ snapshot, control } = outcome);
      }
      check(!snapshot.gameState.activeEncounter &&
        snapshot.gameState.combatHistory.at(-1)?.result === 'enemies_victorious' &&
        snapshot.normalDefeatReceipts?.at(-1)?.posture === 'playable' &&
        snapshot.playerState.resources.hp.current > 0,
        'ordinary HP-zero produces playable Normal-Stakes recovery');
      await save(snapshot, control);
      recovered = true;
    }
    check(recovered, 'ordinary Normal-Stakes recovery reached');
    normalArchive = await normalOwner.exportArchive();
  } finally { normalOwner.close(); }
  const normalTarget = await openCleanEpochAccountStore({
    name: `lineage.g10c.restored-normal.${crypto.randomUUID()}` });
  try {
    await normalTarget.restoreArchive(normalArchive);
    const recovered = await normalTarget.readSlot(normalId, 'slot-1');
    check(recovered.status === 'ready' &&
      recovered.loaded.snapshot.normalDefeatReceipts?.at(-1)?.posture === 'playable' &&
      recovered.loaded.snapshot.playerState.resources.hp.current > 0,
      'restored Normal-Stakes recovery remains playable');
  } finally { normalTarget.close(); }

  const mixedArchive = await mergeArchives(grownArchive, pendingArchive,
    soundingArchive, normalArchive);
  const mixedTarget = await openCleanEpochAccountStore({
    name: `lineage.g10c.mixed.${crypto.randomUUID()}` });
  try {
    await mixedTarget.restoreArchive(mixedArchive);
    const graph = JSON.parse(await mixedTarget.exportArchive()) as Archive;
    const original = JSON.parse(mixedArchive) as Archive;
    check(graph.families.every((family, index) => family.sha256 === original.families[index]!.sha256),
      'single mixed-history archive restores exact all-family graph');
    check(graph.families.find(f => f.name === 'witnesses')?.count === 1 &&
      graph.families.find(f => f.name === 'terminalLifecycleRecoveries')?.count === 1 &&
      graph.families.find(f => f.name === 'addressDeletionReceipts')?.count === 1 &&
      graph.families.find(f => f.name === 'descendantPublicationRecoveries')!.count >= 4,
      'mixed-history archive contains witness, terminal, deletion and fork/Normal descendants');
  } finally { mixedTarget.close(); }

  const lostAckName = `lineage.g10c.lost-ack.${crypto.randomUUID()}`;
  let lostAck = await openCleanEpochAccountStore({ name: lostAckName });
  try {
    const originalExport = lostAck.exportArchive.bind(lostAck);
    lostAck.exportArchive = async () => { throw Error('synthetic post-commit readback interruption'); };
    let code = '';
    try { await lostAck.restoreArchive(archive); }
    catch (error) { code = (error as { code?: string }).code ?? ''; }
    check(code === 'readback_failed', 'post-commit lost acknowledgement is distinct from preflight rejection');
    lostAck.exportArchive = originalExport;
    lostAck.close(); lostAck = await openCleanEpochAccountStore({ name: lostAckName });
    const durable = JSON.parse(await lostAck.exportArchive()) as Archive;
    const source = JSON.parse(archive) as Archive;
    check(durable.families.every((family, index) => family.sha256 === source.families[index]!.sha256),
      'post-commit restart reveals exact imported graph');
    let refused = false;
    try { await lostAck.restoreArchive(archive); } catch { refused = true; }
    check(refused, 'new import intent into committed lost-ack target is refused');
    const afterRefusal = JSON.parse(await lostAck.exportArchive()) as Archive;
    check(afterRefusal.families.every((family, index) => family.sha256 === source.families[index]!.sha256),
      'lost-ack target remains exact after occupied retry');
  } finally { lostAck.close(); }

  await rejection(archive.slice(0, -17), 'truncated archive');
  await rejection(archive + 'x', 'trailing corruption');
  const wrong = JSON.parse(archive) as Archive; wrong.archiveVersion = 99;
  await rejection(await repack(wrong), 'wrong archive version');
  const missing = JSON.parse(archive) as Archive; missing.families.pop();
  await rejection(await repack(missing), 'missing family');
  const duplicate = JSON.parse(archive) as Archive;
  duplicate.families[0]!.rows.push(duplicate.families[0]!.rows[0]);
  await rejection(await repack(duplicate), 'duplicate account key with recomputed digests');
  const forged = JSON.parse(archive) as Archive;
  forged.families.find(f => f.name === 'artifacts')!.rows.pop();
  await rejection(await repack(forged), 'missing graph artifact with recomputed digests');
  const unknown = JSON.parse(archive) as Archive;
  unknown.families[13]!.name = 'unknownEpochFamily';
  await rejection(await repack(unknown), 'unknown family');
  const forgedHead = JSON.parse(archive) as Archive;
  const control = forgedHead.families.find(f => f.name === 'controls')!.rows[0] as
    { value: { headArtifactId: string } };
  control.value.headArtifactId = 'artifact.forged-head';
  await rejection(await repack(forgedHead), 'forged current head with recomputed digests');
  const staleGeneration = JSON.parse(archive) as Archive;
  const pointer = staleGeneration.families.find(f => f.name === 'currentSlotGenerations')!.rows[0] as
    { status: string };
  pointer.status = 'prepared';
  await rejection(await repack(staleGeneration), 'stale prepared generation with recomputed digests');
  await rejection(' '.repeat(64 * 1024 * 1024 + 1), 'oversized input');

  const totalRows = (JSON.parse(mixedArchive) as Archive).families.reduce((sum, family) => sum + family.count, 0);
  for (const threshold of Array.from({ length: totalRows }, (_, index) => index + 1)) {
    const name = `lineage.g10c.abort.${crypto.randomUUID()}`;
    let count = 0;
    const fault = await openCleanEpochAccountStore({ name, beforeWrite: tx => {
      if (++count === threshold) tx.abort();
    } });
    try {
      let rejected = false;
      try { await fault.restoreArchive(mixedArchive); } catch { rejected = true; }
      check(rejected, `abort ${threshold} rejected`);
      const empty = JSON.parse(await fault.exportArchive()) as Archive;
      check(empty.families.every(family => family.count === 0), `abort ${threshold} rolled back every family`);
    } finally { fault.close(); }
  }
  for (const threshold of Array.from({ length: totalRows }, (_, index) => index + 1)) {
    const name = `lineage.g10c.quota.${crypto.randomUUID()}`;
    let count = 0;
    const fault = await openCleanEpochAccountStore({ name, beforeWrite: () => {
      if (++count === threshold) throw new DOMException('Synthetic quota', 'QuotaExceededError');
    } });
    try {
      let rejected = false;
      try { await fault.restoreArchive(mixedArchive); } catch { rejected = true; }
      check(rejected, `quota ${threshold} rejected`);
      const empty = JSON.parse(await fault.exportArchive()) as Archive;
      check(empty.families.every(family => family.count === 0), `quota ${threshold} rolled back every family`);
    } finally { fault.close(); }
  }
  output.textContent = `PASS ${checks} fresh G10C owner assertions`; // Never print archive contents.
  const download = document.querySelector<HTMLButtonElement>('#download')!;
  download.disabled = false;
  download.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([mixedArchive], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'g10c-synthetic-mixed-backup.json';
    document.body.append(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  });
}
main().catch(error => { output.textContent = `FAIL ${checks}: ${error instanceof Error ? error.message : 'unknown'}`; });
