import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  createPlayerQuestTrackingCommand,
  executePlayerQuestTrackingCommand,
  resolveNextPlayerQuestTrackingCommandSequence,
  resolvePlayerQuestTrackingPlan
} from "../../packages/engines/game-engine/src/index.ts";
import { EVENT_TYPES } from "../../packages/shared/events/src/index.ts";
import {
  deserializeSnapshot,
  serializeSnapshot
} from "../../packages/shared/persistence/src/index.ts";
import { getQuestCommandState } from "../../apps/rpg-ui/src/game-shell/gameplayLoop.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

const ACTIVE_ID = "quest.ashen_reef_survey";
const CONTRACT_ID = "quest.rivet_shortfall_relief";
const COMPLETED_ID = "quest.ledger_recovery";
const FAILED_ID = "quest.stonepass_escort";

function cloneDemoSnapshot() {
  return structuredClone(demoSnapshot);
}

function execute(snapshot, questId, sequence) {
  return executePlayerQuestTrackingCommand(
    snapshot,
    createPlayerQuestTrackingCommand(snapshot, questId, sequence)
  );
}

function assertRejectedWithoutMutation(snapshot, before, result, code) {
  assert.equal(result.accepted, false);
  assert.equal(result.code, code);
  assert.equal(result.snapshot, snapshot);
  assert.deepEqual(snapshot, before);
  assert.deepEqual(result.emittedEvents, []);
}

test("accepted tracking toggles on and off atomically and emits one typed event", () => {
  const trackedSnapshot = cloneDemoSnapshot();
  const trackedBefore = structuredClone(trackedSnapshot);
  const notificationsBefore = structuredClone(trackedSnapshot.sessionState.notifications);
  const chronicleBefore = structuredClone(trackedSnapshot.sessionState.chronicle);
  const tracked = execute(trackedSnapshot, CONTRACT_ID, 7);

  assert.equal(tracked.accepted, true);
  assert.equal(tracked.appliedTick, trackedBefore.clock.tick);
  assert.notEqual(tracked.snapshot, trackedSnapshot);
  assert.deepEqual(trackedSnapshot, trackedBefore);
  assert.equal(tracked.snapshot.sessionState.trackedQuestId, CONTRACT_ID);
  assert.equal(tracked.facts.tracked, true);
  assert.equal(tracked.facts.previousTrackedQuestId, ACTIVE_ID);
  assert.equal(tracked.facts.nextTrackedQuestId, CONTRACT_ID);
  assert.equal(tracked.emittedEvents.length, 1);
  assert.equal(tracked.emittedEvents[0].type, EVENT_TYPES.PLAYER_QUEST_TRACKING_CHANGED);
  assert.equal(tracked.emittedEvents[0].payload.commandId, tracked.commandId);
  assert.equal(tracked.emittedEvents[0].payload.tracked, true);
  assert.deepEqual(Object.keys(tracked.emittedEvents[0].payload), [
    "commandId",
    "playerId",
    "questId",
    "previousTrackedQuestId",
    "nextTrackedQuestId",
    "tracked"
  ]);
  assert.equal(Object.hasOwn(tracked.emittedEvents[0].payload, "title"), false);
  assert.equal(tracked.facts.title, "Rivet Shortfall Relief");
  assert.equal(tracked.noticeFacts.questTitle, "Rivet Shortfall Relief");
  assert.deepEqual(tracked.snapshot.sessionState.notifications, notificationsBefore);
  assert.deepEqual(tracked.snapshot.sessionState.chronicle, chronicleBefore);

  const untrackedSnapshot = cloneDemoSnapshot();
  const untrackedBefore = structuredClone(untrackedSnapshot);
  const untracked = execute(untrackedSnapshot, ACTIVE_ID, 8);
  assert.equal(untracked.accepted, true);
  assert.equal(untracked.snapshot.sessionState.trackedQuestId, null);
  assert.equal(untracked.facts.tracked, false);
  assert.equal(untracked.emittedEvents[0].payload.nextTrackedQuestId, null);
  assert.deepEqual(untrackedSnapshot, untrackedBefore);
});

