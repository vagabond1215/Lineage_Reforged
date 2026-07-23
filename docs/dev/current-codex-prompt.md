# Current Codex Prompt

## Run Identity

`Normal Stakes Defeat Fallback And Recovery Receipt Acceptance Decision`

Run classification: unversioned documentation-only acceptance and contract decision

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(health): accept normal defeat fallback and recovery receipt`

## Purpose

Convert the completed repository audit into one durable, decision-complete authority for the first Normal Stakes defeat fallback and recovery receipt.

This run must accept the smallest coherent nonterminal fallback needed before campaign-rules runtime migration while preserving the separation between:

1. ordinary in-session Normal Stakes defeat;
2. one-time repair of an active legacy HP-zero save;
3. explicit terminal retirement or later actual death;
4. future restricted-Stakes continuity saving and terminal closure;
5. later injury, trauma, anatomy, magical restoration, and resurrection systems.

This run is documentation-only. It does not implement runtime, shared types, schemas, saves, migrations, combat, health, injury, trauma, treatment, magic, resurrection, UI, tests, content, balance, or gameplay.

## Required Source State

Read first and treat as controlling where older documents overlap:

- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`;
- `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`;
- `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `AGENTS.md`;
- `README.md`.

Also inspect only as needed to verify the accepted live seams:

- `apps/rpg-ui/src/App.tsx`;
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`;
- current save-manager and run-entry ownership;
- current combat encounter cleanup and player-resource synchronization;
- current account history, achievement, estate, Chronicle, and Legacy payout ownership;
- current location, settlement, travel, rest, and campaign-start facts;
- focused lifecycle, save, combat, and travel tests;
- tracked TypeScript/JavaScript mirrors.

The completed audit commit is:

`aa4ccfeceec023c676c98c4bf5a68216b0017263`

The temporary audit blob is:

`ad5b66157f61e25223e2abd7b2a7f4ef560366e3`

The accepted campaign-rules decision commit is:

`764f7ef5e4028e82fc76af6ae0381cc1eab00e20`

## Execution Gate

1. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state.
2. Confirm this is the active prompt.
3. Confirm commits `764f7ef5e4028e82fc76af6ae0381cc1eab00e20` and `aa4ccfeceec023c676c98c4bf5a68216b0017263` are ancestors of `HEAD`.
4. Confirm the temporary audit resolves to blob `ad5b66157f61e25223e2abd7b2a7f4ef560366e3` and is unmodified in the worktree.
5. Confirm the held `Version 0.6.6` prompt still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
6. Preserve unrelated work.
7. If live repository facts materially contradict the completed audit or an accepted authority, do not infer a repair. Record the contradiction in `docs/dev/current-codex-output.md`, do not create the durable decision, and stop.

## Accepted Invariants

The following are not open recommendations.

### Normal Stakes And Terminal Separation

1. `normal_stakes` is the only accepted initial Stakes identity.
2. Ordinary HP zero is defeat or incapacitation, not implicit actual death.
3. Ordinary HP zero must not archive the run, delete saves, settle terminal Prestige or Legacy, deposit an estate, prove permanent death, or retire the character.
4. `archiveActiveRun` may be reached only through a separately accepted explicit terminal result such as retirement or a later actual-death contract.
5. Runtime campaign-rules migration cannot ship while ordinary HP zero still triggers archival and save deletion.
6. Existing archived or deleted account-history records remain blocked and must never be reopened by defeat repair.
7. Historical `dead` and `hardcore_dead` records remain historical truth.

### Save-Topology Separation

8. Normal Stakes preserves the existing ordinary manual-save and quick-save topology until a later save-owner decision changes it.
9. A newly resolved ordinary defeat during play does not force an autosave or checkpoint.
10. Ordinary defeat produces an authoritative in-memory session state, marks the session unsaved through existing behavior, and remains subject to the player’s ordinary manual save, quick save, return-without-saving, and earlier-save loading choices.
11. A one-time repair write for an already persisted active legacy HP-zero save is a migration operation, not a new ordinary-defeat autosave rule.
12. Future restricted-Stakes continuity saving, no-rollback behavior, and terminal closure must not be imported into Normal Stakes by inference.

