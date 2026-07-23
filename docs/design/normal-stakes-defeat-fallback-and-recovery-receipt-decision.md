# Normal Stakes Defeat Fallback And Recovery Receipt Decision

Date: 2026-07-22

Status: accepted focused design authority; documentation only; implementation unauthorized

Scope: the first deterministic nonterminal Normal Stakes defeat fallback, its authoritative receipt, ordinary-save behavior, one-time active legacy HP-zero repair, and the atomic boundary required before campaign-rules runtime migration

## 1. Status, Scope, Precedence, And Sources

This decision accepts the smallest coherent fallback needed when player HP reaches zero under `normal_stakes` and no context owner supplies a more specific nonterminal outcome. It distinguishes ordinary in-session defeat, one-time migration repair of an active legacy HP-zero save, explicit terminal retirement or later actual death, future restricted-Stakes continuity, and later health/magic systems.

This decision is more specific than `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md` for:

- the generic Normal Stakes defeat fallback;
- authoritative defeat result and receipt identity;
- destination resolution and `recovery_pending`;
- qualitative time and resource recovery;
- loop protection and idempotence;
- ordinary defeat save behavior;
- active legacy HP-zero same-slot repair;
- Chronicle, notice, party, and context-adapter posture;
- the first atomic implementation boundary.

The campaign-rules decision remains controlling for canonical campaign identity, legacy difficulty mapping, availability, creation locks, Story posture, compatibility overrides, and campaign-rules migration.

`docs/design/injury-recovery-trauma-and-magical-restoration-decision.md` remains controlling for physical injury, `Shaken Spirit`, irreversible harm, restoration, and resurrection. This fallback does not instantiate those systems.

`docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md` remains controlling for future restricted-Stakes continuity saving, actual death, terminal closure, and death-time Prestige. Nothing here weakens that closure or imports its save topology into Normal Stakes.

Source identities:

- completed audit commit: `aa4ccfeceec023c676c98c4bf5a68216b0017263`;
- retained audit blob: `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`;
- accepted campaign-rules decision commit: `764f7ef5e4028e82fc76af6ae0381cc1eab00e20`;
- acceptance source review: `3b6eece79d8b359a43c1e8e6b886f27cf16316f5`;
- live `App.tsx`, run-lifecycle, and combat seams at the source review are byte-identical to the completed audit commit;
- held `Version 0.6.6` remains recoverable as blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## 2. Accepted Invariants

1. `normal_stakes` is the only accepted initial Stakes identity.
2. Ordinary HP zero means defeat or incapacitation, not implicit actual death.
3. Ordinary defeat does not archive the run, delete saves, settle terminal Prestige or Legacy, deposit an estate, prove permanent death, or retire the character.
4. `archiveActiveRun` is reachable only from a separately accepted explicit terminal result, such as retirement or a later actual-death contract.
5. Campaign-rules runtime migration cannot ship while ordinary HP zero still performs terminal archival and save deletion.
6. Archived or deleted account-history records remain blocked and cannot be reopened by migration or defeat repair.
7. Historical `dead` and `hardcore_dead` records remain historical truth.
8. Normal Stakes retains existing manual-save and quick-save topology until another save-owner decision explicitly changes it.
9. A new ordinary defeat does not force a save, autosave, or checkpoint.
10. A same-slot write for an already persisted active legacy HP-zero save is migration repair, not a new ordinary-defeat save rule.
11. The generic fallback is deterministic, nonterminal, idempotent, explainable, and restores playability or enters an explicitly repairable nonterminal state.
12. The generic fallback does not automatically create injury, `Shaken Spirit`, capture, item/currency/equipment loss, companion loss, permanent impairment, or magical consequences.
13. Context-owned extensions remain optional and causal.
14. The first fallback does not depend on full injury, trauma, immutable-base/current-attribute, anatomy, restoration, resurrection, Story, Grim, or restricted-Stakes packages.
15. Future restricted-Stakes terminal closure remains irreversible.

