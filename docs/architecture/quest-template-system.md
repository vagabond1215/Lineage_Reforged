# Modular Quest Template System

This document defines a reusable quest-template framework for Echoes of Legacy.

The design goal is to use one branching stage system for:

- combat contracts
- crafting commissions
- social and courtly work
- exploration and travel quests
- economic and merchant operations
- religious service, rites, and temple duties
- hybrid quests that mix several of those domains

The structure is inspired in part by the planning/execution chain used by TORN-style organized crime systems, but adapted for a medieval fantasy RPG where quests can belong to guilds, temples, noble houses, merchants, armies, adventurers, criminal networks, and local communities.

## Core Model

Every quest template is composed of 3 to 6 sequential stages.

Each stage must define:

- a clear objective or action
- one or more checks
- 5 outcome bands:
  - `criticalSuccess`
  - `success`
  - `partialSuccess`
  - `failure`
  - `criticalFailure`
- branch effects that change later stages

Each quest instance tracks:

- player or party stats
- learned skills
- abilities and spells
- carried items and equipped tools
- role tags
- lineage and class modifiers
- prior stage outcomes
- active quest-state tracks such as fatigue, suspicion, integrity, morale, sanctity, cargo condition, or heat

## Modular Pieces

The system should be assembled from reusable modules rather than one-off quest scripts.

### 1. Template Shell

The shell defines:

- quest family
- stage count
- stage order
- baseline difficulty band
- reward model
- failure model
- scaling rules

### 2. Stage Module

A stage module defines:

- objective
- participating role slots
- allowed approaches
- primary and secondary checks
- risk level
- outcome map
- state mutations

### 3. Check Module

A check module defines:

- primary skill or stat
- optional supporting skills or stats
- item, spell, trait, class, lineage, faction, or environment modifiers
- difficulty
- outcome thresholds

### 4. State Track Module

State tracks carry consequences forward.

Common tracks:

- `advantage`
- `complication`
- `fatigue`
- `wounds`
- `alert`
- `suspicion`
- `cargoIntegrity`
- `materialIntegrity`
- `morale`
- `sanctity`
- `profitMargin`

### 5. Role Adapter Module

Role adapters let one template support many fantasy identities without becoming hardcoded to one class.

Supported adapter groups should include:

- combat roles: tank, skirmisher, ranged, battle mage, support mage, healer
- craft roles: smith, alchemist, tailor, carpenter, jeweler, cook
- social roles: diplomat, courtier, spy, negotiator, herald
- exploration roles: scout, ranger, delver, navigator, survivalist
- economic roles: merchant, broker, factor, smuggler, caravan master
- religious roles: priest, acolyte, inquisitor, ritualist, healer, scribe

### 6. Identity Adapter Module

Class and lineage should modify options, not replace quest structure.

Use them for:

- small numeric bonuses
- alternate stage options
- reduced penalties in niche contexts
- access to special outcome branches

Examples:

- dwarves may gain small bonuses on underground craft and endurance stages
- elves may gain small bonuses on scouting, ritual, or bow-control stages
- priests may unlock sanctified solutions in faith quests
- merchants may unlock price-control or salvage-value branches in economic quests

## Generic Check Formula

Use one generic formula for all quest families.

```text
checkScore =
  primarySkill
  + floor(secondarySkill / 2)
  + linkedStat
  + gearModifier
  + itemModifier
  + spellModifier
  + traitModifier
  + classModifier
  + lineageModifier
  + roleModifier
  + advantageTrack
  - complicationTrack
  - fatiguePenalty
  - woundPenalty
  - alertPenalty
  + rngRoll

difficultyScore =
  baseDifficulty
  + stageDifficulty
  + riskModifier
  + escalationModifier
  + environmentalModifier
```

Recommended default RNG:

- `rngRoll = 0..20`

Recommended outcome thresholds by margin:

- `criticalSuccess`: `margin >= 15`
- `success`: `margin >= 5`
- `partialSuccess`: `margin between -4 and +4`
- `failure`: `margin between -14 and -5`
- `criticalFailure`: `margin <= -15`

Where:

- `margin = checkScore - difficultyScore`

## Risk and Reward Scaling

Each stage should expose a stance:

- `cautious`
- `balanced`
- `aggressive`

Suggested behavior:

- `cautious`
  - lower stage difficulty
  - lower time efficiency
  - lower reward multiplier
- `balanced`
  - no special change
- `aggressive`
  - higher stage difficulty
  - better reward multiplier
  - higher critical failure cost

