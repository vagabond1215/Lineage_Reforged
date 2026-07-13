# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.0.1 - Engine-Owned Player Travel Post-Transition Audit`

## Accepted State

- Latest completed primary: `Version 0.6.0 - Engine-Owned Player Travel Command`.
- Latest completed support clarification: `Version 0.5.357.1 - Player Travel Boundary Clarification`.
- The landed `0.6.0` implementation is commit `ce61cbc8ac7c5a0cb7c550b279ed7051f69b2757` unless branch sync shows a newer superseding commit.
- Player travel is the first completed engine-owned runtime consumer.
- `resolvePlayerTravelPlan(...)` is intended to be the single preview/execution rule owner.
- `executePlayerTravelCommand(...)` is intended to own validation, atomic mutation, result construction, and completion-event emission.
- `synchronizeGameplaySnapshot(...)` is intended to preserve the former broad `syncSnapshot(...)` behavior behind engine ownership.
- `WorldPanel.tsx` is intended to remain a narrow selection, confirmation, accepted-snapshot application, and notice-rendering adapter.
- No user decision or Deep Research is required for this audit.

## Purpose

Perform one narrow evidence-based post-transition audit after the first cross-owner runtime migration.

Verify that the landed travel boundary is coherent, deterministic, browser-safe, persistence-safe, and free of residual UI gameplay authority. Then select exactly one next bounded engine-owned quest or activity consumer from current dependency and call-graph evidence.

This is a read-only production audit. Do not edit runtime, UI, shared contracts, tests, content, schemas, persistence, generated files, or package configuration during this run.

Documentation and active coordination files may be updated. If contradictory focused evidence identifies a real defect, document the smallest separate support repair and stop; do not silently repair production code inside this audit.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and whether the tree is dirty. Preserve all unrelated changes.
2. Read:
   - `AGENTS.md` and `README.md`;
   - `docs/dev/current-codex-output.md`;
   - `docs/dev/current-gpt-handoff.md`;
   - `docs/dev/current-codex-prompt.md`;
   - `docs/dev/codex-sequenced-implementation-plan.md`;
   - `docs/dev/project-roadmap.md`;
   - `docs/dev/project-vision-and-continuity-brief.md`;
   - `docs/design/runtime-ownership-transition-readiness-consolidation.md`;
   - `docs/design/player-travel-boundary-clarification.md`;
   - `docs/design/streamlined-pipeline-roadmap-decision.md`;
   - `docs/future_content_backlog.md`.
3. Inspect the complete landed `0.6.0` diff and current versions of:
   - `packages/engines/game-engine/src/player-travel.ts` and `.js`;
   - `packages/engines/game-engine/src/player-travel-rules.ts` and `.js`;
   - `packages/engines/game-engine/src/gameplay-snapshot-sync.ts` and `.js`;
   - `packages/engines/game-engine/src/index.ts`;
   - `packages/shared/events/src/index.ts`;
   - `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
   - `apps/rpg-ui/src/features/WorldPanel.tsx`;
   - `tests/unit/player-travel-command.test.mjs`;
   - `tests/unit/player-travel-characterization.test.mjs`;
   - adjacent deterministic and save/load tests.
4. Map the current preview call graph, command-construction boundary, execution call graph, synchronization path, accepted-snapshot commit path, rejection path, completion-event path, and notice projection path before drawing conclusions.

## Audit Questions

Answer each question with exact file/function/test evidence.

### 1. Single rule authority

Confirm that one engine-owned resolver controls:

- destination lookup and authored travel facts;
- current/known/implemented destination validation;
- timing, HP/MP/stamina costs, metabolic profiles, and attribute-load profiles;
- projected body-state/timeline facts used by preview;
- destination region, settlement, site, map, and arrival facts.

Confirm there is no surviving UI-owned travel-rule catalog, duplicated timing/cost table, or independently calculated preview/execution rule path.

### 2. Command boundary and stale-state protection

Confirm the transient command validates the intended player, expected tick, snapshot version/revision fingerprint, origin, destination, known status, current-location status, and coherent required state.

Confirm command identity is deterministic, collision-safe for accepted same-tick commands, independent of wall-clock/random/React state/presentation prose, and not persisted.

Identify whether caller sequence ownership is explicit and stable at the adapter boundary. Flag any realistic duplicate-command or stale-command acceptance path.

### 3. Atomicity and rejection behavior

Confirm accepted travel uses clone/resolve/synchronize/commit or an equivalent atomic transition.

Confirm every rejection and unexpected-failure path:

- returns the original snapshot identity and content;
- emits no completion event;
- adds no notification or Chronicle entry;
- changes no operation, activity, quest, body, resource, location, Knowledge, record, Codex, or progression state;
- exposes no partial clone.

### 4. Accepted-state parity

Confirm characterized parity for all current destinations and the zero-tick Saltmere return, including:

- clock, captured tick, and total play ticks;
- body-state advancement and synchronization;
- HP, MP, stamina, metabolic, and attribute-load behavior;
- region, location, geographic Knowledge, current activity, and known locations;
- both quest-arrival operation/activity hooks;
- notifications and Chronicle text, ids, ordering, and caps;
- quest journal, world records, activity records, Codex entries, active/completed quest ids, Echo/progression, and tracked-quest cleanup.

Check the intentionally preserved preview/execution mitigation attribute-set difference. Treat it as accepted legacy behavior, not an audit repair target, unless current tests or implementation contradict the recorded parity decision.

### 5. Event contract

Confirm exactly one typed `player.travel.completed` event is emitted only after successful acceptance.

Confirm the event id incorporates collision-safe command identity rather than relying only on type/domain/tick. Recheck the same-completion-tick case and zero-tick return case.

Confirm payload facts are deterministic, presentation-safe, and sufficient for current consumers without exposing mutable snapshot internals.

### 6. Persistence and browser safety

Confirm no save field, snapshot version, schema, migration, compatibility behavior, or storage contract changed.

Confirm post-travel serialization/deserialization preserves every changed persisted state surface.

Confirm game-engine travel exports and their import graph remain browser-safe and do not pull Node-only modules into the UI path.

Confirm checked-in TypeScript/JavaScript peer files are semantically aligned where both are intentionally maintained.

### 7. UI adapter boundary

Confirm `WorldPanel.tsx` and the gameplay-loop bridge:

- use engine preview facts;
- construct/invoke the engine command;
- apply only accepted next snapshots;
- leave state untouched on rejection;
- preserve risky-travel confirmation and current notice behavior;
- perform no direct travel validation or gameplay mutation.

### 8. Scope and hygiene

Confirm `0.6.0` did not introduce unrelated content, route, location, encounter, hazard, survival, pathfinding, map-reveal, economy-transport, account, schema, dependency, generated-output, broad event-system, or UI-shell work.

Check for dead travel helpers, obsolete imports, duplicate authority, temporary artifacts, conflict markers, trailing whitespace, and stale active-anchor metadata.

## Required Validation

Run the focused final group at least once from the synced branch:

`node --test tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

