# Gameplay Shell And UI-State Ownership Source Audit

Date: 2026-07-29

Source route: ChatGPT via GitHub Connector

Source commit: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Status: connector-only, read-only evidence audit; no React, CSS, routing, snapshot, save, runtime, generated-output, or roadmap change

## 1. Purpose

Characterize the live gameplay shell and its presentation-state ownership before any Home, compact-navigation, linked-record, search/history, overlay, responsive, or shell-unification implementation.

This audit answers:

- which shell state is local and ephemeral;
- which presentation state is incorrectly or ambiguously stored in the gameplay snapshot;
- which surfaces are pure projection versus direct mutation bridges;
- whether a narrow read-only shell prototype can be planned safely;
- which owner, accessibility, responsive, and restoration decisions remain open.

It does not authorize a broad shell rewrite or any gameplay behavior.

## 2. Durable Authority

`docs/design/ui-information-architecture-boundary.md` is the permanent design boundary.

It requires:

- a compact global top band;
- a compact left navigation rail;
- one primary content pane;
- Home as the default re-entry surface rather than a seventh equal-height domain;
- owner-aware read-only view models;
- no UI-owned gameplay resolution;
- explicit ownership for pins, search, history, notes, and persistence;
- accessibility and responsive behavior as readiness requirements;
- one narrow slice rather than a broad rewrite.

The older `docs/dev/gameplay-shell-unification-source-map.md` remains useful supporting evidence, but its dated route pointers do not control current execution.

## 3. Live Shell Inventory

| Surface | Live file | Current role | Current state owner |
| --- | --- | --- | --- |
| Gameplay shell | `apps/rpg-ui/src/game-shell/InGameShell.tsx` | assembles top bar, navigation, active domain panel, notices, and save controls | mixed local React state plus snapshot mutation bridge |
| Layout frame | `apps/rpg-ui/src/components/layout/AppLayout.tsx` | fixed top region plus two-column navigation/content body | pure presentation |
| Primary navigation | `apps/rpg-ui/src/components/SideNav.tsx` | renders six domain buttons | local active-tab state supplied by shell |
| Top status bar | `apps/rpg-ui/src/components/TopStatusBar.tsx` | identity, time/climate, condition, resources, notifications, settings | projected data plus three independent local overlay states across shell/component boundaries |
| Session context | `apps/rpg-ui/src/runtime/GameSessionContext.tsx` | derives UI projection and body-state presentation from snapshot/account state | snapshot is external; toast dismissal is local presentation memory |
| UI projection | `apps/rpg-ui/src/runtime/uiViewModel.ts` | projects six domains, top bar, notifications, meters, lists, and details | read-only projection from accepted state plus presentation helpers |
| Save controls | `apps/rpg-ui/src/game-shell/components/InGameSaveControls.tsx` | explicit save/quick-save/retire/menu actions | command callbacks from outer shell owner |
| Notices | `NoticeBanner` plus body-state presentation | temporary user feedback | mixed outer-shell notice and local dismissed-toast memory |

## 4. Current Primary Navigation

The shell exposes exactly six domain tabs:

1. Character;
2. World;
3. Activity;
4. Codex;
5. Quests;
6. Chronicle.

`activeTab` is local React state initialized to `character`.

Selecting an inactive tab activates it. Selecting the active tab sets `activeTab` to `null`. The panel renderer has no Home branch and defaults to an empty full-height `div` when no tab matches.

### Findings

- The active domain is correctly presentation-owned local state.
- The current default is Character, not Home.
- Clearing the selected domain creates an empty pane rather than a deliberate re-entry surface.
- No browser-like return path, recent-record history, or navigation restoration owner exists.
- Tab selection is not persisted and is reset when the shell remounts.
- The shell uses a fixed six-domain switch rather than an owner-routed destination abstraction.

### Required later decision

A later shell plan must decide whether:

- `null` means Home;
- Home becomes an explicit local route state;
- the first session entry and reload both select Home;
- returning from linked records restores the prior domain and record;
- selected domain remains session-local or gains a separate presentation preference owner.

The gameplay snapshot must not become the default storage location for these presentation choices.

## 5. Pin And Bookmark Ownership Defect

`InGameShell.tsx` reads:

`sessionState.pinnedRecordIds`

and passes it to all six domain panels as `pinnedIds`.

`onTogglePin(...)` directly calls `updateSnapshot(...)` with a rewritten `sessionState.pinnedRecordIds` array.

### Classification

| Concern | Current posture | Finding |
| --- | --- | --- |
| Stable record identity | reused across panels | useful presentation input |
| Pin interaction | shell-local callback | presentation action |
| Stored pin list | gameplay `SaveSnapshot.sessionState` | ownership unresolved |
| Mutation path | direct shell snapshot rewrite | UI-authored mutation |
| Cross-domain semantics | one flat string array | no typed owner/destination contract |
| Persistence | inherited from save snapshot | accidental persistence posture rather than accepted UI-state contract |
| Revision/history | absent | no edit provenance or correction model |

