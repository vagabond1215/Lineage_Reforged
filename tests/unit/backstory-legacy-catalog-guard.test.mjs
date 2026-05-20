import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createDefaultAccountProfileState,
  getLegacyUnlockDefinitions,
  isBackstoryLegacyUnlockDefinition,
  isNonLiveBackstoryLegacyUnlockDefinition,
  purchaseLegacyUnlock,
  resolveOwnedBackstoryLegacyPurchaseIds
} from "../../packages/engines/game-engine/src/index.ts";
import { buildAccountMetaViewModel } from "../../apps/rpg-ui/src/game-shell/accountMetaPresentation.ts";

const LIVE_BACKSTORY_PURCHASES = [
  {
    id: "legacy.backstory.street_vendor",
    targetBackstoryId: "backstory.street_vendor",
    title: "Market-Learned Habits"
  },
  {
    id: "legacy.backstory.net_tender",
    targetBackstoryId: "backstory.net_tender",
    title: "Water-Work Lessons"
  },
  {
    id: "legacy.backstory.gatherer",
    targetBackstoryId: "backstory.gatherer",
    title: "Field-Gathering Habits"
  },
  {
    id: "legacy.backstory.scribes_apprentice",
    targetBackstoryId: "backstory.scribes_apprentice",
    title: "Records-Room Training"
  },
  {
    id: "legacy.backstory.kitchen_hand",
    targetBackstoryId: "backstory.kitchen_hand",
    title: "Kitchen-Service Discipline"
  }
];
const LIVE_BACKSTORY_PURCHASE_IDS = LIVE_BACKSTORY_PURCHASES.map((record) => record.id);
const PLAYER_COPY_FORBIDDEN_PATTERN =
  /\b(future|low-risk|account-level|support purchase|purchase|eligibility|runtime|resolver|catalog|draft-only|draft_only|guardrail)\b/i;
const PAST_SHAPING_PATTERN =
  /\b(shaped|learned|trained|raised|worked|served|endured|practiced)\b/i;
const CURRENT_IDENTITY_PATTERN =
  /\b(currently|present employment|present obligation|current job|current identity|owned status|is a vendor|is a net-tender|is a gatherer|is a scribe|is a kitchen hand)\b/i;

function createProfileWithPrestige(amount = 10) {
  const profile = createDefaultAccountProfileState();

  return {
    ...profile,
    legacy: {
      ...profile.legacy,
      legacyPoints: amount,
      lifetimeLegacyEarned: amount
    }
  };
}

function createAccountUnlock(unlockId) {
  return {
    unlockId,
    unlockedAt: "2026-05-20T12:00:00.000Z",
    sourceTransactionId: "legacy.transaction.test.guard"
  };
}

function createDefinition(
  id,
  {
    tags = ["backstory_legacy"],
    implementationPriority = "live",
    scope = "account",
    title = "Catalog Guard Fixture"
  } = {}
) {
  return {
    id,
    category: "Chronicle",
    kind: "binary",
    classification: "permanent",
    purchaseMode: "unlock_only",
    currency: "account_legacy",
    scope,
    duration: "permanent",
    implementationPriority,
    title,
    description: "Fixture definition used to prove Backstory Legacy catalog guards.",
    cost: {
      type: "fixed",
      amount: 1
    },
    requirements: [],
    effects: [
      {
        type: "account_flag",
        key: id.replaceAll(".", "_"),
        value: true
      }
    ],
    tags
  };
}

