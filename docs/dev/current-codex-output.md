# Current Codex Output

Date: 2026-07-29

Source version/run: unversioned `Ashen Reef Survey Activity Advancement Scope And Owner Contract Decision`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Branch/status assumption: `master` began clean and synchronized with `origin/master` at `3006c968eb40b1d72f64fb2dc0263e227f869a7d`. Origin advanced during the run through `bcbe658`; the completed documentation commit was rebased cleanly onto that head before final validation and push.

## Result

`NO_PACKAGE`

Created:

`docs/design/ashen-reef-survey-activity-advancement-scope-and-owner-contract-decision.md`

Owner-contract result:

`ACCEPTED`

Dependency result:

`BLOCKED_BY_MINIMUM_SAVE_IDENTITY_AND_ACCEPTED_STATE_PUBLICATION`

Selected next route:

Unversioned `Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision`

Next-route classification:

`UNVERSIONED_PREREQUISITE`

No `0.6.9`, support suffix, or `0.7.0` label is assigned.

## Survey Decision

- The first engine-owned activity-advancement consumer remains the deterministic Ashen Reef survey slice, not a generic activity resolver.
- One admitted survey shift is one occurrence. It advances two ticks, applies the existing survey metabolic/attribute/resource profile, performs the current skill attempt, and advances one exact survey stage.
- The fourth shift additionally completes the ruins flag, discovery, operation, and current-activity return transition.
- Preview and execution must share one pure plan. Completed, malformed, stale, ineligible, or wrong-location state rejects without mutation.
- Command request, occurrence, deterministic result, owner consequence receipts, event, and projection identities remain distinct.
- The engine owns admission, atomic application, result assembly, synchronization, and accepted snapshot publication. Affected owners apply typed proposals and return receipts.
- The UI may apply only accepted results and must not author survey advancement.

## Current Defects Confirmed

- After survey completion, preview still reports the survey profile while execution falls through to generic advancement.
- Preview omits explicit stamina/MP deltas and does not apply the survey attribute-load profile.
- Count-based sector progress can repeat side effects against malformed non-contiguous flags without adding the next sector.
- `ActivityPanel` unconditionally applies the returned snapshot because the current result has no accepted/rejected discriminator.

These defects define later parity and rejection requirements; this documentation run does not change runtime behavior.

## Persistence Decision

Current snapshot serialization can mechanically preserve existing fields, but it is not sufficient authority for accepted survey occurrences and receipts:

- `SaveSnapshot` has no stable campaign or continuity identity;
- current persistence has no accepted campaign-rules/Stakes identity;
- no durable occurrence/result/consequence receipt container exists;
- the local adapter writes a version-6 envelope directly and has no candidate-write, verification, publication, or authoritative-head boundary;
- restart duplicate handling, correction linkage, and retained-result behavior are not defined.

Adding these cross-cutting identities opportunistically inside a survey command would violate the bounded package. The minimum Normal-only save identity and accepted-state publication decision is therefore the exact prerequisite.

## Files Changed

- added `docs/design/ashen-reef-survey-activity-advancement-scope-and-owner-contract-decision.md`;
- updated `docs/dev/current-codex-output.md`;
- updated `docs/dev/current-codex-prompt.md`;
- updated `docs/dev/current-gpt-handoff.md`;
- updated `docs/dev/codex-sequenced-implementation-plan.md`;
- updated `docs/dev/project-roadmap.md`;
- updated `docs/dev/project-vision-and-continuity-brief.md`;
- updated `docs/dev/historical-version-and-deferred-route-register.md`;
- updated `docs/design/current-planning-anchor-reconciliation.md`;
- updated `docs/design/static-content-expansion-program.md`;
- updated `docs/future_content_backlog.md`.

No content, schema, validator, test, engine, shared contract, save, migration, dependency, generated, UI, asset, or gameplay path changed.

## Checks Run

- repository, branch, worktree, fetch, and remote-alignment inspection;
- final upstream rebase and newly landed workflow-policy review;
- current output and active-prompt accuracy review;
- exact survey preview/execution and `ActivityPanel` call-site inspection;
- command, occurrence, result, receipt, affected-owner, and accepted-only UI matrix;
- save identity, envelope, serialization, publication, replay, and correction matrix;
- read-only comparison with `origin/prep/integrated-gameplay-0-7-readiness-audit`;
- focused current-capability group: 40/40 passed;
- label and path collision scans;
- documentation-only changed-path audit;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete documentation diff review.

## Suggested Commit Message

`docs(activity): define survey advancement owner contract`

## Risks / Follow-Up Notes

- Survey implementation remains `NO_PACKAGE` until the minimum save identity/publication prerequisite closes.
- The next decision must remain Normal-only and must not absorb broad Committed/Ironbound Stakes, checkpoint, death, cloud, recovery, or survey-command implementation.
- General competence, difficulty, familiarity, compression, uncertainty, RNG, rest, quest turn-in, rewards, inventory transactions, health, care, and Geography recognition remain separate.
- `0.7.0` remains `NOT_READY`.
- The isolated readiness branch remains unmerged and untouched.
- The broad workspace typecheck remains the separate known-failing 173-diagnostic baseline.

## Next Recommended Run

Unversioned `Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision`
