import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  CASTING_CONDUIT_TAGS,
  CATALYST_FAMILIES,
  CATALYST_TIERS,
  validateItemMagicMetadata,
  validateSpellCompatibilityProfile
} from "../../tools/content-lint/magic-metadata-support.mjs";

async function loadContentRecords(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

function assertNoValidationErrors(errors, source) {
  assert.deepEqual(errors, [], source);
}

test("magic metadata vocabularies are explicit", () => {
  for (const tag of [
    "magic.elemental",
    "magic.divine",
    "magic.healing",
    "magic.enfeebling",
    "magic.enhancing",
    "magic.control",
    "magic.druidic",
    "magic.performance",
    "magic.dark",
    "magic.utility",
    "magic.warding",
    "range.touch",
    "range.short",
    "range.medium",
    "range.long",
    "range.aura",
    "delivery.projectile",
    "delivery.touch",
    "delivery.area",
    "delivery.beam",
    "delivery.self",
    "delivery.ally",
    "delivery.ward",
    "cast.fast",
    "cast.stable",
    "cast.precise",
    "cast.risky",
    "cast.slow",
    "cast.ritual",
    "cast.rhythmic",
    "power.low",
    "power.medium",
    "power.high",
    "control.easy",
    "control.moderate",
    "control.hard"
  ]) {
    assert.ok(CASTING_CONDUIT_TAGS.includes(tag), tag);
  }

  assert.deepEqual(CATALYST_TIERS, [
    "catalyst.none",
    "catalyst.trace",
    "catalyst.small",
    "catalyst.medium",
    "catalyst.large",
    "catalyst.bulk"
  ]);

  assert.deepEqual(CATALYST_FAMILIES, [
    "arcane",
    "elemental",
    "fire",
    "water",
    "air",
    "earth",
    "ice",
    "light",
    "lightning",
    "shadow",
    "divine",
    "sanctified",
    "fuel",
    "heat",
    "binding",
    "botanical",
    "herb",
    "seed",
    "flower",
    "living_plant"
  ]);
});

test("valid spell compatibility tags pass", () => {
  assertNoValidationErrors(
    validateSpellCompatibilityProfile({
      profile: {
        requiredTags: {
          all: ["magic.elemental"],
          any: [["range.short", "range.medium"]]
        },
        preferredTags: ["delivery.projectile", "cast.fast"],
        discouragedTags: ["cast.slow"],
        freecastAllowed: true,
        catalystFamilies: ["fire", "fuel"],
        catalystTiers: ["catalyst.trace", "catalyst.small"],
        notes: "Fixture metadata only."
      },
      source: "fixture.spell.compatibilityProfile"
    }),
    "fixture.spell.compatibilityProfile"
  );
});

test("valid item conduit tags pass on supported item families", () => {
  assertNoValidationErrors(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_kite_shield",
        itemKey: "kite_shield",
        name: "Kite Shield",
        itemClass: "armor",
        itemBranch: "shield",
        itemSubBranch: "standard",
        conduitProfile: {
          conduitRole: "defensive",
          castingTags: ["magic.warding", "range.aura", "delivery.ward", "cast.stable"],
          notes: "Fixture conduit metadata only."
        }
      },
      source: "fixture.item"
    }),
    "fixture.item"
  );
});

test("valid catalyst tiers and families pass on catalyst records", () => {
  assertNoValidationErrors(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_elemental_crystal",
        itemKey: "elemental_crystal",
        name: "Elemental Crystal",
        itemClass: "commodity",
        itemBranch: "arcane",
        itemSubBranch: "vessel",
        roles: ["material", "reagent"],
        catalystProfile: {
          tier: "catalyst.medium",
          families: ["elemental", "arcane"],
          notes: "Fixture catalyst metadata only."
        }
      },
      source: "fixture.item"
    }),
    "fixture.item"
  );
});

test("current Dirk Dagger conduit metadata is valid", async () => {
  const itemRecords = await loadContentRecords("packages/content/base/items/items.json");
  const dirkDagger = itemRecords.find((entry) => entry.id === "item.dirk_dagger");
  assert.ok(dirkDagger, "item.dirk_dagger exists");
  assertNoValidationErrors(
    validateItemMagicMetadata({
      record: dirkDagger,
      source: "item.dirk_dagger"
    }),
    "item.dirk_dagger"
  );
});

