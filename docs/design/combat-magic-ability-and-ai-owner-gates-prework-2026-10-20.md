# Combat Magic, Ability, And AI Owner Gates Prework

Date: 2026-10-20. Repository: `vagabond1215/Lineage_Reforged`. Independent connector-only documentation pass following item activation prework at `ae339d3b46cf70a05fb1e43c2711c66d59234ccd`. **DEFERRED_CAPABILITY_GATES_PREWORK; NO ACTIVE MAGIC, ABILITY OR PARTY RUNTIME AUTHORIZED.** Development impact `none`; Game-version impact `none`. Do not conflate this with the active `DEV-0.7.2.1 Combat Terminal Owner And Durability Slice` or change its exact verification matrix.

## Status distinctions that must survive creator and combat renovation

| Capability | Source-backed current status | What must not be promoted from it |
| --- | --- | --- |
| Legacy spell-shaped combat templates | `combat/index.ts` has damage/healing/status spell templates and `buildPlayerHooks` derives catalog `spellActionGrants` from `playerState.spells` | Template/hook availability does not establish character-scoped known-spell provenance, current magic readiness, controlled casting, correct multi-effect semantics, catalysts/conduits, or a full active magic resolver |
| Known-spell/magic helpers | `magic-command-contract-plan.md` describes explicit caster, known-spell ref, target and conduit/catalyst sources; pure readiness/resolver helpers and inert output envelopes exist | A “ready” description or inert envelope cannot mutate HP/MP, spend a catalyst, queue an action, generate an event or produce an effect |
| Spell compatibility | `player/spells.json` contains current `ready`/`partial`/`deferred` compatibility metadata; `legacy-combat-spell-runtime-ownership-plan.md` finds legacy staging does not gate on this status | “ready” catalog metadata is neither owner acquisition evidence nor necessarily implemented combat cast semantics |
| Multi-effect/utility spells | Legacy resolver can inspect `heal.hp`, `damage.magic` and status-like hooks; the source-map documents heal-before-damage and temporary status approximations | No drain spell, movement/teleport, summoned entity, generated item or complex layered effect should be advertised as complete without an explicit effect owner/order |
| Physical/tactical ability grants | `buildPlayerHooks` reads player ability IDs, looks up catalog activation/requirements and builds `abilityActionGrants`; `resolveGrantedActionTemplate` maps grants to action shapes, resources, hooks and source ID | Catalog ability, reaction, tactical tag or owned state alone does not prove selected UI support, target-condition enforcement, reaction triggers, cooldown policy, proper skill gating or every ability effect |
| Weighted combat AI | `combat-ai-and-gambit-current-state-audit.md` confirms scored action/target preferences, role presets and enemy AI tick integration | This is **not** a literal ordered conditional gambit interpreter or a fully persistent allied-companion battle system |
| Party/companion control | Combat shared contracts contain party, tactics and manual override shapes | Current ordinary nearby encounter does not prove a recruited NPC's durable HP, equipment, injuries, abilities, loyalty, AI controls or independent persistence |

## A boundary-preserving integration path

**Magic, separately owned**
1. Resolve whether a player **actually knows** a given spell, with valid character-scoped record/acquisition evidence; preserve historical `PlayerSpellState[]` compatibility without treating it as magic permission.
2. Check authored compatibility and **current cast readiness**, including exact caster, casting control, target disposition/shape, conduit/catalyst source, costs and any special policy. A failed or deferred capability must fail closed.
3. Translate approved magic **intent** to a typed owner command; determine if/how combat action staging, interrupt windows and resource reservation consume that result, without having React authorize effects.
4. Resolve only explicitly supported effect families. Multi-effect ordering, life-drain semantics, target identities, status duration/stacking, movement, generated item and backlash need separate owner rules. Never “fix” drain by shuffling a legacy resolver branch without a bounded decision/test.
5. Commit all resource, catalyst/charge, status and target mutations transactionally with campaign admission, exact duplicate/stale rejection and persisted result. Display accepted facts only. Do not promote selected UI until real ability is executable.

**Abilities, separately owned**
1. Verify an actual character-granted ability identity against authored `player/abilities.json`, exact activation requirements and context (not merely a combat family match).
2. Separate active attack, passive grant, reaction/interrupt, command/tactics and support abilities by **their own** use/trigger/target semantics. Do not make every ability button a standard enemy-damage command.
3. Audit target requirements, known/unlocked skill source, resource costs, execution/recovery and cooldown/reaction windows through the current combat owner before exposing selected controls.
4. Preserve the exact source `abilityId` and effects across future creator allocation/progression changes. Unsupported hooks and unmet skill/equipment prerequisites cannot become legal because a preview names them.

**AI and companions, separately owned**
1. Keep the existing weighted role/action/target scoring as real current AI, with available manual override and existing enemy turn behavior.
2. Verify action and target eligibility at the same quality bar as player commands; a high-scoring unsupported spell, missing item or defeated foe cannot bypass the selected owner.
3. Do not attach ordered `condition -> action` gambits until there is a separately accepted rule language, evaluation order, conflict/fallthrough, policy validation, migration and battle interpreter.
4. Do not activate full NPC allies before person/party/member ownership, equipment, current resources, injury/death/defeat consequences and restart persistence exist. The current nearby encounter's one-player ally is not a general party acceptance claim.

