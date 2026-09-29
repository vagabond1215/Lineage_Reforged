# Connector Audit — Slice D Transactional Campaign Store Prework

Date: 2026-09-29. Repository: `vagabond1215/Lineage_Reforged`. Read-only audit source: `62fc8ad7856ad15ca6eb686c71e36f2193d0964f`. Scope: connector-safe prework for **DEV-0.7.1 Slice D - Transactional Campaign Store Foundation**. No production code, save, content, schema, dependency, branch disposition, game version or milestone changed by this audit.

## 1. Persistence-owner inventory

Current browser persistence is not one save blob. `saveManager.ts` owns v7 slot envelopes, immutable artifacts, campaign controls/heads, publication recovery, Soundings witnesses, candidates, legacy-v6 migration receipts/sources and obsolete-key compatibility. `accountProfileManager.ts` separately owns `accounts.v1` profile/history/families/estate/achievement/publication-receipt state and the active-account pointer. `newCampaignAttemptCoordinator.ts` owns prepared new-campaign attempts and retries. `launcherAuthManager.ts` owns launcher/session/reset behavior and calls account/save owners. `App.tsx` orchestrates startup recovery, account consumers and ordinary save/load flows. Theme/session/launcher preferences share the origin but are not campaign-store authority.

Slice D should therefore establish a campaign publication store boundary without converting account, launcher, attempt or App callers yet. The store contract needs future namespace/record-family room for recovery, account consumer, attempt and migration records, but adding them to the live transaction is outside Slice D.

## 2. Transaction invariants extracted from current authority

The IndexedDB foundation must preserve semantic invariants, not merely reproduce key/value CRUD:

- immutable artifact identity: an existing artifact ID may be accepted only if its exact retained envelope/semantic identity matches; conflicts fail before head promotion;
- stale-head protection: expected campaign head/revision must match before publication; a stale writer cannot promote a head;
- slot/address authority must point to a verified immutable artifact and preserve campaign/account/slot identity;
- a transaction may not expose a promoted head without its required artifact and address facts;
- malformed/unknown record versions fail closed before commit;
- retry of the same source is idempotent; a conflicting same-ID retry fails;
- abort/quota/unavailable/blocked-upgrade must leave the previously accepted store state unchanged;
- exact post-commit readback must verify artifact, control/head, address and any witness written by the transaction.

Soundings adds a stricter cross-record invariant. Current localStorage recovery intentionally establishes pending witness evidence before head promotion, then applied witness evidence before recovery cleanup. The IndexedDB transaction does not need to copy those intermediate localStorage write stages literally, but its committed state must be semantically equivalent or stronger: a Soundings first durable head cannot become visible without the matching immutable artifact and valid applied witness in the same atomic commit. A descendant publication with no new sidecar still depends on the retained applied first-publication witness and first durable artifact. Missing, pending, malformed or conflicting stable witness/provenance must block commit/readback rather than downgrade to legacy.

## 3. Synchronous-to-asynchronous seam

Current save/account owners expose synchronous localStorage operations while IndexedDB is asynchronous. The high-risk callers are `App.tsx` startup/sign-in repair, save/load/list/delete flows, account publication consumer completion, new-campaign attempt preparation/completion/retry, launcher account reset, and tests/helpers that assume immediate mutation. Slice D should not convert these callers. It should expose an async storage-owner API with typed request/result/failure contracts and prove it independently. Later cutover must make caller conversion explicit rather than hiding IndexedDB behind a fake synchronous facade.

Pure engines must remain browser-storage agnostic.

## 4. Soundings witness dependency audit

An applied Soundings witness is independent durable provenance, not reconstructable from a later snapshot. It binds account/campaign/request/character to the first durable artifact, publication and head revision. Loading an applied witness verifies that first artifact still exists and verifies provenance against its snapshot. First-publication interruption/recovery tests currently prove pending-before-head and applied-before-recovery-cleanup behavior; descendant publications require the stable applied witness even when no new witness sidecar is carried.

Slice D therefore needs a witness store keyed by stable account/campaign/request identity, immutable/conflict semantics, and a transaction precondition that validates first-publication artifact/witness consistency. It must not overwrite an existing conflicting witness or synthesize one from snapshot agreement.

## 5. Slice-D acceptance matrix

Minimum focused matrix:

| Case | Required result |
| --- | --- |
| first ordinary publication | artifact + head/control + slot commit atomically; exact reopen/readback |
| first Soundings publication | artifact + matching applied witness + head/control + slot commit atomically |
| descendant with stable Soundings provenance | commit only if retained applied witness/first artifact remain valid |
| abort before/at each record write | no partial committed state; old head/address remain exact |
| quota/transaction abort | explicit failure; old accepted state exact |
| stale expected head/revision | reject without writes |
| immutable artifact same-ID conflict | reject without overwrite |
| witness same-key conflict | reject without overwrite |
| malformed/unknown record version | reject before promotion |
| same-source retry | idempotent exact result |
| conflicting retry | reject |
| close/reopen database | exact committed readback |
| blocked upgrade / unavailable IndexedDB | explicit non-mutating failure |
| account/campaign/slot cross-identity mismatch | reject |
| non-head/fork-compatible identity | store contract must not accidentally collapse continuity semantics |

At least one native-browser IndexedDB run is still required by the installed prompt; mocks alone are insufficient.

## 6. Migration-risk and schema-fit audit

Legacy cutover must eventually account for v7 artifacts/controls/slots/recoveries/witnesses/candidates, v6 and obsolete save keys, migration receipts/sources, `accounts.v1` profiles and consumer receipts, new-campaign attempts, launcher/session owners and reset semantics. Existing migration source/receipt records are retained provenance even when no ordinary UI reader exists.

Schema guidance for Slice D:

- preserve stable account/campaign/artifact/publication/generation/request/slot IDs as explicit indexed fields rather than burying all identity only in opaque payloads;
- version every stored record family independently enough to reject unknown/malformed records;
- use a publication-shaped transaction operation that receives expected head plus artifact/control/address and optional witness facts, validates cross-record identity, then commits atomically;
- do not make object-store layout itself the product authority; semantic validators remain authoritative;
- reserve migration metadata/version activation without making localStorage and IndexedDB simultaneous writable truths;
- do not encode a fixed 5 MiB/50-save/1,000-save cap in schema.

## Connector disposition

**SLICE_D_PREWORK_READY.** No connector-discovered blocker requires a new decision before Slice D. The material refinement is that Slice D must prove a publication-shaped atomic contract and cross-record schema fit, especially Soundings first-publication provenance, rather than only demonstrating independent record stores. Live localStorage callers remain unchanged until a later cutover slice.
