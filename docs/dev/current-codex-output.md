# Current Codex Output

Source version/run: Version 0.5.78 - Economy Price Clarity View Model Plan
Date: 2026-05-24
Branch/status assumption: Ran locally on `master`. Initial worktree was clean. `git pull` failed on local OpenSSL certificate validation, then `git -c http.sslBackend=schannel pull` reported `Already up to date.` Direction-bearing docs still lag in places, so this run trusted the latest Codex output state that 0.5.77 landed and 0.5.78 was next.

## Result
Finalized the planning-only economy price clarity view-model plan in `docs/design/economy-price-clarity-view-model-plan.md` from live repo inspection. The plan now defines the 0.5.79 pure projection boundary, source owners, label thresholds, missing-data behavior, read-only restrictions, and focused future tests.

No runtime, source, schema, UI, test, content JSON, generated output, or economy behavior was implemented.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/economy-price-clarity-view-model-plan.md`
- `docs/design/economy-clarity-audit.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/civilization-engine/src/runtime-economy.ts`
- `packages/engines/civilization-engine/src/settlement-simulation.ts`
- `packages/engines/civilization-engine/src/trade-runtime.ts`
- `packages/engines/civilization-engine/src/index.ts`
- `apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts`
- `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `tests/unit/civilization-runtime-economy.test.mjs`
- `tests/unit/civilization-trade-runtime.test.mjs`
- `tests/unit/civilization-system-consistency.test.mjs`

## Files Changed
- `docs/design/economy-price-clarity-view-model-plan.md`
- `docs/dev/current-codex-output.md`

## Current Repo Reality
Current contracts and runtime sources can support a read-only clarity layer without changing economy behavior:

- `SettlementMarketState` contains settlement-local `stock`, `laborPressure`, and `priceView` rows.
- `SettlementMarketPriceState` contains buy/sell prices, spread, estimated market value, production cost, and pressure sources.
- `SettlementSupplyDemandState` contains surplus, shortage, import, export, consumption, dependency, and note fields.
- `TradeOpportunityState` contains viability, strategic necessity, quantities, load/fill, protected reserve, absorption, prices, margins, route timing, route ids, rejection reasons, and explanations.
- `ItemValueResolutionState` and `CraftResolutionState` contain enough read-only value/cost detail for later projection rows.
- `tickCivilization(...)` currently stores computed market states and evaluated trade opportunities on civilization state, but the future projection should consume that resolved state only and must not tick, dispatch, or recompute.

## Data-Owner Map
- Price clarity: owned by runtime economy through `SettlementMarketPriceState` plus matching `SettlementMarketState`.
- Stock scarcity/surplus clarity: owned by runtime economy stock pressure and settlement simulation supply/demand.
- Labor pressure clarity: owned by runtime economy labor pressure rows.
- Trade opportunity clarity: owned by trade runtime through `TradeOpportunityState`.
- Item value clarity: owned by runtime item value resolution through supplied `ItemValueResolutionState`.
- Craft cost clarity: owned by runtime craft estimate resolution through supplied `CraftResolutionState`.
- Infrastructure context: owned by settlement simulation through supplied `SettlementInfrastructureRuntimeState`.

## Planned Projection Boundary
Future file:

- `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts`

Planned pure functions for 0.5.79:

- `buildEconomyPriceClarityViewModel(input: EconomyPriceClarityInput): EconomyPriceClarityViewModel`
- `buildTradeOpportunityClarityViewModel(input: TradeOpportunityClarityInput): TradeOpportunityClarityViewModel`
- `buildCraftCostClarityViewModel(input: CraftCostClarityInput): CraftCostClarityViewModel`

The plan allows all three in 0.5.79 only if each function remains a pure mapper over supplied state. It specifically blocks calling `resolveLocalMarketPrice(...)`, `buildSettlementMarketStates(...)`, `resolveItemValueAtSettlement(...)`, `resolveCraftAtSettlement(...)`, trade dispatch, or civilization tick helpers from inside the projection.

Outputs should be display-ready rows, labels, warnings, and `actionIds: []`.

