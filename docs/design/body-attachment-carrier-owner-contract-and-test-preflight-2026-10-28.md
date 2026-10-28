# H2 Body Attachment, Holster Carrier, and Layered Accessibility Owner Contract Preflight

Date: 2026-10-28
Status: CONNECTOR-SAFE FUTURE OWNER CONTRACT / RED-TEST PACKAGE; NOT ACCEPTED SHAPE, IMPLEMENTATION, ITEM DATA, UI, GAMEPLAY, OR ACTIVATION AUTHORITY.
Repositories: `vagabond1215/Lineage_Reforged` only. Master baseline: `a596112acf3945f2bf7c625e943f2511d12aa710`. Independent Codex native PR #41 head observed: `a3f24c9177034adf4f4068f356d4b0c39337b207`.
Evidence and design ancestors: [H1 exact 56-item census](../data-dictionary/apparel-holster-carrier-coverage-census-2026-10-28.md); [H0 holster/pocket armor design](holster-pocket-and-armor-layer-accessibility-preflight-2026-10-28.md); [tool slot/back mount/shield](quick-access-tool-carriers-back-mounts-and-shield-readiness-decision-2026-10-28.md); [portable tool T1](../data-dictionary/tool-portable-t1-capability-classification-2026-10-28.md); [accepted layered loadout preflight](character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md).

## 1. Resolved conceptual boundary (subject to owner acceptance)

A holster/pocket/strap is a **specific physical capacity provider**, not a guaranteed empty global body slot or new item copy. Body region is an anatomical **anchor and interference context**. A carrier or garment defines concrete mounts/pockets only if it has an authored capability, which an owned and equipped instance legitimately supplies. A built-in pocket and separate attached holster can use the same capacity model while differing in their exact provider object graph.

Three decisions must remain separate:

1. **Mount existence + fit**: Is a specific pocket/holster/loop present and structurally able to retain this actual object? This is primarily item profile/actual carrier instance and cannot be faked by a UI "Tool" slot.
2. **Layer accessibility**: With the current clothing, armor, shields, pack and pose, is that mount reachable, slowed, physically blocked, or incompatible? This belongs to a single effective-worn fit/coverage/interference resolver, informed by authored profiles.
3. **Concealment**: Can observers see/detect the carried item in the current exposure and observation context? A visible sheath may be quick; an obscured sheath may be slow; concealed never guarantees successful stealth.

Use physical geometry/coverage/closure constraints, not a global `isArmored` boolean. Any explicit blocked outcome should name the *conflicting item and anatomical intersection*, and whether the conflict makes the mount physically impossible versus merely currently inaccessible.

## 2. Recommended owners, without duplicating canonical authorities

| Concern | Recommended eventual source/owner | Deliberately not owned by |
| --- | --- | --- |
| Canonical identity / item class | existing `items.items` | arbitrary new holster registry |
| Fixed carry dimensions, shape, unsafe sharpness, mount-compatibility descriptors | a reviewed item-owned physical/carry profile, exact path not yet approved | current instance state or UI |
| Built-in garment pockets, external holster interfaces, mount counts and closures | future approved carrier/container template or specific item-owned carrier capability with explicit single authority | global character slot list or item name heuristic |
| Armor coverage, layer depth, bracer/gauntlet articulation and interference | approved apparel/armor fit profile with one resolver | wear slot ID alone, rough material hardness, movement UI |
| Weapon attacks and tool utility | accepted `useProfiles` / future reconciled weapon/tool profiles | holster itself |
| Current carrier mounted state, items actually inside, exact single location, condition, receipts | one selected native durable gear physical owner, extended only after reviewed versioned schema | duplicate bag/equipment maps or preset clone |
| Assignment and active presets | non-owning player loadout references to existing item instance IDs | moving/creating physical items by merely selecting a preset |
| Held/drawn state, forearm commitments and multi-hand constraints | the same physical/action authority with one real occupancy graph | a boolean on static item type or fake hand item |
| Retrieval, outfit change, safe interruption, time advancement | contextual action and clock/body authority | storage table, static content, CSS |
| Concealment/detection | actor/observer, context and skill/action owner with static gear visibility descriptors | permanent "undetectable" flag or arbitrary fixed stealth bonus |
| Station tool permission and tool use | craft/activity and real station instance authority | mounted personal holster or workforce tag |

