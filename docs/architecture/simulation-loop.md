# Simulation Loop (Headless First)

The canonical tick order is:

1. `world-engine`
2. `civilization-engine`
3. `player-engine`
4. `game-engine` global event consolidation

## Why this order

- World systems (weather, ecology, regeneration) establish constraints and opportunities.
- Civilization systems consume world outputs and update production/market state.
- Player systems resolve against the newest world + civilization state.
- Global event logic runs last to generate consistent post-tick events.

## Clock model

The project uses a hierarchical clock:

- subday ticks
- days
- months
- seasons (`Winter`, `Thaw`, `Spring`, `Summer`, `Harvest`, `Withering`)
- years

This supports farming windows, weather shifts, and economy cadence without full simulation overkill.