# Backstory Evidence Ownership Plan

Source version/run: Version 0.5.52 - Backstory Evidence Ownership Plan
Date: 2026-05-17
Status: planning-only design document

## Purpose

This document defines ownership boundaries for evidence that may later feed the Backstory Eligibility Resolver described in `docs/design/backstory-eligibility-resolver-plan.md`.

It does not create evidence storage, implement the resolver, create runtime policy data, change live availability, change starter skills, change Legacy behavior, or alter account/save schemas. It is a planning pass for durable evidence sources, scopes, provenance, migration behavior, and blocked owners.

Current branch reality for this pass:

- The live backstory catalog has 27 records.
- `docs/design/backstory-policy-metadata.json` remains non-runtime with `status: "non_runtime_policy_draft"` and `runtimeImportAllowed: false`.
- `docs/design/legacy-upgrade-catalog-draft.json` remains non-runtime with `runtimeImportAllowed: false`.
- `packages/shared/types/src/contracts.ts` has account profile, achievements, history, estate, Legacy unlock, Chronicle, discovery Chronicle, reputation, save metadata, source-run, and player title shapes.
- `apps/rpg-ui/src/game-shell/accountProfile.ts` does not exist on this branch; the closest current owner is `apps/rpg-ui/src/game-shell/accountProfileManager.ts`.
- `apps/rpg-ui/src/game-shell/chronicle.ts` does not exist on this branch; current Chronicle-facing equivalents include `accountMetaPresentation.ts`, `achievementChroniclesPresentation.ts`, `runLifecycle.ts`, and `newGameSnapshot.ts`.

## Non-Goals

This plan does not:

- add evidence ledgers
- add family ledgers
- add earned-skill maximum storage
- add runtime backstory policy data
- implement backstory filtering
- add Legacy backstory purchases
- change creator validation or UI
- change live backstory records
- change starter skill caps, starter skill sources, starting abilities, or attributes
- change save/account schemas
- change combat, magic, economy, progression, launcher UI, generated UI output, or availability behavior

## Evidence Category Inventory

