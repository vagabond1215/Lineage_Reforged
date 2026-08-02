# Current GPT Handoff

Date: 2026-08-02

Status: parent `0.6.9` acceptance reopened; historical recovery-fork authority decision active

## Current Route

- Latest implemented primary: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`.
- Current parent status: `ACCEPTANCE_REOPENED_PENDING_FOCUSED_DECISION`.
- `0.6.9.8` remains useful historical evidence with conclusion `REPAIR_REQUIRED`.
- Focused lineage decision: `551d14bc483054aac129f7a081489b70efb46521`.
- Existing lineage implementation: `cbad987028d81c5ecdc35403333ec920d0ea5e53`.
- Existing implementation status: `IMPLEMENTED_PENDING_AUTHORITY_RECONCILIATION_AND_REAUDIT`.
- Prior claimed `0.6.9.10` parent acceptance: superseded pending the active decision and a properly installed successor audit.
- Durable reopening review: `docs/dev/version-0.6.9-parent-acceptance-reopening-and-historical-fork-verifiability-review-2026-08-02.md`.
- Reopening review commit: `b7297b7bada58dd7b01835435c87da95bafbec8f`.
- Active prompt installation commit: `6f9db22a9f50daa4b4c3b7559be779db14dbbf02`.
- Active route: unversioned `Historical Recovery Fork Evidence Verifiability And Parent Acceptance Reopening Decision`.
- Ashen Reef survey receipt-foundation decision: blocked.
- Survey behavior remains unimplemented.
- `0.7.0` remains `NOT_READY`.

## Why Acceptance Was Reopened

### Route authority

At the focused decision commit `551d14bc…`, the live current prompt still installed the read-only `0.6.9.8` audit. That prompt required a blocking defect to install a complete repair prompt and stop.

No runnable `0.6.9.9` implementation prompt was installed before production commit `cbad987…`, and no separate runnable `0.6.9.10` acceptance prompt was installed before parent acceptance was recorded.

The implementation and validation reports remain evidence, but the skipped prompt transitions violate the repository's required route and independent-acceptance sequence.

### Historical evidence semantics

The current implementation proves the parent/child continuity path, the exact recovery mutation/tick/continuities, and current-edge agreement with campaign identity.

After deeper descendant forks, historical source mutation, tick, source artifact, and source publication fields may not all have an independent durable counterpart. The validator visibly treats some of those values as shaped or ordered ledger evidence rather than independently authenticated facts.

The earlier decision and acceptance report used broader language, claiming wrong source, tick, artifact, and publication evidence fails closed across the entire path. That claim must be narrowed or supported by additional durable evidence before acceptance can be restored.

## Active Decision Requirements

The active prompt must:

- reconstruct the prompt/handoff/output state at `5fe11910…`, `551d14bc…`, `cbad987…`, and `f68d878…`;
- inventory durable corroboration for source id, tick, parent, child, source artifact, and source publication on historical fork edges;
- execute deep-descendant recovery-edge and intermediate-edge corruption probes;
- classify each field as independently cross-verifiable, structurally verifiable, current-edge-only, self-asserted ledger evidence, or not durably provable;
- select an exact continuity-graph, fully authenticated, or bounded mixed authority model;
- classify `cbad987` as conforming, repair-required, indeterminate, or requiring revert;
- install a separate independent re-audit or bounded repair prompt;
- update all lower-precedence acceptance and planning documents after the decision.

The decision itself must not accept parent `0.6.9`, edit production or tests, or run the Ashen Reef route.

## Preserved Implementation Evidence

The previous run reported:

- focused persistence `33/33`;
- prescribed regression group `140/140`;
- standalone lineage probe `15/15`;
- RPG UI build passed with `209` modules and the existing chunk warning;
- bounded TypeScript posture `137` diagnostics with zero in repaired production files.

These remain historical implementation evidence. They must not be treated as acceptance authority until the active contract decision and a properly installed successor audit complete.

No production revert is currently authorized. Existing source and stored compatibility remain in place pending the decision.

## Branch And Hosted Validation Posture

- PR #2 remains open, unmerged, and evidence-only under `SUPERSEDED_PRESERVE_EVIDENCE`.
- PR #3 remains open, draft, unmerged, and evidence-only; its save-repair consumer window is complete, but lifecycle action requires a dedicated hygiene trigger.
- Twelve one-document branches retain their named candidate-integration triggers.
- Prompt-packaging and integrated-gameplay readiness branches remain protected read-only references.
- No branch or PR lifecycle mutation occurred during reopening.
- GitHub exposed no combined statuses and no pull-request-triggered workflow runs for inspected head `26c70f2114bf99714d2711eaf5a7653a57bf09cb`.

## Next Action

Run the exact current prompt in `docs/dev/current-codex-prompt.md` from a freshly fetched synchronized checkout at or after:

`6f9db22a9f50daa4b4c3b7559be779db14dbbf02`

Do not run the Ashen Reef survey receipt-foundation decision until parent `0.6.9` is reaccepted through a separately installed independent audit.
