# Current Codex Output

Source version/run: Version 0.5.77 - Chronicle Run-End Read-Only UI
Date: 2026-05-24
Branch/status assumption: Ran locally on `master`. Preflight showed a clean worktree aligned with `origin/master`; default `git pull` was blocked by local SSL certificate validation, then `git -c http.sslBackend=schannel pull` fast-forwarded `master` from `32e90a6` to `1c99b56`. `git status --short --branch` then showed clean `master...origin/master` before edits.

## Result
Rendered the tested Chronicle run-end summary projection read-only inside the existing account meta Chronicles surface.

`AccountMetaPanel` now builds a `ChronicleRunEndSummaryViewModel` for the first visible run record in the active Chronicle filter and renders its projection-owned rows in a read-only `Run-End Summary` panel. The UI layer owns layout only; it does not duplicate payout, estate, continuity, or warning logic.

No lifecycle mutation, payout recomputation, estate movement, Legacy grant, Bloodlines behavior, Chronicle Mark, Lineage Seal, Family Prestige behavior, schema, content JSON, generated output, or account mutation was added.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/chronicle-run-end-summary-view-model-plan.md`
- `docs/design/chronicle-run-end-summary-source-audit.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts`
- `tests/unit/chronicle-run-end-summary-presentation.test.mjs`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`
- `tests/unit/legacy-ledger-presentation.test.mjs`

## Files Changed
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `tests/unit/chronicle-run-end-summary-ui.test.mjs`
- `docs/dev/current-codex-output.md`

## UI Boundary
The summary renders in the existing `AccountMetaPanel` Chronicles section, after the Chronicle filter controls and before the filtered Chronicle tile list.

The UI computes:

- the active filter's visible Chronicle tiles from existing account meta presentation state;
- the first matching stored `AccountRunHistoryRecord` from `accountProfile.history.runRecords`;
- a `chronicleRunEndSummary` by calling `buildChronicleRunEndSummaryViewModel({ accountProfile, runRecord })`.

No `lifecycleResult` is passed from this surface, so active/non-terminal records cannot receive stale terminal lifecycle context.

The new `ChronicleRunEndSummaryPanel` renders only projection output:

- title/subtitle/outcome badge
- warnings
- identity rows
- origin rows
- survival rows
- progression rows
- deed rows
- payout metadata rows
- estate summary rows
- continuity rows
- slot rows

The React component does not compute payout, source links, estate matches, achievement fallbacks, or warning content. Those remain owned by `chronicleRunEndSummaryPresentation.ts`.

## Read-Only Guardrails Enforced
- No new action props, callbacks, handlers, command ids, or buttons were added for the run-end summary.
- The run-end summary component renders no `<button>` elements.
- The UI does not import or call `resolveRunLegacyPayout(...)`.
- The UI does not recompute payout or inspect payout math inputs.
- The UI does not grant Legacy or create Legacy transactions.
- The UI does not deposit, move, claim, deliver, split, transfer, or mutate estate assets.
- The UI does not create Chronicle Marks or Lineage Seals.
- The UI does not create Family Prestige grants or spending.
- The UI does not create or mutate Bloodlines behavior.
- The UI does not create heirs, heirlooms, bequests, family records, or family management.
- The UI does not infer `familyId` or parent/child relationships; it renders projection rows only.
- The existing Legacy purchase/preparation callbacks remain unchanged and scoped to the Legacy section behavior that already existed.

## Behavior / Runtime Confirmation
- lifecycle behavior changed: no
- payout behavior changed: no
- payout recomputation added to UI: no
- estate behavior changed: no
- estate delivery/claim/transfer behavior added: no
- Legacy behavior changed: no
- Bloodlines behavior changed: no
- Chronicle Marks added: no
- Lineage Seals added: no
- Family Prestige behavior changed: no
- schema changed: no
- content JSON changed: no
- generated output changed: no
- account mutation changed: no
- UI changed: yes, read-only Chronicle run-end summary panel only
- tests changed: yes, one focused UI/static test file added

## Tests Added / Updated
Added `tests/unit/chronicle-run-end-summary-ui.test.mjs` covering:

1. Account meta Chronicles surface imports/calls the projection and renders summary row groups from projection output.
2. The run-end summary UI component is read-only and has no forbidden action paths, buttons, command ids, claim/transfer/bequest/heirloom labels, Marks, Seals, Family Prestige behavior, or payout resolver call.
3. Account meta passes no stale lifecycle result context into the projection.
4. Existing Legacy, Chronicles, and Bloodlines account meta sections remain, and no run-end mutation callbacks were added.

Existing 0.5.76 projection tests were preserved.

## Checks Run
- `git status --short --branch` - clean `master...origin/master` before sync.
- `git pull` - failed before edits due local SSL certificate validation: `SSL certificate OpenSSL verify result: unable to get local issuer certificate (20)`.
- `git -c http.sslBackend=schannel pull` - passed; fast-forwarded `master` to `origin/master`.
- `git status --short --branch` - passed after sync; clean `master...origin/master`.
- `node --test tests/unit/chronicle-run-end-summary-ui.test.mjs` - passed, 4 tests.
- `node --test tests/unit/chronicle-run-end-summary-presentation.test.mjs` - passed, 17 tests.
- `node --test tests/unit/chronicle-run-end-summary-ui.test.mjs` - passed, 4 tests.
- `node --test tests/unit/run-lifecycle.test.mjs` - passed, 13 tests.
- `node --test tests/unit/legacy-ledger-presentation.test.mjs` - passed, 13 tests.
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (53 files checked)`.
- `git diff --check` - passed with LF-to-CRLF warnings for `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx` and `docs/dev/current-codex-output.md`.

No broad typecheck was run because this pass did not require it and the repo documents known typecheck blockers.

## Risks / Follow-Up
- The summary currently shows the first run record in the active Chronicle filter rather than a user-selected detailed tile. A later UI pass can add selection if it stays read-only and action-free.
- Existing Chronicle estate preview copy remains unchanged and still uses its current read-only claim-preview language outside the new run-end summary panel.
- The new panel is static/read-only; no browser screenshot or build was run because this pass avoided broad UI build/typecheck targets with known blockers.
- No new deferred work was discovered, so `docs/future_content_backlog.md` was not changed.

## Temporary Guardrail Cleanup Decision
`docs/design/chronicle-run-end-summary-source-audit.md` has now served the 0.5.75 planning, 0.5.76 projection, and 0.5.77 read-only UI sequence. It should be marked consumed or folded/deleted in a later connector/docs cleanup pass after durable run-end summary rules are promoted into `docs/design/future-system-design-ledger.md`. It is no longer needed as an active implementation source for the next run.

## Next Recommended Version
Version 0.5.78 - Economy Price Clarity View Model Plan

## Suggested Commit Message
feat(chronicle): render run-end summary read-only
