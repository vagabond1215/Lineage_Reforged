# Current GPT Handoff

Date: 2026-08-10

Status: `Version 0.6.10.1` complete with `REPAIR_REQUIRED`; parent `0.6.10` remains unaccepted

## Current Route

`Version 0.6.10.2 - Ashen Reef Survey Advancement Authority Repair`

Parent:

`Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Implementation under audit:

`008db9c93eb8818aea51652be07fd196df41c45f`

Audit starting head:

`5f018b499b9e8c2feb31a75beec6b1f1b9b4e5e1`

Milestone posture:

- accepted `0.6.9`: unchanged;
- `0.6.10`: implemented, repair required, not accepted;
- representative-loop classification: blocked because parent acceptance failed;
- `0.7.0`: `NOT_READY` pending repair, independent post-repair acceptance, and a later explicit docs-first band-entry decision.

## Audit Decision

The independent production-read-only audit found six material gaps:

1. normalized progression/reputation owner inputs are shallowly validated and nested canonical ordering is caller-controlled;
2. correction authority accepts an empty evidence-ID set;
3. projection repair lacks `(appliedTick, stable resultId)` total order and can evict newer truth from a reordered capped destination;
4. the real caller retains request identity on an untyped command-preparation `null` path rather than only a classified technical retry;
5. required geographic Knowledge/known-location/map `no_proposal` facts are absent from plan/result authority;
6. the panel mislabels unblocked zero-delta skill outcomes as breakthrough-gate blocked.

The permanent decision and exact owner/test matrix are in `docs/design/ashen-reef-survey-advancement-authority-acceptance-audit.md`. The accepted design package remains `PACKAGE_READY`; only the implementation failed its audit.

## Evidence Reproduced

- Survey characterization/command/persistence: `25/25` passed.
- Required focused/adjacent matrix: `167/167` passed.
- Additional Knowledge boundary validation: `76/76` passed.
- Vite production build: passed, `211` modules, existing chunk advisory only.
- Bounded TypeScript: exact `137`-diagnostic baseline, with only the same two pre-existing touched `ActivityPanel` findings.
- Independent positive probe passed four stages, source immutability, exact two-tick body/resources, current-state duplicate behavior, malformed no-throw rejection, fork/candidate authority, terminal event repair, and defeat/recovery preservation.
- Independent negative probe proved `AR-001`, `AR-002`, and `AR-003`; it was removed before coordination.

No production source, shared contract, tracked test, serializer, migration, dependency, content, asset, branch, or PR state changed during `0.6.10.1`.

## Branch And PR Posture

The audit fetched/pruned and reviewed one local branch, 36 non-default remote branches, both open PRs, the four exact Connector evidence refs, and the protected readiness ref.

- PR #2: open non-draft, `e78dc645cfb658685be12f45f46d34b7c0da1119`, `SUPERSEDED_PRESERVE_EVIDENCE`.
- PR #3: open draft, `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`, `SUPERSEDED_PRESERVE_EVIDENCE`.
- Connector evidence refs: retain their registered evidence-only dispositions.
- Integrated-gameplay readiness and prompt-packaging refs: remain `PROTECTED_REFERENCE`.

No lifecycle action was due. Reinspect during `0.6.10.2` orientation; do not merge or mutate evidence as implementation.

## Next Execution Instructions

Read `AGENTS.md` and execute `docs/dev/current-codex-prompt.md` completely. Repair only the six numbered findings, preserve the positive contract matrix, and keep turn-in/rewards, geographic Knowledge implementation, generic activity infrastructure, direct parent acceptance, representative-loop classification, and `0.7.0` outside the support run.

If every repair and preservation gate passes, return `IMPLEMENTED_PENDING_POST_REPAIR_AUDIT` and install production-read-only `Version 0.6.10.3 - Ashen Reef Survey Advancement Post-Repair Acceptance Audit`. If any row remains incomplete, record `REPAIR_INCOMPLETE` and install the smallest support continuation without broadening scope.