## Explicit unanswered owner questions

| ID | Question to decide in a future *bounded* owner pass | Correct owner/source to consult |
| --- | --- | --- |
| M1 | When must character known-spell and compatibility gates run: projection, staging, resolution, or multiple points? | Known-spell/magic resolver plus legacy spell-staging decision |
| M2 | How does `magic.cast` intent translate to `CombatActionState` without bypassing account/campaign controls? | Magic command/resolver and combat admission |
| M3 | How do target/area/range and change-of-target between queue and resolve interact? | Magic target owner and combat target validation |
| M4 | How are catalyst, conduit, charges, MP payment, cancel/refund and failure/backlash committed once? | Magic/items inventory/resource owners |
| M5 | Which catalog hooks are genuinely executable versus classifiers/deferred approximations? | Spell-hook support and specific effect owners |
| A1 | Is an ability active, passive, reaction, command or tactical preference, and which trigger is executable? | Ability content owner and combat action/grant validation |
| A2 | Which target/skill/prerequisite/cooldown checks prevent a merely present ability record from becoming selectable? | Ability activation/requirements plus combat legality |
| T1 | Are AI scoring candidates screened for current source legality, target availability and capability gating? | Combat AI owner, focused owner tests |
| T2 | How does temporary manual override safely revert to AI and survive battle/reload where intended? | Combat control profile owner |
| P1 | Which named companion has persistent combatant identity and post-battle resources/injuries/equipment? | Person/NPC/party/save owners, not combat role metadata |
| G1 | What stable ordered rule syntax, migration and deterministic trace would support full gambits? | Future tactics interpreter decision, not present presets |

## Candidate phased future acceptance matrix (not executed)

| Case | Scenario | Boundary proven only when owner tests and caller evidence exist |
| --- | --- | --- |
| M-A | Player has catalog spell but no accepted known-spell evidence | Cast remains blocked; catalog visibility not ownership |
| M-B | Explicit known spell with incompatible/deferred status | Consistent owner rejection without MP, charge or effect |
| M-C | Fully supported damage cast to valid enemy | Correct source, target, resource/ticks, effect, ledger/replay through real caller |
| M-D | Healing/support to ally/self | Exact friendly target and effect owner, not damage-only shortcut or foe ordinal |
| M-E | Multi-effect drain/utility spell | Ordered typed result or explicit blocked status; no accidentally healing enemy through heal-first branch |
| M-F | Interrupted/failed cast | Approved refund/backlash/catalyst and exactly-once result semantics |
| A-A | Active physical ability granted to player | Exact ability source, requirements, legal enemy target and resolved supported effect |
| A-B | Reaction/defense/control ability | Exact trigger, timing and target checks, not universal enemy-damage legal projection |
| A-C | Absent or unsupported ability | No false action or item/skill bypass |
| T-A | Enemy AI scores several supported actions | Chosen action and target are legal at execution; no duplicate queued action |
| T-B | Manual override and AI resumption | Bounded, attributable control-mode transition and no duplicate manual action |
| P-A | Future recruited allied NPC | Persistent correct person/party/battle identity and post-battle outcome; no synthetic friend from roster metadata |
| G-A | Future ordered gambit rule set | Separate deterministic rule interpreter and validation, without replacing existing weighted AI silently |

## Safe ordering and links

During combat-skeleton hardening, **do not** bundle a universal magic cast pipeline, potion support, all 32 abilities, full AI gambits or an allied-party system into one combat terminal/outcome repair. When the active terminal/durability support slice finishes, use fresh source to choose the smallest next combat source/caller gap (the existing combat capability audit ranks ranged followed by ability/AI legality). Magic and in-combat items require their more specialized owner decisions before effectful integration.

Controlling sources: [Combat Skeleton Capability Audit](combat-skeleton-capability-and-owner-contract-audit-2026-10-20.md), [Legacy Combat Spell Ownership Plan](legacy-combat-spell-runtime-ownership-plan.md), [Legacy Spell Runtime Source Map](legacy-combat-spell-runtime-source-map.md), [Magic Command Contract Plan](magic-command-contract-plan.md), [Magic Inert Resolver Envelope](magic-resolver-planned-output-envelope-plan.md), [Combat AI/Gambit Audit](combat-ai-and-gambit-current-state-audit.md), [Creator-to-Combat Compatibility](creator-to-combat-input-compatibility-prework-2026-10-20.md), [Item Activation Prework](combat-item-consumable-activation-prerequisites-prework-2026-10-20.md).

**Pass limit:** only a standalone Markdown prework file. No current Codex prompt, output/handoff, code, schema, tests, content, save, branch, acceptance decision, browser, Game version, deployment or Site operation was changed. Every proposed scenario is a future check, not current passing evidence.