Recommended reward scaling:

- `cautious`: `0.85x` reward, `-2` difficulty
- `balanced`: `1.0x` reward, `+0` difficulty
- `aggressive`: `1.2x` reward, `+3` difficulty

## Compounding Effects

Earlier outcomes should alter later stages.

Universal rules:

- each `success` grants `+1 advantage`
- each `criticalSuccess` grants `+2 advantage`
- each `failure` grants `+1 complication`
- each `criticalFailure` grants `+2 complication`
- each `complication` adds `+2` difficulty to later hostile or precision stages
- each `advantage` can either reduce later difficulty by `1` or unlock one improved option

Template-specific tracks should also compound:

- escort quests increase `alert` after noisy failures
- crafting quests reduce `materialIntegrity` after flawed shaping or heat treatment
- social quests increase `suspicion` after weak lies or etiquette failures
- religious quests reduce `sanctity` after impure actions or ritual missteps
- merchant quests reduce `profitMargin` after delays, spoilage, or bad trades

## Failure and Success Logic

Templates should distinguish between:

- hard failure
  - the quest ends immediately
- degraded continuation
  - the quest continues under penalties

Success should be tiered:

- `perfect`
- `strong`
- `standard`
- `salvaged`

Rewards should depend on:

- final stage result
- cumulative complication count
- preserved integrity tracks
- optional objectives met
- casualties avoided
- deadlines met

## Shared Template Record

```text
QuestTemplate
- id
- questType
- themeTags
- issuerTags
- roleAdapters
- identityAdapters
- requiredStats
- requiredSkills
- requiredItems
- stateTracks[]
- stages[3..6]
- failureStates[]
- successTiers[]
- scalingRules
```

## Template Coverage Matrix

The same system should cover the following quest families:

- combat
  - raids, ambushes, patrol breaks, monster hunts, sieges
- crafting
  - forging, alchemy, tailoring, carpentry, ritual production, repair chains
- social
  - negotiation, deception, diplomacy, interrogation, patronage, courtly petition
- exploration
  - scouting, dungeon delving, route mapping, survival travel, relic search
- economic
  - trade runs, smuggling, appraisal, business operations, caravan brokerage
- religious
  - shrine maintenance, relic recovery, pilgrim protection, rites, exorcism, doctrinal disputes

## Example Template 1

### 1. Quest Name

Broken Banner Counter-Raid

### 2. Quest Type

Combat

### 3. Required Skills or Stats

- Primary:
  - `skill.defense.guard`
  - `skill.weapon.polearm` or `skill.weapon.archery`
- Supporting:
  - `attr.STR`
  - `attr.CON`
  - `attr.WIS`
  - `attr.CHA`
- Helpful:
  - leadership traits
  - formation abilities
  - defensive buffs

### 4. Stage Breakdown

#### Stage 1

- Stage Name: Scout the raider camp
- Description: Identify the real camp perimeter, watch shifts, and weakest entry lane.
- Check Type(s): `WIS + scouting support`, optional stealth or ranged support
- Possible Outcomes:
  - Crit Fail: scouts are spotted, camp alert starts at `+2`
  - Fail: wrong perimeter read, next stage difficulty `+2`
  - Partial: camp found, but entry lane uncertain, no ambush bonus
  - Success: correct lane identified, next stage difficulty `-1`
  - Crit Success: hidden breach point found, gain `+2 advantage`
- Branching Effects:
  - raises or lowers `alert`
  - unlocks silent breach if success or better

#### Stage 2

- Stage Name: Breach the camp
- Description: Enter by stealth, feint, or direct smash depending on prior scouting.
- Check Type(s): guard, athletics, stealth, leadership, or force-entry tools
- Possible Outcomes:
  - Crit Fail: early melee begins on enemy terms, party starts wounded
  - Fail: breach stalls, alert `+2`, next stage difficulty `+2`
  - Partial: breach succeeds with losses, no momentum bonus
  - Success: breach succeeds, gain `+1 advantage`
  - Crit Success: defenders collapse immediately, next stage difficulty `-2`
- Branching Effects:
  - sets whether Stage 3 is a routed fight or contested fight

#### Stage 3

- Stage Name: Break the command knot
- Description: Kill or rout the enemy core before they rally.
- Check Type(s): weapon skill, tanking, healing support, burst abilities
- Possible Outcomes:
  - Crit Fail: commander survives and rallies, morale `-2`
  - Fail: enemy line holds, next stage difficulty `+2`
  - Partial: command knot broken but with heavy attrition
  - Success: command knot broken, enemy morale collapses
  - Crit Success: commander captured or killed cleanly, gain bonus loot path
