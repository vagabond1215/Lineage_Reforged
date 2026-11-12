# World Progression Modes, Hardcore Ownership, Time, and Cross-Mode Currency: Owner Design Intent

Date: 2026-11-12 (America/New_York)  
Status: **Owner-directed product intent, proposed owner contracts and UI prototype; NOT gameplay implementation, accepted IDs, currency balance, or permission to migrate Saves.**  
Product home: [Welcome / World Library / Character Entry / Loading](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md).  
Previous authority: [Core/Hardcore/Prestige/Succession direction](core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md), [campaign rules identity](campaign-rules-identity-migration-story-and-normal-stakes-decision.md), [restricted Stakes](restricted-stakes-continuity-death-closure-and-prestige-decision.md). This new direction supersedes their **player-facing selection placement**, not their existing technical distinctions or implemented contracts.

## 1. Selected direction versus open questions

**Selected product intent:**

1. **Two progression experiences with a shared simulation and World owner.** Provisional player-facing names: **Chronicle** (repeat runs, inherited legacy and accelerated World-time possibilities) and **Persistent** (long-lived character/World, ongoing growth and more real-time pacing). These are **World progression modes**, not the existing `Individual World` / future `Living World` participation topology.
2. **World-owned Hardcore commitment.** Select Hardcore when creating the World; every character in it receives an effective Hardcore flag and applicable Core wilderness/death/continuity rules **from the verified World**. Character Creation must not independently enable/disable Hardcore. Keep underlying difficulty, Grim/Heroic World rules and Stakes rules separate technical axes. A player-facing Hardcore World choice eventually maps to an explicitly accepted, versioned composite, not automatically to legacy `runDifficulty.hardcore`, Forsaken, Grim World or a currently unavailable restricted-Stakes ID.
3. **World-owned clock, pause and speed policy.** Eating, crafting, travel, study and other timed actions **start a finite activity**; starting/completing one does not itself skip the World clock. It progresses only as the authoritative World clock advances under World rules. A five-World-minute meal ends after five *elapsed World minutes*, not from an instant click or local tab timer. A paused World freezes World-time activity progression, but not transactional revision/conflict guards. The option for a **no-pause World** is being considered for Hardcore and/or Persistent; the final allowed combinations are **not** yet fixed.
4. **Different progression economies with genuine cross-mode incentive.** Each mode earns a unique spendable progression resource through validated achievements in its own loop. Specialty account-level upgrades can benefit one mode, the other, or both, without turning the faster repeat-run loop into a currency exploit or making either mode obligatory for basic viability.
5. **Welcome is a mode-selection surface after authentication.** Below the branded Welcome/name, show two large descriptive selection cards labeled Chronicle and Persistent, responsive as side-by-side wide cards or vertically stacked choices. Artwork can be authored later; **text labels and descriptions are enough now**. This is not permission to create Worlds or mint balances in L1.

**Open contracts, not yet selected:** mode machine IDs and player-facing final names; persistent fixed World-clock-to-real-time ratio (1:1 versus a modest fixed acceleration); whether no-pause is a selectable Hardcore modifier or mandatory in any mode; offline simulation/safety; World pause voting/authority once Living World exists; duration/cooldown tuning; currency names/rates/caps/purchases; cross-mode reward eligibility and anti-exploit limits; mode changes and data migrations; later compatible Stakes and prestige-generation formulas.

## 2. Distinct gameplay loops, one simulation engine

| Axis | Chronicle (repeat-run) | Persistent (long-life) |
| --- | --- | --- |
| Primary goal | Finish meaningful lives/runs, found legacies, earn long-term unlocks for subsequent characters | Grow a character, profession, community and holdings over many real sessions |
| World time | World-owned acceleration may become upgradable within a tested upper bound; explicit authorized time skips are separate future work | Fixed, predictable World speed; potential 1:1 or modest continuous acceleration, with no player-triggered fast-forward |
| Pause | Allowed where chosen World rules permit | May be no-pause, but this is not automatically synonymous with 1:1 or Hardcore |
| Progression | Run-end settlement plus legacy and earned character/world milestones | Continuous authenticated activity, achievement, mastery, ownership and durable accomplishments; not idle-tab farming |
| Hardcore | World-level optional commitment when the required survival/permadeath owner exists | World-level optional commitment when the required owner exists |
| World topology | Initially Individual World; Living World later | Initially Individual World; Living World later |

**Independence matters:** `progressionMode`, `worldKind` (Individual/Living), `hardcoreCommitment`, `pausePolicy`, `timePolicy`, `difficultyPreset`, `worldRules` and `stakesRules` are distinct conceptual choices. World Creation owns the accepted compatible combination. Modes must not rewrite already published characters or create parallel copies of the same World/Save. World rules become immutable for a created World unless a versioned, atomic migration and user-facing consequence policy is approved.

