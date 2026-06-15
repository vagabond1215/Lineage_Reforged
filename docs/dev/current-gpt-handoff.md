# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.169 - Religion Knowledge Domain Seed Content Plan`
Date: 2026-06-15
Branch/status assumption: `master`; worktree was clean before this documentation-only run.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/religion-knowledge-domain-plan.md` owns the broad Religion boundary and hotspot/non-runtime constraints.
- `docs/design/religion-knowledge-vocabulary-validator-plan.md` owns the `religion` and `deity` schema/validator authority decisions.
- `docs/design/religion-knowledge-domain-seed-content-plan.md` owns the exact first Religion seed content plan and activation path.
- `packages/content/base/player/knowledge_domain_registry.json` keeps Religion `status: "planned"` with null trial, completion, and visibility policy refs until the future seed run.
- `packages/schemas/player/knowledge_snippet.schema.json` and `packages/schemas/player/knowledge-domain-registry.schema.json` include exactly `religion` and `deity` as the first direct Religion subject vocabulary.
- `tools/content-lint/knowledge-snippets.mjs` resolves `world.religions` top-level religion ids and flattened nested deity ids, with duplicate and malformed-id rejection.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.169 - Religion Knowledge Domain Seed Content Plan`

Immediate next:

- `Version 0.5.170 - Religion Knowledge Domain Seed`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.169 Decision

- Documentation-only planning selected exactly two future snippets:
  - `knowledge_snippet.religion.elemental_pantheon.identification`
  - `knowledge_snippet.religion.light_lady.identification`
- The future implementation should activate `knowledge_domain.religion` in the same run that adds those snippets.
- The future implementation should not do a status-only activation run.
- All Religion policy refs remain null.
- Religion remains planned today and no snippets are live.
- The optional third opposition/duality snippet is deferred.
- Religious hotspots remain deferred until dominant/tolerated faith, mismatch pressure, direct place identity, and owner/runtime consequence plans exist.
- `Religious Favorability And Elemental Alignment Plan` remains a future design candidate only.

## Guardrails For 0.5.170

- Implement only the exact two planned Religion snippets and the same-run Religion activation.
- Keep `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` null.
- Do not change schemas, validators, tests, world religion content, trial/readiness content, runtime, UI, storage, rewards, events, commands, faction/reputation/law/conversion behavior, favorability, elemental alignment, spell penalties, Prestige, Magic Study, family, or gameplay.
- Normal content lint should remain `content-lint: ok (56 files checked)`.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.170` | Religion Knowledge Domain Seed | Next |
| 2 | `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 3 | `0.5.172` | Religious Favorability And Elemental Alignment Plan | Optional recommended candidate after first seed |
| 4 | `0.5.173` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 5 | `0.5.174` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 6 | `0.5.175` | Offspring Growth Role And Activity Build Plan | Recommended |
| 7 | `0.5.176` | Recipe Ownership And Personal Learning Plan | Recommended |
| 8 | `0.5.177` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
