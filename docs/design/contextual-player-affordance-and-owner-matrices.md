# Contextual Player Affordance And Owner Matrices

Date: 2026-10-19
Status: design matrix only. Rows name **future affordances unless the current-command inventory explicitly says executable**. No authored scene or missing owner is made playable by this document.

## 1. Location and surroundings

Each row separates physical affordance (P), legitimate permission (L), tool/equipment (T), skill/knowledge (K), environment/time (E), active world/resource state (W), and body/current danger (B). `D` direct, `X` expand, `A` activity, `C` confirm. Shapes can compose. The cited source must actually establish the feature and its observation; map art or flavor text does not. Unknown/missing local identity suppresses the proposed command.

| Scene and candidate actions | P | L | T | K | E | W | B | Shape |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Forest: Look, Explore, Gather deadwood/berries, Fell tree, Camp | Observed forest/resource/site; no generic forest truth from regional biome | Access/woodcutting/camp rights; illicit felling only with consequence owner | Axe for mature tree, capacity, camp supplies | Foraging changes recognition/yield, not blanket forest access | Rain/season/daylight alter method/yield/fire | Actual nodes and depletion; accepted encounter candidate can interrupt | Fatigue/load/injury alter effort; combat suspends ordinary work | Look D; Explore A; Gather X→A; Fell X→A/C; Camp X→A |
| Creek/river bank: Inspect, Follow, Collect/Drink water, Fish | Reachable bank/water feature and safe access point | Water/fishing rights distinct from physical access | Container, fishing gear or filter if method needs it | Water safety/fishing skill changes information/yield | Current, flood, temperature, light | Water quality/fish stock/closure must have owner | Injury/load/cold exposure change risk | Inspect D; Follow X→A; Collect X; Fish X→A; risky drink C |
| Bridge: Inspect, Cross, Pay Toll, Turn Back | Actual traversable edge/bridge, condition and exit | Toll/control; theft/trespass is a separate owner | Mount/cart/vehicle fit and payment | Knowledge may reveal safe load/alternate route | Flood/ice/wind affect condition | Closure/guard/toll state owner | Load/injury affect crossing | Cross D or C; toll X→C; alternate X |
| Ford: Inspect, Wade/Ford, Lead/Ride across, seek route | Actual shallow crossing edge and banks | Access rules independent of water depth | Rope, mount and cargo handling where needed | Navigation/swim skill changes risk/method | Depth/current/weather/time | Flooded/blocked edge can remove method | Encumbrance/injury/exhaustion change risk | Method X→C/A |
| Lake/shore: Look, Fish, Collect water, Swim, Board | Shore/water/landing/vessel instances | Fish/shore/boat permission | Gear, container, vessel | Swim/sail skill affects risk | Wind, waves, temperature, visibility | Stock, berth, vessel availability | Fatigue/load/hypothermia | Fish X→A; collect X; swim C→A; board D/C |
| Dock: Inspect, Fish, Talk, Board, Load/Unload | Actual dock, NPC/vessel/cargo and reachable berth | Dock rights, cargo ownership, berth access | Cargo gear/container | Handling/navigation affects duration | Tide/weather/hours | Occupancy, open trade and vessel state | Load/injury limits | Talk X; board D/C; cargo X→A |
| Aboard vessel: Inspect, Row/Sail, Anchor/Moor, cargo, Disembark | Durable aboard/vessel/landing identity required | Control, captain and cargo authority | Oars/sail/anchor and capacity | Navigation/rowing modifies risk | Wind/current/depth/daylight | Vessel condition, route and berth | Fatigue/injury and combat | Pilot X→A; anchor X; cargo X→A; disembark D |
| Town street/square: Look, Talk, visit place, Seek Work, Travel | Actual settlement/street and observed people/entrances | Hours, access, civic law | Fare or load where relevant | Local knowledge reveals destinations | Day/night/weather change availability | NPC schedules, jobs and events must be real | Injury/danger can reprioritize escape | Look D; Talk X; Travel X→A; work X |
| Shop/interior: Look, Browse, Talk, Buy/Sell, Exit | Entered interior, seller and stock instance | Hours, seller consent, ownership | Funds/goods and carrying capacity | Appraisal reveals only observed facts | Opening hours/light | Stock/price/transaction state | Capacity/body state; combat interrupts | Browse D→view; Talk X; trade X→C; Exit D |
| Workshop: Inspect, Operate, Craft, Repair | Actual station, materials and supported process | Owner/employer/rental access | Recipe tools/fuel/material | Skill changes quality, time, complexity | Heat/weather/hours | Station occupancy/condition, work order | Fatigue/injury limits | Operate D/X; craft/repair X→A |
| Mine/quarry: Inspect, Dig/Mine, haul, leave | Actual deposit, safe approach and exit | Claim/work permission; unlawful mining separate | Pick, light, container, safety gear | Prospecting changes information/yield | Light, ventilation, weather | Deposit depletion and hazard state | Stamina/injury/encumbrance | Mine X→A/C; haul X→A |
| Farm: Inspect Plot, Plow/Sow/Water/Weed/Harvest, animals | Actual plot/crop/animals and stage | Owner, lease or work assignment | Seeds, water, farm tools | Skill modifies quality/yield | Season/rain/daylight | Crop stage, soil, stock, animal state | Fatigue/load/injury | Farm X→A; harvest X→A; tend X→A |
| Owned property: Inspect, Store, Manage, Build/Improve | Actual property/building/container | Title/lease/permission; management is legitimate authority | Materials, money, labor | Knowledge affects options/cost | Weather/time/permit window | Damage, storage, project state | Capacity/fitness for physical work | Inspect D; manage X; build X→C→A |
| Wilderness campsite: Look, Rest/Sleep, fire, cook, break camp | Accepted camp/site/shelter identity | Camping/fire rights; trespass separate | Bedroll, fuel, food, station | Survival skill modifies safety | Rain/wind/night/season | Fuel, fire state, interruptions | Exhaustion/injury/hostile proximity | Camp X; fire X→C; rest/sleep A; cook X→A |
| Active combat: Inspect visible foes, select legal command, Continue, flee if owned | Active accepted encounter and legal targets | Combat hostility/law consequences where supported | Equipped item/resources | Skill/effect compatibility changes resolution | Terrain/weather only if combat owner consumes it | Timing, statuses, target HP, encounter state | HP/MP/stamina, injury, readiness | Target X→D; risky action C; Continue D; flee only when owner exists |

