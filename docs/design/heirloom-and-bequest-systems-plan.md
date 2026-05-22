# Heirloom And Bequest Systems Plan

Source version/run: Version 0.5.70 - Heirloom And Bequest Systems Plan
Date: 2026-05-21
Status: active planning guardrail for future heirloom/bequest runtime readiness

0.5.73 cleanup note: keep this document as the active heirloom/bequest planning artifact. The 0.5.71/0.5.72 Bloodlines projection and read-only UI only display heirlooms and bequests as inactive future-system notes; no heirloom, bequest, item-instance, estate-transfer, Family Prestige spending, or heir behavior has been implemented.

## 1. Purpose And Scope

This document plans future Heirloom and Bequest systems for Lineage: Reforged. It is planning-only.

This pass does not implement runtime behavior, source changes, schemas, UI, tests, content JSON, generated output, save migration, item-instance persistence, Family Prestige spending, Chronicle Marks, Lineage Seals, Backstory Eligibility evidence, heir systems, family management, or estate transfer behavior.

Heirlooms and bequests need a strict split before Bloodlines UI and inheritance behavior expand because they answer different ownership questions:

- Bloodline upgrades describe inherited tendency or potential.
- Bequests describe intentional material, estate, legal, household, or claim-based transfers.
- Heirlooms describe one persistent item instance with a chain of holders.
- Estate assets store or preview material/property/legal assets.
- Family Prestige may later fund family-scoped actions but is not proof that a transfer, item, estate, or effect exists.

Without this split, future Bloodlines UI could accidentally imply that family prestige creates items, bequests grant genetic traits, heirlooms duplicate generic starter gear, or estate claims fabricate title/status history.

## 2. Current Repo Reality

Confirmed current implementation:

- `AccountProfileState` includes `legacy`, `achievements`, `history`, `families`, and `estate`.
- `AccountRunHistoryRecord` includes optional `familyId`, optional `parentCharacterId`, and optional `sourceRunId`.
- `AccountFamiliesState` includes `families`, `prestigeTransactions`, and `familyUnlocks`.
- `AccountFamilyRecord` has `familyId`, `familyName`, nullable `rootCharacterId`, `status`, timestamps, `memberCharacterIds`, and `notes`.
- `FamilyPrestigeTransactionState` has ledger-like grant/spend records with `familyId`, `kind`, `amount`, `categoryTag`, source fields, timestamp, summary, and optional character/source-run/unlock ids.
- `AccountFamilyUnlockState` stores family-scoped unlock ownership with `unlockId`, `familyId`, `unlockedAt`, `sourceTransactionId`, and optional rank.
- `account-family.ts` exposes default empty family state, Family Prestige total helpers, and family unlock lookup helpers.
- `legacy-account.ts` creates default account profiles with empty family and estate state.
- `AccountEstateState` stores estate deposits and estate assets.
- `AccountEstateAssetRecord` supports `currency`, `item`, and `operational` assets with source run, quantity, optional item/catalog refs, optional operational refs, location, and status summaries.
- `account-estate.ts` can deposit safe archived-run assets into the estate and resolve claim previews.
- `accountMetaPresentation.ts` presents estate summaries and claim previews inside Chronicles, but the note remains preview-only: assets stay stored until a later delivery seam moves them.
- Backstory Legacy account-scoped purchase evidence is live for the five low-risk records and remains resolver-owned.

Confirmed current gaps:

- No runtime flow creates or manages family records broadly.
- No Bloodlines UI consumes `profile.families`.
- No heir system, heir slots, heir candidates, family management UI, or family lifecycle mutation is implemented.
- Family Prestige earning and spending behavior is not implemented beyond stored transactions/totals and passive family unlock references.
- No bequest runtime exists.
- No bequest claim/delivery lifecycle exists.
- No estate transfer behavior exists beyond archived-run deposit and preview-only claim summaries.
- No heirloom runtime exists.
- No `heirloomId` model exists.
- No account/family heirloom storage exists.
- No item-instance persistence for heirlooms is confirmed. The repo contains `instanceId` for settlement building instances, but no current player item-instance ownership chain suitable for heirlooms was found.
- No Chronicle Mark runtime exists.
- No Lineage Seal runtime exists.
- No Backstory Eligibility evidence currently comes from bequests, heirlooms, Bloodline upgrades, estate assets, Chronicle Marks, or Lineage Seals.

