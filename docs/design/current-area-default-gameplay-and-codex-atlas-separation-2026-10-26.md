# Current Area Default Gameplay And Codex Atlas Separation

Date: 2026-10-26
Status: `OWNER_DIRECTION_CAPTURED; SOURCE_VERIFIED_PREPLANNING; NO_UI_ACTIVATION`
Repository `vagabond1215/Lineage_Reforged`.
Inspected `master` `a596112acf3945f2bf7c625e943f2511d12aa710`.
Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; no Game milestone change, branch integration, reset or Site deployment.
This decision updates the future UI routing in [Barebones Playable UI planning](barebones-playable-ui-implementation-sequence-and-acceptance-packet-2026-10-26.md). It supersedes proposals to add a **separate Home screen alongside an unchanged World domain**, and supersedes historical broad-geography-on-World IA assumptions, not the existing source/ownership safety invariants.

## 1. Owner intent and selected minimal interpretation

**The current physical area is the primary gameplay scene.** Replace the player-facing **World** destination with a **Current Area / local gameplay surface** whose prominent heading is the actual current place name, for example `Starfall Port`, `Ashen Reef`, or the appropriate source-identified region when no finer site is known. The page answers: where am I, what can I perceive here, what can I do, what is happening, how do I leave/travel, and what just happened?

**Preferred simple navigation policy:** when no left/domain navigation item is selected, show **Current Area** by default. A dedicated Home dashboard is **not** needed. The existing `TabId | null` in `InGameShell.tsx` provides a natural view-state seam, but source currently initializes it to `'character'` and uses its first nav item as fallback accent. Deselecting or navigating away from an active domain should return to Current Area, and starting/resuming a campaign should land in Current Area. Supply an obvious, keyboard-accessible **return to current area** affordance (for example a small place icon/label in the persistent shell or toggling the selected domain). Avoid a mysterious permanently blank selection without a means to return. The **page** title uses the location's authoritative, localized display name; the nav action can remain a stable short label/icon if variable-length place names damage the responsive domain rail. Do not persist nav selection as simulation state.

An alternative explicit `Area` icon/tab is permissible if usability evidence prefers it, but it must open the **same** default surface. Do **not** build both `Home` and `Area` as independent equally ranked destinations.

## 2. Ownership and what stays local

The Area scene derives from `playerState.location`, region ID, accepted travel/current activity, local exploration candidate, accepted encounter, available activity and quest facts, player-known context and Chronicle events. The existing [Local Scene/Context Projection Decision](local-scene-context-projection-decision.md) defines the fact-source and uncertainty rules. A map pin, static service record, generated place prose or knowledge entry is not evidence that the player occupies or can interact with that entity.

**Area surface contents** (conditional, never imaginary):

1. **Location identity/description**: canonical current place name, region/settlement hierarchy if known, player-observable short atmosphere/description, local conditions and time/watch. Fallback precisely to broader known place; never display an unrelated selected Atlas entry as *current* location.
2. **Visual orientation**: one compact area scene illustration or localized overhead map *if supported*. Map/map-like art is secondary to actions, not a new geography database.
3. **Immediate situation**: active combat/encounter, nearby discoverable signs, current shift/operation, contextual quest objective, rest or travel readiness, with legal next action and clear cost/block reason.
4. **Possible actions**: owner-sourced Explore, Approach, legal Combat actions, Continue, Rest, current Soundings shift, accepted quest Subscribe/Track/Submit where appropriate, selected real item/consumable actions and owner-resolved local affordances. Place-specific options appear only with actual present target/station/provider.
5. **Travel/leave area**: visible **Travel** control or selection of genuinely known/eligible destinations with source-preview and authorization; can open a compact panel or **Codex → Atlas** destination detail. Area remains the place from which travel is initiated even when Atlas supplies broader geographic reference.
6. **Recent activity / local log**: time-stamped recent **accepted** Chronicle/action notices relevant to this session/area (when retained provenance supports location association), with deeper **Chronicle** link. Do not manufacture retroactive player history by scraping generic UI notification strings, nor persist a second history feed.
7. **Shortcuts**: compact buttons to Character/Inventory/Quests/Activity/Atlas/Chronicle and to a currently supported targeted action. Shortcuts are navigation/projection and route to the same authoritative caller, not duplicate mutation mechanisms.

If an active combat is in progress, the Area page should prioritize its tactics/choices; travel/normal exploration must not remain falsely executable. If no contextual command exists, show a thoughtful description and a truthful fallback, not an invented generic `Look Around` discovery trigger.

**Do not** auto-activate an employment, local merchant, guild, NPC dialogue, resource gather, trade, craft, maritime boarding, pilgrimage or site-interior command just because related static content exists. These are future area affordances only after real source and owner acceptance.

## 3. Codex Atlas owns broader geography and geographic reference

`CodexPanel.tsx` already implements **Atlas** by reading `viewModel.character.lists.geographicKnowledge`. This 2026-10-24 move retained discovered-place visibility/source identities without adding map or travel actions. Preserve that known/discovered/unknown/fog-of-war boundary while expanding the *presentation* in a later targeted pass.

