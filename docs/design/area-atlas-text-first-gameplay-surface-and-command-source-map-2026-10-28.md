# Area / Atlas Text-First Gameplay Surface and Source-to-Action Preflight

> **2026-10-29 owner-direction supersession (design-only):** The `World → [Area] [Atlas]` sibling proposal, second World Atlas, and cold-load Character-as-future-target ambiguity in this historical preflight are **SUPERSEDED** by the explicit user direction in held PR #24: **Current Area is the default gameplay/re-entry surface, with no separate Home or old World submenu; broader known geography belongs in the existing `Codex → Atlas`**. Preserve the source maps, evidence, prospective tests and owner restrictions, adapting navigation-dependent examples. Read `area-atlas-owner-direction-and-source-to-consumer-reconciliation-2026-10-29.md` **first**. No selected UI changed; no Codex source/Save/implementation acceptance is inferred.


Date: 2026-10-28
Status: **CONNECTOR-ONLY DESIGN PREFLIGHT; CANDIDATE PRESENTATION DIRECTION; NO ACCEPTED NAV CHANGE, SCHEMA, COMMAND, GAMEPLAY, UI, SAVE OR ACTIVATION AUTHORITY**
Repository: `vagabond1215/Lineage_Reforged`
Selected master source: `a596112acf3945f2bf7c625e943f2511d12aa710`. Unselected native gear chain latest inspected PR #44 `022fe22def299cf9fc357058a0214e83875af24b`, on PR #43. This preflight does **not** consume a selected v3 cutover or infer such a cutover has passed.
Proposed branch posture: `HOLD_NAMED_CONSUMER`, future contextual World/Area/Atlas presentation owner **after** native selected Save/restart and the current UI stack acceptance gates. No Game version impact. No site deployment.

## 1. Why this design pass, rather than one more feature catalog?

**Recommendation for review:** make the **current local situation** the game's primary moment-to-moment interaction surface, and make a broader **Atlas** its planning/route/knowledge lens. Both should remain text-first, supported by restrained map/illustration assets, with actual actions sourced from their own owners. **This is a candidate IA resolution**, not permission to replace the current World navigation or to add another authoritative position model.

The current client presents an extensive `World` record browser with a **World Surface** grid/map placeholder, six independent World sublists and three distinct persistent action blocks. In `WorldPanel.tsx`, Nearby Exploration, Nearby Encounter and Travel Actions appear in the same main pane rather than as a resolved `here → observed target → available action` context. `ActivityPanel.tsx` separately owns Shift/Rest surfaces; `QuestsPanel.tsx` owns quest acceptance/tracking/turn-in. This is technically honest but makes the player assemble the immediate situation from multiple menus. The separate Codex `Atlas` already shows geographic Knowledge; it must not be confused with travel authority.

The strongest leverage is **not** to write more hypothetical commands. It is to establish a presentation contract that can reuse current travel, nearby exploration/combat, quest and activity owners, preserve a coherent return path, and later admit real NPC, station, terrain and resource targets without a map-as-database mistake.

### Connector-safe candidate evaluation

Scores are a relative planning judgment, **not** a quantitative project priority mandate.

| Candidate concept | Player-facing reach | Existing owner evidence | Safe parallel preplanning leverage | Immediate overlap risk | Disposition |
| --- | --- | --- | --- | --- | --- |
| **Area + Atlas playable context and source-to-action mapping** | Every play session; makes systems discoverable | Strong, but scattered World/Activity/Quests/command architecture | High: exact UI/source inventory and presentation tests | Low if one new document; Codex is on v3 Save/activation | **Selected for this pass** |
| Heir/succession life-stage decision surface | Defines long-term lineage identity | Deep docs, but person/kinship/estate authority incomplete | Medium: can document future flow | Medium with account terminal/legacy lifecycle | Defer until descendant/estate and world-person gate |
| Crafting/workstation action availability | Essential professions and economy | 28 planned recipes, tool/fixture data audit | Medium: PR #40 already covers T0–T3 | High duplicate effort with connector tool branch | Consume PR #40 later |
| Carry & Stow bracers/holsters/cloaks | Strong inventory/equipment agency | H0/H1/H2 documented on PR #40 | Low new marginal value | High with native gear owner and PR #40 | No duplicate pass |
| Natural combat pacing/results clarity | Important survival experience | Combat skeleton and result-disclosure deferred route | Medium | Higher because parked combat and selected owner gates | Preserve deferred combat priority |

### Name and structure ambiguity to settle before code

- **Area (candidate UI label)**: here-and-now observed local scene and relevant affordances; a read projection, not a persisted `areaId` or always-visible tiled minimap.
- **Atlas (candidate World-mode label)**: known/deducible places, routes, plans, comparison, geography, exploration history, and navigation previews. It is **not** a second travel executor or automatic full-knowledge world map.
- **Codex → Atlas**: an **existing** geography/knowledge sub-section (`uiViewModel.ts` `codexSections` includes `atlas`). It is reference/Knowledge presentation, not the prospective World Atlas travel mode.
- **World**: the live left-navigation domain (`InGameShell.tsx`, `WorldPanel.tsx`). Proposed least-disruptive first presentation retains this route and offers `Area` / `Atlas` as sibling contexts within it. Whether they later become root-level entries is a separate explicit owner/UI decision; do **not** secretly expand or delete primary nav.
- **Home / Current Situation**: approved IA describes a compact re-entry that can link into Area and expose urgency; current `InGameShell.tsx` actually defaults to `character` and allows null tab. The previously approved Home default is **not yet selected behavior**. Preserve this mismatch as an implementation acceptance question.

## 2. Precise current selected-source seam

The rows below are **current master facts** unless marked future. A visible UI button is not proof that the same command is active from the future Area surface. Unselected PR #44 does not make the selected app native v3.

| Current visible/source seam | Concrete master file/function | Current type of authority | Area / Atlas disposition |
| --- | --- | --- | --- |
| Shell + top bar + navigation | `apps/rpg-ui/src/game-shell/InGameShell.tsx`; `TopStatusBar.tsx`; `uiViewModel.navItems` | UI navigation; global status read | **Preserve**; no new location/clock owner |
| Current World surface | `apps/rpg-ui/src/features/WorldPanel.tsx` | `World Surface` map **placeholder** plus buttons/record lists | Atlas may organize known places; Area prioritizes immediate scene |
| World sub-sections | `uiViewModel.ts` `worldSections`: `world-map`, `region`, `settlement`, `trade-routes`, `travel`, `local-market` | Record projections | Atlas filters/overlays; details remain read only |
| Known destinations | `snapshot.sessionState.knownLocations` via `uiViewModel.ts` | Knowledge/known-place list | Known place marker; **not** exact local reachability/feature |
| Travel Preview | `gameplayLoop.previewTravelToKnownLocation`, engine `resolvePlayerTravelPlan` | Current owner-backed preview | Atlas destination card and contextual travel preparation |
| Travel To Location | `gameplayLoop.travelToKnownLocation`, engine `createPlayerTravelCommand / executePlayerTravelCommand` | Existing gameplay owner command | Same exact target, result and time; no map-teleport shortcut |
| Nearby Explore | `WorldPanel` `resolveNearbyExplorationPlan`, `useGameSession.exploreNearby` | Existing owner/selected caller | Area local Explore when legal; preview, cost, encounter uncertainty |
| Approach encounter | `snapshot.worldState.nearbyExplorationCandidate`, `useGameSession.admitNearbyEncounter` | Encounter admission command | Contextual candidate card; cannot assume present NPC or persistent map icon |
| Active encounter and combat | `snapshot.gameState.activeEncounter`, `listLegalPlayerCombatCommands`, `advanceNearbyEncounter` | Combat owner, selected current buttons | **Modal Area encounter**; only owner-legal actions/continuation |
| Current activity select | `ActivityPanel`, `gameplayLoop.setCurrentActivityFromRecord`; engine `player-activity-selection.ts` | Activity owner selection | Area may **link** to actual Activity record; only duplicate exact command after revalidation |
| Advance shift/operation | `ActivityPanel`, `previewAdvanceCurrentActivity`, `advanceCurrentActivity`, `advanceAshenReefSurvey` | Generic bridge and special survey owner | Surface current/resume/status; no fake generic one-watch completion |
| Rest | `ActivityPanel`, `previewRestAtCurrentSettlement`, `restAtCurrentSettlement` | Selected settlement rest route | Area button only when genuine legal current-settlement location |
| Quest accept/track/turn in | `QuestsPanel.tsx`: `acceptQuest`, `toggleTrackedQuest`, `turnInQuest`, `submitSoundingsTurnIn` | Distinct quest and survey owners | Area can show an **exact** source-linked entry/shortcut; not infer board/clerk |
| Inventory/Equipment | `InGameShell.tsx` Character/Inventory routes | Selected v2; native v3 under stacked hold | Area can open real item/gear owner, never duplicate inventory |
| Codex Atlas | `uiViewModel.ts` `codexSections.atlas` and geographic Knowledge | Read-only player known geography | Deep reference via cross-link, not a map-travel command |
| Station/NPC/market/service/guild | Descriptive civilization content and future `LocalSceneContext` | **Not** a proven live entity/action source | Future contextual targets only after exact presence, rights, permission, owner and mutations |

**Readiness labels for each proposed Area/Atlas tile:** `selected-executable`, `existing-read-only`, `unselected-candidate`, `owner-missing`, `not-observed`. Do not collapse `unselected-candidate` into player-facing `Available`; internal readiness is engineering metadata, not necessarily UI text.

## 3. Presentation contract: one situation, one next decision

At any selected snapshot head, the Area pane would answer:

1. **Where am I?** Name and confidence of current place from accepted player location and known-place owners. Show region/settlement/site only as justified. An authored hex, road or NPC location elsewhere does not prove nearby presence.
2. **What is happening?** Prioritize active combat, pending Normal-defeat, already accepted activity/progression, travel consequences, then low-stakes exploration. Respect interruptions and owner state; don't claim the clock stopped because the screen is open.
3. **What can I inspect?** Only observed or known entities and accepted state-derived markers; allow unknown/rumored distinction and redacted provenance.
4. **What can I actually do next?** A handful of **currently legal, owner-backed** affordances with clear target, time/cost/risk and rejection reasons. Show future verbs as information/locked explanation at most, never active fake buttons.
5. **How do I move out to broader planning?** An `Open Atlas` view of known destinations/routes, and return-to-Area navigation preserving the current scene and selected target where still valid.

The Atlas pane would answer:

1. **Known to the character** vs merely authored geography (fog/partial knowledge).
2. **Current place and selected destination**, with source of location identity; maps support orientation not world mutation.
3. **Can I travel from here?** Show authoritative plan and risk/time preview; unknown path/permission blocks action.
4. **What's there?** Inspect only records the appropriate owner can disclose, with confidence and provenance.
5. **Return to Area** without an accepted travel unless the player explicitly executes the travel command.

### Candidate adaptive composition, not a React spec

```text
Persistent top band: character | local time/place | HP/MP/Stamina | notices | Save
Left navigation: current primary domains (World / Character / Inventory / Activity ...)
World -> [ Area ] [ Atlas ]      (proposed sibling views, not new authority)

AREA • Current Situation
  Situation header: verified location, region, current state, relevant urgency
  Primary story pane: concise text of what is currently observable
  Center/context: selected known destination / discovered encounter / activity /
                  future observed actor or station, never all at once
  Action strip: at most 2-4 useful legal choices + inspected disabled reasons
  Detail inspector: provenance, expected cost/risk, eligibility, affected owner,
                    return-to-selected item or quest
  Secondary routes: Open Atlas | Activity | Quests | Inventory | Codex evidence

ATLAS • Known Lands and Routes
  Multi-scale map/list: known location identities and route relationships
  Explicit current marker, destination inspector, owner travel preview
  Filters: known/rumored only when sources support; route status only if authored
  Key action: Travel [only when owner permits, with actual risk confirmation]
  Secondary routes: Return to Area | Knowledge Codex Atlas | Quests/Operations
```

Not a full-screen action RPG camera, free-roaming map simulation or RTS unit-control claim. The map is a *planning canvas*. The text and concrete selected action remain the main mode of play.

## 4. Action relevance and disclosure model (candidate, layered over accepted command architecture)

**Priority is not legality.** A presentation rank may promote a relevant existing command but cannot authorize it. One target may have multiple domain-owned commands. Never rank by unseen secrets.

| State / actual evidence | Primary presentation | Allowed current selected action or future deferment |
| --- | --- | --- |
| Active nearby encounter | Area encounter details, target, last outcome, active time | Existing list of legal combat commands or advance beat; hide ordinary Travel/Rest |
| Nearby exploration candidate, no active encounter | Area: signs and Approach card | Existing `admitNearbyEncounter`; keep encounter as candidate until accepted |
| No nearby candidate and exploration plan legal | Area: Explore Nearby, one watch and stamina preview | Existing `exploreNearby`; explicitly uncertain result |
| Known destination selected | Atlas: destination and travel outlook | Exact `previewTravelToKnownLocation` then `travelToKnownLocation` |
| Current activity accepted | Area status + Activity link | Existing activity advance only under owner plan; survey stage follows distinct engine |
| At legal settlement rest anchor | Area context + Rest via Activity | Existing `previewRestAtCurrentSettlement` and `restAtCurrentSettlement` |
| Specific quest row and owner command already legal | Quests card/context shortcut | Same `acceptQuest` / track / turn in only with correct instance and owner guard |
| Known settlement with only descriptive market text | Atlas inspection of market record | **Read only**; no simulated Buy/Sell without merchant/stock/transaction |
| Descriptive forest/river/road without exact current local feature | Known geographic context, maybe narrative | **No** gather/fish/cross action; require real site/feature/permission owner |
| Authored guild hall but no observed clerk | Inspect location/institution | **No** Apply/Pay Dues; needs concrete authorized clerk/service endpoint |
| Planned workshop without resolved actual station instance | Inspection, source gap | **No** Craft/Repair or free station tool; wait for station owner and access |
| Future army/property/business control | Linked Activity/Management page | Administrative policies are not character-world verbs |
| Unknown exact location during incompatible/legacy read | "Location unknown" and safe recovery guidance | No fabricated Area target; no off-head travel command |

Where risk is material, use an owner-generated outlook and explicit confirmation. Rejections should explain **why** (not here, unknown route, exhausted, combat active, capacity, permission, stale source, no action profile); avoid a list of permanently gray decorative actions. UI exploration/inspection must not advance time unless an owning command expressly does so.

## 5. Preserve strict owner and data boundaries

| Source/fact | Candidate display use | Never infer from it |
| --- | --- | --- |
| `playerState.location`, `regionId` | Verified coarse location | Exact feet/inches/hex/site entrance/inside building |
| `sessionState.knownLocations` | Known destination map markers and names | Local presence, travel reachability, permission |
| `sessionState.worldRecords` | World sublist detail and trade route *records* | Real-time traffic, merchant stock, accessibility |
| `worldState.nearbyExplorationContext` / candidate | Exploration affordance and candidate information | Encounter already active; exact foe visible outside acceptance |
| `gameState.activeEncounter` | Real combat context and legal commands | Expanded combat abilities, map targeting not owned by engine |
| `sessionState.currentActivity` and activity records | Current work/activity status, owner links | Completed progress just because UI label says done |
| `questJournal` and accepted quest owner | Tracked quest/status, exact target if available | Physically present issuer or authorized turn-in clerk |
| `sessionState.codexEntries` / geographic Knowledge | Reference and observation history | Instant map reveal, travel legality or NPC placement |
| Player gear (selected v2 / unselected native v3) | Available inventory actions only from currently selected owner | Holster contents, hand occupancy or outfit compatibility not yet authored |
| Authored buildings, regions, guilds, recipes | Descriptive background and future target *possibilities* | Observed and interactive entity/station instance, free public service |
| Chronicle/notifications | Recent experienced facts and urgency, subject to owners | Live command eligibility, historical truth from prose alone |
| Art/map illustration asset | Atmosphere and orientation | Hidden resources, undiscovered places, action target geometry |

This reuses the accepted `LocalSceneContext` concept from `local-scene-context-projection-decision.md`: a transient player-relative read projection at a specific accepted head and tick, no world database and no monolithic command executor. It also respects `contextual-player-action-and-command-architecture-decision.md` (domain-contributed descriptors, concrete target/owner, fresh execution validation); `world-command-vs-management-operation-boundary-decision.md`; `contextual-interaction-endpoints-and-contract-station-routing-decision.md`.

## 6. Smallest credible implementation sequence AFTER current native Save and UI gates

**A0 — Design/user gate (this preflight):** choose whether `Area/Atlas` are World sibling views or primary navigation, whether Home opens Area by default, and how to distinguish World Atlas from Codex Atlas. This document recommends sibling World views initially because selected owner/domain routing is already World. Capture one explicit decision, not a silent CSS rename.

**A1 — Read-only selected-v2 source bridge:** derive a truthful `Current Situation` view of current place, encounter candidate, active encounter, activity, and known destinations via existing selected view model and legal plans. No new actions, location IDs, saved state or selected client switch. Demonstrate unknown/not-observed and stale head handling. If native selected v3 has landed by then, use **only that selected owner** instead, not a v2 shadow.

**A2 — Existing actions only:** route Area shortcuts into **the same current engine/caller commands** for Explore, Approach, encounter, travel preview/execute, rest, activity and quest navigation. Do not duplicate request/receipt or bypass `updateSnapshot`/campaign-session admission. Preserve selected per-action costs, full state readback and error messages; modal combat priority.

**A3 — World Atlas known places:** move or compose current map placeholder as a genuine read-only known-location planner. Distinguish cartographic scale from exact travel path: source `knownLocations.x/y` currently draws location pins, but does not prove route geometry. Present travel outlook from its actual owner. Cross-link Codex Atlas instead of copying knowledge data.

**A4 — Contextual entity/station expansion:** only after owner instances exist, admit actual person, board, clerk, workstation, resource node, market counter, vehicle and terrain feature targets one by one. Follow specific authorization/presence/custody rules; don't broadly enable cookbook verbs from a taxonomy.

**A5 — Presentation polish after acceptance:** art/backgrounds, compact top/rail, focus/keyboard/ARIA, accessibility, progressive disclosure, mobile/reduced-motion layout, map/list parity. No invented minimap, dynamic simulation or unsafe autonomous actions.

Each executable slice requires local authenticated checkout and red-before-green selected caller/UI tests. The design is deliberately independent from ongoing native v3 PR #44 selected-activation work; do not queue A1 while Codex owns selected App files.

## 7. Prospective test matrix (future execution only)

| ID | Scenario | Acceptance criterion |
| --- | --- | --- |
| AA-01 | Cold re-entry on ordinary saved game | Situation displays actual persisted location and active condition; no invented Home/Area owner |
| AA-02 | Same snapshot, switch World Area↔Atlas↔Codex Atlas | No gameplay tick, snapshot mutation, lost live source or automatic travel |
| AA-03 | Select known map destination but do not travel | Location stays unchanged; owner preview accurately reports denied/allowed travel |
| AA-04 | Accepted travel from Atlas and return to Area | Exactly one travel command/result, clock/body and destination readback |
| AA-05 | Denied or stale travel after a tick/gear change | No saved state or time change, refresh outlook; no stale preview authority |
| AA-06 | Nearby Explore with an allowed one-watch plan | Exactly existing explore result, cost and uncertainty; not forced encounter |
| AA-07 | Found encounter candidate before approach | Visible candidate, no premature active encounter or combat controls |
| AA-08 | Accepted Approach | Encounter starts through owner once; duplicate click does not start two fights |
| AA-09 | Active combat | Area prioritizes legal combat commands; Travel/Rest/Work cannot bypass combat |
| AA-10 | Selected quest from a non-observed board/issuer | No fictional NPC, contract station or turn-in shortcut |
| AA-11 | Activity selected with a valid record | Correct `player.activity.select` route; no inferred shift completion |
| AA-12 | Rest away from legal settlement | Denied with actual reason; no automatic transfer to an inn |
| AA-13 | Static catalog contains a forge but no observed station | No visible executable Craft/Repair or free tools |
| AA-14 | Known map pin vs rumored/described region | Visibility/knowledge disclosure matches owner, never reveals hidden destinations |
| AA-15 | World / Area / Atlas / Codex map semantics | Each view makes its owner, travel versus knowledge and return path legible |
| AA-16 | Save/load/restart during active encounter or activity | Selected command identity and persisted state are unchanged by view switch |
| AA-17 | Native selected v3 gear after gate passes | No legacy equipment shadow or invented fixed holster slots from Area |
| AA-18 | Missing location data or mixed-format legacy tab | Fail closed and show safe guidance; no guessed coordinates/actions |
| AA-19 | Duplicate display entry from two contextual surfaces | One underlying owner command target, no duplicate mutation or reward |
| AA-20 | Keyboard, reduced-motion, narrow screens | Action preview, target context and list alternative work without a map mouse |

**No tests have been run here.** This is an acceptance-design matrix, not a passing test report.

## 8. Honest scope / integration boundary

Connector evidence inspected: selected master `WorldPanel.tsx`, `ActivityPanel.tsx`, `QuestsPanel.tsx`, `InGameShell.tsx`, `uiViewModel.ts`, `gameplayLoop.ts`, `player-travel.ts` and `player-activity-selection.ts`; accepted UI architecture, local scene, contextual command, contextual endpoint and world-vs-management decisions; draft PR #44 metadata.

Discrepancy recorded: the older `ui-information-architecture-boundary.md` describes **six** primary domains with Inventory subordinate and Home default. Current master `InGameShell.tsx` exposes Inventory as its own left-nav route and defaults to Character. **Live source is the present selected UI;** no unapproved automatic rollback to six-domain navigation should follow from this research. Future owner should reconcile the approved intended IA and current observed nav in an explicit decision.

An Area or Atlas panel cannot own location, event, quest, world, economy, map fog, action cost, station stock, inventory or gear. No changes to persistent IDs, Save, native v3, combat, market, content schemas, Game version, Site, data, or current active Codex files. Any future art or UI prototype must not be mistaken for selected gameplay acceptance.

**Review trigger:** after native v3 selected App activation is accepted or explicitly parked, and Character-first UI integration disposition is reconciled. Next user/owner decisions: default gameplay reentry mode, Area/Atlas navigation hierarchy and local-observation presentation depth. Until then this is a standalone `HOLD_NAMED_CONSUMER` document with no integration authorization.
