# Character Creator Renovation Implementation Audit And Plan

## Status

Planning-only implementation audit and source-accurate execution plan for the character-creator renovation.

This document is the implementation bridge between the design package and current repository reality. It does **not** authorize source mutation by itself.

Audit anchor:

- repository: `vagabond1215/Lineage_Reforged`
- inspected current `master`: `bf36fe81d15f9287406b7b18d85efb710cd5e8d5`
- planning branch: `planning/character-creator-trait-system`
- planning branch head before this audit: `8ea2da635b6ccd0820dd8cd91468fc50723e65ee`
- merge base: `4ebfc220df2b0948b303cd1cbb38c41a49cd044d`
- branch state at audit start: planning branch 6 commits ahead and 2 commits behind `master`

The two current `master`-only commits are documentation / persistence-planning changes. They do not alter the creator source inspected below, but they make branch reconciliation mandatory before any implementation pass.

## Purpose

The existing planning package contains detailed design authority, but its implementation sequences are distributed across several documents and some source assumptions have already been overtaken by work on `master`.

This audit answers four questions:

1. Which planning assumptions still match current source?
2. Which planned work is already implemented elsewhere and must not be repeated?
3. Which current systems were omitted or under-specified by the design package?
4. What is the safest implementation order now?

## Audit Verdict

The core design direction is sound:

- replace Physique / Nature / Focus with a six-selection creator-profile trait system;
- preserve the deterministic fixed 10-point generated profile allocation;
- preserve the 90 + 10 = 100 starting-stat architecture;
- keep cosmetic appearance descriptors mechanically inert;
- make sex modifiers explicit and lineage-owned;
- make portrait generation optional and provider-independent;
- use explicit Generate / Regenerate actions;
- keep the test portrait hips-up with hands outside frame;
- keep Perchance or any free generator disposable behind an adapter boundary.

However, the planning package is **not implementation-complete without the corrections in this document**.

The major audit corrections are:

1. Current creator shell / navigation modernization is already partly implemented. Do not reimplement the older Unified Shell plan as a prerequisite.
2. Full-character randomization already exists. Extend it rather than creating a second randomizer.
3. Optional / skipped backstory handling already exists. Preserve it.
4. The repository already has a separate gameplay trait system in `playerState.traits`. Creator-profile traits must not be written there or use an ambiguous persistence name.
5. `newGameSnapshot.ts` is a central convergence owner for creator preview, persisted identity, starter lineage gameplay traits, resources, and snapshot creation. It must be treated as a first-class migration surface.
6. `packages/shared/types/src/player-origins.js` is a tracked runtime module consumed directly by JavaScript engine code. Sex-authority changes require TypeScript / JavaScript parity in the same implementation slice.
7. Attribute contribution breakdown infrastructure already exists. Replace its Generated Build/Profile contribution with Selected Profile Traits rather than inventing a second breakdown system.
8. The current portrait runtime has only initials. Portrait asset persistence and asset-storage ownership remain unresolved and should not block the trait / appearance migration.
9. Exact lineage visual morphology is still a real blocker for high-fidelity portrait generation, but not for landing trait mechanics or appearance schema.
10. Existing planned creator trait IDs beginning with `trait.*` are semantically too close to the established runtime trait namespace. Normalize creator-profile naming before implementation.

## Authority Order For Implementation

A coding pass should read the design package in this order:

1. `docs/design/character-creator-trait-and-portrait-system-plan.md`
2. `docs/design/character-creator-lineage-sex-dimorphism-plan.md`
3. `docs/design/character-creator-appearance-and-portrait-generation-plan.md`
4. `docs/design/character-creator-perchance-prototype-provider-plan.md`
5. **this implementation audit and plan**

When this document identifies a current-source mismatch or an implementation-specific naming correction, this document controls implementation shape unless a later explicit design decision supersedes it.

The older `docs/design/unified-shell-and-creator-refinement-plan.md` remains useful historical context, but portions of it have already been consumed by current source. It is not an instruction to repeat completed work.

## Current System Map

### Creator form owner

`apps/rpg-ui/src/game-shell/characterCreationForm.ts`

Current form fields include:

- `playerName`
- `sexId`
- `lineageId`
- `ageBandId`
- `heightBandId`
- `physiqueId`
- `natureId`
- `focusId`
- `hairColorId`
- `eyeColorId`
- `skinToneId`
- world-start fields
- backstory
- starting bundle / bundle choices
- inheritance source and save slot fields

Current defaults include:

~~~text
sex = male
lineage = human
age = prime
height = normal
physique = stocky
nature = disciplined
focus = balanced
~~~

Current completion and validation still require valid Physique / Nature / Focus selections.

### Identity option owner

`apps/rpg-ui/src/game-shell/characterCreationIdentityOptions.ts`

This file currently owns:

- age-band modifiers and age ranges;
- height-band modifiers;
- sex option presentation;
- Physique catalog;
- Nature catalog;
- Focus catalog;
- old profile weighting helpers;
- old normalization / formatting helpers.

Age and height remain useful authority.

Physique / Nature / Focus weighting authority should be removed after the new creator-profile catalog becomes authoritative.

### Creator catalog owner

`apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`

Current responsibilities include:

- playable lineage presentation and 90-point racial stat blocks;
- lineage identity palettes;
- age / height / old profile options exposed to the creator;
- backstory content / availability;
- starting bundle content;
- creator labels and helper resolution.

This file is already broad. New creator-profile traits and appearance descriptors should preferably live in focused catalog modules and be re-exported / consumed by this layer where necessary rather than turning `characterCreationCatalog.ts` into the sole owner of every new descriptor.

### Attribute resolver owner

`apps/rpg-ui/src/game-shell/characterCreationMath.ts`

Current hard invariants:

~~~ts
BASE_STAT_TOTAL = 90
GENERATED_PROFILE_POINTS = 10
FINAL_STAT_TOTAL = 100
MINIMUM_ATTRIBUTE_VALUE = 1
~~~

Current resolution order:

1. lineage baseline;
2. sex;
3. age;
4. height;
5. backstory;
6. Physique / Nature / Focus profile resolution;
7. deterministic largest-remainder allocation of exactly 10 generated points;
8. final 100-point starting profile.

`resolveGeneratedProfilePointDistribution(...)` is already the correct deterministic primitive and should be retained.

The old share model and return fields:

- `finalPhysiqueShare`
- `finalNatureShare`

become obsolete after the six-trait resolver lands.

### Snapshot / preview convergence owner

`apps/rpg-ui/src/game-shell/newGameSnapshot.ts`

This file currently owns or coordinates:

- working creator attribute preview;
- per-attribute source breakdown;
- generated-profile preview metrics;
- resource preview;
- starter bundle / equipment / inventory shaping;
- Legacy preparation application;
- starter lineage gameplay traits;
- `PlayerIdentityProfile` persistence;
- new `SaveSnapshot` creation.

This is a critical migration file.

It also proves that runtime lineage traits and creator-profile traits are different systems:

~~~text
creator profile choices
-> currently Physique / Nature / Focus
-> starting stat distribution

LINEAGE_TRAIT_IDS
-> PlayerTraitState[]
-> playerState.traits
-> runtime passive gameplay effects
~~~

Do not merge these systems.

### Randomization owner

`apps/rpg-ui/src/game-shell/characterCreationRandomization.ts`

A full randomizer already exists:

~~~ts
generateRandomCharacterCreationFormState(...)
~~~

It already randomizes lineage, sex, age, height, old profile choices, coloration, world start, selectable backstory, starting bundle, bundle choices, and name.

The renovation should extend this helper to generate valid creator-profile traits and appearance descriptors by construction.

Do not add a competing full randomizer.

### Creator UI owner

`apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`

Current source already imports and uses:

- `AppShell`
- `ShellBrandLogo`
- derived creator step-state helpers;
- previous / next available-step helpers;
- full randomization.

Therefore the older shell plan is partly implemented.

The identity surface still explicitly maps current Physique / Nature / Focus options and must be renovated.

The component is already large enough that adding all trait, appearance, and portrait logic inline would materially worsen maintainability.

### Shared identity contract owner

`packages/shared/types/src/contracts.ts`

Current shared identity still defines:

- `PlayerIdentityPhysiqueId`
- `PlayerIdentityNatureId`
- `PlayerIdentityFocusId`
- `PlayerIdentityProfile` with old profile IDs and coloration.

`PlayerCoreData.identityProfile` is optional / nullable, but when present the current shape contains old profile fields.

### Lineage biological authority

`packages/shared/types/src/player-origins.ts`

Current playable lineage creation gives every playable lineage the same sex adjustment:

~~~ts
male: {}
female: { AGI: 1, STR: -1 }
neutral: {}
~~~

`createPlayableLineage(...)` assigns that record universally, including hybrid lineages through `createHybridLineage(...)`.

Current creator sex option resolution also silently falls back to the Human profile when lineage authority is missing.

Both behaviors conflict with the new plan.

### Tracked JavaScript runtime mirror

`packages/shared/types/src/player-origins.js` is not disposable build output.

JavaScript runtime modules import it directly, including player-engine modules.

Any implementation changing lineage sex data / runtime behavior in `player-origins.ts` must keep the tracked `.js` runtime mirror synchronized in the same slice.

### Existing gameplay trait system

`packages/content/base/player/traits.json` already defines runtime traits under IDs such as:

- `trait.lineage.human.adaptable`
- `trait.lineage.elf.graceful`
- `trait.lineage.gnome.quick_hands`
- `trait.lineage.halfling.nimble`

`PlayerState` already contains:

~~~ts
traits: PlayerTraitState[]
~~~

Combat and character-panel systems consume this array.

The six creator profile choices are **not** replacements for these runtime passive traits.

## Required Naming Correction Before Code

The design docs currently use conceptual IDs such as:

~~~text
trait.body_frame.stocky
trait.cognition.analytical
~~~

and a persistence field named roughly:

~~~text
traitTagIds
~~~

That is too easy to confuse with established runtime `trait.*` content and `playerState.traits`.

Recommended implementation namespace:

~~~text
profile_trait.body_frame.stocky
profile_trait.physical_aptitude.athletic
profile_trait.temperament.disciplined
profile_trait.cognition.analytical
profile_trait.presence.commanding
~~~

Recommended types / fields:

~~~ts
type CharacterProfileTraitId = string;

interface PlayerIdentityProfile {
  ...
  profileTraitIds: CharacterProfileTraitId[];
  appearanceDescriptorIds: CharacterAppearanceDescriptorId[];
}
~~~

Recommended form field:

~~~ts
profileTraitIds: CharacterProfileTraitId[]
~~~

Avoid:

- `traitIds`
- `traits`
- `traitTagIds`

because those names blur the distinction with runtime passive traits.

This naming correction does not change the trait design. It only prevents two different systems from sharing misleading vocabulary at the persistence boundary.

## Audit Of Existing Plan Accuracy

### Accurate and retained

The following design assumptions match current source and should remain:

- racial creator stat blocks resolve to 90 points;
- the generated profile pool is exactly 10 points;
- final creator attributes are validated at 100 before later Legacy preparation adjustments;
- largest-remainder allocation is deterministic;
- current sex authority is structurally lineage-owned but behaviorally universal;
- current creator persists old Physique / Nature / Focus IDs;
- current runtime portrait support is initials-only;
- current coloration is lineage-aware and already separate from mechanics;
- provider integration does not yet exist;
- portrait generation can be added without becoming stat authority.

### Partially stale: shell modernization

The older Unified Shell plan describes creator adoption of `AppShell` as future work.

Current source already imports and uses `AppShell` and `ShellBrandLogo`.

Implementation consequence:

- preserve the current shell work;
- do not make shell migration a prerequisite slice;
- make only local layout changes required for the new identity / trait / portrait panels.

### Partially stale: step-state / backstory logic

The older plan describes derived step-state helpers and skipped-backstory navigation as future work.

Current form already has:

- `buildCharacterCreationStepStates(...)`
- `getNextAvailableCharacterCreationStepId(...)`
- `getPreviousAvailableCharacterCreationStepId(...)`
- `hasSelectableBackstories` validation options.

Implementation consequence:

- keep this behavior intact;
- add new profile / appearance fields to validation without regressing optional-backstory behavior.

### Stale: full randomizer still needed

The older plan says a full-character randomizer should be added.

It already exists and has unit coverage.

Implementation consequence:

- extend the existing helper;
- preserve save slot;
- preserve source-run reset behavior;
- continue respecting backstory availability;
- add valid-by-construction profile-trait and appearance randomization.

### Incomplete: runtime trait collision

The design package did not sufficiently account for the established `PlayerTraitState[]` gameplay trait system.

Implementation consequence:

- creator-profile traits live only in identity/profile authority unless a later system deliberately promotes one into a runtime passive effect;
- do not append them to `playerState.traits`;
- use distinct ID and field namespaces.

### Incomplete: tracked JavaScript mirror

The design package broadly warns against generated-output churn, but `player-origins.js` is a tracked runtime implementation file.

Implementation consequence:

- changing only `player-origins.ts` is invalid;
- TS / JS parity is part of the sex-profile acceptance gate.

### Incomplete: demo and fixture surface

`apps/rpg-ui/src/runtime/demoSnapshot.ts` persists the old identity profile and must be migrated with the shared contract.

This file was not prominent in the original implementation list.

### Accurate but now easier: attribute breakdown

The design asks for a source breakdown including Selected Traits.

Current `buildCharacterCreationAttributePreviewRows(...)` already has the right contribution structure.

Implementation consequence:

- rename / replace `generated_profile` / `Generated Build/Profile` with `selected_profile_traits` / `Selected Profile Traits`;
- no second breakdown architecture is needed.

## Proposed New Source Modules

To avoid overloading current large files, use focused owners.

### `characterCreationProfileTraits.ts`

Recommended responsibilities:

- `CharacterProfileTraitId`
- category definitions;
- canonical catalog;
- selection rules;
- exclusive groups;
- hard conflicts;
- soft tensions;
- validation;
- profile-weight aggregation;
- display helpers.

Do not put provider code here.

### `characterCreationAppearance.ts`

Recommended responsibilities:

- appearance descriptor IDs / categories;
- catalog;
- exclusivity / count limits;
- dependency resolution;
- lineage / sex availability hooks;
- validation;
- valid-by-construction random selection helpers.

Do not put renderer-specific prompt syntax here.

### `characterPortraitSpec.ts`

Recommended responsibilities:

- render-profile types;
- `CharacterPortraitPromptSpec`;
- normalized prompt-spec construction;
- lineage portrait profile consumption;
- identity fingerprint input normalization;
- prompt versioning.

### `characterPortraitProvider.ts`

Recommended responsibilities:

- provider-neutral generation result / error types;
- provider interface;
- fake/local provider used for initial UI proof;
- no Perchance-specific behavior in the base contract.

Provider-specific adapters should live separately later.

## Persistence Strategy

### Identity first, portrait second

Do not couple the profile-trait migration to unresolved image-asset storage.

Recommended first persistence target:

~~~ts
interface PlayerIdentityProfile {
  heightCm: number | null;
  ageBandId: PlayerIdentityAgeBandId | null;

  profileTraitIds: CharacterProfileTraitId[];
  appearanceDescriptorIds: CharacterAppearanceDescriptorId[];

  hairColorId: string | null;
  hairHighlightColorId: string | null;
  eyeColorId: string | null;
  skinToneId: string | null;
}
~~~

Portrait representation should be added separately only when asset ownership / retention is decided.

### Snapshot-format caution

Current campaign authority is heavily invested in `lineage.save_snapshot.v2` and adjacent persistence work is active.

Do **not** casually bump snapshot format or storage-envelope versions as part of the creator renovation.

Before implementation, inspect the latest persistence authority and decide one of these explicitly:

#### Option A: clean development cut

Appropriate if old development saves may be discarded.

- replace old identity fields directly;
- update current fixtures / demo state;
- leave snapshot format unchanged only if readers treat the embedded identity profile structurally and no invariant requires the old fields;
- document that pre-change development saves are unsupported.

#### Option B: temporary metadata compatibility bridge

Appropriate if current development saves must remain readable.

- add new `profileTraitIds` / `appearanceDescriptorIds`;
- make old Physique / Nature / Focus identity fields optional / deprecated for read compatibility;
- new characters write only new authority;
- do not run both old and new stat resolvers;
- remove legacy metadata fields in a later cleanup once no retained save needs them.

Do not invent an IndexedDB migration or combine this work with G9E slot-generation migration unless current persistence inspection proves it necessary.

### No dual mechanical authority

Even if legacy identity metadata remains temporarily readable, there must be exactly one mechanical resolver for newly created characters.

After cutover:

~~~text
profileTraitIds
-> generated 10-point profile
~~~

not:

~~~text
profileTraitIds + Physique/Nature/Focus
-> competing profile effects
~~~

## Portrait Persistence Strategy

Portrait asset storage is still unresolved.

Therefore implementation should deliberately split:

### First portrait slice

- deterministic prompt spec;
- fingerprint calculation;
- fake/local provider;
- Generate / Regenerate UI;
- in-memory or intentionally temporary preview result;
- failure / stale-state behavior.

### Durable portrait slice

Only after an asset owner is selected:

- stable asset/blob storage;
- ownership by campaign / character identity;
- deletion / retention behavior;
- `assetRef` persistence;
- runtime top-bar / character-view consumption;
- stale portrait persistence.

Do not store large image bytes directly in `SaveSnapshot`.

## Implementation Slices

Each slice should be independently reviewable and keep unrelated creator behavior green.

### Slice 0: Reconcile and lock implementation authority

Before source edits:

1. fetch current `master`;
2. compare current master against this planning branch;
3. inspect active creator / persistence branches and open PRs;
4. verify no newer character-creator authority supersedes this package;
5. decide whether development-save compatibility is required;
6. settle the implementation namespace `profile_trait.*` and field `profileTraitIds`;
7. record which tentative dimorphism values are accepted for implementation.

Stop if:

- another branch has already changed the same creator contracts;
- persistence authority now requires a migration not covered here;
- the user has not accepted a tentative biological rule that implementation would make canon.

Definition of done:

- current source anchor recorded;
- no hidden overlapping implementation;
- compatibility posture explicit;
- naming locked.

### Slice 1: Profile-trait and appearance catalog authority

Add focused data / validation modules without changing the active resolver yet.

Implement:

- `CharacterProfileTraitId` and categories;
- six-trait catalog using the approved 8-weight rule;
- body-frame exclusivity;
- category minimums / maximums;
- hard conflicts and soft tensions;
- appearance descriptor contract;
- appearance catalog;
- dependency / count-limit validation;
- structural catalog tests.

Recommended ID normalization:

~~~text
profile_trait.body_frame.stocky
profile_trait.physical_aptitude.athletic
...
appearance.face.shape.angular
...
~~~

Do not:

- mutate form state yet;
- persist these selections yet;
- change stats yet;
- change runtime `playerState.traits`.

Acceptance:

- all mechanical profile traits have exactly 8 integer nonnegative weight units;
- all IDs unique;
- all exclusive / conflict references valid;
- appearance descriptors have no attribute weights;
- catalog validation is deterministic.

### Slice 2: Lineage sex authority correction

Implement explicit per-lineage sex adjustments.

Touch at minimum:

- `packages/shared/types/src/player-origins.ts`
- `packages/shared/types/src/player-origins.js`
- creator sex option lookup in `characterCreationIdentityOptions.ts`
- focused tests.

Rules:

- each playable lineage explicitly owns male and female data;
- each vector is zero-sum;
- remove silent Human fallback;
- missing lineage sex authority fails visibly in development / validation;
- keep dormant `neutral` behavior only if still required by shared runtime contracts, but do not expose it in the creator.

Do not remove `PlayerSexId = neutral` from the shared contract in this slice unless a full repository search proves no runtime / fixture / migration consumer remains. The creator already restricts selection to male / female, so removal is not required for the renovation.

Acceptance:

- every playable lineage has explicit male/female authority;
- TS and JS runtime modules agree;
- sex vectors sum to zero;
- current resource / origin resolution still works;
- Human fallback is gone.

### Slice 3: Replace the profile resolver

Change `characterCreationMath.ts` to consume six profile traits instead of Physique / Nature / Focus.

Preserve:

- lineage / sex / age / height / backstory order;
- `BASE_STAT_TOTAL = 90`;
- `GENERATED_PROFILE_POINTS = 10`;
- deterministic `resolveGeneratedProfilePointDistribution(...)`;
- final minimum attribute floor;
- final total validation.

Recommended resolver shape:

~~~ts
resolveCharacterCreationAttributes({
  lineageId,
  sexId,
  ageBandId,
  heightBandId,
  profileTraitIds,
  backstoryId
})
~~~

Profile algorithm:

1. validate exactly six selected profile traits;
2. aggregate all six 8-unit weight maps;
3. normalize aggregate weights across nine attributes;
4. feed normalized vector to existing largest-remainder allocator;
5. allocate exactly 10 generated points.

Remove:

- Physique/Nature share normalization;
- Focus share shifting;
- `finalPhysiqueShare`;
- `finalNatureShare`.

Acceptance:

- same input is byte-for-byte deterministic;
- trait order does not change output;
- generated total always 10;
- base total remains 90;
- final total remains 100;
- invalid trait sets produce explicit errors;
- no creator-profile trait becomes a runtime passive trait.

### Slice 4: Form and creator validation cutover

Replace old form authority:

~~~text
physiqueId
natureId
focusId
~~~

with:

~~~text
profileTraitIds
appearanceDescriptorIds
~~~

Update:

- `CharacterCreationField`;
- `CharacterCreationFormState`;
- `CompleteCharacterCreationFormState`;
- defaults;
- identity-step fields;
- review-step fields;
- `hasCompleteCharacterCreationSelections(...)`;
- form validation;
- reset / lineage-change behavior.

Recommended default profile must itself be valid. Do not retain three hidden old defaults.

Appearance should be optional except for any axes explicitly declared required, such as hair length if the final v1 catalog makes it mandatory.

Preserve:

- optional-backstory behavior;
- world dependency locks;
- save-slot identity;
- inheritance-source behavior.

Acceptance:

- old P/N/F fields are no longer required by active form validation;
- exactly six valid profile traits are required;
- appearance conflicts are rejected;
- backstory skip logic remains green.

### Slice 5: Extend existing randomization

Modify `generateRandomCharacterCreationFormState(...)`.

Replace old P/N/F random picks with:

1. choose exactly one Body Frame;
2. choose remaining profile traits valid-by-construction while satisfying physical / mental-social rules;
3. choose coloration from existing lineage catalog;
4. choose appearance axes in dependency order;
5. choose layerable marks within limits;
6. validate final form.

Preserve current randomizer behavior for:

- `saveSlotId`;
- source-run reset;
- lineage / sex / name relationship;
- selectable backstory;
- valid world start;
- bundle / bundle choices.

Do not implement randomization as arbitrary selection followed by repeated conflict deletion.

Acceptance:

- seeded RNG remains testable;
- hundreds / thousands of generated forms can validate without retry loops;
- no invalid hair / facial-hair combination is emitted;
- no invalid profile-trait combination is emitted.

### Slice 6: Preview and snapshot persistence

Update `newGameSnapshot.ts`.

Required changes:

- replace P/N/F identity metrics with profile-trait summary metrics;
- rename `Generated Build/Profile` contribution to `Selected Profile Traits`;
- preserve existing per-attribute contribution rows;
- pass `profileTraitIds` to the new resolver;
- persist `profileTraitIds` and `appearanceDescriptorIds` in identity profile;
- remove new-write dependence on canonical Physique / Nature / Focus IDs;
- preserve current runtime lineage passive trait generation in `playerState.traits` unchanged;
- update `demoSnapshot.ts` and save/load fixtures.

Critical invariant:

~~~text
PlayerIdentityProfile.profileTraitIds
!=
PlayerState.traits
~~~

The first describes creator profile weighting.

The second contains runtime passive traits such as lineage traits.

Acceptance:

- new snapshot contains canonical profile / appearance IDs;
- starter runtime lineage traits are unchanged;
- save/load round trip preserves new identity IDs;
- preview and committed snapshot resolve the same starting attributes;
- Legacy preparation remains later than the 100-point creator resolver.

### Slice 7: Remove old profile authority

Only after slices 3-6 are green, remove unused active P/N/F code.

Candidate removals:

- old Physique / Nature / Focus option types;
- old profile weighting helpers;
- P/N/F catalog exports no longer consumed;
- old formatting / normalization functions;
- old shared identity union types if no compatibility bridge needs them;
- obsolete tests asserting old profile catalog counts.

If compatibility fields remain for old saves, keep only the minimum read-time type surface required. Do not keep the old resolver.

Acceptance:

- repository search shows no active creator dependence on old profile fields;
- no dead dual-authority helper remains;
- source-inspection tests are updated only where behavior genuinely changed.

### Slice 8: Creator UI renovation

Preserve the current `AppShell` creator integration.

Replace current P/N/F selection areas with coherent focused UI.

Recommended extracted components:

- `CharacterCreationProfileTraitSelector.tsx`
- `CharacterCreationAppearanceEditor.tsx`
- later `CharacterPortraitPanel.tsx`

Profile trait UI should provide:

- grouped selectable chips / compact cards;
- six-slot count feedback;
- Body Frame replacement behavior;
- category cap feedback;
- hard conflict explanation;
- optional soft-tension notice;
- live stat preview through existing preview pipeline.

