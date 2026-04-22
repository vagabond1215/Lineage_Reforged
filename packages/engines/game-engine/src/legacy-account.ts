import type {
  AccountLegacyState,
  AccountProfileState,
  LegacyTransactionKind,
  LegacyTransactionState,
  LegacyUnlockState
} from "../../../shared/types/src/index.js";
import {
  createDefaultAccountAchievementsState,
  createDefaultAccountHistoryState
} from "./account-achievement-state.js";

export const DEFAULT_ACCOUNT_ID = "account.local.default";
export const DEFAULT_ACCOUNT_DISPLAY_NAME = "Wayfarer Ledger";

export type LegacyTransactionDraft = {
  kind: LegacyTransactionKind;
  amount: number;
  summary: string;
  sourceType: string;
  sourceId: string;
  recordedAt?: string;
  unlockId?: string;
};

export type LegacyGrantParams = Omit<LegacyTransactionDraft, "kind">;
export type LegacySpendParams = Omit<LegacyTransactionDraft, "kind">;
export type LegacyRewardParams = Omit<LegacyTransactionDraft, "kind" | "amount"> & {
  legacyPoints?: number;
};

export type LegacyMutationFailureReason =
  | "invalid_amount"
  | "insufficient_legacy"
  | "duplicate_unlock"
  | "missing_reward";

export type LegacyMutationFailure = {
  ok: false;
  profile: AccountProfileState;
  error: LegacyMutationFailureReason;
};

export type LegacyMutationSuccess = {
  ok: true;
  profile: AccountProfileState;
  transaction: LegacyTransactionState;
};

function normalizePositiveInteger(value: number): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const normalized = Math.trunc(value);
  return normalized > 0 ? normalized : null;
}

function normalizeNonNegativeInteger(value: number): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const normalized = Math.trunc(value);
  return normalized >= 0 ? normalized : null;
}

function createTransactionId(
  profile: AccountProfileState,
  kind: LegacyTransactionKind,
  recordedAt: string
): string {
  const ordinal = profile.legacy.legacyTransactions.length + 1;
  const stamp = recordedAt.replace(/[^0-9]/g, "");
  return `legacy.transaction.${kind}.${stamp}.${ordinal}`;
}

function withUpdatedTimestamp(
  profile: AccountProfileState,
  updatedAt: string
): AccountProfileState {
  return {
    ...profile,
    updatedAt
  };
}

export function createDefaultAccountLegacyState(): AccountLegacyState {
  return {
    legacyPoints: 0,
    lifetimeLegacyEarned: 0,
    legacyUnlocks: [],
    legacyTransactions: []
  };
}

export function createDefaultAccountProfileState(params: {
  accountId?: string;
  displayName?: string;
  createdAt?: string;
  updatedAt?: string;
  lastPlayedAt?: string;
  legacy?: AccountLegacyState;
} = {}): AccountProfileState {
  const now = params.updatedAt ?? params.createdAt ?? new Date().toISOString();

  return {
    accountId: params.accountId ?? DEFAULT_ACCOUNT_ID,
    displayName: params.displayName ?? DEFAULT_ACCOUNT_DISPLAY_NAME,
    createdAt: params.createdAt ?? now,
    updatedAt: params.updatedAt ?? now,
    ...(params.lastPlayedAt ? { lastPlayedAt: params.lastPlayedAt } : {}),
    legacy: params.legacy ?? createDefaultAccountLegacyState(),
    achievements: createDefaultAccountAchievementsState(),
    history: createDefaultAccountHistoryState()
  };
}

export function hasLegacyUnlock(
  profile: Pick<AccountProfileState, "legacy">,
  unlockId: string
): boolean {
  return profile.legacy.legacyUnlocks.some((entry) => entry.unlockId === unlockId);
}

export function recordLegacyTransaction(
  profile: AccountProfileState,
  draft: LegacyTransactionDraft & { balanceAfter: number }
): { profile: AccountProfileState; transaction: LegacyTransactionState } {
  const amount = normalizeNonNegativeInteger(draft.amount);

  if (amount === null) {
    throw new Error("Legacy transactions require a non-negative integer amount.");
  }

  const recordedAt = draft.recordedAt ?? new Date().toISOString();
  const transaction: LegacyTransactionState = {
    id: createTransactionId(profile, draft.kind, recordedAt),
    kind: draft.kind,
    amount,
    balanceAfter: Math.max(0, Math.trunc(draft.balanceAfter)),
    recordedAt,
    summary: draft.summary,
    sourceType: draft.sourceType,
    sourceId: draft.sourceId,
    ...(draft.unlockId ? { unlockId: draft.unlockId } : {})
  };

  const nextProfile = withUpdatedTimestamp(
    {
      ...profile,
      legacy: {
        ...profile.legacy,
        legacyTransactions: [...profile.legacy.legacyTransactions, transaction]
      }
    },
    recordedAt
  );

  return {
    profile: nextProfile,
    transaction
  };
}

