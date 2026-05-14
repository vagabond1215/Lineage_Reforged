# Current Codex Output

Source version/run: Version 0.5.40 - Backstory Coverage And Tone Audit
Date: 2026-05-14
Branch/status assumption: Current local branch reality; `git status --short` was clean before the audit. This was a read-only content-design audit except for this output file.

## Result

Audited the current backstory catalog for narrative quality, grounded medieval-fantasy tone, early-game skill coverage, and compatibility with the planned Background Legacy unlock model.

Overall finding: the catalog is a solid foundation. Most backstories feel like lived conditions, households, trades, institutions, hardships, or social positions rather than explicit RPG classes. The main problems are not broad narrative quality; they are future model mismatch and a few tone/name issues. Current backstories grant three to five trained skills, usually at rank 25, while the planned model wants a small `+5` bonus to one primary background skill. Several current backstories should become Legacy-locked specialist/status/profession/magic starts, `backstory.local_hero` is better treated as an achievement/title state, and `backstory.isekai_outcast` is too genre-meta for the grounded default catalog.

## Files Inspected

- `packages/content/base/player/backstories.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/abilities.json`
- `packages/content/base/player/achievements.json`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `docs/future_content_backlog.md`
- `packages/schemas/player/backstory.schema.json`
- `docs/dev/current-codex-output.md`
- `README.md`

## Current Catalog Overview

- Current backstories: 20.
- Current starter skill entries: 86.
- Current starter skill ranks: 15, 20, and 25.
- Current guardrails: at most five starter skills per backstory, no duplicate starter skills, starter rank maximum 25, and no starter skill at the first breakthrough rank 30.
- Starting abilities: only `backstory.village_hunter` and `backstory.military_brat` grant one ability each.
- Current schema does not support default/locked state, primary background skill, unlock evidence, background skill bonus tiers, or ancestry caps.
- The future Legacy draft already sketches catalog-only backstory unlock ideas, but it is explicitly non-runtime and should not be imported directly.

Strong coverage today:
- settlement/local life, travel/exile/survival, rural labor, hunting/scouting, mining/quarrying, wood/carpentry/building, trade, general workshop craft, noble/status upbringing, temple/service/healing, scholarship/literacy, hedge magic, garrison/military life, and street survival.

Weak or missing coverage today:
- fishing, river/coastal work, docks/ferry/boats, water safety, forge/smithing/metals as a trade, leather/tanning/textiles, cooking/inn/service, masonry/stonework, administration/scribing/logistics, stable/ranch work as a primary identity, and several early combat families such as dagger, axe, polearm/spear, shield handling, parrying, staff, hand-to-hand, throwing, and armor handling.

## Backstory Evaluation

