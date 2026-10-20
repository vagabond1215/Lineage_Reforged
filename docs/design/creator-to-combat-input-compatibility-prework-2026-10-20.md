# Creator-to-Combat Input Compatibility Prework

Date: 2026-10-20. Repository: `vagabond1215/Lineage_Reforged`. Connector-only, documentation-only independent prework at hosted `master` source `9bc145aefd7e99ceee4ec317584543f6dfe78878`. **CANDIDATE_INTEGRATION_PREWORK; NOT A NEW CREATOR OR COMBAT IMPLEMENTATION DECISION.** Development impact `none`; Game-version impact `none`; Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `GAME_VERSION_NOT_READY` remain unchanged.

This note is intentionally **outside** the active `DEV-0.7.2.1 Combat Terminal Owner And Durability Slice` and does not update `docs/dev/current-codex-prompt.md`, current Codex output/handoff, acceptance ledgers, held creator branches, source code or tests. It does not reopen settled creator mechanics, implement future creator choices, or bind combat skeleton acceptance to natural encounter victory. It is an input to a later explicit creator/combat integration review, not active prompt authority.

## 1. Why this seam needs early attention

The project owner intends substantial subsequent work on creator stat allocation, skills, equipment, items and character progression. Today's newly created Warrior and its three-foe encounter are not a balance calibration source. The combat skeleton should receive a validated **resolved character state**, not become dependent on the current creator's generated-attribute distribution, selected starter bundle, UI choice labels, or a particular Stonevein build.

Current authority chain (source-derived):

`CharacterCreationFormState` and approved account/Legacy preparation choices
→ `resolveCharacterCreationAttributes` and `deriveCharacterCreationState`
→ `createNewGameSnapshot` with validated `PlayerState`, equipment/inventory, resources and campaign identity
→ campaign-owned ordinary exploration/admission
→ `buildPlayerCombatant(playerState, encounterId)` and `buildPlayerHooks(playerState)`
→ combat-owner legal projection/action selection, resolution, result and campaign admission
→ authorized player state and persistence.

**Boundary proposal for later acceptance:** creator owns selecting and materializing legal initial `PlayerState`; combat owns deriving combatant state from that resolved state at encounter admission and validating subsequent action execution. Combat must not recalculate a creator's point budget, infer an intended class from a bundle, invent known spells from metadata, or treat current UI assembly heuristics as permanent equipment policy. This is a proposed integration invariant, not a claim that all runtime variants already satisfy it.

## 2. Current source observations (not future requirements)

