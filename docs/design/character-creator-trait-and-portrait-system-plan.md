# Character Creator Trait And Portrait System Plan

## Status

Planning-only design authority.

This document captures the intended renovation of character creation around canonical trait tags, deterministic starting-stat resolution, cosmetic customization, and portrait-generation inputs.

This document does **not** authorize implementation changes, save-schema changes, generated-output updates, test rewrites, or removal of the current Physique / Nature / Focus system by itself. A later implementation task should consume this plan deliberately.

Created on a dedicated planning branch so current Codex / GPT implementation work on master remains untouched.

## Purpose

Replace the current Physique / Nature / Focus character-profile model with a composable trait system that:

- gives players clearer control over what kind of person they are creating;
- preserves the nine-attribute model and the current 100-point starting-stat invariant;
- keeps biological sex as a small, lineage-contextual mechanical input;
- uses the same canonical character data to drive portrait generation;
- allows extensive cosmetic customization without granting statistical power;
- prevents contradictory selections through explicit, data-authored exclusivity rules;
- does not make image generation authoritative for gameplay data;
- remains deterministic, testable, provider-independent, and usable when portrait generation is unavailable.

## Current Repo Reality

Relevant current authority includes:

- packages/shared/types/src/contracts.ts
- packages/shared/types/src/player-origins.ts
- apps/rpg-ui/src/game-shell/characterCreationForm.ts
- apps/rpg-ui/src/game-shell/characterCreationIdentityOptions.ts
- apps/rpg-ui/src/game-shell/characterCreationMath.ts
- apps/rpg-ui/src/game-shell/characterCreationCatalog.ts
- apps/rpg-ui/src/game-shell/characterCreationRandomization.ts
- apps/rpg-ui/src/game-shell/newGameSnapshot.ts
- apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx
- tests/unit/character-creation-profile-resolver.test.mjs
- tests/simulation/save-load-roundtrip.test.mjs
- docs/data-dictionary/player-stats.md
- docs/design/attribute-skill-ability-responsibility-audit.md

Current character-profile generation:

1. resolves lineage base attributes;
2. applies sex adjustment;
3. applies age adjustment;
4. applies height adjustment;
5. applies backstory adjustment;
6. resolves Physique / Nature / Focus;
7. generates exactly 10 profile points;
8. produces a 100-point starting attribute total before later Legacy preparation effects.

The renovation should preserve the deterministic 10-point profile allocation behavior while replacing the three old categorical selectors with trait data.

## Settled Design Decisions

### Biological sex remains mechanically meaningful

Character sex remains a structural identity field and a small source of starting-attribute variation.

For humans, the intended scale is approximately one point shifted between relevant attributes, not a large bonus or penalty. The distinction should matter without making either sex unsuitable for any build.

Recommended human baseline:

| Sex | Starting adjustment |
| --- | --- |
| Male | STR +1, AGI -1 |
| Female | AGI +1, STR -1 |

This is a direct modifier and is not part of the six-trait profile pool.

The exact profile is lineage-owned. Other lineages must not automatically inherit human dimorphism merely because a shared default exists. A lineage may have stronger, weaker, differently expressed, or effectively absent sex-based stat differences if its biology and lore justify that choice.

All sex-adjustment vectors should sum to zero so this choice redistributes starting capability rather than changing total starting power.

The canonical playable creator model should remain male / female. The currently dormant neutral shared-type value should not be carried forward merely for compatibility if no game system requires it.

### Traits describe individual variation

Mechanical traits describe ordinary, meaningful characteristics of an individual rather than exceptional achievements.

Good examples:

- Stocky
- Wiry
- Athletic
- Hardy
- Graceful
- Disciplined
- Resolute
- Analytical
- Studious
- Commanding
- Reserved

Poor examples for this system:

- Genius
- Herculean
- Master Strategist
- Supernaturally Beautiful
- Unbreakable Will
- Prodigy

Exceptional capability should come from progression, skills, abilities, equipment, circumstances, and play rather than inflated creator labels.

### Cosmetic descriptors do not grant stats

Cosmetic choices may contribute strongly to portrait generation while contributing nothing to the attribute resolver.

Examples:

- freckles;
- scars;
- tattoos;
- piercings;
- hair texture;
- hair length;
- hairstyle;
- facial-hair style;
- face shape;
- nose shape;
- lip shape;
- complexion detail.

Do not invent stat associations for visual details. Freckles do not imply WIS. Eye color does not imply INT. Physical attractiveness does not automatically imply CHA.

### The portrait depicts character data

Canonical identity and descriptor IDs are authoritative.

Gameplay consumes mechanical weights from those IDs.

Portrait generation consumes curated visual language from those same IDs.

The generated image never determines stats, traits, sex, lineage, age, or any other canonical character fact.

## Canonical Trait Shape

Recommended conceptual contract:

~~~ts
type CharacterTraitCategory =
  | "body.frame"
  | "physical.aptitude"
  | "physical.condition"
  | "temperament"
  | "cognition"
  | "presence";

interface CharacterTraitDefinition {
  id: CharacterTraitId;
  category: CharacterTraitCategory;
  label: string;
  description: string;

  // Nonnegative profile-distribution weights.
  // Every stat-bearing trait in v1 should total exactly 8.
  attributeWeights: Partial<Record<PlayerAttributeKey, number>>;

  // Provider-independent authored language for portrait prompt construction.
  portraitFragments: string[];

  // Hard mutual-exclusion authority.
  exclusiveGroupId?: string;

  // Sparse hard conflicts that cannot be represented by one group.
  conflictsWith?: CharacterTraitId[];

  // Optional authoring/UI warning only. Does not invalidate the build.
  tensionWith?: CharacterTraitId[];

  allowedLineageIds?: string[];
  blockedLineageIds?: string[];
}
~~~

Cosmetic descriptors should use the same broad catalog philosophy but omit attributeWeights.

~~~ts
interface CharacterAppearanceDescriptor {
  id: CharacterAppearanceDescriptorId;
  category: CharacterAppearanceCategory;
  label: string;
  description: string;
  portraitFragments: string[];

  exclusiveGroupId?: string;
  conflictsWith?: CharacterAppearanceDescriptorId[];
  allowedLineageIds?: string[];
  blockedLineageIds?: string[];
}
~~~

Do not parse labels or portrait text to discover mechanics. IDs and authored data are the authority.

## Starting Attribute Rule

Preserve the existing starting-stat architecture.

Recommended model:

~~~text
lineage
+ sex
+ age
+ stature
+ backstory
= pre-profile starting attributes

selected mechanical trait weights
-> normalized preference vector
-> deterministic largest-remainder allocation
-> exactly 10 generated profile points

pre-profile attributes
+ 10 generated profile points
= 100 total starting attributes
~~~

Legacy preparation remains a later, separate contribution if that current system is retained.

Mechanical traits should use only nonnegative profile weights in v1. A trait changes where the fixed 10 profile points tend to land. It does not manufacture additional points.

This makes a descriptor such as Slight meaningful without requiring a direct STR penalty. It can bias profile points toward DEX / AGI while other structural inputs still determine the complete character.

## Mechanical Trait Budget

Recommended v1 selection rules:

- exactly **6 stat-bearing traits**;
- exactly **1 Body Frame** trait;
- at least **2 physical-domain traits** total, including Body Frame;
- at most **4 physical-domain traits** total;
- at least **2 mental/social-domain traits** total;
- at most **2 selections from any non-frame category**;
- no duplicate trait IDs;
- no violated hard exclusivity group;
- no explicit hard conflict;
- cosmetic descriptors do not count toward the six-trait budget.

Physical-domain categories:

- Body Frame
- Physical Aptitude
- Physical Condition

Mental/social-domain categories:

- Temperament
- Cognition
- Presence

This permits the old Focus concept to disappear without losing its function.

A physically focused character can spend four of six traits in physical categories.

A learned or social character can spend only the required two physical traits and place four selections into temperament, cognition, or presence.

The selected traits themselves therefore express focus.

## Mechanical Weight Standard

Every mechanical trait below totals **8 weight units**.

These are **weights, not direct stat points**.

Example:

~~~text
Athletic = STR 3, AGI 3, CON 2
~~~

does not mean +3 STR, +3 AGI, +2 CON.

It means Athletic contributes that 8-unit preference vector to the combined trait profile. All six selected trait vectors are summed, normalized, then used to allocate the existing 10 generated profile points.

