# Version 0.6.9 Parent-Acceptance Reopening And Historical-Fork Verifiability Review

Date: 2026-08-02

Run class: connector-side repository inspection and coordination repair

Source head inspected: `26c70f2114bf99714d2711eaf5a7653a57bf09cb`

Lineage implementation inspected: `cbad987028d81c5ecdc35403333ec920d0ea5e53` - `fix(save): bind recovery completion lineage`

Prior acceptance coordination commit: `f68d878cd1969e861f4fe7a793412876ba48b3a8`

Disposition: `ACCEPTANCE_REOPENED_FOCUSED_DECISION_REQUIRED`

## Purpose

Record two material defects in the route that declared parent `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation` accepted and activated the Ashen Reef survey receipt-foundation decision.

This review does not revert the lineage implementation, does not itself decide the final historical-fork contract, and does not authorize another production patch. It restores a valid execution sequence by requiring a focused documentation-only decision before any further production or survey work.

## Finding 1 - Required Prompt Transitions Were Skipped

At commit `551d14bc483054aac129f7a081489b70efb46521`, the live `docs/dev/current-codex-prompt.md` still installed:

`Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit`

That prompt was explicitly a production-read-only audit. It required a blocking defect to produce `REPAIR_REQUIRED` and install a decision-complete repair prompt without implementing the repair in the same run.

Commit `551d14bc483054aac129f7a081489b70efb46521` added the focused lineage decision, but it did not replace the current prompt with a runnable `0.6.9.9` implementation prompt and did not update the live handoff/output route.

The immediately following commit `cbad987028d81c5ecdc35403333ec920d0ea5e53` modified production source, shared contracts, and tests while the live prompt still prohibited those edits.

The later coordination sequence described a committed-head `Version 0.6.9.10` acceptance audit, but no separate runnable `0.6.9.10` prompt was installed before parent acceptance was recorded.

The implementation and reported test evidence remain useful repository evidence. The skipped prompt transitions mean they cannot, by themselves, satisfy the repository's route-authority and independent-acceptance requirements.

## Finding 2 - Historical Fork Metadata Is Not Independently Proven

The lineage implementation adds the following optional fields to new `continuity_fork` entries:

- `parentContinuityId`;
- `childContinuityId`;
- `forkedFromArtifactId`;
- `forkedFromPublicationId`.

The completed-replay validator now proves a unique parent-to-child continuity chain and checks the final/current edge against current campaign identity.

For the original recovery edge, once the current artifact is a deeper descendant, the validator requires the stored source artifact and publication only to be nonblank. For intermediate historical edges, it likewise requires source mutation, artifact, publication, and accepted tick to be well formed and monotonically ordered, but those historical values are not cross-checked against an independent durable counterpart.

Consequently, static inspection indicates that replay at a deep descendant can preserve a valid parent/child continuity path while changing historical metadata such as:

- recovery-edge source artifact or publication;
- intermediate-edge source mutation;
- intermediate-edge source artifact or publication;
- intermediate-edge accepted tick to another monotonic integer.

The focused tests prove wrong artifact/publication on the immediate recovery snapshot and prove current-edge identity conflicts on a deep descendant. They do not visibly mutate these fields on the recovery edge or an intermediate historical edge after the lineage has advanced to a deeper descendant.

The earlier decision and acceptance report stated that wrong source, tick, artifact, and publication evidence fail closed throughout the path. The current implementation visibly proves that broader claim only for the recovery edge's mutation/tick/continuities and the current edge's duplicated campaign-identity facts.

## Contract Question

The repository must explicitly decide what the historical fork fields mean after an edge is no longer current.

Possible bounded conclusions include:

1. the parent/child continuity graph is the authoritative ancestry proof, current campaign identity authenticates only the final edge, and historical mutation/tick/artifact/publication fields are retained descriptive evidence subject to structural checks rather than independently authenticated facts;
2. every historical field remains acceptance-critical and additional durable cross-verification or chained integrity evidence is required;
3. a smaller mixed contract is correct, with exact identification of which fields remain authoritative on historical edges and which are informational.

The decision must not claim corruption detection that the persisted format cannot prove. It must also not add a generic lineage, event, replay, or transaction framework without an explicit dependency and migration decision.

## Current Disposition

- Parent `0.6.9`: `ACCEPTANCE_REOPENED_PENDING_FOCUSED_DECISION`.
- `0.6.9.8`: historical audit evidence; result `REPAIR_REQUIRED` remains useful.
- `0.6.9.9` / commit `cbad987028d81c5ecdc35403333ec920d0ea5e53`: `IMPLEMENTED_PENDING_AUTHORITY_RECONCILIATION_AND_REAUDIT`.
- Claimed `0.6.9.10` acceptance: superseded pending a properly installed decision and successor route.
- Ashen Reef survey receipt-foundation decision: `BLOCKED_PENDING_0.6.9_RECONCILIATION`.
- Survey behavior: unimplemented.
- `0.7.0`: `NOT_READY`.

No production revert is authorized by this review. Existing snapshots and source remain in place until the focused decision selects a bounded successor.

## Required Next Route

Install and run:

`Historical Recovery Fork Evidence Verifiability And Parent Acceptance Reopening Decision`

The route must be documentation-only. It must:

- independently verify the prompt-transition history;
- inspect every durable source that could corroborate historical fork fields;
- execute focused probes where needed to distinguish actual runtime behavior from static inference;
- decide the exact historical-edge authority contract;
- classify the existing implementation under that contract;
- return either a bounded repair prompt, a properly installed independent re-audit prompt, or `NO_PACKAGE` with the smallest exact user decision;
- update all live planning and acceptance surfaces after the decision.

## Branch And Hosted Validation Posture

No branch or pull-request mutation is authorized. PR #2 and PR #3 remain evidence-only under their existing dispositions until a dedicated lifecycle trigger.

GitHub exposed no combined statuses and no pull-request-triggered workflow runs for source head `26c70f2114bf99714d2711eaf5a7653a57bf09cb` during this inspection.
