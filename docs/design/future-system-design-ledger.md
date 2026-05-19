# Future System Design Ledger

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Status: durable design-criteria ledger; not an implementation handoff

## Purpose

This file preserves stable future-system design criteria, vocabulary decisions, boundary rules, and unresolved design questions for Lineage: Reforged.

Use this file when a future ChatGPT, GitHub Connector, Deep Research, Agent Mode, or Codex thread needs the durable conceptual intent behind systems that are not fully implemented yet.

This file exists to prevent long-running design intent from being lost when:

- a ChatGPT thread is restarted
- conversation memory is compacted
- a handoff is intentionally kept short
- a roadmap is narrowed to version sequencing
- the chronological backlog becomes too noisy for conceptual reuse

This file is not:

- the exact current implementation state
- the active Codex output handoff
- a chronological backlog
- a transcript of old conversations
- a runtime source
- a draft catalog to import into code
- permission to implement broad feature work

## Source Material And Decomposition Role

This ledger consolidates durable design intent from:

- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `docs/future_content_backlog.md`
- relevant `docs/design/*` planning files
- ongoing design conversations about Legacy, Chronicle, Bloodlines, renown, heirs, bequests, heirlooms, magic, economy, combat, calendar, UI, and prompt workflow

Recommended long-term document split:

| Document | Should own |
| --- | --- |
| `docs/dev/current-codex-output.md` | Exact latest Codex implementation result, files changed, checks run, next version. |
| `docs/dev/current-gpt-handoff.md` | Latest connector-side audits, immediate prompt guardrails, current risk findings. Keep short and current. |
| `docs/dev/project-roadmap.md` | Version-band meaning, active pipeline, playability checkpoints, tool-routing queue. |
| `docs/future_content_backlog.md` | Chronological deferred work and historical run notes. |
| `docs/design/future-system-design-ledger.md` | Durable design criteria, vocabulary rules, system boundaries, open conceptual questions. |
| `docs/dev/project-vision-and-continuity-brief.md` | Strategic north-star index and source map after future deconstruction. |

Future cleanup direction:

- Do not delete the continuity brief immediately.
- Gradually deconstruct repeated material from the brief into the specialized files above.
- After this ledger is established, the brief can become shorter: north star, authority map, active pipeline pointer, and new-thread starter.
- Do not move exact current implementation state into this ledger.
- Do not move chronological run-note history into this ledger.

## Authority And Precedence

When sources conflict, use this order:

1. `docs/dev/current-codex-output.md` for exact latest implementation state.
2. `docs/dev/current-gpt-handoff.md` for latest connector-side audits, current prompt guardrails, and immediate risks.
3. `docs/dev/project-roadmap.md` for active version order, version-band maturity, playability checkpoints, and tool routing.
4. `docs/dev/project-vision-and-continuity-brief.md` for strategic vision until it is decomposed.
5. This ledger for durable future-system criteria and vocabulary intent.
6. `docs/future_content_backlog.md` for historical deferred notes and reminders.
7. Older `docs/design/*` plans for rationale and boundaries, unless newer handoffs supersede their exact sequence or state.

If this file conflicts with a newer Codex handoff, trust the newer handoff for exact repo state and update this ledger only if the design intent itself changed.

## Maintenance Rules

- Keep this file curated, not exhaustive.
- Add durable criteria that are likely to matter across multiple future threads.
- Prefer short system capsules over long implementation plans.
- Put detailed implementation steps in a specific design plan or Codex prompt, not here.
- Move active short-term findings into `docs/dev/current-gpt-handoff.md` when they directly affect the next Codex run.
- Remove or compress sections after they are implemented, superseded, or split into dedicated design documents.
- Keep unresolved topics in `Open Clarification Queue` until the user gives a decision.
- Never import this file into runtime code.

## North-Star Criteria

Lineage: Reforged should remain a grounded medieval-fantasy, dynasty-driven systemic RPG.

Every major system should answer at least one of these questions:

- What did this character do?
- Who remembers it?
- Which family owns it?
- Where is it recognized?
- What can be carried forward?
- What remains dangerous, limited, or uncertain despite inheritance?

