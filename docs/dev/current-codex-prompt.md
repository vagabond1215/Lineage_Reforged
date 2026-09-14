# Quest Turn-In Completion And Consequence Receipt Owner Contract Decision

Date: 2026-09-14

Label class: unversioned technical owner-contract decision; parent: not applicable.

Development milestone impact: `none`; game-version impact: `none`.

Accepted milestone: `DEV-0.7.0`; current band: `DEV-0.7.x`; Game `0.1.0-prealpha`; playability: `INTEGRATED_LOOP`.

Accepted authored prerequisite: `docs/design/soundings-return-submission-and-payment-authored-terms-decision.md` with `AUTHORED_TERMS_ACCEPTED`.

## Objective

Define the smallest authoritative technical contract required to close **Soundings of Ashen Reef** through reachable Starfall return, accepted submission, quest completion, 5-gold payment, durable Chronicle/history consequence, and continued play.

This is a decision package only. Do not implement production behavior in this run.

## Orientation And Authority

Work only in `vagabond1215/Lineage_Reforged`. Follow `AGENTS.md`, current prompt/output/handoff, repository-first protocol, platform/tool policy, resource-slicing policy, branch policy/register and applicable failure-pattern guardrails.

Reuse the accepted DEV-0.7.0 and Game 0.1.x playability evidence unless fresh drift contradicts it. Read completely:

- `docs/design/soundings-return-submission-and-payment-authored-terms-decision.md`;
- `docs/design/game-0.1.x-playability-gap-prioritization-decision.md`;
- `docs/design/ashen-reef-soundings-authored-canon-decision.md`;
- `docs/design/quest-turn-in-and-reward-readiness-audit.md`;
- accepted survey advancement/reachability authorities;
- current travel, quest journal/tracking, wallet/currency, Chronicle, session bridge and legacy turn-in caller source.

Historical Saltmere payout logic is characterization only.

## Accepted Product Terms To Preserve

The technical contract must preserve these exact authored terms:

- submission surface: **Starfall Harbormaster's Office, Starfall Port**;
- `Duty Harbormaster` remains a role label, not a named person;
- packet representation: retained authoritative survey evidence, not an inventory item;
- return leg: **Ashen Reef → Starfall Port**, **4 ticks**, **no monetary fare**;
- do not encode the return terms as a universal Starfall destination cost from unrelated origins;
- submission is immediate once readiness and location are valid;
- accepted payment: **5 gold, 0 silver**;
- no standing, fame/reputation, turn-in skill gain, item reward, service unlock or salvage right;
- one-time-per-campaign; no recurrence;
- quest becomes completed;
- Chronicle/history consequence is durable;
- Stormglass remains incidental and is not surrendered;
- duplicate/retry must not pay or complete twice.

## Required Decision Work

1. Select the narrowest safe owner for the Ashen Reef → Starfall Port return dependency. Determine whether the existing travel command can safely consume origin/destination route facts or whether a bounded quest-return adapter is required. Do not widen the travel system beyond the minimum coherent boundary.
2. Define authoritative turn-in readiness from:
   - active Soundings quest identity;
   - complete semantically valid retained survey evidence;
   - accepted Starfall return/submission context;
   - one-time completion state.
3. Define stable command/request, occurrence/result and typed consequence identities for completion and payment.
4. Define which owner mutates quest completion and which existing owner consumes the authorized 5-gold payment consequence. No UI-era direct wallet mutation may become the new authority.
5. Define accepted-only application and real caller/UI boundaries, including retirement, bypass or characterization-only treatment of legacy `gameplayLoop.ts` / `QuestsPanel.tsx` turn-in behavior.
6. Define projection consequences for quest journal category/status, tracking, survey operation, current activity, notification/Chronicle state and any return-travel presentation.
7. Define exact duplicate, retry, stale, conflict, malformed-evidence and wrong-location rejection semantics. Rejected commands must not mutate wallet, quest state, Chronicle, operation or retained survey evidence.
8. Preserve all accepted survey requests/occurrences/results/receipts, correction/repair state and non-proposals across completion and later save/restart.
9. Define publication/restart validation and focused regression coverage for the future implementation.
10. Decide whether the resulting package is decision-complete for one bounded implementation. If not, install only the smallest exact prerequisite.

## Guardrails

Apply at minimum FP-001, FP-002, FP-009, FP-013, FP-014 and FP-017; apply branch guardrails when live refs are inspected.

Do not:

- change production, UI, content, schema, tests, saves, migrations, dependencies or assets;
- create generic quest/reward/travel frameworks;
- create a survey-packet inventory item;
- invent NPC/person/institution authority;
- add standing/reputation/skill/item/service/salvage rewards;
- reuse legacy `5g 8s`, Saltmere, or fame/standing terms;
- allocate `DEV-0.7.1`;
- change `GAME_VERSION` or `worldVersion`;
- claim implementation or executable acceptance from documentation inspection.

## Result And Successor

Return exactly one:

- `OWNER_CONTRACT_ACCEPTED`; or
- `OWNER_CONTRACT_BLOCKED`.

Write the focused owner-contract decision to:

`docs/design/quest-turn-in-completion-and-consequence-receipt-owner-contract-decision.md`

On `OWNER_CONTRACT_ACCEPTED`, install one bounded implementation prompt for Soundings return/submission/payment. That implementation must require local repository execution and focused executable validation. Do not allocate a game-version increment; game-version acceptance remains a separate post-implementation decision.

On blockage, name the exact unresolved owner/dependency and install only its smallest resolution.

Update current output/handoff and necessary routing authorities. Connector-only publication may record remote commit/readback identity but must not claim local worktree synchronization, tests, builds or browser execution.
