import { EVENT_TYPES } from "../../../shared/events/src/index.js";
import { deserializeSnapshot, serializeSnapshot } from "../../../shared/persistence/src/index.js";
import type {
  ChronicleEventState,
  CurrentActivityState,
  GameEventEnvelope,
  SaveSnapshot,
  UiTone
} from "../../../shared/types/src/index.js";
import {
  establishAshenReefSurveyTravelAccess,
  type AshenReefSurveyTravelAccessFacts
} from "./ashen-reef-survey-travel-access.js";
import { synchronizeGameplaySnapshot } from "./gameplay-snapshot-sync.js";

export const PLAYER_QUEST_ACCEPTED_EVENT_TYPE = EVENT_TYPES.PLAYER_QUEST_ACCEPTED;

export type PlayerQuestAcceptancePlanRejectionCode =
  | "quest_missing"
  | "quest_not_available"
  | "travel_access_conflict";

export interface PlayerQuestAcceptanceFacts {
  questId: string;
  title: string;
  regionLabel: string;
  summary: string;
  preparationActivity: CurrentActivityState;
  travelAccess?: AshenReefSurveyTravelAccessFacts;
}

export interface AcceptedPlayerQuestAcceptancePlan {
  accepted: true;
  code: "quest_acceptance_available";
  facts: PlayerQuestAcceptanceFacts;
}

export interface RejectedPlayerQuestAcceptancePlan {
  accepted: false;
  code: PlayerQuestAcceptancePlanRejectionCode;
  reason: string;
  facts: PlayerQuestAcceptanceFacts | null;
}

export type PlayerQuestAcceptancePlan =
  | AcceptedPlayerQuestAcceptancePlan
  | RejectedPlayerQuestAcceptancePlan;

export type PlayerQuestAcceptanceCommandRejectionCode =
  | PlayerQuestAcceptancePlanRejectionCode
  | "malformed_command"
  | "wrong_player"
  | "stale_snapshot"
  | "incoherent_state"
  | "transition_failed";

export interface PlayerQuestAcceptanceCommand {
  type: "player.quest.accept";
  commandId: string;
  commandSequence: number;
  playerId: string;
  questId: string;
  expectedTick: number;
  expectedSnapshotVersion: string;
  expectedRevision: string;
}

export interface PlayerQuestAcceptedEventPayload {
  commandId: string;
  playerId: string;
  questId: string;
  title: string;
  regionLabel: string;
  travelAccess?: AshenReefSurveyTravelAccessFacts;
}

export type PlayerQuestAcceptedEvent = GameEventEnvelope<PlayerQuestAcceptedEventPayload> & {
  type: typeof PLAYER_QUEST_ACCEPTED_EVENT_TYPE;
  domain: "player";
};

export interface PlayerQuestAcceptanceNoticeFacts {
  questTitle: string | null;
}

export interface AcceptedPlayerQuestAcceptanceResult {
  accepted: true;
  code: "quest_accepted";
  commandId: string;
  appliedTick: number;
  facts: PlayerQuestAcceptanceFacts;
  noticeFacts: PlayerQuestAcceptanceNoticeFacts;
  emittedEvents: [PlayerQuestAcceptedEvent];
  snapshot: SaveSnapshot;
}

export interface RejectedPlayerQuestAcceptanceResult {
  accepted: false;
  code: PlayerQuestAcceptanceCommandRejectionCode;
  commandId: string | null;
  appliedTick: null;
  facts: PlayerQuestAcceptanceFacts | null;
  noticeFacts: PlayerQuestAcceptanceNoticeFacts;
  emittedEvents: [];
  snapshot: SaveSnapshot;
}

export type PlayerQuestAcceptanceResult =
  | AcceptedPlayerQuestAcceptanceResult
  | RejectedPlayerQuestAcceptanceResult;

const WATCH_LABELS: Record<number, string> = {
  1: "Dawn Watch",
  2: "High Sun",
  3: "Dusk Watch",
  4: "Night Watch"
};

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
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

