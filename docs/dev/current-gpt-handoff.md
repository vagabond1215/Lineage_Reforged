# Current GPT Handoff

Source route: ChatGPT via GitHub Connector triage after `Version 0.5.79 - Economy Price Clarity Pure Projection`
Date: 2026-05-24
Branch/status assumption: `master`; use `docs/dev/current-codex-output.md` for the exact latest Codex run state.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records only current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` is the immediate prompt-prep handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the current sequenced Codex queue.
- `docs/dev/economy-runtime-test-failure-triage-plan.md` owns the immediate 0.5.80 economy runtime validation triage.
- `docs/design/future-system-design-ledger.md` owns durable system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.79 - Economy Price Clarity Pure Projection`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.80 - Economy Runtime Test Failure Triage`

## Current Reason For Reordering

`0.5.79` successfully added the pure economy clarity projection and its focused tests, but two required existing validation suites failed outside the new projection surface:

- `tests/unit/civilization-runtime-economy.test.mjs`
- `tests/unit/civilization-trade-runtime.test.mjs`

Do not proceed to Calendar/Climate planning until the economy runtime/trade failures are fixed or correctly re-scoped.

## Immediate Source Stack

For `Version 0.5.80 - Economy Runtime Test Failure Triage`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/economy-runtime-test-failure-triage-plan.md`
- `tests/unit/civilization-runtime-economy.test.mjs`
- `tests/unit/civilization-trade-runtime.test.mjs`
- `tests/unit/economy-clarity-presentation.test.mjs`
- `packages/engines/civilization-engine/src/runtime-economy.ts`
- `packages/engines/civilization-engine/src/trade-runtime.ts`
- `packages/engines/civilization-engine/src/settlement-simulation.ts`
- `packages/engines/civilization-engine/src/economy.ts`
- `packages/engines/civilization-engine/src/index.ts`
- relevant economy, settlement, workplace, production-chain, item, transport, and route content only if a failing runtime assertion depends on current content reality

## Active Guardrails For 0.5.80

Allowed:

- Fix `runtime-economy.ts` if skill effects, craft output quantity, or cost/time propagation are wrong.
- Fix `trade-runtime.ts` if autonomous trade evaluation/dispatch is over-filtering or failing to preserve expected viable opportunities.
- Fix current economy/settlement/transport/content only if content is internally inconsistent and content lint remains green.
- Re-scope stale test assertions only if source inspection proves the old expectation no longer matches current design/content reality.
- Add narrow tests proving the corrected behavior.

Forbidden:

- Do not weaken tests by deleting failing assertions without replacement coverage.
- Do not hard-code `vinecross`, `grain`, or a specific fixture into runtime logic.
- Do not make all crafts globally scale quantity with skill.
- Do not make every trade opportunity viable.
- Do not bypass reserve, route, vehicle, throughput, stock, or dispatch constraints broadly.
- Do not add React UI.
- Do not add economy clarity UI.
- Do not add shop, trade, craft, caravan, buy/sell, dispatch, or player command ids.
- Do not update generated output.
- Do not touch Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, or bequest behavior.

## Expected Validation For 0.5.80

Required:

- `node --test tests/unit/economy-clarity-presentation.test.mjs`
- `node --test tests/unit/civilization-runtime-economy.test.mjs`
- `node --test tests/unit/civilization-trade-runtime.test.mjs`
- `npm.cmd run tool:content-lint`
- `git diff --check`

Optional if touched or relevant:

- `node --test tests/unit/civilization-system-consistency.test.mjs`

Do not require broad typecheck unless a narrow source change makes it useful; known broad typecheck blockers remain.

## Recent Stable Context

Chronicle run-end summary:

- `0.5.75` finalized the planning-only Chronicle run-end summary data-owner map.
- `0.5.76` implemented the pure read-only Chronicle run-end summary projection and focused tests.
- `0.5.77` rendered that projection read-only inside Account Meta / Chronicles.
- The Chronicle source audit is consumed as active prompt authority.

Economy clarity:

- `0.5.78` finalized the planning-only economy clarity data-owner map and label rules.
- `0.5.79` implemented the pure economy clarity projection and focused tests.
- The new projection is source-only; no React UI consumes it yet.
- Future economy clarity UI must stay read-only and must not add buy/sell/dispatch/craft controls.

Typecheck tooling:

- `0.5.74` made typecheck commands honest and repeatable.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers.
- Do not require `npm.cmd run typecheck` unless a prompt specifically fixes those blockers.

## Sequenced Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` for the full queue. Current near-term sequence:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.79` | Economy Price Clarity Pure Projection | `docs/design/economy-price-clarity-view-model-plan.md` | Landed / Partial validation |
| 2 | `0.5.80` | Economy Runtime Test Failure Triage | `docs/dev/economy-runtime-test-failure-triage-plan.md` | Next |
| 3 | `0.5.81` | Calendar Climate Popup View Model Plan | `docs/design/calendar-climate-popup-view-model-plan.md` | Planned |
| 4 | `0.5.82` | Calendar Climate Read-Only Popup | `docs/design/calendar-climate-popup-view-model-plan.md` | Planned |
| 5 | `0.5.83` | Combat Equipment Mapping Audit | `docs/design/combat-equipment-mapping-audit-plan.md` | Planned |
| 6 | `0.5.84` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` | Planned |

## After 0.5.80

If the focused economy tests pass and no new economy blocker appears, return to the sequence file. The next run should be:

- `Version 0.5.81 - Calendar Climate Popup View Model Plan`

Keep it planning-only unless explicitly re-scoped.