Design default:

- persistent history over generic perks
- owned evidence over invented eligibility
- family/local status over universal account shortcuts
- clear UI payoff over hidden simulation
- narrow validated slices over giant feature jumps
- grounded medieval logic before spectacle
- current-data-first while pre-release

## Global Design Rules

### Ownership Before Behavior

Do not implement meaningful runtime behavior until the owner is explicit.

Before a system changes gameplay, identify:

- data owner
- evidence source
- scope owner
- validation rules
- UI boundary
- tests
- failure state
- deferred behavior

Examples:

- Family Prestige must belong to a family ledger, not a loose account total.
- Regional renown must belong to a place or hierarchy, not become global status by default.
- Backstory availability must flow through the resolver, not UI direct checks.
- Heirloom continuity must belong to a specific item instance, not a duplicated item catalog entry.

### Evidence Before Access

Legacy purchases and meta-progression may preserve or authorize access, but they must not fabricate history.

Rules:

- Deeds unlock; Prestige preserves.
- Purchase alone should not create family history, noble blood, institutional membership, regional recognition, estate/title ownership, mount ownership, market contacts, magic licensing, medical background, oath status, or paladin identity.
- Scoped systems need scoped evidence.
- Missing evidence owners should produce locked, hidden, deferred, special, or warning states.

### Presentation Before Mutation

For complex future systems, prefer this sequence:

1. design criteria
2. runtime shape / pure helpers / validation
3. read-only view model
4. read-only UI
5. mutating behavior
6. content expansion

Avoid mutating UI actions before the data owner and validation are already proven.

### Current Data First

This project is pre-release and current-data-first unless the user explicitly asks for compatibility.

Do not add:

- old-save rescue behavior
- id aliases
- migration-only compatibility paths
- historical-id preservation
- broad compatibility fallbacks

Current authored content and current account/save shapes should validate directly.

### Drafts Are Not Runtime

Design docs, draft catalogs, and policy drafts are not hidden runtime data sources.

Rules:

- Do not import design docs into runtime.
- Do not import draft catalogs into gameplay unless the pass is explicitly a live-content migration.
- Content prompts must state whether new records are live, draft-only, hidden, catalog-visible, inert, or effect-bearing.
- `implementationPriority: "catalog_only"` or `"backlog"` is not a safety guard unless runtime/UI/purchase paths actually enforce it.

## Vocabulary Ledger

| Term | Meaning | Guardrail |
| --- | --- | --- |
| Chronicle | Account-wide memory, records, run history, milestones, broad continuity. | Does not fabricate family-specific history. |
| Legacy | What persists because of past action. | Should not become a generic perk tree detached from deeds and owners. |
| Bloodlines | Family-scoped progression, records, prestige, heirs, inherited tendency, family identity. | Do not conflate with species/ancestry lineage ids. |
| Family | A specific account-owned household/line with records, members, prestige, and future heirs. | Do not infer from `lineageId` alone. |
| Lineage | Usually ancestry/species/bloodline identity depending on context; in current code often playable ancestry. | Avoid using it where `familyId` is required. |
| Renown | Recognition by a place, faction, culture, realm, or social hierarchy. | Not global by default. |
| Family Prestige | Family-owned resource earned/spent by a specific family ledger. | Not account Prestige. |
| Chronicle Marks | Future account-wide marks from milestones or reduced family conversion. | Do not create family history for unrelated families. |
| Lineage Seals | Future rare benchmark/capstone resource from major family closure/sacrifice/milestones. | Not farmable generic currency. |
| Backstory | System/content type for formative origin package. | Not a job class. |
| Origin / Upbringing / Background | Player-facing prose for formative context. | Do not imply current profession if it is only history. |
| Bloodline upgrade | Inherited potential, tendency, aptitude, temperament, growth, or prestige affinity. | Not a bequest. |
| Bequest | Intentional material, estate, legal, or household transfer. | Not genetic, aptitude, or stat-growth inheritance. |
| Heirloom | Specific persistent item instance with an ownership chain. | Not duplicated and not ordinary starter gear. |
| Estate | Material ownership, deposits, claim delivery, property, land, tools, and documents. | Does not imply social legitimacy unless title/status owner exists. |
| Knowledge | Geography, lore, trade familiarity, cultural understanding, magic learning, or practical learning. | Scope must be explicit: account, character, family, region, or institution. |

