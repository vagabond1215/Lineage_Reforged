import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  applyLegacyPreparationBonuses
} from "../../apps/rpg-ui/src/game-shell/legacyPreparationApplication.ts";
import { fillCoreResourcesToMax } from "../../apps/rpg-ui/src/game-shell/newGameResourceInitialization.ts";

const MERCHANT_PURSE = "legacy.unlock.preparation.merchant_purse";
const STOREHOUSE_KEYS = "legacy.unlock.preparation.storehouse_keys";
const CAMP_SUPPLIES = "legacy.unlock.preparation.camp_supplies";
const AWAKENED_SPARK = "legacy.unlock.preparation.awakened_spark";
const MARTIAL_LEGACY = "legacy.unlock.preparation.martial_legacy";
const LEARNED_LEGACY = "legacy.unlock.preparation.learned_legacy";
const VITAL_LEGACY = "legacy.unlock.preparation.vital_legacy";

const EMPTY_EQUIPMENT = {
  "slot.weapon.left": null,
  "slot.weapon.right": null,
  "slot.armor.head": null,
  "slot.armor.shoulder": null,
  "slot.armor.chest": null,
  "slot.armor.arm": null,
  "slot.armor.hand": null,
  "slot.armor.waist": null,
  "slot.armor.leg": null,
  "slot.armor.foot": null,
  "slot.accessory.ear": null,
  "slot.accessory.eyes": null,
  "slot.accessory.neck": null,
  "slot.accessory.arms": null,
  "slot.accessory.fingers": null,
  "slot.accessory.waist": null,
  "slot.accessory.ankle": null
};

function createInventory(stacks = []) {
  return {
    bags: [
      {
        id: "bag.test",
        label: "Test Bag",
        slotCapacity: 20,
        stacks
      }
    ],
    overflow: []
  };
}

function countInventoryItem(inventory, itemKey) {
  return [...inventory.bags.flatMap((bag) => bag.stacks), ...inventory.overflow]
    .filter((stack) => stack.itemKey === itemKey)
    .reduce((total, stack) => total + stack.quantity, 0);
}

test("simple Legacy preparations resolve conservative run-start bonuses", () => {
  const result = applyLegacyPreparationBonuses({
    preparationIds: [MERCHANT_PURSE, AWAKENED_SPARK],
    currency: { gold: 1, silver: 3, copper: 4 },
    equipment: EMPTY_EQUIPMENT,
    inventory: createInventory()
  });

  assert.equal(result.currency.silver, 5);
  assert.deepEqual(result.appliedPreparationIds, [MERCHANT_PURSE, AWAKENED_SPARK]);
  assert.deepEqual(result.appliedPreparationChoices, {});
  assert.deepEqual(result.attributeAdjustments, {});
  assert.equal(result.resourceModifiers.length, 1);
  assert.equal(result.resourceModifiers[0]?.sourceId, AWAKENED_SPARK);
  assert.equal(result.resourceModifiers[0]?.maxFlat.mp, 5);
  assert.deepEqual(result.fillResourceIds, ["mp"]);
  assert.deepEqual(
    result.reviewEntries.flatMap((entry) => entry.bonusLabels),
    ["+2 silver", "+5 MP"]
  );
});

test("Legacy item preparations dedupe against inventory and already-added preparation items", () => {
  const travelerResult = applyLegacyPreparationBonuses({
    preparationIds: [STOREHOUSE_KEYS, CAMP_SUPPLIES],
    currency: { gold: 0, silver: 0, copper: 0 },
    equipment: EMPTY_EQUIPMENT,
    inventory: createInventory([
      { itemId: "item.bedroll_kit", itemKey: "bedroll_kit", quantity: 1 }
    ])
  });

  assert.equal(countInventoryItem(travelerResult.inventory, "bedroll_kit"), 1);
  assert.equal(countInventoryItem(travelerResult.inventory, "traveler_ration"), 1);
  assert.deepEqual(
    travelerResult.reviewEntries.map((entry) => entry.status),
    ["applied", "skipped"]
  );

  const openLoadoutResult = applyLegacyPreparationBonuses({
    preparationIds: [STOREHOUSE_KEYS, CAMP_SUPPLIES],
    currency: { gold: 0, silver: 0, copper: 0 },
    equipment: EMPTY_EQUIPMENT,
    inventory: createInventory()
  });

  assert.equal(countInventoryItem(openLoadoutResult.inventory, "bedroll_kit"), 1);
  assert.equal(countInventoryItem(openLoadoutResult.inventory, "traveler_ration"), 1);
});

