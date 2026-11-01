# Area-First Deferred Design Intent: Pull-Forward And Dependency Audit

Date: 2026-10-26
Status: `CONNECTOR_PREPLANNING_ONLY; NO_RUNTIME_OR_ART_ACCEPTANCE`
Repository `vagabond1215/Lineage_Reforged`; source `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; isolated UI plan [PR #24](https://github.com/vagabond1215/Lineage_Reforged/pull/24).
Controls: [Current Area / Codex Atlas split](current-area-default-gameplay-and-codex-atlas-separation-2026-10-26.md), [barebones playable UI dependencies](barebones-playable-ui-implementation-sequence-and-acceptance-packet-2026-10-26.md), current Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, no automatic `VERTICAL_SLICE` claim.

## 1. What this additional pass reviewed

This is a **second-wave, targeted** review of deferred intent likely to change the immediate Area UI or first replayable gameplay loop. It **does not** claim every historical document was inspected. It adds the following distinct sources beyond the initial cross-domain planning packet:

- `ecology-grounded-contextual-affordance-expansion-plan.md`, `contextual-player-affordance-and-owner-matrices.md`, `local-scene-context-projection-decision.md`, `location-recognition-and-geographic-knowledge-taxonomy.md`, `discovery-poi-boundary-decision.md`;
- `contextual-interaction-endpoints-and-contract-station-routing-decision.md`, `world-command-vs-management-operation-boundary-decision.md`, `contextual-command-domain-census-and-expansion-plan.md`;
- `activity-resolution-depth-and-attempt-state-contract-plan.md`, `activity-resolution-existing-system-reuse-audit.md`, `contextual-action-surfaces-inventory-crafting-and-trade-decision.md`;
- `quest-identity-offer-context-and-travel-access-product-direction.md`, `quest-event-chronicle-authority-boundary-decision.md`, `travel-authority-boundary-decision.md`, `travel-knowledge-route-source-map.md`, `hazard-and-route-security-boundary-decision.md`;
- `combat-text-first-feedback-and-observability-prework-2026-10-20.md`, `normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`, `injury-recovery-trauma-and-magical-restoration-decision.md`, `health-runtime-ownership-and-dependency-closure-audit.md`;
- `living-character-manuscript-design-boundary.md`, `chronicles-bloodline-tree-presentation-plan.md`, `difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`, `skill-mastery-trial-framework-plan.md`;
- `calendar-climate-popup-view-model-plan.md`, `first-people-npc-content-seed-plan.md`, `first-settlement-site-content-seed-plan.md`, `production-chain-workplace-runtime-authority-audit-trigger.md`, `survival-builder-rpg-mmo-content-gap-audit.md`.

Direct UI/source cross-check uses `InGameShell.tsx`, `WorldPanel.tsx`, `CodexPanel.tsx`, `uiViewModel.ts`, `gameplayLoop.ts`, `GameSessionContext.tsx`, and current Body/Rest/Quest controls as inspected in PR #24's earlier package. Files absent under guessed names were **not** used as evidence.

## 2. Pull-forward decisions, by useful consumer

| Opportunity | What accepted design already establishes | Safe to add to Area preplanning now | Activation condition |
| --- | --- | --- | --- |
| **AREA-ENV-01: observed environment narrative** | Ecology hierarchy: regional profile → biome → hex/locality → observed habitat/feature → real resource instance. Existing HexResourceAvailability is *plausibility* not a Gather target. | Add a source-provenanced `environmentSummary` with feature shape, coarse conditions and uncertainty, plus no-executable-action state. Five differing environment fixtures. | UI read projection only; no gather/filter effects from descriptive tags. |
| **AREA-OBS-02: recognition and knowledge** | Geography recognition has separate future observation occurrence, clue evidence, interpretation and mutable acceptance; current `geographicKnowledge` and known locations use their existing rules. | Distinguish `known place`, `observed but unidentified feature`, `rumored geography`, `unknown` in display taxonomy where a **current** owner already exposes them. Avoid exposing hidden authored facts. | New recognition/observation mutations wait for source/occurrence/evidence owner; Atlas retains known-only visibility. |
| **AREA-ACT-03: action interaction shape** | Context actions have direct, expand/target choice, confirm, and extended activity patterns; state and eligibility owned by domain, not generic UI. | One shared **presentation** grammar: action label, target, state, why blocked, known cost/time, consequence preview, confirmed result and associated owner/panel. | Reuse exact current Travel, Explore, Approach, Combat, Rest, Soundings and item calls; never a second command registry. |
| **AREA-QST-04: task/reward and posting endpoint** | Board → Browse list → offer card → Accept; authorized recipient → separate Submit, with issuer/offer/evidence identity and one-time receipt. | For current Soundings, show an active objective, destination, progress, `Open Quests` / `Continue Activity` shortcut, and owner-confirmed submission readiness. Keep UI ready for future entity cards. | Do not fabricate a present NPC, contract board, issuer, guild clerk, market or generic Turn In owner. |
| **AREA-TRV-05: local leave/travel context** | Ordinary open settlements are **not** globally quest-gated; travel requires actual route, destination knowledge and current constraints. Map pixels are not location identity. | Put `Leave / Travel` in Area; show only eligible known destinations and authoritative preview, source reason/risk/time; cross-link Atlas reference. | No invented toll, ferry, weather, papers, permissions, rapid travel or interactive atlas teleport. |
| **AREA-PLACE-06: display identity precision** | `location.ashen_reef` is a travel compatibility key to a survey anchorage connected with Starfall, **not** a canonical independent settlement ID. `siteLabel` is not a canonical site ref. | Derive title from accepted location owner, with transparent fallback hierarchy and source/precision descriptor. Design `PlaceBreadcrumb` separate from mutable place hierarchy. | Do not infer region/district/site/interior from name, map pin, quest key or survey label. |
| **AREA-FEED-07: recent consequences** | Session Chronicle capped at 48 and includes UI-ready prose; not a universal append-only immutable history. Discovery/run/quest histories have narrower authority. | Render a bounded, clearly `Recent` event list from safely source-linked actual accepted event/notice fields, with `Open Chronicle` link. Keep acceptance/rejection distinctions. | Full local historical log/manuscript, actor causal narration and repeat compression need durable retained event/source/visibility owner. |
| **AREA-CBT-08: text-first active encounter** | Legal action and target list, current encounter, resource/time state and terminal results already exist; distinctions between queued, resolved and applied effects are needed. | Reserve an **active encounter mode** that supersedes travel/Explore, displays actual legal action, target, cost, timing and observable state; neutral fallback when fine effect detail unavailable. | Reopen held result-disclosure only through named combat route; no UI-derived damage, HP, RNG or loot. |
| **AREA-BODY-09: recovery and consequences** | Body/resource/readiness and settlement Rest exist. Normal-Stakes recovery is an authoritative state path; full injury/treatment/restoration is designed but not executed. | Show resting eligibility, fatigue/condition warning, resource/time preview and actual defeat/recovery consequence; priority status on Area. | No pretend doctor/medication/restoration, permanent-injury preview or generic `Heal` action until health owners exist. |
| **AREA-ACT-10: activity depth** | Depth 0 automatic through Depth 5 operation/project distinguishes routine action, bounded decision, short trial and project; familiarity/reliability distinct from base skill. | Area action layout should support compact direct action now and expandable/confirm/activity states later. Avoid forcing every task into repeated dice rolls or one huge submenu. | No generic depth selector/minigame/attempt records before owned activity attempts; current survey shifts retain their exact action path. |
| **AREA-STATIC-11: local people, service and station visibility** | People-only seed plan recommends no NPC overlay without canonical person/presence; settlement site plans are not live interactables. Management operations distinct from world interactions. | Reserve **optional** scene card type for observed people/place/station, controlled by actual presence and player knowledge; sensible absent/unknown state. | No generic Talk/Trade/Pay/Use Board, scheduled NPC or service based solely on static settlement, guild or role text. |
| **AREA-ART-12: image/overhead map mode** | UI IA recommends one prominent asset, meaningful alt/fallback, no busy text-over-art. Ecology feature geometry can be point/patch/linear/edge/volume. | Prepare a **place-specific asset brief** and art fallback; illustrations can represent atmosphere without claiming precise walkability. If there is no local spatial data, hide zoom/pins or move geographic map viewer to Atlas. | Do not generate a canonical overhead layout, coordinates, player marker, floor plan or clickable object from invented imagery. |
| **AREA-QA-13: default-on developer testing** | PR #22 adds a default-visible Dev button, currently only read-only inspection; PR #23 captures Echo/popover/spawn parity and time-owner risks. | QA scenario checklists for Start, travel, encounter, Rest, quest and restart; visible default-on Dev after integrated acceptance. | Time, item grant, weather and forced encounter require their own typed source/simulation authority; don't mutate snapshot in React. |
| **AREA-DIF-14: campaign configuration** | `Story/Favored/Mortal/Forsaken`, `Heroic World/Grim World`, and stakes are distinct future axes; Mortal defaults, Ironbound stakes are not approved. | Design Area warning/detail displays to read current enabled rules from actual campaign config, not treat perceived harshness as a difficulty level. | Do not pull full world-rules or new death/save stakes implementation into Area UI or label an unknown campaign `Grim World`. |
| **AREA-SKILL-15: skill/knowledge implications** | 121 skills, soft gates and mastery/trials with explicit earned vs starting source; later familiarities may be per method, material and site. | After an accepted activity, display **only** available earned-skill/knowledge evidence and a link to Character/Chronicle. No backstory starter Echo credit. | Trial prompts, tier names and family Hunter unlocks wait on real evidence/eligibility owners, not a mock local success alert. |

## 3. Highest-risk hidden dependencies for current Area UI

### D1. Place title and geographic certainty can conflict

A current travel compatibility key is not necessarily an exact site or a canonical settlement. Example from the quest travel-access product decision: `location.ashen_reef` denotes the Ashen survey anchorage/approach attached to the Starfall context. Therefore, a title resolver must not naively display the travel key's humanized slug as verified current location **or** always fall back to the player settlement while hiding a valid more precise accepted arrival context. First require the source owner's location semantics. If only `regionId` or `settlementId` exists, show that level and disclose uncertainty.

Tests: Starfall port in settlement, Ashen survey anchorage with siteLabel and no canonical site id, Stonevein nearby exploration context, region-only character, changed travel head/revision, unknown destination and Atlas selection. These are **distinct** read/view cases; selecting an Atlas entry never changes present-tense Area title.

### D2. Environment data can become a false interactable if source tiers collapse

The ecology plan supplies point, patch, linear, edge and volume shape semantics. The *first* Area projection can use observed environmental descriptions and shape as presentation, while a real clickable Gather/Search/Cross/Enter action requires current observed target identity, access, tools, permission, environment and body owner. A biome/resource likelihood or a future location-recognition clue may contribute atmosphere **without** minting a stream/farm/merchant/herb pile in a scene.

For future resource-to-item loop, add at least forest, open steppe and tidal/river contrast tests even if only one authored location becomes playable. An estuary is not automatically safe drinking water; a coastline is not automatically boat access.

### D3. "Recent activity log" must not imply immutable player history

The `living-character-manuscript-design-boundary.md` specifically says the capped session Chronicle feed is **not** an immutable canonical event log, and quest journal prose is not general history. A small Area **recent** panel may display currently backed notices/Chronicle/accepted outcomes, but do not synthesize local-timestamp/cause from UI text, persist a duplicate journal or claim unlimited historical replay. If an authoritative event lacks geography, label it `Recent`, not `Events in this place`. Post-restart rederive from whatever owner has actually retained.

### D4. A compelling place image is not location authority

If designers prepare local art/overhead images, store provenance and `illustrativeConcept` status. The source hierarchy determines label/knownness/interaction. Use one art panel, descriptive alt text, fallback when not found and adjacent accessible action cards. Don't retain the old decorative world pin-canvas just to pretend an area map is implemented. Canonical spatial/geometry data may later support a true local map, but not vice versa.

### D5. Source-specific quest and combat remain cross-area lifecycle actions

Travel, Soundings progress, a recent encounter and defeat/recovery must not result in two competing action states. Current actual action owners remain World/Activity/Quests/Character/Combat calls moved/relinked from Area presentation. A blocked quest, interrupted shift or active fight must reproject the Area primary action **after** the accepted mutation at the latest campaign head. During an active encounter, do not leave unrelated travel/rest actions visibly executable without owner approval.

## 4. Proposed revised staged work packages

### PULL-A: Area source projection and identity hardening (lowest risk, highest immediate benefit)

Typed read-only `CurrentAreaScene` carrying `campaignHead` / `revision` / `tick`, canonical coarse place identity, known precision, source display name, observational condition statements, localized true environmental summary, actual available action descriptors, safe source-backed last accepted outcomes and links to Atlas. Start with five Area states and five contrasting environment visibility fixtures. No new persisted scene state and no new gameplay command.

This is a **good early pull-forward** even before Combat `DEV-0.7.2.13`, because it can remain read-only. Actual UI activation needs a named decision on the held combat-selected route; a source-only draft does not bypass it.

### PULL-B: Area interaction anatomy and Atlas travel cross-links

Once PULL-A is source-verified, implement the Area default navigation (no extra Home), real title/environment/quest/combat priorities and owner navigation shortcuts, World submenu removal, Atlas known geography browse, travel destination picker in Area and actual action result/blocked reason. Preserve current real call path, selected campaign session and Save/restart. First action may route to an existing owner page rather than introduce another command adapter.

This is the main **playable user-visible shell** payoff.

### PULL-C: Story/feel with strictly truthful recent consequences

Add concise condition summaries, accepted result disclosure and 3–6 real recent events with Chronicle route, same selected head/knowledge scope. Refuse to invent exact damage, nearby NPC, injury/treatment, location of events or authored narrative motive. Combat result disclosure stays a named separate owner slice as required.

### PULL-D: One live environmental resource encounter

Following gear/stack/Save authority, select **one** actually authored reachable resource instance and a bounded gather method/attempt, yielded object/stack, depletion, one simple craft/use output and honest action feedback. Select based on source-backed place and actual resource content after audit, not by writing flavor first. Test non-forest ecology in resolver even with one playable location.

### PULL-E: Later entity interactions and social/economy systems

Only once real person/station/service/stock identity and permissions exist: visible contract board opens Browse directly; posted offer opens its one acceptance owner; separate valid recipient settles turn-in; stationary merchant/workshop uses respective transaction/process owner. Physical world actions stay on Area; administrative ledgers remain management domains. No "Interact" button that opens a universal fake service sheet.

## 5. Release-style acceptance checks for the next Area/Atlas UI

| State | Proof from actual selected UI | Absent/negative test |
| --- | --- | --- |
| Fresh founder/first area | Arrives at correct named current place and shows authentic environmental context, current resources and at least one actual navigation/action path | Zero/unknown fine-grained site is not guessed; Atlas remains known-only |
| Different biome (dry scrub versus coast) | Descriptions and pictorial metadata differ based on canonical source, not a single forest template | No fake `Gather/Drink/Camp` generated from biome tags |
| Soundings offer/active/return | Context appropriately routes Accept, known Travel, actual Shift and exactly once Submit | No generic NPC/station invented, no duplicate 5g reward |
| Encounter in progress | Legal combat dominates Area actions and links back after Normal-Stakes recovery | No fabricated target HP/attack effect; blocked travel not advertised as legal |
| Rest/body fatigue | Accurate warning, known projected time/resource effect, accepted result and updated Area | No pretend injury treatment, healer or forecast from absent state |
| Travel versus Atlas | Atlas browsing changes selected reference only; real admitted Travel changes named Area and context | Invalid destination, stale revision or hidden place cannot move player |
| Recent accepted events | Finite actual source-backed feed and Chronicle link; order preserved after Save/restart to extent currently retained | No fabricated local source, chronology, infinite history or debug fixture leakage |
| Site art absent | Readable place description and actions still present, no large empty map box | No fake coordinate/pin interaction or graphics dependence |
| Expanded action / mobile | Confirm states, keyboard focus and narrow layout maintain next action discoverability | No submenu maze, offscreen button or phantom side panel |

## 6. What remains parked despite seeming useful

- Location recognition clue/occurrence mutation, durable observation history, local grid/enterable buildings, dynamic weather and time-of-day environmental effects;
- NPC person overlays, scheduler, conversation, shops, guild entry, law/ownership checks, random events and service economy;
- full health/care/trauma/restoration, severe survival mode, death/stakes and permanent harm;
- full dynamic activity-depth selector, knowledge trials and magic study;
- broad scene-art generation, clickable site maps, autogenerated POIs, map-reveal changes;
- full manuscript generation/AI prose or permanent new Chronicle event store;
- generalized gathering/production/economy, property, vessels/transport, construction and settlements management.

Each parked system has a concrete **reopening condition**, not a blanket denial of future UI placeholder layout. The current user goal is a **functional local gameplay surface using what already works**.

## 7. Route disposition

Attach to review-held [PR #24](https://github.com/vagabond1215/Lineage_Reforged/pull/24) as additional owner-source preplanning. Do not merge into `master`, install a new active Codex prompt, execute game code, alter current selected runtime, issue a geographic/asset generation job, or touch PR #19–#23, held combat `DEV-0.7.2.13`, origin/saves or Game version. Next Codex preparation may consume PULL-A source projection work as a separate staged artifact, but source/read-only prework does not imply selected-client acceptance.
