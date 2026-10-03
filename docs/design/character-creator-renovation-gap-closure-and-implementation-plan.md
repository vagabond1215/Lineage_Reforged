# Character Creator Renovation Gap Closure And Implementation Plan

## Status

Implementation authority for branch `feature/character-creator-renovation-v1`, created from `master` at `c318f64c2f96c932777ca5b8c7454ced9794cada`.

This document closes implementation gaps found after re-auditing the existing character-creator planning package against current source. It is intentionally narrower than the original design documents: it records the missing execution rules that must be true while the new creator is being coded.

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

## Gaps Found In The Previous Implementation Plan

### 1. Async generation race ownership

The prior plan described stale portraits but did not fully define what happens when identity changes or a second generation begins while an older request is still running.

Required rule:

- every request captures `requestId` and the normalized portrait identity fingerprint it was launched against;
- only the newest active request may replace preview state;
- a late older response is ignored;
- if identity changes before a response returns, the result may be retained as an outdated preview but may not be marked current;
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

The previous plan left clean cut versus temporary compatibility bridge open. This branch chooses clean cut for active creator behavior. Legacy union types may remain exported temporarily if unrelated code still imports them, but the new creator does not read or write old Physique/Nature/Focus fields.

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
- adopt explicit lineage sex modifiers;
- remove Human fallback from creator sex lookup;
- update creator form validation and defaults;
- extend existing full-character randomizer.

### C. Snapshot and preview cutover

- persist `profileTraitIds` and `appearanceDescriptorIds` in identity profile;
- update preview contribution name to `Selected Profile Traits`;
- keep runtime `playerState.traits` unchanged;
- update demo and save/load fixtures.

### D. UI cutover

- replace Physique/Nature/Focus controls with grouped profile-trait selection;
- add appearance editor with dependency-aware controls;
- add portrait preview panel and Generate/Regenerate/Retry states using the deterministic local provider;
- keep current `AppShell`, world-selection flow, optional backstory, bundle flow and stat preview.

### E. Cleanup and verification

- remove active creator dependence on old profile fields/helpers;
- keep only compatibility surface required by unrelated source;
- add regression tests for randomization, resolver invariants, persistence, portrait races and namespace separation;
- compare branch against current master before any integration because G9E/G9F/G10 persistence work remains active elsewhere.

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

The branch is ready for integration review only when:

1. every valid creator profile resolves deterministically to a 90-point base plus exactly 10 generated profile points before later Legacy adjustments;
2. exactly six valid profile traits are required and randomization always satisfies the same rules;
3. appearance descriptors cannot affect attributes;
4. no creator-profile ID is added to `playerState.traits`;
5. new snapshots persist creator profile and appearance IDs;
6. old Physique/Nature/Focus controls are absent from the active creator;
7. portrait generation can be skipped without blocking character creation;
8. Generate/Regenerate race handling is request/fingerprint safe;
9. the previous successful portrait survives a failed regeneration;
10. existing world/backstory/bundle/save-slot behavior remains intact;
11. branch reconciliation is rerun against the then-current persistence head before merge.
