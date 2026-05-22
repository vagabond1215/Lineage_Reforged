# Heirloom vs Bequest Vocabulary Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Status: consumed but retained temporary checklist

0.5.73 cleanup note: `Version 0.5.70 - Heirloom And Bequest Systems Plan` consumed and expanded this vocabulary audit, and durable vocabulary now also lives in `docs/design/future-system-design-ledger.md`. Keep this file only as a compact checklist for a later heirloom/bequest runtime-readiness cleanup; use the newer plan and ledger as authority when they disagree.

## Purpose

This audit reduces terminology and ownership risk before `Version 0.5.70 - Heirloom And Bequest Systems Plan`.

It defines strict vocabulary boundaries between:

- Bloodline upgrades
- Bequests
- Heirlooms
- Estate assets
- Family Prestige spending
- Chronicle Marks / Lineage Seals
- Backstory support

This document does not:

- implement heirlooms
- implement bequests
- add item-instance persistence
- add estate transfer behavior
- add heir systems
- add Family Prestige spending
- add Chronicle Marks or Lineage Seals
- add Backstory Eligibility evidence
- edit content JSON
- edit runtime/source/UI files
- update generated UI output
- update `docs/dev/current-codex-output.md`

## 0.5.70 Planning Checklist

Use this checklist before generating or running `Version 0.5.70 - Heirloom And Bequest Systems Plan`:

- Confirm the output is planning-only unless the user explicitly scopes implementation.
- Inspect `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, `docs/dev/project-roadmap.md`, `docs/design/future-system-design-ledger.md`, this audit, and `docs/design/legacy-scope-bloodline-economy-plan.md` first.
- Separate Bloodline upgrades, Bequests, Heirlooms, Estate assets, Family Prestige spending, Chronicle Marks, Lineage Seals, and Backstory support into distinct owners.
- Produce a data-owner map before proposing any runtime shape.
- Preserve the rule that bequests and heirlooms do not grant Backstory identity by themselves.
- Preserve the rule that heirlooms require one persistent item instance, not duplicated starter gear.
- Preserve the rule that bequests require an estate/material/legal transfer owner.
- Keep Family Prestige spending conceptual unless a later implementation pass owns spending, ledger effects, and validation.
- Do not add heir systems, heir slots, item persistence, estate delivery, bequest claims, heirloom registration, UI buttons, or generated output.
- End the plan with a proposed implementation sequence and tests required before any future mutating behavior.

## Sources Inspected

- `docs/dev/project-roadmap.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- backlog search results for heirloom/bequest/deferred mentions

## Executive Summary

Use these distinctions consistently:

| Concept | Meaning | Owner | Not allowed to mean |
| --- | --- | --- | --- |
| Bloodline upgrade | Inherited tendency, aptitude, temperament, growth, resistance, or family potential. | Family/Bloodlines. | Material inheritance, specific item transfer, estate claim, social title, or backstory identity. |
| Bequest | Intentional material, estate, legal, or household transfer. | Estate/family ownership. | Genetic inheritance, stat tendency, family aptitude, unique item-chain identity, or backstory identity. |
| Heirloom | One persistent item instance with an ownership chain. | Family + item instance owner. | Generic starter item, copied catalog record, estate bundle, ordinary bequest, or item immunity. |
| Estate asset | Stored asset, claim, property, currency, item stack, workshop, holding, or operational asset. | Estate ownership. | Bloodline trait or family aptitude. |
| Family Prestige | Ledger-derived family resource that may later fund family-scoped actions. | Specific family ledger. | Account Prestige, generic currency, or proof that a transfer/effect exists. |
| Chronicle Mark | Account-wide milestone/progression mark. | Chronicle/account. | Family-specific history for unrelated families. |
| Lineage Seal | Rare capstone/branch-closure benchmark. | Chronicle/Bloodline capstone owner. | Farmable generic currency. |

## Core Vocabulary Rules

### Bloodline

Use `Bloodline` for inherited family tendency or potential.

Allowed Bloodline concepts:

- stat tendency
- skill growth chance
- family-associated aptitude
- temperament tendency
- inherited resistance
- prestige gain tendency
- future family-scoped preparation affinity

Forbidden Bloodline usage:

- coin inheritance
- specific tools or weapons
- estate claim
- land parcel
- workshop ownership
- trade license
- legal writ
- named item transfer
- noble title claim without title/status owner
- backstory identity by itself

Rule:

```text
If the effect is about what descendants are more likely to become, use Bloodline.
If the effect is about what someone intentionally leaves behind, do not use Bloodline.
```

### Bequest

Use `Bequest` for intentional transfer of material, estate, legal, household, or claim-based assets.

Allowed Bequest concepts:

- coin
- tools
- supplies
- land parcel
- workshop stake
- estate claim
- household documents
- trade license
- legal writ
- stored equipment bundle
- family contact/introduction only after contact systems exist

Forbidden Bequest usage:

- stat growth
- genetic traits
- aptitude
- temperament
- resistance
- skill growth multiplier
- family prestige gain tendency
- noble blood by itself
- backstory identity by itself
- unique item-chain identity when persistence matters

Rule:

```text
If the important part is the transfer package, use Bequest.
If the important part is one named object's chain of ownership, use Heirloom.
```

### Heirloom

Use `Heirloom` for a specific persistent item instance with a recorded ownership chain.

Allowed Heirloom concepts:

- named family sword
- inherited crafting tool
- restored shield
- signed book or relic with owner history
- instrument, holy symbol, or keepsake only when represented as a single item instance
- item that can be held, stored, lost, damaged, stolen, recovered, repaired, reforged, or destroyed

Forbidden Heirloom usage:

- duplicated starter weapon for every descendant
- generic catalog item granted each run
- stack of supplies
- coin bundle
- land claim
- workshop stake
- legal writ unless the writ itself is a unique persistent item and not just a claim effect
- item immunity
- direct backstory identity
- automatic family status/title

Rule:

```text
If the item can be copied without breaking the fantasy, it is probably not an heirloom.
If losing the exact object matters, it is probably an heirloom.
```

## Decision Tree

Use this before naming a future system or prompt:

1. Is the effect inherited tendency, aptitude, growth, temperament, or family potential?
   - Yes -> Bloodline upgrade/preparation.
2. Is the effect an intentional transfer of material, estate, property, documents, coin, tools, supplies, or claim rights?
   - Yes -> Bequest or Estate transfer.
3. Is the transferred thing one specific item instance whose identity and history matter?
   - Yes -> Heirloom.
4. Is the effect account-wide recordkeeping or broad cross-family progression?
   - Yes -> Chronicle / Chronicle Marks.
5. Is the effect a rare capstone or family-branch closure benchmark?
   - Yes -> Lineage Seal candidate.
6. Does the effect unlock a backstory or social origin?
   - It must go through Backstory Eligibility with explicit owner evidence. Do not grant through Bloodline, Bequest, or Heirloom labels alone.

## Player-Facing Copy Rules

Use grounded inheritance language.

Preferred Bloodline copy:

- `Family tendency`
- `Bloodline aptitude`
- `Inherited discipline`
- `Household tradition`
- `Line memory`
- `Family temperament`

Preferred Bequest copy:

- `Bequest`
- `Estate bequest`
- `Household transfer`
- `Stored inheritance`
- `Claimed from estate`
- `Family provision`

Preferred Heirloom copy:

- `Family heirloom`
- `Registered heirloom`
- `Inherited item`
- `Named heirloom`
- `Ancestral item`
- `Recovered heirloom`
- `Broken heirloom`
- `Lost heirloom`

Avoid:

- `New Game+ item` for heirlooms or bequests
- `bloodline bequest`
- `heirloom bundle`
- `genetic bequest`
- `family perk item`
- `free starter heirloom`
- `sell a child` or any crude branch-conversion wording
- `claim noble line` without title/status owner
- `unlock backstory` from a bequest/heirloom alone

## Ownership Rules

### Bloodline ownership

Bloodline effects belong to a family/Bloodlines owner.

Requirements before implementation:

- explicit `familyId`
- family record exists
- effect is scoped to family members / eligible descendants
- effect does not apply account-wide unless intentionally converted through Chronicle
- no direct backstory package stacking
- no bypass of starter caps or breakthrough gates

### Bequest ownership

Bequests require estate or family ownership.

Requirements before implementation:

- explicit source owner
- explicit recipient/claimant rule
- material/estate/legal transfer shape
- delivery state or claim state
- storage or inventory boundary
- failure/locked state when delivery owner is missing
- no social/title/status implication unless title/status system exists

### Heirloom ownership

Heirlooms require item-instance persistence.

Requirements before implementation:

- `heirloomId`
- `familyId`
- `itemInstanceId`
- original holder
- current holder or stored/lost state
- ownership chain
- eligible next holder rule
- transfer cost and reason
- loss/damage/recovery state

Heirloom status should never make an item immune to world systems.

## Relation To Family Prestige

Family Prestige may later fund or register:

- Bloodline upgrades
- Bequest preparation or transfer fees
- Heirloom registration
- Heirloom transfer
- family record/tree upgrades
- family-scoped backstory support

But Family Prestige alone is not proof that any effect exists.

Rules:

- Spending Family Prestige must reference the thing purchased/supported.
- Available balance should be derived from the family ledger.
- Family Prestige should not be spent account-wide unless converted through Chronicle.
- No spend buttons until the spend owner exists.

## Relation To Estate

Estate is the natural owner for material inheritance and claims.

Bequests often use estate semantics.

Examples:

- coin bequest -> estate/currency transfer
- tool bequest -> estate/item transfer
- workshop stake -> estate/operational asset or claim
- land parcel -> estate/property claim
- legal writ -> estate/document claim

Heirlooms may be stored in an estate, but their identity remains the single item instance and ownership chain.

Rule:

```text
Estate can store or deliver a thing.
Heirloom records why one exact thing matters.
Bequest describes the intentional transfer package.
```

## Relation To Backstory Eligibility

Bloodlines, bequests, and heirlooms must not directly grant backstory identity.

Allowed later:

- Family history may become resolver evidence through an approved evidence owner.
- Family Prestige purchases may support family-scoped backstory access after purchase/runtime shapes are approved.
- A bequest may support a practical start only when transfer semantics are owned and tested.
- A heirloom may be displayed as context only, unless a future system explicitly makes it part of start-state transfer.

Forbidden:

- bequest grants `Minor Noble`
- heirloom grants `Garrison Ward`
- bloodline grants `Merchant Family` without trade/family evidence
- estate claim grants title/status without title/status owner
- family tree display unlocks backstory availability
- creator UI bypasses the Backstory Eligibility resolver

## Relation To Chronicle Marks And Lineage Seals

Chronicle Marks and Lineage Seals are not bequests or heirlooms.

Chronicle Marks:

- account-wide broad progression
- can let successful families help future unrelated families without fabricating local/family history
- should use reduced conversion or milestone logic

Lineage Seals:

- rare capstone/branch-closure/major-milestone currency
- structural decisions only
- not a farmable generic spend pool

Branch closure copy should stay dignified:

Preferred:

- `Close a Branch`
- `Settle the Line`
- `Retire an Heir Claim`
- `Dedicate a Branch to the Chronicle`
- `Enter the Line into Record`

Avoid crude/exploitative phrasing.

## UI IA Recommendations

For first read-only Bloodlines UI:

- omit Bequests and Heirlooms panels unless explicitly scoped
- if shown, make them inactive and non-clickable
- do not show `Create`, `Transfer`, `Register`, `Spend`, or `Claim` buttons
- use notes that clearly say future systems are inactive

Safe inactive copy:

```text
Bequests are not active yet.
Heirlooms are not active yet.
```

Better future panel split:

```text
Bloodlines
  Family Detail
    Overview
    Tree
    Prestige
    Bequests       # estate/material transfers, future inactive
    Heirlooms      # persistent item chains, future inactive
```

Do not merge Bequests and Heirlooms into one panel once both become meaningful; they answer different player questions.

## `0.5.70` Recommended Scope

`Version 0.5.70 - Heirloom And Bequest Systems Plan` should be planning-only unless explicitly re-scoped.

Recommended output:

- glossary
- ownership matrix
- data-owner map
- allowed/deferred behavior table
- first safe bequest candidates
- first safe heirloom candidates
- forbidden conflations
- future test list
- proposed implementation sequence

Recommended sequence inside the plan:

1. Confirm vocabulary and owner split.
2. Map current estate/account/family data that can support bequest planning.
3. Define bequest claim lifecycle without implementing it.
4. Define heirloom item-instance lifecycle without implementing it.
5. Define where Family Prestige could later fund registration/transfer.
6. Define tests that would be required for implementation.
7. Keep Backstory Eligibility and creator behavior untouched.

Do not implement:

- item-instance persistence
- bequest delivery
- heirloom registration
- heirloom transfer
- family prestige spending
- heir slots
- branch closure
- Chronicle Marks
- Lineage Seals
- Backstory evidence
- UI buttons
- generated UI output

## Future Test Requirements

When implementation eventually begins, tests should prove:

- bequest does not grant bloodline traits
- bloodline upgrade does not transfer material goods
- heirloom is one item instance, not duplicated
- heirloom can be unavailable if lost/broken/destroyed
- bequest claim fails without estate/family owner
- heirloom transfer fails without eligible holder
- Family Prestige spend references the exact supported thing
- no backstory availability changes from bequest/heirloom records alone
- no creator resolver bypass
- no account-wide effect from family-scoped bequest/heirloom unless explicitly converted

## Risks

- Mixing bequests and heirlooms could accidentally duplicate items or turn family relics into generic starter gear.
- Mixing bloodline upgrades and bequests could make inherited aptitude feel like inventory transfer.
- Letting estate claims imply noble/status ownership could bypass future status/title systems.
- Letting bequests or heirlooms affect Backstory Eligibility directly could bypass resolver evidence rules.
- Adding visible UI too early could imply actions exist before owner systems are implemented.

## Open Questions For User

These do not block a planning-only `0.5.70`, but should be answered before implementation:

1. Should bequests be limited to family/heir contexts only, or can some account-level estate bequests support unrelated future characters through Chronicle mechanics?
2. Should heirlooms always require a family line, or can a non-family Chronicle heirloom exist later?
3. Should heirloom registration be possible only at retirement/death, or during active play at special locations?
4. Should bequests require a will/estate planning action, or should some transfer automatically on retirement/death?
5. Should a destroyed heirloom be permanently gone, or can rare recovery/reforging create a new recorded heirloom state?

## Recommended Next Prompt Target

Use this when `0.5.70` becomes active:

```text
Version 0.5.70 - Heirloom And Bequest Systems Plan

Use docs/design/heirloom-vs-bequest-vocabulary-audit.md as the vocabulary source.
Create a planning-only design document that separates bequests, heirlooms, Bloodline upgrades, Estate assets, Family Prestige spending, Chronicle Marks, Lineage Seals, and Backstory support.
Do not implement runtime/source/schema/UI changes.
Do not add item persistence, estate transfer, heirloom registration, Family Prestige spending, Backstory Eligibility evidence, creator behavior, or generated UI output.
```
