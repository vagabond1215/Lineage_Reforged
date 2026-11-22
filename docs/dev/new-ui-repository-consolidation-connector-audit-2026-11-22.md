# New UI repository consolidation audit, source-only, Codex pass paused

Date: 2026-11-22 (America/New_York). Repo: `vagabond1215/Lineage_Reforged`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. **Status: UI_CONSOLIDATION_AUDITED; INTEGRATION_AND_MERGES_HELD**. GitHub Connector read-only inspection followed by this documentation-only commit on its own branch based on master. Codex is working in an isolated checkout but currently paused; **this audit cannot see uncommitted or unpushed Codex changes** and does not authorize rewriting its worktree. All observed refs must be re-fetched before implementation or disposition.

## Verified remote source identities and branch relationships

| Ref | Inspected head | Relationship and status |
| --- | --- | --- |
| `master` | `20abe83c2aa97ba4699711a9815d9b95e0d3df44` | Default selected runtime; no A3a or A3b integrated |
| `codex/ui-shell-account-first-slice-2026-11-21` | `7624adc2f54b72204717ad18a2e4294454d9bfb1` | 20 commits ahead of master / none behind; 30 changed paths |
| `connector/l3a-world-v8-migration-preflight-2026-11-17` / draft PR #102 | `e74f9e1414d02cde60ba03aa088afc166f2634b1` | Diverged from master, 21 ahead / 109 behind; no merge |
| `connector/a3b-inert-a3a-source-stage-2026-11-22` | `cfa19afda16a11c01c56925dbce9a03022c389a5` | Seven additive commits ahead of PR102 owner head: five UI sources, one pure test, one handoff; owner files not modified; unmounted |
| `connector/a3a-independent-review-a3b-codex-package-2026-11-22` | `fbd893cdef8d8e409e85e21539a28f33760a05b3` | One documentation-only commit over UI head |
| `codex/creator-cosmetic-color-continuity-2026-11-19` / draft PR #103 | `d6fb21d3452f56ecf962f2c7d11eae95394927ca` | Diverged; one changed path, historical standalone HTML prototype; no runtime UI |
| Source common ancestor UI vs PR102 | `aae4d65cdc65482032d62acef74316ed59c1eacf` | UI is 129 commits ahead, owner 21 commits ahead of this ancestor; not safe to blanket merge |

Source diff `master...UI`: **30 paths** = 8 runtime TS/TSX files, 7 test files (4 under `apps/rpg-ui/tests`, 3 `tests/unit`), 15 documentation/coordination files. Runtime changes are scoped to `EpochApp.tsx`, `AppShell.tsx`, `LocalAccountAccessScreen.tsx`, `accountPresentationGate.ts`, `WelcomeWorldPresentation.tsx`, `WorldCreator.tsx`, `WorldLibrary.tsx`, `worldPresentationState.ts`. No World authority in this diff.

The staged owner branch is **7 additive files**, *not* the full 30-path UI delta. Six reviewed A3a source/test files match their original Git blob identities as verified in `ui-a3b-inert-a3a-source-stage-and-codex-pickup-2026-11-22.md`. It does not port the account UI, required browser tests or the `EpochApp` integration and must not be represented as a complete merged candidate.

## UI runtime and component ownership

**Selected entry now on master:** `src/main.tsx` mounts `App`; `src/App.tsx` exports `App() { return <EpochApp developmentNativeV3 />; }`. The same `App.tsx` still has approximately 2,722 lines of retained legacy caller source. This is **known reference/maintenance debt**, not evidence of two active authenticated runtime owners. Keep until the existing G10 storage/reference audit proves removal safe. The World owner remains `CleanEpochAccountStore`, not a separate UI store.

**Launcher vs gameplay shell:** `game-shell/components/AppShell.tsx` is the launcher/Welcome/Creator shell. The actual in-game `InGameShell.tsx` uses `components/layout/AppLayout.tsx`, `components/TopStatusBar.tsx`, and `components/SideNav.tsx`. Both are still intentional domain-specific surfaces. Do not replace live gameplay navigation with preview shell, delete `AppLayout` or deduplicate cross-shell state before real Save and gameplay reachability acceptance. Prefer future shared primitive/token work after current owner-backed World creation, separately tested.

