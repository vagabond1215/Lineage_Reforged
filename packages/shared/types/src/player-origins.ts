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

type PlayableLineageSeed = Omit<PlayerLineageProfileRecord, "sexAttributeAdjustments">;

const LINEAGE_ANCESTRY: Record<string, PlayableLineageSeed> = {
  "lineage.human": {
    id: "lineage.human",
    name: "Human",
    resourceBaseAdjustments: { hp: 0, mp: 0, stamina: 0 },
    resourceGrowthPerLevel: { hp: 2, mp: 1, stamina: 2 },
    notes: [
      "Human growth stays balanced across physical resilience, reserve, and recovery.",
      "Identity selections are visual only and do not change gameplay stats."
    ]
  },
  "lineage.elf": {
    id: "lineage.elf",
    name: "Elf",
    resourceBaseAdjustments: { hp: -8, mp: 10, stamina: -4 },
    resourceGrowthPerLevel: { hp: 1, mp: 2, stamina: 1 },
    notes: [
      "Elves favor magical reserve, finesse, and long-horizon control over raw durability.",
      "Identity selections are visual only and do not change gameplay stats."
    ]
  },
  "lineage.dark_elf": {
    id: "lineage.dark_elf",
    name: "Dark Elf",
    resourceBaseAdjustments: { hp: -4, mp: 8, stamina: 2 },
    resourceGrowthPerLevel: { hp: 1, mp: 2, stamina: 2 },
    notes: [
      "Dark elves balance magical depth with better travel endurance than surface elves.",
      "Identity selections are visual only and do not change gameplay stats."
    ]
  },
  "lineage.dwarf": {
    id: "lineage.dwarf",
    name: "Dwarf",
    resourceBaseAdjustments: { hp: 10, mp: -6, stamina: 8 },
    resourceGrowthPerLevel: { hp: 3, mp: 0, stamina: 2 },
    notes: [
      "Dwarven growth favors steady toughness, labor endurance, and grounded momentum.",
      "Identity selections are visual only and do not change gameplay stats."
    ]
  },
  "lineage.orc": {
    id: "lineage.orc",
    name: "Orc",
    resourceBaseAdjustments: { hp: 8, mp: -4, stamina: 6 },
    resourceGrowthPerLevel: { hp: 3, mp: 0, stamina: 2 },
    notes: [
      "Orc ancestry favors pressure-tolerant physical pools without extreme magical reserves.",
      "Identity selections are visual only and do not change gameplay stats."
    ]
  },
  "lineage.goblin": {
    id: "lineage.goblin",
    name: "Goblin",
    resourceBaseAdjustments: { hp: -8, mp: 2, stamina: 10 },
    resourceGrowthPerLevel: { hp: 1, mp: 1, stamina: 3 },
    notes: [
      "Goblin ancestry leans toward motion, agility, and repeated exertion over direct toughness.",
      "Identity selections are visual only and do not change gameplay stats."
    ]
  },
  "lineage.troll": {
    id: "lineage.troll",
    name: "Troll",
    resourceBaseAdjustments: { hp: 16, mp: -8, stamina: 4 },
    resourceGrowthPerLevel: { hp: 4, mp: 0, stamina: 1 },
    notes: [
      "Troll ancestry drives extreme HP expansion and blunt staying power.",
      "Identity selections are visual only and do not change gameplay stats."
    ]
  },
  "lineage.merfolk": {
    id: "lineage.merfolk",
    name: "Merfolk",
    resourceBaseAdjustments: { hp: -2, mp: 4, stamina: 4 },
    resourceGrowthPerLevel: { hp: 1, mp: 2, stamina: 2 },
    notes: [
      "Merfolk ancestry balances reserve and endurance, especially for aquatic travel and rhythm.",
      "Identity selections are visual only and do not change gameplay stats."
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
    sexAttributeAdjustments: NO_ATTRIBUTE_ADJUSTMENTS
  };
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
    ]
  });
}

export const PLAYER_LINEAGE_PROFILES: Record<string, PlayerLineageProfileRecord> = {
  "lineage.human": createPlayableLineage(LINEAGE_ANCESTRY["lineage.human"]),
  "lineage.elf": createPlayableLineage(LINEAGE_ANCESTRY["lineage.elf"]),
  "lineage.dark_elf": createPlayableLineage(LINEAGE_ANCESTRY["lineage.dark_elf"]),
  "lineage.dwarf": createPlayableLineage(LINEAGE_ANCESTRY["lineage.dwarf"]),
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
    notes: ["Scout path growth supports movement, observation, and durable travel stamina."]
  },
  "class.warrior": {
    id: "class.warrior",
    name: "Warrior",
    resourceGrowthPerClassLevel: { hp: 3, mp: 0, stamina: 2 },
    notes: ["Warrior path growth prioritizes direct durability and pressure resistance."]
  },
  "class.arcanist": {
    id: "class.arcanist",
    name: "Enchanter",
    resourceGrowthPerClassLevel: { hp: 0, mp: 3, stamina: 1 },
    notes: ["Enchanter path growth pushes reserve, focus, and magical throughput over bodily bulk."]
  },
  "class.artisan": {
    id: "class.artisan",
    name: "Craftsman",
    resourceGrowthPerClassLevel: { hp: 1, mp: 1, stamina: 1 },
    notes: ["Craftsman path growth remains even, favoring steady production over specialization spikes."]
  },
  "class.merchant": {
    id: "class.merchant",
    name: "Trader",
    resourceGrowthPerClassLevel: { hp: 1, mp: 1, stamina: 1 },
    notes: ["Trader path growth favors balanced daily endurance and measured reserve use."]
  },
  "class.mariner": {
    id: "class.mariner",
    name: "Hunter",
    resourceGrowthPerClassLevel: { hp: 1, mp: 0, stamina: 3 },
    notes: ["Hunter path growth favors pursuit stamina, range pressure, and repeat action economy."]
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
