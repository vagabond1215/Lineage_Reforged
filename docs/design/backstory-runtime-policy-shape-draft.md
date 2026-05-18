# Backstory Runtime Policy Shape Draft

Source version/run: Version 0.5.53 - Backstory Runtime Policy Shape Draft
Date: 2026-05-18
Status: planning-only runtime policy shape draft

## Purpose

This document drafts the shape of a future runtime-approved Backstory Eligibility policy. It is a design document only. It should not be imported by runtime, treated as schema, or used by character creation.

Current branch reality for this pass:

- The live backstory catalog has 27 records.
- `docs/design/backstory-policy-metadata.json` remains non-runtime planning metadata with `status: "non_runtime_policy_draft"` and `runtimeImportAllowed: false`.
- `docs/design/legacy-upgrade-catalog-draft.json` remains non-runtime with `runtimeImportAllowed: false`.
- Current character creation builds backstory options from every live record in `packages/content/base/player/backstories.json`.
- Current character creation validation checks whether a selected backstory id is known, then checks settlement-start access separately.
- Current new-game snapshot creation applies the selected backstory starter skills and ability allowlist directly.
- Current Legacy runtime has account, preparation, resource-start, renown-display, and passive starter-skill policy seams, but no Backstory Eligibility Resolver.

This draft exists so a later implementation can design tests and runtime policy data without consuming the loose planning metadata directly.

## Non-Goals

This document does not:

- create runtime policy data
- implement the Backstory Eligibility Resolver
- add schemas or typed runtime contracts
- add creator filtering or locked-backstory UI
- change live backstory availability
- change starter skills, starting abilities, attributes, save data, account data, or Legacy behavior
- add Legacy purchases for backstories
- import `docs/design/backstory-policy-metadata.json` into runtime
- change combat, magic, economy, progression, launcher UI, generated UI output, or live content records

## Runtime Policy Separation

A future runtime policy must be a separate approved file or typed data shape. It must not directly consume:

- `docs/design/backstory-policy-metadata.json`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `futureBackstoryLaneDrafts[]`
- design documents under `docs/design/`

Reasons:

- Design metadata is intentionally loose, descriptive, and planning-oriented.
- Runtime policy needs stricter validation than planning metadata.
- Runtime policy needs explicit source attribution, scope behavior, current-data behavior, missing-data behavior, and blocked-owner behavior.
- Runtime policy needs tests proving that design-only drafts cannot affect creator availability.
- Future policy data must be owned by the runtime implementation that consumes it, not by documentation.

The eventual runtime policy may copy reviewed intent from planning documents, but it must do so through a deliberate implementation and test pass.

## Proposed Top-Level Policy Shape

This is draft documentation only, not a schema and not live policy data.

```json
{
  "schemaVersion": 1,
  "policyVersion": "draft-only",
  "status": "non_runtime_shape_draft",
  "runtimeImportAllowed": false,
  "contentVersion": "backstory-catalog-current",
  "defaultBackstoryIds": [
    "backstory.local",
    "backstory.vagabond",
    "backstory.exile",
    "backstory.farmhand",
    "backstory.amnesiac"
  ],
  "availabilityRules": [],
  "blockedEvidenceKinds": [],
  "evidenceKindDefinitions": {},
  "scopeDefinitions": {},
  "explainabilityStrings": {}
}
```

Planned field meanings:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Runtime data contract version once a schema exists. |
| `policyVersion` | Authored policy version used for current-data validation and test fixtures. |
| `status` | Runtime approval state. Drafts should remain non-runtime. |
| `runtimeImportAllowed` | Must remain false for drafts; a future runtime-approved file needs a separate approval gate. |
| `contentVersion` | Catalog/content version the policy was validated against. |
| `defaultBackstoryIds` | Minimum safe fallback ids for new accounts and missing evidence. |
| `availabilityRules` | One reviewed rule per live backstory id, plus explicitly marked future examples in docs/tests when needed. |
| `blockedEvidenceKinds` | Evidence kinds that must never satisfy rules until their owners exist. |
| `evidenceKindDefinitions` | Runtime-owned definitions for evidence kinds, source labels, and owner readiness. |
| `scopeDefinitions` | Runtime-owned definitions for account, family, lineage, source-run, region, faction, institution, estate/title, and special scopes. |
| `explainabilityStrings` | Stable player-safe copy keys or strings for locked/unlocked/deferred states. |

