import { tickCivilization } from "../../civilization-engine/src/index.js";
import { tickPlayer } from "../../player-engine/src/index.js";
import { tickWorld } from "../../world-engine/src/index.js";
import type { GameDelta, GameTickContext, TickResult } from "../../../shared/types/src/index.js";
import { tickCombatFoundation } from "./combat/index.js";
import {
  createCombatModeState,
  createDefaultGameState,
  createDefaultRunDifficultyState,
  createDefaultPlayerCombatProfile,
  createEmptyCombatUiState,
  createEmptyPartyRuntimeState
} from "./combat/state.js";
export { createEmptySessionState, createSaveSnapshotFromGameContext } from "./save-snapshot.js";
export {
  createDefaultAccountAchievementsState,
  createDefaultAccountHistoryState,
  createDefaultCharacterAchievementsState
} from "./account-achievement-state.js";
export {
  createDefaultAccountEstateState,
  depositEstateFromArchivedSnapshot,
  resolveAccountRunHistorySourceId,
  resolveEstateClaimTiers,
  resolveEstateClaimPreview,
  resolveEstateClaimPreviews
} from "./account-estate.js";
export {
  DEFAULT_ACCOUNT_DISPLAY_NAME,
  DEFAULT_ACCOUNT_ID,
  createDefaultAccountLegacyState,
  createDefaultAccountProfileState,
  grantLegacy,
  grantLegacyReward,
  hasLegacyUnlock,
  recordLegacyTransaction,
  spendLegacy
} from "./legacy-account.js";
export {
  archiveRunRecord,
  evaluateAchievementProgress,
  getAchievementDefinitionById,
  getAchievementDefinitions,
  markRunDeleted,
  refreshRunHistoryFromSnapshot,
  upsertActiveRunRecord,
  validateAchievementDefinitions
} from "./achievements.js";
export {
  DEFAULT_RUN_LEGACY_PAYOUT_RULES,
  hasRunLegacyPayoutResolved,
  isRunEligibleForLegacyPayout,
  resolveRunLegacyPayoutEarnedEchoLevel,
  resolveRunLegacyPayout
} from "./run-legacy-payout.js";
export {
  clearLegacyPreparationChoice,
  getLegacyUnlockDefinitionById,
  getLegacyUnlockDefinitions,
  getLegacyPreparationChoiceLabel,
  getLegacyPreparationChoiceOptions,
  consumeSelectedLegacyPreparations,
  isLegacyPreparationChoiceRequired,
  purchaseLegacyUnlock,
  removeLegacyPreparation,
  resolveLegacyCharacterStartBonuses,
  resolveLegacyStarterSkillPolicy,
  resolveLegacyPreparationCapacity,
  resolveLegacyRenownPresence,
  resolveLegacyPreparationSelection,
  resolveLegacyUnlockStates,
  setLegacyPreparationChoice,
  selectLegacyPreparation,
  validateLegacyUnlockDefinitions
} from "./legacy-unlocks.js";
export {
  BACKSTORY_BLOCKED_EVIDENCE_KINDS,
  BACKSTORY_ELIGIBILITY_DEFAULT_BACKSTORY_IDS,
  BACKSTORY_ELIGIBILITY_POLICY,
  BACKSTORY_ELIGIBILITY_POLICY_STATUSES,
  BACKSTORY_ELIGIBILITY_SCOPES,
  BACKSTORY_ELIGIBILITY_SOURCE_TYPES,
  BACKSTORY_ELIGIBILITY_TIERS,
  validateBackstoryEligibilityPolicy,
  type BackstoryBlockedEvidenceKind,
  type BackstoryEligibilityAvailabilityStatus,
  type BackstoryEligibilityLegacyPurchaseRequirement,
  type BackstoryEligibilityMissingBehavior,
  type BackstoryEligibilityPolicy,
  type BackstoryEligibilityPolicyValidationIssue,
  type BackstoryEligibilityRequirement,
  type BackstoryEligibilityRequirementKind,
  type BackstoryEligibilityRule,
  type BackstoryEligibilityScope,
  type BackstoryEligibilityScopePolicy,
  type BackstoryEligibilitySourceType,
  type BackstoryEligibilityThresholdRequirement,
  type BackstoryEligibilityTier,
  type BackstorySelectedBackstoryEffectPolicy
} from "./backstory-eligibility-policy.js";
export {
  resolveBackstoryEligibility,
  type BackstoryEligibilityEvidenceInput,
  type BackstoryEligibilityEvidenceRecord,
  type BackstoryEligibilityRecordResult,
  type BackstoryEligibilityResolution,
  type BackstoryEligibilityState,
  type BackstoryEligibilityThresholdRecord
} from "./backstory-eligibility.js";
export {
  createCombatModeState,
  createDefaultGameState,
  createDefaultRunDifficultyState,
  createDefaultPlayerCombatProfile,
  createEmptyCombatUiState,
  createEmptyPartyRuntimeState
} from "./combat/state.js";

export function runGameTick(context: GameTickContext): TickResult<GameDelta> {
  context.state.runDifficulty ??= createDefaultRunDifficultyState();
  context.state.mode ??= createCombatModeState("normal");
  context.state.party ??= createEmptyPartyRuntimeState();
  context.state.activeEncounter ??= null;
  context.state.combatHistory ??= [];
  context.playerContext.runDifficulty ??= context.state.runDifficulty;

  const worldResult = tickWorld(context.worldContext);
  const civilizationResult = tickCivilization(context.civilizationContext);
  const playerResult = tickPlayer(context.playerContext);
  const combatResult = tickCombatFoundation(
    context.state,
    context.playerContext.state,
    context.worldContext.state.pendingSpawnCandidates ?? [],
    context.clock.tick,
    context.sessionState
  );

  const orchestrationDelta: GameDelta = {
    kind: "orchestration",
    payload: {
      order: ["world", "civilization", "player", "combat", "global-events"],
      domainDeltas: {
        world: worldResult.deltas.length,
        civilization: civilizationResult.deltas.length,
        player: playerResult.deltas.length,
        combat: combatResult.deltas.length
      }
    }
  };

  return {
    domain: "game",
    appliedTick: context.clock.tick,
    deltas: [...combatResult.deltas, orchestrationDelta],
    emittedEvents: [
      ...worldResult.emittedEvents,
      ...civilizationResult.emittedEvents,
      ...playerResult.emittedEvents,
      ...combatResult.emittedEvents
    ],
    warnings: [
      ...worldResult.warnings,
      ...civilizationResult.warnings,
      ...playerResult.warnings,
      ...combatResult.warnings
    ]
  };
}
