# Area / Atlas Action Priority, Feedback, and Consequence Preflight

Date: 2026-10-28. Status: **documentation-only candidate UI behavior; not command, receipt, rank-algorithm, Save, schema, selected-client, or implementation authority**.
Source: selected `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; unselected native v3 PR #44 `022fe22def299cf9fc357058a0214e83875af24b`. Independent held design PR #45.
Companions: `area-atlas-text-first-gameplay-surface-and-command-source-map-2026-10-28.md`, `area-atlas-navigation-wireflows-state-matrix-and-ui-acceptance-2026-10-28.md`, `area-atlas-observation-knowledge-and-owner-provenance-gate-2026-10-28.md`.
Precedence: accepted `contextual-player-action-and-command-architecture-decision.md`, `local-scene-context-projection-decision.md`, `combat-text-first-feedback-and-observability-prework-2026-10-20.md`, and `narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`.

## 1. The player decision loop

**Read current admitted situation → inspect actual target → preview one concrete owner action → confirm only material stakes → invoke owner and campaign admission → distinguish acceptance from effects → show newly admitted state and retained evidence → choose next action.**

No Area action registry, game-rule evaluator, duplicated inventory or universal command system follows from this loop. The selector is a pure presentation consumer. UI navigation/inspect/collapse do not create gameplay events or advance a watch. Command descriptors are not capability tokens and cannot be the idempotency IDs of the source owner.

### Currently observable selected-master seams

| Selected seam | Actual route and evidence | Specific presentation limitation |
| --- | --- | --- |
| World/Explore | `WorldPanel` `resolveNearbyExplorationPlan` → `useGameSession.exploreNearby` → `advanceNearbyExplorationCaller` → `admitCampaignMutation` | 1 tick and 2 Stamina in current authored vertical slice; finding a foe is not guaranteed |
| World/Approach | Accepted `nearbyExplorationCandidate` → `admitNearbyEncounter` → campaign admission | Candidate signs are not active combat |
| World/Encounter | `listLegalPlayerCombatCommands` → `advanceNearbyEncounter`; optional Continue beat | `WorldPanel` currently uses “Combat Advanced” for accepted steps; this is not proof of hit/damage/terminal effect |
| World/Travel | `previewTravelToKnownLocation`, `buildActionOutcomePreview`, `travelToKnownLocation` → `updateSnapshot` with owner `engine_result`, command and result ID | Destination selection is UI-only; preview does not authorize the eventual command |
| Activity/Select | `setCurrentActivityFromRecord` → exact `player.activity.select` engine route | A selected activity record is not a durable generic job attempt |
| Activity/Advance | Generic `advanceCurrentActivity` versus `advanceAshenReefSurvey` on a separate retained request path | Do not merge a special survey stage with generic shift progression |
| Activity/Rest | `previewRestAtCurrentSettlement` and `restAtCurrentSettlement` | Current first-loop rest costs 4 silver and 4 ticks when eligible; not a universal inn/bed law |
| Quests/Accept, Track, Turn in | `QuestsPanel` accepts/tracks via engine-backed helpers, selected Soundings turn-in via retained request owner; generic turn-in remains a different bridge | Reading a quest does not establish a physical clerk/board or authorize turn-in |
| UI notice/result | `PanelNotice`, `NoticeToast`, owner result messages and `GameSessionContext` | A transient success notice is not substitute for accepted source state, action outcome, or account receipt |

## 2. Prioritization: propose bands, not fabricated legality scores

**Candidate visual priority groups** are deterministic *only after* owner visibility/legal plans exist. They are design groups, not hardcoded numeric score formulas or new shared types.

| Band | Condition and projection rule | Main placement | Never infer |
| --- | --- | --- | --- |
| P0 | Active encounter, current pending defeat/recovery *when selected*, or another owner-verified urgent blocking lifecycle | Situation header and immediate owner-supported actions | An arbitrary emergency from low HP alone, hidden threats, new recovery controls |
| P1 | One concrete next action grounded in a currently observed target or accepted candidate; current owner reports eligibility | First action row + preview | Target presence from catalog, map marker or flavor text |
| P2 | Current admitted activity/progression with exact owner continuation, or settlement rest supported by owner | Secondary action row or Activity link | Generic pause/cancel/resume or free rest |
| P3 | Known destination choice, current objective/quest context, or disclosed nearby reference | Open Atlas / Quests / inspect, not necessarily a world command | Travel permission, clerk presence, automatic quest acceptance |
| P4 | Long-horizon market, employment, management, collection, Codex and Chronicle | Secondary domain link and contextual detail | Live commerce, staffed guild services, unlocked future systems |
| Omitted | Not observed, undisclosed, unsupported, unsafe/secret, or missing canonical owner | No button or hidden target-specific blocker | Leak of feature existence by a gray action |

**Rules for tied candidates:** preserve independent owner commands; place immediate accepted owner opportunity ahead of reference-only navigation; prefer current selected target over unrelated targets; keep a relevant blocked explanation next to its observed target; use stable readable ordering for the rest. A promoted shortcut has the **same command/target/method and source fence** as its owning panel; do not double-list an identical invocation with a different label. If the caller is blocked, a cross-link into the owner remains navigation, not a second execution path.

**Suggested default information budget:** show one primary contextual choice, up to three other strongly relevant choices, and a concise “more actions in Activity / Quests / Inventory / Atlas” route. This is a *readability target*, not a rule that hides another genuinely vital legal choice. Combat can exceed the ordinary count when the existing owner returns multiple distinct legal commands. Do not choose a default action automatically or make the highest-ranked verb activate on Enter if focus context is ambiguous.

## 3. Legal, blocked, omitted and knowledge states

Maintain the accepted four player-visible contextual states: `available`, `available_risky`, `blocked_explained`, and `omitted`. “Unselected candidate” is a developer readiness label, not a playable state. Separate **visibility** from **legality**:
- An undisclosed creature or hidden location is omitted, not presented as “requires perception skill.”
- A disclosed known destination can be visible with unavailable travel. Owner may say the route is unavailable without revealing secret details.
- A valid nearby Explore can be visible with low stamina and its actual public `insufficient_stamina` reason.
- An authenticated present actor or station not yet supported by a command owner is reference-only, not an active “Talk / Buy / Craft” button.
- If a future owner reports a prohibited physical action with a supported crime/consequence system, it may be `available_risky`; without that owner, illegal options are **not** fabricated as playable.

Do not calculate a new danger score, effort cost, time passage, legality, path length, success chance, local presence or hidden availability in UI. `buildActionOutcomePreview` is an existing body-state projection for certain actions, not a universal prediction service.

## 4. Full feedback lifecycle (requested, admitted, effective, durable)

| Stage | Trusted fact | Candidate player-facing wording | Prohibited claim |
| --- | --- | --- | --- |
| Inspect / selection | UI target/source and current read-only owner preview | “Travel outlook”, “Known destination”, “Explore nearby, 2 Stamina” | “Travel begun”, “Enemy engaged”, cost already paid |
| Confirm | Same concrete action and still current preview; no mutation yet | “Confirm travel to [disclosed place]” for material risk | Guaranteed success, pre-spent currency |
| Request submitted | Caller has begun, may still be pending/blocked | “Checking current state” only if genuine async boundary exists | An invented accepted result/transaction |
| Owner rejects/stale | Exact rejection code/reason where safe to reveal | “Travel state changed; refresh route”, “Requires 2 Stamina” | “Completed,” tick/time/cost changed, hidden target |
| Accepted mutation/publication | Accepted owner result and campaign-session admission | “Exploration completed” / “Travel completed” only when exact operation committed | Damage/hit/quest payout if those effects did not resolve |
| Effect resolved | Owner state/receipt proves changed player/world/combat state | “Health changed”, “Encounter started”, “Objective updated” where actually source-supported | Guessing causal hit, unseen foe HP, simulated resource node |
| Durable account/Save | Existing authoritative persisted publication/account consumer result | “Saved/retained” only after actual readback | Treat a toast as a durable receipt or a test fixture as selected acceptance |
| Duplicate/retry | Owner identifies original accepted attempt/result | “Already applied; current state shown” | Second reward, repeated tick, new Chronicle event |
| Recovery/terminal | Valid selected lifecycle owner returns a readable current state | “Recovery pending / playable / retired” only when owner confirms | Auto-recovery or native v3 activation from PR #44 design |

**Critical combat boundary:** an accepted combat *step* may queue, continue, progress or resolve an action. Existing combat-specific prework is the controlling authority for hit/miss/damage/action phase disclosure. Area should expose its exact result/phase facts if provided, or neutral “Combat step accepted” text if fine-grained evidence does not exist. Do not imply a hit or victory from the `WorldPanel` “Combat Advanced” notice.

### View refresh and no phantom success

After accepted owner action, recompute the entire Area local scene from the returned admitted snapshot/control; do not optimistically edit the place name, active foe, cost meter or quest count in the UI. After rejection or stale preview, clear active confirmation, preserve navigation/focus where valid and re-read the current source. A displayed outcome should be attributable to the actual owner result, while durable history requires accepted owner records; a transient toast must be supplemental rather than the only place a material change appears.

PanelNotice currently shows title and detail; NoticeToast announces via polite `status` (assertive `alert` for danger) and normally auto-dismisses. A later accessibility repair may join a persistent current-action result panel with a concise live announcement, but must avoid duplicate simultaneous announcements, toast-only outcomes or unbounded combat log speech.

## 5. Truthful cost, risk, interruption and consequence treatments

| Situation | What to preview | What to show after |
| --- | --- | --- |
| Nearby Explore | Current accepted plan's 1 tick, 2 Stamina and uncertain encounter chance; no guaranteed spawn | Accepted explore result and any actual candidate, or owner reason |
| Approach candidate | Exact visible candidate context/encounter admission if exposed by owner; no speculative damage | Accepted active encounter or rejection, not both |
| Combat command | Concrete action, target, owner-provided current resource cost and timing; optional queue state | Admission then source-observed queued/resolved/effect state |
| Travel | Actual origin/destination, allowed plan and body-state forecast/ticks (not map pixel distance) | Owner-accepted new location/time and resources |
| Current generic activity | Current selected activity and preview where available | Accepted shift or denial; actual state, no fake long-work progress |
| Survey stage | Accepted survey plan, named stage and retained request identity | Exact stage acceptance/repair/retry status, never duplicate stage |
| Settlement Rest | Owner-supported four silver/four ticks in current loop, projected recovery | Actual admitted resource restoration and activity only |
| Quest accept/turn-in | Owner-eligible quest id, public requirements, payout only if actually provided | Accepted active/complete state and receipt, not simply “read quest” |

**Interruptions:** during combat or pending defeat, ordinary Area shortcuts are presentation-suppressed by current state; enforce actual command legality at owning engine too. Never claim a universal cancel/interrupt right for travel, production or activities merely because design describes future resumable work.

## 6. Prospective red-first acceptance matrix (not run)

| Case | Controlled setup | Presentation invariant |
| --- | --- | --- |
| AF-01 | Ordinary settled snapshot with legal nearby Explore | Explore is visible with true tick/Stamina cost |
| AF-02 | Same state with low stamina | Explained Explore block, no phantom cost |
| AF-03 | Exploration returns no encounter | No fake candidate/forced combat |
| AF-04 | Exploration returns candidate | Show Approach, not combat action buttons |
| AF-05 | Active encounter | Combat owner choices get contextual priority |
| AF-06 | Accepted combat command queued but not resolved | No “hit” or damage claim |
| AF-07 | Accepted combat step with no final victory | No terminal success wording |
| AF-08 | Source-confirmed combat effect | Show only actual event/state delta, with correct actor/target |
| AF-09 | Known destination selected but not traveled | Preview only, zero mutation/tick/receipt |
| AF-10 | Risky travel confirmed after source/target change | Clear/re-evaluate confirmation, no stale execution |
| AF-11 | Owner travel denial | Public reason, no place/time/body change |
| AF-12 | Accepted travel | Exactly one owner command and new location readback |
| AF-13 | Accepted shift then revisit Area | Actual current activity/progression, not imagined work completion |
| AF-14 | Special survey versus generic shift | Distinct request/owner, correct stage and no double count |
| AF-15 | Settlement Rest attempted without funds | Owner blocked, no restorative effect |
| AF-16 | Quest known but no observed physical clerk | Owner quest link, no invented local turn-in service |
| AF-17 | Two different commands same family/target | Both retain distinct identity and current owner legality |
| AF-18 | Two UI shortcuts same command/target/method | One underlying operation, no duplicate emission |
| AF-19 | Stale head after preview | Owner rejects/replans; no success toast |
| AF-20 | Duplicate/retried owner operation | Stable original receipt, no second reward or tick |
| AF-21 | Any undisclosed target | No hidden name/position in blocked label or result |
| AF-22 | Navigation-only Area/Atlas change | No command, time, Save or gameplay effects |
| AF-23 | Material result after toast auto-dismiss | Still inspectable from accepted state/owner history |
| AF-24 | Keyboard/screen reader simultaneous notices | One concise announcement, usable action labels and focus |
| AF-25 | Native v3 remains unselected | No v3-only action presented as selected |
| AF-26 | Accepted owner rejection after same-frame UI selection | Accurate source-specific refusal, not UI optimistic mutation |

## 7. Isolation, implementation consumer and exact source audit

This pass is one independent Markdown addition on draft PR #45, `HOLD_NAMED_CONSUMER`. Its nearest future consumer is **World Area contextual presentation after selected native v3 + Character UI integration disposition**, not current Codex PR #44 or the parked combat route. Do not edit `WorldPanel`, `GameSessionContext`, `EpochApp`, combat engine, Save, schemas, catalogs, selected master, game version, current Codex prompt/output/handoff or branch register. No tests executed.

Source files read in current selected master: `apps/rpg-ui/src/features/WorldPanel.tsx`, `ActivityPanel.tsx`, `QuestsPanel.tsx`, `game-shell/components/GameActionButton.tsx`, `PanelNotice.tsx`, `NoticeToast.tsx`, `runtime/bodyStatePresentation.ts`; `packages/engines/game-engine/src/player-nearby-exploration.ts`, `player-nearby-encounter.ts`, `player-travel-rules.ts`, `player-activity-selection.ts`; accepted contextual command, local scene, combat feedback and narrative-realization decisions.
