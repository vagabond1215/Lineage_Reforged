# Typecheck Blocker Triage Plan

Date: 2026-05-19
Route used: ChatGPT via GitHub Connector
Status: Planning / audit only

This document records a lightweight connector-only triage of current workspace typecheck blockers. It does not modify source files, tests, schemas, runtime behavior, content JSON, generated output, or the latest Codex handoff.

## Why This Pass Was Chosen

The project is likely to revisit older and less-touched game systems soon. Before that happens, the safest lightweight pass is to isolate known workspace health blockers from feature work. The current handoff says focused tests are passing, but workspace-wide typecheck still fails for tooling and broad pre-existing issues. Keeping these issues separate prevents future Codex implementation prompts from confusing old typecheck noise with regressions from new gameplay work.

This should remain a separate cleanup track. Do not mix it into Backstory Legacy content, resolver integration, Bloodlines, combat, economy, or magic work unless a specific blocker directly prevents that run.

## Evidence Inspected

- `docs/dev/project-roadmap.md`
- `docs/dev/current-codex-output.md`
- `package.json`
- `tsconfig.json`
- `apps/rpg-ui/package.json`
- `apps/rpg-ui/tsconfig.json`
- `apps/rpg-ui/tsconfig.node.json`
- `apps/rpg-ui/src/features/characterPanelState.ts`
- `packages/engines/player-engine/src/difficulty.ts`
- repo search results for `with { type: json }`
- repo search results for `process.env`

## Current Known Blockers

The latest handoff reports:

- `npm.cmd run typecheck` failed because root `tsc` is not available in PATH.
- `.\apps\rpg-ui\node_modules\.bin\tsc.cmd --noEmit -p tsconfig.json` failed on broad pre-existing workspace issues.
- First reported issue categories included JSON import attributes in `apps/rpg-ui/src/features/characterPanelState.ts`, missing `process` types, JSX config, and many existing `exactOptionalPropertyTypes` / type issues.
- No typecheck errors were reported for the files changed in `Version 0.5.63 - Backstory Legacy Purchase Runtime Shape`.

## Triage Findings

### 1. Root TypeScript Tooling Is Not Installed At The Root

The root `package.json` defines:

```json
"typecheck": "tsc --noEmit -p tsconfig.json"
```

But TypeScript is declared in `apps/rpg-ui/package.json`, not in the root package. That matches the current handoff report that root `tsc` is unavailable.

Recommended cleanup category: tooling / workspace configuration.

Do not solve this by weakening typecheck. Use one of these explicit strategies in a later Codex run:

1. Add root TypeScript tooling intentionally if the repo wants root-level typecheck to be authoritative.
2. Change root `typecheck` to delegate to package-local checks if that is the intended workspace model.
3. Split typecheck scripts into named targets, such as `typecheck:root`, `typecheck:ui`, and future package-level checks.

Preferred direction: split scripts and make the intended root behavior explicit. This avoids pretending the repo already has a monorepo package-manager workspace when it currently appears script-driven.

### 2. Root Tsconfig Is A Broad Strict Sweep

Root `tsconfig.json` includes:

```json
"include": [
  "apps/**/*.ts",
  "packages/**/*.ts"
]
```

