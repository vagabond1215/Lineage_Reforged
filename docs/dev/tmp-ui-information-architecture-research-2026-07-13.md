# Temporary UI Information Architecture Deep Research

Source route: `GPT-DR.ui.information-architecture`
Date: 2026-07-13
Status: conditionally accepted non-canonical research input; temporary; no implementation permission
Named integration consumer: `Version 0.6.1.2 - UI Information Architecture Research Integration`, only after `Version 0.6.1.1 - Engine-Owned Quest Acceptance Post-Transition Audit` is accepted; if `0.6.1.2` is required for a repair, use the next free support suffix without displacing the selected primary runtime consumer
Removal condition: delete this file after useful guidance is corrected against live repository owners and promoted into durable design authority, or retain it only with one explicit remaining consumer and removal condition

## 1. Intake Verdict

The Deep Research report is acceptable as broad design input, but not as repository authority and not as a direct implementation specification.

Its strongest conclusions align with Lineage: Reforged:

- a stable, ordered left navigation;
- a restrained global top bar;
- one immediately relevant main content surface;
- a calm re-entry/home surface rather than a stat dashboard;
- text-first presentation supported by selective portraits, tokens, icons, crests, illustrations, and maps;
- connected entity navigation across characters, places, factions, records, quests, and history;
- progressive disclosure instead of permanently open secondary panels;
- accessible typography and keyboard-first interaction;
- a live per-tick combat presentation with visible timing, action queues, and party automation;
- browser-game lessons from OGame, Torn, and similar text-oriented games: stable information architecture, dense but ordered records, low animation, repeatable workflows, and clear action-state feedback.

The report also contains recommendations that must be corrected or rejected during integration:

1. It sometimes describes a conventional overhead/isometric battlefield with character models, damage popups, and a translucent action HUD. Lineage: Reforged is not committed to a fully rendered battle client. Combat presentation should default to a text-first encounter surface with tokens, portraits, status rows, action queues, timing tracks, and optional scene art.
2. It treats combat as a simple Final Fantasy XII-style ATB gauge driven by one `Speed` stat. The repository already has tick-native timing fields, execution and recovery durations, action and recovery multipliers, DEX/AGI/VIT-related combat data, equipment and skill hooks, queued actions, interrupts, manual overrides, and AI scoring. UI should project repository timing rather than invent a second combat clock or a new canonical Speed attribute.
3. It proposes literal ordered if/then gambit rows as if that model were already authoritative. The current repository owns tactics through roles, biases, spell preferences, target preferences, focus directives, control mode, presets, and manual overrides. A future player-facing gambit editor may expose those concepts as readable rules, but the integration must not silently replace the current tactics owner.
4. It suggests fixed party-size assumptions such as three active characters and reserves. No such cap is established by current contracts and should not be promoted.
5. It proposes many top-level navigation entries and may duplicate existing ownership. The current shell already groups Character, World, Activity, Codex, Quests, and Chronicle. Integration should simplify and reconcile, not add every possible system as a permanent button.
6. It treats the Codex as the owner of all people, places, quests, and history. Current repository ownership is distributed: geographic knowledge and world records, quest journal state, Chronicle history, character state, and Codex records are distinct. The desired result is federated cross-linking, not ownership collapse.
7. Its OGame and Torn comparison is directionally useful but shallow. The durable design should preserve the browser-game principles without copying legacy table density, desktop-only layouts, timer spam, or monetization-oriented notification patterns.
8. Several examples use classes/jobs and generic RPG HUD conventions. Lineage is classless where supported and should not introduce class-gated UI terminology without a dedicated decision.
9. The report's source citations are research references, not repository evidence. Every durable recommendation must be checked against current code, contracts, content, and design decisions.

## 2. Central Recommendation

Use a **text-first application shell with contextual modes**.

The persistent frame should contain only:

- a compact left navigation for major information domains;
- a compact top status/context band;
- one main content pane;
- at most one temporary contextual drawer, popover, or decision surface.

The main content pane should be replaced, not accumulated, when the player changes context. A character, settlement, quest, Codex record, Chronicle entry, activity, or combat encounter should each become the active primary surface.

The visual metaphor is an organized living campaign desk rather than an action-game HUD: a chronicle, map, ledger, character record, and tactical encounter sheet connected through stable links.

The shell should support two broad presentation states:

### Exploration and management state

The normal shell presents the selected information domain. It prioritizes reading, inspecting records, making deliberate choices, and starting commands through engine-owned contracts.

### Encounter state

When an active combat encounter exists, the main pane changes to a combat-focused surface. The global shell may remain recognizable, but unrelated panels and navigation noise should be reduced. The combat surface shows current actors, resources, statuses, queued/executing/recovering actions, timing projections, targets, tactical automation, combat log output, and available manual commands. It does not require a fully rendered battlefield.

## 3. Enforceable Design Principles

1. **One primary context at a time.** Do not display unrelated system panels merely because the data exists.
2. **Preserve owner boundaries.** UI navigation and cross-links may connect records but must not merge canonical owners or invent mutation authority.
3. **Project engine truth.** Timing, eligibility, costs, consequences, knowledge, and status must come from authoritative contracts or read-only projections.
4. **Use progressive disclosure.** Start with identity, state, relevance, and available actions; place detail behind tabs, expandable groups, drawers, and linked records.
5. **Keep global chrome genuinely global.** The top band should contain only data that remains useful across most screens or is necessary for immediate survival/combat awareness.
6. **Prefer labels with icons.** Icon-only navigation is reserved for familiar utilities with accessible names and tooltips.
7. **Use text as the primary gameplay medium.** Images identify and contextualize; they do not replace essential state or actions.
8. **Make uncertainty explicit.** Confirmed fact, observation, rumor, inference, unknown, outdated, and contradicted information require distinguishable presentation.
9. **Show timing as a consequence of the simulation.** Combat timing should expose readiness, execution, recovery, interruption, and queue order without introducing a parallel UI-only timing model.
10. **Make automation understandable and interruptible.** The player should understand why an NPC chose an action, what preference or rule influenced it, and when a manual override applies.
11. **Reduce notification pressure.** Use a small number of durable updates and contextual notices; avoid perpetual badge accumulation and flashing elements.
12. **Design accessibility into the component model.** Text scaling, focus states, keyboard navigation, screen-reader labels, contrast, reduced motion, and non-color status cues are baseline requirements.

## 4. Comparable Interface Findings

### Narrative and text-heavy games

- **Roadwarden, Citizen Sleeper, The Life and Suffering of Sir Brante, Fallen London, Sunless Sea/Sunless Skies:** demonstrate that narrative text, concise resource state, selective illustrations, and clear decisions can carry the primary experience. Adopt their focus and pacing; avoid hiding necessary simulation context behind flavor.
- **Pentiment:** demonstrates that typography and manuscript framing can create atmosphere. Use decorative treatment for headings, quotations, heraldry, and special records; keep body text and controls highly legible.
- **Disco Elysium:** demonstrates strong linked terminology, contextual checks, character identity, and text hierarchy. Avoid its intentionally crowded skill-dialogue chorus as a default pattern.
- **Suzerain:** demonstrates a document-oriented political interface and stateful decisions. Avoid overloading every screen with simultaneous national indicators.

### RPG journals and codices

- **Pillars of Eternity, Tyranny, Dragon Age, The Witcher, Pathfinder, Baldur's Gate 3:** demonstrate searchable journals, linked terms, quest states, character records, and lore entries. Adopt cross-references and clear status history; avoid action-RPG HUD persistence and large icon grids where text is more informative.

### Strategy and dynasty games

