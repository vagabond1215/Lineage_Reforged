# Branch Disposition Register

Date: 2026-07-30

Status: current coordination surface; live refs must be reinspected before merge, deletion, or status change

Controlling policy: `docs/dev/branch-lifecycle-and-integration-policy.md`

## 1. Complete Inventory Snapshot

Codex ran `git fetch --all --prune`, complete local/remote ref enumeration, merge-base and unique-path comparison, and open-PR inspection before `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`.

Current `master`:

`fb9a2f9c2868d5789991e6d03401e8d8d609e47f` — `docs(save): close Normal continuity activation dependencies`

Inventory result:

- one local branch: `master`, tracking synchronized `origin/master`;
- seventeen non-default remote branches;
- one open pull request: PR #2, `main-menu-asset-contract-pass`;
- no branch with save, persistence, campaign identity, occurrence receipt, or publication implementation relevant to the active route;
- no integration, PR closure, or deletion due inside the atomic persistence implementation.

Ahead/behind counts below are `branch behind master / branch ahead of master` (`master`-only / branch-only commits) as observed at this snapshot and must be refreshed before action.

## 2. Protected References

| Branch | Reviewed posture | Unique work | Disposition | Named consumer / next review | Retirement rule |
| --- | --- | --- | --- | --- | --- |
| `prep/integrated-gameplay-0-7-readiness-audit` | Diverged at `895c02d`; two unique documentation commits; `92 / 2` | integrated-gameplay `0.7` readiness audit and queued audit prompt | `PROTECTED_REFERENCE` | active and future `0.7.0` readiness gates may inspect it read-only | never merge, rebase, force-update, or delete without a later accepted prompt or explicit user instruction |
| `parallel/prompt-packaging-integrity-audit` | Diverged at `3d77171`; one unique documentation commit; `39 / 1` | prompt-packaging integrity audit prompt | `PROTECTED_REFERENCE` | future prompt-packaging or workflow-integrity review | preserve untouched until a dedicated disposition pass proves promotion, supersession, or explicit abandonment |

## 3. Connector Audit Branches Awaiting Integration Review

The first eight branches below were created from:

`bcbe658d1be033cdc83d04acdca67ec8186c484d`

Each is now `10 / 1` against current `master`, contains one unique documentation commit, and changes exactly one unique new document.

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

Four additional one-document candidate branches were discovered. Each was created from `3006c968eb40b1d72f64fb2dc0263e227f869a7d` and is `12 / 1` against current `master`.

| Branch | Head commit | Unique path | Current disposition | Recommended integration trigger | Post-integration action |
| --- | --- | --- | --- | --- | --- |
| `parallel/connector-prep-freshness-audit` | `cadcc2a2280cb4a01f4d69c52bcbd607b3bb4c96` | `docs/dev/connector-prep-freshness-and-supersession-audit.md` | `CANDIDATE_INTEGRATION` | next connector-preparation freshness or supersession maintenance pass | reconcile against current workflow policies; integrate or supersede; delete only after equivalent preservation |
| `parallel/recipe-production-maturity-audit` | `544519ce006e2b20814fac3e223b28c871b5cd46` | `docs/design/recipe-and-production-coverage-maturity-audit.md` | `CANDIDATE_INTEGRATION` | before reopening recipe, crafting execution, or production maturity work | reconcile with accepted `0.6.5`/`0.6.7`; integrate current findings; delete after proof |
| `parallel/regional-bestiary-ecology-maturity-audit` | `e64574a9f887047f6eda1d9bcc9c11eec885d397` | `docs/design/regional-bestiary-and-ecology-coverage-maturity-audit.md` | `CANDIDATE_INTEGRATION` | before regional bestiary, ecology, spawning, or loot expansion | reconcile with accepted `0.6.6`/`0.6.7`; integrate only current static findings; delete after proof |
| `parallel/regional-settlement-maturity-audit` | `eaedaeef10645b7952e3606eeb3e7708b45f5d3c` | `docs/design/regional-and-continental-settlement-maturity-evidence-audit.md` | `CANDIDATE_INTEGRATION` | before regional/continental settlement expansion or world-coverage reopening | reconcile with accepted `0.6.4`/`0.6.7`; integrate only current findings; delete after proof |

These branches are not implementation authority merely because they are low-conflict. A dedicated documentation integration pass may batch them only after complete semantic review against current authority.

## 4. Pull Requests And Legacy Branches

| PR / branch | Live finding | Disposition | Required action |
| --- | --- | --- | --- |
| PR #2 — `main-menu-asset-contract-pass` | open; GitHub reports mergeable; branch head `e78dc64`; ten unique commits; merge base `9a107a7`; `604 / 10`; proposed contract says no baked readable labels while both Bloodlines SVGs embed readable `Bloodlines` text | `SUPERSEDED_PRESERVE_EVIDENCE` | mergeability does not resolve the semantic asset conflict or unrelated scope; inspect at the launcher-asset trigger, preserve useful evidence through current-head re-authoring, then close/delete only after proof |
| PR #1 — `main-menu-refinement-pass` | merged and closed historically; remote branch head `986d635`; merge base `d03846e`; `611 / 2`; two commits are not directly reachable and require equivalent-patch review | `MERGED_RETIRE` pending equivalence proof | verify accepted changes are equivalently present on `master`; delete and prune only after the two-commit diff and linked PR state prove no unique value remains |
| `feat/main-menu-assets` | remote head `b42d36f`; merge base is its head; `676 / 0`; fully reachable from `master`; no open PR found | `MERGED_RETIRE` | retire during the next dedicated branch-hygiene or launcher integration pass after exact-ref recheck; no deletion inside the active save route |

## 5. Current Active Route Interaction

Active route:

`Version 0.6.9.1 - Normal Stakes Campaign Persistence Foundation Acceptance Audit`

Branch handling during that route should be limited to:

- required read-only inspection of `prep/integrated-gameplay-0-7-readiness-audit`;
- complete branch/PR inventory and disposition refresh;
- identifying overlap with campaign/save identity, Normal defeat, first-mutation continuity, verified publication, or account-value ownership;
- integrating only a branch whose contents are directly required and whose validation fits the active implementation scope;
- otherwise preserving the candidate branch for the named trigger above.

No listed connector audit branch implements or supersedes the `0.6.9` package. No candidate integration is due inside its parent-specific acceptance audit.

## 6. Mandatory Next Codex Branch Report

The next Codex completion report must include:

- full local and remote branch inventory;
- open PR inventory;
- refreshed ahead/behind and merge-base facts for every branch in this register;
- any newly discovered branches;
- disposition changes;
- exact merge, cherry-pick, rebase, closure, or deletion actions performed;
- validation for each integration;
- branches intentionally retained and their next review triggers.

If no integration or deletion is due inside the active run, Codex must say so explicitly and leave a decision-complete next integration trigger rather than silently carrying branches forward.