| Id | Current name | Narrative quality | Tone/lore fit | Early-game role | Current issues | Future status | Primary background skill | Recommended unlock evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `backstory.local` | Local | Strong; clear social and civic roots. | Grounded, neutral, broadly useful. | Settlement familiarity and civic fluency. | Too broad for future one-skill model; diplomacy plus three lore skills makes it a civic package. | Default. Keep with small rewrite only if needed. | `skill.knowledge.civic_lore` | Default unlocked; optional evidence can use starts in same settlement/region and local reputation. |
| `backstory.vagabond` | Vagabond | Strong; lived travel hardship rather than class fantasy. | Grounded and useful. | Travel, endurance, route sense, light survival. | Five skills overstate breadth under the future model. | Default or very early unlock. | `skill.survival.navigation` | Family Navigation 10, `achievement.character.road_worn`, travel activity tags, route/completed journey history. |
| `backstory.exile` | Exile | Strong; consequence-driven, distinct from Vagabond. | Grounded, serious, plausible. | Survival after displacement. | Overlaps Vagabond heavily on endurance/navigation/foraging; guard is defensible but broad. | Default. | `skill.survival.endurance` | Default unlocked; optional evidence from exile/death/archive story tags, survival days, hostile-region escape, or family hardship record. |
| `backstory.merchants_child` | Merchant's Child | Strong household framing. | Grounded medieval trade/status life. | Trade, negotiation, appraisal. | Mineral identification feels too narrow unless tied to commodity trade; too many economic skills. | Legacy-locked profession/status. | `skill.settlement.trade` | Family Trade 10, `achievement.character.closed_deal`, `achievement.account.market_memory`, merchant profession history, market reputation, trade estate milestone. |
| `backstory.craftsmans_child` | Craftsman's Child | Solid but broad. | Grounded, useful, slightly generic. | General workshop upbringing. | Broad catch-all overlaps Carpenter's Child and should not grant both basic crafting and processing as a package. | Legacy-locked or split by craft family. | `skill.crafting.basic_crafting` | Family Basic Crafting 10, `achievement.character.worked_hands`, `achievement.account.makers_mark`, workshop profession history. |
| `backstory.performer` | Performer | Good public-life concept. | Mostly grounded, but `Performance Magic` makes it more magical than the prose implies. | Crowd work, morale, reputation, cultural literacy. | Could read like a bard class package if magic remains primary. | Legacy-locked; rename/rewrite to `Troupe-Raised` or split mundane performer from magical performer. | `skill.leadership.morale` | Performance activity tags, reputation threshold, `achievement.character.name_in_town`, troupe/guild association, cultural event history. |
| `backstory.minor_noble` | Minor Noble | Strong status upbringing. | Grounded and appropriate. | Etiquette, authority, negotiation, civic standing. | Status start should be earned by family evidence; current skills imply significant court training. | Legacy-locked status. | `skill.leadership.authority` | Family Prestige, noble lineage title, estate/renown milestone, diplomacy/authority threshold, regional reputation. |
| `backstory.carpenters_child` | Carpenter's Child | Strong practical household identity. | Grounded and useful. | Woodwork, construction, building labor. | Five skills are too much; overlaps Craftman's Child. | Legacy-locked profession; implementation-ready after primary skill metadata exists. | `skill.crafting.carpentry` | Family Carpentry 10, Building 10, `achievement.character.worked_hands`, `achievement.account.makers_mark`, construction/workplace history. |
| `backstory.village_hunter` | Village Hunter | Strong and concrete. | Grounded, but starting ability plus archery can drift into combat class start. | Food supply, tracking, butchery, field archery. | Grants five skills plus `Quick Shot`; too much for future background bonus. | Legacy-locked specialist. | `skill.resource.hunting` | Family Hunting 10 or Archery 10, hunting activity tags, Beast Lore evidence, provisioned-settlement accomplishment, `achievement.character.keen_eye`. |
| `backstory.miners_kin` | Miner's Kin | Strong, plausible, household-based. | Grounded. | Mining, quarrying, ore/stone familiarity. | Good identity, but current bundle over-covers extraction and material processing. | Legacy-locked profession. | `skill.resource.mining` | Family Mining 10, Quarrying 10, Earth Lore 10, extraction workplace history, mining estate or settlement renown. |
| `backstory.farmhand` | Farmhand | Strong, grounded, broad common-life anchor. | Very lore-friendly. | Rural labor, animals, gathering, endurance. | Five skills would become too much, but the concept is common enough to remain available. | Default or first low-cost unlock; recommended default if the starter set needs rural coverage. | `skill.settlement.agriculture` | Default unlocked; optional evidence from Agriculture 10, animal handling activity, harvest work, rural estate milestone. |
| `backstory.military_brat` | Military Brat | Concept is strong; name is the problem. | Name is too modern/casual; prose is grounded. | Garrison upbringing, formation discipline, camp order. | Rename required. Current sword, guard, melee, tactics, and command ability imply too much formal combat training. | Rename and Legacy-lock as combat/status. Best names: `Garrison Ward`, `Soldier's Kin`, `Camp-Raised`, or `Garrison-Bred`. | `skill.combat.tactics.formation_discipline` | Family Formation Discipline 10, Guard 10, Sword 10, `achievement.character.first_blooded`, garrison settlement access, military service history. |
| `backstory.gutter_rat` | Gutter Rat | Vivid and playable. | Plausible, but derogatory/tropey as a label. | Urban poverty, alleys, evasion, scavenging. | Rename to reduce trope and insult. Overlaps Vagabond/Exile on foraging/navigation/evasion. | Rename. Could be default if softened, otherwise low-tier Legacy unlock. Best names: `Street-Raised`, `Backstreet Survivor`, `Alleyborn`, or `Warren Child`. | `skill.combat.defense.evasion` | Family Evasion 10, Civic Lore 10, urban survival activity tags, theft/escape noncombat accomplishment, low-district reputation. |
| `backstory.scouts_ward` | Scout's Ward | Strong, specific, not generic. | Grounded. | Observation, routes, sign, hunting support. | Overlaps Village Hunter and Vagabond; archery makes it partly combat-start. | Legacy-locked specialist. | `skill.resource.spotting.fauna` | Family Spotting.Fauna 10, Navigation 10, Hunting 10, `achievement.character.keen_eye`, scout/route activity history. |
| `backstory.scholars_apprentice` | Scholar's Apprentice | Strong institutional learning identity. | Grounded if focused on literacy; less grounded when it grants mana/spellcasting. | Books, copying, memory, theory. | Currently blends scholarship with active magic. Should split mundane `Scribe's Apprentice` or `Scholar's Apprentice` from magical `Arcane Apprentice`. | Legacy-locked; rewrite or split. | `skill.knowledge.arcane_lore` if magical, `skill.knowledge.general_lore` if mundane. | Family Arcane Lore 10 or Common Lore 10, `achievement.account.finders_ledger`, scribing/scholar profession history, academy/temple/guild reputation. |
| `backstory.temple_acolyte` | Temple Acolyte | Strong duty/service framing. | Grounded and lore-friendly. | Temple service, healing discipline, stewardship. | Divine magic plus field medicine plus stewardship is broad; should choose care/service as primary. | Legacy-locked institution. | `skill.survival.field_medicine` | Family Field Medicine 10, Stewardship 10, `achievement.character.sworn_task`, temple service history, religious faction reputation. |
| `backstory.hedge_adept` | Hedge Adept | Strong concept for practical magic outside institutions. | Good medieval-fantasy fit. | Informal magic practice. | Four magic skills at rank 25 is high-risk and should remain locked until magic runtime/storage is ready. | Legacy-locked magic; backlog-only for live unlocks. | `skill.magic.mana_control` | Family Mana Control 10, Spellcasting 10, arcane event tag, magic tutor/source evidence, magic Legacy once approved. |
| `backstory.isekai_outcast` | Isekai Outcast | Mechanically understandable, narratively special-case. | Too genre-meta and modern for grounded default tone. | Outsider broad familiarity. | Name breaks immersion; concept is not a normal medieval formative condition. | Retire from standard catalog, or rename to an in-world special unlock such as `World-Stray`, `Unmoored Stranger`, or `Far-Woken`. Never default. | `skill.knowledge.general_lore` if retained. | Rare Chronicle/event flag, account-level special mode, hidden achievement, not family skill evidence. |
| `backstory.amnesiac` | Amnesiac | Usable but trope-prone. | Grounded enough if restrained. | Fragmented habits, endurance, dislocation. | Mystery-box identity can feel generic; useful as fallback but should not carry too much power. | Default fallback or special default. Minor rewrite recommended. | `skill.survival.endurance` | Default unlocked; optional trauma/survival event evidence if made special. |
| `backstory.local_hero` | Local Hero | Reads more like earned reputation than formative origin. | Grounded, but not a starting-life background. | Local trust after useful deeds. | Achievement/title state, not a new-account start. Also grants civic, cultural, melee, and medicine as a power bundle. | Convert to achievement/title or Legacy-locked special start; not default. | `skill.knowledge.civic_lore` if retained. | `achievement.character.name_in_town`, completed quest, local reputation 10+, settlement renown, lineage title, saved-settlement event. |

