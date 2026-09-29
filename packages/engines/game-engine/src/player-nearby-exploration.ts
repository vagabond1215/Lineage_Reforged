import contextsJson from "../../../content/base/world/encounter_action_contexts.json" with { type: "json" };
import settlementsJson from "../../../content/base/world/settlements.json" with { type: "json" };
import hexesJson from "../../../content/base/world/world_hexes.json" with { type: "json" };
import edgesJson from "../../../content/base/world/world_hex_edges.json" with { type: "json" };
import regionsJson from "../../../content/base/world/regions.json" with { type: "json" };
import { deserializeSnapshot, serializeSnapshot } from "../../../shared/persistence/src/index.js";
import { advanceClock } from "../../../shared/time/src/index.js";
import type { ResolvedSpawnCandidateState, SaveSnapshot, WorldState } from "../../../shared/types/src/index.js";
import { advancePlayerBodyState, syncPlayerRuntimeState } from "../../player-engine/src/index.js";
import { resolveSpawnCandidates } from "../../world-engine/src/spawn/index.js";
import { hasPendingNormalDefeat } from "./normal-defeat.js";
import { synchronizeGameplaySnapshot } from "./gameplay-snapshot-sync.js";

type Context = (typeof contextsJson.records)[number];
type Catalog = {
  contexts: Context[];
  settlements: typeof settlementsJson.records;
  hexes: typeof hexesJson.records;
  edges: typeof edgesJson.records;
  regions: typeof regionsJson.records;
};
export const nearbyExplorationCatalog: Catalog = {
  contexts: contextsJson.records,
  settlements: settlementsJson.records,
  hexes: hexesJson.records,
  edges: edgesJson.records,
  regions: regionsJson.records
};

export type NearbyExplorationCode = "available" | "no_eligible_encounter" | "incoherent_state" | "recovery_pending" | "active_encounter" | "insufficient_stamina" | "stale_snapshot" | "malformed_command" | "wrong_player" | "transition_failed";
export type NearbyExplorationPlan =
  | { available: true; code: "available"; context: Context; hazardPressure: number; regionAncestry: string[]; tickCount: 1; staminaCost: 2 }
  | { available: false; code: Exclude<NearbyExplorationCode, "available">; reason: string };
export interface NearbyExplorationCommand {
  type: "player.explore.nearby";
  commandId: string;
  playerId: string;
  contextId: string;
  expectedSettlementId: string | null;
  expectedTick: number;
  expectedSnapshotVersion: string;
  expectedRevision: string;
}
export type NearbyExplorationResult =
  | { accepted: true; code: "candidate_pending" | "no_eligible_encounter"; commandId: string; resultId: string; context: Context; candidate: ResolvedSpawnCandidateState | null; snapshot: SaveSnapshot }
  | { accepted: false; code: NearbyExplorationCode; commandId: string | null; snapshot: SaveSnapshot };

