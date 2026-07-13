import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  createPlayerTravelCommand,
  executePlayerTravelCommand,
  resolvePlayerTravelPlan
} from "../../packages/engines/game-engine/src/index.ts";
import { EVENT_TYPES } from "../../packages/shared/events/src/index.ts";
import {
  deserializeSnapshot,
  serializeSnapshot
} from "../../packages/shared/persistence/src/index.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

function cloneDemoSnapshot() {
  return structuredClone(demoSnapshot);
}

function moveTo(snapshot, settlementId, siteLabel) {
  snapshot.playerState.location = {
    ...snapshot.playerState.location,
    settlementId,
    siteLabel
  };
}

function execute(snapshot, destinationId, sequence) {
  return executePlayerTravelCommand(
    snapshot,
    createPlayerTravelCommand(snapshot, destinationId, sequence)
  );
}

function assertRejectedWithoutMutation(snapshot, before, result, code) {
  assert.equal(result.accepted, false);
  assert.equal(result.code, code);
  assert.equal(result.snapshot, snapshot);
  assert.deepEqual(snapshot, before);
  assert.deepEqual(result.emittedEvents, []);
}

test("accepted travel preserves current timing and cost profiles and emits one typed event", () => {
  const cases = [
    ["location.westreach", 6, { hp: 0, mp: 0, stamina: 12 }],
    ["location.ashen_reef", 4, { hp: 2, mp: 3, stamina: 18 }],
    ["location.crown_bastion", 8, { hp: 0, mp: 0, stamina: 15 }]
  ];

  for (const [destinationId, travelTicks, costs] of cases) {
    const snapshot = cloneDemoSnapshot();
    const before = structuredClone(snapshot);
    const result = execute(snapshot, destinationId, 7);

    assert.equal(result.accepted, true);
    assert.equal(result.appliedTick, before.clock.tick + travelTicks);
    assert.deepEqual(
      { hp: result.facts.hpCost, mp: result.facts.mpCost, stamina: result.facts.staminaCost },
      costs
    );
    assert.equal(result.snapshot === snapshot, false);
    assert.deepEqual(snapshot, before);
    assert.equal(result.emittedEvents.length, 1);
    assert.equal(result.emittedEvents[0].type, EVENT_TYPES.PLAYER_TRAVEL_COMPLETED);
    assert.equal(result.emittedEvents[0].payload.commandId, result.commandId);
    assert.equal(result.snapshot.sessionState.notifications[0].title, "Travel complete");
    assert.equal(result.snapshot.sessionState.chronicle[0].category, "travel");
  }
});

test("preview and execution resolve from the same engine-owned travel plan", () => {
  const snapshot = cloneDemoSnapshot();
  const plan = resolvePlayerTravelPlan(snapshot, "location.ashen_reef");
  const result = execute(snapshot, "location.ashen_reef", 9);

  assert.equal(plan.accepted, true);
  assert.equal(result.accepted, true);
  assert.deepEqual(result.facts, plan.facts);
  assert.equal(plan.timeline.length, plan.facts.travelTicks);
  assert.equal(result.appliedTick, snapshot.clock.tick + plan.facts.travelTicks);
});