These are owner-routing recommendations, **not approved schema paths**. Reconcile existing future `items.container_templates`, `items.weapon_profiles`, `items.armor_profiles` and the unselected v3 gear owner rather than creating multiple authorities for the same property.

## 3. Minimal potential physical graph, just enough for test design

Illustrative relationships only; **not a field declaration**:

```text
Character body: left forearm
  Worn wrist_bracer instance A
    authored mount "hidden sleeve" (if an accepted source profile grants it)
      Child skinning_knife instance B (attached to A, not in bag)
Character structural Back: backpack instance C
    approved exterior bow mount (if accepted)
      Child short_bow instance D (attached to C, not in bag)
Character garment layer: travel_cloak instance E
    accepted inner pocket
      Child needle-case instance F
        Contents: exact needles, only under a separately accepted container/stack model
```

- Each child retains **one authoritative location**, e.g. `attached to carrier A / mount m`, or physically held, or in a valid bag. A drawn weapon is not also located in the bracer, cloak, backpack, sheath or weapon slot.
- The carrying provider itself has one actual location and an allowed anchor. Body/worn eligibility must be validated from source; a `wrist_bracer` that is only a catalog identity does not automatically confer a valid real `wrist` slot.
- The body region does not invent capacity. It permits anchoring an eligible **actual provider**. A belt and two holsters can be separate objects linked through one verified parent graph; count all mass/volume once.
- Avoid cycles and self-attachment. Parent removal, loss, trade and storage must preserve or deliberately reject its children atomically, including locks and rights; no orphaned mounts.
- Treat `throwing_dart` and `throwing_knife` as **weapon-class durable identities** in the current native model. A future *ammunition bundle* needs an explicit identity/count and retrievability decision, not a magic stack representation that erases exact tools/weapons.

### State transitions to specify before code

| Command intent | Source | Destination | Expected atomic guard |
| --- | --- | --- | --- |
| Attach item | bag or legal held item | exact carrier instance mount | carrier worn/accessible, mount exists, empty/capacity, item fits, parent stable |
| Retrieve for use | bag or carrier mount | actual held hand(s) | correct owner/position, body posture, action context, draw time, no double hand occupancy |
| Return from use | hand | recorded source mount/bag | source still exists and accepts, capacity/permission intact, no silent teleport |
| Change clothing/armor | worn set and attachments | compatible new worn set | atomic outfit fit/access/collision, child disposition; applied full preset one-watch only on success |
| Remove carrier | worn belt/brace/pack plus children | owned lawful bag/drop/transfer | nested graph preserved or explicitly settled; refuse when impossible |
| Transfer/drop/trade carrier | carrier plus permitted contents | new custody/owner | exact instance inclusion, legality, possible explicit detach first |
| Strap shield | actual hand or lawful carrier | forearm or back mount | shield-specific mounting style, non-overlap, true hand/forearm and block readiness |
| Interrupt retrieval | pending action and exact source | unchanged or defined intermediate state | no duplicated item, no free activity, interrupt handler and Save-stable stance |
| Save/restart | one physical graph and assignments | same authorized graph | versioned full validation, no reset concealment or phantom slots |

A temporary "use from bag" UI effect may be batched **only if the physical owner performs one coherent transaction**, including timing and interruption. It cannot create a dangling held item while retaining a second bag copy. Persistent held state must be authored in the selected Save epoch, not a UI-only flag.

## 4. Accessibility vs appearance decision function

