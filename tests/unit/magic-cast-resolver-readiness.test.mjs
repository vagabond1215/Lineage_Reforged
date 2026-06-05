import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  MAGIC_CAST_RESOLVER_READINESS_ISSUE_CODES,
  buildMagicCastResolverReadiness
} from "../../packages/engines/game-engine/src/index.ts";
import { buildArcaneCompendiumEntries } from "../../apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts";
import {
  AUTHORED_SPELL_HOOK_SUPPORT
} from "../../packages/shared/types/src/spell-hook-support.js";

const RESOLVER_REQUEST_ID = "resolver-request.test.firebolt";
const COMMAND_ID = "command.test.magic.cast.firebolt";
const CHARACTER_ID = "player.test.character";
const FIREBOLT_ID = "spell.fire.elemental.firebolt";
const KNOWN_SPELL_ID = "known-spell.test.firebolt";
const TRAINING_EVENT_ID = "training-event.test.firebolt";
const ACQUIRED_AT = "2026-06-04T12:00:00.000Z";

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

function validCommand(overrides = {}) {
  return {
    commandId: COMMAND_ID,
    commandType: "magic.cast",
    casterCharacterId: CHARACTER_ID,
    spellId: FIREBOLT_ID,
    knownSpellRef: {
      refType: "known_spell_id",
      knownSpellId: KNOWN_SPELL_ID
    },
    target: {
      targetType: "character",
      characterId: "enemy.test.bandit"
    },
    conduitSource: {
      sourceType: "supplied_candidate",
      itemId: "item.battle_staff"
    },
    catalystSource: {
      sourceType: "supplied_candidate",
      itemId: "item.fire_crystal"
    },
    castingContext: {
      contextType: "combat",
      controlContext: { controlScore: 3 }
    },
    requestedAt: ACQUIRED_AT,
    ...overrides
  };
}

function validRequest(spellRecords, itemRecords, overrides = {}) {
  return {
    resolverRequestId: RESOLVER_REQUEST_ID,
    command: validCommand(),
    knownSpellRecords: [validKnownSpellRecord()],
    spellCatalog: spellRecords,
    conduitCandidate: byId(itemRecords, "item.battle_staff"),
    catalystCandidate: byId(itemRecords, "item.fire_crystal"),
    hookSupport: HOOK_SUPPORT,
    runtimePolicy: {
      runtimeCastingImplemented: true
    },
    ...overrides
  };
}

function issueCodes(result) {
  return result.issues.map((issue) => issue.code);
}

function readinessBlockerIds(result) {
  return result.readiness?.blockers.map((blocker) => blocker.id) ?? [];
}

test("magic cast resolver readiness issue vocabulary is explicit and ordered", () => {
  assert.deepEqual(MAGIC_CAST_RESOLVER_READINESS_ISSUE_CODES, [
    "invalid_magic_command",
    "missing_caster_character_id",
    "missing_spell_id",
    "missing_known_spell_reference",
    "invalid_known_spell_reference",
    "missing_target_descriptor",
    "invalid_target_descriptor",
    "invalid_conduit_source_descriptor",
    "invalid_catalyst_source_descriptor",
    "invalid_casting_context",
    "cast_readiness_blocked",
    "runtime_casting_not_implemented",
    "unsupported_spell_hooks",
    "spell_runtime_deferred",
    "resource_policy_missing",
    "catalyst_policy_missing",
    "failure_policy_missing",
    "effect_resolution_deferred"
  ]);
});

test("valid structural request delegates to cast readiness and returns ok without mutation", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();
  const request = validRequest(spellRecords, itemRecords);
  const before = structuredClone(request);

  const result = buildMagicCastResolverReadiness(request);

  assert.equal(result.ok, true);
  assert.equal(result.blocked, false);
  assert.equal(result.resolverRequestId, RESOLVER_REQUEST_ID);
  assert.equal(result.commandId, COMMAND_ID);
  assert.deepEqual(result.issues, []);
  assert.equal(result.readiness.ready, true);
  assert.deepEqual(request, before);
});

test("missing command returns invalid_magic_command", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      command: undefined
    })
  );

  assert.equal(result.ok, false);
  assert.equal(result.blocked, true);
  assert.deepEqual(issueCodes(result), ["invalid_magic_command"]);
  assert.equal(result.readiness, undefined);
});

test("missing caster id returns missing_caster_character_id", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      command: validCommand({ casterCharacterId: undefined })
    })
  );

  assert.deepEqual(issueCodes(result), ["missing_caster_character_id"]);
  assert.equal(result.readiness, undefined);
});

test("missing spell id returns missing_spell_id", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      command: validCommand({ spellId: undefined })
    })
  );

  assert.deepEqual(issueCodes(result), ["missing_spell_id"]);
  assert.equal(result.readiness, undefined);
});

test("missing known-spell reference returns missing_known_spell_reference", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      command: validCommand({ knownSpellRef: undefined })
    })
  );

  assert.deepEqual(issueCodes(result), ["missing_known_spell_reference"]);
  assert.equal(result.readiness, undefined);
});

