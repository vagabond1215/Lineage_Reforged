# Current Codex Output

Source version/run: Version 0.5.72 - Bloodlines Read-Only Account Meta UI
Date: 2026-05-21
Branch/status assumption: Ran locally on `master`; worktree was clean at start and now contains only the intended narrow source/test/backlog/output changes.

## Result
Rendered the existing pure Bloodlines projection in the account meta launcher surface as a read-only `Bloodlines` section. The UI now consumes `buildBloodlinesViewModel(accountProfile)` and presents summary stats, family cards, Family Prestige ledger totals, family unlock summaries, linked run/tree summaries, safe empty state copy, and inactive future-system notes.

No mutation path, command id, button, purchase/spend/claim/register/transfer action, family management behavior, or deferred runtime system was added.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/bloodlines-information-architecture-audit.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/design/heirloom-and-bequest-systems-plan.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/future_content_backlog.md`
- `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/SettingsScreen.tsx`
- `tests/unit/bloodlines-presentation.test.mjs`
- `tests/unit/account-family.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`
- `tests/unit/legacy-unlocks.test.mjs`

## Files Changed
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/SettingsScreen.tsx`
- `tests/unit/legacy-ledger-presentation.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## UI Summary
- Bloodlines appears as a third account meta section beside `Legacy` and `Chronicles`; the launcher and settings shortcuts can now open it directly.
- `AccountMetaPanel` builds `const bloodlines = useMemo(() => buildBloodlinesViewModel(accountProfile), [accountProfile]);` and renders only that read-only projection.
- Summary stats render from `bloodlines.summaryStats`, covering current family, member, linked run, Family Prestige, and family unlock totals already exposed by the projection.
- Empty state renders the projection's safe `emptyLabel` when no explicit family records exist.
- Family cards render family name, status, root label, member count, linked run count, latest known activity, unlock count, warnings, and read-only tree/run summaries.
- Family Prestige renders as ledger-derived available, earned, spent, and category totals only. No spending UI was added.
- Family unlocks render as inert labels scoped to their owning family. They are not shown account-wide and no purchase or activation controls were added.
- Linked run/tree summaries render only the explicit projection data. The UI does not infer family from `lineageId`, does not infer parent/child links from `sourceRunId`, and does not fabricate roots, heirs, branches, titles, or family legitimacy.
- Inactive future systems render as read-only status cards for heirs, heirlooms, bequests, family management, and Family Prestige spending. They display `Inactive` state labels and note text only.
- No action buttons, command ids, click handlers, family creation/editing controls, purchase/spend/claim/register/transfer controls, or Backstory resolver evidence generation were added.

## Behavior / Runtime Confirmation
- runtime mutation changed: no.
- UI changed: yes, read-only Bloodlines section only.
- schemas changed: no.
- tests changed: yes, focused static presentation coverage was updated.
- content JSON changed: no.
- generated output changed: no.
- Backstory Eligibility behavior changed: no.
- creator availability changed: no.
- Legacy purchase behavior changed: no.
- Family Prestige spending changed: no.
- heirloom/bequest runtime added: no.
- family management added: no.
- deferred systems touched: read-only presentation only. Family management, heirs, heirlooms, bequests, item-instance persistence, estate transfers/claims, Family Prestige earning/spending behavior, Chronicle Marks, Lineage Seals, scoped Backstory Legacy evidence, generated UI output, and broader runtime behavior remain deferred.

## Tests / Checks Run
- `npm run tool:content-lint` - blocked by local PowerShell execution policy for `npm.ps1`; no project failure.
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (53 files checked)`.
- `node --test tests/unit/bloodlines-presentation.test.mjs` - passed, 12 tests.
- `node --test tests/unit/account-family.test.mjs` - passed, 5 tests.
- `node --test tests/unit/account-profile-storage.test.mjs` - passed, 14 tests.
- `node --test tests/unit/legacy-ledger-presentation.test.mjs` - passed, 13 tests.
- `node --test tests/unit/legacy-unlocks.test.mjs` - passed, 21 tests.
- `git diff --check` - passed with exit code 0; PowerShell reported LF-to-CRLF normalization warnings for touched files.

## Risks / Follow-Up
- There is no existing lightweight React component render harness for `AccountMetaPanel`, so this pass used the existing projection unit tests plus static presentation assertions rather than inventing a broad UI test harness.
- No broad typecheck was run because previous handoffs record known broad workspace typecheck blockers, and this pass had focused validation requirements.
- Future UI QA should visually inspect the Bloodlines section at desktop and mobile widths once a dev-server/browser pass is in scope.
- The launcher has no dedicated Bloodlines image asset; it falls back to existing text-only launcher sidebar behavior. Generated UI output and new visual assets were intentionally not touched.
- Future work must keep inactive Bloodlines-adjacent systems non-actionable until their runtime owners, schemas, validation, and tests exist.

## Temporary Guardrail Cleanup Decision
- Keep `docs/design/bloodlines-information-architecture-audit.md` for now. It remains useful for the next Bloodlines handoff and temporary guardrail cleanup pass.
- Keep `docs/design/chronicles-bloodline-tree-presentation-plan.md` for now. This pass rendered a read-only view, but later tree presentation and Chronicle integration cleanup still need its constraints.
- Keep `docs/design/heirloom-and-bequest-systems-plan.md` for now. The Bloodlines UI only marks those concepts inactive; heirloom/bequest runtime and UI rules remain planning guidance.
- Keep `docs/design/legacy-scope-bloodline-economy-plan.md` for now. Family Prestige spending, scoped evidence, and economy boundaries remain deferred.
- Recommended cleanup later: fold durable Bloodlines read-only presentation rules into `docs/design/future-system-design-ledger.md` or the current handoff, then retire temporary guardrail docs that are no longer actively protecting an upcoming implementation.

## Next Recommended Version
Version 0.5.73 - Bloodlines Handoff And Temporary Guardrail Cleanup

This is the best next step because the Bloodlines projection and read-only UI have now landed, while the current handoff, roadmap-facing sequencing, and temporary guardrail docs should be pruned so future work moves cleanly toward the next owner-aware implementation slice.

## Suggested Commit Message
feat(account): render read-only bloodlines panel
