import { EVENT_TYPES } from "../../../shared/events/src/index.js";
import { deserializeSnapshot, serializeSnapshot } from "../../../shared/persistence/src/index.js";
import type { GameEventEnvelope, SaveSnapshot } from "../../../shared/types/src/index.js";
import { synchronizeGameplaySnapshot } from "./gameplay-snapshot-sync.js";

export const PLAYER_QUEST_TRACKING_CHANGED_EVENT_TYPE = EVENT_TYPES.PLAYER_QUEST_TRACKING_CHANGED;

export type PlayerQuestTrackingPlanRejectionCode = "quest_missing" | "quest_not_trackable";

export interface PlayerQuestTrackingFacts {
  questId: string;
  title: string;
  previousTrackedQuestId: string | null;
  nextTrackedQuestId: string | null;
  tracked: boolean;
}

export interface AcceptedPlayerQuestTrackingPlan {
  accepted: true;
  code: "quest_tracking_available";
  facts: PlayerQuestTrackingFacts;
}

export interface RejectedPlayerQuestTrackingPlan {
  accepted: false;
  code: PlayerQuestTrackingPlanRejectionCode;
  reason: string;
  facts: PlayerQuestTrackingFacts | null;
}

export type PlayerQuestTrackingPlan =
  | AcceptedPlayerQuestTrackingPlan
  | RejectedPlayerQuestTrackingPlan;

export type PlayerQuestTrackingCommandRejectionCode =
  | PlayerQuestTrackingPlanRejectionCode
  | "malformed_command"
  | "wrong_player"
  | "stale_snapshot"
  | "incoherent_state"
  | "transition_failed";

export interface PlayerQuestTrackingCommand {
  type: "player.quest.track";
  commandId: string;
  commandSequence: number;
  playerId: string;
  questId: string;
  expectedTick: number;
  expectedSnapshotVersion: string;
  expectedRevision: string;
}

export interface PlayerQuestTrackingChangedEventPayload {
  commandId: string;
  playerId: string;
  questId: string;
  title: string;
  previousTrackedQuestId: string | null;
  nextTrackedQuestId: string | null;
  tracked: boolean;
}

export type PlayerQuestTrackingChangedEvent = GameEventEnvelope<PlayerQuestTrackingChangedEventPayload> & {
  type: typeof PLAYER_QUEST_TRACKING_CHANGED_EVENT_TYPE;
  domain: "player";
};

export interface PlayerQuestTrackingNoticeFacts {
  questTitle: string | null;
  tracked: boolean | null;
}

export interface AcceptedPlayerQuestTrackingResult {
  accepted: true;
  code: "quest_tracking_changed";
  commandId: string;
  appliedTick: number;
  facts: PlayerQuestTrackingFacts;
  noticeFacts: PlayerQuestTrackingNoticeFacts;
  emittedEvents: [PlayerQuestTrackingChangedEvent];
  snapshot: SaveSnapshot;
}

export interface RejectedPlayerQuestTrackingResult {
  accepted: false;
  code: PlayerQuestTrackingCommandRejectionCode;
  commandId: string | null;
  appliedTick: null;
  facts: PlayerQuestTrackingFacts | null;
  noticeFacts: PlayerQuestTrackingNoticeFacts;
  emittedEvents: [];
  snapshot: SaveSnapshot;
}

export type PlayerQuestTrackingResult =
  | AcceptedPlayerQuestTrackingResult
  | RejectedPlayerQuestTrackingResult;

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

function encodeIdentityPart(value: string | null): string {
  return encodeURIComponent(value ?? "none");
}

