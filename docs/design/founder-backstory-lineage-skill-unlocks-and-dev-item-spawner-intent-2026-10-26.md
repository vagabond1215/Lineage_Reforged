# Founder Backstories, Descendant Skill Unlocks, and Development Item Spawning

Date: 2026-10-26
Status: `USER_DIRECTION_CAPTURED; CONNECTOR_DESIGN_PREWORK; IMPLEMENTATION_DEFERRED`
Source inspected: `master` at `a596112acf3945f2bf7c625e943f2511d12aa710`; isolated gear foundation on `codex/gear-instance-fresh-epoch` (draft PR #20) inspected separately.
Game: `0.1.1-prealpha`; no version change or development milestone promotion.
Scope: refine the first-of-line character-creation/backstory progression contract and endorse a safe developer-only item grant interface. No runtime/code/catalog/schema/Save/UI changes are authorized by this document.

## 1. Owner direction and terms

A **first-of-the-line, non-heir founder** starts without inherited professional privilege. The founder chooses among a small selection of grounded, low-boon *origin backstories*, such as Vagabond, Exile, Outcast/Street-Raised, World-Stray (isekai), Local or other similarly unestablished origins. A founder cannot begin as a trained Village Hunter, veteran militia member, established merchant, noble scion, advanced artisan, and so on merely by creating an unrelated character or spending account-wide currency.

**Profession-flavored backstory availability is earned by play and inherited as an option by all verified downstream descendants of the qualifying character**, not by unrelated characters on the same account. Example: the first character gains the requisite hunting/archery/field skill competence in live play; once an authoritative earned-evidence predicate is met, their descendants can select the Hunter/Village Hunter formative background when creating/starting those later playable characters. A new descendant does **not** automatically inherit the ancestor's full skill ranks, equipment, achievements, employment or magic abilities. They inherit **access to a coherent upbringing/backstory**, with restrained starter familiarity. Backstory is never a locked profession/class.

Terminology: distinguish **species/ancestry lineage IDs** (such as `lineage.human`) from the **individual family/descendant chain**. A shared species, account, surname or generic `familyId` alone is insufficient to prove descent from the particular unlock source. Use explicit ancestor-to-descendant relationships or a proven source-run/parentage graph. A subsequent new unrelated founder on the same account returns to founder options.

## 2. Current implementation and gaps (verified)

- `packages/content/base/player/backstories.json` contains **27** live backstories. Default-origin Local, Vagabond and Exile currently grant four/five level-25 starter skills and `+1/-1` attribute adjustments; **they are not currently low/no-boon founders**. Amnesiac and Farmhand similarly grant sizable skills. World-Stray (`backstory.isekai_outcast`) is a **special** origin with its own existing skills, not presently a default.
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts` currently supplies five default IDs (Local, Vagabond, Exile, Farmhand, Amnesiac) and `always_available` Street-Raised. Village Hunter is presently an evidence-plus-`legacy.backstory.village_hunter` purchase rule; the user-desired earned descendant access **must not require a separate account-wide Legacy purchase** unless later explicitly requested.
- The existing pure `resolveBackstoryEligibility` already has family, lineage and source-run evidence vocabulary. The creator's `buildBackstoryEligibilityEvidenceInput` in `characterCreationCatalog.ts` currently wires account/source-run IDs and Legacy purchases, **not** family ID, target descendant ancestry or archived source-labeled earned-skill maxima. The core resolver cannot infer parentage from current UI fields. The policy metadata under `docs/design/backstory-policy-metadata.json` is **non-runtime**; do not import it directly.
- The 2026-05 planning decisions `backstory-tiered-lane-design.md`, `backstory-eligibility-resolver-plan.md` and `backstory-evidence-ownership-plan.md` already forbid class gates, stacked starter bonuses, unrelated-family unlock leakage and starter-granted skills as earned progression. This decision **narrows/defaults the founder policy** and selects automatic descendant-scope skill-earned unlocks for ordinary occupational backstories, rather than replacing those boundaries.
- `offspring-heir-family-continuity-owner-plan.md` requires real offspring/adoption and heir authority before a playable family continuation exists. The founder may accumulate **pending ancestry-scoped achievements** without inventing a fully formed playable heir or family record.
- There are also **seven separate starting equipment bundles**, including `starting_bundle.hunter`, `warrior` and `arcanist`; these are not backstory IDs. The creator must inspect whether starter gear/ability bonuses effectively circumvent the intended low-boon founder start even after backstories are gated. Do not silently lock all ordinary hunting equipment or prohibit learning hunting in game.

## 3. Backstory availability contract

### Founder default pool

- Candidate low-benefit origins: Local, Vagabond, Exile, Street-Raised/Outcast, Amnesiac, and World-Stray/isekai (narrative presentation must avoid unexplained rule-breaking world knowledge).
- **Candidate** does not mean every one is immediately authorized unchanged. Review World-Stray's `special` story semantics before making it a basic selectable founder origin; remove any starter knowledge/attribute edge not supported by the zero/near-zero founder policy. The user's examples are authoritative tone and direction; exact names and final availability need catalog/setting review.
- Founder backstory grants should be primarily descriptive, with no automatic combat ability, professional skill level 25 package, significant starting attribute advantage, institutional standing, rare gear, guaranteed social permission, free backstory Legacy purchases, or unearned progression shortcut. A narrowly approved 0–5-level familiarity grant, balanced trivial adjustment, or non-powerful story hook is possible but optional; default to no meaningful boon.
- Keep more than one distinct non-elite option for playable character creation. No mandatory isekai origin; ordinary settlement origin should remain viable. Cultural/world-start rules still apply.

### Descendant profession path

- Author data-driven per-backstory **earned skill** requirements, optionally complemented by relevant verified activity/source-run evidence when needed. For Village Hunter, candidates are hunting plus archery and a field craft such as trapping or butchering; exact skill IDs/thresholds await progression-rate and evidence-owner review. Do not use starter-granted skills, dev-granted skill ranks, free character creation choices, or account-wide purchase alone to meet them.
- Unlock event has a durable `sourceCharacterId` / source-run, qualifying earned evidence, backstory ID, event/chronicle provenance and an ancestry chain it may flow through. A descendant may benefit whether the ancestor is alive or archived, provided the authoritative relation and earned unlock were committed. A sibling/cousin outside that source's descendant branch does not inherit purely because a family/group ID matches.
- For every **future playable descendant**, the creator checks whether **any ancestor** in the verified parent/descendant path earned the unlock. The eligible backstory need not be personally learned by each generation; once qualified, it propagates down that actual branch. A later unrelated founder or parallel non-descendant branch does not acquire it.
- Unlocks affect **availability at the new character creation/selection boundary** only. Do not retroactively rewrite a pre-existing character's chosen origin, grant a current character skills or reproduce old starter packages. Selecting Hunter does not prevent choosing a different profession or gaining other skills.
- One selected backstory per new character; no stacking. Backstory-granted starter ranks (if any) must stay far below earned character expertise and cannot themselves trigger the next family unlock. Optional future cap/growth bonuses have their own explicit source-aware limits.
- Real inherited social status, noble title, guild membership, estate, adoption or marriage-based origins require their relevant owner-backed facts; never derive them merely from generic earned skill thresholds.

### Example lifecycle (illustrative, not an approved numeric balance)

`Founder (Vagabond) → earns Hunting, Archery, Butchering/Trapping through ordinary play → accepted Hunter-origin unlock bound to founder's source character/run → verified child/heir → Hunter origin selectable → future descendant on this chain also eligible`.

Numbers for skill requirements and bonus ceilings must be grounded in the accepted skill-growth system and current authored content, not arbitrary thresholds minted by this document.

## 4. Developer item-spawn proposal: yes, but sandboxed

A **developer-only item grant/spawn tool is useful and recommended**, especially during the native gear-instance and equipment UI cutover. It should exercise the **same authoritative item grant/location contract** as gameplay and accelerate testing of all armors, weapons, clothing, paired accessories, rings, Back equipment, item durability and real bag/overflow behavior. It is **not** a player cheat item duplication path or a replacement for real-caller tests.

Proposed access and behavior:

- Prefer a separately gated **development/test build** plus explicit debug mode/authorized QA identity; never ship an always-active public production command. Use clear debug UI/command names, e.g. `Developer Tools → Item Grant`.
- Search validated canonical item catalog ID (not arbitrary text/name-only), show category and supported authored fit; choose quantity for fungible stacks, or create **N independent instance IDs** for non-fungible gear. Allow a controlled per-instance durability/condition input and destinations **Bag / Overflow / Worn** only when the new owner can validate them. No item with undefined identity or unsupported fit should sneak past owner rules.
- Issue one authorized grant command with unique request ID, actor and dev provenance, revision and idempotent receipt. Enforce bag space, occupancy, validation and Save/restart; no direct manual insertion into `playerState.equipment`, item-type stash session flags, JSON editor, or creator-only duplicate ledger.
- Isolate the resulting QA campaign/test account and mark it `development_modified` or equivalent in durable owner-backed run evidence. Exclude developer-generated equipment and *development-granted skills/evidence* from legitimate family backstory unlocks, Chronicle achievements, progression validation, prestige, estate/bequests and release acceptance. A source tag alone is insufficient if gameplay gains from a spawned overpowered item could still qualify; prefer entirely separate QA save/account namespace.
- Build/dev UI shows unmistakable debug state and offers reset/recreate test fixtures safely; no silent production-side toggling or automatic destruction of a real campaign. Document explicit opt-in and retention.
- Begin with an **item-only** spawner. Spawn enemies, grant XP/ranks, adjust clock/weather, force backstory inheritance and other QA commands should require separate scoped owner-backed test controls. Test fixture scripts may be more reliable than manual UI for deterministic assertions.

Timing: the developer tool is best implemented **after the fresh gear owner and new Save path are active**, or as narrowly scoped harness fixtures that use the same owner on an isolated test branch. Do not introduce a second manual gear ledger while PR #20 is still non-integrated.

## 5. Cross-owner and testing requirements

| Consumer / invariant | Test at implementation |
| --- | --- |
| Fresh non-heir founder vs unrelated new founder | Only basic options; no inherited professional entitlement from shared account/species ID |
| Backstory balance | Chosen founder grants no meaningful profession-level starter ranks, abilities or unintended bundle-driven advantage |
| Source-only skill evidence | Starter-granted and dev-granted ranks do not count as earned family progression; genuine earned skill rank does |
| Hunter qualification | Exact accepted predicate unlocks Hunter for founder's verified children/grandchildren/other downstream branch |
| No collateral unlocks | Ancestors, unrelated families, siblings/other branches and unlinked source-run aliases remain locked |
| Choice semantics | Eligible descendant may select exactly one backstory; no stacking or retroactive current-character rewrite |
| Snapshot/archival | Qualifying unlock, ancestry, provenance and selected descendant origin survive new-format Save/restart and archive/replay |
| Story/estate/institution | Family skill unlock cannot invent title, wardship, professional employment, social rank or playable heir |
| Starting bundles | Audit initial `starting_bundle.hunter` and other profession packs against low-boon founder constraints; allow normal in-game acquisition |
| Developer item grant | Native instance identity, per-item durability, capacity/displacement, repeated request, malformed ID and save/restart exercised |
| Debug isolation | No debug-scoped item/skill and derivative QA activity leaks into legitimate achievements/family skill unlock evidence |

## 6. Integration disposition

This is a **separate future creator/Bloodlines + dev-testing route**. The current equipment development branch [PR #20](https://github.com/vagabond1215/Lineage_Reforged/pull/20) is focused on physical gear identity and its caller/Save cutover. Neither new backstory eligibility nor a developer toolbar should be opportunistically inserted into that already review-held branch. The owner may choose a later bounded implementation pass for founder balance and lineage evidence, and an independent test-tool pass for safe item grants after native gear authority is ready.

No code, authored backstory JSON, runtime policy, save, production UI, selected-client behavior, Game version, current Codex prompt, or deployed Site has been changed by this connector document.
