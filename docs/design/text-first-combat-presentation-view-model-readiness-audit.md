# Text-First Combat Presentation View-Model Readiness Audit

Date: 2026-07-29

Source route: ChatGPT via GitHub Connector

Source commit: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Status: connector-only, read-only presentation audit; no combat, UI, command, engine, shared-contract, save, content, schema, test, asset, or roadmap change

## 1. Purpose

Determine whether the live combat contracts are sufficient to support a future text-first combat presentation view model without inventing combat rules, timing, targeting, tactics, party size, or UI-owned authority.

This audit follows the permanent `docs/design/ui-information-architecture-boundary.md`, which accepts text-first combat as the intended presentation direction and requires a dedicated view-model plan before UI implementation.

This pass does not authorize a combat screen or any combat behavior.

## 2. Live Contract Sources

Primary live types:

- `packages/shared/types/src/combat.ts`;
- `packages/shared/types/src/tactics.ts`.

Supporting accepted authority:

- combat engine and current combat tests;
- item `useProfiles` and combat grants;
- combat role and tactics preset content;
- current save snapshot combat fields;
- UI information-architecture boundary.

The current six-domain gameplay shell does not render a combat surface.

## 3. Encounter-Level Facts Already Available

`CombatEncounterState` explicitly provides:

- encounter identity;
- optional encounter-template and spawn-profile references;
- state: forming, active, paused, or resolved;
- area context;
- current combat tick;
- allied, guest, and enemy combatant IDs;
- team definitions;
- full combatant array;
- full action array;
- next action ordinal;
- pause permission and paused state;
- current targeting state;
- manual overrides;
- optional skill-gain attempt state;
- terminal outcome.

### Presentation implication

A read-only view model can establish encounter header, roster grouping, current tick, pause status, target summary, queue, and terminal outcome without calculating or mutating combat state.

## 4. Area Context

The encounter carries:

- region ID;
- optional settlement ID;
- optional site ID;
- optional world hex ID;
- habitat tags;
- hazard pressure.

A future combat header may display owner-resolved place labels and broad environmental context.

It must not:

- infer undiscovered geography;
- reveal hidden encounter/template/spawn information;
- calculate hazards;
- treat habitat tags as current visible scenery without a presentation rule;
- create map or Knowledge authority.

## 5. Combatant Facts

Every combatant provides:

- stable combatant ID;
- display name;
- kind: player, party member, guest, or enemy;
- disposition;
- team ID;
- source references;
- partial attributes;
- HP, MP, and stamina pools;
- status effects;
- incapacitated and defeated flags;
- tactical role;
- AI/manual control mode;
- tactics preset and optional tactics state;
- target preferences and focus directives;
- timing state;
- equipment hooks;
- action/grant hooks;
- threat rating.

### Presentation-ready fields

The following can be projected directly or with simple formatting:

- name;
- ally/enemy grouping;
- resource current/max values and ratios;
- statuses and stacks;
- incapacitated/defeated state;
- role label;
- control-mode label;
- current target/focus relationships;
- ready/recovery/channel timing;
- current and queued actions.

### Fields requiring guarded presentation

- partial attributes should not become a full inspectable stat sheet by default;
- source refs are diagnostics and identity links, not normal player-facing text;
- threat rating requires an explicit visibility/label rule before display;
- hooks and grants are implementation detail unless translated through a focused explanation model;
- enemy tactics or preferences may be private unless an accepted observation/Knowledge owner permits exposure.

## 6. Resource Projection

Combat resources use the same three explicit pools:

- HP;
- MP;
- stamina.

A view model can safely provide:

- current value;
- maximum value;
- ratio;
- exact accessible label;
- depleted/low/normal presentation band derived only for display.

The display band must not become a new gameplay threshold or change combat decisions.

HP zero, incapacitated, defeated, actual death, and lethal-process state remain distinct. A combat UI must not label HP zero as death unless the actual life-state owner says so.

## 7. Status Effects

A status effect provides:

- ID;
- label;
- source type and optional source ID;
- stacks;
- optional magnitude;
- start tick;
- optional expiry tick;
- tags.

A safe status-row model can include:

- display label;
- stack count when greater than one;
- remaining ticks only when expiry is present and current encounter tick is authoritative;
- source label only when the source is safe to expose;
- severity/style only from an accepted presentation mapping.

Do not infer diagnosis, injury, hidden process, or future outcome from a combat status.

## 8. Action Lifecycle

The accepted action lifecycle is:

- queued;
- executing;
- channeling;
- recovering;
- resolved;
- cancelled;
- interrupted.

Each action includes:

- stable action ID;
- action type;
- actor combatant ID;
- target IDs and primary target;
- queued tick;
- optional start, resolve, and recovery-end ticks;
- execution and recovery durations;
- interruptibility and priority;
- resource costs;
- manual-override flag;
- source identity and hooks.

