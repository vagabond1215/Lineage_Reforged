## 2026-10-06 — G9 independent parent re-audit gate

**F2_F3_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD.** DEV-0.7.1.4 repair is pushed and read back at `39d886350a7dfb7d94c1514df3e9c5833456177e`. Both reset and delete now require current deleted-generation authority and exact retained destination address history before erasure. Native repair controls and corruptions pass **80/80**; this is repair evidence only. The installed `DEV-0.7.1.5` prompt requires an independent G9A–F parent audit before any `G9_PARENT_ACCEPTED` decision. G10, deployment, planned-primary and Game-version acceptance remain held; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged.

## 2026-10-06 — G9 residual graph preflight repair gate

**G9_PARENT_REPAIR_REQUIRED; G10_ACTIVATION_HELD.** Independent DEV-0.7.1.3 re-audit of repaired hosted source `cf6e27b4` confirmed two reset/delete fail-open states: missing current deleted-generation authority after a valid G9E address deletion, and a forged descendant prior-destination address binding. The focused record is `docs/design/dev-0.7.1.3-g9-lifecycle-parent-independent-reaudit.md`. Install only `DEV-0.7.1.4` preflight repair, then repeat an independent parent audit. No G10, deployment, planned-primary or Game-version acceptance; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged.

## 2026-10-05 — G9 F1 repair and parent re-audit gate

**F1_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD.** DEV-0.7.1.2 on synchronized `master` `f528df39` repaired whole-account reset/delete with an account-wide campaign-graph preflight before erasure. Coherent valid/corrupt browser cases pass 64/64, including historical slot reuse and zero-address terminal cleanup; selected App blocked presentation, focused Node and build checks pass. The focused evidence is `docs/dev/dev-0.7.1.2-g9-destructive-graph-preflight-repair-record.md`. The next support run independently re-audits G9 parent. Neither this repair nor prior G9 slice checks accept planned `DEV-0.7.1` or authorize G10, deployment or Game-version change. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged.

## 2026-10-05 — G9 parent audit repair gate

**G9_PARENT_REPAIR_REQUIRED; G10_ACTIVATION_HELD.** Synchronized source `de5b1cab`; `docs/design/dev-0.7.1.1-g9-lifecycle-parent-acceptance-audit.md` documents F1. Both whole-account destructive actions succeeded after required campaign-graph authority was removed, erasing surviving version-1 rows. The installed route is `DEV-0.7.1.2` destructive graph-preflight repair, followed by independent G9 parent re-audit. Planned `DEV-0.7.1`, G10, deployment and Game-version acceptance remain held; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. Older G9F-next pointers remain historical.

## 2026-10-03 — G9E.1 slot generation hardening closure

