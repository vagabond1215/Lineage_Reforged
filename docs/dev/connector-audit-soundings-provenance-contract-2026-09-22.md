# Connector Audit — Soundings Accepted Admission Provenance Contract

Date: 2026-09-22

Source head: `45356195d9556d31968fb05c4fb790ccb79a5f4d`

Repository: `vagabond1215/Lineage_Reforged` only.

Posture: Connector-safe static repository audit. No local worktree, tests, browser execution, production mutation, schema mutation, or acceptance claim.

## 1. Purpose

Resolve the documentation-only questions installed by `Soundings Accepted Admission Provenance And Retention Contract Decision` far enough to determine whether a bounded repair can be authorized without another discovery-heavy Codex run.

The active F1 remains the September 20/22 retained-source provenance defect: a completed Soundings request can be rewritten together with its self-contained source/canonical/result/receipt facts and still survive restart/duplicate classification. The September 22 retention probe additionally proves that the exact legitimate pre-submission source can be unpublished and therefore absent from immutable campaign artifacts.

## 2. Fresh Hosted Posture

Hosted `master` at audit start: `45356195d9556d31968fb05c4fb790ccb79a5f4d`.

Hosted branches: four total — `master`, `prep/integrated-gameplay-0-7-readiness-audit`, `parallel/prompt-packaging-integrity-audit`, and `admin/genesis-research-evidence-2026-08-13`.

Open pull requests: zero.

The three non-default refs retain their existing protected/held dispositions and do not supply runtime authority for this decision.

## 3. Evidence Reconciled

The audit inspected:

- `docs/design/soundings-source-provenance-contract-gate.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `packages/engines/game-engine/src/campaign-session.ts`;
- `packages/engines/game-engine/src/soundings-turn-in-authority.ts`;
- `packages/shared/types/src/contracts.ts`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`;
- `packages/engines/game-engine/src/account-publication.ts`;
- the accepted `Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`.

Relevant established facts:

1. campaign admission already verifies the exact source snapshot/control while the mutation is prepared and committed;
2. `CampaignSessionControl.retainedMutationResults` is trustworthy only for the current session and is reconstructed empty after publication/load;
3. the legitimate turn-in source may be newer than the loaded artifact because ordinary return travel can remain unpublished before submission;
4. save publication already uses candidate verification, a `StoredPublicationRecovery` journal, stable artifact/publication identities, exact readback, and post-publication recovery semantics;
5. account profile storage is physically separate and already has publication consumer receipts, but those receipts are publication-keyed payload fingerprints rather than structured quest-specific original-admission evidence;
6. the existing Soundings authority remains self-contained inside the mutable campaign snapshot and therefore cannot independently certify its own original before-state.

## 4. Option Audit

### Option A — another digest inside the Soundings request or authority ledger

Rejected.

A digest stored beside the same mutable retained source remains replaceable with that source. It does not add an independent owner and directly repeats F1.

### Option B — require the retained source to equal the loaded artifact

Rejected.

The September 22 retention probe proves an ordinary valid turn-in source can be Starfall tick 16/session revision 5 while the loaded immutable artifact is Ashen Reef tick 12/revision 4. Equality would reject correct ordinary play.

### Option C — infer original authority from the current/latest completion publication

Rejected as the sole contract.

The completion publication proves what was published after acceptance. Without separately retained admission evidence it does not prove that the source fields now embedded in the completed request are the source fields originally admitted. Historical publication selection is also not a complete replay log.

### Option D — reuse account publication consumer receipts as-is

Rejected as-is; useful precedent only.

The account consumer mechanism demonstrates idempotent publication-anchored external persistence and conflict detection, but its current receipt retains only a payload fingerprint plus publication/campaign/continuity/character metadata. It does not independently retain the original Soundings source facts needed to defeat F1. Extending account-wide value/profile ownership for this one quest would also be broader than necessary.

### Option E — dedicated save-owned Soundings accepted-admission witness

Selected.

Add one compact quest-specific witness outside the campaign snapshot, owned by the existing save/campaign persistence boundary and keyed by campaign + Soundings request identity. Create its candidate from verified campaign preparation/admission, not from a later completed snapshot. Carry it transiently with the session until first publication, then durably retain it under a separate save-storage key using the existing publication-recovery ordering.

