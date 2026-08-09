# Branch Disposition Register

Date: 2026-08-09

Status: current coordination surface; live refs must be reinspected before merge, deletion, or status change

Controlling policy: `docs/dev/branch-lifecycle-and-integration-policy.md`

## 2026-08-09 Version 0.6.10 Implementation Refresh

The implementation run fetched/pruned and began from clean synchronized `master == origin/master` at `85ad4ea9371b81f2e72d54449b6ce31c908118db`. Fresh orientation found one local branch, 36 non-default remote branches, and exactly two open pull requests. Counts below are the immutable `master-only / branch-only` snapshot at that implementation starting head, not post-run live counts.

Legacy/evidence/protected summary:

- `feat/main-menu-assets`: `792 / 0`, head/merge base `b42d36f3241f99874606ad1e24c09849715affe5`;
- `main-menu-asset-contract-pass`: `720 / 10`, merge base `9a107a7eed54b6d0cd2f161c236fbe163282bba7`;
- `main-menu-refinement-pass`: `727 / 2`, merge base `d03846e89d1a4fd07a1ea86d02951559f617df74`;
- `parallel/0.6.9.7-repair-bundle`: `79 / 7`, merge base `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- `parallel/prompt-packaging-integrity-audit`: `155 / 1`, merge base `3d77171ca2034c8b2fb8d19f374cef5df9605053`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `208 / 2`, merge base `895c02df40332c813a8403bd489af6184111ccba`.

All 28 indexed Connector evidence branches were refreshed by exact head, merge base, divergence, unique commits, changed paths, authority, and semantic trigger:

- the eight `8214327...` branches are `31 / 1`;
- the ten `8a0065b...` branches are `36 / 1`;
- the seven `bcbe658...` branches are `126 / 2`;
- the three `3006c96...` branches are `128 / 2`.

The additional one-document candidates remain `parallel/connector-prep-freshness-audit` at `128 / 1` and `parallel/launcher-asset-pr-disposition` at `126 / 1`.

The four prompt-mandated survey evidence refs were inspected read-only at their exact unchanged heads and reverified against the synchronized checkout:

- `parallel/activity-advancement-audit` at `b4cbaea5f4292904bba62f60a0108bb84f2bd405`;
- `parallel/player-progression-reward-mutation-audit` at `387f2491d0d671ee7834656c28183e72a798f1ca`;
- `parallel/chronicle-notification-provenance-audit` at `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`;
- `parallel/knowledge-discovery-visibility-audit` at `46434f31f8b06d49aad9a516543fbe36d188d519`.

They remain `CANDIDATE_INTEGRATION` for broader named consumers. The integrated-gameplay readiness ref at `59c103c3a06d55f35bffa735fd4b7814dffb583e` and prompt-packaging ref remain `PROTECTED_REFERENCE`; neither was modified or used as direct implementation authority.

PR #2 remained open non-draft at head `e78dc645cfb658685be12f45f46d34b7c0da1119`; PR #3 remained open draft at head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. Both were dynamically mechanically mergeable at inspection time but remain `SUPERSEDED_PRESERVE_EVIDENCE`. Mechanical status does not override semantic disposition.

No disposition changed. No merge, cherry-pick, rebase, force update, PR mutation, closure, or branch deletion occurred. Every retained branch keeps its existing review/retirement trigger. The next required review is the active `0.6.10.1` audit orientation or any earlier explicit lifecycle action.

## 2026-08-08 Ashen Reef Survey Receipt Decision Refresh

The unversioned survey receipt decision fetched/pruned and synchronized clean local `master` at inspected base and implementation starting head `25ede537bcfe78ee28c93ffb9ee7b9f71b2bfac9`. Fresh inventory found one local branch, 36 non-default remote branches, and exactly two open pull requests. Counts below are `master-only / branch-only` at that inspected source head.

Legacy/evidence/protected summary:

- `feat/main-menu-assets`: `788 / 0`, head/merge base `b42d36f3241f99874606ad1e24c09849715affe5`;
- `main-menu-asset-contract-pass`: `716 / 10`, merge base `9a107a7eed54b6d0cd2f161c236fbe163282bba7`;
- `main-menu-refinement-pass`: `723 / 2`, merge base `d03846e89d1a4fd07a1ea86d02951559f617df74`;
- `parallel/0.6.9.7-repair-bundle`: `75 / 7`, merge base `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- `parallel/prompt-packaging-integrity-audit`: `151 / 1`, merge base `3d77171ca2034c8b2fb8d19f374cef5df9605053`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `204 / 2`, merge base `895c02df40332c813a8403bd489af6184111ccba`.

The 28 indexed Connector evidence branches were rechecked by exact head, merge base, divergence, unique commits, changed paths, and semantic trigger:

- the eight `8214327...` branches are `27 / 1`;
- the ten `8a0065b...` branches are `32 / 1`;
- the seven `bcbe658...` branches are `122 / 2`;
- the three `3006c96...` branches are `124 / 2`.

The two additional one-document candidates remain `parallel/connector-prep-freshness-audit` at `124 / 1` and `parallel/launcher-asset-pr-disposition` at `122 / 1`.

The four prompt-mandated evidence refs were read exactly and reverified against current source:

- `parallel/activity-advancement-audit` at `b4cbaea5f4292904bba62f60a0108bb84f2bd405`;
- `parallel/player-progression-reward-mutation-audit` at `387f2491d0d671ee7834656c28183e72a798f1ca`;
- `parallel/chronicle-notification-provenance-audit` at `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`;
- `parallel/knowledge-discovery-visibility-audit` at `46434f31f8b06d49aad9a516543fbe36d188d519`.

Their survey-applicable claims were re-authored into the permanent decision, but each artifact has broader named consumers. They therefore remain `CANDIDATE_INTEGRATION` rather than being retired inside this run. The protected readiness branch remains `PROTECTED_REFERENCE`; its survey architecture was used read-only and its old route facts were treated as historical.

GitHub reported PR #2 open, non-draft, unmerged, mechanically non-mergeable at `e78dc645cfb658685be12f45f46d34b7c0da1119`, and PR #3 open draft, unmerged, mechanically non-mergeable at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. Both remain `SUPERSEDED_PRESERVE_EVIDENCE`.

No disposition changed. No merge, cherry-pick, rebase, force update, PR mutation, closure, or branch deletion occurred. Every retained branch keeps the exact review/retirement trigger in its register row. Active `Version 0.6.10` must reinspect the four evidence refs read-only; it must not merge them as implementation.

## 2026-08-08 Version 0.6.9.11 Acceptance Refresh

The independent audit fetched/pruned and synchronized clean local `master` at starting head `3f87c8c51de506839c9408d4df07ccd97d6be278`. Fresh inventory found one local branch, 36 non-default remote branches, and exactly two open pull requests. Counts below are `master-only / branch-only` at that starting head.

- `feat/main-menu-assets`: `782 / 0`;
- `main-menu-asset-contract-pass`: `710 / 10`;
- `main-menu-refinement-pass`: `717 / 2`;
- `parallel/0.6.9.7-repair-bundle`: `69 / 7`;
- `parallel/prompt-packaging-integrity-audit`: `145 / 1`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `198 / 2`.

All 28 indexed Connector evidence branches and the two additional one-document candidates were rechecked by merge base, divergence, unique commits, paths, and semantic trigger. They retain their existing `CANDIDATE_INTEGRATION` dispositions. The two protected references remain `PROTECTED_REFERENCE` and were not mutated.

PR #2 remained open, non-draft, unmerged, and mechanically non-mergeable at `e78dc645cfb658685be12f45f46d34b7c0da1119`; it remains `SUPERSEDED_PRESERVE_EVIDENCE`. PR #3 remained open draft, unmerged, and mechanically non-mergeable at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`; it remains `SUPERSEDED_PRESERVE_EVIDENCE`, and its expected archive SHA-256 remains `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`.

No branch/PR disposition changed, no integration or retirement trigger arrived, and no merge, cherry-pick, rebase, force update, close, or deletion occurred. The next review trigger for every retained branch remains the one recorded in its register row.

## 2026-08-08 Historical-Fork Authority Decision Refresh

The unversioned historical-fork authority decision fetched/pruned and synchronized clean local `master` at inspected base and starting head `260e800b584103393a25f6bc5c0599d9289b5356`. Fresh inventory found one local branch, 36 non-default remote branches, and two open pull requests. Counts below are `master-only / branch-only` at that starting head.

Legacy and protected refs:

- `feat/main-menu-assets`: `776 / 0`, head/merge base `b42d36f3241f99874606ad1e24c09849715affe5`, `MERGED_RETIRE` at its dedicated launcher hygiene trigger;
- `main-menu-asset-contract-pass`: `704 / 10`, merge base `9a107a7eed54b6d0cd2f161c236fbe163282bba7`, four launcher paths, `SUPERSEDED_PRESERVE_EVIDENCE` with PR #2;
- `main-menu-refinement-pass`: `711 / 2`, merge base `d03846e89d1a4fd07a1ea86d02951559f617df74`, two launcher paths, `MERGED_RETIRE` pending equivalence proof;
- `parallel/0.6.9.7-repair-bundle`: `63 / 7`, merge base `b6422118567a79a23be3377f035dd3a6905d4d8b`, seven bundle paths, `SUPERSEDED_PRESERVE_EVIDENCE` with PR #3;
- `parallel/prompt-packaging-integrity-audit`: `139 / 1`, merge base `3d77171ca2034c8b2fb8d19f374cef5df9605053`, one prompt-audit path, `PROTECTED_REFERENCE`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `192 / 2`, merge base `895c02df40332c813a8403bd489af6184111ccba`, two readiness paths, `PROTECTED_REFERENCE`.