Uncertainty:

- Current estate item assets store `itemId`, optional `itemKey`, and quantities. That supports stored item-stack or asset previews, not unique persistent item identity.
- Current operational estate assets can record business/workshop/property/holding-like references, but no claim execution or legal/title ownership system is confirmed.

## 3. Vocabulary / Concept Boundaries

Glossary:

| Concept | Meaning | Must not mean |
| --- | --- | --- |
| Bloodline upgrade | Inherited tendency, aptitude, temperament, growth, resistance, prestige affinity, or family potential. | Material transfer, item transfer, estate claim, title/status ownership, or backstory identity. |
| Bequest | Intentional material, estate, legal, household, or claim-based transfer. | Genetic trait, stat tendency, unique item-chain identity, or backstory identity. |
| Heirloom | One specific persistent item instance with an ownership chain. | Generic starter gear, copied catalog item, ordinary asset bundle, or item immunity. |
| Estate asset | Stored material, property, operational, document, currency, item-stack, or claim asset. | Bloodline tendency, family aptitude, or proof of social legitimacy. |
| Family Prestige | Family-ledger resource that may later fund family-scoped actions. | Account Prestige, proof of a transfer, proof of an item, or proof of an estate effect. |
| Chronicle Mark | Account-wide milestone/progression mark. | Family-specific history for unrelated families. |
| Lineage Seal | Rare capstone or branch-closure benchmark. | Farmable generic currency. |
| Backstory support | Resolver-owned access support for formative origins. | Current identity, job, social status, item ownership, estate ownership, or UI bypass. |

Boundary table:

| If the design needs... | Use... | Boundary |
| --- | --- | --- |
| Descendants to be more likely to grow, resist, learn, or trend a certain way | Bloodline upgrade | Family scoped by default; no material goods. |
| A character or estate to leave coin, supplies, documents, property, or a claim | Bequest | Requires source owner and claimant rules; no genetic traits. |
| A named object to retain history across holders | Heirloom | Requires one item instance and a valid holder chain. |
| Stored or previewed property/material value | Estate asset | Can store or preview assets; does not prove delivery. |
| Family-scoped spending capacity | Family Prestige | Ledger-derived; spend must reference exact supported thing later. |
| Account-wide milestone support | Chronicle Mark | May help broadly, but must not fabricate family-specific evidence. |
| Rare structural benchmark or branch closure reward | Lineage Seal | Capstone only; not a normal spend pool. |
| Formative-origin availability | Backstory support | Must flow through Backstory Eligibility resolver evidence. |

## 4. Ownership Matrix

