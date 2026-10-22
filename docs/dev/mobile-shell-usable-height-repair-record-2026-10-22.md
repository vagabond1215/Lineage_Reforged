# Combined UI Mobile Shell Usable-Height Repair — 2026-10-22

**Repository:** `vagabond1215/Lineage_Reforged`. **Run class:** unversioned bounded shell repair. **Game:** `0.1.1-prealpha`. **Playability:** `INTEGRATED_LOOP`; `COMBINED_SELECTED_INTERACTION_UNVERIFIED`. **Branch:** `codex/mobile-shell-usable-height` based on master `f56229dde859b9374a54368bd8a8fd2a9872daa1`. Draft implementation only; no merge or acceptance.

## Evidence and source boundary

- The prior detached `.combined-ui-rehearsal` worktree was still present. Its local-only report SHA-256 was `766492787B1E824677D1E546BCDF95C2BE014F85368F60EE58F767CB4CA01BB0`; its `short-mobile-375x667-critical.png` SHA-256 was `F6CECA1811E05B716DC4B7361F704F0F1F84357EC8A9913596E478AC9E981A23`. It remains untouched. Its reported 106 px was a later local patch state, not the raw PR combination.
- Fresh fetch/prune checked master `f56229dde859b9374a54368bd8a8fd2a9872daa1`, Character PR #7 `8610260fd40a7b371a4789e954f53fc884ad71df`, top-bar PR #8 `20825cce24703e5066fb827075d5f310e847fb34`, and draft design PR #5 branch `c6da1e640cfee247ab946bc1dae4b0309dd67930`. The new PR #5 mobile gate was read. PR #7/#8 source and tests were composed over master in separate detached `.mobile-shell-integration`; their distinct historical `branch-disposition-register.md` blocks were retained. That register was their sole overlapping changed path.
- The published branch contains **only shared shell layout/navigation/CSS, a semantic navigation regression test, a controlled browser fixture, this report and screenshots**. It contains no PR #7/#8 production source, top-bar component change, Character component change, gameplay owner, save schema, combat, nutrition or Game-version change.
- `InGameShell` itself remained unchanged in the composite browser. The fixture uses `demoSnapshot` plus a controlled player-engine-resolved hydration state. The fixture callback counts are not Save/load proof.

## Reproducible viewport gate

In `apps/rpg-ui`, run `npm run dev -- --host 127.0.0.1 --port 5176` from a composed PR #7/#8 worktree and open `combined-ui-check.html`. At a 375×667 browser viewport, click **Fixture warning**; the fixture resolves hydration level 18 through `resolveBodyState`. For an unobscured screenshot, click **Hide fixture controls**. Inspect `#character-section-content`'s nearest `overflow-y:auto` ancestor's `clientHeight`, `document.documentElement.scrollWidth`, the actual header, rail and warning notice. The critical toast was intentionally present for the measured gate. Do not count the fixture's fixed controls as product UI.

| State | Scrollable Character workspace | Document width | Visible resource/alert state |
| --- | ---: | ---: | --- |
| Exact PR #7 + PR #8 before shell repair, 375×667 critical | about **66 px** of viewport height; section top y≈601 and horizontally expanded to ≈1152 px | 375 px viewport with clipped shell content | HP/MP/Stamina and critical indicator present |
| Repaired composite, 375×667 critical + toast | **248 px** `clientHeight`; section top y≈420 | **375 px** | HP, MP, Stamina, critical and warning indicators, dismissible notice, both navigation strips visible |
| Repaired 375×812 normal | **511 px** | **375 px** | Three resources, no neutral condition indicator |
| Repaired 768×1024 normal | **767 px** | **768 px** | Three resources and all six domains |
| Repaired 1440×900 normal | **727 px** | **1440 px** | Existing desktop rail orientation preserved |
| Repaired 320×667 long name + critical stress | **218 px** | **320 px** | No horizontal document overflow; controls still reachable; 240 px gate was not set for this narrower stress case |

The 375×667 measure is the actual scroll container's `clientHeight`; the critical toast had a visible **Dismiss** button. The earlier 106 px report remains genuine evidence of the prior partial local repair, but the fresh unmodified composite was worse because the Character grid also clipped horizontally.

## Patch and interaction checks

