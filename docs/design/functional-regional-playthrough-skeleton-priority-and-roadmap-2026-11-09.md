# Functional Regional Playthrough Skeleton — Product Priority And Implementation Roadmap

Date: 2026-11-09  
Repository: `vagabond1215/Lineage_Reforged`  
Source checkpoint at authoring: `42a12460360485d1bee4c4852ef8d8f904a27601`  
**Disposition: `REGIONAL_PLAYTHROUGH_SKELETON_PRIORITIZED; PACKAGE_SELECTION_AND_IMPLEMENTATION_HELD`.**

This is an **owner-directed playability priority**, not a new engine/runtime/Save contract, authored canon acceptance, implementation authorization, selected-client acceptance, Game-version publication, or replacement for the active Codex task. It changes **what should be prioritized next**, not which old branches or held prompts may be executed. Use current master, the more specific accepted authorities and the [current Codex prompt](../dev/current-codex-prompt.md) before selecting a package. Do not infer that the illustrative scenes, merchants, guild representatives, yields, prices, recipes, ranks or encounters below already exist as playable content.

## 1. North star and explicit UI constraint

Build a repeatable **single-region ordinary playthrough**:

**Create character → authored fact-grounded narrative introduction → observe and explore local situation → gather/forage or undertake an authorized hunt → transform materials by one craft → buy/sell with a real merchant → qualify for and register with a real guild → use a guild benefit and complete a guild request → choose and resolve combat → observe skills, character growth, guild standing/rank and consequences → rest, save, restart and continue.**

The above is a target **player journey**, not a forced single command sequence. Support consequential choices and allow sensible alternatives (for example, buying an eligible material rather than gathering it) when the owner contracts allow them. Content budget: **one existing settlement/hub, 2–3 local activity contexts, one verified merchant/provider, one verified guild clerk, one guild, 1–2 resource types, 1–2 recipes, one trial, one guild request, one encounter family and 2–3 observable advancement channels**. Counts are planning targets, not hard limits.

User direction on UI: **functional desktop usability is sufficient for current engine development**. Preserve truthful owner results, reachable actions, keyboard/Save access and basic legibility. Do not spend this phase on themes, cosmetic polish, extensive responsive redesign, animations, 3D/grid/FPS interface, or a wholesale React shell migration. A later major UI redesign is expected when the gameplay interaction model is more mature. The [controlled current-master fit review](../dev/current-master-mobile-shell-topbar-controlled-fit-2026-11-09.md) found Settings/Notifications Escape-dismissal and focus behavior gaps at narrow widths and lacked genuine 200% zoom/screenshot export. **Track these as functional/accessibility follow-ups, not as a reason to keep replaying historical visual audits before gameplay work.** If an actual PC action or Save route is blocked, fix the smallest real blocker.

Maintain Game `0.1.1-prealpha` and `INTEGRATED_LOOP` until an independent [Game-version policy](../dev/game-version-roadmap-and-acceptance-policy.md) decision. The [playability posture](../dev/playability-posture-and-version-calibration.md) already accepts the narrow Soundings create/accept/travel/four-shifts/return/+5g/restart loop; the broader vertical-slice gate remains unmet. A natural encounter defeat/recovery is evidenced; **selected victory, consequential combat choice and fully truthful action disclosure require separate proof/repair**. No history of passing isolated tests upgrades selected gameplay acceptance.

## 2. Priority meaning and dependencies

