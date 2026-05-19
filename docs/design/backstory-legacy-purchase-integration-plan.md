# Backstory Legacy Purchase Integration Plan

Source version/run: Version 0.5.59 - Backstory Legacy Purchase Integration Plan
Date: 2026-05-19
Status: planning-only design document

## Purpose

This document plans how future Backstory Legacy purchases should support the runtime-owned Backstory Eligibility Resolver. It is design guidance only.

It does not:

- implement Backstory Legacy purchases
- add Legacy unlock records
- change Legacy runtime behavior
- change Backstory Eligibility policy semantics
- change creator availability
- create evidence ledgers
- change save/account schemas
- change starter skills, starting abilities, attributes, content JSON, policy metadata JSON, combat, magic, economy, progression, launcher UI assets, generated UI output, or live content records
- plan backwards compatibility or old-data rescue behavior

Current content ids should continue to validate directly. This pre-release project should use current authored content and current account/save shapes unless the user explicitly requests compatibility work.

## Current Branch Reality

Current implementation state:

- The live backstory catalog has 27 records.
- Version 0.5.56 added `BACKSTORY_ELIGIBILITY_POLICY`, `resolveBackstoryEligibility`, engine exports, and focused resolver/policy tests.
- Version 0.5.58 wired the character creator to resolver-backed availability. The creator now uses resolver-visible records, disables locked and special records, omits hidden/deferred records, and keeps settlement-start authorization separate.
- `newGameSnapshot.ts` still applies exactly one selected live backstory package.
- The resolver can evaluate `requiresLegacyPurchase`, `requiresAny`, `requiresAll`, `requiresEvidence`, `requiresPrestige`, `requiresEcho`, and `blocksIf`.
- The runtime policy covers all 27 current live backstory ids.
- The runtime policy already includes planned `legacy.backstory.*` requirement ids for several Tier 2 records, but those ids are not live Legacy unlock catalog records.
- The live Legacy runtime has categories, scopes, purchase modes, currencies, costs, requirements, effects, purchase handling, account Legacy state, preparation selection, character-start bonuses, renown presentation, and starter-skill policy seams.
- `packages/content/base/player/legacy_unlocks.json` has current Chronicle, Lineage, Renown, Fortune, Craft, Destiny, and Preparations records. It does not have implemented Backstory Legacy purchase records.
- Family/source-run evidence ledgers, earned skill maxima storage, scoped purchase storage, institution/title/status ownership, and blocked evidence owners remain deferred.

Current Legacy vocabulary that matters for future planning:

- Categories: `Lineage`, `Renown`, `Fortune`, `Craft`, `Destiny`, `Chronicle`, and `Preparations`.
- Kinds: `binary`, `tiered`, and `incremental`.
- Purchase modes: `permanent`, `unlock_only`, and `preparation`.
- Currencies: `account_legacy`, `family_prestige`, `regional_renown`, `knowledge_marks`, `chronicle_milestones`, and `skill_marks`.
- Scopes: `account`, `family`, `region`, `character_start`, `next_run`, `heir_only`, and `catalog_only`.
- Effects are currently limited to approved Legacy effect kinds. Backstory purchases should not grant starter skills, attributes, abilities, market effects, contacts, mounts, magic, medical effects, title legitimacy, or oath behavior through generic effects.

## Core Design Principle

Legacy purchase can support access, but it must not create unsupported history.

For Tier 2 and Tier 3 origins:

- Legacy purchase alone must not unlock the backstory.
- Required evidence must still exist.
- Purchase acts as authorization, training investment, family tradition recognition, or account/family support.
- Evidence proves the family, source run, institution, region, or status owner actually earned the right to unlock the origin.

For Tier 1 origins:

- Some low-risk backstories may be account-level, early-Legacy, or simple-evidence unlocks.
- Purchase may be enough only when the premise does not require blocked family, institution, status, magic, market, contact, mount, medical, or oath systems.
- Each Tier 1 purchase path should be reviewed case by case.

## Purchase Scope Model

Future Backstory Legacy purchases should declare scope as carefully as evidence does.

| Scope | Use for | Guardrail |
| --- | --- | --- |
| Account | Broad low-risk Tier 1 access, tutorial-style unlocks, or content visibility without inherited status. | Do not use for noble, title, institution, local-renown, household, or family-standing origins. |
| Family | Household, family trade, garrison, craft, inherited practice, or family reputation origins. | Requires family owner and evidence; must not fall back to account-wide. |
| Region | Local recognition, local champion, settlement or regional reputation starts. | Requires durable scoped renown or region evidence. |
| Institution | Temple, scholar, guild, oath, order, or formal acceptance starts. | Blocked until institution ownership exists. |
| Estate/title | Noble, heir, recognized claim, estate, or legal status origins. | Blocked until estate/title/status ownership exists. |
| Source run | Support from a specific prior character or run. | Requires durable source-run evidence and a valid source-run owner. |

