import test from "node:test";
import assert from "node:assert/strict";
import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/index.ts";
import { buildBloodlinesViewModel } from "../../apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts";

function createFamily(overrides = {}) {
  return {
    familyId: "family.voss",
    familyName: "Voss Line",
    rootCharacterId: "player.arden_voss",
    status: "active",
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-05-01T10:00:00.000Z",
    memberCharacterIds: ["player.arden_voss"],
    notes: [],
    ...overrides
  };
}

function createRun(overrides = {}) {
  return {
    characterId: "player.arden_voss",
    name: "Arden Voss",
    lineageId: "lineage.human",
    familyId: "family.voss",
    startingContinentId: "continent.kaelvar",
    startingRegionId: "region.aurelia",
    startingSettlementId: "settlement.aurelis",
    startedAt: "2026-05-01T10:00:00.000Z",
    endedAt: "2026-05-01T11:00:00.000Z",
    lastSeenAt: "2026-05-01T11:00:00.000Z",
    outcome: "archived",
    archiveReason: "retired",
    echoLevelReached: 5,
    notableCharacterAchievementIds: [],
    saveSlotIds: [],
    ...overrides
  };
}

function createPrestigeTransaction(overrides = {}) {
  return {
    transactionId: "family.prestige.transaction.voss.1",
    familyId: "family.voss",
    kind: "grant",
    amount: 5,
    categoryTag: "renown",
    sourceType: "test",
    sourceId: "test.voss",
    recordedAt: "2026-05-01T11:00:00.000Z",
    summary: "Family prestige recorded for projection tests.",
    ...overrides
  };
}

function createFamilyUnlock(overrides = {}) {
  return {
    unlockId: "legacy.backstory.militia_levy",
    familyId: "family.voss",
    unlockedAt: "2026-05-01T12:00:00.000Z",
    sourceTransactionId: "family.prestige.transaction.voss.1",
    ...overrides
  };
}

function createProfile({ families = [], prestigeTransactions = [], familyUnlocks = [], runRecords = [] } = {}) {
  return {
    ...createDefaultAccountProfileState({
      accountId: "account.local.bloodlines_projection",
      displayName: "Bloodlines Projection"
    }),
    families: {
      families,
      prestigeTransactions,
      familyUnlocks
    },
    history: {
      runRecords
    }
  };
}

test("empty/default account profile returns a safe empty Bloodlines state", () => {
  const viewModel = buildBloodlinesViewModel(createDefaultAccountProfileState());

  assert.equal(viewModel.hasFamilies, false);
  assert.equal(viewModel.emptyLabel, "No Bloodline records yet.");
  assert.deepEqual(viewModel.families, []);
  assert.deepEqual(viewModel.actionIds, []);
  assert.equal(viewModel.inactiveSections.length > 0, true);
  assert.equal(
    viewModel.inactiveSections.every(
      (section) => section.stateLabel === "Inactive" && section.actionIds.length === 0
    ),
    true
  );
});

test("one family returns identity, status, root, and member summary fields", () => {
  const profile = createProfile({
    families: [createFamily()],
    runRecords: [createRun()]
  });

  const [family] = buildBloodlinesViewModel(profile).families;

  assert.equal(family.familyId, "family.voss");
  assert.equal(family.familyName, "Voss Line");
  assert.equal(family.status, "active");
  assert.equal(family.statusLabel, "Active");
  assert.equal(family.rootCharacterId, "player.arden_voss");
  assert.equal(family.rootLabel, "Arden Voss");
  assert.equal(family.memberCount, 1);
  assert.deepEqual(family.memberCharacterIds, ["player.arden_voss"]);
  assert.equal(family.knownRunCount, 1);
  assert.equal(family.latestKnownActivityAt, "2026-05-01T11:00:00.000Z");
});

test("multiple families are listed deterministically", () => {
  const profile = createProfile({
    families: [
      createFamily({
        familyId: "family.c",
        familyName: "Cedar Line",
        status: "closed",
        rootCharacterId: null,
        memberCharacterIds: []
      }),
      createFamily({
        familyId: "family.b",
        familyName: "Briar Line",
        status: "active",
        rootCharacterId: null,
        memberCharacterIds: []
      }),
      createFamily({
        familyId: "family.a",
        familyName: "Ash Line",
        status: "active",
        rootCharacterId: null,
        memberCharacterIds: []
      }),
      createFamily({
        familyId: "family.d",
        familyName: "Dusk Line",
        status: "dormant",
        rootCharacterId: null,
        memberCharacterIds: []
      })
    ]
  });

  assert.deepEqual(
    buildBloodlinesViewModel(profile).families.map((family) => family.familyId),
    ["family.a", "family.b", "family.d", "family.c"]
  );
});

test("Family Prestige totals use existing grant and spend ledger semantics", () => {
  const profile = createProfile({
    families: [createFamily()],
    prestigeTransactions: [
      createPrestigeTransaction({
        transactionId: "family.prestige.transaction.voss.grant.1",
        kind: "grant",
        amount: 12,
        categoryTag: "renown"
      }),
      createPrestigeTransaction({
        transactionId: "family.prestige.transaction.voss.spend.1",
        kind: "spend",
        amount: 5,
        categoryTag: "renown"
      }),
      createPrestigeTransaction({
        transactionId: "family.prestige.transaction.other.grant.1",
        familyId: "family.other",
        kind: "grant",
        amount: 20,
        categoryTag: "martial"
      })
    ]
  });

  const [family] = buildBloodlinesViewModel(profile).families;

  assert.equal(family.prestige.earned, 12);
  assert.equal(family.prestige.spent, 5);
  assert.equal(family.prestige.available, 7);
  assert.deepEqual(family.prestige.categorySummaries, [
    {
      categoryTag: "renown",
      label: "Renown",
      earned: 12,
      spent: 5,
      available: 7,
      earnedLabel: "12",
      spentLabel: "5",
      availableLabel: "7"
    }
  ]);
});

test("family unlock summaries stay scoped to their owning family", () => {
  const profile = createProfile({
    families: [
      createFamily(),
      createFamily({
        familyId: "family.other",
        familyName: "Other Line",
        rootCharacterId: null,
        memberCharacterIds: []
      })
    ],
    familyUnlocks: [
      createFamilyUnlock({
        unlockId: "legacy.backstory.militia_levy",
        familyId: "family.voss",
        rank: 1
      }),
      createFamilyUnlock({
        unlockId: "legacy.backstory.kitchen_hand",
        familyId: "family.other",
        sourceTransactionId: "family.prestige.transaction.other.1"
      })
    ]
  });

  const families = buildBloodlinesViewModel(profile).families;
  const voss = families.find((family) => family.familyId === "family.voss");
  const other = families.find((family) => family.familyId === "family.other");

  assert.deepEqual(voss.unlocks.map((unlock) => unlock.unlockId), [
    "legacy.backstory.militia_levy"
  ]);
  assert.deepEqual(other.unlocks.map((unlock) => unlock.unlockId), [
    "legacy.backstory.kitchen_hand"
  ]);
});

test("run-history links are included only from explicit familyId data", () => {
  const profile = createProfile({
    families: [createFamily()],
    runRecords: [
      createRun(),
      createRun({
        characterId: "player.unrelated_source",
        name: "Unrelated Source",
        familyId: undefined,
        sourceRunId: "player.arden_voss::2026-05-01T10:00:00.000Z"
      })
    ]
  });

  const [family] = buildBloodlinesViewModel(profile).families;

  assert.equal(family.knownRunCount, 1);
  assert.deepEqual(
    family.tree.linkedRuns.map((run) => run.characterId),
    ["player.arden_voss"]
  );
});