- **Crusader Kings III:** demonstrates contextual information layers and deep entity linking. Adopt contextual drill-down and relationship links; avoid nested tooltip chains that become the primary navigation method.
- **King of Dragon Pass and Six Ages:** demonstrate advisor-led interpretation, event decisions, and world-state summaries. Adopt in-world summaries and readable implications; avoid forcing the player to consult raw simulation numbers.
- **The Banner Saga:** demonstrates cohesive illustrative identity and clear event framing. Avoid inconsistent UI styles and equal visual emphasis for every control.

### Browser games

- **OGame:** demonstrates stable global navigation, persistent resource awareness, long-running actions, ordered queues, and efficient repeat visits. Adopt queue clarity and predictable information locations. Avoid table sprawl, excessive simultaneous timers, and resource-strip dominance.
- **Torn:** demonstrates deep text-oriented systems, durable navigation, record-heavy character/account pages, searchable activities, and persistent long-term progression. Adopt stable workflows, clear logs, and concise system summaries. Avoid overwhelming new players with every unlocked system at once.
- **Other asynchronous browser RPGs/strategy games:** show the value of consistent locations for timers, activity status, logs, messages, and resources. Lineage should use these patterns for long-running work, travel, crafting, and operations without adopting monetization-driven urgency.

### Tabletop and campaign tools

- **Foundry VTT, Roll20, D&D Beyond, campaign wikis, character sheets:** demonstrate tokens, linked journals, maps, stat blocks, and handout-like records. Adopt the sense of a curated campaign workspace. Avoid the multi-window game-master clutter and tool palettes of a VTT authoring environment.

## 5. Proposed Information Architecture

### Primary navigation

Preserve the current six-domain structure as the starting point:

- **Home** — new re-entry surface; may be represented by a dedicated home control rather than expanding every panel.
- **Character** — identity, attributes, skills, inventory, equipment, traits, standing, reputation, titles, discoveries, and later party/relationship views where ownership supports them.
- **World** — map, region, settlement, routes, travel, local services, and location records.
- **Activity** — employment, business, crafting, trade, contracts, military/naval service, and operations.
- **Codex** — discovered reference records, notes, compatibility/reference material, and indexed knowledge that the Codex actually owns.
- **Quests** — offers, active objectives, tracked state, completed and failed records.
- **Chronicle** — event history and durable historical views.

The final integration should decide whether Home is a permanent first navigation item, a logo/home affordance, or the shell state when no domain is selected. It should not create a second dashboard architecture.

Do not promote Inventory, Equipment, Map, Factions, Companions, Holdings, and Relationships to permanent top-level buttons by default. Keep them as secondary sections until frequency and user testing justify promotion.

### Top band

Candidate persistent data:

- character identity/portrait affordance;
- date, season, watch/time of day;
- current region/settlement or travel state;
- essential condition and HP/MP/stamina readiness;
- notifications/settings/save utilities.

The integration should determine which values are always visible and which are mode-aware. During combat, vital resources and encounter state become primary. During Codex reading, detailed combat metrics should not expand into a large HUD.

### Secondary navigation

Use one consistent pattern per screen:

- section list for large domains;
- page tabs for a small number of sibling views;
- filters/sorting for records;
- expandable groups for optional detail;
- linked entity text for cross-domain navigation;
- breadcrumb/history only where it materially helps return from deep linked navigation.

Avoid tabs inside tabs, multiple simultaneous drawers, and chains of modal dialogs.

### Search and recent history

A future global search should return typed results without moving ownership:

- Character result opens Character/entity presentation.
- Settlement result opens World/location presentation.
- Quest result opens Quests.
- Historical event opens Chronicle.
- Codex-owned record opens Codex.

Provide recently viewed records and browser-like back/forward navigation if linked navigation becomes deep enough to justify it.

## 6. Home Surface

The Home surface answers:

- Who am I?
- Where am I?
- What is happening now?
- What needs attention?
- What can I do next?

Recommended content:

- compact character identity and current condition;
- current place, date/season/watch, and a short authored or projected location summary;
- current activity, travel, encounter, or rest state;
- one primary objective or immediate unresolved situation;
- current party/companions when party runtime supports it;
- three to five recent meaningful events;
- a small number of actionable alerts;
- a selective image asset such as a token, portrait, local illustration, map fragment, or crest;
- direct routes to resume the current activity, inspect the active quest, open the current place, or respond to an encounter.

Do not show the full inventory, all quests, all resources, every operation, and every Chronicle update simultaneously.

## 7. Entity and Linked-Record Model

Use a common presentation shell for records without forcing all records into one schema or owner.

Common presentation fields may include:

- stable id and record type;
- display name and subtitle/type;
- token, portrait, icon, crest, or illustration with fallback;
- short identifying summary;
- current player-known status;
- location or scope;
- related records;
- recent relevant events;
- available read-only links or engine-owned actions;
- provenance/knowledge state;
- tags used for filtering, not exposed as raw implementation metadata unless useful.

Examples of linked flows:

- character -> family/lineage -> settlement -> faction -> Chronicle event -> quest;
- settlement -> structure/service -> operator or NPC -> contract -> route;
- combatant -> monster record -> habitat -> region -> discovery record;
- item -> recipe -> workplace/service -> settlement -> activity.

Linked navigation should retain a return path and should not duplicate the same record into multiple canonical stores.

## 8. Codex and Knowledge Presentation

The Codex should be a living reference interface, not a static lore dump and not the universal owner of all records.

It should support:

- discovered and partially discovered entries;
- source/provenance display;
- confirmed, observed, rumored, inferred, contradicted, outdated, and unknown states;
- updates after events without erasing prior historical context where history matters;
- player notes where storage ownership is explicitly designed;
- cross-links to World, Character, Quests, and Chronicle;
- category, region, source, certainty, and update filters;
- recent updates and bookmarks/pins;
- asset fallbacks.

Contextual linked-term previews may provide a short summary, but important records should open their owning full page. Tooltips should not become miniature nested pages.

## 9. Combat Presentation Model

### Repository-compatible combat concept

Combat is a live per-tick simulation. Actions may be queued, executing, channeling, recovering, resolved, cancelled, or interrupted. Combatants have readiness and current-action timing, action queues, statuses, resources, tactics, targeting preferences, focus directives, control mode, and manual overrides.

The UI should expose these facts as readable projections.

### Primary combat surface

Recommended layout:

- **Encounter header:** encounter/location identity, current tick or readable elapsed-time abstraction, pause state where allowed, and outcome state.
- **Allied roster:** portrait/token, name, role, control mode, HP/MP/stamina, critical statuses, current action, next readiness, and queue count.
- **Enemy roster:** token/portrait or silhouette, known name/unknown label, visible resources according to knowledge rules, statuses, current action, interrupt window, and threat/focus indicators.
- **Action timeline or queue:** ordered projections of actions currently executing, resolving, and recovering. This should be derived from `startedAtTick`, `resolvesAtTick`, `recoveryEndsAtTick`, `readyAtTick`, and queued actions.
- **Manual command area:** action categories, available actions, targets, costs, execution/recovery preview, requirement/blocker text, and append/replace queue behavior.
- **Tactics/automation summary:** current role, control mode, preset, major biases, target preferences, focus directives, resource conservation thresholds, and recent reason for an AI choice where practical.
- **Combat log:** concise chronological messages for action start, resolution, interruption, status, resource change, defeat, and skill gain. Allow expansion and filtering; do not make floating damage numbers the only feedback.
- **Scene asset:** optional illustration, tokens, abstract formation strip, or map fragment. It is secondary to state readability.

### Timing and speed presentation

Do not introduce a canonical `Speed` stat unless a future authority decision does so.

Present timing through derived language such as:

- ready now;
- ready in N ticks;
- executing, resolves in N ticks;
- recovering, ready in N ticks;
- interrupt window open for N ticks;
- queued position N.

A meter may visualize these values, but exact text and accessible labels must also be available.

A future timing design may specify how DEX, AGI, VIT, equipment, skills, abilities, statuses, action profiles, `actionTimeMultiplier`, and `recoveryTimeMultiplier` alter attack cadence. This research does not define that math.

### Party automation and gambit-style UX

The player's stated intention is NPC party control similar in spirit to Final Fantasy XII gambits. The repository currently expresses this through tactical roles and weighted preferences rather than a confirmed literal rule interpreter.

A repository-compatible editor should initially expose:

- control mode: AI/manual;
- tactical role;
- action-family preferences;
- healing, interrupt, conservation, buff, debuff, area/single-target, melee/ranged/magic biases;
- preferred schools/elements/tier;
- resource thresholds;
- target preference rules and weights;
- focus/ignore/priority directives;
- preset selection and save/duplicate controls;
- temporary manual override and return-to-AI behavior.

A readable sentence layer can translate these settings into gambit-like statements, for example:

- Prioritize healing when allies are badly wounded.
- Conserve MP below 25 percent.
- Prefer interrupting enemies that are currently casting.
- Focus the player's current target.
- Avoid a specified target.

A later authority pass may decide whether to add explicit ordered condition -> action rules. This research does not authorize replacement of the current scoring model.

### Combat mode behavior

Normal mode currently permits pause while hardcore does not. The UI should display this rule clearly. Do not conflate difficulty mode, pause policy, and a future Active/Wait naming scheme without a dedicated decision.

## 10. Screen Specifications

### Home

Purpose: reorientation and next action.
Primary: identity, place/time, current state, one objective, current activity/encounter, meaningful alerts.
Secondary: recent events, party summary, one scene asset.
Actions: resume, inspect current place, open active quest, open current activity/encounter.
Clutter risk: dashboard sprawl.

### Character

Purpose: inspect and manage the current character.
Primary: identity, condition/readiness, attributes, role tags, active effects.
Secondary sections: skills, inventory, equipment, traits, geographic knowledge, standing, reputation, titles, discoveries.
Actions: only actions backed by current engine contracts; read-only where authority is not ready.
Clutter risk: showing all sections simultaneously.

### World and location

Purpose: understand place, routes, services, local state, and travel options.
Primary: current region/settlement/location identity, known description, route and travel state.
Secondary: people/services/structures/resources/history through owned records and links.
Actions: engine-owned travel and later scoped commands.
Clutter risk: treating the map as the authority or showing every overlay at once.

### Map

Purpose: spatial relationships and travel planning.
Primary: known geography, current location, routes, destinations, hazards, travel estimates.
Secondary: toggleable political, ecological, economic, quest, discovery, and service layers when data owners exist.
Actions: inspect destination, preview route, issue travel through engine command.
Clutter risk: marker saturation and debug geometry leakage.

### Activity

Purpose: manage current work and long-running operations.
Primary: current activity, progress/state, blockers, expected completion or next step.
Secondary: employment, businesses, crafting, trade, contracts, military/naval, operation queues.
Actions: only engine-owned commands; no UI-authored mutation.
Clutter risk: OGame-style timer and queue overload.

### Quests

Purpose: inspect offers and active/completed/failed state.
Primary: selected quest, current objectives, eligibility/blockers, related records, tracked status.
Secondary: outcome history and linked Chronicle entries.
Actions: engine-owned acceptance and later tracking/turn-in commands as they land.
Clutter risk: mixing offers, active work, and history in one list without state filters.

### Codex

Purpose: consult discovered reference records.
Primary: search/category list or selected entry.
Secondary: provenance, certainty, related records, updates, notes/pins.
Actions: navigation, pinning, and future note behavior only where ownership is explicit.
Clutter risk: becoming a duplicate of World, Character, Quests, or Chronicle.

