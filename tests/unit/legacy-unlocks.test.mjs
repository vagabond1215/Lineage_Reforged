import test from "node:test";
import assert from "node:assert/strict";
import {
  createDefaultAccountProfileState,
  consumeSelectedLegacyPreparations,
  getLegacyUnlockDefinitions,
  grantLegacy,
  removeLegacyPreparation,
  purchaseLegacyUnlock,
  resolveLegacyPreparationCapacity,
  resolveLegacyPreparationSelection,
  resolveLegacyRenownPresence,
  resolveLegacyUnlockStates,
  setLegacyPreparationChoice,
  selectLegacyPreparation,
  validateLegacyUnlockDefinitions
} from "../../packages/engines/game-engine/src/index.ts";

function createArchivedRun(overrides = {}) {
  return {
    characterId: "player.test_archived",
    name: "Test Archived",
    lineageId: "lineage.human",
    startingContinentId: "continent.kaelvar",
    startingRegionId: "region.aurelia",
    startingSettlementId: "settlement.aurelis",
    startedAt: "2026-04-20T12:00:00.000Z",
    endedAt: "2026-04-20T13:00:00.000Z",
    lastSeenAt: "2026-04-20T13:00:00.000Z",
    outcome: "archived",
    archiveReason: "retired",
    echoLevelReached: 9,
    notableCharacterAchievementIds: [],
    survivedDays: 14,
    saveSlotIds: [],
    ...overrides
  };
}

function grantProfile(amount = 50) {
  const granted = grantLegacy(createDefaultAccountProfileState(), {
    amount,
    summary: "Test grant",
    sourceType: "test",
    sourceId: "test.grant",
    recordedAt: "2026-04-20T12:00:00.000Z"
  });
  assert.equal(granted.ok, true);
  return granted.profile;
}