The permanent UI boundary already identifies this as unresolved. The live implementation confirms that pins are the clearest remaining shell-level presentation mutation stored inside authoritative gameplay state.

### Required later decision

A focused `Pin, Bookmark, And Recent-Record Presentation-State Ownership Decision` should decide:

- whether pins are per save, per account, per character, per device, or ephemeral;
- whether one flat ID list is adequate;
- typed destination and owner information;
- missing/deleted/retired record behavior;
- limits and ordering;
- synchronization and persistence;
- migration posture for current snapshot pins;
- whether current pins are preserved, discarded, or copied into a dedicated presentation-state owner.

No pin migration should be inferred by a shell prototype.

## 6. Search State

Every domain panel receives:

`searchQuery: ''`

from the shell.

No shell search input, typed result index, query state, result destination, back path, or recent query owner exists.

### Finding

The current prop shape anticipates search-like filtering but the shell hard-codes an empty query. This is not a search implementation and does not prove a universal index owner.

### Required later decision

A future linked-record/search contract must keep:

- canonical ownership federated;
- indexing read-only;
- results typed by destination owner;
- query, filters, selected result, and return history in presentation state;
- unknown or inaccessible records from leaking through the index;
- pins and recent history separate unless explicitly combined.

## 7. Overlay And Temporary-Surface State

Current overlay-like state is fragmented:

- `settingsOpen` lives in `InGameShellContent`;
- `conditionOpen` lives in `TopStatusBar`;
- `calendarOpen` lives in `TopStatusBar`;
- notification-bell state is component-local;
- body-state toast dismissal lives in `GameSessionProvider` local state;
- outer gameplay notices arrive through shell props.

Navigation closes only settings. It does not close calendar or condition overlays because their state is internal to `TopStatusBar`.

The top bar permits independent condition, calendar, notification, and settings surfaces. The durable IA boundary permits at most one temporary drawer, popover, modal, or decision surface at a time.

### Risks

- multiple overlays may be open simultaneously;
- no shared escape-key or outside-click policy is evident at the shell level;
- no centralized focus capture or focus-return contract exists;
- overlays use fixed absolute placement and viewport-constrained widths but no declared minimum viewport policy;
- navigation changes do not uniformly dismiss temporary surfaces;
- notices and body-state toasts have priority behavior, but other overlays do not share that coordination;
- local overlay state is lost on remount without a deliberate restoration rule.

### Required later contract

A narrow shell prototype should introduce a presentation-only `openSurface` discriminator, or prove that a smaller equivalent can enforce:

- one open temporary surface;
- explicit trigger identity;
- escape and outside-dismiss behavior;
- focus capture and return;
- navigation-dismiss rules;
- screen-reader labeling;
- no gameplay or save mutation.

This contract belongs to presentation state and should not enter `SaveSnapshot`.

## 8. Body-State Presentation Memory

`GameSessionProvider` owns:

- presentation memory through a `useRef`;
- dismissed body-state toast IDs through local React state;
- a derived `BodyStatePresentationViewModel`.

This is a useful example of correctly separated ephemeral presentation memory. Dismissing a toast does not mutate the gameplay snapshot.

### Boundary

- accepted body-state facts remain snapshot-owned;
- derived wording, severity, recommendation projection, and toast presentation remain UI-owned;
- dismissed-toast memory is session-local;
- the current implementation does not establish cross-session dismissal persistence.

A future shell-state owner should preserve this separation rather than moving presentation dismissal into gameplay state.

## 9. UI View-Model Posture

`createUiViewModel(...)` projects:

- navigation;
- top-bar identity, date, climate, condition, and meters;
- notifications;
- six domain models;
- lists, sections, details, metrics, operations, and record windows.

It reads accepted snapshot/account facts and several owner-specific presentation helpers and engine queries.

### Strengths

- the shell does not calculate travel, quest, activity-selection, or body-state outcomes;
- domain models are separated rather than flattened into one canonical record store;
- navigation metadata is static presentation vocabulary;
- top-bar and body-state output are derived;
- engine queries remain read-only where imported.

### Risks and cleanup candidates

- `initialPinnedIds` exists in the view-model type while the live shell reads pins directly from the snapshot;
- some section descriptions imply capabilities not yet executable, such as market, crafting, and employment breadth;
- raw source-reference or compatibility diagnostics may still appear in normal detail projections;
- list-item and window-detail shapes are broad and may obscure owner-specific certainty/provenance;
- no explicit Home model exists;
- no linked-record destination contract exists;
- no combat view model exists in the six-domain projection.

