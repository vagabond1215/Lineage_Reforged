# Area / Atlas: Navigation Wireflows, Screen States and UI Acceptance Preflight

Date: 2026-10-28
Status: **proposed UI interaction contract, docs-only; no selected UI, route, Save, gameplay, schema, command or Game-version activation**
Source: selected `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; native v3 unselected head PR #44 `022fe22def299cf9fc357058a0214e83875af24b`.
Companion: [Area / Atlas text-first source-to-action preflight](area-atlas-text-first-gameplay-surface-and-command-source-map-2026-10-28.md). This document deepens **presentation and reviewable interaction states**, rather than reopening the accepted engine/domain command architecture.

## 1. Recommended presentation decisions, subject to UI-owner acceptance

1. **World remains the primary domain.** Do not create new `TabId` roots for Area or Atlas. In the World domain, offer **Area** (nearby/current scene) and **Atlas** (knowledge-bound place/route planning) as two *sibling* views. Switching is a read/navigation event, not gameplay.
2. **Area is the proposed default World subview.** A player intentionally opening World sees the immediate situation first, rather than a map placeholder. Atlas is one clear choice away. An existing explicit navigation request for a World record should preserve that record and open Atlas/detail rather than forcibly redirecting to Area.
3. **Cold-start default remains a separate gate.** The desired Home/Current Situation re-entry may route to Area after an owner-approved Home decision and selected test. Currently `InGameShell.tsx` initializes `activeTab='character'`; docs must not claim it opens Area, nor silently change Save/loading or nav during this pass. A *recommended future* default is World→Area, not an accepted implemented switch.
4. **Preserve top bar and existing global navigation.** The actual shell is responsive: `AppLayout.tsx` and `SideNav.tsx` produce a horizontal domain strip in portrait, and `styles/mobile-shell.css` changes the same controls into a compact left rail in landscape (108px first track). Do not replace this with seven fixed-width desktop cards or assume the nav is already a left rail in portrait. A further rail-design change requires distinct accessible/responsive QA.
5. **Keep Codex→Atlas as geographic Knowledge**, not the same as World→Atlas. A cross-link can open it; no map waypoint, travel preview or command is authorized by a Codex entry. Potential later label clarification, e.g. "Knowledge Atlas", requires product decision, not automatic rename.
6. **Keep Activity, Quests, Character and Inventory as genuine owners.** Their own panels remain functional; Area may surface read-only breadcrumbs or promote already-supported commands with exact caller semantics. Avoid relocating their business logic into World.
7. **One primary decision at a time.** The main narrative/current-context region is text-first, not a faux 3D game board. A restrained landmark image or map segment helps orientation but is not an interactable geometry or undiscovered fact source.

### Source-backed navigation reality

| Selected-source seam | Verified current behavior | Proposed change only after hold released |
| --- | --- | --- |
| `apps/rpg-ui/src/types.ts` `TabId` | Seven roots: character, inventory, world, activity, codex, quests, chronicle | Retain exact root set |
| `InGameShell.tsx` | `activeTab='character'`; second click on selected root sets `null` | No implicit Area/Home mutation or automatic change in this pass |
| `AppLayout.tsx` | Top bar + responsive nav/active panel | Preserve and populate only the World content surface |
| `styles/mobile-shell.css` | Portrait horizontal nav; landscape left rail | Respect existing adaptive semantics; later polish may differ |
| `WorldPanel.tsx` | `activeSection='world-map'`; placeholder map + Explore/Encounter/Travel + world lists | Area/Atlas sibling presentation composition |
| `uiViewModel.ts` | World six record sections; `world.locations` from `sessionState.knownLocations` | Source facts unchanged; view grouping only |
| `uiViewModel.ts` | `codexSections` includes `atlas` | Knowledge section kept separate |
| `PanelLayout.tsx` | Optional right information pane, three-column `xl` layout | Inspector may adapt; must have accessible close/open and reading order |

## 2. Screen family: Area (moment-to-moment play)

Design target is legibility during extended sessions and intentional selection of one concrete action. *Example labels below are placeholders for owner-backed information and are not promises of NPCs, map features or currently legal commands.*

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP BAND • character, exact accepted place/time, condition, notices, Save   │
├──────────┬───────────────────────────────────────────────────────────────────┤
│ GLOBAL   │ WORLD                       [ Area ● ] [ Atlas ]                 │
│ NAV*     │                                                                   │
│          │ CURRENT SITUATION                                                │
│ Character│ <Verified current place or 'Location not available'>             │
│ Inventory│ <Owner-supported time, active work or encounter priority>        │
│ World ●  │                                                                   │
│ Activity │ SCENE / NARRATIVE                                                │
│ Codex    │ Short, factual, player-visible situation description.            │
│ Quests   │ No invented road, person, building or secret in the art.         │
│ Chronicle│                                                                   │
│          │ OBSERVED / KNOWN TARGETS        SELECTED TARGET                  │
│          │ • Current activity, if real     Context, known/unknown status   │
│          │ • Nearby encounter candidate    Exact owner provenance        │
│          │ • Verified objective link       Current restriction or outlook  │
│          │                                                                   │
│          │ NEXT ACTIONS                    SECONDARY PATHS                 │
│          │ [Owner-legal main action]       Open Atlas / Activity / Quests  │
│          │ [Other distinct allowed act]    Inspect current item/Knowledge  │
│          │ [Relevant explained block]      Latest owner action result     │
└──────────┴───────────────────────────────────────────────────────────────────┘
* Only a left vertical rail in the layout(s) where current responsive CSS uses it.
  Portrait renders the same global domain controls horizontally.
```

**First viewport information budget:** verified place/state; one concise situation paragraph; 2–4 **relevant** legal/blocked-explained opportunities; one inspected target; a clear return to broader planning. No global "all actions" list. The user can inspect more, but the default must not be a wall of history, arbitrary cards or multiple stacked forms.

The action family is not itself necessarily executable. For example, "Explore Nearby" is a current executable affordance when its owner plan is admitted, while "Gather" with no observed resource instance is not. Actions sourced from one thing but using two distinct commands remain independently selectable.

### Area state precedence

| Situation source and state | Area foreground | Suppress/secondary | Action admission |
| --- | --- | --- | --- |
| Active `gameState.activeEncounter` | Combat situation, combatant/target summary, legal combat commands | World travel, rest, trade and activity execution in this immediate pane | `listLegalPlayerCombatCommands` → `advanceNearbyEncounter`; no local combat rule |
| Pending native defeat, if selected later | Recovery-specific state through selected Save/terminal owner | Ordinary scene actions | Existing *selected* publication/recovery owner, never a UI shortcut (PR #44 still unselected) |
| Accepted nearby candidate, not active encounter | Encounter signs and "Approach" | Unrelated scripted foe markers | `worldState.nearbyExplorationCandidate` → `admitNearbyEncounter` |
| Current accepted activity / ongoing survey | Current work/progress and explicit Activity link | Unrelated work suggestions | Existing Activity/Survey owner; no speculative pause/cancel/resume |
| Ordinary local exploration allowed | Explore Nearby outlook and resource/time cost | Distant region record lists | `resolveNearbyExplorationPlan` → `exploreNearby` |
| At an admitted settlement rest stop | Rest outlook as secondary relevant action | Imaginary inn or rest provider | `previewRestAtCurrentSettlement`; `restAtCurrentSettlement` only if owning selected boundary admits |
| No location identity / not known | Plain unknown-location state and safe navigation/recovery guidance | All fabricated local targets and travel shortcuts | No command without supported exact source and current revalidation |

Precedence is a **presentation choice** only. Even if an action appears, the executor revalidates legality against its current head/owner. Current WorldPane lists combat buttons along with exploration and travel blocks; the **proposed** modal Area arrangement must not create a new combat command or invent a global combat suspension law. Confirm existing owner rejections for concurrent commands before hiding existing controls elsewhere.

## 3. Screen family: Atlas (strategic play)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP BAND                                                                     │
├──────────┬───────────────────────────────────────────────────────────────────┤
│ GLOBAL   │ WORLD                     [ Area ] [ Atlas ● ]                    │
│ NAV      │ KNOWN LANDS                                                        │
│          │                                                                    │
│          │ [Read-only map / list of known destinations and regions]           │
│          │ [Current-place marker only when correctly identified]              │
│          │ [Known/unknown status does not imply exact routes]                │
│          │                                                                    │
│          │ DESTINATION INSPECTOR                                              │
│          │ Name, type, region, observed knowledge, source                     │
│          │ Owner travel preview: allowed? duration/cost/risk/denial           │
│          │ [Travel] or [Explain blocker]       [Return to Area]               │
│          │                                                                    │
│          │ REFERENCE LINKS: Codex → Atlas (Knowledge), Activity, Quests        │
└──────────┴───────────────────────────────────────────────────────────────────┘
```

Atlas retains **two separate identities**: `currentLocationId` derived from the selected location owner and `selectedDestinationId` from explicit UI selection. Pin coordinates `x/y` in `sessionState.knownLocations` are **presentation coordinates** on the current World map; do not use them to calculate route legality or silently place the player at a literal map pixel. The existing engine travel plan owns admitted destinations and travel ticks. Unknown map geography may be described only to the extent authorized by character Knowledge.

Travel action sequence:

```text
select a grounded, known destination (UI only)
  → owner preview (allowed / blocked with truthful reason)
  → if consequential risk, explicit confirmation of same target + fresh outlook
  → invoke exact selected travel command (never a second Atlas travel resolver)
  → owner admission and current campaign-session publication
  → accepted result refreshes location / cost / time and reopens Area by choice
  → rejection keeps player at current place, invalidates preview/confirmation
```

The map/list must support **the same destination identity, preview and selection**. Neither clicking a pin nor viewing Codex Atlas advances time, creates travel, unlocks fog or starts work.

## 4. UI-only navigation state, lifecycle and deep links

Candidate ephemeral view state (conceptual, not a new persisted TypeScript interface):

| View state | Identity and allowed values | Lifetime / reset |
| --- | --- | --- |
| `activeDomain` | Existing `TabId`, not a new `area` or `atlas` root | Existing InGameShell selection owner |
| `worldMode` | `area` / `atlas` | Local World UI state; not a `SaveSnapshot` world fact |
| `focusedSubject` | Typed source/owner + exact target id + observed context + source head/revision | Discard if no longer observed/authorized; never derive from display label |
| `selectedDestinationId` | Exact known destination ID when in Atlas | May be remembered on return if still known, but never changes location |
| `previewFingerprint` | Optional UI reference to latest owner preview / target / head | Invalidated by changed snapshot, tick, target, source, gear or permission |
| `confirmingAction` | Current concrete command/target/method + fresh preview (if needed) | Clears on owner revision change, focus change, rejection, domain/mode switch |
| `inspectorOpen` | UI disclosure toggle only | No game clock, Save mutation or new canonical selection |
| `returnContext` | Caller domain/mode/selection for cross-link navigation | Bounded ephemeral history, explicit back path; not run history |

**Do not serialize these as gameplay facts.** A future user preference for last-open World tab may be decided separately and must never turn into an action receipt or authoritative place. The current master stores `sessionState.pinnedRecordIds` via campaign-session `persisted_preference`, so *not every apparently cosmetic control is presently ephemeral*. Do not reuse that persisted pin pathway for Area focus/Atlas destination without an explicit UI preference ownership decision.

Cross-navigation examples:
- Area → Atlas → Area: no travel, no tick, same accepted source; return to last observed Area target if still valid.
- Area → Quests → World/Area: preserve source-linked quest selection where UI routing supports it; otherwise show safe Area overview. No unsupported implicit quest-target teleport.
- Atlas → Codex/Atlas → return: do not confuse a Knowledge record ID with a travel destination ID.
- Area → Inventory → World/Area: equipped/held change (if owner-accepted) can invalidate context plans; recompute and make stale action confirmation disappear.
- Open a saved campaign with pending defeat, corrupted map identity or mixed format: the selected Save owner decides load/recovery; *do not render fabricated Area state first*.

## 5. Three representative vertical journeys and a failure journey

### J1. Explore → approach → combat

```text
Area (no active encounter) → Explore Nearby [legal plan and actual cost]
  → accepted explore result, possible nearby candidate
  → Area shows "Approach encounter" only if candidate exists
  → accepted approach result creates active encounter
  → Area switches to encounter-priority presentation
  → legal engine commands / Continue combat beat, accepted outcomes
  → after actual encounter owner ends, show resulting verified context
```

Future UI acceptance must use the exact currently selected `useGameSession.exploreNearby`, `admitNearbyEncounter`, `advanceNearbyEncounter`. No forced encounter after every explore, synthetic enemy map markers or new movement authority.

### J2. Atlas destination → current place

```text
Area → Atlas → choose known place → preview denied/allowed
  → [optional risk confirmation] → execute existing Travel To Location owner
  → accepted result changes persisted place/time and related resources
  → Area reads updated place; exact target and preview are cleared/refreshed
```

One travel request, one result. A stale preview must not authorize execution. The selected `WorldPanel` currently uses `travelToKnownLocation` and only calls `updateSnapshot` with `ownerKind='engine_result'`, `mutationId`, `resultId` when accepted; preserve this admission route.

### J3. Current job/survey → go to owner and resume

```text
Area current activity summary → open Activity for selected activity record
  → select only from actual `sessionState.activityRecords`
  → owner validates `player.activity.select`
  → Advance Shift follows current generic or exact Ashen Reef survey route
  → return Area displays updated accepted activity; no new virtual operation
```

Current `ActivityPanel` uses `advanceAshenReefSurvey` and retained request IDs for the special survey case; the generic `advanceCurrentActivity` is a different route. Area must not flatten these into one invented "Work 1 Watch" resolver or claim all activities have persistent resumable attempts.

### J4. Changed world/snapshot while player is inspecting a target

```text
Area or Atlas inspector shows owner-derived preview at head H
  → source head/tick/selected gear/location changes to H+1
  → UI invalidates target/confirmation if no longer legal or observed
  → new owner preview on current H+1
  → attempt to use stale input receives owner denial, not mutation
  → show specific safe rejection, keep return path and original place
```

This case is **not** solved by disabling a button in React. Staleness fencing belongs to owner/campaign admission; the UI only prevents avoidable duplicate/ambiguous attempts.

## 6. Preview and action result disclosure requirements

For each actually executable selected command, show:
- **Verb and target**: concrete selected command meaning; clearly distinguish look/inspect (read) from travel/rest/explore/craft (mutation).
- **Availability**: `available`, `available_risky`, `blocked_explained`, or omitted per the accepted contextual action decision.
- **Cost and time**: show only values actually computed by an owner. E.g. selected Nearby Explore currently describes a one-watch, two-Stamina action; existing settlement Rest preview requires four silver and four ticks. These are **current first-loop specifics, not universal future rules**.
- **Uncertainty**: where a forecast only approximates or an encounter may not appear, say so. No invented exact reward, local hidden feature, station stock, NPC presence, animal position or weather.
- **Result**: accepted/denied reason and changed state read from owner result. A toast cannot be the sole persistent evidence of a consequential action; relevant state remains inspectable.
- **Idempotency**: retain original owner-issued request/attempt/receipt identity for a technical retry. UI descriptor/target display id cannot replace a domain mutation ID.
- **Stakes**: owner-approved severe/risky action has meaningful explicit confirmation; inspection and ordinary navigation do not ask for confirmation.

Do not mine `sessionState.chronicle` summary prose or generated art to fabricate action eligibility. Keep quest, activity, combat, travel, account and Gear mutation authorities distinct.

## 7. Suggested non-disruptive implementation packages when Codex gate clears

All following **remain deferred** until native v3 selected-vs-v2 ownership is settled and the Character UI stack/branch disposition is reviewed. Each package is individually reviewable in a new Codex child or approved UI owner branch; none is authorized by this doc.

| Package | Edit surface (prospective only) | Objective | Required evidence |
| --- | --- | --- | --- |
| A0 Product/IA signoff | This and companion design docs | Confirm World sibling modes and decide Home/re-entry treatment | Documented owner choice; distinguish Codex Atlas |
| A1 Read-only Area scene | `WorldPanel.tsx`, focused view-model/presentation helper, new UI tests | Current place, encounter/activity priority from selected snapshot | Zero mutation/tick on view toggles; no invented targets |
| A2 Atlas plan + knowledge cross-link | World view and existing map/known-locations projections | Show known destinations and existing travel preview | Map/list equivalence; no travel on inspect, no fog reveal |
| A3 Owner action promotion | Selected World/Activity/Quests callers, only if safe to share/route | Exact Explore, Approach, combat and Travel in contextual location | Owner-rejection, mutation ID and Save/restart parity |
| A4 Responsive navigation polish | `AppLayout`, `SideNav`, `PanelLayout`, CSS, UI tests | Maintain top bar and landscape rail; portrait nav remains operable | Focus/ARIA, narrow layouts, list fallback |
| A5 Future local entities | **Only after** actual local scene/target/rights owners | One real board/clerk/forge/biome instance at a time | Proof of presence/observation/authority and no free services |

Do not combine A1–A5 into the ongoing selected native v3 activation PR. A **read-only** Area UI could be prepared while v3 remains unselected only if the UI source owner explicitly agrees not to conflict with the active native App path and the selected format is unambiguous.

## 8. User-facing state and interaction acceptance matrix (not executed)

| Test | Scenario | Required observation |
| --- | --- | --- |
| AW-01 | Enter World intentionally, no deep-link selection | Candidate Area opens as World subview without adding root navigation |
| AW-02 | Portrait layout | Horizontal domain controls usable; Area/Atlas tabs keyboard accessible; no clipped action |
| AW-03 | Landscape layout | Current compact left rail and top band work; no duplicate World entry |
| AW-04 | Area ↔ Atlas ten times | Zero command receipts, ticks, Save changes or hidden knowledge reveal |
| AW-05 | Switch domains and return | Valid last context/selection restored or safely reset, no stale executable affordance |
| AW-06 | Atlas pin/list parity | Same canonical location selection and owner travel preview |
| AW-07 | Codex Atlas cross-link | Reference is read-only, return path intact, no travel privilege |
| AW-08 | Unknown location or unknown route | Helpful explanation, no false pin, no fabricated action |
| AW-09 | Two identical labels but distinct target IDs | Selection/action refer to exact owner target, not label |
| AW-10 | Nearby exploration rejected | Owner reason and no time/resource loss; no accidental encounter |
| AW-11 | Encounter candidate exists | Approach controls only, no combat until accepted |
| AW-12 | Active encounter | Legal combat commands shown; no parallel Area world action bypass |
| AW-13 | Travel preview risk/confirm | Target and owner outlook bound; changed target resets confirmation |
| AW-14 | Stale source/head after preview | Fresh preview or owner rejection, no stale travel mutation |
| AW-15 | Selected Activity survey | Survey uses existing request-id/owner path, no generic shift substitution |
| AW-16 | Quest cross-link with no present board/clerk | Quest record available, no fictional physical issuer action |
| AW-17 | Generic selected rest away from settlement or without funds | Exact supported denial, no new rest place/price |
| AW-18 | Interrupted Save/restart while Area or Atlas was open | Owner state recovers; view state cannot double-publish |
| AW-19 | Mixed-format/native-v3 held | No v2 equipment shadow or early native action activation |
| AW-20 | Screen-reader focus and modal notice | One clear current tab, visible focus, details in reading order, result announced |
| AW-21 | 320px/600px/desktop and reduced motion | Non-map list remains fully usable; no mandatory hover/zoom |
| AW-22 | Owned item change invalidates current affordance | Current gear owner rechecks; UI never edits physical item identity |
| AW-23 | Future descriptive workshop but no actual instance | No executable craft/repair or assumed station tool |
| AW-24 | Returned player after accepted travel | Area reads new location/tick/known context; old preview not replayed |

**No test execution or browser approval in this document.** The acceptance rows are a future red/green suite, not evidence of readiness.

## 9. Handoff decisions and closed scope

The recommended **World→Area/Atlas sibling hierarchy** is now a precise design recommendation, consistent with the user's instruction to continue that direction, but no runtime route has been changed. Open product questions for the named UI owner:
- Whether Home should be a compact dedicated re-entry with a direct Area shortcut or whether **World→Area** should become the initial domain after authenticated load. Proposed least-risk first adoption is default World subview Area when a player opens World; retain Character on load until independent Home/selected-client review.
- Whether the existing Codex label `Atlas` needs a display-only qualifier to distinguish a future World Atlas.
- How much local narrative is eligible from currently sparse location/observation sources before a proper LocalScene owner is selected.

**Hard hold:** PR #44 and its native v3 ancestors are unselected. PR #40 owns related carry/tool design; PR #45 is only Area/Atlas presentation evidence. Never merge PR #45 simply because the document is complete, and do not modify `docs/dev/current-codex-prompt.md`, `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md` or the Codex-owned branch register from this pass.

Source files inspected: `apps/rpg-ui/src/types.ts`, `components/SideNav.tsx`, `components/layout/AppLayout.tsx`, `components/layout/PanelLayout.tsx`, `styles/mobile-shell.css`, `game-shell/InGameShell.tsx`, `features/WorldPanel.tsx`, `features/ActivityPanel.tsx`, `features/QuestsPanel.tsx`, `runtime/GameSessionContext.tsx`, `runtime/uiViewModel.ts`, `game-shell/gameplayLoop.ts`, and accepted `ui-information-architecture-boundary.md`, `local-scene-context-projection-decision.md`, `contextual-player-action-and-command-architecture-decision.md`.
