import type { PlayerAttributeKey } from "../../../../packages/shared/types/src/index.js";

export type CharacterProfileTraitCategory =
  | "body.frame"
  | "physical.aptitude"
  | "physical.condition"
  | "temperament"
  | "cognition"
  | "presence";

export type CharacterProfileTraitDomain = "physical" | "mental_social";
export type CharacterProfileTraitId = `profile_trait.${string}`;
export type CharacterProfileTraitWeights = Partial<Record<PlayerAttributeKey, number>>;

export interface CharacterProfileTraitDefinition {
  id: CharacterProfileTraitId;
  category: CharacterProfileTraitCategory;
  label: string;
  description: string;
  attributeWeights: CharacterProfileTraitWeights;
  portraitFragments: string[];
  exclusiveGroupId?: string;
  conflictsWith?: CharacterProfileTraitId[];
  tensionWith?: CharacterProfileTraitId[];
  allowedLineageIds?: string[];
  blockedLineageIds?: string[];
}

export interface CharacterProfileTraitValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const CHARACTER_PROFILE_TRAIT_SELECTION_COUNT = 6;
export const CHARACTER_PROFILE_TRAIT_WEIGHT_TOTAL = 8;
export const CHARACTER_PROFILE_TRAIT_MIN_PHYSICAL = 2;
export const CHARACTER_PROFILE_TRAIT_MAX_PHYSICAL = 4;
export const CHARACTER_PROFILE_TRAIT_MIN_MENTAL_SOCIAL = 2;
export const CHARACTER_PROFILE_TRAIT_MAX_NON_FRAME_CATEGORY = 2;

const PHYSICAL_CATEGORIES = new Set<CharacterProfileTraitCategory>([
  "body.frame",
  "physical.aptitude",
  "physical.condition"
]);

function trait(
  definition: Omit<CharacterProfileTraitDefinition, "id"> & { id: CharacterProfileTraitId }
): CharacterProfileTraitDefinition {
  return definition;
}

