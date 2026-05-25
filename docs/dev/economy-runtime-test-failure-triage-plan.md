# Economy Runtime Test Failure Triage Plan

Date: 2026-05-24
Route: ChatGPT via GitHub Connector
Status: active source for `Version 0.5.80 - Economy Runtime Test Failure Triage`

## Purpose

This connector-side triage plan exists because `Version 0.5.79 - Economy Price Clarity Pure Projection` landed cleanly for its new projection/test surface, but two required existing civilization validation suites failed outside that new projection surface.

This pass does not implement runtime, schema, content, UI, generated output, or test changes. It narrows the next Codex run so the failures are fixed before continuing to Calendar/Climate work.

## Current Failure Evidence

From `docs/dev/current-codex-output.md` after `0.5.79`:

- `node --test tests/unit/economy-clarity-presentation.test.mjs` passed with 19 tests.
- `npm.cmd run tool:content-lint` passed.
- `node --test tests/unit/civilization-runtime-economy.test.mjs` failed in existing runtime assertions:
  - `craft resolution uses worker skill to reduce time and cost`: higher skill did not reduce processing time.
  - `recipe dimensions only affect quantity when the recipe allows it`: cheese high-skill quantity did not exceed low-skill quantity.
- `node --test tests/unit/civilization-trade-runtime.test.mjs` failed in existing trade runtime assertions:
  - `autonomous trade evaluation produces viable, explained opportunities`: no evaluated opportunities were produced.
  - `autonomous trade dispatch creates caravans, reservations, and origin stock changes`: no convoy was launched.

The failing suites do not import `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts`. Treat this as an economy runtime/content/test expectation triage, not as a rollback of the 0.5.79 projection.

## Files To Inspect First

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

## Failure Cluster A: Craft Skill Runtime

Failing tests:

- `craft resolution uses worker skill to reduce time and cost`
- `recipe dimensions only affect quantity when the recipe allows it`

Known test expectations:

- `chain.food.bread` at `settlement.vinecross` should show high cooking skill reducing processing time and total cost versus low cooking skill.
- Bread should not vary output quantity when no quantity dimension is allowed.
- `chain.food.fresh_cheese` at `settlement.aurelis` should show higher cooking skill increasing output quantity when quantity is allowed, and at least one step should list `quantity` in `appliedDimensions`.

Relevant source observations:

- `createSkillEffect(...)` already computes `timeFactor`, `wasteMultiplier`, `laborRateFactor`, `qualityFactor`, and `quantityFactor` from `RecipeSkillCheckRecord`, worker rank, allowed dimensions, and labor pressure.
- If a step has no `skillCheck`, `createSkillEffect(...)` returns neutral `timeFactor: 1` and `quantityFactor: 1`.
- Quantity only changes when `allowedDimensions` includes `quantity`.
- `estimateCraftResolution(...)` pushes quantity factors only when the step's applied dimensions include `quantity`, then derives `outputQuantity` from the final average quantity factor.

Likely causes to verify locally:

1. Current content for `chain.food.bread` may not have a skillCheck on the relevant bake step, so both low and high worker skill produce neutral time/cost.
2. Current content for `chain.food.bread` may allow quantity accidentally, or content may be fine but test fixture points at a settlement/chain path with no explicit skill gate.
3. Current content for `chain.food.fresh_cheese` may no longer include `quantity` in allowed dimensions, may lack a skillCheck, or may target a chain/variant whose final output step does not carry the quantity dimension.
4. The runtime may compute skill effects correctly, but material/recursive value resolution may dominate total cost so strongly that expected high-skill total cost reduction is masked.

Recommended Codex approach:

- First run the two failing tests and inspect actual low/high `CraftResolutionState` values by temporary local debugging only; do not commit debug logs.
- Determine whether the source bug is runtime math, content drift, or stale test expectations.
- Prefer fixing runtime/content only if current design intent says skill should affect the output.
- If authored content no longer supports the old assertion, update the test to assert current intended behavior and preserve a smaller direct fixture that proves skill dimensions still work.
- Keep projection code untouched unless a failing test directly proves it is implicated.

Allowed fixes:

- Fix `runtime-economy.ts` skill effect application when it is clearly wrong.
- Fix production-chain/workplace/item content only if current authored data is internally inconsistent and content lint remains green.
- Adjust test fixtures or assertions only if source inspection proves the old test is stale relative to current content/design.
- Add a tiny direct fixture or focused assertion proving skill-gated time/cost and quantity dimensions remain functional.

Forbidden fixes:

- Do not weaken tests by deleting the failing assertions without replacement coverage.
- Do not make all crafts globally scale quantity with skill.
- Do not make all skill improvements unrealistically large just to satisfy one test.
- Do not alter economy clarity presentation behavior to hide runtime failures.
- Do not change UI, generated output, Chronicle, Bloodlines, Legacy, Family Prestige, Marks, Seals, estate, heirs, heirlooms, or bequests.

