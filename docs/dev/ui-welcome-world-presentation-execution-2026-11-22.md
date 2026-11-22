# Welcome / World presentation checkpoints A and B

Date: 2026-11-22 (America/New_York). Repository `vagabond1215/Lineage_Reforged` only.
Unversioned UI support; parent milestone n/a; development impact `supports_current_band`;
Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, game-version impact `none`.
No new milestone or Game-version acceptance decision.

**CHECKPOINT_A_COMPLETE; CHECKPOINT_B_COMPLETE;
UI_PRESENTATION_READY_FOR_CONNECTOR_REVIEW.** Presentation candidate only; all
World, family, creator, Save, default/hosted activation and version holds remain.

## Source and authorized scope

- Requested, inspected and implementation starting topic head:
  `98f7247fcd2ed3590d48892738dd9183cbf5c1ad`.
- Existing branch `codex/ui-shell-account-first-slice-2026-11-21` resumed by non-force
  fast-forward; no new branch/PR. Live master at inspection remained
  `20abe83c2aa97ba4699711a9815d9b95e0d3df44`.
- [Controlling Connector handoff](ui-welcome-world-presentation-handoff-2026-11-22.md)
  and updated current prompt read. Complete five-file, documentation-only delta
  from prior `fae4c4de` reconciled; completed orientation and unchanged standalone
  evidence reused. Original HTML still blob `da99a105a05710b93e2cc7f692ff94b391f43f19`.
- Checkpoint A: `8e82f68638809c11a98cb04498dcc630a4f0bd19`.
- Checkpoint B: `8dba8f3e8e4a3c24d24f0b85fd08be9d8c7a9823`.
  Final documentation/live pushed head reported after publication; no self-referential SHA.
- Temporary checkout `C:\Codex\EoL\.ui-shell-account-first-slice` clean before edits.
  Primary map lane, unrelated untracked work and all other worktrees preserved.
- Execution: Codex Default implementation mode, authenticated Git/PowerShell,
  Node v24.14.1, existing app TypeScript/React/Vite, Python 3.14.3,
  temporary Playwright and installed Edge. No production dependency/lockfile changes.
  No delegation. S package with durable A checkpoint before B; quota unknown.

## A. Files and behavior changed

1. `LocalAccountAccessScreen.tsx` pending-operation text now **Working…**. Existing
   shared busy state, status role, aria-busy, disabled controls and all owner callbacks
   unchanged. Account browser harness updated for held sign-in, held wrong-password
   deletion and held invalid restore; added single-viewport selection for bounded checks.
2. `accountPresentationGate.ts` adds World presentation gate requiring every existing
   DEV/native Welcome/account presentation condition plus `worldPresentation=1`.
   Entry example: `/?welcomeL1=1&accountPresentation=1&worldPresentation=1` on loopback.
   Missing any flag, production or a non-loopback/lookalike hostname fails closed.
3. New `WelcomeWorldPresentation.tsx`: shared rail-free AppShell, authenticated profile,
   existing local clock, actual theme/logout callbacks, contextual Back and Create
   navigation, Chronicle and disabled Persistent. Existing validated Continue callback
   still owns admission to `WORLD_LIBRARY_GATE`; its source and logout region match
   starting head byte-for-byte. No alternate owner admission or reducer rewrite.
4. The library explicitly states **World registry unavailable / presentation review**,
   and has no account World records or sample World cards. Create opens only local
   configuration review: First World / Chronicle / Individual, disabled Living,
   Mortal default with unsupported difficulty choices held, illustrative temperature,
   rainfall and the actual six calendar seasons plus Scenario Default. Further
   adjustments and final Create are disabled with registry/economy reason.
5. New `worldPresentationState.ts` owns only an ephemeral draft, never a request,
   World ID, seed, receipt or Save format. Back resets the whole draft; account/screen
   keyed mount discards it on logout/account switch/unmount. No persistence calls.
6. `EpochApp.tsx` only selects this separately gated component and forwards existing
   owners/clock. Without World opt-in the original Welcome remains unchanged; without
   native Welcome opt-in the ordinary native menu remains unchanged.
7. Focused unit state/gate tests, real React render test and real-app browser harness;
   this receipt and bounded output/handoff/register/focused-handoff follow-through.

No AppShell/header refactor, global styles, World store, family/creator, engine,
Save, schema, migration, source artwork, package or Game-version edits.

## B. Executed verification

| Check | Actual outcome |
| --- | --- |
| Fresh starting UI typecheck | 118 existing diagnostics |
| A and B UI typecheck | Same 118 normalized file/code/message diagnostics, ignoring line shifts only; zero new diagnostics, affected surface clear |
| Checkpoint A launcher/auth/gate/render tests | 24/24 PASS |
| Final focused unit suite, including World gate/state | 27/27 PASS |
| React Welcome/World render + adjacent notice tests, app cwd | 3/3 PASS; new render test also passed alone after disabling its unnecessary HMR |
| `npm run typecheck:ui:node` | PASS |
| `npm run ui:build` | FAIL at known 118-diagnostic typecheck baseline; no clean combined-build claim |
| Direct app `node node_modules/vite/bin/vite.js build --outDir C:/Codex/EoL/.tmp-ui-world-production` | PASS; existing import/chunk warnings |
| `node scripts/check-no-new-hex-dependencies.mjs --check` | PASS: zero new / 846 scanned code files |
| Real account A browser, 375px | PASS: held sign-in, rejected held deletion and restore, neutral status/disabled controls, unchanged graph, gate-off/session checks |
| Real B browser, 1440/1280/768/375/320 | PASS all five; final run includes scroll-to-visible disabled final Create bounds proof |
| Exact owner-region comparison, staged/unstaged diff checks | PASS |

