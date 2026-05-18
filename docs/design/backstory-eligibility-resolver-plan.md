# Backstory Eligibility Resolver Plan

Source version/run: Version 0.5.51 - Backstory Eligibility Resolver Plan
Date: 2026-05-17
Status: planning-only design document

## Purpose

This document plans a future Backstory Eligibility Resolver. It does not implement the resolver, change character creator behavior, change live backstory availability, change starter skills, add unlock logic, add Legacy purchases, alter account or save storage, or import planning metadata into runtime.

Current branch reality for this plan:

- The live backstory catalog has 27 records.
- `docs/design/backstory-policy-metadata.json` remains `status: "non_runtime_policy_draft"` and `runtimeImportAllowed: false`.
- The current creator catalog imports `packages/content/base/player/backstories.json`, builds templates from all live records, and returns all known backstories for valid lineages.
- Current character creation validation only checks that the selected backstory id is known, then separately checks settlement-start access.
- Current new-game snapshot creation applies exactly the selected live backstory starter skills and starting ability allowlist.
- Current Legacy runtime has account, preparation, resource-start, renown-display, and passive starter-skill policy seams, but no live backstory eligibility resolver.

## Non-Goals

This plan does not:

- implement runtime filtering
- add a resolver
- add live unlock records
- change creator UI
- change live availability
- change `backstories.json`
- change `backstory-policy-metadata.json`
- change starter skill caps or validation rules
- change schemas, save/account storage, Legacy runtime, combat, magic, economy, progression, launcher UI, or generated UI output

The future resolver should eventually determine which backstories are always available, default/new-account available, family or lineage unlocked, previous-play unlocked, Legacy-purchase plus evidence unlocked, hidden/deferred, or special narrative cases. This document only plans that shape.

## Resolver Responsibilities

A future resolver should return an explainable projection, not mutate account state.

Required responsibilities:

- return eligible backstory ids for the current account/family/source-run context
- return locked backstory ids with stable, player-safe reasons
- return special and deferred cases without pretending unsupported systems exist
- expose why a backstory is unavailable without leaking unsupported mechanics or raw internal ids
- preserve at least one safe default/new-account option
- enforce that a new character selects exactly one backstory
- enforce the no-stacking rule across tiers
- avoid granting competence from Legacy points alone
- distinguish account-wide unlocks from family-specific or lineage-specific unlocks
- tolerate missing future ledger fields with safe defaults
- avoid reading `backstory-policy-metadata.json` directly as runtime policy
- keep settlement-start authorization separate from backstory unlock eligibility

The resolver should be pure for a given input. Purchases, ledger writes, and achievement grants should happen through separate owner systems.

## Future Resolver Outputs

The future output should be designed before implementation, but a safe shape would include:

- `eligibleBackstoryIds`: currently selectable ids
- `lockedBackstories`: ids with explainable unmet requirements
- `hiddenBackstoryIds`: deferred, unsafe, spoiler, or unsupported ids
- `specialBackstories`: narrative exception ids with manual or story-owned gates
- `defaultBackstoryIds`: safe fallback ids for new accounts and missing evidence
- `selectedBackstoryPolicy`: resolved policy for the one selected backstory only
- `warnings`: non-blocking migration, missing-field, or content-version notes

Locked reasons should be stable enough for tests and UI, but not expose every raw ledger detail. Player-facing text can be produced later by the creator presentation layer.

## Required Input Categories

Do not create schemas yet. The future resolver should plan for these input categories:

- account id
- lineage id
- family id
- current character ancestry or source-run chain
- current content catalog version
- live backstory catalog ids
- default/new-account policy ids
- family skill maxima
- earned skill maxima separate from starter-granted skill maxima
- backstory unlock ledger
- Legacy purchases
- Echo, prestige, and renown balances or thresholds
- achievements
- Chronicle flags
- completed runs and archived run summaries
- source-run evidence from retired or dead characters
- region, faction, and institution reputation
- estate, title, and social-status evidence
- special narrative flags
- migration or compatibility flags for older accounts

Starter-granted skill ranks must not count as earned skill maxima for unlocking future higher-tier backstories unless a later system explicitly allows that source. A character who began with `skill.combat.weapon.sword` from a backstory should not automatically satisfy a future Sword Drill evidence requirement without earned play evidence.

## Evidence Ownership Model

Backstory unlocking should use separate evidence channels rather than one vague unlock blob. Each channel needs an owner, a storage location, and a validation rule before runtime consumption.

