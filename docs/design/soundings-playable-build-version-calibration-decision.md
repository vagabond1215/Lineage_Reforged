# Soundings Playable-Build Version Calibration Decision

Date: 2026-09-28

Disposition: **GAME_VERSION_CANDIDATE_JUSTIFIED** — candidate `0.1.1-prealpha`; no `GAME_VERSION_ACCEPTED` decision and no version publication in this route.

Label class: unversioned documentation decision; parent not applicable; development milestone impact `none`; game-version impact `candidate`. Current Game remains `0.1.0-prealpha`, playability remains `INTEGRATED_LOOP`, accepted `DEV-0.7.0` and band `DEV-0.7.x` remain unchanged.

## Authority And Compared Builds

Controlling policy is `docs/dev/game-version-roadmap-and-acceptance-policy.md` with companion `docs/dev/playability-posture-and-version-calibration.md`. The accepted current delta is independently proven by `docs/design/soundings-durable-completion-post-f3-independent-acceptance-audit.md` at runtime `7c8c980d01892b0f673afc5a5940aec33ad2d7a2`.

The previously accepted `0.1.0-prealpha` representative path ended after four Soundings survey shifts with the quest active and unturned-in. That older wording remains historical chronology only. The accepted current path now returns authoritatively to Starfall in four ticks with no fare, submits Soundings immediately, pays exactly +5 gold and no other turn-in reward, moves the quest to completed history with tracking cleared, survives save/restart with no resubmission, and permits later ordinary travel and save.

## Patch Calibration

The policy explicitly identifies closing an existing quest lifecycle through authoritative turn-in/reward as a valid `0.1.x` patch-class improvement when independently accepted and still inside First Playable / Early Pre-Alpha. This delta is coherent, player-visible, durable, reproducible through ordinary callers, and materially changes what the player can complete and retain.

Therefore **`0.1.1-prealpha` is justified as the smallest game-version candidate**. This decision does not publish it. The canonical `GAME_VERSION` remains `0.1.0-prealpha` until a separate publication acceptance route issues `GAME_VERSION_ACCEPTED` and performs the explicit version change.

## Vertical-Slice Separation

This decision does **not** satisfy or infer the `0.2.0-prealpha` vertical-slice gate. The accepted Soundings closure proves one quest lifecycle inside the existing integrated loop; it does not prove the required representative breadth across character development, combat/challenge, inventory/equipment, crafting/economy, NPC/services, multiple meaningful choices, slice-wide UI/accessibility/input, representative balance/anti-exploit posture, or a coherent human-reviewed vertical slice.

Playability therefore remains `INTEGRATED_LOOP`, not `VERTICAL_SLICE`.

## Known Limits And Patch-Gate Relevance

| Evidence / limitation | Patch disposition | Vertical-slice / later posture |
| --- | --- | --- |
| Storage peak 5,076,206 / 5,242,880 UTF-16 bytes; 166,674 bytes measured headroom | Not fatal to this bounded accepted quest path: the audited finite sequence completed, restarted, traveled and saved without quota failure. No long-campaign or unlimited-history claim. | Capacity/retention remains explicit debt for broader or longer-lived acceptance. |
| 137 broad UI TypeScript diagnostics, normalized unchanged | Known technical debt, not introduced by or blocking the accepted Soundings path; focused type/build/regression gates passed. | Must be handled under its dedicated tooling/UI posture as required by later gates. |
| Ordinary Starfall is harbor, not safe settlement; defeat/pending recovery there fails unchanged | Outside the accepted noncombat Soundings completion path and therefore not a blocker to this patch candidate. | Defeat/recovery reachability remains unresolved for routes or gates that require it. |
| Daily Revenue 842 without business records, diagnostic/Window Standards panels, Unknown Watch | Observed nonblocking presentation debt; none prevented authoritative completion, consequence understanding, restart or continuation. | UI coherence/polish remains required evidence for broader slice maturity. |
| No comprehensive accessibility acceptance | Not required by the `0.1.x` patch rule for this already accepted bounded delta; ordinary browser interaction evidence is not promoted into accessibility acceptance. | Explicitly required for the selected `0.2.0-prealpha` slice gate. |
| No hosted/deployment acceptance for this delta | The accepted claim is local executable/browser playable behavior; the patch rule does not make hosted deployment a mandatory claim when distribution is excluded. | Any publication route that claims a hosted/distributed build must separately bind and validate that identity. |

No listed limitation is silently resolved. None contradicts the independently accepted player-visible delta or makes `0.1.1-prealpha` an inappropriate candidate. They remain bounded debt and reopening triggers according to their actual consumers.

## Publication Boundary

The next route is **Game 0.1.1-prealpha Publication Acceptance**.

That route must remain separate and must:

1. start from fresh live repository state and preserve the accepted runtime evidence unless production drift requires revalidation;
2. name proposed Game `0.1.1-prealpha`, previous Game `0.1.0-prealpha`, exact accepted player-visible delta, exact build SHA and known limitations;
3. confirm no save/world/schema/package/deployment identity is being conflated with the game version;
4. decide whether any post-audit production drift requires replay of the bounded acceptance checks;
5. issue exactly one policy state: `GAME_VERSION_ACCEPTED`, `GAME_VERSION_NOT_READY`, or `GAME_VERSION_BLOCKED`;
6. change root `GAME_VERSION` only if `GAME_VERSION_ACCEPTED`, with the smallest required current-status documentation updates and exact publication/readback evidence;
7. make no `0.2.0-prealpha`, `VERTICAL_SLICE`, `DEV-0.7.1`, `DEV-0.8.x`, deployment, accessibility, long-retention or broader product claim by inference.

Because publication changes canonical player-facing version authority, it is an explicit repository publication route rather than part of this production-read-only calibration.

## Product Input

No bounded product question blocks this calibration. Repository policy already defines patch semantics, the accepted Soundings terms, and the separation from the vertical-slice gate.
