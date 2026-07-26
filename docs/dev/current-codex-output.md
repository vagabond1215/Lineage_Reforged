# Current Codex Output

Date: 2026-07-25

Source run: `Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`

Run classification: unversioned durable documentation-only contract decision

Parent version: none

Milestone impact: `supports_current_band`

Branch/status assumption: `master`, tracking `origin/master`; pre-edit worktree clean; documentation edits remain unstaged

Starting and ending pre-edit commit after fetch: `e7aa0d694b44dc5377c80f8ea8715bc55cd4f8c5`

Suggested commit: `docs(design): define occurrence commitment and correction contracts`

## Files Changed

1. Created `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`.
2. Replaced `docs/dev/current-codex-output.md`.
3. Replaced `docs/dev/current-gpt-handoff.md`.
4. Updated materially affected rows in `docs/dev/historical-version-and-deferred-route-register.md`.

No prompt, completed authority, audit, research, roadmap, sequenced plan, runtime, shared type, schema, validator, package, dependency, persistence, save manager, lifecycle, migration, account, test, UI, content, generated, held-route, or retained-route file changed.

## Repository And Pinned Source Verification

- Fetched/pruned `origin`; local `master` was synchronized with `origin/master`.
- Reloaded the complete active prompt after fetch.
- Confirmed save/Stakes commit `dcea4e42dcbbf67cecf19490923e63384027243e` is an ancestor of `HEAD`.
- Confirmed all prompt-pinned authority, coordination, live-source, and held-route blobs.
- Confirmed no relevant live event/random source changed beyond the pinned baseline.
- Held `Version 0.6.6` blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` remains untouched; retained `0.6.7` remains unchanged.
- The new contract artifact resolves to blob `332476a6c90f4a80161ecb8c5123f846997dcf52`.
- No execution-gate contradiction was found.

## Live Event And Random Baseline

- Generic `createEvent` ids use `type:domain:tick`; these are collision-prone compatibility projections, not occurrence authority.
- Travel, quest acceptance/tracking, and activity selection have bounded engine-owned command and snapshot-revision patterns. Their ids are useful migration evidence but are not complete occurrence/result/retry receipts.
- `TickContextBase.seed` and spawn/combat/quest/stat-growth hashes are deterministic domain inputs. Chance-like spawn resolution is unauthorized gameplay uncertainty for future committed policies until migrated to an owner-certified channel/result contract.
- Character-creation and narrative-screen `Math.random` calls are non-authoritative setup/presentation conveniences; launcher suffix randomness is unrelated technical use.
- Account, save, Chronicle, closure, reward, estate, achievement, and lifecycle records are consumer/migration evidence, not a universal occurrence ledger.

## Accepted Taxonomy And Owner Graph

```text
request / delivery
  -> domain admission
       -> occurrence
            -> deterministic result
            -> uncertain result -> authorized named channel evidence
                 -> owner-specific consequence receipts
                      -> event / Chronicle / narrative / UI projections
