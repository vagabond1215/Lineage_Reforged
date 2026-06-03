import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildKnownSpellRecordFromTrainingEvent,
  validateKnownSpellTrainingEventAcquisition,
} from "../../packages/engines/game-engine/src/index.ts";
import { buildArcaneCompendiumEntries } from "../../apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts";

const EVENT_ID = "known-spell-acquisition.test.firebolt";
const CHARACTER_ID = "player.test.character";
const OTHER_CHARACTER_ID = "player.test.other";
const FIREBOLT_ID = "spell.fire.elemental.firebolt";
const UNKNOWN_SPELL_ID = "spell.test.unknown";
const KNOWN_SPELL_ID = "known-spell.test.firebolt";
const TRAINING_EVENT_ID = "training-event.test.firebolt";
const ACQUIRED_AT = "2026-06-03T12:00:00.000Z";
const DERIVED_KNOWN_SPELL_ID = `known-spell.${CHARACTER_ID}.${FIREBOLT_ID}.${TRAINING_EVENT_ID}`;

let spellCatalogPromise;

async function loadSpellCatalog() {
  spellCatalogPromise ??= readFile(new URL("../../packages/content/base/player/spells.json", import.meta.url), "utf8")
    .then((content) => JSON.parse(content))
    .then((content) => content.records);
  return spellCatalogPromise;
}

function trainingEventEvidence(overrides = {}) {
  return {
    trainingEventId: TRAINING_EVENT_ID,
    sourceType: "training_event",
    ...overrides,
  };
}

function validParams(spellCatalog, overrides = {}) {
  return {
    eventId: EVENT_ID,
    characterId: CHARACTER_ID,
    ownerId: CHARACTER_ID,
    spellId: FIREBOLT_ID,
    trainingEventEvidence: trainingEventEvidence(),
    acquiredAt: ACQUIRED_AT,
    existingRecords: [],
    spellCatalog,
    ...overrides,
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
    acquisitionEventId: EVENT_ID,
    availability: "available",
    trainingEventEvidence: trainingEventEvidence(),
    ...overrides,
  };
}

function issueCodes(result) {
  return result.issues.map((issue) => issue.code);
}

test("valid explicit training event acquisition proposes available character known spell record", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      knownSpellId: KNOWN_SPELL_ID,
    }),
  );

  assert.equal(result.ok, true);
  assert.deepEqual(result.issues, []);
  assert.equal(result.proposedRecord.knownSpellId, KNOWN_SPELL_ID);
  assert.equal(result.proposedRecord.ownerScope, "character");
  assert.equal(result.proposedRecord.ownerId, CHARACTER_ID);
  assert.equal(result.proposedRecord.characterId, CHARACTER_ID);
  assert.equal(result.proposedRecord.spellId, FIREBOLT_ID);
  assert.equal(result.proposedRecord.acquisitionRoute, "training_event");
  assert.equal(result.proposedRecord.acquiredAt, ACQUIRED_AT);
  assert.equal(result.proposedRecord.availability, "available");
  assert.deepEqual(result.proposedRecord.trainingEventEvidence, trainingEventEvidence());
  assert.equal(result.acquisition.validationStatus, "valid");
  assert.equal(result.acquisition.eventId, EVENT_ID);
});

test("missing characterId returns missing_character_id", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      characterId: undefined,
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["missing_character_id"]);
});

test("missing ownerId returns missing_owner_id", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      ownerId: undefined,
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["missing_owner_id"]);
});

test("ownerId and characterId mismatch returns owner_character_mismatch", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      ownerId: OTHER_CHARACTER_ID,
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["owner_character_mismatch"]);
});

test("unknown spell id returns unknown_spell_id", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      spellId: UNKNOWN_SPELL_ID,
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["unknown_spell_id"]);
});

test("unsupported acquisition route returns unsupported_acquisition_route", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      acquisitionRoute: "scroll",
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["unsupported_acquisition_route"]);
});

test("missing training event evidence returns missing_training_event_evidence", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      trainingEventEvidence: undefined,
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["missing_training_event_evidence"]);
});

