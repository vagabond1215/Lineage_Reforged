# Parallel GPT Connector-Only Second-Wave Candidates

Date: 2026-08-03

Inspected master head: `ba689aca156906f159a001bd97137f9ae9795a22`

Execution surface: ChatGPT via GitHub Connector only

Status: `TEN_SECOND_WAVE_CONNECTOR_RUNS_REASONABLE_AND_SAFE`

## Purpose

Identify additional one-document, connector-only evidence passes that can run independently while the active historical recovery-fork authority decision remains in progress.

These are candidates only. No branch is created or advanced by this inventory. None advances the active version, accepts parent `0.6.9`, unblocks Ashen Reef, authorizes implementation, or replaces local validation.

## Shared Isolation Contract

Every selected run must:

1. branch from the same freshly resolved live `master` head;
2. create or update exactly the one document named below;
3. inspect repository files, commits, branches, and pull requests through the GitHub Connector only;
4. run no tests, builds, typechecks, linters, generators, scenarios, migrations, or local Git commands;
5. edit no production source, tests, schemas, content, assets, dependencies, generated output, current prompt, current output, current handoff, roadmap, sequenced plan, planning anchor, backlog, static program, or branch register;
6. state the exact inspected master SHA and the absence of local execution;
7. classify every reused historical claim as current, superseded, narrowed, or unresolved;
8. remain isolated and unmerged as `CANDIDATE_INTEGRATION`;
9. include mandatory named consumers and a precise review trigger;
10. avoid conclusions that require product direction, balance judgment, local runtime execution, or accepted implementation evidence.

After the batch completes, one coordinator should index all exact branch heads and update shared coordination once. The individual branches must not edit the branch register in parallel.

## Candidate 1 - Economy Command And Transaction Surface Refresh

- Suggested branch: `parallel/economy-command-surface-refresh`
- Only editable file: `docs/design/economy-command-surface-source-map.md`
- Current question: Which currency, inventory, offer, market, vendor, workplace, recipe, estate, shop, trade, craft, and caravan mutations are engine-owned, UI-authored, projection-only, or absent on current master?
- Required inspection: refresh the 2026-06-05 source map against the current `gameplayLoop.ts`, engine exports, economy projections, inventory structures, quest/rest reward paths, market content, and accepted persistence gateway.
- Important boundary: the live gameplay bridge directly assembles currency, inventory, standing, skill, notification, and Chronicle changes, while the older economy source map predates the current campaign mutation gateway.
- Exclusions: no command contract, transaction receipt, item-instance model, market simulation, currency change, inventory change, price rebalance, shop UI, or save change.
- Mandatory consumers: shop/trade/craft/caravan planning; quest or activity reward transaction work; estate transfer; economy representative-loop claims.
- Review trigger: the next economy command, inventory-transfer, vendor/offer, crafting execution, or transactional reward decision.

## Candidate 2 - Player Progression And Reward Mutation Source Audit

- Suggested branch: `parallel/player-progression-reward-mutation-audit`
- Only editable file: `docs/design/player-progression-and-reward-mutation-source-audit.md`
- Current question: What currently owns noncombat skill gains, attribute load, stat-growth conversion, standing, reputation, resource changes, and reward application?
- Required inspection: trace player-engine helpers, `gameplayLoop.ts`, quest/activity/rest callers, synchronization, save fields, UI application, and any existing result/event identities.
- Important boundary: engine helpers exist for several calculations, but orchestration and multi-owner reward assembly remain concentrated in the UI gameplay bridge.
- Exclusions: no balance changes, reward values, rank thresholds, new progression rules, new receipts, UI changes, or persistence edits.
- Mandatory consumers: quest/activity reward ownership; progression integration; reputation/standing commands; noncombat skill growth; representative-loop and `0.7.0` progression claims.
- Review trigger: any package that grants skills, attributes, standing, reputation, resources, or multi-owner rewards.

## Candidate 3 - Chronicle, Notification, Operation, And Projection Provenance Audit

- Suggested branch: `parallel/chronicle-notification-provenance-audit`
- Only editable file: `docs/design/chronicle-notification-operation-and-projection-provenance-audit.md`
- Current question: Which durable facts, transient notices, operations, Chronicle entries, event outputs, and read-only projections currently exist, and which are synthesized directly by UI gameplay code?
- Required inspection: trace notification and Chronicle ID generation, bounded truncation, operation upserts/removals, game deltas, view-model projections, quest/activity/rest/travel outputs, persistence, duplicate behavior, and correction posture.
- Important boundary: current UI gameplay code creates notification and Chronicle records from tick plus array position and applies bounded list truncation; those records are not automatically authoritative command receipts.
- Exclusions: no event framework, Chronicle schema, notification UX, history migration, replay engine, retention change, or new gameplay facts.
- Mandatory consumers: Chronicle/history work; notification ownership; quest/activity/rest event output; replay/correction; observer-safe presentation; representative-loop audit.
- Review trigger: any route claiming durable history, replay-safe notices, command-event provenance, or Chronicle integration.

