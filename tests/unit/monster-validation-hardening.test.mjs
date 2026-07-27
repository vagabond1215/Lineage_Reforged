import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateMonsterAuthority } from "../../tools/content-lint/monsters.mjs";

const ROOT = process.cwd();
const MONSTER_PATH = "packages/content/base/world/monsters.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const monsterWrapper = await readJson(MONSTER_PATH);
const itemWrapper = await readJson("packages/content/base/items/items.json");
const marketWrapper = await readJson("packages/content/base/civilization/market_item_values.json");
const faunaWrapper = await readJson("packages/content/base/world/fauna.json");
const ecologyWrapper = await readJson("packages/content/base/world/regional_ecology_profiles.json");
const regionWrapper = await readJson("packages/content/base/world/regions.json");
const biomeWrapper = await readJson("packages/content/base/world/biomes.json");
const habitatWrapper = await readJson("packages/content/base/world/habitats.json");
const combatRoleWrapper = await readJson("packages/content/base/game/combat_roles.json");
const tacticsPresetWrapper = await readJson("packages/content/base/game/tactics_presets.json");
const combatEngineSource = await readFile(
  path.join(ROOT, "packages/engines/game-engine/src/combat/index.ts"),
  "utf8"
);

function expectedDrops(itemKeys) {
  const chances = [0.82, 0.68, 0.54, 0.4, 0.26];
  return itemKeys.map((itemKey, index) => ({
    itemKey,
    quantityMin: 1,
    quantityMax: index === 0 ? 2 : 1,
    chance: chances[index]
  }));
}

