# UI preview local verification checkpoint

Date: 2026-11-21 (America/New_York). Repository: `vagabond1215/Lineage_Reforged`.
Run: unversioned UI rollout verification support; parent milestone n/a; development
milestone impact `none`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`,
game-version impact `none`. No new Game-version acceptance decision.

## Disposition

**UI_PREVIEW_RECONCILED; UI_ENTRY_HELD_BASELINE; PRESENTATION_IMPLEMENTATION_INCOMPLETE.**
The first local verification checkpoint is complete. The React shell/account
presentation portion was not started: the packet's explicit baseline-conflict stop
condition applies to a current diagnostic in its proposed `AppShell.tsx` edit surface.
This is not runtime rollout, owner acceptance, or proof of real account/World/Save
behavior. The active World owner prompt and all activation/publication holds remain.

## Source and orientation

- Inspected base and implementation starting head:
  `d312daf051c7a834541c250799a766343fc361fe` (fetched `origin/master`).
- Connector packet source: `ebd355f46d9c4196076a485f03089eaa57543404`.
  Inspected the complete intervening eight-file documentation-only delta. Reused
  its broad orientation under the repository/resource policies and independently
  verified the local source, manifest, owners, commands and relevant refs.
- Primary checkout remained at map-intake branch/head `805754e118f23cc8f4cc21e0eaa9d1ac44ddf8bc`;
  unrelated untracked worktrees and dependencies were preserved.
- Temporary implementation checkout:
  `C:\Codex\EoL\.ui-shell-account-first-slice`, branch
  `codex/ui-shell-account-first-slice-2026-11-21`; clean before edits.
  A separate checkout avoided overwriting the map lane; consumer is exact-head
  Connector review of this checkpoint, followed by a bounded presentation decision.
- Source/test checkpoint: `31174f5454ab1f9d1cce9a0d7b9762cded9b13a1`.
  Final documentation commit and pushed remote head are reported by the execution
  response rather than self-referenced here. Live master at pre-publication check
  remained the inspected base; ref state must be rechecked before continuation.
- Execution: Codex implementation-capable Default mode, authenticated Git checkout,
  PowerShell, Node v24.14.1, Python 3.14.3 and a disposable Playwright/Edge browser.
  Existing app dependencies were accessed through a task-owned junction; no package
  manifest/lockfile or production dependency was changed. Quota availability unknown;
  S package stopped at its explicit evidence checkpoint. No agent delegation.

## Findings and exact patch

| ID | Reproduction | Change / disposition | Verification |
| --- | --- | --- | --- |
| V1 | Windows `core.autocrlf=true` checked out HTML at 360,165 bytes instead of 358,143; byte verifier failed | Add only the current archived HTML path as `text eol=lf` in `.gitattributes`; retain original snapshot and manifest | Fresh `checkout-index` with autocrlf enabled gives original 358,143 bytes and SHA-256; full verifier passes |
| V2 | Browser smoke failed on document-wide `.save-detail` count after expanding Maris in Codex and closing it | Scope collapsed-row assertion to active `#launcherMain`; separately require retained Codex detail to be invisible | Exact committed browser smoke passes all five viewports; no HTML behavior altered |
| V3 | Clean-source UI typecheck reports 119 diagnostics; `AppShell.tsx:305` names `innerClassName={contentInnerClassName}` incompatible with exact optional properties | Characterized baseline conflict; no production fix or presentation port in this checkpoint, as required by packet section 5 | Node typecheck passes, combined app build fails in typecheck, direct Vite build passes; no claim of clean UI baseline |

HTML remains Git blob `da99a105a05710b93e2cc7f692ff94b391f43f19`,
SHA-256 `70cded8264ee4c5e819ecbdf0642c036c87825a1dc03a0170495a29cb23f7e80`.
No preview/Page/PR103 synchronization is needed because no HTML bytes changed.

## Checks actually executed

