import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  SPELL_COMPATIBILITY_STATUSES,
  validateSpellMagicMetadata
} from "../../tools/content-lint/magic-metadata-support.mjs";

async function loadContentRecords(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

function validCompatibilityProfile() {
  return {
    requiredTags: {
      all: ["magic.elemental"]
    },
    preferredTags: ["range.short"],
    freecastAllowed: true,
    notes: "Fixture metadata only."
  };
}

function assertNoValidationErrors(errors, source) {
  assert.deepEqual(errors, [], source);
}

test("spell compatibility statuses are explicit", () => {
  assert.deepEqual(SPELL_COMPATIBILITY_STATUSES, ["ready", "partial", "deferred", "placeholder"]);
});

test("valid spell compatibility statuses pass", () => {
  for (const status of SPELL_COMPATIBILITY_STATUSES) {
    assertNoValidationErrors(
      validateSpellMagicMetadata({
        record: {
          id: `spell.fixture.${status}`,
          primaryFamily: "fire",
          compatibilityStatus: status,
          compatibilityProfile: status === "ready" ? validCompatibilityProfile() : undefined,
          resolutionHooks: ["damage.magic", "school.elemental"]
        },
        source: `spell.fixture.${status}`
      }),
      status
    );
  }
});

test("unknown spell compatibility statuses fail", () => {
  assert.match(
    validateSpellMagicMetadata({
      record: {
        id: "spell.fixture.unknown_status",
        primaryFamily: "fire",
        compatibilityStatus: "future_ready",
        resolutionHooks: ["damage.magic"]
      },
      source: "spell.fixture.unknown_status"
    }).join("\n"),
    /unknown compatibilityStatus 'future_ready'/
  );
});

test("ready spells require compatibilityProfile", () => {
  assert.match(
    validateSpellMagicMetadata({
      record: {
        id: "spell.fixture.ready_missing_profile",
        primaryFamily: "fire",
        compatibilityStatus: "ready",
        resolutionHooks: ["damage.magic", "school.elemental"]
      },
      source: "spell.fixture.ready_missing_profile"
    }).join("\n"),
    /compatibilityStatus 'ready' must define compatibilityProfile/
  );
});

test("ready spells reject deferred spell hooks", () => {
  assert.match(
    validateSpellMagicMetadata({
      record: {
        id: "spell.fixture.ready_deferred_hook",
        primaryFamily: "fire",
        compatibilityStatus: "ready",
        compatibilityProfile: validCompatibilityProfile(),
        resolutionHooks: ["buff.bless", "school.enhancing"]
      },
      source: "spell.fixture.ready_deferred_hook"
    }).join("\n"),
    /must not depend on deferred or unknown spell hooks/
  );
});

test("partial, deferred, and placeholder spells may omit compatibilityProfile", () => {
  for (const status of ["partial", "deferred", "placeholder"]) {
    assertNoValidationErrors(
      validateSpellMagicMetadata({
        record: {
          id: `spell.fixture.${status}_without_profile`,
          primaryFamily: "fire",
          compatibilityStatus: status,
          resolutionHooks: ["buff.bless", "school.enhancing"]
        },
        source: `spell.fixture.${status}_without_profile`
      }),
      status
    );
  }
});

test("current authored spells all declare valid compatibilityStatus", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const counts = new Map();
  for (const record of records) {
    counts.set(record.compatibilityStatus, (counts.get(record.compatibilityStatus) ?? 0) + 1);
    assertNoValidationErrors(
      validateSpellMagicMetadata({
        record,
        source: record.id
      }),
      record.id
    );
  }

  assert.equal(records.length, 55);
  assert.equal(counts.get("ready"), 3);
  assert.equal(counts.get("partial"), 25);
  assert.equal(counts.get("deferred"), 27);
  assert.equal(counts.get("placeholder") ?? 0, 0);
});
