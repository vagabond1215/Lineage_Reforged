import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  MAGIC_CAST_READINESS_BLOCKER_IDS,
  buildMagicCastReadiness
} from "../../packages/engines/game-engine/src/index.ts";
import { buildArcaneCompendiumEntries } from "../../apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts";
import {
  AUTHORED_SPELL_HOOK_SUPPORT
} from "../../packages/shared/types/src/spell-hook-support.js";

const CHARACTER_ID = "player.test.character";
const FIREBOLT_ID = "spell.fire.elemental.firebolt";
const BERRY_ID = "spell.druidic.healing.berry";
const KNOWN_SPELL_ID = "known-spell.test.firebolt";
const TRAINING_EVENT_ID = "training-event.test.firebolt";
const ACQUIRED_AT = "2026-06-02T12:00:00.000Z";

const HOOK_SUPPORT = AUTHORED_SPELL_HOOK_SUPPORT;

async function loadJsonRecords(path) {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

async function loadSpellRecords() {
  return loadJsonRecords("packages/content/base/player/spells.json");
}

async function loadItemRecords() {
  return loadJsonRecords("packages/content/base/items/items.json");
}

function byId(records, id) {
  return records.find((record) => record.id === id);
}

function trainingEventEvidence(overrides = {}) {
  return {
    trainingEventId: TRAINING_EVENT_ID,
    sourceType: "training_event",
    ...overrides
  };
}

function validKnownSpellRecord(overrides = {}) {
  return {
    knownSpellId: KNOWN_SPELL_ID,
    ownerScope: "character",
    ownerId: CHARACTER_ID,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID,
    acquisitionRoute: "training_event",
    acquiredAt: ACQUIRED_AT,
    availability: "available",
    trainingEventEvidence: trainingEventEvidence(),
    ...overrides
  };
}

function playerSpellState(spellId = FIREBOLT_ID) {
  return {
    id: spellId,
    school: "elemental",
    primaryFamily: "fire",
    rank: 1,
    source: "learned"
  };
}

function blockerIds(result) {
  return result.blockers.map((blocker) => blocker.id);
}

function hasBlocker(result, id) {
  return blockerIds(result).includes(id);
}

function readyParams(spellRecords, itemRecords, overrides = {}) {
  return {
    records: [validKnownSpellRecord()],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID,
    conduitCandidate: byId(itemRecords, "item.battle_staff"),
    catalystCandidate: byId(itemRecords, "item.fire_crystal"),
    controlContext: { controlScore: 3 },
    hookSupport: HOOK_SUPPORT,
    ...overrides
  };
}

test("magic cast readiness blocker vocabulary is explicit and ordered", () => {
  assert.deepEqual(MAGIC_CAST_READINESS_BLOCKER_IDS, [
    "missing_known_spell",
    "known_spell_blocked",
    "invalid_known_spell_record",
    "missing_training_event_evidence",
    "missing_conduit",
    "invalid_conduit",
    "missing_catalyst",
    "invalid_catalyst",
    "insufficient_control",
    "unsupported_spell_hooks",
    "spell_runtime_deferred",
    "runtime_casting_not_implemented"
  ]);
});

test("empty known-spell records return missing known spell and default runtime blocker", async () => {
  const spellRecords = await loadSpellRecords();

  const result = buildMagicCastReadiness({
    records: [],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID
  });

  assert.equal(result.ready, false);
  assert.ok(hasBlocker(result, "missing_known_spell"));
  assert.ok(hasBlocker(result, "runtime_casting_not_implemented"));
  assert.equal(result.projection.knownSpellCount, 0);
});

test("valid known-spell ownership can pass while runtime casting remains unimplemented by default", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastReadiness(readyParams(spellRecords, itemRecords));

  assert.equal(result.projection.ok, true);
  assert.equal(result.details.availableKnownSpellId, KNOWN_SPELL_ID);
  assert.equal(hasBlocker(result, "missing_known_spell"), false);
  assert.deepEqual(blockerIds(result), ["runtime_casting_not_implemented"]);
});

test("blocked known-spell records return known_spell_blocked", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      records: [
        validKnownSpellRecord({
          availability: "blocked",
          blockedReason: "training_incomplete"
        })
      ],
      runtimeCastingImplemented: true
    })
  );

  assert.ok(hasBlocker(result, "known_spell_blocked"));
  assert.equal(hasBlocker(result, "missing_known_spell"), false);
  assert.equal(result.details.blockedKnownSpellId, KNOWN_SPELL_ID);
});

