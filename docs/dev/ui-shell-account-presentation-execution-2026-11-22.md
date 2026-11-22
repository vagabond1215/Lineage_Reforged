# Contextual shell/account presentation execution

Date: 2026-11-22 (America/New_York). Repository: `vagabond1215/Lineage_Reforged`.
Run: unversioned UI support, parent development milestone n/a; development impact
`supports_current_band`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`;
game-version impact `none`. No milestone or Game-version acceptance decision.

**UI_PRESENTATION_READY_FOR_CONNECTOR_REVIEW.** Source and bounded real-app browser
proof are complete. Default/hosted activation, World, family, creator and Save
acceptance remain held. This is an isolated account presentation candidate.

## Source, authorization and branch

- Inspected master / implementation starting head:
  `20abe83c2aa97ba4699711a9815d9b95e0d3df44`.
- Resumed existing `codex/ui-shell-account-first-slice-2026-11-21`, non-force
  fast-forward from accepted checkpoint `bc171008fa4a59370be3527c9e852460f61bab40`
  to inspected master. No new implementation branch or PR.
- Reused completed Connector orientation and unchanged standalone browser/assets
  evidence. Read the complete nine-path coordination/manifest delta and the
  [controlling resume authorization](ui-preview-connector-checkpoint-acceptance-and-shell-resume-2026-11-21.md).
  Original HTML still blob `da99a105a05710b93e2cc7f692ff94b391f43f19`;
  no standalone matrix or broad remote orientation repeated.
- Baseline repair checkpoint: `e8e8531d` (`fix(ui): omit undefined shell content class override`).
- Presentation source/test checkpoint: `a398fdb3b321ef8b3b9cb926733f430a25c731f9`.
  Final documentation and live pushed-head identities are reported after publication,
  rather than self-referenced in this file.
- Primary map-intake checkout and unrelated untracked work preserved. Recreated
  the previous disposable checkout at `C:\Codex\EoL\.ui-shell-account-first-slice`
  solely for this same branch's authorized continuation. No other worktree used.
- Execution: Codex Default implementation mode, authenticated local Git, PowerShell,
  Node v24.14.1, TypeScript/Vite/React from existing app dependencies, Python 3.14.3,
  temporary Playwright and installed Edge. No new production dependencies,
  package/lockfile changes, shared compiler-option changes or agent delegation.
  S package, existing orientation reused; quota availability unknown.

## A. Files changed

- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`: omit undefined inner-class override.
- `apps/rpg-ui/src/game-shell/components/LocalAccountAccessScreen.tsx`: optional
  contextual account composition and compact form; existing callbacks retained.
- `apps/rpg-ui/src/game-shell/accountPresentationGate.ts`: explicit ephemeral gate.
- `apps/rpg-ui/src/EpochApp.tsx`: gate and existing clock values forwarded only to
  account presentation; existing account, Welcome and Save owners unchanged.
- `tests/unit/app-shell-content-classes.test.mjs`,
  `tests/unit/account-presentation-gate.test.mjs`,
  `apps/rpg-ui/tests/account-presentation-browser-qa.py`: render, gate and real-caller proof.
- This receipt, current output/handoff, branch register and focused resume follow-through.

## B. Behavior and boundaries

1. **V3 correction:** `ShellContent` receives no `innerClassName` prop when the
   optional override is undefined. Existing nullish default, deliberate empty string
   and custom class strings retain their exact render behavior. No casts, suppression,
   widened public type, fallback replacement or unrelated TypeScript repair.
2. **Gate:** account presentation requires native development Welcome eligibility,
   `import.meta.env.DEV`, exact loopback hostname and explicit
   `?welcomeL1=1&accountPresentation=1`. No persisted preference; removing the second
   query parameter restores the old account layout. Query alone without Welcome,
   production builds and hosted/lookalike hosts fail closed.
3. **Presentation:** shared rail-free AppShell top/subbar, original brand asset and
   EpochApp-owned local clock; Guest theme disclosure without Logout; centered
   Create Account and contextual registration Back. Selector precedes password and
   Login in one row; Stay logged in below; unselected Login/password disabled.
   Selected account management and restore remain reachable in disclosures.
4. **Auth behavior:** existing selection/reset, credential, registration, deletion
   intent, observed revision/generation and backup callbacks retained. Source comparison
   confirms handler region byte-identical to master. Existing registration form,
   notice owner, selected metadata and busy state reused. No demo password/records in
   production code. Browser QA uses disposable real accounts via the actual UI.
5. **Exclusions:** no World registry, fake server/world time, family records, creator
   fields, Save schema/action, owner migration, default launcher cutover, package
   dependencies, hosted publication, branch deletion or Game-version change.

## C. Executed checks

| Check | Result |
| --- | --- |
| Fresh clean-source UI typecheck before correction | 119 diagnostics, including exact AppShell TS2375 |
| After V3 / after full presentation | 118 diagnostics; normalized file/code/message comparison removes only AppShell TS2375; presentation equals repaired baseline with zero additions |
| Four real AppShell static renders | PASS for absent, undefined, empty and custom override |
| Gate tests + existing launcher/auth/routing/mode tests + render tests | 24/24 PASS |
| Adjacent `tests/in-game-notice-toast.test.mjs` from app directory | 2/2 PASS; middleware Vite instances closed in finally. Initial invocation from repository root failed module-root resolution; correct cwd rerun passed without source repair |
| `npm run typecheck:ui:node` | PASS |
| `npm run ui:build` | FAIL at unchanged 118-diagnostic typecheck baseline; no clean combined-build claim |
| Direct `node node_modules/vite/bin/vite.js build --outDir C:/Codex/EoL/.tmp-ui-shell-resume-production` from app | PASS; existing chunk/import and plugin timing warnings |
| `node scripts/check-no-new-hex-dependencies.mjs --check` | PASS: 0 new / 842 code files |
| Real app browser QA at 1440/1280/768/375/320 | PASS all five, no page errors; exact checks below |
| Handler comparison and staged/unstaged diff checks | PASS |