function purchaseUnlockIds(profile, unlockIds, startMinute = 0) {
  let nextProfile = profile;

  unlockIds.forEach((unlockId, index) => {
    const purchased = purchaseLegacyUnlock(
      nextProfile,
      unlockId,
      `2026-04-20T18:${(startMinute + index).toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    nextProfile = purchased.profile;
  });

  return nextProfile;
}

function getVerdantThalosSupportUnlockIds() {
  const regionDefinition = getLegacyUnlockDefinitions().find(
    (definition) => definition.id === "legacy.unlock.renown.region.verdant_thalos"
  );

  assert.ok(regionDefinition?.renownNode?.supportUnlockIds);
  return [...regionDefinition.renownNode.supportUnlockIds];
}

test("legacy unlock definitions load binary, tiered, incremental, and metadata-only effects", () => {
  const definitions = getLegacyUnlockDefinitions();
  const kinds = new Set(definitions.map((definition) => definition.kind));
  const categories = new Set(definitions.map((definition) => definition.category));
  const classifications = new Set(
    definitions.map((definition) => definition.classification ?? "permanent")
  );

  assert.ok(kinds.has("binary"));
  assert.ok(kinds.has("tiered"));
  assert.ok(kinds.has("incremental"));
  assert.deepEqual(
    [...categories].filter((category) =>
      ["Lineage", "Renown", "Fortune", "Craft", "Destiny", "Chronicle", "Preparations"].includes(
        category
      )
    ).length,
    7
  );
  assert.ok(classifications.has("permanent"));
  assert.ok(classifications.has("preparation"));
  assert.ok(
    definitions
      .flatMap((definition) => definition.effects)
      .some((effect) => effect.type === "future_inheritance_uses")
  );
  assert.equal(
    definitions.flatMap((definition) => definition.effects).some((effect) =>
      ["stat_bonus", "skill_bonus", "combat_bonus", "survival_bonus"].includes(effect.type)
    ),
    false
  );
  assert.ok(
    definitions.some(
      (definition) =>
        definition.id === "legacy.unlock.lineage.prepared_lineage" &&
        definition.effects.some((effect) => effect.type === "preparation_capacity")
    )
  );
  assert.ok(
    definitions.some(
      (definition) =>
        definition.id === "legacy.unlock.renown.region.verdant_thalos" &&
        definition.renownNode?.tier === "region" &&
        definition.cost.type === "renown_hierarchy"
    )
  );

  const invalid = structuredClone(definitions[0]);
  invalid.id = "legacy.unlock.invalid.direct_power";
  invalid.effects = [{ type: "stat_bonus", key: "direct.stat.strength", value: 1 }];

  assert.throws(
    () => validateLegacyUnlockDefinitions([invalid], "test-invalid-effects"),
    /non-metadata effect/
  );
});

test("permanent, tiered, and temporary unlock states resolve with preparation capacity", () => {
  let profile = grantProfile(100);

  assert.equal(resolveLegacyPreparationCapacity(profile), 0);

  const initialStates = resolveLegacyUnlockStates(profile);
  const familyRegister = initialStates.find(
    (entry) => entry.id === "legacy.unlock.account.ledger_seal"
  );
  const preparedLineage = initialStates.find(
    (entry) => entry.id === "legacy.unlock.lineage.prepared_lineage"
  );
  const storehouseKeys = initialStates.find(
    (entry) => entry.id === "legacy.unlock.preparation.storehouse_keys"
  );

  assert.equal(familyRegister?.classification, "permanent");
  assert.equal(preparedLineage?.classification, "tiered_permanent");
  assert.equal(storehouseKeys?.classification, "preparation");
  assert.equal(storehouseKeys?.canPurchase, false);

  for (let rank = 1; rank <= 4; rank += 1) {
    const purchased = purchaseLegacyUnlock(
      profile,
      "legacy.unlock.lineage.prepared_lineage",
      `2026-04-20T13:0${rank}:00.000Z`
    );

    assert.equal(purchased.ok, true);
    assert.equal(purchased.unlock.rank, rank);
    profile = purchased.profile;
    assert.equal(resolveLegacyPreparationCapacity(profile), rank);
  }

  const maxed = resolveLegacyUnlockStates(profile).find(
    (entry) => entry.id === "legacy.unlock.lineage.prepared_lineage"
  );
  assert.equal(maxed?.state, "maxed");
  assert.equal(maxed?.currentRank, 4);
});

test("legacy preparation selection requires ownership and respects capacity", () => {
  let profile = grantProfile(100);

  assert.equal(resolveLegacyPreparationCapacity(profile), 0);
  assert.deepEqual(resolveLegacyPreparationSelection(profile).selectedUnlockIds, []);

  const locked = selectLegacyPreparation(profile, "legacy.unlock.preparation.storehouse_keys");
  assert.equal(locked.ok, false);
  assert.equal(locked.error, "not_owned");

  let purchased = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.lineage.prepared_lineage",
    "2026-04-20T13:01:00.000Z"
  );
  assert.equal(purchased.ok, true);
  profile = purchased.profile;

  purchased = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.preparation.storehouse_keys",
    "2026-04-20T13:02:00.000Z"
  );
  assert.equal(purchased.ok, true);
  profile = purchased.profile;

  const selected = selectLegacyPreparation(
    profile,
    "legacy.unlock.preparation.storehouse_keys"
  );
  assert.equal(selected.ok, true);
  profile = selected.profile;
  assert.deepEqual(profile.legacy.selectedPreparationUnlockIds, [
    "legacy.unlock.preparation.storehouse_keys"
  ]);
  assert.deepEqual(profile.legacy.selectedPreparationChoicePayloads, {});

  const duplicate = selectLegacyPreparation(
    profile,
    "legacy.unlock.preparation.storehouse_keys"
  );
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.error, "duplicate_selection");

  purchased = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.preparation.merchant_purse",
    "2026-04-20T13:03:00.000Z"
  );
  assert.equal(purchased.ok, true);
  profile = purchased.profile;

  const overCapacity = selectLegacyPreparation(
    profile,
    "legacy.unlock.preparation.merchant_purse"
  );
  assert.equal(overCapacity.ok, false);
  assert.equal(overCapacity.error, "capacity_full");

  const removed = removeLegacyPreparation(
    profile,
    "legacy.unlock.preparation.storehouse_keys"
  );
  profile = removed.profile;
  assert.deepEqual(profile.legacy.selectedPreparationUnlockIds, []);

  const reselected = selectLegacyPreparation(
    profile,
    "legacy.unlock.preparation.merchant_purse"
  );
  assert.equal(reselected.ok, true);
  assert.deepEqual(reselected.profile.legacy.selectedPreparationUnlockIds, [
    "legacy.unlock.preparation.merchant_purse"
  ]);
});

test("stale preparation selections trim invalid ids before excess while preserving user order", () => {
  let profile = grantProfile(100);

  for (const unlockId of [
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.preparation.storehouse_keys",
    "legacy.unlock.preparation.merchant_purse",
    "legacy.unlock.preparation.camp_supplies"
  ]) {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-04-20T14:${profile.legacy.legacyTransactions.length.toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    profile = purchased.profile;
  }

  profile = {
    ...profile,
    legacy: {
      ...profile.legacy,
      selectedPreparationUnlockIds: [
        "legacy.unlock.preparation.storehouse_keys",
        "legacy.unlock.preparation.unknown",
        "legacy.unlock.preparation.merchant_purse",
        "legacy.unlock.preparation.storehouse_keys",
        "legacy.unlock.preparation.camp_supplies"
      ],
      selectedPreparationChoicePayloads: {
        "legacy.unlock.preparation.storehouse_keys": "STR",
        "legacy.unlock.preparation.unknown": "WIS",
        "legacy.unlock.preparation.camp_supplies": "hp"
      }
    }
  };

  const resolution = resolveLegacyPreparationSelection(profile);

  assert.equal(resolution.capacity, 2);
  assert.deepEqual(resolution.selectedUnlockIds, [
    "legacy.unlock.preparation.storehouse_keys",
    "legacy.unlock.preparation.merchant_purse"
  ]);
  assert.deepEqual(resolution.selectedChoicePayloads, {});
  assert.deepEqual(resolution.droppedInvalidUnlockIds, [
    "legacy.unlock.preparation.unknown",
    "legacy.unlock.preparation.storehouse_keys"
  ]);
  assert.deepEqual(resolution.droppedExcessUnlockIds, [
    "legacy.unlock.preparation.camp_supplies"
  ]);
});

test("choice-required preparations are owned but blocked from next-run selection", () => {
  let profile = grantProfile(100);

  for (const unlockId of [
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.preparation.martial_legacy"
  ]) {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-04-20T15:${profile.legacy.legacyTransactions.length.toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    profile = purchased.profile;
  }

  const blocked = selectLegacyPreparation(
    profile,
    "legacy.unlock.preparation.martial_legacy"
  );
  assert.equal(blocked.ok, false);
  assert.equal(blocked.error, "choice_required");
  assert.deepEqual(resolveLegacyPreparationSelection(profile).choiceRequiredUnlockIds, [
    "legacy.unlock.preparation.martial_legacy"
  ]);
  assert.deepEqual(resolveLegacyPreparationSelection(profile).incompleteChoiceUnlockIds, [
    "legacy.unlock.preparation.martial_legacy"
  ]);
});

test("grouped-choice preparations finalize with supported payloads and update in place", () => {
  let profile = grantProfile(100);

  for (const unlockId of [
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.preparation.martial_legacy",
    "legacy.unlock.preparation.vital_legacy"
  ]) {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-04-20T16:${profile.legacy.legacyTransactions.length.toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    profile = purchased.profile;
  }

  const martialSelected = setLegacyPreparationChoice(
    profile,
    "legacy.unlock.preparation.martial_legacy",
    "STR"
  );
  assert.equal(martialSelected.ok, true);
  profile = martialSelected.profile;

  const invalidChoice = setLegacyPreparationChoice(
    profile,
    "legacy.unlock.preparation.martial_legacy",
    "VIT"
  );
  assert.equal(invalidChoice.ok, false);
  assert.equal(invalidChoice.error, "invalid_choice");

  const vitalSelected = setLegacyPreparationChoice(
    profile,
    "legacy.unlock.preparation.vital_legacy",
    "mp"
  );
  assert.equal(vitalSelected.ok, true);
  profile = vitalSelected.profile;

  let resolution = resolveLegacyPreparationSelection(profile);
  assert.deepEqual(resolution.selectedUnlockIds, [
    "legacy.unlock.preparation.martial_legacy",
    "legacy.unlock.preparation.vital_legacy"
  ]);
  assert.deepEqual(resolution.selectedChoicePayloads, {
    "legacy.unlock.preparation.martial_legacy": "STR",
    "legacy.unlock.preparation.vital_legacy": "mp"
  });

  const martialUpdated = setLegacyPreparationChoice(
    profile,
    "legacy.unlock.preparation.martial_legacy",
    "DEX"
  );
  assert.equal(martialUpdated.ok, true);
  resolution = resolveLegacyPreparationSelection(martialUpdated.profile);
  assert.deepEqual(resolution.selectedUnlockIds, [
    "legacy.unlock.preparation.martial_legacy",
    "legacy.unlock.preparation.vital_legacy"
  ]);
  assert.deepEqual(resolution.selectedChoicePayloads, {
    "legacy.unlock.preparation.martial_legacy": "DEX",
    "legacy.unlock.preparation.vital_legacy": "mp"
  });
});

test("incomplete grouped selections do not count toward finalized capacity", () => {
  let profile = grantProfile(100);

  for (const unlockId of [
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.preparation.martial_legacy",
    "legacy.unlock.preparation.merchant_purse",
    "legacy.unlock.preparation.storehouse_keys"
  ]) {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-04-20T16:${profile.legacy.legacyTransactions.length.toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    profile = purchased.profile;
  }

  const before = resolveLegacyPreparationSelection(profile);
  assert.deepEqual(before.selectedUnlockIds, []);
  assert.deepEqual(before.incompleteChoiceUnlockIds, [
    "legacy.unlock.preparation.martial_legacy"
  ]);

  const selected = selectLegacyPreparation(
    profile,
    "legacy.unlock.preparation.merchant_purse"
  );
  assert.equal(selected.ok, true);
  profile = selected.profile;

  const secondSelected = selectLegacyPreparation(
    profile,
    "legacy.unlock.preparation.storehouse_keys"
  );
  assert.equal(secondSelected.ok, true);
  profile = secondSelected.profile;

  const capacityBlocked = setLegacyPreparationChoice(
    profile,
    "legacy.unlock.preparation.martial_legacy",
    "CON"
  );
  assert.equal(capacityBlocked.ok, false);
  assert.equal(capacityBlocked.error, "capacity_full");
});

test("consuming selected preparations clears next-run ids and grouped-choice payloads", () => {
  let profile = grantProfile(100);

  for (const unlockId of [
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.preparation.storehouse_keys"
  ]) {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-04-20T16:${profile.legacy.legacyTransactions.length.toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    profile = purchased.profile;
  }

  const selected = selectLegacyPreparation(
    profile,
    "legacy.unlock.preparation.storehouse_keys"
  );
  assert.equal(selected.ok, true);
  profile = selected.profile;

  const ranked = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.lineage.prepared_lineage",
    "2026-04-20T16:59:00.000Z"
  );
  assert.equal(ranked.ok, true);
  profile = ranked.profile;

  const purchasedChoice = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.preparation.martial_legacy",
    "2026-04-20T16:59:30.000Z"
  );
  assert.equal(purchasedChoice.ok, true);
  profile = purchasedChoice.profile;

  const chosen = setLegacyPreparationChoice(
    profile,
    "legacy.unlock.preparation.martial_legacy",
    "AGI"
  );
  assert.equal(chosen.ok, true);

  const consumed = consumeSelectedLegacyPreparations(chosen.profile);
  assert.deepEqual(consumed.consumedPreparationUnlockIds, [
    "legacy.unlock.preparation.storehouse_keys",
    "legacy.unlock.preparation.martial_legacy"
  ]);
  assert.deepEqual(consumed.profile.legacy.selectedPreparationUnlockIds, []);
  assert.deepEqual(consumed.profile.legacy.selectedPreparationChoicePayloads, {});
  assert.equal(
    consumed.profile.legacy.legacyUnlocks.some(
      (unlock) => unlock.unlockId === "legacy.unlock.preparation.storehouse_keys"
    ),
    true
  );
});

test("unlock resolution separates eligibility, affordability, and unsupported future hooks", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyPoints: 0,
      lifetimeLegacyEarned: 5
    },
    history: {
      runRecords: [
        createArchivedRun({
          characterId: "player.deleted",
          outcome: "deleted",
          archiveReason: "retired"
        })
      ]
    }
  };

  const states = resolveLegacyUnlockStates(profile);
  const ledgerSeal = states.find((entry) => entry.id === "legacy.unlock.account.ledger_seal");
  const boundIndex = states.find((entry) => entry.id === "legacy.unlock.chronicle.bound_index");
  const tradeCharter = states.find((entry) => entry.id === "legacy.unlock.account.trade_charter");

  assert.equal(ledgerSeal?.eligible, true);
  assert.equal(ledgerSeal?.affordability, "unaffordable");
  assert.equal(ledgerSeal?.canPurchase, false);
  assert.equal(boundIndex?.eligible, false);
  assert.equal(
    boundIndex?.requirementResults.some((result) => result.state === "unmet"),
    true
  );
  assert.equal(tradeCharter?.eligible, false);
  assert.equal(
    tradeCharter?.requirementResults.some((result) => result.state === "unsupported"),
    true
  );
});

test("historical unknown unlock ids are preserved as non-purchasable binary records", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [
        {
          unlockId: "legacy.unlock.old_brass_seal",
          unlockedAt: "2026-04-20T12:00:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260420120000000.1"
        }
      ]
    }
  };

  const historical = resolveLegacyUnlockStates(profile).find(
    (entry) => entry.id === "legacy.unlock.old_brass_seal"
  );

  assert.equal(historical?.isKnown, false);
  assert.equal(historical?.state, "maxed");
  assert.equal(historical?.kind, "binary");
  assert.equal(historical?.currentRank, 1);
  assert.equal(historical?.nextRank, null);
  assert.equal(historical?.canPurchase, false);
});

test("purchaseLegacyUnlock is transactional for failures and writes one spend ledger on success", () => {
  const profile = grantProfile(5);
  const originalUnknown = structuredClone(profile);
  const unknown = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.not_in_catalog",
    "2026-04-20T12:05:00.000Z"
  );
  assert.equal(unknown.ok, false);
  assert.equal(unknown.error, "unknown_unlock");
  assert.deepEqual(unknown.profile, originalUnknown);

  const zeroCurrent = {
    ...profile,
    legacy: {
      ...profile.legacy,
      legacyPoints: 0
    }
  };
  const originalInsufficient = structuredClone(zeroCurrent);
  const insufficient = purchaseLegacyUnlock(
    zeroCurrent,
    "legacy.unlock.account.ledger_seal",
    "2026-04-20T12:06:00.000Z"
  );
  assert.equal(insufficient.ok, false);
  assert.equal(insufficient.error, "insufficient_legacy");
  assert.deepEqual(insufficient.profile, originalInsufficient);

  const originalUnsupported = structuredClone(profile);
  const unsupported = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.account.trade_charter",
    "2026-04-20T12:07:00.000Z"
  );
  assert.equal(unsupported.ok, false);
  assert.equal(unsupported.error, "unsupported_requirement");
  assert.deepEqual(unsupported.profile, originalUnsupported);

  const originalTransactionCount = profile.legacy.legacyTransactions.length;
  const purchased = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.account.ledger_seal",
    "2026-04-20T12:08:00.000Z"
  );
  assert.equal(purchased.ok, true);
  assert.equal(purchased.profile.legacy.legacyPoints, 4);
  assert.equal(purchased.profile.legacy.lifetimeLegacyEarned, 5);
  assert.equal(purchased.profile.legacy.legacyTransactions.length, originalTransactionCount + 1);
  assert.equal(purchased.transaction.kind, "spend");
  assert.equal(purchased.transaction.unlockId, "legacy.unlock.account.ledger_seal");
  assert.equal(purchased.unlock.rank, undefined);
  assert.equal(
    purchased.profile.legacy.legacyUnlocks.some(
      (unlock) => unlock.unlockId === "legacy.unlock.account.ledger_seal"
    ),
    true
  );
});

test("ranked unlock purchases advance ranks and stop at max without partial mutation", () => {
  let profile = {
    ...grantProfile(50),
    history: {
      runRecords: [createArchivedRun()]
    }
  };

  for (let rank = 1; rank <= 5; rank += 1) {
    const purchased = purchaseLegacyUnlock(
      profile,
      "legacy.unlock.perk.campfire_notes",
      `2026-04-20T12:${10 + rank}:00.000Z`
    );

    assert.equal(purchased.ok, true);
    assert.equal(purchased.unlock.rank, rank);
    profile = purchased.profile;
  }

  const maxed = resolveLegacyUnlockStates(profile).find(
    (entry) => entry.id === "legacy.unlock.perk.campfire_notes"
  );
  assert.equal(maxed?.state, "maxed");
  assert.equal(maxed?.currentRank, 5);

  const originalMaxed = structuredClone(profile);
  const repurchase = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.perk.campfire_notes",
    "2026-04-20T12:20:00.000Z"
  );
  assert.equal(repurchase.ok, false);
  assert.equal(repurchase.error, "max_rank");
  assert.deepEqual(repurchase.profile, originalMaxed);
});

test("Renown hierarchy blocks higher tiers until all supporting lower tiers match", () => {
  let profile = grantProfile(500);
  const regionId = "legacy.unlock.renown.region.verdant_thalos";
  const regionDefinition = getLegacyUnlockDefinitions().find(
    (definition) => definition.id === regionId
  );
  assert.ok(regionDefinition);
  const supportUnlockIds = regionDefinition.renownNode?.supportUnlockIds ?? [];
  assert.equal(supportUnlockIds.length, 6);

  let regionState = resolveLegacyUnlockStates(profile).find((entry) => entry.id === regionId);
  assert.equal(regionState?.canPurchase, false);
  assert.equal(
    regionState?.requirementResults.some((result) => result.state === "unmet"),
    true
  );
  assert.equal(regionState?.nextCost, 24);

  for (const supportUnlockId of supportUnlockIds) {
    const purchased = purchaseLegacyUnlock(
      profile,
      supportUnlockId,
      `2026-04-20T14:${supportUnlockIds.indexOf(supportUnlockId).toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    profile = purchased.profile;
  }

  regionState = resolveLegacyUnlockStates(profile).find((entry) => entry.id === regionId);
  assert.equal(regionState?.canPurchase, true);
  assert.equal(regionState?.nextCost, 24);

  const regionPurchase = purchaseLegacyUnlock(
    profile,
    regionId,
    "2026-04-20T14:10:00.000Z"
  );
  assert.equal(regionPurchase.ok, true);
  profile = regionPurchase.profile;

  regionState = resolveLegacyUnlockStates(profile).find((entry) => entry.id === regionId);
  assert.equal(regionState?.currentRank, 1);
  assert.equal(regionState?.canPurchase, false);
  assert.equal(
    regionState?.requirementResults.some((result) => result.state === "unmet"),
    true
  );
});

test("Renown presence resolves settlement, region, continent, and universal scopes safely", () => {
  const settlementProfile = purchaseUnlockIds(grantProfile(1000), [
    "legacy.unlock.renown.settlement.aurelis"
  ]);
  const settlementPresence = resolveLegacyRenownPresence(settlementProfile, {
    settlementId: "settlement.aurelis",
    regionId: "region.verdant_thalos",
    continentId: "region.kaelvar"
  });
  assert.equal(settlementPresence.settlement?.rank, 1);
  assert.equal(settlementPresence.region, null);
  assert.equal(settlementPresence.continent, null);
  assert.equal(settlementPresence.primaryTier, "settlement");

  let profile = grantProfile(2000);
  profile = purchaseUnlockIds(profile, [
    ...getVerdantThalosSupportUnlockIds(),
    "legacy.unlock.renown.region.verdant_thalos",
    "legacy.unlock.renown.continent.kaelvar",
    "legacy.unlock.renown.universal"
  ]);

  const regionPresence = resolveLegacyRenownPresence(profile, {
    regionId: "region.verdant_thalos"
  });
  assert.equal(regionPresence.settlement, null);
  assert.equal(regionPresence.region?.rank, 1);
  assert.equal(regionPresence.continent, null);
  assert.equal(regionPresence.universalRank, 1);
  assert.equal(regionPresence.primaryTier, "region");

  const continentPresence = resolveLegacyRenownPresence(profile, {
    continentId: "region.kaelvar"
  });
  assert.equal(continentPresence.region, null);
  assert.equal(continentPresence.continent?.rank, 1);
  assert.equal(continentPresence.primaryTier, "continent");

  const universalPresence = resolveLegacyRenownPresence(profile, {});
  assert.equal(universalPresence.settlement, null);
  assert.equal(universalPresence.region, null);
  assert.equal(universalPresence.continent, null);
  assert.equal(universalPresence.universalRank, 1);
  assert.equal(universalPresence.primaryTier, "universal");

  const localFirstPresence = resolveLegacyRenownPresence(profile, {
    settlementId: "settlement.aurelis",
    regionId: "region.verdant_thalos",
    continentId: "region.kaelvar"
  });
  assert.deepEqual(localFirstPresence.activeTiers, [
    "settlement",
    "region",
    "continent",
    "universal"
  ]);
  assert.equal(localFirstPresence.primaryTier, "settlement");
});

test("Renown presence fails safely for unsupported geography and keeps flavor flags copy-only", () => {
  let profile = grantProfile(2000);
  profile = purchaseUnlockIds(profile, [
    ...getVerdantThalosSupportUnlockIds(),
    "legacy.unlock.renown.region.verdant_thalos",
    "legacy.unlock.renown.continent.kaelvar",
    "legacy.unlock.renown.universal"
  ]);
  profile = {
    ...profile,
    legacy: {
      ...profile.legacy,
      legacyUnlocks: [
        ...profile.legacy.legacyUnlocks,
        {
          unlockId: "legacy.unlock.renown.village_name",
          unlockedAt: "2026-04-20T19:30:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260420193000000.1"
        },
        {
          unlockId: "legacy.unlock.renown.banner_rights",
          unlockedAt: "2026-04-20T19:31:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260420193100000.2",
          rank: 1
        },
        {
          unlockId: "legacy.unlock.renown.veteran_reputation",
          unlockedAt: "2026-04-20T19:32:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260420193200000.3"
        }
      ]
    }
  };

  const presence = resolveLegacyRenownPresence(profile, {
    settlementId: "settlement.unknown",
    regionId: "region.unknown",
    continentId: "region.unknown"
  });

  assert.equal(presence.settlement, null);
  assert.equal(presence.region, null);
  assert.equal(presence.continent, null);
  assert.equal(presence.universalRank, 1);
  assert.equal(presence.primaryTier, "universal");
  assert.deepEqual(presence.flavorFlags, {
    villageName: true,
    bannerRightsRank: 1,
    veteranReputation: true
  });
});

test("known ranked definitions can resolve historical rank-one ownership without converting unknown ids", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [
        {
          unlockId: "legacy.unlock.perk.campfire_notes",
          unlockedAt: "2026-04-20T12:00:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260420120000000.1"
        },
        {
          unlockId: "legacy.unlock.unknown_rankless",
          unlockedAt: "2026-04-20T12:01:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260420120100000.2"
        }
      ]
    }
  };

  const states = resolveLegacyUnlockStates(profile);
  const knownRanked = states.find((entry) => entry.id === "legacy.unlock.perk.campfire_notes");
  const unknownRankless = states.find((entry) => entry.id === "legacy.unlock.unknown_rankless");

  assert.equal(knownRanked?.isKnown, true);
  assert.equal(knownRanked?.currentRank, 1);
  assert.equal(knownRanked?.nextRank, 2);
  assert.equal(unknownRankless?.isKnown, false);
  assert.equal(unknownRankless?.kind, "binary");
  assert.equal(unknownRankless?.currentRank, 1);
  assert.equal(unknownRankless?.nextRank, null);
});
