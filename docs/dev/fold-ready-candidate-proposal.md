# Fold-Ready Candidate Proposal

Date: 2026-06-04
Route: ChatGPT via GitHub Connector
Status: connector-only proposal; no deletion, source, UI, content, or roadmap changes

## Purpose

Review three historical docs that the historical audit index marked as possible fold/delete candidates and propose what, if anything, should be folded before later deletion.

This proposal does not delete files. It does not update version sequencing. The active implementation path remains `Version 0.5.100 - Runtime Cast Resolver Readiness Helper`.

## Candidate Summary

| Candidate | Current state | Recommendation | Delete now? |
| --- | --- | --- | --- |
| `docs/design/economy-clarity-audit.md` | Promoted into `docs/design/economy-price-clarity-view-model-plan.md`. | Nearly fully folded. Safe deletion candidate after a final confirmation pass. | No |
| `docs/dev/economy-runtime-test-failure-triage-plan.md` | Consumed historical triage after `0.5.80`. | Fold only a compact validation-history note into backlog or keep as historical validation note. | No |
| `docs/design/chronicle-run-end-summary-source-audit.md` | Promoted into `docs/design/chronicle-run-end-summary-view-model-plan.md` and consumed by later projection/UI work. | Mostly folded. Retain until Chronicle follow-up priorities are stable or source mapping is copied to backlog. | No |

## 1. Economy Clarity Audit

File:

- `docs/design/economy-clarity-audit.md`

Successor/current authority:

- `docs/design/economy-price-clarity-view-model-plan.md`

### Findings

The audit already says it was promoted into the economy price clarity view-model plan and should not be treated as current pipeline authority.

Nearly all useful content appears folded into the successor plan:

- current economy data owners
- price, spread, scarcity, labor, trade, craft/value clarity labels
- current-data safety rules
- pure projection boundary
- forbidden behavior
- test expectations
- cleanup decision

The successor plan is more precise than the audit because it includes explicit input/output shapes, deterministic label thresholds, allowed/deferred behavior, focused tests, and validation expectations.

### Facts worth folding, if not already copied

Only retain if a future economy clarity cleanup wants a shorter human-facing summary:

- player-facing label philosophy: meaning before raw formulas
- small card examples for price and trade clarity
- compact explanation that this is read-only clarity, not economic behavior

Destination options:

- `docs/future_content_backlog.md` under deferred economy UI work
- future economy clarity UI plan, if one is created

### Recommendation

Mark as safe deletion candidate after one final grep/review confirms no current docs still cite it as an active source. Do not delete during the active `0.5.100` path.

## 2. Economy Runtime Test Failure Triage Plan

File:

- `docs/dev/economy-runtime-test-failure-triage-plan.md`

Successor/current authority:

- `docs/dev/current-codex-output.md` historical notes for `0.5.80`
- focused economy runtime/trade tests
- backlog or historical audit index for retained context

### Findings

This file is already explicitly marked as consumed historical triage and no longer active prompt authority.

It remains useful only as a concise explanation of why `0.5.80` happened after `0.5.79`:

- economy clarity projection passed
- unrelated existing economy runtime/trade tests failed
- the failures were triaged as runtime/test/content expectation issues, not projection regressions
- `0.5.80` restored focused validation while preserving no-UI/no-command/no-broad-expansion boundaries

### Facts worth folding

Fold this compact note somewhere durable if the file is later deleted:

```text
After 0.5.79, economy clarity projection tests passed, but existing civilization runtime/trade suites exposed stale runtime/test expectations. 0.5.80 resolved those focused validation blockers without expanding economy UI, shop/trade/craft commands, generated output, or broad economy behavior.
```

Destination options:

- `docs/future_content_backlog.md` as a historical validation note
- `docs/dev/historical-audit-doc-index.md` as an expanded row note

### Recommendation

Safe deletion candidate after the compact historical note is folded elsewhere. Do not delete during the active `0.5.100` path.

## 3. Chronicle Run-End Summary Source Audit

File:

- `docs/design/chronicle-run-end-summary-source-audit.md`

Successor/current authority:

- `docs/design/chronicle-run-end-summary-view-model-plan.md`
- implemented Chronicle projection/UI work from `0.5.76` and `0.5.77`
- current account meta presentation/source files when future Chronicle work is explicitly scoped

### Findings

The audit is explicitly marked as consumed and promoted into the Chronicle view-model plan.

Most useful details are already folded into the successor plan:

- data-owner map
- current repo reality
- allowed source fields
- forbidden inference rules
- read-only output shape
- estate/source-run/lineage/family boundaries
- test requirements

The audit still has compact narrative sectioning that may be useful as historical explanation, but it is no longer needed as prompt authority.

### Facts worth folding, if not already copied

Only retain if a future Chronicle cleanup wants a brief source-history note:

- run-end summary attaches after lifecycle owners produce authoritative terminal results
- Account Meta Chronicle tiles were the label precedent, but the richer single-run summary uses its own projection boundary
- summary copy must avoid implying unsupported rewards, bequests, heirlooms, or family-management behavior

Destination options:

- `docs/future_content_backlog.md` under Chronicle/Bloodlines deferred notes
- `docs/design/chronicle-run-end-summary-view-model-plan.md` if a compact historical note is desired

### Recommendation

Candidate for later deletion after a Chronicle-specific cleanup confirms the implemented projection/UI and successor plan fully cover its source mapping. Do not delete during the active `0.5.100` path.

## Proposed Later Cleanup Order

After the active `0.5.100` path has a stable handoff:

1. Fold the economy runtime triage compact note into backlog or historical index.
2. Delete `docs/dev/economy-runtime-test-failure-triage-plan.md` if no active references remain.
3. Confirm economy clarity audit references; delete `docs/design/economy-clarity-audit.md` if the successor plan remains sufficient.
4. Delay Chronicle audit deletion until a later Chronicle-focused pass, because Chronicle/account meta work is more cross-system and may benefit from retained historical source mapping.

## Do Not Do In This Proposal

- Do not delete candidate docs.
- Do not update active roadmap files.
- Do not update `docs/dev/current-codex-output.md`.
- Do not touch source, tests, UI, content JSON, generated output, or runtime behavior.
- Do not create implementation prompts from this proposal.

## Next Recommended Connector Pass

No more historical-doc cleanup is necessary before the active `0.5.100` work.

If another connector-only pass is desired later, run a reference-check pass for these candidate docs:

- search for active references to the three candidate files
- report whether references are historical-only or active
- then ask before deleting anything