test("missing target descriptor returns missing_target_descriptor", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      command: validCommand({ target: undefined })
    })
  );

  assert.deepEqual(issueCodes(result), ["missing_target_descriptor"]);
  assert.equal(result.readiness, undefined);
});

test("blocked readiness result becomes deterministic resolver issue", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      knownSpellRecords: [
        validKnownSpellRecord({
          availability: "blocked",
          blockedReason: "training_incomplete"
        })
      ]
    })
  );

  assert.equal(result.ok, false);
  assert.equal(result.blocked, true);
  assert.deepEqual(issueCodes(result), ["cast_readiness_blocked"]);
  assert.deepEqual(readinessBlockerIds(result), ["known_spell_blocked"]);
  assert.deepEqual(result.issues[0].details.blockerIds, ["known_spell_blocked"]);
});

test("unsupported hook support is translated from readiness blockers", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();
  const unknownHookSpell = {
    id: "spell.fixture.resolver_unknown_hook",
    name: "Resolver Unknown Hook",
    primaryFamily: "fire",
    compatibilityStatus: "ready",
    compatibilityProfile: {
      requiredTags: { all: ["magic.elemental"] },
      freecastAllowed: true
    },
    resolutionHooks: ["spell.future.unmapped"]
  };

  const result = buildMagicCastResolverReadiness(
    validRequest([...spellRecords, unknownHookSpell], itemRecords, {
      command: validCommand({
        spellId: unknownHookSpell.id,
        knownSpellRef: {
          refType: "known_spell_id",
          knownSpellId: "known-spell.test.unknown-hook"
        },
        conduitSource: { sourceType: "none" },
        catalystSource: { sourceType: "none" }
      }),
      knownSpellRecords: [
        validKnownSpellRecord({
          knownSpellId: "known-spell.test.unknown-hook",
          spellId: unknownHookSpell.id,
          trainingEventEvidence: trainingEventEvidence({
            trainingEventId: "training-event.test.unknown-hook"
          })
        })
      ],
      spellRecord: unknownHookSpell,
      conduitCandidate: undefined,
      catalystCandidate: undefined
    })
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["cast_readiness_blocked", "unsupported_spell_hooks"]);
  assert.deepEqual(readinessBlockerIds(result), ["unsupported_spell_hooks"]);
});

test("missing runtime policy returns invalid_casting_context without calling readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      runtimePolicy: undefined
    })
  );

  assert.deepEqual(issueCodes(result), ["invalid_casting_context"]);
  assert.equal(result.issues[0].field, "runtimePolicy");
  assert.equal(result.readiness, undefined);
});

test("catalog presence alone does not satisfy resolver readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      knownSpellRecords: []
    })
  );

  assert.equal(result.ok, false);
  assert.ok(readinessBlockerIds(result).includes("missing_known_spell"));
  assert.equal(result.readiness.projection.knownSpellCount, 0);
});

test("Arcane Compendium visibility alone does not satisfy resolver readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();
  const arcaneEntries = buildArcaneCompendiumEntries(spellRecords);

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      knownSpellRecords: [],
      arcaneEntries
    })
  );

  assert.equal(arcaneEntries.some((entry) => entry.id === FIREBOLT_ID), true);
  assert.equal(result.ok, false);
  assert.ok(readinessBlockerIds(result).includes("missing_known_spell"));
  assert.equal(result.readiness.projection.knownSpellCount, 0);
});

test("PlayerSpellState entries do not satisfy resolver readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();
  const playerSpellState = {
    id: FIREBOLT_ID,
    school: "elemental",
    primaryFamily: "fire",
    rank: 1,
    source: "learned"
  };

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      knownSpellRecords: [playerSpellState]
    })
  );

  assert.equal(result.ok, false);
  assert.ok(readinessBlockerIds(result).includes("missing_known_spell"));
  assert.ok(readinessBlockerIds(result).includes("invalid_known_spell_record"));
  assert.equal(result.readiness.projection.knownSpellCount, 0);
});

test("structural issues are deterministic and ordered", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();

  const result = buildMagicCastResolverReadiness(
    validRequest(spellRecords, itemRecords, {
      command: {
        commandId: COMMAND_ID,
        commandType: "magic.cast",
        conduitSource: { sourceType: "none" },
        catalystSource: { sourceType: "none" },
        castingContext: { contextType: "combat" }
      },
      runtimePolicy: undefined
    })
  );

  assert.deepEqual(issueCodes(result), [
    "missing_caster_character_id",
    "missing_spell_id",
    "missing_known_spell_reference",
    "missing_target_descriptor",
    "invalid_casting_context"
  ]);
  assert.equal(result.readiness, undefined);
});

test("resolver readiness does not mutate nested command, records, catalog, or candidates", async () => {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();
  const request = validRequest(spellRecords, itemRecords, {
    command: validCommand({
      target: { targetType: "self", characterId: CHARACTER_ID },
      conduitSource: { sourceType: "supplied_candidate", itemId: "item.battle_staff" },
      catalystSource: { sourceType: "supplied_candidate", itemId: "item.fire_crystal" }
    })
  });
  const before = structuredClone(request);

  buildMagicCastResolverReadiness(request);

  assert.deepEqual(request, before);
});
