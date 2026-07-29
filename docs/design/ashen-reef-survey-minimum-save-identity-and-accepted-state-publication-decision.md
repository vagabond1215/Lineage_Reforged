# Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision

Date: 2026-07-29

Source run: unversioned `Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision`

Label class: unversioned

Milestone impact: `supports_current_band`

Status: accepted minimum save contract; implementation remains blocked by Normal Stakes activation, first-mutation continuity admission, and account-value publication ordering

## 1. Decision

The minimum Normal-only save identity, provenance, migration, publication, and receipt-persistence contract required by the accepted Ashen Reef survey boundary is decidable.

The implementation package is not dependency-closed.

Implementation result:

`NO_PACKAGE`

Blocking dependency result:

`BLOCKED_BY_NORMAL_STAKES_ACTIVATION_CONTINUITY_AND_ACCOUNT_VALUE_PUBLICATION`

Selected next route:

`Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`

Next-route classification:

`UNVERSIONED_PREREQUISITE`

No `0.6.9`, support suffix, or `0.7.0` label is assigned.

## 2. Repository And Branch Baseline

- Starting commit: `03a79c8a359414f7c79421a1cef2d72d91d040de`.
- Branch: `master`.
- Upstream: `origin/master`.
- Worktree began clean.
- `git fetch --all --prune` left local and remote `master` synchronized.
- One open pull request exists: PR #2, `main-menu-asset-contract-pass`, still non-mergeable and unrelated to save identity.
- No live branch contains save, persistence, campaign identity, occurrence receipt, or publication implementation relevant enough to integrate.
- `prep/integrated-gameplay-0-7-readiness-audit` and `parallel/prompt-packaging-integrity-audit` remain `PROTECTED_REFERENCE`.
- Twelve connector documentation branches remain at their named integration triggers.
- Legacy menu branches remain unrelated to the active save decision.
- No merge, cherry-pick, rebase, PR closure, or branch deletion is due inside this run.

The protected readiness audit still supports one minimum save identity/provenance package before survey occurrence work. Its old static-sequence facts remain historical and do not override current routing.

## 3. Exact Live Save Reality

### 3.1 Snapshot and identity

`SaveSnapshot` currently stores:

- `accountId`;
- `snapshotVersion`;
- `capturedAtTick`;
- clock, game, player, world, civilization, and session state.

It does not store:

- campaign identity;
- continuity identity or lineage;
- authoritative character identity distinct from a name-derived player id;
- campaign-rules semantic identity;
- Stakes policy revision;
- artifact, generation, publication, or continuation-head identity;
- authoritative occurrence, result, consequence, or correction records.

`PlayerState.playerId` is generated from the normalized player name. It can collide across characters with the same normalized name and is therefore migration evidence, not sufficient future character identity.

`PlayerSaveMetadata.sourceRunId` is optional inheritance/source linkage. Account run history uses `characterId`, timestamps, outcome, and slot-address lists as account projections. None is campaign or continuity authority.

### 3.2 Campaign rules

Live `GameState.runDifficulty` retains:

- `easy | normal | hard | brutal`;
- `hardcore: boolean`.

It is legacy campaign-rules migration input. It does not implement accepted Difficulty, World Rules, or Stakes identity.

### 3.3 Storage

The browser save manager uses:

- 128 manual addresses and one quick-save address;
- account-and-slot localStorage keys;
- a version-6 envelope containing account, slot, timestamp, metadata, and a serialized snapshot string;
- direct `localStorage.setItem(...)`;
- read-time shape checks and current snapshot-version checks.

The persistence package itself is bare `JSON.stringify(...)` and `JSON.parse(...)`.

There is no candidate generation, durable readback verification, publication pointer, prior verified authority, campaign control record, migration receipt, or correction lineage. UI save success follows the direct storage call.

### 3.4 Current migration and failure

Read-time compatibility currently:

- normalizes legacy run difficulty;
- supplies a default body state when absent;
- synchronizes runtime state;
- rejects obsolete storage prefixes as incompatible;
- rejects malformed current envelopes as corrupt;
- rejects a mismatched snapshot version as incompatible.

This mutates the deserialized in-memory snapshot. It does not publish an accepted migration artifact and does not retain a migration receipt.

## 4. Accepted Minimum Campaign Rules Identity

The minimum live target uses the already accepted campaign-rules semantic version 2 contract:

- `difficultyPreset`: migrated or new-game canonical Difficulty id;
- `worldRules`: `heroic_world`;
- `stakesRules`: `normal_stakes`;
- `stakesPolicyRevision`: `1`;
- typed migration provenance and owner-registered compatibility overrides where required.

Committed and Ironbound registry identities may exist as unavailable static policy entries because version 2 already accepts the three-entry registry. This package must not implement their topology, selection, checkpoints, closure, or UI.

Legacy mapping remains:

| Legacy input | Difficulty | World Rules | Stakes |
| --- | --- | --- | --- |
| missing or invalid | Mortal | Heroic World | Normal Stakes |
| easy | Favored | Heroic World | Normal Stakes |
| normal | Mortal | Heroic World | Normal Stakes |
| hard | Forsaken | Heroic World | Normal Stakes |
| brutal | Forsaken plus typed compatibility provenance | Heroic World | Normal Stakes |

Legacy `hardcore: true` records migration provenance only. It never selects Grim, Committed, or Ironbound and cannot retain automatic HP-zero archival or save deletion.

## 5. Accepted Minimum Identity Graph And Placement

The minimum authoritative graph is:

```text
account
  -> campaign
       -> current continuity
            -> active character
            -> continuation head
            -> accepted artifact
                 -> verified write generation
                 -> authoritative snapshot
                 -> persisted authority ledger
```

Placement decision:

- account identity remains account-owned;
- campaign rules, campaign id, current continuity id, active character id, lineage links, and the authority ledger travel with authoritative campaign state in `SaveSnapshot`;
- `PlayerState.playerId` must equal the authoritative active character id in target-form snapshots;
- artifact, generation, publication, head revision, source artifact, and storage-address binding belong to a save-authority envelope/control record outside the gameplay snapshot;
- account run history and slot metadata remain repairable projections;
- storage keys and slot ids remain addresses only.

Required distinct identities:

- `campaign.<uuid>`;
- `continuity.<uuid>`;
- `character.<uuid>`;
- `save_artifact.<uuid>`;
- `save_generation.<uuid>`;
- `save_publication.<uuid>`;
- request, occurrence, result, consequence, correction, and projection identities under their respective owners.

The exact UUID text is not semantic. Production creation must use `crypto.randomUUID()` or fail closed; it must not fall back to `Math.random`, timestamps, player names, slots, or global sequence.

## 6. New-Game Identity Creation

New campaign creation must:

1. validate character creation;
2. mint one campaign id;
3. mint one initial continuity id;
4. mint one character id;
5. build campaign-rules version 2 with `normal_stakes`;
6. create an empty authority ledger;
7. build the first snapshot;
8. prepare, verify, and publish the first save artifact;
9. update account history and UI projections only after publication.

The same ids survive manual saves, quick saves, storage relocation, copied bytes, restart, and successor participation according to later character/closure rules. A new save address does not mint a campaign.

## 7. Version-6 Migration Identity

Migration must be deterministic and idempotent without pretending that one legacy field is sufficient authority.

The migration owner first groups current active source artifacts using:

- account id;
- the complete matching active account-history record;
- legacy character/player id;
- recorded campaign-start facts;
- the exact normalized legacy rules input;
- the complete normalized source-artifact evidence.

The account-history `startedAt` and legacy player id are evidence inside this owner-certified source group, not standalone campaign identity.

An account-scoped migration receipt stores:

- source-normalization policy version;
- complete normalized source-group evidence;
- source artifact fingerprints and address bindings;
- target campaign, continuity, and character ids;
- per-artifact target ids;
- target campaign-rules identity;
- pending, verified, published, or failed posture;
- failure diagnostics.

The receipt is written once and reused on retry. Random target ids are allowed because the persisted pending receipt makes retry idempotent. Re-entry with materially different evidence under the same lookup key is quarantined rather than merged.

Migration fails closed when:

- account history is missing or contradictory;
- the same legacy character evidence maps to multiple active histories;
- source artifacts disagree on immutable campaign-start facts;
- a purported copy alters identity-bearing evidence;
- archived or deleted history is presented as active;
- target validation or publication fails.

No name, timestamp, tick, slot, sourceRunId, snapshot version, or opaque snapshot hash alone can substitute.

## 8. Minimum Artifact And Publication Contract

The next target envelope revision must separate:

- a storage-address binding;
- a campaign control/head record;
- an identity-bearing save artifact;
- a candidate write generation;
- an authoritative snapshot;
- repairable metadata/index projections.

