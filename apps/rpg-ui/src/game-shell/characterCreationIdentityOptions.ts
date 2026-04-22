import {
  PLAYER_LINEAGE_PROFILES,
  type PlayerAttributeAdjustments,
  type PlayerAttributeKey,
  type PlayerIdentityAgeBandId,
  type PlayerIdentityFocusId,
  type PlayerIdentityNatureId,
  type PlayerIdentityPhysiqueId,
  type PlayerSexId
} from "../../../../packages/shared/types/src/index.js";
import { CHARACTER_ATTRIBUTE_ORDER } from "./characterAttributes.js";

export type HeightBandId = "short" | "normal" | "tall";
export type AgeBandId = PlayerIdentityAgeBandId;
export type ResolvedCharacterCreationSexId = Extract<PlayerSexId, "male" | "female">;
type LegacyAgeRangeBandId = "young_adult" | "prime_age" | "middle_aged";
type IdentityAgeRange = [number, number];
type LegacyLineageAgeRangeProfile = Record<
  ResolvedCharacterCreationSexId,
  Record<LegacyAgeRangeBandId, IdentityAgeRange>
>;
type LineageAgeRangeProfile = Record<
  ResolvedCharacterCreationSexId,
  Record<AgeBandId, IdentityAgeRange>
>;
export type ProfileWeightMap = Partial<Record<PlayerAttributeKey, number>>;

export interface SharedModifierOption<TId extends string> {
  id: TId;
  label: string;
  description: string;
  attributeAdjustments: PlayerAttributeAdjustments;
  modifierText: string;
}

export interface HeightBandOption extends SharedModifierOption<HeightBandId> {}

export interface AgeBandOption extends SharedModifierOption<AgeBandId> {}

export interface PhysiqueOption {
  id: PlayerIdentityPhysiqueId;
  label: string;
  description: string;
  baselinePhysiqueShare: number;
  weights: ProfileWeightMap;
  emphasisText: string;
}

export interface NatureOption {
  id: PlayerIdentityNatureId;
  label: string;
  description: string;
  weights: ProfileWeightMap;
  emphasisText: string;
}

export interface FocusOption {
  id: PlayerIdentityFocusId;
  label: string;
  description: string;
  physiqueShareShift: number;
  modifierText: string;
}

export interface SexOption extends SharedModifierOption<ResolvedCharacterCreationSexId> {
  symbol: string;
  tooltipText: string;
}

export interface ResolvedIdentityModifierSelections {
  sex: SexOption;
  heightBand: HeightBandOption | null;
  ageBand: AgeBandOption | null;
  physique: PhysiqueOption | null;
  nature: NatureOption | null;
  focus: FocusOption | null;
}

function formatCompactAttributeAdjustments(
  adjustments: PlayerAttributeAdjustments
): string {
  const positive = CHARACTER_ATTRIBUTE_ORDER.flatMap((attributeKey) => {
    const value = adjustments[attributeKey] ?? 0;
    return value > 0 ? [`+${value} ${attributeKey}`] : [];
  });
  const negative = CHARACTER_ATTRIBUTE_ORDER.flatMap((attributeKey) => {
    const value = adjustments[attributeKey] ?? 0;
    return value < 0 ? [`${value} ${attributeKey}`] : [];
  });
  const parts = [...positive, ...negative];

  return parts.length > 0 ? parts.join(" / ") : "No attribute change";
}

function formatSentenceAttributeAdjustments(
  adjustments: PlayerAttributeAdjustments
): string {
  const positive = CHARACTER_ATTRIBUTE_ORDER.flatMap((attributeKey) => {
    const value = adjustments[attributeKey] ?? 0;
    return value > 0 ? [`+${value} ${attributeKey}`] : [];
  });
  const negative = CHARACTER_ATTRIBUTE_ORDER.flatMap((attributeKey) => {
    const value = adjustments[attributeKey] ?? 0;
    return value < 0 ? [`${value} ${attributeKey}`] : [];
  });
  const parts = [...positive, ...negative];

  return parts.length > 0 ? `${parts.join(", ")}.` : "No attribute change.";
}

