# Starfall geography validation to World-owned economy integration

Date: 2026-11-12
Source audited: development master 878aca911e5dfd34c2f581d2a665ecd4d05af18b
Status: L2 integration decision and executable acceptance plan. NOT a live World registry, NOT a validated elevation raster, and NOT authorization to deploy or migrate existing player data.

## 1. Finding and scope

Retain the existing First World Starfall authored template, world-map features, settlements, Civilisation/Civilization economy engine, shared simulation clock, and native-v3 IndexedDB campaign owner. Do not replace them with a procedural island generator, new merchant ledger, separate localStorage market authority, or campaign-Save-as-World shortcut.

Currently:
- The Starfall Port (825,245) pixel-center anchor is inside Myridian footprint part 7, chaparral biome part 8 and Myridian climate. Four related settlement anchors also pass source geometry checks.
- The 2048 x 1152 source raster is a WORLD map. The canonical scale is 9.765625 kilometers per reference pixel. A 28 x 18 harbor-walkable grid cannot be measured or collision-derived at that resolution. The macro shoreline must constrain a separately authored local harbor plan, not masquerade as a tile-level heightmap.
- The elevation PNG is present but its pixel channels, sea-level marker, vertical units and coastline segmentation are not yet validated from executable binary reads. The earlier script is a raw-channel witness only.
- Authored local map water lies broadly to the east of the quay. That is a draft design choice, NOT proven by a sampled height crop. Keep localAreaFootprintOnRaster and elevationSample null until an evidence-backed placement decision.
- Starfall/Harbormast/Foammarket are local economy members. Pearlwake/Chainlight are neighboring external economic context. Pearlwake trade is not confirmation of a Foammarket passenger route.

## 2. Geography evidence gate: before claims of validated shore or relief

On a clean exact-master local checkout with the original PNGs, run:
    node --test tests/unit/starfall-map-geography.test.mjs tests/unit/starfall-world-template.test.mjs tests/unit/starfall-base-economy.test.mjs
    node scripts/audit-starfall-raster.mjs

Save the exact source SHA, PNG SHA-256 hashes, dimensions, bit depth, color type and raw RGBA/index channels at Starfall (825,245), all four neighboring settlement anchors, and west/east/north/south offsets. Cross-check source polygon/shore geometry and raster coloring visually or through an independently validated legend.

Never assume 0, black, blue, alpha, or the first channel means sea level. Height in meters requires a documented channel-to-height transform and a verified sea-level reference. If this cannot be proven, keep elevationUnits and elevationSample null and gate only precise vertical claims; do not fabricate a slope, bridge or walkable shore.

Pass the macro coastline gate only when a bounded Starfall-island contour is identified and cross-checked against the source geometry, with inland/shore/water classification and provenance for the immediate harbor region. Capture the contour orientation and positional uncertainty in world pixels/kilometers. Given the very coarse world scale, independently approve a local Starfall harbor-area authoring overlay with coastline, safe land entry, impassable water, stable entry/exit and tile-to-tile collision. This local overlay gets its OWN scale, origin and immutable version; it is not an upscaled pixel crop. Keep speculative monster, NPC, resource, crafting and service placement empty.

Failure cases: unexpected PNG representation, mismatched source hash/dimensions, map-coordinate inversion, anchor in water, non-unique footprint, island split, insufficient contour detail, or any unresolved sea-level legend => STARFALL_RASTER_OR_COASTLINE_HOLD. Preserve canonical source assets and audit evidence, do not retune pixels/settlements just to pass a test.

## 3. L2 world authority choice, proposed and gated

Target the existing clean epoch IndexedDB database 'lineage.campaigns.epoch1', currently schema version 7, as the SINGLE local durable owner. Do not silently alter schema v7. Stage a separately reviewed additive v8 upgrade with a World row family and an idempotency/creation-receipt family, each keyed by account prefix; record the stable instance ID, creation intent, account lifecycle generation, template identity/version/content fingerprint, world revision and active rules. One Chronicle Individual World per account in the initial UI, not a global one-world singleton. A future second mode must remain disabled.

Explicit identities: accountId != worldInstanceId != worldMapId != localAreaInstanceId != characterId != campaignId != continuityId != saveSlotId. The immutable source template is not itself a World row. An empty World is legitimate and has zero characters and Save associations. Preserve existing campaign slots and native-v3 artifacts without automatic reparenting; an old Save lacking explicit World provenance remains legacy/unassociated pending its own accepted migration choice.

The World record owns a single versioned SimulationClock (tick, calendar coordinates and pause policy), not Date.now-driven browser clocks; starts at canonical createInitialClock() tick 0 and does not advance merely because a menu is opened or an economy projection is created. World revision advances for authoritative mutations even when the clock is paused. Chronicle rules include progressionMode='chronicle', worldKind='individual', hardcore=false, pausePolicy='allow', speedMultiplier=1, and time skipping disabled. No prestige, dual currencies, or unsupported Living/Persistent initialization.

