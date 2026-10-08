import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, accountLifecycleGeneration } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, startingBundleOptions, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from '../../packages/engines/game-engine/src/player-quest-acceptance.ts';
import { createPlayerTravelCommand, executePlayerTravelCommand } from '../../packages/engines/game-engine/src/player-travel.ts';
import { preparePlayerSurveyActivityAdvancementCommand, executePlayerSurveyActivityAdvancementCommand } from '../../packages/engines/game-engine/src/player-survey-activity-advancement.ts';
import { preparePlayerSoundingsTurnInCommand, executePlayerSoundingsTurnInCommand } from '../../packages/engines/game-engine/src/player-soundings-turn-in.ts';
import { admitCampaignMutation, type CampaignSessionControl } from '../../packages/engines/game-engine/src/campaign-session.ts';
import { verifySoundingsAdmissionProvenance } from '../../packages/engines/game-engine/src/soundings-admission-witness.ts';
import type { SaveSnapshot } from '../../packages/shared/types/src/index.ts';

const report = document.querySelector<HTMLPreElement>('#audit')!;
let assertions = 0;
const steps: string[] = [];
function check(truth: unknown, message: string): asserts truth { assertions++; if (!truth) throw Error(message); }
function step(text: string) { steps.push(text); report.textContent = `RUNNING ${text} (${assertions})`; }
const databaseName = `lineage.g9.completion.witness.${crypto.randomUUID()}`;
const password = 'synthetic-witness-audit-password';
const dataFamilies = ['newCampaignAttempts', 'pendingPublicationRecoveries',
  'descendantPublicationRecoveries', 'terminalLifecycleRecoveries', 'campaignAttemptsV6',
  'firstPublicationRecoveriesV6', 'currentSlotGenerations', 'addressDeletionReceipts',
  'artifacts', 'controls', 'slots', 'witnesses'];
