# Temporary Research Artifact Retention Inventory

Date: 2026-07-29

Source route: ChatGPT via GitHub Connector

Source commit: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Status: connector-only retention inventory; no artifact deletion, promotion, route advancement, implementation, or roadmap change

## 1. Purpose

Inventory confirmed surviving temporary research and audit artifacts under `docs/dev/`, record their durable consumers and remaining value, and prevent both accidental deletion and indefinite retention without a clear reason.

This document is a classification aid. It does not make temporary evidence canonical and does not override focused design decisions.

## 2. Governing Retention Rule

The durable GPT Deep Research tracking policy requires:

1. temporary research remains non-canonical;
2. the first integration pass names the artifact and corrects stale repository claims;
3. useful conclusions are promoted into permanent decisions;
4. the artifact is either retired after complete durable promotion or retained with a named remaining consumer;
5. research completion alone never authorizes implementation.

Deletion requires more than the existence of a design decision. It requires proof that:

- every still-needed conclusion is durable elsewhere;
- no active or named future consumer requires source-level detail;
- source identity and integrity evidence remain sufficient;
- no current prompt or contract requires the exact artifact path;
- deletion will not remove the only detailed citation or repository-evidence ledger needed by deferred work.

## 3. Classification Vocabulary

| Classification | Meaning |
| --- | --- |
| `RETAIN_NAMED_CONSUMER` | Durable authority explicitly names later implementation or adapter consumers. |
| `RETAIN_DETAILED_EVIDENCE` | Permanent decisions exist, but the artifact still contains the only detailed source/evidence ledger needed by a deferred contract. |
| `READY_FOR_RETIREMENT_REVIEW` | All useful conclusions appear durable and no remaining consumer was found; deletion still requires a focused confirmation pass. |
| `HISTORICAL_ONLY` | No current authority role; retain only if project history policy requires it. |
| `UNCLEAR` | Existence is confirmed, but consumer or deletion posture needs a fresh focused audit. |

## 4. Confirmed Surviving Artifact Matrix

### Mortality, narrative, and elemental evidence set

These six artifacts were explicitly preserved together by the accepted functional-state/lethal-process/care/Mortal-Crisis contract. That decision records exact SHA-256 identities and outstanding implementation consumers.

| Artifact | Durable integrity identity | Current durable consumers | Outstanding named consumers | Disposition |
| --- | --- | --- | --- | --- |
| `docs/dev/tmp-comparative-checkpoint-mortality-rescue-and-stakes-research-2026-07-23.md` | SHA-256 `A0496AFB7C76AD3FF08F4FFD36F2A2F1C9B086577E8505AC88274EF244E81FEC`; current Git blob `26ce50958f348f316ab98bcafe31282393709fd6` | checkpoint/Stakes, defeat fallback, Mortal Crisis, health contracts | checkpoint/commitment, Mortal Crisis, resurrection, settlement, succession implementations | `RETAIN_NAMED_CONSUMER` |
| `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md` | SHA-256 `53FDEAB2D202F1A581748A2DC313EA83F5EF96034F5FDD34C6B6498EE4627C91`; current Git blob `ad5b66157f61e25223e2abd7b2a7f4ef560366e3` | Normal Stakes fallback, injury/restoration, functional/lethal/care decisions | first relevant Normal fallback/runtime replacement or HP-zero archival repair | `RETAIN_NAMED_CONSUMER` |
| `docs/dev/tmp-narrative-realization-and-mortal-crisis-presentation-audit-2026-07-23.md` | SHA-256 `463397774F83E61E02984BAF8B3E9CB7169E292EFB1906E224BE12693BE5030D`; current Git blob `6cb28305a3b2c67601568103c6309f33956ecd31` | narrative realization and observer-safe crisis decisions | later narrative-engine implementation and crisis-presentation adapter | `RETAIN_NAMED_CONSUMER` |
| `docs/dev/tmp-grounded-narrative-realization-research-2026-07-23.md` | SHA-256 `8ED92324ABF81D35CA7B269A6B53DFC9C19C7BB77900B50436592474AFEDF19E`; current Git blob `878219b57342430a47021c45e343ad27e1db95ac` | narrative realization, grammar, observer projection, deterministic fallback | later narrative-engine implementation | `RETAIN_NAMED_CONSUMER` |
| `docs/dev/tmp-elemental-alignment-temperament-and-magic-stimulus-audit-2026-07-23.md` | SHA-256 `A9752D9E546BD685C32C2BC1CF574F37E402FB0ECFD29738EBEAB90FB5ABA448`; current Git blob `974e84f89805ba3e6789331183b474fce7f30d36` | elemental alignment/temperament/magic-stimulus decision; crisis capability boundary | elemental ecology/spawn, magic-stimulus/AI, crisis-capability implementations; held static route only when explicitly selected | `RETAIN_NAMED_CONSUMER` |
| `docs/dev/tmp-grounded-elemental-affinity-ecology-and-magic-stimulus-research-2026-07-24.md` | SHA-256 `8F3855AAF50BF81493663BC77244C6496F1D226E423DE175EBE8324128A27F94`; current Git blob `909b2bc1d36539880780f2a48b473ccc725333dd` | elemental ecology/response decision; functional/lethal/care capability boundaries | later elemental implementation and crisis-capability implementation | `RETAIN_NAMED_CONSUMER` |

