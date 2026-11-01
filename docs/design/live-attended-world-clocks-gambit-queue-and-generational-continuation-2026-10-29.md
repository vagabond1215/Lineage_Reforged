# Live / Attended World Clocks, Queued Gambits and Generational Continuation

Date: 2026-10-29 (America/New_York).
Status: **USER-DIRECTED PROVISIONAL PRODUCT DECISION; DOCS ONLY**. No live clock, server scheduler, Save migration, queue executor, idle income, death owner, rebirth, time-skip command, plot generator or UI is authorized or currently implemented.
Base audit: selected `master` `a596112acf3945f2bf7c625e943f2511d12aa710` plus earlier independent PR #46 religion/world design addenda. **This document refines and supersedes any earlier blanket advice that world time advances only while a character is directly attended, or that all offline progress is deferred.** The user specifically selects Live and Attended modes and treats finite queued player actions as attendance.

## 1. Two distinct world-time modes

**Live World** (user-selected meaning; player-facing name provisional):
- The world's clock advances in relationship to **real elapsed time**, including outside a manual character-control session, under an explicit world-owner time-rate/balancing policy.
- The ratio between real duration and in-world elapsed duration is intentionally adjustable and not selected numerically. Its effect on age, food production, wages, crop cycles, time-sensitive quests, healing, threat resolution, political events, reincarnation due dates and world drift must be balanced together.
- A live clock is **not permission** to grant characters unlimited unattended income, automate dangerous quests or execute a burst of missed activities without budgets. Offline elapsed time needs a certified catch-up policy, bounded computation, replay protection and clear user-visible summaries.

**Attended World** (user-selected meaning; player-facing name provisional):
- World time advances while at least one character has a legitimate active gameplay/attendance source.
- **Finite queued player-gambit actions explicitly count as attendance**, even if the player only logs in periodically to prepare a queue and then leaves. A scheduler capable of processing accepted queues while the app is closed is a *future required implementation*, not a current feature or guaranteed service.
- When no actively played character and no accepted eligible queued action remains, time **stops** under Attended policy; no unearned "catch-up" to a later wall-clock date.
- Parallel character queues/activities cannot each independently advance world time: one authoritative world clock and sequence of accepted events govern all actors.

These are **time-advancement policies**, distinct from accepted Difficulty (including Story), World Rules (Heroic/Grim) and Stakes (Normal, Committed, Ironbound as accepted conceptual identities). Selecting Live does not automatically imply Grim/Hardcore; selecting Attended does not permit undoing an event. World-creation selection is the likely default; exact allowed post-creation changes are open and require owner-proven nonduplication.

A world-time mode does not affect the fundamental requirement that the **world is created and committed before character creation**, every character resides in the same selected world chronology and all present/recent world facts come from accepted seed + subsequent events.

## 2. Queue progression: player intention vs general automation

**Finite queued actions**:
- Starting player-gambit queue has a **maximum number of slots**, with cap increases purchased/unlocked incrementally. Exact slot counts, costs, allowed action types, durations, cancellation and execution budgets are undecided.
- Each accepted slot represents a **specific** validated action/task or bounded repeated instruction owned by an appropriate gameplay domain. No "run arbitrary goals forever" hidden in a finite slot.
- A queue has explicit actor, world, start/expiration, eligibility, preconditions, inputs, consumption/budget, stop conditions and authoritative outcome receipts. Every execution revalidates world state, resource availability and legality.
- Queued activity can generate modest earned progress, consistent with costs, output and elapsed time, **not** random arbitrary wealth or terminal death.
- If every queue is blocked/completed/expired, Attended mode should cease advancing unless another valid attendance source exists. A blocked queue should not spin forever just to keep time running.
- A queued action may constitute attendance, but it must not make inactive characters magically immune to world-wide aging, environmental changes, fees, or accepted events.