| Evidence category | Meaning | Likely owner | Future storage location | Scope | Readiness | Starter-granted values count? | Tier suitability | Missing/default behavior | Notes and risks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `skill_threshold` | A skill reached a rank threshold. | Player progression. | Player skill state plus future source-aware archive summary. | Character or source-run. | partial | No by default. | Tier 1 or Tier 2 after source checks. | Treat as unmet. | Current skill ranks exist, but source provenance is not enough for high-tier unlocks. |
| `earned_skill_maximum` | Highest rank earned through play, excluding starter-granted ranks. | Player progression plus account archive. | Future account/family/source-run evidence ledger. | Character, source-run, family. | needs owner | No. | Tier 1, Tier 2, Tier 3. | Treat as missing/unmet. | This is the critical blocker for skill-backed higher-tier origins. |
| `achievement` | Authored achievement was unlocked. | Achievements engine/account profile. | `AccountProfileState.achievements` and character achievement state. | Account or character. | safe | Not applicable. | Tier 1 or Tier 2; Tier 3 only with specific achievements. | Treat absent achievement as unmet. | Safe only when achievement meaning is narrow enough for the backstory. |
| `activity_tag` | Durable proof of repeated activity. | Activity/runtime owner. | Future activity history or account/source-run summary. | Character or source-run. | needs owner | No. | Tier 1 or Tier 2. | Treat as unmet. | Current session activity is not durable enough. |
| `source_run_evidence` | Prior character/run qualifies as evidence. | Account history and run lifecycle. | `AccountRunHistoryRecord` plus future evidence summary. | Source-run, family, account. | partial | No by default. | Tier 1, Tier 2, limited Tier 3. | Ignore if source run missing or deleted. | Current source-run linkage exists, but evidence semantics are not durable enough. |
| `chronicle_flag` | Authored narrative/account flag. | Chronicle/account or quest owner. | Future Chronicle flag ledger or account history extension. | Character, source-run, account, family. | partial | Not applicable. | Tier 1, Tier 2, special. | Treat as absent. | Needs controlled vocabulary so arbitrary session flags do not become unlocks. |
| `profession_history` | Durable history of job, role, or work identity. | Future profession/job/activity owner. | Future profession history ledger. | Character, source-run, family. | blocked | No. | Tier 1 or Tier 2. | Treat as unavailable. | No durable profession owner exists. |
| `faction_or_region_reputation` | Reputation with a faction, settlement, region, or institution. | Reputation runtime plus account/family carryover owner. | Future scoped reputation evidence ledger. | Region, faction, institution, family. | partial | Not applicable. | Tier 2 or Tier 3. | Treat as unmet unless current character evidence is explicitly usable. | Current reputation exists, but family carryover and thresholds need ownership. |
| `renown_milestone` | Durable public recognition milestone. | Legacy renown/future regional renown owner. | Future renown ledger separate from account Legacy points. | Region, settlement, continent, family. | partial | Not applicable. | Tier 2, Tier 3, special. | Treat as unmet. | Current renown is presentation-oriented and should not imply universal status. |
| `lineage_title` | Recognized title tied to lineage or family. | Future title/status owner. | Future family/title ledger. | Lineage, family, estate/title. | blocked | Not applicable. | Tier 3 or special. | Treat as unavailable. | Do not use until title legitimacy exists. |
| `estate_milestone` | Estate claim, holding, or asset milestone. | Estate owner/account meta. | Future estate ownership ledger. | Estate/title, family, source-run. | blocked | Not applicable. | Tier 3 or special. | Treat as unavailable. | Current estate previews are not enough for status unlocks. |
| `institution_acceptance` | Recognized membership or acceptance by an institution. | Future institution membership owner. | Future institution ledger. | Institution, faction, family. | blocked | Not applicable. | Tier 2, Tier 3, special. | Treat as unavailable. | Needed for scholar, temple, oath, and guild backstories. |
| `patronage` | Patron support, household protection, or sponsor status. | Future patron/contact owner. | Future social/contact ledger. | Family, institution, social-status. | blocked | Not applicable. | Tier 2, Tier 3, special. | Treat as unavailable. | Do not imply contacts before contact systems exist. |
| `adoption` | Legal or household adoption evidence. | Future family/legal relationship owner. | Future family relationship ledger. | Family, lineage, social-status. | blocked | Not applicable. | Tier 2, Tier 3, special. | Treat as unavailable. | Needs legal/family semantics before use. |
| `marriage` | Marriage or alliance evidence. | Future family/legal relationship owner. | Future family relationship ledger. | Family, lineage, estate/title. | blocked | Not applicable. | Tier 2, Tier 3, special. | Treat as unavailable. | Must not be account-wide. |
| `story_outcome` | Authored outcome from quest, narrative, or Chronicle. | Quest/Chronicle narrative owner. | Future story outcome ledger. | Character, source-run, family, region. | needs owner | Not applicable. | Tier 2, Tier 3, special. | Treat as absent. | Needs reviewed vocabulary and migration behavior. |
| `family_skill_maximum` | Family-level maximum earned in a skill. | Future family ledger plus player progression. | Future family skill evidence ledger. | Family, lineage. | blocked | No. | Tier 2, Tier 3. | Treat as unavailable. | Must separate true earned skill from starter packages. |
| `family_backstory_history` | A family previously used or earned a backstory lane. | Future family/source-run history owner. | Future family backstory ledger. | Family, lineage, source-run. | blocked | Not by itself. | Tier 2, Tier 3. | Treat as unavailable. | Requires family identity and selected-backstory history. |
| `legacy_purchase` | Account or family purchased an unlock. | Legacy unlock runtime. | `AccountLegacyState.legacyUnlocks` now; future family/renown ledgers later. | Account, family, region. | partial | Not applicable. | Tier 1 with care; Tier 2/3 only with evidence. | Treat as unpurchased. | Legacy points alone must not unlock competence, status, or institutions. |
| `echo_requirement` | Echo peak or threshold from prior runs. | Account history/run lifecycle. | `AccountRunHistoryRecord.echoLevelReached` and future source summaries. | Account, source-run, family. | partial | Not applicable. | Tier 2 or Tier 3 support. | Treat as 0. | Useful as supporting weight, not standalone proof. |
| `prestige_requirement` | Prestige, renown, or family standing threshold. | Legacy/account now; future family prestige owner. | `AccountLegacyState` for current Prestige; future family/regional ledgers. | Account, family, region, institution. | partial | Not applicable. | Tier 2, Tier 3. | Treat as 0. | Account Prestige should not substitute for family/status evidence. |
| `special_case` | Manual or narrative exception. | Narrative/migration owner. | Future special-case allowlist or story flags. | Special/manual. | manual only | Not applicable. | Special or deferred. | Hide or block by default. | Do not expose unsupported mechanics as promises. |

