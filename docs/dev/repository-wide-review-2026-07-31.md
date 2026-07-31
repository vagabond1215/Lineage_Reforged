# Repository-Wide Review — 2026-07-31

Status: completed connector-side repository orientation and durable review record

Review class: unversioned workflow and repository coordination review

Milestone impact: `none`

## Review Identity

- Repository: `vagabond1215/Lineage_Reforged`
- Visibility: private
- Default branch: `master`
- Repository-reported size: `599175` KB
- Inspected live `master` head: `b6422118567a79a23be3377f035dd3a6905d4d8b`
- Inspected head message: `docs(handoff): align initial defeat pending semantics`
- Protocol installation commit created after the inspection: `02f6f9ed02661e2f9da605416de51ea328789059`
- Review date: 2026-07-31

This was a complete repository orientation for future-work governance. It reviewed live repository metadata, current authority documents, the active route, branch and pull-request posture, top-level architecture, build/test/type surfaces, repository hygiene, and known coordination drift. It did not run local commands because this connector environment does not provide the authenticated local checkout required for repository execution.

## Outcome

`REPOSITORY_FIRST_PROTOCOL_INSTALLED`

Future substantive work must be performed in an authenticated repository checkout through repository-capable agents, using the complete handoff and documentation chain. Connector-prepared code and bundles are evidence only until independently implemented and validated in the repository.

Durable authority:

`docs/dev/repository-first-agent-work-protocol.md`

## Governing Authority Review

The following current authorities were read and reconciled:

- `AGENTS.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/project-roadmap.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- root and application manifests, TypeScript configuration, repository README, `.gitignore`, engine exports, application caller imports, and the active persistence test surface.

Current execution precedence remains:

1. current Codex prompt;
2. current GPT handoff;
3. current Codex output;
4. historical/deferred route register;
5. the most specific focused decision or audit;
6. planning-anchor reconciliation for stale-header conflicts;
7. roadmap and sequenced plan for non-conflicting historical and long-term context.

## Active Route Review

Active route:

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

Parent:

`Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Parent status:

`REPAIR_REQUIRED_AFTER_0.6.9.6`

Required successor after a successful implementation:

`Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit`

The active repair remains limited to:

1. exact initial explicit/current/campaign-start settlement authority and retained `recovery_pending` behavior;
2. deterministic restart-safe duplicate recovery completion by exact durable receipt evidence;
3. original HP, Stamina, MP, tick, snapshot, captured-tick, and ledger acceptance-tick provenance validation.

The Ashen Reef survey receipt decision remains blocked. `0.7.0` remains `NOT_READY`. No survey, Committed/Ironbound Stakes, broad recovery redesign, shared contract, save-format, dependency, content, asset, or unrelated UI work belongs in `0.6.9.7`.

## Repository Architecture Review

The repository is a TypeScript-first, headless simulation and RPG UI foundation organized around:

- `apps/rpg-ui`: React 18 and Vite launcher, creator, save/load, and game-shell application;
- `apps/sim-runner`: deterministic simulation entrypoint;
- `packages/content`: canonical base content and additive packs;
- `packages/schemas`: JSON schemas and semantic declarations;
- `packages/db`: migrations, seeds, and generated database output;
- `packages/engines`: game, player, world, and civilization owners;
- `packages/shared`: contracts, persistence, clock, RNG, and event primitives;
- `tools`: content linting, database build, scenario execution, and focused semantic validators;
- `tests`: broad Node unit, integration, and simulation suites;
- `docs`: design authority, workflow coordination, historical routing, audits, and handoffs.

The game-engine public surface is broad and centralizes campaign session, Normal defeat, publication, travel, quest, activity, account, legacy, combat, magic, and other runtime exports. The UI imports engine owners directly through `.js` specifiers resolving TypeScript source, so public-export and TypeScript/JavaScript mirror posture must be validated whenever engine modules change.

`App.tsx` remains a real production orchestration owner for campaign recovery, publication, account, lifecycle, new-campaign coordination, and save-manager calls. Active persistence repairs therefore require real-caller tests and cannot stop at lower-level helpers.

## Workspace And Tooling Review

Root scripts:

- `npm run tool:content-lint`;
- `npm run tool:db-build`;
- `npm run tool:scenario`;
- `npm run ui:build`;
- `npm run typecheck`;
- `npm run typecheck:ui:node`;
- `npm run typecheck:workspace`;
- `npm test`.

The RPG UI uses React `^18.3.1`, Vite `^5.4.10`, and TypeScript `^5.6.3`. Its production build runs TypeScript before Vite.

The root TypeScript configuration is strict and enables `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` across `apps/**/*.ts` and `packages/**/*.ts`.

The current handoff records a known nonzero TypeScript baseline. The latest completed audit recorded `137` bounded UI diagnostics and a broader historical `173`-diagnostic workspace posture, with no changed persistence repair files named at that time. Future runs must report fresh counts rather than treating those historical totals as current proof.

The content-lint entrypoint is a large cross-domain validator covering canonical content, schemas, references, combat/magic hooks, knowledge, settlements, services, resources, commodities, monsters, quests, crafting, polities, map features, and other static authorities. Content changes require focused validator tests plus normal lint; they must not be treated as ordinary JSON edits.

## Test Review

The repository uses Node's built-in test runner and contains broad unit, integration, and simulation coverage. The active persistence suite imports the real game-engine public surface, save manager, account manager, new-campaign coordinator, character creation, lifecycle, demo snapshot, and persistence serializer.

The current active prompt requires:

- the focused `campaign-persistence-foundation.test.mjs` suite;
- an eleven-file prescribed regression group spanning save/load, achievements, account storage, lifecycle, travel, quest acceptance/tracking, activity selection, combat hooks/spawn, and persistence;
- RPG UI production build;
- bounded TypeScript audit with changed-file attribution;
- mirror/public-export checks;
- fresh independent adversarial probes;
- `git diff --check` and complete diff inspection.

The latest completed audit reported 26/26 focused tests and 133/133 prescribed tests, but independently reopened the parent. Those historical green totals are baseline evidence only and do not satisfy the future `0.6.9.7` run.

## Hosted CI Review

The inspected `master` head had:

- no combined commit statuses;
- no pull-request-triggered GitHub Actions workflow runs attached.

Hosted CI therefore cannot be assumed to protect the active route. The authenticated local repository run must execute and record all prescribed validation before commit and push.

## Branch And Pull-Request Review

Live inventory at inspected head:

- total branches returned: 19;
- default branch: 1;
- non-default branches: 18;
- open pull requests: 2.

### Active evidence branch

| Branch | Ahead / behind `master` | Paths | Disposition |
| --- | ---: | --- | --- |
| `parallel/0.6.9.7-repair-bundle` | `7 / 0` | seven evidence-bundle files under `docs/dev/repair-bundles/version-0.6.9.7/` | `HOLD_NAMED_CONSUMER`; active `0.6.9.7` Codex run; do not merge or cherry-pick as implementation |

### Launcher branches

| Branch | Ahead / behind `master` | Disposition |
| --- | ---: | --- |
| `feat/main-menu-assets` | `0 / 713` | `MERGED_RETIRE` after exact reachability and PR review |
| `main-menu-asset-contract-pass` | `10 / 641` | `SUPERSEDED_PRESERVE_EVIDENCE`; PR #2; re-author current subset at launcher trigger |
| `main-menu-refinement-pass` | `2 / 648` | `MERGED_RETIRE` pending equivalent-patch verification |

### Candidate documentation branches

Branches from merge base `bcbe658d1be033cdc83d04acdca67ec8186c484d` are each `1 / 47` and add one audit document:

- `parallel/consumable-profile-coverage-audit`;
- `parallel/equipment-profile-readiness-audit`;
- `parallel/gameplay-shell-ui-state-audit`;
- `parallel/launcher-asset-pr-disposition`;
- `parallel/quest-turn-in-reward-source-audit`;
- `parallel/research-artifact-retention-inventory`;
- `parallel/rest-recovery-mutation-audit`;
- `parallel/text-first-combat-view-model-audit`.

Branches from merge base `3006c968eb40b1d72f64fb2dc0263e227f869a7d` are each `1 / 49` and add one audit document:

- `parallel/connector-prep-freshness-audit`;
- `parallel/recipe-production-maturity-audit`;
- `parallel/regional-bestiary-ecology-maturity-audit`;
- `parallel/regional-settlement-maturity-audit`.

All remain `CANDIDATE_INTEGRATION` at their named owner-specific triggers. None overlaps the active persistence repair.

### Protected references

| Branch | Ahead / behind `master` | Disposition |
| --- | ---: | --- |
| `parallel/prompt-packaging-integrity-audit` | `1 / 76` | `PROTECTED_REFERENCE`; read-only |
| `prep/integrated-gameplay-0-7-readiness-audit` | `2 / 129` | `PROTECTED_REFERENCE`; read-only |

### Open pull requests

- PR #2, `main-menu-asset-contract-pass`: open, non-draft, launcher-only, `SUPERSEDED_PRESERVE_EVIDENCE`; must not be merged as-is.
- PR #3, `parallel/0.6.9.7-repair-bundle`: open draft, evidence-only, `HOLD_NAMED_CONSUMER`; must not be merged as implementation.

No branch integration, deletion, force update, rebase, or PR closure was appropriate during this review.

## Documentation Coherence Review

The current prompt, GPT handoff, Codex output, focused acceptance/audit chain, planning reconciliation, failure-pattern register, and branch policy are coherent around `0.6.9.7`.

The following lower-precedence files retain stale current-state headers:

- `docs/dev/project-roadmap.md` still describes `0.6.9.2` as accepted and the survey decision as next or active;
- `docs/dev/codex-sequenced-implementation-plan.md` carries the same older pointer;
- other long-lived historical planning files may contain equivalent preserved wording.

This drift is already explicitly quarantined by `docs/design/current-planning-anchor-reconciliation.md`. Do not rewrite those large files from partial connector fetches. Correct them only through a complete-file local maintenance pass or the next material roadmap update.

## Repository Hygiene Review

`.gitignore` excludes UI dependencies and build output, database build output, logs, and common temporary/scratch files. The README separately defines active/unused asset placement and forbids treating generated `apps/rpg-ui/dist/` as source authority.

Repository hygiene requirements for future runs include:

- no loose production assets or generated output authored as source;
- no retained temporary probes unless the prompt requires them and their disposition is recorded;
- no broad cleanup hidden inside an active repair;
- exact mirror/export checks for TypeScript engine changes;
- complete branch and pull-request disposition reporting;
- no connector claim of local tests, build, typecheck, or git-diff validation.

## Principal Risks

1. **No hosted validation attached to live head.** Local execution is mandatory and must be documented.
2. **Stale long-term headers.** Agents that ignore precedence can incorrectly skip `0.6.9.7` or start the blocked survey route.
3. **Evidence/implementation confusion.** PR #3 contains strong candidate evidence but no repository integration tests or production commit.
4. **Broad authority surface.** `App.tsx`, campaign session, save manager, publication, migration, projections, and account consumers interact; lower-level-only testing is insufficient.
5. **Known TypeScript debt.** Nonzero baseline diagnostics must be counted and attributed, not silently waived or repaired inside unrelated work.
6. **Branch accumulation.** Twelve candidate audit branches remain useful but stale; they require named-trigger semantic integration, not blind merging.
7. **Large content-validation surface.** Static changes can break cross-domain references even when individual JSON files parse.
8. **Large-file connector risk.** Roadmaps, handoffs, outputs, and registers must never be replaced from truncated reads.

## Future Work Gate

Before any future implementation begins, the responsible repository agent must:

1. open a synchronized authenticated checkout;
2. read `AGENTS.md` and `docs/dev/repository-first-agent-work-protocol.md`;
3. read the complete current prompt/handoff/output and focused route authority;
4. fetch/prune and refresh all branch/PR dispositions;
5. inspect the whole-repository orientation surfaces defined by the protocol;
6. reproduce active findings before editing;
7. implement and validate only in the repository;
8. update the handoff chain and branch register;
9. commit, push, and report exact heads.

For the immediate route, Codex must consume PR #3 as evidence, implement `0.6.9.7` in the live checkout, run the complete validation gate, and install `0.6.9.8` only after successful implementation. The survey route remains blocked.