**G9E_1_HARDENING_VERIFIED; G9F_NEXT; ACTIVATION_HELD.** On synchronized `master` `2614b788`, direct envelope/recovery versus slot-generation CAS proof, witnessed published two-address v5 migration, eight-write terminal closure rollback/retry, lost post-commit readback and selected-App reused-slot presentation passed the focused gate. Native G9E 13/13, G9D 14/14, adjacent browser 130/130, Node 174/174, Node UI-config and app-local Vite pass; broad UI remains 137 known diagnostics. The accepted G9A account-wide reset/delete and session-invalidation contract now owns G9F. No G9F implementation, G10 activation, capacity/backup, death caller, combat, parent or Game-version acceptance occurred; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` remain unchanged.

## 2026-10-02 — G9D terminal implementation

**RETIREMENT_TERMINAL_OWNER_AND_SELECTED_APP_VERIFIED; G9E_NEXT; ACTIVATION_HELD.** Source `e0872879`; focused record `docs/dev/dev-0.7.1-slice-g9d-terminal-publication-settlement-record.md`. The selected App now retires an exact ready current head through additive v5 terminal recovery, closed publication, derived once-only account settlement and exact closed readback. Native 12/12 focused, 130/130 adjacent, selected-App ordinary/failure/retry, Node 127/127, Node UI-config and Vite pass; broad UI retains 137 known diagnostics. Implement G9E address deletion and inheritance-use consumption next, including post-deletion terminal validation. G9F, G10, combat, deployment, planned parent and Game-version acceptance remain held; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged.

## 2026-10-02 — G9D terminal store prerequisite

**G9D_SCHEMA_CONTRACT_REQUIRED; TERMINAL_IMPLEMENTATION_HELD.** Starting synchronized `master`/`origin/master` `59cf8c77`, G9D confirmed that v4 has no lifecycle recovery store and ordinary descendant validation excludes closed terminal artifacts. Retained archive calculation still consults localStorage, so it cannot own clean-epoch retirement settlement. The focused `docs/design/dev-0.7.1-slice-g9d-terminal-store-prerequisite-decision.md` decides an additive v5 store with unique source index, terminal publication/recovery atomicity, pure retirement projection and account CAS/readback. Implement that bounded G9D route before G9E. G9E/F, G10, combat, deployment, planned parent and Game-version acceptance remain held; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. This supersedes G9D-next wording below.

## 2026-10-01 G8F.1 actual App failure UI closure

**G8F_ACTUAL_APP_FAILURE_UI_VERIFIED; G9_AND_ACTIVATION_HELD.** Source `9cd07551000ede0e211f0da8ba278c679ea1d914`, code `a9070e33`. The selected App now recovers pending descendants from the exact destination address even when older source addresses also display a pending shared head. Actual App quota/abort, prepared/pending/restart, two-tab contention and stale account/head/destination failure UI passed; owner browser 130/130 and Node 116/116 pass; broad UI remains 137 known diagnostics. Install **G9A lifecycle/destructive-transition authority decision** before G9 code. G10 deployment/post-epoch durability, combat and planned parent acceptance remain held; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. This supersedes G8F.1-active wording below without rewriting chronology.

## 2026-10-02 — G9A lifecycle/destructive authority

G9A accepted the clean-epoch lifecycle boundary without production implementation. Normal defeat recovery is first because the existing campaign-session owner already defines receipt/destination/continuity semantics and the selected App currently blocks this ordinary nonterminal route. Terminal settlement, address deletion and whole-account destruction remain distinct later packages. See `docs/design/g9a-epoch-lifecycle-and-destructive-transition-authority-decision.md`. G10 activation/durability and combat remain held.


## 2026-10-01 G8F real App caller checkpoint

**REAL_ASYNC_APP_ORDINARY_PATH_VERIFIED; G8F_FAILURE_UI_ACCEPTANCE_HELD.** Source `2dcbee6c97a8680bce0a2066d3bad6b3ae9cd734`; code checkpoint `08329e90`. The local selected App now awaits clean-epoch account, inventory, first campaign, exact load and ordinary descendant save; actual UI proved manual/quick address retention, non-head fork, witnessed Soundings first/later save, restart and a two-tab stale refusal. Native bootstrap faults fail closed. Owner suites 130/130 and Node 116/116 pass; broad UI retains 137 known diagnostics. Install **G8F.1 actual-App failure UI and recovery proof** before G9. G10 activation/post-epoch durability, combat and planned parent acceptance remain held; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. This supersedes G8E-active wording below without rewriting chronology.

## 2026-09-30 G8E cross-slot campaign address owner checkpoint

**CROSS_SLOT_CAMPAIGN_ADDRESS_OWNER_VERIFIED; REAL_APP_AND_ACTIVATION_HELD** from synchronized starting source `fe78984d953097975ae993ecce8757ab32c2f560`, code checkpoint `1a38a677a9f1415bd5a21332418210067220fa42`. Manual/quick slots now retain distinct immutable artifact addresses against one singular campaign head, with destination CAS, exact pending recovery, destination account history, non-head load/fork and G8D Soundings witness retention. Native browser 130/130 and adjacent Node 116/116 pass; broad UI retains 137 baseline diagnostics. Installed **DEV-0.7.1 Slice G8F — Real Async App Caller Cutover And Ordinary UI QA**. G9 lifecycle/reset/delete, G10 activation/post-epoch durability, combat and planned parent acceptance remain held. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes G8D-active wording below without rewriting chronology.


## 2026-09-30 G8D witnessed descendant owner checkpoint

**FIRST_WITNESSED_DESCENDANT_OWNER_VERIFIED; CROSS_SLOT_AND_LIVE_APP_HELD** from synchronized starting source `1ad268e956cfd4396feadad0dbcd3764a90bd5b9`, code checkpoint `745e1b4d`. The first post-creator Soundings completion now uses independently admitted session evidence, transactionally promoted to immutable applied first-durable provenance with the descendant head and pending recovery. Native witnessed QA 9/9, adjacent browser 111/111 and Node campaign/Soundings 116/116 pass; broad UI typecheck retains its 137 baseline diagnostics. G8E must implement the accepted cross-slot manual/quick address contract before G8F real App cutover and ordinary UI QA. G9 lifecycle and G10 activation/post-epoch durability remain separate; combat and planned `DEV-0.7.1` parent acceptance remain held. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged.

## 2026-09-30 G8C planning reconciliation

G8C closes the two decision blockers discovered by G8B without activating callers. Accepted architecture: independent session Soundings witness -> atomic first witnessed descendant/applied witness/recovery; and singular campaign head -> durable manual/quick slot addresses with optimistic destination CAS and no history pruning. Execute G8D then G8E before G8F App cutover. G9 lifecycle/reset/delete, G10 coordinated activation/durability and Slice C combat remain downstream. Parent `DEV-0.7.1`, Game `0.1.1-prealpha`, playability and accepted DEV remain unchanged.

# Current Planning Anchor Reconciliation

## 2026-10-02 DEV-0.7.1 Slice G9E prerequisite

Hardened G9D is verified on synchronized `4ebfc220` (terminal 14/14, adjacent browser 130/130, Node 127/127; build and UI-config pass; broad UI known 137 diagnostics). G9E address deletion is held on the accepted v5 slot-key contradiction: historical first attempt/recovery must survive deletion, but their `[accountId,slotId]` keys prevent a replacement campaign. The focused G9E address-generation decision installs additive v6 generation authority before player deletion and terminal cleanup. G9F, G10, parent and Game-version acceptance remain held.


## 2026-09-30 DEV-0.7.1 Slice G8B descendant caller checkpoint

**SAME_SLOT_DESCENDANT_CALLER_VERIFIED; LIVE_APP_CUTOVER_HELD** from clean synchronized source `55c558fb335ac9b285d38a6b215d72424cbff920`. G8B adds an inert guarded same-slot ordinary descendant caller with exact ready readback and a durable current-pending recovery lookup. Native descendant 8/8, G8A 7/7, first campaign 5/5, account 13/13, clean epoch 52/52, publication 12/12, canonical 14/14, adjacent campaign 51/51 and Soundings 53/53 pass; Node config typecheck and Vite build pass. The owner still lacks a cross-slot quick-save address contract and first post-creator Soundings witness introduction. Installed **DEV-0.7.1 Slice G8C — First Witnessed Descendant And Cross-Slot Authority Decision** before further owner implementation and real App UI cutover. G9 lifecycle/reset/delete, G10 deliberate development-only activation and post-epoch long-run/two-browser capacity, quota/eviction and backup/restore remain held. Slice C combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the G8A-active pointer while preserving chronology.


## 2026-09-30 DEV-0.7.1 Slice G8A launcher read checkpoint

**EPOCH_LAUNCHER_READ_BOUNDARY_VERIFIED; LIVE_APP_CUTOVER_HELD** from clean synchronized source `8e8ce9f39ebb760edd40bf3a978e68d655bee21e`. G8A adds an inert awaited epoch session/inventory/load reader with explicit blocked status and no default account or empty-slot fallback. Native adapter 7/7, first campaign 5/5, account 13/13, clean epoch 52/52, publication 12/12, canonical 14/14, adjacent campaign 51/51 and Soundings 53/53 pass; Node config typecheck and Vite build pass. Real App ordinary caller conversion and native UI acceptance remain **G8B**. G9 lifecycle/reset/delete, G10 deliberate development-only activation and post-epoch long-run/two-browser capacity, quota/eviction and backup/restore remain held. Slice C combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the G7B-active pointer while retaining chronology.


## 2026-09-30 DEV-0.7.1 Slice G7B first-campaign orchestration checkpoint

**INERT_FIRST_CAMPAIGN_ORCHESTRATION_VERIFIED; LIVE_CALLERS_HELD** from clean synchronized source `5a5f6b10e92bddbfee58051d3014699850351753`, code checkpoint `c25fc296`. The G7B adapter reserves and resumes an exact first-campaign attempt, publishes and completes mandatory consumers, then reads a verified ready slot. It fences account profile/password mutations while first or descendant recoveries are pending; sign-in retains the account revision. Selected Legacy preparation and one-use inheritance are exercised in native Chromium. Pure creator attempts have no completed Soundings turn-in; the adapter blocks incompatible retained evidence and does not invent a witness. Native first-campaign 5/5, clean-epoch 52/52, account 13/13, publication 12/12, canonical 14/14, adjacent campaign 51/51 and Soundings 53/53 pass; Node config typecheck and Vite build pass. Installed **DEV-0.7.1 Slice G8 — Async App Bootstrap, Load And Ordinary Campaign Actions**. G9 lifecycle/reset/delete, G10 deliberate development-only activation and post-epoch long-run/two-browser capacity, quota/eviction and backup/restore remain. Slice C combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the G7A-active pointer below while retaining chronology.


## 2026-09-30 DEV-0.7.1 Slice G7A epoch account/auth adapter checkpoint

**INERT_EPOCH_ACCOUNT_AUTH_ADAPTER_VERIFIED; FIRST_CAMPAIGN_AND_LIVE_CALLERS_HELD** from clean synchronized source `0b60cfad8fa35bd5eb472d4502db2b22e39cf60d`, code checkpoint `b0ed5ca8`. The epoch account adapter registers exact caller-held identity, verifies PBKDF2 credentials without reading legacy keys, validates the epoch session hint against retained account state, and exposes revisioned profile/password mutation with typed blocked results. Sign-in does not change account revision. Native Chromium adapter QA 13/13, clean-epoch 52/52, publication 12/12, adjacent 68/68, Node typecheck and Vite build pass; broad UI remains at 137 baseline diagnostics with zero in changed production files. Installed **DEV-0.7.1 Slice G7B — Inert First-Campaign Orchestration And Pending-Account Fence**. Soundings witness retention/lost-caller recovery and atomic mutation guard are the next bounded package; App, lifecycle, development reset and post-epoch long-run/two-browser capacity, quota/eviction and backup/restore remain G8-G10. Slice C combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the G6-active pointer below while retaining chronology.


## 2026-09-30 DEV-0.7.1 Slice G6 descendant transactions and history

**INERT_ORDINARY_DESCENDANT_RECOVERY_AND_HISTORY_VERIFIED; LIVE_CALLERS_HELD** from inspected clean synchronized `master` `692a14f34f34d8f0b1c89e999530f96096d206e4`, code checkpoint `878ca3623c2b5e1a6bab183764acfcfb2e29e05c` and `c6aa39f190ee705765bff4afade75586f23d33a8`. The clean-epoch owner now retains every ordinary descendant and its source/recovery, completes account history/Chronicle/Legacy receipts atomically, and verifies current and non-head/fork loads against the full chain and first Soundings witness. Native Chromium 52/52, publication 12/12, adjacent 68/68, Node typecheck and Vite build pass. No live App/launcher/save caller uses it. Installed **DEV-0.7.1 Slice G7 - Epoch Account, Auth And First-Campaign Orchestration Adapters**; G8-G10 async App/lifecycle, development reset, two-browser/long-run durability, quota/eviction and backup/restore remain. Slice C combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the G5-active pointer below while retaining chronology.


## 2026-09-30 DEV-0.7.1 Slice G5 first-head slot reads

**FIRST_HEAD_READ_SURFACE_VERIFIED_IN_INERT_EPOCH; DESCENDANT_AND_LIVE_CALLERS_HELD** from inspected clean synchronized `master` `80274c0923e5c84cc1e91db45b28806a6088e21a`, code checkpoint `af285bb92af9c81c6fd9147f012dfb5ff674a742`. The clean-epoch owner now has readonly account-scoped slot inventory and verified playable first-head load only after complete account consumers, Soundings provenance and first-run history are retained. Prepared/pending/closed/descendant statuses stay nonplayable. Native Chromium 42/42, publication 12/12, adjacent 68/68, Node typecheck and Vite build pass; no real caller uses it. Installed **DEV-0.7.1 Slice G6 - Inert Descendant Publication And General Recovery Transactions**. Development reset, async caller conversion, post-epoch non-head/fork and long-run durability, Slice C combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the G5-active pointer below, retaining chronology.


## 2026-09-30 clean-epoch async caller package decision

**ASYNC_CALLER_ROUTE_SELECTED; LIVE_ACTIVATION_HELD** at inspected clean synchronized `master` `631477f168ef9f828e053a7384a0b5aa9c4fecc6`. `clean-epoch-async-caller-ownership-and-activation-package-decision.md` is the focused cross-owner map. Inert G4 first-campaign consumer completion is not an App cutover. Installed **DEV-0.7.1 Slice G5 - Inert Clean-Epoch Slot Inventory And Verified First-Head Load**, followed by guarded descendant/history, account/auth/attempt, App ordinary actions, lifecycle/reset/delete and coordinated activation with post-epoch durability checks. Sole-user pre-cutover data is disposable; post-epoch non-head/fork history, Soundings, recovery, backup/restore and two-browser long-run capacity remain mandatory. No code, browser reset or deployment now. Slice C combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the G4 decision-active pointer below while preserving chronology.

## 2026-09-29 DEV-0.7.1 Slice G4 clean-epoch consumer completion

**FIRST_CAMPAIGN_CONSUMERS_COMPLETE_IN_INERT_EPOCH; LIVE_CALLER_ACTIVATION_HELD** from clean synchronized source `f23670f1ffa29465798b84f86d9604b0f1e1280d`, code checkpoint `920f6301`. The inert clean-epoch owner atomically completes the accepted first campaign's full account/history/preparation/inheritance/receipt plans with recovery; native Chromium 35/35, publication 12/12 and adjacent 68/68 pass. No live caller selects it. Installed unversioned **Clean-Epoch Async Caller Ownership And Activation Package Decision** to select the real async caller sequence. The development-only reset has not occurred. Account reset/delete, backup/restore, long-run capacity, two-browser acceptance, Slice C combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP` and accepted `DEV-0.7.0` remain unchanged.

