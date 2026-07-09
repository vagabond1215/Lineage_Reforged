# Resource And Commodity Lint Registration Decision

Source version/run: Version 0.5.304 - Resource And Commodity Lint Registration Decision
Date: 2026-07-09
Status: approved in principle; implementation deferred to `Version 0.5.305 - Resource And Commodity Lint Registration`

## Summary

Approve normal content-lint registration in principle for the existing live `world.resources` and `world.commodities` seed.

Do not implement registration in this decision run. The next narrow implementation run should register the existing live seed through the already-authored schemas and focused validators, with no content expansion and no runtime, UI, save/account, or gameplay behavior.

## Current Posture

Latest accepted primary is `Version 0.5.303 - Resource And Commodity Seed`.

Live seed files exist:

- `packages/content/base/world/resources.json`
- `packages/content/base/world/commodities.json`

Normal content-lint registration remains absent:

- `tools/content-lint/index.mjs` does not import `./resources.mjs`.
- `tools/content-lint/index.mjs` does not import `./commodities.mjs`.
- The normal `checks` list does not include `packages/content/base/world/resources.json`.
- The normal `checks` list does not include `packages/content/base/world/commodities.json`.

## Live Seed Summary

The current seed contains exactly two planned resources and two planned commodities:

| Authority | Id | Status | Related item key | Peer reference |
| --- | --- | --- | --- | --- |
| `world.resources` | `resource.iron_ore` | `planned` | `iron_ore` | `commodity.iron_ore_lots` |
| `world.resources` | `resource.grain` | `planned` | `grain_bundle` | `commodity.grain_bundles` |
| `world.commodities` | `commodity.iron_ore_lots` | `planned` | `iron_ore` | `resource.iron_ore` |
| `world.commodities` | `commodity.grain_bundles` | `planned` | `grain_bundle` | `resource.grain` |

The selected item keys resolve through `items.items`, and both also have market-value coverage:

- `iron_ore` resolves to `item.iron_ore` and `market.item.iron_ore`.
- `grain_bundle` resolves to `item.grain_bundle` and `market.item.grain_bundle`.
- `fauna.abalone` remains useful proof that market-only keys exist and are rejected by focused validation.

## Focused Validation Evidence

Focused validation already covers the exact readiness questions needed before normal registration:

- `node --test tests/unit/resource-commodity-authority-validation.test.mjs` passed with 127 tests.
- `node --test tests/unit/schema-files.test.mjs` passed with 101 tests.

The focused resource/commodity validation proves:

- the live resource wrapper validates through `validateResourcesContent(...)`;
- the live commodity wrapper validates through `validateCommoditiesContent(...)`;
- live resource ids are exactly `resource.grain` and `resource.iron_ore`;
- live commodity ids are exactly `commodity.grain_bundles` and `commodity.iron_ore_lots`;
- every live record status is `planned`;
- `relatedItemKeys` resolve through `items.items`;
- selected related item keys are not market-only;
- peer resource/commodity references resolve;
- production-chain, recipe, ecology/geography, and `observedSettlementGoodsTerms` relationship fields remain absent from the live seed;
- price/value/stock/inventory/cargo/storage/extraction/execution/runtime/UI/save/account/gameplay ownership fields remain absent;
- normal content-lint registration remains absent.

## Decision Answers

1. The seed is stable enough for normal content-lint registration: yes.
2. The live seed contains exactly two resources and two commodities: yes.
3. The live ids are exactly `resource.iron_ore`, `resource.grain`, `commodity.iron_ore_lots`, and `commodity.grain_bundles`: yes.
4. All live statuses are `planned`: yes.
5. The selected related item keys resolve through `items.items`: yes.
6. The selected related item keys are not market-only: yes.
7. Peer resource/commodity references resolve: yes.
8. Production-chain refs are absent from the live seed: yes.
9. Recipe refs are absent from the live seed: yes.
10. Ecology/geography refs are absent from the live seed: yes.
11. `observedSettlementGoodsTerms` is absent from the live seed: yes.
12. Forbidden ownership/runtime/value fields are absent from the live seed: yes.
13. Normal content-lint registration is currently absent: yes.
14. Normal content-lint registration is approved in principle: yes.
15. Registration should happen later, not in this run: yes, in `Version 0.5.305 - Resource And Commodity Lint Registration`.
16. Later registration should load resource content, commodity content, both schemas, `items.items`, and `civilization.market_item_values`.
17. Resources and commodities should register together because the current seed has paired peer cross-references.
18. A post-registration audit should follow after a clean implementation, likely `Version 0.5.306 - Resource And Commodity Post-Registration Audit`.
19. Deep Research is not required before registration.
20. No explicit user question is required before the implementation run if the user accepts this decision.
21. The immediate next route is `Version 0.5.305 - Resource And Commodity Lint Registration`.