test("missing or unsupported training_event evidence blocks readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const missingEvidence = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      records: [validKnownSpellRecord({ trainingEventEvidence: undefined })],
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(missingEvidence, "invalid_known_spell_record"));
  assert.ok(hasBlocker(missingEvidence, "missing_training_event_evidence"));
  assert.ok(hasBlocker(missingEvidence, "missing_known_spell"));

  const unsupportedEvidence = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      records: [
        validKnownSpellRecord({
          trainingEventEvidence: trainingEventEvidence({
            sourceType: "legacy_access_lane"
          })
        })
      ],
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(unsupportedEvidence, "invalid_known_spell_record"));
  assert.ok(hasBlocker(unsupportedEvidence, "missing_training_event_evidence"));
});

test("catalog and Arcane Compendium visibility do not create cast readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();
  const arcaneEntries = buildArcaneCompendiumEntries(spellRecords);

  assert.equal(arcaneEntries.some((entry) => entry.id === FIREBOLT_ID), true);

  const result = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      records: [],
      conduitCandidate: undefined,
      runtimeCastingImplemented: true
    })
  );

  assert.equal(result.ready, false);
  assert.ok(hasBlocker(result, "missing_known_spell"));
  assert.equal(result.projection.knownSpellCount, 0);
});

test("PlayerSpellState records do not create cast readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      records: [playerSpellState()],
      runtimeCastingImplemented: true
    })
  );

  assert.equal(result.ready, false);
  assert.ok(hasBlocker(result, "missing_known_spell"));
  assert.ok(hasBlocker(result, "invalid_known_spell_record"));
  assert.equal(result.projection.knownSpellCount, 0);
});

test("missing required conduit returns missing_conduit", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      conduitCandidate: undefined,
      requireConduit: true,
      runtimeCastingImplemented: true
    })
  );

  assert.ok(hasBlocker(result, "missing_conduit"));
});

test("incompatible or malformed conduit returns invalid_conduit", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const incompatible = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      conduitCandidate: byId(itemRecords, "item.herb_pouch"),
      requireConduit: true,
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(incompatible, "invalid_conduit"));

  const malformed = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      conduitCandidate: { id: "item.test.no_profile" },
      requireConduit: true,
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(malformed, "invalid_conduit"));
});

test("freecast-allowed spell can avoid missing_conduit when conduit is not required", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      conduitCandidate: undefined,
      requireConduit: false,
      runtimeCastingImplemented: true
    })
  );

  assert.equal(result.details.freecastAllowed, true);
  assert.equal(result.details.conduitRequired, false);
  assert.equal(hasBlocker(result, "missing_conduit"), false);
  assert.equal(result.ready, true);
});

test("missing required catalyst returns missing_catalyst", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      catalystCandidate: undefined,
      runtimeCastingImplemented: true
    })
  );

  assert.ok(hasBlocker(result, "missing_catalyst"));
});

test("incompatible or malformed catalyst returns invalid_catalyst", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const incompatible = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      catalystCandidate: byId(itemRecords, "item.void_crystal"),
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(incompatible, "invalid_catalyst"));

  const malformed = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      catalystCandidate: { id: "item.test.no_profile" },
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(malformed, "invalid_catalyst"));
});

test("missing or insufficient control context returns insufficient_control", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const missing = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      controlContext: undefined,
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(missing, "insufficient_control"));

  const insufficient = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      controlContext: { controlScore: 0 },
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(insufficient, "insufficient_control"));
});

test("partial deferred and placeholder compatibility statuses return spell_runtime_deferred", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  for (const compatibilityStatus of ["partial", "deferred", "placeholder"]) {
    const spellId = `spell.fixture.${compatibilityStatus}`;
    const spellRecord = {
      id: spellId,
      compatibilityStatus,
      compatibilityProfile: {
        requiredTags: { all: ["magic.elemental"] },
        freecastAllowed: true
      },
      resolutionHooks: ["damage.magic", "school.elemental"]
    };

    const result = buildMagicCastReadiness(
      readyParams([...spellRecords, spellRecord], itemRecords, {
        records: [
          validKnownSpellRecord({
            knownSpellId: `known-spell.test.${compatibilityStatus}`,
            spellId,
            trainingEventEvidence: trainingEventEvidence({
              trainingEventId: `training-event.test.${compatibilityStatus}`
            })
          })
        ],
        spellId,
        conduitCandidate: undefined,
        catalystCandidate: undefined,
        runtimeCastingImplemented: true
      })
    );

    assert.ok(hasBlocker(result, "spell_runtime_deferred"), compatibilityStatus);
  }
});

