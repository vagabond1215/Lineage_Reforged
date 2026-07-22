# Difficulty, Grim World, And Stakes Repository Audit

Run: `Difficulty Preset, Grim World, And Stakes Separation Contract Planning Audit`

Date: 2026-07-21

Status: temporary implementation-contract planning artifact; no implementation authority

## 1. Live Repository Inventory

### Execution gate

- Branch: `master`.
- Starting and ending repository commit before documentation edits: `fbe68b7aa5641a4f38581c9da8a745b6c58a094b`.
- Starting state: clean.
- Fetch and fast-forward pull completed without changing `HEAD`.
- Ending worktree state for this run is exactly one tracked modification, `docs/dev/current-codex-output.md`, and one new untracked audit, `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md`; no other path changed.
- The active prompt is this unversioned two-file documentation audit.
- The controlling decision exists, is unmodified in the worktree, and hashes to blob `0b2bfc434e586321336bbf5ecb6af55111d6db69`.
- The held `0.6.6` pointer remains at `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md`. It names source commit `6394443f1628d9053b3417e926e581b7a444386c` and exact prompt blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`; that blob exists and resolves to the expected `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt.

### Existing campaign-difficulty representation

| Concern | Live representation | Authority/use | Finding |
| --- | --- | --- | --- |
| Stored difficulty | `GameState.runDifficulty` | `packages/shared/types/src/contracts.ts` | `{ tier, hardcore }`, persisted inside every `SaveSnapshot`. |
| Tier ids | `easy | normal | hard | brutal` | `RunDifficultyTierId` and `packages/engines/player-engine/src/difficulty.ts` | No Story/Favored/Mortal/Forsaken ids exist. |
| Extra mode | `hardcore: boolean` | same type and resolver | Overloads difficulty tuning, recovery rules, prestige/death semantics, and run-end labeling. It does not enable a harsh-world simulation. |
| Default | `normal`, `hardcore: false` | `createRunDifficultyState`, game-engine defaults, new-game snapshot, demo snapshot | Equivalent target posture is Mortal/Heroic World/Normal Stakes, subject to the death contradiction below. |
| Character/campaign creation | no campaign-rule control | `newGameSnapshot.ts` and character-creation form/UI | New campaigns silently receive the default. Creation-card `difficultyLabel` values describe selection difficulty/availability, not campaign difficulty. |
| Global tuning | `rule.run_difficulty_balance` | `packages/content/base/game/global_rules.json` | Four scalar bundles for stat growth, skill progression, Knowledge progression, body state, and Prestige; one additional `hardcore` block. |
| Combat tuning | encounter `difficultyTier` derived from hazard pressure | world spawn and combat owners | Scales monster HP/MP/Stamina/accuracy/defense/timing/threat through authored monster hooks. It is not connected to `runDifficulty`. |
| Combat mode naming | `PlayerCombatProfileState.preferredMode: normal | hardcore` | tactics/combat profile | Separate, currently lightly used combat-control preference with dangerously overloaded labels. It is not campaign difficulty, World Rules, or Stakes. |
| Economy “difficulty” | material/process `difficultyTier`, refinement difficulty, settlement infrastructure difficulty | content and civilization economy owners | Describes task/material/world conditions, not campaign difficulty. No run-difficulty economy scalar is consumed. |
| Travel/activity tuning | `runDifficulty` is passed into body-state advance and stat-growth conversion | player travel and local gameplay loop | It changes bodily drain/recovery/progression indirectly. No campaign-difficulty travel-time, encounter, retry, or route scalar exists. |
| Body-state tuning | eight tier scalars plus four active hardcore scalars/caps | player-engine body state | Reusable owner boundary, but only scalar consequences exist. No Story bypass and no World Rules input exist. |
| Failure/retry assistance | no campaign-difficulty contract | command notices and stale-state rejection are fixed behavior | No retry allowance, checkpoint, fallback, or failure-recovery settings are owned by difficulty. |
| Tutorials/warnings/forecasts | body-state presentation warnings and action previews are fixed projections | UI presentation | No difficulty-controlled lead time, explanation depth, precision, or accessibility contract exists. |
| Custom difficulty | none | no type, schema, save field, registry, or UI | Invalid tier input normalizes to `normal`; provenance cannot be recorded. |
| Persistence/migration | save envelope v6, snapshot `0.6.0`; `migrateSnapshotForEcho` normalizes `runDifficulty` | browser-local save manager | Missing or invalid difficulty becomes normal/non-hardcore. Old envelope generations are reported incompatible rather than migrated. |
| UI/settings | theme, time zone, hour format; manual save and quick-save controls | browser-local UI | Difficulty is neither shown nor editable. Existing settings are presentation-only and not campaign identity. |
| Chronicle/achievement identity | `hardcore_dead` archive reason and payout modifier | run lifecycle, Chronicle presentation, legacy payout | Run records do not store tier, World Rules, Stakes, or custom provenance. Achievement metrics are not keyed to campaign rules. |
| Generated mirrors | tracked `.ts` and `.js` pairs in player-engine, including `difficulty`, `body-state`, `progression`, and `stat-growth` | package source/build posture | A later implementation must update or regenerate both according to repository convention; editing only TypeScript would leave stale tracked mirrors. |

