# Magic Runtime Readiness Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Status: promoted readiness audit; no runtime/source/UI/content changes

0.5.83 sequencing note: this audit has been promoted into `docs/design/known-spell-ownership-plan.md`, which is the active source for `Version 0.5.83 - Known Spell Ownership Plan`. Keep this audit for source detail, but do not treat historical prompt targets in this file as current pipeline authority.

## Purpose

This audit checks what is already safe for magic presentation and what remains blocked before any runtime magic expansion.

It exists to prevent the project from jumping from metadata/read-only UI into broad spell execution, catalyst behavior, acquisition, or Magic Legacy power without owner boundaries.

This document does not:

- add spells
- edit spell metadata
- add known-spell ownership
- add cast commands
- add catalyst effects
- add scroll/tome behavior
- add magic skill gain
- add Magic Legacy power
- expand combat magic runtime
- edit UI
- update generated UI output
- update `docs/dev/current-codex-output.md`

## Sources Inspected

- `docs/design/magic-system-charter.md`
- `docs/design/future-system-design-ledger.md`
- `apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts`
- search results for Arcane Compendium / spell compatibility surfaces

## Current Safe Foundation

The project already has a strong metadata/read-only base:

- magic charter defines classless magic and the primary model: known spell + equipped conduit/casting tags + optional catalyst + control capacity
- compatibility tags are explicitly metadata and must not directly execute effects
- catalyst tiers are design-only modifiers, not runtime effects
- spell acquisition is future-only
- magic skill gain must later route through `resolveSkillRankGainPolicy(...)`
- Magic Legacy direct power is forbidden early
- Arcane Compendium presentation is read-only and explicitly says it does not create player spell state, loadouts, command buttons, or runtime effects
- `spellCompatibilityPresentation.ts` classifies spell hooks into runtime, classifier, deferred, and unknown groups for presentation warnings
- warnings already block unknown/deferred hooks in presentation copy rather than pretending runtime support exists

## Runtime Readiness Levels

Use these levels when reviewing magic work:

| Level | Meaning | Allowed work |
| --- | --- | --- |
| 0 | Design-only | docs, charter, taxonomy, vocabulary |
| 1 | Metadata validation | tags, families, catalyst metadata, lint/tests |
| 2 | Read-only presentation | Arcane Compendium, compatibility display, warnings |
| 3 | Ownership model | known-spell state, acquisition source, character/account boundaries |
| 4 | Narrow cast lane | one deterministic cast path with explicit effect owner |
| 5 | Catalyst modifier lane | bounded catalyst interaction for already-owned narrow cast path |
| 6 | Progression lane | policy-routed magic skill gain with source caps |
| 7 | Document lane | scroll/tome/inscription ownership |
| 8 | Legacy lane | access/support only, not direct spell power |

Current repo is strongest at Levels 0-2. Do not skip Levels 3-4.

## Blockers Before Runtime Casting

Before any new runtime magic execution, the project needs explicit answers for:

- where known spells live
- how a spell becomes known
- whether known spells are character-scoped, family-scoped, account-scoped, or item/document-scoped
- which equipped conduits are inspected
- how conduit tags are resolved from item instances or item profiles
- how control capacity is calculated
- how MP/stamina/strain costs are paid
- what failure/backlash/collateral states exist
- which exact spell/effect is in scope
- how the UI issues a cast command
- how combat/noncombat contexts differ
- which tests prove unsupported hooks remain blocked

## What Can Safely Happen Next

Safe next passes:

1. Read-only Arcane Compendium polish.
2. Compatibility metadata audit for missing profiles, unknown hooks, deferred hooks, and catalyst metadata gaps.
3. Known-spell ownership design, planning-only.
4. Conduit ownership design, planning-only.
5. One-spell runtime plan, planning-only.

Potential first runtime candidate should be narrow, deterministic, and already hook-supported. Avoid broad families such as summoning, enchantment, scrolls, ritual magic, affinity/resistance matrices, or generated-item spells.

## Forbidden Near-Term Work

- broad runtime spell execution
- generic tag-driven effect execution
- catalyst effects without cast lane owner
- magic acquisition without ownership model
- direct magic skill-rank grants
- Magic Legacy spell power
- free starter spell bundles that bypass acquisition
- scroll/tome behavior before document systems
- affinity/resistance matrix before narrow runtime slices
- spell additions disguised as readiness work

## Recommended First Planning Target

The next good magic planning target is not runtime. Current prompt generation should use `docs/design/known-spell-ownership-plan.md` and the sequenced queue, not historical version examples in this audit.

Goal:

- define where known spells live
- define acquisition source records
- define character/account/family/item/document scope boundaries
- define what the read-only compendium can and cannot do with known-spell state
- keep casting disabled

## Minimum Acceptance Criteria For Any Runtime Magic Prompt

Any future prompt that touches runtime magic must state:

- exact spell(s) in scope
- exact hook(s) in scope
- exact command path
- exact cost path
- exact ownership path for known spell state
- exact conduit/catalyst assumptions
- explicit unsupported hooks that remain blocked
- focused tests
- no Magic Legacy direct power
- no generic tag execution

## Current Prompt Authority

Use `docs/design/known-spell-ownership-plan.md` and `docs/dev/codex-sequenced-implementation-plan.md` for current prompt generation. This audit remains a source-detail reference only.