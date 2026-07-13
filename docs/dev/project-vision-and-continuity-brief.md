# Lineage: Reforged - Strategic Continuity Brief

Updated 2026-07-12 after `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation` landed.

## Purpose

This brief is the strategic north-star and source map for Lineage: Reforged. Keep it short. Detailed current state and implementation guidance live in the specialized repo docs.

## Source Map

- `docs/dev/current-codex-output.md` owns exact latest Codex implementation state.
- `docs/dev/current-gpt-handoff.md` owns current connector-side guardrails and prompt-prep direction.
- `docs/dev/project-roadmap.md` owns version order, version-band maturity, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the ordered near-term Codex queue.
- `docs/design/magic-runtime-boundary-plan.md` owns the cast-readiness helper boundary and later runtime guardrails.
- `docs/design/known-spell-acquisition-event-plan.md` owns the training-event acquisition helper boundary and later acquisition mutation constraints.
- `docs/design/magic-command-contract-plan.md` owns the future active magic command/intention boundary.
- `docs/design/first-narrow-runtime-cast-resolver-plan.md` owns the first narrow runtime cast resolver readiness boundary.
- `docs/design/magic-resolver-planned-output-envelope-plan.md` owns the inert planned-output-envelope boundary.
- `docs/design/spell-hook-support-expansion-plan.md` owns hook taxonomy, readiness classification, executable promotion criteria, and future hook-owner sequencing.
- `docs/design/legacy-combat-spell-runtime-ownership-plan.md` owns deferred legacy spell staging, compatibility, multi-effect, and status-approximation decisions.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` owns broad survival/builder/RPG/MMO gap context for later roadmap planning; it is not runtime authority or a backlog replacement.
- `docs/design/skill-mastery-trial-framework-plan.md` owns skill trial and magic study-event planning constraints.
- `docs/design/knowledge-domain-registry-plan.md` owns knowledge-domain purpose, groups, waves, source/evidence vocabulary, and ownership boundaries.
- `docs/design/knowledge-domain-registry-schema-plan.md` owns the future broad-registry schema contract, reference authorities, validation ownership, and current-data transition.
- `packages/schemas/player/knowledge_snippet.schema.json` is planning-only schema source for snippet-based knowledge progression; it is not runtime content loading.
- `docs/future_content_backlog.md` owns chronological deferred notes and run notes.

## Current Repo Anchor

Latest exact Codex handoff:

- `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`

Next recommended version:

- `Version 0.6.0 - Engine-Owned Player Travel Command`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Current transition decision:

- `docs/design/runtime-ownership-transition-readiness-consolidation.md` selects player travel/movement as the first engine-owned consumer and fixes the `0.6.0` package boundary.

## Current Implementation Reality

- Known spell ownership planning, helpers, validation helpers, acquisition-evidence helpers, read-only projection, blocker tests, boundary planning, cast-readiness helpers, acquisition event planning, training-event acquisition helpers, command contract planning, first narrow runtime cast resolver planning, resolver-readiness helpers, planned output-envelope policy, inert resolver envelope helpers, spell-hook support expansion planning, spell-hook classification auditing, and spell-hook constants cleanup have landed.
- `buildMagicCastReadiness(...)` is pure, deterministic, read-only, and exported through the game-engine boundary.
- `validateKnownSpellTrainingEventAcquisition(...)` and `buildKnownSpellRecordFromTrainingEvent(...)` are pure, deterministic, read-only, and exported through the game-engine boundary.
- `buildMagicCastResolverReadiness(...)` is pure, deterministic, read-only, and exported through the game-engine boundary.
- `buildMagicResolverInertEnvelope(...)` is pure, deterministic, read-only, and exported through the game-engine boundary.
- `docs/design/magic-resolver-planned-output-envelope-plan.md` defines planned resolver envelopes as inert result projections, not emitted events or side-effecting command results.
- `docs/design/spell-hook-support-expansion-plan.md` defines runtime-consumed, classifier, supported, deferred, unsupported, and unknown hook classes without making any hook executable.
- `packages/shared/types/src/spell-hook-support.ts` is now the browser-safe authored authority consumed by lint, UI presentation, and focused readiness tests.
- `buildMagicHookSupportProjection(...)` now projects six-class policy provenance and blocker detail while keeping every hook explicitly non-executable.
- The temporary classification audit was consumed; unresolved legacy combat findings were promoted into `docs/design/legacy-combat-spell-runtime-ownership-plan.md`.
- Runtime casting, command handling, acquisition mutation, save/account changes, UI work, broader ownership routes, broader acquisition routes, target resolution, effect application, resource payment, catalyst behavior, Chronicle/Renown hooks, skill trial runtime behavior, magic study event runtime behavior, and knowledge snippet runtime behavior remain deferred.
- Current `PlayerSpellState[]` remains readiness context, not a complete acquisition/ownership model.
- The project remains in foundation stabilization; validation and ownership boundaries remain higher priority than broad runtime expansion.
- Religion is active with exactly two live Religion Knowledge snippets, and hotspot content remains blocked until `world.religious_hotspots` schema, validator, seed authority, and direct snippet subject support exist.
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` is durable broad gap context for later roadmap planning around inventory/storage, survival needs, builder construction, NPC population, factions, reputation/favorability, quests/contracts, travel/POIs, law/crime, and estate/succession. It must not broaden narrow implementation prompts by default.

