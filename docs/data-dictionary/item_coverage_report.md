# Item Coverage Report

Generated: 2026-03-11 13:45

This report tracks item-catalog breadth, taxonomy coverage, and market-sync integrity.

## Totals
- Item records: 114
- Market records with source=items.catalog: 114
- Taxonomy checkpoints covered: 54/54

## Class Distribution
- accessory: 13
- armor: 16
- clothing: 8
- consumable: 17
- tool: 16
- vehicle: 10
- weapon: 34

## Branch Depth
- Distinct branches: 29
- Distinct sub-branches: 55
- Single-item branches: siege, utility, wrist
- Single-item sub-branches (top signal): acid, antidote, assault, bandage, camp, cargo, climbing, elixir, exotic, fire, frost, greataxe, land, lightning, mobility, oil_flask, patrol, poison, ring, salve, scout, smoke_bomb, survey

## Taxonomy Coverage (from item tree)
- [x] Vehicles > Siege
- [x] Vehicles > Air
- [x] Vehicles > Land
- [x] Vehicles > Water
- [x] Consumables > Utility
- [x] Consumables > Meal
- [x] Consumables > Buff
- [x] Consumables > Offensive
- [x] Consumables > Restorative
- [x] Clothing > Casual
- [x] Clothing > Formal
- [x] Tools > Survival
- [x] Tools > Production
- [x] Tools > Agriculture
- [x] Tools > Combat
- [x] Tools > Combat > Smoke Bomb
- [x] Tools > Combat > Oil Flask
- [x] Tools > Combat > Trap
- [x] Tools > Combat > Net
- [x] Armor > Cloth
- [x] Armor > Leather > Light
- [x] Armor > Leather > Medium
- [x] Armor > Leather > Heavy
- [x] Armor > Metal > Plate
- [x] Armor > Metal > Ring
- [x] Armor > Metal > Scale
- [x] Armor > Shield
- [x] Weapons > Melee
- [x] Weapons > Melee > Whip
- [x] Weapons > Melee > Fan
- [x] Weapons > Melee > Chain
- [x] Weapons > Melee > Greataxe
- [x] Weapons > Melee > Mace
- [x] Weapons > Melee > Dagger
- [x] Weapons > Melee > Sword
- [x] Weapons > Melee > Greatsword
- [x] Weapons > Melee > Staff
- [x] Weapons > Melee > Axe
- [x] Weapons > Thrown
- [x] Weapons > Thrown > Star
- [x] Weapons > Thrown > Axe
- [x] Weapons > Thrown > Knife
- [x] Weapons > Thrown > Javelin
- [x] Weapons > Range
- [x] Weapons > Range > Sling
- [x] Weapons > Range > Bow
- [x] Weapons > Range > Crossbow
- [x] Weapons > Range > Blow Gun
- [x] Accessories > Earring
- [x] Accessories > Ring
- [x] Accessories > Necklace
- [x] Accessories > Face
- [x] Accessories > Belt
- [x] Accessories > Pouch

## Sync Integrity
- Items missing items.catalog market row: 0
- items.catalog rows not in item DB: 0
- Duplicate item IDs: 0
- Duplicate item keys: 0
- Duplicate market itemKey values: 0

## Expansion Opportunities (Common Sense)
- No hard taxonomy leaf gaps detected from the current reference tree.
- Increase branch redundancy where only one item exists (especially specialized sub-branches) to improve loot/crafting variety.
- Consider adding quality tiers (basic/refined/masterwork) for high-volume branches instead of only new branches.