A v8 migration must include new families in archive export/import validation, destructive account reset/delete graph, exact transaction key-path and index checks, quota/blocked upgrade checks, two-account isolation, and archive backward-compatibility policy. The current archive enforces exact schema version and exact family count. Therefore a naive extra object store is UNSAFE: prepare a separate migration contract and acceptance cases before touching cleanEpochAccountStore.ts. Same-origin browser tabs share one IndexedDB World authority; notification is an invalidation hint, not a second state owner.

## 4. Economy initialization in the authoritative World

After the new World registry owner is accepted, derive a candidate exactly ONCE from:
    buildStarfallBaseEconomyPreview(world.clock)
which delegates to:
    buildEconomyStateFromContent
    aggregateEconomyHierarchy
    buildSettlementMarketStates
    buildSettlementSimulationProfiles

Existing settlement/economy data owns algorithms and categories. The owner publishes one immutable initial economy snapshot with a versioned content manifest/fingerprint, source template ID, worldInstanceId, economyTick=world.clock.tick and the canonical five settlement IDs. Preserve the separate three-local/two-context member sets. Persist actual owner-backed economyState rather than the current template's null placeholders. The focus groups fish, grain, rope, timber, and metal are view categories, not inventory item IDs. Derived market states do not create purchasable inventories, player money, guaranteed supply, or executable trade.

Authoritative creation uses one READWRITE IndexedDB transaction fenced by account validity/lifecycle generation and creationIntentId; it atomically writes the empty World + derived economy snapshot + identical creation receipt (or places the economy in the same World row). Commit THEN read back world, receipt, template fingerprint, rules, clock and economy tick. No partial World, duplicate receipts or silent replacement. A repeated same intent returns its exact retained world; a conflicting payload returns conflict; a stale account generation fails closed. Never reinitialize stock on load, duplicate tick effects or overwrite accepted player mutations from newer static content.

World economy tick/update is a LATER stage: only the existing engine calculates the next state under the authoritative World expected revision/head and idempotent request. Clock and economy change in the same accepted commit. Two simultaneous tabs cannot publish divergent ticks or consume the same stock. On stale head show the existing required reload/conflict behavior. Pause prevents simulation advancement; it does not grant an unfenced mutation channel.

Until that owner and transaction are actually running, label all Starfall economic data 'read_only_preview' and keep runtimeEligible=false on the template. Never call a candidate snapshot 'authoritative' merely because it contains a worldInstanceId field.

## 5. Stage entry, exit and failure matrix

| Stage | Entry | Exit proof | Stop |
| --- | --- | --- | --- |
| G1 macro geography | Original PNGs and current source SHA | Raw binary sample, validated legend or explicit unverified units, bounded Starfall contour with uncertainty | Missing binary, wrong legend, non-reproducible contour |
| G2 local authored coast | G1 contour/capability limits understood | Stable authored local coast/collision grid, safe entry, no water walking, separate local map scale/version | Fake pixel-to-tile georeference or disconnected walkable land |
| L2 owner contract | Clean epoch v7 schema/archive/lifecycle and native-v3 Save owner inspected | Reviewed World/receipt schema, migration/retention and economy snapshot contract, old Save disposition | Archive/data loss, ambiguous identity, second authority |
| L3 registry & economy bootstrap | L2 accepted; isolated fixture DB & exact-source tests | Repeated create returns one empty World + one persisted economy state, exact reopen/readback | Duplicate World, stale-head overwrite, cross-account leakage |
| L4 World library | L3 accepted | Chronicle list/create/select/overview uses real World IDs, not Save slot labels | In-memory-only world or fabricated empty results |
| L5-L9 character and entry | Accepted local geometry, registry, native-v3 association | World -> existing character creator -> verified Starfall area -> native-v3 Save -> exact reopen | Unsafely patched Save schema, slot hijack, false map/merchant services |

Check two accounts, two tabs on the same account/world, a duplicate creation intent, a process interruption before/after DB commit, malformed World rows, missing source manifest, destroyed account generation, old v7 restore, newly exported v8 archive roundtrip, and untouched feature-OFF character Save load. Report PASS/FAIL/NOT_RUN instead of assuming unexecuted tests pass.

## 6. Implementation order and handoff

First run the PNG witness on a real local checkout and write a bounded shoreline/orientation evidence record. G1 elevation-unit uncertainty may remain explicit rather than inventing meters. Review this L2 owner choice against the existing archive/clean-epoch format and accept its migration/legacy disposition. Then implement L3 transaction and tests, bind the engine-derived initial snapshot exactly once, and only afterwards expose the World Library and character handoff. Preserve selected-source and hosted-publication holds throughout.

Related: starfall-base-economy-and-map-alignment-2026-11-12.md; starfall-first-world-save-template-and-local-area-seed-2026-11-12.md; first-world-launcher-implementation-process-map-2026-11-11.md.
