# Connector Handoff — Soundings Durable Completion Independent Acceptance

Date: 2026-09-20

Status: `CODEX_EXECUTION_READY`

Repository: `vagabond1215/Lineage_Reforged` only.

Companion Connector packets:

- `docs/dev/connector-preflight-soundings-durable-completion-independent-acceptance-2026-09-20.md`;
- `docs/dev/connector-static-adversarial-soundings-durable-completion-2026-09-20.md`.

Active repository prompt remains:

**Soundings Durable Completion Independent Acceptance Audit**

This handoff reduces Codex discovery. It does not weaken independent execution or reserve the result in advance.

## 1. Package Classification

Overall audit class: **M** because it couples several acceptance domains:

- travel/route semantics;
- quest-specific transaction authority;
- campaign continuity/persistence;
- durable duplicate/conflict behavior;
- projection repair;
- real browser storage/UI;
- regression/build baselines.

Keep one final acceptance disposition, but execute the evidence gathering as bounded internal slices.

Do not spend a constrained window on broad repository archaeology already captured in the Connector packets.

## 2. Source / Delta Preflight

Connector inspection source before packet publication was hosted `master` `fb8e5df153bc744c06510493be28d129492697af`.

The tested implementation source is `af0954c294d222bc1f8667266e4549b8619d5484`.

At Connector inspection time, the only hosted commit after the implementation was documentation-only publication bookkeeping. The Connector preparation itself then added only these preparation documents and may add prompt/handoff pointers after this file.

Codex must:

1. fetch/prune;
2. verify repository identity and clean/understood worktree;
3. resolve current local/remote `master`;
4. inspect the complete delta from `af0954c...` through live `master`;
5. classify any changes after `af0954c...` as docs-only preparation or material runtime drift;
6. stop and re-scope if material runtime/test/schema/content drift appeared after this handoff.

If only the expected Connector docs/pointers are newer, do not rerun broad implementation discovery.

## 3. Slice A — Core Authority And Real Caller

Target size: `S`.

Goal: independently establish that the authoritative submit path and exact consequence boundary are coherent before spending time on browser/UI work.

### Inspect locally

- `player-soundings-turn-in.ts`;
- `soundings-turn-in-authority.ts`;
- `soundings-turn-in-readiness.ts`;
- `soundings-fingerprint.ts`;
- `campaign-session.ts` relevant prepared/admission seams;
- `campaign-rules.ts` relevant authority validation;
- `soundingsTurnInCaller.ts`;
- `GameSessionContext.tsx` accepted-only application;
- Soundings branch in `QuestsPanel.tsx` and blocked legacy branch in `gameplayLoop.ts`.

### Execute

Prioritize independent probes from static review sections 3–5, 10–12:

- authority corruption before duplicate classification;
- request-id conflict versus semantic key-order equivalence;
- forged/recomputed before-state/fingerprint attempts;
- wrong account/player/campaign;
- stale revision/snapshot;
- wrong location/incomplete survey/pending repair;
- excluded consequences unchanged;
- accepted-only caller state;
- direct legacy helper cannot pay.

### Slice-A checkpoint

Before moving on, Codex should be able to state one of:

- `CORE_AUTHORITY_PROBES_PASS`;
- `CORE_AUTHORITY_DEFECT_FOUND`.

If a real acceptance-critical defect is found, stop broad audit expansion, document exact reproduction, return `REPAIR_REQUIRED`, and install the smallest repair prompt. Do not self-repair during the audit.

## 4. Slice B — Travel, Persistence, Continuity, Duplicate, Projection

Target size: `S` to `M` evidence slice, no production mutation.

### Travel

Independently prove:

- Ashen → Starfall route exists only in the intended route context;
- exactly four travel ticks;
- no fare;
- no geographic-knowledge grant;
- unsupported origins remain unsupported;
- stale/wrong-origin/malformed behavior remains fail-closed;
- completed-contract retained return access is semantically consistent with accepted route knowledge and introduces no new service/access reward.

### Persistence / continuity

Probe:

- current-head submission;
- first mutation from non-head artifact;
- publication/restart;
- later accepted mutation;
- latest-state duplicate;
- continuity fork ancestry;
- defeat/recovery rewrite preservation;
- absent optional ledger compatibility;
- retained old survey versions where applicable.

### Projection repair

Probe both Chronicle and notifications:

- missing row;
- misplaced row;
- repeated repair;
- restart after repair;
- conflicting same-id row;
- full destination feed;
- unrelated accepted mutation after full-feed repair failure;
- later restart/presentation posture.

### Slice-B checkpoint

State one of:

- `PERSISTENCE_AND_PROJECTION_PROBES_PASS`;
- `PERSISTENCE_OR_PROJECTION_DEFECT_FOUND`.

The full-feed question must be explicitly addressed in the final audit limitations/decision; do not silently ignore it because ordinary play continues.

## 5. Slice C — Ordinary Browser / Storage / Targeted UI

Target size: `S`.

Use a disposable local account/origin. Preserve user data.

Reproduce through ordinary controls:

1. creator/start;
2. Soundings acceptance;
3. Ashen travel;
4. two shifts;
5. explicit save/reload;
6. remaining two shifts;
7. packet-ready blocker at Ashen;
8. four-tick Starfall return;
9. submit at Harbormaster context;
10. wallet delta exactly +5 gold, silver unchanged;
11. quest completed/tracking cleared;
12. one completion Chronicle;
13. explicit save/reload;
14. completed UI non-resubmittable;
15. continued travel;
16. save again.

Record any browser storage/quota failure. Compare observed bounded sequence against the implementation's reported ~3.1 MB posture where practical, but do not claim unlimited history capacity.

Targeted UI only: verify truthful readiness, blocker, return, 5-gold preview/result and Chronicle feedback. Broad shell quality is not part of this acceptance.

### Slice-C checkpoint

State one of:

- `ORDINARY_BROWSER_FLOW_PASS`;
- `ORDINARY_BROWSER_FLOW_DEFECT_FOUND`.

## 6. Slice D — Reproduce Baseline And Changed-Surface Regression

Target size: `S` / mechanical.

Run the exact combined Node command from `docs/design/soundings-durable-completion-implementation-record.md` and independently confirm the expected baseline.

Then run:

- content lint;
- Node UI configuration typecheck;
- broad UI typecheck with normalized-signature comparison to known 137 baseline;
- direct Vite build;
- exports/JS bridge checks;
- `git diff --check`;
- final intended-file/status review.

Do not spend a high-reasoning window fixing pre-existing broad TypeScript diagnostics if signatures are unchanged.

### Slice-D checkpoint

State one of:

- `REGRESSION_BASELINE_REPRODUCED`;
- `REGRESSION_DRIFT_FOUND`.

## 7. Final Independent Disposition

Only after Slices A–D are complete against the same implementation/runtime source, write:

`docs/design/soundings-durable-completion-independent-acceptance-audit.md`

with:

- exact inspected/tested source identity;
- drift classification;
- numbered evidence by acceptance domain;
- independent probes distinct from implementation tests;
- browser/storage evidence;
- projection-capacity conclusion/limitation;
- baseline results;
- branch/PR posture;
- limitations;
- exact result.

Return exactly one:

- `SOUNDINGS_DURABLE_COMPLETION_ACCEPTED`;
- `REPAIR_REQUIRED`.

Do not issue a game-version decision in this audit.

## 8. First Durable Checkpoint Under Rate Limits

Because the user has repeatedly encountered short-window Codex limits, reach a useful checkpoint early.

Preferred first checkpoint:

**complete Slice A and record the core-authority probe findings in the audit working document before beginning broad browser/regression work.**

If interruption occurs after a clean Slice-A checkpoint:

- preserve the same thread/worktree if possible;
- on resume inspect HEAD/status/diff/commits first;
- continue from the first incomplete slice;
- do not rerun broad Connector-mapped discovery;
- rerun a completed slice only when needed because source changed or its evidence was not durable enough for the final disposition.

If the thread loses substantive context while the worktree is clean, stop rather than paying for repository-wide rediscovery; return to the Connector packet and delta verification.

## 9. Work Deliberately Removed From Codex

Connector has already supplied:

- exact implementation-to-hosted-head drift characterization at preflight time;
- implementation changed-path inventory;
- caller/owner/persistence map;
- known ids/counts/receipt kinds;
- reported validation baselines;
- branch/open-PR inventory;
- scope exclusions/non-gates;
- prioritized adversarial probe matrix;
- package decomposition/checkpoint plan.

Codex should verify material claims locally but should not recreate these maps from scratch unless fresh drift contradicts them.

## 10. Work That Must Remain In Codex

Connector cannot substitute for:

- local repository/worktree truth;
- fresh executable/adversarial probes;
- tests/build/typechecks/lint;
- browser storage/runtime reproduction;
- independent semantic judgment over observed failures/limitations;
- `SOUNDINGS_DURABLE_COMPLETION_ACCEPTED` versus `REPAIR_REQUIRED`;
- final audit commit/push/post-push executable publication claims.

## 11. Resource Posture

The final audit requires high-quality adversarial reasoning, but not every slice needs the highest-cost tier.

Use the strongest reasoning where persistence, continuity, duplicate authority, projection repair or ambiguous failure semantics require it. Mechanical baseline reproduction should not consume the same reasoning budget unnecessarily.

The active prompt remains authoritative over this handoff if any conflict exists.
