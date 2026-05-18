# Backstory Tiered Lane Design

Source version/run: Version 0.5.44 - Tiered Backstory Lane And Naming Design Audit
Date: 2026-05-15
Status: planning-only design document

## Scope

This document plans a future tiered, branching Backstory Legacy system. It does not add backstory records, change live backstory availability, define runtime eligibility logic, or modify character creation.

Current branch reality inspected for this pass:

- `packages/content/base/player/backstories.json` currently has 20 authored backstory records with starter skills at or below the current starter cap.
- `docs/design/backstory-policy-metadata.json` is explicitly `non_runtime_policy_draft` and `runtimeImportAllowed: false`.
- `docs/design/legacy-upgrade-catalog-draft.json` is explicitly `non_runtime_draft` and already treats backstory, family, skill, and heir concepts as catalog-only or backlog work.
- `packages/content/base/player/skills.json` has broad current skill families that can support later planning, but future backstory records must still resolve only to canonical skill ids that exist at the time they are authored.
- `packages/content/base/player/abilities.json` and `packages/content/base/player/achievements.json` show useful future evidence surfaces, but this document does not turn ability or achievement records into unlock logic.

## Core Design Principle

Backstories are formative origins and inherited life-shaping experiences. They are not current jobs, hard classes, permanent build restrictions, or permission gates for character development.

A backstory can explain why a new character starts with limited familiarity, social context, household habits, or institutional exposure. It should not imply that the character is locked into a profession, forbidden from learning outside that origin, or already a full member of an elite class-like role.

Backstories may carry job-like flavor when the formative experience came from a workplace, guild, order, garrison, caravan, temple, household, estate, or patron network. That flavor should describe upbringing, early training, exposure, obligation, or reputation rather than current employment.

## Naming Philosophy

Backstory names should avoid rigid systematic repetition. A catalog where every trade becomes `X Family`, every hardship becomes `X-Raised`, or every branch becomes `X Apprentice` will read like taxonomy rather than lived origin.

The naming catalog may mix patterns such as:

- `Family`
- `Household`
- `House`
- `Ward`
- `Kin`
- `Raised`
- `Borne`
- `Apprentice`
- `Yard`
- `Line`
- `Oathline`
- `Tradition`
- `Scion`
- `Hidden Blood`
- `Unacknowledged Blood`
- `Street-Raised`
- `Troupe-Raised`
- `Forge-Borne`
- `Forge Apprentice`
- `Merchant Family`
- `Merchant Household`
- `Carpenter Household`
- `Red-Lantern Ward`
- `Courtesan's House`

Naming rules:

- Use `Family` when bloodline, ancestry, or inherited family practice is central.
- Use `Household` when formative environment matters more than blood.
- Use `-Raised` for social, institutional, or circumstantial upbringing.
- Use `Ward` for being raised under a person, order, guild, temple, garrison, patron, or institution.
- Use `Kin` for hard labor or trade-culture identity where shared work and social belonging matter more than formal training.
- Use `Apprentice` when the formative experience was formal or semi-formal training under another person or institution.
- Use `Borne`, `Line`, `Tradition`, or `Oathline` sparingly for higher-tier or more storied origins.
- Use `Scion` only when inheritance, recognition, claim, or lineage status is part of the premise.
- Avoid making every trade use the same naming pattern.
- Avoid names that read as current jobs unless the phrase clearly points backward to upbringing or training.

Name quality tests:

- The name should answer "where did this person come from?" more than "what class is this person?"
- The name should leave room for the player to develop in any direction.
- The name should not promise runtime systems that do not exist yet.
- The name should not turn stigma, illegitimacy, poverty, or exploitation into cheap flavor.

## Tiered Lane Model

Future Backstory Legacy should use three broad tiers.

The future metadata draft should classify backstories by benefit level, prestige, unlock difficulty, and expected replay time. Do not use `standalone` as a tier value or branch-role category unless there is no defensible alternative. A backstory without a lower-tier precursor should normally still be classified as `tier_1`, `tier_2`, or `tier_3`.

