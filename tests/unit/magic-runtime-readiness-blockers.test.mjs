import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { buildKnownSpellReadOnlyProjection } from "../../packages/engines/game-engine/src/index.ts";
import { buildArcaneCompendiumEntries } from "../../apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts";
import {
  classifySpellItemGenerationHookId,
  classifySpellResolutionHook
} from "../../tools/content-lint/spell-hook-support.mjs";
import {
  validateItemMagicMetadata,
  validateSpellCompatibilityProfile
} from "../../tools/content-lint/magic-metadata-support.mjs";

const CHARACTER_ID = "player.test.character";
const FIREBOLT_ID = "spell.fire.elemental.firebolt";
const BURN_ID = "spell.fire.enfeebling.burn";
const BERRY_ID = "spell.druidic.healing.berry";
const UNKNOWN_HOOK_ID = "spell.fixture.unknown_hook";
const KNOWN_SPELL_ID = "known-spell.test.firebolt";
const TRAINING_EVENT_ID = "training-event.test.firebolt";
const ACQUIRED_AT = "2026-06-01T12:00:00.000Z";

const EVIDENCE_BLOCKER_CODES = new Set([
  "missing_training_event_id",
  "missing_training_event_source",
  "unsupported_training_event_evidence"
]);

async function loadSpellRecords() {
  const raw = await readFile("packages/content/base/player/spells.json", "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
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

function trainingEventEvidence(overrides = {}) {
  return {
    trainingEventId: TRAINING_EVENT_ID,
    sourceType: "training_event",
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

function issueCodes(result) {
  return result.issues.map((issue) => issue.code);
}

function blockerIds(result) {
  return result.blockers.map((blocker) => blocker.id);
}

function hasBlocker(result, id) {
  return blockerIds(result).includes(id);
}

function buildMagicRuntimeReadinessBlockers({
  records,
  spellCatalog,
  characterId,
  spellId,
  arcaneEntries = [],
  playerSpellStateRecords = [],
  conduitPolicyAccepted = false,
  catalystPolicyAccepted = false,
  controlPolicyAccepted = false,
  runtimeCastingImplemented = false
}) {
  const projection = buildKnownSpellReadOnlyProjection({
    records,
    spellCatalog,
    characterId
  });
  const spellRecord = spellCatalog.find((record) => record.id === spellId);
  const availableKnownSpell = projection.knownSpells.find((entry) => entry.spellId === spellId);
  const blockedKnownSpell = projection.blockedSpells.find((entry) => entry.spellId === spellId);
  const blockers = [];

  if (!availableKnownSpell) {
    blockers.push({
      id: "missing_known_spell",
      source: "known_spell_projection"
    });
  }
  if (blockedKnownSpell) {
    blockers.push({
      id: "blocked_known_spell",
      source: blockedKnownSpell.knownSpellId
    });
  }
  if (projection.issues.some((issue) => EVIDENCE_BLOCKER_CODES.has(issue.code))) {
    blockers.push({
      id: "missing_training_event_evidence",
      source: "known_spell_projection"
    });
  }
  if (!conduitPolicyAccepted) {
    blockers.push({
      id: "missing_conduit_policy",
      source: "runtime_policy"
    });
  }
  if (!catalystPolicyAccepted) {
    blockers.push({
      id: "missing_catalyst_policy",
      source: "runtime_policy"
    });
  }
  if (!controlPolicyAccepted) {
    blockers.push({
      id: "missing_control_policy",
      source: "runtime_policy"
    });
  }
  if (spellRecord && hasUnsupportedSpellHooks(spellRecord)) {
    blockers.push({
      id: "unsupported_spell_hooks",
      source: spellRecord.id
    });
  }
  if (!runtimeCastingImplemented) {
    blockers.push({
      id: "runtime_casting_not_implemented",
      source: "runtime"
    });
  }

  return {
    ready: blockers.length === 0,
    blockers,
    projection,
    context: {
      catalogSpellPresent: Boolean(spellRecord),
      arcaneEntryVisible: arcaneEntries.some((entry) => entry.id === spellId),
      playerSpellStatePresent: playerSpellStateRecords.some((entry) => entry.id === spellId)
    }
  };
}

function hasUnsupportedSpellHooks(record) {
  return (
    (record.resolutionHooks ?? []).some((hook) => {
      const classification = classifySpellResolutionHook(hook);
      return classification === "deferred" || classification === "unknown";
    }) ||
    (record.itemGenerationHooks ?? []).some((hook) => {
      const classification = classifySpellItemGenerationHookId(hook?.generatedItemId);
      return classification === "deferred" || classification === "unknown";
    })
  );
}

test("catalog and Arcane Compendium visibility are not runtime cast readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const arcaneEntries = buildArcaneCompendiumEntries(spellRecords);

  const result = buildMagicRuntimeReadinessBlockers({
    records: [],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID,
    arcaneEntries
  });

  assert.equal(result.context.catalogSpellPresent, true);
  assert.equal(result.context.arcaneEntryVisible, true);
  assert.equal(result.ready, false);
  assert.deepEqual(result.projection.knownSpells, []);
  assert.deepEqual(result.projection.blockedSpells, []);
  assert.ok(hasBlocker(result, "missing_known_spell"));
  assert.ok(hasBlocker(result, "missing_conduit_policy"));
  assert.ok(hasBlocker(result, "missing_catalyst_policy"));
  assert.ok(hasBlocker(result, "missing_control_policy"));
  assert.ok(hasBlocker(result, "runtime_casting_not_implemented"));
});

test("PlayerSpellState readiness context does not prove known-spell ownership", async () => {
  const spellRecords = await loadSpellRecords();

  const result = buildMagicRuntimeReadinessBlockers({
    records: [],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID,
    playerSpellStateRecords: [playerSpellState()]
  });

  assert.equal(result.context.playerSpellStatePresent, true);
  assert.equal(result.projection.knownSpellCount, 0);
  assert.ok(hasBlocker(result, "missing_known_spell"));
  assert.equal(result.ready, false);
});

test("only explicit valid character-scoped known-spell records can project as known", async () => {
  const spellRecords = await loadSpellRecords();

  const result = buildMagicRuntimeReadinessBlockers({
    records: [validKnownSpellRecord()],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID
  });

  assert.equal(result.projection.ok, true);
  assert.deepEqual(result.projection.knownSpells.map((entry) => entry.spellId), [FIREBOLT_ID]);
  assert.equal(hasBlocker(result, "missing_known_spell"), false);
  assert.ok(hasBlocker(result, "missing_conduit_policy"));
  assert.ok(hasBlocker(result, "missing_catalyst_policy"));
  assert.ok(hasBlocker(result, "missing_control_policy"));
  assert.ok(hasBlocker(result, "runtime_casting_not_implemented"));
  assert.equal(result.ready, false);
});

test("account family institution document and Legacy-like records do not unlock runtime readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const records = [
    validKnownSpellRecord({ ownerScope: "account", ownerId: "account.local.default" }),
    validKnownSpellRecord({ ownerScope: "family", ownerId: "family.arden" }),
    validKnownSpellRecord({ ownerScope: "institution", ownerId: "institution.arcane.college" }),
    validKnownSpellRecord({ ownerScope: "document", ownerId: "document.arcane.tome" }),
    validKnownSpellRecord({
      knownSpellId: "known-spell.test.legacy",
      acquisitionRoute: "legacy_access_lane",
      trainingEventEvidence: trainingEventEvidence({
        sourceLegacyUnlockId: "legacy.magic.safe_study"
      })
    })
  ];

  const result = buildMagicRuntimeReadinessBlockers({
    records,
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID
  });

  assert.equal(result.projection.ok, false);
  assert.equal(result.projection.knownSpellCount, 0);
  assert.ok(hasBlocker(result, "missing_known_spell"));
  assert.ok(result.projection.issues.some((issue) => issue.code === "record_validation_failed"));
});

test("training_event evidence is required for projection readiness", async () => {
  const spellRecords = await loadSpellRecords();

  const result = buildMagicRuntimeReadinessBlockers({
    records: [
      validKnownSpellRecord({
        trainingEventEvidence: undefined
      })
    ],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID
  });

  assert.equal(result.projection.ok, false);
  assert.deepEqual(result.projection.knownSpells, []);
  assert.ok(issueCodes(result.projection).includes("missing_training_event_id"));
  assert.ok(issueCodes(result.projection).includes("missing_training_event_source"));
  assert.ok(hasBlocker(result, "missing_training_event_evidence"));
  assert.ok(hasBlocker(result, "missing_known_spell"));
});

test("unsupported evidence sourceType and future-route fields stay blocked", async () => {
  const spellRecords = await loadSpellRecords();

  const unsupportedSource = buildMagicRuntimeReadinessBlockers({
    records: [
      validKnownSpellRecord({
        trainingEventEvidence: trainingEventEvidence({
          sourceType: "legacy_access_lane"
        })
      })
    ],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID
  });
  assert.ok(issueCodes(unsupportedSource.projection).includes("unsupported_training_event_evidence"));
  assert.ok(hasBlocker(unsupportedSource, "missing_training_event_evidence"));
  assert.ok(hasBlocker(unsupportedSource, "missing_known_spell"));

  const futureRouteField = buildMagicRuntimeReadinessBlockers({
    records: [
      validKnownSpellRecord({
        trainingEventEvidence: trainingEventEvidence({
          sourceDocumentId: "document.arcane.tome"
        })
      })
    ],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID
  });
  assert.ok(issueCodes(futureRouteField.projection).includes("unsupported_training_event_evidence"));
  assert.ok(hasBlocker(futureRouteField, "missing_training_event_evidence"));
  assert.ok(hasBlocker(futureRouteField, "missing_known_spell"));
});

test("blocked known-spell records are blocked projection entries only", async () => {
  const spellRecords = await loadSpellRecords();

  const result = buildMagicRuntimeReadinessBlockers({
    records: [
      validKnownSpellRecord({
        availability: "blocked",
        blockedReason: "training_incomplete"
      })
    ],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID
  });

  assert.equal(result.projection.ok, true);
  assert.deepEqual(result.projection.knownSpells, []);
  assert.deepEqual(result.projection.blockedSpells.map((entry) => entry.spellId), [FIREBOLT_ID]);
  assert.ok(hasBlocker(result, "blocked_known_spell"));
  assert.ok(hasBlocker(result, "missing_known_spell"));
  assert.equal(result.ready, false);
});

test("valid conduit and catalyst metadata still do not create runtime policy", async () => {
  const spellRecords = await loadSpellRecords();
  const firebolt = spellRecords.find((record) => record.id === FIREBOLT_ID);
  const conduitItem = {
    id: "item.test.apprentice_staff",
    itemKey: "apprentice_staff",
    name: "Apprentice Staff",
    itemClass: "weapon",
    itemBranch: "melee",
    itemSubBranch: "staff",
    roles: ["weapon"],
    tags: ["staff"],
    conduitProfile: {
      conduitRole: "primary",
      castingTags: [
        "magic.elemental",
        "range.medium",
        "delivery.projectile",
        "cast.stable",
        "power.medium",
        "control.moderate"
      ]
    }
  };
  const catalystItem = {
    id: "item.test.fire_crystal",
    itemKey: "fire_crystal",
    name: "Fire Crystal",
    itemClass: "commodity",
    itemBranch: "mineral",
    itemSubBranch: "crystal",
    roles: ["reagent"],
    tags: ["crystal"],
    catalystProfile: {
      tier: "catalyst.trace",
      families: ["fire", "arcane"]
    }
  };

  assert.deepEqual(
    validateSpellCompatibilityProfile({
      profile: firebolt.compatibilityProfile,
      source: `${FIREBOLT_ID}.compatibilityProfile`
    }),
    []
  );
  assert.deepEqual(validateItemMagicMetadata({ record: conduitItem, source: conduitItem.id }), []);
  assert.deepEqual(validateItemMagicMetadata({ record: catalystItem, source: catalystItem.id }), []);

  const result = buildMagicRuntimeReadinessBlockers({
    records: [validKnownSpellRecord()],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID
  });

  assert.ok(hasBlocker(result, "missing_conduit_policy"));
  assert.ok(hasBlocker(result, "missing_catalyst_policy"));
  assert.equal(result.ready, false);
});

test("control and failure policy remains an explicit blocker", async () => {
  const spellRecords = await loadSpellRecords();

  const result = buildMagicRuntimeReadinessBlockers({
    records: [validKnownSpellRecord()],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID,
    conduitPolicyAccepted: true,
    catalystPolicyAccepted: true,
    runtimeCastingImplemented: true
  });

  assert.deepEqual(blockerIds(result), ["missing_control_policy"]);
  assert.equal(result.ready, false);
});

test("deferred spell hooks block runtime readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const burn = spellRecords.find((record) => record.id === BURN_ID);

  assert.ok((burn.resolutionHooks ?? []).some((hook) => classifySpellResolutionHook(hook) === "deferred"));

  const result = buildMagicRuntimeReadinessBlockers({
    records: [
      validKnownSpellRecord({
        knownSpellId: "known-spell.test.burn",
        spellId: BURN_ID,
        trainingEventEvidence: trainingEventEvidence({
          trainingEventId: "training-event.test.burn"
        })
      })
    ],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: BURN_ID,
    conduitPolicyAccepted: true,
    catalystPolicyAccepted: true,
    controlPolicyAccepted: true,
    runtimeCastingImplemented: true
  });

  assert.deepEqual(blockerIds(result), ["unsupported_spell_hooks"]);
  assert.equal(result.ready, false);
});