test("tracking resolver owns current eligibility and toggle facts", () => {
  const snapshot = cloneDemoSnapshot();
  const activePlan = resolvePlayerQuestTrackingPlan(snapshot, ACTIVE_ID);
  const contractPlan = resolvePlayerQuestTrackingPlan(snapshot, CONTRACT_ID);

  assert.equal(activePlan.accepted, true);
  assert.equal(activePlan.facts.tracked, false);
  assert.equal(contractPlan.accepted, true);
  assert.equal(contractPlan.facts.tracked, true);
  assert.equal(resolvePlayerQuestTrackingPlan(snapshot, "quest.missing").code, "quest_missing");
  assert.equal(resolvePlayerQuestTrackingPlan(snapshot, COMPLETED_ID).code, "quest_not_trackable");
  assert.equal(resolvePlayerQuestTrackingPlan(snapshot, FAILED_ID).code, "quest_not_trackable");
  assert.equal(getQuestCommandState(snapshot, ACTIVE_ID).canTrack, true);
  assert.equal(getQuestCommandState(snapshot, CONTRACT_ID).canTrack, true);
  assert.equal(getQuestCommandState(snapshot, COMPLETED_ID).canTrack, false);
  assert.equal(getQuestCommandState(snapshot, FAILED_ID).canTrack, false);
  assert.equal(getQuestCommandState(snapshot, "quest.missing").canTrack, false);
});

test("tracking command shape and default sequence are deterministic", () => {
  const snapshot = cloneDemoSnapshot();
  const expectedSequence = snapshot.sessionState.questJournal.length + 1;
  const first = createPlayerQuestTrackingCommand(snapshot, CONTRACT_ID);
  const repeated = createPlayerQuestTrackingCommand(cloneDemoSnapshot(), CONTRACT_ID);

  assert.equal(resolveNextPlayerQuestTrackingCommandSequence(snapshot), expectedSequence);
  assert.equal(first.commandSequence, expectedSequence);
  assert.deepEqual(repeated, first);
  assert.match(first.commandId, /^command\.player\.quest\.track:/);
});

test("quest tracking rejections preserve original identity and content", () => {
  const malformedSnapshot = cloneDemoSnapshot();
  const malformedBefore = structuredClone(malformedSnapshot);
  assertRejectedWithoutMutation(
    malformedSnapshot,
    malformedBefore,
    executePlayerQuestTrackingCommand(malformedSnapshot, { type: "player.quest.track" }),
    "malformed_command"
  );

  const wrongPlayerSource = cloneDemoSnapshot();
  const wrongPlayerCommand = createPlayerQuestTrackingCommand(wrongPlayerSource, CONTRACT_ID, 1);
  const wrongPlayerSnapshot = cloneDemoSnapshot();
  wrongPlayerSnapshot.playerState.playerId = "player.someone_else";
  const wrongPlayerBefore = structuredClone(wrongPlayerSnapshot);
  assertRejectedWithoutMutation(
    wrongPlayerSnapshot,
    wrongPlayerBefore,
    executePlayerQuestTrackingCommand(wrongPlayerSnapshot, wrongPlayerCommand),
    "wrong_player"
  );

  const staleSnapshot = cloneDemoSnapshot();
  const staleCommand = createPlayerQuestTrackingCommand(staleSnapshot, CONTRACT_ID, 2);
  staleSnapshot.clock.tick += 1;
  staleSnapshot.capturedAtTick += 1;
  const staleBefore = structuredClone(staleSnapshot);
  assertRejectedWithoutMutation(
    staleSnapshot,
    staleBefore,
    executePlayerQuestTrackingCommand(staleSnapshot, staleCommand),
    "stale_snapshot"
  );

  const incoherentSnapshot = cloneDemoSnapshot();
  const incoherentCommand = createPlayerQuestTrackingCommand(incoherentSnapshot, CONTRACT_ID, 3);
  incoherentSnapshot.capturedAtTick += 1;
  const incoherentBefore = structuredClone(incoherentSnapshot);
  assertRejectedWithoutMutation(
    incoherentSnapshot,
    incoherentBefore,
    executePlayerQuestTrackingCommand(incoherentSnapshot, incoherentCommand),
    "incoherent_state"
  );

  for (const [questId, code] of [
    ["quest.missing", "quest_missing"],
    [COMPLETED_ID, "quest_not_trackable"],
    [FAILED_ID, "quest_not_trackable"]
  ]) {
    const snapshot = cloneDemoSnapshot();
    const before = structuredClone(snapshot);
    assertRejectedWithoutMutation(snapshot, before, execute(snapshot, questId, 4), code);
  }
});

