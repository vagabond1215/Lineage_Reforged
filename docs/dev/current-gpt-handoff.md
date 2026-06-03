# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.95 - Magic Cast Readiness Helper`
Date: 2026-06-03
Branch/status assumption: `master`; use `docs/dev/current-codex-output.md` for the exact latest Codex run state.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records only current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` is the immediate prompt-prep handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the current sequenced Codex queue.
- `docs/design/magic-runtime-boundary-plan.md` owns the `0.5.95` cast-readiness helper boundary.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.95 - Magic Cast Readiness Helper`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.96 - Known Spell Acquisition Event Planning`

## Recent Results

Magic / known spells:

- `0.5.88` updated `docs/design/known-spell-ownership-plan.md` as the current planning source for known-spell ownership and acquisition before active magic expansion.
- `0.5.89` added the first pure known-spell ownership helper boundary in `packages/engines/game-engine/src/known-spells.ts`, with a `.js` bridge and game-engine index exports.
- `0.5.90` added pure collection-level known-spell validation helpers on top of the character-scoped helper boundary.
- `0.5.91` added pure acquisition-evidence helper boundaries for the currently supported `training_event` route only.
- `0.5.92` added a pure read-only known-spell projection helper.
- `buildKnownSpellReadOnlyProjection(...)` consumes explicit known-spell records plus caller-supplied spell catalog records, reuses collection validation and training-event evidence validation, and returns deterministic available, blocked, and invalid-record summaries.
- The projection distinguishes valid available records, valid blocked records, invalid records, duplicate records, missing evidence, unknown spells, unsupported owner scopes, and unsupported acquisition routes through existing validation pathways.
- `0.5.93` added focused test-only blocker coverage proving current read-only spell surfaces and metadata helpers do not imply cast readiness.
- The blocker tests keep runtime magic blocked without explicit known-spell ownership, valid training-event evidence, availability, conduit policy, catalyst policy, control/failure policy, supported hooks, and an actual runtime casting implementation.
- `0.5.94` added `docs/design/magic-runtime-boundary-plan.md` as the planning-only boundary between known-spell projection and a future pure cast-readiness helper.
- The boundary plan defines allowed conduit metadata comparison, catalyst metadata comparison, pure control threshold checks, unsupported/deferred/unknown hook blocking, blocker vocabulary, and exact allowed/forbidden scope for the cast-readiness helper.
- `0.5.95` added `buildMagicCastReadiness(...)` as a pure deterministic read-only helper exported through the game-engine barrel.
- The cast-readiness helper reuses known-spell projection and can return ordered blockers for missing/blocked/invalid known-spell records, missing training-event evidence, missing/invalid conduit, missing/invalid catalyst, insufficient control, unsupported hooks, non-ready spell runtime status, and absent effectful runtime casting.
- `runtime_casting_not_implemented` remains present by default unless the caller explicitly supplies runtime support.
- Catalog presence, Arcane Compendium entries, `PlayerSpellState[]`, account/family/institution/document/item/source-run/heir/Legacy data, lineage, backstory, selected character UI state, and UI state do not imply known spell ownership.
- `characterKnowsSpell(...)` remains a pure read-only query helper and still counts only valid, available, character-owned records under existing query semantics.
- Arcane Compendium remains read-only and independent from known-spell ownership/acquisition evidence/projection.
- Current `PlayerSpellState[]` remains readiness/legacy context and is not a complete acquisition/ownership model.
- `0.5.95` changed pure helper code, exports, focused tests, `docs/dev/current-codex-output.md`, and the backlog note only: no spells, spell metadata, active spell casting, known-spell runtime wiring, acquisition event creation, cast commands, catalyst behavior, scroll/tome behavior, magic skill gain, Magic Legacy power, combat magic runtime, generated output, React UI, save schema, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior changed.
- Remaining known-spell follow-up: acquisition event planning, active casting, conduit/catalyst/control implementation, scroll/tome/document teaching, Magic Legacy access lanes, broader ownership scopes/routes, and `PlayerSpellState[]` replacement remain deferred.

Combat / equipment:

- `0.5.86` completed the audit-first combat/equipment mapping pass.
- `0.5.87` added the narrow current-content combat use profile for `item.short_bow`.
- Hunter starts still equip `item.short_bow` into `slot.weapon.right`, and the short bow now maps to the current ranged archery weapon profile shape.
- The remaining known starter weapon-profile gap is `item.butcher_knife`.
- Deferred combat/equipment gaps remain: `item.butcher_knife` equip/profile policy, hybrid staff skill-gain policy, improvised pickaxe skill-gain policy, shield/armor defensive skill-gain policy, content-owned equipment slot/handedness/offhand/two-handed metadata, explicit damage-type table, and broad weapon/armor/clothing profile coverage.

Unified shell / creator:

- `0.5.84` added `docs/design/unified-shell-and-creator-refinement-plan.md`.
- `0.5.85` implemented the character-creation sidebar/layout refinement.
- Character creation now uses the launcher `AppShell` with `ShellBrandLogo`, a left sidebar summary, fixed-width step navigation, full-character randomization, and a total attribute matrix with contribution tooltips.
- Backstory is locked/skipped only when no selectable backstories exist and remains required once at least one selectable backstory exists.
- No-selectable-backstory starts create no backstory package.
- Touch long-press tooltip behavior for the attribute breakdown remains deferred.
- Gameplay shell unification remains deferred.

Calendar / climate:

- `0.5.81` finalized the planning-only Calendar/Climate popup view-model plan.
- `0.5.82` implemented `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` and `tests/unit/calendar-climate-presentation.test.mjs`.
- `0.5.83` rendered the existing Calendar/Climate projection in a compact read-only top-status popup.
- No actions, command ids, content loading, generated output, climate profile resolver, weather simulation, or active climate/weather/travel/crop/body-state effects were added.

Economy and Chronicle:

- `0.5.79` implemented the pure economy clarity projection and focused tests.
- `0.5.80` fixed the focused economy runtime/trade validation failures that appeared after `0.5.79`.
- `0.5.77` rendered Chronicle run-end projection read-only inside Account Meta / Chronicles.
- Future economy and Chronicle UI work must stay read-only unless explicitly re-scoped.

Typecheck tooling:

- `0.5.74` made typecheck commands honest and repeatable.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers.
- Do not require broad typecheck unless a prompt specifically fixes those blockers.

## Active Guardrails For 0.5.96

Known Spell Acquisition Event Planning:

- Use `docs/dev/current-codex-output.md`, `docs/design/known-spell-ownership-plan.md`, `docs/design/magic-runtime-boundary-plan.md`, `packages/engines/game-engine/src/known-spells.ts`, and the current focused known-spell/magic tests as the primary sources.
- Keep the pass planning-focused unless the next prompt explicitly scopes a pure helper.
- Define acquisition event ownership and evidence boundaries before adding any acquisition mutation.
- Preserve the current supported known-spell route as `training_event` only until a dedicated helper run expands it.
- Do not implement runtime spell casting.
- Do not add cast commands, active magic behavior, acquisition event creation, React UI, generated output, spell execution commands, combat actions, save schema changes, catalyst consumption, magic skill gain, Magic Legacy power, scroll/tome/document teaching, or broader ownership/acquisition routes.
- Preserve character-scoped known-spell ownership only.
- Do not infer spell ownership from `PlayerSpellState[]`, Arcane Compendium entries, catalog presence, lineage, backstory, account id, family id, source run id, selected character UI state, or Legacy data.

Browser-safety guardrail:

- Avoid browser-facing UI changes.
- If any browser-facing app files are touched, keep app-side scans clean for `node:fs`, `readFileSync`, `load.*Content`, `civilization-engine/src/content`, `civilization-engine/src/index`, and unsafe `game-engine/src/index` imports.

Cross-system guardrails:

- Do not infer `familyId` from `lineageId`, `sourceRunId`, account id, selected character, selected backstory, or UI state.
- Do not let Bloodlines, bequests, heirlooms, estates, or UI state directly grant backstory identity.

## Sequenced Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` for the full queue. Current near-term sequence:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.92` | Known Spell Read-Only Projection | `docs/dev/current-codex-output.md` | Landed |
| 2 | `0.5.93` | Magic Runtime Readiness Blocker Tests | `docs/dev/current-codex-output.md` | Landed |
| 3 | `0.5.94` | Magic Runtime Boundary Plan | `docs/design/magic-runtime-boundary-plan.md` | Landed |
| 4 | `0.5.95` | Magic Cast Readiness Helper | `docs/design/magic-runtime-boundary-plan.md` | Landed |
| 5 | `0.5.96` | Known Spell Acquisition Event Planning | `docs/dev/current-codex-output.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.96 - Known Spell Acquisition Event Planning`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/magic-runtime-boundary-plan.md`
- `docs/design/known-spell-ownership-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/magic-cast-readiness.test.mjs`
- `tests/unit/magic-runtime-readiness-blockers.test.mjs`
- `packages/content/base/player/spells.json`
- `packages/content/base/items/items.json`
- `tools/content-lint/spell-hook-support.mjs`
- `tools/content-lint/magic-metadata-support.mjs`

## After 0.5.96

Use the acquisition event planning result in `docs/dev/current-codex-output.md` to decide whether the next safe run is a pure training-event acquisition helper, a command-contract plan, or another narrow magic ownership guardrail.
