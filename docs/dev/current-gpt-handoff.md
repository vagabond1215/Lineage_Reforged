# Current GPT Handoff

Source route: Codex 5.5 Local cleanup of stale connector handoff, then GitHub Connector docs cleanup
Date: 2026-05-21
Branch/status assumption: `master`; use `docs/dev/current-codex-output.md` for the exact latest Codex run state.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records only current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/design/future-system-design-ledger.md` owns durable system criteria and vocabulary.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.
- Focused `docs/design/` guardrail docs remain temporary; delete or fold them after their guidance is implemented, superseded, or promoted.

## Current Backstory Legacy Anchor

- `Version 0.5.67 - Backstory Legacy Live Content Migration` migrated five low-risk Backstory Legacy records into the live Legacy unlock catalog as account-scoped, live, unlock-only records.
- `Version 0.5.68 - Backstory Legacy Purchase Resolver Integration` wired owned account-scoped purchases into creator availability through `resolveOwnedBackstoryLegacyPurchaseIds(...)`.
- `Version 0.5.69 - Backstory Legacy Creator Copy And Handoff Cleanup` aligned player-facing locked copy, policy metadata, and this handoff/roadmap after the resolver integration.

Live low-risk records:

- `legacy.backstory.street_vendor` -> `backstory.street_vendor`
- `legacy.backstory.net_tender` -> `backstory.net_tender`
- `legacy.backstory.gatherer` -> `backstory.gatherer`
- `legacy.backstory.scribes_apprentice` -> `backstory.scribes_apprentice`
- `legacy.backstory.kitchen_hand` -> `backstory.kitchen_hand`

Creator behavior:

- The character creator caller collects owned account Backstory Legacy purchase ids with `resolveOwnedBackstoryLegacyPurchaseIds(...)`.
- Each owned live account-scoped purchase makes only its matching formative backstory selectable.
- The creator does not infer or supply `familyId`.
- Family-owned Backstory Legacy records do not unlock creator availability without an explicit real family context.

## Guardrails Still Active

- Future Backstory Legacy records must describe formative-past access, not current employment, current social identity, family history proof, institution membership, title/status ownership, contacts, items, coin, skills, magic, authority, or live obligations.
- Do not add creator purchase buttons or redesign the account meta purchase surface without a dedicated prompt.
- Family, source-run, region, institution, estate/title, heir-only, next-run, and preparation-scoped Backstory Legacy evidence remain deferred until their owner systems and storage seams exist.
- Higher-risk Backstory Legacy candidates remain deferred.
- No `familyId` may be derived from `sourceRunId`, `lineageId`, account id, selected character, selected backstory, or UI state.
- Tier 2 and Tier 3 Backstory Legacy paths still need scoped evidence plus support; purchase evidence alone must not unlock them.

## Temporary Guardrail Docs

Keep these while related future planning is active:

- `docs/design/backstory-legacy-purchase-content-draft.json`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/bloodlines-information-architecture-audit.md`
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md`
- `docs/dev/prompt-template-hardening-pass.md`

The low-risk account-scoped Backstory Legacy slice is no longer the active implementation target. Future work should move back to the roadmap sequence unless a newer Codex handoff supersedes it.

## Next Direction

Recommended next version:

- `Version 0.5.70 - Heirloom And Bequest Systems Plan`

Keep it planning-only unless the user explicitly scopes implementation. Avoid adding heir systems, heirlooms, bequests, Family Prestige spending, Bloodlines UI, or scoped Backstory Legacy evidence in that pass.

## Next Prompt Source Stack

For the `0.5.70` prompt, inspect these first:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/bloodlines-information-architecture-audit.md`
- `docs/future_content_backlog.md`

The expected output should be a planning document or updated handoff only. Do not write runtime source, schemas, content JSON, UI, tests, generated output, or `docs/dev/current-codex-output.md` unless this becomes an actual Codex run.