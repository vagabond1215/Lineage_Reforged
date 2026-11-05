import { deserializeSnapshot, serializeSnapshot } from "../../../shared/persistence/src/index.js";
import { advanceClock } from "../../../shared/time/src/index.js";
import travelNetworks from "../../../content/base/world/travel_networks.json" with { type: "json" };
import settlements from "../../../content/base/world/settlements.json" with { type: "json" };
import type {
  ActionAttributeLoadProfileState,
  ActionMetabolicProfileState,
  ConsumableProfileState,
  CurrentActivityState,
  KnownLocationState,
  PlayerBodyState,
  RunDifficultyState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";
import {
  applyAttributeTensionToActionProfile,
  applyConsumableToBodyState,
  advancePlayerBodyState,
  syncPlayerRuntimeState
} from "../../player-engine/src/index.js";
import { establishAshenReefSurveyTravelAccess } from "./ashen-reef-survey-travel-access.js";

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

const HARBORMAST = "settlement.harbormast_quay";
const STARFALL = "settlement.starfall_port";
const PASSENGER_ROUTE_ID = "route.starfall_port_harbormast_quay";
const PASSENGER_MODE_ID = "travel_mode.sea_vessel";
const PASSENGER_SERVICE: ConsumableProfileState = {
  calories: 25, protein: 4.5, carbs: 10, fat: 5, hydration: 18, intoxication: 0
};

/** Four vessel-provided meals and drinks per game day, at the start of each watch. */
export function applyPassengerServiceAtTick(
  bodyState: PlayerBodyState,
  originLocationId: string,
  destinationId: string,
  tick: number,
  day: number,
  lineageId: string,
  runDifficulty: RunDifficultyState
): PlayerBodyState {
  if (originLocationId !== HARBORMAST || destinationId !== STARFALL || tick % 6 !== 1) {
    return bodyState;
  }
  return applyConsumableToBodyState(bodyState, PASSENGER_SERVICE, {
    tick, day, lineageId, runDifficulty
  });
}

function passengerRouteFacts(snapshot: SaveSnapshot, originLocationId: string, destinationId: string):
  PlayerTravelDestination | null {
  if (originLocationId !== HARBORMAST || destinationId !== STARFALL ||
      snapshot.playerState.location.settlementId !== HARBORMAST ||
      snapshot.gameState.activeEncounter !== null ||
      snapshot.campaignRules?.source !== "new_campaign" ||
      !snapshot.sessionState.activeEvents.includes("event.campaign.started") ||
      !snapshot.sessionState.flags.includes(`character.start.${HARBORMAST}`) ||
      !snapshot.playerState.flags.includes(`player.start.${HARBORMAST}`) ||
      snapshot.sessionState.knownLocations.filter(row => row.id === HARBORMAST).length !== 1 ||
      !snapshot.sessionState.knownLocations.some(row =>
        row.id === HARBORMAST && row.settlementId === HARBORMAST && row.known)) return null;

  const route = travelNetworks.records.find(network => network.id === "travel_network.first_world")
    ?.routeRecords.find(row => row.id === PASSENGER_ROUTE_ID);
  const port = settlements.records.find(row => row.id === STARFALL);
  const estimate = route?.travelTimeEstimates.find(row => row.modeId === PASSENGER_MODE_ID);
  const mode = travelNetworks.records.find(network => network.id === "travel_network.first_world")
    ?.modeProfiles.find(row => row.id === PASSENGER_MODE_ID);
  if (!route || !port || !port.visualMapRef ||
      mode?.domain !== "water" ||
      route.fromSettlementId !== STARFALL || route.toSettlementId !== HARBORMAST ||
      route.routeType !== "sea_lane" ||
      !route.availableModeIds.includes(PASSENGER_MODE_ID) ||
      route.accessRequirements?.length !== 2 ||
      !route.accessRequirements.includes("water_only") ||
      !route.accessRequirements.includes("open_sea") ||
      !estimate || Math.round(estimate.expectedDays * 24) !== 120) return null;

  return {
    id: STARFALL,
    name: port.name,
    regionId: port.regionId,
    regionLabel: "Starfall Isle",
    settlementId: STARFALL,
    siteLabel: "Starfall Harbormaster's Office",
    worldMapId: port.visualMapRef.mapId,
    travelTicks: Math.round(estimate.expectedDays * 24),
    hpCost: 0,
    mpCost: 0,
    staminaCost: 0,
    // Passive losses continue. The bounded passenger service is applied separately
    // through the body intake owner; it is not a rest/recovery context.
    metabolicProfile: { intensity: "low", fatigueGain: 0, energyDemand: 0,
      hydrationDemand: 0, highIntensityLoad: 0 },
    attributeLoadProfile: null,
    arrivalActivity: {
      id: "activity.arrival.starfall_port.passenger",
      label: "Arriving in Starfall Port",
      category: "Arrival",
      detail: "Passenger passage reaches the Starfall Harbormaster's Office."
    }
  };
}

/** The route itself is the public passage offer; only the accepted travel command boards it. */
export function getPlayerPassengerTravelDestinationFacts(snapshot: SaveSnapshot):
  PlayerTravelDestinationFacts | null {
  const origin = getCurrentPlayerTravelLocationId(snapshot);
  const destination = origin && passengerRouteFacts(snapshot, origin, STARFALL);
  return destination ? toFacts(destination) : null;
}

export function getPlayerPassengerArrivalLocation(snapshot: SaveSnapshot): KnownLocationState | null {
  if (!getPlayerPassengerTravelDestinationFacts(snapshot)) return null;
  const route = travelNetworks.records.find(network => network.id === "travel_network.first_world")
    ?.routeRecords.find(row => row.id === PASSENGER_ROUTE_ID);
  const port = settlements.records.find(row => row.id === STARFALL);
  if (!route || !port?.visualMapRef) return null;
  return {
    id: STARFALL, name: port.name, regionLabel: "Starfall Isle",
    settlementId: STARFALL, regionId: port.regionId, type: "harbor",
    x: port.visualMapRef.pixelX, y: port.visualMapRef.pixelY,
    note: route.notes, known: true
  };
}

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

function resolveTravelDestination(
  snapshot: SaveSnapshot,
  originLocationId: string,
  destinationId: string
): PlayerTravelDestination | undefined {
  if (destinationId !== "settlement.starfall_port") {
    return PLAYER_TRAVEL_DESTINATIONS[destinationId];
  }
  const passenger = passengerRouteFacts(snapshot, originLocationId, destinationId);
  if (passenger) return passenger;
  if (originLocationId !== "location.ashen_reef") return undefined;

  const soundings = snapshot.sessionState.questJournal.filter(
    (entry) => entry.id === "quest.ashen_reef_survey"
  );
  if (
    soundings.length !== 1 ||
    (soundings[0]?.category !== "active" && soundings[0]?.category !== "completed")
  ) return undefined;
  const access = establishAshenReefSurveyTravelAccess(snapshot, "quest.ashen_reef_survey");
  if (!access.accepted || access.facts?.posture !== "already_known") return undefined;

  // This is the accepted charter's return leg, not a universal Starfall cost.
  // Derive its maritime clock, resource, and body profile from the outbound leg.
  const maritimeProfile = PLAYER_TRAVEL_DESTINATIONS["location.ashen_reef"];
  if (!maritimeProfile) return undefined;
  return {
    ...maritimeProfile,
    id: "settlement.starfall_port",
    name: "Starfall Port",
    siteLabel: "Starfall Harbormaster's Office",
    arrivalActivity: {
      id: "activity.arrival.starfall_port",
      label: "Back In Starfall Port",
      category: "Arrival",
      detail: "The Starfall Harbormaster's Office receives completed Soundings survey packets."
    }
  };
}

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
  metabolicProfile: ActionMetabolicProfileState,
  originLocationId: string,
  destinationId: string
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
    nextSnapshot.playerState.bodyState = applyPassengerServiceAtTick(
      nextSnapshot.playerState.bodyState, originLocationId, destinationId,
      nextClock.tick, nextClock.day, nextSnapshot.playerState.coreData.lineageId, runDifficulty
    );
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

export function getCurrentPlayerTravelLocationId(
  snapshot: { playerState: Pick<SaveSnapshot['playerState'], 'location'> }
): string | null {
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
  if (settlementId === HARBORMAST) return HARBORMAST;
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

    const destination = resolveTravelDestination(snapshot, originLocationId, destinationId);
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
    const passenger = originLocationId === HARBORMAST && destinationId === STARFALL;
    if (passenger && snapshot.sessionState.knownLocations.some(entry => entry.id === STARFALL)) {
      return {
        accepted: false, code: "incoherent_state",
        reason: "Passenger arrival conflicts with an existing Starfall location row.",
        originLocationId, facts, projectedBodyState: null, timeline: []
      };
    }
    if (!passenger && !snapshot.sessionState.knownLocations.some((entry) => entry.id === destinationId && entry.known)) {
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
    const projection = projectBodyState(
      snapshot, destination.travelTicks, previewMetabolicProfile, originLocationId, destinationId
    );

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