## Skill Coverage Matrix

| Practical skill/family | Current coverage | Coverage quality | Notes |
| --- | --- | --- | --- |
| Settlement/local life | Local, Minor Noble, Gutter Rat, Local Hero | Strong but clustered around Civic Lore. | Local is the best default. Local Hero should become earned reputation. |
| Travel/exile/survival | Vagabond, Exile, Amnesiac | Strong. | Vagabond and Exile overlap but have different emotional premises. |
| Rural labor | Farmhand | Good. | Good default candidate; only broadness needs reduction. |
| Hunting/scouting | Village Hunter, Scout's Ward | Strong. | These are good Legacy specialist starts; separate hunting from scouting/spotting. |
| Mining/quarrying | Miner's Kin | Good. | Add Forge/Smith later so ore extraction does not carry all metals coverage. |
| Wood/carpentry/building | Carpenter's Child, Craftsman's Child | Good but overlapping. | Carpenter's Child is stronger and more specific. |
| Trade/merchant life | Merchant's Child | Good. | Strong Legacy profession/status candidate. |
| General workshop life | Craftsman's Child | Moderate. | Too generic; split or keep as broad low-tier workshop start. |
| Noble/status upbringing | Minor Noble | Good. | Should be family/status locked. |
| Temple/service/healing | Temple Acolyte | Good. | Keep primary grounded in Field Medicine or Stewardship before Divine Magic. |
| Scholarship/literacy | Scholar's Apprentice | Moderate. | Needs a mundane scribe/scholar variant separate from active magic. |
| Hedge/practical magic | Hedge Adept | Good concept, high runtime risk. | Backlog until magic runtime and magic Legacy boundaries are ready. |
| Military/garrison/militia | Military Brat | Good concept, bad name. | Rename; reduce from weapon package to formation/guard identity. |
| Street/poverty/criminal-adjacent | Gutter Rat | Good concept, tropey name. | Rename and make tone less derogatory. |
| Fishing/river/coastal life | None | Missing. | Add Fisher's Child, Net-Tender, Riverhand, or Tideworker. |
| Dock/ferry/boat/water safety | None | Missing. | Add Dockhand, Ferryman's Kin, Barge Child, or Quay-Raised. |
| Forge/smithing/metals | Only indirect via Miner's Kin/Craftsman's Child | Weak. | Add Smith's Apprentice or Forge-Raised for Blacksmithing/Smelting. |
| Leather/tanning/textiles | None | Missing. | Add Tanner's Child or Loomhouse Child; do not overload generic craft. |
| Cooking/inn/service | None | Missing. | Add Inn-Kitchen Hand, Cook's Helper, or Taproom-Raised. |
| Herbalism/flora/medicine | Farmhand, Vagabond, Temple Acolyte, Isekai Outcast | Moderate. | Add Herbalist's Helper or Physicker's Assistant for grounded flora/medicine. |
| Masonry/stonework | Miner's Kin only indirectly | Weak. | Add Mason's Child or Stonewright's Kin. |
| Logistics/administration/scribing | Local/Minor Noble/Scholar only indirectly | Weak. | Add Clerk's Ward, Scribe's Apprentice, or Quartermaster's Runner. |
| Melee fundamentals | Military Brat, Local Hero | Weak for grounded starts. | Local Hero should convert to achievement; add militia/levy background later. |
| Sword | Military Brat | Narrow and high-power. | Keep locked; require family sword or garrison evidence. |
| Dagger | None | Missing. | Could fit Street-Raised, Sailor/Dockhand, or Cutpurse-adjacent special unlock. |
| Axe | None | Missing. | Could fit Woodcutter's Child or militia levy. |
| Polearm/spear | None | Missing. | Add Militia Levy, Watchman's Child, or Spear-Bearer's Kin. |
| Archery | Village Hunter, Scout's Ward | Strong. | Keep tied to hunting/scouting rather than a generic archer class. |
| Shield/guard | Exile, Military Brat | Moderate. | Add Watchman's Child or Shield-Bearer's Kin later. |
| Evasion | Vagabond, Gutter Rat | Strong but overlapping. | Best primary for renamed Street-Raised. |
| Staff/hand-to-hand | None | Missing. | Could fit Monastery Novice, Drover, or Quarterstaff Watch background later. |
| Throwing | None | Missing. | Could fit Hunter, Dockhand, or Street-Raised if future coverage needs it. |
| Armor handling | None | Missing. | Better reserved for garrison/armorer starts and later combat runtime. |