## Candidate 4 - Accessibility, Keyboard, Focus, Live-Region, And Responsive Source Audit

- Suggested branch: `parallel/ui-accessibility-input-source-audit`
- Only editable file: `docs/design/ui-accessibility-keyboard-focus-and-responsive-source-audit.md`
- Current question: How much of the accepted accessibility baseline is implemented across the launcher, creator, shell, panels, overlays, notices, map controls, and future combat surfaces?
- Required inspection: semantic elements, accessible names, focus order and return, keyboard handlers, visible focus, live regions, reduced-motion hooks, reflow/responsive classes, icon-only controls, disabled-state explanation, exact timing text, and hover-only information.
- Important boundary: the permanent UI authority requires keyboard access, visible focus, predictable focus return, scalable/reflowing text, restrained live regions, non-color status, exact combat timing text, and no hover-only required information.
- Exclusions: no React/CSS changes, visual redesign, asset changes, automated accessibility claims, browser testing, screenshots, or conformance certification.
- Mandatory consumers: Home/shell work; launcher or creator UI; combat presentation; settings/overlay changes; `0.8.0` and later accessibility gates.
- Review trigger: the next material UI implementation or milestone-readiness audit.

## Candidate 5 - NPC Party, Companion, Guest, And Combatant Persistence Readiness Audit

- Suggested branch: `parallel/npc-party-companion-readiness-audit`
- Only editable file: `docs/design/npc-party-companion-guest-and-combatant-persistence-readiness-audit.md`
- Current question: What durable NPC-party, companion, guest, combatant, preference, health, injury, equipment, recruitment, loyalty, and post-combat ownership exists now?
- Required inspection: party runtime state, encounter construction, allied/guest combatant IDs, player combat preferences, tactics presets, save-shaped contracts, account/family boundaries, combat outcome handling, and current UI projections.
- Important boundary: weighted tactics AI exists, but ordinary encounters currently construct the player plus enemies rather than a durable full allied NPC roster; companion persistence and post-combat owners remain incomplete.
- Exclusions: no companion design, recruitment rules, loyalty, party size, character canon, combat implementation, gambit system, save change, or UI implementation.
- Mandatory consumers: companion/NPC combat; tactics editing; ordered-gambit decisions; text-first combat; party persistence; `0.7.0` combat integration.
- Review trigger: any package claiming allied NPC combat, companion automation, party persistence, or tactics-per-member support.

## Candidate 6 - Item Use-Profile, Grant, Charge/Dose, And Effect-Ownership Audit

- Suggested branch: `parallel/item-use-profile-effect-ownership-audit`
- Only editable file: `docs/design/item-use-profile-grant-charge-dose-and-effect-ownership-audit.md`
- Current question: How do item `useProfiles`, combat action grants, consumable profiles, spell/ability hooks, inventory stacks, equipment profiles, doses/charges, and owner-routed effects currently relate?
- Required inspection: item records and schemas, combat candidate-action construction, magic metadata and hook validators, consumable/equipment audit findings, inventory representation, health/care boundaries, and current runtime consumers.
- Important boundary: combat can derive candidate actions from item use-profile grants, while nutrition profiles and inventory stacks do not constitute a universal item-use or dose/charge authority.
- Exclusions: no item/schema/content edits, no universal effect bag, no potion/medicine/poison behavior, no charge or durability model, no combat balance, and no inventory mutation.
- Mandatory consumers: consumable integrity; equipment profiles; combat item actions; medicine/care; poison/antidote; alchemy/magic item use; inventory-instance planning.
- Review trigger: any implementation or decision involving item activation, doses, charges, combat grants, healing items, or effect execution.

## Candidate 7 - Travel Destination, Route, Settlement Service, And Availability Authority Audit

- Suggested branch: `parallel/travel-route-service-availability-audit`
- Only editable file: `docs/design/travel-destination-route-settlement-service-and-availability-authority-audit.md`
- Current question: Which destination, route, known-location, settlement, site, service, access, admission, cost, and risk facts are authored, engine-owned, UI-projected, or hard-coded compatibility data?
- Required inspection: `player-travel-rules.ts`, travel commands, World panel, known locations, authored routes and settlements, service records, rest assumptions, map features, geographic Knowledge, and arrival activities.
- Important boundary: the accepted travel engine currently uses a bounded hard-coded destination table, while wider authored route, settlement, service, and recognition authorities remain distinct.
- Exclusions: no new destinations, routes, costs, services, map behavior, travel balance, discovery rules, rest implementation, or content edits.
- Mandatory consumers: travel expansion; rest/service access; world map; geographic recognition; settlement services; representative-loop and `0.7.0` world claims.
- Review trigger: any package adding destinations, route selection, service availability, travel admission, or broader world-loop integration.

## Candidate 8 - Knowledge, Discovery, Observation, And Visibility Ownership Audit

