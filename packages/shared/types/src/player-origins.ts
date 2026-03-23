import type {
  PlayerAttributeAdjustments,
  PlayerAttributes,
  PlayerCoreData,
  PlayerOriginProfileState,
  PlayerProgression,
  PlayerResourceGrowthVector,
  PlayerSexId
} from "./contracts.js";

export interface PlayerLineageProfileRecord {
  id: string;
  name: string;
  resourceBaseAdjustments: PlayerResourceGrowthVector;
  resourceGrowthPerLevel: PlayerResourceGrowthVector;
  sexAttributeAdjustments: Record<PlayerSexId, PlayerAttributeAdjustments>;
  notes: string[];
}

export interface PlayerClassProfileRecord {
  id: string;
  name: string;
  resourceGrowthPerClassLevel: PlayerResourceGrowthVector;
  notes: string[];
}

export const BASE_PLAYER_RESOURCE_MAXIMA: PlayerResourceGrowthVector = {
  hp: 120,
  mp: 60,
  stamina: 100
};

const ZERO_RESOURCE_GROWTH: PlayerResourceGrowthVector = {
  hp: 0,
  mp: 0,
  stamina: 0
};

const NO_ATTRIBUTE_ADJUSTMENTS: Record<PlayerSexId, PlayerAttributeAdjustments> = {
  male: {},
  female: {},
  neutral: {}
};

export const PLAYER_LINEAGE_PROFILES: Record<string, PlayerLineageProfileRecord> = {
  "lineage.human": {
    id: "lineage.human",
    name: "Human",
    resourceBaseAdjustments: { hp: 0, mp: 0, stamina: 0 },
    resourceGrowthPerLevel: { hp: 2, mp: 1, stamina: 2 },
    sexAttributeAdjustments: {
      male: { STR: 1, AGI: -1 },
      female: { STR: -1, AGI: 1 },
      neutral: {}
    },
    notes: [
      "Human growth stays broadly balanced across all three pools.",
      "Only humans currently use a small sex-based STR/AGI tradeoff, and the total adjustment stays net-neutral."
    ]
  },
  "lineage.elf": {
    id: "lineage.elf",
    name: "Elf",
    resourceBaseAdjustments: { hp: -8, mp: 10, stamina: -4 },
    resourceGrowthPerLevel: { hp: 1, mp: 2, stamina: 1 },
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS,
    notes: [
      "Elven profiles favor magical endurance over raw bodily durability.",
      "No gameplay-sex variance is applied to elves."
    ]
  },
  "lineage.dwarf": {
    id: "lineage.dwarf",
    name: "Dwarf",
    resourceBaseAdjustments: { hp: 10, mp: -6, stamina: 8 },
    resourceGrowthPerLevel: { hp: 3, mp: 0, stamina: 2 },
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS,
    notes: [
      "Dwarven growth favors endurance-heavy pools.",
      "No gameplay-sex variance is applied to dwarves."
    ]
  },
  "lineage.halfling": {
    id: "lineage.halfling",
    name: "Halfling",
    resourceBaseAdjustments: { hp: -4, mp: 2, stamina: 6 },
    resourceGrowthPerLevel: { hp: 1, mp: 1, stamina: 3 },
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS,
    notes: [
      "Halfling growth leans toward stamina and efficiency rather than raw HP.",
      "No gameplay-sex variance is applied to halflings."
    ]
  },
  "lineage.gnome": {
    id: "lineage.gnome",
    name: "Gnome",
    resourceBaseAdjustments: { hp: -6, mp: 8, stamina: 0 },
    resourceGrowthPerLevel: { hp: 1, mp: 2, stamina: 1 },
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS,
    notes: [
      "Gnomish growth favors cognition and reserve over raw durability.",
      "No gameplay-sex variance is applied to gnomes."
    ]
  },
  "lineage.orc": {
    id: "lineage.orc",
    name: "Orc",
    resourceBaseAdjustments: { hp: 8, mp: -4, stamina: 6 },
    resourceGrowthPerLevel: { hp: 3, mp: 0, stamina: 2 },
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS,
    notes: [
      "Orc growth favors pressure-tolerant physical pools without adding bespoke sex variance.",
      "No gameplay-sex variance is applied to orcs."
    ]
  },
  "lineage.goblin": {
    id: "lineage.goblin",
    name: "Goblin",
    resourceBaseAdjustments: { hp: -8, mp: 2, stamina: 10 },
    resourceGrowthPerLevel: { hp: 1, mp: 1, stamina: 3 },
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS,
    notes: [
      "Goblin growth leans toward speed, resilience, and sustained motion rather than HP bulk.",
      "No gameplay-sex variance is applied to goblins."
    ]
  },
  "lineage.troll": {
    id: "lineage.troll",
    name: "Troll",
    resourceBaseAdjustments: { hp: 16, mp: -8, stamina: 4 },
    resourceGrowthPerLevel: { hp: 4, mp: 0, stamina: 1 },
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS,
    notes: [
      "Troll growth favors extreme HP expansion with lower magical reserve.",
      "No gameplay-sex variance is applied to trolls."
    ]
  },
  "lineage.merfolk": {
    id: "lineage.merfolk",
    name: "Merfolk",
    resourceBaseAdjustments: { hp: -2, mp: 4, stamina: 4 },
    resourceGrowthPerLevel: { hp: 1, mp: 2, stamina: 2 },
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS,
    notes: [
      "Merfolk growth stays balanced between magical reserve and travel endurance.",
      "No gameplay-sex variance is applied to merfolk."
    ]
  }
};