## Recommended Renames

- `Military Brat` -> `Garrison Ward` as first choice. Alternatives: `Soldier's Kin`, `Camp-Raised`, `Garrison-Bred`.
- `Gutter Rat` -> `Street-Raised` as first choice. Alternatives: `Backstreet Survivor`, `Alleyborn`, `Warren Child`.
- `Isekai Outcast` -> retire from standard catalog. If retained as a special mode, use `World-Stray`, `Unmoored Stranger`, or `Far-Woken`.
- `Local Hero` -> convert to a title/achievement such as `Name in Town`, `Settlement's Thanks`, or `Local Champion`; avoid using it as a normal start.
- `Craftsman's Child` -> consider `Workshop Child` or split into specific craft-house starts.
- `Performer` -> consider `Troupe-Raised` if it is mundane, or `Stage Adept` only if performance magic is intentionally retained.

## Recommended Rewrites

- Rewrite `Military Brat` around garrison household discipline, quartermaster routines, watch drills, and formation expectations without implying full soldier competence.
- Rewrite `Gutter Rat` to keep urban survival but remove the insulting trope label and reduce the criminal stereotype.
- Rewrite `Scholar's Apprentice` into either a mundane scholar/scribe background or split it from a future `Arcane Apprentice`.
- Rewrite `Performer` to decide whether it is a mundane troupe/crowd background or a magical performance lineage.
- Rewrite `Temple Acolyte` so the primary benefit is care, service, field medicine, or stewardship; reserve divine magic for a later locked upgrade.
- Retire or quarantine `Isekai Outcast` from the grounded catalog unless the game intentionally supports special out-of-world starts.
- Convert `Local Hero` into an achievement/title/unlock condition rather than a default character origin.

