# Area / Atlas Text Scene, Editorial Cards, and Graceful Fallbacks

Date: 2026-10-28. Status: **documentation-only UI editorial preflight; not narrative-generation, grammar, event-store, player-prose, visual asset, runtime or implementation authority**.
Source: selected `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; design branch PR #45; latest separately inspected unselected native v3 PR #44 `022fe22def299cf9fc357058a0214e83875af24b`.
Bound to: `ui-information-architecture-boundary.md` (text-first layout/accessibility), `narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md` (authoritative narrative pipeline), `local-scene-context-projection-decision.md` (observability), `combat-text-first-feedback-and-observability-prework-2026-10-20.md`, and the three earlier Area/Atlas preflights plus action-priority pass.

## 1. Design choice: immediate text, not omniscient world fiction

**Candidate reading order:** current accepted place and urgency → a compact factual local summary → one selected concrete subject → owner-legal action with honest cost/consequence → source-grounded result. Art can accompany the place, but must not be the source of a target or inferred secret.

Current selected `WorldPanel.tsx` does not have a live local scene narrative owner. It renders `world.locations` pins and record descriptions, a Nearby Exploration block, combat command block, Travel Actions and detail-stack cards. `uiViewModel.ts` maps existing `KnownLocationState.name/note/regionLabel` and `PanelRecordState.summary/detailEntries`. These are display/reference values; they are not evidence of observed in-world people, sound, weather, resources or an entrance.

The **accepted narrative realization decision** requires certified evidence, observer-safe projection, scene planning, deterministic realization, validation and fallback. An Area text surface must **consume** its results when such an owner exists. It must not instantiate an alternate ad-hoc LLM narrator, turn player-edited prose into canon, infer personal pronouns or invent event chronology. Before that narrative owner is implemented, a minimal set of deterministic **fact labels and owner message text** is acceptable; do not call that a rich certified narrative.

## 2. Proposed scene card information contract

This table is an *editorial template*, **not** a persisted object, schema, universal content grammar or a mandatory widget list.

| Reading unit | Purpose / content | Source class | Missing-data fallback |
| --- | --- | --- | --- |
| Current place | Verified settlement/region label; site only as an actual accepted label | `playerState.location`, `getCurrentPlayerTravelLocationLabel`, geographic Knowledge | “Current location” / “Location details unavailable”; no guessed site |
| Time and state | Owner current tick/watch, active encounter or admitted work status | `snapshot.clock`, combat/activity/Save owners | Hide unavailable time detail; do not display invented countdown |
| Situation sentence | One or two grounded clauses summarizing accepted state | Approved owner/projection and optional future narrative renderer | Neutral “You are at [verified location]” or “An encounter is active” |
| Current urgency | Active encounter/owner lifecycle and safe next action | `gameState.activeEncounter` or selected lifecycle | No emergency claim from a red color or generic low stat alone |
| Observable subject | Actual known destination, retained candidate, encounter target or current activity record | Exact typed source identity and observability | “No additional nearby targets established”; hide phantom NPCs |
| Relevant actions | Owner-legal direct actions and owner-approved blocked explanation | Accepted contextual descriptor + current plan/caller | Link to World/Activity/Quests; no disabled catalog verbs |
| Outlook | Exact/estimated/unknown time/cost/risk with provenance | Owner preview: Explore, travel, rest, survey, combat | “Outlook unavailable”; no numerical guess |
| Resolution | Accepted/rejected/duplicate action result with durable source where supported | Owner outcome / admitted snapshot and account receipts | “Outcome details unavailable”; never a made-up hit/reward |
| Wider context | Disclosed nearby-known vs regional-known references | Geography/Knowledge/World records | “View known places in Atlas”; do not show hidden location pins |
| Deep reference | Codex Atlas, quest card, current activity or item inspector | Owning domain record, not UI text key | Hide deep-link if destination cannot resolve |

Suggested emphasis: place and current operation above the fold; a constrained prose width (existing IA target about **55–75 characters per line** where space allows); compact metadata and restrained visual accents; information density should not overwhelm the decision. Do not bury legal action behind an image or a multi-level menu.

## 3. Three epistemic categories and safe language

### A. Accepted first-person / current-state facts

Only when an owner supports them: “Current location: Saltmere”; “Nearby exploration is available”; “A nearby encounter candidate was found”; “An encounter is active”; “Travel to Westreach completed.” These are **illustrative sample copy**, valid only if the exact source state and identity actually match. The UI must not turn “nearby encounter candidate” into “a wolf stands before you” without an observed combatant/person owner.

### B. Known geography and source-qualified background

“Known region: [name]”, “A recorded trade route concerns this settlement”, “Your Atlas records [disclosed location]”. A source record may describe a site or ecological tendency, but not assert it is happening now. `sessionState.worldRecords` and regional ecology support informational context only, not a visible live market, available ferry or harvestable target.

### C. Unsupported implication to omit

“Merchants bustle nearby,” “the river is fordable here,” “the forge is free to use,” “the guild clerk recognizes you,” “the hidden road is just ahead,” “this attack dealt damage,” “you inherited this heirloom,” “the weather is growing worse” unless the specific owner-certified present/observed/temporal evidence exists. Decorative art, broad habitat tags, surname, iconography and word choice cannot certify these claims.

**Voice discipline:** direct player-readable text, brief and specific, without auto-invented dialogue, feelings, motives, identities, pronouns, relationships, sensory details or historical causation. A later accepted narrative renderer may produce more evocative prose **within** its evidence/viewpoint/validation boundaries; this document does not redesign that renderer.

## 4. Distinct editorial treatments by gameplay state

| Real state | Surface composition | Example truthful text family | Do not say |
| --- | --- | --- | --- |
| Ordinary admitted place | Place and condition → one observed context → legal Explore/Rest where real | “You are at [owner place]. The current route can be explored.” | “The forest is full of game” |
| Explore denied | Place → public owner blocker | “Nearby exploration is unavailable: [safe owner reason].” | “You need a secret map” |
| Explored, no candidate | Owner accepted result → updated condition/time | “Nearby exploration concluded. No encounter was found.” | “The area is safe” |
| Candidate pending | One supported warning/approach row | “Signs of danger were found. No encounter has begun.” | “Foe 1 attacks” |
| Combat active | Text-first combatant/phase → exact legal actions and targets → supported outcome | “Encounter active. Combat beat [owner tick].” | “Your sword hit” on a mere queued step |
| Combat queued/progressing | Current action phase, not a terminal victory message | “Command accepted; resolution remains pending.” where source supports queued state | “Target defeated” from caller acceptance |
| Current activity/survey | Actual stage and owner link; progress only from accepted stage/operation | “Current activity: [source label]” | “Shift complete in 10 seconds” |
| Known remote travel target | Known destination / owner origin + travel preview | “Travel outlook for [disclosed location]: [owner result].” | “It is just north of here” from map `x/y` |
| Unsupported station, actor or stock | Read-only regional/service reference when public | “Service information is recorded; a local provider is not established.” | “Buy now” or “Talk to clerk” |
| Pending recovery / invalid format | Selected lifecycle owner result, safe load/recovery link | “Campaign recovery requires attention.” only if owner supplies this state | Ordinary action menu based on incompatible or unselected Save |
| No reliable scene source | Useful safe fallback, no empty fiction | “Local actions are unavailable; inspect known destinations or your activity.” | Randomized generic encounter prose |

**Sample copy is conditional, not content-authoritative.** Do not ship placeholders as a literal narrative script without the owner and source checks. Distinguish a source label (“Known in Atlas”) from a claimed observation (“Seen here”).

## 5. Future editorial visual accents without semantic substitution

The presentation can use **one** relevant illustration, heraldic image, minimap fragment or character portrait when its existing asset/reference source and spoiler posture are validated. The illustration is not a click-to-interact scene. Current `WorldPanel` map decorations and coordinates are presentation; they must not set actual travel geometry, target presence, NPC identities, weather or locale.

- **Landscape:** preserve current top band + vertical left domain rail and allow a readable main narrative area with a collapsible target/details inspector. Do not force three sidebars at narrow widths.
- **Portrait:** preserve current horizontal domain control behavior while using a single-column reading order, explicit Area/Atlas tabs and a map-independent destination list. Imagery is optional and must not displace the primary action.
- **Accessibility:** alt text reports what the illustration represents, not secret game facts; action labels name verb and real target, status also uses words not only color, focus returns to known target or safe heading after context invalidation, reduced-motion respects static results.
- **Scalability:** longer text can scroll within content without burying the current actionable choice; provide concise/expanded owner facts but no auto-generated hidden information. Screen readers should not announce a regenerated paragraph after every owner-neutral clock redraw.

No new font, palette, illustration assets, icon component, responsive CSS, image-generation task or source-file modification is authorized by this document.

## 6. Example text card flows (conditional templates, not runtime fixtures)

```text
AREA • [verified place]
[Player-facing state, only if admitted]
[Short fact-based situation]

