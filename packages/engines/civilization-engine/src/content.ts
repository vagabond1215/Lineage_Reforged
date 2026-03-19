import { readFileSync } from "node:fs";
import type { QuestTemplateCategory } from "../../../shared/types/src/index.js";

export interface GuildFacilityTierRecord {
  tier: number;
  label: string;
  presenceLevel: string;
  staffCapacity: number;
  dormitoryCapacity: number;
  stableCapacity: number;
  kitchenScale: string;
  workshopScale: string;
  storehouseScale: string;
  autonomy: string;
  serviceTags: string[];
}

export interface GuildContentRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary?: string;
  governsActivities: string[];
  excludedActivities?: string[];
  contractTypes?: string[];
  typicalPresenceLevels?: string[];
  typicalSettlementTags: string[];
  membershipModel: {
    entryMethod: string;
    buyInRequirement?: string;
    entryRequirements: string[];
    benefits: string[];
    memberObligations: string[];
    notes?: string;
  };
  questBoardProfile: {
    enabled: boolean;
    questCategories: QuestTemplateCategory[];
    tracksAllResources: boolean;
    allowMemberSales: boolean;
    demandFocusTags: string[];
    supplyFocusTags: string[];
  };
  facilityTiers: GuildFacilityTierRecord[];
}

export interface GuildPresenceRecord {
  guildType: string;
  name: string;
  presenceLevel: string;
  functions: string[];
  notes: string;
}

export interface SettlementContentRecord {
  id: string;
  slug: string;
  name: string;
  macroRegionId: string;
  regionId: string;
  settlementType: string;
  populationBand: string;
  populationTotal: number;
  administrativeRole: string;
  summary?: string;
  siteContext?: string;
  parentSettlementId?: string;
  dependencyRole?: string;
  identityTags: string[];
  purposeTags: string[];
  infrastructureProfile: {
    overallLevel: string;
    roadTier: number;
    waterTier: number;
    fortificationTier: number;
    harborTier: number;
    marketTier: number;
  };
  domesticResourceProfile: {
    primaryGoods: string[];
    secondaryGoods: string[];
    demandedGoods: string[];
  };
  domesticTradeFlows: Array<{
    partnerSettlementId: string;
    direction: "exports_to" | "imports_from" | "exchange_with";
    goods: string[];
    routeModes: string[];
    notes: string;
  }>;
  guildPresence: GuildPresenceRecord[];
}

export interface WorldMapContentRecord {
  id: string;
  slug: string;
  name: string;
  mapType: string;
  continentRegionIds: string[];
  islandSystemRegionIds: string[];
  oceanRegionIds: string[];
  totalPopulationMillions?: number;
}

export interface QuestTemplateRecord {
  id: string;
  slug: string;
  name: string;
  category: QuestTemplateCategory;
  summary: string;
  issuingGuildTypes: string[];
  allowAdventurersFallback: boolean;
  generationSource: "shortfall" | "surplus" | "security" | "frontier";
  targetItemKeys: string[];
  targetSettlementTags: string[];
  monsterIds: string[];
  minimumQuantity: number;
  minimumShortfallPerTick: number;
  minimumTradeSurplusPerTick: number;
  rewardProfile: {
    coinBase: number;
    reputationBase: number;
    bonusItemKeys: string[];
  };
}

export interface MonsterContentRecord {
  id: string;
  slug: string;
  name: string;
  monsterClass: string;
  threat: string;
  summary: string;
  habitatTags: string[];
  behaviorTags: string[];
  drops: Array<{
    itemKey: string;
    quantityMin: number;
    quantityMax: number;
    chance: number;
  }>;
  loot: Array<{
    itemKey: string;
    chance: number;
  }>;
}

export interface RegionContentRecord {
  id: string;
  slug: string;
  name: string;
  regionType: "continent" | "subregion" | "island_system" | "ocean";
  parentRegionId?: string;
  tags: string[];
  populationProfile?: {
    densityBand?: "very_high" | "high" | "moderate" | "low" | "very_low";
    estimatedPopulationMillions?: number;
  };
  economicProfile?: {
    majorExports?: string[];
    majorImports?: string[];
  };
}

export interface RegionalEcologyProfileRecord {
  id: string;
  slug: string;
  name: string;
  regionId: string;
  coverageProfile: {
    stapleCrops: string;
    herdAndGame: string;
    maritimeFoods: string;
    timberAndFiber: string;
    metalsAndStone: string;
    herbsAndReagents: string;
    luxuryGoods: string;
  };
}

export const DEFAULT_ADVENTURERS_PRESENCE: GuildPresenceRecord = {
  guildType: "adventurers_guild",
  name: "Adventurers Guild Desk",
  presenceLevel: "outpost",
  functions: ["quest_board", "escort_contracts", "hazard_clearance"],
  notes: "A standing adventurers desk appears anywhere organized guild business already exists."
};

const contentCache = new Map<string, unknown>();

function loadJsonFile<T>(relativePath: string): T {
  if (contentCache.has(relativePath)) {
    return contentCache.get(relativePath) as T;
  }

  const fileUrl = new URL(relativePath, import.meta.url);
  const parsed = JSON.parse(readFileSync(fileUrl, "utf8")) as T;
  contentCache.set(relativePath, parsed);
  return parsed;
}

export function loadGuildContent(): GuildContentRecord[] {
  const parsed = loadJsonFile<{ records: GuildContentRecord[] }>("../../../content/base/civilization/guilds.json");
  return parsed.records;
}

export function loadSettlementContent(): SettlementContentRecord[] {
  const parsed = loadJsonFile<{ records: SettlementContentRecord[] }>("../../../content/base/world/settlements.json");
  return parsed.records;
}

export function loadQuestTemplates(): QuestTemplateRecord[] {
  const parsed = loadJsonFile<{ records: QuestTemplateRecord[] }>("../../../content/base/civilization/quest_templates.json");
  return parsed.records;
}

export function loadMonsterContent(): MonsterContentRecord[] {
  const parsed = loadJsonFile<{ records: MonsterContentRecord[] }>("../../../content/base/world/monsters.json");
  return parsed.records;
}

export function loadRegionContent(): RegionContentRecord[] {
  const parsed = loadJsonFile<{ records: RegionContentRecord[] }>("../../../content/base/world/regions.json");
  return parsed.records;
}

export function loadRegionalEcologyProfiles(): RegionalEcologyProfileRecord[] {
  const parsed = loadJsonFile<{ records: RegionalEcologyProfileRecord[] }>(
    "../../../content/base/world/regional_ecology_profiles.json"
  );
  return parsed.records;
}

export function loadWorldMapContent(): WorldMapContentRecord[] {
  const parsed = loadJsonFile<{ records: WorldMapContentRecord[] }>("../../../content/base/world/world_maps.json");
  return parsed.records;
}

export function resolveEffectiveGuildPresence(guildPresence: GuildPresenceRecord[]): GuildPresenceRecord[] {
  if (guildPresence.length === 0) {
    return [];
  }

  if (guildPresence.some((guild) => guild.guildType === "adventurers_guild")) {
    return guildPresence;
  }

  return [...guildPresence, DEFAULT_ADVENTURERS_PRESENCE];
}
