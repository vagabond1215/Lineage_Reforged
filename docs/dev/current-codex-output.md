# Current Codex Output

Source version/run: Version 0.5.43 - Backstory Specialist Rewrite Pass
Date: 2026-05-14
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed unrelated untracked files under `unused assets/`; those files were not touched.

## Result

Refined the remaining primary specialist backstories that could read like class packages, magical overreach, or overly broad expertise before any future Background Legacy resolver work.

This pass updates visible content prose only, plus matching non-runtime policy metadata notes. It does not implement background locking or change live backstory availability.

## Files Changed

- `packages/content/base/player/backstories.json`
- `docs/design/backstory-policy-metadata.json`
- `docs/dev/current-codex-output.md`

## Exact Backstory Names Changed

- `backstory.performer`: `Performer` -> `Troupe-Raised`
- `backstory.craftsmans_child`: `Craftsman's Child` -> `Workshop Child`

Names intentionally left unchanged:

- `backstory.scholars_apprentice`: remains `Scholar's Apprentice`
- `backstory.temple_acolyte`: remains `Temple Acolyte`

## Prose Rewrite Summary

- `Troupe-Raised` now reads as grounded troupe and public-life upbringing: rehearsal, travel, patronage, crowd mood, timing, morale, reputation, and public obligation without ordinary spellcasting implications.
- `Scholar's Apprentice` now emphasizes copying, records, language, memory, reference habits, instruction, and patient study instead of reading like an active mage premise.
- `Temple Acolyte` now foregrounds service, ritual order, care, stewardship, mediation, and field medicine without presenting divine magic as the ordinary starting identity.
- `Workshop Child` now frames a general workshop household through tools, materials, repairs, measuring, cleaning, sorting, assisting, and repetition without implying mastery across all crafts.

`docs/design/backstory-policy-metadata.json` was updated only in notes for these four records. The manifest remains `status: "non_runtime_policy_draft"` with `runtimeImportAllowed: false`.

Optional light-touch records were inspected but not changed:

- `backstory.merchants_child`
- `backstory.minor_noble`
- `backstory.hedge_adept`

Their current prose already stays narrow enough for this pass.

## Checks Run

- `git status --short`: run before edits; showed unrelated untracked `unused assets/` files only.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `node --test tests\unit\*backstory*.mjs tests\unit\player-identity-content.test.mjs tests\unit\*legacy*.mjs tests\unit\*creator*.mjs`: passed, 68 tests.
- `git diff --check`: passed. Git emitted line-ending normalization warnings for edited text files.

## Behavior / Runtime Confirmation

No runtime behavior changed.

This pass did not change backstory ids, `startingSkills`, `startingAbilityIds`, `attributeAdjustments`, character creator behavior, starter skill application, save/account schemas, Legacy runtime, progression gates, combat, magic, launcher UI, live availability logic, schemas, or policy metadata imports.

The focused policy metadata test still confirms `docs/design/backstory-policy-metadata.json` is not imported by live runtime/source paths.

## Risks / Follow-Up

- `backstory.performer` still carries the current `skill.magic.school.performance` starter skill. This was intentionally left unchanged until a later background-skill or magic-split implementation is approved.
- `backstory.scholars_apprentice` still carries magic-related starting skills. The prose now narrows the visible premise, but a future split between mundane scholarship and active arcane starts remains deferred.
- `backstory.temple_acolyte` still carries `skill.magic.school.divine`. The visible premise is now grounded in service and care; any future divine-magic unlock should remain separately reviewed.

## Next Recommended Version

Version 0.5.44 - Backstory Coverage Concept Plan

## Suggested Commit Message

content(player): refine specialist backstory prose