### Chronicle

Purpose: review meaningful events and outcomes.
Primary: selected dated event or filtered timeline.
Secondary: linked people, places, quests, discoveries, combat, trade, reputation, and other owners.
Actions: filtering, search, navigation, and future presentation-only notes where approved.
Clutter risk: raw event dump and duplication of quest text.

### Faction/standing presentation

Purpose: understand known organization identity, standing, access, and related records.
Primary: crest/name, known status band, scope, key contacts, services/access consequences.
Secondary: related settlements, quests, Chronicle, religion/reputation sections where owned.
Actions: navigation and later engine-owned diplomacy/service commands.
Clutter risk: exposing raw hidden relationship numbers or merging distinct relationship owners.

### Inventory/equipment

Purpose: inspect storage locations, load, equipment, condition, and item detail.
Primary: equipped items and container-organized carried items.
Secondary: weight/volume, durability, proficiency, requirements, related Codex/recipe links.
Actions: only after equipment/inventory command owners are explicit.
Clutter risk: generic icon grid that ignores containers, volume, and provenance.

### Structure/holding

Purpose: inspect a place-bound asset and its current known state.
Primary: identity, owner/operator, location, condition, function, current operations.
Secondary: upgrades, staff, production, events, services, linked records.
Actions: engine-owned commands only.
Clutter risk: turning every simulation field into a player-facing stat.

### Narrative event/decision

Purpose: read a situation and make a consequential choice.
Primary: scene text, involved records, known context, available choices.
Secondary: expandable prerequisites, known costs, risks, and related references.
Actions: choose, inspect linked record, return to the unresolved event without losing state.
Clutter risk: unrelated shell information and hidden failure reasons.

### Combat

Purpose: understand and influence the live encounter.
Primary: combatants, resources/status, current and queued actions, timing, targets, manual commands, automation state, concise log.
Secondary: scene art, detailed calculations, expanded tactics editor.
Actions: queue/replace command, target/focus, manual override, tactics toggle/edit, pause where allowed.
Clutter risk: rendered-HUD assumptions, too many flashing meters, and opaque AI.

### Search results

Purpose: find a known record quickly across domains.
Primary: typed, grouped results with short context and owner destination.
Secondary: filters, aliases, recent results.
Actions: open owning page, pin, return.
Clutter risk: flattening all result types into indistinguishable rows.

## 11. Interaction Rules

- Full-page/main-pane transitions for changing primary entity or domain.
- Tabs or section lists for sibling views within one owner.
- Tooltips for definitions and small explanations, not long records.
- Popovers for short linked previews.
- Drawers for temporary comparison, filters, or tactics editing when return context must remain visible.
- Modals only for confirmation, blocking decisions, or focused forms.
- Inline expansion for optional detail inside a record.
- Back/forward or explicit return affordance after linked navigation.
- One overlay at a time.
- Disabled actions remain visible when the reason is useful; show blockers in text.
- Consequential actions require confirmation only when accidental activation is materially harmful.
- Keyboard focus order follows visual order; common navigation and combat commands should support shortcuts with discoverable labels.

## 12. Visual Asset Strategy

Use assets for identity and orientation:

- portraits for major characters;
- tokens for party, monsters, and map/encounter representation;
- crests/heraldry for factions, families, institutions, and holdings;
- small settlement/location illustrations;
- structure and service icons;
- item illustrations where recognition matters;
- map art and markers;
- selective event illustrations;
- restrained background texture and separators.

Rules:

- one dominant image region per primary page unless the screen is explicitly a gallery/map;
- consistent crop, border, and fallback behavior by asset type;
- no essential information encoded only in art;
- no busy image behind body text;
- decorative framing must not reduce useful reading width;
- tokens and icons must have text labels or accessible names;
- prefer reusable category assets when bespoke art is unavailable.

