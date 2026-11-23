# New UI master cutover: independent Connector preflight and bounded acceptance handoff

**Date:** 2026-11-23. **Scope:** `vagabond1215/Lineage_Reforged`, current game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. This is **unversioned research/coordination**, not a game-version milestone or production release. All observations are grounded in the **published GitHub source**; the Connector did not run Node, Vite, Chromium, a local database, or a deployed client.

**Disposition: MAINLINE_CANDIDATE_ANCESTRY_AND_SOURCE_PROVENANCE_PASS / V8_ROLLBACK_AND_UI_ACCEPTANCE_HELD / PRODUCTION_ACTIVATION_NOT_AUTHORIZED.**

## 1. Exact inspected heads and branch disposition

| Ref | Git head | Status |
| --- | --- | --- |
| `master` | `20abe83c2aa97ba4699711a9815d9b95e0d3df44` | Current selected default branch; untouched |
| `codex/selected-world-creator-ux-2026-11-23` | `3789c12b99af439ab401f282f8d0302f79f7f210` | Proposed New UI mainline candidate; untouched |
| `codex/selected-world-entry-creator-2026-11-23` | `acd4d61d6c8c14252d1d44330aa76a23a723e726` | Pre-UX eight-stage presentation |
| `codex/functional-world-integration-preview-2026-11-22` | `bae33e656b8c1e472a3d9f7abb050d47829d48e6` | Master-based functional World review |
| Draft PR #102 | `e74f9e1414d02cde60ba03aa088afc166f2634b1` | Open, draft, **unmerged** World-owner source/migration lineage |
| Draft PR #103 | `d6fb21d3452f56ecf962f2c7d11eae95394927ca` | Open, draft, **unmerged** standalone UI/prototype lineage |

The exact Git compare `master...codex/selected-world-creator-ux-2026-11-23` is **9 commits ahead / 0 behind**, merge base `20abe83c2aa97ba4699711a9815d9b95e0d3df44`, **61 changed files**. A future PR may be prepared on this master-based candidate after its gates are met; do **not** merge PR #102 or #103 by wholesale historical ancestry. PR #102 vs candidate is **diverged, 118 ahead / 21 behind**, and the PR #103 topic vs candidate is **diverged, 47 ahead / 19 behind**; these are historical-review lineages, not safe direct merge sources.

The latest UX-only difference against the eight-stage creator branch is **one commit, three files**: `apps/rpg-ui/src/game-shell/components/SelectedWorldCreator.tsx`, `apps/rpg-ui/src/game-shell/components/selected-world-creator.css` and `apps/rpg-ui/tests/first-world-a3b-ui-browser-qa.py`. It adds HP/MP/Stamina progress bars, required surnames, centered Cancel/Randomize All, the three-dot menu, contextual and stage dice controls, fixed-height card overlays, inline Next/double-click, and independent scroll containers. This is source inspection, not independent browser acceptance of the last commit.

## 2. Read-only safe passes actually executed

