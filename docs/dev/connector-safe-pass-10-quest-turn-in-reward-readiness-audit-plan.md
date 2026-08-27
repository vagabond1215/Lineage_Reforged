# Connector-Safe Pass 10 - Quest Turn-In And Reward Readiness Audit

Date: 2026-08-27

Status: COMPLETE

Execution surface: ChatGPT via GitHub Connector; documentation-only/read-only source and evidence inspection

Source head: `a1829aaffdd549e2f941d479b0367a970ba6fe88`

Protected active route: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

## Purpose

Map the current source owners and missing contracts required for a future quest turn-in/reward package, using Soundings of Ashen Reef only as a concrete consumer. Do not choose or implement its payout.

## Questions

1. What quest turn-in/reward source exists today, if any?
2. Which owners currently mutate currency, standing/reputation, inventory/items, Knowledge, access/services, quest state, Chronicle/notifications, and persistence receipts?
3. What current authority prevents the Ashen four-shift completion from being mistaken for turn-in?
4. What duplicate/restart/admission/persistence contracts would a real turn-in require?
5. Can one narrow quest-specific turn-in be implemented without a generic reward framework?
6. Which reward categories are currently executable versus descriptive only?
7. What exact product/balance questions remain before a Soundings payout could be authored?
8. Which existing evidence branch can inform the map without becoming implementation authority?

## Success Criteria

- exact owner map for a future turn-in transition;
- explicit separation of work completion, turn-in, quest completion, payout, and consequences;
- no payout amount or salvage/service entitlement invented;
- no production/content/schema/test/prompt/output/handoff mutation;
- no branch/PR mutation;
- active prompt remains byte-identical.

## Expected Output

- `docs/design/quest-turn-in-and-reward-readiness-audit.md`;
- completion appendix in this plan.


## Completion Appendix

Result: `AUDIT_COMPLETE_OWNER_CONTRACT_READY_AFTER_PARENT_ACCEPTANCE_AND_AUTHORED_TERMS`

Completed output:
- `docs/design/quest-turn-in-and-reward-readiness-audit.md`

Key findings:
- the current quest turn-in remains a UI/game-shell `legacy_bridge` path, although the resulting snapshot is still routed through generic campaign admission;
- exactly two legacy turn-ins exist: Ashen and Rivet;
- the old Ashen Saltmere payout/standing/reputation constants are characterization only and must not become Soundings canon;
- current Soundings authority deliberately leaves numeric rewards null and ends the representative loop active/unturned-in;
- work completion, turn-in eligibility, accepted turn-in occurrence, quest lifecycle completion, consequence delivery, and presentation projections must remain separate;
- journal `completed` state is not a durable reward-delivery receipt;
- a first future turn-in should be quest-specific rather than a generic reward framework;
- implementation is gated by independent `0.6.11.1` acceptance and explicit authored Soundings turn-in terms;
- the historical evidence branch `parallel/quest-turn-in-reward-source-audit` at `470e8aca48510f68824f7a5aa8f603d0b13bbc1f` remains read-only evidence.

Safe stop reached after this pass: subsequent high-value work either depends materially on `0.6.11.1` acceptance or requires new product/balance decisions. No further Connector pass should be opened in this batch.
