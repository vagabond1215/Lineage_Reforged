import type {
  SettlementBuildingState,
  SettlementDistrictState,
  SettlementDistrictType,
  SettlementLandValueBand,
  SettlementPlotState,
  SettlementSimulationState
} from "./contracts.js";

export type OwnerType =
  | "player"
  | "npc_individual"
  | "npc_household"
  | "guild"
  | "noble"
  | "civil_authority"
  | "military_authority"
  | "temple"
  | "company"
  | "none";

export type HoldingType =
  | "owned"
  | "leased"
  | "rented"
  | "granted"
  | "custodial_use"
  | "restricted_use"
  | "unclaimed";

export type LegalStatus =
  | "clear_title"
  | "disputed"
  | "encumbered"
  | "tax_delinquent"
  | "guild_claim"
  | "condemned";

export type LandAuthorityType =
  | "noble_direct"
  | "civil_authority"
  | "frontier_claim"
  | "military_control"
  | "guild_controlled"
  | "mixed";

export type DistrictAccessRequirement =
  | "open"
  | "licensed"
  | "chartered"
  | "sanctified"
  | "military_clearance"
  | "restricted";

export type PropertyAssetType = "plot" | "building";
export type PropertyPrestigeLevel = "low" | "moderate" | "high";
export type PropertyValueBand = "modest" | "substantial" | "grand";
export type GuildClass =
  | "adventurers_guild"
  | "craftsmen_guild"
  | "merchant_guild"
  | "laborers_guild"
  | "maritime_guild"
  | "agricultural_guild"
  | "religious_order"
  | "shadow_network";
export type StartAccessStatus = "allowed" | "restricted";
export type StartSpawnMode =
  | "rented_lodging"
  | "guild_guest"
  | "military_quarters"
  | "frontier_entry"
  | "temple_guesthouse";
export type StartLawfulStanding =
  | "ordinary"
  | "chartered"
  | "military_clearance"
  | "frontier_tolerated"
  | "temple_guest"
  | "unrecognized";
export type StartAuthorityTier =
  | "open"
  | "chartered"
  | "military"
  | "frontier"
  | "temple";
export type StartSponsorCategory =
  | "none"
  | "civic_hospitality"
  | "merchant_house"
  | "craft_house"
  | "performance_circuit"
  | "scholarly_order"
  | "temple_order"
  | "military_service"
  | "frontier_service"
  | "local_recognition"
  | "noble_patronage";
export type ReligiousSiteType = "shrine" | "temple" | "great_temple" | "convergence_site";
export type MagicServiceScale = "none" | "limited" | "moderate" | "strong";

export interface InstitutionSettlementRecord {
  id: string;
  name: string;
  regionId: string;
  localityBandId: string;
  settlementType: string;
  siteClass: "surface" | "subterranean" | "underwater";
  terrainContext: string;
  populationBand: "tiny" | "small" | "modest" | "large" | "major";
  populationTotal: number;
  administrativeRole: "none" | "local" | "subregional" | "regional" | "continental";
  summary: string;
  identityTags: string[];
  purposeTags: string[];
  economicModel: {
    dominantRole: string;
    secondaryRoles: string[];
    localSupplyStrengths: string[];
    demandPressures: string[];
    specializationWeight: number;
  };
  survivalModel: {
    habitationScore: number;
    foodSecurity: number;
    waterSecurity: number;
    climateBurden: number;
    hazardPressure: number;
    infrastructureDifficulty: number;
  };
  tradeDependencyProfile: {
    importBias: number;
    exportBias: number;
    dependencyBand: "low" | "moderate" | "high";
    stapleImports: string[];
    exportFocus: string[];
    routeAccess: {
      road: number;
      river: number;
      coastal: number;
      caravan: number;
      pass: number;
      seaLane: number;
    };
  };
  infrastructureProfile: {
    overallLevel: string;
    roadTier: number;
    waterTier: number;
    fortificationTier: number;
    harborTier: number;
    marketTier: number;
  };
  guildPresence: Array<{
    guildType: string;
    name: string;
    presenceLevel: string;
    functions: string[];
    notes: string;
  }>;
}

export interface InstitutionRegionRecord {
  id: string;
  name: string;
  regionType: "continent" | "subregion" | "island_system" | "ocean";
  parentRegionId?: string;
  summary?: string;
  tags: string[];
  environmentProfile?: {
    dominantBiomeMix: string[];
    elevationProfile: string;
    climateTendencies: string[];
  };
  simulationProfile?: {
    habitationScore: number;
    foodProductionCapacity: number;
    waterAvailability: number;
    climateBurden: number;
    hazardPressure: number;
    infrastructureDifficulty: number;
    populationCapacity: number;
    densityBand: "very_high" | "high" | "moderate" | "low" | "very_low";
  };
  economicProfile?: {
    supplyStrengths?: string[];
    demandPressures?: string[];
    importBias?: number;
    exportBias?: number;
  };
}

export interface InstitutionLocalityRecord {
  id: string;
  regionId: string;
  localityType: string;
  summary: string;
  dominantIndustries: string[];
  habitationScoreModifier: number;
  resourceCatchment: Record<string, string>;
  routeAccessModifier: {
    road: number;
    river: number;
    coastal: number;
    caravan: number;
    pass: number;
    seaLane: number;
  };
}

export interface InstitutionGuildCatalogRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  governsActivities: string[];
  membershipModel: {
    entryMethod: string;
    entryRequirements: string[];
  };
}

export interface ReligionCatalogRecord {
  id: string;
  slug: string;
  name: string;
  deities: Array<{
    id: string;
    name: string;
    presentationGender: "female" | "male";
    element: "light" | "water" | "wind" | "ice" | "darkness" | "fire" | "stone" | "thunder";
    domains: string[];
  }>;
  organizations: Array<{
    id: string;
    name: string;
    category: "elemental_order" | "prismatic_enclave" | "unbound";
    favoredDeityIds: string[];
    typicalTerrainTags: string[];
    summary: string;
  }>;
}

export interface MagicInfrastructureCatalogRecord {
  id: string;
  slug: string;
  name: string;
  category: "adventurer_magic" | "utility_enchantment" | "ritual_religious";
  requiredInfrastructure: {
    roadTier: number;
    waterTier: number;
    harborTier: number;
    marketTier: number;
    fortificationTier: number;
  };
  requiredGuildTypes: string[];
  requiredReligionOrganizationIds: string[];
  supportedUseCases: string[];
  prohibitedBypassTags: string[];
  preferredCrystalTiers: Array<"shard" | "crystal" | "cluster">;
  allowedElements: Array<"neutral" | "light" | "water" | "wind" | "ice" | "darkness" | "fire" | "stone" | "thunder">;
  serviceScaleBand: "small" | "moderate" | "large";
}