function createModifierOption<TId extends string>(option: {
  id: TId;
  label: string;
  description: string;
  attributeAdjustments: PlayerAttributeAdjustments;
}): SharedModifierOption<TId> {
  return {
    ...option,
    modifierText: formatCompactAttributeAdjustments(option.attributeAdjustments)
  };
}

function addWeights(
  weights: ProfileWeightMap,
  attributeKeys: PlayerAttributeKey[],
  amount: number
): ProfileWeightMap {
  const next = { ...weights };

  for (const attributeKey of attributeKeys) {
    next[attributeKey] = (next[attributeKey] ?? 0) + amount;
  }

  return next;
}

function createWeightedProfileMap(option: {
  anchors?: PlayerAttributeKey[];
  supports?: PlayerAttributeKey[];
  overlaps?: PlayerAttributeKey[];
}): ProfileWeightMap {
  let weights: ProfileWeightMap = {};
  weights = addWeights(weights, option.anchors ?? [], 4);
  weights = addWeights(weights, option.supports ?? [], 2);
  weights = addWeights(weights, option.overlaps ?? [], 1);
  return weights;
}

function formatProfileEmphasis(weights: ProfileWeightMap): string {
  const emphasized = CHARACTER_ATTRIBUTE_ORDER.filter(
    (attributeKey) => (weights[attributeKey] ?? 0) > 0
  ).sort((left, right) => {
    const delta = (weights[right] ?? 0) - (weights[left] ?? 0);
    return delta !== 0
      ? delta
      : CHARACTER_ATTRIBUTE_ORDER.indexOf(left) -
          CHARACTER_ATTRIBUTE_ORDER.indexOf(right);
  });

  return emphasized.length > 0 ? emphasized.join(" / ") : "No emphasis";
}

function createPhysiqueOption(option: {
  id: PlayerIdentityPhysiqueId;
  label: string;
  description: string;
  baselinePhysiqueShare: number;
  anchors?: PlayerAttributeKey[];
  supports?: PlayerAttributeKey[];
  overlaps?: PlayerAttributeKey[];
}): PhysiqueOption {
  const weights = createWeightedProfileMap(option);

  return {
    id: option.id,
    label: option.label,
    description: option.description,
    baselinePhysiqueShare: option.baselinePhysiqueShare,
    weights,
    emphasisText: formatProfileEmphasis(weights)
  };
}

function createNatureOption(option: {
  id: PlayerIdentityNatureId;
  label: string;
  description: string;
  anchors?: PlayerAttributeKey[];
  supports?: PlayerAttributeKey[];
  overlaps?: PlayerAttributeKey[];
}): NatureOption {
  const weights = createWeightedProfileMap(option);

  return {
    id: option.id,
    label: option.label,
    description: option.description,
    weights,
    emphasisText: formatProfileEmphasis(weights)
  };
}

function createFocusOption(option: {
  id: PlayerIdentityFocusId;
  label: string;
  description: string;
  physiqueShareShift: number;
  modifierText: string;
}): FocusOption {
  return option;
}

function createSexOption(
  lineageId: string,
  sexId: ResolvedCharacterCreationSexId
): SexOption {
  const label = sexId === "female" ? "Female" : "Male";
  const attributeAdjustments =
    PLAYER_LINEAGE_PROFILES[lineageId]?.sexAttributeAdjustments?.[sexId] ??
    PLAYER_LINEAGE_PROFILES["lineage.human"]?.sexAttributeAdjustments?.[sexId] ??
    {};

  return {
    ...createModifierOption({
      id: sexId,
      label,
      description: `${label} presentation.`,
      attributeAdjustments
    }),
    symbol: sexId === "female" ? "\u2640" : "\u2642",
    tooltipText: `${label}. ${formatSentenceAttributeAdjustments(attributeAdjustments)}`
  };
}

const HEIGHT_BAND_OPTIONS: HeightBandOption[] = [
  createModifierOption({
    id: "short",
    label: "Short",
    description: "Shorter and quicker for the lineage.",
    attributeAdjustments: { AGI: 1, STR: -1 }
  }),
  createModifierOption({
    id: "normal",
    label: "Normal",
    description: "Near the usual middle height for this lineage.",
    attributeAdjustments: {}
  }),
  createModifierOption({
    id: "tall",
    label: "Tall",
    description: "Taller and longer-limbed for the lineage.",
    attributeAdjustments: { STR: 1, AGI: -1 }
  })
];