**Persistent automated player gambits**:
- Ultimate unlock on the queue progression branch **opens persistent automated gameplay**. After unlocking that entry point, additional incremental unlocks govern **permitted gambit categories/types, simultaneously active rules, rule count, per-action capability/value ceilings, execution budgets and possibly actor scope**.
- This is different from getting unlimited finite queue slots. A persistent rule must still be interruptible, bounded by real owned inputs, auditable and eligible under current world/stakes/market constraints.
- **Automated gambits may not decide dangerous tasks for inactive characters.** User explicitly permits dangerous action only when the player has queued a **specific dangerous task**. A broad instruction such as "fight any monster that threatens profit" is not an acceptable unattended-danger authority.
- Dangerous explicit queues require a separate owner-reviewed consent, warning, risk-and-death policy. The user's earlier desire for no unannounced unattended terminal death must be reconciled with actual Stakes; do not grant automatic immortality and do not resolve forbidden terminal outcomes silently. Default should be stop/pause/request direct participation at a safety boundary until that contract is accepted.
- NPC employee/business gambits and player-character gambits can be separately gated, and each must use the same authoritative jobs, item, energy, wage, market, legality and time owners. No free-output or self-trade shortcut by automation.

**Advanced World Management** is a later high-tier Prestige path: one shared world clock, real-time-with-pause orders, rapid selection of legally controlled characters, and parallel authorised actor directives. Never split the same world into secretly inconsistent clocks, grant free simultaneous actions or bypass owner admission. Existing weighted combat AI is real; literal ordered condition→action gambits/editor/persisted general-world scheduling remain deferred in `docs/design/combat-ai-and-gambit-current-state-audit.md`.

## 3. Shared chronology and character-state policies

- Separate the **single world clock and world historical facts** from character/lineage-specific age, inventory, knowledge, skills, quest status, social relationships and owner-proven history.
- When world time advances in Live or Attended mode, all eligible characters age consistently in the world. "Inactive" is a player-control status, not a separate frozen timeline.
- Inactive dangerous tasks **only if deliberately queued as an explicit task**; automated gambits may operate safe approved tasks only.
- Player-controlled characters **do not inherit each other's Knowledge** from shared seed, account owner identity, or a switch. Personal information must be discovered, passed through legitimate records/contacts, or earned by owner-valid means.
- No automatic income, profit, ability training, industrial production or quest progress without actual work, resources, scheduling and durable outcomes.
- Existing heir evidence/Prestige, in-world death/eligibility and same-account trade/guild anti-abuse restrictions remain intact.
- Significant world-state changes, including order influence, religious annexation, events, prices and politics, must follow certified event owners; the clock merely determines when a possible action/event is eligible.
- Save publication and account/continuity consistency are strict: reverting Character A cannot roll back World events accepted while controlling Character B, nor reroll a committed major occurrence.

## 4. Single-lineage heir time skips

User proposes **partly uncontrollable time skips**, with later Prestige letting players choose wider forward durations. A possible **draft** progression ladder:
- Early/initial heir continuation: RNG-determined forward elapsed time, with exact support bounds not chosen; not a player-controlled instant reroll.
- Subsequent explicit choice: a **10-year** step (user example; no lock yet).
- Higher-tier choices potentially **25, 50, 100, 250, 500, 1000 years or longer** (candidate progression only; exact unlock levels and permitted totals not selected).
- Larger duration should create a larger **opportunity** for generational, ecological, institutional, cultural and geopolitical change. It is not a fixed outcome table that guarantees peace at 10 years or empire collapse at 1000.
- All accepted time skips advance the **world**, not merely the next heir. Other characters, surviving families, economic structures, confluences, religious orders, markets and world chronology also experience the elapsed years when applicable.
- Major shifts should emerge from known initial conditions, world history and supported simulation/plot events. No random past revision of facts merely because an heir requested a new start date.

Any currently active character outside the heir path or outstanding action needs an explicit safe-time-transition admission gate. The new heir must already pass the future family/Prestige/reincarnation rules; a time skip cannot fabricate offspring or revive finalized bodies.

## 5. Living World: queued future reincarnations / isekai arrivals

User-selected direction:
- An heir **flagged for reincarnation** may be scheduled for an exact **future world date**. The world retains a durable **pending arrival/continuation record**; the character is not prematurely playable and cannot receive active-world effects before the due date.
- **While other eligible playable characters remain in the world**, they can play and shape events as the world clock advances toward that date.
- **If no currently playable characters remain, or the only remaining candidates are deferred reincarnations/isekai arrivals**, the world should automatically advance to the **next** eligible future arrival date, resolving an internally consistent historical transition and then allowing the arrival to enter.
- When multiple pending events occur, process the nearest chronologically eligible due time and preserve deterministic ordering, idempotent admissions and exact event provenance. Do not jump past an earlier valid pending event.
- A pending arrival is a scheduling claim, **not** resurrection of a finalized character or permission to import historic wealth, earned spells, licenses, character knowledge or physical items across incompatible years/worlds.