## 3. Authoritative Defeat Result And Receipt Boundary

One engine-owned Normal Stakes defeat resolver accepts the authoritative HP-zero snapshot plus an optional context outcome and produces one accepted next snapshot with one authoritative defeat result/receipt.

The receipt must conceptually preserve:

- a stable id or idempotency key;
- player and run identity;
- campaign-rules version and `normal_stakes` identity;
- source kind and source event, receipt, or revision identity when available;
- an explicit `unknown_or_legacy` posture when no typed cause exists;
- causing authoritative tick or equivalent ordering fact;
- pre-resolution HP-zero truth;
- encounter cleanup disposition;
- recovery destination and its provenance;
- bounded time-advance disposition;
- HP, Stamina, MP, and body-state recovery disposition;
- party-membership and transient-binding disposition;
- context-adapter identity when an adapter supplied the outcome;
- Chronicle and notice projection facts;
- playable completion or `recovery_pending`;
- consumed/applied evidence sufficient to prevent duplicate resolution.

The receipt is defeat truth. UI notices, Chronicle text, account projections, and save metadata may project it but cannot author, replace, or reinterpret it.

This authority does not prescribe exact field names, nesting, hash derivation, serialization version, or storage location.

## 4. Default Fallback Sequence

When no context owner supplies a specific result:

```text
authoritative HP reaches zero
  -> resolve one Normal Stakes defeat receipt
  -> finish or clear the active encounter and transient combat bindings
  -> resolve a deterministic recovery destination
  -> advance one bounded deterministic recovery interval
  -> restore bounded HP and Stamina sufficient to resume play
  -> preserve MP and body state
  -> preserve inventory, equipment, currency, quests, party membership,
     injury state, trauma state, and immutable character truth
  -> project one explanatory notice and one Chronicle entry
  -> return a playable unsaved in-session snapshot
```

If no valid destination exists, the same sequence ends in `recovery_pending` instead of ordinary play. It remains nonterminal.

The fallback does not infer rescue actors, capture, law, loss, injury, trauma, actual death, or magic from HP zero alone.

## 5. Qualitative Time And Resource Policy

- Advance exactly one bounded deterministic recovery interval for an applied fallback.
- HP becomes positive and high enough to avoid an immediate zero-value loop.
- Stamina becomes sufficient for at least one ordinary basic movement or action supported by the live game.
- MP remains unchanged.
- Body state, nutrition state, fatigue, and structural state remain unchanged.
- Inventory, equipment, currency, supplies, quests, party membership, injury state, trauma state, attributes, and immutable character truth remain unchanged unless an accepted context owner explicitly supplies a separate consequence.
- The generic fallback adds no recovery debt, injury, trauma, hidden penalty, item/currency loss, or permanent harm.

Exact time, HP, and Stamina constants are implementation-only decisions. They must be selected from live clock and resource scales rather than created as an independent balance system.

## 6. Recovery Destination Chain

The accepted complete destination order is:

1. explicit context-owned recovery destination;
2. current location when it is a validated safe recovery settlement;
3. persisted last-safe recovery location when a later accepted owner exists;
4. campaign-start settlement;
5. `recovery_pending` when no destination validates.

The first implementation package does not need a new last-safe-location system. Its minimum chain is:

1. explicit context destination;
2. current validated safe recovery settlement;
3. campaign-start settlement;
4. `recovery_pending`.

Requirements:

- selection is deterministic;
- no random destination is allowed;
- no nearest-settlement geometry is inferred without an accepted owner;
- every relocation records destination provenance;
- an invalid destination cannot silently become a teleport;
- destination failure cannot archive the run, settle rewards, deposit an estate, or delete saves.

The exact safe-settlement predicate and campaign-start source are implementation details, but each must consume existing authoritative facts and be covered by migration tests.

