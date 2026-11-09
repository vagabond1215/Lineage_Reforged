# Core World Entry Scenario Contract And Editorial Seed — Proposed, Not Runtime Canon

Date: 2026-11-09  
Source: `6ca4a97f8751416435a99e105203e4b9405d6da1`  
Status: **CORE_SCENARIO_EDITORIAL_SEED_DRAFTED; SITE_AUTHORITY_AND_OWNER_ACTIONS_PENDING; CONTENT_ACTIVATION_HELD**  
Execution: GitHub Connector, documentation-only. No implementation, canon seed, schema registration, Save, run/Prestige award, active Codex prompt, PR or Site change.

Companion documents: [Owner product direction](core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md) and [environment/source and action gap review](core-world-entry-environmental-feasibility-and-authoring-gap-review-2026-11-09.md). These documents govern this seed. The current native-v3 → master integration remains the active Codex priority.

## 1. Narrative catalog contract

**The catalog selects among complete authored situations, not one script per map tile or a generator of disjoint sentence fragments.** A reusable scenario is an individual coherent story, with whole authored paragraph/scene continuations as variants. The same locality may offer multiple genuinely distinct openings. A story may apply broadly to many climates and geographies when its **positive** requirements are met; geography is a compatibility gate, not a hard one-story label.

Candidate structure for a future authoring/runtime decision (not an accepted schema):

| Field/concept | Purpose and invariant |
| --- | --- |
| `id`, `familyId`, editorial version | Identity of one independently authored situation and its family; stable reader meaning |
| `entryPool` | `ordinary_core` or `hardcore_wilderness_core` (conceptual names only) |
| `requireAll`, `requireAny`, `excludeAny` | Typed conjunction/disjunction/conflict constraints, evaluated on owner-certified facts |
| `optionalVariants` | Select preauthored **complete** prose passages for verified season/terrain/character facts; unknown weather selects neutral prose |
| `premiseFacts` | Actual prior event established by selection: benefactor paid, shelter offered, wagon broken, vessel wrecked; never rewritten by cosmetic variation |
| `participant/site/item references` | Prove any present NPC, interior, route, gift/salvage, ownership and access; do not infer from broad biome |
| `actionBeats` | Inspect; acquire legitimate goods; equip; use/eat; leave/navigate, each mapped to verified command and feedback |
| `continuation` | Authored reaction to a **successfully admitted** action, with separate blocked or alternative text where needed |
| `reward/receipt policy` | Durable exactly-once tutorial completion; eventual eligible end-of-run Surprise Me source marker, without UI grants |

Missing fact is `unknown`, **not** silently false for exclusion or true for requirement. A scenario depending on actual weather, coast, boat, interior, NPC, trade or site cannot be selected because its noun appears in regional prose. No generic mandatory exact gear package is implied until inventory owners and selected bundles agree. If current account/prestige eligibility blocks the Core tutorial, narrative and reward policy must be decided explicitly, not guessed.

For `Surprise Me`, author and test one **candidate set** from validated same-pool entries. Record the choice and scenario before disclosure; do not allow preview/back/corruption/restart to reroll a beneficial result. Weight choices for narrative variety, not extra payout.

## 2. Initial eight-scenario working catalog

These are editorial targets, not approved in-game content identities or NPC names.

| Working identity | Pool | Required evidence categories | Distinct story |
| --- | --- | --- | --- |
| `core.room_paid` | Ordinary | Real inhabited lodging and temporary gift site | Inn room paid by an unknown helper |
| `core.last_bed` | Ordinary | Real charity shelter/clinic with lawful caretaker | Discharge from a communal bed |
| `core.journeys_end` | Ordinary | Authorized overland settlement arrival and compatible history | Disembark from a cart, deliberately starting anew |
| `core.roadside_kindness` | Ordinary | Valid inhabited travel approach and aid source | Kind stranger offers limited help |
| `core.broken_wagon` | Wilderness | Actual isolated overland wreck scene and viable route | Wake beside an abandoned, damaged wagon |
| `core.washed_ashore` | Wilderness | Valid sea/lake/river shoreline and believable craft approach | Recover from a wreck or boat accident |
| `core.abandoned_camp` | Wilderness | Actual isolated camp, lawfully usable goods and travel context | Discover an empty camp and choose priorities |
| `core.lost_trail` | Wilderness | Actual remote route/terrain and compatible origin facts | Reorient after separation from familiar path |