const LIVE_EXPANSION = [
  {
    id: "monster.kaelvar_cliff_viper",
    name: "Kaelvar Cliff Viper",
    faunaId: "fauna.cliff_viper",
    ecologyId: "regional_ecology.kaelvar",
    regionId: "region.kaelvar",
    biomeId: "biome.shrublands.dry_scrub",
    threat: "high",
    habitatTags: ["dry_scrub", "sea_cliff", "scree_run", "ravine"],
    behaviorTags: ["ambush_predator", "territorial", "venomous"],
    role: "disruptor",
    actionPackageIds: ["melee_skirmisher", "enfeebling_burst"],
    templateId: "monster.cave_spider_matron",
    dropItemKeys: ["cliff_viper_meat", "cliff_viper_scale", "cliff_viper_bone"]
  },
  {
    id: "monster.valtherion_brown_bear",
    name: "Valtherion Brown Bear",
    faunaId: "fauna.bear",
    ecologyId: "regional_ecology.valtherion",
    regionId: "region.valtherion",
    biomeId: "biome.temperate.mixed_forest",
    threat: "high",
    habitatTags: ["mixed_forest", "rapids", "estuary", "forest_edge"],
    behaviorTags: ["territorial", "foraging", "defensive"],
    role: "frontliner",
    actionPackageIds: ["melee_brute"],
    templateId: "monster.ember_boar",
    dropItemKeys: ["bear_meat", "bear_hide", "bear_bone", "bear_claw"]
  },
  {
    id: "monster.serathyl_ravine_wolverine",
    name: "Serathyl Ravine Wolverine",
    faunaId: "fauna.wolverine",
    ecologyId: "regional_ecology.serathyl",
    regionId: "region.serathyl",
    biomeId: "biome.temperate.temperate_rainforest",
    threat: "high",
    habitatTags: ["temperate_rainforest", "talus_field", "ravine", "cliff"],
    behaviorTags: ["solitary", "territorial", "relentless"],
    role: "opportunist",
    actionPackageIds: ["melee_skirmisher"],
    templateId: "monster.shadow_wolf",
    dropItemKeys: ["wolverine_meat", "wolverine_fur", "wolverine_bone"]
  },
  {
    id: "monster.draemor_marsh_alligator",
    name: "Draemor Marsh Alligator",
    faunaId: "fauna.american_alligator",
    ecologyId: "regional_ecology.draemor",
    regionId: "region.draemor",
    biomeId: "biome.wetlands.marsh",
    threat: "high",
    habitatTags: ["marsh", "marsh_pool", "oxbow_lake", "estuary"],
    behaviorTags: ["ambush_predator", "territorial", "aquatic"],
    role: "tank_protector",
    actionPackageIds: ["melee_brute"],
    templateId: "monster.bog_troll",
    dropItemKeys: ["american_alligator_meat", "american_alligator_hide", "american_alligator_bone"]
  },
  {
    id: "monster.talmyran_savanna_scorpion",
    name: "Talmyran Savanna Scorpion",
    faunaId: "fauna.scorpion",
    ecologyId: "regional_ecology.talmyra",
    regionId: "region.talmyra",
    biomeId: "biome.grasslands.savanna",
    threat: "moderate",
    habitatTags: ["savanna", "talus_field", "scree_run", "ravine"],
    behaviorTags: ["ambush_predator", "territorial", "venomous"],
    role: "disruptor",
    actionPackageIds: ["melee_skirmisher", "enfeebling_burst"],
    templateId: "monster.dune_scorpion",
    dropItemKeys: ["scorpion_meat", "scorpion_venom", "scorpion_chitin"]
  },
  {
    id: "monster.myridian_reef_lobster",
    name: "Myridian Reef Lobster",
    faunaId: "fauna.reef_lobster",
    ecologyId: "regional_ecology.myridian_chain",
    regionId: "region.myridian_chain",
    biomeId: "biome.marine.marine",
    threat: "moderate",
    habitatTags: ["marine", "coral_reef_fringe", "tide_pools", "kelp_forest_coastal"],
    behaviorTags: ["territorial", "armored", "aquatic"],
    role: "tank_protector",
    actionPackageIds: ["melee_brute"],
    templateId: "monster.dire_boar",
    dropItemKeys: ["reef_lobster_meat", "reef_lobster_shell"]
  },
  {
    id: "monster.lantern_glowmire_caecilian",
    name: "Lantern Glowmire Caecilian",
    faunaId: "fauna.glowmire_caecilian",
    ecologyId: "regional_ecology.lantern_isles",
    regionId: "region.lantern_isles",
    biomeId: "biome.wetlands.mangrove_forest",
    threat: "moderate",
    habitatTags: ["mangrove_forest", "marsh_pool", "cave_flooded", "thicket"],
    behaviorTags: ["ambush_predator", "subterranean", "aquatic"],
    role: "debuffer_controller",
    actionPackageIds: ["melee_brute"],
    templateId: "monster.mire_slime",
    dropItemKeys: ["glowmire_caecilian_meat", "glowmire_caecilian_hide", "glowmire_caecilian_bone"]
  },
  {
    id: "monster.serpents_wake_tide_lizard",
    name: "Serpent's Wake Tide Lizard",
    faunaId: "fauna.tide_lizard",
    ecologyId: "regional_ecology.serpents_wake",
    regionId: "region.serpents_wake",
    biomeId: "biome.wetlands.mangrove_forest",
    threat: "low",
    habitatTags: ["mangrove_forest", "tidal_flat", "shoreline", "tide_pools"],
    behaviorTags: ["opportunistic", "territorial", "aquatic"],
    role: "opportunist",
    actionPackageIds: ["melee_skirmisher"],
    templateId: "monster.granary_rat",
    dropItemKeys: ["tide_lizard_meat", "tide_lizard_scale", "tide_lizard_bone"]
  },
  {
    id: "monster.dawnreach_bull_walrus",
    name: "Dawnreach Bull Walrus",
    faunaId: "fauna.walrus",
    ecologyId: "regional_ecology.dawnreach_isles",
    regionId: "region.dawnreach_isles",
    biomeId: "biome.polar.tundra",
    threat: "high",
    habitatTags: ["tundra", "shoreline", "tidal_flat", "kelp_forest_coastal"],
    behaviorTags: ["territorial", "herd_defender", "aquatic"],
    role: "tank_protector",
    actionPackageIds: ["melee_brute"],
    templateId: "monster.bog_troll",
    dropItemKeys: ["walrus_meat", "walrus_hide", "walrus_tusk", "walrus_bone"]
  }
];

function makeInput(records = monsterWrapper.records) {
  return {
    relativePath: MONSTER_PATH,
    wrapper: { records: structuredClone(records) },
    items: structuredClone(itemWrapper.records),
    marketItemValues: structuredClone(marketWrapper.records),
    fauna: structuredClone(faunaWrapper.records),
    combatRoles: structuredClone(combatRoleWrapper.records),
    tacticsPresets: structuredClone(tacticsPresetWrapper.records)
  };
}

function validate(input = makeInput()) {
  return validateMonsterAuthority(input);
}

