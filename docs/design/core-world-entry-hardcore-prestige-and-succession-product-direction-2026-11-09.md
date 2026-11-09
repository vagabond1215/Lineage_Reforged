# Core World Entries, Hardcore, Prestige Rewards, And Succession — Owner Product Direction

Date: 2026-11-09  
Repository: `vagabond1215/Lineage_Reforged`  
Status: **OWNER PRODUCT DIRECTION RECORDED; AUTHORING AND OWNER CONTRACTS PENDING; IMPLEMENTATION HELD**  
Source: owner discussion of Core introductions, environmental eligibility, Surprise Me, world rules, death, family continuity, estates and shared-world time.  
Scope: durable design intent; **not** production code, approved scenario canon, a content/schema contract, a new Save version, balancing acceptance, a mandate to change runtime modes, or an installation/replacement of the active Codex prompt.

This decision consolidates the latest explicit owner direction. It is more current than contradictory *product-direction wording* in older planning documents (especially an "optional/skippable" Core introduction, fixed numeric heir age and the assumption that Hardcore is a difficulty scalar). Existing accepted technical contracts remain valid until their owners are deliberately revised. Do not infer that all the systems below already exist in runtime.

## 1. Product intent and boundaries

**Core World Entries are multiple short, complete, authored narrative experiences for starting from very little.** Core characters have no significant standing, connections, usable wealth, property, privileges or easy advantages in their *current* circumstances. They need not have amnesia and need not be literally unskilled or history-free. Do not contradict the character-creator's actual saved identity, selected backstory, physical traits, starting equipment or origin geography. A past trade upbringing is not automatically an actual current job.

The present scope is **Core** only. Future earned/Prestige-gated social and economic backstories, rich origins, inherited property, royal exile and alternative starts are explicitly out of scope for Core scenario authoring. Do not predesign or constrain their costs, tiers, eligibility or narrative. Existing creator backstory metadata and runtime eligibility remain separate authority.

**Core onboarding is mandatory for an eligible Core character, short, descriptive and actually playable.** It is not a skippable UI tutorial, wall of tooltips, or fixed single story. UI navigation should remain discoverable by ordinary interaction; optional comprehensive Help/walkthrough content is later. Exact account-level versus per-character repetition and tutorial-reward eligibility remain a narrow product/abuse-policy question, not permission for farmable grants.

**World Entry is not the same thing as selected backstory.** A backstory is formative history; World Entry is the character's present arrival, deprivation, location, limited goods and first opportunity. Any scenario's claims (recent enslavement, isekai summoning, shipwreck, displacement, known associates, memory loss, employment) need specific narrative/character applicability and cannot be silently imposed on an incompatible character.

## 2. Narrative standard

Write a **continuous, coherent, short scene with literary value**, generally an authored opening of two to four connected paragraphs, followed by one or more meaningful action-driven continuations and a natural transition into ordinary gameplay. Paragraph count is a soft editorial guide, not a screen count or sentence limit. Deliberate fragments, terse lines and interior monologue are welcome only where they create a particular narrative effect; the UI must not mechanically fragment ordinary prose into isolated sentences or checklist cards.

The opening should establish sensory place, circumstance, immediate stakes, what the character can reasonably perceive, and a motive to inspect or act. NPC speech is welcome if a present, authorized NPC actually exists in the scene. Environmental observation must carry the scene where no NPC is present. Authored branches should react to accepted actions, not pretend unexecuted commands, items, relationships, wounds or encounters occurred.

The tutorial teaches, as owner-backed gameplay: **inspect surroundings or an object; obtain basic legitimate goods; equip clothing and a tool/weapon when available; consume food; move or travel and discover an ordinary next opportunity**. Order may have sensible freedom. Basic provisions may be gifts, salvage, donations or legitimate finds, not arbitrary inventory grants by UI. Narrative cues and subtle visual hints are preferable to rigid arrows. A Core completion/reward transaction needs an owner, durable progress and exactly-once semantics across retries and Save/restart. Do not invent an actionable pickup, local interior, dialogue endpoint, resource spawn, food effect or navigation command when its owner is absent.

## 3. Scenario catalog, applicability and randomness

**A setting contains a *catalog* of different eligible Core stories**, not one canonical intro per region, climate, biome or situation. Scenarios may be broadly reusable, limited to several environments, or highly specific. A scenario family (e.g. sheltered by strangers) can contain independently authored premises (innkeeper, charitable clinic, traveling rescuer); one scenario can also have authored environment, season and character realizations. Vary actual situation and decisions, not only cosmetic word substitutions.

Conceptual catalog examples, **not approved specific site placement or canon**:

| Candidate story family | Distinct possible scenarios | Geographic or context guardrail |
| --- | --- | --- |
| Stranger's kindness / temporary lodging | One-night inn gift; charity shelter; healer's discharge | Actual appropriate inhabited site and lodging/provider; many climates |
| Roadside abandonment / fresh start | Cart drop-off; newly freed transportee; separated traveler | Authored overland arrival and compatible selected history |
| Coastal/lakeside disaster | Open-sea wreck; lake-boat wreck; river craft accident | Verified water body, actual plausible landing/approach and local starting site; never landlocked shipwreck by default |
| Isolated wilderness | Broken wagon; abandoned camp; lost in woodland; stranded on grassland | Actual wilderness anchor, isolation and lawful route toward a survivable next step |
| Climate-specific survival | Desert caravan failure/oasis; mountain refuge; tundra snowbound awakening | Verified terrain and season/environment facts, actual refuge/water/source where claimed |
| Supernatural arrival | Isekai summon or magical manifestation | Explicit setting/cosmology and character-identity permission; cannot be ambient default lore |

Use **typed, validated circumstance predicates** such as `requireAll`, `requireAny`, `excludeAny` and optional variation selectors; these are *conceptual rule vocabulary*, not a declared live schema or available runtime tags. Eligibility may depend on world rules/start mode, continent/region/locality, terrain/elevation, coast or freshwater, actual site/route, climate/biome, season, authoritative weather, lineage, selected backstory, actual inventory/equipment and world facts. Missing or merely descriptive evidence must **not** pass a required predicate. A biome is ecological plausibility, not an instantiated nearby pond, inn, boat, caravan, NPC or harvestable object. Weather specifics require a valid current weather owner; climatic tendencies alone cannot establish that a storm is occurring.

Multiple scenarios may be eligible at one place. The creator should offer **direct scenario choice plus Surprise Me** from that *same validated eligible pool*. Resolve and commit the chosen scenario and relevant variance before gameplay; repeated Save/restart, back navigation or reset must not reroll for a favorable bonus. Use authored deterministic fallback when geographic coverage is sparse; never manufacture world or local-instance facts. Weighting may vary selection likelihood, not reward size, and must be auditable.

## 4. Ordinary Core versus Hardcore Core

**Ordinary Core:** character starts in or plausibly close to society, has little standing or useful property, but basic shelter, kindness, supplies or local opportunities can be discovered naturally.

**Hardcore Core:** starts **outside immediate society in actual wilderness**. The first challenge is isolation, protection from exposure, finding usable food/water/tools when supported, navigating with imperfect information and finding a viable route to people. This is a substantially different, grounded gameplay opening, not ordinary tutorial text with penalties. Scene must have a plausible survivable path and discoverable risk; no invisible unavoidable early death or guaranteed lucky-roll requirement.

**Difficulty and Hardcore are different questions.** Difficulty presets (Story, Favored, Mortal, Forsaken) tune forgiveness, progression and consequence thresholds; Hardcore is the owner's player-facing commitment to qualitatively different play (notably wilderness opening, deeper survival/navigation/logistics) **and irreversible actual character death**. Technical campaign design presently separates difficulty, `Heroic World`/`Grim World` rules, and `Normal Stakes`/future restricted Stakes. Preserve separate technical ownership and consciously design the Hardcore selection/presentation as a coherent combination, not as a legacy `runDifficulty.hardcore` scalar, a synonym for Forsaken, or an accidental change caused by choosing Grim World alone. Final campaign-rule ids and availability remain a separate future contract.

An **authoritatively resolved actual death is immediate, terminal and permanent**. It disables all further gameplay for that character; ordinary Save, autosave or earlier checkpoints must not enable rollback. Technical crash repair protects the latest valid authoritative continuity, never a discretionary rewind or undo of a committed terminal death. A zero-HP defeat may be a nonfatal rescue/capture only where the actual health/combat owner resolves that result; do not force every incapacity into death. Read-only character/Chronicle access survives.

## 5. Surprise Me and layered Prestige payout

The owner wants incremental-game-style Prestige-generation upgrades: earned-life/run value is calculated first, then validated difficulty/challenge/rule and persistent Prestige-generation benefits affect a **single auditable final settlement**. Do not conflate Echo experience/character level, existing account Legacy payout, Family Prestige ledger, and future Prestige currency; exact scope, eligibility and combination order need a dedicated payout-owner decision. Avoid duplicating awards across account, family and run settlement.

**Surprise Me adds a modest, capped benefit only to an otherwise eligible final payout**. Provisional tuning example, explicitly *not* accepted balance: up to **1% of qualifying post-other-modifier payout, capped at 100 Prestige**. Candidate formula: `min(cap, floor(qualifyingPayoutBeforeSurprise * rate))`, where initial example `rate = 0.01` and `cap = 100`. Both the rate and cap may later be separately upgradable with increasing Prestige cost. This contribution is calculated once at the final stage without feeding itself; other Prestige-generation modifiers must not compound the Surprise Me award again unless a separately accepted formula explicitly permits it.

