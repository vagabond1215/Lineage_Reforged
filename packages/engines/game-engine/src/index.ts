import { tickCivilization } from "../../civilization-engine/src/index.js";
import { tickPlayer } from "../../player-engine/src/index.js";
import { tickWorld } from "../../world-engine/src/index.js";
import type { GameDelta, GameTickContext, TickResult } from "../../../shared/types/src/index.js";
import { tickCombatFoundation } from "./combat/index.js";
import {
  createCombatModeState,
  createDefaultGameState,
  createDefaultPlayerCombatProfile,
  createEmptyCombatUiState,
  createEmptyPartyRuntimeState
} from "./combat/state.js";
export { createEmptySessionState, createSaveSnapshotFromGameContext } from "./save-snapshot.js";
export {
  createCombatModeState,
  createDefaultGameState,
  createDefaultPlayerCombatProfile,
  createEmptyCombatUiState,
  createEmptyPartyRuntimeState
} from "./combat/state.js";

export function runGameTick(context: GameTickContext): TickResult<GameDelta> {
  context.state.mode ??= createCombatModeState("normal");
  context.state.party ??= createEmptyPartyRuntimeState();
  context.state.activeEncounter ??= null;
  context.state.combatHistory ??= [];

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
