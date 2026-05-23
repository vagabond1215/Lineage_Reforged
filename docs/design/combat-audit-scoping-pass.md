# Combat Audit Scoping Pass

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Status: promoted audit scope; no runtime/source/UI/content changes

0.5.82 sequencing note: this audit has been promoted into `docs/design/combat-equipment-mapping-audit-plan.md`, which is the active source for `Version 0.5.82 - Combat Equipment Mapping Audit`. Keep this audit for source detail, but do not treat historical prompt targets in this file as current pipeline authority.

## Purpose

This audit scopes the highest-ROI combat review areas before any broad combat implementation work.

Combat is explicitly high-risk. Future work should use this as a ranked audit map, not permission to rewrite combat math.

This document does not:

- change combat math
- edit combat source
- edit item/weapon/armor content
- edit skill progression
- add combat UI
- add combat history
- add weapon/crit/skill Legacy effects
- add magic runtime expansion
- add generated UI output
- update `docs/dev/current-codex-output.md`

## Sources Inspected

- `docs/dev/project-roadmap.md`
- `docs/design/future-system-design-ledger.md`
- `packages/engines/game-engine/src/combat/index.ts`
- `docs/future_content_backlog.md` search results for combat deferred notes

## Current Combat Reality

Current combat has several real foundations:

- action templates for melee, ranged, shield block/bash, and several magic/support action lanes
- action-package mapping for enemy/AI action packages
- action family resolution: melee, ranged, magic, shield, support
- deterministic damage preview with offensive stat, defensive stat, skill bonus, item band bonus, title bonus, special bonus, status reduction, equipment reduction, and defensive skill reduction
- equipment reduction from armor/shield handling grants
- defensive skill reduction from defensive skill effect grants
- status effect handling for a set of combat hooks
- player-owned weapon-profile combat skill gains routed through `resolveSkillRankGainPolicy(...)`
- encounter source caps for combat skill-gain attempts

Current high-risk limitations:

- only player-owned `combat.melee.primary` and `combat.ranged.primary` weapon attacks currently produce combat skill-gain candidates
- shield block/bash and armor mitigation candidate reasons exist in types, but the candidate derivation currently only returns `weapon_attack`
- combat damage math is centralized and sensitive
- magic-like combat actions exist as narrow runtime hooks, but broad magic runtime expansion is forbidden unless separately scoped
- action templates and content-granted actions can overlap in ways that need audit before tuning

## Ranked Audit Topics

### 1. Weapon identity and action mapping

Question:

- Do authored item use profiles produce the correct `combat.melee.primary` / `combat.ranged.primary` actions and weapon skill ids?

Inspect in future Codex run:

- item use profiles
- combat action grants
- weapon profile tests
- `deriveCombatSkillGainCandidates(...)`
- `resolveGrantedActionTemplate(...)`

Risk:

- weapon skills may not train if action ids or handling types do not match the narrow candidate derivation.

Recommended output:

- table of weapon families, action type, handling type, skill id, damage hook, trains yes/no, reason.

### 2. Armor, shield, and defensive skill payoff

Question:

- Are armor and shield defensive contributions visible, bounded, and meaningful without dominating combat?

Inspect:

- `resolveEquipmentReduction(...)`
- `resolveDefensiveSkillReduction(...)`
- armor handling grants
- shield profiles
- defensive skill effects

Risk:

- armor/shield may be underfelt, overfelt, or opaque.
- shield skill-gain candidate types exist but are not currently derived.

Recommended output:

- before changing math, produce sample previews for lightly armored, medium armored, heavy armored, and shielded targets.

### 3. Ranged vs melee parity

Question:

- Does ranged combat have fair cost, pacing, defensive interaction, and training behavior compared to melee?

Inspect:

- ranged action templates
- `isRangedWeaponSkillId(...)`
- damage preview stat pair for ranged
- ranged item profiles
- enemy ranged action packages

Risk:

- ranged may train and damage correctly but lack ammo/range/exposure constraints.

Recommended output:

- parity matrix: cost, recovery, stat basis, skill basis, damage hooks, mitigation, training cap, enemy use.

### 4. Combat skill-gain pacing

Question:

- Is the one weapon-attack attempt per skill per encounter enough, too stingy, or abusable?

Inspect:

- `resolveCombatSkillGainAttempts(...)`
- `recordCombatSkillGainAttempts(...)`
- `applyCombatSkillGainAttempt(...)`
- progression policy tests

Risk:

- broadening skill gain before source limits are stable can break progression.

Rules:

- keep gains routed through `resolveSkillRankGainPolicy(...)`
- do not add direct rank mutation outside policy
- do not add weapon/crit/skill Legacy bypasses

### 5. Feedback clarity

Question:

- Does the player understand why damage, mitigation, and skill gains happened?

Inspect:

- combat delta presentation
- skillGainMessages consumer
- UI notification presentation
- combat damage preview availability

Risk:

- combat may be mechanically present but unreadable.

Recommended output:

- list of current player-facing messages and missing reason labels.

### 6. Enemy threat variety

Question:

- Do spawn/enemy action packages create meaningful tactical variety?

Inspect:

- spawn foundation content
- action-package mapping
- enemy combatants/hooks
- status hooks

Risk:

- enemies may look varied in content but collapse into a small set of runtime actions.

### 7. Consumables and item execution

Question:

- What consumable/item actions are runtime-owned and what remains descriptive?

Risk:

- generic item effect execution can become unsafe if added broadly.

Rule:

- audit before implementation; do not add generic tag-driven item execution.

### 8. Magic interaction boundary

Question:

- Which combat magic hooks are narrow runtime behavior and which are classifier/deferred metadata?

Rule:

- do not expand broad runtime magic from combat tuning.
- use the magic runtime readiness audit before magic work.

## Recommended Safe Audit Outputs

A future Codex Local audit can safely produce:

- no source changes, only a report; or
- tests/fixtures only if explicitly scoped; or
- small docs table of current action/weapon/armor mappings

Avoid mixing with:

- damage rebalance
- skill progression changes
- item profile rewrites
- magic expansion
- UI rewrite
- Legacy effects

## Minimum Preflight For Any Combat Implementation

Before changing combat source, inspect:

- `AGENTS.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/design/future-system-design-ledger.md`
- `packages/engines/game-engine/src/combat/index.ts`
- relevant combat tests
- relevant item/ability/spell profile content

Run focused tests, not just broad confidence claims.

## Forbidden Shortcuts

- no broad combat math rewrite without focused tests
- no direct skill rank grants outside `resolveSkillRankGainPolicy(...)`
- no magic runtime expansion under combat-audit label
- no generic hook/tag effect execution
- no weapon/crit/skill Legacy power until ownership and progression gates exist
- no hidden balance changes inside unrelated feature work

## Current Prompt Authority

Use `docs/design/combat-equipment-mapping-audit-plan.md` and `docs/dev/codex-sequenced-implementation-plan.md` for current prompt generation. This audit remains a source-detail reference only.