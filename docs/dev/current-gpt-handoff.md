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

- `5ef946fd9eaaf1ae23de3e0c8196d778b3d0acd3`

### `0.5.65` Family Context Seam Audit Folded Into Handoff

Ran a connector-only seam audit for `Version 0.5.65 - Backstory Legacy Purchase Resolver Integration`.

Relevant findings to preserve:

- `packages/engines/game-engine/src/backstory-eligibility.ts` already has the evidence fields needed for purchase-aware resolution: `accountId`, `familyId`, `lineageId`, `sourceRunIds`, `regionId`, `legacyPurchaseIds`, `evidenceRecords`, `prestigeRecords`, `echoRecords`, and `selectedBackstoryId`.
- The resolver's `legacyPurchasePasses(...)` checks that the required scope owner is present, then checks whether `input.legacyPurchaseIds` includes the required unlock id. It does not independently verify that a listed purchase id came from the correct account/family owner.
- Therefore, the caller that builds `legacyPurchaseIds` is the trust boundary. Do not hand-copy ids from account storage into resolver evidence. Use `resolveOwnedBackstoryLegacyPurchaseIds(...)` or an equivalent scoped helper.
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts` is already the right ownership collector for this pass. It uses runtime Legacy definitions, filters only backstory-tagged definitions, resolves account-owned ids from `profile.legacy.legacyUnlocks`, resolves family-owned ids only for a matching explicit `familyId`, and warns/excludes unsupported scopes.
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts` currently defines `BackstoryCreatorAvailabilityOptions` with only `accountId`, `selectedBackstoryId`, and `sourceRunIds`.
- `buildBackstoryEligibilityEvidenceInput(...)` currently copies only those three fields into resolver evidence.
- `getBackstoryOptionsForSelection(...)` is a clean narrow seam: it already accepts `availabilityOptions`, builds resolver evidence, calls `resolveBackstoryEligibility(...)`, and projects creator-facing backstory cards.
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx` currently builds `backstoryAvailabilityOptions` from `form.backstoryId`, `accountProfile.accountId`, and `form.sourceRunId`, then passes them to `getBackstoryOptionsForSelection(...)`.
- Current family ownership storage can prove family unlocks if a specific `familyId` is known, but no active family-selection UI or obvious creator-family context exists yet.
- Retired/source-run inheritance has a `sourceRunId` seam through `resolveEligibleHeirSources(...)` and `resolveHeirSourceById(...)`, but those records are not the same thing as a family id.

Instruction for future `0.5.65` Codex prompt:

`0.5.65` should be a caller-seam integration, not a resolver redesign.

Recommended safe implementation shape:

1. Extend `BackstoryCreatorAvailabilityOptions` to accept optional `legacyPurchaseIds`, `familyId`, `regionId`, and maybe warning passthrough only if needed.
2. Update `buildBackstoryEligibilityEvidenceInput(...)` to copy those optional fields into `BackstoryEligibilityEvidenceInput` using the same trim/empty filtering pattern already used for `accountId` and `sourceRunIds`.
3. Add a small pure helper for deriving creator purchase evidence from `AccountProfileState` plus runtime Legacy definitions. It should call `resolveOwnedBackstoryLegacyPurchaseIds(...)` instead of fabricating ids.
4. In the current creator UI path, do not invent a `familyId`. Until a real family-selection/Bloodlines context exists, pass account-scoped purchases only or leave `familyId` absent.
5. If `familyId` is absent, family-scoped owned purchases must not unlock backstories. Warnings are acceptable; fabricated family evidence is not.
6. Do not add a family picker, Bloodlines UI, family management, Family Prestige spending, or automatic family creation as part of `0.5.65`.
7. Keep resolver policy semantics unchanged unless a test proves the existing contract is wrong.

Minimum acceptance criteria for `0.5.65`:

- Tests prove `buildBackstoryEligibilityEvidenceInput(...)` carries `legacyPurchaseIds` and `familyId` only when explicitly supplied.
- Tests prove account-scoped backstory purchases can satisfy a resolver rule only when collected by the ownership helper and passed into the resolver.
- Tests prove family-scoped purchases do not satisfy rules without a matching explicit `familyId`.
- Tests prove wrong-family ownership does not unlock a backstory.
- Tests prove unsupported scoped purchases still warn/exclude rather than unlock.
- Tests prove source-run/heir selection alone does not imply family purchase ownership.
- Tests prove selected-backstory effects still apply only for the selected backstory and do not stack parent/child effects.
- No creator UI family picker, family tree, heir management, or purchase execution is introduced.

Practical sequencing note:

If `0.5.64` keeps Backstory Legacy records draft-only, `0.5.65` may need to remain a seam/test integration with controlled fixtures rather than live-player-visible unlocks. If `0.5.64` adds guarded live records, `0.5.65` can wire account-scoped purchase ids into creator availability while still leaving family-scoped purchases blocked until a real family context exists.

### Creator Terminology Drift Audit Folded Into Handoff

Ran a connector-only audit of creator/backstory terminology before more Backstory Legacy and resolver work.

Relevant findings to preserve:

- The canonical player-facing content in `packages/content/base/player/backstories.json` is mostly aligned with grounded upbringing/origin language. It describes household, settlement, road, work, institution, and memory contexts rather than hard classes.
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts` still defines `BackstoryArchetypeId` with archetype-style values such as `local`, `vagabond`, `merchant`, `craftsman`, and `minor_noble`. This may be harmless if unused, but future work should not use `archetype` as the user-facing or policy-facing vocabulary.
- The current creator template builder labels starting skills as `Starting Lore`, even when the skills are combat, settlement, survival, resource, magic, crafting, or leadership skills. This is misleading. Prefer `Starting Skills`, `Starting Training`, or another broad label.
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts` consistently uses `origin` in player-facing explanation strings. That is acceptable and should remain distinct from system identifiers such as `backstoryId`.
- `docs/design/backstory-creator-presentation-plan.md` already gives a good presentation boundary: live backstory catalog for names/summaries/descriptions/starter skills, resolver output for availability, and selected-only snapshot effects.
- Save metadata still carries `classLabel`, and the main-menu summary uses `slot.backstoryLabel ?? slot.classLabel ?? "Unrecorded"`. This is acceptable for current data shape, but new creator work should not add new player-facing `class` language or make class the identity model.

Recommended vocabulary rules:

- Use `Backstory` for the system/content type.
- Use `origin`, `upbringing`, `background`, or `household history` in player-facing prose depending on context.
- Use `Legacy support` or `family history` for gated higher-tier availability, not `perk`, `class`, or `archetype`.
- Use `Starting Skills` or `Starting Training` for displayed skill packages, not `Starting Lore` unless the listed items are actually lore-only.
- Keep `lineage` for ancestry/species/bloodline identity and do not conflate it with `familyId` or `sourceRunId`.
- Keep `Family`/`Bloodline` vocabulary reserved for account-family/Bloodlines work where ownership context is explicit.
- Avoid adding new `class`, `archetype`, `profession class`, or `role class` terminology unless a dedicated design pass approves it.

Suggested future cleanup candidate:

`Version 0.5.69 - Creator Terminology Cleanup`

Route: Codex 5.5 Local

Recommended scope:

- Rename or remove unused `BackstoryArchetypeId` if safe.
- Change creator display copy from `Starting Lore` to `Starting Skills` or `Starting Training`.
- Audit creator/save/menu labels for avoidable `class` terminology while preserving existing storage shape unless a dedicated schema cleanup is approved.
- Add a focused presentation test if one already exists for backstory creator options, or update the existing backstory creator availability test expectations.

Do not fold this into `0.5.64` or `0.5.65` unless the touched prompt already edits the same creator presentation lines. If touched, keep it copy-only and avoid schema/data migration.

### Backlog Superseded-Ordering Audit Folded Into Handoff

Ran a connector-only audit of chronological backlog notes and active planning order.

Relevant findings to preserve:

- `docs/future_content_backlog.md` is useful as historical run notes plus deferred-work tracking, but it is intentionally chronological and includes same-day ordering experiments that are now superseded by newer handoff/brief/roadmap direction.
- `docs/dev/project-vision-and-continuity-brief.md` already states the correct precedence: older prompts and chronological backlog notes are useful only where they still fit current strategy, and if same-day ordering conflicts arise, the live handoff plus the brief's current pipeline table control.
- `docs/dev/project-roadmap.md` now complements that by making the active anchor and active pipeline explicit, including `0.5.64` through `0.5.68`.
- `docs/dev/current-codex-output.md` remains the exact current implementation anchor: `Version 0.5.63 - Backstory Legacy Purchase Runtime Shape`, with `Version 0.5.64 - Backstory Legacy Purchase Content Draft` as the next recommended implementation version.
- `docs/design/backstory-legacy-purchase-integration-plan.md` is still useful design guidance, but it explicitly has a pipeline supersession note saying the immediate Backstory Legacy purchase runtime sequence was superseded by `docs/design/legacy-scope-bloodline-economy-plan.md`.
- `docs/design/legacy-scope-bloodline-economy-plan.md` is still useful for scope/currency/family economy boundaries, but several pieces of its then-future runtime shape have since partially landed. Treat it as boundary guidance, not exact current state.

Instruction for future prompt/order work:

- Do not delete `docs/future_content_backlog.md` merely because it contains old sequencing. It is the historical deferred-work ledger.
- Do not delete older Backstory design docs unless their useful boundary guidance has been explicitly folded into newer docs and the user asks for pruning.
- When backlog/design docs disagree with current ordering, use this precedence:
  1. `docs/dev/current-codex-output.md` for exact latest implementation state.
  2. `docs/dev/current-gpt-handoff.md` for latest connector-side audits and prompt guardrails.
  3. `docs/dev/project-vision-and-continuity-brief.md` for strategic direction and current pipeline intent.
  4. `docs/dev/project-roadmap.md` for long-term version/playability/checkpoint routing.
  5. `docs/future_content_backlog.md` for historical deferred notes and reminders.
  6. Older `docs/design/*` plans for boundary rationale, not active sequencing, unless the newer handoff/brief points at them.
- If a future Codex prompt uses an older design plan, make it quote the relevant boundary rule and also state whether that plan is superseded for sequence/status.
- If a future cleanup pass edits the backlog, prefer adding a short precedence header or pruning only fully folded temporary docs. Do not rewrite the chronological run-note history into a fake current plan.

Suggested future cleanup candidate:

`Version 0.5.69 - Backlog Precedence Header Cleanup`

Route: ChatGPT via GitHub Connector for tiny docs edit, or Codex 5.5 Local if paired with local validation/backlog maintenance.

Recommended scope:

- Add a small note near the top of `docs/future_content_backlog.md` clarifying that chronological run notes are historical and that current-codex-output/current-gpt-handoff/continuity brief/roadmap control active sequencing.
- Do not remove old run notes.
- Do not update `docs/dev/current-codex-output.md` for this docs-only connector cleanup.

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

Important refinement: `0.5.65` should not invent family context. It should carry explicit purchase evidence through the existing creator/resolver seam and only use family-scoped purchase ids when a real matching `familyId` is supplied.

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

### Keep `0.5.65` To The Existing Seam

`Version 0.5.65 - Backstory Legacy Purchase Resolver Integration` should use the existing `BackstoryCreatorAvailabilityOptions` -> `buildBackstoryEligibilityEvidenceInput(...)` -> `resolveBackstoryEligibility(...)` seam. Do not redesign the resolver, add a family picker, or infer family ownership from source runs.

### Treat Backlog Notes As History, Not Active Ordering

Use backlog run notes to understand deferred intent and avoid repeating old mistakes. Do not let old same-day notes override the current handoff, GPT handoff, continuity brief, or roadmap pipeline.

### Keep Creator Terminology Cleanup Separate

Creator terminology cleanup is useful, but it should not derail the active Backstory Legacy content/resolver sequence. If nearby creator lines are already touched, use the vocabulary rules above. Otherwise keep this as a separate small cleanup candidate.

### Keep Typecheck Cleanup Separate

Typecheck cleanup should not be folded into `0.5.64` or `0.5.65` unless a specific touched file blocks that run.

Recommended future cleanup candidate:

`Version 0.5.69 - Typecheck Script And Target Policy Cleanup`

Route: Codex 5.5 Local

Goal: make typecheck commands honest and repeatable without weakening strictness.

Do not disable `strict`, `noUncheckedIndexedAccess`, or `exactOptionalPropertyTypes` as a shortcut.

### Useful GPT/GitHub Connector Passes Still Available

These remain light enough for GPT/GitHub Connector before Codex implementation work:

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
