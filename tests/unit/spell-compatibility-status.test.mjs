import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  SPELL_COMPATIBILITY_STATUSES,
  validateSpellMagicMetadata
} from "../../tools/content-lint/magic-metadata-support.mjs";

const ALPHA_PROFILE_BATCH_IDS = Object.freeze([
  "spell.water.elemental.waterjet",
  "spell.air.elemental.windblade",
  "spell.earth.elemental.stone_spike",
  "spell.ice.elemental.ice_shard",
  "spell.light.elemental.radiance",
  "spell.lightning.elemental.spark",
  "spell.air.enfeebling.gust",
  "spell.lightning.enfeebling.shock",
  "spell.ice.enfeebling.freeze",
  "spell.druidic.control.root",
  "spell.earth.enhancing.stone_skin",
  "spell.ice.enhancing.frostguard"
]);

const BETA_PROFILE_BATCH_IDS = Object.freeze([
  "spell.lightning.healing.surge",
  "spell.shadow.elemental.void_bolt",
  "spell.druidic.control.vinebind",
  "spell.ninjutsu.utility.shadowstep",
  "spell.ninjutsu.ranged.shuriken",
  "spell.performance.enhancing.battle_rhythm",
  "spell.performance.enhancing.guard_song",
  "spell.performance.enhancing.stone_dance"
]);

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
  let profileCount = 0;
  for (const record of records) {
    counts.set(record.compatibilityStatus, (counts.get(record.compatibilityStatus) ?? 0) + 1);
    if (record.compatibilityProfile !== undefined) {
      profileCount += 1;
    }
    assertNoValidationErrors(
      validateSpellMagicMetadata({
        record,
        source: record.id
      }),
      record.id
    );
  }

  assert.equal(records.length, 55);
  assert.equal(counts.get("ready"), 23);
  assert.equal(counts.get("partial"), 5);
  assert.equal(counts.get("deferred"), 27);
  assert.equal(counts.get("placeholder") ?? 0, 0);
  assert.equal(profileCount, 28);
});

test("Alpha compatibility batch spells are ready and profiled", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const recordsById = new Map(records.map((record) => [record.id, record]));

  for (const id of ALPHA_PROFILE_BATCH_IDS) {
    const record = recordsById.get(id);
    assert.ok(record, `${id} exists`);
    assert.equal(record.compatibilityStatus, "ready", id);
    assert.ok(record.compatibilityProfile, `${id} has compatibilityProfile`);
    assert.equal("primaryFamily" in record.compatibilityProfile, false, `${id} keeps primaryFamily top-level only`);
    assertNoValidationErrors(
      validateSpellMagicMetadata({
        record,
        source: id
      }),
      id
    );
  }
});

test("Beta compatibility batch spells are ready and profiled", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const recordsById = new Map(records.map((record) => [record.id, record]));

  for (const id of BETA_PROFILE_BATCH_IDS) {
    const record = recordsById.get(id);
    assert.ok(record, `${id} exists`);
    assert.equal(record.compatibilityStatus, "ready", id);
    assert.ok(record.compatibilityProfile, `${id} has compatibilityProfile`);
    assert.equal("primaryFamily" in record.compatibilityProfile, false, `${id} keeps primaryFamily top-level only`);
    assertNoValidationErrors(
      validateSpellMagicMetadata({
        record,
        source: id
      }),
      id
    );
  }
});

test("ready spells have compatibilityProfile metadata", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  for (const record of records.filter((entry) => entry.compatibilityStatus === "ready")) {
    assert.ok(record.compatibilityProfile, `${record.id} has compatibilityProfile`);
  }
});

test("deferred and blocked partial spells keep intended statuses", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const recordsById = new Map(records.map((record) => [record.id, record]));

  for (const id of [
    "spell.fire.enfeebling.burn",
    "spell.water.enfeebling.drench",
    "spell.light.enfeebling.blind",
    "spell.performance.healing.regen_song"
  ]) {
    assert.equal(recordsById.get(id)?.compatibilityStatus, "deferred", id);
  }

  for (const id of [
    "spell.shadow.enfeebling.curse",
    "spell.shadow.healing.drain",
    "spell.druidic.healing.berry",
    "spell.druidic.healing.bloom",
    "spell.performance.enhancing.war_song"
  ]) {
    const record = recordsById.get(id);
    assert.equal(record?.compatibilityStatus, "partial", id);
    assert.ok(record?.compatibilityProfile, `${id} remains profiled but partial`);
  }
});
