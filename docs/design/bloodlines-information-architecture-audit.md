# Bloodlines Information Architecture Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Status: connector-only planning audit; no runtime/source/UI changes

## Purpose

This audit sharpens the future Bloodlines information architecture before `Version 0.5.67 - Bloodlines View Model Implementation Plan` and `Version 0.5.68 - Bloodlines Read-Only Account Meta UI`.

It converts the existing Bloodline presentation direction into a narrower, implementation-ready information hierarchy.

This document does not:

- implement UI
- edit React components
- add types
- change account/save schema
- create family records
- create family management actions
- add heir slots
- add bequests or heirlooms
- add Family Prestige earn/spend behavior
- add Backstory Eligibility evidence
- change creator availability
- change Legacy purchase behavior
- update generated UI output
- update `docs/dev/current-codex-output.md`

## Sources Inspected

- `docs/dev/project-roadmap.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/account-family.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`

## Current Repo Reality

The runtime/account shape is enough for a read-only projection, but not enough for management actions.

Current data available:

- `AccountRunHistoryRecord` has `characterId`, `name`, `lineageId`, optional `familyId`, optional `parentCharacterId`, starting geography ids, timestamps, outcome/archive fields, achievement ids, Echo peak, Legacy payout fields, optional `sourceRunId`, and save slot ids.
- `AccountFamilyRecord` has `familyId`, `familyName`, nullable `rootCharacterId`, `status`, timestamps, `memberCharacterIds`, and notes.
- `FamilyPrestigeTransactionState` has `transactionId`, `familyId`, `kind`, `amount`, `categoryTag`, source fields, timestamp, summary, and optional character/source-run/unlock ids.
- `AccountFamiliesState` has `families`, `prestigeTransactions`, and `familyUnlocks`.
- `account-family.ts` already exposes read-only prestige and unlock helpers including `resolveFamilyPrestigeTotals(...)`, `resolveFamilyPrestigeTotalsByFamily(...)`, `listFamilyUnlocks(...)`, and `resolveFamilyUnlocksByFamily(...)`.
- `accountMetaPresentation.ts` currently builds only `legacy` and `chronicles` view models.
- `AccountMetaPanel.tsx` currently exposes only `Legacy` and `Chronicles` section navigation.

Current gaps:

- no runtime flow creates or manages family records
- no UI consumes `profile.families`
- no Bloodlines view model exists
- no heir slots exist
- no family management actions exist
- no bequest or heirloom systems exist
- no Family Prestige spending behavior exists
- no family evidence is passed to Backstory Eligibility

## Recommended Placement

Keep Bloodlines inside the account meta / Chronicles surface for the first implementation.

Recommended near-term hierarchy:

```text
Account Meta
  Legacy
  Chronicles
    Run Records
    Estate Preview
    Bloodlines
      Family List
      Family Detail
        Overview
        Tree
        Prestige
        Notes
```

Do not make Bloodlines a top-level launcher or global account section until family management, heirs, bequests, heirlooms, or family upgrades are active enough to justify the extra surface.

Do not put Bloodlines inside character creation. The creator should continue consuming resolver-backed availability instead of directly browsing or applying family records.

## Navigation Recommendation

For `0.5.67`, keep this a presentation/view-model decision only.

For `0.5.68`, prefer one of these UI patterns:

### Preferred first UI pattern

Add a nested Chronicles sub-area for Bloodlines while keeping top-level `AccountMetaSectionId` unchanged as `"legacy" | "chronicles"`.

Why:

- least disruptive to current section navigation
- keeps Bloodlines as recordkeeping/history first
- avoids introducing a third top-level section before the surface has actions
- reduces risk of broad AccountMetaPanel rewrite

### Acceptable alternate UI pattern

Add a third top-level `bloodlines` account meta section only if the view-model pass proves nested Chronicles would become too crowded.

If this alternate is chosen, it still must be read-only and actionless.

## First View-Model Shape

Recommended `0.5.67` view-model additions should stay pure and read-only.

Suggested top-level shape:

```ts
type AccountMetaViewModel = {
  legacy: LegacyMetaViewModel;
  chronicles: ChroniclesMetaViewModel;
};

type ChroniclesMetaViewModel = {
  summaryStats: ChronicleSummaryStatViewModel[];
  filters: ChronicleFilterViewModel[];
  tiles: ChronicleTileViewModel[];
  estate: ChronicleEstateViewModel;
  bloodlines: BloodlinesMetaViewModel;
};
```

