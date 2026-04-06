import type { TacticalRoleId } from "./tactics.js";

export type EncounterDisposition = "hostile" | "friendly" | "neutral";
export type EncounterMovementMode = "roaming" | "fixed";
export type EncounterDensityBand = "rare" | "sporadic" | "steady" | "dense";
export type EncounterDifficultyBand = "low" | "moderate" | "high" | "severe";

export interface MonsterCombatProfileState {
  baseHp: number;
  baseMp: number;
  baseStamina: number;
  baseAccuracy: number;
  baseDefense: number;
  baseEvasion: number;
  baseAttackSpeed: number;
  baseRecoverySpeed: number;
  preferredRange: "melee" | "ranged" | "magic";
  threatRating: number;
}

export interface MonsterDifficultyScalingHooksState {
  hpPerTier: number;
  mpPerTier: number;
  staminaPerTier: number;
  accuracyPerTier: number;
  defensePerTier: number;
  actionTimeMultiplierPerTier: number;
  recoveryMultiplierPerTier: number;
}

export interface MonsterRecord {
  id: string;
  slug: string;
  name: string;
  monsterClass: string;
  threat: EncounterDifficultyBand;
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
  baseFaunaId?: string;
  baseMonsterId?: string;
  variantType?: string;
  attunementLevel?: string;
  elements?: string[];
  originProfile?: {
    appearanceRate: string;
    terrainSources: string[];
    entryVectors: string[];
    secureSettlementRule: string;
  };
  combatProfile: MonsterCombatProfileState;
  defaultRole: TacticalRoleId;
  actionPackageIds: string[];
  difficultyScalingHooks: MonsterDifficultyScalingHooksState;
}

export interface EncounterTemplateMemberRecord {
  monsterId: string;
  minCount: number;
  maxCount: number;
  roleId: TacticalRoleId;
}

export interface EncounterTemplateRecord {
  id: string;
  name: string;
  summary: string;
  disposition: EncounterDisposition;
  movementMode: EncounterMovementMode;
  regionIds: string[];
  habitatTags: string[];
  tags: string[];
  difficultyBand: EncounterDifficultyBand;
  members: EncounterTemplateMemberRecord[];
  alliedTemplateIds?: string[];
}

export interface SpawnProfileEncounterWeightRecord {
  encounterTemplateId: string;
  weight: number;
  minHazardPressure?: number;
  maxHazardPressure?: number;
}

export interface SpawnProfileRecord {
  id: string;
  name: string;
  regionIds: string[];
  worldHexIds: string[];
  settlementIds: string[];
  siteIds: string[];
  habitatTags: string[];
  minHazardPressure: number;
  maxHazardPressure: number;
  spawnRatePerDay: number;
  densityBand: EncounterDensityBand;
  hostilityWeights: {
    hostile: number;
    friendly: number;
    neutral: number;
  };
  allowedMovementModes: EncounterMovementMode[];
  encounterWeights: SpawnProfileEncounterWeightRecord[];
}

export interface ResolvedSpawnCandidateState {
  id: string;
  spawnProfileId: string;
  encounterTemplateId: string;
  regionId: string;
  worldHexId: string | null;
  settlementId: string | null;
  siteId: string | null;
  habitatTags: string[];
  hazardPressure: number;
  selectedAtTick: number;
  difficultyTier: number;
  disposition: EncounterDisposition;
  movementMode: EncounterMovementMode;
  spawnWeight: number;
}
