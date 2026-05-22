# Current GPT Handoff

Source route: Codex continuity alignment after `Version 0.5.72 - Bloodlines Read-Only Account Meta UI`
Date: 2026-05-22
Branch/status assumption: `master`; use `docs/dev/current-codex-output.md` for the exact latest Codex run state.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records only current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/design/future-system-design-ledger.md` owns durable system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.
- Focused `docs/design/` guardrail docs are temporary. Keep, mark consumed, fold, or delete them when a cleanup pass consumes their guidance.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.72 - Bloodlines Read-Only Account Meta UI`

Recent results:

- `0.5.71` added the pure, read-only Bloodlines projection in `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts`.
- `0.5.72` rendered that projection read-only in the account meta / launcher surface.
- Bloodlines now appears beside Legacy and Chronicles.
- The Bloodlines slice has projection plus read-only UI landed.
- The UI displays explicit family records, Family Prestige ledger totals, family unlock summaries, linked run/tree summaries, safe empty state copy, and inactive future-system notes.
- No mutation path, command id, button, purchase/spend/claim/register/transfer action, family management behavior, Backstory Eligibility evidence, or deferred runtime system was added.

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

## Temporary Guardrail Docs

Current status:

- `docs/design/bloodlines-information-architecture-audit.md` - partially consumed by `0.5.71` and `0.5.72`; keep for future richer tree/Bloodlines presentation constraints.
- `docs/design/chronicles-bloodline-tree-presentation-plan.md` - partially consumed by read-only UI; keep for richer tree presentation, hierarchy, and Chronicle/Bloodlines boundaries.
- `docs/design/heirloom-and-bequest-systems-plan.md` - keep as the active heirloom/bequest planning artifact.
- `docs/design/legacy-scope-bloodline-economy-plan.md` - keep for Family Prestige, scoped evidence, Chronicle Marks, Lineage Seals, and economy boundary rules.
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md` - consumed by the heirloom/bequest plan and ledger, but retained as a compact checklist until a later inheritance-runtime readiness pass retires it.
- `docs/design/backstory-legacy-purchase-content-draft.json`, `docs/design/backstory-legacy-purchase-integration-plan.md`, and `docs/design/backstory-evidence-ownership-plan.md` remain useful for deferred scoped Backstory Legacy evidence.
- `docs/dev/prompt-template-hardening-pass.md` remains useful for generating future narrow prompts.

## Next Direction

Choose the next version from `docs/dev/project-roadmap.md` after this cleanup.

Recommended immediate next version:

- `Version 0.5.74 - Typecheck Script And Target Policy Cleanup`

Why:

- It is a small foundation-stabilization pass before more UI/view-model work.
- It keeps known broad typecheck blockers separate from gameplay features.
- It should make validation targets clearer without weakening strictness.

Use `docs/dev/typecheck-blocker-triage-plan.md` as the source plan for that pass.

After that, the best owner-aware feature-planning candidate is likely:

- `Version 0.5.75 - Chronicle Run-End Summary View Model Plan`

Use `docs/design/chronicle-run-end-summary-source-audit.md` for that later pass. Do not broaden into runtime payout, estate delivery, Chronicle Marks, Lineage Seals, Family Prestige grants, Bloodlines behavior, or generated UI output.
