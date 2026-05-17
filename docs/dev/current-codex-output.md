# Current Codex Output

Source version/run: Version 0.5.48 - Backstory Coverage First-Batch Plan
Date: 2026-05-17
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Created a docs-only first-batch plan for later Tier 1 backstory content. The plan recommends a small grounded batch that uses current canonical skill ids and avoids runtime-owner gaps.

Recommended later implementation batch:

- Militia Levy
- Street Vendor
- Net-Tender
- Gatherer
- Scribe's Apprentice
- Drover's Hand
- Kitchen Hand

## Files Inspected

- `docs/design/backstory-tiered-lane-design.md`
- `docs/design/backstory-policy-metadata.json`
- `docs/design/backstory-policy-metadata.md`
- `packages/content/base/player/backstories.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/achievements.json`
- `packages/content/base/player/abilities.json`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Files Changed

- `docs/design/backstory-coverage-first-batch-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Current Coverage Gap Summary

- No low-tier civic defense origin exists below Garrison Ward.
- No low-status market/trade origin exists below Merchant Family.
- No fishing or river/coastal labor origin exists.
- Gatherer/flora collection is only covered indirectly through Farmhand and Vagabond.
- No mundane records/admin origin exists separate from magic-bearing Scholar's Apprentice.
- Animal-handling/ranch labor is bundled into Farmhand rather than represented as a distinct formative origin.
- Cooking/service has no current backstory coverage.

## Candidate Evaluation Summary

The plan evaluated Militia Levy, Street Vendor, Net-Tender, Gatherer, Scribe's Apprentice, Forge Yard/Forge Hand, Forge Apprentice, Dockhand/Riverhand, Barge Hand, Stablehand, Drover's Hand, Kitchen Hand, Tanner's Yard, Loomhouse, Hidden Blood, Unacknowledged Blood, and Red-Lantern Ward/Courtesan's House.

Safe first-batch candidates were chosen for current skill support, low runtime risk, and ability to stay formative rather than job/class-like. Later candidates were deferred when they overlapped too much with existing records, implied transport/economy/contact/runtime ownership, or fit better as Tier 2/Tier 3 branches.

## Recommended First Batch

- Militia Levy: civic defense and formation exposure; ability-free and weapon-neutral.
- Street Vendor: low-status trade/market exposure without economy effects.
- Net-Tender: fishing and water-safety origin without route, boat, cargo, or contact promises.
- Gatherer: field collection and flora familiarity without healing, alchemy, or item-generation behavior.
- Scribe's Apprentice: mundane records/admin origin separate from magic.
- Drover's Hand: animal handling and ranch support without mounts or riding.
- Kitchen Hand: cooking/service routines without inn ownership, contacts, or discounts.

If Version 0.5.49 needs a smaller content pass, the plan recommends keeping the first five: Militia Levy, Street Vendor, Net-Tender, Gatherer, and Scribe's Apprentice.

## Deferred/Later Candidates

- Dockhand / Riverhand: later Tier 1 after Net-Tender proves the river/coastal lane.
- Barge Hand: later, because cargo/route/transport implications need clearer ownership.
- Forge Yard / Forge Hand: later, only with low-status wording that avoids skilled forge overreach.
- Forge Apprentice: Tier 2, not Tier 1.
- Stablehand: safe alternate, but Drover's Hand better avoids mount-adjacent framing.
- Tanner's Yard and Loomhouse: current skills exist, but better for a later craft/textile pass.
- Hidden Blood, Unacknowledged Blood, Red-Lantern Ward, and Courtesan's House: special/deferred until family, ancestry, status, patronage, stigma, and contact ownership exist.

## Skill-ID Support Notes

Current canonical skill ids support the recommended batch:

- `skill.combat.tactics.formation_discipline`
- `skill.settlement.trade`
- `skill.resource.fishing`
- `skill.resource.gathering`
- `skill.settlement.administration`
- `skill.survival.animal_handling`
- `skill.crafting.cooking`

Additional checked current ids include `skill.survival.water_safety`, `skill.survival.swimming`, `skill.settlement.logistics`, `skill.crafting.smelting`, `skill.crafting.blacksmithing`, `skill.settlement.ranching`, `skill.crafting.tanning`, and `skill.crafting.weaving`.

## Content Implementation Guardrails

- Add only approved Tier 1 records in Version 0.5.49.
- Use existing canonical skill ids only.
- Keep starting skills at or below the current starter cap and preserve starter-skill validation limits.
- Do not add starting abilities.
- Do not add unlock logic, resolver behavior, hidden availability, schema changes, account/save changes, runtime effects, or generated UI output.
- Do not add market passives, contacts, mounts, riding/cavalry behavior, route authority, cargo behavior, healing/surgery behavior, heir legitimacy, magic access, or institution privileges.
- Keep all names and descriptions framed as formative origin, household exposure, low-status labor, or early practical habits rather than current profession or class identity.
- Align non-runtime policy metadata in the same later content pass if records are added.

## Checks Run

- `git status --short`: before edits, clean worktree.
- `git status --short`: after planning edits, expected docs-only changes.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `git diff --check`: passed. Git printed LF-to-CRLF working-copy warnings only.

Broad tests were not run because this was a docs-only planning pass and no tests/content/runtime files were changed.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No metadata JSON changed.
No character creator, starter skill, Legacy, save/account, combat, magic, economy, progression, launcher UI, generated UI output, or availability behavior changed.

## Risks / Follow-Up

- Militia Levy is combat-adjacent and must stay ability-free, weapon-neutral, and non-elite when implemented.
- Scribe's Apprentice must stay mundane and avoid arcane lore, mana, spellcasting, or institution privilege.
- Street Vendor and Kitchen Hand must not imply passive economy effects, contacts, discounts, or ownership.
- Drover's Hand must not imply mounts, riding, cavalry, or animal-ownership runtime.
- Version 0.5.49 should remain a narrow content-only batch with focused validation.

## Next Recommended Version

Version 0.5.49 - Tier 1 Backstory Content Batch

## Suggested Commit Message

docs(content): plan first tier one backstory batch
