# Ashen Reef Soundings Authored-Canon Decision

Date: 2026-08-20

Status: `AUTHORED_INPUT_ACCEPTED`

Label class: unversioned documentation-only authored-canon authority

Milestone impact: `supports_current_band`

Parent reachability decision: `NO_PACKAGE`

Representative classification: `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`

## 1. Decision Summary

Authorized product direction now settles the missing authored facts for the first ordinarily reachable Ashen Reef survey path.

The representative quest is a one-time civic hydrographic and pilotage contract commissioned by the **Starfall Harbormaster's Office** after a major seasonal storm has made older reef soundings and marker reports unreliable. Starfall depends on safe harbor approaches, fisheries, coastal craft, customs traffic, ferry movement, and merchant shipping. The office wants a fresh working chart before fishing and commercial traffic intensify.

The player-facing title is **Soundings of Ashen Reef**.

The quest is not a conservation assignment. Ashen Reef is not established here as a protected natural reserve. It is an accessible but hazardous reef complex used or approached by fishers, local craft, survey crews, salvagers, and other maritime traffic when conditions and capability permit.

The existing accepted survey runtime identity `quest.ashen_reef_survey` remains a compatibility key. The canonical authored quest-definition identity for this specific contract is:

`quest_definition.starfall_ashen_reef_soundings`

The existing travel key `location.ashen_reef` remains a compatibility destination for the survey anchorage/approach associated with Starfall. It must not be interpreted as saying that Ashen Reef and Starfall Port are the same canonical place.

This decision supplies authored authority only. It does not implement content, runtime, schemas, tests, travel, rewards, turn-in, UI, or migration.

## 2. Authority Source

The project owner explicitly approved the recommended Ashen Reef civic-hydrographic premise and instructed that the repository be updated using that recommendation on 2026-08-20.

This decision also preserves the broader quest identity, contextual eligibility, narrative naming, and travel-access product direction recorded in:

`docs/design/quest-identity-offer-context-and-travel-access-product-direction.md`

Repository evidence informed plausibility but did not create this canon. The authored approval is controlling where prior demo/runtime presentation conflicted.

## 3. Canonical Quest Identity

### Authored definition

Canonical authored definition id:

`quest_definition.starfall_ashen_reef_soundings`

Canonical slug:

`starfall_ashen_reef_soundings`

Canonical title:

`Soundings of Ashen Reef`

Category:

`survey`

This identity names one specific Starfall civic contract. It does not reserve Ashen Reef for one quest family and does not imply that all future reef surveys share this definition.

### Runtime compatibility identity

Retain:

`quest.ashen_reef_survey`

for the already accepted survey runtime path until a separately authorized compatibility/mapping decision proves a safe migration. Do not rename accepted survey flags, operations, receipts, result ledgers, events, or caller seams merely to align naming aesthetics.

The authored-definition id and runtime compatibility id are intentionally distinct authorities.

## 4. Issuer And Delivery Surface

Issuer display authority:

**Starfall Harbormaster's Office**

Issuer type:

`government`

Canonical settlement context:

`settlement.starfall_port`

Canonical regional context:

`region.starfall_isle`

Contact presentation for the first authored record, if the current quest-definition schema requires one:

**Duty Harbormaster**

`Duty Harbormaster` is a role label, not a named canonical person. Do not invent a named NPC merely to satisfy `contactName`.

The office is a civic maritime authority responsible, at minimum for this quest's narrative purpose, for maintaining usable harbor pilotage information and commissioning soundings when existing working charts become unreliable.

No permanent canonical institution/person/office id is invented by this decision. Existing quest giver fields may use presentation metadata until a dedicated office/institution/person authority supplies a stable canonical reference. If a noncanonical giver `entityId` token is structurally required by the current quest-definition schema, it must be documented as presentation metadata and must not be promoted to canonical institution authority by inference.

Representative delivery surface:

**the Starfall Harbormaster's Office in Starfall Port**.

