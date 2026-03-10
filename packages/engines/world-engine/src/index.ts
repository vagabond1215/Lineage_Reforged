import type { TickResult, WorldDelta, WorldTickContext } from "../../../shared/types/src/index.js";

export function tickWorld(context: WorldTickContext): TickResult<WorldDelta> {
  const delta: WorldDelta = {
    kind: "weather",
    regionId: context.state.activeRegions[0] ?? "region-001",
    payload: {
      climateProfileId: context.climateProfileId,
      tick: context.clock.tick
    }
  };

  return {
    domain: "world",
    appliedTick: context.clock.tick,
    deltas: [delta],
    emittedEvents: [],
    warnings: []
  };
}