# UI Information Architecture Boundary

Version: `Version 0.6.1.2 - UI Information Architecture Research Integration`

Date: 2026-07-13

Status: approved permanent design boundary; documentation only; no UI or runtime implementation permission

## 1. Status, Scope, And Authority

This document is the durable UI information-architecture boundary for Lineage: Reforged. It reconciles `GPT-DR.ui.information-architecture` against the live six-domain shell, current snapshot/view-model owners, engine-owned command transition, combat/tactics contracts, and existing design decisions.

It controls future presentation planning where it is more specific than older UI-prep documents. It does not override live code, authored content, shared contracts, engine ownership, save ownership, or newer Codex handoffs. It is not a React implementation plan and does not authorize a broad shell rewrite.

## 2. Current Repository Reality

- `InGameShell.tsx` currently routes six domains: Character, World, Activity, Codex, Quests, and Chronicle.
- `AppLayout.tsx` provides a top band, left navigation region, and active panel. Domain panels often subdivide their own content into a section list, main list/content, and detail stack.
- `TopStatusBar.tsx` currently presents character identity, calendar/climate context, condition, HP/MP/stamina meters, notifications, and settings/save utilities.
- `uiViewModel.ts` projects the six domains from `SaveSnapshot` and account state. It also exposes some raw source-reference diagnostics that are useful during foundation work but are not normal final presentation.
- `InGameShell.tsx` owns selected domain and other ephemeral presentation state. It also currently mutates pinned record ids directly in the snapshot; future pin/search/history ownership requires a focused decision.
- World travel and quest acceptance are engine-owned. Quest tracking is the selected next engine-owned consumer. Other Activity, rest, and quest lifecycle mutations still remain in the UI gameplay bridge.
- World, Character, Activity, Codex, Quests, Chronicle, combat, notifications, and persistence are distinct owners. Cross-navigation must not collapse them.
- Combat already uses per-tick encounter, action lifecycle, timing, targeting, tactics, control-mode, queue, pause, and manual-override contracts. There is no combat screen in the current six-domain shell.
- The active font tokens use `Arial Nova`, Arial, and Segoe UI fallbacks for both body and display text.

## 3. Design Principles

1. Present one primary context at a time.
2. Keep the shell responsible for routing and presentation, never gameplay resolution.
3. Project owner-controlled state, eligibility, timing, costs, and consequences through read-only view models and engine contracts.
4. Preserve the six-domain shell as the baseline and use progressive disclosure inside each domain.
5. Make text the primary gameplay medium; use art to identify, orient, and establish atmosphere.
6. Preserve uncertainty and provenance rather than presenting every record as equally known or current.
7. Keep engine timing authoritative; visualization must never become a second clock.
8. Make automation legible, explainable, and temporarily overridable.
9. Keep global chrome limited to genuinely global or safety-critical information.
10. Treat accessibility behavior as part of each component contract.

## 4. Persistent Shell Model

The intended persistent shell has exactly three regions:

1. a compact global top band;
2. a compact left navigation rail;
3. one main content pane.

The top band carries compact identity, time/place context, condition/readiness, notifications, and utilities. Its content may become mode-aware during combat, but it must not become a strip for every resource or timer.

The left rail retains labeled access to the six primary domains. It should become denser than the current tall card-like navigation while retaining icon-plus-label presentation, visible selection, keyboard support, and accessible names.

The main pane replaces its primary context when navigation changes. A selected character record, settlement, quest, Chronicle event, activity, or combat encounter becomes the primary surface rather than accumulating beside unrelated panels.

At most one temporary drawer, popover, modal, or decision surface may sit over these regions. Temporary context must have an obvious return path and must not become gameplay authority.

## 5. Primary And Secondary Navigation

Primary navigation remains:

- Character
- World
- Activity
- Codex
- Quests
- Chronicle

Home should be a dedicated compact home affordance associated with the game/character identity area, and Home should be the default re-entry surface when a session opens. It is not a seventh equal-height domain card. Clearing a selected domain should return Home rather than an empty pane.

Inventory, Equipment, Map, Relationships, Factions, Companions, Holdings, and similar systems remain secondary sections or linked owner pages until frequency, owner maturity, and prototype evidence justify promotion.

