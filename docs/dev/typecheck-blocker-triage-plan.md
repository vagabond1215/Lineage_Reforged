# Typecheck Blocker Triage Plan

Date: 2026-05-19
Route used: ChatGPT via GitHub Connector
Status: partially consumed temporary guardrail

0.5.74 cleanup note: Pass A is implemented by `Version 0.5.74 - Typecheck Script And Target Policy Cleanup`. Root `typecheck` now delegates to the UI app's local TypeScript target, while `typecheck:workspace` remains the broad root `tsconfig.json` audit target with known blockers. Keep this plan for the remaining JSON import, environment typing, JSX/root config, target/lib, Node/package typing, and strict optional-property cleanup tracks.

This document records a lightweight connector-only triage of workspace typecheck blockers. The original audit did not modify source files, tests, schemas, runtime behavior, content JSON, generated output, or the latest Codex handoff. The root-script routing portion has since been consumed by 0.5.74; the remaining blocker categories are still useful as planning guardrails.

## Why This Pass Was Chosen

The project is likely to revisit older and less-touched game systems soon. Before that happens, the safest lightweight pass is to isolate known workspace health blockers from feature work. The current handoff says focused tests are the confidence path, while the default UI typecheck and workspace audit still expose broad pre-existing issues. Keeping these issues separate prevents future Codex implementation prompts from confusing old typecheck noise with regressions from new gameplay work.

This should remain a separate cleanup track. Do not mix it into Backstory Legacy content, resolver integration, Bloodlines, Chronicle summary, combat, economy, or magic work unless a specific blocker directly prevents that run.

## Evidence Inspected

Original connector audit inspected:

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

0.5.74 additionally validated script routing and recorded the exact current failures in `docs/dev/current-codex-output.md`.

## Current Known Blockers After 0.5.74

- `npm.cmd run typecheck` now runs through app-local TypeScript but fails on known pre-existing UI/app strictness blockers.
- `npm.cmd run typecheck:ui` fails on the same pre-existing UI/app blockers.
- `npm.cmd run typecheck:ui:node` passes.
- `npm.cmd run typecheck:workspace` fails on broad root-audit blockers.
- First recorded default/UI blocker after 0.5.74: `src/components/TopStatusBar.tsx(118,18) TS2375` from `exactOptionalPropertyTypes` optional prop handling.
- First recorded workspace-audit blocker after 0.5.74: `apps/rpg-ui/src/features/characterPanelState.ts(13,25) TS1543`, JSON import needs a `type: "json"` import attribute under NodeNext.

## Triage Findings

### 1. Root TypeScript Tooling Was Not Installed At The Root - Consumed By 0.5.74

Original finding:

- The root `package.json` directly called `tsc --noEmit -p tsconfig.json`.
- TypeScript was declared in `apps/rpg-ui/package.json`, not in the root package.
- Root `npm.cmd run typecheck` therefore failed because `tsc` was unavailable.

0.5.74 resolution:

- Root `typecheck` now delegates to the UI app's local TypeScript target.
- `typecheck:workspace` now explicitly names the broad root `tsconfig.json` audit target.
- The command-routing problem is consumed.

Remaining concern:

- The default UI target and workspace audit target are repeatable but not green yet.
- Future prompts should not treat broad typecheck as a required passing feature gate until the remaining blocker tracks are resolved.

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

Recommended cleanup category: validation routing / workspace audit policy.

Future Codex work should preserve the target split and reduce blockers by area instead of weakening strictness.

### 3. UI App Typecheck Is Valid But Strict

The UI app defines its own `tsconfig.json` with `jsx: react-jsx`, `resolveJsonModule`, strict checks, and `types: ["vite/client"]`. Its build script runs `tsc -p tsconfig.json && vite build`, and 0.5.74 added a repeatable `typecheck` script using `--noEmit`.

Recommended cleanup category: strict UI typing cleanup.

The first known blocker after 0.5.74 is an `exactOptionalPropertyTypes` issue in `TopStatusBar.tsx`. Do not fix it as part of unrelated feature work unless the prompt explicitly scopes the typecheck cleanup.

### 4. JSON Import Attributes Are Widespread Enough To Treat As A Pattern

The inspected `packages/engines/player-engine/src/difficulty.ts` imports JSON with:

```ts
import globalRuleCatalog from "../../../content/base/game/global_rules.json" with { type: "json" };
```

