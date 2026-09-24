# Connector Map — Soundings F2 Callers And Reachability

Date: 2026-09-24

Repository: `vagabond1215/Lineage_Reforged` only.

Posture: Connector-safe static caller/reachability audit. No production mutation and no exploitability claim beyond observed owner/API behavior.

## Owner API

`apps/rpg-ui/src/game-shell/saveManager.ts` exports `completeCampaignPublicationConsumers(...)`. The function is an owner boundary: it may record completed consumer kinds and delete publication recovery when all declared consumers are complete.

F2 is directly reproducible against this exported owner API by corrupting retained recovery evidence and calling the function. The focused independent B1 probe is therefore a valid owner-contract reproduction even though it does not establish an ordinary UI path that performs the same corruption.

## Normal App Recovery Path

`App.tsx` routes startup/sign-in through `repairMandatoryCampaignConsumers(...)`.

That function first calls `recoverPendingCampaignPublications(accountId)`. Recovery completes publication/witness/address work before it reconstructs or applies pending account consumers. Only after account consumer receipts are applied does it call `completeCampaignPublicationConsumers(...)` with the applied consumer kinds.

This ordering is important: ordinary startup does not normally jump directly from a malformed `head_verified` Soundings recovery to consumer cleanup. That mitigates ordinary UI reachability of F2 but does not absolve the exported owner from fail-closed validation.

## Normal Publication Path

`publishSave(...)` creates candidate bytes, validates provenance, retains publication recovery, retains pending witness when required, writes immutable artifact/head, promotes witness during address recovery, then returns the verified publication. When there are no consumer plans it removes recovery itself; when consumers exist it leaves `address_verified` recovery for later consumer completion.

Thus ordinary publication callers are expected to encounter consumer completion only after publication recovery has reached its safe address/witness posture.

## Account Consumer Path

`repairMandatoryCampaignConsumers(...)`:

1. recovers durable publications;
2. records missing pending account-consumer receipts;
3. applies account consumers from verified loaded publications;
4. saves the account profile;
5. for terminal recovery, may delete playable save addresses after all declared consumer effects are applied;
6. calls `completeCampaignPublicationConsumers(...)` last.

The F2 repair must preserve this ordering and its idempotence.

## Terminal / Retirement Path

The App also completes terminal publication consumers after terminal account effects and address cleanup. `completeCampaignPublicationConsumers(...)` already contains an explicit comment that terminal consumer completion may follow address deletion and therefore must validate retained witness evidence without recreating the playable address.

This is a required preservation case: the repair must not solve F2 by demanding that a terminal slot address still exist.

## Reachability Classification

| Surface | F2 relevance | Connector conclusion |
| --- | --- | --- |
| Exported persistence owner API | Direct | Acceptance-critical owner defect is reproducible. |
| Startup/sign-in recovery | Indirect | Recovery runs before cleanup; ordinary path mitigates F2. |
| Ordinary save publication | Indirect | Publication completes witness/address protocol before later consumer cleanup. |
| Terminal/retirement cleanup | Direct legitimate caller | Must preserve cleanup after intentional address deletion. |
| Quests/UI reward application | None | No repair evidence points to UI or reward logic. |

## Scope Consequence

No App/UI redesign is justified. The repair belongs at the persistence owner boundary because callers should not need to know whether a retained publication is Soundings provenance-required. The owner must derive and enforce that requirement itself.

## Connector Disposition

`F2_CALLER_REACHABILITY_MAP_COMPLETE`

Ordinary UI exploitability remains unestablished; owner-boundary correctness remains mandatory.