Scope examples:

- Minor Noble is not account-wide by default.
- Merchant Family should not unlock from generic account wealth alone.
- Garrison Ward should not unlock from account martial flavor alone.
- Local Champion should not become global account-wide renown.
- World-Stray should remain special/manual or hidden.

## Purchase Categories And Naming

Backstory purchase unlocks should be narrow, readable, and tied to a specific origin.

Avoid vague ids:

- `legacy.backstory.unlock_1`
- `legacy.origin.generic`
- `legacy.noble_anywhere`

Prefer ids that name the target origin:

- `legacy.backstory.street_vendor`
- `legacy.backstory.militia_levy`
- `legacy.backstory.merchant_family`
- `legacy.backstory.garrison_ward`
- `legacy.backstory.scribes_apprentice`

Visible names should sound like Legacy investments, preservation, recognition, or support. They should not imply the purchase fabricates lived memory.

Good name direction:

- Preserve Street Vendor Origins
- Recognize Militia Service
- Carry Merchant Household Standing
- Maintain Garrison Ties
- Preserve Scribe Training

Avoid name direction that implies instant competence or invented history:

- Become a Merchant Heir
- Buy Noble Blood
- Instantly Learn Garrison Life
- Purchase Temple Membership

Backstory unlocks may eventually need a dedicated category or a tightly named `Lineage`/`Chronicle` subtrack. Do not overload generic Renown, Fortune, or Preparation records with hidden backstory eligibility side effects.

## Tier Rules

### Tier 1

Tier 1 purchases can be low-risk and simple when the premise is common, formative, and not blocked by missing owners.

Rules:

- Default records need no purchase.
- Some low-risk Tier 1 records may become early-Legacy or account-level unlocks.
- Purchase may unlock selectable availability when no blocked owner is needed.
- Do not attach major social/status power.
- Do not promise market passives, contacts, mounts, magic, medical systems, oath behavior, title legitimacy, or family estate access.
- Purchase should not grant starter skills, attributes, or starting abilities directly. It should only support resolver eligibility.

### Tier 2

Tier 2 purchases must support evidence rather than replace it.

Rules:

- Require scoped evidence plus purchase/support.
- Purchase alone fails.
- Usually family, source-run, institution, or region scoped.
- Can unlock stronger formative origin access, not stacked effects.
- Should use source-labeled evidence such as earned skill maxima, source-run tags, family backstory history, or institution acceptance only after those owners exist.

### Tier 3

Tier 3 purchases are long-term and evidence-heavy.

Rules:

- Require multiple evidence channels or strong scoped evidence.
- Purchase alone fails.
- Often family, institution, status, estate/title, renown, or region scoped.
- Should remain locked/deferred until owner systems exist.
- Do not create account-wide noble, heir, title, estate, institution, or status shortcuts.

### Special

Special origins are narrative/manual/story-owned.

Rules:

- Usually not purchasable through ordinary Legacy.
- World-Stray should remain special/manual or hidden.
- Local Champion should remain special or region/story/achievement scoped unless a dedicated owner says otherwise.

### Deferred

Deferred origins have no purchase path until required owner systems exist.

Rules:

- Do not create placeholder purchases for blocked owners.
- Do not show purchase promises for magic, institution, estate/title, heir legitimacy, mounts, contacts, medical systems, or oath behavior until those systems are active.

## Evidence Requirements

Future purchases should interact with evidence through the resolver, not bypass it.

Rules:

- `requiresLegacyPurchase` should support, not replace, `requiresEvidence`, `requiresAny`, or `requiresAll`.
- Tier 2 and Tier 3 rules should fail when only a purchase id is present.
- Starter-granted ranks must not count as earned skill maxima.
- Broad achievements must not unlock narrow origins unless explicitly mapped by policy.
- Source-run evidence must be reviewed, source-labeled, and scoped to a valid source run.
- Family evidence must not fall back to account-wide evidence.
- Missing evidence owners should resolve to locked, hidden, or deferred.
- Echo and Prestige can support access only when the required scoped evidence exists.

Good pattern:

```text
Merchant Family = family/source-run trade evidence + Legacy purchase support
```

Bad pattern:

```text
Merchant Family = account Legacy points only
```

## Blocked Evidence Owners

These owners remain blocked until dedicated systems exist:

- family skill maxima
- family backstory history
- heir legitimacy/status
- estate/title ownership
- regional renown storage if not durable/scoped
- institutional membership
- patronage/contact systems
- adoption
- marriage
- mounted behavior and mount ownership
- market/economy effects
- magic licensing/acquisition
- medical/injury systems
- oath and paladin behavior

Legacy purchase must not bypass blocked owners.

Examples:

- Do not let Legacy points unlock Minor Noble without family/title/status ownership.
- Do not let Legacy points unlock Temple Acolyte through institution membership before institutions exist.
- Do not let Legacy points unlock Hedge Adept as magic acquisition before magic ownership exists.
- Do not let Legacy points unlock market passives or contacts before economy/contact systems exist.
- Do not let Legacy points unlock mounted, paladin, medical, adoption, marriage, or patronage premises before their owners exist.

## Resolver Integration Plan

The resolver already supports `requiresLegacyPurchase`. Future integration should add only owned purchase ids to resolver input.

Future flow:

1. Legacy/account/family storage records an approved Backstory Legacy purchase id.
2. Creator or account presentation reads owned purchase ids from the correct storage owner.
3. Creator passes owned purchase ids to resolver input as `legacyPurchaseIds`.
4. Resolver evaluates purchase id, scope owner, evidence owner, and blocked evidence.
5. Resolver returns the same conservative projection shape it uses today: eligible, locked, hidden, deferred, special, defaults, records, and warnings.

Rules:

- Purchase ids must come from current account, family, region, institution, or other scoped storage once those owners exist.
- Do not fabricate purchase ids in UI state.
- Do not pass broad account flags as substitutes for family/title/institution/magic/mount/economy/medical/oath evidence.
- Default safety remains intact.
- Settlement-start authorization remains separate.
- Creator should never bypass resolver output with direct purchase checks.

## Legacy Runtime Integration Plan

Future Backstory Legacy runtime work should be a separate implementation pass after this plan.

Expected integration points:

- Add Backstory Legacy unlock records only after the runtime shape is approved.
- Decide whether backstory purchases live in a new category or a tightly scoped existing category.
- Classify purchase mode, scope, currency, duration, and implementation priority explicitly.
- Validate purchase requirements before allowing purchase.
- Treat unsupported requirement types as blocked rather than silently passing.
- Display purchase availability conservatively in the account/Legacy surface.
- Store purchased unlock ids where the resolver can receive them as support evidence.
- Avoid starter skill, attribute, ability, item, money, contact, market, mount, magic, medical, title, or oath effects through the purchase itself.
- Preserve no-stacking: parent backstory access evidence does not apply parent starter packages.

The current live Legacy runtime can purchase and record account-scoped live unlocks. It does not yet represent scoped Backstory Legacy purchases cleanly enough for family, region, institution, estate/title, or source-run ownership.

## Creator And UI Plan

The creator now consumes resolver output. Purchase presentation should follow that boundary.

Future UI rules:

- Locked backstory cards may show "Requires Legacy support" only when a real purchase path exists.
- Purchase state should not appear before the purchase system supports it.
- Character creation should not offer purchase buttons unless a later pass explicitly scopes that flow.
- The account/Legacy panel is the likely purchase surface for Backstory Legacy support.
- Creator should consume resolver output, not reimplement purchase logic.
- Visible copy should stay safe and non-technical.

Safe creator copy direction:

- "Requires matching evidence that is not currently available."
- "Requires Legacy support and matching evidence."
- "Not available in the current creator."
- "Requires a future system that is not active yet."

Unsafe creator copy direction:

- "Buy this with Legacy points now" before Backstory Legacy purchases exist.
- "Claim noble title ownership" before title/estate ownership exists.
- "Join the temple order" before institution membership exists.
- "Use trade contacts" before contacts/economy effects exist.

## Save And Account Data Plan

This pass does not add schema fields. Future storage should be designed before purchase records are implemented.

Likely storage needs:

- Account-level purchased Backstory Legacy ids for broad low-risk Tier 1 access.
- Family-scoped purchased ids for household/family/trade/garrison origins.
- Region-scoped purchased ids for local renown or local champion support.
- Institution-scoped purchased ids for scholar, temple, guild, or oath starts after institution ownership exists.
- Estate/title-scoped purchased ids for noble, heir, or recognized-claim starts after estate/title ownership exists.
- Source-run support references only after source-run evidence is durable and reviewable.

