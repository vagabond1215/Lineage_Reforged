# Validation Command Matrix Plan

Source version/run: Version 0.5.354 - Validation Command Matrix Plan
Date: 2026-07-12
Status: approved documentation-only command-routing plan; no tooling or test implementation permission

## 1. Matrix Decision

Validation must be selected by changed owner and command behavior. The repository does not have one universal green command, and command names alone do not prove that a command is read-only.

Use five command classes:

1. **green gate**: expected to exit zero for the scoped change and blocks completion on failure;
2. **known-failing audit**: useful only with an accepted baseline and blocks completion on new or changed failures, not on the unchanged baseline alone;
3. **side-effectful generator/build**: may write ignored or tracked artifacts and requires explicit output scope plus post-run artifact review;
4. **interactive/long-running**: dev or preview process used for manual inspection, never a completion gate by itself;
5. **environment/network-dependent**: may fail for permissions, certificates, availability, or remote state and must be reported separately from repository validation.

Select docs-only `Version 0.5.355 - Tool Surface Test Boundary Decision` next. It should decide the smallest future repair boundary for the stale content-lint expectation and DB-build side effect in `tests/integration/tool-surfaces.test.mjs`. It must not fix the test.

## 2. Command Classification

| Command or pattern | Class | Current expectation | Scope rule |
| --- | --- | --- | --- |
| `node --test <exact files>` | Green gate | Exit zero for every selected focused file | Select by changed owner and adjacent regression boundary |
| `npm.cmd run tool:content-lint` | Green gate | Exit zero; currently reports 67 files | Required for live content and normal-lint/validator dependency changes |
| `node --test tests/unit/schema-files.test.mjs` | Green gate | Exit zero; currently 105 tests | Required for schema additions/changes and schema registration changes |
| `git diff --check` | Green gate | No whitespace errors | Required for every implementation or docs run |
| Conflict-marker, changed-path, and status checks | Green gate | No markers or unauthorized paths; expected final status | Required for every run |
| `npm.cmd test` | Known-failing audit plus side-effectful tool execution | Accepted `0.5.353` baseline: 3,456/3,471 pass, 15 fail | Run only with explicit broad-regression scope and DB-build output permission |
| `npm.cmd run typecheck` | Known-failing audit | Accepted broad UI/imported-package debt | Run only when UI/shared imports are directly affected and baseline comparison is useful |
| `npm.cmd run typecheck:workspace` | Known-failing audit | Accepted broad NodeNext/config/strictness debt | Run only for cross-workspace TypeScript/config work or a dedicated blocker audit |
| `npm.cmd run typecheck:ui:node` | Side-effectful audit | May write `.tmp-rpg-ui-node.tsbuildinfo` | Run only when Vite/Tailwind config is in scope and temp output is allowed |
| `npm.cmd run tool:db-build` | Side-effectful generator | Writes `packages/db/build/` | Explicit DB/build-output scope only |
| `npm.cmd run ui:build` | Side-effectful build | Typechecks, then writes `apps/rpg-ui/dist/` when successful | Explicit UI build/generated-output scope only |
| `npm.cmd run tool:scenario` | Green tool smoke when directly scoped | Deterministic command should exit zero | Use for scenario/engine/tool changes, not docs-only work |
| `npm.cmd run ui:dev*`, `ui:preview` | Interactive/long-running | Manual session, not finite proof | Explicit UI manual inspection only |
| Git fetch/pull/push | Environment/remote operation | Success required for requested sync/publish, but permission/network failures are external-state failures | Report separately from source validation |
| Package install/fetch | Environment/network-dependent and mutating | Not part of routine validation | Explicit dependency scope and approval only |

## 3. Change-Class Matrix

### 3.1 Documentation-only

Minimum green gates:

- `git diff --check`;
- changed-path/scope audit;
- conflict-marker scan over changed files;
- active route/version pointer check when coordination docs change;
- final `git status --short --branch`.

Conditional:

- standalone content lint and exact focused tests when the governing prompt explicitly requires them or the docs assert current counts/behavior that should be reconfirmed.

Prohibited by default:

- full suite, broad typechecks, UI/DB builds, dev/preview servers, package installation, network-dependent tooling, or generated-output refresh.

### 3.2 Content JSON

Minimum green gates:

- exact focused validator test for every changed content family;
- `npm.cmd run tool:content-lint` for every live registered content change;
- schema suite when content shape, schema compatibility, or schema registration is implicated;
- whitespace/scope/status checks.

Conditional:

- reference-owner tests for every changed cross-file id;
- consumer-focused tests only when the consumer reads the changed fields;
- scenario/tool smoke only when generated behavior depends on the content.

Prohibited by default:

- unrelated authority tests, full suite, broad typechecks, or generated builds.

### 3.3 Schema And Validator

Minimum green gates:

- exact focused validator tests, including valid, malformed, duplicate, forbidden-field, purity, and non-mutation cases appropriate to the contract;
- schema suite;
- normal content lint when a registered live wrapper or dependency path uses the schema/validator;
- whitespace/scope/status checks.