test("constrained dagger and knife conduit profiles are valid", () => {
  assertNoValidationErrors(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_ritual_knife",
        itemKey: "ritual_knife",
        name: "Ritual Knife",
        itemClass: "weapon",
        itemBranch: "melee",
        itemSubBranch: "knife",
        conduitProfile: {
          conduitRole: "secondary",
          castingTags: [
            "magic.elemental",
            "magic.dark",
            "range.touch",
            "range.short",
            "delivery.touch",
            "delivery.projectile",
            "cast.fast",
            "cast.precise",
            "cast.risky",
            "power.low",
            "control.moderate"
          ]
        }
      },
      source: "fixture.ritualKnife"
    }),
    "fixture.ritualKnife"
  );
});

test("constrained sword blade-arc conduit profiles are valid", () => {
  assertNoValidationErrors(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_arming_sword",
        itemKey: "arming_sword",
        name: "Arming Sword",
        itemClass: "weapon",
        itemBranch: "melee",
        itemSubBranch: "standard",
        conduitProfile: {
          conduitRole: "primary",
          castingTags: [
            "magic.elemental",
            "magic.warding",
            "range.touch",
            "range.short",
            "range.medium",
            "delivery.touch",
            "delivery.projectile",
            "delivery.area",
            "cast.precise",
            "cast.stable",
            "power.medium",
            "control.moderate"
          ]
        }
      },
      source: "fixture.armingSword"
    }),
    "fixture.armingSword"
  );
});

test("melee weapon conduit metadata is judged by plausible profile, not rejected by weapon class", () => {
  assertNoValidationErrors(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_plain_sword",
        itemKey: "plain_sword",
        name: "Plain Sword",
        itemClass: "weapon",
        itemBranch: "melee",
        itemSubBranch: "standard",
        conduitProfile: {
          castingTags: ["magic.enfeebling", "range.short", "delivery.touch", "cast.precise", "power.low", "control.moderate"]
        }
      },
      source: "fixture.plainSword"
    }),
    "fixture.plainSword"
  );
});

test("overbroad dagger conduit profiles fail", () => {
  assert.match(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_dagger_long",
        itemKey: "dirk_dagger",
        name: "Dirk Dagger",
        itemClass: "weapon",
        itemBranch: "melee",
        itemSubBranch: "dagger",
        conduitProfile: {
          castingTags: ["range.long", "delivery.touch", "cast.precise", "power.low", "control.moderate"]
        }
      },
      source: "fixture.daggerLong"
    }).join("\n"),
    /range\.long'.*not allowed for dagger\/knife/
  );

  assert.match(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_dagger_high",
        itemKey: "dirk_dagger",
        name: "Dirk Dagger",
        itemClass: "weapon",
        itemBranch: "melee",
        itemSubBranch: "dagger",
        conduitProfile: {
          castingTags: ["range.short", "delivery.touch", "cast.fast", "power.high", "control.moderate"]
        }
      },
      source: "fixture.daggerHigh"
    }).join("\n"),
    /power\.high'.*not allowed for dagger\/knife/
  );
});

test("overbroad sword conduit profiles fail", () => {
  assert.match(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_sword_aura",
        itemKey: "arming_sword",
        name: "Arming Sword",
        itemClass: "weapon",
        itemBranch: "melee",
        itemSubBranch: "standard",
        conduitProfile: {
          castingTags: ["magic.healing", "range.aura", "delivery.self", "cast.stable", "power.high", "control.moderate"]
        }
      },
      source: "fixture.swordAura"
    }).join("\n"),
    /range\.aura'.*not allowed for sword/
  );
});

test("projectile weapon conduits reject general spellcasting lanes", () => {
  assert.match(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_composite_bow",
        itemKey: "composite_bow",
        name: "Composite Bow",
        itemClass: "weapon",
        itemBranch: "range",
        itemSubBranch: "bow",
        conduitProfile: {
          conduitRole: "imbued_projectile",
          castingTags: ["range.aura", "delivery.ally", "delivery.projectile", "cast.stable", "power.medium", "control.moderate"]
        }
      },
      source: "fixture.bowGeneral"
    }).join("\n"),
    /range\.aura'.*not allowed for projectile weapon/
  );
});

test("catalyst profiles are restricted to plausible catalyst records", () => {
  assert.match(
    validateItemMagicMetadata({
      record: {
        id: "item.fixture_arming_sword",
        itemKey: "arming_sword",
        name: "Arming Sword",
        itemClass: "weapon",
        itemBranch: "melee",
        itemSubBranch: "standard",
        catalystProfile: {
          tier: "catalyst.small",
          families: ["arcane"]
        }
      },
      source: "fixture.weaponCatalyst"
    }).join("\n"),
    /only allowed on plausible catalyst, material, reagent, fuel, or vessel records/
  );
});