## 2026-09-29 DEV-0.7.1 Slice G3 first-publication recovery checkpoint

**FIRST_PUBLICATION_RECOVERY_CHECKPOINT_IMPLEMENTED; CONSUMER_COMPLETION_AND_ACTIVATION_HELD** from clean synchronized source `d31ab58331e1da401ac4e61f33f0ee4bfe3e3ed2`, code checkpoint `a49acbc4`. Inert `lineage.campaigns.epoch1` v3 atomically stores the first artifact/head/slot, independent Soundings witness and pending recovery for an exact prepared attempt. Native Chromium 27/27, existing publication 12/12 and adjacent 68/68 pass. The retained recovery says consumers are pending; it does not accept a complete campaign. Installed **DEV-0.7.1 Slice G4** for atomic complete profile/Chronicle/Legacy consumer transitions. Real async callers, reset/delete, backup/restore and two-browser long-run capacity remain later gates. Development-only reset has not occurred. Slice C capacity, combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged.

## 2026-09-29 DEV-0.7.1 Slice G2 clean-epoch attempt checkpoint

**ACCOUNT_SLOT_ATTEMPT_CHECKPOINT_IMPLEMENTED; RECOVERY_CONSUMERS_AND_ACTIVATION_HELD** from clean synchronized source `a7a0969bebe48c3a36a2760e4c46d31d5b8fcc3d`, code checkpoint `8affd8c4`. The inert `lineage.campaigns.epoch1` v2 owner adds one prepared new-campaign attempt per account slot with durable identity, account revision, empty head, exact retry and contention checks. Native Chromium 18/18, existing publication 12/12 and adjacent 68/68 pass. No attempt is accepted as a publication; recovery/consumer transactions are installed as **DEV-0.7.1 Slice G3**. Real async callers, reset/delete, backup/restore and two-browser long-run capacity remain later gates. Development-only reset has not occurred. Slice C capacity, combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged.

