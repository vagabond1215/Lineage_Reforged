import type {
  AccountFamilyRecord,
  AccountFamilyStatus,
  AccountProfileState,
  AccountRunHistoryRecord,
  FamilyPrestigeCategoryTag
} from "../../../../packages/shared/types/src/index.js";
import {
  listFamilyUnlocks,
  resolveFamilyPrestigeTotals
} from "../../../../packages/engines/game-engine/src/account-family.js";

export type BloodlinesSummaryStatId =
  | "families"
  | "active"
  | "dormant"
  | "closed"
  | "with_prestige"
  | "linked_runs";

export type BloodlinesInactiveSectionId =
  | "heirs"
  | "heirlooms"
  | "bequests"
  | "family_management"
  | "family_prestige_spending";

export type BloodlinesSummaryStatViewModel = {
  id: BloodlinesSummaryStatId;
  label: string;
  value: number;
  valueLabel: string;
};

export type BloodlinesPrestigeCategorySummaryViewModel = {
  categoryTag: FamilyPrestigeCategoryTag;
  label: string;
  earned: number;
  spent: number;
  available: number;
  earnedLabel: string;
  spentLabel: string;
  availableLabel: string;
};

export type BloodlinesPrestigeSummaryViewModel = {
  earned: number;
  spent: number;
  available: number;
  earnedLabel: string;
  spentLabel: string;
  availableLabel: string;
  categorySummaries: BloodlinesPrestigeCategorySummaryViewModel[];
};

export type BloodlinesFamilyUnlockSummaryViewModel = {
  unlockId: string;
  rank: number | null;
  unlockedAt: string;
  sourceTransactionId: string;
};

export type BloodlinesRunSummaryViewModel = {
  characterId: string;
  familyId: string;
  parentCharacterId: string | null;
  sourceRunId: string | null;
  nameLabel: string;
  statusLabel: string;
  lineageLabel: string;
  lastSeenAt: string;
  isRoot: boolean;
  parentKnown: boolean;
  authorityNoteLabel: string | null;
};

export type BloodlinesTreeSummaryViewModel = {
  root: BloodlinesRunSummaryViewModel | null;
  linkedRuns: BloodlinesRunSummaryViewModel[];
  unlinkedRuns: BloodlinesRunSummaryViewModel[];
  unresolvedMemberIds: string[];
  missingRootLabel: string | null;
};

export type BloodlinesInactiveSectionViewModel = {
  id: BloodlinesInactiveSectionId;
  label: string;
  stateLabel: "Inactive";
  noteLabel: string;
  actionIds: [];
};

export type BloodlinesFamilySummaryViewModel = {
  familyId: string;
  familyName: string;
  status: AccountFamilyStatus;
  statusLabel: string;
  rootCharacterId: string | null;
  rootLabel: string;
  memberCount: number;
  memberCountLabel: string;
  memberCharacterIds: string[];
  knownRunCount: number;
  knownRunCountLabel: string;
  latestKnownActivityAt: string | null;
  latestKnownActivityLabel: string;
  prestige: BloodlinesPrestigeSummaryViewModel;
  unlocks: BloodlinesFamilyUnlockSummaryViewModel[];
  unlockCountLabel: string;
  tree: BloodlinesTreeSummaryViewModel;
  warnings: string[];
};

export type BloodlinesViewModel = {
  hasFamilies: boolean;
  emptyLabel: string | null;
  noteLabel: string;
  summaryStats: BloodlinesSummaryStatViewModel[];
  families: BloodlinesFamilySummaryViewModel[];
  inactiveSections: BloodlinesInactiveSectionViewModel[];
  actionIds: [];
};

const EMPTY_FAMILY_STATE = {
  families: [],
  prestigeTransactions: [],
  familyUnlocks: []
};

const STATUS_LABELS: Record<AccountFamilyStatus, string> = {
  active: "Active",
  dormant: "Dormant",
  closed: "Closed"
};

const STATUS_ORDER: Record<AccountFamilyStatus, number> = {
  active: 0,
  dormant: 1,
  closed: 2
};

const CATEGORY_LABELS: Record<FamilyPrestigeCategoryTag, string> = {
  renown: "Renown",
  martial: "Martial",
  production: "Production",
  commerce: "Commerce",
  lore_faith: "Lore and Faith",
  survival_utility: "Survival and Utility",
  household_lineage: "Household and Lineage",
  preparation: "Preparation"
};