### Culinary and provision evidence set

These five artifacts support the accepted culinary quantity, food-state, portion, container, manifest, knowledge, and nutrition design chain.

| Artifact | Current Git blob | Durable consumer or use | Remaining value | Disposition |
| --- | --- | --- | --- | --- |
| `docs/dev/tmp-rich-culinary-dietary-system-research-2026-07-19.md` | `354dd2a6be4a542816ea42fea243bb6db91a67a0` | repaired culinary research findings; accepted culinary and ration decisions | detailed baseline, orphan-profile findings, taxonomy collisions, prepared-food topology, and exact blockers for Food-Named Taxonomy/Consumable-Profile Integrity | `RETAIN_DETAILED_EVIDENCE` |
| `docs/dev/tmp-rich-culinary-dietary-source-index-2026-07-19.md` | `33b577f8d5ec415f205a03e5b3f27440d7bde4b8` | source ledger for the repaired culinary research | detailed external source provenance and limitations not duplicated in the permanent decision | `RETAIN_DETAILED_EVIDENCE` |
| `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md` | `5acddd175c39425c67e18676891b2963b0da375f` | integration input to `culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md` and focused ration/container decisions | exact live inventory, quantity-state-owner synthesis, and deferred contract prerequisites | `RETAIN_DETAILED_EVIDENCE` |
| `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md` | `1ad41bc2715238661475886c5badf3a91aeb0229` | historical/physiology source ledger referenced by the culinary integration artifact | direct source provenance, scope, and limitations for later quantity/energy/ration abstraction | `RETAIN_DETAILED_EVIDENCE` |
| `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json` | `07d859e16f09bab5e33a25b4d87aebea3ff48935` | machine-readable owner/evidence input to the culinary integration and controlling decision | exact repository evidence, accepted dimensions, owner matrix, and package blockers for the deferred quantity/food-state/instance decision | `RETAIN_DETAILED_EVIDENCE` |

## 5. Confirmed Retired Artifact Families

The following families are recorded as deleted after durable promotion and should not be recreated merely because older documents mention them:

- initial settlement-space research;
- crafting/production systems research;
- combat/encounter systems research;
- item/equipment/inventory systems research;
- quest/event/Chronicle systems research;
- NPC/social systems research;
- magic-study systems research;
- civic authority systems research;
- family/lineage systems research;
- economy systems research;
- world-map spatial systems research;
- travel/exploration systems research;
- UI information-architecture research;
- living-character manuscript research;
- the four-consumer lethal-process/stabilization research artifact;
- the six Gate 1–5/Gate 7 production research artifacts retired by `0.6.7`;
- consumed Gate 6 and production-authority audit artifacts retired by `0.6.5`.

Historical references to these paths are provenance, not evidence that a live file should exist.

## 6. Active-Prompt Reference Posture

The current active development route does not need any of the eleven confirmed surviving artifact paths as an execution input.

