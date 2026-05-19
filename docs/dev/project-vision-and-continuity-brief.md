<!--
Converted from the repository DOCX continuity brief so GitHub Connector, Codex, and ChatGPT can inspect, search, diff, and cite the project vision directly.
Keep the DOCX as the formatted human-readable copy. Prefer this Markdown file as the repo-readable continuity source for AI-assisted development.
-->

# Lineage: Reforged - Project Vision, Development Direction, and Continuity Brief

Updated 2026-05-19 after the `v0.5.63 - Backstory Legacy Purchase Runtime Shape` handoff and Markdown conversion.

Source note: this document consolidates the uploaded project brief, older EoL / Echoes prompt archives, ongoing project discussions, the current GitHub handoff, and the standing repository workflow rules. Older prompts are treated as useful direction, backlog, or deferred material only where they still fit the current Lineage: Reforged development strategy.

## Revision Note

The current repository anchor is `Version 0.5.63 - Backstory Legacy Purchase Runtime Shape`. That pass added the first family-scoped unlock ownership shape and a read-only Backstory Legacy purchase evidence helper while keeping purchase content, resolver wiring, creator behavior, Legacy purchase UI, and visible backstory availability unchanged.

The prior prompt-routing/tool-selection concern is now treated as an operating rule rather than a blocking pipeline item. `AGENTS.md` already establishes that platform/tool recommendations belong outside prompt bodies. This brief preserves the practical routing matrix so future threads can choose between GitHub Connector, Deep Research, Agent Mode, Codex Plan Mode, Codex Local, Codex Cloud, and lower-cost models without blocking the active game-system pipeline.

The current next pipeline step is `Version 0.5.64 - Backstory Legacy Purchase Content Draft`.

## 1. Executive Summary

Lineage: Reforged is a grounded medieval-fantasy, dynasty-driven systemic RPG. The project should not become a generic RPG where Legacy is merely a perk tree or where features are added just because they sound exciting. The strongest identity is persistent history: characters live, struggle, earn status, create records, found or continue families, alter local standing, and pass limited but meaningful inheritance into future play.

The central development mandate is to build durable systems in the correct order. Validation is clean enough to move from stabilization into systems-building, but the project should still avoid large redesigns mid-pass, avoid weakening validation, and avoid broad feature work before player-facing readability, progression balance, and ownership boundaries are clear.

The current near-term pipeline is focused on Legacy and Bloodline infrastructure, Backstory Legacy purchase content, resolver integration, heirloom / bequest planning, Bloodlines presentation view models, and read-only account meta UI. Combat, magic, UI polish, calendar, difficulty, economy clarity, run-end summaries, and context-aware actions remain high-value tracks, but should be sequenced around the current Legacy/Bloodline foundation rather than scattered into unrelated patches.

| Core Theme | Development Meaning |
| --- | --- |
| Dynasty-driven play | The player's account, families, runs, heirs, renown, estate, and history should matter across lives. |
| Grounded medieval fantasy | Tone, UI copy, mechanics, infrastructure, and art direction should favor believable medieval systems with fantasy depth rather than arcade abstraction. |
| Persistent history over perks | Legacy should primarily represent what was done, who owns it, where it is recognized, and what can be carried forward. |
| System ownership before implementation | Major features need explicit data owners, evidence paths, validation, tests, and UI boundaries before runtime behavior changes. |
| Readable payoff | Every major system must be felt through clear feedback, emotional consequence, and understandable UI. |

## 2. Product Vision and Design Pillars

### 2.1 What the game is

- A classless or lightly class-bound medieval-fantasy RPG where actions, conditions, recovery, risk, and long-term progression shape the character.
- A dynasty and account-history game where individual runs are meaningful even when they end badly.
- A systemic world game where settlements, regions, travel, economy, ecology, combat, magic, property, status, and history eventually interlock.
- A legacy-driven RPG where the past opens options, but does not erase the need to earn status, skill, local trust, and family legitimacy in-world.
- A project that should build slowly, with narrow tested slices, strict validation, and careful separation of planning documents from runtime behavior.

### 2.2 What the game is not

