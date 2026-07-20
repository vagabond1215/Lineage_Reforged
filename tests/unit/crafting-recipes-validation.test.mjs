import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateCraftingRecipes } from "../../tools/content-lint/crafting-recipes.mjs";

const ROOT = process.cwd();
const RECIPE_PATH = "packages/content/base/crafting/recipes.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const recipeSchema = await readJson("packages/schemas/crafting/recipe.schema.json");
const liveRecipeWrapper = await readJson(RECIPE_PATH);
const itemWrapper = await readJson("packages/content/base/items/items.json");
const workplaceWrapper = await readJson("packages/content/base/civilization/workplaces.json");
const skillWrapper = await readJson("packages/content/base/player/skills.json");
const productionChainWrapper = await readJson("packages/content/base/civilization/production_chains.json");

const EXPANSION_RECIPES = [
  ["recipe.flax_bundle_to_linen_thread", "tailoring", [["flax_bundle", 1, "material"]], [["linen_thread", 2, "primary"]], ["workplace.loomhouse"], ["spindle"], "skill.crafting.weaving", "chain.textile.linen"],
  ["recipe.wool_fleece_to_yarn", "tailoring", [["wool_fleece", 1, "material"]], [["yarn", 2, "primary"]], ["workplace.loomhouse"], ["spindle"], "skill.crafting.weaving", "chain.textile.components"],
  ["recipe.yarn_to_wool_cloth", "tailoring", [["yarn", 2, "material"]], [["wool_cloth", 1, "primary"]], ["workplace.loomhouse"], ["weaving_shuttle"], "skill.crafting.weaving", "chain.textile.wool"],
  ["recipe.linen_thread_to_fine_cloth", "tailoring", [["linen_thread", 2, "material"]], [["fine_cloth", 1, "primary"]], ["workplace.loomhouse"], ["weaving_shuttle"], "skill.crafting.weaving", "chain.textile.cloth_grades"],
  ["recipe.flour_to_bread_dough", "baking", [["flour", 1, "ingredient"]], [["bread_dough", 1, "primary"]], ["workplace.bakery"], ["mixing_spoon"], "skill.crafting.cooking", "chain.food.bread"],
  ["recipe.fish_raw_and_salt_crystal_to_smoked_fish", "preserving", [["fish_raw", 1, "ingredient"], ["salt_crystal", 1, "ingredient"]], [["smoked_fish", 1, "primary"]], ["workplace.smokehouse"], ["smoking_rack"], "skill.crafting.cooking", "chain.food.preserved_fish"],
  ["recipe.plank_to_barrel_stave", "cooperage", [["plank", 1, "material"]], [["barrel_stave", 2, "primary"]], ["workplace.coopers_shop"], ["cooper_adze"], "skill.crafting.carpentry", "chain.cooperage.components"],
  ["recipe.barrel_stave_metal_ring_and_resin_pitch_to_cask", "cooperage", [["barrel_stave", 4, "material"], ["metal_ring", 2, "material"], ["resin_pitch", 1, "material"]], [["cask", 1, "primary"]], ["workplace.coopers_shop"], ["cooper_adze", "hoop_anvil"], "skill.crafting.carpentry", "chain.cooperage.cask"],
  ["recipe.copper_ore_to_copper_ingot", "forging", [["copper_ore", 2, "material"]], [["copper_ingot", 1, "primary"]], ["workplace.smelter_hall"], ["crucible_tongs"], "skill.crafting.smelting", "chain.metal.copper_ingot"],
  ["recipe.copper_ore_and_tin_ore_to_bronze_ingot", "forging", [["copper_ore", 2, "material"], ["tin_ore", 1, "material"]], [["bronze_ingot", 2, "primary"]], ["workplace.smelter_hall"], ["crucible_tongs"], "skill.crafting.smelting", "chain.metal.bronze_ingot"],
  ["recipe.iron_ingot_to_metal_plate", "metalsmithing", [["iron_ingot", 1, "material"]], [["metal_plate", 1, "primary"]], ["workplace.armorers_forge"], ["blacksmith_hammer"], "skill.crafting.blacksmithing", "chain.metal.components"],
  ["recipe.iron_ingot_to_blade_blank", "metalsmithing", [["iron_ingot", 1, "material"]], [["blade_blank", 1, "primary"]], ["workplace.weaponsmith_forge"], ["blacksmith_hammer"], "skill.crafting.blacksmithing", "chain.metal.components"],
  ["recipe.blade_blank_tool_handle_and_leather_strap_to_arming_sword", "assembly", [["blade_blank", 1, "material"], ["tool_handle", 1, "material"], ["leather_strap", 1, "material"]], [["arming_sword", 1, "primary"]], ["workplace.weaponsmith_forge"], ["blacksmith_hammer"], "skill.crafting.blacksmithing", "chain.warfare.weapons"],
  ["recipe.cured_leather_to_leather_strap", "leatherworking", [["cured_leather", 1, "material"]], [["leather_strap", 2, "primary"]], ["workplace.tannery"], ["tanning_scraper"], "skill.crafting.leatherworking", "chain.leather.components"],
  ["recipe.cured_leather_to_hardened_leather_panel", "leatherworking", [["cured_leather", 1, "material"]], [["hardened_leather_panel", 1, "primary"]], ["workplace.tannery"], ["tanning_scraper"], "skill.crafting.leatherworking", "chain.leather.components"],
  ["recipe.metal_ring_and_leather_strap_to_mail_coif", "assembly", [["metal_ring", 2, "material"], ["leather_strap", 1, "material"]], [["mail_coif", 1, "primary"]], ["workplace.armorers_forge"], ["blacksmith_hammer"], "skill.crafting.armoring", "chain.warfare.armor"]
];

