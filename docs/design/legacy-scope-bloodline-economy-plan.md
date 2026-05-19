# Legacy Scope And Bloodline Economy Plan

Source version/run: Version 0.5.60 - Legacy Scope And Bloodline Economy Plan
Date: 2026-05-19
Status: planning-only design document

## Purpose

This document plans the Legacy, Bloodline, and Family Prestige economy before future Backstory Legacy purchase runtime work. It revises the immediate Backstory Legacy purchase pipeline because family scope, source-run evidence, family prestige ownership, and bloodline structure need clearer boundaries before purchase records or resolver purchase integration are safe.

This document does not:

- implement runtime family records
- add account schema fields
- add heir systems
- add heirloom systems
- add estate bequests
- add Legacy purchase records
- change creator availability
- change Backstory Eligibility resolver policy
- change Legacy runtime behavior
- change content JSON, policy metadata JSON, save/account schemas, generated UI output, or live content records
- plan backwards compatibility, old-save preservation, old-account preservation, id aliases, retired-id compatibility, converted-id compatibility, historical id preservation, migration-only behavior, old selected backstory preservation, or old-data rescue behavior

Current content ids should continue to validate directly.

## Current Branch Reality

Current relevant systems:

- Account profiles contain `legacy`, `achievements`, `history`, and `estate`.
- Account run history records already track character/run fields such as `characterId`, `name`, `lineageId`, `sourceRunId`, `inheritanceUsesRemaining`, `echoLevelReached`, payout metadata, and save slot ids.
- Account run history records do not currently have `familyId`, `parentCharacterId`, family tree links, branch metadata, or family prestige ledgers.
- Legacy vocabulary already includes broad scopes and currencies such as `account`, `family`, `region`, `heir_only`, `next_run`, `account_legacy`, `family_prestige`, and `regional_renown`.
- The current live Legacy catalog groups records under `Chronicle`, `Lineage`, `Renown`, `Fortune`, `Craft`, `Destiny`, and `Preparations`.
- Only current-account live implementation priority records are the account-level character-start HP, stamina, and coin upgrades. Other family, heir, backstory, regional, and future records remain planning/catalog/backlog intent rather than owned runtime systems.
- The account meta UI currently presents `Legacy` and `Chronicles` sections. It does not have a Bloodlines section.
- The character creator now consumes resolver-backed backstory availability.
- Backstory Legacy purchase integration is planned but not implemented.
- Family/source-run ledgers, scoped purchase storage, family prestige runtime, heir systems, bequests, heirlooms, and family-scoped backstory unlock support remain missing/deferred.

## Top-Level Legacy Organization

The top-level meta-progression organization should be:

```text
Legacy
  Chronicle
  Bloodlines
```

Do not make "New Game+" a top-level lore category. New Game+ style effects are functions inside Chronicle or Bloodlines depending on what they represent.

### Chronicle

Chronicle should cover account-wide progression:

- account-wide upgrades
- broad system unlocks
- cross-family progression
- global preparation capacity
- account-level marks
- presentation, records, and milestone upgrades
- upgrades that affect all families or no specific family

Chronicle is the right place for long-term account continuity that should not fabricate family-specific history.

### Bloodlines

Bloodlines should cover family-specific progression:

- family list
- active family records
- family tree presentation
- available heir slots once the heir system exists
- family prestige
- family-specific upgrades
- bloodline preparations
- estate bequests
- heirlooms
- family-scoped backstory unlock support

Bloodlines should be where the player understands a family's own history, resources, heirs, standing, and inherited tendencies.

## Family Visibility Rule

The Bloodlines section should list families that have at least one of:

- an active character
- available heir creation slots after the heir system is unlocked
- durable archived family record if a future design wants ended lines visible

This is planning only. No family records or storage are added by this pass.

The visibility rule should avoid showing empty placeholder families. A family should be visible because current data says the line exists, can continue, or has a recorded history worth presenting.

## Family Tree Model

Family trees should be derived hierarchical presentation over flat records.

Preferred future storage direction:

- family records
- character/run records tagged with `familyId`
- optional `parentCharacterId`
- optional branch, cadet branch, adoption, marriage, legitimacy, or special branch metadata later

