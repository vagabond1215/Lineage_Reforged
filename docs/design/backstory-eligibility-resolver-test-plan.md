# Backstory Eligibility Resolver Test Plan

Source version/run: Version 0.5.55 - Backstory Eligibility Resolver Test Plan
Date: 2026-05-18
Status: planning-only test plan

## Purpose

This document defines the future test coverage required before implementing the Backstory Eligibility Resolver. It is a planning document only.

Current branch reality for this pass:

- The live backstory catalog has 27 records.
- Current character creation still builds backstory options from every live record in `packages/content/base/player/backstories.json`.
- Current character creation validation checks known backstory ids and settlement-start access, but does not filter backstories through a resolver.
- Current new-game snapshot creation applies only the selected live backstory starter skills, attributes, and allowlisted starting abilities.
- `docs/design/backstory-policy-metadata.json` remains non-runtime planning metadata with `status: "non_runtime_policy_draft"` and `runtimeImportAllowed: false`.
- `docs/design/legacy-upgrade-catalog-draft.json` remains non-runtime with `runtimeImportAllowed: false`.
- Version 0.5.54 added the pre-release rule that this project should not plan backwards compatibility unless explicitly requested.

## Non-Goals

This document does not:

- implement tests
- implement the Backstory Eligibility Resolver
- create runtime policy data
- create schemas
- change live backstory availability
- change character creator behavior
- change starter skills, starting abilities, attributes, save/account storage, Legacy runtime, combat, magic, economy, progression, launcher UI, generated UI output, or live content records
- plan backwards compatibility, old-save preservation, old-account preservation, id aliases, retired-id handling, converted-id handling, historical id preservation, migration-only behavior, old selected backstory preservation, or old-data rescue behavior

## Test Strategy Overview

Future resolver work should land with tests before or alongside implementation. The coverage should be layered so failures clearly identify whether the issue is policy shape, evidence evaluation, scope isolation, selected-effect application, or creator integration.

Required future test layers:

| Layer | Purpose | Suggested timing |
| --- | --- | --- |
| Static policy/content validation tests | Validate approved runtime policy shape, live backstory id coverage, default ids, duplicate rules, and blocked evidence declarations. | Resolver implementation pass. |
| Resolver pure-function unit tests | Validate eligibility projection from policy plus current account/save inputs without UI or storage side effects. | Resolver implementation pass. |
| Evidence evaluation tests | Validate `requiresAll`, `requiresAny`, evidence kinds, Legacy purchase support, Prestige/Echo requirements, missing data, and blocked evidence. | Resolver implementation pass. |
| Scope isolation tests | Validate account, family, lineage, source-run, region, faction, institution, estate/title, and special/manual boundaries. | Resolver implementation pass. |
| Default safety tests | Prove missing optional evidence still returns safe default current behavior without unlocking higher tiers. | Resolver implementation pass. |
| No-stacking tests | Prove unlock parents are access evidence only and only one selected backstory applies effects. | Resolver implementation pass. |
| Non-import boundary tests | Prove runtime resolver code does not consume design-only metadata, drafts, or design docs. | Resolver implementation pass. |
| Blocked, special, and deferred behavior tests | Prove unsupported owners cannot unlock or expose unsupported promises. | Resolver implementation pass. |
| Creator integration boundary tests | Prove creator receives and validates resolver projections rather than raw catalog availability. | Later creator presentation pass. |

Recommended sequencing:

1. Version 0.5.55 - Backstory Eligibility Resolver Test Plan
2. Version 0.5.56 - Backstory Eligibility Resolver Implementation with focused tests
3. Version 0.5.57 - Creator Locked Backstory Presentation Plan
4. Version 0.5.58 - Backstory Legacy Purchase Integration Plan

## Non-Import Boundary Tests

Future tests must prove that runtime resolver code does not consume design-only artifacts.

Design-only artifacts that must not be runtime inputs:

- `docs/design/backstory-policy-metadata.json`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `futureBackstoryLaneDrafts[]`
- design documents under `docs/design/`

Expected assertions:

- design docs do not affect creator availability
- planning metadata remains non-runtime
- future runtime policy is separate and explicitly approved
- resolver tests fail if implementation imports `docs/design/backstory-policy-metadata.json`
- resolver tests fail if implementation imports `docs/design/legacy-upgrade-catalog-draft.json`
- resolver tests fail if implementation treats `futureBackstoryLaneDrafts[]` as live backstory policy
- creator availability does not change when design-only draft metadata changes

The existing metadata tests already check some non-import boundaries. Future resolver tests should extend that boundary around the new resolver module and any approved runtime policy file.