Conditional:

- exact consumer or reference-resolution tests when the contract changes an existing dependency.

Prohibited by default:

- creating live content merely to exercise the schema, unrelated full-suite runs, or broad typecheck cleanup.

### 3.4 Helper Or Runtime Source

Minimum green gates:

- exact owner-focused unit tests for changed behavior;
- adjacent regression tests for every mutated state owner, event/result envelope, or public projection;
- relevant deterministic simulation/roundtrip tests for persistence or tick behavior;
- content lint when source loads or interprets canonical content;
- whitespace/scope/status checks.

Conditional:

- UI/default or workspace typecheck as known-failing audits only when changed TypeScript is inside their scope;
- scenario runner when the changed engine/tool path owns its output;
- full suite only for an explicitly authorized broad regression pass with generated DB output permitted.

Prohibited by default:

- claiming broad typecheck/full-suite failures are patch regressions without a comparable baseline;
- mixing unrelated failure cleanup into the change.

### 3.5 UI Or Presentation

Minimum green gates:

- exact presentation, projection, creator, shell, or component-adjacent tests selected by imports and changed behavior;
- content lint when UI consumes changed canonical content or metadata;
- whitespace/scope/status checks.

Conditional:

- `npm.cmd run typecheck` as a known-failing audit with before/after comparison;
- UI build only when generated bundle output is explicitly requested or release/launch verification requires it;
- browser/manual inspection only when visual or interactive behavior changed.

Prohibited by default:

- treating the existing typecheck baseline as caused by the patch;
- editing `dist` directly or refreshing it during docs/source-only work.

### 3.6 Save, Account, Persistence, Or Other High-Risk State

Minimum green gates:

- exact owner validation tests;
- save/load roundtrip and lifecycle tests;
- wrong-owner, missing-owner, stale-state, idempotency, and non-mutation tests relevant to the change;
- adjacent Legacy/family/account/run-history/estate tests when those owners are touched;
- whitespace/scope/status checks.

Conditional:

- broader focused groups named explicitly by the prompt;
- workspace typecheck audit for changed shared contracts;
- full suite only after a dedicated risk decision and side-effect authorization.

Prohibited by default:

- implicit compatibility/migration work;
- UI visibility as mutation proof;
- broad cleanup mixed with state-schema or persistence changes.

### 3.7 Generated Output, Build, Or Packaging

Minimum gates:

- validate source inputs first;
- explicitly name the generator/build and every expected output root;
- verify resolved output paths remain within the intended ignored or tracked directories;
- run the owner command only after output mutation is authorized;
- inspect status/diff plus ignored-output posture as appropriate;
- never hand-edit generated output as the primary source.

Conditional:

- build-specific typecheck, smoke, launch, or preview after generation.

Prohibited:

- hidden generator execution inside a purported read-only run;
- recursive cleanup without verified paths and authority;
- committing vendor/generated artifacts unless explicitly scoped.

## 4. Focused-Test Selection Rules

A prompt must choose focused tests from ownership, not from convenient filenames alone:

1. select the test that directly owns the changed helper/content/schema;
2. add reference/dependency tests for each changed id or target authority;
3. add consumer tests only for consumers whose input contract changed;
4. add roundtrip/simulation tests when persistence, determinism, ticks, or state transitions changed;
5. add UI/presentation tests when visible projection changed;
6. add schema suite for every schema file or schema registration change;
7. add normal content lint for live registered content or lint dependency changes;
8. do not add broad unrelated families merely to inflate coverage.

The command matrix should name exact files in each implementation prompt. This plan intentionally avoids a permanent exhaustive filename-to-owner catalog because that catalog would drift as test files change.

## 5. Baseline Comparison Rules

Known-failing audits are evidence only when a comparable baseline exists.

- Record command, date/source version, exit code, total/pass/fail counts when available, and failure families.
- Compare the same command, working tree, installed dependency state, and relevant configuration.
- A failure absent from the accepted baseline is unexpected and blocks completion until attributed or the prompt explicitly narrows the gate.
- A baseline failure that disappears is improvement evidence but does not authorize unrelated cleanup.
- A baseline failure whose message/location changes must be treated as changed until reviewed.
- Truncated output is not a valid exact baseline; capture summaries and failing test names or bounded diagnostic families.
- Never report a known-failing audit as “passed.” State “ran; accepted baseline unchanged” only after a real comparison.

The accepted `0.5.353` full-suite baseline is informational and must not be copied indefinitely. Re-establish it only in a prompt that explicitly authorizes the side effect and the cost of broad comparison.

## 6. Reporting Rules

Every meaningful Codex output should distinguish:

- **Passed green gates**: exact commands and counts where useful;
- **Expected baseline failures**: command, accepted baseline source, and whether unchanged;
- **Unexpected failures**: new/changed failure and why work stopped or proceeded under a narrower authorized gate;
- **Skipped side-effectful commands**: command, output it would mutate, and why scope did not authorize it;
- **Environment limitations**: permission, network, certificate, remote, or sandbox issue, clearly separated from repository defects;
- **Not run**: never imply a check passed if it was not executed.