## 13. Text and Visual Direction

- Body text should target roughly 55-75 characters per line at default scale.
- Use a highly readable sans-serif or humanist body face consistent with current shell tokens; reserve decorative serif/manuscript treatment for headings, quotations, and special records.
- Use a consistent spacing scale, with enough separation to scan lists and paragraphs.
- Use panels and borders lightly; hierarchy should come primarily from spacing, headings, typography, and selected-state contrast.
- Use color by semantic role, not by individual screen decoration alone.
- Never rely on red/green or color alone for status.
- Prefer short persistent labels over unexplained icons.
- Reduce motion by default in text-heavy views; reserve animation for meaningful state change.
- Combat activity may animate meters or action transitions subtly, but exact text/timing remains available.

## 14. Accessibility Baseline

- scalable text and layout reflow;
- keyboard-only navigation and command access;
- visible focus states;
- semantic headings, lists, tables, and controls;
- screen-reader labels and live-region discipline for notices/combat events;
- high-contrast and reduced-motion options;
- non-color status labels and patterns/icons;
- adjustable tooltip timing or click-to-open help;
- no tiny mandatory hit targets;
- combat log and timing information available without relying on animation;
- pause or equivalent planning accommodation only where gameplay mode permits it;
- long-session eye comfort through restrained contrast and texture.

## 15. Technical and Production Direction

- Preserve the headless simulation and engine-owned command/state/event model.
- Build UI from read-only view models and explicit command contracts.
- Use reusable components for navigation, entity headers, record lists, detail groups, timing rows, resource meters, status chips, action choices, blockers, notifications, and empty states.
- Maintain stable ids for records and cross-links.
- Treat selected ids, filters, expanded sections, and panel history as UI state, not gameplay authority.
- Design responsive behavior around current desktop browser play first while avoiding hard-coded desktop-only assumptions.
- Define minimum supported resolution before broad shell redesign; current 1280x720 assumptions should be verified rather than inherited.
- Plan for localization expansion and multiline labels.
- Keep search indexing separate from record ownership.
- Define fallback assets and loading states.
- Avoid broad shell rewrite while command/state ownership is still transitioning.
- Require focused parity tests for shell navigation and each command surface.

## 16. Reusable Component Inventory

- primary navigation item;
- section navigation item;
- top-context cluster;
- entity/record header;
- portrait/token/crest block;
- status chip and status list;
- resource/readiness meter;
- linked entity text;
- record list row/card;
- typed search result;
- filter/sort bar;
- detail group/accordion;
- provenance/certainty marker;
- quest objective row;
- Chronicle event row;
- location/route summary;
- structure/service summary;
- operation/timer row;
- combatant row;
- combat action/timing row;
- command option with cost/timing/blockers;
- tactics preference row;
- focus/target directive control;
- combat log entry;
- notice/toast/banner;
- empty, unknown, locked, and updated states;
- tooltip/popover/drawer/modal primitives;
- breadcrumb/history return control.

Each component should document its data source, interaction owner, visual states, accessibility behavior, and forbidden uses.

## 17. Anti-Clutter Decision Test

A UI element deserves permanent visibility only if all are true:

1. It is relevant across most primary contexts or is immediately safety-critical.
2. Delaying access by one interaction would materially harm decisions or orientation.
3. It has one clear owner and does not duplicate another visible element.
4. It can remain readable at minimum supported resolution and text scale.
5. It does not demand continuous attention through animation or badges.

Otherwise place it in the owning page, a contextual summary, a linked detail, or an optional drawer.

Additional rules:

- no more than three persistent regions: top band, primary navigation, main pane;
- no multiple open drawers/overlays;
- no nested tabs inside nested tabs;
- no permanent full quest list;
- no raw debug values in normal UI;
- no duplicate resource or status readouts without a specific mode reason;
- no large decorative frames that reduce reading space;
- no broad list of every available action outside the relevant context;
- no unexplained badge accumulation.

