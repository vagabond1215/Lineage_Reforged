# Current GPT Handoff

Source route: GitHub Connector continuity alignment after Codex 0.5.70
Date: 2026-05-21
Branch/status assumption: `master`; use `docs/dev/current-codex-output.md` for the exact latest Codex run state.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records only current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/design/future-system-design-ledger.md` owns durable system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.
- Focused `docs/design/` guardrail docs remain temporary; delete or fold them after their guidance is implemented, superseded, or promoted.

## Current Anchor

Latest Codex handoff:

- `Version 0.5.70 - Heirloom And Bequest Systems Plan`

0.5.70 result:

- Created `docs/design/heirloom-and-bequest-systems-plan.md` as the active planning-only heirloom/bequest design artifact.
- Separated Bloodline upgrades, bequests, heirlooms, estate assets, Family Prestige, Chronicle Marks, Lineage Seals, and Backstory support.
- Confirmed no runtime source, schemas, tests, content JSON, UI, generated output, Backstory Eligibility behavior, Family Prestige behavior, heirloom runtime, or bequest runtime changed.
- Added a concise backlog note.

Previously landed Backstory Legacy slice:

- `0.5.67` migrated five low-risk Backstory Legacy records into the live Legacy unlock catalog as account-scoped, live, unlock-only records.
- `0.5.68` wired owned account-scoped purchases into creator availability through `resolveOwnedBackstoryLegacyPurchaseIds(...)`.
- `0.5.69` aligned player-facing locked copy, policy metadata, handoff, and roadmap after resolver integration.

Live low-risk Backstory Legacy records:

- `legacy.backstory.street_vendor` -> `backstory.street_vendor`
- `legacy.backstory.net_tender` -> `backstory.net_tender`
- `legacy.backstory.gatherer` -> `backstory.gatherer`
- `legacy.backstory.scribes_apprentice` -> `backstory.scribes_apprentice`
- `legacy.backstory.kitchen_hand` -> `backstory.kitchen_hand`

## Guardrails Still Active

Backstory / Legacy:

- Future Backstory Legacy records must describe formative-past access, not current employment, current social identity, family history proof, institution membership, title/status ownership, contacts, items, coin, skills, magic, authority, or live obligations.
- Do not add creator purchase buttons or redesign the account meta purchase surface without a dedicated prompt.
- Family, source-run, region, institution, estate/title, heir-only, next-run, and preparation-scoped Backstory Legacy evidence remain deferred until their owner systems and storage seams exist.
- No `familyId` may be derived from `sourceRunId`, `lineageId`, account id, selected character, selected backstory, or UI state.
- Tier 2 and Tier 3 Backstory Legacy paths still need scoped evidence plus support; purchase evidence alone must not unlock them.

Heirloom / bequest:

- `docs/design/heirloom-and-bequest-systems-plan.md` is the active heirloom/bequest planning artifact.
- Bequests are intentional material, estate, legal, household, or claim-based transfers; they do not grant Bloodline traits or Backstory identity.
- Heirlooms require one persistent item instance with an ownership chain; they are not duplicated starter gear.
- Family Prestige may later fund registration, transfer, or support costs, but it is not proof of the item, transfer, estate asset, or effect.
- No heirlooms, bequests, item-instance persistence, estate delivery, Family Prestige spending, Chronicle Marks, Lineage Seals, heir systems, or Bloodlines UI exist yet.

## Temporary Guardrail Docs

Keep these while related future planning is active:

- `docs/design/heirloom-and-bequest-systems-plan.md`
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/bloodlines-information-architecture-audit.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/design/backstory-legacy-purchase-content-draft.json`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/dev/prompt-template-hardening-pass.md`

The low-risk account-scoped Backstory Legacy slice and the 0.5.70 heirloom/bequest plan are no longer the active implementation target. Future work should move to the roadmap sequence unless a newer Codex handoff supersedes it.

## Next Direction

Recommended next version:

- `Version 0.5.71 - Bloodlines View Model Implementation Plan`

Expected direction:

- Define a pure, read-only Bloodlines projection before UI.
- Use current account/family/run-history data only.
- Include family records, family tree summaries, Family Prestige summaries, family unlock summaries, estate/bequest/heirloom inactive summaries if useful, and safe empty states.
- Do not add React UI, family management, purchase/spend/register/claim/transfer actions, heir systems, heirlooms, bequests, item-instance persistence, Family Prestige spending, scoped Backstory evidence, or generated output.

## Next Prompt Source Stack

For the `0.5.71` prompt, inspect these first:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/bloodlines-information-architecture-audit.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/design/heirloom-and-bequest-systems-plan.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/future_content_backlog.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/account-family.ts`
- `packages/engines/game-engine/src/legacy-account.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- relevant account family/profile tests

The expected output should be a plan or pure view-model implementation prompt, depending on user instruction. Do not write runtime source, schemas, content JSON, UI, tests, generated output, or `docs/dev/current-codex-output.md` unless this becomes an actual Codex run.