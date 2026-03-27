import {
  applyAttributeAdjustments,
  createEmptyPlayerResourceRuntimeState,
  resolvePlayerOriginProfile,
  resolvePlayerResources,
  type EquipmentState,
  type InventoryStack,
  type PlayerAttributes,
  type PlayerCurrencyState,
  type PlayerResourceGrowthVector,
  type PlayerSkillState,
  type PlayerTraitState,
  type SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import {
  deserializeSnapshot,
  serializeSnapshot
} from '../../../../packages/shared/persistence/src/index.js';
import type { CharacterCreationFormState } from './characterCreationForm.js';
import {
  getStarterBackgroundTemplate,
  getStarterClassTemplate
} from './starterTemplates.js';
import { resolveWorldSelection } from './worldSelectionCatalog.js';
import { demoSnapshot } from '../runtime/demoSnapshot.js';

type DerivedCharacterCreationState = {
  backgroundLabel: string;
  startingContinentLabel: string;
  startingSettlementLabel: string;
  startingRegionLabel: string;
  chosenOriginLabel: string;
  attributes: PlayerAttributes;
  resources: {
    hp: number;
    mp: number;
    stamina: number;
  };
  skills: PlayerSkillState[];
  traits: PlayerTraitState[];
  inventory: InventoryStack[];
  currency: PlayerCurrencyState;
  gearLabels: string[];
  starterPackLabels: string[];
  starterSkillLabels: string[];
  starterTraitLabels: string[];
  starterNotes: string[];
  snapshot: SaveSnapshot;
};

export type CharacterCreationPreview = {
  characterName: string;
  chosenOrigin: string;
  backgroundLabel: string;
  startingContinent: string;
  startingSettlement: string;
  startingRegion: string;
  attributes: PlayerAttributes;
  resourceMaxima: PlayerResourceGrowthVector;
  starterSkills: string[];
  starterTraits: string[];
  starterGear: string[];
  starterPack: string[];
  walletLabel: string;
  starterNotes: string[];
};

const EMPTY_EQUIPMENT: EquipmentState = {
  'slot.weapon.left': null,
  'slot.weapon.right': null,
  'slot.armor.head': null,
  'slot.armor.shoulder': null,
  'slot.armor.chest': null,
  'slot.armor.arm': null,
  'slot.armor.hand': null,
  'slot.armor.waist': null,
  'slot.armor.leg': null,
  'slot.armor.foot': null,
  'slot.accessory.ear': null,
  'slot.accessory.eyes': null,
  'slot.accessory.neck': null,
  'slot.accessory.arms': null,
  'slot.accessory.fingers': null,
  'slot.accessory.waist': null,
  'slot.accessory.ankle': null
};

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

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

function formatWallet(currency: PlayerCurrencyState): string {
  return `${currency.gold}g ${currency.silver}s ${currency.copper}c`;
}

function slugifyPlayerName(playerName: string): string {
  return (
    playerName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'new_adventurer'
  );
}

function mergeCurrency(
  left: PlayerCurrencyState,
  right: PlayerCurrencyState
): PlayerCurrencyState {
  return {
    gold: left.gold + right.gold,
    silver: left.silver + right.silver,
    copper: left.copper + right.copper
  };
}

function mergeSkills(
  primary: PlayerSkillState[],
  secondary: PlayerSkillState[]
): PlayerSkillState[] {
  const byId = new Map<string, PlayerSkillState>();

  for (const skill of [...primary, ...secondary]) {
    const current = byId.get(skill.id);

    if (!current) {
      byId.set(skill.id, { ...skill });
      continue;
    }

    byId.set(skill.id, {
      ...current,
      rank: current.rank + skill.rank,
      source: current.source === 'trained' || skill.source === 'trained' ? 'trained' : skill.source
    });
  }

  return Array.from(byId.values()).sort((left, right) => {
    if (right.rank !== left.rank) {
      return right.rank - left.rank;
    }

    return left.id.localeCompare(right.id);
  });
}

function mergeInventoryStacks(
  primary: InventoryStack[],
  secondary: InventoryStack[]
): InventoryStack[] {
  const byKey = new Map<string, InventoryStack>();

  for (const stack of [...primary, ...secondary]) {
    const mapKey = `${stack.itemId}.${stack.itemKey}`;
    const current = byKey.get(mapKey);

    if (!current) {
      byKey.set(mapKey, { ...stack });
      continue;
    }

    byKey.set(mapKey, {
      ...current,
      quantity: current.quantity + stack.quantity
    });
  }

  return Array.from(byKey.values()).sort((left, right) => left.itemKey.localeCompare(right.itemKey));
}

function buildStarterTraits(
  lineageId: string,
  classId: string,
  backgroundTraitIds: string[],
  settlementTraitIds: string[]
): PlayerTraitState[] {
  const lineageSegments = lineageId.split('.');
  const lineageKey = lineageSegments[lineageSegments.length - 1] ?? 'unknown';
  const classSegments = classId.split('.');
  const classKey = classSegments[classSegments.length - 1] ?? 'unknown';
  const uniqueTraitIds = Array.from(
    new Set([
      `trait.${lineageKey}_heritage`,
      `trait.${classKey}_training`,
      ...backgroundTraitIds,
      ...settlementTraitIds
    ])
  );

  return uniqueTraitIds.map((traitId, index) => ({
    id: traitId,
    source: index < 2 ? (index === 0 ? 'lineage' : 'class') : 'story'
  }));
}

function buildStarterEquipment(classId: string): EquipmentState {
  return {
    ...EMPTY_EQUIPMENT,
    ...getStarterClassTemplate(classId).equipment
  };
}

function buildStarterInventory(
  classId: string,
  backgroundId: string
) {
  const classTemplate = getStarterClassTemplate(classId);
  const backgroundTemplate = getStarterBackgroundTemplate(backgroundId);

  return {
    bags: [
      {
        id: 'bag.traveler_satchel',
        label: 'Traveler Satchel',
        slotCapacity: 20,
        stacks: mergeInventoryStacks(
          classTemplate.inventory,
          backgroundTemplate.inventoryBonuses
        )
      }
    ],
    overflow: []
  };
}

function buildStarterSessionState(
  playerName: string,
  form: CharacterCreationFormState,
  selectedWorld: NonNullable<ReturnType<typeof resolveWorldSelection>>
): SaveSnapshot['sessionState'] {
  const backgroundTemplate = getStarterBackgroundTemplate(form.backgroundId);
  const settlementRecord = selectedWorld.settlementRecord;
  const locationType =
    settlementRecord.settlementType === 'fort' || settlementRecord.settlementType === 'citadel'
      ? 'fort'
      : settlementRecord.settlementType === 'harbor_town' || settlementRecord.settlementType === 'port_city'
        ? 'harbor'
        : 'settlement';
  const knownLocations = [
    {
      id: settlementRecord.id,
      name: settlementRecord.name,
      regionLabel: selectedWorld.region.label,
      type: locationType,
      x: settlementRecord.visualMapRef?.pixelX ?? 0,
      y: settlementRecord.visualMapRef?.pixelY ?? 0,
      note: settlementRecord.summary,
      known: true
    }
  ];
  const worldRecords = [
    {
      id: selectedWorld.continent.id,
      sectionId: 'world.continent',
      title: selectedWorld.continent.label,
      summary: selectedWorld.continent.description,
      tags: selectedWorld.continent.biomeMix,
      detailEntries: [
        { label: 'Climate', value: selectedWorld.continent.climate },
        { label: 'Survivability', value: selectedWorld.continent.survivabilityLabel }
      ]
    },
    {
      id: selectedWorld.region.id,
      sectionId: 'world.region',
      title: selectedWorld.region.label,
      subtitle: selectedWorld.continent.label,
      summary: selectedWorld.region.description,
      tags: selectedWorld.region.resourceAvailability,
      detailEntries: [
        { label: 'Terrain', value: selectedWorld.region.terrainAndBiome },
        { label: 'Density', value: selectedWorld.region.populationDensity }
      ]
    },
    {
      id: selectedWorld.settlement.id,
      sectionId: 'world.settlement',
      title: selectedWorld.settlement.label,
      subtitle: selectedWorld.region.label,
      summary: selectedWorld.settlement.description,
      tags: selectedWorld.settlement.dominantIndustries,
      detailEntries: [
        { label: 'Population', value: selectedWorld.settlement.populationSize },
        { label: 'Trade Role', value: selectedWorld.settlement.tradeRole },
        { label: 'Authority', value: selectedWorld.settlement.landAuthorityType.replace(/_/g, ' ') }
      ]
    }
  ];
  const activityRecords = [
    {
      id: `activity.start.${settlementRecord.id}`,
      sectionId: 'activity.start',
      title: `Arrival at ${settlementRecord.name}`,
      summary: selectedWorld.settlement.access.notes[0] ?? settlementRecord.summary,
      tags: selectedWorld.settlement.dominantIndustries,
      detailEntries: [
        { label: 'Spawn Mode', value: selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ') },
        { label: 'Lodging', value: selectedWorld.settlement.access.lodgingType.replace(/_/g, ' ') }
      ]
    }
  ];

  return {
    activeEvents: ['event.campaign.started'],
    flags: [
      'campaign.new_game',
      `character.background.${backgroundTemplate.id}`,
      `character.start.${settlementRecord.id}`,
      `character.continent.${selectedWorld.continent.id}`,
      `character.region.${selectedWorld.region.id}`
    ],
    triggers: [],
    completedEvents: [],
    trackedQuestId: null,
    currentActivity: {
      id: `activity.arrival.${settlementRecord.id}`,
      label: `Arriving in ${settlementRecord.name}`,
      category: 'Arrival',
      detail: `${selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ')} into ${settlementRecord.name}.`
    },
    pinnedRecordIds: [],
    notifications: [
      {
        id: 'note.new_game',
        title: `${settlementRecord.name} arrival`,
        detail: `${playerName} begins as a ${backgroundTemplate.label} at ${settlementRecord.name}.`,
        timeLabel: 'Just now',
        tone: 'accent'
      }
    ],
    knownLocations,
    worldRecords,
    activityRecords,
    operations: [],
    codexEntries: [],
    questJournal: [],
    chronicle: [
      {
        id: 'chronicle.campaign_started',
        category: 'social',
        title: `${playerName} began as a ${backgroundTemplate.label}`,
        timeLabel: 'Just now',
        summary: `${playerName} opens the campaign from ${settlementRecord.name} in the ${selectedWorld.region.label}.`,
        statusLabel: 'Campaign started',
        entities: [playerName, settlementRecord.name, backgroundTemplate.label],
        results: ['Starter state generated', selectedWorld.settlement.access.spawnMode.replace(/_/g, ' ')],
        statChanges: ['Save slot created', `Origin set to ${backgroundTemplate.label}`],
        tags: [selectedWorld.region.label, selectedWorld.continent.label, 'New Game']
      }
    ]
  };
}

function deriveCharacterCreationState(
  form: CharacterCreationFormState
): DerivedCharacterCreationState {
  const baseSnapshot = cloneSnapshot(demoSnapshot);
  const classTemplate = getStarterClassTemplate(form.classId);
  const backgroundTemplate = getStarterBackgroundTemplate(form.backgroundId);
  const selectedWorld = resolveWorldSelection({
    continentId: form.continentId,
    regionId: form.regionId,
    settlementId: form.startingSettlementId,
    classId: form.classId,
    backgroundId: form.backgroundId
  });

  if (!selectedWorld) {
    throw new Error('Cannot create a new game without a valid world selection.');
  }

  if (selectedWorld.settlement.access.accessStatus !== 'allowed') {
    throw new Error(selectedWorld.settlement.access.notes[0] ?? 'Selected settlement start is restricted.');
  }

  const settlementTraitIds = [
    `trait.${selectedWorld.settlementRecord.terrainContext}`,
    `trait.${selectedWorld.settlement.tradeRole.toLowerCase()}_start`
  ];
  const progression = {
    level: 1,
    classLevel: 1,
    unspentAttributePoints: 0,
    unspentSkillPoints: 0
  };
  const playerName = form.playerName.trim();
  const originProfile = resolvePlayerOriginProfile(
    {
      lineageId: form.lineageId,
      classId: form.classId,
      sexId: form.sexId
    },
    progression
  );
  const baseAttributes = applyAttributeAdjustments(
    classTemplate.baseAttributes,
    originProfile.attributeAdjustments
  );
  const attributes = applyAttributeAdjustments(
    baseAttributes,
    backgroundTemplate.attributeAdjustments
  );
  const equipment = buildStarterEquipment(form.classId);
  const inventory = buildStarterInventory(form.classId, form.backgroundId);
  const skills = mergeSkills(classTemplate.skills, backgroundTemplate.skillBonuses);
  const traits = buildStarterTraits(
    form.lineageId,
    form.classId,
    backgroundTemplate.traitIds,
    settlementTraitIds
  );
  const currency = mergeCurrency(classTemplate.currency, backgroundTemplate.currencyBonus);
  const resourceRuntime = createEmptyPlayerResourceRuntimeState();
  const playerId = `player.${slugifyPlayerName(playerName)}`;
  const resourceResolution = resolvePlayerResources(
    {
      playerId,
      attributes,
      resources: {
        hp: {
          current: originProfile.resolvedResourceMaxima.hp,
          max: originProfile.resolvedResourceMaxima.hp
        },
        mp: {
          current: originProfile.resolvedResourceMaxima.mp,
          max: originProfile.resolvedResourceMaxima.mp
        },
        stamina: {
          current: originProfile.resolvedResourceMaxima.stamina,
          max: originProfile.resolvedResourceMaxima.stamina
        },
        xp: {
          current: 0,
          total: 0,
          toNextLevel: 1000
        }
      },
      originProfile,
      equipment,
      resourceRuntime
    },
    [],
    baseSnapshot.clock.tick
  );
  const sessionState = buildStarterSessionState(playerName, form, selectedWorld);
  const activeQuestIds = sessionState.questJournal
    .filter((entry) => entry.category === 'active' || entry.category === 'contracts')
    .map((entry) => entry.id);
  const completedQuestIds = sessionState.questJournal
    .filter((entry) => entry.category === 'completed')
    .map((entry) => entry.id);
  const snapshot: SaveSnapshot = {
    ...baseSnapshot,
    playerState: {
      ...baseSnapshot.playerState,
      playerId,
      regionId: selectedWorld.region.id,
      coreData: {
        playerName,
        lineageId: form.lineageId,
        sexId: form.sexId,
        classId: form.classId,
        jobId: backgroundTemplate.jobId
      },
      attributes,
      resources: resourceResolution.resources,
      resourceRuntime: resourceResolution.resourceRuntime,
      progression,
      skills,
      spells: classTemplate.spells,
      abilities: classTemplate.abilities,
      traits,
      equipment,
      inventory,
      activeEffects: [],
      location: {
        settlementId: selectedWorld.settlement.id,
        siteLabel: selectedWorld.settlement.label,
        worldMapId: selectedWorld.settlementRecord.visualMapRef?.mapId ?? null,
        knownSettlementIds: [selectedWorld.settlement.id]
      },
      currency,
      originProfile,
      reputation: [],
      titles: [],
      discoveryChronicle: {
        entries: [],
        lastUpdatedTick: null
      },
      discoveredRegions: [selectedWorld.region.id],
      activeQuestIds,
      completedQuestIds,
      flags: [
        'player.new_game',
        `player.background.${backgroundTemplate.id}`,
        `player.start.${selectedWorld.settlement.id}`,
        `player.start_authority.${selectedWorld.settlement.landAuthorityType}`,
        `player.start_mode.${selectedWorld.settlement.access.spawnMode}`
      ],
      saveMeta: {
        totalPlayTicks: 0,
        lastRestAtTick: baseSnapshot.clock.tick,
        lastSavedAtTick: baseSnapshot.clock.tick
      }
    },
    worldState: {
      ...baseSnapshot.worldState,
      activeRegions: Array.from(
        new Set([selectedWorld.region.id, ...baseSnapshot.worldState.activeRegions])
      )
    },
    sessionState
  };

  return {
    backgroundLabel: backgroundTemplate.label,
    startingContinentLabel: selectedWorld.continent.label,
    startingSettlementLabel: selectedWorld.settlement.label,
    startingRegionLabel: selectedWorld.region.label,
    chosenOriginLabel: `${backgroundTemplate.label} of ${selectedWorld.settlement.label}`,
    attributes,
    resources: {
      hp: resourceResolution.resources.hp.max,
      mp: resourceResolution.resources.mp.max,
      stamina: resourceResolution.resources.stamina.max
    },
    skills,
    traits,
    inventory: inventory.bags[0]?.stacks ?? [],
    currency,
    gearLabels: Object.values(equipment).flatMap((item) => (item ? [humanizeId(item.itemKey)] : [])),
    starterPackLabels: (inventory.bags[0]?.stacks ?? []).map(
      (item) => `${humanizeId(item.itemKey)} x${item.quantity}`
    ),
    starterSkillLabels: skills.map((skill) => `${humanizeId(skill.id)} ${skill.rank}`),
    starterTraitLabels: traits.map((trait) => humanizeId(trait.id)),
    starterNotes: [
      ...originProfile.notes.slice(0, 2),
      backgroundTemplate.description,
      selectedWorld.settlement.description,
      selectedWorld.settlement.access.notes[0] ?? ''
    ],
    snapshot
  };
}

export function buildCharacterCreationPreview(
  form: CharacterCreationFormState
): CharacterCreationPreview {
  try {
    const derived = deriveCharacterCreationState(form);

    return {
      characterName: form.playerName.trim() || 'Unnamed Adventurer',
      chosenOrigin: derived.chosenOriginLabel,
      backgroundLabel: derived.backgroundLabel,
      startingContinent: derived.startingContinentLabel,
      startingSettlement: derived.startingSettlementLabel,
      startingRegion: derived.startingRegionLabel,
      attributes: derived.attributes,
      resourceMaxima: {
        hp: derived.resources.hp,
        mp: derived.resources.mp,
        stamina: derived.resources.stamina
      },
      starterSkills: derived.starterSkillLabels,
      starterTraits: derived.starterTraitLabels,
      starterGear: derived.gearLabels,
      starterPack: derived.starterPackLabels,
      walletLabel: formatWallet(derived.currency),
      starterNotes: derived.starterNotes.filter((note) => note.trim().length > 0)
    };
  } catch (error) {
    const classTemplate = getStarterClassTemplate(form.classId);
    const backgroundTemplate = getStarterBackgroundTemplate(form.backgroundId);
    const selectedWorld = resolveWorldSelection({
      continentId: form.continentId,
      regionId: form.regionId,
      settlementId: form.startingSettlementId,
      classId: form.classId,
      backgroundId: form.backgroundId
    });
    const originProfile = resolvePlayerOriginProfile(
      {
        lineageId: form.lineageId,
        classId: form.classId,
        sexId: form.sexId
      },
      {
        level: 1,
        classLevel: 1,
        unspentAttributePoints: 0,
        unspentSkillPoints: 0
      }
    );
    const attributes = applyAttributeAdjustments(
      applyAttributeAdjustments(classTemplate.baseAttributes, originProfile.attributeAdjustments),
      backgroundTemplate.attributeAdjustments
    );
    const currency = mergeCurrency(classTemplate.currency, backgroundTemplate.currencyBonus);
    const inventory = buildStarterInventory(form.classId, form.backgroundId);

    return {
      characterName: form.playerName.trim() || 'Unnamed Adventurer',
      chosenOrigin: `${backgroundTemplate.label} of ${selectedWorld?.settlement.label ?? 'Unknown Start'}`,
      backgroundLabel: backgroundTemplate.label,
      startingContinent: selectedWorld?.continent.label ?? 'Unknown Continent',
      startingSettlement: selectedWorld?.settlement.label ?? 'Unknown Settlement',
      startingRegion: selectedWorld?.region.label ?? 'Unknown Region',
      attributes,
      resourceMaxima: originProfile.resolvedResourceMaxima,
      starterSkills: classTemplate.skills.map((skill) => `${humanizeId(skill.id)} ${skill.rank}`),
      starterTraits: backgroundTemplate.traitIds.map((traitId) => humanizeId(traitId)),
      starterGear: Object.values(buildStarterEquipment(form.classId)).flatMap((item) => (item ? [humanizeId(item.itemKey)] : [])),
      starterPack: (inventory.bags[0]?.stacks ?? []).map((item) => `${humanizeId(item.itemKey)} x${item.quantity}`),
      walletLabel: formatWallet(currency),
      starterNotes: [
        backgroundTemplate.description,
        selectedWorld?.settlement.access.notes[0] ?? 'Select a legal start to finalize the campaign.',
        error instanceof Error ? error.message : 'Preview fallback active.'
      ]
    };
  }
}

export function createNewGameSnapshot(
  form: CharacterCreationFormState
): SaveSnapshot {
  return deriveCharacterCreationState({
    ...form,
    playerName: form.playerName.trim()
  }).snapshot;
}
