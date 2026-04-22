import type {
  PlayerAttributeKey,
  PlayerAttributeAdjustments,
  PlayerAttributes,
  PlayerCoreData,
  PlayerLegacyGrowthState,
  PlayerOriginProfileState,
  PlayerProgression,
  PlayerResourceGrowthVector,
  PlayerSexId
} from "./contracts.js";

export type PlayerFoodTagBiasId =
  | "protein"
  | "carbs"
  | "fat"
  | "greens"
  | "fruit"
  | "grain"
  | "meat"
  | "fish"
  | "fungus"
  | "dairy"
  | "alcohol"
  | "water_rich";

export interface PlayerLineageMetabolicProfileRecord {
  calorieEfficiency: number;
  proteinRecoveryEfficiency: number;
  carbToStaminaEfficiency: number;
  fatToReserveEfficiency: number;
  hydrationRetention: number;
  dehydrationSensitivity: number;
  intoxicationSensitivity: number;
  deficiencyPenaltyScale: number;
  atrophySensitivity: number;
  foodTagBiases: Partial<Record<PlayerFoodTagBiasId, number>>;
}

export interface PlayerLineageProfileRecord {
  id: string;
  name: string;
  resourceBaseAdjustments: PlayerResourceGrowthVector;
  resourceGrowthPerLevel: PlayerResourceGrowthVector;
  metabolicProfile: PlayerLineageMetabolicProfileRecord;
  attributeGrowthBiases: Partial<Record<PlayerAttributeKey, number>>;
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
  female: { AGI: 1, STR: -1 },
  neutral: {}
};

const DEFAULT_METABOLIC_PROFILE: PlayerLineageMetabolicProfileRecord = {
  calorieEfficiency: 1,
  proteinRecoveryEfficiency: 1,
  carbToStaminaEfficiency: 1,
  fatToReserveEfficiency: 1,
  hydrationRetention: 1,
  dehydrationSensitivity: 1,
  intoxicationSensitivity: 1,
  deficiencyPenaltyScale: 1,
  atrophySensitivity: 1,
  foodTagBiases: {}
};

const DEFAULT_ATTRIBUTE_GROWTH_BIASES: Partial<Record<PlayerAttributeKey, number>> = {};

type PlayableLineageSeed = Omit<PlayerLineageProfileRecord, "sexAttributeAdjustments">;