For a first handoff, **fully draft four** as literary/editorial samples below. Each is one **complete scene** followed by proposed action continuations. Variation paragraphs are **complete authored alternatives** to a specific base paragraph, never independently displayed fragment strings. If a required named person/site/item cannot be instantiated with its exact owner, the candidate remains unpublished.

## 3. Proposed full scene: The Room Paid For (ordinary)

**Compatibility hypothesis:** any suitable inhabited location with actual overnight lodging, a legitimate gift left by a supporter and an innkeeper/caretaker licensed to enter the scene. No forced memory loss, named employer or claim that the character was born locally. A `Local` backstory only works where "unknown stranger" and displacement do not contradict known local relationships. An actual current profession must not be invented.

**Opening, temperate/neutral edition**

> You wake beneath a blanket that isn't yours. The room has no familiar smell or shape to it: a narrow bed, a small table beneath a shuttered window, and a chair whose back has been repaired more than once. Beyond the walls, morning has begun without consulting you. Someone is carrying water downstairs. A door closes; footsteps cross the landing.
>
> Your clothes are folded on the chair, though you don't remember folding them. A small cloth parcel lies on the table, bound with a length of plain cord. Its knot has been pulled tight by careful, practiced hands.
>
> The latch turns before you have decided whether to call out. A keeper fills the doorway, keys hanging from one wrist. Their gaze runs briefly over the room and settles on the parcel.
>
> "You're awake. Good. Whoever brought you in paid for the night and asked that you have what's there. The room isn't paid for another." The keeper shifts aside to clear the door. "Take your time enough to get dressed. Not so much that the next traveler finds you still in my bed."
>
> The footsteps recede. On the table, the small knot waits. Whatever brought you here, the day beyond this room is now yours to answer for.

**Complete alternate second paragraph, cold-weather edition (use instead of the second paragraph above, not appended):**

> Your clothes have been spread near the hearth, where the last embers glow a dull red. Beneath them waits a patched outer wrap, heavier than anything else you possess. A tightly bound parcel rests on the table. Whoever tied it remembered the cold outside; whether they remembered your name is another question.

**Complete alternate second paragraph, dry/hot edition:**

> Your clothes hang loosely from the back of the chair, washed and already dry. Beside a covered clay jug rests a cloth parcel held by a simple cord. A strip of sunlight lies across the floor, hot enough to make you grateful for the shaded room. Whoever arranged these things has already left.

**Action-driven continuation candidates, only after real commands:**

- On **Inspect Parcel**, present a cohesive authored paragraph identifying only the actual gift contents and ownership/evidence. Example permitted voice: "The wrapping loosens. Inside is the modest sort of kindness given by someone who cannot afford extravagance. You turn each object over in your hands, trying to decide which will serve you first." Item-specific labels/numbers follow the owner-produced manifest, not assumed prose.
- On **Acquire**, actual items move from a scene-owned gift endpoint to inventory exactly once; narrative acknowledges the emptied parcel without multiplying gear.
- On **Equip** and **Eat**, actual item owner/body effects happen before the story observes the difference. If the intended ration was not included, offer a truthful alternate next step.
- On **Leave**, transition only to a real accessible starting place and current-situation projection, with a small grounded concluding passage rather than "Tutorial complete" replacing the story.

## 4. Proposed full scene: Shelter's Last Bed (ordinary)

**Compatibility hypothesis:** a real communal shelter, charitable clinic or similar safe overnight place; lawful caretaker and available donated goods. Can be used across many climates, with actual local institution/culture deciding vocabulary and dialogue. Do not state a medical injury or diagnosis unless present in the character's owner facts.

**Opening, neutral edition**

> Somewhere nearby, a kettle begins to sing. You open your eyes to a ceiling of dark beams and a roof patched in two different kinds of tile. Beds line the wall on either side of yours. Most are empty, their blankets drawn back for the morning. One traveler sits at the far end of the room, quietly working at a loose bootlace.
>
> You have been warm and dry for a night, and that is more than you can presently claim about the rest of your life. Near the foot of the bed someone has set a small bundle of secondhand things. There is no flourish to the gesture. The cloth has been washed, the knots tied, and the rest left to you.
>
> A caretaker approaches with an armful of folded bedding. "We let people sleep," they say, not unkindly, "but the roof doesn't grow wider when more people arrive. There'll be work about if you know where to ask. First, take what you've been given. The next one through that door may have less than you."
>
> They pause to make sure you understand, then move on to another bed. The kettle whistles again. Around you the shelter resumes its ordinary business, leaving you room to decide how to begin yours.

