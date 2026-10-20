# Contextual Player Affordance And Owner Matrices

Date: 2026-10-19
Status: design matrix only. Rows name **future affordances unless the current-command inventory explicitly says executable**. No authored scene or missing owner is made playable by this document.

## 1. Location and surroundings

Each row separates physical affordance (P), legitimate permission (L), tool/equipment (T), skill/knowledge (K), environment/time (E), active world/resource state (W), and body/current danger (B). `D` direct, `X` expand, `A` activity, `C` confirm. Shapes can compose. The cited source must actually establish the feature and its observation; map art or flavor text does not. Unknown/missing local identity suppresses the proposed command.

| Scene and candidate actions | P | L | T | K | E | W | B | Shape |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Forest: Look, Explore, Gather deadwood/berries, Fell tree, Camp | Observed forest/resource/site; no generic forest truth from regional biome | Access/woodcutting/camp rights; illicit felling only with consequence owner | Axe for mature tree, capacity, camp supplies | Foraging changes recognition/yield, not blanket forest access | Rain/season/daylight alter method/yield/fire | Actual nodes and depletion; accepted encounter candidate can interrupt | Fatigue/load/injury alter effort; combat suspends ordinary work | Look D; Explore A; Gather X→A; Fell X→A/C; Camp X→A |
| Creek/river bank: Inspect, Follow, Collect/Drink water, Fish | Reachable bank/water feature and safe access point | Water/fishing rights distinct from physical access | Container, fishing gear or filter if method needs it | Water safety/fishing skill changes information/yield | Current, flood, temperature, light | Water quality/fish stock/closure must have owner | Injury/load/cold exposure change risk | Inspect D; Follow X→A; Collect X; Fish X→A; risky drink C |
| Bridge: Inspect, Cross, Pay Toll, Talk to Collector, Turn Back | Actual traversable edge/bridge, condition, official/collection point and exit | Toll/control; theft/trespass is a separate owner | Mount/cart/vehicle fit and payment | Knowledge may reveal safe load/alternate route | Flood/ice/wind affect condition | Closure/guard/toll/collector state owner | Load/injury affect crossing | Cross D/C; Pay Toll D/C when target+price are established, otherwise Talk/Pay X→C; alternate X |
| Ford: Inspect, Wade/Ford, Lead/Ride across, seek route | Actual shallow crossing edge and banks | Access rules independent of water depth | Rope, mount and cargo handling where needed | Navigation/swim skill changes risk/method | Depth/current/weather/time | Flooded/blocked edge can remove method | Encumbrance/injury/exhaustion change risk | Method X→C/A |
| Lake/shore: Look, Fish, Collect water, Swim, Board | Shore/water/landing/vessel instances | Fish/shore/boat permission | Gear, container, vessel | Swim/sail skill affects risk | Wind, waves, temperature, visibility | Stock, berth, vessel availability | Fatigue/load/hypothermia | Fish X→A; collect X; swim C→A; board D/C |
| Dock: Inspect, Fish, Talk, Board, Load/Unload | Actual dock, NPC/vessel/cargo and reachable berth | Dock rights, cargo ownership, berth access | Cargo gear/container | Handling/navigation affects duration | Tide/weather/hours | Occupancy, open trade and vessel state | Load/injury limits | Talk X; board D/C; cargo X→A |
| Aboard vessel: Inspect, Row/Sail, Anchor/Moor, cargo, Disembark | Durable aboard/vessel/landing identity required | Control, captain and cargo authority | Oars/sail/anchor and capacity | Navigation/rowing modifies risk | Wind/current/depth/daylight | Vessel condition, route and berth | Fatigue/injury and combat | Pilot X→A; anchor X; cargo X→A; disembark D |
| Town street/square: Look, Talk, visit place, Seek Work, Travel | Actual settlement/street and observed people/entrances | Hours, access, civic law | Fare or load where relevant | Local knowledge reveals destinations | Day/night/weather change availability | NPC schedules, jobs and events must be real | Injury/danger can reprioritize escape | Look D; Talk X; Travel X→A; work X |
| Shop/interior: Look, Browse, Talk, Buy/Sell, Exit | Entered interior, seller and stock instance | Hours, seller consent, ownership | Funds/goods and carrying capacity | Appraisal reveals only observed facts | Opening hours/light | Stock/price/transaction state | Capacity/body state; combat interrupts | Browse D→view; Talk X; trade X→C; Exit D |
| Workshop: Inspect, Operate, Craft, Repair | Actual station, materials and supported process | Owner/employer/rental access | Recipe tools/fuel/material | Skill changes quality, time, complexity | Heat/weather/hours | Station occupancy/condition, work order | Fatigue/injury limits | Operate D/X; craft/repair X→A |
| Mine/quarry: Inspect, Dig/Mine, haul, leave | Actual deposit, safe approach and exit | Claim/work permission; unlawful mining separate | Pick, light, container, safety gear | Prospecting changes information/yield | Light, ventilation, weather | Deposit depletion and hazard state | Stamina/injury/encumbrance | Mine X→A/C; haul X→A |
| Farm: Inspect Plot, Plow/Sow/Water/Weed/Harvest, animals | Actual plot/crop/animals and stage | Owner, lease or work assignment | Seeds, water, farm tools | Skill modifies quality/yield | Season/rain/daylight | Crop stage, soil, stock, animal state | Fatigue/load/injury | Farm X→A; harvest X→A; tend X→A |
| Owned property: Inspect, Enter/Use, Store, personally Repair/Build | Actual property/building/container | Title/lease/permission | Materials, money, labor for physical work | Knowledge affects options/cost | Weather/time/permit window | Damage, storage, project state | Capacity/fitness for physical work | Inspect D; store X; repair/build X→C→A. Property/Personnel/Ledger are management navigation, not world commands. |
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
| Social interaction: Greet/Talk/Ask/Joke/Compliment/Flirt/Apologize/Persuade/Negotiate/Give/Request/Seek Work/direct order | Selected observed person/NPC/subordinate | NPC/dialogue/social runtime, relationship/consequence, employment/service/transaction or subordinate-command owner as appropriate | Rich future vocabulary; broad executable social owner missing. |
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


