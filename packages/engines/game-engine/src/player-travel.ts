import { deserializeSnapshot, serializeSnapshot } from "../../../shared/persistence/src/index.js";
import { EVENT_TYPES } from "../../../shared/events/src/index.js";
import { advanceClock } from "../../../shared/time/src/index.js";
import type {
  ChronicleEventState,
  GameEventEnvelope,
  OperationState,
  SaveSnapshot,
  UiTone
} from "../../../shared/types/src/index.js";
import {
  applyActionAttributeLoad,
  advancePlayerBodyState,
  grantSettlementGeographicKnowledge,
  syncPlayerRuntimeState
} from "../../player-engine/src/index.js";
import { synchronizeGameplaySnapshot } from "./gameplay-snapshot-sync.js";
import {
  getCurrentPlayerTravelLocationId,
  resolvePlayerTravelPlan,
  type PlayerTravelDestinationFacts,
  type PlayerTravelPlan,
  type PlayerTravelPlanRejectionCode
} from "./player-travel-rules.js";

export const PLAYER_TRAVEL_COMPLETED_EVENT_TYPE = EVENT_TYPES.PLAYER_TRAVEL_COMPLETED;

export type PlayerTravelCommandRejectionCode =
  | PlayerTravelPlanRejectionCode
  | "malformed_command"
  | "wrong_player"
  | "stale_snapshot"
  | "stale_origin"
  | "transition_failed";

export interface PlayerTravelCommand {
  type: "player.travel";
  commandId: string;
  commandSequence: number;
  playerId: string;
  destinationId: string;
  expectedOriginLocationId: string | null;
  expectedTick: number;
  expectedSnapshotVersion: string;
  expectedRevision: string;
}

export interface PlayerTravelCompletedEventPayload {
  commandId: string;
  playerId: string;
  originLocationId: string;
  destinationId: string;
  destinationSettlementId: string;
  travelTicks: number;
  staminaCost: number;
  hpCost: number;
  mpCost: number;
}

export type PlayerTravelCompletedEvent = GameEventEnvelope<PlayerTravelCompletedEventPayload> & {
  type: typeof PLAYER_TRAVEL_COMPLETED_EVENT_TYPE;
  domain: "player";
};

export interface PlayerTravelNoticeFacts {
  destinationName: string | null;
}

export interface AcceptedPlayerTravelResult {
  accepted: true;
  code: "travel_completed";
  commandId: string;
  appliedTick: number;
  facts: PlayerTravelDestinationFacts;
  noticeFacts: PlayerTravelNoticeFacts;
  emittedEvents: [PlayerTravelCompletedEvent];
  snapshot: SaveSnapshot;
}

export interface RejectedPlayerTravelResult {
  accepted: false;
  code: PlayerTravelCommandRejectionCode;
  commandId: string | null;
  appliedTick: null;
  facts: PlayerTravelDestinationFacts | null;
  noticeFacts: PlayerTravelNoticeFacts;
  emittedEvents: [];
  snapshot: SaveSnapshot;
}

export type PlayerTravelResult = AcceptedPlayerTravelResult | RejectedPlayerTravelResult;

const WATCH_LABELS: Record<number, string> = {
  1: "Dawn Watch",
  2: "High Sun",
  3: "Dusk Watch",
  4: "Night Watch"
};

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

function buildCommandId(command: Omit<PlayerTravelCommand, "commandId">): string {
  return [
    "command.player.travel",
    command.expectedTick,
    command.commandSequence,
    encodeIdentityPart(command.playerId),
    encodeIdentityPart(command.expectedOriginLocationId),
    encodeIdentityPart(command.destinationId),
    command.expectedRevision
  ].join(":");
}

