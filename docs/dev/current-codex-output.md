# Current Codex Output

Source version/run: Version 0.5.39 - Background Legacy Unlock Policy Audit
Date: 2026-05-14
Branch/status assumption: Current local branch reality; `git status --short` was clean before the audit. This was a read-only policy audit except for this output file.

## Result

Audited the current backstory, starter skill, character creator, snapshot creation, account history, achievement, and Legacy seams for a future background-unlock policy.

Current state: all 20 authored backstories are freely selectable when the lineage id is valid. Backstories currently grant direct trained starter skill ranks, usually rank 25 across three to five skills, not a small `+5` background skill bonus. The existing starter-skill guardrails cap authored starts at rank 25, keep them below the first breakthrough rank at 30, limit each backstory to five skills, and block direct Legacy skill-rank grants.

Recommended policy direction: keep a small neutral/default starter set available for new accounts, lock specialist/status/combat/magic/profession backgrounds behind family-scoped Legacy eligibility, and store ancestry evidence separately from generic account-wide ownership so descendants cannot start with skill levels unsupported by their family line.

## Files Changed

- `docs/dev/current-codex-output.md`

## Files Inspected

- `README.md`
- `docs/future_content_backlog.md`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `packages/schemas/player/backstory.schema.json`
- `packages/content/base/player/backstories.json`
- `packages/content/base/player/legacy_unlocks.json`
- `packages/content/base/player/achievements.json`
- `packages/shared/types/src/contracts.ts`
- `packages/shared/types/src/settlement-institutions.ts`
- `packages/engines/game-engine/src/legacy-account.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/achievements.ts`
- `packages/engines/player-engine/src/progression.ts`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/characterCreationMath.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `tests/unit/player-identity-content.test.mjs`
- `tests/unit/player-progression.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/legacy-unlocks.test.mjs`

## Audit Findings

1. Current story/background data:
   `packages/content/base/player/backstories.json` contains 20 records. Each record has `id`, `name`, `summary`, `description`, `startingSkills`, optional zero-sum `attributeAdjustments`, and optional `startingAbilityIds`. Current starter ranks are 15, 20, or 25. Two records grant a starting ability: `backstory.village_hunter` grants `ability.ranged.quick_shot`, and `backstory.military_brat` grants `ability.command.hold_formation`.

2. Recommended default-unlocked backgrounds:
   Keep `backstory.local`, `backstory.vagabond`, `backstory.exile`, and `backstory.amnesiac` as the practical starter-safe default set. If the first implementation needs a stricter minimum, use `backstory.local` plus `backstory.amnesiac`. Lock `local_hero`, profession-family, nobility, military, hunter/scout, scholar, temple, hedge-magic, and other specialist backgrounds until family evidence exists. Do not default-unlock `backstory.isekai_outcast` without a separate tone/design decision.

3. Where starter skills are defined, validated, previewed, and applied:
   Definition lives in `backstories.json`. Schema shape lives in `backstory.schema.json`. Content lint validates id uniqueness, zero-sum attribute adjustments, at most five starter skills, duplicate prevention, cap/breakthrough boundaries, and starting ability allowlist. `player-identity-content.test.mjs` mirrors those guardrails. `characterCreationCatalog.ts` converts content records into `StarterBackstoryTemplate` objects and formats labels. `CharacterCreationNarrativeScreen.tsx` renders all options and shows selected starter skills/abilities. `newGameSnapshot.ts` previews `starterSkills` and applies `skills: [...backstory.startingSkills]`; `characterCreationMath.ts` applies backstory attribute adjustments.

4. Current starter-skill limits:
   `tools/content-lint/index.mjs` sets `PLAYER_STARTER_SKILL_DEFAULT_CAP = 25`, `PLAYER_STARTER_SKILL_ABSOLUTE_CAP = 30`, and `PLAYER_BACKSTORY_MAX_STARTING_SKILL_COUNT = 5`. `resolveLegacyStarterSkillPolicy()` returns `starterSkillCap: 25`, `absoluteStarterSkillCap: 29`, `maxStarterSkillCount: 5`, `directSkillRankGrantsAllowed: false`, and no unlocked skill lanes/options. Existing tests assert account start resources and selected preparations do not alter starter skills.