### Presentation implication

The view model can present a chronological or actor-grouped action list without a separate UI clock.

Required exact text patterns should include equivalents of:

- `Queued`;
- `Starts now` or `Starts in N ticks` when supported;
- `Resolves in N ticks`;
- `Channeling; ends in N ticks`;
- `Recovering; ready in N ticks`;
- `Interrupted`;
- `Cancelled`;
- `Resolved`.

Tick differences must be clamped for presentation and derived from the encounter's current tick only.

## 9. Combatant Timing

Each combatant has:

- `readyAtTick`;
- current action ID;
- optional recovery end;
- optional channel end;
- optional interrupt-window end;
- ordered queued action IDs;
- last completed action ID.

This is sufficient for a read-only relative-timing model.

### Required timing view-model fields

Per combatant:

- readiness state;
- exact readiness label;
- ticks until ready;
- current action summary;
- channel summary;
- recovery summary;
- interrupt-window summary;
- ordered queue summaries;
- stale/missing action-reference warning for diagnostics only.

The UI must not add:

- Speed as a canonical attribute;
- a separate ATB value;
- a second timer;
- animation-derived timing;
- fixed action-duration assumptions.

## 10. Queue Projection

The encounter owns the action records; combatant timing owns ordered queued action IDs.

A view-model builder should:

1. index actions by ID;
2. resolve each combatant's current and queued IDs;
3. retain owner order exactly;
4. distinguish unresolved references as safe diagnostic state;
5. never reorder by UI preference unless a separate display-only grouping is clearly labeled;
6. preserve action identity for command replacement or inspection.

Queue presentation may show append/replace affordances only when an accepted command contract exposes them.

## 11. Targeting Projection

Encounter targeting includes:

- current player target;
- focus targets;
- ignored targets;
- priority targets;
- deprioritized targets.

Combatant tactics also include broader melee/ranged/magic focus and ignore sets.

A read-only model can safely expose the player's own current target and player-issued directives.

Enemy or AI-internal preferences should be shown only when:

- they are player-authored ally tactics;
- the engine provides an explanation result intended for presentation;
- an observation or tactical-insight owner authorizes the fact.

Do not expose raw scoring weights as normal combat truth by default.

## 12. Pause And Control Mode

Combat mode and encounter state provide:

- pause allowed;
- currently paused;
- AI/manual control mode per combatant;
- temporary manual overrides.

A view model may provide:

- pause availability;
- current pause state;
- control-mode label;
- whether an override is active;
- override expiry when present.

The UI may submit an accepted pause or control command only after the corresponding engine command contract is identified. Rendering a button does not create command authority.

## 13. Tactics Presentation

The live tactics model includes:

- nine tactical roles;
- action-family and behavior biases;
- spell school, element, and tier preferences;
- MP and stamina conservation thresholds;
- weighted target rules;
- focus, ignore, priority, and deprioritized directives;
- AI/manual control mode;
- tactics presets.

This supports readable summaries such as:

- prioritizes interrupts;
- conserves MP below a threshold;
- favors healing urgency;
- prefers ranged engagement;
- focuses the player's current target;
- deprioritizes named targets.

### Boundary

The UI may translate current fields into understandable statements. It must not create a literal ordered gambit interpreter, new condition/action vocabulary, or scoring behavior.

## 14. Manual Command Request Shape

`CombatCommandRequestState` includes:

- actor combatant ID;
- action type;
- target IDs;
- source type and source ID;
- queue mode: append or replace.

This is sufficient for a staged-command presentation shape, but not by itself proof of an accepted runtime submission API.

A future command-option model must be sourced from engine-provided eligibility and blocker facts, not generated by scanning all hooks in the UI.

Required presentation fields later include:

- stable option ID;
- label;
- source label;
- valid targets;
- costs;
- execution and recovery preview;
- interruptibility;
- blockers;
- append/replace availability;
- whether selecting the option merely stages or immediately submits.

## 15. Existing `CombatUiState`

The shared contract includes:

- selected party member ID;
- selected enemy target ID;
- staged command;
- last issued command audit.

### Finding

This type demonstrates intended presentation concerns but does not by itself decide where UI state lives or persists.

A focused decision should classify:

- ephemeral selection;
- staged command lifetime;
- whether last-issued audit is engine output or presentation memory;
- reset behavior on encounter transitions;
- save/load behavior;
- multi-tab or reconnect posture.

Do not automatically persist `CombatUiState` in the authoritative save.

## 16. Outcome Projection

A resolved encounter can provide:

- allies victorious;
- enemies victorious;
- disengaged;
- cancelled;
- end tick;
- reason.

A result view can present these accepted facts and link later consequence receipts.

It must not infer:

- actual death;
- injury resolution;
- loot ownership;
- rewards;
- quest completion;
- Chronicle or reputation consequences;
- checkpoint/closure.

Those require their own owner results.

