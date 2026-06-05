# Main Menu Theme Asset Source Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future main-menu visual asset work; no source, asset, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Prepare a source map for future main menu light/dark mode themed asset work, including unused theme assets and current character-creation visual references, without creating, editing, or moving image assets.

This document is a planning source. It does not authorize asset generation or UI implementation.

## Core Boundary Rule

Asset references are not implementation.

Theme folders, unused assets, current character-creation imagery, screenshots, palette notes, and layout concepts may guide future asset generation, but they must not alter the main menu, character creation page, asset imports, generated output, or runtime UI behavior until explicitly scoped.

## Future Source Areas To Inspect

A future Codex or local asset pass should inspect:

- unused assets/theme folders
- current character creation page assets
- current launcher/main menu components
- shared app shell layout
- light/dark mode theme tokens
- CSS variables and surface/background tokens
- asset import paths
- current public/static asset directories
- image dimensions and aspect-ratio requirements

## Main Menu Asset Categories

Future main menu population can be planned as individual reusable assets.

| Asset category | Use | Notes |
| --- | --- | --- |
| background plate | main menu backdrop | provide light and dark variants |
| title crest | game identity/logo support | should scale cleanly |
| menu frame | container around menu buttons | should support readable contrast |
| button ornament | hover/active/accent decoration | avoid text baked into images |
| divider ornament | separates menu groups | reusable across light/dark variants |
| corner flourish | frame/corner detail | proportional variants useful |
| ambient prop | candles, banners, map table, parchment, stone, vines, etc. | decorative only |
| character silhouette | atmospheric figure or lineage motif | should not imply specific playable identity |
| map fragment | subtle regional/world reference | display-only; not gameplay map authority |
| emblem set | small faction/lineage/knowledge/magic motifs | avoid implying unlocked systems |

## Light/Dark Mode Pairing Rules

Future generated assets should be paired where practical.

| Concern | Light mode | Dark mode |
| --- | --- | --- |
| background value | parchment, pale stone, mist, daylight map tones | charcoal, deep blue, night stone, ember-lit tones |
| ornament contrast | darker ink/bronze/wood lines | lighter silver/gold/ember edge lines |
| glow | minimal or warm daylight | controlled ember/moon/magic glow |
| readability | avoid bright busy center behind text | avoid low-contrast dark-on-dark UI zones |
| saturation | restrained | restrained with selective accent highlights |

## Proportional Asset Guidance

Future assets should be generated/exported as separate layers rather than one flattened menu image.

Recommended groups:

- full-width background: 16:9 and ultrawide-safe crop
- centered title crest: transparent PNG/WebP/SVG if possible
- menu frame: scalable or 9-slice-friendly
- button ornaments: left/right/end-cap pairs
- dividers: horizontal reusable strips
- corner flourishes: four corners or rotatable single source
- ambient props: transparent foreground/midground elements
- theme motifs: small icons/emblems

## Asset Boundary Rules

- Do not bake live button text into images.
- Do not bake route/state/account/character data into images.
- Do not make assets depend on save/session state.
- Do not use gameplay map assets as authority for travel or settlement state.
- Do not imply systems are unlocked through decoration.
- Do not replace character creation page assets during main-menu planning.
- Do not move unused assets until an asset inventory confirms references.

## Future Validation Questions

Before implementing assets, answer:

1. Which current main menu/component owns the layout?
2. Which assets are currently imported and used?
3. Which unused theme assets are safe inspiration only?
4. What output dimensions are needed for desktop/tablet/mobile?
5. What contrast targets apply to menu text and controls?
6. Which files need light and dark variants?
7. Which assets should be transparent layers?
8. Which assets can be CSS/SVG instead of raster images?
9. Which assets must be excluded from generated output?
10. What tests or screenshots confirm no character creation regression?

## Recommended Future Pass Order

Recommended sequence for this area:

1. `Main Menu Asset Inventory`
   - inspect current asset folders, unused theme folder, and character creation visual references
   - read-only/docs-first
2. `Main Menu Theme Direction Plan`
   - define light/dark visual direction and required asset list
   - planning only
3. `Main Menu Asset Generation Prompt Pack`
   - create prompts for individual proportional assets
   - no implementation
4. `Main Menu Asset Import Plan`
   - decide file paths, naming, compression, and references
   - planning only
5. `Main Menu Read-Only Visual Integration`
   - UI-only, no runtime/gameplay changes
6. `Main Menu Screenshot/Contrast Validation`
   - confirm light/dark readability and no character creation regressions

## Forbidden Until Explicitly Scoped

Do not add or change:

- image assets
- asset paths/imports
- React components
- CSS/theme tokens
- generated output
- character creation assets
- routing/menu command behavior
- save/account/session behavior
- gameplay state

## Recommended Next Connector Work

Optional connector-only follow-up:

- `Content Generation Boundary Map`

Rationale: future settlement, knowledge, item, map, and menu content work should share clear boundaries for generated vs authored content before bulk creation begins.

## Recommended Future Codex Work

Do not schedule main-menu asset work ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Main Menu Asset Inventory`

It should remain read-only/docs-only and should not alter assets, React, CSS, generated output, routing, or character creation behavior.
