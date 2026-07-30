# Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision

Date: 2026-07-29

Source run: unversioned `Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`

Label class: unversioned decision

Milestone impact: `supports_current_band`

Status: accepted dependency closure; one current-band implementation package authorized for the next run

## 1. Decision

The three dependencies identified by the minimum save decision close through one atomic implementation boundary:

1. campaign-rules semantic version 2 and `normal_stakes` activate with the engine-owned nonterminal defeat resolver and active legacy HP-zero repair;
2. campaign/save authority receives every accepted persisted-snapshot mutation and creates exactly one in-memory child continuity when a non-head artifact first diverges;
3. campaign artifact publication verifies before account history, achievement, Legacy, estate, or preparation/inheritance consumers publish durable value.

Implementation result:

`PACKAGE_READY`

Exact package:

`Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Label class:

`CURRENT_BAND_PRIMARY`

Milestone impact:

`advances_current_band`

`0.7.0` remains `NOT_READY`. This package supplies persistence and lifecycle authority required by the later Ashen Reef loop; it does not implement that loop.

## 2. Why One Atomic Package Is Required

The package is large but coherent. Splitting any of these seams creates a known invalid intermediate state:

- campaign rules without nonterminal defeat preserves automatic archival and save deletion under Normal;
- target save identities without first-mutation admission misclassify rollback play;
- first-mutation admission without verified publication cannot make a child continuity durable safely;
- publication without publication-anchored account consumers allows abandoned branches to grant account value;
- account deferral without retry receipts can lose or duplicate achievements, Legacy, preparation consumption, inheritance use, or retirement settlement;
- version-6 migration without the same target authority can mint conflicting ids or repeat HP-zero repair.

No generic command bus, transaction framework, replay service, cloud system, checkpoint browser, or account redesign is required.

## 3. Repository And Branch Baseline

- Starting commit: `d026befa13f25437b07187d36833bbd3a9db0eca`.
- Branch: `master`.
- Upstream: `origin/master`.
- Worktree began clean and synchronized.
- `git fetch --all --prune` completed before inspection.
- One local branch exists: `master`.
- Seventeen non-default remote branches exist.
- One open pull request exists: PR #2, `main-menu-asset-contract-pass`; it remains non-mergeable, unrelated, and `SUPERSEDED_PRESERVE_EVIDENCE`.
- The two protected references remain read-only.
- Twelve one-document audit branches remain candidates at their registered triggers.
- No branch contains a directly reusable campaign/save/continuity implementation.
- No merge, cherry-pick, rebase, PR closure, or branch deletion is due inside this documentation-only decision.

The protected `0.7.0` readiness audit agrees that save identity/publication and nonterminal HP-zero behavior remain prerequisites. Its old queue is historical and does not override this decision.

## 4. Reproduced Live Mutation Matrix

All persisted in-game snapshot changes converge on `GameSessionContext.updateSnapshot(...)`, then `App.tsx` `onSnapshotChange(...)`.

| Mutation family | Current admission | Current UI application | Target admission posture |
| --- | --- | --- | --- |
| player travel | engine result has `accepted` | applied only when accepted | pass stable accepted-result correlation to campaign session authority |
| quest acceptance | engine result has `accepted` | applied only when accepted | same |
| quest tracking | engine result has `accepted` | applied only when accepted | same |
| activity selection | engine result has `accepted` | applied only when accepted | same |
| activity advancement | shell helper returns source snapshot on rejection | UI always calls update | temporary bridge marks accepted only when returned snapshot differs by identity |
| settlement rest | shell helper returns source snapshot on rejection | UI always calls update | same temporary bridge |
| quest turn-in | shell helper returns source snapshot on rejection | UI always calls update | same temporary bridge |
| equip, unequip, consume | feature helpers return result snapshots | UI always calls update | temporary bridge supplies explicit accepted/no-change posture |
| favorite and pin changes | UI-authored persisted snapshot preference | UI always calls update | accepted persisted-snapshot mutation; it participates in divergence while stored inside the authoritative snapshot |

Rejected/no-change submissions must not:

- create a continuity;
- change the session revision;
- evaluate or persist achievements;
- trigger defeat;
- mark the session dirty;
- create an artifact or publication.

Saving, quick-saving, loading, rendering, dismissing a transient toast, opening a panel, or returning to a menu is not an accepted snapshot mutation.

## 5. Campaign Session Authority

Add one campaign/save-owned session controller. It is a narrow admission and provenance boundary, not a command bus.

The minimum runtime session context retains:

```ts
type CampaignSessionControl = {
  accountId: string;
  campaignId: string;
  loadedArtifactId: string;
  loadedPublicationId: string;
  loadedHeadRevision: number;
  loadedContinuityId: string;
  campaignHeadArtifactId: string;
  campaignHeadRevision: number;
  posture: "at_head" | "non_head_unmutated" | "forked_unpublished" | "head_unpublished";
  pendingContinuityId: string | null;
  firstDivergentMutationId: string | null;
  lastAcceptedMutationId: string | null;
  hasUnpublishedGameplayState: boolean;
};
```

This context is carried in `IN_GAME` shell state beside the snapshot. Loaded artifact/head facts come only from verified save authority. UI selection, slot order, timestamps, and snapshot object identity cannot invent them.

Every persisted-snapshot submission supplies:

- one stable mutation-submission id;
- source artifact and session revision;
- owner/bridge kind;
- accepted or rejected posture;
- source snapshot reference;
- proposed next snapshot;
- engine command/result identity when available.

Engine-owned command bridges preserve their existing accepted discriminator. Temporary shell bridges mint one collision-safe submission id before invoking the legacy helper and treat the original snapshot reference as rejection/no-change. Tests must lock that temporary convention until each legacy owner receives its own result contract.

## 6. First-Mutation Continuity Algorithm

Loading does not fork.

Saving an unchanged loaded artifact does not fork and does not advance a different campaign head. It may create another address binding to the same verified artifact.

For one accepted persisted-snapshot mutation:

1. validate account, campaign, loaded artifact, current campaign-control head, source revision, and mutation id;
2. return the retained result for a duplicate mutation id;
3. reject a stale source revision without mutation;
4. when posture is `at_head`, retain the current continuity and move to `head_unpublished`;
5. when posture is `non_head_unmutated`, mint exactly one child continuity id before applying the proposed mutation;
6. set the child parent to the loaded artifact's continuity and record `forkedFromArtifactId`, `forkedFromPublicationId`, and `firstDivergentMutationId`;
7. rewrite the accepted proposed snapshot to the child continuity and move to `forked_unpublished`;
8. retain the same child for every later accepted mutation in that session;
9. never mint another child for a duplicate or later mutation;
10. make the child durable only when a verified save artifact containing it is published.

If the player exits without publishing:

- the child continuity and its unsaved mutations disappear;
- no durable account projection or value remains;
- the source artifact and campaign head are unchanged.

If id generation fails, the mutation fails closed before application. Production ids use `crypto.randomUUID()` with no timestamp, name, slot, sequence, or `Math.random()` fallback.

## 7. Save And Publication Interaction

### 7.1 At-head or forked unpublished state

Manual or quick save:

1. freezes the accepted in-memory snapshot;
2. prepares character-owned achievement changes in that snapshot;
3. prepares an idempotent account-consumer plan keyed by the future publication id without writing it;
4. writes and reads back a non-head candidate generation;
5. validates target snapshot, campaign/continuity lineage, authority-ledger links, source session revision, and candidate bytes;
6. publishes the artifact as campaign head;
7. reads back and verifies the head publication;
8. marks the in-memory child durable when applicable;
9. applies the account-consumer plan idempotently;
10. repairs address metadata and UI projections;
11. reports save success after publication verification, with a repair warning if a post-publication projection remains pending.

### 7.2 Non-head unchanged state

Saving before any accepted mutation:

- does not create a child continuity;
- does not replace the campaign head;
- binds the selected manual/quick address to the already verified loaded artifact;
- preserves the session as `non_head_unmutated`;
- creates no account-value consumer.

### 7.3 Failure

- Candidate or verification failure leaves the prior head and source address intact.
- Publication failure leaves the candidate noncontinuable.
- Account-consumer failure after publication records a pending repair against the publication; it never rolls back gameplay truth.
- Retry uses the same publication and consumer ids.
- A newer save cannot duplicate an older pending account consumer.

## 8. Account Publication Contract

### 8.1 Campaign-owned truth before publication

The following remain campaign/snapshot truth and may exist in unsaved memory:

- character achievement unlocks;
- character state, progress, inventory, currency, standing, reputation, Chronicle, and receipts;
- pending child-continuity identity;
- Normal defeat result and receipt.

### 8.2 Publication-anchored account consumers

The following durable writes occur only after a verified campaign publication:

- active run-history upsert and slot/address projection;
- account metric high-water updates;
- account achievement unlocks;
- Legacy reward transactions;
- selected preparation consumption;
- retired-source inheritance-use decrement;
- retirement outcome, payout metadata, Legacy settlement, and estate deposit;
- account `lastPlayedAt` and related indexes.

Account profiles gain stable applied/pending campaign-publication consumer receipts. A consumer id is derived from the stable publication id plus a registered consumer kind, not from wall-clock time or array position.

Each consumer:

- validates its source publication and campaign/continuity/character identity;
- applies once;
- returns its retained receipt on retry;
- rejects conflicting payload under the same id;
- cannot consume an unpublished snapshot.

### 8.3 Unsaved gameplay

Ordinary accepted gameplay remains unsaved until manual or quick save.

During that interval:

- no account profile is written;
- account achievements and Legacy are not granted durably;
- account history is not advanced from the unsaved state;
- UI may show character truth and an explicitly provisional account preview, but the first package does not require that preview;
- returning to the menu discards unsaved campaign state and any provisional calculation.

This intentionally replaces the current `evaluateSnapshotWithAccount(...)` persistence on every snapshot change.

## 9. New-Game Ordering

New game uses one publication-anchored account plan:

1. validate creation and current account inputs;
2. mint campaign, initial continuity, character, artifact, generation, and publication ids;
3. create campaign rules version 2 with `normal_stakes`;
4. create the empty authority ledger;
5. apply selected Legacy preparations to the candidate snapshot;
6. prepare stable post-publication consumers for active history, preparation consumption, and optional retired-source inheritance use;
7. publish and verify the first campaign artifact;
8. apply those consumers idempotently;
9. enter play only after mandatory consumption consumers succeed;
10. if account persistence fails, retain the published campaign as `account_repair_pending`, block ordinary entry and further preparation use, and retry from its publication receipt.

Startup and account-selection paths must repair mandatory pending new-game consumers before exposing preparation selection again. This prevents a failed post-publication account write from duplicating preparation or inheritance value.

## 10. Normal Stakes Defeat Activation

Campaign rules version 2 and the defeat resolver land together.

For an accepted mutation whose resulting player HP is zero:

1. continuity admission occurs first;
2. one engine-owned Normal defeat occurrence/result is resolved against that admitted continuity;
3. active encounter and transient combat bindings clear;
4. destination resolves in the accepted order: explicit context destination, current validated settlement, campaign-start settlement, or `recovery_pending`;
5. an applied playable fallback advances four ticks, matching the existing bounded settlement-rest interval;
6. HP becomes `min(maxHP, max(1, ceil(maxHP * 0.25)))`;
7. Stamina becomes `min(maxStamina, max(currentStamina, 12))`, using the smallest current nonzero travel requirement;
8. MP and body state remain unchanged;
9. inventory, equipment, currency, quests, party membership, attributes, injury, trauma, and permanent truth remain unchanged;
10. one Chronicle projection and notice are produced from the retained result;
11. the accepted resolved snapshot remains unsaved unless the player later saves.

If maximum Stamina is below 12, it restores to that maximum. `recovery_pending` makes no invented relocation and blocks ordinary gameplay without becoming terminal.

Duplicate source mutation/defeat identity returns the retained result and cannot advance time, restore resources, relocate, or project Chronicle twice.

`resolveTerminalArchiveReason(...)` no longer interprets ordinary HP zero as death under target campaign rules. Historical archived records remain unchanged.

## 11. Active Version-6 Migration And HP-Zero Repair

The storage target is envelope version 7. This number is a storage-schema revision, not workflow version `0.7`.

The target snapshot format identity is `lineage.save_snapshot.v2`; it is a save-format identifier rather than the workflow label. Version-6 snapshots with legacy `snapshotVersion: "0.6.0"` remain migration inputs.

Migration:

1. blocks archived/deleted history first;
2. groups source artifacts through the complete active history record, account id, legacy player id, start facts, rules input, and source fingerprints;
3. writes or reuses one pending migration receipt containing all target ids;
4. selects an initial legacy head only when:
   - exactly one artifact exists in the source group; or
   - exactly one grouped artifact's envelope `savedAt` matches the account profile's certified `lastPlayedAt`;
5. quarantines a multi-artifact group without that unique owner-certified match;
6. migrates legacy difficulty exactly to campaign rules version 2 Normal;
7. rekeys the active history projection from legacy player id to the target character id only after target publication;
8. preserves the original version-6 bytes.

Timestamp never selects authority alone. It is accepted only as an exact match to the account owner's persisted last-publication projection inside a fully validated source group.

For an active loaded HP-zero source:

1. run the same campaign migration;
2. resolve one `unknown_or_legacy` Normal defeat receipt;
3. publish and verify the repaired target artifact at the same address;
4. if the source was the certified legacy head, publish the repaired artifact as head;
5. if the source was non-head, retain the campaign head and publish only a repaired non-head artifact binding;
6. apply account projections after artifact publication;
7. enter ordinary play only after mandatory migration/repair consumers succeed.

The repair does not create a child continuity because it is owner-certified migration correction, not player divergence. The first later accepted mutation from a repaired non-head artifact creates the child.

## 12. Explicit Retirement

Retirement remains explicit, terminal, and player-confirmed.

Before existing payout, estate, history, and slot cleanup:

1. prepare one explicit retirement closure result;
2. publish and verify the terminal campaign artifact/control state;
3. apply the existing account retirement, payout, Legacy, and estate behavior through publication-keyed idempotent consumers;
4. remove player-continuable address bindings only after mandatory consumers succeed;
5. retain hidden closed authority needed for duplicate prevention and audit.

No ordinary HP-zero path can call this transition.

This ordering changes authority and retry safety, not retirement balance, inheritance uses, payout rules, estate contents, or presentation wording.

## 13. Failure, Restart, Copy, Stale, And Correction Matrix

| Case | Required result |
| --- | --- |
| load current head | enter `at_head`; no fork |
| load older verified artifact | enter `non_head_unmutated`; no fork |
| first accepted mutation from older artifact | one in-memory child; one stable first-mutation link |
| rejected or duplicate mutation | no new child or state |
| exit before save | discard child and provisional account work |
| save child | verify artifact/head, then account consumers |
| save unchanged older artifact | address binding only; no head change |
| candidate failure | prior head/source retained |
| account projection failure | published gameplay retained; stable repair pending |
| restart with pending consumer | retry same consumer id before duplicable value is exposed |
| copied target artifact | preserve embedded identities and consumed receipts |
| copied legacy artifact | source fingerprint joins the same migration evidence; ambiguity quarantines |
| stale session save | reject before candidate publication |
| conflicting campaign head | quarantine; no timestamp/slot/UI winner |
| correction | append correction/supersession lineage; no silent rewrite |

## 14. Exact Implementation Surface

Authorized production paths are limited to the smallest coherent subset of:

- `packages/shared/types/src/contracts.ts`;
- `packages/shared/persistence/src/index.ts`;
- `packages/shared/persistence/src/index.js`;
- `packages/engines/game-engine/src/save-snapshot.ts`;
- `packages/engines/game-engine/src/save-snapshot.js`;
- `packages/engines/game-engine/src/index.ts`;
- `packages/engines/game-engine/src/index.js`;
- new tracked TypeScript/JavaScript mirrors for campaign rules, campaign save authority, account publication consumers, and Normal defeat;
- `packages/engines/game-engine/src/achievements.ts` and `.js` only to separate character preparation from publication-anchored account application;
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`;
- `apps/rpg-ui/src/game-shell/state.ts`;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts` only for mutation-correlation passthrough and legacy accepted/no-change bridging;
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`;
- `apps/rpg-ui/src/game-shell/InGameShell.tsx`;
- `apps/rpg-ui/src/features/WorldPanel.tsx`;
- `apps/rpg-ui/src/features/QuestsPanel.tsx`;
- `apps/rpg-ui/src/features/ActivityPanel.tsx`;
- `apps/rpg-ui/src/features/CharacterPanel.tsx`;
- `apps/rpg-ui/src/App.tsx`;
- focused existing and new save, migration, publication, continuity, defeat, account, lifecycle, command-bridge, and roundtrip tests.