## Recommended Default And Legacy-Locked Split

Recommended default-unlocked set:
- `backstory.local`
- `backstory.vagabond`
- `backstory.exile`
- `backstory.farmhand`
- `backstory.amnesiac`

Conditional default after rename:
- `backstory.gutter_rat` only if renamed to `Street-Raised` or similar and softened.

Recommended Legacy-locked specialist/status/profession backgrounds:
- `backstory.merchants_child`
- `backstory.craftsmans_child`
- `backstory.performer`
- `backstory.minor_noble`
- `backstory.carpenters_child`
- `backstory.village_hunter`
- `backstory.miners_kin`
- `backstory.military_brat`
- `backstory.scouts_ward`
- `backstory.scholars_apprentice`
- `backstory.temple_acolyte`
- `backstory.hedge_adept`

Recommended retire or convert:
- `backstory.isekai_outcast`: retire from standard starts or make special non-default unlock.
- `backstory.local_hero`: convert to achievement/title or special Legacy start keyed to local reputation.

## Recommended New Background Concepts

Implementation-ready soon, because they cover practical gaps without needing new runtime systems:
- `Fisher's Child` or `Net-Tender`: primary `skill.resource.fishing`; evidence from fishing, water safety, coastal/river settlement starts.
- `Dockhand` or `Ferryman's Kin`: primary `skill.survival.water_safety` or `skill.settlement.logistics`; evidence from dock/ferry work, travel entries, coastal reputation.
- `Smith's Apprentice` or `Forge-Raised`: primary `skill.crafting.blacksmithing`; evidence from blacksmithing/smelting, worked-hands, forge workplace history.
- `Tanner's Child` or `Loomhouse Child`: primary `skill.crafting.tanning` or `skill.crafting.weaving`; evidence from workshop history and makers-mark style achievements.
- `Inn-Kitchen Hand`: primary `skill.crafting.cooking`; evidence from service work, cooking/brewing, trade/social activity tags.
- `Scribe's Apprentice` or `Clerk's Ward`: primary `skill.settlement.administration`; evidence from scribing, administration, contracts, civic reputation.
- `Mason's Child` or `Stonewright's Kin`: primary `skill.crafting.masonry`; evidence from masonry/quarry/building history.
- `Stablehand` or `Drover's Child`: primary `skill.survival.animal_handling`; evidence from ranching, animal handling, rural estate history.