A later resolver should determine, in order, using fully authored input:

1. Is provider alive and actually available (worn, authorized and not destroyed/remote)?
2. Does the provider have the claimed mount and spare verified capacity?
3. Does exact item size, handling/edge case and fastening method fit safely?
4. Does any overlapping worn item, shield or pack make the mounting **physically impossible**? Reject fit rather than attach invisible collision.
5. If physically possible, is the stored object **currently reachable** under layers/closures? May be fully accessible, slowed, or inaccessible until changing gear.
6. If reachable, does the action require one/two actual hands, forearm freedom, stance, draw timing and other legal context?
7. Independently determine exposed vs covered vs concealed, then observer detection if applicable. Concealment doesn't override obstruction.
8. Resolve accepted revisions and elapsed time exactly once, mutate one owner, persist one receipt.

**Unknown authoring should fail closed** rather than becoming an inferred free mount, but a mounted object can be temporarily inaccessible rather than deleted when a later item covers it safely. When armor physically conflicts with a mounted object, the armor-change command must reject or require explicit repositioning, not retroactively delete the holster.

## 5. H2 prospective red-test matrix

These are **test obligations for future authenticated Codex checkout**, not tests executed by this connector. Inputs that require a hypothetical carrier mount / forearm armor profile are **test fixtures only** until canonical content is accepted.

| ID | Scenario | Expected invariant after authoring |
| --- | --- | --- |
| H2-01 | Item identity `wrist_bracer` has no mount profile | Cannot attach a knife just because a wrist slot is on screen |
| H2-02 | Worn bracer authored slim sheath + one compatible knife | Attach exact child once; bag count decreases once |
| H2-03 | Same bracer and a second knife after one-capacity mount is occupied | Refuse, unchanged state and clock |
| H2-04 | Under-bracer knife plus thin compatible sleeve | Allow with separately evaluated access and visibility |
| H2-05 | Under-bracer knife plus rigid long gauntlet physically obstructing sheath | Reject incompatible outfit change or require detachment |
| H2-06 | Knife stored safely under closed bracer but opening covered by sleeve | May remain stored, draw restricted/slowed; not deleted |
| H2-07 | Knife strapped to exterior of authored plated wrist holder | Compatible if designed, exposed rather than automatically stealthy |
| H2-08 | "Stealth penalty" applied to holster physically colliding with plate | Reject; numeric detection cannot cure impossible physical fit |
| H2-09 | Upper-arm sheath with short bracer and free elbow clearance | May attach if provider and zone authoring agree |
| H2-10 | Upper-arm sheath with rigid cuff crossing elbow | Deny only on actual intersection; not all arm armor |
| H2-11 | Concealed thigh dart case under compatible trousers | Finite capacity; accessible state independent of observer concealment |
| H2-12 | Thigh holster with greave that covers only calf | Do not infer thigh obstruction from `armor.leg` alone |
| H2-13 | Thigh holster with authored overlapping rigid leg plates | Reject or legal external rerig, with actual item reassignment |
| H2-14 | Boot knife under overlapping boot/greave | Test access path, not just storage fit |
| H2-15 | `travel_cloak` has no pocket authoring | No phantom cloak inventory capacity |
| H2-16 | Author-approved tailored cloak pocket with needle case | Storage within exact cloak item, finite capacity and protection |
| H2-17 | Cloak covers visible side sheath | Visibility may change; draw speed and reach checked separately |
| H2-18 | Belt tool-loop hammer vs same hammer in bag | Same instance; only extra bag rummaging overhead differs |
| H2-19 | One-backpack core and bow sling using independently compatible shoulder anchor | Allowed only after coverage, dimension and clearance checks |
| H2-20 | Backpack with no external long-tool mount plus shovel | No arbitrary quick-access shoulder slot |
| H2-21 | Backpack with two incompatible large mounts occupied | Enforce aggregate bulk and interference; no clipping |
| H2-22 | Gripped buckler plus hand-held tool | Hand conflict enforced; no accidental extra block action |
| H2-23 | Special authored forearm guard plus wrist knife | Validate shared forearm surface and action-specific hand freedom |
| H2-24 | Tool selected as Primary Weapon but sheathed/attached | Attack requires combat profile, held readiness and real action cost |
| H2-25 | Throwing darts in multi-position case | Count and exact durable identity preserved; no inferred fungible bundle |
| H2-26 | Remove bracer/backpack with child attached | Move complete parent graph or atomic rehome; no orphan or clone |
| H2-27 | Drop/steal/transfer loaded carrier | Owner and custody follow explicit transaction; no invisible retained contents |
| H2-28 | Child return destination is gone or occupied | Reject or use explicit lawful alternate, no disappearance |
| H2-29 | Two simultaneous hands assigned to mutually exclusive held items | Reject and conserve all locations |
| H2-30 | Duplicate request ID or stale revision | No second effect, no elapsed-time charge, retained receipts |
| H2-31 | Interrupted draw/retrieve | No free combat action, no second copy, Save state remains replayable |
| H2-32 | Full Combat/Casual preset apply while mount obstructed | All-or-nothing full change; stale/invalid costs zero, accepted costs one watch |
| H2-33 | Save/restart with nested coat/bracer/pack children | Exact item IDs, location, mount identity, durability and visibility-derived resolution preserved |
| H2-34 | Legacy 17-slot Ashen Reef witness loaded after native selection | Historical fingerprint/replay must remain valid, no rewriting stored witnesses |
| H2-35 | Selected account/recovery after crash during carrier transaction | Retained artifact, consumer recovery and no half-published attachment |
| H2-36 | No authorized station tool but authored personal tool on character | Craft later resolves personal tool, not nonexistent station stock |