| Input/seam | Current source evidence at cited paths | Compatibility risk when creator changes |
| --- | --- | --- |
| Primary attributes | `apps/rpg-ui/src/game-shell/characterCreationMath.ts` currently uses nine `PlayerAttributes`, a 90-point base and 10 generated profile points, with lineage/identity/backstory/profile distribution. `newGameSnapshot.ts` may subsequently apply Legacy preparation adjustments. | Do not hardwire the current 90/10 policy or Warrior values into combat actions/tests. If creator changes allocation, preserve validated attribute semantics and ensure derived resources and combat actor reflect the final accepted state. |
| Classless direction | `newGameSnapshot.ts` initializes `coreData.classId: null`, `jobId: null`, and compatibility `legacyGrowth.classLevel: 0`. The `classless-progression-and-placeholder-provenance-audit.md` classifies these as classless product direction with retained save compatibility. | No new class gate or automatic combat archetype from starter bundle. Do not remove persisted legacy fields as an incidental cleanup. |
| Skills and attributes | New game initializes `skills` from accepted backstory starter skills if present. `combat/index.ts::buildPlayerHooks` reads current skill IDs/ranks and content skill-effect/tactical grants. | Future creation skill choices require their own validated owner and source evidence; effects must derive from accepted skill records, not the creator's display preview or presumed rank. |
| Abilities and traits | `newGameSnapshot.ts` obtains starter abilities from backstory and lineage starter traits; combat stages current ability/trait IDs from accepted player state. | A future ability or trait choice must not automatically become an executable action without a catalog grant, activation/requirements, supported hook, legal target and resource gate. |
| Spells and magic | Current ordinary new game initializes `spells: []`; `buildPlayerHooks` still stages legacy `playerState.spells` into combat grants. Separate known-spell/readiness/magic resolver ownership remains unfinished as recorded in `legacy-combat-spell-runtime-source-map.md`. | Never equate a future creator's spell display/unlock with authorized active casting. Known-spell provenance, compatibility and effect execution need their own explicit owner integration. |
| Equipped items | `newGameSnapshot.ts::buildStarterEquipment` currently maps assembled starter stacks to slots partly through `itemKey` substring heuristics (shield, armor/tunic/cloak, certain weapons, compass); the resulting equipment is authoritative player state for combat hook derivation. | A creator equipment redesign should hand combat canonical equipped item references with valid slots/identities. A substring heuristic is a current implementation detail, not a future equipment-compatibility or handedness rule. |
| Inventory vs equipment | `newGameSnapshot.ts` materializes starter equipment and remaining inventory separately. `combat/index.ts::buildPlayerHooks` reads **equipped** item IDs for item use-profile grants; it does not make every inventoried object an active attack or spell. | Preserve distinction between possession, equipping, legal active grants and consuming an inventory stack. Adding a creator item must not automatically grant combat activation. |
| Weapon and shield actions | Current Short Bow/Composite Bow have ranged action profiles; the 2026-10-20 shield slice projects an equipped `combat.defense.block` to self; basic and item-profile melee remain distinct. Sources: current `items.json`, `combat/index.ts`, and `dev-0.7.2-self-target-shield-block-implementation-record-2026-10-20.md`. | Future bundles may supply offhand/shield, bows, hybrid tools, weapons or no gear. Exact action/source/target selection must follow current accepted equipment and owner grants, not an assumed Warrior sword/shield loadout. |
| Resources and body state | `newGameSnapshot.ts` calculates resources from accepted attributes, lineage/origin, body state, equipment and Legacy modifiers, then initializes/max-fills supported starting resources. `buildPlayerCombatant` copies current HP/MP/Stamina state. | Recompute through the established resource owner when the creator changes values. Combat must respect **current** resource state, not copy creator preview values as cost authorization. |
| Combatant construction and threat | `combat/index.ts::buildPlayerCombatant` copies attributes/resources, equipped item IDs, current effects and actor hooks. `resolvePlayerThreatRating` currently sums all nine attribute values and accounts for high combat/magic skill rank plus counts of learned abilities/spells. | Because the raw sum is insensitive to reallocation at a fixed total, it cannot alone establish that builds with different stat distributions are equally challenging or balanced. Revisit calibration when creator/stat systems settle, not in the combat-skeleton pass. |
| Combat profile and party | New game installs `createDefaultPlayerCombatProfile()`; `buildPlayerCombatant` reads member preferences if present and otherwise uses supported defaults. | Future creator background/profession selection must not silently create a full companion/party/gambit system; retain independent player and future party-control ownership. |
| Account, campaign and durability | `createNewGameSnapshot` emits an epoch-compatible `SaveSnapshot`; combat nearby caller and campaign session owner fence subsequent admitted mutations by artifact/revision/snapshot/tick. | Creator changes must preserve account/campaign identity and save compatibility through a dedicated migration/acceptance path. Do not reset identity or reuse creator draft objects during encounter admission. |

**Source caveat:** `combat-equipment-mapping-audit-plan.md` is a historical audit. Its Short Bow missing-profile observation is stale relative to current `items.json` and current mapping tests. Likewise, the latest self-target Block code exists but is owner/caller proven, **not yet independently selected-UI proven**. Never upgrade an evidence class on the basis of this document.

## 3. Owner handoff and non-duplication rules for a later design decision

1. **Character selection vs executable state.** The creator may display attribute, loadout and ability previews. Only the validated and accepted snapshot becomes a combat input; a hypothetical preview never conveys command authority.
2. **One source of attribute truth.** Final accepted `PlayerAttributes` and resource-owner outputs are the combat inputs. Do not separately copy creator-side point totals or reapply lineage/backstory/Legacy modifiers in the combat owner.
3. **Stable item and skill identity.** Equipped references and content `useProfiles`/skill effects own their original meanings; family tags can grant effects but must not rename an exact action. Avoid the previously repaired basic-melee/sword collision.
4. **No silent active spell/item powers.** A starter book, potion, catalyst, conduit or known-spell-looking record is not an executable combat action until its owner validates possession/provenance, target, timing, costs, supported effects and replay.
5. **Equipment and stacks remain distinct.** Equipping and consuming cannot both mutate the same item via a UI shortcut or stale creator assumption; unresolved handedness, slot compatibility, ammunition, charges and item-instance concerns remain dedicated decisions.
6. **Snapshot authority survives creator evolution.** Combat reads current accepted character state at admission, then preserves campaign owner/revision/ledger boundaries; future migration must be separately accepted, not hidden inside a combat repair.
7. **Difficulty is not an interface invariant.** A representative character may lose a natural encounter. For the skeleton, deterministic owned success/defeat paths and invariant-preserving mutations matter; balance and ordinary natural victory are later Game/vertical-slice evidence.