test("zero-tick return travel and both existing quest-arrival hooks remain intact", () => {
  const zeroTickSnapshot = cloneDemoSnapshot();
  moveTo(zeroTickSnapshot, "settlement.stonevein", "Market Ward");
  const zeroTickResult = execute(zeroTickSnapshot, "location.saltmere", 10);
  assert.equal(zeroTickResult.accepted, true);
  assert.equal(zeroTickResult.appliedTick, zeroTickSnapshot.clock.tick);
  assert.deepEqual(
    {
      hp: zeroTickResult.facts.hpCost,
      mp: zeroTickResult.facts.mpCost,
      stamina: zeroTickResult.facts.staminaCost
    },
    { hp: 0, mp: 0, stamina: 0 }
  );
  assert.equal(zeroTickResult.snapshot.sessionState.chronicle[0].statusLabel, undefined);

  const surveySnapshot = cloneDemoSnapshot();
  surveySnapshot.sessionState.trackedQuestId = "quest.ashen_reef_survey";
  const surveyResult = execute(surveySnapshot, "location.ashen_reef", 11);
  assert.equal(surveyResult.accepted, true);
  assert.equal(surveyResult.snapshot.sessionState.currentActivity?.id, "activity.survey.ashen_reef");
  assert.equal(
    surveyResult.snapshot.sessionState.operations.some(
      (operation) => operation.id === "operation.quest.ashen_reef_survey"
    ),
    true
  );

  const porterSnapshot = cloneDemoSnapshot();
  porterSnapshot.sessionState.trackedQuestId = "quest.rivet_shortfall_relief";
  const porterResult = execute(porterSnapshot, "location.westreach", 12);
  assert.equal(porterResult.accepted, true);
  assert.equal(porterResult.snapshot.sessionState.currentActivity?.id, "activity.procure.rivets");
  assert.equal(
    porterResult.snapshot.sessionState.operations.some(
      (operation) => operation.id === "operation.quest.rivet_shortfall_relief"
    ),
    true
  );
});

test("travel command rejections preserve original identity and content", () => {
  const malformedSnapshot = cloneDemoSnapshot();
  const malformedBefore = structuredClone(malformedSnapshot);
  assertRejectedWithoutMutation(
    malformedSnapshot,
    malformedBefore,
    executePlayerTravelCommand(malformedSnapshot, { type: "player.travel" }),
    "malformed_command"
  );

  const wrongPlayerSource = cloneDemoSnapshot();
  const wrongPlayerCommand = createPlayerTravelCommand(wrongPlayerSource, "location.westreach", 1);
  const wrongPlayerSnapshot = cloneDemoSnapshot();
  wrongPlayerSnapshot.playerState.playerId = "player.someone_else";
  const wrongPlayerBefore = structuredClone(wrongPlayerSnapshot);
  assertRejectedWithoutMutation(
    wrongPlayerSnapshot,
    wrongPlayerBefore,
    executePlayerTravelCommand(wrongPlayerSnapshot, wrongPlayerCommand),
    "wrong_player"
  );

  const staleSnapshot = cloneDemoSnapshot();
  const staleCommand = createPlayerTravelCommand(staleSnapshot, "location.westreach", 2);
  staleSnapshot.clock.tick += 1;
  staleSnapshot.capturedAtTick += 1;
  const staleBefore = structuredClone(staleSnapshot);
  assertRejectedWithoutMutation(
    staleSnapshot,
    staleBefore,
    executePlayerTravelCommand(staleSnapshot, staleCommand),
    "stale_snapshot"
  );

  const incoherentSnapshot = cloneDemoSnapshot();
  const incoherentCommand = createPlayerTravelCommand(incoherentSnapshot, "location.westreach", 3);
  incoherentSnapshot.capturedAtTick += 1;
  const incoherentBefore = structuredClone(incoherentSnapshot);
  assertRejectedWithoutMutation(
    incoherentSnapshot,
    incoherentBefore,
    executePlayerTravelCommand(incoherentSnapshot, incoherentCommand),
    "incoherent_state"
  );

  const unknownSnapshot = cloneDemoSnapshot();
  const unknownBefore = structuredClone(unknownSnapshot);
  assertRejectedWithoutMutation(
    unknownSnapshot,
    unknownBefore,
    execute(unknownSnapshot, "location.not_implemented", 4),
    "unknown_destination"
  );

  const undiscoveredSnapshot = cloneDemoSnapshot();
  undiscoveredSnapshot.sessionState.knownLocations = undiscoveredSnapshot.sessionState.knownLocations.map((entry) =>
    entry.id === "location.westreach" ? { ...entry, known: false } : entry
  );
  const undiscoveredBefore = structuredClone(undiscoveredSnapshot);
  assertRejectedWithoutMutation(
    undiscoveredSnapshot,
    undiscoveredBefore,
    execute(undiscoveredSnapshot, "location.westreach", 5),
    "destination_not_known"
  );

  const currentSnapshot = cloneDemoSnapshot();
  const currentBefore = structuredClone(currentSnapshot);
  assertRejectedWithoutMutation(
    currentSnapshot,
    currentBefore,
    execute(currentSnapshot, "location.saltmere", 6),
    "already_at_destination"
  );

  const staleOriginSnapshot = cloneDemoSnapshot();
  const staleOriginCommand = createPlayerTravelCommand(staleOriginSnapshot, "location.westreach", 7);
  moveTo(staleOriginSnapshot, "settlement.starfall_port", "Survey Anchorage");
  const staleOriginBefore = structuredClone(staleOriginSnapshot);
  assertRejectedWithoutMutation(
    staleOriginSnapshot,
    staleOriginBefore,
    executePlayerTravelCommand(staleOriginSnapshot, staleOriginCommand),
    "stale_origin"
  );
});

