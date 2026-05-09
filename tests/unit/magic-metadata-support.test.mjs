import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  CASTING_CONDUIT_TAGS,
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

test("valid item conduit tags and catalyst tiers pass", () => {
  assertNoValidationErrors(
    validateItemMagicMetadata({
      record: {
        conduitProfile: {
          conduitRole: "primary",
          castingTags: ["magic.warding", "range.aura", "delivery.ward", "cast.stable"],
          notes: "Fixture conduit metadata only."
        },
        catalystProfile: {
          tier: "catalyst.medium",
          families: ["warding", "arcane"],
          notes: "Fixture catalyst metadata only."
        }
      },
      source: "fixture.item"
    }),
    "fixture.item"
  );
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
