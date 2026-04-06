import { readFileSync } from "node:fs";
import type {
  EncounterTemplateRecord,
  MonsterRecord,
  SpawnProfileRecord
} from "../../../../shared/types/src/index.js";

type RegionHazardRecord = {
  id: string;
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
};

let cachedSpawnContent: CachedSpawnContent | null = null;

function readJson<T>(relativePath: string): T {
  const raw = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  return JSON.parse(raw) as T;
}

export function loadSpawnFoundationContent(): CachedSpawnContent {
  if (cachedSpawnContent) {
    return cachedSpawnContent;
  }

  const encounterParsed = readJson<{ records: EncounterTemplateRecord[] }>(
    "../../../../content/base/world/encounter_templates.json"
  );
  const monsterParsed = readJson<{ records: MonsterRecord[] }>("../../../../content/base/world/monsters.json");
  const spawnParsed = readJson<{ records: SpawnProfileRecord[] }>(
    "../../../../content/base/world/spawn_profiles.json"
  );
  const regionsParsed = readJson<{ records: RegionHazardRecord[] }>("../../../../content/base/world/regions.json");

  cachedSpawnContent = {
    encounterTemplates: encounterParsed.records,
    encounterTemplateById: new Map(encounterParsed.records.map((record) => [record.id, record])),
    monsters: monsterParsed.records,
    monsterById: new Map(monsterParsed.records.map((record) => [record.id, record])),
    spawnProfiles: spawnParsed.records,
    spawnProfileById: new Map(spawnParsed.records.map((record) => [record.id, record])),
    regionHazardById: new Map(
      regionsParsed.records.map((record) => [record.id, record.simulationProfile?.hazardPressure ?? 35])
    )
  };

  return cachedSpawnContent;
}
