# Connector Preflight — Soundings F3 Compatibility Repair

Date: 2026-09-25. Repository: `vagabond1215/Lineage_Reforged` only.

Disposition: **F3_REPAIR_READY**.

## Exact state

- Runtime requiring F3 repair remains `0383cedc99a4c3d5e2c9b47cf0665683720aef9e`.
- F3 audit publication was `232379e58675d3b9fb97c56c11bbf789cdc36976`.
- Connector F3 preparation advanced hosted `master` through the retention-sufficiency decision to `b36eec73b3c0505c35c9198ddcbd5786671d7ed6`; these new commits are documentation only.
- Compare from runtime `0383ced...` to preflight master shows only documentation/evidence/coordination paths; there is no post-runtime production, implementation-test, schema, content or dependency drift.

## Hosted collaboration posture

Fresh Connector query: four hosted branches total:

- `master`;
- `admin/genesis-research-evidence-2026-08-13`;
- `parallel/prompt-packaging-integrity-audit`;
- `prep/integrated-gameplay-0-7-readiness-audit`.

Fresh scoped query: zero open pull requests. Existing protected/held branch dispositions and triggers remain authoritative; no lifecycle mutation is due from this preflight.

## Prepared F3 packets

Read in this order before local implementation:

1. `docs/dev/connector-audit-soundings-f3-survey-admission-view-2026-09-25.md`;
2. `docs/dev/connector-audit-soundings-f3-fingerprint-reconstruction-2026-09-25.md`;
3. `docs/dev/connector-matrix-soundings-f3-owner-compatibility-2026-09-25.md`;
4. `docs/design/soundings-f3-survey-admission-retention-sufficiency-decision.md`.

The retention decision is `RETENTION_SUFFICIENT_BOUNDED_REPAIR_AUTHORIZED`: no new persistence contract/schema is required unless executable work disproves the static invariants.

## Local delta verification instruction

After fetch/prune, verify that the delta from `0383ced...` to current `master` remains docs/evidence only. If production or tests have advanced unexpectedly, stop and reconcile that delta before applying the prepared implementation map. Otherwise do not redo broad repository archaeology.

## Intended repair surface

Expected smallest production surface: `packages/engines/game-engine/src/soundings-turn-in-authority.ts`, plus focused F3 tests and only genuinely required adjacent bridge/export changes. The accepted repair approach is admission-survey prefix recovery using the frozen fingerprint; no witness/schema/version migration is currently authorized or needed.
