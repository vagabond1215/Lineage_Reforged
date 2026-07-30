import type {
  AccountProfileState,
  AccountRunArchiveReason,
  AccountRunHistoryRecord,
  AccountRunHistoryOutcome,
  SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import {
  archiveRunRecord,
  evaluateAchievementProgress
} from '../../../../packages/engines/game-engine/src/achievements.js';
import {
  initializeTargetCampaignSnapshot
} from '../../../../packages/engines/game-engine/src/campaign-rules.js';
import type {
  VerifiedCampaignPublication
} from '../../../../packages/engines/game-engine/src/account-publication.js';
import type {
  CampaignSessionControl
} from '../../../../packages/engines/game-engine/src/campaign-session.js';
import { grantLegacyReward } from '../../../../packages/engines/game-engine/src/legacy-account.js';
import {
  depositEstateFromArchivedSnapshot,
  resolveAccountRunHistorySourceId
} from '../../../../packages/engines/game-engine/src/account-estate.js';
import {
  hasRunLegacyPayoutResolved,
  resolveRunLegacyPayout,
  type RunLegacyPayoutResolution
} from '../../../../packages/engines/game-engine/src/run-legacy-payout.js';
import { saveAccountProfile } from './accountProfileManager.js';
import {
  buildSaveMetadata,
  deleteSave,
  listSaves,
  loadSave,
  publishSave
} from './saveManager.js';
import type { SaveSlotId, SaveSlotSummary } from './state.js';

export type RunEndLegacyPayoutResolver = (
  record: AccountRunHistoryRecord,
  accountProfile: AccountProfileState
) => RunLegacyPayoutResolution;

export type ArchivedRunLifecycleResult = {
  accountProfile: AccountProfileState;
  slots: SaveSlotSummary[];
  clearedSlotIds: SaveSlotId[];
  legacyGranted: number;
  rewardTransactionId?: string;
  snapshot: SaveSnapshot;
};

export type BlockedRunSlotResult = {
  accountProfile: AccountProfileState;
  slots: SaveSlotSummary[];
  clearedSlotIds: SaveSlotId[];
  outcome: "archived" | "deleted";
};

export type RetainedRetiredRunLifecycleResult = {
  accountProfile: AccountProfileState;
  slots: SaveSlotSummary[];
  retainedSlotIds: SaveSlotId[];
  inheritanceUsesRemaining: number;
  snapshot: SaveSnapshot;
};

export type RetiredRunInheritanceUseResult = {
  accountProfile: AccountProfileState;
  consumed: boolean;
  remainingInheritanceUses: number;
  autoArchiveEligible: boolean;
};

type ArchivedRunRuntimeSummary = {
  totalPlayTicks: number;
  survivedDays: number;
};

const DEFAULT_RETIRED_INHERITANCE_USES = 0;
const ARCHIVE_RUNTIME_TICKS_PER_DAY = 24;

function dedupeSlotIds(slotIds: string[]): SaveSlotId[] {
  return [...new Set(slotIds)] as SaveSlotId[];
}

function normalizeInheritanceUsesRemaining(value: number | undefined): number {
  return Math.max(
    0,
    Math.trunc(value ?? DEFAULT_RETIRED_INHERITANCE_USES)
  );
}

export function isRunChronicleVisible(record: AccountRunHistoryRecord): boolean {
  return record.outcome === 'active' || record.outcome === 'retired' || record.outcome === 'archived';
}

export function isRunProgressionAuthoritative(record: AccountRunHistoryRecord): boolean {
  return record.outcome === 'retired' || record.outcome === 'archived';
}

export function isRunLineageAuthoritative(record: AccountRunHistoryRecord): boolean {
  return (
    record.outcome === 'retired' &&
    normalizeInheritanceUsesRemaining(record.inheritanceUsesRemaining) > 0
  );
}

export function isRunDeleted(record: AccountRunHistoryRecord): boolean {
  return record.outcome === 'deleted';
}

export function resolveRunHistorySourceId(record: AccountRunHistoryRecord): string {
  return resolveAccountRunHistorySourceId(record);
}

function parseRunTimestamp(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveRunRecencyTimestamp(record: AccountRunHistoryRecord): number {
  return (
    parseRunTimestamp(record.lastSeenAt) ||
    parseRunTimestamp(record.endedAt) ||
    parseRunTimestamp(record.startedAt)
  );
}

export function resolveEligibleHeirSources(
  profile: AccountProfileState
): AccountRunHistoryRecord[] {
  return profile.history.runRecords
    .map((record, index) => ({ record, index }))
    .filter(({ record }) => isRunLineageAuthoritative(record))
    .sort((left, right) => {
      const leftUses = normalizeInheritanceUsesRemaining(
        left.record.inheritanceUsesRemaining
      );
      const rightUses = normalizeInheritanceUsesRemaining(
        right.record.inheritanceUsesRemaining
      );

      return (
        rightUses - leftUses ||
        (right.record.legacyGranted ?? 0) - (left.record.legacyGranted ?? 0) ||
        resolveRunRecencyTimestamp(right.record) - resolveRunRecencyTimestamp(left.record) ||
        left.index - right.index
      );
    })
    .map(({ record }) => record);
}

export function resolveHeirSourceById(
  profile: AccountProfileState,
  sourceRunId: string | null | undefined
): AccountRunHistoryRecord | null {
  const normalizedSourceRunId = sourceRunId?.trim();

  if (!normalizedSourceRunId) {
    return null;
  }

  return (
    resolveEligibleHeirSources(profile).find(
      (record) => resolveRunHistorySourceId(record) === normalizedSourceRunId
    ) ?? null
  );
}

function findRunOutcome(
  profile: AccountProfileState,
  characterId: string
): AccountRunHistoryOutcome | null {
  return (
    profile.history.runRecords.find((record) => record.characterId === characterId)?.outcome ?? null
  );
}

function findRunRecord(
  profile: AccountProfileState,
  characterId: string
): AccountRunHistoryRecord | null {
  return profile.history.runRecords.find((record) => record.characterId === characterId) ?? null;
}

export function resolveArchivedRunRuntimeSummary(snapshot: SaveSnapshot): ArchivedRunRuntimeSummary {
  const totalPlayTicks = Math.max(0, Math.trunc(snapshot.playerState.saveMeta.totalPlayTicks));

  return {
    totalPlayTicks,
    survivedDays: Math.floor(totalPlayTicks / ARCHIVE_RUNTIME_TICKS_PER_DAY)
  };
}

function buildArchivePayoutRecord(params: {
  record: AccountRunHistoryRecord;
  archiveReason: AccountRunArchiveReason;
  recordedAt: string;
  runtimeSummary: ArchivedRunRuntimeSummary;
}): AccountRunHistoryRecord {
  return {
    ...params.record,
    endedAt: params.recordedAt,
    lastSeenAt: params.recordedAt,
    outcome: "archived",
    archiveReason: params.archiveReason,
    totalPlayTicks: params.runtimeSummary.totalPlayTicks,
    survivedDays: params.runtimeSummary.survivedDays,
    saveSlotIds: []
  };
}

function applyPayoutMetadataToRecord(params: {
  profile: AccountProfileState;
  characterId: string;
  payout: RunLegacyPayoutResolution;
  runtimeSummary: ArchivedRunRuntimeSummary;
  resolvedAt: string;
  transactionId?: string;
}): AccountProfileState {
  return {
    ...params.profile,
    updatedAt: params.resolvedAt,
    history: {
      runRecords: params.profile.history.runRecords.map((record) =>
        record.characterId === params.characterId
          ? {
              ...record,
              totalPlayTicks: params.runtimeSummary.totalPlayTicks,
              survivedDays: params.runtimeSummary.survivedDays,
              payoutEligible: params.payout.payoutEligible,
              payoutBreakdown: params.payout.payoutBreakdown,
              legacyGranted: params.payout.legacyGranted,
              legacyPayoutResolvedAt: params.resolvedAt,
              ...(params.transactionId ? { legacyPayoutTransactionId: params.transactionId } : {})
            }
          : record
      )
    }
  };
}

function resolveKnownRunSlotIds(
  accountId: string,
  characterId: string
): SaveSlotId[] {
  return listSaves(accountId)
    .filter((slot) => slot.status === 'ready')
    .flatMap((slot) => {
      const snapshot = loadSave(accountId, slot.id);
      return snapshot?.playerState.playerId === characterId ? [slot.id] : [];
    });
}

function resolveArchiveSlotIds(
  accountId: string,
  profile: AccountProfileState,
  characterId: string,
  fallbackSlotId?: SaveSlotId
): SaveSlotId[] {
  const recordedSlotIds =
    profile.history.runRecords.find((record) => record.characterId === characterId)?.saveSlotIds ?? [];
  const discoveredSlotIds = resolveKnownRunSlotIds(accountId, characterId);
  const resolved = dedupeSlotIds([
    ...recordedSlotIds,
    ...discoveredSlotIds,
    ...(recordedSlotIds.length === 0 && discoveredSlotIds.length === 0 && fallbackSlotId
      ? [fallbackSlotId]
      : [])
  ]);

  return resolved;
}

export function resolveTerminalArchiveReason(
  snapshot: SaveSnapshot
): AccountRunArchiveReason | null {
  if (
    snapshot.campaignRules?.version === 2 &&
    snapshot.campaignRules.stakesRules === "normal_stakes"
  ) {
    return null;
  }

  if (snapshot.playerState.resources.hp.current > 0) {
    return null;
  }

  return snapshot.gameState.runDifficulty.hardcore ? 'hardcore_dead' : 'dead';
}

export function resolveBlockedRunOutcome(
  profile: AccountProfileState,
  characterId: string
): "archived" | "deleted" | null {
  const outcome = findRunOutcome(profile, characterId);
  return outcome === 'archived' || outcome === 'deleted' ? outcome : null;
}

export function purgeBlockedRunSlot(params: {
  accountId: string;
  accountProfile: AccountProfileState;
  characterId: string;
  slotId: SaveSlotId;
}): BlockedRunSlotResult | null {
  const outcome = resolveBlockedRunOutcome(params.accountProfile, params.characterId);

  if (!outcome) {
    return null;
  }

  deleteSave(params.accountId, params.slotId);

  return {
    accountProfile: params.accountProfile,
    slots: listSaves(params.accountId),
    clearedSlotIds: [params.slotId],
    outcome
  };
}

export function retainRetiredRun(params: {
  accountId: string;
  accountProfile: AccountProfileState;
  snapshot: SaveSnapshot;
  fallbackSlotId?: SaveSlotId;
  recordedAt?: string;
  inheritanceUsesRemaining?: number;
}): RetainedRetiredRunLifecycleResult {
  const recordedAt = params.recordedAt ?? new Date().toISOString();
  const evaluated = evaluateAchievementProgress(
    params.snapshot,
    params.accountProfile,
    {
      ...(params.fallbackSlotId ? { slotId: params.fallbackSlotId } : {}),
      touchHistory: true,
      recordedAt
    }
  );
  const characterId = evaluated.nextSnapshot.playerState.playerId;
  const retainedSlotIds = resolveArchiveSlotIds(
    params.accountId,
    evaluated.nextAccountProfile,
    characterId,
    params.fallbackSlotId
  );
  const inheritanceUsesRemaining = normalizeInheritanceUsesRemaining(
    params.inheritanceUsesRemaining
  );
  const nextRunRecords = evaluated.nextAccountProfile.history.runRecords.map((record) =>
    record.characterId === characterId
      ? {
          ...record,
          endedAt: recordedAt,
          lastSeenAt: recordedAt,
          outcome: 'retired' as const,
          archiveReason: 'retired' as const,
          inheritanceUsesRemaining,
          saveSlotIds: retainedSlotIds
        }
      : record
  );
  const retiredProfile = saveAccountProfile({
    ...evaluated.nextAccountProfile,
    updatedAt: recordedAt,
    history: {
      runRecords: nextRunRecords
    }
  });

  return {
    accountProfile: retiredProfile,
    slots: listSaves(params.accountId),
    retainedSlotIds,
    inheritanceUsesRemaining,
    snapshot: evaluated.nextSnapshot
  };
}

export function consumeRetiredRunInheritanceUse(
  accountProfile: AccountProfileState,
  params: {
    characterId: string;
    recordedAt?: string;
  }
): RetiredRunInheritanceUseResult {
  const recordedAt = params.recordedAt ?? new Date().toISOString();
  const currentRecord = accountProfile.history.runRecords.find(
    (record) => record.characterId === params.characterId
  );
  const currentUses = normalizeInheritanceUsesRemaining(
    currentRecord?.inheritanceUsesRemaining
  );

  if (!currentRecord || currentRecord.outcome !== 'retired' || currentUses <= 0) {
    return {
      accountProfile,
      consumed: false,
      remainingInheritanceUses: currentUses,
      autoArchiveEligible: currentRecord?.outcome === 'retired' && currentUses === 0
    };
  }

  const remainingInheritanceUses = currentUses - 1;
  const nextRunRecords = accountProfile.history.runRecords.map((record) =>
    record.characterId === params.characterId
      ? {
          ...record,
          lastSeenAt: recordedAt,
          inheritanceUsesRemaining: remainingInheritanceUses
        }
      : record
  );

  return {
    accountProfile: {
      ...accountProfile,
      updatedAt: recordedAt,
      history: {
        runRecords: nextRunRecords
      }
    },
    consumed: true,
    remainingInheritanceUses,
    autoArchiveEligible: remainingInheritanceUses === 0
  };
}

export function archiveActiveRun(params: {
  accountId: string;
  accountProfile: AccountProfileState;
  snapshot: SaveSnapshot;
  archiveReason: AccountRunArchiveReason;
  fallbackSlotId?: SaveSlotId;
  recordedAt?: string;
  payoutResolver?: RunEndLegacyPayoutResolver;
  campaignSessionControl?: CampaignSessionControl;
  verifiedTerminalPublication?: VerifiedCampaignPublication;
  persistAccountProfile?: boolean;
  deferSlotDeletion?: boolean;
}): ArchivedRunLifecycleResult {
  const recordedAt = params.recordedAt ?? new Date().toISOString();
  let terminalSnapshot = params.snapshot;
  let verifiedTerminalPublication =
    params.verifiedTerminalPublication ?? null;

  if (!verifiedTerminalPublication) {
    terminalSnapshot =
      terminalSnapshot.campaignRules?.version === 2
        ? terminalSnapshot
        : initializeTargetCampaignSnapshot(terminalSnapshot, {
            source: "developer_fixture",
            recordedAt
          });
    const terminalSlotId =
      params.fallbackSlotId ?? "quick-save";
    const published = publishSave(
      params.accountId,
      terminalSlotId,
      terminalSnapshot,
      buildSaveMetadata(terminalSlotId, terminalSnapshot),
      {
        ...(params.campaignSessionControl
          ? {
              sessionControl:
                params.campaignSessionControl
            }
          : {}),
        terminal: true
      }
    );
    if (!published.publication) {
      throw new Error(
        "Retirement requires a verified terminal campaign publication."
      );
    }
    terminalSnapshot = published.snapshot;
    verifiedTerminalPublication = published.publication;
  }
  if (
    terminalSnapshot.campaignIdentity?.campaignId !==
      verifiedTerminalPublication.campaignId ||
    terminalSnapshot.campaignIdentity?.continuityId !==
      verifiedTerminalPublication.continuityId ||
    terminalSnapshot.playerState.playerId !==
      verifiedTerminalPublication.characterId
  ) {
    throw new Error(
      "Retirement publication does not match terminal campaign identity."
    );
  }

  const characterId = terminalSnapshot.playerState.playerId;
  const existingRecord = findRunRecord(params.accountProfile, characterId);

  if (existingRecord && hasRunLegacyPayoutResolved(existingRecord)) {
    const clearedSlotIds = resolveArchiveSlotIds(
      params.accountId,
      params.accountProfile,
      characterId,
      params.fallbackSlotId
    );

    if (!params.deferSlotDeletion) {
      for (const slotId of clearedSlotIds) {
        deleteSave(params.accountId, slotId);
      }
    }

    return {
      accountProfile: params.accountProfile,
      slots: listSaves(params.accountId),
      clearedSlotIds,
      legacyGranted: 0,
      snapshot: terminalSnapshot
    };
  }

  const evaluated = evaluateAchievementProgress(
    terminalSnapshot,
    params.accountProfile,
    {
      ...(params.fallbackSlotId ? { slotId: params.fallbackSlotId } : {}),
      touchHistory: true,
      recordedAt
    }
  );

  let profile = evaluated.nextAccountProfile;
  const evaluatedRecord = findRunRecord(
    profile,
    evaluated.nextSnapshot.playerState.playerId
  );
  const runtimeSummary = resolveArchivedRunRuntimeSummary(evaluated.nextSnapshot);
  const archivePayoutRecord = evaluatedRecord
    ? buildArchivePayoutRecord({
        record: evaluatedRecord,
        archiveReason: params.archiveReason,
        recordedAt,
        runtimeSummary
      })
    : null;
  const payout = archivePayoutRecord
    ? (params.payoutResolver ?? resolveRunLegacyPayout)(archivePayoutRecord, profile)
    : resolveRunLegacyPayout(
        {
          characterId: evaluated.nextSnapshot.playerState.playerId,
          name: evaluated.nextSnapshot.playerState.coreData.playerName,
          lineageId: evaluated.nextSnapshot.playerState.coreData.lineageId,
          startingContinentId: "unknown.start.continent",
          startingRegionId: evaluated.nextSnapshot.playerState.regionId,
          startingSettlementId: evaluated.nextSnapshot.playerState.location.settlementId ?? "unknown.start.settlement",
          startedAt: recordedAt,
          endedAt: recordedAt,
          lastSeenAt: recordedAt,
          outcome: "archived",
          archiveReason: params.archiveReason,
          echoLevelReached: evaluated.nextSnapshot.playerState.progression.level,
          notableCharacterAchievementIds: [],
          ...runtimeSummary,
          saveSlotIds: []
        },
        profile
      );
  const characterIdAfterEvaluation = evaluated.nextSnapshot.playerState.playerId;
  const clearedSlotIds = resolveArchiveSlotIds(
    params.accountId,
    profile,
    characterIdAfterEvaluation,
    params.fallbackSlotId
  );
  let rewardTransactionId: string | undefined;

  if (payout.legacyGranted > 0) {
    const rewarded = grantLegacyReward(profile, {
      legacyPoints: payout.legacyGranted,
      summary: payout.summary,
      sourceType: payout.sourceType,
      sourceId: payout.sourceId,
      recordedAt
    });

    if (rewarded.ok) {
      profile = rewarded.profile;
      rewardTransactionId = rewarded.transaction.id;
    }
  }

  const archivedWithoutPayoutMetadata = archiveRunRecord(profile, {
      characterId: characterIdAfterEvaluation,
      archiveReason: params.archiveReason,
      endedAt: recordedAt,
      legacyGranted: payout.legacyGranted
    });
  const archivedWithPayoutMetadata = applyPayoutMetadataToRecord({
      profile: archivedWithoutPayoutMetadata,
      characterId: characterIdAfterEvaluation,
      payout,
      runtimeSummary,
      resolvedAt: recordedAt,
      ...(rewardTransactionId ? { transactionId: rewardTransactionId } : {})
    });
  const archivedRecordForEstate = findRunRecord(
    archivedWithPayoutMetadata,
    characterIdAfterEvaluation
  );
  const archivedWithEstate = archivedRecordForEstate
    ? depositEstateFromArchivedSnapshot(
        archivedWithPayoutMetadata,
        evaluated.nextSnapshot,
        archivedRecordForEstate,
        recordedAt
      )
    : archivedWithPayoutMetadata;
  const archivedProfile =
    params.persistAccountProfile === false
      ? archivedWithEstate
      : saveAccountProfile(archivedWithEstate);

  if (!params.deferSlotDeletion) {
    for (const slotId of clearedSlotIds) {
      deleteSave(params.accountId, slotId);
    }
  }

  return {
    accountProfile: archivedProfile,
    slots: listSaves(params.accountId),
    clearedSlotIds,
    legacyGranted: payout.legacyGranted,
    ...(rewardTransactionId ? { rewardTransactionId } : {}),
    snapshot: evaluated.nextSnapshot
  };
}