## 2026-09-29 DEV-0.7.1 Slice G1 clean-epoch account checkpoint

**CLEAN_EPOCH_ACCOUNT_CHECKPOINT_IMPLEMENTED; ATTEMPT_RECOVERY_AND_ACTIVATION_HELD** from clean synchronized source `04d36930b8e5dd53f8508e820ddb41e8a37d64e2`, code checkpoint `b1aa1ec4`. A distinct IndexedDB epoch now holds an atomic complete profile/credential account record with revision compare-and-swap and fail-closed read/list/selection. Synthetic native Chromium QA passed 10/10; existing publication QA 12/12 and adjacent tests 68/68 passed. No live caller selects it. Installed **DEV-0.7.1 Slice G2 - Clean-Epoch Attempt And Recovery Transactions**; later real async callers, reset/delete, backup/restore and two-browser long-run capacity remain. The development-only reset has not occurred. Slice C capacity, combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the G1-active pointer below while preserving chronology.

## 2026-09-29 Development-only clean persistence epoch route decision

**CLEAN_DEVELOPMENT_EPOCH_ROUTE_ACCEPTED; IMPLEMENTATION_AND_ACTIVATION_HELD** at clean synchronized source `18ef8008e398cf13c316374a403d7069e7fedc7d`. The owner confirmed sole-user development/testing use and waived preservation of all pre-cutover browser-local test data. Close old tabs, deploy the new build, clear per-origin development data once, then launch and register fresh accounts/campaigns at later activation. New authority uses a fresh versioned IndexedDB database and epoch-specific account/session keys, never old storage fallback. Legacy copy/canonical work remains inert history, not a required importer; old-bundle archaeology and all-client exclusion are no longer product gates. Full new-epoch durability, real async callers, recovery, backup/restore, long-run capacity and two-browser acceptance remain. Installed **DEV-0.7.1 Slice G1 - Clean-Epoch Transactional Account Store Extension**; no reset or activation now. Slice C capacity and combat/parent holds, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the prior old-client route pointer while retaining its historical evidence.

## 2026-09-29 Legacy writer fence and async caller cutover feasibility decision

**SAME_ORIGIN_OLD_WRITER_EXCLUSION_UNPROVEN; CLEAN_EPOCH_ALLOWED_IN_PRINCIPLE; ACTIVATION_HELD** at clean synchronized source `37549a2cc6b82eb090df9384aa23aa1dc74a2fc1`. The owner's waiver removes backward preservation/migration/export of pre-cutover saves only; new-epoch full history and long-run durability remain mandatory. Existing same-origin old tabs cannot be stopped by new markers or Sites deployment metadata, and there is no cross-API transaction between localStorage and IndexedDB. A disjoint new DB plus auth/account namespace is a candidate non-interference route, pending exact old-bundle proof and owner gate; it is not old-writer exclusion. The installed next route is unversioned **Clean Persistence Epoch Namespace And Deployed Old-Client Capability Decision**. No activation, legacy deletion, combat, Slice C capacity or parent acceptance. Game `0.1.1-prealpha`, `INTEGRATED_LOOP` and accepted `DEV-0.7.0` unchanged. This supersedes the old-save-migration and writer-fence-active pointers while preserving their historical evidence.

## 2026-09-29 DEV-0.7.1 Slice F inert canonical materialization

**INERT_CANONICAL_MATERIALIZATION_IMPLEMENTED; ACTIVATION_HELD** at clean synchronized source `122082a611bf72b981a5f783b12c5506ceec5519`, code checkpoint `d81c5ea2`. IndexedDB v3 adds exact, generation-scoped canonical records/manifests for all v2-staged legacy source families with independent readback and named account/unscoped blockers. Fresh native Chromium canonical/copy/publication QA passed 14/14, 15/15 and 12/12. It has no live caller or selector. The next installed route is unversioned **Legacy Writer Fence And Async Caller Cutover Feasibility Decision** before G. Older-tab fence, async callers, reset/delete, export/restore, two-browser capacity and combat acceptance remain separate. Planned parent `DEV-0.7.1`, Game `0.1.1-prealpha`, `INTEGRATED_LOOP` and accepted `DEV-0.7.0` are unchanged. This supersedes Slice-F-active wording while preserving chronology.

## 2026-09-29 Legacy campaign canonical materialization and activation boundary decision

**CANONICAL_MATERIALIZATION_CONTRACT_ACCEPTED; ACTIVATION_HELD** at inspected clean synchronized source `307be4860c5fb7ca2ade90461ae57873a32cfbea`. The focused decision accepts a separate version-3 inert canonical materialization/readback slice covering every legacy account/campaign family, non-head/fork history and quarantined unknown raw; the installed successor is **DEV-0.7.1 Slice F - Inert Canonical Materialization And Exact Readback**. Live activation waits for old-writer fencing, complete blocker repair, async callers, account reset/delete, export/restore, rollback and two-browser long-run acceptance. Older open code cannot be controlled by a new marker. Slice C capacity and combat/parent holds; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. This supersedes the Slice-E decision pointer while preserving chronology.


## 2026-09-29 DEV-0.7.1 Slice E inert legacy authority copy

**INERT_COPY_IMPLEMENTED; ACTIVATION_HELD** at inspected source `87ddc774dec662bdc68d0ae30428505ff0c5d0c2`. IndexedDB schema v2 adds inert exact-raw legacy staging and verified/blocked manifest status while v1 publication behavior remains intact; 15/15 new and 12/12 existing native Chromium QA passed. No live caller or source data is cut over. The next installed route is the unversioned **Legacy Campaign Canonical Materialization And Activation Boundary Decision**. Canonical schema, async callers, stale-tab fencing, account reset/delete, export/rollback, two-browser long-run capacity and combat acceptance remain separate. Planned parent `DEV-0.7.1`, Game `0.1.1-prealpha`, `INTEGRATED_LOOP` and accepted `DEV-0.7.0` remain unchanged. This supersedes older Slice-E-active wording while retaining chronology.


