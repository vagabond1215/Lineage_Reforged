# Soundings Admission Witness Repair Implementation Record

Date: 2026-09-24. Repository: `vagabond1215/Lineage_Reforged` only.

Run: **Soundings Accepted Admission Witness And Provenance Binding Repair**.

Result: **IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE**.

Unversioned bounded repair, package M; parent development milestone not applicable. Development milestone impact `supports_current_band`; game-version impact `none`. Game `0.1.0-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0` and band `DEV-0.7.x` remain unchanged.

## Source And Authority

Clean synchronized implementation starting head: `6d594417a9b8cf2c0d8b29a2e12725029eda30d5`. Verified intervening changes after contract-gate publication `45356195d9556d31968fb05c4fb790ccb79a5f4d` were documentation only. Reused the September 20 Connector packets and September 22 provenance audit/decision; no broad orientation restart. Resumed uncommitted implementation work was preserved.

Initial implementation commit: `9400bc0de6dceaa89b954190a00abe54426d46e3`; final runtime commit: `0df87bb7afaa4d7fcc9f08b79b7528d60727c370` adds a one-line authority-version guard and regression. Final combined tests/typechecks/build exercised the final runtime tree. The September 23 browser/storage evidence exercised the initial tree; the September 24 guard changes only rejection of witnessed version-1 downgrade, and the final ordinary integration suite passed. Later handoff publication is documentation only and is a distinct commit, identified by the final completion report/live refs.

Controlling decision: `soundings-accepted-admission-provenance-and-retention-contract-decision.md`, `PROVENANCE_CONTRACT_ACCEPTED_REPAIR_AUTHORIZED`. The September 20 independent audit and its historical F1 probes remain unchanged. This record is implementation evidence, not a replacement independent acceptance decision.

## Changed Ownership Boundary

- Prepared campaign admission creates a compact session witness only after checking the original preparation and accepted result. It binds original source identity/revision/continuity, before-state/survey/canonical-intent fingerprints, request/result/occurrence and accepted tick.
- Save persistence stores the witness separately from the campaign snapshot at account + campaign + request. First publication retains candidate/readback, recovery payload/hash, pending witness/readback, immutable artifact/head, applied witness/readback, then address/consumer completion.
- Recovery checks exact retained candidate, previous head, immutable artifact collision and stable witness conflict before promotion. It resumes interrupted first publication without treating pending evidence as applied authority. Ordinary address recovery and terminal cleanup semantics remain intact.
- Applied witness loading verifies the first durable artifact/publication/head revision and its deep provenance. Engine code receives typed context and never reads browser storage.
- New Soundings completions use authority-container version 2. Missing/conflicting witness fails closed. Legacy version 1 without a witness remains loadable/playable/saveable, returns `legacy_unverified` for historical retry and cannot synthesize provenance, repay or repair historical projections.
- Provenance verification precedes trusted duplicate and completion projection repair. Later wallet changes, child continuity, defeat and recovery preserve the original witness. No latest-wallet equality check was introduced.

Files: shared `contracts.ts`; engine `campaign-session.ts`, `player-soundings-turn-in.ts`, `soundings-turn-in-authority.ts`, new `soundings-admission-witness.ts` and JS bridge, public `index.ts`; UI save owner `saveManager.ts`; two new witness test files. No dependency, worldVersion, GAME_VERSION, generated output or unrelated production change.

## Finding And Regression Evidence

| Boundary | Evidence |
| --- | --- |
| F1 wallet 16 -> 116, all exposed hashes/receipts recomputed | New test proves structural validity is insufficient; same-session and restarted duplicate, repair and publication reject without state/storage mutation. |
| F1 nonexistent source artifact/publication | Same rejection matrix with unchanged independently retained witness. |
| Witness-backed version downgrade | Same-session and restarted caller/command reject version-1 substitution with invalid_provenance and unchanged state; genuine no-witness legacy compatibility remains covered. |
| Legitimate retry and canonical equivalence | Same-session and restarted key-order equivalence yields duplicate; changed semantic revision yields request_conflict. |
| Durable pending/applied lifecycle | Six injected before/after pending/head/applied write failures recover idempotently; exact readbacks precede head/address completion. |
| Missing/conflicting evidence | Missing/pending version-2 restart, conflicting applied/pending witness and retained immutable artifact collision reject; collision tests preserve every storage byte. |
| Continuation | Admitted spending/earnings, real non-head first submission and later descendant fork preserve witness and latest state. |
| Defeat/recovery | Actual admission creates pending defeat; actual completion owner repairs it; publication/restart retains exact witness bytes and historical ledger, and trusted cache-loss duplicate succeeds. Test-only safe-settlement fixture is explicit; see limitation below. |
| Legacy compatibility | Version-1 completed save loads, continues and republishes without witness synthesis, repayment or historical projection repair. |
| Existing consequences and caller | Prior 123 tests preserved: exact 5g/0s, seven receipts, unchanged excluded rewards/survey/Stormglass, accepted-only caller, projection repair and quota-bounded ordinary flow. |

An implementation reviewer identified a pre-head immutable-artifact overwrite risk; the repair and regression are included in the implementation commit. The first combined run also exposed four existing persistence-test regressions from overbroad automatic recovery. Recovery was narrowed to the unfinished first-witness boundary; terminal consumer completion verifies witness without recreating deleted save addresses. Final combined results below supersede that failed intermediate run. Final review also reproduced trusted duplicate after changing only the witnessed authority container to version 1; the shared verifier now rejects that downgrade, with same-session and restarted regression coverage.