The implementation may omit a listed path when unnecessary. It may add a narrowly named owner module or test beside these paths. Any production path outside this surface requires a fail-closed scope decision.

No production dependency is authorized.

## 15. Required Implementation Tests

The `0.6.9` package must prove:

- new-game version-7 publication and deterministic target roundtrip;
- every legacy difficulty mapping and legacy Hardcore-to-Normal provenance;
- idempotent migration receipt and stable target ids across retry;
- unique legacy-head certification and ambiguous-group quarantine;
- source-byte retention on migration/publication failure;
- current-head load with no fork;
- non-head load with no fork;
- first accepted engine command creates exactly one child;
- first accepted legacy bridge mutation creates exactly one child;
- pin/favorite persisted mutations follow the same divergence rule;
- rejected/no-change/duplicate/stale submissions create no child;
- later mutations reuse the in-memory child;
- unsaved child exit creates no durable account change;
- unchanged non-head save does not advance campaign head;
- candidate/readback/publication failure retains prior authority;
- account projection applies only after publication and once per consumer id;
- pending account consumers repair on restart without duplicate Legacy/preparation/inheritance use;
- ordinary combat and noncombat HP zero resolve nonterminally;
- defeat clears encounter bindings, advances exactly four ticks, restores accepted HP/Stamina, preserves MP/body state and protected truth, and creates one receipt/projection;
- duplicate defeat is idempotent;
- ordinary defeat creates no automatic save;
- active legacy HP-zero repairs once in the loaded slot;
- non-head legacy repair does not replace campaign head;
- repair failure blocks entry without archival/deletion;
- archived/deleted history remains blocked;
- explicit retirement publishes closure before existing account settlement and stays idempotent;
- no ordinary HP-zero path grants Legacy, deposits estate, archives history, or deletes saves;
- manual and quick-save addresses remain available;
- copied artifacts retain causal identity;
- TypeScript/JavaScript mirrors remain aligned;
- existing travel, quest acceptance/tracking, activity selection, save/account, lifecycle, achievement, and combat focused suites remain green.

