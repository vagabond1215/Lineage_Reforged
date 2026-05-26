import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/index.ts";
import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getLineageIdentityCatalog
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import { createNewGameSnapshot } from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import { getDefaultWorldSelection } from "../../apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts";

const KNOWN_STARTER_WEAPON_PROFILE_GAPS = new Set(["item.short_bow", "item.butcher_knife"]);
const KNOWN_STARTER_ACTION_TRAINING_GAPS = new Set(["item.battle_staff", "item.buckler_shield", "item.pickaxe"]);
const KNOWN_STARTER_NON_MITIGATING_APPAREL = new Set(["item.casual_tunic"]);

async function loadRecords(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

function createCompleteCharacterForm(startingBundleId, choiceOverrides = {}) {
  const identity = getLineageIdentityCatalog("lineage.human");
  assert.ok(identity, "expected human identity catalog");
  const world = getDefaultWorldSelection("backstory.local");
  const form = {
    ...createDefaultCharacterCreationFormState("slot-1"),
    playerName: "Mapping Auditor",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    backstoryId: "backstory.local",
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId,
    startingBundleId,
    startingBundleChoiceSelections: {
      ...createDefaultStartingBundleChoiceSelections(startingBundleId),
      ...choiceOverrides
    }
  };

  assert.deepEqual(validateCharacterCreationForm(form).errors, {});
  return form;
}

function resolveEquippedItemIds(startingBundleId, choiceOverrides = {}) {
  const profile = createDefaultAccountProfileState();
  const snapshot = createNewGameSnapshot(createCompleteCharacterForm(startingBundleId, choiceOverrides), profile.accountId, {
    accountProfile: profile
  });

  return Object.fromEntries(
    Object.entries(snapshot.playerState.equipment)
      .filter(([, item]) => item !== null)
      .map(([slotId, item]) => [slotId, item.itemId])
  );
}

function combatDamageProfiles(item) {
  return (item.useProfiles ?? []).filter(
    (profile) =>
      (profile.resolutionHooks ?? []).some((hook) => hook === "damage.melee" || hook === "damage.ranged")
  );
}

function isCurrentWeaponTrainingCandidateProfile(profile) {
  return ["combat.melee.primary", "combat.ranged.primary"].includes(profile.actionType) && profile.handlingType === "weapon";
}

function hasArmorOrShieldHandlingProfile(item) {
  return (item.useProfiles ?? []).some((profile) => profile.handlingType === "armor" || profile.handlingType === "shield");
}

test("current creator starter equipment maps bundles into observed equipment slots", () => {
  const cases = [
    {
      label: "laborer",
      bundleId: "starting_bundle.laborer",
      expected: {
        "slot.weapon.right": "item.lumber_axe",
        "slot.armor.chest": "item.casual_tunic"
      }
    },
    {
      label: "hunter",
      bundleId: "starting_bundle.hunter",
      expected: {
        "slot.weapon.right": "item.short_bow"
      }
    },
    {
      label: "warrior sword",
      bundleId: "starting_bundle.warrior",
      expected: {
        "slot.weapon.left": "item.buckler_shield",
        "slot.weapon.right": "item.arming_sword",
        "slot.armor.chest": "item.leather_light_armor"
      }
    },
    {
      label: "warrior spear",
      bundleId: "starting_bundle.warrior",
      choiceOverrides: {
        "starting_bundle.warrior.weapon": "item.war_spear"
      },
      expected: {
        "slot.weapon.left": "item.buckler_shield",
        "slot.weapon.right": "item.war_spear",
        "slot.armor.chest": "item.leather_light_armor"
      }
    },
    {
      label: "crafter agriculture",
      bundleId: "starting_bundle.crafter",
      expected: {
        "slot.armor.chest": "item.casual_tunic"
      }
    },
    {
      label: "crafter pickaxe",
      bundleId: "starting_bundle.crafter",
      choiceOverrides: {
        "starting_bundle.crafter.specialist_kit": "item.pickaxe"
      },
      expected: {
        "slot.weapon.right": "item.pickaxe",
        "slot.armor.chest": "item.casual_tunic"
      }
    },
    {
      label: "crafter awl",
      bundleId: "starting_bundle.crafter",
      choiceOverrides: {
        "starting_bundle.crafter.specialist_kit": "item.awl"
      },
      expected: {
        "slot.armor.chest": "item.casual_tunic"
      }
    },
    {
      label: "arcanist",
      bundleId: "starting_bundle.arcanist",
      expected: {
        "slot.weapon.right": "item.battle_staff",
        "slot.armor.chest": "item.casual_tunic"
      }
    },
    {
      label: "traveler",
      bundleId: "starting_bundle.traveler",
      expected: {
        "slot.weapon.right": "item.butcher_knife",
        "slot.armor.chest": "item.travel_cloak",
        "slot.accessory.waist": "item.compass"
      }
    },
    {
      label: "trader",
      bundleId: "starting_bundle.trader",
      expected: {
        "slot.armor.chest": "item.casual_tunic",
        "slot.accessory.waist": "item.compass"
      }
    }
  ];

  for (const starterCase of cases) {
    assert.deepEqual(
      resolveEquippedItemIds(starterCase.bundleId, starterCase.choiceOverrides),
      starterCase.expected,
      starterCase.label
    );
  }
});

test("starter equipped weapon-slot items either map to combat profiles or known audit gaps", async () => {
  const items = await loadRecords("packages/content/base/items/items.json");
  const itemById = new Map(items.map((item) => [item.id, item]));
  const equippedItemIds = new Set();

  for (const bundleCase of [
    ["starting_bundle.laborer", {}],
    ["starting_bundle.hunter", {}],
    ["starting_bundle.warrior", {}],
    ["starting_bundle.warrior", { "starting_bundle.warrior.weapon": "item.war_spear" }],
    ["starting_bundle.crafter", {}],
    ["starting_bundle.crafter", { "starting_bundle.crafter.specialist_kit": "item.pickaxe" }],
    ["starting_bundle.crafter", { "starting_bundle.crafter.specialist_kit": "item.awl" }],
    ["starting_bundle.arcanist", {}],
    ["starting_bundle.traveler", {}],
    ["starting_bundle.trader", {}]
  ]) {
    const equipped = resolveEquippedItemIds(bundleCase[0], bundleCase[1]);
    for (const [slotId, itemId] of Object.entries(equipped)) {
      if (slotId.startsWith("slot.weapon.")) {
        equippedItemIds.add(itemId);
      }
    }
  }

  const profileGaps = [];
  const trainingGaps = [];
  for (const itemId of [...equippedItemIds].sort()) {
    const item = itemById.get(itemId);
    assert.ok(item, `${itemId} must exist in item content`);

    const profiles = combatDamageProfiles(item);
    if (profiles.length === 0 && !hasArmorOrShieldHandlingProfile(item)) {
      profileGaps.push(itemId);
      continue;
    }

    if (profiles.length > 0 && !profiles.some((profile) => isCurrentWeaponTrainingCandidateProfile(profile))) {
      trainingGaps.push(itemId);
    }
  }

  assert.deepEqual(profileGaps, [...KNOWN_STARTER_WEAPON_PROFILE_GAPS].sort());
  assert.deepEqual(trainingGaps, [...KNOWN_STARTER_ACTION_TRAINING_GAPS].sort());
});

test("starter equipped armor-slot items either map to mitigation profiles or known non-mitigating apparel", async () => {
  const items = await loadRecords("packages/content/base/items/items.json");
  const itemById = new Map(items.map((item) => [item.id, item]));
  const equippedArmorIds = new Set();

  for (const bundleId of [
    "starting_bundle.laborer",
    "starting_bundle.hunter",
    "starting_bundle.warrior",
    "starting_bundle.crafter",
    "starting_bundle.arcanist",
    "starting_bundle.traveler",
    "starting_bundle.trader"
  ]) {
    const equipped = resolveEquippedItemIds(bundleId);
    for (const [slotId, itemId] of Object.entries(equipped)) {
      if (slotId.startsWith("slot.armor.")) {
        equippedArmorIds.add(itemId);
      }
    }
  }

  const nonMitigatingApparel = [];
  for (const itemId of [...equippedArmorIds].sort()) {
    const item = itemById.get(itemId);
    assert.ok(item, `${itemId} must exist in item content`);
    if (!hasArmorOrShieldHandlingProfile(item)) {
      nonMitigatingApparel.push(itemId);
    }
  }

  assert.deepEqual(nonMitigatingApparel, [...KNOWN_STARTER_NON_MITIGATING_APPAREL].sort());
});
