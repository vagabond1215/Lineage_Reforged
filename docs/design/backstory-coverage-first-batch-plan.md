# Backstory Coverage First-Batch Plan

Source version/run: Version 0.5.48 - Backstory Coverage First-Batch Plan
Date: 2026-05-17
Status: docs-only planning

## Summary Recommendation

The first safe Tier 1 content batch should add common formative origins that broaden low-status, low-skill starting coverage without requiring new runtime systems or new skill ids.

Recommended first batch:

- Militia Levy
- Street Vendor
- Net-Tender
- Gatherer
- Scribe's Apprentice
- Drover's Hand
- Kitchen Hand

This batch should remain content-only when implemented later. It should not add unlock logic, resolver behavior, hidden availability, market passives, contacts, mounts, heir legitimacy, magic access, new abilities, schema changes, or generated UI output.

## Current Coverage Gap Summary

Current live backstories cover five default/common starts (`Local`, `Vagabond`, `Exile`, `Farmhand`, and `Amnesiac`) plus several locked, special, or higher-risk starts such as Merchant Family, Workshop-Raised, Garrison Ward, Scout's Ward, Scholar's Apprentice, Temple Acolyte, Hedge Adept, Minor Noble, and Local Champion.

The clearest safe gaps are:

- a low-tier civic defense origin below Garrison Ward that does not grant weapons mastery or abilities
- a low-status market/trade origin below Merchant Family that does not grant economy effects
- a fishing and water-safety origin for river/coastal life
- a gathering/flora origin that is not as broad as Farmhand or Vagabond
- a mundane records/admin origin separate from Scholar's Apprentice and magic skills
- an animal-handling/ranch support origin that avoids mount promises
- a cooking/service origin that does not imply inn ownership, social contacts, or economy passives

Current canonical skill ids support all recommended first-batch concepts.

## Candidate Evaluation