Missing storage behavior:

- If required purchase storage does not exist, treat the purchase as absent.
- If required scope owner is missing, do not grant scoped origins.
- If evidence owner is missing, do not infer eligibility from account Legacy points.
- Do not add backwards-compatibility, alias, or old-data rescue paths.

## Testing Plan

Future implementation should add focused tests before or alongside purchase integration.

Required coverage:

- Legacy purchase ids can make Tier 1 early-Legacy origins selectable when policy allows.
- Tier 2 purchase alone fails without evidence.
- Tier 3 purchase alone fails without evidence.
- Purchase plus wrong scope fails.
- Purchase plus blocked evidence fails or defers.
- Family-scoped purchase does not work account-wide.
- Account purchase cannot unlock Minor Noble, status, title, estate, institution, magic, mount, medical, or oath origins.
- Creator passes only owned purchase ids.
- Resolver output changes only through approved purchase/evidence input.
- No starter skill, attribute, starting ability, item, coin, contact, market, mount, magic, medical, title, or oath effect is granted by purchase itself.
- Parent and child backstory effects do not stack.
- Runtime code does not import design metadata or planning drafts.
- Current content ids validate directly with no compatibility rescue behavior.

Suggested future test locations:

- `tests/unit/backstory-legacy-purchase-policy.test.mjs`
- `tests/unit/backstory-legacy-purchase-resolver.test.mjs`
- `tests/unit/backstory-legacy-purchase-runtime.test.mjs`
- `tests/unit/backstory-creator-availability.test.mjs` updates after integration
- `tests/unit/legacy-start-resources.test.mjs` only if purchase state affects account Legacy presentation

## Initial Candidate Purchase Matrix

This table is planning only. It does not change live policy, Legacy catalog records, or creator availability.

