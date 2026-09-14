# Current GPT Handoff

Date: 2026-09-14

Repository: `vagabond1215/Lineage_Reforged`

Status: Soundings authored closure terms accepted; `AUTHORED_TERMS_ACCEPTED`.

Game version: `0.1.0-prealpha`; phase: Early Pre-Alpha / First Playable; playability: `INTEGRATED_LOOP`.

Accepted milestone: `DEV-0.7.0`; current band: `DEV-0.7.x`.

Active route: unversioned **Quest Turn-In Completion And Consequence Receipt Owner Contract Decision**.

## Accepted Product Boundary

Read first:

- `docs/design/soundings-return-submission-and-payment-authored-terms-decision.md`;
- `docs/design/game-0.1.x-playability-gap-prioritization-decision.md`;
- current prompt/output;
- accepted Soundings canon and quest-turn-in readiness audit.

Controlling authored terms:

- 5 gold payment, no silver;
- no standing, fame/reputation, turn-in skill gain, item, service unlock or salvage reward;
- retained survey evidence is the packet; no packet inventory item;
- return to Starfall Harbormaster's Office / Starfall Port;
- Duty Harbormaster remains a role label;
- Ashen Reef → Starfall Port return: 4 ticks, no fare;
- do not generalize that return cost to unrelated origins;
- immediate accepted submission/completion/payment;
- quest becomes completed and consumed;
- durable Chronicle/history record;
- Stormglass remains incidental;
- duplicate/retry cannot double-pay or double-complete.

Legacy Saltmere turn-in and legacy payout/consequence values are non-canonical characterization.

## Next Decision

Execute only `docs/dev/current-codex-prompt.md`.

The owner-contract decision must determine the smallest safe authority for return travel and completion/consequence receipts, including readiness, command/result identities, typed payment, wallet consumption, accepted-only application, duplicate/stale/conflict rejection, survey preservation, projections, persistence/restart and real-caller/UI boundaries.

It must not implement production behavior.

On `OWNER_CONTRACT_ACCEPTED`, install one bounded implementation prompt requiring local executable validation. Do not allocate `DEV-0.7.1` or change `GAME_VERSION`.

## Publication And Execution Boundary

Authored decision file commit: `592c921494beeb822b3aaee231ab6086670c1ed1`.

Owner-contract prompt installation commit: `743ad6a36cea68adc5ca5c32551c443e3a60a13a`.

These were remote GitHub Connector writes. Do not infer local checkout synchronization, tests, builds or browser execution from them. A later local implementation owner must fetch/prune and synchronize before executable work.

Retained branch/protected-reference posture remains unchanged unless fresh branch inspection proves otherwise.
