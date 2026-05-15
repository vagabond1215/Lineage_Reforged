# Current Codex Output

Source version/run: Version 0.5.44 - Tiered Backstory Lane And Naming Design Audit
Date: 2026-05-15
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added a planning-only design document for future tiered, branching Backstory Legacy lanes and naming guidance before any new backstory records or runtime eligibility logic are added.

## Files Inspected

- `README.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`
- `packages/content/base/player/backstories.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/abilities.json`
- `packages/content/base/player/achievements.json`
- `docs/design/backstory-policy-metadata.json`
- `docs/design/backstory-policy-metadata.md`
- `docs/design/legacy-upgrade-catalog-draft.json`

## Files Changed

- `docs/design/backstory-tiered-lane-design.md`
- `docs/dev/current-codex-output.md`

## Core Design Decisions

- Backstories are formative origins and inherited life-shaping experiences, not current jobs, hard classes, or permanent build restrictions.
- Future Backstory Legacy should use branching lanes instead of assuming every origin is a straight upgrade chain.
- A character selects one backstory; prior tier bonuses never stack with the selected higher-tier origin.
- Legacy purchases alone must not create unsupported competence. Family, ancestry, institution, skill, achievement, reputation, chronicle, and source-run evidence should be tracked separately before eligibility is implemented.
- Higher-tier origins may start at or below a prior tier cap, grow faster or farther, and optionally receive one narrow contextual effect.

## Naming Convention Summary

- Use `Family` when bloodline or ancestry is central.
- Use `Household` when formative environment matters more than blood.
- Use `-Raised` for social, institutional, or circumstantial upbringing.
- Use `Ward` for being raised under a person, order, guild, temple, garrison, patron, or institution.
- Use `Kin` for hard labor or trade-culture identity.
- Use `Apprentice` for formal or semi-formal training under another.
- Use `Borne`, `Line`, `Tradition`, and `Oathline` sparingly for higher-tier or storied origins.
- Avoid making every trade or hardship use the same pattern.

## Tier / Branch Model Summary

- Tier 1: common, low-skill, hardship, labor, local, or basic formative origins with small bonuses, low caps, easy/default/early access, and broad replay variety.
- Tier 2: trained household, local institution, specialized role, recognized trade, or branch specialization requiring Tier 1 progress plus actual play evidence.
- Tier 3: established lineage, elite institution, advanced reputation, oathline, trade house, master lineage, or prestigious branch requiring several runs and lane-specific proof.
- Example branches were sketched for combat/militia, trade, craft, river/coastal, medicine/herbal, scholar/institution, temple/oath, and social/lineage complication lanes.

## Heir-Origin / Status Summary

- Illegitimate, hidden, disputed, adopted, fostered, temple-raised, guild-raised, courtesan-house, and red-lantern origins should be future lineage and social-status concepts, not cheap starter flavor.
- Future modeling should separate blood inheritance, legal claim, public recognition, estate rights, social stigma, household formation, and patron protection.
- Courtesan or red-lantern related origins should be treated as social or institutional upbringing, patronage, rumor, survival, and stigma. They must not sexualize minors or use shock value.

## Backlog / Runtime Boundaries

- Mounted combat remains deferred until mounts, combat, travel, and ownership systems exist.
- Paladin, dragoon, swordmaster, knightly, and other elite identities remain deferred until combat, magic, renown, faction, household, and institution systems support them.
- Heir legitimacy and status remain deferred until family and ancestry data models exist.
- Market-passive effects remain deferred until economy interaction surfaces exist.
- Institution contacts remain deferred until reputation, faction, contact, dialogue, or contract systems exist.
- Arcane, divine, medicine, shipping, and trade-house effects remain planning-only until their runtime owners exist.

## Updated Recommended Prompt Pipeline

- Version 0.5.45 - Backstory Naming Convention Content Pass
  - Purpose: review current live names against the naming philosophy and decide keep/rename/split-later outcomes.
  - Likely files: `packages/content/base/player/backstories.json`, `docs/design/backstory-policy-metadata.json`, `docs/dev/current-codex-output.md`.
  - Out of scope: new records, runtime availability, eligibility logic, starter skill changes, save/account/schema changes.
  - Type: content-only plus non-runtime metadata notes.
- Version 0.5.46 - Tiered Backstory Lane Metadata Draft
  - Purpose: draft non-runtime tier, lane, branch, prerequisite, cap, and extra-effect metadata.
  - Likely files: `docs/design/backstory-policy-metadata.json`, `docs/design/backstory-policy-metadata.md`, `docs/dev/current-codex-output.md`.
  - Out of scope: resolver implementation, creator integration, live Legacy purchases, starter skill behavior.
  - Type: metadata-only planning.
- Version 0.5.47 - Backstory Coverage First-Batch Plan
  - Purpose: choose the first safe Tier 1 coverage gaps before adding records.
  - Likely files: `docs/design/backstory-tiered-lane-design.md`, `docs/future_content_backlog.md`, `docs/dev/current-codex-output.md`.
  - Out of scope: adding records, runtime eligibility, elite branches, heir implementation, mounts, paladins, dragoons, magic, economy effects.
  - Type: docs-only planning.
- Version 0.5.48 - Tier 1 Backstory Content Batch
  - Purpose: add a small approved first batch of safe Tier 1 records using current canonical skill ids.
  - Likely files: `packages/content/base/player/backstories.json`, `docs/design/backstory-policy-metadata.json`, `docs/future_content_backlog.md`, `docs/dev/current-codex-output.md`, focused tests only if validation requires them.
  - Out of scope: Tier 2/Tier 3 records, runtime unlock logic, schemas, creator behavior changes beyond content validation effects, elite branches, mounts, paladins, dragoons, heir claims, market passives, contacts.
  - Type: content-only with non-runtime metadata alignment.
- Version 0.5.49 - Backstory Eligibility Resolver Plan
  - Purpose: plan runtime-safe resolver inputs, evidence ownership, explainability, non-stacking selection, cap rules, and migration boundaries.
  - Likely files: new or existing `docs/design/*` resolver planning document, `docs/future_content_backlog.md`, `docs/dev/current-codex-output.md`.
  - Out of scope: implementing the resolver, schemas, live creator filtering, Legacy purchase behavior, starter skill application, save/account migrations.
  - Type: runtime planning only.

## Checks Run

- `git status --short`: before edits, clean worktree.
- `git status --short`: after adding the design doc, showed `?? docs/design/backstory-tiered-lane-design.md`.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `git diff --check`: passed.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No content JSON changed.
No backstory records were added, removed, renamed, or modified.
No character creator, starter skill, Legacy, save/account, combat, magic, economy, progression, launcher UI, or availability behavior changed.

## Risks / Follow-Up

- The new lane document is intentionally non-runtime planning. Later prompts must still protect runtime boundaries before adding metadata, content, or eligibility logic.
- Several attractive Tier 3 names are high risk because they imply class-like power or unsupported systems. They should remain deferred until their runtime owners exist.
- If the next content pass renames current live records, it should keep scope narrow and avoid mixing naming cleanup with new records or resolver work.

## Next Recommended Version

Version 0.5.45 - Backstory Naming Convention Content Pass

## Suggested Commit Message

docs(content): design tiered backstory lanes
