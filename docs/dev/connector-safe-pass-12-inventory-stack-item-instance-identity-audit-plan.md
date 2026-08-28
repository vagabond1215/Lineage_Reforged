# Connector-Safe Pass 12 - Inventory Stack And Item Instance Identity Audit

Date: 2026-08-27

Status: ACTIVE

Execution surface: ChatGPT via GitHub Connector; documentation-only/read-only repository inspection

Source head: `e65c562a05a8a9b842ec91dd9bf0550e948f8509`

Active route protected: `Integrated Gameplay 0.7 Band-Entry Readiness Decision`

## Purpose

Map current player inventory stack identity and determine which future item distinctions would require differentiated stacks or unique item instances, without changing runtime behavior.

## Questions

1. What fields currently identify one runtime inventory stack?
2. Which current mutation helpers compare or merge stacks by item id/key, quantity, bag, durability, or other state?
3. Does current runtime support per-stack or per-item durability, condition, quality, ownership, binding, provenance, crafter identity, stolen state, enchantment, spoilage, charges, or custom naming?
4. Which static item fields must never be mistaken for runtime instance state?
5. Which future systems—quest rewards, loot, crafting, repair, salvage, inheritance/heirlooms, equipment, vendors—would require identity stronger than current stacks?
6. What is the smallest future distinction among fungible stack, differentiated stack, and unique item instance?
7. What save/persistence/migration implications would stronger identity have?
8. Which product decisions remain genuinely open after repository evidence is exhausted?

## Success Criteria

- exact current stack/container/equipment identity posture documented;
- static item authority separated from mutable inventory state;
- existing differentiated fields characterized without inventing new ones;
- future identity-strength triggers recorded;
- no runtime/schema/content/test/save change;
- no conclusion that inventory is required for the active 0.7 band-entry slice.

## Expected Output

- `docs/design/inventory-stack-and-item-instance-identity-audit.md`;
- completion appendix in this plan.
