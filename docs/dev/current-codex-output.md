# Current Codex Output

Date: 2026-07-28

Source version/run: unversioned `Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Branch/status assumption: `master` began clean and synchronized with `origin/master` at `18e3ca6ca47ceb88260cd18521beb27e1305b209`; this report describes the validated working tree before the run commit.

## Result

The documentation-only receipt-contract decision is complete and accepted.

`docs/design/functional-state-lethal-process-care-requirement-and-mortal-crisis-receipt-contract-decision.md` now separates functional state, body/resources, injury/trauma, independently owned lethal processes, derived care requirements, life state, Mortal Crisis orchestration, accepted actual death, final closure, and convalescence. It defines phase admission, request/occurrence/result/consequence identity, owner-specific receipts, Stakes commitment, persistence, replay, correction, and observer-safe presentation.

No executable or balance-bearing package is authorized. Bounded external research is required next.

## Live Baseline

- Current HP at or below zero resolves to `dead` or `hardcore_dead`.
- Run entry and snapshot changes can call `archiveActiveRun(...)`.
- Archival evaluates achievements, resolves Legacy payout, records account history, deposits the estate, persists the profile, and deletes resolved character slots.
- Combat defeat/incapacitation, HP/resource synchronization, metabolic body state, recovery context, party, travel, inventory, service, spell, Chronicle, and snapshot seams exist, but no durable functional-state, lethal-process, care-requirement, Mortal Crisis, death-result, consequence-receipt, or correction owner exists.
- Current combat `heal.hp` behavior is a narrow HP hook and does not own injury, lethal-process, care, restoration, or death truth.
- Current tick-composed event ids, `hardcore`, and `deathZeroesPrestige` are compatibility evidence, not accepted occurrence/Stakes authority.
- Current HP-zero archive/delete behavior is classified as `rejected_target_behavior`, not architecture.

## Accepted Decisions

- Functional state is an owner-accepted assessment of capability, separate from causes and life state.
- Every active lethal-process instance has exactly one owning domain and independent accepted transitions.
- Care requirements are source-linked derived needs; care attempts are occurrences whose affected owners apply accepted results through separate consequence receipts.
- Mortal Crisis owns episode and phase orchestration only. The accepted phases are Threat Resolution, Immediate Stabilization, Extraction, Transit, Treatment Or Restoration, and Closure.
- A phase skip requires retained owner-certified evidence.
- Stabilization does not imply consciousness, mobility, full recovery, definitive care, process resolution, restoration, or survival.
- Normal, Committed, and Ironbound retain their accepted rollback, commitment, checkpoint, continuity, death, and closure semantics.
- Actual death and final closure remain separate except where accepted Ironbound policy makes actual death, final death, and closure atomic.
- UI, Chronicle, and narrative may project observer-safe accepted facts only; hidden timers, diagnoses, uncertainty internals, and future outcomes remain private.
- The smallest later implementation package is `NO_PACKAGE`.

## Research Decision

Exact next route:

`GPT-DR.health.lethal-process-stabilization`

Exact artifact:

`docs/dev/tmp-grounded-lethal-process-stabilization-and-first-aid-research-2026-07-28.md`

The bounded domains are hemorrhage/shock, airway compromise/drowning, poisoning/antidote limits, cold/heat exposure, burns, stabilization versus definitive care, transport/reassessment, and observer-safe qualitative urgency.

The prompt prohibits medical advice, clinical protocols, exact real-world timers, dosages, diagnostic decision trees, probabilities ready for gameplay, and proprietary game values.

Named consumers are:

1. unversioned `Lethal Process And Stabilization Research Integration Decision`;
2. the first lethal-process definition/catalog plan;
3. the first care-capability and stabilization contract/package;
4. the first observer-safe crisis assessment/presentation package.

## Retained Evidence

All six named mortality/narrative/elemental artifacts were consumed only for bounded trace evidence, remained byte-identical, and remain preserved because named later consumers still exist.

## Files Changed

- `docs/design/functional-state-lethal-process-care-requirement-and-mortal-crisis-receipt-contract-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/design/current-planning-anchor-reconciliation.md`
- `docs/design/static-content-expansion-program.md`
- `docs/future_content_backlog.md`

## Checks Run

- repository, branch, worktree, upstream, fetch/pull, and tracking alignment;
- active prompt and prerequisite acceptance review;
- live HP-zero, archival/delete, recovery, combat, body/resource, party, treatment/spell, event, persistence, and account seam inventory;
- exact six-artifact existence and before/after SHA-256 verification;
- required document and active-prompt path verification;
- changed-path and documentation-only scope review;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete diff review.

No build, content lint, typecheck, test, server, generator, package installation, or gameplay command was run because this was a documentation-only decision and the prompt prohibited unrelated validation.

## Suggested Commit Message

`docs(stakes): define mortal crisis receipt contracts`

## Risks / Follow-Up Notes

- Current HP-zero archival and save deletion remain live legacy behavior.
- No active functional-state, lethal-process, care-requirement, Mortal Crisis receipt, death/restoration, or correction owner exists.
- The research artifact will remain advisory until the repository integration decision explicitly accepts, narrows, rejects, or defers each abstraction.
- All six retained evidence artifacts must remain until their later named consumers record consumption.
- The isolated `prep/integrated-gameplay-0-7-readiness-audit` branch remains unmerged and untouched.
- The broad workspace typecheck remains the separately classified 173-diagnostic baseline.

## Next Recommended Run

`GPT-DR.health.lethal-process-stabilization`
