# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.198 - Economy Authority Boundary Decision`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/economy-authority-boundary-decision.md` is the permanent authority for the new descriptive economy-layer boundaries.
- `docs/dev/tmp-economy-systems-research-2026-06-20.md` is temporary planning input, not design canon.
- Live repository state overrides research assumptions: embedded settlement economies, item values, economy rules, workplaces, production chains, guilds, and runtime economy/trade already exist.
- `docs/design/world-geography-authority-boundary-decision.md` still controls route and geography prerequisites for later trade-route overlays.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.198 - Economy Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.199 - Settlement Economy Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.198 Result

- Selected future `world.settlement_economies` as the first implementation candidate, starting with a docs-only schema decision.
- Required that decision to resolve ownership against embedded settlement economy/trade/resource/guild fields before implementation.
- Kept future `world.market_profiles` descriptive, band-based, and price-free in `0.5.x`.
- Separated future resources from commodities and professions from guilds and institutions.
- Kept production authority with existing civilization workplaces/chains unless a later normalization decision proves a separate layer is needed.
- Deferred trade-route economy overlays until route authority stabilizes.
- Kept crafting transformations separate from macroeconomic authority.
- Forbade exact prices, stock counts, merchant AI, runtime state, ownership behavior, law/tax execution, and gameplay effects in first-pass authority content.
- Kept Economy Knowledge informational pending a later subject decision.
- Changed no content, schema, validator, test, runtime, UI, storage, pricing, simulation, or gameplay behavior.

## Next Route Boundary

`Version 0.5.199 - Settlement Economy Schema Decision` should remain documentation-only. It must define the future collection identity and strict record contract while deciding which existing settlement economy fields remain settlement-owned and which move to the new authority. It must prevent dual ownership and add no compatibility aliases, schema, validator, content, tests, runtime adapters, or migration behavior.

The temporary economy research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.

The deferred `World Map Feature Authority Schema Decision` remains a valid later roadmap item.
