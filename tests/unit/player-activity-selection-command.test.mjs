import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  createPlayerActivitySelectionCommand,
  executePlayerActivitySelectionCommand,
  resolveNextPlayerActivitySelectionCommandSequence,
  resolvePlayerActivitySelectionPlan
} from "../../packages/engines/game-engine/src/index.ts";
import { EVENT_TYPES } from "../../packages/shared/events/src/index.ts";
import {
  deserializeSnapshot,
  serializeSnapshot
} from "../../packages/shared/persistence/src/index.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

const RECORD_ID = "job.harbor_surveyor";
const SECOND_RECORD_ID = "business.gannet_cutter";
const MISSING_ID = "activity.missing";

const WATCH_LABELS = {
  1: "Dawn Watch",
  2: "High Sun",
  3: "Dusk Watch",
  4: "Night Watch"
};

function cloneDemoSnapshot() {
  return structuredClone(demoSnapshot);
}

function execute(snapshot, recordId, sequence) {
  return executePlayerActivitySelectionCommand(
    snapshot,
    createPlayerActivitySelectionCommand(snapshot, recordId, sequence)
  );
}

function assertRejectedWithoutMutation(snapshot, before, result, code) {
  assert.equal(result.accepted, false);
  assert.equal(result.code, code);
  assert.equal(result.snapshot, snapshot);
  assert.deepEqual(snapshot, before);
  assert.deepEqual(result.emittedEvents, []);
}

test("accepted activity selection preserves exact state, notification, and event boundaries", () => {
  const snapshot = cloneDemoSnapshot();
  const before = structuredClone(snapshot);
  const chronicleBefore = structuredClone(snapshot.sessionState.chronicle);
  const notificationCountBefore = snapshot.sessionState.notifications.length;
  const result = execute(snapshot, RECORD_ID, 7);

  assert.equal(result.accepted, true);
  assert.equal(result.code, "activity_selected");
  assert.equal(result.appliedTick, before.clock.tick);
  assert.notEqual(result.snapshot, snapshot);
  assert.deepEqual(snapshot, before);
  assert.deepEqual(result.snapshot.sessionState.currentActivity, {
    id: RECORD_ID,
    label: "Harbor Surveyor",
    category: "Employment",
    detail: "Paid civic role focused on route inspection, pier records, and hazard surveys."
  });
  assert.deepEqual(result.snapshot.sessionState.notifications[0], {
    id: `notification.${before.clock.tick}.${notificationCountBefore + 1}`,
    title: "Current activity set",
    detail: "Harbor Surveyor is now the focus of the current shift.",
    timeLabel: `Day ${before.clock.day}, ${WATCH_LABELS[before.clock.subday] ?? "Unknown Watch"}`,
    tone: "accent"
  });
  assert.deepEqual(result.snapshot.sessionState.chronicle, chronicleBefore);
  assert.equal(result.facts.label, "Harbor Surveyor");
  assert.equal(result.noticeFacts.recordLabel, "Harbor Surveyor");
  assert.equal(result.emittedEvents.length, 1);
  assert.equal(result.emittedEvents[0].type, EVENT_TYPES.PLAYER_ACTIVITY_SELECTED);
  assert.deepEqual(Object.keys(result.emittedEvents[0].payload), [
    "commandId",
    "playerId",
    "recordId",
    "previousActivityId",
    "selectedActivityId"
  ]);
  assert.deepEqual(result.emittedEvents[0].payload, {
    commandId: result.commandId,
    playerId: before.playerState.playerId,
    recordId: RECORD_ID,
    previousActivityId: before.sessionState.currentActivity.id,
    selectedActivityId: RECORD_ID
  });
  for (const key of ["label", "category", "detail", "title", "notice", "notification"]) {
    assert.equal(Object.hasOwn(result.emittedEvents[0].payload, key), false);
  }
});