Current opportunity: [owner-backed observed target or Explore]
Cost / time: [only current plan]        Outcome: [pending, accepted, or blocked]
[One concrete action]                   [Open Atlas / Activity]

AFTER OWNER ACCEPTANCE
Result: [owner message appropriate to the actual accepted stage]
Now: [current admitted snapshot place, resources, encounter, current activity]
[Recomputed next available action, not a predicted story]
```

```text
ATLAS • KNOWN PLACES
Current origin: [recognized source identity or “unavailable”]
[Disclosed known location list; hidden IDs, names, exact coordinates omitted]
Selected destination: [user-selected, disclosed exact ID]
Travel outlook: [current owner plan, or blocked reason]
[Travel with optional risk confirmation]    [Return to Area]
Codex / Atlas: geographic Knowledge reference only
```

```text
AREA • ACTIVE ENCOUNTER
Encounter beat [owner tick]
[Owner-visible roster and action phase; no estimated enemy HP without policy]
[Legal commands, source labels, target IDs resolved into public names]
[Accepted command / queued / actual resolution distinguished]
[Return to current situation only when owner ends the encounter]
```

## 7. Future source evidence required for authored atmospheric detail

A real descriptive local scene beyond generic factual labels needs: (1) an actual locality/scene identity or sufficient owner-provided context; (2) source-observable actors/features and knowledge filtering; (3) time/weather evidence with relevant event-time binding where claims are temporal; (4) narrative grammar/referent permissions where people are named; (5) owner-approved deterministic fallback for insufficient/conflicting evidence. A richer market, guild, workshop, wilderness or ship scene requires its own current instance and observation authority first.

The accepted narrative-realization charter may eventually be a separate implementation consumer. It **must not be made a prerequisite** for a read-only, fact-label Area first slice when that slice makes no narrative realization claims; inversely, the Area team must not preempt it by writing a free-form story generator.

## 8. Prospective editorial truth tests (not executed)

| Case | Setup | Expected |
| --- | --- | --- |
| AE-01 | Valid settlement + legal explore | Scene labels actual place and owner Explore; no invented terrain |
| AE-02 | Missing place mapping | General location fallback, not guessed map coordinate |
| AE-03 | `known:false` location with secret note/name | No secret in prose, detail or alt text |
| AE-04 | Known location far away | Described as known, never “nearby” |
| AE-05 | Habitat tag forest but no observed tree instance | No “Chop Tree” or direct sighting claim |
| AE-06 | Market record without merchant stock/provider | Informational only; no fabricated offer |
| AE-07 | Quest journal says report but no observed clerk | Quest link, no local “Talk” action |
| AE-08 | Explore no candidate | “No encounter found” is not “safe forever” |
| AE-09 | Candidate pending | Signs/approach, no active foe dialogue |
| AE-10 | Accepted combat queue, no hit resolved | No damage/hit/defeat prose |
| AE-11 | Combat effect actually evidenced | Render only observer-permitted result |
| AE-12 | Owner travel denial | Source-approved denial, no fake shortcut route |
| AE-13 | Source head changes during narrative inspection | Recompute/discard stale paragraph |
| AE-14 | Incompatible or mixed Save | Safe load/recovery guidance, no guessed scene |
| AE-15 | Null/empty current activity | No invented shift progress or countdown |
| AE-16 | User switches Area ↔ Atlas repeatedly | No prose becomes event, tick, knowledge or history |
| AE-17 | Artwork includes unobserved NPC or hidden landmark | Art cannot create target/hint identity |
| AE-18 | Distinct character identity, incomplete pronoun profile | Avoid pronoun/demographic inference |
| AE-19 | Text enlarged/reduced motion/keyboard | Readable text and actionable controls without art |
| AE-20 | Later narrative renderer validation fails | Deterministic accepted factual fallback, no hallucinated scene |

## 9. Disposition

Single independent Markdown addition on `connector/area-atlas-gameplay-surface-preflight-2026-10-28`, held draft PR #45. No gameplay tests, renderer execution, model evaluation, image generation, schema, current Codex prompt/handoff/register, runtime, Save, Game version or Site changes. Future owner: selected World Area UI for factual presentation; a **separate** accepted narrative realization owner for richer language. This pass closes the *editorial fallback planning* question and does not select the Home default or Area implementation.

Sources inspected on master: `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`, `docs/design/ui-information-architecture-boundary.md`, `docs/design/local-scene-context-projection-decision.md`, `docs/design/contextual-interaction-endpoints-and-contract-station-routing-decision.md`, `apps/rpg-ui/src/features/WorldPanel.tsx` and `runtime/uiViewModel.ts`.