### Existing names equivalent to requested audit terms

| Name | Actual live meaning | Target disposition |
| --- | --- | --- |
| `easy` | easier scalar tier | migrate to Favored, not Story |
| `normal` | baseline scalar tier/default | migrate to Mortal |
| `hard` | harder scalar tier | migrate to Forsaken |
| `brutal` | harsher fourth scalar tier | no separate accepted preset; migrate to Forsaken plus recorded legacy overrides or require an explicit compatibility decision |
| `hardcore` on `runDifficulty` | harsher recovery/caps, Prestige rules, and death label | split across difficulty-owned values and Stakes-owned behavior; never map to Grim World automatically |
| `hardcore` on combat profile | combat preference vocabulary | rename or explicitly isolate; do not migrate as campaign rules |
| `difficultyTier` on encounters/items/processes | authored encounter, task, or material difficulty | retain under its domain; do not rename to campaign preset |
| Story | story/manuscript/quest prose or accepted design docs only | no live preset equivalent |
| Standard/Simulation/Accessible | older documentation terminology only | superseded for player-facing preset naming |
| Survival | content tags, backstory, or design vocabulary | no live campaign mode |
| Ironman/permadeath/custom difficulty | absent from live identifiers | future Stakes/custom contracts only |

### Save, defeat, death, and rollback inventory

- There are 128 manual browser-local save slots and one quick-save slot. There is no autosave slot, save-and-exit command, restricted-save set, single-save implementation, checkpoint ledger, cloud backup, or rollback journal.
- Corrupt and incompatible saves are detected and labeled, but there is no recovery copy, atomic two-generation write, repair path, or crash-consistency protocol.
- `resolveTerminalArchiveReason` treats player HP at or below zero as terminal for every campaign. Non-hardcore becomes `dead`; hardcore becomes `hardcore_dead`.
- Both death reasons call `archiveActiveRun`, which archives the Chronicle record, resolves Legacy/estate effects, deletes every discovered save for that character, and blocks stale copies on later load. Ordinary live play therefore already has permanent run-ending player death independent of the `hardcore` Boolean.
- Combat has `incapacitated` and `defeated` flags, but no accepted defeat-to-injury/escape/capture/reload contract. The player snapshot HP check bypasses a separate Stakes policy.
- Party combatants can be defeated in an encounter, but no companion/NPC death permanence, body, succession, or save-owned lifecycle contract exists.
- Retirement is explicit and also frees all active saves. Account-record deletion is non-authoritative and separate from campaign death. Retired lineage inheritance exists, but player-death succession is not defined.

### Live foundations relevant to Grim World

- Health: body-state Energy/protein/hydration/fatigue/starvation/intoxication; two registered combat-status vocabulary rows; combat status/injury schema boundary; hazard-profile schema and lint support. No hazard-profile content file, illness/disease state, sanitation, exposure ledger, contamination state, wound-infection resolver, outbreak owner, or treatment runtime exists.
- Logistics: authored items, consumables, containers, recipes, workplaces, buildings/storage profiles, services, settlement water/road/market/fortification tiers, climate, transport, travel networks, and trade runtime exist. Generic item-instance/container execution, player stock movement, spoilage/vermin/equipment-care state, pack-animal needs, and persistent travel supply-loss owners are missing.
- Crime/security: player reputation/notoriety accepts authored crime categories; settlements and quests contain security/crime descriptors; route-security schema and lint support exist without live route-security profile content. There is no ambient crime event owner, victimization/security state, witness/enforcement resolver, kidnapping/extortion runtime, or local crime persistence.
- Institutional burden: polity, settlement, district/site, guild, household/family, institution/service/building schemas and static institutional projections exist. There is no law/obligation ledger, tax/toll/levy/service duty owner, debt/confiscation state, jurisdictional enforcement runtime, or player-facing exemption/appeal contract.
- Corruption/fraud: market values, supply/demand economy rules, trade projections, reputation fraud category, merchant/inspection design boundaries, and static institutional identities exist. No transaction command owner, persistent merchant stock instance, inspection evidence, adulteration/false-measure/counterfeit truth, bribery, contract, or legal-recourse runtime exists.
- Information: world maps/features, known locations, Geographic Knowledge, Knowledge evidence/progress/snippets, contextual projections, and authored stock/value inputs exist. No character-relative map truth, rumor/misinformation claim state, source confidence, uncertain stock projection, legal-knowledge state, or navigation-friction owner exists.
- Persistence/world consequences: `SaveSnapshot` stores world, civilization, player, game, clock, and session state. Civilization ticks have economy ledgers/market projections and settlement/institution derivations. There is no durable shortage/outbreak/displacement/institutional-memory/NPC vulnerability/recovery state machine; much institutional state is derived from static content and current market inputs.

