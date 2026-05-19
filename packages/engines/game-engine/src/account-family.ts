import type {
  AccountFamiliesState,
  AccountFamilyUnlockState,
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
    prestigeTransactions: [],
    familyUnlocks: []
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

export function listFamilyUnlocks(
  state: AccountFamiliesState,
  familyId: string
): AccountFamilyUnlockState[] {
  return state.familyUnlocks
    .filter((unlock) => unlock.familyId === familyId)
    .map((unlock) => ({ ...unlock }));
}

export function listFamilyUnlockIds(
  state: AccountFamiliesState,
  familyId: string
): string[] {
  return listFamilyUnlocks(state, familyId).map((unlock) => unlock.unlockId);
}

export function hasFamilyUnlock(
  state: AccountFamiliesState,
  familyId: string,
  unlockId: string
): boolean {
  return state.familyUnlocks.some(
    (unlock) => unlock.familyId === familyId && unlock.unlockId === unlockId
  );
}

export function resolveFamilyUnlocksByFamily(
  state: AccountFamiliesState
): Record<string, AccountFamilyUnlockState[]> {
  return Object.fromEntries(
    state.families.map((family) => [
      family.familyId,
      listFamilyUnlocks(state, family.familyId)
    ])
  );
}