## 7. `recovery_pending` Contract

`recovery_pending` is a nonterminal defeat-resolution state used only when the accepted destination chain cannot produce a valid recovery location or when a legacy repair cannot safely complete ordinary play.

It requires:

- the retained defeat receipt and all already-resolved deterministic facts;
- a clear diagnostic explaining why play cannot resume;
- ordinary gameplay blocked until repair completes;
- no archival, terminal payout, estate transfer, save deletion, or conversion to actual death;
- deterministic repair owned by the later implementation/repair surface;
- no reroll of destination, time, or recovery facts on retry or load;
- a guarantee that the run is repairable rather than permanently unusable.

For an active legacy save, a completed `recovery_pending` result is persisted to the loaded slot so the same migration does not repeat. For a new ordinary in-session defeat, existing Normal Stakes save behavior remains controlling; this decision creates no forced persistence.

## 8. Loop Protection And Idempotence

Loop protection is structural:

- one source receipt or HP-zero transition resolves at most once;
- a resolved encounter cannot remain active or continue applying damage;
- transient combat-to-party bindings clear consistently;
- a playable destination satisfies the accepted safe-location predicate;
- an unsafe or absent destination produces `recovery_pending`;
- the same receipt cannot repeat relocation, time advancement, HP/Stamina restoration, Chronicle output, or authoritative notice facts;
- load and re-entry cannot reroll the chosen destination or recovery facts;
- duplicate application detects the prior applied/consumed evidence and returns the already accepted result or a no-op projection;
- terminal account actions are absent from the defeat transaction.

The first package adds no generic invulnerability effect, grace timer, hidden immunity buff, or new combat status merely to conceal unsafe placement.

## 9. Ordinary Normal Stakes Save Behavior

For a defeat occurring during ordinary live play:

```text
causing authoritative snapshot
  -> engine-owned defeat resolution
  -> accepted in-memory snapshot and receipt
  -> account/history/achievement evaluation from resolved truth
  -> accepted-only UI application
  -> session remains unsaved
```

No save, autosave, or checkpoint occurs merely because defeat resolved. Existing manual save and quick save remain available. The player may load an earlier save. Returning to the menu without saving may discard the defeat result under the existing save contract.

This permissive rollback is intentional Normal Stakes behavior, not a defect. A future save-owner decision may change it only through separate explicit authority.

Account, history, achievement, Chronicle, notice, and UI projections cannot turn this nonterminal receipt into an archival record or terminal payout.

## 10. Active Legacy HP-Zero Same-Slot Repair

Loading an active legacy HP-zero save with no archived or deleted account-history outcome triggers one automatic repair:

1. check blocked account-history outcomes first;
2. reject ordinary play for archived or deleted history and preserve existing blocking behavior;
3. apply the accepted campaign-rules and legacy-difficulty migration;
4. resolve the HP-zero snapshot through the deterministic Normal Stakes fallback using typed source evidence or `unknown_or_legacy`;
5. write the completed repaired snapshot back to the same loaded slot;
6. record campaign migration, repair provenance, and the stable defeat receipt;
7. show a visible explanation before ordinary play resumes;
8. retain the run as active and grant no terminal payout, estate transfer, archival result, or save deletion.

Only the loaded slot is repaired. Other slots remain untouched. Another active HP-zero slot for the same character is repaired only when separately loaded.

The same-slot write exists solely to prevent repeated migration on every load. It does not authorize automatic persistence for newly occurring defeats.

If the repair write fails, do not enter ordinary play, archive the run, delete any slot, or claim the repair succeeded. Preserve recoverable source data and surface a storage diagnostic.

## 11. Transaction Ordering And Partial-Failure Constraints

### Ordinary live defeat

```text
causing authoritative snapshot
  -> defeat resolver
  -> one accepted next snapshot and receipt
  -> account/history/achievement evaluation from resolved truth
  -> accepted-only UI application
```

