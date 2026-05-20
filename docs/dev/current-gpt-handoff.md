# Current GPT Handoff

Source route: ChatGPT via GitHub Connector
Date: 2026-05-20
Branch/status assumption: GitHub `master` inspected through the connector. No local commands, tests, builds, or typechecks were run by this pass.

## Purpose

This file is the short current handoff from ChatGPT/GitHub Connector work to future Codex work. It should contain only current connector-side findings, immediate prompt guardrails, and follow-up context that materially affects upcoming development.

This is not a transcript, backlog, roadmap, durable design ledger, or archive of every connector audit. Prune or replace stale entries when their useful guidance moves into another document.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- This file records current connector-side audits, prompt guardrails, and immediate risks.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, playability checkpoints, and the lightweight audit/source index.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria, vocabulary rules, conceptual boundaries, and open design questions.
- `docs/dev/project-vision-and-continuity-brief.md` remains the strategic north-star and source map until it is fully decomposed.
- `docs/future_content_backlog.md` remains the chronological deferred-work and run-note ledger.
- Focused audit/source docs under `docs/design/` or `docs/dev/` are temporary guardrails while they are useful. Delete or fold them after their guidance is implemented, superseded, or promoted into a durable authority file.
- If this file conflicts with a newer Codex handoff, trust the newer Codex handoff for exact implementation state and update this file if needed.
- Do not update `docs/dev/current-codex-output.md` from a GPT/GitHub Connector planning pass.

## Current Repo Anchor

Latest exact Codex handoff:

- `Version 0.5.64 - Backstory Legacy Purchase Content Draft`
- Result: Route A landed. Added `docs/design/backstory-legacy-purchase-content-draft.json` as draft-only, non-runtime Backstory Legacy purchase content outside the live Legacy catalog, with focused guard tests proving inertness.
- The draft contains five low-risk Tier 1 candidates only: `legacy.backstory.street_vendor`, `legacy.backstory.net_tender`, `legacy.backstory.gatherer`, `legacy.backstory.scribes_apprentice`, and `legacy.backstory.kitchen_hand`.
- The draft is not imported by Legacy runtime, account meta UI, Backstory Eligibility resolver, or character creator.
- No live records were added to `packages/content/base/player/legacy_unlocks.json`.
- No resolver purchase wiring, creator purchase behavior, Legacy purchase UI, Family Prestige earn/spend behavior, family tree UI, heirs, heirlooms, bequests, Chronicle Marks, Lineage Seals, or visible backstory availability changes were added.

Connector follow-up after 0.5.64:

- Hardened the draft wording so Backstory Legacy draft entries describe formative past conditions that shaped the new character, not current jobs, present identities, social status, employment, or obligations.
- Split draft record copy into `playerFacingSummary` and `implementationSummary` so player-suitable future copy does not contain Codex/runtime words like future, purchase, account-level, eligibility, resolver, catalog, or guardrail.
- Added/updated test guards so the draft no longer uses overloaded `summary` fields and future player-facing copy remains past-shaping rather than implementation-facing.
- These connector edits did not run local tests and did not update `docs/dev/current-codex-output.md`.

Next recommended action:

- Do **not** jump directly into normal resolver integration until live purchase content exposure is decided.
- Run `Version 0.5.65 - Backstory Legacy Live Content Readiness Decision` first, or make 0.5.65 a planning/readiness pass that decides whether the five draft candidates remain draft-only, migrate into live guarded Legacy records, or require a minimal live-catalog visibility/purchase guard.

## Current Pipeline Reminder

Keep this order unless a newer handoff supersedes it:

1. `Version 0.5.65 - Backstory Legacy Live Content Readiness Decision`
2. `Version 0.5.66 - Backstory Legacy Purchase Resolver Integration` only after live purchase ownership/exposure is approved
3. `Version 0.5.67 - Heirloom And Bequest Systems Plan`
4. `Version 0.5.68 - Bloodlines View Model Implementation Plan`
5. `Version 0.5.69 - Bloodlines Read-Only Account Meta UI`

