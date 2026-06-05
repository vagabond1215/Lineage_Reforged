import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  MAGIC_RESOLVER_INERT_ENVELOPE_SAFETY_FLAGS,
  buildMagicCastResolverReadiness,
  buildMagicResolverInertEnvelope
} from "../../packages/engines/game-engine/src/index.ts";
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

async function validResolverReadiness(overrides = {}) {
  const spellRecords = await loadSpellRecords();
  const itemRecords = await loadItemRecords();
  return buildMagicCastResolverReadiness(validRequest(spellRecords, itemRecords, overrides));
}

test("magic resolver inert envelope returns planning mode and no-effect safety flags", async () => {
  const command = validCommand();
  const resolverReadiness = await validResolverReadiness({ command });

  const envelope = buildMagicResolverInertEnvelope({
    resolverReadiness,
    command
  });

  assert.equal(envelope.envelopeKind, "magic_resolver_inert_envelope");
  assert.equal(envelope.mode, "planning_only");
  assert.deepEqual(envelope.safetyFlags, MAGIC_RESOLVER_INERT_ENVELOPE_SAFETY_FLAGS);
  assert.equal(Object.values(envelope.safetyFlags).every((value) => value === false), true);
  assert.equal(envelope.resolverRequestId, RESOLVER_REQUEST_ID);
  assert.equal(envelope.commandId, COMMAND_ID);
  assert.equal(envelope.spellId, FIREBOLT_ID);
  assert.equal(envelope.casterCharacterId, CHARACTER_ID);
  assert.equal(envelope.knownSpellId, KNOWN_SPELL_ID);
  assert.equal(envelope.blockerSummary.blocked, false);
  assert.equal(envelope.readinessSummary.ready, true);
});

test("magic resolver inert envelope does not infer top-level ownership ids from readiness summaries", async () => {
  const resolverReadiness = await validResolverReadiness();

  const summaryOnly = buildMagicResolverInertEnvelope({ resolverReadiness });

  assert.equal(summaryOnly.spellId, undefined);
  assert.equal(summaryOnly.casterCharacterId, undefined);
  assert.equal(summaryOnly.knownSpellId, undefined);
  assert.equal(summaryOnly.readinessSummary.spellId, FIREBOLT_ID);
  assert.equal(summaryOnly.readinessSummary.characterId, CHARACTER_ID);
  assert.equal(summaryOnly.readinessSummary.availableKnownSpellId, KNOWN_SPELL_ID);

  const explicit = buildMagicResolverInertEnvelope({
    resolverReadiness,
    spellId: ` ${FIREBOLT_ID} `,
    casterCharacterId: ` ${CHARACTER_ID} `,
    knownSpellId: ` ${KNOWN_SPELL_ID} `
  });

  assert.equal(explicit.spellId, FIREBOLT_ID);
  assert.equal(explicit.casterCharacterId, CHARACTER_ID);
  assert.equal(explicit.knownSpellId, KNOWN_SPELL_ID);
});

test("magic resolver inert envelope carries target descriptors without resolving them", async () => {
  const targetDescriptor = {
    targetType: "area",
    origin: {
      originType: "point",
      point: { x: 4, y: 7 },
      mapId: "map.test.arena"
    },
    radius: 3,
    areaShape: "circle"
  };
  const command = validCommand({ target: targetDescriptor });
  const resolverReadiness = await validResolverReadiness({ command });

  const envelope = buildMagicResolverInertEnvelope({
    resolverReadiness,
    command
  });

  assert.deepEqual(envelope.targetDescriptor, targetDescriptor);
  assert.equal(envelope.safetyFlags.targetResolved, false);
  assert.equal(envelope.safetyFlags.effectsApplied, false);
});

