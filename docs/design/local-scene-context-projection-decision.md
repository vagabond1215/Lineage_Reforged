# Local Scene / Context Projection Decision

Date: 2026-10-19
Status: accepted architecture boundary, documentation only; no new persisted schema or runtime owner authorized.

## Decision

`LocalSceneContext` is a short-lived, player-relative, character-observable read projection assembled from domain owners at a specific accepted campaign head/tick. It answers where the player is, what is observable and reachable nearby, what is happening, and which owners can offer actions. It is neither a world database nor a generic command executor. Each contributing owner retains its fact, discovery and mutation rules; the scene resolver cannot infer a feature merely from a map image, a related record, a UI label or a static registry entry.

The current `PlayerLocationState` has only `settlementId`, `siteLabel` and `worldMapId` (`packages/shared/types/src/contracts.ts`). `playerState.regionId` is separate. `WorldEncounterContextState` carries region, optional settlement/site/hex/edge, habitat tags and hazard pressure, while `worldState.nearbyExplorationContext`, candidate and active encounter serve the accepted exploration/encounter path. `sessionState.knownLocations`, current activity, quest journal and Chronicle, `playerState` body/equipment/inventory/knowledge, `gameState.activeEncounter`, authored hex/edge/travel networks and settlement records supply different facts. A present encounter context does not prove exact current position; an authored road, creek, shop or vessel does not prove that the player is beside, inside or aboard it.

## Source and persistence contract

| Layer | Current authority | Scene use and limitation |
| --- | --- | --- |
| Player place | `playerState.location`, `regionId`; accepted travel result | Persisted current coarse anchor. Do not turn `siteLabel` into an unverified site ID. Exact local anchor/interior/vehicle state is a future owner decision. |
| Geographic knowledge | `playerState.geographicKnowledge`, `sessionState.knownLocations` | Persisted character-relative known destinations; knowing a place does not imply current presence or reachability. |
| World geography/travel | authored regions, settlements, hexes, edges, `world.travel_networks`; current travel rules | Static feature/topology references and owner-provided route availability. Map pixels and descriptive resources are not local interactables. |
| Exploration/encounter | `worldState.nearbyExplorationContext` and candidate; `gameState.activeEncounter` | Persisted accepted action context/candidate/encounter. Candidate visibility and admission remain encounter-owned. |
| Actor | player resources, body state, equipment, inventory, skills, spells, abilities, knowledge | Persisted state used for owner-provided previews and permitted methods. A descriptor never becomes an alternate copy. |
| Activity/history | session current activity, quest journal, Chronicle, owner receipts/results | Persisted where existing owners require it; current activity's label alone is not a resumable long-work process. |
| Weather/time/season | current world/runtime clock and weather owners where implemented | Include only authoritative current values. Unknown values remain unknown rather than guessed from climate profiles. |
| Ownership/law/resources/NPCs/structures/vehicles | accepted static authorities plus future runtime owners | Include only when a real instance/access/observation owner can identify it. Most proposed local interactions are currently missing. |

Scene entries need typed source references (`owner`, canonical target ID, source head/revision/tick, observation level) rather than a parallel copied object graph. A target reference must identify the actual selected item stack/instance, quest, encounter target, known destination or future site/resource/vehicle instance. Display labels are never keys. If an owner lacks stable local identity, the related affordance is deferred until that owner defines it; do not manufacture a `districtId`, property ID or vessel ID in `PlayerLocationState` for UI convenience.

## Projection and observation

The projection pipeline is: accepted snapshot + authored catalog under its validated content version → owner-specific observed facts and eligible candidate references → player-relative local scene → owner-supplied affordances/previews → ranked UI descriptors. Explicit source provenance and observed/known/rumored/unknown status travel with facts. The scene omits hidden targets, secrets and invisible ownership details; it can express uncertainty without inventing exact truth. Selected target, item, destination or entity narrows the projection and may reveal further **observable** actions. Multiple owners may contribute distinct commands for one target; the resolver must preserve each concrete command and route, grouping only equivalent presentation entries that point to the same command/target/owner. It cannot merge commands across owners or hide one because they share a family label.

Combat has modal priority: while an active encounter owns control, the scene presents encounter situation, legal combat commands and owner-supported continuation/escape only. It does not claim travel, rest, trade or crafting can run concurrently. Owner state and clock changes invalidate the projection: accepted command, target/selection change, travel, tick, weather, discovery, inventory/equipment, injury, activity, quest, ownership or world-state change all require recomputation. A stale projection cannot authorize a command; execution rechecks current owner state and campaign admission.

## Restart boundary and unresolved identity

Save/load/full restart restores existing authoritative snapshot and authored references, then recomputes the scene and action list. Do not persist action descriptors, ranking, open submenus, previews or blocked labels as gameplay truth. Owner-specific attempts/progress, results and history persist only under their accepted contracts. If a future interior, crossing, resource node, farm plot, property, vessel or long activity requires durable exact identity/progress, its domain owner must first define an ID, lifecycle, visibility and save/retry contract. This decision deliberately leaves that schema choice open; it does not inflate `PlayerLocationState` or reopen epoch persistence.