- Not a generic perk-tree RPG where every achievement becomes a universal account buff.
- Not a high-fantasy power fantasy where every system can be bypassed through meta-currency.
- Not a simulation sandbox that should implement kingdoms, migration, war, diplomacy, living economies, genetics, property, and magic all at once.
- Not a UI-first redesign project where visual changes are allowed to destabilize system logic.
- Not a backwards-compatibility project at this stage; the current branch is pre-release and current-data-first unless compatibility is explicitly requested.

### 2.3 Persistent identity model

| Concept | Meaning | Ownership Boundary |
| --- | --- | --- |
| Chronicle | What happened and what the account remembers. | Account history, run archives, achievements, broad account progression. |
| Legacy | What persists because of past action. | Account-wide and scoped unlocks; should not fabricate local/family status. |
| Bloodline / Family | Who owns family-specific memory, prestige, traits, and inheritance. | Family records, family prestige ledgers, family-scoped unlocks, future heirs. |
| Renown | How a place or group sees the character/family. | Region/settlement/faction scoped reputation and authority; not global by default. |
| Knowledge | What the player, character, family, or account has learned. | Geography, lore, trade familiarity, cultural understanding, magic knowledge. |
| Estate | What is materially owned or claimable. | Deposits, future claim delivery, property, land, tools, bequests. |

## 3. Current Branch Reality and Development State

The project has moved out of the earlier broad stabilization pass and into a safer systems-building phase. The latest inspected handoff is `Version 0.5.63 - Backstory Legacy Purchase Runtime Shape`. That pass added runtime-owned family-scoped unlock ownership and a read-only Backstory Legacy purchase evidence helper while keeping purchase content, resolver/creator wiring, Legacy purchase UI, and visible availability deferred.

The prompt-routing review remains important as an operating rule, but it no longer blocks the game-system pipeline. Future prompts should still choose the right platform/model/tool and avoid wasting Codex tokens, while the next repository pass should proceed to the Backstory Legacy purchase content draft.

| Area | Current State | Development Meaning |
| --- | --- | --- |
| Validation / content lint | Passing cleanly in the current handoff. | Strict validation should remain a guardrail. Do not weaken validators unless explicitly justified. |
| World data normalization | Major ecology, travel, settlement, quest, and content-shape drift has largely been cleaned up. | Future world expansion can proceed, but should be deliberate and data-driven. |
| Combat | Foundation pass exists, but combat still needs audit and refinement. | High ROI track: weapon identity, armor/evasion balance, feedback, pacing, and stat relevance. |
| Magic | Design/metadata foundation exists, but runtime magic remains deferred. | Do not expand runtime magic until system roles, scaling, schools, acquisition, and integration are defined. |
| Economy / production | Partially placeholder-backed and needs guardrails/numeric tuning. | Do clarity layers before full simulation. Avoid property/business systems until economy is more stable. |
| Legacy / account | Account profile, Legacy, achievements, history, estate, family state, and family unlock ownership foundations exist. | Current direction should build scoped ownership and evidence paths before richer UI or unlock effects. |
| Backstory resolver | Creator consumes resolver-backed availability; family purchases/evidence are not wired. | Do not inject bad evidence; future purchase ids must flow through approved ownership and resolver paths. |
| Bloodlines | Runtime shape exists; presentation is planned; UI is not implemented. | Next Bloodlines UI work should be view-model-first and read-only. |
| Prompt workflow | Platform/tool labels and routing criteria are captured in AGENTS and this brief. | Keep recommendations outside prompt bodies; do not block active runtime/content pipeline work for more process-only passes unless needed. |

## 4. Development Discipline and Infrastructure Rules

### 4.1 General implementation discipline

- Use current branch reality only. Inspect the live code before proposing or implementing system changes.
- Prefer the smallest coherent patch that advances the current pipeline.
- Preserve unrelated worktree changes.
- Update `docs/dev/current-codex-output.md` on every Codex run and update `docs/future_content_backlog.md` when scope changes.
- Do not reopen stable systems without a specific reason.
- Do not weaken validation unless the validator is demonstrably stale or wrong, and document that reasoning.
- Do not rebuild generated UI/dist output unless explicitly requested or required by the pass.
- Do not add old-save/old-account compatibility paths unless explicitly requested. Current data may be updated directly during pre-release.

