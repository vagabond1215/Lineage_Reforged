# Character Creator Appearance And Portrait Generation Plan

## Status

Planning-only companion authority for:

- `docs/design/character-creator-trait-and-portrait-system-plan.md`
- `docs/design/character-creator-lineage-sex-dimorphism-plan.md`

This document refines the appearance-customization and portrait-generation portions of the character-creator renovation.

It records:

- the durable cosmetic descriptor model;
- the separation between character facts and renderer instructions;
- the recommended initial portrait framing for low-cost / free generation services;
- provider-independent prompt construction;
- lineage and sex visibility rules;
- appearance exclusivity and dependency rules;
- portrait asset persistence and stale-state behavior;
- the migration path from a testing generator to a production-quality provider.

This document does **not** authorize source edits, save-schema changes, content rewrites, generated-output updates, provider integration, or test modifications by itself.

It exists on the dedicated `planning/character-creator-trait-system` branch so active implementation work on `master` remains untouched.

## Purpose

The character portrait should represent the canonical character without becoming part of the character's mechanical authority.

During testing, portrait generation is expected to use a free or otherwise limited generation service. The initial composition should therefore reduce known failure-prone anatomy, especially hands, while still showing enough of the body for lineage, sex, stature, body-frame traits, clothing, and posture to read clearly.

The recommended test-era portrait is:

> **hips-up, single-character portrait, hands fully out of frame**

This framing is a renderer rule, not a permanent character fact.

When the game later moves to a reliable production image service, the renderer may gain richer composition, pose, equipment, hands, environmental context, or other presentation features without changing the saved character identity or cosmetic descriptor schema.

## Current Repo Reality

Current creator identity already owns lineage-valid:

- height range / stature;
- skin-tone options;
- hair-color options;
- eye-color options.

The current creator does **not** yet own canonical descriptor data for:

- face shape;
- jaw shape;
- cheekbone shape;
- nose shape;
- eye shape;
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
- cosmetic adornments.

Current runtime UI exposes `portraitInitials` rather than a generated portrait asset.

No runtime portrait-generation provider integration is currently authoritative.

The existing lineage creator art under `apps/rpg-ui/public/character-creator/lineages/` is authored card art, not per-character generated portrait state.

This gives the renovation a clean boundary: generated portraits can be added as a new optional representation layer without replacing existing character authority.

## Core Separation Rule

There are three distinct data layers.

### 1. Canonical character facts

Examples:

- lineage;
- biological sex;
- age band;
- height / stature;
- body-frame trait;
- mechanical traits;
- skin tone;
- eye color;
- hair color;
- hair length;
- hair texture;
- hairstyle;
- face shape;
- facial scars;
- tattoos;
- piercings.

These belong to character identity and persist independently of any image provider.

### 2. Portrait prompt specification

Examples:

- provider-independent descriptive fragments;
- subject ordering;
- lineage morphology fragments;
- selected trait fragments;
- appearance fragments;
- clothing context;
- framing requirements;
- visibility priority.

This is a deterministic intermediate representation derived from canonical character data plus a render profile.

### 3. Provider request / renderer instructions

Examples:

- model name;
- image dimensions;
- aspect ratio syntax;
- negative-prompt syntax;
- quality flags;
- seed parameter;
- CFG / sampler settings if the provider exposes them;
- provider-specific safety or style parameters.

These are integration details and must not leak into persisted character identity.

## Durable Character Fact Test

Before adding an appearance field to the save schema, ask:

> Would this still describe the same character if the image provider changed tomorrow?

If yes, it can be canonical identity.

Examples that pass:

- long wavy hair;
- angular face;
- broad nose;
- freckles;
- scar through the left eyebrow;
- full beard;
- pierced left ear.

Examples that fail:

- cinematic rim lighting;
- 4:5 composition;
- hips-up crop;
- hands out of frame;
- painterly background;
- shallow depth of field;
- high-detail facial rendering;
- model-specific negative prompt tokens.

Those belong to render profiles.

## Testing Portrait Composition Authority

Recommended initial render-profile ID:

~~~text
portrait_profile.creator_test_v1
~~~

### Required composition

The test-era portrait should be:

- one character only;
- vertical portrait orientation;
- framed from approximately the hips / upper pelvis to the top of the head;
- head and face fully visible;
- both shoulders visible;
- torso visible enough for build and clothing silhouette to read;
- hands fully outside the generated frame;
- wrists preferably outside the generated frame as well;
- no object that requires a visible hand grip;
- no weapon held across the torso;
- no crossed arms if the hands would enter frame;
- no seated pose requiring visible hands;
- no dramatic action pose;
- no full-body composition.

The purpose is not merely aesthetic. It is a reliability measure for low-cost generation services where hands are a common failure point.

### Recommended aspect ratio

Use a portrait-native master ratio, preferably **4:5** unless provider constraints make **3:4** materially more reliable.

The canonical render profile should express a semantic portrait ratio rather than hard-coding one provider's pixel dimensions.

Example conceptual contract:

~~~ts
aspectRatio: "4:5"
~~~

A provider adapter may translate that to any supported dimensions.

### Face-safe crop zone

Generated images should reserve a face-safe area so the same master portrait can be reused in:

- character-creator preview;
- character overview;
- top-bar portrait;
- compact cards;
- square avatar crops;
- circular avatar crops if later desired.

Recommended composition target:

- eyes near the upper third rather than against the top edge;
- enough headroom for hair, braids, hats, or lineage morphology;
- shoulders and upper torso centered;
- face remains readable after a centered square crop;
- avoid placing essential scars, piercings, ears, or hairstyle features at the extreme image boundary.

Do not generate a separate image merely for every UI crop unless production requirements later justify that cost.

### Hand exclusion should be structural, not wishful

Do not rely only on a negative prompt such as `bad hands`.

The positive composition should make hands unnecessary:

~~~text
hips-up portrait, arms relaxed below the crop, hands fully outside the frame
~~~

Provider-specific negative prompting may reinforce the rule, but the composition itself should remove the problem.

### Prop policy during testing

Default:

~~~text
heldPropsAllowed = false
visibleWeaponsAllowed = false
~~~

A weapon may appear only as a non-hand-dependent background or worn element if the provider handles it reliably, for example:

- sword pommel behind shoulder;
- sheathed weapon at the edge of the crop;
- quiver strap;
- cloak clasp;
- visible armor or tool harness.