The numeric labels above intentionally shift the previous resolver-integration run back by one slot because 0.5.64 landed as draft-only non-runtime content. Resolver integration remains unsafe until there is live runtime-owned purchase content or an explicit decision that resolver wiring should ignore the draft.

## Immediate Guardrails

### Backstory Principle

Backstories describe the formative past that shaped the new character. They are not current job titles, current social identities, current employment, current obligations, owned status, family history proof, institution membership, or live authority.

For Backstory Legacy draft/live content:

- Player-facing copy should describe past shaping pressure: learned, shaped, trained, raised, worked, served, endured, practiced.
- Player-facing copy must avoid implementation wording: future, low-risk, account-level, support purchase, purchase, eligibility, runtime, resolver, catalog, draft-only, guardrail.
- Internal implementation guidance belongs in `implementationSummary`, guardrails, tests, or design notes.
- Do not use Backstory Legacy purchases to fabricate a current identity or present role.

### Live Content Exposure Guardrail

`packages/content/base/player/legacy_unlocks.json` is a live catalog, not a hidden draft catalog.

The current Backstory Legacy draft lives in `docs/design/backstory-legacy-purchase-content-draft.json` and is intentionally non-runtime. Do not assume those draft ids are owned purchase ids, visible purchase records, or resolver-valid evidence.

Before migrating draft records into live content, choose one route explicitly:

1. Keep draft-only content outside the live imported Legacy catalog, with tests/docs proving it is not imported at runtime.
2. Add a minimal live-catalog guard before or alongside records so backstory-tagged `catalog_only`/`backlog`/draft records cannot appear in account-meta purchase lists and cannot be purchased through `purchaseLegacyUnlock(...)` until an approved purchase surface exists.
3. If live records are intentionally visible/purchasable, state that as a visible behavior change and do not pretend it is a no-visible-change content draft.

Minimum acceptance criteria if live records are added:

- deliberate `backstory` / `backstory_legacy` tags only where intended;
- explicit `scope: "family"` only for family-scoped records with actual family ownership;
- unsupported scopes excluded or warned by the Backstory purchase evidence helper;
- tests proving hidden/backlog/catalog-only/draft backstory records do not become purchase buttons unless intentionally exposed;
- tests proving hidden/backlog/catalog-only/draft backstory records are not purchasable unless intentionally exposed;
- tests proving creator availability does not change unless intentionally scoped;
- tests proving no fabricated `legacyPurchaseIds` or `familyId` enter resolver evidence.

### Resolver Integration Guardrail

Resolver integration should be a caller-seam integration, not a resolver redesign.

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
- Do not add a family picker, Bloodlines UI, family management, Family Prestige spending, or automatic family creation as part of resolver integration.

Minimum acceptance criteria for eventual resolver integration:

- tests prove `legacyPurchaseIds` and `familyId` are carried only when explicitly supplied;
- tests prove account-scoped purchases satisfy resolver rules only when collected by the ownership helper;
- tests prove family-scoped purchases fail without a matching explicit `familyId`;
- tests prove wrong-family ownership fails;
- tests prove unsupported scoped purchases warn/exclude rather than unlock;
- tests prove source-run/heir selection alone does not imply family purchase ownership;
- tests prove selected-backstory starter effects do not stack with parent/child backstory effects.

## Focused Audit / Source Docs

These docs were created by connector-safe audit passes. Use them only when their topic is active, and remove or fold them after they stop being useful.

