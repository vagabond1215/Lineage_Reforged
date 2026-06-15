# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.163 - Ecology Knowledge Domain Seed Content Plan`
Date: 2026-06-15
Branch/status assumption: clean `master` at commit `bc16865` before edits, aligned with `origin/master`.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/ecology-knowledge-domain-plan.md` owns the selected Ecology boundary, candidate record, vocabulary gaps, seed direction, and future sequence.
- Current registry and snippet schemas, content, and validators remain unchanged authorities.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.163 - Ecology Knowledge Domain Seed Content Plan`

Immediate next:

- `Version 0.5.164 - Ecology Knowledge Domain Registry And Snippet Seed`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.163 Decision

- Implement one active Wave 1 `knowledge_domain.ecology` record and three Tier 1 snippets together.
- Use exact Kaelvar regional-variation, sheep seasonality, and grape-vine habitat records from `docs/design/ecology-knowledge-domain-seed-content-plan.md`.
- The exact proposed registry and snippets pass the unchanged live schemas and semantic validators in memory.
- No schema, validator, vocabulary, or test change is required.
- Keep all policy references null.
- Add no trial, readiness, simulation, runtime, UI, storage, persistence, event, reward, command, or gameplay behavior.

## Guardrails For 0.5.164

- Add only the exact approved registry record and three snippets plus required coordination docs.
- Preserve current schemas, validators, tests, helpers, adapters, and index wiring.
- Run normal content lint; both edited content files are already counted, so success should remain 56 checked files.
- Do not broaden into unsupported subject/category vocabulary.
- Do not add runtime, UI, storage, persistence, simulation, events, rewards, commands, ownership mutation, or gameplay.
- Keep Ecology trial and readiness policy work deferred.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.164` | Ecology Knowledge Domain Registry And Snippet Seed | Next |
| 2 | `0.5.165` | Religion Knowledge Domain Plan | Recommended |
| 3 | `0.5.166` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 4 | `0.5.167` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 5 | `0.5.168` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 6 | `0.5.169` | Offspring Growth Role And Activity Build Plan | Recommended |
| 7 | `0.5.170` | Recipe Ownership And Personal Learning Plan | Recommended |
| 8 | `0.5.171` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