test("activity selection resolver owns lookup and exact category derivation", () => {
  const snapshot = cloneDemoSnapshot();
  const available = resolvePlayerActivitySelectionPlan(snapshot, RECORD_ID);

  assert.equal(available.accepted, true);
  assert.equal(available.code, "activity_selection_available");
  assert.equal(available.facts.category, "Employment");
  assert.equal(resolvePlayerActivitySelectionPlan(snapshot, MISSING_ID).code, "activity_missing");

  snapshot.sessionState.activityRecords.push({
    id: "activity.category_fixture",
    sectionId: "activity.deep_field-work",
    title: "Category Fixture",
    summary: "Category derivation fixture.",
    tags: [],
    detailEntries: []
  });
  assert.equal(
    resolvePlayerActivitySelectionPlan(snapshot, "activity.category_fixture").facts.category,
    "Deep Field Work"
  );
  snapshot.sessionState.activityRecords.at(-1).sectionId = "";
  assert.equal(
    resolvePlayerActivitySelectionPlan(snapshot, "activity.category_fixture").facts.category,
    "Unknown"
  );
});

test("selection notification remains newest-first, capped, and repeatable for the same record", () => {
  const cappedSnapshot = cloneDemoSnapshot();
  cappedSnapshot.sessionState.notifications = Array.from({ length: 8 }, (_, index) => ({
    id: `notification.fixture.${index + 1}`,
    title: `Fixture ${index + 1}`,
    detail: "Notification cap fixture.",
    timeLabel: "Day 1, Dawn Watch",
    tone: "neutral"
  }));
  const cappedBefore = structuredClone(cappedSnapshot.sessionState.notifications);
  const capped = execute(cappedSnapshot, RECORD_ID, 9);

  assert.equal(capped.accepted, true);
  assert.equal(capped.snapshot.sessionState.notifications.length, 8);
  assert.equal(capped.snapshot.sessionState.notifications[0].id, `notification.${cappedSnapshot.clock.tick}.9`);
  assert.deepEqual(capped.snapshot.sessionState.notifications[1], cappedBefore[0]);
  assert.equal(
    capped.snapshot.sessionState.notifications.some((entry) => entry.id === cappedBefore[7].id),
    false
  );

  const repeatSnapshot = cloneDemoSnapshot();
  const first = execute(repeatSnapshot, RECORD_ID, 10);
  const repeated = execute(first.snapshot, RECORD_ID, 11);
  assert.equal(first.accepted, true);
  assert.equal(repeated.accepted, true);
  assert.equal(repeated.facts.previousActivityId, RECORD_ID);
  assert.equal(
    repeated.snapshot.sessionState.notifications.length,
    Math.min(first.snapshot.sessionState.notifications.length + 1, 8)
  );
  assert.equal(repeated.snapshot.sessionState.notifications[0].title, "Current activity set");
});

test("activity selection command shape and default sequence are deterministic", () => {
  const snapshot = cloneDemoSnapshot();
  const expectedSequence = snapshot.sessionState.activityRecords.length + 1;
  const first = createPlayerActivitySelectionCommand(snapshot, RECORD_ID);
  const repeated = createPlayerActivitySelectionCommand(cloneDemoSnapshot(), RECORD_ID);

  assert.equal(resolveNextPlayerActivitySelectionCommandSequence(snapshot), expectedSequence);
  assert.equal(first.commandSequence, expectedSequence);
  assert.deepEqual(repeated, first);
  assert.match(first.commandId, /^command\.player\.activity\.select:/);
});