## Normal Lint Current Audit

`tools/content-lint/index.mjs` currently includes the normal service registration path but no resource/commodity registration path.

The later registration should edit only what is needed in `tools/content-lint/index.mjs`:

- import `validateResourcesContent` from `./resources.mjs`;
- import `validateCommoditiesContent` from `./commodities.mjs`;
- load `packages/content/base/world/resources.json`;
- load `packages/content/base/world/commodities.json`;
- load `packages/schemas/world/resource.schema.json`;
- load `packages/schemas/world/commodity.schema.json`;
- reuse existing item and market-value loads or add narrow loads if needed;
- call the validators with peer wrappers plus `items` and `marketItemValues`;
- report the new checked-file count in validation evidence.

Do not change resource/commodity content, schemas, focused validators, or focused tests unless a narrow proof adjustment is required by the implementation.

## Together Or Separate

Register resources and commodities together.

The live seed intentionally pairs:

- `resource.iron_ore` with `commodity.iron_ore_lots`;
- `resource.grain` with `commodity.grain_bundles`.

Registering only one side would either weaken peer-reference validation or require a temporary exception. A single narrow implementation can keep the peer contract strict.

## Non-Goals

This decision does not authorize:

- editing `packages/content/base/world/resources.json`;
- editing `packages/content/base/world/commodities.json`;
- editing resource or commodity schemas;
- editing resource or commodity focused validators;
- editing focused tests except in a later narrow registration proof if required;
- adding new resource or commodity records;
- adding production-chain, recipe, ecology/geography, settlement-goods, item, market, crafting, economy, service, Knowledge, POI, Highcrown, combat health, runtime, UI, save/account, or gameplay behavior;
- adding prices, stock, inventories, cargo, storage contents, gathering, extraction, trading, crafting execution, or service execution;
- running Deep Research.

## Deep Research Posture

`GPT-DR.resources.gathering-extraction` remains relevant later for resource-node, gathering, extraction, agriculture, or broad resource expansion work.

It is not required before this normal content-lint registration because the current live seed is tiny, descriptive, planned-only, item-key-backed, and already covered by focused validation.

## Options Considered

Option A: keep normal lint registration deferred.

This avoids touching `tools/content-lint/index.mjs`, but it leaves live static authority content outside the normal validation surface after focused proof is already in place.

Option B: approve registration now, implement later.

This preserves the docs-first decision pattern used by service authority registration while giving the next run a clear implementation target.

Option C: register immediately in this run.

This would mix decision and implementation despite the prompt scope and would obscure the current proof that registration remains absent.

## Selected Option

Select Option B.

Normal content-lint registration is approved in principle for the existing seed, and implementation is deferred to `Version 0.5.305 - Resource And Commodity Lint Registration`.

## Risks And Mitigations

- Risk: Registration could accidentally broaden resource/commodity authority into economy or runtime behavior. Mitigation: the next run should edit only `tools/content-lint/index.mjs` and keep content/schema/validator/test edits out unless narrowly required.
- Risk: Peer refs require both files at once. Mitigation: register resources and commodities together with both wrappers supplied to focused validators.
- Risk: Checked-file counts and dependency loads can drift. Mitigation: the implementation run should report the normal lint checked-file count and then schedule a post-registration audit.

## Checks Run

- Read live resource and commodity content.
- Read resource and commodity schemas.
- Read resource and commodity focused validators.
- Read focused resource/commodity validation tests.
- Read schema-file parse tests.
- Audited `tools/content-lint/index.mjs` for current service registration and absent resource/commodity registration.
- Confirmed `iron_ore` and `grain_bundle` in `items.items` and `civilization.market_item_values`.
- `node --test tests/unit/resource-commodity-authority-validation.test.mjs` passed with 127 tests.
- `node --test tests/unit/schema-files.test.mjs` passed with 101 tests.

## Next Recommended Version

Version 0.5.305 - Resource And Commodity Lint Registration
