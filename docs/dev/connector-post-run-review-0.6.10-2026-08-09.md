# Connector Post-Run Review — Version 0.6.10

Date: 2026-08-09

Disposition: `NO_IMMEDIATE_CODEX_REPAIR_PROCEED_TO_0.6.10.1`

## Review Boundary

This is the policy-mandated Connector independent review after the completed `Version 0.6.10 - Ashen Reef Survey Advancement Authority` implementation run.

Reviewed hosted identities:

- pre-implementation starting head: `85ad4ea9371b81f2e72d54449b6ce31c908118db`;
- implementation commit: `008db9c93eb8818aea51652be07fd196df41c45f`;
- coordination/audit-install head inspected by this review: `7913e7702eb5035278a5ba332d7e4ea399521e38`.

This review used the GitHub Connector and remote repository contents. It did **not** rerun local tests, the production build, TypeScript, serialization probes, executable adversarial probes, Git worktree checks, or the broad suite. Exact executable validation claims remain the completed Codex run's claims until independently reproduced by `Version 0.6.10.1 - Ashen Reef Survey Advancement Acceptance Audit`.

## Scope Reviewed

The review inspected:

- the full `85ad4ea... -> 008db9c...` implementation delta and the `7913e770...` coordination package;
- `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, and the installed `0.6.10.1` prompt;
- the new survey engine owner and the campaign prepare/commit seam;
- the real `ActivityPanel -> GameSessionContext -> engine` caller;
- removal/delegation of legacy Ashen Reef mutation in `gameplayLoop.ts`;
- nested survey-authority preservation through `saveManager.ts` and `normal-defeat.ts`;
- JS forwarding peers/public export posture;
- representative command/persistence test coverage visible in the committed test sources;
- live open PR metadata, open issue inventory, and hosted status/workflow availability.

## Findings

### CR-001 — Engine ownership transition is real

`gameplayLoop.ts` no longer performs the Ashen Reef survey's body/resource/skill/quest/operation/discovery/activity mutation. Survey preview delegates to `resolvePlayerSurveyActivityAdvancementPlan(...)`, and direct generic execution of a survey intent returns the source snapshot unchanged with an explicit engine-owned-command warning.

The real UI caller now routes survey execution through `ActivityPanel -> GameSessionContext -> executePlayerSurveyActivityAdvancementCommand(...)`, and applies snapshot/control only when the authoritative command accepts.

Disposition: `CONFIRMED_REMOTE_SOURCE`.

### CR-002 — The continuity-before-receipt seam addresses the accepted authority problem

`preparePlayerSurveyCampaignMutation(...)` validates source/control authority and chooses the accepted continuity before immutable survey evidence is authored. `commitPreparedPlayerSurveyCampaignMutation(...)` revalidates unchanged source/control state, accepted continuity, and required survey evidence before atomic admission.

The generic already-mutated campaign admission path remains available for existing callers rather than being generalized into a new framework.

Disposition: `CONFIRMED_REMOTE_SOURCE_REQUIRES_EXECUTABLE_REAUDIT`.

### CR-003 — Durable duplicate/restart semantics are implemented, not transient-only

The survey command checks persisted request authority before ordinary stale-state rejection. An exact retained request returns original result/receipt evidence with the current snapshot and no repeated effect or projection. Conflicting or incomplete durable authority fails closed.

The implementation also retains request identity in the real caller only for the explicitly classified technical pre-accept transition-failure path.

Disposition: `CONFIRMED_REMOTE_SOURCE_REQUIRES_EXECUTABLE_REAUDIT`.

### CR-004 — Projection repair has a production-reachable owner

Notification, Chronicle, and event projections can be retained as pending after gameplay truth. The engine exposes bounded repair with deterministic repair identity/ordinal, same-source validation, retention handling, duplicate safety, and terminal event re-emission posture. `ActivityPanel` exposes repair when pending survey projection authority is present.

Disposition: `CONFIRMED_REMOTE_SOURCE_REQUIRES_EXECUTABLE_REAUDIT`.

### CR-005 — Parent-ledger preservation scope extension is justified and narrow

The implementation touched `normal-defeat.ts`, which was outside the parent prompt's initially enumerated production paths. The committed change is a narrow parent-object preservation spread so an existing optional `authorityLedger.ashenReefSurvey` container is not discarded when defeat/recovery rewrites owned ledger fields. `saveManager.ts` contains the analogous preservation adjustment at its migration rewrite.

This is consistent with the prompt's fail-closed extra-surface rule and with newly recorded guardrail `FP-013 — Parent Authority Rewrites Must Preserve Nested Owner State`; it is not a defeat-system redesign.

Disposition: `JUSTIFIED_SCOPE_EXTENSION_REQUIRES_PARENT_AUDIT_CONFIRMATION`.

### CR-006 — JS peer posture is internally consistent

The relevant `.js` peers are forwarding modules, including the new `player-survey-activity-advancement.js`, `campaign-rules.js`, `campaign-session.js`, game-engine `index.js`, and shared-events `index.js`. Their unchanged one-line forwarding form explains why several expected peers did not require generated duplicate implementation bodies in the commit delta.

Disposition: `CONFIRMED_REMOTE_SOURCE`.

### CR-007 — Test investment is materially aligned with the risk surface

Committed tests visibly cover four-stage plan/execution parity, authority-stable rejection, normalized owner-input sensitivity, durable duplicate behavior, projection repair/expiry/event terminal behavior, coherent legacy baseline, missing/locked Codex behavior, explicit non-effects, correction completeness/cycles/orphans, save/load, and campaign persistence preservation.

The completed Codex report records `24/24` command+persistence and `167/167` prescribed focused/adjacent gates, production build success, and unchanged bounded TypeScript baseline. Those counts are **not independently certified by this Connector review** and must be reproduced by the active parent audit.

Disposition: `COVERAGE_SHAPE_CONFIRMED_COUNTS_PENDING_INDEPENDENT_REPRODUCTION`.

### CR-008 — Coordination transition is correct

The active route is `Version 0.6.10.1 - Ashen Reef Survey Advancement Acceptance Audit`; parent `0.6.10` is `IMPLEMENTED_PENDING_PARENT_AUDIT`; `0.7.0` remains `NOT_READY`.

The installed audit is production-read-only, explicitly rejects self-acceptance from the implementation report, requires an independent adversarial matrix, and has a fail-closed `REPAIR_REQUIRED` outcome installing `0.6.10.2` if a material gate fails.

Disposition: `CONFIRMED`.

## Connector Cleanup Performed

PR #3 remained correctly `SUPERSEDED_PRESERVE_EVIDENCE` but still named `0.6.10` as the active route. Its body was refreshed through GitHub metadata only to state:

- `0.6.10` is implemented at `008db9c...` and pending parent audit;
- `0.6.10.1` is the active route;
- the evidence PR is not a consumer of the audit and must not widen, repair, or prejudge it.

No PR lifecycle, branch, source, or test change was made.

## Hosted Posture At Review

- hosted `master` before this review document: `7913e7702eb5035278a5ba332d7e4ea399521e38`;
- open PRs: #2 and #3 only;
- open GitHub issues: none;
- mechanical PR mergeability remains dynamic and does not alter semantic dispositions;
- no combined status contexts or pull-request-triggered workflow runs were exposed for the inspected coordination head.

## Review Conclusion

Connector inspection found no source-visible defect or coordination contradiction that justifies an immediate repair run or another broad pre-audit Connector pass.

The implementation is large enough that parent acceptance must not be inferred from this review. The correct next step is one uninterrupted execution of:

`Version 0.6.10.1 - Ashen Reef Survey Advancement Acceptance Audit`

The audit should independently reproduce the material behavior and validation rather than relying on this review or the implementation report.

Final Connector disposition:

`NO_IMMEDIATE_CODEX_REPAIR_PROCEED_TO_0.6.10.1`