const INACTIVE_SECTIONS: BloodlinesInactiveSectionViewModel[] = [
  {
    id: "heirs",
    label: "Heirs",
    stateLabel: "Inactive",
    noteLabel: "Heir slots are not implemented yet.",
    actionIds: []
  },
  {
    id: "heirlooms",
    label: "Heirlooms",
    stateLabel: "Inactive",
    noteLabel: "Heirloom registration, transfer, loss, and recovery are not implemented yet.",
    actionIds: []
  },
  {
    id: "bequests",
    label: "Bequests",
    stateLabel: "Inactive",
    noteLabel: "Bequest preparation, claimant rules, delivery, and claims are not implemented yet.",
    actionIds: []
  },
  {
    id: "family_management",
    label: "Family Management",
    stateLabel: "Inactive",
    noteLabel: "Family creation, editing, merging, and member management are not implemented yet.",
    actionIds: []
  },
  {
    id: "family_prestige_spending",
    label: "Family Prestige Spending",
    stateLabel: "Inactive",
    noteLabel: "Family Prestige is read from the ledger only; spending actions are not implemented yet.",
    actionIds: []
  }
];

function formatCount(value: number): string {
  return String(value);
}

function formatOutcomeLabel(record: AccountRunHistoryRecord): string {
  if (record.outcome === "archived" && record.archiveReason) {
    return `Archived: ${record.archiveReason}`;
  }

  return record.outcome.charAt(0).toUpperCase() + record.outcome.slice(1);
}

