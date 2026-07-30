import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  createPlayerQuestAcceptanceCommand,
  executePlayerQuestAcceptanceCommand,
  resolvePlayerQuestAcceptancePlan
} from "../../packages/engines/game-engine/src/index.ts";
import { EVENT_TYPES } from "../../packages/shared/events/src/index.ts";
import {
  deserializeSnapshot,
  serializeSnapshot
} from "../../packages/shared/persistence/src/index.ts";
import {
  getQuestCommandState
} from "../../apps/rpg-ui/src/game-shell/gameplayLoop.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

const CONTRACT_ID = "quest.rivet_shortfall_relief";
const ACTIVE_ID = "quest.ashen_reef_survey";
const COMPLETED_ID = "quest.ledger_recovery";
const FAILED_ID = "quest.stonepass_escort";

function cloneDemoSnapshot() {
  return structuredClone(demoSnapshot);
}

function execute(snapshot, questId, sequence) {
  return executePlayerQuestAcceptanceCommand(
    snapshot,
    createPlayerQuestAcceptanceCommand(snapshot, questId, sequence)
  );
}

function assertRejectedWithoutMutation(snapshot, before, result, code) {
  assert.equal(result.accepted, false);
  assert.equal(result.code, code);
  assert.equal(result.snapshot, snapshot);
  assert.deepEqual(snapshot, before);
  assert.deepEqual(result.emittedEvents, []);
}

test("accepted quest command preserves the current synchronized result and emits one typed event", () => {
  const snapshot = cloneDemoSnapshot();
  const before = structuredClone(snapshot);
  const result = execute(snapshot, CONTRACT_ID, 7);

  assert.equal(result.accepted, true);
  assert.equal(result.appliedTick, before.clock.tick);
  assert.notEqual(result.snapshot, snapshot);
  assert.deepEqual(snapshot, before);
  assert.equal(result.emittedEvents.length, 1);
  assert.equal(result.emittedEvents[0].type, EVENT_TYPES.PLAYER_QUEST_ACCEPTED);
  assert.equal(result.emittedEvents[0].payload.commandId, result.commandId);
  assert.equal(result.emittedEvents[0].payload.questId, CONTRACT_ID);

  const acceptedQuest = result.snapshot.sessionState.questJournal.find((entry) => entry.id === CONTRACT_ID);
  assert.equal(acceptedQuest?.category, "active");
  assert.equal(acceptedQuest?.statusLabel, "Tracked - Procurement active");
  assert.equal(acceptedQuest?.tracked, true);
  assert.equal(result.snapshot.sessionState.trackedQuestId, CONTRACT_ID);
  assert.deepEqual(result.snapshot.sessionState.currentActivity, {
    id: `activity.prepare.${CONTRACT_ID}`,
    label: "Preparing Rivet Shortfall Relief",
    category: "Contract",
    detail: "Secure a fast shipment of deepiron rivets for the Saltmere drydocks."
  });
  assert.equal(result.snapshot.sessionState.notifications[0].title, "Contract accepted");
  assert.equal(result.snapshot.sessionState.chronicle[0].statusLabel, "Accepted");
  assert.equal(result.snapshot.playerState.activeQuestIds.includes(CONTRACT_ID), true);
});

test("acceptance resolver supplies UI eligibility and execution facts", () => {
  const snapshot = cloneDemoSnapshot();
  const plan = resolvePlayerQuestAcceptancePlan(snapshot, CONTRACT_ID);
  const commandState = getQuestCommandState(snapshot, CONTRACT_ID);
  const result = execute(snapshot, CONTRACT_ID, 8);

  assert.equal(plan.accepted, true);
  assert.equal(commandState.canAccept, true);
  assert.equal(result.accepted, true);
  assert.deepEqual(result.facts, plan.facts);

  assert.equal(resolvePlayerQuestAcceptancePlan(snapshot, ACTIVE_ID).accepted, false);
  assert.equal(getQuestCommandState(snapshot, ACTIVE_ID).canAccept, false);
});

test("quest acceptance rejections preserve original identity and content", () => {
  const malformedSnapshot = cloneDemoSnapshot();
  const malformedBefore = structuredClone(malformedSnapshot);
  assertRejectedWithoutMutation(
    malformedSnapshot,
    malformedBefore,
    executePlayerQuestAcceptanceCommand(malformedSnapshot, { type: "player.quest.accept" }),
    "malformed_command"
  );

  const wrongPlayerSource = cloneDemoSnapshot();
  const wrongPlayerCommand = createPlayerQuestAcceptanceCommand(wrongPlayerSource, CONTRACT_ID, 1);
  const wrongPlayerSnapshot = cloneDemoSnapshot();
  wrongPlayerSnapshot.playerState.playerId = "player.someone_else";
  const wrongPlayerBefore = structuredClone(wrongPlayerSnapshot);
  assertRejectedWithoutMutation(
    wrongPlayerSnapshot,
    wrongPlayerBefore,
    executePlayerQuestAcceptanceCommand(wrongPlayerSnapshot, wrongPlayerCommand),
    "wrong_player"
  );

  const staleSnapshot = cloneDemoSnapshot();
  const staleCommand = createPlayerQuestAcceptanceCommand(staleSnapshot, CONTRACT_ID, 2);
  staleSnapshot.clock.tick += 1;
  staleSnapshot.capturedAtTick += 1;
  const staleBefore = structuredClone(staleSnapshot);
  assertRejectedWithoutMutation(
    staleSnapshot,
    staleBefore,
    executePlayerQuestAcceptanceCommand(staleSnapshot, staleCommand),
    "stale_snapshot"
  );

  const incoherentSnapshot = cloneDemoSnapshot();
  const incoherentCommand = createPlayerQuestAcceptanceCommand(incoherentSnapshot, CONTRACT_ID, 3);
  incoherentSnapshot.capturedAtTick += 1;
  const incoherentBefore = structuredClone(incoherentSnapshot);
  assertRejectedWithoutMutation(
    incoherentSnapshot,
    incoherentBefore,
    executePlayerQuestAcceptanceCommand(incoherentSnapshot, incoherentCommand),
    "incoherent_state"
  );

  for (const [questId, code] of [
    ["quest.missing", "quest_missing"],
    [ACTIVE_ID, "quest_not_available"],
    [COMPLETED_ID, "quest_not_available"],
    [FAILED_ID, "quest_not_available"]
  ]) {
    const snapshot = cloneDemoSnapshot();
    const before = structuredClone(snapshot);
    assertRejectedWithoutMutation(snapshot, before, execute(snapshot, questId, 4), code);
  }
});

