# Universal World Save, Heir Handoff, and Living-World Continuity

> **2026-11-01 cross-track T7 Chronicle evidence:** [Read-only heir/world-history/character-memory source audit](https://github.com/vagabond1215/Lineage_Reforged/blob/ac9b19a427051e2494ae1c3b7031dd5fb2b4dc90/docs/design/chronicle-heir-handoff-world-history-and-private-memory-source-boundary-2026-11-01.md) on held PR #24 distinguishes actual account run history, current session Chronicle, private discovery and the **future** world event ledger. It finds a concrete selected-master UI copy inconsistency: `accountMetaPresentation.ts` labels a mere `sourceRunId` link **"Descended from"**, while run-end detail correctly says source linkage does **not** prove parentage. **Do not** manufacture an heir, ancestry, world history or private Knowledge from a linked run, and do not activate any Chronicle/Save code from this PR #46 design file. Its selected-client fix is owner-gated.

Date: 2026-10-31 (America/New_York)
Status: **USER-SUGGESTED DESIGN, STRONGLY RECOMMENDED / CONNECTOR-SAFE PROPOSAL ONLY**. **Not** a running World Save, format, Save migration, selected world time policy or implementation authorization.
Topic home: held [PR #46](https://github.com/vagabond1215/Lineage_Reforged/pull/46), T8. Resume/source index: [single live parallel-work register](https://github.com/vagabond1215/Lineage_Reforged/blob/connector/barebones-playable-ui-planning-2026-10-26/docs/dev/connector-safe-parallel-progression-register-2026-10-31.md).
Selected inspected master: `a596112acf3945f2bf7c625e943f2511d12aa710`; active native-v3 Save and selected-client branch is separate and remains untouched.

## 1. Why a world save is preferable for every world

The user proposes a distinct persistent **world save** for Living Worlds, **possibly also single-lineage or Attended worlds**, whose history may be *passed on to an heir*. This is a coherent and strongly recommended extension of earlier user-selected world-first creation and shared-chronology direction.

**Recommended product destination (not yet accepted executable authority): EVERY world receives an independently addressable, durable world save before its first character.** It owns one committed world's identity and state. A character/heir references that same existing world instead of generating, copying, overwriting, re-rolling or inheriting an entire save as a new character-owned blob. The world can survive founders, retiring lineages, inactive characters and Prestige expansion to a Living World.

**Do not confuse orthogonal dimensions:**
- **World participation / roster:** first single-lineage world versus later multi-lineage/multi-character *Living World*. This is a progression/permission distinction, not a different world storage format.
- **World clock:** user-selected **Live** (world clock can advance with bounded elapsed real time) versus **Attended** (world time advances during direct play or accepted finite queued attendance, else pauses). Both modes can have one or many eligible characters, subject to future policy. Neither is a reason to maintain per-character world clocks.
- **Stakes and save topology:** Normal, Committed, Ironbound and checkpoint/recovery rules remain separately governed by accepted Save/Stakes contracts. **World Save** is a persistent owner, not a new difficulty axis, a guaranteed rollback button, or a bypass of those contracts.
- **World generation:** original seed/initial historical premises commit before character creation and stay fixed unless an explicit later migration/fork is authorized. A world is not re-generated when another character, heir or Prestige unlock joins.

**Heir handoff principle:** the world is **continued**, not copied. The heir acquires an accepted **participation/lineage relationship** within the same world, new character identity, permissible family/estate inheritance, and its own valid observations. The world retains the founder's legal buildings/ownership changes, past battles, local economy, religion, dungeon state, political changes, accepted world clock and Chronicle. No personal lore, hidden map, items, wealth or powers transfer just because the world persists.

## 2. Layer separation: world owner versus character/lineage owner

| Proposed durable layer | Owns (only after a named future owner) | Never implies |
| --- | --- | --- |
| **World identity and seed** | Immutable `worldId`, world name/metadata, generator/content/policy versions, accepted creation seed, source-world relation, commitment receipt | Character ID, seed re-roll at load, globally revealed map, a new base canonical place catalog |
| **World head / history** | Current authoritative revision and clock, accepted durable world-domain events, region/settlement state and world-wide consequences, bounded event receipts | Saving an actor's private inventory is sufficient to mutate world history; loading a stale actor save rewinds the world |
| **World domain records** | World-local generated sites/landmarks, existing canonical-place state variants, dungeon cores, active faction/order state, economy/market, durable world services and fixture changes through real owning domains | Automatically installing all candidate places/leyline confluences or speculative content; religious belief proving a physical location |
| **World membership/participation** | Which campaigns, character identities and lineages have legitimate access; heir/Prestige/continuity evidence; owner/account permissions | World sharing is automatically cross-account; all characters have equal rights or discover each other's secrets |
| **Campaign / continuity / Stakes** | Accepted campaign/continuity IDs, approved checkpoints, terminal state, policy, separate rollback/technical recovery and lineage records | Arbitrary chosen world rollback, deletion of worlds with surviving characters, conversion of forked history into an already accepted world event |
| **Character-private Save** | Character identity, personal body/skills/equipment/items, quests, location, accepted Knowledge/map reveals, private notes and selected play state | World map entirely known, shared map or inventory, private access to other characters' reports |
| **Lineage and estate** | Genuine family/heir relation, eligibility, named transfer/estate ownership and receipts, hereditary achievements/Legacy as currently authorized | Copying all ancestor's state, automatic shared stash, duplicate item instance, generic death/rebirth authority |

**Current repo evidence:** `packages/shared/types/src/contracts.ts` distinguishes `SaveSnapshot.accountId`, `campaignIdentity` (campaign/continuity/character ids), embedded `clock/worldState/civilizationState`, `playerState` and `sessionState`. There is no independently committed world instance, world head or world save owner at selected master. `newGameSnapshot.ts` selects static authored world *starting geography* in character creation, not a pre-created world; `saveManager.ts` protects campaign artifacts and recovery, not shared-world publication across characters. This proposal does **not** change those sources or claim a World Save already functions.

For formal identity fields, world instance namespace/collision rules, atomic publication and legacy migration, read the immediately preceding [T8 world-instance source foundation](world-instance-identity-persistence-canonical-place-and-private-knowledge-foundation-2026-10-31.md); do not invent a second schema or change canonical owner.

## 3. One world save through the generations

Example, **no fabricated world canon**:

1. **Create W1:** one stable `worldId`; accept and persist a single seed/initial map/era/clock and future World Rules/Stakes policy source; world head must verify before adding a character.
2. **Founder A enters:** create the founder's campaign and private character Save referencing W1. The player's map only shows personally discovered geography; the world knows far more than the founder.
3. **Founder A acts:** a real world mutation (e.g. founding a business, damage to a settlement, changing a legal trade stock) commits once to W1's authoritative world history and produces source-backed actor receipt. Personal item/quest mutations go to the appropriate private/continuity owner.
4. **Founder A retires or dies:** owner-accepted terminal/retirement/estate and family evidence records the consequence. W1 does not die, delete, rewind or re-generate because A ends.
5. **Heir B becomes eligible:** a real heir/lineage continuity operation binds B to the **existing W1 world ID and accepted current world head**. B's starting time and surroundings reflect what happened since A. If the design admits a time skip, it advances **W1** under one world-clock/event policy and affects all other eligible characters/businesses.
6. **B receives inheritance:** validated assets, deeds, maps, known family teachings, titles and estate transfers can be claimed only through authorized family/estate/item/knowledge transactions. B does **not automatically inherit** A's skill rank, full atlas reveal, carried map art, private perceptions or inventory simply from the same `worldId`.
7. **B continues:** W1 world save remains the same continuing history; a later unrelated character C could participate only if permitted by Living World/Prestige/account rules, without receiving B's private state.
8. **Archive:** a read-only family/world Chronicle may display **authorized** ancestor accomplishments from durable receipts. The world is playable without requiring that its initial founder still exist or have an active save.

**Important distinction:** An inheritable **physical world-chart item** may transfer legitimately and be studied by the heir; an inherited *family journal* may teach valid route clues through future knowledge-source acceptance; neither means magically copying all discovered geography.

## 4. Normal, Attended, Live and Living use the same storage architecture

| Example | World Save behavior | Character/clock policy difference |
| --- | --- | --- |
| Single-lineage world (ordinary) | One world head, starts before founder, remains after death and across heirs. | Only permitted active character(s) or descendants; no automatic Living World roster privileges. |
| Single-lineage **Attended** world | Same world head and persistence | Clock pauses without accepted player/finite-queue attendance; one source of time when activity runs. |
| Single-lineage **Live** world | Same world head and persistence | Bounded real-time world tick/catch-up admitted by future world owner; character Save does not compute offline gains alone. |
| Multi-lineage **Living World** | **Same world save**, no fork when eligibility expands | Authorized independent campaigns/characters reference one world; their personal saves remain separate. The world may use Live or Attended clock subject to its own selected world rule. |

**Recommendation:** model Solo/Living and Live/Attended as separate world-level feature/capability settings, with eligibility and creation-lock/migration rules to be chosen, not separate save formats.

## 5. Save slot, checkpoint, world branch and recovery semantics

**Highest-risk seam:** current accepted Stakes contracts permit particular campaign checkpoint/continuity behavior; an older character snapshot may carry an older embedded `clock/worldState`. **A World Save removes those embedded fields' authority to override the current shared head.**

- **Character Save/Continue** selects a personal/campaign artifact consistent with its owner. On load it attaches to the **latest authorized W1 head**, or declines/reconciles if its private state cannot coexist, rather than overwriting W1 with old world/market/clock facts.
- **World Save/Continue** identifies a world and its durable current head, then enumerates characters/lineages/campaigns legitimately connected to it. A world title/card may show name, world age, seed/mode label, last accepted world revision, last played/current era and eligible continuations, but discloses no private secrets to unauthorized viewers.
- **World snapshot/checkpoint for recovery** is a verified durable recovery generation/event compaction boundary, not permission to roll back all world participants on a whim. A world event log plus periodic verified snapshots is an **architecture recommendation**, not a required literal storage engine.
- **Ordinary rollback is a policy question, not a free operation**. In a shared Living World, individual character rollback cannot undo accepted events, transactions, heirs or other characters' outcomes. For single-lineage worlds, a possible explicit **Fork World** / **Restore as New World** feature could copy a complete internally consistent selected world+eligible-character checkpoint into a **new worldId**, with new provenance, **without overwriting the original world**. This may later coexist with Normal/Committed/Ironbound restrictions only if Stakes and Account/Save owners approve it. Do not silently implement this escape route.
- **Technical recovery** after corruption must select an authorized verified generation and either replay durable world events forward or perform accepted compensating corrections. It cannot use an old character save as an excuse to rewrite surviving participant history.
- **Atomic cross-scope mutation:** when gameplay affects W1 **and** A (e.g., buying something), record one stable world transaction/event and one actor debit/item/receipt with idempotent recovery. If actor publication fails after the world commit, recover the pending actor effect exactly once; never duplicate items, transfer value or world stock by retry.

### World export and portable inheritance

A player may reasonably want to **back up or export their world** for safekeeping. Distinguish:
- a **World Backup/Export**: versioned, validated, portable authorized world head/history plus explicit permitted member/campaign data, never a free entitlement or account-sharing exploit;
- a **Heir continuation within W1**: **no copied world file**, simply a new heir relationship/character Save referencing W1;
- a later **Copy/Fork as new world**: only explicit identity revision, world and campaign permission/branch policy, and clear player-facing labels.

Do not expose imported world records as trusted game economy/Prestige entitlements without verification. Account-wide achievements and anti-collusion remain separately owned.

## 6. World-first runtime startup: load the world, then load the character

**User question/clarification:** Would selecting and loading a saved world effectively **start a server**, after which the character is loaded into that world? **Recommended design: yes, conceptually.** Load the authoritative **world runtime** first, then attach the selected character or heir. Distinguish an authoritative runtime *service* from having a permanently running dedicated network server process for each solo world. This clarifies order and server boundaries, **not an installed server design**.

### Proposed lifecycle (one world, many possible actor sessions)

1. **Choose an authorized World Save**: Account/World selection returns a world ID, World Save status and permitted mode. The world definition/seed exists before characters. Verify authenticated right to load that world. If new, commit the world before character creation.
2. **Open or locate its runtime host**: If an authoritative world runtime for that world is already active, attach to **that same** world owner; otherwise start one in a chosen host. A solo prototype can host a server-like simulation **inside the local application process**; a multi-client Living World can use a persistent or on-demand backend world service. Host placement is infrastructure, not a new world identity.
3. **Load the verified world head**: Read latest accepted world snapshot/checkpoint + event or publication receipts and versioned seed/content provenance. Reconstruct world-specific geography changes, clock, world economy/factions/religion/dungeon/leyline states only from authorized durable source owners. Recover incomplete publications idempotently; acquire a world-appropriate single-writer/ordered-commit lease or equivalent concurrency guard.
4. **Admit time policy and catch-up**: If **Attended**, restore its accepted time and advance only with live direct attendance or certified finite queued attendance, not a fabricated elapsed wall-clock difference. If **Live**, either reconnect to a still-running world scheduler **or** apply bounded, deterministic, idempotent elapsed-time catch-up before admitting player commands. Offline state must not require an always-on dedicated server process for each world. Any offline queues/gambits must have an approved real scheduler/worker or be processed under a separately accepted catch-up contract; neither exists yet. World clock/head remains singular regardless of connected characters.
5. **Then select/load the permitted character or heir**: Verify campaign/continuity/character identifiers, heir legitimacy/Prestige/roster eligibility, current world membership and Save/technical recovery. Read character-private inventory, skills, quests, knowledge, revealed geography and recent personal state. Bind this character to the **currently accepted world revision and time**; validate potentially stale location, legal access, owner events, life/aging/stakes and interrupted commands without transferring unrelated characters' secrets.
6. **Attach character session and render Current Area**: Character commands submit to the authoritative world/domain admission path and update both world and character owners through stable request/receipt/recovery contracts. UI uses current accepted observer context and only the character's actual map discovery; broader Codex → Atlas remains separate. Starting a character must **not** start a second competing simulation of W1.
7. **Unload character vs suspend world**: Character logout/checkpoint closes only its actor session. The world service may remain running (other active participants, valid finite queues or configured Live worker), be evicted/restarted on demand, or pause under Attended rules. In all cases **the World Save persists**. When the founder dies, the next heir attaches to **the same worldId/head** after real eligibility and inheritance transactions; this is not a server reset or clone.

```text
WORLD SELECT / WORLD CREATION
  -> World Save verified / committed
  -> start-or-join authoritative World Runtime (server-like world owner)
  -> recover world head + apply admitted clock policy
  -> select existing character, legitimate heir, or permitted new character
  -> load & reconcile character Save against current world revision
  -> attach player session -> Current Area / legal actions
  -> character disconnects; world survives independently
```

### Host implementation options, without fragmenting game rules

| Host option | Suitable for | Constraint |
| --- | --- | --- |
| **In-process authoritative world runtime** | First single-player / offline-friendly prototype | Still one world owner and authoritative Save path; not a mock simulation. Persist on stop and recover exactly. |
| **On-demand server-owned world session** | Authenticated online worlds or worlds shared across sessions | World ID maps to one ordered authoritative runtime/lease; support crash restart and no double active writer. Not necessarily one OS process per saved world. |
| **Always-on scheduled worker / server** | Later Live worlds or world queues that must process between player sessions | Worker admission/event budgets and catch-up/recovery must be proven; no perpetual process assumed for each world. |
| **Multi-client Living World runtime** | Prestige-enabled permitted concurrent character control | All participants share a server-authoritative world clock, event order and head; actor/character privacy, membership/anti-collusion and owner validation hold across sessions. |

**Core design distinction:** The **World Save is durable data**, the **World Runtime is its authoritative executable simulation**, and the **Character Save is a private actor continuation**. They are not interchangeable. Loading a world may instantiate the simulation, but saving a world does **not** literally save an operating-system server process or memory image. The selected world service may run locally or remotely provided both satisfy the same committed-world identity, deterministic command/event/receipt ordering and Save durability requirements.

**Failure/safety gates:** A half-recovered or invalid world cannot admit character mutation; stale client/campaign snapshots cannot win over its accepted world head; two callers cannot start competing world writers; a character reconnect cannot duplicate a receipt or fast-forward the clock; Live catch-up cannot create free income or irreversible unattended death; paused Attended worlds cannot accidentally advance due solely to reconnect. These are new *future test responsibilities*, not claims that any server already meets them.

## 7. Proposed future source-to-display journey

```text
Worlds
  └─ W1 · [World Name] · [Attended or Live] · [Single-Lineage or Living]
        ├─ World summary / timeline / authorized map reference (discovery-filtered)
        ├─ Continue Character A (if eligible)
        ├─ Continue Heir B (after accepted heir handoff)
        ├─ Add Character / New Lineage (if unlocked)
        └─ Backup / World Details (separate authorized operations)
```

This is one possible launcher structure, **not** a selected UI route or invitation to expose the world map globally. The world card is a *continuation container* for eligible play. The actual gameplay landing remains **Current Area** and broader personally known geography stays in **Codex → Atlas** per held PR #24/#45.

Avoid UI that says "World Save transferred to B" if it could suggest W1 is removed from A or rewritten. Prefer "Continue this world as B" or "Pass the lineage to B" while W1 remains an identity in its own right.

## 8. Narrow decisions still needed before implementation

The user has proposed the **World Save** concept, including use across all modes and inheritance. **This document endorses the idea as a recommendation; it does not assert the user has approved all detailed rules.** Only these questions materially affect the first World Save owner:

1. **P1 / World continuity and heir:** Is the heir's continuation **same world/head and existing worldId**? **Recommended yes.** Is a successful new heir a new Character identity, with existing campaign/continuity semantics preserved by existing owner? **Recommended yes.**
2. **P1 / Saved-world scope:** Should **every** mode start with a world save (recommended) versus first only Living Worlds and later migration? **Recommended every world from the first implementation**, to avoid separate Save formats and later irreversible migration.
3. **P1 / Rollback and forks:** Does a player in a single-lineage Normal world get an explicit **Fork/Restore as New World**, instead of undoing W1's shared accepted history? **Recommended optional later and world-safe**; no immediate scope.
4. **P1 / World access/sharing:** Should the first World Save be **account-private**, with later permission to invite unrelated account identities? **Recommended begin account-private**, preserve future member/permission identity hooks.
5. **P2 / Cloud/portable export:** Should world backup/export be portable between devices or accounts? **Recommend future authenticated versioned backup**, separate from live shared-world authority and anti-collusion.
6. **P2 / Succession governance:** Which heir transfer is mandatory/automatic versus user elected; what happens to a world after all characters die? **Recommend world retained**, heir playable only after actual family/Prestige/Stakes eligibility.
7. **P2 / Mode changes:** Can a single-lineage world become Living without creation reset; can an Attended world ever switch to Live? **Recommend no reset on Living unlock**, but clock-mode conversion separately admission-gated and possibly creation-locked until full effects/queue policy exists.

These are **future owner questions**. No user answer is necessary to record the recommendation or to keep connector work safe.

## 9. Proposed acceptance cases, not executed

- **WS-01**: Solo initial world commits a re-loadable World Save before founder creation, even if the founder never launches.
- **WS-02**: Ending founder A does not delete, re-generate or copy W1; an eligible heir B references the identical `worldId`, new character identity and current accepted W1 revision.
- **WS-03**: B sees durable effects of A's legal world actions, but does not automatically receive A's personal map, secrets, inventory or skills.
- **WS-04**: A genuinely inherited chart/journal teaches B only through physical transfer + accepted observation/study/Knowledge evidence, never free reveal.
- **WS-05**: Progressing W1 from single-lineage to Living preserves identical worldId, world clock/history, existing character/estate receipts and personally private information.
- **WS-06**: Both Live and Attended modes load/save using one world owner; mode affects only accepted time advancement policy, not world storage topology.
- **WS-07**: Reloading a retired founder's old Save can neither rewind W1 nor change B's world effects; reject incompatible private/world head instead of inventing a second timeline.
- **WS-08**: World commit succeeds but heir publication fails: W1 remains available, retry is idempotent and no double inheritance/Prestige occurs.
- **WS-09**: World-affecting trade with interrupted actor Save recovers once with conserved stock/currency/items, not twice.
- **WS-10**: Actual World Backup is recoverable and version-verified; rejected/corrupt backup cannot install invented account achievements, duplicate items or override a living accepted world head.
- **WS-11**: Explicit future world fork mints **new worldId**, records ancestry/provenance, never overwrites W1 and obeys Stakes/Account restrictions.
- **WS-12**: Living character B and inactive character C share **one** world tick/head; neither obtains another's Knowledge or authorized merchant identity.
- **WS-13**: A world with zero active living characters is retained/recoverable; no automatic delete or new character granted without correct eligibility.
- **WS-14**: World-specific generated village/leyline/dungeon state persists across heirs without rewriting canonical base source registries or fabricating maps.
- **WS-15**: Export/restore/recovery never silently converts Live to Attended or switches World Rules/Stakes; explicit authorized migration only.
- **WS-16**: Solo Normal/Committed/Ironbound checkpoint and technical recovery rules remain source-owner safe; world backup is not a hidden loophole.
- **WS-17**: World list can show a permitted world name/mode/current era without leaking undiscovered location names, future plot seed secrets or another character's map.

### Additional startup/reconnection tests (future, not executed)

- **WS-18**: World Save verifies and world simulation initializes **before** any character/actor session receives legal command access.
- **WS-19**: Selecting the same active world from two authorized clients attaches to one ordered authoritative world head, not independent servers or duplicated world state.
- **WS-20**: An Attended world with no direct attendance or eligible queued work resumes without invented time progress after days offline; an active certified finite queue uses one accepted scheduler.
- **WS-21**: Live world disconnected for days either has accepted scheduled events or performs bounded idempotent catch-up before actor admission, without duplicate rewards, impossible missed commands or unannounced terminal outcomes.
- **WS-22**: Reconnect with a stale character Save reconciles its actor state to the latest world head and does not restore stale global clocks, market events or geography.
- **WS-23**: World host crashes during an event/actor receipt; verified world restart and retry exactly once maintain world and character consistency.
- **WS-24**: Founder ends; world host may unload; eligible heir opens the same World Save/head and recovers durable effects without regenerating geography, rerolling seed, or inheriting founder's private Atlas.

## 10. File placement and stop rule

This is one **nonduplicative T8-B World Save topology / heir-continuation proposal**. It **extends** the already recorded world-instance identity foundation; it does not supersede its identity graph, detailed WI-01..20 test cases, accepted PR #46 world clock/heir world-time skip direction, PR #45 observed-only Atlas map disclosure, the current Stakes/Save implementation, or the active Codex PR.

Proposed register status: `WORLD_SAVE_UNIVERSAL_RECOMMENDED; USER_SUGGESTION_RECORDED; OWNER_DECISIONS_AND_RUNTIME_HELD`. Future work **only** after a real World/Account/Save owner picks world persistence and Save rollback policy, or the user explicitly decides above questions. Keep all parallel work on existing draft PR #46/#24 and do not install any Save migration or world generator while native-v3 selection is active.
