# Current Codex Output

Source version/run: Campaign Rules Identity, Legacy Migration, Story Abstraction, And Normal Stakes Acceptance Decision

Date: 2026-07-22

Branch/status assumption: `master`; starting commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694` before the required fetch and fast-forward pull; clean starting worktree; pulled to ending commit `c53b000077c90bfa821125adf11fe9d7e2b0c58f`; successful run ends with exactly the three authorized documentation-path changes listed below

Label class and parent: unversioned documentation-only acceptance and contract decision; no parent version

Milestone impact: `supports_current_band`

Status: contract accepted; implementation unauthorized

## Result

Created the durable campaign-rules acceptance authority:

`docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`

It is more specific than the general difficulty/world/stakes decision for canonical ids, state shape, locks, availability, Normal Stakes defeat, legacy migration, Story abstraction, overrides, campaign-history identity, and package-order gates. It preserves the separate focused restricted-Stakes authority for future continuity saving, irreversible actual death, terminal closure, and nonzero circumstance-sensitive Prestige.

No live fact materially contradicted the accepted audit. Runtime and shared-contract sources were unchanged between audit commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694` and `HEAD`; only coordination documentation and the focused restricted-Stakes decision changed.

## Files Changed

- created `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- updated `docs/dev/current-codex-output.md`;
- deleted `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md` after transferring its durable findings.

## Accepted Campaign Identity

```ts
type DifficultyPresetId = "story" | "favored" | "mortal" | "forsaken";
type WorldRulesId = "heroic_world" | "grim_world";
type StakesRulesId = "normal_stakes";
```

The authoritative campaign/save state is versioned and may contain typed compatibility overrides plus migration provenance. Save metadata, Chronicle, account history, and UI are projections. Physical item truth, manifests, world facts, immutable base attributes, and authored-content difficulty remain outside the campaign-setting taxonomy.

No restricted-Stakes id is accepted. `Ironbound` remains a working title.

## Lock And Availability Policy

- Difficulty, World Rules, Stakes, and mechanical overrides are creation-locked initially.
- Accessibility, presentation, input, localization, and nonmechanical information formatting remain changeable.
- No initial mid-campaign axis transition is supported.
- A later focused contract may allow difficulty-only changes with append-only provenance and eligibility effects.
- World Rules and Stakes remain locked unless a dedicated migration proves persistent-state closure.
- Production creation exposes only combinations whose required owner policies, persistence, migrations, and tests exist.
- No option is player-selectable merely because its canonical id exists.

## Normal Stakes Defeat Boundary

`normal_stakes` preserves ordinary manual and quick-save topology but rejects the current implicit terminal HP-zero behavior.

```text
HP reaches zero
  -> defeated or incapacitated
  -> context-owned nonterminal defeat resolution
  -> campaign identity and saves remain intact
```

Ordinary HP zero does not archive the run, delete saves, settle Legacy/Prestige, prove actual death, or imply retirement. `resolveTerminalArchiveReason` cannot remain the authority for ordinary HP-zero resolution, and `archiveActiveRun` requires a separately accepted explicit terminal outcome.

Runtime migration to `normal_stakes` is prohibited while HP zero still automatically archives the run and deletes saves. The defeat boundary must land before or atomically with campaign-rules migration.

## Exact Migration Map

| Legacy state | Difficulty | World Rules | Stakes |
| --- | --- | --- | --- |
| missing or invalid | Mortal | Heroic World | Normal Stakes |
| `easy` | Favored | Heroic World | Normal Stakes |
| `normal` | Mortal | Heroic World | Normal Stakes |
| `hard` | Forsaken | Heroic World | Normal Stakes |
| `brutal` | Forsaken | Heroic World | Normal Stakes |

Brutal retains materially distinct owner-approved tuning through typed compatibility overrides and provenance; it is not a fifth public preset.

Legacy `hardcore: true` maps its ordinary tier normally, always receives Heroic World and Normal Stakes, records `legacy_hardcore` provenance, and may retain only owner-approved non-Stakes tuning. It does not preserve implicit terminal HP-zero archival, save deletion, `deathZeroesPrestige`, or the Hardcore-specific Prestige multiplier automatically. Historical `dead` and `hardcore_dead` records remain unchanged history.

## Story Abstraction

Story uses the shared owner architecture through a Story policy adapter. Authored item identity, manifests, quantities, nutrients, consumption, time, deterministic save/load, and ordinary RPG state remain true.

Detailed metabolism, digestion, Protein Support, fat, detailed recovery, and body-composition ledgers may be absent, inert, or internal compatibility caches. Broad RPG conditions replace required technical management; recovery is generous; persistent structural atrophy and structural-loss accumulation are disabled.

Story is unavailable in production until every active core owner has a tested adapter. Story plus Grim requires a coarse adapter for every selected Grim module; a module without one is unavailable rather than silently running full detail.

## Overrides, Chronicle, Achievements, And Legacy

The first package reserves a typed owner-approved override registry but provides no player-facing custom mechanical overrides. Initial sources are limited to legacy migration and developer/test fixtures. Owner, key, typed value, source, base preset, and rules version must survive roundtrip.

New and active campaign records preserve all ids, rules version, migration provenance, compatibility overrides, and any future append-only change history.

Achievements remain rules-agnostic unless an individual achievement later declares predicates. No new difficulty, world, migration, override, achievement, Prestige, or Legacy multiplier or exclusion is accepted.

The combat-profile `preferredMode: normal | hardcore` is quarantined from campaign migration. Its overloaded `hardcore` label is deprecated in direction only; a later combat-owned contract must choose any replacement.

## Restricted-Stakes Authority Preserved

`docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md` remains controlling for the future mode's one authoritative continuity stream, no chosen rollback, technical recovery separation, irreversible actual death, atomic terminal closure, retained read-only character history, and exactly one nonzero Prestige/Legacy settlement informed by completed life, public and legal perception, publicity, disgrace, sacrifice, and martyrdom.

The initial contract contains only `normal_stakes` and does not implement that future direction.

## Accepted Implementation Dependency Order

1. Campaign-rules types/owner, save and Chronicle identity, provenance, and internal typed override registry with Mortal/Heroic/Normal defaults and no broad selection.
2. Nonterminal Normal Stakes defeat boundary.
3. Atomic legacy `runDifficulty` migration.
4. Read-only identity and migration projection.
5. Favored/Mortal/Forsaken owner adapters, then bounded production selection under Heroic/Normal.
6. Immutable-base/current-attribute and physical-nutrition prerequisites.
7. Story adapters across active core owners.
8. Story production availability after adapter tests.
9. Focused Grim health/sanitation decision and vertical slice.
10. Grim production availability after a real persisted module, tests, and Story adapter.
11. Later owner-specific Grim modules.
12. Separate restricted-Stakes save, death/succession, Prestige/Legacy, name/id, runtime, and opt-in UI sequence.

Steps 1-3 may be one atomic versioned package to prevent `normal_stakes` from coexisting with automatic save deletion. No release number is assigned.

## Temporary Artifact Disposition

Deleted `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md` after consuming exact blob `b08c5b2ba418e8a3a4effea80984888c2b4fc10e` from source commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694`.