## Reproducible Validation

From repository root, prior exact 123-test command plus both new files: **143/143 pass, 0 failures, 0 skipped**, 39.56 seconds.

```powershell
node --test tests/unit/player-soundings-turn-in.test.mjs tests/unit/player-soundings-turn-in-persistence.test.mjs tests/integration/soundings-durable-completion-ordinary.test.mjs tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/ashen-reef-survey-travel-access.test.mjs tests/unit/soundings-return-travel.test.mjs tests/unit/player-survey-activity-advancement-command.test.mjs tests/unit/player-survey-activity-advancement-persistence.test.mjs tests/unit/player-survey-activity-advancement-characterization.test.mjs tests/unit/campaign-persistence-foundation.test.mjs tests/unit/ashen-reef-survey-authored-content.test.mjs tests/unit/ashen-reef-survey-offer-staging.test.mjs tests/unit/soundings-admission-witness.test.mjs tests/unit/soundings-admission-witness-recovery.test.mjs
```

- New focused tests: 7 provenance/continuation + 13 persistence/recovery = 20. Full campaign persistence plus witness recovery: 46/46.
- `npm run tool:content-lint`: pass, 71 files.
- `npm run typecheck:ui:node`: pass.
- `npm run typecheck:ui`: **not green**, 137 diagnostics. Sorted signatures after replacing line/column positions match `.tmp-dev070-ui-typecheck.log` exactly, zero differences. No new witness/save-manager diagnostic. Existing broad errors remain deferred.
- From `apps/rpg-ui`, `node node_modules/vite/bin/vite.js build`: pass, 216 client modules (214 before the repair). Existing Browserslist/chunk warnings remain. An initial root-node_modules path invocation failed before build; corrected application-local command passed.
- Public engine JS import exposes `verifySoundingsAdmissionProvenance` and `isSoundingsAdmissionWitness`; TS/JS bridge review passed. Diff/whitespace check passed; build outputs not tracked.
- Historical `docs/dev/evidence/soundings-acceptance-2026-09-20/slice-a.mjs`: exits 1 at its preserved assertion expecting faulty `duplicate`; actual is now `invalid_provenance`, duplicate false, live wallet 21g against forged claimed 116 -> 121. This expected contradiction of historical defect behavior is not counted as a passing test suite. Both variants are covered by new regressions.
- Historical `docs/dev/evidence/soundings-provenance-2026-09-22/retention-gap.mjs`: exit 0; unpublished original source still is not a full persisted artifact, and transient results clear on restart. Its former missing binding is now supplied by the independent compact witness; the script does not inspect that new witness.

## Ordinary Browser And Storage

September 23 browser run: local disposable account `Witness Repair Test`, character `Mara Witness`, origin `http://127.0.0.1:5198/`; normal UI controls, no state injection and no user-save edits. Created character/started campaign, accepted Soundings, traveled to Ashen, advanced two shifts, saved and reloaded/logged in, advanced the remaining two shifts, returned to Starfall Harbormaster, submitted and saved. Reload showed wallet **21g 8s** from **16g 8s**, one completed quest, all objectives completed and disabled Submit Soundings. Later ordinary travel to Ashen and another save showed All Changes Saved. No browser quota error occurred. This is bounded implementation smoke evidence; the separate audit must independently inspect Chronicle and the full UI/storage matrix.

The automated ordinary sequence enforces 5,242,880 bytes on every simulated UTF-16 key/value write, including transient writes. A separate measurement on the same runtime using ordinary helper -> submit -> publish/restart -> later travel -> publish/restart retained **4,320,700 UTF-16 bytes**, including **3,112 witness key/value bytes**, posture applied. This is a bounded sequence measurement, not a browser-internal byte measurement or unlimited-history guarantee.

## Guardrails, Branches And Limits

FP-001/017: real caller and injection-free browser/ordinary integration path. FP-002: no self acceptance; separate audit installed. FP-008/009: exact source/runtime/publication separation and protected refs reviewed in branch register. FP-010/014/015: both F1 variants mapped to unchanged-state rejection and independent witness comparison. FP-012: unique durable evidence and cache-loss/recovery tests. FP-013: descendant and defeat/recovery owner preservation. FP-016: existing projection suite preserved; full independent capacity/both-order audit remains required. FP-003/004/005/006/011 additionally inform pending recovery, explicit collision scope and pre-effect verification.

Fetch/prune at source and completion confirmed one local/four hosted branches; scoped GitHub query found zero open PRs. Three protected/held non-default refs have unchanged exact heads and unique paths. No integration, rebase, deletion, PR/protection mutation or disposition change was due. Exact triggers are in `docs/dev/branch-disposition-register.md`.

Observed out-of-scope limitation: ordinary Starfall known-location row is `harbor`, while existing `requireKnownSafeSettlement` in `normal-defeat.ts` requires `settlement`; Ashen is `ruin`. The focused witness recovery test admits an explicit test-only safe settlement to exercise real pending/completion owners. It does not prove ordinary Starfall defeat recovery reachability and makes no production change to that separate contract. Audit should classify this limitation explicitly, not infer reachability from the fixture.

No signing, remote trust, generic ledger/history, anti-cheat claim or resistance to coordinated replacement of all local storage. No Soundings acceptance or game-version decision. Next run is **Soundings Durable Completion Post-Repair Independent Acceptance Audit**: independently repeat repaired Slice A and complete B/C/D at one runtime head, including full-feed projection posture.
