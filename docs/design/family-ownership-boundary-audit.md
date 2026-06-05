# Family Ownership Boundary Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future Family/Bloodlines/Prestige/Heirloom/Bequest work; no source, schema, content JSON, UI, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Map deferred family-adjacent systems and define ownership/evidence boundaries before any future runtime, save/account, UI, Legacy, Prestige, heir, heirloom, bequest, estate, or scoped Backstory evidence implementation.

This document is a planning audit. It does not authorize implementation.

## Current Deferred Family Pillar

Roadmap-deferred systems include:

- Family management
- heirs
- heirlooms
- bequests
- item-instance persistence
- estate transfer/claim execution
- Family Prestige earning/spending behavior
- Chronicle Marks
- Lineage Seals
- scoped Backstory evidence
- family/source-run/scoped Backstory Legacy evidence
- Bloodlines/family runtime behavior beyond read-only projection

Existing landed boundaries include:

- Family-scoped unlock ownership shape exists.
- Family unlock ownership is current-data only and defaults empty.
- Bloodlines pure projection and read-only account meta UI have landed.
- Heirloom and bequest vocabulary/ownership boundaries are planned in `docs/design/heirloom-and-bequest-systems-plan.md`.
- The creator does not infer or supply `familyId`.
- Backstory Legacy evidence remains account-scoped for current low-risk live records; scoped family/source-run evidence is deferred.

## Core Ownership Rule

Family identity must not be inferred from unrelated state.

Do not derive family ownership, family evidence, heir status, bloodline authority, estate rights, Legacy purchase rights, or Backstory eligibility from:

- selected character
- selected backstory
- lineage id
- source run id
- account id alone
- UI state
- Chronicle visibility
- reputation/renown
- title/estate vocabulary
- item possession
- catalog presence

Explicit owner ids and scoped evidence must exist before runtime behavior consumes them.

## Owner Vocabulary

Future family-adjacent systems should distinguish these owner scopes.

| Owner scope | Meaning | Current posture |
| --- | --- | --- |
| `account` | Player account/profile-wide owner. | Existing safe low-risk Backstory Legacy purchases use account-scoped ownership. |
| `family` | Explicit family entity or household/lineage owner. | Shape exists in planning/current-data defaults, but runtime behavior deferred. |
| `character` | Individual playable character. | Known spells are character-scoped; family state should not be derived from character alone. |
| `source_run` | Specific run/source event owner. | Deferred for Backstory Legacy/scoped evidence. |
| `lineage` | Named ancestry/bloodline concept. | Must not be treated as family id without explicit mapping. |
| `estate` | Property/title/claim owner. | Deferred; do not use estate as proof of family authority. |
| `institution` | Guild/temple/order/academy/noble court owner. | May provide future evidence/access; not family ownership by itself. |
| `item_instance` | Specific heirloom/relic/item instance. | Item-instance persistence deferred. |
| `chronicle_record` | Specific recorded historical/run event. | May reference evidence later; must not fabricate family history. |
| `legacy_record` | Catalog/unlock record. | Catalog presence is not ownership. |
| `custom` | Explicit special owner. | Should require notes and validation. |

## Family-Adjacent Concept Boundaries

| Concept | Should mean | Must not mean |
| --- | --- | --- |
| Family | Explicit persistent owner/group for lineage-adjacent state. | Account, character, selected lineage, or UI selection by default. |
| Bloodline | Ancestral trait/projection/lore layer. | Automatic family ownership, Backstory eligibility, or knowledge completion. |
| Heir | Explicit successor/relationship state. | Any character related by name, backstory, or UI grouping. |
| Heirloom | Specific item instance or family-bound relic. | Generic item catalog record or unlocked item definition. |
| Bequest | Explicit transfer/claim event or rule. | Automatic inventory transfer, estate claim, or inheritance by title alone. |
| Estate | Property/title/claim context. | Proof of family, heir, or item ownership without scoped evidence. |
| Family Prestige | Future earned/spent family-level currency or status. | Account points, renown, Chronicle visibility, or automatic reward. |
| Chronicle Mark | Future event/evidence marker. | Family ownership, permanent knowledge, or automatic reward. |
| Lineage Seal | Future scoped lineage/family token. | Generic entitlement or account-wide unlock unless explicitly scoped. |
| Scoped Backstory evidence | Explicit owner-bound evidence for eligibility. | Creator-supplied id, inferred `familyId`, or selected backstory alone. |

