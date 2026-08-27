# Connector-Safe Pass 9 - Player Stats Data Dictionary Current-State Repair

Date: 2026-08-27

Status: COMPLETE

Execution surface: ChatGPT via GitHub Connector; documentation-only maintenance

Source head: `b50ada125c0bcba7c61fa31b477d9b375f46a733`

Protected active route: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

## Purpose

Repair `docs/data-dictionary/player-stats.md` so it describes the live classless character/progression catalogs and clearly separates executable runtime authority, authored relationship metadata, historical FFXI provenance, and retained compatibility fields.

## Inputs

- `docs/design/attribute-skill-ability-responsibility-audit.md`;
- `docs/design/classless-progression-and-placeholder-provenance-audit.md`;
- live player attribute/skill/ability/spell/trait catalogs;
- live player resource, progression, stat-growth, origin, and creator owners.

## Success Criteria

- remove false current claims about job traits/job abilities/future class taxonomy;
- preserve historical provenance without presenting it as current gameplay authority;
- state the live nine-attribute, 1-125 skill, classless creator, Echo, use-driven stat-growth, and compatibility-field posture accurately;
- distinguish `attributes.json` hints from current runtime resource formulas;
- do not rewrite production/content/schema/test behavior;
- active Codex prompt remains byte-identical.

## Expected Changes

- this plan;
- `docs/data-dictionary/player-stats.md` only.

## Exclusions

No player balance changes. No catalog edits. No schema edits. No removal of `classId`, `jobId`, `classLevel`, class profiles, or save compatibility. No prompt/output/handoff modification.


## Completion Appendix

Result: `DOC_REPAIR_COMPLETE`

Updated:
- `docs/data-dictionary/player-stats.md`

The repaired dictionary now:
- describes the live classless creator instead of a future class taxonomy;
- records current catalog sizes and the current trait posture;
- separates declarative governing-attribute metadata from executable runtime formulas;
- records the live resource formula and its drift from `attributes.json` hints;
- records use-driven stat growth, attribute tension, Echo, and compatibility-field boundaries;
- preserves FFXI provenance as historical/reference input rather than current job/class authority;
- corrects the storage table name from nonexistent `player_progression_models` to live `player_progression_tracks`.

No production/content/schema/test/prompt/output/handoff behavior changed.