Appearance UI should group:

- Face;
- Hair;
- Marks & Adornments;
- advanced features through progressive disclosure where useful.

Do not rework launcher/gameplay shell architecture in this slice.

Add only focused creator CSS to `apps/rpg-ui/src/index.css`.

Acceptance:

- all creator choices remain reachable on desktop and narrow layouts;
- selected trait count and conflicts are understandable;
- no old Physique / Nature / Focus cards remain;
- current world/backstory/bundle navigation still works;
- full randomize still works.

### Slice 9: Lineage portrait morphology authority

Before relying on generated portraits for fantasy lineage accuracy, author explicit `LineagePortraitProfile` data.

Required decisions include:

- canonical elf / dark-elf ear morphology;
- Dwarf facial-hair sex rules;
- Half-Orc mouth / tusk morphology;
- Half-Troll facial morphology;
- Half-Goblin morphology;
- Half-Merfolk aquatic face / neck morphology;
- lineage-specific sex presentation where needed.

This slice may happen before or after UI slice 8, but it must precede any claim that generated lineage portraits are canonically reliable.

Do not let the image provider create canon implicitly.

### Slice 10: Provider-independent portrait specification

Implement:

- `CharacterPortraitPromptSpec`;
- `LineagePortraitProfile` consumption;
- render-profile contract;
- `portrait_profile.creator_test_v1`;
- canonical ordering;
- prompt version;
- normalized identity fingerprint.

Test profile remains:

~~~text
hips-up
4:5 preferred
single adult character
hands excluded
wrists preferably excluded
no held props
no held weapons
simple background
face-safe crop
~~~

Acceptance:

- same normalized identity produces same prompt spec;
- array ordering does not affect fingerprint;
- provider choice does not affect identity fingerprint;
- mechanical stat values are not serialized into portrait prompt prose;
- image generation remains optional.

### Slice 11: Fake/local portrait provider and UI state machine

Before external integration, prove the boundary with a deterministic fake provider.

Implement provider-neutral states:

~~~text
empty       -> Generate Portrait
generating  -> disabled progress
ready       -> Regenerate Portrait
stale       -> Regenerate Portrait
failed-first -> Retry Portrait
failed-regeneration -> retain old portrait + Regenerate Portrait
~~~

Do not expose:

- prompt editor;
- provider picker;
- model picker;
- style controls.

The fake provider may return a local placeholder / test asset or deterministic mock reference sufficient to prove UI state transitions.

Do not invent durable image storage in this slice.

Acceptance:

- generation failure never affects form validity;
- stale state is driven only by portrait-relevant identity changes;
- failed regeneration preserves previous valid image;
- no automatic generation occurs when fields change.

### Slice 12: Durable portrait asset ownership

This is a separate persistence decision.

Before implementation, define:

- asset/blob storage owner;
- stable `assetRef` format;
- account / campaign / character ownership;
- deletion behavior;
- retained historical portrait behavior;
- quota / cleanup policy;
- provider URL download / normalization requirements;
- whether portraits survive campaign archival / deletion.

Only then add durable `PlayerPortraitState` or equivalent.

Do not put image bytes in the main save snapshot.

### Slice 13: Runtime portrait consumption

After durable asset authority exists:

- extend UI view model with optional portrait asset ref;
- keep `portraitInitials` fallback;
- render portrait in top bar / character overview where appropriate;
- handle missing or unloadable assets safely.

Do not remove initials fallback.

### Slice 14: Perchance prototype adapter, conditional

Only implement Perchance-specific behavior after rechecking current provider capabilities and terms at implementation time.

Allowed shape depends on then-current integration rules.

The adapter must not require changes to:

- character identity schema;
- profile traits;
- appearance descriptor IDs;
- prompt spec;
- render-profile semantics.

If seamless automation remains unsupported or disallowed, keep Perchance as an assisted prototype workflow and do not work around browser / service restrictions with brittle DOM automation.

### Slice 15: Production provider later

A production provider should be an adapter replacement / addition, not another creator rewrite.

Production work may add:

- authenticated API calls;
- durable retries;
- provider moderation mapping;
- higher resolution;
- alternate render profile;
- provider-side consistency controls.

Canonical character identity remains unchanged.

## Source Impact Matrix

| Source | Expected action | Notes |
| --- | --- | --- |
| `packages/shared/types/src/contracts.ts` | modify | New profile / appearance identity types; old P/N/F compatibility posture decided at Slice 0. |
| `packages/shared/types/src/player-origins.ts` | modify | Explicit lineage sex authority. |
| `packages/shared/types/src/player-origins.js` | modify | Required runtime mirror parity. |
| `apps/rpg-ui/src/game-shell/characterCreationIdentityOptions.ts` | modify / shrink | Keep age, height, sex presentation; remove old profile authority after cutover. |
| `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts` | modify | Stop exposing old profile options; consume new focused catalogs where needed. |
| `apps/rpg-ui/src/game-shell/characterCreationMath.ts` | modify | Replace P/N/F resolver with six profile traits. |
| `apps/rpg-ui/src/game-shell/characterCreationForm.ts` | modify | New fields / validation. |
| `apps/rpg-ui/src/game-shell/characterCreationRandomization.ts` | modify | Extend existing full randomizer. |
| `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` | modify | Preview, breakdown, identity persistence, snapshot cutover. |
| `apps/rpg-ui/src/runtime/demoSnapshot.ts` | modify | New identity fixture. |
| `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx` | modify / extract | Replace P/N/F UI; preserve AppShell and current navigation. |
| `apps/rpg-ui/src/index.css` | focused modify | Trait chips / appearance / portrait states only. |
| `apps/rpg-ui/src/runtime/uiViewModel.ts` | later modify | Portrait asset optional runtime presentation only after durable asset owner. |
| `packages/content/base/player/traits.json` | **do not use for creator profile traits** | Existing runtime passive trait authority remains separate. |

