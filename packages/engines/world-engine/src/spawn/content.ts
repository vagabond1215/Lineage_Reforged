import encounterParsed from "../../../../content/base/world/encounter_templates.json" with { type: "json" };
import monsterParsed from "../../../../content/base/world/monsters.json" with { type: "json" };
import spawnParsed from "../../../../content/base/world/spawn_profiles.json" with { type: "json" };
import regionsParsed from "../../../../content/base/world/regions.json" with { type: "json" };
import type {
  EncounterTemplateRecord,
  MonsterRecord,
  SpawnProfileRecord
} from "../../../../shared/types/src/index.js";

type RegionHazardRecord = {
  id: string;
  parentRegionId?: string;
  simulationProfile?: {
    hazardPressure?: number;
  };
};

type CachedSpawnContent = {
  encounterTemplates: EncounterTemplateRecord[];
  encounterTemplateById: Map<string, EncounterTemplateRecord>;
  monsters: MonsterRecord[];
  monsterById: Map<string, MonsterRecord>;
  spawnProfiles: SpawnProfileRecord[];
  spawnProfileById: Map<string, SpawnProfileRecord>;
  regionHazardById: Map<string, number>;
  regionParentById: Map<string, string | null>;
};

let cachedSpawnContent: CachedSpawnContent | null = null;

export function loadSpawnFoundationContent(): CachedSpawnContent {
  if (cachedSpawnContent) {
    return cachedSpawnContent;
  }

  const encounters = encounterParsed.records as EncounterTemplateRecord[];
  const monsters = monsterParsed.records as MonsterRecord[];
  const profiles = spawnParsed.records as SpawnProfileRecord[];
  const regions = regionsParsed.records as RegionHazardRecord[];

  cachedSpawnContent = {
    encounterTemplates: encounters,
    encounterTemplateById: new Map(encounters.map((record) => [record.id, record])),
    monsters,
    monsterById: new Map(monsters.map((record) => [record.id, record])),
    spawnProfiles: profiles,
    spawnProfileById: new Map(profiles.map((record) => [record.id, record])),
    regionHazardById: new Map(
      regions.map((record) => [record.id, record.simulationProfile?.hazardPressure ?? 35])
    ),
    regionParentById: new Map(regions.map((record) => [record.id, record.parentRegionId ?? null]))
  };

  return cachedSpawnContent;
}