## 4. Ecology coverage families

The location matrix above gives concrete scene examples. It is not the complete environmental taxonomy.

Use the authored ecology stack to test generalization across the following families:

| Environmental family | Authored examples | Contextual-action pressure | Key gates/modifiers |
| --- | --- | --- | --- |
| Open grassland | Steppe, Stormbound Prairie, Savanna, Alpine Meadow | travel, track/hunt, forage, camp, herd/work, seek water | drought, fire, storms, water, visibility, mount/load |
| Temperate/tropical forest | Taiga, mixed/deciduous/coniferous forest, rainforest, cloud forest | explore, forage, gather wood/plants, track, camp, climb | canopy/light, rain/snow, fire/blight, ownership, depletion |
| Wetland | Bog, marsh, swamp, fen, mangrove | wade/navigate, fish, forage, water/resource interaction | flood, miasma, insects, roots, soft ground, water quality |
| Coast/brackish | Estuary, tidal flat, shoreline, beach, tide pools | tide/current observation, fish/shellfish, wade, boat/landing, shoreline travel | tide, salinity, current, storm surge, rights, vessel draft |
| Freshwater | river, stream, seasonal creek, spring, lake, pond, rapids, riverbank | follow, cross, collect, fish, boat, inspect | flow, depth, flood, seasonality, water quality, crossings |
| Marine | reef, kelp forest, seagrass, current front, shelf break | sail, navigate, fish, dive/harvest later | waves, current, depth, storm, vessel, salinity |
| Desert/scrub | hot/cold desert, glass waste, dry scrub, chaparral, dune/dry wash/salt pan | navigate, seek water, forage sparse resources, camp, prospect | heat/cold, drought, storm, glare, water, fire |
| Polar/alpine | tundra, ice cap, alpine tundra, mountain pass, scree | shelter, traverse, climb, hunt/fish, camp | cold, whiteout, avalanche, crevasse, thin air |
| Subterranean | grotto, cave, cavern, tunnel, chasm, underground river/lake | enter, explore, navigate, climb, mine, water/resource interaction | light, air, cave-in, gas/mold, flooding, confinement |
| Disturbance | burn scar, windthrow, landslide, flood debris, dust bowl, blight | altered travel, salvage/gather, hazard avoidance, clear/repair later | recency, hazard, blockage, temporary resource/depletion |
| Geomorphology | cliff, escarpment, ravine, canyon, ridge, basin, sinkhole, rock spire | cross, climb, descend, follow, route around, prospect | slope, stability, weather, load, rope, mode |
| Supernatural | rift, ley node/line, corrupted ground, sanctuary, elemental zone | initially observe/avoid/traverse; later owner-specific interaction | knowledge, magical hazard, consequence owner, access |