function hashText(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function resolveSnapshotRevision(snapshot: SaveSnapshot): string {
  return `snapshot.${hashText(serializeSnapshot(snapshot))}`;
}

function buildCommandId(command: Omit<PlayerQuestTrackingCommand, "commandId">): string {
  return [
    "command.player.quest.track",
    command.expectedTick,
    command.commandSequence,
    encodeIdentityPart(command.playerId),
    encodeIdentityPart(command.questId),
    command.expectedRevision
  ].join(":");
}

function isCommandShape(value: unknown): value is PlayerQuestTrackingCommand {
  if (!value || typeof value !== "object") return false;
  const command = value as Partial<PlayerQuestTrackingCommand>;
  return command.type === "player.quest.track" &&
    typeof command.commandId === "string" && command.commandId.length > 0 &&
    Number.isSafeInteger(command.commandSequence) && (command.commandSequence ?? -1) >= 0 &&
    typeof command.playerId === "string" && command.playerId.length > 0 &&
    typeof command.questId === "string" && command.questId.length > 0 &&
    Number.isSafeInteger(command.expectedTick) && (command.expectedTick ?? -1) >= 0 &&
    typeof command.expectedSnapshotVersion === "string" && command.expectedSnapshotVersion.length > 0 &&
    typeof command.expectedRevision === "string" && command.expectedRevision.length > 0;
}

function reject(
  snapshot: SaveSnapshot,
  code: PlayerQuestTrackingCommandRejectionCode,
  commandId: string | null,
  facts: PlayerQuestTrackingFacts | null = null
): RejectedPlayerQuestTrackingResult {
  return {
    accepted: false,
    code,
    commandId,
    appliedTick: null,
    facts,
    noticeFacts: {
      questTitle: facts?.title ?? null,
      tracked: facts?.tracked ?? null
    },
    emittedEvents: [],
    snapshot
  };
}

function createTrackingChangedEvent(
  command: PlayerQuestTrackingCommand,
  facts: PlayerQuestTrackingFacts,
  atTick: number
): PlayerQuestTrackingChangedEvent {
  return {
    id: `event.player.quest.tracking.changed:${encodeIdentityPart(command.commandId)}:${atTick}`,
    type: PLAYER_QUEST_TRACKING_CHANGED_EVENT_TYPE,
    domain: "player",
    atTick,
    payload: {
      commandId: command.commandId,
      playerId: command.playerId,
      questId: facts.questId,
      title: facts.title,
      previousTrackedQuestId: facts.previousTrackedQuestId,
      nextTrackedQuestId: facts.nextTrackedQuestId,
      tracked: facts.tracked
    }
  };
}

export function resolvePlayerQuestTrackingPlan(
  snapshot: SaveSnapshot,
  questId: string
): PlayerQuestTrackingPlan {
  const quest = snapshot.sessionState.questJournal.find((entry) => entry.id === questId);
  if (!quest) {
    return {
      accepted: false,
      code: "quest_missing",
      reason: "That quest could not be found in the current session.",
      facts: null
    };
  }

  const previousTrackedQuestId = snapshot.sessionState.trackedQuestId;
  const tracked = previousTrackedQuestId !== questId;
  const facts: PlayerQuestTrackingFacts = {
    questId: quest.id,
    title: quest.title,
    previousTrackedQuestId,
    nextTrackedQuestId: tracked ? quest.id : null,
    tracked
  };

  if (quest.category === "completed" || quest.category === "failed") {
    return {
      accepted: false,
      code: "quest_not_trackable",
      reason: `${quest.title} is no longer an active objective.`,
      facts
    };
  }

  return {
    accepted: true,
    code: "quest_tracking_available",
    facts
  };
}

export function resolveNextPlayerQuestTrackingCommandSequence(snapshot: SaveSnapshot): number {
  return snapshot.sessionState.questJournal.length + 1;
}

export function createPlayerQuestTrackingCommand(
  snapshot: SaveSnapshot,
  questId: string,
  commandSequence = resolveNextPlayerQuestTrackingCommandSequence(snapshot)
): PlayerQuestTrackingCommand {
  const commandWithoutId: Omit<PlayerQuestTrackingCommand, "commandId"> = {
    type: "player.quest.track",
    commandSequence,
    playerId: snapshot.playerState.playerId,
    questId,
    expectedTick: snapshot.clock.tick,
    expectedSnapshotVersion: snapshot.snapshotVersion,
    expectedRevision: resolveSnapshotRevision(snapshot)
  };
  return {
    ...commandWithoutId,
    commandId: buildCommandId(commandWithoutId)
  };
}

export function executePlayerQuestTrackingCommand(
  snapshot: SaveSnapshot,
  commandValue: unknown
): PlayerQuestTrackingResult {
  if (!isCommandShape(commandValue)) return reject(snapshot, "malformed_command", null);
  const command = commandValue;
  const { commandId: _commandId, ...commandWithoutId } = command;
  if (buildCommandId(commandWithoutId) !== command.commandId) {
    return reject(snapshot, "malformed_command", command.commandId);
  }
  if (command.playerId !== snapshot.playerState.playerId) {
    return reject(snapshot, "wrong_player", command.commandId);
  }
  if (snapshot.capturedAtTick !== snapshot.clock.tick) {
    return reject(snapshot, "incoherent_state", command.commandId);
  }
  if (
    command.expectedTick !== snapshot.clock.tick ||
    command.expectedSnapshotVersion !== snapshot.snapshotVersion
  ) {
    return reject(snapshot, "stale_snapshot", command.commandId);
  }

  try {
    if (command.expectedRevision !== resolveSnapshotRevision(snapshot)) {
      return reject(snapshot, "stale_snapshot", command.commandId);
    }
    const plan = resolvePlayerQuestTrackingPlan(snapshot, command.questId);
    if (!plan.accepted) return reject(snapshot, plan.code, command.commandId, plan.facts);

    const nextSnapshot = cloneSnapshot(snapshot);
    nextSnapshot.sessionState.trackedQuestId = plan.facts.nextTrackedQuestId;
    const committedSnapshot = synchronizeGameplaySnapshot(nextSnapshot);
    const event = createTrackingChangedEvent(command, plan.facts, committedSnapshot.clock.tick);

    return {
      accepted: true,
      code: "quest_tracking_changed",
      commandId: command.commandId,
      appliedTick: committedSnapshot.clock.tick,
      facts: plan.facts,
      noticeFacts: {
        questTitle: plan.facts.title,
        tracked: plan.facts.tracked
      },
      emittedEvents: [event],
      snapshot: committedSnapshot
    };
  } catch {
    return reject(snapshot, "transition_failed", command.commandId);
  }
}