test("unsupported training event evidence sourceType returns unsupported_training_event_evidence", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      trainingEventEvidence: trainingEventEvidence({
        sourceType: "catalog_presence",
      }),
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["unsupported_training_event_evidence"]);
});

test("missing trainingEventId returns missing_training_event_evidence", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      trainingEventEvidence: trainingEventEvidence({
        trainingEventId: "",
      }),
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["missing_training_event_evidence"]);
});

test("missing acquiredAt returns deterministic issue", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      acquiredAt: undefined,
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["missing_acquired_at"]);
});

test("missing acquisition event id returns deterministic issue", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      eventId: undefined,
      acquisitionEventId: undefined,
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["missing_acquisition_event_id"]);
});

test("duplicate knownSpellId returns duplicate_known_spell_id", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      knownSpellId: KNOWN_SPELL_ID,
      existingRecords: [validKnownSpellRecord()],
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["duplicate_known_spell_id"]);
  assert.deepEqual(result.issues[0].duplicateIndexes, [0]);
});

test("caller supplied knownSpellId is validated as-is after normalization", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      knownSpellId: " known-spell.custom.firebolt ",
    }),
  );

  assert.equal(result.ok, true);
  assert.equal(result.proposedRecord.knownSpellId, "known-spell.custom.firebolt");
});

test("derived knownSpellId is stable across repeated build calls", async () => {
  const spellCatalog = await loadSpellCatalog();

  const first = buildKnownSpellRecordFromTrainingEvent(validParams(spellCatalog));
  const second = buildKnownSpellRecordFromTrainingEvent(validParams(spellCatalog));

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.proposedRecord.knownSpellId, DERIVED_KNOWN_SPELL_ID);
  assert.equal(second.proposedRecord.knownSpellId, DERIVED_KNOWN_SPELL_ID);
  assert.deepEqual(first.proposedRecord, second.proposedRecord);
});

test("direct trainingEventId input is normalized into explicit training event evidence", async () => {
  const spellCatalog = await loadSpellCatalog();

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      trainingEventEvidence: undefined,
      trainingEventId: TRAINING_EVENT_ID,
    }),
  );

  assert.equal(result.ok, true);
  assert.deepEqual(result.proposedRecord.trainingEventEvidence, trainingEventEvidence());
});

test("non-training sources do not create acquisition without explicit training event evidence", async () => {
  const spellCatalog = await loadSpellCatalog();
  const arcaneCompendiumEntries = buildArcaneCompendiumEntries(spellCatalog);

  const result = validateKnownSpellTrainingEventAcquisition(
    validParams(spellCatalog, {
      trainingEventEvidence: undefined,
      trainingEventId: undefined,
      playerSpells: [{ spellId: FIREBOLT_ID }],
      arcaneCompendiumEntries,
      catalogSpellId: FIREBOLT_ID,
      legacyUnlocks: [{ spellId: FIREBOLT_ID }],
      accountId: "account.test",
      familyId: "family.test",
      lineage: "lineage.test",
      backstory: "studied fire",
      sourceRunId: "run.test",
      selectedCharacterUiState: {
        characterId: CHARACTER_ID,
      },
      itemOwnership: [{ itemId: "item.test.firebolt-scroll" }],
      documentOwnership: [{ documentId: "document.test.arcane" }],
      scrollOwnership: [{ scrollId: "scroll.test.firebolt" }],
      tomeOwnership: [{ tomeId: "tome.test.pyromancy" }],
    }),
  );

  assert.equal(result.ok, false);
  assert.deepEqual(issueCodes(result), ["missing_training_event_evidence"]);
  assert.equal(result.proposedRecord, undefined);
});

test("training event acquisition helpers do not depend on cast readiness helpers", () => {
  assert.equal(validateKnownSpellTrainingEventAcquisition.toString().includes("buildMagicCastReadiness"), false);
  assert.equal(buildKnownSpellRecordFromTrainingEvent.toString().includes("buildMagicCastReadiness"), false);
});
