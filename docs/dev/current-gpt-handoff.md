# Current GPT Handoff

Source route: ChatGPT via GitHub Connector cleanup after `Version 0.5.86 - Combat Equipment Mapping Audit`
Date: 2026-05-27
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

- `Version 0.5.86 - Combat Equipment Mapping Audit`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.87 - Combat Equipment Mapping Follow-Up`

## Recent Results

Combat / equipment:

- `0.5.86` completed the audit-first combat/equipment mapping pass.
- The audit updated `docs/design/combat-equipment-mapping-audit-plan.md`, `tests/unit/combat-equipment-mapping.test.mjs`, `docs/future_content_backlog.md`, and `docs/dev/current-codex-output.md`.
- It did not change item content, combat runtime/source, formulas, equipment behavior, durability, item instances, loot, crafting, economy, UI, save schema, generated output, or active magic behavior.
- Current source ownership is now documented for equipment slots, item use profiles, starter bundles, starter equipment heuristic mapping, combat actions, damage-family inference, defensive mitigation, skill/stat mapping, and skill-gain candidates.
- The smallest high-value next fix is `item.short_bow`: it is equipped by Hunter starts into `slot.weapon.right` but has no combat use profile, so it does not grant expected ranged action / archery mapping.
- The safe follow-up is to add a current-content `item.short_bow` combat use profile following the existing `item.composite_bow` profile shape, then remove `item.short_bow` from known starter profile gaps in `tests/unit/combat-equipment-mapping.test.mjs`.

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

## Active Guardrails For 0.5.87

Combat Equipment Mapping Follow-Up:

- Use `docs/design/combat-equipment-mapping-audit-plan.md` as the primary source.
- This should be a narrow current-content mapping fix for `item.short_bow` only.
- Add a combat use profile for `item.short_bow` following the current `item.composite_bow` ranged profile shape.
- The profile should map to `combat.ranged.primary`, `skill.combat.weapon.archery`, `handlingType: "weapon"`, and `damage.ranged`.
- Update `tests/unit/combat-equipment-mapping.test.mjs` so `item.short_bow` is no longer listed as a known starter weapon-profile gap.
- Keep the test asserting Hunter starter bow profile coverage.
- Do not alter damage formulas, ranged balance, ammo behavior, loot, item instances, equipment behavior, UI, save schema, generated output, or active magic behavior.
- Do not broaden into `item.butcher_knife`, `item.battle_staff`, `item.pickaxe`, shield skill gain, armor skill gain, damage type schema, handedness, offhand, two-handed, or item-owned equipment slot metadata.
- Do not continue creator/sidebar polishing unless a blocking regression prevents validation.

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
| 1 | `0.5.86` | Combat Equipment Mapping Audit | `docs/design/combat-equipment-mapping-audit-plan.md` | Landed |
| 2 | `0.5.87` | Combat Equipment Mapping Follow-Up | `docs/design/combat-equipment-mapping-audit-plan.md` | Next |
| 3 | `0.5.88` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` | Planned |

## Next Prompt Source Stack

For `Version 0.5.87 - Combat Equipment Mapping Follow-Up`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/combat-equipment-mapping-audit-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/content/base/items/items.json`
- `packages/schemas/items/item.schema.json`
- `tests/unit/combat-equipment-mapping.test.mjs`
- focused combat tests relevant to ranged item profiles and skill gain

## After 0.5.87

If the short-bow mapping follow-up lands cleanly, return to the sequence file. The next run should be:

- `Version 0.5.88 - Known Spell Ownership Plan`

Keep it planning-only unless explicitly re-scoped.