## 2026-09-29 Legacy campaign store migration boundary decision

**MIGRATION_COPY_CONTRACT_ACCEPTED; ACTIVATION_HELD** at inspected synchronized source `a2ce0de324fe7c04fc43a9b28d573616c0095e2e`. `docs/design/legacy-campaign-store-migration-boundary-decision.md` selects an additive IndexedDB v2 inert exact-raw copy and account-wide verification stage because Slice D's v1 publication owner cannot retain every legacy, account, recovery or non-head family. Installed next route: **DEV-0.7.1 Slice E - Inert Legacy Authority Copy And Verification**. Activation, async callers, reset/delete coordination, export/rollback, two-browser long-run capacity and combat acceptance remain separate. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` and planned parent `DEV-0.7.1` remain unchanged. This supersedes the older migration-decision-active route while preserving chronology.


## 2026-09-29 DEV-0.7.1 Slice D transactional store foundation

**TRANSACTION_FOUNDATION_IMPLEMENTED; LIVE_CUTOVER_HELD** at code checkpoint `db129b43` from synchronized source `54c4595f122b194d33a520352b11ed43e755632e`. A versioned, account-scoped IndexedDB owner commits artifact, head/control, slot and applied Soundings witness atomically and verifies exact readback; native Chromium QA passed 12 cases. It has no live localStorage caller, migration or capacity acceptance. The installed successor is the unversioned **Legacy Campaign Store Migration Boundary Decision**. Slice C quota failure and combat admission hold remain; parent `DEV-0.7.1`, Game `0.1.1-prealpha`, `INTEGRATED_LOOP` and accepted `DEV-0.7.0` are unchanged. This supersedes older Slice-D-active route wording while retaining chronology.

## 2026-09-29 Ordinary campaign publication capacity and retention decision

**RETENTION_BOUNDARY_ACCEPTED; HIGHER_CAPACITY_BACKEND_REQUIRED; COMBAT_ADMISSION_HELD** at inspected source `a16523d8e08b14816a75db95e0b135c09ae40fc9`. The focused contract preserves legitimate durable campaign/history and Soundings provenance, permits only proven-redundant completed candidate bounds, and requires transactional higher-capacity local storage for long-running campaigns. The installed next route is **DEV-0.7.1 Slice D - Transactional Campaign Store Foundation**; later verified migration/cutover, candidate cleanup and stress acceptance precede combat admission. The 5 MiB Slice C result remains a current-backend failure, not a product budget. Parent, game version and playability posture unchanged. This supersedes earlier decision-pending route wording.

## 2026-09-29 Ordinary campaign retention direction clarification

**DIRECTION_RECORDED; RETENTION_DECISION_NOT_STARTED** at synchronized source `f0d8b4c82ba3683e1ec0a5df084625423f0d6a6e`. The installed unversioned decision now distinguishes safe bounds for proven redundant publication copies from the separate need for a higher-capacity backend for long-running durable campaigns. The 5 MiB failure remains a current-backend gate, not the product save-size budget. Accepted campaign/history data and independent provenance must be preserved. Combat admission and parent acceptance remain held; game version, playability and accepted milestone are unchanged. This entry supersedes earlier route wording that implied compaction alone was the complete capacity answer.

## 2026-09-28 DEV-0.7.1 Slice C capacity preflight

**CAPACITY_GATE_FAILED; COMBAT_ADMISSION_HELD** at checkpoint `bb24c483d7d683466d28dcace57fc1e6a723de0a` from source `fead51012561ca584359fcadf51d801b196ac21d`. Fifty saved ordinary nearby explorations retained 5,150,828 / 5,242,880 UTF-16 bytes; the next publication hit quota. The prior head remained verified, and a separate no-consumer retry completion omission was repaired. The installed unversioned **Ordinary Campaign Publication Capacity And Retention Contract Decision** must settle bounded evidence retention and quota recovery before combat admission/outcome work. Planned parent, game version and playability posture remain unchanged. This entry supersedes older route wording below.

## 2026-09-28 DEV-0.7.1 Slice B ordinary reachability

**ORDINARY_CONTEXT_REACHABLE; COMBAT_ADMISSION_HELD** at implementation checkpoint `400fc0facd5119333fb5591afd216a10a79582a0` from inspected synchronized source `f4b510ee081ea0c46a47807b719b24509c7979d3`. The World nearby-exploration command now reaches the authored edge from an ordinary Stonevein creator start and returns eligible candidate or no-match without combat. One representative context does not become a universal first encounter. The installed **DEV-0.7.1 Slice C - Repeatable Encounter Capacity Preflight** owns the storage reopening trigger before admission/outcome work; parent acceptance and game-version change remain held. This entry supersedes older route wording below.

## 2026-09-28 DEV-0.7.1 Slice A static context authorship

**STATIC_CONTEXT_AUTHORED; ORDINARY_REACHABILITY_PENDING** at implementation checkpoint `c9b38166` from inspected synchronized `05836a6976ee45014012af4b13a77fc5a746e2b3`. The exact Stonevein nearby-exploration edge context now has explicit `frontier_track`, local hazard provenance, schema and semantic lint. No action or ordinary caller exists yet. The installed **DEV-0.7.1 Slice B - Ordinary Nearby Exploration Reachability** owns that executable seam and the habitat-aware selector gate. Parent milestone, 5 MiB repeatability, combat admission/outcome and game-version acceptance remain open. This current entry supersedes older route wording below.

## 2026-09-28 Ordinary encounter context authorship

**AUTHORED_CONTEXT_DECIDED; IMPLEMENTATION_HELD** at inspected source `3976619afbabb063624fcb15e10bd619b5f7e133`; see `docs/design/ordinary-encounter-context-authorship-decision.md`. The project owner chose deliberate **Explore nearby environs** from Stonevein onto the Ore Ridge–Caravan Marches pass with explicit `frontier_track` habitat for that action/place. This is one reference, not a universal first encounter. The installed next prompt is planned `DEV-0.7.1 Slice A - Ordinary Encounter Context Static Authorship`; subsequent action/caller/resolver, capacity and combat gates remain separate. No current combat implementation, accepted milestone or game-version change is claimed. This current entry supersedes older route wording below.

## 2026-09-28 Ordinary encounter owner contract