test("magic resolver inert envelope carries catalyst descriptors without reservation or consumption", async () => {
  const catalystDescriptor = {
    sourceType: "inventory_item",
    itemInstanceId: "item-instance.test.fire-crystal",
    containerId: "inventory.test.belt-pouch"
  };
  const command = validCommand({ catalystSource: catalystDescriptor });
  const resolverReadiness = await validResolverReadiness({ command });

  const envelope = buildMagicResolverInertEnvelope({
    resolverReadiness,
    command,
    plannedCatalystSummary: {
      source: catalystDescriptor,
      policy: "metadata_only"
    }
  });

  assert.deepEqual(envelope.catalystDescriptor, catalystDescriptor);
  assert.deepEqual(envelope.plannedCatalystSummary, {
    source: catalystDescriptor,
    policy: "metadata_only"
  });
  assert.equal(envelope.safetyFlags.catalystReserved, false);
  assert.equal(envelope.safetyFlags.catalystConsumed, false);
  assert.equal(envelope.safetyFlags.inventoryMutated, false);
});

test("magic resolver inert envelope summarizes readiness and resolver blockers without clearing them", async () => {
  const resolverReadiness = await validResolverReadiness({
    knownSpellRecords: []
  });

  const envelope = buildMagicResolverInertEnvelope({
    resolverReadiness,
    command: validCommand(),
    blockerSummary: {
      callerContext: "unit-test"
    }
  });

  assert.equal(envelope.blockerSummary.blocked, true);
  assert.ok(envelope.blockerSummary.readinessBlockerIds.includes("missing_known_spell"));
  assert.ok(envelope.blockerSummary.resolverIssueCodes.includes("cast_readiness_blocked"));
  assert.ok(envelope.readinessSummary.blockerIds.includes("missing_known_spell"));
  assert.deepEqual(envelope.blockerSummary.providedBlockerSummary, {
    callerContext: "unit-test"
  });
});

test("magic resolver inert envelope lists deferred effect families without executing hooks", async () => {
  const resolverReadiness = await validResolverReadiness();

  const envelope = buildMagicResolverInertEnvelope({
    resolverReadiness,
    command: validCommand(),
    deferredEffectFamilies: ["damage", " status ", "generated_item"],
    plannedHookSummary: {
      deferredResolutionHooks: ["status.burn"],
      deferredItemGenerationHookIds: ["generated_item.druidic.berry"]
    }
  });

  assert.deepEqual(envelope.deferredEffectFamilies, ["damage", "status", "generated_item"]);
  assert.deepEqual(envelope.plannedHookSummary, {
    deferredResolutionHooks: ["status.burn"],
    deferredItemGenerationHookIds: ["generated_item.druidic.berry"]
  });
  assert.equal(envelope.safetyFlags.effectsApplied, false);
  assert.equal(envelope.safetyFlags.eventsEmitted, false);
});

test("magic resolver inert envelope is deterministic for the same input", async () => {
  const resolverReadiness = await validResolverReadiness();
  const input = {
    resolverReadiness,
    command: validCommand(),
    runtimePolicyRef: "runtime-policy.test.inert",
    plannedCostSummary: {
      resourcePolicyRef: "resource-policy.test.deferred"
    },
    diagnostics: {
      source: "unit-test"
    }
  };

  assert.deepEqual(buildMagicResolverInertEnvelope(input), buildMagicResolverInertEnvelope(input));
});

test("magic resolver inert envelope does not mutate nested inputs", async () => {
  const targetDescriptor = {
    targetType: "self",
    characterId: CHARACTER_ID
  };
  const catalystDescriptor = {
    sourceType: "supplied_candidate",
    itemId: "item.fire_crystal",
    itemRecord: { id: "item.fire_crystal" }
  };
  const command = validCommand({
    target: targetDescriptor,
    catalystSource: catalystDescriptor
  });
  const resolverReadiness = await validResolverReadiness({ command });
  const input = {
    resolverReadiness,
    command,
    plannedFailurePolicySummary: {
      policyRef: "failure-policy.test.deferred"
    },
    diagnostics: {
      labels: ["inert", "read_only"]
    }
  };
  const before = structuredClone(input);

  buildMagicResolverInertEnvelope(input);

  assert.deepEqual(input, before);
});
