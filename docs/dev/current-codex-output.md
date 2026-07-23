# Current Codex Output

Source version/run: Comparative Checkpoint, Mortal-State, Rescue, Resurrection, And Stakes Research

Date: 2026-07-23

Branch/status assumption: `master`; clean start at `fbd562f3b6dd30ca78d5c418f21149b9af15524f`; fetched and fast-forwarded to starting/ending commit before documentation edits `bea5e9e95bcf4b2cae3ad8783ca7b381a657e678`; successful run ends with exactly the two authorized documentation changes below

Label class and parent: unversioned bounded external research and repository-integration planning; no parent version

Milestone impact: `supports_current_band`

Status: research complete; no accepted authority revised; implementation unauthorized

## Files Changed

- created `docs/dev/tmp-comparative-checkpoint-mortality-rescue-and-stakes-research-2026-07-23.md`;
- updated `docs/dev/current-codex-output.md`.

## External Access And Comparison Set

Reliable external search and page access were available. The bounded set is:

1. Kingdom Come: Deliverance;
2. XCOM: Enemy Unknown;
3. RimWorld;
4. Kenshi;
5. Wildermyth;
6. Crusader Kings III.

Ten principal sources were used, with no more than two per game. Direct crawler access was intermittently blocked for three community-hosted pages; indexed content and direct URLs remained available, and claims from those pages were kept narrow.

## Strongest Evidence-Backed Findings

- Checkpoint scarcity and deterministic event commitment solve different problems. Sleep/resource-gated saves bound retry frequency; they do not prevent materially identical outcome fishing.
- XCOM demonstrates the combination of action commitment and replay-stable random sequences. Its order-sensitive sequence also cautions against letting unrelated action order reshape outcomes.
- RimWorld and Kenshi show that incapacity, functional recovery, lethal wound processes, first aid, and definitive recovery can remain separate.
- A stable aid-required state is useful as player-facing triage but can be derived from functional state, active lethal processes, and care requirement instead of becoming a new mutable authority.
- Rescue is clearest when attacker intent, active hazards, helpers, aid, supplies, carrying, route, terrain/weather, destination, travel time, and body state are explicit inputs rather than one rescue roll.
- RimWorld shows a legible rare-resurrection structure: explicit capability, eligible corpse, preservation/time posture, body possession, exceptional access, and visible risks.
- Wildermyth shows completion-gated Legacy settlement and tracks spent promotions so reloading cannot duplicate account rewards.
- CK3 shows a clean lineage handoff after character death; in a resurrection-permitting system, that handoff should wait for final closure.

## Findings Supporting The Proposal

- Qualifying sleep checkpoints are an understandable middle topology.
- Hidden technical recovery should remain nonselectable.
- Independent lethal processes are more expressive than one bleed-out clock.
- Basic stabilization can stop a named lethal process while definitive care remains necessary.
- Contextual rescue/body recovery and rare deterministic resurrection eligibility create meaningful preparation and institutional play.
- A three-tier Stakes model may be justified when each tier has distinct loading, commitment, finality, reward, and warning contracts.

## Simplification And Caution

- `critical_stable` should initially be a derived presentation, not a separate persisted state.
- Sleep checkpoints without committed event identity are insufficient for anti-reroll goals.
- A global ordered random stream can make trivial action ordering an exploit; event/draw ownership needs a focused decision.
- Rescue should not be an opaque aggregate probability.
- Resurrection access should be scarce, but eligibility should be deterministic and explained.
- Prestige, estate, terminal Chronicle closure, and heir control must not settle at a death that can still be reversed.
- If a proposed middle Stakes tier differs only by fewer saves, it does not justify a separate public choice.

## Conflicts With Current Accepted Authorities

The research does not revise these conflicts:

- Normal Stakes currently preserves ordinary manual and quick saves; sleep-only checkpoints would supersede that topology.
- The defeat-fallback decision intentionally permits discarding an unsaved defeat or loading an earlier save; committed event outcomes and checkpoint limits would revise that contract.
- Campaign rules accept only initial `normal_stakes`; three public Stakes tiers require new identities and migration/availability decisions.
- Restricted Stakes currently makes accepted actual death immediately terminal. A restorable actual-death stage before final death would explicitly supersede that rule if applied to the restricted tier.
- The injury/restoration decision allows a later Normal Stakes resurrection decision but prohibits reopening currently terminal restricted-Stakes death.

## Decisions Still Requiring Human/GPT Acceptance

- whether to replace Normal Stakes save topology and with which tier model;
- qualifying sleep/day checkpoint creation and retention;
- deterministic event/draw identity and materially identical replay;
- hidden technical-recovery depth;
- authoritative versus derived mortal-state vocabulary;
- first lethal-process owners and stabilization boundaries;
- rescue facts, uncertainty, body recovery, and institution ownership;
- resurrection eligibility, preservation, recovery, access, abandonment, and closure;
- final ordering of Prestige, estate, Chronicle, and heir creation;
- rollback-provenance effects on account rewards;
- whether three public Stakes choices are mechanically distinct enough;
- whether restricted-Stakes terminal closure remains or is superseded.

## Held Route Confirmation

Held `Version 0.6.6` remains paused and recoverable from blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`. The retained defeat/injury audit remains unchanged at blob `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`. Retained `0.6.7` artifacts remain untouched.

## Checks Run

- confirmed clean `master`, fetched/pruned, and fast-forwarded to `bea5e9e95bcf4b2cae3ad8783ca7b381a657e678`;
- confirmed this comparative research prompt is active;
- confirmed accepted defeat-fallback commit `fbd562f3b6dd30ca78d5c418f21149b9af15524f` is an ancestor;
- confirmed its decision file is unmodified and hashes to `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`;
- confirmed the retained audit and held `0.6.6` blob identities;
- read the required authorities and coordination sources;
- confirmed reliable external access before making comparative claims;
- used six games and ten principal sources, within the prompt limits;
- preserved source titles, sites, dates where available, access date, direct URLs, and quality classifications;
- verified all 17 required research sections and required output fields;
- verified exact two-path scope, Markdown structure, source-link presence, and absence of conflict markers;
- did not run builds, typechecks, generators, servers, or application tests because this run changes research documentation only.

## Risks / Follow-Up Notes

Comparative mechanics are evidence, not authority. No save, death, rescue, resurrection, Stakes, Prestige, or succession contract changed. The live runtime still archives ordinary HP-zero runs under the pre-migration implementation.

The findings provide material reasons to revisit current Stakes and death authorities before restoring the static-content route or authorizing runtime work.

## Suggested Commit Message

`docs(research): compare checkpoint mortality and succession systems`

## Next Recommended Decision Run

Run an unversioned documentation-only `Checkpoint Commitment, Mortal-State, Resurrection, Final Closure, And Stakes Authority Revision` decision pass. It should explicitly retain or supersede each conflicting authority and must not implement runtime or restore `0.6.6`.
