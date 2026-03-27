# Elemental Combat And Enchanting

This note describes the current design direction established in the content pass that introduced elemental vessels, enchanter foundations, magical metals, expanded gemstones, and attunement-aware monster additions.

## Canonical Combat Elements

- Fire
- Water
- Earth
- Wind
- Thunder
- Ice
- Light
- Darkness

Repository compatibility note:

- world-facing religious and crystal content previously used `stone` as the earth-aligned label
- combat-facing logic should treat `stone` as the legacy world alias for `earth`
- current crystal records preserve their existing `stone_*` ids but map them to `affinityKey = earth`

## Combat Resolution Order

Combat-facing elemental resolution currently assumes this order:

1. base damage
2. elemental bonus damage
3. elemental affinity matchup
4. saturation or same-element response
5. status eligibility
6. status potency and duration
7. resistance and mitigation

## Elemental Status Direction

- Fire: burn, ignition, damage-over-time, flammable spread, temporary offense disruption
- Water: soaked, burn suppression, thunder conductivity, fire dampening
- Earth: stagger, sunder, armor strain, posture pressure, structure damage
- Wind: destabilize, displacement, accuracy disruption, mobility pressure
- Thunder: daze, stun, interrupts, conductive arc pressure
- Ice: chill, freeze buildup, slow, brittleness
- Light: blind, purge, anti-undead pressure, anti-corruption pressure
- Darkness: weaken, fear, healing suppression, obscuration, morale pressure

## Same-Element And Opposed-Element Logic

- High-affinity same-element targets can resist, nullify, or convert matching damage into empowerment.
- Same-element resistance does not automatically grant all status immunities; those remain authored per element or creature line.
- Light and darkness are mutually dangerous offensively, but wards and prepared defenses can suppress that advantage.
- Constitution and vitality should reduce status application, status duration, and damage-over-time severity where appropriate.

## Enchanter Foundation

Enchanters are treated as affinity-bound artisans rather than universal casters.

- Most practitioners should have one affinity.
- Two affinities are uncommon.
- Three are rare.
- Four or more should remain exceptional.
- Opposed affinities are possible, but they require suppression work and should cost efficiency and stability.

Current role split:

- vessel attuner
- focus setter
- ward binder
- weapon imprinter

## Vessel Economy

The crystal catalog now distinguishes between fixed-affinity vessels and unattuned vessels.

- `elemental_*` records are unattuned vessels
- element-specific vessels are fixed
- all vessel tiers can support temporary channeling and bounded infrastructure use
- permanent enchanting consumes the bound vessel
- permanent enchanting must not return a reusable crystal

This is the current protection against infinite crystal loops.

## Materials And Jewelry

The material model now assumes two separate magical properties:

- conductivity: how well a material accepts and carries an active enchantment
- retention: how well it holds a stable enchantment over time

Current direction:

- iron and steel are poor magical media
- copper and high steel are slight conductors
- silver and gold are reliable moderate conductors and retainers
- mithrite, orichalcum, platinum, and adamantite are premium arcane materials

Jewelry expansion now starts from four layers:

1. raw gemstone extraction
2. cut gemstone lapidary work
3. component fabrication
   - settings
   - links
   - chains
   - hooks
   - bands
4. finished accessories
   - rings
   - necklaces
   - bracelets
   - earrings
   - focus and relic pieces

## Monster Ecology And City Appearance

Monster appearance should remain ecology-driven.

- burrowers need real tunnel, cellar, sewer, quarry, or wall-breach access
- aquatic monsters need open water access
- fliers can bypass walls if airspace is not meaningfully secured
- elementals should require a terrain source, magical breach, convergence site, or similar affinity pressure

Secure cities should not casually spawn monsters internally without a credible path.

## Current Scope Boundary

This pass establishes the content foundation and economy hooks.

Still deferred:

- full combat runtime consumers for elemental damage and statuses
- workplace and production-chain automation for lapidary and enchanter crafting
- full codex-side merged fauna/monster presentation
