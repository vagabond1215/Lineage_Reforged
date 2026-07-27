# Current GPT Handoff

Date: 2026-07-27

## Status

- Latest completed primary remains `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains the active parent primary and has not begun authoring.
- BOM reader repair `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` remains limited to the two intended test readers.
- `0.6.6.2` failed closed at `4/5` and exposed the initial climate contract mismatch.
- `0.6.6.3` landed schema commit `56932eecedd7b28216b23cb5bf211fea7b01df46` and focused climate assertion commit `e71f8f6b625f7b6744492cc8b19ab695f788d89c`, then failed closed on bounded migration evidence.
- `0.6.6.4` landed implementation commit `232d3c2f466e3ec18e620e29a47f4466ae05b84d` with exactly four authorized changed files.
- Focused tests passed `5/5`.
- Content lint passed with `67` files checked.
- `npm.cmd run typecheck:workspace` remained non-green with `173` broad diagnostics and exactly four known unrelated diagnostics across the two changed TypeScript files.
- The `146`-test parent baseline was not run after that audit.
- No parent prompt restoration occurred and `0.6.6` was not executed.
- Two unexecuted `0.6.6.5` prompt variants were superseded: one required zero changed-file diagnostics; the next required a nonexistent complete prior capture.
- Local and `origin/master` were synchronized at `0f677b78e76905ef8d37eb8b4965b127d93d4db1`; the worktree remained clean; no invalid prompt was run.
- Active support prompt remains `Version 0.6.6.5 - Workspace Typecheck Baseline Classification And BOM Acceptance`.
- Corrected active prompt blob: `7b60f7caf417f2d49cdeed7fcdca4a9011010310`.
- Exact parent prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Current Planning Precedence

Use current execution sources in this order:

1. `docs/dev/current-codex-prompt.md`;
2. this handoff;
3. `docs/dev/current-codex-output.md`;
4. `docs/dev/historical-version-and-deferred-route-register.md`;
5. the most specific focused decision;
6. `docs/design/current-planning-anchor-reconciliation.md` for stale roadmap/sequence current-header conflicts;
7. roadmap and sequenced plan for non-conflicting historical and long-term context.

## Landed Region Repair

Implementation commit `232d3c2f466e3ec18e620e29a47f4466ae05b84d` changes exactly:

- `packages/content/base/world/regions.json`;
- `packages/engines/civilization-engine/src/content.ts`;
- `packages/shared/types/src/settlement-institutions.ts`;
- `tests/unit/region-first-world-data.test.mjs`.

It performs exactly five scalar-to-singleton-array migrations, moves the capacity assertion to `simulationProfile.populationCapacity`, and aligns both static climate contracts to `string[]`.

No generator, UI normalization, runtime, save, dependency, gameplay, monster, ecology, or loot file changed.

## Workspace Audit Classification

Repository authority is explicit:

- `typecheck:workspace` is a known-failing audit, not a universal green gate;
- narrow work blocks on new, changed, or implementation-attributable failures, not on the unchanged broad baseline alone;
- broad JSON-import, Node typing, JSX/root-config, target/lib, module-resolution, and strict optional-property cleanup remains a separate route;
- broad cleanup must not be mixed into this support chain.

A complete prior non-pretty capture does not exist. Corrected `0.6.6.5` therefore establishes a fresh baseline through two complete captures under the same clean state.

### Capture A

Capture complete output from:

`npm.cmd run typecheck:workspace -- --pretty false`

Capture A is eligible only when:

- exactly `173` normalized diagnostic tuples are parsed;
- exactly four occur across `packages/engines/civilization-engine/src/content.ts` and `packages/shared/types/src/settlement-institutions.ts`;
- no additional changed-file diagnostic exists;
- no message mentions `climateTendencies`, `RegionContentRecord`, or `InstitutionRegionRecord`;
- each of the four changed-file diagnostics is pinned by path, line, column, code, and complete message;
- source-line inspection, `git diff --unified=0 047bc073..232d3c2f`, and `git blame` prove each diagnostic source statement was untouched by `232d3c2f` and concerns no changed climate/population contract;
- no other diagnostic is reasonably attributable to the implementation.

### Capture B

Without changing tracked files, compiler, dependencies, environment, or command arguments, run the same command again.

Require:

- exactly `173` normalized tuples;
- the complete tuple multiset matches Capture A exactly, including multiplicity;
- the changed-file subset is the same four tuples;
- zero forbidden identifier mentions;
- no implementation-attributable diagnostic.

Report the audit as:

`ran twice; fresh 173-diagnostic baseline established and reproduced; no climate-contract or implementation-attributable diagnostics`

Never report it as passed. Raw captures must remain outside the repository or in an already ignored temporary location and must not be committed.

## Required Validation

1. Verify commit `232d3c2f` has exactly the four authorized files and intended patch.
2. Reconfirm focused tests at `5/5`.
3. Reconfirm content lint at `67`.
4. Establish Capture A and pin the exact four changed-file diagnostic tuples.
5. Prove each tuple is unrelated to `232d3c2f` through source, diff, and blame evidence.
6. Establish Capture B and require exact complete tuple-multiset reproduction.
7. Run the deferred parent baseline:

   `node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

8. Require `146/146` unless a legitimate current count change is fully explained.
9. Prove the BOM repair range contains no content change.
10. Prove the post-`e71f8f6b` content diff contains only the five pinned migrations in `regions.json`.
11. Pass conflict-marker, trailing-whitespace, `git diff --check`, changed-path, full-diff, clean-status, and temporary-artifact checks.
12. Restore the exact parent prompt only after every condition succeeds.
13. Stop without executing `0.6.6` in the same pass.

## Failure Behavior

If either capture differs from the required count or tuple set, a forbidden identifier appears, attribution cannot be proven, a raw capture becomes tracked, or any green gate fails, do not restore the parent prompt or update completion coordination. Do not repair broad TypeScript debt. Leave corrected `0.6.6.5` active and report the smallest owner-correct follow-up.

## Near-Term Sequence

1. complete corrected `0.6.6.5`, accept the support chain, and restore exact `0.6.6`;
2. run exact `0.6.6` in a separate Codex pass;
3. run `0.6.7 - Cross-Content Coherence And Coverage Audit`;
4. run Geographic Knowledge Taxonomy And Location Recognition Contract Plan;
5. run Activity Resolution Existing-System Reuse Audit;
6. run Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision;
7. run bounded physiology/first-aid research only before the first executable or balance-bearing lethal-process catalog;
8. proceed to separately authorized owner-specific implementation packages.

## Preserved Authorities And Known Gaps

- occurrence identity, commitment, correction, and consequence idempotency remain design authority but are not broadly implemented;
- campaign/save topology and technical recovery remain design authority but are not implemented in live save envelopes;
- current HP zero may still enter legacy terminal archival and save deletion;
- generic event ids remain collision-prone;
- current random/hash mechanisms are not named uncertainty-channel authority;
- no active functional/lethal/care receipt, injury instance, body/restoration runtime, or correction tooling exists;
- no dynamic monster/ecology/loot behavior is authorized;
- the isolated `0.7` readiness-audit branch is noncontrolling and must not be merged by this support pass.

## Active Prompt

`Version 0.6.6.5 - Workspace Typecheck Baseline Classification And BOM Acceptance`

Active prompt blob:

`7b60f7caf417f2d49cdeed7fcdca4a9011010310`