const AGE_BAND_OPTIONS: AgeBandOption[] = [
  createModifierOption({
    id: "young_adult",
    label: "Young Adult",
    description: "Still quick to trust your limbs over reflection, you meet the world with restless energy and the sense that every road remains open.",
    attributeAdjustments: { AGI: 1, WIS: -1 }
  }),
  createModifierOption({
    id: "prime",
    label: "Prime",
    description: "Your body has settled into its strongest years, where effort comes readily and hard lessons have not yet turned every impulse cautious.",
    attributeAdjustments: { STR: 1, AGI: -1 }
  }),
  createModifierOption({
    id: "mature",
    label: "Mature",
    description: "Experience has tempered haste into measured judgment, and you carry yourself like someone who knows what strength is worth spending.",
    attributeAdjustments: { WIS: 1, STR: -1 }
  }),
  createModifierOption({
    id: "senior",
    label: "Senior",
    description: "Years have pared away excess motion, leaving a steadier presence shaped by memory, patience, and reserves guarded with care.",
    attributeAdjustments: { WIS: 1, VIT: -1 }
  })
];

const PHYSIQUE_OPTIONS: PhysiqueOption[] = [
  createPhysiqueOption({
    id: "large",
    label: "Large",
    description: "Broad through the shoulders and heavy in the trunk, you look made for close labor, lifted burdens, and force that cannot be faked.",
    baselinePhysiqueShare: 0.6,
    anchors: ["STR", "CON"],
    supports: ["VIT"]
  }),
  createPhysiqueOption({
    id: "athletic",
    label: "Athletic",
    description: "Your frame carries the memory of drills and repeated exertion, with movement that suggests training, recovery, and clean explosive effort.",
    baselinePhysiqueShare: 0.6,
    anchors: ["STR", "AGI"],
    supports: ["DEX", "CON"],
    overlaps: ["VIT"]
  }),
  createPhysiqueOption({
    id: "hardy",
    label: "Hardy",
    description: "There is a weathered stamina in you, the sort seen in people who keep working after strain has already tested everyone nearby.",
    baselinePhysiqueShare: 0.6,
    anchors: ["CON", "VIT"],
    supports: ["STR"],
    overlaps: ["WIS"]
  }),
  createPhysiqueOption({
    id: "stocky",
    label: "Stocky",
    description: "Dense through the chest and hips, you seem grounded and difficult to shift, built more for leverage and staying power than reach.",
    baselinePhysiqueShare: 0.5,
    anchors: ["STR", "CON"],
    supports: ["VIT"],
    overlaps: ["DEX"]
  }),
  createPhysiqueOption({
    id: "wiry",
    label: "Wiry",
    description: "Taut muscle and spare weight give you the look of someone who moves efficiently, wastes little, and survives well on leaner strength.",
    baselinePhysiqueShare: 0.5,
    anchors: ["DEX", "AGI"],
    supports: ["CON"],
    overlaps: ["WIS"]
  }),
  createPhysiqueOption({
    id: "compact",
    label: "Compact",
    description: "You are tightly built and efficiently kept, carrying strength close to the core with little excess in your frame or motion.",
    baselinePhysiqueShare: 0.5,
    anchors: ["CON", "VIT"],
    supports: ["DEX"],
    overlaps: ["WIS"]
  }),
  createPhysiqueOption({
    id: "lithe",
    label: "Lithe",
    description: "Lean and supple, you move like a drawn line rather than a wall, favoring reach, balance, and quick adjustment over sheer mass.",
    baselinePhysiqueShare: 0.5,
    anchors: ["DEX", "AGI"],
    supports: ["VIT"],
    overlaps: ["INT"]
  }),
  createPhysiqueOption({
    id: "frail",
    label: "Frail",
    description: "Your frame is slight and easily overtaxed, encouraging caution, precision, and economy where others would force the matter bodily.",
    baselinePhysiqueShare: 0.4,
    anchors: ["DEX"],
    supports: ["AGI", "INT"],
    overlaps: ["WIS"]
  }),
  createPhysiqueOption({
    id: "sickly",
    label: "Sickly",
    description: "Recovery has never come cheaply to you, leaving a body that asks for measured effort and rewards foresight over brute persistence.",
    baselinePhysiqueShare: 0.4,
    anchors: ["DEX", "AGI"],
    supports: ["WIS"],
    overlaps: ["INT"]
  }),
  createPhysiqueOption({
    id: "sluggish",
    label: "Sluggish",
    description: "Heavy through the frame and unhurried in motion, you carry yourself with deliberate force, slow reactions, and the kind of stubborn endurance that is hard to wear down.",
    baselinePhysiqueShare: 0.4,
    anchors: ["CON", "STR"],
    supports: ["VIT"],
    overlaps: ["WIS"]
  })
];

