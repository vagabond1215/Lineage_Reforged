import {
  applyAttributeAdjustments,
  type PlayerAttributes,
  type PlayerIdentityAgeBandId,
  type PlayerIdentityFocusId,
  type PlayerIdentityNatureId,
  type PlayerIdentityPhysiqueId,
  type PlayerSexId
} from "../../../../packages/shared/types/src/index.js";
import { CHARACTER_ATTRIBUTE_ORDER } from "./characterAttributes.js";
import {
  getBackstoryAttributeAdjustments,
  getLineageBaseAttributes,
  resolveCharacterCreationIdentityModifiers,
  sumPlayerAttributes,
  type HeightBandId
} from "./characterCreationCatalog.js";

const BASE_STAT_TOTAL = 90;
const FINAL_STAT_TOTAL = 100;
const GENERATED_PROFILE_POINTS = 10;
const MINIMUM_ATTRIBUTE_VALUE = 1;
const PROFILE_REMAINDER_EPSILON = 0.000001;

type CharacterCreationResolvedSexId = Extract<PlayerSexId, "male" | "female"> | "";

export interface CharacterCreationAttributeResolution {
  baseAttributes: PlayerAttributes;
  generatedProfilePoints: PlayerAttributes;
  finalAttributes: PlayerAttributes;
  finalPhysiqueShare: number;
  finalNatureShare: number;
  errors: string[];
}

export type CharacterCreationAttributeResolutionParams = {
  lineageId: string;
  sexId: CharacterCreationResolvedSexId;
  ageBandId: PlayerIdentityAgeBandId | "" | null;
  heightBandId: HeightBandId | "" | null;
  physiqueId: PlayerIdentityPhysiqueId | "" | null;
  natureId: PlayerIdentityNatureId | "" | null;
  focusId: PlayerIdentityFocusId | "" | null;
  backstoryId: string;
};

function createEmptyAttributes(): PlayerAttributes {
  return {
    STR: 0,
    DEX: 0,
    AGI: 0,
    CON: 0,
    VIT: 0,
    INT: 0,
    WIS: 0,
    SPT: 0,
    CHA: 0
  };
}

function cloneAttributes(attributes: PlayerAttributes): PlayerAttributes {
  return {
    STR: attributes.STR,
    DEX: attributes.DEX,
    AGI: attributes.AGI,
    CON: attributes.CON,
    VIT: attributes.VIT,
    INT: attributes.INT,
    WIS: attributes.WIS,
    SPT: attributes.SPT,
    CHA: attributes.CHA
  };
}

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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeCanonical(
  weights: Partial<Record<keyof PlayerAttributes, number>>
): PlayerAttributes {
  const total = CHARACTER_ATTRIBUTE_ORDER.reduce(
    (sum, attributeKey) => sum + Math.max(0, weights[attributeKey] ?? 0),
    0
  );

  if (total <= 0) {
    return createEmptyAttributes();
  }

  const normalized = createEmptyAttributes();

  for (const attributeKey of CHARACTER_ATTRIBUTE_ORDER) {
    normalized[attributeKey] = Math.max(0, weights[attributeKey] ?? 0) / total;
  }

  return normalized;
}

export function resolveGeneratedProfilePointDistribution(
  combinedRaw: PlayerAttributes
): PlayerAttributes {
  const rescaled = createEmptyAttributes();
  const generated = createEmptyAttributes();
  const remainders = CHARACTER_ATTRIBUTE_ORDER.map((attributeKey) => {
    const rawValue = combinedRaw[attributeKey] * GENERATED_PROFILE_POINTS;
    const flooredValue = Math.floor(rawValue);
    rescaled[attributeKey] = rawValue;
    generated[attributeKey] = flooredValue;

    return {
      attributeKey,
      remainder: rawValue - flooredValue
    };
  }).sort((left, right) => {
    const remainderDelta = right.remainder - left.remainder;

    if (Math.abs(remainderDelta) > PROFILE_REMAINDER_EPSILON) {
      return remainderDelta;
    }

    return (
      CHARACTER_ATTRIBUTE_ORDER.indexOf(left.attributeKey) -
      CHARACTER_ATTRIBUTE_ORDER.indexOf(right.attributeKey)
    );
  });

  let remaining = GENERATED_PROFILE_POINTS - sumPlayerAttributes(generated);

  for (const entry of remainders) {
    if (remaining <= 0) {
      break;
    }

    generated[entry.attributeKey] += 1;
    remaining -= 1;
  }

  return generated;
}

