import type {
  AccountFamiliesState,
  AccountFamilyPrestigeCategoryTotals,
  AccountFamilyPrestigeTotals,
  AccountFamilyStatus,
  FamilyPrestigeCategoryTag,
  FamilyPrestigeTransactionKind
} from "../../../shared/types/src/index.js";

export const FAMILY_PRESTIGE_TRANSACTION_KINDS = [
  "grant",
  "spend"
] as const satisfies readonly FamilyPrestigeTransactionKind[];

export const FAMILY_PRESTIGE_CATEGORY_TAGS = [
  "renown",
  "martial",
  "production",
  "commerce",
  "lore_faith",
  "survival_utility",
  "household_lineage",
  "preparation"
] as const satisfies readonly FamilyPrestigeCategoryTag[];

export const ACCOUNT_FAMILY_STATUSES = [
  "active",
  "dormant",
  "closed"
] as const satisfies readonly AccountFamilyStatus[];

function createEmptyCategoryTotals(): AccountFamilyPrestigeCategoryTotals {
  return {
    earned: 0,
    spent: 0,
    available: 0
  };
}

export function createDefaultAccountFamiliesState(): AccountFamiliesState {
  return {
    families: [],
    prestigeTransactions: []
  };
}

export function createEmptyAccountFamilyPrestigeTotals(): AccountFamilyPrestigeTotals {
  return {
    earned: 0,
    spent: 0,
    available: 0,
    byCategory: {}
  };
}

export function resolveFamilyPrestigeTotals(
  state: AccountFamiliesState,
  familyId: string
): AccountFamilyPrestigeTotals {
  const totals = createEmptyAccountFamilyPrestigeTotals();

  for (const transaction of state.prestigeTransactions) {
    if (transaction.familyId !== familyId) {
      continue;
    }

    const categoryTotals =
      totals.byCategory[transaction.categoryTag] ?? createEmptyCategoryTotals();

    if (transaction.kind === "grant") {
      totals.earned += transaction.amount;
      categoryTotals.earned += transaction.amount;
    } else {
      totals.spent += transaction.amount;
      categoryTotals.spent += transaction.amount;
    }

    categoryTotals.available = categoryTotals.earned - categoryTotals.spent;
    totals.byCategory[transaction.categoryTag] = categoryTotals;
  }

  totals.available = totals.earned - totals.spent;
  return totals;
}

export function resolveFamilyPrestigeTotalsByFamily(
  state: AccountFamiliesState
): Record<string, AccountFamilyPrestigeTotals> {
  return Object.fromEntries(
    state.families.map((family) => [
      family.familyId,
      resolveFamilyPrestigeTotals(state, family.familyId)
    ])
  );
}