5. Breakthrough and skill-gate policy:
   `packages/engines/player-engine/src/progression.ts` defines gates at 30, 55, 80, and 100. Rank growth can reach 30 in the first band, but growth above 30 requires the `familiar` band; later gates require `proficient`, `skilled`, and `mastery`. Current starter content stays at or below 25, below the first gate. Future background bonuses should remain below the first gate unless ancestry has already unlocked/earned the relevant band and the starter policy explicitly permits that higher floor.

6. Creator assumptions:
   `getBackstoryOptionsForSelection()` returns every backstory for any known lineage and ignores `selectedWorld`. `validateCharacterCreationForm()` only checks `isKnownBackstoryId()`. `CharacterCreationNarrativeScreen.tsx` renders all returned backstories as normal selectable cards. There is no concept of locked, hidden, disabled, or explanation-only backstories.

7. New-character snapshot application:
   `deriveCharacterCreationState()` resolves the selected backstory and writes its starter skills directly to `playerState.skills`. It also applies starting abilities through `getStartingAbilityStates()`, backstory id into core data and flags, and backstory-driven attribute adjustments through the character creation math path. No ancestry, account, or Legacy eligibility check exists at this boundary.

8. Existing Legacy/account/profile storage seams:
   `AccountProfileState` currently has `legacy`, `achievements`, `history`, and `estate`. `AccountLegacyState` stores points, unlock states, transactions, and selected preparation payloads. `AccountHistoryState.runRecords` stores compact run identity, lineage, starting location, outcome, survival/payout fields, source-run linkage, and save slots, but not backstory id or skill maxima. `AccountAchievementsState` stores broad metric totals and achievement unlocks. These are useful seams, but none currently stores unlocked backgrounds, ancestral skill maxima, relevant background-specific accomplishments, or background skill bonus tiers.

9. Safest future data model:
   Add explicit family/ancestry-scoped background state rather than overloading generic `legacyUnlocks`.
   Recommended shape:
   - `defaultUnlockedBackgroundIds`: static policy from content/resolver, not persisted per profile.
   - `familyBackgroundUnlocks`: `Record<familyId, Record<backstoryId, unlockEvidence>>`.
   - `familySkillMaxima`: `Record<familyId, Record<skillId, { rank, sourceCharacterId, sourceRunId, recordedAt, sourceKind }>>`.
   - `familyBackgroundSkillBonusTiers`: `Record<familyId, Record<backstoryId, tier>>`.
   - `backgroundUnlockRules` in content/schema: default flag, primary background skill id, base bonus, eligible evidence predicates, and tags.
   Until a real `familyId` exists, use the existing `sourceRunId` chain only as a temporary lineage-source reference, not an account-wide substitute.

10. Ancestry gating policy:
   Use family-line maximum as the main cap. Account-wide max is too permissive and would turn background unlocks into generic account power. Background-specific max is too narrow because a family swordmaster should support multiple martial origins. A strict character-line/source-run chain is good for heir-specific starts but too brittle for broader family identity. Use non-deleted, lineage-authoritative family records only. Store `earned` versus `starter-granted` skill maxima separately so old or future starter bonuses do not bootstrap themselves into higher descendant starts. For new accounts, allow only neutral defaults at a conservative base `+5` floor; upgrades beyond that floor require family evidence.

11. Relevant player experiences:
   Represent experiences as typed evidence predicates, not freeform copy. Useful predicates include `skill_threshold`, `achievement`, `quest_or_event_tag`, `activity_tag`, `profession_history`, `faction_or_region_reputation`, `combat_accomplishment`, `noncombat_accomplishment`, `lineage_title`, `estate_milestone`, and `renown_milestone`. Current achievements can cover broad early categories, but the account profile does not yet store enough detailed quest/event/activity/faction evidence for rich background unlocks.

