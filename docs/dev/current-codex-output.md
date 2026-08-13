# Current Codex Output

Date: 2026-08-13

Source run: `Version 0.6.10.3 - Ashen Reef Survey Advancement Post-Repair Acceptance Audit`

Parent version: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Label class: support suffix

Milestone impact: `supports_current_band`

Branch/status assumption: clean synchronized `master == origin/master` at audit start `bc9783803c08ab403cad0302727d5b701291da40`; production and tracked tests remained read-only

Inspected implementation: `008db9c93eb8818aea51652be07fd196df41c45f`

Inspected repair: `59af92629a79e95fa20247959159e336a8dbc88e`

Audit authority commit: `<AUDIT_AUTHORITY_COMMIT>`

Final coordination commit: `<FINAL_COORDINATION_COMMIT>`

Decision: `REPAIR_REQUIRED`

Representative-loop classification: blocked; no classification issued while parent authority remains unaccepted

Next route: `Version 0.6.10.4 - Ashen Reef Survey Progression Coherence And Projection Placement Repair`

## A. Files Changed

Documentation and coordination only:

- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/design/ashen-reef-survey-advancement-authority-acceptance-audit.md`
- `docs/design/ashen-reef-survey-occurrence-result-and-consequence-receipt-foundation-decision.md`
- `docs/dev/repository-first-agent-work-protocol.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/design/current-planning-anchor-reconciliation.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/design/static-content-expansion-program.md`
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`
- `docs/dev/branch-disposition-register.md`

No production source, shared contract, tracked test, schema, migration, save format, content, asset, dependency, branch, pull request, or evidence ref changed.

## B. Patch And Decision Summary

Parent `0.6.10` remains unaccepted. Direct inspection and removable adversarial execution reproduced two residual failures inside the repaired authority:

- `AR-007` / residual `AR-001`: `campaign-rules.ts` accepts an internally self-consistent retained progression/Echo state without recomputing it from retained attributes and skills. A forged zero-Echo progression with a caller-recomputed canonical intent remains valid target authority; the legitimate retry becomes `conflicting_retry`, while the forged retry becomes a durable `duplicate`.
- `AR-008` / residual `AR-003`: projection inspection treats exact row bytes as sufficient and does not validate their persisted authority position. Reversing two genuine notification rows and two Chronicle rows remains undiscoverable, direct repair returns `projection_already_correct`, and version-7 publish/load preserves the wrong order.

`AR-002`, `AR-004`, `AR-005`, and `AR-006` passed independent inspection. Positive four-stage, caller, duplicate, fork, save/load, publication, defeat/recovery, correction, non-proposal, and skill-presentation evidence also passed. Those facts narrow the repair but do not override either durable-authority failure.

No formal representative-loop classification is made. A separate observation found ordinary new-game creator state does not organically provide the survey quest, tracked state, selected survey activity, or known Ashen Reef destination; current "fresh" survey tests inject those prerequisites. Reconsider that evidence only after parent acceptance.

Installed `Version 0.6.10.4` as a support repair limited to owner-derived progression coherence and byte-correct projection placement. It must preserve every passing contract and install separate production-read-only `0.6.10.5` on success. `0.7.0` remains `NOT_READY`.

## C. Tests And Checks Run

- synchronized identity: clean `master == origin/master == bc9783803c08ab403cad0302727d5b701291da40` before audit;
- full repair diff inspection: `4daa6f997de34108e71231c5b0b0e8f5f861c310..59af92629a79e95fa20247959159e336a8dbc88e`; `git diff --check` passed;
- focused survey plus adjacent runtime/caller/persistence matrix: `169/169` passed;
- prescribed historical companion `achievements.test.mjs`: `8/8` passed, for the recorded `177/177` grouping;
- additional account/run/legacy/deterministic coverage: `36/36` passed;
- Knowledge boundary matrix: `132/132` passed;
- clock/schema matrix: `107/107` passed;
- RPG UI production build: Vite `5.4.21`, `212` modules transformed, passed with only the registered large-chunk advisory;
- bounded TypeScript audit: exit `2`, exact registered baseline `137` diagnostics; only the same two pre-existing touched-file `ActivityPanel` TS2375 diagnostics appeared;
- removable adversarial audit: nine cases executed; eight positive/rejection assertions passed and the byte-correct placement assertion failed against current behavior, reproducing `AR-008`; the separate `AR-007` case proved the forged authority validates and controls retry identity;
- independent persistence probes confirmed non-empty survey authority survives pending defeat and completed recovery, and confirmed row-placement drift survives version-7 publication/readback/restart;
- temporary probe and build-output artifacts were removed;
- starting hosted prompt matched local; no combined status contexts or PR-triggered workflow runs existed on the repair or audit-start heads.

## D. Applicable Failure Patterns, Risks, And Follow-Up

- `FP-001`: executable production caller and panel-facing adapter evidence passed; creator reachability remains only an observation because the parent failed first.
- `FP-002`: green prescribed tests did not accept a parent after independent semantic failures.
- `FP-003`: repair remains production-reachable, but exact placement drift has no completion posture.
- `FP-005`: technical retry identity, caller-state retention, and all terminal clearing paths passed.
- `FP-006`: no repair may evict newer or opaque truth; the next repair must preserve caps and indices.
- `FP-008`: mechanically reusable branches and PRs remained read-only evidence.
- `FP-009`: inspected implementation, repair, audit-start, local, remote, hosted, and coordination identities are recorded separately.
- `FP-011`: semantic validation must precede durable duplicate lookup and mutation.
- `FP-012`: complete graph shape is insufficient when retained derived authority is owner-incoherent.
- `FP-013`: nested survey authority passed migration, fork, defeat, recovery, save, and publication preservation.
- `FP-014`: caller-recomputed canonical strings do not make forged owner semantics authoritative.
- `FP-015`: newly recorded; derived progression must be recomputed from its retained owner inputs.
- `FP-016`: newly recorded; exact projection bytes do not prove exact authority placement.

Risk: the `0.6.10.4` repair must not broaden into generic projection cleanup, UI work, save-version change, balance change, or representative-loop reachability work. If preserving opaque indices and total known-row order cannot be made decision-complete inside the bounded owner, it must return `REPAIR_INCOMPLETE` rather than improvise.

## Branch And Pull-Request Lifecycle Review

Fresh orientation inspected one local branch, 36 non-default remote branches, both open pull requests, the four exact survey evidence refs, and the protected readiness ref. PR #2 remains open non-draft at `e78dc645cfb658685be12f45f46d34b7c0da1119`; PR #3 remains open draft at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. Both remain `SUPERSEDED_PRESERVE_EVIDENCE`. The four Connector refs remain `CANDIDATE_INTEGRATION` only for broader named consumers; the readiness ref remains `PROTECTED_REFERENCE`. No disposition changed and no merge, cherry-pick, rebase, force update, PR mutation, closure, deletion, or evidence-ref mutation was due. Reinspect at `0.6.10.4` orientation or an earlier explicit lifecycle trigger.

Suggested commit message: `docs(survey): record post-repair audit failure`

Next recommended version/run: `Version 0.6.10.4 - Ashen Reef Survey Progression Coherence And Projection Placement Repair`