const NATURE_OPTIONS: NatureOption[] = [
  createNatureOption({
    id: "graceful",
    label: "Graceful",
    description: "Even simple movement seems composed on you, as though bearing, charm, and balance were learned long before you found words for them.",
    anchors: ["CHA", "AGI"],
    supports: ["DEX", "WIS"]
  }),
  createNatureOption({
    id: "poised",
    label: "Poised",
    description: "You hold yourself with measured readiness and quiet self-command, giving the impression of restraint that can turn to action without warning.",
    anchors: ["WIS", "CHA"],
    supports: ["DEX", "VIT"],
    overlaps: ["SPT"]
  }),
  createNatureOption({
    id: "comely",
    label: "Comely",
    description: "Your presence is immediately memorable, polished in a way that invites notice before hardship, labor, or roughness enter the frame.",
    anchors: ["CHA"],
    supports: ["VIT", "WIS"],
    overlaps: ["DEX"]
  }),
  createNatureOption({
    id: "insightful",
    label: "Insightful",
    description: "You read moods and moments quickly, with the sort of inward stillness that notices the pattern beneath what others only glance past.",
    anchors: ["WIS"],
    supports: ["INT", "SPT"],
    overlaps: ["CHA"]
  }),
  createNatureOption({
    id: "resolute",
    label: "Resolute",
    description: "Once you set your will, you carry it through with a steadiness that favors conviction, endurance, and refusal over display.",
    anchors: ["SPT"],
    supports: ["WIS", "CON"],
    overlaps: ["CHA"]
  }),
  createNatureOption({
    id: "commanding",
    label: "Commanding",
    description: "Others tend to feel your presence before they measure it, as though direction and pressure gather naturally around your voice.",
    anchors: ["CHA"],
    supports: ["WIS", "CON"],
    overlaps: ["SPT"]
  }),
  createNatureOption({
    id: "disciplined",
    label: "Disciplined",
    description: "You seem shaped by habit, restraint, and inward order, the kind of person who can hold a difficult course after novelty has worn thin.",
    anchors: ["WIS", "SPT"],
    supports: ["INT"],
    overlaps: ["VIT"]
  })
];

const FOCUS_OPTIONS: FocusOption[] = [
  createFocusOption({
    id: "martial",
    label: "Martial",
    description: "Your instincts lean toward the body first, meeting the world through force, movement, and practiced physical certainty.",
    physiqueShareShift: 0.18,
    modifierText: "Strong physical leaning"
  }),
  createFocusOption({
    id: "practical",
    label: "Practical",
    description: "You favor useful action and grounded judgment, letting bodily competence lead while still leaving room for measured thought.",
    physiqueShareShift: 0.08,
    modifierText: "Moderate physical leaning"
  }),
  createFocusOption({
    id: "balanced",
    label: "Balanced",
    description: "You divide yourself evenly between worldly capability and inner direction, with neither impulse fully ruling the other.",
    physiqueShareShift: 0,
    modifierText: "Even physique and nature split"
  }),
  createFocusOption({
    id: "learned",
    label: "Learned",
    description: "You tend to solve the world through understanding, preparation, and disciplined thought before leaning on the body alone.",
    physiqueShareShift: -0.08,
    modifierText: "Moderate mental-social leaning"
  }),
  createFocusOption({
    id: "mystic",
    label: "Mystic",
    description: "Your strongest pull is inward and unseen, trusting attunement, will, and deeper currents before ordinary force or routine craft.",
    physiqueShareShift: -0.16,
    modifierText: "Strong mental-social leaning"
  })
];