export interface CrystalCatalogRecord {
  id: string;
  slug: string;
  name: string;
  tier: "shard" | "crystal" | "cluster";
  element: "neutral" | "light" | "water" | "wind" | "ice" | "darkness" | "fire" | "stone" | "thunder";
  capacity: number;
  efficiency: number;
  stability: number;
  reusable: boolean;
  rechargeMethod: string;
  mismatchPenalty: number;
}

export interface DistrictOwnershipProfileState {
  districtId: string;
  districtType: SettlementDistrictType;
  ownershipPermissions: OwnerType[];
  accessRequirement: DistrictAccessRequirement;
  prestigeLevel: PropertyPrestigeLevel;
  notes: string[];
}

export interface PropertyOwnershipRecordState {
  settlementId: string;
  propertyType: PropertyAssetType;
  propertyId: string;
  districtId: string;
  ownerType: OwnerType;
  ownerId: string;
  operatorType: OwnerType;
  operatorId: string;
  holdingType: HoldingType;
  grantingAuthorityId: string;
  legalStatus: LegalStatus;
  derivedValue: number;
  derivedValueBand: PropertyValueBand;
  repairScaleFactor: number;
  buildingTierScore: number;
  buildingTierLabel: PropertyValueBand;
  notes: string[];
}

export interface SettlementGuildInstanceState {
  settlementId: string;
  guildKey: string;
  guildClass: GuildClass;
  label: string;
  presenceLevel: string;
  regulatesProfessions: string[];
  laborInfluence: number;
  tradeInfluence: number;
  propertyIds: string[];
  notes: string[];
}

export interface SettlementReligionSiteState {
  siteId: string;
  siteType: ReligiousSiteType;
  districtId: string | null;
  plotId: string | null;
  organizationId: string;
  deityIds: string[];
  prestigeLevel: PropertyPrestigeLevel;
  notes: string[];
}

export interface SettlementReligionState {
  settlementId: string;
  primaryDeityIds: string[];
  organizationIds: string[];
  sites: SettlementReligionSiteState[];
  tensionNotes: string[];
}

export interface SettlementMagicServiceState {
  serviceId: string;
  category: "adventurer_magic" | "utility_enchantment" | "ritual_religious";
  available: boolean;
  scale: MagicServiceScale;
  dominantCrystalIds: string[];
  restrictions: string[];
  supportedUseCases: string[];
  prohibitedBypassTags: string[];
}

export interface CrystalReserveState {
  settlementId: string;
  crystalId: string;
  element: CrystalCatalogRecord["element"];
  tier: CrystalCatalogRecord["tier"];
  capacity: number;
  currentCharge: number;
  efficiency: number;
  stability: number;
  notes: string[];
}

export interface SettlementStartAccessState {
  settlementId: string;
  accessStatus: StartAccessStatus;
  spawnMode: StartSpawnMode;
  lodgingType: string;
  lawfulStanding: StartLawfulStanding;
  authorityTier: StartAuthorityTier;
  sponsorCategory: StartSponsorCategory;
  allowedBackstoryIds: string[];
  notes: string[];
}

export interface SettlementInstitutionProfileState {
  settlementId: string;
  landAuthorityType: LandAuthorityType;
  grantingAuthorityId: string;
  districtProfiles: DistrictOwnershipProfileState[];
  propertyRecords: PropertyOwnershipRecordState[];
  guilds: SettlementGuildInstanceState[];
  religion: SettlementReligionState;
  magic: SettlementMagicServiceState[];
  crystalReserves: CrystalReserveState[];
  startAccess: SettlementStartAccessState;
  explanation: string[];
}

const LAND_VALUE_FACTOR: Record<SettlementLandValueBand, number> = {
  low: 0.78,
  moderate: 1,
  high: 1.32
};

const LEGAL_STATUS_FACTOR: Record<LegalStatus, number> = {
  clear_title: 1,
  disputed: 0.84,
  encumbered: 0.9,
  tax_delinquent: 0.8,
  guild_claim: 0.88,
  condemned: 0.42
};

const DISTRICT_PRESTIGE_BY_TYPE: Record<SettlementDistrictType, PropertyPrestigeLevel> = {
  central_market: "high",
  residential_low: "low",
  residential_medium: "moderate",
  residential_high: "high",
  industrial_production: "moderate",
  storage_trade: "moderate",
  military: "moderate",
  civic_religious: "high",
  slums_fringe: "low",
  rural_edge: "low"
};

const ACCESS_BY_AUTHORITY: Record<LandAuthorityType, DistrictAccessRequirement> = {
  noble_direct: "licensed",
  civil_authority: "open",
  frontier_claim: "open",
  military_control: "military_clearance",
  guild_controlled: "chartered",
  mixed: "licensed"
};

type SettlementStartAccessRegistryRow = {
  backstoryId: string;
  lawfulStanding: StartLawfulStanding;
  authorityTier: Extract<StartAuthorityTier, "chartered" | "military">;
  sponsorCategory: StartSponsorCategory;
  restrictedSettlementTypes?: string[];
  disallowedOriginContexts?: string[];
};

const START_AUTHORITY_TIER_WEIGHT: Record<StartAuthorityTier, number> = {
  open: 1,
  temple: 2,
  frontier: 3,
  chartered: 4,
  military: 5
};