## North Star

Lineage: Reforged is a grounded medieval-fantasy, dynasty-driven systemic RPG. Its strongest identity is persistent history: characters live, struggle, earn status, create records, found or continue families, alter local standing, and pass limited but meaningful inheritance into future play.

Every major system should answer at least one of these questions:

- What did this character do?
- Who remembers it?
- Which family owns it?
- Where is it recognized?
- What can be carried forward?
- What remains dangerous, limited, or uncertain despite inheritance?

## Active Pipeline

| Version | Name | Intent | Key Guardrail |
| --- | --- | --- | --- |
| `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Landed. Found hotspot snippets blocked by missing content authority. | Documentation only; no live hotspot snippets or behavior. |
| `0.5.172` | Religious Hotspot Content Authority Plan | Landed. Selected future `world.religious_hotspots` and deferred `world.sacred_sites`. | Documentation only; no content JSON, schema, validator, runtime, UI, or gameplay changes. |
| `0.5.173` | Documentation Authority Consolidation And Gap Audit Integration | Landed. Integrated the survival/builder/RPG/MMO gap audit as durable broad context. | Documentation only; not runtime authority and not permission to broaden narrow prompts. |
| `0.5.174` | Religious Hotspot Content Authority Schema Plan | Next. Plan exact schema and semantic-validator contract for `world.religious_hotspots`. | Planning only unless explicitly redirected; no live content, snippets, favorability/alignment, runtime, UI, or gameplay behavior. |

For the full queue, use `docs/dev/codex-sequenced-implementation-plan.md`.

## Core Development Rules

- Use current branch reality only.
- Prefer the smallest coherent patch that advances the current pipeline.
- Do not weaken validation unless the validator is demonstrably stale or wrong.
- Do not add old-save or old-account compatibility unless explicitly requested.
- Keep current data direct and validated.
- Patch numbers may exceed two digits inside the current band; do not roll from `0.5.173` to `0.6.0` unless the actual `0.6.x` milestone has been reached.
- For complex systems, prefer design criteria, runtime shape, pure helpers, validation, view model, read-only UI, then mutating behavior.

## New Thread Starter

```text
I am continuing development of Lineage: Reforged.

Repo: vagabond1215/Lineage_Reforged
Default branch: master
Primary repo instruction file: AGENTS.md
Latest Codex handoff: docs/dev/current-codex-output.md
Current GPT handoff: docs/dev/current-gpt-handoff.md
Roadmap: docs/dev/project-roadmap.md
Sequenced Codex plan: docs/dev/codex-sequenced-implementation-plan.md
Magic runtime boundary plan: docs/design/magic-runtime-boundary-plan.md
Known-spell acquisition event plan: docs/design/known-spell-acquisition-event-plan.md
Magic command contract plan: docs/design/magic-command-contract-plan.md
First narrow runtime cast resolver plan: docs/design/first-narrow-runtime-cast-resolver-plan.md
Magic resolver planned output envelope plan: docs/design/magic-resolver-planned-output-envelope-plan.md
Spell hook support expansion plan: docs/design/spell-hook-support-expansion-plan.md
Legacy combat spell runtime ownership plan: docs/design/legacy-combat-spell-runtime-ownership-plan.md
Future system design ledger: docs/design/future-system-design-ledger.md
Survival/builder/RPG/MMO gap audit: docs/design/survival-builder-rpg-mmo-content-gap-audit.md
Strategic continuity brief: docs/dev/project-vision-and-continuity-brief.md
Backlog: docs/future_content_backlog.md

Read current-codex-output first for exact implementation state.
Read current-gpt-handoff second for current connector-side guardrails.
Use the roadmap for version order and playability checkpoints.
Use the sequenced Codex plan for the current implementation queue.
Use the magic runtime boundary plan for cast-readiness helper and later runtime guardrails.
Use the known-spell acquisition event plan for training-event acquisition helper history and later acquisition mutation constraints.
Use the magic command contract plan for active magic command/intention constraints.
Use the first narrow runtime cast resolver plan for resolver-readiness and later resolver constraints.
Use the magic resolver planned output envelope plan for inert envelope constraints.
Use the spell hook support expansion plan for hook classification, readiness, executable-owner, and sequencing constraints.
Use the spell hook classification audit for constants cleanup, projection requirements, and current legacy combat findings.
Use the design ledger for durable conceptual criteria and vocabulary.
Use the survival/builder/RPG/MMO gap audit as broad future roadmap context only, not as implementation permission.
Use the continuity brief for north-star direction and source map.
Use the backlog for deferred work and historical run notes.

When I ask "inspect the push," read docs/dev/current-codex-output.md first, then inspect changed/important files as needed.

When I ask "prompt please," produce a routed, copy-paste-ready versioned prompt with platform/model recommendation, manual preflight, exact file list, allowed/forbidden changes, validation, and required handoff output.
```

## Maintenance Rules

- Keep this brief short.
- Move durable conceptual rules to `docs/design/future-system-design-ledger.md`.
- Move version sequencing to `docs/dev/project-roadmap.md` and `docs/dev/codex-sequenced-implementation-plan.md`.
- Move current connector findings to `docs/dev/current-gpt-handoff.md`.
- Move deferred chronological notes to `docs/future_content_backlog.md`.
