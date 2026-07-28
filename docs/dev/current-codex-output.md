# Current Codex Output

Date: 2026-07-28

Source version/run: unversioned `Activity Resolution Existing-System Reuse Audit`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Branch/status assumption: `master` began clean and synchronized with `origin/master` at `3d77171ca2034c8b2fb8d19f374cef5df9605053`; this report describes the validated working tree before the run commit.

## Result

The documentation-only Activity Resolution existing-system reuse audit is complete and accepted.

`docs/design/activity-resolution-existing-system-reuse-audit.md` records the live system inventory, explicit authority matrix, reuse/adaptation/rejection decisions, typed-effect ownership, determinism posture, documentation corrections, and exact follow-up sequence. No shared resolver or gameplay implementation was authorized.

## Reproduced Baseline

| Area | Verified result |
| --- | --- |
| Skills | 121 records across 8 categories; maximum rank 125; five overlapping bands; gates 30/55/80/100 |
| Legacy Skill Trials | 4 records, 12 checkpoints, 8 rewards, 8 penalties; accumulator-only mutable state |
| Knowledge | One active Flora eligibility policy; strict readiness schema/helper; no authored readiness record, adapter, attempt, outcome, cooldown owner, reward applier, persistence, runtime, or UI |
| Quest action trees | 8 archetypes with 35 nodes/137 checks/111 branches/180 effect tokens; 5 definitions with 20 nodes/54 checks/44 branches/68 effect tokens; no runtime executor |
| Crafting | 28 recipes in 10 families; 121 chains/311 steps; 58 workplaces/208 job rows/110 unique job ids; current resolver is estimate-only |
| Activity advancement | Selection is engine-owned; preview/execution remain UI-owned bespoke branches in `gameplayLoop.ts` |
| Difficulty | Four persisted tiers plus Hardcore and global domain scalars; no target/method difficulty or familiarity |
| Magic | 55 spells: 23 ready, 5 partial, 27 deferred; readiness/projection/envelope foundations are inert outside narrow combat hooks |
| Determinism | Engine command discipline is reusable; current hashes, event ids, and unversioned RNG utility are not uncertainty authority |
| Persistence | Trial accumulators and applied domain state persist; shared attempts, nodes, result evidence, effect proposals, and consequence receipts do not |

## Accepted Decisions

- Quest action trees remain quest-owned; selected phase/check/result vocabulary is reusable only through adapters.
- Legacy Skill Trials remain a preserved `state_accumulator`; the first future adapter is read-only and may not award rewards or invent attempts.
- Knowledge completion/eligibility/readiness foundations remain pure and inert; authored readiness content and the content-to-helper adapter are still missing.
- Future crafting needs a crafting-specific `crafting.activity_process_profiles` authority composed with a separate shared activity grammar.
- Gathering remains blocked by missing target/method difficulty, familiarity, source-state, and output owners.
- Engine-owned activity selection remains separate. Advancement should move through domain-owned commands that consume pure shared proposals; the current UI function must not become the generic resolver.
- The accepted command/revision/stale/atomic/accepted-only discipline is reusable. Current hashes, event ids, and `DeterministicRng` are rejected as committed uncertainty authority.
- A generic resolver may propose typed effects only; domain owners must accept and apply them with owner-specific receipts.
- No shared-framework implementation package is ready from this audit.

## Documentation Corrections

- Two historical roadmap sequences incorrectly called landed `0.5.161 - Knowledge Trial Readiness Policy Schema` "next"; both now say completed.
- Subsequent anonymous `0.5.x` checkpoint/cooldown/Magic Study rows are explicitly historical, unassigned, and non-executable.
- The consumed queued Activity audit prompt was removed.
- Current coordination now activates the restored Mortal Crisis receipt-contract route without displacing the later activity-resolution sequence.

## Files Changed

- `docs/design/activity-resolution-existing-system-reuse-audit.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/design/current-planning-anchor-reconciliation.md`
- `docs/design/static-content-expansion-program.md`
- removed `docs/dev/queued-activity-resolution-existing-system-reuse-audit-prompt.md`

## Checks Run

- repository, branch, worktree, upstream, fetch, and tracking alignment;
- prompt and prerequisite acceptance review;
- exact live skill/trial, Knowledge, quest, recipe/chain/workplace/job, activity, difficulty, magic, command/event, RNG, synchronization, and persistence inventory;
- implementation/consumer searches for trial outcomes, action trees, activity advancement, crafting resolution, Knowledge readiness, and generic checks;
- referenced-path verification;
- source/test/content/runtime changed-path exclusion;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete changed-path and full-diff review.

No build, content lint, typecheck, test, server, generator, package installation, or gameplay command was run because the prompt prohibited them unless a repository-fact check required one; none did.

## Suggested Commit Message

`docs(audit): reconcile activity resolution systems`

## Risks / Follow-Up Notes

- Activity advancement, rest, and quest turn-in still contain UI-owned mutation paths.
- Shared attempt identity, check/margin/result semantics, named uncertainty evidence, typed effects, mutable owners, persistence, correction, and owner receipts remain unimplemented.
- Current HP zero may still enter legacy terminal archival and save deletion.
- The broad workspace typecheck remains the separately classified 173-diagnostic baseline.
- The lower historical roadmap current-anchor block remains stale and noncontrolling under the planning-anchor reconciliation.

## Next Recommended Run

Unversioned `Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision`