**Prototype vs React:** Master canonical preview is `docs/prototypes/lineage-reforged-current-interactive-preview.html`, Git blob `da99a105a05710b93e2cc7f692ff94b391f43f19`, recorded 358,143 bytes. The historical Nov 18 prototype file on PR103 has the **same** blob; master’s *historical* Nov 18 file is different (`cf9615ab6cf68a28fc78e07aaa1836d30deafa26`). Master already preserved the latest snapshot under its canonical pathname. Thus merging PR103 is **not needed to recover its newest preview bytes**, and it must not be promoted into runtime. Retain `docs/prototypes/README.md` and its current manifest as source-of-truth for visual study and explicit sample-only elements. Do not migrate sample accounts, Worlds, heirs or fictional resources into owner-backed React.

**Source overlap between UI and PR102:** `EpochApp` has 46 changed lines in the exact owner-to-UI source comparison from the owner checkout but requires curated route integration, not file replacement. `LocalAccountAccessScreen.tsx` differs significantly (UI adds gated account/splash presentation); `AppShell.tsx` adds the conditional optional-content-class fix. `main.tsx` differs because PR102 contains compiled owner review fixture entry. **Retain PR102 `main.tsx`**, protected `cleanEpochAccountStore.ts`, `cleanEpochAccountAdapter.ts` and Vite config. Other shared files `App.tsx`, `game-shell/state.ts`, `WelcomeScreen.tsx`, `components/ui/Card.tsx`, `index.css` have exact identical Git blobs on UI and PR102 at inspection; no replacement is needed for those.

**A3a functional boundary:** On UI branch `EpochApp` does not provide `inventory` or `onCreateWorld` props, so Creator is not durable. The inert staging branch doesn't mount A3a. PR102's World writer needs compiled `world-owner-review` + exact loopback and credential-issued session via adapter WeakMap. DEV account presentation is a separate gate. Remembered session can read after valid account authentication but cannot be trusted to write; require reauthentication. World Library entry currently adds old campaign Save recovery; avoid expanding dependence on that loader. Keep World creation scope at real owner World inventory, atomic Create/receipt, genesis readback and retained World card; zero characters and zero Saves is valid.

## Historical UI PR and branch consolidation

**Current GitHub PR metadata, not assumed from historical prose:** #5 is **closed, unmerged**. #6–#16 are **open draft, unmerged** at their retained heads. #17 is open draft. Do not reopen #5 or treat it as pending an automatic merge. Historical branch-disposition register has time-stamped older sections claiming all #5–#16 open; those statements are historical, not the current status.

The source of the prior #7/#11/#14 Character stack, #10/#12/#13 equipment/inventory owner stack, #8/#16 top-bar stack and #9/#15 mobile-shell stack was **selectively reauthored on master** in October. Current master independently contains `CharacterPanel.tsx`, `InGameShell.tsx`, `AppLayout.tsx`, `SideNav.tsx`, `TopStatusBar.tsx`, source-level regression tests and stable engine/Save owners. `docs/dev/historical-ui-prs-10-16-exact-master-semantic-equivalence-audit-2026-11-09.md` records owner behavior as equivalent/enhanced but preserves live selected/keyboard/focus/Save acceptance holds and specific mobile/header geometry gaps. Branches based on October `f56229dd` are now hundreds of commits behind master (e.g. `codex/character-first-ui`, `codex/mobile-shell-usable-height`, `codex/persistent-top-bar-ui`). **No historical branch is an appropriate base for the new World Creator.**

Keep #6's nutrition owner question separate. Treat #7–#16 as evidence/retirement candidates only **after** exact-main selected acceptance and each PR's unique evidence preservation; no blanket merge, closure or ref deletion. Prior `docs/dev/ui-branch-worktree-consolidation-2026-10-24.md` removed eight clean local checkouts, not their remote refs. Other dirty/detached worktrees have preservation records. GitHub cannot establish current local worktree cleanliness; do not issue any local deletion from this remote audit.

## Prototype art and low-priority storage opportunity