| Evidence category | Near-term safety | Expected owner |
| --- | --- | --- |
| `skill_threshold` | partial | Player progression can report current skill rank, but unlock use must filter starter-granted sources. |
| `earned_skill_maximum` | needs owner | Player progression or account archive must track earned maxima separately from starter skills. |
| `achievement` | safe near-term | Existing achievements can provide account/character evidence after mapping is reviewed. |
| `activity_tag` | needs owner | Activity/runtime systems need durable tagged history before use. |
| `source_run_evidence` | partial | Account archive/source-run linkage exists lightly, but evidence semantics need a ledger. |
| `chronicle_flag` | partial | Chronicle/account systems can preserve flags, but flag vocabulary needs review. |
| `profession_history` | blocked | No durable profession or job history owner yet. |
| `faction_or_region_reputation` | partial | Reputation exists, but scope, family carryover, and thresholds need runtime ownership. |
| `renown_milestone` | partial | Current Legacy renown presence is presentation-oriented; true regional renown storage is later work. |
| `lineage_title` | blocked | Title and lineage-status ownership are not established. |
| `estate_milestone` | blocked | Estate claim previews exist, but estate ownership/effects are not live. |
| `institution_acceptance` | blocked | Institutions can appear in content, but membership acceptance is not a player ledger yet. |
| `patronage` | blocked | Patron/contact systems are not live. |
| `adoption` | blocked | Family/legal relationship systems are not live. |
| `marriage` | blocked | Family/legal relationship systems are not live. |
| `story_outcome` | needs owner | Narrative outcome flags need a reviewed Chronicle or quest owner. |
| `family_skill_maximum` | blocked | Family skill maxima need family ledger storage. |
| `family_backstory_history` | blocked | Family backstory history needs source-run/family storage. |
| `special_case` | manual only | Special gates need explicit narrative or migration handling. |

Near-term implementation should prefer `achievement`, reviewed `source_run_evidence`, and carefully separated `earned_skill_maximum` once source attribution exists. It should not use blocked family, estate, institution, patronage, adoption, marriage, magic, mounted, contact, or economy evidence until those systems own durable data.

## Runtime-Safe Rule Shape

The eventual runtime policy should be a separate reviewed data shape, not the planning metadata draft. A possible rule record:

```json
{
  "backstoryId": "backstory.example",
  "availabilityStatus": "locked",
  "tier": "tier_2",
  "requiresAny": [],
  "requiresAll": [],
  "requiresLegacyPurchase": "legacy.unlock.backstory.example",
  "requiresPrestige": { "scope": "family", "min": 3 },
  "requiresEcho": { "scope": "account", "minPeak": 10 },
  "requiresFamilyEvidence": [],
  "requiresEarnedSkillEvidence": [],
  "requiresLineageOrStatusEvidence": [],
  "blocksIf": [],
  "explainLocked": "Earn matching evidence before this origin can be chosen.",
  "explainUnlocked": "Your family has enough matching history to choose this origin.",
  "migrationFallback": "hide_until_policy_ready"
}
```

Potential fields:

- `backstoryId`: must reference a live backstory id.
- `availabilityStatus`: `always_available`, `default_available`, `locked`, `hidden`, `special`, or `deferred`.
- `tier`: runtime-approved tier classification, not copied blindly from planning metadata.
- `requiresAny`: alternatives where any one group can satisfy access.
- `requiresAll`: mandatory requirements.
- `requiresLegacyPurchase`: optional purchase id that only works after evidence exists.
- `requiresPrestige`: family/account/institution threshold requirement.
- `requiresEcho`: Echo threshold or peak requirement.
- `requiresFamilyEvidence`: family-specific prerequisites.
- `requiresEarnedSkillEvidence`: earned skill maxima or source-run skill proof.
- `requiresLineageOrStatusEvidence`: title, estate, lineage, adoption, marriage, or patronage proof.
- `blocksIf`: unsupported runtime owner, retired content, incompatible lineage, migration block, or spoiler block.
- `explainLocked`: player-safe locked explanation.
- `explainUnlocked`: player-safe unlocked explanation.
- `migrationFallback`: behavior when old accounts lack fields.

This shape should be designed and tested before any creator filtering uses it.

## Tier Handling

### Tier 1

Tier 1 origins can be default, early Legacy, or simple evidence unlocks. They should be low risk, low cap, and small bonus. They may be roots with no precursor.

Safe Tier 1 examples now live in content include `Local`, `Vagabond`, `Exile`, `Farmhand`, `Workshop-Raised`, `Gutter Rat`, `Militia Levy`, `Street Vendor`, `Net-Tender`, `Gatherer`, `Scribe's Apprentice`, `Drover's Hand`, and `Kitchen Hand`. Some may eventually remain default, while others may be early Legacy or simple evidence unlocks.

### Tier 2

Tier 2 origins need previous-play evidence or a valid alternate unlock path. They may have a Tier 1 precursor, but they do not require one when prestige, status, or story evidence supports a direct unlock.

Tier 2 access should require Legacy purchase plus evidence, not Legacy purchase alone. A player should not buy a trained household, garrison, scout, magic, or institution origin using only account currency.

