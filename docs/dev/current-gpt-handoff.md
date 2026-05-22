# Current GPT Handoff

Source route: ChatGPT via GitHub Connector sequenced planning pass after `Version 0.5.73 - Bloodlines Handoff And Temporary Guardrail Cleanup`
Date: 2026-05-22
Branch/status assumption: `master`; use `docs/dev/current-codex-output.md` for the exact latest Codex run state.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records only current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` is the immediate prompt-prep handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the current 10-step Codex queue after 0.5.73.
- `docs/design/future-system-design-ledger.md` owns durable system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.
- Focused `docs/design/` guardrail docs are temporary. Keep, mark consumed, fold, or delete them when a cleanup pass consumes their guidance.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.72 - Bloodlines Read-Only Account Meta UI`

Latest cleanup:

- `Version 0.5.73 - Bloodlines Handoff And Temporary Guardrail Cleanup`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.74 - Typecheck Script And Target Policy Cleanup`

## Recent Results

Bloodlines:

- `0.5.71` added the pure, read-only Bloodlines projection in `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts`.
- `0.5.72` rendered that projection read-only in the account meta / launcher surface.
- Bloodlines now appears beside Legacy and Chronicles.
- The UI displays explicit family records, Family Prestige ledger totals, family unlock summaries, linked run/tree summaries, safe empty state copy, and inactive future-system notes.
- No mutation path, command id, button, purchase/spend/claim/register/transfer action, family management behavior, Backstory Eligibility evidence, or deferred runtime system was added.

Backstory Legacy:

- `0.5.67` migrated five low-risk Backstory Legacy records into the live Legacy unlock catalog as account-scoped, live, unlock-only records.
- `0.5.68` wired owned account-scoped purchases into creator availability through `resolveOwnedBackstoryLegacyPurchaseIds(...)`.
- `0.5.69` aligned player-facing locked copy, policy metadata, handoff, and roadmap after resolver integration.

Live low-risk Backstory Legacy records:

- `legacy.backstory.street_vendor` -> `backstory.street_vendor`
- `legacy.backstory.net_tender` -> `backstory.net_tender`
- `legacy.backstory.gatherer` -> `backstory.gatherer`
- `legacy.backstory.scribes_apprentice` -> `backstory.scribes_apprentice`
- `legacy.backstory.kitchen_hand` -> `backstory.kitchen_hand`

## Active Guardrails

Bloodlines:

- Future Bloodlines work must stay owner-aware.
- Do not infer `familyId` from `lineageId`, `sourceRunId`, account id, selected character, selected backstory, or UI state.
- `sourceRunId` may be displayed as context, but it must not create a family or parent relation by itself.
- Family Prestige is ledger-derived and read-only in current UI.
- Do not add family management, Family Prestige earning/spending, heirs, heirlooms, bequests, item-instance persistence, estate transfer/claim execution, Chronicle Marks, Lineage Seals, or scoped Backstory evidence without an explicit prompt and owner plan.
- Bloodlines UI must not create Backstory Eligibility evidence or bypass the creator resolver.

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
- No heirlooms, bequests, item-instance persistence, estate delivery, Family Prestige spending, Chronicle Marks, Lineage Seals, heir systems, or family management behavior exists yet.

## Sequenced Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` for the full queue. Current sequence:

| Order | Version | Topic | Primary Source |
| ---: | --- | --- | --- |
| 1 | `0.5.74` | Typecheck Script And Target Policy Cleanup | `docs/dev/typecheck-blocker-triage-plan.md` |
| 2 | `0.5.75` | Chronicle Run-End Summary View Model Plan | `docs/design/chronicle-run-end-summary-view-model-plan.md` |
| 3 | `0.5.76` | Chronicle Run-End Summary Pure Projection | `docs/design/chronicle-run-end-summary-view-model-plan.md` |
| 4 | `0.5.77` | Chronicle Run-End Read-Only UI | `docs/design/chronicle-run-end-summary-view-model-plan.md` |
| 5 | `0.5.78` | Economy Price Clarity View Model Plan | `docs/design/economy-price-clarity-view-model-plan.md` |
| 6 | `0.5.79` | Economy Price Clarity Pure Projection | `docs/design/economy-price-clarity-view-model-plan.md` |
| 7 | `0.5.80` | Calendar Climate Popup View Model Plan | `docs/design/calendar-climate-popup-view-model-plan.md` |
| 8 | `0.5.81` | Calendar Climate Read-Only Popup | `docs/design/calendar-climate-popup-view-model-plan.md` |
| 9 | `0.5.82` | Combat Equipment Mapping Audit | `docs/design/combat-equipment-mapping-audit-plan.md` |
| 10 | `0.5.83` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` |

Do not skip planning-to-projection-to-UI stages unless a newer handoff or the user explicitly changes the order.

## Temporary Guardrail Docs

Current status:

- `docs/design/bloodlines-information-architecture-audit.md` - partially consumed by `0.5.71` and `0.5.72`; keep for future richer tree/Bloodlines presentation constraints.
- `docs/design/chronicles-bloodline-tree-presentation-plan.md` - partially consumed by read-only UI; keep for richer tree presentation, hierarchy, and Chronicle/Bloodlines boundaries.
- `docs/design/heirloom-and-bequest-systems-plan.md` - keep as the active heirloom/bequest planning artifact.
- `docs/design/legacy-scope-bloodline-economy-plan.md` - keep for Family Prestige, scoped evidence, Chronicle Marks, Lineage Seals, and economy boundary rules.
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md` - consumed by the heirloom/bequest plan and ledger, but retained as a compact checklist until a later inheritance-runtime readiness pass retires it.
- `docs/design/backstory-legacy-purchase-content-draft.json`, `docs/design/backstory-legacy-purchase-integration-plan.md`, and `docs/design/backstory-evidence-ownership-plan.md` remain useful for deferred scoped Backstory Legacy evidence.
- `docs/dev/prompt-template-hardening-pass.md` remains useful for generating future narrow prompts.

## Next Prompt Source Stack

For `Version 0.5.74 - Typecheck Script And Target Policy Cleanup`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/typecheck-blocker-triage-plan.md`
- `package.json`
- `tsconfig.json`
- `apps/rpg-ui/package.json`
- `apps/rpg-ui/tsconfig.json`
- `apps/rpg-ui/tsconfig.node.json`

0.5.74 must stay tooling/config scoped. It should clarify root/app typecheck targets, run the updated commands, record exact results, and avoid gameplay source, schemas, content JSON, UI behavior, generated output, or strictness weakening.

## After 0.5.74

Return to the sequence file. The next feature-planning run should be:

- `Version 0.5.75 - Chronicle Run-End Summary View Model Plan`

Use `docs/design/chronicle-run-end-summary-view-model-plan.md`. Do not broaden into runtime payout, estate delivery, Chronicle Marks, Lineage Seals, Family Prestige grants, Bloodlines behavior, or generated UI output.