- Suggested branch: `parallel/knowledge-discovery-visibility-audit`
- Only editable file: `docs/design/knowledge-discovery-observation-and-visibility-ownership-audit.md`
- Current question: What owns known locations, discoveries, Codex entries, geographic Knowledge, observations, certainty, provenance, hidden truth, and UI visibility on current master?
- Required inspection: accepted geographic-recognition decisions, Knowledge registries and trial policies, discovery Chronicle state, Codex projections, World panel markers, survey discovery behavior, source-teaching relations, and observer-safe presentation contracts.
- Important boundary: map markers, Codex visibility, session flags, discovery records, and Knowledge progression are not interchangeable evidence or universal reveal authority.
- Exclusions: no new Knowledge domains, observations, map markers, discovery content, certainty rules, hidden-information policy, survey changes, or UI implementation.
- Mandatory consumers: geographic recognition; Codex/search; survey discoveries; map visibility; observer-safe presentation; knowledge progression; `0.7.0` exploration claims.
- Review trigger: any route that reveals places or records, grants discovery/Knowledge progress, or claims provenance-aware visibility.

## Candidate 9 - JavaScript/TypeScript Mirror, Public Export, And Import-Specifier Integrity Audit

- Suggested branch: `parallel/js-ts-mirror-export-integrity-audit`
- Only editable file: `docs/dev/javascript-typescript-mirror-public-export-and-import-specifier-integrity-audit.md`
- Current question: Which engine modules require TypeScript implementation, JavaScript mirror/shim posture, public `index.ts` export, `.js` import specifiers, focused tests, or generated-output verification?
- Required inspection: engine public indices, one-line `.js` mirrors, TypeScript implementations, UI imports, package module settings, test imports, and recent persistence modules that expanded the public surface.
- Important boundary: the repository is TypeScript-first but UI and tests commonly import `.js` specifiers that resolve TypeScript source; module changes require exact mirror and export verification.
- Exclusions: no source edits, export changes, generated files, module conversion, package configuration, build claims, or cleanup.
- Mandatory consumers: every future engine module addition or rename; acceptance audits; source integration; mirror cleanup; public API changes.
- Review trigger: the next production package changing engine modules, exports, import paths, or JS/TS mirror posture.

## Candidate 10 - Content-Lint, Schema Registration, And Validator Coverage Source Audit

- Suggested branch: `parallel/content-lint-schema-validator-coverage-audit`
- Only editable file: `docs/dev/content-lint-schema-registration-and-validator-coverage-source-audit.md`
- Current question: Which live content families, schema files, semantic validators, cross-reference checks, hook-support checks, and normal-lint registrations exist, and which accepted schemas remain intentionally without live content wrappers?
- Required inspection: root scripts, `tools/content-lint/index.mjs`, imported validators, schema registration, focused tests, static-content decisions, equipment/consumable findings, lethal-process catalogs, and accepted lint boundaries.
- Important boundary: content lint is a large cross-domain authority surface; individual JSON validity does not prove cross-reference, hook, lifecycle, runtime-isolation, or registration correctness.
- Exclusions: no content/schema/validator/test edits, no local lint claims, no catalog counts presented as executed proof, and no generated database changes.
- Mandatory consumers: every static content package; schema activation; content migration; validator changes; cross-content coherence; `0.7.0` content-readiness claims.
- Review trigger: the next content or schema package, validator registration change, or broad static-content readiness audit.

## Reasonable But Held Back

### Account, Legacy, Achievement, And Publication Consumer Audit

This would be valuable, but it overlaps files and evidence that the active historical recovery-fork authority decision may inspect for durable corroboration. Defer until that decision installs its successor.

### Character Creation, New-Campaign Start-State, And Retry Audit

This directly overlaps the active persistence authority and recent retry/recovery work. Do not run in parallel now.

### Save/Load Error, Corruption, And Recovery Presentation Audit

This touches active save/recovery semantics and should wait until parent acceptance is resolved again.

### Prompt Packaging, Current-Route Freshness, And Branch-Register Maintenance

These are shared coordination surfaces owned by the active route and later coordinator. They are not independent parallel lanes.

### Launcher Asset And Main-Menu Refinement

PR #2 and the existing launcher audit already preserve the evidence. Meaningful advancement requires user-facing asset direction and local UI/asset validation.

### Validation/Typecheck Debt Decomposition Refresh

This remains reasonable later, but a connector-only pass cannot reproduce current diagnostic counts. Prioritize it only when a local cleanup route is likely to open.

## Recommended Batch Order

The ten candidates are independent, but a practical sequence is:

1. economy command surface;
2. player progression/reward mutation;
3. Chronicle/notification provenance;
4. travel/route/service availability;
5. Knowledge/discovery visibility;
6. item use-profile/effect ownership;
7. NPC party/companion readiness;
8. accessibility/input source audit;
9. JS/TS mirror/export integrity;
10. content-lint/schema/validator coverage.

This order front-loads current runtime ownership maps, then future integration surfaces, then repository-wide verification infrastructure.

## Discovery And Coordination Rule

If any candidate is run, the coordinator must add its exact branch head and named consumers to the durable result index:

`docs/dev/parallel-gpt-connector-only-run-results-2026-08-03.md`

Future prompts and completion reports must inspect applicable entries from that result index without treating isolated branch evidence as current execution authority.
