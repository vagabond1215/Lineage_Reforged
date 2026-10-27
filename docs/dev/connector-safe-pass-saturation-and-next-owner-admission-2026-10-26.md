# Connector-safe pass saturation, developer-command readiness and next owner admission

Date: 2026-10-26
Status: `CONNECTOR_BOUNDED_CLOSURE; FURTHER_SOURCE-ONLY_WORK_NOT_JUSTIFIED_AT_INSPECTED_HEADS`
Source default: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`.
Recent changes considered: PR #19 clean-save policy, #20 gear foundation, #21 founder intent, #22 Echo/Dev, #23 hardening source evidence, #24 Area/Atlas/deferred plan, #25 stacked Codex hardening. Integration evidence is on draft PR #26. All remain review-held; no implemented future feature is inferred from docs.

## 1. Scope of the safe audit program and where it actually stopped

| Proposed pass from previous thread | Work now accomplished at connector level | Outstanding gate, not a new independent safe pass |
| --- | --- | --- |
| **P1 PR integration/conflict preflight** | Exact PR bases/heads, file-overlap matrix for #16/#19–#25, old UI branches' 39-commit divergence, source-level #16 vs #25 layout semantics, gear/Echo prompt preservation | Disposable exact-head checkout and **semantic merge composition**; UI, owner and Save test execution. GitHub mergeability alone is not integrated proof. |
| **P2 Area/Atlas source/action mapping** | Source owners for actual location, Travel preview/execute, Nearby Explore/Approach, combat, Soundings/quest, Activity/Rest, Inventory/Character, Chronicle and existing Atlas; current blank null-tab and default Character found | Pure runtime projection and navigation implementation, selected client and real command acceptance. |
| **P3 Canonical lore/location audit** | Source-backed Starfall/Ashen/Stonevein/Sunspire short dossiers, accepted quest setting and forbidden invented NPC/POI/weather claims; conditional draft Area copy | Editorial approval/actual observer state and asset visual inspection. New people/sites cannot be authored from this source alone. |
| **P4 Resource loop audit** | Verified 1,372 item records, two planned resource identity records, 28 planned workplace-gated recipes and conditional fiber/reed/fish/ore options; ecology plausibility separated from observed source | Owner-approved exact scene/access/observed source + world-resource stock/depletion, item/Save atomicity and selected acceptance. No ready gather target today. |
| **P5 Playable acceptance fixtures** | Starfall Soundings exact four shifts/5g once; return and Save/restart; nearby encounter; zero Echo/Dev; gear dual-item instance; Atlas reference-only; narrow/mobile focus; failure and stale/retry scenarios | Execute on accepted local checkout and authorized authenticated selected campaign; connector source reading does not close QA. |
| **P6 Dev typed command readiness** | Inspected PR #25 Dev Console/Spawn inspector plus full claimed missing owners. Read-only commands and diagnostic data separated from eventual mutations below | Real item/time/weather/spawn commands need corresponding typed owner, QA isolation, receipt and Save. |
| **P7 Artwork/map inventory** | Verified two world-scale rasters; **also** 69 creator settlement, 13 region, 18 continent, eight category images, six season emblems; map pixel geometry vs synthetic WorldPanel positions separated | Visual review, canon/source permissions, one accepted optional Area illustration and local-geometry authority if ever needed. |
| **P8 Founder/heir/World-Stray audit** | Compared #21 user policy to runtime 27 backstories, actual default IDs, Hunter gates and #25 earned Echo ledger; identified exact missing ancestry/archive authority below | New descendant creator/ancestry graph, earned-play archive, source-run availability and selected test; special World-Stray narrative gate remains owner decision. |

**End condition:** Every previously nominated bounded connector-safe pass has a source-backed disposition and first consumer. The newest active implementation, #25, has been independently inspected at patch and source levels. Remaining concrete work requires runtime execution, selected-client acceptance, live content/editor approval, or changing application authority. Re-reading the same files or drafting more speculative named systems would not advance acceptance.

## 2. Dev console command readiness, by actual owner

`apps/rpg-ui/src/game-shell/components/DevConsole.tsx` on `codex/echo-dev-hardening` renders five openable groups, not five action owners:

| Group / command candidate | Source status at #25 | Safe next preimplementation decision | Implementation admission |
| --- | --- | --- | --- |
| Items: catalog find + grant | Group explains **unavailable**; native gear owner exists only isolated in #20, no caller/Save integration. | Exact item type, quantity/instance, durability, location and QA provenance; classify starter nonfungibles and commodity stacks. | One typed grant through native item authority, unique request/revision and receipt, campaign QA namespace and Save/restart; no direct `playerState.equipment` change. |
| Time: read clock | **Read-only available** in Dev; shows year/season/month/day/watch/tick. | Verify displayed values/clock owner against selected campaign, no mutation. | None for read. |
| Time: Advance 1 Watch/N | **Unavailable**; existing Rest, Activity and Travel advance different body/time/world effects. | Decide exact six-tick watch simulation rules, activity/quest/world effects, QA isolation, request idempotency, stale-source and publication. | Whole campaign owner + selected Save/restart; no React clock increment. `Set date` is a separate warp/rebase decision and not an alias. |
| Weather: current condition | **Unavailable**; climate/season are informational, `weatherState` remains untyped as current-condition authority. | Typed regional condition ID, intensity, source, expiry/clear, observation and priority. | Explicit weather/QA scenario owner with Save and explained effects; no painted weather effect. |
| Spawn: inspect eligibility | **Read-only implemented** by `inspectSpawnEligibility`; per-profile failure, rates, template/monster constraints and deterministic seed-zero example. | Check parity with actual `selectionKey`, real encounter context and known unsupported filters. | Selected real-caller and observer/UI QA; inspection itself stays non-mutating. |
| Spawn: force/seed actual encounter | **Unavailable**; no Dev mutation bound to ordinary encounter admission. | Typed scenario context, candidate, target and legal admission; rollback/QA namespace. | Owner-accepted encounter command with no forged combatant and exact retry/Save contract. |
| Diagnostics | **Read-only implemented:** snapshot version, control session revision, captured tick, current Echo and origin-baseline presence. | Add only already-authored stable identifiers/results to assist QA; redact sensitive account/user data if exposed publicly. | No new gameplay authority for read-only projections. |

Default-on Dev is accepted **development UI policy**, not permission for unmanaged state mutation. Authoritative typed writes require a durable QA-modified boundary that keeps debug-created results and the ensuing test activity out of true Echo, descendant unlocks, achievements and real progression acceptance. A button that claims time/item/weather changed without an accepted owner/result is a regression.

## 3. Founder, Hunter, and World-Stray: exact source-vs-policy delta

- `packages/content/base/player/backstories.json` has **27** authored backstories. Runtime basic Local has 4 rank-25 skills, Vagabond 4 rank-25 plus one rank-20, Exile 4 rank-25; Farmhand/Amnesiac also have significant current starter ranks. #21's low/no-boon founder design is **not** implemented by PR #25's zero Echo alone: proficiency and boons remain separately available unless creator policy/content change.
- `backstory-eligibility-policy.ts` lists default `local`, `vagabond`, `exile`, `farmhand`, `amnesiac`, with another always-available gutter-rat/street-raised route. The active Village Hunter rule currently requires source-run `hunting_history`, **earned** `skill.resource.hunting` maximum **25**, and `legacy.backstory.village_hunter` purchase. #21 intends verified descendant-only **earned** access without that account-wide purchase requirement.
- Village Hunter's existing **starting capability** is five rank-25 skills: archery, hunting, butchering, trapping and fauna lore. These are starter familiarity and should never be counted as earned growth for future descendants or as Echo.
- PR #25's `earnedGrowth` records source-authorized post-creation increases for Echo. It is **not by itself** a source-character-to-descendant ancestry proof, archived family skill maximum, legitimacy record or World-Stray story event. Any descendant unlock needs actual persistent evidence tied to the earning character/source run, an accepted ancestry chain and creator admission that excludes unrelated founders and QA edits.
- World-Stray `backstory.isekai_outcast` has current starter skills but the accepted future **special** narrative unlock trigger and bounded boon are deliberately unresolved. Do not substitute a generic hunting/Legacy purchase rule to make it selectable.

**Named next decision:** pick one minimum descendant relationship and archive/evidence contract after actual heir ownership exists. An ancestry-scoped unlock can be planned now but must not create phantom children, fake Hunter achievements, account-wide unlocks or repeatable inherited Echo.

## 4. Admission/stop matrix for near-term source owners

| Consumer | Ready at connector level | Implementation stop condition |
| --- | --- | --- |
| G0 Echo/Dev acceptance | #22→#25 exact source/patch reviewed; tests/results attributed | No selected-client, branch composition, true new-format Save and popup screen proof; cannot mark accepted. |
| G0 native equipment | #19 fresh-format owner direction + #20 graph and six fit profiles + starter catalog item census | Incomplete starter classification/fit, legacy dual-owner, actual combat/resource/Survey/Save coupling unresolved. |
| G1 Current Area | #24 controlling design + PR #26 source action matrix, lore/asset inventory, current null-tab defect | UI implementation has not been run. No owner-written action descriptor is a persistent reward or discovered location. |
| G2 accepted UI loop | Soundings, Travel, Nearby, Combat and selected Save/restart fixtures prepared | No current integrated authenticated desktop/narrow full loop. Old UI PR fixture evidence is branch-local. |
| G3 new resource item loop | Conditional `fiber` / `river_reed` candidates with real item IDs | No observed material source/node and access/method/depletion owner. All 28 static recipes require workplaces. |
| G4 provider/NPC/weather/bushcraft | G4 candidate order and role taxonomy from #24 | No chosen observed provider/typed weather/scoped builder owner; do not activate a menu of fictional interactions. |
| G5 descendants/heritage | Existing policy/resolver vocabulary and #21 policy difference documented | No verified playable descendant chain/source archive; World-Stray special event undecided. |
| G6 deeper simulation | 30-family deferred consumer timing already reconciled in PR #24 | No requested/accepted first source consumer. Do not create global law, advanced economy or full magic by documentation momentum. |

## 5. What should happen after this connector plateau

**First:** one named integration/test consumer reviews #19/#20 fresh-format cutover and #22→#25 Echo/Dev stack against current master. Re-author only truly missing compact topbar/layout improvements from the old 39-behind UI branches. Keep old PRs for evidence, do not wholesale merge.

**Second:** once source ownership is stable, implement the minimal **default Current Area** projection on a fresh independent branch. One actual place heading and source-known legal actions first, then visual/optional approved illustration, then selected Soundings/encounter/restart acceptance. Atlas reference stays separate.

**Third:** choose one genuinely observed and reachable source for a new resource→item loop, and implement atomic attempt/depletion/Save with real result evidence. Only then evaluate one workstation recipe or second local activity.

Do not install/overwrite `master/docs/dev/current-codex-prompt.md`, auto-open a runnable Codex pass, rebase/merge another draft, delete/refactor unrelated branches, modify Site, touch user saves or promote Game `0.1.1-prealpha` from this connector pass. Exact branch heads and stored content must be rechecked whenever implementation resumes.

## 6. Explicit safe-pass closure (not an absolute claim about future discoveries)

At the inspected heads, no additional **distinct, bounded, high-value connector-only investigation** remains among the original eight passes. The remaining activities either repeat accepted evidence or need test execution, selected account/browser access, explicit narrative/editorial approval or a new gameplay owner selection. New Codex PRs, master updates, accepted content/asset decisions or selected QA discrepancies are explicit **refresh triggers** and may justify new connector work later. This is a truthful stopping point for the current pass, not a claim that every historical file in the repository was read or that the game is accepted.
