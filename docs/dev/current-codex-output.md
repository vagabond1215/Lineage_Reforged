# Current Codex Output

Source version/run: Normal Stakes Defeat, Injury, Trauma, And Magical Restoration Repository Audit And Contract Planning

Date: 2026-07-22

Branch/status assumption: `master`; starting and ending commit before documentation edits `d11c270bfeaa75a9a36ebe1302303e61b9384491`; clean starting worktree; fetch/prune and fast-forward pull reported already up to date; successful run ends with exactly the two authorized documentation changes below

Label class and parent: unversioned documentation-only repository audit and implementation-contract planning; no parent version

Milestone impact: `supports_current_band`

Status: audit complete; findings are decision-ready, but implementation and contract acceptance remain unauthorized

## Files Changed

- created `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`;
- updated `docs/dev/current-codex-output.md`.

## Principal Repository Findings

- Combat already owns damage, HP clamping, `incapacitated`/`defeated` flags, encounter outcome, history/event emission, and encounter cleanup. It does not itself archive the run.
- `apps/rpg-ui/src/App.tsx` interprets every HP-zero snapshot as terminal during both snapshot change and run entry.
- `resolveTerminalArchiveReason` returns `dead` or `hardcore_dead`; `archiveActiveRun` then evaluates history/achievements, settles Legacy/Prestige, records archival, deposits estate assets, persists the account, and deletes all character saves.
- Noncombat resource and travel paths can also produce HP zero, so a replacement needs a typed source receipt plus a safe unknown/legacy fallback.
- The smallest replacement seam is the current snapshot-admission terminal check. One engine-owned Stakes/defeat resolver should consume HP zero there; only an explicit terminal result may reach `archiveActiveRun`.
- A descriptive combat-health schema/content/lint/test foundation already exists, but it contains only two planned status rows and owns no active health state.
- The repository has no active injury, `Shaken Spirit`, anatomy, treatment, complication, prosthetic, corpse, regrowth, or resurrection owner.
- Combat `heal.hp` restores the HP resource only. The 55-record spell catalog includes healing/regeneration descriptions, but no live player capability was found for resurrection, revival, limb/organ restoration, or anatomical regrowth.
- The five-record service catalog contains no healer/treatment/restoration service.
- No live fact materially contradicts an accepted authority. The current HP-zero behavior is the already-recognized implementation gap and atomic migration gate.

## Recommended Default Defeat Fallback

Create one stable, idempotent defeat receipt; finish/clear the encounter; choose an explicit context recovery destination or deterministic safe fallback; advance bounded time once; restore HP to a playable floor and Stamina enough to act; preserve inventory, equipment, currency, quests, party membership, injury state, trauma state, and immutable truth; persist before play resumes; and project Chronicle/notice output from the same receipt.

Default destination order should be decided as: explicit context destination, current valid recovery settlement, persisted last-safe location, then campaign-start settlement. If none validates, retain a nonterminal recovery-pending repair state and surface a diagnostic. Never archive, delete saves, choose randomly, or silently teleport.

Injury, `Shaken Spirit`, capture, item/currency loss, and permanent harm are optional causal context extensions, not generic defeat taxes. Exact time/resource values remain deferred.

## Contract Summary

### Naturally recoverable injury

Use a typed player-health instance with stable identity, `Minor | Moderate | Major` severity, separate recovery class, progress, injury-specific ordinary/reduced/protected-use posture, treatment inputs, complication references, causal source receipt, optional body region, current-effect contributions, and resolved presentation. One health resolver advances recovery. Rest, activity, nutrition/body state, treatment, and magic provide typed inputs rather than editing progress independently. Major naturally recoverable injury can fully recover.

### `Shaken Spirit`

Use a separate lore-facing trauma-condition instance with source event, trigger identities/categories, expression tags, burden/course, safety/support/treatment inputs, contextual contributions, active/dormant/resolved/persistent state, causal relapse, and Chronicle explanation. It may self-resolve, respond to setting-appropriate support, or persist. It cannot become soul damage, a diagnosis catalog, personality mutation, or arbitrary forced behavior.

### Irreversible harm and restoration

A later anatomy/capability owner must distinguish absent/destroyed anatomy, wound closure, persistent impairment, rehabilitation, prosthetic compensation, current capability, restoration eligibility, and restoration completion. Ordinary healing may restore HP or aid recovery but cannot recreate anatomy. Exceptional restoration, regrowth, and resurrection require separate explicit capabilities and authority. Resurrection must obey death and Stakes ownership and cannot reopen restricted-Stakes terminal closure.

