# Current Codex Output

Date: 2026-07-28

Source version/run: unversioned `Care Capability, Stabilization, And Process-Effect Contract Decision`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Branch/status assumption: `master` began clean and synchronized with `origin/master` at `26b9626961396d44db8b15494249dd0bfd3964e7`; this report describes the validated working tree before the run commit.

## Result

Created `docs/design/care-capability-stabilization-and-process-effect-contract-decision.md`.

Accepted one future shared care-capability identity vocabulary with owner-specific grants, scene/destination availability assessments, care-attempt resolvers, accepted results, and consequence receipts. A care result may propose bounded effects; only the target process/body/injury/function owner may accept its own mutation.

Implementation remains `NO_PACKAGE`.

## Live Baseline

- 55 spell records; exactly 12 healing-school spells and 10 `heal.hp` spell hooks.
- `heal.hp` is runtime-consumed but only restores combat HP through combat-owned math.
- The general known-spell resolver remains a `planning_only` inert envelope.
- Relevant identity evidence: Field Medicine, Water Safety, Healing Magic, and Alchemy skills.
- Nine combat roles include healer and support metadata, which does not grant care capability.
- Six care-like items—antidote phial, field bandage, healing tonic, two remedy kits, and utility salve—have no use profile or consumable profile.
- Nine consumable profiles are food/drink metabolic inputs only.
- Five planned services contain no care service; service validation forbids healing effects.
- Body recovery owns sleep/camp/safety/meal/water metabolic effects, not injury or lethal-process care.
- UI presentation previews metabolic recovery; a legacy UI-owned rest path still restores resources but is not care authority.
- Saves, events, deltas, commands, active effects, inventory, equipment, Chronicle, and UI contain no care-capability grant, attempt, process effect, or owner receipt.

## Capability And Availability Decision

The shared vocabulary owns collision-safe capability identity only.

Owner-specific contracts own:

- skill/training, magic, equipment/material, provider, or institution grants;
- scene availability;
- destination offer and current availability;
- access, legality, willingness, consent, reachability, and affordability;
- care-attempt admission/result;
- process, body, injury, function, inventory, magic, travel, economy, and institution consequences.

Grant, availability, access, admission, and success are distinct. No role, profession, item name, spell name, service name, tag, or prose may imply capability.

## Request, Result, And Receipt Boundary

- The initiating owner establishes request identity and normalized intent.
- The care/action owner validates and admits one care-attempt occurrence.
- Pre-admission rejection creates no gameplay occurrence or consequence.
- Duplicate delivery returns existing status and cannot repeat a roll, consumption, or mutation.
- An accepted result records the attempt and owner-addressed effect proposals.
- Every target owner accepts/rejects its own consequence and records one stable receipt.
- Partial failure retries only the missing receipt.
- Presentation failure never retries care or mutation.

## Care Semantic Boundaries

Kept distinct:

- stabilization;
- suppression;
- supportive care;
- definitive treatment;
- process resolution;
- functional recovery;
- ordinary injury recovery;
- convalescence;
- anatomical restoration;
- resurrection.

`heal.hp`, generic healing, rest, roles, services, items, or magic cannot collapse these meanings.

## Reassessment, Magic, Language, And Migration

Qualitative reassessment may follow owner-certified movement, delay, environment, observed trend, intervention response, destination/capability, or upstream-state change. No universal timer, clinical schedule, or automatic diagnosis is accepted.

Magic contributes only explicitly granted capability and still uses owner-specific results/receipts. It implies no omniscience, universal healing, anatomical restoration, resurrection, or modern-scientific exposition.

Internal technical terms remain hidden. Player-facing text must be brief, concrete, setting-appropriate, attributed, and capability-bounded.

No current hook, skill, role, item, service, body-recovery fact, save, event, label, or prose migrates into care truth.

## Package Readiness

`NO_PACKAGE`

Missing authority includes exact capability catalog/grant contracts, live process definitions/instances, care requirements, care-attempt schemas, material-input policies, scene/destination access owners, consent/law/provider contracts, inventory receipt behavior, general magic execution, persistence/correction, observer-safe assessment, poison families, and serious-burn ownership.

## Research Consumption And Retention

This decision is the third named consumer of:

`docs/dev/tmp-grounded-lethal-process-stabilization-and-first-aid-research-2026-07-28.md`

Verified:

- 58,943 UTF-8 bytes;
- SHA-256 `95760de325004f7e19c030e0177e2022873ff8ff1690a0924974bd3b9674da6d`.

The artifact remains unchanged.

The only outstanding named consumer is:

1. the first observer-safe crisis assessment/presentation package.

## Files Changed

- added `docs/design/care-capability-stabilization-and-process-effect-contract-decision.md`;
- updated `docs/dev/current-codex-output.md`;
- updated `docs/dev/current-codex-prompt.md`;
- updated `docs/dev/current-gpt-handoff.md`;
- updated `docs/dev/codex-sequenced-implementation-plan.md`;
- updated `docs/dev/project-roadmap.md`;
- updated `docs/dev/project-vision-and-continuity-brief.md`;
- updated `docs/dev/historical-version-and-deferred-route-register.md`;
- updated `docs/design/current-planning-anchor-reconciliation.md`;
- updated `docs/design/static-content-expansion-program.md`;
- updated `docs/future_content_backlog.md`.

## Checks Run

- repository, branch, worktree, upstream, fetch, and tracking alignment;
- preceding catalog-plan acceptance and `NO_PACKAGE`;
- exact research-artifact byte length and SHA-256;
- healing spell/hook counts and compatibility;
- skill, role, item, consumable-profile, service, body-recovery, inventory, save, command/result, event/delta, magic-readiness, UI, and presentation inventories;
- accepted occurrence, care, process, restoration, Stakes, and narrative-authority reconciliation;
- referenced-path and documentation-only scope checks;
- conflict-marker, trailing-whitespace, and `git diff --check` scans;
- complete changed-path and full-diff review.

No build, content lint, typecheck, test, generator, server, package installation, external research, medical protocol, treatment instruction, or gameplay command was run.

## Suggested Commit Message

`docs(health): define care capability contract`

## Risks / Follow-Up Notes

- Current HP-zero defeat/archive/save-deletion behavior remains a rejected target behavior outside this run.
- No active lethal-process, care-requirement, care-attempt, crisis-receipt, death/restoration, persistence, or correction owner exists.
- Exact poison taxonomy and detailed burn/process ownership remain unresolved.
- The observer-safe assessment contract is required before presentation or implementation readiness can be reassessed.
- The broad workspace typecheck remains the separately classified 173-diagnostic baseline.

## Next Recommended Run

Unversioned `Observer-Safe Crisis Assessment And Presentation Contract Decision`