Do not store the whole tree as nested mutable data unless a later implementation proves that flat records cannot support the required presentation or queries. Flat records are easier to validate, diff, repair during pre-release iteration, and consume from resolver evidence.

Future Bloodlines tree presentation can use an outline/file-system style:

```text
Bloodlines
  Family Name
    Root Character
      Descendant
      Descendant
        Branch
    Heir Availability
    Prestige Ledger Summary
    Family Upgrades
```

The tree view should support:

- family name
- root character
- descendants
- branches
- locked or unrevealed descendants if a later system scopes them
- heir availability
- prestige ledger summary
- family upgrades

Illegitimate heir, cadet branch, adoption, marriage, inheritance dispute, and recognition complexity remains future-only.

## Scope Model

Scope must be separate from category and currency.

Planned scopes:

| Scope | Meaning | Example use |
| --- | --- | --- |
| Chronicle/account-wide | Account-level progression that applies broadly or unlocks cross-family systems. | Global preparation capacity, account records, broad visibility. |
| Family/Bloodline | One family's own history, prestige, upgrades, preparations, backstory support, or inherited tendencies. | Merchant family evidence, family craft memory, household standing. |
| Regional/local | Region or settlement-bound standing. | Local Champion, village name, regional recognition. |
| Heir-only | One heir candidate or next selected family successor. | Heir tutoring, heir preparation, heir comparison. |
| Next-character or preparation | Limited run-start support. | Next-run preparation, starter setup. |
| Estate/bequest | Intentional estate or material transfers. | Coin, tools, supplies, land parcel, workshop stake, documents. |
| Heirloom/item-chain | Registered item continuity through eligible holders. | Family weapon, ancestral tool, named keepsake. |

Rules:

- One family should not unlock nobility backstories for another unrelated family.
- Family-scoped prestige and upgrades should not apply account-wide unless explicitly converted or designed as Chronicle effects.
- Regional/local standing should not become global status by default.
- Heir-only effects should not become permanent account or family effects by accident.
- Estate/bequest effects should not imply bloodline aptitude or genetic inheritance.
- Heirloom effects should follow one item chain and should not duplicate the item.
- Illegitimate heir and cadet branch mechanics may preserve family continuity later, but they are not part of this pass.

## Category Model

Categories are sorting and organization tags, not separate currencies by default.

The goal is clean organization with a minimal sorting system based roughly on gameplay effect. Avoid creating many prestige pools unless a future design proves that currency fragmentation is needed.

Recommended category set:

| Category | Meaning |
| --- | --- |
| Renown | Fame, reputation, social standing, recognition. |
| Martial | Combat, tactics, garrison service, military traditions. |
| Production | Crafting, workshops, materials, labor. |
| Commerce | Trade, markets, caravans, wealth systems. |
| Lore & Faith | Scholarship, temples, records, magic-adjacent learning, religious standing. |
| Survival / Utility | Travel, wilderness, endurance, scouting, general utility. |
| Household / Lineage | Heirs, family structure, bloodline continuity, family identity. |
| Preparation | Next-character, starter support, setup, limited run-start effects. |

Categories should answer "what kind of thing is this upgrade?" They should not decide which ledger pays for it by themselves.

Do not split prestige into category-specific pools unless future balancing requires it. Category tags can still support filtering, summaries, cost modifiers, or unlock prerequisites later.

## Currency And Marks Model

Plan three distinct resources.

### Family Prestige

Family Prestige is earned by a specific family and spent within that family.

It should support:

- family upgrades
- Bloodline preparations
- estate bequests
- heirloom transfers
- family-scoped backstory support
- family tree or family record upgrades

Family Prestige should use a ledger, not simple raw summed totals. The ledger should preserve grants, spends, source runs, source characters, tags, and summaries.

### Chronicle Marks

Chronicle Marks are account-wide marks gained from family accomplishments, reduced family-prestige conversion, or major account milestones.

They should support:

- broad Chronicle upgrades
- cross-family progression
- account-level visibility or recordkeeping
- future families without fabricating family-specific history

Chronicle Marks should not count as Family Prestige and should not create family history for unrelated families.

### Lineage Seals

Lineage Seals are rare benchmark currency.

They may be earned by:

- retiring heir claims
- closing branches
- major family milestones
- high-value family sacrifices
- capstone Chronicle/Bloodline decisions

