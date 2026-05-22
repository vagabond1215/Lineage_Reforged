# Current Codex Output

Source version/run: Version 0.5.73 - Bloodlines Handoff And Temporary Guardrail Cleanup
Date: 2026-05-22
Branch/status assumption: Ran locally on `master`; worktree was clean at start and now contains only the intended docs-only cleanup/output changes.

## Result
Completed the docs-only continuity cleanup after the Bloodlines projection and read-only account meta UI landed.

The direction-bearing docs now identify `Version 0.5.72 - Bloodlines Read-Only Account Meta UI` as the latest landed version, mark `Version 0.5.73 - Bloodlines Handoff And Temporary Guardrail Cleanup` as this cleanup pass, preserve durable Bloodlines rules in the future-system design ledger, and move the recommended next step away from finished Bloodlines read-only UI implementation.

No runtime behavior, UI behavior, tests, schemas, content JSON, generated output, Backstory Eligibility behavior, creator availability, Legacy purchase behavior, Family Prestige behavior, or Bloodlines projection behavior changed.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/dev/prompt-template-hardening-pass.md`
- `docs/dev/typecheck-blocker-triage-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/bloodlines-information-architecture-audit.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/design/heirloom-and-bequest-systems-plan.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md`
- `docs/design/chronicle-run-end-summary-source-audit.md`
- `docs/design/economy-clarity-audit.md`
- `docs/design/calendar-climate-popup-ia-audit.md`
- `docs/future_content_backlog.md`
- `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `tests/unit/bloodlines-presentation.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`

## Files Changed
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/bloodlines-information-architecture-audit.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/design/heirloom-and-bequest-systems-plan.md`
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Current Direction After Cleanup
- Latest landed version: `Version 0.5.72 - Bloodlines Read-Only Account Meta UI`.
- Current cleanup status: `Version 0.5.73 - Bloodlines Handoff And Temporary Guardrail Cleanup`.
- Next recommended version: `Version 0.5.74 - Typecheck Script And Target Policy Cleanup`.
- Why 0.5.74 is best: it is the smallest high-value foundation-stabilization pass before more UI/view-model work. The repo repeatedly records known broad typecheck blockers, and the existing `docs/dev/typecheck-blocker-triage-plan.md` already scopes a narrow cleanup that should make validation targets honest without weakening strictness or mixing with gameplay feature work.
- Likely owner-aware feature-planning step after that: `Version 0.5.75 - Chronicle Run-End Summary View Model Plan`, using `docs/design/chronicle-run-end-summary-source-audit.md`.

## Documentation Alignment
- `docs/dev/current-gpt-handoff.md`: replaced the stale 0.5.70/0.5.71 handoff with a short current handoff anchored on 0.5.72, Bloodlines projection/read-only UI landed state, active Bloodlines/Backstory/heirloom guardrails, temporary guardrail status, and the 0.5.74 recommendation.
- `docs/dev/project-roadmap.md`: updated the current anchor to latest landed 0.5.72, current cleanup 0.5.73, and next recommended 0.5.74; marked 0.5.71 and 0.5.72 as landed; moved future Bloodlines management/heirloom/bequest/spending work to later/deferred sections; corrected the typecheck triage plan row to point at the existing plan file.
- `docs/dev/project-vision-and-continuity-brief.md`: updated the current anchor and active pipeline so a new thread no longer sees 0.5.70/0.5.71 as current or Bloodlines UI as deferred.
- `docs/design/future-system-design-ledger.md`: folded in durable Bloodlines projection/read-only UI rules, including explicit data sources, `lineageId` and `sourceRunId` non-inference, inactive future-system non-actionability, Family Prestige read-only status, and no Backstory Eligibility evidence generation from Bloodlines UI.
- `docs/future_content_backlog.md`: added a concise 2026-05-22 cleanup note recording that Bloodlines continuity docs were aligned and deferred systems remain deferred.

## Temporary Guardrail Cleanup Decision
- `docs/design/bloodlines-information-architecture-audit.md`: marked partially consumed. Kept because richer Bloodlines tree/presentation constraints remain useful, but old 0.5.67/0.5.68 sequence numbers are no longer current pipeline authority.
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`: marked partially consumed. Kept because richer tree visualization, hierarchy/detail rules, and Chronicle/Bloodlines boundaries are still useful.
- `docs/design/heirloom-and-bequest-systems-plan.md`: kept and marked as the active planning guardrail for future heirloom/bequest runtime readiness. The read-only Bloodlines UI only shows heirloom/bequest notes as inactive.
- `docs/design/legacy-scope-bloodline-economy-plan.md`: marked partially consumed. Kept for remaining Family Prestige spending, Chronicle Marks, Lineage Seals, scoped Backstory evidence, heirloom/bequest economy, and Bloodline economy boundaries.
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md`: marked consumed but retained as a compact temporary checklist. It is not deleted because it still protects inheritance and Family Prestige vocabulary during future runtime-readiness work, while the newer heirloom/bequest plan and design ledger are now authoritative if they disagree.
- No temporary guardrail docs were deleted in this pass.

## Behavior / Runtime Confirmation
- runtime source changed: no.
- UI changed: no.
- tests changed: no.
- schemas changed: no.
- content JSON changed: no.
- generated output changed: no.
- Backstory Eligibility behavior changed: no.
- creator availability changed: no.
- Legacy purchase behavior changed: no.
- Family Prestige behavior changed: no.
- Bloodlines projection behavior changed: no.
- deferred systems touched: docs-only cleanup. Family management, richer tree behavior, heirs, heirlooms, bequests, item-instance persistence, estate transfers/claims, Family Prestige earning/spending behavior, Chronicle Marks, Lineage Seals, scoped Backstory Legacy evidence, generated UI output, and broader runtime behavior remain deferred.

## Checks Run
- `git diff --check` - passed with exit code 0; PowerShell reported LF-to-CRLF normalization warnings for touched docs.
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (53 files checked)`.
- `git diff --check` - passed again after updating `docs/dev/current-codex-output.md`; PowerShell reported LF-to-CRLF normalization warnings for touched docs.

## Risks / Follow-Up
- Temporary guardrail docs remain numerous. This pass marked consumed/partial status where useful, but did not delete any document because each still protects future tree, inheritance, spending, scoped-evidence, or economy boundaries.
- The next typecheck cleanup should stay separate from gameplay features and should not weaken strictness just to get a green broad command.
- After typecheck target policy is clearer, the next owner-aware feature-planning pass should likely return to Chronicle run-end summary view-model planning.
- The continuity brief still contains a long new-thread starter and broader strategic material; it is now current enough not to mislead, but could be shortened later if desired.

## Next Recommended Version
Version 0.5.74 - Typecheck Script And Target Policy Cleanup

Recommended route: Codex Local, using `docs/dev/typecheck-blocker-triage-plan.md` as the source plan. Keep it tooling/config scoped: clarify root/app typecheck targets, run the updated commands, record exact results, and do not change gameplay source, schemas, content JSON, UI behavior, generated output, or strictness policy beyond an explicit target split.

## Suggested Commit Message
docs(dev): align bloodlines handoff cleanup