test("activity selection rejections preserve original identity and content", () => {
  const malformedSnapshot = cloneDemoSnapshot();
  const malformedBefore = structuredClone(malformedSnapshot);
  assertRejectedWithoutMutation(
    malformedSnapshot,
    malformedBefore,
    executePlayerActivitySelectionCommand(malformedSnapshot, { type: "player.activity.select" }),
    "malformed_command"
  );

  const wrongPlayerSource = cloneDemoSnapshot();
  const wrongPlayerCommand = createPlayerActivitySelectionCommand(wrongPlayerSource, RECORD_ID, 1);
  const wrongPlayerSnapshot = cloneDemoSnapshot();
  wrongPlayerSnapshot.playerState.playerId = "player.someone_else";
  const wrongPlayerBefore = structuredClone(wrongPlayerSnapshot);
  assertRejectedWithoutMutation(
    wrongPlayerSnapshot,
    wrongPlayerBefore,
    executePlayerActivitySelectionCommand(wrongPlayerSnapshot, wrongPlayerCommand),
    "wrong_player"
  );

  const staleTickSnapshot = cloneDemoSnapshot();
  const staleTickCommand = createPlayerActivitySelectionCommand(staleTickSnapshot, RECORD_ID, 2);
  staleTickSnapshot.clock.tick += 1;
  staleTickSnapshot.capturedAtTick += 1;
  const staleTickBefore = structuredClone(staleTickSnapshot);
  assertRejectedWithoutMutation(
    staleTickSnapshot,
    staleTickBefore,
    executePlayerActivitySelectionCommand(staleTickSnapshot, staleTickCommand),
    "stale_snapshot"
  );

  const staleVersionSnapshot = cloneDemoSnapshot();
  const staleVersionCommand = createPlayerActivitySelectionCommand(staleVersionSnapshot, RECORD_ID, 3);
  staleVersionSnapshot.snapshotVersion = `${staleVersionSnapshot.snapshotVersion}.stale`;
  const staleVersionBefore = structuredClone(staleVersionSnapshot);
  assertRejectedWithoutMutation(
    staleVersionSnapshot,
    staleVersionBefore,
    executePlayerActivitySelectionCommand(staleVersionSnapshot, staleVersionCommand),
    "stale_snapshot"
  );

  const staleRevisionSnapshot = cloneDemoSnapshot();
  const staleRevisionCommand = createPlayerActivitySelectionCommand(staleRevisionSnapshot, RECORD_ID, 4);
  staleRevisionSnapshot.sessionState.flags.push("activity.selection.revision.changed");
  const staleRevisionBefore = structuredClone(staleRevisionSnapshot);
  assertRejectedWithoutMutation(
    staleRevisionSnapshot,
    staleRevisionBefore,
    executePlayerActivitySelectionCommand(staleRevisionSnapshot, staleRevisionCommand),
    "stale_snapshot"
  );

  const incoherentSnapshot = cloneDemoSnapshot();
  const incoherentCommand = createPlayerActivitySelectionCommand(incoherentSnapshot, RECORD_ID, 5);
  incoherentSnapshot.capturedAtTick += 1;
  const incoherentBefore = structuredClone(incoherentSnapshot);
  assertRejectedWithoutMutation(
    incoherentSnapshot,
    incoherentBefore,
    executePlayerActivitySelectionCommand(incoherentSnapshot, incoherentCommand),
    "incoherent_state"
  );

  const missingSnapshot = cloneDemoSnapshot();
  const missingBefore = structuredClone(missingSnapshot);
  assertRejectedWithoutMutation(
    missingSnapshot,
    missingBefore,
    execute(missingSnapshot, MISSING_ID, 6),
    "activity_missing"
  );
});

test("unexpected activity selection failure cannot expose a partial clone", () => {
  const snapshot = cloneDemoSnapshot();
  const command = createPlayerActivitySelectionCommand(snapshot, RECORD_ID, 20);
  const before = structuredClone(snapshot);
  const activityRecords = snapshot.sessionState.activityRecords;
  Object.defineProperty(snapshot.sessionState, "activityRecords", {
    configurable: true,
    get() {
      throw new Error("injected activity selection failure");
    }
  });

  const result = executePlayerActivitySelectionCommand(snapshot, command);
  assert.equal(result.accepted, false);
  assert.equal(result.code, "transition_failed");
  assert.equal(result.snapshot, snapshot);
  assert.deepEqual(result.emittedEvents, []);

  Object.defineProperty(snapshot.sessionState, "activityRecords", {
    configurable: true,
    writable: true,
    value: activityRecords
  });
  assert.deepEqual(snapshot, before);
});