Protect against short-run or reroll farming: commit the random choice before revealing the entry, retain its original source/receipt through restart, require genuine payout eligibility/meaningful run progress, prevent duplicate settlement, avoid a free positive award solely for intro completion, and use a stable owner-owned bonus calculation. The 1%/100 values are placeholders for testing the model; product tuning is deferred.

## 6. Death, descendants and continuity

**Death permanently closes only the deceased character.** It must not revoke existing unlocked heir-slot capacity, delete real offspring/kinship evidence, annul legitimate spouse/guardian relationships, erase family history, or automatically destroy a Living World. Heir slots are **capacity, never people**. A playable heir requires an actual persistent offspring/dependent record from adult in-game relationship/conception/birth or a separately authorized future adoption path; a Prestige purchase cannot generate an invented child. Family and kinship provenance, recognition, survival, availability and slot ownership still matter.

**Eligibility for independent play uses authoritative maturity/development and physical capability, not one fixed numerical age.** Terms like infant/dependent, child, adolescent/developing and mature/independent are conceptual examples, not mandated stage ids. Chronological elapsed time may be tracked internally for pregnancy, maturation, activities or event scheduling but need not be foregrounded as a character-age HUD field. Playability, legal/social adulthood, reproduction, education, combat capacity and inheritance authority must not be conflated. The previously discussed "15 years" was illustrative and is **not** a fixed universal threshold. Respect race/lineage maturation differences when actual rules require them.

When a Hardcore character dies, check validated **existing** heir candidates and unlocked capacity. If an eligible known heir is already mature and available, permit a lawful transfer/selection. If actual known heirs exist but are not yet independently playable, the succession becomes pending: world time may advance to an eligibility/exit point under the world-clock policy below. This cannot guarantee their survival, adulthood, custody or eventual ability to inherit. If none become eligible, end the character/family playable route according to the world-continuity rules, retaining historical records. A future **high-cost Prestige upgrade** may allow temporary control of an actual surviving spouse while waiting for an heir; this is explicitly deferred and **different** from the pre-existing married-in spouse character-creation concept.

## 7. Individual and Living World time

**Time belongs to the world, never independently to a selected player character.**

- **Individual World:** initially character-dedicated; permanent character death may terminate current play, but an authorized existing heir/line continuation may keep that world available. Advance its world state faithfully when the succession path allows.
- **Living World:** world may contain multiple player characters/families and outlive a dead character. Death and heir waiting are character-specific states; world history remains shared.

The owner has explicitly selected a **global synchronized time-skip rule** for Living Worlds: **accelerated world time may not start while *any* participating playable character remains in ordinary/normal time**. Characters can be in pending long activities, sleep, retirement, waiting-for-maturation or other accepted out-of-normal-time states; terminal dead characters cannot block progress merely because their records exist. Once all participating characters are outside normal time, the *world* advances only to the **earliest next authoritative exit/interruption point** (character availability, activity completion, owner event, succession maturity, etc.), resolves and publishes intervening world events, then stops for reevaluation. Never skip one family's calendar while another character is acting in normal time; never leap past an earlier exit to force an heir to mature.

If normal-time characters remain, a pending heir/estate advances at **ordinary shared world time**, not by immediate succession fast-forward. Long-duration resolution can be batched only if it preserves owner-authoritative ordering, events, randomness/replay, economic conservation, liability and Save durability. Exact time coordination, exit classifications and multiplayer/parallel character behavior remain future owner-contract work.

## 8. Estate operation during absence, time-skip and handoff

**The estate at death is not necessarily the estate delivered to a successor.** Death places assets and obligations into an appropriate pending custody/administration posture. Businesses, money, land and duties remain in the same world and can continue changing before transfer, under existing terms, agents, owner rules, contracts and risks. Examples:

| Existing asset or obligation | Possible grounded continuation |
| --- | --- |
| Staffed small shop or managed operation | Remains open with wages, stock, upkeep, taxes, manager competence and potentially reduced margin |
| Personal craft/workshop or unstaffed enterprise | Ceases work; deteriorates or may be liquidated by a legally authorized caretaker or policy |
| Rental property | Rent collection, vacancies, deterioration, tenant and repair/management costs |
| Merchant, bank or guild deposit | Contractual interest, fees, lockups, counterparty failure or other actual agreed conditions |
| Civic/royal stipend, guild entitlement, pension | May persist, expire or be reassessed based on actual entitlement holder and legal terms |
| Cash, movable goods, debts and liabilities | Held and accounted for according to storage, loss, interest, debt service, creditor claims, enforcement and custody |