**CONTRACT_ACCEPTED; IMPLEMENTATION_HELD** at source `fefd6bae0acca2bef53bb1eadc922350d557dffc`; see `docs/design/ordinary-encounter-admission-and-outcome-ownership-contract-decision.md`. User direction requires context-driven encounter eligibility and truthful no-match results, with Stonevein only a reference case. The sole active successor is the unversioned documentation-only **Ordinary Encounter Context Authorship Decision**. A positive ordinary encounter and repeatable storage gate remain open; no combat implementation, milestone or game-version change is installed. This current entry supersedes older route wording below.

## 2026-09-28 Ordinary combat/challenge package decision

**COMBAT_CHALLENGE_PREREQUISITE_REQUIRED** at source `b0692e9fad000e364e4e871eba11cdfb1ca1682f`; see `docs/design/ordinary-combat-challenge-and-recovery-package-decision.md`. The sole active successor is the unversioned **Ordinary Encounter Admission And Outcome Ownership Contract Decision**, documentation only. No combat implementation, vertical-slice acceptance, new development milestone or game-version change is installed. This current entry supersedes older no-active-successor wording and preserves the accepted Soundings/Activity chronology below.

## 2026-09-28 Activity presentation repair closure

**PRESENTATION_REPAIR_VERIFIED**: Activity Revenue Presentation Truthfulness Repair is complete at code commit `c2d07ac8d4b4e1a404687cbd9d86c533feeb9222`; the focused record contains the authorized ordinary active-survey browser proof. No active executable successor is installed. Remaining ranked gaps retain the explicit reopening triggers in `docs/design/post-soundings-playability-gap-prioritization-decision.md`. Game 0.1.1-prealpha / INTEGRATED_LOOP / DEV-0.7.0 unchanged. This entry supersedes the older active-route wording below without rewriting completed chronology.

## 2026-09-28 Current prioritization update

**PLAYABILITY_PRIORITY_SELECTED**: Post-Soundings prioritization is complete. Active successor: **Activity Revenue Presentation Truthfulness Repair**. Controlling decision: `docs/design/post-soundings-playability-gap-prioritization-decision.md`. Correct only fabricated Daily Revenue presentation; remaining ranked gaps retain explicit reopening triggers. Game 0.1.1-prealpha / INTEGRATED_LOOP / DEV-0.7.0 unchanged. This current update supersedes older active-route wording below; completed chronology remains historical.


Date: 2026-09-28

Status: accepted coordination authority; DEV-0.7.0 complete; Soundings durable completion independently accepted; Game 0.1.1-prealpha accepted; post-Soundings prioritization active

Milestone impact: accepted development-band entry to `DEV-0.7.x`; game-version impact: `GAME_VERSION_ACCEPTED` (canonical Game `0.1.1-prealpha`; publication adds no development milestone)

## Purpose

This document reconciles stale current-state headers in long-lived planning documents without rewriting their historical chronology. It changes no runtime, content, schema, validator, test, save, migration, dependency, UI, or gameplay authority.

## Current Header Status

The current prompt, handoff, output, historical register and lower-precedence live planning headers are refreshed through accepted `DEV-0.7.0 - Integrated Gameplay Systems Band Entry` on 2026-09-11. The focused readiness appendix records `MILESTONE_ENTRY_ACCEPTED`; the separate unversioned `Game 0.1.x Playability Gap Prioritization Decision` completed on 2026-09-14 with `PLAYABILITY_PRIORITY_SELECTED`. The project owner then accepted `Soundings Return, Submission, And Payment Authored-Terms Decision` with `AUTHORED_TERMS_ACCEPTED`, and the subsequent `Quest Turn-In Completion And Consequence Receipt Owner Contract Decision` returned `OWNER_CONTRACT_ACCEPTED`. The bounded Soundings implementation is complete with `IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE`; the independent audit returned `REPAIR_REQUIRED` on 2026-09-20 and its bounded repair investigation returned `PROVENANCE_CONTRACT_REQUIRED` on 2026-09-22. The subsequent provenance contract was accepted and witness repair is implemented at `0df87bb7afaa4d7fcc9f08b79b7528d60727c370`, pending independent acceptance. The September 24 post-repair audit returned `REPAIR_REQUIRED` for F2 consumer completion cleanup with omitted witness evidence; A1 passed 68 cases, remaining acceptance stopped. See `soundings-durable-completion-post-repair-independent-acceptance-audit.md`. F2 repair is implemented at `0383cedc99a4c3d5e2c9b47cf0665683720aef9e`; see `soundings-consumer-completion-witness-gate-repair-record.md`. The post-F2 audit returned `REPAIR_REQUIRED` for F3 survey projection repair compatibility; see `soundings-durable-completion-post-f2-independent-acceptance-audit.md`. F3 repair is implemented at `7c8c980d01892b0f673afc5a5940aec33ad2d7a2` under accepted admission-prefix sufficiency; see `soundings-f3-survey-projection-compatibility-repair-record.md`. The separate post-F3 audit returned `SOUNDINGS_DURABLE_COMPLETION_ACCEPTED` on 2026-09-28; see `soundings-durable-completion-post-f3-independent-acceptance-audit.md`. The completed calibration records `GAME_VERSION_CANDIDATE_JUSTIFIED` for `0.1.1-prealpha`; publication subsequently returned `GAME_VERSION_ACCEPTED`; the installed successor is `Post-Soundings Playability Gap Prioritization Decision`; see `soundings-admission-witness-repair-implementation-record.md` for current executable evidence and `soundings-source-provenance-contract-gate.md` for the historical retention gap. See `soundings-durable-completion-independent-acceptance-audit.md` for F1 and the remaining unaccepted matrix. See `soundings-durable-completion-implementation-record.md` for exact executable and browser evidence. Earlier accepted audits and their historical labels remain unchanged.

Installed `Version 0.6.9.11 - Historical Recovery Fork Authority Acceptance Audit` independently accepted parent `0.6.9`. The survey receipt decision selected `0.6.10`; implementation landed at `008db9c...`, `0.6.10.2` implemented the first six audit findings at `59af926...`, and `0.6.10.4` repaired two residual findings at `07c5739...`. Independent `0.6.10.5` accepted the complete parent at `950e851446fb75bfbdb717d0ea33e33ec2907d4a`. The completed reachability decision correctly returned `NO_PACKAGE` until authored input arrived; accepted Soundings canon closed that blocker. The follow-up package decision returned `PACKAGE_READY`, `Version 0.6.11` implemented the bounded route at `3ca23d6864541a899ea61a6bf26257665f754e78`, and `0.6.11.1` independently returned `PARENT_ACCEPTED` plus `REPRESENTATIVE_LOOP_ACCEPTED`. The subsequent readiness decision returned `BAND_ENTRY_READY`; `DEV-0.7.0` is complete with `MILESTONE_ENTRY_ACCEPTED` at the 2026-09-11 verification; game `0.1.0-prealpha` and playability `INTEGRATED_LOOP` remain unchanged.

