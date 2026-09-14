# Game 0.1.x Playability Gap Prioritization Decision

Date: 2026-09-14 (ordinary UI and executable reproduction: 2026-09-11)

Status: `PLAYABILITY_PRIORITY_SELECTED`

Label class: unversioned; parent: not applicable; development milestone impact: `none`; game-version impact: `none`.

Source: clean synchronized `master` at `4521cf183f9ca6fd431b9c37899d796fa5883794`. Accepted milestone: `DEV-0.7.0`; current band: `DEV-0.7.x`; Game `0.1.0-prealpha`; playability: `INTEGRATED_LOOP`.

## Decision

Prioritize closing Soundings of Ashen Reef through a reachable Starfall return, authoritative submission, and the authorized payment. The exact next run is **Soundings Return, Submission, And Payment Authored-Terms Decision**, unversioned. This selects a prerequisite, not an implementation package or reward balance. Exact paid-contract terms remain unapproved. Do not allocate DEV-0.7.1 or change GAME_VERSION.

The four-shift field-work loop is playable and retained. Its first consequential closure gap is return/submission: the UI tells the player to return to Starfall, but travel rejects that known destination, and no accepted turn-in/consequence owner exists. Fixing presentation alone cannot supply completion or payment. Inventory instances, NPC promotion, and broad economic simulation need not precede this capability unless the authored terms explicitly require them.

## Ordinary Player-Path Reproduction

Used the unchanged local Vite application at `http://127.0.0.1:5173/`, ordinary browser controls, and a new disposable local account `Playability Audit 20260911`, Slot 1 character `Mara Audit`. No existing saves were cleared, no eligibility was injected, and no demo campaign was used. Production files remained read-only. The evidence below distinguishes UI observations from the repository integration test.

| Step | Observed player experience | Choice, gain, retention, or next action |
| --- | --- | --- |
| Creator | Human identity; Myridian Chain → Starfall Isle → Starfall Port; available Workshop-Raised backstory; Traveler bundle; final review | Identity and start choices are meaningful. Bundle previews equipment and 16g 8s. Locked backstories explain missing earlier-play records. |
| Begin Journey | “Campaign Started”; written to Slot 1 and entered world | Ordinary retained publication/load reached Character. Initial wallet 16g 8s, equipment 3, inventory 2, discoveries/standing/reputation 0. |
| Quests → Contracts | One Soundings offer; Starfall civic premise and four objectives; “exact turn-in terms remain deferred” | Accept Contract moves it to active/tracked and directs travel to Ashen Reef. No payment is promised numerically. |
| World | Starfall and newly learned Ashen Reef visible; Ashen travel presents condition cost/risk | Confirm Travel arrives at Ashen Reef; survey operation and current activity activate. No geographic-knowledge grant was inferred from map visibility. |
| Activity, shifts 1–2 | Preview shows stage, explicit stamina/MP costs, skill and operation progress; risk requires confirmation | Two accepted shifts display 2/3 sectors and two shifts remaining. UI also displays “DAILY REVENUE 842” despite no employment/business records; this is not earned income evidence. |
| Save/restart after shift 2 | Save reports all changes saved; browser reload requires ordinary account sign-in; Continue resumes Slot 1 | Survey Anchorage, 8 ticks, wallet 16g 8s, two surveyed sectors and next sector 3 persist. No storage manipulation. |
| Shifts 3–4 | Third sector followed by ruin confirmation; final “Survey Packet Ready” | Current activity becomes Returning Chart Packet; operation Ready now; Advance Shift disabled because packet complete. |
| Final Quests | Active 1, tracked 1, completed 0; all four field objectives complete; Turn In Quest disabled | Guidance says return to Starfall Harbormaster's Office. We did not execute legacy turn-in. |
| Final World | Known Starfall selected while at Ashen; “Unknown destination” coexists with enabled Travel To Location | Clicking returns “Travel Target Unknown” and “That destination does not yet have travel rules wired into the current vertical slice.” Location remains Ashen. This wording is a UI message, not vertical-slice acceptance. |

