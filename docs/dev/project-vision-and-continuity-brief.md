# Lineage: Reforged - Strategic Continuity Brief

Updated 2026-07-13 after `Version 0.6.2.2 - Engine-Owned Quest Tracking Repair`.

## Purpose

This brief is the strategic north-star and source map for Lineage: Reforged. Keep it short. Detailed current state and implementation guidance live in the specialized repo docs.

## Source Map

- `docs/dev/current-codex-output.md` owns exact latest Codex implementation state.
- `docs/dev/current-gpt-handoff.md` owns current connector-side guardrails and immediate prompt direction.
- `docs/dev/current-codex-prompt.md` owns the active copy-paste Codex prompt body.
- `docs/dev/project-roadmap.md` owns version order, version-band maturity, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the detailed ordered Codex queue and historical sequencing record.
- `docs/design/runtime-ownership-transition-readiness-consolidation.md` selects player travel as the first engine-owned consumer and owns the base `0.6.0` boundary.
- `docs/design/player-travel-boundary-clarification.md` controls `0.6.0` collision-safe identity, shared preview/execution resolution, and full post-travel synchronization parity.
- `docs/design/ui-information-architecture-boundary.md` controls the future six-domain shell, Home/re-entry, linked-record routing, Codex/knowledge presentation, text-first combat, tactics/gambit-style UX limits, accessibility, and anti-clutter boundaries.
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

Latest completed primary:

- `Version 0.6.2 - Engine-Owned Quest Tracking Command`

Latest support/repair run:

- `Version 0.6.2.2 - Engine-Owned Quest Tracking Repair`

Next recommended support/audit version:

- `Version 0.6.2.3 - Engine-Owned Quest Tracking Post-Repair Audit`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`, with immediate execution guardrails in `docs/dev/current-gpt-handoff.md` and the active prompt in `docs/dev/current-codex-prompt.md`

Current phase:

- player travel and quest acceptance are engine-owned; audit the repaired quest-tracking event before selecting another bounded consumer

Current transition decisions:

- `docs/design/runtime-ownership-transition-readiness-consolidation.md` selects player travel/movement and fixes the base package boundary.
- `docs/design/player-travel-boundary-clarification.md` requires deterministic collision-safe command/event identity, one engine-owned resolver for preview and execution, and complete parity with the current post-travel `syncSnapshot(...)` result.

## Current Implementation Reality

- Player travel preview and execution are engine-owned through one resolver and one transient command in `packages/engines/game-engine/src/`; the active `gameplayLoop.ts` path is a notice/application bridge and `WorldPanel.tsx` commits accepted snapshots only.
- Quest acceptance is engine-owned through `player-quest-acceptance.ts`; the gameplay-loop bridge projects eligibility/notices and `QuestsPanel.tsx` applies accepted snapshots and section changes only on success.
- Accepted travel atomically mutates the cloned clock, body/resources, player location and geographic Knowledge, session activity, quest-arrival operations, notifications, and Chronicle, then applies the shared engine-owned derived snapshot synchronization path.
- Rejected or exceptional travel returns the original snapshot identity/content and emits no completion event. No travel catalog, direct travel mutation, or duplicate snapshot synchronization helper remains in the UI bridge.
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
- Runtime casting, command handling outside the selected travel slice, acquisition mutation, save/account changes, broader ownership routes, broader acquisition routes, target resolution, effect application, resource payment, catalyst behavior, Chronicle/Renown expansion, skill trial runtime behavior, magic study event runtime behavior, and knowledge snippet runtime behavior remain deferred.
- Current `PlayerSpellState[]` remains readiness context, not a complete acquisition/ownership model.
- The project is entering the first runtime-ownership transition; broad runtime expansion remains out of scope.
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
| `0.5.357` | Runtime Ownership Transition Readiness Consolidation | Landed. Selected player travel/movement as the first engine-owned consumer and fixed the base command/state/event/persistence/UI boundary. | Documentation only; no runtime behavior changed. |
| `0.5.357.1` | Player Travel Boundary Clarification | Landed. Added collision-safe identity, shared preview/execution resolver, and full post-travel synchronization parity requirements. | Support clarification only; does not consume the next primary slot. |
| `0.6.0` | Engine-Owned Player Travel Command | Landed. Moved the complete current travel transition behind one engine-owned command and shared resolver with atomic rejection safety and typed completion events. | Preserved current behavior and canon; added no travel mechanics, save fields, quest redesign, or broad UI rewrite. |
| `0.6.0.1` | Engine-Owned Player Travel Post-Transition Audit | Complete. Focused behavior passed; five dead UI synchronization helper copies failed the no-residual-authority gate. | Read-only audit; no production files changed. |
| `0.6.0.2` | Residual UI Snapshot Authority Repair | Complete. Removed only the five dead UI helper copies and newly unused imports; added a focused source guard. | Preserved live engine delegation and all current behavior; 17/17 focused tests passed. |
| `0.6.0.3` | Engine-Owned Player Travel Post-Repair Audit | Complete and accepted. | Reconfirmed repaired authority, behavior, persistence/browser, adapter, and hygiene boundaries. |
| `0.6.1` | Engine-Owned Quest Acceptance Command | Complete. Moved acceptance behind one resolver/command/event boundary with exact characterized parity. | Acceptance only; 26/26 focused tests passed. |
| `0.6.1.1` | Engine-Owned Quest Acceptance Post-Transition Audit | Complete and accepted at 26/26 focused tests. | Reconfirmed sole authority, parity, atomic rejection, event, persistence/browser, UI-adapter, and hygiene boundaries. |
| `0.6.1.2` | UI Information Architecture Research Integration | Complete. Promoted durable shell, Home, linked-record, Codex, combat, tactics, accessibility, and anti-clutter guidance and retired the temporary artifact. | Documentation only; preserved `0.6.2` and authorized no UI/runtime implementation. |
| `0.6.2` | Engine-Owned Quest Tracking Command | Complete. Moved tracking behind one resolver/command/event boundary with exact characterized parity. | Tracking toggle only; 35/35 focused tests passed. |
| `0.6.2.1` | Engine-Owned Quest Tracking Post-Transition Audit | Complete; transition not yet accepted. | All focused gates passed except the accepted event included presentation `title`; 35/35 tests still passed. |
| `0.6.2.2` | Engine-Owned Quest Tracking Repair | Complete. Removed only event `title` and added an exact payload guard. | Result/notice title facts and hashes preserved; 35/35 focused tests passed. |
| `0.6.2.3` | Engine-Owned Quest Tracking Post-Repair Audit | Next read-only run. | Reconfirm repaired contract and transition gates before selecting another consumer. |
| later `0.6.x` | Later Engine-Owned Consumers | Activity selection/advancement, rest, and turn-in remain deferred. | One coherent consumer per package; no generic command bus. |

For the detailed historical queue, use `docs/dev/codex-sequenced-implementation-plan.md`. For the exact current implementation prompt, use `docs/dev/current-codex-prompt.md`.

## Core Development Rules

- Use current branch reality only.
- Prefer the smallest coherent patch that advances the current pipeline.
- Do not weaken validation unless the validator is demonstrably stale or wrong.
- Do not add old-save or old-account compatibility unless explicitly requested.
- Keep current data direct and validated.
- Minor-band advancement reflects maturity: `v0.6.x` is now justified by the selected bounded runtime-ownership transition, not by patch-number rollover.
- For complex systems, prefer design criteria, runtime shape, pure helpers, validation, view model, read-only UI, then mutating behavior.

## New Thread Starter

```text
I am continuing development of Lineage: Reforged.