const SETTLEMENT_START_ACCESS_REGISTRY: SettlementStartAccessRegistryRow[] = [
  {
    backstoryId: "backstory.military_brat",
    lawfulStanding: "military_clearance",
    authorityTier: "military",
    sponsorCategory: "military_service"
  },
  {
    backstoryId: "backstory.scouts_ward",
    lawfulStanding: "military_clearance",
    authorityTier: "military",
    sponsorCategory: "frontier_service"
  },
  {
    backstoryId: "backstory.village_hunter",
    lawfulStanding: "military_clearance",
    authorityTier: "military",
    sponsorCategory: "frontier_service"
  },
  {
    backstoryId: "backstory.local_hero",
    lawfulStanding: "military_clearance",
    authorityTier: "military",
    sponsorCategory: "local_recognition"
  },
  {
    backstoryId: "backstory.minor_noble",
    lawfulStanding: "military_clearance",
    authorityTier: "military",
    sponsorCategory: "noble_patronage"
  },
  {
    backstoryId: "backstory.merchants_child",
    lawfulStanding: "chartered",
    authorityTier: "chartered",
    sponsorCategory: "merchant_house"
  },
  {
    backstoryId: "backstory.craftsmans_child",
    lawfulStanding: "chartered",
    authorityTier: "chartered",
    sponsorCategory: "craft_house"
  },
  {
    backstoryId: "backstory.carpenters_child",
    lawfulStanding: "chartered",
    authorityTier: "chartered",
    sponsorCategory: "craft_house"
  },
  {
    backstoryId: "backstory.performer",
    lawfulStanding: "chartered",
    authorityTier: "chartered",
    sponsorCategory: "performance_circuit"
  },
  {
    backstoryId: "backstory.scholars_apprentice",
    lawfulStanding: "chartered",
    authorityTier: "chartered",
    sponsorCategory: "scholarly_order"
  },
  {
    backstoryId: "backstory.temple_acolyte",
    lawfulStanding: "chartered",
    authorityTier: "chartered",
    sponsorCategory: "temple_order"
  },
  {
    backstoryId: "backstory.hedge_adept",
    lawfulStanding: "chartered",
    authorityTier: "chartered",
    sponsorCategory: "scholarly_order"
  },
  {
    backstoryId: "backstory.minor_noble",
    lawfulStanding: "chartered",
    authorityTier: "chartered",
    sponsorCategory: "noble_patronage"
  },
  {
    backstoryId: "backstory.local_hero",
    lawfulStanding: "chartered",
    authorityTier: "chartered",
    sponsorCategory: "local_recognition"
  }
];

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function toValueBand(value: number): PropertyValueBand {
  if (value >= 720) {
    return "grand";
  }

  if (value >= 280) {
    return "substantial";
  }

  return "modest";
}

function getAllowedOwnersForDistrict(districtType: SettlementDistrictType): OwnerType[] {
  switch (districtType) {
    case "central_market":
    case "storage_trade":
      return ["guild", "company", "civil_authority", "npc_individual", "player"];
    case "industrial_production":
      return ["guild", "company", "npc_household", "player", "civil_authority"];
    case "military":
      return ["military_authority", "civil_authority"];
    case "civic_religious":
      return ["civil_authority", "temple", "noble"];
    case "residential_high":
      return ["noble", "npc_household", "npc_individual", "player"];
    case "slums_fringe":
      return ["none", "npc_household", "npc_individual", "civil_authority"];
    default:
      return ["npc_household", "npc_individual", "player", "noble"];
  }
}

function mapGuildClass(guildKey: string): GuildClass {
  if (guildKey === "adventurers_guild") {
    return "adventurers_guild";
  }

  if (guildKey === "merchant_guild") {
    return "merchant_guild";
  }

  if (guildKey === "agricultural_guild") {
    return "agricultural_guild";
  }

  if (["fishers_guild", "rivermen_guild", "shipwrights_guild"].includes(guildKey)) {
    return "maritime_guild";
  }

  if (["teamsters_guild", "drovers_guild"].includes(guildKey)) {
    return "laborers_guild";
  }

  return "craftsmen_guild";
}

function chooseAuthorityId(settlement: InstitutionSettlementRecord, authorityType: LandAuthorityType): string {
  switch (authorityType) {
    case "noble_direct":
      return `authority.${settlement.id}.noble_house`;
    case "civil_authority":
      return `authority.${settlement.id}.civic_council`;
    case "frontier_claim":
      return `authority.${settlement.id}.frontier_claim`;
    case "military_control":
      return `authority.${settlement.id}.garrison_command`;
    case "guild_controlled":
      return `authority.${settlement.id}.guild_charter`;
    case "mixed":
    default:
      return `authority.${settlement.id}.mixed_council`;
  }
}

function scoreElementAffinity(
  settlement: InstitutionSettlementRecord,
  region: InstitutionRegionRecord,
  locality: InstitutionLocalityRecord
): Record<CrystalCatalogRecord["element"], number> {
  const scores: Record<CrystalCatalogRecord["element"], number> = {
    neutral: 0,
    light: 0,
    water: 0,
    wind: 0,
    ice: 0,
    darkness: 0,
    fire: 0,
    stone: 0,
    thunder: 0
  };
  const joined = [
    ...settlement.identityTags,
    ...settlement.purposeTags,
    ...locality.dominantIndustries,
    settlement.terrainContext,
    ...(region.tags ?? [])
  ]
    .join(" ")
    .toLowerCase();

  if (/(coast|harbor|bay|river|delta|fish|tide|estuary)/.test(joined)) {
    scores.water += 3;
    scores.light += 1;
  }

  if (/(alpine|pass|highland|wind|cliff|watch)/.test(joined)) {
    scores.wind += 2;
  }

  if (/(ice|tundra|winter|glacier|cold)/.test(joined)) {
    scores.ice += 3;
  }

  if (/(mine|mining|ore|quarry|stone|forge|masonry|smelt)/.test(joined)) {
    scores.stone += 3;
    scores.fire += 2;
  }

  if (/(frontier|storm|march|badland|fort|garrison|watch)/.test(joined)) {
    scores.thunder += 2;
    scores.darkness += 1;
  }

  if (/(capital|trade|market|administration|royal)/.test(joined)) {
    scores.light += 2;
  }

  if (settlement.survivalModel.hazardPressure >= 55) {
    scores.darkness += 1;
    scores.thunder += 1;
  }

  if (settlement.siteClass === "subterranean") {
    scores.stone += 2;
    scores.darkness += 2;
  }

  scores.neutral = 2 + Math.round((settlement.infrastructureProfile.marketTier + settlement.infrastructureProfile.roadTier) / 2);
  return scores;
}

