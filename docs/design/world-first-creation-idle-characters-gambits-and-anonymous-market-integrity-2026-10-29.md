# World-First Creation, Linked Characters, Idle Gambits and Anonymous Market Integrity

Date: 2026-10-29 (America/New_York)
Status: **USER-DIRECTED PRODUCT INTENT; PROPOSED INTEGRATION BOUNDARIES ONLY.** Documentation-only companion to held draft religion PR #46. Not executable UI/Save, not new campaign generation, not new auto-progression, not implemented trade rules, not accepted re-entry/reincarnation or guild enforcement. Named consumers: future World/Account/Save, Religion/Plot Generator, Game Clock, Player/NPC Gambit, Economy/Trade/Guild/Law and Family/Stakes owners.
Precedence note: this more recent user direction refines the earlier PR #46 provisional "Standalone versus Living World" framing. **All characters should be created within an already-created world, including a single-lineage ordinary playthrough.** Living World principally broadens *how many independent characters/lineages* a world can host after gated unlocks, not whether the world existed first.

## 1. Product destination and world-first flow

**User-selected posture**: the **world is generated before its first character**. World seed and validated world premises are fixed/retained when character creation begins. The character **inherits the world's selected seed facts** and cannot overwrite the history of that world or force a different religious hierarchy to exist. The same world keeps its accepted chronology and mutations across all valid descendants and, after Prestige gating, multiple independent lineages/characters.

Proposed launcher flow, **not a UI implementation**:

1. Launcher → **Worlds** → **Create World** or **Continue World**. A world card has a distinct ID and generation status, seed identity/provenance, current era/date, known public characteristics, rules and linked-character roster.
2. Creating a world selects creator-owned options including base Difficulty, World Rules, Stakes, seed mode, optional idle-character progression, plot/religion settings and (later) supported advanced continuity rules. Creation-locked values require migration-aware change semantics, not a casual in-run toggle.
3. **Generate and validate world**: choose source-valid confluences, the eventual min/max number of associated religious institutions, culturally appropriate names, starting history, public/private order influence, political/quest arc premises, economy initial conditions, and time/era. Reject impossible conflicts, don't generate characters to fill holes.
4. **Commit world snapshot**, including one durable authoritative starting timeline, before opening **Add Character**. A failed generation is recoverable without partially playable world effects.
5. **Add Character** now uses this world's permitted ancestry/culture/geography/origin/backstory choices and the explicit Prestige eligibility for first character, additional unrelated characters, eligible heir, new lineage, or any rare cross-world arrival. The creator cannot change world seed, accepted history or shared world rules.
6. **Enter World** to select an eligible character, with one current active control at the initial proposed tier. All characters in the same world observe the same accepted world events, though personal knowledge, inventories, quests and family affiliation remain separate.
7. **Further Prestige upgrades** may unlock additional independent lineages, richer real-time-with-pause control, player gambits, business management and NPC staff gambits as distinct rights; none are created or activated by the existence of a world card.

**Recommended terminology**: `World` for the saved shared environment; `Campaign` for a character/lineage's ongoing play within that world (but retain existing technical campaign IDs until an explicit migration plan); `Living World` for the future multi-lineage Prestige-unlocked play capability. This avoids conflict with the already accepted **Story** difficulty, Heroic/Grim world rules and Normal/restricted Stakes. Final UI naming is still a user decision.

World-first creation **can be the default flow without changing existing character-generation code today**. The currently selected UI exposes continent/region/settlement through character creator and has no accepted separate generation/commit owner. Native v3 Codex stack is unselected. The future migration must assign world-owned fields vs character-owned selection precisely rather than letting UI hide a second incompatible seed.

## 2. Seeded orders are pre-character world facts

World generation uses a curated **confluence candidate catalogue** as authoring input and creates/retains exact world-specific selection:
- which physical confluence instances truly exist/once existed, with validated geography, time and elemental evidence;
- variable count `x` orders constrained by **future explicit floor and ceiling**, and selection of single-element roots and physical multi-element confluences;
- each order's stable **world-instance identity** and specific culturally appropriate name from a constituent-elements/confluence name bank; one confluence may support many rival institutions;
- attributes of *real* influence, public notoriety/mythic status, secrecy/hidden control, legitimacy, reach, resources and present activity as **different axes**, with historical causation tying them together;
- inter-order and civic political relationships and multiple eligible regional/international plot arcs based on world conditions.

**Mythical public status should usually have a historical cause** (age, established accomplishments, old hegemonic influence, famous records or enduring cultural significance) but does not promise current resources or military reach. A former great order may use propaganda to preserve prestige despite decline. **Hidden** is a publicity/discovery condition rather than a universal low-influence level; a powerful secret order may exist without the player knowing which one. None of these implies an objective deity exists.

