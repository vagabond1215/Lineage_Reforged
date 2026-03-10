import type { PlayerDelta, PlayerTickContext, TickResult } from "../../../shared/types/src/index.js";

export function tickPlayer(context: PlayerTickContext): TickResult<PlayerDelta> {
  const delta: PlayerDelta = {
    kind: "attributes",
    playerId: context.state.playerId,
    payload: {
      saveSlotId: context.saveSlotId,
      tick: context.clock.tick
    }
  };

  return {
    domain: "player",
    appliedTick: context.clock.tick,
    deltas: [delta],
    emittedEvents: [],
    warnings: []
  };
}