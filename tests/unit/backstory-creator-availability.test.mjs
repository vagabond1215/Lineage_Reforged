import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ACCOUNT_ID,
  createDefaultAccountProfileState,
  getLegacyUnlockDefinitions,
  grantLegacy,
  purchaseLegacyUnlock,
  resolveOwnedBackstoryLegacyPurchaseIds
} from "../../packages/engines/game-engine/src/index.ts";
import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getBackstoryOptionsForSelection,
  getBackstoryTemplate,
  getLineageIdentityCatalog,
  isSelectableBackstoryId
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import {
  createNewGameSnapshot
} from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import {
  getDefaultWorldSelection
} from "../../apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts";

const LIVE_BACKSTORY_PURCHASES = [
  {
    unlockId: "legacy.backstory.street_vendor",
    backstoryId: "backstory.street_vendor"
  },
  {
    unlockId: "legacy.backstory.net_tender",
    backstoryId: "backstory.net_tender"
  },
  {
    unlockId: "legacy.backstory.gatherer",
    backstoryId: "backstory.gatherer"
  },
  {
    unlockId: "legacy.backstory.scribes_apprentice",
    backstoryId: "backstory.scribes_apprentice"
  },
  {
    unlockId: "legacy.backstory.kitchen_hand",
    backstoryId: "backstory.kitchen_hand"
  }
];
const LIVE_BACKSTORY_PURCHASE_IDS = LIVE_BACKSTORY_PURCHASES.map(
  (record) => record.unlockId
);
const LIVE_BACKSTORY_TARGET_IDS = LIVE_BACKSTORY_PURCHASES.map(
  (record) => record.backstoryId
);

function createCompleteCharacterForm(backstoryId = "backstory.local") {
  const identity = getLineageIdentityCatalog("lineage.human");
  assert.ok(identity);
  const startingBundleId = "starting_bundle.traveler";
  const world = getDefaultWorldSelection(backstoryId);

  return {
    ...createDefaultCharacterCreationFormState("slot-1"),
    playerName: "Resolver Runner",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId,
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId
  };
}

function byId(options, backstoryId) {
  return options.find((option) => option.id === backstoryId) ?? null;
}

