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
export { synchronizeGameplaySnapshot } from "./gameplay-snapshot-sync.js";
export {
  PLAYER_QUEST_ACCEPTED_EVENT_TYPE,
  createPlayerQuestAcceptanceCommand,
  executePlayerQuestAcceptanceCommand,
  resolveNextPlayerQuestAcceptanceCommandSequence,
  resolvePlayerQuestAcceptancePlan,
  type AcceptedPlayerQuestAcceptancePlan,
  type AcceptedPlayerQuestAcceptanceResult,
  type PlayerQuestAcceptanceCommand,
  type PlayerQuestAcceptanceCommandRejectionCode,
  type PlayerQuestAcceptanceFacts,
  type PlayerQuestAcceptanceNoticeFacts,
  type PlayerQuestAcceptancePlan,
  type PlayerQuestAcceptancePlanRejectionCode,
  type PlayerQuestAcceptanceResult,
  type PlayerQuestAcceptedEvent,
  type PlayerQuestAcceptedEventPayload,
  type RejectedPlayerQuestAcceptancePlan,
  type RejectedPlayerQuestAcceptanceResult
} from "./player-quest-acceptance.js";
export {
  PLAYER_QUEST_TRACKING_CHANGED_EVENT_TYPE,
  createPlayerQuestTrackingCommand,
  executePlayerQuestTrackingCommand,
  resolveNextPlayerQuestTrackingCommandSequence,
  resolvePlayerQuestTrackingPlan,
  type AcceptedPlayerQuestTrackingPlan,
  type AcceptedPlayerQuestTrackingResult,
  type PlayerQuestTrackingChangedEvent,
  type PlayerQuestTrackingChangedEventPayload,
  type PlayerQuestTrackingCommand,
  type PlayerQuestTrackingCommandRejectionCode,
  type PlayerQuestTrackingFacts,
  type PlayerQuestTrackingNoticeFacts,
  type PlayerQuestTrackingPlan,
  type PlayerQuestTrackingPlanRejectionCode,
  type PlayerQuestTrackingResult,
  type RejectedPlayerQuestTrackingPlan,
  type RejectedPlayerQuestTrackingResult
} from "./player-quest-tracking.js";
export {
  getCurrentPlayerTravelLocationId,
  getCurrentPlayerTravelLocationLabel,
  getPlayerTravelDestinationFacts,
  resolvePlayerTravelPlan,
  type AcceptedPlayerTravelPlan,
  type PlayerTravelDestinationFacts,
  type PlayerTravelPlan,
  type PlayerTravelPlanRejectionCode,
  type RejectedPlayerTravelPlan
} from "./player-travel-rules.js";
export {
  PLAYER_TRAVEL_COMPLETED_EVENT_TYPE,
  createPlayerTravelCommand,
  executePlayerTravelCommand,
  resolveNextPlayerTravelCommandSequence,
  type AcceptedPlayerTravelResult,
  type PlayerTravelCommand,
  type PlayerTravelCommandRejectionCode,
  type PlayerTravelCompletedEvent,
  type PlayerTravelCompletedEventPayload,
  type PlayerTravelNoticeFacts,
  type PlayerTravelResult,
  type RejectedPlayerTravelResult
} from "./player-travel.js";
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
  ACCOUNT_FAMILY_STATUSES,
  FAMILY_PRESTIGE_CATEGORY_TAGS,
  FAMILY_PRESTIGE_TRANSACTION_KINDS,
  createDefaultAccountFamiliesState,
  createEmptyAccountFamilyPrestigeTotals,
  hasFamilyUnlock,
  listFamilyUnlockIds,
  listFamilyUnlocks,
  resolveFamilyUnlocksByFamily,
  resolveFamilyPrestigeTotals,
  resolveFamilyPrestigeTotalsByFamily
} from "./account-family.js";
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
  isBackstoryLegacyUnlockDefinition,
  isLegacyPreparationChoiceRequired,
  isNonLiveBackstoryLegacyUnlockDefinition,
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
  isBackstoryLegacyPurchaseDefinition,
  resolveOwnedBackstoryLegacyPurchaseIds,
  type OwnedBackstoryLegacyPurchaseIdResolution,
  type ResolveOwnedBackstoryLegacyPurchaseIdsParams
} from "./backstory-legacy-purchases.js";
export {
  KNOWN_SPELL_ACQUISITION_ROUTES,
  KNOWN_SPELL_AVAILABILITY_STATES,
  KNOWN_SPELL_OWNER_SCOPES,
  MAGIC_CAST_READINESS_BLOCKER_IDS,
  MAGIC_CAST_RESOLVER_READINESS_ISSUE_CODES,
  MAGIC_RESOLVER_INERT_ENVELOPE_SAFETY_FLAGS,
  buildMagicHookSupportProjection,
  buildMagicCastReadiness,
  buildMagicCastResolverReadiness,
  buildMagicResolverInertEnvelope,
  buildKnownSpellReadOnlyProjection,
  buildKnownSpellRecordFromTrainingEvent,
  characterKnowsSpell,
  collectKnownSpellCatalogIds,
  createKnownSpellTrainingEventEvidence,
  createKnownSpellRecord,
  isKnownSpellTrainingEventEvidence,
  normalizeKnownSpellTrainingEventEvidence,
  validateKnownSpellTrainingEventEvidence,
  validateKnownSpellTrainingEventAcquisition,
  validateKnownSpellRecord,
  validateKnownSpellRecordCollection,
  type BuildKnownSpellRecordFromTrainingEventParams,
  type BuildKnownSpellReadOnlyProjectionParams,
  type BuildMagicHookSupportProjectionParams,
  type BuildMagicCastReadinessParams,
  type BuildMagicCastResolverReadinessParams,
  type BuildMagicResolverInertEnvelopeParams,
  type CharacterKnowsSpellParams,
  type CreateKnownSpellTrainingEventEvidenceParams,
  type CreateKnownSpellRecordParams,
  type KnownSpellAcquisitionRoute,
  type KnownSpellAvailabilityState,
  type KnownSpellCatalogEntry,
  type KnownSpellCollectionValidationIssue,
  type KnownSpellCollectionValidationIssueCode,
  type KnownSpellCollectionValidationResult,
  type KnownSpellOwnerScope,
  type KnownSpellReadOnlyProjection,
  type KnownSpellReadOnlyProjectionEntry,
  type KnownSpellRecordState,
  type KnownSpellTrainingEventAcquisitionIssue,
  type KnownSpellTrainingEventAcquisitionIssueCode,
  type KnownSpellTrainingEventAcquisitionProposal,
  type KnownSpellTrainingEventAcquisitionResult,
  type KnownSpellTrainingEventAcquisitionValidationStatus,
  type KnownSpellTrainingEventEvidence,
  type KnownSpellTrainingEventEvidenceValidationIssue,
  type KnownSpellTrainingEventEvidenceValidationIssueCode,
  type KnownSpellTrainingEventEvidenceValidationResult,
  type KnownSpellValidationIssue,
  type KnownSpellValidationIssueCode,
  type KnownSpellValidationResult,
  type MagicCastReadinessBlocker,
  type MagicCastReadinessBlockerId,
  type MagicCastReadinessControlContext,
  type MagicCastReadinessControlLevel,
  type MagicCastReadinessDetails,
  type MagicCastReadinessHookClassification,
  type MagicCastReadinessHookSupport,
  type MagicCastReadinessResult,
  type MagicHookSupportBlockerReason,
  type MagicHookSupportClassificationAuthority,
  type MagicHookSupportProjection,
  type MagicHookSupportProjectionEntry,
  type MagicHookSupportProjectionSourceField,
  type MagicHookSupportReadinessEffect,
  type MagicCastResolverReadinessIssue,
  type MagicCastResolverReadinessIssueCode,
  type MagicCastResolverReadinessResult,
  type MagicCastResolverRuntimePolicy,
  type MagicResolverInertEnvelope,
  type MagicResolverInertEnvelopeBlockerSummary,
  type MagicResolverInertEnvelopeKind,
  type MagicResolverInertEnvelopeMode,
  type MagicResolverInertEnvelopeReadinessSummary,
  type MagicResolverInertEnvelopeSafetyFlags,
  type ValidateKnownSpellTrainingEventAcquisitionParams,
  type ValidateKnownSpellRecordCollectionParams,
  type ValidateKnownSpellRecordParams
} from "./known-spells.js";
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