export function deriveLandAuthorityType(settlement: InstitutionSettlementRecord): LandAuthorityType {
  const joinedTags = [...settlement.identityTags, ...settlement.purposeTags, settlement.terrainContext]
    .join(" ")
    .toLowerCase();

  if (settlement.settlementType === "fort" || settlement.settlementType === "citadel" || /garrison|fortress|watch/.test(joinedTags)) {
    return "military_control";
  }

  if (
    settlement.settlementType === "outpost" ||
    settlement.settlementType === "camp" ||
    settlement.settlementType === "waystation" ||
    settlement.tradeDependencyProfile.dependencyBand === "high"
  ) {
    return "frontier_claim";
  }

  if (/(royal|capital|palace)/.test(joinedTags)) {
    return "noble_direct";
  }

  if (
    settlement.guildPresence.length >= 3 &&
    settlement.infrastructureProfile.marketTier >= 4 &&
    settlement.administrativeRole === "none"
  ) {
    return "guild_controlled";
  }

  if (settlement.administrativeRole === "regional" || settlement.administrativeRole === "continental") {
    return settlement.infrastructureProfile.marketTier >= 4 ? "civil_authority" : "noble_direct";
  }

  return settlement.infrastructureProfile.marketTier >= 3 ? "mixed" : "civil_authority";
}

export function deriveDistrictOwnershipProfiles(params: {
  settlementId: string;
  districts: SettlementDistrictState[];
  landAuthorityType: LandAuthorityType;
}): DistrictOwnershipProfileState[] {
  return params.districts.map((district) => {
    const basePrestige = DISTRICT_PRESTIGE_BY_TYPE[district.districtType];
    const prestigeLevel =
      district.landValue === "high" ? "high" : district.landValue === "moderate" ? basePrestige : "low";
    let accessRequirement = ACCESS_BY_AUTHORITY[params.landAuthorityType];

    if (district.districtType === "civic_religious") {
      accessRequirement = "sanctified";
    } else if (district.districtType === "military") {
      accessRequirement = "military_clearance";
    } else if (district.districtType === "central_market" && params.landAuthorityType === "guild_controlled") {
      accessRequirement = "chartered";
    }

    return {
      districtId: district.districtId,
      districtType: district.districtType,
      ownershipPermissions: getAllowedOwnersForDistrict(district.districtType),
      accessRequirement,
      prestigeLevel,
      notes: [...district.notes]
    };
  });
}

export function deriveSettlementGuildInstances(params: {
  settlement: InstitutionSettlementRecord;
  guildCatalog: InstitutionGuildCatalogRecord[];
  propertyRecords?: PropertyOwnershipRecordState[];
  religionOrganizationIds?: string[];
  corruptionPressure?: number;
}): SettlementGuildInstanceState[] {
  const guilds: SettlementGuildInstanceState[] = [];

  for (const entry of params.settlement.guildPresence) {
    const guildRecord = params.guildCatalog.find(
      (candidate) => candidate.id === `guild.${entry.guildType}` || candidate.slug === entry.guildType
    );
    const guildKey = entry.guildType;
    const propertyIds =
      params.propertyRecords
        ?.filter((record) => record.ownerType === "guild" && record.ownerId.includes(guildKey))
        .map((record) => record.propertyId) ?? [];

    guilds.push({
      settlementId: params.settlement.id,
      guildKey,
      guildClass: mapGuildClass(guildKey),
      label: entry.name || guildRecord?.name || guildKey,
      presenceLevel: entry.presenceLevel,
      regulatesProfessions: guildRecord?.governsActivities ?? entry.functions,
      laborInfluence: clamp(0.3 + entry.functions.length * 0.08 + params.settlement.populationTotal / 200000, 0.2, 1.2),
      tradeInfluence: clamp(
        0.25 +
          params.settlement.tradeDependencyProfile.exportBias * 0.5 +
          params.settlement.infrastructureProfile.marketTier * 0.08,
        0.2,
        1.3
      ),
      propertyIds,
      notes: [entry.notes]
    });
  }

  if (params.settlement.populationTotal >= 5000 && !guilds.some((guild) => guild.guildClass === "laborers_guild")) {
    guilds.push({
      settlementId: params.settlement.id,
      guildKey: "laborers_union",
      guildClass: "laborers_guild",
      label: "Laborers Union",
      presenceLevel: params.settlement.populationBand === "major" ? "guildhouse" : "hall",
      regulatesProfessions: ["haulage", "day_labor", "loading"],
      laborInfluence: clamp(0.45 + params.settlement.populationTotal / 150000, 0.35, 1.1),
      tradeInfluence: 0.35,
      propertyIds: [],
      notes: ["Derived from settlement workforce scale and loading demand."]
    });
  }

  if (
    (params.settlement.infrastructureProfile.harborTier >= 2 ||
      params.settlement.tradeDependencyProfile.routeAccess.coastal >= 1.1 ||
      params.settlement.tradeDependencyProfile.routeAccess.seaLane >= 1.1) &&
    !guilds.some((guild) => guild.guildClass === "maritime_guild")
  ) {
    guilds.push({
      settlementId: params.settlement.id,
      guildKey: "maritime_consort",
      guildClass: "maritime_guild",
      label: "Maritime Consort",
      presenceLevel: params.settlement.infrastructureProfile.harborTier >= 3 ? "guildhouse" : "hall",
      regulatesProfessions: ["shipping", "dock_labor", "pilotage"],
      laborInfluence: 0.42,
      tradeInfluence: clamp(0.5 + params.settlement.infrastructureProfile.harborTier * 0.1, 0.45, 1.25),
      propertyIds: [],
      notes: ["Derived from harbor access and water-route dependence."]
    });
  }

  if ((params.corruptionPressure ?? 0) >= 0.42 || params.settlement.identityTags.includes("frontier_gate")) {
    guilds.push({
      settlementId: params.settlement.id,
      guildKey: "shadow_market",
      guildClass: "shadow_network",
      label: "Shadow Market",
      presenceLevel: params.settlement.populationBand === "major" ? "chapterhouse" : "outpost",
      regulatesProfessions: ["smuggling", "fencing", "informants"],
      laborInfluence: 0.22,
      tradeInfluence: 0.28,
      propertyIds: [],
      notes: ["Derived from security friction, demand asymmetry, or borderland pressure."]
    });
  }

  if ((params.religionOrganizationIds?.length ?? 0) > 0) {
    guilds.push({
      settlementId: params.settlement.id,
      guildKey: "religious_orders",
      guildClass: "religious_order",
      label: "Religious Orders",
      presenceLevel: params.settlement.populationBand === "major" ? "guildhouse" : "hall",
      regulatesProfessions: ["charity", "ritual_service", "pilgrim_hosting"],
      laborInfluence: 0.26,
      tradeInfluence: 0.18,
      propertyIds: [],
      notes: ["Temple labor and religious hospitality operate as a structured civic order."]
    });
  }

  return guilds;
}