- **P0 safety:** Protect one source of truth for physical items, authoritative commands, currency, rewards and Save compatibility before adding new mutating flows. The installed [non-fungible item owner and Save cutover](../dev/current-codex-prompt.md) is the current independent implementation route. Do not replace it or assume it is accepted. Stackable/consumable operations may be built on explicitly verified existing fungible semantics without waiting for universal unique gear instances; any non-fungible creation, quality, condition, sale, repair or loot must respect the completed owner migration.
- **P0 close existing gameplay:** Reassess the parked combat-action disclosure and ordinary selected victory/choice acceptance. Do not rebuild the combat architecture or falsely claim a selected win from controlled fixtures.
- **P0 player-visible next slices:** Intro + current situation, one gatherable, one genuine craft, one merchant transaction, one qualified guild membership and benefit, one guild request/completion and observable advancement.
- **P1 next depth:** truthful nutrition/recovery integration, a first executable spell if magical-character viability is needed, wider quest/encounter and economic breadth. The [PR #6 historical nutrition evidence](../dev/historical-nutrition-pr6-connector-evidence-and-retirement-preflight-2026-11-09.md) does not approve normalized metabolic units or old Save conversion.
- **P2 future depth:** mounts, vehicles/vessels/cargo, broad grid travel, property, farming, autonomous workshops, political systems, guild leadership, general spellcasting and global economic simulation as player actions. Static content or separate civilization simulation does not prove a player command.

**Order is a dependency graph, not an instruction to finish all P0 systems at once.** Independently verified combat and non-fungible owner work may proceed in their protected routes while focused scene/content/first-stackable-resource design is prepared. Converge only after the owners' exact item, event, clock and Save contracts are compatible.

## 3. Work package matrix

| Package | Priority / current foundation | Smallest real output | Specific acceptance |
| --- | --- | --- | --- |
| **S0: Item/Save safety and combat completion** | P0; current stacks/use, epoch durability and combat commands exist; distinct gear copy identity and selected victory/result proof held | Complete isolated non-fungible item owner/migration route; separately prove a legitimate combat victory/meaningful choice and truthful owner result; preserve existing recovery | Two identical gear copies retain independent identity; old Save repair/quarantine is reachable and idempotent; selected win/defeat/continuation/readback documented without fabricated outcome |
| **S1: Intro and current situation** | P0; creator and LocalSceneContext architecture exist; no general narrative realizer | Authored, skippable fact-grounded intro with 2–3 genuinely available opportunities; current location/observable targets/owner-backed affordances and blocked reasons within existing PC shell | Fresh character selects an ordinary opportunity, receives real owner result; scene reconstructs at same Save head |
| **S2: First environmental acquisition** | P0; ecology/resources/items static-rich; no general gather command | One or two authored observable resource instances with exact identity, access, method, tool/skill/body/time checks, yield/depletion, inventory/history and persistence | Real action yields exact goods once, exhausts correctly, stale/retry never duplicates, reload retains depletion and inventory |
| **S3: First player craft** | P0; recipe schema/production-chain support, no verified general player crafting transaction | One deterministic hand/station recipe; accepted source inventory removal and output creation plus time/skill result | No input/output duplication or partial mutation on failed admission/retry; Save/restart truth |
| **S4: First merchant** | P0; market prices and autonomous civilization trade exist, not player merchant commerce | One verified local provider with limited owned stock, deterministic buy/sell quote, wallet/inventory/stock transfer and receipt | Buy and sell at accepted prices; insufficient currency/stock and stale/duplicate requests safe; state persists |
| **S5: First guild membership and benefit** | P0; 18 canonical broad guild identities, membership descriptions only | One present authorized clerk, real entry trial/evidence, persisted member/grade state and one applicable guild benefit (service/access/buyer terms) | Nonmember denied, trial recorded once, benefit has a real owner effect, reload retains membership and permission |
| **S6: First guild request** | P0; accepted Soundings lifecycle, generic offer/issuer/consequence model not broadly implemented | One guild-issued/authorized offer, board browse view, accepted request, authoritative objective, authorized report and exactly-once consequence receipt | Board/clerk do not duplicate offers, reward or guild contribution; request completion persists |
| **S7: Integrated encounter/hunt and continuation** | P0; encounter resolution/recovery partially playable | Bind an ordinary local risk to accepted combat choice, and only if selected, an owner-backed terminal reward/material route | Legitimate win or Normal-Stakes loss, meaningful choice, no invented loot, continued action/Save |
| **S8: Skill and guild progress** | P0; player progression and bounded survey-activity advancement exist | Link accepted gather/craft/combat or request evidence to correct skill/Knowledge/character and separately guild contribution/rank owners | Action receipts accrue relevant progress once; no blanket XP assumption; first visible threshold or access change |
| **S9: Multi-stage playthrough acceptance** | P0 gate, not independent new system | Fresh selected create → ordinary journey → save/restart at critical transitions → repeatable continuation | Every owner result, inventory/money conservation, guild state, advancement and history survives multiple restarts; meaningful choice exists |
| **D1: Nutrition and everyday recovery** | P1; player body-state and Consume/Rest exist; normalized reserve/Save model held | Truthful ordinary provisions, hydration and Rest; later coherent normalized-unit migration as separate package | No intake counters mislabeled as available reserves; actual single-use effect and persistence |
| **D2: First effectful spell** | P1 conditional; known-spell/cast-readiness and inert envelopes exist | One explicit known/owned spell with real target/effect/resource/catalyst/failure owner and Save receipts | End-to-end resource payment/effect once; cannot bypass acquisition/readiness; do not claim broad magic |
| **D3: Advanced transport/simulation** | P2; travel and separate civilization transport foundations | Defer player mounts, wagons, vessels, cargo and large-world travel until a real consumer needs them | No vehicle UI implying executable commands without vehicle/actor/control/cargo ownership |

## 4. Package detail and exact seams

### S0 — Owner safety first; do not let it consume the entire regional roadmap

Current stacks/Equip/Unequip/Use are real, with exact-bag and stale-selection tests, but the [Stage 2 durable item-location decision](character-durable-item-location-stage-2-decision-2026-10-26.md) proves non-fungible gear can lose physical provenance on stack merge. A complete versioned cutover must preserve old surveys/17-slot witnesses, duplicate/retry/stale semantics, normal item callers and selected Save admissions. It is a **separate isolated implementation**, not a permission to migrate every material stack. A simple resource, recipe or merchant slice must explicitly classify its goods as supported fungible instances and establish atomic quantity/currency ownership. Combat should reuse actual nearby admission, target legality, player action identity, AI timing and Normal-Stakes continuation. Revisit the [parked combat action result disclosure route](../dev/deferred-dev-0.7.2.13-combat-action-result-disclosure-prompt-2026-10-23.md) without resetting its evidence.

### S1 — Character → truthful narrative → real local action

Reuse actual creator form, character/origin state and campaign publication. An intro is authored/fact-grounded, skippable and aware of only accepted starting circumstances; no freeform story generator or secret-canon inference. The accepted [Local Scene Context](local-scene-context-projection-decision.md) observes location, known/seen targets and owner-supplied actions. A Current Situation panel is a **read projection**, not a second command or world database. The [contextual command architecture](contextual-player-action-and-command-architecture-decision.md) already defines the first existing-command Home scope: travel, explore/approach, legal combat, Rest, quest Accept/Track/Soundings Submit, selected Equip/Unequip/Use. Add new commands only as S2+ owner packages land. Selection and presentation may stay in current PC UI.

### S2 — Gather/forage, then optional hunt

First environmental resource: one legitimate observed material/plant/deadwood/water instance and one selected acquisition method, at a real authored reachable place, with time/resource/capacity and access checks. Node identity, count/depletion and regeneration policy require an explicit source owner; static `world.resources` records are **not** current nodes. Use the [resource gate](resource-commodity-next-expansion-gate.md), accepted item catalog and ecology sources; do not invent a generalized harvest engine or release broad research as a prerequisite to one tightly authored candidate unless source grounding genuinely lacks. Hunting is a **combat/encounter plus authorized post-outcome reward** route, not `click Hunt → mint meat`. It can follow first foraging rather than block it.

### S3 — Consume ingredients, produce one valid item

Use the existing [crafting authority](crafting-authority-boundary-decision.md) and [recipe seed planning](first-crafting-recipe-content-seed-plan.md). A first authored recipe is deliberately narrow (e.g., a prepared herb bundle only if canonical item keys, tools/places and outputs are independently supported). Specify exact quantities, time, skill/capability and deterministic yield. Crafting must validate current source stack/location before committing one atomic owner mutation. The civilization `production_chains.recipeProfile` and `runtime-economy` craft estimates are **not proof of a player recipe action**. Quality, condition, substitutions, crafting queues, alchemy and enchantment wait.

### S4 — Real NPC merchant and transaction

One demonstrably present merchant/provider, an authorized stock assortment and buy/sell policy, a player wallet/currency route and a single accepted transaction/receipt. Reuse market value authority for price inputs where appropriate; the civilization autonomous trade runtime is not a player buy/sell command. Neither an authored `business.*` label nor a generated placeholder creates a canonical person. The scoped NPC/provider identity and local availability must be accepted before exposing Trade. Stock, items, currency and history move only via the owning transaction. Avoid global auctions, haggling, dynamic inventory economy, taxes and credit.

### S5 — One actual guild, not all 18 at once

Existing `civilization.guilds` contains 18 canonical broad guild identities; settlement `guildPresence` is descriptive. The [guild boundary](organization-faction-guild-boundary-decision.md) expressly separates canonical guild identity from current player membership, grade/rank, dues, reputation, standing and service permissions. Prefer a **Herbalists Guild pilot** because authored entry requirements span plant identification, harvesting and preparation and described benefits include plots, drying facilities and buyers; **conditional on a real approved local presence and qualified clerk**. Adventurers Guild is a strong later combat pilot. Propose a real member lifecycle: eligible → applies → completes supervised owner-backed trial → joins via exactly-once membership record → uses one actual beneficial service or rate → earns contribution → unlocks one promotion. The benefits may be a member buyer rate, shared preparation space or access to one supply, **but numerical terms, provider and inventory must be authored/approved**. Do not treat skills, guild membership and local favorability as identical. Guild clerk, trial examiner, workshop and contract station may be separate actors/places.

### S6 — Contract-board, issuer and durable consequences

The accepted [guild and contract interaction routing](contextual-interaction-endpoints-and-contract-station-routing-decision.md) requires observed board/desk browse → an offer card → one quest/contract Accept owner → objective evidence → report at authorized clerk/recipient → one owner-approved reward/standing/access receipt. The [quest/issuer architecture](quest-offer-issuer-and-arc-architecture-consolidation.md) distinguishes canonical definition, issuer, presenter, offer, active obligation and final consequence. Generalize only what a **second genuine consumer** proves beyond Soundings; do not reuse the old UI bridge's generic Turn In as proof of durable quest payout. One material delivery or supervised guild task is enough for the first repeatable request, with exact expiration/refresh only when separately authored.

### S7–S8 — Challenge and measurable growth

The first local encounter must be legitimate under existing World/nearby admission and retain distinct basic/equipped action identities and actual outcome text. Result history, wallet/material rewards, injuries/defeat, continuation and Save must derive from the combat/quest/item owners, not aggregated UI HP differences. Award owner-authorized experience/skill/Knowledge on accepted actions only; **do not silently create universal XP**. A first rank or skill threshold should visibly unlock a real action, permission or benefit, while guild membership/rank remains a separate relationship owner.

## 5. First-pass authoring questions, grouped by blocker

These are **questions to investigate against live canon and code first**, not an instruction to ask the user all questions in one form. An independent priority-selection review should answer what is already determined, identify only the **irreducible missing product choices**, and propose explicit defaults.

| Decision/gap | Repository evidence and constrained default | What still requires authoring, revision or owner approval |
| --- | --- | --- |
| Starting hub/local scene | Existing Starfall/Soundings ordinary path is proven; prefer reuse | Confirm an actual nearby field/resource context and guild/merchant presence rather than attaching an arbitrary static entity to Starfall |
| Intro scenario | Creator/backstory and accepted factual narrative presentation direction exist | The first 2–3 fact-grounded opportunities and whether they are optional/skippable |
| Resource and first acquisition | Static `world.resources` and ecology, no general node owner | Canonical instance/place, depletion/regrowth, method, tool/body/time, yield and Save shape |
| First recipe | Player recipe schema/validation exists; recipe and crafting command not established end-to-end | Existing canonical ingredient/output item keys, station, quantities and process time |
| Merchant/provider | Price/market engine exists but current player transactions and providers do not | One named/present authorized merchant, starting stock, money units, pricing and denial terms |
| Guild choice/entry | 18 canonical guild identities and descriptive membership models | Choose pilot guild/local presence; authorized NPC; actual trial, admission grade, benefit/access rule and promotion threshold |
| Guild request | Soundings is the accepted first durable quest; wider guild request owner held | Issuer/offer/delegation, actual task/evidence, reward and contribution receipts, restart/reoffer/repeat rules |
| Combat | Combat owner and defeat path exist; selected win/choice and result disclosure incomplete | Real ordinary candidate and desired minimum alternative action/reward; use held combat route, not fabricated loot |
| Experience/progression | Existing player progression and survey advancement | Actual skill IDs, threshold and result→progress mapping; no generic XP inference |
| Saves/items | Epoch and stack actions work; non-fungible cutover held | Exact source-repair/old-save policy and which future outputs must be distinct instances |
| Nutrition/magic | Body-state and spell readiness exist; normative models remain held | Defer normalized nutrient pools / generalized magic unless first archetype explicitly requires them |
| UI visual scope | Current PC usability acceptable; small keyboard bug is recorded | Only correct actual blocked interaction; defer cosmetic/systematic redesign |

## 6. Proposed execution sequence and gates

1. **Route selection / exact-master gap review** (docs/analysis only): verify currently installed owner cutover and parked combat decision; select **one** smallest high-impact executable or authoring package, not a parallel broad backlog. Determine whether a legitimate S1 existing-command Current Situation slice can move without waiting for S0 implementation.
2. **S0 independent safety/combat gates**: continue existing item/Save owner task on its authorized isolated branch; make the existing combat victory/result issue actionable, without replacing active prompts or Site deployment.
3. **S1 existing-command scene + narrative first**, if canon and owners support it. This makes newly executable actions discoverable without a new universal command framework.
4. **S2 small acquisition**; validate real resource instance, capacity, depletion and Save. Optionally precede full S1 only if one well-defined WorldPanel action is the safer first consumer.
5. **S3 deterministic player craft** through exact inventory and content owners.
6. **S4 one merchant** with coherent item/currency/stock receipts.
7. **S5–S6 guild clerk, member trial/benefit, request, report, contribution** using real issuer/provider/evidence identities.
8. **S7–S8 integrated combat/experience choices**, building on the separately closed combat owner rather than awaiting it until late.
9. **S9 fresh multi-stage human-selected playthrough** with partial Save/restart checkpoints, stale/retry adversarial tests, and repeatable continuation. Only then consider a Game-version/vertical-slice decision under canonical policy.

Where a stage lacks authored content or specific ownership, perform **one focused authoring/contract repair**, then return to code and selected tests. Do not pause every track for full normalized nutrition, all spell schools, guild hierarchy, mounts, vehicles, 3D map, all-NPC simulation, generalized crafting or cosmetic UI finish.

## 7. Definition of done for the representative regional skeleton

An independent user/session must be able to:

1. Create a new ordinary character with real supported start state; see truthful optional intro and real initial choices.
2. Inspect current place, travel/explore to an accessible activity, and act on observed resource/encounter opportunities with actual owner admission.
3. Acquire a legitimate material, craft with exact inputs, buy or sell with exact stock and currency conservation.
4. Qualify for a real guild, register, use a concrete member-only benefit, accept and report one request and earn verified grade/contribution progress.
5. Face a legitimate chosen challenge; display action/cost/outcome truth, resolve victory or supported defeat and continue.
6. See meaningful skill/Knowledge or affiliation progression without duplicate XP, resources or rewards.
7. Save, fully restart and read back after meaningful stages; stale/repeated commands and failed admission cannot double-pay or mutate.
8. Complete all operations in a **usable desktop UI**, with Save reachable, without developer state injection or an unowned UI shortcut.
9. Continue into at least one further opportunity rather than dead-ending at the scripted tutorial.

Proposed milestone evidence label only: `REGIONAL_PLAYTHROUGH_SKELETON_ACCEPTED` **after** independent selected playthrough acceptance. **Not current status** and **not a Game-version decision**.

## 8. Boundary, precedence and next handoff

This record sets **product priority**, not an arbitrary implementation/branch queue or new accepted technical owner. Source-of-truth precedence: `AGENTS.md`, [repository-first work protocol](../dev/repository-first-agent-work-protocol.md), [branch disposition register](../dev/branch-disposition-register.md), current prompt/output/handoff, authoritative focused design and [Game-version policy](../dev/game-version-roadmap-and-acceptance-policy.md). Historical UI PR #5 is closed/unmerged with its original remote branch retained; PRs #6–#16 and native-v3 protected/held state remain separate. The spare native-v3 staging Site's [cleanup hold](../dev/native-v3-spare-staging-site-cleanup-hold-2026-11-09.md) is not a development dependency.

**Next handoff:** one **Regional Playthrough First-Package Selection And Authoring Gap Review**. It should choose exactly one high-impact, safe package using live source, identify decisions already accepted, list only materially unanswered questions and required authoritative authoring, specify acceptance, and return an implementation-ready Codex scope **only after** the owner/content gates are satisfied. It must not automatically install a new implementation prompt or run a migration, deploy, merge, close/delete branches, alter selected Saves or advance `GAME_VERSION`.