function record(input, index = 0) {
  return input.wrapper.records[index];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validate(input), expected);
}

test("accepts current live monsters with deterministic output", () => {
  const result = validate();
  assert.equal(result.ok, true);
  assert.equal(result.monsterIds.length, monsterWrapper.records.length);
  assert.deepEqual(result.monsterIds, [...result.monsterIds].sort());
});

test("accepts the exact regional species expansion package", () => {
  const monsterById = new Map(monsterWrapper.records.map((monster) => [monster.id, monster]));
  const faunaById = new Map(faunaWrapper.records.map((fauna) => [fauna.id, fauna]));
  const ecologyById = new Map(ecologyWrapper.records.map((ecology) => [ecology.id, ecology]));
  const regionIds = new Set(regionWrapper.records.map((region) => region.id));
  const biomeIds = new Set(biomeWrapper.records.map((biome) => biome.id));
  const biomeSlugs = new Set(biomeWrapper.records.map((biome) => biome.slug));
  const habitatSlugs = new Set(habitatWrapper.records.map((habitat) => habitat.slug));
  const itemKeys = new Set(itemWrapper.records.map((item) => item.itemKey));
  const marketItemKeys = new Set(marketWrapper.records.map((item) => item.itemKey));
  const roleIds = new Set(combatRoleWrapper.records.map((role) => role.id));
  const presetIds = new Set(tacticsPresetWrapper.records.map((preset) => preset.id));
  const countBy = (field) => Object.fromEntries(
    [...Map.groupBy(monsterWrapper.records, (monster) => monster[field])]
      .map(([key, records]) => [key, records.length])
  );

  assert.equal(monsterWrapper.records.length, 33);
  assert.deepEqual(countBy("monsterClass"), {
    humanoid: 6,
    beast: 18,
    ooze: 3,
    elemental: 2,
    giantkin: 1,
    undead: 3
  });
  assert.deepEqual(countBy("threat"), {
    low: 6,
    moderate: 15,
    high: 11,
    severe: 1
  });
  assert.equal(monsterWrapper.records.reduce((total, monster) => total + monster.drops.length, 0), 77);
  assert.equal(monsterWrapper.records.reduce((total, monster) => total + monster.loot.length, 0), 20);
  assert.equal(monsterWrapper.records.filter((monster) => monster.loot.length === 0).length, 21);
  assert.equal(
    monsterWrapper.records.filter(
      (monster) => monster.baseFaunaId !== undefined || monster.baseMonsterId !== undefined
    ).length,
    LIVE_EXPANSION.length
  );
  assert.deepEqual(
    monsterWrapper.records
      .filter((monster) => monster.baseFaunaId !== undefined)
      .map((monster) => monster.id)
      .sort(),
    LIVE_EXPANSION.map((expected) => expected.id).sort()
  );
  assert.equal(new Set(monsterWrapper.records.map((monster) => monster.id)).size, 33);
  assert.equal(new Set(monsterWrapper.records.map((monster) => monster.slug)).size, 33);
  assert.equal(new Set(monsterWrapper.records.map((monster) => monster.name)).size, 33);

  for (const expected of LIVE_EXPANSION) {
    const monster = monsterById.get(expected.id);
    const slug = expected.id.slice("monster.".length);
    assert.ok(monster, `${expected.id} must be present`);
    assert.deepEqual(
      {
        id: monster.id,
        slug: monster.slug,
        name: monster.name,
        monsterClass: monster.monsterClass,
        baseFaunaId: monster.baseFaunaId,
        variantType: monster.variantType,
        threat: monster.threat,
        habitatTags: monster.habitatTags,
        behaviorTags: monster.behaviorTags,
        defaultRole: monster.defaultRole,
        actionPackageIds: monster.actionPackageIds,
        drops: monster.drops,
        loot: monster.loot
      },
      {
        id: expected.id,
        slug,
        name: expected.name,
        monsterClass: "beast",
        baseFaunaId: expected.faunaId,
        variantType: "species_only",
        threat: expected.threat,
        habitatTags: expected.habitatTags,
        behaviorTags: expected.behaviorTags,
        defaultRole: expected.role,
        actionPackageIds: expected.actionPackageIds,
        drops: expectedDrops(expected.dropItemKeys),
        loot: []
      }
    );

    const template = monsterById.get(expected.templateId);
    assert.ok(template, `${expected.templateId} template must be present`);
    assert.deepEqual(monster.combatProfile, template.combatProfile);
    assert.deepEqual(monster.difficultyScalingHooks, template.difficultyScalingHooks);

    const fauna = faunaById.get(expected.faunaId);
    assert.ok(fauna, `${expected.faunaId} must be present`);
    const slaughterProducts = fauna.template.output.slaughterOutput.products;
    assert.deepEqual(
      monster.drops.map((drop) => drop.itemKey),
      [...slaughterProducts.ingredients, ...slaughterProducts.byproducts]
    );

    const ecology = ecologyById.get(expected.ecologyId);
    assert.ok(ecology, `${expected.ecologyId} must be present`);
    assert.equal(ecology.regionId, expected.regionId);
    assert.equal(regionIds.has(expected.regionId), true);
    assert.equal(biomeIds.has(expected.biomeId), true);
    assert.equal(
      ecology.nativeFaunaIds.filter((faunaId) => faunaId === expected.faunaId).length,
      1
    );
    assert.equal(
      ecologyWrapper.records.reduce(
        (total, candidate) => total + candidate.nativeFaunaIds.filter(
          (faunaId) => faunaId === expected.faunaId
        ).length,
        0
      ),
      1
    );

    for (const habitatTag of expected.habitatTags) {
      assert.equal(
        biomeSlugs.has(habitatTag) || habitatSlugs.has(habitatTag),
        true,
        `${habitatTag} must resolve to a biome or habitat`
      );
    }
    assert.equal(roleIds.has(expected.role), true);
    assert.equal(presetIds.has(`preset.enemy.${expected.role}`), true);
    for (const actionPackageId of expected.actionPackageIds) {
      assert.match(combatEngineSource, new RegExp(`^\\s*${actionPackageId}:`, "m"));
    }
    for (const drop of monster.drops) {
      assert.equal(itemKeys.has(drop.itemKey), true);
      assert.equal(marketItemKeys.has(drop.itemKey), true);
    }

    for (const prohibitedField of [
      "baseMonsterId",
      "regionId",
      "biomeId",
      "ecologyId",
      "attunement",
      "elements",
      "origin",
      "spawnRules",
      "population",
      "attacks",
      "effects",
      "rewards",
      "lootTableId"
    ]) {
      assert.equal(Object.hasOwn(monster, prohibitedField), false);
    }
  }
});