| Candidate name | Lane | Recommended tier | Primary background skill id | Unlock availability recommendation | Overlap with current records | Runtime risk | First-batch recommendation | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Militia Levy | `militia_garrison` | `tier_1` | `skill.combat.tactics.formation_discipline` | Early Legacy, not default | Lower-risk precursor to Garrison Ward; overlaps guard/formation skills only | Moderate | Yes | Keep it civic defense and drill exposure only. No starting ability, weapon specialization, rank, command authority, or elite identity. |
| Street Vendor | `trade_market` | `tier_1` | `skill.settlement.trade` | Early Legacy or low-risk default candidate | Lower-status precursor to Merchant Family | Low | Yes | Use bargaining, stall work, counting, and local market observation. No price passive, contact, wealth, or business ownership. |
| Net-Tender | `river_coastal` | `tier_1` | `skill.resource.fishing` | Early Legacy or low-risk default candidate | New river/coastal coverage; slight overlap with survival/navigation starts | Low | Yes | Keep to nets, fish handling, water safety, and weather attention. No route authority, boat ownership, cargo, or contact effects. |
| Gatherer | `medicine_herbal` | `tier_1` | `skill.resource.gathering` | Early Legacy or low-risk default candidate | Overlaps Farmhand and Vagabond but narrows to field collection and flora habits | Low | Yes | Use gathering, foraging, flora lore, and endurance. Do not imply healing, alchemy, item generation, or herbalist status. |
| Scribe's Apprentice | `scholar_institution` | `tier_1` | `skill.settlement.administration` | Early Legacy, not default until mundane/magic split is accepted | Distinguishes mundane records from Scholar's Apprentice, which still carries magic skills | Low | Yes | Use copying, ledgers, administration, general/civic lore, and careful memory. No arcane lore, spellcasting, institution privileges, or magic access. |
| Drover's Hand | `rural_labor` | `tier_1` | `skill.survival.animal_handling` | Early Legacy or low-risk default candidate | Overlaps Farmhand but narrows to livestock, pens, roads, and handling | Low | Yes | Use animal handling and ranching without mounts, riding, cavalry, pack-animal runtime, or ownership effects. |
| Kitchen Hand | `rural_labor` or `civic_local` | `tier_1` | `skill.crafting.cooking` | Early Legacy or low-risk default candidate | New cooking/service coverage; light overlap with Local and Farmhand | Low | Yes | Use food prep, stores, cleaning, fire discipline, and service routines. Avoid inn ownership, hospitality contacts, discounts, or economy behavior. |
| Dockhand / Riverhand | `river_coastal` | `tier_1` | `skill.settlement.logistics` | Later Tier 1 | Overlaps Net-Tender and trade/logistics | Moderate | Later | Current skills support it, but cargo, port labor, routes, and shipping can imply transport/economy behavior. Better after Net-Tender establishes the water-labor lane. |
| Barge Hand | `river_coastal` | `tier_2` or later `tier_1` after route rules | `skill.settlement.logistics` | Later | Overlaps River Pilot/Ferryman path | Moderate | No | It leans toward river transport and cargo contracts. Defer until route/transport ownership is clearer. |
| Forge Yard / Forge Hand | `craft_metal` | `tier_1` if carefully worded | `skill.crafting.smelting` or `skill.crafting.basic_crafting` | Later Tier 1 | Overlaps Workshop-Raised and future Forge Apprentice | Moderate | Later | Current skills support it, but forge wording can overpromise skilled apprenticeship or blacksmith identity. Use only if framed as hauling, charcoal, bellows, sorting, and cleanup. |
| Forge Apprentice | `craft_metal` | `tier_2` | `skill.crafting.blacksmithing` | Normal Legacy later | Planned Tier 2 branch from Workshop-Raised | Moderate | No | Do not force into Tier 1. It implies formal training and should remain a branch after workshop/craft evidence. |
| Stablehand | `rural_labor` | `tier_1` | `skill.survival.animal_handling` | Later or alternate to Drover's Hand | Similar to Farmhand and Drover's Hand | Low to moderate | Alternate | Safe if explicitly not mounted. Drover's Hand is the cleaner first-batch name because it emphasizes handling and labor, not riding or cavalry. |
| Tanner's Yard | `craft` | `tier_1` or `tier_2` | `skill.crafting.tanning` | Later | Craft-specialized branch from Workshop-Raised, Hunter, or Butchering | Low to moderate | Later | Current skill exists, but it is specialized enough to wait for a craft coverage batch. |
| Loomhouse | `craft` | `tier_1` or `tier_2` | `skill.crafting.weaving` | Later | Craft-specialized branch from Workshop-Raised or household labor | Low | Later | Current skill exists, but it is better grouped with a textile/craft pass. |
| Hidden Blood | `status_lineage` | `special` or deferred | null | Deferred | No safe live equivalent | High | No | Needs family, ancestry, legal claim, public recognition, and stigma ownership first. |
| Unacknowledged Blood | `status_lineage` | `special` or deferred | null | Deferred | No safe live equivalent | High | No | Needs family/ancestry ownership and cannot be a normal starter flavor yet. |
| Red-Lantern Ward / Courtesan's House | `social_patronage` | `special` or deferred | null | Deferred | No safe live equivalent | High | No | Keep as tasteful social-status planning only until patronage, stigma, household, and contact systems exist. |

## Recommended First Batch

1. Militia Levy
2. Street Vendor
3. Net-Tender
4. Gatherer
5. Scribe's Apprentice
6. Drover's Hand
7. Kitchen Hand

These seven concepts are broad enough to improve first-screen variety later while still being small enough for one controlled content batch. All can use current canonical skill ids and can be written as formative origins rather than current jobs, classes, or runtime promises.

## Deferred Or Later Candidates

- Dockhand / Riverhand: viable later, but should wait until Net-Tender proves the river/coastal Tier 1 lane without cargo, route, or economy implications.
- Barge Hand: defer until route/transport ownership exists or classify as a later branch.
- Forge Yard / Forge Hand: viable later only with careful low-status wording; keep separate from Forge Apprentice and avoid skilled blacksmith overreach.
- Forge Apprentice: Tier 2, not first-batch Tier 1.
- Stablehand: safe alternate, but Drover's Hand is the preferred first animal-handling concept because it avoids mount-adjacent presentation.
- Tanner's Yard and Loomhouse: current skills exist, but both are better reserved for a later craft/textile batch.
- Hidden Blood, Unacknowledged Blood, Red-Lantern Ward, and Courtesan's House: remain special/deferred until family, ancestry, status, patronage, stigma, and contact ownership exist.

## Proposed First-Batch Short Descriptions