export const PLAYER_CLASS_PROFILES: Record<string, PlayerClassProfileRecord> = {
  "class.explorer": {
    id: "class.explorer",
    name: "Explorer",
    resourceGrowthPerClassLevel: { hp: 1, mp: 1, stamina: 2 },
    notes: ["Explorer class growth supports travel stamina and broad utility."]
  },
  "class.warrior": {
    id: "class.warrior",
    name: "Warrior",
    resourceGrowthPerClassLevel: { hp: 3, mp: 0, stamina: 2 },
    notes: ["Warrior class growth prioritizes frontline durability."]
  },
  "class.arcanist": {
    id: "class.arcanist",
    name: "Arcanist",
    resourceGrowthPerClassLevel: { hp: 0, mp: 3, stamina: 0 },
    notes: ["Arcanist class growth pushes magical reserves over physical output."]
  },
  "class.artisan": {
    id: "class.artisan",
    name: "Artisan",
    resourceGrowthPerClassLevel: { hp: 1, mp: 1, stamina: 1 },
    notes: ["Artisan class growth remains evenly distributed."]
  },
  "class.merchant": {
    id: "class.merchant",
    name: "Merchant",
    resourceGrowthPerClassLevel: { hp: 1, mp: 1, stamina: 1 },
    notes: ["Merchant class growth favors balanced daily endurance."]
  },
  "class.mariner": {
    id: "class.mariner",
    name: "Mariner",
    resourceGrowthPerClassLevel: { hp: 1, mp: 0, stamina: 3 },
    notes: ["Mariner class growth favors sea-going stamina and steady effort."]
  }
};

function addResourceVectors(
  left: PlayerResourceGrowthVector,
  right: PlayerResourceGrowthVector
): PlayerResourceGrowthVector {
  return {
    hp: left.hp + right.hp,
    mp: left.mp + right.mp,
    stamina: left.stamina + right.stamina
  };
}

function scaleResourceVector(
  vector: PlayerResourceGrowthVector,
  factor: number
): PlayerResourceGrowthVector {
  return {
    hp: vector.hp * factor,
    mp: vector.mp * factor,
    stamina: vector.stamina * factor
  };
}

export function getPlayerLineageProfile(lineageId: string): PlayerLineageProfileRecord | undefined {
  return PLAYER_LINEAGE_PROFILES[lineageId];
}

export function getPlayerClassProfile(classId: string | null): PlayerClassProfileRecord | undefined {
  if (!classId) {
    return undefined;
  }

  return PLAYER_CLASS_PROFILES[classId];
}

export function resolvePlayerOriginProfile(
  coreData: Pick<PlayerCoreData, "lineageId" | "classId" | "sexId">,
  progression: Pick<PlayerProgression, "level" | "classLevel">
): PlayerOriginProfileState {
  const lineageProfile = getPlayerLineageProfile(coreData.lineageId);
  const classProfile = getPlayerClassProfile(coreData.classId);
  const levelGrowthSteps = Math.max(progression.level - 1, 0);
  const classLevel = Math.max(progression.classLevel, 0);

  const lineageBaseAdjustments = lineageProfile?.resourceBaseAdjustments ?? ZERO_RESOURCE_GROWTH;
  const lineageGrowth = lineageProfile?.resourceGrowthPerLevel ?? ZERO_RESOURCE_GROWTH;
  const classGrowth = classProfile?.resourceGrowthPerClassLevel ?? ZERO_RESOURCE_GROWTH;
  const attributeAdjustments = lineageProfile?.sexAttributeAdjustments[coreData.sexId] ?? {};

  const resolvedResourceMaxima = addResourceVectors(
    addResourceVectors(BASE_PLAYER_RESOURCE_MAXIMA, lineageBaseAdjustments),
    addResourceVectors(scaleResourceVector(lineageGrowth, levelGrowthSteps), scaleResourceVector(classGrowth, classLevel))
  );

  const notes = [
    ...(lineageProfile?.notes ?? [`Missing lineage profile for ${coreData.lineageId}`]),
    ...(classProfile?.notes ?? (coreData.classId ? [`Missing class profile for ${coreData.classId}`] : ["No class growth applied."]))
  ];

  return {
    lineageId: coreData.lineageId,
    lineageLabel: lineageProfile?.name ?? "Unknown Lineage",
    classId: coreData.classId,
    classLabel: classProfile?.name ?? null,
    sexId: coreData.sexId,
    attributeAdjustments,
    resourceBaseAdjustments: lineageBaseAdjustments,
    lineageResourceGrowthPerLevel: lineageGrowth,
    classResourceGrowthPerClassLevel: classGrowth,
    resolvedResourceMaxima,
    notes
  };
}

export function applyAttributeAdjustments(
  baseAttributes: PlayerAttributes,
  adjustments: PlayerAttributeAdjustments
): PlayerAttributes {
  return {
    STR: baseAttributes.STR + (adjustments.STR ?? 0),
    DEX: baseAttributes.DEX + (adjustments.DEX ?? 0),
    AGI: baseAttributes.AGI + (adjustments.AGI ?? 0),
    CON: baseAttributes.CON + (adjustments.CON ?? 0),
    VIT: baseAttributes.VIT + (adjustments.VIT ?? 0),
    WIS: baseAttributes.WIS + (adjustments.WIS ?? 0),
    INT: baseAttributes.INT + (adjustments.INT ?? 0),
    SPT: baseAttributes.SPT + (adjustments.SPT ?? 0),
    CHA: baseAttributes.CHA + (adjustments.CHA ?? 0)
  };
}