## 2. Contradiction Table

| Live fact | Accepted target | Severity | Contract repair required |
| --- | --- | --- | --- |
| `runDifficulty` combines tier and `hardcore`. | Difficulty, World Rules, and Stakes are orthogonal. | blocking for implementation | Replace with versioned `campaignRules`; isolate compatibility input at migration boundary. |
| `hardcore` changes recovery/caps and death/Prestige semantics. | Forsaken tunes consequences; Grim selects systems; Stakes owns death/save permanence. | blocking | Split every field by owner; delete no behavior through an implicit boolean mapping. |
| HP zero permanently archives all ordinary and hardcore runs and clears saves. | Normal Stakes must not gain permanent campaign loss from difficulty or World Rules. | blocking, user decision | Stakes owner must define ordinary defeat/death before migration; no axis implementation may preserve this by accident. |
| No World Rules or Stakes identity exists in save or Chronicle. | Campaign identity must record all axes. | blocking | Add versioned identity to save and run-history records before owner consumers. |
| New games silently lock normal/non-hardcore with no UI selection. | Mortal is default, but all three axes must be explained separately. | material | Add creation-owned selection only after contracts/default migration exist. |
| Easy/normal/hard/brutal have four scalar bundles; accepted names have Story plus three full-system presets. | Story is an abstraction, not an easy scalar. | material | Reuse easy/normal/hard tuning only as Favored/Mortal/Forsaken seeds; design Story behavior separately. |
| Brutal has no accepted one-to-one target. | Only Forsaken is the hardest accepted preset. | migration hazard | Preserve legacy brutal provenance/custom values or explicitly accept loss of distinction. |
| Live body state always computes technical nutrition. | Story may bypass, collapse, hide, or neutralize it. | missing capability | Story policy must be owner-aware and tested; UI hiding alone is insufficient. |
| `dailyCalories: 100` and current consumable values are legacy game units. | Future internal nutrient truth is canonical physical kcal/macros. | blocking for nutrition integration, not campaign identity | Campaign rules must not freeze or reinterpret these values; nutrition contract migrates them separately. |
| `PlayerState.attributes` is directly incremented by stat growth. | Base attributes are immutable; developed and structural-loss adjustments surround them. | blocking for structural-loss implementation | Attribute owner needs its accepted resolver/migration before Story structural-loss rules can be fully applied. |
| No structural-loss adjustment or atrophy state exists. | Favored/Mortal/Forsaken enable persistent structural loss with different tuning. | missing capability | Do not fake this with current starvation/Strength-efficiency penalties. |
| Encounter `difficultyTier`, process difficulty, and combat-profile `hardcore` use overlapping words. | Similar names do not share authority. | naming hazard | Preserve domain fields; rename or qualify player-facing combat preference; document type separation. |
| Fixed UI warnings/previews are not difficulty-owned. | Presets may vary warning lead time and forecast precision; accessibility remains independent. | owner gap | Define an information-policy projection that consumes authoritative state without changing truth. |
| Chronicle labels only ordinary versus hardcore death and payout uses that reason. | Chronicle/achievement identity should reflect selected axes independently. | compatibility hazard | Store rule identity/provenance at run creation; migrate legacy labels without claiming Grim or future Stakes. |
| Tracked JS mirrors duplicate TS implementations. | One coherent implementation. | delivery hazard | Regenerate/verify mirrors in the same later package. |

No live fact contradicts the controlling design decision. The live repository instead demonstrates why the separation contract is necessary.

## 3. Three-Axis Target Contract

### Canonical identifiers

```ts
type DifficultyPresetId = "story" | "favored" | "mortal" | "forsaken";
type WorldRulesId = "heroic_world" | "grim_world";
type StakesRulesId = "normal_stakes"; // expand only after a later accepted Stakes decision

interface CampaignRulesState {
  version: 1;
  difficultyPreset: DifficultyPresetId;
  worldRules: WorldRulesId;
  stakesRules: StakesRulesId;
  customOverrides?: CampaignRuleOverrideState[];
  migration?: CampaignRuleMigrationProvenanceState;
}
```

Do not add `ironbound` to `StakesRulesId` until the name and behavior are accepted. Do not use a free-form object for overrides. Each override should reference an owner-approved key registry and store value, owning domain, source (`player_customization`, `legacy_migration`, or `developer_fixture`), base preset, and ruleset version. Provenance is campaign identity and must survive save/load and Chronicle projection.

### Ownership and lifetime

- Campaign creation owns selection and creates one immutable `CampaignRulesState` identity.
- The game/session state supplies that identity to domain owners. The difficulty resolver may return domain-specific policy; it must not mutate world or stakes state.
- Save snapshots and account run-history records store the identity. Save metadata may project labels but is not authoritative.
- The smallest safe first implementation locks all simulation axes and custom overrides after campaign creation. Accessibility and presentation settings remain changeable.
- A later change-policy contract may allow difficulty-only changes, but Story transitions are unsafe while technical state may be skipped and achievement provenance matters. World Rules changes are unsafe because they add/remove persistent modules. Stakes changes are unsafe because they affect rollback and integrity. No direction is silently reversible.
- If later changes are accepted, retain an append-only rules-change history and mark achievement/Chronicle eligibility from the least restrictive state used. World Rules and Stakes should remain creation-locked unless a dedicated migration proves state closure.