## Evidence Boundary

Future evidence records should answer:

- Who owns the evidence?
- What owner scope does it use?
- What exact system produced it?
- What target does it authorize?
- Is it account-wide, family-scoped, character-scoped, source-run-scoped, or item-instance-scoped?
- Is it persistent or current-run only?
- Can UI display it without granting behavior?
- Can it be revoked, superseded, inherited, claimed, or transferred?

Potential future evidence record fields:

- `evidenceId`
- `evidenceType`
- `ownerScope`
- `ownerId`
- `sourceSystem`
- `sourceRunId`
- `sourceCharacterId`
- `sourceChronicleRecordId`
- `targetSystem`
- `targetId`
- `createdAt`
- `persistencePolicy`
- `transferPolicy`
- `notes`

Do not implement this shape until a dedicated schema/runtime pass is scoped.

## Known High-Risk Inference Risks

Future passes should explicitly guard against:

- deriving `familyId` from `sourceRunId`
- deriving family from `lineageId`
- deriving family status from backstory selection
- deriving ownership from estate or title text
- deriving heirloom ownership from item catalog presence
- deriving bequest transfer from character death alone
- deriving Family Prestige from generic reputation/renown
- deriving Backstory eligibility from UI-provided ids
- deriving knowledge/Chronicle/family history from account visibility
- treating Bloodline projection as mutable family state

## Recommended Future Pass Order

Recommended connector/Codex sequence when this pillar becomes active:

1. `Family Ownership Source Map`
   - inspect current Family/Bloodlines/Legacy/Chronicle/account-meta files and summarize real owner shapes
   - docs-only
2. `Scoped Backstory Evidence Plan`
   - define owner/evidence boundary for family/source-run/scoped Backstory evidence
   - planning only
3. `Heirloom And Bequest Ownership Source Map`
   - inspect planned heirloom/bequest vocabulary and item/account/save boundaries
   - docs-only
4. `Family Prestige Currency Boundary Plan`
   - define earning/spending ownership and prevent overlap with Renown/Chronicle/account points
   - planning only
5. `Family Evidence Validation Helper Plan`
   - plan pure validation helpers before any mutation or UI behavior
6. `Family Read-Only Projection Helper`
   - pure helper only after owner/evidence fields are explicit
7. `Family Management UI Plan`
   - read-only/presentation first; no mutation until commands exist

## Forbidden Until Explicitly Scoped

Do not add or change:

- family runtime state
- save/account/session schema
- heir creation
- heirloom item-instance persistence
- bequest transfer execution
- estate claim execution
- Family Prestige earn/spend behavior
- Chronicle Marks or Lineage Seals runtime behavior
- scoped Backstory evidence mutation
- creator Backstory evidence fabrication
- Bloodlines mutable state
- UI command buttons
- generated output
- Legacy catalog behavior
- account purchase behavior
- knowledge completion from family/bloodline state

## Recommended Next Connector Work

The next useful connector-only pass for this pillar is:

- `Family Ownership Source Map`

Alternatively, if staying broad across pillars:

- `Chronicle-Renown Evidence Boundary Map`

## Recommended Future Codex Work

Do not schedule this pillar ahead of the active knowledge-domain sequence unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Family Ownership Source Map`

It should remain docs-only and should not alter account, save, Legacy, UI, or runtime behavior.
