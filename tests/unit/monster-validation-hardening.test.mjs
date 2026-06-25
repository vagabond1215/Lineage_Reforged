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
const combatRoleWrapper = await readJson("packages/content/base/game/combat_roles.json");
const tacticsPresetWrapper = await readJson("packages/content/base/game/tactics_presets.json");

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