1. **Live ref, draft PR, history and change-scope inventory:** fetched exact heads for master, current UI and older owner; read PR #102/#103 live metadata; compared current UI against master, previous UI and both historical topics. Verified current master is the exact candidate ancestor.
2. **Pinned owner/source closure:** fetched an **untruncated 2,344-object recursive Git tree** at the candidate head and compared each listed path's Git blob identity to the live manifest: v1 original source/algorithm/JS bridge **41/41**, v2 browser/source pack/Worker **8/8**, v3 owner/app/Vite producer **5/5**, and separately pinned historical A1 `firstWorldDurableRegistry.ts` **1/1**. **55/55 match, zero missing or drift.** The three manifests declare 54 pins plus one historical A1 producer. Manifest blobs are v1 `8dd06caec702c439ed36b59ac24c146b266adffb`, v2 `573ff2566dff73b6f64785180624ee2e379f8311`, v3 `25477117764ad35a91ffab1526f1ae810344c98d`. The v3 runtime fingerprint is `sha256:90d19ed5fa6f9c06bc093d6f775b65a5b69ad12b66a40362bd42a3bf948cfe33`; v2 parent fingerprint `sha256:63ba33dc9873ce49e2a2d98ba9744e9e0c45a2ac88ef244212968bb371752437`.
3. **UI vs production/review route:** inspected `apps/rpg-ui/src/EpochApp.tsx`, `game-shell/accountPresentationGate.ts`, `vite.config.ts`, `SelectedWorldCreator.tsx` and its CSS. Ordinary DEV has a loopback-enabled UI selector and read-only Creator presentation. Functional World creation requires `developmentNativeV3`, compiled `world-owner-review` mode, owner build define, loopback hostname, root/index entry and **exactly one each** `welcomeL1=1&accountPresentation=1&worldPresentation=1`. Production on an ordinary public hostname is not admitted. The selected-World Character Creator remains an **ephemeral draft**; durable Character/Save association and Opening submission are disabled.
4. **Migration, backup and rollback code trace:** inspected current `cleanEpochAccountStore.ts`, `tests/unit/first-world-l3a-v8-migration.test.mjs`, `apps/rpg-ui/tests/first-world-a2b-browser-qa.py` and archive code. Old master opens `lineage.campaigns.epoch1` at **IndexedDB version 7**; candidate opens the **same database at version 8** and adds `worldsV8` and `worldCreationReceiptsV8` (14 prior families + 2 new). This upgrade is applied when the account store opens, **not only when New UI is selected**. Focused tests cover an original v7 account and 14-store preservation, versioned v7 archive restore to an empty v8 target, reset/delete, v8 World/receipt round trip, corruption, conflict and blocked upgrade. The browser suite has old-v7 blocked-upgrade/reopen and source/rollback cases. Source-level coverage is present; latest-commit execution has not been reproduced by Connector.
5. **CI visibility and build baseline:** GitHub Connector returned **zero combined status entries** and **zero PR-triggered workflow runs** for `3789c12b`. This is not a reported CI failure, but there is no hosted acceptance evidence surfaced by these endpoints. The prior checked eight-stage creator receipt reports 44 focused Node passes, direct Vite build passes, Chromium cases and a **183-diagnostic broad TS baseline**; the latest UX commit contains a larger QA harness **without a new execution receipt**. `npm run ui:build` remains blocked by the previously reported broad TypeScript baseline unless independently demonstrated otherwise. Do not classify last UX as full acceptance.

## 3. Material cutover risks and their containment

### P0: v7-to-v8 is a real irreversible-forward storage version step

IndexedDB opening at v8 upgrades the *same origin's* `lineage.campaigns.epoch1` store. A **v7-only build cannot reliably open a database that is already at v8**; reversing source control commits does not downgrade a browser's IndexedDB version. **Classic UI from the new v8 code is a viable UI fallback, but the old v7 application artifact is NOT an accepted rollback.**

Before default or public cutover:
- Independently rerun original-v7-to-v8 migration with **disposable** nonempty accounts and native-v3 ready/retired Saves, plus retained lifecycle and archive digests; test blocked tabs, deliberate failed upgrade and recovery. Never run destructive QA on real player data.
- Exercise **v7 archive -> empty v8 database**, **v8 archive -> empty v8 database**, source drift/corruption rejection, quota/abort, exact committed World/receipt reopen, and fresh Chromium restart.
- Establish an owner-approved **v8-compatible Classic fallback build**, a known good v8 archive export, recovery instructions and strict refusal of downgrading the storage schema. Export before migration when safe, and verify restore in a disposable destination. Do not claim a v8 backup can be restored by a v7 client.
- Secure explicit World/Save owner acceptance for the inherited PR #102 migration and source-verified compact pilot before changing default behavior. Merely having code in a master-based UI candidate does not conclude that decision.

### P0: a new URL/origin does not contain the localhost preview database

Browser IndexedDB and local account/session state are scoped to an **origin**, including scheme, hostname **and port**. The same account/World at `http://127.0.0.1:5244` is **not automatically available** on another port, `localhost` in place of `127.0.0.1`, or a deployed HTTPS site. Neither Git merge nor UI selector copies that database. Current `restoreArchive()` authenticates the complete 16-family graph, checks source identities, accepts the versioned v7 conversion, and admits **only to a completely empty target database**. The A3b browser test contains an explicit v8 backup/export and separate-context restore witness; Connector did not execute it.

