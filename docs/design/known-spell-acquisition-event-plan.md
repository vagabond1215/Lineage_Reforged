# Known Spell Acquisition Event Plan

Date: 2026-06-03
Source version/run: Version 0.5.96 - Known Spell Acquisition Event Planning
Status: planning-only source for Version 0.5.97 - Training Event Acquisition Helpers

## Purpose

Define the ownership and evidence boundary for future known-spell acquisition events before adding any mutation.

This plan prepares a future pure helper that can turn validated `training_event` evidence into a proposed explicit character-scoped `KnownSpellRecordState`. It does not create acquisition events, write known-spell records into save/account/session state, add runtime spell casting, add cast commands, add React UI, edit spell or item JSON, edit schemas, consume catalysts, grant magic skill, grant Magic Legacy power, or broaden ownership/acquisition routes.

## Current Foundation

Current known-spell and magic readiness foundation:

- Known-spell records are character-scoped only.
- The only supported acquisition route is `training_event`.
- `KnownSpellOwnerScope` is currently `"character"`.
- `KnownSpellAcquisitionRoute` is currently `"training_event"`.
- `KnownSpellAvailabilityState` is currently `"available" | "blocked"`.
- `KnownSpellTrainingEventEvidence` currently contains only `trainingEventId` and `sourceType: "training_event"`.
- `validateKnownSpellRecord(...)`, `validateKnownSpellRecordCollection(...)`, `createKnownSpellTrainingEventEvidence(...)`, and `createKnownSpellRecord(...)` are pure validation/normalization helpers.
- `buildKnownSpellReadOnlyProjection(...)` is a pure read-only projection over explicit current character known-spell records.
- `buildMagicCastReadiness(...)` is a pure read-only readiness helper that reuses known-spell projection and returns deterministic blockers.
- `PlayerSpellState[]` remains readiness/context data and is not a complete ownership or acquisition model.

Current content metadata is ahead of runtime behavior:

- `packages/content/base/player/spells.json` currently has 55 spells: 23 `ready`, 5 `partial`, and 27 `deferred`.
- 28 spells currently have compatibility profiles.
- `packages/content/base/items/items.json` currently has 7 conduit-profiled items and 3 catalyst-profiled items.
- `tools/content-lint/magic-metadata-support.mjs` validates spell compatibility plus conduit/catalyst metadata.
- `tools/content-lint/spell-hook-support.mjs` classifies spell hooks but does not execute spell effects.

The following do not imply spell ownership or acquisition:

- catalog presence
- Arcane Compendium visibility
- `PlayerSpellState[]`
- account, family, institution, document, item, source-run, heir, or Legacy data
- lineage
- backstory
- selected character UI state

## Acquisition Event Ownership

Future acquisition-event ownership should be explicit and character-scoped. For the next helper lane, the only planned acquisition route is `training_event`.

Planned training-event acquisition event shape:

```ts
interface PlannedKnownSpellTrainingEventAcquisition {
  eventId: string;
  ownerScope: "character";
  ownerId: string;
  characterId: string;
  spellId: string;
  trainingEventId: string;
  acquiredAt: string;
  acquisitionRoute: "training_event";
  evidenceSource: {
    sourceType: "training_event";
    trainingEventId: string;
  };
  validationStatus: "proposed" | "valid" | "blocked" | "invalid";
  notes?: string[];
  blockedReasons?: string[];
}
```

Shape rules:

- `eventId` identifies the proposed acquisition event, not a persisted event yet.
- `ownerScope` must remain `"character"`.
- `ownerId` must equal `characterId` under the current supported scope.
- `spellId` must reference the current spell catalog.
- `trainingEventId` must match the evidence source.
- `acquiredAt` must be caller-supplied and deterministic.
- `acquisitionRoute` must be `"training_event"`.
- `evidenceSource.sourceType` must be `"training_event"`.
- `validationStatus` describes the proposed event result only; it must not write state.
- `notes` and `blockedReasons` are explanatory only.

This shape is planning-only. It is not a schema, save-state contract, account-state contract, runtime event contract, or UI contract until a later scoped implementation says so.

## Evidence Boundaries

A future helper may propose a character-scoped known-spell record from training-event evidence only when all required facts are explicit.

