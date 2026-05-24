# Economy Price Clarity View Model Plan

Date: 2026-05-24
Route: Codex 5.5 Local
Status: active planning source for `Version 0.5.79 - Economy Price Clarity Pure Projection`

## Purpose And Scope

This is a planning-only source for a future pure, read-only economy clarity projection. It does not implement runtime, source, schema, test, content, UI, or generated-output behavior.

The goal is to let a future presentation layer explain local prices, spreads, scarcity, labor pressure, trade viability, and craft or value cost drivers from already-resolved economy state. The clarity layer must make current economy data easier to read without changing the economy.

This plan does not authorize:

- economy math changes
- price formula changes
- supply, demand, stockpile, settlement, trade, caravan, or production simulation changes
- market, settlement, production-chain, or item JSON changes
- shop buying or selling behavior
- trade execution commands
- caravan dispatch commands
- crafting execution
- passive income, contacts, discounts, market privileges, or Legacy economy effects
- generated UI output

## Current Repo Reality

Live source inspection confirms that the current branch already has resolved economy surfaces that can support a pure clarity projection:

- `packages/shared/types/src/contracts.ts` defines `SettlementMarketState`, `SettlementMarketPriceState`, `SettlementMarketItemPressureState`, `SettlementMarketLaborPressureState`, `SettlementSupplyDemandState`, `SettlementInfrastructureRuntimeState`, `TradeOpportunityState`, `ItemValueResolutionState`, and `CraftResolutionState`.
- `packages/engines/civilization-engine/src/runtime-economy.ts` owns price and value resolution. It builds `SettlementMarketState.priceView` through `buildSettlementMarketStates(...)`, resolves local buy/sell prices with `resolveLocalMarketPrice(...)`, exposes item value with `resolveItemValueAtSettlement(...)`, and exposes craft estimates with `resolveCraftAtSettlement(...)`.
- `packages/engines/civilization-engine/src/settlement-simulation.ts` owns settlement simulation summaries. `SettlementSupplyDemandState` is derived from live market pressure when available, then from authored domestic and trade profiles.
- `packages/engines/civilization-engine/src/trade-runtime.ts` owns trade opportunity evaluation. `TradeOpportunityState` already contains viability, route timing, fill ratio, exportable surplus, protected reserve, destination absorption, margins, rejection reasons, and explanation.
- `packages/engines/civilization-engine/src/index.ts` stores computed market state on `CivilizationEconomyState.marketStates` and evaluated trade opportunities on `CivilizationTransportState.lastEvaluatedOpportunities` during civilization ticks.
- Existing focused tests cover runtime economy, craft explanation, local price response, trade evaluation, dispatch, and system consistency in `tests/unit/civilization-runtime-economy.test.mjs`, `tests/unit/civilization-trade-runtime.test.mjs`, and `tests/unit/civilization-system-consistency.test.mjs`.

The future projection should consume already-resolved state. It should not call tick, dispatch caravans, recompute market states, or invoke resolver functions as a hidden side effect.

## Inspected Economy Source Owners

| Source | Current owner | Safe clarity use |
| --- | --- | --- |
| `SettlementMarketState` | Civilization runtime economy | Settlement-local market snapshot, tick, stock pressure, labor pressure, and price view. |
| `SettlementMarketPriceState` | Runtime price resolver | Local buy/sell price, spread, estimated market value, production cost, and pressure source rows. |
| `SettlementMarketItemPressureState` | Runtime economy snapshot aggregation | Scarcity, surplus, protected reserve hints, unmet demand, stock level, and net pressure labels. |
| `SettlementMarketLaborPressureState` | Runtime economy labor pressure builder | Skill-specific labor constrained/stable/available labels. |
| `SettlementSupplyDemandState` | Settlement simulation profile | Import/export/surplus/shortage/dependency labels and supporting notes. |
| `SettlementInfrastructureRuntimeState` | Settlement simulation profile | Storage, throughput, dispatch slot, and service context labels only. |
| `TradeOpportunityState` | Trade runtime | Read-only viability, margin, route timing, capacity/fill, strategic necessity, and rejection reason labels. |
| `ItemValueResolutionState` | Runtime item value resolver | Production cost, market value, profit margin estimate, resolution path, and pressure contribution labels. |
| `CraftResolutionState` | Runtime craft estimate resolver | Read-only craft cost proportions, time estimate, step notes, input/output summary, and value propagation labels. |
| `CivilizationEconomyState.marketStates` | Civilization state | Preferred stored source for current price clarity inputs. |
| `CivilizationTransportState.lastEvaluatedOpportunities` | Civilization transport state | Preferred stored source for current trade opportunity clarity inputs. |

## Data-Owner Map

| Future section | Data owner | Source fields | Missing-owner behavior |
| --- | --- | --- | --- |
| Price card | Runtime economy | `SettlementMarketPriceState`, matching `SettlementMarketState.stock`, optional `ItemValueResolutionState` | Show `Unknown`/`Unavailable`; do not create prices. |
| Price spread | Runtime economy | `localBuyPrice`, `localSellPrice`, `spread`, `estimatedMarketValue` | Show `Unknown spread`; do not infer from item name. |
| Pressure rows | Runtime economy | `pressureSources`, stock pressure, labor pressure | Omit missing rows and add warning label. |
| Scarcity and surplus | Runtime economy plus settlement simulation | stock pressure fields, `shortageGoods`, `surplusGoods`, `importGoods`, `exportGoods`, `tradeDependencies` | Show `No current pressure data`; do not globalize local state. |
| Labor pressure | Runtime economy | `SettlementMarketLaborPressureState` by `skillId` when a source skill is explicit | Show `Labor data unavailable`; do not infer a skill from item text. |
| Trade opportunity | Trade runtime | `TradeOpportunityState` | Show `Trade data unavailable`; do not create opportunities. |
| Trade rejection reasons | Trade runtime | `viable`, `rejectionReasons`, `explanation` | Show existing reasons only; do not reinterpret as commands. |
| Craft cost summary | Runtime craft estimate resolver | supplied `CraftResolutionState` | Show `Craft estimate unavailable`; do not call craft resolver or consume inventory. |
| Item value summary | Runtime item value resolver | supplied `ItemValueResolutionState` | Show `Value estimate unavailable`; do not rebuild chain or value data. |
| Infrastructure context | Settlement simulation | optional `SettlementInfrastructureRuntimeState` | Show read-only context only; no dispatch, shop, storage, or claim actions. |

## Planned Projection Boundary

Future file:

- `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts`

Future exported row primitives should follow existing presentation files by returning display-ready labels and empty action ids:

```ts
export type EconomyClarityTone =
  | "unknown"
  | "neutral"
  | "favorable"
  | "warning"
  | "blocked";

export type EconomyClarityRow = {
  id: string;
  label: string;
  valueLabel: string;
  detailLabel: string | null;
  tone: EconomyClarityTone;
};
```

Future input types should use resolved current state only:

```ts
export type EconomyPriceClarityInput = {
  settlementId?: string | null;
  itemKey?: string | null;
  marketState?: SettlementMarketState | null;
  price?: SettlementMarketPriceState | null;
  supplyDemand?: SettlementSupplyDemandState | null;
  infrastructure?: SettlementInfrastructureRuntimeState | null;
  itemValue?: ItemValueResolutionState | null;
};

export type TradeOpportunityClarityInput = {
  opportunity?: TradeOpportunityState | null;
  originMarketState?: SettlementMarketState | null;
  destinationMarketState?: SettlementMarketState | null;
};

export type CraftCostClarityInput = {
  craft?: CraftResolutionState | null;
  itemValue?: ItemValueResolutionState | null;
};
```

Future exported functions:

```ts
export function buildEconomyPriceClarityViewModel(
  input: EconomyPriceClarityInput
): EconomyPriceClarityViewModel;

export function buildTradeOpportunityClarityViewModel(
  input: TradeOpportunityClarityInput
): TradeOpportunityClarityViewModel;

export function buildCraftCostClarityViewModel(
  input: CraftCostClarityInput
): CraftCostClarityViewModel;
```

`Version 0.5.79 - Economy Price Clarity Pure Projection` can implement all three functions if each one remains a pure mapper over supplied state. The implementation should start with price and trade tests first. Craft cost clarity is safe only as a mapper over an already-supplied `CraftResolutionState`; it must not call `resolveCraftAtSettlement(...)` or imply crafting execution.

Expected output shapes:

- Price view model: title, subtitle, `priceLabel`, `spreadLabel`, `scarcityLabels`, price rows, pressure rows, labor rows, warning labels, `actionIds: []`.
- Trade view model: title, subtitle, `viabilityLabel`, `marginLabel`, route rows, quantity/load rows, rejection rows, explanation rows, warning labels, `actionIds: []`.
- Craft cost view model: title, subtitle, `costProfileLabel`, time/value rows, cost proportion rows, input/output rows, step summary rows, warning labels, `actionIds: []`.

The projection should not expose raw formulas first. Numeric fields can be shown as values, but explanatory labels should lead.

## Label Rules

Thresholds are intentionally simple so 0.5.79 tests can cover boundary behavior without coupling to private runtime formulas.

### Price Labels

Use `SettlementMarketPriceState.localBuyPrice` against `estimatedMarketValue`.

| Label | Basis |
| --- | --- |
| `Unknown` | Missing price, missing estimated value, or non-positive estimated value. |
| `Cheap` | `localBuyPrice / estimatedMarketValue <= 0.92`. |
| `Fair` | Ratio is `> 0.92` and `< 1.12`. |
| `Expensive` | `localBuyPrice / estimatedMarketValue >= 1.12`. |

`localSellPrice` may be shown as resale context, but the price label should not promise profit.

### Spread Labels

Use the stored `spread` and `estimatedMarketValue`.

| Label | Basis |
| --- | --- |
| `Unknown spread` | Missing spread or non-positive estimated value. |
| `Tight spread` | `spread / estimatedMarketValue <= 0.12`. |
| `Normal spread` | Ratio is `> 0.12` and `< 0.24`. |
| `Wide spread` | `spread / estimatedMarketValue >= 0.24`. |

Wide spread is a market friction label, not a command to buy or sell.

### Margin Labels

For trade, use `TradeOpportunityState.projectedNetMargin`, `projectedGrossMargin`, `unitMargin`, and `viable`.

| Label | Basis |
| --- | --- |
| `Blocked` | `viable` is false. |
| `Losing route` | `viable` is true but `projectedNetMargin < 0`. |
| `Thin margin` | `projectedNetMargin >= 0` and net/gross ratio is `<= 0.15`. |
| `Fair margin` | Net/gross ratio is `> 0.15` and `< 0.35`. |
| `Strong margin` | Net/gross ratio is `>= 0.35`. |
| `Unknown margin` | Gross margin is unavailable or non-positive. |

For item value, use `ItemValueResolutionState.profitMarginEstimate` only as read-only production estimate context. Do not treat it as a guaranteed resale margin.

### Scarcity, Surplus, Import, And Export Labels

Use matching stock pressure and optional `SettlementSupplyDemandState`.

| Label | Basis |
| --- | --- |
| `Scarce` | Item is in `shortageGoods`, or `unmetDemandPerTick > 0.1`, or `demandPressure >= 0.18`. |
| `Surplus` | Item is in `surplusGoods`, or `tradeSurplusPerTick > 0.1`, or `netPerTick > 0.12`. |
| `Import dependent` | Item is in `importGoods` or has an import `tradeDependencies` entry. |
| `Export ready` | Item is in `exportGoods` or has an export `tradeDependencies` entry. |
| `Protected reserve` | Trade opportunity has meaningful `protectedReserve` and limited `exportableSurplus`, or a stored rejection reason cites reserve limits. |
| `Unknown pressure` | No matching stock or supply/demand data exists. |

If multiple labels apply, display all applicable labels in deterministic order: `Scarce`, `Import dependent`, `Surplus`, `Export ready`, `Protected reserve`.

### Labor Pressure Labels

Use a supplied `SettlementMarketLaborPressureState`. The projection should only link item to labor if the input explicitly supplies or clearly resolves the skill from existing pressure sources.

| Label | Basis |
| --- | --- |
| `Labor data unavailable` | No explicit labor pressure row. |
| `Labor constrained` | `pressure >= 1.12` or `shortfallPerTick > 0.1`. |
| `Stable labor` | `pressure > 0.9` and `< 1.12`. |
| `Skilled labor available` | `pressure <= 0.9` and `availability >= 1.05`. |

Do not infer craft skill from item names or content ids in the presentation layer.

### Trade Viability And Rejection Labels

Use `TradeOpportunityState` as stored.

- `Viable route`: `viable` is true.
- `Strategic necessity`: `strategicNecessity` is true.
- `Blocked route`: `viable` is false and `rejectionReasons` is non-empty.
- `Needs review`: `viable` is false and no rejection reason exists.
- Fill labels: `Light load` for `fillRatio < 0.45`, `Useful load` for `0.45 <= fillRatio < 0.8`, `Full load` for `fillRatio >= 0.8`.
- Route labels: `Short route` for `routeTimeDays <= 3`, `Regional route` for `> 3` and `<= 10`, `Long route` for `> 10`.

Do not turn rejection reasons into user actions. The future UI may display reasons but must not add dispatch, retry, buy, sell, reserve, or route-edit buttons.

### Craft And Value Explanation Labels

Use supplied `CraftResolutionState` and `ItemValueResolutionState`.

- `Material-heavy`: material cost is the largest cost component or at least 45 percent of total.
- `Labor-heavy`: labor cost is the largest cost component or at least 35 percent of total.
- `Processing-heavy`: processing cost is the largest component or at least 30 percent of total.
- `Waste-sensitive`: waste cost is at least 12 percent of total or step notes mention waste.
- `Fuel-sensitive`: value propagation or step notes mention fuel.
- `Tool-sensitive`: step notes mention missing or evaluated tools.
- `Skill-sensitive`: step rows include a minimum or effective required rank above zero.
- `Value estimate unavailable`: no supplied item value state.

