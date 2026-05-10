# Spellbook Expansion Blueprint

Status: Design-only blueprint (no runtime activation)
Last updated: 2026-05-10

## A. Sources and Boundary

This document adapts the approved spellbook expansion research into the repository design set. It is governed by [magic-system-charter.md](magic-system-charter.md), especially the classless casting model:

`known spell + equipped item/weapon casting tags + optional catalyst + character control capacity = final cast profile`

Current catalog baseline from `packages/content/base/player/spells.json`:

- 55 authored spells
- 3 `ready`
- 25 `partial`
- 27 `deferred`
- 7 spells with `compatibilityProfile`
- 55 spells with top-level `primaryFamily` metadata

This blueprint does not change runtime behavior. It does not edit `spells.json`, add spells, remove spells, rename spell ids, change costs, add schema fields, or activate magic acquisition, catalyst effects, affinities, skill gain, Legacy, account, preparation, payout, or UI behavior.

## B. Corrected Taxonomy

The long-term spellbook should use stacked axes instead of competing school buckets.

| Axis | Purpose | Values |
|---|---|---|
| Primary family | The power being shaped. Exactly one per spell. | `fire`, `water`, `air`, `earth`, `ice`, `lightning`, `divine/light`, `dark/shadow/void` |
| Functional tags | What the spell does. Additive and optional. | `healing`, `enhancing`, `enfeebling`, `control`, `warding`, `utility`, `ninjutsu`, `performance`, `summoning`, `enchantment`, `druidic` |
| Tradition | Source, worldview, and learning context. | `arcane`, `divine`, `druidic`, `performance`, `ninjutsu`, `dark` |
| Discipline | Specialized implementation track. | `summoning`, `enchantment` |
| Range profile | Practical reach. | touch, short, medium, long, aura, self, ally, ritual |
| Delivery profile | How it reaches or occupies space. | projectile, beam, line, cone, area, ward, imbue, ritual, self |
| Conduit profile | Equipment that shapes the cast. | dagger, sword, staff, wand, relic/holy symbol, instrument, shield/sigil board, bow/thrown, focus/crystal, herb pouch |
| Catalyst profile | Optional anchor, fuel, or amplifier. | none, trace, small, medium, large, bulk; family-specific material examples |
| Readiness tier | How safe it is to move toward authored metadata or runtime. | ready-candidate, partial/design-only, deferred-runtime |

Design rules:

- Pure direct damage spells may use only primary family plus range/delivery.
- Any spell that heals, wards, binds, drains, hastes, reveals, enchants, summons, or otherwise changes state should carry functional tags.
- Traditions guide learning and familiarity later. They are not classes.
- Disciplines remain narrower and more prerequisite-heavy than normal functions.
- Tags and compatibility metadata guide legality, stability, efficiency, pacing, and risk. Tags must not directly execute spell effects.

## C. Current 55 Remapping

This table maps the live catalog into the corrected taxonomy. It is a design projection only and does not imply current runtime support.

