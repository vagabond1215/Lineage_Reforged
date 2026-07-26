# Current GPT Handoff

Date: 2026-07-25

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- `Checkpoint Commitment, Mortal Crisis Sequence, Resurrection Aftereffects, Final Closure, And Stakes Authority Revision` is complete and controlling.
- The controlling artifact is `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md`, blob `615c5da8f9bf2c7ef210a44227bdcbb1f5f89a78`.
- The completed authority revision was committed at `b55b9d5e2656d62644251c289038aa19f5eebe7f`.
- The active route is the documentation-only `Stakes Identity, Campaign/Save Provenance, Checkpoint Topology, And Technical-Recovery Contract Decision`.
- The active route does not authorize runtime, shared types, schemas, persistence, migrations, UI, tests, content, dependencies, balance, or gameplay implementation.

## Most Specific Accepted Authorities

Use these in precedence order for affected seams:

1. `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md` for public Stakes identities, load/commitment/recovery separation, Mortal Crisis, actual/final death, body/restoration eligibility, convalescence, closure, settlement, and succession ordering.
2. `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md` for event-time evidence, observer projection, deterministic realization, validation, fallback, and downstream presentation.
3. `docs/design/elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md` for elemental identity, manifestation, temperament/disposition, stimuli, deterministic response, capability gates, and magical-entity aid.
4. `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md` for injury severity/recoverability, `Shaken Spirit`, normally irreversible harm, anatomical restoration, and immutable-base-attribute boundaries.
5. `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md` for the minimum generic Normal Stakes fallback when no context-specific Mortal Crisis result exists.
6. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md` for retained one-continuity, technical-recovery, read-only-history, and circumstance-sensitive Prestige details as narrowed and named by the newer authority.
7. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md` and `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md` for orthogonal axes, creation locks, legacy migration, Story/Grim boundaries, and production availability gates.

Newer focused decisions control conflicts through explicit retention and supersession. Temporary audits and research remain evidence, not authority.

## Final Public Stakes Taxonomy

Exactly three Stakes choices are accepted:

| Label | Machine id | Load and commitment | Death and finality |
| --- | --- | --- | --- |
| Normal Stakes | `normal_stakes` | ordinary manual/quick saves; broad selected rollback; no general event commitment | may permit restoration-eligible actual death; earlier valid saves may abandon the later timeline |
| Committed Stakes | `committed_stakes` | qualifying checkpoints only; checkpoint-selected rollback; named uncertain outcomes remain committed across materially identical replay | may permit restoration-eligible actual death; final closure atomically retires the prior checkpoint ladder |
| Ironbound Stakes | `ironbound_stakes` | one authoritative continuity; no selected rollback; committed outcomes | accepted actual death is immediately final and closes the character atomically; no resurrection afterward |

`Ironbound` is the accepted final restricted-Stakes label. `Committed` is a distinct checkpoint tier, not merely fewer saves. `Mortal` remains a Difficulty label. Legacy `hardcore`, `hardcore_stakes`, historical `dead`/`hardcore_dead`, and combat-profile `hardcore` do not become Stakes identities.

The ids are canon but remain unavailable in production until their owner policies, persistence, migrations, warnings, recovery behavior, and tests exist.

## Accepted Save, Commitment, And Finality Boundaries

- Load topology, event commitment, and technical recovery are separate authorities.
- Normal retains ordinary manual/quick saving and permissive rollback.
- Committed exposes only qualifying retained checkpoints.
- Ironbound exposes only continuation from the latest authoritative state.
- Committed and Ironbound require stable occurrence identity and named uncertainty channels or an equivalent causal identity; one global ordered random stream is rejected.
- Technical recovery restores the latest verified authoritative state after persistence failure and is never a favorable-state selector in Committed or Ironbound.
- Normal and Committed may retain deterministic restoration eligibility after actual death.
- Ironbound collapses actual death, final death, and terminal character closure into one atomic transaction.
- Prestige, estate, terminal Chronicle, irreversible account rewards, achievements, and successor control settle only after authoritative final closure.

## Accepted Mortal Crisis Boundary

```text
functional state
  active | downed | unconscious

lethal processes
  zero or more independently owned progressing conditions

care requirement
  none | basic stabilization | professional care | exceptional magic

life state
  alive | actually dead but restoration-eligible | final death

derived presentation
  stable | unstable | aid required | resurrection possible | closure imminent
```

The six accepted phases are:

1. Threat Resolution;
2. Immediate Stabilization;
3. Extraction;
4. Transit;
5. Treatment Or Restoration;
6. Closure.

Mortal Crisis is an orchestrator and presentation framework. It does not own health, injury, lethal processes, party capability, inventory, routes, institutions, magic, body state, death, Stakes, Chronicle, or narrative truth.

## Live Save And Campaign Baseline

The active contract decision must inspect the current live system as migration input:

- `apps/rpg-ui/src/game-shell/state.ts`, blob `52bc7015a993c0852f8d427baabf58b5151d5ba2`, defines 128 manual slots plus one `quick-save`, with slot ids acting as UI/storage addresses.
- `apps/rpg-ui/src/game-shell/saveManager.ts`, blob `069010cff74b8d23f16f626b77e9f68bc91092f1`, stores one version-6 localStorage envelope per account/slot with account id, slot id, metadata, timestamp, and one serialized snapshot.
- `packages/shared/persistence/src/index.ts`, blob `ecdd486bc2fcf9fea8c045ee2a70849991d41fbf`, currently uses bare `JSON.stringify` and `JSON.parse`; it has no accepted integrity, transaction, journal, generation, checkpoint, or technical-recovery contract.
- `packages/engines/game-engine/src/save-snapshot.ts`, blob `3989297047e0ca2f15208375039e124069f9c50c`, captures account id, snapshot version, tick, clock, game, player, world, civilization, and session state but no accepted campaign, continuity, checkpoint, generation, policy, branch, or correction identity.
- `packages/shared/types/src/contracts.ts`, blob `5534d83cd70ceb2127175fe45482262d0cdfb4bc`, contains current save/account/run-history types, optional legacy `sourceRunId`, slot lists, account payouts, estate and Prestige transactions, but no accepted target Stakes registry or save-provenance graph.
- `packages/engines/player-engine/src/difficulty.ts`, blob `a34f000f938f53b2d43990a2f87fefcddb86e5ca`, still owns legacy `easy | normal | hard | brutal` plus a Boolean `hardcore`; it is migration input, not the accepted campaign-rules target.
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`, blob `ec67c0ec8b4955bd54808c9eef4674858792085e`, still infers `dead`/`hardcore_dead` from HP zero and performs broad archival, payout, estate, account-history, and save-deletion work; this is a known implementation gap and not controlling authority.

A slot id, localStorage key, snapshot version, character id, account-history record, legacy `sourceRunId`, or legacy difficulty flag must not silently become the new campaign, continuity, checkpoint, or technical-recovery identity.

## Active Contract Decision

The active route must decide the smallest durable conceptual contract for:

1. the three-id Stakes policy registry and semantic versioning;
2. canonical campaign, character, continuity/timeline, save artifact, checkpoint, write generation, and correction identities;
3. the distinction between a storage address and an authoritative state identity;
4. the authoritative campaign/save provenance carried by every tier;
5. Normal slot topology and branch/timeline abandonment;
6. Committed checkpoint qualification, creation, selection, retention posture, and retirement at final closure;
7. Ironbound one-continuity posture and hidden verified recovery generations;
8. technical recovery, latest-verified selection, partial-write safety, and correction provenance;
9. account-profile and save-artifact transaction ordering without making projections authoritative;
10. legacy and current-save migration exclusively into Normal unless the player creates a new eligible campaign;
11. copied-slot, copied-save, stale-generation, closed-character, and duplicate-settlement protection;
12. exact boundaries with the later occurrence/uncertainty commitment contract.

The decision must not implement fields, types, storage, hashes, journals, migrations, UI, or tests. It must inspect live seams and accept conceptual contracts sufficient for the first later implementation package.

## Required Source Identities For The Active Route

- completed Mortal Crisis/Stakes authority commit: `b55b9d5e2656d62644251c289038aa19f5eebe7f`;
- controlling authority artifact blob: `615c5da8f9bf2c7ef210a44227bdcbb1f5f89a78`;
- pre-contract current output blob: `7ee5aaf7ad95266834ba8273a2b238f048f2adde`;
- campaign-rules decision blob: `20e72fb280fd67351135e195f75195a592bce9c9`;
- Normal Stakes fallback decision blob: `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`;
- restricted-Stakes decision blob: `e1d2ec6b087eb9be7f9222763e25fee86c2f5329`;
- comparative mortality research blob: `26ce50958f348f316ab98bcafe31282393709fd6`;
- defeat/injury/restoration audit blob: `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`;
- held `0.6.6` prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Expected Route After The Active Decision

If the contract decision completes without a new contradiction, the next route should be the documentation-only:

`Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`

That later route should consume the accepted campaign/save/checkpoint provenance contract before defining replay equivalence and committed uncertain results. It must not be merged into the active save-side decision unless the live repository proves the boundaries cannot be separated.

## Temporary Evidence And Held Routes

- Retain comparative mortality research through checkpoint, commitment, crisis, resurrection, settlement, and succession implementation consumers.
- Retain the defeat/injury audit through the first relevant runtime replacement/repair package.
- Retain narrative evidence through Mortal Crisis and narrative implementation consumers.
- Retain elemental evidence through remaining elemental implementations and any crisis-capability consumer.
- No temporary artifact should be deleted by the active decision.
- Held `0.6.6` remains untouched and byte-recoverable.
- Retained `0.6.7` artifacts remain untouched.
