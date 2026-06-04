# Temporary Docs Retirement Audit

Date: 2026-06-04
Route: ChatGPT via GitHub Connector
Status: connector-only audit index; no runtime/source/UI/content changes

## Purpose

Identify old audit, triage, and prompt-guidance documents that can be safely retained, folded, or retired later without interfering with the active roadmap.

This run does not update version sequencing, does not touch `docs/dev/current-codex-output.md`, and does not change source code. The active roadmap remains `Version 0.5.100 - Runtime Cast Resolver Readiness Helper`.

## Rules Used

- Treat `docs/dev/project-roadmap.md` as the authority for active pipeline and audit/source-index status.
- Treat current handoff and Codex output files as off-limits unless a real inconsistency is found.
- Do not delete files in this audit.
- Prefer `retain`, `fold later`, or `candidate for later deletion` over immediate removal.
- Do not treat historical version labels inside old audit docs as current pipeline authority.
- Do not let cleanup runs advance roadmap versions.

## Current Active Roadmap Boundary

The active roadmap should remain focused on:

- `Version 0.5.100 - Runtime Cast Resolver Readiness Helper`

This audit is intentionally outside that path. It should not change magic runtime sequencing, implementation priority, or validation requirements.

## Retirement Matrix

| Document | Current status | Recommendation | Reason |
| --- | --- | --- | --- |
| `docs/design/economy-clarity-audit.md` | Promoted into `docs/design/economy-price-clarity-view-model-plan.md`; historical source-detail reference. | Fold later, then delete candidate. | The audit explicitly says it was promoted and should not be current pipeline authority. Keep until economy clarity UI direction is chosen or its remaining useful copy is folded into the view-model plan/backlog. |
| `docs/dev/economy-runtime-test-failure-triage-plan.md` | Historical source-detail reference after `0.5.80`. | Fold later, then delete candidate. | Retain only while economy runtime validation history is useful. Do not use as active implementation source unless a future economy runtime test failure appears. |
| `docs/design/calendar-climate-popup-ia-audit.md` | Promoted into `docs/design/calendar-climate-popup-view-model-plan.md`; supporting source-detail reference. | Retain for now. | Roadmap says keep until climate-profile resolver ownership is addressed or explicitly deferred. |
| `docs/design/chronicle-run-end-summary-source-audit.md` | Consumed historical source audit. | Fold later, then delete candidate. | The audit says it was promoted into the Chronicle view-model plan and retained only as historical source-detail reference. Useful facts can be folded into backlog or the Chronicle plan if still needed. |
| `docs/design/combat-audit-scoping-pass.md` | Promoted into `docs/design/combat-equipment-mapping-audit-plan.md`; retained source-detail reference. | Retain for now. | Combat/equipment mapping still has deferred gaps. Do not delete until those gaps are resolved or explicitly re-indexed. |
| `docs/design/magic-runtime-readiness-audit.md` | Promoted into known-spell ownership and later magic runtime plans. | Retain for now. | Magic runtime work is still active; keep as source-detail history until the current magic chain exits ownership/readiness scaffolding. |
| `docs/design/heirloom-vs-bequest-vocabulary-audit.md` | Consumed but retained compact checklist. | Retain for now. | The audit says durable vocabulary moved to the systems plan and design ledger, but keep as a compact checklist until heirloom/bequest runtime-readiness cleanup. |
| `docs/design/bloodlines-information-architecture-audit.md` | Partially consumed by Bloodlines work. | Retain for now. | Roadmap says keep for richer tree and future Bloodlines presentation constraints. |
| `docs/dev/typecheck-blocker-triage-plan.md` | Partially consumed temporary guardrail. | Retain for now. | Pass A landed, but remaining typecheck blocker tracks are still useful and should stay separate from gameplay work. |
| `docs/dev/prompt-template-hardening-pass.md` | Connector-only prompt guidance. | Retain and optionally refresh later. | Still useful for prompt generation and does not interfere with roadmap. |

## Recommended Non-Interfering Follow-Up Runs

### 1. Prompt Template Refresh

Update `docs/dev/prompt-template-hardening-pass.md` so future prompts explicitly preserve the `0.5.99 -> 0.5.100` numbering rule and do not roll to `0.6.x` without a milestone declaration.

Allowed files:

- `docs/dev/prompt-template-hardening-pass.md`

Forbidden:

- roadmap sequencing changes
- source/runtime/UI/content edits
- `docs/dev/current-codex-output.md`

### 2. Historical Docs Index

Create a compact index that points to retained historical audit docs and their authoritative successor docs.

Suggested file:

- `docs/dev/historical-audit-doc-index.md`

Allowed content:

- document path
- successor/authority document
- current status
- deletion/folding condition

Forbidden:

- deleting docs
- updating active roadmap sequence
- implementation prompts

### 3. Fold-Ready Candidate Pass

Inspect only fold/delete candidates and produce a proposed patch list, but do not delete anything without explicit approval.

Candidate files:

- `docs/design/economy-clarity-audit.md`
- `docs/dev/economy-runtime-test-failure-triage-plan.md`
- `docs/design/chronicle-run-end-summary-source-audit.md`

Output:

- what facts should be folded
- destination doc
- whether deletion is safe after folding

## Do Not Run Yet

Avoid these as connector-side cleanup until the active roadmap asks for them:

- source-code cleanup in combat, economy, magic, UI, save, or account systems
- deletion of historical audit docs
- broad typecheck blocker implementation
- roadmap version reordering
- active magic implementation outside `0.5.100`

## Summary

No immediate deletion is recommended. The safest next connector run is a prompt-template refresh or a historical audit-doc index. Both are docs-only and do not interfere with the active `0.5.100` runtime resolver readiness helper path.