Allowed planning tier values:

- `tier_1`
- `tier_2`
- `tier_3`
- `special`
- `deferred`

Do not use:

- `standalone`

Use `special` when a narrative exception is not ready for normal tier classification, such as `World-Stray`, `Local Champion`, illegitimate or heir-status concepts, or other unusual origin states. Use `deferred` when a concept is unsafe, too undefined, or blocked by missing runtime ownership.

### Tier 1

Tier 1 origins are common, low-skill, hardship, labor, local, or basic formative experiences.

Expected properties:

- Small starting bonus.
- Low cap.
- Easy, default, or early Legacy access.
- Broad replay variety.
- Minimal or no extra effect.
- Evidence can come from basic runs, starter achievements, low skill thresholds, common activity tags, or early account history.

Examples include `Militia Levy`, `Street Vendor`, `Workshop-Raised`, `Net-Tender`, `Gatherer`, `Scribe's Apprentice`, `Temple Acolyte`, `Hidden Blood`, `Unacknowledged Blood`, `Fostered Ward`, `Courtesan's House`, and `Red-Lantern Ward`.

### Tier 2

Tier 2 origins represent trained household exposure, a local institution, a specialized role, a recognized trade, or a branch specialization.

Expected properties:

- Requires Tier 1 progress plus actual play evidence.
- Higher cap than Tier 1.
- May start at or below the Tier 1 cap.
- May grow faster or farther than the Tier 1 version.
- Usually no more than one narrow contextual extra effect.
- Evidence should distinguish branches rather than merely count generic Legacy purchases.

Examples include `Sword Drill`, `Spear Drill`, `Shield Ward`, `Merchant Household`, `Caravan Factor`, `Forge Apprentice`, `Ferryman's Household`, `Herbalist's Helper`, `Scholar's Household`, `Oath Servant`, `Disputed Scion`, and `Patron's Ward`.

### Tier 3

Tier 3 origins represent established lineage, elite institution, advanced reputation, oathline, trade house, master lineage, or prestigious branch.

Expected properties:

- Long-term unlock.
- Requires several runs at minimum.
- Higher cap than Tier 2.
- May include one narrow non-stacking extra effect.
- Requires direct evidence tied to the lane, not generic account wealth.
- Should be deferred when its premise depends on unsupported runtime systems.

Examples include `Swordmaster's Line`, `Knightly Household`, `Dragoon Tradition`, `Veteran Captain's Line`, `Trade House`, `Shipping House`, `Forge-Borne`, `Master Builder's Line`, `River Pilot`, `Chirurgeon Line`, `Archivist Line`, `Paladin Oathline`, `Shrine Steward Line`, `Restored Scion`, `Left-Hand Line`, and `Recognized Heir`.

## Precursor And Alternate Unlock Model

Tier classification must not be used to imply that every higher-tier origin has a direct lower-tier precursor. Missing precursors should be represented explicitly instead of inventing a `standalone` category.

Planning fields for precursor shape:

- `hasPrecursor`
- `parentBackstoryIds`
- `alternateUnlockPath`
- `alternateUnlockKinds`

Rules:

- `hasPrecursor: true` means the origin has one or more direct lower-tier parent backstories.
- `parentBackstoryIds: []` is valid when `hasPrecursor: false`.
- `alternateUnlockPath: true` means the origin is unlocked through earned evidence outside a direct backstory chain.
- `alternateUnlockKinds` should name the evidence families that can substitute for a direct precursor.
- A higher-tier backstory can have no lower-tier precursor, but it still needs meaningful unlock criteria from previous play plus Legacy purchase, prestige, Echo, or equivalent account/family requirements.
- Legacy points alone are not enough to unlock a higher-tier backstory.

Examples:

- A nobility or status backstory can be `tier_2` or `tier_3` with `hasPrecursor: false` if it is unlocked through earned prestige, lineage recognition, estate status, adoption, marriage, patronage, or a story outcome rather than a lower-tier chain.
- `World-Stray`, `Local Champion`, illegitimate or heir-status concepts, and other narrative exceptions can use `special` when tier classification is not appropriate yet.
- Unknown, unsafe, or runtime-blocked concepts can use `deferred`.

## Branching Model

Backstory lanes do not need to be straight lines. A broad Tier 1 origin can branch into multiple Tier 2 paths, each with separate evidence requirements.

Example combat lane:

```text
Militia Levy
  -> Sword Drill
  -> Spear Drill
  -> Shield Ward
  -> Bow Levy
  -> Mounted Scout
```

Possible Tier 3 branches:

- `Sword Drill` -> `Swordmaster's Line`
- `Spear Drill` -> `Dragoon Tradition`
- `Shield Ward` -> `Knightly Household`
- `Mounted Scout` -> `Border Rider`
- `Mounted Scout` -> `Dragoon Tradition`
- `Temple Acolyte` or `Shield Ward` -> `Paladin Oathline`

`Paladin Oathline` should stay deferred until divine, magic, combat, reputation, and oath systems can support it without pretending that a backstory is a class. `Dragoon Tradition` should stay deferred until mounts, mounted combat, travel, and combat ownership exist.

Branch rules:

- A branch must require evidence that matches its theme.
- A branch should not unlock from Tier 1 completion alone if its Tier 2 identity is specialized.
- A Tier 3 branch may have more than one possible Tier 2 prerequisite when the fiction supports it.
- A lane can stop at Tier 2 if no safe Tier 3 runtime owner exists yet.
- A Tier 1 origin may feed non-combat, social, trade, and institutional paths when the formative premise supports it.

## No Stacking Rule

A player may unlock many backgrounds, but a new character selects one backstory.

Only the selected backstory applies. Prior tier bonuses do not stack with higher-tier bonuses. A higher-tier backstory may require an earlier tier to be unlocked or capped, but it does not grant both bonuses.

Example:

- Unlocking `Militia Levy`, then `Sword Drill`, then `Swordmaster's Line` allows a new character to choose one of those origins.
- Choosing `Swordmaster's Line` applies only the `Swordmaster's Line` starting package.
- The character does not receive `Militia Levy` plus `Sword Drill` plus `Swordmaster's Line`.

This rule is required to keep higher tiers from becoming hidden multi-background builds.

## Bonus And Cap Model

A future runtime-safe backstory record should separate identity, skill support, cap policy, and optional effect policy.

Proposed future fields:

- `tierIntent`
- `hasPrecursor`
- `parentBackstoryIds`
- `alternateUnlockPath`
- `alternateUnlockKinds`
- `primaryBackgroundSkillId`
- `baseBonus`
- `upgradeTiers`
- `upgradeScaleIntent`
- `expectedUpgradeCountRange`
- `upgradeCostCurveIntent`
- `prestigeRequirementIntent`
- `echoRequirementIntent`
- `capProgressionIntent`
- `maxCap`
- `familyAncestrySkillMaxCap`
- `breakthroughSafeCap`
- `optionalNarrowExtraEffect`

Rules:

- A backstory can never grant starting skill above what family evidence supports.
- Legacy purchases alone must not create unsupported competence.
- Higher-tier backstories may start at or below the prior tier cap.
- Higher-tier backstories may grow faster.
- Higher-tier backstories may reach a higher cap.
- Higher-tier backstories may gain one narrow effect.
- Family, ancestry, source-run, institution, achievement, skill, reputation, and chronicle evidence should be recorded separately so the resolver can explain why an origin is eligible.
- A higher-tier origin with `hasPrecursor: false` still needs meaningful previous-play criteria and non-trivial Legacy, prestige, Echo, or equivalent requirements.
- Legacy points alone must not unlock higher-tier competence, noble/status recognition, elite identity, or institutional acceptance.
- Caps must respect existing breakthrough policy. No backstory should silently cross a breakthrough gate at character start.

Illustrative cap shape:

| Tier | Typical base bonus | Typical cap | Evidence expectation |
| --- | ---: | ---: | --- |
| Tier 1 | small | low | default or early account evidence |
| Tier 2 | small to moderate | moderate | Tier 1 progress plus branch-specific play evidence |
| Tier 3 | moderate | high but bounded | several runs, lane-specific proof, and family or institutional support |

Exact numeric values should be set in a later metadata draft after the current starter cap, breakthrough gates, family ledger design, and eligibility resolver are reviewed together.

## Long-Term Upgrade Scale Planning

Backstory Legacy progression may involve many incremental upgrades per backstory or per tier. Expected early planning ranges may be 30 to 100 upgrades, but the metadata model should not hardcode that ceiling. Some lanes may eventually support hundreds or even 1000+ small upgrades if Echo, prestige, cost curves, and cap progression justify that scale.

Planning fields:

- `upgradeScaleIntent`: narrative and balance reason for the upgrade density.
- `expectedUpgradeCountRange`: rough planning range, not a runtime maximum.
- `upgradeCostCurveIntent`: whether costs are flat, stepped, escalating, milestone-gated, or prestige/Echo-weighted.
- `prestigeRequirementIntent`: how reputation, family standing, estate status, institution rank, or public recognition should gate progress.
- `echoRequirementIntent`: how Echo-like meta currency or account memory should support the lane without replacing evidence.
- `capProgressionIntent`: how incremental purchases affect starting bonus, cap, growth speed, or unlock visibility.

These fields are planning-only. They must not become runtime behavior, schema requirements, creator filtering, purchase logic, or live cap changes until a later resolver and balance implementation is explicitly approved.

## Extra Effect Rules

Allowed future effects should be narrow, contextual, and non-global.

Good effect examples:

- Small RNG trade outcome improvement in applicable markets.
- Starting contact.
- Minor reputation floor.
- Institution familiarity.
- Better information or price visibility.
- Narrow dialogue or contract option.
- Reduced friction with a specific group.
- Minor training access.

Avoid:

- Universal discounts.
- Global profit multipliers.
- Free gear every run.
- Broad combat power.
- Permanent class powers.
- Stacking all prior tier benefits.
- Effects that bypass current runtime ownership.
- Effects that make one origin universally optimal.

Extra effects should usually be off by default in the metadata draft unless a clear runtime owner exists.

## Example Lane Sketches

These lane sketches are planning examples, not content records.

### Combat / Militia

Tier 1:

- `Militia Levy`: basic local arms exposure, formation habits, fatigue, and civic defense expectations.

Tier 2:

- `Sword Drill`: requires sword use, melee training evidence, or combat drill records.
- `Spear Drill`: requires polearm or formation evidence.
- `Shield Ward`: requires guard, shield, or defensive service evidence.
- `Bow Levy`: requires archery or ranged militia evidence.
- `Mounted Scout`: requires scouting, route, travel, and later mount evidence.

Tier 3:

- `Swordmaster's Line`: requires repeated sword evidence, mentoring or lineage support, and renown.
- `Knightly Household`: requires shield or household service evidence plus family or patron standing.
- `Dragoon Tradition`: requires spear or mounted scout evidence and later mounted combat support.
- `Veteran Captain's Line`: requires command, formation, and multiple-run combat leadership evidence.
- `Paladin Oathline`: requires temple or shield evidence, oath legitimacy, and divine/magic/combat support.

Runtime risk notes:

- Mounted Scout, Dragoon Tradition, Knightly Household, Swordmaster's Line, and Paladin Oathline can read as class-like or combat-power promises if added before combat, mount, renown, household, and oath systems own the behavior.
- Combat branches should not grant broad combat power or free abilities at character creation without a separate balance pass.

### Trade

Tier 1:

- `Street Vendor`: basic selling, observation, bargaining pressure, and small-market survival.

Tier 2:

- `Merchant Household`: requires trade entries, household evidence, or family trade memory.
- `Caravan Factor`: requires travel, logistics, trade, or caravan contract evidence.
- `Wharf Broker`: requires river, coastal, dock, shipping, or market evidence.

Tier 3:

- `Trade House`: requires repeated trade success, household standing, and account or family trade proof.
- `Guild Factor`: requires guild reputation, contract reliability, and institutional access.
- `Shipping House`: requires port, shipping, market, and logistics proof.

Runtime risk notes:

- Market effects must wait for economy interaction surfaces.
- Avoid global discounts and profit multipliers.
- Better price visibility or a narrow contact is safer than passive wealth generation.

### Craft

Tier 1:

- `Workshop-Raised`: general tool, cleanup, sorting, measuring, repair, and material habits.

Tier 2:

- `Forge Apprentice`: requires metalwork, smelting, blacksmithing, or workplace evidence.
- `Carpenter Household`: requires carpentry, building, woodcutting, or settlement work evidence.
- `Tanner's Yard`: requires tanning, leatherworking, hunting, or butchery evidence.
- `Loomhouse`: requires weaving, cloth work, production, or household evidence.

Tier 3:

- `Forge-Borne`: requires repeated metalwork plus family or shop lineage evidence.
- `Master Builder's Line`: requires carpentry, masonry, building, and project completion evidence.
- `Leather Guild Kin`: requires leatherworking, guild presence, and household or kinship proof.

Runtime risk notes:

- Craft branches need recipe/workplace ownership before granting production effects.
- Extra effects should prefer training access or institution familiarity over free tools.

### River / Coastal

Tier 1:

- `Net-Tender`: basic fishing, water safety, weather observation, and low-status dock labor.

Tier 2:

- `Ferryman's Household`: requires water travel, local route, or household evidence.
- `Dockhand`: requires port labor, hauling, logistics, or settlement work evidence.
- `Barge Hand`: requires river transport, logistics, or cargo evidence.

Tier 3:

- `River Pilot`: requires repeated river travel, navigation, and route trust.
- `Harbor Factor`: requires port trade, logistics, and market reputation.
- `Tidewarden Tradition`: requires coastal safety, local authority, and water-hazard evidence.

Runtime risk notes:

- Route authority, cargo, shipping, and hazard effects must wait for travel, market, and transport runtime support.

### Medicine / Herbal

Tier 1:

- `Gatherer`: basic flora familiarity, foraging, field attention, and survival habits.

Tier 2:

- `Herbalist's Helper`: requires herb lore, foraging, field medicine, or care evidence.

Tier 3:

- `Physicker's Assistant`: requires field medicine, institution access, and repeated care records.
- `Chirurgeon Line`: requires advanced medical support and explicit injury or treatment systems.

Runtime risk notes:

- Medicine branches should not imply full healing magic or surgical systems before injury, recovery, and medical service ownership exist.

### Scholar / Institution

Tier 1:

- `Scribe's Apprentice`: copying, memory, ledgers, language, and records as formative work.

Tier 2:

- `Scholar's Household`: requires lore, scribing, civic records, or institutional evidence.
- `Arcane Assistant`: requires arcane lore and institution proximity without implying active spell mastery.

Tier 3:

- `Licensed Arcanist Line`: requires arcane institution support and later magic licensing systems.
- `Archivist Line`: requires repeated lore, records, codex, or institution evidence.

Runtime risk notes:

- Arcane branches must not add spell access, casting rights, or magic skill gain until the magic runtime plan explicitly allows it.

### Temple / Oath

Tier 1:

- `Temple Acolyte`: service, care, ritual order, stewardship, and community obligation.

Tier 2:

- `Oath Servant`: requires temple service, reputation, and oath-related evidence.
- `Field Caretaker`: requires field medicine, care, travel, or crisis support evidence.

Tier 3:

- `Paladin Oathline`: requires oath legitimacy, combat support, divine/magic boundaries, and reputation support.
- `Temple Physician`: requires care systems, institution backing, and medical service evidence.
- `Shrine Steward Line`: requires temple stewardship, local reputation, and household or institution proof.

