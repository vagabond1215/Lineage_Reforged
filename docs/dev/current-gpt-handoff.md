# Current GPT Handoff

Source version/run: `Version 0.6.4 - World And Settlement Static Content Expansion`
Date: 2026-07-14

## Status

Latest completed primary:

- `Version 0.6.4 - World And Settlement Static Content Expansion`

Latest completed support/audit:

- `Version 0.6.3.3 - Engine-Owned Activity Selection Post-Repair Audit`

Completed maintenance:

- Unversioned `Historical Route Cleanup And Static Content Expansion Pipeline Integration`

Immediate next primary:

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`

## Completed Package Evidence

- `0.6.4` is committed as `44dfb0a79bdd9941ca45e39d83b125b3ced6d9ca`, with parent `1e62aaeb4a7a23c5514eb7ffb49f26d20f9a6070`.
- The committed subject, `Harden diplomacy conflict authority evidence flow`, is historically inaccurate. The accepted diff is the canonical `Version 0.6.4 - World And Settlement Static Content Expansion` package; its intended subject was `content(world): expand settlement districts sites and features`. Shared history must not be rewritten.
- `0.6.4` added exactly 12 active districts, 18 active sites, 6 planned semantic map features, and 12 General Lore snippets across Verdant Thalos, Heart Basin, and Stormcap Coast.
- Live totals are 14 districts, 20 sites, 8 semantic map features, and 28 Knowledge snippets, including 18 General Lore snippets.
- The exact cluster matrix is 4 districts, 6 sites, 2 semantic features, and 4 General Lore snippets per cluster.
- All identity, parent, subject, geographic, and visual references close; 592/592 focused tests and normal content lint at 67 files pass.
- No schema, validator, generic POI, visual geometry, paused authority, runtime, UI, save, migration, dependency, asset, or gameplay behavior changed.

## Durable Authorities

- `docs/dev/historical-version-and-deferred-route-register.md` is the canonical query surface for historical aliases, suffixes, identity conflicts, deferred classifications, and reopening triggers.
- `docs/design/static-content-expansion-program.md` owns live inventory, readiness decisions, the static/runtime boundary, batch policy, the `0.6.4`-`0.6.7` sequence, and the runtime-resumption rule.
- `docs/dev/current-codex-prompt.md` contains the exact `0.6.5` implementation prompt.

## Historical Resolution

- `0.5.211` is an evidenced unused numbering gap; no proposal, implementation, or reservation exists.
- `0.5.356.1 - Tool Surface Test Post-Repair Audit` is conditional support only if fresh focused evidence contradicts the accepted repair.
- `0.5.357` canonically means Runtime Ownership Transition Readiness Consolidation. The older tool-surface audit identity is superseded.
- Historical proposed labels `0.5.199`, `0.5.202`, `0.5.205`, `0.5.207`, `0.5.210`, `0.5.213`, and `0.5.215` completed at `0.5.227`, `0.5.225`, `0.5.224`, `0.5.223`, `0.5.221`, `0.5.220`, and `0.5.219` respectively.

## Static Program Boundary

`0.6.4` is complete. Continue the exact remaining sequence:

1. `0.6.5` - item, material, and recipe static content.
2. `0.6.6` - monster, ecology, and loot static content.
3. `0.6.7` - cross-content coherence and coverage audit.

The exact `0.6.5` target adds 18 planned standard recipes using existing item/material identities, values, tools, workplaces, skills, and production chains. It adds no item, value, profile, resource, commodity, workplace, tool, skill, chain, schema, validator, or lint-registration record.

All 18 proposed recipe ids remain available, and every referenced item key, tool, workplace, skill, and production-chain id resolves in the live catalogs. The prompt remains fail-closed: if a named chain does not provide a compatible exact transformation, implementation must stop on that row instead of inventing quantities.

Services and resource/commodity expansion remain paused. Weapon/armor profiles still require live collections and normal-lint registration before content. Consumable-profile anomalies remain out of scope. Generic `world.pois` remains rejected.

Static content must not imply item instances, inventory/storage mutation, crafting execution, dynamic vendors/economy/services, encounter/spawn simulation, dynamic loot, NPC population/schedules, construction/property/taxation/law enforcement, runtime ecology, or gameplay behavior.

After `0.6.7` acceptance, re-read current source and select exactly one of activity advancement, rest, or quest turn-in. Do not bundle them or preassign the next version.

Suggested next commit:

`content(crafting): expand dependency-closed recipe families`
