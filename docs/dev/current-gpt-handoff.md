# Current GPT Handoff

Source route: ChatGPT via GitHub Connector cleanup after `Version 0.5.88 - Known Spell Ownership Plan`
Date: 2026-05-28
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

- `Version 0.5.88 - Known Spell Ownership Plan`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.89 - Known Spell Ownership Helpers`

## Recent Results

Magic / known spells:

- `0.5.88` updated `docs/design/known-spell-ownership-plan.md` as the current planning source for known-spell ownership and acquisition before active magic expansion.
- The plan chooses character-known spells first: early known spells live on the current character/run as explicit character-scoped spell knowledge.
- Early spell knowledge does not persist after death or retirement unless a future inheritance/tradition evidence model is designed.
- Account, family, institution, item, document, source-run, and heir-scoped spell ownership remain deferred.
- Account/family/institution/document/Legacy access may later unlock routes or study evidence, but must not automatically create character-known spells.
- Safe early acquisition favors explicit character-scoped `training_event` records; teacher and quest/event reward routes require stable source ids before use.
- Scroll/tome/document teaching, temporary grants, discovered records, institution licensing, family tradition inheritance, Legacy-granted spell knowledge, and backstory/lineage starter spell bundles remain deferred.
- Current `PlayerSpellState[]` can still feed combat spell grants, but it is not a complete acquisition/ownership model and should be treated as readiness context until helper boundaries are defined and tested.
- `0.5.88` changed planning docs only: no spells, spell metadata, known-spell runtime state, cast commands, catalyst behavior, scroll/tome behavior, magic skill gain, Magic Legacy power, combat magic runtime, active magic behavior, generated output, UI, save schema, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior changed.

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

## Active Guardrails For 0.5.89

Known Spell Ownership Helpers:

- Use `docs/design/known-spell-ownership-plan.md` as the primary source.
- Implement pure helper types/functions and focused tests only.
- Support current-data character-scoped known-spell records only.
- Validate spell ids against the current spell catalog.
- Validate supported owner scope and acquisition route.
- Add a read-only `characterKnowsSpell(...)`-style helper or equivalent pure query helper that does not mutate state.
- Keep Arcane Compendium read-only and independent from known-spell state.
- Do not wire combat casting, UI commands, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, family inheritance, institution licensing, document teaching, or active spell acquisition.
- Do not add account, family, institution, document, item-instance, source-run, or heir scopes to live helper behavior.
- Do not treat current `PlayerSpellState[]` as a complete acquisition model unless the helper boundary explicitly treats it as legacy/readiness context only.
- Do not implement runtime spell casting.
- Do not add active magic behavior.
- Do not add spell execution commands, combat actions, generated output, save schema changes, UI, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior.
- Do not infer family ownership or spell ownership from lineage, backstory, UI state, selected character, source run, account id, or family id alone.

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
| 1 | `0.5.88` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` | Landed |
| 2 | `0.5.89` | Known Spell Ownership Helpers | `docs/design/known-spell-ownership-plan.md` | Next |
| 3 | `0.5.90` | Post-helper implementation TBD | `docs/dev/current-codex-output.md` | Planned after 0.5.89 |

## Next Prompt Source Stack

For `Version 0.5.89 - Known Spell Ownership Helpers`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/known-spell-ownership-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/content/base/player/spells.json`
- `packages/schemas/player/spell.schema.json`
- `packages/shared/types/src/contracts.ts`
- current spell/magic helper owners, if any
- current focused spell/magic/ability tests

## After 0.5.89

Use the helper result in `docs/dev/current-codex-output.md` to decide whether the next run should add validation helpers, a read-only known-spell projection, or return to another queued stabilization item.