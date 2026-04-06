import type {
  ActionActivationProfileState,
  ActionTargetProfileState,
  ItemUseProfileState,
  PlayerAbilityCategory,
  PlayerAttributes,
  ResourcePool,
  SkillEffectScalingState,
  SpellItemGenerationHookState,
  SpellScalingChannel
} from "./contracts.js";
import type {
  CombatControlMode,
  CombatFocusDirectivesState,
  CombatTargetPreferenceRuleState,
  CombatTacticsState,
  TacticalBias,
  TacticalRoleId
} from "./tactics.js";

export type CombatModeId = "normal" | "hardcore";
export type CombatEncounterStateId = "forming" | "active" | "paused" | "resolved";
export type CombatantKind = "player" | "party_member" | "guest" | "enemy";
export type CombatDisposition = "ally" | "enemy" | "neutral";
export type CombatActionLifecycleState =
  | "queued"
  | "executing"
  | "channeling"
  | "recovering"
  | "resolved"
  | "cancelled"
  | "interrupted";

export interface CombatModeState {
  id: CombatModeId;
  combatPauseAllowed: boolean;
}

export interface CombatAreaContextState {
  regionId: string;
  settlementId?: string | null;
  siteId?: string | null;
  worldHexId?: string | null;
  habitatTags: string[];
  hazardPressure: number;
}

export interface CombatStatusEffectState {
  id: string;
  label: string;
  sourceType: string;
  sourceId: string | null;
  stacks: number;
  magnitude?: number;
  startedAtTick: number;
  expiresAtTick?: number | null;
  tags: string[];
}

export interface CombatResourceState {
  hp: ResourcePool;
  mp: ResourcePool;
  stamina: ResourcePool;
}

export interface CombatResourceCostState {
  hp?: number;
  mp?: number;
  stamina?: number;
}

export interface CombatSkillEffectGrantState {
  skillEffectId: string;
  skillId: string;
  resolvedValue: number;
  actionType: string | null;
  actionTags: string[];
  grantType: string;
  effectChannel: string;
  scaling: SkillEffectScalingState;
  combatTags: string[];
  resolutionHooks: string[];
}

export interface CombatItemUseProfileGrantState extends ItemUseProfileState {
  itemId: string;
  proficiencyBand?: string | null;
}

export interface CombatArmorHandlingGrantState {
  itemId: string;
  handlingType: "shield" | "armor" | "hybrid";
  proficiencySkillId: string;
  hybridSkillIds: string[];
  combatTags: string[];
  resolutionHooks: string[];
}

export interface CombatSpellActionGrantState {
  spellId: string;
  actionType: string;
  governingSkillId: string;
  school: string;
  tradition?: string;
  discipline?: string;
  element?: string;
  effectTags: string[];
  scalingChannels: SpellScalingChannel[];
  targetProfile: ActionTargetProfileState;
  activation: ActionActivationProfileState;
  resolutionHooks: string[];
  itemGenerationHooks: SpellItemGenerationHookState[];
}

export interface CombatAbilityActionGrantState {
  abilityId: string;
  actionType: string;
  category: PlayerAbilityCategory;
  governingSkillIds: string[];
  targetProfile: ActionTargetProfileState;
  activation: ActionActivationProfileState;
  effectChannels: string[];
  combatTags: string[];
  resolutionHooks: string[];
  targetConditions: string[];
}

export interface CombatTitleMilestoneGrantState {
  titleId: string;
  trackId: string;
  family: string;
  sourceSkillId: string | null;
  threshold: number;
  masteryTrialId: string | null;
  effects: string[];
}

export interface CombatTacticalGrantState {
  skillId: string;
  tags: string[];
  sourceType: "skill" | "ability" | "title" | "package";
  sourceId: string;
}

export interface CombatActionSourceState {
  sourceType: "basic_attack" | "ability" | "spell" | "item" | "weapon_profile" | "reaction" | "scripted";
  sourceId: string | null;
  itemId?: string | null;
  skillIds: string[];
  weaponSkillId?: string | null;
  defensiveSkillId?: string | null;
  armorSkillId?: string | null;
  shieldSkillId?: string | null;
  spellSchool?: string | null;
  spellTradition?: string | null;
  spellDiscipline?: string | null;
  spellElement?: string | null;
  spellScalingChannels: SpellScalingChannel[];
  effectChannels: string[];
  itemHandlingType?: string | null;
  itemProficiencyBand?: string | null;
  critTags: string[];
  weaknessTags: string[];
  titleModifierIds: string[];
}

export interface CombatActionTargetingState {
  targetIds: string[];
  primaryTargetId: string | null;
  targetDisposition: "ally" | "enemy" | "self" | "any";
}

export interface CombatActionState {
  id: string;
  actionType: string;
  actorCombatantId: string;
  targeting: CombatActionTargetingState;
  queuedAtTick: number;
  startedAtTick?: number | null;
  resolvesAtTick?: number | null;
  recoveryEndsAtTick?: number | null;
  executionTimeTicks: number;
  recoveryTimeTicks: number;
  interruptible: boolean;
  interruptPriority: TacticalBias;
  resourceCosts: CombatResourceCostState;
  manualOverride: boolean;
  lifecycle: CombatActionLifecycleState;
  source: CombatActionSourceState;
  resolutionHooks: string[];
}

