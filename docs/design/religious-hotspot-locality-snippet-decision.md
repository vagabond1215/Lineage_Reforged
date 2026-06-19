# Religious Hotspot Locality Snippet Decision

Version: `0.5.183`
Status: completed documentation-only decision authority
Date: 2026-06-19

## 1. Decision

Keep `religious_hotspot.lantern_shrine_gardens` `planned` and unreferenced by live Knowledge snippets.

Do not activate the locality hotspot, add `dominantFaithIds`, or author a second hotspot snippet. The existing Tier 1 identification snippet for `religious_hotspot.glasswake_shrine_lantern_gardens` is sufficient for current live religious-hotspot Knowledge coverage.

This decision changes no live content, schema, validator, source, test, policy, runtime, UI, storage, or gameplay behavior.

## 2. Current Live Boundary

- `religious_hotspot.glasswake_shrine_lantern_gardens` is the active settlement-scale authority and has the only live hotspot snippet.
- `religious_hotspot.lantern_shrine_gardens` is a planned locality-scale record without `dominantFaithIds`.
- Religion supports direct `religious_hotspot` subjects and references `world.religious_hotspots`.
- Religion trial, completion, and visibility policy references remain null.
- Knowledge snippet validation permits only active hotspot subjects.
- No `knowledge_domain.religious_hotspots` record exists.

## 3. Distinct-Value Assessment

A second locality-scale snippet does not currently provide proven distinct value. Both records draw on the same Lantern Shrine Gardens place context: shrine gardens, religious estates, herbs, copied records, traveler relief, and shrine-adjacent settlement patterns. The live Glasswake snippet already communicates that supported descriptive context through a concrete settlement anchor.

The planned locality record does not yet establish a separate named sacred site, locality-wide religious identity, distinct doctrine or rite, deity affiliation, religious-order stewardship, unique history, or other claim that would make a second identification snippet materially different. Repeating the existing claims at a wider scale would add duplicate coverage and could incorrectly imply that the entire locality shares settlement-level authority.

## 4. Missing Authority Before Activation

Locality activation requires authored evidence that proves a distinct locality-scale subject, including:

- a locality-wide dominant faith sufficient to justify the validator-required `dominantFaithIds` field;
- distinct locality claims beyond the active Glasswake settlement and its existing snippet;
- canonical identities for any named sacred sites rather than treating descriptive `sacredSiteType: "shrine"` metadata as site authority;
- explicit deity or religious-order relationships before those affiliations are claimed;
- distinct doctrine, rite, holy-day, history, stewardship, or religious practice authority if those concepts are intended to justify separate Knowledge coverage;
- a later authoring decision showing that a locality snippet is not merely a broader duplicate of the settlement snippet.

Map, route, travel, or point-of-interest behavior is not required for documentation planning and must not be inferred from the current place anchor.

## 5. Next Route

The next run should be `Version 0.5.184 - Sacred Site Authority Plan` and must remain planning-only.

Generic religious-hotspot authority is now sufficient to plan the narrower sacred-site ownership boundary. The plan should decide whether sacred sites need a separate authority collection or a stricter hotspot specialization, define canonical identity and place-anchor ownership, distinguish descriptive sacred-site metadata from authored named-site authority, and preserve the separation between authority data and pilgrimage behavior.

This route does not authorize sacred-site content, schemas, validators, snippets, pilgrimage mechanics, or activation. A locality snippet plan remains deferred until distinct locality authority exists. A religious-order placeholder plan should follow only when order identity or stewardship is required by an approved authority lane.

## 6. Forbidden Claims

Until later authority exists, locality or sacred-site content must not claim:

- locality-wide dominant, tolerated, or restricted faiths;
- deity affiliation, religious-order ownership, sponsorship, control, or faction standing;
- named sacred-site identity derived only from `sacredSiteType`;
- doctrine, rite, holy-day, taboo, conversion, apostasy, or law authority;
- favorability, elemental alignment, reputation, relationship, or access consequences;
- pilgrimage routes, progress, rewards, boons, trials, services, donations, or quest unlocks;
- spell access, Magic Study readiness, Prestige, family, inheritance, or NPC behavior;
- inventory, map/grid, travel, runtime, UI, storage, command, reward, event, or gameplay effects.

## 7. Deferred Locality Reconsideration

Reconsider locality activation and snippet coverage only after later authority proves at least one distinct locality-scale religious claim and supplies the required active-record fields. At that point, a separate planning run should decide the snippet category, summary, discovery sources, and non-duplication criteria before any live edit.

## 8. Non-Goals

- no new live Knowledge snippets;
- no hotspot status or field changes;
- no Religion registry, schema, validator, source, or test changes;
- no sacred-site or religious-order implementation;
- no favorability, alignment, law, pilgrimage, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, runtime, UI, storage, or gameplay behavior;
- no transition to `0.6.0`.