**Open collision with Live clock:** the user also wants Live linked to real time. The automatic world fast-forward to the next queued arrival may be an explicit **special transition** that skips real elapsed-time equivalence, or the policy might be limited to Attended worlds. **This is not yet resolved**, and the design must not silently override Live's real-time mapping. A user decision is needed.

**Open collision with remaining entities:** "no other characters" should be defined in terms of **eligible player-controlled active characters**, not absence of all world NPCs, businesses or orders. Deferred arrivals, continuing economy inputs and retained world events still require source-conserving transition.

## 6. Continuation point and century-scale world-change planning

An arrival/skip should resolve to a **world continuation point**. Proposed source-grounded sequence:

1. **Freeze/admit** the requested continuation or next due future date. Confirm world ID, current world epoch/date, queued arrival eligibility, active actors, save/stakes constraints, outstanding transactions, unresolved fatal processes and reference identities. Reject unauthorized retroactive or duplicate requests.
2. **Seal durable baseline**: starting seed, accepted world history and certified world/character state at transition, unresolved plots, leyline sites, ages, orders, relationships, businesses, resources, climate and geography, source versions and invariant ledger. The transition begins from **current evolved world**, not original world seed again.
3. **Set elapsed horizon** and resolve relevant domain changes by bounded chronology. Near horizons use normal event simulation/aggregation, mid horizons can summarize generations, and very long horizons can use **constrained generation informed by historic facts**.
4. **Conserve important causal anchors**: real past wars/religious persecutions, actual artifact provenance, family ancestry, title legitimacy, economic creation/destruction constraints, extinct/reformed order inheritance, known disappearance/migration of leyline points, chronological event identities, established completed quests and histories. The world may be dramatically altered, but the result **must explain how it came to differ**.
5. **Generate historical bridge**: certified chronological milestone outcomes and a public/private knowledge projection appropriate to surviving records, culture and the newly arriving character. Prior events do not disappear; many may become forgotten, mythologized, rediscovered or disputed *in-world*.
6. **Commit the continuation checkpoint atomically**, including new world epoch/date, admitted descendant/arrival, reconciled character/estate states, source-approved world changes and durable receipts. If validation fails, retain the last good playable world and allow repair/retry without double effects.
7. **Resume** at the new date with historically plausible religious-order profiles, cultures, trade and plot arcs. Don't make a thousand years of day-by-day wages or endless unattended combat rolls to reach the year.

### Suggested horizon strategy, **not accepted thresholds**

| Elapsed jump | Default planning intensity | What remains possible |
| --- | --- | --- |
| ~10 years | Localized change and plausible careers; most institutions recognizable | A major war or disaster can still happen if supported by real causes |
| ~25–50 years | Leadership turnover, family generations, evolving local politics | Some large religious and cultural shifts |
| ~100–250 years | Dynastic and national transformation, order mergers/splinters and fading lore | Extinction or reformation of institutions when causally explained |
| ~500 years | Broad historical era transition and substantial cultural/geographic changes | Survivors and institutions with credible longevity remain possible |
| ~1000+ years | **Constrained world re-generation/era synthesis** that reconnects the dots from the previously accepted history | The same world's identity, causal anchors and important evidence persist; never an unrelated fresh seed |

A "rerun generation and connect the dots" at ~1000 years should mean **rebuilding the *current era's derived world state* from retained causal history**, not resetting the religion population, geography and family history to random new-game conditions. This may yield dramatic new borders, cultural names, order membership, disappeared shrines and different confluences after real historical transitions. New seed influence is bounded by accepted world/era rules and already-established events. Relative confluence rarity, single-element historical tradition evidence and intrinsic elemental identity still hold.

**Keep distinction:** authoritative *world history* is not the same as what a new character *knows*. After a millennium, remembered history may be inaccurate or lost without actual committed world facts being rewritten.

## 7. Conflicts to resolve before any implementation

A. **Attended with offline queue execution** requires a trusted engine scheduler and persistence. Existing browser-only save path and new-campaign records are not an always-on server. No claim is made that the game currently progresses when the tab is closed.

B. **Live with thousand-year fast-forward** needs a rule reconciling accelerated game time and real-time clock; do not silently jump across another active world character's legal future.

C. **Idle danger vs death/Stakes**: a specifically queued dangerous mission may have actual risk, but unattended terminal outcomes require explicit informed consent and compatibility with Normal, Committed, Ironbound stakes. No automatic death grant or blanket immunity.