| Current spell | Live status | Corrected family | Functional tags | Overlay | Range / delivery | Later note |
|---|---|---|---|---|---|---|
| `spell.fire.elemental.firebolt` Firebolt | ready | fire | none | arcane | short/medium/long projectile | Keep as benchmark ready spell. |
| `spell.fire.enfeebling.burn` Burn | deferred | fire | enfeebling, control | arcane | short/medium projectile | Rename/refine later; defer DoT behavior. |
| `spell.fire.enhancing.ember_spikes` Ember Spikes | deferred | fire | warding, enhancing | arcane | self/aura reactive ward | Strong name; defer reactive damage behavior. |
| `spell.fire.healing.warmth` Warmth | deferred | fire | healing, utility | arcane | self/ally aura | Rename/refine later; keep as anti-cold support concept. |
| `spell.water.elemental.waterjet` Waterjet | partial | water | none | arcane | short/medium/long projectile | Promote/profile candidate. |
| `spell.water.enfeebling.drench` Drench | deferred | water | enfeebling, control | arcane | short/medium area/projectile | Rename later; defer soaked semantics. |
| `spell.water.enhancing.waterbreath` Waterbreath | deferred | water | enhancing, utility | arcane | self/ally utility | Keep deferred until environmental utility exists. |
| `spell.water.healing.mend` Mend | ready | water | healing | arcane | touch/short/medium ally | Keep as baseline water restoration. |
| `spell.air.elemental.windblade` Windblade | partial | air | none | arcane | short/medium projectile | Promote/profile candidate. |
| `spell.air.enfeebling.gust` Gust | partial | air | control | arcane | short/medium cone | Promote/profile candidate. |
| `spell.air.enhancing.haste` Haste | deferred | air | enhancing | arcane | ally short/medium | Defer until tempo semantics are stable. |
| `spell.air.healing.breath` Breath | deferred | air | healing, utility | arcane | self/ally | Rename/refine later around breath/endurance. |
| `spell.earth.elemental.stone_spike` Stone Spike | partial | earth | none | arcane | short/medium/long projectile | Promote/profile candidate. |
| `spell.earth.enfeebling.quicksand` Quicksand | deferred | earth | control | arcane | medium area | Keep concept; defer terrain/control runtime. |
| `spell.earth.enhancing.stone_skin` Stone Skin | partial | earth | warding | arcane | self/ally ward | Promote/profile candidate. |
| `spell.earth.healing.renew` Renew | deferred | earth | healing, druidic | arcane | self/ally | Rename/refine later as natural renewal. |
| `spell.lightning.elemental.spark` Spark | partial | lightning | none | arcane | short/medium/long projectile | Rename/refine later; promote/profile candidate. |
| `spell.lightning.enfeebling.shock` Shock | partial | lightning | control | arcane | short/medium projectile | Promote/profile interrupt identity. |
| `spell.lightning.enhancing.charge` Charge | deferred | lightning | enhancing | arcane | self/ally imbue | Redesign later as imbue or overcharge. |
| `spell.lightning.healing.surge` Surge | partial | lightning | healing, enhancing | arcane | touch/short ally | Promote/profile sharp stimulant heal. |
| `spell.ice.elemental.ice_shard` Ice Shard | partial | ice | none | arcane | short/medium/long projectile | Promote/profile candidate. |
| `spell.ice.enfeebling.freeze` Freeze | partial | ice | control | arcane | short/medium projectile | Promote/profile bind/slow candidate. |
| `spell.ice.enhancing.frostguard` Frostguard | partial | ice | warding | arcane | self/ally ward | Promote/profile defensive ice anchor. |
| `spell.ice.healing.preserve` Preserve | deferred | ice | healing, utility | arcane | self/ally | Rename/refine toward preservation fantasy. |
| `spell.light.elemental.radiance` Radiance | partial | divine/light | none | arcane/divine | short/medium/long projectile | Keep as offensive light anchor. |
| `spell.light.enfeebling.blind` Blind | deferred | divine/light | enfeebling, control | arcane/divine | short/medium/long projectile | Rename later; keep glare identity. |
| `spell.light.enhancing.bless` Bless | deferred | divine/light | enhancing | arcane/divine | ally/aura | Rename later; broad boon is too generic at scale. |
| `spell.light.healing.restore` Restore | ready | divine/light | healing | arcane/divine | touch/short/medium ally | Keep as direct restoration anchor. |
| `spell.shadow.elemental.void_bolt` Void Bolt | partial | dark/shadow/void | none | arcane/dark | short/medium/long projectile | Rename/refine later; reserve void for high-risk variants. |
| `spell.shadow.enfeebling.curse` Curse | partial | dark/shadow/void | enfeebling | arcane/dark | short/medium projectile | Keep concept; dark status semantics remain deferred. |
| `spell.shadow.enhancing.veil` Veil | deferred | dark/shadow/void | warding, utility | arcane/dark | self/aura | Keep as concealment/defense shroud. |
| `spell.shadow.healing.drain` Drain | partial | dark/shadow/void | enfeebling, healing | arcane/dark | short/medium projectile | Promote/profile sustain-through-damage seed. |
| `spell.druidic.control.root` Root | partial | earth | control, druidic | druidic | short/medium bind | Promote/profile deterministic bind. |
| `spell.druidic.control.vinebind` Vinebind | partial | earth | control, druidic | druidic | medium area bind | Promote/profile area bind. |
| `spell.druidic.utility.speak_plant` Speak Plant | deferred | earth | utility, druidic | druidic | ritual/self | Keep ritual utility deferred. |
| `spell.druidic.utility.speak_beast` Speak Beast | deferred | water | utility, druidic | druidic | ritual/self | Water is the cleaner animal-empathy fit; keep deferred. |
| `spell.druidic.healing.berry` Berry | partial | earth | healing, utility, druidic | druidic | self/ally utility | Rename/refine later; item-generation behavior remains blocked. |
| `spell.druidic.healing.bloom` Bloom | partial | water | healing, druidic | druidic | aura/area | Rename/refine later; regeneration semantics remain deferred. |
| `spell.druidic.enhancing.thornskin` Thornskin | deferred | earth | warding, druidic | druidic | self/aura ward | Strong name; defer reactive runtime. |
| `spell.ninjutsu.utility.shadowstep` Shadowstep | partial | dark/shadow/void | ninjutsu, utility | ninjutsu | self mobility | Promote/profile evasion and close-magic mobility. |
| `spell.ninjutsu.ranged.shuriken` Shuriken | partial | air | ninjutsu | ninjutsu | medium/long projectile | Promote/profile physical-ranged support lane. |
| `spell.ninjutsu.enfeebling.blind_powder` Blind Powder | deferred | dark/shadow/void | ninjutsu, enfeebling | ninjutsu | short cone | Keep as dark/stealth control overlay. |
| `spell.ninjutsu.utility.smoke` Smoke | deferred | dark/shadow/void | ninjutsu, utility | ninjutsu | self/aura area | Keep deferred until field/visibility behavior exists. |
| `spell.ninjutsu.enhancing.haze` Haze | deferred | dark/shadow/void | ninjutsu, utility | ninjutsu | self/aura | Reclass from enhancing to utility later. |
| `spell.ninjutsu.utility.mirror` Mirror | deferred | dark/shadow/void | ninjutsu, utility, warding | ninjutsu | self ward/illusion | Keep deferred until decoy/illusion behavior exists. |
| `spell.performance.enhancing.war_song` War Song | partial | lightning | performance, enhancing | performance | aura/cone | Strong name; early-profile candidate after performance support is bounded. |
| `spell.performance.enhancing.battle_rhythm` Battle Rhythm | partial | lightning | performance, enhancing | performance | aura | Promote/profile candidate. |
| `spell.performance.enhancing.guard_song` Guard Song | partial | earth | performance, warding | performance | aura | Strong grounded warding seed. |
| `spell.performance.enhancing.stone_dance` Stone Dance | partial | earth | performance, enhancing | performance | aura | Strong grounded stance seed. |
| `spell.performance.healing.regen_song` Regen Song | deferred | divine/light | performance, healing | performance/divine | aura | Keep deferred; resource-over-time semantics blocked. |
| `spell.performance.healing.mana_song` Mana Song | deferred | lightning | performance, utility | performance | aura | Reclass away from HP healing; defer resource semantics. |
| `spell.performance.utility.march` March | deferred | air | performance, enhancing | performance | aura | Rename/refine later; movement cadence stays deferred. |
| `spell.performance.enhancing.grace` Grace | deferred | divine/light | performance, enhancing | performance/divine | aura | Rename/refine later; evasion support deferred. |
| `spell.performance.enfeebling.dirge` Dirge | deferred | dark/shadow/void | performance, enfeebling | performance/dark | aura | Strong name; keep as dark performance seed. |
| `spell.performance.enfeebling.discord` Discord | deferred | dark/shadow/void | performance, control | performance/dark | aura | Strong name; keep as dark performance control seed. |

