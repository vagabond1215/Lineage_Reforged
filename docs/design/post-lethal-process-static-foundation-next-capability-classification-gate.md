# Post-Lethal-Process Static Foundation Next-Capability Classification Gate

Date: 2026-07-29

Source run: unversioned `Post-Lethal-Process Static Foundation Next-Capability Classification Gate`

Label class: unversioned

Milestone impact: `supports_current_band`

Status: accepted classification; one narrower unversioned owner-contract prerequisite is ready; implementation remains unassigned

## 1. Decision

Current `master` does not satisfy the `0.7.0 - Integrated Gameplay Systems` entry gate.

The strongest next capability is engine-owned advancement of the existing Ashen Reef survey activity. It is the smallest live, inventory-free interaction that can reuse accepted travel, quest acceptance/tracking, activity selection, body/resource, skill-progression, discovery, synchronization, save, and UI surfaces while advancing gameplay beyond selection.

That capability is not dependency-closed for implementation. The current survey branch is deterministic, but its command/result authority, occurrence and receipt identity, affected-owner boundaries, persistence/replay behavior, preview parity, and accepted-only UI contract are not decided. Assigning `0.6.9` now would therefore be premature.

The selected next route is:

`Ashen Reef Survey Activity Advancement Scope And Owner Contract Decision`

Classification:

`UNVERSIONED_PREREQUISITE`

Dependency result:

`DOCUMENTATION_PREREQUISITE_READY`

Implementation result:

`NO_PACKAGE`

No parent-specific repair is required for accepted `Version 0.6.8`, and no support suffix is justified.

## 2. Repository And Parent Evidence

- Starting commit: `776bf06c881636db04db27ff6f327b1c680c76a6`.
- Branch: `master`.
- Upstream: `origin/master`.
- Starting worktree: clean.
- Starting divergence: zero local-only and zero remote-only commits.
- Parent implementation: `b07084055359aa4ba13eeac3ad63c2a8fad05477`.
- Parent acceptance: `776bf06c881636db04db27ff6f327b1c680c76a6`.
- `Version 0.6.8.1` accepted all sixteen parent criteria without repair.
- The six-record/four-owner lethal-process static foundation remains isolated from runtime, saves, combat-health authority, and mutable health.

The parent is complete. Its next unresolved health node is source-reference contracts plus owner-specific mutable process instances, but every mutable health node also requires occurrence identity, persistence/migration, replay, and correction. Static-definition acceptance does not close those dependencies.

## 3. Current Runtime Capability Inventory

| Capability | Evidence | Posture |
| --- | --- | --- |
| Playable start | New-game and game-shell paths enter an interactive local session | `met` |
| Player travel | Engine-owned plan/command/result/event, deterministic identity, stale checks, shared preview/execution facts, synchronization, focused tests, accepted-only UI | `met` |
| Quest acceptance | Engine-owned plan/command/result/event, rejection atomicity, synchronization, focused tests, accepted-only UI | `met` |
| Quest tracking | Engine-owned plan/command/result/event, stale checks, focused tests, accepted-only UI | `met` |
| Activity selection | Engine-owned plan/command/result/event, collision regression coverage, serialization, accepted-only UI | `met` |
| Activity advancement | `gameplayLoop.ts` directly advances time/body state and mutates resources, skills, flags, operations, discovery, current activity, notifications, and Chronicle | `missing_authoritative_owner` |
| Quest turn-in | `gameplayLoop.ts` directly applies completion and rewards; no durable reward receipt or duplicate-delivery protection | `missing_authoritative_owner` |
| Rest | Shell-owned preview/execution and direct full resource restoration; unreconciled with accepted injury, lethal-process, care, and Mortal Crisis boundaries | `blocked` |
| Save/load | Current snapshot JSON and account-scoped local storage roundtrip live state | `partial` |
| Cross-owner effects | Current helpers can apply consequences, but no accepted typed proposal/receipt boundary coordinates the survey interaction | `partial` |
| Replay/correction | Command packages cover deterministic identity and rejection; survey advancement has no occurrence/result/receipt replay or correction contract | `missing` |

The focused current-capability group passed 40/40 across travel, quest acceptance, quest tracking, activity selection, survey skill-gating characterization, and snapshot roundtrip.