“Cross” illustrates context-specific concrete methods: intact unrestricted bridge may be direct; a toll requires payment choice; shallow ford allows wading; deep water may require swimming; a mount may require leading or riding. These are separate owner-validated commands/methods, not one generic `Cross` execution with a relabeled button. If a bridge is closed or a river flooded, omit impossible methods; show an observed useful blocker or alternate route where an owner provides one.

## 2. Domain owner routing

| Action/family | Contextual invocation | Execution and history/persistence owner | Present state |
| --- | --- | --- | --- |
| Travel to known destination | Home, World known-place selection | `player-travel` through `gameplayLoop`; player location/body and travel event/Chronicle, campaign snapshot | Existing bounded command. |
| Nearby Explore | Home, World nearby situation | `player-nearby-exploration`, nearby context/candidate and accepted action history | Existing bounded command. |
| Approach candidate | Home, World observed candidate | `player-nearby-encounter` admission, campaign control and encounter state/history | Existing bounded command; no arbitrary engage. |
| Legal combat action/Continue | Home modal encounter, World combat controls | Combat legal list, encounter step/queue, game encounter/history and campaign control | Existing; basic melee projection under active repair. |
| Rest at current settlement | Home, Activity | `gameplayLoop` rest/body/clock/Chronicle via current snapshot bridge | Existing UI bridge; future owner extraction separate. |
| Accept/Track/Untrack quest | Home selected observed offer/objective, Quests | Engine quest acceptance/tracking via `gameplayLoop`, quest journal/tracked state and events | Existing bounded commands. |
| Soundings Submit | Home selected eligible quest/site, Quests | `player-soundings-turn-in` through `GameSessionContext`, durable receipt/reward/journal/history | Existing accepted specific command; no generic equivalence. |
| Other quest Turn In | Quests | Current `gameplayLoop` bridge/journal | Present UI action; not promoted to general durable owner in first Home slice. |
| Equip/Unequip | Selected inventory/equipment, Home secondary action | `characterPanelState` current snapshot bridge; equipment/inventory state | Existing UI bridge; command-owner separation unresolved. |
| Use Consumable | Selected inventory item, Home secondary action | `characterPanelState` current bridge; inventory/player resources/body state | Existing UI bridge; broader food owner remains future. |
| Look/Inspect/Search | Scene or selected target | Observation/knowledge/location owner, history only for accepted discovery | Local scene informational refresh possible; gameplay search/inspection owner missing. |
| Enter/Exit/Cross/Climb/Swim, local movement | Selected feature/route | Travel/location/crossing owner; player position and action history | Static topology exists; exact local command/position owner missing. |
| Gather/Forage/Cut/Mine/Fish/Water | Selected observed resource | Future ecology/resource + timed activity command; depletion, inventory and result history | Missing executable owner/instance identity. |
| Camp/fire/sleep/work | Scene/work order | Future survival or work/activity owner; attempt/progress and clock | Settlement Rest is narrower; generic owner missing. |
| Craft/Cook/Repair/Operate | Selected material or workplace | Accepted design assigns recipe/process execution; item and station owners persist output/condition | Design authority exists; general player command path missing. |
| Browse/Buy/Sell/Barter | Merchant/storefront | Stock presentation then economy/transaction owner; wallet, stock, item transfer and receipt | Design authority exists; general ordinary transaction path missing. |
| Talk/Ask/Give/Offer/Seek Work | Selected observed NPC/employer | NPC/social or employment owner; relation/contract and transfer history | Missing broad ordinary execution. |
| Farm/property/build/animals | Selected plot/property/project | Future agriculture/property/project owners; crop/property/project state | Missing runtime identity and execution. |
| Board/pilot/dock/mount/cargo | Selected vessel/mount/landing | Future transport/vessel/cargo owners plus travel; location/vehicle/cargo state | Authored routes alone do not implement this. |
| Steal/force/trespass | Selected observable target | Future crime/access/social consequence owner plus affected domain | Missing; do not expose a harmless UI-only shortcut. |