Even these should be optional in the test profile.

The first portrait system should optimize identity consistency, not inventory illustration.

## Production Render Profile Boundary

A later production provider may use a different profile, for example:

~~~text
portrait_profile.creator_production_v1
~~~

Production may allow:

- hands;
- held equipment;
- wider poses;
- more environmental context;
- dynamic lighting;
- alternate crops;
- richer clothing detail;
- multiple portrait variants;
- higher resolution;
- provider-side character consistency features.

None of those changes should require rewriting the canonical identity schema.

The production profile should consume the same character facts and `CharacterPortraitPromptSpec` inputs, then apply a different renderer policy.

## Recommended Render Profile Contract

Conceptual shape:

~~~ts
type CharacterPortraitRenderProfileId =
  | "portrait_profile.creator_test_v1"
  | "portrait_profile.creator_production_v1";

interface CharacterPortraitRenderProfile {
  id: CharacterPortraitRenderProfileId;
  promptVersion: number;

  framing: "hips_up" | "waist_up" | "bust" | "full_body";
  aspectRatio: "4:5" | "3:4" | "1:1";
  subjectCount: 1;

  handsPolicy:
    | "exclude"
    | "allow"
    | "prefer_hidden";

  heldPropsAllowed: boolean;
  visibleWeaponsAllowed: boolean;

  posePolicy: "neutral" | "reserved" | "dynamic";
  backgroundPolicy: "simple" | "contextual" | "environmental";

  faceSafeCropRequired: boolean;
}
~~~

This is renderer configuration, not save identity.

## Canonical Appearance Descriptor Contract

Recommended expanded descriptor shape:

~~~ts
interface CharacterAppearanceDescriptorDefinition {
  id: CharacterAppearanceDescriptorId;
  category: CharacterAppearanceCategory;
  label: string;
  description: string;

  portraitFragments: string[];

  exclusiveGroupId?: string;
  conflictsWith?: CharacterAppearanceDescriptorId[];

  requiresAll?: CharacterAppearanceRequirement[];
  requiresAny?: CharacterAppearanceRequirement[];

  allowedSexIds?: Array<"male" | "female">;
  allowedLineageIds?: string[];
  blockedLineageIds?: string[];

  selectionLimitGroupId?: string;
  promptPriority?: number;
}
~~~

Requirements must use canonical data rather than prompt-text matching.

Possible requirement forms:

~~~ts
type CharacterAppearanceRequirement =
  | { type: "hair_length_at_least"; value: CharacterHairLengthRank }
  | { type: "hair_length_at_most"; value: CharacterHairLengthRank }
  | { type: "sex"; value: "male" | "female" }
  | { type: "lineage"; value: string }
  | { type: "descriptor"; value: CharacterAppearanceDescriptorId }
  | { type: "not_descriptor"; value: CharacterAppearanceDescriptorId };
~~~

## Appearance Category Strategy

Use three kinds of categories.

### Structural appearance axes

These represent one primary answer and therefore use hard exclusivity.

Examples:

- face shape;
- nose shape;
- eye shape;
- brow shape;
- hair length;
- hair texture;
- hair density;
- primary hairstyle;
- primary facial-hair style.

### Layerable details

These may coexist within sensible count limits.

Examples:

- freckles;
- scars;
- tattoos;
- piercings;
- birthmarks;
- jewelry / adornments.

### Derived portrait demeanor

Expression and bearing should normally come from mechanical traits rather than a second cosmetic personality system.

Examples:

- Disciplined -> composed expression;
- Resolute -> steady determined gaze;
- Warm -> approachable expression;
- Stern -> stern bearing;
- Reserved -> restrained demeanor.

Do not make the player select `Reserved` mechanically and then separately require an appearance choice of `Cheerful Extrovert` unless an explicit portrait-expression override feature is later designed.

## Existing Color Authority Should Remain Separate

The current creator already owns lineage-valid:

- `skinToneId`;
- `hairColorId`;
- `eyeColorId`;
- optional future `hairHighlightColorId`.

Do not duplicate those as descriptor tags.

For example:

~~~text
hairColorId = hair.auburn
appearance.hair.texture = wavy
appearance.hair.length = long
appearance.hair.style = loose
~~~

is cleaner than one giant descriptor such as:

~~~text
long_wavy_loose_auburn_hair
~~~

The portrait adapter composes them.

## Recommended V1 Appearance Descriptor Catalog

The catalog below is intentionally basic and broadly useful. It should produce recognizable character variation without turning the creator into a forensic face modeller.

### Face Shape

Exclusive group:

~~~text
appearance.face.shape
~~~

Recommended options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.face.shape.oval | Oval | oval face |
| appearance.face.shape.angular | Angular | angular face with defined planes |
| appearance.face.shape.round | Round | round face |
| appearance.face.shape.square | Square | square face |
| appearance.face.shape.long | Long | long narrow face |
| appearance.face.shape.broad | Broad | broad face |
| appearance.face.shape.heart | Heart-Shaped | heart-shaped face |

Recommendation: optional, maximum one.

If none is selected, the provider receives no player-authored face-shape constraint and can resolve a lineage-appropriate neutral face.

### Jaw Shape

Exclusive group:

~~~text
appearance.face.jaw
~~~

Recommended options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.face.jaw.strong | Strong Jaw | strong defined jaw |
| appearance.face.jaw.broad | Broad Jaw | broad jawline |
| appearance.face.jaw.narrow | Narrow Jaw | narrow jawline |
| appearance.face.jaw.soft | Soft Jaw | soft rounded jawline |
| appearance.face.jaw.pointed | Pointed Chin | tapered jaw with pointed chin |

Recommendation: optional, maximum one.

### Cheekbones

Exclusive group:

~~~text
appearance.face.cheekbones
~~~

Recommended options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.face.cheekbones.high | High Cheekbones | high cheekbones |
| appearance.face.cheekbones.pronounced | Pronounced | pronounced cheekbones |
| appearance.face.cheekbones.broad | Broad | broad cheek structure |
| appearance.face.cheekbones.soft | Soft | soft cheek contours |

Recommendation: optional, maximum one.

### Nose Shape

Exclusive group:

~~~text
appearance.face.nose
~~~

Recommended options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.face.nose.straight | Straight | straight nose |
| appearance.face.nose.aquiline | Aquiline | aquiline nose |
| appearance.face.nose.broad | Broad | broad nose |
| appearance.face.nose.narrow | Narrow | narrow nose |
| appearance.face.nose.hooked | Hooked | hooked nose |
| appearance.face.nose.upturned | Upturned | slightly upturned nose |
| appearance.face.nose.crooked | Crooked | naturally crooked nose |

Recommendation: optional, maximum one.

### Eye Shape

Eye color remains structural identity and is not repeated here.

Exclusive group:

~~~text
appearance.face.eye_shape
~~~

Recommended options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.face.eye_shape.almond | Almond | almond-shaped eyes |
| appearance.face.eye_shape.round | Round | round eyes |
| appearance.face.eye_shape.narrow | Narrow | narrow-set eye shape |
| appearance.face.eye_shape.deep_set | Deep-Set | deep-set eyes |
| appearance.face.eye_shape.hooded | Hooded | hooded eyes |
| appearance.face.eye_shape.wide_set | Wide-Set | widely spaced eyes |

Recommendation: optional, maximum one.

### Brows

Exclusive group:

~~~text
appearance.face.brows
~~~

Recommended options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.face.brows.straight | Straight | straight brows |
| appearance.face.brows.arched | Arched | arched brows |
| appearance.face.brows.thick | Thick | thick prominent brows |
| appearance.face.brows.fine | Fine | fine brows |
| appearance.face.brows.heavy | Heavy | heavy-set brows |

Recommendation: optional, maximum one.

### Complexion Details

These modify surface appearance but do not replace skin tone.

Selection limit group:

~~~text
appearance.complexion.detail
~~~

Recommended maximum: two.

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.complexion.freckled | Freckled | natural facial freckles |
| appearance.complexion.weathered | Weathered | weathered skin texture |
| appearance.complexion.sun_lined | Sun-Lined | fine sun and weather lines |
| appearance.complexion.rosy | Rosy | naturally rosy cheeks |
| appearance.complexion.pockmarked | Pockmarked | subtle old pockmark scarring |
| appearance.complexion.smooth | Smooth | smooth even facial complexion |

`Smooth` should conflict with `Pockmarked` and may conflict with `Weathered` if both would produce unclear prompts.

Do not use complexion descriptors to imply mechanical CON, VIT, CHA, or age bonuses.

### Hair Length

Exclusive group:

~~~text
appearance.hair.length
~~~

Recommended options:

| ID | Label | Rank | Portrait fragment |
| --- | --- | ---: | --- |
| appearance.hair.length.shaved | Shaved | 0 | shaved head or nearly shaved hair |
| appearance.hair.length.cropped | Cropped | 1 | close-cropped hair |
| appearance.hair.length.short | Short | 2 | short hair |
| appearance.hair.length.medium | Medium | 3 | medium-length hair |
| appearance.hair.length.shoulder | Shoulder-Length | 4 | shoulder-length hair |
| appearance.hair.length.long | Long | 5 | long hair |
| appearance.hair.length.very_long | Very Long | 6 | very long hair extending well below the shoulders |

Recommendation: exactly one if detailed appearance customization is enabled.

Hair color remains persisted even for Shaved because it is still a durable biological / identity fact and may become visible if the hairstyle later changes.

### Hair Texture

Exclusive group:

~~~text
appearance.hair.texture
~~~

Recommended options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.hair.texture.straight | Straight | straight hair |
| appearance.hair.texture.wavy | Wavy | naturally wavy hair |
| appearance.hair.texture.curly | Curly | naturally curly hair |
| appearance.hair.texture.coiled | Coiled | tightly coiled hair |

Recommendation: maximum one.

Shaved may suppress texture in the prompt without deleting the persisted texture choice, or the creator may disable texture selection while Shaved is active. Prefer disabling / hiding irrelevant controls rather than destroying user data during experimentation.

### Hair Density

Exclusive group:

~~~text
appearance.hair.density
~~~

Recommended options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.hair.density.fine | Fine | fine light hair density |
| appearance.hair.density.average | Average | natural medium hair density |
| appearance.hair.density.thick | Thick | thick dense hair |

Recommendation: optional, maximum one.

### Primary Hairstyle

Exclusive group:

~~~text
appearance.hair.primary_style
~~~

Recommended options:

| ID | Label | Minimum length | Portrait fragment |
| --- | --- | ---: | --- |
| appearance.hair.style.loose | Loose | 2 | hair worn loose |
| appearance.hair.style.side_part | Side Part | 2 | side-parted hair |
| appearance.hair.style.swept_back | Swept Back | 2 | hair swept back from the face |
| appearance.hair.style.tied_back | Tied Back | 3 | hair tied back |
| appearance.hair.style.ponytail | Ponytail | 4 | hair gathered into a ponytail |
| appearance.hair.style.single_braid | Single Braid | 4 | hair arranged in a single braid |
| appearance.hair.style.twin_braids | Twin Braids | 4 | hair arranged in two braids |
| appearance.hair.style.multiple_braids | Multiple Braids | 4 | hair arranged in several braids |
| appearance.hair.style.bun | Bun | 4 | hair gathered into a bun |
| appearance.hair.style.topknot | Topknot | 3 | hair gathered into a topknot |

Do not allow a hairstyle whose minimum-length requirement exceeds the selected hair-length rank.

`Shaved` should suppress the primary-style selector.

### Facial Hair

Exclusive group:

~~~text
appearance.facial_hair.primary_style
~~~

Recommended options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.facial_hair.clean_shaven | Clean-Shaven | clean-shaven face |
| appearance.facial_hair.stubble | Stubble | short facial stubble |
| appearance.facial_hair.mustache | Mustache | distinct mustache |
| appearance.facial_hair.goatee | Goatee | trimmed goatee |
| appearance.facial_hair.short_beard | Short Beard | short full beard |
| appearance.facial_hair.full_beard | Full Beard | full beard |
| appearance.facial_hair.long_beard | Long Beard | long full beard |
| appearance.facial_hair.braided_beard | Braided Beard | long beard arranged in braids |

Default v1 rule should make facial-hair options lineage- and sex-aware through explicit catalog requirements rather than assuming every lineage uses identical Human growth patterns.

For Human-like lineages, male-only facial-hair availability is the sensible default unless lineage lore states otherwise.

Dwarven female facial hair should remain an explicit lore decision rather than being assumed from generic fantasy convention.