Before moving a *user's* test World to another origin, provide a deliberate, user-approved export/import route, ensure the destination account database is empty, confirm receipt and Save graph readback, and do not quietly import, reset, overwrite or disclose existing data. For public deployment, distinguish **local browser accounts** from an unimplemented shared server identity. Do not promise cross-device or cross-origin synchronization.

### P0: merging source is not the same as enabling New UI/functional World publicly

The public ordinary build remains Classic/default, and the reviewed functional World gate requires loopback and compiled feature flags. Plan **two separate acceptance decisions**: (a) code integration into master with the v8 owner and Classic fallback; (b) making the New UI default and permitting any World writes beyond approved local review. A general live production activation, hosted authentication strategy and durable World/Character/Save publication require their own scope, security and owner test evidence. Do not bypass a hostname or compiled mode guard merely to expose the button.

### P1: latest UX browser and TypeScript verification

`apps/rpg-ui/tests/first-world-a3b-ui-browser-qa.py` now asserts the correct eight steps, both mandatory names, three resource progress bars, three-dot menu, exact sub-bar centering, scoped randomizers, no height growth for art tiles, inline Next/double-click and measurable main/rail/overlay scrolling. The selector source uses an explicit grid `height: 100dvh`, fixed-height tiles and independent `overflow-y: auto`. The test declares **6 creator viewports × 2 color themes** at 1440×800, 1280×800, 768×800, 375×667, 320×568 and 667×375, in addition to the earlier 16 World-creation matrix cases. These are **test specifications**, not proof of latest-commit execution. Require fresh screenshots/scroll JSON from actual Chromium on exact candidate head, keyboard/touch/pointer, Classic regression, readback and no unexpected rows/asset drift.

Broad UI TypeScript **183 diagnostics** were last recorded for the preceding eight-stage branch, compared with a matching 183 base at that time. Recompute actual candidate diagnostics against **the exact same base** and capture direct Vite build exit codes. Any new diagnostic is a regression; inherited baseline issues should be separately triaged or explicitly waived per repository policy rather than quietly reported as a green combined build.

## 4. Next implementation/acceptance packet for an authenticated Codex checkout

**Goal:** create one reviewed `master` integration PR and enable mainline development without prematurely publishing or weakening the World owner.

1. Synchronize/review the exact heads above, current prompt, disposition register and all local worktrees. Preserve all local and remote work. If master or candidate moved, inspect the delta and refresh this packet. Do not merge the diverged PR #102/#103 histories.
2. Work in a **new isolated worktree/branch from current master**; reconcile only the accepted 9-commit master descendant. Preserve protected source/manifests, Classic accounts and Save owners, and the reviewed exact v8 producer; no cleanup or unrelated map merges.
3. Run `node --test` on scoped migration/owner, UI/entry, Source and archive suites with the project's documented loader/dependencies, `npm run typecheck:ui:node`, direct ordinary/compiled-review/native-staging Vite builds and no-new-hex checks. Record commands, exit codes, actual counts, failing assertions and same-base TS diagnostics. Do not treat the combined `ui:build` as passed while it exits nonzero.
4. Run actual Chromium on disposable original v7 browser/profile and empty v8 profiles: World creation, reopen across process restart, World selection, eight-stage creator, all six creator viewports × themes, scroll/keyboard/touch, cross-account, source fault, transaction races, archive export/import/restore and existing Classic native-v3 Save creation/continuation. Include a **v8-compatible fallback rollback drill** and cross-origin export/import drill in isolated origins. Never inspect real browser profiles or user Saves.
5. Record the World owner approval to merge the v8 store, read-only vs write admission, source pins and existing Saves. If absent, hold owner-affecting merge and optionally propose a *presentation-only* master PR with World creation read-only, explaining that this does not meet the full functional World goal.
6. Open a **review PR**, not a direct push to master. Review the exact changed file list and required checks. Merge **only with explicit approval**; no PR retargeting, branch cleanup, production deployment, default activation or irreversible data migration authorized by this handoff.
7. After merge acceptance, choose a deliberate **New UI default for development** with Classic fallback and clearly scoped flags; public default activation must be separately authorized. Keep final Character publication/Opening choices held until approved atomic World–Character–native-v3 Save owner.

**Pass boundary:** Source ancestry/provenance and available migration tests are suitable for integration preparation. **Not yet PASS for merge acceptance, host deployment, default World writes, rollback or latest UX Chromium.** A GitHub Connector is unable to independently execute the local tests or preserve a local user's browser profile.

