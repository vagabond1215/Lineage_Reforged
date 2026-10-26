# Barebones Playable UI: Cross-Domain Gap And Pull-Forward Audit

Date: 2026-10-26
Status: `CONNECTOR_PREPLANNING_ONLY; CURRENT_SOURCE_CENSUS; NO_FEATURE_ACTIVATION`
Baseline: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`, plus read-only review of isolated PR #19 (fresh saves), #20 (gear-instance foundation), #21 (founder/Dev intent), #22 (Echo and Dev read-only UI), and #23 (Echo/Dev acceptance preflight).
Game `0.1.1-prealpha`; accepted posture `INTEGRATED_LOOP`; `VERTICAL_SLICE` / `0.2.0-prealpha` **not** accepted; parked `DEV-0.7.2.13` remains held. No test, build, signed-in browser, merge, data reset or deployment was performed by this connector research.
Companion [sequence and acceptance packet](barebones-playable-ui-implementation-sequence-and-acceptance-packet-2026-10-26.md).

## 1. Scope and audit method

This pass reviews the repository's durable **cross-domain entrypoints** and the high-value focused decisions they reference rather than mechanically reading every chronological `0.5.x` planning artifact as independent current authority. The archive spans years of incremental plan, schema, validator, content and runtime decisions; many early decisions are later superseded. Inferences here are based on current direct source and the latest accepted specialized constraints, not merely prose in the historical roadmap. No runtime change is authorized by a roadmap row.

**Primary maps audited:** `AGENTS.md`; `docs/dev/project-vision-and-continuity-brief.md`; `docs/dev/playability-posture-and-version-calibration.md`; `docs/dev/project-roadmap.md`; `docs/dev/historical-version-and-deferred-route-register.md`; `docs/design/future-system-design-ledger.md`; `docs/design/open-design-questions-index.md`; `docs/design/deferred-system-authority-reconciliation.md`; `docs/design/current-planning-anchor-reconciliation.md`; `docs/design/ui-information-architecture-boundary.md`; `docs/design/contextual-player-action-and-command-architecture-decision.md`; `docs/design/contextual-player-affordance-and-owner-matrices.md`; `docs/design/local-scene-context-projection-decision.md`; `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`; `docs/design/post-dev-0.7.1-playability-and-game-version-eligibility-decision.md`; `docs/design/combat-skeleton-first-priority-and-acceptance-boundary-decision.md`; `docs/design/activity-resolution-existing-system-reuse-audit.md`; founder/backstory, equipment, crafting, NPC, settlement, resource and weather focused plans. Exact runtime spot checks include `InGameShell.tsx`, `WorldPanel.tsx`, `ActivityPanel.tsx` and recent branch implementations.

**Explicit coverage limit:** This is a representative **authoritative source map**, not an assertion that every historical document was line-by-line reviewed, nor an independently re-run selected-client playtest. Before Codex implementation, re-audit precise file versions, scope and branch head.

## 2. What is already genuinely playable

The independent `0.6.11.1` Soundings acceptance and `playability-posture-and-version-calibration.md` support a narrow ordinary loop:

`Creator → persisted campaign → Soundings offer/accept → known-location travel → four survey shifts with resource/body progression → Starfall return → one-time 5g submission + Chronicle/receipt → Save/restart`.

The accepted `DEV-0.7.1` epoch strengthens campaign identity/publication and includes one selected nearby Stonevein encounter path with real action choice and Normal-Stakes defeat/recovery. The 2026-10-20 selected-source and combat skeleton decisions caution that this **does not** prove natural victory, tactical result comprehension or a general encounter economy. Other locations must supply authentic authoring; Stonevein is not universal. Body/rest/consumable UI paths, starter items, inventory/equipment and contextual quest paths exist but not all are modern engine-owned commands.

**Source code map:** `apps/rpg-ui/src/game-shell/InGameShell.tsx` selects Character, Inventory, World, Activity, Codex, Quests and Chronicle panels (Inventory uses Character view). It **starts in Character** and has **no separate Current Situation/Home panel**. `WorldPanel.tsx` exposes known-location Travel, nearby Explore, Approach and combat commands; `ActivityPanel.tsx` handles Rest/Advance Shift and Soundings; `QuestsPanel.tsx` handles quest lifecycle; `CharacterPanel.tsx` retains current gear/consume paths. `GameSessionContext.tsx` routes admitted world/quest commands and bridges older UI mutations. This is a usable core hidden behind non-contextual navigation, not an empty game.

The 2026-10-19 contextual owner matrix specifically lists the existing production commands eligible for a future Home projection. **Do not falsely imply** resource gathering, generic Trade, generic Craft, employment, NPC talk, dynamic quest generation, full magic or weather is live just because related static catalogs exist.

## 3. Ranked current capability matrix

**Priority** is a **proposed pull-forward ranking for coherent UI play**, not acceptance to implement. Labels: `LIVE` = production path exists, `ISOLATED` = separate PR implementation only, `PRESENTATION` = accepted intent/read-only projection, `HELD` = missing owner/authoring; none imply selected-client acceptance today.

| Priority | System or product gap | What exists / named source | Remaining playability requirement | Next bounded posture |
| --- | --- | --- | --- | --- |
| P0 | **Access and end-to-end acceptance** | Real Slot/Save, creator, Soundings and previously proven selected loop | Repeat **fresh** selected-campaign desktop/narrow test at latest integrated source; no inherited UI fixture optimism | Acceptance script and fresh test profile, not new engine |
| P0 | **Echo anti-farm + founder progression** | PR #22 origin-baseline calculator + actual SaveManager fixture; PR #21 humble founder/descendant direction; PR #23 risk preflight | Mandatory valid new-format baseline and non-earned vs earned evidence; future descendant unlock cannot inherit latent Echo | Finish PR #22-based hardening independently, then creator/Bloodlines route |
| P0 | **Gear owner and current-format Save** | PR #20 stable-item-instance pure owner, authored fit subset; PR #19 waived obsolete-save conversion | Real creator grants, wearer/bag/overflow actions, resource/combat, UI and Save/readback on **one** authority, broader fit profiles | Dedicated PR #20 activation, unmerged until actual caller evidence |
| P0 | **Playable combat feedback** | One selected encounter/action/defeat path, combat skeleton source; parked `DEV-0.7.2.13` | Show observable damage/HP/status/target/action outcome/progression; terminal victory/choice/restart later verified; avoid fake balancing | Reopen parked result-disclosure only by owner route decision after current branch integration risk settles |
| P1 | **Home / Current Situation** | `ui-information-architecture-boundary.md` §6, `local-scene-context-projection-decision.md`, `contextual-player-action-and-command-architecture-decision.md`, accepted command matrix | No Home panel; no compact re-entry summary/current-action shortlist; real UI starts Character | Pure read-only scene + route actions first, after named acceptance gate, no new gameplay owner |
| P1 | **World contextual interaction hierarchy** | Travel, Explore, Approach, combat and region UI in `WorldPanel.tsx` | Present actual local scene, one primary action, others grouped, explicit blocked reasons, travel/encounter result clarity and restart provenance | Incremental World panel composition consuming same owner descriptors; no new map/grid |
| P1 | **Quest/Activity lifecycle clarity** | One real paid Soundings closure, activity shift, rest and journal | Objective-to-world route and next-shift/return/submit cues remain dispersed | Home/World/Quest contextual routing; preserve exact one-time receipts |
| P1 | **Default-on development console** | PR #22 real default-visible Dev menu and deterministic **profile** inspector, not deployed; PR #23 hardening packet | Popup mutual exclusion, selected mobile access, correct template-level reasons; time/item/weather still read-only | Merge-gated selected UI checks, then owner-backed QA command slices |
| P1 | **Usable resource/time/body feedback** | Top bar + body state, fatigue/hydration/energy, Rest, resource preview and calendar | Link action outcomes to resource changes and temporal advancement, especially travel/shift/combat/recovery | Shared readable "what changed / cost / why" feedback; no parallel body mechanics |
| P2 | **One new environmental micro-loop** | 121 skills, 22 extraction methods, 28 recipes and static ecology/production foundations in 2026-10-19 census; no generic observed resource instances/depletion | One observed resource at a real authored spot, legal Gather, one material, one simple Craft/Use, persistent output and consequences | **Pull forward a small resource-instance + attempt + simple output contract** after gear owner; no full economy |
| P2 | **Spawn/time/season/weather predicates** | Region/habitat/hazard owner; PR #22 read-only inspector; `weatherState` empty/untyped | No typed regional weather runtime or authored daypart/season/weather filters | Pure inspect first; single authored conditional scenario only after world/env authority |
| P2 | **Backstory selection and descendant progression** | Tiered/eligibility planning + PR #21 owner direction; 27 existing backstories still have large founder skill grants; family evidence not passed into creator | Low/no-boon founders, earned-skill-source qualification, verified ancestor→descendant entitlement; World-Stray special story unlock | Separate character-creator/Bloodlines work, don't block current World UI on full heirs |
| P2 | **Item inspect/access/stack clarity** | Existing Character/Inventory + PR #20 owner; contextual item action design | Location and access rules, differentiated gear, genuine item properties, and action reasons without phantom presets | Integrate gear then refine inspection, selection and capacity feedback; item spawner QA later |
| P3 | **Merchant/NPC service interaction** | Provider-independent services, 58 workplaces, 208 role rows, settlement and person schemas, NPC/people seed planning | No reliable person/shop provider identity, stock, price/transaction owner or dialogue | **Do not** build generic Trade/Talk yet; maybe truthful static location/contract-board *browse* from existing data |
| P3 | **Heir/Bloodlines, prestige and estate gameplay** | Chronicle/Bloodlines read-only account projections and owner plans | Actual child/heir relationship, source-based family skill unlock and live inheritance/estate transfer | Prepare canonical descent and provenance, do not force full dynasty simulation into current playable UI |
| P3 | **Magic, crafting specialization, buildings, farming, economy, law, religion, maritime systems** | Extensive static catalogs/schemas/authoring and distinct owners; runtime partial or absent | Multiple independent source/permission/persistence contracts | Retain deferred; pull forward only a **specific** demonstrated consumer prerequisite, not general coverage |

**Version caution:** `playability-posture-and-version-calibration.md` still identifies `VERTICAL_SLICE` as unmet, even though the technical roadmap contains hundreds of completed schemas and tests. Never treat broad static content count or draft branch code as player-playable feature acceptance.

## 4. UI information architecture to activate earliest

The intended genre is **text-first, strategic TTRPG/dynasty gameplay with scene imagery and contextual controls**, not a first-person or free-roam action MMO. Preserve the six-ish domain rail and persistent top resource/condition/time header, responsive dock, compact Character, and associated documents; avoid a giant modern HUD or a full CSS rewrite.

**Proposed Current Situation first-screen composition:**

1. **Identity and continuity:** portrait/name/origin, current selected account/campaign, one sentence role/condition summary; optional minimal Chronicle/event ribbon if facts exist.
2. **Place and time:** canonical current settlement/region, known location detail, clock/watch/season; unknown exact interior/position stays unknown.
3. **In-progress situation:** active encounter (takes first priority), active Soundings shift, pending quest turn-in, travel prospect, or neutral rest/explore.
4. **Primary contextual action:** one legal owner-reported next step, plus 2–3 secondary choices. A hidden or unsupported action is not a disabled fake button. Route to current World/Activity/Quests/Character when actual command cannot be safely invoked from Home.
5. **Cost/result disclosure:** projected tick/watch cost, stamina/body changes, reasons blocked and last **authoritative** event; no hidden enemy HP/stat inferred from presentation.
6. **Attention/re-entry:** current objective and destination, resource warning, accepted-quest continuity and current activity. A saved game returns to a re-derived situation, not a persisted UI widget state.

Implement as **read-only owner-backed projection + navigation** first; avoid duplicating exact World/Quest/Combat action mutations and IDs. On no encounter/quest, use a truthful simple Explore, Rest or inspect-place affordance based on actual eligibility, not "nothing to do" or imaginary local vendors. Contextual descriptors are ephemeral and are recomputed after accepted actions/restart.

The dynamic top header/sidebar may show themed visuals, but depth is in responsive cards, readable text and small purposeful controls. Character-only refinements that cannot be seen from ordinary selected gameplay should not displace a user-visible Home/World path.

## 5. Smallest replayable examples for a future demo

### Existing loop A: civic exploration / Soundings

Start ordinary Local/Vagabond with near-zero origin Echo (once feature integrated) → observe available Soundings offer in Home/Quests → accept → current-world travel to Ashen Reef → complete four shifts with clear costs/condition changes → return to Starfall → submit for exactly 5g **once** → Chronicle/event result → Save → reload/restart at same head. This must remain playable even if the character never enters combat.

### Existing loop B: a contextual risk and recovery

From an actually authored nearby encounter context (Stonevein remains *example*, not universal): local Observe/Explore → no spawn or a real candidate → Approach → see each legal action with target and distinct cost → advance/attack → show honest result and damage/conditions → complete legitimate victory or Normal-Stakes defeat/recovery → return to Current Situation → persist/restart. **Do not** promise a natural victory, loot or defeat reward that no owner yet authorizes. Never force a universal enemy at every spawn.

### Future loop C: a tiny physical resource-to-item story

At **one** actually authored, discoverable locality with an actual resource instance: observe eligible deadwood/forage material → select an authored gather method → time/body/tool/skill/ownership check → accept a bounded quantity and local depletion/change → store in owner's fungible stack/new instance where appropriate → perform one physically plausible hand task (e.g. process gathered fiber/wood) using one authored recipe and coherent consume/output receipt → save/restart. Source identity/depletion is mandatory; don't create materials from biome name or generic recipe index. This is a candidate **future selected vertical-loop package**, not executable present-tense gameplay.

## 6. What **not** to pull forward now

- No compatibility/import of discarded pre-cutover development saves. New-format state, publication, provenance and recoverable partial writes still required.
- No full commercial/NPC/organization/court/relationship or economy simulation just to make Home look populated. Static lore may inform labels but never fabricate an available clerk/store/contract from a name alone.
- No encyclopedia-first Codex feature glut, broad generic skill trial, class system or World-Stray boon design before a real player encounter consumes it.
- No map/hex coordinate rewrite, weather UI that falsely alters runtime, arbitrary development time warp or raw snapshot mutation.
- No automatic reactivation/merging of held UI PRs #5–#16 or combat `DEV-0.7.2.13`; re-review each exact head and reopen by an explicit selected route.
- No Game-version increment from docs, test counts or Dev inspector widgets.
- Do not spend connector time repeatedly re-proving old-save gear ambiguity or rewriting historical design records solely for extra commits.

## 7. Next source checks before scheduling

For each candidate pull-forward package, demand actual current files and callers, accepted source owner, a target user story and "ordinary controls" fixture, last-read source SHA, red-before-green tests, Save/restart persistence, current body/resource/quest continuity, no new broad TS diagnostics and selected-client evidence. The next Codex may be capacity-limited; prefer **one small accepted action/projection** and a useful handoff over dozens of inactive probes.

**This audit's sole effect is documentation preplanning.** Existing install prompt, branches, version, data and hosted Site remain unchanged.