## 4. Future integration acceptance matrix (NOT executed here)

The following are **test cases to install later when their actual owners are implemented**. They do not assert present success.

| Case | Setup/variant | Required observed invariant |
| --- | --- | --- |
| C1 | Two valid creator resolutions with different final stat distributions, but identical allowed gear | Each accepted character's combatant attributes and resource owner outputs match its accepted snapshot; combat action IDs do not depend on the current 90/10 creator mechanism |
| C2 | No eligible equipped weapon | Safe basic attack or owner-specified alternative remains distinct from absent weapon-profile actions; no borrowed source item |
| C3 | Sword and shield equipped | Basic attack, sword profile and self Block keep distinct action/source/target IDs, costs, timing, acceptance and correct shield provenance |
| C4 | Equipped Short Bow or Composite Bow | Current granted ranged profile is projected only when allowed; current item IDs/skill effects are retained; no unimplemented ammo or range deduction is fabricated |
| C5 | Item in inventory but not equipped | No false weapon action grant from mere possession; future item-use actions require separate owner-authorized activation |
| C6 | Low or high legitimate starter skill ranks | Combat scaling/effects read actual accepted skill state; no assumed profession/class rank, fabricated skill unlock or duplicated gain |
| C7 | Accepted backstory/trait/ability variation | Only supported actions/hook effects become available; unknown or unsupported action behavior fails closed |
| C8 | Hypothetical creator-known spell, potion, magical focus or catalyst | Metadata/unlock alone cannot bypass future known-spell/item activation owners, resource/quantity handling or effect policy |
| C9 | Reopen or load an earlier accepted campaign | Existing saved character attributes/equipment/resources and actor action source still resolve through accepted compatibility; no creator draft recalc or hidden schema migration |
| C10 | Concurrent/stale creator or encounter intent | Existing account/campaign/source-revision fencing and mutation ownership reject stale or duplicated requests without unintended snapshot change |
| C11 | Normal defeat and deterministic legitimate victory fixtures | Both terminal result/cleanup/continue/save invariants hold **without** changing starter stats or asserting natural battle balance. This case belongs to the current dedicated combat-terminal Codex slice and is not performed in this prework |

Prioritize C1-C10 only after the corresponding creator or combat system owner has an approved implementation route. In particular, **do not add these tests to the active terminal slice** or change its fixed test plan.

## 5. Named dependencies, ownership and handoff triggers

- Current accepted combat priority: [Combat Skeleton First](combat-skeleton-first-priority-and-acceptance-boundary-decision.md) and [Combat Skeleton Capability Audit](combat-skeleton-capability-and-owner-contract-audit-2026-10-20.md).
- Current executing/installed Codex lane: `DEV-0.7.2.1 Combat Terminal Owner And Durability Slice` in `docs/dev/current-codex-prompt.md`. This prework must not change its files, exact validation boundary, historical results or promised outcomes.
- Creator baseline: `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`, `characterCreationMath.ts`, `characterCreationCatalog.ts`, `packages/shared/types/src/contracts.ts`.
- Existing decisions and research: [Attribute/Skill/Ability Responsibility Audit](attribute-skill-ability-responsibility-audit.md), [Classless Progression And Placeholder Provenance Audit](classless-progression-and-placeholder-provenance-audit.md), [Weapon/Armor Profile Schema Decision](weapon-and-armor-profile-schema-decision.md), [Contextual Action Surfaces](contextual-action-surfaces-inventory-crafting-and-trade-decision.md), and [Legacy Combat Spell Runtime Source Map](legacy-combat-spell-runtime-source-map.md).
- When the owner selects the creator renovation design/integration pass, read the **live** creator planning and implementation refs at that time; these are currently held, not merged. Decide then whether C1-C10 should become a separate integration-gate matrix, and whether any outdated starter equip heuristic, status projection or schema migration requires its own narrow owner action.
- When the active Codex terminal slice finishes, its accepted evidence owns C11. Do not alter or self-accept it through this connector-only document.

**Publication limitations:** read-only source/docs inspection and one independent new Markdown document. No local tests, build, browser selected proof, migration, package/schema changes, character creation implementation, game version or milestone acceptance are claimed. Zero use of protected local/hosted accounts or saved profiles. No branch integration, rebase, deletion, deployment or Site-source mutation. The repo's existing held/protected branch register remains authoritative until its named review trigger.