## 16. Protected Boundaries

- No Ashen Reef survey command or survey receipt.
- No quest turn-in authority rewrite beyond temporary mutation admission metadata.
- No Committed or Ironbound implementation.
- No player checkpoint selection or save-browser redesign.
- No actual death, succession, resurrection, injury, trauma, care, or estate redesign.
- No Story or Grim availability.
- No generic bus, transaction framework, effect engine, replay service, or cloud merge.
- No encryption, anti-cheat, telemetry, or production dependency.
- No content, schema catalog, asset, generated-output, or broad UI redesign.
- No broad workspace typecheck as an acceptance gate.
- No protected-branch mutation or unrelated candidate-branch integration.

## 17. Version Classification

`Version 0.6.9 - Normal Stakes Campaign Persistence Foundation` is a three-segment primary because it materially adds and activates:

- canonical campaign and continuity identity;
- verified authoritative save publication;
- legacy migration;
- Normal nonterminal defeat;
- rollback-continuity admission;
- publication-anchored account-value safety.

It remains inside `0.6.x` because it does not provide the engine-owned consequence-bearing survey advancement loop, full typed owner consequences, accepted-only survey UI, or representative end-to-end integration required for `0.7.0`.

No support suffix is appropriate because this is not an audit, repair, retry, or parent-specific clarification.

## 18. Exact Next Run

Run:

`Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Classification:

`CURRENT_BAND_PRIMARY`

Milestone impact:

`advances_current_band`

Suggested commit:

`feat(save): add Normal campaign persistence authority`

## 19. Non-Implementation Confirmation

This decision changes documentation and coordination only. It does not change shared contracts, engines, persistence, migrations, tests, dependencies, generated files, UI, account data, content, assets, or gameplay behavior.
