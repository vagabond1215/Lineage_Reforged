# Magic Command Contract Plan

Date: 2026-06-03
Source version/run: Version 0.5.98 - Magic Command Contract
Status: planning-only contract boundary for future active magic command work

## Purpose

Define the command/intention shape for future active spell casting before any resolver behavior is implemented.

This plan does not implement runtime casting, command handlers, React UI, command dispatch, save mutation, combat events, Chronicle events, quest events, catalyst consumption, resource payment, active spell effects, target effect resolution, control failure, backlash, acquisition events, broader acquisition routes, broader owner scopes, or `PlayerSpellState[]` replacement.

The next safe runtime step should use this document to plan or implement a narrow engine-owned resolver boundary. Until that scoped run exists, active casting remains absent.

## Current Foundation

Current magic ownership and readiness foundation:

- Known-spell records are character-scoped only.
- The only supported known-spell acquisition route is `training_event`.
- `buildKnownSpellReadOnlyProjection(...)` is pure and read-only.
- `buildMagicCastReadiness(...)` is pure and read-only.
- `validateKnownSpellTrainingEventAcquisition(...)` is a pure proposal helper.
- `buildKnownSpellRecordFromTrainingEvent(...)` is a pure proposal helper.
- No persisted acquisition event creator exists.
- No runtime cast resolver exists.
- No UI command wiring exists.

Current live helper boundaries:

- Known-spell ownership comes only from explicit `KnownSpellRecordState` records for the current character.
- Training-event acquisition helpers may propose records but do not commit them.
- Cast readiness may report blockers but does not execute effects.
- `runtime_casting_not_implemented` remains the default readiness blocker unless the caller explicitly supplies runtime support.
- Spell catalog records, Arcane Compendium entries, `PlayerSpellState[]`, Legacy data, family data, account data, selected UI state, and item/document/scroll/tome ownership do not create casting authority.

Current metadata context:

- `packages/content/base/player/spells.json` has 55 authored spells: 23 `ready`, 5 `partial`, and 27 `deferred`.
- 28 spells currently have compatibility profiles.
- `packages/content/base/items/items.json` has 7 conduit-profiled item records and 3 catalyst-profiled item records.
- Spell hook classification and magic metadata validation are lint/test support; they are not effect execution.

## Command / Intention Boundary

A future magic command should be an intention to attempt a cast, not the cast result.

Planning-only shape:

```ts
interface PlannedMagicCastCommand {
  commandId: string;
  commandType: "magic.cast";
  casterCharacterId: string;
  spellId: string;
  knownSpellRef: PlannedKnownSpellCommandRef;
  target: PlannedMagicTargetDescriptor;
  conduitSource: PlannedMagicItemSourceDescriptor;
  catalystSource: PlannedMagicItemSourceDescriptor;
  castingContext: PlannedMagicCastingContext;
  requestedAt: string;
  issuedAt?: string;
  requestSource?: PlannedMagicCommandRequestSource;
}
```

Shape rules:

- `commandId` identifies the command/intention, not an effect event.
- `commandType` must be exactly `"magic.cast"` for this lane.
- `casterCharacterId` must be explicit and must not be inferred from selected UI state.
- `spellId` must be explicit and must reference the caller-owned current spell catalog.
- `knownSpellRef` must point at an explicit known-spell record or known-spell id for the caster.
- `target` must be explicit even for self, none, or untargeted spells.
- `conduitSource` must be explicit even when no conduit is supplied.
- `catalystSource` must be explicit even when no catalyst is supplied.
- `castingContext` must carry the deterministic readiness context the validator/resolver needs.
- `requestedAt` and `issuedAt` are caller-supplied timestamps and must not be generated inside a pure validator.
- `requestSource` is optional metadata only and must not grant authority.

Recommended known-spell reference shape:

```ts
type PlannedKnownSpellCommandRef =
  | { refType: "known_spell_id"; knownSpellId: string }
  | { refType: "known_spell_record"; record: KnownSpellRecordState };
```

Policy:

- A future validator may accept a full record when the caller already has one.
- A future validator may accept a `knownSpellId` only when it can check the caller-supplied known-spell collection.
- A future validator must not search account, family, Legacy, UI, item, document, scroll, tome, or catalog state to invent a known-spell reference.

Optional request-source metadata:

```ts
interface PlannedMagicCommandRequestSource {
  sourceType: "ui" | "simulation" | "test" | "tool" | "system";
  sourceId?: string;
  clientRequestId?: string;
  actorId?: string;
}
```

Request-source metadata is observational only. It must not bypass known-spell ownership, readiness blockers, target validation, conduit/catalyst validation, or runtime support checks.

## Required Ownership And Readiness References

A future command contract must require explicit references for:

- caster character id
- selected spell id
- explicit known-spell record or `knownSpellId`
- explicit target descriptor
- explicit conduit source descriptor when conduit policy requires a source
- explicit catalyst source descriptor when catalyst policy requires a source
- explicit control/casting context
- caller-owned current spell catalog/readiness context

The command contract must not rely on:

- selected character UI state
- active spell UI state
- UI slot ids without backing command fields
- catalog presence alone
- Arcane Compendium visibility
- `PlayerSpellState[]`
- account/family/Legacy/source-run/backstory/lineage shortcuts
- item ownership without an explicit source descriptor

Readiness relationship:

- A future command validator may call `buildMagicCastReadiness(...)`.
- That call is only a readiness gate.
- The readiness result must not be treated as effect execution.
- `ready: true` authorizes only the next resolver stage to consider execution.
- `ready: false` must return deterministic blockers and stop before mutation.

## Target Descriptor Policy

Target descriptors should describe the intended target structure. They must not resolve effects.

Planning-only target descriptor family:

```ts
type PlannedMagicTargetDescriptor =
  | { targetType: "none" }
  | { targetType: "self"; characterId: string }
  | { targetType: "character"; characterId: string }
  | { targetType: "entity"; entityId: string }
  | { targetType: "location"; locationId: string }
  | { targetType: "point"; point: { x: number; y: number; z?: number }; mapId?: string }
  | { targetType: "item"; itemId?: string; itemInstanceId?: string }
  | { targetType: "area"; origin: PlannedMagicAreaOrigin; radius?: number; areaShape?: "circle" | "cone" | "line" };
```

```ts
type PlannedMagicAreaOrigin =
  | { originType: "self" }
  | { originType: "character"; characterId: string }
  | { originType: "entity"; entityId: string }
  | { originType: "location"; locationId: string }
  | { originType: "point"; point: { x: number; y: number; z?: number }; mapId?: string };
```

Validation questions for a future pure command validator:

- Is `targetType` supported?
- Does `self` target the same explicit caster character?
- Does a character/entity target have a stable id?
- Does a location target have a stable location id?
- Does a point target have finite numeric coordinates and optional map context?
- Does an item target include at least one explicit item id or item-instance id?
- Does an area target include a valid origin and structurally valid radius/shape?
- Does the target shape match the spell's broad delivery metadata closely enough to continue to readiness/resolver checks?

Deferred target behavior:

- target existence lookup
- line-of-sight checks
- range checks
- faction/hostility checks
- friendly fire policy
- area membership resolution
- damage/healing/status/effect routing
- generated item placement
- collision or pathing behavior

## Conduit And Catalyst Source Descriptors

Conduit and catalyst descriptors identify caller-supplied sources. They must not search inventory, mutate inventory, reserve items, or consume items.

Planning-only source descriptor family:

```ts
type PlannedMagicItemSourceDescriptor =
  | { sourceType: "none" }
  | { sourceType: "equipped_item"; itemInstanceId: string; slotId?: string }
  | { sourceType: "held_item"; itemInstanceId: string; hand?: "left" | "right" | "both" }
  | { sourceType: "inventory_item"; itemInstanceId: string; containerId?: string }
  | { sourceType: "supplied_candidate"; itemId?: string; itemInstanceId?: string; itemRecord: unknown }
  | { sourceType: "unavailable"; reason?: string }
  | { sourceType: "unknown"; reason?: string };
```

Descriptor rules:

- `none` is an explicit statement that no source is supplied.
- `equipped_item`, `held_item`, and `inventory_item` are references only; they do not prove ownership unless a later resolver verifies state.
- `supplied_candidate` is allowed for pure readiness validation when the caller already supplies an item candidate.
- `unavailable` and `unknown` should block later resolver readiness when the spell requires that source.
- A descriptor must never cause the validator to search inventory.
- A descriptor must never consume, reserve, split, transform, equip, unequip, or move an item.

Conduit policy:

- A future validator may pass a caller-supplied conduit candidate to `buildMagicCastReadiness(...)`.
- A future resolver must still own any actual equip/held/inventory verification.
- Missing or invalid conduit descriptors must map to deterministic command issues or readiness blockers.

Catalyst policy:

- A future validator may pass a caller-supplied catalyst candidate to `buildMagicCastReadiness(...)`.
- Catalyst source descriptors are presence and compatibility references only.
- Catalyst consumption remains deferred until a dedicated inventory/resource mutation owner exists.

## Casting Context

Casting context should carry deterministic facts needed for command validation and readiness checks.

Planning-only context shape:

```ts
interface PlannedMagicCastingContext {
  contextType: "combat" | "noncombat";
  encounterId?: string;
  locationId?: string;
  worldContextId?: string;
  controlContext: unknown;
  hookSupport?: MagicCastReadinessHookSupport;
  runtimeCastingImplemented?: boolean;
  requireConduit?: boolean;
  requireCatalyst?: boolean;
  resourcePolicyRef?: string;
  failurePolicyRef?: string;
  readinessContextId?: string;
}
```

Allowed context use:

- distinguish combat from noncombat context structurally
- provide stable context ids when later systems own them
- pass control context into `buildMagicCastReadiness(...)`
- pass hook-support context into `buildMagicCastReadiness(...)`
- pass explicit readiness flags such as `runtimeCastingImplemented`
- reference resource and failure policies by id only

Forbidden context use:

- pay MP, stamina, strain, health, or backlash costs
- roll failure
- apply control failure or backlash behavior
- create combat, Chronicle, quest, account, save, or UI events
- update cooldowns, action economy, inventory, known spells, or session state
- repair missing ownership or missing acquisition evidence

Resource and failure policy refs are references only. A future command validator may require that they are present or structurally valid, but it must not apply them.

## Command Validation Boundary

A future pure command validation helper may check:

- command object is a non-null object
- `commandId` is present
- `commandType` is `"magic.cast"`
- `casterCharacterId` is present
- `spellId` is present
- known-spell reference is present when required
- target descriptor is structurally valid
- conduit source descriptor is structurally valid
- catalyst source descriptor is structurally valid
- casting context is structurally valid
- caller supplied spell catalog/readiness inputs are present
- `buildMagicCastReadiness(...)` returns no blocking readiness issues for the supplied command context

It may return deterministic command issues such as:

| Issue | Meaning |
| --- | --- |
| `invalid_magic_command` | The command payload is not a valid object. |
| `missing_command_id` | No command id was supplied. |
| `unsupported_command_type` | The command is not `magic.cast`. |
| `missing_caster_character_id` | No explicit caster character id was supplied. |
| `missing_spell_id` | No explicit spell id was supplied. |
| `missing_known_spell_reference` | No explicit known-spell record/id was supplied. |
| `invalid_known_spell_reference` | The supplied known-spell reference is structurally invalid or mismatched. |
| `missing_target_descriptor` | No explicit target descriptor was supplied. |
| `invalid_target_descriptor` | The target descriptor is structurally invalid. |
| `invalid_conduit_source_descriptor` | The conduit source descriptor is structurally invalid. |
| `invalid_catalyst_source_descriptor` | The catalyst source descriptor is structurally invalid. |
| `invalid_casting_context` | The casting context is structurally invalid. |
| `cast_readiness_blocked` | `buildMagicCastReadiness(...)` returned one or more blockers. |
| `runtime_casting_not_implemented` | Runtime support is absent, so the command cannot proceed to execution. |

The exact exported vocabulary belongs to a future implementation prompt. This document defines the boundary.

Validation helper must not:

- apply spell effects
- mutate inventory
- consume catalysts
- reserve catalysts
- pay MP, stamina, strain, health, or backlash costs
- produce combat events
- produce Chronicle events
- produce quest events
- create acquisition records
- mutate save/account/session data
- dispatch UI commands
- infer missing ownership or authority

## Forbidden Inference Rules

The command contract must not infer spell ownership, acquisition, target, conduit, catalyst, or casting authority from:

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
- item ownership without an explicit conduit/catalyst source descriptor
- document ownership without a dedicated acquisition/source route
- scroll ownership without a dedicated acquisition/source route
- tome ownership without a dedicated acquisition/source route

These signals may become context only after dedicated owner systems define source ids, validation rules, persistence behavior, and tests.

## Exact Allowed Scope For Version 0.5.98

`Version 0.5.98 - Magic Command Contract` may:

- Add this planning-only design document.
- Define planning-only command/intention shapes.
- Define planning-only target descriptor shapes.
- Define planning-only conduit/catalyst source descriptor shapes.
- Define planning-only casting context fields.
- Define a future pure command validation boundary.
- Update current handoff, roadmap, sequence, continuity, backlog, and Codex output docs.

`0.5.98` must not:

- Implement runtime spell casting.
- Add command handlers.
- Wire React UI.
- Dispatch commands.
- Mutate known-spell records.
- Persist acquisition events.
- Add save/account/session schema fields.
- Edit spell JSON or item JSON.
- Edit generated output.
- Change combat runtime behavior.
- Consume catalysts.
- Pay MP, stamina, strain, health, or backlash costs.
- Create combat, Chronicle, quest, account, or UI events.
- Add control/failure/backlash behavior.
- Add magic skill gain or Magic Legacy power.
- Add scroll/tome/document teaching.
- Add teacher, institution, quest, family, Legacy, source-run, discovered-record, item, or document acquisition routes.
- Broaden known-spell owner scopes.
- Replace `PlayerSpellState[]`.

## Deferred Work

Deferred after this plan:

- type-only or pure command contract definitions
- pure command validation helper
- command handler implementation
- runtime cast resolver
- effect application
- target effect resolution
- resource payment
- catalyst consumption
- inventory mutation
- combat/Chronicle/quest/account/UI event creation
- UI command dispatch
- save/account/session schema changes
- target existence, range, and line-of-sight resolution
- control/failure/backlash behavior
- scroll/tome/document teaching
- teacher/institution/quest/family/Legacy/source-run acquisition routes
- broader known-spell owner scopes
- `PlayerSpellState[]` replacement

Recommended next run:

`Version 0.5.99 - First Narrow Runtime Cast Resolver Plan`
