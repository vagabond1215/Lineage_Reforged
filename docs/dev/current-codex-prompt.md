# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Implement:

`Version 0.6.0 - Engine-Owned Player Travel Command`

## Accepted State

- Latest completed primary: `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`.
- Latest completed support clarification: `Version 0.5.357.1 - Player Travel Boundary Clarification`.
- Player travel/movement is the selected first engine-owned consumer.
- `docs/design/runtime-ownership-transition-readiness-consolidation.md` owns the base implementation boundary.
- `docs/design/player-travel-boundary-clarification.md` is the controlling addendum wherever the two documents differ.
- Current execution and preview are UI-owned in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` and invoked by `apps/rpg-ui/src/features/WorldPanel.tsx`.
- Existing shared, game-engine, player-engine, snapshot, persistence, and deterministic-test surfaces are the required foundation.

No user decision or Deep Research is required.

## Purpose

Move the complete existing player-travel transition behind one engine-owned command without changing current behavior or canon.

Land one coherent reviewable package containing:

- a narrow transient command/result contract;
- deterministic collision-safe command identity;
- one pure engine-owned travel-plan resolver shared by preview and execution;
- atomic engine-owned execution;
- one collision-safe completion event for each accepted command;
- current notification and Chronicle projections derived from accepted engine facts;
- full current-result characterization and parity coverage;
- focused deterministic, rejection, no-partial-mutation, same-tick identity, event, export, and roundtrip tests;
- a narrow `WorldPanel` adapter migration;
- removal of direct UI travel mutation and duplicate UI travel-rule authority.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record whether the tree is dirty and preserve unrelated changes.
2. Read:
   - `AGENTS.md` and `README.md`;
   - `docs/dev/current-codex-output.md`;
   - `docs/dev/current-gpt-handoff.md`;
   - `docs/dev/current-codex-prompt.md`;
   - `docs/design/runtime-ownership-transition-readiness-consolidation.md`;
   - `docs/design/player-travel-boundary-clarification.md`;
   - `docs/design/streamlined-pipeline-roadmap-decision.md`;
   - the validation source map and command matrix;
   - the relevant shared event/type exports, game-engine and player-engine exports, save snapshot and persistence owners;
   - `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
   - `apps/rpg-ui/src/features/WorldPanel.tsx`;
   - `apps/rpg-ui/src/runtime/GameSessionContext.tsx` and relevant UI projection/state files;
   - focused gameplay-loop, event/export, deterministic, and save/load tests.
3. Before editing, map the exact current travel call graph, preview rule path, execution mutation path, `syncSnapshot(...)` effects, notification/Chronicle construction, and event-id behavior.
4. Add or establish characterization fixtures for the current accepted travel result before removing or relocating authority.

## Required Architecture

### One engine-owned resolver

Create one pure engine-owned resolver, such as `resolvePlayerTravelPlan(...)`, used by both preview and execution.

It owns:

- implemented destination lookup;
- current-location and known-location validation;
- current travel ticks and HP/MP/stamina costs;
- current metabolic and attribute-load profiles;
- destination region, settlement, site, world-map, and arrival facts;
- deterministic projected body-state data needed by the existing travel outlook;
- stable accepted/rejected plan codes and presentation-safe facts.

The UI must not retain a duplicate `LOCATION_TEMPLATES` travel-rule catalog or independently calculate timing, costs, availability, metabolic load, destination state, or travel validation.

Preview remains read-only and uses this resolver. Execution revalidates current player, expected tick/revision, origin, destination, known status, and required state. A stale preview is not authorization.

### Command identity

Use a deterministic transient `commandId` or equivalent correlation id produced by an engine-owned command factory or adapter boundary.

It must distinguish accepted commands at the same snapshot/completion tick using stable command facts and sequence/correlation context. It must not depend on wall-clock time, random UUID generation, React state, or presentation prose. Do not add a save field.

### Completion event identity

Emit exactly one typed travel-completed event after a successful atomic transition.

The event id must incorporate the command identity or another equally collision-safe deterministic discriminator. Do not rely on `type + domain + tick` as the complete travel-event identity.

Use the smallest safe implementation: a narrow travel-event constructor is preferred over a repository-wide event refactor unless an existing compatible extension is clearly smaller and fully covered.

Rejected commands emit no completion event.

### Atomic state transition

Preserve current behavior now performed by `travelToKnownLocation(...)` and its final `syncSnapshot(...)` call.

On acceptance, preserve at least:

- clock and `capturedAtTick`;
- total play ticks;
- body-state advancement and synchronization;
- attribute-load application;
- current HP, MP, and stamina costs;
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

The accepted final travel state must not depend on UI-authored mutation. Relocate or reuse the required pure synchronization path behind engine ownership without redesigning general quest semantics.

Use clone/resolve/commit or an equivalent pure transition. Commit only after every owner check succeeds.

### Result and UI adapter

Return a discriminated engine result with stable accepted/rejected codes, command identity, applied tick, resolved travel facts, emitted events, presentation-safe notice facts, and accepted next snapshot.

On rejection, preserve the original snapshot identity and content.

`WorldPanel.tsx` remains responsible for selection, confirmation, disabled state, and notice rendering. Its adapter:

