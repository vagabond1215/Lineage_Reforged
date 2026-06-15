# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.167 - Religion Knowledge Vocabulary And Validator Plan`
Date: 2026-06-15
Branch/status assumption: clean `master` at commit `d4dfa37` before edits.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/religion-knowledge-domain-plan.md` owns the broad Religion boundary and hotspot/non-runtime constraints.
- `docs/design/religion-knowledge-vocabulary-validator-plan.md` owns the exact first subject set, schema posture, resolver rules, tests, activation boundary, and `0.5.168` acceptance criteria.
- `packages/content/base/player/knowledge_domain_registry.json` contains planned Religion metadata with null policies.
- Current schemas, validators, and world religion content remain unchanged authorities until implementation.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.167 - Religion Knowledge Vocabulary And Validator Plan`

Immediate next:

- `Version 0.5.168 - Religion Knowledge Schema And Validator Vocabulary`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.167 Decision

- Add exactly `religion` and `deity` as the first direct Religion snippet subjects.
- Expand both snippet and registry subject enums in the implementation run.
- Add explicit `world.religions` authority for top-level religion records and nested deity records.
- Reject duplicate and unknown religion/deity ids.
- Keep the existing active-domain requirement; Religion remains planned and cannot receive snippets yet.
- Current world religion content is sufficient for pantheon and deity facts, so no authority-hardening run is required first.
- Defer orders, doctrine, rites, holy days, shrines, sacred sites, hotspots, and general settlement/culture/institution/historical-event enablement.

## Guardrails For 0.5.168

- Implement only schema vocabulary, planned registry vocabulary alignment, snippet resolver authority, normal-lint dependency loading, and focused tests.
- Keep Religion `status: "planned"` and add no snippets.
- Keep all Religion policy references null.
- Do not change world religion content.
- Keep `custom` and currently blocked subjects blocked.
- Do not add hotspot, trial, readiness, runtime, UI, storage, family, Prestige, Magic Study, or gameplay behavior.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.168` | Religion Knowledge Schema And Validator Vocabulary | Next |
| 2 | `0.5.169` | Religion Knowledge Domain Seed Content Plan | Recommended |
| 3 | `0.5.170` | Religion Knowledge Domain Seed | Recommended |
| 4 | `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 5 | `0.5.172` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 6 | `0.5.173` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 7 | `0.5.174` | Offspring Growth Role And Activity Build Plan | Recommended |
| 8 | `0.5.175` | Recipe Ownership And Personal Learning Plan | Recommended |
| 9 | `0.5.176` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