Forbidden or risky drift:

- Do not use `class` as the main identity model for backstories.
- Do not use `archetype` as player-facing backstory policy language.
- Do not use `Starting Lore` for all starting skills unless the skills are actually lore-only.
- Do not call every future-start effect New Game+.
- Do not describe family branch closure with crude or exploitative wording.
- Do not call bequests bloodline traits.
- Do not call heirlooms bequests when the item-chain identity matters.

## Legacy / Chronicle / Bloodlines Criteria

Top-level meta-progression should conceptually be:

```text
Legacy
  Chronicle
  Bloodlines
```

Chronicle should own:

- account-wide progression
- broad records
- run archives
- cross-family continuity
- account-level visibility
- global preparation capacity
- broad milestones

Bloodlines should own:

- family list
- family tree/history
- Family Prestige
- family-scoped upgrades
- heir context
- Bloodline tendencies
- family-scoped backstory support
- bequests
- heirlooms

Rules:

- Chronicle upgrades can help future families without pretending those families have local/family history.
- Bloodline upgrades should be family-scoped by default.
- Family upgrades must not apply to unrelated random characters.
- Categories are sorting/presentation tags unless future balancing proves separate currencies are needed.
- Do not fragment currencies without a strong balancing reason.

## Family / Ancestry / Heir Criteria

Desired future `Family` or `Ancestry` surface:

- list family names that have existed
- show a basic family tree
- show how many heirs remain available from each family when heir systems exist
- show active/dormant/closed family status when supported
- show Family Prestige totals from ledger-derived data
- keep unsupported future actions inactive or omitted

Family visibility rule:

- Show families only when current data proves they exist.
- Do not show empty placeholder families.
- Do not create families from loose lineage/species ids.
- Do not imply noble/title/status families without owner systems.

Family tree rule:

- Prefer flat validated records plus derived presentation.
- Use `familyId`, `rootCharacterId`, `memberCharacterIds`, and `parentCharacterId` when available.
- `sourceRunId` can be a continuity hint, but it is not automatically a family id or parent id.
- Missing parent/root links should be shown honestly, not repaired through guesses.

Heir direction:

- Heirs should inherit partial standing, not full rank.
- Heirs should preserve progression without erasing danger or effort.
- Heir slots and branch closure can later create meaningful sacrifices or Chronicle/Seal conversion.
- Do not implement heir generation, heir slots, or family management until the owner path is explicit.

## Family Prestige, Chronicle Marks, And Lineage Seals

### Family Prestige

Family Prestige is earned by and spent by a specific family.

It should support:

- family upgrades
- Bloodline preparations
- family-scoped backstory support
- bequests
- heirloom transfer/registration
- family record/tree upgrades

Rules:

- Use a ledger, not a raw mutable balance.
- Derived totals should include earned, spent, available, source run/character, category tags, and summaries.
- Family Prestige should not be spent account-wide unless converted through an explicit Chronicle mechanism.

### Chronicle Marks

Chronicle Marks are future account-wide marks from family accomplishments, milestones, or reduced conversion.

Purpose:

- allow successful families to benefit the account without fabricating history for unrelated families
- reduce runaway snowballing
- create tradeoffs between family-local power and account-wide continuity

### Lineage Seals

Lineage Seals are rare future capstone resources.

Potential sources:

- retiring heir claims
- closing branches
- major family milestones
- high-value family sacrifices
- capstone Chronicle/Bloodline decisions

Rules:

- Use for structural or capstone upgrades.
- Do not turn into a farmable generic currency.

## Renown Criteria

Renown should be a dynastic/local status ladder, not a universal popularity stat.

Rules:

- Renown can exist at settlement, city, region, kingdom/realm, continent, or universal levels when supported by data.
- Lower-level renown should support higher-level recognition only through explicit hierarchy rules.
- Different governments/cultures may use different rank names if the system remains readable.
- Renown upgrades should generally require in-run achievement before purchase/preservation.
- Family-oriented renown should be inherited by heirs or family members, not arbitrary unrelated new characters.
- Regional or settlement renown should not automatically become global status.
- Social/political authority should require appropriate owner systems, not just account Legacy.

Design pattern:

```text
in-run deed / local standing -> unlocks purchase or preservation path -> scoped family/location renown persists for eligible descendants
```

Avoid:

- random nobility starts with no family history in the area
- account-wide noble recognition from unrelated renown
- generic prestige buying local trust out of nowhere

## Backstory And Backstory Legacy Criteria

Backstories are formative origins, not current jobs/classes.

Core rules:

- Creator applies exactly one selected backstory package.
- Parent/child backstory effects do not stack.
- Backstory availability must flow through the Backstory Eligibility resolver.
- UI must not bypass resolver output.
- Legacy purchase can support access, but must not create unsupported history.
- Tier 2 and Tier 3 origins require scoped evidence plus purchase/support when appropriate.
- Blocked systems must remain locked/hidden/deferred/special.

Backstory Legacy purchase rules:

- Account-scoped purchases are acceptable only for broad low-risk Tier 1 access.
- Family-scoped purchases require explicit `familyId` and matching family ownership.
- Region/local purchases require durable scoped regional or settlement evidence.
- Institution/title/estate/source-run scopes require their owner systems before use.
- Missing scope defaults can be dangerous; family-scoped records must explicitly declare family scope.
- Do not use account wealth or account Legacy alone to unlock noble, institution, title, family, magic, mount, medical, oath, or market-contact origins.

Origin examples:

- Minor Noble requires future family/status/title ownership.
- Merchant Family requires family/trade evidence.
- Garrison Ward requires martial/source-run/family evidence.
- Local Champion remains regional/story/achievement scoped.
- World-Stray remains special/manual or hidden.
- Hedge Adept waits for magic acquisition/licensing ownership.
- Temple Acolyte waits for institution/divine/oath ownership.

`0.5.64` safety rule:

- Do not add naive live `legacy_unlocks.json` Backstory Legacy records if they become visible or purchasable without the approved guard.
- Either keep records draft-only outside the live imported catalog or add minimal visibility/purchase blocking for catalog-only/backlog backstory-tagged records.

`0.5.65` seam rule:

- The caller that builds `legacyPurchaseIds` is the trust boundary.
- Use `resolveOwnedBackstoryLegacyPurchaseIds(...)` or an equivalent scoped helper.
- Do not hand-copy ids into resolver evidence.
- Do not invent `familyId` from source run, lineage id, account id, or UI state.

## Bloodline, Bequest, And Heirloom Criteria

### Bloodline

Bloodline means inherited potential, tendency, aptitude, temperament, growth, or prestige affinity.

Examples:

- stat tendency
- skill growth chance
- family-associated aptitude
- prestige gain tendency
- inherited resistance or temperament modifier

Rules:

- Family-scoped by default.
- Does not stack backstory starter packages.
- Does not bypass starter caps or breakthrough gates.
- Does not imply an intentional material gift.

### Bequest

Bequests are intentional estate/material transfers.

Examples:

- coin
- tools
- supplies
- land parcel
- workshop stake
- estate claim
- household documents
- trade license
- legal writ

Rules:

- Requires estate or family ownership.
- Should not grant genetic traits, aptitude, social status, or backstory identity by itself.
- Should not imply title/status unless those owner systems exist.

### Heirloom

Heirlooms are specific persistent item instances with chains of ownership.

Rules:

- Registration should be expensive.
- Transfer should cost Family Prestige.
- The item is not duplicated.
- One eligible holder at a time.
- Loss, theft, confiscation, breakage, or destruction can interrupt the chain.
- Recovery should require gameplay ownership later.
- Heirloom status should not make an item immune to the world.

## Magic Criteria

Magic should remain classless and design-first.

Primary model:

```text
known spell + equipped conduit/casting tags + optional catalyst + character control capacity = final cast profile
```

