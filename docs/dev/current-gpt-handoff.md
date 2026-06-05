# Current GPT Handoff

Source route: Codex local implementation pass after `Version 0.5.106 - Pure Hook Support Projection Helper`
Date: 2026-06-05
Branch/status assumption: `master` at commit `0109ad7` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/spell-hook-support-expansion-plan.md` owns hook taxonomy, readiness classification, executable promotion criteria, and hook-owner sequencing.
- `packages/shared/types/src/spell-hook-support.ts` is the browser-safe authored hook-classification authority.
- `packages/engines/game-engine/src/known-spells.ts` owns readiness policy and the pure six-class projection.
- `docs/design/legacy-combat-spell-runtime-ownership-plan.md` owns deferred legacy combat staging, compatibility, multi-effect, and status-approximation decisions.
- `docs/design/skill-mastery-trial-framework-plan.md`, `packages/schemas/player/knowledge_snippet.schema.json`, and `docs/design/future-system-design-ledger.md` are the primary knowledge-registry planning sources.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.106 - Pure Hook Support Projection Helper`

Immediate next version:

- `Version 0.5.107 - Knowledge Domain Registry Plan`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.106` to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.106 Result

- Added `buildMagicHookSupportProjection(...)` as a pure deterministic engine helper.
- Inputs are explicit resolution hook ids, item-generation hook ids, and caller-supplied `MagicCastReadinessHookSupport`.
- Output records hook id, source field, six-class classification, exact policy authority, supported/blocking readiness effect, blocker reason where applicable, and `executable: false`.
- Precedence remains explicit map, runtime, classifier, supported, deferred, unsupported, unknown fallback.
- Existing readiness now uses the same provenance-aware internal classifier, preserving readiness outcomes.
- Authored support remains four-class authority; `supported` and `unsupported` remain caller policy only.
- Focused tests cover the 57-id authored inventory, all six classes, every precedence tier, both source fields, determinism, no mutation, duplicates, invalid-value omission, and no namespace inference.
- No hook ids, authored classifications, compatibility statuses, content, schemas, UI, combat behavior, item-generation policy, events, mutation, casting, or target behavior changed.

## Cleanup Decision

- `docs/design/spell-hook-classification-audit.md` was consumed and removed.
- Its unresolved legacy combat findings were promoted into `docs/design/legacy-combat-spell-runtime-ownership-plan.md`.
- Do not restore the audit as a second backlog.

## Active Guardrails For 0.5.107

Knowledge Domain Registry Plan:

- Planning-only pass.
- Define stable knowledge-domain ids, ownership, snippet relationships, source/evidence vocabulary, and validation boundaries.
- Use the current planning schema and existing domain backlog; do not wire runtime loading.
- Keep knowledge distinct from skills, magic study, known-spell ownership, and generic item possession.
- Access to a book, teacher, institution, scroll, tome, document, region, or travel observation must not automatically complete knowledge.
- Do not add snippet content, completion math, trials, UI, Chronicle/Renown events, save/account schema changes, generated output, or runtime behavior.

Magic/runtime guardrails:

- Effectful casting, command handlers, UI dispatch, target resolution, resource payment, catalyst behavior, inventory mutation, runtime event creation, save/account/session mutation, broader acquisition routes, and broader owner scopes remain deferred.
- Do not treat `runtime`, `classifier`, or `supported` projection classes as executable.
- Do not combine knowledge planning with legacy combat spell staging or first executable-hook owner work.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.104` | Spell Hook Classification Audit | `docs/design/spell-hook-support-expansion-plan.md` | Landed; temporary audit consumed |
| 2 | `0.5.105` | Spell Hook Support Constants Cleanup | `packages/shared/types/src/spell-hook-support.ts` | Landed |
| 3 | `0.5.106` | Pure Hook Support Projection Helper | `packages/engines/game-engine/src/known-spells.ts` | Landed |
| 4 | `0.5.107` | Knowledge Domain Registry Plan | `packages/schemas/player/knowledge_snippet.schema.json` | Next |

## Next Prompt Source Stack

For `Version 0.5.107 - Knowledge Domain Registry Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- `docs/design/spell-hook-support-expansion-plan.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `docs/future_content_backlog.md`