const EXPANSION_SOURCE_NOTES = [
  "Uses only canonical item, workplace, tool, skill, and optional production-chain references from the accepted synthesis.",
  "All integer quantities are bounded_design_inference game-scale batch units, not historical yields or production-chain-derived ratios.",
  "The production-chain link is descriptive and non-inheriting; this planned static record adds no execution, inventory, or economy behavior."
];

function recipe(overrides = {}) {
  return {
    id: "recipe.iron_ingot_from_ore",
    slug: "iron_ingot_from_ore",
    name: "Iron Ingot from Ore",
    status: "planned",
    summary: "A descriptive standard recipe for turning iron ore into iron ingots.",
    recipeFamily: "forging",
    recipeSubtype: "standard",
    inputs: [
      {
        itemKey: "iron_ore",
        quantity: 2,
        role: "material"
      }
    ],
    outputs: [
      {
        itemKey: "iron_ingot",
        quantity: 1,
        role: "primary"
      }
    ],
    requiredWorkplaceIds: ["workplace.bloomery_forge"],
    requiredToolItemKeys: ["blacksmith_hammer"],
    skillRequirements: [
      {
        skillId: "skill.crafting.smelting",
        minimumRank: 1
      }
    ],
    sourceAuthorityNotes: [
      "Uses live item, workplace, skill, and production-chain authority references only."
    ],
    notes: [
      "Descriptive authority only; no runtime crafting, inventory mutation, UI, storage, reward, or gameplay behavior."
    ],
    ...overrides
  };
}

function makeInput(records = [recipe()]) {
  return {
    relativePath: RECIPE_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(recipeSchema),
    items: structuredClone(itemWrapper.records),
    workplaces: structuredClone(workplaceWrapper.records),
    skills: structuredClone(skillWrapper.records),
    productionChains: structuredClone(productionChainWrapper.records)
  };
}

function validate(input = makeInput()) {
  return validateCraftingRecipes(input);
}

function record(input) {
  return input.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validate(input), expected);
}

test("accepts a valid planned standard recipe fixture with deterministic output", () => {
  const expected = {
    ok: true,
    recipeIds: ["recipe.iron_ingot_from_ore"]
  };
  assert.deepEqual(validate(), expected);
  assert.deepEqual(validate(), expected);
});

test("does not mutate any input", () => {
  const input = makeInput();
  const before = structuredClone(input);
  validate(input);
  assert.deepEqual(input, before);
});