export const CHARACTER_PROFILE_TRAITS: readonly CharacterProfileTraitDefinition[] = [
  trait({ id: "profile_trait.body_frame.large_framed", category: "body.frame", label: "Large-Framed", description: "A substantial frame with natural mass and leverage.", attributeWeights: { STR: 4, CON: 2, VIT: 2 }, portraitFragments: ["large substantial frame"], exclusiveGroupId: "body.frame" }),
  trait({ id: "profile_trait.body_frame.broad_shouldered", category: "body.frame", label: "Broad-Shouldered", description: "A broad upper frame built around force and stability.", attributeWeights: { STR: 4, CON: 3, VIT: 1 }, portraitFragments: ["broad shoulders and sturdy upper frame"], exclusiveGroupId: "body.frame" }),
  trait({ id: "profile_trait.body_frame.stocky", category: "body.frame", label: "Stocky", description: "Dense and grounded, favoring leverage and staying power.", attributeWeights: { CON: 4, STR: 3, VIT: 1 }, portraitFragments: ["stocky dense build"], exclusiveGroupId: "body.frame" }),
  trait({ id: "profile_trait.body_frame.compact", category: "body.frame", label: "Compact", description: "Tightly built and efficient, with strength carried close to the core.", attributeWeights: { CON: 3, VIT: 3, DEX: 2 }, portraitFragments: ["compact efficient frame"], exclusiveGroupId: "body.frame" }),
  trait({ id: "profile_trait.body_frame.wiry", category: "body.frame", label: "Wiry", description: "Lean, taut, and efficient rather than bulky.", attributeWeights: { DEX: 3, AGI: 3, CON: 2 }, portraitFragments: ["wiry lean frame with corded musculature"], exclusiveGroupId: "body.frame" }),
  trait({ id: "profile_trait.body_frame.lithe", category: "body.frame", label: "Lithe", description: "Light and supple, favoring balance and quick adjustment.", attributeWeights: { AGI: 4, DEX: 3, VIT: 1 }, portraitFragments: ["lithe flexible frame"], exclusiveGroupId: "body.frame" }),
  trait({ id: "profile_trait.body_frame.lean", category: "body.frame", label: "Lean", description: "Spare in mass but balanced in motion and reserve.", attributeWeights: { AGI: 3, DEX: 3, VIT: 2 }, portraitFragments: ["lean balanced build"], exclusiveGroupId: "body.frame" }),
  trait({ id: "profile_trait.body_frame.slight", category: "body.frame", label: "Slight", description: "A fine, light frame that favors precision and mobility.", attributeWeights: { DEX: 4, AGI: 3, VIT: 1 }, portraitFragments: ["slight fine-boned frame"], exclusiveGroupId: "body.frame" }),

  trait({ id: "profile_trait.physical_aptitude.athletic", category: "physical.aptitude", label: "Athletic", description: "Conditioned for coordinated bursts of strength and movement.", attributeWeights: { STR: 3, AGI: 3, CON: 2 }, portraitFragments: ["athletic conditioning"] }),
  trait({ id: "profile_trait.physical_aptitude.graceful", category: "physical.aptitude", label: "Graceful", description: "Movement is balanced, controlled, and naturally composed.", attributeWeights: { AGI: 4, DEX: 3, CHA: 1 }, portraitFragments: ["graceful carriage"] }),
  trait({ id: "profile_trait.physical_aptitude.nimble", category: "physical.aptitude", label: "Nimble", description: "Quick changes of direction and light recovery come readily.", attributeWeights: { AGI: 4, DEX: 3, VIT: 1 }, portraitFragments: ["nimble light-footed posture"] }),
  trait({ id: "profile_trait.physical_aptitude.quick_handed", category: "physical.aptitude", label: "Quick-Handed", description: "Fine movements and rapid hand-eye coordination are natural strengths.", attributeWeights: { DEX: 4, AGI: 2, INT: 1, WIS: 1 }, portraitFragments: ["precise alert bearing"] }),
  trait({ id: "profile_trait.physical_aptitude.steady", category: "physical.aptitude", label: "Steady", description: "Controlled motion and durable concentration hold under strain.", attributeWeights: { CON: 3, DEX: 2, WIS: 2, VIT: 1 }, portraitFragments: ["steady controlled posture"] }),
  trait({ id: "profile_trait.physical_aptitude.powerful", category: "physical.aptitude", label: "Powerful", description: "Force production and bodily drive are pronounced strengths.", attributeWeights: { STR: 4, CON: 2, VIT: 2 }, portraitFragments: ["powerful physical presence"] }),
  trait({ id: "profile_trait.physical_aptitude.sure_footed", category: "physical.aptitude", label: "Sure-Footed", description: "Balance and footing remain reliable on uncertain ground.", attributeWeights: { AGI: 3, CON: 2, DEX: 2, WIS: 1 }, portraitFragments: ["balanced sure-footed stance"] }),
  trait({ id: "profile_trait.physical_aptitude.coordinated", category: "physical.aptitude", label: "Coordinated", description: "Complex movement comes together with little wasted effort.", attributeWeights: { DEX: 3, AGI: 3, WIS: 1, INT: 1 }, portraitFragments: ["coordinated composed movement"] }),

  trait({ id: "profile_trait.physical_condition.muscular", category: "physical.condition", label: "Muscular", description: "Visible muscular development supports direct force and endurance.", attributeWeights: { STR: 4, CON: 2, VIT: 2 }, portraitFragments: ["visibly developed musculature"] }),
  trait({ id: "profile_trait.physical_condition.hardy", category: "physical.condition", label: "Hardy", description: "The body tolerates strain, weather, and repeated effort well.", attributeWeights: { CON: 4, VIT: 3, STR: 1 }, portraitFragments: ["hardy weather-tolerant condition"] }),
  trait({ id: "profile_trait.physical_condition.vigorous", category: "physical.condition", label: "Vigorous", description: "Energy and bodily reserve recover readily after exertion.", attributeWeights: { VIT: 4, AGI: 2, CON: 2 }, portraitFragments: ["vigorous energetic condition"] }),
  trait({ id: "profile_trait.physical_condition.enduring", category: "physical.condition", label: "Enduring", description: "Long effort is sustained by deep reserve and determination.", attributeWeights: { VIT: 4, CON: 2, SPT: 2 }, portraitFragments: ["enduring resilient condition"] }),
  trait({ id: "profile_trait.physical_condition.tough", category: "physical.condition", label: "Tough", description: "Physical punishment is met with resilience and refusal.", attributeWeights: { CON: 4, VIT: 2, SPT: 2 }, portraitFragments: ["tough resilient appearance"] }),
  trait({ id: "profile_trait.physical_condition.robust", category: "physical.condition", label: "Robust", description: "Health, reserve, and bodily strength are broadly dependable.", attributeWeights: { CON: 3, VIT: 3, STR: 2 }, portraitFragments: ["robust healthy condition"] }),

  trait({ id: "profile_trait.temperament.disciplined", category: "temperament", label: "Disciplined", description: "Attention and will are shaped by practiced restraint.", attributeWeights: { WIS: 3, SPT: 3, INT: 2 }, portraitFragments: ["composed attentive expression"] }),
  trait({ id: "profile_trait.temperament.resolute", category: "temperament", label: "Resolute", description: "Commitment holds firm when pressure or uncertainty rises.", attributeWeights: { SPT: 4, WIS: 2, CON: 2 }, portraitFragments: ["steady determined gaze"] }),
  trait({ id: "profile_trait.temperament.patient", category: "temperament", label: "Patient", description: "Impulse yields readily to timing, observation, and endurance.", attributeWeights: { WIS: 4, SPT: 3, INT: 1 }, portraitFragments: ["patient measured expression"] }),
  trait({ id: "profile_trait.temperament.bold", category: "temperament", label: "Bold", description: "Action comes readily when hesitation would cost momentum.", attributeWeights: { SPT: 3, CHA: 3, WIS: 1, VIT: 1 }, portraitFragments: ["bold direct bearing"], tensionWith: ["profile_trait.temperament.cautious"] }),
  trait({ id: "profile_trait.temperament.cautious", category: "temperament", label: "Cautious", description: "Risk is weighed before action and attention stays on consequences.", attributeWeights: { WIS: 4, INT: 2, SPT: 2 }, portraitFragments: ["watchful cautious expression"], tensionWith: ["profile_trait.temperament.bold"] }),
  trait({ id: "profile_trait.temperament.curious", category: "temperament", label: "Curious", description: "Unknown patterns invite attention instead of avoidance.", attributeWeights: { INT: 4, WIS: 2, SPT: 1, CHA: 1 }, portraitFragments: ["curious alert gaze"] }),
  trait({ id: "profile_trait.temperament.even_tempered", category: "temperament", label: "Even-Tempered", description: "Emotion moves without easily unseating judgment or presence.", attributeWeights: { SPT: 3, WIS: 3, CHA: 2 }, portraitFragments: ["calm even expression"] }),
  trait({ id: "profile_trait.temperament.adaptable", category: "temperament", label: "Adaptable", description: "Changing circumstances are met without becoming fixed on one response.", attributeWeights: { WIS: 2, INT: 2, SPT: 2, CHA: 2 }, portraitFragments: ["alert adaptable demeanor"] }),

  trait({ id: "profile_trait.cognition.analytical", category: "cognition", label: "Analytical", description: "Problems are naturally separated into patterns, causes, and consequences.", attributeWeights: { INT: 4, WIS: 3, SPT: 1 }, portraitFragments: ["focused observant gaze"] }),
  trait({ id: "profile_trait.cognition.intuitive", category: "cognition", label: "Intuitive", description: "Patterns are often recognized before they can be fully explained.", attributeWeights: { WIS: 4, SPT: 2, INT: 1, CHA: 1 }, portraitFragments: ["intuitive perceptive gaze"] }),
  trait({ id: "profile_trait.cognition.practical", category: "cognition", label: "Practical", description: "Ideas are judged by how well they survive contact with real work.", attributeWeights: { WIS: 3, INT: 2, DEX: 2, SPT: 1 }, portraitFragments: ["practical grounded demeanor"] }),
  trait({ id: "profile_trait.cognition.studious", category: "cognition", label: "Studious", description: "Sustained learning and retained detail come naturally.", attributeWeights: { INT: 4, WIS: 2, SPT: 2 }, portraitFragments: ["studious attentive expression"] }),
  trait({ id: "profile_trait.cognition.inventive", category: "cognition", label: "Inventive", description: "New arrangements and workable alternatives appear quickly.", attributeWeights: { INT: 4, DEX: 2, WIS: 1, SPT: 1 }, portraitFragments: ["inventive alert expression"] }),
  trait({ id: "profile_trait.cognition.observant", category: "cognition", label: "Observant", description: "Small changes in people and surroundings are difficult to miss.", attributeWeights: { WIS: 4, INT: 2, DEX: 1, AGI: 1 }, portraitFragments: ["observant attentive gaze"] }),
  trait({ id: "profile_trait.cognition.methodical", category: "cognition", label: "Methodical", description: "Thought proceeds carefully through repeatable steps and checks.", attributeWeights: { INT: 3, WIS: 3, SPT: 2 }, portraitFragments: ["methodical focused demeanor"] }),
  trait({ id: "profile_trait.cognition.imaginative", category: "cognition", label: "Imaginative", description: "Possibilities are explored beyond the most obvious reading of a problem.", attributeWeights: { INT: 3, SPT: 3, WIS: 1, CHA: 1 }, portraitFragments: ["imaginative inward-looking expression"] }),

  trait({ id: "profile_trait.presence.commanding", category: "presence", label: "Commanding", description: "Attention tends to settle on you when decisions need to be made.", attributeWeights: { CHA: 4, SPT: 2, WIS: 2 }, portraitFragments: ["authoritative commanding gaze"] }),
  trait({ id: "profile_trait.presence.warm", category: "presence", label: "Warm", description: "Others readily read openness and human concern in your manner.", attributeWeights: { CHA: 4, WIS: 2, SPT: 2 }, portraitFragments: ["warm approachable expression"], tensionWith: ["profile_trait.presence.stern"] }),
  trait({ id: "profile_trait.presence.reserved", category: "presence", label: "Reserved", description: "You reveal little without reason and carry yourself with restraint.", attributeWeights: { WIS: 3, SPT: 3, INT: 2 }, portraitFragments: ["restrained reserved demeanor"] }),
  trait({ id: "profile_trait.presence.stern", category: "presence", label: "Stern", description: "Your manner is controlled, exacting, and difficult to dismiss.", attributeWeights: { SPT: 3, CHA: 3, WIS: 2 }, portraitFragments: ["stern controlled bearing"], tensionWith: ["profile_trait.presence.warm"] }),
  trait({ id: "profile_trait.presence.amiable", category: "presence", label: "Amiable", description: "Conversation and ordinary company come with an easy social rhythm.", attributeWeights: { CHA: 4, WIS: 3, SPT: 1 }, portraitFragments: ["amiable open expression"] }),
  trait({ id: "profile_trait.presence.intimidating", category: "presence", label: "Intimidating", description: "Presence and physical certainty can make opposition hesitate.", attributeWeights: { CHA: 3, SPT: 3, CON: 1, STR: 1 }, portraitFragments: ["intimidating self-assured bearing"] }),
  trait({ id: "profile_trait.presence.poised", category: "presence", label: "Poised", description: "Composure remains visible even when attention turns toward you.", attributeWeights: { CHA: 3, WIS: 3, SPT: 2 }, portraitFragments: ["poised composed bearing"] }),
  trait({ id: "profile_trait.presence.enigmatic", category: "presence", label: "Enigmatic", description: "Your manner suggests more than it readily explains.", attributeWeights: { CHA: 3, SPT: 3, INT: 2 }, portraitFragments: ["enigmatic restrained expression"] })
] as const;

