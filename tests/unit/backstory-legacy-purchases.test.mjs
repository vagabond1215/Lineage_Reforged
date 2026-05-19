import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createDefaultAccountProfileState,
  resolveOwnedBackstoryLegacyPurchaseIds
} from "../../packages/engines/game-engine/src/index.ts";

function createDefinition(id, { scope = "account", tags = ["backstory_legacy"] } = {}) {
  return {
    id,
    scope,
    tags
  };
}

function createFamilyRecord(familyId) {
  return {
    familyId,
    familyName: `${familyId} Line`,
    rootCharacterId: null,
    status: "active",
    createdAt: "2026-05-19T12:00:00.000Z",
    updatedAt: "2026-05-19T12:00:00.000Z",
    memberCharacterIds: [],
    notes: []
  };
}

function createFamilyTransaction(transactionId, familyId) {
  return {
    transactionId,
    familyId,
    kind: "spend",
    amount: 1,
    categoryTag: "household_lineage",
    sourceType: "test",
    sourceId: `test.${transactionId}`,
    recordedAt: "2026-05-19T12:05:00.000Z",
    summary: "Family unlock purchase source."
  };
}

function createFamilyUnlock(unlockId, familyId, sourceTransactionId) {
  return {
    unlockId,
    familyId,
    unlockedAt: "2026-05-19T12:10:00.000Z",
    sourceTransactionId
  };
}

function createAccountUnlock(unlockId) {
  return {
    unlockId,
    unlockedAt: "2026-05-19T12:10:00.000Z",
    sourceTransactionId: "legacy.transaction.test.1"
  };
}

test("Backstory Legacy purchase helper includes account-owned backstory-tagged definitions", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [
        createAccountUnlock("legacy.backstory.street_vendor"),
        createAccountUnlock("legacy.unlock.account.starting_hp")
      ]
    }
  };
  const resolution = resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: [
      createDefinition("legacy.backstory.street_vendor", { tags: ["backstory"] }),
      createDefinition("legacy.unlock.account.starting_hp", { tags: ["starter"] })
    ]
  });

  assert.deepEqual(resolution.legacyPurchaseIds, ["legacy.backstory.street_vendor"]);
  assert.deepEqual(resolution.accountUnlockIds, ["legacy.backstory.street_vendor"]);
  assert.deepEqual(resolution.familyUnlockIds, []);
  assert.deepEqual(resolution.unsupportedScopeUnlockIds, []);
});

test("Backstory Legacy purchase helper includes family-owned definitions only for matching family id", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    families: {
      families: [createFamilyRecord("family.arden"), createFamilyRecord("family.mira")],
      prestigeTransactions: [
        createFamilyTransaction("family.transaction.arden.1", "family.arden"),
        createFamilyTransaction("family.transaction.mira.1", "family.mira")
      ],
      familyUnlocks: [
        createFamilyUnlock(
          "legacy.backstory.militia_levy",
          "family.arden",
          "family.transaction.arden.1"
        ),
        createFamilyUnlock(
          "legacy.backstory.gatherer",
          "family.mira",
          "family.transaction.mira.1"
        )
      ]
    }
  };
  const definitions = [
    createDefinition("legacy.backstory.militia_levy", { scope: "family" }),
    createDefinition("legacy.backstory.gatherer", { scope: "family" })
  ];

  assert.deepEqual(
    resolveOwnedBackstoryLegacyPurchaseIds({
      profile,
      legacyUnlockDefinitions: definitions,
      familyId: "family.arden"
    }).legacyPurchaseIds,
    ["legacy.backstory.militia_levy"]
  );
  const withoutFamily = resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: definitions
  });

  assert.deepEqual(withoutFamily.legacyPurchaseIds, []);
  assert.deepEqual(withoutFamily.familyUnlockIds, []);
  assert.equal(withoutFamily.warnings.length, 2);
});

test("Backstory Legacy purchase helper excludes non-backstory Legacy unlocks", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [createAccountUnlock("legacy.unlock.account.starting_hp")]
    }
  };
  const resolution = resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: [
      createDefinition("legacy.unlock.account.starting_hp", { tags: ["starter"] })
    ]
  });

  assert.deepEqual(resolution.legacyPurchaseIds, []);
  assert.deepEqual(resolution.accountUnlockIds, []);
});

test("Backstory Legacy purchase helper treats unsupported scopes conservatively", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [createAccountUnlock("legacy.backstory.local_champion")]
    }
  };
  const resolution = resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: [
      createDefinition("legacy.backstory.local_champion", {
        scope: "region",
        tags: ["backstory_legacy"]
      })
    ],
    regionId: "region.aurelia"
  });

  assert.deepEqual(resolution.legacyPurchaseIds, []);
  assert.deepEqual(resolution.unsupportedScopeUnlockIds, [
    "legacy.backstory.local_champion"
  ]);
  assert.match(resolution.warnings.join("\n"), /regional scoped purchase storage/);
});

test("Backstory Legacy purchase helper does not mutate input", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [createAccountUnlock("legacy.backstory.street_vendor")]
    }
  };
  const definitions = [
    createDefinition("legacy.backstory.street_vendor", { tags: ["origin"] })
  ];
  const before = structuredClone({ profile, definitions });

  resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: definitions
  });

  assert.deepEqual({ profile, definitions }, before);
});

test("Backstory Legacy purchase runtime code does not import planning metadata or draft catalogs", () => {
  const source = readFileSync(
    "packages/engines/game-engine/src/backstory-legacy-purchases.ts",
    "utf8"
  );

  assert.doesNotMatch(source, /docs[\\/]+design/);
  assert.doesNotMatch(source, /backstory-policy-metadata/);
  assert.doesNotMatch(source, /legacy-upgrade-catalog-draft/);
  assert.doesNotMatch(source, /futureBackstoryLaneDrafts/);
  assert.doesNotMatch(source, /legacy_unlocks\.json/);
});

test("Backstory Legacy purchase helper is not wired into resolver or creator code", () => {
  const files = [
    "packages/engines/game-engine/src/backstory-eligibility.ts",
    "packages/engines/game-engine/src/backstory-eligibility-policy.ts",
    "apps/rpg-ui/src/game-shell/characterCreationCatalog.ts",
    "apps/rpg-ui/src/game-shell/characterCreationForm.ts",
    "apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx"
  ];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /backstory-legacy-purchases/);
    assert.doesNotMatch(source, /resolveOwnedBackstoryLegacyPurchaseIds/);
  }
});

test("Backstory Legacy purchase helper does not introduce compatibility rescue states", () => {
  const source = readFileSync(
    "packages/engines/game-engine/src/backstory-legacy-purchases.ts",
    "utf8"
  );

  assert.doesNotMatch(source, /\balias\b/i);
  assert.doesNotMatch(source, /\bretired\b/i);
  assert.doesNotMatch(source, /\bconverted\b/i);
  assert.doesNotMatch(source, /\bmigration\b/i);
});