Equal per-trait weight totals prevent one trait from being secretly worth more than another.

## Recommended V1 Stat-Bearing Trait Catalog

### Body Frame

Body Frame is the primary hard-exclusive physical-shape axis.

Exactly one is required.

All Body Frame entries share exclusiveGroupId = body.frame and therefore cannot coexist with another Body Frame entry.

| ID | Label | Attribute weights | Portrait contribution |
| --- | --- | --- | --- |
| trait.body_frame.large | Large-Framed | STR 4, CON 2, VIT 2 | large frame, substantial overall build |
| trait.body_frame.broad | Broad-Shouldered | STR 4, CON 3, VIT 1 | broad shoulders, strong upper-body frame |
| trait.body_frame.stocky | Stocky | CON 4, STR 3, VIT 1 | stocky build, compact heavy frame |
| trait.body_frame.compact | Compact | CON 3, VIT 3, DEX 2 | compact build, dense balanced frame |
| trait.body_frame.wiry | Wiry | DEX 3, AGI 3, CON 2 | wiry build, lean corded musculature |
| trait.body_frame.lithe | Lithe | AGI 4, DEX 3, VIT 1 | lithe build, light flexible frame |
| trait.body_frame.lean | Lean | AGI 3, DEX 3, VIT 2 | lean build, low body mass, defined frame |
| trait.body_frame.slight | Slight | DEX 4, AGI 3, VIT 1 | slight frame, narrow light build |

Recommended semantic distinctions:

- Stocky means short-to-moderate proportions with a thick, compact frame.
- Wiry means lean, taut, and lightly built rather than broad or heavy.
- Lithe means light, flexible, and fluid in proportion.
- Lean means low body mass without necessarily implying the flexibility of Lithe.
- Slight means visibly small or delicate in frame without making the character mechanically helpless.
- Large-Framed describes overall scale.
- Broad-Shouldered describes upper-body structure.
- Compact describes dense proportions without requiring the bulk of Stocky.

### Physical Aptitude

Physical Aptitude describes how the character naturally handles movement, force, balance, or coordination.

Maximum two selections.

| ID | Label | Attribute weights | Portrait contribution |
| --- | --- | --- | --- |
| trait.physical_aptitude.athletic | Athletic | STR 3, AGI 3, CON 2 | athletic conditioning, capable balanced physique |
| trait.physical_aptitude.graceful | Graceful | AGI 4, DEX 3, CHA 1 | graceful carriage, fluid controlled posture |
| trait.physical_aptitude.nimble | Nimble | AGI 4, DEX 3, VIT 1 | light responsive movement, nimble posture |
| trait.physical_aptitude.quick_handed | Quick-Handed | DEX 4, AGI 2, INT 1, WIS 1 | precise hands, alert hand-eye coordination |
| trait.physical_aptitude.steady | Steady | CON 3, DEX 2, WIS 2, VIT 1 | stable posture, controlled economical movement |
| trait.physical_aptitude.powerful | Powerful | STR 4, CON 2, VIT 2 | powerful musculature, forceful physical presence |
| trait.physical_aptitude.sure_footed | Sure-Footed | AGI 3, CON 2, DEX 2, WIS 1 | grounded stance, sure-footed balance |
| trait.physical_aptitude.coordinated | Coordinated | DEX 3, AGI 3, WIS 1, INT 1 | coordinated movement, precise body control |

### Physical Condition

Physical Condition describes baseline bodily robustness or conditioning.

Maximum two selections.

| ID | Label | Attribute weights | Portrait contribution |
| --- | --- | --- | --- |
| trait.physical_condition.muscular | Muscular | STR 4, CON 2, VIT 2 | visibly developed musculature |
| trait.physical_condition.hardy | Hardy | CON 4, VIT 3, STR 1 | hardy constitution, weather-resistant appearance |
| trait.physical_condition.vigorous | Vigorous | VIT 4, AGI 2, CON 2 | vigorous healthy appearance, energetic posture |
| trait.physical_condition.enduring | Enduring | VIT 4, CON 2, SPT 2 | endurance-trained bearing, durable physical presence |
| trait.physical_condition.tough | Tough | CON 4, VIT 2, SPT 2 | toughened appearance, resilient bearing |
| trait.physical_condition.robust | Robust | CON 3, VIT 3, STR 2 | robust healthy build, substantial vitality |