test("accepts optional relatedProductionChainId as a non-inheriting cross-reference", () => {
  const input = makeInput([
    recipe({
      relatedProductionChainId: "chain.alchemy.adhesive"
    })
  ]);
  const before = structuredClone(input);
  assert.equal(validate(input).ok, true);
  assert.deepEqual(input, before);
  assert.equal(record(input).facilityStrategy, undefined);
  assert.equal(record(input).recipeProfile, undefined);
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
      (input) => { record(input).runtimeState = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'runtimeState'/
    ],
    [
      "macro-production field",
      (input) => { record(input).stages = []; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'stages'/
    ],
    [
      "gameplay field",
      (input) => { record(input).gameplayEffects = []; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'gameplayEffects'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects id, slug, and duplicate identity problems", async (t) => {
  await t.test("id slug mismatch", () => {
    expectFailure(
      (input) => {
        record(input).slug = "iron_bar_from_ore";
      },
      /id must equal recipe\.iron_bar_from_ore/
    );
  });
  await t.test("duplicate id", () => {
    expectFailure(
      (input) => {
        input.wrapper.records.push(structuredClone(record(input)));
      },
      /duplicate recipe id 'recipe\.iron_ingot_from_ore'/
    );
  });
  await t.test("duplicate slug", () => {
    expectFailure(
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "recipe.other_iron_ingot";
        input.wrapper.records.push(duplicate);
      },
      /duplicate recipe slug 'iron_ingot_from_ore'/
    );
  });
});

test("rejects missing inputs, outputs, and invalid quantities", async (t) => {
  await t.test("missing inputs", () => {
    expectFailure(
      (input) => { record(input).inputs = []; },
      /inputs must contain at least 1 items/
    );
  });
  await t.test("missing outputs", () => {
    expectFailure(
      (input) => { record(input).outputs = []; },
      /outputs must contain at least 1 items/
    );
  });
  await t.test("non-positive quantity", () => {
    expectFailure(
      (input) => { record(input).inputs[0].quantity = 0; },
      /quantity must be at least 1/
    );
  });
});

test("rejects output primary-role and same-role duplication errors", async (t) => {
  await t.test("multiple primary outputs", () => {
    expectFailure(
      (input) => {
        record(input).outputs.push({ itemKey: "adhesive", quantity: 1, role: "primary" });
      },
      /must declare exactly one primary output/
    );
  });
  await t.test("missing primary output", () => {
    expectFailure(
      (input) => {
        record(input).outputs[0].role = "byproduct";
      },
      /must declare exactly one primary output/
    );
  });
  await t.test("duplicate same-role item key", () => {
    expectFailure(
      (input) => {
        record(input).inputs.push({ itemKey: "iron_ore", quantity: 1, role: "material" });
      },
      /inputs repeats itemKey 'iron_ore' with role 'material'/
    );
  });
});

test("rejects unresolved item and tool references", async (t) => {
  await t.test("missing input item", () => {
    expectFailure(
      (input) => {
        record(input).inputs[0].itemKey = "missing_ore";
      },
      /inputs\.itemKey 'missing_ore' is missing from items\.items/
    );
  });
  await t.test("missing output item", () => {
    expectFailure(
      (input) => {
        record(input).outputs[0].itemKey = "missing_ingot";
      },
      /outputs\.itemKey 'missing_ingot' is missing from items\.items/
    );
  });
  await t.test("missing tool item", () => {
    expectFailure(
      (input) => {
        record(input).requiredToolItemKeys = ["missing_tool"];
      },
      /requiredToolItemKeys 'missing_tool' is missing from items\.items/
    );
  });
  await t.test("non-tool required tool item", () => {
    expectFailure(
      (input) => {
        record(input).requiredToolItemKeys = ["iron_ingot"];
      },
      /requiredToolItemKeys 'iron_ingot' must reference a tool-class item/
    );
  });
});

test("rejects unresolved and invalid fixed workplace anchors", async (t) => {
  await t.test("missing workplace id", () => {
    expectFailure(
      (input) => {
        record(input).requiredWorkplaceIds = ["workplace.missing_forge"];
      },
      /requiredWorkplaceIds 'workplace\.missing_forge' is missing from civilization\.workplaces/
    );
  });

  const invalidAnchors = [
    "extract.forest",
    "building.smithy",
    "infrastructure.forge",
    "settlement.glasswake_shrine"
  ];
  for (const invalidAnchor of invalidAnchors) {
    await t.test(invalidAnchor, () => {
      expectFailure(
        (input) => {
          record(input).requiredWorkplaceIds = [invalidAnchor];
        },
        /requiredWorkplaceIds '.+' is not an approved workplace anchor/
      );
    });
  }
});

test("rejects unresolved skills and production-chain links", async (t) => {
  await t.test("missing skill", () => {
    expectFailure(
      (input) => {
        record(input).skillRequirements[0].skillId = "skill.crafting.missing";
      },
      /skillRequirements\.skillId 'skill\.crafting\.missing' is missing from player\.skills/
    );
  });
  await t.test("duplicate skill requirement", () => {
    expectFailure(
      (input) => {
        record(input).skillRequirements.push(structuredClone(record(input).skillRequirements[0]));
      },
      /skillRequirements repeats skillId 'skill\.crafting\.smelting'/
    );
  });
  await t.test("missing related production chain", () => {
    expectFailure(
      (input) => {
        record(input).relatedProductionChainId = "chain.missing";
      },
      /relatedProductionChainId 'chain\.missing' is missing from civilization\.production_chains/
    );
  });
});

test("rejects direct no-op self-transformations", () => {
  expectFailure(
    (input) => {
      record(input).outputs[0].itemKey = "iron_ore";
    },
    /directly transforms itemKey 'iron_ore' into itself/
  );
});

test("validates the live planned recipe content and exact expansion batch", () => {
  assert.equal(liveRecipeWrapper.records.length, 28);
  assert.equal(
    liveRecipeWrapper.records.every((liveRecipe) => liveRecipe.status === "planned"),
    true
  );
  assert.equal(
    liveRecipeWrapper.records.every((liveRecipe) => liveRecipe.recipeSubtype === "standard"),
    true
  );

  const result = validate(makeInput(liveRecipeWrapper.records));
  assert.equal(result.ok, true);
  assert.equal(result.recipeIds.length, 28);
  assert.deepEqual(
    result.recipeIds,
    [...new Set(result.recipeIds)].sort()
  );

  assert.equal(new Set(liveRecipeWrapper.records.map((entry) => entry.recipeFamily)).size, 10);
  const recordsById = new Map(liveRecipeWrapper.records.map((entry) => [entry.id, entry]));
  assert.deepEqual(
    EXPANSION_RECIPES.map(([id]) => id).sort(),
    result.recipeIds.filter((id) => EXPANSION_RECIPES.some(([expectedId]) => expectedId === id))
  );

  for (const [id, family, inputs, outputs, workplaces, tools, skillId, chainId] of EXPANSION_RECIPES) {
    const entry = recordsById.get(id);
    assert.ok(entry, `missing expansion recipe ${id}`);
    assert.equal(entry.recipeFamily, family);
    assert.equal(entry.status, "planned");
    assert.equal(entry.recipeSubtype, "standard");
    assert.deepEqual(entry.inputs.map(({ itemKey, quantity, role }) => [itemKey, quantity, role]), inputs);
    assert.deepEqual(entry.outputs.map(({ itemKey, quantity, role }) => [itemKey, quantity, role]), outputs);
    assert.deepEqual(entry.requiredWorkplaceIds, workplaces);
    assert.deepEqual(entry.requiredToolItemKeys, tools);
    assert.deepEqual(entry.skillRequirements, [{ skillId, minimumRank: 1 }]);
    assert.equal(entry.relatedProductionChainId, chainId);
    assert.deepEqual(entry.sourceAuthorityNotes, EXPANSION_SOURCE_NOTES);
    assert.equal(entry.facilityStrategy, undefined);
    assert.equal(entry.recipeProfile, undefined);
    assert.equal(entry.executionResolver, undefined);
  }
});

test("registers the schema file and live recipe content lint", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/crafting\/recipe\.schema\.json/);
  assert.match(contentLintSource, /crafting-recipes\.mjs/);
  assert.match(contentLintSource, /crafting\/recipes\.json/);
});
