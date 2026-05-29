import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  KNOWN_SPELL_ACQUISITION_ROUTES,
  KNOWN_SPELL_AVAILABILITY_STATES,
  KNOWN_SPELL_OWNER_SCOPES,
  characterKnowsSpell,
  collectKnownSpellCatalogIds,
  createKnownSpellRecord,
  validateKnownSpellRecord
} from "../../packages/engines/game-engine/src/index.ts";
import { buildArcaneCompendiumEntries } from "../../apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts";

const CHARACTER_ID = "player.test.character";
const KNOWN_SPELL_ID = "known-spell.test.firebolt";
const FIREBOLT_ID = "spell.fire.elemental.firebolt";
const MEND_ID = "spell.water.healing.mend";
const ACQUIRED_AT = "2026-05-29T12:00:00.000Z";

async function loadSpellRecords() {
  const raw = await readFile("packages/content/base/player/spells.json", "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

function validRecord(overrides = {}) {
  return {
    knownSpellId: KNOWN_SPELL_ID,
    ownerScope: "character",
    ownerId: CHARACTER_ID,
    characterId: CHARACTER_ID,
    spellId: FIREBOLT_ID,
    acquisitionRoute: "training_event",
    acquiredAt: ACQUIRED_AT,
    availability: "available",
    ...overrides
  };
}

function issueCodes(result) {
  return result.issues.map((issue) => issue.code);
}

test("known-spell helper vocabulary is minimal and character-scoped", () => {
  assert.deepEqual(KNOWN_SPELL_OWNER_SCOPES, ["character"]);
  assert.deepEqual(KNOWN_SPELL_ACQUISITION_ROUTES, ["training_event"]);
  assert.deepEqual(KNOWN_SPELL_AVAILABILITY_STATES, ["available", "blocked"]);
});

test("valid character-scoped known-spell records pass validation without mutation", async () => {
  const spellRecords = await loadSpellRecords();
  const record = validRecord();
  const before = structuredClone(record);

  const result = validateKnownSpellRecord({
    record,
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.issues, []);
  assert.deepEqual(result.record, record);
  assert.deepEqual(record, before);
  assert.ok(collectKnownSpellCatalogIds(spellRecords).has(FIREBOLT_ID));
});

test("pure create helper normalizes only the supported character training-event shape", async () => {
  const spellRecords = await loadSpellRecords();

  const result = createKnownSpellRecord({
    knownSpellId: " known-spell.test.mend ",
    ownerId: CHARACTER_ID,
    characterId: CHARACTER_ID,
    spellId: MEND_ID,
    acquiredAt: ACQUIRED_AT,
    spellCatalog: spellRecords,
    availability: "blocked",
    blockedReason: "training_incomplete"
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.record, {
    knownSpellId: "known-spell.test.mend",
    ownerScope: "character",
    ownerId: CHARACTER_ID,
    characterId: CHARACTER_ID,
    spellId: MEND_ID,
    acquisitionRoute: "training_event",
    acquiredAt: ACQUIRED_AT,
    availability: "blocked",
    blockedReason: "training_incomplete"
  });
});

test("unknown spell ids fail validation", async () => {
  const spellRecords = await loadSpellRecords();
  const result = validateKnownSpellRecord({
    record: validRecord({ spellId: "spell.fixture.unknown" }),
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID
  });

  assert.equal(result.ok, false);
  assert.ok(issueCodes(result).includes("unknown_spell_id"));
});

test("unsupported owner scopes fail validation", async () => {
  const spellRecords = await loadSpellRecords();

  for (const ownerScope of ["account", "family", "institution", "document", "item_instance", "source_run", "heir"]) {
    const result = validateKnownSpellRecord({
      record: validRecord({ ownerScope }),
      spellCatalog: spellRecords,
      characterId: CHARACTER_ID
    });

    assert.equal(result.ok, false, ownerScope);
    assert.ok(issueCodes(result).includes("unsupported_owner_scope"), ownerScope);
  }
});

test("unsupported acquisition routes fail validation", async () => {
  const spellRecords = await loadSpellRecords();

  for (const acquisitionRoute of ["teacher", "quest_event_reward", "institution", "scroll", "tome", "discovered_record", "legacy_access_lane", "family_tradition"]) {
    const result = validateKnownSpellRecord({
      record: validRecord({ acquisitionRoute }),
      spellCatalog: spellRecords,
      characterId: CHARACTER_ID
    });

    assert.equal(result.ok, false, acquisitionRoute);
    assert.ok(issueCodes(result).includes("unsupported_acquisition_route"), acquisitionRoute);
  }
});

test("missing required fields fail validation deterministically", async () => {
  const spellRecords = await loadSpellRecords();
  const fields = [
    ["knownSpellId", "missing_known_spell_id"],
    ["ownerScope", "missing_owner_scope"],
    ["ownerId", "missing_owner_id"],
    ["characterId", "missing_character_id"],
    ["spellId", "missing_spell_id"],
    ["acquisitionRoute", "missing_acquisition_route"],
    ["acquiredAt", "missing_acquired_at"],
    ["availability", "missing_availability"]
  ];

  for (const [field, expectedCode] of fields) {
    const record = validRecord();
    delete record[field];
    const result = validateKnownSpellRecord({
      record,
      spellCatalog: spellRecords,
      characterId: field === "characterId" ? null : CHARACTER_ID
    });

    assert.equal(result.ok, false, field);
    assert.ok(issueCodes(result).includes(expectedCode), field);
  }
});

test("owner and character ids must match the current character context", async () => {
  const spellRecords = await loadSpellRecords();

  const ownerMismatch = validateKnownSpellRecord({
    record: validRecord({ ownerId: "player.other" }),
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID
  });
  assert.equal(ownerMismatch.ok, false);
  assert.ok(issueCodes(ownerMismatch).includes("owner_character_mismatch"));
  assert.ok(issueCodes(ownerMismatch).includes("character_context_mismatch"));

  const characterMismatch = validateKnownSpellRecord({
    record: validRecord({ characterId: "player.other" }),
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID
  });
  assert.equal(characterMismatch.ok, false);
  assert.ok(issueCodes(characterMismatch).includes("owner_character_mismatch"));
  assert.ok(issueCodes(characterMismatch).includes("character_context_mismatch"));
});

test("unsupported availability states fail validation", async () => {
  const spellRecords = await loadSpellRecords();
  const result = validateKnownSpellRecord({
    record: validRecord({ availability: "forgotten" }),
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID
  });

  assert.equal(result.ok, false);
  assert.ok(issueCodes(result).includes("unsupported_availability"));
});

test("characterKnowsSpell returns true only for matching available character-owned records", async () => {
  const spellRecords = await loadSpellRecords();
  const records = [
    validRecord({ spellId: MEND_ID }),
    validRecord({ knownSpellId: "known-spell.test.firebolt.blocked", availability: "blocked" }),
    validRecord()
  ];

  assert.equal(
    characterKnowsSpell({
      records,
      characterId: CHARACTER_ID,
      spellId: FIREBOLT_ID,
      spellCatalog: spellRecords
    }),
    true
  );
  assert.equal(
    characterKnowsSpell({
      records,
      characterId: "player.other",
      spellId: FIREBOLT_ID,
      spellCatalog: spellRecords
    }),
    false
  );
  assert.equal(
    characterKnowsSpell({
      records,
      characterId: CHARACTER_ID,
      spellId: "spell.fixture.unknown",
      spellCatalog: spellRecords
    }),
    false
  );
});

test("blocked records do not count as character-known spells", async () => {
  const spellRecords = await loadSpellRecords();
  const records = [
    validRecord({
      availability: "blocked",
      blockedReason: "training_incomplete"
    })
  ];

  assert.equal(
    characterKnowsSpell({
      records,
      characterId: CHARACTER_ID,
      spellId: FIREBOLT_ID,
      spellCatalog: spellRecords
    }),
    false
  );
});

test("account, family, institution, document, and Legacy-like records do not count as known", async () => {
  const spellRecords = await loadSpellRecords();
  const records = [
    validRecord({ ownerScope: "account", ownerId: "account.local.default" }),
    validRecord({ ownerScope: "family", ownerId: "family.arden" }),
    validRecord({ ownerScope: "institution", ownerId: "institution.arcane.college" }),
    validRecord({ ownerScope: "document", ownerId: "document.arcane.tome" }),
    validRecord({ acquisitionRoute: "legacy_access_lane" })
  ];

  assert.equal(
    characterKnowsSpell({
      records,
      characterId: CHARACTER_ID,
      spellId: FIREBOLT_ID,
      spellCatalog: spellRecords
    }),
    false
  );
});

test("Arcane Compendium projection remains independent from known-spell ownership", async () => {
  const spellRecords = await loadSpellRecords();
  const entriesBefore = buildArcaneCompendiumEntries(spellRecords);

  assert.equal(
    characterKnowsSpell({
      records: [validRecord()],
      characterId: CHARACTER_ID,
      spellId: FIREBOLT_ID,
      spellCatalog: spellRecords
    }),
    true
  );

  const entriesAfter = buildArcaneCompendiumEntries(spellRecords);
  assert.equal(entriesBefore.length, 55);
  assert.deepEqual(
    entriesAfter.map((entry) => entry.id).sort(),
    entriesBefore.map((entry) => entry.id).sort()
  );
  assert.equal(entriesAfter.some((entry) => entry.id === KNOWN_SPELL_ID), false);
});

test("current PlayerSpellState entries remain readiness context, not acquisition records", async () => {
  const spellRecords = await loadSpellRecords();
  const playerSpellStateRecords = [
    {
      id: FIREBOLT_ID,
      school: "elemental",
      primaryFamily: "fire",
      rank: 1,
      source: "learned"
    }
  ];

  assert.equal(
    characterKnowsSpell({
      records: playerSpellStateRecords,
      characterId: CHARACTER_ID,
      spellId: FIREBOLT_ID,
      spellCatalog: spellRecords
    }),
    false
  );

  const result = validateKnownSpellRecord({
    record: playerSpellStateRecords[0],
    spellCatalog: spellRecords,
    characterId: CHARACTER_ID
  });
  assert.equal(result.ok, false);
  assert.ok(issueCodes(result).includes("missing_known_spell_id"));
  assert.ok(issueCodes(result).includes("missing_owner_scope"));
});

test("known-spell helper does not import content, UI, combat, or planning sources", () => {
  const source = readFileSync("packages/engines/game-engine/src/known-spells.ts", "utf8");

  assert.doesNotMatch(source, /spells\.json/);
  assert.doesNotMatch(source, /spellCompatibilityPresentation/);
  assert.doesNotMatch(source, /combat[\\/]+index/);
  assert.doesNotMatch(source, /docs[\\/]+design/);
  assert.doesNotMatch(source, /PlayerSpellState/);
});