It uses strict settings including `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. This is good for long-term health, but it means root typecheck behaves like a broad workspace audit across UI and engine/package code.

Risk: broad typecheck can be too noisy to use as the required validation gate for narrow gameplay patches until the backlog is cleaned.

Recommended cleanup category: validation routing.

Later Codex work should separate:

- focused tests required for each feature pass
- package/app typecheck targets
- eventual workspace-wide typecheck once known blockers are addressed

### 3. UI App Typecheck Is Valid But Strict

The UI app defines its own `tsconfig.json` with `jsx: react-jsx`, `resolveJsonModule`, strict checks, and `types: ["vite/client"]`. Its build script runs `tsc -p tsconfig.json && vite build`.

This suggests UI-local JSX configuration exists. If a root command reports JSX config issues, the likely cause is that root `tsconfig.json` is sweeping app source without inheriting UI app JSX settings or the error is from TSX files reached through imports.

Recommended cleanup category: config boundary.

Later Codex should determine whether root typecheck should:

- reference app configs using TypeScript project references,
- exclude UI app source from root sweep and delegate to `npm --prefix ./apps/rpg-ui run build`, or
- add compatible root JSX/settings if a single root sweep is truly desired.

Do not guess this in a feature prompt.

### 4. JSON Import Attributes Are Widespread Enough To Treat As A Pattern

The inspected `packages/engines/player-engine/src/difficulty.ts` imports JSON with:

```ts
import globalRuleCatalog from "../../../content/base/game/global_rules.json" with { type: "json" };
```

Search results show this pattern appears in several engine and UI files, including `difficulty.ts`, `progression.ts`, `legacy-unlocks.ts`, `account-estate.ts`, UI presentation files, and others.

Risk: changing only one JSON import style could create inconsistent module semantics. This is a repo-pattern decision, not a drive-by patch.

Recommended cleanup category: module/JSON import policy.

Later Codex should audit TypeScript version, NodeNext/ESNext module settings, Vite support, emitted JS expectations, and test runner compatibility before changing this pattern.

### 5. Missing `process` Types Are Likely Environment Boundary Issues

`packages/engines/player-engine/src/difficulty.ts` uses both `import.meta.env` and `process.env.NODE_ENV` fallback logic in `isDevelopmentLikeEnvironment()`.

The UI tsconfig includes `vite/client` types, not Node types. The root tsconfig does not specify Node types. That makes the missing `process` type understandable.

Recommended cleanup category: environment typing.

Later Codex should choose an explicit policy:

- avoid `process` in browser-shared code,
- add a local ambient type for the exact fallback shape,
- or add `@types/node` where Node globals are genuinely intended.

Preferred direction: avoid broad Node ambient types in browser-facing code unless the repo clearly wants Node globals available everywhere.

### 6. `exactOptionalPropertyTypes` Issues Should Be Cleaned By Area, Not Globally Suppressed

The current configs intentionally enable `exactOptionalPropertyTypes`. That is a useful guardrail for save/account/runtime data, but it can expose many older optional-property patterns.

Recommended cleanup category: typed data hygiene.

Later Codex should address these by coherent area, not by turning the setting off. Suggested order:

1. UI presentation/view-model object construction.
2. account/profile and save-facing data construction.
3. engine helper return shapes.
4. content-derived projections.

Do not disable `exactOptionalPropertyTypes` as a quick fix.

## Recommended Cleanup Sequence

### Pass A - Typecheck Script And Target Policy

Route: Codex 5.5 Local
Type: tooling/config cleanup

Goal: make typecheck commands honest and repeatable without weakening strictness.

Likely files:

- `package.json`
- `tsconfig.json`
- `apps/rpg-ui/package.json`
- `apps/rpg-ui/tsconfig.json`
- `apps/rpg-ui/tsconfig.node.json`
- possibly a new docs note if needed

Allowed changes:

- clarify root typecheck target behavior
- add or delegate TypeScript tool usage intentionally
- add named typecheck scripts if useful
- document known limitations

Forbidden changes:

- no gameplay source edits
- no schema/content JSON edits
- no resolver/Legacy/account behavior changes
- no disabling strictness just to pass
- no generated output rebuild unless explicitly required

Validation:

- run the new or updated typecheck scripts and record exact results
- run `npm.cmd run tool:content-lint` only if package script changes could affect tooling assumptions
- run `git diff --check`

### Pass B - JSON Import Attribute Policy Audit / Cleanup

Route: Codex 5.5 Local, or Codex 5.5 Plan Mode first if uncertainty remains
Type: module/config cleanup

Goal: decide and normalize the repo policy for JSON imports across NodeNext, Vite, and tests.

Likely files:

- `tsconfig.json`
- `apps/rpg-ui/tsconfig.json`
- representative files using JSON imports with attributes
- tests/tooling files if impacted

Forbidden changes:

- no content record changes
- no runtime semantic changes
- no ad hoc conversion of only one file

Validation:

- relevant typecheck target(s)
- focused tests if imports are touched
- content lint if runtime content import paths are touched

### Pass C - Environment Typing Cleanup

Route: Codex 5.5 Local
Type: typed environment boundary cleanup

Goal: remove or explicitly type `process.env` usage in browser/shared code.

Likely starting point:

- `packages/engines/player-engine/src/difficulty.ts`
- search results for `process.env`

Preferred approach:

- keep browser-facing code from depending on broad Node globals where possible
- use narrow local guards or Vite-compatible environment access if appropriate

Validation:

- affected package/app typecheck
- focused tests around difficulty behavior if logic changes

### Pass D - Strict Optional Property Cleanup By Area

Route: Codex 5.5 Local
Type: typed data hygiene

Goal: reduce broad `exactOptionalPropertyTypes` errors without weakening compiler settings.

Recommended ordering:

1. UI presentation/view-model constructors.
2. account/profile/save-facing constructors.
3. engine helper return shapes.
4. content-derived projections.

Guardrail:

- do not alter runtime behavior while fixing object shape typing unless a test makes the change explicit.

## What Should Not Happen

- Do not fold typecheck cleanup into `0.5.64` Backstory Legacy Purchase Content Draft.
- Do not fold typecheck cleanup into `0.5.65` Backstory Legacy Purchase Resolver Integration unless the specific touched files require it.
- Do not disable `strict`, `noUncheckedIndexedAccess`, or `exactOptionalPropertyTypes` as a shortcut.
- Do not convert JSON imports one file at a time without a policy decision.
- Do not add broad Node globals to browser-shared code just to silence one `process` error.
- Do not update `docs/dev/current-codex-output.md` from a connector-only planning pass.

## Recommendation

Keep the active `0.5.64` pipeline intact, but add a separate near-term cleanup prompt after either `0.5.64` or `0.5.65`:

`Version 0.5.69 - Typecheck Script And Target Policy Cleanup`

This should be a Codex Local run, not another connector-only pass, because it must run commands and verify the resulting typecheck targets. The goal is not to make the whole repo perfect in one patch. The goal is to make typecheck routing honest, repeatable, and less confusing before broader work re-enters older systems.

Suggested follow-up after that:

- `Version 0.5.70 - JSON Import And Environment Typing Cleanup Plan` if the first cleanup exposes module/env blockers as the next top layer.
- Continue feature pipeline separately unless typecheck blockers directly obstruct a feature run.
