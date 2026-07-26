# Current GPT Handoff

Date: 2026-07-25

## Status

- `Stakes Identity, Campaign/Save Provenance, Checkpoint Topology, And Technical-Recovery Contract Decision` is complete and controlling for save-side identity, topology, provenance, migration, write publication, copied-state protection, and technical recovery.
- Controlling save contract: `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`, blob `86f10b6fbdc4fc7fdce3f50673556930b9d35999`.
- The preceding Mortal Crisis/Stakes authority remains controlling for public Stakes semantics, Mortal Crisis, actual/final death, resurrection, closure, terminal settlement, and warnings.
- The active route is the documentation-only `Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`.
- Implementation remains unauthorized.
- Held `Version 0.6.6` remains paused and recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`; retained `0.6.7` remains unchanged.

## Most Specific Accepted Authorities

Use these in precedence order for affected seams:

1. `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md` for campaign-rules semantic version 2, Stakes policy revision 1, campaign/continuity/artifact identities, Normal branching, Committed checkpoint topology, Ironbound recovery generations, migration, publication ordering, and copied-state protection.
2. `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md` for Normal/Committed/Ironbound gameplay semantics, commitment posture, Mortal Crisis, actual/final death, resurrection, convalescence, closure, and settlement/succession ordering.
3. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md` for orthogonal Difficulty, World Rules, and Stakes axes, creation locks, Story/Grim boundaries, and legacy campaign mapping where not superseded.
4. `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md` for the minimum Normal defeat fallback and active legacy HP-zero same-address repair.
5. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md` for retained Ironbound continuity, read-only history, and circumstance-sensitive Prestige details as narrowed by newer authorities.
6. Narrative, elemental, injury/restoration, combat, quest/event/Chronicle, and domain-specific decisions for their unchanged ownership boundaries.

Temporary audits and research are evidence, not authority. Live code remains implementation and migration evidence.

## Accepted Campaign And Save Contract

```text
campaign-rules semantic version 2
Stakes policy revision 1

Normal Stakes     -> normal_stakes
Committed Stakes  -> committed_stakes
Ironbound Stakes  -> ironbound_stakes
```

Canonical vocabulary:

- `campaign` is the durable playable world/history identity;
- `continuity` is one authoritative or selected causal history within a campaign;
- `run` is a compatibility/account-history term;
- `timeline` is descriptive continuity-lineage language.

```text
account
  -> campaign
       -> continuity
            -> character identities
            -> continuation head
            -> save artifacts / selectable checkpoints
            -> hidden write / recovery generations
            -> correction and supersession lineage
       -> closure, checkpoint retirement, and consumed-value authority
```

Storage addresses, artifacts, snapshots, checkpoints, continuation heads, write generations, recovery generations, corrections, and closure identities remain distinct.

## Accepted Per-Tier Topology

### Normal

- Ordinary manual and quick-save artifacts remain available.
- Loading an older artifact does not immediately fork.
- The first accepted gameplay mutation after loading a non-head artifact creates one child continuity.
- Abandoned later continuity state cannot newly post durable closure, estate, achievement, reward, or successor value.
- Copied bytes or a new address do not mint identity or entitlement.
- Normal has no general outcome-commitment policy, but narrower already-authoritative results remain binding.

### Committed

```text
continuation head
  -> ordinary resume

qualified checkpoints
  -> only selectable rollback

hidden verified generations
  -> technical recovery only
```

- Save-and-exit may persist the continuation head but cannot create a checkpoint.
- Minimum qualifying checkpoint classes are campaign start, completed qualifying major sleep/secure rest, and an owner-registered authored milestone or transition.
- Selecting an earlier checkpoint creates a child continuity only at the first accepted gameplay mutation.
- Final closure retires the complete checkpoint ladder before terminal settlement.

### Ironbound

- One player-continuable head.
- No player-selected historical state and no player-created fork.
- Hidden prior verified generations exist only for technical recovery.
- Accepted actual death, final death, and closure remain atomic.
- A copied or older generation cannot reopen verified terminal closure.

## Technical Recovery And Publication

Accepted order:

```text
prepare candidate
  -> validate identity, policy, source, and snapshot
  -> durably write candidate generation
  -> verify generation
  -> publish artifact or continuation head
  -> verify publication
  -> retain or retire the previous verified generation
  -> update indexes, account projections, and UI idempotently
```

Technical recovery selects the newest verified compatible generation inside the same account, campaign, continuity, policy, and closure boundary. It is not player rollback, correction, resurrection, or favorable-state selection.

## Live Occurrence And Randomness Baseline

The active occurrence contract must inspect and classify at least:

- `GameEventEnvelope` and `packages/shared/events/src/index.ts`, where generic event ids currently use `type:domain:tick` and therefore cannot distinguish repeated same-type, same-domain events at one tick;
- domain-specific event constructors and inline event ids in travel, quest acceptance/tracking, activity selection, combat, resources, world/spawn, and related engines;
- `TickContextBase.seed` and current domain-specific deterministic selection;
- spawn resolution’s ad hoc `seed + tick + profile + region` and `profile + tick + seed + encounter` hashes;
- direct `Math.random` uses that are outside authoritative gameplay or need explicit classification;
- account, save, checkpoint, closure, correction, Chronicle, and downstream consequence receipts.

These are migration facts, not accepted final occurrence, channel, draw, or algorithm contracts.

## Active Route Requirements

The active run must decide conceptually:

- occurrence identity and same-tick uniqueness;
- parent/source occurrence, causal scope, simultaneity, ordering, and material-input normalization;
- deterministic result receipts versus uncertain result receipts;
- named uncertainty-channel identity and ownership;
- committed result identity for Committed and Ironbound;
- the boundary for Normal owner-specific commitments;
- materially identical replay and material-change rules;
- correction authority, reason, evidence, supersession, replay, and consequence reconciliation;
- idempotent consumption by injury, body, Chronicle, closure, settlement, rewards, achievements, estate, succession, narrative, and other owners;
- privacy and presentation boundaries for seeds, channels, draws, and validator-only facts;
- migration classification of current event ids, seeds, hashes, and ad hoc deterministic mechanisms.

The run must not select RNG algorithms, hash functions, exact seeds, schemas, package paths, dependencies, persistence layouts, content, probabilities, balance, or runtime implementation.

## Known Live Gaps

- Generic `createEvent` ids can collide for repeated same-type, same-domain events at the same tick.
- Same-tick occurrence uniqueness and simultaneity are not authoritative.
- Randomness and deterministic selection are domain-local and inconsistently identified.
- There is no accepted named uncertainty-channel registry, result receipt, replay-equivalence contract, or correction owner graph.
- Current HP-zero archival and nontransactional save/account projection ordering remain implementation defects, not target authority.
- Normal branch-finalization and provisional durable-value mechanics remain a later focused settlement/branch contract.
- Cross-device/cloud/offline conflict and anti-tamper policy remain later architecture work.

## Temporary Evidence And Held Routes

- Retain comparative mortality research through checkpoint, commitment, Mortal Crisis, resurrection, settlement, and succession implementation consumers.
- Retain the defeat/injury audit through the first relevant runtime repair.
- Retain narrative evidence through narrative and Mortal Crisis consumers.
- Retain elemental evidence through elemental implementations and crisis-capability consumers.
- Preserve the completed Mortal Crisis/Stakes and save/Stakes decisions permanently as controlling authorities.
- Do not restore or regenerate held `0.6.6`.

## Next Route

Run the active documentation-only:

`Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`

No implementation route is active.