A nonpausing 1:1 World might take literal real years to express pregnancy, maturity, city development or succession. Persistent must therefore support meaningful *within-life* progression and offline continuity; it should not depend on fast generational turnovers. Do not promise a full 1:1 no-pause World until offline hazards, unattended activity, death/recovery, downtime/catch-up, server authority, access and anti-idle policies are deliberately contracted and tested.

## 3. Mode resources, account-wide specialty unlocks and incentives

**Currency taxonomy is provisional design vocabulary, not schema names or live awards:**

| Proposed spendable | Earned primarily from | Primary unlock role | Scope |
| --- | --- | --- | --- |
| Chronicle currency (*Chronicle Marks*, placeholder) | Verified run/life settlement, survival milestones, lineage and historical achievements | Repeat-run starting opportunities, capped Prestige-generation enhancements, bounded Chronicle World-speed progression and eligible legacy improvements | Account ledger with Chronicle-mode entitlement rules |
| Persistent currency (*Enduring Merit*, placeholder) | Long-term character training/mastery, trade/crafting, sustained lawful accomplishments, property/community milestones, verified activity | In-life specialty training, durable projects, profession/economic capability, Persistent QoL and mode-specific upgrades | Account ledger with Persistent-mode entitlement rules |
| Cross-mode specialty entitlement or spendable (*Concord Sigils*, placeholder) | Audited cross-mode achievement milestones, approved conversions or a separately defined two-track completion policy | Distinctive **account-wide or cross-mode** upgrades, shared cosmetics/convenience, lore/collection and carefully bounded mode-relevant bonuses | Account-level ledger, with source-mode and destination-scope restrictions |

**Important design distinction:** The owner requires unique spendables earned through **each mode**, and specialty benefits useful across the account. A third bridge currency is an **option, not a selected monetary requirement**. Another valid design is a shared specialty upgrade tree where some nodes cost both Chronicle and Persistent resources, or two reciprocal branches granting cross-mode effects. Choose the final currency topology after account/Prestige ledger and reward-integrity review, not from attractive names. Two-mode participation should offer **valuable, distinct rewards**, but a player focused on one mode must retain a satisfying progression path. Cross-mode perks can be desirable without becoming mandatory entry tickets to core content.

Examples for later balancing **not yet purchasable**:
- Chronicle-spend upgrades: improved eligible starting options, discoverable legacy traits, capped future-run conveniences, World speed *inside Chronicle only* where the owner permits.
- Persistent-spend upgrades: ongoing character training/workshop capabilities, longer-term logistics, account-level knowledge/appearance unlocks, modest conveniences suited to continuous play.
- Cross-mode specialties: account-wide title/cosmetic/collection unlocks; shared interface or archive conveniences; mode-adapted bonuses to later eligible projects, rather than directly importing a Chronicle speed upgrade into a 1:1 Persistent World.
- Mode-specific unique reward tracks may support specialty equipment, helpers/automation and social/guild systems **only when** those gameplay owners exist; this is a comparison to multi-currency incremental progression, not permission to mint Ultimate Weapons, bots or guild assets now.

**Ledger invariants:** Every earn/spend requires a stable account/source World/mode identity, immutable receipt/request ID, exact-once settlement, expected revision and atomic debit/entitlement readback. Prevent two-tab double spend, duplicate terminal payout, time-scaling farming, multiple character/account exploitation, arbitrary cross-mode exchange and rewards granted solely for elapsed real time or opening a tab. Separate in-character assets from persistent account entitlements and from existing Echo experience, Legacy, Family Prestige or any accepted future Prestige ledger. A mode's reward effect must be validated against the **destination World mode and its locked rule version**. Permanent death, no-pause, fixed real-time pace and restricted Stakes cannot be undone by a purchased account upgrade.

**Decision before implementation:** select one authoritative account ledger (or versioned extension of an existing owner), supported currency ID/scope and grant/spend contracts, earn-source validation, exchange/specialty policy, UI affordability, reversibility/refunds and provenance; do not introduce parallel localStorage counters, duplicate balances or numerical tuning without authority.

## 4. Welcome / mode-selection UI contract

After successful existing account authentication the Welcome screen should display the verified `Welcome back, {displayName}` heading, an introduction such as `Choose your journey`, and two prominent full-card **buttons** with readable mode name and short purpose description. Responsive preference: **two balanced columns on sufficiently wide screens; one vertically stacked column on narrow/mobile**, borrowing the generous click targets and selection-card rhythm of the continent/region/settlement creator. Avoid new artwork/assets now. Preserve Logout and keyboard focus/disabled states.