```

- The initiating owner owns request identity and intent.
- The domain owner owns admission, occurrence identity, material-input normalization, and result meaning.
- Uncertainty infrastructure owns channel/draw identity but never domain interpretation.
- Each downstream owner owns one consequence truth and idempotent receipt.
- Save authority persists links without resolving outcomes.
- Projection owners receive safe facts and cannot reconstruct authority.

The accepted occurrence-contract semantic policy version is **1**. Exact fields and implementation remain deferred.

## Occurrence, Same-Tick, And Relation Decisions

- Request identity is established before delivery; domain admission reserves occurrence identity before mutation; accepted occurrence/result publication is atomic with authoritative transition.
- Pre-admission rejection has a request receipt but no gameplay occurrence. An admitted consequential rejection remains an occurrence without an accepted result unless its owner defines one.
- Retry preserves request identity, normalized intent, causal source, and opportunity. Conflicting reuse of an id is rejected/quarantined.
- Same-type/domain/tick occurrences require stable owner scope plus an admitted-attempt discriminator/source identity. Tick or global sequence alone is insufficient.
- Causal order, explicit simultaneity, correlation, cause, parent/child, aggregate/member, and supersession are distinct relations.
- Genuine simultaneity is unordered; aggregation references components without collapsing provenance.

## Material Equivalence And Result Decisions

- Each domain certifies a versioned normalized causal fact set; infrastructure cannot decide universal materiality.
- Opaque whole-snapshot hashing is not the conceptual default.
- UI, camera, renderer, localization, telemetry order, storage movement, reload, and duplicate delivery do not create opportunities.
- Certified changes to preparation, equipment, route, timing, participants, target, environment, choice, or causal state may create a new opportunity.
- Historical content/policy/resolver changes are explicit; accepted history is retained or handled through migration/quarantine/correction, never silent reroll.
- Deterministic results use no authorized channel. Uncertain results link authorized channel evidence. A draw is not a result.

## Named Uncertainty And Per-Stakes Commitment

- A named channel is a stable, versioned semantic authorization scoped to a domain and uncertainty family.
- Channel identity is separate from event type, label, seed, occurrence, result, and algorithm.
- Uses are occurrence-scoped and independent of unrelated call order; no global random stream is authority.
- Multiple channels/results require declared semantic roles, cardinality, and relations.
- Normal has no general cross-reload commitment, but remains idempotent inside authoritative continuity and permits narrow owner-specific commitment.
- Committed retains materially identical uncertain results across checkpoint replay, restart, relocation, and recovery; equivalent results link into a child continuity.
- Ironbound retains accepted commands, occurrences, results, and consequences across retry, reconnect, copies, and technical recovery.

## Consequence, Correction, And Projection Decisions

- Every consumer uses its own stable consequence receipt; duplicate delivery cannot duplicate body, injury, inventory, quest, Chronicle, closure, settlement, reward, estate, achievement, Prestige, or succession effects.
- Partial failure retries only the missing consumer receipt.
- Correction is owner-approved replacement/reconciliation of proven invalid authority, not rollback, recovery, resurrection, record deletion, or favorable reroll.
- Original records remain retained with reason, evidence, supersession, and reconciliation state.
- Preserve occurrence identity when the causal event happened; replace it when admission/identity/cause was invalid or merged.
- Reuse valid uncertainty evidence for interpretation/projection defects; invalidate/recompute only under proven defect and an explicit versioned correction policy.
- Each downstream owner retains, reverses, compensates, replaces, or quarantines its consequence.
- Closed Ironbound correction requires proven defect, follows the closed lineage across copies/generations, and exposes no state picker.
- Events, Chronicle, Manuscript, narrative, UI, logs, and telemetry are projections. Hidden seeds/draws/channels/weights/diagnoses/validator facts stay private.

## Retained, Rejected, And Superseded Authorities

- Retained permanently: save/Stakes and Mortal Crisis/Stakes authorities.
- Retained: domain gameplay ownership, narrative observer-safe projection, and bounded command patterns as migration evidence.
- Rejected as sufficient authority: event type, tick, envelope id, command id, seed, hash, slot, timestamp, Chronicle id, UI id, global sequence, and global random stream.
- Rejected: correction by UI/player preference, silent historical reroll, and projection authority.
- Superseded: any older ambiguity that command, occurrence, result, consequence, and projection are interchangeable.

## Unresolved Implementation Questions

Exact types, encodings, identity generation, reservation durability, packages, schemas, registry storage, algorithms, seeds, hashes, cryptographic posture, persistence/migration formats, compatibility thresholds, correction tooling/permissions, retention, diagnostics/privacy access, domain adapter selection, and availability gates remain implementation-only.

No accepted semantic boundary remains deferred.

## Checks Run

- repository status, upstream, fetch/prune, ahead/behind, and ancestor checks;
- exact SHA-1 verification for every prompt-pinned file and held blob;
- focused source search for event ids, commands, seeds, hashes, `Math.random`, retries, and consequence receipts;
- exact authorized-path diff/status check;
- 41-section artifact structure and 38 required-conclusion answer check;
- Markdown heading, link/path reference, conflict-marker, whitespace, and forbidden-scope checks;
- artifact hash verification.

## Risks And Follow-Up

- This is authority only; current runtime remains legacy and collision-prone.
- Under-proven value-bearing legacy records require quarantine rather than inferred commitment.
- Domain materiality, channel families, and correction permissions still require separately authorized implementation contracts.
- No next prompt was installed.

## Evidence And Held Routes

Retain comparative mortality, defeat/injury, narrative, and elemental evidence through their named consumers. Preserve completed save/Stakes and Mortal Crisis/Stakes authorities permanently. Do not restore held `0.6.6`; retained `0.6.7` remains unchanged.

## Next Recommended Route

`Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision`

This should remain an unversioned documentation-only contract route unless later evidence changes its classification.
