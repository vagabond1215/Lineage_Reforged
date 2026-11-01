# Deferred and Outstanding Design: Consumer Timing and Dependency Map

Date: 2026-10-26
Status: `CURRENT_OWNER_ROUTE_PLANNING_OVERLAY; CONNECTOR_ONLY; NO_CODE_OR_MILESTONE_ACTIVATION`
Reviewed source: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; current [Area + Atlas decision](current-area-default-gameplay-and-codex-atlas-separation-2026-10-26.md) and [deferred Area audit](area-first-deferred-design-intent-pull-forward-and-dependency-audit-2026-10-26.md) on isolated draft PR #24.
Canonical baseline: [Deferred-System Authority Reconciliation](deferred-system-authority-reconciliation.md) contains **30 named system families**; [Open Design Questions Index](open-design-questions-index.md) carries separate owner decisions; [Future System Design Ledger](future-system-design-ledger.md) is broad design-intent canon; `docs/dev/project-roadmap.md` and `docs/dev/codex-sequenced-implementation-plan.md` contain older sequencing/historical task lists. This is an **up-to-date overlay**, not a rewrite/erasure of their chronology. Historical 0.6.11/Ashen `ACTIVE_ELSEWHERE` and payout-intent descriptions must be read against accepted Soundings 5g turn-in/Save reality.
Game `0.1.1-prealpha`; `INTEGRATED_LOOP`, not `VERTICAL_SLICE`; parked combat `DEV-0.7.2.13`.
**No exact delivery date or Game-version promotion is inferred.** "Timing" means prerequisite evidence and the first consumer that makes work worth implementing.

## 1. Gate vocabulary and controlling acceptance order

| Gate | When appropriate | What it authorizes | What it does not imply |
| --- | --- | --- | --- |
| **G0: Active independent owner acceptance** | Now, parallel source work | Review/harden draft PR #19 fresh-format save policy, #20 instance gear/caller integration, #21 founder/dev direction, #22 Echo/Dev popup, #23 hardening packet; chosen reviewed implementation branch per owner | No auto-merge of drafts; no branch or Site deployment; no old-save importer |
| **G1: Area-first source projection** | Can preplan **now**, implement when exact-source UI route selected | Read-only Current Area identity/environment/knownness/context/actions/short bounded receipts, Area default routing skeleton, Codex Atlas geographic separation | No extra Home, fake local NPC, map geometry, source-less actions or new mutation owner |
| **G2: Connected playable UI acceptance** | After G0 integration risks reconciled and G1 selected | Ordinary Soundings path, travel/Explore, rest, quest receipt, combat/defeat feedback, item handling and Save/restart visible from actual Area; meaningful selected desktop/mobile checks | No blanket `0.2.0`, generalized crafting/gathering, victory/loot promise |
| **G3: First independent new environmental activity** | After live gear/stack/Save, observed target identity, activity attempt/depletion and bounded output owners | One tested location-specific resource encounter → real collect/extract → one processing/use output; selected UI and Save/restart | No global biome inventory generator, broad production economy or full generic quality system |
| **G4: Bounded second-owner features** | On demonstrated player need once G2/G3 acceptance exists | One actual location-recognition source, one NPC/contract board/provider, one dynamic weather-condition predicate, one simple skill trial or bushcraft/camp utility as **separately chosen** vertical consumer | No uniform unlock of all 30 deferred domains |
| **G5: Dynasty/settlement/system growth** | When actual second-generation/family and provider/ownership/source evidence ready | Ancestry-scoped profession backgrounds, heir lifecycle, estates/containers, services/economy, deeper quest/magic/travel systems | No account-wide skill privilege, inheritance cloning, generic social/entity owners |
| **G6: Deep simulation and exceptional mechanics** | After specific canon, data owner, authored content and reliable gameplay demand | Law/jurisdiction, government/institutions, persistent population/relationships, Grim World modules, agriculture/breeding, advanced magic, death/care, full management operations | No implementation merely because extensive static schemas or historical research exist |

G0/G1 preplanning can proceed in parallel; G1 UI implementation and G2 integration require exact reviewed source/branch decisions. A gate is **evidence**, not automatically a sequential sprint. Current installed `master` Codex prompt is historical (asks for obsolete-save migration) and is **not modified** here; use the accepted PR #19 direction when implementing gear.