- calls the engine-owned preview resolver;
- constructs/invokes the engine command;
- applies the accepted next snapshot only;
- derives the existing notice tone/title/detail from stable facts/codes;
- leaves state untouched on rejection;
- performs no gameplay validation or mutation.

Do not leave dual authority in `gameplayLoop.ts`.

## Required Behavior Preservation

Preserve all current:

- destination ids and authored location facts;
- travel timing and costs;
- clock, body, resource, attribute-load, and progression behavior;
- region/location and geographic Knowledge behavior;
- arrival activities and the two quest-arrival hooks;
- notification and Chronicle text and ordering;
- quest, record, Codex, active/completed-id, and tracked-quest derived behavior;
- preview projection and risky-confirmation behavior;
- serialization and browser persistence behavior.

Do not add new travel mechanics or improve content during this extraction.

## Required Rejections

Reject with no mutation for at least:

- malformed command;
- wrong player;
- stale expected tick/revision;
- incoherent required state;
- unknown/unimplemented destination;
- destination not known in the session;
- already-current destination;
- stale or mismatched resolved plan if a plan is passed to execution.

Resolver and command rejection codes must be compatible. Rejection must produce no event, notification, Chronicle entry, operation change, derived synchronization, or partial clone exposure.

## Focused Tests

Add exact focused tests for:

1. accepted travel covering the distinct current timing/cost profiles needed for parity;
2. every required rejection;
3. original snapshot identity/content preserved on rejection;
4. unexpected failure cannot expose partial mutation;
5. repeated identical fixtures are deterministic;
6. preview and execution resolve from the same rule authority;
7. no duplicate UI travel-rule catalog remains;
8. current implementation versus engine implementation accepted snapshot characterization, including all `syncSnapshot(...)`-derived surfaces;
9. two accepted travel commands that complete at the same tick have distinct deterministic command ids and distinct completion-event ids;
10. rejected commands emit no completion event;
11. exactly one completion event is emitted on acceptance;
12. post-travel serialization/deserialization preserves every changed persisted state surface;
13. relevant shared/game-engine exports remain browser-safe and focused import tests pass;
14. `WorldPanel` uses the engine preview/command adapter and no direct UI travel mutation remains.

Run existing adjacent gameplay-loop skill-gating, deterministic scenario, save/load roundtrip, and relevant event/export tests where they directly protect the touched boundary.

## Scope

Allowed production changes are limited to the smallest coherent set under:

- shared command/result/event types or helpers if required;
- game-engine/player-engine travel resolver, handler, projection helper, and exports;
- the existing UI gameplay-loop bridge and `WorldPanel` adapter;
- exact focused tests;
- required coordination, output, roadmap/sequence override, and backlog files.

Do not add dependencies, content JSON, schemas, save fields, migrations, compatibility aliases, routes, locations, travel modes, encounters, hazards, survival, pathfinding, map reveal, caravan/economy transport, new quest behavior, account behavior, or a broad UI rewrite.

Do not perform an unrelated generic event-system refactor.

## Stop Conditions

Stop rather than broaden if:

- preserving parity requires new canon or a persisted-field/snapshot-version change;
- collision-safe travel identity requires a repository-wide event redesign;
- one resolver cannot serve preview and execution without changing current behavior;
- current `syncSnapshot(...)` parity requires redesigning quest or Chronicle ownership rather than relocating/reusing pure behavior;
- focused compiler/test failures require broad UI/workspace, full-suite, or unrelated typecheck cleanup;
- the patch expands into adjacent runtime systems.

Record the blocker precisely in `docs/dev/current-codex-output.md` instead of guessing.

## Validation

Run:

- exact new travel tests;
- current-versus-engine characterization tests;
- same-completion-tick identity/event tests;
- adjacent gameplay-loop skill-gating tests;
- post-travel save roundtrip coverage;
- deterministic scenario coverage;
- relevant focused event/export/browser-import tests;
- `git diff --check`;
- changed-path, conflict-marker, and direct-authority searches.

Use UI/workspace typecheck only as a baseline audit when it materially clarifies touched-module risk. Treat only new or changed errors in touched modules as direct blockers.

Do not run the full suite, DB build, package installation, generated-output refresh, or unrelated broad typechecks unless separately authorized.

Verify:

- no behavior drift;
- no duplicate command/event id at the same completion tick;
- no direct UI travel mutation or UI-owned travel rules remain;
- no partial mutation on rejection;
- no new persistence fields;
- no unrelated changed paths;
- no conflict markers or trailing whitespace.

## Coordination And Handoff

Update the active coordination files so they agree that:

- `0.5.357` is the latest completed primary;
- `0.5.357.1` is the completed support clarification;
- `0.6.0` is the active primary implementation;
- the clarification document controls collision-safe identity, shared preview/execution resolution, and full synchronization parity;
- historical chronology remains unchanged.

Correct compact stale current-anchor metadata in the sequenced plan and roadmap where safely editable without rewriting historical chronology.

Overwrite `docs/dev/current-codex-output.md` with:

- source version/run and date;
- branch/status assumption;
- files changed;
- checks run and intentionally omitted;
- behavior/runtime confirmation;
- command/event identity result;
- preview/execution authority result;
- synchronization-parity result;
- direct blockers and excluded debt;
- temporary Deep Research intake retirement decision;
- next recommended version/run;
- suggested commit message.

Suggested commit message:

`feat(runtime): move player travel into engine ownership`
