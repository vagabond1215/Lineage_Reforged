# Parallel GPT Connector-Only Run Results

Date: 2026-08-03

Coordinator source head: `91bd8c2c89c85fb9ea7257b2c96b68ab41231b04`

Execution surface: ChatGPT via GitHub Connector only

Status: `TEN_SEQUENTIAL_RUNS_COMPLETE_ISOLATED_CANDIDATE_INTEGRATION`

## Purpose

Provide one durable discovery and routing index for the ten sequential connector-only evidence refreshes completed from the same inspected master head.

The branch documents are noncontrolling evidence. They do not advance the active version, accept parent `0.6.9`, unblock Ashen Reef, authorize implementation, or replace live repository inspection.

Future planning, implementation, acceptance, or cleanup runs must consult the relevant entry when their scope matches a named consumer below. They should not read all ten indiscriminately when no semantic relation exists.

## Shared Evidence Contract

Every completed run:

- inspected live master `91bd8c2c89c85fb9ea7257b2c96b68ab41231b04` through the GitHub Connector;
- updated only the branch's one unique audit document;
- made no production, test, schema, content, asset, dependency, current-prompt, current-output, current-handoff, roadmap, planning-anchor, backlog, or active-route change;
- ran no local tests, builds, typechecks, linters, simulations, or generated-output checks;
- classified the branch as `CANDIDATE_INTEGRATION`;
- installed an explicit named-consumer and review trigger in the document;
- remained isolated and unmerged.

## Completed Run Ledger

| # | Branch head | Evidence document | Principal finding | Mandatory named consumers |
| ---: | --- | --- | --- | --- |
| 1 | `parallel/consumable-profile-coverage-audit` at `510251f77431b694591d4cbbd8127ed0ef5d3185` | `docs/design/consumable-profile-coverage-and-effect-ownership-audit.md` | Static profile authority is unchanged; three semantic links and one cask-scale link remain defective; serving, quantity, and execution owners remain absent. | consumable-profile integrity; food/body intake; medicine, poison, antidote, alchemy, or magical consumable planning; inventory portion/dose/container work |
| 2 | `parallel/equipment-profile-readiness-audit` at `6a98bd0b1eca74cee93dca16e0e3a32d9fe595e3` | `docs/design/weapon-and-armor-profile-current-state-readiness-audit.md` | Schemas and pure validation already exist; live wrappers, item linkage, accepted seed evidence, and consumers remain absent. | weapon/armor profile seed decision; equipment static package; equipment presentation/inventory consumer; combat integration claiming structural profiles |
| 3 | `parallel/gameplay-shell-ui-state-audit` at `882cba46578b49468bcbe624765d9dec0481eace` | `docs/design/gameplay-shell-and-ui-state-ownership-source-audit.md` | Campaign mutation admission now gates UI proposals, but Home is absent, active-tab null still renders an empty pane, pins remain snapshot-backed, and panel legacy bridges require case review. | Home/shell decision; persisted-preference ownership; representative-loop UI; `0.7.0` accepted-only UI review; legacy-bridge cleanup |
| 4 | `parallel/quest-turn-in-reward-source-audit` at `470e8aca48510f68824f7a5aa8f603d0b13bbc1f` | `docs/design/quest-turn-in-reward-delivery-and-idempotency-source-audit.md` | Quest acceptance/tracking are engine commands; turn-in remains UI gameplay-loop mutation with no command/result identity, durable reward receipt, replay, correction, or complete accepted-only panel transition. | quest turn-in/reward owner decision; Ashen Reef completion package; representative-loop quest audit; legacy-bridge cleanup; `0.7.0` quest evidence |
| 5 | `parallel/recipe-production-maturity-audit` at `3db3c0f52456b4007dedc43817ecca5c06edd239` | `docs/design/recipe-and-production-coverage-maturity-audit.md` | Static recipe and production-chain counts are unchanged; executable gathering, crafting, work-order, inventory, loss, quality, repair, and economy owners remain absent. | production-coverage evidence; recipe static package; gathering/crafting/work-order/economy decision; representative-loop or `0.7.0` crafting claim |
| 6 | `parallel/regional-bestiary-ecology-maturity-audit` at `2bafdb21a24535394c3cb32e946315c2c51eaa74` | `docs/design/regional-bestiary-and-ecology-coverage-maturity-audit.md` | Static creature/ecology coverage is unchanged; population, spawn, encounter selection, dynamic ecology, harvesting, and dynamic-loot owners remain absent. | bestiary expansion gate; encounter/spawn/population decision; harvesting/dynamic loot; tactics consumer; `0.7.0` ecology/encounter claim |
| 7 | `parallel/regional-settlement-maturity-audit` at `e96c3841d4e54f9bf6e2c40de8df5011bbbb4986` | `docs/design/regional-and-continental-settlement-maturity-evidence-audit.md` | Static settlement counts are unchanged; density planning, demographics, routes, services, and settlement runtime remain separate or absent. | settlement-density evidence; settlement/district/site package; route/travel/map/knowledge/service/civic decision; `0.7.0` regional-world claim |
| 8 | `parallel/research-artifact-retention-inventory` at `feaeedd8d9585e9a100699d640a893bc578e900c` | `docs/dev/temporary-research-artifact-retention-inventory.md` | Ten artifacts remain retained; the Normal-defeat artifact moved to `READY_FOR_RETIREMENT_REVIEW` because its named Normal/HP-zero consumer ran, but deletion is not authorized. | mortality/checkpoint/resurrection; narrative/crisis; elemental/AI; culinary/quantity/profile; dedicated artifact-retirement or hygiene pass |
| 9 | `parallel/rest-recovery-mutation-audit` at `0e32703c410b1172b6078346353a0adfb99debbc` | `docs/design/rest-and-recovery-ui-mutation-source-audit.md` | Generic campaign admission now gates rest proposals, but rest remains a UI legacy bridge with hard-coded service assumptions, full-resource restoration, and no service/payment/recovery receipts or replay contract. | rest/service/recovery owner decision; body/resource recovery; health/care review; representative-loop or `0.7.0` rest claim; legacy-bridge cleanup |
| 10 | `parallel/text-first-combat-view-model-audit` at `b605175e6edce6889171e067a5c899e4c7a59788` | `docs/design/text-first-combat-presentation-view-model-readiness-audit.md` | Combat contracts remain sufficient for a bounded read-only view-model plan; weighted tactics AI exists, ordered gambits, full NPC-party runtime, visibility policy, and player-facing presentation authority remain incomplete. | text-first combat contract; combat UI/view model; tactics/gambit presentation; NPC-party integration; representative-loop or `0.7.0` combat presentation claim |