## 2. Coverage of all 30 deferred-system authority families

Each row gives **earliest useful timing**, current status translated into today's work, **named first consumer**, and the **stop gate**. The comprehensive focused source/initial-status description remains in `deferred-system-authority-reconciliation.md`. Some records intentionally span two gates because presentation can precede actual mutations.

| # | Deferred family | Earliest | Named consumer / pull-forward | Exact dependency and explicit hold |
| --- | --- | --- | --- | --- |
| 01 | Quest arcs/chains | G4 | Second authored sequential quest | Require actual two-quest branch/order state; Soundings remains independent |
| 02 | Quest/Mission/Order/Favor/Trial semantics | G4–G5 | Organization/rank or player-choice story | Specific assignment/refusal/reward consequences; no universal type system now |
| 03 | Quest turn-in/rewards | **G0/G2 for actual Soundings; G4 for generic** | Existing 5g exact Soundings submission; next distinct reward consumer | Do not treat historical “Ashen payout deferred” as current; generic item/service/favor reward needs separate owner |
| 04 | Offer admission/distribution | **G2 for accepted Soundings; G4 for multi-origin** | Area/Quests presentation and later second issuer/location | Existing one-time offer does not mean recurrent quest generator |
| 05 | Guilds/factions/organizations | G5 | Actual membership/action via observed entity | Specific guild/faction owner; universal organization catalog rejected |
| 06 | Institutions/civic offices | G4–G5 | First authorized clerk/office/contract recipient | Stable identity, provider and local presence; Harbormaster narrative title ≠ NPC record |
| 07 | Government/jurisdiction | G6 | Actual access/law/territorial action | Authored government/jurisdiction and temporal scope; no UI-derived titles |
| 08 | Law/courts/enforcement | G6 | Concrete crime/warrant/justice consumer | Jurisdiction, enforceable rules, official/force identity first |
| 09 | Business/provider/services | G4–G5 | First storefront/inn/crafter/trade service | Service vocabulary ≠ present provider, stock, quoted price or transaction |
| 10 | Travel compatibility destination cleanup | **G1 source precision, G4 mutation** | Current Area title, Ashen anchorage alias, known destination link | Read projection now; canonical replacement refs/Save mutation later. No blanket rename or old-save import |
| 11 | Broader journey/grid/fast travel | G4–G6 | Longer travel requiring route stages/camp/event | Accepted short travel remains; no map overhaul before current loop |
| 12 | Discovery/POI/map reveal | **G1 presentation, G4 state** | Area known/observed/unverified and Atlas visibility | Specific place owner; no generic `world.pois`; no discovery reward from image |
| 13 | District/site/building/interior position | **G1 title precision, G4+ exact position** | Area scene place breadcrumb then first real enterable site | `siteLabel` and compatibility location keys not canonical interior identity |
| 14 | People/NPC identity/persistence | G4 | First authored present individual for a real quest/service | Explicit person identity, presence and interaction owner; historical people seed plan is not live population |
| 15 | Relationships/reputation/standing/favorability | G5 | Repeat interaction with persistent observed character/institution | One specific scoped relationship owner and durable earned evidence |
| 16 | Elemental alignment/temperament/magic stimuli | G6 | Actual effect-bearing environmental/magic consumer | Static lore and current relationships do not authorize mutation |
| 17 | Family/households/kinship/heirs | **G0 policy/G5 actual** | Founder vs descendant professional backstory; playable child/heir | Need source-run ancestry graph and verified earned skill evidence; no fictitious heir |
| 18 | Maturation/rearing Prestige/growth roles | G5–G6 | Actual offspring passage of time and caretaker roles | Depends on real family lifecycle, not prealpha founder character |
| 19 | Inventory containers/stack/instances | **G0 now**, G3 containers where necessary | PR #20 physical owner and UI/Save cutover, later gather/craft outputs | Native IDs/one location, existing fungibles and durability; do not conflate independent storage/container features with gear activation |
| 20 | Player recipes/crafting | G3 | One sourced material→one bounded recipe/output | Actual observed source, owned inputs, tool/skill/time, transactional inventory and Save, not 28 static recipes |
| 21 | Cooking/bulk/family recipes | G4–G5 | A demonstrated food preparation or inherited recipe consumer | Separate portions/quality/access and family rights; not early general crafting |
| 22 | Ecology/agriculture/managed breeding | **G1 descriptions/G3 wild resource/G6 farming** | Area observable ecology, one localized gather; later crop/livestock economy | Ecological probability is not harvestable stock; managed systems need estate/workplace/storage |
| 23 | Magic Study | G5–G6 | One evidence-owned spell/Knowledge learning activity | Authored occurrence/result, trial/Save owner, study source, not static spell catalog |
| 24 | Effectful spell casting/catalysts | G5–G6 | One concrete legal combat/world effect | Acquire known spell first, typed target/cost/effect/catalyst receipts |
| 25 | Magic law/licensing | G6 | Specific jurisdiction with enforced spell restriction | Requires effectful magic and law/jurisdiction owners |
| 26 | Survival/body/recovery | **G1/G2 display; G4+ injury care** | Existing body/rest/travel previews and Normal-Stakes recovery | Preserve current body owner; do not create generic healer, diagnoses or grim simulation |
| 27 | Builder/bushcraft/construction | **G3 plan; G4 selected tiny task** | Optional first low-risk camp/bushcraft utility after resource loop | Owner's exact first builder slice undecided; property/construction deep G6 |
| 28 | UI common record/search/history | **G1/G2** | Area→Atlas known links, local event recency, action routes | Shared view/components, not a common data/mutation owner; no fabricated archive |
| 29 | Player-authored notes | G4–G5 | Deliberate Chronicle/campaign annotation consumer | User writing storage/permissions; authored Codex notes ≠ player's editable notebook |
| 30 | Access/services/favor rewards | G4–G5 | One actual accepted favor/permit/service item consequence | Need source/authorization, owner-validated rights and lifetime/Save |