| Backstory | Id | Classification | Future purchase stance | Evidence/scope direction | Notes |
| --- | --- | --- | --- | --- | --- |
| Local | `backstory.local` | no purchase needed / default | No purchase. | Account/default. | Baseline safe origin. |
| Vagabond | `backstory.vagabond` | no purchase needed / default | No purchase. | Account/default. | Baseline safe origin. |
| Exile | `backstory.exile` | no purchase needed / default | No purchase. | Account/default. | Baseline safe origin with hardship framing. |
| Farmhand | `backstory.farmhand` | no purchase needed / default | No purchase. | Account/default. | Baseline rural labor origin. |
| Amnesiac | `backstory.amnesiac` | no purchase needed / default | No purchase for current default fallback. | Account/default or special fallback. | Keep restrained and not a progression shortcut. |
| Workshop-Raised | `backstory.craftsmans_child` | no purchase needed / default | No purchase needed under current always-available policy; possible future review only. | Account/common craft root. | Do not turn into skilled guild membership without evidence. |
| Street-Raised | `backstory.gutter_rat` | no purchase needed / default | No purchase needed under current always-available policy; possible future review only. | Account/common hardship root. | No contacts, theft systems, or market effects. |
| Street Vendor | `backstory.street_vendor` | possible Tier 1 early-Legacy candidate | Possible account-level low-risk purchase or simple evidence unlock. | Account/source-run trade activity. | No discounts, contacts, passive income, or business ownership. |
| Net-Tender | `backstory.net_tender` | possible Tier 1 early-Legacy candidate | Possible account-level low-risk purchase or source-run water-work evidence. | Account/source-run fishing or water-work evidence. | No boat ownership, cargo behavior, or route authority. |
| Gatherer | `backstory.gatherer` | possible Tier 1 early-Legacy candidate | Possible account-level low-risk purchase or source-run gathering evidence. | Account/source-run gathering evidence. | No item generation, healing, or alchemy. |
| Drover's Hand | `backstory.drovers_hand` | possible Tier 1 early-Legacy candidate | Possible account-level low-risk purchase or animal-labor evidence. | Account/source-run animal-handling evidence. | No mount ownership, pack-animal runtime, or cavalry framing. |
| Kitchen Hand | `backstory.kitchen_hand` | possible Tier 1 early-Legacy candidate | Possible account-level low-risk purchase or kitchen-service evidence. | Account/source-run cooking/service evidence. | No inn ownership, contacts, free food, or economy bonus. |
| Militia Levy | `backstory.militia_levy` | possible Tier 1 early-Legacy candidate | Possible evidence-light early-Legacy purchase after civic-defense evidence exists. | Account/source-run civic alarm, drill, or formation evidence. | Combat-adjacent; no rank, command authority, or weapon specialization. |
| Scribe's Apprentice | `backstory.scribes_apprentice` | possible Tier 1 early-Legacy candidate | Possible evidence-light early-Legacy purchase after records/admin evidence exists. | Account/source-run records work or admin evidence. | Mundane records only; no arcane privilege. |
| Merchant Family | `backstory.merchants_child` | Tier 2 purchase + evidence candidate | Family/scoped purchase plus trade evidence. | Family/source-run trade evidence plus Legacy support. | Must not unlock from account wealth alone. |
| Carpenter Household | `backstory.carpenters_child` | Tier 2 purchase + evidence candidate | Family/scoped purchase plus carpentry evidence. | Family/source-run craft evidence plus Legacy support. | Could branch from Workshop-Raised when family history exists. |
| Miner's Kin | `backstory.miners_kin` | Tier 2 purchase + evidence candidate | Family/scoped purchase plus mining evidence. | Family/source-run extraction evidence plus Legacy support. | Avoid unsupported resource ownership effects. |
| Village Hunter | `backstory.village_hunter` | Tier 2 purchase + evidence candidate | Family/source-run purchase plus hunting evidence. | Source-run hunting or family frontier evidence. | Combat-adjacent; no elite archer identity. |
| Scout's Ward | `backstory.scouts_ward` | Tier 2 purchase + evidence candidate | Family/source-run purchase plus scouting evidence. | Source-run scouting/navigation evidence. | Keep separate from command authority or military rank. |
| Garrison Ward | `backstory.military_brat` | Tier 2 purchase + evidence candidate | Family/scoped purchase plus militia/garrison evidence. | Family/source-run militia service or formation discipline evidence. | Purchase cannot replace earned/source-run evidence. |
| Troupe-Raised | `backstory.performer` | hidden/deferred due blocked system | No purchase path until performance magic/social institution ownership is split or owned. | Institution/story/performance evidence later. | Avoid performance magic promises. |
| Scholar's Apprentice | `backstory.scholars_apprentice` | hidden/deferred due blocked system | No purchase path until scholar institution and magic/content split are owned. | Institution/source-run scholar evidence later. | No arcane shortcut. |
| Temple Acolyte | `backstory.temple_acolyte` | hidden/deferred due blocked system | No purchase path until institution/divine magic/oath ownership is reviewed. | Institution/temple evidence later. | No paladin/oath or divine magic promises. |
| Hedge Adept | `backstory.hedge_adept` | hidden/deferred due blocked system | No purchase path until magic acquisition/licensing ownership exists. | Magic owner evidence later. | Legacy points cannot grant magic access. |
| Minor Noble | `backstory.minor_noble` | Tier 3/deferred owner blocked | No account-wide purchase. Future estate/title/family scoped support only after owners exist. | Family, lineage, estate/title, patronage, adoption, marriage, or story evidence. | Blocked until status/title ownership exists. |
| Local Champion | `backstory.local_hero` | special/manual | Usually not ordinary purchase. | Region, local-renown, achievement, or story outcome evidence. | Must not become global account-wide renown. |
| World-Stray | `backstory.isekai_outcast` | special/manual | Not ordinary purchasable. | Special/manual narrative owner only. | Keep hidden or special until dedicated owner exists. |

## Recommended Implementation Sequence

Recommended next pipeline:

1. Version 0.5.60 - Backstory Legacy Purchase Runtime Shape
2. Version 0.5.61 - Backstory Legacy Purchase Content Draft
3. Version 0.5.62 - Backstory Legacy Purchase Resolver Integration
4. Version 0.5.63 - Backstory Legacy Purchase UI/Account Presentation Plan

Version 0.5.60 should choose the runtime purchase shape before any Legacy catalog records are added. It should answer whether Backstory Legacy purchases use a new category, existing `Lineage`/`Chronicle` categories, account-only storage, or a future scoped storage model.

## Risks And Open Questions

- Family/source-run ledgers are missing.
- Earned skill maxima storage is missing.
- Scoped purchase storage is missing.
- Existing Legacy runtime may not yet represent family-scoped backstory purchases cleanly.
- Broad achievements are too loose for narrow Tier 2/Tier 3 unlocks unless mapped carefully.
- Creator now consumes resolver output, so bad purchase evidence could visibly unlock content.
- Blocked owner bypass is the main risk.
- Account-level purchases are safe only for low-risk Tier 1 concepts.
- Current live policy includes planned `legacy.backstory.*` ids that are not live Legacy unlock records yet.
- Typecheck remains affected by known workspace/pre-existing TypeScript issues from the prior handoff.