test("deferred or unknown resolution and item-generation hooks return unsupported_spell_hooks", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();
  const berry = byId(spellRecords, BERRY_ID);

  const deferred = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      records: [
        validKnownSpellRecord({
          knownSpellId: "known-spell.test.berry",
          spellId: BERRY_ID,
          trainingEventEvidence: trainingEventEvidence({
            trainingEventId: "training-event.test.berry"
          })
        })
      ],
      spellId: BERRY_ID,
      spellRecord: berry,
      conduitCandidate: undefined,
      catalystCandidate: undefined,
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(deferred, "unsupported_spell_hooks"));
  assert.deepEqual(deferred.details.unsupportedItemGenerationHookIds, ["generated_item.druidic.berry"]);

  const unknownHookSpell = {
    id: "spell.fixture.unknown_hooks",
    compatibilityStatus: "ready",
    compatibilityProfile: {
      requiredTags: { all: ["magic.elemental"] },
      freecastAllowed: true
    },
    resolutionHooks: ["spell.future.unmapped"],
    itemGenerationHooks: [{ generatedItemId: "generated_item.future.unmapped" }]
  };
  const unknown = buildMagicCastReadiness(
    readyParams([...spellRecords, unknownHookSpell], itemRecords, {
      records: [
        validKnownSpellRecord({
          knownSpellId: "known-spell.test.unknown-hooks",
          spellId: unknownHookSpell.id,
          trainingEventEvidence: trainingEventEvidence({
            trainingEventId: "training-event.test.unknown-hooks"
          })
        })
      ],
      spellId: unknownHookSpell.id,
      conduitCandidate: undefined,
      catalystCandidate: undefined,
      runtimeCastingImplemented: true
    })
  );
  assert.ok(hasBlocker(unknown, "unsupported_spell_hooks"));
  assert.deepEqual(unknown.details.unsupportedResolutionHooks, ["spell.future.unmapped"]);
  assert.deepEqual(unknown.details.unsupportedItemGenerationHookIds, ["generated_item.future.unmapped"]);
});

test("readiness preserves explicit six-class support and precedence behavior", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const readinessForHook = (hook, hookSupport) =>
    buildMagicCastReadiness(
      readyParams(spellRecords, itemRecords, {
        spellRecord: {
          id: FIREBOLT_ID,
          compatibilityStatus: "ready",
          compatibilityProfile: {
            requiredTags: { all: ["magic.elemental"] },
            freecastAllowed: true
          },
          resolutionHooks: [hook]
        },
        conduitCandidate: undefined,
        catalystCandidate: undefined,
        hookSupport,
        runtimeCastingImplemented: true
      })
    );

  const supported = readinessForHook("spell.fixture.supported", {
    ...HOOK_SUPPORT,
    supportedResolutionHooks: ["spell.fixture.supported"]
  });
  assert.equal(supported.ready, true);
  assert.equal(hasBlocker(supported, "unsupported_spell_hooks"), false);

  const unsupported = readinessForHook("damage.magic", {
    ...HOOK_SUPPORT,
    resolutionHooks: { "damage.magic": "unsupported" }
  });
  assert.equal(unsupported.ready, false);
  assert.deepEqual(unsupported.details.unsupportedResolutionHooks, ["damage.magic"]);

  const explicitSupported = readinessForHook("buff.bless", {
    ...HOOK_SUPPORT,
    resolutionHooks: { "buff.bless": "supported" }
  });
  assert.equal(explicitSupported.ready, true);

  const runtimeWinsCollision = readinessForHook("spell.fixture.collision", {
    runtimeResolutionHooks: ["spell.fixture.collision"],
    deferredResolutionHooks: ["spell.fixture.collision"]
  });
  assert.equal(runtimeWinsCollision.ready, true);

  const supportedWinsCollision = readinessForHook("spell.fixture.supported_collision", {
    supportedResolutionHooks: ["spell.fixture.supported_collision"],
    deferredResolutionHooks: ["spell.fixture.supported_collision"],
    unsupportedResolutionHooks: ["spell.fixture.supported_collision"]
  });
  assert.equal(supportedWinsCollision.ready, true);
});

test("fully satisfied readiness requires explicit runtime casting support", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();
  const records = [validKnownSpellRecord()];
  const before = structuredClone(records);

  const result = buildMagicCastReadiness(
    readyParams(spellRecords, itemRecords, {
      records,
      runtimeCastingImplemented: true
    })
  );

  assert.equal(result.ready, true);
  assert.deepEqual(result.blockers, []);
  assert.equal(result.details.conduitId, "item.battle_staff");
  assert.equal(result.details.catalystId, "item.fire_crystal");
  assert.deepEqual(records, before);
});