### Defeat Consequences

13. The generic fallback must be deterministic, nonterminal, idempotent, explainable, and capable of restoring playability.
14. The generic fallback does not automatically create injury, `Shaken Spirit`, capture, item loss, currency loss, equipment loss, companion loss, permanent impairment, or magical consequences.
15. Injury, trauma, capture, law, quest, rescue, loss, and permanent harm remain optional context-owned extensions.
16. The first fallback must not require the full injury, trauma, immutable-base/current-attribute, anatomy, magical-restoration, or resurrection packages.
17. Restricted-Stakes terminal closure remains irreversible.

## Decision 1: Authoritative Defeat Receipt

Accept one engine-owned Normal Stakes defeat result and receipt boundary.

The durable decision must require conceptually:

- a stable defeat receipt id or idempotency key;
- the player/run identity;
- campaign-rules version and `normal_stakes` identity;
- source kind and source receipt/event/revision identity where available;
- a safe explicit `unknown_or_legacy` source posture when the cause is not typed;
- the causing authoritative tick or equivalent ordering fact;
- pre-resolution HP-zero truth;
- encounter cleanup disposition;
- recovery destination and destination provenance;
- bounded time-advance disposition;
- HP, Stamina, MP, and body-state recovery disposition;
- party and transient-binding disposition;
- context-adapter identity when one supplied an outcome;
- Chronicle and notice projection facts;
- recovery-pending or playable completion state;
- consumed/applied evidence sufficient to prevent duplicate resolution.

Do not prescribe an exact hash formula, field names, storage nesting, numeric values, or serialization version in this decision. Those belong to the later implementation prompt after the contract is accepted.

The receipt is authoritative defeat truth. UI notices, Chronicle text, account projections, and save metadata are projections and must not author or independently reinterpret the result.

## Decision 2: Default Fallback Sequence

Accept this smallest generic fallback when no context owner provides a specific result:

```text
HP reaches zero
  -> resolve one Normal Stakes defeat receipt
  -> finish or clear the active encounter and transient combat bindings
  -> resolve a deterministic recovery destination
  -> advance one bounded deterministic recovery interval
  -> restore bounded HP and Stamina sufficient to resume play
  -> preserve MP and body state by default
  -> preserve inventory, equipment, currency, quests, party membership,
     injury state, trauma state, and immutable character truth
  -> produce one explanatory notice and one Chronicle projection
  -> return a playable unsaved in-session snapshot
```

Accept these qualitative resource rules:

- HP must become positive and sufficient to avoid an immediate zero-value loop;
- Stamina must become sufficient for at least one ordinary basic movement or action supported by the current game;
- MP is preserved unchanged by the generic fallback;
- body state, nutrition state, fatigue, and structural state are preserved unchanged by the first generic fallback;
- no generic recovery debt, injury, trauma, item loss, currency loss, or hidden penalty is added in the first package;
- exact time, HP, and Stamina constants remain deferred to the implementation prompt and must be selected from live clock/resource scales rather than invented independently.

## Decision 3: Recovery Destination And `recovery_pending`

Accept this target destination order:

1. an explicit context-owned recovery destination;
2. the current location when it is already a validated safe recovery settlement;
3. a persisted last-safe recovery location when a later accepted owner exists;
4. the campaign-start settlement;
5. a nonterminal `recovery_pending` state when no destination validates.

For the first implementation package, do not require inventing a new last-safe-location system. Its minimum chain is:

1. explicit context destination;
2. current validated safe recovery settlement;
3. campaign-start settlement;
4. `recovery_pending`.

The durable decision must require:

- no random destination selection;
- no inferred nearest-settlement geometry without an accepted owner;
- no silent teleport lacking destination provenance;
- no archival, payout, estate deposit, or save deletion when destination resolution fails;
- a clear diagnostic and retained defeat receipt in `recovery_pending`;
- ordinary gameplay blocked while `recovery_pending` is unresolved;
- a deterministic repair path owned by a later implementation/repair surface;
- no conversion of `recovery_pending` into a permanent unusable or terminal run.