Craft labels are explanatory only. They must not imply inventory consumption, quality outcome creation, item duplication, work order execution, worker assignment, shop availability, or crafted-item ownership.

### Missing And Non-Authoritative Data

Missing data should produce safe labels:

- `Unknown`
- `Unavailable`
- `No current market snapshot`
- `No current trade opportunity`
- `No current craft estimate`
- `No current pressure data`

The projection should include warning labels when an input is missing, mismatched, or incomplete. It should not repair missing settlement ids, item keys, price rows, trade opportunities, route ids, skills, or craft chains by guessing.

## Allowed / Deferred Behavior

| Area | Future projection may read | Still forbidden/deferred |
| --- | --- | --- |
| Prices | Supplied market price rows and pressure sources. | Recompute prices, tune formulas, or synthesize missing prices. |
| Market state | Supplied settlement-local stock and labor pressure. | Mutate stockpiles, dispatch trade, or globalize local prices. |
| Supply/demand | Supplied settlement simulation `supplyDemand` and dependencies. | Edit settlement content or create new trade dependencies. |
| Trade | Supplied `TradeOpportunityState` rows. | Execute dispatch, reserve assets, alter caravan state, or add command ids. |
| Craft/value | Supplied craft and item value resolution states. | Execute crafting, consume materials, assign workers, create output items, or call craft resolver from the projection. |
| Infrastructure | Supplied storage/throughput/dispatch context. | Add shop actions, storage claims, estate behavior, or market privileges. |
| UI | Later read-only labels and rows. | Buy, sell, dispatch, craft, claim, contact, discount, privilege, or passive-income controls. |
| Cross-system features | None. | Chronicle, Bloodlines, Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, or bequest behavior. |

## Future Tests For 0.5.79

Focused tests should be added under a new file such as:

- `tests/unit/economy-clarity-presentation.test.mjs`

Minimum coverage:

1. Missing price input returns `Unknown`, warning labels, and `actionIds: []`.
2. Cheap, fair, and expensive labels derive from local buy price versus estimated market value.
3. Tight, normal, and wide spread labels derive from stored spread versus estimated market value.
4. Pressure source rows preserve stored source/note data without exposing raw formulas first.
5. Scarce label derives from shortage goods, unmet demand, or demand pressure.
6. Surplus and export-ready labels derive from surplus/export fields or stock trade surplus.
7. Import-dependent label derives from import goods or import dependencies.
8. Protected reserve label derives from stored trade opportunity reserve/rejection data only.
9. Labor constrained/stable/available labels derive from supplied labor pressure rows.
10. Trade viable, blocked, and strategic-necessity labels derive from `TradeOpportunityState`.
11. Thin/fair/strong/loss margin labels derive from stored margin fields.
12. Trade rejection reasons render as explanation rows, not command ids or action labels.
13. Craft material-heavy, labor-heavy, processing-heavy, waste-sensitive, fuel-sensitive, tool-sensitive, and skill-sensitive labels derive from supplied `CraftResolutionState`.
14. Item value rows use supplied `ItemValueResolutionState` and do not promise resale profit.
15. Mismatched settlement or item inputs produce warnings instead of guessed data.
16. Inputs are not mutated.
17. No command/action ids are emitted by any view model.
18. The projection does not call `resolveLocalMarketPrice(...)`, `buildSettlementMarketStates(...)`, `resolveItemValueAtSettlement(...)`, `resolveCraftAtSettlement(...)`, trade dispatch, or civilization tick helpers.
19. No Chronicle, Bloodlines, Legacy, Family Prestige, Chronicle Mark, Lineage Seal, estate, heirloom, or bequest behavior is represented.

## Validation For 0.5.79

Recommended focused validation for the implementation pass:

- `npm.cmd run tool:content-lint`
- `node --test tests/unit/civilization-runtime-economy.test.mjs`
- `node --test tests/unit/civilization-trade-runtime.test.mjs`
- `node --test tests/unit/economy-clarity-presentation.test.mjs`
- `git diff --check`

Do not run broad typecheck unless a future prompt explicitly scopes typecheck validation. Current typecheck targets still have known blocker tracks.

## Temporary Guardrail Cleanup Decision

Keep `docs/design/economy-clarity-audit.md` through 0.5.79. This plan is now the active implementation source, but the audit remains useful as a compact source-detail reference for economy clarity principles and first-candidate rationale.

After a 0.5.79 pure projection lands and its durable rules are folded into `docs/design/future-system-design-ledger.md`, a cleanup pass can mark the audit consumed or delete it if no unique guidance remains.