That does not make the artifacts deletion-ready. Their remaining consumers are deferred implementation or contract lanes rather than the current Ashen Reef/save-identity lane.

The correct posture is:

- keep current routing independent of temporary evidence;
- use permanent decisions for present authority;
- read a retained artifact only when its named future consumer opens;
- revalidate repository claims at that time;
- delete only after the final consumer proves complete durable retention.

## 7. Retention Risks

### Accidental deletion

Deleting the six named-consumer artifacts now would remove the accepted source-level evidence intentionally reserved for later mortality, narrative, elemental, AI, restoration, and crisis-capability implementation.

Deleting the culinary set now would remove detailed source provenance and the machine-readable owner matrix before the deferred quantity/instance/food-state contract has consumed it.

### Indefinite retention

Temporary artifacts should not become permanent shadow authority. Every future consumer should record:

- which conclusions it consumed;
- which source-level details remain uniquely useful;
- whether any later consumer remains;
- whether the artifact may be retired;
- the exact integrity identity at consumption time.

### Stale repository claims

Every retained artifact describes a historical source commit. Future consumers must reproduce live counts, paths, APIs, owners, and tests instead of treating old repository observations as current facts.

## 8. Recommended Retirement Sequence

### Mortality/narrative/elemental set

Retirement should be owner-family specific rather than one bulk deletion:

1. consume the Normal-Stakes audit in the first HP-zero/fallback runtime replacement;
2. consume comparative mortality evidence across checkpoint, crisis, restoration, settlement, and succession implementation decisions;
3. consume narrative audit/research in narrative-engine and crisis-presentation adapter work;
4. consume elemental audit/research in elemental ecology, response AI, and crisis-capability work;
5. after each family’s last named consumer, run one focused retention audit and delete only that family’s artifacts.

### Culinary set

Retain through at least:

1. `Culinary Quantity, Food-State, And Instance Contract Acceptance Decision`;
2. exact taxonomy/consumable-profile integrity decision if it still depends on orphan-profile and topology evidence;
3. any first quantity/container schema plan that needs the machine-readable owner matrix or source ledgers.

After those consumers, promote any still-needed citations or exact matrices into durable authority and run a focused culinary artifact retirement audit.

## 9. Integrity Policy

For the six mortality/narrative/elemental artifacts, use the durable SHA-256 values recorded in the accepted functional-state/lethal-process/care decision as the integrity authority.

For the culinary artifacts, this inventory records current Git blob identities. A later consuming run should compute and record SHA-256 before deletion or transport if exact byte-level integrity becomes required.

Git blob SHA and SHA-256 serve different purposes and must not be presented as interchangeable.

## 10. Unconfirmed Scope Limitation

This inventory directly confirmed the eleven paths above and reconciled them against durable decisions and backlog retirement records.

The GitHub Connector did not expose a repository-directory listing action during this pass. Therefore this document does not claim that no other `docs/dev/tmp-*` path exists.

A future local maintenance run may perform an exact filesystem enumeration such as:

```text
find docs/dev -maxdepth 1 -type f -name 'tmp-*' -print
```

or its platform equivalent, then compare the result to this inventory. Any additional live path should be added as `UNCLEAR` until its source and consumer posture are proven.

This limitation does not weaken the retention decisions for the eleven directly confirmed artifacts.

## 11. User Input Posture

No user direction is required to retain these artifacts safely.

User input becomes useful when choosing whether to:

- prioritize mortality/narrative/elemental implementation versus culinary quantity/instance work;
- preserve unusually detailed research ledgers for long-term design history even after all implementation consumers complete;
- adopt an archive directory instead of deletion for fully consumed research.

Those are project-retention preferences rather than current authority questions.

## 12. Final Disposition

Confirmed live artifacts:

`11`

- `6` classified `RETAIN_NAMED_CONSUMER`;
- `5` classified `RETAIN_DETAILED_EVIDENCE`;
- `0` classified ready for immediate deletion.

Result:

`NO_ARTIFACT_DELETION_AUTHORIZED`

The next useful maintenance action is a local exact-path enumeration when convenient, not a deletion pass.