## D. Rename and Reclassification Recommendations

Keep the current catalog. Do not discard it. Later passes should reclassify records into the eight-family model, add compatibility metadata where safe, and rename only when a dedicated content migration is approved.

Rename/refine later:

- Burn, Warmth, Drench, Breath, Renew, Spark, Preserve, Blind, Bless, Void Bolt, Berry, Bloom, March, Grace.
- Prefer concrete names like material plus form, action plus image, sacral/ritual plus function, or tradition-flavored terms.
- Preserve stronger current names such as Ember Spikes, Stone Skin, Frostguard, Radiance, Shadowstep, Blind Powder, War Song, Battle Rhythm, Guard Song, Stone Dance, Thornskin, Dirge, and Discord.

Reclassify later:

- Promote warding from implicit defensive behavior into an explicit function for Stone Skin, Frostguard, Guard Song, Thornskin, Veil, and future ward records.
- Treat performance and ninjutsu as overlays/traditions, not primary power families.
- Treat summoning and enchantment as specialized disciplines, usually deferred until their owner systems exist.
- Use shadow for mainstream dark spells and reserve void terminology for rarer high-risk concepts.

## E. Long-Term Catalog Target

The approved direction is intentionally larger than a first tranche:

- Long-term catalog target: 240-320 spell concepts.
- Core learnable/combat-relevant target: 160-220 spell concepts.
- Deferred advanced target: 80-120 spell concepts.
- Reference shape: 256 spell concepts, 32 per primary family.

