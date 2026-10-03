# Character Creator Renovation Planning Index

## Status

Planning-only index for the character-creator renovation package on branch:

`planning/character-creator-trait-system`

This index exists so future Codex / GPT / human implementation work can consume the planning package in a known order without relying on conversational context.

No document in this package authorizes source implementation by itself.

## Read Order

### 1. Character Creator Trait And Portrait System Plan

`docs/design/character-creator-trait-and-portrait-system-plan.md`

Primary architectural authority.

Covers:

- replacement of Physique / Nature / Focus;
- six mechanical-trait model;
- fixed 10-point generated profile pool;
- mechanical trait catalog;
- cosmetic-versus-mechanical boundary;
- mutual exclusivity / conflict model;
- persistence direction;
- portrait-state separation;
- implementation sequence and tests.

### 2. Character Creator Lineage Sex Dimorphism Plan

`docs/design/character-creator-lineage-sex-dimorphism-plan.md`

Companion biological-authority plan.

Covers:

- current racial 90-point baselines;
- current universal sex modifier problem;
- lineage midpoint semantics;
- zero-sum sex modifiers;
- dimorphism tiers;
- recommended male / female stat profiles for every current playable lineage;
- hybrid-lineage considerations;
- balance ceilings;
- lore questions requiring explicit settlement before implementation.

### 3. Character Creator Appearance And Portrait Generation Plan

`docs/design/character-creator-appearance-and-portrait-generation-plan.md`

Companion cosmetic / renderer authority.

Covers:

- durable appearance descriptor catalog;
- face / hair / facial hair / scars / tattoos / piercings / adornments;
- exclusivity and dependency rules;
- explicit lineage morphology authority;
- deterministic portrait prompt specification;
- portrait identity fingerprinting;
- stale-image behavior;
- provider abstraction;
- initials fallback;
- free testing provider strategy;
- production-provider migration;
- test-era hips-up / hands-out-of-frame composition.

## Settled Planning Direction

Unless deliberately revised in a later design decision, future implementation should assume:

1. The current Physique / Nature / Focus system is replaced rather than layered underneath the new trait system.
2. Starting character attributes preserve the current deterministic 100-point architecture.
3. Six stat-bearing character traits distribute the fixed 10 profile points.
4. Cosmetic descriptors never modify stats.
5. Biological sex remains mechanically meaningful where lineage biology warrants it.
6. Sex modifiers are lineage-authored and zero-sum.
7. Racial stat arrays represent lineage midpoints rather than male defaults.
8. Not every lineage requires mechanical sexual dimorphism.
9. Strong dimorphism is reserved for lineages whose fantasy biology supports it.
10. Canonical character data, not generated images, defines the character.
11. The portrait prompt is deterministic and provider-independent before provider serialization.
12. The test-era portrait composition is hips-up with hands and preferably wrists outside frame.
13. Test-era portraits use no held props or held weapons by default.
14. Portrait generation is optional and cannot block character creation.
15. Existing initials remain a fallback when no valid portrait asset exists.
16. Portrait-relevant identity changes mark an image stale rather than automatically regenerating it.
17. Ordinary equipment changes do not stale the v1 identity portrait.
18. Provider / model / crop / lighting details are renderer configuration, not character identity.
19. The free test-generation service is disposable infrastructure.
20. Moving to a production image service must not require changing saved character facts.

## Planning Package Boundaries

This package intentionally does not yet settle:

- exact provider selection;
- provider credentials / quotas / pricing;
- exact provider pixel dimensions;
- exact production renderer capabilities;
- canonical visual morphology for every fantasy lineage;
- every lineage-specific facial-hair rule;
- every culture-specific tattoo / piercing / hairstyle;
- final creator UI layout implementation;
- save migration strategy if active development saves must later be preserved;
- flaw / drawback trait design.

Those should be resolved through focused follow-up decisions rather than guessed during implementation.

## Current High-Priority Open Decisions

Before implementation reaches full catalog lock, settle:

1. Dark Elf sex-dimorphism lore and exact modifier direction.
2. Half-Goblin sex-dimorphism lore and exact modifier direction.
3. Half-Merfolk sex-dimorphism lore and exact modifier direction.
4. Final Half-Troll Tier-2 magnitude.
5. Canonical morphology profile for all ten playable lineages.
6. Whether Dwarven women can grow visible facial hair in setting canon.
7. Whether Half-Orcs have visible tusks or another canonical mouth / jaw morphology.
8. Whether Half-Merfolk have visible aquatic face / neck morphology.
9. Which appearance styles are universal versus culture-specific.
10. Exact global portrait art direction.

## Suggested Implementation Consumption Order

A future coding pass should consume this package in slices:

### Slice A: catalog authority

- mechanical trait types and data;
- appearance descriptor types and data;
- lineage sex profiles;
- lineage portrait profiles;
- validation tests.

### Slice B: resolver

- replace Physique / Nature / Focus resolver;
- preserve deterministic 10-point allocation;
- update attribute preview breakdown.

### Slice C: form and persistence

- replace old profile IDs;
- add trait IDs;
- add appearance descriptor IDs;
- update randomization;
- update save / load fixtures.

### Slice D: creator UI

- grouped trait selection;
- appearance customization;
- live attribute preview;
- portrait preview / fallback state.

### Slice E: portrait specification

- deterministic prompt spec;
- lineage morphology fragments;
- render-profile contract;
- identity fingerprint and stale-state logic.

### Slice F: testing provider

- provider adapter;
- explicit Generate / Regenerate action;
- stable asset reference;
- test-era hips-up generation;
- failure handling.

### Slice G: production provider later

- replace or supplement provider adapter;
- add production render profile;
- preserve canonical identity and descriptor IDs.

## Isolation Requirement

Before any future implementation pass:

- inspect current `master`;
- compare the planning branch against current implementation work;
- preserve unrelated Codex / GPT changes;
- do not assume file paths in these plans are unchanged;
- treat current source as implementation reality and these documents as design intent;
- surface conflicts explicitly rather than silently reconciling them through broad rewrites.

This package is meant to preserve design decisions, not override newer implementation authority without inspection.