function hashText(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
function revision(snapshot: SaveSnapshot): string {
  return `snapshot.${hashText(serializeSnapshot(snapshot))}`;
}
function commandId(command: Omit<NearbyExplorationCommand, "commandId">): string {
  return `command.player.explore.nearby:${command.expectedTick}:${encodeURIComponent(command.playerId)}:${encodeURIComponent(command.expectedSettlementId ?? "none")}:${encodeURIComponent(command.contextId)}:${command.expectedRevision}`;
}
function rejected(snapshot: SaveSnapshot, code: NearbyExplorationCode, id: string | null): NearbyExplorationResult {
  return { accepted: false, code, commandId: id, snapshot };
}

export function resolveNearbyExplorationPlan(snapshot: SaveSnapshot, catalog: Catalog = nearbyExplorationCatalog): NearbyExplorationPlan {
  if (snapshot.capturedAtTick !== snapshot.clock.tick || !snapshot.campaignIdentity?.campaignId) {
    return { available: false, code: "incoherent_state", reason: "Campaign location is unavailable." };
  }
  if (hasPendingNormalDefeat(snapshot)) {
    return { available: false, code: "recovery_pending", reason: "Complete pending recovery first." };
  }
  if (snapshot.gameState.activeEncounter) {
    return { available: false, code: "active_encounter", reason: "An encounter is already active." };
  }
  if (snapshot.playerState.resources.stamina.current < 2) {
    return { available: false, code: "insufficient_stamina", reason: "Nearby exploration requires 2 Stamina." };
  }
  const settlementId = snapshot.playerState.location.settlementId;
  const matching = catalog.contexts.filter((item) => item.actionType === "player.explore.nearby" && item.originSettlementId === settlementId);
  if (matching.length !== 1) return { available: false, code: "no_eligible_encounter", reason: "No nearby exploration is authored for this location." };
  const context = matching[0]!;
  const settlement = catalog.settlements.find((item) => item.id === settlementId);
  const region = catalog.regions.find((item) => item.id === context.localRegionId);
  const originHex = catalog.hexes.find((item) => item.id === context.originWorldHexId);
  const edge = catalog.edges.find((item) => item.id === context.worldHexEdgeId);
  const destinationHex = catalog.hexes.find((item) => item.id === edge?.toHexId);
  const known = snapshot.sessionState.knownLocations.filter((item) => item.known && item.settlementId === settlementId && item.regionId === context.localRegionId);
  const ancestry: string[] = [];
  const seen = new Set<string>();
  let regionId: string | undefined = region?.id;
  while (regionId) {
    if (seen.has(regionId)) return { available: false, code: "incoherent_state", reason: "Region ancestry is ambiguous." };
    seen.add(regionId);
    const record = catalog.regions.find((item) => item.id === regionId);
    if (!record) return { available: false, code: "incoherent_state", reason: "Region ancestry is missing." };
    ancestry.push(record.id);
    regionId = record.parentRegionId;
  }
  const hazard = region?.simulationProfile?.hazardPressure;
  if (!settlement || !region || !originHex || !edge || !destinationHex ||
      snapshot.playerState.regionId !== region.id || settlement.regionId !== region.id ||
      (settlement.macroRegionId && !ancestry.includes(settlement.macroRegionId)) ||
      settlement.hexAnchorId !== originHex.id || originHex.regionId !== region.id ||
      !originHex.anchoredSettlementIds.includes(settlement.id) ||
      edge.fromHexId !== originHex.id || destinationHex.regionId !== region.id ||
      destinationHex.id === originHex.id || !edge.allowedTravelModes.includes("travel_mode.foot") ||
      known.length !== 1 ||
      context.hazardSource !== `${region.id}.simulationProfile.hazardPressure` ||
      typeof hazard !== "number" || !Number.isFinite(hazard) || hazard < 0 || hazard > 100 ||
      !Array.isArray(context.habitatTags) || context.habitatTags.length === 0) {
    return { available: false, code: "incoherent_state", reason: "Nearby exploration geography is inconsistent." };
  }
  return { available: true, code: "available", context, hazardPressure: hazard, regionAncestry: ancestry, tickCount: 1, staminaCost: 2 };
}

export function createNearbyExplorationCommand(snapshot: SaveSnapshot): NearbyExplorationCommand {
  const plan = resolveNearbyExplorationPlan(snapshot);
  const fields = {
    type: "player.explore.nearby" as const,
    playerId: snapshot.playerState.playerId,
    contextId: plan.available ? plan.context.id : "unavailable",
    expectedSettlementId: snapshot.playerState.location.settlementId,
    expectedTick: snapshot.clock.tick,
    expectedSnapshotVersion: snapshot.snapshotVersion,
    expectedRevision: revision(snapshot)
  };
  return { ...fields, commandId: commandId(fields) };
}

export function executeNearbyExplorationCommand(snapshot: SaveSnapshot, value: unknown, catalog: Catalog = nearbyExplorationCatalog): NearbyExplorationResult {
  if (!value || typeof value !== "object") return rejected(snapshot, "malformed_command", null);
  const command = value as NearbyExplorationCommand;
  if (command.type !== "player.explore.nearby" || typeof command.commandId !== "string" ||
      typeof command.playerId !== "string" || typeof command.contextId !== "string" ||
      (command.expectedSettlementId !== null && typeof command.expectedSettlementId !== "string") || !Number.isSafeInteger(command.expectedTick) ||
      typeof command.expectedSnapshotVersion !== "string" || typeof command.expectedRevision !== "string") {
    return rejected(snapshot, "malformed_command", null);
  }
  const { commandId: _id, ...fields } = command;
  if (command.commandId !== commandId(fields)) return rejected(snapshot, "malformed_command", command.commandId);
  if (command.playerId !== snapshot.playerState.playerId) return rejected(snapshot, "wrong_player", command.commandId);
  if (command.expectedTick !== snapshot.clock.tick || command.expectedSnapshotVersion !== snapshot.snapshotVersion ||
      command.expectedRevision !== revision(snapshot)) return rejected(snapshot, "stale_snapshot", command.commandId);
  const plan = resolveNearbyExplorationPlan(snapshot, catalog);
  if (!plan.available) return rejected(snapshot, plan.code, command.commandId);
  if (command.contextId !== plan.context.id || command.expectedSettlementId !== plan.context.originSettlementId) {
    return rejected(snapshot, "incoherent_state", command.commandId);
  }
  try {
    const next = deserializeSnapshot(serializeSnapshot(snapshot));
    const nextClock = advanceClock(next.clock, plan.tickCount);
    next.clock = nextClock;
    next.capturedAtTick = nextClock.tick;
    next.playerState.saveMeta.totalPlayTicks += plan.tickCount;
    next.playerState.bodyState = advancePlayerBodyState(next.playerState.bodyState, plan.tickCount, {
      day: nextClock.day, tick: nextClock.tick, lineageId: next.playerState.coreData.lineageId,
      runDifficulty: next.gameState.runDifficulty,
      metabolicProfile: { intensity: "low", fatigueGain: 2, energyDemand: 3, hydrationDemand: 2, highIntensityLoad: 0 },
      recoveryContext: null, recoveryAssessment: null
    });
    syncPlayerRuntimeState(next.playerState, nextClock.tick, nextClock.day, [], next.gameState.runDifficulty);
    next.playerState.resources.stamina.current = Math.max(0, next.playerState.resources.stamina.current - plan.staminaCost);
    const encounterContext: NonNullable<WorldState["encounterContext"]> = {
      regionId: plan.context.localRegionId,
      settlementId: plan.context.originSettlementId,
      siteId: null,
      worldHexId: plan.context.originWorldHexId,
      worldHexEdgeId: plan.context.worldHexEdgeId,
      actionContextId: plan.context.id,
      sourceActionId: command.commandId,
      habitatTags: [...plan.context.habitatTags],
      hazardPressure: plan.hazardPressure,
      hazardSource: plan.context.hazardSource
    };
    next.worldState.nearbyExplorationContext = encounterContext;
    const selectionKey = `${next.campaignIdentity!.campaignId}:${command.commandId}:${plan.context.id}:${plan.context.worldHexEdgeId}:ordinary.v1`;
    const candidates = resolveSpawnCandidates({ ...next.worldState, encounterContext }, nextClock.tick, 0, { strict: true, selectionKey });
    // A candidate is only an observation until a separate campaign admission owner exists.
    // The next accepted exploration supersedes this proposal; the combat queue stays empty.
    next.worldState.nearbyExplorationCandidate = candidates[0] ?? null;
    next.sessionState.currentActivity = {
      id: `activity.explore.nearby.${plan.context.id}`,
      label: "Exploring nearby environs",
      category: "Exploration",
      detail: candidates.length ? "Signs of nearby danger were found; no encounter has begun." : "No encounter was found along the nearby approach."
    };
    const committed = synchronizeGameplaySnapshot(next);
    return {
      accepted: true,
      code: candidates.length ? "candidate_pending" : "no_eligible_encounter",
      commandId: command.commandId,
      resultId: `result.player.explore.nearby:${encodeURIComponent(command.commandId)}:${nextClock.tick}`,
      context: plan.context,
      candidate: candidates[0] ?? null,
      snapshot: committed
    };
  } catch {
    return rejected(snapshot, "transition_failed", command.commandId);
  }
}
