# JavaScript/TypeScript Mirror, Public Export, And Import-Specifier Integrity Audit

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only, documentation-only source audit; no local build, typecheck, test, module-resolution execution, generated-output check, or source edit

## Purpose

Map the repository’s TypeScript implementation, JavaScript forwarding-shim, public export, `.js` import-specifier, and test-import posture before future engine module additions, renames, moves, or public API changes.

This audit does not authorize module conversion, export cleanup, package configuration changes, generated files, or mirror deletion.

## Current Classification

`TYPESCRIPT_IMPLEMENTATIONS_WITH_JAVASCRIPT_FORWARDING_SHIMS_AND_DOT_JS_IMPORTS`

The repository is TypeScript-first, uses ESM package posture, and commonly imports local modules with `.js` specifiers. Source directories also contain one-line JavaScript forwarding modules such as:

```js
export * from "./campaign-session.ts";
```

and public forwarding entrypoints such as:

```js
export * from "./index.ts";
```

UI and tests can therefore reference `.js` paths while the development toolchain resolves TypeScript implementations.

## Current Surface Types

| Surface | Typical role | Integrity requirement |
| --- | --- | --- |
| `*.ts` implementation | authoritative typed source | compile/type behavior and direct exports correct |
| one-line `*.js` forwarding shim | ESM-compatible `.js` specifier target | points to exact TypeScript implementation and stays source-only |
| package `index.ts` | public typed API | exports every intended owner and no unintended internal surface |
| package `index.js` | `.js` public forwarding entry | forwards to exact `index.ts` |
| UI `.js` imports | application source imports | resolve under current TypeScript/Vite configuration |
| Node tests `.js` imports | runtime test entry | resolve through supported loader/tooling posture |
| content-lint/tool `.mjs` imports | executable Node tooling | must target actual JavaScript or supported source posture |

## Current Risks

1. Adding a TypeScript module but omitting the expected `.js` forwarding shim.
2. Adding implementation and shim but omitting the package public export.
3. Exporting from `index.ts` but not providing a reachable `.js` import path expected by callers.
4. Renaming a file while leaving UI or tests on the old `.js` specifier.
5. Creating a forwarding cycle or shim that points to a missing TypeScript file.
6. Adding a second implementation in `.js` that drifts from the TypeScript authority.
7. Treating editor type resolution as proof that Node, Vite, and test runtime resolution agree.
8. Forgetting exact optional/type-only export behavior when a public contract changes.
9. Updating a package index without checking all direct internal imports and public consumers.
10. Claiming mirror integrity without build/typecheck/test execution.

## Recent Persistence Surface

The public game-engine entrypoint exports current campaign rules, session admission, account publication, Normal defeat/recovery, travel, quest acceptance/tracking, activity selection, account/Legacy, combat, magic, and other owners.

Recent persistence modules such as `campaign-session.ts` use matching JavaScript forwarding shims. Connector inspection confirms the source shape, but cannot prove runtime resolution, export completeness, or absence of stale imports without local commands.

## Required Future Module-Change Gate

Any production package that adds, renames, moves, or removes an engine module should verify:

1. authoritative TypeScript implementation path;
2. whether a JavaScript forwarding shim is required and exact;
3. public `index.ts` and `index.js` reachability;
4. direct UI, test, tool, and package imports;
5. type-only versus runtime exports;
6. no duplicate implementation in shim files;
7. no stale or cyclic specifiers;
8. focused import smoke tests;
9. prescribed build and typecheck commands;
10. complete diff inspection for generated or accidental output.

## Suggested Local Audit Commands

A future authenticated local pass should combine:

- repository search for paired `.ts`/`.js` modules;
- detection of one-line shims with missing targets;
- public-export comparison against intended modules;
- search for imports of changed paths;
- focused Node import smoke tests;
- UI production build;
- bounded TypeScript audit;
- prescribed unit tests;
- `git diff --check` and generated-output inspection.

The exact command set must follow then-current repository authority rather than this connector-only document.

## Named Consumers

Future work must inspect this audit when it covers:

- a new engine module;
- module rename or move;
- public API/export changes;
- `.js` import-specifier changes;
- JavaScript forwarding-shim cleanup;
- acceptance audits involving engine source integration.

## Review Trigger

Re-review at the next production package changing engine modules, exports, import paths, package entrypoints, or JavaScript/TypeScript mirror posture.

## Exclusions

No implementation, shim, export, import, package configuration, tests, generated output, active prompt, roadmap, backlog, or branch register changed in this pass.
