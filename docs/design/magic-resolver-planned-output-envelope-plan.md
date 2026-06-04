# Magic Resolver Planned Output Envelope Plan

Date: 2026-06-04
Source version/run: Version 0.5.101 - Magic Resolver Planned Output Envelope Plan
Status: planning-only source for a future inert resolver output envelope helper

## Purpose

Define the inert planned-output-envelope boundary for future magic cast resolver work after `Version 0.5.100 - Runtime Cast Resolver Readiness Helper`.

This plan does not implement runtime casting, emitted events, runtime dispatch, spell effects, target resolution, resource payment, catalyst consumption or reservation, inventory mutation, combat action creation, save/account/session mutation, Chronicle or quest event creation, command registration, React UI wiring, schema migration, generated output, or knowledge/skill-trial/magic-study runtime behavior.

## Current Foundation

Current safe magic foundation:

- Known-spell ownership remains character-scoped and explicit.
- `training_event` remains the only supported acquisition route.
- `buildKnownSpellReadOnlyProjection(...)` is pure/read-only.
- `buildMagicCastReadiness(...)` is pure/read-only and returns readiness blockers.
- `buildMagicCastResolverReadiness(...)` is pure/read-only and validates explicit command-like resolver input before delegating to cast readiness.
- `docs/design/magic-command-contract-plan.md` owns the future `magic.cast` command/intention shape.
- `docs/design/first-narrow-runtime-cast-resolver-plan.md` owns the first narrow resolver-readiness boundary and remains active for later resolver work.

The planned output envelope described here is a pure explanation/projection of what a future resolver might do. It is not an emitted runtime event, not a mutating command result, and not a persisted combat, Chronicle, quest, account, save, or UI record.

## Envelope Boundary

A planned output envelope may exist only as inert result data returned by a future pure helper. It may explain the resolver's selected inputs, readiness status, blockers, deferred policies, and diagnostics.

Allowed inert fields:

| Field | Meaning |
| --- | --- |
| `resolverRequestId` | Caller-supplied resolver request id or deterministic helper fallback. |
| `commandId` | Optional id of the explicit command/intention being inspected. |
| `spellId` | Selected spell id from the explicit command. |
| `casterCharacterId` | Explicit caster character id from the command. |
| `knownSpellId` | Explicit known-spell id or record id used for ownership/readiness checks. |
| `targetDescriptor` | Structural target descriptor copied from command input. |
| `conduitDescriptor` | Structural conduit source descriptor copied from command input. |
| `catalystDescriptor` | Structural catalyst source descriptor copied from command input. |
| `readinessSummary` | Compact copy of the pure readiness result, such as `ready`, selected known-spell id, and compatibility facts. |
| `blockerSummary` | Ordered blocker ids and resolver issue codes already returned by readiness/resolver validation. |
| `deferredEffectFamilies` | Named effect families that remain deliberately unimplemented. |
| `plannedCostSummary` | Cost policy references or deferred-cost notes only. |
| `plannedCatalystSummary` | Catalyst source and policy references or deferred-catalyst notes only. |
| `plannedFailurePolicySummary` | Failure/control policy references or deferred-failure notes only. |
| `plannedHookSummary` | Supported, deferred, or unknown hook classification summary. |
| `plannedNarrativeSummary` | Optional inert text for debug/readiness explanation only. |
| `safetyFlags` | Boolean or id flags such as `noEvents`, `noMutation`, `targetResolutionDeferred`, and `effectResolutionDeferred`. |
| `diagnostics` | Deterministic helper diagnostics for tests and tooling. |

These fields must be copied, summarized, or derived from explicit caller inputs and existing pure helper results. They must not trigger lookup, mutation, event routing, effect execution, or inventory/resource behavior.

## Deferred Envelope Fields

The following data must remain absent, null, or explicitly deferred until owner systems exist:

- resolved target entity/state
- target existence result
- range, line-of-sight, area membership, hostility, or faction result
- applied damage/healing/status payload
- generated item placement
- paid MP/stamina/strain/health/backlash cost
- consumed, reserved, split, transformed, equipped, or moved catalyst/item state
- cooldown/action economy mutation
- combat event ids
- Chronicle event ids
- quest event ids
- account/session/save mutation ids
- persisted acquisition event ids
- random failure roll outcomes
- backlash, miscast, collateral, or recovery effects
- UI notification/action ids

If a future helper needs to mention one of these topics, it should use a `deferred...` summary or safety flag, not an effect-bearing field.

## Planned Output Is Not An Event

Planned output differs from emitted runtime events:

| Planned Output Envelope | Emitted Runtime Event |
| --- | --- |
| Returned only from a pure helper. | Routed through an event owner/dispatcher. |
| Explains or projects possible resolver intent. | Records something that happened. |
| Has no side effects. | May drive combat, Chronicle, quest, save, UI, or account state. |
| May include deferred policy notes. | Must have an owner and persistence/routing policy. |
| Safe for focused tests and docs. | Requires runtime/event integration tests. |

No planned envelope id should be treated as a combat, Chronicle, quest, account, save, UI, or telemetry event id.

## Representation Policy

### Selected Spell

Represent only `spellId`, optional compatibility status, hook summary, and effect-family labels derived from current spell catalog metadata. Do not execute spell hooks or infer readiness from catalog presence alone.