The in-memory state transition is accepted as one result. Because ordinary defeat does not force persistence, application interruption before the player's next ordinary save may discard it according to Normal Stakes.

### Legacy HP-zero load repair

```text
load slot
  -> block archived/deleted history
  -> migrate campaign rules
  -> resolve one defeat repair
  -> persist repaired same-slot snapshot
  -> evaluate/project active account and Chronicle truth
  -> enter play with visible repair notice
```

Persistence must complete before ordinary play. A failed write leaves the run recoverable and outside gameplay. Retry uses source/provenance evidence to avoid duplicate application.

Interruption, retry, reload, or duplicate application cannot:

- advance time or relocate twice;
- restore resources twice;
- create a second receipt for the same transition;
- emit multiple Chronicle records for one receipt;
- turn duplicate notices into authoritative events;
- settle terminal rewards;
- deposit estate assets;
- delete saves.

The first implementation does not require a repository-wide command bus, generic transaction framework, replay service, or broad event-delivery rewrite.

## 12. Chronicle And Notice Policy

Every accepted fallback produces:

- one stable defeat receipt;
- one immediate player-facing notice;
- one Chronicle entry projected from the receipt in the first implementation.

Notice and Chronicle generation are projections. They do not create defeat truth or independently mutate the result. Duplicate display rendering may occur as ordinary UI behavior, but it cannot create another authoritative notice event or Chronicle entry.

Chronicle language remains descriptive and limited to receipt facts. It cannot claim injury, trauma, capture, loss, death, rescue actors, legal judgment, magic, or another consequence not present in an accepted context result.

Later coalescing, filtering, or summary presentation may change how repeated defeats appear without altering the underlying receipts.

## 13. Party And Companion Baseline

The first package:

- preserves party membership and all current durable party metadata;
- clears transient encounter and combatant bindings consistently;
- creates no companion injury, trauma, separation, capture, death, inventory loss, or relationship consequence;
- does not misrepresent current party metadata as a durable party-health system.

Later party-health and context adapters may add causal consequences only through separate owner contracts.

## 14. Context Adapters

The first atomic implementation requires a nullable context-outcome input seam but no live rescue, capture, surrender, law, or quest adapter. If no accepted adapter answers, the generic fallback applies.

The first safe follow-up candidate is a narrow explicit rescue/recovery-destination adapter. It may later provide:

- a validated destination;
- an authored recovery interval;
- explanatory actors or institutions;
- optional cost or relationship inputs owned by their respective systems.

That adapter is not specified or implemented here. Capture, surrender, law, quest, loss, injury, and trauma remain later alternatives and cannot be bundled into the first package by inference.

## 15. First Atomic Implementation Boundary

The future first live package is one atomic contract transition containing:

1. accepted campaign-rules identity, defaults, provenance, typed compatibility overrides, and save migration;
2. the engine-owned Normal Stakes defeat result and receipt;
3. explicit separation of nonterminal defeat from terminal archival;
4. deterministic destination resolution and `recovery_pending`;
5. bounded time and resource fallback under the accepted qualitative policy;
6. structural loop protection and idempotence;
7. automatic same-slot repair for active legacy HP-zero saves;
8. preservation of ordinary manual/quick-save topology for new defeats;
9. account/history/achievement, Chronicle, notice, and accepted-only UI projections;
10. focused lifecycle, combat, save/load, migration, travel/noncombat HP-zero, account, and TypeScript/JavaScript parity tests.

The package must not include:

- full physical-injury instances or `Shaken Spirit` runtime;
- anatomy, body regions, prosthetics, treatment, complications, regrowth, resurrection, or restricted-Stakes runtime;
- immutable-base/current-attribute implementation unless independently authorized and strictly required;
- Story or Grim availability;
- player-facing custom overrides;
- a generic command bus, delivery framework, replay service, or broad shell rewrite.

