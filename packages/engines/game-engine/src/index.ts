import { tickCivilization } from "../../civilization-engine/src/index.js";
import { tickPlayer } from "../../player-engine/src/index.js";
import { tickWorld } from "../../world-engine/src/index.js";
import type { GameDelta, GameTickContext, TickResult } from "../../../shared/types/src/index.js";

export function runGameTick(context: GameTickContext): TickResult<GameDelta> {
  const worldResult = tickWorld(context.worldContext);
  const civilizationResult = tickCivilization(context.civilizationContext);
  const playerResult = tickPlayer(context.playerContext);

  const orchestrationDelta: GameDelta = {
    kind: "orchestration",
    payload: {
      order: ["world", "civilization", "player", "global-events"],
      domainDeltas: {
        world: worldResult.deltas.length,
        civilization: civilizationResult.deltas.length,
        player: playerResult.deltas.length
      }
    }
  };

  return {
    domain: "game",
    appliedTick: context.clock.tick,
    deltas: [orchestrationDelta],
    emittedEvents: [
      ...worldResult.emittedEvents,
      ...civilizationResult.emittedEvents,
      ...playerResult.emittedEvents
    ],
    warnings: [
      ...worldResult.warnings,
      ...civilizationResult.warnings,
      ...playerResult.warnings
    ]
  };
}