Its live inventory, contradiction, migration, owner, Story, Grim, Stakes, and test findings are transferred into the durable decision. Exact evidence remains available in git history and live source paths.

## Exact Deferred Decisions

- exact Favored/Mortal/Forsaken numeric values and domain tunables;
- exact contextual Normal Stakes defeat outcomes and frequencies;
- final restricted-Stakes name and machine id;
- restricted-Stakes autosave cadence, storage mechanism, and recovery depth;
- actual-death contexts, lethality, party/NPC permanence, succession, same-world continuation, estate, and inheritance;
- restricted-Stakes Prestige base, floor, caps, curves, publicity, disgrace, and martyrdom rules;
- player-facing custom difficulty;
- Story adapters for owners not yet implemented;
- replacement combat-profile identifier;
- exact Grim disease/content catalog and later core-versus-optional module classification;
- release version and milestone assignment.

## Checks Run

- ran `git status` before work and confirmed a clean worktree;
- recorded branch `master` and pre-pull commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694`;
- fetched and fast-forward pulled to `c53b000077c90bfa821125adf11fe9d7e2b0c58f`;
- re-read the active prompt after the pull replaced it;
- confirmed audit commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694` is an ancestor of `HEAD`;
- confirmed the temporary audit hash exactly matched `b08c5b2ba418e8a3a4effea80984888c2b4fc10e` before deletion;
- confirmed the restricted-Stakes decision existed and was unmodified in the worktree;
- confirmed held `0.6.6` prompt blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` exists and resolves to `docs/dev/current-codex-prompt.md` in history;
- read the required audit, output, general difficulty/world/stakes authority, focused restricted-Stakes authority, nutrition/attribute authorities, handoff, route register, live lifecycle/difficulty/shared-contract/tactics sources, `AGENTS.md`, and `README.md`;
- compared audit commit to `HEAD` and confirmed no audited runtime/type file changed;
- verified required decision sections, accepted ids, migration table, package order, validation obligations, deferred decisions, and non-decisions;
- verified exact three-path scope, Markdown diff checks, absence of conflict markers, and temporary-artifact deletion;
- did not run builds, typechecks, application tests, generators, or servers because this run changes documentation only.

## Risks / Follow-Up Notes

The current runtime still archives ordinary HP-zero runs, settles payout/estate effects, and deletes character saves. This run does not change that behavior. Any later implementation must respect the atomicity gate and cannot claim live Normal Stakes until the nonterminal defeat boundary is present.

Story remains unavailable until owner adapters exist. Grim World remains unavailable until a real typed persisted module and required Story adapter exist. Restricted Stakes remains future authority without an accepted live id.

Held `Version 0.6.6` remains paused and byte-recoverable. Retained `0.6.7` artifacts remain untouched.

## Suggested Commit Message

`docs(difficulty): accept campaign rules identity and migration`

## Next Recommended Version / Run

Stop for GPT/human inspection. The contract is accepted, but implementation remains unauthorized. Do not create a follow-on implementation prompt, assign a version, restore held `0.6.6`, or alter retained `0.6.7` artifacts from this run.