The first representative integration path may deliberately create the character with Starfall Port as the chosen starting settlement. That is a test/user-choice path, not a rule that every character begins in Starfall or receives this contract globally.

Future distribution from other ports, guild networks, messengers, boards, or civic offices remains possible but is not required for the first ordinary-reachability package.

## 5. Narrative Premise

A major seasonal storm has passed through the approaches used by Starfall traffic.

The storm is an authored pre-existing premise for this initial contract, not a requirement to implement a new runtime weather event in the first reachability package.

After the storm:

- known reef marks or temporary navigation markers are missing or suspect;
- local pilots and fishers give conflicting reports about one or more depths and approaches;
- storm debris, shifted loose material, wreckage, breakers, or exposed/submerged stone may have changed the practical safety of older passages;
- the visible/submerged ruin markers used as bearings and hazards need verification;
- fishing and commercial traffic are expected to increase again, making uncertainty economically costly.

Starfall therefore commissions new field soundings before relying on the older working chart.

The civic motive is practical: grounding, wrecks, blocked passages, salvage demands, lost cargo, dead crews, interrupted customs revenue, delayed merchants, and reduced fishing capacity all cost the port more than a bounded survey contract.

## 6. Setting And Technology Posture

The survey uses technology appropriate to the established maritime setting, such as:

- sounding/plumb lines and poles;
- compass bearings;
- hand charts and route charts;
- visible shore bearings, beacons, ruins, or other fixed markers;
- tide/current observation;
- floats, stakes, marker buoys, rope, and ordinary small-craft seamanship;
- local pilot/fisher reports as supporting evidence.

Magic may assist when existing character capabilities permit it, but magic is not the civic source of truth. The deliverable must remain a chart and set of observations usable by ordinary nonmagical mariners.

Do not add a mandatory magical prerequisite.

## 7. Quest Objectives

The accepted four-shift survey structure receives this narrative interpretation without changing its accepted mechanical authority.

### Sector I - Inshore Approach

Record the common approach from the Starfall side: soundings, breakers, shore bearings, and a usable draft-safe line.

### Sector II - Working Reef

Survey the shallows most relevant to fishing and local craft: shelves, breakers, old markers, anchorable/safe water, and dangerous crossings.

### Sector III - Outer Passage

Survey the more exposed approach used or needed by larger fishing craft, merchant tenders, patrols, pilots forced wide by wind, or emergency traffic.

### Final Shift - Ruin Markers

Verify the known visible/submerged ruins used both as navigation bearings and as hazards. The final packet must establish that the three survey sectors are complete before ruin confirmation.

The existing survey's **Stormglass Bloom** remains an incidental discovery made during the final inspection. The Harbormaster does not commission the survey to find, preserve, or study Stormglass Bloom.

The survey output remains a verified reef chart packet suitable for harbor pilotage use.

## 8. Conservation, Fisheries, Tourism, Reward Intent, And Other Motives

Ashen Reef is not designated a protected reef by this decision.

Fishing is an important secondary civic motivation because reliable approaches protect boats, crews, food supply, harbor activity, dues, and trade. This does not create a modern ecological stock-assessment or overfishing-management program.

The contract is a paid civic undertaking. Successful eventual turn-in is intended to provide an ordinary monetary payment from the harbor authority. However, **no exact coin amount, bonus amount, standing award, salvage right, item grant, or other payout is authored by this reachability decision**.

The old demo presentation `580 crown + salvage rights` is explicitly non-canonical and must not be copied into the authored definition or production representative path.

Exact payout, standing, item, service, salvage, or other consequence terms belong to the separately deferred quest turn-in/reward authority. Their absence is intentional and must **not** be treated as missing authored input for the ordinary-reachability package.

If the current strict `quest_definition` schema requires numeric descriptive reward fields, the implementation-package decision must resolve that as a schema/content packaging constraint without inventing fake economic canon. It may not silently encode zero as proof that the contract is unpaid, nor copy another quest's reward values by analogy.