## 5. Safe Connector actions and exclusions

This review is confined to **one new documentation file** committed on an independent branch based at `3789c12b`. The user-visible candidate, current `master`, draft PR #102 and #103, owner migrations, scripts, tests, manifests, game version, account data and local browser profiles have not been modified by Connector. No PR was opened, merged, retargeted or closed, and no production build was activated. Source documentation is an evidence package requiring checkout verification by Codex before use.

## 6. Addendum: exact owner-branch file parity and executable QA entry

**Added 2026-11-23 as a separate read-only Connector pass.** Reconfirmed that `master` was `20abe83c2aa97ba4699711a9815d9b95e0d3df44`, the New UI candidate was `3789c12b99af439ab401f282f8d0302f79f7f210`, and the Connector's audit branch was the only extra documentation branch. No new mainline integration branch or PR was visible in the searched remote refs. An unpublished Codex worktree is not visible to this Connector.

The Connector fetched **four untruncated recursive Git trees** at exact Git commits: candidate (2,344 entries), owner draft PR #102 (2,309), visual draft PR #103 (2,287), and master (2,299). It compared the candidate against PR #102 over the union of files matching:

- `apps/rpg-ui/src/game-shell/cleanEpochAccountStore*`, `cleanEpochAccountAdapter*`, `firstWorldDurableRegistry*`, `world-source/*`, `worldCreatorOwner*`
- `apps/rpg-ui/build/first-world-*`, `apps/rpg-ui/src/worldOwnerReview*`, `apps/rpg-ui/vite.config.ts`
- `docs/design/first-world-*` (related design/manifest scope, not all repo files)

The result is **58 union paths, 51 exact shared Git-blob matches, seven differences**. The seven nonmatches are:

1. `apps/rpg-ui/src/game-shell/worldCreatorOwner.ts` exists on the integrated UI candidate but not on PR #102 (an intentional candidate-side World-to-UI owner bridge, which must be reviewed on its own);
2. `docs/design/first-world-blueprint-scenario-seeded-genesis-design-intent-2026-11-17.md` is candidate/master-only;
3. `docs/design/first-world-contextual-launcher-shell-and-branching-entry-ui-contract-2026-11-17.md` is candidate/master-only;
4. `docs/design/first-world-launcher-implementation-process-map-2026-11-11.md` differs because the candidate retains master;
5. `docs/design/first-world-playable-vertical-slice-implementation-plan-2026-11-17.md` differs because the candidate retains master;
6. `docs/design/first-world-player-first-world-creator-and-library-implementation-gate-2026-11-17.md` is candidate/master-only;
7. `docs/design/first-world-player-journey-ui-base-layout-contract-2026-11-17.md` is candidate/master-only.

**Meaning:** all the shared files in this narrowly defined World-owner source/build/first-World design scope have byte-identical Git objects. This is stronger than merely noting that the 54 manifest pins are unchanged. It does **not** establish that every file in PR #102, every archived migration branch, or every historical design note was integrated. The candidate-only `worldCreatorOwner.ts` bridge and live `EpochApp.tsx` admission callbacks still require the normal functional tests. The PR #102/PR #103 histories are diverged; do not merge them wholesale.

For PR #103, the candidate's `docs/prototypes/lineage-reforged-current-interactive-preview.html` is Git blob `da99a105a05710b93e2cc7f692ff94b391f43f19`, exactly **current master**. Its manifest is also exactly current master at `9f4664568005e730aa260563d3d1a83171bd8977`. Those files do not appear at the historical draft #103 head, and the selected-World React creator is candidate-side implementation, not PR #103 source. Keep PR #103 as a separately held provenance/history lane.

### Local execution prerequisites, discovered from the checked-in harness

The latest `apps/rpg-ui/tests/first-world-a3b-ui-browser-qa.py` source requires **both** explicit CLI parameters `--review-origin` and `--ordinary-origin`, and the matching environment variables `LINEAGE_TASK_OWNED_ORIGIN` and `LINEAGE_TASK_OWNED_DEFAULT_ORIGIN`. It also reads `CHROMIUM_EXECUTABLE`. The optional `LINEAGE_CREATOR_EVIDENCE` directory activates eight-stage screenshots and `scroll.json` output. The browser test refuses non-`127.0.0.1` URLs or URLs containing path elements at those origin arguments. Therefore, starting only one compiled review server is insufficient to run the full QA harness.

