# Chronicles Bloodline Tree Presentation Plan

Source version/run: Version 0.5.62 - Chronicles Bloodline Tree Presentation Plan
Date: 2026-05-19
Status: planning-only design document

## Purpose

This document plans the future Chronicles/Bloodlines family tree presentation now that the runtime-owned account family shape exists. It describes where Bloodlines should live, how family records and run history should be projected into a readable tree, and which family prestige, heir, upgrade, bequest, heirloom, and backstory-support concepts should stay hidden or conservative until their runtime owners exist.

This document does not:

- implement UI
- edit React components
- create family records automatically
- add family management actions
- add heir systems or heir slots
- add family prestige earning or spending behavior
- add heirlooms or bequests
- add Chronicle Mark earning or conversion
- add Lineage Seal earning or spending
- add Backstory Legacy purchase records
- add family evidence to Backstory Eligibility
- change save/account schemas
- change creator availability or visible backstory availability
- change Legacy purchase behavior
- change content JSON, policy metadata JSON, generated UI output, or live content records
- plan backwards compatibility, old-save preservation, old-account preservation, id aliases, retired-id handling, converted-id handling, historical id preservation, migration-only behavior, old selected backstory preservation, or old-data rescue behavior

Current account/profile/save shapes should validate directly.

## Current Branch Reality

The current implemented foundation is:

- `AccountProfileState` has `families`.
- `AccountFamiliesState` has `families` and `prestigeTransactions`.
- `AccountFamilyRecord` has `familyId`, `familyName`, `rootCharacterId`, `status`, `createdAt`, `updatedAt`, `memberCharacterIds`, and `notes`.
- `FamilyPrestigeTransactionState` has `transactionId`, `familyId`, `kind`, `amount`, `categoryTag`, source fields, timestamp, summary, and optional character/source-run/unlock ids.
- `AccountRunHistoryRecord` may have optional `familyId` and `parentCharacterId`.
- `account-family.ts` exposes empty family state creation and passive family prestige total helpers.
- Account profile storage validation understands the current family state.
- No UI consumes `profile.families`.
- No runtime flow creates or manages family records.
- No heir slots, family upgrades, bequests, heirlooms, Chronicle Marks, Lineage Seals, or family-scoped backstory evidence exist.
- `accountMetaPresentation.ts` currently builds a `legacy` view model and a `chronicles` view model from account Legacy, run history, and estate previews.
- `AccountMetaPanel.tsx` currently exposes section navigation for `Legacy` and `Chronicles` only.
- `CharacterCreationNarrativeScreen.tsx` has an heir-source selection surface, but Bloodlines should not be presented as a character creator build screen.

## Presentation Location

Bloodlines should be accessible from the account meta-progression and recordkeeping surface, not from the character creator.

Preferred placement:

```text
Chronicles
  Bloodlines
    Family List
      Family Detail
        Tree
        Heirs
        Prestige
        Upgrades
        Bequests
        Heirlooms
```

Rationale:

- Chronicles already owns account history, run records, lineage cues, and estate previews.
- Bloodlines are historical/account records first, not current character build choices.
- Creator should continue to consume resolver-backed availability rather than directly browsing family history.
- Legacy purchasing can remain in the `Legacy` section while Bloodlines presents family history and scoped family state.

## Navigation Model

The future account meta surface can keep top-level `Legacy` and `Chronicles` navigation while adding Bloodlines inside Chronicles as a sub-area.

Planned Chronicles sub-areas:

| Sub-area | Purpose | Near-term source |
| --- | --- | --- |
| Run Records | Current Chronicle tiles and filters. | `profile.history.runRecords` |
| Estate Preview | Current claim preview and stored estate assets. | `profile.estate` |
| Bloodlines | Family list, family detail, derived tree, and family prestige summaries. | `profile.families` plus linked `runRecords` |

Do not make Bloodlines a global launcher category until there is enough family behavior to justify the extra top-level surface.

## Family Visibility Rules

The Bloodlines section should show a family only when current data proves the line exists.

Visible families:

- family records present in `profile.families.families`
- later, families with active characters after an explicit family creation owner exists
- later, families with heir slots after heir systems exist

Do not show:

- empty placeholder families
- families inferred only from a loose lineage id
- families created from account-wide Legacy points
- noble/title/status families without an owning family/status system
- old or unvalidated ids through compatibility rescue behavior

If `profile.families.families` is empty, show an empty-state direction such as:

```text
No Bloodline records yet.
```

Avoid implying that heir slots, family management, or bequests are currently active.

## Family List Projection

Future family list rows should be compact and scan-friendly.

Recommended fields:

| Field | Source | Notes |
| --- | --- | --- |
| Family name | `family.familyName` | Fallback to a conservative id label only if needed. |
| Status | `family.status` | `active`, `dormant`, or `closed`; do not add lifecycle actions yet. |
| Members | `family.memberCharacterIds.length` plus linked run records | Count only current data. |
| Root | `family.rootCharacterId` linked to run history when available | If missing, show `Unrecorded root`. |
| Prestige | `resolveFamilyPrestigeTotals(profile.families, family.familyId)` | Display available and lifetime earned. |
| Category cues | prestige category totals | Keep as tags or small bars, not separate currencies. |
| Last updated | `family.updatedAt` | Stable sort tie-breaker. |

Suggested default order:

1. active families
2. dormant families
3. closed families
4. newest `updatedAt`
5. `familyName`

## Family Detail Projection

Family detail should present a single selected family without implying unsupported management.

Recommended detail sections:

| Section | Near-term behavior | Deferred behavior |
| --- | --- | --- |
| Overview | Show name, status, root, member count, notes, and last updated. | Rename/status/edit actions only after family management exists. |
| Tree | Derived from family record plus linked run records. | Branch, cadet, adoption, marriage, and legitimacy metadata later. |
| Prestige | Show available/earned/spent totals and category totals. | Spending actions only after family prestige spend owners exist. |
| Heirs | Omit or conservative inactive panel. | Heir slots, heir candidates, heir comparison, and heir creation later. |
| Upgrades | Omit or conservative inactive panel. | Bloodline upgrades and preparations later. |
| Bequests | Omit or conservative inactive panel. | Estate/material transfer actions later. |
| Heirlooms | Omit or conservative inactive panel. | Registered item-chain presentation later. |
| Backstory Support | Omit. | Resolver-owned family evidence summaries later. |

Do not show purchase buttons, management actions, unlock prompts, or backstory evidence claims until their runtime owners exist.

## Tree Derivation Model

Family trees should be derived hierarchical presentation over flat current records.

Inputs:

- `AccountFamilyRecord`
- `AccountRunHistoryRecord[]` filtered by `record.familyId === family.familyId`
- `family.rootCharacterId`
- `record.parentCharacterId`
- `record.sourceRunId` only as an auxiliary continuity hint, not as the primary tree parent when `parentCharacterId` exists

Near-term derivation rules:

- Start with the family root when `rootCharacterId` matches a current run record.
- Treat records with `parentCharacterId` as children of that character id.
- Treat records without a known parent as root-level or unlinked members inside the family.
- Keep deleted run records visibly non-authoritative if shown, consistent with current Chronicle tile behavior.
- Do not infer family membership from lineage id alone.
- Do not infer parent/child relationships from name, source-run string, account id, or Legacy unlocks.
- Do not create hidden children, spouses, adoptees, or claims without current data fields.

If a family has no linked run records, show the family overview and an empty tree note rather than fabricating nodes.

## Tree Node View Model Draft

Future implementation can project family nodes with a view model similar to:

```ts
type BloodlineTreeNodeViewModel = {
  characterId: string;
  familyId: string;
  parentCharacterId: string | null;
  displayName: string;
  statusLabel: string;
  lineageLabel: string;
  originLabel: string;
  echoPeakLabel: string;
  prestigeEarnedLabel: string | null;
  durationLabel: string | null;
  deedLabels: string[];
  authorityNoteLabel: string | null;
  children: BloodlineTreeNodeViewModel[];
};
```

This is planning only. Do not add this type until implementation.

## Tree Visual Direction

Use an outline/file-system style tree first.

Reasons:

- It fits the existing dense account-meta presentation better than a decorative family diagram.
- It can handle missing parent links and unlinked members cleanly.
- It is accessible with ordinary lists, disclosure controls, and keyboard navigation.
- It avoids needing canvas/SVG layout work before the underlying family data is mature.

Suggested visual hierarchy:

```text
Voss Line
  Arden Voss · Root · Retired · Echo 4
    Mira Voss · Active · Echo 2
    Teren Voss · Archived · Echo 1
  Unlinked Members
    Sela Voss · Dormant record
```

Avoid oversized decorative genealogy layouts until family data includes enough relationship detail to justify them.

## Prestige Presentation

Family Prestige should be presented as a ledger-derived family resource, not as account Prestige.

Family detail should show:

- available Family Prestige
- lifetime earned
- lifetime spent
- category totals for `renown`, `martial`, `production`, `commerce`, `lore_faith`, `survival_utility`, `household_lineage`, and `preparation`
- recent transactions

Copy direction:

- Use `Family Prestige`, not generic `Prestige`, when the number is family-scoped.
- Use category tags as presentation grouping, not separate currency balances.
- Do not show spend buttons until spending behavior exists.
- Do not imply Family Prestige can unlock backstories until resolver evidence integration is implemented.

## Heirs, Bequests, And Heirlooms

These panels are future-only.

Near-term UI should either omit them or show conservative inactive panels only if a dedicated design explicitly scopes placeholder presentation.

Safe inactive copy direction:

- `Heir systems are not active yet.`
- `Bequests are not active yet.`
- `Heirlooms are not active yet.`

Avoid unsafe copy:

- claims that an heir slot can be created now
- promises that assets can be transferred now
- promises that an item can be registered or inherited now
- claims that family prestige can buy heir, bequest, or heirloom behavior now

## Backstory Eligibility Boundary

Bloodlines presentation must not become a backstory unlock source by itself.

Rules:

- Family records may eventually become resolver evidence only through an approved evidence owner.
- Family Prestige totals may eventually support family-scoped backstory purchases only after the purchase shape is approved.
- Family tree display must not unlock `Merchant Family`, `Garrison Ward`, `Minor Noble`, `Local Champion`, or other scoped origins by presence alone.
- Bequests and heirlooms should not directly grant backstory identity.
- Creator availability must continue to flow through the Backstory Eligibility resolver, not from UI-selected family records.

## Data Validation And Current-Data Behavior

Current-data rules:

- If `profile.families.families` is empty, Bloodlines is empty.
- If a family references a missing root character, show the family but mark the root as unrecorded.
- If a member id has no run history record, show it only as an unresolved member id or omit it until implementation decides the safest projection.
- If a run record has a `familyId` that does not correspond to a family record, do not create a family in presentation.
- If a `parentCharacterId` points outside the selected family, treat the node as unlinked and surface a developer/test warning only in implementation.
- If prestige transactions reference missing families, validation should already reject them.

Do not add compatibility fallbacks for old shapes or old ids.

## Sorting And Filters

Recommended family filters:

- All
- Active
- Dormant
- Closed
- Has Prestige

Recommended detail filters:

- Tree
- Prestige
- Notes
- Deferred systems, only after those systems are scoped

Sorting should be stable and should not depend on volatile warning counts or hidden evidence state.

## Account Meta Integration Boundary

Future implementation should likely add Bloodlines in the account meta presentation layer first:

- Extend the account meta view model with `chronicles.bloodlines` or a sibling `bloodlines` object.
- Keep the first projection pure and read-only.
- Use `resolveFamilyPrestigeTotalsByFamily` from the engine helper rather than recalculating totals in React.
- Keep React components focused on rendering the view model.
- Do not call Backstory Eligibility, Legacy purchase mutation, or family management actions from the first Bloodlines presentation pass.

The current `AccountMetaSectionId` is `"legacy" | "chronicles"`. A future UI pass should decide whether Bloodlines is a nested Chronicles tab or a third account meta section after a view-model plan exists.

## Responsive And Accessibility Direction

Future Bloodlines UI should be compact, list-first, and keyboard navigable.

Guidance:

- Use tabs or segmented controls for sub-areas.
- Use disclosure rows for tree branches.
- Preserve readable line height and stable indentation.
- Do not use a canvas-only tree as the primary representation.
- Ensure root/member/status/prestige labels remain readable on mobile.
- Use buttons only for actual actions; inactive future systems should not look clickable.

## Future Test Plan

When implementation begins, add focused tests for:

- family list projection from `profile.families`
- empty Bloodlines state
- family status sorting
- family detail root and member resolution
- parent/child tree derivation from `parentCharacterId`
- unlinked member handling
- family prestige total projection
- category total projection
- no automatic family creation from lineage ids
- no creator/backstory availability changes
- no family evidence passed to Backstory Eligibility
- no Legacy purchase or family prestige spend behavior
- no generated UI output changes

Do not add tests in this planning-only pass.

## Recommended Implementation Sequence

Recommended next pipeline:

1. Version 0.5.63 - Backstory Legacy Purchase Runtime Shape
2. Version 0.5.64 - Backstory Legacy Purchase Content Draft
3. Version 0.5.65 - Backstory Legacy Purchase Resolver Integration
4. Version 0.5.66 - Heirloom And Bequest Systems Plan
5. Version 0.5.67 - Bloodlines View Model Implementation Plan
6. Version 0.5.68 - Bloodlines Read-Only Account Meta UI

The Bloodlines UI implementation should wait for a narrow view-model pass. Backstory Legacy purchase work can proceed next only if it uses the family scope and prestige ledger boundaries from v0.5.60 and v0.5.61 without adding unsupported family evidence.

## Risks And Open Questions

- No runtime flow creates family records yet.
- Family tree presentation will be empty until authored/current-data family records exist.
- `memberCharacterIds`, `familyId`, and `parentCharacterId` need an owning creation/update path before the tree is useful.
- Family Prestige has ledger totals but no grant/spend owner.
- Heir slots, heir generation, bequests, heirlooms, Chronicle Marks, and Lineage Seals remain unimplemented.
- Account meta UI is already dense; Bloodlines should avoid a broad rewrite.
- Bad family evidence could visibly unlock backstories later because creator availability is resolver-backed.
- Typecheck remains affected by known workspace TypeScript issues outside this planning pass.
