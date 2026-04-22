import test from "node:test";
import assert from "node:assert/strict";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/index.ts";
import { buildBodyStatePresentation, createInitialBodyStatePresentationMemory } from "../../apps/rpg-ui/src/runtime/bodyStatePresentation.ts";
import { createUiViewModel } from "../../apps/rpg-ui/src/runtime/uiViewModel.ts";

test("default reputation projection stays compact and hides internal identifiers", () => {
  const snapshot = structuredClone(demoSnapshot);
  snapshot.playerState.reputation.notorietyEvents = [
    {
      id: "reputation.notoriety.local.settlement_aurelis.murder.major.48.1",
      scope: "local",
      scopeId: "settlement.aurelis",
      settlementId: "settlement.aurelis",
      categoryId: "murder",
      severity: "major",
      modifiers: ["public"],
      earned: 9,
      currentEarned: 7,
      historical: 9,
      occurredAtTick: 48,
      lastMeaningfulGainTick: 48,
      exposureState: "public",
      attributionState: "identified",
      unresolved: false
    }
  ];
  const bodyStatePresentation = buildBodyStatePresentation(
    snapshot,
    createInitialBodyStatePresentationMemory(),
    new Set()
  );
  const uiViewModel = createUiViewModel(
    snapshot,
    bodyStatePresentation,
    createDefaultAccountProfileState()
  );

  const reputationTitles = uiViewModel.character.lists.reputation.map((item) => item.title);
  assert.ok(reputationTitles.includes("Settlement Fame"));
  assert.ok(reputationTitles.includes("Regional Fame"));
  assert.ok(reputationTitles.includes("Settlement Notoriety"));

  const settlementFame = uiViewModel.character.lists.reputation.find((item) => item.title === "Settlement Fame");
  assert.ok(settlementFame);
  assert.equal(
    settlementFame.detailGroups.some((group) => group.entries.some((entry) => entry.label === "Scope Id")),
    false
  );

  const reputationWindowLabels = uiViewModel.character.windowDetails.reputation.groups.flatMap((group) =>
    group.entries.map((entry) => entry.label)
  );
  assert.equal(reputationWindowLabels.includes("Runtime Source"), false);
  assert.equal(reputationWindowLabels.includes("Projection Ref"), false);
  assert.equal(reputationWindowLabels.includes("Resolver"), false);
});