## Source Attribution Model

Future evidence must record where a value came from. Without provenance, the resolver cannot distinguish real prior-play competence from starter packages or broad account convenience.

Required source distinctions:

- starter-granted skill ranks from selected backstory or starter bundle
- earned skill gains during play
- inherited or family evidence
- Legacy-purchased access
- account-wide meta unlocks
- family-specific unlocks
- source-run evidence from a prior character
- Chronicle or narrative flags
- achievement evidence

Starter-granted skill ranks must not count as earned skill maxima by default. If a later system intentionally allows a starter source to contribute, it needs an explicit source label and a narrow rule.

Likely future provenance fields:

- `sourceType`: `starter_backstory`, `starter_bundle`, `earned_play`, `legacy_purchase`, `achievement`, `source_run`, `family_ledger`, `chronicle_flag`, `story_outcome`, `migration`
- `sourceId`: backstory id, bundle id, unlock id, achievement id, run id, flag id, or migration id
- `sourceRunId`: prior character/run id when evidence came from a source run
- `familyId`: family-scoped evidence owner
- `lineageId`: lineage-scoped owner when ancestry matters
- `scopeType`: account, family, lineage, character, source-run, region, faction, institution, estate-title, or special
- `scopeId`: id for the scoped entity
- `earnedRankMax`: rank reached through earned play
- `starterRankIgnored`: true when a starter rank was excluded from evidence
- `recordedAt` and `contentVersion`: migration and compatibility anchors

## Scope Model

Backstory evidence should be scoped to the fiction it represents.

| Scope | Use for | Avoid using for |
| --- | --- | --- |
| account-wide | broad defaults, tutorial unlocks, content visibility, non-lineage quality of life | noble/status/renown/institution origins |
| family-specific | household reputation, family skill maxima, inherited trade, noble/status, source-run chains | unrelated families |
| lineage-specific | ancestry, source-run descent, lineage traditions | generic account visibility |
| character-specific | current run eligibility, current character achievements | future descendants unless archived into a ledger |
| source-run-specific | a prior retired/archived character's proof | broad account unlock without consent |
| region-specific | local renown, regional reputation, local champion status | global status |
| faction-specific | faction reputation and service | unrelated institutions |
| institution-specific | temple, scholar, guild, oath acceptance | generic social standing |
| estate/title-specific | noble, heir, recognized estate, legal claim | account-wide purchases |
| special/manual | World-Stray, special narrative cases, migrations | normal tier progression |

Examples:

- Minor Noble should be family, estate, title, or status scoped, not account-wide.
- Merchant Family may require family or source-run trade evidence.
- Garrison Ward may require family or source-run militia evidence.
- Street Vendor can be default, early account unlock, or simple evidence unlock.
- Local Champion should be local-renown, achievement, title, or region scoped.
- World-Stray should remain special/manual or hidden.

## Near-Term Safe Evidence

The safest future evidence channels are limited and still need review before runtime use.

- Achievements are the safest current durable evidence because account and character achievement state already exists. They are only safe when mapped narrowly: a broad first-run achievement should not unlock a specialized Tier 2 origin.
- Source-run evidence is partially safe because account history, source-run id, retained retired runs, and archived run records exist. It is not ready for high-tier backstory unlocks until the source-run summary records the actual evidence used.
- Earned skill maxima are important but not ready. They become safe only after progression can distinguish earned ranks from starter-granted ranks and archive those maxima durably.
- Chronicle flags are partial. Session Chronicle and account presentation exist, but a durable flag vocabulary and owner are needed before a resolver can use them.

Near-term resolver work should avoid family skill maxima, family backstory history, titles, estates, institutions, patronage, adoption, marriage, contacts, mounted behavior, magic licensing, and medical/oath-specific evidence until those systems own data.

## Blocked Evidence

These channels must remain blocked until owning systems exist:

- family skill maxima
- family backstory history
- heir legitimacy/status
- estate/title ownership
- regional renown storage if not durable and scoped
- institutional membership
- patronage and contact systems
- adoption
- marriage
- mounted behavior and mount ownership
- market/economy effects
- magic licensing/acquisition
- medical/injury systems
- oath and paladin behavior

Blocked evidence should resolve as unavailable, hidden, or deferred. It should not be shown as a near-term promise in creator UI.

## Backstory Examples

| Backstory | Future evidence direction |
| --- | --- |
| Local | Always/default available; no evidence required. |
| Street Vendor | Default, early account unlock, achievement, or simple trade activity evidence; no economy effects. |
| Militia Levy | Early Legacy or simple civic-defense evidence; combat-adjacent, so avoid weapon specialization and rank claims. |
| Scribe's Apprentice | Early Legacy, achievement, records/admin activity, or mundane institution service; no arcane/magic evidence. |
| Merchant Family | Family/source-run trade history plus achievement or prestige; not account-wide wealth alone. |
| Carpenter Household | Craft/building evidence, Workshop-Raised history, source-run craft proof, or family craft memory. |
| Miner's Kin | Mining/resource evidence, source-run extraction proof, or family resource history. |
| Village Hunter | Hunting/scouting evidence plus source-run proof; ability-safe and no elite combat identity. |
| Scout's Ward | Scouting/frontier evidence, source-run scouting proof, or family frontier service. |
| Garrison Ward | Militia Levy or militia/source-run evidence plus Legacy purchase; no rank, officer, or command authority. |
| Scholar's Apprentice | Institution acceptance plus mundane scholar evidence after magic/content split. |
| Temple Acolyte | Temple/service evidence after divine magic and institution ownership are reviewed. |
| Hedge Adept | Magic licensing/acquisition evidence after magic runtime ownership exists. |
| Minor Noble | Family, estate, title, lineage, adoption, marriage, patronage, or story evidence; never account-wide by default. |
| Local Champion | Region/local-renown, achievement, title, or story outcome; likely special/convert-later. |
| World-Stray | Special/manual or hidden narrative case; not normal progression. |
| Future Sword Drill | Militia Levy or earned weapon/drill evidence plus Legacy purchase; starter weapon ranks excluded. |
| Future Trade House | Merchant Family or strong family/source-run trade evidence plus prestige/Echo and maybe regional support. |
| Future Paladin Oathline | Oath, temple, institution, divine/magic, and combat support evidence; blocked until multiple owners exist. |
| Future Recognized Heir | Family/title/estate/lineage recognition, story outcome, prestige/renown, and legal claim evidence; blocked. |

Do not change current availability based on this table.

## Evidence Conflicts And Abuse Prevention

Future rules should prevent these failure modes:

- Legacy points alone unlock too much.
- Starter skills falsely count as earned skill evidence.
- Unrelated families inherit noble, renown, or institution status.
- Account-wide flags override lineage-specific fiction.
- One character's special narrative exception becomes universal.
- Repeated low-value actions farm unlocks too easily.
- Hidden or deferred systems leak into UI as promises.
- Tier 2 or Tier 3 unlocks become pure currency purchases.
- Broad achievements unlock narrow prestige origins.
- Current-run temporary state is treated as durable family evidence.

Mitigations:

- require source-labeled evidence for Tier 2 and Tier 3
- require earned evidence before Legacy purchase can unlock higher-tier origins
- require family or source-run scope for inherited standing
- use content-versioned rule data
- apply per-category thresholds and caps
- hide blocked mechanics until owner systems exist
- keep special cases manual or narrative-owned

## Migration Behavior

When future resolver inputs are missing, choose safe fallback behavior:

- Old accounts with no family ledger: use default/new-account backstories only, plus any account-wide evidence explicitly supported.
- Old saves with selected backstories that later become locked: keep the historical backstory valid for that character.
- Old runs lacking source attribution: do not infer earned skill maxima; treat high-tier evidence as missing.
- Old achievements that are too broad: do not use them for narrow Tier 2 or Tier 3 unlocks until reviewed.
- Policy version changed: use migration fallback and log/report warnings in resolver output.
- Family id missing: do not grant family-scoped origins.
- Lineage id missing: do not grant lineage-scoped origins.
- Content id renamed, retired, or converted: preserve historical ids on old characters, and map only through reviewed migration records.

