# Classless Progression And Placeholder Provenance Audit

Date: 2026-08-27

Status: `AUDIT_COMPLETE_CLASSLESS_DIRECTION_CONFIRMED_COMPATIBILITY_RETAINED`

Execution surface: ChatGPT via GitHub Connector; documentation-only

Source baseline: `1dce837355ac31e237d896b5c962575b35a8712e`

Active route protected: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

## 1. Result

The live ordinary player path is already materially **classless**.

A fresh ordinary character is created with:

- `classId: null`;
- `jobId: null`;
- legacy `classLevel: 0`;
- no class resource-growth contribution.

The remaining player-facing class/job material falls into two different categories that must not be confused:

1. **live compatibility scaffolding** retained in serialized/player-origin/progression contracts for historical data and deterministic validation;
2. **stale or placeholder provenance language** in older player-stat documentation describing FFXI/job-era source material that no longer matches the current catalogs exactly.

No production removal is safe from a Connector pass. The current direction is:

`CLASSLESS_PRODUCT_DIRECTION + RETAIN_COMPATIBILITY_UNTIL_VERSIONED_RETIREMENT`.

## 2. Classification Summary

| Surface | Classification | Current posture |
| --- | --- | --- |
| ordinary new-game `classId` | `CURRENT_CLASSLESS_ARCHITECTURE` | always initialized `null` |
| ordinary new-game `jobId` | `CURRENT_CLASSLESS_ARCHITECTURE` | initialized `null`; no player job resolver found |
| ordinary new-game `legacyGrowth.classLevel` | `CURRENT_CLASSLESS_ARCHITECTURE` | initialized `0` |
| `PlayerCoreData.classId/jobId` | `LIVE_COMPATIBILITY_SCAFFOLD` | serialized contract retained |
| `PlayerLegacyGrowthState.classLevel` | `LIVE_COMPATIBILITY_SCAFFOLD` | normalized from older shapes and validated |
| `PlayerOriginProfileState.class*` fields | `LIVE_COMPATIBILITY_SCAFFOLD` | recomputed/validated, zeroed for ordinary classless creator |
| `PLAYER_CLASS_PROFILES` | `LIVE_COMPATIBILITY_SCAFFOLD` | resolver can still apply non-null historical class ids |
| UI `Classless` label | `CURRENT_CLASSLESS_ARCHITECTURE` | correctly communicates null class |
| UI `Class Growth` / `Class level` details | `SUPERSEDED_TERMINOLOGY` over compatibility fields | exposes dormant compatibility internals |
| current 121-skill catalog | `PLACEHOLDER_CONTENT` lineage with classless schema | no class/job strings found in current records |
| current 32-ability catalog | `PLACEHOLDER_CONTENT` lineage with classless schema | no class/job strings found in current records |
| current 55-spell catalog | `PLACEHOLDER_CONTENT` lineage with classless schema | no class/job strings found in current records |
| current 30-trait catalog | `CURRENT_CLASSLESS_ARCHITECTURE` plus inherited provenance debt | all 30 current records have `sourceType: lineage`; no live job traits |
| `docs/data-dictionary/player-stats.md` | `HISTORICAL_GUIDANCE` + `SUPERSEDED_TERMINOLOGY` | still describes job traits/job abilities and final class taxonomy |
| FFXI elemental relationship direction | `CURRENT_REFERENCE_INPUT`, not class authority | user-approved elemental inspiration remains separate from job/class structure |

## 3. Live Compatibility Fields

### Player core contract

`PlayerCoreData` retains:

- `classId: string | null`;
- `jobId: string | null`.

These fields are serialized state and cannot be removed as cosmetic cleanup.

Ordinary new-campaign, demo, and sim-runner paths inspected currently use `classId: null` and `jobId: null`.

### Legacy progression contract

`PlayerLegacyGrowthState` retains:

- `resourceGrowthLevel`;
- `classLevel`;
- unspent attribute points;
- unspent skill points.

`normalizePlayerProgression(...)` explicitly imports older top-level `classLevel` into the nested compatibility shape.

The campaign authority validates the exact legacy-growth keys and requires nonnegative integers. Therefore `classLevel` remains part of live canonical validation, not dead prose.

Classification: `LIVE_COMPATIBILITY_SCAFFOLD`.

### Origin profile

`PlayerOriginProfileState` retains:

- `classId`;
- `classLabel`;
- `classResourceGrowthPerClassLevel`.

`resolvePlayerOriginProfile(...)` still resolves a non-null class id through `PLAYER_CLASS_PROFILES` and can contribute class resource growth for historical/non-ordinary input.

The current profile table contains six compatibility profiles:
- explorer / Scout;
- warrior / Warrior;
- arcanist / Enchanter;
- artisan / Craftsman;
- merchant / Trader;
- mariner / Hunter.

These must not be treated as approved modern class choices.

Classification: `LIVE_COMPATIBILITY_SCAFFOLD`.

## 4. Ordinary New-Campaign Reality

The ordinary creator resolves resources with:

- selected lineage;
- selected sex;
- `classId: null`;
- `resourceGrowthLevel: 1`;
- `classLevel: 0`.

Character attributes are produced from lineage/identity/backstory/profile choices rather than a class selection.

This is the operative product model.

A future agent must not infer from `PLAYER_CLASS_PROFILES` that:
- the creator should add a class selector;
- class rank should gate abilities;
- class identity should determine quests;
- class-specific skill caps should be restored;
- class levels should become the primary progression axis.