const LEGACY_LINEAGE_AGE_RANGES: Record<string, LegacyLineageAgeRangeProfile> = {
  "lineage.human": {
    male: {
      young_adult: [18, 27],
      prime_age: [28, 44],
      middle_aged: [45, 62]
    },
    female: {
      young_adult: [18, 29],
      prime_age: [30, 46],
      middle_aged: [47, 64]
    }
  },
  "lineage.elf": {
    male: {
      young_adult: [40, 85],
      prime_age: [86, 180],
      middle_aged: [181, 320]
    },
    female: {
      young_adult: [42, 92],
      prime_age: [93, 190],
      middle_aged: [191, 340]
    }
  },
  "lineage.dark_elf": {
    male: {
      young_adult: [35, 78],
      prime_age: [79, 165],
      middle_aged: [166, 290]
    },
    female: {
      young_adult: [37, 84],
      prime_age: [85, 174],
      middle_aged: [175, 305]
    }
  },
  "lineage.gnome": {
    male: {
      young_adult: [24, 50],
      prime_age: [51, 98],
      middle_aged: [99, 160]
    },
    female: {
      young_adult: [26, 54],
      prime_age: [55, 106],
      middle_aged: [107, 170]
    }
  },
  "lineage.halfling": {
    male: {
      young_adult: [20, 42],
      prime_age: [43, 84],
      middle_aged: [85, 135]
    },
    female: {
      young_adult: [21, 45],
      prime_age: [46, 88],
      middle_aged: [89, 142]
    }
  },
  "lineage.dwarf": {
    male: {
      young_adult: [28, 55],
      prime_age: [56, 110],
      middle_aged: [111, 180]
    },
    female: {
      young_adult: [30, 58],
      prime_age: [59, 118],
      middle_aged: [119, 190]
    }
  },
  "lineage.half_orc": {
    male: {
      young_adult: [16, 24],
      prime_age: [25, 38],
      middle_aged: [39, 52]
    },
    female: {
      young_adult: [17, 26],
      prime_age: [27, 40],
      middle_aged: [41, 55]
    }
  },
  "lineage.half_troll": {
    male: {
      young_adult: [18, 32],
      prime_age: [33, 52],
      middle_aged: [53, 72]
    },
    female: {
      young_adult: [19, 34],
      prime_age: [35, 56],
      middle_aged: [57, 76]
    }
  },
  "lineage.half_goblin": {
    male: {
      young_adult: [16, 23],
      prime_age: [24, 36],
      middle_aged: [37, 48]
    },
    female: {
      young_adult: [17, 25],
      prime_age: [26, 38],
      middle_aged: [39, 51]
    }
  },
  "lineage.half_merfolk": {
    male: {
      young_adult: [20, 40],
      prime_age: [41, 80],
      middle_aged: [81, 130]
    },
    female: {
      young_adult: [22, 44],
      prime_age: [45, 88],
      middle_aged: [89, 140]
    }
  }
};

const HUMAN_AGE_RANGES: LineageAgeRangeProfile = {
  male: {
    young_adult: [16, 24],
    prime: [25, 39],
    mature: [40, 54],
    senior: [55, 69]
  },
  female: {
    young_adult: [16, 24],
    prime: [25, 39],
    mature: [40, 54],
    senior: [55, 69]
  }
};

const AGE_RANGE_WEIGHTS = [9, 15, 15, 15] as const;
const AGE_BAND_ORDER: AgeBandId[] = ["young_adult", "prime", "mature", "senior"];

function distributeInclusiveCounts(total: number): number[] {
  const weightTotal = AGE_RANGE_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  const rawCounts = AGE_RANGE_WEIGHTS.map((weight) => (total * weight) / weightTotal);
  const counts = rawCounts.map((value) => Math.floor(value));
  let remaining = total - counts.reduce((sum, count) => sum + count, 0);
  const fractionalOrder = rawCounts
    .map((value, index) => ({
      index,
      fraction: value - Math.floor(value)
    }))
    .sort((left, right) => {
      if (left.fraction !== right.fraction) {
        return right.fraction - left.fraction;
      }

      return left.index - right.index;
    });

  for (const entry of fractionalOrder) {
    if (remaining <= 0) {
      break;
    }

    counts[entry.index] += 1;
    remaining -= 1;
  }

  return counts;
}

