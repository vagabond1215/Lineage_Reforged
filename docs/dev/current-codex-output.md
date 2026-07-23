# Current Codex Output

Source version/run: Normal Stakes Defeat Fallback And Recovery Receipt Acceptance Decision

Date: 2026-07-22

Branch/status assumption: `master`; starting and ending commit before documentation edits `3b6eece79d8b359a43c1e8e6b886f27cf16316f5`; clean starting worktree; fetch/prune and fast-forward pull reported already up to date; successful run ends with exactly the two authorized documentation changes below

Label class and parent: unversioned documentation-only acceptance and contract decision; no parent version

Milestone impact: `supports_current_band`

Status: focused contract accepted; implementation remains unauthorized

## Files Changed

- created `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- updated `docs/dev/current-codex-output.md`.

## Durable Decision Created

`docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md` is now the most specific authority for the generic Normal Stakes fallback, defeat receipt, ordinary-save behavior, active legacy HP-zero repair, destination failure, idempotence, and the first atomic implementation boundary.

It defers campaign identity and migration mapping to the campaign-rules decision, injury/trauma/restoration/resurrection to their focused decision, and future restricted-Stakes continuity and terminal closure to the restricted-Stakes decision.

## Accepted Fallback And Receipt

One engine-owned resolver consumes the authoritative HP-zero snapshot and optional context outcome, then returns one accepted next snapshot with one stable defeat receipt. The receipt preserves run/player/rules/source identity, ordering, pre-resolution HP-zero truth, encounter cleanup, destination provenance, time/resource dispositions, party/transient-binding handling, context identity, projection facts, completion state, and consumed/applied evidence.

The generic sequence clears the encounter and transient bindings, chooses a deterministic destination, advances one bounded interval, restores positive playable HP and sufficient Stamina for a basic action, preserves MP and body state, preserves durable character/party/quest/inventory truth, and projects one notice and Chronicle entry. It creates no default injury, `Shaken Spirit`, capture, loss, debt, permanent harm, or magic.

UI, Chronicle, account, and save metadata are projections; the defeat receipt is authoritative.

## Ordinary Defeat Versus Legacy Repair Saves

An ordinary in-session defeat does not force a save, autosave, or checkpoint. It produces an authoritative in-memory snapshot, remains subject to existing manual/quick save and load behavior, and may be discarded by returning without saving or loading an earlier Normal Stakes save. That rollback posture is intentional.

An active legacy HP-zero slot with no archived/deleted history receives one automatic migration repair when loaded. Blocked history is checked first; campaign rules are migrated; the deterministic fallback is applied; the completed repair and receipt are written to the same loaded slot before play; and a visible explanation is shown. Other slots remain untouched. A write failure blocks play and surfaces a recoverable storage diagnostic without archival or deletion.

The same-slot write is migration repair only and does not create an ordinary-defeat autosave rule.

## Recovery Destination And `recovery_pending`

The complete chain is explicit context destination, current validated safe recovery settlement, later persisted last-safe location, campaign-start settlement, then `recovery_pending`. The first package may omit last-safe-location infrastructure.

No random choice, inferred nearest-settlement geometry, silent teleport, archival, payout, estate transfer, or save deletion is allowed when destination resolution fails.

`recovery_pending` retains the defeat receipt and diagnostic, blocks ordinary gameplay, remains nonterminal and deterministically repairable, and cannot reroll destination or recovery facts.

## Transaction And Idempotence Summary

One source transition resolves at most once. A resolved encounter cannot continue damaging the player. The same receipt cannot repeat relocation, time advancement, resource restoration, Chronicle output, or authoritative notice facts.

Ordinary live defeat applies one in-memory result before account/history/achievement evaluation and accepted-only UI projection. Legacy repair blocks terminal history first, migrates and resolves, persists the same slot, then projects active truth and enters play. Retry, interruption, or reload cannot settle terminal rewards, deposit estate assets, delete saves, or produce a second receipt.

No repository-wide command bus, replay service, generic transaction framework, invulnerability effect, grace timer, or broad shell rewrite is accepted.

## First Atomic Implementation Boundary

The future atomic package contains campaign-rules identity/defaults/provenance/typed compatibility overrides/save migration; engine-owned defeat result/receipt; nonterminal-versus-terminal separation; destination resolution and `recovery_pending`; bounded time/resource fallback; structural idempotence; active legacy same-slot repair; ordinary save-topology preservation; account/Chronicle/notice/UI projections; and focused lifecycle, combat, save/load, migration, travel/noncombat HP-zero, account, and mirror-parity tests.

It excludes injury, `Shaken Spirit`, anatomy, body regions, prosthetics, treatment, complications, regrowth, resurrection, restricted Stakes, Story/Grim availability, player custom overrides, and broad infrastructure. No primary or release version is assigned.

## Validation Obligations

Future tests must prove nonterminal combat and noncombat HP zero; absence of archival/deletion/payout/estate effects; unchanged explicit retirement; deterministic receipt/destination/time/resources; consequence and projection idempotence; encounter cleanup; no automatic injury/trauma/capture/loss/harm; playable HP/Stamina with unchanged MP/body state; no ordinary autosave; retained manual/quick saves and Normal Stakes rollback; one-time same-slot legacy repair; safe repair-write failure; blocked archived/deleted history; repairable `recovery_pending`; one notice and Chronicle entry per receipt; preserved party membership with cleared transient bindings; no imported restricted-Stakes behavior; synchronized TypeScript/JavaScript mirrors; and untouched held `0.6.6`.

## Temporary Audit Retention

Retained unchanged:

`docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`

Source: commit `aa4ccfeceec023c676c98c4bf5a68216b0017263`, blob `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`.

Named remaining consumers:

1. naturally recoverable injury active-state/recovery contract;
2. `Shaken Spirit` active-state/support contract;
3. anatomy, impairment, adaptation, and prosthetic decision;
4. extraordinary restoration and regrowth decision;
5. Normal Stakes actual-death/resurrection decision, if pursued.

## Held Route Confirmation

Held `Version 0.6.6` remains paused and recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`. Retained `0.6.7` artifacts remain untouched.

