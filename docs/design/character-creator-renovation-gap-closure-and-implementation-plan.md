# Character Creator Renovation Gap Closure And Implementation Plan

## Status

Implementation authority for branch `feature/character-creator-renovation-v1`.

The branch was created from `master` at `c318f64c2f96c932777ca5b8c7454ced9794cada`, then reconciled with the later G9E persistence head `3335261c6e700e711aa688ebb931af0d3f7ac2f5` through PR #4. The synchronization merge commit on the feature branch is `42df6626545ad3ba254145775b248975426971a3`; `master` was not modified by that synchronization.

This document closes implementation gaps found after re-auditing the existing character-creator planning package against current source. It is intentionally narrower than the original design documents: it records the missing execution rules that must be true while the new creator is being coded.

### Closure state

The source implementation described below is complete on the feature branch. The remaining gate is executable verification in a normal repository checkout or CI environment. This connector-only pass could inspect and modify hosted source, compare refs, and add regression tests, but it did not have an attached branch CI run or a runnable local checkout. Therefore the tests listed below are implemented but are not claimed as executed or passing here.

Implemented in source:

- six-trait `profile_trait.*` creator-profile authority and deterministic 10-point allocation;
- appearance-only `appearance.*` authority with exclusivity, dependency, sex, lineage, and selection-limit validation;
- shared lineage-owned sex attribute modifiers used by creator and runtime origin resolution;
- active form, randomization, preview, snapshot, and creator UI cutover from Physique/Nature/Focus;
- persistence of `profileTraitIds` and `appearanceDescriptorIds`, while new snapshots write the legacy profile slots as `null`;
- strict separation between creator profile traits and runtime passive `playerState.traits`;
- provider-neutral portrait prompt/fingerprint contract, deterministic local proof provider, stale-state handling, and request-race ownership;
- active launcher-shell creator with live attributes, appearance controls, optional portrait generation, inherited-lineage source selection, world/backstory/bundle flow, save-slot selection, and overwrite confirmation;
- regression coverage authored for resolver invariants, valid randomization, appearance mechanical inertness, shared sex authority, persistence separation, portrait request supersession, failed regeneration preservation, and stale portrait handling including temporarily invalid identity state;
- branch reconciliation against the current G9E master head.

Deferred intentionally:

- a production portrait provider or direct Perchance automation;
- durable portrait blob/asset persistence;
- snapshot-envelope or IndexedDB generation migration owned by the persistence track;
- full deletion of legacy Physique/Nature/Focus shared types/helpers still required by unrelated compatibility surfaces;
- broader shell, combat, progression, or full-body portrait redesign.

## Decisions Locked For This Implementation

1. Use a **clean development-save cut** on this feature branch. Newly created characters write only the new creator-profile authority. Old development fixtures are updated rather than supported through a second active stat resolver.
2. Creator stat-shaping traits use the namespace `profile_trait.*` and the form/persistence field `profileTraitIds`. They never enter `playerState.traits`.
3. Appearance-only facts use `appearance.*` IDs and never contribute attribute weights.
4. The fixed generated-profile pool remains exactly 10 points. The lineage baseline remains 90 before creator-profile allocation.
5. The currently documented lineage-sex recommendations are adopted as the v1 implementation values. They remain ordinary starting modifiers, not caps.
6. Existing runtime lineage passive traits remain untouched.
7. Portrait generation is optional and never gates character creation.
8. The initial render profile remains hips-up, one adult subject, 4:5 preferred, hands and preferably wrists outside frame, no held props, no held weapons, simple background.
9. The first portrait provider is deterministic/local and exists only to prove the application-owned state machine. No undocumented third-party automation is added.
10. Durable portrait blob storage is deferred. The first portrait result is preview state, not snapshot authority.
11. Playable-lineage sex modifiers are owned by shared lineage origin data. Creator presentation may describe and validate those values, but it must not maintain a second mechanical table.

## Gaps Found In The Previous Implementation Plan

### 1. Async generation race ownership

The prior plan described stale portraits but did not fully define what happens when identity changes or a second generation begins while an older request is still running.

Required rule:

- every request captures `requestId` and the normalized portrait identity fingerprint it was launched against;
- only the newest active request may replace preview state;
- a late older response is ignored;
- if identity changes before a response returns, the result may be retained as an outdated preview but may not be marked current;
- a temporarily invalid portrait identity is treated as current fingerprint `null`, which also marks an existing or newly completed portrait stale;
- regeneration failure never destroys the previous successful portrait;
- cancel/abort, where supported, is an optimization rather than correctness authority.

### 2. Request provenance versus character identity

Provider/model/size/retry metadata must not affect the character identity fingerprint.

The fingerprint includes only normalized portrait-relevant character facts and prompt-spec version. Provider request IDs are separate provenance.

### 3. Free-text and prompt-injection boundary

No player-authored free-form prompt is exposed. Canonical prompt fragments come from authored catalogs. Character name is presentation data and is not required in the image prompt.

If future free text is ever introduced, it requires a separate sanitization/moderation design rather than being concatenated into provider instructions.

### 4. Accessibility contract

Trait and appearance selection must remain keyboard reachable and screen-reader understandable.

Required UI behavior:

- real buttons/inputs rather than click-only divs;
- selected state exposed with `aria-pressed` or native checked semantics;
- group labels remain visible to assistive technology;
- selection-count and conflict errors are textual, not color-only;
- Generate/Regenerate loading state exposes busy/disabled semantics;
- stale portrait state is textual and not represented by tint alone.

### 5. Portrait-state race tests

Required focused tests now include:

- request B supersedes request A;
- late A cannot replace B;
- identity edit during A marks A stale if retained;
- temporarily invalid identity marks an existing or completing portrait stale;
- failed regeneration preserves the prior successful image;
- provider change does not alter identity fingerprint;
- descriptor-array order does not alter fingerprint.

