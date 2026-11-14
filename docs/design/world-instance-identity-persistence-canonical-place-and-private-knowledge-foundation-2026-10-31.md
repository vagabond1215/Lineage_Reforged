# T8: World-Instance Identity, Durable World Facts, Canonical Places and Private Knowledge

> **2026-10-31 World Save continuation proposal:** The user's new question about persistent **world saves for Living, solo and Attended worlds, handed forward to heirs** is recorded as a strongly recommended **universal World Save / same-world heir-continuation topology** in [Universal World Save and Heir Handoff](universal-world-save-heir-handoff-and-living-world-continuity-proposal-2026-10-31.md). This is a recommended extension, **not yet an accepted Save implementation or final rollback/fork rule**. World ID and authoritative history remain independently durable, while each heir gets a new character/private knowledge owner. The proposal **does not override** this file's source-verified identity and atomic-publication requirements, and does not change the current selected Save or Codex stack.

Date: 2026-10-31 (America/New_York)
Status: **CONNECTOR-SAFE / SOURCE-VERIFIED WORLD-FIRST INTEGRATION FOUNDATION / OWNER DECISION NEEDED BEFORE IMPLEMENTATION / NOT INSTALLED**.
Home: held [PR #46](https://github.com/vagabond1215/Lineage_Reforged/pull/46), not a new world schema or execution PR.
Track: **T8, P2 strategic** in the [single parallel progression register](https://github.com/vagabond1215/Lineage_Reforged/blob/connector/barebones-playable-ui-planning-2026-10-26/docs/dev/connector-safe-parallel-progression-register-2026-10-31.md). This is one bounded new owner/identity matrix, **not** another generalized religion/clock/dungeon synopsis.
Selected `master`: `a596112acf3945f2bf7c625e943f2511d12aa710`. Active native-v3 Codex stack latest observed at draft PR #57 `636ffa5cef6f971ea8b6f02be5b4dd2a2305a848`, **not selected on master**. No runtime, Save, types, migration, clock or content changes.

## 1. Accepted product direction and precedence

**User-selected direction retained, not reopened:**

- A **world is created and committed before its first character**. Standalone/single-lineage play **also** has a world. A Living World primarily extends the number of independent permitted lineages/characters, not the initial world existence.
- One world has one accepted history and chronology; characters do not generate alternative initial world states merely by selecting a starting continent/region/settlement.
- All characters and descendants within that world experience its legitimate shared changes; separate characters **do not automatically inherit** each other's exploration, geographic knowledge, secrets, quest progress, inventories, or permission.
- Future time has **Live** and **Attended** alternatives; exact rate, queue budget, offline scheduling and per-event authorization remain unselected. Both affect the *same authoritative world*, not independent character clocks.
- Religion/leyline/dungeon content is drawn from **authored fixed rules + committed per-world seed + accepted later events**, not direct god-proof, random placement from map geometry, or a character's chosen story.
- The character's personal Atlas shows personally discovered geography. Accessible held/posted charts can expose **their own inaccurate or accurate depictions temporarily**, with only separately accepted limited bearing/recognition evidence persisted. World source knowledge never autogrants the character geographic discovery.
- Existing place registries own base canonical location identity. Districts/sites initially nest under settlements; generated/new place instances await world identity, persistence, namespace/collision rules and source validation.

Controlling topic work: `world-first-creation-idle-characters-gambits-and-anonymous-market-integrity-2026-10-29.md`, `live-attended-world-clocks-gambit-queue-and-generational-continuation-2026-10-29.md`, `religion-seeded-history-confluence-and-lineage-continuity-direction-2026-10-28.md`; held PR #45's `canonical-place-profile-coverage-and-atlas-foundation-2026-10-31.md` and `player-discovered-cartography-chart-sources-study-and-uncertain-bearings-decision-2026-10-31.md`; accepted `stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`, `world-geography-authority-boundary-decision.md`, `discovery-poi-boundary-decision.md`. These retain their independent authorities.

## 2. Direct source evidence and missing live seam

This is a selective **identity/persistence consumer audit**, not an entire repo inventory.

| Current source and inspected revision | Actually present | Why it does NOT yet satisfy world-first |
| --- | --- | --- |
| `packages/shared/types/src/contracts.ts` blob `4b3910f3dc5a78f3a45dfb5bfc0ffdb512d681ec` | `CampaignIdentityState`: `campaignId, continuityId, characterId`, optional fork/source fields. `SaveSnapshot`: `accountId, campaignRules?, campaignIdentity?, clock, gameState, playerState, worldState, civilizationState, sessionState`. `WorldState`: activeRegions, generic weatherState, encounter/nearby state, not committed world seed. `AccountProfileState`: account legacy, achievements, history, families, estate and publication receipts. | No `worldId` / `worldInstanceId`, committed world-generation revision, authoritative world history/head, multi-campaign shared-world reference, or world-scoped separately published state. `GameState.worldVersion` is **not** a world-instance id; `PlayerLocationState.worldMapId` is a **map asset/content id**. |
| `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` blob `bed78ff9a1628c92f844cbde5df0949838d50413` | Character creator calls `resolveWorldSelection` for **authored** continent, region and starting settlement; `deriveCharacterCreationState` creates initial clock/current region/new `worldState`, initial known continent/region/settlement, and `createNewGameSnapshot` initializes a new campaign snapshot plus character identity. | It creates gameplay state around one character/first campaign. It does **not** load a pre-existing committed world id, reuse world history shared by another independent campaign, or set world seed provenance before the first character. Selected static start location is not world generation. |
| `apps/rpg-ui/src/game-shell/newCampaignAttemptCoordinator.ts` blob `4740baf1f769eb93c8981ce4a19ae9ae770afe34` | Prepared creation attempt retains a snapshot, account, slot, input fingerprint, consumer plans, then uses verified publication/recovery for that campaign. | This is the accepted attempt/idempotency pattern to **reuse** in later world creation, not a free license to generate world seed on every retry. World commit would require independent idempotent world attempt/head, then a later character attempt bound to it. |
| `apps/rpg-ui/src/game-shell/saveManager.ts` blob `9dc192d75690d299f969633383046d5af8f4a866` | Campaign/continuity publication, storage artifacts, heads, selected slot/recovery and account consumer reconciliation. | Existing save addresses and campaign heads are **not** independent shared-world heads. Restoring an old character snapshot could otherwise restore stale embedded `worldState/civilizationState/clock`, overwriting changes accepted through other characters. No world ledger is proved by this file. |
| `apps/rpg-ui/src/game-shell/runLifecycle.ts` blob `d75df9ee0bd51d08c068ac7a11767b62d2df0423` and accepted Stakes identity decision | Successor/terminal campaign/continuity behavior and valid related identity guardrails. | A successor character may continue a campaign identity; it is **not** the world identity, and a second unrelated lineage needs a distinct character/campaign scope without a duplicated world. |
| `packages/content/base/world/world_maps.json` blob `139ed99bd858535bb6a072eee58b697bfcdaa9bd` | One source map registration `world_map.first_world` with read-only world geography art/metadata. | The static `world_map.first_world` ID may be referenced by multiple independent generated worlds; it is not their globally unique saved world id or a player's discovered map. |
| PR #45 canonical place profile foundation, current typed region/locality/settlement/feature catalogs | Base semantic geography and stable typed place IDs; 41 regions, 47 localities, 14 districts, 20 sites, 8 planned map features checked in T1-A. | Base place ID `settlement.highcrown` denotes an authored place **definition**, not a particular world's mutated Highcrown nor its player-revealed overlay. Do not duplicate or replace source registries with one generic `locations.json`. Large settlement/visual geometry auditing remains T1-B checkout-gated. |
| Held PR #46 world-first and clocks, PR #45 discovered-only map | Explicit product direction, source/evidence expectations, future regression cases. | **None are current executable policies**: no world generation, standalone persisted world head, shared cross-campaign transaction, player fog-of-war owner, offline scheduler, chart item teaching authority or generated dungeon placement. |

**Source-fingerprint guard:** these are source facts at the exact selected master SHA. A later Codex/native-v3 selection may move the snapshot, Save and caller paths. Future implementation must do a **delta-only refreshed preflight** before editing, not install this source table blindly.

## 3. Proposed identity vocabulary and ownership, not a selected schema

**Strong recommended contract for later owner admission:**

| Concept | Identity/provenance owner | Durable or derived nature | Key invariant |
| --- | --- | --- | --- |
| Account | Existing Account authority | Durable account identity/history | Not a world, not a character, not a legitimate shortcut to another character's secrets |
| **World definition / generator policy** | Canonical content + future world generator policy | Versioned authored templates, geography baseline, religion/leyline rule grammar | Describes *what may be generated*, not a saved world run or a revealed map |
| **Committed world instance** | **Future independent World/Account/Save owner** | World ID, immutable creation seed and generator/content policy revision, creation/commit provenance, accepted initial history; world status | Exists **before** any character, independent of campaign save slot; immutable initial source, later revisions/history append through owners |
| **Authoritative world head/history** | Future world-persistence/event owner | One ordered accepted world revision/clock, permitted world mutations/events and domain receipts | Every character sees the same authoritative world as it evolves; actor save restore cannot roll it back; idempotency/atomicity for cross-character effects |
| Campaign | Existing Campaign/Save owner | Durable `campaignId` and accepted campaign rules; later **foreign key to world instance** | One campaign is *not* the unique saved world; preserve existing campaign/continuity semantics and successor rules |
| Continuity | Existing Campaign/Save owner | One selected causal campaign history/approved branch topology | An alternate character Save checkpoint is not a new world timeline; later branch resolution cannot fork or reset shared-world head by default |
| Character | Existing Character/Player owner | Player ID, physical inventory/gear, Knowledge, discovery, observations, quest/private state | Multiple characters may reference one world head without personal map/Knowledge/inventory transfer |
| Source canonical place | Existing `regions/region_localities/settlements/...` owner | Typed stable base ID, source version/provenance | `(placeType, canonicalId)` resolves a definition; not a mutable world instance or map pin privilege |
| **World-specific place instance** | Future committed-world location/event owner | E.g. composite `(worldId, placeInstanceKey)`, plus optional `baseCanonicalRef` and precise world-specific geometry parent | A world-created village may be unique to W1; a base town can have W1/W2 different control/damage/history; ID collision is a hard validation error, not a rename |
| Accepted character observation/reveal | Future character Discovery/Knowledge owner | `(worldId, characterId/authorized continuity, sourceEvidenceId)` and knowledge/reveal/uncertainty projection | Same world does not entail same exploration, names, hidden lore or misidentification; reported chart claims remain scoped to source edition |
| Chart/source artifact | Future item or site/fixture owner | Exact object/fixture, map edition, physical access/holder and depicted claims | Looking at W1 chart can temporarily reveal its own depiction, **not** auto-reveal W1 personal map or transfer to W2 |
| World clock mode/scheduling | Future World Clock + World Save owner | One world-scoped time policy and event-admission/catch-up history | Live and Attended are alternative **world choices**, neither is a client timer, independent campaign clock or mutation permission |

Suggested conceptual referential shape (names below **do not** authorize implementation):

```text
accountId
  -> worldMembership(worldId, roles/permissions)         // future, not live
       -> immutable committedWorld(worldId, seed, generatorVersion, sourceContentVersion)
       -> authoritative worldHead(worldId, worldRevision, acceptedClock, worldEventHistory)
       -> one-to-many campaign(campaignId, continuityId, worldId)
              -> one-to-many character(characterId, campaignId, worldId)
                    -> private discovery, map-reveal, Knowledge, inventory, quests
              -> campaign snapshots and continuity/head artifacts (existing Save authority)
       -> world places {(worldId, placeInstanceKey): typed canonical base ref OR generated identity}
```

**Do not put all of this into a character SaveSnapshot.** Legacy snapshots may carry a local `clock/worldState/civilizationState` for compatibility; the future owner must split **shared mutable world fields** from **character/campaign-specific transient encounter/session context**, with a validated published-world-head reference. No silent schema migration, no account-wide global rollback and no direct amendment to native v3 item/Save structures now.

### Base canonical identity versus world-instance identity

- A typed source `settlement.highcrown` is one canonical **definition ID** across worlds. `(world.w1, settlement.highcrown)` and `(world.w2, settlement.highcrown)` may both refer to that definition, but their actual occupants, religious influence, trade state, world event history, availability, destruction and player memories may diverge through separate **accepted events**. Do not copy or mutate `settlements.json` per world.
- A generated village must have a durable **world-scoped instance key** with a namespace disjoint from canonical source record IDs. A proposed generated `settlement.highcrown` shadow or an attempted duplicate `(worldId, generatedKey)` is rejected before publication. An in-world nickname is not a canonical alias.
- A semantic source feature (e.g. mountain range, leyline *rule* or mapped river geometry) may be shared as content between worlds, but a genuine **world-specific** new confluence, dungeon-core occupation or institution is never assumed to exist merely from visual geometry or cultural belief. All need a world-owned resolved fact, provenance, parent/geometry and discovery authorization.
- Exact coordinate/geometry authority is a **different axis** from identity and from character visibility. The 2048×1152 base art/visual references cannot become global world-instance point placement or automatically exposed player map.
- One base geography may be modified by world events, but major seed-level changes to canonical *rules* require explicit migration/version compatibility, not editing a world behind existing character saves.

## 4. Commit-before-character, publication atomicity and recovery boundaries

**Proposed minimum gated creation sequence:**

1. **Create World draft**: authenticated account requests one world with selected permitted settings, generator/content/policy versions and a retained intent fingerprint. No character, world event or current campaign is minted in a read-only preview.
2. **Prepare world attempt**: allocate or bind one candidate `worldId` and immutable candidate seed/initial state **once** to that retained attempt. Repeated click/reload/retry with identical authorized intent must recover **the same proposed world** rather than rerolling hidden factions, confluences or map facts.
3. **Validate**: authored definition references, world-specific generated namespace uniqueness, seed/plot grammar, required reference topology, exact owner/source revision, permitted region shape, initial world clock policy; do not instantiate NPC/service/leyline/dungeon facts unsupported by selected generators.
4. **Commit and publish**: world head/event/history and account world membership must be durably bound with one idempotent publication/receipt and crash-recovery behavior. **Do not expose Add Character for this world until an accepted world head can be reloaded exactly.**
5. **Add Character**: character/campaign/continuity creation references the already committed `worldId` + admitted current world revision and initial origin; inherited world facts are read-only inputs, not editable creator knobs. An ordinary heir can keep its valid campaign/continuity lineage contract.
6. **Enter / resume world**: bind current accepted world head to actor gameplay session, independently load actor-private state, and validate world revision before any world mutation. Character Save can record its last-seen revision for reconciliation, not assert ownership of the current authoritative world.
7. **World-affecting command**: authoritative world-domain mutation admits actor + `worldId` + expected world revision + stable request ID and verifies actor/item/target permissions, then atomically emits the single world consequence and actor-private receipt or rejects and refreshes. No two independent clients both win stale revisions; no duplicate market stock/goods from retries.
8. **Reload old character snapshot**: preserve permitted personal history according to accepted Stakes/Save continuity, but **never** restore stale shared world/clock/inventory transferred to other actors, time or market over an accepted newer world head. Resolve contradictions through explicit owner-controlled reconciliation, not implicit snapshot overwrite.
9. **Archive/close**: world history persists after death/retirement of an actor. Closing a campaign cannot delete the world used by another authorized campaign or erase accepted world events. Independent world deletion/retention is a separate future governance rule.

**Failure boundary:** If world commit fails, no usable world/character exists without a recoverable verified head. If world committed but character creation fails, world remains committed (possibly empty) for later Add Character. If an actor action commits world mutation but local actor publication crashes, a stable world mutation receipt must allow **idempotent** actor recovery, never replaying the world event or paying duplicate rewards. Existing new-campaign attempt and Save publication code offer useful patterns but do not already provide this cross-world transactional authority.

**No selected semantics for save rollback across multiple characters.** The future owner must distinguish **technical recovery** from permitted manual campaign checkpoint branching and whether shared-world effects are irrevocable. Default *planning safety invariant* is fail closed on restoring old actor state as global world truth. Stakes rules remain governed by their accepted owner.

## 5. Source, generated, simulated and viewer truth planes

| Plane | Example | Exists when | May cross into another plane only through |
| --- | --- | --- | --- |
| **Authored definition** | `region.verdant_thalos`, baseline settlement description, elemental taxonomy | Versioned base source includes it | Valid world generator or direct content resolver; not character discovery |
| **World seed candidate** | Possible religious order placement, eligible leyline confluence selection, generated village template | Generator proposes from permitted inputs | Validated seed commit, world-owner identity, uniqueness and rule checks |
| **Committed world fact** | This world's order exists at this location, world year, dungeon-core refinement state | Durable accepted world-head publication | Domain mutation owner, actor observation/evidence or explicit authorized social source |
| **World event** | Siege, eclipse, confluence shift, actual market trade | Actor/domain owner admits and records it at world revision/tick | Chronicle/character receipts and authorized per-character observation; not every character auto-knows |
| **Character observation** | The character recognizes a landform, sees a posted inaccurate chart, witnesses a shrine | World/head and observer evidence permit a specific viewpoint | Knowledge/discovery proposal and accepted evidence; no automatic complete map |
| **Personal map or learned clue** | Explored coast, approximate reported beacon bearing, known shrine name | Independent character/continuity evidence owner accepts it | One authorized character Atlas/Knowledge projection; no source-catalog rewrite |
| **Private control/account visibility** | Same account owns a second merchant/character | Authenticated account authority knows it for anti-collusion enforcement | Enforcement owner only; not public in-character recognition or a free map |

**Reference application:** Character A and Character B share W1. A inspects a chart of undiscovered coast, then leaves and retains one approximate northwest bearing. Character B sees no new map knowledge. A's separate legal market purchase changes world stock at revision R+1, which B observes if entitled. Reopening B's older campaign Save at R cannot restore old world stock. In W2, the same named canonical coast can be represented by the base authored definition but has its own world event history and actor-private charts.

## 6. Precise decisions still open, with recommendations

These are **not** blockers for this connector-only document. They are real questions at specific implementation gates:

1. **Q-W1: World naming/launcher:** Is `Create World` a separate launcher step, or may `New Game` create a world as an explicit two-step wizard? **Recommend:** require an identifiable **committed world before character customization persists**; allow streamlined first-run wizard only if it still records and reloads world commit separately.
2. **Q-W2: World ownership and sharing:** One account's multiple campaigns only, or can different accounts join the same world? **Recommend:** first bounded implementation = one authenticated account with multiple eligible lineages; design worldId/membership explicitly so later cross-account expansion needs permissions, not a new world identity. **Not a user-selected access rule.**
3. **Q-W3: World fork/copy:** Can a world be duplicated into a new branch for experiments, and when can descendants cross worlds? **Recommend:** no accidental world copy from campaign Save; explicit new-world fork operation and new `worldId` plus provenance only after shared-world history replay policies.
4. **Q-W4: Generated place scope:** Can generation create settlements/sites in an existing named canonical geography, and what unique namespace applies? **Recommend:** world-local generated namespace, stable parent canonical typed IDs or world-local parent key, validate geometry and uniqueness before initial world commit. No auto insertion into source `settlements.json`.
5. **Q-W5: Multi-character mutation consistency:** Are world-affecting accepted events irrevocable even when a Normal campaign save branches? **Recommend:** world head remains authoritative and cannot be rolled back by a single actor; show explicit reconciliation/rejection when old actor state conflicts with irreversible world facts. **Must be decided jointly with Stakes/Save before runnable multi-character feature.**
6. **Q-W6: Legacy current-save adoption:** Does an existing single-campaign Save acquire one inferred world through migration, or continue as a supported legacy solo environment? **Recommend:** **no automatic migration** during native-v3 work; future dedicated approved adoption must be idempotent, content-versioned, preserve accepted campaign/continuity IDs, and never reroll geography or seed while reading an old Save.
7. **Q-W7: Seed visibility and spoilers:** Which world-generated physical features are known at creation, reported, secretly placed or discovered only? **Recommend:** world truth may exist without viewer permission. Map/Knowledge source views are separately gated by PR #45; no world overview leaks undiscovered dungeon, confluence or routes.
8. **Q-W8: World time and dormant characters:** Which world owner executes Live/Attended clock and finite queues; how do aging, effects and time skips reconcile with simultaneous character sessions? **Recommend:** one world revision/tick, deterministic event budgets/receipts; no decision on wall-clock ratio, offline catch-up or permanent queue yet.
9. **Q-W9: Source generator/version stability:** Which edits to authored region/religion/element definitions affect already created worlds? **Recommend:** immutable world seed plus pinned source/generator revision at commit, with explicitly versioned forward migrations or world overlays; do not regenerate historical world facts when a base catalog changes.

**Design admission priority:** W5 (world-vs-campaign rollback), W1 (commit interface), W2 (world-sharing scope), W6 (legacy migration), W4/W9 (content/seed namespace) are the smallest set that must have owner decisions **before a world persistence implementation**. W7/W8 are mandatory before real generated geographic reveal/clock scheduling; they need not be guessed now.

## 7. Focused negative and positive future tests (not executed)

| Test | Invariant |
| --- | --- |
| **WI-01** | Create world validates source/policy then commits an exact durable world head **before** character creation; world without characters can reload. |
| **WI-02** | Retry same world creation intent after interrupted publication yields same world ID/seed/content revision, not a fresh world or duplicate account membership. |
| **WI-03** | Different authorized world attempts may reference `world_map.first_world` and `settlement.highcrown`, but **never** share saved world ID/history as a side effect. |
| **WI-04** | Two characters/continuities reference W1 exactly; B does not receive A's personal KnownLocation/map reveal, items, quest details or Knowledge snippets. |
| **WI-05** | Campaign/continuity/character identities remain distinct from `worldId`; successor and unrelated lineup rules preserve their separate owners. |
| **WI-06** | Old Character B checkpoint cannot roll back World W1 accepted A market/quest/world event, accepted clock, domain-ledger receipt or weather/landscape change. |
| **WI-07** | Two simultaneous world-affecting requests at the same prior revision have one admitted order; stale request fails/rebases according to selected owner and cannot double debit/credit. |
| **WI-08** | World mutation commit succeeds, actor Save publication fails: replay by stable receipt recovers actor outcome without a second world event or second reward. |
| **WI-09** | Generated place key collision with base ID or another W1 generated place is rejected; W2 may independently reuse same local key with distinct W2-qualified identity. |
| **WI-10** | Base settlement record changes after W1 created: W1 committed seed/world facts and historical receipts remain unchanged absent an explicit approved migration. |
| **WI-11** | World-specific order/dungeon/leyline candidate does not become canonical map content or actual entity without validated generation/commit/source owner. |
| **WI-12** | Accepted in-world religious order exists but unobserving characters do not gain lore/map markers/locations merely by reading world-source catalog. |
| **WI-13** | Accessible external chart carries fictional/unreliable markers; inspected depiction does not enlarge own-map, and leaving posted chart revokes exact depiction. |
| **WI-14** | World clock mode is world-scoped; Live real-time policy and Attended finite queues do not create independent per-character time or unearned work. |
| **WI-15** | A second character/session cannot edit committed seed, initial plot grammar, World Rules or Stakes through its creator. |
| **WI-16** | Legacy campaign Save loads under its original accepted contract; any future world adoption is explicitly authorized and migration receipt idempotent. |
| **WI-17** | Cross-world copy/isekai cannot import unapproved inventory, unearned Knowledge, World events, hidden map, trade rights or reroll old world history. |
| **WI-18** | Account anti-collusion can enforce same-controller market interactions without exposing that link in character-facing labels or granted knowledge. |
| **WI-19** | World publication incomplete, character creation rejected; world published but character creation failed, world remains usable and recoverable. |
| **WI-20** | Character dies/retired and campaign closes while other W1 characters exist: their world remains intact; campaign closure does not orphan or delete the global head. |

## 8. Exact disposition and no-repeat next step

**T8-A COMPLETE: world-first identity / seed / Save / place / observer / clock boundaries now have a distinct source-backed connector-safe foundation.** Nothing herein selects or builds a shared world save; it only locates concrete missing authorities and protected existing source owners.

**T8-B HELD:** future selected World/Account/Save owner must decide W1/W2/W4/W5/W6/W9, run authenticated local selected-source preflight and negative tests before proposing `WorldIdentity`, a new world publication store, migration rules, world generator, launcher UI or character-Save changes. **Do not modify native gear/Save implementation or install prompts from PR #46**.

**Other parallel tracks:** T1-B still requires local authenticated checkout for oversized settlements and world map geometry. T4 exact first gatherable source requires new authorized observed instance/item owner. T6 canonical NPC/provider seed remains paused. T9 hand/item station owners depend on native gear selection. Once this new T8-A file is registered in PR #24's single manifest, there is **no further general connector-safe portfolio audit to repeat** at unchanged source heads.

**Reopen only** on new user decision about world architecture, selected world-persistence consumer, actual source-head change in relevant identity/Save/world or canonical location data, or locally run test evidence. No game version, source content, runtime, Save, camera, image, UI, season, chart, religion canon or confluence geography changed.