const LINEAGE_ANCESTRY: Record<string, PlayableLineageSeed> = {
  "lineage.human": {
    id: "lineage.human",
    name: "Human",
    resourceBaseAdjustments: { hp: 0, mp: 0, stamina: 0 },
    resourceGrowthPerLevel: { hp: 2, mp: 1, stamina: 2 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      foodTagBiases: { grain: 1.04, protein: 1.02, fruit: 1.02 }
    },
    attributeGrowthBiases: {
      CON: 1.02,
      WIS: 1.02
    },
    notes: [
      "Human growth stays balanced across physical resilience, reserve, and recovery.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
  },
  "lineage.elf": {
    id: "lineage.elf",
    name: "Elf",
    resourceBaseAdjustments: { hp: -8, mp: 10, stamina: -4 },
    resourceGrowthPerLevel: { hp: 1, mp: 2, stamina: 1 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      carbToStaminaEfficiency: 1.08,
      hydrationRetention: 1.08,
      intoxicationSensitivity: 1.08,
      foodTagBiases: { fruit: 1.08, greens: 1.08, fish: 1.03, alcohol: 0.94 }
    },
    attributeGrowthBiases: {
      AGI: 1.05,
      DEX: 1.04,
      CON: 0.97
    },
    notes: [
      "Elves favor magical reserve, finesse, and long-horizon control over raw durability.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
  },
  "lineage.dark_elf": {
    id: "lineage.dark_elf",
    name: "Dark Elf",
    resourceBaseAdjustments: { hp: -4, mp: 8, stamina: 2 },
    resourceGrowthPerLevel: { hp: 1, mp: 2, stamina: 2 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      carbToStaminaEfficiency: 1.04,
      hydrationRetention: 0.98,
      intoxicationSensitivity: 1.02,
      foodTagBiases: { fungus: 1.08, fish: 1.04, greens: 1.02, alcohol: 0.96 }
    },
    attributeGrowthBiases: {
      AGI: 1.03,
      INT: 1.04,
      SPT: 1.03
    },
    notes: [
      "Dark elves balance magical depth with better travel endurance than surface elves.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
  },
  "lineage.dwarf": {
    id: "lineage.dwarf",
    name: "Dwarf",
    resourceBaseAdjustments: { hp: 10, mp: -6, stamina: 8 },
    resourceGrowthPerLevel: { hp: 3, mp: 0, stamina: 2 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      proteinRecoveryEfficiency: 1.08,
      fatToReserveEfficiency: 1.08,
      hydrationRetention: 1.05,
      intoxicationSensitivity: 0.92,
      deficiencyPenaltyScale: 0.96,
      foodTagBiases: { meat: 1.08, dairy: 1.08, grain: 1.04, alcohol: 1.06 }
    },
    attributeGrowthBiases: {
      STR: 1.04,
      CON: 1.06,
      AGI: 0.96
    },
    notes: [
      "Dwarven growth favors steady toughness, labor endurance, and grounded momentum.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
  },
  "lineage.gnome": {
    id: "lineage.gnome",
    name: "Gnome",
    resourceBaseAdjustments: { hp: -10, mp: 12, stamina: -2 },
    resourceGrowthPerLevel: { hp: 1, mp: 3, stamina: 1 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      calorieEfficiency: 0.98,
      carbToStaminaEfficiency: 1.04,
      proteinRecoveryEfficiency: 0.98,
      intoxicationSensitivity: 1.04,
      foodTagBiases: { fungus: 1.06, dairy: 1.03, fruit: 1.03 }
    },
    attributeGrowthBiases: {
      DEX: 1.04,
      INT: 1.05,
      STR: 0.96
    },
    notes: [
      "Gnomes favor sharp reserve growth, nimble motion, and inventive problem-solving over raw bodily power.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
  },
  "lineage.halfling": {
    id: "lineage.halfling",
    name: "Halfling",
    resourceBaseAdjustments: { hp: -4, mp: 0, stamina: 8 },
    resourceGrowthPerLevel: { hp: 1, mp: 1, stamina: 3 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      calorieEfficiency: 1.03,
      carbToStaminaEfficiency: 1.08,
      proteinRecoveryEfficiency: 0.98,
      intoxicationSensitivity: 1.1,
      foodTagBiases: { grain: 1.08, fruit: 1.06, dairy: 1.04, alcohol: 0.94 }
    },
    attributeGrowthBiases: {
      AGI: 1.05,
      VIT: 1.03,
      STR: 0.97
    },
    notes: [
      "Halflings favor evasive endurance, steady travel stamina, and quiet resilience rather than direct physical force.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
  },
  "lineage.orc": {
    id: "lineage.orc",
    name: "Orc",
    resourceBaseAdjustments: { hp: 8, mp: -4, stamina: 6 },
    resourceGrowthPerLevel: { hp: 3, mp: 0, stamina: 2 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      proteinRecoveryEfficiency: 1.06,
      fatToReserveEfficiency: 1.04,
      hydrationRetention: 0.96,
      deficiencyPenaltyScale: 1.04,
      foodTagBiases: { meat: 1.08, fat: 1.06, grain: 1.02, greens: 0.96 }
    },
    attributeGrowthBiases: {
      STR: 1.06,
      CON: 1.03,
      WIS: 0.96
    },
    notes: [
      "Orc ancestry favors pressure-tolerant physical pools without extreme magical reserves.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
  },
  "lineage.goblin": {
    id: "lineage.goblin",
    name: "Goblin",
    resourceBaseAdjustments: { hp: -8, mp: 2, stamina: 10 },
    resourceGrowthPerLevel: { hp: 1, mp: 1, stamina: 3 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      calorieEfficiency: 1.02,
      carbToStaminaEfficiency: 1.05,
      hydrationRetention: 0.95,
      deficiencyPenaltyScale: 1.03,
      foodTagBiases: { grain: 1.04, fungus: 1.05, fish: 1.03 }
    },
    attributeGrowthBiases: {
      AGI: 1.06,
      DEX: 1.03,
      CON: 0.96
    },
    notes: [
      "Goblin ancestry leans toward motion, agility, and repeated exertion over direct toughness.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
  },
  "lineage.troll": {
    id: "lineage.troll",
    name: "Troll",
    resourceBaseAdjustments: { hp: 16, mp: -8, stamina: 4 },
    resourceGrowthPerLevel: { hp: 4, mp: 0, stamina: 1 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      calorieEfficiency: 1.04,
      proteinRecoveryEfficiency: 1.1,
      hydrationRetention: 0.94,
      deficiencyPenaltyScale: 1.08,
      atrophySensitivity: 1.08,
      foodTagBiases: { meat: 1.1, fish: 1.05, fruit: 0.94 }
    },
    attributeGrowthBiases: {
      STR: 1.08,
      VIT: 1.05,
      AGI: 0.94
    },
    notes: [
      "Troll ancestry drives extreme HP expansion and blunt staying power.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
  },
  "lineage.merfolk": {
    id: "lineage.merfolk",
    name: "Merfolk",
    resourceBaseAdjustments: { hp: -2, mp: 4, stamina: 4 },
    resourceGrowthPerLevel: { hp: 1, mp: 2, stamina: 2 },
    metabolicProfile: {
      ...DEFAULT_METABOLIC_PROFILE,
      hydrationRetention: 1.12,
      dehydrationSensitivity: 0.92,
      carbToStaminaEfficiency: 1.03,
      foodTagBiases: { fish: 1.08, water_rich: 1.08, greens: 1.03, alcohol: 0.94 }
    },
    attributeGrowthBiases: {
      AGI: 1.03,
      WIS: 1.03,
      CON: 0.98
    },
    notes: [
      "Merfolk ancestry balances reserve and endurance, especially for aquatic travel and rhythm.",
      "Hair, skin, and eye color remain visual only, while stature and build can tune starting attributes in the creator."
    ]
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

function averageResourceVectors(
  left: PlayerResourceGrowthVector,
  right: PlayerResourceGrowthVector
): PlayerResourceGrowthVector {
  return {
    hp: Math.floor((left.hp + right.hp) / 2),
    mp: Math.floor((left.mp + right.mp) / 2),
    stamina: Math.floor((left.stamina + right.stamina) / 2)
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

function createPlayableLineage(seed: PlayableLineageSeed): PlayerLineageProfileRecord {
  return {
    ...seed,
    attributeGrowthBiases: seed.attributeGrowthBiases ?? DEFAULT_ATTRIBUTE_GROWTH_BIASES,
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS
  };
}

function averageAttributeGrowthBiases(
  left: Partial<Record<PlayerAttributeKey, number>>,
  right: Partial<Record<PlayerAttributeKey, number>>
): Partial<Record<PlayerAttributeKey, number>> {
  const keys: PlayerAttributeKey[] = ["STR", "DEX", "AGI", "CON", "VIT", "WIS", "INT", "SPT", "CHA"];
  return keys.reduce<Partial<Record<PlayerAttributeKey, number>>>((result, key) => {
    const leftValue = left[key] ?? 1;
    const rightValue = right[key] ?? 1;
    const averaged = Number(((leftValue + rightValue) / 2).toFixed(3));
    if (Math.abs(averaged - 1) > 0.0001) {
      result[key] = averaged;
    }
    return result;
  }, {});
}

function createHybridLineage(params: {
  id: string;
  name: string;
  parentLineageIds: [string, string];
  resourceBaseModifiers?: PlayerResourceGrowthVector;
  resourceGrowthModifiers?: PlayerResourceGrowthVector;
  notes: string[];
}): PlayerLineageProfileRecord {
  const [leftId, rightId] = params.parentLineageIds;
  const left = LINEAGE_ANCESTRY[leftId];
  const right = LINEAGE_ANCESTRY[rightId];

  if (!left || !right) {
    throw new Error(`Missing hybrid lineage parent data for ${params.id}`);
  }

  return createPlayableLineage({
    id: params.id,
    name: params.name,
    resourceBaseAdjustments: addResourceVectors(
      averageResourceVectors(left.resourceBaseAdjustments, right.resourceBaseAdjustments),
      params.resourceBaseModifiers ?? ZERO_RESOURCE_GROWTH
    ),
    resourceGrowthPerLevel: addResourceVectors(
      averageResourceVectors(left.resourceGrowthPerLevel, right.resourceGrowthPerLevel),
      params.resourceGrowthModifiers ?? ZERO_RESOURCE_GROWTH
    ),
    notes: [
      `${params.name} resource growth is derived from averaged ${left.name} and ${right.name} ancestry, then tuned with only minor hybrid modifiers.`,
      ...params.notes
    ],
    attributeGrowthBiases: averageAttributeGrowthBiases(left.attributeGrowthBiases, right.attributeGrowthBiases),
    metabolicProfile: {
      calorieEfficiency: Number(((left.metabolicProfile.calorieEfficiency + right.metabolicProfile.calorieEfficiency) / 2).toFixed(3)),
      proteinRecoveryEfficiency: Number(((left.metabolicProfile.proteinRecoveryEfficiency + right.metabolicProfile.proteinRecoveryEfficiency) / 2).toFixed(3)),
      carbToStaminaEfficiency: Number(((left.metabolicProfile.carbToStaminaEfficiency + right.metabolicProfile.carbToStaminaEfficiency) / 2).toFixed(3)),
      fatToReserveEfficiency: Number(((left.metabolicProfile.fatToReserveEfficiency + right.metabolicProfile.fatToReserveEfficiency) / 2).toFixed(3)),
      hydrationRetention: Number(((left.metabolicProfile.hydrationRetention + right.metabolicProfile.hydrationRetention) / 2).toFixed(3)),
      dehydrationSensitivity: Number(((left.metabolicProfile.dehydrationSensitivity + right.metabolicProfile.dehydrationSensitivity) / 2).toFixed(3)),
      intoxicationSensitivity: Number(((left.metabolicProfile.intoxicationSensitivity + right.metabolicProfile.intoxicationSensitivity) / 2).toFixed(3)),
      deficiencyPenaltyScale: Number(((left.metabolicProfile.deficiencyPenaltyScale + right.metabolicProfile.deficiencyPenaltyScale) / 2).toFixed(3)),
      atrophySensitivity: Number(((left.metabolicProfile.atrophySensitivity + right.metabolicProfile.atrophySensitivity) / 2).toFixed(3)),
      foodTagBiases: {
        ...left.metabolicProfile.foodTagBiases,
        ...right.metabolicProfile.foodTagBiases
      }
    }
  });
}

export const PLAYER_LINEAGE_PROFILES: Record<string, PlayerLineageProfileRecord> = {
  "lineage.human": createPlayableLineage(LINEAGE_ANCESTRY["lineage.human"]!),
  "lineage.elf": createPlayableLineage(LINEAGE_ANCESTRY["lineage.elf"]!),
  "lineage.dark_elf": createPlayableLineage(LINEAGE_ANCESTRY["lineage.dark_elf"]!),
  "lineage.dwarf": createPlayableLineage(LINEAGE_ANCESTRY["lineage.dwarf"]!),
  "lineage.gnome": createPlayableLineage(LINEAGE_ANCESTRY["lineage.gnome"]!),
  "lineage.halfling": createPlayableLineage(LINEAGE_ANCESTRY["lineage.halfling"]!),
  "lineage.half_troll": createHybridLineage({
    id: "lineage.half_troll",
    name: "Half-Troll",
    parentLineageIds: ["lineage.human", "lineage.troll"],
    resourceBaseModifiers: { hp: -1, mp: 1, stamina: 1 },
    resourceGrowthModifiers: { hp: 0, mp: 1, stamina: 0 },
    notes: [
      "Half-trolls retain heavy physical staying power without reaching full troll bulk.",
      "Their magical reserve remains lower than most lineages, but not utterly stunted."
    ]
  }),
  "lineage.half_orc": createHybridLineage({
    id: "lineage.half_orc",
    name: "Half-Orc",
    parentLineageIds: ["lineage.human", "lineage.orc"],
    resourceBaseModifiers: { hp: 0, mp: 1, stamina: 1 },
    resourceGrowthModifiers: { hp: 0, mp: 1, stamina: 0 },
    notes: [
      "Half-orcs keep durable frontline pools while remaining more adaptable than full-blooded orcs.",
      "Their stamina curve stays strong enough for martial and frontier paths alike."
    ]
  }),
  "lineage.half_goblin": createHybridLineage({
    id: "lineage.half_goblin",
    name: "Half-Goblin",
    parentLineageIds: ["lineage.human", "lineage.goblin"],
    resourceBaseModifiers: { hp: 0, mp: 1, stamina: 0 },
    resourceGrowthModifiers: { hp: 0, mp: 0, stamina: 1 },
    notes: [
      "Half-goblins keep the mobility and improvisational stamina of goblin ancestry without the same HP penalty.",
      "They are especially well-suited to skirmish, salvage, and routework starts."
    ]
  }),
  "lineage.half_merfolk": createHybridLineage({
    id: "lineage.half_merfolk",
    name: "Half-Merfolk",
    parentLineageIds: ["lineage.human", "lineage.merfolk"],
    resourceBaseModifiers: { hp: 0, mp: 1, stamina: 1 },
    resourceGrowthModifiers: { hp: 0, mp: 1, stamina: 0 },
    notes: [
      "Half-merfolk retain calm reserve growth and fluid travel endurance.",
      "Their pool spread remains balanced enough for either magical or physical paths."
    ]
  })
};

export const PLAYER_CLASS_PROFILES: Record<string, PlayerClassProfileRecord> = {
  "class.explorer": {
    id: "class.explorer",
    name: "Scout",
    resourceGrowthPerClassLevel: { hp: 1, mp: 1, stamina: 2 },
    notes: ["Scout class growth supports movement, observation, and durable travel stamina."]
  },
  "class.warrior": {
    id: "class.warrior",
    name: "Warrior",
    resourceGrowthPerClassLevel: { hp: 3, mp: 0, stamina: 2 },
    notes: ["Warrior class growth prioritizes direct durability and pressure resistance."]
  },
  "class.arcanist": {
    id: "class.arcanist",
    name: "Enchanter",
    resourceGrowthPerClassLevel: { hp: 0, mp: 3, stamina: 1 },
    notes: ["Enchanter class growth pushes reserve, focus, and magical throughput over bodily bulk."]
  },
  "class.artisan": {
    id: "class.artisan",
    name: "Craftsman",
    resourceGrowthPerClassLevel: { hp: 1, mp: 1, stamina: 1 },
    notes: ["Craftsman class growth remains even, favoring steady production over specialization spikes."]
  },
  "class.merchant": {
    id: "class.merchant",
    name: "Trader",
    resourceGrowthPerClassLevel: { hp: 1, mp: 1, stamina: 1 },
    notes: ["Trader class growth favors balanced daily endurance and measured reserve use."]
  },
  "class.mariner": {
    id: "class.mariner",
    name: "Hunter",
    resourceGrowthPerClassLevel: { hp: 1, mp: 0, stamina: 3 },
    notes: ["Hunter class growth favors pursuit stamina, range pressure, and repeat action economy."]
  }
};

export function getPlayerLineageProfile(lineageId: string): PlayerLineageProfileRecord | undefined {
  return PLAYER_LINEAGE_PROFILES[lineageId];
}

export function getPlayerClassProfile(classId: string | null): PlayerClassProfileRecord | undefined {
  if (!classId) {
    return undefined;
  }

  return PLAYER_CLASS_PROFILES[classId];
}

type LegacyGrowthResolverInput =
  | Pick<PlayerProgression, "legacyGrowth">
  | {
      level: number;
      classLevel: number;
    };

function resolveLegacyGrowthLevels(input: LegacyGrowthResolverInput): Pick<
  PlayerLegacyGrowthState,
  "resourceGrowthLevel" | "classLevel"
> {
  if ("legacyGrowth" in input) {
    return {
      resourceGrowthLevel: Math.max(input.legacyGrowth.resourceGrowthLevel, 1),
      classLevel: Math.max(input.legacyGrowth.classLevel, 0)
    };
  }

  return {
    resourceGrowthLevel: Math.max(input.level, 1),
    classLevel: Math.max(input.classLevel, 0)
  };
}

export function resolvePlayerOriginProfile(
  coreData: Pick<PlayerCoreData, "lineageId" | "classId" | "sexId">,
  progression: LegacyGrowthResolverInput
): PlayerOriginProfileState {
  const lineageProfile = getPlayerLineageProfile(coreData.lineageId);
  const classProfile = getPlayerClassProfile(coreData.classId);
  const legacyGrowth = resolveLegacyGrowthLevels(progression);
  const levelGrowthSteps = Math.max(legacyGrowth.resourceGrowthLevel - 1, 0);
  const classLevel = legacyGrowth.classLevel;

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
