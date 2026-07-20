# Internal Versioning And Release Milestone Policy

Source route: ChatGPT via GitHub Connector
Date: 2026-07-19
Status: durable workflow and maturity policy; prospective; no historical renumbering

## 1. Purpose

Define how Lineage: Reforged assigns internal development versions without making patch count, documentation volume, or a sequence of narrow changes appear to represent more product maturity than has actually been achieved.

This policy governs:

- entry into the `0.7.x`, `0.8.x`, and `0.9.x` maturity bands;
- reservation of `1.0.0` for an accepted release milestone;
- use of three-segment primary labels such as `0.6.8`;
- use of four-segment support labels such as `0.6.8.1`;
- use of unversioned research, coordination, and planning runs;
- milestone-readiness evidence and explicit acceptance.

These are internal workflow versions. They are not automatically package versions, public release numbers, marketing labels, save-format versions, protocol versions, or compatibility promises.

## 2. Core Rule

> Version numbers measure accepted project maturity and durable capability, not the number of tasks completed.

Consequences:

- Patch numbers may grow indefinitely within one maturity band.
- Completing `0.M.9`, `0.M.99`, or any other patch does not imply promotion to `0.(M+1).0`.
- Calendar time, commit volume, file count, test count, content count, and roadmap length do not independently justify a new minor band.
- A new minor band requires a named milestone gate, evidence against every required criterion, and an explicit accepted decision.
- Work that does not satisfy a new-band gate remains inside the current minor band, uses a support suffix, or remains unversioned according to the classification rules below.

## 3. Label Classes

### 3.1 Three-segment primary version

Format:

```text
Version 0.M.P - Short Name
```

Use a three-segment primary version only when the run adds, changes, activates, or closes a durable capability or authority that materially advances the current maturity band.

Examples include:

- moving an authoritative mutation behind an engine-owned command;
- adding a validated static authority required by the active milestone;
- implementing a bounded runtime consumer;
- activating a previously planned content family with its required validation;
- completing a cross-system integration package that changes what the project can reliably do.

A documentation-only run may use a primary version only when the document itself is the required durable decision or contract that unblocks and governs a material capability in the active sequence. Routine planning, source gathering, prompt revision, status reconciliation, and repeated audits do not qualify by default.

### 3.2 Four-segment support version

Format:

```text
Version 0.M.P.S - Short Name
```

The fourth segment is a support-run counter attached to exactly one three-segment primary anchor.

Use it for:

- post-transition or post-implementation audits;
- retries after a blocked or failed run;
- narrow repairs required to accept the parent version;
- validation-only passes;
- regression-coverage corrections;
- handoff or authority clarification specific to the parent version;
- cleanup required by the parent version's accepted removal conditions.

A support version:

- does not consume the next three-segment primary number;
- does not represent a new roadmap milestone;
- must name its parent anchor;
- should not broaden into unrelated capability work;
- may have additional suffix runs when required, such as `0.6.8.2`.

### 3.3 Unversioned named run

Use an unversioned named run when work is useful but does not itself advance a primary capability and is not narrowly attached to one primary anchor.

Appropriate uses include:

- Deep Research gates;
- cross-domain research integration;
- broad source indexing;
- coordination reconciliation;
- future-system exploration;
- held prompt preparation;
- multi-version historical cleanup;
- read-only audits that decide later work but do not alter accepted capability.

An unversioned run must still have a stable name, scope, status, consumer, and artifact-disposition rule where applicable.

## 4. Assignment Decision

Assign a label in this order:

1. **Does the run prove every entry criterion for a new maturity band and receive explicit acceptance?**
   - Yes: use the reserved band-entry version such as `0.7.0`.
   - No: remain in the current band.
2. **Does the run materially advance a durable capability or authority within the current band?**
   - Yes: use the next appropriate three-segment primary label.
3. **Is the run an audit, repair, retry, validation, clarification, or cleanup attached to one primary?**
   - Yes: use the next four-segment suffix on that primary.
