# Tool Surface Test Boundary Decision

Source version/run: Version 0.5.355 - Tool Surface Test Boundary Decision
Date: 2026-07-12
Status: approved documentation-only test boundary; one later test-only repair selected

## 1. Decision Summary

Separate the three current tool checks by behavior and owner:

- **content lint** remains in the generic integration smoke because it is side-effect-free with respect to tracked/generated artifacts and is the normal live-content gate;
- **DB build** leaves automatic/default test discovery because it writes timestamped ignored artifacts to `packages/db/build/` and must be explicitly opt-in;
- **scenario runner** leaves the generic integration smoke because `tests/simulation/deterministic-scenario.test.mjs` already owns successful execution and deterministic output.

The content-lint smoke should assert process success and the stable success-output shape, not a hardcoded registered-file count. The current exact `67` count remains an observed normal-lint result, not a durable generic-smoke contract.

Select `Version 0.5.356 - Tool Surface Test Boundary Repair` next. The later repair should edit only `tests/integration/tool-surfaces.test.mjs` plus required coordination docs. It must not edit tools, package scripts, content-lint registration, generated output, or the other 14 full-suite failures.

## 2. Current Problem

`tests/integration/tool-surfaces.test.mjs` currently combines:

1. content-lint process execution and exact stdout assertion;
2. DB-build process execution without output inspection;
3. scenario-runner process execution without deterministic/output inspection.

This produces two confirmed defects in validation routing:

- the content-lint expectation is stale at `56` while the live entrypoint reports `67`;
- full `node --test` discovery silently runs DB build, whose entrypoint creates/updates ignored output and writes a timestamped manifest.

It also duplicates scenario execution already covered by the deterministic simulation test.

## 3. Generic Tool Smoke Boundary

Generic automatic tool smoke must satisfy all of these:

- finite and local;
- deterministic enough for repeated test discovery;
- no package installation or network dependency;
- no mutation of tracked or generated-output roots;
- process exit code is meaningful;
- output assertion tests a durable public shape rather than a frequently changing inventory count;
- failure diagnostics include stderr.

Under current tool behavior, only content lint qualifies.

The future repaired integration test should execute `tools/content-lint/index.mjs`, require status zero, and match exactly one success line shaped like:

```text
content-lint: ok (<positive integer> files checked)
```

The regex should anchor the line and require a positive decimal count. It should not accept arbitrary output or suppress additional failure text.

## 4. Content-Lint Count Ownership

The exact registered-file count is not a generic tool-smoke contract.

Reasons:

- every authorized live-content registration changes the count;
- the integration test does not own the registration list;
- focused authority tests already prove exact-once registration for recent families;
- standalone normal lint proves all currently registered paths load and validate;
- hardcoding the total duplicates inventory knowledge and creates unrelated drift.

The success line should continue to report the exact runtime `checks.length` for human diagnostics. Generic smoke should validate the output grammar and a positive count only.

If a future need requires an exact total invariant, it must be owned by a dedicated registration/inventory decision that derives from one authority rather than copying a number into generic smoke. No such additional test is selected now.

## 5. DB-Build Boundary

`tools/db-build/index.mjs` is a generator, not a read-only smoke target. It:

- creates `packages/db/build/`;
- creates or touches four placeholder SQLite files;
- writes `build-manifest.json`;
- embeds a fresh `generatedAt` timestamp;
- logs generated output metadata.

Therefore:

- do not execute it from `npm test` or generic automatic discovery;
- remove it from the current integration test command list;
- keep `npm.cmd run tool:db-build` as an explicit generator command;
- require a future DB-build-specific prompt to authorize output mutation, verify the resolved build root, inspect output files/manifest, and report ignored artifact changes;
- do not add cleanup logic or temp-directory indirection in the narrow repair.

A future dedicated DB-build test could become safe only after a separate design/implementation decision introduces an explicit injectable output root and deterministic time or another isolated contract. That would change tool behavior and is not justified by the current repair.

## 6. Scenario-Runner Boundary

