# Spell Hook Support Expansion Plan

Date: 2026-06-05
Source version/run: Version 0.5.103 - Spell Hook Support Expansion Plan
Status: durable hook taxonomy and executable-owner source; classification authority reconciled by Version 0.5.104

## Purpose

Define the spell-hook support boundary after `Version 0.5.102 - Magic Resolver Inert Envelope Helper`.

This plan classifies current hook families, explains how readiness and inert envelopes must represent them, and defines the ownership boundary required before any hook can become effectfully executable.

This is a planning-only pass. It does not make any spell more castable and does not add runtime casting, hook execution, target resolution, emitted events, resource payment, catalyst behavior, state mutation, UI dispatch, content changes, schema changes, or generated output.

## Current Hook Support Reality

Current authored spell metadata:

- `packages/content/base/player/spells.json` contains 55 spells.
- Compatibility statuses are 23 `ready`, 5 `partial`, and 27 `deferred`.
- Authored resolution hooks are all known to `packages/shared/types/src/spell-hook-support.ts` and validated through `tools/content-lint/spell-hook-support.mjs`.
- The only authored item-generation hook id is `generated_item.druidic.berry`, classified as deferred.

Current classification owners:

| Surface | Current responsibility | Important limit |
| --- | --- | --- |
| `packages/shared/types/src/spell-hook-support.{ts,js}` | Canonical browser-safe authored classification for spell resolution hooks and item-generation hook ids. | Exposes only `runtime`, `classifier`, `deferred`, and `unknown`; it executes nothing. |
| `tools/content-lint/spell-hook-support.mjs` | Re-exports the shared authority and owns spell-hook validation helpers. | Validation only; it executes nothing. |
| `tools/content-lint/magic-metadata-support.mjs` | Uses hook classification to reject `ready` spells that depend on deferred or unknown hooks. | Treats only lint `runtime` and `classifier` hooks as ready-compatible. |
| `packages/engines/game-engine/src/known-spells.ts` | Accepts caller-supplied hook support and blocks cast readiness for non-supported classifications. | Supports six classifications, but does not own a canonical hook registry and does not execute hooks. |
| `tools/content-lint/combat-hook-support.mjs` | Defines the broader combat hook vocabulary recognized by current combat content/runtime. | Combat support does not grant authority to the new magic cast resolver. |
| `packages/engines/game-engine/src/combat/index.ts` | Current combat action flow consumes several hook ids for damage, healing, interrupts, and status application. | This is an existing combat path staged from `PlayerSpellState[]`; it is not the planned authoritative known-spell cast resolver. |
| `apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts` | Presents shared hook classifications in the Arcane Compendium. | Presentation remains a consumer, not classification authority. |

The term `runtime-consumed` therefore has a narrow meaning: an existing consumer recognizes the hook identifier. It does not prove known-spell ownership, command authority, target authority, resource authority, effect ownership, or resolver integration.

`Version 0.5.104 - Spell Hook Classification Audit` identified the authority boundary, `Version 0.5.105 - Spell Hook Support Constants Cleanup` moved that authority into the shared browser-safe module, and `Version 0.5.106 - Pure Hook Support Projection Helper` added the deterministic six-class projection. The lint validator, broader combat registry, engine caller policy, and UI presentation are consumers or adjacent capability surfaces, not authored spell authorities.

Current lint runtime-consumed spell hooks:

- `damage.magic`
- `damage.ranged`
- `heal.hp`
- `interrupt.primary`
- `status.bind`
- `status.stagger`
- `buff.protect`
- `buff.ward`
- `buff.anthem`
- `mobility.shadow_step`
- `support.berry`

Current classifier hooks describe school, tradition, discipline, or element. Current deferred hooks cover unowned buffs, debuffs, resource restoration, fields, and utility behavior. Unknown hooks are absent from the explicit lint maps.

## Hook Taxonomy

### Runtime-consumed hooks

Meaning:

- The hook id is recognized by an existing runtime, metadata, readiness, tooling, or combat scaffold.
- Current readiness may treat it as supported for classification.
- Existing combat recognition does not automatically authorize the future magic resolver to execute it.

Required treatment:

- Content lint may allow it on `ready` spell metadata.
- `buildMagicCastReadiness(...)` may treat it as readiness-supported when the caller supplies the current support set.
- Inert envelopes may report it as runtime-consumed, but must retain all no-effect safety flags.
- Promotion into the new resolver still requires an explicit effect owner and integration plan.

### Classifier hooks

Meaning:

- The hook classifies spell identity, family, delivery context, or content-readiness.
- Examples include `school.elemental`, `tradition.druidic`, and `element.fire`.
- It is metadata, not an effect instruction.

Required treatment:

- Content lint may allow it on `ready` spells.
- Readiness may treat it as supported because it creates no effect.
- Runtime resolvers may use it only for selection, validation, routing, diagnostics, or policy lookup.
- It must never be promoted into generic tag-driven effect execution.

### Supported hooks

Meaning:

- The engine readiness type permits callers to explicitly classify a hook as `supported`.
- This means the hook is safe for the current readiness lane, even if it is not one of the canonical lint runtime/classifier ids.
- Supported does not mean executable.

Current limitation:

- The shared authored authority has no canonical `supported` list.
- `tools/content-lint/magic-metadata-support.mjs` cannot currently promote a spell to `ready` based on this engine-only class.
- A future audit must decide whether `supported` remains caller-local, becomes a canonical class, or is removed in favor of more precise classes.

### Deferred hooks

Meaning:

- The hook id is intentionally recognized, but its runtime behavior is blocked.
- The missing work is known and should be named by an owner or prerequisite.

Required treatment:

- Content lint accepts explicit deferred ids so authored content can remain valid.
- `ready` spells must not depend on deferred hooks under current lint policy.
- Readiness must return `unsupported_spell_hooks`.
- Inert envelopes should report the hook and its deferred owner/family without executing it.

### Unsupported hooks

Meaning:

- The hook is explicitly rejected for the current lane.
- Unlike deferred, it is not merely waiting on a known implementation sequence; it is disallowed by policy, shape, ownership, or safety.

Current limitation:

- The engine readiness type accepts explicit `unsupported` classifications.
- The canonical lint classifier has no unsupported list today.
- Future classification work must record the reason and avoid silently treating unsupported hooks as unknown or deferred.

### Unknown hooks

Meaning:

- The hook id is absent from current support maps.
- No owner, semantics, or safe behavior may be inferred from its namespace.

Required treatment:

- Content lint must reject newly authored unknown hooks.
- Readiness must block them.
- Inert envelopes may report them only as unknown blockers.
- Wildcard namespace support is forbidden.

## Current Readiness Behavior

`buildMagicCastReadiness(...)` currently receives hook support from its caller. It does not import the lint registry.

Classification precedence is:

1. Explicit per-hook map.
2. Runtime-consumed set.
3. Classifier set.
4. Supported set.
5. Deferred set.
6. Unsupported set.
7. Unknown fallback.

Readiness-supported classes:

- `runtime`
- `classifier`
- `supported`

Readiness-blocking classes:

- `deferred`
- `unsupported`
- `unknown`

Additional current behavior:

- If no hook-support context is supplied, authored hooks fall through to `unknown` and block readiness.
- All blocking resolution and item-generation ids are collapsed into the `unsupported_spell_hooks` blocker.
- `compatibilityStatus: "ready"` is independently required.
- `runtimeCastingImplemented: true` can remove the structural readiness blocker in tests or future callers, but it does not execute effects.
- `buildMagicCastResolverReadiness(...)` delegates to `buildMagicCastReadiness(...)` and translates hook blockers into resolver issues.

Future readiness improvements should remain pure and should expose classification details without weakening the blocker rules.

## Inert Envelope Behavior

`buildMagicResolverInertEnvelope(...)` currently:

- copies explicit command and descriptor fields
- summarizes readiness blocker ids and resolver issue codes
- copies unsupported resolution and item-generation ids from readiness details
- accepts caller-provided `plannedHookSummary`
- accepts caller-provided `deferredEffectFamilies`
- preserves fixed no-event, no-mutation, no-target-resolution, and no-effect safety flags

It does not currently calculate a full six-class hook projection.

A future pure hook-support projection may provide:

- hook id
- hook source field
- classification
- classification authority
- effect family
- current readiness effect
- owner status
- executable status
- blocker reason

The inert envelope may copy that projection into `plannedHookSummary`. It must not reinterpret `runtime-consumed` or `supported` as executed, emitted, applied, paid, consumed, persisted, or dispatched.

## Executable Hook Promotion Criteria

No hook may become effectfully executable until all of these exist:

1. Explicit canonical classification with no wildcard inference.
2. Defined semantics for input, output, stacking, duration, failure, and edge cases.
3. A named runtime owner for validation and mutation.
4. Explicit target authority and target-resolution rules.
5. Explicit resource, catalyst, inventory, and action-cost policy where applicable.
6. A pure deterministic proposal or resolution helper.
7. A separate approved mutation boundary.
8. Runtime event ownership, routing, idempotency, and persistence policy where events are required.
9. Focused tests for allowed behavior, blocked behavior, determinism, and no-inference rules.
10. Resolver integration limited to the approved hook family.
11. Confirmation that UI only consumes authoritative runtime output.

Promotion changes must be narrow. A hook may be readiness-supported while still having `executable: false`.

## Runtime Owner Requirements

| Hook family | Required owner before execution |
| --- | --- |
| Damage | Combat effect owner; target authority; damage channel and scaling; mitigation/resistance/critical policy; defeat handling; combat event output. |
| Healing | Combat/resource owner; valid recipient rules; healing scaling; caps and overheal policy; defeat/revival boundary; combat event output. |
| Status, buff, debuff, interrupt | Status registry and lifecycle owner; duration, magnitude, stacking, replacement, resistance, dispel, expiry, and interrupt policy. |
| Item generation | Item definition and item-instance owner; inventory/container placement; quantity/charge/lifecycle rules; party limits; cleanup; item ledger/event output. |
| Movement and position | Encounter/map position owner; source and destination authority; range, pathing, collision, occupancy, line-of-sight, and failure policy. |
| Summoning | Entity/spawn owner; template authority; placement; allegiance; control; caps; duration; despawn; save/session behavior. |
| Resource changes | Owning HP/MP/stamina/strain or other resource ledger; bounds; payment versus restoration; atomicity; failure behavior; event output. |
| Environment and world changes | Encounter/world-state owner; location scope; field/terrain/weather semantics; tick lifecycle; stacking; persistence; cleanup. |
| Chronicle and Renown | Chronicle event owner and scoped Renown owner; confirmed outcome input; region/faction/family/account scope; duplicate prevention; projection and persistence. |
| Quest events | Quest/event owner; stable source event id; objective/branch authority; duplicate prevention; persistence and notification policy. |
| Knowledge, skill, and magic study | Dedicated progression owner; explicit evidence; completion/trial rules; acquisition boundary; no automatic skill gain, knowledge completion, or known-spell ownership. |

Chronicle, Renown, quest, study, and knowledge outputs must not be implemented as generic spell side effects. They consume confirmed authoritative outcomes through their own owner boundaries.

## Content Authoring Rules

Future content authors must:

1. Reuse an existing hook only when its documented semantics match exactly.
2. Add a new hook to the canonical classification source before using it in content.
3. Choose a deliberate authored class: classifier, runtime-consumed, or deferred. Unknown remains a validation failure.
4. Record the intended effect family and future owner for deferred hooks.
5. Add focused classification and content-lint tests.
6. Keep `compatibilityStatus: "ready"` limited to hooks accepted by current lint policy.
7. Keep item-generation hooks deferred until an item-instance/inventory owner exists.
8. Avoid wildcard namespaces and namespace-based automatic execution.
9. Avoid duplicating classification constants in UI or unrelated runtime modules.

