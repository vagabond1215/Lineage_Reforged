import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import {
  validateArmorProfiles,
  validateWeaponProfiles
} from "../../tools/content-lint/equipment-profiles.mjs";

const ROOT = process.cwd();
const WEAPON_PROFILE_PATH = "packages/content/base/items/weapon_profiles.json";
const ARMOR_PROFILE_PATH = "packages/content/base/items/armor_profiles.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const weaponSchema = await readJson("packages/schemas/items/weapon-profile.schema.json");
const armorSchema = await readJson("packages/schemas/items/armor-profile.schema.json");
const itemWrapper = await readJson("packages/content/base/items/items.json");

function weaponProfile(overrides = {}) {
  return {
    id: "weapon_profile.arming_sword",
    itemKey: "arming_sword",
    weaponFamily: "sword",
    handedness: "one_handed",
    compatibleSlotIds: ["slot.weapon.left", "slot.weapon.right"],
    deliveryPosture: "melee",
    rangePosture: "close",
    equipmentTags: ["martial", "offhand_compatible"],
    sourceAuthorityNotes: [
      "References canonical weapon item identity only; current useProfiles remain item-local."
    ],
    notes: [
      "Descriptive structural authority only; no combat execution, inventory mutation, runtime state, UI, storage, reward, or gameplay behavior."
    ],
    ...overrides
  };
}

function armorProfile(overrides = {}) {
  return {
    id: "armor_profile.leather_light_armor",
    itemKey: "leather_light_armor",
    armorKind: "body_armor",
    armorFamily: "leather",
    compatibleSlotIds: ["slot.armor.chest"],
    coverageSlotIds: ["chest"],
    weightClass: "light",
    encumbrancePosture: "low",
    mobilityPosture: "unrestricted",
    equipmentTags: ["body_coverage", "defense"],
    sourceAuthorityNotes: [
      "References canonical armor item identity only; current useProfiles remain item-local."
    ],
    notes: [
      "Descriptive structural authority only; no mitigation execution, inventory mutation, runtime state, UI, storage, reward, or gameplay behavior."
    ],
    ...overrides
  };
}

function shieldProfile(overrides = {}) {
  return armorProfile({
    id: "armor_profile.buckler_shield",
    itemKey: "buckler_shield",
    armorKind: "shield",
    armorFamily: "shield",
    compatibleSlotIds: ["slot.weapon.left"],
    coverageSlotIds: ["shield_hand"],
    weightClass: "light",
    encumbrancePosture: "low",
    mobilityPosture: "unrestricted",
    equipmentTags: ["shield", "shield_bash_compatible"],
    ...overrides
  });
}

function makeWeaponInput(records = [weaponProfile()]) {
  return {
    relativePath: WEAPON_PROFILE_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(weaponSchema),
    items: structuredClone(itemWrapper.records)
  };
}

function makeArmorInput(records = [armorProfile(), shieldProfile()]) {
  return {
    relativePath: ARMOR_PROFILE_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(armorSchema),
    items: structuredClone(itemWrapper.records)
  };
}

function validateWeapons(input = makeWeaponInput()) {
  return validateWeaponProfiles(input);
}

function validateArmor(input = makeArmorInput()) {
  return validateArmorProfiles(input);
}

function weaponRecord(input) {
  return input.wrapper.records[0];
}

function armorRecord(input, index = 0) {
  return input.wrapper.records[index];
}

function expectWeaponFailure(mutate, expected) {
  const input = makeWeaponInput();
  mutate(input);
  assert.throws(() => validateWeapons(input), expected);
}

function expectArmorFailure(mutate, expected) {
  const input = makeArmorInput();
  mutate(input);
  assert.throws(() => validateArmor(input), expected);
}

test("accepts valid descriptive weapon and armor profile fixtures", () => {
  assert.deepEqual(validateWeapons(), {
    ok: true,
    weaponProfileIds: ["weapon_profile.arming_sword"]
  });
  assert.deepEqual(validateArmor(), {
    ok: true,
    armorProfileIds: [
      "armor_profile.buckler_shield",
      "armor_profile.leather_light_armor"
    ]
  });
});

test("does not mutate any profile inputs", () => {
  const weaponInput = makeWeaponInput();
  const armorInput = makeArmorInput();
  const weaponBefore = structuredClone(weaponInput);
  const armorBefore = structuredClone(armorInput);

  validateWeapons(weaponInput);
  validateArmor(armorInput);

  assert.deepEqual(weaponInput, weaponBefore);
  assert.deepEqual(armorInput, armorBefore);
});