### 4.2 Preferred implementation shape

1. Design first when system ownership is unclear.
2. Runtime shape second: add types, storage containers, pure helpers, validators, and tests without behavior if needed.
3. Presentation view model third: derive read-only data before editing React components.
4. UI fourth: render existing view models without adding hidden behavior.
5. Behavior fifth: wire mutating runtime systems only after ownership, validation, and tests exist.
6. Content last when content depends on runtime semantics; do not author large content sets against unstable owners.

### 4.3 Evidence and ownership guardrails

| Guardrail | Reason |
| --- | --- |
| No UI bypasses resolver | Creator/backstory availability must flow through resolver logic, not direct UI checks. |
| No purchase fabricates history | Legacy purchase may support access, but cannot create unsupported family, title, regional, institution, or skill evidence. |
| No parent/child backstory stacking | Only the selected backstory applies starter effects; family history can become evidence later. |
| No design docs imported at runtime | Planning documents and draft catalogs must not become hidden runtime sources. |
| No fake family data | Family trees must derive from stored records; missing parent/root should be shown honestly. |
| No category-currency explosion | Upgrade categories are sorting/presentation tags unless future balancing proves otherwise. |

## 5. Prompt Routing, Model Selection, and Token Discipline

Future prompts should not only contain work instructions. They should also tell the user, outside the copy-paste prompt body, which platform/tool/model class to use and why. This matters because not every task deserves a full Codex implementation run, and some tasks benefit from repo inspection, deep research, or agentic research before any code prompt is written.

### 5.1 Required pre-prompt routing fields

Every generated prompt should specify, outside the prompt body:

- Recommended platform/tool.
- Recommended model/version/strength, including whether a lower/cheaper model is acceptable.
- Reason for the recommendation.
- Manual preflight/action: pull/sync, clean tree, attach files, move files, or no manual action.
- Token-use posture: cheap/light, standard, high-care, or high-risk/strong-model.
- Whether research should happen before Codex.
- Whether the Codex run should be Plan Mode, Local, or Cloud.

### 5.2 Tool routing matrix

| Tool / Platform | Use When | Avoid When |
| --- | --- | --- |
| ChatGPT via GitHub Connector | Repo-aware inspection, last-push review, handoff review, small docs planning, prompt generation, tiny low-risk edits. | A task needs local commands, tests, typecheck, or broad multi-file editing. |
| ChatGPT Deep Research | External research, current public facts, design comparisons, systems research, legal/market/technical background, cited synthesis. | The needed truth is already in the repo or the task is a straightforward code edit. |
| ChatGPT Agent Mode | Multi-step exploratory research or broader investigation that may need browsing, file checks, visual checks, or tool chaining before a Codex prompt. | A narrow repo edit or a simple docs update is already well specified. |
| Codex 5.5 Plan Mode | Non-mutating architecture plans, risk reviews, implementation plans, owner-boundary reviews. | Files must be edited or validation commands must be run. |
| Codex 5.5 Local | Default for real implementation work in this repo: source edits, tests, validation, multi-file changes, schema/runtime shape, local working-tree awareness. | A task is only research or a tiny docs/prompt task that can be handled through ChatGPT/GitHub. |
| Codex 5.5 Cloud | Larger isolated repo tasks where cloud execution is justified and the branch state is safe. | Small/local tasks, worktree-sensitive changes, or tasks where local files/assets matter. |
| Lower/cheaper model/version | Trivial formatting, prompt cleanup, simple copy edits, low-risk docs passes that are easy to verify. | Schema, save/account, Legacy, resolver, combat, economy, magic, multi-file runtime changes, or high-stakes architecture. |

### 5.3 Model/version guidance

Use stronger/current models for high-risk systems: save/account schema, Legacy ownership, resolver behavior, combat math, economy, magic runtime, progression gates, and broad multi-file refactors. A weaker or cheaper model can be acceptable for tiny docs cleanup or prompt formatting, but the prompt should say so explicitly and should not make quality sacrifices that threaten architecture or validation.

