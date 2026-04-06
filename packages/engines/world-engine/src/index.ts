import type { TickResult, WorldDelta, WorldTickContext } from "../../../shared/types/src/index.js";
import { resolveSpawnCandidates } from "./spawn/index.js";

export function tickWorld(context: WorldTickContext): TickResult<WorldDelta> {
  const regionId = context.state.encounterContext?.regionId ?? context.state.activeRegions[0] ?? "region.kaelvar";
  const weatherDelta: WorldDelta = {
    kind: "weather",
    regionId,
    payload: {
      climateProfileId: context.climateProfileId,
      tick: context.clock.tick
    }
  };

  const pendingSpawnCandidates = resolveSpawnCandidates(context.state, context.clock.tick, context.seed);
  context.state.pendingSpawnCandidates = pendingSpawnCandidates;

  const deltas: WorldDelta[] = [weatherDelta];
  if (pendingSpawnCandidates.length > 0) {
    deltas.push({
      kind: "spawn",
      regionId,
      payload: {
        tick: context.clock.tick,
        candidateIds: pendingSpawnCandidates.map((candidate) => candidate.id),
        encounterTemplateIds: pendingSpawnCandidates.map((candidate) => candidate.encounterTemplateId),
        spawnProfileIds: pendingSpawnCandidates.map((candidate) => candidate.spawnProfileId)
      }
    });
  }

  return {
    domain: "world",
    appliedTick: context.clock.tick,
    deltas,
    emittedEvents:
      pendingSpawnCandidates.length > 0
        ? [
            {
              id: `spawn.candidate.resolved:${regionId}:${context.clock.tick}`,
              type: "spawn.candidate.resolved",
              domain: "world",
              atTick: context.clock.tick,
              payload: {
                regionId,
                candidates: pendingSpawnCandidates.map((candidate) => ({
                  id: candidate.id,
                  encounterTemplateId: candidate.encounterTemplateId,
                  spawnProfileId: candidate.spawnProfileId
                }))
              }
            }
          ]
        : [],
    warnings: []
  };
}