function parseTimestamp(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveRunActivityTimestamp(record: AccountRunHistoryRecord): string | null {
  return record.lastSeenAt || record.endedAt || record.startedAt || null;
}

function sortRunsByActivity(left: AccountRunHistoryRecord, right: AccountRunHistoryRecord): number {
  return (
    parseTimestamp(resolveRunActivityTimestamp(right)) -
      parseTimestamp(resolveRunActivityTimestamp(left)) ||
    left.name.localeCompare(right.name) ||
    left.characterId.localeCompare(right.characterId)
  );
}

function createRunSummary(
  record: AccountRunHistoryRecord,
  family: AccountFamilyRecord,
  linkedCharacterIds: Set<string>
): BloodlinesRunSummaryViewModel {
  const parentCharacterId = record.parentCharacterId ?? null;
  const parentKnown = parentCharacterId !== null && linkedCharacterIds.has(parentCharacterId);
  const isRoot = family.rootCharacterId === record.characterId;

  return {
    characterId: record.characterId,
    familyId: record.familyId ?? "",
    parentCharacterId,
    sourceRunId: record.sourceRunId ?? null,
    nameLabel: record.name || record.characterId,
    statusLabel: formatOutcomeLabel(record),
    lineageLabel: record.lineageId,
    lastSeenAt: record.lastSeenAt,
    isRoot,
    parentKnown,
    authorityNoteLabel:
      record.sourceRunId && !parentKnown
        ? "Source run is recorded, but it is not treated as a family relation here."
        : null
  };
}

function createPrestigeSummary(
  profile: AccountProfileState | null | undefined,
  familyId: string
): BloodlinesPrestigeSummaryViewModel {
  const totals = resolveFamilyPrestigeTotals(profile?.families ?? EMPTY_FAMILY_STATE, familyId);
  const categorySummaries = Object.entries(totals.byCategory)
    .map(([categoryTag, categoryTotals]) => ({
      categoryTag: categoryTag as FamilyPrestigeCategoryTag,
      label: CATEGORY_LABELS[categoryTag as FamilyPrestigeCategoryTag],
      earned: categoryTotals?.earned ?? 0,
      spent: categoryTotals?.spent ?? 0,
      available: categoryTotals?.available ?? 0,
      earnedLabel: formatCount(categoryTotals?.earned ?? 0),
      spentLabel: formatCount(categoryTotals?.spent ?? 0),
      availableLabel: formatCount(categoryTotals?.available ?? 0)
    }))
    .sort((left, right) => left.label.localeCompare(right.label));

  return {
    earned: totals.earned,
    spent: totals.spent,
    available: totals.available,
    earnedLabel: formatCount(totals.earned),
    spentLabel: formatCount(totals.spent),
    availableLabel: formatCount(totals.available),
    categorySummaries
  };
}

function createFamilySummary(
  profile: AccountProfileState | null | undefined,
  family: AccountFamilyRecord,
  runRecords: AccountRunHistoryRecord[]
): BloodlinesFamilySummaryViewModel {
  const linkedRuns = runRecords
    .filter((record) => record.familyId === family.familyId)
    .slice()
    .sort(sortRunsByActivity);
  const linkedCharacterIds = new Set(linkedRuns.map((record) => record.characterId));
  const runSummaries = linkedRuns.map((record) =>
    createRunSummary(record, family, linkedCharacterIds)
  );
  const rootRun = family.rootCharacterId
    ? linkedRuns.find((record) => record.characterId === family.rootCharacterId) ?? null
    : null;
  const rootSummary = rootRun
    ? createRunSummary(rootRun, family, linkedCharacterIds)
    : null;
  const unresolvedMemberIds = family.memberCharacterIds.filter(
    (characterId) => !linkedCharacterIds.has(characterId)
  );
  const latestKnownActivityAt =
    linkedRuns.map(resolveRunActivityTimestamp).find((value) => value !== null) ?? null;
  const prestige = createPrestigeSummary(profile, family.familyId);
  const unlocks = listFamilyUnlocks(profile?.families ?? EMPTY_FAMILY_STATE, family.familyId)
    .map((unlock) => ({
      unlockId: unlock.unlockId,
      rank: unlock.rank ?? null,
      unlockedAt: unlock.unlockedAt,
      sourceTransactionId: unlock.sourceTransactionId
    }))
    .sort(
      (left, right) =>
        parseTimestamp(right.unlockedAt) - parseTimestamp(left.unlockedAt) ||
        left.unlockId.localeCompare(right.unlockId)
    );
  const warnings = [
    ...(family.rootCharacterId && !rootRun ? ["Root character record is not available."] : []),
    ...(!family.rootCharacterId ? ["Root character is not recorded."] : []),
    ...(unresolvedMemberIds.length > 0 ? ["Some family members do not have linked run records."] : [])
  ];

  return {
    familyId: family.familyId,
    familyName: family.familyName || family.familyId,
    status: family.status,
    statusLabel: STATUS_LABELS[family.status],
    rootCharacterId: family.rootCharacterId,
    rootLabel: rootSummary?.nameLabel ?? "Unrecorded root",
    memberCount: family.memberCharacterIds.length,
    memberCountLabel: formatCount(family.memberCharacterIds.length),
    memberCharacterIds: [...family.memberCharacterIds],
    knownRunCount: linkedRuns.length,
    knownRunCountLabel: formatCount(linkedRuns.length),
    latestKnownActivityAt,
    latestKnownActivityLabel: latestKnownActivityAt ?? "No linked run activity",
    prestige,
    unlocks,
    unlockCountLabel: formatCount(unlocks.length),
    tree: {
      root: rootSummary,
      linkedRuns: runSummaries,
      unlinkedRuns: runSummaries.filter((summary) => !summary.isRoot && !summary.parentKnown),
      unresolvedMemberIds,
      missingRootLabel: rootSummary ? null : "Root character is not linked to a current run record"
    },
    warnings
  };
}

function sortFamilies(
  left: BloodlinesFamilySummaryViewModel,
  right: BloodlinesFamilySummaryViewModel
): number {
  return (
    STATUS_ORDER[left.status] - STATUS_ORDER[right.status] ||
    Number(right.prestige.available > 0) - Number(left.prestige.available > 0) ||
    parseTimestamp(right.latestKnownActivityAt) - parseTimestamp(left.latestKnownActivityAt) ||
    left.familyName.localeCompare(right.familyName) ||
    left.familyId.localeCompare(right.familyId)
  );
}

export function buildBloodlinesViewModel(
  profile: AccountProfileState | null | undefined
): BloodlinesViewModel {
  const families = (profile?.families.families ?? [])
    .map((family) => createFamilySummary(profile, family, profile?.history.runRecords ?? []))
    .sort(sortFamilies);
  const linkedRunCount = families.reduce((total, family) => total + family.knownRunCount, 0);
  const withPrestigeCount = families.filter((family) => family.prestige.available > 0).length;
  const statusCount = (status: AccountFamilyStatus) =>
    families.filter((family) => family.status === status).length;

  return {
    hasFamilies: families.length > 0,
    emptyLabel: families.length > 0 ? null : "No Bloodline records yet.",
    noteLabel:
      "Bloodlines summarize explicit family records, Family Prestige ledger totals, family unlocks, and linked run history.",
    summaryStats: [
      {
        id: "families",
        label: "Families",
        value: families.length,
        valueLabel: formatCount(families.length)
      },
      {
        id: "active",
        label: "Active",
        value: statusCount("active"),
        valueLabel: formatCount(statusCount("active"))
      },
      {
        id: "dormant",
        label: "Dormant",
        value: statusCount("dormant"),
        valueLabel: formatCount(statusCount("dormant"))
      },
      {
        id: "closed",
        label: "Closed",
        value: statusCount("closed"),
        valueLabel: formatCount(statusCount("closed"))
      },
      {
        id: "with_prestige",
        label: "With Prestige",
        value: withPrestigeCount,
        valueLabel: formatCount(withPrestigeCount)
      },
      {
        id: "linked_runs",
        label: "Linked Runs",
        value: linkedRunCount,
        valueLabel: formatCount(linkedRunCount)
      }
    ],
    families,
    inactiveSections: INACTIVE_SECTIONS.map((section) => ({
      ...section,
      actionIds: []
    })),
    actionIds: []
  };
}
