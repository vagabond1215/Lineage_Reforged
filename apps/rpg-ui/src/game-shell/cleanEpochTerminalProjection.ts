import type { AccountProfileState, AccountRunHistoryRecord, CampaignPublicationConsumerKind, SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import { archiveRunRecord, evaluateAchievementProgress } from '../../../../packages/engines/game-engine/src/achievements.js';
import { recordCampaignPublicationConsumer, type VerifiedCampaignPublication } from '../../../../packages/engines/game-engine/src/account-publication.js';
import { depositEstateFromArchivedSnapshot, resolveAccountRunHistorySourceId } from '../../../../packages/engines/game-engine/src/account-estate.js';
import { grantLegacyReward } from '../../../../packages/engines/game-engine/src/legacy-account.js';
import { resolveRunLegacyPayout, type RunLegacyPayoutResolution } from '../../../../packages/engines/game-engine/src/run-legacy-payout.js';
import { resolveArchivedRunRuntimeSummary } from './runLifecycle.js';
import type { CampaignPublicationConsumerPlan } from './saveManager.js';
import type { SaveSlotId } from './state.js';

export const RETIREMENT_CONSUMERS: CampaignPublicationConsumerKind[] = [
  'active_history', 'account_achievements', 'legacy_rewards', 'last_played',
  'retirement_settlement', 'estate'
];

export type RetirementProjection = {
  profile: AccountProfileState;
  payout: RunLegacyPayoutResolution;
  payoutTransactionId: string | null;
  estateSourceRunId: string;
  estateDepositId: string;
};

export function retirementSettlementFingerprint(params: {
  accountId: string; campaignId: string; sourceArtifactId: string; sourcePublicationId: string;
  terminalArtifactId: string; terminalPublicationId: string;
  sourceSlotId: SaveSlotId; addressSlotIds: SaveSlotId[];
  payout: RunLegacyPayoutResolution; payoutTransactionId: string | null;
  estateSourceRunId: string; estateDepositId: string;
}): string {
  return JSON.stringify({ archiveReason: 'retired', accountId: params.accountId,
    campaignId: params.campaignId, sourceArtifactId: params.sourceArtifactId,
    sourcePublicationId: params.sourcePublicationId, terminalArtifactId: params.terminalArtifactId,
    terminalPublicationId: params.terminalPublicationId, sourceSlotId: params.sourceSlotId,
    addressSlotIds: [...params.addressSlotIds].sort(), payout: params.payout,
    payoutTransactionId: params.payoutTransactionId,
    estateSourceRunId: params.estateSourceRunId, estateDepositId: params.estateDepositId });
}

/** Calculations only. The epoch owner supplies retained addresses and commits the result. */
export function projectRetirementSettlement(params: {
  profile: AccountProfileState;
  snapshot: SaveSnapshot;
  publication: VerifiedCampaignPublication;
  slotId: SaveSlotId;
  addressSlotIds: SaveSlotId[];
  consumerPlans: CampaignPublicationConsumerPlan[];
}): RetirementProjection {
  const { profile, snapshot, publication, slotId, addressSlotIds, consumerPlans } = params;
  const characterId = snapshot.playerState.playerId;
  if (snapshot.campaignIdentity?.campaignId !== publication.campaignId ||
      snapshot.campaignIdentity.continuityId !== publication.continuityId ||
      characterId !== publication.characterId ||
      new Set(addressSlotIds).size !== addressSlotIds.length || !addressSlotIds.includes(slotId) ||
      consumerPlans.length !== RETIREMENT_CONSUMERS.length ||
      !RETIREMENT_CONSUMERS.every(kind => consumerPlans.some(plan => plan.kind === kind)) ||
      (profile.campaignPublicationReceipts ?? []).some(receipt => receipt.publicationId === publication.publicationId))
    throw new Error('Retirement projection identity or consumer plan is invalid.');
  const prior = profile.history.runRecords.filter(record => record.characterId === characterId);
  const retainedAddressSlotIds = prior.length === 1 ? [...prior[0]!.saveSlotIds].sort() : [];
  const terminalAddressSlotIds = [...addressSlotIds].sort();
  if (prior.length !== 1 || prior[0]!.outcome !== 'active' ||
      retainedAddressSlotIds.length !== terminalAddressSlotIds.length ||
      retainedAddressSlotIds.some((id, index) => id !== terminalAddressSlotIds[index]))
    throw new Error('Retirement requires one active retained run and exact address membership.');
  const recordedAt = publication.publishedAt;
  const evaluated = evaluateAchievementProgress(snapshot, profile,
    { slotId, touchHistory: true, recordedAt });
  if (JSON.stringify(evaluated.nextSnapshot) !== JSON.stringify(snapshot))
    throw new Error('Retirement account projection changes the terminal artifact.');
  let next = evaluated.nextAccountProfile;
  const evaluatedRecord = next.history.runRecords.find(record => record.characterId === characterId);
  if (!evaluatedRecord) throw new Error('Retirement history projection lost the active run.');
  const runtime = resolveArchivedRunRuntimeSummary(snapshot);
  const payoutRecord: AccountRunHistoryRecord = { ...evaluatedRecord, outcome: 'archived',
    archiveReason: 'retired', endedAt: recordedAt, lastSeenAt: recordedAt,
    totalPlayTicks: runtime.totalPlayTicks, survivedDays: runtime.survivedDays,
    saveSlotIds: addressSlotIds };
  const payout = resolveRunLegacyPayout(payoutRecord, next);
  let payoutTransactionId: string | null = null;
  if (payout.legacyGranted > 0) {
    const granted = grantLegacyReward(next, { legacyPoints: payout.legacyGranted,
      summary: payout.summary, sourceType: payout.sourceType, sourceId: payout.sourceId, recordedAt });
    if (!granted.ok) throw new Error('Retirement Legacy payout could not be recorded.');
    next = granted.profile;
    payoutTransactionId = granted.transaction.id;
  }
  next = archiveRunRecord(next, { characterId, archiveReason: 'retired', endedAt: recordedAt,
    legacyGranted: payout.legacyGranted });
  next = { ...next, updatedAt: recordedAt, lastPlayedAt: recordedAt,
    history: { runRecords: next.history.runRecords.map(record => record.characterId === characterId
      ? { ...record, saveSlotIds: addressSlotIds, totalPlayTicks: runtime.totalPlayTicks,
          survivedDays: runtime.survivedDays, payoutEligible: payout.payoutEligible,
          payoutBreakdown: payout.payoutBreakdown, legacyGranted: payout.legacyGranted,
          legacyPayoutResolvedAt: recordedAt,
          ...(payoutTransactionId ? { legacyPayoutTransactionId: payoutTransactionId } : {}) }
      : record) } };
  const archived = next.history.runRecords.find(record => record.characterId === characterId)!;
  const estateSourceRunId = resolveAccountRunHistorySourceId(archived);
  if (next.estate.deposits.some(deposit => deposit.sourceRunId === estateSourceRunId))
    throw new Error('Retirement estate source was already deposited.');
  next = depositEstateFromArchivedSnapshot(next, snapshot, archived, recordedAt);
  const deposit = next.estate.deposits.find(entry => entry.sourceRunId === estateSourceRunId);
  if (!deposit) throw new Error('Retirement estate deposit is missing.');
  for (const plan of consumerPlans) next = recordCampaignPublicationConsumer(next, publication,
    plan.kind, plan.payloadFingerprint, { status: 'applied' });
  return { profile: next, payout, payoutTransactionId,
    estateSourceRunId, estateDepositId: deposit.depositId };
}