### Identity implications

- Chronicle records should store the full three-axis identity, rules version, and override provenance at run creation and terminal archival.
- Achievements should either declare allowed rule predicates or remain rules-agnostic. The first package should record identity without inventing rewards or exclusions.
- Analytics do not exist. Any future analytics event must use the same stable ids and rules version, not player-facing localized labels.
- UI should show three separately titled controls with one-sentence ownership explanations: “Difficulty changes forgiveness,” “World Rules select simulated systems,” and “Stakes govern saving and permanence.” A summary must never call Forsaken or Grim “permadeath.”

## 4. Preset Migration Map

| Legacy state | Target preset | World Rules | Stakes | Compatibility posture |
| --- | --- | --- | --- | --- |
| missing/invalid | Mortal | Heroic World | Normal Stakes | Conservative default with `migration.source = legacy_default`. |
| `easy`, non-hardcore | Favored | Heroic World | Normal Stakes | Reuse current easy values only as candidate owner tunables; no Story abstraction. |
| `normal`, non-hardcore | Mortal | Heroic World | Normal Stakes | Closest direct map. |
| `hard`, non-hardcore | Forsaken | Heroic World | Normal Stakes | Closest direct map. |
| `brutal`, non-hardcore | Forsaken | Heroic World | Normal Stakes | Record legacy-brutal provenance and preserve owner-approved scalar differences as migration overrides until an explicit compatibility decision removes them. |
| any tier, `hardcore: true` | mapped preset above, usually retaining tier mapping | Heroic World | Normal Stakes by conservative default | Never infer Grim or restricted Stakes. Preserve non-stakes tuning only as typed legacy overrides. Quarantine `deathZeroesPrestige`, `hardcore_dead`, and save-clearing behavior for the Stakes/Chronicle migration decision. |

Exact reusable live fields:

- Reuse under difficulty ownership: stat-growth load threshold, saturation, recovery capacity and gate scalars; skill/Knowledge requirement and progression scalars; body-state deficit onset, surplus persistence, resource drain, recovery effectiveness, fatigue-debt persistence, penalty severity, starvation/dehydration escalation; owner-approved Prestige reward weighting.
- Split before reuse: `hardcore.recoveryScalar`, `deficitRecoveryScalar`, `aftereffectPersistenceScalar`, `partialRecoveryScalar`, and `removeForgivenessCaps` are difficulty/body-state candidates; `deathZeroesPrestige` is Stakes/achievement-owned; `prestigeMultiplier` requires explicit achievement/Legacy ownership.
- Deprecate after migration: `RunDifficultyTierId`, `RunDifficultyState.tier`, `RunDifficultyState.hardcore`, `HardcoreDifficultyOverlayState`, and `hardcoreEnabled`.
- Do not migrate: encounter/material/process `difficultyTier`, monster `difficultyScalingHooks`, settlement infrastructure difficulty, or combat-profile `preferredMode`. They are separate authorities.

Story needs new explicit policies rather than copied easy values: nutrition consequence mode, technical-state update mode, persistent structural-loss disablement, recovery/assistance posture, and Grim-module coarse adapters. “Hide the meters” alone does not meet the contract.

## 5. Nutrition Placement Analysis

### What the live implementation can support

- Consequence tuning without changing authored item values is already structurally possible: item/consumable data enters `applyConsumableToBodyState`, while `runDifficulty` changes body-state thresholds/rates/resolution after intake.
- The same `runDifficulty` is already threaded through new-game initialization, save migration, travel, activities, rest, consumable application, body-state projection, stat growth, and snapshot synchronization. This is a usable integration seam for `campaignRules`.
- Save snapshots already persist body state and game state together, so campaign identity can be added without a parallel nutrition save.
- UI previews simulate the authoritative body-state functions, which is a useful preview/execution parity foundation.

### What it cannot yet support safely

- There is no explicit Story bypass/neutralization policy. Every run creates and advances technical body state.
- Current energy is reserve/band based with legacy `dailyCalories: 100`, not the accepted digestion/kcal/fat/Protein Support architecture.
- There is no fat reserve/body composition, digestion pool, Lean Condition, Recovery Debt as the accepted distinct model, atrophy pressure, structural-loss adjustment, or rebuilding path.
- Attributes are one mutable record. The accepted immutable base/current resolver must land before persistent structural consequences.
- No Grim health/sanitation extension seam exists beyond generic hazard/status vocabulary. Adding contamination directly to current body state would prematurely create a parallel health owner.

### Required contract posture