test("deferred item-generation and unknown hooks block runtime readiness", async () => {
  const spellRecords = await loadSpellRecords();
  const berry = spellRecords.find((record) => record.id === BERRY_ID);
  const unknownHookRecord = {
    id: UNKNOWN_HOOK_ID,
    name: "Unknown Hook Fixture",
    compatibilityStatus: "ready",
    primaryFamily: "fire",
    resolutionHooks: ["spell.future.unmapped"],
    compatibilityProfile: {
      requiredTags: { all: ["magic.elemental", "range.short", "delivery.projectile"] },
      freecastAllowed: false
    }
  };
  const catalogWithUnknownHook = [...spellRecords, unknownHookRecord];

  assert.ok(
    (berry.itemGenerationHooks ?? []).some(
      (hook) => classifySpellItemGenerationHookId(hook.generatedItemId) === "deferred"
    )
  );
  assert.equal(classifySpellResolutionHook("spell.future.unmapped"), "unknown");

  const deferredItemGeneration = buildMagicRuntimeReadinessBlockers({
    records: [
      validKnownSpellRecord({
        knownSpellId: "known-spell.test.berry",
        spellId: BERRY_ID,
        trainingEventEvidence: trainingEventEvidence({
          trainingEventId: "training-event.test.berry"
        })
      })
    ],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID,
    spellId: BERRY_ID,
    conduitPolicyAccepted: true,
    catalystPolicyAccepted: true,
    controlPolicyAccepted: true,
    runtimeCastingImplemented: true
  });
  assert.deepEqual(blockerIds(deferredItemGeneration), ["unsupported_spell_hooks"]);
  assert.equal(deferredItemGeneration.ready, false);

  const unknownHook = buildMagicRuntimeReadinessBlockers({
    records: [
      validKnownSpellRecord({
        knownSpellId: "known-spell.test.unknown-hook",
        spellId: UNKNOWN_HOOK_ID,
        trainingEventEvidence: trainingEventEvidence({
          trainingEventId: "training-event.test.unknown-hook"
        })
      })
    ],
    spellCatalog: catalogWithUnknownHook,
    characterId: CHARACTER_ID,
    spellId: UNKNOWN_HOOK_ID,
    conduitPolicyAccepted: true,
    catalystPolicyAccepted: true,
    controlPolicyAccepted: true,
    runtimeCastingImplemented: true
  });
  assert.deepEqual(blockerIds(unknownHook), ["unsupported_spell_hooks"]);
  assert.equal(unknownHook.ready, false);
});