When the user asks whether Codex 5.4 is fine versus Codex 5.5, the default answer should be: use the stronger model for runtime/schema/architecture/high-risk work; use the cheaper option only for small, verifiable, low-risk docs or formatting work. Model savings are not worth introducing hidden ownership mistakes.

### 5.4 Token-efficiency rules

- Use ChatGPT/GitHub inspection to reduce Codex context before expensive local implementation runs.
- Keep Codex prompts narrow and file lists targeted.
- Do not ask Codex to rediscover the whole repo when the needed facts can be supplied from the latest handoff.
- Prefer a planning pass before implementation when ownership is unclear.
- Avoid loading unrelated systems, generated output, screenshots, or content files unless the task needs them.
- Be token-aware, but never sacrifice correctness, validation, continuity, or architecture just to save tokens.

## 6. Legacy, Chronicle, Bloodlines, and Backstory Direction

### 6.1 Top-level meta-progression structure

```text
Legacy
  Chronicle
  Bloodlines
```

Chronicle is the account-wide record and progression surface. Bloodlines is the family-scoped surface. "New Game+" should not be a top-level lore category; New Game+ effects belong inside Chronicle or Bloodlines depending on whether they are account-wide preparations, bloodline tendencies, estate bequests, or heir-specific setup.

| Section | Purpose | Examples |
| --- | --- | --- |
| Chronicle | Account-wide progression, broad system unlocks, cross-family continuity, and recordkeeping. | Global preparation capacity, account marks, broad records, account-level visibility. |
| Bloodlines | Family-specific records, prestige, upgrades, heir context, inherited tendencies, and future family evidence. | Family list, tree, Family Prestige, Bloodline upgrades, bequests, heirlooms, family-scoped backstory support. |

### 6.2 Family prestige and scoped currencies

| Resource | Role | Status |
| --- | --- | --- |
| Family Prestige | Earned and spent by a specific family. Supports family upgrades, Bloodline preparations, bequests, heirloom transfers, and family-scoped backstory support. | Ledger shape exists; grant/spend behavior not implemented. |
| Chronicle Marks | Account-wide marks from family accomplishments, conversion, or milestones. Supports broad Chronicle upgrades without inventing family history. | Deferred. |
| Lineage Seals | Rare benchmark currency from heir claim retirement, branch closure, major family milestones, or high-value sacrifices. | Deferred. |

### 6.3 Upgrade categories as sorting tags

Categories should describe how an upgrade affects the player/family. They should not automatically create separate currency pools.

| Category | Meaning |
| --- | --- |
| Renown | Fame, reputation, public standing, recognition. |
| Martial | Combat, tactics, weapons, armor, military traditions. |
| Production | Crafting, workshops, materials, labor. |
| Commerce | Trade, markets, caravans, wealth systems. |
| Lore & Faith | Scholarship, temples, records, magic-adjacent learning, religious standing. |
| Survival / Utility | Travel, wilderness, endurance, scouting, general quality-of-life utility. |
| Household / Lineage | Heirs, family structure, bloodline continuity, family identity. |
| Preparation | Next-character, starter support, setup, limited run-start effects. |

### 6.4 Bloodline, bequest, and heirloom distinctions

| Concept | Correct Meaning | Examples | Boundary |
| --- | --- | --- | --- |
| Bloodline | Inherited potential, aptitude, tendency, temperament, growth, or prestige affinity. | Stat tendency, skill growth chance, family-associated aptitude, prestige gain tendency. | Not an intentional gift; should not be called a bequest. |
| Bequest | Intentional estate/material transfer. | Coin, tools, land parcel, workshop stake, legal writ, supplies. | Does not grant genetic traits or social identity by itself. |
| Heirloom | A specific persistent item instance with a chain of ownership. | Ancestral sword, named tool, family signet. | One eligible holder; no duplication; loss/theft/breakage interrupts chain. |

### 6.5 Backstory direction