## Failure Cluster B: Autonomous Trade Runtime

Failing tests:

- `autonomous trade evaluation produces viable, explained opportunities`
- `autonomous trade dispatch creates caravans, reservations, and origin stock changes`

Known test expectations:

- The test settlement set is:
  - `settlement.aurelis`
  - `settlement.vinecross`
  - `settlement.stonevein`
  - `settlement.brineharbor`
- `evaluateAutonomousTradeOpportunities(...)` should produce at least one opportunity, at least one viable opportunity, and a viable `grain` export from `settlement.vinecross`.
- `runAutonomousTradeDispatch(...)` should dispatch at least one convoy, create matching caravans/reservations, store last evaluated opportunities, and reduce origin stock.

Relevant source observations:

- `evaluateAutonomousTradeOpportunities(...)` builds settlement simulation profiles from supplied market states.
- Origin candidate stock is filtered to entries with `stockLevel > 0`, sorted by exportable surplus, and sliced to 18 entries.
- Any stock entry with `exportableSurplus < 1` is skipped before destinations are considered.
- Destinations are skipped unless `destinationNeedsItem(...)` returns true.
- `projectedQuantity` is limited by capacity, exportable surplus, destination absorption, origin throughput, and destination throughput.
- A non-strategic route is rejected if fill ratio is below the transport threshold or projected net margin is below the viability threshold.
- Dispatch only processes opportunities where `opportunity.viable` is true.

Likely causes to verify locally:

1. Current economy content may produce no exportable surplus above protected reserve for the test settlements.
2. `getProtectedReserve(...)` may now be too conservative relative to stock levels, especially for essential goods like grain.
3. Current settlement simulation may no longer mark a destination as demanding `grain` or related families.
4. Destination absorption may be zero even when destination demand content exists.
5. Trade route/vehicle/transport availability content may now reject all candidates due infrastructure minimums, fill ratio, route capacity, or margins.
6. The test may be stale if current content no longer guarantees `vinecross` grain export without a controlled fixture.

Recommended Codex approach:

- First run the two failing trade tests and inspect actual evaluation output with local temporary logging only; do not commit debug logs.
- Determine whether zero opportunities comes from no exportable surplus, no destination demand, no absorption, transport rejection, route failure, or margin threshold.
- Prefer a targeted source/content/test update that preserves the intended invariant: autonomous trade should produce at least one explained opportunity and one dispatchable convoy in a deterministic current-content fixture.
- If live content no longer guarantees `settlement.vinecross` grain export, update the test to either use a controlled market fixture or a current-content pair that is intentionally stable.

Allowed fixes:

- Fix trade runtime if it is over-filtering before explanations are preserved.
- Fix protected reserve/exportable surplus logic if it prevents all trade in ordinary current-content conditions.
- Fix settlement/trade/transport content only if it is clearly internally inconsistent and lint remains green.
- Adjust the test fixture to a deterministic current-content trade route only if the old `vinecross` grain invariant is stale.
- Preserve rejected-opportunity explanations even when nothing is viable, where useful.

Forbidden fixes:

- Do not bypass reserve protection broadly.
- Do not dispatch trade that violates route, transport, throughput, or stock constraints.
- Do not hard-code `vinecross` or `grain` into runtime logic.
- Do not make every evaluated opportunity viable.
- Do not add shop/trade UI, command ids, player-facing dispatch actions, economy clarity UI, generated output, or cross-system rewards.

## Recommended Next Codex Run

Use:

- `Version 0.5.80 - Economy Runtime Test Failure Triage`

Intent:

- Fix or correctly re-scope the existing failing economy runtime/trade tests before moving to Calendar/Climate planning.

Route:

- Codex 5.5 Local

Expected scope:

- Runtime/source/content/test changes only as needed to restore focused validation.
- No React UI.
- No economy clarity UI.
- No generated output.
- No broad system expansion.

Expected validation:

- `node --test tests/unit/economy-clarity-presentation.test.mjs`
- `node --test tests/unit/civilization-runtime-economy.test.mjs`
- `node --test tests/unit/civilization-trade-runtime.test.mjs`
- `npm.cmd run tool:content-lint`
- `git diff --check`

Optional if touched or relevant:

- `node --test tests/unit/civilization-system-consistency.test.mjs`

Do not require broad typecheck unless a narrow source change makes it useful; known broad typecheck blockers remain.

## After This Triage Lands

If the focused economy tests pass and no new economy blocker appears, return to the sequenced queue with:

- `Version 0.5.81 - Calendar Climate Popup View Model Plan`

The previous `0.5.80` Calendar plan is intentionally shifted down because economy runtime validation failed after `0.5.79`.