- Favored, Mortal, and Forsaken consume identical authored nutrient truth. Difficulty changes only policies applied to character consequences.
- Mortal Heroic World includes core digestion, Energy, Stamina, hunger/satiety, hydration, Protein Support, fat reserve, recovery, current attributes, and long-duration structural loss after those owners exist.
- Story chooses an explicit per-owner strategy: compute invisibly, replace with coarse state, or bypass with a defined neutral output. The save must remain valid if technical state is absent or inert.
- Grim World supplies contamination/illness/sanitation exposure inputs to the same body/health owner; it must not fork food values or create a second metabolism system.
- No balance values are selected here.

## 6. Grim Module Classification

| Module family | Existing owner/foundation | Missing authority | Placement | Decisions and counterplay | Persistence, anti-frustration, tests, dependencies |
| --- | --- | --- | --- | --- | --- |
| Health, sanitation, contamination, parasites, wound infection | body state; combat status/injury vocabulary; items/consumables; climate; settlement water/infrastructure; hazard schema/lint | health/exposure ledger, contamination truth, sanitation/environment sources, disease progression, treatment, outbreak/public-health owners | core Grim candidate, phased; specific diseases/content later | choose water/food/source/treatment/quarantine tradeoffs; counter with hygiene, safe preparation/storage, equipment, Knowledge, healers, shelter | causal exposure receipt, severity windows, recovery and outbreak state; never hidden random illness; first dependency is health/status owner plus generic exposure contract |
| Water, fuel, shelter, storage, spoilage, vermin, equipment care, logistics | items/containers/recipes; buildings/storage/services; settlement infrastructure; climate, transport, travel, economy | generic item instances, storage conditions, supply ownership, spoilage/vermin, equipment condition/maintenance, pack-animal, travel-loss state | core Grim logistics should be a bounded slice; specialized burdens optional/later | route, load, lodging, fuel, preservation, maintenance, supplier choices; counter with tools, containers, services, planning | persistent inventories/conditions and deterministic elapsed time; batching/automation and meaningful thresholds prevent chores; depends on item-instance, inventory, time, travel, economy owners |
| Violent crime and personal security | reputation/notoriety categories; settlements, districts, quests, route-security schema/lint; combat/event foundations | contextual crime opportunity, victimization, witness, enforcement, protection, capture/kidnapping, restitution owners | optional Grim submodule until social/law runtime exists; authored incidents may remain content | route/district/time/displayed wealth/escort/lodging choices; counter with local Knowledge, allies, guards, discretion, reputation | incident identity and legal/reputation consequences; strong telegraphing and safe zones; test local variation and proportional frequency; depends on people/NPC, law, event, combat/escape owners |
| Tolls, taxation, levies, service, requisition, debt, confiscation | polities, settlements, institutions, guilds, households, property projections, economy/currency | jurisdiction/law, obligation assessment, status/exemption, notice, debt, appeal/compliance, enforcement and service-work owners | later Grim content/module, not a universal core mechanic | pay, negotiate, appeal, claim privilege, perform service, relocate, accept debt; counter through status, records, patrons, law, money | persistent obligation ledger and due process; no surprise universal seizure; tests per polity/status/jurisdiction; depends on polity/law/household/economy/activity contracts |
| Corruption, bribery, adulteration, false measures, counterfeiting, contract fraud | economy/market values, reputation fraud, merchant/inspection decisions, Knowledge/evidence concepts | item/stock instance truth, transactions, observation/appraisal, contract/claim, institution corruption and legal recourse | one representative Grim economy slice after transaction truth; remaining forms optional/later | inspect, request guarantees, use witnesses/guilds, bargain, refuse, report, seek remedy; counter with skill/Knowledge/reputation/status | persist true goods, observed claims, seller identity, evidence, remedy; uncertainty bounds and non-rerollable manifests; depends on item-instance, market transaction, inspection, law owners |
| Imperfect maps, rumors, misinformation, stock/legal uncertainty, navigation friction | maps/features, known locations, Geographic Knowledge, Knowledge evidence/progress, travel, market projections | character-relative claims, source/confidence/freshness, map observation, uncertain projections, legal Knowledge, navigation error owner | core Grim information layer only after shared claim contract; HUD reduction is optional accessibility/presentation | compare sources, hire guides, scout, update maps, inspect markets/law; counter with Knowledge and relationships | persist claims/evidence/freshness separately from truth; never hide obvious character knowledge; test UI does not mutate truth; depends on Knowledge/location/merchant/law projection owners |
| Shortages, outbreaks, displacement, institutional memory, NPC vulnerability, world recovery | save holds world/civilization state; economy ledgers/market states; settlement/institution derivations; Chronicle/events | durable local condition identities, population/NPC/household vulnerability, causal propagation, recovery, institutional-memory owners | later integration layer after representative modules; not first Grim slice | allocate supplies, aid/leave, coordinate institutions, exploit or repair markets, protect people; counter with preparation and collective capacity | long-lived but bounded state with recovery paths; avoid permanent spiral and catastrophe saturation; integration tests across tick/save/load; depends on all selected module owners and authoritative time/events |