Within a domain, choose one secondary pattern: a short section list, a small sibling-tab set, filters/sort, or expandable groups. Do not nest tabs inside tabs. Search results and cross-links open the owning domain while preserving a return path.

## 6. Home / Re-Entry Surface

Home is a calm orientation surface that answers:

- Who am I?
- Where am I?
- What is happening now?
- What needs attention?
- What can I reasonably do next?

Immediately visible:

- compact character identity and condition;
- current place and time;
- current activity, travel, encounter, or rest state;
- one primary objective or unresolved situation;
- a small actionable attention list;
- two or three clear resume/inspect actions;
- optionally one portrait, token, crest, local illustration, or map fragment.

One interaction away:

- full quest lists and objective history;
- inventory and equipment detail;
- all operations and timers;
- complete Chronicle feed;
- detailed attributes, skills, standing, and reputation;
- all notifications and all available actions.

Home does not compute eligibility or mutate state. Its actions route to owner pages or invoke already-authoritative commands.

## 7. Linked-Record And Search Model

Use a common presentation shell without creating a common canonical owner. A linked record projection may include type, stable id, title, summary, asset/fallback, known-state label, provenance, related records, recent relevant events, and owner-routed actions.

Future global search returns typed results such as Character, Place, Quest, Chronicle Event, Activity, or Codex Entry. Each result carries its owner destination and a short context label. Search indexing is a read-only projection and must not become a universal record store.

Linked terms may open a short contextual preview. Full inspection opens the owning page. Navigation must preserve browser-like back/forward or an explicit return path, plus a bounded recent-record history. Bookmarks/pins remain presentation state only after their storage and ownership are explicitly decided.

## 8. Domain And Ownership Matrix

| Concern | Current/future owner | UI responsibility | Forbidden collapse |
| --- | --- | --- | --- |
| Shell navigation and selected panel | local UI state in `InGameShell.tsx` | route and preserve return context | gameplay or save authority |
| Character | `playerState` plus account/family owners where applicable | project identity, condition, attributes, skills, equipment, inventory, standing, discoveries | treating selected character as another owner's evidence |
| World and geographic knowledge | authored world owners, `playerState.location`, geographic Knowledge, `sessionState.knownLocations` | present known place, routes, map layers, and travel commands | map/UI as place, reveal, or travel authority |
| Activity and operations | `sessionState.currentActivity`, activity records/operations, future engine commands | present state, queues, blockers, previews, and commands | UI-authored progress or rewards |
| Codex records | `sessionState.codexEntries` and specific authored/reference owners | reference presentation, certainty, provenance, filters, links | universal ownership of people, places, quests, or history |
| Quest journal | `sessionState.questJournal`, tracked quest state, engine command owners | offers, active/completed/failed states, objectives, blockers, command affordances | authored quest definition or Chronicle ownership |
| Chronicle history | session Chronicle and distinct account/run-history owners | readable timeline, filtering, linked outcomes | raw event dump or quest duplication |
| Combat encounters and commands | `gameState.activeEncounter`, combat engine, shared combat contracts | project state/timing and submit authoritative commands | a UI-owned clock, formulas, targeting, or resolution |
| Combat timing | encounter/action timing fields | readable relative timing, exact accessible labels, ordered projections | canonical Speed or UI ATB authority |
| NPC tactics and targeting | tactics contracts and combat engine scoring | edit supported preferences and explain projections | ordered condition/action interpreter without a new contract decision |
| Notifications | session notifications plus transient presentation feeds | prioritize, group, dismiss where owned, and avoid badge pressure | creating durable history or gameplay facts |
| Persistence | save snapshot engine, serialization, browser save/account managers | expose save utilities and state feedback | interpreting or mutating gameplay outcomes |
| Image assets | active UI public assets and content-owned map/reference assets | render with consistent crops, fallbacks, labels, and alt text | art as essential state or canon |
| Future search/history | dedicated read-only UI indexing/navigation owner | typed results, recent path, back/forward | new canonical entity store |
| Future player notes | unresolved storage, scope, and edit-history owner | defer until contract exists | using current authored notes fields as player-editable storage |

## 9. Codex And Knowledge Presentation

Codex is a living reference interface for records it owns or projects. It is not the owner of every character, place, quest, activity, or historical event.

