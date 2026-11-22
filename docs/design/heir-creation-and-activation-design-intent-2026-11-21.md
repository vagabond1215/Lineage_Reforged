# Heir creation and activation: conception, Prestige and restricted family handoff

Date: 2026-11-21
Status: owner design intent; standalone UI review only; runtime implementation deferred.

## Governing distinction

A child is a person or a conceived offspring record originating in gameplay, not an entitlement or a spare character slot. The heir system must first be unlocked through Prestige, and the progenitor must have unused heir-character capacity. A child may exist without being eligible for player use. No offspring may be fabricated from an unlocked slot, surname, account state, or family-screen action. Adult-only, non-explicit in-world source and evidence rules in the [offspring owner plan](offspring-heir-family-continuity-owner-plan.md) remain applicable. Separately authorized adoption remains deferred.

Track independently: stable offspring identity and conception/parentage evidence; birth and naming state; recognition, availability and developmental/physical maturity; progenitor lifecycle; Prestige unlock, maximum heir uses per progenitor and already-used identities. Count used heir entitlements, not children. Free capacity without a known eligible offspring creates no actionable person row. Death alone does not erase capacity or offspring evidence.

## Two distinct entry paths

| Family-screen action | Preconditions | Future handoff |
| --- | --- | --- |
| Create Heir | Existing in-game conception record; offspring is **unborn and unnamed**; unlocked heir system, unused capacity and applicable evidence/availability gates. | Restricted family character creation using the existing conception and family authority. Only choices authorized by that record may be exposed. Never create a second child, choose arbitrary parentage or use unrestricted fresh-start creation. |
| Activate Heir | Existing **born** offspring, preserved identity and available evidence; unlocked heir system and remaining per-progenitor capacity; applicable progenitor lifecycle and maturity/continuity gates. | Request authoritative time-skip or maturity waiting as applicable, and invoke restricted family creation plus inheritance resolution. Preserve established identity, relationships, developmental history and actual world conditions. Not a second naming/ordinary creator or immediate UI-only promotion. |

An unborn already-named offspring does not qualify for the Create Heir exception. A born unnamed record cannot use that exception either; naming and eligibility must resolve from its world authority, not a fabricated identity. Preview uses deceased/retired progenitor gating for born activation consistent with the existing succession review; detailed lifecycle policy, entitlement reservation timing, restricted creator options, legal recognition and exception rules require future focused owner contracts. Do not impose universal numeric age thresholds: maturity/physical functional eligibility is authoritative. A developing known offspring may support a pending succession request rather than immediate control.

## Activation orchestration intent (deferred)

1. Resolve the selected offspring and progenitor from authoritative World/family state; validate provenance, recognition/availability, prerequisites, unused capacity and prior usage.
2. Determine whether an eligibility wait or time-skip is applicable. Respect [existing World-time rules](core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md) and mode-specific clock authority. In a Living World, do not accelerate while any participating playable character remains in normal time; stop at the earliest authoritative interruption. No instant maturity guarantee or acceleration of real-time worlds by the family UI.
3. Reevaluate survival, custody, maturity, availability and eligibility after elapsed events. Reconcile actual estate assets, liabilities, claims and custody; do not invent grants or assume the estate at death stays unchanged.
4. Run the restricted family creator and inheritance engine with permitted choices and established identity fixed wherever authoritative. The exact sequence and transaction boundaries require future engineering contracts; no ordinary Core opening may overwrite a known heir's origin.
5. Only upon an accepted authoritative result, publish the linked playable character and consume the appropriate entitlement once with durable receipts. Revalidation and atomic/idempotent settlement must prevent duplicate heirs, capacity overspend, duplicate property transfers or replaying a deceased character. Failure/cancellation must not fabricate a child, award inheritance or silently advance time.

## Standalone review UI

- Nested family display lists real sample offspring records, including named born children and conceived unborn unnamed records. Do not generate numbered empty child rows from capacity. Expanded progenitor details show separate Prestige use status.
- Create Heir targets the existing unborn unnamed record only. Activate Heir targets born records; a locked unlock, exhausted limit, unavailable record, active progenitor or unknown eligibility explains the disabled control.
- Eligible actions open an explanatory, explicitly held handoff dialog. No restricted creator execution, mutation of offspring, real Prestige spending, time advancement, inheritance, or promotion to playable status is performed by this HTML. Ordinary independent creation remains preview-only with no heir entitlement by default.
- Families with playable records or an available continuation path remain in the default library; other records are accessible in Codex. This grouping is a UI projection, not proof that production family records instantiate automatically for founders. Existing family-authority and account/save boundaries remain controlling.

## Deliverable and non-goals

This is design intent, not a schema, entitlement ledger, pregnancy simulator, runtime scheduler, estate engine, inheritance implementation, Save migration, or production acceptance. It supersedes earlier standalone UI samples that treated unused capacity as creatable children or directly switched heir status to playable. Existing [family authority boundary](family-authority-boundary-decision.md), [offspring owner plan](offspring-heir-family-continuity-owner-plan.md), and [Core/succession direction](core-world-entry-hardcore-prestige-and-succession-product-direction-2026-11-09.md) remain controlling in their respective domains. Future repository-capable implementation must independently validate and integrate those owners.
