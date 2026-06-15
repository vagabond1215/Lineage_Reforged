# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.165 - Religion Knowledge Domain Plan`
Date: 2026-06-15
Branch/status assumption: clean `master` at commit `eba20d7` before edits.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/ecology-knowledge-domain-plan.md` owns the selected Ecology boundary, candidate record, vocabulary gaps, seed direction, and future sequence.
- `docs/design/ecology-knowledge-domain-seed-content-plan.md` records the exact implemented Ecology content.
- `docs/design/religion-knowledge-domain-plan.md` owns the selected Religion boundary, candidate planned registry record, vocabulary gaps, hotspot posture, and future sequence.
- Current registry and snippet schemas and validators remain unchanged authorities; the registry and snippet catalogs now contain the Ecology seed.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed:

- `Version 0.5.165 - Religion Knowledge Domain Plan`

Immediate next:

- `Version 0.5.166 - Religion Knowledge Domain Registry Seed`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Do not roll to `0.6.0`.

## Version 0.5.165 Decision

- Start with one broad `knowledge_domain.religion`.
- Seed the exact candidate record as Wave 1, `status: "planned"`, with all policy references null.
- The candidate record passes the unchanged live registry schema and semantic validator.
- Useful Religion snippets are blocked by missing religion/deity/rite/order/site/hotspot subjects and blocked settlement/culture/institution/historical-event authority.
- Do not use `custom` or invent hotspot pressure through a generic region bridge.
- Keep religious knowledge distinct from Divine/Druidic Magic, runtime faith, reputation, law, Prestige, family, and conversion systems.

## Guardrails For 0.5.166

- Add only the exact planned Religion registry record plus required coordination docs.
- Preserve `status: "planned"` and null policy references.
- Do not add Religion snippets, schema vocabulary, validators, tests, helpers, adapters, or world religion content.
- Keep Knowledge Trial readiness content and downstream implementation deferred.
- Do not add runtime, UI, storage, persistence, simulation, events, rewards, commands, ownership mutation, or gameplay.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.166` | Religion Knowledge Domain Registry Seed | Next |
| 2 | `0.5.167` | Religion Knowledge Vocabulary And Validator Plan | Recommended |
| 3 | `0.5.168` | Religion Knowledge Domain Seed Content Plan | Recommended |
| 4 | `0.5.169` | Religious Hotspot Knowledge Snippet Plan | Recommended |
| 5 | `0.5.170` | Family Visibility And Heir Slot Projection Plan | Recommended |
| 6 | `0.5.171` | Race-Specific Adult Age And Maturation Plan | Recommended |
| 7 | `0.5.172` | Offspring Growth Role And Activity Build Plan | Recommended |
| 8 | `0.5.173` | Recipe Ownership And Personal Learning Plan | Recommended |
| 9 | `0.5.174` | 0.6.0 Runtime Ownership Transition Reassessment | Recommended |