Codex presentation should distinguish discovered, partially discovered, and unknown records and may represent confirmed, observed, inferred, rumored, contradicted, and outdated claims when the underlying owner provides those states. Provenance must identify sources rather than infer certainty from visibility.

Updated entries should show what changed and link to relevant owner pages. Filters may include category, region, source, certainty, and update state. Search and pins are future UI capabilities. Asset fallbacks must retain title/type/status information.

Player-authored notes are deferred. Existing `notes` fields and Codex note-category records are authored/runtime data, not permission to create editable player-note storage.

## 10. Text-First Combat Presentation

The default combat surface projects the existing live per-tick encounter model without requiring an overhead, isometric, sprite, or 3D battlefield.

Required presentation vocabulary:

- allied and enemy combatant rows using portraits, tokens, silhouettes, or labeled fallbacks;
- HP, MP, stamina, statuses, role, control mode, target, and threat/focus indicators;
- queued, executing, channeling, recovering, resolved, interrupted, and cancelled action states;
- exact projections from `readyAtTick`, `startedAtTick`, `resolvesAtTick`, `recoveryEndsAtTick`, channel end, and interrupt-window timing;
- ordered action queues and current action summaries;
- manual command choices with targets, costs, blockers, timing preview, and append/replace queue behavior;
- pause availability derived from encounter/mode state;
- concise chronological combat events/log output, with filters and expandable detail;
- optional scene art or an abstract formation strip as secondary context.

Meters may supplement timing but must have exact text equivalents such as “Ready now,” “Resolves in 2 ticks,” or “Recovering; ready in 1 tick.” The UI must not add a canonical `Speed` attribute, change DEX/AGI/VIT or action/recovery math, introduce a separate ATB clock, or assume a fixed party-size cap.

## 11. Tactics And Gambit-Style UX Boundary

The player intent for Final Fantasy XII-like party control is preserved as an interaction goal. The current authority remains the repository tactics model:

- tactical roles;
- action-family biases;
- healing, interrupt, conservation, buff, debuff, area, single-target, melee, ranged, and magic preferences;
- preferred spell schools, elements, and tier;
- resource-conservation thresholds;
- target preference rules and weights;
- focus, ignore, priority, and deprioritized directives;
- AI/manual control mode;
- tactics presets;
- temporary manual overrides.

The UI may translate those values into editable controls and readable statements such as “Prioritize interrupting enemies that are casting” or “Conserve MP below 25%.” It should show which preference contributed to a choice where the engine exposes enough explanation.

Literal ordered condition/action gambits are deferred. They require a separate authority, ordering, validation, conflict-resolution, persistence, and runtime-interpreter decision; this document does not authorize one.

## 12. Screen-Level Specifications

| Surface | Primary content | Secondary content | Key constraint |
| --- | --- | --- | --- |
| Home | identity, place/time, current state, one objective, attention, next actions | recent meaningful events and one scene asset | no dashboard sprawl |
| Character | identity, readiness, active effects, selected character section | skills, inventory, equipment, traits, geographic knowledge, standing, reputation, titles, discoveries | do not show every section together |
| World | current place, known geography, selected destination/record, travel state | routes, settlements, services, overlays where owned | map is presentation, not authority |
| Activity | current work/operation, blockers, progress/next step | employment, business, crafting, trade, contracts, queues | avoid simultaneous timer overload |
| Codex | search/category or selected owned reference | provenance, certainty, updates, links | do not duplicate other domains |
| Quests | selected offer/quest, state, objectives, blockers, tracked status | outcome history and linked Chronicle | engine-owned commands only as they land |
| Chronicle | dated event/timeline and consequences | linked people, places, quests, discoveries, combat, trade, reputation | curated history, not raw event dump |
| Combat | combatants, resources/status, actions/timing, targets, commands, automation, log | scene art and expanded tactics | text-first and engine-timed |
| Search | typed grouped results with owner/context | filters, aliases, recent results | never flatten ownership |

## 13. Interaction Patterns

- Main-pane transitions change primary domain or record.
- Section lists or a small tab set switch sibling views under one owner.
- Inline expansion reveals optional detail without changing primary context.
- Tooltips define short terms; popovers preview short linked records.
- A single drawer may hold temporary filters, comparison, or tactics editing.
- Modals are reserved for destructive confirmation, blocking decisions, or focused forms.
- Disabled actions remain visible when their engine-provided blocker helps the player.
- Consequential confirmation is used only when accidental activation is materially harmful.
- Focus order follows reading order; shortcuts are labeled and discoverable.