## Availability Statuses

| Status | Selectable? | Visible? | Intended behavior |
| --- | --- | --- | --- |
| `always_available` | Yes | Yes | Baseline origin that is always selectable when its live content record exists. |
| `default_available` | Yes | Yes | New-account fallback option. Should survive missing evidence and broken optional ledgers. |
| `early_legacy` | Usually after purchase or simple evidence | Yes | Low-risk Tier 1 unlock that may use account-level or simple evidence without implying high competence. |
| `locked` | No until requirements pass | Yes | Explainable future unlock with reviewed requirements and supported owner systems. |
| `hidden` | No | No, or only in debug/admin | Spoiler, unsupported, or unsafe to promise in creator UI. |
| `special` | Usually no by ordinary rules | Maybe | Narrative/manual case outside normal tier progression. |
| `deferred` | No | No, or conservative placeholder only | Blocked until runtime owners exist. Must not expose unsupported mechanics as a promise. |

Selectable statuses must still pass current content existence and selected-effect policy. Hidden and deferred statuses must not grant new character creation access.

## Rule Record Shape

One future rule should describe one current live backstory id. Future-only examples in docs should be clearly marked as examples and must not be counted as live policy records.

```json
{
  "backstoryId": "backstory.example",
  "availabilityStatus": "locked",
  "tier": "tier_2",
  "scopePolicy": {
    "primaryScope": "family",
    "allowedEvidenceScopes": ["family", "source_run"],
    "accountWideAllowed": false
  },
  "requiresAny": [],
  "requiresAll": [],
  "requiresLegacyPurchase": {
    "unlockId": "legacy.backstory.example",
    "scope": "family",
    "evidenceRequired": true
  },
  "requiresPrestige": null,
  "requiresEcho": null,
  "requiresEvidence": [],
  "blocksIf": [],
  "starterSkillEvidencePolicy": {
    "starterGrantedAllowed": false,
    "allowedSourceTypes": ["earned_play", "source_run"]
  },
  "selectedBackstoryEffectPolicy": {
    "appliesOnlySelectedBackstory": true,
    "parentEffectsStack": false
  },
  "explainLocked": "backstory.example.locked",
  "explainUnlocked": "backstory.example.unlocked"
}
```

Planned field meanings:

| Field | Meaning |
| --- | --- |
| `backstoryId` | Current live backstory id. |
| `availabilityStatus` | Selection/visibility behavior for this rule. |
| `tier` | Runtime-approved tier classification. Do not blindly copy planning metadata. |
| `scopePolicy` | Which scope owns access and which evidence scopes are acceptable. |
| `requiresAny` | Alternative requirement groups where one group is enough. |
| `requiresAll` | Mandatory requirement groups. |
| `requiresLegacyPurchase` | Optional purchase gate. For Tier 2 and Tier 3, purchase must support evidence, not replace it. |
| `requiresPrestige` | Prestige, renown, or status threshold if owned by a suitable ledger. |
| `requiresEcho` | Echo threshold or peak support if tied to source-run/account evidence. |
| `requiresEvidence` | Flat evidence requirements when grouping is unnecessary. |
| `blocksIf` | Owner missing, evidence blocked, incompatible scope, spoiler, or current content-version block. |
| `starterSkillEvidencePolicy` | Source rules for skill evidence. Starter-granted ranks are excluded by default. |
| `selectedBackstoryEffectPolicy` | No-stacking behavior for selected origin effects. |
| `explainLocked` | Player-safe string key or copy for unmet requirements. |
| `explainUnlocked` | Player-safe string key or copy for satisfied access. |