## 3. Additional October 2026 work not fully captured by the 30-family August map

| Owner/idea | Earliest | Current route and first implementation trigger |
| --- | --- | --- |
| Starting Echo and earned evidence | **G0** | PR #22 working baseline, PR #23 hardening: required new-format origin evidence, real earned-source tranches, no initial/QA Echo |
| Dev top-bar console and QA commands | **G0 UI/G2+ tools** | PR #22 actual default-on popup (not master), two-way overlay checks; real time through simulation owner, items through PR #20; weather through typed env |
| Character equipment/layers/accessories | **G0 native/G2 UI** | PR #20 gear owner plus PR #19 clean save; fit, starter item profiles, authoritative worn/combat resources; later timed loadout and configuration tabs |
| Text-first combat feedback | **G2 when named route** | Parked `DEV-0.7.2.13` requires explicit reopening after source readiness; distinct queued/resolved/damage/defeat-victory facts |
| Default Current Area / Codex Atlas | **G1/G2** | PR #24 source prep and UI branch; current-place heading, remove World submenu, geographically known Atlas, no separate Home |
| Local scene illustration / optional area map | **G1 art brief/G2 one asset** | Canon-grounded concept art with provenance; do not invent geographic coordinates or render map as mechanical geometry |
| Action grammar & activity depth | **G1 presentation/G3 one activity** | Direct/expand/confirm/current shift now; no global minigame for trivial tasks |
| Weather/daypart/season spawn filters | **G1 diagnostics/G4 behavior** | Current clock exists, real weather authority not; typed region/condition/expiry and authored filters before spawn claims |
| Local observed ecological resource | **G1 descriptive/G3 executable** | Layer plausibility → observation → resource instance; real depletion and output before gather |
| Founder-only humble backstories | **G0 policy/G5 creator** | PR #21 owner direction: first non-heir low/no boon; Hunter unlocked for verified descendants by earned ancestry; World-Stray special story gate with bounded boon, no Echo |
| Chronicle recent feedback / Living Manuscript | **G1 small recent/G6 full narrative** | Use retained owner facts only; session feed capped/prose, not append-only permanent history |
| First selected-client barebones acceptance | **G2** | Real fresh character Soundings loop, selected encounter/recovery, travel/equipment/Save restart, narrow-screen and keyboard; no milestone inflation |
| Difficulty/world/stakes configuration | **G2 display only if accepted/G6 rules** | Story/Favored/Mortal/Forsaken separate from Heroic/Grim and Ironbound; no automatic Hardcore/death activation |
| First focused original location/quest/lore art | **G1 briefs/G3/G4 authored additions** | Canon/location/story source first, narrative review and stable identity; no bulk generated names, fake entity presence or loot |

