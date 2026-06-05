# Legacy Combat Spell Runtime Ownership Plan

Date: 2026-06-05
Source version/run: Version 0.5.106 - Pure Hook Support Projection Helper
Status: deferred planning source; no runtime implementation permission

## Purpose

Preserve the unresolved legacy combat findings promoted from the consumed spell-hook classification audit without keeping that audit as a second backlog.

This plan does not authorize combat changes, spell execution, known-spell integration, target resolution, effect application, events, mutation, content changes, schema changes, or UI work.

## Current Findings

### Spell staging bypasses known-spell ownership

`buildPlayerHooks(...)` stages combat actions from `PlayerSpellState[]` catalog entries. It does not require character-scoped known-spell ownership and does not gate staged actions by authored `compatibilityStatus`.

Future work must decide whether this legacy grant path remains valid. It must not infer ownership from catalog presence, Arcane Compendium visibility, account or family state, institutions, documents, items, Legacy data, lineage, backstory, or UI selection.

### Multi-effect spells are branch-order sensitive

The legacy combat resolver checks healing before damage. `spell.shadow.healing.drain` is partial, enemy-targeted, and carries both `heal.hp` and `damage.magic`, so the staged action can take the healing branch against the enemy instead of resolving explicit drain semantics.

A future owner must define ordered or grouped multi-effect semantics before this spell can be executed safely. Reordering current branches without that contract is not sufficient.

### Runtime recognition is not complete spell semantics

Current recognition includes status-like approximations:

- `support.berry` applies a temporary combat status; it does not execute `generated_item.druidic.berry`.
- `mobility.shadow_step` applies a status; it does not resolve encounter or map movement.
- `status.stagger` uses the shared status-definition path when reached from spell staging.

Combat recognition is not authority for the future magic resolver, item generation, movement, ownership, or compatibility promotion.

## Required Ownership Decisions

Before changing legacy spell staging, a dedicated implementation plan must decide:

1. Whether combat spell actions require a valid available `KnownSpellRecordState`.
2. Whether `compatibilityStatus` blocks staging, resolution, or both.
3. How resolver-owned command intent reaches combat without UI-authored authority.
4. How multi-effect spells represent target, order, atomicity, partial failure, and result output.
5. Which status approximations remain supported legacy behavior and which become explicit blockers.
6. How item generation, movement, resource changes, and other non-combat effects route to their actual owners.
7. Which tests prove that catalog visibility and `PlayerSpellState[]` do not bypass ownership or compatibility.

## Safe Future Sequence

1. Read-only audit of current spell staging call sites and combat action creation.
2. Decision-complete ownership and compatibility-gating plan.
3. Focused blocker tests for unowned, blocked, partial, deferred, and multi-effect spells.
4. Pure action-proposal or translation helper, if the owner boundary is approved.
5. Narrow integration only after target, effect, event, and mutation owners are explicit.

Do not combine this work with combat math changes, hook classification changes, content promotion, executable-hook implementation, generated output, or broad UI rewrites.

## Relationship To Hook Support

- `packages/shared/types/src/spell-hook-support.ts` remains the authored hook-classification authority.
- `buildMagicHookSupportProjection(...)` reports classification and readiness policy only; every projected hook remains `executable: false`.
- `docs/design/spell-hook-support-expansion-plan.md` remains the durable taxonomy and executable-promotion source.
- This document owns only the deferred legacy combat staging, multi-effect, compatibility, and approximation decisions above.