If female Dwarven beards become canon, encode that in the Dwarf portrait / appearance authority deliberately.

`Braided Beard` requires a sufficiently long beard style and should not coexist with Stubble, Mustache-only, Goatee, or Short Beard.

### Facial Scars

Scars are layerable.

Selection limit group:

~~~text
appearance.marking.facial_scar
~~~

Recommended maximum: two.

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.scar.left_eyebrow | Left Brow Scar | small scar crossing the left eyebrow |
| appearance.scar.right_eyebrow | Right Brow Scar | small scar crossing the right eyebrow |
| appearance.scar.left_cheek | Left Cheek Scar | visible scar across the left cheek |
| appearance.scar.right_cheek | Right Cheek Scar | visible scar across the right cheek |
| appearance.scar.nose_bridge | Nose Bridge Scar | old scar over the bridge of the nose |
| appearance.scar.upper_lip | Lip Scar | small scar crossing the upper lip |
| appearance.scar.temple | Temple Scar | old scar at the temple |
| appearance.scar.burn_patch | Burn Scar | localized old facial burn scar |

Specific placement is preferable to a vague `scarred face` tag because it gives the prompt adapter a stable visual fact.

Do not attempt to encode complex multi-scar geometry in v1.

### Birthmarks

Selection limit group:

~~~text
appearance.marking.birthmark
~~~

Recommended maximum: one visible facial / neck birthmark.

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.birthmark.cheek | Cheek Birthmark | visible natural birthmark on one cheek |
| appearance.birthmark.temple | Temple Birthmark | natural birthmark near the temple |
| appearance.birthmark.neck | Neck Birthmark | visible natural birthmark along the neck |

If exact left/right placement matters to the player experience, split these IDs before implementation rather than relying on random provider placement.

### Tattoos

Only include tattoo options that are likely to be visible in a hips-up portrait.

Selection limit group:

~~~text
appearance.marking.tattoo
~~~

Recommended maximum: two.

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.tattoo.temple | Temple Tattoo | small tattoo at the temple |
| appearance.tattoo.cheek | Cheek Tattoo | small facial tattoo on the cheek |
| appearance.tattoo.neck | Neck Tattoo | visible tattoo along the neck |
| appearance.tattoo.throat | Throat Tattoo | visible tattoo at the throat |

Do not add forearm, hand, finger, or lower-body tattoo descriptors to the initial portrait catalog because the testing composition intentionally excludes those areas.

They can exist later as character facts if gameplay needs them, but they should not be added solely for an image region the initial generator never shows.

### Piercings

Selection limit group:

~~~text
appearance.adornment.piercing
~~~

Recommended maximum: two.

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.piercing.single_ear | Single Ear Piercing | single simple ear piercing |
| appearance.piercing.multiple_ear | Multiple Ear Piercings | several small ear piercings |
| appearance.piercing.nose_ring | Nose Ring | small nose ring |
| appearance.piercing.brow | Brow Piercing | small eyebrow piercing |

Lineage morphology may determine whether ear-focused adornments are visually prominent, but do not assume ear anatomy that the lineage lore has not explicitly authored.

### Simple Adornments

Selection limit group:

~~~text
appearance.adornment.identity
~~~

Recommended maximum: two.

Possible v1 options:

| ID | Label | Portrait fragment |
| --- | --- | --- |
| appearance.adornment.hair_beads | Hair Beads | a few simple beads worked into the hair |
| appearance.adornment.beard_beads | Beard Beads | a few simple beads worked into the beard |
| appearance.adornment.simple_earrings | Simple Earrings | simple understated earrings |
| appearance.adornment.neck_cord | Neck Cord | simple cord necklace |
| appearance.adornment.headband | Headband | plain practical headband |

These should remain visually modest so they do not become undocumented wealth, magic items, faction symbols, or equipment.

Do not allow a portrait-only cosmetic descriptor to imply ownership of a valuable item.

## Recommended Selection Budget

Unlike mechanical traits, cosmetics should not use a power-budget model.

Recommended creator limits exist only for usability and prompt clarity.

Suggested v1 rules:

- Face Shape: 0 or 1
- Jaw Shape: 0 or 1
- Cheekbones: 0 or 1
- Nose Shape: 0 or 1
- Eye Shape: 0 or 1
- Brows: 0 or 1
- Complexion Details: 0 to 2
- Hair Length: exactly 1 once detailed customization is entered
- Hair Texture: 0 or 1
- Hair Density: 0 or 1
- Primary Hairstyle: 0 or 1
- Facial Hair: 0 or 1
- Facial Scars: 0 to 2
- Birthmarks: 0 or 1
- Tattoos: 0 to 2
- Piercings: 0 to 2
- Simple Adornments: 0 to 2

The UI should not force the player to specify every face subcategory.

An unspecified feature means `not player-authored`, not `missing data`.

## Mutual Exclusivity And Dependency Rules

Appearance uses the same general rule architecture as mechanical traits.

### Exclusive groups

Use one group for alternate answers to one axis.

Examples:

~~~text
appearance.face.shape
appearance.face.jaw
appearance.face.cheekbones
appearance.face.nose
appearance.face.eye_shape
appearance.face.brows
appearance.hair.length
appearance.hair.texture
appearance.hair.density
appearance.hair.primary_style
appearance.facial_hair.primary_style
~~~

Selecting another member of the same group should replace the prior selection.

### Hard conflicts

Use only for true contradictions.

Examples:

~~~text
Smooth complexion <-> Pockmarked complexion
Shaved hair <-> Ponytail
Shaved hair <-> Single Braid
Shaved hair <-> Twin Braids
Shaved hair <-> Bun
Clean-Shaven <-> any beard / mustache style
~~~

Where a dependency rule can express the constraint, prefer the dependency over duplicating many pairwise conflicts.

### Requirements

Examples:

~~~text
Ponytail requires hair length >= Shoulder-Length
Single Braid requires hair length >= Shoulder-Length
Twin Braids requires hair length >= Shoulder-Length
Bun requires hair length >= Shoulder-Length
Topknot requires hair length >= Medium
Braided Beard requires facial-hair capability and Long Beard-scale growth
Hair Beads require visible hair length
Beard Beads require a beard style
~~~

### Count limits

Use selection-limit groups for layerable categories such as scars, tattoos, and piercings.

The validator should reject overflow rather than silently discarding descriptors.

## Lineage Morphology Authority

