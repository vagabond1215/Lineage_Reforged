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
const itemWrapper = await readJson("packages/content/base/items/items.json");
const workplaceWrapper = await readJson("packages/content/base/civilization/workplaces.json");
const skillWrapper = await readJson("packages/content/base/player/skills.json");
const productionChainWrapper = await readJson("packages/content/base/civilization/production_chains.json");

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

test("registers the schema file but not live recipe content lint", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/crafting\/recipe\.schema\.json/);
  assert.doesNotMatch(contentLintSource, /crafting-recipes\.mjs/);
  assert.doesNotMatch(contentLintSource, /crafting\/recipes\.json/);
});