Recommended first representative Grim slice: health/sanitation only after a separate contract narrows it to one traceable exposure, one settlement/environment source, one treatment/counterplay path, and save/load behavior. This is a recommendation, not authorization or a selected implementation.

## 7. Stakes Separation Plan

### Live baseline to replace deliberately

Current behavior is not “Normal Stakes”: any player HP-zero state archives the run and clears all saves. `hardcore` only changes the archive label and some payout/tuning. There is no rollback or defeat recovery. This must be treated as legacy behavior, not silently blessed as the future default.

### Separate contract shape

The Stakes owner should eventually describe independent policies for:

- save topology: normal manual/quick/auto, restricted count, single authoritative save, save-and-exit;
- write semantics: overwrite, rotation, atomic commit, crash backup, corruption recovery;
- rollback: permitted checkpoints, load-after-failure, stale-copy rejection, replay/idempotency;
- player defeat: incapacitation, rescue, capture, injury, loss, retreat, death, or campaign end;
- player death: reversible, character-permanent with lineage continuation, or campaign-terminal;
- party/NPC death: encounter defeat versus persistent death, injury, disappearance, or replacement;
- succession: heir eligibility, active-world continuation, estate, Chronicle, Legacy, and player control transfer;
- retirement/deletion: voluntary retirement, campaign archival, user deletion, and whether local save files are retained;
- integrity: opt-in confirmation, rule-change lock, achievement eligibility, tamper/crash distinction, and recovery audit trail.

### Initial safe posture

- Only `normal_stakes` should be canonical in the first three-axis identity package.
- Keep existing save capacity and manual/quick saving until a later save-owner decision changes it.
- Do not infer that Normal Stakes authorizes permanent death. Before runtime migration, decide an ordinary HP-zero resolution that does not accidentally destroy the campaign.
- Do not introduce `ironbound`, a single-save rule, permanent death, party/NPC permanence, automatic campaign deletion, or succession-on-death without the later decision.
- Keep all axes creation-locked initially. A future Stakes mode can only be opted into at creation with a prominent, specific warning; it cannot be activated by Forsaken, Grim World, an achievement, or a mid-campaign toggle.
- Crash/corruption recovery must be out-of-band from gameplay rollback: at least one verified prior generation or journal may protect technical failure without granting a chosen reload. Exact mechanism remains for the save owner.

### Migration hazard

Legacy `hardcore: true` cannot be mapped honestly to a future restricted Stakes option because no such option is accepted and current hardcore has no restricted-save topology. Legacy `dead`/`hardcore_dead` Chronicle records remain historical labels. Active old saves should default to Normal Stakes and preserve a migration marker; the user must decide whether their existing HP-zero permanence is grandfathered, repaired to normal defeat behavior, or represented by a temporary compatibility policy.

## 8. Combination Matrix

| Difficulty | World Rules | Conceptual support | Main requirement/hazard |
| --- | --- | --- | --- |
| Story | Heroic World | supported target | Requires explicit coarse/bypass policies; not present live. |
| Story | Grim World | supported target | Every selected Grim module needs a Story adapter that produces broad events/choices without technical meters. A module without that adapter is unavailable, not silently full-detail. |
| Favored | Heroic World | supported target | Full core systems with favorable owner tuning and unchanged physical truth. |
| Favored | Grim World | supported target | All selected Grim modules exist; thresholds, warnings, and recovery are favorable. |
| Mortal | Heroic World | default target | Conservative old-save default; core nutrition remains enabled after its accepted implementation. |
| Mortal | Grim World | supported target | Baseline full harsh-world simulation; not a release default implied by “Mortal.” |
| Forsaken | Heroic World | supported target | Demanding scalar/threshold posture without sanitation, ambient crime, institutional burden, or other Grim modules. |
| Forsaken | Grim World | supported target | Most demanding combination, still Normal Stakes unless separately selected. |

Unsupported today: all Story behavior, all Grim modules, custom overrides, explicit Stakes selection, and any creation UI. Migration hazard: current `hardcore` cannot select any one target axis. UI must show World Rules and Stakes even when only their default/sole implemented choice is available, or clearly defer the unavailable choices without implying coupling.

## 9. Owner And Setting Classification

Each row has exactly one classification from the required vocabulary.

