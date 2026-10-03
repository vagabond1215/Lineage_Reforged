import { prepareCharacterAchievementProgress } from '../../../../packages/engines/game-engine/src/achievements.js';
import { createAuthorityId, isTargetCampaignSnapshot, TARGET_SNAPSHOT_FORMAT } from '../../../../packages/engines/game-engine/src/campaign-rules.js';
import { hasPendingNormalDefeat } from '../../../../packages/engines/game-engine/src/normal-defeat.js';
import { verifySoundingsAdmissionProvenance } from '../../../../packages/engines/game-engine/src/soundings-admission-witness.js';
import { serializeSnapshot, deserializeSnapshot } from '../../../../packages/shared/persistence/src/index.js';
import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import { CampaignStoreError, type CampaignStoreFailureCode, type CampaignStorePublication } from './campaignIndexedDbStore.js';
import { type CleanEpochAccountStore, type CleanEpochAccountRecord,
  type CleanEpochTerminalRecovery } from './cleanEpochAccountStore.js';
import { projectRetirementSettlement, retirementSettlementFingerprint,
  RETIREMENT_CONSUMERS } from './cleanEpochTerminalProjection.js';
import { buildSaveMetadata, type CampaignPublicationConsumerPlan,
  type StoredSaveEnvelope } from './saveManager.js';
import type { SaveSlotId } from './state.js';

export type EpochTerminalResult =
  | { status: 'completed'; account: CleanEpochAccountRecord; recovery: CleanEpochTerminalRecovery }
  | { status: 'blocked'; code: CampaignStoreFailureCode | 'invalid_input'; message: string };

function blocked(error: unknown): EpochTerminalResult {
  return { status: 'blocked', code: error instanceof CampaignStoreError ? error.code : 'invalid_input',
    message: error instanceof Error ? error.message : String(error) };
}
function sameAddress(a: { artifactId: string; publicationId: string },
  b: { artifactId: string; publicationId: string }): boolean {
  return a.artifactId === b.artifactId && a.publicationId === b.publicationId;
}

/** Retirement of one retained open head; settlement and recovery belong to IndexedDB. */
export class CleanEpochTerminalAdapter {
  constructor(private readonly owner: CleanEpochAccountStore) {}

  private async complete(recovery: CleanEpochTerminalRecovery): Promise<EpochTerminalResult> {
    await this.owner.completeTerminalSettlement(recovery.accountId, recovery.campaignId,
      recovery.publicationId);
    const [account, readback, slot] = await Promise.all([
      this.owner.readSelected(recovery.accountId),
      this.owner.readTerminalRecovery(recovery.accountId, recovery.campaignId, recovery.publicationId),
      this.owner.readSlot(recovery.accountId, recovery.slotId)
    ]);
    if (!account || !readback || readback.status !== 'settlement_completed' ||
        (!readback.addressClosure && slot.status !== 'closed') ||
        readback.artifactId !== recovery.artifactId)
      throw new CampaignStoreError('readback_failed', 'Retirement did not read back as one settled closed head.');
    return { status: 'completed', account, recovery: readback };
  }

  async resumePending(accountId: string): Promise<EpochTerminalResult | null> {
    try {
      const pending = await this.owner.readPendingTerminalForAccount(accountId);
      return pending ? await this.complete(pending) : null;
    } catch (error) { return blocked(error); }
  }