Minimum accepted ordering:

1. prepare one candidate generation;
2. validate account, campaign, continuity, character, policy, artifact, and source identities;
3. validate snapshot and authority-ledger link integrity;
4. write the candidate under a non-head key;
5. read it back and compare exact stored bytes;
6. run semantic validation on the readback;
7. publish the verified artifact/head pointer;
8. read back and verify publication;
9. retain the prior verified artifact needed for failure recovery;
10. update slot metadata, account history, and UI projections idempotently.

No cryptographic integrity or anti-tamper claim is accepted. Exact readback plus semantic validation is the minimum localStorage verification. A later integrity policy may strengthen it.

Failure behavior:

- candidate write or verification failure leaves the prior head current;
- publication failure leaves the candidate noncontinuable;
- projection failure after publication queues repair and does not roll back gameplay truth;
- the original version-6 source remains untouched until target publication verifies;
- minimum recovery selects only the immediately prior verified compatible artifact within the same account/campaign/continuity/policy;
- UI reports success only after publication verification.

## 9. Minimum Persisted Authority Ledger

The authoritative campaign snapshot must contain an append-only, versioned ledger with separate collections for:

- admitted requests and pre-admission rejection receipts;
- occurrences;
- accepted results;
- owner-specific consequence receipts;
- correction and supersession records.

The ledger is persistence infrastructure, not a command bus, event bus, effect engine, or gameplay resolver.

Common infrastructure may validate:

- stable identity shape and uniqueness;
- campaign, continuity, character, source, and semantic-version links;
- request-to-occurrence, occurrence-to-result, result-to-consequence, and correction lineage;
- status and duplicate-reference integrity.

Only a domain owner defines material inputs, payload meaning, admission, result meaning, consequence application, and correction outcome.

The survey later adds its typed owner records to this ledger. The save foundation must not add survey records, execute the survey, or infer receipts from flags, events, Chronicle, notifications, ticks, hashes, or slots.

For the bounded four-shift survey, retain all request, occurrence, deterministic result, consequence, and correction records for the campaign. No pruning policy is needed.

## 10. Duplicate, Restart, Replay, And Correction

- Duplicate delivery with the same request identity and normalized intent returns retained rejection, admission, result, and consequence status.
- Conflicting intent under one request identity is quarantined.
- Restart and technical recovery restore the ledger exactly and do not invoke a resolver to recreate accepted truth.
- Same-continuity duplicate application retries only missing consequence receipts.
- Normal rollback may select an earlier artifact; a child continuity is created only on the first accepted mutation after loading a non-head artifact.
- A copied artifact retains campaign, continuity, artifact, ledger, and consumed-receipt identity.
- Correction records retain original authority, cause, approval, replacement or reconciliation links, and per-owner status.
- No correction UI or general replay tooling is required by the minimum foundation.

## 11. Current-Save, Copy, And Stale-State Behavior

- Target-form artifacts take precedence over version-6 sources at the same address.
- A successfully migrated version-6 source remains retained as noncontinuable migration evidence until a later cleanup policy accepts removal.
- Byte copies retain the same causal identities.
- A copied artifact under another address is an additional binding, not a new campaign or entitlement.
- A stale artifact may be loaded under Normal only according to policy; loading alone does not fork.
- Ambiguous competing heads are quarantined. Timestamp, slot order, metadata, or UI choice cannot pick authority.
- Corrupt, incompatible, invalid, migration-failed, superseded, and current remain distinct postures.

## 12. Dependency Closure Result

Three mandatory dependencies prevent an implementation package now.

### 12.1 Normal Stakes activation

Campaign-rules version 2 and `normal_stakes` cannot become live while `resolveTerminalArchiveReason(...)` still treats ordinary HP zero as terminal and `archiveActiveRun(...)` deletes saves and settles account value.

The accepted nonterminal fallback, defeat receipt, legacy HP-zero repair, and explicit terminal/nonterminal split must land atomically with campaign-rules activation.

### 12.2 First-mutation continuity admission

Normal creates a child continuity at the first accepted gameplay mutation after loading a non-head artifact, not at load or save.

Current mutation admission is split among engine-owned commands and shell-authored snapshot changes. No accepted owner currently:

- carries loaded artifact/head context into the session;
- detects the first accepted divergent mutation;
- mints one child continuity;
- binds the mutation to that child;
- prevents duplicate forks on later mutations.