export interface CombatTimingState {
  readyAtTick: number;
  currentActionId: string | null;
  recoveryEndsAtTick: number | null;
  channelEndsAtTick: number | null;
  interruptWindowEndsAtTick: number | null;
  queuedActionIds: string[];
  lastCompletedActionId: string | null;
}

export interface CombatantHookState {
  skillIds: string[];
  spellIds: string[];
  abilityIds: string[];
  traitIds: string[];
  itemIds: string[];
  skillEffectGrants: CombatSkillEffectGrantState[];
  itemUseProfileGrants: CombatItemUseProfileGrantState[];
  armorHandlingGrants: CombatArmorHandlingGrantState[];
  spellActionGrants: CombatSpellActionGrantState[];
  abilityActionGrants: CombatAbilityActionGrantState[];
  titleMilestoneGrants: CombatTitleMilestoneGrantState[];
  tacticalGrants: CombatTacticalGrantState[];
  roleModifierIds: string[];
  actionTimeMultiplier: number;
  recoveryTimeMultiplier: number;
}

export interface CombatantEquipmentHookState {
  mainHandItemId?: string | null;
  offHandItemId?: string | null;
  armorItemIds: string[];
}

export interface CombatantState {
  id: string;
  displayName: string;
  kind: CombatantKind;
  disposition: CombatDisposition;
  teamId: string;
  sourceRefs: {
    playerId?: string;
    monsterId?: string;
    encounterTemplateId?: string;
    spawnProfileId?: string;
  };
  attributes: Partial<PlayerAttributes>;
  resources: CombatResourceState;
  statusEffects: CombatStatusEffectState[];
  incapacitated: boolean;
  defeated: boolean;
  roleId: TacticalRoleId;
  controlMode: CombatControlMode;
  tacticsPresetId: string | null;
  tactics?: CombatTacticsState;
  targetPreferences: CombatTargetPreferenceRuleState[];
  focusDirectives: CombatFocusDirectivesState;
  timing: CombatTimingState;
  equipment: CombatantEquipmentHookState;
  hooks: CombatantHookState;
  threatRating: number;
}

export interface PartyMemberRuntimeState {
  combatantId: string | null;
  actorId: string;
  displayName: string;
  kind: "player" | "party_member" | "guest";
  roleId: TacticalRoleId;
  controlMode: CombatControlMode;
  tacticsPresetId: string | null;
}

export interface PartyRuntimeState {
  leaderCombatantId: string | null;
  members: PartyMemberRuntimeState[];
}

export interface ManualCombatOverrideState {
  actorCombatantId: string;
  forcedRoleId?: TacticalRoleId;
  forcedTargetIds?: string[];
  forcedControlMode?: CombatControlMode;
  suspendAiUntilTick?: number | null;
}

export interface CombatTargetingState {
  currentPlayerTargetId: string | null;
  focusTargetIds: string[];
  ignoreTargetIds: string[];
  priorityTargetIds: string[];
  deprioritizedTargetIds: string[];
}

export interface CombatEncounterOutcomeState {
  result: "allies_victorious" | "enemies_victorious" | "disengaged" | "cancelled";
  endedAtTick: number;
  reason: string;
}

export interface CombatEncounterState {
  encounterId: string;
  encounterTemplateId?: string | null;
  spawnProfileId?: string | null;
  state: CombatEncounterStateId;
  area: CombatAreaContextState;
  currentTimeTick: number;
  alliedCombatantIds: string[];
  alliedGuestCombatantIds: string[];
  enemyCombatantIds: string[];
  teams: Array<{
    id: string;
    disposition: CombatDisposition;
    combatantIds: string[];
  }>;
  combatants: CombatantState[];
  actions: CombatActionState[];
  nextActionOrdinal: number;
  pauseAllowed: boolean;
  paused: boolean;
  targeting: CombatTargetingState;
  manualOverrides: ManualCombatOverrideState[];
  outcome: CombatEncounterOutcomeState | null;
}

export interface CombatEncounterHistoryEntryState {
  encounterId: string;
  encounterTemplateId: string | null;
  regionId: string;
  result: CombatEncounterOutcomeState["result"];
  endedAtTick: number;
}

export interface CombatCommandRequestState {
  actorCombatantId: string;
  actionType: string;
  targetIds: string[];
  sourceType: CombatActionSourceState["sourceType"];
  sourceId: string | null;
  queueMode: "append" | "replace";
}

export interface CombatCommandAuditState {
  actorCombatantId: string;
  issuedAtTick: number;
  actionType: string;
  targetIds: string[];
  overrideApplied: boolean;
}

export interface CombatUiState {
  selectedPartyMemberId: string | null;
  selectedEnemyTargetId: string | null;
  stagedCommand: CombatCommandRequestState | null;
  lastIssuedCommand: CombatCommandAuditState | null;
}
