# Religious Hotspot Seed Preflight Audit

Source route: ChatGPT via GitHub Connector  
Date: 2026-06-16  
Status: connector-side preflight audit; documentation only; not an implementation handoff

## Purpose

This preflight audit reviews the planned `Version 0.5.177 - Religious Hotspot Content Authority Seed` before live content is added.

It exists to keep the upcoming seed implementation narrow and to preserve the current rationale for the selected records.

This file is not:

- live content;
- schema authority;
- validator authority;
- a normal content-lint registration;
- Knowledge snippet subject support;
- permission to implement favorability, law, faction, runtime, UI, storage, reward, command, event, Magic Study, Prestige, family, or gameplay behavior.

## Current Pipeline Context

- Latest completed numbered run: `Version 0.5.176 - Religious Hotspot Content Authority Seed Plan`.
- Next recommended Codex run: `Version 0.5.177 - Religious Hotspot Content Authority Seed`.
- This connector audit does not renumber, replace, or interrupt the active `0.5.177` run.

## Current Implemented Authority

Already exists:

- `packages/schemas/world/religious-hotspot.schema.json`
- `tools/content-lint/religious-hotspots.mjs`
- `tests/unit/religious-hotspots-validation.test.mjs`
- schema smoke registration in `tests/unit/schema-files.test.mjs`

Still intentionally absent:

- `packages/content/base/world/religious_hotspots.json`
- normal content-lint registration for `religious_hotspots.json`
- direct `religious_hotspot` Knowledge snippet subject support
- live Religious Hotspot Knowledge snippets
- `world.sacred_sites`
- `religiousOrderIds` support
- favorability/alignment/law/consequence/runtime systems

## Planned Seed Records

The upcoming `0.5.177` implementation should add exactly these two records if both validate unchanged:

1. `religious_hotspot.glasswake_shrine_lantern_gardens`
2. `religious_hotspot.lantern_shrine_gardens`

Both should use:

- `status: "planned"`
- `religionIds: ["religion.elemental_pantheon"]`
- no `deityIds`
- no `dominantFaithIds`
- no `toleratedFaithIds`
- no `restrictedFaithIds`
- no `religiousOrderIds`
- conservative descriptive enum values
- explicit descriptive/no-runtime/no-consequence notes

## Fallback Rule

If the future implementation finds that both records no longer validate unchanged, the fallback should be:

1. Seed only `religious_hotspot.glasswake_shrine_lantern_gardens`.
2. Defer `religious_hotspot.lantern_shrine_gardens` if the locality-scale record becomes ambiguous, redundant, or incoherent with current place hierarchy.

Do not improvise a third record during the seed implementation.

## Record 1 Preflight: `religious_hotspot.glasswake_shrine_lantern_gardens`

Recommended posture: keep.

Rationale:

- It is the stronger first seed because it has settlement, locality, subregion, and macro-region anchors.
- It maps directly to `settlement.glasswake_shrine`.
- It can distinguish the specific shrine community from the broader locality later.
- Current plan says its full hierarchy is known and coherent.

Planned field posture:

- `id`: `religious_hotspot.glasswake_shrine_lantern_gardens`
- `slug`: `glasswake_shrine_lantern_gardens`
- `name`: `Glasswake Shrine Lantern Gardens`
- `status`: `planned`
- `placeAnchor`: include `region.lantern_isles`, `region.glasswake_quay`, `region_locality.lantern_shrine_gardens`, and `settlement.glasswake_shrine`
- `religionIds`: include `religion.elemental_pantheon` as a planned authored relationship
- `hotspotType`: `settlement_shrine`
- `sacredSiteType`: `shrine`
- `hotspotIntensity`: `minor`
- `publicPosture`: `tolerant`
- `mismatchPressure`: `none`
- `pilgrimageStatus`: `local`

Do not add:

- `deityIds`
- `dominantFaithIds`
- `toleratedFaithIds`
- `restrictedFaithIds`
- `religiousOrderIds`

## Record 2 Preflight: `religious_hotspot.lantern_shrine_gardens`

Recommended posture: keep if it validates unchanged.

Rationale:

- It captures the broader shrine-garden locality rather than the single settlement.
- It may be useful later if Knowledge snippets need broader local context.
- It should remain separate only if future snippets benefit from both settlement-scale and locality-scale authority.

Planned field posture:

- `id`: `religious_hotspot.lantern_shrine_gardens`
- `slug`: `lantern_shrine_gardens`
- `name`: `Lantern Shrine Gardens`
- `status`: `planned`
- `placeAnchor`: include `region.lantern_isles`, `region.glasswake_quay`, and `region_locality.lantern_shrine_gardens`; omit settlement
- `religionIds`: include `religion.elemental_pantheon` as a planned authored relationship
- `hotspotType`: `locality_shrine_cluster`
- `sacredSiteType`: `shrine`
- `hotspotIntensity`: `minor`
- `publicPosture`: `universal`
- `mismatchPressure`: `none`
- `pilgrimageStatus`: `local`

Do not add:

- `deityIds`
- `dominantFaithIds`
- `toleratedFaithIds`
- `restrictedFaithIds`
- `religiousOrderIds`

## Validation Expectations For `0.5.177`

The future seed implementation should:

1. Add `packages/content/base/world/religious_hotspots.json`.
2. Use the exact `records` wrapper.
3. Add the selected planned records.
4. Register the new content file in `tools/content-lint/index.mjs`.
5. Load hotspot schema plus religions, regions, region localities, and settlements as dependencies.
6. Invoke `validateReligiousHotspots`.
7. Move normal content lint from `content-lint: ok (56 files checked)` to `content-lint: ok (57 files checked)`.
8. Keep Knowledge snippet tests unchanged unless direct subject support is explicitly in scope.

Expected checks:

- `node --test tests/unit/religious-hotspots-validation.test.mjs`
- `node --test tests/unit/schema-files.test.mjs`
- `npm run tool:content-lint`
- `git diff --check`
- changed-path scope audit
- forbidden runtime/UI/storage/event/reward/gameplay edit audit

## Do-Not-Drift Rules For `0.5.177`

Do not add:

- direct `religious_hotspot` Knowledge subject support;
- live hotspot snippets;
- `world.sacred_sites`;
- `religiousOrderIds`;
- `deityIds` unless current place authority is explicitly strengthened first;
- `dominantFaithIds` while records are `planned`;
- `toleratedFaithIds` or `restrictedFaithIds`;
- service access, mismatch penalties, social penalties, law, bounties, exile, imprisonment, faction effects, conversion, apostasy, favorability, piety, elemental alignment, spell penalties, Magic Study, Prestige, family effects, runtime behavior, UI behavior, rewards, events, commands, or gameplay behavior.

## Questions Before `0.5.177`

No user input is required before `0.5.177` if the current recommendations stand.

User input is required only to override one of these defaults:

1. Seed two records instead of one.
2. Keep both records `planned` rather than `active`.
3. Use `religion.elemental_pantheon` as a planned authored relationship.
4. Omit `deityIds` from both records.
5. Omit `dominantFaithIds` from both records.
6. Omit `toleratedFaithIds` and `restrictedFaithIds` from both records.
7. Omit `religiousOrderIds` from both records.
8. Keep Knowledge subject support and snippets out of `0.5.177`.

## Recommended Next Step

Proceed with:

- `Version 0.5.177 - Religious Hotspot Content Authority Seed`

This should be a narrow implementation pass that adds the live hotspot content file and normal content-lint registration only.
