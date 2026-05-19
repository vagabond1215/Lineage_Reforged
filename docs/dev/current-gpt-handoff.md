# Current GPT Handoff

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Branch/status assumption: GitHub `master` inspected through the connector. No local commands, tests, builds, or typechecks were run by this pass.

## Purpose

This file is the short current handoff from ChatGPT/GitHub Connector work to future Codex work. It should contain only current connector-side findings, immediate prompt guardrails, and follow-up context that materially affects upcoming development.

This is not a transcript, backlog, roadmap, or durable design ledger. Prune or replace stale entries when their useful guidance moves into another document.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- This file records current connector-side audits, prompt guardrails, and immediate risks.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, playability checkpoints, and the lightweight audit queue.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria, vocabulary rules, conceptual boundaries, and open design questions.
- `docs/dev/project-vision-and-continuity-brief.md` remains the strategic north-star and source map until it is fully decomposed.
- `docs/future_content_backlog.md` remains the chronological deferred-work and run-note ledger.
- If this file conflicts with a newer Codex handoff, trust the newer Codex handoff for exact implementation state and update this file if needed.
- Do not update `docs/dev/current-codex-output.md` from a GPT/GitHub Connector planning pass.

## Current Repo Anchor

Latest exact Codex handoff:

- `Version 0.5.63 - Backstory Legacy Purchase Runtime Shape`
- Result: family-scoped unlock ownership shape and read-only Backstory Legacy purchase evidence helper landed.
- Still not added: Backstory Legacy purchase content records, resolver purchase integration, creator purchase integration, Legacy purchase UI, Family Prestige earn/spend behavior, family tree UI, heirs, heirlooms, bequests, Chronicle Marks, Lineage Seals, and visible backstory availability changes.

Next recommended implementation version remains:

- `Version 0.5.64 - Backstory Legacy Purchase Content Draft`

## Current Pipeline Reminder

Keep this order unless a newer handoff supersedes it:

1. `Version 0.5.64 - Backstory Legacy Purchase Content Draft`
2. `Version 0.5.65 - Backstory Legacy Purchase Resolver Integration`
3. `Version 0.5.66 - Heirloom And Bequest Systems Plan`
4. `Version 0.5.67 - Bloodlines View Model Implementation Plan`
5. `Version 0.5.68 - Bloodlines Read-Only Account Meta UI`

## Immediate Guardrails

### `0.5.64` Content Exposure Guardrail

`packages/content/base/player/legacy_unlocks.json` is a live catalog, not a hidden draft catalog.

Do not add naive live Backstory Legacy records if the acceptance criteria require no visible Legacy UI or purchase behavior change.

Use one of these routes explicitly:

1. Keep `0.5.64` as a draft-only content pass outside the live imported Legacy catalog, with tests/docs proving it is not imported at runtime.
2. Add a minimal live-catalog guard before or alongside records so backstory-tagged `catalog_only`/`backlog` records cannot appear in account-meta purchase lists and cannot be purchased through `purchaseLegacyUnlock(...)` until an approved purchase surface exists.
3. If live records are intentionally visible/purchasable, state that as a visible behavior change and do not pretend it is a no-visible-change content draft.

Minimum acceptance criteria if live records are added:

- deliberate `backstory` / `backstory_legacy` tags only where intended
- explicit `scope: "family"` for family-scoped records
- unsupported scopes excluded or warned by the Backstory purchase evidence helper
- tests proving hidden/backlog/catalog-only backstory records do not become purchase buttons unless intentionally exposed
- tests proving hidden/backlog/catalog-only backstory records are not purchasable unless intentionally exposed
- tests proving creator availability does not change and no fabricated `legacyPurchaseIds` or `familyId` enter resolver evidence

### `0.5.65` Family Context Seam Guardrail

`0.5.65` should be a caller-seam integration, not a resolver redesign.

Use the existing seam:

```text
BackstoryCreatorAvailabilityOptions
  -> buildBackstoryEligibilityEvidenceInput(...)
  -> resolveBackstoryEligibility(...)
```

Rules:

- The caller that builds `legacyPurchaseIds` is the trust boundary.
- Use `resolveOwnedBackstoryLegacyPurchaseIds(...)` or an equivalent scoped helper.
- Do not hand-copy ids from account/family storage into resolver evidence.
- Do not invent `familyId` from `sourceRunId`, `lineageId`, account id, or UI state.
- Until a real family-selection/Bloodlines context exists, pass account-scoped purchases only or leave `familyId` absent.
- Family-scoped purchases must not unlock without a matching explicit `familyId`.
- Do not add a family picker, Bloodlines UI, family management, Family Prestige spending, or automatic family creation as part of `0.5.65`.

