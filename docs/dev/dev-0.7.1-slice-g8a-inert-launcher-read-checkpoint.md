# DEV-0.7.1 Slice G8A — Inert Async Launcher Read Checkpoint

Date: 2026-09-30. Source `master`/`origin/master` `8e8ce9f39ebb760edd40bf3a978e68d655bee21e`, clean before edits. Internal checkpoint of planned primary `DEV-0.7.1`; parent held. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged. **EPOCH_LAUNCHER_READ_BOUNDARY_VERIFIED; LIVE_APP_CUTOVER_HELD.**

## Pre-edit gate and bounded package

The installed G8 asks for a coherent real App cutover across bootstrap, account access, creator, load, ordinary saves and blocked failure states. `App.tsx` still couples these paths to synchronous `bootstrapLauncherAuth`, `listSaves`, `loadSaveWithAuthority`, `publishSave`, `saveAccountProfile`, lifecycle and reset/delete handlers. A partial switch would offer mixed storage authority. The installed prompt explicitly permits a narrower tested checkpoint. This run adds only `cleanEpochLauncherRead.ts` and its `.js` module mirror, plus a native browser fixture. It does not import the reader in App, select the epoch in the live game, or edit legacy owners, lifecycle, reset/delete, storage data, dependencies or Game version.

The reader composes the retained epoch account adapter and account-scoped IndexedDB owner. `bootstrap` validates the epoch session hint; a picker is produced only from a successful account list. Signed-in bootstrap awaits account-scoped inventory and checks the account revision around that read. `inventory` preserves each owner status, including prepared, pending, closed and unsupported. `load` requires the caller's account revision and a verified `ready` slot; every other status returns a typed blocked result with the exact slot status. Unavailable, malformed and stale reads do not become an empty inventory or default account. The owner still proves artifact/control/slot/witness identity and consumer receipts. The reader does not mutate, repair, or replace accepted history.

## Fresh evidence and limits

- Native Chromium launcher read fixture **7/7 PASS**: empty picker, registration/selected empty inventory, prepared blocked slot, restart/completion/ready load, stale revision, cross-account isolation, malformed hint and closed owner. This is a native browser adapter page, **not** ordinary App UI QA.
- Existing native first-campaign **5/5**, account adapter **13/13**, clean epoch **52/52**, publication **12/12**, canonical **14/14** PASS after fixture generation. The first clean-epoch/publication/canonical attempt failed only because the ignored fixture JSON was absent; rerun with fixture succeeded.
- Adjacent campaign tests **51/51 PASS** and Soundings tests **53/53 PASS**. Node UI config typecheck and app-local Vite build PASS (229 client modules). Broad UI typecheck still reports 137 baseline diagnostics; none name the new reader or QA file. `git diff --check` PASS.
- Real App bootstrap, account picker/sign-in/registration, creator, load, manual/quick save and blocked/retry notices remain unconverted and untested. G8 ordinary UI acceptance is **not claimed**. The G7B/G6 owners remain inert. G9 lifecycle/reset/delete and G10 coordinated activation and long-run post-epoch durability remain held.

FP-001/002 prevent the adapter fixture from standing in for real App or parent acceptance. FP-003/004/005/006 apply to explicit prepared/stale/unavailable block, restart and stable account revision; two-owner publication/retry evidence is reused from G6/G7B, not a new App proof. FP-011/012/013/014/015 remain covered only by the rerun owner/adjacent suites, not by new live caller evidence. FP-008/009 govern branch and head accounting.

## Branches and next route

Fresh fetch/prune at the source found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` is 468 master-only/2 ref-only with two unique readiness docs; prompt integrity `58a34e37`/base `3d77171c` is 415/1 with one prompt-audit doc; administration `210df5bc`/base `fd40571b` is 246/1 with one research-evidence doc. Dispositions remain `PROTECTED_REFERENCE`, `PROTECTED_REFERENCE`, `HOLD_NAMED_CONSUMER`; exact triggers remain scheduled readiness/regression or protection review, dedicated prompt/execution-pointer audit, and administration/template/governance or explicit Lineage retrospective. No branch action is due.

Install **DEV-0.7.1 Slice G8B — Real Async App Caller Cutover**. It must complete the real ordinary App routing, descendant save adapter if needed, blocked/retry UX and native ordinary UI QA before claiming G8. If a further split is necessary, use another inert, tested checkpoint and keep activation held. G9-G10, Slice C combat and parent acceptance remain later routes.
