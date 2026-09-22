# Soundings Accepted Admission Provenance And Retention Contract Decision

Date: 2026-09-22

Disposition: **`PROVENANCE_CONTRACT_ACCEPTED_REPAIR_AUTHORIZED`**

Label class: unversioned documentation-only technical contract decision.

Development milestone impact: `none`.

Game-version impact: `none`.

Game: `0.1.0-prealpha`.

Playability: `INTEGRATED_LOOP`.

Accepted development milestone: `DEV-0.7.0`; current band: `DEV-0.7.x`.

Source runtime remains `af0954c294d222bc1f8667266e4549b8619d5484`. F1 remains production-unrepaired until the separately installed implementation runs.

Controlling predecessor evidence:

- `docs/design/soundings-durable-completion-independent-acceptance-audit.md` — `REPAIR_REQUIRED`, F1;
- `docs/design/soundings-source-provenance-contract-gate.md` — `PROVENANCE_CONTRACT_REQUIRED`;
- `docs/dev/connector-audit-soundings-provenance-contract-2026-09-22.md` — Connector-safe option/ownership audit;
- accepted Soundings authored terms and quest-turn-in owner contract.

## 1. Decision

Authorize one bounded repair using a **quest-specific accepted-admission witness owned by campaign save/persistence authority and stored independently from the mutable campaign snapshot**.

Do not solve F1 with:

- another digest adjacent to the mutable Soundings request;
- equality with the loaded artifact;
- latest-wallet equality;
- inference from the completed request alone;
- account-wide generic transaction/wallet infrastructure;
- signing, remote attestation, cloud trust, or anti-cheat architecture.

The accepted independence claim is local and owner-bounded: the ordinary campaign-snapshot path cannot rewrite the applied witness. Coordinated arbitrary replacement of all local storage remains outside scope.

## 2. Ownership And Address

### Runtime preparation owner

Existing campaign admission remains responsible for proving the source at acceptance time.

The verified Soundings preparation plus accepted result creates exactly one **pending witness candidate**.

### Durable owner

`saveManager` / campaign save-publication authority owns durable retention, lookup, collision handling, publication recovery, and load-time delivery of witness context.

The witness is not part of:

- `CampaignAuthorityLedgerState.soundingsTurnIn`;
- the survey ledger;
- account-value/Legacy ownership;
- quest presentation.

### Stable identity

Exactly one witness may exist for:

`accountId + campaignId + requestId`

A duplicate with identical facts is idempotent. A record at the same address with conflicting facts is a hard provenance conflict and may not be overwritten from snapshot data.

## 3. Witness Schema Contract

Add one narrow versioned witness contract, with exact implementation naming left to repository conventions.

Minimum fields:

- `version: 1`;
- stable witness id;
- Soundings request id;
- account id;
- campaign id;
- character id;
- quest id `quest.ashen_reef_survey`;
- source artifact id;
- source publication id;
- source session revision;
- source continuity id;
- accepted continuity id;
- original source-snapshot fingerprint;
- original survey fingerprint;
- canonical-intent fingerprint;
- occurrence id;
- result id;
- accepted tick;
- first durable artifact id;
- first durable publication id;
- first durable head revision;
- durable posture sufficient to distinguish pending from applied storage records.

Do not retain a second full survey graph or second full source snapshot.

The source-snapshot fingerprint must be created from the verified source/preparation before the completed request becomes the only remaining snapshot-side copy.

## 4. Session Contract

The smallest accepted session addition is quest-specific rather than generic.

`CampaignSessionControl` may carry one optional pending Soundings admission-witness candidate, or an equivalently narrow typed field.

The candidate is created during successful prepared campaign admission from independently verified inputs. It may not be reconstructed later from the completed request/result as a substitute for the original preparation.

Before first save:

- same-session legitimate retries may use current retained mutation authority plus the pending witness candidate;
- conflicting reuse still rejects;
- abandoning unsaved gameplay abandons the pending witness with the unsaved completion, consistent with existing unsaved-gameplay semantics.

## 5. First-Publication Contract

The accepted witness becomes durable through the existing save-publication/recovery boundary.

Required ordering for a publication containing a newly accepted provenance-required Soundings completion:

1. validate source snapshot, session control, pending witness candidate, campaign head, and request uniqueness;
2. mint target artifact/generation/publication/revision ids;
3. create and exact-readback the normal candidate artifact;
4. persist publication recovery containing the exact witness candidate/fingerprint and target publication facts;
5. write and exact-readback a **pending** witness record at its stable address;
6. publish/verify the campaign artifact and campaign head through existing save authority;
7. promote the exact pending witness to **applied** with first-durable artifact/publication/revision facts and exact-readback it;
8. complete ordinary address/consumer recovery;
9. clear recovery / report fully successful publication only after required witness durability is satisfied.

A pending witness is never trusted evidence of accepted durable completion.

This is a narrow extension of existing candidate/head/publication-recovery ordering, not a new transaction framework.

## 6. Crash And Retry Contract

### Before head publication

A matching pending witness may be resumed or discarded only under the matching publication recovery attempt. It cannot authorize historical duplicate or projection repair.

### After head publication but before witness promotion

The published artifact remains gameplay truth, but startup publication recovery must finish or explicitly fail witness promotion before provenance-dependent Soundings operations are exposed.

Do not silently infer the witness from the now-published completed request.

### Applied witness

Exact retry is idempotent.

A conflicting applied witness is immutable conflict evidence and fails closed.

## 7. Verification Context Contract

Keep two distinct validation levels.

### 7.1 Structural snapshot validation

Existing target-campaign / Soundings internal validation continues to establish snapshot shape, deep self-consistency, lineage compatibility, and legacy-save loadability.