The image provider must not be expected to infer canonical fantasy anatomy merely from the lineage label.

A future implementation should define an explicit `LineagePortraitProfile`.

Conceptual shape:

~~~ts
interface LineagePortraitProfile {
  lineageId: string;

  morphologyFragments: string[];
  proportionFragments: string[];
  agePresentationFragments?: Partial<
    Record<PlayerIdentityAgeBandId, string[]>
  >;

  allowedAppearanceDescriptorIds?: CharacterAppearanceDescriptorId[];
  blockedAppearanceDescriptorIds?: CharacterAppearanceDescriptorId[];

  sexPresentationFragments?: {
    male: string[];
    female: string[];
  };
}
~~~

This profile is where setting-canonical features such as ear shape, unusual skin morphology, tusks, horns, scales, gills, webbing, or other fantasy anatomy should live if and when lore explicitly establishes them.

Do **not** silently create canon from generic fantasy-model assumptions.

For example, if Half-Orcs are intended to have visible tusks, that should be authored in Lineage Reforged data rather than left to whatever an image model thinks `half-orc` means.

Likewise, if Elves are intended to have a specific ear shape or length, author it explicitly.

The current planning pass should preserve this as a required implementation authority rather than inventing unsupported morphology.

## Biological Sex In Portrait Generation

Biological sex is a structural portrait input.

The portrait should visually depict the selected male / female profile in a lineage-appropriate way.

However, do not convert mechanical modifiers directly into exaggerated anatomy.

Example:

A Human male's `STR +1 / AGI -1` does not mean every male must be muscular.

Actual visible build comes primarily from:

- lineage morphology;
- selected body-frame trait;
- physical-condition traits;
- stature;
- age;
- sex;
- cosmetic descriptors.

Sex should influence the provider's anatomical baseline while individual traits determine the person's specific build.

This ensures an Athletic / Muscular female can look visibly stronger than a Slight / Studious male without contradicting population-level sex modifiers.

## Age Presentation

Age band is structural, not cosmetic.

The portrait adapter should translate age into visible maturity without requiring players to select wrinkle tags merely to make a mature character look mature.

Recommended semantic behavior:

### Young Adult

- youthful adult features;
- minimal age lines;
- adult, not adolescent presentation.

### Prime

- fully mature adult appearance;
- no forced age weathering.

### Mature

- visible mature facial structure;
- modest age lines where lineage-appropriate;
- hair graying only if lineage / color logic supports it.

### Senior

- clearly older adult appearance;
- age lines and mature skin texture;
- provider should preserve selected hair / eye / skin identity while depicting age.

Do not let the image generator interpret `young adult` as a child.

Prompt construction should explicitly preserve adult presentation.

## Height And Hips-Up Portraits

Absolute height is difficult to communicate reliably in a hips-up isolated portrait.

Do not fake height with arbitrary background scale solely to prove that one character is tall.

Instead:

- preserve height as canonical gameplay identity;
- allow stature to influence torso proportion and overall impression subtly;
- let body-frame trait carry the stronger visible silhouette signal;
- do not consider a portrait invalid merely because exact centimeters are not visually measurable.

If future production portraits include environmental scale or full-body compositions, height can become more visibly literal.

## Mechanical Traits In Portrait Generation

Mechanical traits can contribute visual fragments only where they have a sensible visible interpretation.

Examples:

~~~text
Large-Framed -> large frame, substantial build
Wiry -> lean corded musculature
Lithe -> light flexible frame
Muscular -> visibly developed musculature
Graceful -> graceful carriage
Commanding -> authoritative gaze
Reserved -> restrained demeanor
Disciplined -> composed attentive expression
~~~

Cognition traits should be visually subtle.

Do not turn:

~~~text
Analytical
~~~

into exaggerated visual stereotypes such as spectacles, books, or scholarly clothing unless those are independently selected / owned.

A trait may provide only an expression or bearing fragment.

## Expression And Demeanor Priority

Portrait demeanor should be resolved from selected mechanical traits using deterministic priority rather than dumping every adjective into the prompt.

Suggested priority model:

1. Presence trait
2. Temperament trait
3. Cognition trait
4. neutral fallback

Example:

Selected traits:

~~~text
Disciplined
Analytical
Reserved
~~~

Resolved demeanor might become:

~~~text
restrained composed expression, observant focused gaze
~~~

rather than:

~~~text
reserved, disciplined, analytical, thoughtful, observant, focused,
controlled, composed, inward, intellectual, cautious...
~~~

Prompt compression matters, particularly for limited free services.

## Clothing Policy

The initial portrait should depict plausible setting-appropriate clothing, but clothing should not become a second equipment inventory.

Recommended test-era rule:

- clothing is grounded historical-fantasy attire appropriate to the character's starting context;
- no modern garments;
- no unexplained luxury;
- no unexplained magical regalia;
- no faction insignia unless canonically owned;
- no helmet that obscures the face by default;
- no large hood that hides hair / ears / facial features;
- no held weapon;
- starting bundle may influence broad clothing utility only if generation occurs after bundle selection.

Recommended authority order:

~~~text
backstory / starting context
-> broad clothing class
selected starting equipment
-> optional visible worn details
portrait render profile
-> presentation simplification
~~~

The portrait should not be invalidated every time the player later changes armor.

Initial creator portrait is an identity portrait, not a live paper-doll equipment renderer.

## Equipment And Portrait Staleness

Do not make ordinary equipment changes mark the identity portrait stale.

Portrait-relevant canonical inputs should initially be limited to:

- lineage;
- sex;
- age;
- stature if used by prompt spec;
- mechanical traits with portrait fragments;
- skin tone;
- hair color;
- eye color;
- appearance descriptors.

Backstory / starting clothing context can be included at generation time but should be recorded in the prompt provenance if used.

Later production systems may introduce a separate `current appearance` or equipment portrait mode if desired.

## Recommended Character Portrait Prompt Spec

Provider-independent conceptual contract:

~~~ts
interface CharacterPortraitPromptSpec {
  version: number;

  lineageId: string;
  sexId: "male" | "female";
  ageBandId: PlayerIdentityAgeBandId;
  heightCm: number | null;

  traitTagIds: CharacterTraitId[];
  appearanceDescriptorIds: CharacterAppearanceDescriptorId[];

  skinToneId: string;
  hairColorId: string;
  hairHighlightColorId: string | null;
  eyeColorId: string;