The first twenty concepts in each family are the reference core shape. The final twelve in each family lean toward advanced, ritual, summoning, enchantment, persistent-zone, or high-complexity behavior. This is a design catalog, not an implementation order.

## F. Implementation Batches

| Batch | Scope | Intent | Safe content profile |
|---|---|---|---|
| Alpha | Metadata-safe current partials | Expand honest profile coverage and ready-candidate set | Existing deterministic damage, healing, bind, interrupt, protection |
| Embersteel | Magic melee seed spells | Make dagger/sword conduits matter | Touch, short arcs, brands, close cones |
| Bastion | Protect, shell, stoneskin suite | Fill shield-tank and support gaps | Wards, mitigation, shells, lane defense |
| Weight and Veil | Enfeeble/control suite | Fill control/enfeeble and evasion-tank profiles | Slow, bind, burden, blind, silence, gravity-adjacent control |
| Horizon | Beams, lines, long-range variety | Differentiate ranged casters | Lances, beams, artillery, sniper bolts |
| Dawn and Night | Divine and dark seeds | Open light/dark breadth | Light warding, flash, cleanse, drain, veil, grave bind |
| Bound Names | Summoning and enchantment docs only | Capture deferred design clearly | No runtime, no content activation |

### Prioritized First Tranche

The first tranche is the near-term design candidate set only. It does not authorize new spell records in this pass.

| Spell | Family | Why it belongs | Readiness | Notes |
|---|---|---|---|---|
| Waterjet | water | Clean deterministic ranged pressure | P | Promote/profile current spell |
| Windblade | air | Baseline air offense | P | Promote/profile current spell |
| Gust | air | Early control and evasion-tank seed | P | Promote/profile current spell |
| Stone Spike | earth | Baseline earth offense | P | Promote/profile current spell |
| Stone Skin | earth | Core warding seed | P | Promote/profile current spell |
| Spark | lightning | Baseline lightning offense | P | Promote/profile current spell |
| Shock | lightning | Early interrupt identity | P | Promote/profile current spell |
| Surge | lightning | Non-divine sharp heal identity | P | Promote/profile current spell |
| Ice Shard | ice | Baseline ice offense | P | Promote/profile current spell |
| Freeze | ice | Classic bind/slow seed | P | Promote/profile current spell |
| Frostguard | ice | Defensive ice anchor | P | Promote/profile current spell |
| Radiance | divine/light | Offensive light anchor | P | Promote/profile current spell |
| Void Bolt | dark/shadow/void | Offensive dark anchor | P | Promote/profile current spell |
| Drain | dark/shadow/void | Sustain-through-damage seed | P | Promote/profile current spell |
| Root | earth | Deterministic bind reference | P | Promote/profile current spell |
| Vinebind | earth | Area bind reference | P | Promote/profile current spell |
| Shadowstep | dark/shadow/void | Evasion-tank and magic-melee mobility | P | Promote/profile current spell |
| Shuriken | air | Physical-ranged support lane | P | Promote/profile current spell |
| Ash Lance | fire | Long-range non-bolt fire variety | P | New blueprint concept |
| Scorch Arc | fire | Magic-melee fire seed | P | New blueprint concept |
| Hearthbrand | fire | Physical/melee hybrid support | P | New blueprint concept |
| Blazeward | fire | Fire tank/support seed | P | New blueprint concept |
| Flowguard | water | First clean water ward | P | New blueprint concept |
| Tidebind | water | Water control that is not pure healing | P | New blueprint concept |
| Gale Knife | air | Dagger/sword air melee identity | P | New blueprint concept |
| Draft Ward | air | Evasion-defense seed without invisibility | P | New blueprint concept |
| Clay Ward | earth | Honest ward-lane anchor | P | New blueprint concept |
| Ironroot Brand | earth | Physical-melee earth hybrid support | P | New blueprint concept |
| Whiteglass Beam | ice | First precision ice beam | P | New blueprint concept |
| Permafrost Ward | ice | Clear ward delivery for ice | P | New blueprint concept |
| Thunderline | lightning | Ranged line-caster differentiation | P | New blueprint concept |
| Stormbrand | lightning | Lightning imbue for physical and magic attacks | P | New blueprint concept |
| Sanctuary Ward | divine/light | First explicit light ward circle | P | New blueprint concept |
| Shellfield | divine/light | Shell-like protection seed | P | New blueprint concept |
| Night Lash | dark/shadow/void | Magic-melee dark seed | P | New blueprint concept |
| Grave Bind | dark/shadow/void | Dark control suite opener | P | New blueprint concept |