test("identical fixtures are deterministic and different records remain distinct at equal sequence", () => {
  const first = execute(cloneDemoSnapshot(), RECORD_ID, 30);
  const repeated = execute(cloneDemoSnapshot(), RECORD_ID, 30);
  assert.deepEqual(repeated, first);

  const sameTickFixture = cloneDemoSnapshot();
  const commandA = createPlayerActivitySelectionCommand(sameTickFixture, RECORD_ID, 31);
  const commandB = createPlayerActivitySelectionCommand(sameTickFixture, SECOND_RECORD_ID, 31);
  assert.equal(commandA.expectedTick, commandB.expectedTick);
  assert.equal(commandA.commandSequence, commandB.commandSequence);
  assert.equal(commandA.playerId, commandB.playerId);
  assert.equal(commandA.expectedSnapshotVersion, commandB.expectedSnapshotVersion);
  assert.equal(commandA.expectedRevision, commandB.expectedRevision);
  assert.notEqual(commandA.recordId, commandB.recordId);
  assert.notEqual(commandA.commandId, commandB.commandId);

  const resultA = executePlayerActivitySelectionCommand(structuredClone(sameTickFixture), commandA);
  const resultB = executePlayerActivitySelectionCommand(structuredClone(sameTickFixture), commandB);
  assert.equal(resultA.accepted, true);
  assert.equal(resultB.accepted, true);
  assert.equal(resultA.appliedTick, resultB.appliedTick);
  assert.notEqual(resultA.commandId, resultB.commandId);
  assert.notEqual(resultA.emittedEvents[0].id, resultB.emittedEvents[0].id);
});

test("post-selection serialization preserves state without command correlation", () => {
  const result = execute(cloneDemoSnapshot(), RECORD_ID, 40);
  assert.equal(result.accepted, true);
  const serialized = serializeSnapshot(result.snapshot);
  assert.equal(serialized.includes(result.commandId), false);
  assert.deepEqual(deserializeSnapshot(serialized), result.snapshot);
});

test("UI activity selection bridge has no direct mutation and applies accepted state only", async () => {
  const gameplayLoop = await readFile(
    new URL("../../apps/rpg-ui/src/game-shell/gameplayLoop.ts", import.meta.url),
    "utf8"
  );
  const activityPanel = await readFile(
    new URL("../../apps/rpg-ui/src/features/ActivityPanel.tsx", import.meta.url),
    "utf8"
  );
  const engineModule = await readFile(
    new URL("../../packages/engines/game-engine/src/player-activity-selection.ts", import.meta.url),
    "utf8"
  );
  const jsPeer = await readFile(
    new URL("../../packages/engines/game-engine/src/player-activity-selection.js", import.meta.url),
    "utf8"
  );

  const selectionStart = gameplayLoop.indexOf("function createPlayerActivitySelectionNotice");
  const travelNoticeStart = gameplayLoop.indexOf("function createPlayerTravelNotice");
  const selectionBridge = gameplayLoop.slice(selectionStart, travelNoticeStart);
  assert.match(selectionBridge, /executePlayerActivitySelectionCommand/);
  assert.doesNotMatch(selectionBridge, /sessionState\.currentActivity\s*=/);
  assert.doesNotMatch(selectionBridge, /appendNotification/);
  assert.doesNotMatch(gameplayLoop, /function humanizeId/);
  assert.match(
    activityPanel,
    /const result = setCurrentActivityFromRecord\(snapshot, selectedItem\.id\);\s*if \(result\.accepted\) \{\s*updateSnapshot\(result\.snapshot,\s*\{[\s\S]*?ownerKind: 'engine_result',[\s\S]*?mutationId: result\.commandId,[\s\S]*?resultId: result\.resultId \?\? result\.commandId[\s\S]*?\}\);\s*}\s*setPanelNotice\(result\.notice\);/
  );
  assert.doesNotMatch(engineModule, /node:/);
  assert.equal(jsPeer.trim(), 'export * from "./player-activity-selection.ts";');
});