  morphologyFragments: string[];
  buildFragments: string[];
  faceFragments: string[];
  hairFragments: string[];
  markingFragments: string[];
  demeanorFragments: string[];
  clothingFragments: string[];

  renderProfileId: CharacterPortraitRenderProfileId;
}
~~~

This specification should be deterministic for the same canonical inputs and prompt version.

## Prompt Assembly Order

Recommended semantic ordering:

~~~text
1. art-direction anchor
2. single-character / portrait composition
3. lineage morphology
4. biological sex
5. age
6. stature / body-frame / physical build
7. face structure
8. skin tone and complexion
9. eye color / eye shape / brows
10. hair color / length / texture / style
11. facial hair
12. scars / tattoos / piercings / adornments
13. demeanor / expression
14. clothing context
15. background policy
16. renderer reliability constraints
~~~

The provider adapter may alter syntax, but it should not alter semantic authority.

## Testing Prompt Composition Example

Canonical identity:

~~~text
Human
Female
Mature
Tall
Warm skin
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

Appearance descriptors:

~~~text
Angular face
High cheekbones
Straight nose
Freckled
Long wavy hair
Hair worn loose
Scar through right eyebrow
~~~

Provider-independent semantic prompt might resolve to:

~~~text
grounded medieval-fantasy character portrait;
single adult human woman;
mature adult;
tall, lithe athletic build with graceful carriage;
angular face with high cheekbones and straight nose;
warm skin with natural freckles;
green eyes;
long wavy auburn hair worn loose;
small old scar crossing the right eyebrow;
restrained composed expression with a focused observant gaze;
practical setting-appropriate clothing;
hips-up framing;
face fully visible;
shoulders and torso visible;
arms continuing below the crop;
hands and wrists fully outside the frame;
simple subdued background
~~~

The stat resolver never receives this prose.

The image provider never receives attribute math.

## Negative / Exclusion Policy During Testing

Provider adapters may add negative or exclusion language where supported.

Recommended test-profile exclusions include:

- extra people;
- duplicate face;
- duplicate limbs;
- visible hands;
- visible fingers;
- cropped forehead;
- hidden face;
- text / lettering / watermark;
- modern clothing;
- modern objects;
- handheld weapon;
- extreme action pose.

Do not persist negative-prompt strings in the save file.

Do not assume every provider supports negative prompting.

Positive composition remains the primary defense.

## Portrait Asset State

Recommended persistence boundary:

~~~ts
interface PlayerPortraitState {
  assetRef: string | null;

  promptSpecVersion: number;
  renderProfileId: CharacterPortraitRenderProfileId;

  sourceIdentityFingerprint: string | null;
  generationId: string | null;
  providerKey: string | null;

  generatedAt: string | null;
  stale: boolean;
}
~~~

The character identity stores character facts.

`PlayerPortraitState` stores the current representation and provenance.

Do not store image bytes directly inside the main save snapshot if avoidable.

Use an asset / blob reference with an ownership and retention strategy defined by the implementation pass.

## Identity Fingerprint

A portrait source fingerprint should be derived from normalized portrait-relevant identity fields.

Conceptual input:

~~~text
promptSpecVersion
lineageId
sexId
ageBandId
height / stature if prompt-relevant
traitTagIds sorted canonically
appearanceDescriptorIds sorted canonically
skinToneId
hairColorId
hairHighlightColorId
eyeColorId
render-profile-independent character portrait facts
~~~

The hash / fingerprint should not include:

- current provider;
- provider model name;
- pixel dimensions;
- transient generation job ID;
- renderer-only negative prompts.

That distinction lets the same character identity be regenerated by a better production provider later.

## Stale Portrait Rule

When portrait-relevant canonical identity changes:

~~~text
current identity fingerprint != portrait source fingerprint
=> portrait stale = true
~~~

Stale means:

- the existing portrait may still display;
- UI should indicate that it no longer exactly represents current character settings;
- the player may explicitly regenerate;
- stats and character validity are unaffected.

Do not auto-regenerate on every click.

Free generation quotas and latency make click-triggered regeneration especially undesirable during testing.

## Explicit Generation Action

Recommended UI behavior:

1. player configures identity / traits / appearance;
2. portrait preview area shows initials or current generated image;
3. `Generate Portrait` action becomes available once required portrait inputs are valid;
4. generation happens only on explicit action;
5. changing a relevant field marks the image `Outdated`;
6. player may choose `Regenerate Portrait`;
7. character creation remains completable without generation.

A generation failure should produce a localized portrait error, not a creator validation error.

## Provider Abstraction

Recommended service boundary:

~~~ts
interface CharacterPortraitProvider {
  key: string;

  generateCharacterPortrait(input: {
    promptSpec: CharacterPortraitPromptSpec;
    renderProfile: CharacterPortraitRenderProfile;
  }): Promise<CharacterPortraitGenerationResult>;
}
~~~

Provider adapters own:

- prompt serialization;
- provider authentication;
- endpoint shape;
- model selection;
- output format;
- provider-specific size translation;
- retries;
- rate-limit interpretation;
- provider-specific safety response mapping.

The character creator should not know those details.

## Free Testing Provider Strategy

The testing provider should be treated as replaceable infrastructure.

Do not design canonical IDs around its prompt vocabulary.

Do not design save state around its image URLs if those URLs are temporary.

Do not assume:

- deterministic seeds are available;
- negative prompts are available;
- image-to-image consistency is available;
- long prompts are followed reliably;
- hands will render correctly;
- provider URLs remain permanent;
- the provider will exist at production launch.

The testing system should prioritize:

1. proving the identity -> prompt -> portrait pipeline;
2. validating user experience;
3. validating asset persistence;
4. validating stale-state behavior;
5. validating prompt-spec determinism;
6. validating lineage / trait / cosmetic composition;
7. learning which descriptor combinations are visually robust.

Image perfection is not the primary testing goal.

## Production Provider Migration

Moving to a production-quality provider should require replacing or extending the provider adapter and render profile, not character data.

Preferred migration:

~~~text
same Character Identity
same Appearance Descriptor IDs
same Mechanical Trait IDs
same Lineage Portrait Authority
           |
           v
new prompt adapter / render profile
           |
           v
higher-quality generation service
~~~

Old portraits can remain valid historical assets or be marked eligible for optional regeneration.

Do not force global regeneration unless there is a compelling storage / art-direction reason.