## G. Do-Not-Implement Boundaries

Do not implement any of the following from this blueprint in the current pass:

- Runtime spell execution expansion
- Any edits to `packages/content/base/player/spells.json`
- Spell additions, removals, id renames, display-name renames, or cost changes
- JSON, schema, validator, or compatibility metadata changes
- Acquisition, teachers, tomes, scrolls, documents, rituals, summoning runtime, enchantment runtime
- Catalyst runtime effects, affinity/resistance matrices, terrain/weather spell effects
- Magic skill gain, direct skill-rank grants, or Legacy magic power
- Account, preparation, payout, UI, or save behavior
- Generic tag-driven effect execution
- Prepared spell slots as the core limiter
- Class or job gates for magic access

## Appendix A. Long-Term 256-Concept Reference Profile

Legend:

- Function abbreviations: Heal, Enh, Enf, Ctrl, Ward, Util, Nin, Perf, Sum, Ench, Dru.
- Readiness: R = ready-candidate, P = partial/design-only, D = deferred-runtime.
- Relation: Ex = existing, Comp = complements existing, Ren = rename/refine existing, New = new blueprint concept.
- Only the first tranche in Section F is near-term. Every other concept here is blueprint-only until a later approved slice.

### Fire

| # | Concept | Function | Readiness | Relation |
|---:|---|---|---|---|
| 1 | Firebolt | none | R | Ex |
| 2 | Cinder Dart | none | P | Comp Firebolt |
| 3 | Ash Lance | none | P | New |
| 4 | Ember Spikes | Ward | D | Ex |
| 5 | Burn | Enf | D | Ren Burn |
| 6 | Scorch Arc | none | P | New |
| 7 | Hearthbrand | Enh | P | New |
| 8 | Blazeward | Ward | P | New |
| 9 | Warmth | Heal, Util | D | Ren Warmth |
| 10 | Kilnheart | Enh | P | New |
| 11 | Cautery Touch | Heal | P | New |
| 12 | Banner of Embers | Perf, Enh | P | New |
| 13 | Fervor Brand | Enh, Enf | D | New |
| 14 | Searing Rebuke | Ward, Ctrl | P | New |
| 15 | Coalstep | Util | P | New |
| 16 | Flamewake | Ctrl | D | New |
| 17 | Foxfire Veil | Util, Enf | D | New |
| 18 | Ashen Grasp | Ctrl | P | New |
| 19 | Wildfire Rain | none | D | New |
| 20 | Beacon Pyre | Ward, Util | P | New |
| 21 | Char Mark | Enf | P | New |
| 22 | Furnace Chain | Ctrl | D | New |
| 23 | Red Meridian | none | P | New |
| 24 | Hearth Oath | Enh, Ward | P | New |
| 25 | Siegeflame | none | D | New |
| 26 | Pyreglass | Util, Ench | D | New |
| 27 | Smolder March | Perf, Enh | D | Comp Battle Rhythm |
| 28 | Furnace Crown | Enh | D | New |
| 29 | Salamander Pact | Sum | D | New |
| 30 | Firebind Sigil | Ench, Ward | D | New |
| 31 | Crown of Cinders | Util | D | New |
| 32 | Sunforge Temper | Ench, Enh | D | New |

### Water

