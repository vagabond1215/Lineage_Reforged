import type {
  ResolvedSpawnCandidateState,
  SpawnProfileRecord,
  WorldState
} from "../../../../shared/types/src/index.js";
import { loadSpawnFoundationContent } from "./content.js";

function hashText(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function matchesSpawnProfile(profile: SpawnProfileRecord, state: WorldState, regionId: string): boolean {
  const encounterContext = state.encounterContext;
  if (!profile.regionIds.includes(regionId)) {
    return false;
  }
  if (encounterContext?.worldHexId && profile.worldHexIds.length > 0 && !profile.worldHexIds.includes(encounterContext.worldHexId)) {
    return false;
  }
  if (
    encounterContext?.settlementId &&
    profile.settlementIds.length > 0 &&
    !profile.settlementIds.includes(encounterContext.settlementId)
  ) {
    return false;
  }
  if (encounterContext?.siteId && profile.siteIds.length > 0 && !profile.siteIds.includes(encounterContext.siteId)) {
    return false;
  }
  if (
    encounterContext &&
    profile.habitatTags.length > 0 &&
    !profile.habitatTags.some((tag) => encounterContext.habitatTags.includes(tag))
  ) {
    return false;
  }

  const hazardPressure = encounterContext?.hazardPressure ?? 35;
  return hazardPressure >= profile.minHazardPressure && hazardPressure <= profile.maxHazardPressure;
}

export function buildDefaultEncounterContext(state: WorldState): NonNullable<WorldState["encounterContext"]> {
  return (
    state.encounterContext ?? {
      regionId: state.activeRegions[0] ?? "region.kaelvar",
      settlementId: null,
      siteId: null,
      worldHexId: null,
      habitatTags: [],
      hazardPressure: 35
    }
  );
}

export function resolveSpawnCandidates(state: WorldState, tick: number, seed: number): ResolvedSpawnCandidateState[] {
  const content = loadSpawnFoundationContent();
  const encounterContext = buildDefaultEncounterContext(state);
  const regionId = encounterContext.regionId;
  const hazardPressure =
    encounterContext.hazardPressure ?? content.regionHazardById.get(regionId) ?? 35;

  const matchedProfiles = content.spawnProfiles.filter((profile) => matchesSpawnProfile(profile, state, regionId));

  const candidates: ResolvedSpawnCandidateState[] = [];
  for (const profile of matchedProfiles) {
    const spawnRoll = hashText(`${seed}:${tick}:${profile.id}:${regionId}`) % 100;
    if (spawnRoll >= profile.spawnRatePerDay) {
      continue;
    }

    const eligibleEncounterWeights = profile.encounterWeights.filter((entry) => {
      const minHazard = entry.minHazardPressure ?? profile.minHazardPressure;
      const maxHazard = entry.maxHazardPressure ?? profile.maxHazardPressure;
      return hazardPressure >= minHazard && hazardPressure <= maxHazard;
    });

    if (eligibleEncounterWeights.length === 0) {
      continue;
    }

    const totalWeight = eligibleEncounterWeights.reduce((sum, entry) => sum + entry.weight, 0);
    const selection = hashText(`${profile.id}:${tick}:${seed}:encounter`) % totalWeight;
    let cursor = 0;
    const chosen =
      eligibleEncounterWeights.find((entry) => {
        cursor += entry.weight;
        return selection < cursor;
      }) ?? eligibleEncounterWeights[0];

    const template = chosen ? content.encounterTemplateById.get(chosen.encounterTemplateId) : null;
    if (!template) {
      continue;
    }

    const difficultyTier = Math.max(0, Math.min(3, Math.floor(hazardPressure / 25)));
    candidates.push({
      id: `spawn.${profile.id}.${template.id}.${tick}`,
      spawnProfileId: profile.id,
      encounterTemplateId: template.id,
      regionId,
      worldHexId: encounterContext.worldHexId ?? null,
      settlementId: encounterContext.settlementId ?? null,
      siteId: encounterContext.siteId ?? null,
      habitatTags: encounterContext.habitatTags,
      hazardPressure,
      selectedAtTick: tick,
      difficultyTier,
      disposition: template.disposition,
      movementMode: template.movementMode,
      spawnWeight: chosen.weight
    });
  }

  return candidates;
}
