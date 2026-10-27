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

function spawnProfileFailures(profile: SpawnProfileRecord, context: NonNullable<WorldState["encounterContext"]>, ancestry: string[]): string[] {
  const failures: string[] = [];
  if (!profile.regionIds.some((id) => ancestry.includes(id))) failures.push("region");
  if (profile.worldHexIds.length > 0 && !profile.worldHexIds.includes(context.worldHexId ?? "")) failures.push("world hex");
  if (profile.settlementIds.length > 0 && !profile.settlementIds.includes(context.settlementId ?? "")) failures.push("settlement");
  if (profile.siteIds.length > 0 && !profile.siteIds.includes(context.siteId ?? "")) failures.push("site");
  if (
    profile.habitatTags.length > 0 &&
    !profile.habitatTags.some((tag) => context.habitatTags.includes(tag))
  ) {
    failures.push("habitat");
  }

  const hazardPressure = context.hazardPressure;
  if (hazardPressure < profile.minHazardPressure || hazardPressure > profile.maxHazardPressure) failures.push("hazard pressure");
  return failures;
}

function regionAncestry(regionId: string, parentById: Map<string, string | null>): string[] {
  const ancestry: string[] = [];
  const seen = new Set<string>();
  let cursorId: string | null = regionId;
  while (cursorId) {
    if (seen.has(cursorId) || !parentById.has(cursorId)) return [];
    seen.add(cursorId);
    ancestry.push(cursorId);
    cursorId = parentById.get(cursorId) ?? null;
  }
  return ancestry;
}

type SpawnContent = ReturnType<typeof loadSpawnFoundationContent>;
type EncounterWeight = SpawnProfileRecord["encounterWeights"][number];

function encounterWeightFailures(
  profile: SpawnProfileRecord,
  entry: EncounterWeight,
  context: NonNullable<WorldState["encounterContext"]>,
  ancestry: string[],
  content: SpawnContent
): string[] {
  const failures: string[] = [];
  const template = content.encounterTemplateById.get(entry.encounterTemplateId);
  if (entry.weight <= 0) failures.push("nonpositive encounter weight");
  if (context.hazardPressure < (entry.minHazardPressure ?? profile.minHazardPressure) ||
      context.hazardPressure > (entry.maxHazardPressure ?? profile.maxHazardPressure)) failures.push("encounter hazard band");
  if (!template) return [...failures, "encounter template missing"];
  if (!template.regionIds.some((id) => ancestry.includes(id))) failures.push("template region");
  if (!template.habitatTags.some((tag) => context.habitatTags.includes(tag))) failures.push("template habitat");
  if (!profile.allowedMovementModes.includes(template.movementMode)) failures.push("movement mode");
  if (profile.hostilityWeights[template.disposition] <= 0) failures.push("disposition weight");
  if (template.members.length === 0) failures.push("template has no members");
  for (const member of template.members) {
    const monster = content.monsterById.get(member.monsterId);
    if (!monster) failures.push(`monster ${member.monsterId} missing`);
    else if (!monster.habitatTags.some((tag) => context.habitatTags.includes(tag))) failures.push(`monster ${member.monsterId} habitat`);
  }
  return failures;
}