This supplies a second owner without introducing signing, remote trust, anti-cheat infrastructure, a generic wallet ledger, or a generic mutation-history service.

## 5. Accepted Witness Contract Recommended By Audit

### 5.1 Owner and address

Owner: campaign save/persistence authority (`saveManager` boundary), not the quest snapshot ledger and not account-value ownership.

Stable logical address:

`accountId + campaignId + requestId`

Illustrative physical key:

`cataclysm-rpg-ui.saves.v7.account.<account>.campaign.<campaign>.soundings-admission.<request>`

The exact key spelling is implementation detail, but the record must be separate from the mutable snapshot/artifact bytes.

### 5.2 Minimum retained facts

One versioned witness must bind at minimum:

- witness id and Soundings request id;
- account id;
- campaign id;
- character id;
- quest id;
- source artifact id;
- source publication id;
- source session revision;
- source continuity id;
- accepted continuity id;
- original source-snapshot fingerprint;
- original survey fingerprint;
- original canonical-intent fingerprint;
- occurrence id;
- result id;
- accepted tick;
- first durable artifact id;
- first durable publication id;
- first durable head revision.

The witness should retain hashes/identities, not a second full survey graph or full source snapshot.

### 5.3 Independence boundary

The claim is bounded local-owner independence:

- changing the campaign snapshot or republishing a modified copy cannot rewrite the already applied witness through the ordinary campaign-snapshot path;
- witness writes are accepted only through the save/publication owner from verified preparation/admission;
- arbitrary coordinated replacement of all local storage, browser compromise, signing, or remote attestation is outside scope.

## 6. Creation And Publication Ordering

### 6.1 In-session acceptance

Campaign admission creates a quest-specific **pending witness candidate** directly from the already verified preparation plus accepted result identity.

The smallest session shape is quest-specific, e.g. one optional `pendingSoundingsAdmissionWitness`, rather than a new generic transaction framework.

Before the first save, same-session duplicate logic may use the verified pending witness plus existing retained campaign mutation result.

### 6.2 First durable publication

The first publication after accepted turn-in must coordinate the witness with the existing publication-recovery journal.

Required ordering:

1. validate current session control and pending witness candidate;
2. mint target artifact/publication/revision identities;
3. write and exact-readback the candidate artifact;
4. write publication recovery containing the exact pending witness payload/fingerprint and target publication identities;
5. write/verify a **pending** witness record under its stable address; a pending record is not trusted acceptance evidence;
6. publish/verify artifact and campaign head using existing save authority;
7. promote the exact pending witness to **applied**, binding the target first-durable artifact/publication/revision, then exact-readback it;
8. complete remaining publication/address work and clear recovery only when the witness is applied or when the publication contains no new provenance-required Soundings admission.

A collision at the stable witness address with different original facts is a hard conflict and must fail before replacing accepted evidence.

### 6.3 Crash/retry

- pending witness + no published head: may be removed/replaced only through matching recovery or treated as orphan pending evidence; never accepted as proof;
- published head + matching pending witness/recovery: startup publication recovery must finish witness promotion before ordinary provenance-dependent retry/repair is exposed;
- applied matching witness: publication/save retry is idempotent;
- applied conflicting witness: fail closed; do not rewrite it from the campaign snapshot.

The head need not be rolled back after a post-head crash. Existing publication policy already treats post-publication consumer recovery as forward repair. The new requirement is that a provenance-required completed Soundings publication cannot be treated as fully recovered for trusted retry/repair until its witness is applied.

## 7. Verification Context

Keep structural snapshot validation separate from independent admission verification.

### Structural validator

`isTargetCampaignSnapshot` / the existing Soundings authority validator may continue to establish internal snapshot coherence and legacy compatibility.

### Trust-sensitive validator

Add one narrow verification operation receiving the completed snapshot plus a persistence-supplied witness context. It must compare the immutable witness to the retained request/result and reconstructed source before any of these operations are trusted:

- durable duplicate classification after cache loss/restart;
- completion projection repair;
- first or later publication that claims provenance-required Soundings authority;
- any future mutation that relies specifically on the original Soundings turn-in admission.

Pure engine code must not query browser storage itself. `saveManager`/runtime load supplies the verification context through a typed boundary.

## 8. Version And Existing-Save Compatibility

### 8.1 Existing completed saves

Existing Soundings completion authority created before this repair remains valid as **legacy version-1 completed state** for load and continued play.

Do not:

- delete or invalidate the save merely because no independent witness exists;
- synthesize a trusted witness from the mutable request/result;
- replay payment;
- retroactively rewrite its original ledger.

Without an independently retained witness, legacy completion is **not eligible for trusted historical duplicate/projection-repair claims**. A retry should return a deterministic non-mutating legacy/unverifiable-completion posture rather than minting payment, repairing from unverified history, or pretending independent provenance exists.

Later unrelated gameplay and saves remain allowed.

### 8.2 New repaired completions

New Soundings completions after the repair should use a provenance-required authority revision/posture distinguishable from legacy v1. A narrow Soundings-authority version increment or explicit provenance-version field is acceptable; no `worldVersion` or game-version change follows automatically.

For a provenance-required completion, a missing/conflicting witness after recovery attempts is corruption/incomplete-publication evidence and must fail closed for trusted retry/repair. Do not silently downgrade it to legacy.

### 8.3 No migration requirement

This contract does not require eager migration of old completed saves. Backward compatibility is behavioral: legacy saves remain loadable/playable; only provenance-dependent historical operations remain unavailable without independent evidence.

## 9. Retention Across Later State

The applied witness is immutable for the life of the campaign/request and survives:

- later accepted travel and unrelated mutations;
- later wallet spending or earnings;
- later publications;
- non-head first submission and descendant continuity forks;
- Normal defeat/recovery changes;
- caller-cache loss and restart.

Validation compares witness-bound original facts to the retained Soundings authority, not the latest wallet or latest source snapshot.

Current continuity may be a descendant of the accepted continuity under existing campaign lineage rules. The witness itself is not rewritten merely because later continuity changes.

## 10. Storage Bound

The witness is intentionally compact: identities plus hashes and first-durable publication facts. It does not duplicate the retained survey graph or source snapshot.

The bounded 5 MiB ordinary-sequence requirement remains controlling and must be reproved by Codex after implementation, but static inspection finds no reason to introduce another repeated-graph storage failure.

## 11. Executable Repair Matrix Prepared For Codex

The bounded repair must prove at minimum:

1. original F1 wallet 16 -> 116 rewrite rejects before duplicate/publication/repair;
2. nonexistent source artifact/publication rewrite rejects;
3. conflicting witness under the same request rejects unchanged;
4. missing witness for a new provenance-required completion fails closed after recovery attempt;
5. same-session pre-save legitimate duplicate remains idempotent;
6. cache-loss/restart legitimate duplicate succeeds only with matching applied witness;
7. semantic object-key reordering remains equivalent;
8. changed semantic intent remains conflict;
9. later legitimate spending/earnings does not invalidate historical duplicate;
10. non-head submission/fork survives;
11. defeat/recovery and later descendant continuity preserve witness validity;
12. absent-witness legacy completed save loads and continues play without payment replay or synthetic repair;
13. seven receipts, exact 5g/0s and all excluded reward owners remain unchanged;
14. survey authority/Stormglass remain unchanged;
15. compact storage remains below the existing bounded ordinary-sequence cap;
16. post-repair independent audit remains separate and must complete the remaining A/B/C/D matrix.

## 12. Connector Disposition

All six provenance-contract rows are decision-complete from current repository evidence.

Recommended decision disposition:

`PROVENANCE_CONTRACT_ACCEPTED_REPAIR_AUTHORIZED`

No product/canon question needs user input to authorize the narrow repair. The meaningful compatibility choice can satisfy both constraints simultaneously: preserve legacy completed saves for continued play while refusing to manufacture independent historical provenance they never retained.

No production repair or executable acceptance is claimed by this Connector audit.
