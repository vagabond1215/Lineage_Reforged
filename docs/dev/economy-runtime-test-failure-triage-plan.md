# Economy Runtime Test Failure Triage Plan

Date: 2026-05-24
Route: ChatGPT via GitHub Connector
Status: consumed historical triage plan; no longer active prompt authority

## Consumed Sequencing Note

This connector-side triage plan was created after `Version 0.5.79 - Economy Price Clarity Pure Projection` because two existing civilization validation suites failed outside the new projection surface.

It served as the active source for `Version 0.5.80 - Economy Runtime Test Failure Triage`.

`0.5.80` has now landed and restored the focused economy runtime/trade validation path. Use this file only as historical context. Do not treat it as the current next prompt target.

Current prompt authority now lives in:

- `docs/dev/current-codex-output.md` for exact latest Codex state
- `docs/dev/current-gpt-handoff.md` for immediate guardrails
- `docs/dev/codex-sequenced-implementation-plan.md` for queue order
- `docs/design/calendar-climate-popup-view-model-plan.md` for the current `0.5.81` planning source

## Original Failure Evidence

From `docs/dev/current-codex-output.md` after `0.5.79`:

- `node --test tests/unit/economy-clarity-presentation.test.mjs` passed with 19 tests.
- `npm.cmd run tool:content-lint` passed.
- `node --test tests/unit/civilization-runtime-economy.test.mjs` failed in existing runtime assertions:
  - `craft resolution uses worker skill to reduce time and cost`: higher skill did not reduce processing time.
  - `recipe dimensions only affect quantity when the recipe allows it`: cheese high-skill quantity did not exceed low-skill quantity.
- `node --test tests/unit/civilization-trade-runtime.test.mjs` failed in existing trade runtime assertions:
  - `autonomous trade evaluation produces viable, explained opportunities`: no evaluated opportunities were produced.
  - `autonomous trade dispatch creates caravans, reservations, and origin stock changes`: no convoy was launched.

The failing suites did not import `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts`. This was treated as an economy runtime/content/test expectation triage, not as a rollback of the 0.5.79 projection.

## Resolution Summary From 0.5.80

Craft validation:

- Current production-chain and skill content use `skill.crafting.cooking`.
- The failing test fixtures used stale `skill.craft.cooking`, so explicit low/high worker ranks were ignored.
- Tests were re-scoped to the canonical cooking skill id while preserving coverage for skill-gated craft time, cost, and quantity dimensions.

Autonomous trade validation:

- Protected reserve math had multiplied one-tick stock snapshot reserve values into multi-tick buffers, making every current-content exportable surplus zero.
- Runtime reserve math was scaled back to current market stock snapshot units.
- Destination need, absorption, and strategic necessity now use the same family-aware demand reference.
- The stale exact `grain` export invariant was re-scoped to a grain-family export from Vinecross because current authored content uses family-compatible staples such as barley.

## Historical Guardrails Preserved

The 0.5.80 pass was expected to and did preserve these boundaries:

- no React UI
- no economy clarity UI
- no generated output
- no player-facing shop, trade, craft, caravan, buy/sell, or dispatch commands
- no broad economy expansion
- no Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, or bequest behavior changes

## Historical Validation Target

The consumed validation target was:

- `node --test tests/unit/economy-clarity-presentation.test.mjs`
- `node --test tests/unit/civilization-runtime-economy.test.mjs`
- `node --test tests/unit/civilization-trade-runtime.test.mjs`
- `node --test tests/unit/civilization-system-consistency.test.mjs` if touched or relevant
- `npm.cmd run tool:content-lint`
- `git diff --check`

## Current Next Step

After this consumed triage, the sequence resumes with:

- `Version 0.5.81 - Calendar Climate Popup View Model Plan`

Use `docs/design/calendar-climate-popup-view-model-plan.md` and `docs/design/calendar-climate-popup-ia-audit.md`. Keep the pass planning-only unless explicitly re-scoped.