| Command / probe | Result |
| --- | --- |
| `node docs/prototypes/verify-current-preview.mjs --hash-assets` | PASS: original HTML fingerprint, script syntax, 114/114 local asset hashes/sizes |
| `node docs/prototypes/preview-source-smoke.mjs` | PASS: 62/62 source/controller checks; DOM stub only |
| `python docs/prototypes/preview-browser-smoke.py` | Initially FAIL V2; after harness repair PASS at 1440, 1280, 768, 375, 320; zero reported overflow/page errors, family/heir review and all creator stages exercised |
| Additional isolated browser probe | PASS: keyboard picker → password → Log In → Enter; 59 rendered image instances decoded across continent/region/settlement views, 17 distinct hash-verified local originals loaded via intercepted pinned image URLs |
| `node --test tests/unit/launcher-auth.test.mjs tests/unit/launcher-welcome-routing.test.mjs tests/unit/launcher-welcome-mode-cards.test.mjs` | PASS 18/18 on unchanged production source |
| `npm run typecheck:ui:node` | PASS |
| `npm run typecheck:ui` | FAIL: 119 baseline diagnostics, including V3; preserved log outside Git |
| `npm run ui:build` | FAIL: same baseline typecheck stage; Vite not reached by combined command |
| `node node_modules/vite/bin/vite.js build --outDir C:/Codex/EoL/.tmp-ui-shell-direct-build` from app | PASS; existing dynamic/static import and large-chunk warnings |
| `node scripts/check-no-new-hex-dependencies.mjs --check` | PASS: 0 new dependencies / 839 scanned code files |
| `git check-attr`, fresh autocrlf `checkout-index`, `git diff --check` and staged diff | PASS; fresh checkout preserves original exact bytes |

Browser environment used temporary `PYTHONPATH=C:/Codex/EoL/.tmp-ui-shell-account-tools`
and `CHROMIUM_EXECUTABLE=C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.
The stock smoke intentionally blocks remote art; the extra image probe fulfilled
pinned URLs from local originals. Neither proves remote raw-host availability.
No production browser login, real account mutation, World creation, Save replay,
gate-OFF Save/restart acceptance, React presentation or hosted validation was run.
No screenshot-based visual acceptance is claimed.

## Branch / PR lifecycle

Fetched/pruned local/remote refs and read all 81 open PRs through authenticated
repository-scoped REST; all were draft. No PR or existing branch mutation.
PR #103 remains at `d6fb21d3452f56ecf962f2c7d11eae95394927ca`,
merge base `5bc5eb35cb536b65632936a7de05521d22bd80ed`, 35 master-only / 19 topic-only
commits; unique diff is one archived HTML path. Retain as review provenance until
independent presentation/acceptance consumes it. It is not the implementation base.
PR #102 remains at `d3cd548f6b21aff11c40637c3e16026502f8e6e2`,
merge base `aae4d65cdc65482032d62acef74316ed59c1eacf`,
106 master-only / 12 topic-only commits; inspected six-file migration/registry/QA/CI
diff. Retain for owner-backed World CREATE/economy/Save acceptance. Do not integrate
the v8 candidate in this UI checkpoint. L1 and selected native-v3 refs remain held
under existing consumers; none of those triggers was consumed. No integration,
rebase, merge, closure, activation or branch deletion was due or performed.

New checkpoint branch disposition: `HOLD_NAMED_CONSUMER` after publication.
Review trigger: independent exact pushed-head review of V1/V2 and V3 baseline
disposition before a separate bounded shell/account presentation slice.

## Guardrails, cleanup and next step

- FP-001: exercised the real standalone browser caller; production caller unchanged
  and its browser acceptance explicitly unrun.
- FP-007: bounded patches / append-only coordination; original historical sections
  retained, no replacement from truncated file output.
- FP-008: actual PR bases/unique paths inspected; no merge inferred from textual compatibility.
- FP-009: base, source checkpoint and final publication identities distinguished.
- FP-010: V1/V2/V3 inventory maps every confirmed issue to proof or explicit hold.

Browser harnesses closed their disposable browser contexts; foreground commands
completed. `StopSession ui-shell-account-20261121` returned zero registered targets,
with process-tree inspection available. No task server was started; shared/user
processes were untouched. Dependency junction removed nonrecursively and original
dependency target verified present. Automatic approval review rejected temporary
tool/build directory deletion with `blocked by policy`; remaining task artifacts
are reported rather than deleted by another mechanism. Worktree closeout and final
publication verification are recorded in the handoff/final response.

Next: Connector can review this tiny checkpoint and document a bounded disposition
for the existing shell baseline diagnostic. Any source repair requires local proof;
do not repair all 119 errors or include unrelated UI refactoring. Resume contextual
shell/account presentation only after the explicit baseline stop condition is
resolved. Preserve the current World owner gate and feature-OFF route. No new
milestone or Game version is proposed.

Suggested commit: `docs(ui): record local preview checkpoint and shell baseline hold`.
