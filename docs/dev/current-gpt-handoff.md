# Current GPT Handoff

Source route: ChatGPT via GitHub Connector cleanup after `Version 0.5.89 - Known Spell Ownership Helpers`
Date: 2026-05-29
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

- `Version 0.5.89 - Known Spell Ownership Helpers`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.90 - Known Spell Validation Helpers`

## Recent Results

Magic / known spells:

- `0.5.88` updated `docs/design/known-spell-ownership-plan.md` as the current planning source for known-spell ownership and acquisition before active magic expansion.
- `0.5.89` added the first pure known-spell ownership helper boundary in `packages/engines/game-engine/src/known-spells.ts`, with a `.js` bridge and game-engine index exports.
- The helper supports current-data character-scoped known-spell records only.
- Supported helper vocabulary is intentionally minimal: owner scope `"character"`, acquisition route `"training_event"`, and availability states `"available"` and `"blocked"`.
- `validateKnownSpellRecord(...)` validates required fields, spell ids against a supplied catalog, supported owner scope, supported acquisition route, supported availability, and owner/character consistency.
- `characterKnowsSpell(...)` is a read-only pure query helper. It returns true only for a valid, available, character-owned record matching the requested character id and spell id.
- `createKnownSpellRecord(...)` is pure and creates only the supported character/training-event shape before validating it.
- Current `PlayerSpellState[]` remains readiness/legacy context and is not a complete acquisition/ownership model.
- `0.5.89` changed pure helper code and focused tests only: no spells, spell metadata, active spell casting, known-spell runtime wiring, cast commands, catalyst behavior, scroll/tome behavior, magic skill gain, Magic Legacy power, combat magic runtime, generated output, UI, save schema, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior changed.
- Remaining known-spell follow-up: collection-level validation, duplicate `knownSpellId` detection, and route-evidence validation beyond the minimal `training_event` route.

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

## Active Guardrails For 0.5.90

Known Spell Validation Helpers:

- Use `docs/dev/current-codex-output.md` and `docs/design/known-spell-ownership-plan.md` as the primary sources.
- Build on the `packages/engines/game-engine/src/known-spells.ts` helper boundary added in `0.5.89`.
- Keep the pass pure helper/test work only.
- Add collection-level validation for known-spell record arrays or collections.
- Add duplicate `knownSpellId` detection.
- Add deterministic validation issue codes for collection-level failures.
- Add route-evidence validation for the currently supported `training_event` route only.
- Preserve current-data character-scoped known-spell records only.
- Preserve `characterKnowsSpell(...)` as a pure read-only query helper.
- Do not add account, family, institution, document, item-instance, source-run, heir, Legacy, scroll, tome, teacher, quest/event, or discovered-record live behavior.
- Do not implement runtime spell casting.
- Do not add active magic behavior.
- Do not wire combat casting, UI commands, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, family inheritance, institution licensing, document teaching, or active spell acquisition.
- Do not add spell execution commands, combat actions, generated output, save schema changes, UI, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior.
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
| 1 | `0.5.89` | Known Spell Ownership Helpers | `docs/design/known-spell-ownership-plan.md` | Landed |
| 2 | `0.5.90` | Known Spell Validation Helpers | `docs/dev/current-codex-output.md` | Next |
| 3 | `0.5.91` | Post-validation implementation TBD | `docs/dev/current-codex-output.md` | Planned after 0.5.90 |

## Next Prompt Source Stack

For `Version 0.5.90 - Known Spell Validation Helpers`, inspect:

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
- current focused spell/magic/ability tests

## After 0.5.90

Use the validation result in `docs/dev/current-codex-output.md` to decide whether the next run should add acquisition evidence helpers, a read-only known-spell projection, or return to another queued stabilization item.