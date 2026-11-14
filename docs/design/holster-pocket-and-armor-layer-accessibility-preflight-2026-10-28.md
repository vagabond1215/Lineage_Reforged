# Body-mounted holsters, clothing pockets and armor-layer accessibility preflight

Date: 2026-10-28
Status: owner-requested design candidate, connector documentation only. NOT an implementation, schema, stat, fit, Save migration, or active gameplay change.
Scope: `vagabond1215/Lineage_Reforged`. Master inspected `a596112acf3945f2bf7c625e943f2511d12aa710`; unselected native gear PR #41 head `a3f24c9177034adf4f4068f356d4b0c39337b207`.
References: [tool T0](../data-dictionary/tool-class-census-and-recipe-station-crosswalk-2026-10-28.md), [portable T1](../data-dictionary/tool-portable-t1-capability-classification-2026-10-28.md), [quick-access carriers, Back and shields](quick-access-tool-carriers-back-mounts-and-shield-readiness-decision-2026-10-28.md), [layered slot preflight](character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md), [item/container authority](item-equipment-inventory-authority-boundary-decision.md).

## 1. Decision proposal

**Use a combination of (a) anatomical attachment zones, (b) real pocket/holster capacity provided by equipped items, and (c) multilayer compatibility and access checks.** No permanent, unlimited Wrist Knife / Thigh Darts / Back Bow slots on the body by default. A cloth garment can include built-in pockets; a belt/bracer/harness can provide attachable mounts; another worn item can obstruct or restrict a mount, but only with supported coverage/geometry rules.

Distinct mechanics:
- **Fit**: the holster and actual object fit the exact supplied mount, considering volume, shape, retention and safe sheath/case.
- **Physical presence and storage**: one durable instance resides at one legitimate physical location; carrier-mounted items are referenced by exact carrier instance and mount identity.
- **Wear/access**: layered clothing or armor may permit, limit or block inserting/removing an object. A stored item can remain carried but currently inaccessible.
- **Readiness**: a quick-access holster avoids ordinary internal-backpack search overhead but not automatic combat draw, stance or hand occupancy time.
- **Concealment**: covered, exposed, partially covered, or designed-for-concealment access profile; concealment never automatically implies undetectability, stealth score or free combat action.
- **Retention/security**: a hidden needle case, dart roll and tightly strapped knife have different spill, injury and movement constraints, even when all are small.

A blocker must be a **specific compatibility failure** (e.g. no clearance under rigid plate), not `if any armor on arm then no holsters`. Similarly, a concealment penalty does not make a physically impossible mount valid. A strap on *outside* a plate component can be valid but more exposed; a specially integrated plate accessory may be valid and concealed if actually designed that way. Do not infer these from class names.

## 2. Source truth, absent capabilities

Existing canonical identities include `wrist_bracer` (accessory), `utility_belt`, `coin_belt`, `backpack`, `pack_frame`, `herb_pouch`, `travel_pouch`, `casual_cloak`, `formal_cloak`, `travel_cloak`, `throwing_dart` and `throwing_knife` (weapon), `surgical_needle` and `tailor_needle` (tool), and `skinning_knife` (tool). `plate_greaves` is a current armor identity. There is **no canonical full plate gauntlet item** in the inspected 18-armor-item set. Examples involving an enclosed plate gauntlet, integrated gauntlet sheath, bracer-hidden knife or thigh rig are proposed new capability/gear candidates, not current equipment claims.

The unselected native gear fit table allows throwing dart/knife in `slot.equipment.weapon.right`, while `wrist_bracer`, `utility_belt`, `backpack` and `pack_frame` do not have authored native fit rows. Pouch fits are carried-only. Native gear location remains `worn | bag | overflow` with no parented pockets, mounted sublocations or hand state. The catalog does **not** author holsters, pocket counts/capacities, armor clearance, garment coverage geometry, concealment and detection, rapid retrieval, physical armor interference or pin-point anatomy. There is no existing `items.holster_profiles` authority. These are not bugs to fix with generic data defaults.