Required facts:

- The spell id exists in the current spell catalog.
- The owner scope is `character`.
- The `characterId` is present.
- The `ownerId` is present.
- The `ownerId` and `characterId` match.
- The acquisition route is `training_event`.
- `trainingEventEvidence` is a minimal object with a valid `trainingEventId`.
- `trainingEventEvidence.sourceType` is exactly `training_event`.
- `acquiredAt` is supplied by the caller.
- The resulting `knownSpellId` is deterministic and unique in the checked collection.
- The proposed record validates through existing known-spell validation helpers.

Blocked facts:

- Unknown `spellId` must block proposed record creation.
- Missing or mismatched `ownerId` / `characterId` must block proposed record creation.
- Unsupported owner scopes must block proposed record creation.
- Unsupported acquisition routes must block proposed record creation.
- Missing `trainingEventId` must block proposed record creation.
- Unsupported training-event evidence fields must block proposed record creation.
- Duplicate `knownSpellId` values must remain deterministic validation failures.
- Records with `availability: "blocked"` must remain known but not cast-ready.
- Invalid records must not become cast-ready.
- Catalog visibility, Arcane Compendium visibility, and `PlayerSpellState[]` must not repair missing acquisition evidence.

Unsupported future routes remain blocked:

- `teacher`
- `quest_event_reward`
- `scroll`
- `tome`
- `document`
- `institution`
- `family_tradition`
- `legacy_access_lane`
- `discovered_record`
- `source_run_inheritance`

Those routes may become valid only after a dedicated owner/evidence plan and helper implementation define their source ids, validation rules, persistence owner, and non-inference boundaries.

## Duplicate Handling

Duplicate handling must stay deterministic.

Future helper policy:

- If the caller supplies a proposed `knownSpellId`, validate it as-is.
- If the helper derives `knownSpellId`, derive it from stable caller inputs such as `characterId`, `spellId`, and `trainingEventId`.
- Do not use random ids, wall-clock time, array order alone, or UI state as the only source of identity.
- Validate the proposed record against the caller-supplied existing known-spell collection.
- Return a deterministic duplicate issue when the proposed `knownSpellId` already exists.
- Do not silently replace, merge, unblock, or update an existing known-spell record.
- Do not infer that a duplicate blocked record should become available.

Possible issue vocabulary for the future helper:

| Issue | Meaning |
| --- | --- |
| `missing_acquisition_event_id` | The proposed acquisition event id is absent when the helper requires one. |
| `missing_character_id` | No supported character id was supplied. |
| `missing_owner_id` | No supported owner id was supplied. |
| `owner_character_mismatch` | `ownerId` and `characterId` do not match under the current character scope. |
| `unknown_spell_id` | The proposed spell id is not in the supplied current spell catalog. |
| `unsupported_acquisition_route` | The input route is not `training_event`. |
| `missing_training_event_evidence` | Minimal training-event evidence is absent or invalid. |
| `unsupported_training_event_evidence` | The evidence contains unsupported source type or future-route fields. |
| `duplicate_known_spell_id` | The proposed known-spell id collides with a caller-supplied known-spell record. |
| `invalid_known_spell_record` | The normalized proposed record fails existing known-spell validation. |

The exact exported issue vocabulary belongs to `Version 0.5.97`; this plan only defines the expected boundary.

## Future Helper Shape

Recommended helper names for `Version 0.5.97 - Training Event Acquisition Helpers`:

- `validateKnownSpellTrainingEventAcquisition(...)`
- `buildKnownSpellRecordFromTrainingEvent(...)`

Less preferred:

- `createKnownSpellRecordFromTrainingEvent(...)`

The `create...` form is less clear because the helper must not persist anything. If used, the implementation and docs must state that it creates only an in-memory proposed record.

Allowed future helper behavior:

- Accept caller-supplied spell catalog records.
- Accept caller-supplied existing known-spell records for duplicate checks.
- Accept an explicit character id / owner id.
- Accept an explicit spell id.
- Accept explicit training-event evidence.
- Accept caller-supplied `acquiredAt`.
- Validate the training-event acquisition input.
- Produce a normalized proposed `KnownSpellRecordState`.
- Call existing known-spell validation helpers.
- Return deterministic issues or blockers.
- Return the proposed record only when validation passes.