test("sourceRunId alone does not create a parent or family relation", () => {
  const profile = createProfile({
    families: [
      createFamily({
        memberCharacterIds: ["player.arden_voss", "player.mira_voss"]
      })
    ],
    runRecords: [
      createRun(),
      createRun({
        characterId: "player.mira_voss",
        name: "Mira Voss",
        familyId: "family.voss",
        sourceRunId: "player.arden_voss::2026-05-01T10:00:00.000Z",
        parentCharacterId: undefined,
        startedAt: "2026-05-02T10:00:00.000Z",
        endedAt: "2026-05-02T11:00:00.000Z",
        lastSeenAt: "2026-05-02T11:00:00.000Z"
      })
    ]
  });

  const [family] = buildBloodlinesViewModel(profile).families;
  const mira = family.tree.linkedRuns.find((run) => run.characterId === "player.mira_voss");

  assert.equal(mira.parentKnown, false);
  assert.equal(
    mira.authorityNoteLabel,
    "Source run is recorded, but it is not treated as a family relation here."
  );
  assert.deepEqual(
    family.tree.unlinkedRuns.map((run) => run.characterId),
    ["player.mira_voss"]
  );
});

test("lineageId is never treated as familyId", () => {
  const profile = createProfile({
    families: [
      createFamily({
        familyId: "lineage.human",
        familyName: "Human Line",
        rootCharacterId: null,
        memberCharacterIds: []
      })
    ],
    runRecords: [
      createRun({
        characterId: "player.lineage_only",
        name: "Lineage Only",
        lineageId: "lineage.human",
        familyId: undefined
      })
    ]
  });

  const [family] = buildBloodlinesViewModel(profile).families;

  assert.equal(family.familyId, "lineage.human");
  assert.equal(family.knownRunCount, 0);
  assert.deepEqual(family.tree.linkedRuns, []);
});

test("missing root, member, and run data produces safe unknown output", () => {
  const profile = createProfile({
    families: [
      createFamily({
        rootCharacterId: "player.missing_root",
        memberCharacterIds: ["player.missing_root", "player.missing_member"]
      })
    ]
  });

  const [family] = buildBloodlinesViewModel(profile).families;

  assert.equal(family.rootLabel, "Unrecorded root");
  assert.equal(family.tree.root, null);
  assert.deepEqual(family.tree.unresolvedMemberIds, [
    "player.missing_root",
    "player.missing_member"
  ]);
  assert.deepEqual(family.warnings, [
    "Root character record is not available.",
    "Some family members do not have linked run records."
  ]);
});

test("inactive future-system sections are read-only and expose no action ids", () => {
  const viewModel = buildBloodlinesViewModel(createProfile({ families: [createFamily()] }));

  assert.deepEqual(
    viewModel.inactiveSections.map((section) => [section.id, section.stateLabel, section.actionIds]),
    [
      ["heirs", "Inactive", []],
      ["heirlooms", "Inactive", []],
      ["bequests", "Inactive", []],
      ["family_management", "Inactive", []],
      ["family_prestige_spending", "Inactive", []]
    ]
  );
});

test("Bloodlines projection does not create Backstory Eligibility evidence", () => {
  const viewModel = buildBloodlinesViewModel(
    createProfile({
      families: [createFamily()],
      familyUnlocks: [createFamilyUnlock({ unlockId: "legacy.backstory.street_vendor" })]
    })
  );

  assert.equal(JSON.stringify(viewModel).includes("legacyPurchaseIds"), false);
  assert.equal(Object.hasOwn(viewModel, "backstoryEvidence"), false);
});

test("Bloodlines projection exposes no purchase, spend, claim, register, or transfer action metadata", () => {
  const viewModel = buildBloodlinesViewModel(createProfile({ families: [createFamily()] }));
  const serialized = JSON.stringify(viewModel);

  assert.deepEqual(viewModel.actionIds, []);
  for (const forbiddenActionKey of [
    "purchaseActionId",
    "spendActionId",
    "claimActionId",
    "registerActionId",
    "transferActionId",
    "commandId"
  ]) {
    assert.equal(serialized.includes(forbiddenActionKey), false);
  }
});
