# Current Codex Output

Date: 2026-07-29

Source version/run: unversioned `Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Branch/status assumption: `master` began clean and synchronized with `origin/master` at `03a79c8a359414f7c79421a1cef2d72d91d040de`. Codex fetched all remotes with prune, confirmed zero divergence, inventoried every local and remote branch plus open PR, and made no branch integration or deletion.

## Result

`NO_PACKAGE`

Created:

`docs/design/ashen-reef-survey-minimum-save-identity-and-accepted-state-publication-decision.md`

Minimum-contract result:

`ACCEPTED`

Dependency result:

`BLOCKED_BY_NORMAL_STAKES_ACTIVATION_CONTINUITY_AND_ACCOUNT_VALUE_PUBLICATION`

Selected next route:

Unversioned `Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`

Next-route classification:

`UNVERSIONED_PREREQUISITE`

No `0.6.9`, support suffix, or `0.7.0` label is assigned.

## Accepted Minimum Save Contract

- Campaign rules version 2 identifies Normal Stakes independently from the legacy difficulty projection.
- Account, campaign, continuity, character, save artifact, artifact generation, publication, snapshot revision, and occurrence identities are distinct.
- Production identity generation uses collision-safe UUIDs and fails closed; it does not derive authority from player name, slot, clock, or `Math.random()`.
- Campaign and continuity authority plus the typed append-only occurrence/result/consequence/correction ledger live in the authoritative snapshot.
- Artifact, generation, address, and publication-control identity live in the save envelope/control layer.
- Version-6 migration is idempotent and persists one owner-certified migration receipt. Conflicting or incomplete evidence quarantines the source without overwriting it.
- Publication is candidate write, semantic readback verification, atomic authoritative-head publication, then publication verification. The prior verified authority remains recoverable on any failure.
- Loading a non-head artifact does not fork. Normal creates one child continuity at the first accepted divergent mutation.
- Copies preserve embedded campaign, continuity, artifact, and publication provenance rather than inventing new authority.
- Separate request, occurrence, result, consequence, and correction identities are retained across restart; projections cannot reconstruct authority.

## Why Implementation Is Not Dependency-Closed

Three current seams must be decided together before this contract can be implemented safely:

1. campaign-rules version 2 and `normal_stakes` cannot activate while ordinary HP zero still archives the run and deletes saves;
2. no current owner receives every accepted-mutation signal needed to create exactly one child continuity after loading a non-head artifact;
3. account history and achievement/Legacy value can publish from in-memory state before authoritative campaign save publication, allowing abandoned or unpublished branches to create durable account value.

The exact next decision closes those three dependencies without implementing survey advancement, Committed/Ironbound Stakes, checkpoint selection, cloud synchronization, death/succession, or broad account redesign.

## Branch And PR Disposition

- Local branches: only `master`.
- Non-default remote branches: 17.
- Open PRs: one, PR #2 `main-menu-asset-contract-pass`; it remains `SUPERSEDED_PRESERVE_EVIDENCE` and is unrelated.
- Protected references retained read-only: `prep/integrated-gameplay-0-7-readiness-audit` and `parallel/prompt-packaging-integrity-audit`.
- Twelve one-document audit branches remain `CANDIDATE_INTEGRATION` for their named triggers in `docs/dev/branch-disposition-register.md`.
- `feat/main-menu-assets` is fully reachable from `master` and remains `MERGED_RETIRE` for a dedicated hygiene pass.
- PR #1's historical branch remains `MERGED_RETIRE` pending equivalent-patch proof for two non-reachable commits.
- No branch contains save/persistence implementation that should be integrated into this documentation-only decision.
- No merge, cherry-pick, rebase, PR closure, branch deletion, or remote mutation was due.

## Files Changed

- added `docs/design/ashen-reef-survey-minimum-save-identity-and-accepted-state-publication-decision.md`;
- updated `docs/dev/current-codex-output.md`;
- updated `docs/dev/current-codex-prompt.md`;
- updated `docs/dev/current-gpt-handoff.md`;
- updated `docs/dev/codex-sequenced-implementation-plan.md`;
- updated `docs/dev/project-roadmap.md`;
- updated `docs/dev/project-vision-and-continuity-brief.md`;
- updated `docs/dev/historical-version-and-deferred-route-register.md`;
- updated `docs/design/current-planning-anchor-reconciliation.md`;
- updated `docs/design/static-content-expansion-program.md`;
- updated `docs/future_content_backlog.md`;
- updated `docs/dev/branch-disposition-register.md`.

No engine, app, shared contract, persistence, test, content, schema, dependency, asset, generated, or gameplay path changed.

## Checks Run

- repository, branch, clean-worktree, fetch/prune, upstream, and divergence inspection;
- complete local/remote branch and open-PR inventory;
- merge-base, unique-commit, unique-path, semantic-overlap, protected-reference, and branch-disposition review;
- save snapshot, version-6 envelope, writer, reader, migration, load, delete, and publication inspection;
- campaign/Stakes identity and Normal defeat contract reconciliation;
- occurrence/request/result/consequence/correction authority matrix;
- restart, copy, stale-head, migration, verification-failure, and correction matrix;
- focused save/account/lifecycle tests: 29/29 passed;
- label and path collision scans;
- documentation-only changed-path audit;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete documentation diff review.

## Suggested Commit Message

`docs(save): define minimum survey persistence boundary`

## Risks / Follow-Up Notes

- The accepted minimum contract is not implementation authorization.
- The next decision must close Normal HP-zero behavior, first-mutation continuity admission, and campaign-publication-before-account-value ordering as one coherent boundary.
- Current player identity remains name-derived, current writes remain direct version-6 local-storage replacement, and current account evaluation can precede save publication.
- The existing broad workspace typecheck remains the separate known-failing 173-diagnostic audit and was not used as a gate.
- `0.7.0` remains `NOT_READY`.

## Next Recommended Run

Unversioned `Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`
