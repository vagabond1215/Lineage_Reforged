export type CombatControlMode = "ai" | "manual";

export type TacticalRoleId =
  | "frontliner"
  | "disruptor"
  | "ranged_pressure"
  | "healer"
  | "support_buffer"
  | "debuffer_controller"
  | "opportunist"
  | "tank_protector"
  | "flexible_adaptive";

export type TacticalBias = "avoid" | "low" | "normal" | "high" | "critical";

export type SpellTierPreference = "low" | "balanced" | "high";

export type CombatTargetRuleId =
  | "lowest_hp"
  | "highest_hp"
  | "lowest_mp"
  | "highest_mp"
  | "lowest_stamina"
  | "highest_stamina"
  | "lowest_max_hp"
  | "highest_max_hp"
  | "lowest_max_mp"
  | "highest_max_mp"
  | "lowest_max_stamina"
  | "highest_max_stamina"
  | "weakest_to_element"
  | "highest_threat"
  | "currently_casting"
  | "easiest_to_interrupt"
  | "nearest"
  | "farthest"
  | "focus_current_player_target"
  | "ignore_specific_targets"
  | "melee_focus"
  | "melee_ignore"
  | "ranged_focus"
  | "ranged_ignore"
  | "magic_focus"
  | "magic_ignore";

export interface CombatFocusDirectivesState {
  focusTargetIds: string[];
  ignoreTargetIds: string[];
  priorityTargetIds: string[];
  deprioritizedTargetIds: string[];
  meleeFocusTargetIds: string[];
  meleeIgnoreTargetIds: string[];
  rangedFocusTargetIds: string[];
  rangedIgnoreTargetIds: string[];
  magicFocusTargetIds: string[];
  magicIgnoreTargetIds: string[];
}

export interface CombatTargetPreferenceRuleState {
  id: string;
  rule: CombatTargetRuleId;
  weight: number;
  scope: "ally" | "enemy" | "any";
  actionTypes?: string[];
  element?: string;
  sourceTargetIds?: string[];
}

export interface TacticalPreferenceState {
  favorInterrupts: TacticalBias;
  favorDamage: TacticalBias;
  favorLowTierSpells: TacticalBias;
  favorHighTierSpells: TacticalBias;
  favorConservation: TacticalBias;
  favorWeaknessExploitation: TacticalBias;
  favorHealingUrgency: TacticalBias;
  favorEnfeebling: TacticalBias;
  favorEnhancing: TacticalBias;
  favorAreaEffects: TacticalBias;
  favorSingleTargetPressure: TacticalBias;
  favorMeleeEngagement: TacticalBias;
  favorRangedEngagement: TacticalBias;
  favorMagicEngagement: TacticalBias;
}

export interface SpellPreferenceState {
  preferredSchools: string[];
  preferredElements: string[];
  preferredTier: SpellTierPreference;
  buffPriority: TacticalBias;
  debuffPriority: TacticalBias;
  resourceConservationThresholds: {
    mpRatio: number;
    staminaRatio: number;
  };
}

export interface CombatTacticsState {
  roleId: TacticalRoleId;
  preferences: TacticalPreferenceState;
  spellPreferences: SpellPreferenceState;
  targetPreferences: CombatTargetPreferenceRuleState[];
  focusDirectives: CombatFocusDirectivesState;
}

export interface CombatActorPreferenceState {
  actorId: string;
  defaultRoleId: TacticalRoleId;
  defaultControlMode: CombatControlMode;
  tacticsPresetId: string | null;
  tactics: CombatTacticsState;
}

export interface PlayerCombatProfileState {
  preferredMode: "normal" | "hardcore";
  memberPreferences: CombatActorPreferenceState[];
}

export interface CombatRoleRecord {
  id: TacticalRoleId;
  name: string;
  summary: string;
  preferredActionTypes: string[];
  defaultTactics: CombatTacticsState;
}

export interface TacticsPresetRecord {
  id: string;
  name: string;
  disposition: "ally" | "enemy" | "neutral";
  summary: string;
  roleId: TacticalRoleId;
  tactics: CombatTacticsState;
  tags: string[];
}
