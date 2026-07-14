import { EVENT_TYPES } from "../../../shared/events/src/index.js";
import { deserializeSnapshot, serializeSnapshot } from "../../../shared/persistence/src/index.js";
import type {
  CurrentActivityState,
  GameEventEnvelope,
  SaveSnapshot,
  UiTone
} from "../../../shared/types/src/index.js";
import { synchronizeGameplaySnapshot } from "./gameplay-snapshot-sync.js";

export const PLAYER_ACTIVITY_SELECTED_EVENT_TYPE = EVENT_TYPES.PLAYER_ACTIVITY_SELECTED;

export type PlayerActivitySelectionPlanRejectionCode = "activity_missing";

export interface PlayerActivitySelectionFacts {
  recordId: string;
  label: string;
  category: string;
  detail: string;
  previousActivityId: string | null;
  selectedActivityId: string;
}

export interface AcceptedPlayerActivitySelectionPlan {
  accepted: true;
  code: "activity_selection_available";
  facts: PlayerActivitySelectionFacts;
}

export interface RejectedPlayerActivitySelectionPlan {
  accepted: false;
  code: PlayerActivitySelectionPlanRejectionCode;
  reason: string;
  facts: null;
}

export type PlayerActivitySelectionPlan =
  | AcceptedPlayerActivitySelectionPlan
  | RejectedPlayerActivitySelectionPlan;

export type PlayerActivitySelectionCommandRejectionCode =
  | PlayerActivitySelectionPlanRejectionCode
  | "malformed_command"
  | "wrong_player"
  | "stale_snapshot"
  | "incoherent_state"
  | "transition_failed";

export interface PlayerActivitySelectionCommand {
  type: "player.activity.select";
  commandId: string;
  commandSequence: number;
  playerId: string;
  recordId: string;
  expectedTick: number;
  expectedSnapshotVersion: string;
  expectedRevision: string;
}

export interface PlayerActivitySelectedEventPayload {
  commandId: string;
  playerId: string;
  recordId: string;
  previousActivityId: string | null;
  selectedActivityId: string;
}

export type PlayerActivitySelectedEvent = GameEventEnvelope<PlayerActivitySelectedEventPayload> & {
  type: typeof PLAYER_ACTIVITY_SELECTED_EVENT_TYPE;
  domain: "player";
};

export interface PlayerActivitySelectionNoticeFacts {
  recordLabel: string | null;
}

export interface AcceptedPlayerActivitySelectionResult {
  accepted: true;
  code: "activity_selected";
  commandId: string;
  appliedTick: number;
  facts: PlayerActivitySelectionFacts;
  noticeFacts: PlayerActivitySelectionNoticeFacts;
  emittedEvents: [PlayerActivitySelectedEvent];
  snapshot: SaveSnapshot;
}

export interface RejectedPlayerActivitySelectionResult {
  accepted: false;
  code: PlayerActivitySelectionCommandRejectionCode;
  commandId: string | null;
  appliedTick: null;
  facts: null;
  noticeFacts: PlayerActivitySelectionNoticeFacts;
  emittedEvents: [];
  snapshot: SaveSnapshot;
}

export type PlayerActivitySelectionResult =
  | AcceptedPlayerActivitySelectionResult
  | RejectedPlayerActivitySelectionResult;

const WATCH_LABELS: Record<number, string> = {
  1: "Dawn Watch",
  2: "High Sun",
  3: "Dusk Watch",
  4: "Night Watch"
};

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

function humanizeSectionId(value: string | null | undefined): string {
  if (!value) return "Unknown";
  const segments = value.split(".");
  const lastSegment = segments[segments.length - 1] ?? value;
  return lastSegment
    .split(/[_-]/)
    .filter((part) => part.length > 0)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(" ");
}

