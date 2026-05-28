# Known Spell Ownership Plan

Date: 2026-05-28
Source version/run: Version 0.5.88 - Known Spell Ownership Plan
Status: current planning source for known-spell ownership and acquisition before active magic expansion

## Purpose

Plan known-spell ownership and acquisition boundaries before adding or expanding runtime spell casting, catalyst behavior, scroll/tome behavior, Magic Legacy power, active magic behavior, or spell acquisition UI.

This plan is planning-only. It does not:

- add spells
- edit spell metadata
- add known-spell runtime state
- add cast commands
- add catalyst behavior
- add scroll/tome behavior
- add magic skill gain
- add Magic Legacy power
- expand combat magic runtime
- edit generated output
- edit UI
- edit save/account schema

## Current Repo Reality

Current safe foundation:

- `packages/content/base/player/spells.json` has 55 authored spells.
- Current compatibility status counts are 23 `ready`, 5 `partial`, and 27 `deferred`.
- 28 spells have `compatibilityProfile` metadata.
- Every spell has top-level `primaryFamily` metadata validated by magic metadata tests.
- Spell resolution hooks are classified as runtime, classifier, deferred, or unknown by `tools/content-lint/spell-hook-support.mjs`.
- Magic metadata validation for spell compatibility, item conduit metadata, and catalyst metadata lives in `tools/content-lint/magic-metadata-support.mjs`.
- `packages/content/base/items/items.json` currently has 7 conduit-profiled items and 3 catalyst-profiled items.
- The Arcane Compendium projects all 55 spells as read-only references and explicitly avoids command, acquisition, known-spell, learned, prepared, owned, slot, and loadout fields.
- New character creation currently starts with `playerState.spells: []`.

Current risky/incomplete foundation:

- `PlayerSpellState` in `packages/shared/types/src/contracts.ts` is a character-local list with `id`, `school`, optional `primaryFamily`, optional tradition/discipline/element, `rank`, and `source: "learned" | "taught"`.
- There is no explicit `knownSpellId`, acquisition source, teacher, institution, source item, source event, source run, or availability state.
- `buildPlayerHooks(...)` in combat reads `playerState.spells` and maps matching catalog records into `spellActionGrants`.
- The current combat path can stage learned spell metadata into queued spell actions, but it does not prove acquisition ownership, conduit requirements, catalyst requirements, control capacity, or active magic policy.
- Current spell and item JSON schema files are parseable schema documents, but magic compatibility/conduit/catalyst guardrails are enforced by focused lint helpers and tests rather than by a future known-spell ownership schema.
- Legacy/account/family systems exist for account unlocks, family records, Family Prestige transactions, run history, and read-only presentation, but they do not own spell knowledge.

## Ownership Model

Preferred early model: character-known spells first.

Known spells should live on the current character/run as explicit character-scoped spell knowledge. A spell is not known because it exists in the catalog, appears in the Arcane Compendium, is referenced by a quest, is associated with an item, or is reachable through account/family/institution access.

Early known spells:

- Owner scope: `character`.
- Owner id: current `playerId` or future stable character id.
- Spell id: a valid spell catalog id.
- Lifetime: known while that character/run remains active and saved.
- Death/retirement: does not automatically persist to new characters.
- Account/family transfer: unavailable unless a future evidence model explicitly records a preserved tradition, teacher, document, or institution route.

Deferred ownership scopes:

- Family-scoped magical tradition.
- Account-scoped spell access.
- Institution-scoped licensing or curriculum.
- Item/document-scoped temporary use.
- Source-run or heir inheritance of spell knowledge.

Why access is not knowledge:

- Account access can unlock a route to learn, but it does not prove the current character studied or can cast the spell.
- Family tradition can preserve evidence, but it does not make every family member know the spell.
- Institution access can authorize training, but training completion still needs a character-scoped acquisition record.
- Document ownership can provide reference or study material, but it does not mutate character knowledge by itself.

## Acquisition Model

A spell becomes known only when a character-scoped known-spell record is created from valid acquisition evidence.

Future acquisition evidence types:

- `teacher`: a specific trainer, mentor, or NPC teaches the spell.
- `institution`: a guild, temple, academy, or tradition grants training access and records completion.
- `training_event`: a character-level training or study event completes.
- `quest_event_reward`: a quest/event reward explicitly teaches the spell to the character.
- `scroll`: a scroll teaches or temporarily authorizes a spell only if scroll policy is implemented.
- `tome`: a tome unlocks study access or teaches only if tome policy is implemented.
- `discovered_record`: a discovered inscription/record enables study only if record ownership is implemented.
- `legacy_access_lane`: Legacy unlocks a learning route, teacher, safe study threshold, or preparation lane, not direct knowledge.
- `family_tradition`: family evidence unlocks a learning route only after family tradition ownership is implemented.

Safe early acquisition routes:

- `training_event` as an explicit character-scoped record source in pure helpers/tests.
- `teacher` as a future character-scoped evidence type once teacher ids or training event ownership exists.
- `quest_event_reward` only after quest/event ownership can emit a stable source event id.

Deferred acquisition routes:

- Scrolls and tomes teaching spells.
- Temporary item/document-granted spell use.
- Discovered records teaching spells.
- Institution licensing/curriculum.
- Family tradition inheritance.
- Legacy-granted spell knowledge.
- Backstory or lineage starter spell bundles.

## Scroll / Tome / Document Policy

Document ownership must remain separate from known-spell state.

Policy options:

- Reference only: document appears in inventory/codex and describes or hints at spells.
- Study access: document authorizes a later training/study event but does not teach immediately.
- Teaching document: document can create a known-spell acquisition record after checks and consumption/persistence rules.
- Temporary grant: document or item grants limited use without knowledge.

First implementation policy:

- Use reference-only or study-access metadata, not teaching or temporary grants.
- Scrolls/tomes/documents must not create `PlayerSpellState` or future known-spell records without a dedicated acquisition route.
- Scroll/tome/document ids should be available as optional acquisition source fields later, but inactive until document ownership, item instance persistence, consumption/persistence, and validation rules exist.

Deferred document work:

- Magical books/tomes after the spell database and study owner exist.
- Magical scrolls after scroll item ownership and consumption policy exist.
- Enchanter-authored arcane documents as the owning implementation path for crafted/studied documents.

## Legacy / Account / Family Boundaries

Magic Legacy must not grant direct spell power.

Allowed later, only after owner rules exist:

- Unlocking access lanes to teachers or traditions.
- Improving safe study thresholds.
- Supporting recovery/preparation around magic.
- Preserving family tradition evidence for eligible descendants.
- Increasing known-spell capacity only if a future design still needs capacity.

Forbidden for early work:

- Direct spell power bonuses.
- Free starter spell bundles.
- Direct magic skill-rank grants.
- Direct known-spell records from account unlocks.
- Direct family-wide spell knowledge.
- Bypassing catalyst, conduit, MP, stamina, strain, or control constraints.

Non-inference rules:

- Do not infer spell ownership from `lineageId`.
- Do not infer spell ownership from backstory id.
- Do not infer spell ownership from UI state.
- Do not infer spell ownership from selected character state without an explicit known-spell record.
- Do not infer spell ownership from `sourceRunId`.
- Do not infer spell ownership from account id.
- Do not infer family magical tradition from `familyId` alone.

## Data Shape Planning

Future known-spell owner record shape:

```ts
type KnownSpellOwnerScope = "character";

type KnownSpellAcquisitionRoute =
  | "training_event"
  | "teacher"
  | "quest_event_reward"
  | "institution"
  | "scroll"
  | "tome"
  | "discovered_record"
  | "legacy_access_lane"
  | "family_tradition";

type KnownSpellAvailabilityState =
  | "available"
  | "blocked"
  | "forgotten"
  | "lost"
  | "revoked";

interface KnownSpellRecordState {
  knownSpellId: string;
  ownerScope: KnownSpellOwnerScope;
  ownerId: string;
  characterId: string;
  spellId: string;
  rank: number;
  acquisitionRoute: KnownSpellAcquisitionRoute;
  acquiredAt: string;
  acquiredAtRunId?: string;
  acquiredByCharacterId?: string;
  sourceTeacherId?: string;
  sourceInstitutionId?: string;
  sourceItemInstanceId?: string;
  sourceItemId?: string;
  sourceEventId?: string;
  sourceQuestId?: string;
  sourceLegacyUnlockId?: string;
  sourceFamilyId?: string;
  availability: KnownSpellAvailabilityState;
  blockedReason?: string;
  notes?: string[];
}
```

