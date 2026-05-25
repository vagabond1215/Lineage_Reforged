# Current Codex Output

Source version/run: Version 0.5.79 - Economy Price Clarity Pure Projection
Date: 2026-05-24
Branch/status assumption: Ran locally on `master`. Initial worktree was clean. Default `git pull` failed on the known local OpenSSL issuer certificate validation issue; `git -c http.sslBackend=schannel pull` reported `Already up to date.` Worktree was clean after sync and before edits.

## Result
Implemented a pure, read-only economy clarity projection in `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts` plus focused unit tests in `tests/unit/economy-clarity-presentation.test.mjs`.

The projection maps supplied, already-resolved economy state into display-ready price, trade, and craft/value labels and rows. It does not call economy runtime helpers, does not mutate inputs, and always returns `actionIds: []`.

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
- `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts`
- `tests/unit/economy-clarity-presentation.test.mjs`
- `docs/dev/current-codex-output.md`

## Projection Boundary
New file:

- `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts`

Exported primitives:

- `EconomyClarityTone`
- `EconomyClarityRow`

Exported input/view-model types:

- `EconomyPriceClarityInput`
- `TradeOpportunityClarityInput`
- `CraftCostClarityInput`
- `EconomyPriceClarityViewModel`
- `TradeOpportunityClarityViewModel`
- `CraftCostClarityViewModel`

Exported pure functions:

- `buildEconomyPriceClarityViewModel(input)`
- `buildTradeOpportunityClarityViewModel(input)`
- `buildCraftCostClarityViewModel(input)`

Output shape:

- display-ready titles/subtitles;
- primary labels for price, spread, scarcity, viability, margin, and craft cost profile;
- row groups for prices, pressure sources, labor, value estimates, trade route context, quantity/load, rejection reasons, explanations, craft cost proportions, craft inputs/outputs, and craft step summaries;
- warning labels for missing or mismatched data;
- `actionIds: []` always.

## Label Rules Implemented
- Price labels: `Unknown`, `Cheap`, `Fair`, `Expensive` from local buy price versus estimated market value.
- Spread labels: `Unknown spread`, `Tight spread`, `Normal spread`, `Wide spread` from stored spread versus estimated market value.
- Margin labels: `Blocked`, `Losing route`, `Thin margin`, `Fair margin`, `Strong margin`, `Unknown margin` from stored `TradeOpportunityState` margin fields.
- Scarcity labels: `Scarce`, `Surplus`, `Import dependent`, `Export ready`, `Protected reserve`, `Unknown pressure` from supplied stock pressure, supply/demand, and trade opportunity reserve/rejection fields.
- Labor labels: `Labor data unavailable`, `Labor constrained`, `Stable labor`, `Skilled labor available` from explicit supplied labor pressure rows.
- Trade labels: `Viable route`, `Strategic necessity`, `Blocked route`, `Needs review`, plus load and route-time labels from stored opportunity fields.
- Craft/value labels: `Material-heavy`, `Labor-heavy`, `Processing-heavy`, `Waste-sensitive`, `Fuel-sensitive`, `Tool-sensitive`, `Skill-sensitive`, `Value estimate unavailable` from supplied craft/value states only.

## Data Rules Enforced
- The projection accepts supplied current state only.
- It does not fetch content, rebuild market states, evaluate trade, dispatch caravans, run civilization ticks, resolve craft estimates, or resolve market prices.
- Missing price/trade/craft data returns unknown or unavailable labels plus warnings.
- Mismatched settlement/item/craft target inputs produce warnings instead of guessed repairs.
- Input fixtures are not mutated.
- Every view model returns `actionIds: []`.
- Source-level tests confirm the projection source does not reference the forbidden economy runtime helpers or deferred cross-system behavior.