4. **Is it cross-cutting research, planning, coordination, or a held future decision without direct capability advancement?**
   - Yes: use an unversioned named run.

When uncertain, choose the less maturity-significant label and record what evidence would justify promotion later.

## 5. Minor-Band Entry Protocol

Before assigning `0.7.0`, `0.8.0`, `0.9.0`, or `1.0.0`:

1. create or activate a docs-first readiness audit;
2. reproduce the live repository baseline;
3. evaluate every required milestone criterion individually;
4. list blockers, partials, unsupported claims, and known limitations;
5. run the milestone's required validation and representative gameplay checks;
6. record an explicit decision: `accepted`, `not_ready`, or `blocked`;
7. use the new band only after `accepted`;
8. otherwise continue the current band with `0.M.P`, `0.M.P.S`, or an unversioned run.

The entry version should be a bounded milestone acceptance/integration package, not a large speculative feature dump intended to make the milestone true in one pass.

## 6. Reserved Maturity Milestones

### 6.1 `0.7.0` — Integrated Gameplay Systems

Reserve `0.7.0` until a validated, engine-owned integrated gameplay loop exists through stable shared contracts.

Minimum evidence:

- character creation or start-state can enter a playable session;
- authoritative save/load preserves the slice's required state;
- travel or movement is engine-owned and participates in the loop;
- quests, contracts, or activities can advance beyond selection through an authoritative attempt/result path;
- at least one consequence-bearing interaction crosses multiple systems, such as travel plus survival, combat plus inventory, gathering plus crafting, or quest plus economy/reputation;
- commands, events, synchronization, revision/stale protection, and accepted-only UI application are coherent for the slice;
- required inventory/resource ownership and typed effects exist for the included interactions;
- the loop has deterministic or bounded replay/test coverage and explicit failure behavior;
- remaining demo/UI-authored mutations do not control the milestone loop;
- known omissions are documented and do not invalidate the integrated loop.

Static content expansion, isolated schemas, pure helpers, read-only projections, selection-only commands, or planning documents do not individually satisfy `0.7.0`.

### 6.2 `0.8.0` — Pre-Alpha Vertical Slice

Reserve `0.8.0` until one narrow but coherent vertical slice is playable, repeatable, and hardened as a pre-alpha experience.

Minimum evidence:

- the `0.7.x` integrated loop is accepted and stable;
- one bounded region/settlement/adventure path has sufficient authored content to exercise the intended game identity;
- the slice includes the agreed subset of character development, travel, survival, encounters/combat, quests/contracts, inventory/equipment, crafting/economy, NPC/services, and persistence;
- missing systems are explicitly excluded rather than silently simulated through placeholders;
- UI supports the slice with keyboard/controller or documented input posture, accessibility basics, responsive constraints, and legible failure/readiness information;
- representative balance baselines and anti-exploit checks exist;
- regression coverage protects the end-to-end slice;
- save/load and restart behavior are repeatedly tested;
- critical placeholder, demo, and duplicated-authority paths are removed from the slice.

Content volume outside the selected slice is not an entry criterion.

### 6.3 `0.9.0` — Alpha Readiness

Reserve `0.9.0` until the project is ready for sustained alpha testing rather than one developer-controlled vertical slice.

Minimum evidence:

- the pre-alpha slice is accepted and expanded to the agreed alpha scope;
- major launch-scope systems have functional owners and are integrated or explicitly removed from alpha scope;
- save creation, load, overwrite, restart, and corruption/error handling are reliable under the current-data policy;
- packaging, installation, launch, logging, crash reporting or diagnostic collection, and clean shutdown are validated for target platforms in scope;
- performance budgets and representative stress cases are defined and pass at alpha scale;
- known limitations, debug facilities, issue-reporting workflow, and test-account/data reset posture are documented;
- balancing and progression can support repeated external play without immediate systemic collapse;
- accessibility and input requirements for alpha are met;
- no known critical blocker makes ordinary alpha participation unsafe or nonfunctional.