| Setting or field | Classification | Owner note |
| --- | --- | --- |
| stat-growth threshold/cap/recovery scalars | difficulty scalar or threshold | difficulty policy consumed by stat-growth owner |
| skill/Knowledge progression scalars | difficulty scalar or threshold | progression owners consume them |
| body deficit onset, drain, grace, recovery, penalty, atrophy/rebuilding rates | difficulty scalar or threshold | body/attribute owners retain mutation |
| enemy damage/health campaign modifier, if later accepted | difficulty scalar or threshold | combat owner; current encounter `difficultyTier` remains world/encounter context |
| merchant price outcome weighting, if accepted | difficulty scalar or threshold | economy owner; physical goods and fraud truth unchanged |
| health/sanitation simulation existence | world-rule module toggle | Grim health module |
| food-borne disease existence | world-rule module toggle | Grim health module; nutrition forgiveness is separate |
| ambient crime/security simulation existence | world-rule module toggle | Grim social/legal module |
| corruption/fraud systemic existence | world-rule module toggle | Grim economy/legal module |
| save count/frequency topology | stakes rule | save/campaign-stakes owner |
| permanent player/party/NPC death | stakes rule | death/succession owners under Stakes |
| map assistance, warning lead time, forecast precision, causal explanation | accessibility or information setting | may have preset defaults but player accessibility cannot be made a hidden difficulty penalty |
| theme, time zone, hour format, reduced motion, purely visual density | presentation-only setting | local UI; never campaign identity unless mechanically informative |
| starting region/backstory/campaign scenario/module content pack | content or campaign-selection rule | authored start/campaign content, not difficulty |
| legacy brutal scalar preservation or player-chosen owner-approved deviations | custom override | typed provenance required |
| authored food kcal/protein, item manifest, map/world fact, base attribute | content or campaign-selection rule | not a tunable setting; authoritative domain truth selected with campaign/content |
| combat profile `preferredMode` | presentation-only setting | currently a stored preference; rename away from `hardcore` if it gains behavior |

## 10. Migration And Compatibility Map

| Surface | Required migration |
| --- | --- |
| Save snapshot | Introduce a new snapshot/rules version; read legacy `runDifficulty` once, write canonical `campaignRules`, retain migration provenance, and stop dual-authority writes after acceptance. |
| Missing axes | Always default old saves to Heroic World and Normal Stakes. Never infer Grim or restricted Stakes. |
| Old tiers | Apply the preset map in Section 4. Invalid/missing values become Mortal. |
| Old hardcore | Split non-stakes scalars into typed legacy overrides only if compatibility requires them; hold death/save/Prestige semantics for explicit owner decisions. |
| Custom values | No live custom state exists. Future custom values require stable registry keys, source preset/version, value, owner, and eligibility provenance. |
| Body state | Preserve current stored body state during identity migration; do not reinterpret legacy 100-unit Energy/nutrition as kcal or synthesize structural loss. Story transition requires a separate state policy. |
| Attributes | Do not label current mutable attributes as immutable base values. Attribute migration must identify base/developed/structural/reversible components before structural-loss integration. |
| Chronicle | Add campaign-rule identity and migration status to new/active records. Preserve historical `hardcore_dead` text as legacy outcome data, not proof of a selected future Stakes id. |
| Achievements/Legacy | Record identity first. Do not change awards, multipliers, or eligibility until each rule declares its policy. Revisit `hardcore_dead` modifier and `deathZeroesPrestige`. |
| UI/localization | New stable ids need localized labels/descriptions and separate axis controls. Existing “difficulty” badges for starts/tasks must stay qualified. |
| Determinism/replay | Include rules version, overrides, and rule-change history in deterministic inputs. Do not seed randomness from localized names or mutable UI state. |
| Multiplayer/shared world | No live multiplayer/network authority exists. Do not design negotiation or host/client override behavior. A future shared-world contract must select one authoritative campaign identity. |
| Generated JS | Regenerate or update tracked JS mirrors with TS sources and verify parity. Do not hand-edit build output in isolation. |
| Old envelopes | v1-v5 local envelopes are currently only flagged incompatible. Broader envelope migration is a separate save-owner decision; campaign-rules work should not claim it. |

Conservative default for every pre-axis campaign: Mortal + Heroic World + Normal Stakes, with explicit legacy provenance. This recommendation does not decide how to repair current universal HP-zero archival.

## 11. Test Matrix