The physically grounded catalogue is an *authoring candidate bank*, not a set of now-existing canon locations. Do not allow a seed to select an unproven site as already physically established simply because it sounds plausible. A future generation owner must reconcile constraints with actual world site/cell/region, time/climate and elemental sources.

## 3. World chronology and inactive character policy

**Hard invariant:** accepted world event order belongs to **one world history**. Switching characters, bringing in an eligible descendant or time-skipping a lineage does not rewind the shared world, erase another character's commercial results or regenerate the religious seed. A new character's private knowledge is unique; account UI may summarize world history but gameplay knowledge must remain perspective-specific.

User allows **creation-time gameplay option** such as `Idle Character Progression` (working label). It may have a relationship to difficulty/Grim/Stakes choices, but must not silently mutate those established axes. Recommendations for phased posture:

- **Off**: inactive characters remain in a stable owner-accepted state except for unavoidable world-time/global changes for which a future owner supplies consequences. Do not award free earnings or resolve hidden autonomous quests.
- **Conservative idle**: a character may continue **known routine assignments** with explicit budgets, hours, supplies, staff, work capacity and modest measurable output, under per-activity caps. Low-risk jobs may proceed; no unobserved high-tier windfall, lethal exposure, unsolicited risky expedition or invented skill gain.
- **Gambit-managed**: later high-tier Prestige unlock permitting explicitly authored and persisted condition→action instructions for active/idle characters, NPC employees and businesses, with controllable role and policy boundaries. Requires actual scheduled occurrences and source-owned effects.
- **Tactical world management**: a later advanced interface may allow instant-character selection in a **single paused world time stream**, issuing real-time-with-pause standing orders to multiple legal actors. Switching is not a second concurrent godlike character timeline.

**Do not combine these into one boolean rule without a product choice**. Player automation and NPC staff automation may be separate unlock trees. NPC employment must involve actual paid/contracted workers, schedules, wages, lawful actions and capabilities. A player-owned shop cannot endlessly produce revenue while unstaffed, unfunded and unattended. Inventory, salaries, fuel, rent, risk, perishability and opportunity cost should be conserved.

Potential idle risk categories:
- Low-risk routine production/service may have modest, bounded results backed by resources.
- Expiring contracts, rent, salaries and ordinary wear may progress if the world moves and their owners are active.
- High-risk expedition, crime, combat, irreversible choice, destructive action, character death, major heir/family mutations, illegal market manipulations or profound quest-ending outcomes should **pause, require player attention, or follow an explicit separately accepted high-Stakes automation policy**.
- An inactive actor should not become immortal by default if the world is dangerous; conversely idle progression should **not** cause unannounced terminal death merely because the player played another character. The exact risk/notify/pause policy is open.
- "No large windfalls or deaths unattended" is the current intended default for automated progression, **not permission to override independently selected Ironbound actual-death/closure rules**. If incompatible, the combination must be locked until owner policy exists.

Existing `docs/design/combat-ai-and-gambit-current-state-audit.md` reports functional **weighted combat tactics**, but **ordered gambit rules/editor, persistent player/NPC party gambits and general world/business automation are deferred**. The current `docs/design/world-command-vs-management-operation-boundary-decision.md` separates immediate world commands from standing policy/management operations. Future gambits must bridge to authoritative commands rather than performing unsourced inventory/currency/world mutations.

## 4. Rebirth / reincarnation / isekai across worlds or eras

The user suggests cross-world entry for an **existing character** only by explicit, **Prestige-gated rebirth/isekai** that adopts the new world's seed, rather than transplanting an intact character and their inventory, institutional standing, wealth or save history into an incompatible world.

Recommended **branching continuity, not destructive seed overwrite**:
- Retain the original character and original world's authoritative records as history, especially finalized/closed lives.
- A rare **new-world arrival** creates a distinct, validated playable character instance or heir-equivalent under future explicit rules, whose **destination world seed, world clock and history remain controlling**. The character may carry strictly bounded provenance/memory/aptitude flags where authorized, not incompatible properties, guild standings or economic wealth.
- No apparent resurrection of a finalized character within its original life, no backwards deletion of deaths, no identity double-spending, no manufactured offspring, no imported quest rewards or duplicated inventory.
- A *time skip for an heir* within the same world is a progression of the shared world timeline, potentially with major world events, rather than a different new plot seed. Existing active other characters and businesses would also be subject to the elapsed time. World-wide time skipping must not generate arbitrary profit/death; requires an explicit consent/impact gate and chronological resolution.
- Literal soul reincarnation remains **unproven**, and faith is not a prerequisite for Echo/Lineage mechanics.

Cross-world character re-entry, time skip and advanced management remain **separate deferred gates** from the main world-first creation decision.

## 5. Same-account multi-character anonymity and anti-collusion