The UI reproduction stopped at active/unturned-in. Browser restart was exercised halfway, not after the final shift. Final restart and empty-cache duplicate are covered by the fresh executable integration below, not claimed as browser observations. Accessibility-tree interaction proved named controls can drive this path; it is not a complete keyboard, screen-reader, reflow, contrast, or accessibility acceptance test. Character and domain pages expose Runtime Bridge/Window Standards/source-reference diagnostics; the map explicitly labels itself a placeholder. These are real presentation debt but did not block the accepted survey path.

Fresh `node --test tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs`: **1/1 passed**, no skip. It independently uses ordinary creator inputs, retained publication/load, production acceptance/access/travel and real survey caller, halfway and final restart, and a durable duplicate with an empty cache. It verifies four requests/occurrences/results and 48 receipts, ordered four shifts, content v2, all nine survey non-proposals, no pending correction/repair, preserved active/tracked quest, unchanged inventory/currency/standing, and incidental Stormglass discovery. These internal facts are executable evidence, not inferred from UI labels. Skill gains during field work are distinct from any future turn-in reward.

## Candidate Comparison

Relative ranking is a scope decision, not a numerical score or delivery estimate. Sizes describe likely implementation concerns after prerequisite decisions.

| Rank / candidate | Player payoff and loop/dependency closure | Missing decisions and architectural risk | Package and regression burden |
| --- | --- | --- | --- |
| 1. Narrow Soundings return/submission/payment | Finishes the exact work the player can already perform; gives durable completion and the paid civic outcome | Authored amount/consequences, packet representation, return travel/context and submission timing; then typed turn-in occurrence/results/receipts and accepted-only application | Bounded medium candidate if evidence-only packet and narrow consequences are approved; material retry/restart/conflict/payment risk, contained to one contract |
| 2. Targeted UI/accessibility | Clearer next actions, truthful blockers and calmer owner projections; observed diagnostics, placeholder revenue and inconsistent travel affordance justify follow-up | Select a proven presentation slice; keyboard/focus/reflow evidence still needed. Home/search/navigation redesign requires separate UI-state ownership | Small for exact affordance fixes; medium/large for shell redesign. Does not create missing return/completion/payment authority |
| 3. Inventory/equipment | Reliable same-item copies, gear changes and eventual unique rewards/heirlooms | Current inventory stacks are itemId/itemKey/quantity; equipment has richer metadata, with item-ID-keyed temporary stash. Instance/provenance and selected consumer must be decided | Medium/large; high save, equip/unequip, stash, serialization and estate regression burden. Unnecessary for evidence-only submission unless authored terms demand items |
| 4. Combat/challenges | Adds substantial tactical choice and challenge using existing engine capability | Live combat, spawn integration and weighted AI exist; ordinary encounter entry, visible command/outcome loop and durable consequence boundary need selection | Medium/large; admission, controls, time, defeat/recovery, restart and rewards. A screen alone does not close the encounter lifecycle |
| 5. One crafting/trade transaction | Gives possessions and payment practical uses | 28 recipes and civilization craft/value/price/trade calculations exist; player input/station/tool eligibility and atomic consumption/output/wallet/stock ownership remain needed | Medium/large; duplicate consumption/output, restart and transaction rejection. Unique/quality output can add inventory dependency |
| 6. Progression/lineage | Strong long-term project identity; creation and survey gains already work | Account family/estate/Legacy owners exist; no single next dynasty interaction selected. Do not treat legacy class fields as permission for hard class gates | Broad proposal spans account/run/campaign persistence; first select one interaction with demonstrable player payoff |
| 7. NPC/services | Remembered people and recurring social/service continuity | Person/NPC schemas exist; live people/npcs collections absent and authored seeding paused. Generated-person persistence/promotion and service owner unresolved | Large for persistent people; a role-based office submission need not create a named person or generic NPC framework |
| 8. Content breadth | More destinations, stories and variety | Requires a proven runtime consumer. Existing 1,372 item identities, 28 recipes and 33 monsters already exceed this ordinary loop's consumption | Static small/medium possible; more records alone do not deliver transactions, quest completion, services or encounter closure |