function buildCommandId(command: Omit<PlayerQuestAcceptanceCommand, "commandId">): string {
  return [
    "command.player.quest.accept",
    command.expectedTick,
    command.commandSequence,
    encodeIdentityPart(command.playerId),
    encodeIdentityPart(command.questId),
    command.expectedRevision
  ].join(":");
}

function isCommandShape(value: unknown): value is PlayerQuestAcceptanceCommand {
  if (!value || typeof value !== "object") return false;
  const command = value as Partial<PlayerQuestAcceptanceCommand>;
  return command.type === "player.quest.accept" &&
    typeof command.commandId === "string" && command.commandId.length > 0 &&
    Number.isSafeInteger(command.commandSequence) && (command.commandSequence ?? -1) >= 0 &&
    typeof command.playerId === "string" && command.playerId.length > 0 &&
    typeof command.questId === "string" && command.questId.length > 0 &&
    Number.isSafeInteger(command.expectedTick) && (command.expectedTick ?? -1) >= 0 &&
    typeof command.expectedSnapshotVersion === "string" && command.expectedSnapshotVersion.length > 0 &&
    typeof command.expectedRevision === "string" && command.expectedRevision.length > 0;
}

function formatTickTime(snapshot: SaveSnapshot): string {
  return `Day ${snapshot.clock.day}, ${WATCH_LABELS[snapshot.clock.subday] ?? "Unknown Watch"}`;
}

function appendNotification(
  snapshot: SaveSnapshot,
  title: string,
  detail: string,
  tone: UiTone
) {
  snapshot.sessionState.notifications = [
    {
      id: `notification.${snapshot.clock.tick}.${snapshot.sessionState.notifications.length + 1}`,
      title,
      detail,
      timeLabel: formatTickTime(snapshot),
      tone
    },
    ...snapshot.sessionState.notifications
  ].slice(0, 8);
}

function makeAcceptanceChronicleEntry(
  snapshot: SaveSnapshot,
  facts: PlayerQuestAcceptanceFacts
): ChronicleEventState {
  return {
    id: `chronicle.${snapshot.clock.tick}.${snapshot.sessionState.chronicle.length + 1}`,
    category: "social",
    title: `${snapshot.playerState.coreData.playerName} accepted ${facts.title}`,
    timeLabel: formatTickTime(snapshot),
    summary: `The contract board cleared ${facts.title} into the active ledger.`,
    entities: [snapshot.playerState.coreData.playerName, facts.title],
    results: ["Quest moved to active"],
    statChanges: ["Tracked quest updated"],
    tags: ["Contract", facts.regionLabel],
    statusLabel: "Accepted"
  };
}

function createAcceptedEvent(
  command: PlayerQuestAcceptanceCommand,
  facts: PlayerQuestAcceptanceFacts,
  atTick: number
): PlayerQuestAcceptedEvent {
  return {
    id: `event.player.quest.accepted:${encodeIdentityPart(command.commandId)}:${atTick}`,
    type: PLAYER_QUEST_ACCEPTED_EVENT_TYPE,
    domain: "player",
    atTick,
    payload: {
      commandId: command.commandId,
      playerId: command.playerId,
      questId: facts.questId,
      title: facts.title,
      regionLabel: facts.regionLabel,
      ...(facts.travelAccess ? { travelAccess: facts.travelAccess } : {})
    }
  };
}

function reject(
  snapshot: SaveSnapshot,
  code: PlayerQuestAcceptanceCommandRejectionCode,
  commandId: string | null,
  facts: PlayerQuestAcceptanceFacts | null = null
): RejectedPlayerQuestAcceptanceResult {
  return {
    accepted: false,
    code,
    commandId,
    appliedTick: null,
    facts,
    noticeFacts: { questTitle: facts?.title ?? null },
    emittedEvents: [],
    snapshot
  };
}

function buildFacts(quest: SaveSnapshot["sessionState"]["questJournal"][number]): PlayerQuestAcceptanceFacts {
  return {
    questId: quest.id,
    title: quest.title,
    regionLabel: quest.regionLabel,
    summary: quest.summary,
    preparationActivity: {
      id: `activity.prepare.${quest.id}`,
      label: `Preparing ${quest.title}`,
      category: "Contract",
      detail: quest.summary
    }
  };
}

