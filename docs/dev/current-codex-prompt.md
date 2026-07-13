# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.1.1 - Engine-Owned Quest Acceptance Post-Transition Audit`

## Accepted State

- Latest completed primary: `Version 0.6.1 - Engine-Owned Quest Acceptance Command`.
- Latest completed support/audit run: `Version 0.6.0.3 - Engine-Owned Player Travel Post-Repair Audit`.
- Quest acceptance is intended to be the second completed engine-owned runtime consumer.
- `resolvePlayerQuestAcceptancePlan(...)` is intended to own acceptance lookup, eligibility, stable plan codes, and acceptance facts.
- `executePlayerQuestAcceptanceCommand(...)` is intended to own validation, atomic mutation, synchronization, result construction, and accepted-event emission.
- The accepted snapshot and notice characterization hashes remained unchanged during extraction.
- No user decision or Deep Research is required.

## Purpose

Perform one narrow read-only post-transition audit of the landed quest-acceptance boundary. Verify authority, determinism, stale protection, atomicity, complete current-behavior parity, event contract, persistence/browser safety, UI adapter behavior, and repository hygiene.

If accepted, inspect the remaining bounded quest/activity seams and select exactly one next engine-owned consumer. If contradictory evidence identifies a real defect, package the smallest separate support repair and stop without selecting another consumer.

Do not edit runtime, UI, shared contracts, tests, content, schemas, persistence, package files, or generated output during this audit.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record starting commit and dirty/clean state; preserve unrelated work.
2. Read `AGENTS.md`, `README.md`, the current output/handoff/prompt, sequencing plan, roadmap, continuity brief, runtime-readiness consolidation, player-travel clarification as the accepted command-pattern authority, and backlog.
3. Inspect the complete landed `0.6.1` diff and current versions of:
   - `packages/engines/game-engine/src/player-quest-acceptance.ts` and `.js`;
   - `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`;
   - `packages/engines/game-engine/src/index.ts`;
   - `packages/shared/events/src/index.ts`;
   - `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
   - `apps/rpg-ui/src/features/QuestsPanel.tsx`;
   - both quest-acceptance focused tests;
   - adjacent travel, skill-gating, deterministic, and save/load tests.
4. Map resolver, UI eligibility, command construction, execution, synchronization, accepted application, rejection, event, and notice paths before deciding.

## Audit Questions

### Authority and eligibility

Confirm one engine resolver owns quest lookup, contracts-only eligibility, stable plan codes, and acceptance facts. Confirm `getQuestCommandState(...)` consumes that resolver for acceptance while tracking and turn-in remain unchanged. Confirm no direct acceptance mutation survives in the UI.

### Command and stale protection

Confirm command shape/id, player, quest, sequence, tick, snapshot version, full revision, and coherent tick state are validated. Confirm deterministic same-fixture identity, distinct same-tick quest identities, transient correlation, and no realistic stale acceptance path. Record the exact default sequence owner and any replay/idempotency residual risk.

### Atomicity and rejections

Confirm all validation precedes mutation, accepted work occurs on a persistence-safe clone, synchronization completes before result/event construction, and unexpected failure exposes no partial clone. Confirm malformed, wrong-player, stale, incoherent, missing, active, completed, and failed paths return original identity/content with zero events and no state changes.

### Complete accepted parity

Confirm the locked accepted snapshot and notice hashes, input immutability, final quest category/status/objectives/tracked state, active/completed ids, preparation activity, notification, Chronicle, records, Codex, body/runtime, progression, ordering, ids, text, and caps. Confirm acceptance advances no tick and applies no reward, inventory, reputation, turn-in, tracking-toggle, activity-advance, rest, travel, or account behavior.

### Event contract

Confirm exactly one typed `player.quest.accepted` event follows acceptance only; its deterministic id incorporates command identity; same-tick distinct commands remain distinct; payload is presentation-safe and exposes no mutable snapshot internals; event/correlation state is not persisted or dispatched.

### Persistence, browser, and TS/JS

Confirm no save field/version, schema, migration, compatibility behavior, or storage contract changed. Confirm post-acceptance roundtrip preserves all changed state. Confirm the UI import graph has no Node-only dependency and the `.js` peer intentionally re-exports the `.ts` authority.

### UI adapter and hygiene

Confirm the gameplay-loop bridge constructs/invokes the command and projects notices without direct mutation. Confirm `QuestsPanel.tsx` updates snapshot/active section only when accepted and always renders the notice. Check for dead extraction helpers/imports, duplicate acceptance authority, unexpected changed paths, conflict markers, whitespace, temporary artifacts, and stale active anchors. Do not misclassify helpers still called by tracking, turn-in, activity, or rest.

## Required Validation

Run:

`node --test tests/unit/player-quest-acceptance-command.test.mjs tests/unit/player-quest-acceptance-characterization.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

Also run direct acceptance-authority/mutation, resolver/command/event identity, export/import, persistence-correlation, UI application, helper-reference, changed-path, conflict-marker, temporary-artifact, `git diff --check`, and final status checks.

Run typecheck only if it materially clarifies a touched-boundary diagnostic. Do not run the full suite, DB build, UI build, package installation, servers, generated-output refresh, or unrelated cleanup.

## Decision Rules

Accept only if the engine is the sole acceptance authority, all focused behavior remains exact, rejection is atomic, event/correlation is safe and transient, persistence/browser/UI boundaries are coherent, and no material hygiene defect remains.

If repair is required, select the smallest `Version 0.6.1.2 - ... Repair` support route and do not select another consumer.

## Next Consumer Selection

Only after accepting the transition, compare at least:

- quest tracking (`toggleTrackedQuest(...)`);
- activity selection (`setCurrentActivityFromRecord(...)`);
- activity advancement;
- rest;
- quest turn-in.

Select exactly one using current call sites, mutation surfaces, existing characterization/test evidence, integration value, dependencies, rejection complexity, persistence impact, and scope risk. Prefer a single bounded action; do not bundle lifecycle work or add generic command infrastructure.

Record candidates, exact call/mutation surfaces, comparative risk/value, selected label, allowed scope, exclusions, stop conditions, and required tests. Do not implement the selected consumer in this audit.

## Documentation And Handoff

Overwrite the current output; replace/prune the current handoff; update only current anchors in the sequencing plan, roadmap, continuity brief, and backlog; and overwrite the current prompt with the selected next primary consumer or narrow repair.

Do not create a new design or temporary audit document unless an unrepresentable blocker requires one.

## Current Codex Output Requirements

Record source/run/date, starting commit/status, audit verdict, files inspected and documentation changed, checks/outcomes/omissions, authority/identity/atomicity/parity/event/persistence/browser/TS-JS/UI/hygiene verdicts, residual risks/debt, candidate comparison and selected route or repair, Deep Research decision, next version, and suggested commit message.

Suggested commit message when accepted:

`docs(audit): verify engine-owned quest acceptance transition`
