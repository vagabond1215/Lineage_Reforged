# Version 0.6.9.1 - Normal Stakes Campaign Persistence Foundation Acceptance Audit

## Run Identity

`Version 0.6.9.1 - Normal Stakes Campaign Persistence Foundation Acceptance Audit`

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`test(save): audit Normal campaign persistence foundation`

## Purpose

Independently audit the complete landed `0.6.9` parent. Accept it only if the campaign-rules, save-authority, migration, first-mutation continuity, Normal defeat, legacy repair, account-publication, and retirement boundaries are coherent together and all prescribed checks pass.

This is an audit-first support run. Do not broaden into survey advancement, later Stakes modes, actual death/succession, checkpoint UI, cloud synchronization, or a generic command/transaction framework.

## Required Reading

Read:

- `AGENTS.md`;
- current output, prompt, handoff, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, static-content program, and branch register;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/design/ashen-reef-survey-minimum-save-identity-and-accepted-state-publication-decision.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`;
- every file changed by the parent;
- the protected readiness branch through read-only Git inspection only.

## Execution Gate

1. Verify branch, clean worktree, upstream, current head, parent commit, and active prompt.
2. Run `git fetch --all --prune`; inventory branches and open PRs; refresh dispositions only for proven live changes.
3. Confirm the parent diff is one coherent authorized package and contains no generated output, dependency change, content/catalog change, survey implementation, or later-Stakes behavior.
4. Reproduce the parent focused test and build evidence before deciding acceptance.
5. Stop and install the smallest `0.6.9.2` repair prompt if a material defect cannot be safely fixed within this audit.

## Required Audit

### A. Identity and rules

- Verify snapshot format `lineage.save_snapshot.v2`, envelope version 7, campaign-rules version 2, policy revision 1, and workflow `0.6.9` remain distinct.
- Verify live rules are Normal-only with canonical legacy difficulty mapping and typed provenance.
- Verify account/campaign/continuity/character/artifact/generation/publication identities use `crypto.randomUUID()` and fail closed without it.
- Verify the persisted authority-ledger container does not invent survey receipts or retroactive command records.

### B. Publication authority

- Inject candidate write/readback failure and campaign-control publication failure.
- Prove no failed candidate becomes the head or updates address/account projections.
- Prove successful publication retains immutable artifact authority and the immediately prior compatible head.
- Prove UI success is conditioned on verified publication.
- Prove saving an unchanged non-head artifact copies/binds the existing artifact identity without new generation/publication/head revision.
- Prove stale-head sessions fail closed.

### C. Version-6 migration and active repair

- Test each accepted legacy difficulty/Hardcore mapping.
- Prove original version-6 bytes remain retained and playable version-6 keys are removed only after verified target publication.
- Prove one stable pending migration receipt is reused after injected interruption.
- Prove one-source and unique exact `savedAt == account.lastPlayedAt` head certification.
- Prove ambiguous multi-artifact groups remain quarantined and untouched.
- Prove active HP-zero head and non-head sources receive exactly one `unknown_or_legacy` defeat repair before play.
- Prove repaired head advances only its certified campaign head and repaired non-head remains non-head.
- Prove blocked/deleted history cannot re-enter.

### D. Session admission and continuity

- Audit every persisted-snapshot writer.
- Prove rejected, no-change, duplicate, stale-revision, and wrong-artifact submissions preserve snapshot/control identity and do not mark dirty, fork, defeat-resolve, or evaluate account state.
- Prove engine results retain command/result correlation.
- Prove legacy bridge and persisted preference changes use explicit owner kinds.
- Prove the first accepted mutation from a non-head artifact creates exactly one child continuity before application and all later accepted mutations reuse it.
- Prove abandoning unsaved play leaves no durable child or account value.
- Prove a verified save makes the child durable.

### E. Normal defeat

- Test combat and noncombat HP-zero admissions.
- Verify exactly four playable recovery ticks, HP formula, Stamina formula, MP/body preservation, encounter/transient-combat clearing, destination chain, and recovery-pending behavior.
- Verify inventory, equipment, currency, quests, party, attributes, injury/trauma, and permanent truth are unchanged.
- Verify one typed retained receipt, one Chronicle projection, one notice, and duplicate idempotency.
- Verify ordinary defeat remains unsaved and cannot reach terminal archive, payout, estate, or save deletion.

### F. Account and retirement consumers

- Prove character achievement preparation happens before campaign publication.
- Prove account history/metrics/achievements, Legacy rewards, preparation consumption, inheritance consumption, `lastPlayedAt`, retirement settlement, and estate consume only verified publications.
- Prove consumer ids are publication id plus registered kind, retries are idempotent, and conflicting payloads fail closed.
- Inject post-publication account failure and prove gameplay authority remains published with a repairable pending receipt.
- Prove mandatory new-game preparation/inheritance receipts block entry and further use until repaired on restart/account selection.
- Prove retirement publishes and verifies terminal authority before settlement, removes playable addresses only after mandatory consumers, and retains hidden closed authority.

### G. Integration and mirrors

- Verify TypeScript/JavaScript owner mirrors and exports.
- Verify browser imports remain narrow enough that the UI production build does not pull server-only `node:fs` content modules.
- Verify existing travel, quest acceptance/tracking, activity selection, save roundtrip, combat, achievement, and lifecycle tests remain green.
- Run a bounded TypeScript audit only as classified by repository policy; do not turn the known broad diagnostic backlog into the acceptance gate.

## Prescribed Checks

Run:

```text
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs tests\unit\campaign-persistence-foundation.test.mjs
```

Run the RPG UI Vite production build with temporary output outside tracked paths, then remove that output.

Run `git diff --check` and inspect the complete parent/audit diff.

## Completion

If all obligations pass:

- add a focused acceptance document;
- mark `0.6.9` complete and accepted;
- update all live coordination surfaces;
- install the smallest unversioned post-parent route decision required before survey implementation;
- do not install a survey implementation prompt unless that decision proves all remaining occurrence/result/consequence prerequisites closed.

If any obligation fails:

- make only a tiny obvious parent-specific repair when complete intent is already fixed by accepted authority and validation fits this support run;
- otherwise stop, document the defect, and install exact `Version 0.6.9.2` repair work;
- do not claim parent acceptance.

Report starting/final commits, parent range, exact files changed, branch/PR lifecycle, all checks and counts, injected-failure evidence, acceptance criteria, risks, and the installed next prompt.