## Decision 4: Loop Protection

Accept structural loop protection rather than a new generic invulnerability effect.

The decision must require:

- one source receipt or HP-zero transition can resolve at most once;
- a resolved encounter cannot remain active and continue applying damage;
- transient combat-to-party bindings are cleared consistently;
- a recovery destination must satisfy the accepted safe-location predicate or resolution enters `recovery_pending`;
- the same defeat receipt cannot repeat relocation, time advancement, resource restoration, Chronicle output, or notice output;
- load/re-entry cannot reroll destination or recovery facts;
- the first package does not add a hidden immunity buff, arbitrary grace timer, or new combat status solely to mask an unsafe recovery destination.

## Decision 5: Ordinary Defeat Save Behavior

Accept this Normal Stakes behavior for defeats that occur during ordinary live play:

```text
causing mutation
  -> engine-owned defeat resolution
  -> accepted in-memory snapshot and receipt
  -> account/history/achievement projection from the resolved truth
  -> accepted-only UI application
  -> session remains unsaved until the player uses existing save behavior
```

The durable decision must state explicitly:

- no forced save, autosave, or checkpoint occurs merely because defeat resolved;
- existing manual and quick-save choices remain available;
- the player may still load an earlier save under Normal Stakes;
- returning to the menu without saving may discard the defeat result under the existing ordinary-save contract;
- this permissive rollback is intentional Normal Stakes behavior and not a defect;
- a later save-owner decision may change Normal Stakes saving only through a separate explicit authority.

## Decision 6: Active Legacy HP-Zero Save Repair

Accept an automatic one-time repair when loading an active legacy HP-zero save that has no archived or deleted account-history outcome.

The repair contract must require:

1. check blocked account-history outcomes first;
2. apply accepted campaign-rules/legacy-difficulty migration;
3. resolve the HP-zero snapshot through the deterministic Normal Stakes fallback;
4. write the repaired snapshot back to the same loaded slot only after the repair result is complete;
5. record migration/repair provenance and the stable defeat receipt;
6. show a visible explanation before play resumes;
7. keep the run active and grant no terminal payout, estate transfer, or archival result;
8. leave other save slots untouched;
9. if the same character has another active HP-zero slot, repair that slot only when it is separately loaded;
10. if the repair write fails, do not enter ordinary play, do not archive the run, and surface a recoverable storage diagnostic.

This same-slot repair write is accepted solely to prevent repeated migration on every load. It does not authorize automatic persistence for new defeats.

## Decision 7: Transaction Ordering And Idempotence

The durable decision must establish these ordering constraints without prescribing a premature generic transaction framework.

### Ordinary live defeat

```text
causing authoritative snapshot
  -> defeat resolver
  -> one accepted next snapshot and receipt
  -> account/history/achievement evaluation from resolved truth
  -> accepted-only UI application
```

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

Require that interruption, retry, reload, or duplicate application cannot:

- advance time twice;
- relocate twice;
- restore resources twice;
- emit multiple Chronicle records for one receipt;
- duplicate notices as authoritative events;
- settle terminal rewards;
- deposit estate assets;
- delete saves;
- create a second defeat receipt from the same source transition.

Do not require a repository-wide command bus, event dispatcher, replay service, or generic transaction framework in the first package.

## Decision 8: Chronicle And Notice Policy

Accept:

- one stable defeat receipt for every accepted fallback resolution;
- one immediate player-facing notice for every accepted fallback resolution;
- one Chronicle entry projected from that receipt in the first implementation;
- no separate UI-authored or Chronicle-authored defeat truth;
- later coalescing, filtering, or summary presentation may change how repeated defeats are displayed without changing the underlying receipts.

The Chronicle entry must remain descriptive. It must not claim injury, capture, loss, death, rescue actors, legal judgment, or other facts absent from the accepted receipt.

## Decision 9: Party And Companion Baseline

Accept the first-package baseline:

- preserve party membership and all current durable party metadata;
- clear transient encounter/combatant bindings consistently;
- do not create companion injury, trauma, separation, capture, death, inventory loss, or relationship consequences;
- do not claim that current party metadata constitutes a durable party-health system;
- later party-health or context adapters may add causal consequences through separate owner contracts.

## Decision 10: Context Adapters

The first atomic implementation needs only the deterministic generic fallback and a nullable context-outcome input seam. It does not need a live rescue, capture, surrender, law, or quest adapter.

Select a narrow explicit rescue/recovery-destination adapter as the first safe follow-up candidate because it can supply:

- a destination;
- an authored time interval;
- explanatory actors or institutions;
- optional later cost or relationship consequences through their own owners.

Do not implement or fully specify that adapter in this decision. Capture, surrender, law, and quest consequences remain later alternatives and must not be bundled into the first atomic package.

## Decision 11: First Atomic Implementation Boundary

Accept the future first implementation package as one atomic live-contract transition containing:

1. campaign-rules identity, defaults, provenance, typed compatibility overrides, and save migration already accepted by the campaign-rules decision;
2. engine-owned Normal Stakes defeat result and receipt;
3. explicit separation between nonterminal defeat and terminal archival;
4. deterministic recovery-location resolution and `recovery_pending`;
5. bounded time/resource fallback with the accepted qualitative policy;
6. structural loop protection and idempotence;
7. automatic same-slot repair for active legacy HP-zero saves;
8. ordinary manual/quick-save topology preservation for new defeats;
9. account/history/achievement, Chronicle, notice, and accepted-only UI projections;
10. focused lifecycle, combat, save/load, migration, travel/noncombat HP-zero, account, and TypeScript/JavaScript parity tests.

The package must not include:

- full physical-injury instances;
- `Shaken Spirit` runtime;
- immutable-base/current-attribute implementation except where independently authorized and strictly required;
- anatomy, body-region, prosthetic, treatment, complication, regrowth, resurrection, or restricted-Stakes runtime;
- Story or Grim availability;
- player-facing custom overrides;
- a generic command bus, delivery framework, replay service, or broad shell rewrite.

No release or primary version number is assigned by this decision.

## Injury, Trauma, Restoration, And Resurrection Disposition

Preserve the temporary audit as planning evidence for later owner-specific decisions.

This run must not consume or delete:

`docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`

Its named future consumers are:

1. naturally recoverable injury active-state and recovery contract;
2. `Shaken Spirit` trauma active-state and support contract;
3. anatomy, impairment, adaptation, and prosthetic ownership decision;
4. extraordinary magical restoration and regrowth decision;
5. Normal Stakes actual-death/resurrection decision, if later pursued.

The artifact may be deleted only after all durable findings needed by those consumers have been transferred into accepted focused authorities and exact source identity remains recorded in history or a durable disposition table.

## Required Durable Decision

Create:

`docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`

The decision must contain:

1. status, scope, authority precedence, and source identities;
2. accepted invariants;
3. authoritative defeat result/receipt boundary;
4. default fallback sequence;
5. qualitative time/resource policy;
6. recovery destination chain and first-package minimum chain;
7. `recovery_pending` contract;
8. loop-protection and idempotence rules;
9. ordinary Normal Stakes save behavior;
10. active legacy HP-zero same-slot repair behavior;
11. transaction ordering and partial-failure constraints;
12. Chronicle and notice policy;
13. party/companion baseline;
14. context-adapter posture and first follow-up candidate;
15. first atomic implementation boundary;
16. validation obligations;
17. temporary-audit disposition;
18. explicit deferred decisions and prohibited inferences.

The decision must be more specific than the campaign-rules decision for the generic fallback, receipt, save behavior, and legacy HP-zero repair. It must defer to the injury/restoration and restricted-Stakes decisions for their respective future domains.

## Validation Obligations For The Future Implementation

The durable decision must require tests proving at least:

- combat and noncombat HP zero resolve nonterminally under Normal Stakes;
- ordinary defeat does not archive the run, delete saves, settle Legacy/Prestige, or deposit an estate;
- explicit retirement remains terminal and unchanged;
- identical source/snapshot/context resolves the same receipt, destination, time, and resource facts;
- duplicate application cannot repeat any consequence or projection;
- encounter cleanup prevents continued damage from the resolved encounter;
- the first generic fallback creates no injury, trauma, capture, loss, or permanent harm;
- HP is positive and Stamina permits an ordinary basic action after recovery;
- MP and body state remain unchanged by the generic fallback;
- ordinary defeat creates no automatic save and remains discardable through existing return/load behavior;
- ordinary manual and quick saves remain usable after defeat;
- an active legacy HP-zero slot is repaired once, rewritten only in that slot, explained visibly, and enters play active;
- repair-write failure does not archive, delete, or enter play with an unpersisted repair;
- archived/deleted history remains blocked and cannot be reopened;
- `recovery_pending` is nonterminal, persisted for legacy repair where applicable, diagnostic, and repairable;
- one receipt yields one notice and one Chronicle entry;
- party membership is preserved while transient bindings clear;
- no restricted-Stakes continuity or terminal behavior is imported;
- TypeScript and tracked JavaScript mirrors remain synchronized;
- held `0.6.6` remains untouched and recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Required Output

On successful completion, modify exactly:

1. create `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
2. update `docs/dev/current-codex-output.md`.

Update `docs/dev/current-codex-output.md` with:

- source run identity;
- branch/start/end state;
- label class and milestone impact;
- exact changed paths;
- durable decision created;
- accepted fallback and receipt summary;
- ordinary-defeat versus legacy-repair save distinction;
- recovery-location and `recovery_pending` summary;
- transaction/idempotence summary;
- first atomic implementation boundary;
- validation obligations;
- temporary-audit retention and named consumers;
- held-route confirmation;
- checks run;
- exact remaining implementation-only decisions;
- next recommended route.

The next recommended route must be an explicit unversioned `0.6.6 Restoration And Baseline Confirmation` coordination gate, not a runtime implementation prompt. It must remain separate from this run and must not be installed by Codex here.

## Exact Remaining Implementation-Only Decisions

Do not reopen the accepted qualitative contract. Record these as later implementation details:

- exact defeat receipt field names and serialization nesting;
- exact deterministic id derivation;
- exact recovery time constant;
- exact HP and Stamina resume constants;
- exact safe-settlement predicate implementation;
- exact campaign-start settlement source when multiple historical fields exist;
- exact `recovery_pending` UI/repair surface;
- exact save-format/schema version and migration function names;
- exact test file paths and TypeScript/JavaScript mirror paths;
- exact first primary `0.6.x` implementation version after the static-content sequence and post-`0.6.7` route decisions.

## Forbidden Scope

Do not modify:

- this prompt;
- current GPT handoff;
- route register;
- roadmap;
- sequenced plan;
- continuity brief;
- backlog;
- accepted design authorities other than creating the new focused decision;
- the temporary audit;
- held `0.6.6`;
- retained `0.6.7` artifacts;
- runtime;
- shared types;
- schemas;
- saves;
- migrations;
- tests;
- UI;
- content;
- services;
- spells;
- generated files;
- package manifests;
- gameplay.

## Stop Conditions

Stop after the exact two documentation outputs.

Do not:

- implement defeat resolution;
- change HP-zero behavior;
- change save topology;
- add autosaving or checkpoints;
- repair an actual save;
- add campaign-rules runtime;
- add injury or trauma state;
- add anatomy, prosthetic, healing, treatment, regrowth, resurrection, or restricted-Stakes mechanics;
- select exact numeric balance values;
- create a modern psychiatric diagnosis list;
- make every defeat cause injury, trauma, capture, or loss;
- weaken terminal retirement or archived/deleted save blocking;
- restore `0.6.6`;
- alter `0.6.7` artifacts;
- create a follow-on implementation prompt;
- assign a release or primary version number;
- modify any path outside the exact allowed pair.

Report the ending commit, exact changed paths, repository state, and any contradiction that prevented completion.