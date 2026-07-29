# Branch Disposition Register

Date: 2026-07-29

Status: current coordination surface; live refs must be reinspected before merge, deletion, or status change

Controlling policy: `docs/dev/branch-lifecycle-and-integration-policy.md`

## 1. Inventory Limitation

The GitHub Connector confirmed the named refs below through commit comparison and PR inspection, but its branch-search surface did not return a complete repository-wide branch listing. The next Codex preflight must run local and remote enumeration after `git fetch --all --prune` and add any omitted branches.

Current `master` when the branch comparisons below were performed:

`acdfc3db363692130917ac896abc5d65d711ee00` — `docs(activity): define survey advancement owner contract`

The workflow-policy commits added after that comparison do not change the unique files on the listed parallel branches. Ahead/behind counts must nevertheless be refreshed before action.

## 2. Protected References

| Branch | Reviewed posture | Unique work | Disposition | Named consumer / next review | Retirement rule |
| --- | --- | --- | --- | --- | --- |
| `prep/integrated-gameplay-0-7-readiness-audit` | Diverged; two unique documentation commits; substantially behind `master` | integrated-gameplay `0.7` readiness audit and queued audit prompt | `PROTECTED_REFERENCE` | active and future `0.7.0` readiness gates may inspect it read-only | never merge, rebase, force-update, or delete without a later accepted prompt or explicit user instruction |
| `parallel/prompt-packaging-integrity-audit` | Diverged; one unique documentation commit; behind `master` | prompt-packaging integrity audit prompt | `PROTECTED_REFERENCE` | future prompt-packaging or workflow-integrity review | preserve untouched until a dedicated disposition pass proves promotion, supersession, or explicit abandonment |

## 3. Connector Audit Branches Awaiting Integration Review

All eight branches below were created from:

`bcbe658d1be033cdc83d04acdca67ec8186c484d`

At the first post-Codex comparison, each branch was exactly one unique documentation commit ahead of that source and one commit behind then-current `master`. Each changed exactly one unique new document and did not overlap the survey owner-contract commit.

These branches are not implementation authority merely because they are low-conflict. Codex must reread each document against current authority before integration.

| Branch | Head commit | Unique path | Current disposition | Recommended integration trigger | Post-integration action |
| --- | --- | --- | --- | --- | --- |
| `parallel/gameplay-shell-ui-state-audit` | `25c4a08a39d905903c9ebb940a3e54101864f50e` | `docs/design/gameplay-shell-and-ui-state-ownership-source-audit.md` | `CANDIDATE_INTEGRATION` | before the next Home/shell, pin/search, navigation-history, or broad UI-state contract | cherry-pick or re-author accepted document; verify on `master`; delete local and remote branch |
| `parallel/quest-turn-in-reward-source-audit` | `ff1d3b26057919d95aace2a4848b854b7bdd40dc` | `docs/design/quest-turn-in-reward-delivery-and-idempotency-source-audit.md` | `CANDIDATE_INTEGRATION` | before quest completion/reward receipt, payout, or turn-in implementation planning | integrate accepted audit before implementation prompt; delete branch after reachability/equivalence proof |
| `parallel/equipment-profile-readiness-audit` | `343095adb5b59c28260ad3b17d82005963a374e9` | `docs/design/weapon-and-armor-profile-current-state-readiness-audit.md` | `CANDIDATE_INTEGRATION` | before weapon/armor profile seed evidence or content work | integrate if still current; delete branch after verification |
| `parallel/text-first-combat-view-model-audit` | `4f5d7162431ca0de75ee178f933e1339e1413887` | `docs/design/text-first-combat-presentation-view-model-readiness-audit.md` | `CANDIDATE_INTEGRATION` | before combat UI, tactics editor, combat log, or presentation adapter work | reconcile with the combat-AI/gambit audit and IA boundary; integrate accepted document; delete branch |
| `parallel/research-artifact-retention-inventory` | `411740cd9b9e8cc48626fd7ea57a65c60765dc41` | `docs/dev/temporary-research-artifact-retention-inventory.md` | `CANDIDATE_INTEGRATION` | next research-retention cleanup or before deleting any surviving `tmp-*` artifact | refresh complete filesystem inventory, integrate current register, then delete branch |
| `parallel/launcher-asset-pr-disposition` | `72726210fc5c4c30d55c5fc27bc09117d1e4bff9` | `docs/design/launcher-sidebar-asset-pr-disposition-audit.md` | `CANDIDATE_INTEGRATION` | before resolving PR #2 or doing launcher asset work | integrate audit or preserve equivalent disposition; then resolve PR #2 and delete branch |
| `parallel/consumable-profile-coverage-audit` | `453697a663c7a135b6a0fb3fc9cd44cf48796cbd` | `docs/design/consumable-profile-coverage-and-effect-ownership-audit.md` | `CANDIDATE_INTEGRATION` | before consumable-profile cleanup, quantity/serving authority, or food-state work | integrate accepted audit before content edits; delete branch |
| `parallel/rest-recovery-mutation-audit` | `1e6d049d88c9a9f7c1db5551cb7d0d3df19342fd` | `docs/design/rest-and-recovery-ui-mutation-source-audit.md` | `CANDIDATE_INTEGRATION` | before rest, lodging, recovery, care, or full-resource-reset implementation | integrate accepted audit before contract/implementation; delete branch |

### Batch-integration posture

Because these branches add independent documents on unique paths, a dedicated documentation integration pass may review and cherry-pick several together. That pass must:

1. refresh every comparison against current `master`;
2. read every complete document;
3. reconcile each conclusion against current prompt, handoff, focused decisions, and newer implementation;
4. omit or revise stale claims rather than blindly cherry-picking;
5. run documentation diff, conflict-marker, whitespace, and `git diff --check` validation;
6. update this register;
7. delete each integrated or superseded branch only after proof is recorded.

Do not burden the active minimum-save decision with unrelated integrations unless one document materially affects that decision or a dedicated cleanup subpass is explicitly authorized.

## 4. Pull Requests And Legacy Branches

| PR / branch | Live finding | Disposition | Required action |
| --- | --- | --- | --- |
| PR #2 — `main-menu-asset-contract-pass` | open, not mergeable at inspection; ten commits; proposed contract says no baked readable labels while both Bloodlines SVGs embed readable `Bloodlines` text | `SUPERSEDED_PRESERVE_EVIDENCE` | inspect current diff and review state; preserve the typed asset-map/ratio/QA ideas through current-head re-authoring if desired; do not merge as-is; close PR after disposition is documented; delete branch after unique evidence is preserved |
| PR #1 — `main-menu-refinement-pass` | merged and closed historically | `MERGED_RETIRE` | verify accepted changes are reachable or equivalently present on `master`; if the local/remote branch still exists and has no unmerged unique work, delete and prune it |

## 5. Current Active Route Interaction

Active route at register creation:

`Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision`

Branch handling during that route should be limited to:

- required read-only inspection of `prep/integrated-gameplay-0-7-readiness-audit`;
- complete branch/PR inventory and disposition refresh;
- identifying overlap with save identity, persistence, publication, occurrence, or receipt ownership;
- integrating only a branch whose contents are directly required and whose validation fits the documentation-only scope;
- otherwise preserving the candidate branch for the named trigger above.

No listed connector audit branch authorizes survey implementation, save changes, gameplay mutation, or `0.7.0` entry.

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