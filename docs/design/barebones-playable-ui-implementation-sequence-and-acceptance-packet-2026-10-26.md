# Barebones Playable UI: Bounded Sequence, Dependencies, and Acceptance Packet

> **Owner UI correction (2026-10-26):** The recommended extra **Home/Current Situation** destination is superseded by a **single Current Area gameplay/default scene**. The current location name is the main header; when no left/domain button is selected, show the Area by default, with an explicit return affordance. The former World submenu (World Map, Region, Settlement, Trade Routes, Travel, Local Market) is removed. Broad known geography/reference maps move to **Codex → Atlas**, while actual nearby observation/actions, current quest/activity/combat, recent activity log and Travel remain on Area. See [Current Area And Atlas Separation](current-area-default-gameplay-and-codex-atlas-separation-2026-10-26.md). All historical Home descriptions below are to be read as **Area**, not a second UI surface. The implementation slices are otherwise proposed, not accepted gameplay.

Date: 2026-10-26
Status: `QUEUED_PREPLANNING; USER_ROUTE_REVIEW_REQUIRED; NO_INSTALLED_CODE_PROMPT`
Companion: [cross-domain intent, source and gap audit](barebones-playable-ui-cross-domain-gap-and-pull-forward-audit-2026-10-26.md).
Source: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`, isolated PR #19–#23 inspected read-only; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`.
No current route replacement, source/schema/content/tests/UI mutation, merged draft, selected-browser result or Site deployment occurs in this package.

## 1. The smallest viable target

**Playable barebones target:** From a new character, without a walkthrough or console, the player can tell where they are, see one meaningful current objective, execute legal context-dependent actions, understand action costs/results, engage with the accepted civic Soundings loop and an authored risk/encounter, rest/recover, use/inspect actual carried gear, and resume both stories after Save/restart. The interface can remain textual with purposeful small portraits/maps/icons. It is **not** an open-world spatial avatar or first-person MMO.

The published `INTEGRATED_LOOP` baseline already proves the complete Soundings lifecycle. The target is therefore **a coherent stitched experience over accepted engines**, not "rebuild everything until some interaction exists". Preserve gameplay data integrity, no phantom action, and genre constraints.

### Initial screen proposal (not a UI implementation)

`Top: [World date + condition + resources] [Dev] [Notifications] [Settings]`
`Left/domain rail: Current Situation · Character · World · Activity · Quests · Chronicle · Codex`
`Main Current Situation: [Current place + known context] [Current objective / active situation] [Primary legal next action + honest preview] [Other appropriate actions] [Latest accepted consequence]`
`Supporting detail: compact portrait/attributes and inventory glimpse, local illustration/known map fragment; narrow-screen stacked layout`.

"Current Situation" can be a Home/World landing tab or a prominent World first subsection. Do not add both duplicate navigation destinations. Use exact current selected session and source-affordance projections; avoid making up observed NPC/resource/POI instances.

## 2. Staged pull-forward queue with concrete entry/exit gates