Biome/habitat compatibility changes relevance and method. It does not by itself mint executable commands.

A future environmental resource implementation should prove at owner level that a command consumes **capabilities and observed target provenance**, not a fixed list of biome IDs. Steppe and Estuary are required regression examples because they stress different concerns from forest/creek: open-country water scarcity and mobility versus tidal/brackish/current/shore interactions.


## 5. Cross-domain command and owner census

This matrix supplements the location/environment matrix.

| Domain | Candidate contextual commands | Current evidence | Execution posture |
| --- | --- | --- | --- |
| Guild | clerk: apply/dues/report/service; examiner: trial; board/desk: Browse read view; posted card: Accept; guild broker: commission | 18 canonical guild identities with rich descriptive policies/services | Present clerk/station, membership, access, offer/contract execution and commissioning owners missing; future only. |
| Employment | browse work, apply/accept role, start/advance/pause/resume/cancel shift, report, collect pay | 58 workplaces, 208 job rows, 110 unique job ids | Job ids are local role vocabulary; employment/pay/attempt owner missing. |
| Crafting | station: select recipe and personally craft/repair; crafter or authorized guild broker: request commissioned work/order | 28 recipes, production chains, craft estimates and workplace capability | Personal process versus provider order are distinct; durable craft/item/order/transaction owners missing. |
| Resource | spot, identify, gather, forage, fish, hunt, trap, mine, quarry, harvest, butcher, dredge, salt, water | 121 skills, ecology/resource availability and 22 extraction methods | Resource instance/discovery/depletion/attempt owner missing. |
| Advancement | train, practice, attempt breakthrough/trial, checkpoint choice, retry | progression helpers and 4 trials | Pure/simple helpers exist; durable attempt/cooldown/event owner incomplete. |
| Knowledge | inspect, identify, study/read, consult archives, analyze, knowledge trial | domains/snippets/spot-identify skills and planning | Observation/knowledge evidence exists in parts; general study/trial commands deferred. |
| Magic | cast, study spell, teacher/institutional study, ritual study, request enchantment/healing | 55 spells, 32 abilities, known-spell/study/readiness planning | Narrow combat hooks exist; general study/acquisition/cast/service owners incomplete. |
| Services | observed provider/counter: eligible service; contract board/desk: Browse by default, select posted offer card for Accept | 5 service identities and 22 building templates/service functions | Provider-independent vocabulary does not prove station presence, offer listing, payment or acceptance owner. |
| Market/logistics | quote, buy/sell/barter, reserve, commission, personally load/unload/deliver/receive; autonomous dispatch is management | economy projections, routes, markets, transport profiles | Read-only/simulation foundations exist; transaction/shipment item/currency owners missing. |
| Business/property | physical inspect/use/store/repair/build when personally performed; administration opens Business/Property/Personnel/Ledger management | planning/projections/account estate surfaces | Broad runtime identity/control/ledger/project owners incomplete; management mutations are not Home world commands. |
| Social/NPC | greet/talk/ask, joke/compliment/flirt/apologize, negotiate/persuade, give, hire/recruit/dismiss, request aid/service/training, immediate subordinate order | future People/NPC and social boundaries | Canonical person/dialogue/relationship/memory/consequence mutation broadly deferred. |
| Religion/ritual | pray, offer, blessing, healing, oath/funeral/seasonal rite, doctrine study | religion/orders, sacred sites, religious hotspots, magic infrastructure | Current content explicitly non-executing; ritual/service owner missing. |
| Leadership/civic | immediate tactical/crisis order and counterparty negotiation; routine staffing, policy, edicts and coordination are management | settlement/leadership skills and civic planning | Skill is modifier only; direct commands require controlled target/authority; policy mutations belong in management UI. |