## Behavior / Runtime Confirmation
- runtime behavior changed: no
- economy math changed: no
- price formulas changed: no
- simulation changed: no
- settlement stockpiles changed: no
- market content changed: no
- settlement content changed: no
- production chains changed: no
- shop behavior changed: no
- trade execution changed: no
- caravan dispatch changed: no
- crafting execution changed: no
- schema changed: no
- content JSON changed: no
- UI changed: no React UI was added
- generated output changed: no
- Chronicle behavior changed: no
- Bloodlines behavior changed: no
- Legacy behavior changed: no
- Family Prestige behavior changed: no
- Chronicle Marks changed: no
- Lineage Seals changed: no
- estate behavior changed: no
- heirloom behavior changed: no
- bequest behavior changed: no
- tests changed: yes, focused projection tests were added

## Tests Added / Updated
Added `tests/unit/economy-clarity-presentation.test.mjs` with coverage for:

- missing price input warnings and empty actions;
- cheap/fair/expensive labels;
- tight/normal/wide spread labels;
- pressure source row rendering;
- scarce, surplus, export-ready, import-dependent, and protected-reserve labels;
- labor constrained/stable/available labels;
- trade viable/blocked/strategic labels;
- trade losing/thin/fair/strong/unknown/blocked margin labels;
- rejection reasons as read-only rows;
- craft material/labor/processing/waste/fuel/tool/skill labels;
- item value rows without resale-profit promises;
- mismatched input warnings;
- non-mutation of inputs;
- empty action ids for every view model;
- source guardrails against forbidden economy helper calls and deferred cross-system behavior.

## Checks Run
- `git status --short --branch` -> clean `master...origin/master` before edits.
- `git pull` -> failed due local OpenSSL issuer certificate validation.
- `git -c http.sslBackend=schannel pull` -> `Already up to date.`
- `git status --short --branch` -> clean after sync.
- `node --test tests/unit/economy-clarity-presentation.test.mjs` -> passed, 19 tests.
- `npm.cmd run tool:content-lint` -> passed, `content-lint: ok (53 files checked)`.
- `node --test tests/unit/civilization-runtime-economy.test.mjs` -> failed in existing runtime assertions:
  - `craft resolution uses worker skill to reduce time and cost` failed: higher skill did not reduce processing time.
  - `recipe dimensions only affect quantity when the recipe allows it` failed: cheese high-skill quantity did not exceed low-skill quantity.
- `node --test tests/unit/civilization-trade-runtime.test.mjs` -> failed in existing trade runtime assertions:
  - `autonomous trade evaluation produces viable, explained opportunities` failed: no evaluated opportunities were produced.
  - `autonomous trade dispatch creates caravans, reservations, and origin stock changes` failed: no convoy was launched.
- `git diff --check` -> passed; Git warned that `docs/dev/current-codex-output.md` line endings will be replaced by CRLF next time Git touches it.

The failing civilization runtime/trade tests do not import the new projection file and were not broadened into runtime fixes because this pass is presentation-only.

## Risks / Follow-Up
- The new projection suite and content lint pass, but the required existing civilization runtime and trade suites currently fail. Those failures appear outside this patch's source surface and should be triaged in a dedicated economy runtime/data validation pass if they are not already known.
- The projection is source-only; no React UI consumes it yet.
- Future UI must stay read-only and must not add buy/sell/dispatch/craft controls from these labels.
- Craft clarity remains explanatory only. It must not become crafting execution, worker assignment, inventory movement, quality creation, or shop availability.

## Temporary Guardrail Cleanup Decision
Keep `docs/design/economy-clarity-audit.md` for now. The active implementation guidance has moved into `docs/design/economy-price-clarity-view-model-plan.md` and this projection/test suite, but the audit still serves as source-detail reference until a later cleanup pass folds durable economy clarity rules into `docs/design/future-system-design-ledger.md`.

After the read-only economy clarity UI direction is chosen, a connector cleanup pass can mark the audit consumed, fold any remaining durable language, or delete it if no unique guidance remains.

## Next Recommended Version
Version 0.5.80 - Calendar Climate Popup View Model Plan

## Suggested Commit Message
feat(economy): add price clarity projection
