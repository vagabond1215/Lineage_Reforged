# Current GPT Handoff

Date: 2026-07-26

## Status

- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains the active primary but is fail-closed before authoring.
- A clean preflight at commit `36f83d0856eb59446af9dfe597cf4e503470a158` confirmed the exact matrix, references, counts, and 28-drop calculation.
- `npm.cmd run tool:content-lint` passed at 67 files.
- The required focused baseline failed at 142/146 because two test harnesses passed BOM-bearing UTF-8 text directly to `JSON.parse`.
- Active support prompt: `Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`.
- Active prompt blob: `93d2a29e1cbc8dd931a243becfbbeab2ed8a69a0`.
- The exact parent `0.6.6` prompt remains preserved as Git blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Current Planning Precedence

Use current execution sources in this order:

1. `docs/dev/current-codex-prompt.md`;
2. this handoff;
3. `docs/dev/current-codex-output.md`;
4. `docs/dev/historical-version-and-deferred-route-register.md`;
5. the most specific focused decision;
6. `docs/design/current-planning-anchor-reconciliation.md` for stale roadmap/sequence current-header conflicts;
7. roadmap and sequenced plan for non-conflicting historical and long-term context.

## Verified BOM Defect

The baseline readers currently do this:

```text
readFile(path, "utf8")
  -> JSON.parse(raw)
```

Affected tests:

- `tests/unit/region-first-world-data.test.mjs`;
- `tests/unit/slug-content.test.mjs`.

Confirmed BOM-bearing fixture inputs include:

- `packages/content/base/world/regional_ecology_profiles.json`;
- `packages/content/base/world/region_localities.json`;
- `packages/content/base/world/flora.json`;
- `packages/content/base/world/minerals.json`.

The repair must remove only an optional leading `U+FEFF` before parsing. It must not edit or normalize the JSON files, weaken assertions, trim general whitespace, create a production parser, or add dependencies.

## Exact `0.6.6.1` Scope

Test files:

- `tests/unit/region-first-world-data.test.mjs`;
- `tests/unit/slug-content.test.mjs`.

After successful validation, coordination may update current output, this handoff, the route register, and restore the current prompt byte-for-byte from parent blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

The support run must not author any `0.6.6` content.

## Required Validation

1. reproduce the four baseline BOM parse failures before editing;
2. run the two repaired test files;
3. run `npm.cmd run tool:content-lint`;
4. rerun the exact parent command:

   `node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

5. require 146/146 unless a legitimate baseline change is explicitly explained;
6. confirm all JSON content is byte-unchanged;
7. run `git diff --check` and full changed-path inspection.

## Near-Term Sequence

1. complete `0.6.6.1` test-harness repair;
2. restore and run exact `0.6.6`;
3. run `0.6.7 - Cross-Content Coherence And Coverage Audit`;
4. run Geographic Knowledge Taxonomy And Location Recognition Contract Plan;
5. run Activity Resolution Existing-System Reuse Audit;
6. run Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision;
7. run bounded physiology/first-aid research only before the first executable or balance-bearing lethal-process catalog;
8. proceed to separately authorized owner-specific implementation packages.

## Preserved Authorities

- occurrence identity, commitment, correction, and consequence idempotency remain controlled by the occurrence decision and its narrow clarification;
- campaign/save topology and recovery remain controlled by the save/Stakes decision;
- Normal/Committed/Ironbound and Mortal Crisis remain controlled by the Stakes authority revision;
- narrative and elemental decisions remain documentation authority;
- `0.6.6.1` changes no content or gameplay authority.

## Known Live Gaps

- current HP zero can still enter legacy terminal archival and save deletion;
- generic event ids remain collision-prone compatibility projections;
- current random/hash mechanisms are not named uncertainty-channel authority;
- no active functional/lethal/care receipt, injury instance, body/restoration runtime, or correction tooling exists;
- no dynamic monster/ecology/loot behavior is authorized;
- roadmap and sequenced-plan top current anchors remain stale and noncontrolling under the planning-anchor reconciliation.

## Active Prompt

`Version 0.6.6.1 - UTF-8 BOM Test-Harness Repair`

Suggested commit:

`test(content): tolerate utf-8 bom in json fixtures`