test("Legacy item preparations dedupe against equipped starter items", () => {
  const result = applyLegacyPreparationBonuses({
    preparationIds: [CAMP_SUPPLIES],
    currency: { gold: 0, silver: 0, copper: 0 },
    equipment: {
      ...EMPTY_EQUIPMENT,
      "slot.accessory.waist": {
        itemId: "item.bedroll_kit",
        itemKey: "bedroll_kit",
        quantity: 1,
        durability: 1
      }
    },
    inventory: createInventory()
  });

  assert.equal(countInventoryItem(result.inventory, "bedroll_kit"), 0);
  assert.equal(countInventoryItem(result.inventory, "traveler_ration"), 1);
});

test("unknown and incomplete grouped-choice preparations remain safe and non-mutating", () => {
  const result = applyLegacyPreparationBonuses({
    preparationIds: [
      "legacy.unlock.preparation.unknown",
      MARTIAL_LEGACY
    ],
    preparationChoices: {
      [MARTIAL_LEGACY]: "VIT"
    },
    currency: { gold: 1, silver: 2, copper: 3 },
    equipment: EMPTY_EQUIPMENT,
    inventory: createInventory()
  });

  assert.deepEqual(result.appliedPreparationIds, [MARTIAL_LEGACY]);
  assert.deepEqual(result.appliedPreparationChoices, {});
  assert.deepEqual(result.currency, { gold: 1, silver: 2, copper: 3 });
  assert.deepEqual(result.attributeAdjustments, {});
  assert.equal(result.resourceModifiers.length, 0);
  assert.equal(countInventoryItem(result.inventory, "traveler_ration"), 0);
  assert.equal(result.reviewEntries[0]?.status, "inert");
});

test("grouped-choice preparations apply conservative attribute and resource bonuses exactly once", () => {
  const result = applyLegacyPreparationBonuses({
    preparationIds: [MARTIAL_LEGACY, LEARNED_LEGACY, VITAL_LEGACY],
    preparationChoices: {
      [MARTIAL_LEGACY]: "STR",
      [LEARNED_LEGACY]: "WIS",
      [VITAL_LEGACY]: "stamina"
    },
    currency: { gold: 0, silver: 0, copper: 0 },
    equipment: EMPTY_EQUIPMENT,
    inventory: createInventory()
  });

  assert.deepEqual(result.appliedPreparationChoices, {
    [MARTIAL_LEGACY]: "STR",
    [LEARNED_LEGACY]: "WIS",
    [VITAL_LEGACY]: "stamina"
  });
  assert.deepEqual(result.attributeAdjustments, {
    STR: 1,
    WIS: 1
  });
  assert.equal(result.resourceModifiers.length, 1);
  assert.equal(result.resourceModifiers[0]?.maxFlat.stamina, 5);
  assert.deepEqual(result.fillResourceIds, ["stamina"]);
  assert.deepEqual(
    result.reviewEntries.flatMap((entry) => entry.bonusLabels),
    ["STR (+1 STR)", "WIS (+1 WIS)", "Stamina (+5 Stamina)"]
  );
});

test("creator and snapshot sources share the preparation application seam", async () => {
  const snapshotSource = await readFile(
    "apps/rpg-ui/src/game-shell/newGameSnapshot.ts",
    "utf8"
  );
  const creatorSource = await readFile(
    "apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx",
    "utf8"
  );
  const appSource = await readFile("apps/rpg-ui/src/App.tsx", "utf8");

  assert.match(snapshotSource, /applyLegacyPreparationBonuses/);
  assert.match(snapshotSource, /legacyPreparations/);
  assert.match(snapshotSource, /appliedLegacyPreparationIds/);
  assert.match(snapshotSource, /appliedLegacyPreparationChoices/);
  assert.match(creatorSource, /Legacy Preparations/);
  assert.match(creatorSource, /preparation\.bonusLabels/);
  assert.match(appSource, /appliedLegacyPreparationIds=\{/);
  assert.match(appSource, /appliedLegacyPreparationChoices=\{/);
  assert.match(appSource, /resolveLegacyPreparationSelection\(state\.accountProfile\)/);
});

test("fresh-run resource fill helper tops core resources off to their resolved maxima", () => {
  const resources = {
    hp: { current: 14, max: 19 },
    mp: { current: 8, max: 12 },
    stamina: { current: 21, max: 27 }
  };

  const filled = fillCoreResourcesToMax(resources);

  assert.equal(filled.hp.current, 19);
  assert.equal(filled.mp.current, 12);
  assert.equal(filled.stamina.current, 27);
});