`0.9.x` remains alpha stabilization. It is not a release-candidate claim by itself.

### 6.4 `1.0.0` — Accepted Release

Reserve `1.0.0` for an explicitly accepted public-release milestone.

Minimum evidence:

- agreed launch scope and content are complete or deliberately cut with documented product approval;
- all launch-critical systems are integrated and have authoritative owners;
- save/load, install/update/launch, input, accessibility, performance, error handling, and platform packaging meet release criteria;
- release-candidate QA has no unresolved critical defects and has an accepted disposition for lower-severity defects;
- progression, economy, combat, crafting, content access, and failure/recovery loops meet launch balance and exploit standards;
- user-facing onboarding, settings, credits, legal notices, support information, and release documentation are complete where applicable;
- telemetry, crash reporting, privacy, account/network behavior, and operational requirements are explicitly accepted or explicitly out of scope;
- a release-readiness audit records the exact commit, artifacts, checks, known issues, rollback posture, and acceptance decision.

`1.0.0` must not be assigned merely because `0.9.x` has accumulated many patches.

## 7. Current `0.6.x` Posture

The repository is currently in `0.6.x`.

Accepted `0.6.x` work includes engine-owned travel, quest acceptance, quest tracking, activity selection, and the bounded `0.6.4`-`0.6.7` static-content/coherence milestone.

The static-content packages support dependency closure and later integration, but they do not by themselves satisfy the `0.7.0` integrated-gameplay gate.

After `0.6.7`, the docs-first Geography/recognition plan and the held Activity Resolution Existing-System Reuse Audit remain unversioned support decisions. Their completion does not automatically promote the project to `0.7.0`.

If the `0.7.0` criteria are still unmet, continue with `0.6.8`, `0.6.9`, `0.6.10`, and later `0.6.x` primaries as needed. Use `0.6.P.S` suffixes for support runs attached to those primaries.

## 8. Historical Labels

Do not mass-renumber accepted historical versions, commits, prompts, or documents.

Historical labels remain stable references even when current policy would classify similar future work differently. Record any historical anomaly in the historical/deferred route register rather than rewriting shared history.

This policy is prospective from 2026-07-19.

## 9. Required Documentation Behavior

Future roadmap, handoff, output, and prompt updates must:

- identify the current maturity band;
- state whether a run is primary, support-suffix, or unversioned;
- name the parent version for every suffix run;
- state the run's milestone impact as `none`, `supports_current_band`, `advances_current_band`, or `band_entry_candidate`;
- avoid naming a future minor-band entry as active before its readiness audit is accepted;
- preserve patch numbers beyond 9 rather than rolling bands;
- keep public release/version claims separate from internal workflow labels;
- record why a documentation-only run qualifies as a primary when that exceptional classification is used.

## 10. Anti-Inflation Guardrails

Do not:

- allocate a new three-segment primary merely because another task has begun;
- split one coherent implementation into many primaries to imply progress;
- combine unrelated systems into one oversized primary to force milestone entry;
- classify ordinary audits or repairs as new primaries when a suffix is appropriate;
- classify broad research as a primary implementation milestone;
- promote to a new minor band because patch numbers are visually large;
- use `0.7`, `0.8`, `0.9`, or `1.0` as aspirational marketing shorthand in authoritative status documents;
- claim `1.0.0` release readiness while launch-critical owners, persistence, packaging, accessibility, QA, or support requirements remain unresolved.

## 11. Next Required Use

The active `0.6.6` and reserved `0.6.7` sequence remains unchanged.

The first planning pass after `0.6.7`, Geography/recognition, and the Activity Resolution Existing-System Reuse Audit that selects a runtime consumer must apply this policy before assigning its label. It must continue in `0.6.x` unless a separate `0.7.0` readiness audit proves and accepts every integrated-gameplay criterion.