export function deriveSettlementReligion(params: {
  settlement: InstitutionSettlementRecord;
  region: InstitutionRegionRecord;
  locality: InstitutionLocalityRecord;
  religionCatalog: ReligionCatalogRecord;
  districtProfiles?: DistrictOwnershipProfileState[];
  plots?: SettlementPlotState[];
}): SettlementReligionState {
  const affinity = scoreElementAffinity(params.settlement, params.region, params.locality);
  const topElements = (Object.entries(affinity) as Array<[CrystalCatalogRecord["element"], number]>)
    .filter(([element]) => element !== "neutral")
    .sort((left, right) => right[1] - left[1])
    .slice(0, 2)
    .map(([element]) => element);
  const primaryDeityIds = params.religionCatalog.deities
    .filter((deity) => topElements.includes(deity.element))
    .map((deity) => deity.id);
  const organizationIds = params.religionCatalog.organizations
    .filter((organization) => {
      if (organization.category === "prismatic_enclave") {
        return params.settlement.populationBand === "major" || params.settlement.infrastructureProfile.marketTier >= 4;
      }

      if (organization.category === "unbound") {
        return (
          params.settlement.survivalModel.hazardPressure >= 60 ||
          params.settlement.tradeDependencyProfile.dependencyBand === "high"
        );
      }

      return organization.favoredDeityIds.some((deityId) => primaryDeityIds.includes(deityId));
    })
    .map((organization) => organization.id);
  const civicDistrict = params.districtProfiles?.find((district) => district.districtType === "civic_religious") ?? null;
  const preferredPlot =
    params.plots?.find((plot) => plot.tags.includes("near_water")) ??
    params.plots?.find((plot) => plot.tags.includes("high_ground")) ??
    null;
  const prestigeLevel: PropertyPrestigeLevel =
    params.settlement.populationBand === "major" || params.settlement.administrativeRole !== "none" ? "high" : "moderate";

  const sites: SettlementReligionSiteState[] = organizationIds.map((organizationId, index) => {
    const siteType: ReligiousSiteType =
      organizationId === "religious_order.prismatic_enclave"
        ? params.settlement.populationBand === "major"
          ? "great_temple"
          : "convergence_site"
        : params.settlement.populationBand === "tiny"
          ? "shrine"
          : params.settlement.populationBand === "small"
            ? "temple"
            : index === 0 && params.settlement.populationBand !== "modest"
              ? "temple"
              : "shrine";

    return {
      siteId: `${organizationId}.${params.settlement.id}.${siteType}`,
      siteType,
      districtId: civicDistrict?.districtId ?? null,
      plotId: preferredPlot?.plotId ?? null,
      organizationId,
      deityIds: primaryDeityIds,
      prestigeLevel,
      notes: [`Derived from ${params.locality.localityType} terrain and ${params.settlement.economicModel.dominantRole} local economy.`]
    };
  });

  return {
    settlementId: params.settlement.id,
    primaryDeityIds,
    organizationIds,
    sites,
    tensionNotes:
      organizationIds.includes("religious_order.prismatic_enclave") && organizationIds.includes("religious_order.the_unbound")
        ? ["Prismatic orthodoxy and Unbound rites compete for legitimacy in this settlement."]
        : []
  };
}

export function deriveSettlementCrystalReserves(params: {
  settlement: InstitutionSettlementRecord;
  region: InstitutionRegionRecord;
  locality: InstitutionLocalityRecord;
  religion: SettlementReligionState;
  crystalCatalog: CrystalCatalogRecord[];
}): CrystalReserveState[] {
  const affinity = scoreElementAffinity(params.settlement, params.region, params.locality);
  const rankedElements = (Object.entries(affinity) as Array<[CrystalCatalogRecord["element"], number]>)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([element]) => element);

  return rankedElements
    .map((element, index) => {
      const tier: CrystalCatalogRecord["tier"] = index === 0 && params.settlement.populationBand !== "tiny" ? "crystal" : "shard";
      const crystal =
        params.crystalCatalog.find((record) => record.element === element && record.tier === tier) ??
        params.crystalCatalog.find((record) => record.element === "neutral" && record.tier === "shard");

      if (!crystal) {
        return null;
      }

      const capacityScale =
        0.8 +
        params.settlement.economicModel.specializationWeight * 0.15 +
        params.settlement.infrastructureProfile.marketTier * 0.05 +
        (params.religion.organizationIds.length > 0 ? 0.1 : 0);
      const capacity = Math.max(8, Math.round(crystal.capacity * capacityScale));
      const currentCharge = Math.round(capacity * clamp(0.58 + affinity[element] * 0.05, 0.2, 0.95));

      return {
        settlementId: params.settlement.id,
        crystalId: crystal.id,
        element: crystal.element,
        tier: crystal.tier,
        capacity,
        currentCharge,
        efficiency: crystal.efficiency,
        stability: crystal.stability,
        notes: [`Aligned to ${element} affinity in ${params.locality.localityType}.`]
      };
    })
    .filter((record): record is CrystalReserveState => record !== null);
}

export function deriveSettlementMagicInfrastructure(params: {
  settlement: InstitutionSettlementRecord;
  guilds: SettlementGuildInstanceState[];
  religion: SettlementReligionState;
  crystalReserves: CrystalReserveState[];
  magicCatalog: MagicInfrastructureCatalogRecord[];
}): SettlementMagicServiceState[] {
  return params.magicCatalog.map((service) => {
    const hasGuild =
      service.requiredGuildTypes.length === 0 ||
      service.requiredGuildTypes.some((requiredGuild) =>
        params.guilds.some((guild) => guild.guildKey === requiredGuild || guild.guildKey.endsWith(requiredGuild))
      );
    const hasReligion =
      service.requiredReligionOrganizationIds.length === 0 ||
      service.requiredReligionOrganizationIds.some((organizationId) => params.religion.organizationIds.includes(organizationId));
    const infra = params.settlement.infrastructureProfile;
    const passesInfrastructure =
      infra.roadTier >= service.requiredInfrastructure.roadTier &&
      infra.waterTier >= service.requiredInfrastructure.waterTier &&
      infra.harborTier >= service.requiredInfrastructure.harborTier &&
      infra.marketTier >= service.requiredInfrastructure.marketTier &&
      infra.fortificationTier >= service.requiredInfrastructure.fortificationTier;
    const matchingCrystals = params.crystalReserves.filter(
      (crystal) => service.preferredCrystalTiers.includes(crystal.tier) && service.allowedElements.includes(crystal.element)
    );
    const available = hasGuild && hasReligion && passesInfrastructure && matchingCrystals.length > 0;
    const scale: MagicServiceScale = !available
      ? "none"
      : service.serviceScaleBand === "large"
        ? params.settlement.populationBand === "major"
          ? "strong"
          : "moderate"
        : service.serviceScaleBand === "moderate"
          ? "moderate"
          : "limited";
    const restrictions: string[] = [];

    if (!hasGuild && service.requiredGuildTypes.length > 0) {
      restrictions.push("required_guild_absent");
    }
    if (!hasReligion && service.requiredReligionOrganizationIds.length > 0) {
      restrictions.push("required_religious_order_absent");
    }
    if (!passesInfrastructure) {
      restrictions.push("infrastructure_below_threshold");
    }
    if (matchingCrystals.length === 0) {
      restrictions.push("no_attuned_crystal_supply");
    }

    return {
      serviceId: service.id,
      category: service.category,
      available,
      scale,
      dominantCrystalIds: matchingCrystals.slice(0, 2).map((crystal) => crystal.crystalId),
      restrictions,
      supportedUseCases: service.supportedUseCases,
      prohibitedBypassTags: service.prohibitedBypassTags
    };
  });
}