Recommended new files:

| New file | Role |
| --- | --- |
| `apps/rpg-ui/src/game-shell/characterCreationProfileTraits.ts` | creator-profile catalog / validation / weight aggregation |
| `apps/rpg-ui/src/game-shell/characterCreationAppearance.ts` | appearance catalog / validation / randomization helpers |
| `apps/rpg-ui/src/game-shell/characterPortraitSpec.ts` | provider-independent prompt / render profile / fingerprint |
| `apps/rpg-ui/src/game-shell/characterPortraitProvider.ts` | provider-neutral interface / fake provider foundation |
| `apps/rpg-ui/src/game-shell/components/CharacterCreationProfileTraitSelector.tsx` | focused profile-trait UI |
| `apps/rpg-ui/src/game-shell/components/CharacterCreationAppearanceEditor.tsx` | focused cosmetic UI |
| `apps/rpg-ui/src/game-shell/components/CharacterPortraitPanel.tsx` | Generate / Regenerate state UI |

File names may be adjusted to current conventions at implementation time, but ownership boundaries should remain.

## Test Impact Matrix

### Replace / substantially rewrite

`tests/unit/character-creation-profile-resolver.test.mjs`

Current test exhaustively iterates Physique / Nature / Focus combinations.

Replace with:

- catalog-integrity tests;
- representative valid six-trait combinations;
- generated-total invariant;
- trait-order invariance;
- exclusivity / count / category rejection;
- deterministic remainder behavior retained.

### Update

`tests/unit/character-creation-identity.test.mjs`

Keep:

- age-range tests;
- age modifier display tests;
- sex display tests.

Replace old P/N/F catalog assertions with:

- profile-trait catalog / prose checks;
- explicit per-lineage sex option checks;
- no-Human-fallback behavior.

### Extend

`tests/unit/character-creation-randomization.test.mjs`

Add:

- exactly six valid profile traits;
- body-frame exactly one;
- appearance dependency validity;
- multiple deterministic RNG samples;
- no old P/N/F fields after cutover.

### Update

`tests/unit/character-creation-attribute-preview.test.mjs`

Assert:

- contribution label becomes Selected Profile Traits;
- total remains equal to committed resolver output;
- Legacy contribution remains separate.

### Update

`tests/simulation/save-load-roundtrip.test.mjs`

Assert:

- new identity profile fields round-trip;
- creator profile traits remain distinct from `playerState.traits`;
- appearance IDs round-trip;
- portrait fields only if durable portrait state has actually landed.

### Re-run for regression even if unchanged

- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `tests/unit/backstory-policy-metadata.test.mjs`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/legacy-preparation-application.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`

Several of these inspect creator source files directly. Component extraction can break brittle source assertions even when behavior is correct.

### New focused tests recommended

- `tests/unit/character-creation-profile-traits.test.mjs`
- `tests/unit/character-creation-appearance.test.mjs`
- `tests/unit/character-portrait-spec.test.mjs`
- `tests/unit/character-portrait-provider-state.test.mjs`

## Acceptance Commands

Exact commands should be rechecked against current package scripts before implementation. At the audited source, the relevant commands are:

~~~bash
node --test tests/unit/character-creation-profile-resolver.test.mjs
node --test tests/unit/character-creation-identity.test.mjs
node --test tests/unit/character-creation-randomization.test.mjs
node --test tests/unit/character-creation-attribute-preview.test.mjs
node --test tests/simulation/save-load-roundtrip.test.mjs
npm --prefix ./apps/rpg-ui run typecheck:node
npm --prefix ./apps/rpg-ui run build
node --test
~~~

The broad UI typecheck has had a documented pre-existing diagnostic baseline. Do not claim a clean broad typecheck merely because the creator changes introduced no new diagnostics.

For a source implementation pass:

1. record the pre-change broad typecheck baseline;
2. run focused / Node-safe creator tests;
3. run app-local build;
4. run broad suite;
5. compare any broad typecheck diagnostics against baseline;
6. reject new creator-owned diagnostics.

## Definition Of Done For The Mechanical Renovation

The mechanical creator renovation is complete when all of the following are true:

- no active form or resolver requires Physique / Nature / Focus;
- exactly six canonical creator profile traits are required;
- exactly one Body Frame is enforced;
- profile trait validation matches the approved category rules;
- each mechanical profile trait has exactly 8 nonnegative integer weight units;
- the fixed generated pool remains exactly 10 points;
- starting creator total remains exactly 100 before later Legacy adjustments;
- explicit lineage sex profiles are authoritative and zero-sum;
- Human fallback is removed;
- creator profile traits do not enter `playerState.traits`;
- full randomize always creates a valid profile;
- preview and committed snapshot agree;
- save/load retains the new identity fields;
- old profile authority is removed or isolated to an explicitly temporary read-compatibility bridge.

## Definition Of Done For The Appearance Renovation

Appearance renovation is complete when:

- canonical appearance descriptors exist with deterministic validation;
- coloration remains separate;
- hairstyle / facial-hair dependencies are enforced;
- randomization cannot produce invalid appearance combinations;
- appearance choices do not affect stats;
- save/load retains appearance IDs;
- UI groups appearance choices coherently;
- unresolved lineage morphology is not silently invented by provider prompts.

## Definition Of Done For The Test Portrait Experience

The test portrait experience is complete when:

- player sees Generate Portrait before first generation;
- player sees Regenerate Portrait after a portrait exists;
- stale identity is visibly indicated;
- generation is explicit, never automatic;
- the test render profile is hips-up with hands outside frame;
- generation failure does not invalidate the character;
- failed regeneration retains the previous portrait;
- initials fallback remains;
- prompt spec is deterministic and provider-independent;
- the external provider can be replaced without changing identity data.

Durable runtime portrait use is **not** required for this milestone if asset-storage authority has not yet been settled.

## Open Blockers And Stop Conditions

The following remain genuine design / authority questions.

### Blockers before sex-profile implementation if exact values are to become canon

- final Dark Elf dimorphism direction;
- final Half-Goblin dimorphism direction;
- final Half-Merfolk dimorphism direction;
- confirmation of Half-Troll Tier-2 magnitude.

Human, Dwarf, Gnome, Halfling, Elf, and Half-Orc recommendations are more directly grounded in the current planning rationale, but all vectors should still be treated as planning data until the implementation slice is explicitly authorized.

### Blockers before canonical fantasy portrait generation

- lineage morphology profiles;
- Dwarven female facial-hair canon;
- Half-Orc tusk / jaw canon;
- Half-Troll face morphology;
- Half-Goblin face morphology;
- Half-Merfolk aquatic morphology;
- global portrait art-direction string.

### Blocker before durable generated portrait persistence

- portrait asset storage / ownership / deletion / retention authority.

### Not blockers for profile-trait mechanics

The following do **not** need to delay mechanical trait migration:

- Perchance integration;
- production provider selection;
- portrait asset storage;
- final portrait art direction;
- full-body production render profiles.

## Recommended Delivery Grouping

Do not implement all slices in one giant change.

Recommended pull-request / review grouping:

### Group A: mechanical authority

- Slice 0
- Slice 1 profile-trait portion
- Slice 2
- Slice 3

Goal: stable six-trait math and lineage sex authority without UI cutover yet.

### Group B: creator cutover

- Slice 4
- Slice 5
- Slice 6
- Slice 7

Goal: form, randomizer, preview, snapshot, persistence, fixtures fully use new profile traits.

### Group C: creator presentation

- appearance portion of Slice 1
- Slice 8

Goal: trait + cosmetic editing experience without external generation dependency.

### Group D: portrait specification and local UX proof

- Slice 9
- Slice 10
- Slice 11

Goal: deterministic identity-to-prompt pipeline and Generate / Regenerate UX with fake/local provider.

### Group E: durable asset integration

- Slice 12
- Slice 13

Goal: stable portrait persistence and runtime display after storage authority is explicit.

### Group F: external providers

- Slice 14
- Slice 15 later

Goal: attach prototype / production providers without altering canonical character identity.

## Recommended First Implementation Target

The safest first coding target is **not** the portrait provider.

It is:

1. lock creator-profile naming;
2. add the profile-trait catalog / validator;
3. add explicit lineage sex authority;
4. replace the P/N/F math resolver while preserving the 10-point allocator;
5. prove all stat invariants in tests.

This creates the mechanical spine on which the form, UI, appearance, and portrait work can depend.

Portrait integration should come only after canonical identity is stable.

## Final Audit Summary

The planning package does not need a redesign. It needs a source-aware execution layer.

The key implementation correction is to treat the renovation as four independent authorities that meet in the creator but must not be collapsed:

~~~text
creator profile traits
-> starting stat distribution only

runtime passive traits
-> playerState.traits and gameplay effects

appearance descriptors
-> canonical visual identity only

portrait provider state
-> optional generated representation only
~~~

Current source already provides several foundations that the older plans thought were future work:

- AppShell adoption in creator;
- derived step-state navigation;
- optional backstory behavior;
- full-character randomization;
- per-attribute preview contribution rows.

Those should be preserved, not rebuilt.

The largest implementation hazards are now explicit:

- accidentally mixing creator-profile traits with runtime gameplay traits;
- changing TypeScript lineage sex authority without the tracked JavaScript runtime mirror;
- bundling creator identity work into unrelated persistence-schema migrations;
- inflating `CharacterCreationNarrativeScreen.tsx` instead of extracting focused new surfaces;
- implementing external portrait generation before identity / morphology / asset ownership are stable.

With those corrections, the renovation can be implemented incrementally without disturbing current campaign, backstory, Legacy, world-start, or persistence work.