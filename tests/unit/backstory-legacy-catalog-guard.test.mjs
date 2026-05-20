import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createDefaultAccountProfileState,
  isBackstoryLegacyUnlockDefinition,
  isNonLiveBackstoryLegacyUnlockDefinition,
  purchaseLegacyUnlock,
  resolveOwnedBackstoryLegacyPurchaseIds
} from "../../packages/engines/game-engine/src/index.ts";
import { buildAccountMetaViewModel } from "../../apps/rpg-ui/src/game-shell/accountMetaPresentation.ts";

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