Unique focused/adjacent cases: **30 passing tests**. Initial concurrent SSR tests
emitted a temporary HMR port-use warning despite passing; new isolated render test
uses `hmr:false` and passed without that warning. All middleware instances close in
finally. No compiler relaxation or unrelated diagnostic correction.

Commands run from repository root unless noted:

```text
node --test tests/unit/app-shell-content-classes.test.mjs tests/unit/account-presentation-gate.test.mjs tests/unit/world-presentation-state.test.mjs tests/unit/launcher-auth.test.mjs tests/unit/launcher-welcome-routing.test.mjs tests/unit/launcher-welcome-mode-cards.test.mjs
node --test tests/world-presentation-render.test.mjs tests/in-game-notice-toast.test.mjs  [apps/rpg-ui cwd]
python apps/rpg-ui/tests/account-presentation-browser-qa.py --origin http://127.0.0.1:5367 --width 375
python apps/rpg-ui/tests/world-presentation-browser-qa.py --origin http://127.0.0.1:5367 --screenshots C:/Codex/EoL/.tmp-ui-world-evidence
```

Browser environment: matching `LINEAGE_TASK_OWNED_ORIGIN`, temporary Playwright via
`PYTHONPATH`, `CHROMIUM_EXECUTABLE` pointing at installed Edge. Disposable contexts
and real synthetic account registration/login through EpochApp. No fixture auth owner.

## C. Browser boundaries and retained findings

At every B width: actual login → Welcome → existing validated gate → empty review
library → configuration → Back; actual profile/local clock, real pointer and keyboard
menu use with no forced clicks, both themes, true owner logout, disabled Persistent,
Living, difficulty/further adjustments and final Create. Canonical season labels
compared with `calendar.json`. Draft defaults reset after Back/reopen, reload,
logout and different account. Gate-OFF L1 retains “World Library not ready”; native
entry remains the original menu. No new header pointer obstruction or horizontal
document overflow; disabled final action is visible within each viewport after scroll.

Complete synthetic account-store graph digests and localStorage (including session
hint) match across review navigation/configuration; graph equality also covers reload.
No new persisted review state. Final contexts contain two accounts and zero records in every other store
except the existing accountLifecycle store. No World, character, Save or artifact
created. Account deletion/restore A checks are rejected operations, not successful
destructive lifecycle or backup acceptance. Logs remain at `.tmp-ui-world-*.log` under
the primary root; screenshots retained outside Git in `.tmp-ui-world-evidence`.
Desktop/mobile top and final-action screenshots visually inspected.

- **F1 fixed** with truthful neutral status and held-operation witnesses.
- **F2 held:** prior unchanged legacy MAIN_MENU clock pointer overlap; no header
  repair or renewed full legacy pointer acceptance. New signed-in menu pointer passes.
- **F3 held:** successful real deletion and valid backup restoration remain broader
  account-activation prerequisites. Negative synthetic probes do not close them.
- **F4 held:** 118 unrelated UI diagnostics and combined build baseline remain red.
- All World CREATE/economy, family, creator, Save, production activation and version
  holds remain; no success toast, generated World identity or character route.

## D. Lifecycle, cleanup and next consumer

Relevant PR102 `d3cd548f6b21aff11c40637c3e16026502f8e6e2` and PR103
`d6fb21d3452f56ecf962f2c7d11eae95394927ca` rechecked open drafts, unchanged.
Prior broad inventory reused under the documentation-only delta. No integration into
master, PR action, unrelated disposition change, branch deletion or deployment.
Existing topic branch retained `HOLD_NAMED_CONSUMER`: independent exact pushed-head
Connector review of checkpoints A/B and F1–F4 before any next package. PR102 remains
for World-owner acceptance; PR103 for visual provenance. Recheck refs when consumers resume.

FP-001: real EpochApp callers and owner-validated gate exercised. FP-007: bounded
patches/append-only coordination preserve history. FP-009: starting/A/B/final/live
identities distinct. FP-010: all four findings have explicit repair/hold evidence.
FP-018: destructive/session owners and intent semantics unchanged; rejected operation
digests stable, no parent lifecycle acceptance inferred. FP-021: preview settings
never presented as owner-backed grants or reachable World/character creation.

Session `ui-welcome-world-20261122` registered Vite PID 25992 at
`2026-11-22T05:27:27.6603644Z`; HTTP 200 and exact new gate observed. Server retained
through dependent A/B browser work. StopSession verified `stopped-after-escalation`
after graceful attempt, tree inspection available; port 5367 has zero listeners.
Browser contexts and middleware servers closed via finally; foreground commands ended.
No user/shared processes touched. Removed scoped Python cache, temporary Playwright,
external production build and task dependency junction; original dependency target
verified present. Logs/screenshots retained as evidence. Disposable worktree's ignored
outputs are reproducible; final clean non-force Git closeout/push readback in completion.

Suggested commit: `feat(ui): add gated Welcome and World configuration review`.
Next unversioned run: independent Connector review of exact published checkpoints;
no further implementation prompt or new milestone/version proposal installed here.