12. Background skill Legacy upgrade policy:
   Treat this as background-specific enhancement, not generic skill purchase. A background skill bonus tier should apply only when that backstory is selected, only to that backstory's authored primary skill, and only up to the minimum of starter cap, breakthrough cap, family skill max, and authored background cap. Suggested formula: `effectiveBonus = min(baseBonus + tierBonus, familySkillMax[skillId], starterSkillPolicyCap, breakthroughSafeCap)`, with the neutral first-generation `+5` floor handled explicitly. A Legacy purchase alone must never unlock a rank unsupported by family history.

13. Validation/tests needed before implementation:
   Add content/schema tests for default background coverage, one primary background skill, base `+5`, no direct attribute/stat bonuses, and no bonus above starter/breakthrough caps. Add pure resolver tests for default availability, locked specialist backgrounds, family max capping, deleted-run exclusion, account-wide leakage prevention, stale ids, duplicate evidence, mutation safety, and no direct Legacy skill grants. Add creator tests for disabled/hidden cards, stale locked selection rejection, visible locked reasons, and snapshot refusal when eligibility fails. Add account storage migration/roundtrip tests before persisting ancestry maxima or background unlock state.

14. First implementation out of scope:
   Do not change combat math, progression gates, current skill gain rules, save/account schema, backstory JSON values, character creator layout, Legacy payout, achievement reward formulas, or magic systems in the first slice. Do not add generic skill buying, direct attribute/stat bonuses, universal account-wide specialist unlocks, or broad event-ledger storage before the family ownership model is clear.

## Recommended First Implementation Slice

Version 0.5.40 - Background Unlock Policy Resolver

Smallest safe next slice:
- Add a pure policy helper that accepts current backstory templates, a static neutral default set, and a future-compatible ancestry summary object.
- Return per-backstory availability, lock reason, primary background skill, base background skill bonus, and effective capped bonus.
- Keep current creator behavior unchanged in that first slice unless the resolver is explicitly wired behind a display-only preview.
- Add focused tests with synthetic ancestry summaries for default unlocks, locked specialist backgrounds, family skill caps, breakthrough-safe caps, duplicate evidence, and mutation safety.

Only after that should a later slice add account/family storage and creator selectability enforcement.

## Checks Run

- `git status --short`: passed before audit; clean.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `node --test tests\unit\*skill*.mjs tests\unit\*legacy*.mjs tests\unit\*creator*.mjs tests\unit\*backstory*.mjs`: passed, 62 tests.
- `git diff --check`: passed. Git emitted the existing line-ending warning that `docs/dev/current-codex-output.md` will be normalized from LF to CRLF the next time Git touches it.

## Behavior / Runtime Confirmation

No runtime, UI, schema, content JSON, save/account, combat, magic, Legacy, progression, or character creator behavior changed.

This run modified only `docs/dev/current-codex-output.md`.

## Risks / Follow-Up

- Current backstories are much stronger than the proposed future `+5` one-skill background bonus. Migrating from current rank-25 multi-skill starts to the future policy will need a separate balance/content migration decision.
- Current account run history does not preserve backstory id, final skill maxima, earned-versus-starter skill source, faction/region reputation evidence, or detailed activity tags. Locking specialist backgrounds before adding that storage would make unlocks mostly impossible.
- Existing `LegacyUnlockRequirementState` includes future `character_skill`, `role_rank`, and `wealth` requirements, but the resolver marks those unsupported today. Do not use them for live gating until account/family evidence storage exists.
- Existing source-run/heir linkage is useful but not a complete family ledger. Avoid treating all account runs as one ancestry pool.
- Existing draft Legacy catalog already sketches backstory unlock intent, but it is explicitly non-runtime and must not be imported directly into gameplay.

## Next Recommended Version

Version 0.5.40 - Background Unlock Policy Resolver

## Suggested Commit Message

docs(legacy): audit background unlock policy