| Slice | Scope (one bounded PR or implementation run) | Entry dependency | Exit criterion / reject condition |
| --- | --- | --- | --- |
| **S0: Integration and current-client truth** | Independent audit of PR #19 (fresh-save policy), #20 (gear owner), #21 (founder/Dev direction), #22 (Echo + Dev), #23 (hardening preflight), old draft UI PRs and current master. Re-run fresh creator → Soundings and encounter on authenticated selected QA campaign; record failed/hidden routes. | Exact heads, authorized selected client/test origin; no automatic merges | Clean acceptance fixture, one owner-ranked integration map and explicit signed-in/browser limits; no derived source code promoted by implication |
| **S1: Echo and Dev acceptance** | Accept/harden the real starting-Echo baseline; rule out non-earned post-start progression, fix two-way popup exclusion, improve spawn reasons, preview/read-only Dev diagnostics. | PR #22 source and PR #23 prep | Zero origin Echo through Save/restart, genuine gains only, keyboard/mobile Dev useful; no fake grant/time/weather controls |
| **S2: Native gear + creator/Save cutover** | One instance-location owner, authored fit, starter grants, real Character equip/unequip + player resources/combat/UI, current-format persistence; preserve ordinary stack cargo. | PR #20 and PR #19 policy; approved cutover/rollback | Two same item-type copies with different durability survive actual selected inventory actions and Save/restart; no double owner; incompatible dev saves clearly rejected |
| **S3: Current Situation read-only + navigation** | Pure `LocalSceneContext`/affordance projection + one compact top-level re-entry screen, **existing** only: known Travel, Explore/Approach, legal combat commands, Rest, active shift, quest Accept/Track/Soundings Submit, item inspect/use/equip where accepted. Integrate into existing rail and World hierarchy without duplicated commands. | S1/S2 as needed for direct item actions; accepted local-scene and contextual-command boundaries; conscious route decision relative to parked combat | Player can find the next action from launch/after action/restart; no fabricated local targets, disabled features or new simulation; actual commands delegated by identity and input to existing owners |
| **S4: Combat action/result comprehension** | Reopen parked result-disclosure `DEV-0.7.2.13` only when explicit route choice made. Show legal action identity, actor/target, observable HP/damage/status, Stamina/time cost, block/cancel, applied outcome and recovery/victory terminal state. | Stable action-source identity from effective worn projection, current combat-owner tests; historical failure/selected evidence | One actual selected encounter: commands remain independent, authentic observed result and source/target display, full defeat/recovery or victory resolution and Save/restart; no stealth combat rebalance |
| **S5: World-first contextual layout cleanup** | Use the same scene/action descriptors to prioritize meaningful location/exploration/travel cards, objective cues, consequences, region maps and responsive UI. | S3 surface and selected-world path | Browser end-to-end compact desktop and narrow-screen work with keyboard focus, reliable panel state after accepted commands |
| **S6: First **new** replayable resource interaction** | One authored local resource instance, observation → valid gather/method + tool/skill/time/body permission → yield/depletion → carried material → one simple processing recipe/output + persisted consequences. | Native inventory/stack+instance owner, specific resource + attempt/depletion + recipe execution owner; World scene source | One complete accepted gather-to-use cycle on real UI plus negative cases and Save/restart, no general biome item spawning |
| **S7: Beyond barebones** | Ancestry-scoped founder/Hunter/World-Stray work; richer crafting, dynamic climate/encounter gating, NPC services/merchant, family/estate, broader economy and social progression. | Each dedicated owner/canon contract, not merely static catalog | Later vertical-slice gates; no version claim from planning |

**Order is conditional, not serial bureaucracy.** Source-only S3 **prework and prototypes** can proceed before S1/S2 acceptance, but **activation** with item-related actions must wait on correct owners. S4's parked combat step needs a named route change, not an automatic restore merely because it fits a UI plan. S6 can be researched during Codex cooldown, but production execution must wait on instance/depletion/crafting owners. S1 and S2 can stay isolated in parallel, with an explicit integration/fixture gate before any combined save schema.

## 3. Proposed Current Situation source contract (preimplementation)

An ephemeral typed projection such as:

- `sourceCampaignId`, `sourceSessionRevision`, `capturedTick` and known-safe authored fact keys;
- `identity` = character name/backstory (known current), condition flags, resource summary;
- `place` = region, current canonical settlement/site if known, day/watch/season, observable local-scene facts with source and uncertainty;
- `situation` = one of `active_encounter`, `current_activity`, `quest_return_ready`, `tracked_objective`, `neutral`, etc., priority based on **accepted state**, not UI labels;
- `actions[]` = `{commandId, sourceOwner, sourceEntityId, supportedInteraction, available, blockedReason, costPreview, destinationTab}` bound to **existing** actual owner plan/legal list;
- `attention[]` = owner-reported condition warnings, pending submission/activity progress, authentic player-visible consequence and known location;
- `lastOutcome` = latest source-attributable accepted result only, never a fabricated simulated outcome.

Do **not** persist the derived Home descriptors, reimplement action handlers or translate missing local entity identities into made-up interactables. For early UI where direct action invocation would duplicate a command, route to the source panel with selected target/action. The accepted `local-scene-context-projection-decision.md` describes observable sources and limits; the contextual command decision supplies action descriptor ideas but remains design, not ready-made code.