## 4. Outstanding product decisions by just-in-time gate

**Now (design reconciliation, no owner prompt conflict):** location-place precision rules for Area display; canonical known/observed taxonomy; which authenticated current campaign proves acceptance; UI return-to-Area behavior and Atlas cross-links. User already selected Area-as-default and Atlas for broader geography, so **do not reopen those decisions**. Zero-start Echo and default-on Dev are already accepted.

**Before G3:** choose one real canonical, reachable resource and exact output with validated source IDs; one bounded gather/attempt method, depletion/retry, time/resource/body consequences and one legal process/recipe. Decide whether first bushcraft/hand task belongs in same micro-loop only with consumer evidence; do not arbitrarily choose a first camp/builder slice.

**Before G4:** select one *actual* next interaction consumer (observed provider/board; environmental weather scenario; location-recognition observation; skill trial; bushcraft). Do not choose all as a group or call them automatically ready. Skill-source evidence must pass Echo anti-farm first.

**Before G5:** define minimum verified descendant relationship and earned-skill predicate for Village Hunter. World-Stray unlock needs an extraordinary narrative continuity source and a bounded boon, not an ordinary skill threshold. Need actual heir creation and ancestry propagation, not shared account/species markers.

**Before G6:** revisit strategic open questions about Grim World and difficulty axes, first builder scope, NPC persistence, quality/recipe rights, law authority, mortal health and casting mechanics only when their concrete owners are selected. `open-design-questions-index.md` remains source authority for unresolved user calls.

## 5. Pipeline routing overlay and conflict-avoidance rules

1. **Do not edit or replace** `master/docs/dev/current-codex-prompt.md`, `current-gpt-handoff.md`, `current-codex-output.md`, the PR #20/#22 branches or their focused prompts in a connector planning pass. Current master installed prompt is stale old-development-save migration; PR #19's approved clean-fresh-save direction controls future gear cutover when a named reviewer selects it.
2. Put future prompts under **`docs/dev/queued-*.md`** with `QUEUED_NOT_INSTALLED` status. A queued prompt never overrules an in-progress Codex pass; Codex must fetch selected source/owner decisions and exact PR heads first.
3. Update `docs/dev/project-roadmap.md` and `docs/dev/codex-sequenced-implementation-plan.md` together with a **short up-front routing overlay** on this held branch, preserving historical dates, Dev milestone sequences and active prompt contents. Do not silently replace the old full roadmap with a new speculative timeline.
4. Treat independent PR #19–#23 as **review dependencies**, not a merge stack; the Area/Atlas work and documentation PR #24 can be planned in parallel, but no combined current-format Save or selected-client acceptance claim until tested.
5. Every promotion names one gameplay scene/story, one owner, actual authored inputs, reversible data semantics, acceptance test, blocked negative cases and exact source revision. No release/Version number from docs alone.
6. The original `deferred-system-authority-reconciliation.md` contains the historical 30-family rationale; this newer map governs **today's consumer timing** where exact stale historical readiness assertions differ. Do not erase earlier evidence.
7. The lore/content authoring gate is in [Lore-Grounded Naming And Area Narration Plan](lore-grounded-naming-and-area-content-authoring-plan-2026-10-26.md). Names, scene prose, map images and fictional actors are **draft proposals** until validated/approved in their specific content owners.

## 6. Audit closure and refresh triggers

**Coverage achieved:** All 30 named families from the August authority matrix mapped to earliest consumer gate; newer equipment, Echo, Dev, Current Area/Atlas, combat, weather, asset and starter backstory requests layered in. Existing detailed open-question register is retained rather than redundantly deciding its formulas. This is **timing classification closure**, not a claim that every file in the entire historical archive has been read end-to-end or each owner is ready.

Recheck when any of these occurs: (a) PR #19–#24 merge/rebase/source head changes, (b) an authenticated selected-client test finds different behavior, (c) the user explicitly promotes a new target, (d) a real resource/provider/descendant owner is accepted, (e) a new first gameplay loop becomes genuinely executable. On refresh, compare each relevant exact owner, update this map and open question triggers, then modify only the selected queued Codex prompt.

No code, save data, version, Site, enabled Dev commands or narrative canon has been created by this planning document.