The audit corrected live-current pointers in `docs/dev/project-roadmap.md`, `docs/dev/codex-sequenced-implementation-plan.md`, `docs/dev/project-vision-and-continuity-brief.md`, `docs/future_content_backlog.md`, and `docs/design/static-content-expansion-program.md`. Older dated rows and completed-run narratives remain historical chronology and do not control execution.

Future corrections must remain limited to false live pointers, broken references, or material route changes. Do not rewrite historical chronology merely because its original next-run wording has been consumed.

## Controlling Current Anchor

Use the following precedence for current execution and routing:

1. `docs/dev/current-codex-prompt.md` for the active executable prompt;
2. `docs/dev/current-gpt-handoff.md` for immediate guardrails and route order;
3. `docs/dev/current-codex-output.md` for the latest completed inspection or implementation state;
4. `docs/dev/historical-version-and-deferred-route-register.md` for canonical route identity, active/deferred posture, and reopening triggers;
5. the most specific focused decision or audit;
6. this reconciliation for conflicts limited to stale current-anchor wording;
7. the roadmap and sequenced plan for historical chronology, version-band meaning, and non-conflicting long-term context.

Repository workflow authority also includes `AGENTS.md` and `docs/dev/codex-failure-patterns-and-verification-guardrails.md`.

## Accepted Current State