- `docs/design/backstory-legacy-purchase-content-draft.json` for Backstory Legacy live-content readiness decisions. Keep until draft records are migrated into approved runtime content or rejected.
- `docs/design/backstory-legacy-purchase-integration-plan.md` for Backstory Legacy purchase live-content and resolver integration. Keep through resolver integration, then fold durable rules into ledger/handoff as needed.
- `docs/design/backstory-evidence-ownership-plan.md` for resolver/evidence source ownership boundaries. Keep through resolver evidence integration.
- `docs/design/legacy-scope-bloodline-economy-plan.md` for Bloodlines, family-scoped purchases, bequests, heirlooms, and scoped Legacy economy work.
- `docs/design/bloodlines-information-architecture-audit.md` for Bloodlines view-model and read-only UI work.
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md` for heirloom/bequest planning.
- `docs/design/chronicle-run-end-summary-source-audit.md` for future run-end summary planning.
- `docs/design/combat-audit-scoping-pass.md` before combat/equipment implementation.
- `docs/design/magic-runtime-readiness-audit.md` before magic runtime/acquisition work.
- `docs/design/economy-clarity-audit.md` before economy clarity view-model/UI work.
- `docs/design/calendar-climate-popup-ia-audit.md` before calendar/climate popup work.
- `docs/dev/prompt-template-hardening-pass.md` when generating future Codex/GitHub Connector prompts.

Temporary guardrail lifecycle:

1. Keep a focused audit/source doc while it prevents confusion for an upcoming implementation or plan.
2. When a Codex run consumes it, decide whether its guidance should move into `current-gpt-handoff.md`, `project-roadmap.md`, `future-system-design-ledger.md`, `future_content_backlog.md`, or `current-codex-output.md`.
3. Delete the focused audit/source doc after its useful guidance is implemented, superseded, or promoted into a durable file.
4. Do not let temporary guardrail files accumulate as a second backlog.

## Recent Connector Work Folded Elsewhere

### Long-Term Roadmap

`docs/dev/project-roadmap.md` owns version-band meaning, active pipeline order, focused audit/source index, playability checkpoints, and major deferred systems. It may need a small roadmap maintenance pass after the next Codex readiness decision if the 0.5.65/0.5.66 sequence is accepted.

### Future System Design Ledger

`docs/design/future-system-design-ledger.md` owns durable conceptual memory:

- design criteria;
- vocabulary rules;
- Legacy / Chronicle / Bloodlines boundaries;
- renown rules;
- backstory ownership rules;
- Bloodline / bequest / heirloom distinctions;
- magic, combat, economy, calendar, property, governance, UI criteria;
- open conceptual clarification questions.

Use the ledger instead of expanding this handoff with long-lived design philosophy.

### Typecheck Triage

The temporary `docs/dev/typecheck-blocker-triage-plan.md` was removed after its useful findings were folded into this handoff. Preserve these facts:

- root `package.json` calls `tsc --noEmit -p tsconfig.json`;
- TypeScript is declared under `apps/rpg-ui`, not root;
- root `tsconfig.json` performs a broad strict sweep;
- UI has its own Vite/React tsconfig;
- JSON import attributes need a policy, not one-off edits;
- missing `process` types need environment-boundary cleanup;
- `exactOptionalPropertyTypes` issues should be fixed by area, not suppressed globally.

Suggested future cleanup remains:

- `Version 0.5.70+ - Typecheck Script And Target Policy Cleanup`
- Route: Codex 5.5 Local

### Creator Terminology

Durable terminology rules have moved to `docs/design/future-system-design-ledger.md`.

Useful near-term cleanup candidate remains:

- `Version 0.5.70+ - Creator Terminology Cleanup`
- Route: Codex 5.5 Local unless the pass is docs-only
- Keep separate from Backstory Legacy live-content/readiness and resolver integration unless touching the same creator presentation lines.

### Backlog Ordering

Treat `docs/future_content_backlog.md` as historical chronological run notes plus deferred-work tracking. Do not let old same-day notes override:

1. current Codex output;
2. current GPT handoff;
3. roadmap;
4. continuity brief;
5. future-system design ledger for durable criteria.

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
- focused audit/source docs only when the active task explicitly references their topic

Do not treat this file as permission to implement broad cleanup or feature work. Use it to avoid repeating connector-side analysis and to keep future prompts narrower.

## Maintenance Rules For This File

- Update this file after meaningful GPT/GitHub Connector, Deep Research, or Agent Mode work that affects immediate repo direction, prompts, risks, or future Codex instructions.
- Prefer replacing stale sections over appending indefinitely.
- Move durable design rules to `docs/design/future-system-design-ledger.md`.
- Move long-term ordering to `docs/dev/project-roadmap.md`.
- Move chronological deferrals to `docs/future_content_backlog.md`.
- Remove findings once they are implemented, superseded, or no longer useful.
- Keep exact historical detail in git commits, not in this file.
- Keep this file short enough for Codex to read at the start of a run without wasting context.