Tourism, festivals, noble events, religious use, hunting, salvage, natural study, military reconnaissance, economic surveys, or later recurring fisheries surveys may justify other quests in the future. They do not alter this quest's identity.

Similar physical work with a different issuer, motive, consequence, or narrative context should normally be a distinct authored quest that may reuse survey archetypes or templates.

The existing Brineharbor reef-soundings charter remains a separate quest definition and must not be aliased or merged into this Starfall contract.

## 9. Availability And Eligibility

The first contract is **one-time per campaign**.

For the smallest representative path, offer availability is deterministic when all of the following are true:

- the campaign is active and has completed its ordinary initial version-7 publication/load path;
- the character is presently in `settlement.starfall_port`;
- the one-time Ashen soundings contract is not already active, completed, or otherwise consumed;
- no conflicting durable copy of the same one-time offer exists.

The post-storm condition is narrative background already in effect. Do not require a new weather simulation trigger.

No blanket hard `levelMin`, class tag, mandatory magic, or reputation requirement is authored for this first contract.

No mandatory skill gate is authored for offer admission. Navigation, General Lore, Survival, suitable equipment, health, fatigue, party support, and maritime experience may affect suitability, risk, or eventual execution, but the first ordinary-reachability package must not invent a new universal level/class gate.

The Harbormaster's willingness to contract the work is represented by making the civic contract openly available to capable volunteers/contractors at the office; the game's actual survey mechanics determine whether the player performs the work successfully and safely.

If the current authored quest schema requires a minimum level, `levelMin: 1` may represent the absence of a meaningful level gate only if level 1 is the ordinary minimum playable level under live authority. Empty class/skill/standing requirement arrays are preferred to fabricated qualifiers.

## 10. Offer Retention, Expiry, Decline, Re-Offer, And Timing

The initial offer does not expire in the first reachability package.

Before acceptance, the durable offer should remain available across version-7 publication/restart until accepted or otherwise explicitly consumed by a future authorized quest-lifecycle mechanic.

The first package does not need a destructive decline system. Ignoring, closing, or not accepting the offer must not consume the one-time opportunity.

Once accepted, the same one-time offer must not be duplicated or re-offered.

Once completed, it must not be re-offered.

Failure/abandonment-specific re-offer policy is deferred unless live implementation authority proves it is necessary for the representative path. Do not invent a broad quest failure/abandonment framework here.

No hard post-acceptance completion deadline is authored for the first reachability implementation. The post-storm reopening creates narrative urgency but not a runtime expiry requirement. If current static quest content requires `dueWithinHours` or similar descriptive scheduling fields, the implementation-package decision must not reinterpret them as an offer-expiry or runtime-failure mechanic without separate authority.

## 11. Journal Admission Authority

The authored quest definition remains static content authority. It does not write player/session state itself.

A narrow game-engine **authored quest-offer admission owner** should be the future runtime authority that evaluates the accepted Starfall availability facts and idempotently makes the one-time contract visible in `sessionState.questJournal`.

For compatibility with the accepted quest acceptance/tracking path, the projected journal row for this first implementation should retain runtime quest id:

`quest.ashen_reef_survey`

and category:

`contracts`

unless the implementation-package decision proves that a schema change is indispensable. Do not add a generic quest-offer schema solely for aesthetic identity separation.

The admission owner must preserve:

- deterministic one-time admission;
- no duplicate journal rows;
- retry/idempotency;
- stale/conflicting state rejection where applicable;
- version-7 persistence before acceptance;
- separation between authored definition identity and mutable runtime quest state;
- existing quest acceptance ownership of `contracts -> active` and existing tracking ownership.

The implementation-package decision must determine the smallest production API/result/event/receipt shape required by live repository conventions.

## 12. Travel-Access Grant

`location.ashen_reef` remains the current compatibility travel key for the survey anchorage/approach associated with Starfall Port / Starfall Isle.

Offer presentation alone does **not** make the exact survey destination travelable.

**Accepted quest acceptance** is the causal occurrence that supplies the player with the old working charts, departure instructions, survey authorization, and arranged access/launch needed to reach the survey anchorage.