function isCommandShape(value: unknown): value is PlayerTravelCommand {
  if (!value || typeof value !== "object") return false;
  const command = value as Partial<PlayerTravelCommand>;
  return command.type === "player.travel" &&
    typeof command.commandId === "string" && command.commandId.length > 0 &&
    Number.isSafeInteger(command.commandSequence) && (command.commandSequence ?? -1) >= 0 &&
    typeof command.playerId === "string" && command.playerId.length > 0 &&
    typeof command.destinationId === "string" && command.destinationId.length > 0 &&
    (command.expectedOriginLocationId === null || typeof command.expectedOriginLocationId === "string") &&
    Number.isSafeInteger(command.expectedTick) && (command.expectedTick ?? -1) >= 0 &&
    typeof command.expectedSnapshotVersion === "string" && command.expectedSnapshotVersion.length > 0 &&
    typeof command.expectedRevision === "string" && command.expectedRevision.length > 0;
}

function reject(
  snapshot: SaveSnapshot,
  code: PlayerTravelCommandRejectionCode,
  commandId: string | null,
  facts: PlayerTravelDestinationFacts | null = null
): RejectedPlayerTravelResult {
  return {
    accepted: false,
    code,
    commandId,
    appliedTick: null,
    facts,
    noticeFacts: { destinationName: facts?.name ?? null },
    emittedEvents: [],
    snapshot
  };
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

function makeChronicleEntry(
  snapshot: SaveSnapshot,
  facts: PlayerTravelDestinationFacts
): ChronicleEventState {
  return {
    id: `chronicle.${snapshot.clock.tick}.${snapshot.sessionState.chronicle.length + 1}`,
    category: "travel",
    title: `${snapshot.playerState.coreData.playerName} reached ${facts.name}`,
    timeLabel: formatTickTime(snapshot),
    summary: `${facts.name} is now the active location after ${facts.travelTicks} tick(s) of travel.`,
    entities: [snapshot.playerState.coreData.playerName, facts.name],
    results: ["Travel leg completed"],
    statChanges: [
      facts.staminaCost > 0 ? `Stamina ${-facts.staminaCost}` : "No stamina cost",
      facts.hpCost > 0 ? `HP ${-facts.hpCost}` : "No HP loss"
    ],
    tags: ["Travel", facts.regionLabel],
    ...(facts.travelTicks > 0 ? { statusLabel: `${facts.travelTicks} ticks` } : {})
  };
}

function upsertOperation(operations: OperationState[], nextOperation: OperationState): OperationState[] {
  const existing = operations.find((entry) => entry.id === nextOperation.id);
  if (!existing) return [nextOperation, ...operations];
  return operations.map((entry) => (entry.id === nextOperation.id ? nextOperation : entry));
}

function buildSurveyOperation(snapshot: SaveSnapshot): OperationState {
  const sectorFlagPrefix = "gameplay.quest.ashen_reef_survey.sector.";
  const sectors = [1, 2, 3].filter((index) =>
    snapshot.sessionState.flags.includes(`${sectorFlagPrefix}${index}`)
  ).length;
  const ruinsConfirmed = snapshot.sessionState.flags.includes(
    "gameplay.quest.ashen_reef_survey.ruins_confirmed"
  );
  const progress = ruinsConfirmed ? 100 : sectors * 25;

  return {
    id: "operation.quest.ashen_reef_survey",
    title: "Ashen Reef Survey",
    stage: ruinsConfirmed
      ? "Chart packet ready for harbor turn-in"
      : `Survey sectors logged: ${sectors} / 3`,
    progress,
    etaLabel: ruinsConfirmed ? "Ready now" : `${Math.max(1, 4 - sectors)} shift(s)`,
    owner: snapshot.playerState.coreData.playerName,
    output: ruinsConfirmed ? "Verified reef chart packet" : "Field chart updates",
    priority: "High"
  };
}

function buildPorterOperation(snapshot: SaveSnapshot): OperationState {
  const secured = snapshot.sessionState.flags.includes(
    "gameplay.quest.rivet_shortfall_relief.crates_secured"
  );
  const inSaltmere = getCurrentPlayerTravelLocationId(snapshot) === "location.saltmere";

  return {
    id: "operation.quest.rivet_shortfall_relief",
    title: "Rivet Shortfall Relief",
    stage: secured
      ? inSaltmere
        ? "Cargo delivered to Saltmere drydock"
        : "Cargo secured in Westreach, return trip underway"
      : "Procurement trip underway",
    progress: secured ? (inSaltmere ? 100 : 70) : 35,
    etaLabel: secured ? (inSaltmere ? "Ready now" : "1 route leg") : "1 work shift",
    owner: snapshot.playerState.coreData.playerName,
    output: secured ? "Six deepiron rivet crates" : "Procurement charter",
    priority: "High"
  };
}

function advanceTravelClock(snapshot: SaveSnapshot, plan: Extract<PlayerTravelPlan, { accepted: true }>) {
  const stepCount = Math.max(0, Math.round(plan.facts.travelTicks));
  const runDifficulty = snapshot.gameState.runDifficulty;

  for (let index = 0; index < stepCount; index += 1) {
    const nextClock = advanceClock(snapshot.clock, 1);
    snapshot.clock = nextClock;
    snapshot.capturedAtTick = nextClock.tick;
    snapshot.playerState.saveMeta.totalPlayTicks += 1;
    snapshot.playerState.bodyState = advancePlayerBodyState(snapshot.playerState.bodyState, 1, {
      day: nextClock.day,
      tick: nextClock.tick,
      lineageId: snapshot.playerState.coreData.lineageId,
      runDifficulty,
      metabolicProfile: plan.executionMetabolicProfile,
      recoveryContext: null,
      recoveryAssessment: null
    });
    if (plan.attributeLoadProfile) {
      applyActionAttributeLoad(
        snapshot.playerState,
        plan.attributeLoadProfile,
        1,
        nextClock.day,
        runDifficulty
      );
    }
    syncPlayerRuntimeState(snapshot.playerState, nextClock.tick, nextClock.day, [], runDifficulty);
  }
}

function applyResourceCosts(snapshot: SaveSnapshot, facts: PlayerTravelDestinationFacts) {
  snapshot.playerState.resources.hp.current = Math.min(
    snapshot.playerState.resources.hp.max,
    Math.max(0, snapshot.playerState.resources.hp.current - facts.hpCost)
  );
  snapshot.playerState.resources.mp.current = Math.min(
    snapshot.playerState.resources.mp.max,
    Math.max(0, snapshot.playerState.resources.mp.current - facts.mpCost)
  );
  snapshot.playerState.resources.stamina.current = Math.min(
    snapshot.playerState.resources.stamina.max,
    Math.max(0, snapshot.playerState.resources.stamina.current - facts.staminaCost)
  );
}

function createCompletedEvent(
  command: PlayerTravelCommand,
  originLocationId: string,
  facts: PlayerTravelDestinationFacts,
  atTick: number
): PlayerTravelCompletedEvent {
  return {
    id: `event.player.travel.completed:${encodeIdentityPart(command.commandId)}:${atTick}`,
    type: PLAYER_TRAVEL_COMPLETED_EVENT_TYPE,
    domain: "player",
    atTick,
    payload: {
      commandId: command.commandId,
      playerId: command.playerId,
      originLocationId,
      destinationId: facts.id,
      destinationSettlementId: facts.settlementId,
      travelTicks: facts.travelTicks,
      staminaCost: facts.staminaCost,
      hpCost: facts.hpCost,
      mpCost: facts.mpCost
    }
  };
}

export function resolveNextPlayerTravelCommandSequence(snapshot: SaveSnapshot): number {
  return snapshot.sessionState.chronicle.filter((entry) => entry.category === "travel").length + 1;
}

export function createPlayerTravelCommand(
  snapshot: SaveSnapshot,
  destinationId: string,
  commandSequence = resolveNextPlayerTravelCommandSequence(snapshot)
): PlayerTravelCommand {
  const commandWithoutId: Omit<PlayerTravelCommand, "commandId"> = {
    type: "player.travel",
    commandSequence,
    playerId: snapshot.playerState.playerId,
    destinationId,
    expectedOriginLocationId: getCurrentPlayerTravelLocationId(snapshot),
    expectedTick: snapshot.clock.tick,
    expectedSnapshotVersion: snapshot.snapshotVersion,
    expectedRevision: resolveSnapshotRevision(snapshot)
  };
  return {
    ...commandWithoutId,
    commandId: buildCommandId(commandWithoutId)
  };
}

export function executePlayerTravelCommand(
  snapshot: SaveSnapshot,
  commandValue: unknown
): PlayerTravelResult {
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

  const originLocationId = getCurrentPlayerTravelLocationId(snapshot);
  if (originLocationId !== command.expectedOriginLocationId) {
    return reject(snapshot, "stale_origin", command.commandId);
  }

  try {
    if (command.expectedRevision !== resolveSnapshotRevision(snapshot)) {
      return reject(snapshot, "stale_snapshot", command.commandId);
    }
    const plan = resolvePlayerTravelPlan(snapshot, command.destinationId);
    if (!plan.accepted) return reject(snapshot, plan.code, command.commandId, plan.facts);

    const nextSnapshot = cloneSnapshot(snapshot);
    advanceTravelClock(nextSnapshot, plan);
    applyResourceCosts(nextSnapshot, plan.facts);
    nextSnapshot.playerState.regionId = plan.facts.regionId;
    nextSnapshot.playerState.geographicKnowledge = grantSettlementGeographicKnowledge(
      nextSnapshot.playerState.geographicKnowledge,
      plan.facts.settlementId,
      1
    );
    nextSnapshot.playerState.location = {
      settlementId: plan.facts.settlementId,
      siteLabel: plan.facts.siteLabel,
      worldMapId: plan.facts.worldMapId
    };
    nextSnapshot.sessionState.currentActivity = plan.facts.arrivalActivity;
    nextSnapshot.sessionState.knownLocations = nextSnapshot.sessionState.knownLocations.map((entry) =>
      entry.id === plan.facts.id ? { ...entry, known: true } : entry
    );

    if (
      nextSnapshot.sessionState.trackedQuestId === "quest.ashen_reef_survey" &&
      plan.facts.id === "location.ashen_reef"
    ) {
      nextSnapshot.sessionState.operations = upsertOperation(
        nextSnapshot.sessionState.operations,
        buildSurveyOperation(nextSnapshot)
      );
      nextSnapshot.sessionState.currentActivity = {
        id: "activity.survey.ashen_reef",
        label: "Surveying Ashen Reef",
        category: "Exploration",
        detail: "The charter vessel is in position to begin charting reef sectors."
      };
    }

    if (
      nextSnapshot.sessionState.trackedQuestId === "quest.rivet_shortfall_relief" &&
      plan.facts.id === "location.westreach"
    ) {
      nextSnapshot.sessionState.operations = upsertOperation(
        nextSnapshot.sessionState.operations,
        buildPorterOperation(nextSnapshot)
      );
      nextSnapshot.sessionState.currentActivity = {
        id: "activity.procure.rivets",
        label: "Securing Rivet Crates",
        category: "Trade",
        detail: "Westreach brokers are preparing deepiron stock for the emergency Saltmere order."
      };
    }

    appendNotification(
      nextSnapshot,
      "Travel complete",
      `${nextSnapshot.playerState.coreData.playerName} reached ${plan.facts.name}.`,
      "accent"
    );
    nextSnapshot.sessionState.chronicle = [
      makeChronicleEntry(nextSnapshot, plan.facts),
      ...nextSnapshot.sessionState.chronicle
    ].slice(0, 48);

    const committedSnapshot = synchronizeGameplaySnapshot(nextSnapshot);
    const event = createCompletedEvent(command, plan.originLocationId, plan.facts, committedSnapshot.clock.tick);
    return {
      accepted: true,
      code: "travel_completed",
      commandId: command.commandId,
      appliedTick: committedSnapshot.clock.tick,
      facts: plan.facts,
      noticeFacts: { destinationName: plan.facts.name },
      emittedEvents: [event],
      snapshot: committedSnapshot
    };
  } catch {
    return reject(snapshot, "transition_failed", command.commandId);
  }
}