test("unexpected resolver failure cannot expose a partial clone", () => {
  const snapshot = cloneDemoSnapshot();
  const command = createPlayerTravelCommand(snapshot, "location.westreach", 8);
  const knownLocations = snapshot.sessionState.knownLocations;
  Object.defineProperty(snapshot.sessionState, "knownLocations", {
    configurable: true,
    get() {
      throw new Error("injected resolver failure");
    }
  });

  const result = executePlayerTravelCommand(snapshot, command);
  assert.equal(result.accepted, false);
  assert.equal(result.code, "transition_failed");
  assert.equal(result.snapshot, snapshot);
  assert.deepEqual(result.emittedEvents, []);

  Object.defineProperty(snapshot.sessionState, "knownLocations", {
    configurable: true,
    writable: true,
    value: knownLocations
  });
});

test("identical fixtures are deterministic and same-completion-tick commands remain distinct", () => {
  const firstFixture = cloneDemoSnapshot();
  const secondFixture = cloneDemoSnapshot();
  const first = execute(firstFixture, "location.westreach", 12);
  const repeated = execute(secondFixture, "location.westreach", 12);

  assert.deepEqual(repeated, first);

  const sameTickA = cloneDemoSnapshot();
  const sameTickB = cloneDemoSnapshot();
  sameTickB.clock.tick = sameTickA.clock.tick + 2;
  sameTickB.capturedAtTick = sameTickB.clock.tick;
  moveTo(sameTickB, "settlement.stonevein", "Market Ward");
  const resultA = execute(sameTickA, "location.westreach", 20);
  const resultB = execute(sameTickB, "location.ashen_reef", 21);

  assert.equal(resultA.accepted, true);
  assert.equal(resultB.accepted, true);
  assert.equal(resultA.appliedTick, resultB.appliedTick);
  assert.notEqual(resultA.commandId, resultB.commandId);
  assert.notEqual(resultA.emittedEvents[0].id, resultB.emittedEvents[0].id);
});

test("post-travel serialization preserves every accepted state surface", () => {
  const result = execute(cloneDemoSnapshot(), "location.ashen_reef", 30);
  assert.equal(result.accepted, true);
  const restored = deserializeSnapshot(serializeSnapshot(result.snapshot));
  assert.deepEqual(restored, result.snapshot);
});

test("UI travel bridge contains no travel catalog or direct travel mutation", async () => {
  const gameplayLoop = await readFile(
    new URL("../../apps/rpg-ui/src/game-shell/gameplayLoop.ts", import.meta.url),
    "utf8"
  );
  const worldPanel = await readFile(
    new URL("../../apps/rpg-ui/src/features/WorldPanel.tsx", import.meta.url),
    "utf8"
  );

  assert.equal(gameplayLoop.includes("LOCATION_TEMPLATES"), false);
  assert.match(gameplayLoop, /executePlayerTravelCommand/);
  assert.doesNotMatch(gameplayLoop, /function travelToKnownLocation[\s\S]*?playerState\.location\s*=/);
  assert.match(worldPanel, /if \(result\.accepted\)\s*{\s*updateSnapshot\(result\.snapshot\)/);
});
