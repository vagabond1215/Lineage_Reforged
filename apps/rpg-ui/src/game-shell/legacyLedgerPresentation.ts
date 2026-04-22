import type {
  AccountProfileState,
  LegacyTransactionState
} from "../../../../packages/shared/types/src/index.js";

export type LegacyLedgerTransactionViewModel = {
  id: string;
  summary: string;
  amountLabel: string;
  balanceLabel: string;
  recordedAtLabel: string;
  unlockLabel: string | null;
};

export type LegacyLedgerSummaryViewModel = {
  displayName: string;
  currentLegacyLabel: string;
  lifetimeLegacyLabel: string;
  unlockCountLabel: string;
  emptyState: string | null;
  recentTransactions: LegacyLedgerTransactionViewModel[];
};

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatTimestamp(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.valueOf())) {
    return "Unknown entry";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(parsed);
}

function humanizeId(value: string): string {
  const lastSegment = value.split(".").at(-1) ?? value;
  return lastSegment
    .split("_")
    .filter(Boolean)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(" ");
}

function compareTransactions(
  left: LegacyTransactionState,
  right: LegacyTransactionState
): number {
  return right.recordedAt.localeCompare(left.recordedAt);
}

function formatAmountLabel(transaction: LegacyTransactionState): string {
  const prefix = transaction.kind === "grant" ? "+" : "-";
  return `${prefix}${formatCount(transaction.amount)} Legacy`;
}

export function buildLegacyLedgerSummary(
  profile: AccountProfileState,
  limit = 5
): LegacyLedgerSummaryViewModel {
  const recentTransactions = [...profile.legacy.legacyTransactions]
    .sort(compareTransactions)
    .slice(0, limit)
    .map((transaction) => ({
      id: transaction.id,
      summary: transaction.summary,
      amountLabel: formatAmountLabel(transaction),
      balanceLabel: `Balance ${formatCount(transaction.balanceAfter)}`,
      recordedAtLabel: formatTimestamp(transaction.recordedAt),
      unlockLabel: transaction.unlockId ? `Unlocked ${humanizeId(transaction.unlockId)}` : null
    }));

  return {
    displayName: profile.displayName,
    currentLegacyLabel: formatCount(profile.legacy.legacyPoints),
    lifetimeLegacyLabel: formatCount(profile.legacy.lifetimeLegacyEarned),
    unlockCountLabel: formatCount(profile.legacy.legacyUnlocks.length),
    emptyState:
      recentTransactions.length === 0
        ? "No legacy has been recorded yet."
        : null,
    recentTransactions
  };
}