test("live Backstory Legacy records are explicit account-scoped catalog entries", () => {
  const definitionsById = new Map(
    getLegacyUnlockDefinitions().map((definition) => [definition.id, definition])
  );

  for (const record of LIVE_BACKSTORY_PURCHASES) {
    const definition = definitionsById.get(record.id);

    assert.ok(definition, `${record.id} should exist in the live Legacy catalog`);
    assert.equal(definition.title, record.title, record.id);
    assert.equal(definition.kind, "binary", record.id);
    assert.equal(definition.classification, "permanent", record.id);
    assert.equal(definition.purchaseMode, "unlock_only", record.id);
    assert.equal(definition.currency, "account_legacy", record.id);
    assert.equal(definition.scope, "account", record.id);
    assert.equal(definition.duration, "permanent", record.id);
    assert.equal(definition.implementationPriority, "live", record.id);
    assert.equal(definition.cost.type, "fixed", record.id);
    assert.equal(definition.cost.amount, 2, record.id);
    assert.deepEqual(definition.requirements, [
      {
        type: "lifetime_legacy",
        amount: 1
      }
    ]);
    assert.ok(definition.tags?.includes("backstory"), record.id);
    assert.ok(definition.tags?.includes("backstory_legacy"), record.id);
    assert.equal(isBackstoryLegacyUnlockDefinition(definition), true, record.id);
    assert.equal(isNonLiveBackstoryLegacyUnlockDefinition(definition), false, record.id);
    assert.deepEqual(definition.effects, [
      {
        type: "account_flag",
        key: record.id,
        value: true
      }
    ]);
    assert.doesNotMatch(definition.title, PLAYER_COPY_FORBIDDEN_PATTERN, record.id);
    assert.doesNotMatch(definition.description, PLAYER_COPY_FORBIDDEN_PATTERN, record.id);
    assert.doesNotMatch(definition.title, CURRENT_IDENTITY_PATTERN, record.id);
    assert.doesNotMatch(definition.description, CURRENT_IDENTITY_PATTERN, record.id);
    assert.match(definition.description, PAST_SHAPING_PATTERN, record.id);
  }
});

test("live Backstory Legacy records appear as ordinary account-meta purchase entries", () => {
  const viewModel = buildAccountMetaViewModel(createProfileWithPrestige(20));
  const entriesById = new Map(viewModel.legacy.unlockEntries.map((entry) => [entry.id, entry]));

  for (const unlockId of LIVE_BACKSTORY_PURCHASE_IDS) {
    const entry = entriesById.get(unlockId);

    assert.ok(entry, `${unlockId} should appear in account meta`);
    assert.equal(entry.catalogCanPurchase, true, unlockId);
    assert.equal(entry.purchaseBlockedReason, null, unlockId);
  }
});

test("live Backstory Legacy records can be purchased as account-owned unlocks", () => {
  for (const unlockId of LIVE_BACKSTORY_PURCHASE_IDS) {
    const result = purchaseLegacyUnlock(
      createProfileWithPrestige(20),
      unlockId,
      "2026-05-20T13:00:00.000Z"
    );

    assert.equal(result.ok, true, unlockId);
    assert.equal(result.unlock.unlockId, unlockId);
    assert.equal(result.profile.legacy.legacyUnlocks.some((unlock) => unlock.unlockId === unlockId), true);
    assert.deepEqual(result.profile.families.familyUnlocks, []);
  }
});