- Branching Effects:
  - affects Stage 4 pursuit difficulty
  - affects final reward and reputation

#### Stage 4

- Stage Name: Hold the withdrawal route
- Description: Protect wounded allies and secure the retreat before reinforcements arrive.
- Check Type(s): guard, ranged cover, healing, morale control
- Possible Outcomes:
  - Crit Fail: routed withdrawal, hard failure if casualty threshold is crossed
  - Fail: retreat succeeds but reward is heavily reduced
  - Partial: escape with wounded and lost supplies
  - Success: clean withdrawal
  - Crit Success: clean withdrawal plus captured goods
- Branching Effects:
  - final reward depends on casualties, supplies, and commander result

### 5. Failure States

- Early termination if Stage 2 crit fails and casualties exceed limit
- Degraded continuation if Stages 2 or 3 merely fail
- Hard failure if retreat collapses or commander remains active

### 6. Success States

- Salvaged: camp disrupted, heavy losses, reduced pay
- Standard: raid broken, acceptable casualties
- Strong: raid broken cleanly, extra loot or reputation
- Perfect: raid broken, commander neutralized, captured stock recovered

### 7. Scaling Rules

- scale enemy count with player level band
- increase command-knot difficulty faster than scouting difficulty
- add elite defenders at higher tiers instead of only inflating numbers
- at high level, add secondary objectives such as prisoner rescue or supply seizure

## Example Template 2

### 1. Quest Name

Guild Oathblade Commission

### 2. Quest Type

Crafting

### 3. Required Skills or Stats

- Primary:
  - `skill.craft.smithing`
- Supporting:
  - `skill.craft.goldsmithing`
  - `attr.INT`
  - `attr.DEX`
  - `attr.CON`
- Helpful:
  - fire or heat-control magic
  - workshop-quality tools
  - high material integrity starting stock

### 4. Stage Breakdown

#### Stage 1

- Stage Name: Select and prepare the billet
- Description: Inspect stock, choose the alloy path, and prepare the first heat.
- Check Type(s): smithing, INT, appraisal-quality tools
- Possible Outcomes:
  - Crit Fail: flawed stock chosen, `materialIntegrity -2`
  - Fail: poor preparation, next stage difficulty `+2`
  - Partial: usable stock, no bonus
  - Success: good stock, `+1 advantage`
  - Crit Success: excellent billet, quality ceiling increases
- Branching Effects:
  - changes max attainable quality tier

#### Stage 2

- Stage Name: Draw and shape the blank
- Description: Establish edge line, spine, and core geometry.
- Check Type(s): smithing, STR, DEX
- Possible Outcomes:
  - Crit Fail: catastrophic split, hard failure
  - Fail: warped blank, `materialIntegrity -2`
  - Partial: workable blank, next stage difficulty `+1`
  - Success: good shape, stable continuation
  - Crit Success: ideal geometry, next stage difficulty `-2`
- Branching Effects:
  - affects heat-treatment stability

#### Stage 3

- Stage Name: Heat treat and quench
- Description: Harden the blade without cracking or losing the line.
- Check Type(s): smithing, DEX, heat-control modifiers
- Possible Outcomes:
  - Crit Fail: blade cracks, hard failure
  - Fail: soft or brittle result, reward cap reduced
  - Partial: blade survives with flaws
  - Success: sound heat treatment
  - Crit Success: exceptional temper, quality `+2`
- Branching Effects:
  - changes final edge and durability reward tier

#### Stage 4

- Stage Name: Finish, etch, and mount
- Description: Sharpen, polish, fit hilt, and add requested ornament.
- Check Type(s): DEX, goldsmithing, presentation modifiers
- Possible Outcomes:
  - Crit Fail: finish ruins sale value, degraded continuation
  - Fail: plain but usable finish
  - Partial: acceptable finish, no prestige bonus
  - Success: client-grade finish
  - Crit Success: prestige finish, unlock patron bonus
- Branching Effects:
  - affects final payment, guild reputation, and repeat orders

### 5. Failure States

- Hard failure on billet split or quench crack
- Degraded continuation on warped shaping or weak finishing
- Final failure if material integrity reaches zero before handoff

### 6. Success States

- Salvaged: functional weapon, reduced pay
- Standard: commission fulfilled
- Strong: excellent blade, bonus guild standing
- Perfect: prestige oathblade, patron favor and premium payment

