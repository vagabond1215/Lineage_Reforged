# Spell Hook Classification Audit

Date: 2026-06-05
Source version/run: Version 0.5.104 - Spell Hook Classification Audit
Status: constants cleanup consumed in Version 0.5.105; temporary guardrail retained for pure hook-support projection

## Purpose

Reconcile the current authored spell hooks with their lint, readiness, combat, and presentation classifications before adding a pure six-class projection helper.

This audit changes no classifications and makes no hook executable. It does not change runtime source, content JSON, schemas, UI, combat behavior, spell compatibility status, command handling, target resolution, resource or catalyst behavior, item generation, emitted events, or mutation.

## Audited Surfaces

- `packages/content/base/player/spells.json`
- `tools/content-lint/spell-hook-support.mjs`
- `tools/content-lint/magic-metadata-support.mjs`
- `tools/content-lint/combat-hook-support.mjs`
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/combat/index.ts`
- `apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts`
- focused spell-hook, compatibility, combat-hook, readiness, resolver-readiness, inert-envelope, and Arcane Compendium tests

## Authored Inventory

Current spell content contains:

- 55 spells
- 23 `ready`, 5 `partial`, and 27 `deferred` compatibility statuses
- 56 unique resolution hook ids
- 1 unique item-generation hook id
- 0 unknown authored hook ids

| Classification | Unique resolution hooks | Authored occurrences | Current meaning |
| --- | ---: | ---: | --- |
| `runtime` | 11 | 32 | Recognized by the existing combat path; not authority for the future magic resolver. |
| `classifier` | 18 | 110 | Metadata only; never generic effect instructions. |
| `deferred` | 27 | 30 | Known but blocked pending an explicit owner and semantics. |
| `unknown` | 0 | 0 | Absent from current authored content. |

The only authored item-generation hook is `generated_item.druidic.berry`. It is explicitly deferred.

All 23 `ready` spells contain only current lint `runtime` or `classifier` hooks. No ready spell depends on a deferred or unknown resolution or item-generation hook.

The five partial spells are:

| Spell id | Runtime hooks | Deferred hooks | Important boundary |
| --- | --- | --- | --- |
| `spell.enfeebling.curse` | none | `debuff.curse` | Classifiers do not supply curse behavior. |
| `spell.shadow.healing.drain` | `heal.hp`, `damage.magic` | none | Multi-effect semantics are not represented safely by the legacy combat branch order. |
| `spell.druidic.berry` | `support.berry` | `generated_item.druidic.berry` | Current combat recognition creates a temporary status; it does not generate an item. |
| `spell.druidic.bloom` | `heal.hp` | `buff.regeneration` | Healing recognition does not implement regeneration. |
| `spell.performance.war_song` | none | `buff.war_song` | Classifiers do not supply song behavior. |

Eight non-ready spells contain at least one runtime-classified hook. Compatibility status remains authoritative: the presence of a runtime hook does not make a partial or deferred spell cast-ready.

## Authority Decision

The current canonical authored spell-hook authority after Version 0.5.105 is:

- `packages/shared/types/src/spell-hook-support.{ts,js}` for explicit resolution-hook and item-generation-hook classification
- `tools/content-lint/magic-metadata-support.mjs` for the rule that a `ready` authored spell may use only current lint `runtime` and `classifier` hooks

The following surfaces are not canonical authored-classification authorities:

- `tools/content-lint/spell-hook-support.mjs` re-exports the shared authority and owns lint validation helpers.
- `tools/content-lint/combat-hook-support.mjs` is the broader combat vocabulary and capability registry.
- `packages/engines/game-engine/src/combat/index.ts` is an existing consumer of some hook ids, not spell classification authority.
- `packages/engines/game-engine/src/known-spells.ts` defines six-class readiness policy vocabulary but receives support data from callers.
- `apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts` is a presentation consumer of the shared classifiers.

The engine-only `supported` and `unsupported` classes remain explicit caller policy overrides. They are not authored spell classes and must not be added to content merely because the readiness type permits them.

No wildcard or namespace inference is allowed. Unknown hook ids remain validation and readiness blockers.

## Intentional Differences

### Spell lint versus combat support

The combat support set is broader than the spell lint runtime set. All 11 current spell lint runtime hooks are present in combat support, so there is no current subset mismatch.

That subset relationship is intentional:

- spell lint answers whether authored spell metadata is classified and compatible
- combat support answers whether the legacy combat vocabulary recognizes a hook id
- combat recognition does not authorize the future magic resolver

### Four authored classes versus six readiness classes

Authored spell classification currently uses `runtime`, `classifier`, `deferred`, and `unknown`.

Engine readiness additionally permits `supported` and `unsupported` through explicit caller input. This is policy vocabulary, not evidence that a canonical registry for those classes exists.

### Presentation classification

The Arcane Compendium consumes the shared browser-safe classifiers and no longer duplicates the four authored-classification lists. Exact source-boundary and full classification parity tests guard this relationship.

The UI does not import the Node-only lint tool.

## Runtime And Readiness Findings

### Legacy combat consumes all runtime-classified spell hooks

The existing combat resolver directly handles:

- `interrupt.primary`
- `heal.hp`
- `damage.magic`
- `damage.ranged`

Its status application path recognizes the remaining current spell runtime hooks:

- `status.bind`
- `status.stagger`
- `buff.protect`
- `buff.ward`
- `buff.anthem`
- `mobility.shadow_step`
- `support.berry`

Recognition is not complete spell semantics:

- `support.berry` applies a temporary combat status and does not execute `generated_item.druidic.berry`
- `mobility.shadow_step` applies a status and does not resolve map or encounter movement
- `status.stagger` uses an ability-sourced status definition when reached through this shared path

### Legacy spell staging bypasses the newer ownership boundary

`buildPlayerHooks(...)` stages actions from `PlayerSpellState[]` catalog entries. It does not require character-scoped known-spell ownership and does not gate staged actions by `compatibilityStatus`.

Deferred hooks with no combat status definition become inert in that path, but coexisting runtime hooks may still execute.

The clearest current hazard is `spell.shadow.healing.drain`. It is partial, enemy-targeted, and carries both `heal.hp` and `damage.magic`. The legacy combat resolver checks healing before damage, so a staged action can take the healing branch against the enemy instead of resolving drain semantics.

This is an existing combat/runtime ownership problem. It must not be fixed inside classification constants cleanup or pure projection work.

### Readiness classification is caller-supplied

`buildMagicCastReadiness(...)` does not import a canonical hook registry. Current precedence is:

1. explicit per-hook classification map
2. runtime set
3. classifier set
4. supported set
5. deferred set
6. unsupported set
7. unknown fallback

Consequences:

- explicit `supported` can override a deferred classification
- explicit `unsupported` can override a runtime classification
- runtime wins if the same hook is also present in a deferred iterable
- an arbitrary unknown hook becomes readiness-supported if a caller places it in `supportedResolutionHooks`
- no collision diagnostic reports contradictory inputs

No production caller outside the engine implementation was located. Current focused tests supply the canonical lint lists, but the helper contract itself permits divergence. Cleanup and projection work must make the future adapter/input boundary explicit without silently changing precedence or readiness behavior.

## Remaining Test Coverage Gap

Version 0.5.105 now proves exact authored inventories, TypeScript/JavaScript shared-entry parity, lint/shared identity, UI source and classification parity, the spell-runtime-to-combat subset, direct `supported` and `unsupported` readiness semantics, and current precedence for contradictory inputs.

The remaining gap is a deterministic full six-class projection with classification authority and blocker detail. Concrete combat handler/status semantics remain a separate runtime ownership concern, not a constants or projection requirement.

## Required Cleanup Boundary

`Version 0.5.105 - Spell Hook Support Constants Cleanup` landed the required boundary.

It:

1. Added `packages/shared/types/src/spell-hook-support.{ts,js}` as the browser-safe authority for the current four authored classes.
2. Kept the broader combat support registry separate.
3. Made spell lint re-export the shared authority and made the Arcane Compendium consume the shared classifiers.
4. Added exact authored inventory, UI source/parity, and combat-subset tests.
5. Added focused readiness tests for `supported`, `unsupported`, explicit-map precedence, and contradictory iterable inputs.
6. Added `AUTHORED_SPELL_HOOK_SUPPORT` as the explicit readiness-shaped adapter used by focused readiness, resolver-readiness, and inert-envelope tests.
7. Preserved current hook ids, classes, compatibility statuses, readiness results, UI output, combat behavior, pure helper boundaries, and all no-execution rules.

The cleanup imports no Node-only tooling into browser code.

The next safe run is `Version 0.5.106 - Pure Hook Support Projection Helper`. It may add deterministic six-class projections from explicit support input. That helper must execute nothing, mutate nothing, and must not reinterpret `runtime` or `supported` as executable.

## Deferred Runtime Follow-Up

The legacy combat spell-staging and multi-effect branch-order findings need a dedicated runtime ownership plan or audit after projection work. That later pass must decide:

- whether legacy `PlayerSpellState[]` spell action grants remain valid
- how known-spell ownership and compatibility status gate combat staging
- how multi-effect spell hooks are represented without order-dependent misexecution
- whether existing status-only approximations remain explicitly legacy behavior

Do not combine that work with constants cleanup, projection, content promotion, or first executable-hook implementation.

## Cleanup Decision

Keep this audit while it directly guides `0.5.106`.

After that run consumes the remaining findings, either remove this temporary guardrail or retain only unresolved legacy combat ownership findings in the current handoff, roadmap, or a dedicated runtime plan. Do not let this file become a second backlog.