**Tests must be red-before-green against the selected owner** once approved. Positive fixture success does not prove real authenticated UI. Exact numeric time, damage, stealth or detection thresholds are intentionally unassigned.

## 6. Minimal implementation gating and ownership checkpoint

- **Gate 0 (now, safe only):** accept or revise this owner allocation, per-instance attachment semantics, anatomical regions, and accepted source examples; no source code.
- **Gate 1 (after separate native v3 lifecycle and selected Save):** one carrier/provider physical profile with one attachment, one possible body overlap, real ref location and truthful item capacity. Fix caller, Save and error paths as one bounded authenticated checkout slice.
- **Gate 2:** active held/stow timed commands and configured primary weapon selection, with combat profile reconciliation and physical hand/forearm interference.
- **Gate 3:** clothing-layer access states, cloak pocket, thigh and wrist mounts; observer-based visibility only after visibility action owner exists.
- **Gate 4:** multiple carriers, complex back-plus-pack harnesses, ammo/dart cases, integrated armor fittings, theft/trade and station equipment.
- **Hold external T2:** full `civilization.workplaces` JSON is 2,173,521 bytes and was not reliably retrievable by connector. T0 recipe declarations are known; station stock/workforce tag crosswalk and actual workplace equipment require checkout and separate accepted station authority. Do not convert descriptive recipe/workforce tags to free equipment.

Before any activation inspect the latest selected v3 head/PR chain, existing exact Save snapshot and authentication; existing `GEAR_OWNER_VERSION` and `GearLocation` do not provide attachment/held state. Do not rename saved slots or alter the native PR #41 branch from this design pass.

## 7. Recorded pass disposition

Connector evidence only. This pass authored one new Markdown document on PR #40, without editing source, data, schema, tests, UI, current Codex coordination or shared branch register. No lint, tests, build, browser Selected/Save replay or authenticated checkout run. Branch posture: `HOLD_NAMED_CONSUMER`; next consumer is **owner-reviewed carrier/armor/Save schema decision after native v3 selected lifecycle gate**. Do not merge as gameplay until that gate.