## 14. Visual Asset Strategy

Use portraits for important characters; tokens or silhouettes for combatants and compact map/encounter representation; crests for families, factions, institutions, and holdings; illustrations for selected places/events; icons for structures, services, items, and statuses; map art for spatial orientation.

Each asset family needs consistent crop, aspect, border, loading, missing, unknown, and locked behavior. Use at most one dominant image region on ordinary reading pages. Essential information must remain in text, labels, status, and accessible names. Do not place busy art behind body copy or let framing materially reduce reading space.

## 15. Typography And Visual Hierarchy

Retain current font-token compatibility: `Arial Nova`, Arial, and Segoe UI fallbacks remain the baseline until a dedicated brand/typography pass changes them. Decorative manuscript or serif treatment may later be used narrowly for headings, quotations, heraldry, and special records, never as required body text.

Target approximately 55–75 characters per line for prose. Establish hierarchy primarily through spacing, headings, weight, and selected-state contrast. Use panels and borders sparingly. Use semantic color roles and pair every status color with text, icon, pattern, or shape.

## 16. Accessibility Baseline

- keyboard access for all navigation, search, commands, filters, and combat controls;
- visible focus and predictable focus return after overlays or linked navigation;
- scalable text and reflow without loss of actions or status;
- semantic landmarks, headings, lists, tables, meters, and button labels;
- high-contrast and reduced-motion modes;
- non-color status communication;
- screen-reader labels for icons, tokens, meters, targets, timing, queue position, and assets;
- restrained live regions for notices and combat events, with user-controlled log review;
- exact combat timing and action state available without animation;
- minimum usable target size and no hover-only required information.

## 17. Reusable Component Inventory

- primary and section navigation items;
- compact top-context cluster;
- Home summary/attention/action blocks;
- entity header and portrait/token/crest block;
- status chip/list and resource/readiness meter;
- linked-record text/preview and return-history control;
- record list row, typed search result, filter/sort bar, and empty/unknown/locked/updated states;
- detail group/accordion and provenance/certainty marker;
- quest objective, Chronicle event, location/route, structure/service, and operation rows;
- combatant, action/timing, command-option, tactics-preference, target-directive, and combat-log rows;
- notice/banner and one-overlay primitives.

Every reusable component must identify its data source, interaction owner, states, accessibility behavior, fallback behavior, and forbidden authority uses.

## 18. Anti-Clutter Rules

An element deserves permanent visibility only when it is broadly relevant or safety-critical, one-interaction delay would materially harm orientation/decisions, it has one clear owner, it remains readable at minimum resolution and supported text scale, and it does not demand continuous attention.

Enforce:

- no more than three persistent regions;
- no nested tabs inside nested tabs;
- no multiple simultaneous drawers or overlays;
- no permanent full quest list;
- no raw debug/source-reference values in normal presentation;
- no duplicate resource or status displays without a mode-specific reason;
- no decorative framing that materially reduces reading width;
- no unbounded list of every action outside its context;
- no notification-dot accumulation without actionable meaning;
- no top bar dominated by every currency, resource, operation, or timer.

## 19. Responsive And Technical Constraints

Desktop browser play remains the initial design context, but layouts must not assume a single fixed width. Define and test a minimum supported viewport before implementation. At narrower widths, the left rail may collapse to a labeled temporary navigator, but primary context and keyboard access must remain intact.

Build from owner-aware read-only view models and explicit command contracts. Selected ids, filters, expanded sections, search text, return history, and open overlays are presentation state. Stable record ids enable links but do not imply a universal schema. Plan for longer localized labels and multiline content.

Do not begin a broad shell rewrite while runtime mutation authority is still being extracted from the UI bridge.

## 20. Adopt / Adapt / Defer / Reject Matrix

