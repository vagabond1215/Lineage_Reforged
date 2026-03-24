import {
  resolvePlayerResources,
  type EquipmentSlotId,
  type EquippedItemRef,
  type InventoryBag,
  type InventoryStack,
  type PlayerSkillState,
  type SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import type { DetailGroup, ListItem, SidebarItem, TagTone } from '../types.js';

export type CharacterInventoryCategory =
  | 'all'
  | 'weapon'
  | 'armor'
  | 'accessory'
  | 'consumable'
  | 'tool'
  | 'document'
  | 'material'
  | 'other';

export type CharacterInventorySort = 'default' | 'name' | 'quantity' | 'category' | 'favorites';

export type CharacterPanelNotice = {
  tone: TagTone;
  title: string;
  detail: string;
};

export type CharacterDetailCardData = {
  title: string;
  summary: string;
  groups: DetailGroup[];
};

export type InventoryEntry = {
  id: string;
  itemId: string;
  itemKey: string;
  title: string;
  quantity: number;
  location: 'bag' | 'overflow';
  containerId: string;
  containerLabel: string;
  containerIndex: number;
  stackIndex: number;
  category: Exclude<CharacterInventoryCategory, 'all'>;
  preferredSlotId: EquipmentSlotId | null;
  detail: CharacterDetailCardData;
};

export type EquipmentEntry = {
  id: string;
  slotId: EquipmentSlotId;
  slotLabel: string;
  item: EquippedItemRef | null;
  itemTitle: string;
  category: Exclude<CharacterInventoryCategory, 'all'>;
  detail: CharacterDetailCardData;
};

const TRACKED_SKILL_PREFIX = 'ui.character.tracked-skill.';
const FAVORITE_ITEM_PREFIX = 'ui.character.favorite-item.';
const ITEM_STASH_PREFIX = 'ui.character.item-stash.';

const EQUIPMENT_SLOT_LABELS: Record<EquipmentSlotId, string> = {
  'slot.weapon.left': 'Weapon Left',
  'slot.weapon.right': 'Weapon Right',
  'slot.armor.head': 'Head',
  'slot.armor.shoulder': 'Shoulder',
  'slot.armor.chest': 'Chest',
  'slot.armor.arm': 'Arm',
  'slot.armor.hand': 'Hands',
  'slot.armor.waist': 'Waist',
  'slot.armor.leg': 'Legs',
  'slot.armor.foot': 'Feet',
  'slot.accessory.ear': 'Ear',
  'slot.accessory.eyes': 'Eyes',
  'slot.accessory.neck': 'Neck',
  'slot.accessory.arms': 'Arms',
  'slot.accessory.fingers': 'Fingers',
  'slot.accessory.waist': 'Accessory Waist',
  'slot.accessory.ankle': 'Ankle'
};

const EQUIPPABLE_ITEM_SLOT_HINTS: Partial<Record<string, EquipmentSlotId>> = {
  wayfinder_knife: 'slot.weapon.right',
  militia_sword: 'slot.weapon.right',
  deck_hook: 'slot.weapon.right',
  surveyor_cutlass: 'slot.weapon.right',
  militia_brigandine: 'slot.armor.chest',
  shipwright_harness: 'slot.armor.chest',
  oilskin_coat: 'slot.armor.chest',
  craft_gloves: 'slot.armor.hand',
  apprentice_focus: 'slot.accessory.neck',
  trade_ledger: 'slot.accessory.arms',
  field_chart_case: 'slot.accessory.waist',
  waterproof_chart_case: 'slot.accessory.waist'
};

function humanizeId(value: string | null | undefined): string {
  if (!value) {
    return 'Unknown';
  }

  const segments = value.split('.');
  const lastSegment = segments[segments.length - 1] ?? value;

  return lastSegment
    .split('_')
    .filter((segment) => segment.length > 0)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(' ');
}

function getFlagValue(prefix: string, value: string): string {
  return `${prefix}${value}`;
}

function getTrackedSkillFlag(flags: string[]): string | null {
  return flags.find((flag) => flag.startsWith(TRACKED_SKILL_PREFIX)) ?? null;
}

function getTrackedSkillId(flags: string[]): string | null {
  return getTrackedSkillFlag(flags)?.slice(TRACKED_SKILL_PREFIX.length) ?? null;
}

function removeFlagWithPrefix(flags: string[], prefix: string): string[] {
  return flags.filter((flag) => !flag.startsWith(prefix));
}

function toggleTrackedSkillFlags(flags: string[], skillId: string): string[] {
  const existingSkillId = getTrackedSkillId(flags);
  const withoutTracked = removeFlagWithPrefix(flags, TRACKED_SKILL_PREFIX);

  if (existingSkillId === skillId) {
    return withoutTracked;
  }

  return [...withoutTracked, getFlagValue(TRACKED_SKILL_PREFIX, skillId)];
}

function isFavoriteItem(flags: string[], itemKey: string): boolean {
  return flags.includes(getFlagValue(FAVORITE_ITEM_PREFIX, itemKey));
}

function toggleFavoriteItemFlags(flags: string[], itemKey: string): string[] {
  const favoriteFlag = getFlagValue(FAVORITE_ITEM_PREFIX, itemKey);

  if (flags.includes(favoriteFlag)) {
    return flags.filter((flag) => flag !== favoriteFlag);
  }

  return [...flags, favoriteFlag];
}

function stashItemFlag(item: EquippedItemRef): string {
  return `${ITEM_STASH_PREFIX}${item.itemId}.${encodeURIComponent(JSON.stringify(item))}`;
}

function clearStashedItemFlags(flags: string[], itemId: string): string[] {
  return flags.filter((flag) => !flag.startsWith(`${ITEM_STASH_PREFIX}${itemId}.`));
}

function stashItem(flags: string[], item: EquippedItemRef): string[] {
  return [...clearStashedItemFlags(flags, item.itemId), stashItemFlag(item)];
}

function restoreStashedItem(flags: string[], itemId: string): EquippedItemRef | null {
  const stashFlag = flags.find((flag) => flag.startsWith(`${ITEM_STASH_PREFIX}${itemId}.`));

  if (!stashFlag) {
    return null;
  }

  const encodedPayload = stashFlag.slice(`${ITEM_STASH_PREFIX}${itemId}.`.length);

  try {
    return JSON.parse(decodeURIComponent(encodedPayload)) as EquippedItemRef;
  } catch {
    return null;
  }
}

function inferEquipmentSlot(itemKey: string): EquipmentSlotId | null {
  const directMatch = EQUIPPABLE_ITEM_SLOT_HINTS[itemKey];

  if (directMatch) {
    return directMatch;
  }

  if (
    itemKey.includes('sword') ||
    itemKey.includes('knife') ||
    itemKey.includes('cutlass') ||
    itemKey.includes('hook')
  ) {
    return 'slot.weapon.right';
  }

  if (
    itemKey.includes('brigandine') ||
    itemKey.includes('coat') ||
    itemKey.includes('harness')
  ) {
    return 'slot.armor.chest';
  }

  if (itemKey.includes('glove')) {
    return 'slot.armor.hand';
  }

  if (itemKey.includes('focus')) {
    return 'slot.accessory.neck';
  }

  if (itemKey.includes('ledger')) {
    return 'slot.accessory.arms';
  }

  if (itemKey.includes('case')) {
    return 'slot.accessory.waist';
  }

  return null;
}

function getItemCategory(itemKey: string): Exclude<CharacterInventoryCategory, 'all'> {
  const hintedSlot = inferEquipmentSlot(itemKey);

  if (hintedSlot?.startsWith('slot.weapon')) {
    return 'weapon';
  }

  if (hintedSlot?.startsWith('slot.armor')) {
    return 'armor';
  }

  if (hintedSlot?.startsWith('slot.accessory')) {
    return 'accessory';
  }

  if (
    itemKey.includes('ration') ||
    itemKey.includes('bandage') ||
    itemKey.includes('fish') ||
    itemKey.includes('food')
  ) {
    return 'consumable';
  }

  if (
    itemKey.includes('tool') ||
    itemKey.includes('rope') ||
    itemKey.includes('whetstone') ||
    itemKey.includes('chalk') ||
    itemKey.includes('scale')
  ) {
    return 'tool';
  }

  if (
    itemKey.includes('ledger') ||
    itemKey.includes('grimoire') ||
    itemKey.includes('contract') ||
    itemKey.includes('note') ||
    itemKey.includes('ink')
  ) {
    return 'document';
  }

  if (
    itemKey.includes('thread') ||
    itemKey.includes('sample') ||
    itemKey.includes('vial')
  ) {
    return 'material';
  }

  return 'other';
}

function buildInventoryDetail(entry: InventoryEntry, favorite: boolean): CharacterDetailCardData {
  return {
    title: entry.title,
    summary: `${entry.title} is currently stored in ${entry.containerLabel} and can be inspected or prepared for equipment from the live character interface.`,
    groups: [
      {
        title: 'Stack Record',
        entries: [
          { label: 'Item Ref', value: entry.itemId },
          { label: 'Item Key', value: entry.itemKey },
          { label: 'Container', value: entry.containerLabel },
          { label: 'Quantity', value: entry.quantity.toString() }
        ]
      },
      {
        title: 'Gameplay Hooks',
        entries: [
          { label: 'Category', value: humanizeId(entry.category) },
          {
            label: 'Equip Slot',
            value: entry.preferredSlotId ? EQUIPMENT_SLOT_LABELS[entry.preferredSlotId] : 'No current equip mapping'
          },
          { label: 'Favorite', value: favorite ? 'Yes' : 'No' },
          {
            label: 'Use Action',
            value: entry.category === 'consumable' ? 'Reserved for a future item-use hook' : 'Not a consumable',
            tone: entry.category === 'consumable' ? 'warning' : 'neutral'
          }
        ]
      }
    ]
  };
}

function buildEquipmentDetail(entry: EquipmentEntry, favorite: boolean): CharacterDetailCardData {
  if (!entry.item) {
    return {
      title: entry.slotLabel,
      summary: `${entry.slotLabel} is currently empty. Equip a compatible inventory item to fill it.`,
      groups: [
        {
          title: 'Slot State',
          entries: [
            { label: 'Slot Ref', value: entry.slotId },
            { label: 'Category', value: humanizeId(entry.category) },
            { label: 'Occupancy', value: 'Empty' }
          ]
        }
      ]
    };
  }

  return {
    title: entry.itemTitle,
    summary: `${entry.itemTitle} is equipped in ${entry.slotLabel} and its effects are already reflected in the live character snapshot.`,
    groups: [
      {
        title: 'Equipment Record',
        entries: [
          { label: 'Item Ref', value: entry.item.itemId },
          { label: 'Item Key', value: entry.item.itemKey },
          { label: 'Slot', value: entry.slotLabel },
          { label: 'Quantity', value: entry.item.quantity.toString() },
          {
            label: 'Durability',
            value: entry.item.durability !== undefined ? `${Math.round(entry.item.durability * 100)}%` : 'N/A'
          }
        ]
      },
      {
        title: 'Gameplay Hooks',
        entries: [
          { label: 'Favorite', value: favorite ? 'Yes' : 'No' },
          {
            label: 'Unequip',
            value: 'Moves the item back into carried inventory and recalculates current resources.'
          },
          {
            label: 'Bag Metadata',
            value: 'Durability and modifier detail persist while stashed through session flags until a fuller inventory item schema exists.',
            tone: 'warning'
          }
        ]
      }
    ]
  };
}

function buildSkillDetail(skill: PlayerSkillState, tracked: boolean): CharacterDetailCardData {
  return {
    title: humanizeId(skill.id),
    summary: `${humanizeId(skill.id)} is part of the active character build and can be marked for quick attention during the current campaign.`,
    groups: [
      {
        title: 'Skill State',
        entries: [
          { label: 'Skill Ref', value: skill.id },
          { label: 'Rank', value: skill.rank.toString() },
          { label: 'Source', value: humanizeId(skill.source) },
          { label: 'Tracked', value: tracked ? 'Yes' : 'No' }
        ]
      }
    ]
  };
}

function buildTraitEffectDetail(
  title: string,
  subtitle: string,
  entries: DetailGroup[]
): CharacterDetailCardData {
  return {
    title,
    summary: `${title} is part of the current personal identity or active effect layer shown in the live character interface.`,
    groups: [
      {
        title: 'Classification',
        entries: [{ label: 'Type', value: subtitle }]
      },
      ...entries
    ]
  };
}

function cloneInventory(snapshot: SaveSnapshot): SaveSnapshot['playerState']['inventory'] {
  return {
    bags: snapshot.playerState.inventory.bags.map((bag) => ({
      ...bag,
      stacks: bag.stacks.map((stack) => ({ ...stack }))
    })),
    overflow: snapshot.playerState.inventory.overflow.map((stack) => ({ ...stack }))
  };
}

function addStackToInventory(
  bags: InventoryBag[],
  overflow: InventoryStack[],
  stack: InventoryStack
): {
  bags: InventoryBag[];
  overflow: InventoryStack[];
} {
  for (const bag of bags) {
    const existingStack = bag.stacks.find(
      (entry) => entry.itemId === stack.itemId && entry.itemKey === stack.itemKey
    );

    if (existingStack) {
      existingStack.quantity += stack.quantity;
      return { bags, overflow };
    }
  }

  const firstAvailableBag = bags.find((bag) => bag.stacks.length < bag.slotCapacity);

  if (firstAvailableBag) {
    firstAvailableBag.stacks.push({ ...stack });
    return { bags, overflow };
  }

  const overflowStack = overflow.find(
    (entry) => entry.itemId === stack.itemId && entry.itemKey === stack.itemKey
  );

  if (overflowStack) {
    overflowStack.quantity += stack.quantity;
  } else {
    overflow.push({ ...stack });
  }

  return { bags, overflow };
}

function recalculateSnapshot(
  snapshot: SaveSnapshot,
  nextEquipment: SaveSnapshot['playerState']['equipment'],
  nextInventory: SaveSnapshot['playerState']['inventory'],
  nextFlags: string[]
): SaveSnapshot {
  const resolution = resolvePlayerResources(
    {
      playerId: snapshot.playerState.playerId,
      attributes: snapshot.playerState.attributes,
      resources: snapshot.playerState.resources,
      originProfile: snapshot.playerState.originProfile,
      equipment: nextEquipment,
      resourceRuntime: snapshot.playerState.resourceRuntime
    },
    [],
    snapshot.clock.tick
  );

  return {
    ...snapshot,
    playerState: {
      ...snapshot.playerState,
      equipment: nextEquipment,
      inventory: nextInventory,
      resources: resolution.resources,
      resourceRuntime: resolution.resourceRuntime
    },
    sessionState: {
      ...snapshot.sessionState,
      flags: nextFlags
    }
  };
}

export function buildCharacterSectionItems(
  counts: {
    attributes: number;
    skills: number;
    equipment: number;
    inventory: number;
    traits: number;
    reputation: number;
    discoveries: number;
  }
): SidebarItem[] {
  return [
    { id: 'overview', label: 'Overview', description: 'Core progression and active session summary' },
    { id: 'attributes', label: 'Attributes', description: 'Stat breakdown and threshold bands', count: counts.attributes },
    { id: 'skills', label: 'Skills', description: 'Trainable proficiencies and tracked focus', count: counts.skills },
    { id: 'equipment', label: 'Equipment', description: 'Current loadout and slot management', count: counts.equipment },
    { id: 'inventory', label: 'Inventory', description: 'Carried items, filters, and sorting', count: counts.inventory },
    {
      id: 'traits',
      label: 'Traits / Effects',
      description: 'Identity traits, modifiers, and active conditions',
      count: counts.traits
    },
    { id: 'reputation', label: 'Reputation', description: 'Standing and unlocked influence bands', count: counts.reputation },
    { id: 'discoveries', label: 'Discoveries', description: 'Field finds and codex-linked personal record', count: counts.discoveries }
  ];
}

export function buildSkillItems(snapshot: SaveSnapshot): ListItem[] {
  const trackedSkillId = getTrackedSkillId(snapshot.sessionState.flags);

  return snapshot.playerState.skills.map((skill) => ({
    id: skill.id,
    title: humanizeId(skill.id),
    subtitle: `${skill.source === 'trained' ? 'Trained' : 'Innate'} skill`,
    meta: `Rank ${skill.rank}`,
    status: trackedSkillId === skill.id ? 'Tracked' : skill.rank >= 8 ? 'Expert' : skill.rank >= 5 ? 'Skilled' : 'Learning',
    tags: [
      skill.source === 'trained' ? 'Trained' : 'Innate',
      ...(trackedSkillId === skill.id ? ['Tracked Skill'] : [])
    ],
    detailTitle: humanizeId(skill.id),
    detailSummary: buildSkillDetail(skill, trackedSkillId === skill.id).summary,
    detailGroups: buildSkillDetail(skill, trackedSkillId === skill.id).groups
  }));
}

export function buildInventoryEntries(snapshot: SaveSnapshot): InventoryEntry[] {
  const favorites = snapshot.sessionState.flags;

  return [
    ...snapshot.playerState.inventory.bags.flatMap((bag, bagIndex) =>
      bag.stacks.map((stack, stackIndex) => {
        const category = getItemCategory(stack.itemKey);
        const title = humanizeId(stack.itemKey);
        const preferredSlotId = inferEquipmentSlot(stack.itemKey);

        return {
          id: `inventory.${bag.id}.${stack.itemId}.${stackIndex}`,
          itemId: stack.itemId,
          itemKey: stack.itemKey,
          title,
          quantity: stack.quantity,
          location: 'bag' as const,
          containerId: bag.id,
          containerLabel: bag.label,
          containerIndex: bagIndex,
          stackIndex,
          category,
          preferredSlotId,
          detail: buildInventoryDetail(
            {
              id: `inventory.${bag.id}.${stack.itemId}.${stackIndex}`,
              itemId: stack.itemId,
              itemKey: stack.itemKey,
              title,
              quantity: stack.quantity,
              location: 'bag',
              containerId: bag.id,
              containerLabel: bag.label,
              containerIndex: bagIndex,
              stackIndex,
              category,
              preferredSlotId,
              detail: {
                title,
                summary: '',
                groups: []
              }
            },
            isFavoriteItem(favorites, stack.itemKey)
          )
        };
      })
    ),
    ...snapshot.playerState.inventory.overflow.map((stack, stackIndex) => {
      const category = getItemCategory(stack.itemKey);
      const title = humanizeId(stack.itemKey);
      const preferredSlotId = inferEquipmentSlot(stack.itemKey);

      return {
        id: `inventory.overflow.${stack.itemId}.${stackIndex}`,
        itemId: stack.itemId,
        itemKey: stack.itemKey,
        title,
        quantity: stack.quantity,
        location: 'overflow' as const,
        containerId: 'overflow',
        containerLabel: 'Overflow',
        containerIndex: snapshot.playerState.inventory.bags.length,
        stackIndex,
        category,
        preferredSlotId,
        detail: buildInventoryDetail(
          {
            id: `inventory.overflow.${stack.itemId}.${stackIndex}`,
            itemId: stack.itemId,
            itemKey: stack.itemKey,
            title,
            quantity: stack.quantity,
            location: 'overflow',
            containerId: 'overflow',
            containerLabel: 'Overflow',
            containerIndex: snapshot.playerState.inventory.bags.length,
            stackIndex,
            category,
            preferredSlotId,
            detail: {
              title,
              summary: '',
              groups: []
            }
          },
          isFavoriteItem(favorites, stack.itemKey)
        )
      };
    })
  ];
}

export function buildEquipmentEntries(snapshot: SaveSnapshot): EquipmentEntry[] {
  const favorites = snapshot.sessionState.flags;

  return (Object.keys(EQUIPMENT_SLOT_LABELS) as EquipmentSlotId[]).map((slotId) => {
    const item = snapshot.playerState.equipment[slotId];
    const itemKey = item?.itemKey ?? null;
    const itemTitle = itemKey ? humanizeId(itemKey) : 'Empty Slot';
    const category = slotId.startsWith('slot.weapon')
      ? 'weapon'
      : slotId.startsWith('slot.armor')
        ? 'armor'
        : 'accessory';

    const entry: EquipmentEntry = {
      id: `equipment.${slotId}`,
      slotId,
      slotLabel: EQUIPMENT_SLOT_LABELS[slotId],
      item,
      itemTitle,
      category,
      detail: {
        title: itemTitle,
        summary: '',
        groups: []
      }
    };

    entry.detail = buildEquipmentDetail(entry, itemKey ? isFavoriteItem(favorites, itemKey) : false);
    return entry;
  });
}

export function buildTraitEffectItems(snapshot: SaveSnapshot): ListItem[] {
  const traitItems = snapshot.playerState.traits.map((trait) => {
    const detail = buildTraitEffectDetail(humanizeId(trait.id), 'Trait', [
      {
        title: 'Trait State',
        entries: [
          { label: 'Trait Ref', value: trait.id },
          { label: 'Source', value: humanizeId(trait.source) },
          { label: 'Status', value: 'Active' }
        ]
      }
    ]);

    return {
      id: trait.id,
      title: humanizeId(trait.id),
      subtitle: 'Trait',
      meta: humanizeId(trait.source),
      status: 'Active',
      tags: ['Trait'],
      detailTitle: detail.title,
      detailSummary: detail.summary,
      detailGroups: detail.groups
    };
  });

  const modifierItems = snapshot.playerState.resourceRuntime.modifiers.map((modifier) => {
    const detail = buildTraitEffectDetail(modifier.label, 'Effect', [
      {
        title: 'Modifier State',
        entries: [
          { label: 'Modifier Ref', value: modifier.id },
          { label: 'Source', value: `${humanizeId(modifier.sourceType)}${modifier.sourceId ? ` / ${modifier.sourceId}` : ''}` },
          {
            label: 'Expires',
            value: modifier.expiresAtTick === undefined || modifier.expiresAtTick === null
              ? 'Persistent'
              : `Tick ${modifier.expiresAtTick}`
          }
        ]
      },
      {
        title: 'Notes',
        entries: (modifier.notes?.length ? modifier.notes : ['No authored notes']).map((note) => ({
          label: 'Note',
          value: note
        }))
      }
    ]);

    return {
      id: modifier.id,
      title: modifier.label,
      subtitle: 'Active Effect',
      meta: humanizeId(modifier.sourceType),
      status: 'Modifier',
      tags: ['Effect'],
      detailTitle: detail.title,
      detailSummary: detail.summary,
      detailGroups: detail.groups
    };
  });

  const passiveEffectItems = snapshot.playerState.activeEffects
    .filter((label) => !modifierItems.some((item) => item.title === label))
    .map((label, index) => {
      const detail = buildTraitEffectDetail(label, 'Effect', [
        {
          title: 'Effect State',
          entries: [
            { label: 'Label', value: label },
            { label: 'Source', value: 'Snapshot active effect list' }
          ]
        }
      ]);

      return {
        id: `effect.active.${index}`,
        title: label,
        subtitle: 'Active Effect',
        meta: 'Snapshot',
        status: 'Active',
        tags: ['Effect'],
        detailTitle: detail.title,
        detailSummary: detail.summary,
        detailGroups: detail.groups
      };
    });

  return [...traitItems, ...modifierItems, ...passiveEffectItems];
}

export function getInventoryCategories(entries: InventoryEntry[]): CharacterInventoryCategory[] {
  return [
    'all',
    ...Array.from(new Set(entries.map((entry) => entry.category))).sort((left, right) =>
      left.localeCompare(right)
    )
  ];
}

export function sortInventoryEntries(
  entries: InventoryEntry[],
  sort: CharacterInventorySort,
  favoriteItemKeys: Set<string>
): InventoryEntry[] {
  const nextEntries = [...entries];

  if (sort === 'default') {
    return nextEntries.sort((left, right) => {
      if (left.containerIndex !== right.containerIndex) {
        return left.containerIndex - right.containerIndex;
      }

      return left.stackIndex - right.stackIndex;
    });
  }

  if (sort === 'quantity') {
    return nextEntries.sort((left, right) => {
      if (right.quantity !== left.quantity) {
        return right.quantity - left.quantity;
      }

      return left.title.localeCompare(right.title);
    });
  }

  if (sort === 'category') {
    return nextEntries.sort((left, right) => {
      if (left.category !== right.category) {
        return left.category.localeCompare(right.category);
      }

      return left.title.localeCompare(right.title);
    });
  }

  if (sort === 'favorites') {
    return nextEntries.sort((left, right) => {
      const leftFavorite = favoriteItemKeys.has(left.itemKey) ? 1 : 0;
      const rightFavorite = favoriteItemKeys.has(right.itemKey) ? 1 : 0;

      if (rightFavorite !== leftFavorite) {
        return rightFavorite - leftFavorite;
      }

      return left.title.localeCompare(right.title);
    });
  }

  return nextEntries.sort((left, right) => left.title.localeCompare(right.title));
}

export function getFavoriteItemKeys(snapshot: SaveSnapshot): Set<string> {
  return new Set(
    snapshot.sessionState.flags
      .filter((flag) => flag.startsWith(FAVORITE_ITEM_PREFIX))
      .map((flag) => flag.slice(FAVORITE_ITEM_PREFIX.length))
  );
}

export function getTrackedSkill(snapshot: SaveSnapshot): string | null {
  return getTrackedSkillId(snapshot.sessionState.flags);
}

export function toggleFavoriteItem(snapshot: SaveSnapshot, itemKey: string): SaveSnapshot {
  return {
    ...snapshot,
    sessionState: {
      ...snapshot.sessionState,
      flags: toggleFavoriteItemFlags(snapshot.sessionState.flags, itemKey)
    }
  };
}

export function toggleTrackedSkill(snapshot: SaveSnapshot, skillId: string): SaveSnapshot {
  return {
    ...snapshot,
    sessionState: {
      ...snapshot.sessionState,
      flags: toggleTrackedSkillFlags(snapshot.sessionState.flags, skillId)
    }
  };
}

export function equipInventoryItem(
  snapshot: SaveSnapshot,
  entry: InventoryEntry
): {
  snapshot: SaveSnapshot;
  notice: CharacterPanelNotice;
} {
  if (!entry.preferredSlotId) {
    return {
      snapshot,
      notice: {
        tone: 'warning',
        title: 'No Equip Mapping',
        detail: `${entry.title} does not yet have a stable equipment slot mapping in the current UI layer.`
      }
    };
  }

  const nextInventory = cloneInventory(snapshot);
  const nextFlags = [...snapshot.sessionState.flags];
  let selectedStack: InventoryStack | null = null;

  if (entry.location === 'overflow') {
    const stack = nextInventory.overflow[entry.stackIndex];

    if (!stack) {
      return {
        snapshot,
        notice: {
          tone: 'warning',
          title: 'Inventory Changed',
          detail: 'That stack is no longer available.'
        }
      };
    }

    selectedStack = { ...stack, quantity: 1 };

    if (stack.quantity > 1) {
      nextInventory.overflow[entry.stackIndex] = {
        ...stack,
        quantity: stack.quantity - 1
      };
    } else {
      nextInventory.overflow.splice(entry.stackIndex, 1);
    }
  } else {
    const bag = nextInventory.bags.find((candidate) => candidate.id === entry.containerId);
    const stack = bag?.stacks[entry.stackIndex];

    if (!bag || !stack) {
      return {
        snapshot,
        notice: {
          tone: 'warning',
          title: 'Inventory Changed',
          detail: 'That stack is no longer available.'
        }
      };
    }

    selectedStack = { ...stack, quantity: 1 };

    if (stack.quantity > 1) {
      bag.stacks[entry.stackIndex] = {
        ...stack,
        quantity: stack.quantity - 1
      };
    } else {
      bag.stacks.splice(entry.stackIndex, 1);
    }
  }

  if (!selectedStack) {
    return {
      snapshot,
      notice: {
        tone: 'warning',
        title: 'Equip Failed',
        detail: 'The selected stack could not be resolved from the active inventory.'
      }
    };
  }

  const restoredItem = restoreStashedItem(nextFlags, selectedStack.itemId);
  const equippedItem: EquippedItemRef = restoredItem ?? {
    itemId: selectedStack.itemId,
    itemKey: selectedStack.itemKey,
    quantity: 1
  };
  const nextEquipment = {
    ...snapshot.playerState.equipment
  };
  const displacedItem = nextEquipment[entry.preferredSlotId];

  nextEquipment[entry.preferredSlotId] = equippedItem;

  let finalFlags = clearStashedItemFlags(nextFlags, selectedStack.itemId);

  if (displacedItem) {
    const inventoryResult = addStackToInventory(
      nextInventory.bags,
      nextInventory.overflow,
      {
        itemId: displacedItem.itemId,
        itemKey: displacedItem.itemKey,
        quantity: displacedItem.quantity
      }
    );

    nextInventory.bags = inventoryResult.bags;
    nextInventory.overflow = inventoryResult.overflow;
    finalFlags = stashItem(finalFlags, displacedItem);
  }

  return {
    snapshot: recalculateSnapshot(snapshot, nextEquipment, nextInventory, finalFlags),
    notice: {
      tone: 'success',
      title: 'Item Equipped',
      detail: `${entry.title} is now equipped in ${EQUIPMENT_SLOT_LABELS[entry.preferredSlotId]}.`
    }
  };
}

export function unequipItem(
  snapshot: SaveSnapshot,
  entry: EquipmentEntry
): {
  snapshot: SaveSnapshot;
  notice: CharacterPanelNotice;
} {
  if (!entry.item) {
    return {
      snapshot,
      notice: {
        tone: 'warning',
        title: 'Slot Already Empty',
        detail: `${entry.slotLabel} does not currently hold an item.`
      }
    };
  }

  const nextInventory = cloneInventory(snapshot);
  const inventoryResult = addStackToInventory(
    nextInventory.bags,
    nextInventory.overflow,
    {
      itemId: entry.item.itemId,
      itemKey: entry.item.itemKey,
      quantity: entry.item.quantity
    }
  );
  const nextEquipment = {
    ...snapshot.playerState.equipment,
    [entry.slotId]: null
  };
  const nextFlags = stashItem(snapshot.sessionState.flags, entry.item);

  nextInventory.bags = inventoryResult.bags;
  nextInventory.overflow = inventoryResult.overflow;

  return {
    snapshot: recalculateSnapshot(snapshot, nextEquipment, nextInventory, nextFlags),
    notice: {
      tone: 'success',
      title: 'Item Unequipped',
      detail: `${entry.itemTitle} was moved back into inventory from ${entry.slotLabel}.`
    }
  };
}