## 3. Region and mount model (data design, not enum implementation)

Use a compact set of **body anchor regions** rather than unlimited tiny slots:

| Body anchor region | Examples of possible mount type | Shared conflict posture |
| --- | --- | --- |
| wrist / lower forearm, left/right | slim sheath, small dart clip, wrist carrier | bracer/gauntlet/sleeve, shield forearm guard, hand range of motion |
| upper forearm / near-elbow, left/right | narrow sleeve/strap | elbow hinge, rigid cuff, shield straps, joint clearance |
| upper arm, left/right | arm band, interior sleeve pocket | spaulder, vambrace extension, loose/tight sleeve |
| hip / belt, left/right | scabbard, tool loop, thigh holster upper connector | cuirass skirt, waist belt, backpack hip straps |
| outer thigh, left/right | tied-down leg holster, garter, cargo pocket | leg armor, garment thickness, stride/seat clearance |
| inner thigh, left/right | specialist concealed sleeve | safety, movement, armor collision, accessibility restrictions |
| calf / boot, left/right | slim boot knife, low leg tool case | greave/boot fit and knee clearance |
| chest / inner vest | sewn pocket, small case | chest armor, layered garment openings, backpack straps |
| cloak / garment lining | pocket, pouch, stitched sheath | specific garment capacity, lining/access, cloak drape and armor coverage |
| shoulder / side / back | sling, scabbard, bow case, mounted shield | one structural back load plus actual compatible secondary mounts |

Each mount has an *actual provider* (worn garment, bracer, belt, special holster, pack harness), region, side, size/quantity/shape limits, attachment type, and named mount key. One side or free anatomical region does **not** automatically grant a usable holster without a carrier. Related anchors can overlap in three-dimensional space; conflict geometry must be checked, not only exact anchor ID.