### Tier 3

Tier 3 origins are long-term unlocks. They require several runs or strong equivalent evidence, plus family, institution, status, renown, estate, title, or equivalent support when appropriate.

Tier 3 records must remain blocked if the runtime systems needed to explain or enforce their premise are missing.

### Special

Special origins are narrative exceptions. They should not be treated as normal tier progression and may need manual gating, narrative ownership, migration behavior, or removal from ordinary selection.

### Deferred

Deferred concepts are blocked until a runtime owner exists. The resolver should hide or explain them conservatively rather than show unsupported mechanics.

## No-Stacking Rule

A new character selects one backstory.

Prior tiers can unlock higher tiers but never stack their bonuses with the selected backstory. For example, `Militia Levy` can help unlock `Sword Drill` later, but selecting `Sword Drill` should not apply both `Militia Levy` and `Sword Drill` starting packages.

The selected backstory is the only source of backstory starter skills, attribute adjustments, abilities, geographic familiarity, and any future backstory-specific bonus. Unlock state is access evidence, not cumulative character power.

## Family-Specific Versus Account-Wide Unlocks

Renown, status, household, estate, title, lineage, and inherited standing should usually be family-oriented. A random new family should not receive noble, local-renown, garrison, institution, or heir-status backstories because another unrelated lineage earned them.

Family-oriented examples:

- `backstory.minor_noble`
- future heir/status lines
- local champion or local-renown starts
- institution household recognition
- family skill maxima and family backstory history
- estate/title/household standing unlocks

Account-wide unlocks may be acceptable for:

- broad tutorial or default options
- special meta unlocks that do not grant unsupported social status
- content visibility after discovery
- non-lineage quality-of-life unlocks
- opt-in presentation or explanation features

When fiction depends on ancestry or inherited standing, the resolver should prefer `familyId`, `lineageId`, and `sourceRunId` scoped evidence over account-wide flags.

## Earned Skill Maxima And Cap Safety

Future eligibility must respect family skill maxima, earned skill maxima, starter-skill cap, breakthrough-safe cap, background bonus cap, and upgrade cap progression.

Rules:

- Starter-granted skill ranks are not earned skill maxima by default.
- A backstory cannot grant starting skill above what family/evidence supports.
- Legacy purchases can improve access or cap only when backed by earned evidence.
- No backstory should silently cross breakthrough gates at character start.
- Backstory starter packages should stay below the current first breakthrough threshold unless a future reviewed system explicitly owns that exception.
- Background bonus caps should be explicit and lower than trained character progression.
- Future upgrade cap progression should be source-labeled and explainable.

The current passive starter-skill policy reports a starter cap of 25, an absolute starter cap below the first breakthrough, and no direct skill grants. A future resolver should preserve that safety boundary until a dedicated starter-skill ownership pass changes it.

## Current Live Records And Future Locking Intent

Do not change live availability now. Future planning should classify current live records roughly as follows after a runtime-safe policy exists:

| Backstory | Future direction |
| --- | --- |
| Local | Default/new-account safe. |
| Vagabond | Default/new-account safe. |
| Exile | Default/new-account safe, with moderate hardship framing. |
| Farmhand | Default/new-account safe. |
| Amnesiac | Default or special fallback, kept restrained. |
| Workshop-Raised | Tier 1 craft root; likely early Legacy or default candidate after naming cleanup. |
| Gutter Rat | Tier 1 urban hardship root; likely early Legacy or default candidate after naming cleanup. |
| Militia Levy | Tier 1 militia root; likely early Legacy, not broad default until combat-adjacent presentation is reviewed. |
| Street Vendor | Tier 1 market root; default or early Legacy candidate with no economy effects. |
| Net-Tender | Tier 1 river/coastal root; default or early Legacy candidate with no boat/cargo effects. |
| Gatherer | Tier 1 gathering root; default or early Legacy candidate with no healing or item generation. |
| Scribe's Apprentice | Tier 1 mundane records root; early Legacy candidate, separate from magic-bearing scholar records. |
| Drover's Hand | Tier 1 rural animal-handling root; default or early Legacy candidate with no mount behavior. |
| Kitchen Hand | Tier 1 civic/service root; default or early Legacy candidate with no contacts/economy behavior. |
| Merchant Family | Tier 2 trade/status household; future lock should require trade evidence, family history, prestige, achievement, or source-run proof. |
| Carpenter Household | Tier 2 craft/building branch; future lock can use Workshop-Raised or craft/building evidence. |
| Miner's Kin | Tier 2 extraction/resource branch; future lock can use mining/resource evidence or source-run proof. |
| Village Hunter | Tier 2 hunting/scouting branch; future lock should require hunting/scouting evidence and remain ability-safe. |
| Scout's Ward | Tier 2 scouting branch; future lock should require scouting/frontier evidence and avoid rank promises. |
| Garrison Ward | Tier 2 militia/garrison branch; future lock should require militia evidence and remain below officer/soldier identity. |
| Performer | Tier 2 social/performance branch; locked until performance magic/content split is resolved. |
| Scholar's Apprentice | Tier 2 scholar/institution branch; locked until mundane/magic split is resolved. |
| Temple Acolyte | Tier 1 or Tier 2 temple/service; locked until divine magic and institution ownership are reviewed. |
| Hedge Adept | Tier 2 or special magic case; locked until magic acquisition/licensing ownership exists. |
| Minor Noble | Tier 3 or special status/lineage; locked until family, estate, title, and social-status evidence exist. |
| Local Champion | Special/convert later; future achievement, title, or local-renown path rather than normal starter. |
| World-Stray | Special narrative case; hidden or manual gate outside normal progression. |

