# Lineage: Reforged - Strategic Continuity Brief

Updated 2026-07-26 after fail-closed `0.6.6` preflight and activation of `0.6.6.1`.

## Purpose

This brief is the strategic north star and compact source map for Lineage: Reforged. Detailed current state and implementation guidance live in the specialized repository documents.

## Source Map And Precedence

- `docs/dev/current-codex-prompt.md` owns the active copy-paste Codex prompt.
- `docs/dev/current-gpt-handoff.md` owns immediate connector-side guardrails and route order.
- `docs/dev/current-codex-output.md` owns the latest exact inspection or implementation report.
- `docs/dev/historical-version-and-deferred-route-register.md` owns canonical route identities, active/deferred posture, and reopening triggers.
- `docs/design/current-planning-anchor-reconciliation.md` controls conflicts caused by stale current-anchor wording in the roadmap or sequenced plan.
- `docs/dev/project-roadmap.md` owns version-band meaning, playability checkpoints, and non-conflicting long-term direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns detailed historical sequencing and non-conflicting queue context.
- `docs/design/static-content-expansion-program.md` owns the `0.6.4`-`0.6.7` static milestone and static/runtime boundary.
- `docs/design/static-content-restoration-and-mortality-research-sequencing-decision.md` owns the post-static route order and research timing.
- occurrence, save/Stakes, Mortal Crisis, narrative, elemental, nutrition, injury, combat, quest/event/Chronicle, and other focused decisions remain controlling at their named seams.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` is broad future context only, not implementation permission.
- `docs/future_content_backlog.md` owns chronological deferred notes and run history.

## Current Repository Anchor

- Latest completed primary: `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`.
- Active primary: `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`.
- Active support suffix: `Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`.
- Active support prompt blob: `93d2a29e1cbc8dd931a243becfbbeab2ed8a69a0`.
- Preserved exact parent prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Reserved next primary: `Version 0.6.7 - Cross-Content Coherence And Coverage Audit`.

The parent content package is fail-closed before authoring because its untouched mandatory test baseline produced 142/146 passes. The four failures are BOM parse failures in two test readers, not content-reference or matrix defects.

## Immediate Sequence

1. repair the two BOM-sensitive test readers in `0.6.6.1`;
2. require the exact baseline to pass at 146/146 and keep all JSON data byte-unchanged;
3. restore and execute exact `0.6.6`;
4. run `0.6.7` cross-content coherence and coverage audit;
5. run Geographic Knowledge Taxonomy And Location Recognition Contract Plan;
6. run Activity Resolution Existing-System Reuse Audit;
7. run Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision;
8. run bounded physiology/first-aid research only before the first executable or balance-bearing lethal-process catalog;
9. proceed through separately authorized owner-specific packages.

## Current Implementation Reality

- Player travel, quest acceptance, repaired quest tracking, and activity selection are engine-owned and accepted.
- `0.6.4` added the accepted world/settlement static package.
- `0.6.5` added the accepted 16-row recipe batch for 28 recipes across 10 families.
- The exact `0.6.6` target remains valid: nine monsters, nine fauna lineages, nine ecology additions, and 28 source-local drop rows.
- `0.6.6.1` may change only `tests/unit/region-first-world-data.test.mjs` and `tests/unit/slug-content.test.mjs`, plus completion coordination.
- BOM-bearing JSON files must not be rewritten as cleanup.
- Static content does not authorize spawning, encounters, AI, dynamic loot, harvesting, populations, migration, ecology simulation, inventory mutation, or rewards.
- Generic event ids remain collision-prone compatibility projections; occurrence authority is accepted but not implemented.
- Current hashes and random mechanisms are not accepted named uncertainty-channel authority.
- Current HP zero may still enter legacy terminal archival and save deletion.
- No active injury instance, lethal-process owner, care receipt, body/restoration runtime, or correction tool exists.

## Research And Content Posture

No new broad research is needed before the support repair, `0.6.6`, `0.6.7`, Geography/recognition planning, the repository-only Activity Resolution reuse audit, or the abstract Mortal Crisis receipt decision.

Before the first executable or balance-bearing lethal-process catalog, run bounded research on hemorrhage/shock, airway compromise and drowning, poisoning and antidote limits, thermal exposure, burns, stabilization versus definitive care, transport/reassessment, and observer-safe urgency. Do not directly import clinical protocols, exact real-world timers, medical advice, or proprietary game values.

Expand content only through the exact `0.6.6` package after the baseline repair. Keep injury/care catalogs, dynamic ecology, NPC/faction/institution content without authored sources, dynamic economy/inventory/crafting, resurrection or rare-healer content, maps/recognition clues, generic POIs, and activity-resolution content deferred behind their recorded gates.

## North Star

Lineage: Reforged is a grounded medieval-fantasy, dynasty-driven systemic RPG. Its strongest identity is persistent history: characters live, struggle, earn status, create records, found or continue families, alter local standing, and pass limited but meaningful inheritance into future play.

Every major system should answer at least one of these questions:

- What did this character do?
- Who remembers it?
- Which family owns it?
- Where is it recognized?
- What can be carried forward?
- What remains dangerous, limited, or uncertain despite inheritance?

## Core Development Rules

- Use current branch reality only.
- Prefer the smallest coherent, owner-correct package.
- Fail closed when a mandatory baseline is red.
- Do not weaken validation unless it is demonstrably stale or wrong.
- Preserve historical chronology while keeping live execution pointers current.