## Owner Conflicts

- `PlayerState.activeEffects: string[]` is a label projection, not an injury/trauma owner.
- `PlayerState.attributes` is a migration input, not accepted immutable base state.
- `bodyState` and `resourceRuntime` may inform recovery but cannot own injury progression.
- Combat statuses are transient combat instances and must not silently become persistent conditions.
- Static health vocabulary describes identities but cannot execute recovery or consequences.
- Settlement rest cannot be reused wholesale for defeat because it charges currency, fully restores resources, and could duplicate time/recovery.
- Equipment can host a future prosthetic item but cannot claim anatomical restoration.
- UI and Chronicle explain accepted results; they do not author them.

## Package Sequence

1. Required atomic package: campaign-rules identity/save migration plus the engine-owned nonterminal defeat resolver, explicit terminal separation, deterministic recovery location/receipt, time/resource fallback, immediate persistence, loop protection, legacy HP-zero handling, focused tests, and synchronized mirrors.
2. Safe immediate follow-up: read-only projection and typed rescue/capture/surrender/law/quest context adapters.
3. Later health/injury: immutable-base/current resolver, health instances, vocabulary extension, recovery/use/treatment/complication contracts, and natural-recovery implementation.
4. Later trauma: `Shaken Spirit` state, source/trigger/support progression, persistence, projection, and agency guardrails.
5. Later magical restoration: anatomy/capability, persistent impairment, adaptation/prosthetics, eligibility, and explicit extraordinary restoration/regrowth.
6. Later resurrection/death: focused Normal Stakes death/resurrection decision and future restricted-Stakes integration.

No release number is assigned.

## Exact Remaining User Decisions

- safe-location fallback order and behavior when none validates;
- qualitative HP/Stamina/MP resume policy and whether default body/fatigue burden exists;
- recovery/re-entry loop protection;
- automatic fallback versus visible repair for active legacy HP-zero saves;
- first context-outcome extension and adapter;
- party/guest baseline after player defeat;
- first naturally recoverable injury vocabulary and body-region granularity;
- active health-container placement and injury/trauma separation;
- multiple-injury aggregation/caps;
- initial `Shaken Spirit` triggers, expressions, support, dormancy, and relapse;
- anatomy/capability and prosthetic ownership;
- which explicit magic capabilities and access owners can restore/regrow anatomy;
- whether Normal Stakes later supports actual death/resurrection at all.

## Checks Run

- confirmed a clean starting worktree on branch `master` at `d11c270bfeaa75a9a36ebe1302303e61b9384491`;
- fetched/pruned and fast-forward pulled; repository was already up to date;
- confirmed this audit was the active prompt;
- confirmed campaign-rules decision commit `764f7ef5e4028e82fc76af6ae0381cc1eab00e20` is an ancestor of `HEAD`;
- confirmed the injury/restoration decision exists and was unmodified;
- confirmed held `0.6.6` blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` exists as a blob;
- confirmed only documentation changed between the campaign-rules decision and current `HEAD`;
- read all required authorities and coordination files and traced relevant runtime, shared types, content, schema, save, UI, generated-mirror, and focused-test surfaces;
- counted 55 spell records and five service records; found no live player resurrection/revival/anatomical-regrowth match;
- verified the audit contains all 16 required sections and this output contains all required handoff fields;
- verified exact two-path scope, Markdown structure, and absence of conflict markers;
- did not run builds, typechecks, generators, servers, or application tests because this run changes documentation only.

## Held Route And Risks

Held `Version 0.6.6` remains paused and byte-recoverable at blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`. Retained `0.6.7` artifacts are untouched.

The current runtime still archives ordinary HP-zero runs, settles terminal account effects, and deletes their saves. This audit does not change that behavior. `normal_stakes` must not become live until the nonterminal defeat boundary lands before or atomically with campaign migration.

## Suggested Commit Message

`docs(health): audit defeat injury trauma and restoration contracts`

## Next Recommended Decision Run

An unversioned `Normal Stakes Defeat Fallback And Recovery Receipt Acceptance Decision` should resolve the safe-location chain, resume-resource posture, loop protection, legacy HP-zero handling, party baseline, context adapter, persistence receipt, and atomic first-package boundary. Do not implement from this audit alone.