For an **already verified clean isolated checkout**, a minimal PowerShell test invocation after **both** compiled origins are built, served on distinct free loopback ports and confirmed to answer HTTP is:

```powershell
$env:LINEAGE_TASK_OWNED_ORIGIN = 'http://127.0.0.1:5244'
$env:LINEAGE_TASK_OWNED_DEFAULT_ORIGIN = 'http://127.0.0.1:5245'
# Set CHROMIUM_EXECUTABLE to the verified local Chromium executable path.
# Optional evidence output, outside tracked repository paths:
$env:LINEAGE_CREATOR_EVIDENCE = Join-Path $env:TEMP ('lineage-creator-evidence-' + [guid]::NewGuid())
python apps/rpg-ui/tests/first-world-a3b-ui-browser-qa.py `
  --review-origin $env:LINEAGE_TASK_OWNED_ORIGIN `
  --ordinary-origin $env:LINEAGE_TASK_OWNED_DEFAULT_ORIGIN
if ($LASTEXITCODE -ne 0) { throw 'Latest New UI Chromium acceptance failed.' }
```

These are **example ports** only, not a claim that any local servers exist or were started. The target at 5244 must be the compiled `world-owner-review` client, and 5245 must be the ordinary compiled client. Require strict port-free checks and ownership of both processes, and choose different ports if those listeners are already in use. Do not kill or take over a user's existing server. The eight-stage QA includes actual World creation, the default-build Classic route and its own disposable browser contexts. An exact installed Chromium binary path and Python Playwright setup must be confirmed by the local runner.

The local checkout must also separately execute `apps/rpg-ui/tests/first-world-a2b-browser-qa.py` for the original-v7 owner probe; its CLI has the same two origin flags. The A2b probe's review source requires its QA fixture and build admission, as documented in the existing owner receipt. Do not assume the above UI test alone proves owner migration.

**Acceptance evidence to attach to the future PR:** exact candidate commit SHA; separate compiled-build commands/output and ports; successful Node/owner/Classic tests; actual Chromium exit codes and test logs for both review and ordinary builds; six selected-World creator viewports × two themes; screenshots plus computed `scroll.json` for each applicable viewport; v7→v8 nonempty-account and native-v3 Save continuity; blocked-tab/abort/quota; backup export/import with empty-target checks; v8-compatible Classic rollback and cross-origin transfer; a same-base 183-diagnostic TypeScript comparison; 55/55 pin readback; and approval of the World-owner migration scope.

**Decision remains unchanged:** preparation-safe source parity has passed, but executable migration/rollback and latest UX acceptance remain for an authenticated Codex checkout. Neither merging master nor production activation is authorized by this appendix.

## 7. Follow-up Connector source inspection after the local v4 TypeScript repair report

**Date: 2026-11-23. Status: CONNECTOR_SOURCE_RECHECK_PASS / LOCAL_V4_EVIDENCE_NOT_YET_PUBLISHED / MERGE_HELD.**

The user supplied a local Codex completion report for the isolated integration branch `codex/new-ui-mainline-final-2026-11-23`, last reported local HEAD `ae74fea0a17b1ec809ec5c12fc1a22fdeb090656` (earlier integration HEAD `c476b18dcd7b2741d569e480fcff0c14db451c53`, runtime/browser commit `cb01fcfd60355e40f555b6edf296045f6bc5b52b`). **These are user-provided local identifiers, not Connector-verified GitHub commits.** The user reports the five-file civilization-engine type repair, nine successor v4 pins, historical 55 pins, exact old/successor tick-zero projection equivalence, historical World/receipt and Classic Save restoration, v7-to-v8 migration, and a TypeScript diagnostic reduction from 183 to 118 without new diagnostics. Do not promote those executable assertions into independent Connector acceptance without first publishing and inspecting the exact commit, source and logs/receipts.

The Connector separately rechecked these *published* facts:

- `master` was `20abe83c2aa97ba4699711a9815d9b95e0d3df44`. The published New UI ancestor `codex/selected-world-creator-ux-2026-11-23` remained `3789c12b99af439ab401f282f8d0302f79f7f210`, 9 ahead and 0 behind master with 61 changed files. The local v4 repair SHA and `codex/new-ui-mainline-final-2026-11-23` branch were not available through GitHub REST; there was no new integration PR. Draft PRs #102 and #103 remained untouched.
- Recomputed **55/55 exact Git blob identities** against an untruncated 2,344-entry candidate tree: v1 41 source/algorithm/JS pins; v2 8 Worker/source pins; v3 5 account/World/Vite pins; and the separately held A1 registry producer. v1, v2 and v3 manifest blobs remain `8dd06caec702c439ed36b59ac24c146b266adffb`, `573ff2566dff73b6f64785180624ee2e379f8311` and `25477117764ad35a91ffab1526f1ae810344c98d`.
- The eight v1-pinned civilization-engine TypeScript files `content.ts`, `starfall-base-economy.ts`, `economy.ts`, `runtime-economy.ts`, `settlement-simulation.ts`, `spatial-world.ts`, `transport-runtime.ts` and `resource-taxonomy.ts` are **byte-identical between published master and the published pre-repair UI candidate**. The additional integration diagnostics cannot be ascribed to changed versions of those eight files in the *published pre-repair* branch; the import/reachability boundary introduced by the World registry is material. No statement about the local repaired bytes is possible until publication.

### Narrow next review and decisions

1. The **next material Connector inspection** starts only after the exact local repair HEAD is pushed. Compare the local SHA against published ancestry, scrutinize the v4 successor manifest, the nine successor pins and any changed shared types/Worker verifier, and verify all **55 historical pins still match**. Independently read the new receipt, strict TypeScript comparison and test artifacts if actually made available in the repository. User-supplied `C:\Codex\EoL\...` paths are not GitHub URLs.
2. In the authenticated checkout, independently confirm the reported **118 vs master 119 diagnostics**, zero new errors, no suppressions/widened exclusions, and that `npm run ui:build` still exits nonzero. Distinguish a **documented exception for unchanged inherited TypeScript debt** from passing the combined build. Do not rerun the complete 108-screenshot browser matrix without a changed surface that invalidates prior evidence; use targeted historical v8/Worker and source-pack checks.
3. **Owner decision remains separate:** a forward-only IndexedDB v7→v8 migration for `lineage.campaigns.epoch1`, with `worldsV8` and `worldCreationReceiptsV8`, changes the real account/Save storage authority. Only a v8-compatible Classic fallback is a valid code rollback; the old v7 binary is not. Accepting the v4 type repair did **not** authorize merging the v8 owner to master. Require the user's separate express scope/approval, and then prepare a reviewed PR rather than a direct master merge.
4. Maintain the production/local boundary: normal public origin World creation, World–Character–native-v3 Save publication, cross-origin account sync and hosted deployment are **not** authorized. No PR #102/#103 merge, retarget, closure or branch deletion follows.
5. Branch lifecycle policy says not to create a branch solely for a chat prompt or another read-only review. This addendum updates the **existing** Connector audit branch, still documentation-only. Its original preflight acceptance fields describe what the Connector itself tested at the time; do not silently reinterpret them as latest local runtime results.

**Disposition:** Source lineage and historical pin closure verified; local successor implementation, migration execution and 118-diagnostic result are Codex-reported, not independently Connector-executed; `MERGE_HELD` pending user approval and a published reviewable integration branch.


## 8. Owner decision: bounded v8 development integration and TypeScript exception

**Decision recorded:** 2026-11-23, by the repository owner in the current review conversation. **Disposition: OWNER_CONDITIONAL_APPROVAL_RECORDED / PUBLICATION_AND_REVIEW_PR_PREPARATION_AUTHORIZED / MERGE_HELD / DEPLOYMENT_HELD.** This is an explicit user authorization of preparation and conditional development-mainline integration scope, **not** a Connector-authored independent execution claim, an approval to merge, or authorization to migrate real player browser databases. Previous source/preflight observations retain their original inspection scope.

### A. Forward-only v8 owner: CONDITIONALLY APPROVED for development-mainline integration only

The owner approves **review-PR preparation** for integration of the existing v8 `lineage.campaigns.epoch1` IndexedDB account owner (14 historical families plus `worldsV8` and `worldCreationReceiptsV8`) subject to the following safeguards:

- Preserve the original v7 account migration, all prior historical World/receipt fingerprints and source identities, v7/v8 archives, native-v3 ready/retired Save history, and ownership/restore gates. Independently review the published exact v4 successor source pack and migration evidence; do not treat local Codex reports as Connector-executed results.
- Retain an accepted **v8-compatible Classic fallback**. A pre-upgrade v7-only executable is not a safe code rollback once an origin's database has upgraded to v8. Merely opening the integrated v8 account store can upgrade the existing database irrespective of which UI was selected.
- Preserve the current development-only/loopback functional World admission gates, read-only Character Creator drafts, account/source protections, and all pre-existing Save ownership restrictions. Do **not** enable public production World writes, World-bound Character/Save publication, unrestricted gameplay, hosted account synchronization, or deployment.
- Do not silently move or reset browser storage, overwrite nonempty archive destinations, or migrate any real player's browser account as part of Connector work. Cross-origin data transfer remains an explicit user-approved archive export/empty-destination restore operation.

### B. Inherited TypeScript baseline: CONDITIONALLY APPROVED development-only exception

Codex **reports** 118 integration diagnostics versus 119 at the exact master baseline, with zero new diagnostics and direct Vite/Node successes. The Connector has **not** executed those local commands or inspected unpublished repaired bytes. The owner's documented exception becomes applicable **only when** the published integration review establishes: (i) identical compiler configuration and exact-base diagnostic comparison, including zero newly introduced diagnostics, rather than a net-count comparison alone; (ii) no new suppressions, widened exclusions, or reduced validation; (iii) truthful recorded command exit codes and a clearly **FAILING** `npm run ui:build` while diagnostics persist; and (iv) inherited debt separately tracked, not silently accepted for future changes or portrayed as release readiness. This is not a green combined build and not an exception permitting new errors.

### C. Authorized shortest path, with explicit final hold

1. Local authenticated Codex checkout: resume the **installed local integration prompt**, not the older published `docs/dev/current-codex-prompt.md` as a replacement. Reconcile the isolated clean worktree `C:\Codex\EoL\.new-ui-mainline-final-20261123`, exact final commit `ae74fea0a17b1ec809ec5c12fc1a22fdeb090656`, and current remote master; preserve all worktrees/local changes. If the installed prompt has changed materially, disclose the conflict rather than improvising a broad new implementation.
2. If the local integration remains the accepted clean, master-based candidate and preserves all required gates, **publish that exact branch via a normal non-force push** of `codex/new-ui-mainline-final-2026-11-23` and read back its remote SHA. Do not publish a different or silently rebased candidate. Supply the exact test/receipt artifacts, TypeScript baseline record, failure status, source pin manifest, and fallback/migration proof for review. Do not rerun the complete unchanged Chromium screenshot matrix solely to reproduce already accepted evidence.
3. Connector: after branch publication, independently compare published commit ancestry/file scope against current `master`, inspect all 55 historical pins and the nine successor v4 pins, inspect the five repaired civilization-engine files and relevant verifier/Worker/shared type references, inspect actual published logs/receipts and exact old/successor identity/fingerprint evidence, and check the TypeScript comparison/exceptions. Connector source inspection is distinct from locally executing tests.
4. Prepare **one** integration review PR targeting `master` with the explicit conditional approvals and failing combined-build exception. PR may be opened only after exact-branch publication and source/acceptance reconciliation; it is not merge approval. Draft #102/#103 remain unchanged, protected, open and unmerged. Do not force-push, merge, deploy, change default production behavior, enable held writes, delete worktrees/branches, or change real account storage.
5. **Final decision remains `MERGE_HELD` until the owner expressly approves the reviewed PR.** After an authorized merge, subsequent New UI development can begin from the then-current `master`, with development UI default decisions still separate from public production activation and irreversible Character/Save publication.

**Live GitHub check at decision capture:** master still resolves to `20abe83c2aa97ba4699711a9815d9b95e0d3df44`; the final `codex/new-ui-mainline-final-2026-11-23` branch and matching open New UI integration PR are not yet visible. This addendum is documentation-only on the existing Connector audit branch and does not modify `master`, the Codex integration candidate, or protected draft PRs.
