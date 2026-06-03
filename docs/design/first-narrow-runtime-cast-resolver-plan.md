# First Narrow Runtime Cast Resolver Plan

Date: 2026-06-03
Source version/run: Version 0.5.99 - First Narrow Runtime Cast Resolver Plan
Status: planning-only source for Version 0.6.0 - Runtime Cast Resolver Readiness Helper

## Purpose

Define the first narrow engine-owned runtime cast resolver boundary before implementation.

This plan prepares a future pure resolver-readiness helper that can consume an explicit validated `magic.cast` command/intention, reuse existing known-spell and cast-readiness helpers, and return deterministic resolver issues without applying spell effects.

This plan does not implement runtime spell casting, command handlers, UI dispatch, save mutation, event creation, resource payment, catalyst consumption or reservation, inventory mutation, target effect resolution, control failure, backlash, broader acquisition routes, broader owner scopes, or `PlayerSpellState[]` replacement.

## 1. Current Foundation

Current known-spell and magic command foundation:

- Known-spell records are character-scoped only.
- The only supported known-spell acquisition route is `training_event`.
- `buildKnownSpellReadOnlyProjection(...)` is pure/read-only.
- `buildMagicCastReadiness(...)` is pure/read-only and returns deterministic blockers.
- `validateKnownSpellTrainingEventAcquisition(...)` and `buildKnownSpellRecordFromTrainingEvent(...)` are pure proposal helpers.
- `docs/design/magic-command-contract-plan.md` defines the future `magic.cast` command/intention contract.
- No persisted acquisition event creator exists.
- No command handler exists.
- No runtime cast resolver exists.
- No UI command dispatch exists.

Current metadata and tests:

- `packages/content/base/player/spells.json` currently contains 55 spells.
- Current spell compatibility statuses are 23 `ready`, 5 `partial`, and 27 `deferred`.
- 28 spells currently have compatibility profiles.
- `packages/content/base/items/items.json` currently contains 7 conduit-profiled items and 3 catalyst-profiled items.
- `tools/content-lint/spell-hook-support.mjs` classifies runtime-consumed, classifier, deferred, and unknown spell hooks; it does not execute effects.
- `tools/content-lint/magic-metadata-support.mjs` validates spell compatibility profiles plus conduit/catalyst metadata; it does not perform runtime casting.
- Focused tests already prove catalog presence, Arcane Compendium visibility, `PlayerSpellState[]`, broader owner scopes/routes, unsupported evidence, missing policy, deferred hooks, and absent runtime casting do not create runtime readiness.

## 2. Resolver Boundary

The future resolver should be an engine-owned pure helper that consumes an explicit validated `magic.cast` command/intention and returns a deterministic resolver result.

Planning-only request shape:

```ts
interface PlannedMagicCastResolverRequest {
  resolverRequestId: string;
  command: PlannedMagicCastCommand;
  knownSpellRecords: unknown;
  spellCatalog: Iterable<KnownSpellCatalogEntry>;
  conduitCandidate?: unknown;
  catalystCandidate?: unknown;
  conduitSourceResolution?: PlannedMagicSourceResolution;
  catalystSourceResolution?: PlannedMagicSourceResolution;
  controlContext?: unknown;
  hookSupport?: MagicCastReadinessHookSupport;
  runtimePolicy: PlannedMagicRuntimePolicy;
  combatContextRef?: string;
  sessionContextRef?: string;
  worldContextRef?: string;
}

interface PlannedMagicSourceResolution {
  sourceDescriptorId?: string;
  sourceKind: "none" | "explicit_candidate" | "resolved_candidate" | "unavailable" | "unknown";
  candidate?: unknown;
  issues?: string[];
}

interface PlannedMagicRuntimePolicy {
  runtimeCastingImplemented?: boolean;
  resourcePolicyRef?: string;
  catalystPolicyRef?: string;
  failurePolicyRef?: string;
  allowPlannedEffectEnvelope?: boolean;
  testOnlyResolverLane?: boolean;
}
```

Planning-only result shape:

```ts
interface PlannedMagicCastResolverResult {
  ok: boolean;
  blocked: boolean;
  resolverRequestId: string;
  commandId?: string;
  readiness?: MagicCastReadinessResult;
  issues: PlannedMagicCastResolverIssue[];
  plannedOutputEnvelopes: PlannedMagicCastOutputEnvelope[];
}
```

Boundary rules:

- The resolver may validate command shape and explicit command descriptors.
- The resolver may call `buildMagicCastReadiness(...)`.
- The resolver may return deterministic issues and deferred output-envelope shapes.
- The resolver must not emit events.
- The resolver must not mutate save, account, session, inventory, combat, known-spell, or acquisition state.
- The resolver must not apply spell effects, pay resources, consume catalysts, reserve catalysts, create acquisition records, create Chronicle records, or dispatch UI commands.

## 3. Required Resolver Gates

The future resolver must gate on all of the following before reporting a ready resolver result:

- valid command shape
- explicit `casterCharacterId`
- explicit `spellId`
- explicit known-spell record/reference
- known-spell projection/readiness
- `buildMagicCastReadiness(...)` readiness result
- explicit target descriptor
- explicit conduit source descriptor
- explicit catalyst source descriptor when catalyst policy requires one
- explicit control context
- explicit hook support context
- runtime casting support flag
- supported spell compatibility status
- supported hooks
- future resource policy
- future catalyst policy
- future failure policy

Until resource, catalyst, and failure owners exist, the resolver should represent them as blockers or deferred policy refs. It should not silently skip them, invent defaults, or treat item ownership as authority.

## 4. First Narrow Implementation Lane

The smallest future implementation lane after this plan should be `Version 0.6.0 - Runtime Cast Resolver Readiness Helper`.

Allowed future helper behavior:

- Add a pure helper that accepts a validated command-like input.
- Validate only the structural command and context facts needed for resolver readiness.
- Call `buildMagicCastReadiness(...)` with explicit known-spell records, spell catalog, conduit/catalyst candidates, control context, hook support, and runtime policy.
- Return deterministic `ok` / `blocked` status.
- Return resolver issues/blockers without applying effects.
- Return no output envelopes by default.
- Optionally return a planned effect-event envelope only when the next prompt explicitly allows a test-only resolver lane.
- Keep `runtime_casting_not_implemented` or an equivalent resolver blocker unless the caller opts into a test-only resolver lane.

Forbidden future helper behavior for this lane:

- effectful spell casting
- command handler registration
- UI command dispatch
- save/account/session mutation
- known-spell collection mutation
- acquisition event persistence
- combat, Chronicle, quest, account, save, or UI event creation
- resource payment
- catalyst consumption or reservation
- inventory mutation
- target existence, range, line-of-sight, or area membership checks
- damage, healing, status, generated-item, or other effect application
- control failure rolls, miscast behavior, backlash, collateral behavior, cooldown mutation, or action economy mutation

## 5. Resolver Result Vocabulary

Planned resolver issue/blocker ids:

| Issue | Meaning |
| --- | --- |
| `invalid_magic_command` | The command/intention is not a supported structural object. |
| `missing_caster_character_id` | The command does not include an explicit caster character id. |
| `missing_spell_id` | The command does not include an explicit spell id. |
| `missing_known_spell_reference` | The command does not include an explicit known-spell reference. |
| `invalid_known_spell_reference` | The known-spell reference is malformed or cannot be checked by the current helper boundary. |
| `missing_target_descriptor` | The command does not include the required target descriptor. |
| `invalid_target_descriptor` | The target descriptor is malformed or unsupported by the resolver boundary. |
| `invalid_conduit_source_descriptor` | The conduit source descriptor is malformed or unsupported. |
| `invalid_catalyst_source_descriptor` | The catalyst source descriptor is malformed or unsupported. |
| `invalid_casting_context` | The casting context is missing required structural facts or contains unsupported values. |
| `cast_readiness_blocked` | `buildMagicCastReadiness(...)` returned one or more blockers. |
| `runtime_casting_not_implemented` | Effectful runtime casting is not implemented for this lane. |
| `unsupported_spell_hooks` | The spell uses deferred, unsupported, or unknown hooks. |
| `spell_runtime_deferred` | The spell compatibility status is not supported for resolver readiness. |
| `resource_policy_missing` | A resource cost policy owner/ref is required before readiness can continue. |
| `catalyst_policy_missing` | A catalyst consumption/reservation policy owner/ref is required before readiness can continue. |
| `failure_policy_missing` | A control failure/backlash policy owner/ref is required before readiness can continue. |
| `effect_resolution_deferred` | Effect resolution is intentionally deferred even if structural readiness succeeds. |

The exact exported vocabulary belongs to the future implementation run. This document defines the expected boundary and names to preserve.

## 6. Event / Output Boundary

The future resolver may plan output-event envelopes only as inert result shapes.

Planning-only envelope ids:

- `cast_attempt_planned`
- `cast_blocked`
- `cast_ready`
- `effect_resolution_deferred`
- `catalyst_consumption_deferred`
- `resource_payment_deferred`

These are not emitted events. They must not be routed to combat history, Chronicle, quest logs, account history, save data, UI notifications, or runtime event dispatch by the first narrow resolver helper.

Planning-only envelope shape:

```ts
interface PlannedMagicCastOutputEnvelope {
  envelopeId: string;
  envelopeType:
    | "cast_attempt_planned"
    | "cast_blocked"
    | "cast_ready"
    | "effect_resolution_deferred"
    | "catalyst_consumption_deferred"
    | "resource_payment_deferred";
  commandId?: string;
  spellId?: string;
  casterCharacterId?: string;
  issueIds?: string[];
  notes?: string[];
}
```

## 7. Target / Effect Boundary

Target descriptors remain structural until a later target/effect owner exists.

Allowed in the first narrow resolver lane:

- check that a target descriptor exists when required
- check that the descriptor type belongs to the command contract family
- preserve the descriptor in the deterministic result
- return `invalid_target_descriptor` for malformed or unsupported shapes
- return `effect_resolution_deferred` when structural gates pass but no target/effect owner exists

Forbidden in the first narrow resolver lane:

- target existence lookup
- line-of-sight checks
- range checks
- area membership resolution
- friendly/hostile/valid-recipient resolution
- damage application
- healing application
- status application
- buff/debuff duration application
- generated item placement
- combat event creation
- Chronicle event creation
- quest/account/UI event creation

## 8. Resource / Catalyst / Failure Boundary

Resource, catalyst, and failure policy remain blockers or deferred policy refs until their owner systems exist.

The first narrow resolver helper must not:

- pay MP, stamina, strain, health, or backlash costs
- reserve catalysts
- consume catalysts
- mutate inventory
- mutate equipment
- create item ledger entries
- perform a failure roll
- apply miscast behavior
- apply backlash behavior
- apply collateral behavior
- mutate cooldowns
- mutate action economy

The first narrow resolver helper may:

- require explicit policy refs when the caller says those policies are required
- return `resource_policy_missing`, `catalyst_policy_missing`, or `failure_policy_missing`
- preserve planned deferred envelopes for later owners
- pass explicit conduit/catalyst candidates to `buildMagicCastReadiness(...)` for metadata-only compatibility checks

## 9. Forbidden Inference Rules

The resolver must not infer spell ownership, acquisition, command authority, target authority, conduit authority, catalyst authority, or resource authority from:

- `PlayerSpellState[]`
- Arcane Compendium visibility
- spell catalog presence
- selected UI state alone
- account id
- family id
- lineage
- backstory
- source run id
- Legacy unlocks
- item ownership without an explicit source descriptor and resolver-owned verification
- document ownership without a dedicated acquisition/source route
- scroll ownership without a dedicated acquisition/source route
- tome ownership without a dedicated acquisition/source route

These inputs may become context only after their own owner systems and validation helpers exist. They are not authority in this plan or in the recommended first narrow helper lane.

## 10. Deferred Work

Deferred after `0.5.99`:

- command handler implementation
- active runtime cast resolver implementation
- effect application
- target resolution
- target existence, range, line-of-sight, and area checks
- resource payment
- catalyst consumption
- catalyst reservation
- inventory mutation
- combat event creation
- Chronicle event creation
- quest event creation
- account event creation
- save event creation
- UI event creation
- UI command dispatch
- save/account/session schema changes
- control/failure/backlash behavior
- cooldown/action economy behavior
- scroll/tome/document teaching
- teacher, institution, quest, family, Legacy, source-run, discovered-record, item, or document acquisition routes
- broader owner scopes
- `PlayerSpellState[]` replacement
- magic skill gain
- Magic Legacy power

## Exact Allowed Scope For Version 0.6.0

`Version 0.6.0 - Runtime Cast Resolver Readiness Helper` may:

- Add pure TypeScript helper types/functions for resolver readiness if explicitly scoped.
- Accept an explicit command-like input based on `docs/design/magic-command-contract-plan.md`.
- Require explicit caster, spell, known-spell reference, target descriptor, source descriptors, control context, hook support context, runtime policy, known-spell records, and spell catalog.
- Reuse `buildMagicCastReadiness(...)`.
- Return deterministic resolver issues/blockers.
- Return an inert result shape and optional inert planned envelopes when explicitly allowed.
- Add focused unit tests for valid structural readiness, missing command fields, blocked cast readiness, missing policies, deferred effects, unsupported hooks, and forbidden inference.
- Export only pure helper types/functions through the game-engine barrel if implemented.
- Update docs and backlog notes.

`0.6.0` must not:

- implement effectful casting
- register or dispatch commands
- wire React UI
- mutate save/account/session/combat/inventory/known-spell state
- persist acquisition events
- pay resources
- consume or reserve catalysts
- create runtime events
- resolve targets or apply effects
- add control/failure/backlash behavior
- add broader acquisition routes or owner scopes
- replace `PlayerSpellState[]`

Recommended next run:

`Version 0.6.0 - Runtime Cast Resolver Readiness Helper`