export function resolvePlayerQuestAcceptancePlan(
  snapshot: SaveSnapshot,
  questId: string
): PlayerQuestAcceptancePlan {
  const quest = snapshot.sessionState.questJournal.find((entry) => entry.id === questId);
  if (!quest) {
    return {
      accepted: false,
      code: "quest_missing",
      reason: "That quest could not be found in the current session.",
      facts: null
    };
  }

  const facts = buildFacts(quest);
  if (quest.category !== "contracts") {
    return {
      accepted: false,
      code: "quest_not_available",
      reason: `${quest.title} is already in the active ledger.`,
      facts
    };
  }

  const access = establishAshenReefSurveyTravelAccess(snapshot, quest.id);
  if (!access.accepted) {
    return {
      accepted: false,
      code: "travel_access_conflict",
      reason: access.reason,
      facts
    };
  }

  return {
    accepted: true,
    code: "quest_acceptance_available",
    facts: access.facts ? { ...facts, travelAccess: access.facts } : facts
  };
}

export function resolveNextPlayerQuestAcceptanceCommandSequence(snapshot: SaveSnapshot): number {
  return snapshot.playerState.activeQuestIds.length + snapshot.playerState.completedQuestIds.length + 1;
}

export function createPlayerQuestAcceptanceCommand(
  snapshot: SaveSnapshot,
  questId: string,
  commandSequence = resolveNextPlayerQuestAcceptanceCommandSequence(snapshot)
): PlayerQuestAcceptanceCommand {
  const commandWithoutId: Omit<PlayerQuestAcceptanceCommand, "commandId"> = {
    type: "player.quest.accept",
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

export function executePlayerQuestAcceptanceCommand(
  snapshot: SaveSnapshot,
  commandValue: unknown
): PlayerQuestAcceptanceResult {
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
    const plan = resolvePlayerQuestAcceptancePlan(snapshot, command.questId);
    if (!plan.accepted) return reject(snapshot, plan.code, command.commandId, plan.facts);

    let nextSnapshot = cloneSnapshot(snapshot);
    nextSnapshot.sessionState.questJournal = nextSnapshot.sessionState.questJournal.map((entry) =>
      entry.id === plan.facts.questId
        ? {
            ...entry,
            category: "active",
            statusLabel: "Accepted"
          }
        : entry
    );
    nextSnapshot.sessionState.trackedQuestId = plan.facts.questId;
    nextSnapshot.sessionState.currentActivity = plan.facts.preparationActivity;
    appendNotification(
      nextSnapshot,
      "Contract accepted",
      `${plan.facts.title} moved into the active quest ledger.`,
      "accent"
    );
    nextSnapshot.sessionState.chronicle = [
      makeAcceptanceChronicleEntry(nextSnapshot, plan.facts),
      ...nextSnapshot.sessionState.chronicle
    ].slice(0, 48);

    const access = establishAshenReefSurveyTravelAccess(
      nextSnapshot,
      plan.facts.questId
    );
    if (!access.accepted) {
      return reject(
        snapshot,
        "travel_access_conflict",
        command.commandId,
        plan.facts
      );
    }
    nextSnapshot = access.snapshot;
    const committedFacts = access.facts
      ? { ...plan.facts, travelAccess: access.facts }
      : plan.facts;

    const committedSnapshot = synchronizeGameplaySnapshot(nextSnapshot);
    const event = createAcceptedEvent(command, committedFacts, committedSnapshot.clock.tick);
    return {
      accepted: true,
      code: "quest_accepted",
      commandId: command.commandId,
      appliedTick: committedSnapshot.clock.tick,
      facts: committedFacts,
      noticeFacts: { questTitle: committedFacts.title },
      emittedEvents: [event],
      snapshot: committedSnapshot
    };
  } catch {
    return reject(snapshot, "transition_failed", command.commandId);
  }
}
