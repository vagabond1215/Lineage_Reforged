# DEV-0.7.1 Slice G8F — Real Async App Caller Checkpoint

Date: 2026-10-01. Source `master`/`origin/master` `2dcbee6c97a8680bce0a2066d3bad6b3ae9cd734`; code checkpoint `08329e90`. Internal slice of planned current-band primary `DEV-0.7.1`; parent acceptance held. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted development milestone `DEV-0.7.0`. Development impact `supports_current_band`; game-version impact `none`.

## Result

**REAL_ASYNC_APP_ORDINARY_PATH_VERIFIED; G8F_FAILURE_UI_ACCEPTANCE_HELD.** The selected `App` renders `EpochApp`, which awaits clean-epoch account/session bootstrap, inventory, creator, exact slot load and ordinary descendant manual/quick saves. It captures destination addresses and account revision, blocks double submission, completes retained pending publications on inventory, requires exact ready readback for success/play, and presents unavailable data as a full blocked/retry state. G9 lifecycle actions are visibly unavailable. The former `App` function remains unreachable source pending the G10 import/storage audit. No production deployment, old-data migration, browser reset, schema change, dependency or game-version change occurred.

Changed code: `apps/rpg-ui/src/App.tsx`, new `EpochApp.tsx`, epoch owner/adapter comments, `game-shell/state.ts`, four launcher/account screens, and local-only `campaign-clean-epoch-app-unavailable-qa.html`. The Strict Mode bootstrap effect now cancels superseded initialization and closes its owner connection.

## Evidence and limits

- Actual App in native Chromium: new account and creator; manual-to-quick and quick-to-manual saves with source address retained; restart/sign-in/load; historical address and changed non-head fork; two-tab stale account refusal with no success notice.
- Actual App Soundings: ordinary quest acceptance, travel, four survey shifts, return, first witnessed completion, a later save, restart and load. The UI showed one completion and the expected one-time +5 gold.
- Actual App bootstrap fault route: unavailable, blocked and malformed IndexedDB each showed full blocked/retry rather than an account or empty slots.
- Adjacent native owner suites 130/130 and campaign/Soundings Node suites 116/116 pass. Node UI-config typecheck and app-local Vite build pass. Broad UI typecheck remains 137 known diagnostics; the sole changed-path diagnostic is the existing `MainMenuScreen.tsx` optional-prop baseline.
- Actual-App pending-consumer interruption and write-time quota/abort injection were **not** completed. Owner suites exercise these transaction paths, but do not substitute for UI caller proof. Actual-App stale head/destination variants beyond the observed stale account refusal also remain to be injected. Thus G8F full failure-UI acceptance remains held for the narrow support run G8F.1.

Relevant guardrails: FP-001/002 distinguish real UI from owner tests and held parent acceptance; FP-003/004/005/006 cover retained recovery, CAS, two-tab conflict and failure boundaries (UI injection remains held); FP-011/012/013/014/015/017 cover Soundings witness and retained history; FP-008/009 cover branch and head accounting. No new reusable pattern was identified.

Fresh fetch/prune found one local/four hosted branches and [zero open PRs](https://github.com/vagabond1215/Lineage_Reforged/pulls). Readiness `59c103c3`/base `895c02df` had 481 master-only/2 ref-only, prompt integrity `58a34e37`/base `3d77171c` 428/1, and administration `210df5bc`/base `fd40571b` 259/1. Unique paths remain two readiness docs, one prompt audit and one research evidence doc. Dispositions and exact triggers in the branch register remain unchanged; no integration or deletion is due.

Next: G8F.1 actual-App failure UI proof, then G9 lifecycle/reset/delete and G10 coordinated activation, post-epoch durability, backup/restore and two-context long-run acceptance. Combat and parent acceptance remain held.
