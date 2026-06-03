# Magic Runtime Boundary Plan

Date: 2026-06-02
Source version/run: Version 0.5.94 - Magic Runtime Boundary Plan
Status: planning-only boundary for the next pure cast-readiness helper

## Purpose

Define the boundary between the existing known-spell ownership and read-only projection helpers and a future pure cast-readiness helper.

This plan prepares `Version 0.5.95 - Magic Cast Readiness Helper`. It does not implement runtime casting, cast commands, React UI, catalyst consumption, MP/stamina/strain payment, combat events, acquisition events, save/account changes, spell JSON edits, item JSON edits, scroll/tome/document teaching, magic skill gain, Magic Legacy power, or broader known-spell ownership routes.

## Current Foundation

Current known-spell helpers live in `packages/engines/game-engine/src/known-spells.ts` and are exported through `packages/engines/game-engine/src/index.ts`.

They currently support:

- character-scoped known-spell records only
- `training_event` acquisition route only
- `available` and `blocked` availability states
- minimal `trainingEventEvidence` validation
- collection validation, duplicate known-spell id detection, and catalog id checks
- a read-only projection that returns available, blocked, and invalid known-spell summaries

They do not support:

- account, family, institution, document, item-instance, source-run, heir, Legacy, scroll, tome, or teacher ownership scopes
- acquisition event creation
- runtime spell casting
- conduit selection
- catalyst selection or consumption
- control/failure checks
- spell hook execution
- UI commands or save mutation

Current magic metadata exists but is not runtime behavior:

- `packages/content/base/player/spells.json` has 55 authored spell records: 23 `ready`, 5 `partial`, and 27 `deferred`.
- `packages/content/base/items/items.json` currently includes 7 conduit-profiled items and 3 catalyst-profiled items.
- `tools/content-lint/magic-metadata-support.mjs` validates spell compatibility profiles plus conduit and catalyst metadata.
- `tools/content-lint/spell-hook-support.mjs` classifies spell hooks as runtime-consumed, classifier, deferred, or unknown.
- `tests/unit/magic-runtime-readiness-blockers.test.mjs` is test-local blocker scaffolding from `0.5.93`; it is not an exported runtime helper.

## Boundary Rule

Known-spell projection answers only:

```text
Does this explicit current character known-spell record validate and project as available, blocked, or invalid?
```

Cast readiness may ask more, but only through a pure read-only helper:

```text
Given explicit known-spell records, a spell catalog record, optional caller-supplied conduit/catalyst candidates, caller-supplied control context, and hook/runtime support context, which blockers prevent this cast from being ready?
```

Cast readiness must not become spell casting. A readiness helper may produce a deterministic blocker list and a `ready` boolean. It must not apply spell effects, mutate inventory, consume catalysts, pay MP/stamina/strain costs, produce combat events, change save data, or create acquisition records.

## Non-Inference Rules

The future helper must not infer spell ownership from:

- `PlayerSpellState[]`
- Arcane Compendium entries
- spell catalog presence
- lineage
- backstory
- account id
- family id
- source run id
- selected character UI state
- Legacy data
- item, document, scroll, or tome ownership

Only explicit current character known-spell records under the existing helper boundary can count as known for `0.5.95`.

## Conduit Policy

For `0.5.95`, conduit checks should be metadata comparison only.

Allowed:

- Read a caller-supplied conduit candidate object.
- Inspect that candidate's `conduitProfile`.
- Compare `conduitProfile.castingTags` against the selected spell's `compatibilityProfile.requiredTags`.
- Treat `requiredTags.all` as tags that must all be present.
- Treat `requiredTags.any` as alternative groups where at least one group must be satisfied when present.
- Treat a missing conduit as `missing_conduit` when the spell profile does not explicitly allow freecast or the caller requires a conduit.
- Treat a malformed, unsupported, or tag-incompatible conduit as `invalid_conduit`.

Not allowed:

- Equip or unequip items.
- Search inventory unless the caller already supplies the candidate.
- Derive item ownership from save data.
- Apply conduit bonuses, penalties, range changes, accuracy changes, damage changes, or skill gain.
- Treat conduit tags as executable effects.
- Add new conduit item metadata or edit item JSON.

Freecast policy:

- `compatibilityProfile.freecastAllowed: true` may allow a readiness pass without a conduit only when the selected spell otherwise has supported runtime status and the caller has not required a conduit.
- Freecast does not bypass known-spell, catalyst, control, hook, or runtime-casting blockers.
- Missing or invalid compatibility metadata should not be repaired by assuming freecast.

## Catalyst Policy

For `0.5.95`, catalyst checks should be metadata comparison only.

Allowed:

- Read a caller-supplied catalyst candidate object.
- Inspect that candidate's `catalystProfile`.
- Compare `catalystProfile.families` with spell `compatibilityProfile.catalystFamilies` when the spell declares catalyst families.
- Compare `catalystProfile.tier` with spell `compatibilityProfile.catalystTiers` when the spell declares catalyst tiers.
- Treat a required but absent catalyst as `missing_catalyst`.
- Treat a supplied but malformed or incompatible catalyst as `invalid_catalyst`.

Not allowed:

- Consume catalysts.
- Reserve catalysts.
- Search inventory unless the caller already supplies the candidate.
- Apply catalyst potency, cost reduction, area, duration, accuracy, damage, backlash, or crafting effects.
- Add catalyst item metadata or edit item JSON.

Catalyst requirement rule:

- A catalyst is required when the spell compatibility profile declares catalyst families or catalyst tiers and the future helper's caller marks catalyst policy as active for that cast lane.
- A spell with no catalyst metadata should not require a catalyst for `0.5.95`, but a supplied incompatible catalyst can still report `invalid_catalyst`.

## Control And Failure Policy

For `0.5.95`, control checks should remain a pure threshold gate.

Allowed:

- Read caller-supplied control context, such as a normalized control score and optional supported control tags.
- Compare the control context against spell/conduit metadata such as `control.easy`, `control.moderate`, or `control.hard`.
- Return `insufficient_control` when the caller provides no accepted control context or the provided context fails the threshold.
- Include deterministic explanation fields in blocker details.

Not allowed:

- Roll random failure.
- Apply backlash, miscast, collateral, strain, wounds, status effects, resource loss, or cooldowns.
- Change player stats, skill ranks, traits, saves, combat state, or session state.
- Create failure events.

Failure policy remains deferred. The helper may say a cast is not ready because control is insufficient, but it must not decide what failure does.

## Hook And Runtime Support Policy

Spell hook support must be explicit before readiness can pass.

For `0.5.95`:

- `compatibilityStatus: "ready"` is required for a spell to pass the runtime-status gate.
- `compatibilityStatus: "partial"`, `"deferred"`, or `"placeholder"` should return `spell_runtime_deferred`.
- Deferred or unknown resolution hooks should return `unsupported_spell_hooks`.
- Deferred or unknown item-generation hooks should return `unsupported_spell_hooks`.
- Classifier hooks may provide metadata classification only; they do not execute effects.
- Runtime-consumed hooks may be considered supported for readiness classification only, not executed.

The helper should avoid importing browser-facing UI modules. If production engine code needs hook classification, add or pass a small pure support boundary deliberately; do not make lint-only scripts an accidental runtime dependency without reviewing that import boundary.

## Readiness Blocker Vocabulary

`0.5.95` should use these blocker ids:

| Blocker | Meaning |
| --- | --- |
| `missing_known_spell` | No valid available known-spell projection entry exists for the character and spell. |
| `known_spell_blocked` | A valid known-spell record exists for the spell but its availability is `blocked`. |
| `invalid_known_spell_record` | Known-spell validation/projection found invalid records relevant to the requested character or spell. |
| `missing_training_event_evidence` | The record is missing required `training_event` evidence or has unsupported evidence for the current helper boundary. |
| `missing_conduit` | A required conduit was not supplied and freecast does not cover this readiness lane. |
| `invalid_conduit` | A supplied conduit lacks valid conduit metadata or does not satisfy spell compatibility requirements. |
| `missing_catalyst` | A required catalyst was not supplied. |
| `invalid_catalyst` | A supplied catalyst lacks valid catalyst metadata or does not satisfy spell compatibility requirements. |
| `insufficient_control` | Caller-supplied control context is absent, unsupported, or below the deterministic threshold. |
| `unsupported_spell_hooks` | The spell uses deferred or unknown resolution/item-generation hooks. |
| `spell_runtime_deferred` | The spell's compatibility status is not ready for runtime readiness. |
| `runtime_casting_not_implemented` | Actual effectful casting is still absent, so readiness cannot authorize execution. |

The `0.5.93` test-local names such as `blocked_known_spell`, `missing_conduit_policy`, `missing_catalyst_policy`, and `missing_control_policy` should not become the exported vocabulary for `0.5.95`. The future helper should use the vocabulary above.

## Exact Allowed Scope For Version 0.5.95

`Version 0.5.95 - Magic Cast Readiness Helper` may:

- Add a pure deterministic cast-readiness helper in the game-engine magic/known-spell boundary.
- Reuse `buildKnownSpellReadOnlyProjection(...)` instead of duplicating ownership validation.
- Export read-only TypeScript types and helper functions through `packages/engines/game-engine/src/index.ts`.
- Add focused unit tests for blocker vocabulary and deterministic readiness results.
- Compare spell compatibility metadata with caller-supplied conduit, catalyst, control, and hook-support inputs.
- Return a result object such as `{ ready, blockers, projection }`.
- Keep `runtime_casting_not_implemented` present by default while no cast resolver exists.
- Update `docs/dev/current-codex-output.md` and backlog notes for deferred active casting.

`0.5.95` must not:

- Implement runtime spell casting.
- Add cast commands or command handlers.
- Add React UI.
- Edit spell JSON, item JSON, schemas, save/account state, generated output, combat runtime behavior, or catalyst consumption.
- Pay MP, stamina, strain, health, or backlash costs.
- Produce combat events, Chronicle events, acquisition records, or save mutations.
- Add magic skill gain or Magic Legacy power.
- Add scroll, tome, document, teacher, family, institution, account, source-run, heir, or Legacy acquisition routes.
- Broaden known-spell owner scopes.
- Infer ownership from `PlayerSpellState[]`, Arcane Compendium visibility, catalog presence, lineage, backstory, account id, family id, source run id, selected character UI state, or Legacy data.

## Follow-Up Sequence

Recommended next run:

`Version 0.5.95 - Magic Cast Readiness Helper`

Later work remains deferred:

- acquisition event planning and helpers
- active cast command contract
- first narrow runtime cast resolver
- actual catalyst consumption and cost payment
- control failure/backlash behavior
- scroll/tome/document teaching
- family/institution/account spell ownership
- Magic Legacy access lanes and safe-study support
