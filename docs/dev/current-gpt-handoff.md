# Current GPT Handoff

Source route: ChatGPT via GitHub Connector cleanup after `Version 0.5.92 - Known Spell Read-Only Projection`
Date: 2026-06-01
Branch/status assumption: `master`; use `docs/dev/current-codex-output.md` for the exact latest Codex run state.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records only current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` is the immediate prompt-prep handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the current sequenced Codex queue.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.92 - Known Spell Read-Only Projection`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.93 - Magic Runtime Readiness Blocker Tests`

## Recent Results

Magic / known spells:

- `0.5.88` updated `docs/design/known-spell-ownership-plan.md` as the current planning source for known-spell ownership and acquisition before active magic expansion.
- `0.5.89` added the first pure known-spell ownership helper boundary in `packages/engines/game-engine/src/known-spells.ts`, with a `.js` bridge and game-engine index exports.
- `0.5.90` added pure collection-level known-spell validation helpers on top of the character-scoped helper boundary.
- `0.5.91` added pure acquisition-evidence helper boundaries for the currently supported `training_event` route only.
- `0.5.92` added a pure read-only known-spell projection helper.
- `buildKnownSpellReadOnlyProjection(...)` consumes explicit known-spell records plus caller-supplied spell catalog records, reuses collection validation and training-event evidence validation, and returns deterministic available, blocked, and invalid-record summaries.
- The projection distinguishes valid available records, valid blocked records, invalid records, duplicate records, missing evidence, unknown spells, unsupported owner scopes, and unsupported acquisition routes through existing validation pathways.
- Catalog presence, Arcane Compendium entries, `PlayerSpellState[]`, account/family/institution/document/item/source-run/heir/Legacy data, lineage, backstory, selected character UI state, and UI state do not imply known spell ownership.
- `characterKnowsSpell(...)` remains a pure read-only query helper and still counts only valid, available, character-owned records under existing query semantics.
- Arcane Compendium remains read-only and independent from known-spell ownership/acquisition evidence/projection.
- Current `PlayerSpellState[]` remains readiness/legacy context and is not a complete acquisition/ownership model.
- `0.5.92` changed pure helper code, exports, focused tests, `docs/dev/current-codex-output.md`, and the backlog note only: no spells, spell metadata, active spell casting, known-spell runtime wiring, acquisition event creation, cast commands, catalyst behavior, scroll/tome behavior, magic skill gain, Magic Legacy power, combat magic runtime, generated output, React UI, save schema, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior changed.
- Remaining known-spell follow-up: runtime readiness blocker tests, acquisition event creation, active casting, conduit/catalyst/control policy, scroll/tome/document teaching, Magic Legacy access lanes, broader ownership scopes/routes, and `PlayerSpellState[]` replacement remain deferred.

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

## Active Guardrails For 0.5.93

Magic Runtime Readiness Blocker Tests:

- Use `docs/dev/current-codex-output.md` and `docs/design/known-spell-ownership-plan.md` as the primary sources.
- Build on the `packages/engines/game-engine/src/known-spells.ts` helper boundary added in `0.5.89` through `0.5.92`.
- Keep the pass test-focused and non-runtime-mutating.
- Add focused blocker tests or test scaffolds that prove runtime magic must not proceed without explicit known-spell, conduit, catalyst, control, and blocked-hook policy gates.
- Prefer tests around current helper boundaries and current spell/magic support utilities over new runtime behavior.
- Do not implement runtime spell casting.
- Do not add active magic behavior.
- Do not create acquisition events.
- Do not wire combat casting, UI commands, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, family inheritance, institution licensing, document teaching, or active spell acquisition.
- Do not add React UI, generated output, spell execution commands, combat actions, save schema changes, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior.
- Preserve character-scoped known-spell ownership only.
- Do not add account, family, institution, document, item-instance, source-run, heir, Legacy, scroll, tome, teacher, quest/event, discovered-record, or family-tradition live behavior.
- Do not infer spell ownership from lineage, backstory, UI state, selected character state without an explicit known-spell record, source run, account id, or family id alone.

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
| 2 | `0.5.93` | Magic Runtime Readiness Blocker Tests | `docs/dev/current-codex-output.md` | Next |
| 3 | `0.5.94` | Post-blocker-test implementation TBD | `docs/dev/current-codex-output.md` | Planned after 0.5.93 |

## Next Prompt Source Stack

For `Version 0.5.93 - Magic Runtime Readiness Blocker Tests`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/known-spell-ownership-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/known-spells.js`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/known-spell-ownership.test.mjs`
- `packages/content/base/player/spells.json`
- `packages/schemas/player/spell.schema.json`
- `tools/content-lint/spell-hook-support.mjs`
- `tools/content-lint/magic-metadata-support.mjs`
- current focused spell/magic/Arcane Compendium tests

## After 0.5.93

Use the blocker-test result in `docs/dev/current-codex-output.md` to decide whether the next run should add acquisition event planning, a conduit/catalyst/control policy plan, known-spell projection UI planning, or return to another queued stabilization item.