Core rules:

- No mage class requirement.
- No required prepared spell slots as the primary limiter.
- Tags describe compatibility/modifiers; tags must not directly execute effects.
- Runtime magic expansion must be narrow and deterministic.
- Read-only metadata/UI can advance before runtime casting.
- Broad runtime spell execution remains deferred until owner boundaries are explicit.

Stat roles:

- INT: theory, formula construction, inscription literacy, shape complexity, arcane comprehension.
- WIS: perception, restraint, diagnosis, natural/divine alignment, safe decision-making.
- SPT: will, channel pressure, sustained shaping, spiritual throughput, backlash resistance.
- DEX, CON/VIT, and CHA can contribute as supporting stats depending on spell family and delivery.

Magic Legacy forbidden early:

- direct spell power bonuses
- direct magic skill-rank grants
- free starter spell bundles that bypass acquisition
- generic magic effect execution
- bypassing catalyst/control constraints
- bypassing MP/strain constraints

Allowed later, gated:

- access lanes to teachers/traditions
- starter permission lanes where justified
- safe-casting threshold support
- recovery/preparation support
- known-spell capacity only if future design still needs it

## Combat And Equipment Criteria

Combat is high ROI, but broad rewrites are risky.

Future combat work should begin with audits and focused fixes.

Audit topics:

- weapon identity
- armor vs evasion
- ranged vs melee parity
- shields and blocking
- stat usefulness
- enemy threat variety
- consumables
- combat pacing
- feedback clarity
- skill gain pacing
- weapon/profile hooks

Rules:

- Do not change broad combat math without focused tests.
- Do not let weapon, crit, or skill Legacy effects bypass combat ownership and progression gates.
- Combat skill gain should stay policy-routed and source-capped.
- Species-slayer/family titles should wait for durable combat history, enemy taxonomy, and family ledger ownership.

## Economy, Production, And Opportunity Criteria

Do economic clarity before full economic simulation.

Near/mid-term clarity layers:

- fair/cheap/expensive price labels
- scarcity hints
- demand cues
- resale expectations
- why prices changed
- public works or opportunity boards
- caravan/shortage/danger notices

Rules:

- Property/business systems wait for economy ownership.
- Production-chain tuning waits for stable workplace/labor/market contracts.
- Contacts, market passives, free income, business ownership, and institutional privileges require owner systems.
- Opportunity discovery should guide without turning into quest rails.

## Calendar, Climate, Travel, And World Criteria

Calendar and climate are strong readability/payoff systems.

Near-term candidates:

- calendar popup
- climate/season/travel warning surface
- starting season creator option after creator scope is stable
- difficulty/start-condition page after resolver/Legacy work stabilizes

Rules:

- Make time, seasons, travel, farming, and climate readable before deep simulation.
- Travel danger should be data-backed and readable.
- Do not add weather/climate effects that players cannot understand or anticipate.
- More settlements and trade roles should remain data-driven and validation-safe.
- Living settlement progression, migration, prosperity cycles, luxuries, kingdoms, diplomacy, and war are late systems.

## UI / UX Criteria

UI should make systems legible before making them flashy.

Rules:

- View-model first for complex account surfaces.
- Avoid React sprawl before projection logic exists.
- Keep Bloodlines read-only at first.
- Use inactive panels only when they cannot be mistaken for usable actions.
- Buttons should represent real actions.
- Failure feedback should explain actual system causes.
- Soft tutorial should be contextual and tied to real systems, not tutorial walls.
- Dense account meta surfaces should stay scan-friendly and keyboard accessible.

Brand/theme direction:

- grounded premium medieval fantasy
- serious lineage/ancestry/reforging tone
- restrained metal/parchment/crimson/gold visual language
- avoid cartoon, esports, generic tech, or excessive glowing fantasy clutter

## Property, Governance, Kingdoms, And War Criteria

These are major deferred systems.

Dependencies:

- settlements
- economy
- renown
- estate/title/status ownership
- combat
- AI/event systems
- diplomacy/governance models

Rules:

- Do not implement political endgame systems early.
- Property/home/land/ranching/gardening should wait for estate and economy ownership seams.
- Governance, conquest, edicts, city requests, diplomacy, and war are late flagship tracks.
- When implemented, they should emerge from grounded medieval systems rather than abstract map-painting alone.

## Prompt, Tool, And Token Criteria

Every generated development prompt should include, outside the prompt body:

- recommended platform/tool/model
- reason for the recommendation
- manual preflight
- token posture
- whether research is needed
- whether Codex should use Plan Mode, Local, or Cloud

Default routing:

- ChatGPT via GitHub Connector for repo-aware audits, prompt prep, and tiny docs edits.
- Deep Research for external/current/public research.
- Agent Mode for multi-step exploratory investigation.
- Codex 5.5 Plan Mode for non-mutating architecture plans.
- Codex 5.5 Local for real source/content/schema/UI edits and validation.
- Codex 5.5 Cloud only for larger isolated tasks where cloud execution is justified.

Token rule:

- Be token-aware, but do not sacrifice correctness, validation, architecture, or continuity.

## Open Clarification Queue

These topics need user clarification before they become hard implementation rules.

### 1. Continuity Brief Deconstruction Depth

Current understanding: the continuity brief should eventually become shorter and more index-like, while this ledger absorbs durable design criteria.

Clarify:

- Should the brief be actively shortened in a future docs pass, or left as a comprehensive master brief for now?
- Should the new-thread starter live in the brief, the GPT handoff, or a separate `docs/dev/new-thread-starter.md` later?

### 2. `0.5.64` Backstory Legacy Content Location

Current audit found that live `legacy_unlocks.json` insertion is not safe without a visibility/purchase guard.

Clarify preferred default:

- draft-only Backstory Legacy catalog outside live runtime, or
- guarded live catalog records with explicit hidden/purchase-blocked behavior?

### 3. Bloodlines Placement

Current direction favors Bloodlines inside Chronicles/account meta first, with possible future independent surface only after enough behavior exists.

Clarify long-term preference:

- always nested under Chronicles, or
- nested first but eligible to become top-level once family/heir management matures?

### 4. Family Creation Owner

Current systems have family records but no active family creation flow.

Clarify future rule:

- Does every first character create a family record automatically?
- Does family creation begin only after the heir system exists?
- Can a player choose family name at account/first-run creation, or should it emerge from run history?

### 5. Renown Rank Naming

Current concept allows settlement/region/continent/universal tiers and government-specific names.

Clarify:

- Should rank names vary heavily by culture/government, or use a common mechanical ladder with localized flavor labels?
- Should kingdom/realm renown sit between region and continent where world data supports it?

### 6. Chronicle Mark And Lineage Seal Economy

Current concept defines purpose but not conversion rates or spend categories.

Clarify later:

- Should branch closure generate Chronicle Marks, Lineage Seals, or both?
- Should conversion be mostly player choice, automatic milestone payout, or a rare capstone action?

### 7. Magic Inheritance

Current magic rules forbid early direct starter spell bundles and direct magic power Legacy.

Clarify later:

- Should families eventually pass magical aptitude only, spell access permissions, known-spell traditions, or some combination?
- Should any magic inheritance ever apply to a fresh unrelated character, or only family/heir contexts?

### 8. Backstory Purchase Surface

Current design implies account/Legacy panel is likely purchase surface; creator consumes resolver output.

Clarify later:

- Should creator ever offer purchase actions, or only explain missing Legacy support and direct the player back to Legacy/Bloodlines?

## Promotion Rules

Move content out of this ledger when:

- it becomes the next active implementation target -> summarize into `docs/dev/current-gpt-handoff.md` and the Codex prompt
- it needs detailed implementation sequencing -> create or update a focused `docs/design/*` plan
- it is long-term ordering/playability -> update `docs/dev/project-roadmap.md`
- it is simply deferred work -> update `docs/future_content_backlog.md`
- it becomes exact implementation state -> update `docs/dev/current-codex-output.md` during the Codex run

Do not let this ledger become a pile of stale plans. Its value is durable criteria and conceptual memory, not volume.
