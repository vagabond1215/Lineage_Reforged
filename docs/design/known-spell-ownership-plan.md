# Known Spell Ownership Plan

Date: 2026-05-22
Route: ChatGPT via GitHub Connector
Status: planning source for `Version 0.5.83 - Known Spell Ownership Plan`

## Purpose

Plan known-spell ownership and acquisition boundaries before any runtime magic casting, catalyst behavior, scroll/tome behavior, or Magic Legacy power is implemented.

This plan turns `docs/design/magic-runtime-readiness-audit.md` into a Codex-ready planning source for future magic work.

This plan does not:

- add spells
- edit spell metadata
- add known-spell state
- add cast commands
- add catalyst effects
- add scroll/tome behavior
- add magic skill gain
- add Magic Legacy power
- expand combat magic runtime
- edit UI
- edit generated output

## Current Magic Readiness Reality

Current repo is strongest at:

- Level 0: design-only
- Level 1: metadata validation
- Level 2: read-only presentation

The current safe foundation includes:

- classless magic charter
- model: known spell + equipped conduit/casting tags + optional catalyst + control capacity
- compatibility tags as metadata only
- catalyst tiers as design-only modifiers
- read-only Arcane Compendium / compatibility warnings
- spell hook classification as runtime, classifier, deferred, and unknown groups
- explicit warnings for deferred or unknown hooks

Do not skip ownership and narrow-cast planning.

## 0.5.83 Recommended Output

`Version 0.5.83 - Known Spell Ownership Plan` should produce a planning document or refine this one after local repo inspection.

It should not implement known-spell state unless the user explicitly re-scopes the run.

## Ownership Questions To Resolve

Before runtime casting, define:

- where known spells live
- how a spell becomes known
- whether known spells are character-scoped, family-scoped, account-scoped, item/document-scoped, institution-scoped, or mixed
- whether learned spells persist after death
- whether families can preserve magical traditions
- whether scrolls/tomes teach, temporarily grant, or only reference spells
- whether Magic Legacy supports access lanes only or any stronger effect later
- how known-spell state relates to spell metadata validation

## Candidate Ownership Model

Preferred early model:

- Character-known spells first.
- Account/family/institution access should not imply knowledge automatically.
- Scroll/tome/document ownership should be separate from known-spell state.
- Legacy support may unlock access to teachers/traditions later, not direct spell power.
- Magic skill gain must remain policy-routed and source-capped.

Deferred scopes:

- family magical tradition inheritance
- institution spell licensing
- item/document-granted temporary access
- account-wide spell knowledge
- Magic Legacy power/support
- catalyst runtime effects

## Data Shape Planning

Future planning should define:

- `knownSpellId` or equivalent owner record id
- owner scope
- spell id
- acquisition source
- acquisition time/run/character
- training/teacher/institution/source item when applicable
- current availability state
- forgotten/lost/revoked/blocked state if supported
- validation against spell catalog

## Runtime Casting Blockers

Runtime cast commands need explicit answers for:

- equipped conduit source
- conduit tag resolution
- catalyst source and consumption/persistence
- control capacity calculation
- MP/stamina/strain cost payment
- failure/backlash/collateral states
- context: combat versus noncombat
- exact spell/effect lane
- unsupported hook handling
- UI command owner
- tests proving blocked hooks remain blocked

## Forbidden Behavior

- Do not grant spell power through Legacy.
- Do not add free starter spell bundles that bypass acquisition.
- Do not make tags execute effects by themselves.
- Do not bypass catalyst/control/MP/strain constraints.
- Do not expand broad runtime magic before one narrow deterministic lane is owned.
- Do not add magic skill-rank grants outside policy.
- Do not add spell knowledge to unrelated characters without an explicit owner and evidence path.

## Future Tests

Future implementation tests should prove:

1. Known-spell ownership validates against spell catalog.
2. Unknown/deferred spell hooks remain blocked.
3. Character-owned spells do not become account-owned automatically.
4. Family/institution/document access does not imply character knowledge unless an explicit acquisition rule exists.
5. Legacy support does not grant direct power.
6. Casting cannot proceed without known spell, conduit, cost, and supported hook.
7. Magic skill gain remains policy-routed and source-capped.
8. Save/account shapes remain current-data direct.

## Validation For Future Passes

Future Codex planning/implementation should run:

- `npm.cmd run tool:content-lint`
- spell compatibility / Arcane Compendium focused tests if present
- new known-spell ownership tests if implemented
- `git diff --check`

Do not run broad typecheck unless typecheck target policy has been cleaned up and the prompt explicitly asks for it.