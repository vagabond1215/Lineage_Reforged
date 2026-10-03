import type {
  PlayerAttributeAdjustments,
  PlayerAttributeKey
} from "../../../../packages/shared/types/src/index.js";
import { CHARACTER_ATTRIBUTE_ORDER } from "./characterAttributes.js";

export type CharacterCreationSexProfileId = "male" | "female";

export interface CharacterCreationLineageSexProfile {
  lineageId: string;
  male: PlayerAttributeAdjustments;
  female: PlayerAttributeAdjustments;
  rationale: string;
}

export const CHARACTER_CREATION_LINEAGE_SEX_PROFILES: Record<string, CharacterCreationLineageSexProfile> = {
  "lineage.human": {
    lineageId: "lineage.human",
    male: { STR: 1, AGI: -1 },
    female: { STR: -1, AGI: 1 },
    rationale: "Moderate conventional dimorphism around the Human midpoint."
  },
  "lineage.dwarf": {
    lineageId: "lineage.dwarf",
    male: { STR: 1, VIT: -1 },
    female: { STR: -1, VIT: 1 },
    rationale: "Dwarven dimorphism emphasizes force versus bodily reserve rather than Human-style agility."
  },
  "lineage.gnome": {
    lineageId: "lineage.gnome",
    male: {},
    female: {},
    rationale: "Gnomes are mechanically monomorphic at creator scale."
  },
  "lineage.halfling": {
    lineageId: "lineage.halfling",
    male: { VIT: 1, DEX: -1 },
    female: { VIT: -1, DEX: 1 },
    rationale: "Halfling dimorphism distinguishes bodily reserve from fine coordination without using raw Strength."
  },
  "lineage.elf": {
    lineageId: "lineage.elf",
    male: {},
    female: {},
    rationale: "Elves are mechanically monomorphic at creator scale."
  },
  "lineage.dark_elf": {
    lineageId: "lineage.dark_elf",
    male: { DEX: 1, CON: -1 },
    female: { DEX: -1, CON: 1 },
    rationale: "Dark-Elf v1 biology contrasts male precision with female robustness."
  },
  "lineage.half_troll": {
    lineageId: "lineage.half_troll",
    male: { STR: 2, CON: -1, VIT: -1 },
    female: { STR: -2, CON: 1, VIT: 1 },
    rationale: "Strong troll-derived dimorphism contrasts peak force with resilience and reserve."
  },
  "lineage.half_orc": {
    lineageId: "lineage.half_orc",
    male: { STR: 1, CON: 1, DEX: -1, AGI: -1 },
    female: { STR: -1, CON: -1, DEX: 1, AGI: 1 },
    rationale: "Strong orc-derived dimorphism contrasts power/toughness with mobility/coordination."
  },
  "lineage.half_goblin": {
    lineageId: "lineage.half_goblin",
    male: { AGI: 1, CON: -1 },
    female: { AGI: -1, CON: 1 },
    rationale: "Goblin-derived dimorphism contrasts rapid motion with robustness."
  },
  "lineage.half_merfolk": {
    lineageId: "lineage.half_merfolk",
    male: { AGI: 1, VIT: -1 },
    female: { AGI: -1, VIT: 1 },
    rationale: "Aquatic dimorphism contrasts maneuverability with bodily reserve."
  }
};

export function getCharacterCreationSexAttributeAdjustments(
  lineageId: string,
  sexId: CharacterCreationSexProfileId | "" | null
): PlayerAttributeAdjustments {
  if (sexId !== "male" && sexId !== "female") return {};
  const profile = CHARACTER_CREATION_LINEAGE_SEX_PROFILES[lineageId];
  if (!profile) return {};
  return profile[sexId];
}

export function hasCharacterCreationSexProfile(lineageId: string): boolean {
  return Boolean(CHARACTER_CREATION_LINEAGE_SEX_PROFILES[lineageId]);
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
    if (!profile) {
      errors.push(`Missing explicit sex profile for ${lineageId}.`);
      continue;
    }
    for (const sexId of ["male", "female"] as const) {
      const adjustment = profile[sexId];
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