It is not independent provenance proof.

### 7.2 Provenance verification

Add a narrow typed verification operation supplied with:

- the completed snapshot/authority;
- either the verified pending session witness for pre-publication same-session use, or the applied durable witness supplied by save/load authority.

It must independently compare the witness to the retained Soundings request/result/source reconstruction.

A matching witness is required before a **provenance-required** completion can support:

- restart/cache-loss durable duplicate classification;
- completion projection repair;
- publication/republication paths that claim trusted post-contract Soundings admission;
- any later behavior whose correctness depends on the original turn-in source.

Pure engine code must not read browser/local storage directly. Persistence supplies a typed witness context.

## 8. Binding Rules

The applied witness must bind at least:

- exact request identity;
- account/campaign/character identity;
- source artifact and publication identities;
- source session revision;
- source and accepted continuity;
- original before-state fingerprint;
- survey fingerprint;
- canonical intent fingerprint;
- occurrence/result identities;
- accepted tick;
- first durable publication identity.

Current snapshot continuity may later be a valid descendant under existing campaign lineage authority. That does not rewrite the witness.

Later wallet changes are irrelevant to historical witness validity. Never compare the latest wallet directly to historical receipt-after state.

## 9. Soundings Authority Version Compatibility

New completions after this repair must be distinguishable from pre-repair completed authority.

The implementation may use either:

- a narrow `SoundingsTurnInAuthorityState` version increment; or
- an explicit provenance-version/posture field that is equally unambiguous and deep-validated.

Preferred posture: new completions are **provenance-required**; existing current implementation completions remain **legacy v1**.

No `worldVersion`, `GAME_VERSION`, or development milestone increment is implied by this internal compatibility distinction.

## 10. Existing Completed Save Policy

This decision explicitly resolves the compatibility question without requiring user product input.

### Existing pre-repair completion with no witness

Remain:

- loadable;
- playable;
- saveable for unrelated later gameplay;
- completed exactly once with their already persisted wallet/quest state.

Do not:

- delete or invalidate the whole save solely because the new witness is absent;
- synthesize a witness from its F1-controlled request/result;
- repay the quest;
- backfill claimed provenance;
- rewrite the historical ledger merely to satisfy the new contract.

### Historical duplicate/repair behavior

A legacy completed save without an independent witness may not claim newly verified original-admission provenance.

When the player/system attempts a provenance-dependent historical Soundings operation, return a deterministic, non-mutating **legacy-unverified completion** posture (exact code/name chosen during implementation) rather than:

- paying again;
- repairing projections from unverified retained source;
- returning a trusted durable duplicate result;
- marking the save corrupt merely because it predates the witness contract.

This preserves play while failing closed on the exact historical claim that cannot be proven.

### New provenance-required completion missing witness

After publication recovery is attempted, missing/conflicting witness evidence for a new provenance-required completion is an integrity/recovery defect. Do not downgrade it to legacy.

The save bytes must not be silently deleted. Surface an explicit recoverable/incompatible provenance posture and block provenance-dependent operations until repaired or otherwise explicitly dispositioned.

## 11. Retention Contract

Applied witness evidence remains immutable and retained for the campaign/request across:

- later accepted travel;
- later spending or earnings;
- later save publications;
- non-head first submission and child continuity creation;
- descendant continuity forks;
- Normal defeat/recovery;
- caller-cache loss;
- process/browser restart.

The witness is not garbage-collected merely because the quest is completed or the session control is reconstructed.

Normal campaign deletion/reset may delete its witness under the same account/campaign cleanup policy as other save-owned records.

## 12. Storage And Scope

The witness stores compact ids/fingerprints, not repeated survey/source graphs.

The future repair must preserve the existing bounded 5 MiB ordinary-sequence posture and independently remeasure storage.

Explicitly excluded:

- generic mutation history;
- replay service;
- generic quest reward framework;
- generic wallet ledger;
- signing/key infrastructure;
- remote/cloud authority;
- anti-cheat claims;
- new dependencies;
- broad save-system redesign;
- broad shell/UI redesign;
- broad TypeScript cleanup.

## 13. Required Repair Matrix

The authorized repair must add focused executable coverage proving:

1. wallet-history F1 rewrite rejects before trusted duplicate/projection repair/publication;
2. nonexistent artifact/publication F1 rewrite rejects;
3. conflicting durable witness rejects unchanged;
4. pending witness never authorizes durable historical behavior;
5. missing witness for new provenance-required authority fails closed after recovery attempt;
6. same-session valid pre-save duplicate remains idempotent;
7. cache-loss/restart duplicate succeeds only with matching applied witness;
8. semantic key-order equivalence remains duplicate-equivalent;
9. changed intent remains conflict;
10. later legitimate wallet changes preserve witness validity;
11. non-head first turn-in/fork remains valid;
12. defeat/recovery and descendant continuity preserve witness validity;
13. legacy completed no-witness save loads/continues without payment replay and without synthetic projection repair;
14. seven receipts and exact 5g/0s remain unchanged;
15. standing/reputation/skill/item/service/salvage remain unchanged;
16. survey authority and Stormglass remain unchanged;
17. publication recovery covers crash points around pending/applied witness state;
18. storage remains within the established bounded ordinary-sequence cap.

After repair, a **separate independent post-repair Soundings acceptance audit** must revalidate repaired Slice A and finish remaining A/B/C/D, including browser/storage and full-feed projection posture.

## 14. Disposition

`PROVENANCE_CONTRACT_ACCEPTED_REPAIR_AUTHORIZED`

The six contract rows are decision-complete.

No further user product/canon answer is required before the bounded repair.

No production repair or independent acceptance is performed by this documentation-only decision.