| # | Concept | Function | Readiness | Relation |
|---:|---|---|---|---|
| 1 | Waterjet | none | P | Ex |
| 2 | River Lash | none | P | New |
| 3 | Mist Needle | none | P | New |
| 4 | Tidal Spear | none | P | New |
| 5 | Drench | Enf | D | Ren Drench |
| 6 | Mend | Heal | R | Ex |
| 7 | Clearcurrent | Util, Heal | P | New |
| 8 | Flowguard | Ward | P | New |
| 9 | Soothing Stream | Heal | P | New |
| 10 | Undertow | Ctrl | P | New |
| 11 | Wash Away | Util, Enf | D | New |
| 12 | Raincall | Heal | D | New |
| 13 | Harbor Ward | Ward | P | New |
| 14 | Tidebind | Ctrl | P | New |
| 15 | Brine Lash | Enf | P | New |
| 16 | Pearl Shelter | Ward, Enh | P | New |
| 17 | Waterbreath | Util | D | Ex |
| 18 | Bloom | Heal, Dru | D | Ex |
| 19 | Ebbstep | Util | P | New |
| 20 | Deluge Line | none | P | New |
| 21 | Mercy Tide | Heal | P | New |
| 22 | Cold Spring | Heal, Util | D | New |
| 23 | Salt Aegis | Ward, Enf | P | New |
| 24 | Mirror Pool | Util | D | New |
| 25 | Speak Beast | Util, Dru | D | Ex |
| 26 | Reed Whisper | Util, Dru | D | New |
| 27 | Shoal Mark | Enf | P | New |
| 28 | Undertow Brand | Enh | P | New |
| 29 | High Tide Rite | Heal, Ward | D | New |
| 30 | Deep Warden Pact | Sum | D | New |
| 31 | Wellbound Sigil | Ench, Ward | D | New |
| 32 | Floodplain Charter | Ench, Util | D | New |

### Air

| # | Concept | Function | Readiness | Relation |
|---:|---|---|---|---|
| 1 | Windblade | none | P | Ex |
| 2 | Gust | Ctrl | P | Ex |
| 3 | Haste | Enh | D | Ex |
| 4 | Breath | Heal, Util | D | Ren Breath |
| 5 | Gale Knife | none | P | New |
| 6 | Sky Lash | none | P | New |
| 7 | Sirocco Arc | none | P | New |
| 8 | Wingstep | Util | P | New |
| 9 | Draft Ward | Ward | P | New |
| 10 | Larkspeed | Perf, Enh | P | New |
| 11 | Needle Gale | none | P | New |
| 12 | Howling Line | Ctrl | P | New |
| 13 | Cloudveil | Util | P | New |
| 14 | Updraft | Ctrl | P | New |
| 15 | Crosswind Mark | Enf | P | New |
| 16 | Arrowguide | Enh | P | New |
| 17 | Tempest Rhythm | Perf, Enh | P | New |
| 18 | March | Perf, Enh | D | Ex |
| 19 | Shuriken | Nin | P | Ex |
| 20 | Featherfall | Util | P | New |
| 21 | Walker's Tailwind | Enh | P | New |
| 22 | Pressure Knot | Ctrl | D | New |
| 23 | Roaring Gate | Ward, Ctrl | D | New |
| 24 | Gale Cage | Ctrl | D | New |
| 25 | Stormpath | Util | D | New |
| 26 | Whispering Reach | Util | D | New |
| 27 | Dust Spiral | Enf | D | New |
| 28 | Hunter's Current | Enh | P | New |
| 29 | Mistral Halo | Ward, Perf | D | New |
| 30 | Skyglass Rite | Util | D | New |
| 31 | Roc Pact | Sum | D | New |
| 32 | Galebind Sigil | Ench, Ctrl | D | New |

### Earth

| # | Concept | Function | Readiness | Relation |
|---:|---|---|---|---|
| 1 | Stone Spike | none | P | Ex |
| 2 | Quicksand | Ctrl | D | Ex |
| 3 | Stone Skin | Ward | P | Ex |
| 4 | Renew | Heal, Dru | D | Ren Renew |
| 5 | Root | Ctrl, Dru | P | Ex |
| 6 | Vinebind | Ctrl, Dru | P | Ex |
| 7 | Speak Plant | Util, Dru | D | Ex |
| 8 | Berry | Util, Dru | D | Ex |
| 9 | Thornskin | Ward, Dru | D | Ex |
| 10 | Stone Dance | Perf, Enh | P | Ex |
| 11 | Guard Song | Perf, Ward | P | Ex |
| 12 | Clay Ward | Ward | P | New |
| 13 | Gravel Lash | none | P | New |
| 14 | Basalt Arc | none | P | New |
| 15 | Ironroot Brand | Enh | P | New |
| 16 | Earthen Bulwark | Ward | P | New |
| 17 | Mudsnare | Ctrl | P | New |
| 18 | Weight of Hills | Enf, Ctrl | P | New |
| 19 | Cairn Grip | Ctrl | P | New |
| 20 | Loam Step | Util | P | New |
| 21 | Bastion Seed | Ward, Dru | P | New |
| 22 | Burrow Ward | Util, Ward | D | New |
| 23 | Fallow Rest | Heal, Dru | D | New |
| 24 | Terrace Wall | Ward | D | New |
| 25 | Shale Lance | none | P | New |
| 26 | Dustblind | Enf | D | New |
| 27 | Cragline | none | D | New |
| 28 | Passage Rampart | Ward, Util | D | New |
| 29 | Granite Omen | Util | D | New |
| 30 | Earthmother's Hand | Heal, Ward, Dru | D | New |
| 31 | Golem Pact | Sum | D | New |
| 32 | Rune of Masonry | Ench, Ward | D | New |