- Backstories are formative origins, not current jobs or classes.
- The creator applies one selected backstory; parent/child lineage effects do not stack.
- Tier 1 origins can be common, hardship, labor, local, or low-skill starts.
- Tier 2/Tier 3 origins require evidence and scoped ownership; Legacy purchase alone should fail.
- Family-scoped backstory unlocks should eventually use family records, family prestige, family history evidence, and deliberately tagged Backstory Legacy purchase records, but only after evidence owners and resolver integration are approved.
- Minor Noble remains blocked by family/status/title systems. Merchant Family requires trade/family evidence. Garrison Ward requires martial/source-run/family evidence. Local Champion remains regional/story/achievement scoped. World-Stray remains special/manual or hidden.

## 7. Current Pipeline

The latest inspected handoff says `Version 0.5.63 - Backstory Legacy Purchase Runtime Shape` has landed. The next run should be the Backstory Legacy Purchase Content Draft, using the newly added ownership/evidence-helper shape without wiring purchases into the resolver or creator yet.

| Version | Name | Intent | Key Guardrail |
| --- | --- | --- | --- |
| 0.5.63 | Backstory Legacy Purchase Runtime Shape | Landed: added family-scoped unlock ownership and a read-only Backstory Legacy purchase evidence helper. | No purchase content, no resolver/creator wiring, no visible availability change. |
| 0.5.64 | Backstory Legacy Purchase Content Draft | Author initial Backstory Legacy purchase content draft after ownership shape exists. | No resolver integration and no creator-visible change yet. |
| 0.5.65 | Backstory Legacy Purchase Resolver Integration | Pass owned purchase ids into resolver in a scoped, tested way. | No fake family evidence; wrong-scope purchases fail. |
| 0.5.66 | Heirloom And Bequest Systems Plan | Plan estate/material inheritance and item-chain inheritance separately from Bloodline traits. | Planning-only unless explicitly changed. |
| 0.5.67 | Bloodlines View Model Implementation Plan | Plan or begin pure projection of families, tree, and prestige summaries. | View-model first; no React sprawl. |
| 0.5.68 | Bloodlines Read-Only Account Meta UI | Render Bloodlines in the account meta/Chronicles surface. | Read-only; no family management or unlock bypass. |

## 8. Consolidated High-ROI Development Tracks

The prompt archive correctly identifies several high-value tracks, but their order needs to be reconciled with the current Legacy/Bloodline pipeline. The best rule is: do not stack giant simulation systems faster than the player can perceive value. Pair every meaningful system with clear feedback, emotional payoff, readable UI, progression hooks, and future scalability.

| Priority Band | Track | Why It Matters | Recommended Treatment |
| --- | --- | --- | --- |
| Immediate / Near | Backstory Legacy purchase content and scoped resolver integration | Directly continues the current pipeline and protects the family/backstory direction. | Proceed narrowly after the landed ownership/runtime-shape pass. |
| Immediate / Near | Combat / equipment audit | Combat is touched constantly; small improvements affect every run. | Audit before broad combat expansion. |
| Immediate / Near | Run-end / Chronicle impact summary | Turns death/retirement into meaningful progression. | High ROI after current pipeline or as a focused UI/system pass. |
| Immediate / Near | Difficulty + starting season creator page | Makes starts meaningful and ties time/weather to challenge. | Good near-term creator enhancement once resolver/Legacy work stabilizes. |
| Immediate / Near | Calendar / climate popup | Makes time, seasons, travel, farming, and climate readable. | High ROI UI feature; should be focused and data-backed. |
| Immediate / Near | Magic system design/audit | Prevents chaotic runtime expansion. | Design/audit before runtime magic implementation. |
| Mid | Economic clarity layer | Makes trade legible without rewriting economy. | Add fair/cheap/expensive indicators, scarcity hints, resale expectations. |
| Mid | Context-aware actions | Reduces friction and increases immersion. | Implement after action/state ownership is clear. |
| Mid | Failure feedback system | Improves mastery and reduces frustration. | Use concise causal explanations tied to actual systems. |
| Mid | Soft tutorial through system feedback | Teaches naturally without tutorial walls. | Use contextual hints and warnings. |
| Mid / Major | Home / land / ranching / property | Strong dynasty support. | Wait for estate/economy ownership seams. |
| Major | Living settlements / migration / supply-demand | Flagship systemic world layer. | Later; depends on economy, settlement data, and performance boundaries. |
| Major | Kingdoms / diplomacy / war / governance | Deep political endgame. | Late; requires settlements, renown, estate/title, combat, and economy foundations. |