| Concept | Data owner | Required ids | Evidence source | Storage owner | UI owner | Validation owner | Failure state when owner is missing | Must not be inferred |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bloodline upgrade | Future Bloodlines/family upgrade owner | `familyId`, upgrade id, source transaction/evidence id | Family record, eligible family member/run, future upgrade definition | `AccountFamiliesState` or future Bloodlines state | Future Bloodlines read-only view first | Shared contracts plus family upgrade helper tests | Hidden/locked/deferred; no effect | `familyId` from `lineageId`, account id, source run, character name, or selected backstory |
| Bequest | Future estate/bequest owner | bequest id, source character/run id, source estate id, recipient/claimant id/rule, optional `familyId` | Estate deposit, will/retirement/death action, family owner, claimant rule | Future bequest state plus `AccountEstateState` asset refs | Future Bloodlines/Chronicles estate view | Estate/bequest validators and claim helper tests | Unclaimable/deferred preview; no transfer | Recipient from UI selection alone; claim from sourceRunId alone; title/status from asset label |
| Heirloom | Future heirloom item-chain owner | `heirloomId`, `itemInstanceId`, `familyId`, original holder id, current holder id or state | Registered item instance plus family eligibility | Future family heirloom state plus item-instance owner | Future Bloodlines/Chronicles heirloom read-only view | Heirloom validators and transfer helper tests | Unavailable/lost/broken/destroyed/deferred; no duplicate item | Item instance from catalog item id; holder from lineage id; legitimacy from ownership alone |
| Estate asset | Current/future estate owner | `estateAssetId`, `sourceRunId`, source character id, asset refs, quantity/location/state | Archived run deposit and future estate actions | `AccountEstateState` | Current Chronicles estate summary; future estate/bequest detail | Account profile storage and estate helper validation | Stored/locked/preview-only; no delivery | Ownership/title/status from `displayName`; claimant from account-wide history alone |
| Family Prestige | Family prestige ledger owner | `transactionId`, `familyId`, source fields, optional unlock id | Family prestige transaction ledger | `AccountFamiliesState.prestigeTransactions` | Future Bloodlines prestige summary | Family helper and account storage validation | Zero/insufficient/deferred; no spend | Account-wide prestige; proof of asset/item/effect |
| Chronicle Mark | Future Chronicle milestone owner | mark id, source milestone/run/family conversion id | Account-wide Chronicle milestone or explicit conversion | Future Chronicle state | Future Chronicles view | Chronicle mark validators | Missing/locked/deferred; no account effect | Family-specific history for unrelated families |
| Lineage Seal | Future capstone/branch owner | seal id, source branch/family/milestone id | Rare branch closure, capstone, or benchmark event | Future Chronicle/Bloodline capstone state | Future Chronicles/Bloodlines capstone view | Seal/capstone validators | Missing/locked/deferred; no capstone effect | Farmable currency, ordinary prestige, or proof of family legitimacy |
| Backstory support | Backstory Eligibility resolver and scoped evidence owners | backstory id, evidence ids, optional exact `familyId` or scoped owner id | Approved resolver evidence, Backstory Legacy helper, future scoped evidence helpers | Resolver input from owned source systems | Character creator consumes resolver output only | Backstory policy/resolver tests | Locked/hidden/deferred/special | Backstory access from bequest label, heirloom label, Bloodline upgrade, estate asset, family display, or UI state |

Heirloom holder states should include at least `held`, `stored`, `lost`, `stolen`, `confiscated`, `broken`, and `destroyed`.

Bequest recipient/claimant rules must be explicit. Valid future claimant sources may include a selected heir, an eligible family member, an estate claimant, a named character, or a Chronicle-converted account claim only if the conversion owner exists.

## 5. Bequest Planning

Future bequest lifecycle:

1. Source owner exists: a character, family, estate, run record, will, retirement/death record, or legal owner defines what may be transferred.
2. Bequest is prepared or recorded: the system records the asset bundle, source, recipient rule, and claim prerequisites.
3. Recipient/claimant is resolved: a future heir, family member, named character, estate claimant, or account-level Chronicle claimant is checked against explicit rules.
4. Delivery or claim state is evaluated: available, claimable, locked, deferred, expired, disputed, exhausted, partially claimed, or delivered.
5. Transfer executes only after the owning runtime exists: currency, item stacks, documents, property claims, or operational assets move through estate/inventory/property systems.
6. History is recorded: source, claimant, amount/assets, result, and any costs are logged.

Possible bequest types:

- coin or currency provision
- ordinary safe item-stack provision
- supplies or household stores
- tool bundle
- workshop stake
- business/property/holding claim
- legal writ or household document
- location-scoped estate claim
- future introduction/contact only after contact systems exist
- future institution or title claim only after those owner systems exist

Source owner:

- A bequest needs a source run/character, estate deposit, family record, will/retirement/death action, or future legal owner.
- `sourceRunId` can point toward source history, but it must not be the only proof of claim eligibility.