Repo: vagabond1215/Lineage_Reforged
Default branch: master
Primary repo instruction file: AGENTS.md
Latest Codex handoff: docs/dev/current-codex-output.md
Current GPT handoff: docs/dev/current-gpt-handoff.md
Current Codex prompt: docs/dev/current-codex-prompt.md
Roadmap: docs/dev/project-roadmap.md
Sequenced Codex plan: docs/dev/codex-sequenced-implementation-plan.md
Runtime ownership readiness: docs/design/runtime-ownership-transition-readiness-consolidation.md
Player travel boundary clarification: docs/design/player-travel-boundary-clarification.md
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
Read current-codex-prompt for the active implementation task.
Use the roadmap for version order and playability checkpoints.
Use the sequenced Codex plan for detailed queue history and current override context.
Use the runtime ownership readiness decision for the base travel-command boundary.
Use the player travel clarification for collision-safe identity, shared preview/execution resolution, and complete synchronization parity.
Use the magic runtime boundary plan for cast-readiness helper and later runtime guardrails.
Use the known-spell acquisition event plan for training-event acquisition helper history and later acquisition mutation constraints.
Use the magic command contract plan for active magic command/intention constraints.
Use the first narrow runtime cast resolver plan for resolver-readiness and later resolver constraints.
Use the magic resolver planned output envelope plan for inert envelope constraints.
Use the spell hook support expansion plan for hook classification, readiness, executable-owner, and sequencing constraints.
Use the design ledger for durable conceptual criteria and vocabulary.
Use the survival/builder/RPG/MMO gap audit as broad future roadmap context only, not as implementation permission.
Use the continuity brief for north-star direction and source map.
Use the backlog for deferred work and historical run notes.

When I ask "inspect the push," read docs/dev/current-codex-output.md first, then inspect changed/important files as needed.

When I ask "prompt please," use docs/dev/current-codex-prompt.md as the authoritative body and provide the platform/model recommendation separately.
```

## Maintenance Rules

- Keep this brief short.
- Move durable conceptual rules to `docs/design/future-system-design-ledger.md`.
- Move version sequencing to `docs/dev/project-roadmap.md` and `docs/dev/codex-sequenced-implementation-plan.md`.
- Move current connector findings to `docs/dev/current-gpt-handoff.md`.
- Move deferred chronological notes to `docs/future_content_backlog.md`.