## 9. Consolidated Idea Triage

| Idea | Consolidated Direction | Status |
| --- | --- | --- |
| Cultured / Beast / Savage faction selector | Reframe before use. Avoid simplistic good/evil ancestry labels. If needed, design as culture/civilization/origin grouping with grounded social meaning. | Deferred / needs redesign. |
| Family-based Legacy upgrades | Central to Bloodlines. Use Family Prestige and family-scoped unlock ownership. | Accounted for; runtime shape underway. |
| Family total/used prestige, reset/refund, closing family for bonus | Use ledger totals. Reframe as closing a branch, retiring an heir claim, or dedicating a line to the Chronicle. Avoid crude language. | Partially planned; conversion deferred. |
| Attendants or party character unlocks | Treat as future Retinue/Companion system tied to social status, estate, or leadership. | Deferred. |
| Political realm / city governance / royalty / conquest | Late governance track using renown, estate/title, kingdom systems, diplomacy, and war. | Major deferred. |
| Sidebar width modes and logo variants | Useful UI polish but should not interrupt system pipeline. | UI backlog. |
| Character image generator / Perchance embedding | Optional external tool integration; sandbox and do not make it core to gameplay loops. | Deferred / non-core. |
| Context-aware action commands | High-value pacing improvement once action ownership is stable. | Mid-priority. |
| Calendar popup | High-ROI UI feature for seasons/climate/travel/farming. | Near-term candidate. |
| More settlements and period trade roles | Valuable world depth; should be data-driven and validation-safe. | Deferred until targeted content pass. |
| Settlement progression, supply/demand, migration, luxuries | Belongs to living settlements/economy simulation. | Major deferred. |
| Difficulty page and starting season selection | Strong near-term creator feature. | Near-term candidate. |
| Magic affinity / all elements / Legacy gates | Decide in magic system design, not ad hoc. | Design needed. |
| Player home / land / gardening / ranching | Strong dynasty/estate extension; depends on estate and economy ownership. | Mid-to-major deferred. |
| Tutorial system | Prefer soft tutorial and contextual feedback first. | Mid-priority. |
| Combat audit / weapon and equipment skills | Very high ROI. | Near-term after or between Legacy pipeline slices. |
| Starting skill caps plus Legacy scaling | Aligns with replayability; must respect starter caps, backstory policy, and breakthrough gates. | Near-term but needs careful design. |
| Inter-city requests, edicts, kingdom/capital requests | Opportunity/public works layer bridging economy and governance. | Deferred; good mid/late system. |
| Profit/expense popup | Economic clarity layer. | Mid-priority. |
| Standalone summary screen for playthroughs | Run-end / Chronicle impact screen. | High ROI. |
| Species slayer Legacy | Best as family-specific renown/title track gated by kill history and enemy taxonomy. | Deferred until combat history/family ledger ownership. |
| Account vs Family Legacy split | Superseded by Chronicle / Bloodlines terminology. | Addressed conceptually. |

## 10. System Roadmaps by Domain

### 10.1 UI / UX

Keep the UI readable and reduce friction before major simulation layers. High-value candidates include compact top bar, HP/MP/STA clarity, calendar popup, run-end summary, failure feedback, Legacy preview feedback, and economic clarity labels. Bloodlines UI should start read-only and view-model-first under Chronicles/account meta, not character creator. Theme polish should continue gradually; adaptive themes wait until token coverage and UI surfaces are stable. Mobile/tablet redesign, animation polish, and larger visual refinements are deferred.

### 10.2 Combat

Combat foundation exists, but the next valuable work is an audit, not a huge expansion. Audit weapon identity, armor vs evasion, ranged vs melee parity, shields, stat usefulness, enemy threat variety, consumables, feedback clarity, and pacing. Avoid touching broad combat architecture unless the audit identifies a concrete gap. Future species-slayer/family titles should wait for reliable combat history and enemy taxonomy.

### 10.3 Magic

