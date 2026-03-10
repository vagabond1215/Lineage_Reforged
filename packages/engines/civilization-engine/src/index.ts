import type {
  CivilizationDelta,
  CivilizationTickContext,
  TickResult
} from "../../../shared/types/src/index.js";

export function tickCivilization(context: CivilizationTickContext): TickResult<CivilizationDelta> {
  const delta: CivilizationDelta = {
    kind: "market",
    settlementId: context.state.settlements[0] ?? "settlement-001",
    payload: {
      economyProfileId: context.economyProfileId,
      tick: context.clock.tick
    }
  };

  return {
    domain: "civilization",
    appliedTick: context.clock.tick,
    deltas: [delta],
    emittedEvents: [],
    warnings: []
  };
}