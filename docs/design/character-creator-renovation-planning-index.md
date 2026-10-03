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

### 4. Character Creator Perchance Prototype Provider Plan

`docs/design/character-creator-perchance-prototype-provider-plan.md`

Companion prototype-provider and portrait-control authority.

Covers:

- Perchance as disposable development / test infrastructure rather than canonical character authority;
- provider-compliance and technical-integration boundaries;
- preference for a purpose-built Lineage test generator over embedding a generic control surface when permitted;
- provider-neutral Generate / Regenerate / Retry UI;
- empty, generating, ready, stale, regenerating, and failure states;
- no manual prompt, style, provider, or model controls in ordinary character creation;
- preservation of the previous portrait during regeneration;
- asset persistence and provider provenance;
- provider-neutral error normalization;
- test-era hips-up / hands-hidden render profile;
- assisted-provider fallback if automated Perchance integration is not supportable;
- production-provider replacement requirements.

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
21. The ordinary player-facing portrait interface exposes one principal action at a time: Generate Portrait, Regenerate Portrait, or Retry Portrait.
22. Normal character creation exposes no manual image prompt field.
23. Normal character creation exposes no provider selector, model selector, sampler, inference, style, or advanced generation controls.
24. Regeneration preserves the previous portrait until a replacement succeeds.
25. A failed first generation falls back to initials and never invalidates the character.
26. A failed regeneration preserves the previous portrait and allows another attempt.
27. Perchance is a prototype-provider candidate, not a production dependency.
28. A future implementation must re-check provider rules before enabling Perchance automation or embedding.
29. Undocumented scraping, simulated third-party UI control, reverse-engineered endpoints, and cross-origin DOM manipulation are not planned integration strategies.
30. If Perchance cannot support an acceptable automated path, it may remain assisted / developer-only while the same Lineage Generate / Regenerate UI and state model are retained for a later provider.

## Planning Package Boundaries

This package intentionally does not yet settle:

- final production provider selection;
- production provider credentials / quotas / pricing;
- exact provider pixel dimensions;
- exact production renderer capabilities;
- whether Perchance ultimately supports an acceptable automated, purpose-built embedded, or assisted prototype path at implementation time;
- canonical visual morphology for every fantasy lineage;
- every lineage-specific facial-hair rule;
- every culture-specific tattoo / piercing / hairstyle;
- final creator UI layout implementation outside the settled portrait-action state model;
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
11. At prototype implementation time, re-check Perchance's current integration rules and determine whether the adapter is automated, purpose-built embedded, or assisted.
12. Decide where generated portrait assets are persisted independently of transient provider pages or URLs.

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
- portrait preview / fallback state;
- provider-neutral Generate / Regenerate / Retry control state machine.

### Slice E: portrait specification

- deterministic prompt spec;
- lineage morphology fragments;
- render-profile contract;
- identity fingerprint and stale-state logic.

### Slice F: testing provider

- first prove the portrait state machine with a fake or deterministic local stub provider;
- re-check current Perchance integration rules;
- choose automated, purpose-built embedded, or assisted prototype mode only if supportable;
- keep the ordinary player-facing UI limited to Generate / Regenerate / Retry;
- use the test-era hips-up generation profile;
- persist a stable Lineage-owned asset reference;
- normalize provider failures into application-owned error states;
- never block character completion when generation fails.

### Slice G: production provider later

- replace or supplement provider adapter;
- add production render profile;
- preserve canonical identity and descriptor IDs;
- preserve Generate / Regenerate UI semantics;
- preserve portrait fingerprint and stale-state behavior.

## Isolation Requirement

Before any future implementation pass:

- inspect current `master`;
- compare the planning branch against current implementation work;
- preserve unrelated Codex / GPT changes;
- do not assume file paths in these plans are unchanged;
- treat current source as implementation reality and these documents as design intent;
- surface conflicts explicitly rather than silently reconciling them through broad rewrites.

This package is meant to preserve design decisions, not override newer implementation authority without inspection.
