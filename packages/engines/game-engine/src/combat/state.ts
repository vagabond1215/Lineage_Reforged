import type {
  CombatModeId,
  CombatModeState,
  CombatUiState,
  GameState,
  PartyRuntimeState,
  PlayerCombatProfileState,
  RunDifficultyState,
  TacticalBias,
  TacticalRoleId
} from "../../../../shared/types/src/index.js";
import type {
  CombatFocusDirectivesState,
  CombatTacticsState,
  SpellPreferenceState,
  TacticalPreferenceState
} from "../../../../shared/types/src/index.js";

function createDefaultBias(): TacticalBias {
  return "normal";
}

export function createEmptyCombatFocusDirectives(): CombatFocusDirectivesState {
  return {
    focusTargetIds: [],
    ignoreTargetIds: [],
    priorityTargetIds: [],
    deprioritizedTargetIds: [],
    meleeFocusTargetIds: [],
    meleeIgnoreTargetIds: [],
    rangedFocusTargetIds: [],
    rangedIgnoreTargetIds: [],
    magicFocusTargetIds: [],
    magicIgnoreTargetIds: []
  };
}

export function createDefaultTacticalPreferences(): TacticalPreferenceState {
  return {
    favorInterrupts: createDefaultBias(),
    favorDamage: createDefaultBias(),
    favorLowTierSpells: createDefaultBias(),
    favorHighTierSpells: createDefaultBias(),
    favorConservation: createDefaultBias(),
    favorWeaknessExploitation: createDefaultBias(),
    favorHealingUrgency: createDefaultBias(),
    favorEnfeebling: createDefaultBias(),
    favorEnhancing: createDefaultBias(),
    favorAreaEffects: createDefaultBias(),
    favorSingleTargetPressure: createDefaultBias(),
    favorMeleeEngagement: createDefaultBias(),
    favorRangedEngagement: createDefaultBias(),
    favorMagicEngagement: createDefaultBias()
  };
}

export function createDefaultSpellPreferences(): SpellPreferenceState {
  return {
    preferredSchools: [],
    preferredElements: [],
    preferredTier: "balanced",
    buffPriority: createDefaultBias(),
    debuffPriority: createDefaultBias(),
    resourceConservationThresholds: {
      mpRatio: 0.25,
      staminaRatio: 0.25
    }
  };
}

export function createDefaultCombatTactics(roleId: TacticalRoleId = "flexible_adaptive"): CombatTacticsState {
  return {
    roleId,
    preferences: createDefaultTacticalPreferences(),
    spellPreferences: createDefaultSpellPreferences(),
    targetPreferences: [],
    focusDirectives: createEmptyCombatFocusDirectives()
  };
}

export function createDefaultPlayerCombatProfile(): PlayerCombatProfileState {
  return {
    preferredMode: "normal",
    memberPreferences: []
  };
}

export function createEmptyCombatUiState(): CombatUiState {
  return {
    selectedPartyMemberId: null,
    selectedEnemyTargetId: null,
    stagedCommand: null,
    lastIssuedCommand: null
  };
}

export function createEmptyPartyRuntimeState(): PartyRuntimeState {
  return {
    leaderCombatantId: null,
    members: []
  };
}

export function createCombatModeState(modeId: CombatModeId = "normal"): CombatModeState {
  return {
    id: modeId,
    combatPauseAllowed: modeId === "normal"
  };
}

export function createDefaultRunDifficultyState(): RunDifficultyState {
  return {
    tier: "normal",
    hardcore: false
  };
}

export function createDefaultGameState(modeId: CombatModeId = "normal"): GameState {
  return {
    worldVersion: "0.1.0",
    activeScenario: "bootstrap",
    runDifficulty: createDefaultRunDifficultyState(),
    mode: createCombatModeState(modeId),
    party: createEmptyPartyRuntimeState(),
    activeEncounter: null,
    combatHistory: []
  };
}
