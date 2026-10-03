import {
  PLAYER_LINEAGE_PROFILES,
  type PlayerAttributeAdjustments,
  type PlayerAttributeKey
} from "../../../../packages/shared/types/src/index.js";
import { CHARACTER_ATTRIBUTE_ORDER } from "./characterAttributes.js";

export type CharacterCreationSexProfileId = "male" | "female";

export interface CharacterCreationLineageSexProfile {
  lineageId: string;
  male: PlayerAttributeAdjustments;
  female: PlayerAttributeAdjustments;
  rationale: string;
}

const CHARACTER_CREATION_LINEAGE_SEX_RATIONALES: Record<string, string> = {
  "lineage.human": "Moderate conventional dimorphism around the Human midpoint.",
  "lineage.dwarf": "Dwarven dimorphism emphasizes force versus bodily reserve rather than Human-style agility.",
  "lineage.gnome": "Gnomes are mechanically monomorphic at creator scale.",
  "lineage.halfling": "Halfling dimorphism distinguishes bodily reserve from fine coordination without using raw Strength.",
  "lineage.elf": "Elves are mechanically monomorphic at creator scale.",
  "lineage.dark_elf": "Dark-Elf v1 biology contrasts male precision with female robustness.",
  "lineage.half_troll": "Strong troll-derived dimorphism contrasts peak force with resilience and reserve.",
  "lineage.half_orc": "Strong orc-derived dimorphism contrasts power/toughness with mobility/coordination.",
  "lineage.half_goblin": "Goblin-derived dimorphism contrasts rapid motion with robustness.",
  "lineage.half_merfolk": "Aquatic dimorphism contrasts maneuverability with bodily reserve."
};

export const CHARACTER_CREATION_LINEAGE_SEX_PROFILES: Record<string, CharacterCreationLineageSexProfile> =
  Object.fromEntries(
    Object.entries(CHARACTER_CREATION_LINEAGE_SEX_RATIONALES).map(([lineageId, rationale]) => {
      const lineageProfile = PLAYER_LINEAGE_PROFILES[lineageId];
      if (!lineageProfile) {
        throw new Error(`Missing shared lineage profile for ${lineageId}.`);
      }

      return [
        lineageId,
        {
          lineageId,
          male: lineageProfile.sexAttributeAdjustments.male,
          female: lineageProfile.sexAttributeAdjustments.female,
          rationale
        }
      ];
    })
  );

export function getCharacterCreationSexAttributeAdjustments(
  lineageId: string,
  sexId: CharacterCreationSexProfileId | "" | null
): PlayerAttributeAdjustments {
  if (sexId !== "male" && sexId !== "female") return {};
  return PLAYER_LINEAGE_PROFILES[lineageId]?.sexAttributeAdjustments[sexId] ?? {};
}

export function hasCharacterCreationSexProfile(lineageId: string): boolean {
  return Boolean(
    CHARACTER_CREATION_LINEAGE_SEX_RATIONALES[lineageId] && PLAYER_LINEAGE_PROFILES[lineageId]
  );
}

export function sumCharacterCreationAdjustments(adjustments: PlayerAttributeAdjustments): number {
  return CHARACTER_ATTRIBUTE_ORDER.reduce(
    (sum, key) => sum + (adjustments[key] ?? 0),
    0
  );
}

export function validateCharacterCreationSexProfiles(
  playableLineageIds: readonly string[]
): string[] {
  const errors: string[] = [];
  for (const lineageId of playableLineageIds) {
    const profile = CHARACTER_CREATION_LINEAGE_SEX_PROFILES[lineageId];
    const sharedProfile = PLAYER_LINEAGE_PROFILES[lineageId];
    if (!profile || !sharedProfile) {
      errors.push(`Missing explicit sex profile for ${lineageId}.`);
      continue;
    }
    for (const sexId of ["male", "female"] as const) {
      const adjustment = sharedProfile.sexAttributeAdjustments[sexId];
      if (sumCharacterCreationAdjustments(adjustment) !== 0) {
        errors.push(`${lineageId} ${sexId} adjustment must be zero-sum.`);
      }
      for (const [key, value] of Object.entries(adjustment) as Array<[PlayerAttributeKey, number]>) {
        if (!Number.isInteger(value)) errors.push(`${lineageId} ${sexId} ${key} must use integer adjustments.`);
      }
    }
  }
  return errors;
}

export function formatCharacterCreationSexAdjustment(
  lineageId: string,
  sexId: CharacterCreationSexProfileId
): string {
  const adjustments = getCharacterCreationSexAttributeAdjustments(lineageId, sexId);
  const positive = CHARACTER_ATTRIBUTE_ORDER.flatMap((key) => {
    const value = adjustments[key] ?? 0;
    return value > 0 ? [`+${value} ${key}`] : [];
  });
  const negative = CHARACTER_ATTRIBUTE_ORDER.flatMap((key) => {
    const value = adjustments[key] ?? 0;
    return value < 0 ? [`${value} ${key}`] : [];
  });
  return [...positive, ...negative].join(" / ") || "No attribute change";
}