## Default And New-Account Safety

The resolver must never let character creation dead-end. It should preserve at least one safe default option and preferably a small resilient set.

Current policy-default records:

- Local
- Vagabond
- Exile
- Farmhand
- Amnesiac

Possible future default or early-Legacy candidates:

- Street Vendor
- Net-Tender
- Gatherer
- Drover's Hand
- Kitchen Hand

Possible early-Legacy but not broad default candidates:

- Militia Levy, because it is combat-adjacent
- Scribe's Apprentice, because it must remain clearly mundane and separate from magical scholarship

Default policy should be explicit, content-versioned, and tested. If a migration or missing account field removes all unlock evidence, the resolver should fall back to the approved default set.

## UI And Explainability Requirements

The future creator may eventually show:

- available origins
- locked origins
- why locked
- how to unlock
- family-specific requirements
- evidence requirements
- prestige, Echo, and Legacy purchase requirements
- deferred or special cases when safe to expose

Presentation rules:

- Do not expose unsupported mechanics as promises.
- Do not show raw policy ids to players.
- Use concise locked reasons: "Requires family trade history" is better than listing internal ledger fields.
- Distinguish "not enough evidence" from "not implemented yet".
- Make family-specific requirements visible enough that players understand why an unrelated family cannot use inherited status.
- Keep selected backstory effects clear and non-stacking.

This is design guidance only. No UI changes are part of this pass.

## Migration And Compatibility

Future filtering must not break existing saves or accounts.

Rules:

- Existing selected backstories remain valid on old characters.
- Old saves should not lose identity or starter skills.
- Locking affects only new character creation after implementation.
- If a backstory is retired, renamed, or converted later, old characters keep historical `backstoryId` data.
- The resolver must tolerate missing family, unlock, renown, prestige, Echo, and evidence fields with safe defaults.
- Unknown historical backstory ids should be preserved in save data and displayed conservatively.
- Metadata/content versioning should be explicit in the runtime policy.
- Migration fallback should prefer hiding unsupported new options rather than invalidating existing characters.

## Runtime Boundary

The future resolver should live in a runtime-owned module only after a dedicated policy shape is reviewed. It should consume a runtime policy file or typed definitions that are explicitly allowed for runtime import.

It should not consume:

- `docs/design/backstory-policy-metadata.json`
- `docs/design/legacy-upgrade-catalog-draft.json`
- future lane drafts
- design documents

It should also not own:

- purchase transactions
- account ledger writes
- achievement awards
- Chronicle event creation
- source-run archive writes
- family ledger mutation
- settlement-start authorization
- starter-skill cap changes

Those systems can provide inputs or consume resolver output after separate ownership passes.

## Recommended Implementation Sequence

Prefer at least one more data-ownership step before implementation.

1. Version 0.5.52 - Backstory Evidence Ownership Plan
2. Version 0.5.53 - Backstory Runtime Policy Shape Draft
3. Version 0.5.54 - Backstory Eligibility Resolver Test Plan
4. Version 0.5.55 - Backstory Eligibility Resolver Implementation
5. Version 0.5.56 - Creator Locked Backstory Presentation Plan
6. Version 0.5.57 - Backstory Legacy Purchase Integration Plan

Implementation should not start until the runtime policy shape, evidence ledger ownership, migration behavior, and no-stacking tests are clear.

## Risks And Blocked Systems

Blocked or high-risk areas:

- family/ancestry data model
- source-run evidence ledger
- earned skill maxima separated from starter-granted ranks
- heir legitimacy/status
- estate/title ownership
- regional renown storage
- institutional membership and acceptance
- contacts and patronage
- market/economy effects
- mounted combat and mount ownership
- magic acquisition or licensing
- medical/injury systems
- oath and paladin behavior
- adoption and marriage ownership
- narrative story-outcome flag ownership

Until these systems have owners, related backstories should remain locked, hidden, special, or deferred in any future resolver.