test("voice and performance are not catalyst families", () => {
  const errors = validateSpellCompatibilityProfile({
    profile: {
      requiredTags: {
        all: ["magic.performance"]
      },
      catalystFamilies: ["voice", "performance"]
    },
    source: "fixture.performanceSpell.compatibilityProfile"
  }).join("\n");
  assert.match(errors, /unknown catalyst family 'voice'/);
  assert.match(errors, /unknown catalyst family 'performance'/);
});

test("catalyst family drift terms fail", () => {
  for (const family of ["void", "stone", "wind", "thunder"]) {
    assert.match(
      validateItemMagicMetadata({
        record: {
          id: `item.fixture_${family}_crystal`,
          itemKey: `${family}_crystal`,
          name: `${family} Crystal`,
          itemClass: "commodity",
          itemBranch: "arcane",
          itemSubBranch: "vessel",
          roles: ["material", "reagent"],
          catalystProfile: {
            tier: "catalyst.trace",
            families: [family]
          }
        },
        source: `fixture.${family}Crystal`
      }).join("\n"),
      new RegExp(`unknown catalyst family '${family}'`)
    );
  }
});

test("unknown casting tags and catalyst tiers fail", () => {
  assert.match(
    validateSpellCompatibilityProfile({
      profile: {
        requiredTags: {
          all: ["magic.future"]
        }
      },
      source: "fixture.spell.compatibilityProfile"
    }).join("\n"),
    /unknown casting\/conduit tag 'magic\.future'/
  );

  assert.match(
    validateItemMagicMetadata({
      record: {
        conduitProfile: {
          castingTags: ["delivery.future"]
        },
        catalystProfile: {
          tier: "catalyst.massive"
        }
      },
      source: "fixture.item"
    }).join("\n"),
    /unknown catalyst tier 'catalyst\.massive'/
  );
});

test("broad wildcard namespaces fail", () => {
  assert.match(
    validateSpellCompatibilityProfile({
      profile: {
        requiredTags: {
          all: ["magic.*"]
        }
      },
      source: "fixture.spell.compatibilityProfile"
    }).join("\n"),
    /must not use broad wildcard casting\/conduit tag 'magic\.\*'/
  );

  assert.match(
    validateItemMagicMetadata({
      record: {
        catalystProfile: {
          tier: "catalyst.*"
        }
      },
      source: "fixture.item"
    }).join("\n"),
    /must not use broad wildcard catalyst tier 'catalyst\.\*'/
  );
});

test("required, preferred, and discouraged tag shapes are validated", () => {
  assert.match(
    validateSpellCompatibilityProfile({
      profile: {
        requiredTags: ["magic.elemental"]
      },
      source: "fixture.invalidRequired"
    }).join("\n"),
    /requiredTags must be an object/
  );

  assert.match(
    validateSpellCompatibilityProfile({
      profile: {
        requiredTags: {
          any: ["range.short"]
        },
        preferredTags: [["cast.fast"]],
        discouragedTags: "cast.slow"
      },
      source: "fixture.invalidShapes"
    }).join("\n"),
    /preferredTags\[0\] must be a non-empty string/
  );

  assert.match(
    validateSpellCompatibilityProfile({
      profile: {
        requiredTags: {
          any: ["range.short"]
        },
        preferredTags: [["cast.fast"]],
        discouragedTags: "cast.slow"
      },
      source: "fixture.invalidShapes"
    }).join("\n"),
    /discouragedTags must be an array/
  );
});

test("current tagged magic metadata passes", async () => {
  const spellRecords = await loadContentRecords("packages/content/base/player/spells.json");
  for (const record of spellRecords.filter((entry) => entry.compatibilityProfile)) {
    assertNoValidationErrors(
      validateSpellCompatibilityProfile({
        profile: record.compatibilityProfile,
        source: `${record.id}.compatibilityProfile`
      }),
      record.id
    );
  }

  const itemRecords = await loadContentRecords("packages/content/base/items/items.json");
  for (const record of itemRecords.filter((entry) => entry.conduitProfile || entry.catalystProfile)) {
    assertNoValidationErrors(
      validateItemMagicMetadata({
        record,
        source: record.id
      }),
      record.id
    );
  }
});