## Checks Run

- confirmed clean `master` at starting commit `3b6eece79d8b359a43c1e8e6b886f27cf16316f5`;
- fetched/pruned and fast-forward pulled; repository was already up to date;
- confirmed this acceptance decision was the active prompt;
- confirmed commits `764f7ef5e4028e82fc76af6ae0381cc1eab00e20` and `aa4ccfeceec023c676c98c4bf5a68216b0017263` are ancestors of `HEAD`;
- confirmed the temporary audit is unmodified and hashes to required blob `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`;
- confirmed held `0.6.6` object `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` resolves as a blob;
- read all required authorities, audit, output, handoff, route register, `AGENTS.md`, and `README.md`;
- compared the completed audit commit to `HEAD` and found only the active prompt changed; live App, run-lifecycle, and combat seam blobs are identical;
- verified all 18 required decision sections and all required output fields;
- verified exact two-path scope, Markdown structure, and absence of conflict markers;
- did not run builds, typechecks, generators, servers, or application tests because this run changes documentation only.

## Exact Remaining Implementation-Only Decisions

- exact receipt field names and serialization nesting;
- exact deterministic id derivation;
- exact recovery time constant;
- exact HP and Stamina resume constants;
- exact safe-settlement predicate implementation;
- exact campaign-start settlement source when historical fields differ;
- exact `recovery_pending` UI and repair surface;
- exact save-format/schema version and migration function names;
- exact test file paths and TypeScript/JavaScript mirror paths;
- exact first primary `0.6.x` implementation version after the static-content sequence and post-`0.6.7` route decisions.

## Risks / Follow-Up Notes

The live runtime still archives ordinary HP-zero runs and deletes saves. This decision changes documentation only. Runtime campaign-rules migration remains prohibited until the accepted nonterminal defeat boundary lands before or atomically with migration.

Do not implement from this run, modify save topology, repair an actual save, consume the retained audit prematurely, restore held `0.6.6`, or alter retained `0.6.7` artifacts.

## Suggested Commit Message

`docs(health): accept normal defeat fallback and recovery receipt`

## Next Recommended Route

Run a separate unversioned `0.6.6 Restoration And Baseline Confirmation` coordination gate. It must not be treated as a runtime implementation prompt, assigned a primary version, or installed by this run.
