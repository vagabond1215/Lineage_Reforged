import rolesJson from "../../../../content/base/game/combat_roles.json" with { type: "json" };
import presetsJson from "../../../../content/base/game/tactics_presets.json" with { type: "json" };
import type { CombatRoleRecord, TacticsPresetRecord } from "../../../../shared/types/src/index.js";

type CachedCombatContent = {
  roleRecords: CombatRoleRecord[];
  roleById: Map<string, CombatRoleRecord>;
  presetRecords: TacticsPresetRecord[];
  presetById: Map<string, TacticsPresetRecord>;
};

let cachedCombatContent: CachedCombatContent | null = null;

export function loadCombatFoundationContent(): CachedCombatContent {
  if (cachedCombatContent) {
    return cachedCombatContent;
  }

  const rolesParsed = rolesJson as { records: CombatRoleRecord[] };
  const presetsParsed = presetsJson as { records: TacticsPresetRecord[] };

  cachedCombatContent = {
    roleRecords: rolesParsed.records,
    roleById: new Map(rolesParsed.records.map((record) => [record.id, record])),
    presetRecords: presetsParsed.records,
    presetById: new Map(presetsParsed.records.map((record) => [record.id, record]))
  };

  return cachedCombatContent;
}
