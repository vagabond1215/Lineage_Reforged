# Current Codex Prompt

## Run Identity

`Version 0.6.6.2 - BOM Repair Post-Validation And Parent Prompt Restoration`

Parent primary:

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`

Prior support run:

`Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`

Run classification: four-segment support suffix attached to `0.6.6`.

Milestone impact: `supports_current_band`.

Suggested commit:

`docs(routes): accept bom repair and restore 0.6.6`

## Purpose

The narrow test repair has landed, but the support sequence is incomplete. The repository still exposes the old `0.6.6.1` repair prompt and has no committed validation/completion evidence or restored parent prompt.

This pass must:

1. verify the landed repair exactly;
2. run the required validation against the current repository;
3. prove that content data remained byte-unchanged;
4. mark `0.6.6.1` and this validation suffix complete;
5. restore the exact parent `0.6.6` prompt byte-for-byte;
6. stop without executing the parent content package.

This is a validation and coordination pass. It is not permission to edit tests again or author content.

## Pinned Repository Evidence

Expected repair commit:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

Repair commit parent and pre-repair coordination head:

`895c02df40332c813a8403bd489af6184111ccba`

The exact repair range `895c02df40332c813a8403bd489af6184111ccba..66f12fd6f649f8f218f7f49fc721a8fe545a7a01` must change only:

- `tests/unit/region-first-world-data.test.mjs`;
- `tests/unit/slug-content.test.mjs`.

The accepted repair in each reader is equivalent to:

```js
JSON.parse(raw.replace(/^\uFEFF/, ""))
```

The stale prior support-prompt blob is:

`93d2a29e1cbc8dd931a243becfbbeab2ed8a69a0`

The exact parent `0.6.6` prompt blob to restore is:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

Do not regenerate or paraphrase the parent prompt.

## Execution Gate

1. Read `AGENTS.md`, `README.md`, current output, current handoff, this prompt, the route register, `docs/design/current-planning-anchor-reconciliation.md`, `docs/dev/project-vision-and-continuity-brief.md`, and `docs/design/static-content-expansion-program.md`.
2. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state. Preserve unrelated work.
3. Confirm commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` is an ancestor of the current branch.
4. Inspect the exact repair commit and its range from `895c02df40332c813a8403bd489af6184111ccba`. Require exactly the two test-file changes listed above and no content-file change.
5. Confirm both current test readers remove at most one leading `U+FEFF` before `JSON.parse`, preserve all other text, and do not use broad `trim()` or a shared production parser.
6. Confirm Git blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` resolves and is the held exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt.
7. Stop without edits if the repair commit is missing, contains broader source/test changes, alters content data, weakens assertions, or no longer matches the narrow accepted operation.

## Required Validation

Run the two repaired test files:

`node --test tests/unit/region-first-world-data.test.mjs tests/unit/slug-content.test.mjs`

Run normal content lint:

`npm.cmd run tool:content-lint`

Rerun the exact parent baseline:

`node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

Acceptance requirements:

- every named test passes;
- the parent baseline passes at `146/146` unless a legitimate test-count change after the pinned repair is fully explained and contains no failure;
- normal content lint passes at 67 checked files unless a legitimate current-baseline count change is fully explained;
- `git diff --exit-code 895c02df40332c813a8403bd489af6184111ccba..HEAD -- packages/content` reports no content change;
- no JSON data file was normalized, reformatted, or rewritten;
- conflict-marker and trailing-whitespace searches pass;
- `git diff --check` passes;
- complete changed-path and full-diff inspection confirms that the landed repair is narrow and all later connector changes are documentation-only.

Do not run the full test suite, builds, typechecks, package installation, servers, generators, or gameplay.

## Failure Behavior

If any validation or scope requirement fails:

- do not edit any file;
- do not restore the parent prompt;
- do not change tests, content, runtime, schemas, validators, dependencies, or coordination state;
- report the exact command, failure, changed-path evidence, and smallest recommended follow-up;
- leave this support prompt active.

## Allowed Changes After Successful Validation Only

Update only:

- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/project-vision-and-continuity-brief.md`;
- `docs/dev/current-codex-prompt.md`, solely by restoring exact blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

No source, test, content, schema, validator, runtime, persistence, save, migration, UI, dependency, asset, generated-output, or gameplay file may change in this pass.

## Required Completion Updates

On success, record in current output:

- starting and ending commits;
- exact repair commit and two-file scope;
- focused-test result;
- content-lint result;
- parent-baseline result;
- content byte-identity check;
- hygiene results;
- exact changed paths;
- confirmation that no test or content file changed during this validation pass;
- restored parent-prompt blob;
- next run: exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`.

Update the handoff, route register, planning anchor, and continuity brief so they agree that:

- `0.6.6.1` repair implementation is accepted;
- `0.6.6.2` validation/restoration support is complete;
- `0.6.6` is active and unblocked;
- the active prompt is the exact parent blob;
- `0.6.7` remains reserved after accepted `0.6.6`;
- no content was authored by either support suffix.

## Exact Parent Restoration

Restore `docs/dev/current-codex-prompt.md` directly from Git blob:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

After writing, require:

`git hash-object docs/dev/current-codex-prompt.md`

returns exactly:

`42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`

Do not add a wrapper, completion note, mode line, or commentary to the restored prompt.

## Stop Condition

After the completion documentation and exact prompt restoration are committed:

- stop;
- do not execute `0.6.6` in the same run;
- do not begin `0.6.7`;
- do not merge or modify the separate parallel `0.7` readiness-audit branch.

The next Codex pass is the restored exact:

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`