function deriveRequiredStartAuthorityTier(params: {
  settlement: InstitutionSettlementRecord;
  landAuthorityType: LandAuthorityType;
}): StartAuthorityTier {
  const isHighTierCity =
    params.settlement.populationBand === "major" ||
    (params.settlement.populationBand === "large" &&
      params.settlement.infrastructureProfile.marketTier >= 4);

  if (params.landAuthorityType === "military_control") {
    return "military";
  }

  if (params.landAuthorityType === "guild_controlled" || isHighTierCity) {
    return "chartered";
  }

  if (params.landAuthorityType === "frontier_claim") {
    return "frontier";
  }

  if (
    params.settlement.identityTags.includes("monastery") ||
    params.settlement.purposeTags.includes("pilgrimage")
  ) {
    return "temple";
  }

  return "open";
}

function getSettlementStartAccessSpecificity(
  row: SettlementStartAccessRegistryRow
): number {
  return (
    (row.restrictedSettlementTypes?.length ?? 0) +
    (row.disallowedOriginContexts?.length ?? 0)
  );
}

function isSettlementStartAccessRowApplicable(
  row: SettlementStartAccessRegistryRow,
  settlement: InstitutionSettlementRecord,
  authorityTier: Extract<StartAuthorityTier, "chartered" | "military">
): boolean {
  if (row.authorityTier !== authorityTier) {
    return false;
  }

  if (
    row.restrictedSettlementTypes &&
    row.restrictedSettlementTypes.length > 0 &&
    !row.restrictedSettlementTypes.includes(settlement.settlementType)
  ) {
    return false;
  }

  return true;
}

function getApplicableSettlementStartAccessRows(params: {
  settlement: InstitutionSettlementRecord;
  authorityTier: StartAuthorityTier;
}): SettlementStartAccessRegistryRow[] {
  if (params.authorityTier !== "chartered" && params.authorityTier !== "military") {
    return [];
  }

  return SETTLEMENT_START_ACCESS_REGISTRY.filter((row) =>
    isSettlementStartAccessRowApplicable(
      row,
      params.settlement,
      params.authorityTier
    )
  );
}

function resolveSettlementStartAccessRow(params: {
  settlement: InstitutionSettlementRecord;
  authorityTier: StartAuthorityTier;
  backstoryId: string;
}): SettlementStartAccessRegistryRow | null {
  const matches = getApplicableSettlementStartAccessRows({
    settlement: params.settlement,
    authorityTier: params.authorityTier
  })
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.backstoryId === params.backstoryId);

  if (matches.length === 0) {
    return null;
  }

  matches.sort((left, right) => {
    const specificityDelta =
      getSettlementStartAccessSpecificity(right.row) -
      getSettlementStartAccessSpecificity(left.row);

    if (specificityDelta !== 0) {
      return specificityDelta;
    }

    const authorityDelta =
      START_AUTHORITY_TIER_WEIGHT[right.row.authorityTier] -
      START_AUTHORITY_TIER_WEIGHT[left.row.authorityTier];

    if (authorityDelta !== 0) {
      return authorityDelta;
    }

    return left.index - right.index;
  });

  return matches[0]?.row ?? null;
}

export function deriveSettlementStartAccess(params: {
  settlement: InstitutionSettlementRecord;
  landAuthorityType: LandAuthorityType;
  backstoryId: string;
}): SettlementStartAccessState {
  const authorityTier = deriveRequiredStartAuthorityTier(params);
  const applicableRegistryRows = getApplicableSettlementStartAccessRows({
    settlement: params.settlement,
    authorityTier
  });
  const matchedRegistryRow = resolveSettlementStartAccessRow({
    settlement: params.settlement,
    authorityTier,
    backstoryId: params.backstoryId
  });
  const allowedBackstoryIds: string[] = [];
  let accessStatus: StartAccessStatus = "allowed";
  let spawnMode: StartSpawnMode = "rented_lodging";
  let lodgingType = "rented_room";
  let lawfulStanding: StartLawfulStanding = "ordinary";
  let sponsorCategory: StartSponsorCategory = "civic_hospitality";
  const notes: string[] = [];

  if (authorityTier === "military") {
    accessStatus = matchedRegistryRow ? "allowed" : "restricted";
    allowedBackstoryIds.push(...applicableRegistryRows.map((row) => row.backstoryId));
    spawnMode = accessStatus === "allowed" ? "military_quarters" : "rented_lodging";
    lodgingType = accessStatus === "allowed" ? "barracks_bed" : "licensed_inn";
    lawfulStanding = matchedRegistryRow?.lawfulStanding ?? "unrecognized";
    sponsorCategory = matchedRegistryRow?.sponsorCategory ?? "none";
    notes.push("Military settlements require a service-tied backstory, hunting or scouting standing, or a formal noble sponsor.");
  } else if (authorityTier === "chartered") {
    accessStatus = matchedRegistryRow ? "allowed" : "restricted";
    allowedBackstoryIds.push(...applicableRegistryRows.map((row) => row.backstoryId));
    spawnMode = accessStatus === "allowed" ? "guild_guest" : "rented_lodging";
    lodgingType = accessStatus === "allowed" ? "guild_bunk" : "licensed_inn";
    lawfulStanding = matchedRegistryRow?.lawfulStanding ?? "unrecognized";
    sponsorCategory = matchedRegistryRow?.sponsorCategory ?? "none";
    notes.push("Chartered markets and high-status cities require a recognized backstory or lawful sponsor before a start is permitted.");
  } else if (authorityTier === "frontier") {
    spawnMode = "frontier_entry";
    lodgingType = "trail_shelter";
    lawfulStanding = "frontier_tolerated";
    sponsorCategory = "frontier_service";
    notes.push("Frontier claims allow freer entry, but the starting shelter is rough and temporary.");
  } else if (authorityTier === "temple") {
    spawnMode = "temple_guesthouse";
    lodgingType = "guest_cell";
    lawfulStanding = "temple_guest";
    sponsorCategory = "temple_order";
    notes.push("Religious settlements route new arrivals through temple guest housing rather than private property grants.");
  } else {
    lawfulStanding = "ordinary";
    sponsorCategory = "civic_hospitality";
    notes.push("No free property is granted at start; the default arrival is rented or chartered lodging.");
  }

  return {
    settlementId: params.settlement.id,
    accessStatus,
    spawnMode,
    lodgingType,
    lawfulStanding,
    authorityTier,
    sponsorCategory,
    allowedBackstoryIds: Array.from(new Set(allowedBackstoryIds)),
    notes
  };
}

