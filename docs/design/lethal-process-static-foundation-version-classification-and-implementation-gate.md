# Lethal-Process Static Foundation Version Classification And Implementation Gate

Date: 2026-07-29

Run: unversioned `Lethal-Process Static Foundation Version Classification And Implementation Gate`

Status: accepted documentation-only classification; exact versioned implementation prompt installed

Milestone impact: `supports_current_band`

## Decision Summary

Classification:

`CURRENT_BAND_PRIMARY`

Assigned implementation label:

`Version 0.6.8 - Lethal-Process Definition Static Foundation`

The package adds a new validated static authority required by the active `0.6.x` runtime-ownership dependency-closure sequence. It is not a `0.7.0` band entry, a repair or audit of `0.6.7`, or unversioned planning.

The implementation remains static and non-executing. It does not create mutable process instances, persistence, care, diagnosis, observer knowledge, death, UI, or gameplay.

## 1. Policy Baseline

The controlling policy is `docs/design/internal-versioning-and-release-milestone-policy.md`.

### 1.1 Classification order

The policy requires classification in this order:

1. new maturity-band entry;
2. current-band three-segment primary;
3. parent-specific four-segment support suffix;
4. unversioned named work.

When uncertain, the less maturity-significant label must be selected. This package is not uncertain at the class boundary because it matches an explicit primary example and does not match the suffix or unversioned criteria.

### 1.2 Current-band primary criteria

A three-segment primary is appropriate when a run adds, changes, activates, or closes durable capability or authority that materially advances the current band.

The policy explicitly includes:

- adding a validated static authority required by the active milestone;
- activating a previously planned content family with required validation.

The lethal-process package does both in one coherent implementation:

- creates four owner-specific canonical catalogs;
- creates six canonical identities;
- creates the shared structural authority;
- creates pure cross-catalog validation;
- registers the live family in normal content lint and schema coverage.

### 1.3 Support-suffix criteria

A four-segment suffix is reserved for a run attached to one primary:

- post-implementation audit;
- retry;
- narrow acceptance repair;
- validation-only pass;
- regression correction;
- parent-specific clarification;
- parent-required cleanup.

The package is not support for `0.6.7`. That version completed cross-content coherence over the earlier `0.6.4`-`0.6.6` static sequence. The lethal-process family is new authority selected by later independent health-contract work.

### 1.4 Unversioned criteria

Unversioned runs cover research, coordination, planning, future exploration, source indexing, and read-only audits that do not alter accepted capability.

The completed owner/schema plan and this classification gate are correctly unversioned. The implementation is not: it will add canonical content, schema, validator, lint registration, and tests.

### 1.5 New-band gate

`0.7.0` requires an accepted engine-owned integrated gameplay loop with authoritative advancement/results, persistence, typed cross-system consequences, accepted-only UI application, and representative integration coverage.

This package provides none of those claims. Static content, isolated schemas, and pure validation do not independently satisfy `0.7.0`.

The project therefore remains in `0.6.x`.

## 2. Package Reproduction

### 2.1 Owners and records

| Id | Owner |
| --- | --- |
| `lethal_process.hemorrhage.external_hemorrhage` | `hemorrhage_process` |
| `lethal_process.hemorrhage.internal_hemorrhage` | `hemorrhage_process` |
| `lethal_process.airway.obstruction` | `airway_process` |
| `lethal_process.respiratory.post_submersion_compromise` | `respiratory_process` |
| `lethal_process.thermal.systemic_hypothermia` | `thermal_process` |
| `lethal_process.thermal.hot_altered_crisis` | `thermal_process` |

The distribution is exactly two hemorrhage, one airway, one respiratory, and two thermal definitions.

### 2.2 Exact implementation paths

New catalogs:

- `packages/content/base/game/lethal_process_hemorrhage_definitions.json`;
- `packages/content/base/game/lethal_process_airway_definitions.json`;
- `packages/content/base/game/lethal_process_respiratory_definitions.json`;
- `packages/content/base/game/lethal_process_thermal_definitions.json`.

New schema and validator:

- `packages/schemas/game/lethal-process-definition.schema.json`;
- `tools/content-lint/lethal-process-definitions.mjs`.

Existing registration paths:

- `tools/content-lint/index.mjs`;
- `tests/unit/schema-files.test.mjs`.

New focused test:

- `tests/unit/lethal-process-definition-authority-validation.test.mjs`.

These are exactly nine implementation paths. The seven new paths remain absent at the classification baseline. The two registration files remain unchanged.

### 2.3 Shared envelope

Wrapper:

- `ownerDomain`;
- `records`.

Strict record:

- `id`;
- `slug`;
- `name`;
- `definitionOwner`;
- `processFamily`;
- `catalogLifecycle`;
- `semanticVersion`;
- `summary`;
- `references`;
- `tags`;
- `sourceAuthorityNotes`;
- `notes`.

Exact lifecycle:

`planned | canonical | retired`

Every seed record uses:

- `catalogLifecycle: "canonical"`;
- `semanticVersion: 1`;
- `references: []`;
- the exact remaining values accepted in the owner/schema plan.

### 2.4 Validation

The package adds:

- one strict draft-2020-12 schema titled `LethalProcessDefinitionCatalog`, with no `$id`;
- one pure cross-catalog validator;
- exact path/owner/id/family/slug coherence;
- global id/slug/internal-name uniqueness;
- exact first-scope inventory/distribution validation;
- recursive mutable/runtime/diagnosis/care/persistence/death/UI/gameplay rejection;
- exact-once normal-lint registration of all four catalogs;
- exact-once schema parse registration;
- focused positive, negative, collision, reference, purity, registration, and non-runtime-import tests.

No production module consumes the records.

## 3. Dependency And Risk Gate

### 3.1 Passed static dependencies

- Every definition has exactly one accepted definition and compatible future instance owner.
- Every id, owner segment, slug, family, catalog, field, lifecycle, semantic version, and seed value is fixed.
- All six live references are empty, so no unresolved cross-owner target blocks the seed.
- The reference shape and future resolution rule are fixed without authoring unsafe targets.
- The schema, validator, registration, test paths, and acceptance checks are exact.
- Current content supplies no alias or migration obligation.
- Repository-wide collision scans found no `lethal_process.` identity or `0.6.8` assignment.
- The seven new implementation paths are absent.

### 3.2 Preserved separation

The static package does not depend on:

- mutable process-instance representation;
- occurrence, result, receipt, replay, or correction storage;
- body, injury, hazard, environment, poison, respiratory, or magic target references;
- care capabilities, attempts, treatment, or provider access;
- assessment, diagnosis, urgency, or observer-safe projection;
- actual death, restoration, closure, or Stakes settlement;
- save migration;
- UI, narrative, Chronicle, or gameplay consumers.

### 3.3 Risk controls

- Exactly six definitions; no seventh record.
- Empty live references.
- No widening or import of `combat_health_vocabulary`.
- No production dependency or runtime import.
- No mechanics, values, stages, rates, timers, probabilities, formulas, diagnosis, treatment, or display copy.
- Exact changed-path audit.
- Focused tests, schema parse coverage, and normal content lint are mandatory.
- Broad workspace typecheck is not an acceptance gate because its known 173-diagnostic baseline is unrelated.

Result:

`DEPENDENCY_CLOSED`

## 4. Version Classification

### 4.1 Accepted class

`CURRENT_BAND_PRIMARY`

Exact label:

`Version 0.6.8 - Lethal-Process Definition Static Foundation`

Milestone impact:

`advances_current_band`

Reason:

The implementation creates a new validated canonical authority needed before later health-process integration. It materially advances `0.6.x` dependency closure while remaining static and bounded.

### 4.2 Rejected classes

| Class | Result | Reason |
| --- | --- | --- |
| New-band entry | rejected | No integrated gameplay loop or `0.7.0` readiness audit |
| Parent support suffix | rejected | This is new authority, not an audit/repair/retry/clarification of `0.6.7` |
| Unversioned only | rejected | The implementation changes canonical capability and validation |
| Not ready | rejected | Static owner, schema, content, reference, migration, path, and validation decisions are closed |

No historical label changes.

## 5. Exact Implementation Prompt

Installed in:

`docs/dev/current-codex-prompt.md`

The prompt:

- uses exact `Version 0.6.8 - Lethal-Process Definition Static Foundation`;
- authorizes only the nine implementation paths plus post-acceptance coordination updates;
- requires exactly six canonical static records and the exact plan values;
- requires one strict schema and pure cross-catalog validator;
- requires exact-once normal-lint and schema registration;
- requires focused validation, schema parse tests, and normal content lint;
- preserves empty references and current combat-health authority;
- authorizes no mutable, runtime, persistence, migration, diagnosis, care, death, UI, or gameplay work;
- routes successful implementation to a parent-specific `0.6.8.1` acceptance audit.

## Explicit Answers

1. **What class applies?** `CURRENT_BAND_PRIMARY`.
2. **What label applies?** `Version 0.6.8 - Lethal-Process Definition Static Foundation`.
3. **Why not `0.7.0`?** The integrated-gameplay entry criteria are not met.
4. **Why not a support suffix?** This adds new canonical authority rather than accepting or repairing `0.6.7`.
5. **Why not unversioned?** The implementation creates live validated content/schema authority.
6. **Is the package dependency-closed?** Yes, for the exact static scope with empty references.
7. **What remains blocked?** Every mutable or executable health-process concern.
8. **What follows?** The installed exact versioned implementation prompt.

## Non-Implementation Confirmation

This gate changes documentation only. It creates no content, schema, validator, test, source, runtime, command, event, save, migration, dependency, generated output, diagnosis, care, death, UI, or gameplay behavior.