const TRAIT_BY_ID = new Map(CHARACTER_PROFILE_TRAITS.map((entry) => [entry.id, entry]));

export const DEFAULT_CHARACTER_PROFILE_TRAIT_IDS: CharacterProfileTraitId[] = [
  "profile_trait.body_frame.stocky",
  "profile_trait.physical_aptitude.athletic",
  "profile_trait.physical_condition.hardy",
  "profile_trait.temperament.disciplined",
  "profile_trait.cognition.analytical",
  "profile_trait.presence.poised"
];

export function getCharacterProfileTrait(
  id: string | null | undefined
): CharacterProfileTraitDefinition | null {
  if (!id) return null;
  return TRAIT_BY_ID.get(id as CharacterProfileTraitId) ?? null;
}

export function getCharacterProfileTraitsByCategory(
  category: CharacterProfileTraitCategory
): CharacterProfileTraitDefinition[] {
  return CHARACTER_PROFILE_TRAITS.filter((entry) => entry.category === category);
}

export function getCharacterProfileTraitDomain(
  category: CharacterProfileTraitCategory
): CharacterProfileTraitDomain {
  return PHYSICAL_CATEGORIES.has(category) ? "physical" : "mental_social";
}

export function validateCharacterProfileTraitCatalog(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const entry of CHARACTER_PROFILE_TRAITS) {
    if (seen.has(entry.id)) errors.push(`Duplicate profile trait id: ${entry.id}`);
    seen.add(entry.id);

    const weights = Object.values(entry.attributeWeights);
    if (weights.some((value) => value !== undefined && (!Number.isInteger(value) || value < 0))) {
      errors.push(`${entry.id} has non-integer or negative profile weights.`);
    }
    const total = weights.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    if (total !== CHARACTER_PROFILE_TRAIT_WEIGHT_TOTAL) {
      errors.push(`${entry.id} must total ${CHARACTER_PROFILE_TRAIT_WEIGHT_TOTAL} weight units, received ${total}.`);
    }

    for (const otherId of [...(entry.conflictsWith ?? []), ...(entry.tensionWith ?? [])]) {
      if (!TRAIT_BY_ID.has(otherId)) errors.push(`${entry.id} references unknown trait ${otherId}.`);
    }
  }

  for (const entry of CHARACTER_PROFILE_TRAITS) {
    for (const otherId of entry.tensionWith ?? []) {
      const other = TRAIT_BY_ID.get(otherId);
      if (other && !(other.tensionWith ?? []).includes(entry.id)) {
        errors.push(`${entry.id} tension with ${otherId} is not symmetric.`);
      }
    }
  }

  return errors;
}