The 28 indexed Connector evidence branches were refreshed from their live heads. Every branch changes only its named audit/source-map document, has no semantic overlap requiring integration into the historical-fork decision, and remains `CANDIDATE_INTEGRATION` for the trigger recorded in the three parallel results indexes:

- `15 / 1` from merge base `8214327906fbc2edf7ab4d02168cf94b3abc7e6f`: `activity-advancement-audit`, `character-panel-mutation-audit`, `civilization-tick-audit`, `combat-ai-scoring-test-coverage-refresh`, `game-tick-orchestration-audit`, `magic-runtime-readiness-refresh`, `quest-action-tree-audit`, and `world-spawn-admission-audit`;
- `20 / 1` from merge base `8a0065b7a72a6fc8193b502251e9020a1e4ca360`: `chronicle-notification-provenance-audit`, `content-lint-schema-validator-coverage-audit`, `economy-command-surface-refresh`, `item-use-profile-effect-ownership-audit`, `js-ts-mirror-export-integrity-audit`, `knowledge-discovery-visibility-audit`, `npc-party-companion-readiness-audit`, `player-progression-reward-mutation-audit`, `travel-route-service-availability-audit`, and `ui-accessibility-input-source-audit`;
- from merge base `bcbe658d1be033cdc83d04acdca67ec8186c484d`: `consumable-profile-coverage-audit` (`110 / 2`), `equipment-profile-readiness-audit` (`110 / 2`), `gameplay-shell-ui-state-audit` (`110 / 2`), `quest-turn-in-reward-source-audit` (`110 / 2`), `research-artifact-retention-inventory` (`110 / 2`), `rest-recovery-mutation-audit` (`110 / 2`), and `text-first-combat-view-model-audit` (`110 / 2`);
- from merge base `3006c968eb40b1d72f64fb2dc0263e227f869a7d`: `recipe-production-maturity-audit`, `regional-bestiary-ecology-maturity-audit`, and `regional-settlement-maturity-audit` (`112 / 2` each).

Two additional one-document candidate branches remain outside that 28-lane index: `parallel/connector-prep-freshness-audit` (`112 / 1`, merge base `3006c968...`) and `parallel/launcher-asset-pr-disposition` (`110 / 1`, merge base `bcbe658d...`). Their existing freshness and launcher triggers remain unchanged.

GitHub reported PR #2 open, non-draft, unmerged, currently mechanically mergeable at head `e78dc645cfb658685be12f45f46d34b7c0da1119`; it remains `SUPERSEDED_PRESERVE_EVIDENCE`. PR #3 is open draft, unmerged, currently mechanically mergeable at head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`; its body correctly identifies `SUPERSEDED_PRESERVE_EVIDENCE` and the expected archive SHA-256 remains `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`.

`docs/dev/connector-token-reset-waiting-period-prestage-2026-08-06.md` was verified, consumed for the decision's orientation and matrix, and remains historically useful rather than an unfinished controlling package. No branch/PR disposition changed, no integration or retirement trigger arrived, and no merge, cherry-pick, rebase, force update, close, or deletion occurred.

## 2026-08-02 Lineage Repair And Parent Acceptance Refresh

The lineage repair and committed-head acceptance run fetched/pruned from hosted head `5fe11910e6b4951483994ee23529150a697f78cc`, inspected one local branch, eighteen non-default remote branches, and open PRs #2 and #3. Fresh starting-head counts were:

- `feat/main-menu-assets`: `737 / 0`;
- `main-menu-asset-contract-pass`: `665 / 10`;
- `main-menu-refinement-pass`: `672 / 2`;
- `parallel/0.6.9.7-repair-bundle`: `24 / 7`;
- eight `bcbe658d` one-document branches: `71 / 1` each;
- four `3006c968` one-document branches: `73 / 1` each;
- `parallel/prompt-packaging-integrity-audit`: `100 / 1`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `153 / 2`.

PR #2 remained open, non-draft, non-mergeable at `e78dc645cfb658685be12f45f46d34b7c0da1119`. PR #3 remained open draft, non-mergeable at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`; its expected archive SHA-256 remained `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`.

Disposition result:

- PR #3 and `parallel/0.6.9.7-repair-bundle` move from `HOLD_NAMED_CONSUMER` to `SUPERSEDED_PRESERVE_EVIDENCE`; their save-repair consumer window is complete, but a dedicated exact-ref hygiene pass must prove safe closure/deletion;
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE` for the launcher trigger;
- twelve one-document branches retain their named `CANDIDATE_INTEGRATION` triggers;
- both protected references remain read-only;
- no merge, cherry-pick, rebase, force update, PR mutation, closure, or deletion occurred.

## 2026-08-02 Version 0.6.9.7 Implementation Refresh

The `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair` run fetched/pruned and inspected live refs from clean synchronized starting head `814d4dfa725627c8a0660c08a7146fdbf69bb2ac`. It completed and pushed implementation commit:

`ba35dacd852304cd0804b131c8d3045c1f74b755` - `fix(save): harden defeat recovery authority`

Starting-head counts were `master-only / branch-only`:

- `feat/main-menu-assets`: `732 / 0`;
- `main-menu-asset-contract-pass`: `660 / 10`, merge base `9a107a7eed54b6d0cd2f161c236fbe163282bba7`;
- `main-menu-refinement-pass`: `667 / 2`, merge base `d03846e89d1a4fd07a1ea86d02951559f617df74`;
- `parallel/0.6.9.7-repair-bundle`: `19 / 7`, merge base `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- eight `bcbe658d` one-document branches: `66 / 1` each;
- four `3006c968` one-document branches: `68 / 1` each;
- `parallel/prompt-packaging-integrity-audit`: `95 / 1`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `148 / 2`.

PR #2 remained open, non-draft, non-mergeable at `e78dc645cfb658685be12f45f46d34b7c0da1119`. PR #3 remained open draft, non-mergeable at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. The PR #3 archive was re-read as evidence only; its expected ZIP SHA-256 remained `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`, and its candidates were confirmed incomplete for the revised nine-finding contract.

Disposition result:

- PR #3 and `parallel/0.6.9.7-repair-bundle` remain `HOLD_NAMED_CONSUMER` for active independent `0.6.9.8`; implementation did not merge or copy the candidate replacements;
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE` for its dedicated launcher trigger;
- twelve one-document branches retain their named `CANDIDATE_INTEGRATION` triggers;
- prompt-packaging and integrated-gameplay readiness branches remain `PROTECTED_REFERENCE` and read-only;
- no merge, rebase, deletion, force update, PR mutation, or other lifecycle action was due.

PR #3 retirement review is next due after `0.6.9.8` concludes and proves whether every remaining useful artifact is reachable or equivalently recorded on `master`.

## 2026-08-02 Roadmap/Pipeline/Backlog/Active-Prompt Audit Refresh

The unversioned `Repository Roadmap, Pipeline, Backlog, And Active-Prompt Reconciliation Audit` fetched and pruned from clean synchronized `master` at:

`f62a59804f88527a297966a3b7c9ad5f4f9425f1` - `docs(save): decide defeat recovery continuity provenance`

Post-fetch local `master` and `origin/master` remained identical. Fresh inventory found one local branch, eighteen non-default remote branches, and two open pull requests. Counts below are `master-only / branch-only`:

- `feat/main-menu-assets`: `729 / 0`;
- `main-menu-asset-contract-pass`: `657 / 10`, merge base `9a107a7eed54b6d0cd2f161c236fbe163282bba7`;
- `main-menu-refinement-pass`: `664 / 2`, merge base `d03846e89d1a4fd07a1ea86d02951559f617df74`;
- `parallel/0.6.9.7-repair-bundle`: `16 / 7`, merge base `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- eight `bcbe658d` one-document branches: `63 / 1` each;
- four `3006c968` one-document branches: `65 / 1` each;
- `parallel/prompt-packaging-integrity-audit`: `92 / 1`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `145 / 2`.

The GitHub connector reports PR #2 open, non-draft, non-mergeable at head `e78dc645cfb658685be12f45f46d34b7c0da1119`, and PR #3 open draft, non-mergeable at head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. Mechanical mergeability remains non-authoritative for disposition.

Disposition result is unchanged:

- PR #3 and its repair-bundle branch remain `HOLD_NAMED_CONSUMER` evidence for revised `0.6.9.7` and conditional `0.6.9.8`;
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE` for a dedicated launcher trigger;
- twelve single-document audit branches remain `CANDIDATE_INTEGRATION` at their named triggers;
- the prompt-packaging and integrated-gameplay readiness branches remain `PROTECTED_REFERENCE` and read-only;
- merged/superseded launcher branches retain their recorded retirement gates;
- no merge, rebase, deletion, force update, PR mutation, or lifecycle action was due.

## 0. Focused Decision And Revised 0.6.9.7 Live Refresh

The unversioned `Normal Defeat Recovery Continuity And Destination Provenance Contract Decision` fetched/pruned and inspected live refs from synchronized decision starting head:

`a54ed83688c7a08d292c2b75ec7af3abac75ed52` - `docs(save): route defeat provenance blockers`

Live inventory at that pre-decision-commit snapshot:

- one local branch: synchronized `master`;
- eighteen non-default remote branches;
- two open pull requests;
- PR #2: open, non-draft, mechanically mergeable, head `e78dc645cfb658685be12f45f46d34b7c0da1119`, four changed paths, ten commits;
- PR #3: open draft, mechanically mergeable, head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`, seven evidence-only paths, seven commits;
- `feat/main-menu-assets`: `728 / 0`;
- `main-menu-asset-contract-pass`: `656 / 10`, merge base `9a107a7eed54b6d0cd2f161c236fbe163282bba7`;
- `main-menu-refinement-pass`: `663 / 2`, merge base `d03846e89d1a4fd07a1ea86d02951559f617df74`;
- `parallel/0.6.9.7-repair-bundle`: `15 / 7`, merge base `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- eight `bcbe658d` one-document branches: `62 / 1` each;
- four `3006c968` one-document branches: `64 / 1` each;
- `parallel/prompt-packaging-integrity-audit`: `91 / 1`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `144 / 2`.

Counts are `master-only / branch-only`. Mechanical mergeability does not change semantic disposition.

The focused decision reports `DECISION_ACCEPTED_REPAIR_REAUTHORIZED` and installs revised `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`. PR #3 remains useful incomplete evidence for that implementation and its independent successor audit; its installed hash identity is unchanged.

Disposition result:

- PR #3 and `parallel/0.6.9.7-repair-bundle` remain `HOLD_NAMED_CONSUMER` through revised `0.6.9.7` and `0.6.9.8`;
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE` for the launcher trigger;
- twelve one-document audit branches remain `CANDIDATE_INTEGRATION` at their named triggers;
- both protected references remain read-only;
- no integration, deletion, rebase, force update, or PR closure was due.

Live refs must be refreshed before implementation or any lifecycle action.

## 0A. Version 0.6.9.7 Contract-Stop Historical Refresh

The stopped `Version 0.6.9.7` repository run fetched/pruned, fast-forwarded clean local `master`, and inspected live refs from synchronized implementation starting head:

`6820ab8175f6b4d0b447b589045bc0a934663257` — `docs(handoff): record hardened 0.6.9.7 scope`

Live inventory at that pre-coordination snapshot:

- one local branch: synchronized `master`;
- eighteen non-default remote branches;
- two open pull requests;
- PR #2: open, non-draft, head `e78dc645cfb658685be12f45f46d34b7c0da1119`, four changed paths, ten commits;
- PR #3: open draft, head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`, seven evidence-only paths, seven commits;
- `feat/main-menu-assets`: `727 / 0`;
- `main-menu-asset-contract-pass`: `655 / 10`, merge base `9a107a7eed54b6d0cd2f161c236fbe163282bba7`;
- `main-menu-refinement-pass`: `662 / 2`, merge base `d03846e89d1a4fd07a1ea86d02951559f617df74`;
- `parallel/0.6.9.7-repair-bundle`: `14 / 7`, merge base `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- eight `bcbe658d` one-document branches: `61 / 1` each;
- four `3006c968` one-document branches: `63 / 1` each;
- `parallel/prompt-packaging-integrity-audit`: `90 / 1`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `143 / 2`.

Counts are `master-only / branch-only`. The GitHub connector reported both open PRs mechanically mergeable at inspection time; that dynamic fact does not change their semantic dispositions.

PR #3's README was read before reconstruction. The reconstructed ZIP and all member hashes matched `MANIFEST.sha256`. Candidate source, probes, and report were inspected as evidence only. The bundle did not resolve the non-head receipt-continuity or sole-known destination-provenance contract blockers.

Disposition result:

- PR #3 and `parallel/0.6.9.7-repair-bundle` remain `HOLD_NAMED_CONSUMER` for the active focused decision, revised `0.6.9.7`, and its independent successor audit;
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE` for the launcher trigger;
- twelve one-document audit branches remain `CANDIDATE_INTEGRATION` at their named triggers;
- both protected references remain read-only;
- no integration, deletion, rebase, force update, or PR closure was due.

The active route is now the unversioned `Normal Defeat Recovery Continuity And Destination Provenance Contract Decision`. Live refs must be refreshed again before any branch or PR action.

## 0B. Repository Coordination Refresh After PR #3

A connector-side repository review and coordination repair inspected live `master` immediately before this register write at:

`bd9222ae189f13ec1b769b5fb0ddae686c86af4f` — `docs(handoff): refresh repository evidence posture`

Live inventory at that snapshot:

- total branches: nineteen;
- default branch: `master`;
- non-default remote branches: eighteen;
- open pull requests: two;
- PR #2: open, non-draft, non-mergeable, head `e78dc645cfb658685be12f45f46d34b7c0da1119`;
- PR #3: open, draft, non-mergeable after current `master` advanced, head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
- `feat/main-menu-assets`: `715 / 0`;
- `main-menu-asset-contract-pass`: `643 / 10`, four changed paths;
- `main-menu-refinement-pass`: `650 / 2`, two changed paths;
- the eight `bcbe658d` one-document branches: `49 / 1` each;
- the four `3006c968` one-document branches: `51 / 1` each;
- `parallel/prompt-packaging-integrity-audit`: `78 / 1`;
- `prep/integrated-gameplay-0-7-readiness-audit`: `131 / 2`;
- `parallel/0.6.9.7-repair-bundle`: `9 / 7`, merge base `b6422118567a79a23be3377f035dd3a6905d4d8b`, seven evidence-only files under `docs/dev/repair-bundles/version-0.6.9.7/`.

Counts are `master-only / branch-only` at the inspected pre-write snapshot. This register commit itself advances `master`, so all future action must resolve live counts again rather than treating this snapshot as merge or deletion authority.

Disposition result:

- PR #3 and `parallel/0.6.9.7-repair-bundle` are `HOLD_NAMED_CONSUMER` for `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair` and its independent successor audit;
- the bundle branch is intentionally allowed to diverge and must not be merged, cherry-picked, rebased, force-updated, or closed as implementation;
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE`;
- the twelve one-document audit branches remain `CANDIDATE_INTEGRATION` at their named triggers;
- both protected references remain read-only;
- no integration, branch deletion, rebase, force update, or PR closure was due during this coordination repair.

## 0C. Version 0.6.9.6 Historical Live Refresh

`Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit` fetched and pruned all refs from synchronized audit starting head `e6da77c8495d8b5cbffc966cdc3db5753b7cc89a`.

Historical result at that audit:

- local branches: only synchronized `master`;
- non-default remote branches: seventeen;
- open pull requests: PR #2 only, head `e78dc645cfb658685be12f45f46d34b7c0da1119`, base `master`, open, non-draft, non-mergeable, and unrelated to the repair;
- `feat/main-menu-assets`: `710 / 0`;
- `main-menu-asset-contract-pass`: `638 / 10`, four changed paths;
- `main-menu-refinement-pass`: `645 / 2`, two changed paths;
- the eight `bcbe658d` connector branches: `44 / 1` each, one previously registered documentation path each;
- the four `3006c968` connector branches: `46 / 1` each, one previously registered documentation path each;
- `parallel/prompt-packaging-integrity-audit`: `73 / 1`, one prompt-packaging document;
- `prep/integrated-gameplay-0-7-readiness-audit`: `126 / 2`, the two protected readiness documents.

The merge bases, unique heads, and paths remain those recorded in the tables below. That audit found no branch overlapping the initial-defeat destination, restart-duplicate, or original-effect-provenance findings. No disposition changed, no integration or deletion was due, and both protected branches remained read-only.

## 1. Complete Inventory Snapshot

Codex ran `git fetch --all --prune`, complete local/remote ref enumeration, merge-base and unique-path comparison, protected-reference inspection, and open-PR inspection during `Version 0.6.9.2 - Normal Campaign Publication Recovery Repair`.

Inspected base head at the start of that run:

`b0057151c01d51d258d0695993489ef2e2d9dc32` — `docs(vision): restore continuity brief after scope correction`

This is a historical inventory base, not a claim about the repository's current live `master`. Every later run must resolve the current head directly after fetch/prune.

Inventory result at that snapshot:

- one local branch: `master`, tracking synchronized `origin/master`;
- seventeen non-default remote branches;
- one open pull request: PR #2, `main-menu-asset-contract-pass`;
- no branch with save, persistence, campaign identity, new-campaign retry, occurrence receipt, or publication implementation relevant to the active parent repair;
- no integration, PR closure, or deletion due inside the completed `0.6.9.2` run.

Ahead/behind counts below are `inspected-base-only / branch-only commits` as observed at that snapshot. They are evidence of the review performed, not live action authority, and must be refreshed before any merge, deletion, closure, or disposition change.

## 2. Protected References

| Branch | Reviewed posture | Unique work | Disposition | Named consumer / next review | Retirement rule |
| --- | --- | --- | --- | --- | --- |
| `prep/integrated-gameplay-0-7-readiness-audit` | Diverged at `895c02d`; two unique documentation commits; `103 / 2` at the inspected snapshot | integrated-gameplay `0.7` readiness audit and queued audit prompt | `PROTECTED_REFERENCE` | future `0.7.0` readiness gates may inspect it read-only after the representative loop exists | never merge, rebase, force-update, or delete without a later accepted prompt or explicit user instruction |
| `parallel/prompt-packaging-integrity-audit` | Diverged at `3d77171`; one unique documentation commit; `50 / 1` at the inspected snapshot | prompt-packaging integrity audit prompt | `PROTECTED_REFERENCE` | future prompt-packaging or workflow-integrity review | preserve untouched until a dedicated disposition pass proves promotion, supersession, or explicit abandonment |

## 3. Connector Audit Branches Awaiting Integration Review

The first eight branches below were created from:

`bcbe658d1be033cdc83d04acdca67ec8186c484d`

At the inspected snapshot each was `21 / 1` against the inspected base head, contained one unique documentation commit, and changed exactly one unique new document.

| Branch | Head commit | Unique path | Current disposition | Recommended integration trigger | Post-integration action |
| --- | --- | --- | --- | --- | --- |
| `parallel/gameplay-shell-ui-state-audit` | `25c4a08a39d905903c9ebb940a3e54101864f50e` | `docs/design/gameplay-shell-and-ui-state-ownership-source-audit.md` | `CANDIDATE_INTEGRATION` | before the next Home/shell, pin/search, navigation-history, or broad UI-state contract | cherry-pick or re-author accepted document; verify on `master`; delete local and remote branch |
| `parallel/quest-turn-in-reward-source-audit` | `ff1d3b26057919d95aace2a4848b854b7bdd40dc` | `docs/design/quest-turn-in-reward-delivery-and-idempotency-source-audit.md` | `CANDIDATE_INTEGRATION` | before quest completion/reward receipt, payout, or turn-in implementation planning | integrate accepted audit before implementation prompt; delete branch after reachability/equivalence proof |
| `parallel/equipment-profile-readiness-audit` | `343095adb5b59c28260ad3b17d82005963a374e9` | `docs/design/weapon-and-armor-profile-current-state-readiness-audit.md` | `CANDIDATE_INTEGRATION` | before weapon/armor profile seed evidence or content work | integrate if still current; delete branch after verification |
| `parallel/text-first-combat-view-model-audit` | `4f5d7162431ca0de75ee178f933e1339e1413887` | `docs/design/text-first-combat-presentation-view-model-readiness-audit.md` | `CANDIDATE_INTEGRATION` | before combat UI, tactics editor, combat log, or presentation adapter work | reconcile with the combat-AI/gambit audit and IA boundary; integrate accepted document; delete branch |
| `parallel/research-artifact-retention-inventory` | `411740cd9b9e8cc48626fd7ea57a65c60765dc41` | `docs/dev/temporary-research-artifact-retention-inventory.md` | `CANDIDATE_INTEGRATION` | next research-retention cleanup or before deleting any surviving `tmp-*` artifact | refresh complete filesystem inventory, integrate current register, then delete branch |
| `parallel/launcher-asset-pr-disposition` | `72726210fc5c4c30d55c5fc27bc09117d1e4bff9` | `docs/design/launcher-sidebar-asset-pr-disposition-audit.md` | `CANDIDATE_INTEGRATION` | before resolving PR #2 or doing launcher asset work | integrate audit or preserve equivalent disposition; then resolve PR #2 and delete branch |
| `parallel/consumable-profile-coverage-audit` | `453697a663c7a135b6a0fb3fc9cd44cf48796cbd` | `docs/design/consumable-profile-coverage-and-effect-ownership-audit.md` | `CANDIDATE_INTEGRATION` | before consumable-profile cleanup, quantity/serving authority, or food-state work | integrate accepted audit before content edits; delete branch after verification |
| `parallel/rest-recovery-mutation-audit` | `1e6d049d88c9a9f7c1db5551cb7d0d3df19342fd` | `docs/design/rest-and-recovery-ui-mutation-source-audit.md` | `CANDIDATE_INTEGRATION` | before rest, lodging, recovery, care, or full-resource-reset implementation | integrate accepted audit before contract/implementation; delete branch |

Four additional one-document candidate branches were discovered. Each was created from `3006c968eb40b1d72f64fb2dc0263e227f869a7d` and was `23 / 1` against the inspected base head at the snapshot.

| Branch | Head commit | Unique path | Current disposition | Recommended integration trigger | Post-integration action |
| --- | --- | --- | --- | --- | --- |
| `parallel/connector-prep-freshness-audit` | `cadcc2a2280cb4a01f4d69c52bcbd607b3bb4c96` | `docs/dev/connector-prep-freshness-and-supersession-audit.md` | `CANDIDATE_INTEGRATION` | next connector-preparation freshness or supersession maintenance pass | reconcile against current workflow policies; integrate or supersede; delete only after equivalent preservation |
| `parallel/recipe-production-maturity-audit` | `544519ce006e2b20814fac3e223b28c871b5cd46` | `docs/design/recipe-and-production-coverage-maturity-audit.md` | `CANDIDATE_INTEGRATION` | before reopening recipe, crafting execution, or production maturity work | reconcile with accepted `0.6.5`/`0.6.7`; integrate current findings; delete after proof |
| `parallel/regional-bestiary-ecology-maturity-audit` | `e64574a9f887047f6eda1d9bcc9c11eec885d397` | `docs/design/regional-bestiary-and-ecology-coverage-maturity-audit.md` | `CANDIDATE_INTEGRATION` | before regional bestiary, ecology, spawning, or loot expansion | reconcile with accepted `0.6.6`/`0.6.7`; integrate only current static findings; delete after proof |
| `parallel/regional-settlement-maturity-audit` | `eaedaeef10645b7952e3606eeb3e7708b45f5d3c` | `docs/design/regional-and-continental-settlement-maturity-evidence-audit.md` | `CANDIDATE_INTEGRATION` | before regional/continental settlement expansion or world-coverage reopening | reconcile with accepted `0.6.4`/`0.6.7`; integrate only current findings; delete after proof |

These branches are not implementation authority merely because they are low-conflict. A dedicated documentation integration pass may batch them only after complete semantic review against current authority.

## 4. Pull Requests And Legacy Branches

| PR / branch | Live finding at inspected snapshot | Disposition | Required action |
| --- | --- | --- | --- |
| PR #3 — `parallel/0.6.9.7-repair-bundle` | open draft; head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`; source base and merge base `b6422118567a79a23be3377f035dd3a6905d4d8b`; seven unique evidence files; latest refresh `69 / 7`; reconstructed ZIP SHA-256 `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe` | `SUPERSEDED_PRESERVE_EVIDENCE` | preserve until a dedicated exact-ref hygiene pass proves safe closure/deletion; do not merge, cherry-pick, rebase, force-update, or close inside the active survey decision |
| PR #2 — `main-menu-asset-contract-pass` | open; head `e78dc64`; ten unique commits; merge base `9a107a7`; launcher-only; proposed contract says no baked readable labels while both Bloodlines SVGs embed readable `Bloodlines` text | `SUPERSEDED_PRESERVE_EVIDENCE` | inspect at the launcher-asset trigger, preserve useful evidence through current-head re-authoring, then close/delete only after proof |
| PR #1 — `main-menu-refinement-pass` | merged and closed historically; remote branch head `986d635`; merge base `d03846e`; two commits are not directly reachable and require equivalent-patch review | `MERGED_RETIRE` pending equivalence proof | verify accepted changes are equivalently present on `master`; delete and prune only after the two-commit diff and linked PR state prove no unique value remains |
| `feat/main-menu-assets` | remote head `b42d36f`; merge base is its head; fully reachable from the inspected base; no open PR found | `MERGED_RETIRE` | retire during the next dedicated branch-hygiene or launcher integration pass after exact-ref recheck; no deletion inside the active save repair |

