# Contextual Player Action And Command Architecture Decision

Date: 2026-10-19
Status: **ARCHITECTURE DEFINED; IMPLEMENTATION NOT YET AUTHORIZED**. Unversioned parallel design. Source head `bc66a5460c7a77b12b4eda997749ad42a620c554`. The installed Ordinary Combat Basic Action Selection Repair remains the active executable route.

## 1. Authority and pipeline

This decision extends the accepted [contextual inventory/crafting/trade surface](contextual-action-surfaces-inventory-crafting-and-trade-decision.md), [UI boundary](ui-information-architecture-boundary.md), [local scene decision](local-scene-context-projection-decision.md) and [owner/affordance matrices](contextual-player-affordance-and-owner-matrices.md). Current combat, travel, quest, item and activity owners retain their more specific accepted contracts. The temporary audit input supplied candidate cases, not authority.

Authoritative domain state and character-relative observations → local scene projection → domain-contributed affordances → contextual ranking/presentation → selected concrete command and target → **domain owner revalidation and execution** → accepted result, owner mutation and history. Campaign-session admission remains the publication/fencing boundary where the current caller uses it. No monolithic generic command engine, UI-owned legality or cross-domain mutation is created. A descriptor is a view of one invocation, never a capability token. If the owner has no executable command, the UI may show an informational link but must not imply a playable action.

The character is classless at the command layer. Profession, skill and history can rank or modify an action. They cannot globally suppress trade for a warrior or combat for a trader. Genuine method/knowledge/authority gates remain domain owned.

## 2. Action identity, family and compatibility

Three independent notions are required:

| Notion | Purpose | Rule |
| --- | --- | --- |
| Concrete executable command identity | Selects exactly one owner operation and its command contract | Stable within that owner's versioned contract; never replaced by a family match or display label. |
| Family/category | Groups discoverability and presentation | Many concrete commands may share one family. Grouping cannot silently choose one, alias away another or alter the payload. |
| Compatibility/effect tags | Selects applicable equipment, skill, modifier or effect logic | Tags may match several commands but cannot change command identity or legality by string collision. |

The current selected combat gap makes this mandatory: `combat.attack.melee.basic`, `combat.melee.primary` and `combat.interrupt.shield_bash` are distinct commands. `combat.melee` is a family; `melee`, `sword`, `shield`, `interrupt` are potential compatibility meanings only where the combat owner confirms them. The active combat repair resolves the live collision; this document does not repair or rename it. The same distinction later applies to `Gather` versus deadwood/berries/water, `Travel` versus bridge/ford/sail, `Craft` versus recipe/process, `Trade` versus buy/sell/barter, and `Farm` versus plow/sow/water/weed/harvest. These examples reserve no production IDs.

Descriptor identity is the stable **presentation key** for the same owner + concrete command + target + method/source context in one scene. A pending choice may use a family-level entry only as an expansion launcher; once resolved it invokes one concrete command. Invocation IDs, attempt IDs, request IDs and result IDs remain domain/campaign identities; do not use a descriptor key for idempotency. Synonymous labels from one owner can be coalesced only if the exact command/target/method/payload semantics agree. Different owners' commands on one target remain separate.

## 3. Minimal contextual action descriptor

A read-only descriptor contains: presentation identity; owner route and concrete command identity (or an explicit unresolved expansion); family; human label/verb; observable target reference and source context; owner-derived availability; interaction shape; ranking group/priority; and an owner-supplied invocation handle or input requirements. Optional structured previews include known duration, resources/currency, risk and consequences, each with exact/estimate/unknown provenance. Optional expansion supplies owner-backed target/method/quantity/recipe/destination choices, refreshed on selection. Blocked descriptors carry a concise safe reason. No speculative universal payload seed, arbitrary sub-action provider registry, new persistence schema or central legality formula is frozen here.

The UI may render, filter, sort, focus, confirm and invoke. It must not infer a command from a label, assemble a privileged payload from hidden state, calculate cost/damage/yield or convert a preview into acceptance. On invocation, the domain owner checks current head/tick, target, permissions, timing, resources and conflict; rejection refreshes the scene and shows the owner reason. UI confirmation acknowledges known risk but never bypasses owner admission.

## 4. Availability, gates and disclosure

Shared player-visible states are `available`, `available_risky`, `blocked_explained`, and `omitted`. The fourth is a projection choice rather than a disabled command. A visible blocker requires an observable target/opportunity and a useful safe next step: “Chop Tree — Requires axe”, “Harvest — Crop not ready”, “Use Forge — Requires permission”. Unknown/hidden features, unsupported systems and unrelated verbs are omitted. A blocked label must not reveal a secret door, concealed foe, unknown recipe, exact hidden stock or hidden law enforcement state.

Skills normally modify success, yield, quality, duration, stamina, injury risk, information, methods or complexity; a novice may attempt physically possible work if its owner permits. Hard gates cover real impossibility or authority boundaries, such as absent cutting tool, no controllable vessel, unknown spell, required station absent, or no legitimate property-management right. Law and ownership are separate from physical possibility. An unlawful action can be `available_risky` with an explicit legal warning **only after** a crime/social/consequence owner exists. Where that owner is missing, do not advertise an executable illegal path. Body state, load, injury, current danger, weather and depletion may alter method, preview, availability or ranking through their owners.

## 5. Interaction shapes and activity

`direct`: one meaningful interpretation and all required target facts are already selected. `expand`: a real target, method, quantity, recipe or destination choice remains; no fake one-item submenu. `activity`: the selected owner operation consumes time and can progress, pause, interrupt, fail or complete. `confirm`: the choice is otherwise clear but unusually dangerous, illegal, expensive or irreversible. These are presentation stages, not mutually exclusive command kinds: Expand → Confirm → Activity is valid. Avoid confirming every routine cost.

A single button may **start** an activity but cannot make it instantaneous. The activity owner controls accepted ticks, expenditure, yield, depletion, partial completion, pause/cancel/resume, interruption and durable attempt identity. Travel, combat, fatigue, weather and world events invalidate pending previews; their owners arbitrate whether an activity continues, pauses or fails. The current `sessionState.currentActivity` is a small display record, not proof that generic resumable activity semantics exist. Future long work needs a dedicated owner contract and restart/retry tests before presentation advertises resume.

## 6. Normalized action taxonomy

Taxonomy is a discovery vocabulary, **not** a permanent engine enum. Owners issue specific command types only after implementation.

| Family | Player-facing examples and relationship |
| --- | --- |
| Observe | Look Around, Inspect, Search: label may vary by target; inspecting another's goods adds transaction permission. Search can become timed activity. |
| Navigate | Move, Travel, Follow, Enter/Exit, Cross, Climb, Swim/Wade/Ford: route, crossing and mode are concrete owner choices, not synonyms. |
| Interact with world | Explore, Gather, Forage, Cut/Fell, Mine/Dig, Track/Hunt, Fish, Collect Water: resource/target/method commands are distinct; existing Explore is narrower than this future family. |
| Survive | Camp, Rest, Sleep, Build Fire, Cook/Prepare: current settlement Rest exists; camp/fire/sleep/cooking require their own owners. Cooking remains crafting/process owned. |
| Produce/work | Craft, Repair, Operate, Perform Work: recipe/process, station and work-order operations remain separate. |
| Transport | Board/Disembark, Mount/Dismount, Pilot/Row/Sail, Dock/Moor/Anchor, Load/Unload: vessel/vehicle/control and cargo owners are missing. |
| Social/economy | Talk, Ask/Inquire, Browse, Trade, Seek Work, Offer/Give: conversation, stock view, transaction and transfer have distinct authority. |
| Farm/property | Farm, Tend Animals, Manage Property, Build/Improve: plot-stage actions and legitimate management/project rights are distinct. |
| Items | Take, Drop/Place, Store/Retrieve, Equip/Ready, Eat/Drink/Use: selected item context is invocation, not nutrition/transaction authority. |
| Quest/contract | Accept, Track/Untrack, Report/Turn In: each is an existing or future quest-owner operation, not a global quest menu permission. |
| Hostile/risky | Steal/Pickpocket, Lockpick/Force, Trespass/Sneak, Engage/Attack, Flee/Disengage: separate crime, access, encounter and combat owners must exist before playability is claimed. |

## 7. Home / Current Situation consumption

Home is the default re-entry action surface described by the accepted UI boundary, not a seventh equal domain or a static dashboard. It answers **Where am I? What is around me? What is happening? What can I do now?** Its first screen shows current place/time and uncertainty, current activity or encounter, an optional tracked objective, selected nearby entity/resource, two or three high-value primary actions and a small number of meaningful blocked actions. A compact “More actions” route exposes **all currently legitimate observed** actions, with family grouping and keyboard/controller/screen-reader access; the six domain panels remain deeper information and management views. “All” never means hidden or unimplemented commands.

Rank deterministically after owner availability: immediate danger and active encounter first; then selected target, current activity/urgent obligation, tracked objective, current place and nearby opportunity; then recent use and capability relevance. Profession/knowledge is a weak relevance input, not a permission filter. Show a stable reason for promotion where helpful and avoid reshuffling while a target picker or confirmation is open. Selected target/context refreshes descriptors. Completing or rejecting a contextual flow returns to the recomputed Home situation with focus restored near the originating action; opening a full domain panel preserves a return path. Presentation state such as open menus and ranking remains ephemeral.

Previews state what the character can reasonably know: destination, time/tick estimate, known stamina/material/currency costs, capacity, tool/station, visible threat, legal/trespass warning and body strain. Mark uncertain risk/yield honestly and hide secret rolls, undiscovered entities, exact unseen stock and private simulation values. After execution show accepted/rejected result, spent resources, state change, partial progress and history links. Combat in particular needs visible target HP/status and applied damage/progression feedback where observable, plus distinct action costs and timing; the present selected UI's action labels/costs alone are insufficient for tactical choice. The combat owner supplies those outcomes, respecting hidden enemy information.

## 8. First integration and later loop

After the **current combat repair**, independent encounter victory/choice acceptance and a separate Game-version decision, the smallest implementation package is **Home / Current Situation + shared read-only scene/affordance resolver over existing production commands**. Include: known-location Travel, nearby Explore, Approach accepted candidate, owner-listed legal combat actions and Continue, current-settlement Rest, quest Accept/Track/Untrack and accepted Soundings Submit, selected inventory Equip/Unequip and Use Consumable. Preserve each caller/owner route and campaign admission. Exclude generic Turn In beyond its current bridge semantics from a claim of accepted durable quest completion; exclude arbitrary Look Around/Search, local movement/crossing, gathering, crafting, trade, farming, property, vessels, crime and generic activity. A pure informational “Look around” scene refresh may be a UI affordance but is not a new gameplay command or discovery mutation.

Acceptance checks: selected current place/observable context, target-sensitive relevant list and all-actions route; each existing command retains exact concrete identity, preview/gate and owner result; combat choices do not collapse by family; direct/expand/confirm/activity presentation works for the included commands; accepted/rejected actions return to recomputed Home; save/load/full restart reconstructs the same owner-backed scene/action list at the same game head. Test real callers, stale/rejected command refresh, hidden-info disclosure and keyboard/focus behavior. Do not persist descriptors or introduce a new gameplay owner in this slice.

The separately bounded first **new** sandbox loop candidate is environmental resource interaction: observed forest/creek resource → selected deadwood/plant/water method → tool/skill/permission/body/time check → accepted yield and depletion → durable inventory → one simple hand/station recipe use. Start with one or two actual authored resource instances and one material/process; require resource instance/depletion, observation, inventory and crafting owners before implementation. This covers scene identity, knowledge, time, permissions, output and persistence more directly than paid work (needs employer/economy), merchant trade (needs stock/pricing/transaction and counterparty), or farming (needs plot/season/crop/property lifecycle). It is a recommendation, not an installed implementation route.

## 9. Deferred owners and sequencing

Unresolved: exact local position/interior/vehicle identity; nearby observable entity/resource instance registry; dynamic weather/light and local depletion; ownership, law/crime and illicit consequences; generic item-instance/transfer/container and full consumption owner; station/recipe production; merchant stock/transaction; NPC social/offer; work/employment; farming/animal/plot; property/building/projects; mounts/vessels/cargo; camp/survival; generic timed activity and interruption; non-Soundings quest completion migration. Accepted static data is not proof of executable owners. Each requires its own bounded contract/schema and real caller before action exposure.

Sequence: current combat repair → independent encounter victory/choice acceptance → separate Game-version decision → accept this architecture → first existing-command Home slice → structural UI overhaul consuming these same descriptors and owner routes → first new resource loop → broader Game `0.2` vertical-slice work. This package does not change `GAME_VERSION`, active prompt, combat, epoch persistence, deployment or held branches.