Also run:

- focused deterministic repetition or the exact same-completion-tick test independently when useful for diagnosis;
- direct searches for `LOCATION_TEMPLATES`, direct travel mutation, duplicate destination rule values, `player.travel.completed`, command-id construction, and UI imports;
- focused browser/import/export checks already present in the travel tests;
- `git diff --check`;
- conflict-marker, changed-path, temporary-artifact, and branch-status checks.

Run `npm.cmd run typecheck` only as a read-only baseline audit if it materially clarifies browser/import or touched-module risk. Separate accepted unrelated workspace debt from diagnostics in the landed travel boundary.

Do not run the full suite, DB build, package installation, servers, generated-output refresh, broad cleanup, or unrelated typechecks.

## Decision Rules

### Audit accepted

Accept the transition only if focused evidence confirms:

- one engine-owned rule authority;
- deterministic collision-safe command and event identity;
- atomic acceptance and no-mutation rejection;
- full characterized state parity;
- persistence and browser safety;
- no residual UI gameplay authority;
- no material new touched-boundary diagnostics.

Minor naming/style preferences or accepted unrelated typecheck debt are not repair triggers.

### Repair required

If contradictory focused evidence shows a real behavior, authority, atomicity, identity, persistence, event, browser-safety, or adapter defect:

- do not edit production files in this run;
- record exact reproduction evidence and affected paths;
- select the smallest `Version 0.6.0.2 - ... Repair` support route;
- make that repair the next active prompt;
- do not select a second engine-owned consumer yet.

## Next Consumer Selection

Only after accepting the travel transition, inspect current UI-authored quest and activity mutation paths and select exactly one next engine-owned consumer.

Evaluate candidates using actual source/test evidence for:

- a bounded existing user action with clear input and result;
- one identifiable current mutation owner and UI call site;
- stable current behavior that can be characterized before extraction;
- reuse of the landed command/result/event/snapshot patterns;
- no new content, schema, save field, migration, compatibility behavior, or broad redesign;
- focused deterministic and rejection coverage that can be added without unrelated cleanup;
- meaningful runtime-ownership value while remaining smaller or comparable to the travel slice.

Prefer a single quest or activity command such as one current acceptance, tracking, activation, or selection transition only when the source evidence supports that exact boundary. Do not bundle quest lifecycle, activity scheduling, rewards, combat, inventory, or generic command-bus work.

Record:

- candidates inspected;
- exact call sites and mutation surfaces;
- dependencies and blockers;
- why the selected candidate is safer and more valuable than alternatives;
- exact proposed next primary version label;
- preliminary allowed scope, exclusions, stop conditions, and required tests.

Do not implement the selected consumer in this audit.

## Documentation And Handoff

Update only the smallest necessary documentation set:

- overwrite `docs/dev/current-codex-output.md` with the audit result;
- replace/prune `docs/dev/current-gpt-handoff.md` so it contains the accepted audit state, any residual risk, and the selected next consumer or repair route;
- update `docs/dev/codex-sequenced-implementation-plan.md`, `docs/dev/project-roadmap.md`, and `docs/dev/project-vision-and-continuity-brief.md` only where current anchors or the selected next route require alignment;
- update `docs/future_content_backlog.md` only for a newly deferred concrete system/blocker or to close a directly relevant existing entry;
- overwrite `docs/dev/current-codex-prompt.md` with a decision-complete prompt for the selected next primary consumer, or with the narrow `0.6.0.2` repair prompt if the audit fails.

Do not rewrite historical chronology.

Do not create a new temporary audit/design document unless the evidence cannot be represented clearly in the current output and handoff. If one is created, state its retirement trigger.

## Current Codex Output Requirements

Record:

- source version/run and date;
- starting commit, branch, and status assumption;
- audit verdict;
- files inspected and documentation files changed;
- checks run, outcomes, and intentionally omitted checks;
- rule-authority verdict;
- command/revision identity verdict;
- atomicity/rejection verdict;
- state-parity verdict;
- event-contract verdict;
- persistence/browser/TS-JS parity verdict;
- UI-adapter verdict;
- residual risks and accepted unrelated debt;
- candidate comparison and exact next selected consumer or repair route;
- Deep Research decision;
- next recommended version/run;
- suggested commit message.

Suggested commit message when the audit is accepted:

`docs(audit): verify engine-owned player travel transition`