## 4. `0.7.0` Entry Matrix

| Entry criterion | Result | Current evidence | Missing closure |
| --- | --- | --- | --- |
| Start-state enters a playable session | `met` | Current new-game/game-shell flow | Preserve in later end-to-end coverage |
| Authoritative save/load preserves slice state | `partial` | Snapshot and account-scoped save roundtrips exist | Decide survey occurrence/result/receipt persistence and restart/replay expectations |
| Engine-owned travel participates | `met` | Accepted player-travel package | Reuse unchanged |
| Activity advances beyond selection through authoritative attempt/result | `missing` | Selection is engine-owned; advancement is shell-owned | Domain-owned survey plan/command/result/event |
| One consequence-bearing cross-system interaction | `partial` | Survey currently crosses clock/body/resources, skills, quest/discovery, operations, and projections | Owner-certified, atomic consequence application |
| Commands/events/sync/stale/accepted-only UI are coherent | `partial` | Strong for existing command packages | Missing for survey advancement |
| Required resource ownership and typed effects exist | `partial` | Clock/body/resources and progression helpers exist | Typed proposals/receipts and exact affected-owner acceptance |
| Replay/tests and explicit failure behavior exist | `partial` | Current command packages are well tested | Survey duplicate, stale, retry, failure, persistence, and correction evidence absent |
| Demo/UI mutations do not control the loop | `missing` | `gameplayLoop.ts` owns the candidate interaction | Move only the survey advancement authority behind an engine boundary |
| Omissions are documented and non-invalidating | `partial` | Broad boundaries are documented | A bounded survey slice and exclusions are not yet accepted |

Verdict:

`NOT_READY`

No criterion may be inferred from static content, planning volume, or selection-only commands. A later readiness audit must explicitly accept every row before `0.7.0` is assigned.

## 5. Current Ashen Reef Survey Behavior