Generated output must be reported even when ignored and absent from `git status`.

## 7. Schema And Content-Lint Timing

- Run schema suite whenever a schema file, schema-file registration, shared schema vocabulary, or schema-dependent contract changes.
- Run the exact focused validator test whenever validator behavior or its content contract changes.
- Run normal content lint whenever registered live content, lint index wiring, or a dependency loaded by normal lint changes.
- For an unregistered future authority with fixture-only tests, normal content lint is conditional unless shared dependencies changed.
- A passing normal content lint does not replace focused malformed/forbidden/purity coverage.
- A passing focused validator does not prove live index registration.
- A passing schema parse test does not prove semantic or cross-file validity.

## 8. Typecheck Timing

Use `npm.cmd run typecheck` only when UI source or UI-imported shared/engine TypeScript is affected and a baseline comparison will clarify risk. Use `npm.cmd run typecheck:workspace` only for cross-workspace TypeScript, root compiler configuration, module-resolution, or a dedicated blocker audit.

Until a dedicated audit creates stable failure inventories:

- neither command is a default green gate;
- both failures must be reported, not fixed incidentally;
- a narrow change must still pass its exact focused tests;
- do not use the workspace command as a substitute for UI compiler context or vice versa.

`typecheck:ui:node` requires explicit temp-output scope because it writes build info.

## 9. Full-Suite Timing

Do not run `npm.cmd test` for docs-only, narrow content/schema, or ordinary focused helper work.

It may run only when all are true:

1. a dedicated broad-regression or release/readiness prompt selects it;
2. the prompt accepts the runtime cost and the known-failing baseline comparison;
3. DB build output refresh is explicitly authorized and its output path is reviewed;
4. the current baseline source and expected failure families are named;
5. results are captured without truncating the summary/failing names;
6. no failure is fixed unless separately scoped.

The full suite remains useful as a broad audit, but it is neither the default green gate nor read-only under the current tool-surface integration design.

## 10. Tool-Surface And Other Blocker Routing

The stale content-lint count and DB-build side effect share one owner: `tests/integration/tool-surfaces.test.mjs`. The smallest next step is one docs-only boundary decision, not an immediate edit.

That decision must determine:

- whether tool execution, exact output contract, and generator output verification belong in one or separate test families;
- whether content-lint file count is an exact contract, a separately derived registration assertion, or inappropriate in a generic tool smoke;
- how DB build execution can be tested without making the default suite silently mutate ignored output, or whether the side effect should remain explicit and opt-in;
- whether scenario runner stays in the integration smoke;
- exact future focused tests and generated-output cleanup/inspection rules;
- whether a later implementation should fix only this one file or needs a tiny supporting helper/script change.

The other 14 observed full-suite failures remain untriaged. They require separate owner-specific audits or fixes and must not be bundled into the tool-surface route.

Select `Version 0.5.355 - Tool Surface Test Boundary Decision` next.

## 11. Connector Prep Disposition

`docs/design/validation-blocker-inventory.md` is superseded by this plan plus `docs/design/validation-source-map.md` for current validation routing, typecheck posture, environment distinction, and sequencing.

Retain it as historical connector prep for now. It is not a temporary artifact and deletion is outside this run's allowed changes. A later documentation cleanup may remove it only after confirming no unique historical context is still needed. Future prompts must use the source map and command matrix as current authority.

## 12. Guardrails Preserved

- No script, config, dependency, source, content, schema, validator, test, normal-lint registration, or generated output is changed.
- All authority/content/runtime gates, pauses, rejections, closures, and maturity boundaries remain intact.
- No broad typecheck cleanup, full-suite failure triage, package installation, network change, runtime, UI, save/account, gameplay, or compatibility work is authorized.
- No Deep Research, support suffix, temporary artifact, or `0.6.0` transition is needed.

## 13. Matrix Answers

1. Validation is selected by changed owner and command behavior.
2. Focused tests, standalone content lint, schema suite, and Git hygiene checks are green gates when applicable.
3. Full suite and both broad typechecks are known-failing audits, not universal gates.
4. Full suite, DB/UI builds, and Node-config typecheck have side effects that require explicit scope.
5. Focused tests must cover direct owner plus changed dependencies/consumers, not an exhaustive static catalog.
6. Baseline comparisons require the same command/context and exact summary/failure-family reporting.
7. Expected, unexpected, skipped, environment-limited, and not-run checks must be reported separately.
8. Schema suite and normal content lint serve different proof obligations and do not replace focused validation.
9. Full suite may run only under an explicit broad-regression prompt that authorizes DB build output.
10. The stale lint expectation and DB side effect should receive one narrow docs-only boundary decision.
11. The other 14 failures remain separate and untriaged.
12. The connector blocker inventory is superseded for current authority but retained as historical prep.
13. Select `Version 0.5.355 - Tool Surface Test Boundary Decision`.

## 14. Next Recommended Version

Version 0.5.355 - Tool Surface Test Boundary Decision