function resolvePropertyOwner(params: {
  settlement: InstitutionSettlementRecord;
  district: SettlementDistrictState;
  building: SettlementBuildingState | null;
  landAuthorityType: LandAuthorityType;
}): {
  ownerType: OwnerType;
  ownerId: string;
  operatorType: OwnerType;
  operatorId: string;
  holdingType: HoldingType;
  legalStatus: LegalStatus;
} {
  if (params.district.districtType === "military") {
    return {
      ownerType: "military_authority",
      ownerId: `authority.${params.settlement.id}.garrison`,
      operatorType: "military_authority",
      operatorId: `authority.${params.settlement.id}.garrison`,
      holdingType: "granted",
      legalStatus: "clear_title"
    };
  }

  if (params.district.districtType === "civic_religious") {
    return {
      ownerType: params.building?.category === "civic" ? "civil_authority" : "temple",
      ownerId:
        params.building?.category === "civic"
          ? `authority.${params.settlement.id}.civic_council`
          : `temple.${params.settlement.id}.religious_order`,
      operatorType: params.building?.category === "civic" ? "civil_authority" : "temple",
      operatorId:
        params.building?.category === "civic"
          ? `authority.${params.settlement.id}.civic_council`
          : `temple.${params.settlement.id}.religious_order`,
      holdingType: "owned",
      legalStatus: "clear_title"
    };
  }

  if (params.district.districtType === "central_market" || params.district.districtType === "storage_trade") {
    if (params.settlement.guildPresence.length > 0) {
      const guildKey = params.settlement.guildPresence[0]?.guildType ?? "merchant_guild";
      return {
        ownerType: params.landAuthorityType === "guild_controlled" ? "guild" : "civil_authority",
        ownerId:
          params.landAuthorityType === "guild_controlled"
            ? `guild.${params.settlement.id}.${guildKey}`
            : `authority.${params.settlement.id}.market_charter`,
        operatorType: "guild",
        operatorId: `guild.${params.settlement.id}.${guildKey}`,
        holdingType: params.landAuthorityType === "guild_controlled" ? "owned" : "leased",
        legalStatus: "guild_claim"
      };
    }

    return {
      ownerType: "company",
      ownerId: `company.${params.settlement.id}.${params.district.districtType}`,
      operatorType: "company",
      operatorId: `company.${params.settlement.id}.${params.district.districtType}`,
      holdingType: "leased",
      legalStatus: "clear_title"
    };
  }

  if (params.district.districtType === "industrial_production") {
    return {
      ownerType: params.settlement.guildPresence.length > 0 ? "guild" : "company",
      ownerId:
        params.settlement.guildPresence.length > 0
          ? `guild.${params.settlement.id}.${params.settlement.guildPresence[0]!.guildType}`
          : `company.${params.settlement.id}.${params.district.districtType}`,
      operatorType: params.settlement.guildPresence.length > 0 ? "guild" : "company",
      operatorId:
        params.settlement.guildPresence.length > 0
          ? `guild.${params.settlement.id}.${params.settlement.guildPresence[0]!.guildType}`
          : `company.${params.settlement.id}.${params.district.districtType}`,
      holdingType: "owned",
      legalStatus: "clear_title"
    };
  }

  if (params.district.districtType === "slums_fringe") {
    return {
      ownerType: "civil_authority",
      ownerId: `authority.${params.settlement.id}.ward_office`,
      operatorType: "npc_household",
      operatorId: `household.${params.settlement.id}.${params.district.districtId}`,
      holdingType: "rented",
      legalStatus: params.building?.averageCondition && params.building.averageCondition < 0.48 ? "tax_delinquent" : "encumbered"
    };
  }

  if (params.landAuthorityType === "noble_direct" && params.district.districtType === "rural_edge") {
    return {
      ownerType: "noble",
      ownerId: `authority.${params.settlement.id}.estate_holder`,
      operatorType: "npc_household",
      operatorId: `household.${params.settlement.id}.${params.district.districtId}`,
      holdingType: "granted",
      legalStatus: "clear_title"
    };
  }

  return {
    ownerType: "npc_household",
    ownerId: `household.${params.settlement.id}.${params.district.districtId}`,
    operatorType: "npc_household",
    operatorId: `household.${params.settlement.id}.${params.district.districtId}`,
    holdingType: "owned",
    legalStatus: "clear_title"
  };
}

