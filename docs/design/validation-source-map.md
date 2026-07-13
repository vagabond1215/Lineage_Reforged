# Validation Source Map

Source version/run: Version 0.5.353 - Validation Source Map
Date: 2026-07-12
Status: approved documentation-only current-source map; no cleanup or implementation permission

## 1. Source Map Result

The repository has usable focused validation, but it does not have one green, side-effect-free universal command.

- `npm.cmd run tool:content-lint` is the current green normal-content gate and validates 67 live content files plus cross-file dependencies.
- Direct `node --test <focused files>` commands are the current green scoped-test path.
- `npm.cmd test` discovers the complete Node test corpus but is currently non-green and is not strictly read-only because `tests/integration/tool-surfaces.test.mjs` executes the DB build tool.
- `npm.cmd run typecheck` and `npm.cmd run typecheck:workspace` are repeatable audit surfaces, but both currently fail on known strictness/configuration debt and are not default green gates.
- `npm.cmd run ui:build` and `npm.cmd run tool:db-build` write ignored generated output and must run only when that output is explicitly in scope.

Select docs-only `Version 0.5.354 - Validation Command Matrix Plan` next. That pass should define exact command expectations by change class, including how to report non-green audit commands and side-effectful tools. It must not change scripts, tests, configs, dependencies, or source.

## 2. Root Script Surface

| Root command | Implementation | Current role | Observed/current posture |
| --- | --- | --- | --- |
| `npm.cmd run tool:content-lint` | `node ./tools/content-lint/index.mjs` | Normal validation for registered live content and dependencies | Green; 67 files checked |
| `npm.cmd run tool:db-build` | `node ./tools/db-build/index.mjs` | Database build output generation | Side-effectful; writes ignored `packages/db/build/`; not run directly in this docs-only pass |
| `npm.cmd run tool:scenario` | `node ./tools/scenario-runner/index.mjs` | Deterministic scenario/tool smoke | Executed indirectly by full tests; not a universal validation gate |
| `npm.cmd run ui:dev` / `ui:dev:host` | App Vite dev server | Interactive local UI | Long-running and not a validation command |
| `npm.cmd run ui:preview` | App Vite preview | Generated-build preview | Requires built output; not a validation command |
| `npm.cmd run ui:build` | App `build` | UI typecheck plus generated production bundle | Side-effectful; writes ignored `apps/rpg-ui/dist/`; not run here |
| `npm.cmd run typecheck` | Alias to `typecheck:ui` | Default UI TypeScript audit | Observed exit 1 on existing strictness/type debt |
| `npm.cmd run typecheck:ui` | App `typecheck` | UI source plus imported package boundary under UI compiler settings | Same non-green audit surface as default typecheck |
| `npm.cmd run typecheck:ui:node` | App `typecheck:node` | Vite/Tailwind config TypeScript audit | Writes ignored `.tmp-rpg-ui-node.tsbuildinfo`; not run here |
| `npm.cmd run typecheck:workspace` | App-local TypeScript binary with root `tsconfig.json` | Broad `apps/**/*.ts` and `packages/**/*.ts` NodeNext strict audit | Observed exit 1 on broad existing debt |
| `npm.cmd test` | `node --test` | Full automatic Node test discovery | Observed 3,471 tests: 3,456 pass, 15 fail; also invokes side-effectful DB build through integration coverage |

There are no root scripts for formatting, ESLint, a dedicated schema-only check, a named focused-test matrix, or generated-output drift verification. Their absence is descriptive, not permission to add them.

## 3. Workspace Script And Config Boundaries

`apps/rpg-ui/package.json` exposes:

- `typecheck`: `tsc --noEmit -p tsconfig.json`;
- `typecheck:node`: `tsc --noEmit --tsBuildInfoFile ../../.tmp-rpg-ui-node.tsbuildinfo -p tsconfig.node.json`;
- `build`: `tsc -p tsconfig.json && vite build`;
- Vite `dev` and `preview` commands.

Compiler scopes are distinct:

- root `tsconfig.json` uses `NodeNext`, ES2022, strict mode, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`, and includes `apps/**/*.ts` plus `packages/**/*.ts`;
- UI `tsconfig.json` uses ESNext/Node module resolution, DOM libraries, JSX, strict mode, and the same indexed/optional strictness over `apps/rpg-ui/src`;
- UI `tsconfig.node.json` covers Vite and Tailwind config with composite output metadata.

The UI typecheck and broad workspace typecheck overlap but are not interchangeable. Their different module/lib/type contexts produce different failure classes. A future matrix must name the intended scope instead of calling either one simply “the typecheck.”

## 4. Test Surface

The repository contains 107 test files:

- 104 unit files;
- one integration file;
- two simulation files.

Major focused families cover:

- content/schema authorities and semantic validators;
- player identity, progression, resources, body state, and character creation;
- Knowledge, Legacy, account/family/estate, Chronicle, Renown, and reputation;
- magic metadata/ownership/readiness and combat hooks/spawn/equipment;
- civilization economy, settlement, spatial, trade, transport, institutions, and reputation;
- UI/presentation projection boundaries;
- deterministic scenario and save/load roundtrip behavior.

There is no named root script per focused family. Current prompts invoke one or more exact test files directly with `node --test`.

### Observed full-suite posture

The complete bounded `npm.cmd test` observation exited 1:

- 3,471 tests;
- 3,456 passed;
- 15 failed;
- zero cancelled, skipped, or todo.

Failure families were:

1. stale tool-surface content-lint output expectation (`56` expected versus current `67`);
2. two Backstory Legacy draft-content assertions;
3. one settlement simulation profile assertion;
4. four transport/runtime assertions;
5. one route-security registration assertion;
6. two region-first world assertions;
7. two Renown projection assertions;
8. two slug-content JSON BOM parse failures for flora and minerals.

This is an inventory, not a triage or fix authorization. Some failures may share causes or reflect stale expectations; no ownership decision is made beyond the explicit content-lint count mismatch.

### Full-suite side effect

`tests/integration/tool-surfaces.test.mjs` uses `spawnSync` to execute:

- content lint;
- DB build;
- scenario runner.

Therefore `npm.cmd test` can refresh ignored `packages/db/build/`. It must not be described as a purely read-only gate. The source-map run discovered this only after invoking the default suite; no generated files are tracked or included in the patch, and no cleanup was attempted because existing ignored output belongs to the workspace.

## 5. Normal Content-Lint Ownership

`tools/content-lint/index.mjs` currently registers 67 live files across:

- world identity, ecology, geography, maps, settlements, routes, transport, monsters, encounters, spawn, religion, magic infrastructure, resources, commodities, polities, and map/place authority;
- civilization economy, workplaces, buildings, infrastructure, services, guilds, quests, market values, and production;
- player attributes, skills, abilities, spells, traits, backstories, starting bundles, progression, Knowledge, trials, titles, and Legacy;
- item, crafting, global-rule, combat-role, tactics, and combat-health content.

The entrypoint combines three responsibilities:

1. JSON parse/schema validation for the registered `checks` list;
2. inline semantic validation for long-established content families;
3. imported focused pure validators and cross-file dependency checks for newer authority families.

There are 41 files under `tools/content-lint/`, including the entrypoint and focused helpers. Some helpers protect future schemas or fixture-only authorities without normal live registration; existence of a helper does not imply live content or index ownership.

The normal lint command is green in isolation. The integration test is stale because it hardcodes `content-lint: ok (56 files checked)` while the entrypoint now reports 67.

## 6. Schema Validation

There is no dedicated schema command. Current schema evidence is split between:

- normal content lint loading schemas for registered live files;
- focused validator tests using schemas and in-memory fixtures;
- `tests/unit/schema-files.test.mjs` parsing all schema files and checking selected cross-schema/policy relationships.

The required schema suite passed with 105 tests in this run. Schema changes should therefore use the exact focused validator family plus `schema-files.test.mjs`; content changes also require normal content lint.

## 7. Typecheck Posture

### Default/UI typecheck

`npm.cmd run typecheck` exited 1. Observed failures span UI components/panels, optional-property handling, indexed access, and imported package code under UI compiler libraries/types. Representative categories include:

- `exactOptionalPropertyTypes` mismatches;
- possibly undefined indexed/list access;
- missing Node globals/types in UI compilation context;
- library target gaps such as `Array.prototype.at`;
- unresolved or incompatible shared/engine types.

### Workspace typecheck

`npm.cmd run typecheck:workspace` exited 1. It uses the root NodeNext configuration and reports a broader set including:

- JSON import-attribute and TypeScript extension/module-mode issues;
- missing Node type declarations;
- JSX context gaps for `.tsx` imports under the root config;
- strict optional/indexed access failures;
- engine/shared type mismatches and unresolved names.

Both are useful audit surfaces, but neither is a current pass/fail gate for unrelated docs or narrow feature work. The failure sets are too broad for incidental cleanup and require a dedicated later blocker audit before implementation sequencing.

`typecheck:ui:node` was not run because its configured build-info output makes it non-read-only for this pass.

## 8. Change-Class Confidence Routing

This is current descriptive routing, pending the dedicated matrix plan:

| Change class | Minimum current evidence | Conditional evidence | Avoid by default |
| --- | --- | --- | --- |
| Docs-only | `git diff --check`, conflict-marker/scope/status checks | Content lint or focused tests only when coordination rules require them | Full suite, builds, broad typechecks |
| Content JSON | Relevant focused validator test plus normal content lint | Schema suite when shape/schema is involved | UI/DB builds unless consumer output is scoped |
| Schema/validator | Exact focused validator test plus schema suite | Normal content lint when live registered content is affected | Unrelated full suite |
| Helper/runtime | Exact owner-focused unit/simulation tests | Content lint for content dependencies; typecheck as non-green audit if directly useful | Treating broad typecheck debt as caused by the patch without baseline comparison |
| UI/presentation | Exact presentation/component-adjacent tests | UI typecheck as an audit; UI build only when generated bundle is explicitly scoped | Editing or refreshing `dist` incidentally |
| Save/account/high-risk | Exact owner, roundtrip, lifecycle, and regression suites selected by the prompt | Broader tests only with known baseline and side-effect review | Generic full-suite success claim |
| Generated output | Source checks first, then the owning generator/build under explicit scope | Diff/artifact verification after generation | Hand-editing ignored/generated output |

## 9. Environment Versus Repository Defects

- Git fetch/pull may require permission to write `.git` metadata in the managed sandbox; that is environment policy, not repository failure.
- Historical npm certificate/network failures remain environment notes. No network-dependent command was attempted.
- `node_modules`, UI `dist`, DB `build`, logs, and `.tmp*` are ignored workspace artifacts. Presence alone is not a tracked-source defect.
- A command that writes ignored output can still violate a docs-only or read-only run boundary even when `git status` remains clean.
- The stale `56` content-lint expectation is repository test drift because the isolated command consistently reports the current registered count of 67.
- Broad typecheck failures are repository/configuration debt, but this source map does not assign fix priority or causal grouping.

## 10. Ambiguities And Gaps

1. No durable command matrix states required checks by change class.
2. `npm test` appears universal but is non-green and side-effectful.
3. The tool-surface integration test hardcodes a stale checked-file count.
4. Root documentation calls `typecheck:workspace` broad, but the exact distinction from UI typecheck is not summarized in one durable matrix.
5. No script exposes schema-only validation or named focused suites.
6. Generated-output commands are mixed into the same script namespace as read-only validation without side-effect labels.
7. No baseline policy explains when a known-failing audit command must be rerun and how its output should be compared.
8. Focused test selection is prompt-specific and relies on maintainer knowledge.

These gaps justify planning, not implementation.

## 11. Connector Prep Disposition

`docs/design/validation-blocker-inventory.md` remains useful as the historical connector-side blocker and sequencing source. This source map supersedes it for exact current command, test-count, content-lint, typecheck, and side-effect posture.

Do not delete the prep document now. A later command-matrix plan should promote any remaining durable environment and cleanup-sequence guidance, then make an explicit keep/supersede/cleanup recommendation. Deletion was not allowed in this run.

## 12. Next Route

Select `Version 0.5.354 - Validation Command Matrix Plan`.

That docs-only pass should define:

- exact minimum, conditional, and prohibited commands by change class;
- green gate versus known-failing audit semantics;
- focused-test selection and baseline reporting rules;
- side-effect classification for build/generator/tool commands;
- generated-output and environment-failure reporting;
- treatment of the stale tool-surface expectation and other discovered blockers without fixing them;
- whether the connector prep is fully superseded.

It must not edit package scripts, tests, configs, dependencies, source, schemas, content, generated output, runtime, UI, or save/account behavior.

## 13. Explicit Non-Goals

- no test, typecheck, content-lint, script, config, dependency, source, schema, content, generated-output, or tooling fix;
- no full-suite failure triage beyond family classification;
- no package installation, network/certificate change, Git configuration change, UI/DB build refresh, or ignored-artifact cleanup;
- no gated-lane reopening, canon/id work, runtime, UI, save/account, gameplay, Deep Research, support suffix, or `0.6.0` transition.

## 14. Source Map Answers

1. The reliable green path is focused tests plus standalone normal content lint.
2. Normal content lint passes with 67 registered files.
3. The schema suite passes with 105 tests.
4. The full default suite is non-green: 3,456 of 3,471 passed and 15 failed.
5. The full suite is side-effectful because tool-surface integration executes DB build.
6. Default/UI and workspace typechecks both fail on existing broad debt and are audit surfaces, not universal gates.
7. UI and DB builds write ignored generated output and require explicit scope.
8. Environment permission/network failures must remain distinct from repository defects.
9. The connector prep remains historically useful but is superseded here for exact current posture.
10. A docs-only Validation Command Matrix Plan is the one justified next route.

## 15. Next Recommended Version

Version 0.5.354 - Validation Command Matrix Plan