## Randomization

Appearance randomization should produce coherent descriptors by construction.

Recommended order:

1. choose lineage and sex first;
2. choose structural coloration from lineage-valid palettes;
3. choose hair length;
4. choose compatible hair texture;
5. choose compatible primary hairstyle;
6. choose facial-hair state from lineage / sex-valid catalog;
7. optionally choose one or more face-structure descriptors;
8. optionally choose complexion details;
9. optionally choose scars / tattoos / piercings within limits;
10. validate all requirements and conflicts.

Randomization should not select a braid and later discover that the character has Shaved hair.

## UI Organization

Do not render sixty cosmetic chips in one undifferentiated wall.

Recommended creator grouping:

### Identity

- name;
- biological sex;
- age;
- stature;
- skin tone;
- eye color;
- hair color.

### Build & Character

- six mechanical traits;
- live stats.

### Face

- face shape;
- jaw;
- cheekbones;
- nose;
- eyes;
- brows;
- complexion.

### Hair

- length;
- texture;
- density;
- hairstyle;
- facial hair.

### Marks & Adornments

- scars;
- birthmarks;
- tattoos;
- piercings;
- simple adornments.

### Portrait

- generated image / initials fallback;
- Generate Portrait;
- Regenerate Portrait;
- outdated state;
- generation error state.

The portrait can remain visually present while the player edits appearance so the relationship between choices and output is obvious.

## Compact Versus Advanced Appearance Editing

The initial UI may use progressive disclosure.

Recommended default surface:

- Hair Length
- Hair Texture
- Hairstyle
- Facial Hair when applicable
- Face Shape
- Complexion Details
- Scars / Marks

An `Additional Features` area can expose:

- jaw;
- cheekbones;
- nose;
- eye shape;
- brows;
- piercings;
- adornments.

This keeps the creator approachable without sacrificing customization depth.

All underlying data remains the same regardless of UI disclosure.

## Portrait Preview In The Creator

Recommended test-era preview behavior:

- portrait panel uses the same 4:5 master ratio as the intended generation profile when practical;
- before generation, display initials plus a neutral silhouette / frame rather than fake character art;
- after generation, display the generated portrait;
- if stale, keep displaying it with a visible `Outdated` indicator;
- failed generation leaves the prior image or fallback intact;
- provider status should not block editing.

Do not silently show lineage card art as if it were the player's generated character.

## Runtime Portrait Usage

The generated portrait should eventually replace `portraitInitials` only when a valid asset is available.

Recommended view-model direction:

~~~ts
topBar: {
  portraitAssetRef: string | null;
  portraitInitials: string;
  ...
}
~~~

UI behavior:

~~~text
portraitAssetRef available and loadable
-> render portrait
otherwise
-> render existing initials fallback
~~~

This preserves robustness when:

- generation is skipped;
- generation fails;
- asset storage is temporarily unavailable;
- an old save has no portrait;
- an image URL expires and needs repair.

## Portrait Art Direction

The exact art direction should be authored as a separate stable prompt component rather than repeated inside every descriptor.

The test-era direction should favor:

- grounded medieval / historical fantasy;
- readable face;
- believable anatomy;
- restrained visual effects;
- natural materials;
- no modern fashion or technology;
- no text;
- no UI elements inside the generated image;
- no excessive magical glow unless canonical character data requires it;
- enough neutral consistency that portraits look like members of the same game.

Do not embed character-specific facts into the global art-direction string.

## Historical-Fantasy Appearance Boundary

Appearance options should remain setting-appropriate.

Avoid adding cosmetic options solely because they are fashionable in contemporary avatar creators if they clash with the intended world presentation.

This does not require making every character visually austere.

Historically grounded fantasy can still support:

- braids;
- beads;
- simple earrings;
- nose rings where setting-appropriate;
- tattoos;
- ritual markings;
- scars;
- varied grooming;
- practical headbands;
- elaborate hair where culturally plausible.

Cultural / faction-specific styles should eventually be owned by culture or world content rather than placed in a universal appearance catalog without context.

## Lineage-Specific Appearance Availability

V1 should distinguish between:

### Universally reusable descriptors

Examples:

- angular face;
- broad nose;
- freckles;
- long hair;
- wavy hair;
- eyebrow scar;
- simple ear piercing.

### Lineage-dependent descriptors

Examples may include future:

- lineage-specific facial hair;
- unusual ear adornment requirements;
- lineage morphology markings;
- gill decoration;
- horn decoration;
- tusk decoration;
- scale patterning.

Do not add the second category until the corresponding lineage morphology is explicit canon.

## Prompt Priority And Overflow

Free providers may have limited prompt adherence.

The prompt builder should rank visual facts by importance.

Recommended priority:

1. single subject + framing reliability;
2. lineage + sex + adult age;
3. face identity / skin / eyes / hair color;
4. body-frame and key physical traits;
5. hairstyle and facial hair;
6. scars / birthmarks;
7. demeanor;
8. secondary face-structure details;
9. piercings / small adornments;
10. clothing nuance.

If a provider has a strict prompt budget, lower-priority decorative details may be omitted from a generation request while remaining canonical character facts.

Omission from one renderer request does not erase the descriptor from identity.

## Validation Rules

At minimum, appearance validation should reject:

- unknown descriptor IDs;
- duplicate descriptor IDs;
- more than one member of an exclusive group;
- layerable categories above their selection limits;
- unmet hairstyle length requirements;
- facial-hair selections invalid for the selected lineage / sex authority;
- blocked lineage descriptors;
- explicit hard conflicts;
- descriptors that contain stat adjustments;
- provider syntax inside canonical portrait fragments;
- renderer-only composition fields stored as identity descriptors.

Portrait generation should additionally reject or safely fail on:

- unknown render-profile ID;
- unknown prompt-spec version;
- missing required structural portrait input;
- unavailable provider;
- invalid generated-asset response.

None of those failures should mutate stats.

## Required Tests

### Catalog integrity

- every appearance descriptor ID is unique;
- every exclusive-group reference is valid;
- every dependency references a known descriptor / lineage / sex / hair-length rank;
- no appearance descriptor contains attribute weights;
- selection limits are deterministic;
- conflicts are symmetric where the contract requires symmetry.

### Hair rules

