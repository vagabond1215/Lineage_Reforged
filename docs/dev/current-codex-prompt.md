# Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion

## Run Identity

`Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`fix(save): complete new-campaign and pending-defeat recovery`

## Purpose

Repair the remaining parent-specific failure boundaries found after `0.6.9.2`:

- the real launcher new-campaign retry regenerates character, campaign, and continuity identity after a post-head address failure;
- pending publication recovery can overwrite a newer valid campaign address in the same slot or resolve multiple recoveries by storage enumeration order;
- `recovery_pending` blocks play but has no production-reachable, authority-valid completion owner.

Preserve the accepted `0.6.9.2` immutable-artifact, publication recovery, account-consumer, migration, campaign-control, mutation replay, and Normal-defeat repairs. Do not implement the Ashen Reef survey receipt decision in this run.

## Required Reading

Read:

- `AGENTS.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/design/ashen-reef-survey-minimum-save-identity-and-accepted-state-publication-decision.md`;
- current campaign rules, session mutation, Normal defeat, account publication, save manager, character creation, launcher, lifecycle, shared snapshot, and focused persistence test surfaces;
- current output, handoff, historical/deferred register, planning reconciliation, branch policy, and branch register;
- the protected integrated-gameplay readiness branch through read-only Git inspection only.

## Applicable Failure-Pattern Guardrails

Apply and report evidence for:

- `FP-001` — exercise the real production caller path, not only direct save-manager or helper calls;
- `FP-002` — provide a failure-boundary matrix in addition to green test counts;
- `FP-003` — prove a production-reachable, restart-safe, validated completion owner for the blocked recovery posture;
- `FP-004` — inspect recovery authority at the contended account-and-slot resource scope;
- `FP-005` — test lost and regenerated caller state, rerender/retry, restart, and repeated user submission;
- `FP-006` — prove stale or competing projection recovery cannot replace newer truth;
- `FP-008` — apply semantic branch compatibility review if any branch or PR is considered for integration;
- `FP-009` — distinguish inspected base, implementation starting head, final committed head, and live post-fetch head;
- `FP-010` — map every confirmed finding to implementation, test evidence, and final disposition.

Apply `FP-007` only if this run rewrites a large documentation file; otherwise avoid large-file replacement from partial content.

The completion report must include a finding-to-test matrix and an `Applicable verification guardrails` section. Green counts alone do not satisfy acceptance.

## Execution Gate

1. Verify clean synchronized `master`, upstream, current head, this prompt, the guardrail register, and the post-repair audit.
2. Run `git fetch --all --prune`; inventory all local and remote branches and open PRs; refresh dispositions from live evidence.
3. Reproduce the actual character-creation retry sequence before editing. Do not substitute only direct repeated `publishSave(...)` calls.
4. Reproduce a same-slot recovery collision and confirm current behavior.
5. Confirm there is no production caller that completes `recovery_pending` through validated recovery admission.
6. Build a numbered three-finding inventory and map each finding to current code paths and planned tests before editing.
7. If any finding is not reproducible, stop and install a corrected audit route rather than broadening implementation.
8. Keep every edit inside the parent-specific save/session/new-game/recovery boundary.

## Required Implementation

### A. Stable new-campaign attempt and retry authority

Create the smallest owner-correct new-campaign attempt coordinator or equivalent bounded state that:

- establishes one stable attempt id before campaign authority is created;
- retains the exact normalized character-creation inputs, selected slot, preparation selection, inheritance source, prepared consumer plans, and fingerprints;
- creates character, campaign, and continuity identity once per attempt;
- reuses the original prepared snapshot and identities after a post-head address failure;
- never creates a second campaign merely because `publishSave(...)` threw after verified head publication;
- survives the required retry/restart boundary once the publication has become durable;
- fails closed on conflicting reuse of an attempt id or changed normalized input.

Do not introduce a general workflow framework. The coordinator may remain new-campaign-specific.

### B. Account-and-slot recovery inspection before new publication

Before creating or publishing a new campaign into a slot, inspect durable publication recoveries for the account and target slot.

Implement exact outcomes:

- **one compatible pending new-campaign recovery:** recover the exact retained address and publication, resume its consumer work, and enter that campaign without generating new authority;
- **one incompatible pending recovery:** block overwrite and present an explicit conflict/recovery diagnostic;
- **multiple pending recoveries for the slot:** fail closed into deterministic quarantine or an explicit bounded resolution state; never select by local-storage enumeration order;
- **existing newer valid address plus older pending recovery:** preserve the newer valid address unless exact equivalence or accepted supersession evidence proves the older recovery should control;
- **terminal recovery:** preserve closed authority and existing terminal-consumer rules.

Expose a bounded query or coordinator result for account/slot recovery posture. Do not make callers infer it by iterating raw storage.

### C. Exact consumer and history replay

For a recovered new-campaign publication:

- reuse the original consumer plans and fingerprints;
- apply preparation and inheritance consumption at most once;
- create or repair active history and account achievements at most once;
- do not create a second active campaign record for one attempt;
- preserve publication-keyed receipt conflict closure;
- keep account failure repairable from durable publication evidence.

### D. Reachable validated `recovery_pending` completion

Add one bounded production owner and shell path for pending Normal recovery.

The owner must:

1. find the single retained pending defeat receipt;
2. derive or validate a safe recovery destination from current authoritative world/location facts;
3. reject arbitrary, unknown, malformed, or unsafe destination ids;
4. submit one `recovery_repair` mutation through campaign mutation admission;
5. preserve the original defeat receipt identity and result;
6. apply recovery time, location, HP/Stamina, Chronicle, notification, ledger, and session revision exactly once;
7. return the retained accepted result on duplicate repair submission;
8. keep ordinary commands, saving, and retirement blocked until repair succeeds;
9. provide a clear shell notice and a bounded user action or automatic deterministic repair route;
10. leave the repaired gameplay state unpublished until the normal explicit save path unless an already accepted parent rule requires otherwise.

Do not redesign the launcher or create a general recovery UI.

### E. Existing repair preservation

Preserve and revalidate:

- exact candidate and immutable artifact verification;
- publication recovery evidence written before head/address transitions;
- same-publication address recovery without head advancement;
- target-address/immutable-artifact consistency;
- durable account-consumer plans outside account storage;
- terminal publication and deferred address deletion ordering;
- separately loaded migrated HP-zero head and non-head repair;
- missing, malformed, closed, stale, changed, and wrong-artifact campaign-control rejection;
- ordinary mutation and publication blocking under `recovery_pending`;
- retained duplicate mutation snapshot/control/result correlation;
- conflicting mutation-id rejection;
- Normal defeat balance and preservation rules.

## Required Tests

Add focused executable tests for:

1. the actual character-creation application path, using the production coordinator or lifecycle owner invoked by `App.tsx`, with injected post-head address failure;
2. proof that the application handler reuses that owner and does not regenerate identities on repeated submission;
3. a second user submission recovering the original character, campaign, continuity, artifact, publication, slot, consumer plan, and attempt identity;
4. rerender or caller-state loss before retry;
5. restart after a hidden new-campaign publication;
6. exact prevention of a second active history record;
7. preparation and inheritance consumption exactly once across failure, retry, and restart;
8. an older pending recovery competing with a newer valid address in the same slot;
9. multiple pending recoveries for one slot, proving deterministic fail-closed behavior independent of storage iteration order;
10. one compatible and one incompatible pending recovery classification;
11. production-reachable pending-defeat repair using a valid authoritative destination;
12. rejection of unknown, unsafe, malformed, and conflicting recovery destinations;
13. duplicate pending-defeat repair after later accepted mutations returning the retained result;
14. ordinary mutation, save, quick-save, and retirement remaining blocked before repair;
15. all existing `0.6.9.2` recovery, migration, control, duplicate, account-consumer, candidate-readback, immutable-address, and Normal-defeat cases;
16. the prescribed Node group;
17. the RPG UI production build;
18. TypeScript/JavaScript mirror checks where both surfaces exist;
19. `git diff --check` and complete diff inspection.

Report exact counts. Do not claim the known repository-wide TypeScript audit is green. Reproduce its baseline only when required by the existing validation policy and report whether changed files add diagnostics.

## Failure-Boundary Matrix

The completion report must map executable evidence to at least:

- failure before campaign-head publication;
- failure after verified head publication but before address projection;
- retry in the same process with retained caller state;
- retry after caller-state loss or rerender;
- retry after restart;
- one compatible pending recovery;
- one incompatible pending recovery;
- multiple same-slot recoveries in different enumeration orders;
- an older pending recovery versus a newer valid address;
- account-consumer failure and retry;
- valid pending-recovery completion;
- invalid pending-recovery destination;
- duplicate completion submission;
- stale or conflicting attempt reuse.

## Allowed Production Surface

Expected bounded surfaces include only files needed within:

- `apps/rpg-ui/src/App.tsx`;
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- a narrowly extracted new-game/recovery coordinator under `apps/rpg-ui/src/game-shell/` when necessary;
- `apps/rpg-ui/src/game-shell/state.ts` or one directly related shell component only when needed for the bounded recovery action;
- `packages/engines/game-engine/src/campaign-session.ts`;
- `packages/engines/game-engine/src/normal-defeat.ts`;
- directly corresponding index exports;
- `tests/unit/campaign-persistence-foundation.test.mjs` and narrowly related UI/coordinator tests;
- the parent audit and live coordination documentation.

Any production path outside this list requires a fail-closed scope justification in the completion report. Do not edit shared content catalogs, schemas unrelated to the parent, dependencies, generated output, assets, or survey files.

## Scope Exclusions

Do not:

- run or implement the Ashen Reef survey receipt decision;
- implement survey behavior, receipts, commands, UI, or migrations;
- add Committed or Ironbound Stakes;
- redesign save slots, character creation, account selection, or the launcher;
- add cloud synchronization;
- create a generic transaction, workflow, retry, event, command, or replay framework;
- redesign actual death, succession, injury, trauma, care, rest, or resurrection;
- alter accepted Normal recovery balance except to validate destination authority and complete the existing receipt;
- add dependencies, assets, generated output, or unrelated cleanup;
- merge, modify, rebase, force-update, or delete protected branches;
- merge PR #2.

## Branch And PR Lifecycle

Before edits, fetch and prune and inspect all live branches and open PRs. Update `docs/dev/branch-disposition-register.md` from the live starting head.

No registered connector branch currently implements this repair. Integrate a branch only if fresh evidence proves its exact contents are required by this package and its validation fits the active scope. Otherwise preserve it for its named trigger.

The completion report must list:

- inspected base, implementation starting, final committed, and live post-fetch `master` SHAs as distinct facts;
- local and remote branches and open PRs inspected;
- merge bases, unique commits, changed paths, and semantic overlap for any branch considered relevant;
- exact integration, closure, or deletion actions performed;
- retained branches and next review triggers;
- explicit confirmation when no lifecycle action was due.

## Acceptance

Accept `0.6.9.3` only when:

- the actual launcher retry recovers the first verified campaign rather than creating a second one;
- slot recovery cannot silently overwrite a newer valid campaign;
- multiple same-slot recoveries fail closed deterministically;
- preparation, inheritance, history, and account value remain exactly once;
- pending Normal recovery has a reachable, validated, exactly-once completion path;
- every required focused and prescribed test and build gate passes;
- every applicable failure-pattern guardrail has explicit evidence;
- the finding-to-test and failure-boundary matrices contain no unexplained gap;
- no parent repair regresses;
- the parent acceptance audit is updated from `REPAIR_REQUIRED` to `ACCEPTED_AFTER_REPAIR` only after independent evidence.

If any gate fails, keep the parent unaccepted and install the smallest exact `0.6.9.4` audit or repair. Do not advance to the survey receipt decision.

## Completion

Report:

- reproduced defects;
- exact files changed;
- implementation decisions and bounded owner locations;
- finding-to-test matrix;
- failure-boundary matrix;
- applicable verification guardrail IDs and evidence;
- test/build commands and counts;
- changed-file TypeScript posture;
- inspected-base, starting, final, and live-head identities;
- branch and PR lifecycle;
- remaining risks;
- parent acceptance status;
- installed next prompt.
