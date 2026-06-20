# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.200 - Family Authority Boundary Decision`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/family-authority-boundary-decision.md` is the permanent authority for future authored person/household/family/kinship/lineage boundaries.
- `docs/dev/tmp-family-lineage-systems-research-2026-06-20.md` is temporary planning input, not design canon.
- Existing `AccountFamilyRecord`, Family Prestige ledger, account estate state, source-run inheritance, and Bloodlines presentation remain mutable account/runtime owners and are not civilization content authority.
- Current player `lineageId` is ancestry/species context and must not be used as a family or genealogical-lineage id.
- Economy and geography cross-system prerequisites remain owned by their existing boundary decisions.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.200 - Family Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.201 - Household vs Family Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.200 Result

- Selected future `civilization.households` as the first family-lane implementation candidate, starting with a docs-only schema decision.
- Assigned direct parent, spouse/partner, guardianship, adoption, and fosterage facts to future `civilization.kinship_links`.
- Kept household membership separate from kinship and required visibility, recognition/dispute, provenance, and later temporal metadata.
- Kept future families and genealogical lineages separate; current ancestry `lineageId` is not genealogical authority.
- Deferred bloodline content unless explicit world canon proves a distinct need.
- Kept estates/property separate from family identity.
- Kept static inheritance traditions and family reputation/prestige descriptive-only while preserving existing account Family Prestige ledger behavior unchanged.
- Deferred full player heirs, descendants, bequests, succession, property transfer, and legacy continuation to `0.6+`.
- Kept Family Knowledge informational pending a later subject decision.
- Changed no content, schema, validator, test, runtime, UI, storage, inheritance, prestige, estate, or gameplay behavior.

## Next Route Boundary

`Version 0.5.201 - Household vs Family Schema Decision` should remain documentation-only. It must decide collection paths and ids, authored person-reference prerequisites, household membership ownership, household/family lifecycle and place anchors, visibility/dispute/provenance metadata, validation ownership, and overlap with account families and synthetic runtime household ids.

The temporary family research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.

The deferred `Version 0.5.199 - Settlement Economy Schema Decision` and `World Map Feature Authority Schema Decision` remain valid later roadmap items.