Magic should remain design-first until access model, school identities, resources, scaling channels, combat role, utility role, and Legacy interactions are settled. INT/WIS/SPT should matter, but their roles need clear separation rather than generic spell power stacking. Legacy can unlock breadth, affinity, training, or access, but should not turn magic into an ungrounded account buff. Runtime magic implementation should happen in phased slices with validation guardrails.

### 10.4 Economy / production / opportunity

Do economic clarity before full economic simulation. Add readable hints such as fair/cheap/expensive, scarcity, demand, resale potential, and why prices changed. Opportunity discovery can surface shortages, caravans, public works, work demand, danger, and regional needs without forcing quest rails. Business/property control, production-chain tuning, workplace labor modeling, and living supply/demand should wait for stronger economy ownership.

### 10.5 World / settlements / travel / ecology

The world data is normalized enough to support targeted additions, but more settlements should be added carefully with period-appropriate trade roles and validation-safe relationships. Travel can later gain seasonal danger, climate effects, and stronger calendar integration. Ecology can later deepen into resource identity and simulation, but should not bloat early gameplay without payoff. Living settlement progression, migration, prosperity cycles, and luxuries are late systems requiring economy guardrails.

### 10.6 Dynasty / heirs / estate / property

Family records and prestige ledger shape now exist, but no family creation/management flow exists yet. Heirs should inherit partial standing, not full rank, and should preserve progression instead of replacing it. Estate currently has deposits/preview foundations; future claim delivery must avoid duplication and should be prestige-gated. Heirlooms should be persistent item chains with one eligible holder and real loss risk. Bequests should represent intentional material/estate transfers, not genetic RNG or general starter bonuses. Hybrid ancestry/genetics should be heir-only and deferred until heir systems are real.

## 11. Deferred Projects and Dependency Map

| Deferred Project | Blocked By / Needs | Notes |
| --- | --- | --- |
| Estate claim delivery | Estate ownership seams and no-duplication rules. | Do not implement until claim lifecycle is defined. |
| Business/property control | Economy stability, ownership model, market guardrails. | Easy to destabilize; defer. |
| Hybrid ancestry / genetics | Heir system, family branches, trait model. | Heir-only; not a current creator ancestry blend. |
| Adaptive themes | Full token migration and stable UI layout. | Theme polish can continue; adaptive logic waits. |
| Genealogy tree UI | Family creation/linkage flows, family data, view-model plan. | Planning exists; implementation deferred. |
| Missing flora/fauna / reef ecosystems | Targeted content pass and validation. | Valid content backlog, not system-critical. |
| Production-chain numeric tuning | Economy guardrails and workplace model. | Avoid premature tuning. |
| Kingdoms/governance/diplomacy/war | Settlements, economy, renown, titles, combat, AI/event systems. | Late flagship system. |
| Mobile/tablet redesign | Stable desktop UI patterns. | Later UX pass. |
| Animation polish | Stable UI surfaces. | Later visual polish. |

## 12. Prompt and Pipeline Hygiene

- Future prompts should continue to be narrow, branch-aware, explicit about allowed/forbidden file changes, and explicit about tool/model routing.
- Every prompt should start with a version and a single coherent goal.
- Put platform/tool/model recommendations outside and before the copy-paste prompt body.
- Put manual file actions outside the prompt body when handing work to Codex.
- Always list files to inspect and files allowed to change.
- Always include behavior/runtime confirmation requirements.
- Always include validation commands appropriate to the scope.
- For docs-only passes, do not run broad tests or typecheck unless tooling requires it.
- For runtime shape passes, include focused tests and document known typecheck blockers.
- Never allow a prompt to import design docs/draft catalogs into runtime code unless the pass is explicitly a migration into live content.
- Always state whether Deep Research or Agent Mode should be used before Codex when outside knowledge, broad investigation, or multi-step research would improve quality.
- Prefer ChatGPT/GitHub Connector for handoff inspection and prompt generation to reduce Codex token use.

## 13. Recommended Strategic Order After the Current Pipeline

