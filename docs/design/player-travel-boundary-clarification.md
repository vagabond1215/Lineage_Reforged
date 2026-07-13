# Player Travel Boundary Clarification

Version: `Version 0.5.357.1 - Player Travel Boundary Clarification`

Date: 2026-07-13

Status: approved documentation-only support clarification; no runtime behavior changed

## 1. Purpose

This support clarification tightens the accepted `Version 0.6.0 - Engine-Owned Player Travel Command` boundary after review of the current UI-owned travel implementation, shared event factory, preview path, and post-action snapshot synchronization.

It does not reopen the consumer selection. Player travel/movement remains the first engine-owned consumer.

Where this document conflicts with `docs/design/runtime-ownership-transition-readiness-consolidation.md`, this document controls the `0.6.0` implementation. All other readiness constraints remain in force.

No user decision or Deep Research is required.

## 2. Clarification Summary

`Version 0.6.0` must additionally prove all of the following:

1. command and completion-event identities remain unique when multiple accepted travel commands complete at the same tick;
2. preview and execution use one engine-owned travel-rule resolver rather than separate UI and engine rule authorities;
3. accepted travel preserves the complete current post-travel snapshot result, including every derived synchronization currently applied by `syncSnapshot(...)`;
4. active coordination files identify this support clarification without changing the next primary route.

## 3. Collision-Safe Command And Event Identity

The current shared `createEvent(...)` helper derives an event id from event type, domain, and tick. That shape is not sufficient by itself for travel because an accepted zero-tick travel leg can complete at the same tick as another accepted travel command.

### Required command identity

The travel command must have a deterministic, stable `commandId` or equivalent correlation id.

The identity must:

- be produced by an engine-owned command factory or adapter boundary;
- include enough stable command facts to distinguish accepted commands at the same snapshot tick, including player, origin, destination, and command sequence/correlation context;
- be deterministic under the focused tests;
- not depend on wall-clock time, random UUID generation, React state, or presentation text;
- remain transient and require no new save field.

The UI may carry the command identity after command construction, but it must not define gameplay identity rules.

### Required completion-event identity

A successful travel command emits exactly one completion event whose id incorporates the command identity or another equally collision-safe deterministic discriminator.

The implementation may:

- add a narrow travel-event constructor;
- safely extend the shared event factory if all existing callers remain compatible; or
- construct the travel event through another engine-owned typed helper.

It must not silently reuse `type + domain + tick` as the complete travel-event identity.

### Required tests

Focused tests must prove:

- two accepted travel commands completing at the same tick produce distinct command ids;
- their completion events have distinct ids;
- rerunning the same command fixture produces the same ids;
- rejected commands emit no completion event;
- no persisted field is added for command or event correlation.

## 4. One Engine-Owned Resolver For Preview And Execution

The current UI module owns both `previewTravelToKnownLocation(...)` and `travelToKnownLocation(...)`, and both consume the UI-local destination rule catalog. Moving execution alone would leave preview as a second travel-rule owner.

`Version 0.6.0` must establish one pure engine-owned resolver, such as `resolvePlayerTravelPlan(...)`, that is used by both preview and execution.

### Resolver responsibilities

The resolver owns:

- implemented destination lookup;
- current-location and known-location validation;
- resolved travel ticks and current costs;
- current metabolic and attribute-load profiles;
- destination region, settlement, site, world-map, and arrival facts;
- deterministic projected body-state information required by the existing travel outlook;
- stable accepted or rejected plan/result codes.

The UI must not retain a duplicate `LOCATION_TEMPLATES` travel-rule catalog or independently calculate travel timing, costs, availability, metabolic load, or destination state.

### Preview behavior

The preview path must:

- call the engine-owned resolver;
- remain read-only;
- preserve the existing travel-outlook and risky-confirmation behavior;
- expose presentation-safe projection facts without React or `GameShellNotice` dependencies;
- never mutate or commit snapshot state.

### Execution behavior

The command handler must:

- revalidate the current player, expected tick/revision, origin, destination, and known-location state at execution time;
- execute from the same resolved rules used by preview;
- not trust a stale preview as authorization;
- commit atomically only after all validation succeeds.

Preview and execution may share a resolved-plan type, but execution must reject a stale or incoherent plan rather than applying it blindly.

## 5. Full Post-Travel Snapshot Parity

The current UI-owned travel function returns `syncSnapshot(nextSnapshot)`, not merely the directly mutated travel fields. Therefore behavioral parity includes all derived synchronization performed by that path.

Before extraction, add characterization coverage for representative accepted travel fixtures. Compare the current implementation result with the new engine-owned result for the complete relevant snapshot output.

At minimum, accepted travel must preserve current behavior for:

- clock and `capturedAtTick`;
- total play ticks;
- body-state advancement and synchronization;
- attribute-load application;
- HP, MP, and stamina costs;
- player region and location;
- settlement geographic Knowledge;
- current activity and known-location state;
- both existing quest-arrival operation/activity hooks;
- notifications and Chronicle records;
- quest-journal derived status and objectives;
- world-record projections;
- activity-record projections;
- Codex projections;
- active and completed quest-id synchronization;
- Echo/progression projection;
- tracked-quest validity cleanup;
- all current ids, labels, text, ordering, caps, and values affected by travel.

The implementation may relocate the required pure synchronization path behind engine ownership or introduce a narrow engine-owned post-travel projection helper. It must not leave the accepted final travel state dependent on UI-authored mutation.

Do not broaden this work into general quest ownership. Stop if preserving the current derived result requires redesigning quest semantics rather than relocating or reusing current pure behavior.

## 6. Rejection And Atomicity

All previously accepted rejection requirements remain in force.

Additionally:

- resolver rejection and command rejection must use compatible stable codes;
- rejection must preserve the original snapshot identity and content;
- no notification, Chronicle entry, operation change, derived synchronization, or event may occur on rejection;
- unexpected exceptions must not expose a partially changed clone;
- stale preview or stale expected tick/revision must reject cleanly.

## 7. Focused Acceptance Matrix

`Version 0.6.0` must include focused coverage for:

- accepted travel to each currently implemented destination needed to exercise distinct timing/cost profiles;
- unknown destination;
- destination not known in the session;
- already-current destination;
- wrong player;
- stale tick/revision;
- malformed command;
- incoherent required state;
- deterministic repeated resolution;
- no mutation on every rejection;
- preview/execution rule parity;
- complete current-vs-engine accepted snapshot characterization;
- two accepted same-completion-tick commands with unique deterministic identities;
- post-travel serialize/deserialize preservation of all changed persisted state;
- no direct UI travel mutation or duplicate UI travel-rule catalog remaining.

## 8. Scope And Stop Conditions

The original `0.6.0` scope and exclusions remain unchanged.

Do not add:

- new routes, locations, travel modes, encounters, hazards, survival, pathfinding, map reveal, or economy transport;
- new quest behavior, Chronicle product behavior, account behavior, save fields, migrations, or compatibility work;
- dependencies or a broad UI/shell rewrite;
- generic event-identity refactors unrelated to the travel requirement.

Stop rather than broaden if:

- collision-safe identity requires a repository-wide event redesign;
- one resolver cannot serve preview and execution without changing current travel behavior;
- full parity requires a separate quest or Chronicle product decision;
- focused failures require unrelated full-suite or broad typecheck cleanup.

## 9. Coordination And Versioning

- Latest completed primary remains `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`.
- This document is the completed support clarification `Version 0.5.357.1 - Player Travel Boundary Clarification`.
- Immediate next primary remains `Version 0.6.0 - Engine-Owned Player Travel Command`.
- `docs/dev/current-codex-output.md` remains the exact latest Codex result and must not be rewritten by this connector-side planning pass.
- `docs/dev/current-gpt-handoff.md` and `docs/dev/current-codex-prompt.md` carry the active corrected route.

## 10. Next Recommended Version

`Version 0.6.0 - Engine-Owned Player Travel Command`