The canonical master preview manifest contains 100 retained geography art records. Nine pairs of `continent-*.png` and `continent-*-selected.png` have the **same Git blob SHA-1**; their extra pathname copies total **33,372,361 bytes (~31.8 MiB)** by manifest file-size accounting. This is a potential checkout/static-asset size and naming consolidation, not 31.8 MiB of distinct compressed Git object data. Selected-art references, pinned image manifest and historical evidence must first be traced. Do not delete or rewrite art, image paths, asset manifests or current preview during A3b.

## Consolidation risks ranked

| Priority | Risk | Safe disposition |
| --- | --- | --- |
| P0 | UI vs PR102 branch divergence and unmounted staged components | New isolated integration worktree from checked stage branch or PR102 head; curated `EpochApp` and account presentation reconciliation; no blind merge |
| P0 | Compiled owner gate vs DEV-only UI gate, credential WeakMap session, lost retry intent, Owner/Library/receipt mismatch | Keep existing owner; implement explicit restricted loopback compiled route and owner-fed exactly verified creation; remembered sessions read-only until password sign-in |
| P0 | Old launcher/Save recovery coupling and production rollback | World-specific read-only inventory only; unchanged default routes and legacy Save guards |
| P1 | Multiple shell/entry references and typecheck baseline | Preserve selected `main -> App -> EpochApp`; do not retire legacy source or in-game shell before separate G10/selected-UI acceptance. Same-branch typecheck baseline; 118 UI vs 184 owner not comparable |
| P1 | Historical UI PR source/evidence and prototype duplication | Promote specific accepted evidence, not obsolete branch histories; #5 closed, #6–#16 retained draft; PR103's latest prototype already on master |
| P2 | Duplicate continent selected/unselected artwork | Later manifest-safe reference analysis and asset dedup only if no pin/history consumers |

## Safe resume order when Codex resets

1. **Do not interrupt or replace paused Codex work.** First record local worktree `git status --short`, `git rev-parse HEAD`, current branch, tracked/untracked files, and inspect any unpublished work; use remote staging branch only as optional reference, not automatic reset. Re-fetch current remote refs and PR statuses. If local code is ahead of the remote audit, compare and reconcile rather than reverting it.
2. Finish **A3b functional Creator** on one isolated integration lineage. Retain original owner implementation, account adapter, v8 World+receipt transaction, pinned v3 source/Worker fingerprint, immutable old manifests. Transfer only missing UI account/launcher/callback/test seams, preserve original one-World pilot quota, stable intent IDs, readback/corrupt error, reauth and default gate-off.
3. Make a dedicated integrated test record for actual Chromium UI Create -> verified Library card -> close/reopen/sign-in same World; double-submit, lost acknowledgement, concurrent tabs, quota, account isolation, stale generation/logout, V7 migration/V8 archive/native-v3 Save graph preservation, bad source/corrupt pair/aborted transaction. Stop on owner/source/account mismatch. Check five widths/two themes and keyboard. Record exact commands and same-base TS diagnostics; a direct Vite build is not the combined build.
4. **Only after integrated acceptance**, decide how to promote an explicit UI/World integration candidate toward master by independent review; PR #102 stays draft and unmerged until owner-level merge authorization, and staging branch is not a production rollout. Keep Classic as default and no World gameplay/character Save integration.
5. Later, with exact accepted new-UI selected route: evaluate G10 legacy `App.tsx` extraction, intentional launcher/gameplay shell primitive consolidation, historical PR retirement after evidence transfer, and prototype image duplication. Preserve history and rollback independently of World feature activation.

## Verification limits and disposition

**Connector-confirmed this pass:** live master/UI/owner/stage/PR103 heads; branch compare counts/path lists; PR #5 closed vs #6–#17 open-draft metadata (selected IDs); `App` mount and retained legacy body; prototype canonical/historical SHA identity; in-game shell usages via default-branch code search; existing historical semantic-evidence docs; nine selected-art copy SHA pairs and manifest sizes. No files were modified on any application branch by this audit. **No local Git worktree, test, build, browser or account/Save operation executed** and no visibility of unpushed Codex changes. Historical A3a/A2b Chromium and typecheck figures are prior Codex-reported evidence, not rerun.

Recommended status until A3b integrated browser proof: **`UI_CONSOLIDATION_REVIEWED_A3B_HELD`**.