- latest implemented and accepted primary: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence` at `3ca23d6864541a899ea61a6bf26257665f754e78`, accepted by completed `0.6.11.1`;
- prior accepted primary: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`;
- latest completed support implementation: `Version 0.6.10.4 - Ashen Reef Survey Progression Coherence And Projection Placement Repair` at `07c57392c8078927e4f9e12efe18d8d89bb1fc70`, `IMPLEMENTED_PENDING_REAUDIT`;
- historical parent audit: `Version 0.6.9.10`, acceptance claim superseded because no separately installed runnable audit prompt preceded it;
- accepted survey-parent support audit: `Version 0.6.10.5 - Ashen Reef Survey Progression And Projection Post-Repair Acceptance Audit`, `PARENT_ACCEPTED` with the then-current reachability classification;
- latest completed unversioned decision: `Ashen Reef Survey Ordinary Reachability Implementation Package Decision`, `PACKAGE_READY`;
- latest accepted and completed support audit: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`, `PARENT_ACCEPTED` and `REPRESENTATIVE_LOOP_ACCEPTED`;
- prior completed readiness decision: `Integrated Gameplay 0.7 Band-Entry Readiness Decision`, `BAND_ENTRY_READY`;
- accepted development milestone: `DEV-0.7.0 - Integrated Gameplay Systems Band Entry`; current band `DEV-0.7.x`;
- latest prioritization: `Game 0.1.x Playability Gap Prioritization Decision`, `PLAYABILITY_PRIORITY_SELECTED`;
- latest authored product decision: `Soundings Return, Submission, And Payment Authored-Terms Decision`, `AUTHORED_TERMS_ACCEPTED`;
- latest owner-contract decision: `Quest Turn-In Completion And Consequence Receipt Owner Contract Decision`, `OWNER_CONTRACT_ACCEPTED`;
- latest bounded implementation: `Soundings Survey Projection Repair Compatibility Repair`, `IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE` at `7c8c980d01892b0f673afc5a5940aec33ad2d7a2`;
- latest independent audit: `Soundings Durable Completion Post-F3 Independent Acceptance Audit`, `SOUNDINGS_DURABLE_COMPLETION_ACCEPTED` at `7c8c980d01892b0f673afc5a5940aec33ad2d7a2`; historical F1/F2/F3 findings retained;
- latest repair investigation: `Soundings Retained Source Provenance And Before-State Binding Repair`, `PROVENANCE_CONTRACT_REQUIRED`; no production repair;
- latest accepted technical decision: `Soundings F3 Survey Admission Retention Sufficiency Decision`, `RETENTION_SUFFICIENT_BOUNDED_REPAIR_AUTHORIZED`; the original accepted-admission provenance contract remains binding;
- latest version calibration: `Soundings Playable-Build Version Calibration Decision`, `GAME_VERSION_CANDIDATE_JUSTIFIED` for `0.1.1-prealpha`; subsequently published as accepted Game `0.1.1-prealpha`;
- active route: none installed after `Activity Revenue Presentation Truthfulness Repair` completed;
- failure-pattern guardrail register: active durable workflow authority;
- `DEV-0.7.0`: `MILESTONE_ENTRY_ACCEPTED`; Game `0.1.1-prealpha` accepted separately / `INTEGRATED_LOOP` unchanged;
- accepted BOM repair: `Version 0.6.6.1` at `66f12fd6f649f8f218f7f49fc721a8fe545a7a01`;
- completed fail-closed `0.6.6.2` attempt at `4/5` on the initial climate contract mismatch;
- partial then fail-closed `0.6.6.3` attempt with schema commit `56932eec` and focused assertion commit `e71f8f6b`;
- exact `0.6.6.4` implementation commit: `232d3c2f466e3ec18e620e29a47f4466ae05b84d`, changing four authorized files;
- `0.6.6.4` focused tests passed `5/5` and content lint passed `67`;
- corrected `0.6.6.5` reproduced an identical `173`-tuple workspace baseline and accepted exact `0.6.6`;
- accepted `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` found no production repair need;
- the lethal-process static foundation `0.6.8` and its `0.6.8.1` audit remain accepted;
- the survey scope/owner decision accepted one deterministic shift occurrence, shared preview/execution planning, typed affected-owner receipts, distinct identities, atomic accepted-state application, and accepted-only UI;
- the minimum save decision accepted campaign/continuity/artifact/generation/publication identities, campaign rules version 2, version-6 migration receipts, verified candidate publication, and a typed authority ledger;
- the dependency-closure decision assigned `Version 0.6.9`;
- `0.6.9.2` repaired six original recovery/admission defects and immutable-address verification, with reported 20/20 focused persistence tests, 127/127 prescribed tests, and a passing UI build;
- post-repair inspection proved the actual character-creation retry can mint a second campaign after hidden publication, pending recovery can collide with a newer same-slot address, and blocked recovery lacks a production-reachable validated completion owner;
- `0.6.9.3` implemented those exact application-level defects without survey work or a generic workflow framework;
- `0.6.9.4` preserved the implementation baseline but proved multiple pending receipts, unsafe current-location authority, and missing repair-ledger provenance remain blocking;
- `0.6.9.5` reports those three boundaries repaired with 26/26 focused tests, 133/133 prescribed tests, and a passing build;
- `0.6.9.6` independently preserved the green baseline and the three exact `0.6.9.5` targets, but proved three additional initial-resolution, restart-duplicate, and original-effect-provenance gaps;
- the accepted `0.6.9` persistence chain retains linked arbitrary-depth completion lineage under bounded Model C.
- the survey receipt decision selected one optional survey-ledger container, continuity-before-receipt admission, exact normalized retries, atomic owner receipts, projection repair, legacy baseline, and correction posture; `0.6.10` implemented that package at `008db9c...`, the two bounded repairs landed at `59af926...` and `07c5739...`, and `0.6.10.5` independently accepted the parent at `950e851...` while separating ordinary reachability from owner validity.

The broad TypeScript backlog remains a separate tooling/config cleanup route. It must not be repaired or weakened inside the parent persistence support chain.

## Accepted Near-Term Order

1. preserve independent Soundings acceptance at the exact post-F3 runtime and all three historical negative audits;
2. preserve the completed calibration: `0.1.1-prealpha` is now published with `GAME_VERSION_ACCEPTED`;
3. execute `Post-Soundings Playability Gap Prioritization Decision`; broader vertical-slice/product work remains separate.

## Maintenance Rule

Do not edit historical roadmap rows merely because their wording is old. Correct only live current-state headers, false active pointers, broken references, or contradictions that can misroute execution. Retain this reconciliation and the 2026-08-02 repository-wide audit as coordination history unless a later dedicated maintenance pass supersedes them. The refreshed lower-precedence summaries now agree that `0.6.9`, `0.6.10`, and `0.6.11` are accepted, the earlier reachability `NO_PACKAGE` blocker was closed by accepted authored canon, `0.6.11.1` issued `REPRESENTATIVE_LOOP_ACCEPTED`, the readiness decision returned `BAND_ENTRY_READY`, and `DEV-0.7.0` is accepted with playability prioritization complete, Soundings authored terms accepted, owner contract accepted, and accepted provenance contract and implemented F1 repair, followed by the September 24 F2 finding and implemented consumer-completion gate repair pending separate acceptance.

Latest acceptance update (2026-09-28): Soundings is now independently accepted through A/B1/B2/C/D; prior pending-repair statements above describe history, not active blockers. No game/development version changed.


Latest calibration update (2026-09-28): `0.1.1-prealpha` is justified as the smallest patch candidate because accepted Soundings now closes authoritatively through exact +5g reward and durable continuation. Root `GAME_VERSION` is now `0.1.1-prealpha` under `docs/design/game-0.1.1-prealpha-publication-acceptance-decision.md`; `INTEGRATED_LOOP` remains unchanged and no `0.2.0-prealpha` vertical-slice maturity is inferred.
## 2026-10-02 G9B retained Normal defeat recovery publication

**RETAINED_NORMAL_DEFEAT_RECOVERY_OWNER_VERIFIED; G9C_AND_ACTIVATION_HELD.** Source `09c4d74f`, code `13622ef2`. The selected App now recovers one exact retained Normal defeat pending receipt through the campaign-session owner and clean-epoch descendant publication/consumers/readback. Focused native 8/8, adjacent browser 130/130 and Node 126/126 pass; broad UI remains 137 baseline diagnostics. The next installed package is **G9C revisioned account/Legacy actions** from G9A. Natural combat-triggered unsaved pending, G9D-F lifecycle/destruction, G10 deployment/post-epoch durability and planned parent acceptance remain held; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. This supersedes G9A-active wording below without rewriting chronology.

## 2026-10-02 G9C revisioned Legacy account actions

**REVISIONED_LEGACY_ACTIONS_VERIFIED; G9D_NEXT; ACTIVATION_HELD.** Source `85786625`, code `83d14c90`, App QA `9e95e1a9`. Four existing selected-App Legacy controls now use exact account revision/profile CAS; focused native 6/6, adjacent 130/130, Node 126/126 pass, broad UI remains 137 baseline diagnostics. Existing profile/password account owners are verified, but there is no selected or retained UI control for those edits and G9C excluded new account UX. The next installed package is **G9D terminal publication and lifecycle settlement** under G9A; G9E/F, G10 and parent acceptance remain held. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. This supersedes G9C-active wording above without rewriting chronology.
## 2026-10-02 — G9E slot generation and address deletion

**G9E_SLOT_GENERATION_AND_ADDRESS_DELETION_VERIFIED; G9F_NEXT; ACTIVATION_HELD.** Synchronized source `c318f64c`; focused record `docs/dev/dev-0.7.1-slice-g9e-slot-generation-address-deletion-record.md`. v6 retains historical campaign-keyed first authority, unique occupancy identity and deletion receipts while allowing deleted slots to be reused. Player delete and completed-terminal address cleanup are owner transactions; selected App uses existing controls. G9D archival retirement stays outside lineage inheritance, while eligible retained retirement still consumes once. Native G9E 10/10, hardened G9D 14/14, adjacent 130/130, focused Node 174/174 and app-local Vite pass; broad UI remains 137 baseline diagnostics. G9F account reset/delete and session invalidation is next. G10 activation, combat, deployment, planned parent and Game-version acceptance remain held; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged.
## 2026-10-03 G9F account lifecycle closure

**G9F_ACCOUNT_RESET_DELETE_AND_SESSION_INVALIDATION_VERIFIED; G9_PARENT_AUDIT_NEXT; ACTIVATION_HELD.** From synchronized hosted `master` `d41c2896`, additive v7 reset/delete spans all 12 account-owned data stores with current-password verification, exact account revision and lifecycle-generation CAS, reset receipt/deletion tombstone, registration/session reentry fence and durable readback. Selected Settings and picker controls are wired. Synthetic focused G9F 12/12, retained G9E 13/13 and G9D 14/14, adjacent browser 130/130, Node 174/174, Node UI-config and app-local Vite pass; broad UI stays at 137 known diagnostics. The next route is a G9 parent acceptance audit, not automatic acceptance. G10 activation, capacity/eviction/backup, death caller, combat, deployment, planned `DEV-0.7.1` and Game-version acceptance remain held; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. Focused record: `docs/dev/dev-0.7.1-slice-g9f-account-lifecycle-record.md`.
