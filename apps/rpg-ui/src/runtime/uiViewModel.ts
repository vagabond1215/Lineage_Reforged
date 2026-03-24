import type {
  ChronicleEventState,
  CodexEntryState,
  PanelRecordState,
  PlayerAttributeKey,
  PlayerInventoryState,
  PlayerDiscoveryChronicleEntryState,
  PlayerOriginProfileState,
  PlayerResourceGrowthVector,
  PlayerResourceTickEntryState,
  QuestJournalEntryState,
  SaveSnapshot
} from '../../../../packages/shared/types/src/contracts.js';
import type {
  DetailGroup,
  ListItem,
  MapLocation,
  NavItem,
  OperationItem,
  SidebarItem,
  SummaryMetric
} from '../types.js';

type WindowDetail = {
  title: string;
  summary: string;
  groups: DetailGroup[];
};

type CharacterViewModel = {
  sections: SidebarItem[];
  overviewMetrics: SummaryMetric[];
  coreStats: SummaryMetric[];
  activeEffects: string[];
  roleTags: string[];
  overviewDetail: {
    title: string;
    summary: string;
    groups: DetailGroup[];
  };
  lists: Record<string, ListItem[]>;
  windowDetails: Record<string, WindowDetail>;
};

type WorldViewModel = {
  sections: SidebarItem[];
  locations: MapLocation[];
  lists: Record<string, ListItem[]>;
  windowDetails: Record<string, WindowDetail>;
};

type ActivityViewModel = {
  sections: SidebarItem[];
  metrics: SummaryMetric[];
  lists: Record<string, ListItem[]>;
  operationsQueue: OperationItem[];
  windowDetails: Record<string, WindowDetail>;
};

type CodexViewModel = {
  sections: SidebarItem[];
  entries: ListItem[];
  regionFilters: string[];
  windowDetails: Record<string, WindowDetail>;
};

type QuestsViewModel = {
  sections: SidebarItem[];
  entries: ListItem[];
  overviewMetrics: SummaryMetric[];
  windowDetails: Record<string, WindowDetail>;
};

type ChronicleViewModel = {
  sections: SidebarItem[];
  entries: ListItem[];
  windowDetails: Record<string, WindowDetail>;
};

export type UiViewModel = {
  navItems: NavItem[];
  notifications: {
    id: string;
    title: string;
    detail: string;
    time: string;
    type: 'accent' | 'success' | 'warning' | 'neutral' | 'danger';
  }[];
  topBar: {
    portraitInitials: string;
    name: string;
    region: string;
    settlement: string;
    date: string;
    season: string;
    timeOfDay: string;
    currency: string;
    trackedQuest: string;
    activityTag?: string;
  };
  topBarMeters: Array<{
    label: string;
    current: number;
    max: number;
    color: string;
  }>;
  initialPinnedIds: string[];
  character: CharacterViewModel;
  world: WorldViewModel;
  activity: ActivityViewModel;
  codex: CodexViewModel;
  quests: QuestsViewModel;
  chronicle: ChronicleViewModel;
};

const monthNames = [
  'Deepfrost',
  'Thawrise',
  'Seedcall',
  'Rainmere',
  'Suncrest',
  'Highbloom',
  'Harvestfall',
  'Redleaf',
  'Frostwane',
  'Longnight',
  'Emberwane',
  'Stormwane',
  'Yearsend'
];

const timeOfDayLabels = ['Night Watch', 'Dawn Watch', 'High Sun', 'Dusk Watch'];

const navItems: NavItem[] = [
  {
    id: 'character',
    label: 'Character',
    icon: 'character',
    accent: 'var(--color-character)',
    hint: 'Build, gear, and personal progression'
  },
  {
    id: 'world',
    label: 'World',
    icon: 'world',
    accent: 'var(--color-world)',
    hint: 'Regions, settlements, routes, and travel'
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: 'activity',
    accent: 'var(--color-activity)',
    hint: 'Workflows, jobs, businesses, and operations'
  },
  {
    id: 'codex',
    label: 'Codex',
    icon: 'codex',
    accent: 'var(--color-codex)',
    hint: 'Knowledge, discoveries, and references'
  },
  {
    id: 'quests',
    label: 'Quests',
    icon: 'quests',
    accent: 'var(--color-quests)',
    hint: 'Active objectives, contracts, and rewards'
  },
  {
    id: 'chronicle',
    label: 'Chronicle',
    icon: 'chronicle',
    accent: 'var(--color-chronicle)',
    hint: 'Historical record of events and outcomes'
  }
];

const characterSections: SidebarItem[] = [
  { id: 'overview', label: 'Overview', description: 'Progression, role identity, and active runtime state' },
  { id: 'attributes', label: 'Attributes', description: 'Base attribute values and threshold bands' },
  { id: 'skills', label: 'Skills', description: 'Known skills, rank progression, and sources' },
  { id: 'inventory', label: 'Inventory', description: 'Wallet, carried items, bag capacity, and overflow' },
  { id: 'equipment', label: 'Equipment', description: 'Equipped gear, durability, and slot usage' },
  { id: 'traits', label: 'Traits', description: 'Passive identity traits and active conditions' },
  { id: 'reputation', label: 'Reputation', description: 'Tracked standings, scores, and access effects' },
  { id: 'titles', label: 'Titles', description: 'Unlocked titles, equip state, and milestone effects' },
  { id: 'discoveries', label: 'Discoveries', description: 'Personal chronicle of found flora, fauna, minerals, items, and notes' }
];

const worldSections: SidebarItem[] = [
  { id: 'world-map', label: 'World Map', description: 'Known locations, coordinates, and map overlays' },
  { id: 'region', label: 'Region', description: 'Climate, danger, resources, and authority' },
  { id: 'settlement', label: 'Settlement', description: 'Population, services, guilds, and supply state' },
  { id: 'trade-routes', label: 'Trade Routes', description: 'Distance, risk, throughput, and route status' },
  { id: 'travel', label: 'Travel', description: 'Journey state, terrain cost, and arrival windows' },
  { id: 'local-market', label: 'Local Market', description: 'Supply, demand, pricing, and service coverage' }
];

const activitySections: SidebarItem[] = [
  { id: 'employment', label: 'Employment', description: 'Jobs, pay, schedules, and employer links' },
  { id: 'businesses', label: 'Businesses', description: 'Owned ventures, ledgers, and upgrade state' },
  { id: 'crafting', label: 'Crafting', description: 'Recipes, stations, materials, and outputs' },
  { id: 'trade', label: 'Trade', description: 'Cargo, margins, routes, and market pairing' },
  { id: 'contracts', label: 'Contracts', description: 'Issued work, lifecycle state, and payouts' },
  { id: 'military', label: 'Military', description: 'Service duties, command links, and readiness' },
  { id: 'naval', label: 'Naval', description: 'Vessels, patrols, berths, and crew assignments' },
  { id: 'operations', label: 'Operations', description: 'Concurrent processes, dependencies, and blockers' }
];

const codexSections: SidebarItem[] = [
  { id: 'flora', label: 'Flora', description: 'Plant records, habitats, uses, and region tags' },
  { id: 'fauna', label: 'Fauna', description: 'Creature records, behavior, and drop usage' },
  { id: 'minerals', label: 'Minerals', description: 'Ore, stone, rarity, and extraction notes' },
  { id: 'items', label: 'Items', description: 'Item references, utility roles, and values' },
  { id: 'recipes', label: 'Recipes', description: 'Inputs, outputs, stations, and skill ties' },
  { id: 'factions', label: 'Factions', description: 'Organizations, influence, and service access' },
  { id: 'notes', label: 'Notes', description: 'Journal notes, field briefs, and discovered clues' }
];

const questSections: SidebarItem[] = [
  { id: 'active', label: 'Active', description: 'Accepted quests with live objective progress' },
  { id: 'contracts', label: 'Contracts', description: 'Guild or market offers awaiting fulfillment' },
  { id: 'completed', label: 'Completed', description: 'Resolved quests with archived outcomes' },
  { id: 'failed', label: 'Failed', description: 'Abandoned or failed objectives and penalties' },
  { id: 'tracked', label: 'Tracked', description: 'Quest currently pinned to the top bar' }
];

const chronicleSections: SidebarItem[] = [
  { id: 'all', label: 'All', description: 'Full cross-system event timeline' },
  { id: 'combat', label: 'Combat', description: 'Battles, hazards, and damage outcomes' },
  { id: 'trade', label: 'Trade', description: 'Sales, caravans, and market movements' },
  { id: 'social', label: 'Social', description: 'Conversations, diplomacy, and civic interactions' },
  { id: 'travel', label: 'Travel', description: 'Route changes, arrivals, and movement setbacks' },
  { id: 'crafting', label: 'Crafting', description: 'Production starts, completions, and refits' },
  { id: 'discovery', label: 'Discovery', description: 'Finds, codex unlocks, and map revelations' },
  { id: 'reputation', label: 'Reputation', description: 'Standing shifts, access changes, and acclaim' }
];