Do not apply an invented universal "profit while dead" multiplier or freeze everything at the last player's death snapshot. Nor should estate decline/profit be guaranteed: a planned, staffed operation might do better than an abandoned workshop; a shop may require a sale before all value is lost, but **sale requires an authorized disposition policy/actor**, not UI narrative convenience. A previously owner-operated business cannot magically continue running itself. Different assets should respond to market and world changes as they occur. No live bank, rental, business operator or world estate owner should be conjured from account archival assets alone.

At death: preserve legal/financial source identity, custody, outstanding obligations and terminal receipts. During elapsed world time: resolve permitted operations, accruals, decay, contracts, disruptions and caretaker decisions at event boundaries. At handoff: reconcile actual remaining value, liens, taxes, ownership/claimants and transferable rights, then issue a single authoritative transfer/claim result. Guardians, courts or creditors may need to act **before** an heir's maturity; estate administration is not forced to wait until playability. A guardianship/spouse-control implementation is later and distinct from the base succession rule.

Existing `AccountEstateState` supports archived-run deposits/assets and limited previews, **not** live continuing property/business finance, bequest delivery, succession simulation or interest. Existing family/household/kinship/asset owner boundaries remain authoritative until expanded through focused contracts.

## 9. Ownership, implementation gates and priority

This is product direction and a scoping guardrail. Do not silently add runtime systems, migrations, client rollout, production activation, hosted Site deletion, backstory/Prestige tiers or broad testing.

**Immediate next design priority:** Core World Entry catalog and applicability contract. Make the first small group genuinely authored across multiple regions/biomes and both ordinary/wilderness starts. Validate per-scene content, compatible creator facts and concrete world sites. Require meaningful player-supported inspect/acquire/equip/consume/move steps and short prose continuity. Start with a coverage matrix and source-aware selection before implementing randomizer/reward ownership.

**Later owner contracts**, independently bounded: campaign Hardcore composite and restricted-Stakes activation; real wilderness/local starting-site placement; item acquisition, NPC/station and local context ownership; end-of-run Prestige generation and caps; world clock and global skip coordination; maturity, pregnancy/offspring, heirs and spouse; operations, custody, financial transactions and estate handoff.

**Useful acceptance evidence when implementation is selected:** no geographically invalid entry; multiple eligible authored entries for suitable locations; coherent prose; replay-stable Surprise Me; no unsupported local object/action; exactly-once earned tutorial goods and payout; actual wilderness survival and valid exit path; no playable dead character after Save/restart; no living-world skip while any participating character is in normal time; stop at earliest world exit; independent estate changes reconcile without duping currency/property; heir slots cannot fabricate people.

**Validation standard:** focused, useful owner and integration tests for the functionality introduced, not finished-product UI polish or exhaustive old-branch reenactment. Current-v3 Save/account/data integrity remains a hard safety boundary. The active native-v3 integration prompt and protected branches/PRs are untouched by this design direction.

## 10. Precedence and related decisions

- [Functional regional playthrough priority](functional-regional-playthrough-skeleton-priority-and-roadmap-2026-11-09.md) governs the near-term gameplay priority, subject to this later owner Core-intro clarification.
- [Local Scene / Context Projection](local-scene-context-projection-decision.md) governs character-observable facts, local-instance provenance and actionable owner boundaries.
- [Environmental affordance expansion](ecology-grounded-contextual-affordance-expansion-plan.md) inventories ecology compatibility versus instantiated activity.
- [Difficulty, Grim World and Stakes separation](difficulty-presets-grim-world-rules-and-stakes-separation-decision.md) and [Campaign Rules identity](campaign-rules-identity-migration-story-and-normal-stakes-decision.md) remain technical rule axes, not evidence that the composite Hardcore selection is implemented.
- [Restricted Stakes death and continuity](restricted-stakes-continuity-death-closure-and-prestige-decision.md) governs terminality and no discretionary rollback; this discussion adds owner direction on Core wilderness start, mandatory Hardcore permadeath, heir continuity and shared-world scheduling, pending a focused technical contract revision.
- [Offspring, heir and family continuity](offspring-heir-family-continuity-owner-plan.md), [family/ecology/civil society expansion](family-religion-ecology-civil-society-expansion-plan.md) and [family authority boundary](family-authority-boundary-decision.md) govern grounded offspring and capacity versus identity, with fixed-age assumptions now noncontrolling.
- [Heirloom and bequest plan](heirloom-and-bequest-systems-plan.md) governs estate versus item-chain/transfer identity.
- [Pre-alpha Save/native-v3 policy](prealpha-save-format-compatibility-and-native-v3-cutover-policy-2026-11-09.md) remains controlling for current integration, Save-format classification and existing account-data safety.
