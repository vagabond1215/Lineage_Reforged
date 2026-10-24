# Character + Persistent Top Bar: Cross-Slice Integration And Visual Coherence Preflight

Date: 2026-10-22. Repo: `vagabond1215/Lineage_Reforged`. Classification: **connector-reviewed documentation and next-run gate**. No runtime/code merge, local build, selected gameplay test, combat change or Game-version authorization.

## 1. Live source snapshot and branch ownership

At inspection `master` is `f56229dde859b9374a54368bd8a8fd2a9872daa1`. All three UI PRs are open/draft, individually GitHub-mergeable to their then-current base, **not merged or accepted**:

| Branch/PR | Published head | Files changed relative to master | Current proof |
| --- | --- | --- | --- |
| [UI design PR #5](https://github.com/vagabond1215/Lineage_Reforged/pull/5), `parallel/ui-guidance-consolidation-2026-10-21` | At source audit `74aa434b9d0a0e16994484fea9296ac503ab9c1d`, followed by this document | Design/doc link index and proposed prompts only | Documentation, no source tests |
| [Character implementation PR #7](https://github.com/vagabond1215/Lineage_Reforged/pull/7), `codex/character-first-ui` | `8610260fd40a7b371a4789e954f53fc884ad71df` | `CharacterPanel.tsx`, `characterSectionNavigation.ts`, Character render/owner/keyboard tests, implementation records and branch register | Codex-reported app 2/2 and focused 44/44; broad typecheck 136 vs `master` 137; **SELECTED_INTERACTION_UNVERIFIED** |
| [Top-bar implementation PR #8](https://github.com/vagabond1215/Lineage_Reforged/pull/8), `codex/persistent-top-bar-ui` | `20825cce24703e5066fb827075d5f310e847fb34` | `TopStatusBar.tsx`, new `TopResourceMeter.tsx`, top-bar test, implementation record and branch register | Codex-reported topbar 1/1, body/calendar 16/16, build and Node UI check; controlled 375×812 and desktop; broad TS 136 vs master 137; **TOP_BAR_SELECTED_INTERACTION_UNVERIFIED** |

**Safe intersection audit:** PR #7 and #8 touch **zero common production/game/UI/test paths**. Their **one overlapping changed path** is `docs/dev/branch-disposition-register.md`; both independently append checkpoint entries at the end of their same base file. A combined integration must **retain both dated records**, reconcile chronology/disposition, and avoid deleting or overwriting one tail while resolving a possible textual merge conflict. GitHub's **individual** `mergeable: true` claims do *not* prove the combination merges without conflict or that the combined UI works.

No active changes to `InGameShell.tsx`, `AppLayout.tsx`, `SideNav.tsx`, `uiViewModel.ts`, nutrition save schemas or gameplay commands appear in either implementation diff. The active `DEV-0.7.2.13` combat-result route and draft nutrition PR #6 are separate and unchanged at this audit.

## 2. Why separate green tests are not combined-shell proof

The actual wiring is `InGameShell` → `TopStatusBar` + six-domain `SideNav` + `CharacterPanel` through `AppLayout`.

- `AppLayout` currently uses `h-screen`, a `min-h-0 flex-1` workspace, `px-4 pb-4 pt-4`, and at `xl` a `180px` left rail. At smaller viewports the rail/pane occupy implicit grid rows. Do not assume an adequate play area with a top band that can wrap and resources that become **three stacked rows** below `sm`.
- PR #8 `TopStatusBar` has a wrapping flex header and `order-3 w-full` resource group under `xl`; resource group uses one column below `sm` and three at `sm`. This is deliberate responsive behavior in isolation but **combined vertical budget** may leave too little space for PR #7's horizontal Character nav and owner-content inspector.
- PR #7 `CharacterPanel` adds its own horizontal scroll strip, and keeps a scrollable main area plus optional detail pane. Multiple local scroll regions/overlays may compete for wheel, focus, sticky placement and touch space. At narrow widths, ensure meaningful Character Overview and actual equipment/inventory controls remain reachable.
- PR #8's condition popup is conditionally mounted for warning/critical typed `energy/hydration/fatigue/protein/intoxication` severity only, but its details include **all** owner pills for full context; do not mistake expanded neutral details for a reintroduced permanent `Condition: Stable` badge. It currently renders compact **text** condition labels, not a general buff/debuff icon catalog. Do not manufacture spell effect icons or duration from string labels.
- PR #7's Character identity/portrait and PR #8's global identity/name can coexist if they serve distinct contextual purposes, but design review should catch redundant information, competing amber card headers, or another tall dual-dashboard appearance.
- Test the **actual composite** at realistic 375×812, 768px, desktop 1280+ with long player name, 9 attribute values, normal + warning/critical condition states, overflowed Character section tabs, open calendar/settings/condition overlays, keyboard Tab/Arrow/Home/End/Enter/Escape and focus return. Use a controlled fixture **honestly** if no selected account; this is visual/integration evidence, **not** ordinary authenticated play.

**Potential risk, not a confirmed bug:** a wrapping top bar + always-visible tall legacy left-domain card rail may leave cramped main workspace on phone. A narrow integration review should observe and report actual dimensions, screenshots and reachability before modifying the global rail or top band. Do not silently solve it with an unauthorized global Home/rail rewrite or by hiding resource bars.

## 3. Integration rehearsal, not acceptance or production merge

A dedicated Codex pass should:

1. Fetch/prune from the current correct repo and record real branch heads, dirty state, PR diffs, accepted UI design and active combat route.
2. Build a **throwaway isolated worktree/preview ref from fresh master** incorporating the exact bounded runtime/test changes from PR #7 and PR #8. Resolve only actual overlap; if conflict arises in the branch register, **preserve both entries**. Do not push a combined implementation branch as a final merge candidate until reviewed and instructed. Do not mutate or rebase PR #7/8 heads.
3. Run a combined true component/shell render with the same owner-backed demo snapshot and controlled alert conditions; compare screenshot and behavior at key breakpoints, and count content viewport usable area. Exercise Character → Skills → Equipment → Inventory; verify resource current/max, neutral omission, inspectable warnings, calendar/notifications/settings, icon focus, scroll/overflow and no layout occlusion.
4. Run **both** PRs' focused tests plus affected owner/action/SaveSnapshot tests, Node UI-config typecheck, Vite build, full TypeScript typecheck relative to an actually clean contemporaneous master and `git diff --check`. The historical 137/136 diagnostic numbers are *evidence only*, not an assumption that they remain constant. Do not claim green broad TS if still red.
5. Run authorized authenticated selected-client playback if existing user-approved test credentials or access are legitimately available, including tick-change, real item operations, save/load/restart. **Never ask for, guess, reset, print or bypass private credentials**. In its absence, record `COMBINED_SELECTED_INTERACTION_UNVERIFIED`; controlled fixture UI checks are still useful but cannot close PR #7 or #8's selected holds.
6. If a **localized true UI defect** appears, capture pre-fix reproducible evidence and the owner/boundary. Prefer a narrow fix in the original owning PR branch only when safe and authorized; otherwise produce an exact proposed patch/hold, not a speculative broad rewrite. Do not touch `DEV-0.7.2.13` combat results, the hold on nutrition bars, `GameSessionContext`, SaveSnapshot or global Home/World.
7. Publish a review/evidence report with actual exact commits, changed files, screenshots/viewport details, selected vs controlled proof, pass/fail checks, any cross-branch conflict, merge-order proposal, and next **Equipment/Inventory owner-usability** slice. Keep all currently draft PRs draft. No Game or DEV-version promotion.

## 4. Acceptance matrix for next step

| Test/claim | Required proof | State from published independent branches |
| --- | --- | --- |
| Both feature patches co-render with current `InGameShell`/layout | Composite fixture test and inspected actual screen at desktop + mobile | **Not yet run together** |
| No source or history loss on integration | Current three-way merge/diff; preserve both branch-register entries | **One shared metadata path; conflict risk** |
| All Character routes, attrs and item operations remain available | Combined UI navigation/action test, focus/overflow, owner action parity | Separate fixture owner actions only |
| HP/MP/ST, warnings and utilities persist together | Combined owner-driven view model, popups, settings and keyboard | PR #8 isolated fixture test only |
| Broad static/build regression | Combined focused suites, Node UI-config, Vite build, master-relative TS diagnostics | Separately reported successes, combined **unverified** |
| Authenticated selected gameplay and Save/restart | Authorized selected campaign, actual tick and state readback | **Not available; both PRs held** |
| Production integration readiness | Explicit semantic review of PR #5/#7/#8, combat overlap, owner and selected gates | **Not accepted**, no automatic merge |

## 5. Disposition

**TWO_UI_SLICES_PUBLISHED_INDEPENDENTLY; COMBINED_VISUAL_PROOF_PENDING; SELECTED_ACCEPTANCE_HELD; NO_MERGE_AUTHORIZED.** The next Codex pass should be a **combined UI rehearsal and visual-coherence audit**, not another full Character or top-bar implementation. Once it establishes the combined layout, continue with an independently scoped Equipment/Inventory usability task rather than changing nutrition or inventing magical combat commands.
