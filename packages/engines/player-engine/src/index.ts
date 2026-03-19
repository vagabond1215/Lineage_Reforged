import type { PlayerDelta, PlayerTickContext, TickResult } from "../../../shared/types/src/index.js";

export function tickPlayer(context: PlayerTickContext): TickResult<PlayerDelta> {
  const delta: PlayerDelta = {
    kind: "resources",
    playerId: context.state.playerId,
    payload: {
      saveSlotId: context.saveSlotId,
      tick: context.clock.tick,
      level: context.state.progression.level,
      xp: context.state.resources.xp.current,
      hp: context.state.resources.hp.current,
      mp: context.state.resources.mp.current,
      stamina: context.state.resources.stamina.current,
      skillsKnown: context.state.skills.length,
      spellsKnown: context.state.spells.length,
      abilitiesKnown: context.state.abilities.length,
      activeTraits: context.state.traits.length
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