The preferred implementation boundary is a narrow Ashen-specific access-admission adapter/owner that consumes an accepted quest-acceptance result/event and idempotently ensures the exact known/travelable `location.ashen_reef` row. This preserves generic quest acceptance as the owner of contract acceptance rather than turning it into a general geography system.

The access row must survive version-7 publication/restart and remain idempotent under retry/duplicate acceptance handling.

Learning this route does not grant Geographic Knowledge evidence, Codex/map recognition, fog reveal, or generic discovery authority. Survey advancement retains all accepted `no_proposal` geographic fields.

After the route has legitimately been learned, later travel need not be conceptually quest-gated forever. Future travel work may add independent access through ordinary navigation knowledge, hired passage, owned vessels, guides, fares, or other lore-compatible means. None is required for this package.

## 13. Canonical Treatment Of Prior Conflicts

The current Ashen representative quest is Starfall-authored.

For this quest:

- demo-only Saltmere Harbor Office wording is discarded as non-canonical presentation;
- demo-only Glasswater region wording is discarded as non-canonical presentation;
- demo-only `580 crown + salvage rights` reward wording is discarded as non-canonical presentation;
- current Starfall Port / Starfall Isle association controls the accepted narrative location;
- `location.ashen_reef` is a compatibility survey-destination key, not proof that the reef is identical to the settlement;
- Brineharbor's authored `quest_definition.brineharbor_reef_soundings` remains separate.

The implementation-package decision must audit Ashen-facing production/demo strings such as stale `Glasswater`/`Saltmere` labels and include only the smallest corrections required to prevent the accepted Starfall quest from publishing contradictory presentation. Do not use this as permission for a broad world renaming pass.

## 14. Downstream Seams Preserved

Unless the implementation-package decision proves a direct contradiction, preserve unchanged:

- accepted quest acceptance/tracking command ownership;
- tracked-quest travel activation of `operation.quest.ashen_reef_survey` and `activity.survey.ashen_reef`;
- the four accepted survey advancement shifts;
- accepted-only campaign mutation/application;
- version-7 publication/load/restart behavior;
- durable survey duplicate handling;
- correction/projection repair;
- Normal defeat/recovery preservation;
- all nine survey `no_proposal` geography fields.

No separate activity-selection mechanism is needed on the straight representative path.

## 15. Explicit Exclusions

This decision does not authorize:

- quest turn-in or reward payout;
- exact coin, item, standing, reputation, service, voucher, salvage, or merchant consequences;
- generic quest/mission/order/favor implementation;
- quest-arc implementation;
- generic dynamic world-condition offer generation;
- generic office/institution/person authority;
- a new weather-event system;
- a general travel-access rewrite;
- district/site/building/interior player-position work;
- Geographic Knowledge, recognition, Codex/map, fog, or discovery grants;
- conservation/protected-reef mechanics;
- a generic fisheries/ecology simulation;
- broad runtime compatibility-key renaming;
- `0.7.0` band entry.

## 16. Required Next Route

Authored input is complete for the first representative Ashen survey path.

Install and execute a separate unversioned:

**Ashen Reef Survey Ordinary Reachability Implementation Package Decision**

That decision must determine the smallest coherent implementation package for:

1. accepted quest presentation and the narrowest honest use of current authored quest content without fabricating unresolved payout/timing data;
2. deterministic one-time Starfall offer admission after ordinary initial publication/load;
3. durable `contracts` journal admission;
4. accepted-quest-triggered Ashen travel-access admission;
5. correction of only directly conflicting Ashen presentation labels;
6. an injection-free creator-to-restart representative test using an explicitly selected Starfall starting settlement;
7. reuse of every already accepted downstream survey seam.

Only that implementation-package decision may determine whether provisional `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence` is now the correct next numbered implementation route.

`0.7.0` remains `NOT_READY` until the implementation, independent acceptance, and later explicit band-entry decision are complete.
