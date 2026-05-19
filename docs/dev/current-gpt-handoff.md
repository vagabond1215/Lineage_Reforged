# Current GPT Handoff

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Branch/status assumption: GitHub `master` inspected through the connector. No local commands, tests, builds, or typechecks were run by this pass.

## Purpose

This file is the current repo-readable handoff from ChatGPT/GitHub Connector work to future Codex work. It should contain only findings, instructions, and follow-up context that remain pertinent for future development.

This is not a transcript and should not accumulate old conversation history. Update this file by pruning or replacing stale entries when new repository work supersedes them.

## Authority Rules

- `docs/dev/current-codex-output.md` remains the exact latest Codex implementation handoff.
- This file records connector-side audit/planning findings and instructions that Codex should consider before future runs.
- `docs/dev/project-vision-and-continuity-brief.md` remains the strategic vision source.
- `docs/dev/project-roadmap.md` remains the long-term version and playability checkpoint roadmap.
- If this file conflicts with a newer Codex handoff, trust the newer Codex handoff for exact implementation state and update this file.
- Do not update `docs/dev/current-codex-output.md` from a GPT/GitHub Connector planning pass.

## Current Relevant Connector Work

### Long-Term Roadmap Added

Created `docs/dev/project-roadmap.md`.

Relevant findings:

- No existing docs roadmap was found before creation.
- The roadmap uses existing `AGENTS.md` version-band rules rather than inventing a separate release scheme.
- `v0.6.x` remains runtime ownership transition.
- `v0.7.x` remains integrated gameplay systems.
- `v0.8.x` remains pre-alpha vertical-slice hardening.
- `v0.9.x` remains alpha-readiness stabilization.
- Current active anchor remains `Version 0.5.63 - Backstory Legacy Purchase Runtime Shape` landed and `Version 0.5.64 - Backstory Legacy Purchase Content Draft` next.

Connector-created commit:

- `eedf1097a5334a7825a763a9a877c07a4f127231`

### Typecheck Blocker Triage Folded Into Handoff

The standalone `docs/dev/typecheck-blocker-triage-plan.md` was removed after its useful findings were folded into this current handoff. Do not look for that deleted file in future Codex work.

Relevant findings to preserve:

- Root `package.json` defines `typecheck` as `tsc --noEmit -p tsconfig.json`.
- TypeScript is declared in `apps/rpg-ui/package.json`, not root `package.json`, matching the current Codex handoff's root `tsc` unavailable blocker.
- Root `tsconfig.json` performs a broad strict sweep over `apps/**/*.ts` and `packages/**/*.ts`.
- UI has its own Vite/React-oriented `apps/rpg-ui/tsconfig.json`, so root typecheck target policy likely needs clarification rather than blunt config changes.
- JSON import attributes appear as a repo pattern and should not be changed one file at a time without a policy decision.
- Missing `process` type errors likely come from shared/browser-facing code using `process.env` fallback logic without a clear environment typing policy.
- `exactOptionalPropertyTypes` issues should be cleaned by area, not suppressed globally.

Connector-created commits:

- `e289b82c1e3a0d5305898324888db5eb0fa60f00` created the temporary triage plan.
- `1e13bfde5a093fa147c488ab546f50251664124e` removed the temporary triage plan after folding its useful findings into this handoff.

### `0.5.64` Content Exposure Audit Folded Into Handoff

Ran a connector-only exposure audit for `Version 0.5.64 - Backstory Legacy Purchase Content Draft`.

Relevant findings to preserve:

- `packages/content/base/player/legacy_unlocks.json` is a live catalog, not a hidden draft catalog.
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts` builds Legacy entries from `resolveLegacyUnlockStates(profile)`, which maps all known Legacy definitions into account-meta view models.
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx` renders a purchase button when `entry.catalogCanPurchase` is true and an `onPurchaseUnlock` handler exists.
- `apps/rpg-ui/src/App.tsx` wires `onPurchaseLegacyUnlock` to `purchaseLegacyUnlock(...)` and persists the result in the account profile.
- `packages/engines/game-engine/src/legacy-unlocks.ts` validates metadata fields such as `scope`, `currency`, `purchaseMode`, and `implementationPriority`, but current purchase resolution does not use `implementationPriority`, `scope`, `currency`, or `purchaseMode` as hard visibility/purchase gates in `resolveLegacyUnlockStates` or `purchaseLegacyUnlock`.
- `implementationPriority: "catalog_only"` or `"backlog"` is therefore not, by itself, enough to hide or block a new record from the Legacy UI/purchase path.
- `resolveLegacyCharacterStartBonuses(...)` does check for a narrow live character-start shape before applying start bonuses, so accidental start-resource effects are less likely than accidental Legacy UI visibility/purchasability.
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts` filters Backstory Legacy purchase candidates by tags `backstory`, `backstory_legacy`, or `origin`; missing scope defaults to account scope, so family-scoped records must explicitly declare `scope: "family"`.
- The current creator path in `characterCreationCatalog.ts` only builds resolver evidence from `selectedBackstoryId`, `accountId`, and `sourceRunIds`. It does not pass `legacyPurchaseIds`, `familyId`, or call `resolveOwnedBackstoryLegacyPurchaseIds(...)`, so content-only records will not unlock creator backstories yet.

Instruction for future `0.5.64` Codex prompt:

A pure live-content-only edit to `packages/content/base/player/legacy_unlocks.json` is not safe if the acceptance criteria still require no visible Legacy UI or purchase behavior change. Choose one of these approaches explicitly:

1. Keep `0.5.64` as a draft-only content pass outside the live imported Legacy catalog, such as a non-runtime design/draft catalog, and add tests/docs proving it is not imported at runtime.
2. Re-scope `0.5.64` to add a minimal Legacy catalog guard before or alongside records: backstory-tagged records that are `catalog_only`/`backlog` must not appear in the account-meta purchase list and must not be purchasable through `purchaseLegacyUnlock(...)` until the approved purchase surface exists.
3. If live `legacy_unlocks.json` records are added without a visibility/purchase guard, the pass must acknowledge that it changes Legacy UI visibility. That conflicts with the current no-visible-change guardrail and should not be the default.

Minimum acceptance criteria if live Backstory Legacy records are added:

- New records must use deliberate tags: include `backstory` or `backstory_legacy` only when they are intentionally candidates for `resolveOwnedBackstoryLegacyPurchaseIds(...)`.
- Family-scoped records must declare `scope: "family"`; do not rely on missing scope because the helper treats missing scope as account-scoped.
- Unsupported scopes such as `region`, `heir_only`, `next_run`, `character_start`, or `catalog_only` must remain unsupported by the Backstory purchase evidence helper unless their storage owner exists.
- Add or update tests proving backstory-tagged catalog-only/backlog records do not become purchase buttons in account meta unless intentionally exposed.
- Add or update tests proving `purchaseLegacyUnlock(...)` rejects hidden/backlog/catalog-only Backstory Legacy records if they are not meant to be purchasable yet.
- Add or update tests proving creator availability does not change and the creator still does not receive fabricated `legacyPurchaseIds` or `familyId`.
- Do not wire resolver integration, creator availability, family prestige spending, Legacy purchase UI, family tree, heirs, heirlooms, bequests, Chronicle Marks, or Lineage Seals unless explicitly re-scoped.

Connector-created commit:

- Pending this handoff update commit.

## Current Pipeline Reminder

Keep the active implementation pipeline intact unless a newer handoff supersedes it:

1. `Version 0.5.64 - Backstory Legacy Purchase Content Draft`
2. `Version 0.5.65 - Backstory Legacy Purchase Resolver Integration`
3. `Version 0.5.66 - Heirloom And Bequest Systems Plan`
4. `Version 0.5.67 - Bloodlines View Model Implementation Plan`
5. `Version 0.5.68 - Bloodlines Read-Only Account Meta UI`

Important refinement: `0.5.64` should not be a naive live `legacy_unlocks.json` content-only pass. Either keep records draft-only, or include the minimal guard that prevents backstory-tagged catalog-only/backlog records from becoming visible/purchasable in the existing Legacy UI.

## Instructions For Future Codex Runs

Before substantial Codex work, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-vision-and-continuity-brief.md` when strategic direction matters
- `docs/dev/project-roadmap.md` when version ordering, playability checkpoints, or tool routing matter
- `docs/future_content_backlog.md` when scope, deferred systems, or content ownership matters

Do not treat this file as permission to implement broad cleanup or feature work. Use it to avoid repeating connector-side analysis and to keep future prompts narrower.

## Near-Term Guidance

### Keep `0.5.64` Focused But Safe

`Version 0.5.64 - Backstory Legacy Purchase Content Draft` should remain safe catalog authoring only, with the exposure guard above applied:

- deliberate tags and scopes
- no accidental live purchase exposure
- no resolver integration
- no creator-visible behavior change
- unsupported scopes remain inert or warned
- no Family Prestige earn/spend behavior
- no family tree, heirs, heirlooms, bequests, Chronicle Marks, or Lineage Seals

If the records are placed in the live Legacy catalog, add the minimal visibility/purchase guard as part of the same run or delay live catalog insertion.

### Keep Typecheck Cleanup Separate

Typecheck cleanup should not be folded into `0.5.64` or `0.5.65` unless a specific touched file blocks that run.

Recommended future cleanup candidate:

`Version 0.5.69 - Typecheck Script And Target Policy Cleanup`

Route: Codex 5.5 Local

Goal: make typecheck commands honest and repeatable without weakening strictness.

Do not disable `strict`, `noUncheckedIndexedAccess`, or `exactOptionalPropertyTypes` as a shortcut.

### Useful GPT/GitHub Connector Passes Still Available

These remain light enough for GPT/GitHub Connector before Codex implementation work:

- `0.5.65` Family Context Seam Plan
- Creator Terminology Drift Audit
- Backlog Superseded-Ordering Cleanup Plan
- Bloodlines Information Architecture Audit
- Heirloom vs Bequest Vocabulary Audit
- Chronicle Run-End Summary Source Audit
- Combat Audit Scoping Pass
- Magic Runtime Readiness Audit
- Economy Clarity Audit
- Calendar / Climate Popup IA Audit
- Prompt Template Hardening Pass

Escalate to Codex Local when files must be edited beyond docs, validation must be run, or runtime/source/content/schema/UI behavior changes.

## Maintenance Rules For This File

- Update this file after meaningful GPT/GitHub Connector, Deep Research, or Agent Mode work that affects repo direction, prompts, risks, or future Codex instructions.
- Prefer replacing stale sections over appending indefinitely.
- Remove findings once they are implemented, superseded, or no longer useful.
- Keep exact historical detail in git commits, not in this file.
- Do not record every small conversation note here.
- Keep this file short enough for Codex to read at the start of a run without wasting context.