### Militia Levy

- Visible name: Militia Levy
- One-sentence premise: Local defense drills, watch rotations, and civic alarm duties taught you discipline without making you a soldier.
- Primary skill: `skill.combat.tactics.formation_discipline`
- Likely starting skill bundle direction: formation discipline, guard, endurance, civic lore; no weapon specialization and no starting ability.

### Street Vendor

- Visible name: Street Vendor
- One-sentence premise: Small sales, crowded lanes, hard bargaining, and market observation shaped your earliest practical habits.
- Primary skill: `skill.settlement.trade`
- Likely starting skill bundle direction: trade, negotiation, civic lore, general lore or reputation; no discounts, contacts, passive income, or extra coin.

### Net-Tender

- Visible name: Net-Tender
- One-sentence premise: Nets, wet rope, weather, and fish handling taught you the patient routines of low-status water work.
- Primary skill: `skill.resource.fishing`
- Likely starting skill bundle direction: fishing, water safety, swimming, endurance or navigation; no boats, route authority, cargo, or contacts.

### Gatherer

- Visible name: Gatherer
- One-sentence premise: Field collection, useful plants, and careful attention to what can be taken safely shaped your practical survival habits.
- Primary skill: `skill.resource.gathering`
- Likely starting skill bundle direction: gathering, foraging, flora lore, endurance; no alchemy, healing, item generation, or herbalist rank.

### Scribe's Apprentice

- Visible name: Scribe's Apprentice
- One-sentence premise: Copying, ledgers, messages, and patient correction taught you records work before scholarship became a claim.
- Primary skill: `skill.settlement.administration`
- Likely starting skill bundle direction: administration, general lore, civic lore, cultural lore; no arcane lore, mana, spellcasting, or institutional authority.

### Drover's Hand

- Visible name: Drover's Hand
- One-sentence premise: Pens, roads, feed, and stubborn animals taught you practical handling through labor rather than ownership.
- Primary skill: `skill.survival.animal_handling`
- Likely starting skill bundle direction: animal handling, ranching, endurance, navigation or agriculture; no mounts, riding, cavalry, or pack-animal runtime effects.

### Kitchen Hand

- Visible name: Kitchen Hand
- One-sentence premise: Stores, fires, preparation, cleaning, and service rhythms taught you how households and public rooms keep people fed.
- Primary skill: `skill.crafting.cooking`
- Likely starting skill bundle direction: cooking, fire control, general lore, stewardship or civic lore; no inn ownership, vendor discounts, contacts, or economy behavior.

## Content Implementation Guardrails For Version 0.5.49

- Add only the approved Tier 1 records, with no Tier 2, Tier 3, special, or deferred concepts.
- Use existing canonical skill ids only; do not invent skills such as riding, scribing, port labor, hospitality, or social-status skills.
- Keep each starting skill at or below the current starter cap and preserve existing starter-skill validation limits.
- Do not add starting abilities for the first batch.
- Do not change existing live backstory names, starter skills, abilities, attributes, schemas, save/account storage, Legacy runtime, combat, magic, economy, progression, launcher UI, generated UI output, or availability behavior.
- Do not add market passives, contacts, mounts, riding/cavalry behavior, route authority, cargo behavior, healing/surgery behavior, heir legitimacy, magic access, or institution privileges.
- Keep every premise formative: upbringing, household exposure, low-status work, civic obligation, or early practical habits rather than current profession or class identity.
- After content is added later, align non-runtime policy metadata in the same content pass and run focused backstory/content validation.

## Risks / Follow-Up

- Militia Levy is the only recommended first-batch concept with moderate runtime risk because it is combat-adjacent; it must stay ability-free and avoid weapons specialization.
- Scribe's Apprentice should use mundane administration/lore only so it does not duplicate the current magic-bearing Scholar's Apprentice.
- Street Vendor and Kitchen Hand must not imply economy effects, contacts, or passive discounts.
- Drover's Hand must not imply mounts, riding, cavalry, or animal-ownership runtime.
- If Version 0.5.49 needs to shrink scope, keep the first five records: Militia Levy, Street Vendor, Net-Tender, Gatherer, and Scribe's Apprentice.

## Next Recommended Version

Version 0.5.49 - Tier 1 Backstory Content Batch