function scaleLegacyAgeRangeProfile(
  legacyProfile: LegacyLineageAgeRangeProfile
): LineageAgeRangeProfile {
  return (["male", "female"] as const).reduce<LineageAgeRangeProfile>(
    (result, sexId) => {
      const start = legacyProfile[sexId].young_adult[0];
      const end = legacyProfile[sexId].middle_aged[1];
      const totalYears = end - start + 1;
      const counts = distributeInclusiveCounts(totalYears);
      let cursor = start;

      result[sexId] = AGE_BAND_ORDER.reduce<Record<AgeBandId, IdentityAgeRange>>(
        (bands, bandId, index) => {
          const count = Math.max(1, counts[index] ?? 1);
          const nextEnd = cursor + count - 1;
          bands[bandId] = [cursor, nextEnd];
          cursor = nextEnd + 1;
          return bands;
        },
        {} as Record<AgeBandId, IdentityAgeRange>
      );

      return result;
    },
    {} as LineageAgeRangeProfile
  );
}

const LINEAGE_AGE_RANGES: Record<string, LineageAgeRangeProfile> = {
  "lineage.human": HUMAN_AGE_RANGES,
  ...Object.fromEntries(
    Object.entries(LEGACY_LINEAGE_AGE_RANGES)
      .filter(([lineageId]) => lineageId !== "lineage.human")
      .map(([lineageId, profile]) => [lineageId, scaleLegacyAgeRangeProfile(profile)])
  )
};

const PROFILE_REMAINDER_EPSILON = 0.000001;
const PHYSIQUE_WEIGHT_KEYS: PlayerAttributeKey[] = ["STR", "DEX", "AGI", "CON", "VIT"];
const NATURE_WEIGHT_KEYS: PlayerAttributeKey[] = ["INT", "WIS", "SPT", "CHA"];

function isDevelopmentRuntime(): boolean {
  const meta = import.meta as { env?: { DEV?: boolean; MODE?: string } };

  if (typeof meta?.env?.DEV === "boolean") {
    return meta.env.DEV;
  }

  if (typeof process !== "undefined" && typeof process.env?.NODE_ENV === "string") {
    return process.env.NODE_ENV !== "production";
  }

  return true;
}

function sumWeights(weights: ProfileWeightMap): number {
  return CHARACTER_ATTRIBUTE_ORDER.reduce(
    (total, attributeKey) => total + (weights[attributeKey] ?? 0),
    0
  );
}

function hasAtLeastOneWeight(
  weights: ProfileWeightMap,
  attributeKeys: PlayerAttributeKey[]
): boolean {
  return attributeKeys.some((attributeKey) => (weights[attributeKey] ?? 0) > 0);
}

function validateUniqueCategoryEntries<TOption extends { id: string; label: string }>(
  categoryLabel: string,
  options: readonly TOption[]
): string[] {
  const seenIds = new Set<string>();
  const seenLabels = new Set<string>();
  const seenEntries = new Set<string>();
  const errors: string[] = [];

  for (const option of options) {
    if (seenIds.has(option.id)) {
      errors.push(`${categoryLabel} id '${option.id}' is duplicated.`);
    }
    seenIds.add(option.id);

    if (seenLabels.has(option.label)) {
      errors.push(`${categoryLabel} label '${option.label}' is duplicated.`);
    }
    seenLabels.add(option.label);

    const fingerprint = JSON.stringify(option);
    if (seenEntries.has(fingerprint)) {
      errors.push(`${categoryLabel} entry '${option.label}' is duplicated.`);
    }
    seenEntries.add(fingerprint);
  }

  return errors;
}