function skillSignature(skills) {
  return skills
    .map((skill) => ({ id: skill.id, rank: skill.rank, source: skill.source }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function grantProfile(amount = 50) {
  const granted = grantLegacy(createDefaultAccountProfileState(), {
    amount,
    summary: "Test Backstory Legacy grant",
    sourceType: "test",
    sourceId: "test.backstory_legacy_grant",
    recordedAt: "2026-05-20T12:00:00.000Z"
  });

  assert.equal(granted.ok, true);
  return granted.profile;
}

function createProfileOwning(unlockIds) {
  let profile = grantProfile();

  unlockIds.forEach((unlockId, index) => {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-05-20T12:${String(index + 1).padStart(2, "0")}:00.000Z`
    );

    assert.equal(purchased.ok, true, unlockId);
    profile = purchased.profile;
  });

  return profile;
}

function createAccountUnlock(unlockId) {
  return {
    unlockId,
    unlockedAt: "2026-05-20T12:10:00.000Z",
    sourceTransactionId: "legacy.transaction.test.backstory_creator"
  };
}

function createFamilyRecord(familyId) {
  return {
    familyId,
    familyName: `${familyId} Line`,
    rootCharacterId: null,
    status: "active",
    createdAt: "2026-05-20T12:00:00.000Z",
    updatedAt: "2026-05-20T12:00:00.000Z",
    memberCharacterIds: [],
    notes: []
  };
}

function createFamilyUnlock(unlockId, familyId) {
  return {
    unlockId,
    familyId,
    unlockedAt: "2026-05-20T12:10:00.000Z",
    sourceTransactionId: `family.transaction.${familyId}.backstory`
  };
}

function createBackstoryLegacyDefinition(
  id,
  { scope = "account", implementationPriority = "live" } = {}
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
    title: "Backstory Legacy Fixture",
    description: "Fixture used by creator availability tests.",
    cost: {
      type: "fixed",
      amount: 1
    },
    requirements: [],
    effects: [
      {
        type: "account_flag",
        key: id,
        value: true
      }
    ],
    tags: ["backstory", "backstory_legacy"]
  };
}

function getOptionsForProfile(profile, extraOptions = {}) {
  return getBackstoryOptionsForSelection("lineage.human", null, {
    ...(profile ? { accountProfile: profile } : {}),
    ...extraOptions
  });
}

function assertTargetAvailability(options, expectedSelectableIds) {
  const expected = new Set(expectedSelectableIds);

  for (const backstoryId of LIVE_BACKSTORY_TARGET_IDS) {
    const option = byId(options, backstoryId);

    assert.ok(option, `${backstoryId} should be resolver-visible`);
    assert.equal(option.selectable, expected.has(backstoryId), backstoryId);
  }
}

test("creator backstory presentation uses resolver projection", () => {
  const options = getBackstoryOptionsForSelection("lineage.human");
  const local = byId(options, "backstory.local");
  const merchant = byId(options, "backstory.merchants_child");
  const hedge = byId(options, "backstory.hedge_adept");
  const localHero = byId(options, "backstory.local_hero");

  assert.ok(local);
  assert.equal(local.availabilityState, "eligible");
  assert.equal(local.selectable, true);
  assert.equal(local.visible, true);
  assert.equal(local.isDefault, true);

  assert.ok(merchant);
  assert.equal(merchant.availabilityState, "locked");
  assert.equal(merchant.selectable, false);
  assert.equal(merchant.visible, true);
  assert.equal(merchant.availabilityBadge, "Locked");
  assert.equal(
    merchant.lockedReason,
    "Requires matching evidence that is not currently available."
  );

  assert.equal(hedge, null);
  assert.ok(localHero);
  assert.equal(localHero.isSpecial, true);
  assert.equal(localHero.selectable, false);
});

test("default records remain visible and selectable without evidence", () => {
  const options = getBackstoryOptionsForSelection("lineage.human");

  for (const backstoryId of [
    "backstory.local",
    "backstory.vagabond",
    "backstory.exile",
    "backstory.farmhand",
    "backstory.amnesiac"
  ]) {
    const option = byId(options, backstoryId);

    assert.ok(option, `${backstoryId} should be visible`);
    assert.equal(option.selectable, true, `${backstoryId} should be selectable`);
    assert.equal(option.isDefault, true, `${backstoryId} should be a default`);
  }
});

test("owned Backstory Legacy targets remain locked when no account profile is supplied", () => {
  const options = getBackstoryOptionsForSelection("lineage.human");

  assertTargetAvailability(options, []);
});

test("each owned account Backstory Legacy purchase unlocks only its target backstory", () => {
  for (const { unlockId, backstoryId } of LIVE_BACKSTORY_PURCHASES) {
    const profile = createProfileOwning([unlockId]);
    const options = getOptionsForProfile(profile);

    assertTargetAvailability(options, [backstoryId]);
    assert.equal(isSelectableBackstoryId(backstoryId, { accountProfile: profile }), true);
  }
});

test("owning all live account Backstory Legacy purchases unlocks all five targets", () => {
  const profile = createProfileOwning(LIVE_BACKSTORY_PURCHASE_IDS);
  const options = getOptionsForProfile(profile);

  assertTargetAvailability(options, LIVE_BACKSTORY_TARGET_IDS);
});

test("non-live Backstory Legacy fixture ownership does not enter creator availability", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [createAccountUnlock("legacy.backstory.street_vendor")]
    }
  };
  const options = getOptionsForProfile(profile, {
    legacyUnlockDefinitions: [
      createBackstoryLegacyDefinition("legacy.backstory.street_vendor", {
        implementationPriority: "catalog_only"
      })
    ]
  });

  assertTargetAvailability(options, []);
});

test("family-owned Backstory Legacy fixtures do not unlock creator availability without family context", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    families: {
      families: [createFamilyRecord("family.arden")],
      prestigeTransactions: [],
      familyUnlocks: [
        createFamilyUnlock("legacy.backstory.street_vendor", "family.arden")
      ]
    }
  };
  const definitions = [
    createBackstoryLegacyDefinition("legacy.backstory.street_vendor", {
      scope: "family"
    })
  ];
  const options = getOptionsForProfile(profile, {
    legacyUnlockDefinitions: definitions
  });
  const wrongFamily = resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: definitions,
    familyId: "family.mira"
  });

  assertTargetAvailability(options, []);
  assert.deepEqual(wrongFamily.legacyPurchaseIds, []);
  assert.deepEqual(wrongFamily.familyUnlockIds, []);
});

test("unsupported Backstory Legacy scopes warn through the ownership helper and stay locked", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [createAccountUnlock("legacy.backstory.street_vendor")]
    }
  };
  const definitions = [
    createBackstoryLegacyDefinition("legacy.backstory.street_vendor", {
      scope: "region"
    })
  ];
  const resolution = resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: definitions,
    regionId: "region.aurelia"
  });
  const options = getOptionsForProfile(profile, {
    legacyUnlockDefinitions: definitions
  });

  assert.deepEqual(resolution.legacyPurchaseIds, []);
  assert.deepEqual(resolution.unsupportedScopeUnlockIds, [
    "legacy.backstory.street_vendor"
  ]);
  assert.match(resolution.warnings.join("\n"), /regional scoped purchase storage/);
  assertTargetAvailability(options, []);
});

test("higher-risk and special backstories remain unchanged with account Backstory Legacy purchases", () => {
  const profile = createProfileOwning(LIVE_BACKSTORY_PURCHASE_IDS);
  const options = getOptionsForProfile(profile);

  for (const backstoryId of [
    "backstory.militia_levy",
    "backstory.drovers_hand",
    "backstory.merchants_child"
  ]) {
    const option = byId(options, backstoryId);

    assert.ok(option, `${backstoryId} should remain visible`);
    assert.equal(option.selectable, false, backstoryId);
    assert.equal(option.availabilityState, "locked", backstoryId);
  }

  const localHero = byId(options, "backstory.local_hero");
  assert.ok(localHero);
  assert.equal(localHero.isSpecial, true);
  assert.equal(localHero.selectable, false);
  assert.equal(byId(options, "backstory.hedge_adept"), null);
});

test("creator validation rejects selected ids that are not resolver-selectable", () => {
  const lockedForm = createCompleteCharacterForm("backstory.merchants_child");
  const specialForm = createCompleteCharacterForm("backstory.local_hero");

  assert.equal(isSelectableBackstoryId("backstory.merchants_child"), false);
  assert.equal(isSelectableBackstoryId("backstory.local_hero"), false);
  assert.equal(
    validateCharacterCreationForm(lockedForm).errors.backstoryId,
    "Choose an available backstory."
  );
  assert.equal(
    validateCharacterCreationForm(specialForm).errors.backstoryId,
    "Choose an available backstory."
  );
});

test("creator validation accepts purchased backstories only with account evidence", () => {
  for (const { unlockId, backstoryId } of LIVE_BACKSTORY_PURCHASES) {
    const profile = createProfileOwning([unlockId]);
    const form = createCompleteCharacterForm(backstoryId);

    assert.equal(
      validateCharacterCreationForm(form).errors.backstoryId,
      "Choose an available backstory.",
      backstoryId
    );
    assert.equal(
      validateCharacterCreationForm(form, { accountProfile: profile }).errors.backstoryId,
      undefined,
      backstoryId
    );
  }
});

test("forced locked and special selections still fail with account Backstory Legacy evidence", () => {
  const profile = createProfileOwning(LIVE_BACKSTORY_PURCHASE_IDS);

  for (const backstoryId of [
    "backstory.merchants_child",
    "backstory.local_hero"
  ]) {
    const form = createCompleteCharacterForm(backstoryId);

    assert.equal(
      validateCharacterCreationForm(form, { accountProfile: profile }).errors.backstoryId,
      "Choose an available backstory.",
      backstoryId
    );
  }
});

test("settlement-start validation remains separate from resolver availability", () => {
  const form = {
    ...createCompleteCharacterForm("backstory.local"),
    startingSettlementId: "settlement.not_real"
  };
  const validation = validateCharacterCreationForm(form);

  assert.equal(validation.errors.backstoryId, undefined);
  assert.equal(validation.errors.startingSettlementId, "Choose a valid starting settlement.");
});

test("new-game snapshot still applies only the selected live backstory package", () => {
  const form = createCompleteCharacterForm("backstory.local");
  const validation = validateCharacterCreationForm(form);
  const snapshot = createNewGameSnapshot(form, DEFAULT_ACCOUNT_ID);
  const template = getBackstoryTemplate(form.backstoryId);

  assert.deepEqual(validation.errors, {});
  assert.equal(snapshot.playerState.coreData.backstoryId, form.backstoryId);
  assert.deepEqual(
    skillSignature(snapshot.playerState.skills),
    skillSignature(template.startingSkills)
  );
});

test("new-game snapshot applies only the selected purchased backstory package", () => {
  const profile = createProfileOwning(LIVE_BACKSTORY_PURCHASE_IDS);
  const form = createCompleteCharacterForm("backstory.street_vendor");
  const validation = validateCharacterCreationForm(form, { accountProfile: profile });
  const snapshot = createNewGameSnapshot(form, DEFAULT_ACCOUNT_ID, {
    accountProfile: profile
  });
  const template = getBackstoryTemplate(form.backstoryId);

  assert.deepEqual(validation.errors, {});
  assert.equal(snapshot.playerState.coreData.backstoryId, form.backstoryId);
  assert.deepEqual(
    skillSignature(snapshot.playerState.skills),
    skillSignature(template.startingSkills)
  );
  assert.notDeepEqual(
    skillSignature(snapshot.playerState.skills),
    skillSignature(getBackstoryTemplate("backstory.gatherer").startingSkills)
  );
});

test("visible unavailable copy avoids blocked-system promises and raw policy ids", () => {
  const options = getBackstoryOptionsForSelection("lineage.human");
  const forbiddenCopy = /legacy points|source_run|policy|backstory\.|estate|title|institution|contact|mount|magic|medical|oath|paladin/i;

  for (const option of options.filter((entry) => !entry.selectable)) {
    assert.doesNotMatch(option.lockedReason ?? "", forbiddenCopy, option.id);
    assert.doesNotMatch(option.unlockHint ?? "", forbiddenCopy, option.id);
  }
});

test("creator availability uses the Backstory Legacy ownership helper and live definitions", async () => {
  const catalogSource = await readFile(
    "apps/rpg-ui/src/game-shell/characterCreationCatalog.ts",
    "utf8"
  );

  assert.match(catalogSource, /resolveOwnedBackstoryLegacyPurchaseIds/);
  assert.match(catalogSource, /getLegacyUnlockDefinitions/);
  assert.match(catalogSource, /legacyPurchaseIds/);
  assert.deepEqual(
    LIVE_BACKSTORY_PURCHASE_IDS.every((unlockId) =>
      getLegacyUnlockDefinitions().some((definition) => definition.id === unlockId)
    ),
    true
  );
});

test("creator integration does not import design metadata or compatibility rescue logic", async () => {
  const creatorSourceFiles = [
    "apps/rpg-ui/src/game-shell/characterCreationCatalog.ts",
    "apps/rpg-ui/src/game-shell/characterCreationForm.ts",
    "apps/rpg-ui/src/game-shell/newGameSnapshot.ts",
    "apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx"
  ];

  for (const sourceFile of creatorSourceFiles) {
    const source = await readFile(sourceFile, "utf8");

    assert.doesNotMatch(source, /backstory-policy-metadata/, sourceFile);
    assert.doesNotMatch(source, /legacy-upgrade-catalog-draft/, sourceFile);
    assert.doesNotMatch(source, /futureBackstoryLaneDrafts/, sourceFile);
    assert.doesNotMatch(source, /docs\/design|docs\\design/, sourceFile);
    assert.doesNotMatch(source, /legacyIdAliases|idAliases|retired|converted|migrationFallback|old-save|old-account|historical id/i, sourceFile);
  }
});