## Current Live Catalog Coverage Tests

Future static policy tests must prove that the resolver covers the current live catalog without inventing compatibility rescue behavior.

Expected assertions:

- every current live backstory id has one resolver rule or an explicit current-data fallback
- every default id references a current live backstory id
- no resolver rule references a missing live id, except clearly marked future examples in docs or isolated test fixtures
- future examples are not treated as live policy
- duplicate backstory rules are rejected
- unknown selected ids fail current-data validation rather than being rescued through alias or old-id behavior
- every rule references a live content record before it can be selectable
- every live content record remains available only through its selected resolver projection once the resolver is wired

Current live catalog summary to preserve in fixtures:

- 27 current live backstory records
- 27 current non-runtime policy metadata records
- current default-policy ids: `backstory.local`, `backstory.vagabond`, `backstory.exile`, `backstory.farmhand`, `backstory.amnesiac`
- future examples such as Sword Drill or Recognized Heir are not live backstory ids

## Default And New-Account Safety Tests

Future tests must prove character creation cannot dead-end when optional evidence channels are absent.

Baseline default set:

| Backstory | Id |
| --- | --- |
| Local | `backstory.local` |
| Vagabond | `backstory.vagabond` |
| Exile | `backstory.exile` |
| Farmhand | `backstory.farmhand` |
| Amnesiac | `backstory.amnesiac` |

Expected assertions:

- default set is never empty
- default set includes only valid live ids
- missing optional evidence returns default-safe current behavior
- missing family evidence does not dead-end creation
- missing lineage evidence does not dead-end creation
- missing source-run evidence does not dead-end creation
- default safety does not bypass settlement-start authorization
- default safety does not unlock Tier 2, Tier 3, special, or deferred origins
- a default fallback does not grant family, noble, title, institution, region-renown, magic, mount, contact, market, or medical evidence

Future default or early-Legacy candidates can be tested as candidates only until approved runtime policy changes availability:

- Street Vendor
- Net-Tender
- Gatherer
- Drover's Hand
- Kitchen Hand
- Militia Levy
- Scribe's Apprentice

## Availability Status Tests

Future policy validation and resolver tests should cover only the planned current/future selection statuses:

| Status | Selectable expectation | Visibility expectation | Explainability expectation | Creator selection |
| --- | --- | --- | --- | --- |
| `always_available` | Selectable if live id and settlement authorization pass. | Visible. | Usually no locked explanation. | Can appear selectable. |
| `default_available` | Selectable under default-safe current behavior. | Visible. | May explain that it is a baseline origin. | Can appear selectable. |
| `early_legacy` | Selectable only after low-risk purchase or simple approved evidence passes. | Visible if the rule is supported. | Explains purchase/evidence requirement without promising unsupported systems. | Can appear locked or selectable. |
| `locked` | Not selectable until requirements pass. | Visible if explainable and supported. | Explains supported requirements only. | Can appear locked. |
| `hidden` | Not selectable. | Hidden from normal creator surfaces. | No normal player-facing promise. | Must not appear selectable. |
| `special` | Not selectable by ordinary progression unless manually allowed by an owned narrative rule. | Hidden or specially surfaced. | Explains only safe narrative ownership. | Usually not selectable. |
| `deferred` | Not selectable. | Hidden or conservative placeholder only. | Must not promise unsupported owner systems. | Must not appear selectable. |

Tests should assert that `retired` and `converted` are not valid planned availability statuses unless the user explicitly requests compatibility work later.

## Evidence Requirement Tests

Future evidence tests should validate requirement evaluation independently from UI and storage.

Requirement features to test:

- `requiresAll`
- `requiresAny`
- nested groups, only if implementation actually supports them
- `requiresEvidence`
- `requiresLegacyPurchase`
- `requiresPrestige`
- `requiresEcho`
- `blocksIf`

Expected assertions:

- all required conditions must pass for `requiresAll`
- any-group alternatives pass when exactly one valid alternative is met
- any-group alternatives fail when all alternatives are missing or blocked
- nested groups have deterministic precedence if implemented
- missing evidence resolves as unmet, hidden, or deferred depending on the rule
- blocked evidence cannot unlock content
- Legacy purchase alone cannot unlock Tier 2 or Tier 3
- Echo and Prestige support access only when required scoped evidence exists
- unsupported owner systems force `hide`, `defer`, or `treat_as_unmet`
- broad achievements do not satisfy narrow evidence requirements unless explicitly mapped by runtime policy

Example assertions:

- a Tier 2 Merchant Family rule can pass with approved trade evidence plus Legacy or Prestige support
- a Tier 2 Merchant Family rule fails with only account Legacy points
- a Tier 3 or special status rule fails when estate/title ownership is blocked