function validateIdentityCatalogAuthoring(): void {
  const errors: string[] = [
    ...validateUniqueCategoryEntries("Physique", PHYSIQUE_OPTIONS),
    ...validateUniqueCategoryEntries("Nature", NATURE_OPTIONS),
    ...validateUniqueCategoryEntries("Focus", FOCUS_OPTIONS)
  ];

  for (const option of PHYSIQUE_OPTIONS) {
    if (sumWeights(option.weights) <= 0) {
      errors.push(`Physique '${option.label}' must define at least one weighted stat.`);
    }
    if (!hasAtLeastOneWeight(option.weights, PHYSIQUE_WEIGHT_KEYS)) {
      errors.push(
        `Physique '${option.label}' must weight at least one physical stat (STR/DEX/AGI/CON/VIT).`
      );
    }
  }

  for (const option of NATURE_OPTIONS) {
    if (sumWeights(option.weights) <= 0) {
      errors.push(`Nature '${option.label}' must define at least one weighted stat.`);
    }
    if (!hasAtLeastOneWeight(option.weights, NATURE_WEIGHT_KEYS)) {
      errors.push(
        `Nature '${option.label}' must weight at least one mental-social stat (INT/WIS/SPT/CHA).`
      );
    }
  }

  for (const option of FOCUS_OPTIONS) {
    if (
      option.physiqueShareShift < -0.25 - PROFILE_REMAINDER_EPSILON ||
      option.physiqueShareShift > 0.25 + PROFILE_REMAINDER_EPSILON
    ) {
      errors.push(
        `Focus '${option.label}' must keep physiqueShareShift between -0.25 and +0.25.`
      );
    }
  }

  if (errors.length === 0) {
    return;
  }

  if (isDevelopmentRuntime()) {
    console.error("[creator.identity] Invalid authored profile catalog:", errors);
    throw new Error(errors.join(" "));
  }
}

validateIdentityCatalogAuthoring();

export function normalizeAgeBandId(
  ageBandId: PlayerIdentityAgeBandId | "" | null | undefined
): AgeBandId | null {
  if (!ageBandId) {
    return null;
  }

  return ageBandId as AgeBandId;
}

export function normalizePhysiqueId(
  physiqueId: PlayerIdentityPhysiqueId | "" | null | undefined
): PlayerIdentityPhysiqueId | null {
  if (!physiqueId) {
    return null;
  }

  return physiqueId;
}

export function normalizeNatureId(
  natureId: PlayerIdentityNatureId | "" | null | undefined
): PlayerIdentityNatureId | null {
  if (!natureId) {
    return null;
  }

  return natureId;
}

export function normalizeFocusId(
  focusId: PlayerIdentityFocusId | "" | null | undefined
): PlayerIdentityFocusId | null {
  if (!focusId) {
    return null;
  }

  return focusId;
}

export function getHeightBandOptions(): HeightBandOption[] {
  return HEIGHT_BAND_OPTIONS;
}

export function getAgeBandOptions(): AgeBandOption[] {
  return AGE_BAND_OPTIONS;
}

export function getPhysiqueOptions(): PhysiqueOption[] {
  return PHYSIQUE_OPTIONS;
}

export function getNatureOptions(): NatureOption[] {
  return NATURE_OPTIONS;
}

export function getFocusOptions(): FocusOption[] {
  return FOCUS_OPTIONS;
}

export function getHeightBandOption(
  heightBandId: HeightBandId | "" | null | undefined
): HeightBandOption | null {
  if (!heightBandId) {
    return null;
  }

  return HEIGHT_BAND_OPTIONS.find((option) => option.id === heightBandId) ?? null;
}

export function getAgeBandOption(
  ageBandId: PlayerIdentityAgeBandId | "" | null | undefined
): AgeBandOption | null {
  const normalizedId = normalizeAgeBandId(ageBandId);

  if (!normalizedId) {
    return null;
  }

  return AGE_BAND_OPTIONS.find((option) => option.id === normalizedId) ?? null;
}

export function getPhysiqueOption(
  physiqueId: PlayerIdentityPhysiqueId | "" | null | undefined
): PhysiqueOption | null {
  const normalizedId = normalizePhysiqueId(physiqueId);

  if (!normalizedId) {
    return null;
  }

  return PHYSIQUE_OPTIONS.find((option) => option.id === normalizedId) ?? null;
}

export function getNatureOption(
  natureId: PlayerIdentityNatureId | "" | null | undefined
): NatureOption | null {
  const normalizedId = normalizeNatureId(natureId);

  if (!normalizedId) {
    return null;
  }

  return NATURE_OPTIONS.find((option) => option.id === normalizedId) ?? null;
}

