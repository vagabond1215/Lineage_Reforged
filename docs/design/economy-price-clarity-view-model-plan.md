# Economy Price Clarity View Model Plan

Date: 2026-05-22
Route: ChatGPT via GitHub Connector
Status: planning source for `Version 0.5.78 - Economy Price Clarity View Model Plan`

## Purpose

Plan a player-facing economy clarity layer before any market, trade, production, or settlement simulation changes.

This plan turns `docs/design/economy-clarity-audit.md` into a Codex-ready source for a later pure projection pass.

This plan does not:

- change economy math
- edit market content
- edit production chains
- edit settlement data
- add shop behavior
- add trading commands
- add caravan dispatch behavior
- add settlement simulation behavior
- edit generated UI output

## Current Source Reality

Current runtime economy and contracts already expose enough read-only data for clarity labels:

- `SettlementInfrastructureRuntimeState` includes storage, trade throughput, dispatch capacity, security, service availability, transport availability, and explanation.
- `SettlementSupplyDemandState` includes surplus, shortages, exports, imports, dependencies, and notes.
- `TradeOpportunityState` includes viability, quantities, margins, route timing, rejection reasons, and explanation.
- `ItemValueResolutionState` includes base/effective production cost, estimated market value, profit margin estimate, resolution path, and explanation.
- `SettlementMarketState` exposes stock pressure, labor pressure, and price views.
- `resolveLocalMarketPrice(...)`, `buildSettlementMarketStates(...)`, `resolveItemValueAtSettlement(...)`, and `resolveCraftAtSettlement(...)` already provide data that can be explained without changing simulation.

## 0.5.78 Recommended Output

`Version 0.5.78 - Economy Price Clarity View Model Plan` should refine this plan from live repo inspection.

If the repo shape is clear, the next implementation should be:

- `Version 0.5.79 - Economy Price Clarity Pure Projection`

## Future View-Model Shape

Suggested future file:

- `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts`

Suggested pure functions:

```ts
buildEconomyPriceClarityViewModel(input)
buildTradeOpportunityClarityViewModel(input)
```

Suggested output fields:

- price label: Cheap / Fair / Expensive / Unknown
- spread label: Normal / Wide spread / Unknown
- margin label: Thin margin / Fair margin / Strong margin / Not viable / Unknown
- scarcity labels: Scarce / Surplus / Import dependent / Export ready / Protected reserve
- labor label: Labor constrained / Stable labor / Unknown
- route/trade viability labels
- short explanation rows
- warning notes when data is missing or non-authoritative
- no command ids

## Label Rules

Use thresholds conservatively and make them easy to test.

Do not expose raw formulas first. Players need meaning before math.

Labels should be derived from existing state only:

- local buy/sell price versus estimated market value
- buy/sell spread
- projected net margin or profit margin estimate
- stock pressure
- labor pressure
- surplus/shortage/import/export lists
- protected reserve/rejection reasons
- existing explanation fields

## Forbidden Behavior

- Do not change price formulas.
- Do not change supply/demand simulation.
- Do not change settlement stockpiles.
- Do not add trade execution commands.
- Do not add caravan dispatch behavior.
- Do not add shop buying/selling behavior.
- Do not add passive income, contacts, discounts, market privileges, or Legacy economy effects.
- Do not fabricate explanations when source data is missing.

## Future UI Rules

- Read-only clarity panel or inline tooltip only.
- No buy/sell/dispatch/craft/claim buttons unless those systems are separately owned.
- Use short labels and expandable explanation if needed.
- Make missing data obvious rather than pretending complete simulation exists.

## Future Tests

Future projection tests should prove:

1. Cheap/fair/expensive labels derive from price versus estimated market value.
2. Wide spread labels derive from buy/sell spread.
3. Thin/strong margin labels derive from existing margin fields.
4. Scarce/surplus/import/export labels derive from supply/demand state.
5. Protected reserve/rejection reasons are explained without changing trade viability.
6. Missing data returns Unknown or unavailable labels.
7. No command/action ids are emitted.
8. Economy math inputs are not mutated.
9. No trade, shop, caravan, production, or settlement simulation behavior changes.

## Validation For Implementation Pass

Future Codex implementation should run:

- `npm.cmd run tool:content-lint`
- focused runtime economy tests if present
- new economy clarity projection tests
- `git diff --check`

Do not run broad typecheck unless typecheck target policy has been cleaned up and the prompt explicitly asks for it.