**Complete alternate opening paragraph for a cold/highland shelter:**

> Warm air from a banked stove meets your face before you open your eyes. Beyond the shuttered window the light is pale and hard, and each person rising from the neighboring beds reaches first for a coat. The roof above has been mended in different seasons with whatever wood could be spared. Someone is coaxing a kettle over the embers.

**Complete alternate opening paragraph for a wet/riverside shelter:**

> Rain has found a steady rhythm on the roof. When you open your eyes, damp boots stand in a crooked row beside the door, and the shared room smells of wool, soap and last night's cooking. Most of the beds are already empty. Someone near the far wall is trying, without much success, to dry a sleeve by the window.

**Action continuation:** A character may inspect their bundle or surroundings, collect the donated goods, dress and eat if a ration is actually provided, and leave the shelter by a legal scene endpoint. The caretaker can point to *one owner-verified* next opportunity, never invent a guild clerk, job vacancy or workshop. The scene must not fabricate a medical recovery or improvement merely because its setting resembles a clinic.

## 5. Proposed full scene: The Broken Wagon (Hardcore wilderness)

**Compatibility hypothesis:** an actual isolated overland arrival/wreck on a traversable road or trail, with enough authored physical context and a viable, discoverable survival route. Applicable to steppe, grassland, scrub, forest margins or highland where validated. The character's origin must support having ridden with a caravan/cart; no automatically imposed slave origin, attack, betrayal or crime.

**Opening, neutral edition**

> Wind moves through the grass with a sound almost like water. At first it is easier to listen than to open your eyes. Your shoulder rests against rough wood, and when you finally sit upright a broken wheel fills your view. One spoke points upward at an angle no wheel was ever meant to hold.
>
> The wagon has settled hard into the earth. A length of canvas hangs from its frame, and something beneath the axle shifts whenever the wind catches it. The draft animals are gone. There are no voices, no cooking smoke, no sound of harness or campfire from the people who were here before. Whatever happened on the road, its last witnesses have left.
>
> A pair of ruts leads away between the low hills. They are old enough to have gathered dust, fresh enough that you can follow them with your eyes. Beyond the rise, the land falls out of sight. You cannot tell from here whether it hides a road, water or nothing at all.
>
> The sun is moving. You have the wreck, the things you can actually find in it, and whatever judgment you can summon before the light changes. The road offers no explanation, but it does offer a direction.

**Complete alternate first paragraph for alpine/cold context:**

> The wind carries grit of snow between the stones. You come to yourself with your back against a wagon panel, numb along one side. The wheel beside you has lost its iron rim, and the track curves away into a mountain pass. The clouds are low enough to conceal the far ridges. Whatever road brought you up here has begun to disappear beneath fresh powder.

**Complete alternate first paragraph for dry/steppe context:**

> Dry grass whispers against the wagon's underside. Your first breath tastes of dust. A wheel lies on its side a few steps away, its hub split like old firewood, and the road runs in two pale ruts toward distant low hills. There is no shade except what the broken cart can give you.

**Action continuation:** Inspect the wagon, route and available landmarks. Search only concrete owner-presented cargo; a torn pack, canteen, food or tool is **optional authored stock**, not a guaranteed environmental spawn. Equip legitimate salvage, use a confirmed provision if present, and follow a verified overland exit. The wilderness cannot instantly become a populated settlement through generic location text. If exposure/health/encounter threats are supported, give causal warnings and fair counterplay. This cannot ship as Hardcore until permanent-death Stakes and continuation Save guarantees exist.

## 6. Proposed full scene: Washed Ashore (Hardcore wilderness)

**Compatibility hypothesis:** a real shoreline and plausible waterborne approach for the selected world and Core identity. This could be sea, lake or suitably substantial river, **but only** where the scenario's exact craft and wreck type are geographically sensible. No landlocked generic beach, no invented vessel, and no claim that an encounter caused the wreck without an owned event.