Independent bounded source inspection was reconciled at the same source head. Evidence: `quest-turn-in-and-reward-readiness-audit.md`, `inventory-stack-and-item-instance-identity-audit.md`, `npc-persistence-and-generated-person-promotion-audit.md`, `ui-information-architecture-boundary.md`, accepted Soundings canon, and the September 7 preserved recipe/production, world-spawn, combat-view-model and accessibility audits. Archived proposals are evidence only. Current recipe and monster counts and existing economy/combat owners supersede older absence/count claims.

Reopen this ranking if a demonstrated UI/accessibility defect prevents the accepted ordinary path, or approved Soundings terms require a larger inventory/NPC/economy owner package. Otherwise revisit inventory at a same-item/unique-item consumer, combat at a selected ordinary encounter, crafting at one player transaction, lineage at one account/campaign interaction, NPCs at a persistent-person consumer, and content breadth after an accepted runtime consumer exists. No deferred candidate is implementation-authorized by this comparison.

## Selected Boundary And Prerequisites

The authored-terms decision must obtain explicit product answers for:

1. Exact monetary payment and explicitly included/excluded standing, public reputation, skill, item, service/access or salvage consequences. Paid intent is accepted; legacy numbers are not.
2. Whether the chart packet remains retained survey evidence or is a physical inventory object. Evidence-only is the smaller proposed boundary, not accepted canon.
3. Return to the already canonical Starfall office: reachable settlement/site context and travel terms, including time/cost/access policy. Do not invent a permanent office/person ID. Duty Harbormaster remains a role label.
4. Whether accepted submission immediately completes/pays or requires a further administrative step. Preserve one-time-per-campaign intent; do not add recurrence.

Then run **Quest Turn-In Completion And Consequence Receipt Owner Contract Decision**. It must establish authoritative readiness over retained survey evidence and return context, stable command/occurrence/result identities, typed authorized consequences, atomic accepted-only state application, durable duplicate handling, stale/conflict/rejection invariance, save/restart/publication validation, journal/tracking/operation/activity projections, and preservation of all survey receipts and non-proposals. Wallet or other domain owners must consume only authorized consequences. The return travel gap is part of this bounded dependency closure, not a cosmetic rename.

Live `player-travel-rules.ts` supports Starfall as origin but lacks it in the destination catalog. `gameplayLoop.ts` still requires `location.saltmere` for legacy Soundings turn-in while giving Starfall guidance; its direct gold/silver, standing/reputation and progression changes are source characterization only. `QuestsPanel.tsx` still uses the legacy snapshot turn-in bridge. None establishes accepted canonical delivery or reward authority.

Implementation is blocked pending these decisions, but prioritization is complete: `PLAYABILITY_PRIORITY_SELECTED`. No product answer is required to select the prerequisite; unresolved product choices must be asked in that next decision rather than silently implemented here. A separately installed bounded implementation and independent acceptance must precede any game-version candidate decision.

## Validation And Limitations

Applied FP-001/002: exact source and UI→caller→owner→persistence distinction; FP-008: preserved protected refs and treated archived proposals as evidence, with no integration; FP-009: separated inspected source from later publication identities; FP-013: required preservation of nested survey authority by the future completion owner; FP-014: required semantic evidence validation rather than journal/container shape; FP-017: injection-free ordinary creator and UI path. No new parent rewrite or semantic-validation implementation was performed; adversarial FP-013/014 checks are requirements for the future owner package, not newly executed tests. The prior milestone's 82/82 tests, Node configuration typecheck and Vite build remain predecessor evidence. Its known 137-diagnostic broad UI typecheck baseline remains non-green; no broad rerun or repair was needed for this documentation decision.

This is the first durable checkpoint, written before coordination updates. No production, tracked-test, content, schema, save, dependency, asset, game-version or deployment change. Source and documentation diff checks, branch refresh and exact publication identities belong to the subsequent coordination record.