Search results show this pattern appears in several engine and UI files, including `difficulty.ts`, `progression.ts`, `legacy-unlocks.ts`, `account-estate.ts`, UI presentation files, and others.

Risk: changing only one JSON import style could create inconsistent module semantics. This is a repo-pattern decision, not a drive-by patch.

Recommended cleanup category: module/JSON import policy.

Future Codex should audit TypeScript version, NodeNext/ESNext module settings, Vite support, emitted JS expectations, and test runner compatibility before changing this pattern.

### 5. Missing `process` Types Are Likely Environment Boundary Issues

`packages/engines/player-engine/src/difficulty.ts` uses both `import.meta.env` and `process.env.NODE_ENV` fallback logic in `isDevelopmentLikeEnvironment()`.

The UI tsconfig includes `vite/client` types, not Node types. The root tsconfig does not specify Node types. That makes the missing `process` type understandable.

Recommended cleanup category: environment typing.

Future Codex should choose an explicit policy:

- avoid `process` in browser-shared code,
- add a local ambient type for the exact fallback shape,
- or add `@types/node` where Node globals are genuinely intended.

Preferred direction: avoid broad Node ambient types in browser-facing code unless the repo clearly wants Node globals available everywhere.

### 6. JSX / Root Config Boundary Remains A Broad Audit Issue

The root workspace audit can encounter TSX/JSX boundary problems because root `tsconfig.json` sweeps app source without being the app's UI-local config.

Recommended cleanup category: root audit config boundary.

Future Codex should decide whether the root audit should:

- remain a broad but noisy audit target,
- use project references,
- exclude UI source and delegate to app-local checks,
- or add compatible JSX/settings if a single root sweep is truly intended.

Do not guess this in a feature prompt.

### 7. Target / Lib And Node Package Typing Remain Separate Tracks

After 0.5.74, the output recorded additional blocker categories:

- target/lib cleanup for `.at()` and `replaceAll()` usage,
- Node builtin typing for package content loaders,
- `.ts` extension import policy gaps.

Recommended cleanup category: tooling/config policy.

These are separate from feature implementation and should not be patched opportunistically in Chronicle/economy/calendar/combat/magic work.

### 8. `exactOptionalPropertyTypes` Issues Should Be Cleaned By Area, Not Globally Suppressed

The current configs intentionally enable `exactOptionalPropertyTypes`. That is a useful guardrail for save/account/runtime data, but it exposes many older optional-property patterns.

Recommended cleanup category: typed data hygiene.

Future Codex should address these by coherent area, not by turning the setting off. Suggested order:

1. UI presentation/view-model object construction.
2. account/profile and save-facing data construction.
3. engine helper return shapes.
4. content-derived projections.

Do not disable `exactOptionalPropertyTypes` as a quick fix.

## Recommended Cleanup Sequence

### Pass A - Typecheck Script And Target Policy - Consumed By 0.5.74

Status: implemented.

Keep the result in `docs/dev/current-codex-output.md` as the source of exact command outcomes.

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

### Pass D - JSX / Root Config Boundary Policy

Route: Codex 5.5 Local or Codex 5.5 Plan Mode first
Type: tooling/config policy cleanup

Goal: decide whether broad root typecheck should sweep TSX/app source directly or delegate to app-local configs.

Guardrails:

- do not weaken strictness,
- do not hide root audit failures behind a fake-green command,
- do not mix with feature work.

### Pass E - Target / Lib And Node Package Typing Cleanup

Route: Codex 5.5 Local
Type: tooling/config cleanup

Goal: resolve `.at()`, `replaceAll()`, Node builtin typing, and `.ts` extension import policy blockers through explicit config/source policy.

Guardrails:

- do not patch individual errors without a policy,
- do not add broad Node globals to browser-shared code just to silence one error.

### Pass F - Strict Optional Property Cleanup By Area

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

- Do not fold typecheck cleanup into Chronicle, economy, calendar, combat, magic, Bloodlines, Backstory Legacy, or Legacy feature passes.
- Do not disable `strict`, `noUncheckedIndexedAccess`, or `exactOptionalPropertyTypes` as a shortcut.
- Do not convert JSON imports one file at a time without a policy decision.
- Do not add broad Node globals to browser-shared code just to silence one `process` error.
- Do not update `docs/dev/current-codex-output.md` from a connector-only planning pass.