export function getFocusOption(
  focusId: PlayerIdentityFocusId | "" | null | undefined
): FocusOption | null {
  const normalizedId = normalizeFocusId(focusId);

  if (!normalizedId) {
    return null;
  }

  return FOCUS_OPTIONS.find((option) => option.id === normalizedId) ?? null;
}

export function getSexOption(
  lineageId: string,
  sexId: ResolvedCharacterCreationSexId | "" | null | undefined
): SexOption {
  const resolvedSexId = sexId === "female" ? "female" : "male";
  return createSexOption(lineageId, resolvedSexId);
}

export function getAgeBandRange(
  lineageId: string,
  sexId: ResolvedCharacterCreationSexId | "" | null | undefined,
  ageBandId: PlayerIdentityAgeBandId | "" | null | undefined
): IdentityAgeRange | null {
  const normalizedAgeBandId = normalizeAgeBandId(ageBandId);

  if (!normalizedAgeBandId) {
    return null;
  }

  const resolvedSexId = sexId === "female" ? "female" : "male";
  return (
    LINEAGE_AGE_RANGES[lineageId]?.[resolvedSexId]?.[normalizedAgeBandId] ??
    HUMAN_AGE_RANGES[resolvedSexId][normalizedAgeBandId]
  );
}

export function formatAgeBandRange(
  lineageId: string,
  sexId: ResolvedCharacterCreationSexId | "" | null | undefined,
  ageBandId: PlayerIdentityAgeBandId | "" | null | undefined
): string | null {
  const range = getAgeBandRange(lineageId, sexId, ageBandId);

  return range ? `${range[0]}\u2013${range[1]}` : null;
}

export function formatHeightBandDisplayLine(
  heightBandId: HeightBandId | "" | null | undefined
): string | null {
  const option = getHeightBandOption(heightBandId);
  return option ? `${option.label} \u2014 ${option.modifierText}` : null;
}

export function formatAgeBandDisplayLine(
  lineageId: string,
  sexId: ResolvedCharacterCreationSexId | "" | null | undefined,
  ageBandId: PlayerIdentityAgeBandId | "" | null | undefined
): string | null {
  const option = getAgeBandOption(ageBandId);

  if (!option) {
    return null;
  }

  const rangeLabel = formatAgeBandRange(lineageId, sexId, option.id);
  return `${option.label}${rangeLabel ? ` (${rangeLabel})` : ""} \u2014 ${option.modifierText}`;
}

export function formatPhysiqueDisplayLine(
  physiqueId: PlayerIdentityPhysiqueId | "" | null | undefined
): string | null {
  const option = getPhysiqueOption(physiqueId);
  return option ? `${option.label} \u2014 ${option.emphasisText}` : null;
}

export function formatNatureDisplayLine(
  natureId: PlayerIdentityNatureId | "" | null | undefined
): string | null {
  const option = getNatureOption(natureId);
  return option ? `${option.label} \u2014 ${option.emphasisText}` : null;
}

export function formatFocusDisplayLine(
  focusId: PlayerIdentityFocusId | "" | null | undefined
): string | null {
  const option = getFocusOption(focusId);
  return option ? `${option.label} \u2014 ${option.modifierText}` : null;
}

export function resolveIdentityModifierSelections(params: {
  lineageId: string;
  sexId: ResolvedCharacterCreationSexId | "" | null | undefined;
  heightBandId: HeightBandId | "" | null | undefined;
  ageBandId: PlayerIdentityAgeBandId | "" | null | undefined;
  physiqueId: PlayerIdentityPhysiqueId | "" | null | undefined;
  natureId: PlayerIdentityNatureId | "" | null | undefined;
  focusId: PlayerIdentityFocusId | "" | null | undefined;
}): ResolvedIdentityModifierSelections {
  return {
    sex: getSexOption(params.lineageId, params.sexId),
    heightBand: getHeightBandOption(params.heightBandId),
    ageBand: getAgeBandOption(params.ageBandId),
    physique: getPhysiqueOption(params.physiqueId),
    nature: getNatureOption(params.natureId),
    focus: getFocusOption(params.focusId)
  };
}