| Recommendation | Decision | Repository reconciliation |
| --- | --- | --- |
| Stable left navigation | Adopt | preserve six domains; compact the current tall cards in a later UI pass |
| Compact global top band | Adopt | keep identity, time/place, readiness, notices, utilities; prevent resource-strip sprawl |
| One main content pane | Adopt | replace primary contexts rather than accumulating unrelated panels |
| Calm Home dashboard | Adapt | dedicated home affordance/default re-entry, not a seventh equal domain |
| Cross-record linking | Adapt | shared presentation and owner-routed links, never one universal entity owner |
| Global search | Defer | requires typed index, routing, ownership, accessibility, and history design |
| Recent history/back-forward | Defer | add with linked navigation after UI-state ownership is defined |
| Bookmarks/pins | Adapt | useful, but current direct snapshot mutation needs a focused ownership decision |
| Player notes | Defer | requires storage, scope, editing, revision, and provenance ownership |
| Living Codex with certainty/provenance | Adapt | apply only where underlying owners expose those states |
| Codex owns all people/places/quests/history | Reject | retain federated Character, World, Quests, Chronicle, Activity, and Codex owners |
| Text-first combat with tokens/timeline/log | Adopt | directly projects current combat contracts |
| Rendered overhead/isometric battlefield | Reject | not required for readable current combat and not authorized |
| UI-owned ATB/Speed model | Reject | project engine ticks and existing timing fields; do not invent math or attributes |
| Fixed three-person active party | Reject | no current contract establishes a cap |
| Gambit-like readable automation | Adapt | translate current roles/biases/preferences/directives into understandable statements |
| Literal ordered gambit interpreter | Defer | requires a separate runtime and contract authority decision |
| OGame/Torn stable workflows, queues, logs | Adopt | use predictable navigation, ordered state, concise logs, efficient return visits |
| OGame/Torn table density, timer spam, urgency | Reject | conflicts with calm, accessible, non-monetized presentation |
| Narrative/strategy/tabletop selective art and linked records | Adopt | use as text-supporting identity and orientation, not authority |
| Desktop-only fixed layout | Reject | desktop-first may still be responsive and scalable |
| Accessibility as later polish | Reject | accessibility is a component/readiness baseline |

## 21. Prototype Sequence And Validation Questions

1. Home plus compact shell navigation.
2. Linked record flow: Chronicle event → character → settlement → quest → return.
3. Codex/knowledge certainty, provenance, updates, and owner links.
4. Text-first combat with roster, timeline, queue, targets, commands, and log.
5. Tactics editor over current role/bias/preference/directive contracts.
6. Activity/operation queues without timer overload.
7. Responsive, large-text, keyboard, high-contrast, and reduced-motion variants.

Validate whether players can identify current context and next action, understand what changed after returning, predict combat readiness and NPC choices, inspect linked records and return without losing context, distinguish knowledge certainty, and remain oriented as systems unlock.

## 22. Readiness Gates

Before implementation:

- runtime/UI mutation ownership for the affected surface is explicit;
- a read-only view-model contract exists or is planned;
- Home placement and state restoration are prototyped;
- typed link/search destinations preserve owners;
- minimum viewport and text scaling are defined;
- keyboard/focus/live-region behavior is specified;
- asset fallbacks are defined;
- combat UI uses live timing/action/tactics contracts without new math;
- tactics editing maps exactly to supported fields;
- focused parity and accessibility checks are identified;
- one narrow UI slice is selected instead of a broad rewrite.

## 23. Explicit Non-Goals

This boundary does not implement or change React components, CSS, theme tokens, navigation, Home, search, links, notes, pins, UI persistence, combat runtime/math, attributes, action timing, tactics scoring, ordered gambits, party size, commands, saves, schemas, content, tests, assets, migrations, compatibility behavior, multiplayer, mobile-first redesign, or the active runtime-ownership sequence.

It also does not introduce class/job gates or make map geometry, Codex visibility, selected ids, or UI state into gameplay evidence.

## 24. Future Implementation Sequence

1. Continue the selected `Version 0.6.2 - Engine-Owned Quest Tracking Command` runtime route.
2. After further UI-authored mutation seams are removed, run a read-only shell/UI-state ownership audit covering Home, pins, overlays, navigation restoration, and current source-reference diagnostics.
3. Prototype Home and compact navigation without production routing changes.
4. Define linked-record/search/history UI contracts without persistence changes.
5. Prototype Codex certainty/provenance using only currently owned states.
6. Define a combat presentation view model over existing encounter/timing/tactics contracts.
7. Prototype the text-first combat and tactics surfaces.
8. Implement one narrow, validated UI slice only after its owner, accessibility, responsive, and parity gates pass.
