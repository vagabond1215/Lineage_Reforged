# Economy Clarity Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Status: connector-only clarity audit; no runtime/source/UI/content changes

## Purpose

This audit identifies safe player-facing clarity layers for the economy before any broader simulation or market behavior work.

The goal is to help players understand prices, scarcity, demand, labor pressure, production cost, and trade opportunity without changing economic math.

This document does not:

- change economy math
- edit market content
- edit production chains
- edit settlement data
- edit UI
- add trading commands
- add shop behavior
- add caravan dispatch behavior
- add settlement simulation behavior
- update generated UI output
- update `docs/dev/current-codex-output.md`

## Sources Inspected

- `docs/dev/project-roadmap.md`
- `docs/design/future-system-design-ledger.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/civilization-engine/src/runtime-economy.ts`

## Current Economy Data That Can Support Clarity

The current runtime economy and shared contracts already expose useful explanation fields and pricing inputs.

Relevant settlement and trade data:

- `SettlementInfrastructureRuntimeState` includes storage capacity/load/utilization, trade throughput, dispatch slots, security, corruption pressure, building condition, maintenance capacity, service availability, transport availability, and explanation.
- `SettlementSupplyDemandState` includes surplus goods, shortage goods, export goods, import goods, consumption goods, trade dependencies, and notes.
- `TradeOpportunityState` includes viability, strategic necessity, projected quantity/load, fill ratio, exportable surplus, protected reserve, destination absorption, origin sell price, destination buy price, margins, route timing, route ids, rejection reasons, and explanation.
- `ItemValueResolutionState` includes base production cost, effective production cost, estimated market value, profit margin estimate, resolution path, and explanation.
- `SettlementMarketState` includes stock pressure, labor pressure, and price view through runtime economy state.

Relevant runtime economy behavior:

- `resolveLocalMarketPrice(...)` calculates local buy/sell price, spread, estimated market value, effective production cost, and pressure sources.
- `buildSettlementMarketStates(...)` builds settlement market states from economy snapshots and computes price views.
- `resolveItemValueAtSettlement(...)` exposes item value resolution.
- `resolveCraftAtSettlement(...)` exposes craft cost/time/quality/labor/material breakdown.

These are enough for a read-only clarity layer. They are not permission to change simulation behavior.

## Recommended Player-Facing Labels

### Price clarity

Use local pricing fields to produce simple labels:

| Label | Suggested basis |
| --- | --- |
| Cheap | local buy price meaningfully below estimated market value |
| Fair | local buy price close to estimated market value |
| Expensive | local buy price meaningfully above estimated market value |
| Wide spread | buy/sell spread is high |
| Thin margin | projected net margin is low |
| Strong margin | projected net margin is high and viable |

Avoid showing raw formulas first. Players need meaning before math.

### Scarcity clarity

Use stock pressure and supply/demand data:

| Label | Suggested basis |
| --- | --- |
| Scarce | shortage goods, unmet demand, or positive demand pressure |
| Surplus | surplus/export goods or high trade surplus |
| Import dependent | import goods or trade dependency direction import |
| Export ready | export goods or exportable surplus |
| Protected reserve | protected reserve blocks full export |

### Labor clarity

Use labor pressure:

| Label | Suggested basis |
| --- | --- |
| Labor constrained | labor pressure above normal / availability below normal |
| Skilled labor available | labor pressure favorable |
| Craft bottleneck | labor pressure tied to production step or output skill |

### Production clarity

Use craft/value resolution:

| Label | Suggested basis |
| --- | --- |
| Material-heavy | material cost dominates total cost |
| Labor-heavy | labor cost dominates total cost |
| Fuel-sensitive | fuel-heavy processing appears in notes |
| Tool-sensitive | tool availability notes appear |
| Skill-sensitive | skill threshold notes appear |
| Low waste | waste cost small |
| High waste | waste cost meaningful |

## Recommended First UI Surface

Do not start with full market simulation UI.

Start with small read-only clarity in existing or future market/trade panels:

```text
Item Price Card
  Local buy price
  Local sell price
  Price label: Fair / Cheap / Expensive
  Scarcity label: Scarce / Surplus / Import dependent
  Why: demand band, stock pressure, labor pressure, import pressure
```

Potential later trade card:

```text
Trade Opportunity Card
  Origin -> destination
  Item
  Viable / blocked
  Projected net margin
  Route time
  Fill ratio
  Rejection reasons
  Explanation
```

## Current-Data Safety Rules

- Use stored or resolved runtime economy fields only.
- Do not invent item prices not backed by `priceView`, `resolveLocalMarketPrice(...)`, or value resolution.
- Do not claim a good is scarce unless pressure/supply/demand data supports it.
- Do not claim trade route profitability unless `TradeOpportunityState` or equivalent runtime output exists.
- Do not infer production bottlenecks from item names alone.
- Keep settlement-local labels scoped to that settlement.
- Do not globalize local prices.

## High-ROI First Implementation Candidates

### 1. Price explanation view model

Pure helper that maps a `SettlementMarketPriceState` to:

- local buy/sell labels
- price band
- scarcity band
- pressure explanation chips

No math changes.

### 2. Trade opportunity explanation view model

Pure helper that maps a `TradeOpportunityState` to:

- viable / blocked
- margin label
- load/fill label
- route-time label
- top rejection reasons
- explanation rows

No dispatch behavior.

### 3. Craft cost explanation view model

Pure helper that maps `CraftResolutionState` to:

- material/labor/processing/waste proportions
- skill gate notes
- tool/fuel notes
- time estimate

No crafting behavior change.

## Forbidden In First Clarity Pass

- no economy rebalance
- no price formula change
- no production chain edits
- no settlement stock mutation
- no caravan dispatch command
- no shop inventory behavior
- no crafting execution
- no generic AI trade behavior
- no UI purchase/sell actions unless separately scoped
- no generated UI output unless explicitly requested

## Recommended Tests For Future Implementation

If a future pure view-model implementation happens, test:

- cheap/fair/expensive label thresholds
- scarce/surplus/import-dependent label precedence
- pressure source rendering
- blocked trade opportunity reasons
- negative/zero margin labels
- craft material/labor/waste proportions
- missing market state fallback
- local scope preserved
- no mutation of economy state

## Recommended Next Prompt Target

```text
Version 0.5.69 - Economy Price Clarity View-Model Plan

Use docs/design/economy-clarity-audit.md as the source.
Plan or implement a pure read-only economy clarity view model for local market price labels and pressure explanations.
Do not change economy math, market content, settlement content, trade dispatch, crafting behavior, shop behavior, runtime state mutation, React UI, or generated output unless explicitly scoped.
```