## 5. Current Catalogs Versus Old FFXI/Job Documentation

### What the old dictionary still says

`docs/data-dictionary/player-stats.md` says, among other things:

- skills use FFXI-style placeholder tracks;
- abilities mix FFXI-style job abilities and weapon skills;
- traits include FFXI-style job traits;
- race/job traits unlock through levels/roles;
- FFXI job-specific skill caps are excluded because a future class taxonomy will differ.

That wording is now partly stale.

### What current catalogs actually contain

Connector inspection of the live JSON found:

- 121 skills: no literal `class` or `job` dependency in record content;
- 32 abilities: no literal `class` or `job` dependency in record content;
- 55 spells: no literal `class` or `job` dependency in record content;
- 30 traits: all current records use `sourceType: lineage`; zero current job traits.

The current player schemas for skill, ability, spell and trait likewise contain no class/job gate vocabulary in the inspected schema text.

Therefore the old data dictionary is valuable provenance for where some taxonomy inspiration came from, but it is no longer a reliable current-state description.

Disposition:
- FFXI/job provenance: `HISTORICAL_GUIDANCE`;
- current classless record shapes: `CURRENT_CLASSLESS_ARCHITECTURE`;
- individual imported/inspired names/categories not yet replaced with game-native content: `PLACEHOLDER_CONTENT` / `FUTURE_REPLACEMENT_CANDIDATE`.

## 6. Elemental Reference Is Separate

The user-approved June design decisions explicitly retain the standard FFXI-style elemental relationship as a **reference point** for element names/relationships.

That does not authorize:
- FFXI jobs;
- FFXI class structure;
- FFXI job skill caps;
- FFXI job unlock trees.

Do not purge elemental reference material merely because class/job provenance is being retired.

Classification: `CURRENT_REFERENCE_INPUT`.

## 7. UI Exposure

Current UI presentation correctly includes a fallback role tag:

`originProfile.classLabel ?? 'Classless'`.

However, the same view model also exposes:
- `Class growth ...`;
- `Class Growth`;
- `Growth Tier ... Class ...`.

For a normal creator those values are zero, but the terminology can imply that class progression remains an intended active system.

Classification: `SUPERSEDED_TERMINOLOGY_OVER_LIVE_COMPATIBILITY_FIELD`.

Do not change the UI in this Connector pass. A future UI/content cleanup can hide or relabel dormant compatibility internals while preserving serialized fields.

## 8. Job ID

Player `jobId` is present in `PlayerCoreData`, but current ordinary/demo/sim player construction inspected uses `jobId: null`.

No current player job-profile resolver analogous to `PLAYER_CLASS_PROFILES` was found.

Other repository uses of the word/job-id concept can belong to workplace employment or NPC/civilization semantics and must not be conflated with player class/job progression.

Disposition: `SERIALIZED_NULL_COMPATIBILITY_FIELD_PENDING_DEDICATED_RETIREMENT`.

## 9. Quest Class-Gate Warning

Some older quest schema/content surfaces still contain class-named vocabulary such as requirement/classification fields.

This audit does not authorize removing those fields.

The controlling product rule is:
- classless character development;
- no new hard class gates without a dedicated design decision.

The Ashen authored definition already demonstrates the preferred posture by leaving class-style eligibility gates empty.

## 10. Removal Safety

Removing `classId`, `classLevel`, origin-profile class growth, or class compatibility profiles would touch:
- shared serialized contracts;
- progression normalization;
- resource maxima;
- campaign semantic validation;
- save/load compatibility;
- UI projections;
- tests and potentially historical saves.

Therefore a removal is a persistence/migration package, not a terminology edit.

Reopen only after:
1. `0.6.11.1` is complete;
2. current save-format compatibility expectations are inventoried;
3. live repositories/tests prove whether any accepted fixtures/saves retain non-null class data or nonzero class level;
4. a dedicated migration/retirement decision names backward-compatibility behavior.

## 11. Findings

### F-01 — Ordinary gameplay is classless already

Status: `CONFIRMED`.

### F-02 — Class fields remain executable compatibility authority

Status: `RETAIN_UNTIL_VERSIONED_RETIREMENT`.

### F-03 — Player `jobId` appears null-only in current ordinary construction

Status: `RETIREMENT_CANDIDATE_NOT_YET_PROVEN_SAFE`.

### F-04 — Player-stats data dictionary materially overstates live job/class content

Status: `DOC_REPAIR_READY`.

### F-05 — Current traits no longer contain job traits

Status: `DOC_REPAIR_READY`.

### F-06 — Current skill/ability/spell schemas are already classless in inspected field vocabulary

Status: `PRESERVE`.

### F-07 — FFXI elemental inspiration remains separately authorized

Status: `PRESERVE_REFERENCE`.

### F-08 — UI exposes dormant class compatibility terminology

Status: `DEFER_UI_CLEANUP`.

## 12. Decision

`CLASSLESS_DIRECTION_CONFIRMED_COMPATIBILITY_RETAINED`

No live class compatibility structure is removed by this audit.

## 13. Recommended Immediate Connector-Safe Successor

**Player Stats Data Dictionary Current-State Repair**

Purpose:
- repair `docs/data-dictionary/player-stats.md` so it accurately distinguishes current classless catalogs, historical FFXI provenance, live runtime formulas versus descriptive metadata, and retained compatibility fields;
- preserve the approved elemental-reference history;
- make no production/content/schema/test change.

This is safe to execute before `0.6.11.1` because it is documentation-only and does not alter that audit's authority.