`tools/scenario-runner/index.mjs` is side-effect-free and deterministic, but generic smoke adds no unique proof.

`tests/simulation/deterministic-scenario.test.mjs` already:

- spawns the exact entrypoint;
- requires status zero;
- runs it twice;
- requires identical stdout.

That simulation test owns scenario execution/determinism. Remove scenario runner from the generic integration command list and keep the existing simulation test unchanged.

## 7. Exact Future Repair

The later implementation should change only `tests/integration/tool-surfaces.test.mjs` among source/test files:

1. remove the command array abstraction if it no longer adds value;
2. remove DB-build execution;
3. remove scenario-runner execution;
4. keep one clearly named content-lint process smoke;
5. assert exit status zero with stderr in the diagnostic;
6. replace the stale exact-count string with an anchored success-shape regex requiring a positive integer;
7. do not change content-lint, DB-build, scenario-runner, package scripts, ignore rules, or generated output.

Allowed future implementation paths:

- `tests/integration/tool-surfaces.test.mjs`;
- current output, handoff, prompt, sequence, roadmap, and backlog coordination docs.

No production helper or new dependency is needed.

## 8. Future Validation

The repair should run:

- `node --test tests/integration/tool-surfaces.test.mjs`;
- `node --test tests/simulation/deterministic-scenario.test.mjs` to confirm the retained owner remains green;
- the required focused polity, institution, and schema suites;
- `npm.cmd run tool:content-lint`;
- conflict-marker, changed-path, whitespace, and status checks.

Do not run:

- full `npm test`;
- DB build;
- broad typechecks;
- UI build;
- package installation or network-dependent commands.

The repair is successful when the integration test passes without invoking DB build or scenario runner, the scenario owner still passes, standalone lint reports 67, and no generated/tracked output changes outside the allowed paths.

## 9. Stop Conditions

Stop rather than broaden if:

- the integration test cannot pass without editing a tool or package script;
- content lint output no longer has a stable success line;
- the test still invokes or indirectly triggers DB build;
- a generated-output change appears;
- scenario determinism fails independently;
- any of the other 14 baseline failures becomes necessary to the repair;
- a broad typecheck/full-suite failure is presented as required evidence.

Any such result requires a separate owner-specific decision.

## 10. Other Failures And Gates

The other 14 observed full-suite failures remain untriaged and unchanged:

- Backstory draft assertions;
- settlement/transport assertions;
- route-security registration;
- region-first world assertions;
- Renown projection assertions;
- flora/mineral BOM parsing.

Broad typecheck debt also remains unchanged. This boundary authorizes no feature, content, schema, runtime, UI, save/account, generated-output, compatibility, or gated-lane work.

## 11. Research, Support, And Cleanup

No explicit user question or Deep Research is required. The decision is repository-local and exact.

No support suffix is needed; this is a primary stabilization sequence with one selected narrow repair.

No temporary artifact is created. The validation source map and command matrix remain the durable validation authorities. `docs/design/validation-blocker-inventory.md` remains historical connector prep and is not modified or deleted here.

## 12. Decision Answers

1. Generic smoke, exact inventory count, DB generation, and scenario determinism do not belong in one test loop.
2. Content lint remains the only generic side-effect-free tool smoke under current behavior.
3. Generic smoke should assert the exact success-line grammar and a positive count, not hardcode `67`.
4. Exact registration totals require a separate derived owner if ever needed.
5. DB build must be removed from default automatic test discovery and remain explicitly opt-in.
6. No DB tool refactor, temp output, or cleanup logic is approved now.
7. Scenario runner belongs to the existing deterministic simulation test and should leave generic smoke.
8. The future repair needs only `tests/integration/tool-surfaces.test.mjs` among test/source files.
9. The other 14 failures and broad typecheck debt remain separate.
10. Select `Version 0.5.356 - Tool Surface Test Boundary Repair`.

## 13. Next Recommended Version

Version 0.5.356 - Tool Surface Test Boundary Repair