## Label Rules
- Price labels: `Cheap`, `Fair`, `Expensive`, or `Unknown` from local buy price versus estimated market value.
- Spread labels: `Tight spread`, `Normal spread`, `Wide spread`, or `Unknown spread` from stored spread versus estimated market value.
- Margin labels: `Blocked`, `Losing route`, `Thin margin`, `Fair margin`, `Strong margin`, or `Unknown margin` from stored trade opportunity margin fields.
- Scarcity/import/export labels: derive from stock pressure plus supplied `SettlementSupplyDemandState`; missing inputs produce `Unknown pressure`.
- Labor labels: `Labor constrained`, `Stable labor`, `Skilled labor available`, or `Labor data unavailable` from supplied labor pressure rows only.
- Trade labels: derive from stored viability, strategic necessity, fill ratio, route time, rejection reasons, and explanation.
- Craft/value labels: derive from supplied craft and item value states only; they must not imply inventory consumption, crafted item creation, worker assignment, shop availability, or craft execution.

## Allowed / Deferred Behavior
- Allowed for 0.5.79: read supplied current economy state, convert it into display-ready labels, show warnings for missing/mismatched data, and emit no action ids.
- Deferred/forbidden: price recomputation, formula tuning, supply/demand changes, stockpile mutation, settlement content edits, trade dispatch, caravan state changes, shop actions, crafting execution, passive income, contacts, discounts, market privileges, Legacy economy effects, command ids, React UI, and generated output.
- Cross-system behavior remains untouched: Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, and bequest systems are not part of this projection.

## Future Tests
Recommended 0.5.79 test file:

- `tests/unit/economy-clarity-presentation.test.mjs`

Focused coverage should prove:

- missing price/trade/craft inputs return unknown or unavailable labels and `actionIds: []`;
- cheap/fair/expensive and tight/normal/wide spread labels derive from stored price fields;
- pressure source rows preserve stored source and note data;
- scarcity, surplus, import-dependent, export-ready, protected-reserve, and labor labels derive only from supplied state;
- viable, blocked, strategic, fill, route, rejection, and margin labels derive from `TradeOpportunityState`;
- craft/value labels derive from supplied `CraftResolutionState` and `ItemValueResolutionState`;
- mismatched settlement or item inputs produce warnings instead of guessed data;
- input objects are not mutated;
- no command/action ids are emitted;
- the projection does not call economy resolvers, trade dispatch, or civilization tick helpers.

## Behavior / Runtime Confirmation
- runtime changed: no
- economy math changed: no
- simulation changed: no
- market content changed: no
- settlement content changed: no
- UI changed: no
- schema changed: no
- tests changed: no
- generated output changed: no
- Chronicle behavior changed: no
- Bloodlines behavior changed: no
- Legacy behavior changed: no
- Family Prestige behavior changed: no
- Chronicle Marks changed: no
- Lineage Seals changed: no
- estate behavior changed: no
- heirloom or bequest behavior changed: no

## Checks Run
- `git status --short --branch` -> clean `master...origin/master` before edits.
- `git pull` -> failed due local OpenSSL issuer certificate validation.
- `git -c http.sslBackend=schannel pull` -> `Already up to date.`
- `git status --short --branch` -> clean after sync.
- `git diff --check` -> passed; PowerShell/Git warned that `docs/design/economy-price-clarity-view-model-plan.md` and `docs/dev/current-codex-output.md` line endings will be replaced by CRLF next time Git touches them.

No focused runtime tests were run because this pass changed docs only.

## Risks / Follow-Up
- Direction-bearing handoff and roadmap docs still lag behind the latest Codex output, but the prompt explicitly said to trust `docs/dev/current-codex-output.md` if drift exists.
- 0.5.79 should keep the projection pure and should not hide resolver calls inside presentation code.
- Craft clarity is source-owned enough for a pure mapper, but it should stay display-only and must not become craft execution or inventory behavior.
- Future UI should remain read-only until shop, trade, craft, and settlement interaction owners exist.

## Temporary Guardrail Cleanup Decision
Keep `docs/design/economy-clarity-audit.md` through 0.5.79. The updated plan is now the active implementation source, but the audit remains useful as a source-detail reference and first-candidate rationale.

After 0.5.79 lands and durable rules are folded into `docs/design/future-system-design-ledger.md`, a cleanup pass can mark the audit consumed or delete it if no unique guidance remains.

## Next Recommended Version
Version 0.5.79 - Economy Price Clarity Pure Projection

## Suggested Commit Message
docs(economy): finalize price clarity view model plan