### Ice

| # | Concept | Function | Readiness | Relation |
|---:|---|---|---|---|
| 1 | Ice Shard | none | P | Ex |
| 2 | Freeze | Ctrl | P | Ex |
| 3 | Frostguard | Ward | P | Ex |
| 4 | Preserve | Heal, Util | D | Ren Preserve |
| 5 | Hoarfang | none | P | New |
| 6 | Rime Lance | none | P | New |
| 7 | Whiteglass Beam | none | P | New |
| 8 | Sleet Fan | Ctrl | P | New |
| 9 | Brittle Brand | Enh, Enf | P | New |
| 10 | Crystal Skin | Ward | P | New |
| 11 | Cold Snap | Ctrl | P | New |
| 12 | Frostbind | Ctrl | P | New |
| 13 | Hush of Snow | Util | P | New |
| 14 | Mirror Frost | Ward, Util | D | New |
| 15 | Permafrost Ward | Ward | P | New |
| 16 | Rime Step | Util | P | New |
| 17 | Shardline | none | P | New |
| 18 | Snowveil | Util, Enf | D | New |
| 19 | Blue Quiet | Ctrl, Enf | D | New |
| 20 | Glacial Mercy | Heal, Ward | D | New |
| 21 | Coffin of Rime | Ctrl | D | New |
| 22 | Hailburst | none | P | New |
| 23 | Icebridge Rite | Util | D | New |
| 24 | Winterkeep | Ward | P | New |
| 25 | Chillmark | Enf | P | New |
| 26 | Hoarcloak | Ward, Util | D | New |
| 27 | Crescent Rime | none | P | New |
| 28 | Glassgarden | Ench, Ward | D | New |
| 29 | Frost Lantern | Util | D | New |
| 30 | Snowbound Circle | Util, Heal | D | New |
| 31 | Rimebound Pact | Sum | D | New |
| 32 | Sigil of Preservation | Ench, Heal | D | New |

### Lightning

| # | Concept | Function | Readiness | Relation |
|---:|---|---|---|---|
| 1 | Spark | none | P | Ren Spark |
| 2 | Shock | Ctrl | P | Ex |
| 3 | Charge | Enh | D | Ex |
| 4 | Surge | Heal, Enh | P | Ex |
| 5 | Battle Rhythm | Perf, Enh | P | Ex |
| 6 | War Song | Perf, Enh | D | Ex |
| 7 | Stormbrand | Enh | P | New |
| 8 | Volt Lash | none | P | New |
| 9 | Thunderline | none | P | New |
| 10 | Nerve Jolt | Enf, Ctrl | P | New |
| 11 | Crackling Ward | Ward | P | New |
| 12 | Stormcall | none | D | New |
| 13 | Galvanic Mark | Enf | P | New |
| 14 | Arc Beam | none | P | New |
| 15 | Forked Bolt | none | P | New |
| 16 | Living Wire | Ctrl | P | New |
| 17 | Tempest Guard | Ward, Enh | P | New |
| 18 | Mana Song | Perf, Util | D | Ex |
| 19 | Static Cage | Ctrl | D | New |
| 20 | Overload Brand | Enh | D | New |
| 21 | Needleflash | Enf | P | New |
| 22 | Stormwake | none | P | New |
| 23 | Far Spark | none | P | New |
| 24 | Breaker Sigil | Ench, Ctrl | D | New |
| 25 | Chain Lash | none | D | New |
| 26 | Pulse Shelter | Ward, Enh | P | New |
| 27 | Thundershroud | Util, Enf | D | New |
| 28 | Pulse March | Perf, Enh | P | New |
| 29 | Thunderhead Rite | Util | D | New |
| 30 | Stormherald Pact | Sum | D | New |
| 31 | Sigil of Conduction | Ench, Enh | D | New |
| 32 | Crown of Stormglass | Enh | D | New |