Forbidden future helper behavior:

- Write to save, account, session, inventory, or runtime state.
- Create persisted acquisition events.
- Create Chronicle, combat, quest, account, or UI events.
- Apply active spell behavior.
- Mark a spell cast-ready by itself.
- Consume catalysts or pay costs.
- Search inventory, account, family, document, scroll, tome, institution, Legacy, or source-run data.
- Broaden known-spell owner scopes.
- Add support for teacher, quest, scroll, tome, document, institution, family, Legacy, discovered-record, or source-run inheritance routes.

Recommended result shape:

```ts
interface KnownSpellTrainingEventAcquisitionProposal {
  ok: boolean;
  issues: KnownSpellTrainingEventAcquisitionIssue[];
  acquisition?: PlannedKnownSpellTrainingEventAcquisition;
  proposedRecord?: KnownSpellRecordState;
}
```

The result is a proposal only. A later mutating owner, if approved, would be responsible for committing it to state.

## Forbidden Inference Rules

Known-spell acquisition must not be inferred from:

- `PlayerSpellState[]`
- Arcane Compendium entries
- spell catalog presence
- lineage
- backstory
- account id
- family id
- source run id
- selected character UI state
- Legacy unlocks
- item ownership
- document ownership
- scroll ownership
- tome ownership

These can become context or access signals only after their own owner systems and evidence routes are implemented. They are not acquisition evidence in `0.5.96` or the planned `0.5.97` helper.

## Relationship To Cast Readiness

The future acquisition helper should produce proposed known-spell records only.

It should not:

- call `buildMagicCastReadiness(...)` as proof of acquisition
- bypass `buildKnownSpellReadOnlyProjection(...)`
- treat `compatibilityStatus: "ready"` as knowledge
- treat a valid known-spell record as permission to cast
- remove blockers such as `missing_conduit`, `missing_catalyst`, `insufficient_control`, `unsupported_spell_hooks`, `spell_runtime_deferred`, or `runtime_casting_not_implemented`

Active casting still requires a later command/resolver boundary after known-spell acquisition, readiness, conduit, catalyst, control, hook, cost, and runtime event ownership are all scoped.

## Exact Allowed Scope For Version 0.5.97

`Version 0.5.97 - Training Event Acquisition Helpers` may:

- Add pure TypeScript helper types/functions for training-event acquisition validation.
- Add a helper that returns a proposed `KnownSpellRecordState` from explicit training-event evidence.
- Reuse `validateKnownSpellTrainingEventEvidence(...)`, `validateKnownSpellRecord(...)`, and `validateKnownSpellRecordCollection(...)`.
- Validate duplicate `knownSpellId` behavior against caller-supplied existing records.
- Add focused unit tests for valid proposal, missing evidence, unsupported routes, unknown spell ids, owner mismatch, duplicate ids, and forbidden inference.
- Export the pure helper and types through the game-engine barrel if implemented.
- Update docs and backlog handoff notes.

`0.5.97` must not:

- Persist acquisition events.
- Mutate known-spell collections.
- Add save/account/session schema fields.
- Add runtime casting.
- Add cast commands.
- Add React UI.
- Edit spell JSON or item JSON.
- Edit generated output.
- Change combat runtime behavior.
- Consume catalysts.
- Add control/failure/backlash behavior.
- Add magic skill gain or Magic Legacy power.
- Add scroll/tome/document teaching.
- Add teacher, institution, quest, family, Legacy, source-run, discovered-record, or item/document acquisition routes.
- Broaden known-spell owner scopes.
- Replace `PlayerSpellState[]`.

## Deferred Work

Deferred after `0.5.96`:

- acquisition event creation/mutation
- active casting
- runtime cast resolver
- command contracts
- UI surfaces
- save/account schema changes
- scroll/tome/document teaching
- teacher/institution/quest/family/Legacy/source-run routes
- catalyst consumption
- conduit implementation beyond metadata comparison
- control/failure/backlash behavior
- broader ownership scopes
- `PlayerSpellState[]` replacement

Recommended next run:

`Version 0.5.97 - Training Event Acquisition Helpers`

