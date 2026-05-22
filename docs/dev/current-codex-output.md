# Current Codex Output

Source version/run: Version 0.5.70 - Heirloom And Bequest Systems Plan
Date: 2026-05-21
Branch/status assumption: Ran locally on `master`; initial `git status --short --branch` was clean at `## master...origin/master`.

## Result

Created `docs/design/heirloom-and-bequest-systems-plan.md` as the active planning-only heirloom/bequest design artifact. The plan separates Bloodline upgrades, bequests, heirlooms, estate assets, Family Prestige, Chronicle Marks, Lineage Seals, and Backstory support without implementing runtime behavior.

Added a concise run note to `docs/future_content_backlog.md`. No runtime source, schemas, tests, content JSON, UI components, generated output, or current handoff/roadmap files were changed.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/bloodlines-information-architecture-audit.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/future_content_backlog.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/account-family.ts`
- `packages/engines/game-engine/src/account-estate.ts`
- `packages/engines/game-engine/src/legacy-account.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `tests/unit/account-family.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`
- `tests/unit/legacy-unlocks.test.mjs`

## Files Changed

- `docs/design/heirloom-and-bequest-systems-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Planning Summary

- Bloodline: family-scoped inherited tendency, aptitude, temperament, growth, resistance, prestige affinity, or family potential. It is not a material transfer or backstory identity.
- Bequest: intentional material, estate, legal, household, or claim-based transfer. It requires source owner and recipient/claimant rules and must not grant genetic traits, stat tendencies, or social identity by itself.
- Heirloom: one specific persistent item instance with an ownership chain. It requires `heirloomId`, `itemInstanceId`, `familyId`, current holder or unavailable state, and transfer history before runtime behavior is safe.
- Estate asset: stored material/property/legal/operational asset or claim. It can store or preview assets, but does not prove delivery, status, title, or family legitimacy.
- Family Prestige: family-ledger resource that may later fund family-scoped actions. It is not proof that an item, bequest, estate asset, transfer, or effect exists.
- Chronicle Mark: future account-wide milestone/progression mark. It must not fabricate family-specific item, estate, or status history for unrelated families.
- Lineage Seal: future rare capstone or branch-closure benchmark. It should not become a farmable generic currency.
- Backstory support: resolver-owned formative-origin access support only. Bequests, heirlooms, Bloodline upgrades, estate assets, Family Prestige, Chronicle Marks, and Lineage Seals do not directly unlock Backstory identity.

## Current Repo Reality Confirmed

- Account profiles currently include `legacy`, `achievements`, `history`, `families`, and `estate`.
- Family state currently supports family records, Family Prestige transactions, and family unlock ownership.
- `account-family.ts` supports passive Family Prestige totals and family unlock lookups.
- Family Prestige grant/spend transaction shape exists, but earning/spending behavior is not implemented beyond stored ledger records and passive totals.
- Legacy unlock ownership exists on the account profile, including the live low-risk account-scoped Backstory Legacy records from the previous slice.
- Estate state supports deposits and stored assets for currency, item, and operational asset previews.
- Estate claim presentation is preview-only; assets remain stored until a later delivery seam moves them.
- Account meta presentation currently renders Legacy and Chronicles, including estate summaries, but does not render Bloodlines.
- No heirloom runtime exists.
- No bequest runtime exists.
- No estate transfer/claim execution behavior exists beyond preview.
- No item-instance persistence suitable for heirlooms was confirmed. The repo has `instanceId` for settlement building instances, but no current player item-instance heirloom ownership chain.
- No heir system, heir slots, active family management UI, Chronicle Marks, or Lineage Seals exist.
- Scoped Backstory Legacy evidence remains deferred beyond the landed account-scoped low-risk slice.

## Behavior / Runtime Confirmation

- Runtime source changed: no.
- Schemas changed: no.
- Tests changed: no.
- Content JSON changed: no.
- UI changed: no.
- Generated output changed: no.
- Backstory Eligibility behavior changed: no.
- Family Prestige behavior changed: no.
- Heirloom/bequest runtime behavior added: no.
- Deferred systems touched: planning only.

## Tests / Checks Run

- `npm.cmd run tool:content-lint` - passed; `content-lint: ok (53 files checked)`.
- `git diff --check` - passed after the output update with Windows line-ending warnings only.
- `Select-String -Path docs/design/heirloom-and-bequest-systems-plan.md -Pattern '[ \t]$'` - passed; no trailing whitespace reported in the new untracked plan file.

Broad typecheck was not run because this was docs-only and the repo has known broad workspace typecheck blockers.

## Risks / Follow-Up

- The plan is intentionally non-runtime; future implementation still needs contract readiness, validation, pure helpers, view models, UI, spending semantics, and mutating behavior in separate passes.
- Heirloom work remains blocked on a real player item-instance owner and a holder/availability state model.
- Bequest work remains blocked on estate/material/legal claim execution and explicit recipient/claimant rules.
- Family Prestige spending remains blocked on exact spend references and failure-state validation.
- Bloodlines presentation remains blocked on a view-model/read-only UI pass.
- Chronicle Marks and Lineage Seals still need separate economy and capstone design before implementation.
- Backstory support remains resolver-owned; future scoped evidence must not be inferred from family display, bequest labels, heirloom labels, or estate assets.

## Temporary Guardrail Cleanup Decision

Kept `docs/design/heirloom-vs-bequest-vocabulary-audit.md`. The new plan consumes and expands it, but the audit remains useful as a compact checklist until a later implementation-readiness or cleanup pass folds durable rules into `docs/design/future-system-design-ledger.md`.

Kept `docs/design/legacy-scope-bloodline-economy-plan.md`. It still carries broader Legacy, Bloodline, Family Prestige, Chronicle Mark, and Lineage Seal economy boundaries that extend beyond this heirloom/bequest plan.

Kept `docs/design/bloodlines-information-architecture-audit.md`. It remains the main source for a future Bloodlines view-model and read-only account meta planning pass.

Kept `docs/design/chronicles-bloodline-tree-presentation-plan.md`. It remains useful for tree presentation, Chronicles placement, and Bloodlines UI sequencing.

The new `docs/design/heirloom-and-bequest-systems-plan.md` becomes the active 0.5.70 heirloom/bequest planning artifact. After future implementation consumes it, durable rules should be folded into `docs/design/future-system-design-ledger.md`, and obsolete temporary guardrail docs should be deleted or retired in a dedicated cleanup pass.

## Next Recommended Version

Version 0.5.71 - Bloodlines View Model Implementation Plan

This is the best next step because the heirloom/bequest vocabulary and ownership boundaries are now planned, while the roadmap still needs a pure, read-only Bloodlines projection before any Bloodlines UI, family management, bequest, heirloom, Family Prestige spending, or scoped Backstory evidence behavior.

## Suggested Commit Message

docs(design): plan heirloom and bequest systems