## 5. Current Active Route Interaction

Active route:

`Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Branch handling during the bounded survey implementation requires:

- required read-only inspection of protected references;
- complete branch/PR inventory and disposition refresh;
- preserving PR #3 and `parallel/0.6.9.7-repair-bundle` as superseded evidence pending dedicated hygiene;
- inspecting the protected integrated-gameplay readiness branch read-only;
- otherwise preserving candidate branches for their named triggers.

The permanent survey receipt decision is authoritative on `master`. No one-document Connector audit branch is implementation authority. No candidate integration, branch deletion, or PR closure is due inside `0.6.10` unless fresh live evidence changes the controlling disposition and the prompt's exclusions are first reconciled.

The survey receipt decision returned `PACKAGE_READY`, and `Version 0.6.10 - Ashen Reef Survey Advancement Authority` is active. Parent `0.6.9` remains accepted through completed `0.6.9.11`; neither route creates a branch integration trigger.

## 6. Mandatory Next Codex Branch Report

The next Codex completion report must include:

- the live current `master` SHA resolved after fetch/prune;
- full local and remote branch inventory;
- open PR inventory;
- refreshed ahead/behind and merge-base facts for every branch in this register;
- any newly discovered branches;
- PR #3 live head, source/merge base, reconstructed bundle hash, candidate reconciliation, and retained disposition;
- disposition changes;
- exact merge, cherry-pick, rebase, closure, or deletion actions performed;
- validation for each integration;
- branches intentionally retained and their next review triggers.

If no integration or deletion is due inside the active run, Codex must say so explicitly and leave a decision-complete next integration trigger rather than silently carrying branches forward.
