# Area / Atlas Observation, Knowledge and Owner-Provenance Gate

Date: 2026-10-28
Status: **CONNECTOR-ONLY DESIGN AND SOURCE AUDIT; NO NEW LOCATION, MAP, SCENE, ACTION, COMMAND, CONTENT, SAVE, UI OR GAME-VERSION AUTHORITY**
Source: selected `master` `a596112acf3945f2bf7c625e943f2511d12aa710`. Native v3 selected activation still held on separately stacked PR #44 `022fe22def299cf9fc357058a0214e83875af24b`.
Companions: [Area / Atlas source-to-action preflight](area-atlas-text-first-gameplay-surface-and-command-source-map-2026-10-28.md) and [Area / Atlas navigation wireflows](area-atlas-navigation-wireflows-state-matrix-and-ui-acceptance-2026-10-28.md).
Precedence: [Local Scene / Context Projection](local-scene-context-projection-decision.md), [Contextual Player Action](contextual-player-action-and-command-architecture-decision.md), [UI IA](ui-information-architecture-boundary.md), and narrower current owners. **This is the evidence/fidelity part of the proposed UI, not a change to those authorities.**

## 1. Central question and recommendation

What can a text-first Area honestly describe as **here**, and what can Atlas honestly show as **known elsewhere**, when the selected game's location has coarse settlement/site fields, known-location markers and an authored nearby-encounter context, but not a general persistent local person/building/resource/vehicle-instance graph?

**Candidate display rule:** a target gets a player-facing affordance only through the owner that proves its identity, character-relative disclosure and actual current action. Keep five separate questions: (1) does the source exist? (2) may this character know or observe it? (3) is it actually *here / reachable*? (4) is any concrete action admitted? (5) what can safely be disclosed about a rejection? The answer to one cannot imply the other four.

No generic "show everything in region", "one map pin = visible entity", or "all catalogue verbs available" shortcut. The **read projection** should return fewer truthful things rather than an attractive but invented simulated scene. This can still be satisfying: actual location, current purpose, verified danger, present bodily condition, one legal Explore, candidate encounter, current activity and distant route choices are already meaningful gameplay.

The proposed observation tiers below are **display concepts**, not new persisted enums or authorization tokens:
- **Current/verified:** a current accepted owner fact (location, active encounter, owner-admitted current activity) with correct identity and view provenance.
- **Observed nearby:** owner-provided player-visible target bound to actual locality/current head. Currently narrow: accepted nearby candidate and active encounter, not every authored world record.
- **Known remote:** discovered location or supported Knowledge reference with no implication of here/reachable/visible now.
- **Descriptive/uncertain:** authored region/ecology/market or future rumor, clearly labeled as background rather than observed object; a rumor requires a real source, not prose invention.
- **Hidden/unresolved:** not observable, secret, unsupported, stale or malformed; omit target-specific information/actions or show generic safe guidance without leaking identity.

## 2. Current selected-source truth table (not implementation permission)

| Selected source / actual fields | What it can establish | What it does **not** establish | Candidate Area/Atlas treatment |
| --- | --- | --- | --- |
| `playerState.location`: `settlementId`, `siteLabel`, `worldMapId`; separate `playerState.regionId` | Current coarse settlement/site display anchor when internally consistent | Actual interior, hex, precise coordinates, within-reach bridge, station or resource | Area current-place label; if ambiguous, say so and avoid precise scene claims |
| `getCurrentPlayerTravelLocationId(snapshot)` in `player-travel-rules.ts` | One of the first-loop mapped current travel identities | Universal canonical place mapping or actual current position inside a settlement | Current Atlas marker only when exact mapped ID matches admitted known marker |
| `sessionState.knownLocations[]`: `id`, `name`, `regionLabel`, `settlementId?`, `regionId?`, `type`, `x/y`, `note`, `known` | Known/unknown flag on a location record, a map *presentation coordinate* and authored description | Exact current site, physical reachability, room/building, discoverable action or valid route | Atlas discovered-place view; hide undiscovered details unless another owner explicitly discloses them |
| `uiViewModel.world.locations` and `world.lists['world-map']` | Currently projects records from `knownLocations`, with display names and pins | A visibility filter or action legality check | **Current disclosure review required**, see finding G-01 below |
| `resolvePlayerTravelPlan` / `previewTravelToKnownLocation` | Bounded allowed/denied destination, origin, travel facts, body forecast | Permission to infer a route from `x/y`, generic map lines or knowledge alone | Atlas owner-backed travel outlook; denial reason without unsourced destination details |
| `resolveNearbyExplorationPlan` | Current one-tick, 2-stamina plan if geography/catalog/known anchor coherent | A specific currently observed creature, tree, river or usable tool | Area "Explore Nearby" when legal, explicit uncertain encounter outcome |
| `worldState.nearbyExplorationContext` and `nearbyExplorationCandidate` | Retained exploration source and candidate after accepted exploration | Already admitted active combat, or a freely visible exact creature/location independent of context | Area candidate/signs card; separate Approach owner admission |
| `gameState.activeEncounter`, `listLegalPlayerCombatCommands` | Active encounter and owner legal combat action set | A full tactical map, always legal escape, or additional NPC commands | Modal Area encounter with only available owner commands/continuation |
| `sessionState.currentActivity` and `activityRecords` | Current label/record and selectable activity record IDs | Durable generic work attempt, workbench present, future resumability | Area status/read-only link to Activity owner |
| `sessionState.questJournal`, tracked quest ID | Quest progress/owner-eligible quest action at its own boundary | Present guild clerk, board, quest NPC, valid local turn-in representative | Area objective link; Quests owner decides actual command |
| `sessionState.worldRecords` (region/market/trade-route etc.) | Authored or displayed record lists and details | Real shop stock, passing caravan, functional route, immediate physical service | Atlas/World descriptive inspection only |
| `sessionState.codexEntries` / Codex `atlas` | Reference and Knowledge owned record | Map travel authority or exact live local entity | Cross-link, distinct from World Atlas's travel inspector |
| `worldState.weatherState`, authored climate/ecology | Weather owner data where interpreted; static broad ecology | Local current weather/river/wildlife from arbitrary generic record alone | Display only fields an approved interpreter validates |
| PR #40 future carrier/tool reviews; PR #44 unselected native gear | Future design and candidate engine behaviors | Selected wearable mounts, local tools, v3 selected action support | Do not activate via Area controls or infer shop inventory |

### Finding G-01: possible undiscovered-map information disclosure

At selected `master`, `apps/rpg-ui/src/runtime/uiViewModel.ts` constructs `mappedWorldLocations` using **all** `snapshot.sessionState.knownLocations.map` entries and includes `name`, `x/y`, `note`, `known`. It also constructs World Map list rows from **all** records, including `title: location.name` and `description: location.note`. `apps/rpg-ui/src/features/WorldPanel.tsx` draws a button and display name for **each** `worldData.locations` entry. Its Travel button later checks `!selectedWorldLocation.known`.

This **is a source-visible display path** for undiscovered records if the session contains `known:false` entries with nonpublic names/notes/coordinates. It is **not proof** that such entries exist during an ordinary selected run or that a player currently sees a secret; inspect real selected fixture/content, and run a focused negative test before classifying a production disclosure defect. The `known` gate on Travel is insufficient by itself to guarantee *information* safety.

**Prospective fix policy, not code:** Atlas should include only locations with explicit readable visibility; unknown marker existence, name, coordinate and note must not be revealed simply because an entry is in the array. If a separate source explicitly supports rumor/approximate region disclosure, render only that source-backed abstraction. Do not create a "??? pin" at an exact hidden coordinate when even existence is not known. An explicit owner/observation decision must settle whether `known:false` means "unknown and hidden" or "encountered but not fully identified"; current boolean cannot encode all visibility grades.

### Finding G-02: bounded travel resolver, not free map navigation

`getCurrentPlayerTravelLocationId` in `player-travel-rules.ts` currently maps:
- `settlement.aurelis` → `location.saltmere`;
- `settlement.stonevein` → `location.westreach`;
- `settlement.starfall_port` → `location.ashen_reef` only for the supported `siteLabel` values `Survey Anchorage` or `Ashen Reef`; otherwise `settlement.starfall_port`;
- `settlement.sunspire_reach` → `location.crown_bastion`;
- otherwise `null`.

These aliases are **current first-loop implementation facts**, not a future generalized Atlas naming scheme. Travel acceptance checks coherent `capturedAtTick`, a recognized origin/destination, exact `known` destination and not already at destination. `PLAYER_TRAVEL_DESTINATIONS` is a bounded map; the Atlas pixel positions cannot add a travel route. The presentation must not translate a readable `siteLabel` into a fabricated canonical interior/site ID.

### Finding G-03: exploration context is not observed terrain

`resolveNearbyExplorationPlan` requires one matching authored nearby action context, coherent settlement/region/hex/edge anchors, supported foot traversal, one known matching location and valid hazard-source provenance. On acceptance, the encounter candidate is an *observation* which then needs a separate admission path to active encounter. Consequently Area may say "an authored nearby approach can be explored" or "signs of danger were found" as the **owner actually reports**, but cannot create a precise forest landmark, adjacent enemy coordinate, harvestable spring or local map geometry from that context. A generic habitat tag is not an observed physical target.

## 3. Minimum read-projection *review checklist*, not a new data model

An eventual implementation may use a small selector/view-model helper, but its output must remain a **computed read projection** of the current admitted snapshot and content version. Do **not** persist the following illustrative shape as a schema or feed it back to admission:

| Field family / question | Expected evidence in the presentation | If absent |
| --- | --- | --- |
| Source fence: which admitted campaign snapshot/head/tick? | Read from current selected campaign control and snapshot; no privileged rerouting | Recompute / leave commands disabled, do not mint head |
| Place anchor: which canonical *current* place is known? | `playerState.location` plus validated owner mapping and consistency | General location label or "Location unavailable"; no false local marker |
| Perceived subject: what target was actually observed? | Existing accepted encounter/candidate, real activity or future independently defined entity owner | Omit target-specific row; show inspection/context only |
| Remote knowledge: which disclosed destination is known? | `knownLocations` explicit readability and future knowledge owner if present | Do not show exact marker, name, note or coordinate |
| Relationship to player: here / near / remote / unknown? | Owner context, never map-pixel distance or string match | Label "known location" without local presence implication |
| Concrete command: which exact action & target? | Engine/domain command identity and owner plan; no inferred action from noun/class | Informational navigation instead of executable button |
| Availability and why blocked? | Current resolver/owner rejection, filtered for public observability | Omit or generic supported guidance without hidden cause |
| Preview: time, cost, risk, consequence | Owner-supplied exact/forecast information and warning | Show "not available" or "unknown", never fabricated numerical certainty |
| Result evidence: what happened? | Accepted owner result, campaign admission, retained receipt where defined | No success toast or local state prediction |
| Origin reference and confidence | Authoritative source category and known/observed state | Do not say "seen here", "nearby" or "you can use" |

Source classification is a **consumer concern**; it is not permission to introduce a universal `LocalSceneContextState` in `SaveSnapshot`, persist "visible action descriptors", mint GUIDs for a station, move a character or change content. It is specifically intended to help local UI implementation avoid an identity and disclosure anti-pattern.

## 4. Five evidence-first Area/Atlas scene recipes (hypothetical snapshots, not test executions)

### S1: Ordinary settlement and valid nearby approach
- Known: selected `playerState.location.settlementId`, readable known destination, coherent `resolveNearbyExplorationPlan.available=true` (1 tick, 2 stamina).
- Area: present supported current place, one relevant `Explore Nearby` action with cost/outlook. Rest only if current rest owner also admits; do not invent an observed inn.
- Atlas: discovered destinations by exact known-location ID; selected destination may show owner travel preview.
- Not licensed: a forageable berry patch, guild hall employee, market stall or world-hex crossing command just because region catalog mentions them.

### S2: Exploration has produced a retained candidate
- Known: `worldState.nearbyExplorationCandidate` after accepted Explore, current head and matching `nearbyExplorationContext`.
- Area: "signs of hostile danger" and one `Approach` affordance, through exact `admitNearbyEncounter`.
- Not licensed: showing an active combatant, loot, a free target selection or a guaranteed encounter result. On failed/rejected admission, refresh and keep honest candidate status.

### S3: Combat is active
- Known: non-null `gameState.activeEncounter`, legal combat commands from `listLegalPlayerCombatCommands`.
- Area: owner-combat state, available commands with actual target/cost, continuation when supported, latest accepted result.
- Other panes may remain navigable as read/reference but should not advertise parallel Travel/Rest as in-scene executable shortcuts. Do not assert new global engine restrictions without executable owner proof.
- Not licensed: a grid battlefield, universally available retreat, speculative enemy intention or a fourth action not returned by the owner.

### S4: Known distant destination but no admitted travel route
- Known: readable destination in `knownLocations`, but `resolvePlayerTravelPlan.accepted=false` due to unsupported path/origin/other source condition.
- Atlas: named known location only to authorized disclosure level, read-only detail, owner-origin travel denial. The Map can depict a discovered place without pretending there is a traversable route.
- Area: remains current place; selecting a marker cannot alter `playerState.location`.
- Not licensed: interpolating a road from map coordinates or making the location a nearby person/service.

### S5: Incompatible, missing or undiscovered source
- Known: no mapped current location, stale `capturedAtTick`, `known:false` destination row, or unselected/mixed-format save requiring selected account owner handling.
- Area: safe, minimal current-state notice, owner-approved load/recovery path if any; no invented current target.
- Atlas: hide undisclosed destination details, do not reveal exact coordinates of unsupported map records.
- Not licensed: auto-convert development saves, invent station presence or treat a v3 draft snapshot as current selected gameplay.

## 5. Visibility, action and error-policy matrix

| Input situation | Visible presentation | Action posture | Safe error/disclosure |
| --- | --- | --- | --- |
| Exact current place recognized | Place name + owner-supported context | Owner-derived only | Explain when plan unavailable |
| Site label present but no canonical local site ID | Literal display label as a *label*, not a selected target | No site-specific command | "Site interactions unavailable" if a relevant action was attempted |
| `known:false` destination with private name/coordinates | Omit exact identity; maybe a generic unexplored-region summary *only if independently sourced* | No travel/inspect action using hidden ID | No hidden name/price/route leakage |
| Known location, unsupported destination in engine | Disclosed location card, owner "route unavailable" | Disabled explained or omitted travel | Do not claim destination does not exist |
| Nearby action plan denied for low stamina | Actual public stamina blocker | Blocked explained | "Requires 2 Stamina" from owner |
| Nearby authored context absent | No implied physical forest/shore/monster | Omit unsupported Explore | Plain "No nearby exploration is authored here" where safe |
| Accepted nearby candidate, no active encounter | Signs/candidate source, no combatants | Approach if currently admitted | Stale candidate rejection is not a fight |
| Active encounter, no current legal combat commands | Combat situation + owner-supported advance/disabled state | Combat priority | No guessed target/method |
| Quest record points to issuer not observed | Objective link in Quests | No direct "Speak to clerk"/"Turn In Here" | Missing actor is not proven to be near |
| General climate, guild, service, recipe or feature record | Descriptive regional knowledge only | No invented source-specific verb | Explain that a local provider/instance is not established |
| Changed selected snapshot/head during inspector | Recompute observed targets and previews | Clear risky confirmation | Current owner denial; no stale execution |
| Native v3 candidate not selected | Preserve selected app behavior | No prototype owner action exposure | No old-save conversion/claim of v3 operation |

## 6. Risk-ranked implementation readiness and unresolved owner decisions

| Risk | Verified evidence | Why it matters | Required future owner decision |
| --- | --- | --- | --- |
| **G-01 high / needs negative test** | `world.locations`, World Map rows and map buttons are built for all `knownLocations`, while Travel gates `known` | Potential leakage of undiscovered identity through UI | Define meaning of `known:false`; test masked map/list/inspector, then repair if needed |
| **G-02 high / route truth** | Travel resolver has bounded explicit destinations and origin mappings | Map geometry may falsely imply travel command | World Atlas must always use owner travel plan |
| **G-03 high / local truth** | `PlayerLocationState` has only coarse fields | Dangerous invented "nearby" object interactions | Future local target/observation owner, not UI-local IDs |
| G-04 medium / encounter distinction | Candidate and active encounter are distinct persisted fields/owners | Premature enemy visibility / wrong combat actions | Preserve staged Explore → Approach → Combat |
| G-05 medium / feedback clarity | Current panels show generalized summaries/toasts and distinct owner callers | User may mistake read-only status for action acceptance | Surface authoritative owner result and safe recheck |
| G-06 medium / cross-format | Selected app v2, unselected PR #44 native v3 | Prototype may accidentally bypass v3 activation | Select format atomically or keep current v2 path |
| G-07 medium / reference Atlas | Codex `atlas` and proposed World Atlas have different meanings | Navigation/action confusion | Keep Knowledge-only reference cross-link |
| G-08 low / environmental flavor | Habitat/region catalogs have rich descriptive data | Art/prose may imply localized nodes | Prefer regional context with explicit uncertainty |

**Decision deliberately *not* made:** future observation/line-of-sight rules, local grid coordinates, fog-of-war storage, actor generation or station instance schema, universal discovery grades, economy stock simulation, quest service endpoints, player-initiated unlawful actions, bridge crossing or a persistent general activity owner. Those require separate canon/owner/capability passes, not a World UI preference.

## 7. Prospective evidence-driven acceptance matrix (not executed)

| Case | Controlled source/setup | Owner/view expectation |
| --- | --- | --- |
| AO-01 | One `known:false` location with nonpublic unique name/coords/note | World Atlas map/list/inspector do not reveal exact hidden identity |
| AO-02 | `known:false` destination next to `known:true` | Hidden row does not shift current selection to first hidden map pin |
| AO-03 | `known:true` destination with unsupported travel resolver | Detail is visible as known; Travel is blocked with owner reason |
| AO-04 | `known:true` destination where destination is same as origin | No travel mutation; "already there" from owner |
| AO-05 | Different origin, same known destination | Travel preview comes from actual current origin, not map distance |
| AO-06 | `siteLabel` names site without site ID | Display remains coarse; no fabricated building/site target action |
| AO-07 | `settlementId` unmapped to current travel location | No current-map marker fabricated at guessed coordinates |
| AO-08 | `capturedAtTick !== clock.tick` | Exploration/travel plans fail closed; Area does not execute |
| AO-09 | Insufficient stamina for exploration | Explain current 2-stamina requirement, no action tick |
| AO-10 | Nearby context fails one coherence check | No inferred nearby action/feature from catalog alone |
| AO-11 | Explore allowed, no spawn candidate produced | One accepted Explore cost and truthful "none found"; no forced encounter |
| AO-12 | Explore produced candidate | Candidate shown as signs/approach, not active combat target |
| AO-13 | Candidate source/head changed before Approach | Admission owner rejects; no duplicate encounter |
| AO-14 | Active encounter with legal combat command | Correct owner command/target/cost only, no phantom actions |
| AO-15 | Active encounter with no legal immediate command | Honest continuation/wait posture from combat owner |
| AO-16 | Quest available but issuer not currently observed | Quest entry/link exists, no invented present clerk/board |
| AO-17 | Authored forge/market exists but no local station/stock owner | Reference only, no interactive Craft/Buy |
| AO-18 | Activity record exists but no durable work attempt | Show current activity/owner link; no fake cancel/resume |
| AO-19 | Text describing creek and valid fishing gear but no observed water target | No Drink/Fish/Fill at invented local site |
| AO-20 | Native v3 draft scenario presented under selected v2 | No native gear action or premature v3 read admission |
| AO-21 | Snapshot/head changes while risk confirmation open | Confirmation clears and preview recomputes |
| AO-22 | Same visible label for two exact known destinations | Target IDs stay distinct; no label-based routing |
| AO-23 | Switch Area ↔ Atlas ↔ Codex Atlas without command | No tick, receipt, location or knowledge mutation |
| AO-24 | Incompatible/rejected Load or account recovery | Safe recovery UX, no fabricated current scene |
| AO-25 | Screen reader and keyboard-only Atlas view | No invisible pin-only route; same read-only list information |
| AO-26 | Narrow portrait and landscape side nav | Hidden information remains hidden on both map and list layouts |
| AO-27 | An area hint becomes stale after known-place discovery change | Recompute owner/visibility; do not reuse snapshot-cached descriptor |
| AO-28 | A future guild board record but no observed station instance | No Browse/Accept world action; link to static institutional info only |

Do not mark AO rows passing until Codex/local checkout creates red-first selected-owner tests, with real browser/restart or controlled fixture evidence clearly distinguished. The 28 cases extend the companion AA/AW test designs; they are not deployed gameplay tests or a new generalized schema test suite.

## 8. Connector disposition and next named consumer

This pass should add **one Markdown document** to independent draft PR #45 and update its description, preserving the two earlier source/interaction design documents. PR #45 remains **HOLD_NAMED_CONSUMER** while selected native v3 atomic activation and UI integration are held. PR #40 remains independently held on carrier/station/tool planning. No branch retarget, merge, coordination-register edit, master edit, app UI update, Code/Content/Save migration or game-version increment.

**Practical next implementation preflight when the hold clears:**
1. Source-backed `known:false` negative disclosure fixture and actual selected run readback.
2. Read-only Area selector returning current place + candidate/encounter/activity + owner plans, with no persistence.
3. Atlas map/list parity using only disclosed known places and owner-supported travel preview.
4. Exact current caller routes only, once native selected state/Save and UI owner accept them.
5. Later real local scene identity/observation owner for entities, stations, resources and contextual rights.

Source paths read from selected master: `packages/shared/types/src/contracts.ts`; `packages/engines/game-engine/src/player-travel-rules.ts`, `player-nearby-exploration.ts`, `player-nearby-encounter.ts`, `player-quest-acceptance.ts`; `apps/rpg-ui/src/runtime/uiViewModel.ts`, `GameSessionContext.tsx`, `nearbyExplorationCaller.ts`; `apps/rpg-ui/src/features/WorldPanel.tsx`; accepted local scene and command decisions. This document contains no new executable source, test, schema, fixture, migration, gameplay action, or side effect.