**Built in vs independent:** an item may author innate mounts (e.g. a tailored cloak's real inner pocket) or an interface accepting a separate compatible holster module. Both ultimately yield owned, capacity-limited mount positions when worn. An independent holster may itself be an item requiring an authorized belt or garment anchor. Do not automatically grant every cloak pockets or every bracer a blade sheath.

## 4. Coverage, concealment and accessibility outcomes

The combination check should return distinct results, not one `blocked` boolean:

| Proposed result | Fit / access / visibility meaning | Player-facing behavior |
| --- | --- | --- |
| compatible, exposed | Can wear and draw, holster visible | full lawful use; visible carry |
| compatible, concealed | Can wear and draw under appropriate garment | hidden from casual sight only subject to detection rules |
| compatible, slow/restricted | Holster fits but access needs lift/undo/adjustment or an action | extra retrieval/draw time; may be unavailable in combat |
| stored but inaccessible | Item can remain where mounted but currently cannot be drawn | explain layer obstruction; no instant-use claim |
| incompatible | Collision, no mount, hard coverage or unsafe retention | reject attachment / unequip or relocate when changing layers |
| integrated-fit exception | Explicitly designed gauntlet/bracer/armor/pocket with certified attachment | use its own authored size, access, protection and concealment rules |

Separate visibility from draw speed and carrying legality. For instance, a holster strapped *outside* a rigid armor forearm may be physically compatible but obvious and potentially slower; a hidden sheath under an enclosing gauntlet may be impossible to access without removing armor. A bespoke gauntlet with a designed compartment is a **distinct authored piece** with its own clearance and opening requirements, not a generic exemption available to every gauntlet.

**Geometry rules:** arm coverage at hand/wrist/forearm/elbow/upper arm differs from armor on shoulder; thigh/hip/knee differs from calf; upper arm freedom does not imply a wrist sheath can fit. Partial plate or a shortened bracer may permit adjacent mounting; long rigid bracers and articulating joints may block access or an overlapping mount. Use authored region, layer depth, thickness/bulk, rigid/soft and opening-path descriptors, not static "metal armor = incompatible".

## 5. Concrete examples to accept as decisions later

1. **Slim knife under soft bracer:** allowed only if bracer has a built-in slim sheath or permits a dedicated under-bracer module with measured clearance. It can be concealed, but drawing requires a legal opening and arm/hand posture.
2. **Slim knife under fully enclosed plate gauntlet:** reject by default when sheath physically collides or cannot open; "stealth penalty only" is not an adequate physical fit rule. If a specific engineered gauntlet has a built-in accessible sheath, permit with item-specific limits; outer-plate straps are potentially compatible but visible and can restrict wrist motion.
3. **Upper-arm strap with short bracer:** potentially compatible where the arm band, elbow, bracer and sleeve don't intersect. An extended sleeve or pauldron that physically covers the opening may slow access or hide it; actual access depends on layers.
4. **Thigh knife or small dart wallet with trousers:** permitted only with cargo pocket/holster/rig and authored fit; cloak or long coat may visually conceal, while stiff greaves/cuisses or armor straps may interfere. A rig over the armor can be visible but usable if secured.
5. **Boot knife with plate greaves:** depends on boot and greave geometry. Overlying armor may obstruct retrieval even if the stored object survives in its sheath. A specialist exterior boot/greave module is possible but not automatic.
6. **Side knife/sword holster with backpack:** allowed when waist mount and pack hip straps don't collide. No automatic two weapons on one hip. Side carry may be easier than back-drawing a long sword.
7. **Back holster beneath backpack:** generally inaccessible or colliding; a compatible external pack-mounted sheath or separate off-axis shoulder sling may work. Cloak can affect concealment and draw clearance independently.
8. **Cloak with lining pockets:** yes where an explicitly authored garment template supplies pocket/case capacity; small notes, needles, sealed tools or slim knife require actual size and protective sheath. A cloak does not automatically provide large stable/quick slots, or hide prohibited bulky shapes. Heavy swaying/cloth opening may reduce concealment or impose extra access time.
9. **Throwing darts and small needles:** model holster/case as an *actual carrier* with specific finite capacity, orientation, safe retention and refill rules. Do not claim that 20 individually tracked weapon darts have become one fungible bag stack: current native v3 treats weapons as durable instances and tools as durable, so batch/stack compression must be a later physical identity and ammunition-container decision.
10. **Shield and forearm holster:** a gripped shield occupies a hand; a strapped forearm guard may occupy mounting surface and restrict compatible action. Do not allow a concealed wrist knife to overlap a braced guard without clearance and use-mode constraints.

## 6. Carry & Stow interface recommendation

When an actual owner exists, add a **fourth Character Overview subview: Carry & Stow** alongside Equipment, Casual Clothing and Accessories, rather than a separate character-wide inventory replacement or a global grid of dozens of holsters. Existing Equipment/Casual/Accessories work is still deferred and the selected v2 UI is not changed by this proposal.

- Show an anatomical overview with a compact **body attachment outline** (L/R forearm, upper arm, hips, outer thighs, calves, chest, cloak, back/shoulder) and the currently worn source items.
- Show only **available mounts provided by real equipped items** and occupied mounts. If a body region has no matching provider, show a quiet "No compatible holster" explanation instead of an always-active empty equipment slot.
- Each mount row shows precise physical source: `Wrist Bracer > Inner sleeve > Slim knife` or `Utility Belt > Left clip > Awl`; item identity, capacity, accessibility, and detection posture as separate indicators. Avoid displaying an item twice in equipment and bag inventory as two owned copies.
- Support contextual Attach, Detach, Retrieve, Return and Inspect. If blocked, explain whether it is fit, armor interference, reach, hands, stealth exposure, capacity, permission or body timing.
- Include a **visibility/concealment preview**, not an unconditional stealth buff. "Covered by cloak, visible on inspection" is a descriptive state, not a guaranteed stealth check outcome.
- For saved Combat/Casual presets, store references to mount configuration and chosen items, not physical clones. Switching a full preset still uses the previously directed one-watch equip/apply authority and restrictions; retrieving one item from a ready holster follows its own contextual timing.
- On narrow screens, the same anatomy/slots may collapse into a grouped list rather than requiring an all-new full-screen page. Normal Inventory still owns bag contents and transfers.

## 7. Candidate static descriptors and owner boundaries

Candidate *future* item/carrier/fit descriptors, subject to schema reconciliation:
- body zones / sides / actual layer depths and collision volumes;
- carrier mount keys, provider IDs, short/long item envelopes, item category and sheathing/edge requirements;
- inner/outer mount position; flexible/rigid coverage and opening path;
- relative access class (ready, accessible with manipulation, inaccessible), draw orientation and arm-clearance restrictions;
- exposure/concealment class for observers, separate from tool/weapon mechanics;
- pocket/case finite capacity, closure, safety, retention and actual per-instance contents;
- exceptions for explicitly designed integrated plate/armor holsters, not all armor of one category;
- aggregate encumbrance/interference and damage/exposure to environment.

**Do not create a second item registry:** canonical item keys remain `items.items`; future container templates and armor/weapon profiles require existing owner reconciliation. An equipped garment/holster is a specific physical carrier, while each item is a unique physical item or separately approved stack/bundle. Runtime records *current* mount contents, visibility, draw state, access, wear and receipts; static profiles record permissible physical capabilities only. Combat/stealth detection and timing belong to their own action owners. No fabricated numeric stealth/draw modifiers, weight, capacity or new item keys are accepted by this document.

**Tool vs weapon identity:** `throwing_dart` / `throwing_knife` are already weapon-class; needles remain tool-class; `skinning_knife` has a native right-weapon fit but no authored combat useProfile. Concealed carrying cannot itself grant a combat action.

## 8. Data batches and required acceptance tests

**H0 source-backed pilot:** inspect a small handful of exact existing items: `wrist_bracer`, `utility_belt`, `travel_cloak`, `backpack`, `plate_greaves`, `travel_pouch`, `throwing_dart`, `throwing_knife`, `surgical_needle`, `tailor_needle`, `skinning_knife`. Decide the initial provider and safe object before any schema. Do not pretend a canonical full gauntlet currently exists.

**H1 focused compatibility:** one soft sleeve/holster and one deliberately obstructing rigid armor/garment example, proving allowed, exposed, concealed, blocked and slower states with explicit real clearance. Explicitly reject unprovided mounts and impossible under-plate access.

**H2 item identity and timing:** one attached weapon/tool and carrier changing location/removal/trade, no duplication, full bag or failed return, one-watch whole preset change vs single quick draw, hold/hand conflicts, interrupted action, exact Save/restart and duplicate/stale receipts.

**H3 concealment and observation:** an observable holster vs cloak-covered case vs specialized hidden mount. Detection is an action/context result, not a boolean item invulnerability flag. Armor surface mounting may be physically valid but exposed.

**H4 broaden only after owner acceptance:** thigh rigs, independent hip holsters, back/pack sling combinations, integrated arm/leg armor mounts, darts/needle cases, profession kits, cloak pockets, NPC search/theft/legal custody and combat readied weapons.

Necessary versioned owner change remains held behind unselected native v3 account/terminal/recovery/selected Save. Do not merge this into native PR #41 or start gameplay, item-content, schema, UI or Save mutation. **HOLD_NAMED_CONSUMER**, parent connector draft PR #40. Source overlap: unique Markdown path only; shared branch register disposition must be reconciled by a coordination-owned checkpoint. Validate full source and run tests through authenticated checkout before any source/physical schema activation.