## Starter-Granted Skill Exclusion Tests

Future resolver tests must preserve the rule that starter-granted ranks do not count as earned skill maxima by default.

Expected assertions:

- starter-granted ranks do not count as earned skill maxima by default
- a skill granted by the selected backstory cannot unlock a higher-tier descendant by itself
- earned skill evidence must come from `earned_play` or approved source-run evidence after ownership exists
- missing source attribution does not infer earned maxima
- starter skill cap assumptions remain protected
- breakthrough-safe cap assumptions remain protected
- skill evidence tests distinguish current starter skills from play-earned skill history

Example:

Militia Levy grants starter familiarity with formation discipline. That starter grant must not automatically unlock Garrison Ward or future Sword Drill. Those origins require earned/source-run evidence, explicitly recorded family history, or another approved evidence channel plus any required Legacy support.

## Family, Account, And Scope Isolation Tests

Future scope tests must prove that evidence does not leak across scopes.

Scope categories to test:

- account
- family
- lineage
- character
- source-run
- region
- faction
- institution
- estate/title
- special/manual

Expected assertions:

- family-scoped rules do not fall back to account-wide evidence
- noble, status, title, estate, and institution evidence cannot be account-wide by default
- local-renown evidence stays region or settlement scoped
- institution origins require institution-scoped evidence when implemented
- source-run evidence identifies a valid source-run owner when required
- missing family id does not grant family-scoped origins
- missing lineage id does not grant lineage-scoped origins
- account-wide content visibility does not grant unsupported social status or lineage standing

Examples:

- Minor Noble cannot unlock from account Prestige alone.
- Merchant Family cannot unlock from generic account wealth alone.
- Local Champion cannot become global account-wide renown.
- World-Stray stays special/manual or hidden.

## Blocked Evidence Tests

Future tests must prove blocked evidence kinds resolve safely.

Blocked categories include:

- family skill maxima
- family backstory history
- heir legitimacy/status
- estate/title ownership
- regional renown storage if not durable and scoped
- institutional membership
- patronage/contact systems
- adoption
- marriage
- mounted behavior and mount ownership
- market/economy effects
- magic licensing/acquisition
- medical/injury systems
- oath and paladin behavior

Expected assertions:

- blocked evidence cannot unlock content
- blocked evidence does not appear as a near-term creator promise
- blocked special records remain unavailable
- blocked deferred records remain unavailable
- blocked owners use `hide`, `defer`, or `treat_as_unmet`
- blocked evidence kinds are declared centrally in the approved runtime policy shape
- a blocked owner cannot be bypassed by Legacy points, Echo, Prestige, or account-wide flags

## No-Stacking Tests

Future tests must prove that selecting one backstory applies one backstory package.

Expected assertions:

- exactly one selected backstory applies effects
- parent backstory effects do not stack with child backstory effects
- historical or parent backstories are access evidence only when separately recorded by a current-data owner
- selected backstory starter skills are the only applied backstory starter skills
- selected backstory attribute adjustments are the only applied backstory attribute adjustments
- selected backstory starting abilities are the only applied backstory starting abilities
- unlocking a higher-tier origin does not grant the lower-tier package too
- resolver access results do not mutate new-game snapshot effect application

Example:

Future Sword Drill can require Militia Levy history, but selecting Sword Drill must not apply Militia Levy bonuses, starter skills, attributes, or abilities.

## Representative Rule Fixture Tests

Future resolver fixtures should cover representative current records and explicitly marked future examples. Future examples must not be counted as live policy.

| Fixture | Current live id? | Expected coverage |
| --- | --- | --- |
| Local | Yes, `backstory.local` | Passes as default-safe current behavior. |
| Street Vendor | Yes, `backstory.street_vendor` | Candidate default or early-Legacy Tier 1; no market passive, contact, or economy unlock. |
| Militia Levy | Yes, `backstory.militia_levy` | Candidate early-Legacy or simple evidence Tier 1; no soldier rank or weapon specialization. |
| Scribe's Apprentice | Yes, `backstory.scribes_apprentice` | Mundane records/admin origin; must remain separate from magical scholarship. |
| Merchant Family | Yes, `backstory.merchants_child` | Tier 2 trade-family access requires scoped trade evidence plus support, not account wealth alone. |
| Garrison Ward | Yes, `backstory.military_brat` | Tier 2 combat-adjacent origin requires militia/source-run evidence plus support; no command authority by purchase alone. |
| Scholar's Apprentice | Yes, `backstory.scholars_apprentice` | Requires careful magic/institution treatment; should lock or defer until owner is safe. |
| Temple Acolyte | Yes, `backstory.temple_acolyte` | Divine/institution evidence should be owned before unlock. |
| Hedge Adept | Yes, `backstory.hedge_adept` | Magic acquisition/licensing remains blocked or special until owner exists. |
| Minor Noble | Yes, `backstory.minor_noble` | Estate/title/family-scoped; cannot unlock from account Prestige alone. |
| Local Champion | Yes, `backstory.local_hero` | Special or converted-by-current-policy style planning; region/achievement/story scoped if ever selectable. |
| World-Stray | Yes, `backstory.isekai_outcast` | Special/manual or hidden; not normal tier progression. |
| Future Sword Drill | No | Clearly marked future example; tests no-stacking and earned/source-run evidence. |
| Future Recognized Heir | No | Clearly marked future example; deferred/special until family/title/estate/legal owners exist. |