Static catalogs and descriptive records remain inputs only. The presentation resolver can aggregate several owner offers for one observed target; each operation retains its own owner, payload requirements, result and history. Chronicle records accepted outcomes where that domain already writes them; a universal action log is not authorized.

## 3. Production command migration inventory

The current shell starts in Character and routes six panels (`InGameShell.tsx`). World hosts Travel, Explore, Approach, legal combat actions and Continue (`WorldPanel.tsx`); Activity hosts Rest (`ActivityPanel.tsx`); Quests hosts Accept, Track/Untrack and Submit/Turn In (`QuestsPanel.tsx`); Character hosts Equip/Unequip and Use Consumable (`CharacterPanel.tsx`). `GameSessionContext.tsx` applies accepted nearby exploration/encounter/Soundings transitions and admits legacy bridge snapshots. Home must invoke these same routes; it must not duplicate command logic or imply that every UI bridge has already become a dedicated engine owner.

| Existing control | First Home projection | Shape and boundary |
| --- | --- | --- |
| Travel | Known visible destinations, owner preview/reason | Expand destination → activity/result; confirm only owner-reported unusual risk. |
| Explore nearby environs | Current eligible nearby context | Activity/result; candidate may be absent. |
| Approach encounter | Observed accepted candidate | Direct or risk confirm; admission owner rechecks candidate. |
| Legal combat actions | Exact combat legal-list entries | Target choice then direct; distinct action identities/costs; blocked repair remains active. |
| Continue combat | Active encounter | Direct tick step when owner permits. |
| Rest | Eligible current settlement | Activity/result; current preview and risk confirmation preserved. |
| Quest Accept, Track/Untrack | Observed selected offer or active quest | Direct/confirm as owner requires; quest journal state rechecked. |
| Soundings Submit | Eligible Soundings return context | Direct/confirm with exact retry request/receipt semantics preserved. |
| Equip/Unequip, Use Consumable | Selected carried item/slot | Direct or quantity choice only where current caller supports it; preserve bridge until separate owner migration. |

Other quest Turn In remains in the Quests panel as currently implemented but is excluded from the first Home slice's durable accepted-command claim. No “Look Around” discovery command, Shop/Browse, Gather, generic Craft or new traversal is smuggled into that slice. After command completion, the UI recomputes current situation from the accepted snapshot; save/load/restart rebuilds it without saved descriptors.