Implementing save identities without this gateway would misclassify rollback play.

### 12.3 Account-value publication

`evaluateSnapshotWithAccount(...)` may persist account history and achievement progress from an in-memory snapshot before a manual or quick save publishes that gameplay state.

After Normal rollback, this can allow an abandoned or unsaved continuity to update durable account projections or value before campaign state publication. The save contract requires authoritative campaign publication first, then idempotent account/index consumers.

The next decision must fix the minimum ordering without broad account redesign.

## 13. Exact Next Decision

Run:

`Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`

It must decide:

1. the atomic campaign-rules version 2 plus nonterminal Normal defeat transition;
2. exact loaded-artifact session context;
3. the owner and admission signal for first divergent mutation;
4. child-continuity creation and duplicate-fork prevention;
5. in-memory versus persisted continuity posture;
6. account history, achievement, Legacy, and other account-consumer ordering before and after publication;
7. active legacy HP-zero migration/repair integration;
8. whether one implementation package is then dependency-closed.

## 14. Candidate Later Implementation Surface

No path is authorized yet. A later dependency-closed package is expected to inspect or change a bounded subset of:

- `packages/shared/types/src/contracts.ts`;
- tracked TypeScript/JavaScript mirrors for campaign/save and defeat helpers;
- `packages/shared/persistence/src/index.ts`;
- `packages/shared/persistence/src/index.js`;
- `packages/engines/game-engine/src/save-snapshot.ts`;
- `packages/engines/game-engine/src/save-snapshot.js`;
- `packages/engines/game-engine/src/index.ts`;
- `packages/engines/game-engine/src/index.js`;
- new owner-specific campaign/save identity and Normal defeat modules;
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`;
- `apps/rpg-ui/src/game-shell/state.ts`;
- `apps/rpg-ui/src/App.tsx`;
- focused save, migration, run-lifecycle, defeat, command, and roundtrip tests.

No production dependency is anticipated. Any need for one requires explicit approval.

## 15. Protected Boundaries

- No survey command, receipt, consequence adapter, or UI implementation.
- No Committed or Ironbound topology.
- No checkpoint UI, cloud/offline conflict resolution, encryption, anti-cheat, or broad recovery browser.
- No slot-count or save-browser redesign.
- No actual-death, closure, settlement, succession, estate, or reward redesign.
- No generic command bus, event bus, effect engine, or transaction framework.
- No inference of authority from event, Chronicle, notification, timestamp, tick, hash, slot, or UI state.
- No mutation, merge, rebase, force-update, or deletion of protected branches.
- No unrelated candidate-branch integration.
- No broad workspace typecheck as a gate.

## 16. Explicit Answers

1. **Minimum campaign-rules identity?** Version 2, policy revision 1, canonical Difficulty, `heroic_world`, and `normal_stakes`, with typed migration provenance.
2. **Minimum identities?** Account, campaign, continuity, character, artifact, generation, publication, head revision, and typed authority-record identities.
3. **Placement?** Campaign identity/rules/ledger in authoritative snapshot state; artifact/generation/publication/address authority in save envelope/control state; account history and metadata as projections.
4. **New game?** Mint collision-resistant ids before snapshot creation and publish the first artifact before account/UI success.
5. **Version-6 migration?** One persisted owner-certified migration receipt groups full source evidence and reuses target ids idempotently.
6. **Why not current ids?** They are scoped evidence, projections, addresses, versions, or ordering facts and are collision-prone or causally insufficient.
7. **Publication?** Candidate write, exact readback, semantic validation, pointer publication, publication verification, prior-authority retention, then projections.
8. **Receipt persistence?** One typed append-only authority ledger with separate request, occurrence, result, consequence, and correction collections.
9. **Duplicate/restart?** Return retained authority and retry only missing consumers; never reconstruct from projections.
10. **Correction?** Reserve retained supersession/reconciliation links; no general tooling now.
11. **Compatibility?** Preserve source until verified target publication; quarantine ambiguity; copies retain identity.
12. **Implementation ready?** No; `NO_PACKAGE`.
13. **Next route?** The unversioned dependency-closure decision named in Section 13.
14. **Version assigned?** No.

## 17. Non-Implementation Confirmation

This run changes documentation and coordination only. It does not change shared contracts, engines, persistence, save formats, migrations, tests, dependencies, generated files, UI, account data, content, assets, or gameplay behavior.
