import { CLEAN_EPOCH_DATABASE_NAME, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#audit')!;
const targetName = new URLSearchParams(location.search).get('account');
if (!targetName) throw new Error('Expected account display name.');

async function main() {
  const owner = await openCleanEpochAccountStore();
  try {
    const account = (await owner.list()).find(row => row.profile.displayName === targetName);
    if (!account) throw new Error('Selected account is absent.');
    const selected = await owner.readSelected(account.accountId);
    const slot = await owner.readSlot(account.accountId, 'slot-1');
    const quick = await owner.readSlot(account.accountId, 'quick-save');
    if (!selected || slot.status !== 'ready') throw new Error('Selected account or ready slot is absent.');
    const snapshot = slot.loaded.snapshot;
    const control = slot.loaded.sessionControl;
    const open = indexedDB.open(CLEAN_EPOCH_DATABASE_NAME);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    const families: Record<string, unknown[]> = {};
    try {
      for (const family of ['witnesses', 'artifacts', 'controls', 'slots', 'descendantPublicationRecoveries']) {
        const request = db.transaction(family).objectStore(family).getAll();
        const rows = await new Promise<Record<string, unknown>[]>((resolve, reject) => {
          request.onsuccess = () => resolve(request.result as Record<string, unknown>[]);
          request.onerror = () => reject(request.error);
        });
        families[family] = rows.filter(row => row.accountId === account.accountId).map(row => {
          const value = row.value as Record<string, unknown> | undefined;
          return { artifactId: row.artifactId, publicationId: row.publicationId,
            sourceArtifactId: row.sourceArtifactId, sourcePublicationId: row.sourcePublicationId,
            campaignId: row.campaignId, slotId: row.slotId, status: row.status,
            ...(family === 'witnesses' && value ? { witness: {
              witnessId: value.witnessId, requestId: value.requestId, posture: value.posture,
              sourceArtifactId: value.sourceArtifactId, firstDurableArtifactId: value.firstDurableArtifactId,
              firstDurablePublicationId: value.firstDurablePublicationId } } : {}) };
        });
      }
    } finally { db.close(); }
    const result = {
      accountId: account.accountId,
      accountRevision: selected.revision,
      accountGeneration: selected.lifecycleGeneration,
      campaignId: snapshot.campaignIdentity?.campaignId,
      continuityId: snapshot.campaignIdentity?.continuityId,
      loadedArtifactId: control.loadedArtifactId,
      loadedPublicationId: control.loadedPublicationId,
      campaignHeadArtifactId: control.campaignHeadArtifactId,
      campaignHeadRevision: control.campaignHeadRevision,
      quickAddress: quick.status === 'ready' ? {
        artifactId: quick.loaded.sessionControl.loadedArtifactId,
        publicationId: quick.loaded.sessionControl.loadedPublicationId,
        headRevision: quick.loaded.sessionControl.loadedHeadRevision } : quick.status,
      forkedFromArtifactId: snapshot.campaignIdentity?.forkedFromArtifactId,
      forkedFromPublicationId: snapshot.campaignIdentity?.forkedFromPublicationId,
      capturedAtTick: snapshot.capturedAtTick,
      wallet: snapshot.playerState.currency,
      currentActivityId: snapshot.sessionState.currentActivity?.id,
      operationIds: snapshot.sessionState.operations.map(item => item.id),
      trackedQuestId: snapshot.sessionState.trackedQuestId,
      completedQuestIds: snapshot.playerState.completedQuestIds,
      pinnedRecordIds: snapshot.sessionState.pinnedRecordIds,
      accountHistory: selected.profile.history,
      questJournal: snapshot.sessionState.questJournal,
      activityRecordIds: snapshot.sessionState.activityRecords.map(item => item.id),
      notificationIds: snapshot.sessionState.notifications.map(item => item.id),
      chronicleIds: snapshot.sessionState.chronicle.map(item => item.id),
      soundingsLedger: snapshot.authorityLedger?.soundingsTurnIn ? {
        requestIds: snapshot.authorityLedger.soundingsTurnIn.requests.map(item => item.requestId),
        resultIds: snapshot.authorityLedger.soundingsTurnIn.results.map(item => item.resultId),
        receiptIds: snapshot.authorityLedger.soundingsTurnIn.consequenceReceipts.map(item => item.receiptId)
      } : null,
      normalDefeatReceipts: snapshot.normalDefeatReceipts,
      familyRows: families
    };
    output.textContent = JSON.stringify(result, null, 2);
  } finally { owner.close(); }
}
main().catch(error => output.textContent = `FAIL ${error instanceof Error ? error.stack : error}`);
