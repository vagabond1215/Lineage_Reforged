# Legacy Combat Spell Runtime Source Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for a future dedicated runtime-ownership pass; no source, schema, content JSON, UI, generated output, or runtime behavior changes

## Purpose

Map the current legacy combat spell staging and resolution sources before any future implementation pass changes ownership, compatibility gating, multi-effect behavior, status approximations, or magic/combat integration.

This document is a source map. It does not authorize runtime changes.

## Source Files Inspected

- `docs/design/legacy-combat-spell-runtime-ownership-plan.md`
- `docs/dev/project-roadmap.md`
- `packages/engines/game-engine/src/combat/index.ts`
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/shared/types/src/spell-hook-support.ts`
- `packages/content/base/player/spells.json`
- `packages/content/base/player/skills.json`
- `tests/unit/combat-hook-support.test.mjs`
- `tests/unit/magic-hook-support-projection.test.mjs`
- `tests/unit/magic-cast-readiness.test.mjs`

## Current Runtime Reality

### Legacy combat owns a separate spell action path

`packages/engines/game-engine/src/combat/index.ts` has hardcoded spell-like action templates in `ACTION_LIBRARY`, including:

- `spell.cast.elemental.primary`
- `spell.cast.enfeebling.primary`
- `spell.cast.enhancing.primary`
- `spell.cast.healing.primary`

These templates predate the current magic command/resolver boundary. They are combat action templates, not proof that the new magic resolver can execute hooks.

### Combat loads catalog spell content directly

Combat content loading includes `loadPlayerSpellContent()` and builds a spell map in `loadPlayerCombatContent()`.

`buildPlayerHooks(playerState)` maps `playerState.spells` to `spellActionGrants` by looking up each `spellEntry.id` in catalog spell content.

Important boundary:

- `playerState.spells` is the current `PlayerSpellState[]` readiness/context list.
- It is not the newer character-scoped known-spell ownership model.
- This path does not prove ownership through `KnownSpellRecordState`.

### Spell action grants are staged from PlayerSpellState[]

`buildPlayerHooks(...)` derives `spellIds` and `spellActionGrants` from `playerState.spells`.

Each staged grant includes:

- `spellId`
- `actionType`
- `governingSkillId`
- `school`
- optional tradition/discipline/element
- effect tags
- scaling channels
- target profile
- activation/cost profile
- resolution hooks
- item generation hooks

Missing current checks:

- no character-scoped known-spell ownership validation
- no training-event/acquisition evidence validation
- no cast-readiness helper gate
- no resolver-readiness helper gate
- no compatibility-status gate
- no target/command/catalyst/conduit/control/failure policy gate

### Granted spell actions become combat actions

`resolveGrantedActionTemplate(...)` turns an actor's `spellActionGrants` into an `ActionTemplate` when the combat action type matches.

The template then feeds `createCombatAction(...)`, which copies spell source data and resolution hooks into a `CombatActionState`.

This means catalog spell grants can become queued combat actions through combat's legacy action staging path.

## Current Resolution Reality

### Combat has damage, healing, and status approximations

Current combat resolution includes separate resolver helpers such as:

- `resolveCombatDamagePreview(...)`
- `resolveDamageAmount(...)`
- `resolveHealingAmount(...)`
- `buildStatusEffectFromHook(...)`
- `applyStatusHook(...)`

These are combat-owned approximations. They are not the future magic resolver and do not represent complete spell semantics.

### Healing and damage branch order is a risk

The existing deferred plan records that the legacy combat resolver checks healing before damage.

Risk case:

- `spell.shadow.healing.drain` is partial.
- It is enemy-targeted.
- It carries both `heal.hp` and `damage.magic`.
- A heal-first branch can heal an enemy target rather than resolving drain semantics.

A future pass must define multi-effect semantics before changing branch order or promoting this spell.

### Status-like hooks are approximated

Combat currently recognizes some status-like spell hooks by creating temporary combat statuses.

Examples preserved in the deferred plan:

- `support.berry` creates a temporary combat status and does not execute `generated_item.druidic.berry`.
- `mobility.shadow_step` creates a status and does not resolve map/encounter movement.
- `status.stagger` uses the shared status-definition path if reached from spell staging.

These approximations must not be treated as final item generation, movement, or full spell effect resolution.

## Current Magic Helper Boundary

Magic helper work now exists separately from legacy combat staging:

- `buildMagicCastReadiness(...)` returns blockers without applying effects.
- `buildMagicCastResolverReadiness(...)` validates explicit command-like input without mutation.
- `buildMagicResolverInertEnvelope(...)` returns inert planned result envelopes.
- `buildMagicHookSupportProjection(...)` returns six-class classification/provenance and marks every hook `executable: false`.
- `packages/shared/types/src/spell-hook-support.ts` is the authored hook classification authority.

None of these helpers currently authorize combat staging or effectful hook execution.

## Current Deferred Findings

The future dedicated ownership pass must address these findings without combining them with unrelated combat math or hook-classification work.

| Finding | Current source reality | Future decision needed |
| --- | --- | --- |
| PlayerSpellState staging bypasses known-spell ownership | `buildPlayerHooks(...)` stages from `playerState.spells`. | Decide whether combat spell actions require valid `KnownSpellRecordState` and acquisition evidence. |
| Compatibility status not gated | Catalog spell compatibility is not currently checked by combat staging. | Decide whether `compatibilityStatus` blocks staging, resolution, or both. |
| Multi-effect spell order risk | Heal/damage branch order can mis-handle drain-like spells. | Define ordered/grouped multi-effect semantics and atomicity before execution. |
| Status approximations | Some spell hooks create generic combat statuses. | Decide which approximations remain legacy-supported and which become blockers. |
| Item generation not owned | Item-generation hooks are carried but not actually generated by combat. | Decide item-generation owner before execution. |
| Movement not owned | Movement-like spell hooks become status approximations. | Decide encounter/map movement owner before execution. |
| Magic command boundary not connected | Magic command/resolver helpers are pure/inert and not wired into combat. | Define command/result translation without UI-authored authority. |

## Owner And Evidence Questions

Future implementation planning should answer these before touching source:

1. Who owns permission to stage a spell combat action?
   - character known-spell ownership?
   - current `PlayerSpellState[]`?
   - future magic resolver command output?
   - all of the above under explicit policy?
2. What exact evidence proves the spell is known and available?
3. Does `compatibilityStatus` block action staging, action resolution, or both?
4. What happens to `partial` spells in legacy combat?
5. What happens to `deferred` spells in legacy combat?
6. What happens to runtime-classified but non-executable hooks?
7. How are multi-effect spells represented?
   - ordered effects?
   - grouped atomic effects?
   - separate target groups?
   - partial failure?
   - result envelope?
8. Who owns non-combat effects such as item generation, movement, map teleport, summons, knowledge events, Chronicle/Renown output, or quest output?
9. Which tests prove catalog presence does not bypass ownership?
10. Which tests prove UI state cannot stage unauthorized spell actions?

## Recommended Future Pass Order

Recommended sequence for future Codex work after the knowledge framework is not blocked:

1. `Legacy Combat Spell Staging Audit`
   - read-only audit of call sites, staged actions, and test coverage
   - no source behavior changes
2. `Legacy Combat Spell Ownership And Compatibility Plan`
   - decision-complete plan for known-spell gating, compatibility gating, and staging vs resolution boundaries
   - no implementation
3. `Legacy Combat Spell Blocker Tests`
   - focused tests proving unowned, blocked, partial, deferred, and multi-effect spells cannot silently stage or resolve as if complete
   - no behavior changes unless tests can be written against existing blockers
4. `Legacy Combat Spell Action Proposal Helper`
   - pure helper that proposes/blockers spell combat actions from explicit ownership/readiness/compatibility inputs
   - no mutation or action queueing
5. `Legacy Combat Spell Staging Integration`
   - narrow integration only after source owners, evidence, target policy, effect ownership, and event output are explicit

## Forbidden Until Explicitly Scoped

Do not perform these in connector prep or an early audit pass:

- runtime spell staging changes
- combat branch reordering
- `spell.shadow.healing.drain` behavior fixes
- compatibility promotion
- known-spell ownership integration
- magic command handler wiring
- target resolution changes
- effect application changes
- item generation
- movement/teleport behavior
- Chronicle/Renown/quest event output
- resource payment or catalyst behavior
- save/account/session schema changes
- UI command dispatch
- content JSON edits
- generated output
- broad combat math cleanup

## Recommended Next Connector Work

The most useful next connector-only prep outside the knowledge pillar is:

- `Family Ownership Boundary Audit`

Rationale: roadmap deferred work still includes Family management, heirs, heirlooms, bequests, Family Prestige earning/spending, estate transfer/claim execution, and scoped Backstory evidence. Those systems need owner/evidence boundaries before runtime behavior.

## Recommended Future Codex Work

Do not schedule this combat pass before the active knowledge-domain sequence unless the user explicitly pivots.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Legacy Combat Spell Staging Audit`

It should be read-only/docs-first and should not change combat runtime behavior.
