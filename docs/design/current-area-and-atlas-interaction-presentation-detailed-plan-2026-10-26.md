# Current Area and Codex Atlas: Detailed Read/Action/Navigation Design

Date: 2026-10-26
Status: `DETAILED_PREIMPLEMENTATION_DESIGN; USER_AREA_INTENT_CAPTURED; NOT_EXECUTABLE`
Related: [Area default and Atlas split](current-area-default-gameplay-and-codex-atlas-separation-2026-10-26.md); [Area deferred-intent audit](area-first-deferred-design-intent-pull-forward-and-dependency-audit-2026-10-26.md); [timing map](deferred-and-outstanding-design-consumer-timing-map-2026-10-26.md); [lore brief](lore-grounded-naming-and-area-content-authoring-plan-2026-10-26.md).
Inspected source `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; current `InGameShell`, `WorldPanel`, `CodexPanel`, `uiViewModel`, existing Travel/Explore/Approach/Rest/Quest/Combat callers.

## 1. Principle: one Area scene, many domain tools

Current **Area** is the main gameplay view on campaign load and when no domain navigation is selected. No new separate Home tab and no old World submenu. Area is where the player reads current surroundings, chooses physical/contextual commands, understands action consequences, opens other tools and initiates travel. Codex → Atlas is a **knowledge/reference** browser for larger geography and known destinations, not a duplicate playable area or spatial teleport screen.

Keep the top resource/time/condition cluster, an always-visible default-on Dev button once integrated, and a compact domain rail. Toggling the current selected tab back off, a prominent place-name return control or a dedicated minimal Area icon may serve as the discoverable way home; implement **one** well-tested mechanism rather than multiple conflicting defaults. Place name can exceed rail width; put full actual name in main Area heading instead of using it as a dynamic tab label.

## 2. Readiness types for rendered components

| State | UI treatment | Source/authority |
| --- | --- | --- |
| `KNOWN_AND_CURRENT` | Full current place header; observable recent conditions where actually sourced | Player location + current accepted head |
| `KNOWN_REFERENCE_ONLY` | Atlas place record and route destination option where eligible | Geographic Knowledge and known locations, not player presence |
| `OBSERVED_UNIDENTIFIED` | Uncertain feature description, if accepted observation exists | Scene/recognition observer evidence, not registry search |
| `ECOLOGICALLY_PLAUSIBLE` | Optional broad environmental context, explicitly not an observed target | Region/ecology descriptors and source limits |
| `ACTION_AVAILABLE` | Interactive command or named route with owner-supplied input/preview | Real legal candidate + selected owner |
| `ACTION_BLOCKED` | Reason, existing owning control or safe hint; never clickable mutation | Actual owner denial when available |
| `DATA_UNKNOWN` | Calm and brief missing-detail fallback, not a fake NPC/event/item | Genuine absence of authored/current observer detail |

A field must carry `sourceOwner`, source IDs, character knowledge tier and current snapshot revision when it affects current-gameplay identity or action eligibility. Record visibility separately from existence. Nothing new becomes persistently stored just because it is on a card.

## 3. Desktop and narrow layout

**Desktop:**
- Primary header: **[Current place]** + validated coarse breadcrumb (region/settlement/anchorage **only if supported**); clock/season remains in top bar.
- Left/main: one 16:9 or similarly restrained **area atmosphere** image / illustrative local overview with text alt or a compact neutral visual fallback. A decorative image may not consume the whole viewport or cover actions.
- Adjacent "Current Situation": active encounter wins priority, then ongoing activity, actionable quest/return, legitimate nearby signs, travel-ready neutral state.
- "What can I do here?" with 1 primary available action, 2–4 secondary legal/route actions, no mandatory one-item submenu. Show action costs, time, resource impact/risk, target and availability from actual preview/command source.
- "Leave / Travel": select real known destinations with read-only previews; invalid destination reason. The Atlas provides description and larger geographic reference, not movement.
- "Recent": 3–6 genuinely retained accepted consequences, with timestamp/source precision **only if actually supported** and a Chronicle link.
- Small cards or inline shortcuts to current relevant Quests, Character/Inventory, Activity and Codex Atlas. Do not show generic inactive grids of future institutions.

**Narrow/mobile:** Stack location header, situation, **primary action**, concise observed environment, other actions, travel and recent events; illustration follows a compact title rather than pushing actions several screens down. Persistent top bar and Dev affordance must remain reachable with keyboard/touch; avoid horizontal nested six-tab sidebar. Legal controls cannot be hidden below a giant image or clipped map.

## 4. Distinct Area modes (pure resolver priority)

Mode precedence at current accepted campaign head:
1. `active_encounter`: combatants/legal action/target, timing and resource costs; no unrelated unguarded travel/rest/Explore. Actual rejected/pending result visible without fabricated damage.
2. `active_activity`: specific Soundings shift or owner-accepted task, next stage, known time/body preview and continuation, rest restrictions. Preserve accepted activity identity and partial progress.
3. `quest_completion_ready`: eligible physical/issuer-site submission, preview and one-time receipt route; no invented harbormaster person or generic `Turn In`.
4. `tracked_objective`: named goal, known real destination and owner-backed Travel/Journal navigation.
5. `nearby_candidate`: signed nearby observations/candidate, Approach when legally admitted.
6. `neutral`: legal Explore/Rest/known Travel as available; show readable place context and navigation if no mutation available.

The user may have multiple simultaneous facts. Render high-priority **primary** situation and additional clearly distinct secondary prompts, not six conflicting primary CTAs. Refresh after accepted mutation or Save/load; ephemeral UI selection does not affect simulation or create reward receipts.

## 5. Component/source shape (concept, not a new schema)

Conceptual pure `CurrentAreaView`:

```ts
type CurrentAreaView = {
  source: { campaignId: string; revision: string | number; tick: number };
  currentPlace: {
    displayName: string; canonicalPlaceId?: string;
    precision: 'region'|'settlement'|'approach'|'authored_site'|'unknown';
    placeSource: string; breadcrumb: string[];
  };
  environment: {
    observedText?: string; ecologyHint?: string;
    visibility: 'observed'|'known_context'|'unknown';
    sourceIds: string[];
    warning?: string;
  };
  mode: 'active_encounter'|'active_activity'|'quest_completion_ready'|
    'tracked_objective'|'nearby_candidate'|'neutral';
  actions: Array<{
    commandId?: string; owner: string; targetId?: string;
    label: string; kind: 'execute_by_owner'|'navigate_to_owner';
    availability: 'available'|'blocked'|'unknown';
    blockedReason?: string; preview?: unknown; destinationTab?: string;
  }>;
  recent: Array<{
    sourceId: string; tick?: number; text: string;
    locationId?: string; category: string; provenanceKind: string;
  }>;
  atlasLink?: { canonicalOrKnownId: string };
};
```

This is a **proposal**: Codex must use actual `SaveSnapshot`, `TabId`, typed source owners and their revision formats instead of copying placeholders into runtime. Never persist this projection, infer a fine-grained site from `siteLabel`, or fabricate missing owner results.

## 6. Source-to-interaction migration matrix

| Former World section/card | Area / Atlas result | Exact current mutation owner preserved |
| --- | --- | --- |
| World Map selected place and pins | Remove synthetic percent-positioned map; known geography in **Codex Atlas**, optional local visual in Area | No new click-to-travel; current travel preview/accepted caller |
| Region | Atlas large-scale reference; Area brief current region context | No runtime region mutation from Codex |
| Settlement | Atlas known record/district; Area current settlement facts and observed entities only | Any actual local service owner remains future |
| Trade Routes | Atlas known route/geography browser, no live market rates | Route/travel/economy owner only when actually supported |
| Travel | **Area** visible destination picker, preview, confirmation, acceptance result | `gameplayLoop.previewTravelToKnownLocation` and `travelToKnownLocation` |
| Local Market | Area **only when** present merchant/provider/transaction owner exists | No fake `Shop` from settlement population |
| Nearby Explore/Approach | Area "Explore Surroundings" with candidate and actual command result | `GameSessionContext` nearby owner |
| Combat legal list/Continue | Area active-encounter mode, exact action target/source/cost | Combat legal-list and nearby advancement owner |
| Quest Accept/Track/Submit | Area shortcuts to Quests/Activity/owning UI; submit in real known return context | Quest acceptance/tracking; exact Soundings turn-in |
| Rest and Shift | Area contextual route to existing Activity command until clean direct adapter | Current body/action preview and Activity owner |
| Character/gear/food | Shortcut to selected owned item; direct Area action only if accepted item owner is integrated | Fresh gear owner PR #20 and current consume semantics |

## 7. Navigation and disclosure details

- **Return to Area:** from any domain, one clear action and toggle-to-null behavior where selected; after Save/restart Area reprojects current **actual** location regardless of last Atlas selection.
- **Atlas:** established read-only known lands/regions/settlements from current geographic knowledge. Add known route/settlement summary only where data explicitly present, keep search filters and short deep links. A destination may be selected in Atlas for reference; Area's Travel action **must revalidate** source-known eligibility at the current revision.
- **Action grammar:** Direct → owner-result, Expand → target/quantity/location picker, Confirm → genuine risk/commitment, Activity → stage progress. A quick exploratory action isn't automatically a multi-choice mini-game. Body/time preview is a *projection* until command accepted.
- **Events:** Source Chronicle may retain short prose with maximum 48 entries and no true place association. Label panel `Recent`, not `Everything That Happened Here`. No infinite scrolling history or location fabricated from event titles.
- **Environment:** Real authored biome/ecology may inform a known-context sentence, but current exact weather remains `unavailable` where owner absent; no `Rain` from image or climate profile; no automatic `Gather` from ecological plausibility.
- **Provenance and visibility:** Hide unknown regions, secret rooms and enemy hidden stats. A visible marker is an accepted observation if its owner says so, not a guessed UI label.
- **Images:** Optional one existing or later explicitly approved illustrative place asset; viewport crop, alt text and no-image fallback. No invented clickable POIs, geometric pathfinding or scene map-pixel references.

## 8. Acceptance scenarios

| Fixture | UI/owner expectation | Wrong behavior to reject |
| --- | --- | --- |
| New Local/Vagabond in actual starting area | Correct source-supported title; baseline Echo zero if PR #22 hardening integrated; real nearby/quest choices and action preview | Character tab initial default, made-up NPC scene, fake Echo |
| Known Starfall versus Ashen survey anchorage | Source-precision title/breadcrumb; quest stage/travel access correct | Treat Ashen as a separate invented city or exact mapped reef interior |
| Tracked Soundings with four shifts | Correct task/remaining stage/resource cost; Activity command preserved | Pressing invented `Auto Survey` repeatedly without stage owner |
| Returned to Starfall | Exactly one accepted 5g submit, new state and visible result | Double-submit, generic service payout or invisible receipt |
| Nearby explore/candidate/active combat | Actual candidate admission, legal action/target/cost and distinct accepted versus resolved effects | Guaranteed encounter, fabricated enemy HP or travel while busy |
| Rest/recovery | Actual time/body/readiness preview and persisted consequence | Instant arbitrary heal or new health injury model |
| Atlas selection and real travel | Atlas selection is reference-only; source acceptance changes current Area name | Select a distant place in Atlas and teleport |
| Coarse region/unknown site, unobserved ecology | Honest known/unknown distinctions with readable fallback | Auto-named fictitious district/site or resource action |
| Changed head/Save/restart | Recomputes Area title/actions/Recent from accepted state | Stale action or saved UI projection from prior location |
| Mobile/keyboard/image missing | No World submenu, visible primary action, focus, alt/fallback | Offscreen buttons, huge decorative map, popup collision |

## 9. Cutover and prompt safety

The first implementation package should be **a pure CurrentAreaView resolver + default Area route and non-muting Atlas separation**, not an unreviewed mega-refactor of commands, geo content and item ownership. Do selected caller tests and negative fixtures, run Node UI typecheck, Vite build and baseline TypeScript compare; validate signed-in selected campaign separately.

The currently active gear/Dev PRs are not automatically mergeable into this UI branch. Do not touch `master/docs/dev/current-codex-prompt.md`, force old-save migration, auto-release `DEV-0.7.2.13`, fabricate location art, or promote Game `0.2.0`. Queue explicit source-first Codex route after the named integration review.

This is detailed design, not a running component or completed browser acceptance.
