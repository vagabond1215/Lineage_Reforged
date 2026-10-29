# Leyline Surface Nodes, Confluence Rarity and Religious Continuity

Date: 2026-10-29. Status: **user-directed provisional design, docs only; not canon site content or executable world/leyline authority**. Source base: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`. Independent held draft religion PR #46; `HOLD_NAMED_CONSUMER`. This document **supersedes the physical-confluence eligibility explanation** of earlier PR #46 catalogue and planning texts where different; it does not supersede accepted elemental identity/manifestation rules.

## 1. What is a confluence?

**Leyline surface point**: a geographically bounded place where a particular intrinsic elemental-magic leyline approaches the physical surface (including accessible undersea/subsurface sites). **Single-element node**: a valid surface point involving one canonical element; it is not required to involve other elements.

**Physical confluence**: a specific bounded geographical location where **two or more *different* elemental leylines converge near the surface**. Climate, heat, water and geology offer search cues, *not proof*. An undersea volcano, geothermal vent or hot spring may be a Fire/Water confluence if the relevant magical lines really converge there; another otherwise identical hot spring may be entirely ordinary. The ocean as a whole is not such a point; volcanic regions as a whole are not automatically Fire points. A Fire-only volcanic surface node is not Fire/Water merely because a neighboring ocean exists.

**Unexpected locations** can also contain a source-supported near-surface node/confluence and cause unusual, locally bounded weather or environmental phenomena; not every point must be conventionally associated with its element. An "unaffiliated" or "unrepresented" phenomenon need not have an associated religious order, common discovery label or conventional landform; it does **not** create a ninth element or an effect without a world/magic/environment owner.

Intrinsic elements remain Fire, Water, Earth, Wind, Thunder, Ice, Light and Darkness; Stone is an applied religious term for Earth. Real leyline topology and environmental manifestations do not prove gods, miracles, deity identities, orders, temples, magical rewards or character knowledge. A near-surface point is a world/geographic/magic fact; religious interpretation is a separate observer/social fact.

## 2. Relative rarity selected by the user

| Distinct constituent elements at a site | Selected relative prevalence | Critical caveat |
| --- | --- | --- |
| 1 | Single-element point; no numeric prevalence decided | Not a multi-element confluence |
| 2 | Common **among confluences** | Common does not mean every adjacent landscape |
| 3 | Common **among confluences** | Independent supported lines at same bounded point |
| 4 | Uncommon | Regional exception |
| 5 or 6 | Rare | Strong source evidence and unusual site |
| 7 | Almost unheard of | Extraordinary and not expected in every world |
| 8 | Perfectly harmonic/prismatic confluence is even rarer | Optional, exceptional global-scale plot potential |

Even two/three-element sites including **Light** or **Darkness** must preserve accepted higher-element rarity; the general count-based tier does not erase intrinsic eligibility constraints. Exact density, floor/ceiling and probabilities are **not** decided.

A real perfect eight-element harmony may support a significant optional discovery/questline/reward where a future quest/effect owner explicitly authorizes it. It does **not** guarantee a universal quest, actual miracle, automatic resurrection, confirmed deities, magic buffs or a Prismatic Enclave in every seed.

## 3. Confluence movement, religious survival and seeded orders

Leyline exposure/confluence may shift, disappear, weaken, become inaccessible or end historically, subject to a future source-owned world transition. **That does not remove elemental magic from the world.** Religion is a human/elf/beastfolk institution; its strength after losing a founding site depends on mission, community, alternative practices, recruitment method, resources, adaptability and historical reputation. An order with strong schools, care, craft, service or political causes might thrive without its original node; a cult sustained solely by veneration of that node could collapse. Decline is a seed/history-specific possibility, **not an automatic effect**.

The user accepts prior recommendations:
- Seed-select an **order count between a future minimum and maximum**, considering world/continental demographics and culture. Numerical limits **still unselected**.
- Count active, hidden, dormant, extinct and purely historical orders in distinguishable buckets, not as one undifferentiated cap.
- The **six currently named mixed orders are optional selections in the bank**, not guaranteed in any playthrough.
- Every seeded world preserves **some genuine history/folklore of all eight original single-element traditions**, even where their precise names, institutional status, detail and era vary.
- Name bank selection uses region, actual cultural tradition, language and ancestry where appropriate; shared intermingled cultures may share conventions.
- World-creator preview shows only public known conditions including meaningful regional/continental elemental-order dominion, not secret generation data.

## 4. Explicit correction of candidate catalogues

The existing PR document `elemental-confluence-candidate-catalogue-seed-order-and-cultural-names-2026-10-29.md` lists **28 pair candidates**, **16 illustrative triples**, and tentative naming vocabulary. Those descriptions are **prospecting environments**, not physical confluences without a validated near-surface intersection of matching distinct magical leylines.

Examples: storm does not itself prove distinct Wind/Thunder lines; freezing water does not prove a Water/Ice convergence; volcanic ice melt does not prove Fire/Water/Ice without three distinct magical line sources. A temple called "Convergence Site" is not sufficient proof. `world.sacred_sites` currently has an active Glasswake Shrine, not a confirmed leyline node; `world.religions` contains authored Pantheon organization descriptions, not actual generated seed institutions.

**Artificial confluence generation is *not decided*.** This latest user message defines naturally encountered near-surface intersections and allows movement/vanishing, but does not authorize mortal spellcasters to create, move or redirect leylines.

## 5. Future source requirements, without inventing a schema

A planned leyline/confluence world owner should eventually represent: canonical elements, distinct line identity, actual location and bounded physical extent, near-surface eligibility, era/validity, persistence or movement, observed physical manifestations, locality and climate provenance, age/historical evidence, and known-vs-secret observer scopes. A related religion/seed owner may use *verified* site and history inputs to select institutions, mission/recruitment dependence, public reputation, names and inter-order rivalries. It cannot manufacture line intersections from flavor names or claim supernatural healing.

Suggested candidate checks (not executed):
- LY-01 an ocean and ordinary volcanic heat without magical lines is not a confluence.
- LY-02 an undersea vent with distinct certified Fire and Water lines can qualify.
- LY-03 one Fire line near a volcano is a single-element point.
- LY-04 odd local weather from a rare line exposure need not imply a religion or new element.
- LY-05 two/three sites usually outnumber four-plus sites, with Light/Darkness separate rarity gates.
- LY-06 an eight-way harmonic site remains optional and exceptionally rare.
- LY-07 vanishing of a site does not erase the order or the intrinsic elements.
- LY-08 same-world order counts can change by seed while all eight original single-element traditions have historical evidence.
- LY-09 current six named organizations need not be present in each generated world.
- LY-10 player UI does not expose unknown historical hidden sites and orders as verified facts.

## 6. Unanswered questions, deliberately unselected

1. May leylines shift/decay over time, and by how much in 10, 100 or 1000 years?
2. How much physical geography and leyline topology may vary per seed rather than selecting from preauthored legal map sites?
3. How does a future source verify a magically present leyline beyond surface appearance?
4. Can magical practice deliberately create or redirect leylines?
5. Can two same-element lines meet at a strengthened **single-element** node without counting as a multielement confluence?
6. Does "perfect harmonic" require balance/stability beyond all eight merely meeting?
7. How do global historical single-element traditions fit counting when no active temple survives?

**Hold:** one new Markdown design addendum only. No changes to master, live data, gameplay, UI, code, Save, Codex native v3, Area/Atlas, tools/stations, tests or version. Named future consumer: Elemental/Leyline Geography and Religion/World Generator design.