- **Chronicle**, enabled only as an **isolated prototype route**: "A world of repeated lives, legacies and new beginnings." Selecting it invokes the *existing* gated, truthful `WORLDS / THE ATLAS` unavailable boundary and Back. Do not create a World, load a Save, mint Chronicle currency, select a durable mode or publish a campaign.
- **Persistent**, a clearly labeled disabled **Coming Soon** card until World registry, continuous timing and progression support are real: "One enduring life, growing skills and lasting achievements." A disabled card must not create a World or pretend a functioning path. When actually supported later, selecting it opens a mode-filtered real World Library through the verified account World owner.
- Mode cards are **routing choices, not an account/global mutable mode toggle**. The ultimately chosen World creation transaction owns its progressionMode and Hardcore/pause/time rules. On world selection, the World itself supplies the mode and effective character rules, preventing stale tab mismatches and mode spoofing.
- Feature-OFF existing `ACCOUNT_ACCESS → MAIN_MENU → Save` path remains unchanged; current L1 route stays local DEV/loopback and explicit `?welcomeL1=1`. Mobile and desktop cards must remain perceivable at 375, 768 and 1280px; no graphic is a prerequisite for accessibility.

This is a narrow visual extension of the retained L1 prototype. It **does not clear L1-A01–A15 integrity/browser acceptance**, integrate to master, authorize production selection or replace the actual L2 World owner.

## 5. Time and multi-tab action invariants

- World clock advances by authoritative elapsed World time under the World `timePolicy`; no action uses a `skipWorldTime()` side effect to finish. For a five-minute soup action, starting reserves/debits its unique portion and records `endsAtWorldTime = startedAtWorldTime + 5min`; completion occurs when the authoritative clock reaches that boundary. Real completion duration depends on locked World speed. Paused World time means paused World-time action progress.
- Two tabs observing the same World/character/Save get the same accepted head and versioned owner updates. Atomic action reservation and expected-head checking block duplicate use even one second apart. Actor busy/cooldown rules block incompatible overlapping actions; a cooldown is not sufficient by itself for item identity correctness.
- A World with no pause still follows exactly one World clock. Offline simulation and reconnect/late-completion events must resolve deterministically, with no unbounded offline penalty until a separate policy is accepted. A player time-speed upgrade is a World progression entitlement with its own accepted pacing/compatibility rules, not a hidden accelerated character timer.
- Interrupted/failed completion preserves exact reservation and action receipt without double consuming, duplicating rewards, auto-increasing game time, or granting free paused actions.

## 6. Stage gates and dependencies

| Stage | Safe deliverable | Hard stop |
| --- | --- | --- |
| L1 UI prototype | Text-only responsive mode cards, truthful Chronicle unavailable Worlds path, disabled Persistent, Logout and existing feature-OFF route | No mode currency/account/Save/world schemas, feature default cutover or unverified selected-client acceptance |
| L2 World identity | Authoritative World registry, `progressionMode`, Hardcore composition, pause/time policies, World→Save association, exact creation/retry/readback | No guessed World from slot count, no migration without versioned owner contract |
| First playable Chronicle slice | Authoritative clock, action durations, inventory reservation, one actual World/character Save/reload; mode-appropriate real UI | No World-time teleport from action click, no two-tab double consumption |
| Economy contract | Account/mode spendable and specialty entitlements, source receipts, bounded reward grants and spend atomicity | No ad hoc currencies, uncapped time-farming or duplicate payout |
| Later Persistent slice | Fixed continuous World pace, no-pause/offline policy, in-life progression; true auto-updating subscribed clients when chosen coordinator exists | No unowned persistent "real time" claims or punishing unattended death without rules |
| Later Hardcore & Living World | World-owned Hardcore composite, real wilderness/death and heir continuity; future shared-world participant clock | No character-toggle Hardcore, no unsound time skips or speculative shared simulation |

## 7. Supersession / preserved history

- Existing 2026-11-09 Hardcore material remains applicable for **what** Hardcore means (survival, permanent actual death, heir continuity). This document refines **where it is selected**: World Creation, inherited by characters. Any character-creator Standard/Hardcore toggle in old design is **superseded for new World rules**, though Backstory and World Entry must still validate mode-specific story eligibility.
- Existing campaign rule/difficulty/Grim/Stakes separation remains controlling until a later technical World-owner migration deliberately reconciles it. Nothing here silently changes active `normal_stakes` or legacy Hardcore compatibility.
- Existing World Library single authored First World, slot/head safety and action/Save owners remain intact. Chronicle/Persistent progression modes do not replace the separate Individual/Living World topology.
- Prior speculation about universal 5-second cooldown or eating as a time skip is superseded: action duration is real **World-clock elapsed time**, and cooldown/consumption are separate transactional mechanisms. A no-pause or 1:1 real-time policy is an **option under consideration**, not an activated default.
- Preserve L1 source `14aa6380a3a6bb4aae35e0712169c302758d97d5` and its holds. A separate isolated mode-card prototype may be implemented without rewriting that reviewed candidate, but it requires exact-source build/browser and independent integration acceptance before use.

