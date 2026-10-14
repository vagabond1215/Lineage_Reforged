import { CLEAN_EPOCH_DATABASE_NAME, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { preparePlayerSoundingsTurnInCommand, executePlayerSoundingsTurnInCommand } from '../../packages/engines/game-engine/src/player-soundings-turn-in.ts';
import { soundingsIds } from '../../packages/engines/game-engine/src/soundings-turn-in-authority.ts';
import { serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const stores = ['accounts', 'newCampaignAttempts', 'pendingPublicationRecoveries', 'descendantPublicationRecoveries',
  'terminalLifecycleRecoveries', 'campaignAttemptsV6', 'firstPublicationRecoveriesV6',
  'currentSlotGenerations', 'addressDeletionReceipts', 'artifacts', 'controls', 'slots', 'witnesses'];
async function familyRows(name: string, accountId: string) {
  const request = indexedDB.open(CLEAN_EPOCH_DATABASE_NAME);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
  try {
    const result: Record<string, Array<Record<string, unknown>>> = {};
    for (const store of stores) {
      const req = db.transaction(store).objectStore(store).getAll();
      result[store] = (await new Promise<Array<Record<string, unknown>>>((resolve, reject) => {
        req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
      })).filter(row => row.accountId === accountId);
    }
    return result;
  } finally { db.close(); }
}
async function main() {
  const owner = await openCleanEpochAccountStore();
  try {
    const accounts = await owner.list();
    const records = [];
    for (const account of accounts) {
      const rows = await familyRows(CLEAN_EPOCH_DATABASE_NAME, account.accountId);
      const historicalReads = [];
      for (const row of rows.artifacts) {
        const historical = await owner.readHistoricalArtifact(account.accountId,
          row.slotId as 'slot-1' | 'slot-2' | 'quick-save', row.artifactId as string);
        const envelope = JSON.parse(row.raw as string) as { snapshot: string };
        historicalReads.push({ artifactId: row.artifactId, slotId: row.slotId,
          publicationId: historical.sessionControl.loadedPublicationId,
          exact: historical.sessionControl.loadedArtifactId === row.artifactId &&
            serializeSnapshot(historical.snapshot) === envelope.snapshot });
      }
      const slots = [];
      for (const slotId of ['slot-1', 'slot-2', 'quick-save']) {
        const slot = await owner.readSlot(account.accountId, slotId);
        if (slot.status !== 'ready') { slots.push({ slotId, status: slot.status }); continue; }
        const snapshot = slot.loaded.snapshot;
        const control = slot.loaded.sessionControl;
        const soundings = snapshot.authorityLedger?.soundingsTurnIn;
        const encounter = snapshot.authorityLedger?.nearbyEncounters;
        const retainedRequest = soundings?.requests[0]?.requestId;
        const duplicatePreparation = retainedRequest ? preparePlayerSoundingsTurnInCommand(snapshot, control, retainedRequest) : null;
        const duplicateResult = duplicatePreparation?.kind === 'prepared'
          ? executePlayerSoundingsTurnInCommand(snapshot, control, duplicatePreparation.command) : null;
        const repairSource = duplicatePreparation?.kind === 'prepared' ? structuredClone(snapshot) : null;
        if (repairSource && retainedRequest) repairSource.sessionState.chronicle =
          repairSource.sessionState.chronicle.filter(row => row.id !== soundingsIds(retainedRequest).chronicleId);
        const repairResult = repairSource && duplicatePreparation?.kind === 'prepared'
          ? executePlayerSoundingsTurnInCommand(repairSource, control, duplicatePreparation.command) : null;
        slots.push({ slotId, status: slot.status, artifactId: control.loadedArtifactId,
          publicationId: control.loadedPublicationId, headRevision: control.campaignHeadRevision,
          campaignIdentity: snapshot.campaignIdentity,
          tick: snapshot.capturedAtTick, location: snapshot.playerState.location,
          hp: snapshot.playerState.resources.hp, wallet: snapshot.playerState.currency,
          questJournal: snapshot.sessionState.questJournal,
          chronicleCount: snapshot.sessionState.chronicle.length,
          notificationCount: snapshot.sessionState.notifications.length,
          defeatReceipts: snapshot.normalDefeatReceipts,
          combatHistoryCount: snapshot.gameState.combatHistory.length,
          encounterAdmissions: encounter?.admissions.map(row => ({ requestId: row.requestId,
            encounterId: row.encounterId, sourceArtifactId: row.sourceArtifactId,
            sourceRevision: row.sourceRevision, selectedAtTick: row.candidate.selectedAtTick,
            candidateId: row.candidate.id })),
          encounterCommandCount: encounter?.commands.length,
          soundingsRequests: soundings?.requests.map(row => row.requestId),
          soundingsResults: soundings?.results.map(row => row.requestId),
          soundingsConsequences: soundings?.consequenceReceipts.map(row => row.kind),
          soundingsDuplicate: duplicateResult ? { duplicate: duplicateResult.duplicate,
            accepted: duplicateResult.accepted, code: duplicateResult.code,
            exactSnapshot: serializeSnapshot(duplicateResult.snapshot) === serializeSnapshot(snapshot),
            gold: duplicateResult.snapshot.playerState.currency.gold } : null,
          soundingsRepair: repairResult ? { duplicate: repairResult.duplicate,
            accepted: repairResult.accepted, code: repairResult.code,
            gold: repairResult.snapshot.playerState.currency.gold,
            tick: repairResult.snapshot.capturedAtTick,
            chronicleCount: repairResult.snapshot.sessionState.chronicle.length } : null,
          snapshotBytes: 2 * JSON.stringify(snapshot).length });
      }
      records.push({ accountId: account.accountId, displayName: account.profile.displayName,
        revision: account.revision, generation: account.lifecycleGeneration,
        rowCounts: Object.fromEntries(Object.entries(rows).map(([key, value]) => [key, value.length])),
        graphBytes: 2 * JSON.stringify(rows).length,
        artifactIds: rows.artifacts.map(row => row.artifactId),
        historicalReads,
        witnesses: rows.witnesses.map(row => ({ requestId: row.requestId, value: row.value })),
        descendants: rows.descendantPublicationRecoveries.map(row => ({ status: row.status,
          slotId: row.slotId, sourceSlotId: row.sourceSlotId, sourceArtifactId: row.sourceArtifactId,
          sourcePublicationId: row.sourcePublicationId, artifactId: row.artifactId,
          publicationId: row.publicationId, headRevision: row.headRevision,
          expectedHead: row.expectedHead, witnessRequestId: row.witnessRequestId })), slots });
    }
    output.textContent = JSON.stringify({ database: CLEAN_EPOCH_DATABASE_NAME,
      storage: await navigator.storage.estimate(), records }, null, 2);
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL ${error instanceof Error ? error.stack : error}`);