Minimum acceptance criteria for `0.5.65`:

- tests prove `legacyPurchaseIds` and `familyId` are carried only when explicitly supplied
- tests prove account-scoped purchases satisfy resolver rules only when collected by the ownership helper
- tests prove family-scoped purchases fail without a matching explicit `familyId`
- tests prove wrong-family ownership fails
- tests prove unsupported scoped purchases warn/exclude rather than unlock
- tests prove source-run/heir selection alone does not imply family purchase ownership
- tests prove selected-backstory starter effects do not stack with parent/child backstory effects

## Recent Connector Work Folded Elsewhere

### Long-Term Roadmap

`docs/dev/project-roadmap.md` exists and owns version-band meaning, active pipeline order, lightweight audit queue, playability checkpoints, and major deferred systems.

### Future System Design Ledger

`docs/design/future-system-design-ledger.md` now exists and owns durable conceptual memory:

- design criteria
- vocabulary rules
- Legacy / Chronicle / Bloodlines boundaries
- renown rules
- backstory ownership rules
- Bloodline / bequest / heirloom distinctions
- magic, combat, economy, calendar, property, governance, UI criteria
- open conceptual clarification questions

Use the ledger instead of expanding this handoff with long-lived design philosophy.

### Typecheck Triage

The temporary `docs/dev/typecheck-blocker-triage-plan.md` was removed after its useful findings were folded into this handoff. Preserve these facts:

- root `package.json` calls `tsc --noEmit -p tsconfig.json`
- TypeScript is declared under `apps/rpg-ui`, not root
- root `tsconfig.json` performs a broad strict sweep
- UI has its own Vite/React tsconfig
- JSON import attributes need a policy, not one-off edits
- missing `process` types need environment-boundary cleanup
- `exactOptionalPropertyTypes` issues should be fixed by area, not suppressed globally

Suggested future cleanup remains:

- `Version 0.5.69 - Typecheck Script And Target Policy Cleanup`
- Route: Codex 5.5 Local

### Creator Terminology

Durable terminology rules have moved to `docs/design/future-system-design-ledger.md`.

Useful near-term cleanup candidate remains:

- `Version 0.5.69 - Creator Terminology Cleanup`
- Route: Codex 5.5 Local unless the pass is docs-only
- Keep separate from `0.5.64` / `0.5.65` unless touching the same creator presentation lines

### Backlog Ordering

Treat `docs/future_content_backlog.md` as historical chronological run notes plus deferred-work tracking. Do not let old same-day notes override:

1. current Codex output
2. current GPT handoff
3. roadmap
4. continuity brief
5. future-system design ledger for durable criteria

Do not rewrite the backlog into a fake current plan. Add or prune only when a Codex run actually adds, defers, narrows, or re-scopes future content, or when a safe docs-only precedence header pass is explicitly run.

## Instructions For Future Codex Runs

Before substantial Codex work, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md` when version order, playability checkpoints, or tool routing matter
- `docs/design/future-system-design-ledger.md` when design criteria, vocabulary, or future-system boundaries matter
- `docs/dev/project-vision-and-continuity-brief.md` when strategic direction or source history matters
- `docs/future_content_backlog.md` when deferred work, historical run notes, or scope changes matter

Do not treat this file as permission to implement broad cleanup or feature work. Use it to avoid repeating connector-side analysis and to keep future prompts narrower.

## Useful GPT/GitHub Connector Passes Still Available

These remain light enough for GPT/GitHub Connector before Codex implementation work:

- Bloodlines Information Architecture Audit
- Heirloom vs Bequest Vocabulary Audit
- Chronicle Run-End Summary Source Audit
- Combat Audit Scoping Pass
- Magic Runtime Readiness Audit
- Economy Clarity Audit
- Calendar / Climate Popup IA Audit
- Prompt Template Hardening Pass
- Documentation guidance file maintenance

Escalate to Codex Local when files must be edited beyond docs, validation must be run, or runtime/source/content/schema/UI behavior changes.

## Maintenance Rules For This File

- Update this file after meaningful GPT/GitHub Connector, Deep Research, or Agent Mode work that affects immediate repo direction, prompts, risks, or future Codex instructions.
- Prefer replacing stale sections over appending indefinitely.
- Move durable design rules to `docs/design/future-system-design-ledger.md`.
- Move long-term ordering to `docs/dev/project-roadmap.md`.
- Move chronological deferrals to `docs/future_content_backlog.md`.
- Remove findings once they are implemented, superseded, or no longer useful.
- Keep exact historical detail in git commits, not in this file.
- Keep this file short enough for Codex to read at the start of a run without wasting context.