Diagnostic comparison normalizes location line/column shifts but retains file,
error code and message text. Full before/repaired/final logs remain outside Git
under `C:\Codex\EoL\.tmp-ui-shell-resume-*.log`; changed production files have no
remaining reported TypeScript diagnostics. Strict compiler settings unchanged.

### Real browser evidence

Ran `python apps/rpg-ui/tests/account-presentation-browser-qa.py --origin
http://127.0.0.1:5367 --screenshots C:/Codex/EoL/.tmp-ui-shell-resume-evidence`.
Harness requires matching `LINEAGE_TASK_OWNED_ORIGIN`, `PYTHONPATH` for temporary
Playwright and installed Edge via `CHROMIUM_EXECUTABLE`. All contexts disposable.
Registered Vite root was this exact implementation checkout; HTTP 200 proved before
browser work. The rendered gate marker and actual EpochApp route were observed.

For every viewport: blank registration rejected and dismissible, two synthetic
accounts created by real owner callbacks, registration Back, unselected controls,
wrong password, account switch clearing password/preference, both themes, deletion
affordance, rejected restore, input geometry, no horizontal document overflow,
keyboard tab/Enter login, deterministic password-derivation busy witness with picker,
Login and Create disabled, persistent sign-in/reload/logout, nonpersistent sign-in
returning to picker on reload, gate-OFF original picker and default native menu.
Persistent/Living/World functionality was never enabled. No forced browser clicks.

Read-only hashes over this disposable origin's complete account-store graph matched
before/after presentation/theme/failed-auth/rejected-restore and gate-OFF navigation.
Final each context: two accounts; zero artifacts, controls, slots,
newCampaignAttempts and pendingPublicationRecoveries.
No real player data, World, character or Save created. This proves account presentation
and bounded session behavior, not Save restart, account lifecycle parent acceptance
or a new World owner. Only digest equality/counts were reported; no credential export.

Desktop/mobile screenshots (`account-1280.png`, `account-375.png`) retained outside
Git in the evidence directory and visually inspected. Existing light theme and
source brand rendered; tested both light/dark theme switching. Original standalone
HTML, manifest artwork and prior preview proof were reused unchanged.

### Explicit limitation / separately scoped issue

At 1440px the **unchanged default MAIN_MENU** clock glyph overlays the account menu
button's pointer target. Keyboard focus/Enter opens its existing Settings/Exit/Log Out
menu and the gate-OFF journey passes. MainMenu and clock source/header composition
are unchanged; the AppShell correction affects only content class forwarding.
Record this pointer limitation for a separate legacy-header layout decision; no
pointer acceptance of that control is claimed and no force click hid the issue.
An initial broad-label account selector was replaced with a proper explicit label
association during this implementation. Browser harness corrections accounted for
system-selected initial theme, menuitem role and dismissing an invalid-registration
toast before continuing at small height; final five-viewport run passed.

## D. Lifecycle, guardrails and next route

Live master remained `20abe83c2aa97ba4699711a9815d9b95e0d3df44` at starting inspection;
refresh at publication. Rechecked relevant open draft PR102
`d3cd548f6b21aff11c40637c3e16026502f8e6e2` and PR103
`d6fb21d3452f56ecf962f2c7d11eae95394927ca`, unchanged. Prior broad inventory remains
usable under this coordination-only delta. No unrelated integrations or PR actions
due/performed. Existing shell branch becomes `HOLD_NAMED_CONSUMER` for independent
exact pushed-head Connector review; retire only after accepted reachability and all
named consumers close. PR102 retained for World CREATE/economy/Save owner acceptance;
PR103 for visual/source provenance. Standing selected/hosted holds unchanged.

- FP-001: actual EpochApp and owner-backed account UI exercised, not preview fixtures.
- FP-007: bounded source patches and append-only coordination; history retained.
- FP-009: base, V3, presentation and final publication identities distinguished.
- FP-010: V3, gated presentation and separate legacy pointer limitation have explicit dispositions.
- FP-018: existing deletion/selection/password intent invalidation and observed lifecycle
  fields retained byte-for-byte; no destructive-owner rewrite or parent acceptance claim.

Process session `ui-shell-account-resume-20261122`: Vite PID 23316, creation
`2026-11-22T05:08:49.1588272Z`, registered by existing process-control before use.
Kept alive through all browser steps. StopSession verified `stopped-after-escalation`
after graceful attempt; tree inspection available, port 5367 has zero listeners.
All browser harnesses use finally cleanup, all foreground test/build commands ended;
SSR middleware Vite instances closed. No shared/user process stopped.

Removed the dependency junction nonrecursively, preserved its original target,
removed only identified task-generated root Vite caches and external temporary
builds/tools/check-out copies (including prior checkpoint leftovers) with safe
literal-path PowerShell cleanup. Logs/screenshots retained as evidence. Remaining
ignored build metadata belongs to the disposable worktree; final clean Git closeout
and pushed-head readback reported at completion. No server or preview retained.

Next recommended unversioned run: independent Connector review of this exact pushed
source and evidence. No new implementation prompt or World/family/creator package
installed by this pass. Suggested source commit: `feat(ui): add gated contextual
account presentation`. No separately proposed Game-version change.
