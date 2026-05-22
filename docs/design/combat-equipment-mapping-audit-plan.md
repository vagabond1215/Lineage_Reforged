# Combat Equipment Mapping Audit Plan

Date: 2026-05-22
Route: ChatGPT via GitHub Connector
Status: planning source for `Version 0.5.82 - Combat Equipment Mapping Audit`

## Purpose

Plan a focused combat/equipment mapping audit before any combat math, balancing, or skill-gain behavior changes.

This plan turns `docs/design/combat-audit-scoping-pass.md` into a Codex-ready source for a future audit and only then narrow fixes.

This plan does not:

- change combat math
- edit combat source
- edit item/weapon/armor content
- edit skill progression
- add combat UI
- add combat history
- add weapon/crit/skill Legacy effects
- expand magic runtime
- edit generated UI output

## Current Source Reality

Current combat already has foundations:

- action templates for melee, ranged, shield block/bash, magic/support lanes
- action-package mapping for enemy/AI action packages
- action family resolution
- deterministic damage preview with offensive/defensive stats, skill bonuses, item band bonuses, title/special/status/equipment/skill reductions
- armor/shield handling grants feeding equipment reduction
- defensive skill reduction hooks
- status effect hooks
- player-owned weapon-profile skill gains routed through `resolveSkillRankGainPolicy(...)`
- encounter source caps for combat skill-gain attempts

Known high-risk limitations:

- only player-owned `combat.melee.primary` and `combat.ranged.primary` weapon attacks currently produce combat skill-gain candidates
- shield/armor mitigation candidate reasons exist in types but candidate derivation is narrower
- damage math is centralized and sensitive
- magic-like combat hooks exist but broad magic runtime expansion is separately deferred

## 0.5.82 Recommended Output

`Version 0.5.82 - Combat Equipment Mapping Audit` should produce audit tables and narrow recommendations.

It should not implement math changes unless the prompt is explicitly revised after the audit.

## Audit Tables To Produce

1. Weapon family mapping table:
   - item/use profile
   - action id
   - action family
   - handling type
   - skill id
   - trains yes/no
   - reason

2. Armor/shield mapping table:
   - armor/shield profile
   - granted handling/effect
   - equipment reduction source
   - defensive skill source
   - preview visibility
   - likely player-facing clarity gap

3. Skill-gain candidate table:
   - action family
   - current candidate reason
   - supported/unsupported
   - owner/source cap
   - risk

4. Sample preview matrix:
   - unarmored target
   - light armor
   - medium armor
   - heavy armor
   - shielded target
   - ranged attacker
   - melee attacker

## Guardrails

- Audit before fixes.
- Do not rewrite damage formulas.
- Do not change skill progression policy.
- Do not add new Legacy effects.
- Do not expand magic runtime.
- Do not rebalance content as part of mapping inspection.
- Do not add combat UI before data clarity exists.

## Future Narrow Fix Candidates

Only after the audit:

- missing weapon training mappings if a profile/action mismatch is proven
- shield skill-gain candidate derivation if current policy and tests support it
- armor/shield clarity labels if preview data exists but is not readable
- presentation-only preview explanations before formula changes

## Future Tests

Future audit/fix tests should prove:

1. melee weapon profiles map to expected melee actions and skill ids.
2. ranged weapon profiles map to expected ranged actions and skill ids.
3. non-weapon actions do not train weapon skills accidentally.
4. shield block/bash behavior is documented before candidate changes.
5. armor/shield mitigation is visible in preview data if supported.
6. any fix does not alter broad combat formula outputs unless explicitly scoped.
7. magic/support actions remain separate from weapon mapping.

## Validation For Audit/Fix Pass

Future Codex pass should run:

- `npm.cmd run tool:content-lint`
- focused combat tests if present
- any new audit/mapping tests
- `git diff --check`

Do not run broad typecheck unless typecheck target policy has been cleaned up and the prompt explicitly asks for it.