**Opening, shore-neutral edition**

> The first thing you recognize is the taste of water. It clings to your lips and the back of your throat as you turn your face away from the wet stones. The next wave reaches only your boots. You have been lying above the line of its last retreat, close enough to hear each small stone shift as the water draws back.
>
> For a while you remain still, listening. Something wooden taps against the shore at uneven intervals. Farther along the bank, a length of rope has caught between two rocks. The broken craft lies out of sight beyond a bend, but scraps of its passage have found you here. You remember enough of the journey to know it has ended badly; you cannot yet account for anyone else.
>
> Inland, the ground rises toward a line of darker vegetation. From here there is no sign of a house, a watchfire or anyone who might answer a call. The water can tell you how you arrived. It offers little guidance about where to go.
>
> You push yourself upright and study what the shore has left within reach. The day is already passing, and the next wave will not wait for you to make up your mind.

**Complete alternate opening paragraph for a cold rocky shore:**

> Cold water stings your mouth when you open it to breathe. You turn onto a shelf of pebbles, each one hard against your ribs, and watch pale foam draw back from your boots. Beyond the stones the water is steel-colored beneath a low sky. You cannot stay wet for long in air like this.

**Complete alternate opening paragraph for a hot lake shore:**

> Warm water has dried in patches along your face, leaving a faint mineral taste. You lie on sand mixed with smooth white stones, and the heat of the morning is already rising from the ground. The lake is wide enough that the far shore lies in haze. Close by, a shallow wash of water reaches your heels and slips away.

**Action continuation:** Confirm observable wreckage and lawful salvage before offering Search/Acquire; do not offer potable lake or seawater just because `freshwaterType` is present. The player can inspect terrain, choose a valid direction, collect only actual goods, mitigate exposure through legal clothes/shelter actions, and pursue a verified route to society. Climate prose must rely on appropriate authoring context and current weather only where current weather is authoritative. A small craft river accident needs its own premise/variants, not the lake/sea paragraph with nouns swapped.

## 7. Quality, applicability and owner acceptance matrix

| Focus | Authoring/implementation proof needed |
| --- | --- |
| Narrative completeness | Connected literary opening plus meaningful owner-result continuation; human editorial review; avoid sentence-fragment templates |
| Cross-region flexibility | Each scenario's predicates actually pass for **several valid contexts** where appropriate; one context may yield multiple choices |
| Geography discipline | Shipwreck predicate rejects inland starts; river versus sea craft distinguished; absence of exact site fails closed |
| Character truth | Creator backstory/lineage, real starter gear and `jobId:null` obeyed; no arbitrary sex, appearance, social links, memory status, kidnapping or profession |
| Item provenance | Gifts, donation, wreck salvage, consumption and equipment operate through real item owners, exact counts and no duplicate claims |
| Hardcore legality | Real wilderness identity and traversable exit, fair survival pressure, no reload-resurrect after authoritative actual death |
| Random choice and reward | Same eligible pool for choice/random; committed scenario; no reroll; payout only after separate earned eligibility; candidate 1%/100 cap **not** production tuning |
| Persistence | Restart preserves scenario, step receipt, current goods, location and completed narrative facts without reissuing grants |
| Test scope | Focused predicate/source/action/save tests only; no cosmetic full-client suite or historical old-save compatibility exercise in pre-alpha |

## 8. Next safe handoff and deferred work

This editorial seed is now enough to support a later **one-location Core intro selection package** once the integrated v3 Save baseline is tested. The subsequent [exact geography candidate inventory](core-world-entry-exact-geography-anchor-candidate-inventory-2026-11-09.md) **has now verified** named settlement→hex→reference climate links and static site categories by full-blob retrieval. However, actual inn/shelter/wreck/wilderness starting-site instances and 2–3 truly executable selected commands remain unavailable or unproven; verify those only against an accepted integrated native-v3 gameplay source. Do not falsely treat current master v2 state as the eventual integrated app.

**Do not implement or install a new Codex prompt from this draft.** Future Prestige-origin narrative tiers, spouse play, living-world estate finance and full heir succession remain outside the Core narrative authoring package. Preserve native-v3 work, standalone development Save-format classification and protected PR/Site lifecycle.