function humanizeId(value: string | null | undefined): string {
  if (!value) {
    return 'Unknown';
  }

  const segments = value.split('.');
  const lastSegment = segments[segments.length - 1] ?? value;

  return lastSegment
    .split('_')
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDate(snapshot: SaveSnapshot): string {
  const monthLabel = monthNames[snapshot.clock.month - 1] ?? `Month ${snapshot.clock.month}`;
  return `${snapshot.clock.day} ${monthLabel}`;
}

function formatTimeOfDay(snapshot: SaveSnapshot): string {
  return timeOfDayLabels[snapshot.clock.subday] ?? 'Unknown Watch';
}

function formatCoin(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatWallet(snapshot: SaveSnapshot): string {
  const { gold, silver, copper } = snapshot.playerState.currency;
  return `${formatCoin(gold)}g ${silver}s ${copper}c`;
}

function formatSignedValue(value: number): string {
  return value > 0 ? `+${value}` : value.toString();
}

function formatResourceGrowth(vector: PlayerResourceGrowthVector): string {
  return `HP ${formatSignedValue(vector.hp)} | MP ${formatSignedValue(vector.mp)} | STA ${formatSignedValue(vector.stamina)}`;
}

function getInventoryStackCount(inventory: PlayerInventoryState): number {
  return (
    inventory.bags.reduce((count, bag) => count + bag.stacks.length, 0) + inventory.overflow.length
  );
}

function getInventoryItemQuantity(inventory: PlayerInventoryState): number {
  return (
    inventory.bags.reduce(
      (count, bag) => count + bag.stacks.reduce((bagCount, stack) => bagCount + stack.quantity, 0),
      0
    ) + inventory.overflow.reduce((count, stack) => count + stack.quantity, 0)
  );
}

function getInventoryCapacity(inventory: PlayerInventoryState): number {
  return inventory.bags.reduce((capacity, bag) => capacity + bag.slotCapacity, 0);
}

function getOccupiedEquipmentSlots(snapshot: SaveSnapshot): number {
  return Object.values(snapshot.playerState.equipment).filter((item) => item !== null).length;
}

function summarizeDiscoveryCategories(
  entries: PlayerDiscoveryChronicleEntryState[]
): string {
  const counts = entries.reduce<Record<string, number>>((result, entry) => {
    result[entry.category] = (result[entry.category] ?? 0) + 1;
    return result;
  }, {});

  const summary = Object.entries(counts)
    .map(([category, count]) => `${humanizeId(category)} ${count}`)
    .join(', ');

  return summary || 'No recorded discoveries';
}

function formatOriginLabel(originProfile: PlayerOriginProfileState): string {
  if (!originProfile.classLabel) {
    return `${originProfile.lineageLabel} | ${humanizeId(originProfile.sexId)}`;
  }

  return `${originProfile.lineageLabel} | ${originProfile.classLabel} | ${humanizeId(originProfile.sexId)}`;
}

function summarizeAttributeAdjustments(
  adjustments: PlayerOriginProfileState['attributeAdjustments']
): string {
  const summary = Object.entries(adjustments)
    .filter(([, value]) => value !== undefined && value !== 0)
    .map(([key, value]) => `${key} ${formatSignedValue(value!)}`)
    .join(', ');

  return summary || 'None';
}

function formatResourceTickEntry(entry: PlayerResourceTickEntryState): string {
  const segments = [
    `before ${entry.before}`,
    `after ${entry.after}`,
    `max ${entry.max}`
  ];

  if (entry.naturalRegen !== 0) {
    segments.push(`natural ${formatSignedValue(entry.naturalRegen)}`);
  }

  if (entry.assistedRegen !== 0) {
    segments.push(`assisted ${formatSignedValue(entry.assistedRegen)}`);
  }

  if (entry.degeneration !== 0) {
    segments.push(`degeneration -${entry.degeneration}`);
  }

  if (entry.directChange !== 0) {
    segments.push(`direct ${formatSignedValue(entry.directChange)}`);
  }

  if (entry.clampAdjustment !== 0) {
    segments.push(`clamp ${formatSignedValue(entry.clampAdjustment)}`);
  }

  return segments.join(' | ');
}

function buildDetailGroup(title: string, entries: Array<{ label: string; value: string }>): DetailGroup[] {
  return [
    {
      title,
      entries
    }
  ];
}

function mapPanelRecord(record: PanelRecordState, detailTitle: string): ListItem {
  return {
    id: record.id,
    title: record.title,
    subtitle: record.subtitle,
    meta: record.meta,
    status: record.status,
    description: record.summary,
    tags: record.tags,
    detailTitle: record.title,
    detailSummary: record.summary,
    detailGroups: buildDetailGroup(detailTitle, record.detailEntries)
  };
}

function mapCodexEntry(entry: CodexEntryState): ListItem {
  return {
    id: entry.id,
    category: entry.category,
    title: entry.title,
    subtitle: entry.subtitle,
    meta: entry.locked ? 'Locked' : 'Discovered',
    status: entry.status,
    tags: [...entry.tags, ...entry.regionTags],
    locked: entry.locked,
    detailTitle: entry.title,
    detailSummary: entry.summary,
    detailGroups: buildDetailGroup('Entry Details', [
      { label: 'Habitat', value: entry.habitat },
      { label: 'Uses', value: entry.uses },
      { label: 'Value', value: entry.valueDescription },
      { label: 'Region Tags', value: entry.regionTags.join(', ') }
    ])
  };
}

function mapQuestEntry(entry: QuestJournalEntryState): ListItem {
  return {
    id: entry.id,
    category: entry.category,
    title: entry.title,
    subtitle: entry.regionLabel,
    meta: entry.rewardLabel,
    status: entry.statusLabel,
    tags: entry.tags,
    detailTitle: entry.title,
    detailSummary: entry.summary,
    detailGroups: [
      {
        title: 'Objectives',
        entries: entry.objectives.map((objective) => ({
          label: 'Objective',
          value: objective
        }))
      },
      {
        title: 'Rewards',
        entries: [
          ...entry.rewards.map((reward) => ({
            label: 'Reward',
            value: reward
          })),
          {
            label: 'Related Locations',
            value: entry.relatedLocations.join(', ')
          }
        ]
      }
    ]
  };
}

function mapChronicleEntry(entry: ChronicleEventState): ListItem {
  return {
    id: entry.id,
    category: entry.category,
    title: entry.title,
    subtitle: entry.timeLabel,
    meta: humanizeId(entry.category),
    status: entry.statusLabel,
    tags: entry.tags,
    detailTitle: entry.title,
    detailSummary: entry.summary,
    detailGroups: [
      {
        title: 'Expanded Event',
        entries: [
          { label: 'Entities', value: entry.entities.join(', ') },
          { label: 'Results', value: entry.results.join(', ') },
          { label: 'Stat Changes', value: entry.statChanges.join(', ') }
        ]
      }
    ]
  };
}

function mapDiscoveryEntry(entry: PlayerDiscoveryChronicleEntryState): ListItem {
  return {
    id: entry.id,
    category: entry.category,
    title: entry.title,
    subtitle: entry.regionLabel,
    meta: humanizeId(entry.category),
    status: entry.discoveredAtLabel,
    tags: [humanizeId(entry.sourceType), entry.codexEntryId],
    description: entry.notes[0],
    detailTitle: entry.title,
    detailSummary: `${entry.title} was added to the personal discovery chronicle via ${humanizeId(entry.sourceType)} activity.`,
    detailGroups: [
      {
        title: 'Discovery Record',
        entries: [
          { label: 'Category', value: humanizeId(entry.category) },
          { label: 'Codex Entry', value: entry.codexEntryId },
          { label: 'Region', value: entry.regionLabel },
          { label: 'Source', value: humanizeId(entry.sourceType) },
          { label: 'Source Ref', value: entry.sourceId ?? 'No source ref' }
        ]
      },
      {
        title: 'Notes',
        entries: entry.notes.map((note) => ({
          label: 'Note',
          value: note
        }))
      }
    ]
  };
}

function buildCharacterLists(snapshot: SaveSnapshot): Record<string, ListItem[]> {
  const { playerState } = snapshot;
  const inventoryStackCount = getInventoryStackCount(playerState.inventory);
  const inventoryItemQuantity = getInventoryItemQuantity(playerState.inventory);
  const inventoryCapacity = getInventoryCapacity(playerState.inventory);
  const attributeDetails: Record<PlayerAttributeKey, string> = {
    STR: 'Physical power, carrying, and impact',
    DEX: 'Precision, tool handling, and ranged control',
    AGI: 'Movement speed, balance, and evasion',
    CON: 'Resistance to strain and injury',
    VIT: 'Endurance, recovery, and hardiness',
    WIS: 'Judgment, medicine, and perception',
    INT: 'Planning, analysis, and technical learning',
    SPT: 'Will, attunement, and magical stability',
    CHA: 'Influence, command, and negotiation'
  };

  const attributes = (Object.entries(playerState.attributes) as Array<[PlayerAttributeKey, number]>).map(
    ([key, value]) => ({
      id: `attr.${key.toLowerCase()}`,
      title: humanizeId(key),
      subtitle: attributeDetails[key],
      meta: `${value} total`,
      status: value >= 16 ? 'Advanced' : value >= 13 ? 'Competent' : 'Developing',
      tags: [key, 'Player Stat', playerState.originProfile.attributeAdjustments[key] ? 'Origin Adjusted' : 'Unmodified'],
      detailTitle: `${humanizeId(key)} Breakdown`,
      detailSummary: `${humanizeId(key)} currently sits at ${value} and directly feeds related skill checks and passive thresholds.`,
      detailGroups: buildDetailGroup('Sources', [
        { label: 'Current Value', value: value.toString() },
        {
          label: 'Origin Adjustment',
          value: formatSignedValue(playerState.originProfile.attributeAdjustments[key] ?? 0)
        },
        { label: 'Derived Focus', value: attributeDetails[key] },
        {
          label: 'Threshold Band',
          value: value >= 16 ? 'Advanced' : value >= 13 ? 'Competent' : 'Developing'
        }
      ])
    })
  );

  const skills = playerState.skills.map((skill) => ({
    id: skill.id,
    title: humanizeId(skill.id),
    subtitle: `${skill.source === 'trained' ? 'Trained' : 'Innate'} skill`,
    meta: `Rank ${skill.rank}`,
    status: skill.rank >= 8 ? 'Expert' : skill.rank >= 5 ? 'Skilled' : 'Learning',
    tags: [skill.source === 'trained' ? 'Trained' : 'Innate'],
    detailTitle: `${humanizeId(skill.id)} Progression`,
    detailSummary: `${humanizeId(skill.id)} is currently rank ${skill.rank} and feeds directly into the active build.`,
    detailGroups: buildDetailGroup('Progress', [
      { label: 'Rank', value: skill.rank.toString() },
      { label: 'Source', value: humanizeId(skill.source) },
      {
        label: 'Role',
        value:
          skill.id.includes('navigation')
            ? 'Travel and route control'
            : skill.id.includes('mercantile')
              ? 'Trade and pricing'
              : 'Craft and repair'
      }
    ])
  }));

  const equipment = Object.entries(playerState.equipment)
    .filter(([, item]) => item !== null)
    .map(([slotId, item]) => ({
      id: item!.itemId,
      title: humanizeId(item!.itemKey),
      subtitle: humanizeId(slotId),
      meta: 'Equipped',
      status:
        item!.durability !== undefined ? `${Math.round(item!.durability * 100)}% durability` : undefined,
      tags: ['Equipment'],
      detailTitle: humanizeId(item!.itemKey),
      detailSummary: `${humanizeId(item!.itemKey)} is equipped in ${humanizeId(slotId)} and contributes to the current build.`,
      detailGroups: buildDetailGroup('Equipment Stats', [
        { label: 'Item Ref', value: item!.itemId },
        { label: 'Slot', value: humanizeId(slotId) },
        { label: 'Quantity', value: item!.quantity.toString() },
        {
          label: 'Durability',
          value: item!.durability !== undefined ? `${Math.round(item!.durability * 100)}%` : 'N/A'
        }
      ])
    }));

  const inventory: ListItem[] = [
    {
      id: 'inventory.wallet',
      title: 'Coin Purse',
      subtitle: 'Liquid currency',
      meta: formatWallet(snapshot),
      status: `${inventoryItemQuantity} carried item${inventoryItemQuantity === 1 ? '' : 's'}`,
      tags: ['Currency', 'Inventory'],
      detailTitle: 'Currency Holdings',
      detailSummary:
        'Current wallet balances are tracked alongside carried inventory so trade, travel, and contract payouts can project against the same player snapshot.',
      detailGroups: [
        {
          title: 'Wallet',
          entries: [
            { label: 'Gold', value: formatCoin(playerState.currency.gold) },
            { label: 'Silver', value: playerState.currency.silver.toString() },
            { label: 'Copper', value: playerState.currency.copper.toString() }
          ]
        },
        {
          title: 'Carry Snapshot',
          entries: [
            { label: 'Used Slots', value: `${inventoryStackCount} / ${inventoryCapacity || 0}` },
            { label: 'Bag Count', value: playerState.inventory.bags.length.toString() },
            { label: 'Overflow Stacks', value: playerState.inventory.overflow.length.toString() }
          ]
        }
      ]
    },
    ...playerState.inventory.bags.flatMap((bag) => {
      const bagQuantity = bag.stacks.reduce((count, stack) => count + stack.quantity, 0);

      return [
        {
          id: bag.id,
          title: bag.label,
          subtitle: 'Container',
          meta: `${bag.stacks.length} / ${bag.slotCapacity} slots`,
          status: `${bagQuantity} item${bagQuantity === 1 ? '' : 's'}`,
          tags: ['Bag', 'Inventory'],
          detailTitle: bag.label,
          detailSummary: `${bag.label} is one of the active inventory containers and currently holds ${bagQuantity} total carried items.`,
          detailGroups: buildDetailGroup('Capacity', [
            { label: 'Bag Ref', value: bag.id },
            { label: 'Slot Capacity', value: bag.slotCapacity.toString() },
            { label: 'Used Slots', value: bag.stacks.length.toString() },
            { label: 'Free Slots', value: Math.max(bag.slotCapacity - bag.stacks.length, 0).toString() }
          ])
        },
        ...bag.stacks.map((stack) => ({
          id: `${bag.id}.${stack.itemId}`,
          title: humanizeId(stack.itemKey),
          subtitle: bag.label,
          meta: `x${stack.quantity}`,
          status: 'Carried',
          tags: ['Inventory', bag.label],
          detailTitle: humanizeId(stack.itemKey),
          detailSummary: `${humanizeId(stack.itemKey)} is currently stored in ${bag.label}.`,
          detailGroups: buildDetailGroup('Stack', [
            { label: 'Item Ref', value: stack.itemId },
            { label: 'Item Key', value: stack.itemKey },
            { label: 'Container', value: bag.label },
            { label: 'Quantity', value: stack.quantity.toString() }
          ])
        }))
      ];
    }),
    ...playerState.inventory.overflow.map((stack) => ({
      id: `overflow.${stack.itemId}`,
      title: humanizeId(stack.itemKey),
      subtitle: 'Overflow',
      meta: `x${stack.quantity}`,
      status: 'Unsorted',
      tags: ['Inventory', 'Overflow'],
      detailTitle: humanizeId(stack.itemKey),
      detailSummary: `${humanizeId(stack.itemKey)} is currently in overflow because no bag slot has claimed it yet.`,
      detailGroups: buildDetailGroup('Overflow Stack', [
        { label: 'Item Ref', value: stack.itemId },
        { label: 'Item Key', value: stack.itemKey },
        { label: 'Quantity', value: stack.quantity.toString() }
      ])
    }))
  ];

  const traits = playerState.traits.map((trait) => ({
    id: trait.id,
    title: humanizeId(trait.id),
    subtitle: `${humanizeId(trait.source)} trait`,
    meta: 'Passive',
    tags: ['Trait'],
    detailTitle: humanizeId(trait.id),
    detailSummary: `${humanizeId(trait.id)} remains active as part of the player identity and current loadout.`,
    detailGroups: buildDetailGroup('Effects', [
      { label: 'Source', value: humanizeId(trait.source) },
      { label: 'State', value: 'Active' }
    ])
  }));

  const reputation = playerState.reputation.map((entry) => ({
    id: entry.id,
    title: entry.label,
    subtitle: 'Standing',
    meta: entry.standingLabel,
    status: `${entry.score} score`,
    tags: ['Reputation'],
    detailTitle: entry.label,
    detailSummary: `${entry.label} currently sits at ${entry.standingLabel} and unlocks access or discounts.`,
    detailGroups: buildDetailGroup('Benefits', [
      { label: 'Standing', value: entry.standingLabel },
      { label: 'Score', value: entry.score.toString() },
      { label: 'Effects', value: entry.effects.join(', ') }
    ])
  }));

  const titles = playerState.titles.map((title) => ({
    id: title.id,
    title: title.label,
    subtitle: humanizeId(title.source),
    meta: title.equipped ? 'Equipped' : 'Stored',
    tags: ['Title'],
    detailTitle: title.label,
    detailSummary: `${title.label} reflects a progression milestone and can influence access, recognition, or passive bonuses.`,
    detailGroups: buildDetailGroup('Bonuses', [
      { label: 'Source', value: humanizeId(title.source) },
      { label: 'Equipped', value: title.equipped ? 'Yes' : 'No' },
      { label: 'Effects', value: title.effects.join(', ') }
    ])
  }));

  const discoveries = playerState.discoveryChronicle.entries.map(mapDiscoveryEntry);

  return {
    attributes,
    skills,
    inventory,
    equipment,
    traits,
    reputation,
    titles,
    discoveries
  };
}

function withSectionCounts(items: SidebarItem[], counts: Record<string, number>): SidebarItem[] {
  return items.map((item) => ({
    ...item,
    count: counts[item.id] ?? item.count
  }));
}

function createWindowDetail({
  title,
  summary,
  standardFields,
  connectedRefs,
  missingRefs
}: {
  title: string;
  summary: string;
  standardFields: DetailGroup['entries'];
  connectedRefs: DetailGroup['entries'];
  missingRefs: DetailGroup['entries'];
}): WindowDetail {
  return {
    title,
    summary,
    groups: [
      { title: 'Standard Fields', entries: standardFields },
      { title: 'Connected References', entries: connectedRefs },
      { title: 'Missing / Empty References', entries: missingRefs }
    ]
  };
}

function buildCharacterWindowDetails(
  snapshot: SaveSnapshot,
  characterLists: Record<string, ListItem[]>
): Record<string, WindowDetail> {
  const inventoryStackCount = getInventoryStackCount(snapshot.playerState.inventory);
  const inventoryItemQuantity = getInventoryItemQuantity(snapshot.playerState.inventory);
  const inventoryCapacity = getInventoryCapacity(snapshot.playerState.inventory);
  const occupiedEquipmentSlots = getOccupiedEquipmentSlots(snapshot);
  const originSummary = formatOriginLabel(snapshot.playerState.originProfile);
  const activeEffectCount = new Set([
    ...snapshot.playerState.activeEffects,
    ...snapshot.playerState.resourceRuntime.modifiers.map((modifier) => modifier.label)
  ]).size;
  const equippedTitles =
    snapshot.playerState.titles.filter((title) => title.equipped).map((title) => title.label).join(', ') ||
    'None equipped';

  return {
    overview: createWindowDetail({
      title: 'Overview Window Standards',
      summary:
        'The overview window should expose live identity, origin growth, progression state, carry state, discoveries, and current session context for the player.',
      standardFields: [
        { label: 'Progression', value: `Level ${snapshot.playerState.progression.level}`, tone: 'success' },
        {
          label: 'Origin Profile',
          value: originSummary,
          tone: 'success'
        },
        {
          label: 'Attribute Variance',
          value: summarizeAttributeAdjustments(snapshot.playerState.originProfile.attributeAdjustments),
          tone: 'accent'
        },
        { label: 'Active Effects', value: activeEffectCount.toString(), tone: 'success' },
        { label: 'Wallet', value: formatWallet(snapshot), tone: 'accent' },
        {
          label: 'Discovery Chronicle',
          value: `${snapshot.playerState.discoveryChronicle.entries.length} entries`,
          tone: 'accent'
        },
        {
          label: 'Resource Runtime',
          value: `${snapshot.playerState.resourceRuntime.modifiers.length} modifiers / ${snapshot.playerState.resourceRuntime.history.length} history`,
          tone: 'accent'
        }
      ],
      connectedRefs: [
        { label: 'Primary Source', value: 'playerState + sessionState + clock', tone: 'accent' },
        { label: 'Origin Source', value: 'playerState.originProfile', tone: 'neutral' },
        { label: 'Carry Source', value: 'playerState.inventory + currency + equipment', tone: 'neutral' },
        { label: 'Resource Runtime', value: 'playerState.resourceRuntime', tone: 'neutral' },
        {
          label: 'Discovery Source',
          value: 'playerState.discoveryChronicle',
          tone: 'neutral'
        },
        { label: 'Tracked Quest Ref', value: snapshot.sessionState.trackedQuestId ?? 'Unassigned', tone: 'neutral' },
        { label: 'Current Activity Ref', value: snapshot.sessionState.currentActivity?.id ?? 'Idle', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Derived Combat Stats', value: 'Needs runtime combat-power formulas', tone: 'warning' },
        { label: 'Encumbrance Breakdown', value: 'Needs weight/load references', tone: 'warning' },
        { label: 'Archetype Taxonomy', value: 'Needs class-role-faction mapping', tone: 'warning' },
        { label: 'Base Attribute Provenance', value: 'Needs raw pre-origin attribute layer', tone: 'warning' },
        { label: 'Lineage Id Mapping', value: 'Needs authored world-race to player-lineage refs', tone: 'warning' },
        { label: 'Canonical Effect Payloads', value: 'Needs authored spell/food/equipment modifier data', tone: 'warning' }
      ]
    }),
    attributes: createWindowDetail({
      title: 'Attribute Window Standards',
      summary:
        'Attribute detail should show each tracked stat, its current value, origin variance, threshold band, and the rules that derive passive modifiers.',
      standardFields: [
        { label: 'Tracked Attributes', value: characterLists.attributes.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Value, origin adjustment, focus, threshold band', tone: 'success' },
        { label: 'Highest Value', value: `${Math.max(...Object.values(snapshot.playerState.attributes))}`, tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'playerState.attributes', tone: 'accent' },
        { label: 'Origin Source', value: 'playerState.originProfile.attributeAdjustments', tone: 'neutral' },
        { label: 'UI Projection', value: 'character.lists.attributes', tone: 'neutral' },
        { label: 'Selection Key', value: 'attr.<attribute>', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Derived Modifiers', value: 'Missing additive modifier sources', tone: 'warning' },
        { label: 'Gear Buff Split', value: 'Needs equipment-vs-effect attribution', tone: 'warning' },
        { label: 'Skill Link Map', value: 'Needs governing attribute refs', tone: 'warning' },
        { label: 'Base Attribute Layer', value: 'Needs raw base stats before variance and gear', tone: 'warning' }
      ]
    }),
    skills: createWindowDetail({
      title: 'Skill Window Standards',
      summary:
        'Skill detail should expose rank, source, linked systems, and how each skill progresses or unlocks related actions.',
      standardFields: [
        { label: 'Tracked Skills', value: characterLists.skills.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Rank, source, role hint', tone: 'success' },
        { label: 'Known Abilities', value: snapshot.playerState.abilities.length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'playerState.skills', tone: 'accent' },
        { label: 'Related Pools', value: 'playerState.spells + abilities', tone: 'neutral' },
        { label: 'Projection Ref', value: 'character.lists.skills', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'XP Curves', value: 'Missing per-skill progression formulas', tone: 'warning' },
        { label: 'Unlock Rules', value: 'Needs prerequisite references', tone: 'warning' },
        { label: 'Attribute Bindings', value: 'Needs governing stat refs', tone: 'warning' }
      ]
    }),
    inventory: createWindowDetail({
      title: 'Inventory Window Standards',
      summary:
        'Inventory detail should show wallet balances, container capacity, carried stacks, overflow, and the canonical item references that back each row.',
      standardFields: [
        { label: 'Inventory Rows', value: characterLists.inventory.length.toString(), tone: 'success' },
        {
          label: 'Current Fields',
          value: 'Wallet, bag ref, stack quantity, item ref, overflow state',
          tone: 'success'
        },
        { label: 'Used Slots', value: `${inventoryStackCount} / ${inventoryCapacity}`, tone: 'accent' },
        { label: 'Total Quantity', value: inventoryItemQuantity.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'playerState.inventory + playerState.currency', tone: 'accent' },
        { label: 'Support Source', value: 'playerState.equipment', tone: 'neutral' },
        { label: 'Projection Ref', value: 'character.lists.inventory', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Canonical Item Metadata', value: 'Needs item-content stat/value/weight refs', tone: 'danger' },
        { label: 'Encumbrance Rules', value: 'Needs load and carry formulas', tone: 'warning' },
        { label: 'Container Ownership', value: 'Needs bag equip / storage slot refs', tone: 'warning' }
      ]
    }),
    equipment: createWindowDetail({
      title: 'Equipment Window Standards',
      summary:
        'Equipment detail should show slot occupancy, item durability, authored stats, and how gear changes the player build.',
      standardFields: [
        { label: 'Equipped Slots', value: occupiedEquipmentSlots.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Item ref, slot, quantity, durability', tone: 'success' },
        { label: 'Inventory Bags', value: snapshot.playerState.inventory.bags.length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'playerState.equipment', tone: 'accent' },
        { label: 'Fallback Source', value: 'playerState.inventory', tone: 'neutral' },
        { label: 'Projection Ref', value: 'character.lists.equipment', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Item Stat Payloads', value: 'Missing authored gear stat refs', tone: 'danger' },
        { label: 'Weight / Load', value: 'Needs encumbrance fields', tone: 'warning' },
        { label: 'Set / Slot Rules', value: 'Needs equip restriction refs', tone: 'warning' }
      ]
    }),
    traits: createWindowDetail({
      title: 'Trait Window Standards',
      summary:
        'Trait detail should differentiate permanent traits from temporary effects and link each to the rules that apply it.',
      standardFields: [
        { label: 'Tracked Traits', value: characterLists.traits.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Id, source, active state', tone: 'success' },
        { label: 'Active Effects Feed', value: activeEffectCount.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'playerState.traits', tone: 'accent' },
        { label: 'Adjacent Source', value: 'playerState.activeEffects', tone: 'neutral' },
        { label: 'Projection Ref', value: 'character.lists.traits', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Duration Rules', value: 'Missing timed-effect references', tone: 'warning' },
        { label: 'Modifier Tables', value: 'Needs applied stat deltas', tone: 'warning' },
        { label: 'Source Record Ids', value: 'Needs content refs for origin', tone: 'warning' }
      ]
    }),
    reputation: createWindowDetail({
      title: 'Reputation Window Standards',
      summary:
        'Reputation detail should show faction standing, thresholds, unlocks, and any regional or service gating that depends on them.',
      standardFields: [
        { label: 'Tracked Factions', value: characterLists.reputation.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Label, score, standing, effects', tone: 'success' },
        { label: 'Top Standing', value: snapshot.playerState.reputation[0]?.standingLabel ?? 'None', tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'playerState.reputation', tone: 'accent' },
        { label: 'Projection Ref', value: 'character.lists.reputation', tone: 'neutral' },
        { label: 'UI Dependents', value: 'titles, quests, market access', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Faction Id Links', value: 'Needs canonical faction refs', tone: 'warning' },
        { label: 'Threshold Tables', value: 'Needs standing tier definitions', tone: 'warning' },
        { label: 'Decay Rules', value: 'Missing long-term reputation drift', tone: 'warning' }
      ]
    }),
    titles: createWindowDetail({
      title: 'Title Window Standards',
      summary:
        'Title detail should show unlock source, equip state, and what systems read each title for access or passive bonuses.',
      standardFields: [
        { label: 'Tracked Titles', value: characterLists.titles.length.toString(), tone: 'success' },
        { label: 'Equipped Titles', value: equippedTitles, tone: 'success' },
        { label: 'Current Fields', value: 'Source, equip flag, effects', tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'playerState.titles', tone: 'accent' },
        { label: 'Projection Ref', value: 'character.lists.titles', tone: 'neutral' },
        { label: 'UI Dependents', value: 'top bar role tags', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Equip Rules', value: 'Needs title slot/equip ownership', tone: 'warning' },
        { label: 'Unlock Proof', value: 'Needs milestone or quest refs', tone: 'warning' },
        { label: 'Passive Bonus Links', value: 'Needs downstream system refs', tone: 'warning' }
      ]
    }),
    discoveries: createWindowDetail({
      title: 'Discovery Chronicle Standards',
      summary:
        'Discovery detail should show what was found, when, where, how it links to the codex, and which system emitted the discovery record.',
      standardFields: [
        {
          label: 'Tracked Discoveries',
          value: snapshot.playerState.discoveryChronicle.entries.length.toString(),
          tone: 'success'
        },
        {
          label: 'Current Fields',
          value: 'Category, codex entry, region, source ref, notes',
          tone: 'success'
        },
        {
          label: 'Category Mix',
          value: summarizeDiscoveryCategories(snapshot.playerState.discoveryChronicle.entries),
          tone: 'accent'
        },
        {
          label: 'Last Updated Tick',
          value: snapshot.playerState.discoveryChronicle.lastUpdatedTick?.toString() ?? 'Unknown',
          tone: 'accent'
        }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'playerState.discoveryChronicle', tone: 'accent' },
        { label: 'Codex Link Surface', value: 'sessionState.codexEntries', tone: 'neutral' },
        { label: 'Projection Ref', value: 'character.lists.discoveries', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Discovery Emitters', value: 'Needs runtime ownership for discovery writes', tone: 'danger' },
        { label: 'Deduping Rules', value: 'Needs merge/update rules for repeat finds', tone: 'warning' },
        { label: 'Canonical Region / Source Ids', value: 'Needs stable authored refs across emitters', tone: 'warning' }
      ]
    })
  };
}

function buildWorldWindowDetails(
  snapshot: SaveSnapshot,
  worldLists: Record<string, ListItem[]>
): Record<string, WindowDetail> {
  return {
    'world-map': createWindowDetail({
      title: 'World Map Window Standards',
      summary:
        'The map window should expose known locations, player position, visibility, overlays, and authored geometry for the active world surface.',
      standardFields: [
        { label: 'Known Locations', value: snapshot.sessionState.knownLocations.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Name, type, region, coordinates', tone: 'success' },
        { label: 'Player Map Ref', value: snapshot.playerState.location.worldMapId ?? 'Unassigned', tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.knownLocations', tone: 'accent' },
        { label: 'Position Source', value: 'playerState.location', tone: 'neutral' },
        { label: 'Projection Ref', value: 'world.locations + lists.world-map', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Authored Map Layers', value: 'Needs world_maps asset refs', tone: 'danger' },
        { label: 'Feature Geometry', value: 'Needs world_map_features projection', tone: 'danger' },
        { label: 'Visibility State', value: 'Needs fog-of-war / reveal refs', tone: 'warning' }
      ]
    }),
    region: createWindowDetail({
      title: 'Region Window Standards',
      summary:
        'Region detail should show climate, danger, resources, faction ownership, and ecology links for the selected region.',
      standardFields: [
        { label: 'Region Records', value: worldLists.region.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Climate, danger, resources', tone: 'success' },
        { label: 'Discovered Regions', value: snapshot.playerState.discoveredRegions.length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.worldRecords[region]', tone: 'accent' },
        { label: 'Player Region Ref', value: snapshot.playerState.regionId, tone: 'neutral' },
        { label: 'Projection Ref', value: 'world.lists.region', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Region Record Ids', value: 'Needs canonical region refs', tone: 'warning' },
        { label: 'Ecology Profiles', value: 'Needs regional ecology bindings', tone: 'warning' },
        { label: 'Hazard Feed', value: 'Needs live weather / threat refs', tone: 'warning' }
      ]
    }),
    settlement: createWindowDetail({
      title: 'Settlement Window Standards',
      summary:
        'Settlement detail should show population, services, guild presence, storage pressure, and local economic conditions.',
      standardFields: [
        { label: 'Settlement Records', value: worldLists.settlement.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Population, supply, services', tone: 'success' },
        { label: 'Known Settlement Ids', value: snapshot.playerState.location.knownSettlementIds.length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.worldRecords[settlement]', tone: 'accent' },
        { label: 'Player Location Ref', value: snapshot.playerState.location.settlementId ?? 'Unassigned', tone: 'neutral' },
        { label: 'Projection Ref', value: 'world.lists.settlement', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Settlement Id Links', value: 'Needs authored settlement refs', tone: 'warning' },
        { label: 'Guild / Service Roster', value: 'Needs building presence refs', tone: 'warning' },
        { label: 'Stockpile State', value: 'Needs local storage and demand feeds', tone: 'danger' }
      ]
    }),
    'trade-routes': createWindowDetail({
      title: 'Trade Route Window Standards',
      summary:
        'Trade route detail should expose endpoints, distance, travel time, risk, throughput, and disruption state.',
      standardFields: [
        { label: 'Route Records', value: worldLists['trade-routes'].length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Distance, risk, travel time', tone: 'success' },
        { label: 'Market Nodes', value: snapshot.civilizationState.markets.length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.worldRecords[trade-routes]', tone: 'accent' },
        { label: 'Support Source', value: 'civilizationState.markets', tone: 'neutral' },
        { label: 'Projection Ref', value: 'world.lists.trade-routes', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Route Geometry Ids', value: 'Needs authored route / segment refs', tone: 'danger' },
        { label: 'Throughput State', value: 'Needs live trade-lane capacity', tone: 'warning' },
        { label: 'Disruption Flags', value: 'Needs blockade / weather lock refs', tone: 'warning' }
      ]
    }),
    travel: createWindowDetail({
      title: 'Travel Window Standards',
      summary:
        'Travel detail should show current journey, remaining time, route choice, terrain cost, and encounter exposure.',
      standardFields: [
        { label: 'Travel Records', value: worldLists.travel.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Route summary, time, risk', tone: 'success' },
        { label: 'Current Activity', value: snapshot.sessionState.currentActivity?.label ?? 'Idle', tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.worldRecords[travel]', tone: 'accent' },
        { label: 'Activity Source', value: 'sessionState.currentActivity', tone: 'neutral' },
        { label: 'Projection Ref', value: 'world.lists.travel', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Terrain Cost Tables', value: 'Needs pathfinding / terrain refs', tone: 'warning' },
        { label: 'Encounter Hooks', value: 'Needs travel hazard linkage', tone: 'warning' },
        { label: 'Party / Cargo Context', value: 'Needs traveler and payload refs', tone: 'warning' }
      ]
    }),
    'local-market': createWindowDetail({
      title: 'Local Market Window Standards',
      summary:
        'Local market detail should show prices, stock, services, spreads, and how the local exchange is changing over time.',
      standardFields: [
        { label: 'Market Records', value: worldLists['local-market'].length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Supply, demand, services', tone: 'success' },
        { label: 'Known Markets', value: snapshot.civilizationState.markets.length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.worldRecords[local-market]', tone: 'accent' },
        { label: 'Economy Source', value: 'civilizationState.economy', tone: 'neutral' },
        { label: 'Projection Ref', value: 'world.lists.local-market', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Price Feeds', value: 'Needs live buy/sell prices', tone: 'danger' },
        { label: 'Stock Levels', value: 'Needs inventory and shortage refs', tone: 'danger' },
        { label: 'Service Ownership', value: 'Needs vendor / guild links', tone: 'warning' }
      ]
    })
  };
}

function buildActivityWindowDetails(
  snapshot: SaveSnapshot,
  activityLists: Record<string, ListItem[]>
): Record<string, WindowDetail> {
  return {
    employment: createWindowDetail({
      title: 'Employment Window Standards',
      summary:
        'Employment detail should show job source, pay, duration, employer, requirements, and availability state.',
      standardFields: [
        { label: 'Employment Records', value: activityLists.employment.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Pay, duration, role', tone: 'success' },
        { label: 'Current Activity', value: snapshot.sessionState.currentActivity?.label ?? 'Idle', tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.activityRecords[employment]', tone: 'accent' },
        { label: 'Player Job Ref', value: snapshot.playerState.coreData.jobId ?? 'Unassigned', tone: 'neutral' },
        { label: 'Projection Ref', value: 'activity.lists.employment', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Employer Ids', value: 'Needs organization / workplace refs', tone: 'warning' },
        { label: 'Shift Rules', value: 'Needs schedule and availability refs', tone: 'warning' },
        { label: 'Requirement Checks', value: 'Needs skill and tool gating', tone: 'warning' }
      ]
    }),
    businesses: createWindowDetail({
      title: 'Business Window Standards',
      summary:
        'Business detail should show revenue, expenses, upgrades, workforce, and ownership state for each player-linked venture.',
      standardFields: [
        { label: 'Business Records', value: activityLists.businesses.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Summary, status, detail entries', tone: 'success' },
        { label: 'Revenue Metric', value: 'Daily revenue card present', tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.activityRecords[businesses]', tone: 'accent' },
        { label: 'UI Metric Source', value: 'activity.metrics.daily-revenue', tone: 'neutral' },
        { label: 'Projection Ref', value: 'activity.lists.businesses', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Revenue / Expense Feed', value: 'Needs live business ledgers', tone: 'danger' },
        { label: 'Upgrade Catalog', value: 'Needs business upgrade refs', tone: 'warning' },
        { label: 'Workforce State', value: 'Needs staffing and payroll refs', tone: 'warning' }
      ]
    }),
    crafting: createWindowDetail({
      title: 'Crafting Window Standards',
      summary:
        'Crafting detail should show recipe, station, inputs, outputs, quality, and time remaining for active or available jobs.',
      standardFields: [
        { label: 'Crafting Records', value: activityLists.crafting.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Materials, output, queue state', tone: 'success' },
        { label: 'Queued Operations', value: snapshot.sessionState.operations.length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.activityRecords[crafting]', tone: 'accent' },
        { label: 'Support Source', value: 'sessionState.operations', tone: 'neutral' },
        { label: 'Projection Ref', value: 'activity.lists.crafting', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Recipe Ids', value: 'Needs canonical recipe refs', tone: 'warning' },
        { label: 'Station Links', value: 'Needs workplace / tool refs', tone: 'warning' },
        { label: 'Quality Rules', value: 'Needs output quality formulas', tone: 'warning' }
      ]
    }),
    trade: createWindowDetail({
      title: 'Trade Window Standards',
      summary:
        'Trade detail should show cargo, route, buy-sell context, expected margin, and fulfillment state for each trade action.',
      standardFields: [
        { label: 'Trade Records', value: activityLists.trade.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Margin, route, cargo summary', tone: 'success' },
        { label: 'Known Markets', value: snapshot.civilizationState.markets.length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.activityRecords[trade]', tone: 'accent' },
        { label: 'Support Source', value: 'civilizationState.markets', tone: 'neutral' },
        { label: 'Projection Ref', value: 'activity.lists.trade', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Cargo Manifest Ids', value: 'Needs shipment and stack refs', tone: 'warning' },
        { label: 'Price Basis', value: 'Needs market price snapshot refs', tone: 'warning' },
        { label: 'Margin Model', value: 'Needs live profit computation', tone: 'warning' }
      ]
    }),
    contracts: createWindowDetail({
      title: 'Contract Window Standards',
      summary:
        'Contract detail should show issuer, pay, expiry, progress, and fulfillment state for active or offered work.',
      standardFields: [
        { label: 'Contract Records', value: activityLists.contracts.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Pay, duration, deliverable', tone: 'success' },
        { label: 'Quest Offers', value: snapshot.civilizationState.quests.activeOffers.length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.activityRecords[contracts]', tone: 'accent' },
        { label: 'Support Source', value: 'civilizationState.quests', tone: 'neutral' },
        { label: 'Projection Ref', value: 'activity.lists.contracts', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Issuer Links', value: 'Needs guild / market issuer refs', tone: 'warning' },
        { label: 'Expiry State', value: 'Needs contract lifecycle timestamps', tone: 'warning' },
        { label: 'Fulfillment Sync', value: 'Needs quest / activity cross-links', tone: 'warning' }
      ]
    }),
    military: createWindowDetail({
      title: 'Military Window Standards',
      summary:
        'Military detail should show duty roster, command hierarchy, readiness, and rewards or obligations for service records.',
      standardFields: [
        { label: 'Military Records', value: activityLists.military.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Role, pay, benefit', tone: 'success' },
        { label: 'Equipped Titles', value: snapshot.playerState.titles.filter((title) => title.equipped).length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.activityRecords[military]', tone: 'accent' },
        { label: 'Identity Source', value: 'playerState.titles + reputation', tone: 'neutral' },
        { label: 'Projection Ref', value: 'activity.lists.military', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Unit / Banner Ids', value: 'Needs command structure refs', tone: 'warning' },
        { label: 'Readiness Feed', value: 'Needs drill and duty state', tone: 'warning' },
        { label: 'Pay / Stipend Ledger', value: 'Needs service compensation refs', tone: 'warning' }
      ]
    }),
    naval: createWindowDetail({
      title: 'Naval Window Standards',
      summary:
        'Naval detail should show vessel assignment, berth, patrol schedule, crew state, and weather restrictions.',
      standardFields: [
        { label: 'Naval Records', value: activityLists.naval.length.toString(), tone: 'success' },
        { label: 'Current Fields', value: 'Launch window, pay, risk', tone: 'success' },
        { label: 'Current Map Ref', value: snapshot.playerState.location.worldMapId ?? 'Unassigned', tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.activityRecords[naval]', tone: 'accent' },
        { label: 'Location Source', value: 'playerState.location + world records', tone: 'neutral' },
        { label: 'Projection Ref', value: 'activity.lists.naval', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Vessel Ids', value: 'Needs ship / patrol asset refs', tone: 'warning' },
        { label: 'Crew Roster', value: 'Needs crew assignment refs', tone: 'warning' },
        { label: 'Weather Locks', value: 'Needs launch restriction feeds', tone: 'warning' }
      ]
    }),
    operations: createWindowDetail({
      title: 'Operations Window Standards',
      summary:
        'Operations detail should show queued jobs, owners, blockers, dependencies, and input-output state for active processes.',
      standardFields: [
        { label: 'Operation Records', value: activityLists.operations.length.toString(), tone: 'success' },
        { label: 'Queued Operations', value: snapshot.sessionState.operations.length.toString(), tone: 'success' },
        { label: 'High Priority Ops', value: snapshot.sessionState.operations.filter((operation) => operation.priority === 'High').length.toString(), tone: 'accent' }
      ],
      connectedRefs: [
        { label: 'Runtime Source', value: 'sessionState.operations + activityRecords', tone: 'accent' },
        { label: 'Projection Ref', value: 'activity.operationsQueue', tone: 'neutral' },
        { label: 'Selection Ref', value: 'activity.lists.operations', tone: 'neutral' }
      ],
      missingRefs: [
        { label: 'Dependency Graph', value: 'Needs predecessor / blocker refs', tone: 'warning' },
        { label: 'Input / Output Ids', value: 'Needs material and result refs', tone: 'warning' },
        { label: 'Persistence Owner', value: 'Needs save-session operation sync', tone: 'warning' }
      ]
    })
  };
}

function buildCodexCategoryWindowDetail(
  categoryLabel: string,
  count: number,
  missingRefs: DetailGroup['entries']
): WindowDetail {
  return createWindowDetail({
    title: `${categoryLabel} Window Standards`,
    summary:
      'Codex windows should show discovered records, category-specific details, discovery state, and the authored content references each entry came from.',
    standardFields: [
      { label: 'Category Records', value: count.toString(), tone: 'success' },
      { label: 'Current Fields', value: 'Title, habitat, uses, value, tags', tone: 'success' },
      { label: 'Discovery State', value: 'Locked vs discovered entries', tone: 'accent' }
    ],
    connectedRefs: [
      { label: 'Runtime Source', value: 'sessionState.codexEntries', tone: 'accent' },
      { label: 'Projection Ref', value: `codex.entries[category=${categoryLabel.toLowerCase()}]`, tone: 'neutral' },
      { label: 'UI Filters', value: 'search + region tags + discovery toggle', tone: 'neutral' }
    ],
    missingRefs
  });
}

function buildQuestSectionWindowDetail(
  sectionLabel: string,
  count: number,
  missingRefs: DetailGroup['entries']
): WindowDetail {
  return createWindowDetail({
    title: `${sectionLabel} Window Standards`,
    summary:
      'Quest windows should show region, reward, objectives, related locations, and the runtime references that govern tracking or resolution.',
    standardFields: [
      { label: 'Quest Records', value: count.toString(), tone: 'success' },
      { label: 'Current Fields', value: 'Title, region, reward, objectives', tone: 'success' },
      { label: 'Tracking Layer', value: 'Session quest journal + tracked quest', tone: 'accent' }
    ],
    connectedRefs: [
      { label: 'Runtime Source', value: 'sessionState.questJournal', tone: 'accent' },
      { label: 'Tracking Ref', value: 'sessionState.trackedQuestId', tone: 'neutral' },
      { label: 'Projection Ref', value: `quests.entries[section=${sectionLabel.toLowerCase()}]`, tone: 'neutral' }
    ],
    missingRefs
  });
}

function buildChronicleSectionWindowDetail(
  sectionLabel: string,
  count: number,
  missingRefs: DetailGroup['entries']
): WindowDetail {
  return createWindowDetail({
    title: `${sectionLabel} Window Standards`,
    summary:
      'Chronicle windows should show time-ordered events, involved entities, results, stat changes, and source links back to the systems that emitted them.',
    standardFields: [
      { label: 'Event Records', value: count.toString(), tone: 'success' },
      { label: 'Current Fields', value: 'Time, entities, results, stat changes', tone: 'success' },
      { label: 'Timeline Role', value: 'Historical and replay-facing audit feed', tone: 'accent' }
    ],
    connectedRefs: [
      { label: 'Runtime Source', value: 'sessionState.chronicle', tone: 'accent' },
      { label: 'Projection Ref', value: `chronicle.entries[section=${sectionLabel.toLowerCase()}]`, tone: 'neutral' },
      { label: 'UI Consumers', value: 'chronicle feed + analytics/replay later', tone: 'neutral' }
    ],
    missingRefs
  });
}

function buildCodexWindowDetails(snapshot: SaveSnapshot): Record<string, WindowDetail> {
  const counts = codexSections.reduce<Record<string, number>>((accumulator, section) => {
    accumulator[section.id] = snapshot.sessionState.codexEntries.filter((entry) => entry.category === section.id).length;
    return accumulator;
  }, {});

  return {
    flora: buildCodexCategoryWindowDetail('Flora', counts.flora, [
      { label: 'Content Id Links', value: 'Needs canonical flora record ids', tone: 'warning' },
      { label: 'Habitat Weights', value: 'Needs biome / region spawn refs', tone: 'warning' },
      { label: 'Harvest Outputs', value: 'Needs extraction and recipe links', tone: 'warning' }
    ]),
    fauna: buildCodexCategoryWindowDetail('Fauna', counts.fauna, [
      { label: 'Content Id Links', value: 'Needs canonical fauna record ids', tone: 'warning' },
      { label: 'Encounter Weights', value: 'Needs habitat and lair refs', tone: 'warning' },
      { label: 'Drop Tables', value: 'Needs loot and usage links', tone: 'warning' }
    ]),
    minerals: buildCodexCategoryWindowDetail('Minerals', counts.minerals, [
      { label: 'Content Id Links', value: 'Needs canonical mineral record ids', tone: 'warning' },
      { label: 'Deposit Sources', value: 'Needs world geology refs', tone: 'warning' },
      { label: 'Processing Links', value: 'Needs smelting and crafting refs', tone: 'warning' }
    ]),
    items: buildCodexCategoryWindowDetail('Items', counts.items, [
      { label: 'Item Id Links', value: 'Needs inventory / content item refs', tone: 'warning' },
      { label: 'Stat Payloads', value: 'Needs item stat and slot data', tone: 'danger' },
      { label: 'Recipe Links', value: 'Needs crafting and acquisition refs', tone: 'warning' }
    ]),
    recipes: buildCodexCategoryWindowDetail('Recipes', counts.recipes, [
      { label: 'Recipe Id Links', value: 'Needs canonical recipe refs', tone: 'warning' },
      { label: 'Input / Output Data', value: 'Needs ingredient and result ids', tone: 'warning' },
      { label: 'Station Requirements', value: 'Needs workplace / tool refs', tone: 'warning' }
    ]),
    factions: buildCodexCategoryWindowDetail('Factions', counts.factions, [
      { label: 'Faction Id Links', value: 'Needs canonical faction refs', tone: 'warning' },
      { label: 'Rank Thresholds', value: 'Needs standing tier tables', tone: 'warning' },
      { label: 'Presence Links', value: 'Needs settlement presence refs', tone: 'warning' }
    ]),
    notes: buildCodexCategoryWindowDetail('Notes', counts.notes, [
      { label: 'Source Record Links', value: 'Needs quest / event source refs', tone: 'warning' },
      { label: 'Journal Ownership', value: 'Needs note-author metadata', tone: 'warning' },
      { label: 'Follow-up Hooks', value: 'Needs note-to-objective links', tone: 'warning' }
    ])
  };
}

function buildQuestWindowDetails(snapshot: SaveSnapshot): Record<string, WindowDetail> {
  const counts = {
    active: snapshot.sessionState.questJournal.filter((entry) => entry.category === 'active').length,
    contracts: snapshot.sessionState.questJournal.filter((entry) => entry.category === 'contracts').length,
    completed: snapshot.sessionState.questJournal.filter((entry) => entry.category === 'completed').length,
    failed: snapshot.sessionState.questJournal.filter((entry) => entry.category === 'failed').length,
    tracked: snapshot.sessionState.questJournal.filter((entry) => entry.tracked).length
  };

  return {
    active: buildQuestSectionWindowDetail('Active', counts.active, [
      { label: 'Quest Giver Links', value: 'Needs issuer / giver refs', tone: 'warning' },
      { label: 'Progress State Machine', value: 'Needs objective status refs', tone: 'warning' },
      { label: 'Expiry / Time Limits', value: 'Needs deadline refs', tone: 'warning' }
    ]),
    contracts: buildQuestSectionWindowDetail('Contracts', counts.contracts, [
      { label: 'Guild / Market Issuer', value: 'Needs issuing organization refs', tone: 'warning' },
      { label: 'Acceptance State', value: 'Needs offer-to-active lifecycle refs', tone: 'warning' },
      { label: 'Payout Ledger', value: 'Needs reward settlement refs', tone: 'warning' }
    ]),
    completed: buildQuestSectionWindowDetail('Completed', counts.completed, [
      { label: 'Outcome Flags', value: 'Needs resolved consequence refs', tone: 'warning' },
      { label: 'Reward Posting', value: 'Needs ledger / inventory result refs', tone: 'warning' },
      { label: 'Follow-on Unlocks', value: 'Needs chain quest refs', tone: 'warning' }
    ]),
    failed: buildQuestSectionWindowDetail('Failed', counts.failed, [
      { label: 'Failure Reason Codes', value: 'Needs canonical fail-state refs', tone: 'warning' },
      { label: 'Penalty Effects', value: 'Needs reputation or reward penalty refs', tone: 'warning' },
      { label: 'Recovery Conditions', value: 'Needs retry / recovery refs', tone: 'warning' }
    ]),
    tracked: buildQuestSectionWindowDetail('Tracked', counts.tracked, [
      { label: 'Canonical Tracking Source', value: 'Needs single tracking owner', tone: 'warning' },
      { label: 'Objective Cursor', value: 'Needs current-step ref for top bar', tone: 'warning' },
      { label: 'Pin Sync', value: 'Needs tracked-vs-pinned ownership rules', tone: 'warning' }
    ])
  };
}

function buildChronicleWindowDetails(snapshot: SaveSnapshot): Record<string, WindowDetail> {
  const counts = {
    all: snapshot.sessionState.chronicle.length,
    combat: snapshot.sessionState.chronicle.filter((entry) => entry.category === 'combat').length,
    trade: snapshot.sessionState.chronicle.filter((entry) => entry.category === 'trade').length,
    social: snapshot.sessionState.chronicle.filter((entry) => entry.category === 'social').length,
    travel: snapshot.sessionState.chronicle.filter((entry) => entry.category === 'travel').length,
    crafting: snapshot.sessionState.chronicle.filter((entry) => entry.category === 'crafting').length,
    discovery: snapshot.sessionState.chronicle.filter((entry) => entry.category === 'discovery').length,
    reputation: snapshot.sessionState.chronicle.filter((entry) => entry.category === 'reputation').length
  };

  return {
    all: buildChronicleSectionWindowDetail('All', counts.all, [
      { label: 'Event Source Ids', value: 'Needs canonical event emitters', tone: 'warning' },
      { label: 'Replay Index', value: 'Needs stable ordering / replay refs', tone: 'warning' },
      { label: 'Sort Timestamps', value: 'Needs formal chronology ids', tone: 'warning' }
    ]),
    combat: buildChronicleSectionWindowDetail('Combat', counts.combat, [
      { label: 'Encounter Links', value: 'Needs combat / encounter report refs', tone: 'warning' },
      { label: 'Damage Logs', value: 'Needs structured damage refs', tone: 'warning' },
      { label: 'Loot Results', value: 'Needs reward drop refs', tone: 'warning' }
    ]),
    trade: buildChronicleSectionWindowDetail('Trade', counts.trade, [
      { label: 'Transaction Ids', value: 'Needs market trade refs', tone: 'warning' },
      { label: 'Cargo Links', value: 'Needs shipment and manifest refs', tone: 'warning' },
      { label: 'Ledger Effects', value: 'Needs economy delta refs', tone: 'warning' }
    ]),
    social: buildChronicleSectionWindowDetail('Social', counts.social, [
      { label: 'NPC / Faction Links', value: 'Needs participant refs', tone: 'warning' },
      { label: 'Dialogue Outcomes', value: 'Needs conversation result refs', tone: 'warning' },
      { label: 'Civic Effects', value: 'Needs world-state consequence refs', tone: 'warning' }
    ]),
    travel: buildChronicleSectionWindowDetail('Travel', counts.travel, [
      { label: 'Route Segment Links', value: 'Needs path / leg refs', tone: 'warning' },
      { label: 'Weather Hooks', value: 'Needs climate impact refs', tone: 'warning' },
      { label: 'Encounter Hooks', value: 'Needs travel hazard refs', tone: 'warning' }
    ]),
    crafting: buildChronicleSectionWindowDetail('Crafting', counts.crafting, [
      { label: 'Recipe Links', value: 'Needs recipe and station refs', tone: 'warning' },
      { label: 'Material Consumption', value: 'Needs input stack refs', tone: 'warning' },
      { label: 'Output Links', value: 'Needs created item ids', tone: 'warning' }
    ]),
    discovery: buildChronicleSectionWindowDetail('Discovery', counts.discovery, [
      { label: 'Codex Unlock Links', value: 'Needs codex entry refs', tone: 'warning' },
      { label: 'Map Reveal Links', value: 'Needs geography discovery refs', tone: 'warning' },
      { label: 'Source Evidence', value: 'Needs note / sample refs', tone: 'warning' }
    ]),
    reputation: buildChronicleSectionWindowDetail('Reputation', counts.reputation, [
      { label: 'Standing Delta Links', value: 'Needs faction score refs', tone: 'warning' },
      { label: 'Threshold Effects', value: 'Needs unlock tier refs', tone: 'warning' },
      { label: 'Access Change Links', value: 'Needs service / permit refs', tone: 'warning' }
    ])
  };
}

export function createUiViewModel(snapshot: SaveSnapshot): UiViewModel {
  const trackedQuest =
    snapshot.sessionState.questJournal.find((entry) => entry.id === snapshot.sessionState.trackedQuestId) ??
    snapshot.sessionState.questJournal.find((entry) => entry.tracked);
  const characterLists = buildCharacterLists(snapshot);
  const inventoryStackCount = getInventoryStackCount(snapshot.playerState.inventory);
  const inventoryItemQuantity = getInventoryItemQuantity(snapshot.playerState.inventory);
  const inventoryCapacity = getInventoryCapacity(snapshot.playerState.inventory);
  const occupiedEquipmentSlots = getOccupiedEquipmentSlots(snapshot);
  const discoverySummary = summarizeDiscoveryCategories(snapshot.playerState.discoveryChronicle.entries);
  const backgroundLabel = snapshot.playerState.coreData.jobId
    ? humanizeId(snapshot.playerState.coreData.jobId)
    : null;
  const worldLists = worldSections.reduce<Record<string, ListItem[]>>((groups, section) => {
    if (section.id === 'world-map') {
      groups[section.id] = snapshot.sessionState.knownLocations.map((location) => ({
        id: location.id,
        title: location.name,
        subtitle: location.regionLabel,
        meta: location.type,
        description: location.note,
        detailTitle: location.name,
        detailSummary: location.note,
        detailGroups: buildDetailGroup('Location', [
          { label: 'Region', value: location.regionLabel },
          { label: 'Type', value: humanizeId(location.type) },
          { label: 'Status', value: location.known ? 'Known' : 'Unknown' }
        ])
      }));
      return groups;
    }

    groups[section.id] = snapshot.sessionState.worldRecords
      .filter((record) => record.sectionId === section.id)
      .map((record) => mapPanelRecord(record, humanizeId(section.id)));
    return groups;
  }, {});

  const activityLists = activitySections.reduce<Record<string, ListItem[]>>((groups, section) => {
    groups[section.id] = snapshot.sessionState.activityRecords
      .filter((record) => record.sectionId === section.id)
      .map((record) => mapPanelRecord(record, humanizeId(section.id)));
    return groups;
  }, {});

  const codexEntries = snapshot.sessionState.codexEntries.map(mapCodexEntry);
  const questEntries = snapshot.sessionState.questJournal.map(mapQuestEntry);
  const chronicleEntries = snapshot.sessionState.chronicle.map(mapChronicleEntry);

  const characterWindowDetails = buildCharacterWindowDetails(snapshot, characterLists);
  const worldWindowDetails = buildWorldWindowDetails(snapshot, worldLists);
  const activityWindowDetails = buildActivityWindowDetails(snapshot, activityLists);
  const codexWindowDetails = buildCodexWindowDetails(snapshot);
  const questWindowDetails = buildQuestWindowDetails(snapshot);
  const chronicleWindowDetails = buildChronicleWindowDetails(snapshot);

  const characterCounts = {
    overview: 1,
    attributes: characterLists.attributes.length,
    skills: characterLists.skills.length,
    inventory: characterLists.inventory.length,
    equipment: characterLists.equipment.length,
    traits: characterLists.traits.length,
    reputation: characterLists.reputation.length,
    titles: characterLists.titles.length,
    discoveries: characterLists.discoveries.length
  };
  const worldCounts = {
    'world-map': snapshot.sessionState.knownLocations.length,
    region: worldLists.region.length,
    settlement: worldLists.settlement.length,
    'trade-routes': worldLists['trade-routes'].length,
    travel: worldLists.travel.length,
    'local-market': worldLists['local-market'].length
  };
  const activityCounts = {
    employment: activityLists.employment.length,
    businesses: activityLists.businesses.length,
    crafting: activityLists.crafting.length,
    trade: activityLists.trade.length,
    contracts: activityLists.contracts.length,
    military: activityLists.military.length,
    naval: activityLists.naval.length,
    operations: Math.max(activityLists.operations.length, snapshot.sessionState.operations.length)
  };
  const codexCounts = {
    flora: codexEntries.filter((entry) => entry.category === 'flora').length,
    fauna: codexEntries.filter((entry) => entry.category === 'fauna').length,
    minerals: codexEntries.filter((entry) => entry.category === 'minerals').length,
    items: codexEntries.filter((entry) => entry.category === 'items').length,
    recipes: codexEntries.filter((entry) => entry.category === 'recipes').length,
    factions: codexEntries.filter((entry) => entry.category === 'factions').length,
    notes: codexEntries.filter((entry) => entry.category === 'notes').length
  };
  const questCounts = {
    active: questEntries.filter((entry) => entry.category === 'active').length,
    contracts: questEntries.filter((entry) => entry.category === 'contracts').length,
    completed: questEntries.filter((entry) => entry.category === 'completed').length,
    failed: questEntries.filter((entry) => entry.category === 'failed').length,
    tracked: snapshot.sessionState.questJournal.filter((entry) => entry.tracked).length
  };
  const chronicleCounts = {
    all: chronicleEntries.length,
    combat: chronicleEntries.filter((entry) => entry.category === 'combat').length,
    trade: chronicleEntries.filter((entry) => entry.category === 'trade').length,
    social: chronicleEntries.filter((entry) => entry.category === 'social').length,
    travel: chronicleEntries.filter((entry) => entry.category === 'travel').length,
    crafting: chronicleEntries.filter((entry) => entry.category === 'crafting').length,
    discovery: chronicleEntries.filter((entry) => entry.category === 'discovery').length,
    reputation: chronicleEntries.filter((entry) => entry.category === 'reputation').length
  };

  return {
    navItems,
    notifications: snapshot.sessionState.notifications.map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.detail,
      time: item.timeLabel,
      type: item.tone
    })),
    topBar: {
      portraitInitials: snapshot.playerState.coreData.playerName
        .split(' ')
        .map((part) => part[0] ?? '')
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      name: snapshot.playerState.coreData.playerName,
      region: humanizeId(snapshot.playerState.regionId),
      settlement: snapshot.playerState.location.siteLabel
        ? `${humanizeId(snapshot.playerState.location.settlementId)} / ${snapshot.playerState.location.siteLabel}`
        : humanizeId(snapshot.playerState.location.settlementId),
      date: formatDate(snapshot),
      season: snapshot.clock.season,
      timeOfDay: formatTimeOfDay(snapshot),
      currency: formatWallet(snapshot),
      trackedQuest: trackedQuest?.title ?? 'No tracked quest',
      activityTag: snapshot.sessionState.currentActivity?.label
    },
    topBarMeters: [
      {
        label: 'HP',
        current: snapshot.playerState.resources.hp.current,
        max: snapshot.playerState.resources.hp.max,
        color: '#ef6a7a'
      },
      {
        label: 'MP',
        current: snapshot.playerState.resources.mp.current,
        max: snapshot.playerState.resources.mp.max,
        color: '#7da8ff'
      },
      {
        label: 'Stamina',
        current: snapshot.playerState.resources.stamina.current,
        max: snapshot.playerState.resources.stamina.max,
        color: '#5fd2a3'
      }
    ],
    initialPinnedIds: snapshot.sessionState.pinnedRecordIds,
    character: {
      sections: withSectionCounts(characterSections, characterCounts),
      overviewMetrics: [
        {
          id: 'level',
          label: 'Level',
          value: snapshot.playerState.progression.level.toString(),
          detail: `${snapshot.playerState.resources.xp.current.toLocaleString()} / ${snapshot.playerState.resources.xp.toNextLevel.toLocaleString()} XP`
        },
        {
          id: 'class-level',
          label: 'Class Level',
          value: snapshot.playerState.progression.classLevel.toString(),
          detail: snapshot.playerState.originProfile.classLabel ?? 'No active class growth profile'
        },
        {
          id: 'wallet',
          label: 'Wallet',
          value: `${formatCoin(snapshot.playerState.currency.gold)}g`,
          detail: `${snapshot.playerState.currency.silver}s ${snapshot.playerState.currency.copper}c liquid currency`
        },
        {
          id: 'inventory',
          label: 'Inventory',
          value: `${inventoryStackCount} / ${inventoryCapacity}`,
          detail: `${inventoryItemQuantity} total carried items`
        },
        {
          id: 'discoveries',
          label: 'Discoveries',
          value: snapshot.playerState.discoveryChronicle.entries.length.toString(),
          detail: discoverySummary
        },
        {
          id: 'reputation',
          label: 'Reputation',
          value: snapshot.playerState.reputation.length.toString(),
          detail: 'Tracked faction standings and access tiers'
        }
      ],
      coreStats: [
        { id: 'str', label: 'Strength', value: snapshot.playerState.attributes.STR.toString(), detail: 'Load, impact, and physical labor' },
        { id: 'agi', label: 'Agility', value: snapshot.playerState.attributes.AGI.toString(), detail: 'Movement speed, balance, and evasion' },
        { id: 'vit', label: 'Vitality', value: snapshot.playerState.attributes.VIT.toString(), detail: 'Endurance, recovery, and hardiness' },
        { id: 'spt', label: 'Spirit', value: snapshot.playerState.attributes.SPT.toString(), detail: 'Will, attunement, and magical stability' }
      ],
      activeEffects: Array.from(
        new Set([
          ...snapshot.playerState.activeEffects,
          ...snapshot.playerState.resourceRuntime.modifiers.map((modifier) => modifier.label)
        ])
      ),
      roleTags: [
        snapshot.playerState.originProfile.lineageLabel,
        snapshot.playerState.originProfile.classLabel ?? 'Classless',
        ...(snapshot.playerState.coreData.jobId ? [humanizeId(snapshot.playerState.coreData.jobId)] : []),
        ...snapshot.playerState.titles.filter((title) => title.equipped).map((title) => title.label)
      ],
      overviewDetail: {
        title: 'Runtime Bridge',
        summary:
          'Character overview now reads directly from player progression, origin growth, resource pools, inventory, discoveries, location, currency, reputation, and title state instead of a disconnected mock profile.',
        groups: [
          {
            title: 'Connected Systems',
            entries: [
              { label: 'Player State', value: 'Attributes, resources, skills, traits, inventory, equipment, discoveries' },
              { label: 'Session State', value: 'Tracked quest, pinned records, current activity, notifications' },
              { label: 'Clock', value: `Tick ${snapshot.clock.tick}` }
            ]
          },
          {
            title: 'Origin Profile',
            entries: [
              { label: 'Origin', value: formatOriginLabel(snapshot.playerState.originProfile) },
              ...(backgroundLabel ? [{ label: 'Background', value: backgroundLabel }] : []),
              {
                label: 'Attribute Variance',
                value: summarizeAttributeAdjustments(snapshot.playerState.originProfile.attributeAdjustments)
              },
              {
                label: 'Lineage Growth',
                value: formatResourceGrowth(snapshot.playerState.originProfile.lineageResourceGrowthPerLevel)
              },
              {
                label: 'Class Growth',
                value: formatResourceGrowth(snapshot.playerState.originProfile.classResourceGrowthPerClassLevel)
              },
              {
                label: 'Resolved Maxima',
                value: `HP ${snapshot.playerState.resources.hp.max} | MP ${snapshot.playerState.resources.mp.max} | STA ${snapshot.playerState.resources.stamina.max}`
              }
            ]
          },
          {
            title: 'Carry and Chronicle',
            entries: [
              { label: 'Wallet', value: formatWallet(snapshot) },
              { label: 'Inventory Usage', value: `${inventoryStackCount} / ${inventoryCapacity} slots` },
              { label: 'Equipped Slots', value: occupiedEquipmentSlots.toString() },
              {
                label: 'Discoveries',
                value: `${snapshot.playerState.discoveryChronicle.entries.length} entries | ${discoverySummary}`
              }
            ]
          },
          {
            title: 'Latest Resource Tick',
            entries: snapshot.playerState.resourceRuntime.lastBreakdown
              ? [
                  {
                    label: 'HP',
                    value: formatResourceTickEntry(snapshot.playerState.resourceRuntime.lastBreakdown.resources.hp)
                  },
                  {
                    label: 'MP',
                    value: formatResourceTickEntry(snapshot.playerState.resourceRuntime.lastBreakdown.resources.mp)
                  },
                  {
                    label: 'Stamina',
                    value: formatResourceTickEntry(snapshot.playerState.resourceRuntime.lastBreakdown.resources.stamina)
                  }
                ]
              : [{ label: 'Status', value: 'No resource breakdown recorded yet.' }]
          },
          {
            title: 'Remaining Work',
            entries: [
              { label: 'Combat Power', value: 'Needs formal derived-stat runtime rules' },
              { label: 'Equipment Stats', value: 'Needs authored item stat payloads' },
              { label: 'Inventory Metadata', value: 'Needs canonical item value and weight refs' },
              { label: 'Discovery Writes', value: 'Needs runtime emitters instead of demo session data' }
            ]
          }
        ]
      },
      lists: characterLists,
      windowDetails: characterWindowDetails
    },
    world: {
      sections: withSectionCounts(worldSections, worldCounts),
      locations: snapshot.sessionState.knownLocations.map((location) => ({
        id: location.id,
        name: location.name,
        x: location.x,
        y: location.y,
        type: location.type,
        region: location.regionLabel,
        note: location.note,
        known: location.known
      })),
      lists: worldLists,
      windowDetails: worldWindowDetails
    },
    activity: {
      sections: withSectionCounts(activitySections, activityCounts),
      metrics: [
        {
          id: 'operations',
          label: 'Active Operations',
          value: snapshot.sessionState.operations.length.toString(),
          detail: `${snapshot.sessionState.operations.filter((operation) => operation.priority === 'High').length} high priority`
        },
        {
          id: 'daily-revenue',
          label: 'Daily Revenue',
          value: '842',
          detail: 'Current bridge still reads revenue from session activity records'
        },
        {
          id: 'tracked-activity',
          label: 'Current Activity',
          value: snapshot.sessionState.currentActivity?.label ?? 'Idle',
          detail: snapshot.sessionState.currentActivity?.detail ?? 'No active process'
        }
      ],
      lists: activityLists,
      operationsQueue: snapshot.sessionState.operations.map((operation) => ({
        id: operation.id,
        title: operation.title,
        stage: operation.stage,
        progress: operation.progress,
        eta: operation.etaLabel,
        owner: operation.owner,
        output: operation.output,
        priority: operation.priority
      })),
      windowDetails: activityWindowDetails
    },
    codex: {
      sections: withSectionCounts(codexSections, codexCounts),
      entries: codexEntries,
      regionFilters: ['All Regions', ...new Set(snapshot.sessionState.codexEntries.flatMap((entry) => entry.regionTags))],
      windowDetails: codexWindowDetails
    },
    quests: {
      sections: withSectionCounts(questSections, questCounts),
      entries: questEntries,
      overviewMetrics: [
        {
          id: 'tracked',
          label: 'Tracked',
          value: snapshot.sessionState.questJournal.filter((entry) => entry.tracked).length.toString(),
          detail: 'Pinned to the top status bar'
        },
        {
          id: 'contracts',
          label: 'Contracts',
          value: snapshot.sessionState.questJournal.filter((entry) => entry.category === 'contracts').length.toString(),
          detail: 'Guild-style offers and shortfall jobs'
        },
        {
          id: 'completed',
          label: 'Completed',
          value: snapshot.sessionState.questJournal.filter((entry) => entry.category === 'completed').length.toString(),
          detail: 'Archived with rewards and location links'
        }
      ],
      windowDetails: questWindowDetails
    },
    chronicle: {
      sections: withSectionCounts(chronicleSections, chronicleCounts),
      entries: chronicleEntries,
      windowDetails: chronicleWindowDetails
    }
  };
}