### 7. Scaling Rules

- low-level jobs use simpler geometry and fewer ornament demands
- mid-level jobs raise quality thresholds rather than only raw DC
- high-level jobs add repeated fold passes, rare materials, or ritual inscriptions
- reward scaling should follow material rarity and prestige tier, not only player level

## Example Template 3

### 1. Quest Name

Pilgrim Caravan and Relic Recovery

### 2. Quest Type

Hybrid: exploration + social + combat + economic + religious

### 3. Required Skills or Stats

- Primary:
  - travel or scouting skill
  - persuasion or leadership equivalent
  - one combat skill
  - one religious or ritual competency
- Supporting:
  - `attr.WIS`
  - `attr.CHA`
  - `attr.CON`
  - `attr.INT`
- Helpful:
  - merchant appraisal tools
  - healing or warding magic
  - caravan supplies
  - temple credentials or faction favor

### 4. Stage Breakdown

#### Stage 1

- Stage Name: Secure supplies and permissions
- Description: Negotiate caravan support, route papers, and temple sanction.
- Check Type(s): persuasion, bargaining, faction standing, ritual credentials
- Possible Outcomes:
  - Crit Fail: starts with debt or suspicion, `suspicion +2`, `profitMargin -2`
  - Fail: fewer supplies, next travel stage difficulty `+2`
  - Partial: enough support to proceed, but no reserve stock
  - Success: caravan properly supplied
  - Crit Success: discount and blessing, `sanctity +1`, `profitMargin +1`
- Branching Effects:
  - affects supply quality, route safety, and final temple reaction

#### Stage 2

- Stage Name: Cross the troubled road
- Description: Manage weather, scouting, and hostile travel events on the approach.
- Check Type(s): exploration, survival, navigation, escort combat support
- Possible Outcomes:
  - Crit Fail: caravan scattered or key supplies lost
  - Fail: arrive late and fatigued, `fatigue +2`
  - Partial: arrive with some damage
  - Success: arrive in fighting shape
  - Crit Success: arrive early and unseen, gain `+2 advantage`
- Branching Effects:
  - changes relic-site alert and available recovery approaches

#### Stage 3

- Stage Name: Recover the relic
- Description: Enter the site, avoid traps or guardians, and secure the relic.
- Check Type(s): dungeon exploration, combat, ritual awareness, trap handling
- Possible Outcomes:
  - Crit Fail: relic damaged or bearer killed, hard failure
  - Fail: relic recovered in unstable condition, `sanctity -2`
  - Partial: relic recovered but with wounds or lost supplies
  - Success: relic secured
  - Crit Success: relic secured cleanly with bonus cache or lore
- Branching Effects:
  - affects purification stage and final reward tier

#### Stage 4

- Stage Name: Purify and present the relic
- Description: Perform the rite, calm witnesses, and prove the relic was handled correctly.
- Check Type(s): ritual skill, charisma, doctrine knowledge, healing or warding support
- Possible Outcomes:
  - Crit Fail: temple rejects the relic, degraded or failed completion
  - Fail: ritual succeeds poorly, reputation reduced
  - Partial: relic accepted, but no prestige reward
  - Success: relic accepted with proper honors
  - Crit Success: temple favor gained and future quest chain unlocked
- Branching Effects:
  - determines whether reward leans toward coin, favor, or religious standing

### 5. Failure States

- Hard failure if relic is destroyed or lost
- Hard failure if the caravan collapses below minimum survival threshold
- Degraded continuation if supplies, sanctity, or timing are damaged but the relic still reaches the temple

### 6. Success States

- Salvaged: relic returned, weak standing, low pay
- Standard: relic returned and accepted
- Strong: relic returned cleanly, caravan preserved, bonus faction standing
- Perfect: relic returned, rite completed flawlessly, unlocks future temple and merchant opportunities

### 7. Scaling Rules

- low-tier versions use a local shrine and short road
- mid-tier versions add rival claimants, hazardous terrain, or escort pressure
- high-tier versions add doctrinal disputes, multiple factions, or chained site events
- scale hybrid quests by adding more simultaneous pressure tracks rather than only inflating one DC

## Expansion Rules

Future quest families should be added by:

1. defining a new template shell
2. reusing existing check modules where possible
3. introducing only the minimum new state tracks required
4. mapping class, lineage, merchant, religious, and faction modifiers through adapters rather than rewriting the quest flow

That keeps the system expandable without turning every new quest family into a custom script.