For each representative fixture, future tests should define:

- what passes
- what fails
- what hides
- what defers
- what remains special/manual
- which evidence scopes are accepted
- which evidence scopes are rejected
- which explanations are safe to show

## Creator Integration Boundary Tests

Creator integration tests should come after resolver implementation and before locked-backstory UI work.

Expected future assertions:

- creator receives a resolver projection rather than raw live catalog availability
- creator validates selected id against resolver output
- locked records cannot be selected
- hidden records are not selectable
- deferred records are not selectable
- default records remain selectable
- settlement-start authorization remains separate from backstory eligibility
- creator copy does not promise unsupported systems
- raw live catalog records can still provide labels, descriptions, starter skill display, and selected effects after eligibility is resolved

Do not implement UI changes during the resolver test or implementation pass unless that later prompt explicitly scopes creator integration.

## No-Compatibility Tests

Future tests should explicitly enforce the pre-release no-compatibility policy so compatibility logic does not creep into the resolver before it is requested.

Expected negative assertions:

- no alias-based id rescue
- no retired or converted id status handling
- no old-save preservation path
- no old-account migration path
- no migration-only selection logic
- no historical id preservation logic
- no old selected backstory preservation path
- current content ids are validated directly
- missing old data does not grant access

These tests should live near static policy validation or resolver input validation. They should not add compatibility layers; they should prevent them.

## Future Test File Candidates

Use current repo conventions under `tests/unit/`. Do not create these files until the implementation pass or a dedicated test authoring pass.

Recommended file candidates:

- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `tests/unit/backstory-eligibility-evidence.test.mjs`
- `tests/unit/backstory-eligibility-scope.test.mjs`
- `tests/unit/backstory-eligibility-creator-boundary.test.mjs`

If the implementation stays compact, the first pass may combine policy, resolver, evidence, and scope into fewer files. Keep creator-boundary tests separate once UI integration begins.

## Implementation Readiness Checklist

Version 0.5.56 should not begin implementation until these items are decision-complete:

- runtime policy shape chosen
- test fixture shape chosen
- default set finalized
- blocked evidence list finalized
- availability statuses finalized
- no-compatibility behavior finalized
- non-import boundary tests planned
- current live catalog coverage tests planned
- default/new-account safety tests planned
- evidence requirement tests planned
- blocked evidence tests planned
- no-stacking tests planned
- starter-granted exclusion tests planned
- family/account/scope tests planned
- representative rule fixture tests planned
- creator integration boundary intentionally deferred or explicitly scoped

This test plan is sufficient to proceed to a narrow resolver implementation if the implementation also creates the approved runtime policy shape and tests in the same scoped pass. If policy fixture shape remains unsettled at implementation start, split out a short fixture-shape pass before resolver code.

## Recommended Next Pipeline

Recommended next steps:

1. Version 0.5.56 - Backstory Eligibility Resolver Implementation
2. Version 0.5.57 - Creator Locked Backstory Presentation Plan
3. Version 0.5.58 - Backstory Legacy Purchase Integration Plan

The implementation pass should stay narrow: approved runtime policy shape, resolver pure function, focused tests, and non-import boundaries. Creator filtering/presentation, Legacy purchase integration, and unsupported evidence owners should remain separate unless explicitly scoped.

## Risks And Follow-Up

- Current account and save data do not yet store earned skill maxima separately from starter-granted ranks.
- Family, lineage, source-run, institution, estate/title, region-renown, contact, magic licensing, medical, mount, and oath evidence owners remain missing or partial.
- Existing achievements are broad and should not unlock narrow Tier 2 or Tier 3 origins without explicit policy mapping.
- Runtime policy must be authored separately from design metadata and validated against current live content ids.
- Creator integration should wait until resolver output shape is stable.