test("rejects invalid wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/],
    [
      "runtime record field",
      (input) => { weaponRecord(input).runtimeState = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'runtimeState'/
    ],
    [
      "use profile migration field",
      (input) => { weaponRecord(input).useProfiles = []; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'useProfiles'/
    ],
    [
      "combat execution field",
      (input) => { armorRecord(input).resolutionHooks = []; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'resolutionHooks'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(`weapon ${name}`, () => expectWeaponFailure(mutate, expected));
  }
  await t.test("armor extra wrapper key", () => {
    expectArmorFailure((input) => { input.wrapper.version = 1; }, /exactly one top-level key/);
  });
  await t.test("armor runtime record field", () => {
    expectArmorFailure(
      (input) => { armorRecord(input).runtimeState = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'runtimeState'/
    );
  });
});

test("rejects weapon identity, duplicate, and item-resolution problems", async (t) => {
  await t.test("id itemKey mismatch", () => {
    expectWeaponFailure(
      (input) => { weaponRecord(input).itemKey = "short_sword"; },
      /id must equal weapon_profile\.short_sword/
    );
  });
  await t.test("duplicate id", () => {
    expectWeaponFailure(
      (input) => { input.wrapper.records.push(structuredClone(weaponRecord(input))); },
      /duplicate weapon profile id 'weapon_profile\.arming_sword'/
    );
  });
  await t.test("duplicate itemKey", () => {
    expectWeaponFailure(
      (input) => {
        const duplicate = structuredClone(weaponRecord(input));
        duplicate.id = "weapon_profile.other_sword";
        input.wrapper.records.push(duplicate);
      },
      /duplicate itemKey 'arming_sword'/
    );
  });
  await t.test("missing item", () => {
    expectWeaponFailure(
      (input) => {
        input.items = input.items.filter((item) => item.itemKey !== "arming_sword");
      },
      /itemKey 'arming_sword' is missing from items\.items/
    );
  });
  await t.test("tool-class combat profile is not weapon authority", () => {
    expectWeaponFailure(
      (input) => {
        weaponRecord(input).id = "weapon_profile.lumber_axe";
        weaponRecord(input).itemKey = "lumber_axe";
      },
      /itemKey 'lumber_axe' must reference a weapon-class item/
    );
  });
});

test("rejects weapon slot and handedness contradictions", async (t) => {
  await t.test("invalid slot", () => {
    expectWeaponFailure(
      (input) => { weaponRecord(input).compatibleSlotIds = ["slot.armor.chest"]; },
      /compatibleSlotIds\[0\] must be one of the schema enum values/
    );
  });
  await t.test("duplicate slot", () => {
    expectWeaponFailure(
      (input) => { weaponRecord(input).compatibleSlotIds = ["slot.weapon.left", "slot.weapon.left"]; },
      /compatibleSlotIds must contain unique items/
    );
  });
  await t.test("two handed requires both weapon slots", () => {
    expectWeaponFailure(
      (input) => {
        weaponRecord(input).id = "weapon_profile.short_bow";
        weaponRecord(input).itemKey = "short_bow";
        weaponRecord(input).weaponFamily = "bow";
        weaponRecord(input).handedness = "two_handed";
        weaponRecord(input).compatibleSlotIds = ["slot.weapon.right"];
        weaponRecord(input).deliveryPosture = "ranged";
        weaponRecord(input).rangePosture = "long_range";
      },
      /two_handed record weapon_profile\.short_bow must include both weapon slots/
    );
  });
});

test("rejects armor identity, duplicate, and item-resolution problems", async (t) => {
  await t.test("id itemKey mismatch", () => {
    expectArmorFailure(
      (input) => { armorRecord(input).itemKey = "plate_cuirass"; },
      /id must equal armor_profile\.plate_cuirass/
    );
  });
  await t.test("duplicate id", () => {
    expectArmorFailure(
      (input) => { input.wrapper.records.push(structuredClone(armorRecord(input))); },
      /duplicate armor profile id 'armor_profile\.leather_light_armor'/
    );
  });
  await t.test("duplicate itemKey", () => {
    expectArmorFailure(
      (input) => {
        const duplicate = structuredClone(armorRecord(input));
        duplicate.id = "armor_profile.other_leather";
        input.wrapper.records.push(duplicate);
      },
      /duplicate itemKey 'leather_light_armor'/
    );
  });
  await t.test("missing item", () => {
    expectArmorFailure(
      (input) => {
        input.items = input.items.filter((item) => item.itemKey !== "leather_light_armor");
      },
      /itemKey 'leather_light_armor' is missing from items\.items/
    );
  });
  await t.test("clothing armor-handling profile is not armor authority", () => {
    expectArmorFailure(
      (input) => {
        armorRecord(input).id = "armor_profile.travel_cloak";
        armorRecord(input).itemKey = "travel_cloak";
      },
      /itemKey 'travel_cloak' must reference an armor-class item/
    );
  });
});

test("rejects armor kind, slot, and coverage contradictions", async (t) => {
  await t.test("body armor cannot use weapon slots", () => {
    expectArmorFailure(
      (input) => { armorRecord(input).compatibleSlotIds = ["slot.weapon.left"]; },
      /body_armor record armor_profile\.leather_light_armor must use armor body slots only/
    );
  });
  await t.test("body armor cannot use shield coverage", () => {
    expectArmorFailure(
      (input) => { armorRecord(input).coverageSlotIds = ["shield_hand"]; },
      /body_armor record armor_profile\.leather_light_armor must not use shield_hand coverage/
    );
  });
  await t.test("shield must use weapon-hand slots", () => {
    expectArmorFailure(
      (input) => { armorRecord(input, 1).compatibleSlotIds = ["slot.armor.chest"]; },
      /shield record armor_profile\.buckler_shield must use weapon-hand compatible slots only/
    );
  });
  await t.test("shield must use shield coverage", () => {
    expectArmorFailure(
      (input) => { armorRecord(input, 1).coverageSlotIds = ["chest"]; },
      /shield record armor_profile\.buckler_shield must use shield_hand coverage only/
    );
  });
  await t.test("shield must use shield family", () => {
    expectArmorFailure(
      (input) => { armorRecord(input, 1).armorFamily = "leather"; },
      /shield record armor_profile\.buckler_shield must use armorFamily shield/
    );
  });
});

test("profile schemas are registered but live profile content is not registered", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/items\/weapon-profile\.schema\.json/);
  assert.match(schemaTestSource, /packages\/schemas\/items\/armor-profile\.schema\.json/);
  assert.equal(existsSync(path.join(ROOT, WEAPON_PROFILE_PATH)), false);
  assert.equal(existsSync(path.join(ROOT, ARMOR_PROFILE_PATH)), false);
  assert.doesNotMatch(contentLintSource, /weapon_profiles\.json/);
  assert.doesNotMatch(contentLintSource, /armor_profiles\.json/);
  assert.doesNotMatch(contentLintSource, /equipment-profiles\.mjs/);
});