test("unexpected tracking failure cannot expose a partial clone", () => {
  const snapshot = cloneDemoSnapshot();
  const command = createPlayerQuestTrackingCommand(snapshot, CONTRACT_ID, 9);
  const before = structuredClone(snapshot);
  const questJournal = snapshot.sessionState.questJournal;
  Object.defineProperty(snapshot.sessionState, "questJournal", {
    configurable: true,
    get() {
      throw new Error("injected tracking resolver failure");
    }
  });

  const result = executePlayerQuestTrackingCommand(snapshot, command);
  assert.equal(result.accepted, false);
  assert.equal(result.code, "transition_failed");
  assert.equal(result.snapshot, snapshot);
  assert.deepEqual(result.emittedEvents, []);

  Object.defineProperty(snapshot.sessionState, "questJournal", {
    configurable: true,
    writable: true,
    value: questJournal
  });
  assert.deepEqual(snapshot, before);
});

test("identical fixtures are deterministic and distinct same-tick tracking commands remain distinct", () => {
  const first = execute(cloneDemoSnapshot(), CONTRACT_ID, 12);
  const repeated = execute(cloneDemoSnapshot(), CONTRACT_ID, 12);
  assert.deepEqual(repeated, first);

  const sameTickFixture = cloneDemoSnapshot();
  const resultA = execute(structuredClone(sameTickFixture), CONTRACT_ID, 20);
  const resultB = execute(structuredClone(sameTickFixture), ACTIVE_ID, 21);

  assert.equal(resultA.accepted, true);
  assert.equal(resultB.accepted, true);
  assert.equal(resultA.appliedTick, resultB.appliedTick);
  assert.notEqual(resultA.commandId, resultB.commandId);
  assert.notEqual(resultA.emittedEvents[0].id, resultB.emittedEvents[0].id);
});

test("post-tracking serialization preserves state without persisting command correlation", () => {
  const result = execute(cloneDemoSnapshot(), CONTRACT_ID, 40);
  assert.equal(result.accepted, true);
  const serialized = serializeSnapshot(result.snapshot);
  assert.equal(serialized.includes(result.commandId), false);
  assert.deepEqual(deserializeSnapshot(serialized), result.snapshot);
});

test("UI tracking bridge contains no direct mutation and applies accepted state only", async () => {
  const gameplayLoop = await readFile(
    new URL("../../apps/rpg-ui/src/game-shell/gameplayLoop.ts", import.meta.url),
    "utf8"
  );
  const questsPanel = await readFile(
    new URL("../../apps/rpg-ui/src/features/QuestsPanel.tsx", import.meta.url),
    "utf8"
  );
  const engineModule = await readFile(
    new URL("../../packages/engines/game-engine/src/player-quest-tracking.ts", import.meta.url),
    "utf8"
  );
  const jsPeer = await readFile(
    new URL("../../packages/engines/game-engine/src/player-quest-tracking.js", import.meta.url),
    "utf8"
  );

  const trackStart = gameplayLoop.indexOf("function createPlayerQuestTrackingNotice");
  const activityStart = gameplayLoop.indexOf("export function setCurrentActivityFromRecord");
  const trackingBridge = gameplayLoop.slice(trackStart, activityStart);
  assert.match(trackingBridge, /executePlayerQuestTrackingCommand/);
  assert.doesNotMatch(trackingBridge, /sessionState\.trackedQuestId\s*=/);
  assert.match(gameplayLoop, /const trackingPlan = resolvePlayerQuestTrackingPlan\(snapshot, questId\);/);
  assert.match(
    questsPanel,
    /const result = toggleTrackedQuest\(snapshot, selectedItem\.id\);\s*if \(result\.accepted\) \{\s*updateSnapshot\(result\.snapshot\);\s*}/
  );
  assert.doesNotMatch(engineModule, /node:/);
  assert.equal(jsPeer.trim(), 'export * from "./player-quest-tracking.ts";');
});