Recipient/claimant rules:

- Recipient must be explicit or derived by an approved owner.
- Family/heir bequests require `familyId` and an eligible claimant.
- Account-level bequests require a Chronicle conversion owner if they are meant to support unrelated future characters.
- Wrong-family, missing-family, missing-estate, deleted-source, exhausted, or unsupported claims must fail closed.

Delivery/claim states:

- `stored`
- `preview_only`
- `claimable`
- `locked`
- `disputed`
- `partially_claimed`
- `delivered`
- `expired`
- `exhausted`
- `deferred`

Estate/material/legal boundaries:

- Currency and item-stack bequests must move through account estate or inventory owners.
- Operational/property bequests must respect location and ownership constraints.
- Legal/title/institution claims must remain inert until their owner systems exist.
- Delivery should not bypass economy or inventory limits once those systems own the transfer.

Bequests must never imply:

- genetic traits
- stat tendencies
- inherited aptitude
- backstory identity by themselves
- noble/title/status ownership without owner systems
- institution membership without owner systems
- contacts without contact systems
- duplicated heirloom item chains
- automatic family legitimacy
- current employment or social identity

## 6. Heirloom Planning

Future heirloom lifecycle:

1. Registration: a specific existing item instance is registered as a family heirloom with `heirloomId`, `familyId`, `itemInstanceId`, original holder, display name, and registration source.
2. Current holder: the heirloom records one current holder, stored location, or unavailable state.
3. Eligible next holder: eligibility is resolved from future heir/family rules, not lineage id or UI choice alone.
4. Transfer: the item instance moves to one eligible holder and records a transfer event.
5. Storage: the item can be stored in an estate, family vault, active inventory, or other future owner.
6. Loss: the item can become lost and unavailable.
7. Theft/confiscation: the item can be removed by world systems and require recovery.
8. Breakage: the item can be damaged or broken and may be unavailable until repaired.
9. Destruction: the item can become permanently destroyed unless a rare recovery/reforging rule exists.
10. Repair/reforging/recovery: future systems may restore, alter, or recover an heirloom, but must record continuity honestly.
11. Display/read-only presentation: Bloodlines/Chronicles can show the item chain before transfer actions exist.
12. Transfer cost concept: transfer or registration may later cost Family Prestige, materials, legal fees, or location access.

Heirloom state model should distinguish:

- current holder id
- stored location or estate asset ref
- current availability state
- condition/damage state if item systems support it
- owner chain
- transfer events
- recovery/repair/reforging events

Heirlooms must not:

- duplicate items
- become generic starter gear
- copy a catalog item for every descendant
- become immune to loss, theft, confiscation, breakage, destruction, encumbrance, legality, economy, or combat durability systems
- grant backstory identity directly
- imply automatic status/title/family legitimacy
- bypass item ownership, inventory, or equipment rules

## 7. Family Prestige Relationship

Family Prestige may later fit into this system as a family-ledger support cost.

Possible Family Prestige uses:

- heirloom registration cost
- heirloom transfer cost
- heirloom recovery/reforging support cost
- bequest preparation cost
- bequest claim support or legal handling cost
- family record/tree upgrade cost
- family-scoped Backstory Legacy support cost after evidence owners exist

Family Prestige alone is not proof of:

- an item existing
- a transfer being valid
- a bequest being recorded
- an estate asset being claimable
- an heir being eligible
- title/status ownership
- institution membership
- backstory identity
- current holder state

Rules for future spending:

- Available Family Prestige must be derived from ledger transactions.
- Spend records must reference the exact supported thing, such as `heirloomId`, bequest id, estate asset id, family upgrade id, or unlock id.
- Spending must fail if the referenced thing is missing, wrong-family, exhausted, destroyed, unsupported, or already claimed.
- No spend buttons should exist until spend owner, validation, and tests exist.

## 8. Bloodlines / Chronicle Relationship

Bloodlines should own family-scoped identity and progression:

- family records
- family tree presentation
- Family Prestige summaries
- family-scoped upgrades
- inherited tendencies
- heir context
- bequest summaries
- heirloom item-chain summaries
- family-scoped Backstory support only through approved resolver evidence

Chronicle should own account-wide memory and broad continuity:

- account run records
- broad milestones
- account-wide visibility
- cross-family progress
- Chronicle Marks if implemented later
- reduced conversion from family achievements to account support

Bequests and heirlooms should not be collapsed into Bloodline upgrades because:

- bequests transfer material or legal assets;
- heirlooms preserve a single item chain;
- Bloodline upgrades change inherited tendency or family potential;
- each has different ids, validation, failure states, and UI questions.

Account-wide Chronicle support must not fabricate family-specific item or estate history. A Chronicle Mark might later help unlock broad account support, but it should not pretend an unrelated family owns a sword, land claim, institution membership, title, or estate asset.

## 9. Backstory Eligibility Boundary

Bequests do not directly unlock Backstory identity.

Heirlooms do not directly unlock Backstory identity.

Bloodline upgrades do not directly unlock Backstory identity.

Estate assets, Family Prestige, Chronicle Marks, and Lineage Seals do not directly unlock Backstory identity.

Any future Backstory access must still flow through Backstory Eligibility resolver evidence. The creator should continue consuming resolver output instead of reading bequest, heirloom, estate, Bloodline, Chronicle, or UI state directly.

Scoped Backstory Legacy evidence remains deferred until owner systems exist for the relevant scope:

- family evidence needs explicit `familyId` and matching family ownership;
- source-run evidence needs an owner that proves source relation;
- region/local evidence needs durable region or settlement ownership;
- institution evidence needs institution membership ownership;
- estate/title evidence needs estate/title/status ownership;
- heir/preparation evidence needs heir or preparation owner seams.

## 10. First Safe Candidate Concepts

These are conceptual candidates only. Do not add live ids or content records from this list until the owning runtime exists.

Safe bequest concepts:

- small coin provision from an archived estate
- stored household provision
- simple tool-stack bequest
- preserved travel supplies
- family document claim that only displays as context
- workshop stake preview with no ownership transfer

Unsafe bequest concepts:

- noble title claim without title/status systems
- institution membership claim without institution systems
- market-contact inheritance without contact systems
- magic license or spell access without magic acquisition systems
- free property control without estate/property systems
- direct stat, skill growth, or Bloodline tendency
- direct Backstory unlock

Safe heirloom concepts:

- named ordinary tool heirloom when item-instance persistence exists
- named weapon heirloom when combat/item durability ownership exists
- repaired shield heirloom with explicit broken/repaired states
- signed book or household relic as a display-only item chain
- preserved instrument or craft tool that can be lost or stored

Unsafe heirloom concepts:

- duplicated starter sword for every descendant
- generic item catalog unlock labeled heirloom
- immune weapon that cannot be lost, broken, stolen, confiscated, or destroyed
- heirloom that grants noble legitimacy
- heirloom that directly grants `Garrison Ward`, `Minor Noble`, `Merchant Family`, or any other Backstory identity
- heirloom that grants magic power or spell access without magic owner systems

Candidates requiring estate/title/institution/magic/contact systems first:

- legal writ that confers actual title/status
- land parcel or property control
- workshop/business operation rights
- temple or guild membership papers
- trade license with market benefits
- academy or scriptorium patron document
- relic with divine/magic effects
- merchant introduction or contact network

## 11. Implementation Sequence

Recommended future sequence after this plan:

1. Runtime shape / contracts readiness audit: define the minimum data shapes for bequest records, heirloom records, item-instance identity, estate claim refs, and family owner refs without editing runtime yet.
2. Validation plan: define validators for family id ownership, source run, estate asset refs, item instance refs, current holder states, recipient rules, and missing-owner failure states.
3. Pure helpers: add read-only helpers for bequest eligibility preview and heirloom presentation only after contracts are approved.
4. Read-only view model: project bequest and heirloom summaries into a Bloodlines/Chronicles view model without actions.
5. Read-only UI: render compact inactive or read-only panels only after the view model is stable.
6. Family Prestige spending plan: define spend references and ledger semantics for exact supported things.
7. Mutating registration/transfer later: add heirloom registration, transfer, bequest preparation, and claim delivery only after owner systems and tests exist.
8. Content expansion last: author live bequest/heirloom content only after runtime, validation, UI copy, and failure states are proven.

Do not jump straight into full implementation. The next implementation-adjacent step should be a readiness audit or Bloodlines view-model plan, not mutating heirloom/bequest behavior.

## 12. Future Test Requirements

Before implementation, focused tests should prove:

- bequest records do not grant Bloodline traits;
- Bloodline upgrades do not transfer material goods;
- heirloom records refer to one item instance and do not duplicate items;
- heirlooms can be unavailable when lost, stolen, confiscated, broken, or destroyed;
- bequest claims fail without estate/family owner evidence;
- bequest claims fail for wrong-family or unsupported claimants;
- heirloom transfer fails without an eligible holder;
- Family Prestige spend records reference the exact supported thing;
- Family Prestige spending fails when the referenced thing is missing or wrong-family;
- no Backstory availability changes from bequest records alone;
- no Backstory availability changes from heirloom records alone;
- no creator resolver bypass;
- no account-wide effect from family-scoped bequests or heirlooms unless explicitly converted through Chronicle;
- estate/title/institution/magic/contact candidates remain locked/deferred until owner systems exist;
- destroyed or exhausted records do not silently become claimable again;
- read-only UI shows inactive states without claim/register/transfer/spend buttons.

## 13. Open Questions

These questions do not block this planning-only document, but they should be answered before runtime implementation:

1. Should bequests be limited to family/heir contexts only, or can some account-level estate bequests support unrelated future characters through Chronicle mechanics?
2. Should heirlooms always require a family line, or can a non-family Chronicle heirloom exist later?
3. Should heirloom registration happen only at retirement/death, or during active play at special locations?
4. Should bequests require a will/estate planning action, or can some transfer automatically on retirement/death?
5. Should a destroyed heirloom be permanently gone, or can rare recovery/reforging create a new recorded heirloom state?
6. Should estate claims use Family Prestige, Chronicle Marks, both, or only owner-specific claim rules?
7. Should display-only relics become heirlooms before item-instance persistence, or should all heirlooms wait for true item instances?
8. How should theft/confiscation interact with future legal systems, settlement guards, and faction hostility?
9. Should unrelated account characters ever receive material support from a former family without explicit Chronicle conversion?
10. How much player-facing detail should inactive bequest/heirloom panels show before those systems are actionable?

## 14. Temporary Guardrail Cleanup Decision

Keep `docs/design/heirloom-vs-bequest-vocabulary-audit.md` for now as a consumed compact checklist. This plan and `docs/design/future-system-design-ledger.md` are the authority if the older audit disagrees.

Keep `docs/design/legacy-scope-bloodline-economy-plan.md` for now. It still carries broader Legacy/Bloodline/Family Prestige economy boundaries that extend beyond heirloom and bequest planning.

Keep `docs/design/bloodlines-information-architecture-audit.md` for now as a partially consumed Bloodlines presentation guardrail. The pure projection and first read-only UI landed in 0.5.71/0.5.72, but richer tree/detail rules remain useful.

Keep `docs/design/chronicles-bloodline-tree-presentation-plan.md` for now. It remains useful for richer tree presentation, Chronicles placement, and future Bloodlines boundaries.

This document becomes the active `0.5.70` heirloom/bequest planning artifact. After later implementation consumes it, fold durable vocabulary and owner rules into `docs/design/future-system-design-ledger.md`, update the roadmap/handoff as needed, and delete or retire obsolete temporary audit docs in a dedicated cleanup pass.
