# Unified Shell And Creator Refinement Plan

## Purpose

This plan inserts a focused creator/main-shell refinement track before returning to `Version 0.5.86 - Combat Equipment Mapping Audit`.

The next implementation should not start by rewriting every shell. It should make character creation the first target for the new rule: main menu, character creation, and gameplay should feel like one application shell, with a consistent top bar and left sidebar model. The first implementation target is character creation sidebar/layout, backstory gating, full randomization, and stat preview cleanup.

This document is planning-only. It does not authorize source edits, generated output updates, save-schema changes, stat math changes, or validation behavior changes in this run.

## Current Repo Reality

Main menu:

- `apps/rpg-ui/src/game-shell/components/AppShell.tsx` owns the current launcher shell primitives: `TopBar`, `ShellLogoArea`, `ShellSubBar`, `ShellContent`, and `SidebarNav`.
- `apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx` uses `AppShell`, `ShellBrandLogo`, launcher account controls, `LauncherSpriteClock`, shell sub-bar pagination, and left sidebar launcher sections.
- The launcher sidebar is the most complete current left-shell expression. It is art-backed for known launcher section ids and becomes a horizontal rail on smaller screens.

Character creation:

- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx` uses a bespoke sticky top bar, a horizontal step rail, a `Summary` toggle, and a right-side summary column.
- `summaryVisible` auto-collapses for continent, region, and settlement through `SUMMARY_COLLAPSED_STEP_IDS`.
- The right summary column currently renders identity/live summary, context rows, final attributes, resources, review-only generated-profile bonuses, Legacy preparations, starter skills/lore/traits/gear/funds/pack, and extra review details.
- Step unlocking currently derives from `validateCharacterCreationStep(...)` and the first invalid step. Region is dependency-locked until continent is selected. Settlement is dependency-locked until region is selected. Backstory is not dependency-locked or skipped.
- Locked step buttons collapse to icon-only width, while unlocked buttons use a wider flexible width. This creates inconsistent rail geometry.

Gameplay:

- `apps/rpg-ui/src/game-shell/InGameShell.tsx` uses `AppLayout`, `TopStatusBar`, and `SideNav`.
- `apps/rpg-ui/src/components/layout/AppLayout.tsx` is a separate in-game layout with a top bar and a fixed left navigation column.
- `apps/rpg-ui/src/components/TopStatusBar.tsx` owns gameplay top-bar chrome, body-state/settings overlays, and the read-only Calendar/Climate popup from `0.5.83`.
- `apps/rpg-ui/src/components/SideNav.tsx` owns gameplay panel navigation and uses the current forged list-item/card style rather than the launcher sidebar style.

Backstory:

- `apps/rpg-ui/src/game-shell/characterCreationForm.ts` includes `backstory` as a required step and includes `backstoryId` in the final review fields.
- `hasCompleteCharacterCreationSelections(...)` requires a non-empty `backstoryId`.
- `validateCharacterCreationForm(...)` rejects missing, unknown, locked, special, and otherwise non-selectable backstory ids.
- `validateCharacterCreationStep(...)` inherits full-form validation for the backstory step.
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts` resolves creator backstory availability through the Backstory Eligibility resolver and the owned Backstory Legacy purchase helper.
- Current default backstories are visible and selectable without evidence, so the step is available in current data. The future locked/no-selectable path still needs explicit UI and validation behavior.
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` assumes a selected backstory for final snapshot creation: it reads the backstory template, applies starter skills and abilities, writes `player.backstory.*` flags, writes narrative copy, and stores `coreData.backstoryId`.
- `PlayerCoreData.backstoryId` in `packages/shared/types/src/contracts.ts` is already optional/nullable, but current creator completion and snapshot creation still require a selected package.

Attribute math:

- `apps/rpg-ui/src/game-shell/characterCreationMath.ts` resolves base attributes from lineage, sex, age, height, and selected backstory adjustments, then adds generated profile points from physique, nature, and focus.
- The resolver returns `baseAttributes`, `generatedProfilePoints`, `finalAttributes`, and share metadata.
- `newGameSnapshot.ts` applies Legacy preparation attribute adjustments after the resolver when preparations are selected.
- `buildCharacterCreationPreview(...)` exposes `attributeMetrics` as the final visible values and `generatedProfileMetrics` as a separate review-only list.
- `CharacterCreationNarrativeScreen.tsx` renders visible attribute rows through `renderStatList(...)`; attribute tooltips currently explain attribute meaning, not source breakdown.

Randomization:

- The current creator has an identity-only randomizer in `CharacterCreationNarrativeScreen.tsx`.
- The current identity randomizer changes name, sex, age, height, physique, nature, focus, and color selections for the current lineage.
- The name dice button only changes name.
- There is no full-character randomizer that chooses lineage, identity, world start, backstory, starting bundle, and bundle choices together.

## Target Shell Rule

Target rule:

- Main menu, character creation, and gameplay should share a consistent top bar plus left sidebar shell unless a screen explicitly opts out.
- The first implementation target should be character creation because its bespoke chrome is the most visibly divergent and its right summary column conflicts with the desired left-shell model.
- Main menu `AppShell` should remain the reference for the left-sidebar shell direction.
- Gameplay shell unification should be deferred until after the creator pass unless source inspection proves a tiny shared extraction is safe.
- Do not extract a universal shell component just to satisfy visual similarity. Prefer adapting the creator to the existing launcher shell primitives first, then evaluate shared abstraction after the duplication is real and stable.

Future exceptions:

- Full-screen modal flows, splash/loading screens, cinematic/tutorial overlays, and highly constrained mobile flows may opt out only through explicit local documentation and a focused implementation prompt.
- Gameplay can temporarily keep `AppLayout`, `TopStatusBar`, and `SideNav` while the creator shell pass lands.

## Character Creation Layout Plan

First implementation should update only the creator layout/chrome path:

- Replace the bespoke creator sticky top/chrome with `AppShell` or a tiny creator wrapper around `AppShell`.
- Keep `ShellBrandLogo` in the desktop left logo well when a sidebar is present.
- Keep top-bar controls for return to main menu, previous available step, theme toggle, and final/begin action where they remain ergonomic.
- Preserve notice rendering through the same `NoticeBanner` behavior.
- Preserve current return-to-menu behavior.
- Preserve previous-step behavior, but make it use available-step navigation so locked/skipped backstory does not trap navigation.
- Preserve begin-journey behavior and overwrite confirmation behavior.
- Remove the current right-side live summary column.
- Remove the `Summary` toggle and all `summaryVisible` behavior.
- Move the live summary content into the left sidebar.
- Make the main content a single focused step area with no second summary column.
- Keep step-specific content ownership inside `CharacterCreationNarrativeScreen.tsx` for the first pass; do not move every card into new files unless the file becomes unworkable.

Desktop layout:

- Use a fixed-width left sidebar aligned with launcher shell width.
- Sidebar scrolls independently if its contents exceed the viewport.
- Main content gets the reclaimed width from the removed right summary column.
- The active step panel should remain centered enough for card grids and wide art-backed selectors to breathe.

Small-screen layout:

- Preserve the same shell hierarchy but allow the sidebar to stack or become a compact scrollable rail beneath the top bar, matching the current `AppShell` responsive pattern.
- Do not hide required navigation behind a tiny icon-only drawer unless a later mobile-specific pass designs it.
- Summary, step nav, and full-randomize affordances must remain reachable without needing the removed summary toggle.

## Left Sidebar Content Plan

The creator sidebar should be ordered for decision support, not for review-page exhaustiveness:

1. Identity/live summary block.
2. Fixed-width step navigation.
3. Full randomize button.
4. Compact world/backstory/bundle context.
5. Total attribute matrix.
6. Resource bars.
7. Review-only extra details only if they fit cleanly.

Identity/live summary block:

- Show character name or `Unnamed Wanderer`.
- Show compact identity sentence from the existing `formatIdentityNarrativeSummary(...)`.
- Show lineage and active start context when present.
- Keep it short enough that step navigation stays visible.

Step navigation:

- Move the step buttons from the horizontal top rail into the sidebar.
- Use fixed-width/fixed-height buttons in all states.
- Include label text even when locked; add a lock icon rather than collapsing to icon-only.
- Use current `CHARACTER_CREATION_STEPS` ordering unless backstory is skipped by availability state.

Full randomize:

- Add one prominent full-character randomize control in the sidebar.
- Use a dice icon if possible through existing `Icon`.
- Place it after step navigation so it is visible but not confused with step navigation.
- It must not create a save or commit the character.

Compact world/backstory/bundle context:

- Use the existing preview labels: starting continent, region, settlement, backstory, and starting bundle.
- If backstory is locked/skipped and no selection exists, show neutral copy such as `No backstory selected`.
- Do not show locked-system unlock promises in this compact block.

Attribute matrix:

- Render one total-attribute matrix in canonical order.
- Values should be total final values only.
- Each row should expose source breakdown in a tooltip/popover, not as always-visible secondary matrices.

Resource bars:

- Keep HP, MP, and stamina resource bars in the sidebar because they help the player understand the active build.
- Continue using the existing resource bar fill rules unless a later balance pass changes resource math.

Review page should keep:

- Opening summary narrative.
- Land access detail.
- Heir-source selection.
- Overwrite confirmation.
- Begin Journey action.
- Detailed starter package information that does not fit sidebar: starter skills, lore emphasis, starter limits, traits, gear, funds, pack, and selected Legacy preparation review rows.

Review page should not duplicate:

- The always-visible total attribute matrix.
- The always-visible resource bars.
- The identity/live summary block.

## Step Indicator State Rules

Step buttons should be fixed-width and theme-consistent.

State rules:

| State | Behavior | Visual rule |
| --- | --- | --- |
| Locked | Disabled and not selectable. | Low contrast, lock icon, muted text, no pulse. |
| Available incomplete | Selectable. | Neutral higher contrast, stable border, no success color. |
| Active | Selectable/current. | Neutral high contrast with clear outline or active inset. |
| Completed | Selectable. | Theme-appropriate green/success tone. |
| Recently unlocked | Selectable after dependency changes. | Subtle pulse only if it does not overpower active, locked, or success colors. |

Dependency rules:

- Region remains locked until continent is selected.
- Settlement remains locked until region is selected.
- Backstory is locked until at least one selectable/unlocked backstory exists.
- Locked backstory is skipped by next/previous navigation.
- Locked steps cannot be selected.
- Review should not be blocked by locked/skipped backstory when no selectable backstory exists.
- Review should remain blocked by any available required step that is incomplete or invalid.

Implementation shape:

- Add a small derived step-state helper instead of encoding every branch inline in JSX.
- Suggested future helper:

```ts
type CharacterCreationStepState = {
  stepId: CharacterCreationStepId;
  locked: boolean;
  skipped: boolean;
  active: boolean;
  complete: boolean;
  recentlyUnlocked: boolean;
  reasonLabel: string | null;
};
```

- Suggested future navigation helpers:

```ts
getNextAvailableCharacterCreationStepId(currentStepId, stepStates)
getPreviousAvailableCharacterCreationStepId(currentStepId, stepStates)
```

## Backstory Unlock / Requirement Plan

Intended behavior:

- Backstory is not required while no selectable/unlocked backstory exists.
- While locked, empty `backstoryId` must not block validation, review, or new-game creation.
- Locked, unavailable, special, hidden, or deferred backstories cannot be selected.
- Full randomize must not assign a backstory while the backstory step is locked.
- Once at least one selectable backstory exists, the step becomes available.
- Default policy: once available, backstory is required.
- If current data has selectable default backstories, the backstory step remains available and required.

Current assumptions to update in the implementation pass:

- `CHARACTER_CREATION_STEPS` always includes `backstory`.
- `hasCompleteCharacterCreationSelections(...)` requires `form.backstoryId.trim()`.
- `validateCharacterCreationForm(...)` rejects missing `backstoryId`.
- `validateCharacterCreationStep(...)` inherits required backstory validation.
- `CharacterCreationNarrativeScreen.tsx` computes `maxUnlocked` from first invalid step, so a required empty backstory blocks later steps.
- `getPreviousCharacterCreationStepId(...)` and `getNextCharacterCreationStepId(...)` do not know about skipped steps.
- `buildCharacterCreationPreview(...)` uses placeholder copy until all current required selections are complete.
- `createNewGameSnapshot(...)` validates full form and requires complete selections.
- `deriveCharacterCreationState(...)` calls `getBackstoryTemplate(form.backstoryId)` and applies starter skills/abilities/copy from that template.
- `buildSessionState(...)` writes backstory flags, notifications, chronicle text, and entity lists assuming a selected backstory.
- `buildReviewNarrative(...)` says `Your backstory is ...`.
- Tests in `tests/unit/backstory-creator-availability.test.mjs` and `tests/unit/legacy-start-resources.test.mjs` assume selected backstory packages are applied exactly.

No-backstory starter policy:

- Do not invent a new content id in the first implementation.
- Prefer a no-package policy when backstory is locked:
  - form keeps `backstoryId: ""`;
  - saved `PlayerCoreData.backstoryId` should be `null` or omitted;
  - starter skills from backstory are empty;
  - starting abilities from backstory are empty;
  - backstory attribute adjustments are not applied;
  - no `player.backstory.*` or `character.backstory.*` flags are written;
  - creator copy uses neutral labels such as `No backstory selected` and `No sworn backstory`;
  - chronicle/session copy must not claim a backstory was selected;
  - settlement access should resolve with empty backstory id and `hasBackstorySelection` false.
- If implementation inspection proves a neutral content-backed origin id is safer than null/no package, stop and split that into a separate policy/content pass. Do not silently add a placeholder backstory record inside the UI pass.

Fallback origin/session copy:

- Chosen origin: `<Lineage label> | No sworn backstory`.
- Review copy: `<name> arrives at <settlement> in <region> with the <bundle>. No formative backstory package is applied yet.`
- Session notification: `<name> arrives in <settlement> with the <bundle>.`
- Chronicle title: `<name> began the journey`.
- Chronicle stat/result text should mention starter state and location, not backstory identity.

Tests to add/update in the implementation pass:

- No selectable backstories means backstory step is locked and skipped.
- Empty `backstoryId` validates only when the step is locked/skipped.
- Empty `backstoryId` still fails when at least one selectable backstory exists.
- Locked/special/deferred/hidden ids remain unselectable and fail validation.
- No-backstory snapshot has no backstory skills, abilities, flags, or backstory copy.
- Current default selectable backstories remain required and still apply exactly one selected package.

## Full Randomize Plan

Add a future pure helper, preferably outside the React component:

```ts
generateRandomCharacterCreationFormState(...)
```

Suggested file owner:

- `apps/rpg-ui/src/game-shell/characterCreationRandomization.ts`

Suggested input shape:

```ts
type GenerateRandomCharacterCreationFormStateInput = {
  currentForm: CharacterCreationFormState;
  accountProfile?: AccountProfileState | null;
  rng?: () => number;
};
```

Rules:

- Overwrite all creator choice fields except `saveSlotId`.
- Reset `sourceRunId` to `""` for the first pass; heir/source-run randomization has inheritance implications and should wait for a dedicated heir-start pass.
- Choose a valid lineage.
- Choose valid sex, age, height, physique, nature, focus, hair, eye, and skin options for the selected lineage.
- Generate a name from the selected lineage and sex.
- Choose a valid continent, region, and settlement.
- Choose a valid starting bundle.
- Choose valid starting bundle choice selections from each bundle choice group.
- Choose a backstory only when at least one resolver-selectable backstory is available.
- Leave `backstoryId: ""` when the backstory step is locked/no selectable options exist.
- Use existing catalog and resolver helpers; do not invent ids.
- After full randomize, the player can freely navigate and edit any available step.
- Pressing full randomize again rerolls all eligible fields.
- Page-specific randomize buttons keep current behavior and only overwrite their associated fields.

Randomization order:

1. Pick lineage.
2. Pick identity options from that lineage's identity catalog.
3. Resolve selectable backstories using the selected lineage and current account profile.
4. Pick a backstory only if selectable options exist.
5. Pick continent, region, and settlement using the selected or empty backstory id.
6. Pick starting bundle and bundle choices.
7. Return a complete next form state preserving `saveSlotId` and resetting `sourceRunId`.

Validation:

- The generated state should pass `validateCharacterCreationForm(...)` when backstory is available.
- The generated state should pass the future no-backstory validation path when no backstory is selectable.
- The helper should be testable without rendering React.

## Attribute Matrix Plan

Visible stat preview:

- Show one matrix in canonical order: `STR`, `DEX`, `AGI`, `CON`, `VIT`, `INT`, `WIS`, `SPT`, `CHA`.
- Each row shows total final value only.
- Do not show separate visible matrices or lists for racial baseline, generated profile bonuses, or other source categories.
- Remove or relocate the current visible `Generated Profile Bonuses` review list into row breakdown popovers.

Hover/focus/long-press breakdown:

- Each attribute row should expose a tooltip/popover with:
  - Racial Baseline
  - Sex
  - Age
  - Height
  - Backstory, only if applied
  - Generated Build/Profile
  - Legacy Preparation, only if applied
  - Total
- Keep the existing attribute meaning copy from `getCharacterAttributeTooltipContent(...)`, but combine it with the contribution breakdown rather than replacing it entirely.
- Existing `Tooltip` supports hover and focus. For touch, the implementation should either add a creator-specific long-press/click popover wrapper or extend `Tooltip` narrowly with long-press support and focused tests.

Recommended typed preview row shape:

```ts
type CharacterCreationAttributePreviewRow = {
  id: PlayerAttributeKey;
  label: PlayerAttributeKey;
  totalValue: number | null;
  contributions: Array<{
    id: string;
    label: string;
    value: number;
  }>;
};
```

Recommended helper:

```ts
buildCharacterCreationAttributePreviewRows(input): CharacterCreationAttributePreviewRow[]
```

Source mapping:

| Contribution | Current source |
| --- | --- |
| Racial Baseline | `getLineageBaseAttributes(...)` |
| Sex | `getSexAttributeAdjustments(...)` |
| Age | `getAgeBandAttributeAdjustments(...)` |
| Height | `getHeightBandAttributeAdjustments(...)` |
| Backstory | `getBackstoryAttributeAdjustments(...)` only when backstory is selected/applied |
| Generated Build/Profile | `resolveCharacterCreationAttributes(...).generatedProfilePoints` |
| Legacy Preparation | `applyLegacyPreparationBonuses(...).attributeAdjustments` when selected |
| Total | resolved final attributes after any preparation adjustments |

Test expectations:

- Attribute rows are always in `CHARACTER_ATTRIBUTE_ORDER`.
- Visible row values are final totals only.
- Contributions include only nonzero rows plus total, except total should always be present.
- Backstory contribution is omitted when no backstory package is applied.
- Legacy Preparation contribution is omitted when no preparation attribute adjustment exists.
- Contribution sums equal visible total per attribute.

## Proposed Implementation Boundary

Next implementation should be:

- `Version 0.5.85 - Creator Sidebar Layout And Backstory Gating`

Allowed in that pass:

- Source changes limited to creator shell/layout, creator form validation/navigation helpers, creator randomization helper, preview attribute rows, and focused tests.
- Use `AppShell` or a very small creator wrapper around `AppShell`.
- Add a full randomize button and pure randomization helper.
- Adjust no-backstory validation only for the locked/no-selectable state.
- Update focused tests for creator validation, randomization, no-backstory behavior, and attribute preview rows.

Deferred from that pass:

- Gameplay shell unification.
- Universal shell extraction unless it is obviously tiny after the creator wiring is complete.
- Generated UI output.
- Broad typecheck cleanup.
- New backstory content ids.
- Backstory purchase UI.
- Family/source-run/scoped Backstory evidence.
- Save compatibility or migration behavior.
- Combat equipment audit, which should resume after the creator refinement track.

## Focused Test Plan

Recommended tests for `0.5.85`:

- `tests/unit/character-creation-form.test.mjs` or existing creator tests:
  - no selectable backstories locks/skips backstory and allows empty `backstoryId`;
  - selectable default backstories keep backstory required;
  - locked/special ids remain invalid;
  - next/previous helper skips locked backstory.
- `tests/unit/character-creation-randomization.test.mjs`:
  - full randomize produces valid ids and preserves `saveSlotId`;
  - full randomize resets `sourceRunId`;
  - full randomize chooses no backstory when none is selectable;
  - full randomize chooses only selectable backstories when available;
  - bundle choice groups are filled with valid option ids.
- `tests/unit/character-creation-attribute-preview.test.mjs`:
  - rows follow canonical order;
  - visible totals match resolved attributes;
  - contribution sums match totals;
  - backstory and Legacy Preparation contribution rows appear only when applied.
- Existing tests to keep green:
  - `tests/unit/backstory-creator-availability.test.mjs`
  - `tests/unit/legacy-start-resources.test.mjs`
  - `tests/unit/character-creation-profile-resolver.test.mjs`

If a clear component-render test pattern is still absent, use source-level assertions only for narrow chrome invariants such as removed `summaryVisible`/`Summary` toggle and presence of the full-randomize control. Do not create broad brittle UI snapshot tests.

## Validation Commands For Implementation

For `0.5.85`, run at minimum:

- `node --test tests/unit/backstory-creator-availability.test.mjs`
- `node --test tests/unit/legacy-start-resources.test.mjs`
- `node --test tests/unit/character-creation-profile-resolver.test.mjs`
- `node --test <new focused creator randomization/form/attribute preview tests>`
- `rg -n "game-engine/src/index|civilization-engine/src/index|civilization-engine/src/content|load.*Content|node:fs|readFileSync" apps/rpg-ui/src`
- `git diff --check`

Do not require broad workspace typecheck unless the implementation touches shared types broadly or deliberately addresses known typecheck blockers.

## Open Risks And Follow-Up

- Current live data has default selectable backstories, so the locked/no-backstory path may need test fixtures or dependency injection to simulate no selectable options.
- No-backstory creation touches snapshot copy, flags, skills, abilities, and validation. Keep it focused and test-backed.
- Existing design ledger says the creator applies exactly one selected backstory package. This plan narrows that rule: once the backstory step is available, exactly one package is required; when the step is locked with no selectable packages, no package is applied.
- If no-backstory state becomes more than a temporary locked-state fallback, promote the policy into the design ledger after implementation.
- Gameplay shell unification should wait until the creator pass proves whether `AppShell` can serve as a shared shell or whether the in-game `AppLayout` needs a separate adapter.
