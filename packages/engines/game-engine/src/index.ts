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
  resolveRunLegacyPayout
} from "./run-legacy-payout.js";
export {
  getLegacyUnlockDefinitionById,
  getLegacyUnlockDefinitions,
  purchaseLegacyUnlock,
  resolveLegacyUnlockStates,
  validateLegacyUnlockDefinitions
} from "./legacy-unlocks.js";
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