User-settled design:
1. Each character has distinct Knowledge and only discovers facts through legitimate sources.
2. **Direct same-account item/currency/value transfer is forbidden**, apart from properly proven **heir/estate** pathways. A shared world does not make two separately controlled inventories a common stash.
3. Commercial sales by a player-owned stall, cart, shop, farm, business or intermediary are buffered by market/guild/economy owners to prevent self-dealing, including incidental encounters between one's own characters.
4. A secondary controlled character generally sees **aggregate area supply/demand and available goods, not a privileged list of its controller's other shops or sellers**. What independent unrelated characters can see is a separate legitimate observation policy.
5. Seller price selection may use relative **Very Low / Low / Average / High / Very High** options, each translated into an economy-approved local quote, not an arbitrary user-entered currency price. Exact bands, fees and stock are future economy design. Regulated market-clearing may still accept merchant competition and ordinary margins.
6. Merchant Guild is **not a universal monopoly on all trading**. Street stalls, carts and small shops may exist within local civil rules and actual merchant/shop/travel authorities; eligible direct NPC purchases can still occur with market validation.

**A warning + fine + sanctions sequence is desired**, scaled from minor or first-time mistakes to repeated or high-value corruption; any criminal prosecution/arrest or license revocation requires actual enforcement owner and narrative justice. But warnings/fines alone are insufficient anti-cheat: **invalid transfers must fail admission/settlement before wealth changes owners**.

### Why anonymity alone is insufficient

Suppose Character A owns a bread stall and Character B is also controlled by the account. Even if Character B's UI never displays A's name, a player might deduce or deliberately cause A's stock exposure using location, timing, production, prices, sole-seller supply or targeted theft. A market buffer reduces direct manipulation but does not defeat self-dealing if B can reliably buy from, rob, subsidize or route value toward A.

**Future implementation must reconcile the intended immersive "I pickpocket an anonymous stall" gameplay with hard owner-side safeguards.** Recommended:
- The engine checks account/beneficial-controller identity privately at transaction and theft/contract admission. It does **not** rely on the player's awareness or hide-only UI.
- Player-to-market sales detach individual seller/customer matching. Buyers select a **market-aggregate item/quantity**, not seller-owned lots or a controllable target, and execution uses fair stock allocation/conservation; no arranged self-sale.
- For anonymous petty theft, a *market-level encounter pool* may select a legal independent shop/NPC target, excluding same-controller owned or directly related beneficiaries. If no valid independent target exists, the action is unavailable or resolves as an honest failure with no stolen goods, not a substitution that invents goods.
- True observable individual storefront targeting and pickpocketing requires ordinary game-world perception and law/crime identity rules. If same-controller target is selected or inferred, reject/disallow profit transfer before effect, while preserving honest narrative feedback and not leaking secret ownership unnecessarily. Do not magically declare another character's business nonexistent in the shared world.
- A character must not automatically know they are interacting with the controller's other character's establishment based on out-of-character account ownership; the server must still know internally for economic safeguards.
- If legitimate non-player business is harmed, crime consequences belong to law/standing, and victim losses/damage require actual source evidence. Gameplay theft from the anonymous market must not generate arbitrary currency.
- A player-owned merchant character can trade only at arm's-length market terms and cannot route goods/discounts via a shell guild, NPC employee, controlled warehouse, alternate-character restaurant or manufactured market movement.
- Inheritance is the limited documented exception and needs accepted eligible family/estate evidence, valuation, tax/fee and anti-duplication rules before any cross-character transfer.

Anonymizing owner identities in one UI is **not a substitute for access control, beneficial-ownership checks or source-backed results**. Do not leak account ownership via informative error strings if the character has not discovered it; use appropriate generic market-limit feedback until a legal audit/revelation.

### Proposed violation response ladder, pending law owner

| Severity illustration | Suggested treatment | Gate |
| --- | --- | --- |
| Accidental first small out-of-band action | Reject improper exchange and explain normal rule; warning or modest applicable charge | Known policy and fair notification |
| Repeat attempts / moderate improper trade | Reject exchange, investigation/suspension, proportionate fine when lawful | Persistent audit and actual guild enforcement owner |
| High-value deliberate fraud / coordinated network | Block settlement, freeze suspicious authorized proceeds, serious fines or license loss | Real law/jurisdiction/guild owners and appeal/recourse |
| Severe criminal misconduct | Arrest/prosecution or broader consequence only where established law supports it | No global instant punishment or invented police NPCs |

These are player-facing policy **proposals**. Avoid automatic punishment from false positives; distinguishing an *attempted* improper transaction from an actually executed one matters. A market that blocks a disallowed exchange before completion should not claim that value was already transferred.

## 6. Source owners, non-interference, and prospective checks