## 18. Prototype Priorities

1. **Home and navigation prototype:** test reorientation, six-domain grouping, Home placement, and next-action clarity.
2. **Linked record prototype:** event -> character -> settlement -> quest -> back, testing ownership-preserving cross-navigation.
3. **Codex/knowledge prototype:** test partial knowledge, provenance, rumor/confirmed distinctions, search, and links to owning domains.
4. **Text-first combat prototype:** test allied/enemy rows, action timing, queue/recovery, manual command, targeting, combat log, and scene-asset balance without a rendered battlefield.
5. **Tactics editor prototype:** test role/bias/target/focus controls translated into readable gambit-like summaries and manual override behavior.
6. **Activity/operation prototype:** test long-running work, queues, timers, blockers, and browser-game density without timer overload.
7. **Responsive/accessibility prototype:** test large text, keyboard navigation, high contrast, reduced motion, and minimum resolution.

Prototype questions:

- Can a new player identify the current context and next reasonable action?
- Can a returning player understand what changed?
- Can the player predict when a combatant will act and why an NPC chose an action?
- Can the player consult another record and return without losing an unresolved decision or combat context?
- Can the player distinguish confirmed, partial, rumored, and outdated knowledge?
- Does the interface remain calm when many systems unlock?

## 19. Required Integration Outcomes

The named Codex integration pass should:

1. inspect live repository state and current version anchors;
2. compare this research against current shell, view-model, panel, navigation, combat, tactics, Codex, Chronicle, quest, World, Activity, persistence, and ownership authorities;
3. classify each recommendation as adopt, adapt, defer, or reject;
4. create one durable UI information architecture boundary/design document;
5. define the Home surface, persistent shell, contextual encounter state, cross-link rules, and anti-clutter policy;
6. define combat UI projections around current tick/action/tactics contracts without changing combat math or runtime;
7. preserve current six-domain navigation as the baseline and decide any Home placement without proliferating top-level items;
8. preserve Codex, geographic knowledge, quest, Chronicle, Character, World, and Activity ownership distinctions;
9. update the future-system design ledger and coordination files only where durable planning changes;
10. select a future prototype/read-only UI audit route without authorizing broad implementation;
11. explicitly delete this temporary artifact after promotion, or retain it with one remaining consumer and removal condition;
12. resume the current runtime-ownership primary route after the support integration.

## 20. Explicit Non-Goals

This research does not authorize:

- React/UI implementation;
- broad shell rewrite;
- new primary navigation items;
- combat runtime, math, speed, timing, action, AI, party-size, or pause-mode changes;
- literal ordered gambit runtime;
- new schemas, content JSON, validators, tests, saves, migrations, or compatibility behavior;
- new Codex ownership of people, places, quests, or Chronicle records;
- player notes or search persistence;
- new art production or asset moves;
- multiplayer or mobile-first redesign;
- classes/jobs or class-gated UI;
- a rendered battle map or 3D/2D combat client;
- displacement of `Version 0.6.1.1` or the next selected bounded engine-owned consumer.

## 21. Research Sources Referenced

The original Deep Research report drew on interface and design observations from:

- Final Fantasy XII combat and gambit references;
- Six Ages development commentary on advisor-driven UI;
- Game Developer analyses of Pentiment typography and Banner Saga UI;
- The Verge reporting on Crusader Kings III contextual map/UI design;
- Citizen Sleeper interface commentary;
- Roadwarden, Suzerain, Disco Elysium, Fallen London, Sunless Sea/Sunless Skies, Pillars of Eternity, Tyranny, Dragon Age, The Witcher, Pathfinder, Baldur's Gate 3, King of Dragon Pass, Foundry VTT, Roll20, D&D Beyond, OGame, Torn, and related text-oriented browser-game patterns.

These references are comparative research only. Repository facts and current Lineage decisions take precedence.