Backlog-only until combat/runtime ownership is broader:
- `Militia Levy`: primary `skill.combat.defense.guard` or `skill.combat.weapon.polearm`; evidence from First Blooded, guard duty, settlement defense.
- `Watchman's Child`: primary `skill.combat.defense.shield_handling` or `skill.knowledge.civic_lore`; evidence from civic authority and guard history.
- `Woodcutter's Kin`: primary `skill.resource.woodcutting` or `skill.combat.weapon.axe`; evidence from woodcutting and forestry work. Use noncombat primary first.
- `Monastery Novice`: primary `skill.combat.weapon.staff` or `skill.leadership.stewardship`; backlog if it implies staff combat or divine power.

## Recommended First Implementation Slice

Before implementing locked backgrounds, do a content metadata and resolver-only slice:

1. Add or stage a pure backstory policy manifest that maps existing backstory ids to:
   - `defaultUnlocked`
   - `recommendedPrimaryBackgroundSkillId`
   - `recommendedFutureStatus`
   - `unlockEvidenceKinds`
   - optional `toneAction` such as rename, rewrite, retire, or convert.
2. Do not change `backstories.json` values or starter skill ranks in that slice.
3. Add tests proving every current backstory has one primary background skill recommendation, every default set leaves at least one available start, and every retired/convert recommendation is explicit.
4. Keep runtime, creator filtering, save/account schema, and Legacy catalog imports untouched until the resolver output is reviewed.

After that, the safest implementation order is:
- Rename/rewrite the obvious tone problems.
- Add the pure eligibility resolver.
- Add family/ancestry summary storage.
- Wire creator availability states.
- Migrate current multi-skill starts toward the `+5` one-primary-skill model.

## Risks / Follow-Up

- Current starter skills are much stronger than the planned one-skill `+5` model. Any implementation must treat that as a content/balance migration, not just a UI lock.
- Locking too many backgrounds before family evidence storage exists would make the catalog feel smaller without giving players a path to earn it.
- `Isekai Outcast` is the clearest tone conflict. Keeping it in the normal catalog weakens the grounded medieval-fantasy standard.
- `Local Hero` is a good achievement/title concept but undermines the premise of starting from formative background if kept as a normal origin.
- Combat-adjacent backgrounds need care so they do not become class packages or early weapon specialization shortcuts.
- Magic backgrounds should stay locked/backlog until magic runtime and magic Legacy boundaries are intentionally opened.

## Checks Run

- `git status --short`: passed before audit; clean.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `node --test tests\unit\*skill*.mjs tests\unit\*legacy*.mjs tests\unit\*creator*.mjs tests\unit\*backstory*.mjs`: passed, 62 tests.
- `git diff --check`: passed. Git emitted the line-ending warning that `docs/dev/current-codex-output.md` will be normalized from LF to CRLF the next time Git touches it.

## Behavior / Runtime Confirmation

No runtime, UI, schema, content JSON, save/account, combat, magic, Legacy, progression, launcher, or character creator behavior changed.

This run modified only `docs/dev/current-codex-output.md`.

## Next Recommended Version

Version 0.5.41 - Backstory Policy Metadata Plan

## Suggested Commit Message

docs(content): audit backstory coverage and tone