Unknown authored hooks remain validation errors. A new hook must not be added directly to spell JSON and classified later.

The engine-only `supported` and `unsupported` classes remain explicit caller policy overrides unless a later dedicated design pass promotes them into canonical authored classes.

## Future Implementation Sequence

1. Spell Hook Classification Audit - landed in Version 0.5.104
   - Compare spell lint, magic metadata lint, combat hook support, engine readiness classes, UI copies, and authored spell hooks.
   - Decide the canonical authority and document intentional differences.
2. Hook Support Constants Cleanup - landed in Version 0.5.105
   - Consolidate or explicitly separate canonical spell classification from combat and presentation registries.
   - Avoid importing Node-only lint modules into browser/runtime code.
3. Pure Hook Support Projection Helper - landed in Version 0.5.106
   - Returns deterministic six-class projections and blockers from explicit inputs.
   - Executes nothing, mutates nothing, and reports every projected hook as non-executable.
4. First Executable Hook Owner Plan
   - Select one family based on complete ownership and low blast radius, not merely because combat already recognizes its id.
   - Do not default to damage/combat if a safer narrow owner boundary exists.
5. First Narrow Executable Hook Helper
   - Add a pure proposal/resolution helper for one approved family.
6. Resolver Integration For One Hook Family
   - Integrate only the approved family behind explicit runtime policy.
7. Runtime Event Owner Integration
   - Add emitted events and mutation only after event ownership is explicit.
8. UI, Chronicle, Renown, Quest, And Progression Integration
   - Consume authoritative outcomes later through their own owners.

## Forbidden Until Explicitly Scoped

Preserved deferrals:

- active casting remains deferred
- hook execution remains deferred
- target resolution remains deferred
- emitted runtime events remain deferred
- effect owners and effect mutation remain deferred
- Chronicle and Renown hooks remain deferred
- quest event outputs remain deferred
- skill trial, magic study, and knowledge snippet runtime behavior remain deferred

- active casting
- generic hook execution
- target resolution
- emitted runtime events
- damage, healing, status, movement, summoning, item-generation, or resource mutation
- catalyst reservation or consumption
- resource payment
- inventory mutation
- command handlers or UI command dispatch
- React changes
- save/account/session schema changes
- Chronicle or Renown event creation
- quest event creation
- knowledge snippet runtime behavior
- skill trial runtime behavior
- magic study runtime behavior
- spell acquisition from teachers, institutions, scrolls, tomes, books, or documents
- magic skill gain or Magic Legacy power

## Validation Notes

This planning pass should validate:

- current content lint remains clean
- focused magic readiness and inert-envelope tests remain clean
- touched docs contain no merge-conflict markers
- `git diff --check` remains clean

No broad workspace typecheck is required because this run changes documentation only.

## Relationship To Existing Plans

- This document remains the durable source for hook taxonomy, executable promotion, and hook-owner planning.
- The temporary spell-hook classification audit was consumed and removed in Version 0.5.106.
- `docs/design/legacy-combat-spell-runtime-ownership-plan.md` now owns the promoted legacy combat staging, multi-effect, compatibility, and status-approximation findings.
- `docs/design/magic-resolver-planned-output-envelope-plan.md` remains active for inert envelope constraints.
- `docs/design/first-narrow-runtime-cast-resolver-plan.md` remains active for resolver-readiness and first narrow runtime resolver constraints.
- `docs/design/magic-runtime-boundary-plan.md` remains the historical cast-readiness boundary source.
- `docs/design/skill-mastery-trial-framework-plan.md` remains the source for skill-trial and magic-study constraints.
- `docs/design/future-system-design-ledger.md` remains the durable owner/evidence vocabulary source.

No planning documents should be deleted in this run.
