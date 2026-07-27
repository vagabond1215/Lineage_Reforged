# Current GPT Handoff

Date: 2026-07-26

## Status

- Latest completed primary remains `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains the active parent primary and has not begun authoring.
- The narrow BOM repair implementation landed at commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01`.
- That commit changes only `tests/unit/region-first-world-data.test.mjs` and `tests/unit/slug-content.test.mjs`.
- Both readers now remove one optional leading `U+FEFF` before `JSON.parse`.
- The repair has not yet been accepted because validation results, content byte-identity evidence, coordination completion, and exact parent-prompt restoration are not committed.
- Active support prompt: `Version 0.6.6.2 - BOM Repair Post-Validation And Parent Prompt Restoration`.
- Active prompt blob: `5d4aa0a0961065f4cfea0968317b8e7f0df4c190`.
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

## Repair Evidence

Pinned pre-repair coordination head:

`895c02df40332c813a8403bd489af6184111ccba`

Pinned repair commit:

`66f12fd6f649f8f218f7f49fc721a8fe545a7a01`

The exact repair range must contain only the two named test files and no content change.

Accepted repair operation:

```js
JSON.parse(raw.replace(/^\uFEFF/, ""))
```

No broad `trim()`, content normalization, production parser, dependency, assertion change, or unrelated test change is allowed.

## Exact `0.6.6.2` Scope

The active pass is validation and coordination only.

It must not edit:

- source or test files;
- JSON content;
- schemas or validators;
- runtime or persistence;
- UI or gameplay;
- dependencies, assets, or generated output.

After successful validation only, it may update:

- current output;
- this handoff;
- the route register;
- the planning-anchor reconciliation;
- the strategic continuity brief;
- the current prompt solely by restoring exact parent blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Required Validation

1. Verify commit `66f12fd6f649f8f218f7f49fc721a8fe545a7a01` and its exact two-file repair scope.
2. Run:

   `node --test tests/unit/region-first-world-data.test.mjs tests/unit/slug-content.test.mjs`

3. Run:

   `npm.cmd run tool:content-lint`

4. Run:

   `node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

5. Require all named tests to pass and the parent baseline to report `146/146` unless a legitimate current count change is fully explained.
6. Prove `packages/content` is unchanged from `895c02df40332c813a8403bd489af6184111ccba`.
7. Run conflict-marker, trailing-whitespace, `git diff --check`, changed-path, and full-diff checks.
8. Restore the exact parent prompt only after every gate passes.
9. Stop without running `0.6.6` in the same pass.

## Failure Behavior

If any gate fails, make no edits, leave `0.6.6.2` active, and report the exact blocker. Do not repair tests opportunistically in this pass.

## Near-Term Sequence

1. complete `0.6.6.2` and restore the exact parent prompt;
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
- Normal, Committed, Ironbound, Mortal Crisis, resurrection, and final closure remain controlling documentation authority;
- current HP zero may still enter legacy terminal archival and save deletion;
- generic event ids remain collision-prone;
- current random/hash mechanisms are not named uncertainty-channel authority;
- no active functional/lethal/care receipt, injury instance, body/restoration runtime, or correction tooling exists;
- no dynamic monster/ecology/loot behavior is authorized;
- the isolated `0.7` readiness-audit branch is noncontrolling and must not be merged by this support pass.

## Active Prompt

`Version 0.6.6.2 - BOM Repair Post-Validation And Parent Prompt Restoration`

Active prompt blob:

`5d4aa0a0961065f4cfea0968317b8e7f0df4c190`

Suggested commit:

`docs(routes): accept bom repair and restore 0.6.6`