test("unexpected acceptance failure cannot expose a partial clone", () => {
  const snapshot = cloneDemoSnapshot();
  const command = createPlayerQuestAcceptanceCommand(snapshot, CONTRACT_ID, 9);
  const before = structuredClone(snapshot);
  const questJournal = snapshot.sessionState.questJournal;
  Object.defineProperty(snapshot.sessionState, "questJournal", {
    configurable: true,
    get() {
      throw new Error("injected acceptance resolver failure");
    }
  });

  const result = executePlayerQuestAcceptanceCommand(snapshot, command);
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

test("identical fixtures are deterministic and distinct same-tick acceptances remain distinct", () => {
  const first = execute(cloneDemoSnapshot(), CONTRACT_ID, 12);
  const repeated = execute(cloneDemoSnapshot(), CONTRACT_ID, 12);
  assert.deepEqual(repeated, first);

  const sameTickFixture = cloneDemoSnapshot();
  sameTickFixture.sessionState.questJournal = sameTickFixture.sessionState.questJournal.map((entry) =>
    entry.id === ACTIVE_ID
      ? { ...entry, category: "contracts", statusLabel: "Open contract", tracked: false }
      : entry
  );
  const resultA = execute(structuredClone(sameTickFixture), CONTRACT_ID, 20);
  const resultB = execute(structuredClone(sameTickFixture), ACTIVE_ID, 21);

  assert.equal(resultA.accepted, true);
  assert.equal(resultB.accepted, true);
  assert.equal(resultA.appliedTick, resultB.appliedTick);
  assert.notEqual(resultA.commandId, resultB.commandId);
  assert.notEqual(resultA.emittedEvents[0].id, resultB.emittedEvents[0].id);
});

test("acceptance preserves notification and Chronicle caps", () => {
  const snapshot = cloneDemoSnapshot();
  const notification = snapshot.sessionState.notifications[0];
  const chronicle = snapshot.sessionState.chronicle[0];
  snapshot.sessionState.notifications = Array.from({ length: 8 }, (_, index) => ({
    ...notification,
    id: `notification.fixture.${index + 1}`
  }));
  snapshot.sessionState.chronicle = Array.from({ length: 48 }, (_, index) => ({
    ...chronicle,
    id: `chronicle.fixture.${index + 1}`
  }));

  const result = execute(snapshot, CONTRACT_ID, 30);
  assert.equal(result.accepted, true);
  assert.equal(result.snapshot.sessionState.notifications.length, 8);
  assert.equal(result.snapshot.sessionState.chronicle.length, 48);
  assert.equal(result.snapshot.sessionState.notifications[0].id, `notification.${snapshot.clock.tick}.9`);
  assert.equal(result.snapshot.sessionState.chronicle[0].id, `chronicle.${snapshot.clock.tick}.49`);
});

test("post-acceptance serialization preserves state without persisting command correlation", () => {
  const result = execute(cloneDemoSnapshot(), CONTRACT_ID, 40);
  assert.equal(result.accepted, true);
  const serialized = serializeSnapshot(result.snapshot);
  assert.equal(serialized.includes(result.commandId), false);
  assert.deepEqual(deserializeSnapshot(serialized), result.snapshot);
});

test("UI quest acceptance bridge contains no direct mutation and applies accepted state only", async () => {
  const gameplayLoop = await readFile(
    new URL("../../apps/rpg-ui/src/game-shell/gameplayLoop.ts", import.meta.url),
    "utf8"
  );
  const questsPanel = await readFile(
    new URL("../../apps/rpg-ui/src/features/QuestsPanel.tsx", import.meta.url),
    "utf8"
  );
  const engineModule = await readFile(
    new URL("../../packages/engines/game-engine/src/player-quest-acceptance.ts", import.meta.url),
    "utf8"
  );

  const acceptStart = gameplayLoop.indexOf("export function acceptQuest");
  const trackStart = gameplayLoop.indexOf("export function toggleTrackedQuest");
  const acceptBridge = gameplayLoop.slice(acceptStart, trackStart);
  assert.match(acceptBridge, /executePlayerQuestAcceptanceCommand/);
  assert.doesNotMatch(acceptBridge, /sessionState\.questJournal\s*=/);
  assert.doesNotMatch(acceptBridge, /sessionState\.trackedQuestId\s*=/);
  assert.doesNotMatch(acceptBridge, /sessionState\.currentActivity\s*=/);
  assert.match(
    questsPanel,
    /if \(result\.accepted\)\s*{\s*updateSnapshot\(result\.snapshot,\s*\{[\s\S]*?ownerKind: 'engine_result',[\s\S]*?mutationId: result\.commandId,[\s\S]*?resultId: result\.resultId \?\? result\.commandId[\s\S]*?\}\);\s*setActiveSection\('active'\);\s*}/
  );
  assert.doesNotMatch(engineModule, /node:/);
});