Suggested Bloodlines root:

```ts
type BloodlinesMetaViewModel = {
  summaryStats: BloodlinesSummaryStatViewModel[];
  familyFilters: BloodlinesFamilyFilterViewModel[];
  familyRows: BloodlinesFamilyRowViewModel[];
  selectedFamily: BloodlinesFamilyDetailViewModel | null;
  emptyLabel: string | null;
  noteLabel: string;
};
```

Important: this is guidance for a future implementation pass. Do not add these types in this audit.

## Family List IA

The first Bloodlines screen should answer:

- Which families currently exist?
- Which are active, dormant, or closed?
- Which family has members?
- Which family has ledger-derived Family Prestige?
- Which family can be inspected safely?

Recommended family row fields:

| Field | Source | Display rule |
| --- | --- | --- |
| Family name | `family.familyName` | Use conservative fallback only if missing/invalid. |
| Status | `family.status` | Display `Active`, `Dormant`, or `Closed`; no action buttons. |
| Members | `family.memberCharacterIds` plus linked run records | Count current data only. |
| Root | `family.rootCharacterId` linked to run history | Show `Unrecorded root` if missing or unresolved. |
| Prestige | `resolveFamilyPrestigeTotals(...)` | Show available and lifetime earned. |
| Last updated | `family.updatedAt` | Use for stable sorting. |
| Notes cue | `family.notes.length` | Optional small count/cue only. |

Recommended summary stats:

- Families
- Active
- Dormant
- Closed
- With Prestige
- Linked Members

Recommended filters:

- All
- Active
- Dormant
- Closed
- Has Prestige

Default sort:

1. active
2. dormant
3. closed
4. has prestige
5. newest `updatedAt`
6. `familyName`

## Family Detail IA

The detail view should answer:

- What is this family?
- Who is recorded as root?
- Which members are known?
- What is the family prestige ledger summary?
- What is unimplemented and therefore not actionable?

Recommended detail sections:

### 1. Overview

Fields:

- family name
- status
- root label
- member count
- last updated
- notes

Forbidden:

- rename button
- status change button
- close/reopen family action
- create heir action

### 2. Tree

Display a derived outline tree from current records.

Rules:

- Use `family.rootCharacterId` as the root only when a matching run record exists.
- Use `parentCharacterId` for parent/child edges.
- Put records with matching `familyId` but no known parent into an `Unlinked Members` group.
- Treat `sourceRunId` as a continuity hint only, not as a parent or family owner.
- Do not infer membership from `lineageId`, name, account id, save slot, Legacy unlock, or source-run alone.
- Missing root should produce an honest `Unrecorded root` note.
- Missing member run records should either be omitted or shown as unresolved ids in developer-safe copy, whichever the implementation chooses and tests.

Recommended node labels:

- character name
- status tag
- lineage label
- origin/geography label
- Echo peak
- duration if available
- prestige earned if available
- short deed labels if available
- non-authoritative/deleted note when relevant

### 3. Prestige

Use `resolveFamilyPrestigeTotals(...)` or `resolveFamilyPrestigeTotalsByFamily(...)`, not React-side ad hoc math.

Display:

- available Family Prestige
- lifetime earned
- lifetime spent
- category totals
- recent transaction summaries if implemented in view model

Copy rule:

- Use `Family Prestige`, not generic `Prestige`, whenever scoped to a family.
- Category totals are presentation grouping, not separate balances.

Forbidden:

- spend button
- refund button
- convert to Chronicle Marks button
- purchase family upgrade button
- backstory unlock claim

### 4. Notes

Show `family.notes` only as existing record notes.

Forbidden:

- editable notes
- generated family lore that is not present in current data

## Deferred Panels

Do not render these as active panels in the first read-only UI:

- Heirs
- Upgrades
- Bequests
- Heirlooms
- Backstory Support
- Chronicle Marks
- Lineage Seals

Safe option:

- omit them entirely in `0.5.68`

Acceptable if the user wants visible placeholders later:

- use conservative inactive panels, visually non-clickable, with copy such as:
  - `Heir systems are not active yet.`
  - `Bequests are not active yet.`
  - `Heirlooms are not active yet.`

Forbidden copy:

- `Create heir`
- `Transfer assets`
- `Register heirloom`
- `Spend Family Prestige`
- `Unlock backstory`
- `Claim noble line`

## Empty States

If `profile.families.families` is empty:

```text
No Bloodline records yet.
```

