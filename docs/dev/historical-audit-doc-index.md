# Historical Audit Doc Index

Date: 2026-07-14
Route: Historical Route Cleanup And Static Content Expansion Pipeline Integration
Status: supporting historical-document index; no source/UI/content changes

## Purpose

Provide one compact reference for older audit, scoping, triage, and prompt-guidance documents so future connector and Codex runs know which files are authoritative, retained as source detail, or candidates for later folding.

This index does not replace:

- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- focused `docs/design/*-plan.md` files

## Rules

- Do not use historical version labels inside old audit docs as current pipeline authority.
- Prefer the listed successor/current authority when it conflicts with a historical audit.
- Do not delete retained docs until their fold/delete condition is met.
- Do not let this index advance roadmap versions.
- Patch numbers may exceed two digits; do not roll `0.5.99` to `0.6.0` without explicit roadmap milestone authority.

## Current Active Boundary

`docs/dev/historical-version-and-deferred-route-register.md` now owns historical version identity, aliases, suffixes, and deferred reopening triggers. `Version 0.6.4 - World And Settlement Static Content Expansion` is complete and accepted; the active implementation path is `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`. This supporting document index must not change that sequencing.

## Index

| Historical document | Successor / current authority | Status | Fold/delete condition |
| --- | --- | --- | --- |
| `docs/design/economy-clarity-audit.md` | `docs/design/economy-price-clarity-view-model-plan.md` | Promoted; retained source-detail reference. | Fold useful labels/copy into the view-model plan, backlog, or a later economy clarity UI plan before deletion. |
| `docs/dev/economy-runtime-test-failure-triage-plan.md` | Current economy validation history and focused tests. | Consumed historical triage reference. | Candidate to fold/delete after economy validation history is summarized elsewhere or no longer needed. |
| `docs/design/calendar-climate-popup-ia-audit.md` | `docs/design/calendar-climate-popup-view-model-plan.md` | Promoted; retained supporting source-detail reference. | Keep until climate-profile resolver ownership is addressed or explicitly deferred. |
| `docs/design/chronicle-run-end-summary-source-audit.md` | `docs/design/chronicle-run-end-summary-view-model-plan.md` | Consumed historical source audit. | Candidate to fold/delete after useful source mapping is summarized into the Chronicle plan or backlog. |
| `docs/design/combat-audit-scoping-pass.md` | `docs/design/combat-equipment-mapping-audit-plan.md` | Promoted; retained source-detail reference. | Keep until remaining combat/equipment mapping gaps are resolved, re-planned, or explicitly abandoned. |
| `docs/design/magic-runtime-readiness-audit.md` | Current magic ownership/readiness/command/resolver design chain. | Promoted into active planning chain. | Keep while the current magic chain remains active. Fold later after the chain reaches a stable owner boundary. |
| `docs/design/heirloom-vs-bequest-vocabulary-audit.md` | `docs/design/heirloom-and-bequest-systems-plan.md`; `docs/design/future-system-design-ledger.md` | Consumed but retained compact checklist. | Keep until heirloom/bequest readiness cleanup begins. Fold missing vocabulary into durable docs before deletion. |
| `docs/design/bloodlines-information-architecture-audit.md` | Current Bloodlines presentation docs/backlog. | Partially consumed; retained future presentation reference. | Keep until richer Bloodlines presentation work is scoped or explicitly deferred. |
| `docs/dev/typecheck-blocker-triage-plan.md` | Current validation policy and remaining typecheck blocker tracks. | Partially consumed temporary guardrail. | Keep until remaining typecheck blocker tracks are resolved or replaced by a current cleanup plan. |
| `docs/dev/prompt-template-hardening-pass.md` | Current prompt-generation guidance. | Active connector prompt guidance. | Do not delete while prompt generation remains active. Refresh when process mistakes appear. |
| `docs/dev/temporary-docs-retirement-audit.md` | This index plus roadmap maintenance rules. | Recent connector-only retirement audit. | Candidate to fold/delete after this index is accepted as the compact reference. |

## Current Authority Families

| Topic | Use first | Historical reference |
| --- | --- | --- |
| Economy clarity | `docs/design/economy-price-clarity-view-model-plan.md` | `docs/design/economy-clarity-audit.md` |
| Economy validation history | focused economy validation notes/tests | `docs/dev/economy-runtime-test-failure-triage-plan.md` |
| Calendar / Climate | `docs/design/calendar-climate-popup-view-model-plan.md` | `docs/design/calendar-climate-popup-ia-audit.md` |
| Chronicle / Account Meta | `docs/design/chronicle-run-end-summary-view-model-plan.md` | `docs/design/chronicle-run-end-summary-source-audit.md` |
| Combat / Equipment | `docs/design/combat-equipment-mapping-audit-plan.md` | `docs/design/combat-audit-scoping-pass.md` |
| Magic chain | current focused magic design plans | `docs/design/magic-runtime-readiness-audit.md` |
| Inheritance / Bloodlines | durable systems plan and design ledger | heirloom and Bloodlines audit docs |
| Tooling / prompt process | prompt template and typecheck triage docs | temporary docs retirement audit |

## Safe Future Cleanup Path

1. Review this index after the active `0.5.100` path has a stable handoff.
2. Fold useful content from candidate docs into their successor plans or backlog.
3. Delete only one or two clearly consumed files per cleanup run.
4. Never delete active source docs while the current implementation path depends on them.
5. Do not update version sequencing as part of historical-doc cleanup unless correcting a real inconsistency.

## Later Cleanup Candidate

After the `0.6.4`-`0.6.7` content program, a fold-ready pass may review:

- `docs/design/economy-clarity-audit.md`
- `docs/dev/economy-runtime-test-failure-triage-plan.md`
- `docs/design/chronicle-run-end-summary-source-audit.md`

That later output should be a proposal, not deletion:

- facts worth folding
- destination doc
- deletion condition
- whether deletion should wait until after `0.5.100`