## Discovery Rule

A future run must inspect the relevant branch document when any of these is true:

1. its prompt names one of the mandatory consumers above;
2. it proposes changing a file, owner, contract, or behavior analyzed by the branch document;
3. it claims the corresponding domain is mature, engine-owned, replay-safe, presentation-ready, or deletion-ready;
4. it proposes integrating, superseding, or deleting the branch;
5. it performs a representative-loop or maturity-band audit relying on that domain.

The run may omit unrelated branch documents, but its completion report must state which entries from this index were applicable and whether they were inspected.

## Authority Rule

The branch documents are evidence, not current execution authority.

Precedence remains:

1. current prompt;
2. current GPT handoff;
3. current Codex output;
4. focused accepted decisions and audits;
5. historical/deferred and planning reconciliation;
6. these isolated branch evidence documents when semantically applicable.

If a branch document conflicts with newer accepted authority, preserve it as historical evidence and follow the newer authority.

## Integration And Branch-Lifecycle Rule

Do not merge all ten documents as a batch merely because they are documentation-only.

At a named consumer or dedicated documentation integration pass:

- fetch/prune and resolve the exact branch head;
- compare the document against then-current master;
- classify each finding as current, superseded, or historically useful;
- integrate, re-author, hold, or retire independently;
- update `docs/dev/branch-disposition-register.md` once from the coordinator, not from parallel branches;
- verify equivalent preservation before branch deletion.

## Current Active-Route Relationship

The active historical recovery-fork authority decision does not require any of these ten domain audits as substantive input. It should inventory the branches and preserve their dispositions, but it must not integrate or rewrite them inside the active `0.6.9` decision.

Their value begins at the named future consumers above or a dedicated branch/document coordination pass.
