# Fauna

Core fields:

- identity: `id`, `slug`, `name`, optional `aliases`, taxonomic `type`
- behavior: diet, temperament, territoriality, danger class
- domestication: domesticatable flag, infrastructure modifiers
- ecology links: habitat references and climate tolerances

Slug guidance:

- use generic canonical names for the `slug` (`bison`, `deer`, `wolf`)
- optional `aliases` can store common alternate names (`Buffalo`)
- avoid region-qualified naming in canonical records