- `AppLayout.tsx` gives narrow screens a bounded single-column grid, a short first row for the six-domain rail, min-width-zero children and reduced shell spacing; `xl` restores desktop grid and spacing.
- `SideNav.tsx` keeps six native buttons, icons and labels while making the rail a compact horizontal scrolling row below `xl`; desktop remains a vertical rail.
- `mobile-shell.css` changes only mobile presentation under `.gameplay-shell`: the existing resource group becomes HP/MP side-by-side with a full-width Stamina row, condition detail anchors onscreen, and the existing toast and Character strip use less surrounding padding. It relies on the aria labels supplied by the two draft UI components; review that contract when they are rebased. No values or severity are computed in CSS.
- Browser checks in the composed shell: 375×667 critical and toast, 375×812 normal, 768×1024, 1440×900, long name, and 320×667 stress. At 375 px the condition detail box was x=16–359, scrollable, and Escape closed it and returned focus to the critical trigger. Character End focused Discoveries; Home returned to Overview; Tab advanced to Attributes. Keyboard Enter reached the offscreen Chronicle domain via horizontal rail scroll, then returned to Character. No body-level horizontal overflow at tested widths. Actual browser zoom was not changed; 320 px is a narrow-width stress check, not a substitute for 200% zoom acceptance.
- The fixture evidence is synthetic/controlled. An authorized authenticated selected campaign was not available. Real tick changes, owner item action and Save/restart remain **unverified** and keep PR #7/#8 selected-client acceptance held.

## Tests and diagnostics

- Composed UI: `node --test tests/character-overview-render.test.mjs tests/character-owner-actions.test.mjs tests/top-status-bar-render.test.mjs tests/mobile-shell-navigation.test.mjs` from `apps/rpg-ui`: **4/4 pass**.
- Composed root: `node --test` for `character-section-navigation`, `character-attribute-presentation`, `calendar-climate-presentation`, `player-body-state`, `equipment-profiles-validation`, and `save-load-roundtrip`: **60/60 pass**.
- Shell-only branch: `node --test tests/mobile-shell-navigation.test.mjs`: **1/1 pass**. This asserts all six semantic buttons and active panel remain present; the pixel-height gate is independently browser measured.
- `npm run typecheck:node`: **pass** in both shell-only and composite.
- `npm exec -- vite build`: **pass** in both shell-only and composite; existing Browserslist/large-chunk warnings remain.
- Broad `npm run typecheck`: **red on clean master (121 diagnostics), shell-only branch (121), combined PR #7/#8 plus shell (119)**. The shell-only branch introduces **zero** new normalized diagnostic signatures. The composite has one changed PR #7 `CharacterPanel.tsx` optional-prop signature; that is owned by PR #7 and was deliberately not bundled here. The broad TS result is not green. Raw logs remain in the temporary `.mobile-shell-integration/docs/dev/mobile-shell-evidence` folder.
- `git diff --check`: pass on shell-only and composite.

## Screenshots

All images are from the controlled `InGameShell` fixture: `mobile-shell-evidence/before-375x667-critical.png`, `after-375x667-critical.png`, `after-375x667-condition-popup.png`, `after-375x667-long-critical.png`, `after-375x812-normal.png`, `after-768x1024.png`, `after-1440x900.png`, and `after-320x667-stress.png`.

## Integration disposition

Keep design PR #5, nutrition PR #6, Character PR #7 and top-bar PR #8 draft. The shell repair PR is independent and draft; it proves the controlled mobile layout gate, **not** selected-client acceptance or the full UI overhaul. Review/accept design authority, resolve PR #7's own typing and selected gates, resolve PR #8's selected gates, then combine PR #7, PR #8 and this shell patch with both register histories and rerun the viewport/keyboard/Save-restart checks before merging. The `composite_bow` re-equip issue remains a separate Equipment/Inventory owner task.

Applicable failure patterns: FP-001 (actual `InGameShell` browser caller), FP-002 (fixture proof does not accept selected gameplay), FP-008 (semantic combination), FP-009 (fresh exact branch heads), FP-015 (owner-derived critical state), FP-016 (popup placement and viewport clipping).

Suggested commit message: `fix(ui): preserve mobile Character workspace height in combined shell`.