The architecture should model **one owner-backed loop at a time**. Do not expose commands from these rows merely because their content/projection inputs exist.

## 6. Social interaction affordance matrix

Social verbs are context-sensitive concrete interactions, not one universal `social.perform` command.

| Target/context | Candidate first-level actions | Likely deeper actions | Important gates/changes | Management boundary |
| --- | --- | --- | --- | --- |
| Stranger / passerby | Greet, Talk, Ask Directions | Ask About Place, Ask Rumors, Introduce Self | language/knowledge, disposition, urgency, privacy | none by default |
| Friend / familiar NPC | Talk, Joke, Ask, Give, Invite | Compliment, Thank, Apologize, Encourage, Request Favor | relationship/memory, current mood/activity, time | relationship overview may be UI, not command |
| Romance-eligible familiar NPC | Talk, Joke, Compliment, Flirt | Express Interest, Invite, later courtship actions | dedicated relationship/romance authority, consent/context | long-term relationship planning is separate UI if later needed |
| Merchant | Trade, Talk | Buy, Sell, Barter, Ask About Goods, Request Quote | stock, price, funds, reputation, hours | shop/business administration is not customer command |
| Employer / foreman | Ask for Work, Talk, Report for Work | Apply, Accept Shift, Ask Terms, Collect Pay | employment owner, schedule, tools/skills, vacancies | employer staffing/roster/wage policy is management |
| Guild clerk / authorized receiving officer | Talk, Apply to Guild, Pay Dues or Report Contract if eligible | Buy-in, inquire about membership, service, apprenticeship, arrange trial, present completion proof | observed authorized clerk, membership/dues, active accepted contract, evidence, issuer delegation, payment | officer roster, treasury, policy and facilities are management |
| Posted contract board / notice desk / counter | Browse Contracts **default read view** | Filter/select posting, open contract card (card then offers owner-backed Accept) | real station/listing and visible offer provenance, issuer/offer authority; selecting card does not mutate | board administration only where managed |
| Selected contract listing/card | View details, **Accept Contract** when eligible | Terms, requirements, reward, choice/confirmation if needed | offer instance, availability, capacity, access, current admission/retry; no duplicate offer | none |
| Crafter or authorized crafting-guild broker | Talk, Request Quote / Commission Work when supported | Define specifications, negotiate, pay/deposit, later collect | real provider, access, specification, order/payment/item fulfillment owner; not personally Craft | shop/workforce policy is management |
| Toll collector / gate official | Pay Toll, Present Papers, Talk, Turn Back | Ask About Route, Request Exception, later Bribe if law owner exists | exact toll, authority, papers, law, funds | toll policy/rates are authority management, not player command |
| Healer / trainer / service provider | Request Healing/Training/Service, Talk | choose treatment/lesson, pay, confirm risk/cost | service/provider/access/payment, skill/knowledge | provider staffing/service policy is management |
| Subordinate / crew member | Talk, Give Immediate Order, Warn/Rally | context-specific crisis/tactical order | authority, proximity/communications, capability, danger | role, shift, crew slot, wages, equipment policy via Personnel/NPC card |
| Hostile/rival person | Talk if possible, Challenge, Threaten | Insult/Taunt, Negotiate, Surrender demand | social/consequence/law/combat owners | none |

A useful concrete interaction may be **promoted** from a person's deeper interaction to first level: `Pay Toll`, `Trade`, `Apply to Guild`, `Request Healing`, `Ask for Work` or clerk-mediated `Report Contract`. Promotion never duplicates the underlying command owner. **Board selection defaults to Browse, card selection exposes Accept, and reporting returns to a real authorized recipient.** An informational Browse/card selection does not become a world command. See [interaction endpoint routing](contextual-interaction-endpoints-and-contract-station-routing-decision.md).
