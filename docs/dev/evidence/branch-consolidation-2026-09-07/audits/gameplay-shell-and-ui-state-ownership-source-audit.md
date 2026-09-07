# Gameplay Shell And UI-State Ownership Source Audit

Date: 2026-08-03

Source route: ChatGPT via GitHub Connector

Original branch baseline: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Inspected live master: `91bd8c2c89c85fb9ea7257b2c96b68ab41231b04`

Branch: `parallel/gameplay-shell-ui-state-audit`

Status: `REFRESHED_CONNECTOR_EVIDENCE_CANDIDATE_INTEGRATION`

Execution posture: connector-only, read-only source audit; no React, CSS, routing, snapshot, save, runtime, generated output, roadmap, or active-route change

## Purpose

Refresh the live gameplay-shell and UI-state ownership map after the campaign-persistence and mutation-admission work changed the application boundary.

This audit does not authorize Home, shell unification, navigation, persistence, or UI implementation. It is evidence for a later narrow shell or representative-loop decision.

## Material Post-Baseline Changes

The baseline-to-master comparison shows material changes in:

- `apps/rpg-ui/src/App.tsx`;
- `apps/rpg-ui/src/game-shell/InGameShell.tsx`;
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
- save, new-campaign, lifecycle, and campaign-session authority.

The shell is no longer best described as directly replacing snapshots without an admission layer. `GameSessionContext.updateSnapshot(...)` now submits a proposed snapshot through `admitCampaignMutation(...)` and applies it only when admission accepts.

That improvement does not automatically make every UI-originated mutation engine-owned. The caller still chooses the proposed snapshot and often uses the default owner kind `legacy_bridge` unless a narrower owner is supplied.

## Current State Ownership

### Local presentation state

`InGameShell` currently owns these as local React state:

- `activeTab`, initialized to `character`;
- `settingsOpen`;
- automatic body-state toast dismissal timing.

`GameSessionProvider` owns dismissed body-state toast IDs as local state and stores body-state presentation memory in a ref.

These are presentation-owned and are not persisted through campaign mutation admission.

### Snapshot-backed presentation preference

Pinned record IDs remain stored at:

`snapshot.sessionState.pinnedRecordIds`

Toggling a pin constructs a proposed snapshot and calls `updateSnapshot(...)` with:

`ownerKind: persisted_preference`

This is more explicit than the earlier direct snapshot bridge, but the design question remains unresolved: whether pins belong in the authoritative gameplay snapshot, a separate account/user preference store, or another bounded presentation-persistence owner.

### Read-only projection

`createUiViewModel(...)` and body-state presentation continue to project accepted state for rendering. The shell reads navigation, top-bar, notification, meter, panel, and body-state presentation facts from the session context.

### External command/save callbacks

Save, quick-save, retirement, and return-to-menu behavior remain supplied through explicit callbacks from the outer application owner. `InGameSaveControls` presents these actions but does not own their persistence algorithms.

## Navigation And Home Finding

The shell still exposes six domain panels:

1. Character;
2. World;
3. Activity;
4. Codex;
5. Quests;
6. Chronicle.

`activeTab` still begins at `character` rather than Home.

Selecting the active tab again sets `activeTab` to `null`. The panel renderer still falls back to an empty full-height element when no domain matches.

Therefore:

- local tab ownership is clear;
- a deliberate Home/re-entry view remains absent;
- the empty-pane behavior remains a presentation gap;
- no persisted Home or navigation history authority should be inferred.

## Mutation-Admission Improvement And Remaining Risk

The session context now centralizes proposed snapshot admission with:

- source artifact identity;
- source revision;
- mutation identity;
- owner kind;
- accepted posture;
- optional result identity;
- campaign-session control updates.

This closes part of the former direct-application problem.

However, a UI panel can still construct an entire proposed snapshot and submit it through `legacy_bridge`. A future shell or representative-loop review must distinguish:

- engine-owned domain commands;
- bounded persisted preferences;
- compatibility bridges;
- UI-only presentation memory;
- read-only projections.

A central admission gateway is not proof that the proposal itself has the correct domain owner.

## Current Classification

| Surface | Current classification |
| --- | --- |
| Active domain tab | `LOCAL_PRESENTATION_STATE` |
| Settings overlay | `LOCAL_PRESENTATION_STATE` |
| Dismissed body-state toast IDs | `LOCAL_PRESENTATION_MEMORY` |
| UI view model | `READ_ONLY_PROJECTION` |
| Pinned record IDs | `SNAPSHOT_BACKED_PERSISTED_PREFERENCE_UNDER_REVIEW` |
| Panel-proposed snapshot changes | `ADMISSION_GATED_COMPATIBILITY_OR_DOMAIN_PATH_REQUIRES_CASE_REVIEW` |
| Save controls | `PRESENTATION_OVER_EXTERNAL_OWNER_CALLBACKS` |
| Home/re-entry surface | `ABSENT` |
| Empty-pane toggle behavior | `PRESENTATION_GAP_CONFIRMED` |

## Smallest Safe Future Decision

A later narrow shell decision should decide:

1. Home/re-entry behavior and default navigation state;
2. whether active-tab history, search, pins, notes, and overlays are ephemeral, account-persisted, or campaign-persisted;
3. which existing panel mutations are true engine commands versus `legacy_bridge` compatibility paths;
4. whether pinned records should leave the gameplay snapshot;
5. accessible focus, keyboard, responsive, and restoration behavior;
6. one bounded implementation slice rather than a broad shell rewrite.

## Named Consumer And Review Trigger

This audit must be read by:

- a Home or gameplay-shell owner decision;
- a persisted-preference ownership decision;
- a representative-loop UI package;
- a `0.7.0` readiness review that claims accepted-only UI application;
- any cleanup proposing removal of `legacy_bridge` UI mutation paths.

The consuming run must cite this branch head or an integrated successor and re-inspect the live shell, session context, and panel mutation callers from its own head.

## Branch Disposition

`CANDIDATE_INTEGRATION`

Integration condition:

- compare against current shell/session authority;
- confirm no later Home or preference-owner decision supersedes it;
- integrate or re-author during the next named consumer or a dedicated parallel-document coordinator pass.

Retirement condition:

- all retained findings are integrated or explicitly superseded;
- every named consumer can reach equivalent authority on master;
- exact branch head and preservation are verified.

No local tests, builds, typechecks, accessibility checks, browser execution, or UI interaction were run in this connector-only refresh.