  async retire(input: { accountId: string; sourceSlotId: SaveSlotId;
    expectedAccountRevision: number; snapshot: SaveSnapshot; control: CampaignSessionControl;
    expectedSourceAddress: { artifactId: string; publicationId: string } }): Promise<EpochTerminalResult> {
    try {
      const { accountId, sourceSlotId, snapshot, control, expectedAccountRevision,
        expectedSourceAddress } = input;
      if (!isTargetCampaignSnapshot(snapshot) || !snapshot.campaignIdentity ||
          snapshot.accountId !== accountId || hasPendingNormalDefeat(snapshot) ||
          control.accountId !== accountId || control.campaignId !== snapshot.campaignIdentity.campaignId ||
          !sameAddress(expectedSourceAddress, { artifactId: control.loadedArtifactId,
            publicationId: control.loadedPublicationId }))
        throw new CampaignStoreError('invalid_record', 'Retirement requires one exact retained open source.');
      const existing = await this.owner.readTerminalForSource(accountId, control.campaignId,
        control.loadedPublicationId);
      if (existing) {
        const prepared = prepareCharacterAchievementProgress(snapshot, existing.createdAt).snapshot;
        const terminal = deserializeSnapshot(
          (JSON.parse(existing.envelopeRaw) as StoredSaveEnvelope).snapshot);
        if (existing.slotId !== sourceSlotId || existing.expectedAccountRevision !== expectedAccountRevision ||
            existing.sourceArtifactId !== control.loadedArtifactId ||
            !sameAddress(existing.sourceAddress, expectedSourceAddress) ||
            JSON.stringify(terminal) !== JSON.stringify(prepared))
          throw new CampaignStoreError('conflict', 'Retirement retry differs from accepted terminal source.');
        return await this.complete(existing);
      }
      const account = await this.owner.readSelected(accountId);
      if (!account || account.revision !== expectedAccountRevision)
        throw new CampaignStoreError('stale_head', 'Retirement account revision changed.');
      const source = await this.owner.readSlot(accountId, sourceSlotId);
      if (source.status !== 'ready')
        throw new CampaignStoreError('conflict', `Retirement source is ${source.status}.`);
      const retained = source.loaded.sessionControl;
      if (!sameAddress(expectedSourceAddress, { artifactId: retained.loadedArtifactId,
          publicationId: retained.loadedPublicationId }) ||
          retained.campaignHeadArtifactId !== control.campaignHeadArtifactId ||
          retained.campaignHeadRevision !== control.campaignHeadRevision ||
          retained.loadedArtifactId !== retained.campaignHeadArtifactId ||
          control.loadedArtifactId !== control.campaignHeadArtifactId ||
          control.campaignHeadArtifactId !== retained.loadedArtifactId)
        throw new CampaignStoreError('stale_head', 'Retirement requires the current addressed campaign head.');
      const head = await this.owner.readCampaignHead(accountId, control.campaignId, sourceSlotId);
      if (head.artifactId !== control.campaignHeadArtifactId ||
          head.publicationId !== control.loadedPublicationId ||
          head.revision !== control.campaignHeadRevision)
        throw new CampaignStoreError('stale_head', 'Retirement head changed before publication.');
      const addressSlotIds: SaveSlotId[] = [];
      for (const summary of await this.owner.listSlots(accountId)) {
        if (summary.status !== 'ready') continue;
        const addressed = await this.owner.readSlot(accountId, summary.slotId);
        if (addressed.status === 'ready' &&
            addressed.loaded.sessionControl.campaignId === control.campaignId)
          addressSlotIds.push(summary.slotId);
      }
      addressSlotIds.sort();
      const savedAt = new Date().toISOString();
      const prepared = prepareCharacterAchievementProgress(snapshot, savedAt).snapshot;
      const provenance = verifySoundingsAdmissionProvenance(prepared, control);
      if (provenance !== 'not_completed' && provenance !== 'verified')
        throw new CampaignStoreError('invalid_record', `Retirement Soundings provenance is ${provenance}.`);
      const firstCompletion = prepared.authorityLedger?.soundingsTurnIn?.version === 2 &&
        source.loaded.snapshot.authorityLedger?.soundingsTurnIn?.version !== 2;
      const sessionWitness = control.soundingsAdmissionWitness?.posture === 'session'
        ? control.soundingsAdmissionWitness : undefined;
      if (firstCompletion && (!sessionWitness || provenance !== 'verified'))
        throw new CampaignStoreError('invalid_record', 'Retirement first Soundings completion lacks session witness.');
      if (!firstCompletion && sessionWitness)
        throw new CampaignStoreError('invalid_record', 'Retirement cannot introduce a second Soundings witness.');
      const artifactId = createAuthorityId('artifact');
      const generationId = createAuthorityId('generation');
      const publicationId = createAuthorityId('publication');
      const metadata = { ...buildSaveMetadata(sourceSlotId, prepared), lastSavedAt: savedAt,
        snapshotVersion: TARGET_SNAPSHOT_FORMAT };
      const envelope: StoredSaveEnvelope = { version: 7, accountId, slotId: sourceSlotId,
        savedAt, metadata, snapshotFormatId: TARGET_SNAPSHOT_FORMAT,
        campaignId: control.campaignId, continuityId: prepared.campaignIdentity!.continuityId,
        characterId: prepared.playerState.playerId, artifactId, generationId, publicationId,
        headRevision: head.revision + 1, terminal: true, snapshot: serializeSnapshot(prepared) };
      const publicationForProjection = { publicationId, campaignId: control.campaignId,
        continuityId: prepared.campaignIdentity!.continuityId,
        characterId: prepared.playerState.playerId, publishedAt: savedAt };
      const preliminaryPlans: CampaignPublicationConsumerPlan[] = RETIREMENT_CONSUMERS.map(kind =>
        ({ kind, payloadFingerprint: 'retirement.preview' }));
      const preliminary = projectRetirementSettlement({ profile: account.profile, snapshot: prepared,
        publication: publicationForProjection, slotId: sourceSlotId, addressSlotIds,
        consumerPlans: preliminaryPlans });
      const fingerprint = retirementSettlementFingerprint({ accountId, campaignId: control.campaignId,
        sourceArtifactId: control.loadedArtifactId,
        sourcePublicationId: control.loadedPublicationId,
        terminalArtifactId: artifactId, terminalPublicationId: publicationId,
        sourceSlotId, addressSlotIds, payout: preliminary.payout,
        payoutTransactionId: preliminary.payoutTransactionId,
        estateSourceRunId: preliminary.estateSourceRunId,
        estateDepositId: preliminary.estateDepositId });
      const consumerPlans: CampaignPublicationConsumerPlan[] = RETIREMENT_CONSUMERS.map(kind =>
        ({ kind, payloadFingerprint: fingerprint }));
      const publication: CampaignStorePublication = { accountId, campaignId: control.campaignId,
        slotId: sourceSlotId, expectedHead: head, expectedSlotAddress: expectedSourceAddress,
        artifactRaw: JSON.stringify(envelope), control: { version: 1, accountId,
          campaignId: control.campaignId, headArtifactId: artifactId,
          headPublicationId: publicationId, headRevision: envelope.headRevision,
          previousHeadArtifactId: head.artifactId, previousHeadPublicationId: head.publicationId,
          closed: true, updatedAt: savedAt } };
      const recovery = await this.owner.publishTerminal({ publication,
        ...(sessionWitness ? { sessionWitness } : {}), expectedAccountRevision,
        sourceArtifactId: control.loadedArtifactId,
        sourcePublicationId: control.loadedPublicationId,
        sourceSnapshotRaw: serializeSnapshot(source.loaded.snapshot),
        sourceAddress: expectedSourceAddress, addressSlotIds, consumerPlans });
      return await this.complete(recovery);
    } catch (error) { return blocked(error); }
  }
}