## Requirement Group Shape

A future requirement expression should be able to represent mandatory requirements, alternatives, nested groups, source provenance, missing data behavior, and blocked owner behavior.

Draft group shape:

```json
{
  "all": [
    {
      "kind": "earned_skill_maximum",
      "scope": "source_run",
      "scopeId": null,
      "skillId": "skill.combat.tactics.formation_discipline",
      "minValue": 25,
      "threshold": null,
      "sourceTypesAllowed": ["earned_play", "source_run"],
      "starterGrantedAllowed": false,
      "requiresEarnedSource": true,
      "ownerReadiness": "ready",
      "missingBehavior": "treat_as_unmet",
      "blockedBehavior": "defer",
      "explain": "Earn matching drill experience in a prior run."
    }
  ]
}
```

Alternative group shape:

```json
{
  "any": [
    { "kind": "family_backstory_history", "backstoryId": "backstory.militia_levy" },
    { "kind": "source_run_evidence", "tag": "militia_service" },
    { "kind": "achievement", "achievementId": "achievement.example.civic_defense" }
  ]
}
```

Nested groups should be allowed only if simpler `requiresAny` and `requiresAll` records cannot express the rule clearly. Tests should cover every nested form before runtime use.

Requirement fields:

| Field | Meaning |
| --- | --- |
| `kind` | Evidence category such as `achievement`, `earned_skill_maximum`, `source_run_evidence`, or `legacy_purchase`. |
| `scope` | Evidence scope, such as account, family, lineage, source_run, region, faction, institution, estate_title, or special. |
| `scopeId` | Optional id for a specific region, faction, institution, title, source run, or family. |
| `minValue` | Numeric minimum, such as rank, count, or threshold value. |
| `threshold` | Named threshold when numeric value alone is not clear. |
| `sourceTypesAllowed` | Allowed provenance labels for the evidence. |
| `starterGrantedAllowed` | Whether starter-granted values can count. Defaults to false for skill evidence. |
| `requiresEarnedSource` | True when evidence must come from play, source-run summary, or another earned source. |
| `ownerReadiness` | Ready, partial, needs owner, blocked, or manual-only. |
| `missingBehavior` | How missing data resolves. |
| `blockedBehavior` | How a blocked owner resolves. |
| `explain` | Stable, player-safe explanation text or key. |

## Scope Policy

Rules should declare the scope that owns unlock authority and the scopes that may supply evidence.

Planned scopes:

| Scope | Use for |
| --- | --- |
| `account` | Broad defaults, tutorial unlocks, content visibility, non-lineage quality-of-life unlocks. |
| `family` | Household memory, family skill maxima, family trade/craft/garrison history, inherited standing. |
| `lineage` | Ancestry, source-run descent, lineage traditions. |
| `character` | Current-run checks that do not grant future descendants access by themselves. |
| `source_run` | A specific prior character/run used as evidence after source-run ownership exists. |
| `region` | Local renown, regional reputation, local champion or settlement-bound starts. |
| `faction` | Faction service or standing. |
| `institution` | Temple, scholar, guild, oath, or order acceptance. |
| `estate_title` | Noble, heir, estate, legal claim, or recognized title evidence. |
| `special_manual` | World-Stray and manual narrative exceptions. |

Scope rules:

- Noble, status, heir, estate, title, and inherited evidence should not be account-wide by default.
- Local-renown evidence should be region, settlement, or local authority scoped.
- Institution origins should be institution scoped.
- Broad Tier 1 defaults may be account scoped or default scoped.
- Family-scoped rules should not silently fall back to account-wide evidence.
- Source-run evidence should identify which run supplied the proof and whether that run is valid for the current family or lineage.

Examples:

- `backstory.minor_noble` should use family, lineage, estate/title, patronage, adoption, marriage, or story evidence, not generic account Prestige alone.
- `backstory.merchants_child` can use family or source-run trade evidence plus supporting Legacy or Prestige.
- `backstory.military_brat` can use Militia Levy, militia service, or source-run civic defense evidence.
- `backstory.street_vendor` can be default, early Legacy, or simple account/evidence unlock because it grants no market passive.
- `backstory.local_hero` should be region, achievement, title, or story scoped if it becomes selectable through a future policy.
- `backstory.isekai_outcast` should remain special/manual or hidden.

## Source Attribution Requirements

Future evidence must distinguish where values came from. The policy should support these source types:

| Source type | Meaning |
| --- | --- |
| `starter_backstory` | Skill, ability, stat, or flag granted by selected backstory at character creation. |
| `starter_bundle` | Item, currency, or option granted by a starter bundle. |
| `earned_play` | Value earned through play after creation. |
| `legacy_purchase` | Access or support purchased through Legacy systems. |
| `achievement` | Authored achievement evidence. |
| `source_run` | Evidence summarized from a prior character/run. |
| `family_ledger` | Future family-scoped evidence. |
| `chronicle_flag` | Reviewed narrative or Chronicle flag. |
| `story_outcome` | Authored quest/story outcome. |

Rules:

- Starter-granted skill ranks are excluded from earned skill evidence by default.
- Earned skill maxima require `earned_play` or an explicitly reviewed `source_run` summary.
- Legacy purchase can support access but cannot create evidence alone for Tier 2 or Tier 3.
- Account-wide meta unlocks should not grant family, status, title, noble, or institution evidence without an explicit scoped bridge.
- Source-run evidence should be tied to a run id, character id, family id or lineage id when fiction depends on ancestry.

## Missing And Blocked Data Behavior

Policy and requirement records should make missing data behavior explicit.

| Behavior | Use |
| --- | --- |
| `treat_as_unmet` | Most missing evidence. The backstory remains locked. |
| `hide` | Spoilers, unsupported mechanics, or concepts unsafe to explain. |
| `defer` | Evidence owner is not implemented or not durable enough. |
| `use_default_fallback` | Default/new-account safety when optional ledgers are missing. |
| `manual_review` | Special narrative cases or current-data states that require an explicit owner. |

Blocked evidence must not unlock content. If an evidence kind is blocked because family ledgers, estate/title ownership, institutional membership, contacts, magic licensing, mounted behavior, medical systems, or oath behavior do not exist, the resolver should resolve the related rule as hidden, deferred, or unmet.

Blocked evidence should not be shown as a promise in UI. A locked explanation should avoid implying that an unsupported mechanic can already be earned.

## Tier-Specific Policy Defaults

| Tier | Default policy |
| --- | --- |
| `tier_1` | Can be default, early Legacy, or simple evidence unlock. Low evidence requirements. No required precursor. Starter-granted ranks still do not count as earned skill evidence. |
| `tier_2` | Requires previous-play evidence or a valid alternate unlock path. If purchase gated, requires Legacy purchase plus evidence. May require family, source-run, institution, or regional scope. No currency-only unlocks. |
| `tier_3` | Long-term unlock requiring multiple evidence sources or strong equivalent evidence. Family, institution, status, renown, estate, title, or source-run support should be explicit. Block if owners are missing. |
| `special` | Manual, narrative-owned, or hidden. Do not assume normal tier progression. |
| `deferred` | Hidden or blocked until runtime owner exists. No unlock promise until owner, storage, and tests exist. |

Tier rules should be defaults, not a substitute for per-record review.

## No-Stacking And Selected Effect Policy

The selected backstory should be the only applied backstory effect for a new character.

Policy fields should make this explicit:

```json
{
  "selectedBackstoryEffectPolicy": {
    "appliesOnlySelectedBackstory": true,
    "parentEffectsStack": false,
    "previousBackstoriesAreEvidenceOnly": true
  }
}
```

Rules:

- Unlocking a parent origin enables access only.
- Parent and child bonuses do not stack.
- Selected backstory effects are the only applied effects.
- Previous selected backstories count as evidence only if a separate current-data owner records them.
- A higher-tier rule can require `backstory.militia_levy` as history, but selecting future Sword Drill should not apply both Militia Levy and Sword Drill starter packages.

## Default And New-Account Safety

The resolver must keep at least one safe selectable option for every new account and every current-data account shape.

Baseline current default set from planning metadata:

- Local
- Vagabond
- Exile
- Farmhand
- Amnesiac

Future default or early-Legacy candidates:

- Street Vendor
- Net-Tender
- Gatherer
- Drover's Hand
- Kitchen Hand
- Militia Levy
- Scribe's Apprentice

Draft safety rules:

- `defaultBackstoryIds` must not be empty.
- Every default id must reference a live backstory record.
- Missing optional evidence ledgers should fall back to defaults instead of dead-ending character creation.
- If all rule evaluation fails due to missing fields, the resolver should return default ids and warnings.
- Combat-adjacent or institution-adjacent Tier 1 records can be early Legacy or simple evidence unlocks rather than broad defaults.
- Default safety must not bypass settlement-start authorization.

Do not change current availability based on this draft.

## Example Rules

These examples are illustrative only. They are not runtime policy data.

### Local

```json
{
  "backstoryId": "backstory.local",
  "availabilityStatus": "default_available",
  "tier": "tier_1",
  "scopePolicy": { "primaryScope": "account", "accountWideAllowed": true },
  "requiresAll": [],
  "requiresAny": []
}
```

Intent: safe default/new-account origin with no evidence requirement.

### Street Vendor

```json
{
  "backstoryId": "backstory.street_vendor",
  "availabilityStatus": "early_legacy",
  "tier": "tier_1",
  "scopePolicy": { "primaryScope": "account", "accountWideAllowed": true },
  "requiresAny": [
    { "kind": "achievement", "achievementId": "achievement.trade.first_sale" },
    { "kind": "activity_tag", "tag": "market_service", "ownerReadiness": "needs_owner" }
  ],
  "blocksIf": []
}
```

Intent: default or early-Legacy candidate that grants no discounts, contacts, passive income, or economy behavior.

### Militia Levy

```json
{
  "backstoryId": "backstory.militia_levy",
  "availabilityStatus": "early_legacy",
  "tier": "tier_1",
  "scopePolicy": { "primaryScope": "account", "allowedEvidenceScopes": ["account", "source_run"] },
  "requiresAny": [
    { "kind": "achievement", "achievementId": "achievement.example.civic_defense" },
    { "kind": "source_run_evidence", "tag": "civic_alarm_or_formation_drill" }
  ],
  "starterSkillEvidencePolicy": { "starterGrantedAllowed": false }
}
```

Intent: civic-defense exposure without soldier rank, command authority, weapon specialization, or elite military identity.

### Merchant Family

```json
{
  "backstoryId": "backstory.merchants_child",
  "availabilityStatus": "locked",
  "tier": "tier_2",
  "scopePolicy": { "primaryScope": "family", "allowedEvidenceScopes": ["family", "source_run"] },
  "requiresAll": [
    { "kind": "legacy_purchase", "unlockId": "legacy.backstory.merchant_family", "evidenceRequired": true }
  ],
  "requiresAny": [
    { "kind": "source_run_evidence", "tag": "trade_history" },
    { "kind": "family_backstory_history", "backstoryId": "backstory.street_vendor" },
    { "kind": "earned_skill_maximum", "skillId": "skill.settlement.trade", "starterGrantedAllowed": false }
  ],
  "requiresPrestige": { "scope": "family", "minValue": 1 }
}
```

