import { readFileSync } from "node:fs";
import type { CombatRoleRecord, TacticsPresetRecord } from "../../../../shared/types/src/index.js";

type CachedCombatContent = {
  roleRecords: CombatRoleRecord[];
  roleById: Map<string, CombatRoleRecord>;
  presetRecords: TacticsPresetRecord[];
  presetById: Map<string, TacticsPresetRecord>;
};

let cachedCombatContent: CachedCombatContent | null = null;

function readJson<T>(relativePath: string): T {
  const raw = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  return JSON.parse(raw) as T;
}

export function loadCombatFoundationContent(): CachedCombatContent {
  if (cachedCombatContent) {
    return cachedCombatContent;
  }

  const rolesParsed = readJson<{ records: CombatRoleRecord[] }>("../../../../content/base/game/combat_roles.json");
  const presetsParsed = readJson<{ records: TacticsPresetRecord[] }>(
    "../../../../content/base/game/tactics_presets.json"
  );

  cachedCombatContent = {
    roleRecords: rolesParsed.records,
    roleById: new Map(rolesParsed.records.map((record) => [record.id, record])),
    presetRecords: presetsParsed.records,
    presetById: new Map(presetsParsed.records.map((record) => [record.id, record]))
  };

  return cachedCombatContent;
}