Campaign identity must not become live while ordinary HP zero can still archive and delete saves. No release or primary version is assigned here.

## 16. Validation Obligations

Future implementation must prove:

- combat and noncombat HP zero resolve nonterminally under Normal Stakes;
- ordinary defeat does not archive, delete saves, settle Prestige/Legacy, or deposit an estate;
- explicit retirement remains terminal and otherwise unchanged;
- identical source, snapshot, and context produces identical receipt, destination, time, and resource facts;
- duplicate application repeats no consequence or authoritative projection;
- encounter cleanup prevents continued damage from the resolved encounter;
- the generic fallback creates no injury, `Shaken Spirit`, capture, loss, or permanent harm;
- HP is positive and Stamina permits one ordinary basic movement/action after playable recovery;
- MP and body state remain unchanged;
- ordinary defeat creates no automatic save and may be discarded through existing return/load behavior;
- manual and quick saves remain usable after ordinary defeat;
- one active legacy HP-zero slot is repaired once, rewritten only in that slot, visibly explained, and enters play active;
- another slot is untouched until separately loaded;
- repair-write failure does not archive, delete, or enter ordinary play with an unpersisted repair;
- archived/deleted history remains blocked and cannot be reopened;
- `recovery_pending` is nonterminal, diagnostic, repairable, and persisted for legacy repair where applicable;
- one receipt yields one authoritative notice fact and one Chronicle entry;
- party membership persists while transient bindings clear;
- no restricted-Stakes continuity or terminal behavior is imported;
- tracked TypeScript and JavaScript mirrors remain synchronized;
- held `0.6.6` remains untouched and recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## 17. Temporary Audit Disposition

Retain:

`docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`

It remains planning evidence at commit `aa4ccfeceec023c676c98c4bf5a68216b0017263` and blob `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`.

Named future consumers:

1. naturally recoverable injury active-state and recovery contract;
2. `Shaken Spirit` trauma active-state and support contract;
3. anatomy, impairment, adaptation, and prosthetic ownership decision;
4. extraordinary magical restoration and regrowth decision;
5. Normal Stakes actual-death/resurrection decision, if pursued.

The artifact may be removed only after every needed finding has transferred to those focused authorities and its exact source identity remains recorded in history or a durable disposition table. This decision consumes only its defeat-fallback, receipt, save, repair, party-baseline, and first-package findings.

## 18. Deferred Decisions And Prohibited Inferences

Implementation-only details remain deferred:

- exact receipt field names and serialization nesting;
- exact deterministic id derivation;
- exact recovery time constant;
- exact HP and Stamina resume constants;
- exact safe-settlement predicate;
- exact campaign-start settlement source when historical fields differ;
- exact `recovery_pending` UI and repair surface;
- exact save-format/schema version and migration function names;
- exact test paths and TypeScript/JavaScript mirror paths;
- exact first primary `0.6.x` implementation version after the static-content sequence and post-`0.6.7` route decisions.

This decision does not authorize or imply:

- runtime, shared-type, schema, save, migration, combat, UI, test, content, balance, or gameplay changes;
- forced saving, autosaving, checkpoints, or restricted-Stakes continuity under Normal Stakes;
- repair of any actual save during this run;
- injury, `Shaken Spirit`, capture, loss, impairment, anatomy, prosthetic, treatment, complication, healing, regrowth, resurrection, or magic behavior;
- a terminal outcome from ordinary HP zero;
- reopening an archived or deleted record;
- a new restricted-Stakes id or weakening of its terminal closure;
- Story, Grim, or custom-override availability;
- a broad command bus or shell rewrite;
- exact numeric balance;
- a release or primary version number;
- restoration of held `0.6.6` or modification of retained `0.6.7` artifacts;
- a follow-on runtime implementation prompt.

The next route is a separate unversioned `0.6.6 Restoration And Baseline Confirmation` coordination gate. It is not installed by this decision.