The current branch in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` is deterministic:

1. the tracked quest must be active and the player must be at Ashen Reef;
2. preview and execution advance two ticks using the survey metabolic profile;
3. execution also applies the survey attribute profile, stamina `-10`, and MP `-3`;
4. the first three advances add ordered sector flags, attempt a General Lore gain, update the survey operation, and append notification and Chronicle projections;
5. the next advance confirms ruins, attempts a flora-identification gain, adds the discovery entry, updates the operation, changes current activity to return the packet, and appends projections;
6. accepted snapshots are synchronized before return.

This path uses skill rank to mitigate action cost and applies breakthrough-gated progression. It does not currently perform a difficulty check, draw randomness, or choose among uncertain result bands.

Therefore the first owner decision may preserve the branch as a deterministic domain-specific survey command. It must not silently create a generic activity resolver or claim to settle the broader competence/difficulty/familiarity design. The accepted `Competence, Difficulty, Familiarity, And Compression Authority Decision` remains required before a shared uncertain or generalized activity resolver is implemented.

## 6. Candidate Comparison

| Candidate | Direct milestone value | Reuse | Principal blockers | Decision |
| --- | --- | --- | --- | --- |
| Ashen Reef survey advancement | Highest | Travel, quest, selection, body/resources, skills, discovery, save, UI | Owner/receipt/persistence/preview contract | `selected` |
| General competence/difficulty authority | Indirect for this deterministic slice | Activity audit vocabulary | Broader shared semantics; unnecessary for parity-only survey advancement | `retained_for_later_shared_resolution` |
| Survey quest turn-in | High fallback value | Quest, currency, skills, standing, reputation, Chronicle | Reward eligibility, consumption, idempotency, correction | `fallback` |
| Geography/recognition evidence closure | Low direct `0.7.0` value | Existing Knowledge/place authorities | Multiple later static/mutable owners; no integrated loop | `deferred` |
| Mutable lethal-process instances | High later value | Accepted static definitions | Source references, occurrence, persistence, migration, replay, correction | `blocked` |
| Travel/rest recovery | High | Travel and body/resource state | Rest bypasses accepted health/care boundaries | `blocked` |
| Combat/injury/care | High | Combat engine and static health foundations | Mortal Crisis, actual death, persistence, care, HP-zero archival | `blocked` |
| Rivet cargo/gathering/crafting | High | Authored content and inventory shapes | Inventory transaction/ownership, source state, idempotency | `blocked` |

The survey advancement route has stronger direct milestone evidence and fewer blockers than Geography/recognition, health-process ownership, generic inventory, crafting, or combat. It also avoids the reward-duplication risk of selecting quest turn-in first.

## 7. Owner And Dependency Matrix

| Survey concern | Current owner/fact | Decision still required |
| --- | --- | --- |
| Intent and eligibility | tracked active quest, current location, current snapshot | Exact normalized survey intent and rejection facts |
| Preview/execution parity | shell preview and execution helpers | One material-fact plan used by both |
| Command identity | patterns in travel/quest/activity selection | Survey discriminator, revision inputs, collision and stale policy |
| Attempt/occurrence/result | absent for survey | Whether one accepted deterministic result is also the bounded occurrence record or references a separate identity |
| Time/body/resource cost | clock/body/resource helpers | Proposal versus application owner, atomic rejection, receipt facts |
| Skill progression | breakthrough-gated skill helper | Proposal/application result and duplicate protection |
| Quest/discovery/operation facts | shell flags, discovery, operation, current activity | Exact owner boundaries and accepted facts |
| Notification/Chronicle | shell projections | Project only accepted result/receipt facts; never use prose as authority |
| Persistence | snapshot serialization/local storage | Which identities and applied receipts must survive save/load/restart |
| Replay/correction | absent | Duplicate delivery, retry equivalence, supersession, and reconciliation posture |
| UI | direct call and unconditional snapshot application | Accepted-only bridge and rejected-state notice behavior |

These decisions are coupled. A command extraction without the occurrence/receipt/persistence decision would reproduce the current direct multi-owner mutation behind a new filename rather than close the maturity gap.

## 8. Reconciliation With Accepted Decisions

### Activity Resolution

The reuse audit requires domain-owned commands, normalized intent, authoritative facts, typed proposals, explicit affected owners, atomic accepted consequences, and later synchronization/projection. It rejects treating `advanceCurrentActivity(...)` as a generic resolver and rejects current hashes or generic event ids as uncertainty authority.

The selected survey prerequisite follows that rule. It is narrower than the audit's future shared-resolution lane because the current survey behavior is deterministic. It does not displace the later competence/difficulty/familiarity/compression decision for generalized or uncertain activity resolution.

### Geography And Recognition

The accepted Geography plan separates authored profiles/clues, source teaching, observation occurrence/results, character evidence/recognition, legacy levels, and presentation. Its smallest later district/site evidence closure does not advance an integrated loop by itself and remains deferred.

Survey discovery may emit an owner-certified fact only if the next decision proves the existing discovery owner and exact accepted mutation. It must not implement Geography recognition, clues, observations, evidence, map reveal, or legacy-level migration.

### Health And Mortal Crisis

Static lethal-process definitions close identity only. Mutable health remains blocked by source-reference, occurrence, persistence/migration, replay/correction, function/care, crisis, death, and closure owners.

The survey slice must preserve current body/resource semantics and must not create injury, lethal-process, care, diagnosis, rest, death, or restoration behavior.

## 9. Isolated Readiness Branch Disposition

Read-only comparison inspected:

- branch: `origin/prep/integrated-gameplay-0-7-readiness-audit`;
- branch head: `59c103c3a06d55f35bffa735fd4b7814dffb583e`;
- merge base: `895c02df40332c813a8403bd489af6184111ccba`;
- branch-only paths: one readiness audit and its queued prompt.

The branch's provisional conclusion that `0.7.0` is not ready remains correct after refreshing through accepted Geography/recognition, Activity Resolution reuse, Mortal Crisis contracts, health research/planning, `0.6.8`, and `0.6.8.1`.

Its Ashen Reef survey recommendation also remains the strongest candidate. Its old integration checklist is now satisfied as a refresh input, not as live routing authority. The branch remains isolated, unmerged, unmodified, unre-based, and noncontrolling.

## 10. Exact Next Prerequisite

Run:

`Ashen Reef Survey Activity Advancement Scope And Owner Contract Decision`

The decision must:

- characterize exact current preview and execution behavior;
- define the bounded survey intent, eligibility, plan, command, result, event, occurrence, and receipt posture;
- decide affected owners and typed proposal/application boundaries;
- decide atomicity, stale rejection, duplicate delivery, retry, replay, persistence, and correction behavior;
- decide whether existing snapshot persistence is sufficient or a narrow persisted field is required;
- decide the accepted-only UI boundary;
- prove that deterministic parity does not require the general competence/difficulty framework;
- return one exact dependency-closed later package with a policy-derived label class, or `NO_PACKAGE`.

The prerequisite is documentation-only and unversioned. It may not assign `0.6.9` in advance.

## 11. Candidate Later Paths And Checks

The owner decision must confirm or narrow this candidate implementation surface before activation:

- `packages/engines/game-engine/src/player-survey-activity-advancement.ts`;
- `packages/engines/game-engine/src/player-survey-activity-advancement.js`;
- `packages/engines/game-engine/src/index.ts`;
- `packages/engines/game-engine/src/index.js`;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
- `apps/rpg-ui/src/features/ActivityPanel.tsx`;
- `tests/unit/player-survey-activity-advancement-characterization.test.mjs`;
- `tests/unit/player-survey-activity-advancement-command.test.mjs`;
- `tests/simulation/save-load-roundtrip.test.mjs` only if the decision proves additional roundtrip coverage is required;
- required coordination documents.

Expected later checks:

- exact survey characterization hashes or structural parity assertions;
- preview/execution material-fact parity;
- accepted and every rejected path;
- no-mutation rejection and unexpected-failure atomicity;
- malformed, wrong-player, incoherent, stale, and duplicate command behavior;
- collision-safe command/event/occurrence/result/receipt identity;
- deterministic retry/replay and correction posture;
- skill breakthrough-gate parity;
- sector and completion progression;
- synchronized accepted snapshot;
- save/load/restart preservation for every required identity;
- accepted-only UI application and absence of direct survey mutation in the UI bridge;
- focused existing travel, quest acceptance/tracking, activity selection, body/resource, skill, and save regressions;
- changed-path, protected-boundary, conflict-marker, whitespace, and `git diff --check` audits.

The next documentation decision may change this list only with explicit repository evidence. No implementation path is authorized by this gate.

## 12. Protected Boundaries

- Preserve accepted travel, quest acceptance/tracking, and activity-selection behavior.
- Preserve current survey behavior until a separately activated implementation package characterizes and migrates it.
- Do not broaden the first slice to generic activity advancement, rest, quest turn-in, rivet cargo, gathering, crafting, inventory transactions, combat, health, care, death, Geography recognition, economy, reputation rewards, or UI redesign.
- Do not use generic event ids, notification ids, Chronicle ids, ticks, or wall-clock time as survey occurrence/result/receipt identity.
- Do not introduce uncertainty or a shared resolver into a deterministic parity slice.
- Do not infer mutable health readiness from the static lethal-process foundation.
- Do not modify or merge the isolated readiness branch.
- Keep the known-failing workspace typecheck as a separate audit and cleanup route.

## 13. Explicit Answers

1. **Does current `master` satisfy every `0.7.0` criterion?** No; result `NOT_READY`.
2. **Is a `0.6.8` repair required?** No.
3. **Which capability most directly advances maturity?** Engine-owned Ashen Reef survey activity advancement.
4. **Is it dependency-closed for implementation?** No.
5. **What is the smallest prerequisite?** Unversioned `Ashen Reef Survey Activity Advancement Scope And Owner Contract Decision`.
6. **Does another route have stronger evidence and fewer blockers?** No.
7. **What label class follows?** `UNVERSIONED_PREREQUISITE`; no implementation label is assigned.
8. **What later paths/checks are expected?** The bounded candidate surface and checks in section 11, subject to exact confirmation by the owner decision.
9. **What remains protected?** The boundaries in section 12.
10. **What prompt is installed?** Exactly one prompt for the selected unversioned prerequisite.

## 14. Non-Implementation Confirmation

This gate changes documentation and coordination only. It does not change content, schemas, validators, tests, engines, shared contracts, saves, migrations, dependencies, generated files, UI, assets, or gameplay behavior.
