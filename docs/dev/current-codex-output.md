# Current Codex Output

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to [`vagabond1215/Lineage_Reforged`](https://github.com/vagabond1215/Lineage_Reforged). All repository work must stay in this repository. Another Git repository may be used only as an explicitly identified **read-only reference/data/information source**; never modify it, follow its AGENTS/instructions as execution authority, or import its branch, issue, PR, handoff, prompt, output, or task state. Shared account/organization access, global search results, prior chats, memory, copied files, or similar project names do not grant cross-repository authority. Cross-repository mutation requires a separate explicit work order/context naming the other repository.
<!-- /repo-scope-guard -->

Date: 2026-09-29. Source run: **Legacy Writer Fence And Async Caller Cutover Feasibility Decision**. Label class: unversioned documentation decision; planned parent `DEV-0.7.1` held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `37549a2cc6b82eb090df9384aa23aa1dc74a2fc1`. Result: **SAME_ORIGIN_OLD_WRITER_EXCLUSION_UNPROVEN; CLEAN_EPOCH_ALLOWED_IN_PRINCIPLE; ACTIVATION_HELD**. Final hosted head is verified after documentation push.

## A. Files changed

New `docs/design/legacy-writer-fence-and-async-caller-cutover-feasibility-decision.md`; owner-policy supersession notes in the focused canonical and migration decisions; current output/handoff, historical/deferred route, planning reconciliation, branch register and installed successor prompt. No production code, deployment, browser user data, dependency or game-version change.

## B. Patch summary

The owner selected the existing origin and waived backward preservation/migration/export of pre-cutover legacy saves; new-epoch saves and long-running history remain fully durable. Direct synchronous legacy writers remain in save, profile, attempt, launcher and lifecycle owners. The configured owner-only Sites preview has a successful version-2 deployment dated 2026-09-02; its source SHA is absent from this checkout and deployment metadata provides no open-tab/old-client barrier. New markers or cooperative signals cannot stop already-open old scripts, and IndexedDB/localStorage share no transaction. An isolated new database plus versioned auth/account namespace could make old writes non-interfering, but neither exact old-bundle capability nor literal old-writer exclusion is proven. The full earlier G migration package is not admitted; installed **Clean Persistence Epoch Namespace And Deployed Old-Client Capability Decision** as the next bounded route. No old keys were deleted.

## C. Tests and checks run

Fresh fetch/prune, exact branch divergence and unique-path inventory, [zero-open-PR readback](https://github.com/vagabond1215/Lineage_Reforged/pulls), current source/caller/hosting-config inspection, read-only Sites project/version/deployment metadata, and documentation diff check. No test, build, typecheck, native browser migration probe or user-data read was run in this docs-only decision. Slice F's Chromium 14/15/12 suites, 68 adjacent tests, Node typecheck and Vite build are **reused prior evidence**; broad UI typecheck's 137 diagnostics remain a baseline, not a green result. Detailed fresh evidence and limits are in the focused decision.

FP-001/002/003/004/005/006/009/011/012/013/014/015 apply as future real-caller, parent, repair, contention, retry, stale authority, provenance and nested-history constraints; FP-008 applies to semantic branch review. No new generalized pattern is needed.

One local/four hosted branches and zero open PRs were inspected. Readiness `59c103c3`/base `895c02df` (448 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (395/1), administration `210df5bc`/base `fd40571b` (226/1) retain their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. No trigger consumed, integration, deletion, PR or disposition change due/performed.

## D. Risks and follow-up notes

Same-origin all-old-tab exclusion cannot be proved from the present app or Sites metadata. A disjoint namespace is only a candidate non-interference boundary and cannot silently replace the owner's stated exclusion requirement. New-epoch account/credential transition and actual published-bundle capabilities need a separate decision. Slice C capacity, live activation, combat admission and parent acceptance stay held. Suggested commit: `docs(decision): hold same-origin cutover at old-client boundary`. No game-version decision proposed.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice F - Inert Canonical Materialization And Exact Readback**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `122082a611bf72b981a5f783b12c5506ceec5519`. Result: **INERT_CANONICAL_MATERIALIZATION_IMPLEMENTED; ACTIVATION_HELD**. Code checkpoint `d81c5ea2`; final hosted head is verified after handoff push.

## A. Files changed

Additive schema version 3 in `apps/rpg-ui/src/game-shell/campaignIndexedDbStore.ts`; new injected-source `legacyCanonicalMaterializationStore.ts`; synthetic native-browser `campaign-canonical-qa.html` and `.ts`; focused Slice F record, current output/handoff, historical/deferred route, planning reconciliation, branch register and successor prompt. No live caller import, source-key write, user data, dependency, combat or game-version change.

## B. Patch summary

Generation-scoped inert canonical records/manifests preserve exact source keys, UTF-16 raw values and digests across account and origin-unscoped families. Byte-verified Slice-E staging, graph/blocker analysis, provisional atomic scope write, independent close/reopen exact readback, source recensus, same-source retry and changed-source separation fail closed. Existing v1/v2 stores remain operational; no authority selector exists. Installed unversioned **Legacy Writer Fence And Async Caller Cutover Feasibility Decision** before live caller mutation.

## C. Tests and checks run

Fresh native Chromium canonical QA **14/14 PASS**; existing legacy-copy QA **15/15 PASS**; existing v1 publication QA **12/12 PASS** after v3 upgrade. Adjacent campaign/Soundings tests **68/68 PASS**. Node config typecheck **PASS**; Vite production build **PASS** (229 modules); staged diff check **PASS**. Broad UI typecheck **FAIL** with 137 known baseline diagnostics and zero in changed owner files. The first QA rerun found same-source final-manifest retry and blocked-upgrade error-code defects; both were fixed before final green evidence. Detailed fixtures, cases and limits: `docs/dev/dev-0.7.1-slice-f-inert-canonical-materialization-record.md`.

FP-001/002/003/004/005/006/009/011/012/013/014/015 apply: isolated QA does not accept the parent; account-wide blockers, exact source/provenance, conflict, lost-state retry and independently retained first Soundings witness/artifact were exercised or held for real caller repair as named in the focused record. FP-008 applies to semantic branch review. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (446 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (393/1), administration `210df5bc`/base `fd40571b` (224/1) retain only their registered unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Exact review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. No trigger consumed, disposition change, integration, deletion or PR action due/performed.

## D. Risks and follow-up notes

Older open clients remain unfenced; activation, async caller conversion, reset/delete, export/restore, production repair, two-browser long-run capacity and combat acceptance remain held. Slice C capacity failure persists. Suggested handoff commit: `docs(handoff): record Slice F and writer-fence route`. No `GAME_VERSION` or parent acceptance; no separate game-version decision proposed.

---

Date: 2026-09-29. Source run: **Legacy Campaign Canonical Materialization And Activation Boundary Decision**. Label class: unversioned documentation decision; planned parent `DEV-0.7.1` held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `307be4860c5fb7ca2ade90461ae57873a32cfbea`. Result: **CANONICAL_MATERIALIZATION_CONTRACT_ACCEPTED; ACTIVATION_HELD**. Final committed and hosted head are verified after push.

## A. Files changed

New `docs/design/legacy-campaign-canonical-materialization-and-activation-boundary-decision.md`; current output/handoff, historical/deferred route, planning reconciliation, branch register and installed successor prompt. No source, test, schema, browser user data, dependency or game-version change.

## B. Patch summary

Selected additive IndexedDB version-3 generation-scoped inert canonical records and manifest with exact source raw/digest preservation, queryable identities for all current families, non-head/fork artifacts, every slot, pending recovery/candidate/attempt, independent first Soundings witness/artifact, v6 group, full account profile/consumers and unknown quarantine. Separate exact close/reopen/restart readback and account-wide graph validation precede any selection. Mapped save/profile/attempt/launcher/App/runLifecycle synchronous callers to later async ownership and pending/error states. Activation requires source re-enumeration, repair completion, old-writer fencing, account reset/delete tombstone, export/restore and epoch-bound account selection. A new marker cannot force an older open tab to stop writing; activation stays held. Installed **DEV-0.7.1 Slice F - Inert Canonical Materialization And Exact Readback** only.

## C. Tests and checks run

Fresh fetch/prune, branch merge-base/unique-path inventory, scoped GitHub open-PR readback, live source/caller and authority inspection, and `git diff --check` after documentation edit. No tests, build, typecheck, native browser QA or user-data mutation were run in this docs-only decision. Slice E's 15/15 new and 12/12 existing Chromium QA, 68/68 adjacent tests, Node config typecheck and Vite build are **reused prior evidence**. Broad UI typecheck's 137 diagnostics remain a known baseline, not a green result.

FP-001/002/003/004/005/006/009/011/012/013/014/015 apply as future acceptance constraints: the decision names real caller and reachable repair owners, account-wide contention, lost-state retry, stale authority, exact source/provenance, complete duplicate and nested history checks. It does not claim those tests were executed now. No new generalized pattern is needed.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` (445 master-only/2 ref-only), prompt-integrity `58a34e37`/base `3d77171c` (392/1), administration `210df5bc`/base `fd40571b` (223/1) retain unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. None consumed; no branch integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Old uncooperative tabs and cross-API non-atomic writes still prevent activation. Slice F must remain inert; later caller conversion, reset/delete, source fence, export/restore, two-browser long-run workload and combat admission are separate. Slice C capacity failure and parent hold persist. Suggested commit: `docs(decision): define canonical materialization boundary`. No `GAME_VERSION` or parent acceptance; next recommended run is Slice F, with no separate game-version decision now.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice E - Inert Legacy Authority Copy And Verification**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `87ddc774dec662bdc68d0ae30428505ff0c5d0c2`. Result: **INERT_COPY_IMPLEMENTED; ACTIVATION_HELD**. Code checkpoint and final hosted head are resolved after commit/push.

## A. Files changed

Additive v2 schema and shared database opener in `campaignIndexedDbStore.ts`; new isolated `legacyCampaignCopyStore.ts`; validator exports in `saveManager.ts` and `accountProfileManager.ts`; native legacy-copy QA page/script and v2-aware existing QA script; focused Slice E record; current output/handoff, historical/deferred route, planning reconciliation, branch register and installed successor prompt. No App/launcher import, user data, production dependency, content, combat or game-version change.

## B. Patch summary

An injected `Storage` source is copied into inert `legacyCopyRecords` and a provisional manifest. Exact UTF-16 raw values, all relevant account/legacy namespaces and unknown/malformed entries survive. Double source enumeration, one IndexedDB staging transaction, close/reopen readback, final source comparison, same-source retry, distinct changed-source generations, stale status and named semantic blockers make copy failures explicit. Existing v1 publication stores remain operational. A verified manifest is not an activation marker. The successor is the unversioned **Legacy Campaign Canonical Materialization And Activation Boundary Decision**.

## C. Tests and checks run

Native in-app Chromium: Slice E copy QA **15/15 PASS**; existing v1 publication QA after v2 upgrade **12/12 PASS**. Adjacent campaign persistence/Soundings **68/68 PASS**. Node config typecheck **PASS**; Vite production build **PASS**, 229 client modules. Broad UI typecheck **FAIL**, 137 baseline diagnostics and zero in changed files. Diff check **PASS**. The first existing QA rerun reached 11/12 because its blocked-upgrade fixture still requested version 2; targeting version 3 restored the intended test, 12/12. No second-browser, natural quota, live caller, export/restore or long-run workload acceptance is claimed. Detailed evidence: `docs/dev/dev-0.7.1-slice-e-inert-legacy-authority-copy-record.md`.

FP-001/002/003/004/005/006/009/011/012/013/014/015 applied: isolated tests do not accept parent; account-wide contention, source mutation, crash/retry and independently retained first Soundings artifact are exercised; actual caller/repair completion remain future gates. No new pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` / base `895c02df` (444 master-only/2 ref-only), prompt-integrity `58a34e37` / base `3d77171c` (391/1), administration `210df5bc` / base `fd40571b` (222/1) retain unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Copy is inert and account receipts/v6 conversion can remain blocked. `localStorage` has no cross-tab freeze; activation needs source recheck, old-writer fencing and a complete canonical schema. Account reset/delete, async App/launcher callers, export/rollback and two-browser long-run capacity remain open; Slice C capacity and combat holds persist. Suggested commit: `feat(storage): add inert legacy authority copy`. No `GAME_VERSION` or parent acceptance; no separate game-version decision proposed now.

---

Date: 2026-09-29. Source run: **Legacy Campaign Store Migration Boundary Decision**. Label class: unversioned documentation decision; planned parent `DEV-0.7.1` held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `a2ce0de324fe7c04fc43a9b28d573616c0095e2e`. Result: **MIGRATION_COPY_CONTRACT_ACCEPTED; ACTIVATION_HELD**. Final publication/live head is verified after push.

## A. Files changed

New focused `docs/design/legacy-campaign-store-migration-boundary-decision.md`; current output, handoff, historical/deferred route, planning reconciliation, branch register and installed successor prompt. No production code, schema, test, user save, account, dependency or version change.

## B. Patch summary

Inventoried v7 artifact/control/slot/candidate/recovery/witness, v6 and obsolete keys, migration receipt/source, account profile/history/consumers, new-campaign attempts, active pointer, launcher auth and preferences from live owner/caller paths. Accepted additive IndexedDB v2 inert exact-raw staged copy and account-wide verification, with malformed/unknown evidence retained and no live caller cutover. Version 1 cannot import all retained history or account state. Later activation requires complete canonical records, async callers, stale-tab fencing, restart readback, export/rollback and account reset/delete coordination. Installed **DEV-0.7.1 Slice E - Inert Legacy Authority Copy And Verification** only; Slice C capacity and combat holds persist.

## C. Tests and checks run

Fresh fetch/prune, exact source/head and branch inventory, zero-open-PR GitHub readback, focused source/authority review and `git diff --check` after documentation edit. No tests, build, typecheck, native browser QA or user-data probe run in this documentation-only decision. Slice D's Chromium 12/12, adjacent 68/68, Vite build and Node config typecheck are **reused prior evidence**; broad UI typecheck's 137 diagnostics are a known baseline, not green.

FP-001/002/003/004/005/006/009/011/012/013/014/015 applied as migration contract guards: real caller and restart gates remain future implementation obligations; current decision maps account-wide recovery, complete evidence, independently retained Soundings first artifact, preserved nested/account history, source/hosted identities and fail-closed staging. No new generalized failure pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` / base `895c02df` (443 master-only/2 ref-only), prompt-integrity `58a34e37` / base `3d77171c` (390/1), administration `210df5bc` / base `fd40571b` (221/1) retain their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Stage E will not activate IndexedDB or resolve dynamic capacity. Cross-tab source writes can invalidate a captured generation; quarantine and retry are required. Account reset/delete currently omit attempt and IndexedDB data, so cutover must close that path. First Soundings witness and artifact, non-head/fork history, pending consumers and unknown keys cannot be dropped. Suggested commit: `docs(decision): define inert legacy campaign copy boundary`. No `GAME_VERSION` or parent acceptance; next recommended run is Slice E, with later activation and a separately measured game-version decision only when player-facing criteria warrant it.

---

Date: 2026-09-29. Source run: **DEV-0.7.1 Slice D - Transactional Campaign Store Foundation**. Label class: internal slice of planned current-band primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `54c4595f122b194d33a520352b11ed43e755632e`. Result: **TRANSACTION_FOUNDATION_IMPLEMENTED; LIVE_CUTOVER_HELD**. Implementation checkpoint and final hosted head are resolved after commit/push.

## A. Files changed

New IndexedDB owner `apps/rpg-ui/src/game-shell/campaignIndexedDbStore.ts`; existing guard/type exports in `saveManager.ts`; native QA page and fixture helper; focused implementation record; this output, handoff, historical/deferred register, planning reconciliation, branch register and installed successor prompt. No live caller, legacy save, dependency, content, shared schema, combat or game-version change.

## B. Patch summary

Version 1 IndexedDB schema has account-scoped artifact/control/slot/witness records and indexes. One async publication transaction validates exact expected head, retained predecessor artifact, v7 envelope/snapshot identities, slot, immutable conflicts and independent applied Soundings provenance; it commits all required records or aborts. Post-commit readback verifies raw artifact/address and control/witness. Same-source retry is idempotent. Failure codes distinguish unavailable, blocked upgrade, quota, abort, stale head, conflict, invalid record and readback failure. Current synchronous localStorage callers remain unchanged. The installed successor is the unversioned **Legacy Campaign Store Migration Boundary Decision** before any copy/cutover.

## C. Tests and checks run

Native Codex in-app Chromium QA: **12/12 PASS** with synthetic production-owner fixtures, including first and descendant Soundings, write-by-write abort, injected quota, stale/conflict/malformed, reopen/retry and blocked/unavailable. Adjacent campaign persistence and Soundings recovery: **68/68 PASS**. Production Vite build: **PASS**, 229 client modules; Node config typecheck: **PASS**. Broad UI typecheck: **FAIL**, known 137 diagnostics, zero in changed source files. Diff check: **PASS**. Command-line headless Edge/Chrome GPU startup failed before page load; native in-app browser QA completed instead. Natural quota, second browser, live save cutover and long-run stress remain untested. Detailed evidence and reproduction route: `docs/dev/dev-0.7.1-slice-d-transactional-campaign-store-foundation-record.md`.

FP-002/004/005/006/009/011/012/014/015 applied: green tests do not accept parent; account/slot and predecessor conflicts fail closed; reopen and retry preserve exact bytes; source and publication heads remain distinct; validators and retained first-publication witness/artifact control authority. FP-003 is a later migration/caller gate. No new pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` / base `895c02df` (441 master-only/2 ref-only), prompt-integrity `58a34e37` / base `3d77171c` (388/1), administration `210df5bc` / base `fd40571b` (219/1) retain their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

The backend is not activated and has no browser capacity acceptance. The 5 MiB Slice C localStorage failure and combat hold remain. Next work must inventory all legacy families and define verified non-activating copy, activation, rollback and async caller ownership without deleting user data. Suggested commit: `feat(storage): add transactional IndexedDB campaign foundation`. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` and planned parent unchanged.

---

Date: 2026-09-29. Source run: **Ordinary Campaign Publication Capacity And Retention Contract Decision**. Label class: unversioned cross-cutting documentation decision; parent `DEV-0.7.1` remains planned/held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `a16523d8e08b14816a75db95e0b135c09ae40fc9`. Result: **RETENTION_BOUNDARY_ACCEPTED; HIGHER_CAPACITY_BACKEND_REQUIRED; COMBAT_ADMISSION_HELD**.

## A. Files changed

Focused `docs/design/ordinary-campaign-publication-capacity-and-retention-contract-decision.md`, this output, current GPT handoff and installed next prompt, historical/deferred register, planning reconciliation and branch register. No production, test, save, content, dependency or version edit.

## B. Patch summary

Slice C's 5 MiB quota is classified as a current `localStorage` constraint, not a product campaign-size limit. The inventory preserves immutable artifacts, non-head slots, Soundings first-publication witness/artifact, migration source/receipt and account history. Completed candidate envelopes alone are conditionally redundant after exact artifact, recovery, witness, consumer and cross-slot checks; cleanup is only a bridge. At action 50, subtracting all 2,545,248 candidate bytes would leave an arithmetic 2,605,580-byte store, while 2,544,942 artifact bytes remain. Long-running campaigns require a higher-capacity backend. IndexedDB is selected for transactional local campaign/account authority, with dynamic quota, export/rollback and async caller migration gates. No backend implementation or candidate deletion occurred. The next installed prompt is `DEV-0.7.1 Slice D - Transactional Campaign Store Foundation`.

## C. Tests and checks run

Read-only live source/caller and key-family trace, exact Slice C JSON arithmetic, official browser-storage reference review, branch/PR inventory, documentation diff and `git diff --check`. The earlier Slice C probe/38 tests/lint/build are **reused evidence**, not rerun. No new probe, test, build, typecheck, browser QA save or migration was run in this documentation decision. FP-002: the failed capacity gate still holds the parent. FP-003/004/005/006: recovery, slot-wide contention, lost-caller retry and newer-address precedence are explicit. FP-008/009: protected refs and source versus publication identity are separated. FP-011/012/013/014/015: migration must preserve witness priority, complete duplicate evidence and nested owner history; no mutable-digest shortcut. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3` / base `895c02df` (437 master-only/2 ref-only), prompt-integrity `58a34e37` / base `3d77171c` (384/1), administration `210df5bc` / base `fd40571b` (215/1) retain their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions. Review triggers remain readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

IndexedDB has browser/device-dependent quota and possible eviction; native browser, migration, export/restore and long-run tests remain mandatory. The next Slice D is a foundation checkpoint only and cannot clear current capacity or combat gates. Future slices own verified copy/cutover, async callers, candidate cleanup and account-wide stress. Suggested commit: `docs(decision): require higher-capacity campaign persistence`. No game-version or parent acceptance.

---

Date: 2026-09-29. Source run: **Ordinary Campaign Publication Capacity And Retention Direction Clarification**. Label class: unversioned cross-cutting coordination; parent `DEV-0.7.1` remains planned and held. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized `master` at `f0d8b4c82ba3683e1ec0a5df084625423f0d6a6e`. Result: **DIRECTION_RECORDED; RETENTION_DECISION_NOT_STARTED**.

## A. Files changed

Installed decision prompt, Slice C focused preflight record, this output, current GPT handoff, historical/deferred register, planning reconciliation and branch disposition register. No production, test, schema, content, save or version change.

## B. Patch summary

The project owner clarified that the measured 5 MiB ceiling constrains current persistence, not product campaign length. The installed decision now separately requires proof of genuinely redundant copies eligible for bounds and a long-running-campaign backend-capacity/migration disposition. Legitimate durable history remains protected. The Slice C measurements remain historical evidence; the retention decision itself was not executed.

## C. Tests and checks run

Documentation diff/readback and `git diff --check` only; no executable tests or browser campaign mutation. FP-002/008/009/011/012/014/015: capacity failure remains explicit, measured source and authority identities remain separated, and no accepted source, witness, history or newer head is declared disposable. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches, and the scoped GitHub PR page showed zero open PRs; retained readiness `59c103c3` and prompt-integrity `58a34e37` remain protected, administration `210df5bc` remains held. This direction clarification consumes none of their review triggers and requires no integration, deletion, PR or disposition action. Review triggers remain readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective.

## D. Risks and follow-up notes

The current backend still fails the measured repeatability gate. The next installed run is the unversioned **Ordinary Campaign Publication Capacity And Retention Contract Decision**, documentation only, with independent retention and backend-capacity findings. Suggested commit message: `docs(prompt): preserve long-running campaign data in retention decision`. No implementation repair, migration or combat acceptance is claimed.

---

Date: 2026-09-28. Source run: **DEV-0.7.1 Slice C - Repeatable Encounter Capacity Preflight**. Label class: internal slice of planned current-band primary `DEV-0.7.1 - Ordinary Encounter Reachability`; parent remains unaccepted. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `fead51012561ca584359fcadf51d801b196ac21d`; implementation/evidence checkpoint `bb24c483d7d683466d28dcace57fc1e6a723de0a`. Result: **CAPACITY_GATE_FAILED; COMBAT_ADMISSION_HELD**. Final documentation publication head is verified after push.

## A. Files changed

Bounded retry repair in `apps/rpg-ui/src/game-shell/saveManager.ts`; repeatable instrumented probe `tests/probes/ordinary-encounter-capacity-preflight.mjs`; exact captured output `docs/dev/evidence/ordinary-encounter-capacity-preflight-2026-09-28.json`; focused decision `docs/design/ordinary-encounter-publication-capacity-preflight.md`; this output, current GPT handoff, installed next prompt, historical/deferred register, planning reconciliation and branch register. No encounter admission, combat/outcome, content, schema, dependency or `GAME_VERSION` edit.

## B. Patch summary

The production creator-to-World caller and save/publication owner were exercised repeatedly against a 5,242,880-byte UTF-16 whole-store limit using an isolated in-memory localStorage model with a QA account profile. The current world candidate was replaced each action, but durable candidate and artifact envelopes accumulated. At saved action 50 the store was 5,150,828 bytes; action 51's recovery write proposed 5,277,474 and hit quota. The previous head revision 51 remained loadable, while a failed candidate copy remained. Exact retry again hit quota. Separately, a post-head slot-address failure/retry exposed a completed no-consumer recovery record that remained after successful retry. The small repair clears and verifies that record, allowing the next save. Detailed method, limitations and decision are in the focused record.

## C. Tests and checks run

The final captured probe has 22 candidate and 29 no-candidate accepted actions; save/reload checked each successful publication's immutable artifact bytes, tick, Stamina, candidate and publication identity. Snapshot-only serialized size at action 50 was 48,606 bytes, while the whole store was 5,150,828. The action-51 rejection retained the earlier verified head and exact retry made no further write; a separate post-head address-failure retry reused one publication/two artifacts, cleared recovery and saved tick 2 afterward. The probe passed. Focused/adjacent campaign, encounter and Soundings integration tests: **38/38**. Content lint: **72 files checked**. Sequential production Vite build: **PASS**, 229 client modules; the first concurrent build's HTML-output failure was superseded by this clean rerun. Broad `npm run ui:build`: **FAIL**, the unchanged known 137 TypeScript diagnostics, with no new `saveManager` diagnostic. `git diff --cached --check` passed at checkpoint. No actual browser account or save was mutated; this run measures production persistence code under a quota-enforcing model rather than a browser engine's exact quota.

FP-001/017: actual creator/action/campaign caller and production save APIs rather than an injected candidate. FP-002: failed capacity cannot accept parent or combat. FP-003/005: no-consumer recovery retry now completes and a later save proceeds; quota retry preserves prior head. FP-011/012/014/015: exact immutable artifact readback and owner-derived state, with failed writes not promoted. FP-008/009: retained refs inspected and source/checkpoint/publication identities separated. No new generalized pattern.

Fresh fetch/prune found one local/four hosted branches and zero open PRs. At inspected source, retained readiness `59c103c3` / base `895c02df` was 434 master-only/2 ref-only, prompt-integrity `58a34e37` / base `3d77171c` was 381/1, administration `210df5bc` / base `fd40571b` was 212/1. Their unique documentation paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions remain unchanged. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None was consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Retained candidate/artifact copies consume more than 5 MiB after a bounded sequence of ordinary save cycles, even before combat history. The model includes only one QA campaign and default account profile, no full account consumer projection, other saves or future combat receipts; no universal capacity claim follows. The installed next route is the unversioned **Ordinary Campaign Publication Capacity And Retention Contract Decision**, documentation only, to define safe bounded preservation and quota recovery before an implementation repair. Suggested implementation/evidence commit: `fix(save): complete no-consumer publication retry` (committed); suggested handoff commit: `docs(handoff): record ordinary publication capacity gate`. No game-version decision or parent acceptance.

---

Date: 2026-09-28. Source run: **DEV-0.7.1 Slice B - Ordinary Nearby Exploration Reachability**. Label class: internal slice of planned current-band primary `DEV-0.7.1 - Ordinary Encounter Reachability`; parent remains unaccepted. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `f4b510ee081ea0c46a47807b719b24509c7979d3`; implementation checkpoint `400fc0facd5119333fb5591afd216a10a79582a0`. Result: **ORDINARY_CONTEXT_REACHABLE; COMBAT_ADMISSION_HELD**. Final publication head is verified after push.

## A. Files changed

Implementation: `packages/engines/game-engine/src/player-nearby-exploration.ts` and `.js`, `packages/engines/world-engine/src/spawn/content.ts` and `index.ts`, `packages/shared/types/src/contracts.ts` and `encounters.ts`, `apps/rpg-ui/src/runtime/nearbyExplorationCaller.ts` and `GameSessionContext.tsx`, `apps/rpg-ui/src/features/WorldPanel.tsx`, and `tests/unit/nearby-exploration-reachability.test.mjs`. Coordination: this output, current GPT handoff, installed next prompt, historical/deferred register, planning reconciliation and branch register. No content, schema, combat admission/outcome, reward, dependency or `GAME_VERSION` edit.

## B. Patch summary

The World control accepts one deliberate `player.explore.nearby` command only from an exact known authored settlement/context. The engine rechecks current geography, hex/edge, local-to-macro ancestry, habitat and hazard provenance, campaign/action identity and snapshot revision before applying one watch of low-intensity strain and a 2 Stamina action cost. The campaign caller publishes only an accepted mutation. Spawn selection sorts stable IDs and filters profiles, templates and every monster member by authored place, habitat, hazard, movement and disposition; the habitat-ineligible sapper is excluded. A deterministic no-candidate draw is a successful no-encounter result. A selected candidate and context are stored as isolated world observations, separate from the legacy combat queue; the next accepted exploration supersedes them. The current settlement remains authoritative, no encounter is admitted and no reward is issued. An unlinked origin/action stays unavailable.

## C. Tests and checks run

Focused plus adjacent travel/activity/spawn/campaign persistence tests: **84/84**. Content lint: **72 files checked**. Production Vite build: **PASS**, 229 client modules, after stopping the concurrent dev server; the earlier concurrent build failed in Vite's HTML output path and was superseded by this clean rerun. `git diff --cached --check`: **PASS**. Broad `npm run ui:build`: **FAIL**, the known 137 TypeScript diagnostics; the two reported `WorldPanel.tsx` optional-prop diagnostics predate this slice, and no new exploration-file diagnostic was reported. Do not treat the broad build as green.

Real browser QA used a new isolated local QA account and Slot 2 creator campaign, with Stonevein selected through ordinary creator steps. In World, the first Explore action found an authored candidate and displayed “No encounter has begun”; the control remained available. A second action returned “No encounter was found” and replaced the prior signs. Stamina changed from 99/99 to 96/98 after the first action, and the session Save control reported “All Changes Saved” for Slot 2. The browser reload returned to login, so a post-reload browser readback was not completed; the focused serialize/deserialize and repeat-action test verifies candidate persistence and supersession. Browser text and control availability were inspected through the accessibility tree; the existing narrow shell layout remains outside this slice.

FP-001/017: creator-to-World-to-campaign positive path and a second origin/unlinked action, with no injected candidate. FP-002: parent and combat remain held despite green focused checks. FP-003/005: next action replaces candidate, stale/rejected command preserves source, accepted campaign mutation owns publication. FP-014/015: authored geography/hazard and member eligibility rederived at execution. FP-008/009: protected refs reviewed; source, checkpoint and publication identities distinguished. No new generalized failure pattern.

Fresh fetch/prune found one local/four hosted branches; the scoped GitHub PR page showed zero open PRs. At inspected source, readiness `59c103c3` / base `895c02df` was 432 master-only/2 ref-only; prompt-integrity `58a34e37` / base `3d77171c` was 379/1; administration `210df5bc` / base `fd40571b` was 210/1. Unique paths and dispositions remain unchanged: readiness and prompt-integrity `PROTECTED_REFERENCE`, administration `HOLD_NAMED_CONSUMER`. Their exact review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. No trigger was consumed; no integration, deletion, PR or disposition change was due or performed.

## D. Risks and follow-up notes

The retained Soundings measurement left only 166,674 UTF-16 bytes below a 5 MiB storage limit. This slice did not measure a repeatable campaign history or admission/outcome effects; capacity is the next gate. Browser reload readback is unverified because the disposable local QA account signed out on refresh. Combat admission, success/defeat/recovery and the planned parent remain held. Suggested implementation commit: `feat(world): reach authored nearby exploration from World` (committed). Suggested handoff commit: `docs(handoff): route encounter capacity preflight`. Next recommended run: **DEV-0.7.1 Slice C - Repeatable Encounter Capacity Preflight**; no game-version decision.

---

Date: 2026-09-28. Source run: **DEV-0.7.1 Slice A - Ordinary Encounter Context Static Authorship**. Label class: internal slice of planned current-band primary `DEV-0.7.1 - Ordinary Encounter Reachability`; parent remains unaccepted. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`. Development milestone impact `supports_current_band`; game-version impact `none`. Inspected clean synchronized `master` at `05836a6976ee45014012af4b13a77fc5a746e2b3`; implementation checkpoint `c9b38166` (full identity in Git). Result: **STATIC_CONTEXT_AUTHORED; ORDINARY_REACHABILITY_PENDING**. Publication head is verified after push.

## A. Files changed

Added `packages/content/base/world/encounter_action_contexts.json`, `packages/schemas/world/encounter-action-context.schema.json`, `tools/content-lint/encounter-action-contexts.mjs`, and `tests/unit/encounter-action-context-static-authority.test.mjs`; registered the collection in `tools/content-lint/index.mjs` and schema in `tests/unit/schema-files.test.mjs`. Updated this output, current GPT handoff, installed next prompt, historical/deferred register, planning reconciliation and branch register. No runtime, UI, save, combat, existing encounter content or `GAME_VERSION` change.

## B. Patch summary

One world-owned record binds deliberate `player.explore.nearby` at Stonevein to the authored Ore Ridges–Caravan Marches edge, explicit `frontier_track`, and Auric Marches region hazard source. The reusable strict schema and semantic lint reject ambiguous identities, wrong origin/hex/edge or region ancestry, absent or invalid hazard and missing compatible spawn profile, template or monster member. The compatible roadside patrol is eligibility evidence only; no template is forced. Other origins/actions still have no authored record and cannot produce a positive encounter. The existing sapper selector gap remains a later runtime gate.

## C. Tests and checks run

`node --test tests/unit/encounter-action-context-static-authority.test.mjs`: **23/23**; `node --test tests/unit/schema-files.test.mjs`: **107/107**; `npm run tool:content-lint`: **72 files checked**; `node --test tests/unit/combat-spawn-foundation.test.mjs`: **30/30**. `git diff --cached --check` passed at implementation checkpoint. Tests cover exact positive record and wrong origin, hex, edge direction/region, parent, hazard source/value, habitat, profile, template, member, duplicate ID/tuple and unknown field. Static lint does not exercise creator, player action, World UI, save, spawn selection or capacity. Known 137 broad UI diagnostics were not rerun.

FP-002/017: static green evidence does not accept the parent or ordinary encounter reachability. FP-014/015: lint derives references, ancestry, hazard and member eligibility from live world catalogs. FP-008/009: retained refs reviewed semantically and inspected/implementation/publication identities separated. FP-001's real-caller proof remains for Slice B; no new generalized failure pattern.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Retained readiness `59c103c3` / base `895c02df`, prompt-integrity `58a34e37` / base `3d77171c`, and administration `210df5bc` / base `fd40571b` retain unique documentation-only paths and `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER` dispositions. Review triggers remain scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

The next internal slice must implement the deliberate command, exact current-location resolver, World caller and eligible template filtering, then prove creator-to-action and honest no-match behavior. Repeatable 5 MiB capacity and combat admission/outcome remain separate later gates. Suggested implementation commit: `feat(world): author ordinary encounter action context` (committed). Suggested handoff commit: `docs(handoff): route ordinary encounter reachability slice`. No new milestone or game-version acceptance.

---

Date: 2026-09-28. Source run: **Ordinary Encounter Context Authorship Decision**. Label class unversioned; parent not applicable. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized source and documentation starting head `3976619afbabb063624fcb15e10bd619b5f7e133`; publication identity is verified separately after push. Result: **AUTHORED_CONTEXT_DECIDED; IMPLEMENTATION_HELD**.

## A. Files changed

Focused `docs/design/ordinary-encounter-context-authorship-decision.md`, current prompt/output/handoff, historical/deferred register, planning-anchor reconciliation and branch register. No production source, content, schema, UI, test, save, dependency or game-version change.

## B. Patch summary

The project owner explicitly chose deliberate **Explore nearby environs** from Stonevein onto the authored Ore Ridge–Caravan Marches pass, with `frontier_track` to be explicitly placed for this one action/context. Stonevein is a reference, never a universal first encounter. The actual creator still has one known settlement and arrival activity, no encounter context, and no known travel catalog destination. Ordinary travel is a whole-leg alias command; generic shift stays in town. The focused decision fixes exact place, habitat and hazard provenance, owner split, a static authoring/lint slice, separate reachable-action slice and capacity/combat gates. The installed next prompt is `DEV-0.7.1 Slice A - Ordinary Encounter Context Static Authorship`; it does not implement combat or accept the planned parent milestone.

## C. Tests and checks run

Fresh fetch/prune confirmed source `HEAD == origin/master`, clean tree, one local/four hosted branches, and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Read-only creator probe used `createNewGameSnapshot` with validated Stonevein form and found `destination_not_known` for all four current travel catalog IDs; ordinary shift preview was available but carried no off-settlement context. Source inspection covered creator, World/Activity UI callers, travel/activity owners, exact routes/hexes/edges, world schemas, content-lint registration, and spawn/template/member/hazard authority. `node --test tests/unit/player-travel-command.test.mjs tests/unit/player-activity-selection-command.test.mjs tests/unit/combat-spawn-foundation.test.mjs` passed **47/47**. A hand-supplied resolver context at tick 1 yielded 36 hits for seeds 0–99, including a habitat-ineligible sapper template; this characterizes a later selector gate, not ordinary reachability. No browser run, positive ordinary caller, save mutation or capacity measurement. `git diff --check` and final publication/readback remain final gates; known 137 broad UI diagnostics were not rerun or called green.

FP-001/017: ordinary creator/caller probe separates reachability from demo and injected spawn tests. FP-002: 47 green units do not accept ordinary combat. FP-008/009: retained branches reviewed semantically and inspected/publication heads distinguished. No new generalized pattern.

Retained readiness `59c103c3` (429 master-only/2 ref-only), prompt-integrity `58a34e37` (376/1) and administration `210df5bc` (207/1) have unchanged merge bases, unique paths and dispositions `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`. Their review triggers are respectively scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no merge, rebase, integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

The accepted reference needs a new action/context record and a later real World-panel caller. Unknown origins/actions stay `no_eligible_encounter`; current source cannot yet admit a positive encounter. The current resolver's template-habitat omission must be repaired in the later action/resolver slice. Repeatable campaign storage remains separate: retained peak 5,076,206/5,242,880 UTF-16 bytes leaves 166,674. Suggested commit: `docs(decision): select nearby exploration context authorship`. Next recommended run: **DEV-0.7.1 Slice A - Ordinary Encounter Context Static Authorship**; no separate game-version decision.

---

Date: 2026-09-28. Source run: **Ordinary Encounter Admission And Outcome Ownership Contract Decision**. Label class unversioned; parent not applicable. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized source `fefd6bae0acca2bef53bb1eadc922350d557dffc`; documentation publication identity is verified separately after push. Result: **CONTRACT_ACCEPTED; IMPLEMENTATION_HELD**.

## A. Files changed

Focused contract `docs/design/ordinary-encounter-admission-and-outcome-ownership-contract-decision.md`; clarification in the preceding combat package decision; current prompt, output and GPT handoff; historical/deferred register, planning-anchor reconciliation and branch register. No production source/content/UI/test/schema/save/dependency or game-version file changed.

## B. Patch summary

Accepted a reusable, context-driven, fail-closed contract under the user's explicit direction: current location, exact authored hex/edge, local-to-macro region, habitat, hazard and accepted ordinary action determine whether a candidate exists. Stonevein/caravan approach is a reference only; no universal Stonevein/Kaelvar/kobold first fight. Missing authored eligibility returns `no_eligible_encounter`. The contract assigns candidate identity, deterministic ordering, one-time campaign admission, legal commands, success/no-reward result, Normal-Stakes defeat/recovery, compact durable evidence, observer-safe text-first controls and repeatable-storage gate. Current content does not authorize an action-to-habitat link and no positive ordinary caller exists. Installed only **Ordinary Encounter Context Authorship Decision**, documentation-only, as next route; no combat implementation package.

## C. Tests and checks run

Fresh fetch/prune confirmed local/hosted equality and clean source. Live creator, world hex/edge, region, spawn, travel/activity, combat, campaign session, recovery, UI contract, save and test owners were re-inspected. `node --test tests/unit/combat-spawn-foundation.test.mjs`: 30/30 pass; `node --test tests/unit/player-travel-command.test.mjs`: 8/8 pass; `node --test tests/unit/campaign-persistence-foundation.test.mjs`: 33/33 pass. A read-only spawn resolver probe with `region.auric_marches`, anchored ore-ridges hex, empty habitat and authored hazard 46 returned zero candidates at ticks 0, 1, 5, 25 and 99. This does not prove the ordinary UI path. No browser execution, positive encounter, save mutation or storage-growth measurement. `git diff --check` and final scope review are publication gates; the 137 broad UI diagnostics remain a known baseline, not a green result.

FP-001/017: ordinary caller cannot be replaced by an injected candidate. FP-002: green foundation tests do not establish playable acceptance. FP-003/005/011/012/014/015: pending completion, precedence, caller-state loss, semantic receipt/duplicate validation and owner-derived facts are contract gates. FP-008/009: source/publication and protected branch state remain distinct. No new generalized pattern is needed.

One local/four hosted branches and zero open PRs. Retained readiness `59c103c3` (428/2), prompt-integrity `58a34e37` (375/1) and administration `210df5bc` (206/1) have unchanged exact heads/merge bases/unique paths and remain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, and `HOLD_NAMED_CONSUMER`. Review triggers: scheduled readiness/regression or protection review; dedicated prompt/execution-pointer audit; administration/template/governance or explicit Lineage retrospective. None consumed; no branch/PR action due/performed.

## D. Risks and follow-up notes

Current world data provide Stonevein's location and risk descriptors but no authorized `frontier_track`, `roadside_ditch` or `quarry_edge` mapping for an ordinary action. Any actual positive implementation still needs one authored reachable context and an instrumented repeated-campaign capacity result; retained peak 5,076,206/5,242,880 leaves 166,674 UTF-16 bytes. Recovery is source-plausible at an exact known settlement but not accepted through combat. No game-version or milestone advancement. Suggested commit: `docs(contract): define context-driven encounter admission`. Next recommended run: **Ordinary Encounter Context Authorship Decision**; no separate game-version decision.

---

Date: 2026-09-28. Source run: **Ordinary Combat/Challenge And Recovery Package Decision**. Label class: unversioned; parent not applicable. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Development milestone impact `none`; game-version impact `none`. Inspected clean synchronized source `b0692e9fad000e364e4e871eba11cdfb1ca1682f`; documentation publication identity is verified separately after push. Result: **COMBAT_CHALLENGE_PREREQUISITE_REQUIRED**.

## A. Files changed

Focused decision `docs/design/ordinary-combat-challenge-and-recovery-package-decision.md`; current prompt, handoff and output; historical/deferred register, planning-anchor reconciliation and branch register. No production source, content, UI, test, save, schema, dependency or game-version file changed.

## B. Patch summary

Installed exactly one documentation prerequisite, **Ordinary Encounter Admission And Outcome Ownership Contract Decision**. The provisional source-derived scenario is creator-selected Stonevein with Warrior arming sword, buckler and light armor, and existing Kaelvar roadside kobold patrol content. It is not yet an ordinary playable route: creator records Auric Marches without frontier habitat; authored spawn selection expects Kaelvar with frontier tags; ordinary UI does not call `runGameTick`; and combat result handling does not call `resolveNormalDefeat` or pass through an accepted campaign mutation. The new contract prompt resolves that one world-to-campaign admission/outcome seam before implementation. The focused decision records conservative text-first presentation, safe-settlement recovery and storage gates. No loot, currency, reputation, quest reward or generalized inventory is inferred.

## C. Tests and checks run

Fresh fetch/prune, three-commit documentation-only delta review from Connector packet `8fbc63bdf4ccde39475d7e485dc8135d749703a1`, clean worktree/upstream, branch inventory and live source/test tracing. `node --test tests/unit/combat-spawn-foundation.test.mjs`: 30/30 pass. `node --test tests/unit/campaign-persistence-foundation.test.mjs`: 33/33 pass. These are foundation checks, not ordinary UI or combat-loop acceptance. No browser run or production change. `git diff --check` and post-edit scope review are publication gates. The broad UI baseline remains 137 diagnostics, not a newly green check.

FP-001/017: distinguished ordinary UI caller from engine/simulation and injected candidates. FP-002: green units do not accept a playable parent. FP-003/005/012: pending recovery completion, retry and durable duplicate proof required before implementation. FP-008/009: inspected protected refs and kept source/publication identities distinct. No new generalized pattern is warranted.

One local/four hosted branches; GitHub showed zero open PRs. Readiness `59c103c3` (427/2), prompt-integrity `58a34e37` (374/1) and administration `210df5bc` (205/1) retain their exact heads, unique paths and prior `PROTECTED_REFERENCE`/`HOLD_NAMED_CONSUMER` dispositions. Review triggers respectively remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. None consumed; no integration, deletion, PR or disposition action due/performed.

## D. Risks and follow-up notes

Normal-Stakes recovery is implemented but not wired to combat resolution. Stonevein creator facts satisfy the current known-settlement predicate in source, yet ordinary combat recovery and restart still need executable proof. Repeatable defeat can grow receipts/ledger/Chronicle; retained storage peak 5,076,206/5,242,880 leaves 166,674 UTF-16 bytes, so the additional-history reopening trigger is consumed before implementation. Candidate geography/habitat and observer policy remain undecided. No game-version or milestone advancement. Suggested documentation commit: `docs(decision): require ordinary encounter admission contract`. Next recommended run: **Ordinary Encounter Admission And Outcome Ownership Contract Decision**; no separate game-version decision proposed.

---

Date: 2026-09-28. Source run: **Activity Revenue Presentation Truthfulness Repair**. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Unversioned; parent not applicable; development milestone impact `none`; game-version impact `none`. Result: **PRESENTATION_REPAIR_VERIFIED**. Inspected and implementation-starting head `1f6d513a0c780ff52a8d7b9af6282c3010557d15`; implementation commit `c2d07ac8d4b4e1a404687cbd9d86c533feeb9222`; resumed validation head `c950f5fe1f4094140475eb7f61f0817ad2d2782b`. Final coordination/publication head is reported after commit and push.

## A. Files changed

Implementation: `apps/rpg-ui/src/runtime/uiViewModel.ts` at the checkpoint commit. Closure documentation: focused repair record, selected planning decision, current prompt/output/handoff, planning reconciliation, historical/deferred route register, and branch register. No game-version, engine, save, schema, or content change.

## B. Patch summary

The Daily Revenue card now says `Not tracked` and `Daily revenue is not currently tracked.` The prior literal 842 and false session-record attribution are gone. Other metrics and gameplay controls remain as before. The focused repair record contains the source-to-renderer trace and browser observations.

## C. Checks and evidence

App-local Vite build passed (216 client modules); Node configuration typecheck passed. Broad UI typecheck reported the known 137 diagnostics, not green. Diff/whitespace checks passed. The isolated QA campaign used ordinary creator, contract acceptance, and confirmed travel to Ashen Reef after explicit user authorization. In the active-survey Activity view, active operations were 1, current activity was Surveying Ashen Reef, Daily Revenue was Not tracked, and Advance Shift was enabled with sector 1 outlook. Wide render was readable; the narrow view preserved text but the existing shell left about 92px of scrollable main-pane height at 390px. No survey shift or quest submission was performed. Rendered observations are in the focused repair record; comprehensive accessibility and new gameplay acceptance are not claimed.

FP-001/017: actual creator, contract, travel, and Activity caller exercised without injection. FP-002: disposition is limited to the presentation repair. FP-008/009: branch/PR scope and distinct source/implementation/checkpoint/publication identities reviewed. Fresh fetch/prune; one local/four hosted branches; zero open PRs. Retained branch heads and unique paths unchanged; readiness 423/2, prompt-integrity 370/1, administration 201/1 at the resumed validation head. Their protected/held dispositions and exact review triggers are unchanged; no branch action due or performed.

## D. Risks and next route

No new revenue owner is implied. The known 137 UI diagnostics and narrow shell layout remain. The ranked storage, other presentation, recovery, and gameplay candidates retain their prior reopening triggers; none was consumed by this repair. No new executable package is installed. Suggested implementation commit: `fix(ui): present daily revenue as untracked` (committed). Suggested closure commit: `docs(handoff): close Activity revenue presentation repair`.