Intent: trade-family access requires trade evidence plus Legacy or Prestige support, not account currency alone.

### Garrison Ward

```json
{
  "backstoryId": "backstory.military_brat",
  "availabilityStatus": "locked",
  "tier": "tier_2",
  "scopePolicy": { "primaryScope": "family", "allowedEvidenceScopes": ["family", "source_run"] },
  "requiresAll": [
    { "kind": "legacy_purchase", "unlockId": "legacy.backstory.garrison_ward", "evidenceRequired": true }
  ],
  "requiresAny": [
    { "kind": "family_backstory_history", "backstoryId": "backstory.militia_levy" },
    { "kind": "source_run_evidence", "tag": "militia_service" },
    { "kind": "earned_skill_maximum", "skillId": "skill.combat.tactics.formation_discipline", "starterGrantedAllowed": false }
  ]
}
```

Intent: Tier 2 garrison exposure can build from Militia Levy or source-run militia evidence, but should not grant officer, guard-rank, or command authority by purchase alone.

### Minor Noble

```json
{
  "backstoryId": "backstory.minor_noble",
  "availabilityStatus": "deferred",
  "tier": "tier_3",
  "scopePolicy": { "primaryScope": "estate_title", "accountWideAllowed": false },
  "requiresAny": [
    { "kind": "lineage_title", "ownerReadiness": "blocked" },
    { "kind": "estate_milestone", "ownerReadiness": "blocked" },
    { "kind": "patronage", "ownerReadiness": "blocked" },
    { "kind": "adoption", "ownerReadiness": "blocked" },
    { "kind": "marriage", "ownerReadiness": "blocked" },
    { "kind": "story_outcome", "ownerReadiness": "needs_owner" }
  ],
  "blockedBehavior": "defer"
}
```

Intent: family, estate, title, legal claim, or story-scoped evidence only. No account-wide noble status by generic Prestige.

### Local Champion

```json
{
  "backstoryId": "backstory.local_hero",
  "availabilityStatus": "special",
  "tier": "special",
  "scopePolicy": { "primaryScope": "region", "allowedEvidenceScopes": ["region", "source_run"] },
  "requiresAny": [
    { "kind": "achievement", "achievementId": "achievement.example.local_champion" },
    { "kind": "renown_milestone", "scope": "region", "ownerReadiness": "partial" },
    { "kind": "story_outcome", "scope": "region", "ownerReadiness": "needs_owner" }
  ]
}
```

Intent: special local-renown/title origin. It should remain non-default and region/story scoped.

### World-Stray

```json
{
  "backstoryId": "backstory.isekai_outcast",
  "availabilityStatus": "special",
  "tier": "special",
  "scopePolicy": { "primaryScope": "special_manual" },
  "requiresAll": [],
  "blocksIf": [{ "kind": "special_case", "missingBehavior": "manual_review" }]
}
```

Intent: special/manual or hidden narrative exception, not normal tier progression.

### Future Sword Drill

```json
{
  "backstoryId": "backstory.sword_drill",
  "availabilityStatus": "locked",
  "tier": "tier_2",
  "scopePolicy": { "primaryScope": "family", "allowedEvidenceScopes": ["family", "source_run"] },
  "requiresAll": [
    { "kind": "legacy_purchase", "unlockId": "legacy.backstory.sword_drill", "evidenceRequired": true }
  ],
  "requiresAny": [
    { "kind": "family_backstory_history", "backstoryId": "backstory.militia_levy" },
    { "kind": "earned_skill_maximum", "skillId": "skill.combat.weapon.sword", "starterGrantedAllowed": false },
    { "kind": "source_run_evidence", "tag": "weapon_drill_sword" }
  ],
  "selectedBackstoryEffectPolicy": {
    "appliesOnlySelectedBackstory": true,
    "parentEffectsStack": false
  }
}
```

Intent: Militia Levy or earned weapon/drill evidence can unlock access, but Militia Levy effects do not stack with Sword Drill.

