# Pipeline Versioning And Roadmap Drift Audit

Source version/run: Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit
Date: 2026-07-06

## Audit Summary

This documentation-only audit found no primary-route drift after `Version 0.5.276 - Highcrown Settlement Site Status Activation`.

The current roadmap and handoff posture already point to `Version 0.5.277 - Highcrown Settlement Site Knowledge Snippet Readiness Review` as the immediate next primary route. The missing piece was an explicit convention for fourth-segment support labels such as `0.5.276.1`.

## Current Primary Anchor

Latest completed primary version:

- `Version 0.5.276 - Highcrown Settlement Site Status Activation`

That primary run activated both current Highcrown settlement site records as static site identity and preserved `parentDistrictId: null`.

## Current Next Primary Route

Immediate next primary version:

- `Version 0.5.277 - Highcrown Settlement Site Knowledge Snippet Readiness Review`

This route remains docs-first and should review site-snippet readiness without adding snippets, aligning General Lore for site subjects, changing anchors, editing settlement/district/site content, or changing runtime behavior.

## Versioning Drift Findings

- No stale current-primary drift was found in the active handoff path: current docs already identify `0.5.276` as latest primary and `0.5.277` as next primary.
- The sequenced implementation table correctly keeps `0.5.277` as the next queued primary entry and does not require renumbering.
- The roadmap and sequence docs did not yet formalize how fourth-segment labels behave, which could create unnecessary pressure to renumber planned primary versions after audits, retries, repairs, or validation-only support runs.
- No evidence was found that `0.5.276.1` should consume the planned `0.5.277` slot or shift the existing `0.5.277`-`0.5.281` near-term queue.

## Fourth-Segment Run-Suffix Convention

Three-segment labels such as `0.5.277` are primary roadmap versions.

Four-segment labels such as `0.5.276.1` are run-suffix support labels attached to the current three-segment anchor. The fourth segment is a run count for audit, retry, repair, validation, or support work. It is not a new roadmap milestone.

## Primary Version Vs Run-Suffix Version Rules

- Primary roadmap versions use three segments: `0.5.276`, `0.5.277`, `0.5.278`.
- Run-suffix versions use four segments: `0.5.276.1`, `0.5.276.2`.
- A run-suffix version does not consume the next primary roadmap slot.
- A run-suffix version does not force renumbering of the planned primary queue unless the run finds a real ordering error.
- Roadmaps should normally pre-plan primary versions only. Support suffixes should appear in current handoffs, outputs, backlog notes, audit docs, and sequence anchor notes as needed.

## Failed, Partial, Retry, Repair, And Support-Run Handling

- Failed or partial runs should not mark their primary version complete.
- A retry or repair may use a fourth-segment suffix attached to the relevant primary anchor when the work supports, clarifies, validates, or repairs that anchor.
- A suffix run may be recorded as completed support work without changing the latest completed primary.
- If a suffix run materially changes the intended primary sequence, the roadmap should state that as an ordering correction. Otherwise the next primary route remains unchanged.

## Files Audited

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/design/highcrown-settlement-site-activation-readiness-review.md`
- `docs/design/highcrown-settlement-site-anchor-evidence-clarification-plan.md`
- `docs/design/highcrown-settlement-site-district-anchor-review.md`
- `docs/design/settlement-district-site-authority-boundary-decision.md`
- `docs/design/future-system-design-ledger.md`
- `packages/content/base/world/settlement_sites.json`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_domains.json`

## Current Highcrown Site Lane Posture

- `settlement_site.highcrown.barge_quays` is active static site identity.
- `settlement_site.highcrown.palace_terraces` is active static site identity.
- Both current site records keep `parentDistrictId: null`.
- Current evidence supports Highcrown-level site identity but does not place either site inside `settlement_district.highcrown.archive_districts` or `settlement_district.highcrown.market_courts`.
- No route, dock, cargo, palace access, court/law, vendor, service, economy, storage, NPC, UI, reward, command, event, travel, or gameplay behavior is implied by active status.

## Current Knowledge/Site Snippet Posture

- Exactly two active `settlement_district` General Lore snippets exist: one for `archive_districts` and one for `market_courts`.
- No active `settlement_site` snippets exist.
- Direct `settlement_site` subject validation exists, but live snippets still require a separate readiness review.
- General Lore currently supports the active district snippet lane and was not changed by this audit to advertise site snippet ownership.

## Documents Requiring Updates

- `docs/dev/project-roadmap.md` needed a concise primary-vs-suffix rule and support-run anchor note.
- `docs/dev/codex-sequenced-implementation-plan.md` needed a support-run anchor note while preserving the existing primary queue.
- `docs/dev/current-codex-output.md` needed to become the current run output.
- `docs/dev/current-gpt-handoff.md` needed to preserve the updated guardrail for the next primary route.
- `docs/future_content_backlog.md` needed a compact run note so future prompts do not treat `0.5.276.1` as a primary-roadmap slot.

## Documents Deliberately Left Unchanged

- `AGENTS.md` was audited but not changed because this run's allowed file list did not include it.
- Historical design docs for `0.5.273` through `0.5.276` were left unchanged because they accurately describe their source-run posture and are not the current versioning authority.
- Content, schema, validator, test, runtime, UI, storage, command, event, reward, save/account, migration, route/travel, economy, court/law, vendor/market, cargo/storage, sacred-site, religious-hotspot, and gameplay files were deliberately left unchanged.

## Recommended Edits Applied In This Run

- Added this audit document.
- Clarified the fourth-segment run-suffix convention in roadmap and sequence docs.
- Preserved `Version 0.5.277 - Highcrown Settlement Site Knowledge Snippet Readiness Review` as the next primary route.
- Updated current Codex output and GPT handoff for `Version 0.5.276.1`.
- Added a compact backlog entry for the support run.

## Remaining Risks

- `AGENTS.md` still contains only the older three-segment wording. A later narrowly scoped docs pass may promote the suffix convention there if desired.
- Future prompts could still confuse support suffixes with primary milestones if they ignore the current output, current handoff, roadmap, or sequenced implementation plan.
- The site-snippet lane remains intentionally unimplemented until `0.5.277` reviews evidence, domain alignment, wording, and scope.

## Next Primary Route Guardrail

The next primary route remains:

- `Version 0.5.277 - Highcrown Settlement Site Knowledge Snippet Readiness Review`

Do not renumber this route because of `Version 0.5.276.1`. Do not add site snippets, align General Lore for site subjects, change Highcrown anchors, edit content JSON, change schemas or validators, add tests, or touch runtime/UI behavior until a later focused primary implementation prompt explicitly scopes that work.