function validateProfileInvariants(
  generatedProfilePoints: PlayerAttributes,
  finalAttributes: PlayerAttributes
): string[] {
  const errors: string[] = [];

  for (const attributeKey of CHARACTER_ATTRIBUTE_ORDER) {
    if (generatedProfilePoints[attributeKey] < 0) {
      errors.push(`${attributeKey} generated profile points cannot be negative.`);
    }

    if (finalAttributes[attributeKey] < MINIMUM_ATTRIBUTE_VALUE) {
      errors.push(
        `${attributeKey} final value fell below the minimum supported floor of ${MINIMUM_ATTRIBUTE_VALUE}.`
      );
    }
  }

  const generatedTotal = sumPlayerAttributes(generatedProfilePoints);
  if (generatedTotal !== GENERATED_PROFILE_POINTS) {
    errors.push(
      `Generated profile points must resolve to exactly ${GENERATED_PROFILE_POINTS}, received ${generatedTotal}.`
    );
  }

  const finalTotal = sumPlayerAttributes(finalAttributes);
  if (finalTotal !== FINAL_STAT_TOTAL) {
    errors.push(`Final attributes must resolve to exactly ${FINAL_STAT_TOTAL}, received ${finalTotal}.`);
  }

  return errors;
}

export function resolveCharacterCreationAttributes(
  params: CharacterCreationAttributeResolutionParams
): CharacterCreationAttributeResolution {
  const resolvedIdentityModifiers = resolveCharacterCreationIdentityModifiers({
    lineageId: params.lineageId,
    sexId: params.sexId,
    ageBandId: params.ageBandId,
    heightBandId: params.heightBandId,
    physiqueId: params.physiqueId,
    natureId: params.natureId,
    focusId: params.focusId
  });

  let baseAttributes = getLineageBaseAttributes(params.lineageId);
  baseAttributes = applyAttributeAdjustments(
    baseAttributes,
    resolvedIdentityModifiers.sex.attributeAdjustments
  );
  baseAttributes = applyAttributeAdjustments(
    baseAttributes,
    resolvedIdentityModifiers.ageBand?.attributeAdjustments ?? {}
  );
  baseAttributes = applyAttributeAdjustments(
    baseAttributes,
    resolvedIdentityModifiers.heightBand?.attributeAdjustments ?? {}
  );
  baseAttributes = applyAttributeAdjustments(
    baseAttributes,
    getBackstoryAttributeAdjustments(params.backstoryId)
  );

  const errors: string[] = [];
  if (sumPlayerAttributes(baseAttributes) !== BASE_STAT_TOTAL) {
    errors.push(
      `Base attributes must resolve to exactly ${BASE_STAT_TOTAL} before profile generation.`
    );
  }

  if (!resolvedIdentityModifiers.physique) {
    errors.push("Choose a valid physique profile.");
  }
  if (!resolvedIdentityModifiers.nature) {
    errors.push("Choose a valid nature profile.");
  }
  if (!resolvedIdentityModifiers.focus) {
    errors.push("Choose a valid focus profile.");
  }

  let generatedProfilePoints = createEmptyAttributes();
  let finalPhysiqueShare = 0.5;
  let finalNatureShare = 0.5;

  if (
    resolvedIdentityModifiers.physique &&
    resolvedIdentityModifiers.nature &&
    resolvedIdentityModifiers.focus
  ) {
    finalPhysiqueShare = clamp(
      resolvedIdentityModifiers.physique.baselinePhysiqueShare +
        resolvedIdentityModifiers.focus.physiqueShareShift,
      0.25,
      0.75
    );
    finalNatureShare = 1 - finalPhysiqueShare;

    const physiqueRaw = normalizeCanonical(resolvedIdentityModifiers.physique.weights);
    const natureRaw = normalizeCanonical(resolvedIdentityModifiers.nature.weights);
    const combinedRaw = createEmptyAttributes();

    for (const attributeKey of CHARACTER_ATTRIBUTE_ORDER) {
      combinedRaw[attributeKey] =
        physiqueRaw[attributeKey] * finalPhysiqueShare +
        natureRaw[attributeKey] * finalNatureShare;
    }

    generatedProfilePoints = resolveGeneratedProfilePointDistribution(combinedRaw);
  }

  const finalAttributes = cloneAttributes(baseAttributes);
  for (const attributeKey of CHARACTER_ATTRIBUTE_ORDER) {
    finalAttributes[attributeKey] += generatedProfilePoints[attributeKey];
  }

  errors.push(...validateProfileInvariants(generatedProfilePoints, finalAttributes));

  if (errors.length > 0 && isDevelopmentRuntime()) {
    console.error("[creator.profileResolver] Invalid character creation resolution", {
      params,
      errors,
      baseAttributes,
      generatedProfilePoints,
      finalAttributes
    });
  }

  return {
    baseAttributes,
    generatedProfilePoints,
    finalAttributes,
    finalPhysiqueShare,
    finalNatureShare,
    errors
  };
}