1. Continue using the prompt-routing and tool-selection guardrail so future prompts state platform, model/version/strength, research path, and token posture clearly.
2. Finish Backstory Legacy purchase content draft and resolver integration so family/backstory unlocks are safe and scoped.
3. Plan heirloom and bequest systems separately, preserving Bloodline vs Bequest vs Heirloom terminology.
4. Implement Bloodlines view-model and read-only account meta presentation only after family data has enough shape to render honestly.
5. Run a combat/equipment audit and apply the smallest high-ROI combat feedback/identity fixes.
6. Design or refresh the magic runtime model before adding new magic behavior.
7. Add run-end / Chronicle impact summary and failure feedback to make deaths and retirements feel meaningful.
8. Add difficulty and starting season page if creator scope is stable.
9. Add calendar/climate popup and economic clarity layers to make time/travel/trade understandable.
10. Add context-aware actions once action ownership is clear.
11. Only then consider property, settlement expansion, living settlement simulation, kingdoms, diplomacy, and war.

## 14. North Star

The project's north star is a dynasty-driven systemic RPG where persistent history matters. Every new system should answer at least one of these questions: What did this character do? Who remembers it? Which family owns it? Where is it recognized? What can be carried forward? What remains dangerous or uncertain despite the inheritance?

That is the difference between Lineage: Reforged and a generic RPG. The safest path is to keep building narrow, validated, owner-aware systems that make the player feel history accumulating without letting meta-progression flatten the world.

## Appendix A - Consolidated Source Status

| Source Item | How It Was Treated |
| --- | --- |
| Uploaded consolidated brief / repository DOCX | Used as the baseline and converted into this Markdown continuity source. |
| New Prompts archive | Used for stabilization state, high-ROI priorities, strategic rules, and broad backlog. Reconciled against current repo direction; older spell-audit-first language is no longer treated as absolute while the Legacy/Bloodline pipeline is active. |
| Ideas file | Used for raw future ideas and triage. Consolidated into current terminology; obsolete phrasing replaced where appropriate. |
| Current GitHub handoff v0.5.63 | Used as the current pipeline anchor and repository reality checkpoint. |
| AGENTS workflow review | Used to preserve prompt-routing and token-aware tool/model selection requirements. |
| Ongoing conversation | Used for decisions about Chronicle/Bloodlines, Family Prestige, Chronicle Marks, Lineage Seals, Bloodline vs Bequest vs Heirloom, backstory resolver guardrails, Codex workflow, and prompt routing. |

## Appendix B - Prompt Routing Cheat Sheet

| Task Type | Recommended Route |
| --- | --- |
| Last push inspection / handoff summary | ChatGPT via GitHub Connector. |
| Prompt generation for a known next repo step | ChatGPT via GitHub Connector, then Codex Local only when implementation is needed. |
| Docs-only planning in repo | GitHub Connector for tiny edits or Codex 5.5 Local if local validation/backlog updates are needed. |
| Runtime/source implementation | Codex 5.5 Local by default. Use a stronger/current model for schema, save/account, Legacy, resolver, combat, economy, magic, or broad architecture work. |
| Non-mutating implementation plan | Codex 5.5 Plan Mode. |
| External design research / current facts | ChatGPT Deep Research with citations. |
| Multi-step research or exploratory investigation | ChatGPT Agent Mode when broader browsing or tool chaining would materially improve quality. |
| Large isolated repo task | Codex 5.5 Cloud only when cloud execution is justified and local worktree sensitivity is low. |
| Trivial formatting / copy cleanup | Lower-cost model/version may be acceptable if easy to verify. |

## Appendix C - New Thread Starter

When starting a new ChatGPT thread, provide this note with the brief:

```text
I am continuing development of Lineage: Reforged.

Repo: vagabond1215/Lineage_Reforged
Default branch: master
Current handoff file: docs/dev/current-codex-output.md
Primary repo instruction file: AGENTS.md
Repository-readable continuity brief: docs/dev/project-vision-and-continuity-brief.md

Use the project continuity brief as the strategic source of truth.
Then inspect the current repo handoff before giving prompts or recommendations.
The live handoff takes precedence over the brief for exact current version state.

When I ask “inspect the push,” read docs/dev/current-codex-output.md first, then inspect changed/important files as needed.

When I ask “prompt please,” produce a routed, copy-paste-ready versioned prompt with platform/model recommendation, manual preflight, exact file list, allowed/forbidden changes, validation, and required handoff output.
```