- Shaved cannot produce Ponytail;
- Shaved cannot produce braid styles;
- Short cannot produce Long Braid;
- Shoulder-Length can produce Single Braid;
- hair color persists independently of hair length;
- randomization never emits an invalid hair combination.

### Facial-hair rules

- Clean-Shaven excludes all other facial-hair styles;
- Braided Beard requires a compatible beard state / lineage / sex authority;
- invalid sex / lineage facial-hair combinations are rejected;
- provider prompt receives only the resolved valid facial-hair fragment.

### Marks and adornments

- scar maximum is enforced;
- tattoo maximum is enforced;
- piercing maximum is enforced;
- two scars with distinct IDs can coexist;
- duplicate scar ID is rejected;
- cosmetic marks never change attributes.

### Prompt determinism

- same normalized character identity + same prompt version + same render profile => same prompt spec;
- descriptor ordering in persisted arrays does not change the normalized prompt spec;
- changing a portrait-relevant descriptor changes the identity fingerprint;
- changing provider does not change the identity fingerprint;
- changing provider-specific pixel size does not change the identity fingerprint.

### Test render profile

- framing resolves to hips-up;
- hands policy resolves to exclude;
- held props resolve to false;
- visible weapons resolve to false by default;
- face-safe crop requirement is true;
- the prompt spec contains single-subject framing language;
- character completion remains valid if generation is skipped.

### Stale behavior

- changing hair style marks portrait stale;
- changing scar selection marks portrait stale;
- changing mechanical trait with a portrait fragment marks portrait stale;
- changing a non-portrait gameplay field does not mark portrait stale;
- changing current equipment does not mark the identity portrait stale in v1;
- regeneration updates the source fingerprint only after successful asset creation.

### Provider failure

- timeout does not invalidate character form;
- quota failure does not invalidate character form;
- malformed provider response does not mutate identity;
- failed regeneration does not destroy the last valid portrait asset;
- initials fallback remains available.

## Implementation Sequence

### Phase 1: Appearance authority

- define appearance descriptor IDs and categories;
- define exclusivity groups;
- define selection limits;
- define dependencies;
- settle facial-hair lineage / sex authority;
- add catalog integrity tests.

### Phase 2: Lineage portrait authority

- author explicit lineage morphology fragments;
- avoid generic-model assumptions;
- author age presentation where lineage-specific;
- author sex presentation where lineage-specific;
- add lineage portrait authority tests.

### Phase 3: Creator form and persistence

- add appearance descriptor selections;
- preserve existing coloration fields;
- add validation;
- add randomization;
- update save / load fixtures;
- do not add provider state to canonical identity.

### Phase 4: Provider-independent prompt spec

- add `CharacterPortraitPromptSpec`;
- normalize canonical ordering;
- add prompt version;
- add identity fingerprint;
- add deterministic assembly tests.

### Phase 5: Test render profile

Implement:

~~~text
portrait_profile.creator_test_v1
framing = hips_up
handsPolicy = exclude
heldPropsAllowed = false
visibleWeaponsAllowed = false
backgroundPolicy = simple
faceSafeCropRequired = true
~~~

Keep the render profile provider-independent.

### Phase 6: Testing provider adapter

- add the free / limited provider behind the portrait-provider interface;
- translate render profile to provider dimensions / syntax;
- persist returned image through stable asset storage;
- expose localized failure states;
- never make provider availability a creator requirement.

### Phase 7: UI integration

- add cosmetic customization groups;
- add portrait preview;
- add Generate / Regenerate action;
- show Outdated state;
- preserve initials fallback;
- expose portrait in runtime top bar / character view when asset exists.

### Phase 8: Production provider migration

Later:

- add production provider adapter;
- add production render profile;
- validate old identity prompt specs against new renderer;
- optionally offer portrait regeneration;
- do not migrate or rewrite canonical appearance descriptors simply because the provider changed.

## Decisions Settled By This Planning Pass

The following should be treated as recommended planning authority unless later deliberately revised:

1. Test-era profile images are **hips-up**.
2. Hands and preferably wrists remain fully outside the generated frame during testing.
3. Held props and held weapons are disabled by default during testing.
4. Character facts are provider-independent.
5. Framing, lighting, crop, and hand policy are render-profile data, not identity.
6. Existing skin / hair / eye color authorities remain separate from appearance descriptors.
7. Cosmetic descriptors never affect stats.
8. Face, hair, marks, and adornments use explicit exclusivity / dependency rules.
9. Expression should primarily derive from mechanical temperament / presence traits rather than duplicate cosmetic personality tags.
10. Generated portraits are optional representations and never gate character completion.
11. Portrait initials remain a fallback.
12. Changing portrait-relevant identity marks the old portrait stale instead of silently spending another generation.
13. Ordinary equipment changes do not stale the v1 identity portrait.
14. The free testing provider is intentionally disposable infrastructure.
15. Production provider migration should replace the provider / render layer, not character identity.

## Open Design Questions

These remain appropriate for later refinement:

1. Exact canonical lineage morphology for every playable lineage.
2. Whether Dwarven women can grow visible facial hair in Lineage Reforged lore.
3. Whether Half-Orcs have canonical visible tusks or another distinct mouth / jaw morphology.
4. Whether Half-Trolls have explicit troll-derived facial morphology beyond build and coloration.
5. Whether Half-Merfolk have visible aquatic morphology in the face / neck region.
6. Which tattoos / piercings are universal versus culture-specific.
7. Whether portrait clothing is derived from backstory only or also the selected starting bundle.
8. Exact test-provider size / output format once a provider is selected.
9. Exact global art-direction string and prompt versioning policy.
10. Whether production eventually supports a second full-body / equipment portrait separate from the identity portrait.

## Recommended V1 Summary

The initial portrait system should be deliberately conservative in renderer complexity and generous in character-data quality.

Canonical identity should be rich enough to survive years of provider changes:

~~~text
lineage
+ biological sex
+ age
+ stature
+ mechanical traits
+ skin / hair / eye coloration
+ durable face descriptors
+ durable hair descriptors
+ durable scars / marks / adornments
= character appearance authority
~~~

That authority feeds a deterministic prompt specification.

The testing renderer then deliberately narrows presentation:

~~~text
single character
+ hips-up crop
+ face fully visible
+ torso / build visible
+ hands outside frame
+ no held props
+ simple background
= low-risk test portrait
~~~

A future production renderer can widen the visual envelope without changing who the character is.

The image is replaceable.

The character data is not.
