# Contextual Player Command Architecture — Index

Date: 2026-10-19
Source: hosted `master` `bc66a5460c7a77b12b4eda997749ad42a620c554`
Status: **ARCHITECTURE DEFINED; IMPLEMENTATION NOT YET AUTHORIZED**. Unversioned parallel documentation decision. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `GAME_VERSION_NOT_READY` and the installed Ordinary Combat Basic Action Selection Repair remain unchanged.

## Decisions

1. [Contextual Player Action And Command Architecture](contextual-player-action-and-command-architecture-decision.md) — identity, descriptor, gating, interaction, Home, migration, first slices and deferred owners.
2. [Local Scene / Context Projection](local-scene-context-projection-decision.md) — source ownership, observation, persistence and reconstruction.
3. [Location / Surroundings Affordance And Owner Matrices](contextual-player-affordance-and-owner-matrices.md) — required scene cases, ecology coverage families, owner routing and concrete current command inventory.
4. [Ecology-Grounded Contextual Affordance Expansion Plan](ecology-grounded-contextual-affordance-expansion-plan.md) - environmental hierarchy, authored biome/habitat breadth, geometry semantics, staged ecology coverage and anti-hardcoding rules.
5. [Contextual Command Domain Census And Expansion Plan](contextual-command-domain-census-and-expansion-plan.md) - guild, employment, crafting, resource, advancement, magic, service, market, social and ritual command coverage with owner gates and lifecycle semantics.
6. [World Command vs Management Operation Boundary](world-command-vs-management-operation-boundary-decision.md) - separates immediate character/world actions and direct entity interactions from business/property/personnel/crew/policy administration; defines promoted contextual shortcuts and social-action structure.
7. [Contextual Interaction Endpoints And Contract Station Routing](contextual-interaction-endpoints-and-contract-station-routing-decision.md) - guild clerk and crafter conversations, default board/desk browsing, posting-card acceptance, authorized clerk turn-in, brokerage commissions and nonduplicated owner routes.

These decisions extend the [accepted contextual action surface](contextual-action-surfaces-inventory-crafting-and-trade-decision.md) and [UI information architecture](ui-information-architecture-boundary.md). They do not supersede either. The [temporary audit input](../dev/temp/contextual-gameplay-command-system-audit-input-2026-10-19.md) is marked superseded as design input and retained for a separate cleanup commit. Its candidate fields and verbs are not a schema or implementation order.

## Route

The active combat repair and independent victory/choice acceptance precede a separate Game-version decision. This architecture may be accepted in parallel as documentation. The first Home/context implementation then uses existing production commands only and carries environmental provenance without inventing new verbs. The next environmental-affordance kernel must generalize across contrasting authored ecology such as steppe, forest, river/floodplain, estuary/tidal coast and upland/subterranean contexts before the first resource owner is broadened. Entity-specific presentation follows the clerk / board or desk / posting-card / receiving-clerk lifecycle without inventing nested commands. Immediate player actions and direct interactions use the contextual command model; business/property/personnel/crew/policy administration stays in management surfaces and may be linked from Home without becoming a world command. The structural UI overhaul consumes that same split. Separately accepted resource, transaction, employment/social, property and other sandbox owners follow. No new production capability, save schema, deployment or Game-version change is authorized by this package.