## 17. Proposed Read-Only View Model

A future `CombatPresentationViewModel` should contain:

### Encounter header

- encounter ID for diagnostics/linking, not ordinary headline;
- state label;
- place label and safe context;
- current tick label;
- pause state and availability;
- terminal outcome summary when present.

### Rosters

- allied rows;
- guest rows;
- enemy rows;
- no fixed party-size assumption.

### Combatant row

- combatant ID;
- display name;
- kind/disposition;
- role and control-mode labels;
- resource meters and exact text;
- visible statuses;
- incapacitated/defeated posture;
- readiness/action state;
- current target/directive badges;
- optional portrait/token/fallback descriptor.

### Action timeline

- current actions;
- queued actions;
- channel and interrupt windows;
- resolve/recovery labels;
- exact tick values available to accessible detail.

### Command surface

- actor selection;
- current target;
- engine-supplied command options;
- costs, blockers, and timing preview;
- append/replace mode;
- staged command summary;
- submit/cancel only through accepted commands.

### Log

- concise chronological accepted events;
- filters;
- expandable owner-safe details;
- no raw debug dump as default.

### Tactics summary

- role;
- readable preferences;
- conservation thresholds;
- player-owned target directives;
- current override state.

## 18. Missing Inputs

The shared types are rich, but a production view model still needs exact source decisions for:

- current combat-engine read API;
- command eligibility and blocker output;
- command submission result and accepted-only UI behavior;
- safe event/log source;
- portrait/token/asset lookup;
- source-ref visibility;
- enemy-information visibility;
- threat-rating presentation;
- status severity/style mapping;
- action-type and source-label formatting;
- place-label resolution;
- current combat UI state owner;
- encounter entry/exit and shell routing.

These are projection and integration gaps, not justification to change combat math.

## 19. Accessibility Contract

A later prototype must provide:

- keyboard access to combatant, target, command, queue, pause, log, and tactics controls;
- visible focus;
- deterministic focus return after command or overlay closure;
- exact timing text independent of meters or animation;
- non-color status and targeting communication;
- accessible names for portraits, tokens, icons, resources, statuses, and queue positions;
- restrained live-region announcements;
- user-controlled log review;
- high-contrast and reduced-motion behavior;
- scalable text without loss of commands;
- no hover-only information;
- minimum usable target size.

Combat event announcements should be prioritized to avoid overwhelming screen-reader users.

## 20. Responsive Contract

The first prototype should define a minimum supported viewport and preserve:

- roster readability;
- command access;
- target selection;
- exact timing;
- action queue;
- log access;
- pause state.

At narrow widths, prefer ordered stacked regions or one selected combatant detail over shrinking every element into an unreadable dashboard.

## 21. Asset Fallbacks

Art is optional support, not essential state.

A combatant asset projection should provide:

- portrait when an accepted asset exists;
- token or silhouette when appropriate;
- deterministic initials or labeled fallback otherwise;
- alt text and visible name in all cases;
- unknown/hidden treatment without leaking identity.

No combat screen should depend on uncommitted generated art.

## 22. Smallest Safe Next Pass

Recommended route:

`Text-First Combat Presentation View-Model Contract`

Classification:

`UNVERSIONED_PREREQUISITE`

It should inspect the exact combat-engine exports and focused tests, then decide:

1. the read-only engine input surface;
2. exact projection types;
3. label/visibility mappings;
4. command-option and blocker source;
5. UI-state ownership;
6. shell routing;
7. event/log source;
8. accessibility and responsive acceptance criteria;
9. exact future component and test paths;
10. whether a read-only prototype package is dependency-closed.

## 23. Separate Later Passes

Keep separate:

- tactics editor;
- literal gambit design;
- combat command implementation;
- combat asset production;
- combat log persistence;
- enemy-information/Knowledge rules;
- injury and lethal-process presentation;
- loot and rewards;
- post-combat consequences;
- mobile-specific redesign;
- broad shell rewrite.

## 24. User Direction Needed

Before visual prototyping, ask the user:

- preferred default emphasis: roster, timeline, command list, or combat log;
- desired density: concise tactical table versus more narrative presentation;
- whether pause-capable combat should feel real-time-with-pause or tick-strategy in presentation;
- how much numeric timing should be visible by default;
- whether enemy threat and intent should be explicit, partially inferred, or hidden;
- preferred use of portraits, tokens, scene art, and formation strips;
- whether tactics explanations should be terse labels or expandable reasoning.

These are meaningful UX choices not settled by the shared types.

## 25. Final Disposition

Result:

`COMBAT_VIEW_MODEL_CONTRACT_READY`

Implementation:

`NO_PACKAGE`

The live shared contracts are sufficiently explicit to support a focused read-only view-model decision. They are not permission to implement a combat screen before engine read/command surfaces, UI-state ownership, visibility, accessibility, and shell routing are closed.
