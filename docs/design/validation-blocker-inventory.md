# Validation Blocker Inventory

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future validation/typecheck/tooling cleanup; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Inventory known validation and tooling blocker categories so future Codex runs can separate unrelated strictness/tooling debt from active feature work.

This document is a planning source. It does not authorize cleanup or implementation.

## Current Known Blocker Categories

| Category | Current posture | Boundary |
| --- | --- | --- |
| Broad UI typecheck strictness | Known pre-existing blocker category. Focused checks remain the current confidence path. | Do not fold broad typecheck cleanup into feature work. |
| Broad workspace typecheck | Known to be unsuitable as a default confidence gate while unrelated strictness debt remains. | Use focused changed-module checks unless a cleanup pass is explicitly scoped. |
| npm network certificate verification | Network package fetches may fail with certificate verification errors in some environments. | Prefer installed/local tooling; do not treat as repo source failure. |
| Git sandbox metadata permissions | Some sandbox runs may fail to write `.git/FETCH_HEAD` even when SSL is fixed. | Distinguish sandbox permissions from Git SSL or repo conflicts. |
| Content/generated drift | Generated output should not be introduced or refreshed unless explicitly scoped. | Do not add generated output during planning/source-map passes. |
| Merge-conflict markers | Must remain a hard failure in touched docs/source. | Scan touched files and relevant handoff docs. |
| Stale handoff/version docs | Current Codex output, GPT handoff, roadmap, and sequenced plan can drift. | Only update when a versioned run or explicit cleanup scopes it. |
| Connector-only prep docs | Useful planning docs but not runtime authority. | Codex should cite/use them, not treat them as implemented behavior. |

## Confidence Path Guidance

For docs-only connector prep:

- Do not run or require tests.
- Do not update `docs/dev/current-codex-output.md`.
- Do not advance roadmap versions.
- Keep commits narrow and descriptive.
- Avoid broad cleanup.

For Codex docs-only planning passes:

- `npm.cmd run tool:content-lint`
- conflict marker scan
- `git diff --check`
- only run focused tests if source/schema/test files are touched unexpectedly

For focused helper/source passes:

- focused unit tests for touched helper families
- focused TypeScript check for changed modules, if available
- content lint if content/schema or lint-adjacent support changes
- browser-safety scan if shared/UI-consumed modules change
- `git diff --check`

## Known Environment Notes

- The earlier Git SSL issue has been fixed for normal local use.
- A later Codex sandbox reported `.git/FETCH_HEAD` write failure due Git metadata permissions; that should be reported as sandbox permission behavior, not SSL.
- Some npm network fetches may still fail with certificate verification; use installed/local tooling where possible.

## Future Validation Cleanup Passes

Recommended order:

1. `Validation Source Map`
   - inspect package scripts, content lint tools, focused test commands, known typecheck blockers
   - docs-only
2. `Validation Command Matrix Plan`
   - define which validation commands apply to docs-only, helper, schema, UI, content, and generated-output runs
   - planning only
3. `Broad Typecheck Blocker Audit`
   - identify exact current broad UI/workspace typecheck errors without fixing them
   - read-only audit
4. `Focused Typecheck Routing Cleanup`
   - improve/clarify focused typecheck scripts only if needed
5. `Broad Typecheck Cleanup Sequence`
   - one blocker class at a time; no feature work mixed in

## Forbidden Until Explicitly Scoped

Do not perform as part of incidental feature work:

- broad UI typecheck cleanup
- broad workspace typecheck cleanup
- package manager/network certificate changes
- generated output refresh
- sweeping lint rewrites
- unrelated formatting churn
- roadmap version advancement
- current handoff rewrites

## Recommended Next Connector Work

The broad deferred-pillar prep set is now substantial. The next useful connector-only pass is optional:

- `Travel Knowledge And Route Source Map`

Rationale: it supports both future travel gameplay and the knowledge-domain framework, especially route/locality/biome/sea-lane domains.

## Recommended Future Codex Work

Do not schedule validation cleanup ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Validation Source Map`

It should remain docs-only/read-only and should not alter package scripts, source, tests, generated output, or dependencies.