export function validateCharacterProfileTraitSelection(
  ids: readonly string[],
  lineageId?: string
): CharacterProfileTraitValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const unique = new Set(ids);

  if (ids.length !== CHARACTER_PROFILE_TRAIT_SELECTION_COUNT) {
    errors.push(`Choose exactly ${CHARACTER_PROFILE_TRAIT_SELECTION_COUNT} profile traits.`);
  }
  if (unique.size !== ids.length) errors.push("Profile traits cannot be selected more than once.");

  const resolved = ids.flatMap((id) => {
    const entry = getCharacterProfileTrait(id);
    if (!entry) {
      errors.push(`Unknown profile trait: ${id}`);
      return [];
    }
    if (lineageId && entry.allowedLineageIds && !entry.allowedLineageIds.includes(lineageId)) {
      errors.push(`${entry.label} is not available to this lineage.`);
    }
    if (lineageId && entry.blockedLineageIds?.includes(lineageId)) {
      errors.push(`${entry.label} is blocked for this lineage.`);
    }
    return [entry];
  });

  const bodyFrames = resolved.filter((entry) => entry.category === "body.frame");
  if (bodyFrames.length !== 1) errors.push("Choose exactly one Body Frame trait.");

  const categoryCounts = new Map<CharacterProfileTraitCategory, number>();
  let physicalCount = 0;
  for (const entry of resolved) {
    categoryCounts.set(entry.category, (categoryCounts.get(entry.category) ?? 0) + 1);
    if (getCharacterProfileTraitDomain(entry.category) === "physical") physicalCount += 1;
  }

  for (const [category, count] of categoryCounts) {
    if (category !== "body.frame" && count > CHARACTER_PROFILE_TRAIT_MAX_NON_FRAME_CATEGORY) {
      errors.push(`Choose at most ${CHARACTER_PROFILE_TRAIT_MAX_NON_FRAME_CATEGORY} traits from ${category}.`);
    }
  }

  if (physicalCount < CHARACTER_PROFILE_TRAIT_MIN_PHYSICAL) {
    errors.push(`Choose at least ${CHARACTER_PROFILE_TRAIT_MIN_PHYSICAL} physical profile traits.`);
  }
  if (physicalCount > CHARACTER_PROFILE_TRAIT_MAX_PHYSICAL) {
    errors.push(`Choose at most ${CHARACTER_PROFILE_TRAIT_MAX_PHYSICAL} physical profile traits.`);
  }
  const mentalSocialCount = resolved.length - physicalCount;
  if (mentalSocialCount < CHARACTER_PROFILE_TRAIT_MIN_MENTAL_SOCIAL) {
    errors.push(`Choose at least ${CHARACTER_PROFILE_TRAIT_MIN_MENTAL_SOCIAL} mental/social profile traits.`);
  }

  const selected = new Set(resolved.map((entry) => entry.id));
  for (const entry of resolved) {
    for (const conflictId of entry.conflictsWith ?? []) {
      if (selected.has(conflictId)) {
        errors.push(`${entry.label} conflicts with ${getCharacterProfileTrait(conflictId)?.label ?? conflictId}.`);
      }
    }
    for (const tensionId of entry.tensionWith ?? []) {
      if (selected.has(tensionId) && entry.id < tensionId) {
        warnings.push(`${entry.label} creates a deliberate tension with ${getCharacterProfileTrait(tensionId)?.label ?? tensionId}.`);
      }
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
}

export function aggregateCharacterProfileTraitWeights(
  ids: readonly string[]
): CharacterProfileTraitWeights {
  const weights: CharacterProfileTraitWeights = {};
  for (const id of ids) {
    const entry = getCharacterProfileTrait(id);
    if (!entry) continue;
    for (const [key, value] of Object.entries(entry.attributeWeights) as Array<[PlayerAttributeKey, number]>) {
      weights[key] = (weights[key] ?? 0) + value;
    }
  }
  return weights;
}

function pickIndex(length: number, rng: () => number): number {
  if (length <= 1) return 0;
  return Math.min(length - 1, Math.floor(Math.max(0, Math.min(0.999999999, rng())) * length));
}

function shuffled<T>(values: readonly T[], rng: () => number): T[] {
  const next = [...values];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = pickIndex(i + 1, rng);
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

function pickDistinctTraits(
  category: CharacterProfileTraitCategory,
  count: number,
  rng: () => number
): CharacterProfileTraitId[] {
  return shuffled(getCharacterProfileTraitsByCategory(category), rng)
    .slice(0, count)
    .map((entry) => entry.id);
}

function chooseCategorySlots(
  categories: readonly CharacterProfileTraitCategory[],
  count: number,
  rng: () => number
): CharacterProfileTraitCategory[] {
  const slots = categories.flatMap((category) => [category, category]);
  return shuffled(slots, rng).slice(0, count);
}

export function generateRandomCharacterProfileTraitIds(
  rng: () => number = Math.random
): CharacterProfileTraitId[] {
  const bodyFrame = pickDistinctTraits("body.frame", 1, rng)[0]!;
  const physicalCount = 2 + pickIndex(3, rng); // 2..4 including body frame
  const physicalSlots = chooseCategorySlots(
    ["physical.aptitude", "physical.condition"],
    physicalCount - 1,
    rng
  );
  const mentalCount = CHARACTER_PROFILE_TRAIT_SELECTION_COUNT - physicalCount;
  const mentalSlots = chooseCategorySlots(
    ["temperament", "cognition", "presence"],
    mentalCount,
    rng
  );

  const categoryCounts = new Map<CharacterProfileTraitCategory, number>();
  for (const category of [...physicalSlots, ...mentalSlots]) {
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  const selected: CharacterProfileTraitId[] = [bodyFrame];
  for (const [category, count] of categoryCounts) {
    selected.push(...pickDistinctTraits(category, count, rng));
  }

  const validation = validateCharacterProfileTraitSelection(selected);
  if (!validation.isValid) {
    throw new Error(`Profile trait randomization produced an invalid selection: ${validation.errors.join(" | ")}`);
  }
  return selected;
}
