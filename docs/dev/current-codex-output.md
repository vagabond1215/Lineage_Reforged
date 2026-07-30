# Current Codex Output

Date: 2026-07-29

Source version/run: unversioned `Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Branch/status assumption: `master` began clean and synchronized with `origin/master` at `d026befa13f25437b07187d36833bbd3a9db0eca`. Codex fetched all remotes with prune, confirmed zero divergence, refreshed all 17 non-default remote branch comparisons and the one open PR, and performed no integration or deletion.

## Result

`PACKAGE_READY`

Created:

`docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`

Selected implementation:

`Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Implementation classification:

`CURRENT_BAND_PRIMARY`

Implementation milestone impact:

`advances_current_band`

`0.7.0` remains `NOT_READY`.

## Three-Dependency Closure

### Normal activation

Campaign-rules version 2, `normal_stakes`, engine-owned nonterminal defeat, and active legacy HP-zero repair form one atomic activation. Ordinary HP zero can no longer archive a run, grant terminal value, deposit an estate, or delete saves.

### First-mutation continuity

Verified save authority supplies loaded artifact/head context to one campaign session controller. Loading and saving an unchanged non-head artifact do not fork. The first accepted persisted-snapshot mutation mints one in-memory child continuity before application, and later mutations reuse it. The child becomes durable only after verified publication and disappears completely if unsaved play is abandoned.

### Account publication

Character truth may exist in unsaved campaign memory. Durable run history, account metrics/achievements, Legacy, preparation/inheritance use, retirement settlement, estate, and account indexes apply only from a verified publication through stable idempotent consumer receipts. Post-publication failure queues repair and cannot duplicate value.

## Accepted Package Boundary

- Storage envelope version 7 and a save-format-specific snapshot identity remain distinct from workflow `0.6.9`.
- Version-6 sources migrate through one persisted owner-certified receipt and retain original bytes.
- A legacy head is certified only from a single source or a unique exact `savedAt == account.lastPlayedAt` match inside a fully validated source group; ambiguity quarantines.
- Candidate write, exact readback, semantic validation, head publication, and publication verification precede projections.
- New-game preparation/inheritance consumers apply after first publication and block entry while mandatory repair is pending.
- Normal defeat advances four ticks, restores HP to 25% with a minimum of one, restores Stamina to at least 12 within max, preserves MP/body/protected truth, and remains unsaved.
- Active legacy HP-zero repair publishes the repaired loaded address before play and does not make a non-head source the campaign head.
- Explicit retirement publishes terminal campaign authority before existing payout/Legacy/estate settlement.
- No survey command, Committed/Ironbound behavior, checkpoint selection, actual death, succession, generic bus, broad account redesign, or production dependency is included.

## Mutation Evidence

Current persisted-snapshot writers are:

- engine-owned accepted-only travel;
- engine-owned accepted-only quest acceptance;
- engine-owned accepted-only quest tracking;
- engine-owned accepted-only activity selection;
- shell-authored activity advancement, rest, and quest turn-in;
- feature-authored equip, unequip, consume, favorite, and pin changes.

All converge through `GameSessionContext.updateSnapshot(...)` and `App.tsx`. The target campaign session authority consumes explicit engine acceptance or temporary legacy accepted/no-change bridge evidence. Rejection, duplicate delivery, stale revision, load, save, and render create no continuity.

## Branch And PR Disposition

- Local branches: only `master`.
- Non-default remote branches: 17.
- Open PRs: one, PR #2; still unrelated and non-mergeable.
- Protected references retained read-only: `prep/integrated-gameplay-0-7-readiness-audit` and `parallel/prompt-packaging-integrity-audit`.
- Twelve audit branches remain `CANDIDATE_INTEGRATION` at their registered triggers.
- `feat/main-menu-assets` remains fully reachable and `MERGED_RETIRE` for a dedicated hygiene pass.
- PR #1's historical branch remains `MERGED_RETIRE` pending two-commit equivalence proof.
- No branch has overlapping save implementation or supersedes the accepted package.
- No branch or PR action was due.

## Files Changed

- added `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
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

No shared contract, engine, persistence, migration, test, dependency, generated, UI, account data, content, asset, or gameplay path changed.

## Checks Run

- repository, branch, clean-worktree, fetch/prune, upstream, and divergence inspection;
- complete branch and open-PR inventory;
- all-branch merge-base, unique-commit, changed-path, protected-reference, and overlap review;
- complete persisted-snapshot mutation/admission matrix;
- HP-zero, retirement, blocked-run, payout, estate, and save-deletion matrix;
- save/load/new-game/version-6 migration/publication ordering matrix;
- achievement/history/Legacy/preparation/inheritance/account-profile write matrix;
- legacy source grouping, head certification, ambiguity, repair, copy, retry, and failure matrix;
- protected readiness-branch read-only comparison;
- focused save/account/lifecycle/achievement/command/combat baseline: 107/107 passed;
- label and path collision scans;
- documentation-only changed-path audit;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete documentation diff review.

## Suggested Commit Message

`docs(save): close Normal continuity activation dependencies`

## Risks / Follow-Up Notes

- `0.6.9` is an atomic multi-owner package; a partial implementation must fail closed and install a parent-specific repair prompt.
- The target must preserve TypeScript/JavaScript mirrors and current manual/quick-save addresses.
- Pending new-game account consumers must block duplicable preparation/inheritance use after restart.
- The existing broad workspace typecheck remains a separate known-failing 173-diagnostic audit and is not the acceptance gate.
- Parent acceptance requires a later `Version 0.6.9.1` audit.

## Next Recommended Run

`Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`