They should be spent on structural or capstone upgrades. They exist to prevent pure number farming from unlocking major structural powers.

Do not implement any of these currencies in this pass.

## Family Prestige Ledger Model

Do not rely only on earned prestige per character summed by family.

Plan a ledger with:

- grants
- spends
- categories/tags for presentation
- source character/run
- source event
- current available balance derived from ledger

Draft shape only:

```ts
type FamilyPrestigeTransaction = {
  transactionId: string;
  familyId: string;
  characterId?: string;
  sourceRunId?: string;
  kind: "grant" | "spend";
  amount: number;
  categoryTag: string;
  sourceType: string;
  sourceId: string;
  recordedAt: string;
  summary: string;
};
```

Derived totals:

- earned
- spent
- available
- category presentation totals if needed
- source-run contribution totals if needed
- character contribution totals if needed

Ledger rules:

- Spends should reference what they purchased or supported.
- Grants should reference the source character/run/event.
- Available balance should be derived, not manually edited.
- Negative spends should be rejected when runtime exists.
- Family Prestige should not be spent account-wide unless converted through an explicit Chronicle mechanism.

## Chronicle Mark Conversion

Family success can contribute to account-wide Chronicle progression, but conversion should be reduced and gated.

Example model:

- No conversion until a Chronicle upgrade or system milestone is unlocked.
- Early conversion rate is low.
- Later upgrades improve conversion.
- A late capstone may approach a standard rate but should be expensive and late.
- Conversion can require settling a line, closing a branch, or dedicating a branch to the Chronicle.

Purpose:

- Supports account-wide long-term incremental upgrades.
- Lets successful families matter to future families without fabricating family-specific history.
- Reduces endless snowballing from already established families.
- Creates meaningful tradeoffs between spending Family Prestige locally and converting some value to Chronicle Marks.

Lore-friendly names:

- Enter into the Chronicle
- Preserve the Family Record
- Settle the Line
- Close a Branch
- Dedicate a Branch to the Chronicle

Avoid exploitative or crude wording. Do not use language such as "sell a child."

## Heir Slot Retirement And Branch Closure

A future mechanism can let heir slots or family branches be retired, settled, closed, or dedicated to account records to generate Chronicle Marks or Lineage Seals.

Purpose:

- gives value to unused heir slots
- converts some old family momentum into account progression
- reduces logarithmic growth from very established families
- creates meaningful sacrifice for benchmark upgrades
- gives the player a clean decision when a family line has more potential branches than they want to continue

Potential terms:

- Retire Heir Claim
- Settle an Heir
- Close a Branch
- Dedicate a Branch to the Chronicle
- Enter the Line into Record

This remains future-only. It should not be implemented until heir slots, family records, and branch ownership exist.

## Bloodline Upgrades And Preparations

Bloodline means inherited potential, family tendency, aptitude, temperament, growth, or prestige affinity.

Bloodline upgrades and preparations can include:

- improved starting stat point chance
- increased skill growth for family-associated skill groups
- increased prestige gain for descendants
- improved chance of strong physique, nature, or focus rolls
- small inherited resistance or temperament bonuses
- better aptitude for production, combat, social, or utility paths
- family-specific preparation slots once the preparation model supports family scope

These are not bequests. An ancestor cannot voluntarily pass down favorable or unfavorable genetic RNG in the same way they can leave a tool, document, or purse.

Use Bloodline terminology for pseudo-genetic, inherited momentum, family tendency, or aptitude effects.

Safety rules:

- Bloodline upgrades should be family scoped.
- Bloodline upgrades should not create direct backstory stacking.
- Bloodline upgrades should not bypass starter-skill caps or breakthrough gates.
- Bloodline preparations should remain limited, source-labeled, and visible in the creator when they affect start state.

## Bequest Model

Bequests are intentional estate or material transfers.

Bequests can include:

- coin inheritance
- tools
- supplies
- land parcel
- workshop stake
- estate claim
- household documents
- trade license
- legal writ
- family contact/introduction only after contact systems exist

Do not use Bequest for genetic, aptitude, stat-growth, trait, temperament, or RNG-style upgrades.

Bequest rules:

- Bequests should require estate or family ownership.
- Bequests should be item/material/status transfer semantics, not general bloodline power.
- Bequests should not imply social recognition unless the owning title/status system exists.
- Bequests should not grant backstory identity by themselves.

## Heirloom System Plan

Heirlooms should be a distinct family system, not ordinary bequests.

Core future rules:

- Registering a powerful item as a Family Heirloom should be expensive.
- Passing it forward should cost Family Prestige.
- It can pass generation to generation indefinitely if the chain remains valid.
- It can only be used by one eligible heir of the previous holder.
- It is not duplicated.
- If lost, stolen, confiscated, destroyed, or broken beyond recovery in-game, the inheritance chain is interrupted.

Draft shape only:

```ts
type FamilyHeirloomRecord = {
  heirloomId: string;
  familyId: string;
  itemInstanceId: string;
  displayName: string;
  originalHolderCharacterId: string;
  currentHolderCharacterId?: string;
  currentState: "held" | "stored" | "lost" | "stolen" | "confiscated" | "broken" | "destroyed";
  inheritanceChain: string[];
  eligibleNextHolderIds: string[];
};

type HeirloomTransferRecord = {
  fromCharacterId: string;
  toCharacterId: string;
  transferredAt: string;
  prestigeCost: number;
  transferReason: string;
};
```

Do not implement item persistence in this pass.

Heirloom rules:

- A Family Heirloom is a specific item instance, not a catalog item duplicated for every descendant.
- Heirloom status should not prevent loss or damage if gameplay systems allow those outcomes.
- Recovering a lost heirloom should require gameplay ownership later.
- Heirlooms should not directly grant a backstory identity.

## Backstory Unlock Relationship

This model gives Backstory Eligibility and Backstory Legacy purchase work the missing ownership layer.

Planning relationships:

- Family Prestige can support family-scoped backstory unlocks.
- Family tree/history can become evidence later.
- Bloodline upgrades can unlock family tendencies without stacking starter effects.
- Bequests should not unlock social/status origins by themselves.
- Heirlooms should not directly grant backstory identity.
- Minor Noble requires a real family/status/title owner later.
- Merchant Family should require family/trade evidence later.
- Garrison Ward should require family/source-run/martial evidence later.
- World-Stray remains special/manual or hidden.
- Local Champion remains regional/story/achievement scoped.

Do not change current backstory policy. The existing resolver should keep treating blocked owners as locked, hidden, deferred, or special until runtime-owned evidence exists.

## Recommended Revised Pipeline

This plan supersedes the immediate Backstory Legacy purchase runtime sequence from Version 0.5.59. Backstory Legacy purchase runtime should wait until family scope, prestige ledger shape, and bloodline economy boundaries are planned.

Recommended revised pipeline:

1. Version 0.5.61 - Family Records And Prestige Ledger Runtime Shape
2. Version 0.5.62 - Chronicles Bloodline Tree Presentation Plan
3. Version 0.5.63 - Backstory Legacy Purchase Runtime Shape
4. Version 0.5.64 - Backstory Legacy Purchase Content Draft
5. Version 0.5.65 - Backstory Legacy Purchase Resolver Integration
6. Version 0.5.66 - Heirloom And Bequest Systems Plan

Rationale:

- Family-scoped backstory unlocks need `familyId` and family history ownership.
- Family Prestige needs ledger shape before it can be a real currency.
- Bloodline upgrades need clear separation from bequests and heirlooms.
- The creator now consumes resolver output, so bad family-scoped evidence would immediately affect visible availability.
- Backstory purchase records should not be authored before their scope and storage owners are clear.

## Risks And Open Questions

- Family ids do not yet exist on run history records.
- Parent/child lineage links do not yet exist.
- Family prestige storage does not yet exist.
- Chronicle Marks and Lineage Seals do not yet exist.
- Heir slots do not yet exist.
- Heirloom item-instance persistence does not yet exist.
- Estate/title/status systems are still missing.
- Categories should remain sorting tags, not currency fragmentation.
- Bad family-scoped evidence could incorrectly unlock creator backstories because creator now consumes resolver output.
- Broad runtime implementation should not start until the runtime shape is narrow and tested.
- Typecheck remains affected by known workspace/pre-existing TypeScript issues.