export function grantLegacy(
  profile: AccountProfileState,
  params: LegacyGrantParams
): LegacyMutationSuccess | LegacyMutationFailure {
  const amount = normalizePositiveInteger(params.amount);

  if (amount === null) {
    return {
      ok: false,
      profile,
      error: "invalid_amount"
    };
  }

  const recordedAt = params.recordedAt ?? new Date().toISOString();
  const updatedProfile = withUpdatedTimestamp(
    {
      ...profile,
      legacy: {
        ...profile.legacy,
        legacyPoints: profile.legacy.legacyPoints + amount,
        lifetimeLegacyEarned: profile.legacy.lifetimeLegacyEarned + amount
      }
    },
    recordedAt
  );
  const recorded = recordLegacyTransaction(updatedProfile, {
    kind: "grant",
    amount,
    balanceAfter: updatedProfile.legacy.legacyPoints,
    summary: params.summary,
    sourceType: params.sourceType,
    sourceId: params.sourceId,
    recordedAt,
    unlockId: params.unlockId
  });

  return {
    ok: true,
    profile: recorded.profile,
    transaction: recorded.transaction
  };
}

export function spendLegacy(
  profile: AccountProfileState,
  params: LegacySpendParams
): LegacyMutationSuccess | LegacyMutationFailure {
  const amount = normalizePositiveInteger(params.amount);

  if (amount === null) {
    return {
      ok: false,
      profile,
      error: "invalid_amount"
    };
  }

  if (params.unlockId && hasLegacyUnlock(profile, params.unlockId)) {
    return {
      ok: false,
      profile,
      error: "duplicate_unlock"
    };
  }

  if (profile.legacy.legacyPoints < amount) {
    return {
      ok: false,
      profile,
      error: "insufficient_legacy"
    };
  }

  const recordedAt = params.recordedAt ?? new Date().toISOString();
  const nextBalance = profile.legacy.legacyPoints - amount;
  const updatedProfile = withUpdatedTimestamp(
    {
      ...profile,
      legacy: {
        ...profile.legacy,
        legacyPoints: nextBalance
      }
    },
    recordedAt
  );
  const recorded = recordLegacyTransaction(updatedProfile, {
    kind: "spend",
    amount,
    balanceAfter: nextBalance,
    summary: params.summary,
    sourceType: params.sourceType,
    sourceId: params.sourceId,
    recordedAt,
    unlockId: params.unlockId
  });

  const nextUnlocks: LegacyUnlockState[] = params.unlockId
    ? [
        ...recorded.profile.legacy.legacyUnlocks,
        {
          unlockId: params.unlockId,
          unlockedAt: recorded.transaction.recordedAt,
          sourceTransactionId: recorded.transaction.id
        }
      ]
    : recorded.profile.legacy.legacyUnlocks;

  return {
    ok: true,
    profile: {
      ...recorded.profile,
      legacy: {
        ...recorded.profile.legacy,
        legacyUnlocks: nextUnlocks
      }
    },
    transaction: recorded.transaction
  };
}

export function grantLegacyReward(
  profile: AccountProfileState,
  params: LegacyRewardParams
): LegacyMutationSuccess | LegacyMutationFailure {
  const amount =
    params.legacyPoints === undefined
      ? 0
      : normalizeNonNegativeInteger(params.legacyPoints);

  if (amount === null) {
    return {
      ok: false,
      profile,
      error: "invalid_amount"
    };
  }

  if (amount === 0 && !params.unlockId) {
    return {
      ok: false,
      profile,
      error: "missing_reward"
    };
  }

  if (params.unlockId && hasLegacyUnlock(profile, params.unlockId)) {
    return {
      ok: false,
      profile,
      error: "duplicate_unlock"
    };
  }

  const recordedAt = params.recordedAt ?? new Date().toISOString();
  const nextBalance = profile.legacy.legacyPoints + amount;
  const updatedProfile = withUpdatedTimestamp(
    {
      ...profile,
      legacy: {
        ...profile.legacy,
        legacyPoints: nextBalance,
        lifetimeLegacyEarned: profile.legacy.lifetimeLegacyEarned + amount
      }
    },
    recordedAt
  );
  const recorded = recordLegacyTransaction(updatedProfile, {
    kind: "grant",
    amount,
    balanceAfter: nextBalance,
    summary: params.summary,
    sourceType: params.sourceType,
    sourceId: params.sourceId,
    recordedAt,
    unlockId: params.unlockId
  });

  const nextUnlocks: LegacyUnlockState[] = params.unlockId
    ? [
        ...recorded.profile.legacy.legacyUnlocks,
        {
          unlockId: params.unlockId,
          unlockedAt: recorded.transaction.recordedAt,
          sourceTransactionId: recorded.transaction.id
        }
      ]
    : recorded.profile.legacy.legacyUnlocks;

  return {
    ok: true,
    profile: {
      ...recorded.profile,
      legacy: {
        ...recorded.profile.legacy,
        legacyUnlocks: nextUnlocks
      }
    },
    transaction: recorded.transaction
  };
}
