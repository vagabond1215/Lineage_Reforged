# Connector-Safe Pass 7 - Attribute, Skill, Ability, And Spell Responsibility Audit

Date: 2026-08-27

Status: COMPLETE

Execution surface: ChatGPT via GitHub Connector; documentation-only repository inspection

Source head: `cfb569c7f196e71e2f63451dc583f54ad31cd0b2`

Protected active route: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

## Purpose

Map the live classless character model from the nine primary attributes through skills, abilities, spells, resources, stat growth, traits, creator/origin modifiers, combat/runtime consumers, and overall progression. Identify overlap, underuse, overloaded responsibilities, stale class/job-era assumptions, and future design questions without changing balance or implementation.

## Audit Questions

1. What does each of STR, DEX, AGI, CON, VIT, WIS, INT, SPT, and CHA currently own?
2. Which skills, abilities, and spells declare each attribute as governing or required?
3. Which resources and runtime formulas consume each attribute directly?
4. Which attributes participate in use-driven stat growth, recovery capacity, attribute tension, and Echo?
5. Which lineage/backstory/creator or trait surfaces modify attributes or their downstream effects?
6. Where do paired attributes overlap materially: DEX/AGI, CON/VIT, WIS/SPT, and INT/WIS?
7. Which current records still depend on historical class/job/FFXI placeholder assumptions?
8. Does any attribute currently lack enough distinct mechanical responsibility to justify remaining separate?
9. Which findings are current architecture, balance debt, placeholder content debt, or future design questions?

## Success Criteria

- all nine attributes receive a responsibility profile;
- current catalog reference counts are recorded where Connector inspection can establish them safely;
- live resource/stat-growth/Echo relationships are separated from descriptive hints;
- skill, ability, spell, trait, and creator relationships are distinguished;
- no attribute merge/split/rebalance is authorized by this audit;
- no source, content, schema, tracked test, prompt, output, handoff, branch, or PR is modified;
- the active prompt blob remains `064749af0435e839df71fe4619ccc30d7ce4ff35`.

## Expected Output

- `docs/design/attribute-skill-ability-responsibility-audit.md`;
- completion appendix in this plan.


## Completion Appendix

Result: `AUDIT_COMPLETE_PRESERVE_NINE_PENDING_FOCUSED_DESIGN`

Completed outputs:
- `docs/design/attribute-skill-ability-responsibility-audit.md`
- this completed plan

Key findings:
- preserve all nine primary attributes;
- resource metadata and live resource formulas have drifted and require a future focused reconciliation;
- skill/ability/spell governing-attribute metadata is ahead of generic runtime execution/gating;
- current production stat-growth profiles cover STR/DEX/AGI/CON/VIT/WIS but not INT/SPT/CHA;
- ordinary new creators are classless (`classId: null`, class level `0`) while legacy class-resource scaffolding remains compatibility debt;
- no production, content, schema, test, prompt, output, handoff, branch, or PR mutation occurred.

Follow-up selected: `Classless Progression And Placeholder Provenance Audit`.