Do not add Frail, Sickly, or Sluggish to this positive profile-weight catalog until a deliberate flaw / drawback design exists.

Those labels describe disadvantages. Encoding them as hidden alternate routes to bonus points makes the semantics muddy.

They can return later through a separate flaw system, injury state, illness system, aging effects, or optional background complications.

### Temperament

Temperament describes habitual emotional and behavioral disposition.

Maximum two selections.

| ID | Label | Attribute weights | Portrait contribution |
| --- | --- | --- | --- |
| trait.temperament.disciplined | Disciplined | WIS 3, SPT 3, INT 2 | controlled expression, composed attentive bearing |
| trait.temperament.resolute | Resolute | SPT 4, WIS 2, CON 2 | steady determined expression, unyielding posture |
| trait.temperament.patient | Patient | WIS 4, SPT 3, INT 1 | patient attentive expression, unhurried demeanor |
| trait.temperament.bold | Bold | SPT 3, CHA 3, WIS 1, VIT 1 | confident direct gaze, bold bearing |
| trait.temperament.cautious | Cautious | WIS 4, INT 2, SPT 2 | watchful expression, guarded attentive demeanor |
| trait.temperament.curious | Curious | INT 4, WIS 2, SPT 1, CHA 1 | inquisitive expression, alert interested gaze |
| trait.temperament.even_tempered | Even-Tempered | SPT 3, WIS 3, CHA 2 | calm balanced expression, emotionally steady bearing |
| trait.temperament.adaptable | Adaptable | WIS 2, INT 2, SPT 2, CHA 2 | responsive observant demeanor, socially flexible bearing |

### Cognition

Cognition describes the character's preferred way of processing information and solving problems.

Maximum two selections.

| ID | Label | Attribute weights | Portrait contribution |
| --- | --- | --- | --- |
| trait.cognition.analytical | Analytical | INT 4, WIS 3, SPT 1 | focused evaluative gaze, thoughtful expression |
| trait.cognition.intuitive | Intuitive | WIS 4, SPT 2, INT 1, CHA 1 | perceptive inward-focused expression |
| trait.cognition.practical | Practical | WIS 3, INT 2, DEX 2, SPT 1 | pragmatic attentive demeanor, work-ready bearing |
| trait.cognition.studious | Studious | INT 4, WIS 2, SPT 2 | scholarly attentive expression, learned bearing |
| trait.cognition.inventive | Inventive | INT 4, DEX 2, WIS 1, SPT 1 | alert inventive expression, hands-on problem-solver bearing |
| trait.cognition.observant | Observant | WIS 4, INT 2, DEX 1, AGI 1 | scanning attentive gaze, keen visual awareness |
| trait.cognition.methodical | Methodical | INT 3, WIS 3, SPT 2 | orderly focused demeanor, deliberate attention |
| trait.cognition.imaginative | Imaginative | INT 3, SPT 3, WIS 1, CHA 1 | reflective expressive gaze, imaginative demeanor |

### Presence

Presence describes how the character tends to register socially.

Maximum two selections, although one will usually be sufficient.

| ID | Label | Attribute weights | Portrait contribution |
| --- | --- | --- | --- |
| trait.presence.commanding | Commanding | CHA 4, SPT 2, WIS 2 | commanding posture, authoritative gaze |
| trait.presence.warm | Warm | CHA 4, WIS 2, SPT 2 | warm open expression, approachable demeanor |
| trait.presence.reserved | Reserved | WIS 3, SPT 3, INT 2 | restrained expression, reserved demeanor |
| trait.presence.stern | Stern | SPT 3, CHA 3, WIS 2 | stern expression, firm unsmiling bearing |
| trait.presence.amiable | Amiable | CHA 4, WIS 3, SPT 1 | amiable expression, easy social warmth |
| trait.presence.intimidating | Intimidating | CHA 3, SPT 3, CON 1, STR 1 | intimidating bearing, hard direct presence |
| trait.presence.poised | Poised | CHA 3, WIS 3, SPT 2 | poised posture, composed social presence |
| trait.presence.enigmatic | Enigmatic | CHA 3, SPT 3, INT 2 | unreadable expression, enigmatic presence |

