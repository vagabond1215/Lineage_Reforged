# Welcome, World Library, Character Entry, and World Loading: Consolidated Product and Owner Plan

> **2026-11-11 implementation sequencing:** Use the [gated implementation process map](first-world-launcher-implementation-process-map-2026-11-11.md) for all stage entry/exit, stop, evidence, cleanup and handoff rules. The first narrowly scoped executable plan is [L1 Branded Welcome / Account Gate](first-world-launcher-l1-welcome-account-entry-implementation-plan-2026-11-11.md), **held until the currently installed exact-master Vite/browser gate passes**. This document is a product/owner target, not permission to bypass native-v3 activation or expose a fake World Library.

Date: 2026-11-11  
Status: **owner-directed product flow; detailed proposed contracts; documentation only; implementation NOT authorized by this file**  
Scope: First authored World, native-v3 launcher integration, worlds/characters, creator, saves, starting locality.  
Source of owner direction: [Design Intake #74](https://github.com/vagabond1215/Lineage_Reforged/issues/74), 2026-11-09 Core World Entry direction, and 2026-11-11 conversation corrections.  
Related disposition audit: [Launcher / World / Character Design-Intent Audit](launcher-world-character-design-intent-audit-2026-11-11.md).

> **Immediate product priority:** Welcome before slots; Continue opens World Library; create/select an instance of the one **authored** First World; select/create a character; validate an authored World Entry and real local spawn; load the **same** verified world after restart. The game is not a player-editable map editor. Do not add procedural continental generation, player terrain painting, new world maps, Prestige seed/template spending, historical map deformation, or unrestricted time skipping for this release. Future variation/expansions may be displayed as **Coming Soon** without purchase actions.

## 1. Authority, status, and what does not change

This is a **target UX, data-owner, and acceptance blueprint**, not a claim that it already runs.

The current runtime has local sign-in, persistent-session hints, account-scoped native-v3 IndexedDB epoch ownership, manual/quick campaign Save slots, creator and in-game route. Sources:
- `apps/rpg-ui/src/game-shell/components/LocalAccountAccessScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/LoadGameScreen.tsx`
- `apps/rpg-ui/src/game-shell/state.ts`, `apps/rpg-ui/src/EpochApp.tsx`
- `apps/rpg-ui/src/game-shell/cleanEpochAccountAdapter.ts`, `cleanEpochLauncherRead.ts`, `cleanEpochAccountStore.ts`, `cleanEpochFirstCampaignAdapter.ts`, `cleanEpochDescendantAdapter.ts`

`state.ts` currently identifies account access, main menu, character creation, load game, settings, and in-game screens; no independent World Library / World Overview screen state or durable world registry has been verified. `MainMenuScreen` currently displays account meta and direct character Save slots. `CleanEpochLauncherRead.inventory` returns account and slot summaries, not a world catalog. The account's `stayLoggedIn` choice is supported; do not implement credentials or session hints again.

**Do not confuse** the existing per-campaign `worldState` snapshot with an independent `worldInstanceId` shared by campaigns. World-ID, world-head, world-to-slot association, first local-area materialization, and shared clock/estate concurrency are **new decisions/owners to build and validate**. Keep the active exact-master native-v3 environment/browser gate, `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION`, and current Codex prompt untouched.

## 2. Product architecture and exact navigation

```text
APP START
  └─ BOOT / authenticate / recover required native-v3 attempts
       ├─ blocked or storage failure → safe error/retry (no false empty account)
       └─ WELCOME
            ├─ signed out → Login / Create local account / choose existing account
            │     └─ accepted auth → WELCOME (signed in; do not auto-skip)
            └─ signed in → "Welcome back, {verified displayName}"
                   ├─ Logout → WELCOME signed out; protected owner data retained
                   └─ Continue → WORLD LIBRARY ("WORLDS / THE ATLAS")
                          ├─ Create World → WORLD SETUP → verify/publish instance
                          │                                   └→ WORLD OVERVIEW
                          ├─ Select world → WORLD OVERVIEW
                          └─ Back → WELCOME
                               WORLD OVERVIEW
                                  ├─ Continue Playing (selected valid character/head)
                                  ├─ Select Character → CHARACTER LIBRARY / SAVE ADDRESSES
                                  │      ├─ Resume → verified WORLD LOAD → GAME
                                  │      ├─ Read-only historical/terminal character
                                  │      └─ New Founder / eligible Bloodlines
                                  ├─ Create Character (bound to selected world)
                                  │      └─ CREATOR → Start Journey → first publication
                                  │                                          └→ WORLD ENTRY
                                  └─ Back → WORLD LIBRARY
```

**Welcome Continue = World Library**, NOT Load Game, latest character, or last world. **World Library selection = select world, not load a character.** World Overview exposes the world roster/Save addresses; World Load occurs only for a selected character, accepted new character or explicitly selected Continue Playing target. Back navigation never mutates world simulation or consumes Prestige.

At launch, **First World is the only active geographic template**. Multiple independent instances of that same authored template may eventually be allowed subject to world quota and storage/owner acceptance. It is also valid for the first end-to-end implementation slice to permit only **one active First World instance per account** until world catalog ownership and multiple-world isolation are verified. Do not accidentally imply additional map content. A world can exist with zero playable characters and no first-campaign publication.

For **Individual World** at initial release, character play/continuity is world-dedicated subject to real heir continuity. The future **Living World** (multiple playable characters in a common world history) remains locked until one clock/head/participant coordinator exists. Merely rendering two character cards does not authorize simultaneous distinct campaign copies of one mutable world.

## 3. Screen 0: boot, safety, session validation

**States:** `booting`, `auth_required`, `authenticated`, `blocked_storage`, `recovering_publication`, `recoverable_conflict`. These are conceptual UI states; use owner-returned discriminants in implementation.

- Open the real native-v3 account store, validate the persisted session hint and account lifecycle/revision, recover required pending consumers/terminal operations, and read back. A hint is not identity authority.
- If `stayLoggedIn` is false or hint is absent/invalid: signed-out Welcome. If a valid persisted session exists: signed-in Welcome, **not direct world/character auto-load**.
- `corrupt`, `incompatible`, `pending_consumers`, `closed`, `unavailable`, and `empty` are distinct. Never display missing characters/worlds because an IndexedDB read failed.
- Avoid leaking a previous account's world previews across sign-out, account switch, load, or stale concurrent tabs. Dismiss any retained character/world selection when session owner changes.

## 4. Screen 1: Welcome / Login

### 4.1 Visual specification

A branded landing page **visually distinct** from Save/Load. At desktop width: large readable Lineage Reborn logo at upper center/left, atmospheric hero illustration/background behind a controlled overlay, with a clear high-contrast account panel above the fold, ideally right/center. On mobile: logo first, account panel immediately below; artwork decorative and never obstructs controls. Reuse existing game fonts and palette where sensible, but allow this splash to opt out of the gameplay left-sidebar shell.

**Signed out:** heading `Welcome to Lineage Reborn`; existing local account chooser (if any), password field, `Log In`, `Create Account`, `Stay signed in`; clear errors (invalid credentials vs storage unavailable). Password is masked and never printed/logged in UI; real credentials owned by native account adapter. Account import/reset/delete must remain separately guarded, not accidentally included in a generic login popup. The panel should be a foreground in-page card/modal-like region, not an inaccessible overlay covering the logo.

**Signed in:** `Welcome back, {displayName}`; large **Continue** primary and **Logout** secondary controls. Account identity comes from verified account owner, never a cached display label alone. Optional subordinate `Settings` and account profile summary may come later, but should not compete with Continue. Logout requires confirmed session invalidation, clears transient selected-world/character state, and **does not delete the account, world instances or Saves**.

**Accessibility:** modal/panel label, visible keyboard focus, Escape behavior only where appropriate, screen-reader form labels, password errors near inputs, no hover-only affordances, 44px-ish touch targets, responsive fallback when hero art fails, reduced-motion support and meaningful non-art branding.

### 4.2 Inputs and outputs

- Inputs: `authBootstrapResult`, `accountPickerEntries[]`, `accountId`, `password`, `stayLoggedIn`, account creation `displayName/confirmPassword`.
- Output: **verified** `launcherSession` + `accountProfile` + `accountRevision/lifecycleGeneration`; no world/Save choice, no game tick.
- On click Continue: revalidate session, then navigate to World Library with account scope.

## 5. Screen 2: World Library

**Label it explicitly `WORLDS` or `THE ATLAS / YOUR WORLDS`** to distinguish from the old Save slots. World cards need a **world-map emblem/landscape silhouette** rather than a character portrait. Initially a simple text banner is enough, without commissioning a new logo.

**World card projections (only if owner-backed):** `worldInstanceId`, display name, geographic blueprint `First World`, world kind `Individual` or `Living (locked)`, creation/last-played times, owner/revision/status, optional current world date, actual playable character count, current active/terminal/pending status, and `Continue World` / `Open World` selection. World status must not be inferred from Save-slot count alone.

**Actions:**
- `Create World` opens world setup; enabled only if active entitlement/quota and durable owner support exist.
- Select existing world -> World Overview. No character load or game-world mutation.
- Back -> signed-in Welcome. Logout can be reached through Welcome/account control, never deletes world.
- Future alternate maps/expansion packs/seed variants -> visible informational **Coming Soon** cards only; no silent purchase or locked-world fake loading. Do not offer a terrain painter.

**Empty account:** explicit `No worlds yet`, `Create your First World` CTA (if store/creation owner ready). Storage error is an error panel, not empty state.

**World-level deletion:** not necessary for first slice; when later authorized, confirm name+identity and account head, enumerate dependent characters/archives, require an owner-backed lifecycle transaction and durable receipts, never repurpose character-slot delete to delete a world.

## 6. Screen 3: Create World / World Setup

A small form, **not a world editor**:

| Field | Launch behavior | Authority / default |
| --- | --- | --- |
| `worldDisplayName` | User text; trim/validate; permit default generated label | World registry owner; name not unique identity |
| `worldBlueprintId` | Fixed `world_map.first_world` / First World | Authored canonical world content, not random terrain |
| `worldKind` | Individual World | Living World Coming Soon until shared-world coordinator exists |
| `contentManifest/version` | Read-only pinned approved content | Content owner + materialization compatibility |
| `worldRules`, difficulty, Stakes | Show only if rules owner supports configuration at world vs campaign level | Do **not** conflate Hardcore narrative, difficulty preset, Grim World or irreversible Stakes |
| `creationIntentId` / `expectedAccountRevision` | Internal, stable during retry | New world registry/publisher |
| `internalRealizationSeed` | Hidden/pinned for replayable local initialization, if owner supports it | Not user-editable and not Prestige-gated at launch |
| `worldInstanceId` | Allocated/retained by one owner at prepare | Durable identity distinct from map/campaign/slot |

Click **Create World**: validate authorization/content availability, prepare immutable intent under account ownership, commit new empty world exactly once with version/manifest/clock initial posture, read back exact identity and enter World Overview. A retry after interrupted write must find the **same** world, not create two. A newly created empty world should not invent a character or advance world time.

**World identity is not map identity.** `worldInstanceId` = one evolving universe/history. `worldMapId` = a geography inside it. Future expansion can add a subterranean map or new land via actual transition graph without changing the world's clock.

## 7. Screen 4: World Overview and Character Library

World Overview answers **Which world is this, what is its actual status, and which character can I play here?**

- Header: verified world name, `First World` map mark, `Individual World` status, owner-projected date where available, Back to Worlds.
- Primary focus: playable character cards **grouped by world association**, plus `New Founder`, `Bloodlines / Eligible Heir` (only if actual source-backed candidate), `Resume`, `View Chronicle` when supported.
- Separate **character roster** from **manual/quick Save addresses**. A Save address points to an accepted campaign head; it is not a character itself. The same character may have multiple valid Save artifacts or address generations, and terminal characters may remain historically visible.
- Character card: `characterId`, real display name, lineage/backstory, mode/state, last accepted location, campaign/continuity, life/death posture, Save status, last played. All projected from selected world's verified account-owned records.
- `Continue Playing` is permitted only if there is an unambiguous valid **selected or sole recent playable** character/head. With several candidates and no confirmed preference, open character selection rather than guessing.
- Explicit `Select Character` displays character candidates and valid current Save addresses; load disabled on `pending`/`corrupt`/`incompatible`/`closed` until appropriate recovery/inspection.
- Existing character Save/Load functionality can be reused as nested UI after world validation. Do not display slots from other worlds, or leak a previous account's recent selected slot.

**Heir route:** Bloodlines is a selection of **existing actual** eligible offspring with mature/developmental evidence, consent/eligibility/capacity, world/continuity association and account/lineage facts. Prestige heir slots are capacity, not fabricated children. Accepted heir facts (origin, parentage, lineage, sex, physical development, source evidence) are locked in creator. Existing terminal ancestor is retained for Chronicle, not reactivated.

## 8. Screen 5: Character creation (within selected world)

### 8.1 Stage order and top-level behavior

Keep the latest design decision: **four main creator tabs plus launch context; no separate Review page**. The authoring goal is one editable draft and one unified deterministic preview, with Start Journey globally reachable only when all validation passes.

```text
Entry source: selected world + (new founder OR owner-verified actual heir)
  ↳ set world/campaign context, Standard/Hardcore (where authorized), lineage/sex
Creator 1. BACKSTORY
        2. TRAITS & ATTRIBUTES (nine stat allocator + trait effects in same budget)
        3. IDENTITY & APPEARANCE (name, stage, height/physique, color, portrait)
        4. LOCATION & WORLD ENTRY (real area + authored scenario, same tab)
Top-bar START JOURNEY → validate all → exact-once Save/world publication → actual scene
Alternate SURPRISE ME → one entire legal combination → same validation/publication
```

Heir selection and immutable facts happen **before** normal creator editing, not in a removed Review step. For founder starts, lineage/sex must be fixed or selected **before Backstory eligibility and stat math**, even if those controls live in a compact Identity/context panel visible throughout. Navigation backwards may retain legal values; changing an upstream value invalidates only affected dependent values.

### 8.2 Creator field/source table

| Owner | Fields entered or pinned | Must resolve |
| --- | --- | --- |
| Selected world | `accountId, worldInstanceId, worldRevision, worldMapId, contentManifestVersion` | Owner relation, world rules, available starting geography |
| Launch/source | `startKind` founder/heir, `sourcePersonId/sourceRunId` only when valid, account Prestige/Legacy evidence, campaign mode/rules, Save destination | Heir eligibility/immutable identity, source consumption; no fake Core material support |
| Backstory | `backstoryId`, provenance/evidence, any approved narrow material origin facts | Formative skills/ability sources; independent Core displacement/no-estate admission |
| Traits and attributes | `selectedTraitIds[]`, supported trait parameters, direct STR/DEX/AGI/INT/WIS/SPT/CON/VIT/CHA allocations | One budget ledger and source-labeled stats and HP/MP/Stamina; no fake trait credits |
| Appearance | `name`, age/development band, valid physical/cosmetic choices | Honest lineage/sex/age facts and derived stats; heir facts locked |
| Place and entry | `regionId/localityId`, verified start `siteId/areaTemplateId`, `worldEntryScenarioId`, approved variant/version, Standard/Hardcore scenario pool | Actual geography and participant/item/route prerequisites; story diversity and no invented scene |
| First publication | Stable creator intent, pinned real rules/content/world revision and approved Save address | Legal character/campaign identities, real inventory/resources/location, intro pending state and exact-once receipts |

Initial Core remains **no estate, reliable safety net or substantial possessions**. Ordinary Local, Farmhand and Workshop-Raised are NOT automatically Core. Exile and Amnesiac are strong Core-origin candidates; Vagabond requires genuine lack of support; World-Stray exists in content but is special/manual and not silently unlocked. Backstory is past; World Entry is present starting circumstances. A separate `startingBundleId` shopping page and pre-stocked kit are **old runtime/source migration issues**, not final Core product direction. Small lawful starting goods and true scene-earned supplies must have one owning source and exactly-once claim.

### 8.3 Compatibility, selection, and randomization

- Manual path: player selects an eligible Backstory **and** an eligible World Entry at the selected location. World Entry is not secretly randomized.
- World Entry resolver validates `backstory × mode × world × real site × environment × actual owner-supported actors/items/routes × account unlocks`. Unknown/missing required source facts fail closed; display explicit lock reasons.
- Separate **Standard Core** (in/near civilization) and **Hardcore Core** (genuine isolated wilderness + restricted death/real survival owners). Standard/Hardcore is not a simple numeric difficulty preset.
- The current eight scenario IDs are **editorial drafts**, four Standard (`core.room_paid`, `core.last_bed`, `core.journeys_end`, `core.roadside_kindness`) and four Hardcore (`core.broken_wagon`, `core.washed_ashore`, `core.abandoned_camp`, `core.lost_trail`). None is presently proven as a playable indexed scene. Do not infer a room/wagon/wreck from a climate or settlement label.
- Per admitted Backstory, mode, and real supported location: **more than one distinct eligible entry**, ideally **three**; proposed practical launch target **two ungated**, with further later options behind Prestige. World Entry choices are not extra starting riches.
- Surprise Me samples **complete legal combinations**, honors account/scoped Prestige, valid heir locked facts and any approved pins/exclusions; then immediately submits **once**, not merely prefills the form. Repeated render, retry and Save/restart do not reroll an accepted identity or scene.

### 8.4 Invalidation and readiness

When world changes, discard stale creator scene/world provenance and re-evaluate all steps. When Backstory changes, update skill/stat sources and World Entry eligibility but preserve compatible name/traits. When location changes, revalidate actual site, scenario and travel; preserve unrelated attributes. When a trait/attribute changes, recompute exact owner source preview; do not grant items or change world state. When account/heir/Prestige/world/slot revision changes, re-read and fail stale attempts. **No Start Journey until one actual spawn and playable opening are certified.**

## 9. World creation versus world loading versus local area materialization

Three distinct operations:

1. **Create World Instance:** record a new durable world with the **existing authored First World** geography and its content/rules manifest. No character required.
2. **Materialize local playable area:** take a known `worldMapId → region → locality/hex → canonical site/area template`, validate exact walkable geometry and exit topology, instantiate only owner-supported habitat/resources/encounters/NPCs/stations, and persist materialized identity/state **once**. Render-order-independent internal seeding is fine, but no player terrain variation at launch.
3. **Load existing World Instance:** validate already-published world revision/head and selected character/head, read the exact **persisted** local instances, placed entities, acquired/consumed resources, world clock and accepted events. **Never rebuild/roll the world anew on Load.**

### 9.1 World loader contract (conceptual, to assign to actual native owner)

```text
validateAccountSession()
  → readWorldIndex(accountId, expectedAccountRevision)
  → select/readWorld(worldInstanceId, expectedWorldRevision)
  → verifyBlueprintAndContentManifest(worldMapId, pinned versions)
  → readCharacterRosterAndCurrentAddresses(worldId)
  → choose verified playable character + exact campaign/continuity/head
  → reconcile pending publications/recoveries (idempotent, never overwrite successor)
  → read exact accepted Save artifact and world/head association
  → read persistent current-world state and materialized local-area instances
  → check character placed at valid site with valid nearby observation/exit graph
  → reconstruct LocalSceneContext **as projection** and available commands
  → render playable scene and normal gameplay
```

**No 'Loading complete' before durable readback**. World-wide clock, history, settlement/estate/resource state must have one authoritative owner. Until multi-character Living World is accepted, avoid writing one world clock into two independent player Saves and pretending they synchronize. For first Individual World slice, bind its existing authoritative campaign Save to its registered world in a compatible, versioned way; an owner migration/adapter decision is required before adding a world field to the native-v3 schema.

**Load failure classification:** missing world, unauthorized world, missing content pack, incompatible content version, closed/retired/terminal character, empty Save slot, pending publication/recovery, corrupt artifact, stale world/head revision, obsolete or unavailable local area, storage I/O failure, and user cancellation. Each gets distinct copy and recovery choices. Never treat read error as permission to generate replacement terrain, default account, character, world or starter inventory. Do not silently clone an occupied Save address.

### 9.2 Local Starfall Port pilot

First actual area should use **Starfall Port** as a **candidate** on `world_map.first_world`:
- `settlement.starfall_port`, `region.starfall_isle`, `region_locality.myridian_ports`, `world_hex.myridian_ports`; neighboring same-hex settlements include Harbormast Quay and Foammarket Ferry, which are **not guaranteed foot-adjacent**.
- Existing terrain/context: natural harbors/lighthouse hills and upland mixed-forest archipelago plus marine/shore habitats. Macro pixels `(825,245)` are map reference anchors, NOT room/local coordinates.
- Regional ecology candidate flora: coconut palm, orange tree, flax, river reed; fauna: cod, oyster, crab, reef lobster. No local harvestable source exists merely because the ecology record lists a species.
- Existing Starfall guild presence: merchants, teamsters, shipwrights, fishers, scribes/factors and adventurers; descriptive evidence does NOT create current NPC craft orders, guild clerk, board, vessel or station.
- Actual starfall links include `route.starfall_port_harbormast_quay`, `lane.brineharbor_starfall_port` and `lane.starfall_port_blueflow`, plus hex corridors. Sea lanes do not authorize walking or free boarding.
- The live five `spawn_profiles` do **not** include a Myridian/Starfall profile; author and verify actual habitat/danger/spawn zone before promising local monsters. Existing world-engine deterministic spawn-candidate selection is not exact geometric zone placement.
- The 20 existing static settlement sites and 14 districts do **not** instantiate a Starfall inn/room, shelter, craftsperson, interior or wilderness wreck. Author actual source/instance owners first.
- Pilot minimum: one safe grounded Standard entry location; valid foot navigation and bounded exit; inspect and a lawful acquire/equip/consume opportunity as supported; one real ecology interaction; one approved encounter zone; one actual provider or station; accepted Save/reload preserving all state. Isolated Hardcore starter is later separately grounded.

Derived `LocalSceneContext` is a read-only observation/projection, not a world database or command executor. Exact local target IDs, commands and ownership come from their respective domains, with revalidation at action time.

## 10. Persistence and exact-once transaction boundaries

All world/character/scene creations require stable operation identities and retry/recovery:

| Transaction | Required invariant |
| --- | --- |
| Account sign in | Verified account/password, session hint persistence only as allowed; no campaign mutation |
| World create | Single account-world association and exact first readback; retry returns same world; empty world permitted |
| Character start | Verified world + character choice + actual entry + empty approved Save address; stable prepared attempt and source fingerprint |
| First Save | Native-v3 artifact/control/head publication once; account/Legacy/heir consumer receipts once; never overwrites unrelated campaign |
| First area creation | Stable instance/seed/source positions; realized objects and resource provenance saved once; no reroll on replay |
| Gameplay | Actions mutate owned state, not descriptive guild/ecology/map metadata; world clock rules retained |
| Resume | Exact world and current accepted character/head; recovery resumes original attempt instead of synthesizing state |
| Logout | Session clearance; no account/world/save deletion |

Stable `worldInstanceId`, `worldMapId`, `areaInstanceId`, `characterId`, `campaignId`, `continuityId`, `artifactId`, `publicationId`, `saveSlotId` remain distinct. Any new world index must be account-scoped, revisioned, transactional and compatible with the existing retained Save/consumer recovery machinery, not a parallel localStorage JSON index with weaker integrity.

## 11. MVP slices, owners, and acceptance gates

| Slice | Narrow deliverable | Passing proof / no false claims |
| --- | --- | --- |
| W0 | Read-only verified account/world/campaign/Save boundary map and current native-v3 readiness gate | Source snapshot and explicit blocked gaps; no active Codex scope change |
| W1 | Welcome screen and auth routing | Valid persistent sign-in returns to personalized Welcome, not straight to Slots; logout preserves data; invalid storage fail-closed |
| W2 | Durable World Registry + empty World Library | One First World template; create/list/select/restart one empty named world with exact identity/readback |
| W3 | World Overview + character/Save index association | No cross-world/account leakage; clear empty/ready/blocked/terminal states; continue has unambiguous head |
| W4 | First local authored area and exact site/route owner | Real Starfall area, walkable geometry, bounded exits, sourced local ecology; no image-pixel shortcuts |
| W5 | Creator field/step rework and compatibility | No Review/bundle shopping page; one stat/trait resolver; legal Standard Core source and >=2 valid scene choices at admitted area |
| W6 | Character first publication into selected world | World/character/head/area associations and first World Entry exactly once; Save/restart, stale/occupied-slot, failures and heir negatives |
| W7 | First complete local loop | Actual inspect, obtain, equip/consume, move, ecological or owner-backed encounter, provider and travel; persistent receipts |
| W8 | Expand authored coverage | Add other locations, Hardcore actual wilderness after real permanence/survival owner, further Core entry variety; keep feature flags honest |

**Test matrix minimum:** no-account, bad password, stay-signed-in true/false, logout/relogin, account deletion lifecycle, empty world, world create retry, multiple world identity isolation where offered, empty world roster, one playable/one terminal character, occupied/corrupt/unsupported/pending slot, stale account/world/head, account switch, missing content manifest, actual area mismatch, source-backed entry mismatch, Save/restart no encounter/resource/item duplication, atomic Surprise Me, secure heir provenance, Standard safe start and legitimate Hardcore isolation.

All browser acceptance must be run against a **specific authorized exact source and retained native-v3 state**, not a UI-only mock that cannot reach the owner paths. No Site/production deployment inferred from passing source tests.

## 12. Future-only features and explicit holds

- **Coming Soon / Prestige later:** more geographic map packs, underground realms, multiple map starting points, different authored-world variants, user-entered seeds, saved/reusable templates with limited uses, historical era/time-skip settlement variants, expanded Living World. Show disabled and do not debit any account.
- **Not a feature:** player paint/drag world-map editing. Offline terrain painter from prior conversation is only a developer sketch, not a player surface or canonical content authoring authority.
- **Future shared-world clock:** in Living Worlds, no accelerated world time while any participating playable character is in ordinary time; stop at earliest interruption. Avoid implementing empty affordances.
- **Not solved by UI:** exact local-grid owner, actual NPC/stations/resources, instance/world snapshot association, Prestige currencies, restricted-Stakes activation, pack compatibility, full heir life cycle, extra-world transport.
- **Active route untouched:** `docs/dev/current-codex-prompt.md` exact-master environment readiness and ordinary entry gate, plus activation/publication holds.

## 13. Decision register

**Owner selected:** authored First World only now; Welcome before slots; sign-in/account-name welcome; Continue+Logout; Continue to visibly distinct World Library; world choice/create before character; no player world editor; Core Backstory and authored World Entry separate; Standard near society / Hardcore wilderness; manual entry choice and one-click submitting Surprise Me; no Review; large historical variation / world expansions deferred.

**Proposed, pending owner/system acceptance:** world registry persistence/schema, precise new screen IDs/component owners, full world-create transaction, world/Save head association and migration, exact per-area instance schema, supported dynamic local generation, two-ungated-entry release threshold, first exact settlement site/scene, multi-world count/quota, precedence of account/world/character rule settings, final stat/trait prices.

**Explicitly NOT selected:** paid costs, pack unlock tiers, full random world generator, world template user-use budget, arbitrary map painting, world-state reconstruction from one seed, automatic character load on Welcome Continue, or Living World multi-head concurrency.

## 14. Related documents and precedence

- [Design-intent audit and supersession matrix](launcher-world-character-design-intent-audit-2026-11-11.md).
- [Core World Entry/Hardcore/Prestige/Succession direction](core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md).
- [World Entry editorial scenarios](core-world-entry-scenario-contract-and-editorial-seed-2026-11-09.md), **draft not live**.
- [Exact geography candidate inventory](core-world-entry-exact-geography-anchor-candidate-inventory-2026-11-09.md).
- [Local Scene Context projection boundary](local-scene-context-projection-decision.md).
- [Difficulty, World Rules and Stakes separation](difficulty-presets-grim-world-rules-and-stakes-separation-decision.md).
- [Heir and family evidence owner](offspring-heir-family-continuity-owner-plan.md).
- [World geography authority boundary](world-geography-authority-boundary-decision.md).
- [Historical creator shell refinement plan](unified-shell-and-creator-refinement-plan.md) (several specific behaviors superseded here).
- [Open design questions](open-design-questions-index.md) (historical rows and categories are not active Codex route).
- [Native-v3 exact-master active handoff](../dev/current-codex-prompt.md), **execution scope remains independent**.

**Non-action:** This document does not mutate gameplay, current native-v3 Save, account data, world content, schema, tests, PR, deployment or active Codex handoff.
