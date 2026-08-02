# Normal Defeat Recovery Continuity And Destination Provenance Contract Decision

## Run Identity

`Normal Defeat Recovery Continuity And Destination Provenance Contract Decision`

Label class: unversioned focused decision

Milestone impact: `supports_current_band`

Suggested commit:

`docs(save): decide defeat recovery continuity provenance`

## Purpose

Decide the two shared-contract questions that correctly blocked `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair` on synchronized `master` at `6820ab8175f6b4d0b447b589045bc0a934663257`:

1. how a persisted `recovery_pending` receipt created on a loaded non-head source continuity relates to the child continuity required by the first accepted mutation;
2. which truthful `NormalDefeatReceiptState.destinationSource` value represents automatic bounded sole-known-settlement completion.

Produce a decision-complete focused authority and reinstall a revised `0.6.9.7` implementation prompt only when both questions are settled, including any required shared-contract and migration authorization. Do not implement the repair during this decision run and do not install `0.6.9.8`.

## Required Reading

Read the complete current versions of:

- `AGENTS.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`;
- `docs/dev/version-0.6.9.7-pre-implementation-source-review-2026-07-31.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- the complete current `NormalDefeatReceiptState`, campaign identity, continuity, authority-ledger, save snapshot, migration, load, repair, and publication contracts and callers;
- the focused persistence tests and the real `App.tsx` run-entry path.

Treat draft PR #3 and `parallel/0.6.9.7-repair-bundle` as evidence only. The bundle does not answer either blocker and remains `HOLD_NAMED_CONSUMER`.

## Confirmed Blocking Evidence

The stopped repository run independently reproduced all nine hardened `0.6.9.7` findings before editing. Two findings cannot be repaired truthfully under current accepted authority.

### Blocker 1 — Non-head continuity ownership

Current accepted rules jointly require:

- loading a non-head artifact does not fork;
- its first accepted persisted-snapshot mutation creates exactly one child continuity before the proposed mutation is applied;
- pending recovery provenance is validated against the loaded source snapshot before any continuity rewrite;
- the retained pending defeat receipt names the source continuity;
- completed durable replay must reconcile receipt, snapshot, control, original ledger, and correction authority exactly.

Current authority does not decide whether completion:

- preserves the receipt's source continuity and records completion/child authority elsewhere;
- rewrites the same receipt to the child continuity;
- splits original defeat truth from completion truth through a typed additional field or receipt;
- or uses another bounded representation.

The decision must preserve original defeat provenance, exactly one child continuity, exactly one completion, restart-safe duplicate replay, and rejection before child creation or repair effects.

### Blocker 2 — Sole-known destination provenance

Pending completion currently accepts this precedence:

1. explicit destination;
2. validated current settlement;
3. validated campaign-start settlement;
4. exactly one known safe settlement;
5. fail closed when none or multiple exist.

The current destination-source union contains only:

- `explicit_context`;
- `current_settlement`;
- `campaign_start`;
- `none`.

An automatic sole-known fallback is not explicit, current, campaign start, or absent. The decision must either add a truthful typed provenance value with exact compatibility rules or explicitly revise the accepted fallback contract. It must not mislabel automatic authority as explicit.

## Decision Requirements

### 1. Original defeat truth and completion truth

Decide exactly:

- which continuity id remains on the original receipt before and after completion;
- whether completion requires a new field, a separate typed receipt, a correction-ledger extension, or no contract addition;
- how the original and completion authorities remain linked;
- what `campaignIdentity.continuityId`, `parentContinuityId`, `firstDivergentMutationId`, and the continuity-fork ledger entry must contain;
- whether a completed receipt may legitimately name an ancestor continuity while residing in a child snapshot;
- what exact durable evidence identifies one completion after restart and after later accepted mutations;
- how reversed arrays and multiple historical recoveries remain order-independent;
- how legacy version-6 repair differs, since owner-certified migration correction does not create a child continuity.

### 2. Transaction ordering

Specify one exact head and non-head sequence covering:

1. control, artifact, revision, account, campaign, character, and loaded-continuity validation;
2. retained pending receipt/ledger/projection/resource/tick validation against the untouched source snapshot;
3. destination resolution and provenance classification;
4. child-continuity creation when required;
5. defeat-completion update and correction authority;
6. four recovery ticks and relocation;
7. Chronicle and notification projection update;
8. one session revision and retained in-memory result;
9. explicit later publication only.

Define the exact rollback boundary. Every rejection must leave the source snapshot and control byte-stable and must create neither a child continuity nor partial repair effects.

### 3. Destination provenance

Decide the exact `destinationSource` identity for sole-known fallback. If the shared union changes, specify:

- the exact new literal;
- whether the receipt change is additive or requires a snapshot-format revision;
- deserialization and validation behavior for existing target snapshots;
- version-6 migration and active HP-zero repair behavior;
- copied-artifact, restart, replay, and correction compatibility;
- public export and TypeScript/JavaScript mirror requirements;
- exact tests required before the revised repair can claim completion.

If the fallback is removed or narrowed instead, reconcile that change explicitly with the accepted `0.6.9.3` through `0.6.9.6` completion behavior and prove no blocking posture becomes permanently unrepairable.

### 4. Revised implementation authorization

Produce a numbered contract-to-code-to-test matrix for the revised `0.6.9.7` run. Authorize only the smallest coherent surface. If a shared contract, persistence validator, or migration owner must change, name the exact files and validation required. Do not authorize a generic replay, event, transaction, correction, migration, or workflow framework.

## Required Evidence Matrix

The decision must cover:

- at-head pending completion;
- non-head pending completion through the real run-entry caller;
- rejection before any non-head child creation;
- one accepted child and completion sequence;
- restart before completion;
- restart after completion;
- duplicate replay after later accepted mutation;
- multiple historical recoveries with explicit stable targeting;
- legacy HP-zero head and non-head migration repair;
- explicit, current, campaign-start, sole-known, none, and ambiguous destination cases;
- corrupted control, continuity, receipt, ledger, tick, resource, Chronicle, and notification evidence;
- copied artifacts and order-reversed receipts/ledger entries;
- publication remaining blocked while pending and explicit after completion.

## Authorized Surface

This is a documentation-only decision run. It may change only:

- one new focused design decision document;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md` when the decision changes its exact repair authorization;
- `docs/dev/current-codex-prompt.md` to reinstall the revised `0.6.9.7` implementation prompt after acceptance;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/branch-disposition-register.md` only when live branch/PR posture changes.

Do not change production source, shared types, persistence, save formats, migrations, tests, dependencies, content, assets, generated output, UI, or protected branches during the decision.

## Completion Decision

On a complete accepted decision:

- report `DECISION_ACCEPTED_REPAIR_REAUTHORIZED`;
- create the focused decision document;
- reinstall a revised `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair` prompt containing all nine findings plus the accepted continuity and destination-provenance contract;
- keep parent `0.6.9` unaccepted;
- keep `0.6.9.8` reserved for the later independent audit;
- keep the Ashen Reef survey route blocked.

If either question remains ambiguous:

- report `DECISION_INCOMPLETE`;
- do not authorize implementation;
- ask the smallest concrete user-direction question that repository evidence cannot decide;
- keep `0.6.9.7` blocked and do not install `0.6.9.8`.

## Completion Report

Report:

- exact decision and rejected alternatives;
- original-defeat versus completion-authority model;
- head and non-head transaction ordering;
- destination-source model;
- compatibility and migration posture;
- contract-to-code-to-test matrix;
- applicable `FP-001` through `FP-012` evidence;
- live branch and PR review;
- files changed and checks run;
- exact installed next route.