Early helper shape may be narrower:

- `knownSpellId`
- `ownerScope: "character"`
- `ownerId`
- `characterId`
- `spellId`
- `acquisitionRoute: "training_event"`
- `acquiredAt`
- `availability: "available" | "blocked"`

Do not add account, family, institution, document, or item-instance scopes to live state until their owner systems exist.

## Validation Plan

Future validation rules:

- `knownSpellId` must be stable and unique within the owner collection.
- `ownerScope` must be supported; early implementation supports only `character`.
- Character owner id must match an existing current character/player owner.
- `spellId` must reference a valid current spell catalog id.
- The spell catalog record must not be `deferred` or `placeholder` for active casting.
- `partial` records remain blocked for active casting unless their blocked behavior is explicitly allowed by a narrow lane.
- Acquisition route must be one of the approved route ids.
- Acquisition route must include the required source evidence for that route.
- Account/family/institution/document access must not count as known without explicit character acquisition.
- Scroll/tome/document ids must not teach unless document policy is implemented.
- Legacy access lanes must not create known-spell records directly.
- Unsupported, deferred, or unknown hooks remain blocked.
- Unsupported casting lanes remain blocked.
- Current-data-only policy applies; old-save compatibility is not required unless explicitly requested.

Future tests should prove:

- Valid character-scoped known-spell records pass.
- Unknown spell ids fail.
- Missing owners fail.
- Account/family/institution/document access records do not count as known.
- Legacy access lanes do not create known spells.
- Deferred and unknown hooks block active casting.
- Arcane Compendium projection remains independent from known-spell state.
- Existing `PlayerSpellState[]` combat grants are not treated as a full acquisition model until migrated or replaced by explicit owner helpers.

## Runtime Casting Blockers

Active spell casting must stay blocked until these are owned and tested:

- Known-spell check against a character-scoped known-spell record.
- Equipped conduit source.
- Conduit tag resolution.
- Optional catalyst source.
- Catalyst consumption or persistence.
- Character control capacity.
- MP, stamina, strain, and any health/backlash cost payment.
- Failure, backlash, collateral, and miscast state.
- Combat versus noncombat context.
- Spell/effect lane ownership for each hook.
- Item-generation behavior for generated spell items.
- Unsupported, deferred, and unknown hook behavior.
- UI command owner and command validation.
- Save/current-data validation for known spell records.
- Tests proving blocked hooks remain blocked.

Current combat spell grant behavior should be treated as readiness context only. It is not permission to broaden active magic, bypass acquisition, or skip conduit/catalyst/control policy.

## First Safe Implementation Slice

Recommended next version:

`Version 0.5.89 - Known Spell Ownership Helpers`

Scope:

- Add pure known-spell ownership helper types/functions and focused tests only.
- Support current-data character-scoped records only.
- Validate spell ids against the current spell catalog.
- Validate supported owner scope and acquisition route.
- Expose a pure `characterKnowsSpell(...)` or equivalent helper that does not mutate state.
- Keep Arcane Compendium read-only and independent.
- Do not wire combat casting, UI commands, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, family inheritance, institution licensing, or document teaching.

Do not recommend active casting as the next slice. Ownership helpers should land first, followed by validation helpers or a read-only known-spell projection only if the helper boundary proves clean.

## Deferred / Forbidden Work Not Touched

- runtime spell casting expansion
- catalyst effects or consumption
- scroll/tome teaching or temporary grants
- spell acquisition UI
- Magic Legacy direct power
- magic skill gain
- save/account schema changes
- generated output
- economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior
