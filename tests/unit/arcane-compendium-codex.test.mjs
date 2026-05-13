import test from "node:test";
import assert from "node:assert/strict";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  buildBodyStatePresentation,
  createInitialBodyStatePresentationMemory
} from "../../apps/rpg-ui/src/runtime/bodyStatePresentation.ts";
import { createUiViewModel } from "../../apps/rpg-ui/src/runtime/uiViewModel.ts";
import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/index.ts";

function buildUiViewModelWithPlayerSpells(playerSpells) {
  const snapshot = structuredClone(demoSnapshot);
  snapshot.playerState.spells = playerSpells;

  const bodyStatePresentation = buildBodyStatePresentation(
    snapshot,
    createInitialBodyStatePresentationMemory(),
    new Set()
  );

  return createUiViewModel(snapshot, bodyStatePresentation, createDefaultAccountProfileState());
}

function collectObjectKeys(value, keys = new Set()) {
  if (Array.isArray(value)) {
    for (const entry of value) {
      collectObjectKeys(entry, keys);
    }
    return keys;
  }

  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      keys.add(key);
      collectObjectKeys(nested, keys);
    }
  }

  return keys;
}

test("Codex view model exposes Arcane Compendium with all authored spell references", () => {
  const viewModel = buildUiViewModelWithPlayerSpells([]);
  const section = viewModel.codex.sections.find((candidate) => candidate.id === "spells");
  const entries = viewModel.codex.entries.filter((entry) => entry.category === "spells");

  assert.ok(section);
  assert.equal(section.label, "Arcane Compendium");
  assert.equal(section.count, 55);
  assert.equal(entries.length, 55);
  assert.equal(viewModel.codex.windowDetails.spells.title, "Arcane Compendium");
});

test("Arcane Compendium entries are independent from player spell state", () => {
  const emptySpellState = buildUiViewModelWithPlayerSpells([]);
  const fakeSpellState = buildUiViewModelWithPlayerSpells([
    {
      id: "spell.fixture.not_in_catalog",
      school: "utility",
      rank: 1,
      source: "taught"
    }
  ]);

  const emptyEntries = emptySpellState.codex.entries.filter((entry) => entry.category === "spells");
  const fakeEntries = fakeSpellState.codex.entries.filter((entry) => entry.category === "spells");

  assert.equal(emptyEntries.length, 55);
  assert.equal(fakeEntries.length, 55);
  assert.deepEqual(
    fakeEntries.map((entry) => entry.id).sort(),
    emptyEntries.map((entry) => entry.id).sort()
  );
  assert.equal(fakeEntries.some((entry) => entry.id === "spell.fixture.not_in_catalog"), false);
});

test("Arcane Compendium entries expose no command, acquisition, or player spell-state fields", () => {
  const viewModel = buildUiViewModelWithPlayerSpells([]);
  const entries = viewModel.codex.entries.filter((entry) => entry.category === "spells");
  const forbiddenKeys = [
    "castAction",
    "actionType",
    "spellActionGrants",
    "acquisition",
    "knownSpellId",
    "known",
    "learned",
    "prepared",
    "owned",
    "slotId",
    "loadout"
  ];

  for (const entry of entries) {
    const keys = collectObjectKeys(entry);
    for (const key of forbiddenKeys) {
      assert.equal(keys.has(key), false, `${entry.id} should not expose ${key}`);
    }
  }
});
