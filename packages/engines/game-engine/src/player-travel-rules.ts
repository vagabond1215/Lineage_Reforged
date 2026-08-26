import { deserializeSnapshot, serializeSnapshot } from "../../../shared/persistence/src/index.js";
import { advanceClock } from "../../../shared/time/src/index.js";
import type {
  ActionAttributeLoadProfileState,
  ActionMetabolicProfileState,
  CurrentActivityState,
  PlayerBodyState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";
import {
  applyAttributeTensionToActionProfile,
  advancePlayerBodyState,
  syncPlayerRuntimeState
} from "../../player-engine/src/index.js";

export type PlayerTravelPlanRejectionCode =
  | "incoherent_state"
  | "unknown_destination"
  | "destination_not_known"
  | "already_at_destination";

export interface PlayerTravelDestinationFacts {
  id: string;
  name: string;
  regionId: string;
  regionLabel: string;
  settlementId: string;
  siteLabel: string;
  worldMapId: string;
  travelTicks: number;
  staminaCost: number;
  hpCost: number;
  mpCost: number;
  arrivalActivity: CurrentActivityState;
}

export interface AcceptedPlayerTravelPlan {
  accepted: true;
  code: "travel_available";
  originLocationId: string;
  facts: PlayerTravelDestinationFacts;
  projectedBodyState: PlayerBodyState;
  timeline: PlayerBodyState[];
  executionMetabolicProfile: ActionMetabolicProfileState;
  attributeLoadProfile: ActionAttributeLoadProfileState | null;
}

export interface RejectedPlayerTravelPlan {
  accepted: false;
  code: PlayerTravelPlanRejectionCode;
  reason: string;
  originLocationId: string | null;
  facts: PlayerTravelDestinationFacts | null;
  projectedBodyState: null;
  timeline: [];
}

export type PlayerTravelPlan = AcceptedPlayerTravelPlan | RejectedPlayerTravelPlan;

interface PlayerTravelDestination extends PlayerTravelDestinationFacts {
  metabolicProfile: ActionMetabolicProfileState;
  attributeLoadProfile: ActionAttributeLoadProfileState | null;
}

const TRAVEL_ATTRIBUTE_PROFILE: ActionAttributeLoadProfileState = {
  intensity: "moderate",
  sourceTag: "travel",
  weights: {
    AGI: 0.7,
    CON: 0.6,
    VIT: 0.4,
    WIS: 0.3
  },
  meaningfulInteraction: true
};

const PLAYER_TRAVEL_DESTINATIONS: Record<string, PlayerTravelDestination> = {
  "location.saltmere": {
    id: "location.saltmere",
    name: "Aurelis",
    regionId: "region.verdant_thalos",
    regionLabel: "Verdant Thalos",
    settlementId: "settlement.aurelis",
    siteLabel: "Harbor Quarter",
    worldMapId: "world_map.first_world",
    travelTicks: 0,
    staminaCost: 0,
    hpCost: 0,
    mpCost: 0,
    metabolicProfile: {
      intensity: "low",
      fatigueGain: 0,
      energyDemand: 0,
      hydrationDemand: 0,
      highIntensityLoad: 0
    },
    attributeLoadProfile: null,
    arrivalActivity: {
      id: "activity.arrival.saltmere",
      label: "Back In Saltmere",
      category: "Arrival",
      detail: "Harbor offices, guild clerks, and market rumors are within easy reach."
    }
  },
  "location.westreach": {
    id: "location.westreach",
    name: "Stonevein",
    regionId: "region.auric_marches",
    regionLabel: "The Auric Marches",
    settlementId: "settlement.stonevein",
    siteLabel: "Market Ward",
    worldMapId: "world_map.first_world",
    travelTicks: 6,
    staminaCost: 12,
    hpCost: 0,
    mpCost: 0,
    metabolicProfile: {
      intensity: "moderate",
      fatigueGain: 12,
      energyDemand: 16,
      hydrationDemand: 12,
      highIntensityLoad: 1
    },
    attributeLoadProfile: TRAVEL_ATTRIBUTE_PROFILE,
    arrivalActivity: {
      id: "activity.arrival.westreach",
      label: "Arriving In Westreach",
      category: "Travel",
      detail: "Ore yards, assay clerks, and caravan labor brokers crowd the market road."
    }
  },
  "location.ashen_reef": {
    id: "location.ashen_reef",
    name: "Ashen Reef",
    regionId: "region.starfall_isle",
    regionLabel: "Starfall Isle",
    settlementId: "settlement.starfall_port",
    siteLabel: "Survey Anchorage",
    worldMapId: "world_map.first_world",
    travelTicks: 4,
    staminaCost: 18,
    hpCost: 2,
    mpCost: 3,
    metabolicProfile: {
      intensity: "high",
      fatigueGain: 16,
      energyDemand: 18,
      hydrationDemand: 14,
      highIntensityLoad: 2
    },
    attributeLoadProfile: {
      ...TRAVEL_ATTRIBUTE_PROFILE,
      intensity: "high"
    },
    arrivalActivity: {
      id: "activity.survey.ashen_reef",
      label: "Surveying Ashen Reef",
      category: "Exploration",
      detail: "The crew is ready to chart sectors, mark hazards, and log ruin positions."
    }
  },
  "location.crown_bastion": {
    id: "location.crown_bastion",
    name: "Sunspire Reach",
    regionId: "region.silver_valleys",
    regionLabel: "Silver Valleys",
    settlementId: "settlement.sunspire_reach",
    siteLabel: "Gate Muster",
    worldMapId: "world_map.first_world",
    travelTicks: 8,
    staminaCost: 15,
    hpCost: 0,
    mpCost: 0,
    metabolicProfile: {
      intensity: "moderate",
      fatigueGain: 14,
      energyDemand: 18,
      hydrationDemand: 13,
      highIntensityLoad: 1
    },
    attributeLoadProfile: TRAVEL_ATTRIBUTE_PROFILE,
    arrivalActivity: {
      id: "activity.arrival.crown_bastion",
      label: "Reporting At Crown Bastion",
      category: "Travel",
      detail: "Banner captains, quartermasters, and pass clerks are rotating the watch."
    }
  }
};

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getSkillRank(snapshot: SaveSnapshot, skillId: string): number {
  return snapshot.playerState.skills.find((skill) => skill.id === skillId)?.rank ?? 0;
}

function mitigateActionProfile(
  snapshot: SaveSnapshot,
  profile: ActionMetabolicProfileState,
  sourceTag: string,
  attributeKeys: Array<"AGI" | "CON" | "VIT" | "DEX" | "WIS" | "INT" | "CHA">,
  skillIds: string[]
): ActionMetabolicProfileState {
  const attributeAverage =
    attributeKeys.reduce((total, key) => total + snapshot.playerState.attributes[key], 0) /
    Math.max(1, attributeKeys.length);
  const skillAverage =
    skillIds.reduce((total, skillId) => total + getSkillRank(snapshot, skillId), 0) /
    Math.max(1, skillIds.length);
  const attributeBonus = Math.max(0, (attributeAverage - 10) * 0.0125);
  const skillBonus = Math.max(0, skillAverage * 0.004);
  const efficiencyMitigation = clamp(attributeBonus + skillBonus, 0, 0.3);
  const tensionPerformance = applyAttributeTensionToActionProfile(
    snapshot.playerState.attributes,
    { sourceTag }
  );
  const tensionStrain = 1 / Math.max(0.5, tensionPerformance);

  return {
    ...profile,
    fatigueGain: Number((profile.fatigueGain * (1 - efficiencyMitigation) * tensionStrain).toFixed(3)),
    energyDemand: Number((profile.energyDemand * (1 - efficiencyMitigation * 0.5) * tensionStrain).toFixed(3)),
    hydrationDemand: Number((profile.hydrationDemand * (1 - efficiencyMitigation * 0.35) * tensionStrain).toFixed(3))
  };
}

function projectBodyState(
  snapshot: SaveSnapshot,
  ticks: number,
  metabolicProfile: ActionMetabolicProfileState
): { projectedBodyState: PlayerBodyState; timeline: PlayerBodyState[] } {
  const nextSnapshot = cloneSnapshot(snapshot);
  const timeline: PlayerBodyState[] = [];
  const stepCount = Math.max(0, Math.round(ticks));
  const runDifficulty = snapshot.gameState.runDifficulty;

  for (let index = 0; index < stepCount; index += 1) {
    const nextClock = advanceClock(nextSnapshot.clock, 1);
    nextSnapshot.clock = nextClock;
    nextSnapshot.capturedAtTick = nextClock.tick;
    nextSnapshot.playerState.saveMeta.totalPlayTicks += 1;
    nextSnapshot.playerState.bodyState = advancePlayerBodyState(nextSnapshot.playerState.bodyState, 1, {
      day: nextClock.day,
      tick: nextClock.tick,
      lineageId: nextSnapshot.playerState.coreData.lineageId,
      runDifficulty,
      metabolicProfile,
      recoveryContext: null,
      recoveryAssessment: null
    });
    syncPlayerRuntimeState(nextSnapshot.playerState, nextClock.tick, nextClock.day, [], runDifficulty);
    timeline.push(nextSnapshot.playerState.bodyState);
  }

  return {
    projectedBodyState: nextSnapshot.playerState.bodyState,
    timeline
  };
}

function toFacts(destination: PlayerTravelDestination): PlayerTravelDestinationFacts {
  const { metabolicProfile: _metabolicProfile, attributeLoadProfile: _attributeLoadProfile, ...facts } = destination;
  return facts;
}

export function getPlayerTravelDestinationFacts(locationId: string): PlayerTravelDestinationFacts | null {
  const destination = PLAYER_TRAVEL_DESTINATIONS[locationId];
  return destination ? toFacts(destination) : null;
}

export function getCurrentPlayerTravelLocationId(snapshot: SaveSnapshot): string | null {
  const settlementId = snapshot.playerState.location.settlementId;

  if (settlementId === "settlement.aurelis") return "location.saltmere";
  if (settlementId === "settlement.stonevein") return "location.westreach";
  if (settlementId === "settlement.starfall_port") {
    const siteLabel = snapshot.playerState.location.siteLabel;
    return siteLabel === "Survey Anchorage" || siteLabel === "Ashen Reef"
      ? "location.ashen_reef"
      : "settlement.starfall_port";
  }
  if (settlementId === "settlement.sunspire_reach") return "location.crown_bastion";
  return null;
}

export function getCurrentPlayerTravelLocationLabel(snapshot: SaveSnapshot): string {
  const locationId = getCurrentPlayerTravelLocationId(snapshot);
  if (!locationId) return snapshot.playerState.location.siteLabel ?? "Current location";
  return PLAYER_TRAVEL_DESTINATIONS[locationId]?.name ??
    snapshot.playerState.location.siteLabel ??
    locationId;
}

export function resolvePlayerTravelPlan(
  snapshot: SaveSnapshot,
  destinationId: string
): PlayerTravelPlan {
  try {
    const originLocationId = getCurrentPlayerTravelLocationId(snapshot);
    if (snapshot.capturedAtTick !== snapshot.clock.tick || !originLocationId) {
      return {
        accepted: false,
        code: "incoherent_state",
        reason: "Current travel state is not coherent.",
        originLocationId,
        facts: null,
        projectedBodyState: null,
        timeline: []
      };
    }

    const destination = PLAYER_TRAVEL_DESTINATIONS[destinationId];
    if (!destination) {
      return {
        accepted: false,
        code: "unknown_destination",
        reason: "Unknown destination.",
        originLocationId,
        facts: null,
        projectedBodyState: null,
        timeline: []
      };
    }

    const facts = toFacts(destination);
    if (!snapshot.sessionState.knownLocations.some((entry) => entry.id === destinationId && entry.known)) {
      return {
        accepted: false,
        code: "destination_not_known",
        reason: "That location is not yet discovered in the current session.",
        originLocationId,
        facts,
        projectedBodyState: null,
        timeline: []
      };
    }

    if (destinationId === originLocationId) {
      return {
        accepted: false,
        code: "already_at_destination",
        reason: "Already at this destination.",
        originLocationId,
        facts,
        projectedBodyState: null,
        timeline: []
      };
    }

    const previewMetabolicProfile = mitigateActionProfile(
      snapshot,
      destination.metabolicProfile,
      destination.attributeLoadProfile?.sourceTag ?? "travel",
      ["AGI", "CON", "VIT", "WIS"],
      ["skill.knowledge.general_lore"]
    );
    const executionMetabolicProfile = mitigateActionProfile(
      snapshot,
      destination.metabolicProfile,
      destination.attributeLoadProfile?.sourceTag ?? "travel",
      ["AGI", "CON", "VIT"],
      ["skill.knowledge.general_lore"]
    );
    const projection = projectBodyState(snapshot, destination.travelTicks, previewMetabolicProfile);

    return {
      accepted: true,
      code: "travel_available",
      originLocationId,
      facts,
      projectedBodyState: projection.projectedBodyState,
      timeline: projection.timeline,
      executionMetabolicProfile,
      attributeLoadProfile: destination.attributeLoadProfile
    };
  } catch {
    return {
      accepted: false,
      code: "incoherent_state",
      reason: "Current travel state is not coherent.",
      originLocationId: null,
      facts: null,
      projectedBodyState: null,
      timeline: []
    };
  }
}