Optional supporting copy:

```text
Family records will appear here once a current-data system records a family line.
```

Avoid implying:

- the player can create a family now
- heirs are active now
- family management exists now
- family prestige can be spent now
- backstories can be unlocked from this surface now

## Implementation Boundary For `0.5.67`

Recommended scope for `Version 0.5.67 - Bloodlines View Model Implementation Plan`:

- Add or plan pure view-model projection only.
- Read from `profile.families` and `profile.history.runRecords`.
- Use engine helpers for Family Prestige totals.
- Derive family rows, summary stats, filters, selected family detail, tree nodes, unlinked members, and empty states.
- Add focused view-model tests if implementation proceeds beyond planning.
- Do not edit React components unless the version is explicitly re-scoped from plan to implementation.
- Do not pass any family evidence to Backstory Eligibility.
- Do not add purchase, spend, family management, heir, bequest, heirloom, Chronicle Mark, or Lineage Seal behavior.

Recommended test coverage if implemented:

- empty Bloodlines state
- family summary counts
- family status filtering/sorting
- linked member projection
- missing root label
- root/child tree derivation through `parentCharacterId`
- unlinked member group
- deleted/non-authoritative run note preservation
- Family Prestige totals from helper
- category totals projection
- no automatic family creation from `lineageId`
- no Backstory Eligibility call
- no Legacy purchase mutation

## Implementation Boundary For `0.5.68`

Recommended scope for `Version 0.5.68 - Bloodlines Read-Only Account Meta UI`:

- Render the `bloodlines` view model.
- Prefer nested Chronicles sub-area unless the view-model plan proves top-level is cleaner.
- Keep UI list-first and compact.
- Use disclosure rows for tree branches.
- Keep actions absent.
- Preserve keyboard-accessible controls.
- Keep inactive future systems non-clickable or omitted.
- Avoid canvas/SVG genealogy layouts for the first pass.

Forbidden:

- family creation
- family rename
- family status mutation
- heir generation
- heir-slot management
- bequest transfer
- heirloom registration
- Family Prestige spending
- Chronicle Mark / Lineage Seal conversion
- Backstory unlock evidence generation
- resolver bypass
- generated UI output changes unless explicitly requested

## Recommended Copy

Section heading:

```text
Bloodlines
```

Section note:

```text
Family records and prestige are shown from current account history. This view is read-only.
```

Empty state:

```text
No Bloodline records yet.
```

Missing root:

```text
Unrecorded root
```

Unlinked group:

```text
Unlinked members
```

Prestige note:

```text
Family Prestige is ledger-derived and cannot be spent from this view yet.
```

Deferred-system note, if placeholders are used:

```text
Heirs, bequests, and heirlooms are future systems and are not active yet.
```

## Risks

- Bloodlines will often be empty until a runtime owner creates family records.
- Showing an empty Bloodlines section too prominently could confuse players if the game has no family creation path yet.
- Account meta is already dense; nesting under Chronicles is safer than a broad top-level redesign.
- Family tree data can be partial; the UI must not repair missing links by guessing.
- Family Prestige totals exist, but spending does not; copy must avoid implying an economy exists.
- Backstory availability is resolver-backed, so family display must not become backstory evidence.

## Open Questions For User

These do not block a read-only first pass, but they should be answered before family-management or heir work:

1. Should Bloodlines eventually become a top-level account section once heirs/family management are active, or stay nested under Chronicles permanently?
2. Should a first character automatically create a family record, or should family creation wait for an explicit heir/family system?
3. Should extinct/closed families remain visible forever, or only when they have Chronicle-worthy records?
4. Should unlinked family members be visible to players, or hidden behind a developer/test warning until the relationship owner is stronger?
5. Should future Bloodlines UI show deferred placeholders for heirs/bequests/heirlooms, or omit those panels until they become active?

## Recommended Next Prompt Target

Do not run this before `0.5.64` and `0.5.65` unless the active pipeline changes.

When ready:

```text
Version 0.5.67 - Bloodlines View Model Implementation Plan

Use docs/design/bloodlines-information-architecture-audit.md as the IA source.
Implement or plan a pure read-only Bloodlines view-model projection from current account family and run-history data.
Keep the pass view-model first.
Do not add React UI unless explicitly scoped.
Do not add family creation, family management, heir systems, bequests, heirlooms, Family Prestige spending, Backstory Eligibility evidence, Legacy purchase behavior, or generated UI output.
```
