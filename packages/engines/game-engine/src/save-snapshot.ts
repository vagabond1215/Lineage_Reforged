import type { GameTickContext, SaveSnapshot, SessionState } from "../../../shared/types/src/index.js";
import { createEmptyCombatUiState } from "./combat/state.js";

export function createEmptySessionState(): SessionState {
  return {
    activeEvents: [],
    flags: [],
    triggers: [],
    completedEvents: [],
    trackedQuestId: null,
    currentActivity: null,
    pinnedRecordIds: [],
    notifications: [],
    knownLocations: [],
    worldRecords: [],
    activityRecords: [],
    operations: [],
    codexEntries: [],
    questJournal: [],
    chronicle: [],
    combatUi: createEmptyCombatUiState()
  };
}

export function createSaveSnapshotFromGameContext(
  context: GameTickContext,
  sessionState: SessionState = context.sessionState ?? createEmptySessionState(),
  snapshotVersion = "0.1.0"
): SaveSnapshot {
  return {
    snapshotVersion,
    capturedAtTick: context.clock.tick,
    clock: context.clock,
    gameState: context.state,
    playerState: context.playerContext.state,
    worldState: context.worldContext.state,
    civilizationState: context.civilizationContext.state,
    sessionState
  };
}