### 6. Snapshot and runtime trait namespace collision

`PlayerIdentityProfile.profileTraitIds` and `PlayerState.traits` are unrelated authorities. Source and tests must assert they do not cross-populate.

### 7. Catalog evolution/versioning

Saved profile and appearance IDs are durable identifiers. Labels and prompt wording may evolve, IDs may not silently change.

Prompt behavior has its own integer version. Changing prompt semantics without changing character facts increments prompt-spec version and may make an existing portrait eligible for regeneration without altering stats.

### 8. Randomization termination

Randomization must be valid by construction and must not use an unbounded retry loop. Profile traits are selected in category order under explicit capacity constraints. Appearance dependencies are resolved in dependency order.

### 9. Lineage morphology must be explicit before provider use

V1 morphology authority is conservative and limited to high-confidence setting distinctions needed to stop a generator inventing incompatible anatomy. Provider prompts must never rely only on generic fantasy labels.

### 10. Development-save compatibility decision

The previous plan left clean cut versus temporary compatibility bridge open. This branch chooses clean cut for active creator behavior. Legacy union types may remain exported temporarily if unrelated code still imports them, but the new creator does not read or write old Physique/Nature/Focus selections as active creator authority. New snapshots explicitly write those legacy identity-profile slots as `null`.

### 11. Sex-modifier authority duplication

The initial plan treated lineage sex modifiers as creator work, while shared origin resolution still carried a universal Human-style adjustment. That would have created two biological authorities and allowed creator stats, runtime origin metadata, simulations, or downstream UI to disagree.

Required rule:

- playable-lineage sex modifiers live in shared lineage origin authority;
- the creator wrapper reads those shared values and adds only presentation/rationale;
- every playable male and female adjustment is explicit and zero-sum;
- `neutral` remains a zero-adjustment shared compatibility value, not a creator selection;
- unknown/non-playable lineage fallback is zero adjustment, never Human fallback.

## Implementation Order

### A. Canonical authorities

- add profile-trait catalog, validation, aggregation and valid random selection;
- add appearance descriptor catalog, dependencies, validation and random selection;
- add explicit portrait morphology/render profiles/prompt spec/fingerprint;
- add provider-neutral portrait request/result state machine and deterministic local provider;
- add structural tests.

### B. Mechanical cutover

- switch attribute resolver from Physique/Nature/Focus to six profile traits;
- preserve largest-remainder 10-point distribution;
- adopt explicit lineage sex modifiers in shared lineage origin authority;
- remove Human fallback from creator sex lookup;
- update creator form validation and defaults;
- extend existing full-character randomizer.

### C. Snapshot and preview cutover

- persist `profileTraitIds` and `appearanceDescriptorIds` in identity profile;
- update preview contribution name to `Selected Profile Traits`;
- keep runtime `playerState.traits` unchanged;
- write legacy Physique/Nature/Focus identity slots as `null` for new characters;
- preserve the current snapshot envelope so the creator branch does not conflict with G9 persistence generation work.

### D. UI cutover

- replace Physique/Nature/Focus controls with grouped profile-trait selection;
- add appearance editor with dependency-aware controls;
- add portrait preview panel and Generate/Regenerate/Retry states using the deterministic local provider;
- keep current `AppShell`, inherited-lineage source flow, world-selection flow, optional backstory, bundle flow, save-slot workflow and stat preview.

### E. Cleanup and verification

- remove active creator dependence on old profile fields/helpers;
- keep only compatibility surface required by unrelated source;
- add regression tests for randomization, resolver invariants, persistence, shared sex authority, portrait races and namespace separation;
- compare branch against current master before integration;
- execute focused unit tests and the RPG UI typecheck in a normal checkout or CI before merging the feature branch to master.

## Explicit Non-Goals Of This Source Pass

- no direct Perchance automation;
- no production image provider;
- no durable image/blob storage;
- no snapshot-envelope or IndexedDB generation migration;
- no changes to runtime passive lineage traits;
- no broader shell rewrite;
- no combat/progression redesign;
- no full-body portrait mode.

## Acceptance Gate

The source implementation now addresses items 1 through 11 below. Integration remains contingent on executing the relevant tests/typecheck outside this connector-only session.

1. every valid creator profile resolves deterministically to a 90-point base plus exactly 10 generated profile points before later Legacy adjustments;
2. exactly six valid profile traits are required and randomization always satisfies the same rules;
3. appearance descriptors cannot affect attributes;
4. no creator-profile ID is added to `playerState.traits`;
5. new snapshots persist creator profile and appearance IDs and null the retired creator-profile slots;
6. old Physique/Nature/Focus controls are absent from the active creator;
7. portrait generation can be skipped without blocking character creation;
8. Generate/Regenerate race handling is request/fingerprint safe, including temporarily invalid identity state;
9. the previous successful portrait survives a failed regeneration;
10. existing inherited-lineage source, world, backstory, bundle, save-slot and overwrite behavior remains represented in the active creator;
11. the branch is reconciled with current master and the shared lineage origin system is the sole sex-stat authority.

### Required executable verification before integration

Run at minimum:

- the RPG UI TypeScript/typecheck command used by the repository;
- `tests/unit/character-creation-profile-resolver.test.mjs`;
- `tests/unit/character-creator-renovation-authority.test.mjs`;
- `tests/unit/character-creator-sex-and-persistence.test.mjs`;
- existing character-creation preview/form/randomization tests affected by the form-shape cutover;
- existing save/load and clean-epoch tests that exercise `PlayerIdentityProfile` or new-game snapshot creation.

Do not treat the presence of these test files as evidence that they have executed. A failing pre-merge typecheck or regression test reopens the relevant acceptance item.