test("does not mutate any input", () => {
  const input = makeInput();
  const before = structuredClone(input);
  validate(input);
  assert.deepEqual(input, before);
});

test("rejects invalid wrappers", async (t) => {
  const cases = [
    ["non-object", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects identity mismatches and duplicate identities", async (t) => {
  await t.test("id slug mismatch", () => {
    expectFailure(
      (input) => {
        record(input).slug = "renamed_kobold";
      },
      /id must equal monster\.renamed_kobold/
    );
  });
  await t.test("duplicate id", () => {
    expectFailure(
      (input) => {
        input.wrapper.records.push(structuredClone(record(input)));
      },
      /duplicate monster id 'monster\.kobold_scavenger'/
    );
  });
  await t.test("duplicate slug", () => {
    expectFailure(
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "monster.other_kobold";
        input.wrapper.records.push(duplicate);
      },
      /duplicate monster slug 'kobold_scavenger'/
    );
  });
});

test("rejects duplicate descriptive tags and source-local item keys", async (t) => {
  await t.test("habitat tags", () => {
    expectFailure(
      (input) => {
        record(input).habitatTags.push(record(input).habitatTags[0]);
      },
      /duplicate habitatTags value 'mine_tunnel'/
    );
  });
  await t.test("behavior tags", () => {
    expectFailure(
      (input) => {
        record(input).behaviorTags.push(record(input).behaviorTags[0]);
      },
      /duplicate behaviorTags value 'pack_hunter'/
    );
  });
  await t.test("drop item keys", () => {
    expectFailure(
      (input) => {
        record(input).drops.push(structuredClone(record(input).drops[0]));
      },
      /duplicate drops\.itemKey 'kobold_scrap'/
    );
  });
  await t.test("loot item keys", () => {
    expectFailure(
      (input) => {
        record(input).loot.push(structuredClone(record(input).loot[0]));
      },
      /duplicate loot\.itemKey 'kobold_bauble'/
    );
  });
});

test("resolves drops and loot directly against item and market authority", async (t) => {
  await t.test("drop item missing from items", () => {
    expectFailure(
      (input) => {
        input.items = input.items.filter((item) => item.itemKey !== "kobold_scrap");
      },
      /drops\.itemKey 'kobold_scrap' is missing from items\.items/
    );
  });
  await t.test("loot item missing from items", () => {
    expectFailure(
      (input) => {
        input.items = input.items.filter((item) => item.itemKey !== "kobold_bauble");
      },
      /loot\.itemKey 'kobold_bauble' is missing from items\.items/
    );
  });
  await t.test("drop item missing market value", () => {
    expectFailure(
      (input) => {
        input.marketItemValues = input.marketItemValues.filter((item) => item.itemKey !== "kobold_scrap");
      },
      /drops\.itemKey 'kobold_scrap' is missing from market item values/
    );
  });
  await t.test("loot item missing market value", () => {
    expectFailure(
      (input) => {
        input.marketItemValues = input.marketItemValues.filter((item) => item.itemKey !== "kobold_bauble");
      },
      /loot\.itemKey 'kobold_bauble' is missing from market item values/
    );
  });
});

test("validates optional fauna and monster lineage without requiring variants on base records", async (t) => {
  const faunaId = faunaWrapper.records[0].id;

  await t.test("accepts base fauna lineage with variant type", () => {
    const input = makeInput();
    record(input).baseFaunaId = faunaId;
    record(input).variantType = "biological";
    assert.equal(validate(input).ok, true);
  });

  await t.test("accepts base monster lineage with variant type", () => {
    const input = makeInput();
    record(input).baseMonsterId = input.wrapper.records[1].id;
    record(input).variantType = "species_only";
    assert.equal(validate(input).ok, true);
  });

  await t.test("missing base fauna", () => {
    expectFailure(
      (input) => {
        record(input).baseFaunaId = "fauna.missing";
        record(input).variantType = "biological";
      },
      /baseFaunaId 'fauna\.missing' is missing from world\.fauna/
    );
  });

  await t.test("missing base monster", () => {
    expectFailure(
      (input) => {
        record(input).baseMonsterId = "monster.missing";
        record(input).variantType = "species_only";
      },
      /baseMonsterId 'monster\.missing' is missing from world\.monsters/
    );
  });

  await t.test("self reference", () => {
    expectFailure(
      (input) => {
        record(input).baseMonsterId = record(input).id;
        record(input).variantType = "species_only";
      },
      /self-referencing baseMonsterId/
    );
  });

  await t.test("lineage cycle", () => {
    expectFailure(
      (input) => {
        record(input, 0).baseMonsterId = record(input, 1).id;
        record(input, 0).variantType = "species_only";
        record(input, 1).baseMonsterId = record(input, 0).id;
        record(input, 1).variantType = "species_only";
      },
      /baseMonsterId lineage cycle/
    );
  });

  await t.test("base requires variant type", () => {
    expectFailure(
      (input) => {
        record(input).baseFaunaId = faunaId;
      },
      /must define variantType when baseMonsterId or baseFaunaId is present/
    );
  });

  await t.test("variant type requires base authority", () => {
    expectFailure(
      (input) => {
        record(input).variantType = "biological";
      },
      /must define baseMonsterId or baseFaunaId when variantType is present/
    );
  });
});

test("validates monster role and derived enemy tactics preset convention", async (t) => {
  await t.test("missing combat role", () => {
    expectFailure(
      (input) => {
        input.combatRoles = input.combatRoles.filter((role) => role.id !== "opportunist");
      },
      /defaultRole 'opportunist' is missing from game\.combat_roles/
    );
  });

  await t.test("missing expected enemy preset", () => {
    expectFailure(
      (input) => {
        input.tacticsPresets = input.tacticsPresets.filter((preset) => preset.id !== "preset.enemy.opportunist");
      },
      /requires tactics preset 'preset\.enemy\.opportunist'/
    );
  });

  await t.test("used role without current enemy preset", () => {
    expectFailure(
      (input) => {
        record(input).defaultRole = "support_buffer";
      },
      /requires tactics preset 'preset\.enemy\.support_buffer'/
    );
  });
});

test("normal content lint wires the monster authority helper", async () => {
  const source = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(source, /validateMonsterAuthority/);
  assert.match(source, /validateMonsterAuthorityAgainstDependencies/);
});