export function derivePropertyOwnershipRecords(params: {
  settlement: InstitutionSettlementRecord;
  districts: SettlementDistrictState[];
  plots: SettlementPlotState[];
  buildings: SettlementBuildingState[];
  landAuthorityType: LandAuthorityType;
  grantingAuthorityId: string;
}): PropertyOwnershipRecordState[] {
  const buildingByInstanceId = new Map<string, SettlementBuildingState>();

  for (const building of params.buildings) {
    for (const instance of building.instances) {
      buildingByInstanceId.set(instance.instanceId, building);
    }
  }

  return params.plots
    .map((plot) => {
      const district = params.districts.find((entry) => entry.districtId === plot.districtId);

      if (!district) {
        return null;
      }

      const building = plot.assignedBuildingInstanceId ? buildingByInstanceId.get(plot.assignedBuildingInstanceId) ?? null : null;
      const ownership = resolvePropertyOwner({
        settlement: params.settlement,
        district,
        building,
        landAuthorityType: params.landAuthorityType
      });
      const condition = building?.instances.find((instance) => instance.instanceId === plot.assignedBuildingInstanceId)?.condition ?? 0.65;
      const legalStatus: LegalStatus =
        plot.state === "abandoned" || plot.state === "dilapidated"
          ? "condemned"
          : plot.state === "vacant"
            ? "clear_title"
            : ownership.legalStatus;
      const sizeScore =
        1 +
        (building?.hostedWorkplaceIds.length ?? 0) * 0.28 +
        (building?.serviceFunctions.length ?? 0) * 0.18 +
        (building?.storageProfiles.reduce((sum, profile) => sum + profile.capacityUnits, 0) ?? 0) / 250;
      const infrastructureScore =
        1 +
        params.settlement.infrastructureProfile.roadTier * 0.04 +
        params.settlement.infrastructureProfile.marketTier * 0.08 +
        params.settlement.infrastructureProfile.harborTier * 0.05 +
        params.settlement.infrastructureProfile.fortificationTier * 0.03;
      const incomePotential =
        1 +
        params.settlement.economicModel.specializationWeight * 0.18 +
        params.settlement.tradeDependencyProfile.exportBias * 0.12 +
        (district.districtType === "central_market" ? 0.12 : 0);
      const landFactor = LAND_VALUE_FACTOR[plot.landValue];
      const value = Math.round(
        120 *
          landFactor *
          sizeScore *
          infrastructureScore *
          incomePotential *
          (0.45 + condition * 0.75) *
          LEGAL_STATUS_FACTOR[legalStatus]
      );
      const repairScaleFactor = Number(
        (landFactor * sizeScore * (1.1 + Math.max(0, 0.85 - condition)) * (legalStatus === "condemned" ? 1.2 : 1)).toFixed(2)
      );
      const buildingTierScore = Number((sizeScore * 0.45 + infrastructureScore * 0.35 + condition * 0.2).toFixed(2));

      return {
        settlementId: params.settlement.id,
        propertyType: plot.assignedBuildingInstanceId ? "building" : "plot",
        propertyId: plot.assignedBuildingInstanceId ?? plot.plotId,
        districtId: district.districtId,
        ownerType: plot.state === "vacant" ? "none" : ownership.ownerType,
        ownerId: plot.state === "vacant" ? `unclaimed.${plot.plotId}` : ownership.ownerId,
        operatorType: plot.state === "vacant" ? "none" : ownership.operatorType,
        operatorId: plot.state === "vacant" ? `unclaimed.${plot.plotId}` : ownership.operatorId,
        holdingType: plot.state === "vacant" ? "unclaimed" : plot.state === "abandoned" ? "custodial_use" : ownership.holdingType,
        grantingAuthorityId: params.grantingAuthorityId,
        legalStatus,
        derivedValue: value,
        derivedValueBand: toValueBand(value),
        repairScaleFactor,
        buildingTierScore,
        buildingTierLabel: toValueBand(value),
        notes: [
          `Derived from ${district.districtType}, ${plot.landValue} land, and ${params.settlement.infrastructureProfile.overallLevel} infrastructure.`,
          ...(building?.notes ?? []),
          ...(plot.notes ?? [])
        ]
      };
    })
    .filter((record): record is PropertyOwnershipRecordState => record !== null);
}

export function deriveSettlementInstitutionProfile(params: {
  settlement: InstitutionSettlementRecord;
  region: InstitutionRegionRecord;
  locality: InstitutionLocalityRecord;
  guildCatalog: InstitutionGuildCatalogRecord[];
  religionCatalog: ReligionCatalogRecord;
  magicCatalog: MagicInfrastructureCatalogRecord[];
  crystalCatalog: CrystalCatalogRecord[];
  simulation: SettlementSimulationState;
}): SettlementInstitutionProfileState {
  const landAuthorityType = deriveLandAuthorityType(params.settlement);
  const grantingAuthorityId = chooseAuthorityId(params.settlement, landAuthorityType);
  const districtProfiles = deriveDistrictOwnershipProfiles({
    settlementId: params.settlement.id,
    districts: params.simulation.districts,
    landAuthorityType
  });
  const religion = deriveSettlementReligion({
    settlement: params.settlement,
    region: params.region,
    locality: params.locality,
    religionCatalog: params.religionCatalog,
    districtProfiles,
    plots: params.simulation.plots
  });
  const propertyRecords = derivePropertyOwnershipRecords({
    settlement: params.settlement,
    districts: params.simulation.districts,
    plots: params.simulation.plots,
    buildings: params.simulation.buildings,
    landAuthorityType,
    grantingAuthorityId
  });
  const guilds = deriveSettlementGuildInstances({
    settlement: params.settlement,
    guildCatalog: params.guildCatalog,
    propertyRecords,
    religionOrganizationIds: religion.organizationIds,
    corruptionPressure: params.simulation.infrastructure.corruptionPressure
  });
  const crystalReserves = deriveSettlementCrystalReserves({
    settlement: params.settlement,
    region: params.region,
    locality: params.locality,
    religion,
    crystalCatalog: params.crystalCatalog
  });
  const magic = deriveSettlementMagicInfrastructure({
    settlement: params.settlement,
    guilds,
    religion,
    crystalReserves,
    magicCatalog: params.magicCatalog
  });

  return {
    settlementId: params.settlement.id,
    landAuthorityType,
    grantingAuthorityId,
    districtProfiles,
    propertyRecords,
    guilds,
    religion,
    magic,
    crystalReserves,
    startAccess: deriveSettlementStartAccess({
      settlement: params.settlement,
      landAuthorityType,
      backstoryId: "backstory.local_hero"
    }),
    explanation: [
      `Land authority derived as ${landAuthorityType} from settlement type, administrative role, and identity tags.`,
      `${guilds.length} guild or institutional labor groups derived from authored guild presence and settlement scale.`,
      `${religion.organizationIds.length} religious organizations and ${magic.filter((service) => service.available).length} active magic service bands resolved without bypassing economy rules.`
    ]
  };
}