Migrate **non-immediate geographic browsing/presentation**, **not geographic data authority**, from `WorldPanel` and its `worldSections` into the Atlas where a legitimate source exists:

| Current World submenu | Future destination | Boundary |
| --- | --- | --- |
| `World Map` (known locations / synthetic pin canvas) | **Codex → Atlas** world/regional reference/map view; **Area** can optionally show a small *local* orientation map | Maps are read-only reference unless owner-backed travel plans explicitly execute from Area |
| `Region` | Atlas region detail | Geographic and region-scale authored/known facts, not current local interactables |
| `Settlement` | Atlas settlement/district/site reference; current settlement-specific observable facts in Area | Known fact does not prove physical presence of a particular clerk/service |
| `Trade Routes` | Atlas known route geography/reference (and future economy/trade owner where relevant) | Distinguish known geographic route graph from live logistics/rates/throughput |
| `Travel` | **Area** primary contextual action with known destination selector/preview; Atlas cross-link to known destination details | Actual travel mutates through current travel owner, never Atlas-only data click |
| `Local Market` | **Area** only when actual current market/provider is observable and owner-backed; future market management/economy elsewhere | No invented present merchant, transaction, stock or quoted price |

**Remove World sidebar** with `World Map / Region / Settlement / Trade Routes / Travel / Local Market` when Area replaces the old panel. Do not simply transplant all six tabs into Codex or reintroduce nested browsing clutter. Keep Codex Atlas's own search, visibility, filter, place hierarchy, links and a future optional map presentation. Codex retains Flora/Fauna/Minerals/etc. The player can navigate `Area → Atlas(place)` and `Atlas(place) → Area/current context` without confusing an encyclopedia selection with an actual change in player location.

Future geographic map data remains in canonical region/settlement/hex/edge/travel-network/semantic feature owners. An Atlas is a **projection** of known geography, not an authority that reveals unknown coordinates, invents routes or admits travel.

## 4. Verified current source and exact integration seam

| Source path | Current actual behavior | Planned minimal refactor |
| --- | --- | --- |
| `apps/rpg-ui/src/game-shell/InGameShell.tsx` | `useState<TabId | null>('character')`; active fallback `navItems[0]`; `activeTab === 'world'` renders `WorldPanel`; domain rail requires a tab ID | Make null/default render Area, start there, ensure clear selection/return affordance, preserve routing to other panels, use area-theme accent without forcing Character fallback |
| `apps/rpg-ui/src/types.ts` | `TabId` includes `world`; no `home` or `area` | Internal `world` ID can transition to `area` if scoped, but do not break deep links, saved nav preferences or tests implicitly; nav label may be stable `Area` while header is actual name |
| `apps/rpg-ui/src/components/SideNav.tsx` | Renders each nav button and always calls `onChange(item.id)`; no deselect behavior | Toggle active domain to null/default or supply explicit return/home affordance, keyboard accessible, responsive |
| `apps/rpg-ui/src/features/WorldPanel.tsx` | Initializes `activeSection='world-map'`, renders six-section World sidebar; decorative soft-grid map with manually placed `worldData.locations` pins, zoom controls, literal 'Interactive map placeholder' labels; real Explore/Approach/combat/travel appear **below** map | Replace with one scene-first **AreaPanel** (or bounded rename of existing module) and remove broad geography sidebar; place immediate owner-actions/description/log high; preserve precise command previews, risk confirmations, stale rejection, notices |
| `apps/rpg-ui/src/runtime/uiViewModel.ts` | `worldSections` explicitly lists World Map, Region, Settlement, Trade Routes, Travel, Local Market; world lists draw `knownLocations` and `worldRecords`; separate Codex Atlas counts/records exist | Split ephemeral `currentArea` presentation from `atlas` geographic lookup (or reuse existing fields during staged migration). Reproject known geographic records in Atlas without duplicating or persisting facts |
| `apps/rpg-ui/src/features/CodexPanel.tsx` | Atlas already uses geographic-knowledge list and selected detail; no map/travel authority | Preserve Atlas identity/visibility; expand read-only geographic categories/reference view as needed; allow links to/from Area with actual source IDs |
| `apps/rpg-ui/src/game-shell/gameplayLoop.ts` | `getCurrentLocationLabel`, `getKnownLocationId`, `previewTravelToKnownLocation` and accepted travel handlers already support actual local location and travel preview | Reuse exact source owner; a map selection must not update live location until travel command accepted and persisted |
| `apps/rpg-ui/src/runtime/GameSessionContext.tsx` | Bridges current nearby Explore/Approach/Continue and accepted state mutation | Area uses existing callers and state revision/result; no second action bus |
| `docs/design/ui-information-architecture-boundary.md` historical §5–6 | Separate Home and broad World geography retained as conceptual prior route | **This specific owner intent supersedes that UI split**: default Area is Home and current gameplay, Codex Atlas is distant geographic browser |
| `docs/design/contextual-player-action-and-command-architecture-decision.md` historical §7–9 | Home/context command descriptors precede new resource loop | Reuse projection and constraints on **default Area**, not a new Home destination |