### Representative five-state Home matrix

| Real situation | Primary affordance | Secondary route | Reject illusion |
| --- | --- | --- | --- |
| Fresh campaign, authentic Soundings offer | View/Accept contract from Quests | Explore/Rest if supported | Fake NPC dialog with quest "harbormaster" |
| Tracked Soundings, at Starfall | Inspect destination and Travel | Journal/objective history | Instant teleport or unearned survey credit |
| Active Ashen survey, shift pending | Advance current supported shift | Rest/body condition | Generic auto-skip beyond accepted stage |
| Nearby encounter admitted, legal combat actions | Go to actual combat control / one owner-chosen legal command | Inspect visible state and target | A fake "Attack" outside legal list; hidden enemy values |
| Returned to Starfall, survey complete | Submit Soundings exactly once | Chronicle, Save | Duplicate payment or invented reputation reward |

One neutral situation should truthfully render no primary action if no owner reports one; explain current state and give route-level navigation rather than invent a general exploration command.

## 4. Testing and selected-client acceptance script

### Campaign A: Soundings continuity

1. Create a **fresh** valid current-format Local/Vagabond character; assert zero starting Echo after recomputation if S1 integrated and starter skills still usable.
2. Confirm initial Current Situation correctly projects actual current place, resources, one offered/active objective and allowed commands without magic NPC/merchant.
3. Accept Soundings, travel by actual selected-location command, perform exactly four shifts with correct previews/confirmation and resource/body cost.
4. Return to Starfall, submit for **5 gold once**, verify wallet, quest state, Chronicle and duplicate rejection.
5. Save and full restart/load same campaign head. Current Situation, available actions, Echo baseline, stored gear and accepted progression survive; no persistent UI descriptor required.

### Campaign B: encounter and recovery

1. Select a fresh actual authored context; encounter eligibility can truthfully report no candidate.
2. Explore nearby; when owner returns a candidate, Approach. Render only legal action IDs, target and cost.
3. Execute at least two distinct supported combat actions (basic/equipped, if actually offered), inspect observable result and status. Advance as permitted.
4. Resolve genuine victory or Normal-Stakes defeat/recovery without forceful balance alteration. Return to projected situation; verify continuing play, Save/restart and no orphan active encounter.
5. Record if a natural victory cannot be produced. **Do not falsely claim vertical-slice acceptance** from a controlled defeat or engine fixture alone.

### Campaign C (future): one resource instance to one output

1. At an actually authored habitat/locality, inspect a real observable resource instance ID.
2. Attempt action without required tool, insufficient body condition and stale resource quantity: legitimate failures, **no time/inventory mutation** as policy states.
3. Execute a valid bounded extraction, consume the resource unit/depletion, increase fungible material quantity or create new instance as appropriate.
4. Run one eligible recipe/process; exact input conservation and output; present time/cost/quality truthfully.
5. Save/restart, repeat request and verify no second yield or duplicated crafted object.

### UI and integration checks

- **Desktop + narrow/mobile** topbar, rail, Home, World, Activity, Quests, Character and Dev popup; no hidden/clipped confirm CTA; Tab, Enter, Escape, focus return.
- Genuine activity/campaign states, not solely demo snapshots. All priority actions reflect selected state revision; stale route/target mutation rejected.
- No non-earned Echo from starter/Dev; no phantom gear resource modifiers from bag/presets; no mutable UI action bypass.
- Clear accepted action outcome and rejected reason. Display resource and tick cost from owner previews, not computed from names.
- Correct SaveManager head/readback, session receipt, publication retry and resume; no obsolete-save importer unless product direction reverses.
- Focused Node/unit/UI, Vite, clean-baseline broad TypeScript diagnostic signature comparison and diff checks; report any preexisting warnings separately.
- Separate authenticated selected-client results, controlled browser fixture tests and unverified hosted-preview checks. Do not treat one as equivalent to the others.

## 5. Prep packets safe to complete during Codex allowance pauses