Missing evidence should usually mean locked, hidden, or default fallback, not data repair by assumption.

## Data Ownership Table

| Evidence category | Owner | Scope | Readiness | Starter-granted allowed? | Near-term usable? | Unlock tier suitability | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `skill_threshold` | Player progression | character/source-run | partial | no | limited | Tier 1/2 | Needs source filtering. |
| `earned_skill_maximum` | Player progression/account archive | source-run/family | needs owner | no | no | Tier 1/2/3 | Required before skill-backed higher tiers. |
| `achievement` | Achievement engine | account/character | safe | n/a | yes, mapped narrowly | Tier 1/2 | Avoid broad-to-narrow abuse. |
| `activity_tag` | Activity runtime | character/source-run | needs owner | no | no | Tier 1/2 | Needs durable activity history. |
| `source_run_evidence` | Account history/run lifecycle | source-run/family/account | partial | no | limited | Tier 1/2/limited 3 | Needs evidence summaries. |
| `chronicle_flag` | Chronicle/quest owner | mixed | partial | n/a | limited | Tier 1/2/special | Needs flag vocabulary. |
| `profession_history` | Future profession owner | character/source-run/family | blocked | no | no | Tier 1/2 | No durable owner yet. |
| `faction_or_region_reputation` | Reputation owner | region/faction/family | partial | n/a | no | Tier 2/3 | Carryover unclear. |
| `renown_milestone` | Renown owner | region/family | partial | n/a | no | Tier 2/3/special | Current renown is not enough for universal status. |
| `lineage_title` | Future title owner | lineage/family/title | blocked | n/a | no | Tier 3/special | Needs legal/status ownership. |
| `estate_milestone` | Estate owner | estate/family/source-run | blocked | n/a | no | Tier 3/special | Current previews are not status proof. |
| `institution_acceptance` | Future institution owner | institution/family | blocked | n/a | no | Tier 2/3/special | Needed for scholar/temple/oath. |
| `patronage` | Future patron/contact owner | family/social | blocked | n/a | no | Tier 2/3/special | No contact system yet. |
| `adoption` | Future family/legal owner | family/lineage | blocked | n/a | no | Tier 2/3/special | Needs relationship model. |
| `marriage` | Future family/legal owner | family/lineage/title | blocked | n/a | no | Tier 2/3/special | Needs relationship model. |
| `story_outcome` | Quest/Chronicle owner | mixed | needs owner | n/a | no | Tier 2/3/special | Needs reviewed outcomes. |
| `family_skill_maximum` | Future family ledger | family/lineage | blocked | no | no | Tier 2/3 | Needs family storage. |
| `family_backstory_history` | Future family ledger | family/source-run | blocked | no | no | Tier 2/3 | Needs selected-backstory history. |
| `legacy_purchase` | Legacy runtime | account/family/region | partial | n/a | only with evidence | Tier 1/2/3 support | Not sufficient alone for higher tiers. |
| `echo_requirement` | Account history/run lifecycle | account/source-run/family | partial | n/a | support only | Tier 2/3 support | Echo supports, not proves, identity. |
| `prestige_requirement` | Legacy/future prestige owner | account/family/region | partial | n/a | support only | Tier 2/3 support | Account Prestige is not family status. |
| `special_case` | Narrative/migration owner | special/manual | manual only | n/a | no | special/deferred | Hide or manually gate. |

## Implementation Sequence Update

This ownership pass confirms that a runtime policy shape can be drafted next, but it must explicitly model evidence source, scope, and missing-data behavior. No extra planning step is required before the policy-shape draft if that draft stays non-runtime and schema-free.

Recommended pipeline:

1. Version 0.5.53 - Backstory Runtime Policy Shape Draft
2. Version 0.5.54 - Backstory Eligibility Resolver Test Plan
3. Version 0.5.55 - Backstory Eligibility Resolver Implementation
4. Version 0.5.56 - Creator Locked Backstory Presentation Plan
5. Version 0.5.57 - Backstory Legacy Purchase Integration Plan

Before implementation, the policy shape and test plan must prove that blocked evidence cannot unlock content, starter-granted skill ranks are excluded, family-scoped fiction stays family-scoped, and missing old data falls back safely.