### Divine / Light

| # | Concept | Function | Readiness | Relation |
|---:|---|---|---|---|
| 1 | Radiance | none | P | Ex |
| 2 | Blind | Enf | D | Ren Blind |
| 3 | Bless | Enh | D | Ren Bless |
| 4 | Restore | Heal | R | Ex |
| 5 | Grace | Perf, Enh | D | Ren Grace |
| 6 | Regen Song | Perf, Heal | D | Ex |
| 7 | Lantern Brand | Enh | P | New |
| 8 | Flashprayer | Enf, Ctrl | P | New |
| 9 | Sanctuary Ward | Ward | P | New |
| 10 | Shellfield | Ward | P | New |
| 11 | Mercy Touch | Heal | P | New |
| 12 | Halo Lance | none | P | New |
| 13 | Dawnbeam | none | P | New |
| 14 | Lustral Shield | Ward, Heal | P | New |
| 15 | Purge Mark | Util, Heal | P | New |
| 16 | Absolve | Heal, Util | D | New |
| 17 | Prayer of Shelter | Ward, Enh | P | New |
| 18 | Witness Light | Util | P | New |
| 19 | Sunwall | Ward | P | New |
| 20 | Censer Step | Util, Perf | P | New |
| 21 | Choir of Mercy | Perf, Heal | D | New |
| 22 | Daystar Judgment | none | D | New |
| 23 | Revelation Knot | Ctrl | D | New |
| 24 | Pillar of Dawn | Ward, Ctrl | D | New |
| 25 | Sacred Mirror | Ward, Util | D | New |
| 26 | Pilgrim's Halo | Enh, Util | D | New |
| 27 | Oathflare | Enh | P | New |
| 28 | Crown of Noon | Enh | D | New |
| 29 | Herald Pact | Sum | D | New |
| 30 | Sigil of Consecration | Ench, Ward | D | New |
| 31 | Litany of Shells | Perf, Ward | D | New |
| 32 | Temple Sun Rite | Util, Heal | D | New |

### Dark / Shadow / Void

| # | Concept | Function | Readiness | Relation |
|---:|---|---|---|---|
| 1 | Void Bolt | none | P | Ren Void Bolt |
| 2 | Curse | Enf | D | Ex |
| 3 | Veil | Ward, Util | D | Ex |
| 4 | Drain | Enf, Heal | P | Ex |
| 5 | Shadowstep | Nin, Util | P | Ex |
| 6 | Blind Powder | Nin, Enf | D | Ex |
| 7 | Smoke | Nin, Util | D | Ex |
| 8 | Haze | Nin, Util | D | Ex |
| 9 | Mirror | Nin, Util, Ward | D | Ex |
| 10 | Dirge | Perf, Enf | D | Ex |
| 11 | Discord | Perf, Ctrl | D | Ex |
| 12 | Night Lash | none | P | New |
| 13 | Grave Bind | Ctrl | P | New |
| 14 | Sable Mark | Enf | P | New |
| 15 | Dread Whisper | Enf, Ctrl | D | New |
| 16 | Eclipse Ward | Ward | P | New |
| 17 | Grasp of Hollow | Ctrl | P | New |
| 18 | Siphon Thread | Enf, Heal | P | New |
| 19 | Nightbrand | Enh | D | New |
| 20 | Graveseam | Ctrl | P | New |
| 21 | Umbral Beam | none | P | New |
| 22 | Rotbloom | Enf, Dru | D | New |
| 23 | Black Quiet | Ctrl, Enf | D | New |
| 24 | Raven Step | Util | P | New |
| 25 | Silencing Shade | Enf, Ctrl | D | New |
| 26 | Fear Lantern | Enf | D | New |
| 27 | Gloam Arrow | Nin, Enf | P | New |
| 28 | Hollow Shell | Ward | P | New |
| 29 | Abyss Knot | Ctrl | D | New |
| 30 | Moonless Rite | Util, Enf | D | New |
| 31 | Wraith Pact | Sum | D | New |
| 32 | Sigil of Unmaking | Ench, Ctrl | D | New |