D. **Parallel queues and market integrity**: finite queue slots or automatic business gambits cannot use different characters to manufacture goods, trade value, double-sell inventory, or bypass same-account beneficial-owner protections.

E. **Event budgets and enormous time skips**: time progression cannot enumerate millennia of microticks or award unbounded compounded yield; use owner-accepted historical abstraction and conservation/limits.

F. **Random skip outcomes**: RNG is a source to select among supported outcomes, not a permission to overwrite past accepted historical facts or repeatedly reroll a committed world by loading an older character.

G. **Mixed campaign settings**: game mode (Live/Attended) is a world-time axis, not the already accepted Story difficulty, Heroic/Grim World Rules or Stakes; exact policy, combos and migration gates are deferred.

## 8. Suggested prospective acceptance checks; none executed

- TC-01 two world clocks with identical character actions may advance differently depending on selected Live/Attended rule without changing intrinsic elemental canon.
- TC-02 Attended halts when all eligible active/queued attendance sources finish; a blocked loop does not keep time moving.
- TC-03 finite queued action counts as attendance and is admitted once despite restart/retry.
- TC-04 offline queued activity does not claim implementation without a trusted persisted scheduler.
- TC-05 persistent gambit unlock does not provide unlimited queue slots or unrestricted action-value caps.
- TC-06 inactive character's dangerous activity requires exact deliberate queued task, not general automation policy.
- TC-07 idle labor cannot create items/coin or training from nonexistent inputs.
- TC-08 world time advances once for multiple actors, not once per character queue.
- TC-09 a future-dated reincarnation is unplayable before due time and doesn't mutate other characters' state by mere scheduling.
- TC-10 when no eligible present characters remain, next admitted future arrival is selected chronologically without skipping earlier pending events.
- TC-11 10-year continuation remains causally grounded even if a significant rare event occurs.
- TC-12 1000-year continuation retains prior hard facts while plausibly transforming cultural, political and institutional scenery.
- TC-13 interrupted continuation checkpoint replays idempotently without duplicated Prestige, items, market money or heirs.
- TC-14 no new descendant or family record is manufactured to fulfill a queued future arrival.
- TC-15 player character private knowledge does not leak through the world timeline or historical simulation.
- TC-16 Live clock and accelerated arrival cannot contradict each other without an explicit accepted mode policy.

## 9. Remaining user questions (not answered by this document)

1. What real-time-to-game-time ratios does Live allow? Are speed settings changeable after world creation?
2. In Attended, can offline queues continue until empty even if no app/browser is running, or does the player need a connected session?
3. What counts as "a queued specific dangerous task"? Does it include an explicit multi-step expedition with a fixed endpoint, or only one direct discrete action?
4. Can an explicit dangerous queue cause terminal death offscreen, if the user opted in and the selected Stakes mode permits it?
5. What are the first finite queue capacities, costs, per-action time limits, and failure/retry/blocked policies?
6. Does the persistent gambit unlock remove idle safety restrictions or only offer more sophisticated **safe** activity?
7. What is the maximum unattended skill, income, character progression and business-profit rate?
8. How often may inactive actors pause due to major decisions, risks or required user attention?
9. Must Live-to-Attended conversion be locked at creation, or is a history-preserving migration possible?
10. For a Live world with only future arrivals pending, is automated fast-forward an allowed explicit exception or forbidden by real-time clock?
11. Should heir time-skip duration be picked entirely by RNG first, then enhanced by exact chosen blocks; what are minimum and maximum years?
12. Who decides when an heir time skip happens while other characters are still active and how conflicts are prevented?
13. Are the proposed historical horizon bands (10, 25–50, 100–250, 500, 1000+) roughly right for complexity, or should they be only adaptive to events/era?
14. At 1000+ years, how much authored geography/topology may change beyond culture, borders, habitats and leyline surface exposure?
15. Can future-dated isekai/return arrivals be scheduled at other valid milestones independent of a specific family heir?
16. How should extremely old surviving characters, nonhuman lifespans, immortality and businesses be handled across 500-1000-year transitions?

**HOLD_NAMED_CONSUMER**. Independent PR #46 new docs file only. No runtime, tests, Save, world/quest/economy/gambit/UI changes, no master/other PR mutations; next consumer must reconcile accepted narrative, Stakes, legacy/family, game-time and market owners.