A later view-model audit should classify every field as accepted fact, compatibility projection, placeholder presentation, or debug-only output before shell redesign.

## 10. Responsive Posture

`AppLayout` uses:

- full viewport height;
- a fixed padding shell;
- a two-column grid only at `xl`;
- `180px` navigation width at `xl`;
- stacked regions below `xl`.

`SideNav` uses tall card-like buttons with a minimum height of 86 pixels. The top bar uses horizontal overflow for meters and several absolute overlays.

### Finding

The layout is desktop-oriented but not a complete responsive contract. It has responsive utility classes, yet no accepted minimum supported viewport, collapsed navigation behavior, large-text test target, or focus-flow specification.

### Required later proof

Before implementation, define:

- minimum supported width and height;
- 200% text scaling behavior;
- left-rail collapse behavior;
- top-bar wrapping and meter overflow policy;
- overlay anchoring at narrow widths;
- keyboard order after navigation collapse;
- visible focus and focus return;
- reduced-motion and high-contrast behavior;
- no loss of actions or status.

## 11. Home Readiness

The durable IA boundary defines Home as a calm orientation surface. The live repository has no Home component, route, or view model.

A safe prototype can be planned only as a read-only projection over current accepted facts:

- character identity;
- current location and time;
- current activity;
- tracked quest or one primary objective;
- current notice/readiness summary;
- two or three owner-routed actions.

Home must not:

- compute eligibility;
- apply activity advancement;
- turn in quests;
- rest;
- travel without the accepted travel command;
- create search, pin, or history authority;
- become a dashboard containing every system.

## 12. Current Writer And Owner Matrix

| State or action | Current writer | Proper future posture | Disposition |
| --- | --- | --- | --- |
| Active domain | `InGameShell` local state | shell presentation state | retain locally, add Home semantics |
| Settings open | shell local state | shared temporary-surface state | adapt |
| Calendar open | `TopStatusBar` local state | shared temporary-surface state | adapt |
| Condition open | `TopStatusBar` local state | shared temporary-surface state | adapt |
| Notification overlay | notification component local state | shared temporary-surface state | inspect in prototype |
| Outer notice | outer gameplay shell owner | transient presentation supplied by command/runtime boundary | retain |
| Body toast dismissal | `GameSessionProvider` local state | ephemeral presentation memory | retain |
| Pin list | gameplay snapshot | dedicated presentation state after decision | unresolved migration |
| Search query | hard-coded empty string | shell or domain presentation state | missing |
| Selected record in domain panels | generally panel-local | owner-routed presentation state | inspect per panel |
| Return history | absent | presentation navigation owner | missing |
| Home/re-entry | absent | shell presentation route | missing |
| Save/quick-save actions | outer callbacks | persistence owner commands | retain |

## 13. Smallest Safe Future Pass

Recommended next UI planning route after the active Ashen Reef owner decision:

`Home And Compact Shell Read-Only Prototype Contract`

Classification:

`UNVERSIONED_PREREQUISITE`

The route should remain documentation and prototype planning only unless a later implementation package is explicitly approved.

It should decide:

1. Home route identity and default-entry behavior;
2. active-domain and return-context state;
3. one-open-overlay contract;
4. read-only Home view-model fields;
5. navigation collapse behavior;
6. keyboard, focus, live-region, large-text, high-contrast, and reduced-motion requirements;
7. exact component and focused-test paths for one later prototype;
8. explicit exclusion of pin migration, linked search, player notes, combat UI, and gameplay mutation.

## 14. Separate Prerequisites

Do not combine the following into the first shell prototype:

- pins/bookmarks migration;
- global search and indexing;
- recent history and browser-like navigation;
- player notes;
- combat presentation;
- tactics editing;
- broad domain-panel redesign;
- notification persistence;
- launcher/main-menu redesign;
- Activity advancement or quest turn-in;
- snapshot or account schema changes.

Each needs its own owner/readiness decision.

## 15. User Direction Needed Later

Before a production Home prototype, ask the user to choose or describe:

- whether Home should emphasize current objective, character condition, world context, or available actions;
- preferred information density: calm summary, compact operational dashboard, or narrative re-entry;
- whether Home art should prioritize portrait, local scene, map fragment, family crest, or remain mostly text;
- whether pins should be per character/save or account-wide;
- whether selecting the active navigation item should return Home or leave the current panel selected.

These are product-direction choices and should not be inferred from code.

## 16. Final Disposition

Result:

`READ_ONLY_HOME_AND_SHELL_CONTRACT_READY`

Implementation remains:

`NO_PACKAGE`

The live shell is stable enough to audit and prototype against, but not ready for a broad rewrite. The smallest productive next UI work is a read-only Home and compact-shell contract that preserves all current engine and save owners, followed later by separate presentation-state decisions for pins and linked navigation.