Controlling/current source:
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md` governs accepted Difficulty, World Rules and Stakes distinctions; **world-creation/linked roster is a future separate capability**, not a secretly fourth implemented axis.
- `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts` and current character creator still drive continent/region/settlement selection; no new saved "world seeded before characters" creator path is implemented.
- `docs/design/ordinary-campaign-publication-capacity-and-retention-contract-decision.md` governs current Save/published-artifact retention; cross-character shared-world atomicity is not yet accepted.
- `docs/design/offspring-heir-family-continuity-owner-plan.md` protects genuine family records, eligible offspring and heir Prestige.
- `docs/design/combat-ai-and-gambit-current-state-audit.md`: weighted AI exists, literal ordered gambits are deferred.
- `docs/design/world-command-vs-management-operation-boundary-decision.md`: management standing orders are different from direct world actions.
- `docs/design/economy-command-surface-source-map.md`, `economy-authority-boundary-decision.md`, existing trade runtime and `civilization.guilds`: market and guild descriptors do not grant player trading execution, law or licensing consequences.
- `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`: narrative/scene visibility is limited to authorized observer knowledge.

**Proposed future regression cases (none tested):**
- WF-01 world seeded and saved before first Add Character; no character owns canonical seed;
- WF-02 character B uses exactly same world history as A without receiving A's private Knowledge;
- WF-03 Prestige unlock adds independent lineage while legacy heir path still requires real heir evidence;
- WF-04 entering character A's older save cannot undo B's accepted world/market event;
- WF-05 world-time advance affects selected and inactive actors consistently without free windfall;
- WF-06 conservative idle assignment cannot produce goods without required labor, inputs, wages and elapsed time;
- WF-07 no unattended terminal death or irreversible action without accepted mode-specific owner policy;
- WF-08 ordered NPC/player gambit cannot bypass command eligibility/market checks;
- WF-09 same-account inter-character direct gift, discounted sale and indirect NPC proxy are blocked before value mutation;
- WF-10 seller prices mapped from Low/Average/High presets remain owner-validated, with finite supply/demand and spread;
- WF-11 area market listing hides seller identity without leaking another controlled character's shop;
- WF-12 criminal action against anonymous market uses only a valid independent target with evidence; no self-store loot transfer;
- WF-13 controlled-merchant intermediation cannot launder goods or redirect favorable prices between same-controller enterprises;
- WF-14 legitimate heir/estate transfer requires authoritative evidence and never duplicates resources;
- WF-15 cross-world isekai entry preserves original world/character history and does not import unauthorized assets;
- WF-16 world time skip cannot retroactively change already accepted event history or give idle characters unearned windfalls;
- WF-17 violation attempts are distinguishable from completed crimes and sanctions require jurisdictional owner;
- WF-18 new world generation with different religious order count/name/tier does not change elemental canon or erase earlier worlds.

## 7. High-priority product questions still unanswered

1. What is the actual **min/max generated religious-order count** per world and are there regional caps?
2. Should a world be created automatically when the user clicks **New Game**, or separately via **Create World** menu before any Add Character?
3. Is a Prestige unlock required only for second independent lineage, or also for additional unrelated characters within an already unlocked world?
4. Can a pre-unlock world be converted to Living World retroactively once the account qualifies?
5. Is idle progress Off/Conservative/Gambit/Manager chosen at creation, or is a later in-world policy change allowed with audit?
6. Can world time progress only while one character is active, or also while game is closed (offline progression)?
7. What should happen to inactive aging, rents, crops, illnesses, missed deadlines and existing unsafe locations?
8. What concrete rules forbid unattended death without making inactive characters artificially immune to actual danger?
9. What are permitted manual/scheduled actions at the first world-management Prestige tier, and which need a separate gambit unlock?
10. Does a time-skip require all controlled characters to be safe/consent eligible, or can it accept and record unavoidable background consequences?
11. Does market anonymity cover all stalls or only shops controlled by the same account? What can the shopper legitimately inspect?
12. Do regulated prices apply to every market transaction or only suspicious self-dealing? How does local scarcity affect bands?
13. What are the consequences of petty theft from an area-aggregate market, and how should stolen stock decrease without violating inventory conservation?
14. Should first-time improper trades simply fail with a warning, or can a small legitimate administrative fine apply on attempted violation?
15. Should the high-tier cross-world rebirth create a new separate character instance preserving an ancestor's Echo, or copy/rehost an actual living character?
16. Should inactive characters be allowed to participate in world politics and quest arcs automatically, or only continue ordinary prior assignments?

## 8. Branch hold

**HOLD_NAMED_CONSUMER**, independent draft PR #46, docs only. No changing `master`, Codex native v3 PR #44, PR #45 Area/Atlas, PR #40 tools/stations, active coordination files, World/character creator UI, Save, engine/gameplay, guild market behavior, NPC systems, existing religion JSON, schema, tests or Game version. This is **not** an instruction to enable a novel implementation and no tests were executed.
