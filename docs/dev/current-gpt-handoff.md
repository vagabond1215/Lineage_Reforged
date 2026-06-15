# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.162 - Ecology Knowledge Domain Plan`
Date: 2026-06-15
Branch/status assumption: clean `master` at commit `d8d0839` before edits, aligned with `origin/master`.

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

- `Version 0.5.162 - Ecology Knowledge Domain Plan`

Immediate next:

- `Version 0.5.163 - Ecology Knowledge Domain Seed Content Plan`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.162 Decision

- Start with one broad Wave 1 `knowledge_domain.ecology`.
- Defer narrower Ecology domains until authored snippets prove the split is useful.
- Target `active` only in a future seed implementation; no Ecology record is live now.
- Reuse current registry vocabulary and current `flora`, `fauna`, `mineral`, and `region` snippet subjects first.
- Treat habitat, biome, climate, ecological relationship, disease, domestication, agriculture, settlement, culture, and institution subjects as current schema or validator gaps.
- Keep all policy references null.
- Add no trial, readiness, simulation, runtime, UI, storage, persistence, event, reward, command, or gameplay behavior.

## Guardrails For 0.5.163

- Keep the run documentation-only.
- Select the exact future Ecology registry record and a small Tier 1 snippet seed.
- Verify every proposed skill and collection reference against current authorities.
- Map each snippet to current subject, category, source, and location validation.
- Do not force unsupported concepts into `custom`.
- Do not edit registry or snippet content, schemas, validators, tests, helpers, adapters, runtime, UI, storage, persistence, simulation, events, rewards, commands, or gameplay.
- Keep Ecology trial and readiness policy work deferred.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.163` | Ecology Knowledge Domain Seed Content Plan | Next |
| 2 | `0.5.164` | Religion Knowledge Domain Plan | Recommended |
| 3 | `0.5.165` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 4 | `0.5.166` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 5 | `0.5.167` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 6 | `0.5.168` | Offspring Growth Role And Activity Build Plan | Recommended |
| 7 | `0.5.169` | Recipe Ownership And Personal Learning Plan | Recommended |
| 8 | `0.5.170` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
