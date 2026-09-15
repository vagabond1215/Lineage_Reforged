# Current GPT Handoff

Date: 2026-09-14

Repository: `vagabond1215/Lineage_Reforged`

Status: Soundings authored terms accepted; turn-in/completion owner contract accepted; bounded implementation route/prompt installed; production implementation remains pending local execution and validation.

Game version: `0.1.0-prealpha`; phase: Early Pre-Alpha / First Playable; playability: `INTEGRATED_LOOP`.

Accepted milestone: `DEV-0.7.0`; current band: `DEV-0.7.x`.

Active route: **Soundings Return, Submission, Payment, And Durable Completion Implementation**.

## 1. Controlling Decisions

Read first:

- `docs/design/quest-turn-in-completion-and-consequence-receipt-owner-contract-decision.md`;
- `docs/design/soundings-return-submission-and-payment-authored-terms-decision.md`;
- `docs/design/game-0.1.x-playability-gap-prioritization-decision.md`;
- `docs/design/ui-information-architecture-boundary.md`;
- current prompt/output.

Owner contract disposition: `OWNER_CONTRACT_ACCEPTED`.

Accepted product terms remain:

- 5 gold, 0 silver;
- no standing/fame/reputation/skill/item/service/salvage reward;
- retained survey evidence is the packet;
- Starfall Harbormaster's Office submission;
- Duty Harbormaster remains a role;
- Ashen Reef → Starfall Port = 4 ticks, no fare, not a universal Starfall cost;
- immediate submission/completion/payment;
- one-time contract;
- Chronicle/history record;
- Stormglass preserved;
- no double-pay/double-complete.

## 2. Implementation Boundary

Existing player travel remains the movement/time/body owner.

Add only the bounded Ashen→Starfall route facts required by the accepted return.

Add one quest-specific Soundings turn-in engine owner and a separate durable turn-in authority ledger with request/occurrence/result/consequence receipts.

The turn-in owner atomically owns the exact transaction boundary:
quest completion + exactly 5g + tracking cleanup + survey operation/activity transition + completion projections.

The first currency consequence remains quest-specific and must have a durable currency-credit receipt. Do not build a generic reward/wallet framework.

Use a real runtime caller plus campaign/session admission. GameSessionContext applies only accepted state. Migrate Soundings away from the legacy `QuestsPanel.tsx -> gameplayLoop.turnInQuest` mutation path.

Preserve the full accepted survey authority graph and Stormglass.

Connector drift review on 2026-09-14/15 confirmed two implementation-critical legacy surfaces that the active prompt now names explicitly: current Soundings reward presentation/content still says exact terms are deferred, and `gameplay-snapshot-sync.ts` duplicates the old Saltmere-based turn-in readiness predicate. The local implementation must reconcile both without rewriting historical decision evidence.

## 3. UI Direction

The 2026-09-14 UI concept is now incorporated into durable design intent.

Broad shell implementation is deferred until after real loop closure and independent acceptance.

This implementation may make only the targeted UI changes necessary for truthful Starfall return, packet readiness, blockers, authoritative turn-in, 5g/completion result and Chronicle feedback.

Those affordances should be compatible with the future composition:
top context band + character/navigation rail + primary domain workspace with contextual inspector/supporting history.

Do not rebuild the shell in this implementation.

## 4. Required Execution

Execute only `docs/dev/current-codex-prompt.md`.

This is a bounded `M` local implementation requiring executable validation.

On success return `IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE` and install **Soundings Durable Completion Independent Acceptance Audit**.

Do not allocate `DEV-0.7.1` or change `GAME_VERSION`.

The owner-contract/UI-intent work in this handoff was performed by remote Connector writes; the implementation owner must fetch/prune and synchronize the local checkout before editing.