| Test | Required proof |
| --- | --- |
| Canonical defaults | New and legacy-missing saves resolve to Mortal/Heroic World/Normal Stakes. |
| Axis independence | Cartesian tests show changing one axis does not mutate either other id or unrelated owner values. |
| Legacy tier migration | easy/normal/hard/brutal and invalid values map exactly as documented with provenance. |
| Legacy hardcore migration | Never produces Grim World or a future restricted Stakes id; quarantines owner-specific legacy behavior. |
| Story nutrition | Technical state is bypassed/neutralized/coarsened according to explicit policy; authored item nutrient truth remains unchanged and save/load remains valid. |
| Full-system food truth | Favored, Mortal, and Forsaken resolve the same authored food values and consumed physical amounts. |
| Mortal completeness | Every module selected by World Rules is enabled; Mortal does not disable a selected mechanic. |
| Forsaken separation | Forsaken/Heroic has no Grim-only systemic modules; Forsaken never changes Stakes. |
| Grim semantics | At least one representative Grim module adds typed state/events/decisions rather than only scalar differences. |
| Story + Grim | Selected modules use their coarse Story adapter and retain causal choices without technical micromanagement. |
| Heroic health boundary | Systemic contamination/disease/sanitation state is absent unless separately authored content invokes an allowed non-Grim event. |
| Core nutrition placement | Mortal/Heroic retains digestion, Energy, Stamina, hunger/satiety, hydration, Protein Support, fat reserve, recovery, current attributes, and structural loss after those owners exist. |
| Stakes independence | Every difficulty/world combination under Normal Stakes yields the same save/death policy. |
| Ordinary defeat | HP-zero resolution follows the accepted Normal Stakes contract and does not accidentally archive/delete saves. |
| Save topology | Normal, restricted, single-save, and save-and-exit behaviors are tested only when accepted; crash recovery cannot be exploited as chosen rollback. |
| Party/NPC permanence | Encounter defeat is distinct from persistent death and follows the selected Stakes policy when an owner exists. |
| Campaign identity | Snapshot, save metadata projection, run history, Chronicle, and any achievement predicate retain all ids, version, and override provenance. |
| Rules lock | Creation-locked axes reject mutation; any later allowed change records append-only provenance and eligibility effects. |
| Custom overrides | Only registered owner keys validate; base preset, source, value, version, and owner survive roundtrip. |
| Determinism | Same state, rules identity, version, and seed produce identical results; save/load does not reroll. |
| Naming isolation | Encounter/process `difficultyTier` and combat-profile mode do not deserialize as campaign difficulty. |
| Generated parity | TS and tracked JS expose matching contracts/behavior. |
| Held route | `0.6.6` pointer and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` remain unchanged and recoverable. |

## 12. Exact Remaining User Decisions

1. Accept or replace the recommendation that all three axes and custom overrides are creation-locked in the first implementation.
2. Decide the ordinary Normal Stakes HP-zero outcome. The current universal run archival/save clearing cannot remain implicit.
3. Decide how active legacy `hardcore: true` saves preserve or drop death, Prestige, and recovery behavior without being mislabeled Grim or future restricted Stakes.
4. Decide whether legacy `brutal` becomes Forsaken with provenance-only history or Forsaken plus compatibility overrides.
5. Select Story’s per-owner state strategy: which technical systems compute invisibly, use coarse state, or are not advanced, including what happens to pre-existing structural state.
6. Decide whether custom overrides ship in the first campaign-rules package or the field remains reserved but absent from player UI.
7. Decide Chronicle/achievement/Legacy policy for rule identity, changed rules, custom overrides, and migrated campaigns.
8. Select which Grim module families are required core, optional submodules, or later content, and accept the first vertical-slice family.
9. Decide whether the combat-profile `normal | hardcore` vocabulary is renamed now or explicitly documented as a separate combat preference.
10. Later, in the separate Stakes decision: accept or reject `Ironbound`, save topology, player/party/NPC death permanence, succession, retirement/deletion, warnings, recovery, and post-creation changes.

Exact Favored/Mortal/Forsaken values are intentionally not user decisions for this audit; they remain later owner-specific balance work.

## 13. Recommended Package Sequence

No release version is assigned.

1. Unversioned campaign-rules identity, migration, and change-policy acceptance decision resolving Decisions 1-7 above.
2. Versioned campaign-rules contract/schema/types/default/migration package, including save and Chronicle identity but no Grim module or restricted Stakes.
3. Campaign-creation and read-only in-game projection for the three separate axes, with Mortal/Heroic/Normal defaults and no UI-authored mechanics.
4. Difficulty adapter migration from easy/normal/hard/brutal and the non-stakes portion of legacy hardcore; update stat growth, progression, body state, Prestige policy, tests, and tracked JS mirrors.
5. Story abstraction contract and implementation across body state, nutrition, attributes, warnings, previews, and save migration after the accepted core owners exist.
6. Core nutrition/current-attribute implementation sequence under Favored/Mortal/Forsaken and Heroic World, using one metabolism and one attribute resolver.
7. Separate Grim health/sanitation owner decision and one narrow vertical slice.
8. Separate Grim social/legal decision and slice.
9. Separate Grim economy/fraud decision and slice.
10. Information-friction claim/projection contract, then persistent world-consequence integration.
11. Separate Stakes decision; only then implement any restricted saving, permanent death, or succession behavior.

Do not restore held `0.6.6`, consume retained `0.6.7` artifacts, or advance a milestone as a consequence of this planning sequence.

## 14. Explicit Non-Decisions

This audit does not:

- implement or authorize campaign rules, schemas, runtime, saves, migration, UI, balance, tests, content, disease, sanitation, crime, law, taxes, service, corruption, fraud, information friction, or permanent death;
- accept exact preset values, formulas, grace periods, rates, floors, rewards, or warnings;
- accept `Ironbound` as an identifier or define any future restricted Stakes behavior;
- decide that ordinary player, companion, party, or NPC death is permanent;
- decide that all proposed Grim families ship together or that any culture, polity, class, lineage, or settlement is universally unsafe;
- treat encounter, task, material, route, or content difficulty as campaign difficulty;
- convert legacy `dailyCalories: 100` into canonical kcal;
- reinterpret current mutable attributes as immutable base attributes;
- create a follow-on prompt, assign a release version, restore `0.6.6`, or alter `0.6.7` artifacts.