### Caster

Represent only explicit `casterCharacterId` and readiness/projection facts from caller-supplied known-spell records. Do not infer caster identity from selected UI state, account id, family id, lineage, backstory, source run id, Legacy data, or `PlayerSpellState[]`.

### Target Descriptor

Copy the structural target descriptor from the command. Do not resolve target existence, location, faction, range, line-of-sight, area membership, or recipient validity.

### Conduit Source

Copy or summarize the explicit conduit source descriptor and any readiness metadata result. Do not search equipment/inventory, prove ownership, equip/unequip, apply conduit modifiers, or mutate item state.

### Catalyst Source

Copy or summarize the explicit catalyst source descriptor and any readiness metadata result. Do not consume, reserve, split, transform, move, or otherwise mutate catalysts.

### Resource Policy

Represent only resource policy refs, missing-policy blockers, or deferred resource-payment notes. Do not pay MP, stamina, strain, health, backlash, cooldown, or action economy costs.

### Failure Policy

Represent only failure policy refs, missing-policy blockers, control-readiness results, or deferred failure notes. Do not roll failure, apply miscast/backlash/collateral effects, or mutate recovery state.

### Hook Support

Summarize hook classification from explicit hook-support context and readiness details. Runtime-consumed and classifier hooks may be listed as support facts; deferred or unknown hooks must stay blockers or deferred effect families.

### Deferred Effect Families

Use stable labels such as `damage`, `healing`, `status`, `buff`, `debuff`, `movement`, `summon`, `generated_item`, `resource_restore`, `terrain_field`, or `narrative_utility` only as inert categories. The labels must not become generic tag-driven execution.

### Runtime Blockers

Preserve current readiness and resolver blocker vocabulary, including:

- `missing_known_spell`
- `known_spell_blocked`
- `invalid_known_spell_record`
- `missing_training_event_evidence`
- `missing_conduit`
- `invalid_conduit`
- `missing_catalyst`
- `invalid_catalyst`
- `insufficient_control`
- `unsupported_spell_hooks`
- `spell_runtime_deferred`
- `runtime_casting_not_implemented`
- `cast_readiness_blocked`
- `resource_policy_missing`
- `catalyst_policy_missing`
- `failure_policy_missing`
- `effect_resolution_deferred`

Do not invent success-only envelopes that hide blockers.

## Future Pure Helper Lane

A future `Version 0.5.102 - Magic Resolver Inert Envelope Helper` may add a pure helper only if it remains inert.

Allowed future helper scope:

- Accept a `MagicCastResolverReadinessResult` and the same explicit command-like input already used by `buildMagicCastResolverReadiness(...)`.
- Return deterministic planned output envelope objects.
- Preserve `resolverRequestId`, `commandId`, `spellId`, `casterCharacterId`, known-spell reference, target/conduit/catalyst descriptors, readiness summary, blocker summary, deferred effect families, policy summaries, safety flags, and diagnostics.
- Add focused tests for no mutation, deterministic ordering, blocker summaries, deferred-field behavior, and no emitted-event fields.
- Export only pure types/functions if implemented.

Forbidden future helper behavior:

- event emission
- save mutation
- inventory mutation
- resource payment
- catalyst consumption or reservation
- target resolution
- effect application
- damage, healing, or status application
- cooldown/action economy application
- combat action creation
- Chronicle event creation
- quest event creation
- account/session mutation
- React UI wiring
- command registration
- runtime dispatch
- broad schema migration
- generated output

## Relationship To Advancement Roadmap

Skill Mastery Trials, Magic Study Events, and Knowledge Discovery are planned advancement lanes. They should remain separate from resolver output envelopes.

This plan must not entangle magic resolver output with:

- skill trial checkpoint runtime behavior
- magic study event runtime behavior
- knowledge snippet discovery or completion behavior
- scroll/tome/book/teacher/institution study implementation
- Chronicle/Renown output creation

Future Chronicle or Renown hooks for magic casting should wait until event-owner boundaries exist. Future magic study and knowledge systems may provide acquisition evidence or context only after their own owner systems and validation helpers exist.

## Temporary Guardrail Status

- `docs/design/first-narrow-runtime-cast-resolver-plan.md` remains active after this run as the boundary source for resolver-readiness and later first narrow runtime resolver planning.
- `docs/design/magic-resolver-planned-output-envelope-plan.md` becomes the active source for a future pure inert envelope helper or the next resolver planning pass.
- Do not delete planning docs in this run.

## Deferred Work

Deferred after `0.5.101`:

- pure inert envelope helper implementation
- active runtime cast resolver implementation
- runtime casting
- command handlers and command registration
- UI command dispatch and React surfaces
- emitted combat/Chronicle/quest/account/save/UI events
- target existence, range, line-of-sight, area, hostility, and recipient resolution
- spell effect application
- resource payment
- catalyst consumption/reservation
- inventory mutation
- control failure, backlash, miscast, collateral, cooldown, and action economy behavior
- acquisition event mutation
- scroll/tome/document/teacher/institution/family/Legacy acquisition routes
- knowledge snippet runtime behavior
- skill trial runtime behavior
- magic study event runtime behavior
- broader owner scopes and `PlayerSpellState[]` replacement

Recommended next run:

`Version 0.5.102 - Magic Resolver Inert Envelope Helper`