## Mutual Exclusivity System

Mutual exclusivity should be explicit data, never inferred by text comparison.

There are three useful levels.

### 1. Hard exclusive groups

exclusiveGroupId defines traits that represent alternate values on one physical or descriptive axis.

The v1 mechanical example is Body Frame.

~~~ts
{
  id: "trait.body_frame.stocky",
  exclusiveGroupId: "body.frame"
}

{
  id: "trait.body_frame.wiry",
  exclusiveGroupId: "body.frame"
}

{
  id: "trait.body_frame.lithe",
  exclusiveGroupId: "body.frame"
}
~~~

Because all three share body.frame, selecting one automatically replaces or blocks the others.

This is the preferred solution for Stocky versus Wiry versus Lithe. Do not maintain an O(n²) list in which every frame trait manually names every other frame trait.

Recommended behavior in the creator:

- selecting an unselected trait from the same exclusive group replaces the previous selection in one action;
- the UI should explain the replacement rather than throwing an error;
- persisted invalid states are rejected by validation rather than silently repaired during load.

### 2. Explicit hard conflicts

conflictsWith exists for contradictions that cross categories and cannot be represented by a single axis.

Use it sparingly.

Example future case:

~~~ts
{
  id: "trait.appearance.hair.shaved",
  conflictsWith: [
    "trait.appearance.hair_style.long_braid",
    "trait.appearance.hair_style.waist_length"
  ]
}
~~~

Mechanical v1 should need very few cross-category hard conflicts.

A Stocky character may also be Graceful.

A Lithe character may also be Hardy.

A Muscular character may also be Nimble.

Do not over-police combinations merely because they are statistically uncommon.

### 3. Semantic tension warnings

Some descriptors can pull in opposite directions without being logically impossible.

Examples:

- Bold + Cautious
- Warm + Stern
- Amiable + Intimidating
- Methodical + Imaginative

These should not be hard-invalid by default.

If desired, tensionWith can let the UI show a subtle note such as:

"These traits create a deliberately contrasting personality."

The player should be allowed to make a complex person.

## Recommended Exclusivity Groups Beyond Mechanics

The same system should govern cosmetic descriptors.

Suggested appearance axes:

| exclusiveGroupId | Meaning | Example members |
| --- | --- | --- |
| body.frame | Primary body frame | Stocky, Wiry, Lithe, Compact |
| hair.length | Hair length | Shaved, Cropped, Short, Shoulder-Length, Long |
| hair.texture | Hair texture | Straight, Wavy, Curly, Coiled |
| hair.primary_style | Dominant hairstyle | Loose, Tied Back, Braided, Bun |
| facial_hair.primary_style | Dominant facial hair | Clean-Shaven, Stubble, Mustache, Short Beard, Full Beard |
| face.shape | Primary face shape | Angular, Round, Long, Broad, Heart-Shaped |
| complexion.detail.primary | Dominant complexion treatment if needed | Clear, Freckled, Ruddy, Weathered |

Not every cosmetic category must be exclusive.

Scars, tattoos, piercings, birthmarks, and similar marks can be multi-select with sensible count limits.

## Cosmetic Descriptor Boundary

A cosmetic descriptor can be richly meaningful to portrait generation while having no attributeWeights.

Recommended initial cosmetic families:

- face shape;
- cheekbone shape;
- jaw shape;
- nose shape;
- lip shape;
- brow shape;
- hair length;
- hair texture;
- hairstyle;
- facial hair;
- freckles;
- scars;
- tattoos;
- piercings;
- birthmarks;
- weathering;
- grooming state;
- optional expression modifiers.

Existing structural coloration fields remain separate canonical identity choices:

- skin tone;
- eye color;
- hair color;
- optional hair highlight color.

These should continue to be visual only unless a later lineage system explicitly defines a non-cosmetic biological mechanic.

## Attractiveness Is Not Charisma

Do not use Beautiful, Handsome, Comely, Plain, or similar visual judgments as direct CHA mechanics.

CHA represents social presence, projection, leadership, morale influence, negotiation pressure, and attention direction.

A character can be physically attractive and socially ineffective.

A character can be physically plain and extremely commanding.

If attractiveness descriptors are later offered, they belong in portrait / appearance data unless another explicit game system consumes them.

## Structural Identity Versus Traits

Recommended canonical separation:

~~~text
Structural identity
- name
- lineage
- biological sex
- age band
- stature / height
- skin tone
- eye color
- hair color

Mechanical traits
- exactly six selected stat-bearing descriptors

Cosmetic descriptors
- zero or more image-only descriptors within category limits

World / history
- origin location
- backstory
- starting package
- Legacy selections
~~~

Sex is not an ordinary trait tag.

Lineage is not an ordinary trait tag.

Age and height are not ordinary trait tags.

Those fields have independent rules and can contribute their own direct modifiers.

## Recommended Persistence Target

Replacement direction:

~~~ts
interface PlayerIdentityProfile {
  heightCm: number | null;
  ageBandId: PlayerIdentityAgeBandId | null;

  traitTagIds: CharacterTraitId[];
  appearanceDescriptorIds: CharacterAppearanceDescriptorId[];

  hairColorId: string | null;
  hairHighlightColorId: string | null;
  eyeColorId: string | null;
  skinToneId: string | null;
}
~~~

The old physiqueId, natureId, and focusId fields should be removed when the new system becomes authoritative rather than retained indefinitely as mirrors.

If development saves may be discarded for this renovation, prefer a clean schema cut over permanent compatibility code.

## Portrait State Boundary

Generated portrait state should remain separate from canonical identity.

Recommended shape:

~~~ts
interface PlayerPortraitState {
  assetRef: string | null;
  promptVersion: number;
  sourceTraitTagIds: CharacterTraitId[];
  sourceAppearanceDescriptorIds: CharacterAppearanceDescriptorId[];
  generationId: string | null;
  stale: boolean;
}
~~~

Changing any portrait-relevant structural identity, trait, coloration, or cosmetic descriptor should mark the existing portrait stale.

Do not regenerate on every click.

Generation should be an explicit player action.

Character creation must remain completable if image generation fails or is unavailable.

Keep initials or another deterministic fallback presentation.

## Portrait Prompt Contract

The portrait subsystem should consume a deterministic provider-independent specification rather than sending internal IDs directly to a model.

Recommended conceptual flow:

~~~text
art direction
+ lineage visual definition
+ biological sex
+ age
+ stature
+ coloration
+ mechanical trait portrait fragments
+ cosmetic descriptor portrait fragments
+ equipment / clothing context if intentionally included
= CharacterPortraitPromptSpec
~~~

Internal IDs such as trait.temperament.resolute should never be expected to carry semantic meaning to an image provider.

The catalog must provide authored portraitFragments such as:

- steady determined expression;
- composed posture;
- lean corded musculature;
- warm open expression;
- angular face;
- long braided auburn hair.

## Example Complete Character

Structural identity:

~~~text
Human
Female
Mature adult
Tall
Warm skin tone
Green eyes
Auburn hair
~~~

Mechanical traits:

~~~text
Lithe
Athletic
Graceful
Disciplined
Analytical
Reserved
~~~

Cosmetic descriptors:

~~~text
Angular face
Freckled
Long hair
Wavy hair
Small scar through right eyebrow
~~~

Gameplay consumes the six mechanical trait weight vectors plus structural direct modifiers.

Portrait generation consumes structural visual data, portrait fragments from the six traits, and all cosmetic descriptors.

The scar and freckles provide no stats.

## Randomization Rules

Randomization must produce valid selections by construction.

Recommended algorithm:

1. choose lineage;
2. choose sex;
3. choose age and height;
4. choose exactly one Body Frame;
5. build a candidate pool excluding hard conflicts;
6. fill mechanical traits until six are selected while respecting:
   - physical minimum and maximum;
   - category maximums;
   - hard conflicts;
   - lineage restrictions;
7. select cosmetic descriptors by category limits;
8. choose lineage-valid coloration;
9. validate final state;
10. retry only if validation unexpectedly fails.

Do not randomize by selecting six arbitrary trait IDs and repeatedly deleting invalid pairs. The randomizer should understand the rule model.

## Validation Rules

At minimum, the canonical resolver should reject:

- unknown trait IDs;
- duplicate trait IDs;
- fewer or more than six mechanical traits;
- zero or more than one Body Frame;
- fewer than two physical-domain traits;
- more than four physical-domain traits;
- more than two traits from a capped non-frame category;
- violated exclusive groups;
- explicit hard conflicts;
- lineage-blocked traits;
- any stat-bearing trait whose weight vector does not total 8;
- negative mechanical profile weights;
- cosmetic descriptors incorrectly included in the stat-bearing trait list.

The portrait adapter should reject unknown descriptor IDs but must not be able to mutate character mechanics.

## Preview And UX Requirements

The trait UI should replace the current long Physique / Nature / Focus card stacks with compact grouped selectors.

Recommended behavior:

- show grouped tag chips or compact cards;
- keep selected traits visible in a persistent "Your Character" row;
- show six mechanical slots clearly without making them look like six identical dropdowns;
- distinguish stat-bearing traits from appearance-only customization;
- update the nine-attribute preview live;
- allow the player to inspect why each attribute changed;
- show portrait relevance without exposing prompt-engineering language;
- automatically replace the previous trait when selecting another member of a hard exclusive group;
- disable or explain genuinely incompatible selections;
- avoid treating soft personality tensions as invalid;
- show when a generated portrait is stale after identity changes.

The current Focus choice should disappear. Physical / mental / social emphasis emerges from the six selected traits.

## Attribute Preview Breakdown

The current preview source rows should evolve from:

- Racial Baseline
- Sex
- Age
- Height
- Backstory
- Generated Build/Profile
- Legacy Preparation

to:

- Racial Baseline
- Sex
- Age
- Height
- Backstory
- Selected Traits
- Legacy Preparation

For deeper inspection, Selected Traits can expand to show which traits contributed weight toward the 10-point profile distribution.

Do not display the 8-unit trait weight vectors as if they were direct stat bonuses.

## Sex Modifier Data Ownership

The current shared lineage profile already exposes sexAttributeAdjustments, but the future authority should be explicit per lineage rather than an accidental universal default.

Recommended principle:

~~~ts
sexAttributeAdjustments: {
  male: { ... },
  female: { ... }
}
~~~

Each playable lineage should intentionally author this record.

For humans:

~~~ts
male:   { STR: 1, AGI: -1 }
female: { AGI: 1, STR: -1 }
~~~

For non-human lineages, biology and setting lore determine whether the same relationship exists.

Hybrid lineages need an explicit rule. Recommended default is deterministic derivation from their parent lineages only if that derivation produces sensible lore. Otherwise author the hybrid directly.

Do not silently fall back to the human profile when lineage data is missing. Missing sex-modifier authority should be visible during development validation.

## Balance Properties

The proposed system deliberately protects several invariants.

### No trait grants more power than another

Every mechanical trait has weight total 8.

### More cosmetics do not increase power

Appearance descriptors have no attributeWeights.

### Fewer traits do not create stronger specialization

Exactly six mechanical traits are required.

### More traits do not create more points

All mechanical weights feed the same fixed 10-point generated profile pool.

### Sex is meaningful but non-prohibitive

Sex shifts a very small number of points and does not set caps.

A female character with strength-oriented lineage, frame, physical traits, backstory, progression, and equipment can exceed a male character who did not make those choices, and vice versa for agility.

### Focus is emergent

Players express martial, balanced, learned, mystic, or social tendencies through trait selection instead of a separate percentage-control selector.

## Required Tests

Replace or extend the current Physique / Nature / Focus combinatorial tests with trait-rule coverage.

Required unit coverage:

- every catalog mechanical trait has exactly 8 total weight;
- every mechanical weight is an integer and nonnegative;
- every valid six-trait selection resolves deterministically;
- every valid selection generates exactly 10 profile points;
- every valid selection reaches the expected 100-point starting total before later Legacy adjustments;
- trait order does not affect results;
- duplicate traits are rejected;
- two Body Frame traits are rejected;
- Stocky + Wiry is rejected through the shared body.frame exclusive group;
- Stocky + Lithe is rejected through the shared body.frame exclusive group;
- Wiry + Lithe is rejected through the shared body.frame exclusive group;
- fewer or more than six mechanical traits are rejected;
- category caps are enforced;
- physical-domain minimum and maximum are enforced;
- explicit cross-category hard conflicts are enforced;
- soft tensions do not invalidate a build;
- cosmetic descriptors never alter stat resolution;
- sex adjustments remain zero-sum;
- each playable lineage has explicit male / female sex-adjustment authority;
- randomization always produces a valid trait set;
- save/load round trip preserves canonical trait and appearance IDs;
- identical canonical identity produces identical portrait prompt specification;
- portrait-generation failure does not block character creation;
- changing a portrait-relevant selection marks the portrait stale without changing stats outside the normal resolver.

## Implementation Sequence

### Phase 1: Authority and catalog

- add canonical trait and appearance descriptor types;
- author the trait catalog;
- author selection and exclusivity rules;
- author explicit per-lineage sex-adjustment data;
- add catalog integrity tests.

No UI rewrite should precede a stable catalog contract.

### Phase 2: Resolver replacement

- replace Physique / Nature / Focus weight resolution;
- aggregate six selected trait vectors;
- preserve deterministic 10-point largest-remainder allocation;
- preserve starting-total invariants;
- update preview source naming.

### Phase 3: Form, persistence, and randomization

- replace physiqueId / natureId / focusId with traitTagIds;
- add appearanceDescriptorIds;
- update validation;
- update randomization;
- update snapshot creation;
- update save/load fixtures.

### Phase 4: Creator UI

- replace the three old exclusive card sections;
- add grouped tag selection;
- add selection-count and conflict feedback;
- add cosmetic customization;
- preserve live attribute preview.

### Phase 5: Portrait prompt contract

- create CharacterPortraitPromptSpec;
- add deterministic prompt construction;
- add prompt-versioning tests;
- keep provider integration outside gameplay authority.

### Phase 6: Portrait asset integration

- add explicit generation action;
- persist portrait asset reference separately;
- mark portraits stale when source identity changes;
- preserve fallback initials;
- ensure generation failure never invalidates a playable character.

## Implementation Guardrails

A future coding pass consuming this artifact should:

- inspect current master before editing because adjacent creator work may have moved;
- treat this document as intent, not proof that old file paths remain unchanged;
- preserve unrelated Codex / GPT changes;
- avoid broad formatting churn;
- avoid touching generated outputs unless the implementation task explicitly requires them;
- keep the stat resolver deterministic;
- keep image generation outside canonical mechanics;
- prefer a clean replacement of Physique / Nature / Focus rather than running both systems indefinitely;
- update tests in the same implementation slice as authority changes;
- stop and surface a design conflict if another active branch has already established incompatible character-creator authority.

## Deferred Questions

These do not block the planning artifact but should be deliberately settled before or during implementation.

1. Exact sex-based adjustment vectors for every non-human lineage.
2. Whether hybrid lineages derive or author sex dimorphism directly.
3. Final cosmetic descriptor catalog and per-category limits.
4. Whether flaw / drawback traits become a separate future system.
5. Whether portrait generation occurs during creation only, or can also be invoked later from the character profile.
6. Whether clothing / starting equipment should influence the initial portrait or remain portrait-independent.
7. Exact visual art-direction prompt shared across all generated character portraits.

## Recommended V1 Decision Summary

Use one canonical descriptor architecture with two gameplay roles:

- **mechanical traits**: exactly six, feed stats and usually portrait generation;
- **appearance descriptors**: optional, feed portrait generation only.

Use explicit exclusivity groups for alternate values on the same axis.

Use body.frame to make Stocky, Wiry, Lithe, and the other primary frame choices mutually exclusive.

Use sparse hard conflicts only where an incompatibility crosses axes.

Allow personality tension instead of banning every apparently opposite pair.

Keep biological sex as a small zero-sum, lineage-specific starting modifier.

Keep the generated trait contribution fixed at 10 points.

Remove Focus once trait selection becomes authoritative because the selected traits themselves express the character's physical, mental, and social emphasis.

The resulting authority chain is:

~~~text
canonical structural identity
+ six canonical mechanical traits
+ optional cosmetic descriptors
          |
          +--> deterministic starting-stat resolver
          |
          +--> deterministic portrait prompt specification
                        |
                        +--> generated portrait asset
~~~

The image represents the character. It does not define the character.
