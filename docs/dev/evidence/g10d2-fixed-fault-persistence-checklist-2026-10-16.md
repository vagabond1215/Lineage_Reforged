# G10D.2 fixed D3–D6 fault and persistence checklist

Source: clean fetched authenticated local/hosted `master` `0c13999ea832661dc35db74a69d8371e8b3fd485`. Fixed before any G10D.2 fault injection. `G10D_D1_D2_SELECTED_PROVEN_ON_COMBINED_GRAPH` is preserved; the `:5343` 120-save ledger is prerequisite, not rerun acceptance. Test only disposable synthetic accounts/databases/origins. Archive/verifier payloads stay private and outside repository evidence.

## Shared graph and comparison rule

- Build a fresh disposable owner graph with at least the measured G10D.1 scale (120 retained descendant publications), an accepted first head, retained non-head address/fork, three run histories, ordinary-shape Soundings witness, Normal-Stakes recovery and terminal/lifecycle/deletion rows where a row requires them. Record the exact source archive bytes and all 14 family counts, serialized row bytes and digests, account/generation/run IDs, every campaign head/revision, address/artifact/publication/generation IDs and complete retained artifact set **before** injecting any fault. Mount the default `main.tsx` App on the test origin; label owner-built content synthetic and never claim its reachability as new D1/D2 evidence.
- Each fault uses an independently cloned disposable graph or an exact restored starting archive. For precommit failure require the prior complete graph, head, address, account, witness and immutable-history digests after close/reopen/restart, without a success notice. For a committed publication with pending consumer, require exactly one retained pending publication and exact accepted artifact, then exact-once consumer completion or an honest blocked posture followed by selected Retry; never silently treat pending as completed. Record attempted operation, fault mode and ordinal, last good identities, post-fault identities, UI result and restart result. A true selected failure/graph change is the only basis for production repair.

## Fixed rows

| Row | Injection and required result |
| --- | --- |
| D3-P1 | Descendant publication quota before first write and abort after first queued write: no new accepted authority; exact prior graph after restart. |
| D3-P2 | Descendant publication quota/abort at middle and last publication writes: each rolls back all stores, exact prior graph after restart. |
| D3-P3 | Commit descendant source, then quota/abort at first, middle and last pending account-consumer writes: one exact pending recovery and immutable artifact survive; account consumer is absent or already exact; restart/Retry completes at most once without minting a new head. |
| D3-P4 | Repeat first and descendant pending-consumer quota/abort with a Soundings-bearing source: witness/provenance remains exact; no partial account or false selected success. |
| D3-S1 | Mounted default App displays publication failure as blocked, retains Save/Quick Save intent and offers Retry. A separate postcommit pending-consumer failure shows blocked/Retry, then exact head/address/account/witness readback across full-page restart. |
| D4-T1 | Terminal publication quota/abort at first, middle and last injectable writes: prior live head/address/account exact after restart. |
| D4-T2 | Terminal settlement/closure quota/abort at first, middle and last injectable writes after accepted terminal publication: one pending terminal receipt survives, no false open/closed posture; restart/Retry settles once. |
| D4-L1 | Account reset/delete and address deletion quota/abort at first, middle and last injectable writes on independent disposable mixed-owner graphs: no partial lifecycle tombstone, address receipt, generation or surviving-account change. Exact durable retry only for an actually accepted command. |
| D4-W1 | Soundings witness first/middle/last quota/abort on independent mixed-owner graphs: no partial witness or corrupted provenance; exact accepted source and other owners survive restart. |
| D5-E1 | Consistent grown-source export succeeds; injected read fault fails without partial downloadable success or source mutation; subsequent exact export succeeds. |
| D5-E2 | At 64 MiB input boundary, a byte-correct in-cap archive is handled according to valid graph authority; an over-cap archive rejects before any target write. Do not mislabel padding/corruption as a valid graph success. |
| D5-I1 | Empty-target import abort and quota at first, middle and last family-row writes: target remains empty after restart, never partial; complete import remains possible afterward. |
| D5-I2 | Occupied-target import refuses without merge; successful complete restore has all fourteen source family digests, selected sign-in/load/restart, and a second selected backup that preserves accepted history. |
| D6-P1 | Record browser/origin `navigator.storage.estimate()` usage/quota and `persisted()` before and after `persist()`; record support, grant/denial and exceptions verbatim as nonsecret status, without inferring database size or eviction safety. |
| D6-R1 | A user-held off-browser selected G10C archive restores to a new isolated origin after safe origin-loss simulation, with selected login, non-head and mixed-history load/restart and complete archive graph comparison. Do not clear site/user data or call the simulation actual eviction. |
| D6-E1 | Audit pre-existing G10/G10D authority for whether involuntary browser eviction itself is a mandatory reproducible event. If unsafe or not reproducible, record exact browser/environment limitation, what was and was not observed, recovery contract and gate disposition. Do not claim observed eviction from `persisted()=false` or simulation. |

## Stop, validation and routing

Stop the affected row on a real accepted graph change or selected operation failure and record the last good/attempted state before any bounded repair. Independent older G10B/G10C assertions are support only. Run focused owner/selected/browser checks, Node UI-config typecheck, app-local Vite build, broad diagnostic delta, built-client/mirror and diff checks, branch/PR review, then commit/push/hosted readback. Do not install G10E or accept G10D overall while any mandatory row is open. No activation, deployment, site/user data clear, DEV/Game acceptance, `GAME_VERSION` change or held-branch integration.