async function databaseRows(name: string, accountId: string) {
  const opening = indexedDB.open(databaseName);
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    opening.onsuccess = () => resolve(opening.result);
    opening.onerror = () => reject(opening.error);
  });
  try {
    const transaction = database.transaction(name, 'readonly');
    const request = transaction.objectStore(name).getAll();
    const all = await new Promise<Record<string, unknown>[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Record<string, unknown>[]);
      request.onerror = () => reject(request.error);
    });
    return all.filter(row => row.accountId === accountId);
  } finally { database.close(); }
}
async function accountBytes(accountId: string) {
  return JSON.stringify(await Promise.all(['accounts', 'accountLifecycle', ...dataFamilies]
    .map(async name => [name, await databaseRows(name, accountId)])));
}
async function mutateWitness(key: IDBValidKey, operation: 'delete' | 'put', value?: unknown) {
  const opening = indexedDB.open(databaseName);
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    opening.onsuccess = () => resolve(opening.result);
    opening.onerror = () => reject(opening.error);
  });
  try {
    const transaction = database.transaction('witnesses', 'readwrite');
    const request = operation === 'delete' ? transaction.objectStore('witnesses').delete(key) :
      transaction.objectStore('witnesses').put(value);
    await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally { database.close(); }
}
async function retainLegacyMirror(name: string, value: unknown) {
  const opening = indexedDB.open(databaseName);
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    opening.onsuccess = () => resolve(opening.result);
    opening.onerror = () => reject(opening.error);
  });
  try {
    const transaction = database.transaction(name, 'readwrite');
    const request = transaction.objectStore(name).put(value);
    await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally { database.close(); }
}
function starfallForm(slotId: 'slot-1' | 'slot-2' = 'slot-1') {
  const defaults = createDefaultCharacterCreationFormState(slotId);
  const identity = getLineageIdentityCatalog(defaults.lineageId)!;
  const bundle = startingBundleOptions[0]!;
  const settlement = getWorldContinentOptions().flatMap(continent =>
    getWorldRegionOptions(continent.id).flatMap(region =>
      getWorldSettlementOptions({ continentId: continent.id, regionId: region.id, backstoryId: '' })
    )).find(item => item.id === 'settlement.starfall_port');
  check(settlement, 'authored Starfall Port settlement missing');
  return { ...defaults, playerName: 'Independent Witness',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle.id,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle.id),
    backstoryId: 'backstory.craftsmans_child',
    continentId: settlement.continentId, regionId: settlement.regionId,
    startingSettlementId: settlement.id };
}
async function main() {
  const owner = await openCleanEpochAccountStore({ name: databaseName });
  try {
    const otherId = `account.local.g9.completion.other.${crypto.randomUUID()}`;
    const other = await new CleanEpochAccountAdapter(owner).register({ accountId: otherId,
      displayName: 'Synthetic other account', password, confirmPassword: password, stayLoggedIn: false });
    check(other.status === 'ready', 'other account setup');
    const otherBytes = await accountBytes(otherId);
    for (const scenario of ['coherent-reset', 'coherent-delete', 'missing-reset', 'missing-delete',
      'malformed-reset', 'malformed-delete', 'cross-bound-reset', 'cross-bound-delete'] as const) {
    const accountId = `account.local.g9.completion.${crypto.randomUUID()}`;
    step('create production Starfall campaign');
    const registered = await new CleanEpochAccountAdapter(owner).register({ accountId,
      displayName: 'Synthetic witness account', password, confirmPassword: password, stayLoggedIn: false });
    check(registered.status === 'ready', `register ${JSON.stringify(registered)}`);
    const created = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, starfallForm(), false);
    check(created.status === 'ready', `first ${JSON.stringify(created)}`);
    let snapshot: SaveSnapshot = created.value.loaded.snapshot;
    let control: CampaignSessionControl = created.value.loaded.sessionControl;
    check(snapshot.sessionState.questJournal.some(q => q.id === 'quest.ashen_reef_survey'), 'authored survey offer not staged');
    const admit = (candidate: SaveSnapshot, id: string) => {
      const result = admitCampaignMutation(control, { mutationId: id,
        sourceArtifactId: control.loadedArtifactId, sourceRevision: control.sessionRevision,
        ownerKind: 'engine_result', accepted: true, sourceSnapshot: snapshot,
        proposedSnapshot: candidate });
      check(result.accepted, `campaign admission ${id}: ${result.reason}`);
      snapshot = result.snapshot; control = result.control;
    };
    step('accept and track authored quest');
    const accepted = executePlayerQuestAcceptanceCommand(snapshot,
      createPlayerQuestAcceptanceCommand(snapshot, 'quest.ashen_reef_survey'));
    check(accepted.accepted, `quest acceptance ${accepted.code}`);
    admit(accepted.snapshot, `qa.quest.${crypto.randomUUID()}`);
    check(snapshot.sessionState.trackedQuestId === 'quest.ashen_reef_survey' &&
      snapshot.sessionState.questJournal.find(q => q.id === 'quest.ashen_reef_survey')?.tracked === true,
      'accepted quest was not tracked');
    step('travel to authored reef and complete four survey shifts');
    const outbound = executePlayerTravelCommand(snapshot, createPlayerTravelCommand(snapshot, 'location.ashen_reef'));
    check(outbound.accepted, `reef travel ${outbound.code}`);
    admit(outbound.snapshot, `qa.travel.${crypto.randomUUID()}`);
    for (let index = 0; index < 4; index++) {
      const request = `survey_request.${crypto.randomUUID()}`;
      const prepared = preparePlayerSurveyActivityAdvancementCommand(snapshot, control, request);
      check(prepared.kind === 'prepared', `survey ${index} prepare ${JSON.stringify(prepared)}`);
      const advanced = executePlayerSurveyActivityAdvancementCommand(snapshot, control, prepared.command);
      check(advanced.accepted, `survey ${index} advance ${advanced.code}`);
      snapshot = advanced.snapshot; control = advanced.control;
    }
    step('return and submit through production session witness mint');
    const inbound = executePlayerTravelCommand(snapshot, createPlayerTravelCommand(snapshot, 'settlement.starfall_port'));
    check(inbound.accepted, `port travel ${inbound.code}`);
    admit(inbound.snapshot, `qa.return.${crypto.randomUUID()}`);
    const prepared = preparePlayerSoundingsTurnInCommand(snapshot, control, `soundings_turn_in_request.${crypto.randomUUID()}`);
    check(prepared.kind === 'prepared', `Soundings prepare ${JSON.stringify(prepared)}`);
    const submitted = executePlayerSoundingsTurnInCommand(snapshot, control, prepared.command);
    check(submitted.accepted, `Soundings turn-in ${submitted.code}`);
    snapshot = submitted.snapshot; control = submitted.control;
    check(control.soundingsAdmissionWitness?.posture === 'session', 'production session witness missing');
    check(verifySoundingsAdmissionProvenance(snapshot, control) === 'verified', 'production session witness invalid');
    const current = (await owner.read(accountId))!;
    const published = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
      expectedDestinationAddress: { artifactId: created.value.loaded.sessionControl.loadedArtifactId,
        publicationId: created.value.loaded.sessionControl.loadedPublicationId },
      expectedAccountRevision: current.revision, snapshot, control });
    check(published.status === 'ready', `witness publication ${JSON.stringify(published)}`);
    check(verifySoundingsAdmissionProvenance(published.value.loaded.snapshot,
      published.value.loaded.sessionControl) === 'verified', 'durable witnessed readback invalid');
    step(`witnessed graph ${scenario} lifecycle test`);
    const latest = (await owner.read(accountId))!;
    check(accountLifecycleGeneration(latest) === 1, 'witness account generation changed');
    const witnessRows = await databaseRows('witnesses', accountId);
    check(witnessRows.length === 1, `expected exactly one durable witness for ${scenario}`);
    const witness = witnessRows[0]!;
    const witnessKey = [accountId, control.campaignId,
      snapshot.authorityLedger!.soundingsTurnIn!.requests[0]!.requestId];
    if (scenario.startsWith('missing')) await mutateWitness(witnessKey, 'delete');
    if (scenario.startsWith('malformed')) await mutateWitness(witnessKey, 'put', {
      ...witness, value: { ...(witness.value as Record<string, unknown>), requestId: 'malformed' } });
    if (scenario.startsWith('cross-bound')) await mutateWitness(witnessKey, 'put', {
      ...witness, value: { ...(witness.value as Record<string, unknown>), accountId: otherId } });
    const kind = scenario.endsWith('reset') ? 'reset' : 'delete';
    const request = { accountId, expectedRevision: latest.revision,
      expectedGeneration: accountLifecycleGeneration(latest), currentPassword: password,
      ...(kind === 'delete' ? { requestId: crypto.randomUUID() } : {}) };
    if (scenario.startsWith('coherent')) {
      step(`populate all 12 families for ${scenario}`);
      const beforeAddress = (await owner.read(accountId))!;
      const secondAddress = await new CleanEpochDescendantAdapter(owner).save({ accountId,
        sourceSlotId: 'slot-1', destinationSlotId: 'quick-save', expectedDestinationAddress: null,
        expectedAccountRevision: beforeAddress.revision,
        snapshot: published.value.loaded.snapshot, control: published.value.loaded.sessionControl });
      check(secondAddress.status === 'ready', 'second witnessed address failed');
      const retainedWitness = JSON.stringify(await databaseRows('witnesses', accountId));
      const retainedFirstArtifacts = JSON.stringify((await databaseRows('artifacts', accountId))
        .filter(row => row.campaignId === control.campaignId));
      const pointer = (await owner.readSlotGeneration(accountId, 'slot-1'))!;
      const priorDelete = (await owner.read(accountId))!;
      const deleteRequest = { accountId, slotId: 'slot-1' as const,
        expectedAccountRevision: priorDelete.revision,
        expectedSlotGenerationId: pointer.slotGenerationId,
        expectedAddress: { artifactId: published.value.loaded.sessionControl.loadedArtifactId,
          publicationId: published.value.loaded.sessionControl.loadedPublicationId },
        deletedAt: new Date().toISOString() };
      const staleBytes = await accountBytes(accountId);
      const contender = await openCleanEpochAccountStore({ name: databaseName });
      for (const changed of [
        { ...deleteRequest, expectedAccountRevision: deleteRequest.expectedAccountRevision - 1 },
        { ...deleteRequest, expectedSlotGenerationId: 'slot_generation.stale' },
        { ...deleteRequest, expectedAddress: { artifactId: 'artifact.stale',
          publicationId: 'publication.stale' } }
      ]) {
        let blocked = false;
        try { await contender.deleteSlotAddress(changed); } catch { blocked = true; }
        check(blocked && await accountBytes(accountId) === staleBytes,
          'stale two-owner address deletion changed witnessed graph');
      }
      const deleted = await owner.deleteSlotAddress(deleteRequest);
      check(deleted.status === 'committed' && (await owner.readSlot(accountId, 'quick-save')).status === 'ready',
        'one witnessed address deletion erased surviving quick address');
      const exactOld = await contender.deleteSlotAddress(deleteRequest);
      check(exactOld.status === 'same_source_retry', 'second owner exact deletion receipt changed');
      contender.close();
      check(JSON.stringify(await databaseRows('witnesses', accountId)) === retainedWitness &&
        JSON.stringify((await databaseRows('artifacts', accountId))
          .filter(row => row.campaignId === control.campaignId)) === retainedFirstArtifacts,
        'G9E address deletion changed immutable witness/artifact');
      check((await owner.read(accountId))!.profile.history.runRecords.some(run =>
        run.characterId === snapshot.playerState.playerId &&
        run.saveSlotIds.includes('quick-save') && !run.saveSlotIds.includes('slot-1')),
        'G9E address deletion did not update exact run membership');
      const terminalFirst = await new CleanEpochFirstCampaignAdapter(owner).start(accountId,
        starfallForm('slot-2'), false);
      check(terminalFirst.status === 'ready', 'second authored campaign failed');
      const terminalSource = (await owner.read(accountId))!;
      const terminalControl = terminalFirst.value.loaded.sessionControl;
      const terminal = await new CleanEpochTerminalAdapter(owner).retire({ accountId,
        sourceSlotId: 'slot-2', expectedAccountRevision: terminalSource.revision,
        snapshot: terminalFirst.value.loaded.snapshot, control: terminalControl,
        expectedSourceAddress: { artifactId: terminalControl.loadedArtifactId,
          publicationId: terminalControl.loadedPublicationId } });
      check(terminal.status === 'completed', `terminal graph ${JSON.stringify(terminal)}`);
      const closure = await owner.closeTerminalAddresses(accountId, terminal.recovery.campaignId,
        terminal.recovery.publicationId, terminal.account.revision, new Date().toISOString());
      check(closure.status === 'committed', 'terminal deletion receipt missing');
      const firstCampaignId = control.campaignId;
      const attempt = (await databaseRows('campaignAttemptsV6', accountId))
        .find(row => row.campaignId === firstCampaignId);
      const recovery = (await databaseRows('firstPublicationRecoveriesV6', accountId))
        .find(row => row.campaignId === firstCampaignId);
      check(!!attempt && !!recovery, 'current first authority missing for retained legacy mirror');
      await retainLegacyMirror('newCampaignAttempts', attempt);
      await retainLegacyMirror('pendingPublicationRecoveries', recovery);
      const rowCounts = await Promise.all(dataFamilies.map(async name =>
        (await databaseRows(name, accountId)).length));
      check(rowCounts.every(count => count > 0), `all 12 families not populated: ${rowCounts}`);
      const currentAccount = (await owner.read(accountId))!;
      const completeRequest = { ...request, expectedRevision: currentAccount.revision };
      const fullBefore = await accountBytes(accountId);
      const expectedWrites = rowCounts.reduce((sum, count) => sum + count, 0) + 2;
      for (const fault of ['abort', 'quota'] as const)
        for (let position = 1; position <= expectedWrites; position++) {
          let writes = 0;
          const faultOwner = await openCleanEpochAccountStore({ name: databaseName,
            beforeWrite: tx => {
              if (++writes !== position) return;
              if (fault === 'abort') tx.abort();
              else throw new DOMException('Synthetic quota', 'QuotaExceededError');
            } });
          let blocked = false;
          try { await faultOwner.transitionAccount(kind, completeRequest); }
          catch { blocked = true; }
          check(blocked && writes === position &&
            await accountBytes(accountId) === fullBefore,
            `${scenario} ${fault} write ${position}/${expectedWrites} partially erased graph`);
          faultOwner.close();
        }
      steps.push(`${scenario}: ${expectedWrites} fully populated writes under abort and quota`);
      const committed = await owner.transitionAccount(kind, completeRequest);
      check(committed.status === 'committed', `${scenario} did not commit`);
      for (const name of dataFamilies)
        check((await databaseRows(name, accountId)).length === 0,
          `${scenario} retained ${name}`);
    } else {
      const before = await accountBytes(accountId);
      let writes = 0;
      const rejecting = await openCleanEpochAccountStore({ name: databaseName,
        beforeWrite: () => { writes++; } });
      let rejected = false;
      try { await rejecting.transitionAccount(kind, request); }
      catch { rejected = true; }
      check(rejected, `${scenario} corrupt witness was accepted`);
      check(writes === 0 && await accountBytes(accountId) === before,
        `${scenario} must reject before mutation`);
      rejecting.close();
    }
    check(await accountBytes(otherId) === otherBytes, `${scenario} changed other account`);
    }
    report.textContent = `PASS ${assertions} independent assertions\n${steps.join('\n')}`;
  } finally { owner.close(); }
}
main().catch(error => { report.textContent = `FAIL ${assertions} after ${steps.at(-1)}: ${error instanceof Error ? error.stack : String(error)}`; });