export function inspectSpawnEligibility(
  state: WorldState, tick: number, seed = 0,
  options: { selectionKey?: string; content?: SpawnContent } = {}
) {
  const content = options.content ?? loadSpawnFoundationContent();
  const context = state.encounterContext ?? null;
  const ancestry = context ? regionAncestry(context.regionId, content.regionParentById) : [];
  const contextError = !context ? "No authored encounter context is active." :
    ancestry.length === 0 ? "Encounter region is unknown." :
    !Number.isFinite(context.hazardPressure) || context.hazardPressure < 0 || context.hazardPressure > 100 ? "Hazard pressure is invalid." :
    context.habitatTags.length === 0 ? "No authored habitat is active." : null;
  const candidates = contextError ? [] : resolveSpawnCandidates(state, tick, seed, { ...options, strict: true });
  const profiles = content.spawnProfiles.map((profile) => {
    const failures = contextError ? [contextError] : spawnProfileFailures(profile, context!, ancestry);
    const spawnRoll = contextError ? null : hashText(`${options.selectionKey ?? seed}:${tick}:${profile.id}:${context!.regionId}`) % 100;
    const spawnRollPassed = failures.length === 0 && spawnRoll !== null && spawnRoll < profile.spawnRatePerDay;
    const encounters = profile.encounterWeights.map((entry) => ({
      encounterTemplateId: entry.encounterTemplateId,
      weight: entry.weight,
      failures: contextError ? [contextError] : encounterWeightFailures(profile, entry, context!, ancestry, content)
    }));
    const chosen = candidates.find((candidate) => candidate.spawnProfileId === profile.id);
    return {
      id: profile.id,
      passed: failures.length === 0,
      failures,
      spawnRoll,
      spawnRatePerDay: profile.spawnRatePerDay,
      spawnRollPassed,
      encounters,
      selectedCandidateId: chosen?.id ?? null,
      noCandidateReason: failures.length > 0 ? "Spawn profile constraints failed." :
        !spawnRollPassed ? "Spawn rate roll missed." :
        encounters.every((entry) => entry.failures.length > 0) ? "No encounter template passes its authored constraints." : null
    };
  });
  return {
    context,
    contextError,
    profiles,
    candidates,
    unsupportedFilters: ["time of day", "season", "weather"]
  };
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

export function resolveSpawnCandidates(
  state: WorldState, tick: number, seed: number,
  options: { strict?: boolean; selectionKey?: string; content?: ReturnType<typeof loadSpawnFoundationContent> } = {}
): ResolvedSpawnCandidateState[] {
  const content = options.content ?? loadSpawnFoundationContent();
  if (options.strict && !state.encounterContext) return [];
  const encounterContext = buildDefaultEncounterContext(state);
  const regionId = encounterContext.regionId;
  const hazardPressure = encounterContext.hazardPressure;
  if (options.strict && (!Number.isFinite(hazardPressure) || hazardPressure < 0 || hazardPressure > 100 ||
      !encounterContext.habitatTags.length)) return [];
  const ancestry = regionAncestry(regionId, content.regionParentById);
  if (ancestry.length === 0) return [];

  const matchedProfiles = content.spawnProfiles
    .filter((profile) => spawnProfileFailures(profile, encounterContext, ancestry).length === 0)
    .sort((a, b) => a.id.localeCompare(b.id));

  const candidates: ResolvedSpawnCandidateState[] = [];
  for (const profile of matchedProfiles) {
    const spawnRoll = hashText(`${options.selectionKey ?? seed}:${tick}:${profile.id}:${regionId}`) % 100;
    if (spawnRoll >= profile.spawnRatePerDay) {
      continue;
    }

    const eligibleEncounterWeights = profile.encounterWeights.filter((entry) =>
      encounterWeightFailures(profile, entry, encounterContext, ancestry, content).length === 0
    ).sort((a, b) => a.encounterTemplateId.localeCompare(b.encounterTemplateId));

    if (eligibleEncounterWeights.length === 0) {
      continue;
    }

    const totalWeight = eligibleEncounterWeights.reduce((sum, entry) => sum + entry.weight, 0);
    const selection = hashText(`${profile.id}:${tick}:${options.selectionKey ?? seed}:encounter`) % totalWeight;
    let cursor = 0;
    const chosen =
      eligibleEncounterWeights.find((entry) => {
        cursor += entry.weight;
        return selection < cursor;
      }) ?? eligibleEncounterWeights[0];

    if (!chosen) continue;

    const template = content.encounterTemplateById.get(chosen.encounterTemplateId);
    if (!template) {
      continue;
    }

    const difficultyTier = Math.max(0, Math.min(3, Math.floor(hazardPressure / 25)));
    candidates.push({
      id: options.selectionKey
        ? `spawn.${hashText(options.selectionKey)}.${profile.id}.${template.id}.${tick}`
        : `spawn.${profile.id}.${template.id}.${tick}`,
      ...(options.selectionKey ? { selectionVersion: "ordinary.v1" } : {}),
      ...(encounterContext.sourceActionId ? { sourceActionId: encounterContext.sourceActionId } : {}),
      ...(encounterContext.actionContextId ? { actionContextId: encounterContext.actionContextId } : {}),
      ...(encounterContext.worldHexEdgeId ? { worldHexEdgeId: encounterContext.worldHexEdgeId } : {}),
      ...(encounterContext.hazardSource ? { hazardSource: encounterContext.hazardSource } : {}),
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
