import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  SPELL_PRIMARY_FAMILIES,
  validateSpellMagicMetadata
} from "../../tools/content-lint/magic-metadata-support.mjs";

async function loadContentRecords(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

function assertNoValidationErrors(errors, source) {
  assert.deepEqual(errors, [], source);
}

function minimalSpell(overrides = {}) {
  return {
    id: "spell.fixture.primary_family",
    primaryFamily: "fire",
    compatibilityStatus: "partial",
    resolutionHooks: ["damage.magic", "school.elemental"],
    ...overrides
  };
}

const ALPHA_PRIMARY_FAMILY_EXPECTATIONS = Object.freeze(
  new Map([
    ["spell.water.elemental.waterjet", "water"],
    ["spell.air.elemental.windblade", "air"],
    ["spell.earth.elemental.stone_spike", "earth"],
    ["spell.ice.elemental.ice_shard", "ice"],
    ["spell.light.elemental.radiance", "divine_light"],
    ["spell.lightning.elemental.spark", "lightning"],
    ["spell.air.enfeebling.gust", "air"],
    ["spell.lightning.enfeebling.shock", "lightning"],
    ["spell.ice.enfeebling.freeze", "ice"],
    ["spell.druidic.control.root", "earth"],
    ["spell.earth.enhancing.stone_skin", "earth"],
    ["spell.ice.enhancing.frostguard", "ice"]
  ])
);

test("spell primary family vocabulary is explicit", () => {
  assert.deepEqual(SPELL_PRIMARY_FAMILIES, [
    "fire",
    "water",
    "air",
    "earth",
    "ice",
    "lightning",
    "divine_light",
    "dark_shadow_void"
  ]);
});

test("current authored spells all declare valid primaryFamily", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const counts = new Map();

  for (const record of records) {
    counts.set(record.primaryFamily, (counts.get(record.primaryFamily) ?? 0) + 1);
    assertNoValidationErrors(
      validateSpellMagicMetadata({
        record,
        source: record.id
      }),
      record.id
    );
  }

  assert.equal(records.length, 55);
  assert.deepEqual(Object.fromEntries(counts), {
    fire: 4,
    water: 6,
    air: 6,
    earth: 11,
    lightning: 7,
    ice: 4,
    divine_light: 6,
    dark_shadow_void: 11
  });
});

test("missing and unknown primaryFamily values fail", () => {
  const missing = minimalSpell();
  delete missing.primaryFamily;
  assert.match(
    validateSpellMagicMetadata({
      record: missing,
      source: "fixture.missingPrimaryFamily"
    }).join("\n"),
    /must define primaryFamily/
  );

  assert.match(
    validateSpellMagicMetadata({
      record: minimalSpell({ primaryFamily: "storm" }),
      source: "fixture.unknownPrimaryFamily"
    }).join("\n"),
    /unknown primaryFamily 'storm'/
  );
});

test("primaryFamily inside compatibilityProfile does not satisfy top-level requirement", () => {
  const record = minimalSpell({
    compatibilityProfile: {
      primaryFamily: "fire",
      requiredTags: {
        all: ["magic.elemental"]
      }
    }
  });
  delete record.primaryFamily;

  const errors = validateSpellMagicMetadata({
    record,
    source: "fixture.profilePrimaryFamily"
  }).join("\n");

  assert.match(errors, /must define primaryFamily/);
  assert.match(errors, /unsupported metadata field 'primaryFamily'/);
});

test("Alpha compatibility profile batch keeps top-level primaryFamily mappings", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const recordsById = new Map(records.map((record) => [record.id, record]));

  for (const [id, primaryFamily] of ALPHA_PRIMARY_FAMILY_EXPECTATIONS) {
    const record = recordsById.get(id);
    assert.ok(record, `${id} exists`);
    assert.equal(record.primaryFamily, primaryFamily);
    assert.ok(record.compatibilityProfile, `${id} has compatibilityProfile`);
    assert.equal("primaryFamily" in record.compatibilityProfile, false, `${id} has no nested primaryFamily`);
  }
});

test("element to primaryFamily consistency is enforced where explicit element exists", () => {
  assertNoValidationErrors(
    validateSpellMagicMetadata({
      record: minimalSpell({
        element: "light",
        primaryFamily: "divine_light"
      }),
      source: "fixture.lightFamily"
    }),
    "fixture.lightFamily"
  );

  assertNoValidationErrors(
    validateSpellMagicMetadata({
      record: minimalSpell({
        element: "shadow",
        primaryFamily: "dark_shadow_void"
      }),
      source: "fixture.shadowFamily"
    }),
    "fixture.shadowFamily"
  );

  assert.match(
    validateSpellMagicMetadata({
      record: minimalSpell({
        element: "fire",
        primaryFamily: "water"
      }),
      source: "fixture.mismatchedElement"
    }).join("\n"),
    /must match element 'fire' as 'fire'/
  );
});

test("overlay spells without explicit element can use blueprint family mappings", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const expectedFamilies = new Map([
    ["spell.druidic.utility.speak_beast", "water"],
    ["spell.ninjutsu.ranged.shuriken", "air"],
    ["spell.performance.enhancing.war_song", "lightning"],
    ["spell.performance.enhancing.battle_rhythm", "lightning"],
    ["spell.performance.healing.mana_song", "lightning"],
    ["spell.performance.utility.march", "air"],
    ["spell.performance.enhancing.grace", "divine_light"]
  ]);

  for (const [id, primaryFamily] of expectedFamilies) {
    const record = records.find((entry) => entry.id === id);
    assert.ok(record, `${id} exists`);
    assert.equal(record.element, undefined, `${id} has no explicit element`);
    assert.equal(record.primaryFamily, primaryFamily);
    assertNoValidationErrors(
      validateSpellMagicMetadata({
        record,
        source: id
      }),
      id
    );
  }
});

test("compatibilityStatus behavior remains independent of primaryFamily", () => {
  assertNoValidationErrors(
    validateSpellMagicMetadata({
      record: minimalSpell({
        compatibilityStatus: "partial",
        compatibilityProfile: undefined
      }),
      source: "fixture.partialWithoutProfile"
    }),
    "fixture.partialWithoutProfile"
  );

  assert.match(
    validateSpellMagicMetadata({
      record: minimalSpell({
        compatibilityStatus: "ready",
        compatibilityProfile: undefined
      }),
      source: "fixture.readyWithoutProfile"
    }).join("\n"),
    /compatibilityStatus 'ready' must define compatibilityProfile/
  );
});