function encodeIdentityPart(value: string): string {
  return encodeURIComponent(value);
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

function buildCommandId(command: Omit<PlayerActivitySelectionCommand, "commandId">): string {
  return [
    "command.player.activity.select",
    command.expectedTick,
    command.commandSequence,
    encodeIdentityPart(command.playerId),
    encodeIdentityPart(command.recordId),
    command.expectedRevision
  ].join(":");
}

function isCommandShape(value: unknown): value is PlayerActivitySelectionCommand {
  if (!value || typeof value !== "object") return false;
  const command = value as Partial<PlayerActivitySelectionCommand>;
  return command.type === "player.activity.select" &&
    typeof command.commandId === "string" && command.commandId.length > 0 &&
    Number.isSafeInteger(command.commandSequence) && (command.commandSequence ?? -1) >= 0 &&
    typeof command.playerId === "string" && command.playerId.length > 0 &&
    typeof command.recordId === "string" && command.recordId.length > 0 &&
    Number.isSafeInteger(command.expectedTick) && (command.expectedTick ?? -1) >= 0 &&
    typeof command.expectedSnapshotVersion === "string" && command.expectedSnapshotVersion.length > 0 &&
    typeof command.expectedRevision === "string" && command.expectedRevision.length > 0;
}

function formatTickTime(snapshot: SaveSnapshot): string {
  return `Day ${snapshot.clock.day}, ${WATCH_LABELS[snapshot.clock.subday] ?? "Unknown Watch"}`;
}

function appendSelectionNotification(
  snapshot: SaveSnapshot,
  label: string,
  tone: UiTone = "accent"
) {
  snapshot.sessionState.notifications = [
    {
      id: `notification.${snapshot.clock.tick}.${snapshot.sessionState.notifications.length + 1}`,
      title: "Current activity set",
      detail: `${label} is now the focus of the current shift.`,
      timeLabel: formatTickTime(snapshot),
      tone
    },
    ...snapshot.sessionState.notifications
  ].slice(0, 8);
}

function reject(
  snapshot: SaveSnapshot,
  code: PlayerActivitySelectionCommandRejectionCode,
  commandId: string | null
): RejectedPlayerActivitySelectionResult {
  return {
    accepted: false,
    code,
    commandId,
    appliedTick: null,
    facts: null,
    noticeFacts: { recordLabel: null },
    emittedEvents: [],
    snapshot
  };
}

function createActivitySelectedEvent(
  command: PlayerActivitySelectionCommand,
  facts: PlayerActivitySelectionFacts,
  atTick: number
): PlayerActivitySelectedEvent {
  return {
    id: `event.player.activity.selected:${encodeIdentityPart(command.commandId)}:${atTick}`,
    type: PLAYER_ACTIVITY_SELECTED_EVENT_TYPE,
    domain: "player",
    atTick,
    payload: {
      commandId: command.commandId,
      playerId: command.playerId,
      recordId: facts.recordId,
      previousActivityId: facts.previousActivityId,
      selectedActivityId: facts.selectedActivityId
    }
  };
}

export function resolvePlayerActivitySelectionPlan(
  snapshot: SaveSnapshot,
  recordId: string
): PlayerActivitySelectionPlan {
  const record = snapshot.sessionState.activityRecords.find((entry) => entry.id === recordId);
  if (!record) {
    return {
      accepted: false,
      code: "activity_missing",
      reason: "That activity record is not available in the current session.",
      facts: null
    };
  }

  return {
    accepted: true,
    code: "activity_selection_available",
    facts: {
      recordId: record.id,
      label: record.title,
      category: humanizeSectionId(record.sectionId),
      detail: record.summary,
      previousActivityId: snapshot.sessionState.currentActivity?.id ?? null,
      selectedActivityId: record.id
    }
  };
}

export function resolveNextPlayerActivitySelectionCommandSequence(snapshot: SaveSnapshot): number {
  return snapshot.sessionState.activityRecords.length + 1;
}

export function createPlayerActivitySelectionCommand(
  snapshot: SaveSnapshot,
  recordId: string,
  commandSequence = resolveNextPlayerActivitySelectionCommandSequence(snapshot)
): PlayerActivitySelectionCommand {
  const commandWithoutId: Omit<PlayerActivitySelectionCommand, "commandId"> = {
    type: "player.activity.select",
    commandSequence,
    playerId: snapshot.playerState.playerId,
    recordId,
    expectedTick: snapshot.clock.tick,
    expectedSnapshotVersion: snapshot.snapshotVersion,
    expectedRevision: resolveSnapshotRevision(snapshot)
  };
  return {
    ...commandWithoutId,
    commandId: buildCommandId(commandWithoutId)
  };
}

export function executePlayerActivitySelectionCommand(
  snapshot: SaveSnapshot,
  commandValue: unknown
): PlayerActivitySelectionResult {
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
    const plan = resolvePlayerActivitySelectionPlan(snapshot, command.recordId);
    if (!plan.accepted) return reject(snapshot, plan.code, command.commandId);

    const nextSnapshot = cloneSnapshot(snapshot);
    const nextActivity: CurrentActivityState = {
      id: plan.facts.selectedActivityId,
      label: plan.facts.label,
      category: plan.facts.category,
      detail: plan.facts.detail
    };
    nextSnapshot.sessionState.currentActivity = nextActivity;
    appendSelectionNotification(nextSnapshot, plan.facts.label);
    const committedSnapshot = synchronizeGameplaySnapshot(nextSnapshot);
    const event = createActivitySelectedEvent(command, plan.facts, committedSnapshot.clock.tick);

    return {
      accepted: true,
      code: "activity_selected",
      commandId: command.commandId,
      appliedTick: committedSnapshot.clock.tick,
      facts: plan.facts,
      noticeFacts: { recordLabel: plan.facts.label },
      emittedEvents: [event],
      snapshot: committedSnapshot
    };
  } catch {
    return reject(snapshot, "transition_failed", command.commandId);
  }
}