| Packet | Exact offline/connector prep | Where future Codex starts | What it **must not** create |
| --- | --- | --- | --- |
| HOME-P0 | Screen-level UI state/situation matrix and owner-action mapping against `uiViewModel.ts`, `GameSessionContext.tsx`, `InGameShell.tsx` | Pure projection + existing-panel navigation | New mutable action registry or fake NPC |
| WORLD-P0 | Existing travel, nearby explore, accepted encounter and quest-context route/input/readback matrix | World contextual layout decisions | New map grid, teleport, invented creature |
| COMBAT-P0 | Actual result/status/target/action-source fields available from combat engine, deferred `DEV-0.7.2.13` checklist | Only scoped presentation + accepted engine result | Broad balance/AI rewrite |
| GEAR-P0 | Starter fit coverage and actual creator/equip/Save crossover, PR #20 exact head | Complete fresh-format cutover acceptance matrix | Legacy save migration or second item owner |
| ECHO-P0 | Missing baseline and scripted gain negative tests, source classification, PR #22/23 | Earned Echo and default Dev stability | Fake earned-history events or auto save reset |
| ENV-P1 | One place/region/habitat + one resource/recipe candidate **with validated canonical IDs**; identify absence of resource instance and depletion owner | Decide smallest authored resource test scope | Universal biome gather, large crafting/economy engine |
| QA-P1 | Default-on Dev inventory/time/weather/spawn command registry and exact owner readiness, selected browser checks | One owner-backed command at a time | Raw React snapshot mutation, fake weather or Echo awards |
| BLOOD-P2 | Current family tree/offspring/skill evidence and no-creation-Echo tests | Founder and verified descendant unlock route | Account-wide hunter grants or premature heirs |
| NPC-P3 | Existing named-entity content and provider/station contract census | Later first interactable NPC/service owner | Quest label → fabricated person/store |
| CONTENT-P3 | Canonical resource/locations/items/profile validation and representative asset backlog | Future exact authored consumer | 100s of inert records mistaken for playable breadth |

Each packet can be a read-only source map, deterministic fixture proposal, or review checklist without claiming implementation. Avoid another prolonged abstract design series when the next accepted UI/action owner is already identified.

## 6. Routing and decision gates requiring explicit review

1. **Existing held runtime branches are not a merge queue.** PR #19–#23 have different owners, base/source/prompt scope and unsatisfied selected-client/Save gates. Reconcile conflicts explicitly. UI draft PR #5–#16 and `DEV-0.7.2.13` remain held and do not activate merely from being historically relevant.
2. **Prior sequence conflict resolved for preplanning only.** The contextual command architecture scheduled Home after combat selected victory/choice and Game-version decision; current owner requested active *planning* for a functional UI. This allows **HOME-P0 preparation now**, not automatically a new deployed Home or waiver of combat evidence. A later named decision can pull forward a **read-only** Home before final combat acceptance if bounded and risk-free.
3. **Actual Dev time mutation** must simulate accepted six ticks/watch through campaign/body/world/quest/persistence. The PR #22 inspector remains read-only; do not infer all world effects are implemented.
4. **World-Stray/isekai** remains specially unlockable through future narrative continuity with a bounded boon, and never grants origin Echo. Professional Hunter backstory unlocks are genuinely skill-earned for actual descendants, not an account-wide skill-pack.
5. **Vertical-slice/Game version** require explicit separate playability acceptance; do not invent Game `0.2.0` by scheduling a Home view or a resource demo.

## 7. Suggested next routing when execution allowance returns

**Default:** Finish the named PR #22 Echo/Dev hardening route captured by draft PR #23, while separately preparing PR #20's complete gear/Save activation acceptance. **Next pull-forward UI proposal:** independent, non-mutating `Current Situation + LocalSceneContext` source/caller prep, followed by small UI implementation after exact-head/source and user routing acceptance. Later reopen parked combat result disclosure, then integrate World flow. Pursue one actual resource-to-material micro-loop only after item/source/attempt owner readiness.

Do not replace `docs/dev/current-codex-prompt.md` automatically: on inspected master it still names older gear migration work and conflicts with user-waived old-save compatibility; PR #19 contains corrected fresh-format directions. The next Codex should fetch the **specific** branch's controlling prompt and owner decisions instead of blindly executing historical master text.

This document is a **plan to reduce future implementation risk**, not a signoff on current acceptance or a request to change the Game version.