test("owned live Backstory Legacy records resolve as account purchase evidence", () => {
  let profile = createProfileWithPrestige(20);

  for (const unlockId of LIVE_BACKSTORY_PURCHASE_IDS) {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-05-20T13:${profile.legacy.legacyTransactions.length
        .toString()
        .padStart(2, "0")}:00.000Z`
    );

    assert.equal(purchased.ok, true, unlockId);
    profile = purchased.profile;
  }

  const resolution = resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: getLegacyUnlockDefinitions()
  });

  assert.deepEqual(resolution.legacyPurchaseIds, LIVE_BACKSTORY_PURCHASE_IDS);
  assert.deepEqual(resolution.accountUnlockIds, LIVE_BACKSTORY_PURCHASE_IDS);
  assert.deepEqual(resolution.familyUnlockIds, []);
  assert.deepEqual(resolution.unsupportedScopeUnlockIds, []);
  assert.deepEqual(resolution.warnings, []);
});

test("Backstory Legacy catalog-only and backlog definitions are not ordinary account-meta purchase entries", () => {
  const definitions = [
    createDefinition("legacy.backstory.catalog_only", {
      implementationPriority: "catalog_only",
      title: "Catalog-Only Backstory"
    }),
    createDefinition("legacy.backstory.backlog", {
      implementationPriority: "backlog",
      title: "Backlog Backstory"
    })
  ];
  const viewModel = buildAccountMetaViewModel(createProfileWithPrestige(), {
    legacyUnlockDefinitions: definitions
  });
  const entriesById = new Map(viewModel.legacy.unlockEntries.map((entry) => [entry.id, entry]));
  const purchaseEntryIds = viewModel.legacy.unlockEntries
    .filter((entry) => entry.catalogCanPurchase)
    .map((entry) => entry.id);

  for (const definition of definitions) {
    assert.equal(entriesById.has(definition.id), false, definition.id);
    assert.equal(purchaseEntryIds.includes(definition.id), false, definition.id);
  }
});

test("Backstory Legacy catalog-only and backlog definitions cannot be purchased", () => {
  const definitions = [
    createDefinition("legacy.backstory.catalog_only", {
      implementationPriority: "catalog_only"
    }),
    createDefinition("legacy.backstory.backlog", {
      implementationPriority: "backlog"
    })
  ];
  const profile = createProfileWithPrestige();

  for (const definition of definitions) {
    const result = purchaseLegacyUnlock(
      profile,
      definition.id,
      "2026-05-20T12:15:00.000Z",
      definitions
    );

    assert.equal(result.ok, false, definition.id);
    assert.equal(result.error, "non_live_backstory_unlock", definition.id);
  }
});

test("non-live Backstory Legacy definitions do not become resolver purchase evidence when owned", () => {
  const definitions = [
    createDefinition("legacy.backstory.catalog_only", {
      implementationPriority: "catalog_only"
    }),
    createDefinition("legacy.backstory.backlog", {
      implementationPriority: "backlog"
    })
  ];
  const profile = {
    ...createProfileWithPrestige(),
    legacy: {
      ...createProfileWithPrestige().legacy,
      legacyUnlocks: definitions.map((definition) => createAccountUnlock(definition.id))
    }
  };
  const resolution = resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: definitions
  });

  assert.deepEqual(resolution.legacyPurchaseIds, []);
  assert.deepEqual(resolution.accountUnlockIds, []);
  assert.deepEqual(resolution.familyUnlockIds, []);
  assert.deepEqual(resolution.unsupportedScopeUnlockIds, [
    "legacy.backstory.catalog_only",
    "legacy.backstory.backlog"
  ]);
  assert.match(resolution.warnings.join("\n"), /not live/);
});

test("Backstory Legacy guard requires live implementation priority", () => {
  assert.equal(
    isBackstoryLegacyUnlockDefinition({ tags: ["origin"] }),
    true
  );
  assert.equal(
    isNonLiveBackstoryLegacyUnlockDefinition({
      tags: ["backstory"],
      implementationPriority: "catalog_only"
    }),
    true
  );
  assert.equal(
    isNonLiveBackstoryLegacyUnlockDefinition({
      tags: ["backstory_legacy"],
      implementationPriority: "backlog"
    }),
    true
  );
  assert.equal(
    isNonLiveBackstoryLegacyUnlockDefinition({
      tags: ["origin"]
    }),
    true
  );
  assert.equal(
    isNonLiveBackstoryLegacyUnlockDefinition({
      tags: ["backstory"],
      implementationPriority: "live"
    }),
    false
  );
  assert.equal(
    isNonLiveBackstoryLegacyUnlockDefinition({
      tags: ["starter"],
      implementationPriority: "catalog_only"
    }),
    false
  );
});

test("non-backstory Legacy presentation and purchase behavior are unchanged", () => {
  const definition = createDefinition("legacy.test.catalog_only.utility", {
    tags: ["utility"],
    implementationPriority: "catalog_only",
    title: "Utility Fixture"
  });
  const profile = createProfileWithPrestige();
  const viewModel = buildAccountMetaViewModel(profile, {
    legacyUnlockDefinitions: [definition]
  });
  const entry = viewModel.legacy.unlockEntries.find(
    (candidate) => candidate.id === definition.id
  );
  const purchased = purchaseLegacyUnlock(
    profile,
    definition.id,
    "2026-05-20T12:20:00.000Z",
    [definition]
  );

  assert.ok(entry);
  assert.equal(entry.catalogCanPurchase, true);
  assert.equal(entry.purchaseBlockedReason, null);
  assert.equal(purchased.ok, true);
  assert.equal(purchased.unlock.unlockId, definition.id);
});

test("Backstory Legacy catalog guard code does not import design docs or draft catalogs", () => {
  const sourceFiles = [
    "packages/engines/game-engine/src/legacy-unlocks.ts",
    "packages/engines/game-engine/src/backstory-legacy-purchases.ts",
    "apps/rpg-ui/src/game-shell/accountMetaPresentation.ts"
  ];

  for (const sourceFile of sourceFiles) {
    const source = readFileSync(sourceFile, "utf8");

    assert.doesNotMatch(source, /docs[\\/]+design/, sourceFile);
    assert.doesNotMatch(source, /backstory-legacy-purchase-content-draft/, sourceFile);
    assert.doesNotMatch(source, /legacy-upgrade-catalog-draft/, sourceFile);
    assert.doesNotMatch(source, /backstory-policy-metadata/, sourceFile);
  }
});