### Future Recognized Heir

```json
{
  "backstoryId": "backstory.recognized_heir",
  "availabilityStatus": "deferred",
  "tier": "special",
  "scopePolicy": { "primaryScope": "estate_title", "accountWideAllowed": false },
  "requiresAll": [
    { "kind": "lineage_title", "ownerReadiness": "blocked" },
    { "kind": "estate_milestone", "ownerReadiness": "blocked" }
  ],
  "requiresAny": [
    { "kind": "story_outcome", "ownerReadiness": "needs_owner" },
    { "kind": "renown_milestone", "scope": "family", "ownerReadiness": "blocked" }
  ],
  "blockedBehavior": "defer"
}
```

Intent: blocked until family, title, estate, legal claim, and story owners exist.

## Future Validation Expectations

Version 0.5.55 or later should design tests that prove:

- every live backstory has a rule or explicit current-data fallback
- no rule references missing live backstory ids except explicitly marked future examples
- no runtime rule consumes `docs/design/backstory-policy-metadata.json`
- no runtime rule consumes `docs/design/legacy-upgrade-catalog-draft.json`
- no runtime rule consumes `futureBackstoryLaneDrafts[]`
- blocked evidence cannot unlock content
- starter-granted skills are excluded by default
- Tier 2 and Tier 3 cannot unlock from Legacy purchase alone
- family-scoped rules do not fall back to account-wide evidence
- noble, heir, title, estate, and local-renown fiction stays scoped
- default set is never empty
- deferred and special records do not leak unsupported UI promises
- parent and child backstory effects do not stack
- missing future ledgers fall back safely without granting scoped or high-tier access

## Current-Data Strategy

Future policy data should stay focused on current authored content and current account/save shapes. This project is pre-release, so do not add old-save, old-account, alias, retired-id, converted-id, historical-id, or migration-only behavior unless the user explicitly requests compatibility work.

```json
{
  "policyVersion": "0.0.0",
  "contentVersion": "0.0.0"
}
```

Current-data behavior:

- Current content ids should be validated directly.
- Missing family, lineage, source-run, or evidence fields should not grant family-scoped or high-tier access.
- Source-run records without source attribution should not infer earned skill maxima.
- Broad achievements should not unlock narrow Tier 2 or Tier 3 origins unless explicitly mapped.
- Data model changes may be clean breaks until compatibility is explicitly requested.
- Policy and content versions should identify the current validated data set, not imply a compatibility layer.

## Recommended Next Pipeline

The evidence ownership plan and this runtime policy shape draft are enough to proceed to a non-runtime test planning pass. Do not jump straight to implementation.

Recommended sequence:

1. Version 0.5.54 - Backstory No-Compatibility Guardrail Revision
2. Version 0.5.55 - Backstory Eligibility Resolver Test Plan
3. Version 0.5.56 - Backstory Eligibility Resolver Implementation
4. Version 0.5.57 - Creator Locked Backstory Presentation Plan
5. Version 0.5.58 - Backstory Legacy Purchase Integration Plan

The test plan should come before implementation because it needs to lock down non-import boundaries, blocked evidence behavior, starter-granted skill exclusion, family/account scope boundaries, default safety, no-compatibility behavior, and no-stacking rules.

## Risks And Blockers

- No durable family ledger exists yet.
- No earned-skill maximum storage separates earned play from starter-granted ranks.
- Source-run history exists lightly, but not as a backstory evidence ledger.
- Regional renown, institution acceptance, title/estate ownership, patronage, adoption, marriage, contacts, magic licensing, mounted behavior, medical systems, and oath/paladin behavior remain blocked or partial.
- Runtime policy data must not be authored until tests define how rules validate, how blocked owners fail, and how missing current-data evidence behaves.
- Creator presentation should not expose hidden/deferred mechanics until the resolver and UI copy are reviewed together.