Runtime risk notes:

- `Paladin Oathline` is high risk because it combines class-like identity, combat, faith, magic, reputation, and oath behavior.
- Temple origins should remain service and institution origins unless a later runtime system owns divine behavior.

### Social / Lineage Complication

Tier 1:

- `Hidden Blood`: a blood connection is concealed.
- `Unacknowledged Blood`: ancestry is suspected or known privately but not publicly recognized.
- `Fostered Ward`: raised under another household, patron, institution, or family.
- `Courtesan's House`: raised around patronage, reputation, rumor, household management, and social ambiguity.
- `Red-Lantern Ward`: raised under an institution marked by stigma, patronage, survival, rumor, and complicated protection.

Tier 2:

- `Disputed Scion`: requires claim evidence, family conflict, and public dispute.
- `Acknowledged Bastard`: requires recognition without full legal inheritance.
- `Patron's Ward`: requires patronage, household ties, and social obligation.

Tier 3:

- `Restored Scion`: requires public restoration, legal claim progress, and family evidence.
- `Left-Hand Line`: requires an acknowledged but legally limited lineage path.
- `Recognized Heir`: requires public recognition, inheritance support, and family ledger ownership.

Runtime risk notes:

- These origins require family, ancestry, legal status, public recognition, estate rights, and stigma to be separate data concepts.
- They should not be normal starter flavor without lineage ownership.

## Illegitimate, Hidden, Disputed, And Socially Complicated Heirs

These origins should be future lineage and social-status concepts, not ordinary starter flavor only.

Potential future tags:

- `legitimate`
- `acknowledged_bastard`
- `unacknowledged_blood`
- `hidden_heir`
- `disputed_heir`
- `adopted_heir`
- `fostered_ward`
- `temple_raised`
- `guild_raised`
- `courtesan_house`
- `red_lantern_ward`

Design cautions:

- Treat brothel and courtesan-related origins as social or institutional upbringing, patronage, rumor, survival, and stigma.
- Do not sexualize minors.
- Do not use cheap shock value.
- Do not make illegitimacy purely negative or purely advantageous.
- Separate blood inheritance, legal claim, public recognition, estate rights, and social stigma.
- Separate household upbringing from biological ancestry.
- Separate patronage from legal guardianship.
- Let stigma and opportunity both be contextual rather than universal modifiers.

Required future model distinctions:

- Blood inheritance: who a character descends from.
- Legal claim: what rights a character can assert.
- Public recognition: what others believe or admit.
- Estate rights: what property, title, or claims can be acted on.
- Social stigma: what risks, rumors, or friction follow the character.
- Household formation: who raised or trained the character.
- Patron protection: who can intervene, introduce, shelter, or manipulate the character.

## Runtime And Backlog Boundaries

Safe to plan now, deferred for implementation:

- Mounted combat stays deferred until mounts, combat, travel, and ownership systems exist.
- Paladin, dragoon, swordmaster, knightly, and other elite identities stay deferred until combat, magic, renown, faction, household, and institution systems support them.
- Heir legitimacy and status stay deferred until family and ancestry data models exist.
- Market-passive effects stay deferred until economy interaction surfaces exist.
- Institution contacts stay deferred until reputation, faction, contact, and dialogue or contract systems exist.
- Medical and chirurgeon branches stay deferred until injury, care, recovery, and medical-service behavior exists.
- Arcane and divine branches stay deferred until magic acquisition, casting, licensing, and school boundaries are intentionally designed.
- Trade-house and shipping-house effects stay deferred until market, route, cargo, and settlement service ownership can explain them.

This document should not be used as permission to add runtime eligibility logic, starter skill changes, new backstory records, new live Legacy purchases, new schema fields, new character creator filtering, or hidden backstory availability.

## Recommended Updated Prompt Pipeline

### Version 0.5.45 - Backstory Naming Convention Content Pass

Purpose:

- Review current live backstory names against the naming philosophy in this document.
- Decide which names should be kept, renamed, split later, or left unchanged under current branch constraints.

Likely files:

- `packages/content/base/player/backstories.json`
- `docs/design/backstory-policy-metadata.json`
- `docs/dev/current-codex-output.md`

Must stay out of scope:

- New backstory records.
- Runtime availability.
- Eligibility resolver logic.
- Starter skill changes.
- Save/account/schema changes.

Type:

- Content-only plus non-runtime metadata notes.

### Version 0.5.46 - Backstory Metadata Model Guardrail Revision

Purpose:

- Revise the planning model before metadata implementation so tier values, precursor fields, alternate unlock paths, and long-term upgrade-scale fields are explicit.
- Block `standalone` as a tier value or branch-role category.

Likely files:

- `docs/design/backstory-tiered-lane-design.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

Must stay out of scope:

- Runtime resolver.
- Character creator integration.
- Live Legacy purchases.
- New starter skill behavior.
- Content records.
- Schema changes.

Type:

- Docs-only planning.

### Version 0.5.47 - Tiered Backstory Lane Metadata Draft

Purpose:

- Draft non-runtime metadata for tier, lane, branch, prerequisite intent, cap intent, and extra-effect intent.
- Use `tier_1`, `tier_2`, `tier_3`, `special`, and `deferred`; do not use `standalone`.
- Separate missing precursors with `hasPrecursor`, `parentBackstoryIds`, `alternateUnlockPath`, and `alternateUnlockKinds`.
- Include planning-only upgrade-scale fields such as `upgradeScaleIntent`, `expectedUpgradeCountRange`, `upgradeCostCurveIntent`, `prestigeRequirementIntent`, `echoRequirementIntent`, and `capProgressionIntent`.
- Keep the draft separate from live runtime imports.

Likely files:

- `docs/design/backstory-policy-metadata.json`
- `docs/design/backstory-policy-metadata.md`
- `docs/dev/current-codex-output.md`

Must stay out of scope:

- Runtime resolver.
- Character creator integration.
- Live Legacy purchases.
- New starter skill behavior.
- Schema changes unless the draft file itself needs a non-runtime shape note.

Type:

- Metadata-only planning.

### Version 0.5.48 - Backstory Coverage First-Batch Plan

Purpose:

- Choose the first safe coverage gaps for new Tier 1 backstories.
- Prioritize common, low-risk origins that use current skill families and do not imply unsupported runtime systems.

Likely files:

- `docs/design/backstory-tiered-lane-design.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

Must stay out of scope:

- Adding the records themselves.
- Runtime eligibility.
- Advanced elite branches.
- Heir legitimacy implementation.
- Mounted, paladin, dragoon, magic, and economy effects.

Type:

- Docs-only planning.

### Version 0.5.49 - Tier 1 Backstory Content Batch

Purpose:

- Add a small first batch of safe Tier 1 backstory records after coverage is approved.
- Use current canonical skill ids only.
- Keep bonuses within starter cap policy.

Likely files:

- `packages/content/base/player/backstories.json`
- `docs/design/backstory-policy-metadata.json`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`
- Focused tests only if validation requires them.

Must stay out of scope:

- Tier 2 or Tier 3 records.
- Runtime unlock logic.
- New schemas.
- Character creator behavior changes beyond content validation effects.
- Elite branches, mounts, paladins, dragoons, heir claims, market passives, or contacts.

Type:

- Content-only with non-runtime metadata alignment.

### Version 0.5.50 - Backstory Eligibility Resolver Plan

Purpose:

- Plan the runtime-safe eligibility resolver before implementation.
- Define inputs, evidence ownership, explainability, non-stacking selection, cap rules, and current-data boundaries.

Likely files:

- New or existing `docs/design/*` resolver planning document.
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

Must stay out of scope:

- Implementing the resolver.
- Editing schemas.
- Live character creator filtering.
- Legacy purchase behavior.
- Starter skill application.
- Save/account shape changes.

Type:

- Runtime planning only.
