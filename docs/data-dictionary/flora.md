# Flora

The flora database now uses a full entry template so each species can drive harvesting, lifecycle simulation, cultivation, and ecology systems without hardcoded rules.

## Entry Shape

- identity: `id`, `slug`, `name`, `type`
- harvest: harvestable parts, active/passive availability, passive and active harvest rules, tools, triggers, active output, passive output
- lifecycle: lifecycle type, applicable stages, and stage-by-stage mortality/transition/duration tuning
- agronomy: planting windows, companion/antagonistic crops, rotation effects, harvest windows, growth and shed seasons
- domestication: cultivable state, domestic variant linkage, yield modifier, difficulty profile, mediation controls, infrastructure requirements
- ecology: climate range, water/light needs, biome prevalence links, and soil-type profile

## Canonical Enums

- type: `tree`, `shrub`, `herb`, `grass`, `fungi`
- lifecycle: `annual`, `biennial`, `perennial`
- lifecycle stages: `germination`, `vegetative`, `flowering`, `fruiting`, `dormancy`

## Slug Guidance

- use lowercase snake case for `slug` (example: `blackberry`)
- keep canonical names generic and gameplay oriented
- avoid region-qualified naming in canonical records
