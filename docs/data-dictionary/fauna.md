# Fauna

The fauna database now follows a full entry template so each species carries simulation-ready data, not just identity tags.

## Entry Shape

- identity: `id`, `slug`, `name`, `aliases`, `type`, `diet`, `dangerClass`, `domesticatable`, `sizeClass`, `mountable`, and behavior profile
- domestication: infrastructure requirements, yield bonuses, and population controls
- infrastructure modifiers: hydration, climate protection, feed diversity, nutrition, juvenile survival, fertility modifier
- reproduction: annual ratio, breeding seasons, reproduction type, gestation/incubation timing, fertility age, offspring stats, effective recruitment
- ecology: biome preferences (linked to habitat IDs), territory movement, climate range, water dependency, depth requirement, hydration need
- lifecycle: lifecycle type and applicable stages
- output: passive output windows and slaughter-age bands, with optional product key references
- activity: hibernation period and active-time profile
- food chain: prey/scavenger/predator/apex behavior and target classes

## Output Product References

When present, fauna output product keys should reference canonical economy item keys.

- `template.output.passiveOutput.products`
- `template.output.slaughterOutput.products`

Allowed groups inside `products`:

- `items`
- `materials`
- `ingredients`
- `byproducts`

Use species-specific keys instead of generic outputs (for example, `bison_meat` instead of `meat`).

Example keys:

- `bison_milk`
- `sheep_wool`
- `deer_hide`
- `wolf_fur`
- `chicken_egg`

## Canonical Enums

- type: `mammal`, `reptile`, `avian`, `fish`, `amphibian`, `arthropod`, `mollusk`
- diet: `herbivore`, `omnivore`, `carnivore`
- danger class: `none`, `low`, `medium`, `high`
- size class: `small`, `medium`, `large`, `colossal`

## Slug Guidance

- use generic canonical names for the `slug` (`bison`, `deer`, `wolf`)
- optional `aliases` can store common alternate names (`Buffalo`)
- avoid region-qualified naming in canonical records