## 5. Local art/map choice (conditional, not an image-production order)

The current World map is a deliberately abstract zoomable grid with synthetic display positions, not a verified overhead representation of the current settlement or site. **Do not treat its percentages or decorative soft-grid as real coordinates.**

Proposed two supported asset modes for the Area main scene:

- **Illustrated Area View (preferred initial default):** static/local establishing panorama, isometric scene, parchment scene silhouette or grounded overhead illustration, with the current place name, descriptive alt text and nearby accepted actions in adjacent readable cards. A scene illustration conveys place and atmosphere **without claiming walkable 2D geometry**.
- **Localized Map View (optional switch):** static stylized top-down map for the **currently grounded place** or locally observed site. Show only source-known labels/anchors or abstract non-interactive art; no interactive POI markers, movement grid, pathfinding, coordinates or click-to-travel until a canonical local spatial owner exists. If a known set of locations/routes must be browsed at larger scale, link to **Atlas map** instead.

An individual illustration may be generated for named existing canon areas (e.g. Starfall Port, Ashen Reef, an accurately authored Stonevein locality) **only after** a source-grounded location brief confirms architecture, climate, culture, terrain, time and visibility. Distinguish `conceptOnly` placeholder assets from canonical geography. Establish consistent crop/aspect, image credit/provenance, missing-asset fallback and replacement. Do not generate dozens of named site maps or hide required actions behind a giant decorative map. Placeholder production is a later explicitly selected **image/asset** task, not an automatic prerequisite to building the Area interface.

If the map viewer adds no locally useful information beyond the illustration and travel/Atlas links, **remove it from Area**. It should not consume the largest part of the page merely to preserve an existing component.

> **2026-10-26 extended deferred-intent audit:** Before activating a visually rich Area, consume [Area-first deferred design and dependency audit](area-first-deferred-design-intent-pull-forward-and-dependency-audit-2026-10-26.md). It adds source-grounded current-place precision (including the Ashen survey anchorage compatibility key), ecology-derived **plausibility vs observation vs interactable** distinctions, bounded Chronicle feedback, short/extended action shape, recovery and active-combat priority, and explicit NPC/station and weather absence rules. This expands **read-only preplanning**, not action authorizations or an Atlas map database.

## 6. Incremental implementation slices and acceptance

**AREA-0 (source-only):** Derive a typed `CurrentAreaScene` read projection anchored to current accepted campaign head, actual location identity, current observation, live owner plans and recent accepted events. Document unknown vs known vs reachable and link destinations. Do not mint a `localScene` persisted owner or static content by guessing.

**AREA-1 (UI route and shell):** Default to Area when no domain selected; prominent dynamic current-place heading and short description; no `World` submenu. Preserve existing travel, Explore, Approach, active combat and their actual result/preview paths. Navigation to Character/Inventory/Activity/Quests/Codex/Chronicle and return works desktop/mobile.

**ATLAS-1 (geographic browse split):** Move the World Map/region/settlement/trade-route *read-only* references to an organized Atlas without revealing undiscovered geography; link known destination details from Area Travel. Avoid moving `local-market` to Atlas as if it were purely geography. Keep travel execution with its owner; no direct teleport.

**AREA-2 (context and log):** Show active objective/shift/encounter, legal actions and blocked reasons, cost/results, recent source-backed Chronicle/local events and useful shortcuts. No second mutation handler or duplicative persisted log.

**ASSET-1 (optional):** One grounded illustration/overhead-area-map placeholder plus safe fallback; evaluate whether local map improves orientation versus art or Atlas. Do not add clickable pins without spatial authority.

**Required selected acceptance:** fresh start lands in actual current named Area; no World subsection; from Area can accept/continue Soundings via owning pages; see real Explore/Approach/combat and accepted Travel preview; selecting an Atlas place does not change character location; no unknown place is leaked; 5g Soundings submit remains once; combat/Normal-Stakes returns to updated Area; actual Save/restart reprojects matching current area; mobile/keyboard navigation, back/forward/focus and actions remain accessible. Test missing `settlementId`, coarse region-only start, changed location after travel, selected outdated destination, active encounter, no eligible action, image missing, and long localized place title.

## 7. Disposition

This document is **owner-directed planning**, not permission to merge draft PRs, replace the master Codex route, rewrite game code, publish generated art, clear saves or deploy. Incorporate it into the existing [PR #24 barebones UI planning sequence](barebones-playable-ui-implementation-sequence-and-acceptance-packet-2026-10-26.md). Prior separate Home suggestions in that packet should be read as **default Current Area presentation**, not the addition of a second destination. Priority on allowance reset: complete Echo/Dev and gear/Save acceptance paths, then small Area/Atlas routing from exact reviewed head; source mapping/prototype can be prepared now. Game `0.1.1-prealpha` and parked combat `DEV-0.7.2.13` unchanged.
